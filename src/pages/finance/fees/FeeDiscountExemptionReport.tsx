import React, { useState, useRef, createElement } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Download,
  Filter,
  Tag,
  Printer,
  FileText,
  PieChart,
  BarChart3,
  TrendingDown,
  Users,
  Award,
  Percent,
  Calendar,
  Search,
  X,
  Eye,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  File,
  CheckCircle,
  Clock,
  UserCheck,
  Building,
  GraduationCap,
  Heart,
  Star,
  Briefcase } from
'lucide-react';
import { ReportFilters } from '../../../components/ReportFilters';
interface DiscountRecord {
  id: string;
  studentId: string;
  student: string;
  class: string;
  section: string;
  rollNumber: string;
  type: string;
  category: 'Discount' | 'Exemption' | 'Scholarship' | 'Waiver';
  amount: number;
  percentage: number;
  originalFee: number;
  finalFee: number;
  reason: string;
  approvedBy: string;
  approverRole: string;
  applicationDate: string;
  approvalDate: string;
  validFrom: string;
  validTo: string;
  status: 'Active' | 'Expired' | 'Pending' | 'Revoked';
  documents: string[];
  parentName: string;
  contact: string;
}
interface TypeBreakdown {
  type: string;
  icon: React.ReactNode;
  count: number;
  totalAmount: number;
  avgAmount: number;
  percentage: number;
  color: string;
  bgColor: string;
}
export function FeeDiscountExemptionReport() {
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [expandedType, setExpandedType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'detailed' | 'analysis'>(
    'overview');
  const [filters, setFilters] = useState({
    category: '',
    type: '',
    class: '',
    status: '',
    approvedBy: '',
    dateFrom: '',
    dateTo: ''
  });
  const printRef = useRef<HTMLDivElement>(null);
  // Comprehensive discount data
  const discountData: DiscountRecord[] = [
  {
    id: '1',
    studentId: 'STU001',
    student: 'Rahul Sharma',
    class: '10',
    section: 'A',
    rollNumber: '15',
    type: 'Sibling Discount',
    category: 'Discount',
    amount: 5000,
    percentage: 10,
    originalFee: 50000,
    finalFee: 45000,
    reason: 'Second child studying in same school',
    approvedBy: 'Dr. Anita Gupta',
    approverRole: 'Principal',
    applicationDate: '2024-03-25',
    approvalDate: '2024-04-01',
    validFrom: '2024-04-01',
    validTo: '2025-03-31',
    status: 'Active',
    documents: ['Birth Certificate', 'Sibling ID Card'],
    parentName: 'Suresh Sharma',
    contact: '9876543210'
  },
  {
    id: '2',
    studentId: 'STU002',
    student: 'Priya Patel',
    class: '9',
    section: 'B',
    rollNumber: '08',
    type: 'Staff Ward',
    category: 'Exemption',
    amount: 25000,
    percentage: 50,
    originalFee: 50000,
    finalFee: 25000,
    reason: 'Parent is a teaching staff member',
    approvedBy: 'Rajesh Kumar',
    approverRole: 'Admin',
    applicationDate: '2024-03-28',
    approvalDate: '2024-04-05',
    validFrom: '2024-04-01',
    validTo: '2025-03-31',
    status: 'Active',
    documents: ['Staff ID', 'Employment Letter'],
    parentName: 'Meena Patel',
    contact: '9876543211'
  },
  {
    id: '3',
    studentId: 'STU003',
    student: 'Amit Kumar',
    class: '8',
    section: 'C',
    rollNumber: '12',
    type: 'Merit Scholarship',
    category: 'Scholarship',
    amount: 10000,
    percentage: 25,
    originalFee: 40000,
    finalFee: 30000,
    reason: 'Secured 95%+ in previous academic year',
    approvedBy: 'Board of Trustees',
    approverRole: 'Trustee',
    applicationDate: '2024-04-01',
    approvalDate: '2024-04-10',
    validFrom: '2024-04-01',
    validTo: '2025-03-31',
    status: 'Active',
    documents: ['Mark Sheet', 'Achievement Certificate'],
    parentName: 'Vijay Kumar',
    contact: '9876543212'
  },
  {
    id: '4',
    studentId: 'STU004',
    student: 'Sneha Desai',
    class: '11',
    section: 'A',
    rollNumber: '05',
    type: 'EWS Category',
    category: 'Waiver',
    amount: 45000,
    percentage: 75,
    originalFee: 60000,
    finalFee: 15000,
    reason: 'Economically Weaker Section - RTE Quota',
    approvedBy: 'Dr. Anita Gupta',
    approverRole: 'Principal',
    applicationDate: '2024-03-20',
    approvalDate: '2024-04-02',
    validFrom: '2024-04-01',
    validTo: '2025-03-31',
    status: 'Active',
    documents: ['Income Certificate', 'EWS Certificate', 'Ration Card'],
    parentName: 'Mahesh Desai',
    contact: '9876543213'
  },
  {
    id: '5',
    studentId: 'STU005',
    student: 'Rohan Mehta',
    class: '12',
    section: 'B',
    rollNumber: '22',
    type: 'Sports Excellence',
    category: 'Scholarship',
    amount: 15000,
    percentage: 30,
    originalFee: 50000,
    finalFee: 35000,
    reason: 'State level cricket player',
    approvedBy: 'Sports Committee',
    approverRole: 'Committee',
    applicationDate: '2024-03-15',
    approvalDate: '2024-03-25',
    validFrom: '2024-04-01',
    validTo: '2025-03-31',
    status: 'Active',
    documents: ['Sports Certificate', 'State Selection Letter'],
    parentName: 'Kiran Mehta',
    contact: '9876543214'
  },
  {
    id: '6',
    studentId: 'STU006',
    student: 'Kavya Singh',
    class: '7',
    section: 'A',
    rollNumber: '18',
    type: 'Single Parent',
    category: 'Discount',
    amount: 7500,
    percentage: 15,
    originalFee: 50000,
    finalFee: 42500,
    reason: 'Single parent household',
    approvedBy: 'Rajesh Kumar',
    approverRole: 'Admin',
    applicationDate: '2024-03-22',
    approvalDate: '2024-04-03',
    validFrom: '2024-04-01',
    validTo: '2025-03-31',
    status: 'Active',
    documents: ['Death Certificate', 'Affidavit'],
    parentName: 'Geeta Singh',
    contact: '9876543215'
  },
  {
    id: '7',
    studentId: 'STU007',
    student: 'Arjun Reddy',
    class: '10',
    section: 'B',
    rollNumber: '30',
    type: 'Sibling Discount',
    category: 'Discount',
    amount: 5000,
    percentage: 10,
    originalFee: 50000,
    finalFee: 45000,
    reason: 'Third sibling in school',
    approvedBy: 'Dr. Anita Gupta',
    approverRole: 'Principal',
    applicationDate: '2024-03-28',
    approvalDate: '2024-04-05',
    validFrom: '2024-04-01',
    validTo: '2025-03-31',
    status: 'Active',
    documents: ['Birth Certificate', 'Sibling IDs'],
    parentName: 'Venkat Reddy',
    contact: '9876543216'
  },
  {
    id: '8',
    studentId: 'STU008',
    student: 'Ishaan Joshi',
    class: '6',
    section: 'C',
    rollNumber: '11',
    type: 'Staff Ward',
    category: 'Exemption',
    amount: 20000,
    percentage: 50,
    originalFee: 40000,
    finalFee: 20000,
    reason: 'Parent is non-teaching staff',
    approvedBy: 'Rajesh Kumar',
    approverRole: 'Admin',
    applicationDate: '2024-03-30',
    approvalDate: '2024-04-08',
    validFrom: '2024-04-01',
    validTo: '2025-03-31',
    status: 'Active',
    documents: ['Staff ID', 'HR Confirmation'],
    parentName: 'Rakesh Joshi',
    contact: '9876543217'
  },
  {
    id: '9',
    studentId: 'STU009',
    student: 'Ananya Iyer',
    class: '9',
    section: 'A',
    rollNumber: '07',
    type: 'Merit Scholarship',
    category: 'Scholarship',
    amount: 12500,
    percentage: 25,
    originalFee: 50000,
    finalFee: 37500,
    reason: 'Academic excellence - School topper',
    approvedBy: 'Board of Trustees',
    approverRole: 'Trustee',
    applicationDate: '2024-04-05',
    approvalDate: '2024-04-12',
    validFrom: '2024-04-01',
    validTo: '2025-03-31',
    status: 'Active',
    documents: ['Mark Sheet', 'Topper Certificate'],
    parentName: 'Subramaniam Iyer',
    contact: '9876543218'
  },
  {
    id: '10',
    studentId: 'STU010',
    student: 'Dev Malhotra',
    class: '8',
    section: 'B',
    rollNumber: '25',
    type: 'Early Bird Discount',
    category: 'Discount',
    amount: 3000,
    percentage: 6,
    originalFee: 50000,
    finalFee: 47000,
    reason: 'Fee paid before due date',
    approvedBy: 'System',
    approverRole: 'Automatic',
    applicationDate: '2024-03-01',
    approvalDate: '2024-03-01',
    validFrom: '2024-04-01',
    validTo: '2025-03-31',
    status: 'Active',
    documents: ['Payment Receipt'],
    parentName: 'Harsh Malhotra',
    contact: '9876543219'
  }];

  // Calculate statistics
  const calculateStats = () => {
    const totalConcessions = discountData.reduce((sum, d) => sum + d.amount, 0);
    const totalStudents = discountData.length;
    const avgConcession = totalConcessions / totalStudents;
    const byCategory = {
      Discount: discountData.filter((d) => d.category === 'Discount'),
      Exemption: discountData.filter((d) => d.category === 'Exemption'),
      Scholarship: discountData.filter((d) => d.category === 'Scholarship'),
      Waiver: discountData.filter((d) => d.category === 'Waiver')
    };
    return {
      totalConcessions,
      totalStudents,
      avgConcession,
      byCategory,
      discountTotal: byCategory.Discount.reduce((s, d) => s + d.amount, 0),
      exemptionTotal: byCategory.Exemption.reduce((s, d) => s + d.amount, 0),
      scholarshipTotal: byCategory.Scholarship.reduce(
        (s, d) => s + d.amount,
        0
      ),
      waiverTotal: byCategory.Waiver.reduce((s, d) => s + d.amount, 0)
    };
  };
  const stats = calculateStats();
  // Type-wise breakdown
  const typeBreakdown: TypeBreakdown[] = [
  {
    type: 'Sibling Discount',
    icon: <Users className="w-5 h-5" />,
    count: discountData.filter((d) => d.type === 'Sibling Discount').length,
    totalAmount: discountData.
    filter((d) => d.type === 'Sibling Discount').
    reduce((s, d) => s + d.amount, 0),
    avgAmount:
    discountData.
    filter((d) => d.type === 'Sibling Discount').
    reduce((s, d) => s + d.amount, 0) /
    discountData.filter((d) => d.type === 'Sibling Discount').length,
    percentage:
    discountData.
    filter((d) => d.type === 'Sibling Discount').
    reduce((s, d) => s + d.amount, 0) /
    stats.totalConcessions *
    100,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    type: 'Staff Ward',
    icon: <Briefcase className="w-5 h-5" />,
    count: discountData.filter((d) => d.type === 'Staff Ward').length,
    totalAmount: discountData.
    filter((d) => d.type === 'Staff Ward').
    reduce((s, d) => s + d.amount, 0),
    avgAmount:
    discountData.
    filter((d) => d.type === 'Staff Ward').
    reduce((s, d) => s + d.amount, 0) /
    discountData.filter((d) => d.type === 'Staff Ward').length,
    percentage:
    discountData.
    filter((d) => d.type === 'Staff Ward').
    reduce((s, d) => s + d.amount, 0) /
    stats.totalConcessions *
    100,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    type: 'Merit Scholarship',
    icon: <Award className="w-5 h-5" />,
    count: discountData.filter((d) => d.type === 'Merit Scholarship').length,
    totalAmount: discountData.
    filter((d) => d.type === 'Merit Scholarship').
    reduce((s, d) => s + d.amount, 0),
    avgAmount:
    discountData.
    filter((d) => d.type === 'Merit Scholarship').
    reduce((s, d) => s + d.amount, 0) /
    discountData.filter((d) => d.type === 'Merit Scholarship').length,
    percentage:
    discountData.
    filter((d) => d.type === 'Merit Scholarship').
    reduce((s, d) => s + d.amount, 0) /
    stats.totalConcessions *
    100,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  },
  {
    type: 'EWS Category',
    icon: <Heart className="w-5 h-5" />,
    count: discountData.filter((d) => d.type === 'EWS Category').length,
    totalAmount: discountData.
    filter((d) => d.type === 'EWS Category').
    reduce((s, d) => s + d.amount, 0),
    avgAmount:
    discountData.
    filter((d) => d.type === 'EWS Category').
    reduce((s, d) => s + d.amount, 0) / (
    discountData.filter((d) => d.type === 'EWS Category').length || 1),
    percentage:
    discountData.
    filter((d) => d.type === 'EWS Category').
    reduce((s, d) => s + d.amount, 0) /
    stats.totalConcessions *
    100,
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    type: 'Sports Excellence',
    icon: <Star className="w-5 h-5" />,
    count: discountData.filter((d) => d.type === 'Sports Excellence').length,
    totalAmount: discountData.
    filter((d) => d.type === 'Sports Excellence').
    reduce((s, d) => s + d.amount, 0),
    avgAmount:
    discountData.
    filter((d) => d.type === 'Sports Excellence').
    reduce((s, d) => s + d.amount, 0) / (
    discountData.filter((d) => d.type === 'Sports Excellence').length ||
    1),
    percentage:
    discountData.
    filter((d) => d.type === 'Sports Excellence').
    reduce((s, d) => s + d.amount, 0) /
    stats.totalConcessions *
    100,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    type: 'Single Parent',
    icon: <UserCheck className="w-5 h-5" />,
    count: discountData.filter((d) => d.type === 'Single Parent').length,
    totalAmount: discountData.
    filter((d) => d.type === 'Single Parent').
    reduce((s, d) => s + d.amount, 0),
    avgAmount:
    discountData.
    filter((d) => d.type === 'Single Parent').
    reduce((s, d) => s + d.amount, 0) / (
    discountData.filter((d) => d.type === 'Single Parent').length || 1),
    percentage:
    discountData.
    filter((d) => d.type === 'Single Parent').
    reduce((s, d) => s + d.amount, 0) /
    stats.totalConcessions *
    100,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50'
  },
  {
    type: 'Early Bird Discount',
    icon: <Clock className="w-5 h-5" />,
    count: discountData.filter((d) => d.type === 'Early Bird Discount').
    length,
    totalAmount: discountData.
    filter((d) => d.type === 'Early Bird Discount').
    reduce((s, d) => s + d.amount, 0),
    avgAmount:
    discountData.
    filter((d) => d.type === 'Early Bird Discount').
    reduce((s, d) => s + d.amount, 0) / (
    discountData.filter((d) => d.type === 'Early Bird Discount').length ||
    1),
    percentage:
    discountData.
    filter((d) => d.type === 'Early Bird Discount').
    reduce((s, d) => s + d.amount, 0) /
    stats.totalConcessions *
    100,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50'
  }];

  // Approver-wise breakdown
  const approverBreakdown = [
  {
    approver: 'Principal',
    count: discountData.filter((d) => d.approverRole === 'Principal').length,
    amount: discountData.
    filter((d) => d.approverRole === 'Principal').
    reduce((s, d) => s + d.amount, 0)
  },
  {
    approver: 'Admin',
    count: discountData.filter((d) => d.approverRole === 'Admin').length,
    amount: discountData.
    filter((d) => d.approverRole === 'Admin').
    reduce((s, d) => s + d.amount, 0)
  },
  {
    approver: 'Trustee',
    count: discountData.filter((d) => d.approverRole === 'Trustee').length,
    amount: discountData.
    filter((d) => d.approverRole === 'Trustee').
    reduce((s, d) => s + d.amount, 0)
  },
  {
    approver: 'Committee',
    count: discountData.filter((d) => d.approverRole === 'Committee').length,
    amount: discountData.
    filter((d) => d.approverRole === 'Committee').
    reduce((s, d) => s + d.amount, 0)
  },
  {
    approver: 'Automatic',
    count: discountData.filter((d) => d.approverRole === 'Automatic').length,
    amount: discountData.
    filter((d) => d.approverRole === 'Automatic').
    reduce((s, d) => s + d.amount, 0)
  }];

  // Export functions
  const exportToCSV = () => {
    const headers = [
    'Student ID',
    'Student Name',
    'Class',
    'Section',
    'Roll Number',
    'Discount Type',
    'Category',
    'Original Fee',
    'Discount Amount',
    'Discount %',
    'Final Fee',
    'Reason',
    'Approved By',
    'Approver Role',
    'Application Date',
    'Approval Date',
    'Valid From',
    'Valid To',
    'Status',
    'Parent Name',
    'Contact'];

    const dataToExport =
    selectedRecords.length > 0 ?
    discountData.filter((d) => selectedRecords.includes(d.id)) :
    discountData;
    const csvContent = [
    headers.join(','),
    ...dataToExport.map((d) =>
    [
    d.studentId,
    `"${d.student}"`,
    d.class,
    d.section,
    d.rollNumber,
    `"${d.type}"`,
    d.category,
    d.originalFee,
    d.amount,
    d.percentage,
    d.finalFee,
    `"${d.reason}"`,
    `"${d.approvedBy}"`,
    d.approverRole,
    d.applicationDate,
    d.approvalDate,
    d.validFrom,
    d.validTo,
    d.status,
    `"${d.parentName}"`,
    d.contact].
    join(',')
    )].
    join('\n');
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `discount_exemption_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };
  const exportToExcel = () => {
    // Would use xlsx library in production
    alert(
      'Excel export - Would generate .xlsx file with multiple sheets for each category'
    );
  };
  const exportToPDF = () => {
    // Would use jsPDF library in production
    alert(
      'PDF export - Would generate formatted PDF report with charts and tables'
    );
  };
  const exportSummaryReport = () => {
    const summaryContent = `
DISCOUNT & EXEMPTION SUMMARY REPORT
Generated on: ${new Date().toLocaleString()}
Academic Year: 2024-25

=================================================
OVERALL SUMMARY
=================================================
Total Concessions Given: ₹${stats.totalConcessions.toLocaleString()}
Total Students Benefited: ${stats.totalStudents}
Average Concession per Student: ₹${Math.round(stats.avgConcession).toLocaleString()}

=================================================
CATEGORY-WISE BREAKDOWN
=================================================
Discounts: ₹${stats.discountTotal.toLocaleString()} (${stats.byCategory.Discount.length} students)
Exemptions: ₹${stats.exemptionTotal.toLocaleString()} (${stats.byCategory.Exemption.length} students)
Scholarships: ₹${stats.scholarshipTotal.toLocaleString()} (${stats.byCategory.Scholarship.length} students)
Waivers: ₹${stats.waiverTotal.toLocaleString()} (${stats.byCategory.Waiver.length} students)

=================================================
TYPE-WISE BREAKDOWN
=================================================
${typeBreakdown.map((t) => `${t.type}: ₹${t.totalAmount.toLocaleString()} (${t.count} students) - ${t.percentage.toFixed(1)}%`).join('\n')}

=================================================
APPROVER-WISE BREAKDOWN
=================================================
${approverBreakdown.map((a) => `${a.approver}: ₹${a.amount.toLocaleString()} (${a.count} approvals)`).join('\n')}
    `;
    const blob = new Blob([summaryContent], {
      type: 'text/plain;charset=utf-8;'
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `discount_summary_report_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
  };
  const handlePrint = () => {
    window.print();
  };
  // Handle selection
  const handleSelectAll = (checked: boolean) => {
    setSelectedRecords(checked ? discountData.map((d) => d.id) : []);
  };
  const handleSelectRecord = (id: string) => {
    setSelectedRecords((prev) =>
    prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  const columns = [
  {
    key: 'select',
    header:
    <input
      type="checkbox"
      className="rounded border-gray-300"
      checked={selectedRecords.length === discountData.length}
      onChange={(e) => handleSelectAll(e.target.checked)} />,


    render: (row: DiscountRecord) =>
    <input
      type="checkbox"
      className="rounded border-gray-300"
      checked={selectedRecords.includes(row.id)}
      onChange={() => handleSelectRecord(row.id)} />


  },
  {
    key: 'student',
    header: 'Student Details',
    render: (row: DiscountRecord) =>
    <div>
          <div className="font-medium text-gray-900">{row.student}</div>
          <div className="text-xs text-gray-500">
            ID: {row.studentId} | Class {row.class}-{row.section} | Roll:{' '}
            {row.rollNumber}
          </div>
        </div>

  },
  {
    key: 'type',
    header: 'Discount Type',
    render: (row: DiscountRecord) =>
    <div className="flex items-center gap-2">
          <Tag className="w-3 h-3 text-gray-400" />
          <div>
            <div className="font-medium text-gray-900">{row.type}</div>
            <div className="text-xs text-gray-500">{row.reason}</div>
          </div>
        </div>

  },
  {
    key: 'category',
    header: 'Category',
    render: (row: DiscountRecord) =>
    <Badge
      variant={
      row.category === 'Exemption' ?
      'warning' :
      row.category === 'Scholarship' ?
      'success' :
      row.category === 'Waiver' ?
      'danger' :
      'info'
      }>

          {row.category}
        </Badge>

  },
  {
    key: 'fees',
    header: 'Fee Details',
    render: (row: DiscountRecord) =>
    <div className="text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Original:</span>
            <span>₹{row.originalFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between gap-4 text-green-600 font-medium">
            <span>Discount:</span>
            <span>
              -₹{row.amount.toLocaleString()} ({row.percentage}%)
            </span>
          </div>
          <div className="flex justify-between gap-4 border-t pt-1 mt-1 font-bold">
            <span>Final:</span>
            <span>₹{row.finalFee.toLocaleString()}</span>
          </div>
        </div>

  },
  {
    key: 'approval',
    header: 'Approval Info',
    render: (row: DiscountRecord) =>
    <div className="text-sm">
          <div className="font-medium text-gray-900">{row.approvedBy}</div>
          <div className="text-xs text-gray-500">{row.approverRole}</div>
          <div className="text-xs text-gray-400">
            {new Date(row.approvalDate).toLocaleDateString()}
          </div>
        </div>

  },
  {
    key: 'validity',
    header: 'Validity',
    render: (row: DiscountRecord) =>
    <div className="text-sm">
          <div className="text-gray-600">
            {new Date(row.validFrom).toLocaleDateString()} -{' '}
            {new Date(row.validTo).toLocaleDateString()}
          </div>
          <Badge
        variant={
        row.status === 'Active' ?
        'success' :
        row.status === 'Expired' ?
        'danger' :
        row.status === 'Pending' ?
        'warning' :
        'default'
        }
        className="mt-1">

            {row.status}
          </Badge>
        </div>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: DiscountRecord) =>
    <div className="flex gap-1">
          <Button
        variant="ghost"
        size="sm"
        title="View Details"
        onClick={() => alert(`Viewing details for ${row.student}`)}>

            <Eye className="w-4 h-4 text-blue-600" />
          </Button>
          <Button
        variant="ghost"
        size="sm"
        title="View Documents"
        onClick={() => alert(`Documents: ${row.documents.join(', ')}`)}>

            <FileText className="w-4 h-4 text-purple-600" />
          </Button>
        </div>

  }];

  return (
    <div className="space-y-6 p-6 print:p-0" ref={printRef}>
      {/* Header */}
      <div className="flex justify-between items-start print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Discount & Exemption Report
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Comprehensive tracking of all fee concessions, discounts,
            scholarships, and exemptions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print Report
          </Button>
          <div className="relative">
            <Button
              variant="primary"
              onClick={() => setShowExportMenu(!showExportMenu)}>

              <Download className="w-4 h-4 mr-2" />
              Export
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
            {showExportMenu &&
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-50">
                <div className="p-2">
                  <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  onClick={() => {
                    exportToCSV();
                    setShowExportMenu(false);
                  }}>

                    <FileText className="w-4 h-4" />
                    Export as CSV
                  </button>
                  <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  onClick={() => {
                    exportToExcel();
                    setShowExportMenu(false);
                  }}>

                    <FileSpreadsheet className="w-4 h-4" />
                    Export as Excel
                  </button>
                  <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  onClick={() => {
                    exportToPDF();
                    setShowExportMenu(false);
                  }}>

                    <File className="w-4 h-4" />
                    Export as PDF
                  </button>
                  <hr className="my-2" />
                  <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  onClick={() => {
                    exportSummaryReport();
                    setShowExportMenu(false);
                  }}>

                    <BarChart3 className="w-4 h-4" />
                    Export Summary Report
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      {/* Print Header */}
      <div className="hidden print:block mb-6">
        <h1 className="text-2xl font-bold text-center">
          Discount & Exemption Report
        </h1>
        <p className="text-center text-gray-600">
          Generated on: {new Date().toLocaleString()} | Academic Year: 2024-25
        </p>
      </div>

      <ReportFilters className="print:hidden" />

      {/* Summary Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-indigo-600 font-medium">
                Total Concessions
              </p>
              <h3 className="text-2xl font-bold text-indigo-900 mt-1">
                ₹{stats.totalConcessions.toLocaleString()}
              </h3>
              <p className="text-xs text-indigo-500 mt-1">
                {stats.totalStudents} students benefited
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-indigo-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Discounts</p>
              <h3 className="text-2xl font-bold text-blue-900 mt-1">
                ₹{stats.discountTotal.toLocaleString()}
              </h3>
              <p className="text-xs text-blue-500 mt-1">
                {stats.byCategory.Discount.length} students
              </p>
            </div>
            <Percent className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Exemptions</p>
              <h3 className="text-2xl font-bold text-orange-900 mt-1">
                ₹{stats.exemptionTotal.toLocaleString()}
              </h3>
              <p className="text-xs text-orange-500 mt-1">
                {stats.byCategory.Exemption.length} students
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-orange-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Scholarships</p>
              <h3 className="text-2xl font-bold text-green-900 mt-1">
                ₹{stats.scholarshipTotal.toLocaleString()}
              </h3>
              <p className="text-xs text-green-500 mt-1">
                {stats.byCategory.Scholarship.length} students
              </p>
            </div>
            <Award className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Waivers</p>
              <h3 className="text-2xl font-bold text-red-900 mt-1">
                ₹{stats.waiverTotal.toLocaleString()}
              </h3>
              <p className="text-xs text-red-500 mt-1">
                {stats.byCategory.Waiver.length} students
              </p>
            </div>
            <Heart className="w-8 h-8 text-red-500" />
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b print:hidden">
        {['overview', 'detailed', 'analysis'].map((tab) =>
        <button
          key={tab}
          className={`px-4 py-2 font-medium text-sm capitalize border-b-2 transition-colors ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab(tab as any)}>

            {tab === 'overview' && <PieChart className="w-4 h-4 inline mr-2" />}
            {tab === 'detailed' && <FileText className="w-4 h-4 inline mr-2" />}
            {tab === 'analysis' &&
          <BarChart3 className="w-4 h-4 inline mr-2" />
          }
            {tab} View
          </button>
        )}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' &&
      <div className="space-y-6">
          {/* Type-wise Breakdown */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-600" />
              Type-wise Distribution
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {typeBreakdown.map((item) =>
            <div
              key={item.type}
              className={`p-4 rounded-lg ${item.bgColor} border cursor-pointer transition-all hover:shadow-md`}
              onClick={() =>
              setExpandedType(
                expandedType === item.type ? null : item.type
              )
              }>

                  <div className="flex items-center justify-between mb-2">
                    <div className={`${item.color}`}>{item.icon}</div>
                    {expandedType === item.type ?
                <ChevronUp className="w-4 h-4 text-gray-400" /> :

                <ChevronDown className="w-4 h-4 text-gray-400" />
                }
                  </div>
                  <h3 className="font-medium text-gray-900">{item.type}</h3>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Students:</span>
                      <span className="font-medium">{item.count}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total:</span>
                      <span className="font-bold">
                        ₹{item.totalAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Share:</span>
                      <span className="font-medium">
                        {item.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  {expandedType === item.type &&
              <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Avg per student:</span>
                          <span>
                            ₹{Math.round(item.avgAmount).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilters({
                      ...filters,
                      type: item.type
                    });
                    setActiveTab('detailed');
                  }}>

                        View Students
                      </Button>
                    </div>
              }
                </div>
            )}
            </div>
          </Card>

          {/* Visual Bar Chart Representation */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              Distribution Chart
            </h2>
            <div className="space-y-4">
              {typeBreakdown.
            sort((a, b) => b.totalAmount - a.totalAmount).
            map((item) =>
            <div key={item.type} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">
                        {item.type}
                      </span>
                      <span className="text-gray-500">
                        ₹{item.totalAmount.toLocaleString()} (
                        {item.percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                  className={`h-4 rounded-full transition-all ${item.type === 'Sibling Discount' ? 'bg-blue-500' : item.type === 'Staff Ward' ? 'bg-purple-500' : item.type === 'Merit Scholarship' ? 'bg-yellow-500' : item.type === 'EWS Category' ? 'bg-red-500' : item.type === 'Sports Excellence' ? 'bg-green-500' : item.type === 'Single Parent' ? 'bg-pink-500' : 'bg-cyan-500'}`}
                  style={{
                    width: `${item.percentage}%`
                  }} />

                    </div>
                  </div>
            )}
            </div>
          </Card>

          {/* Approver-wise Analysis */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-purple-600" />
              Approver-wise Analysis
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Approver
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-600">
                      Approvals
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">
                      Total Amount
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">
                      Avg Amount
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">
                      Share
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {approverBreakdown.map((item) =>
                <tr
                  key={item.approver}
                  className="border-b hover:bg-gray-50">

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{item.approver}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">{item.count}</td>
                      <td className="py-3 px-4 text-right font-bold">
                        ₹{item.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        ₹
                        {item.count > 0 ?
                    Math.round(
                      item.amount / item.count
                    ).toLocaleString() :
                    0}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {(item.amount / stats.totalConcessions * 100).toFixed(
                      1
                    )}
                        %
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      }

      {/* Detailed Tab */}
      {activeTab === 'detailed' &&
      <div className="space-y-6">
          {/* Filters */}
          <Card className="p-4 print:hidden">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                  placeholder="Search by student name, ID, or parent name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search className="w-4 h-4" />} />

                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <Select
                label="Category"
                options={[
                {
                  value: '',
                  label: 'All Categories'
                },
                {
                  value: 'Discount',
                  label: 'Discount'
                },
                {
                  value: 'Exemption',
                  label: 'Exemption'
                },
                {
                  value: 'Scholarship',
                  label: 'Scholarship'
                },
                {
                  value: 'Waiver',
                  label: 'Waiver'
                }]
                }
                value={filters.category}
                onChange={(e) =>
                setFilters({
                  ...filters,
                  category: e.target.value
                })
                } />


                <Select
                label="Type"
                options={[
                {
                  value: '',
                  label: 'All Types'
                },
                {
                  value: 'Sibling Discount',
                  label: 'Sibling Discount'
                },
                {
                  value: 'Staff Ward',
                  label: 'Staff Ward'
                },
                {
                  value: 'Merit Scholarship',
                  label: 'Merit Scholarship'
                },
                {
                  value: 'EWS Category',
                  label: 'EWS Category'
                },
                {
                  value: 'Sports Excellence',
                  label: 'Sports Excellence'
                },
                {
                  value: 'Single Parent',
                  label: 'Single Parent'
                },
                {
                  value: 'Early Bird Discount',
                  label: 'Early Bird'
                }]
                }
                value={filters.type}
                onChange={(e) =>
                setFilters({
                  ...filters,
                  type: e.target.value
                })
                } />


                <Select
                label="Class"
                options={[
                {
                  value: '',
                  label: 'All Classes'
                },
                {
                  value: '6',
                  label: 'Class 6'
                },
                {
                  value: '7',
                  label: 'Class 7'
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
                label="Status"
                options={[
                {
                  value: '',
                  label: 'All Status'
                },
                {
                  value: 'Active',
                  label: 'Active'
                },
                {
                  value: 'Expired',
                  label: 'Expired'
                },
                {
                  value: 'Pending',
                  label: 'Pending'
                },
                {
                  value: 'Revoked',
                  label: 'Revoked'
                }]
                }
                value={filters.status}
                onChange={(e) =>
                setFilters({
                  ...filters,
                  status: e.target.value
                })
                } />


                <Select
                label="Approved By"
                options={[
                {
                  value: '',
                  label: 'All Approvers'
                },
                {
                  value: 'Principal',
                  label: 'Principal'
                },
                {
                  value: 'Admin',
                  label: 'Admin'
                },
                {
                  value: 'Trustee',
                  label: 'Trustee'
                },
                {
                  value: 'Committee',
                  label: 'Committee'
                }]
                }
                value={filters.approvedBy}
                onChange={(e) =>
                setFilters({
                  ...filters,
                  approvedBy: e.target.value
                })
                } />


                <div className="flex items-end">
                  <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                  setFilters({
                    category: '',
                    type: '',
                    class: '',
                    status: '',
                    approvedBy: '',
                    dateFrom: '',
                    dateTo: ''
                  })
                  }>

                    <X className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>

              {selectedRecords.length > 0 &&
            <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                  <span className="text-sm text-blue-700 font-medium">
                    {selectedRecords.length} record(s) selected
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={exportToCSV}>
                      <Download className="w-4 h-4 mr-2" />
                      Export Selected
                    </Button>
                    <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedRecords([])}>

                      Clear Selection
                    </Button>
                  </div>
                </div>
            }
            </div>
          </Card>

          {/* Data Table */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Detailed Records ({discountData.length})
              </h2>
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleString()}
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table columns={columns} data={discountData} />
            </div>
          </Card>
        </div>
      }

      {/* Analysis Tab */}
      {activeTab === 'analysis' &&
      <div className="space-y-6">
          {/* Monthly Trend */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Monthly Approval Trend
            </h2>
            <div className="space-y-4">
              {[
            {
              month: 'March 2024',
              count: 3,
              amount: 13000
            },
            {
              month: 'April 2024',
              count: 7,
              amount: 135000
            }].
            map((item) =>
            <div key={item.month} className="flex items-center gap-4">
                  <div className="w-32 text-sm font-medium text-gray-600">
                    {item.month}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-6">
                        <div
                      className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                      style={{
                        width: `${item.amount / 150000 * 100}%`
                      }}>

                          <span className="text-xs text-white font-medium">
                            ₹{item.amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 w-24">
                        {item.count} approvals
                      </span>
                    </div>
                  </div>
                </div>
            )}
            </div>
          </Card>

          {/* Class-wise Distribution */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-green-600" />
              Class-wise Distribution
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {['6', '7', '8', '9', '10', '11', '12'].map((cls) => {
              const classData = discountData.filter((d) => d.class === cls);
              const classTotal = classData.reduce((s, d) => s + d.amount, 0);
              return (
                <div
                  key={cls}
                  className="text-center p-4 bg-gray-50 rounded-lg">

                    <div className="text-2xl font-bold text-gray-900">
                      {classData.length}
                    </div>
                    <div className="text-sm text-gray-500">Class {cls}</div>
                    <div className="text-xs text-green-600 font-medium mt-1">
                      ₹{classTotal.toLocaleString()}
                    </div>
                  </div>);

            })}
            </div>
          </Card>

          {/* Category Comparison */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Category Comparison
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
            {
              category: 'Discount',
              color: 'blue',
              data: stats.byCategory.Discount,
              total: stats.discountTotal
            },
            {
              category: 'Exemption',
              color: 'orange',
              data: stats.byCategory.Exemption,
              total: stats.exemptionTotal
            },
            {
              category: 'Scholarship',
              color: 'green',
              data: stats.byCategory.Scholarship,
              total: stats.scholarshipTotal
            },
            {
              category: 'Waiver',
              color: 'red',
              data: stats.byCategory.Waiver,
              total: stats.waiverTotal
            }].
            map((item) =>
            <div key={item.category} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">
                      {item.category}
                    </h3>
                    <Badge
                  variant={
                  item.category === 'Discount' ?
                  'info' :
                  item.category === 'Exemption' ?
                  'warning' :
                  item.category === 'Scholarship' ?
                  'success' :
                  'danger'
                  }>

                      {item.data.length}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold">
                    ₹{item.total.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    Avg: ₹
                    {item.data.length > 0 ?
                Math.round(
                  item.total / item.data.length
                ).toLocaleString() :
                0}
                  </div>
                  <div className="space-y-1">
                    {item.data.slice(0, 3).map((d) =>
                <div
                  key={d.id}
                  className="text-xs text-gray-600 flex justify-between">

                        <span className="truncate">{d.student}</span>
                        <span>₹{d.amount.toLocaleString()}</span>
                      </div>
                )}
                    {item.data.length > 3 &&
                <div className="text-xs text-blue-600">
                        +{item.data.length - 3} more
                      </div>
                }
                  </div>
                </div>
            )}
            </div>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="font-medium text-gray-900 mb-2">
                Highest Concession
              </h3>
              {(() => {
              const highest = discountData.reduce((max, d) =>
              d.amount > max.amount ? d : max
              );
              return (
                <div>
                    <div className="text-xl font-bold text-red-600">
                      ₹{highest.amount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {highest.student}
                    </div>
                    <div className="text-xs text-gray-400">{highest.type}</div>
                  </div>);

            })()}
            </Card>

            <Card className="p-4">
              <h3 className="font-medium text-gray-900 mb-2">
                Average Concession
              </h3>
              <div>
                <div className="text-xl font-bold text-blue-600">
                  ₹{Math.round(stats.avgConcession).toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Per student</div>
                <div className="text-xs text-gray-400">
                  Across {stats.totalStudents} students
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-medium text-gray-900 mb-2">
                Most Common Type
              </h3>
              {(() => {
              const mostCommon = typeBreakdown.reduce((max, t) =>
              t.count > max.count ? t : max
              );
              return (
                <div>
                    <div className="text-xl font-bold text-green-600">
                      {mostCommon.type}
                    </div>
                    <div className="text-sm text-gray-500">
                      {mostCommon.count} students
                    </div>
                    <div className="text-xs text-gray-400">
                      ₹{mostCommon.totalAmount.toLocaleString()} total
                    </div>
                  </div>);

            })()}
            </Card>
          </div>
        </div>
      }

      {/* Info Card */}
      <Card className="p-4 bg-blue-50 border-blue-200 print:hidden">
        <div className="flex gap-3">
          <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">Report Information:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>
                This report includes all active and historical
                discount/exemption records
              </li>
              <li>
                Export options: CSV (for Excel), Excel (formatted), PDF
                (printable)
              </li>
              <li>
                Summary report includes aggregated statistics and breakdowns
              </li>
              <li>Use filters to narrow down specific categories or types</li>
              <li>
                Click on type cards in Overview to see detailed student lists
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>);

}