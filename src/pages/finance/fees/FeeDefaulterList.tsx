import React, { useState, createElement } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Download,
  Mail,
  MessageSquare,
  Phone,
  Filter,
  X,
  FileText,
  Send,
  AlertCircle,
  TrendingUp,
  Calendar,
  Search,
  Printer,
  Users } from
'lucide-react';
import { ReportFilters } from '../../../components/ReportFilters';
interface Defaulter {
  id: string;
  studentId: string;
  student: string;
  class: string;
  section: string;
  rollNumber: string;
  dueAmount: number;
  totalFees: number;
  paidAmount: number;
  daysOverdue: number;
  lastPaymentDate: string;
  parent: string;
  contact: string;
  email: string;
  address: string;
  status: 'Critical' | 'Warning' | 'Moderate';
  lastReminderSent: string;
  reminderCount: number;
}
export function FeeDefaulterList() {
  const [selectedDefaulters, setSelectedDefaulters] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    class: '',
    section: '',
    minDueAmount: '',
    minDaysOverdue: '',
    status: ''
  });
  const defaulters: Defaulter[] = [
  {
    id: '1',
    studentId: 'STU001',
    student: 'Rahul Sharma',
    class: '10',
    section: 'A',
    rollNumber: '15',
    dueAmount: 25000,
    totalFees: 50000,
    paidAmount: 25000,
    daysOverdue: 45,
    lastPaymentDate: '2024-01-15',
    parent: 'Suresh Sharma',
    contact: '9876543210',
    email: 'suresh.sharma@email.com',
    address: '123, MG Road, Mumbai',
    status: 'Critical',
    lastReminderSent: '2024-02-20',
    reminderCount: 3
  },
  {
    id: '2',
    studentId: 'STU002',
    student: 'Priya Patel',
    class: '10',
    section: 'A',
    rollNumber: '08',
    dueAmount: 15000,
    totalFees: 50000,
    paidAmount: 35000,
    daysOverdue: 30,
    lastPaymentDate: '2024-01-30',
    parent: 'Raj Patel',
    contact: '9876543211',
    email: 'raj.patel@email.com',
    address: '456, Park Street, Mumbai',
    status: 'Warning',
    lastReminderSent: '2024-02-25',
    reminderCount: 2
  },
  {
    id: '3',
    studentId: 'STU003',
    student: 'Amit Kumar',
    class: '9',
    section: 'B',
    rollNumber: '12',
    dueAmount: 8000,
    totalFees: 45000,
    paidAmount: 37000,
    daysOverdue: 20,
    lastPaymentDate: '2024-02-10',
    parent: 'Vijay Kumar',
    contact: '9876543212',
    email: 'vijay.kumar@email.com',
    address: '789, Station Road, Mumbai',
    status: 'Moderate',
    lastReminderSent: '2024-03-01',
    reminderCount: 1
  },
  {
    id: '4',
    studentId: 'STU004',
    student: 'Sneha Desai',
    class: '11',
    section: 'A',
    rollNumber: '05',
    dueAmount: 30000,
    totalFees: 60000,
    paidAmount: 30000,
    daysOverdue: 60,
    lastPaymentDate: '2024-01-01',
    parent: 'Mahesh Desai',
    contact: '9876543213',
    email: 'mahesh.desai@email.com',
    address: '321, Hill Road, Mumbai',
    status: 'Critical',
    lastReminderSent: '2024-02-15',
    reminderCount: 4
  },
  {
    id: '5',
    studentId: 'STU005',
    student: 'Rohan Mehta',
    class: '8',
    section: 'C',
    rollNumber: '22',
    dueAmount: 12000,
    totalFees: 40000,
    paidAmount: 28000,
    daysOverdue: 25,
    lastPaymentDate: '2024-02-05',
    parent: 'Kiran Mehta',
    contact: '9876543214',
    email: 'kiran.mehta@email.com',
    address: '654, Beach Road, Mumbai',
    status: 'Warning',
    lastReminderSent: '2024-02-28',
    reminderCount: 2
  }];

  // Calculate statistics
  const stats = {
    totalDefaulters: defaulters.length,
    totalDueAmount: defaulters.reduce((sum, d) => sum + d.dueAmount, 0),
    criticalCases: defaulters.filter((d) => d.status === 'Critical').length,
    averageDaysOverdue: Math.round(
      defaulters.reduce((sum, d) => sum + d.daysOverdue, 0) / defaulters.length
    )
  };
  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDefaulters(defaulters.map((d) => d.id));
    } else {
      setSelectedDefaulters([]);
    }
  };
  // Handle individual selection
  const handleSelectDefaulter = (id: string) => {
    setSelectedDefaulters((prev) =>
    prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  // Export functions
  const exportToCSV = () => {
    const headers = [
    'Student ID',
    'Student Name',
    'Class',
    'Section',
    'Roll Number',
    'Parent Name',
    'Contact',
    'Email',
    'Total Fees',
    'Paid Amount',
    'Due Amount',
    'Days Overdue',
    'Last Payment Date',
    'Status',
    'Reminder Count',
    'Address'];

    const dataToExport =
    selectedDefaulters.length > 0 ?
    defaulters.filter((d) => selectedDefaulters.includes(d.id)) :
    defaulters;
    const csvContent = [
    headers.join(','),
    ...dataToExport.map((d) =>
    [
    d.studentId,
    `"${d.student}"`,
    d.class,
    d.section,
    d.rollNumber,
    `"${d.parent}"`,
    d.contact,
    d.email,
    d.totalFees,
    d.paidAmount,
    d.dueAmount,
    d.daysOverdue,
    d.lastPaymentDate,
    d.status,
    d.reminderCount,
    `"${d.address}"`].
    join(',')
    )].
    join('\n');
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `fee_defaulters_${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const exportToPDF = () => {
    // This would typically use a library like jsPDF
    alert('PDF export functionality would be implemented here');
  };
  const exportToExcel = () => {
    // This would typically use a library like xlsx
    alert('Excel export functionality would be implemented here');
  };
  const sendBulkReminder = (type: 'sms' | 'email' | 'whatsapp') => {
    const count =
    selectedDefaulters.length > 0 ?
    selectedDefaulters.length :
    defaulters.length;
    alert(`Sending ${type.toUpperCase()} reminder to ${count} defaulters`);
  };
  const printList = () => {
    window.print();
  };
  const columns = [
  {
    key: 'select',
    header:
    <input
      type="checkbox"
      className="rounded border-gray-300"
      checked={selectedDefaulters.length === defaulters.length}
      onChange={(e) => handleSelectAll(e.target.checked)} />,


    render: (row: Defaulter) =>
    <input
      type="checkbox"
      className="rounded border-gray-300"
      checked={selectedDefaulters.includes(row.id)}
      onChange={() => handleSelectDefaulter(row.id)} />


  },
  {
    key: 'student',
    header: 'Student Details',
    render: (row: Defaulter) =>
    <div>
          <div className="font-medium text-gray-900">{row.student}</div>
          <div className="text-xs text-gray-500">
            ID: {row.studentId} | Class {row.class}-{row.section} | Roll:{' '}
            {row.rollNumber}
          </div>
        </div>

  },
  {
    key: 'fees',
    header: 'Fee Details',
    render: (row: Defaulter) =>
    <div className="text-sm">
          <div className="flex justify-between gap-2">
            <span className="text-gray-600">Total:</span>
            <span className="font-medium">
              ₹{row.totalFees.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-gray-600">Paid:</span>
            <span className="text-green-600">
              ₹{row.paidAmount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between gap-2 border-t pt-1 mt-1">
            <span className="text-gray-600">Due:</span>
            <span className="font-bold text-red-600">
              ₹{row.dueAmount.toLocaleString()}
            </span>
          </div>
        </div>

  },
  {
    key: 'overdue',
    header: 'Overdue Info',
    render: (row: Defaulter) =>
    <div className="text-sm">
          <div className="font-medium text-gray-900">
            {row.daysOverdue} Days
          </div>
          <div className="text-xs text-gray-500">
            Last Paid: {new Date(row.lastPaymentDate).toLocaleDateString()}
          </div>
        </div>

  },
  {
    key: 'parent',
    header: 'Parent Contact',
    render: (row: Defaulter) =>
    <div className="text-sm">
          <div className="font-medium text-gray-900">{row.parent}</div>
          <div className="text-blue-600">{row.contact}</div>
          <div className="text-xs text-gray-500">{row.email}</div>
        </div>

  },
  {
    key: 'reminders',
    header: 'Reminders',
    render: (row: Defaulter) =>
    <div className="text-sm">
          <div className="text-gray-900">Sent: {row.reminderCount}</div>
          <div className="text-xs text-gray-500">
            Last: {new Date(row.lastReminderSent).toLocaleDateString()}
          </div>
        </div>

  },
  {
    key: 'status',
    header: 'Risk',
    render: (row: Defaulter) =>
    <Badge
      variant={
      row.status === 'Critical' ?
      'danger' :
      row.status === 'Warning' ?
      'warning' :
      'default'
      }>

          {row.status}
        </Badge>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: Defaulter) =>
    <div className="flex gap-1">
          <Button
        variant="ghost"
        size="sm"
        title="Send WhatsApp"
        onClick={() => alert(`Sending WhatsApp to ${row.student}'s parent`)}>

            <MessageSquare className="w-4 h-4 text-green-600" />
          </Button>
          <Button
        variant="ghost"
        size="sm"
        title="Send Email"
        onClick={() => alert(`Sending email to ${row.email}`)}>

            <Mail className="w-4 h-4 text-blue-600" />
          </Button>
          <Button
        variant="ghost"
        size="sm"
        title="Call"
        onClick={() => alert(`Calling ${row.contact}`)}>

            <Phone className="w-4 h-4 text-gray-600" />
          </Button>
          <Button
        variant="ghost"
        size="sm"
        title="View Details"
        onClick={() => alert(`Viewing details for ${row.student}`)}>

            <FileText className="w-4 h-4 text-purple-600" />
          </Button>
        </div>

  }];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Fee Defaulter Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track, monitor, and follow up with fee defaulters effectively
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={printList}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      <ReportFilters />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">
                Total Defaulters
              </p>
              <p className="text-2xl font-bold text-red-900 mt-1">
                {stats.totalDefaulters}
              </p>
            </div>
            <Users className="w-8 h-8 text-red-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">
                Total Due Amount
              </p>
              <p className="text-2xl font-bold text-orange-900 mt-1">
                ₹{stats.totalDueAmount.toLocaleString()}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">
                Critical Cases
              </p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">
                {stats.criticalCases}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">
                Avg. Days Overdue
              </p>
              <p className="text-2xl font-bold text-purple-900 mt-1">
                {stats.averageDaysOverdue}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="p-6">
        {/* Search and Filter Section */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by student name, parent name, or contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-4 h-4" />} />

            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Select
              label="Class"
              options={[
              {
                value: '',
                label: 'All Classes'
              },
              {
                value: '8',
                label: 'Class 8'
              },
              {
                value: '9',
                label: 'Class 9'
              },
              {
                value: '10',
                label: 'Class 10'
              },
              {
                value: '11',
                label: 'Class 11'
              },
              {
                value: '12',
                label: 'Class 12'
              }]
              }
              value={filters.class}
              onChange={(e) =>
              setFilters({
                ...filters,
                class: e.target.value
              })
              } />


            <Select
              label="Section"
              options={[
              {
                value: '',
                label: 'All Sections'
              },
              {
                value: 'A',
                label: 'Section A'
              },
              {
                value: 'B',
                label: 'Section B'
              },
              {
                value: 'C',
                label: 'Section C'
              }]
              }
              value={filters.section}
              onChange={(e) =>
              setFilters({
                ...filters,
                section: e.target.value
              })
              } />


            <Select
              label="Min Due Amount"
              options={[
              {
                value: '',
                label: 'Any Amount'
              },
              {
                value: '5000',
                label: '₹5,000+'
              },
              {
                value: '10000',
                label: '₹10,000+'
              },
              {
                value: '20000',
                label: '₹20,000+'
              },
              {
                value: '30000',
                label: '₹30,000+'
              }]
              }
              value={filters.minDueAmount}
              onChange={(e) =>
              setFilters({
                ...filters,
                minDueAmount: e.target.value
              })
              } />


            <Select
              label="Min Days Overdue"
              options={[
              {
                value: '',
                label: 'Any Days'
              },
              {
                value: '15',
                label: '15+ Days'
              },
              {
                value: '30',
                label: '30+ Days'
              },
              {
                value: '45',
                label: '45+ Days'
              },
              {
                value: '60',
                label: '60+ Days'
              }]
              }
              value={filters.minDaysOverdue}
              onChange={(e) =>
              setFilters({
                ...filters,
                minDaysOverdue: e.target.value
              })
              } />


            <Select
              label="Risk Status"
              options={[
              {
                value: '',
                label: 'All Status'
              },
              {
                value: 'Critical',
                label: 'Critical'
              },
              {
                value: 'Warning',
                label: 'Warning'
              },
              {
                value: 'Moderate',
                label: 'Moderate'
              }]
              }
              value={filters.status}
              onChange={(e) =>
              setFilters({
                ...filters,
                status: e.target.value
              })
              } />

          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-600">
              {selectedDefaulters.length > 0 &&
              <span className="font-medium">
                  {selectedDefaulters.length} defaulter(s) selected
                </span>
              }
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                setFilters({
                  class: '',
                  section: '',
                  minDueAmount: '',
                  minDaysOverdue: '',
                  status: ''
                })
                }>

                <X className="w-4 h-4 mr-1" />
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Bulk Actions */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700">
              Bulk Actions:
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => sendBulkReminder('whatsapp')}
              disabled={selectedDefaulters.length === 0}>

              <MessageSquare className="w-4 h-4 mr-2" />
              Send WhatsApp
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => sendBulkReminder('email')}
              disabled={selectedDefaulters.length === 0}>

              <Mail className="w-4 h-4 mr-2" />
              Send Email
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => sendBulkReminder('sms')}
              disabled={selectedDefaulters.length === 0}>

              <Send className="w-4 h-4 mr-2" />
              Send SMS
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700">Export:</span>
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={exportToExcel}>
              <Download className="w-4 h-4 mr-2" />
              Excel
            </Button>
            <Button variant="outline" size="sm" onClick={exportToPDF}>
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
      </Card>

      {/* Defaulters Table */}
      <Card className="p-6">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Defaulter List ({defaulters.length})
          </h2>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table columns={columns} data={defaulters} />
        </div>
      </Card>

      {/* Info Card */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">Important Notes:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>
                Critical status indicates defaulters with 45+ days overdue or
                ₹20,000+ due amount
              </li>
              <li>
                Warning status indicates defaulters with 30+ days overdue or
                ₹10,000+ due amount
              </li>
              <li>
                Automated reminders are sent every 7 days for critical cases
              </li>
              <li>
                Parents can be contacted via WhatsApp, Email, or SMS directly
                from this panel
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>);

}