import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import {
  UsersIcon,
  GraduationCapIcon,
  BriefcaseIcon,
  UserPlusIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  MinusIcon,
  DownloadIcon,
  RefreshCwIcon,
  CalendarIcon,
  PieChartIcon,
  BarChart3Icon,
  TableIcon,
  ArrowUpRightIcon,
  ArrowDownRightIcon,
  FilterIcon,
  PrinterIcon,
  FileSpreadsheetIcon,
  SearchIcon,
  StarIcon,
  EyeIcon,
  MailIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  Loader2Icon,
  ChevronDownIcon,
  ChevronRightIcon,
  XIcon,
  PlusIcon,
  FileTextIcon,
  FileIcon,
  BuildingIcon,
  MapPinIcon,
  BookOpenIcon,
  ShieldCheckIcon,
  HeartIcon,
  AlertCircleIcon,
  InfoIcon,
  LayoutGridIcon,
  ListIcon,
  SettingsIcon,
  CopyIcon,
  Share2Icon,
  MoreVerticalIcon,
  CheckIcon,
  ZapIcon,
  AwardIcon,
  WalletIcon,
  PercentIcon,
  IndianRupeeIcon,
  UserCheckIcon,
  UserXIcon,
  FolderOpenIcon,
  HistoryIcon,
  ActivityIcon,
  LayersIcon,
  TagIcon,
  ScaleIcon,
  FileBarChartIcon,
  ClipboardListIcon,
  SendIcon,
  BellIcon,
  CalendarCheckIcon,
  FileArchiveIcon,
  ArchiveIcon,
  ImageIcon,
  AlertTriangleIcon,
  CircleIcon,
  HashIcon,
  SortAscIcon,
  GroupIcon,
  FileOutputIcon } from
'lucide-react';

// Types
interface Branch {
  id: string;
  name: string;
  shortName: string;
  city: string;
  color: string;
  studentCount: number;
  staffCount: number;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: ReportCategory;
  tags: string[];
  icon: React.ReactNode;
  isFavorite: boolean;
  isNew: boolean;
  lastGenerated?: string;
  requiredFilters: string[];
  governmentRequired?: boolean;
  board?: ('GSEB' | 'CBSE' | 'ICSE' | 'All')[];
}

interface GeneratedReport {
  id: string;
  templateId: string;
  name: string;
  type: string;
  generatedDate: string;
  generatedBy: string;
  branches: string[];
  format: 'PDF' | 'Excel' | 'CSV';
  fileSize: string;
  status: 'completed' | 'processing' | 'failed';
  downloadUrl?: string;
  filters?: Record<string, string>;
}

interface LiveStats {
  totalStaff: number;
  teachingStaff: number;
  nonTeachingStaff: number;
  maleCount: number;
  femaleCount: number;
  otherCount: number;
  newJoinees: number;
  resignations: number;
  retirements: number;
  contractual: number;
  permanent: number;
}

interface BranchStats extends LiveStats {
  branchId: string;
  branchName: string;
}

interface AuditLogEntry {
  id: string;
  action: string;
  reportName: string;
  user: string;
  timestamp: string;
  details: string;
}

type ReportCategory =
'strength' |
'reservation' |
'demographic' |
'financial' |
'list' |
'analysis' |
'government' |
'admission' |
'attendance' |
'academic' |
'comparative' |
'custom';

// Mock Data
const branches: Branch[] = [
{
  id: 'branch1',
  name: 'Main Campus',
  shortName: 'MC',
  city: 'Ahmedabad',
  color: '#3B82F6',
  studentCount: 1250,
  staffCount: 85
},
{
  id: 'branch2',
  name: 'Junior Wing',
  shortName: 'JW',
  city: 'Ahmedabad',
  color: '#10B981',
  studentCount: 650,
  staffCount: 45
},
{
  id: 'branch3',
  name: 'Senior Secondary',
  shortName: 'SS',
  city: 'Gandhinagar',
  color: '#8B5CF6',
  studentCount: 480,
  staffCount: 35
},
{
  id: 'branch4',
  name: 'CBSE Wing',
  shortName: 'CB',
  city: 'Ahmedabad',
  color: '#F59E0B',
  studentCount: 380,
  staffCount: 28
}];


const reportCategories: {value: ReportCategory;label: string;icon: React.ReactNode;color: string;count: number;}[] = [
{ value: 'strength', label: 'Strength Reports', icon: <UsersIcon className="w-4 h-4" />, color: 'bg-blue-500', count: 8 },
{ value: 'admission', label: 'Admission Reports', icon: <UserPlusIcon className="w-4 h-4" />, color: 'bg-indigo-500', count: 10 },
{ value: 'reservation', label: 'Reservation & Compliance', icon: <ShieldCheckIcon className="w-4 h-4" />, color: 'bg-purple-500', count: 15 },
{ value: 'attendance', label: 'Attendance Reports', icon: <CalendarCheckIcon className="w-4 h-4" />, color: 'bg-cyan-500', count: 8 },
{ value: 'academic', label: 'Academic Performance', icon: <GraduationCapIcon className="w-4 h-4" />, color: 'bg-emerald-500', count: 12 },
{ value: 'demographic', label: 'Demographic Reports', icon: <PieChartIcon className="w-4 h-4" />, color: 'bg-green-500', count: 6 },
{ value: 'financial', label: 'Financial Reports', icon: <IndianRupeeIcon className="w-4 h-4" />, color: 'bg-amber-500', count: 8 },
{ value: 'list', label: 'List Reports', icon: <ListIcon className="w-4 h-4" />, color: 'bg-teal-500', count: 10 },
{ value: 'comparative', label: 'Comparative Reports', icon: <BarChart3Icon className="w-4 h-4" />, color: 'bg-pink-500', count: 6 },
{ value: 'government', label: 'Government Reports', icon: <BuildingIcon className="w-4 h-4" />, color: 'bg-red-500', count: 18 },
{ value: 'custom', label: 'Custom Reports', icon: <SettingsIcon className="w-4 h-4" />, color: 'bg-gray-500', count: 3 }];


const reportTemplates: ReportTemplate[] = [
// Strength Reports
{
  id: 'str1',
  name: 'Staff Strength Summary',
  description: 'Overall staff strength with department-wise breakdown',
  category: 'strength',
  tags: ['strength', 'department', 'summary'],
  icon: <UsersIcon className="w-5 h-5" />,
  isFavorite: true,
  isNew: false,
  lastGenerated: '2025-01-25',
  requiredFilters: ['branch', 'date'],
  board: ['All']
},
{
  id: 'str2',
  name: 'Teaching vs Non-Teaching Ratio',
  description: 'Comparison of teaching and non-teaching staff',
  category: 'strength',
  tags: ['ratio', 'teaching', 'non-teaching'],
  icon: <ScaleIcon className="w-5 h-5" />,
  isFavorite: false,
  isNew: false,
  lastGenerated: '2025-01-20',
  requiredFilters: ['branch', 'date'],
  board: ['All']
},
{
  id: 'str3',
  name: 'Department-wise Staff Strength',
  description: 'Detailed strength report by department',
  category: 'strength',
  tags: ['department', 'detailed'],
  icon: <LayersIcon className="w-5 h-5" />,
  isFavorite: true,
  isNew: false,
  requiredFilters: ['branch', 'department'],
  board: ['All']
},

// Admission Reports
{
  id: 'adm1',
  name: 'Student Admission Report',
  description: 'Complete admission data with demographics and categories',
  category: 'admission',
  tags: ['admission', 'student', 'demographics'],
  icon: <UserPlusIcon className="w-5 h-5" />,
  isFavorite: true,
  isNew: false,
  lastGenerated: '2025-01-26',
  requiredFilters: ['branch', 'academicYear', 'grade'],
  board: ['All']
},
{
  id: 'adm2',
  name: 'Category-wise Admission Report',
  description: 'Admissions categorized by General/OBC/SC/ST/EWS',
  category: 'admission',
  tags: ['category', 'reservation', 'admission'],
  icon: <ClipboardListIcon className="w-5 h-5" />,
  isFavorite: true,
  isNew: false,
  requiredFilters: ['branch', 'academicYear', 'category'],
  governmentRequired: true,
  board: ['GSEB', 'CBSE']
},
{
  id: 'adm3',
  name: 'Gender-wise Admission Analysis',
  description: 'Admission statistics by gender across grades',
  category: 'admission',
  tags: ['gender', 'admission', 'analysis'],
  icon: <PieChartIcon className="w-5 h-5" />,
  isFavorite: false,
  isNew: true,
  requiredFilters: ['branch', 'academicYear', 'gender'],
  governmentRequired: true,
  board: ['All']
},

// Reservation Reports (Government Required)
{
  id: 'res1',
  name: 'RTE Admission Compliance Report',
  description: 'Right to Education Act compliance for student admissions',
  category: 'reservation',
  tags: ['RTE', 'compliance', 'government', 'admission'],
  icon: <ShieldCheckIcon className="w-5 h-5" />,
  isFavorite: true,
  isNew: false,
  lastGenerated: '2025-01-22',
  requiredFilters: ['branch', 'academicYear', 'rte'],
  governmentRequired: true,
  board: ['GSEB', 'CBSE']
},
{
  id: 'res2',
  name: 'EWS Admission Report',
  description: 'Economically Weaker Section admission details',
  category: 'reservation',
  tags: ['EWS', 'reservation', 'government', 'admission'],
  icon: <WalletIcon className="w-5 h-5" />,
  isFavorite: false,
  isNew: true,
  requiredFilters: ['branch', 'academicYear', 'ews'],
  governmentRequired: true,
  board: ['GSEB', 'CBSE']
},
{
  id: 'res3',
  name: 'SC/ST/OBC Student Roster',
  description: 'Caste-wise student admission roster as per government norms',
  category: 'reservation',
  tags: ['SC', 'ST', 'OBC', 'roster', 'government'],
  icon: <TableIcon className="w-5 h-5" />,
  isFavorite: true,
  isNew: false,
  lastGenerated: '2025-01-18',
  requiredFilters: ['branch', 'category', 'academicYear'],
  governmentRequired: true,
  board: ['GSEB', 'CBSE']
},
{
  id: 'res4',
  name: 'Minority Student Report',
  description: 'Religious and linguistic minority student details',
  category: 'reservation',
  tags: ['minority', 'religion', 'government'],
  icon: <HeartIcon className="w-5 h-5" />,
  isFavorite: false,
  isNew: false,
  requiredFilters: ['branch', 'minority'],
  governmentRequired: true,
  board: ['GSEB', 'CBSE']
},
{
  id: 'res5',
  name: 'PWD Student Compliance Report',
  description: 'Persons with Disability student admission compliance',
  category: 'reservation',
  tags: ['PWD', 'disability', 'compliance'],
  icon: <UserCheckIcon className="w-5 h-5" />,
  isFavorite: false,
  isNew: true,
  requiredFilters: ['branch', 'academicYear'],
  governmentRequired: true,
  board: ['All']
},

// Attendance Reports
{
  id: 'att1',
  name: 'Student Attendance Summary',
  description: 'Overall attendance statistics by class and section',
  category: 'attendance',
  tags: ['attendance', 'summary', 'student'],
  icon: <CalendarCheckIcon className="w-5 h-5" />,
  isFavorite: true,
  isNew: false,
  lastGenerated: '2025-01-25',
  requiredFilters: ['branch', 'grade', 'dateRange'],
  board: ['All']
},
{
  id: 'att2',
  name: 'Category-wise Attendance Report',
  description: 'Attendance analysis by reservation category',
  category: 'attendance',
  tags: ['attendance', 'category', 'reservation'],
  icon: <BarChart3Icon className="w-5 h-5" />,
  isFavorite: false,
  isNew: false,
  requiredFilters: ['branch', 'category', 'dateRange'],
  governmentRequired: true,
  board: ['GSEB', 'CBSE']
},
{
  id: 'att3',
  name: 'RTE Students Attendance Report',
  description: 'Attendance tracking for RTE admitted students',
  category: 'attendance',
  tags: ['RTE', 'attendance', 'government'],
  icon: <ShieldCheckIcon className="w-5 h-5" />,
  isFavorite: true,
  isNew: false,
  requiredFilters: ['branch', 'rte', 'dateRange'],
  governmentRequired: true,
  board: ['GSEB', 'CBSE']
},
{
  id: 'att4',
  name: 'Gender-wise Attendance Analysis',
  description: 'Attendance comparison by gender',
  category: 'attendance',
  tags: ['gender', 'attendance', 'analysis'],
  icon: <PieChartIcon className="w-5 h-5" />,
  isFavorite: false,
  isNew: true,
  requiredFilters: ['branch', 'gender', 'dateRange'],
  governmentRequired: true,
  board: ['All']
},

// Academic Performance Reports
{
  id: 'acad1',
  name: 'Exam Performance Summary',
  description: 'Overall exam results and pass percentage',
  category: 'academic',
  tags: ['exam', 'performance', 'results'],
  icon: <GraduationCapIcon className="w-5 h-5" />,
  isFavorite: true,
  isNew: false,
  lastGenerated: '2025-01-20',
  requiredFilters: ['branch', 'grade', 'exam'],
  board: ['All']
},
{
  id: 'acad2',
  name: 'Category-wise Academic Performance',
  description: 'Exam performance analysis by reservation category',
  category: 'academic',
  tags: ['category', 'performance', 'reservation'],
  icon: <BarChart3Icon className="w-5 h-5" />,
  isFavorite: true,
  isNew: false,
  requiredFilters: ['branch', 'category', 'exam'],
  governmentRequired: true,
  board: ['GSEB', 'CBSE']
},
{
  id: 'acad3',
  name: 'RTE Students Performance Report',
  description: 'Academic performance of RTE admitted students',
  category: 'academic',
  tags: ['RTE', 'performance', 'government'],
  icon: <ShieldCheckIcon className="w-5 h-5" />,
  isFavorite: false,
  isNew: true,
  requiredFilters: ['branch', 'rte', 'exam'],
  governmentRequired: true,
  board: ['GSEB', 'CBSE']
},
{
  id: 'acad4',
  name: 'Gender-wise Performance Analysis',
  description: 'Academic performance comparison by gender',
  category: 'academic',
  tags: ['gender', 'performance', 'analysis'],
  icon: <PieChartIcon className="w-5 h-5" />,
  isFavorite: false,
  isNew: false,
  requiredFilters: ['branch', 'gender', 'exam'],
  governmentRequired: true,
  board: ['All']
},
{
  id: 'acad5',
  name: 'EWS Students Performance Report',
  description: 'Academic performance of EWS category students',
  category: 'academic',
  tags: ['EWS', 'performance', 'government'],
  icon: <WalletIcon className="w-5 h-5" />,
  isFavorite: false,
  isNew: true,
  requiredFilters: ['branch', 'ews', 'exam'],
  governmentRequired: true,
  board: ['GSEB', 'CBSE']
},

// Government Reports
{
  id: 'gov1',
  name: 'UDISE+ Annual Data Report',
  description: 'Unified District Information System for Education Plus format',
  category: 'government',
  tags: ['UDISE', 'government', 'annual'],
  icon: <BuildingIcon className="w-5 h-5" />,
  isFavorite: true,
  isNew: false,
  lastGenerated: '2025-01-15',
  requiredFilters: ['branch', 'academicYear'],
  governmentRequired: true,
  board: ['All']
},
{
  id: 'gov2',
  name: 'GSEB Student Data Report',
  description: 'Gujarat Secondary Education Board student data format',
  category: 'government',
  tags: ['GSEB', 'roster', 'student'],
  icon: <FileTextIcon className="w-5 h-5" />,
  isFavorite: true,
  isNew: false,
  requiredFilters: ['branch', 'academicYear', 'grade'],
  governmentRequired: true,
  board: ['GSEB']
},
{
  id: 'gov3',
  name: 'CBSE Affiliation Data Report',
  description: 'Student and staff details as per CBSE affiliation requirements',
  category: 'government',
  tags: ['CBSE', 'affiliation', 'compliance'],
  icon: <ShieldCheckIcon className="w-5 h-5" />,
  isFavorite: true,
  isNew: false,
  requiredFilters: ['branch', 'academicYear'],
  governmentRequired: true,
  board: ['CBSE']
},
{
  id: 'gov4',
  name: 'RTE Compliance Certificate Data',
  description: 'Data required for RTE compliance certification',
  category: 'government',
  tags: ['RTE', 'certificate', 'compliance'],
  icon: <AwardIcon className="w-5 h-5" />,
  isFavorite: false,
  isNew: true,
  requiredFilters: ['branch', 'academicYear'],
  governmentRequired: true,
  board: ['GSEB', 'CBSE']
},
{
  id: 'gov5',
  name: 'Caste Certificate Verification Report',
  description: 'Status of caste certificate verification for reserved categories',
  category: 'government',
  tags: ['caste', 'verification', 'government'],
  icon: <FileTextIcon className="w-5 h-5" />,
  isFavorite: false,
  isNew: false,
  requiredFilters: ['branch', 'category'],
  governmentRequired: true,
  board: ['GSEB', 'CBSE']
},
{
  id: 'gov6',
  name: 'Teacher-Student Ratio Report',
  description: 'As per RTE and board norms',
  category: 'government',
  tags: ['ratio', 'RTE', 'norms'],
  icon: <ScaleIcon className="w-5 h-5" />,
  isFavorite: true,
  isNew: false,
  requiredFilters: ['branch', 'grade'],
  governmentRequired: true,
  board: ['All']
},

// Financial Reports
{
  id: 'fin1',
  name: 'Fee Collection Status Report',
  description: 'Fee collection status - Paid/Partial/Pending/Waived',
  category: 'financial',
  tags: ['fee', 'collection', 'status'],
  icon: <IndianRupeeIcon className="w-5 h-5" />,
  isFavorite: true,
  isNew: false,
  lastGenerated: '2025-01-20',
  requiredFilters: ['branch', 'grade', 'feeStatus'],
  board: ['All']
},
{
  id: 'fin2',
  name: 'RTE Fee Reimbursement Report',
  description: 'Fee reimbursement claims for RTE students',
  category: 'financial',
  tags: ['RTE', 'fee', 'reimbursement', 'government'],
  icon: <WalletIcon className="w-5 h-5" />,
  isFavorite: true,
  isNew: false,
  requiredFilters: ['branch', 'academicYear', 'rte'],
  governmentRequired: true,
  board: ['GSEB', 'CBSE']
},
{
  id: 'fin3',
  name: 'Category-wise Fee Collection',
  description: 'Fee collection analysis by reservation category',
  category: 'financial',
  tags: ['category', 'fee', 'collection'],
  icon: <BarChart3Icon className="w-5 h-5" />,
  isFavorite: false,
  isNew: false,
  requiredFilters: ['branch', 'category', 'feeStatus'],
  board: ['All']
},

// Comparative Reports
{
  id: 'comp1',
  name: 'Branch-wise Admission Comparison',
  description: 'Compare admissions across branches',
  category: 'comparative',
  tags: ['branch', 'comparison', 'admission'],
  icon: <BarChart3Icon className="w-5 h-5" />,
  isFavorite: true,
  isNew: false,
  requiredFilters: ['branches', 'academicYear'],
  board: ['All']
},
{
  id: 'comp2',
  name: 'Year-over-Year Admission Trend',
  description: 'Admission trends comparison across years',
  category: 'comparative',
  tags: ['trend', 'year', 'admission'],
  icon: <TrendingUpIcon className="w-5 h-5" />,
  isFavorite: false,
  isNew: true,
  requiredFilters: ['branch', 'years'],
  board: ['All']
},
{
  id: 'comp3',
  name: 'Category-wise Trend Analysis',
  description: 'Reservation category trends over years',
  category: 'comparative',
  tags: ['category', 'trend', 'analysis'],
  icon: <BarChart3Icon className="w-5 h-5" />,
  isFavorite: false,
  isNew: false,
  requiredFilters: ['branch', 'category', 'years'],
  governmentRequired: true,
  board: ['GSEB', 'CBSE']
},

// List Reports
{
  id: 'list1',
  name: 'Complete Student List',
  description: 'Comprehensive list of all students with details',
  category: 'list',
  tags: ['list', 'student', 'complete'],
  icon: <ListIcon className="w-5 h-5" />,
  isFavorite: true,
  isNew: false,
  lastGenerated: '2025-01-26',
  requiredFilters: ['branch', 'grade'],
  board: ['All']
},
{
  id: 'list2',
  name: 'RTE Students List',
  description: 'List of all RTE admitted students',
  category: 'list',
  tags: ['RTE', 'list', 'government'],
  icon: <ShieldCheckIcon className="w-5 h-5" />,
  isFavorite: true,
  isNew: false,
  requiredFilters: ['branch', 'grade'],
  governmentRequired: true,
  board: ['GSEB', 'CBSE']
},
{
  id: 'list3',
  name: 'EWS Students List',
  description: 'List of all EWS category students',
  category: 'list',
  tags: ['EWS', 'list', 'government'],
  icon: <WalletIcon className="w-5 h-5" />,
  isFavorite: false,
  isNew: false,
  requiredFilters: ['branch', 'grade'],
  governmentRequired: true,
  board: ['GSEB', 'CBSE']
},
{
  id: 'list4',
  name: 'Minority Students List',
  description: 'List of minority community students',
  category: 'list',
  tags: ['minority', 'list', 'government'],
  icon: <HeartIcon className="w-5 h-5" />,
  isFavorite: false,
  isNew: true,
  requiredFilters: ['branch', 'minority'],
  governmentRequired: true,
  board: ['GSEB', 'CBSE']
}];


const generatedReports: GeneratedReport[] = [
{
  id: 'gen1',
  templateId: 'adm1',
  name: 'Student Admission Report - January 2025',
  type: 'Admission Report',
  generatedDate: '2025-01-26 10:30:00',
  generatedBy: 'Admin User',
  branches: ['Main Campus', 'Junior Wing'],
  format: 'PDF',
  fileSize: '245 KB',
  status: 'completed',
  downloadUrl: '#',
  filters: { academicYear: '2024-25', grade: 'All Grades' }
},
{
  id: 'gen2',
  templateId: 'res3',
  name: 'SC/ST/OBC Student Roster - 2024-25',
  type: 'Reservation Report',
  generatedDate: '2025-01-25 14:15:00',
  generatedBy: 'HR Manager',
  branches: ['All Branches'],
  format: 'Excel',
  fileSize: '128 KB',
  status: 'completed',
  downloadUrl: '#'
},
{
  id: 'gen3',
  templateId: 'gov1',
  name: 'UDISE+ Annual Data - 2024-25',
  type: 'Government Report',
  generatedDate: '2025-01-24 09:00:00',
  generatedBy: 'Admin User',
  branches: ['All Branches'],
  format: 'Excel',
  fileSize: '312 KB',
  status: 'completed',
  downloadUrl: '#'
},
{
  id: 'gen4',
  templateId: 'res1',
  name: 'RTE Admission Compliance - 2024-25',
  type: 'Reservation Report',
  generatedDate: '2025-01-26 08:30:00',
  generatedBy: 'Admin User',
  branches: ['All Branches'],
  format: 'PDF',
  fileSize: '0 KB',
  status: 'processing'
},
{
  id: 'gen5',
  templateId: 'att1',
  name: 'Student Attendance Summary - January 2025',
  type: 'Attendance Report',
  generatedDate: '2025-01-25 16:45:00',
  generatedBy: 'Principal',
  branches: ['Main Campus'],
  format: 'PDF',
  fileSize: '189 KB',
  status: 'completed',
  downloadUrl: '#'
},
{
  id: 'gen6',
  templateId: 'fin1',
  name: 'Fee Collection Status - December 2024',
  type: 'Financial Report',
  generatedDate: '2025-01-21 11:20:00',
  generatedBy: 'Accountant',
  branches: ['Main Campus', 'Junior Wing'],
  format: 'Excel',
  fileSize: '0 KB',
  status: 'failed'
}];


const recentReports = generatedReports.filter((r) => r.status === 'completed').slice(0, 5);

const auditLog: AuditLogEntry[] = [
{
  id: '1',
  action: 'Generated',
  reportName: 'Student Admission Report',
  user: 'Admin User',
  timestamp: '2025-01-26 10:30:00',
  details: 'PDF format, All Branches'
},
{
  id: '2',
  action: 'Downloaded',
  reportName: 'SC/ST/OBC Roster',
  user: 'HR Manager',
  timestamp: '2025-01-25 14:20:00',
  details: 'Excel format'
},
{
  id: '3',
  action: 'Emailed',
  reportName: 'RTE Compliance Report',
  user: 'Principal',
  timestamp: '2025-01-24 15:00:00',
  details: 'Sent to education@govt.in'
}];


const branchStats: BranchStats[] = [
{
  branchId: 'branch1',
  branchName: 'Main Campus',
  totalStaff: 85,
  teachingStaff: 55,
  nonTeachingStaff: 30,
  maleCount: 35,
  femaleCount: 48,
  otherCount: 2,
  newJoinees: 3,
  resignations: 1,
  retirements: 0,
  contractual: 12,
  permanent: 73
},
{
  branchId: 'branch2',
  branchName: 'Junior Wing',
  totalStaff: 45,
  teachingStaff: 32,
  nonTeachingStaff: 13,
  maleCount: 12,
  femaleCount: 33,
  otherCount: 0,
  newJoinees: 2,
  resignations: 0,
  retirements: 1,
  contractual: 8,
  permanent: 37
},
{
  branchId: 'branch3',
  branchName: 'Senior Secondary',
  totalStaff: 35,
  teachingStaff: 28,
  nonTeachingStaff: 7,
  maleCount: 18,
  femaleCount: 17,
  otherCount: 0,
  newJoinees: 1,
  resignations: 0,
  retirements: 0,
  contractual: 5,
  permanent: 30
},
{
  branchId: 'branch4',
  branchName: 'CBSE Wing',
  totalStaff: 28,
  teachingStaff: 22,
  nonTeachingStaff: 6,
  maleCount: 10,
  femaleCount: 18,
  otherCount: 0,
  newJoinees: 2,
  resignations: 1,
  retirements: 0,
  contractual: 6,
  permanent: 22
}];


// Filter Options
const academicYears = ['2024-25', '2023-24', '2022-23', '2021-22'];
const grades = ['All Grades', 'Pre-Primary', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
const genders = ['All Genders', 'Male', 'Female', 'Other'];
const categories = ['All Categories', 'General', 'OBC', 'SC', 'ST', 'EWS'];
const rteOptions = ['All', 'RTE Only', 'Non-RTE Only'];
const ewsOptions = ['All', 'EWS Only', 'Non-EWS Only'];
const minorityOptions = ['All', 'Religious Minority', 'Linguistic Minority', 'Non-Minority'];
const feeStatusOptions = ['All Status', 'Paid', 'Partial', 'Pending', 'Waived'];
const sortByOptions = ['Admission No', 'Name', 'Grade', 'Category', 'Date'];
const groupByOptions = ['None', 'Branch', 'Grade', 'Category', 'Gender'];

// Main Component
export function StaffStrengthDemographicReport() {
  // State
  const [activeTab, setActiveTab] = useState<'templates' | 'generated' | 'live'>('templates');
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['all']);
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<string[]>(reportTemplates.filter((r) => r.isFavorite).map((r) => r.id));
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('2024-25');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);

  // Modal States
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationSuccess, setGenerationSuccess] = useState(false);

  // Generate Modal Form State
  const [generateForm, setGenerateForm] = useState({
    reportType: '',
    academicYear: '2024-25',
    grade: 'All Grades',
    gender: 'All Genders',
    category: 'All Categories',
    rte: 'All',
    ews: 'All',
    minority: 'All',
    feeStatus: 'All Status',
    dateFrom: '',
    dateTo: '',
    outputFormat: 'PDF' as 'PDF' | 'Excel' | 'CSV',
    sortBy: 'Admission No',
    groupBy: 'None',
    includeContactInfo: true,
    includeParentInfo: true,
    includeCharts: true
  });

  // Calculate totals for selected branches
  const getSelectedBranchStats = () => {
    if (selectedBranches.includes('all')) {
      return branchStats.reduce(
        (acc, branch) => ({
          totalStaff: acc.totalStaff + branch.totalStaff,
          teachingStaff: acc.teachingStaff + branch.teachingStaff,
          nonTeachingStaff: acc.nonTeachingStaff + branch.nonTeachingStaff,
          maleCount: acc.maleCount + branch.maleCount,
          femaleCount: acc.femaleCount + branch.femaleCount,
          otherCount: acc.otherCount + branch.otherCount,
          newJoinees: acc.newJoinees + branch.newJoinees,
          resignations: acc.resignations + branch.resignations,
          retirements: acc.retirements + branch.retirements,
          contractual: acc.contractual + branch.contractual,
          permanent: acc.permanent + branch.permanent
        }),
        {
          totalStaff: 0,
          teachingStaff: 0,
          nonTeachingStaff: 0,
          maleCount: 0,
          femaleCount: 0,
          otherCount: 0,
          newJoinees: 0,
          resignations: 0,
          retirements: 0,
          contractual: 0,
          permanent: 0
        }
      );
    }

    return branchStats.
    filter((b) => selectedBranches.includes(b.branchId)).
    reduce(
      (acc, branch) => ({
        totalStaff: acc.totalStaff + branch.totalStaff,
        teachingStaff: acc.teachingStaff + branch.teachingStaff,
        nonTeachingStaff: acc.nonTeachingStaff + branch.nonTeachingStaff,
        maleCount: acc.maleCount + branch.maleCount,
        femaleCount: acc.femaleCount + branch.femaleCount,
        otherCount: acc.otherCount + branch.otherCount,
        newJoinees: acc.newJoinees + branch.newJoinees,
        resignations: acc.resignations + branch.resignations,
        retirements: acc.retirements + branch.retirements,
        contractual: acc.contractual + branch.contractual,
        permanent: acc.permanent + branch.permanent
      }),
      {
        totalStaff: 0,
        teachingStaff: 0,
        nonTeachingStaff: 0,
        maleCount: 0,
        femaleCount: 0,
        otherCount: 0,
        newJoinees: 0,
        resignations: 0,
        retirements: 0,
        contractual: 0,
        permanent: 0
      }
    );
  };

  const stats = getSelectedBranchStats();

  // Filter templates
  const filteredTemplates = reportTemplates.filter((template) => {
    const matchesSearch =
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Toggle branch selection
  const toggleBranch = (branchId: string) => {
    if (branchId === 'all') {
      setSelectedBranches(['all']);
    } else {
      const newSelection = selectedBranches.filter((b) => b !== 'all');
      if (newSelection.includes(branchId)) {
        const filtered = newSelection.filter((b) => b !== branchId);
        setSelectedBranches(filtered.length > 0 ? filtered : ['all']);
      } else {
        setSelectedBranches([...newSelection, branchId]);
      }
    }
  };

  // Toggle favorite
  const toggleFavorite = (templateId: string) => {
    setFavorites((prev) =>
    prev.includes(templateId) ? prev.filter((id) => id !== templateId) : [...prev, templateId]
    );
  };

  // Open generate modal
  const openGenerateModal = (template?: ReportTemplate) => {
    if (template) {
      setSelectedTemplate(template);
      setGenerateForm((prev) => ({ ...prev, reportType: template.id }));
    }
    setShowGenerateModal(true);
    setGenerationSuccess(false);
  };

  // Handle generate report
  const handleGenerateReport = () => {
    if (!generateForm.reportType) return;

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerationSuccess(true);
      // Show success notification
      setTimeout(() => {
        setShowGenerateModal(false);
        setActiveTab('generated');
        setGenerationSuccess(false);
        setGenerateForm({
          reportType: '',
          academicYear: '2024-25',
          grade: 'All Grades',
          gender: 'All Genders',
          category: 'All Categories',
          rte: 'All',
          ews: 'All',
          minority: 'All',
          feeStatus: 'All Status',
          dateFrom: '',
          dateTo: '',
          outputFormat: 'PDF',
          sortBy: 'Admission No',
          groupBy: 'None',
          includeContactInfo: true,
          includeParentInfo: true,
          includeCharts: true
        });
        setSelectedTemplate(null);
      }, 1500);
    }, 2500);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Format datetime
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get category color
  const getCategoryColor = (category: ReportCategory) => {
    const cat = reportCategories.find((c) => c.value === category);
    return cat?.color || 'bg-gray-500';
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'processing':
        return <Badge variant="warning">Processing</Badge>;
      case 'failed':
        return <Badge variant="danger">Failed</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  // Get selected branches display
  const getSelectedBranchesDisplay = () => {
    if (selectedBranches.includes('all')) return 'All Branches';
    if (selectedBranches.length === 1) {
      return branches.find((b) => b.id === selectedBranches[0])?.name || '';
    }
    return `${selectedBranches.length} Branches Selected`;
  };

  // Get report by ID
  const getReportById = (id: string) => {
    return reportTemplates.find((t) => t.id === id);
  };

  // Check if form is valid
  const isFormValid = generateForm.reportType !== '';

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileBarChartIcon className="w-7 h-7 text-blue-600" />
            Reports & Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Generate, view, and analyze admission, attendance, and performance reports
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Academic Year Selector */}
          <select
            value={selectedAcademicYear}
            onChange={(e) => setSelectedAcademicYear(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">

            {academicYears.map((year) =>
            <option key={year} value={year}>
                Batch {year}
              </option>
            )}
          </select>

          {/* Branch Selector */}
          <div className="relative">
            <button
              onClick={() => setShowBranchDropdown(!showBranchDropdown)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">

              <BuildingIcon className="w-4 h-4 text-gray-500" />
              {getSelectedBranchesDisplay()}
              <ChevronDownIcon className="w-4 h-4 text-gray-400" />
            </button>

            {showBranchDropdown &&
            <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-64 z-20">
                <button
                onClick={() => toggleBranch('all')}
                className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-gray-50 ${
                selectedBranches.includes('all') ? 'bg-blue-50' : ''}`
                }>

                  <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                  selectedBranches.includes('all') ?
                  'bg-blue-600 border-blue-600' :
                  'border-gray-300'}`
                  }>

                    {selectedBranches.includes('all') &&
                  <CheckIcon className="w-3 h-3 text-white" />
                  }
                  </div>
                  <span className="font-medium">All Branches</span>
                </button>
                <div className="border-t border-gray-100 my-1" />
                {branches.map((branch) =>
              <button
                key={branch.id}
                onClick={() => toggleBranch(branch.id)}
                className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-gray-50 ${
                selectedBranches.includes(branch.id) ? 'bg-blue-50' : ''}`
                }>

                    <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                  selectedBranches.includes(branch.id) ?
                  'bg-blue-600 border-blue-600' :
                  'border-gray-300'}`
                  }>

                      {selectedBranches.includes(branch.id) &&
                  <CheckIcon className="w-3 h-3 text-white" />
                  }
                    </div>
                    <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: branch.color }} />

                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{branch.name}</p>
                      <p className="text-xs text-gray-500">{branch.city}</p>
                    </div>
                  </button>
              )}
              </div>
            }
          </div>

          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCwIcon className="w-4 h-4 mr-2" />
            Refresh
          </Button>

          <Button variant="primary" onClick={() => openGenerateModal()}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Selected Branches Display */}
      {!selectedBranches.includes('all') &&
      <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-500">Selected Branches:</span>
          {selectedBranches.map((branchId) => {
          const branch = branches.find((b) => b.id === branchId);
          if (!branch) return null;
          return (
            <span
              key={branch.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${branch.color}20`,
                color: branch.color
              }}>

                <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: branch.color }} />

                {branch.name}
                <button onClick={() => toggleBranch(branch.id)} className="hover:opacity-70">
                  <XIcon className="w-3 h-3" />
                </button>
              </span>);

        })}
        </div>
      }

      {/* Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm">
          {[
          {
            id: 'templates' as const,
            label: 'Report Templates',
            icon: <FolderOpenIcon className="w-4 h-4" />
          },
          {
            id: 'generated' as const,
            label: 'Generated Reports',
            icon: <HistoryIcon className="w-4 h-4" />
          },
          {
            id: 'live' as const,
            label: 'Live Data & Analytics',
            icon: <ActivityIcon className="w-4 h-4" />
          }].
          map((tab) =>
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === tab.id ?
            'bg-blue-600 text-white' :
            'text-gray-600 hover:bg-gray-100'}`
            }>

              {tab.icon}
              {tab.label}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowScheduleModal(true)}>
            <CalendarIcon className="w-4 h-4 mr-1" />
            Schedule
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowAuditModal(true)}>
            <ClipboardListIcon className="w-4 h-4 mr-1" />
            Audit Log
          </Button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'templates' &&
      <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
              type="text"
              placeholder="Search reports by name, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'all' ?
              'bg-blue-600 text-white' :
              'bg-gray-100 text-gray-600 hover:bg-gray-200'}`
              }>

                All ({reportTemplates.length})
              </button>
              {reportCategories.slice(0, 6).map((cat) =>
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat.value ?
              'bg-blue-600 text-white' :
              'bg-gray-100 text-gray-600 hover:bg-gray-200'}`
              }>

                  {cat.icon}
                  {cat.label.replace(' Reports', '').replace(' & Compliance', '')}
                </button>
            )}
              <div className="relative group">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
                  More
                  <ChevronDownIcon className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1 border border-gray-200 rounded-lg bg-white">
              <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-l-lg ${
              viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`
              }>

                <LayoutGridIcon className="w-4 h-4" />
              </button>
              <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-r-lg ${
              viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`
              }>

                <ListIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Recently Generated */}
          {recentReports.length > 0 &&
        <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <ClockIcon className="w-4 h-4 text-gray-400" />
                  Recently Generated
                </h3>
                <button
              onClick={() => setActiveTab('generated')}
              className="text-xs text-blue-600 hover:underline">

                  View All →
                </button>
              </div>
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {recentReports.map((report) =>
            <div
              key={report.id}
              className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg min-w-max hover:bg-gray-100 cursor-pointer">

                    {report.format === 'PDF' ?
              <FileTextIcon className="w-4 h-4 text-red-500" /> :

              <FileSpreadsheetIcon className="w-4 h-4 text-green-500" />
              }
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                        {report.name}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(report.generatedDate)}</p>
                    </div>
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <DownloadIcon className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
            )}
              </div>
            </div>
        }

          {/* Featured Reports */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ZapIcon className="w-5 h-5 text-amber-500" />
              Key Reports
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
            {
              title: 'Total Students',
              value: '2,760',
              subtitle: 'M: 1,420 | F: 1,340',
              icon: <UsersIcon className="w-6 h-6" />,
              color: 'blue',
              reportId: 'adm1'
            },
            {
              title: 'RTE Admissions',
              value: '245',
              subtitle: '8.9% of total',
              icon: <ShieldCheckIcon className="w-6 h-6" />,
              color: 'purple',
              reportId: 'res1'
            },
            {
              title: 'Category Distribution',
              value: '94%',
              subtitle: 'Compliance Rate',
              icon: <PieChartIcon className="w-6 h-6" />,
              color: 'green',
              reportId: 'res3'
            },
            {
              title: 'Fee Collection',
              value: '₹1.2Cr',
              subtitle: '85% Collected',
              icon: <IndianRupeeIcon className="w-6 h-6" />,
              color: 'amber',
              reportId: 'fin1'
            }].
            map((card, index) =>
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => {
                const template = reportTemplates.find((t) => t.id === card.reportId);
                if (template) openGenerateModal(template);
              }}>

                  <div className="flex items-start justify-between mb-3">
                    <div
                  className={`p-3 rounded-xl ${
                  card.color === 'blue' ?
                  'bg-blue-100 text-blue-600' :
                  card.color === 'purple' ?
                  'bg-purple-100 text-purple-600' :
                  card.color === 'green' ?
                  'bg-green-100 text-green-600' :
                  'bg-amber-100 text-amber-600'}`
                  }>

                      {card.icon}
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRightIcon className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <p className="text-sm font-medium text-gray-700 mt-1">{card.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>

                  {/* Branch Breakdown */}
                  {!selectedBranches.includes('all') && selectedBranches.length > 1 &&
              <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Branch Breakdown:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedBranches.slice(0, 3).map((branchId) => {
                    const branch = branches.find((b) => b.id === branchId);
                    if (!branch) return null;
                    return (
                      <span
                        key={branch.id}
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: `${branch.color}20`,
                          color: branch.color
                        }}>

                              {branch.shortName}
                            </span>);

                  })}
                        {selectedBranches.length > 3 &&
                  <span className="text-xs text-gray-400">
                            +{selectedBranches.length - 3}
                          </span>
                  }
                      </div>
                    </div>
              }
                </div>
            )}
            </div>
          </div>

          {/* Report Templates */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedCategory === 'all' ?
              'All Report Templates' :
              reportCategories.find((c) => c.value === selectedCategory)?.label}
              </h2>
              <span className="text-sm text-gray-500">{filteredTemplates.length} templates</span>
            </div>

            {viewMode === 'grid' ?
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredTemplates.map((template) =>
            <Card
              key={template.id}
              className="p-4 hover:shadow-lg transition-all cursor-pointer group">

                    <div className="flex items-start justify-between mb-3">
                      <div
                  className={`p-2.5 rounded-lg ${getCategoryColor(template.category)} text-white`}>

                        {template.icon}
                      </div>
                      <div className="flex items-center gap-1">
                        {template.isNew &&
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            New
                          </span>
                  }
                        {template.governmentRequired &&
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                            Govt
                          </span>
                  }
                        <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(template.id);
                    }}
                    className={`p-1 rounded ${
                    favorites.includes(template.id) ? 'text-amber-500' : 'text-gray-300'}`
                    }>

                          <StarIcon
                      className={`w-4 h-4 ${
                      favorites.includes(template.id) ? 'fill-amber-500' : ''}`
                      } />

                        </button>
                      </div>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                      {template.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.tags.slice(0, 3).map((tag) =>
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">

                          {tag}
                        </span>
                )}
                    </div>

                    {template.board && template.board[0] !== 'All' &&
              <div className="flex items-center gap-1 mb-3">
                        {template.board.map((b) =>
                <span
                  key={b}
                  className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded">

                            {b}
                          </span>
                )}
                      </div>
              }

                    {template.lastGenerated &&
              <p className="text-xs text-gray-400 mb-3">
                        Last: {formatDate(template.lastGenerated)}
                      </p>
              }

                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <Button
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  onClick={() => openGenerateModal(template)}>

                        Generate
                      </Button>
                      <button className="p-2 rounded-lg hover:bg-gray-100">
                        <EyeIcon className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-gray-100">
                        <DownloadIcon className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </Card>
            )}
              </div> :

          <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Report Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Category
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Board
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Last Generated
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredTemplates.map((template) =>
                  <tr key={template.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div
                          className={`p-2 rounded-lg ${getCategoryColor(template.category)} text-white`}>

                                {template.icon}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-gray-900">{template.name}</p>
                                  {template.isNew &&
                            <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                                      New
                                    </span>
                            }
                                  {template.governmentRequired &&
                            <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-xs rounded">
                                      Govt
                                    </span>
                            }
                                </div>
                                <p className="text-sm text-gray-500 truncate max-w-xs">
                                  {template.description}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="capitalize text-sm text-gray-600">
                              {template.category}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              {template.board?.map((b) =>
                        <span
                          key={b}
                          className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">

                                  {b}
                                </span>
                        )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-600">
                              {template.lastGenerated ?
                        formatDate(template.lastGenerated) :
                        'Never'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <Button
                          variant="primary"
                          size="sm"
                          onClick={() => openGenerateModal(template)}>

                                Generate
                              </Button>
                              <button
                          onClick={() => toggleFavorite(template.id)}
                          className={`p-1.5 rounded ${
                          favorites.includes(template.id) ? 'text-amber-500' : 'text-gray-300'}`
                          }>

                                <StarIcon
                            className={`w-4 h-4 ${
                            favorites.includes(template.id) ? 'fill-amber-500' : ''}`
                            } />

                              </button>
                            </div>
                          </td>
                        </tr>
                  )}
                    </tbody>
                  </table>
                </div>
              </Card>
          }
          </div>
        </div>
      }

      {activeTab === 'generated' &&
      <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Generated Reports</h2>
            <div className="flex items-center gap-2">
              <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
                <option>All Types</option>
                {reportCategories.map((cat) =>
              <option key={cat.value}>{cat.label}</option>
              )}
              </select>
              <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
                <option>All Time</option>
              </select>
            </div>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Report Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Generated
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      By
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Branches
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Format
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Size
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {generatedReports.map((report) =>
                <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{report.name}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">{report.type}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">
                          {formatDateTime(report.generatedDate)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">{report.generatedBy}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {report.branches.slice(0, 2).map((branch, index) =>
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">

                              {branch}
                            </span>
                      )}
                          {report.branches.length > 2 &&
                      <span className="text-xs text-gray-400">
                              +{report.branches.length - 2}
                            </span>
                      }
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                      className={`px-2 py-0.5 text-xs font-medium rounded ${
                      report.format === 'PDF' ?
                      'bg-red-100 text-red-700' :
                      report.format === 'Excel' ?
                      'bg-green-100 text-green-700' :
                      'bg-blue-100 text-blue-700'}`
                      }>

                          {report.format}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">{report.fileSize}</span>
                      </td>
                      <td className="px-4 py-3">{getStatusBadge(report.status)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {report.status === 'completed' &&
                      <>
                              <button
                          className="p-1.5 rounded-lg hover:bg-gray-100"
                          title="View">

                                <EyeIcon className="w-4 h-4 text-gray-600" />
                              </button>
                              <button
                          className="p-1.5 rounded-lg hover:bg-gray-100"
                          title="Download">

                                <DownloadIcon className="w-4 h-4 text-gray-600" />
                              </button>
                              <button
                          className="p-1.5 rounded-lg hover:bg-gray-100"
                          title="Print">

                                <PrinterIcon className="w-4 h-4 text-gray-600" />
                              </button>
                              <button
                          className="p-1.5 rounded-lg hover:bg-gray-100"
                          title="Email"
                          onClick={() => setShowEmailModal(true)}>

                                <MailIcon className="w-4 h-4 text-gray-600" />
                              </button>
                            </>
                      }
                          {report.status === 'processing' &&
                      <Loader2Icon className="w-4 h-4 text-blue-600 animate-spin" />
                      }
                          {report.status === 'failed' &&
                      <button
                        className="p-1.5 rounded-lg hover:bg-gray-100"
                        title="Retry">

                              <RefreshCwIcon className="w-4 h-4 text-red-600" />
                            </button>
                      }
                        </div>
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      }

      {activeTab === 'live' &&
      <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
          { label: 'Total Staff', value: stats.totalStaff, color: 'blue' },
          { label: 'Teaching', value: stats.teachingStaff, color: 'green' },
          { label: 'Non-Teaching', value: stats.nonTeachingStaff, color: 'purple' },
          { label: 'New Joinees', value: stats.newJoinees, color: 'amber' },
          { label: 'Permanent', value: stats.permanent, color: 'teal' },
          { label: 'Contractual', value: stats.contractual, color: 'orange' }].
          map((stat, index) =>
          <div key={index} className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
          )}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Gender Distribution */}
            <Card title="Gender Distribution">
              <div className="p-4">
                <div className="flex items-center justify-center gap-8">
                  <div className="relative">
                    <svg width="140" height="140" viewBox="0 0 140 140">
                      <circle
                      cx="70"
                      cy="70"
                      r="55"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="20" />

                      <circle
                      cx="70"
                      cy="70"
                      r="55"
                      fill="none"
                      stroke="#14B8A6"
                      strokeWidth="20"
                      strokeDasharray={`${stats.maleCount / stats.totalStaff * 345.58} 345.58`}
                      strokeDashoffset="0"
                      transform="rotate(-90 70 70)" />

                      <circle
                      cx="70"
                      cy="70"
                      r="55"
                      fill="none"
                      stroke="#F97316"
                      strokeWidth="20"
                      strokeDasharray={`${stats.femaleCount / stats.totalStaff * 345.58} 345.58`}
                      strokeDashoffset={`-${stats.maleCount / stats.totalStaff * 345.58}`}
                      transform="rotate(-90 70 70)" />

                      <text
                      x="70"
                      y="65"
                      textAnchor="middle"
                      className="text-xl font-bold fill-gray-900">

                        {stats.totalStaff}
                      </text>
                      <text x="70" y="82" textAnchor="middle" className="text-xs fill-gray-500">
                        Total
                      </text>
                    </svg>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-teal-500" />
                      <div>
                        <p className="text-sm text-gray-600">Male</p>
                        <p className="font-semibold">
                          {stats.maleCount} (
                          {(stats.maleCount / stats.totalStaff * 100).toFixed(1)}%)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500" />
                      <div>
                        <p className="text-sm text-gray-600">Female</p>
                        <p className="font-semibold">
                          {stats.femaleCount} (
                          {(stats.femaleCount / stats.totalStaff * 100).toFixed(1)}%)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Category Distribution */}
            <Card title="Reservation Category">
              <div className="p-4 space-y-3">
                {[
              { label: 'General', count: 95, percentage: 49.2, color: 'bg-blue-500' },
              { label: 'OBC', count: 45, percentage: 23.3, color: 'bg-green-500' },
              { label: 'SC', count: 25, percentage: 13.0, color: 'bg-purple-500' },
              { label: 'ST', count: 15, percentage: 7.8, color: 'bg-amber-500' },
              { label: 'EWS', count: 13, percentage: 6.7, color: 'bg-red-500' }].
              map((cat, index) =>
              <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">{cat.label}</span>
                      <span className="text-sm font-medium">
                        {cat.count} ({cat.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                    className={`h-full rounded-full ${cat.color}`}
                    style={{ width: `${cat.percentage}%` }} />

                    </div>
                  </div>
              )}
              </div>
            </Card>

            {/* Fee Status */}
            <Card title="Fee Collection Status">
              <div className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                { label: 'Paid', value: '1,845', percentage: 67, color: 'green' },
                { label: 'Partial', value: '412', percentage: 15, color: 'amber' },
                { label: 'Pending', value: '358', percentage: 13, color: 'red' },
                { label: 'Waived', value: '145', percentage: 5, color: 'purple' }].
                map((item, index) =>
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                  item.color === 'green' ?
                  'bg-green-50' :
                  item.color === 'amber' ?
                  'bg-amber-50' :
                  item.color === 'red' ?
                  'bg-red-50' :
                  'bg-purple-50'}`
                  }>

                      <p
                    className={`text-xs ${
                    item.color === 'green' ?
                    'text-green-600' :
                    item.color === 'amber' ?
                    'text-amber-600' :
                    item.color === 'red' ?
                    'text-red-600' :
                    'text-purple-600'}`
                    }>

                        {item.label}
                      </p>
                      <p className="text-lg font-bold text-gray-900">{item.value}</p>
                      <p className="text-xs text-gray-500">{item.percentage}%</p>
                    </div>
                )}
                </div>
              </div>
            </Card>
          </div>

          {/* Branch Comparison Table */}
          {(selectedBranches.includes('all') || selectedBranches.length > 1) &&
        <Card title="Branch-wise Comparison">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Branch
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Total
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Teaching
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Non-Teaching
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Male
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Female
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Ratio
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {branchStats.
                filter(
                  (b) =>
                  selectedBranches.includes('all') ||
                  selectedBranches.includes(b.branchId)
                ).
                map((branch) => {
                  const branchInfo = branches.find((b) => b.id === branch.branchId);
                  return (
                    <tr key={branch.branchId} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: branchInfo?.color }} />

                                <span className="font-medium text-gray-900">
                                  {branch.branchName}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center font-semibold">
                              {branch.totalStaff}
                            </td>
                            <td className="px-4 py-3 text-center">{branch.teachingStaff}</td>
                            <td className="px-4 py-3 text-center">{branch.nonTeachingStaff}</td>
                            <td className="px-4 py-3 text-center">{branch.maleCount}</td>
                            <td className="px-4 py-3 text-center">{branch.femaleCount}</td>
                            <td className="px-4 py-3 text-center">
                              {(branch.maleCount / branch.femaleCount).toFixed(2)}:1
                            </td>
                          </tr>);

                })}
                  </tbody>
                </table>
              </div>
            </Card>
        }
        </div>
      }

      {/* Generate Report Modal - Enhanced Design */}
      {showGenerateModal &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => !isGenerating && setShowGenerateModal(false)} />

          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
              <div>
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <FileBarChartIcon className="w-6 h-6" />
                  Generate Report
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  Configure filters for your report
                </p>
              </div>
              <button
              onClick={() => !isGenerating && setShowGenerateModal(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              disabled={isGenerating}>

                <XIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Success State */}
              {generationSuccess &&
            <div className="flex flex-col items-center justify-center py-10">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <CheckCircleIcon className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Report Generated Successfully!
                  </h3>
                  <p className="text-gray-500 text-center">
                    Your report is ready. Redirecting to Generated Reports...
                  </p>
                </div>
            }

              {!generationSuccess &&
            <>
                  {/* Report Type Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Report Type <span className="text-red-500">*</span>
                    </label>
                    <select
                  value={generateForm.reportType}
                  onChange={(e) => {
                    setGenerateForm({ ...generateForm, reportType: e.target.value });
                    setSelectedTemplate(getReportById(e.target.value) || null);
                  }}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">

                      <option value="">Select Report Type...</option>
                      {reportCategories.map((category) =>
                  <optgroup key={category.value} label={category.label}>
                          {reportTemplates.
                    filter((t) => t.category === category.value).
                    map((template) =>
                    <option key={template.id} value={template.id}>
                                {template.name}{' '}
                                {template.governmentRequired ? '(Govt Required)' : ''}
                              </option>
                    )}
                        </optgroup>
                  )}
                    </select>

                    {/* Selected Report Chip */}
                    {selectedTemplate &&
                <div className="mt-3 flex items-center gap-2">
                        <div
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${getCategoryColor(selectedTemplate.category)} text-white`}>

                          {selectedTemplate.icon}
                          <span className="text-sm font-medium">{selectedTemplate.name}</span>
                          {selectedTemplate.governmentRequired &&
                    <span className="px-1.5 py-0.5 bg-white/20 rounded text-xs">
                              Govt
                            </span>
                    }
                        </div>
                        <button
                    onClick={() => {
                      setGenerateForm({ ...generateForm, reportType: '' });
                      setSelectedTemplate(null);
                    }}
                    className="text-gray-400 hover:text-gray-600">

                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                }
                  </div>

                  {/* Selected Scope Box */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <InfoIcon className="w-4 h-4" />
                      Report Scope
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-blue-200">
                        <CalendarIcon className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">
                          Batch: {selectedAcademicYear}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-blue-200">
                        <BuildingIcon className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">
                          {getSelectedBranchesDisplay()}
                        </span>
                      </div>
                      {!selectedBranches.includes('all') &&
                  <div className="flex flex-wrap gap-1">
                          {selectedBranches.map((branchId) => {
                      const branch = branches.find((b) => b.id === branchId);
                      if (!branch) return null;
                      return (
                        <span
                          key={branch.id}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium"
                          style={{
                            backgroundColor: `${branch.color}20`,
                            color: branch.color
                          }}>

                                <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: branch.color }} />

                                {branch.name}
                              </span>);

                    })}
                        </div>
                  }
                    </div>
                  </div>

                  {/* Filter Configuration */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <FilterIcon className="w-4 h-4" />
                      Filter Configuration
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Academic Year
                        </label>
                        <select
                      value={generateForm.academicYear}
                      onChange={(e) =>
                      setGenerateForm({ ...generateForm, academicYear: e.target.value })
                      }
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

                          {academicYears.map((year) =>
                      <option key={year} value={year}>
                              {year}
                            </option>
                      )}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Grade/Class
                        </label>
                        <select
                      value={generateForm.grade}
                      onChange={(e) =>
                      setGenerateForm({ ...generateForm, grade: e.target.value })
                      }
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

                          {grades.map((grade) =>
                      <option key={grade} value={grade}>
                              {grade}
                            </option>
                      )}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Gender
                        </label>
                        <select
                      value={generateForm.gender}
                      onChange={(e) =>
                      setGenerateForm({ ...generateForm, gender: e.target.value })
                      }
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

                          {genders.map((gender) =>
                      <option key={gender} value={gender}>
                              {gender}
                            </option>
                      )}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Category
                        </label>
                        <select
                      value={generateForm.category}
                      onChange={(e) =>
                      setGenerateForm({ ...generateForm, category: e.target.value })
                      }
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

                          {categories.map((category) =>
                      <option key={category} value={category}>
                              {category}
                            </option>
                      )}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Reservation Filters Section */}
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <h4 className="text-sm font-semibold text-amber-900 mb-3 flex items-center gap-2">
                      <ShieldCheckIcon className="w-4 h-4" />
                      Reservation Filters
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-amber-700 mb-1">
                          RTE
                        </label>
                        <select
                      value={generateForm.rte}
                      onChange={(e) =>
                      setGenerateForm({ ...generateForm, rte: e.target.value })
                      }
                      className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white">

                          {rteOptions.map((option) =>
                      <option key={option} value={option}>
                              {option}
                            </option>
                      )}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-amber-700 mb-1">
                          EWS
                        </label>
                        <select
                      value={generateForm.ews}
                      onChange={(e) =>
                      setGenerateForm({ ...generateForm, ews: e.target.value })
                      }
                      className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white">

                          {ewsOptions.map((option) =>
                      <option key={option} value={option}>
                              {option}
                            </option>
                      )}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-amber-700 mb-1">
                          Minority
                        </label>
                        <select
                      value={generateForm.minority}
                      onChange={(e) =>
                      setGenerateForm({ ...generateForm, minority: e.target.value })
                      }
                      className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white">

                          {minorityOptions.map((option) =>
                      <option key={option} value={option}>
                              {option}
                            </option>
                      )}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-amber-700 mb-1">
                          Fee Status
                        </label>
                        <select
                      value={generateForm.feeStatus}
                      onChange={(e) =>
                      setGenerateForm({ ...generateForm, feeStatus: e.target.value })
                      }
                      className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white">

                          {feeStatusOptions.map((option) =>
                      <option key={option} value={option}>
                              {option}
                            </option>
                      )}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Date Range */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      Date Range (Optional)
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          From Date
                        </label>
                        <input
                      type="date"
                      value={generateForm.dateFrom}
                      onChange={(e) =>
                      setGenerateForm({ ...generateForm, dateFrom: e.target.value })
                      }
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          To Date
                        </label>
                        <input
                      type="date"
                      value={generateForm.dateTo}
                      onChange={(e) =>
                      setGenerateForm({ ...generateForm, dateTo: e.target.value })
                      }
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

                      </div>
                    </div>
                  </div>

                  {/* Advanced Options */}
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <SettingsIcon className="w-4 h-4" />
                      Advanced Options
                    </h4>

                    {/* Output Format */}
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-gray-500 mb-2">
                        Output Format
                      </label>
                      <div className="flex gap-2">
                        {(['PDF', 'Excel', 'CSV'] as const).map((format) =>
                    <button
                      key={format}
                      onClick={() =>
                      setGenerateForm({ ...generateForm, outputFormat: format })
                      }
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all ${
                      generateForm.outputFormat === format ?
                      'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' :
                      'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'}`
                      }>

                            {format === 'PDF' && <FileTextIcon className="w-4 h-4" />}
                            {format === 'Excel' && <FileSpreadsheetIcon className="w-4 h-4" />}
                            {format === 'CSV' && <FileIcon className="w-4 h-4" />}
                            <span className="font-medium">{format}</span>
                          </button>
                    )}
                      </div>
                    </div>

                    {/* Sort By and Group By */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Sort By
                        </label>
                        <select
                      value={generateForm.sortBy}
                      onChange={(e) =>
                      setGenerateForm({ ...generateForm, sortBy: e.target.value })
                      }
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">

                          {sortByOptions.map((option) =>
                      <option key={option} value={option}>
                              {option}
                            </option>
                      )}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Group By
                        </label>
                        <select
                      value={generateForm.groupBy}
                      onChange={(e) =>
                      setGenerateForm({ ...generateForm, groupBy: e.target.value })
                      }
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">

                          {groupByOptions.map((option) =>
                      <option key={option} value={option}>
                              {option}
                            </option>
                      )}
                        </select>
                      </div>
                    </div>

                    {/* Include Options */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                      type="checkbox"
                      checked={generateForm.includeContactInfo}
                      onChange={(e) =>
                      setGenerateForm({
                        ...generateForm,
                        includeContactInfo: e.target.checked
                      })
                      }
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

                        <span className="text-sm text-gray-700">Include contact information</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                      type="checkbox"
                      checked={generateForm.includeParentInfo}
                      onChange={(e) =>
                      setGenerateForm({
                        ...generateForm,
                        includeParentInfo: e.target.checked
                      })
                      }
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

                        <span className="text-sm text-gray-700">Include parent/guardian information</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                      type="checkbox"
                      checked={generateForm.includeCharts}
                      onChange={(e) =>
                      setGenerateForm({
                        ...generateForm,
                        includeCharts: e.target.checked
                      })
                      }
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

                        <span className="text-sm text-gray-700">
                          Include charts and visualizations
                        </span>
                      </label>
                    </div>
                  </div>
                </>
            }
            </div>

            {/* Modal Footer */}
            {!generationSuccess &&
          <div className="flex items-center justify-between p-5 border-t border-gray-200 bg-gray-50">
                <div className="text-sm text-gray-500">
                  {isFormValid ?
              <span className="flex items-center gap-1 text-green-600">
                      <CheckCircleIcon className="w-4 h-4" />
                      Ready to generate
                    </span> :

              <span className="flex items-center gap-1 text-amber-600">
                      <AlertCircleIcon className="w-4 h-4" />
                      Please select a report type
                    </span>
              }
                </div>
                <div className="flex items-center gap-3">
                  <Button
                variant="outline"
                onClick={() => setShowGenerateModal(false)}
                disabled={isGenerating}>

                    Cancel
                  </Button>
                  <button
                onClick={handleGenerateReport}
                disabled={!isFormValid || isGenerating}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-white shadow-lg transition-all ${
                !isFormValid || isGenerating ?
                'bg-gray-400 cursor-not-allowed' :
                'bg-blue-600 hover:bg-blue-700 hover:shadow-xl'}`
                }>

                    {isGenerating ?
                <>
                        <Loader2Icon className="w-5 h-5 animate-spin" />
                        Generating...
                      </> :

                <>
                        <FileBarChartIcon className="w-5 h-5" />
                        Generate Report
                      </>
                }
                  </button>
                </div>
              </div>
          }
          </div>
        </div>
      }

      {/* Email Modal */}
      {showEmailModal &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setShowEmailModal(false)} />

          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MailIcon className="w-5 h-5 text-blue-600" />
                Email Report
              </h2>
              <button
              onClick={() => setShowEmailModal(false)}
              className="text-gray-400 hover:text-gray-600">

                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient Email
                </label>
                <input
                type="email"
                placeholder="Enter email address"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                type="text"
                placeholder="Email subject"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message (Optional)
                </label>
                <textarea
                rows={3}
                placeholder="Add a message..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
              <Button variant="outline" onClick={() => setShowEmailModal(false)}>
                Cancel
              </Button>
              <Button variant="primary">
                <SendIcon className="w-4 h-4 mr-2" />
                Send Email
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Schedule Modal */}
      {showScheduleModal &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setShowScheduleModal(false)} />

          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
                Schedule Report
              </h2>
              <button
              onClick={() => setShowScheduleModal(false)}
              className="text-gray-400 hover:text-gray-600">

                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 flex items-center gap-2">
                  <InfoIcon className="w-4 h-4" />
                  Scheduled reports will be automatically generated and sent to specified recipients.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report Template
                </label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Select a report...</option>
                  {reportTemplates.slice(0, 10).map((t) =>
                <option key={t.id}>{t.name}</option>
                )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency
                </label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                  <option>Quarterly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Send To (Email)
                </label>
                <input
                type="email"
                placeholder="recipient@email.com"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
              <Button variant="outline" onClick={() => setShowScheduleModal(false)}>
                Cancel
              </Button>
              <Button variant="primary">
                <CalendarCheckIcon className="w-4 h-4 mr-2" />
                Schedule
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Audit Log Modal */}
      {showAuditModal &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setShowAuditModal(false)} />

          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <ClipboardListIcon className="w-5 h-5 text-blue-600" />
                Audit Log
              </h2>
              <button
              onClick={() => setShowAuditModal(false)}
              className="text-gray-400 hover:text-gray-600">

                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[60vh]">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Action
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Report
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Timestamp
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {auditLog.map((entry) =>
                <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                      entry.action === 'Generated' ?
                      'bg-green-100 text-green-700' :
                      entry.action === 'Downloaded' ?
                      'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'}`
                      }>

                          {entry.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{entry.reportName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{entry.user}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {formatDateTime(entry.timestamp)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{entry.details}</td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-end p-4 border-t border-gray-200">
              <Button variant="outline" onClick={() => setShowAuditModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Click outside to close dropdowns */}
      {showBranchDropdown &&
      <div className="fixed inset-0 z-10" onClick={() => setShowBranchDropdown(false)} />
      }
    </div>);

}