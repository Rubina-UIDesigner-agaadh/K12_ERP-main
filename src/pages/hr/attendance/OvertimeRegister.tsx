// src/pages/attendance/overtime/OvertimeRegister.tsx

import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import {
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Home,
  ChevronRight,
  Users,
  Eye,
  ArrowLeft,
  X,
  AlertCircle,
  FileText,
  Printer,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Building,
  User,
  Timer,
  History,
  CheckSquare,
  Info,
  MessageSquare,
  ClipboardList,
  Plus,
  Send,
  Briefcase,
  Save,
  Clock3,
  CalendarPlus,
  UserPlus,
  ListChecks,
  FileCheck,
  AlertTriangle,
  Edit,
  Trash2,
  MoreHorizontal } from
'lucide-react';

// Types
interface Employee {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  shift: string;
  shiftStartTime: string;
  shiftEndTime: string;
}

interface OvertimeRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  employeeAvatar: string;
  department: string;
  designation: string;
  requestDate: string;
  overtimeDate: string;
  expectedStartTime: string;
  expectedEndTime: string;
  expectedHours: number;
  reason: string;
  projectCode: string | null;
  taskDescription: string | null;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  approvedBy: string | null;
  approvedAt: string | null;
  rejectionReason: string | null;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface WorkedOvertime {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  employeeAvatar: string;
  department: string;
  designation: string;
  date: string;
  shiftEndTime: string;
  actualOutTime: string;
  actualOTHours: number;
  approvedHours: number;
  reason: string;
  projectCode: string | null;
  taskDescription: string | null;
  status: 'completed' | 'partial' | 'exceeded';
  verifiedBy: string;
  verifiedAt: string;
  remarks: string | null;
}

// Mock Employees Data
const employees: Employee[] = [
{
  id: 'EMP001',
  name: 'John Anderson',
  avatar: 'JA',
  email: 'john.anderson@company.com',
  phone: '+91 98765 43210',
  department: 'IT Department',
  designation: 'Senior Developer',
  shift: 'General Shift',
  shiftStartTime: '09:00 AM',
  shiftEndTime: '06:00 PM'
},
{
  id: 'EMP002',
  name: 'Sarah Williams',
  avatar: 'SW',
  email: 'sarah.williams@company.com',
  phone: '+91 98765 43211',
  department: 'Human Resources',
  designation: 'HR Manager',
  shift: 'General Shift',
  shiftStartTime: '09:00 AM',
  shiftEndTime: '05:00 PM'
},
{
  id: 'EMP003',
  name: 'Michael Chen',
  avatar: 'MC',
  email: 'michael.chen@company.com',
  phone: '+91 98765 43212',
  department: 'Finance',
  designation: 'Financial Analyst',
  shift: 'General Shift',
  shiftStartTime: '09:00 AM',
  shiftEndTime: '06:00 PM'
},
{
  id: 'EMP004',
  name: 'Emily Johnson',
  avatar: 'EJ',
  email: 'emily.johnson@company.com',
  phone: '+91 98765 43213',
  department: 'Marketing',
  designation: 'Marketing Executive',
  shift: 'Flexible Shift',
  shiftStartTime: '10:00 AM',
  shiftEndTime: '04:00 PM'
},
{
  id: 'EMP005',
  name: 'David Martinez',
  avatar: 'DM',
  email: 'david.martinez@company.com',
  phone: '+91 98765 43214',
  department: 'IT Department',
  designation: 'System Administrator',
  shift: 'Night Shift',
  shiftStartTime: '10:00 PM',
  shiftEndTime: '07:00 AM'
},
{
  id: 'EMP006',
  name: 'Jessica Brown',
  avatar: 'JB',
  email: 'jessica.brown@company.com',
  phone: '+91 98765 43215',
  department: 'Operations',
  designation: 'Operations Manager',
  shift: 'General Shift',
  shiftStartTime: '09:00 AM',
  shiftEndTime: '06:00 PM'
},
{
  id: 'EMP007',
  name: 'Robert Taylor',
  avatar: 'RT',
  email: 'robert.taylor@company.com',
  phone: '+91 98765 43216',
  department: 'Sales',
  designation: 'Sales Executive',
  shift: 'General Shift',
  shiftStartTime: '09:00 AM',
  shiftEndTime: '06:00 PM'
},
{
  id: 'EMP008',
  name: 'Amanda Wilson',
  avatar: 'AW',
  email: 'amanda.wilson@company.com',
  phone: '+91 98765 43217',
  department: 'IT Department',
  designation: 'QA Engineer',
  shift: 'General Shift',
  shiftStartTime: '09:00 AM',
  shiftEndTime: '06:00 PM'
},
{
  id: 'EMP009',
  name: 'Christopher Lee',
  avatar: 'CL',
  email: 'christopher.lee@company.com',
  phone: '+91 98765 43218',
  department: 'IT Department',
  designation: 'DevOps Engineer',
  shift: 'Rotational Shift',
  shiftStartTime: '02:00 PM',
  shiftEndTime: '10:00 PM'
},
{
  id: 'EMP010',
  name: 'Jennifer Garcia',
  avatar: 'JG',
  email: 'jennifer.garcia@company.com',
  phone: '+91 98765 43219',
  department: 'Customer Support',
  designation: 'Support Lead',
  shift: 'General Shift',
  shiftStartTime: '09:00 AM',
  shiftEndTime: '06:00 PM'
}];


// Mock Overtime Requests Data
const overtimeRequests: OvertimeRequest[] = [
{
  id: 'OTR-001',
  employeeId: 'EMP001',
  employeeName: 'John Anderson',
  employeeCode: 'EMP-2024-001',
  employeeAvatar: 'JA',
  department: 'IT Department',
  designation: 'Senior Developer',
  requestDate: '2025-01-15',
  overtimeDate: '2025-01-18',
  expectedStartTime: '06:00 PM',
  expectedEndTime: '10:00 PM',
  expectedHours: 4,
  reason: 'Sprint deadline - Need to complete API integration for client delivery',
  projectCode: 'PRJ-2025-001',
  taskDescription: 'API Integration and Testing',
  status: 'pending',
  requestedAt: '2025-01-15 10:30 AM',
  approvedBy: null,
  approvedAt: null,
  rejectionReason: null,
  priority: 'high'
},
{
  id: 'OTR-002',
  employeeId: 'EMP004',
  employeeName: 'Emily Johnson',
  employeeCode: 'EMP-2024-004',
  employeeAvatar: 'EJ',
  department: 'Marketing',
  designation: 'Marketing Executive',
  requestDate: '2025-01-15',
  overtimeDate: '2025-01-17',
  expectedStartTime: '04:00 PM',
  expectedEndTime: '08:00 PM',
  expectedHours: 4,
  reason: 'Product launch campaign - Social media content preparation',
  projectCode: 'MKT-2025-Q1',
  taskDescription: 'Campaign Content Creation',
  status: 'pending',
  requestedAt: '2025-01-15 11:45 AM',
  approvedBy: null,
  approvedAt: null,
  rejectionReason: null,
  priority: 'medium'
},
{
  id: 'OTR-003',
  employeeId: 'EMP005',
  employeeName: 'David Martinez',
  employeeCode: 'EMP-2024-005',
  employeeAvatar: 'DM',
  department: 'IT Department',
  designation: 'System Administrator',
  requestDate: '2025-01-14',
  overtimeDate: '2025-01-16',
  expectedStartTime: '07:00 AM',
  expectedEndTime: '12:00 PM',
  expectedHours: 5,
  reason: 'Critical server maintenance and security patch deployment',
  projectCode: 'INF-MAINT-001',
  taskDescription: 'Server Maintenance',
  status: 'approved',
  requestedAt: '2025-01-14 08:00 PM',
  approvedBy: 'Manager - James Smith',
  approvedAt: '2025-01-14 09:30 PM',
  rejectionReason: null,
  priority: 'critical'
},
{
  id: 'OTR-004',
  employeeId: 'EMP003',
  employeeName: 'Michael Chen',
  employeeCode: 'EMP-2024-003',
  employeeAvatar: 'MC',
  department: 'Finance',
  designation: 'Financial Analyst',
  requestDate: '2025-01-13',
  overtimeDate: '2025-01-15',
  expectedStartTime: '06:00 PM',
  expectedEndTime: '09:00 PM',
  expectedHours: 3,
  reason: 'Quarter-end financial report preparation',
  projectCode: 'FIN-Q4-RPT',
  taskDescription: 'Financial Reporting',
  status: 'rejected',
  requestedAt: '2025-01-13 04:30 PM',
  approvedBy: 'Manager - James Smith',
  approvedAt: '2025-01-13 05:45 PM',
  rejectionReason: 'Report deadline extended. OT not required.',
  priority: 'medium'
},
{
  id: 'OTR-005',
  employeeId: 'EMP006',
  employeeName: 'Jessica Brown',
  employeeCode: 'EMP-2024-006',
  employeeAvatar: 'JB',
  department: 'Operations',
  designation: 'Operations Manager',
  requestDate: '2025-01-15',
  overtimeDate: '2025-01-19',
  expectedStartTime: '06:00 PM',
  expectedEndTime: '09:30 PM',
  expectedHours: 3.5,
  reason: 'Inventory audit and stock reconciliation',
  projectCode: 'OPS-AUD-2025',
  taskDescription: 'Monthly Inventory Audit',
  status: 'pending',
  requestedAt: '2025-01-15 02:15 PM',
  approvedBy: null,
  approvedAt: null,
  rejectionReason: null,
  priority: 'medium'
},
{
  id: 'OTR-006',
  employeeId: 'EMP007',
  employeeName: 'Robert Taylor',
  employeeCode: 'EMP-2024-007',
  employeeAvatar: 'RT',
  department: 'Sales',
  designation: 'Sales Executive',
  requestDate: '2025-01-14',
  overtimeDate: '2025-01-16',
  expectedStartTime: '06:00 PM',
  expectedEndTime: '08:30 PM',
  expectedHours: 2.5,
  reason: 'Client proposal preparation for enterprise deal',
  projectCode: 'SALES-ENT-001',
  taskDescription: 'Enterprise Proposal',
  status: 'pending',
  requestedAt: '2025-01-14 03:00 PM',
  approvedBy: null,
  approvedAt: null,
  rejectionReason: null,
  priority: 'high'
},
{
  id: 'OTR-007',
  employeeId: 'EMP008',
  employeeName: 'Amanda Wilson',
  employeeCode: 'EMP-2024-008',
  employeeAvatar: 'AW',
  department: 'IT Department',
  designation: 'QA Engineer',
  requestDate: '2025-01-15',
  overtimeDate: '2025-01-17',
  expectedStartTime: '06:00 PM',
  expectedEndTime: '10:00 PM',
  expectedHours: 4,
  reason: 'Regression testing for production release',
  projectCode: 'QA-REL-2025',
  taskDescription: 'Release Testing',
  status: 'pending',
  requestedAt: '2025-01-15 09:00 AM',
  approvedBy: null,
  approvedAt: null,
  rejectionReason: null,
  priority: 'high'
},
{
  id: 'OTR-008',
  employeeId: 'EMP009',
  employeeName: 'Christopher Lee',
  employeeCode: 'EMP-2024-009',
  employeeAvatar: 'CL',
  department: 'IT Department',
  designation: 'DevOps Engineer',
  requestDate: '2025-01-14',
  overtimeDate: '2025-01-15',
  expectedStartTime: '10:00 PM',
  expectedEndTime: '02:00 AM',
  expectedHours: 4,
  reason: 'Production deployment and monitoring',
  projectCode: 'DEVOPS-DEP-001',
  taskDescription: 'Production Deployment',
  status: 'approved',
  requestedAt: '2025-01-14 06:00 PM',
  approvedBy: 'Manager - James Smith',
  approvedAt: '2025-01-14 07:00 PM',
  rejectionReason: null,
  priority: 'critical'
}];


// Mock Worked Overtime Data
const workedOvertimeRecords: WorkedOvertime[] = [
{
  id: 'WOT-001',
  employeeId: 'EMP001',
  employeeName: 'John Anderson',
  employeeCode: 'EMP-2024-001',
  employeeAvatar: 'JA',
  department: 'IT Department',
  designation: 'Senior Developer',
  date: '2025-01-14',
  shiftEndTime: '06:00 PM',
  actualOutTime: '09:45 PM',
  actualOTHours: 3.75,
  approvedHours: 4,
  reason: 'API integration for client project',
  projectCode: 'PRJ-2025-001',
  taskDescription: 'Backend API Development',
  status: 'completed',
  verifiedBy: 'Manager - James Smith',
  verifiedAt: '2025-01-15 09:00 AM',
  remarks: 'Completed within approved hours'
},
{
  id: 'WOT-002',
  employeeId: 'EMP002',
  employeeName: 'Sarah Williams',
  employeeCode: 'EMP-2024-002',
  employeeAvatar: 'SW',
  department: 'Human Resources',
  designation: 'HR Manager',
  date: '2025-01-13',
  shiftEndTime: '05:00 PM',
  actualOutTime: '08:30 PM',
  actualOTHours: 3.5,
  approvedHours: 3,
  reason: 'Campus recruitment drive coordination',
  projectCode: 'HR-REC-2025',
  taskDescription: 'Recruitment Event',
  status: 'exceeded',
  verifiedBy: 'Director - Lisa Johnson',
  verifiedAt: '2025-01-14 10:00 AM',
  remarks: 'Exceeded by 30 mins due to extended interview rounds'
},
{
  id: 'WOT-003',
  employeeId: 'EMP005',
  employeeName: 'David Martinez',
  employeeCode: 'EMP-2024-005',
  employeeAvatar: 'DM',
  department: 'IT Department',
  designation: 'System Administrator',
  date: '2025-01-12',
  shiftEndTime: '07:00 AM',
  actualOutTime: '11:30 AM',
  actualOTHours: 4.5,
  approvedHours: 5,
  reason: 'Server migration and backup',
  projectCode: 'INF-MIG-001',
  taskDescription: 'Database Migration',
  status: 'completed',
  verifiedBy: 'Manager - James Smith',
  verifiedAt: '2025-01-12 02:00 PM',
  remarks: 'Migration completed successfully'
},
{
  id: 'WOT-004',
  employeeId: 'EMP007',
  employeeName: 'Robert Taylor',
  employeeCode: 'EMP-2024-007',
  employeeAvatar: 'RT',
  department: 'Sales',
  designation: 'Sales Executive',
  date: '2025-01-11',
  shiftEndTime: '06:00 PM',
  actualOutTime: '09:15 PM',
  actualOTHours: 3.25,
  approvedHours: 3.5,
  reason: 'Quarterly sales presentation preparation',
  projectCode: 'SALES-Q4-REV',
  taskDescription: 'Sales Review Presentation',
  status: 'completed',
  verifiedBy: 'Manager - Mike Davis',
  verifiedAt: '2025-01-12 09:30 AM',
  remarks: 'Presentation ready for board meeting'
},
{
  id: 'WOT-005',
  employeeId: 'EMP003',
  employeeName: 'Michael Chen',
  employeeCode: 'EMP-2024-003',
  employeeAvatar: 'MC',
  department: 'Finance',
  designation: 'Financial Analyst',
  date: '2025-01-10',
  shiftEndTime: '06:00 PM',
  actualOutTime: '10:00 PM',
  actualOTHours: 4,
  approvedHours: 4,
  reason: 'Annual budget finalization',
  projectCode: 'FIN-BUD-2025',
  taskDescription: 'Budget Analysis',
  status: 'completed',
  verifiedBy: 'CFO - Richard Brown',
  verifiedAt: '2025-01-11 08:00 AM',
  remarks: 'Budget approved by board'
},
{
  id: 'WOT-006',
  employeeId: 'EMP008',
  employeeName: 'Amanda Wilson',
  employeeCode: 'EMP-2024-008',
  employeeAvatar: 'AW',
  department: 'IT Department',
  designation: 'QA Engineer',
  date: '2025-01-09',
  shiftEndTime: '06:00 PM',
  actualOutTime: '08:30 PM',
  actualOTHours: 2.5,
  approvedHours: 3,
  reason: 'UAT testing for mobile app release',
  projectCode: 'QA-MOB-2025',
  taskDescription: 'Mobile App Testing',
  status: 'partial',
  verifiedBy: 'Manager - James Smith',
  verifiedAt: '2025-01-10 09:00 AM',
  remarks: 'Testing completed early, remaining tests moved to next day'
},
{
  id: 'WOT-007',
  employeeId: 'EMP009',
  employeeName: 'Christopher Lee',
  employeeCode: 'EMP-2024-009',
  employeeAvatar: 'CL',
  department: 'IT Department',
  designation: 'DevOps Engineer',
  date: '2025-01-14',
  shiftEndTime: '10:00 PM',
  actualOutTime: '02:15 AM',
  actualOTHours: 4.25,
  approvedHours: 4,
  reason: 'Production deployment',
  projectCode: 'DEVOPS-DEP-001',
  taskDescription: 'Release Deployment',
  status: 'exceeded',
  verifiedBy: 'Manager - James Smith',
  verifiedAt: '2025-01-15 10:00 AM',
  remarks: 'Extended due to unexpected deployment issues'
},
{
  id: 'WOT-008',
  employeeId: 'EMP006',
  employeeName: 'Jessica Brown',
  employeeCode: 'EMP-2024-006',
  employeeAvatar: 'JB',
  department: 'Operations',
  designation: 'Operations Manager',
  date: '2025-01-08',
  shiftEndTime: '06:00 PM',
  actualOutTime: '09:00 PM',
  actualOTHours: 3,
  approvedHours: 3,
  reason: 'Warehouse inventory reconciliation',
  projectCode: 'OPS-INV-001',
  taskDescription: 'Inventory Audit',
  status: 'completed',
  verifiedBy: 'Director - Susan Clark',
  verifiedAt: '2025-01-09 08:30 AM',
  remarks: 'All discrepancies resolved'
},
{
  id: 'WOT-009',
  employeeId: 'EMP004',
  employeeName: 'Emily Johnson',
  employeeCode: 'EMP-2024-004',
  employeeAvatar: 'EJ',
  department: 'Marketing',
  designation: 'Marketing Executive',
  date: '2025-01-07',
  shiftEndTime: '04:00 PM',
  actualOutTime: '07:30 PM',
  actualOTHours: 3.5,
  approvedHours: 4,
  reason: 'Trade show booth design finalization',
  projectCode: 'MKT-TRADE-2025',
  taskDescription: 'Event Preparation',
  status: 'completed',
  verifiedBy: 'Manager - Karen White',
  verifiedAt: '2025-01-08 09:00 AM',
  remarks: 'Design approved by leadership'
},
{
  id: 'WOT-010',
  employeeId: 'EMP010',
  employeeName: 'Jennifer Garcia',
  employeeCode: 'EMP-2024-010',
  employeeAvatar: 'JG',
  department: 'Customer Support',
  designation: 'Support Lead',
  date: '2025-01-06',
  shiftEndTime: '06:00 PM',
  actualOutTime: '08:45 PM',
  actualOTHours: 2.75,
  approvedHours: 3,
  reason: 'Critical customer escalation handling',
  projectCode: 'SUP-ESC-001',
  taskDescription: 'Customer Escalation',
  status: 'completed',
  verifiedBy: 'Manager - Tom Wilson',
  verifiedAt: '2025-01-07 09:00 AM',
  remarks: 'Issue resolved, customer satisfied'
}];


// Helper Functions
const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'approved':
    case 'completed':
      return {
        label: status === 'approved' ? 'Approved' : 'Completed',
        icon: <CheckCircle className="w-3 h-3" />,
        bgColor: 'bg-green-100',
        textColor: 'text-green-800'
      };
    case 'rejected':
      return {
        label: 'Rejected',
        icon: <XCircle className="w-3 h-3" />,
        bgColor: 'bg-red-100',
        textColor: 'text-red-800'
      };
    case 'pending':
      return {
        label: 'Pending',
        icon: <Clock className="w-3 h-3" />,
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800'
      };
    case 'partial':
      return {
        label: 'Partial',
        icon: <AlertCircle className="w-3 h-3" />,
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800'
      };
    case 'exceeded':
      return {
        label: 'Exceeded',
        icon: <AlertTriangle className="w-3 h-3" />,
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-800'
      };
    default:
      return {
        label: 'Unknown',
        icon: <AlertCircle className="w-3 h-3" />,
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800'
      };
  }
};

const getPriorityConfig = (priority: string) => {
  switch (priority) {
    case 'critical':
      return { label: 'Critical', bgColor: 'bg-red-100', textColor: 'text-red-800' };
    case 'high':
      return { label: 'High', bgColor: 'bg-orange-100', textColor: 'text-orange-800' };
    case 'medium':
      return { label: 'Medium', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' };
    case 'low':
      return { label: 'Low', bgColor: 'bg-green-100', textColor: 'text-green-800' };
    default:
      return { label: 'Normal', bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
  }
};

// Tab Types
type TabType = 'apply' | 'requests' | 'worked';

export function OvertimeRegister() {
  // State Management
  const [activeTab, setActiveTab] = useState<TabType>('apply');
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [fromDate, setFromDate] = useState('2025-01-01');
  const [toDate, setToDate] = useState('2025-01-31');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const recordsPerPage = 5;

  // Form State
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [overtimeDate, setOvertimeDate] = useState('');
  const [expectedStartTime, setExpectedStartTime] = useState('');
  const [expectedEndTime, setExpectedEndTime] = useState('');
  const [expectedHours, setExpectedHours] = useState('');
  const [reason, setReason] = useState('');
  const [projectCode, setProjectCode] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [priority, setPriority] = useState('medium');

  // Modal State
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<OvertimeRequest | WorkedOvertime | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [approvalRemarks, setApprovalRemarks] = useState('');

  // Get unique departments
  const departments = useMemo(() => {
    const depts = [...new Set(employees.map((e) => e.department))];
    return depts.sort();
  }, []);

  // Filter Overtime Requests
  const filteredRequests = useMemo(() => {
    return overtimeRequests.filter((request) => {
      const matchesSearch =
      request.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.department.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDepartment =
      departmentFilter === 'all' || request.department === departmentFilter;

      const matchesStatus = statusFilter === 'all' || request.status === statusFilter;

      const requestDate = new Date(request.overtimeDate);
      const from = new Date(fromDate);
      const to = new Date(toDate);
      const matchesDate = requestDate >= from && requestDate <= to;

      return matchesSearch && matchesDepartment && matchesStatus && matchesDate;
    });
  }, [searchQuery, departmentFilter, statusFilter, fromDate, toDate]);

  // Filter Worked Overtime
  const filteredWorkedOT = useMemo(() => {
    return workedOvertimeRecords.filter((record) => {
      const matchesSearch =
      record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.department.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDepartment =
      departmentFilter === 'all' || record.department === departmentFilter;

      const matchesStatus = statusFilter === 'all' || record.status === statusFilter;

      const recordDate = new Date(record.date);
      const from = new Date(fromDate);
      const to = new Date(toDate);
      const matchesDate = recordDate >= from && recordDate <= to;

      return matchesSearch && matchesDepartment && matchesStatus && matchesDate;
    });
  }, [searchQuery, departmentFilter, statusFilter, fromDate, toDate]);

  // Pagination for Requests
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );
  const totalRequestPages = Math.ceil(filteredRequests.length / recordsPerPage);

  // Pagination for Worked OT
  const paginatedWorkedOT = filteredWorkedOT.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );
  const totalWorkedPages = Math.ceil(filteredWorkedOT.length / recordsPerPage);

  // Summary Statistics
  const requestsSummary = useMemo(() => {
    return {
      total: overtimeRequests.length,
      pending: overtimeRequests.filter((r) => r.status === 'pending').length,
      approved: overtimeRequests.filter((r) => r.status === 'approved').length,
      rejected: overtimeRequests.filter((r) => r.status === 'rejected').length
    };
  }, []);

  const workedSummary = useMemo(() => {
    const totalHours = workedOvertimeRecords.reduce((sum, r) => sum + r.actualOTHours, 0);
    return {
      total: workedOvertimeRecords.length,
      completed: workedOvertimeRecords.filter((r) => r.status === 'completed').length,
      exceeded: workedOvertimeRecords.filter((r) => r.status === 'exceeded').length,
      partial: workedOvertimeRecords.filter((r) => r.status === 'partial').length,
      totalHours: totalHours.toFixed(2)
    };
  }, []);

  // Toggle row expansion
  const toggleRowExpansion = (recordId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(recordId)) {
      newExpanded.delete(recordId);
    } else {
      newExpanded.add(recordId);
    }
    setExpandedRows(newExpanded);
  };

  // Handle Form Submission
  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting overtime request:', {
      selectedEmployee,
      overtimeDate,
      expectedStartTime,
      expectedEndTime,
      expectedHours,
      reason,
      projectCode,
      taskDescription,
      priority
    });
    // Reset form
    setSelectedEmployee('');
    setOvertimeDate('');
    setExpectedStartTime('');
    setExpectedEndTime('');
    setExpectedHours('');
    setReason('');
    setProjectCode('');
    setTaskDescription('');
    setPriority('medium');
    alert('Overtime request submitted successfully!');
  };

  // Handle Approval
  const handleApprove = (record: OvertimeRequest) => {
    setSelectedRecord(record);
    setApprovalRemarks('');
    setShowApprovalModal(true);
  };

  // Handle Rejection
  const handleReject = (record: OvertimeRequest) => {
    setSelectedRecord(record);
    setRejectionReason('');
    setShowRejectionModal(true);
  };

  // Confirm Approval
  const confirmApproval = () => {
    console.log('Approving request:', selectedRecord?.id, 'with remarks:', approvalRemarks);
    setShowApprovalModal(false);
    setSelectedRecord(null);
    setApprovalRemarks('');
  };

  // Confirm Rejection
  const confirmRejection = () => {
    console.log('Rejecting request:', selectedRecord?.id, 'with reason:', rejectionReason);
    setShowRejectionModal(false);
    setSelectedRecord(null);
    setRejectionReason('');
  };

  // Get selected employee details
  const selectedEmployeeDetails = employees.find((e) => e.id === selectedEmployee);

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-500">
        <Home className="w-4 h-4" />
        <ChevronRight className="w-4 h-4 mx-2" />
        <span>Attendance</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900 font-medium">Overtime Register</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Overtime Register</h1>
          <p className="text-sm text-gray-500">
            Apply for overtime, view requests, and track worked overtime hours
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-900">{requestsSummary.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Approved Requests</p>
              <p className="text-2xl font-bold text-gray-900">{requestsSummary.approved}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Timer className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total OT Hours</p>
              <p className="text-2xl font-bold text-gray-900">{workedSummary.totalHours}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">OT Completed</p>
              <p className="text-2xl font-bold text-gray-900">{workedSummary.completed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => {
                setActiveTab('apply');
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'apply' ?
              'border-blue-600 text-blue-600 bg-blue-50' :
              'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`
              }>

              <CalendarPlus className="w-5 h-5" />
              Apply for Overtime
            </button>
            <button
              onClick={() => {
                setActiveTab('requests');
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'requests' ?
              'border-blue-600 text-blue-600 bg-blue-50' :
              'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`
              }>

              <ListChecks className="w-5 h-5" />
              Overtime Requests
              {requestsSummary.pending > 0 &&
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {requestsSummary.pending}
                </span>
              }
            </button>
            <button
              onClick={() => {
                setActiveTab('worked');
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'worked' ?
              'border-blue-600 text-blue-600 bg-blue-50' :
              'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`
              }>

              <FileCheck className="w-5 h-5" />
              Worked Overtime
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {workedSummary.total}
              </span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Apply for Overtime Tab */}
          {activeTab === 'apply' &&
          <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Apply for Overtime</h2>
                  <p className="text-sm text-gray-500">
                    Submit a new overtime request for approval
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmitRequest} className="space-y-6">
                {/* Employee Selection */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Employee <span className="text-red-500">*</span>
                      </label>
                      <select
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required>

                        <option value="">Choose an employee...</option>
                        {employees.map((emp) =>
                      <option key={emp.id} value={emp.id}>
                            {emp.name} ({emp.id}) - {emp.department}
                          </option>
                      )}
                      </select>
                    </div>

                    {/* Employee Details Card */}
                    {selectedEmployeeDetails &&
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                            {selectedEmployeeDetails.avatar}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {selectedEmployeeDetails.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {selectedEmployeeDetails.designation}
                            </p>
                            <p className="text-sm text-gray-500">
                              {selectedEmployeeDetails.department}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Shift</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedEmployeeDetails.shift}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Shift Timing</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedEmployeeDetails.shiftStartTime} -{' '}
                              {selectedEmployeeDetails.shiftEndTime}
                            </p>
                          </div>
                        </div>
                      </div>
                  }

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Overtime Date <span className="text-red-500">*</span>
                      </label>
                      <input
                      type="date"
                      value={overtimeDate}
                      onChange={(e) => setOvertimeDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required />

                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expected Start Time <span className="text-red-500">*</span>
                        </label>
                        <input
                        type="time"
                        value={expectedStartTime}
                        onChange={(e) => setExpectedStartTime(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required />

                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expected End Time <span className="text-red-500">*</span>
                        </label>
                        <input
                        type="time"
                        value={expectedEndTime}
                        onChange={(e) => setExpectedEndTime(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required />

                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expected OT Hours <span className="text-red-500">*</span>
                        </label>
                        <input
                        type="number"
                        step="0.5"
                        min="0.5"
                        max="12"
                        value={expectedHours}
                        onChange={(e) => setExpectedHours(e.target.value)}
                        placeholder="e.g., 3.5"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required />

                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Priority <span className="text-red-500">*</span>
                        </label>
                        <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required>

                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="critical">Critical</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Code
                      </label>
                      <input
                      type="text"
                      value={projectCode}
                      onChange={(e) => setProjectCode(e.target.value)}
                      placeholder="e.g., PRJ-2025-001"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Task Description
                      </label>
                      <input
                      type="text"
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                      placeholder="Brief description of the task"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reason for Overtime <span className="text-red-500">*</span>
                      </label>
                      <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={5}
                      placeholder="Provide detailed reason for overtime request..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required />

                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <p className="font-medium mb-1">Important Notes:</p>
                          <ul className="list-disc list-inside space-y-1 text-blue-700">
                            <li>Overtime requests must be submitted at least 24 hours in advance</li>
                            <li>Maximum overtime allowed per day is 4 hours</li>
                            <li>Requests exceeding 4 hours require special approval</li>
                            <li>Manager approval is required for all overtime requests</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSelectedEmployee('');
                    setOvertimeDate('');
                    setExpectedStartTime('');
                    setExpectedEndTime('');
                    setExpectedHours('');
                    setReason('');
                    setProjectCode('');
                    setTaskDescription('');
                    setPriority('medium');
                  }}>

                    <X className="w-4 h-4 mr-2" />
                    Clear Form
                  </Button>
                  <Button type="button" variant="outline">
                    <Save className="w-4 h-4 mr-2" />
                    Save as Draft
                  </Button>
                  <Button type="submit" variant="primary">
                    <Send className="w-4 h-4 mr-2" />
                    Submit Request
                  </Button>
                </div>
              </form>
            </div>
          }

          {/* Overtime Requests Tab */}
          {activeTab === 'requests' &&
          <div className="space-y-6">
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                  type="text"
                  placeholder="Search by name, ID, or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

                </div>
                <Select
                label=""
                options={[
                { value: 'all', label: 'All Departments' },
                ...departments.map((dept) => ({ value: dept, label: dept }))]
                }
                value={departmentFilter}
                onChange={(e) => {
                  setDepartmentFilter(e.target.value);
                  setCurrentPage(1);
                }} />

                <Select
                label=""
                options={[
                { value: 'all', label: 'All Status' },
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' }]
                }
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }} />

                <div className="flex gap-2">
                  <Input
                  label=""
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)} />

                </div>
              </div>

              {/* Requests Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                        Employee
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                        OT Date
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                        Timing
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                        Hours
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                        Reason
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                        Priority
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRequests.map((request) => {
                    const statusConfig = getStatusConfig(request.status);
                    const priorityConfig = getPriorityConfig(request.priority);
                    const isExpanded = expandedRows.has(request.id);

                    return (
                      <React.Fragment key={request.id}>
                          <tr className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                                  {request.employeeAvatar}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {request.employeeName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {request.employeeCode}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1 text-gray-700">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {formatDate(request.overtimeDate)}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-700 text-sm">
                              {request.expectedStartTime} - {request.expectedEndTime}
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-semibold text-blue-600">
                                {request.expectedHours} hrs
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div
                              className="max-w-[200px] truncate text-gray-700 text-sm"
                              title={request.reason}>

                                {request.reason}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${priorityConfig.bgColor} ${priorityConfig.textColor}`}>

                                {priorityConfig.label}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>

                                {statusConfig.icon}
                                {statusConfig.label}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                {request.status === 'pending' ?
                              <>
                                    <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleApprove(request)}
                                  title="Approve">

                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                    </Button>
                                    <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleReject(request)}
                                  title="Reject">

                                      <XCircle className="w-4 h-4 text-red-600" />
                                    </Button>
                                  </> :

                              <Button variant="outline" size="sm" disabled>
                                    Processed
                                  </Button>
                              }
                                <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleRowExpansion(request.id)}
                                title="View Details">

                                  {isExpanded ?
                                <ChevronUp className="w-4 h-4 text-gray-500" /> :

                                <ChevronDown className="w-4 h-4 text-gray-500" />
                                }
                                </Button>
                              </div>
                            </td>
                          </tr>
                          {isExpanded &&
                        <tr className="bg-gray-50">
                              <td colSpan={8} className="py-4 px-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                  <div className="space-y-2">
                                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                      <User className="w-4 h-4 text-gray-500" />
                                      Employee Details
                                    </h4>
                                    <div className="bg-white rounded-lg p-3 space-y-1 text-sm">
                                      <p>
                                        <span className="text-gray-500">Department:</span>{' '}
                                        <span className="text-gray-900">{request.department}</span>
                                      </p>
                                      <p>
                                        <span className="text-gray-500">Designation:</span>{' '}
                                        <span className="text-gray-900">{request.designation}</span>
                                      </p>
                                      <p>
                                        <span className="text-gray-500">Requested:</span>{' '}
                                        <span className="text-gray-900">{request.requestedAt}</span>
                                      </p>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                      <Briefcase className="w-4 h-4 text-gray-500" />
                                      Project Info
                                    </h4>
                                    <div className="bg-white rounded-lg p-3 space-y-1 text-sm">
                                      {request.projectCode &&
                                  <p>
                                          <span className="text-gray-500">Project:</span>{' '}
                                          <span className="text-gray-900 font-medium">
                                            {request.projectCode}
                                          </span>
                                        </p>
                                  }
                                      {request.taskDescription &&
                                  <p>
                                          <span className="text-gray-500">Task:</span>{' '}
                                          <span className="text-gray-900">
                                            {request.taskDescription}
                                          </span>
                                        </p>
                                  }
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                      <FileText className="w-4 h-4 text-gray-500" />
                                      Full Reason
                                    </h4>
                                    <div className="bg-white rounded-lg p-3 text-sm text-gray-700">
                                      {request.reason}
                                    </div>
                                  </div>
                                  {(request.approvedBy || request.rejectionReason) &&
                              <div className="space-y-2">
                                      <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                        <CheckSquare className="w-4 h-4 text-gray-500" />
                                        Approval Info
                                      </h4>
                                      <div className="bg-white rounded-lg p-3 space-y-1 text-sm">
                                        {request.approvedBy &&
                                  <p>
                                            <span className="text-gray-500">Processed by:</span>{' '}
                                            <span className="text-gray-900">
                                              {request.approvedBy}
                                            </span>
                                          </p>
                                  }
                                        {request.approvedAt &&
                                  <p>
                                            <span className="text-gray-500">Date:</span>{' '}
                                            <span className="text-gray-900">
                                              {request.approvedAt}
                                            </span>
                                          </p>
                                  }
                                        {request.rejectionReason &&
                                  <p>
                                            <span className="text-gray-500">Reason:</span>{' '}
                                            <span className="text-red-600">
                                              {request.rejectionReason}
                                            </span>
                                          </p>
                                  }
                                      </div>
                                    </div>
                              }
                                </div>
                              </td>
                            </tr>
                        }
                        </React.Fragment>);

                  })}
                  </tbody>
                </table>
              </div>

              {filteredRequests.length === 0 &&
            <div className="py-12 text-center">
                  <ListChecks className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No overtime requests found
                  </h3>
                  <p className="text-gray-500">Try adjusting your filters</p>
                </div>
            }

              {/* Pagination */}
              {filteredRequests.length > 0 &&
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * recordsPerPage + 1}-
                    {Math.min(currentPage * recordsPerPage, filteredRequests.length)} of{' '}
                    {filteredRequests.length} requests
                  </div>
                  <div className="flex gap-2">
                    <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}>

                      Previous
                    </Button>
                    {Array.from({ length: totalRequestPages }, (_, i) => i + 1).map((page) =>
                <Button
                  key={page}
                  variant={page === currentPage ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}>

                        {page}
                      </Button>
                )}
                    <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalRequestPages, p + 1))}
                  disabled={currentPage === totalRequestPages}>

                      Next
                    </Button>
                  </div>
                </div>
            }
            </div>
          }

          {/* Worked Overtime Tab */}
          {activeTab === 'worked' &&
          <div className="space-y-6">
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                  type="text"
                  placeholder="Search by name, ID, or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

                </div>
                <Select
                label=""
                options={[
                { value: 'all', label: 'All Departments' },
                ...departments.map((dept) => ({ value: dept, label: dept }))]
                }
                value={departmentFilter}
                onChange={(e) => {
                  setDepartmentFilter(e.target.value);
                  setCurrentPage(1);
                }} />

                <Select
                label=""
                options={[
                { value: 'all', label: 'All Status' },
                { value: 'completed', label: 'Completed' },
                { value: 'exceeded', label: 'Exceeded' },
                { value: 'partial', label: 'Partial' }]
                }
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }} />

                <div className="flex gap-2">
                  <Input
                  label=""
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)} />

                </div>
              </div>

              {/* Worked OT Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-100 rounded-xl p-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">{workedSummary.total}</p>
                  <p className="text-sm text-gray-500">Total Records</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">{workedSummary.completed}</p>
                  <p className="text-sm text-gray-500">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange-600">{workedSummary.exceeded}</p>
                  <p className="text-sm text-gray-500">Exceeded</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">{workedSummary.totalHours}</p>
                  <p className="text-sm text-gray-500">Total Hours</p>
                </div>
              </div>

              {/* Worked OT Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                        Employee
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                        Shift End
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                        Actual Out
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                        OT Hours
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                        Approved
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedWorkedOT.map((record) => {
                    const statusConfig = getStatusConfig(record.status);
                    const isExpanded = expandedRows.has(record.id);
                    const hoursDiff = record.actualOTHours - record.approvedHours;

                    return (
                      <React.Fragment key={record.id}>
                          <tr className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-semibold text-sm">
                                  {record.employeeAvatar}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {record.employeeName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {record.employeeCode}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1 text-gray-700">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {formatDate(record.date)}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-700">{record.shiftEndTime}</td>
                            <td className="py-3 px-4 text-gray-700">{record.actualOutTime}</td>
                            <td className="py-3 px-4">
                              <span className="font-semibold text-blue-600">
                                {record.actualOTHours} hrs
                              </span>
                              {hoursDiff !== 0 &&
                            <span
                              className={`ml-1 text-xs ${
                              hoursDiff > 0 ? 'text-orange-600' : 'text-green-600'}`
                              }>

                                  ({hoursDiff > 0 ? '+' : ''}
                                  {hoursDiff.toFixed(2)})
                                </span>
                            }
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-gray-700">{record.approvedHours} hrs</span>
                            </td>
                            <td className="py-3 px-4">
                              <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>

                                {statusConfig.icon}
                                {statusConfig.label}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleRowExpansion(record.id)}
                                title="View Details">

                                  {isExpanded ?
                                <ChevronUp className="w-4 h-4 text-gray-500" /> :

                                <ChevronDown className="w-4 h-4 text-gray-500" />
                                }
                                </Button>
                                <Button variant="outline" size="sm" title="Edit">
                                  <Edit className="w-4 h-4 text-gray-500" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                          {isExpanded &&
                        <tr className="bg-gray-50">
                              <td colSpan={8} className="py-4 px-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                  <div className="space-y-2">
                                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                      <User className="w-4 h-4 text-gray-500" />
                                      Employee Details
                                    </h4>
                                    <div className="bg-white rounded-lg p-3 space-y-1 text-sm">
                                      <p>
                                        <span className="text-gray-500">Department:</span>{' '}
                                        <span className="text-gray-900">{record.department}</span>
                                      </p>
                                      <p>
                                        <span className="text-gray-500">Designation:</span>{' '}
                                        <span className="text-gray-900">{record.designation}</span>
                                      </p>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                      <Briefcase className="w-4 h-4 text-gray-500" />
                                      Project Info
                                    </h4>
                                    <div className="bg-white rounded-lg p-3 space-y-1 text-sm">
                                      {record.projectCode &&
                                  <p>
                                          <span className="text-gray-500">Project:</span>{' '}
                                          <span className="text-gray-900 font-medium">
                                            {record.projectCode}
                                          </span>
                                        </p>
                                  }
                                      {record.taskDescription &&
                                  <p>
                                          <span className="text-gray-500">Task:</span>{' '}
                                          <span className="text-gray-900">
                                            {record.taskDescription}
                                          </span>
                                        </p>
                                  }
                                      <p>
                                        <span className="text-gray-500">Reason:</span>{' '}
                                        <span className="text-gray-900">{record.reason}</span>
                                      </p>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                      <Timer className="w-4 h-4 text-gray-500" />
                                      Time Summary
                                    </h4>
                                    <div className="bg-white rounded-lg p-3 space-y-1 text-sm">
                                      <p>
                                        <span className="text-gray-500">Shift End:</span>{' '}
                                        <span className="text-gray-900">{record.shiftEndTime}</span>
                                      </p>
                                      <p>
                                        <span className="text-gray-500">Actual Out:</span>{' '}
                                        <span className="text-gray-900">{record.actualOutTime}</span>
                                      </p>
                                      <p>
                                        <span className="text-gray-500">Approved:</span>{' '}
                                        <span className="text-gray-900">
                                          {record.approvedHours} hrs
                                        </span>
                                      </p>
                                      <p>
                                        <span className="text-gray-500">Actual:</span>{' '}
                                        <span className="text-blue-600 font-medium">
                                          {record.actualOTHours} hrs
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                      <CheckSquare className="w-4 h-4 text-gray-500" />
                                      Verification
                                    </h4>
                                    <div className="bg-white rounded-lg p-3 space-y-1 text-sm">
                                      <p>
                                        <span className="text-gray-500">Verified by:</span>{' '}
                                        <span className="text-gray-900">{record.verifiedBy}</span>
                                      </p>
                                      <p>
                                        <span className="text-gray-500">Date:</span>{' '}
                                        <span className="text-gray-900">{record.verifiedAt}</span>
                                      </p>
                                      {record.remarks &&
                                  <p>
                                          <span className="text-gray-500">Remarks:</span>{' '}
                                          <span className="text-gray-900">{record.remarks}</span>
                                        </p>
                                  }
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                        }
                        </React.Fragment>);

                  })}
                  </tbody>
                </table>
              </div>

              {filteredWorkedOT.length === 0 &&
            <div className="py-12 text-center">
                  <FileCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No worked overtime records found
                  </h3>
                  <p className="text-gray-500">Try adjusting your filters</p>
                </div>
            }

              {/* Pagination */}
              {filteredWorkedOT.length > 0 &&
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * recordsPerPage + 1}-
                    {Math.min(currentPage * recordsPerPage, filteredWorkedOT.length)} of{' '}
                    {filteredWorkedOT.length} records
                  </div>
                  <div className="flex gap-2">
                    <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}>

                      Previous
                    </Button>
                    {Array.from({ length: totalWorkedPages }, (_, i) => i + 1).map((page) =>
                <Button
                  key={page}
                  variant={page === currentPage ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}>

                        {page}
                      </Button>
                )}
                    <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalWorkedPages, p + 1))}
                  disabled={currentPage === totalWorkedPages}>

                      Next
                    </Button>
                  </div>
                </div>
            }
            </div>
          }
        </div>
      </div>

      {/* Approval Modal */}
      {showApprovalModal && selectedRecord && 'expectedHours' in selectedRecord &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setShowApprovalModal(false)} />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-green-50">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Approve Overtime Request
              </h3>
              <button
              onClick={() => setShowApprovalModal(false)}
              className="p-2 hover:bg-white rounded-lg transition-colors">

                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                  {selectedRecord.employeeAvatar}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{selectedRecord.employeeName}</h4>
                  <p className="text-sm text-gray-500">{selectedRecord.department}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-sm">
                  <span className="text-gray-500">OT Date:</span>{' '}
                  <span className="font-medium text-gray-900">
                    {formatDate(selectedRecord.overtimeDate)}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">Timing:</span>{' '}
                  <span className="font-medium text-gray-900">
                    {selectedRecord.expectedStartTime} - {selectedRecord.expectedEndTime}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">Expected Hours:</span>{' '}
                  <span className="font-medium text-blue-600">
                    {selectedRecord.expectedHours} hrs
                  </span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">Reason:</span>{' '}
                  <span className="font-medium text-gray-900">{selectedRecord.reason}</span>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Approval Remarks (Optional)
                </label>
                <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                rows={3}
                placeholder="Add any remarks for approval..."
                value={approvalRemarks}
                onChange={(e) => setApprovalRemarks(e.target.value)} />

              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowApprovalModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={confirmApproval}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve Request
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Rejection Modal */}
      {showRejectionModal && selectedRecord && 'expectedHours' in selectedRecord &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setShowRejectionModal(false)} />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-red-50">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                Reject Overtime Request
              </h3>
              <button
              onClick={() => setShowRejectionModal(false)}
              className="p-2 hover:bg-white rounded-lg transition-colors">

                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                  {selectedRecord.employeeAvatar}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{selectedRecord.employeeName}</h4>
                  <p className="text-sm text-gray-500">{selectedRecord.department}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-sm">
                  <span className="text-gray-500">OT Date:</span>{' '}
                  <span className="font-medium text-gray-900">
                    {formatDate(selectedRecord.overtimeDate)}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">Expected Hours:</span>{' '}
                  <span className="font-medium text-blue-600">
                    {selectedRecord.expectedHours} hrs
                  </span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">Reason:</span>{' '}
                  <span className="font-medium text-gray-900">{selectedRecord.reason}</span>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                rows={3}
                placeholder="Please provide reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                required />

              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowRejectionModal(false)}>
                Cancel
              </Button>
              <Button
              variant="primary"
              onClick={confirmRejection}
              disabled={!rejectionReason.trim()}
              className="bg-red-600 hover:bg-red-700">

                <XCircle className="w-4 h-4 mr-2" />
                Reject Request
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}