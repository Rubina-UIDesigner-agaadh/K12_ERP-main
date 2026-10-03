import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Search,
  Download,
  Filter,
  Eye,
  Edit2,
  Plus,
  RefreshCw,
  FileText,
  Users,
  IndianRupee,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Printer,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Award,
  Heart,
  Star,
  TrendingUp,
  PieChart,
  BarChart3,
  FileSpreadsheet,
  Upload,
  Trash2,
  History,
  Info,
  ChevronDown,
  ChevronRight,
  Building,
  CreditCard,
  Wallet,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  BookOpen,
  Home,
  Briefcase,
  Shield,
  Percent,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Copy,
  Share2,
  ExternalLink } from
'lucide-react';

// Types
interface Student {
  id: string;
  grNo: string;
  admissionNo: string;
  name: string;
  fatherName: string;
  motherName: string;
  class: string;
  section: string;
  rollNumber: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'Other';
  religion: string;
  caste: string;
  isRTE: boolean;
  isEWS: boolean;
  isBPL: boolean;
  isSingleParent: boolean;
  isOrphan: boolean;
  isDisabled: boolean;
  disabilityType: string | null;
  disabilityPercentage: number | null;
  address: string;
  phone: string;
  email: string;
  parentOccupation: string;
  annualIncome: number;
  bankName: string;
  bankAccount: string;
  ifscCode: string;
  aadharNo: string;
  photo: string;
}

interface Scholarship {
  id: string;
  studentId: string;
  student: Student;
  schemeId: string;
  schemeName: string;
  schemeType: 'Merit' | 'Need-based' | 'Sports' | 'Government' | 'RTE' | 'EWS' | 'Minority' | 'Disability' | 'Other';
  schemeCategory: 'Central' | 'State' | 'Private' | 'Institution';
  academicYear: string;
  applicationDate: string;
  approvalDate: string | null;
  sanctionedAmount: number;
  disbursedAmount: number;
  pendingAmount: number;
  disbursementSchedule: 'One-time' | 'Monthly' | 'Quarterly' | 'Half-yearly' | 'Yearly';
  disbursements: {
    id: string;
    date: string;
    amount: number;
    mode: string;
    reference: string;
    status: 'Completed' | 'Pending' | 'Failed';
  }[];
  status: 'Applied' | 'Under Review' | 'Approved' | 'Active' | 'Completed' | 'Rejected' | 'Suspended' | 'Expired';
  renewalStatus: 'Not Applicable' | 'Eligible' | 'Applied' | 'Renewed' | 'Not Renewed';
  validFrom: string;
  validTo: string;
  documents: {
    name: string;
    type: string;
    status: 'Pending' | 'Verified' | 'Rejected';
  }[];
  remarks: string;
  approvedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

interface SchemeInfo {
  id: string;
  name: string;
  type: string;
  category: string;
  eligibilityCriteria: string[];
  maxAmount: number;
  beneficiaries: number;
}

export function StudentScholarshipList() {
  // State Management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScholarships, setSelectedScholarships] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'rte' | 'ews' | 'merit' | 'sports' | 'government'>('all');
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    class: 'all',
    section: 'all',
    scheme: 'all',
    schemeType: 'all',
    status: 'all',
    category: 'all',
    isRTE: 'all',
    isEWS: 'all',
    isBPL: 'all',
    gender: 'all',
    disbursementStatus: 'all',
    renewalStatus: 'all',
    incomeRange: 'all',
    academicYear: '2023-24'
  });

  // Modals for editing & disbursements
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);

  // Mock Student Data
  const students: Student[] = [
  {
    id: 'STU001',
    grNo: 'GR001',
    admissionNo: 'ADM-2024-001',
    name: 'Aarav Sharma',
    fatherName: 'Rajesh Sharma',
    motherName: 'Sunita Sharma',
    class: '10',
    section: 'A',
    rollNumber: '15',
    gender: 'Male',
    dob: '2009-05-15',
    category: 'General',
    religion: 'Hindu',
    caste: 'Brahmin',
    isRTE: false,
    isEWS: false,
    isBPL: false,
    isSingleParent: false,
    isOrphan: false,
    isDisabled: false,
    disabilityType: null,
    disabilityPercentage: null,
    address: '123, Green Valley, Mumbai',
    phone: '9876543210',
    email: 'rajesh.sharma@email.com',
    parentOccupation: 'Business',
    annualIncome: 1200000,
    bankName: 'HDFC Bank',
    bankAccount: '1234567890',
    ifscCode: 'HDFC0001234',
    aadharNo: '1234-5678-9012',
    photo: 'https://ui-avatars.com/api/?name=Aarav+Sharma&background=0D8ABC&color=fff'
  },
  {
    id: 'STU002',
    grNo: 'GR002',
    admissionNo: 'ADM-2024-002',
    name: 'Priya Patel',
    fatherName: 'Mahesh Patel',
    motherName: 'Kavita Patel',
    class: '9',
    section: 'B',
    rollNumber: '08',
    gender: 'Female',
    dob: '2010-08-22',
    category: 'OBC',
    religion: 'Hindu',
    caste: 'Patel',
    isRTE: false,
    isEWS: true,
    isBPL: false,
    isSingleParent: false,
    isOrphan: false,
    isDisabled: false,
    disabilityType: null,
    disabilityPercentage: null,
    address: '456, Blue Heights, Mumbai',
    phone: '9876543211',
    email: 'mahesh.patel@email.com',
    parentOccupation: 'Private Job',
    annualIncome: 250000,
    bankName: 'SBI',
    bankAccount: '0987654321',
    ifscCode: 'SBIN0001234',
    aadharNo: '2345-6789-0123',
    photo: 'https://ui-avatars.com/api/?name=Priya+Patel&background=6366f1&color=fff'
  },
  {
    id: 'STU003',
    grNo: 'GR003',
    admissionNo: 'ADM-2024-005',
    name: 'Rohan Kumar',
    fatherName: 'Vijay Kumar',
    motherName: 'Meena Kumar',
    class: '11',
    section: 'A',
    rollNumber: '12',
    gender: 'Male',
    dob: '2008-03-10',
    category: 'SC',
    religion: 'Hindu',
    caste: 'Scheduled Caste',
    isRTE: true,
    isEWS: false,
    isBPL: true,
    isSingleParent: false,
    isOrphan: false,
    isDisabled: false,
    disabilityType: null,
    disabilityPercentage: null,
    address: '789, Rose Garden, Mumbai',
    phone: '9876543212',
    email: 'vijay.kumar@email.com',
    parentOccupation: 'Labour',
    annualIncome: 120000,
    bankName: 'Bank of India',
    bankAccount: '1122334455',
    ifscCode: 'BKID0001234',
    aadharNo: '3456-7890-1234',
    photo: 'https://ui-avatars.com/api/?name=Rohan+Kumar&background=10b981&color=fff'
  },
  {
    id: 'STU004',
    grNo: 'GR004',
    admissionNo: 'ADM-2024-008',
    name: 'Ananya Singh',
    fatherName: 'Late Rakesh Singh',
    motherName: 'Geeta Singh',
    class: '8',
    section: 'A',
    rollNumber: '05',
    gender: 'Female',
    dob: '2011-11-05',
    category: 'General',
    religion: 'Hindu',
    caste: 'Rajput',
    isRTE: false,
    isEWS: true,
    isBPL: false,
    isSingleParent: true,
    isOrphan: false,
    isDisabled: false,
    disabilityType: null,
    disabilityPercentage: null,
    address: '321, Park Street, Mumbai',
    phone: '9876543213',
    email: 'geeta.singh@email.com',
    parentOccupation: 'Housewife',
    annualIncome: 180000,
    bankName: 'PNB',
    bankAccount: '5566778899',
    ifscCode: 'PUNB0001234',
    aadharNo: '4567-8901-2345',
    photo: 'https://ui-avatars.com/api/?name=Ananya+Singh&background=f59e0b&color=fff'
  },
  {
    id: 'STU005',
    grNo: 'GR005',
    admissionNo: 'ADM-2024-012',
    name: 'Mohammed Imran',
    fatherName: 'Abdul Karim',
    motherName: 'Fatima Begum',
    class: '10',
    section: 'B',
    rollNumber: '22',
    gender: 'Male',
    dob: '2009-07-18',
    category: 'Other',
    religion: 'Muslim',
    caste: 'N/A',
    isRTE: true,
    isEWS: true,
    isBPL: true,
    isSingleParent: false,
    isOrphan: false,
    isDisabled: false,
    disabilityType: null,
    disabilityPercentage: null,
    address: '654, Old City, Mumbai',
    phone: '9876543214',
    email: 'abdul.karim@email.com',
    parentOccupation: 'Tailor',
    annualIncome: 100000,
    bankName: 'Union Bank',
    bankAccount: '6677889900',
    ifscCode: 'UBIN0001234',
    aadharNo: '5678-9012-3456',
    photo: 'https://ui-avatars.com/api/?name=Mohammed+Imran&background=ef4444&color=fff'
  },
  {
    id: 'STU006',
    grNo: 'GR006',
    admissionNo: 'ADM-2024-015',
    name: 'Sneha Desai',
    fatherName: 'Hitesh Desai',
    motherName: 'Rekha Desai',
    class: '12',
    section: 'A',
    rollNumber: '03',
    gender: 'Female',
    dob: '2007-02-28',
    category: 'General',
    religion: 'Hindu',
    caste: 'Vaishya',
    isRTE: false,
    isEWS: false,
    isBPL: false,
    isSingleParent: false,
    isOrphan: false,
    isDisabled: true,
    disabilityType: 'Visual Impairment',
    disabilityPercentage: 45,
    address: '987, Hill Road, Mumbai',
    phone: '9876543215',
    email: 'hitesh.desai@email.com',
    parentOccupation: 'Accountant',
    annualIncome: 600000,
    bankName: 'ICICI Bank',
    bankAccount: '7788990011',
    ifscCode: 'ICIC0001234',
    aadharNo: '6789-0123-4567',
    photo: 'https://ui-avatars.com/api/?name=Sneha+Desai&background=8b5cf6&color=fff'
  }];

  // Mock Scholarship Data
  const [scholarships, setScholarships] = useState<Scholarship[]>([
  {
    id: 'SCH001',
    studentId: 'STU001',
    student: students[0],
    schemeId: 'SCHEME001',
    schemeName: 'Merit Scholarship',
    schemeType: 'Merit',
    schemeCategory: 'Institution',
    academicYear: '2023-24',
    applicationDate: '2024-04-15',
    approvalDate: '2024-05-01',
    sanctionedAmount: 25000,
    disbursedAmount: 15000,
    pendingAmount: 10000,
    disbursementSchedule: 'Quarterly',
    disbursements: [
    { id: 'DIS001', date: '2024-05-15', amount: 7500, mode: 'Bank Transfer', reference: 'TXN001', status: 'Completed' },
    { id: 'DIS002', date: '2024-08-15', amount: 7500, mode: 'Bank Transfer', reference: 'TXN002', status: 'Completed' }],

    status: 'Active',
    renewalStatus: 'Not Applicable',
    validFrom: '2024-04-01',
    validTo: '2025-03-31',
    documents: [
    { name: 'Mark Sheet', type: 'Academic', status: 'Verified' },
    { name: 'Income Certificate', type: 'Financial', status: 'Verified' }],

    remarks: 'Excellent academic performance',
    approvedBy: 'Principal',
    createdAt: '2024-04-15',
    updatedAt: '2024-08-15'
  },
  {
    id: 'SCH002',
    studentId: 'STU002',
    student: students[1],
    schemeId: 'SCHEME002',
    schemeName: 'EWS Fee Waiver',
    schemeType: 'EWS',
    schemeCategory: 'State',
    academicYear: '2023-24',
    applicationDate: '2024-04-10',
    approvalDate: '2024-05-05',
    sanctionedAmount: 15000,
    disbursedAmount: 10000,
    pendingAmount: 5000,
    disbursementSchedule: 'Half-yearly',
    disbursements: [
    { id: 'DIS003', date: '2024-05-20', amount: 10000, mode: 'Bank Transfer', reference: 'TXN003', status: 'Completed' }],

    status: 'Active',
    renewalStatus: 'Eligible',
    validFrom: '2024-04-01',
    validTo: '2025-03-31',
    documents: [
    { name: 'EWS Certificate', type: 'Category', status: 'Verified' },
    { name: 'Income Certificate', type: 'Financial', status: 'Verified' },
    { name: 'Residence Proof', type: 'Identity', status: 'Verified' }],

    remarks: 'EWS category student with good attendance',
    approvedBy: 'Admin',
    createdAt: '2024-04-10',
    updatedAt: '2024-05-20'
  },
  {
    id: 'SCH003',
    studentId: 'STU003',
    student: students[2],
    schemeId: 'SCHEME003',
    schemeName: 'RTE Admission',
    schemeType: 'RTE',
    schemeCategory: 'Central',
    academicYear: '2023-24',
    applicationDate: '2024-04-01',
    approvalDate: '2024-04-20',
    sanctionedAmount: 35000,
    disbursedAmount: 0,
    pendingAmount: 35000,
    disbursementSchedule: 'Yearly',
    disbursements: [],
    status: 'Approved',
    renewalStatus: 'Not Applicable',
    validFrom: '2024-04-01',
    validTo: '2025-03-31',
    documents: [
    { name: 'RTE Certificate', type: 'Category', status: 'Verified' },
    { name: 'BPL Card', type: 'Financial', status: 'Verified' },
    { name: 'Caste Certificate', type: 'Category', status: 'Verified' },
    { name: 'Birth Certificate', type: 'Identity', status: 'Verified' }],

    remarks: 'Admitted under RTE quota, BPL category',
    approvedBy: 'Principal',
    createdAt: '2024-04-01',
    updatedAt: '2024-04-20'
  },
  {
    id: 'SCH004',
    studentId: 'STU004',
    student: students[3],
    schemeId: 'SCHEME004',
    schemeName: 'Single Parent Support',
    schemeType: 'Need-based',
    schemeCategory: 'Institution',
    academicYear: '2023-24',
    applicationDate: '2024-04-12',
    approvalDate: '2024-05-10',
    sanctionedAmount: 12000,
    disbursedAmount: 12000,
    pendingAmount: 0,
    disbursementSchedule: 'One-time',
    disbursements: [
    { id: 'DIS004', date: '2024-05-15', amount: 12000, mode: 'Bank Transfer', reference: 'TXN004', status: 'Completed' }],

    status: 'Completed',
    renewalStatus: 'Eligible',
    validFrom: '2024-04-01',
    validTo: '2025-03-31',
    documents: [
    { name: 'Death Certificate', type: 'Legal', status: 'Verified' },
    { name: 'Income Certificate', type: 'Financial', status: 'Verified' }],

    remarks: 'Father deceased, mother is sole earner',
    approvedBy: 'Trust Committee',
    createdAt: '2024-04-12',
    updatedAt: '2024-05-15'
  },
  {
    id: 'SCH005',
    studentId: 'STU005',
    student: students[4],
    schemeId: 'SCHEME005',
    schemeName: 'Minority Scholarship',
    schemeType: 'Minority',
    schemeCategory: 'Central',
    academicYear: '2023-24',
    applicationDate: '2024-04-08',
    approvalDate: null,
    sanctionedAmount: 20000,
    disbursedAmount: 0,
    pendingAmount: 20000,
    disbursementSchedule: 'Yearly',
    disbursements: [],
    status: 'Under Review',
    renewalStatus: 'Not Applicable',
    validFrom: '2024-04-01',
    validTo: '2025-03-31',
    documents: [
    { name: 'Minority Certificate', type: 'Category', status: 'Verified' },
    { name: 'Income Certificate', type: 'Financial', status: 'Pending' },
    { name: 'Bank Passbook', type: 'Financial', status: 'Pending' }],

    remarks: 'Application under review by state scholarship portal',
    approvedBy: null,
    createdAt: '2024-04-08',
    updatedAt: '2024-04-08'
  },
  {
    id: 'SCH006',
    studentId: 'STU006',
    student: students[5],
    schemeId: 'SCHEME006',
    schemeName: 'Disability Support Scholarship',
    schemeType: 'Disability',
    schemeCategory: 'State',
    academicYear: '2023-24',
    applicationDate: '2024-04-05',
    approvalDate: '2024-04-25',
    sanctionedAmount: 30000,
    disbursedAmount: 15000,
    pendingAmount: 15000,
    disbursementSchedule: 'Half-yearly',
    disbursements: [
    { id: 'DIS005', date: '2024-05-01', amount: 15000, mode: 'Bank Transfer', reference: 'TXN005', status: 'Completed' }],

    status: 'Active',
    renewalStatus: 'Renewed',
    validFrom: '2024-04-01',
    validTo: '2025-03-31',
    documents: [
    { name: 'Disability Certificate', type: 'Medical', status: 'Verified' },
    { name: 'Medical Report', type: 'Medical', status: 'Verified' },
    { name: 'Aadhar Card', type: 'Identity', status: 'Verified' }],

    remarks: 'Visual impairment - 45%, requires special assistance',
    approvedBy: 'Principal',
    createdAt: '2024-04-05',
    updatedAt: '2024-05-01'
  },
  {
    id: 'SCH007',
    studentId: 'STU003',
    student: students[2],
    schemeId: 'SCHEME007',
    schemeName: 'Sports Excellence Award',
    schemeType: 'Sports',
    schemeCategory: 'Institution',
    academicYear: '2023-24',
    applicationDate: '2024-06-01',
    approvalDate: '2024-06-15',
    sanctionedAmount: 20000,
    disbursedAmount: 20000,
    pendingAmount: 0,
    disbursementSchedule: 'One-time',
    disbursements: [
    { id: 'DIS006', date: '2024-06-20', amount: 20000, mode: 'Cheque', reference: 'CHQ001', status: 'Completed' }],

    status: 'Completed',
    renewalStatus: 'Not Applicable',
    validFrom: '2024-06-01',
    validTo: '2024-08-31',
    documents: [
    { name: 'Sports Achievement Certificate', type: 'Achievement', status: 'Verified' },
    { name: 'State Selection Letter', type: 'Achievement', status: 'Verified' }],

    remarks: 'State level cricket selection',
    approvedBy: 'Sports Committee',
    createdAt: '2024-06-01',
    updatedAt: '2024-06-20'
  }]);


  // Scheme Information
  const schemes: SchemeInfo[] = [
  { id: 'SCHEME001', name: 'Merit Scholarship', type: 'Merit', category: 'Institution', eligibilityCriteria: ['Above 90% marks', 'Good conduct'], maxAmount: 50000, beneficiaries: 45 },
  { id: 'SCHEME002', name: 'EWS Fee Waiver', type: 'EWS', category: 'State', eligibilityCriteria: ['Valid EWS certificate', 'Income below 8 lakh'], maxAmount: 25000, beneficiaries: 78 },
  { id: 'SCHEME003', name: 'RTE Admission', type: 'RTE', category: 'Central', eligibilityCriteria: ['RTE eligible', 'Age criteria'], maxAmount: 50000, beneficiaries: 120 },
  { id: 'SCHEME004', name: 'Single Parent Support', type: 'Need-based', category: 'Institution', eligibilityCriteria: ['Single parent', 'Income criteria'], maxAmount: 20000, beneficiaries: 23 },
  { id: 'SCHEME005', name: 'Minority Scholarship', type: 'Minority', category: 'Central', eligibilityCriteria: ['Minority community', 'Income below 2 lakh'], maxAmount: 30000, beneficiaries: 56 },
  { id: 'SCHEME006', name: 'Disability Support', type: 'Disability', category: 'State', eligibilityCriteria: ['40%+ disability', 'Valid certificate'], maxAmount: 40000, beneficiaries: 15 },
  { id: 'SCHEME007', name: 'Sports Excellence', type: 'Sports', category: 'Institution', eligibilityCriteria: ['State/National level', 'Active participation'], maxAmount: 30000, beneficiaries: 32 }];


  // Statistics
  const stats = useMemo(() => {
    const totalBeneficiaries = scholarships.length;
    const uniqueStudents = new Set(scholarships.map((s) => s.studentId)).size;
    const totalSanctioned = scholarships.reduce((sum, s) => sum + s.sanctionedAmount, 0);
    const totalDisbursed = scholarships.reduce((sum, s) => sum + s.disbursedAmount, 0);
    const totalPending = scholarships.reduce((sum, s) => sum + s.pendingAmount, 0);

    const rteStudents = scholarships.filter((s) => s.schemeType === 'RTE').length;
    const ewsStudents = scholarships.filter((s) => s.schemeType === 'EWS').length;
    const activeScholarships = scholarships.filter((s) => s.status === 'Active').length;
    const pendingApproval = scholarships.filter((s) => s.status === 'Under Review' || s.status === 'Applied').length;

    const bySchemeType = {
      Merit: scholarships.filter((s) => s.schemeType === 'Merit').length,
      RTE: scholarships.filter((s) => s.schemeType === 'RTE').length,
      EWS: scholarships.filter((s) => s.schemeType === 'EWS').length,
      Sports: scholarships.filter((s) => s.schemeType === 'Sports').length,
      'Need-based': scholarships.filter((s) => s.schemeType === 'Need-based').length,
      Minority: scholarships.filter((s) => s.schemeType === 'Minority').length,
      Disability: scholarships.filter((s) => s.schemeType === 'Disability').length
    };

    return {
      totalBeneficiaries,
      uniqueStudents,
      totalSanctioned,
      totalDisbursed,
      totalPending,
      rteStudents,
      ewsStudents,
      activeScholarships,
      pendingApproval,
      disbursementRate: (totalDisbursed / totalSanctioned * 100).toFixed(1),
      bySchemeType
    };
  }, [scholarships]);

  // Filter scholarships
  const filteredScholarships = useMemo(() => {
    return scholarships.filter((scholarship) => {
      const student = scholarship.student;

      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
      student.name.toLowerCase().includes(searchLower) ||
      student.grNo.toLowerCase().includes(searchLower) ||
      student.admissionNo.toLowerCase().includes(searchLower) ||
      scholarship.schemeName.toLowerCase().includes(searchLower) ||
      student.fatherName.toLowerCase().includes(searchLower);

      // Tab filter
      let matchesTab = true;
      if (activeTab === 'rte') matchesTab = scholarship.schemeType === 'RTE' || student.isRTE;else
      if (activeTab === 'ews') matchesTab = scholarship.schemeType === 'EWS' || student.isEWS;else
      if (activeTab === 'merit') matchesTab = scholarship.schemeType === 'Merit';else
      if (activeTab === 'sports') matchesTab = scholarship.schemeType === 'Sports';else
      if (activeTab === 'government') matchesTab = scholarship.schemeCategory === 'Central' || scholarship.schemeCategory === 'State';

      // Class filter
      const matchesClass = filters.class === 'all' || student.class === filters.class;

      // Section filter
      const matchesSection = filters.section === 'all' || student.section === filters.section;

      // Scheme filter
      const matchesScheme = filters.scheme === 'all' || scholarship.schemeId === filters.scheme;

      // Scheme type filter
      const matchesSchemeType = filters.schemeType === 'all' || scholarship.schemeType === filters.schemeType;

      // Status filter
      const matchesStatus = filters.status === 'all' || scholarship.status === filters.status;

      // Category filter
      const matchesCategory = filters.category === 'all' || student.category === filters.category;

      // RTE filter
      const matchesRTE =
      filters.isRTE === 'all' ||
      filters.isRTE === 'yes' && student.isRTE ||
      filters.isRTE === 'no' && !student.isRTE;

      // EWS filter
      const matchesEWS =
      filters.isEWS === 'all' ||
      filters.isEWS === 'yes' && student.isEWS ||
      filters.isEWS === 'no' && !student.isEWS;

      // BPL filter
      const matchesBPL =
      filters.isBPL === 'all' ||
      filters.isBPL === 'yes' && student.isBPL ||
      filters.isBPL === 'no' && !student.isBPL;

      // Gender filter
      const matchesGender = filters.gender === 'all' || student.gender === filters.gender;

      // Disbursement status filter
      let matchesDisbursement = true;
      if (filters.disbursementStatus === 'fully') {
        matchesDisbursement = scholarship.pendingAmount === 0;
      } else if (filters.disbursementStatus === 'partial') {
        matchesDisbursement = scholarship.disbursedAmount > 0 && scholarship.pendingAmount > 0;
      } else if (filters.disbursementStatus === 'pending') {
        matchesDisbursement = scholarship.disbursedAmount === 0;
      }

      // Income range filter
      let matchesIncome = true;
      if (filters.incomeRange === 'below1') matchesIncome = student.annualIncome < 100000;else
      if (filters.incomeRange === '1to2.5') matchesIncome = student.annualIncome >= 100000 && student.annualIncome < 250000;else
      if (filters.incomeRange === '2.5to5') matchesIncome = student.annualIncome >= 250000 && student.annualIncome < 500000;else
      if (filters.incomeRange === 'above5') matchesIncome = student.annualIncome >= 500000;

      return (
        matchesSearch &&
        matchesTab &&
        matchesClass &&
        matchesSection &&
        matchesScheme &&
        matchesSchemeType &&
        matchesStatus &&
        matchesCategory &&
        matchesRTE &&
        matchesEWS &&
        matchesBPL &&
        matchesGender &&
        matchesDisbursement &&
        matchesIncome);

    });
  }, [searchTerm, activeTab, filters, scholarships]);

  // Reset filters
  const resetFilters = () => {
    setFilters({
      class: 'all',
      section: 'all',
      scheme: 'all',
      schemeType: 'all',
      status: 'all',
      category: 'all',
      isRTE: 'all',
      isEWS: 'all',
      isBPL: 'all',
      gender: 'all',
      disbursementStatus: 'all',
      renewalStatus: 'all',
      incomeRange: 'all',
      academicYear: '2023-24'
    });
    setSearchTerm('');
  };

  // Export functions
  const exportToCSV = () => {
    const headers = [
    'GR No',
    'Admission No',
    'Student Name',
    'Father Name',
    'Class',
    'Section',
    'Category',
    'RTE',
    'EWS',
    'BPL',
    'Scheme Name',
    'Scheme Type',
    'Sanctioned Amount',
    'Disbursed Amount',
    'Pending Amount',
    'Status',
    'Valid From',
    'Valid To'];


    const data = filteredScholarships.map((s) => [
    s.student.grNo,
    s.student.admissionNo,
    s.student.name,
    s.student.fatherName,
    s.student.class,
    s.student.section,
    s.student.category,
    s.student.isRTE ? 'Yes' : 'No',
    s.student.isEWS ? 'Yes' : 'No',
    s.student.isBPL ? 'Yes' : 'No',
    s.schemeName,
    s.schemeType,
    s.sanctionedAmount,
    s.disbursedAmount,
    s.pendingAmount,
    s.status,
    s.validFrom,
    s.validTo]
    );

    const csvContent = [headers.join(','), ...data.map((row) => row.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `scholarship_list_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const downloadScholarshipCertificate = (scholarship: Scholarship) => {
    const certText = `=====================================================
SCHOLARSHIP SANCTION CERTIFICATE
Academic Year: ${scholarship.academicYear}
=====================================================
Certificate No: CERT-${scholarship.id}
Issue Date: ${new Date().toLocaleDateString('en-IN')}

This is to certify that:
Student Name: ${scholarship.student.name}
GR No: ${scholarship.student.grNo} | Admission No: ${scholarship.student.admissionNo}
Class & Section: Class ${scholarship.student.class}-${scholarship.student.section}
Category: ${scholarship.student.category}

Has been awarded the following scholarship benefit:
Scheme Name: ${scholarship.schemeName}
Scheme Type: ${scholarship.schemeType}
Category: ${scholarship.schemeCategory}
Sanctioned Amount: INR ${scholarship.sanctionedAmount.toLocaleString('en-IN')}
Disbursed Amount: INR ${scholarship.disbursedAmount.toLocaleString('en-IN')}
Pending Balance: INR ${scholarship.pendingAmount.toLocaleString('en-IN')}
Validity: ${scholarship.validFrom} to ${scholarship.validTo}

Authorized Signatory: ${scholarship.approvedBy || 'Principal'}
K12 School Scholarship Administration Desk
=====================================================`;

    const blob = new Blob([certText], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Scholarship_Certificate_${scholarship.student.grNo}_${scholarship.id}.txt`;
    link.click();
  };

  const handlePrintCertificate = (scholarship: Scholarship) => {
    window.print();
  };

  const handleSaveScholarshipEdit = () => {
    if (!editingScholarship) return;
    setScholarships((prev) =>
      prev.map((s) => (s.id === editingScholarship.id ? editingScholarship : s))
    );
    alert(`Successfully updated scholarship ${editingScholarship.id} for ${editingScholarship.student.name}`);
    setShowEditModal(false);
  };

  const exportToExcel = () => {
    alert('Excel export would be implemented with xlsx library');
  };

  const exportToPDF = () => {
    alert('PDF export would be implemented with jsPDF library');
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Active
          </Badge>);

      case 'Approved':
        return (
          <Badge variant="info" className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Approved
          </Badge>);

      case 'Under Review':
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Under Review
          </Badge>);

      case 'Applied':
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            Applied
          </Badge>);

      case 'Completed':
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </Badge>);

      case 'Rejected':
        return (
          <Badge variant="danger" className="flex items-center gap-1">
            <X className="w-3 h-3" />
            Rejected
          </Badge>);

      case 'Suspended':
        return (
          <Badge variant="danger" className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Suspended
          </Badge>);

      case 'Expired':
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Expired
          </Badge>);

      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  // Get scheme type badge
  const getSchemeTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      Merit: 'bg-purple-100 text-purple-700',
      RTE: 'bg-emerald-100 text-emerald-700',
      EWS: 'bg-blue-100 text-blue-700',
      Sports: 'bg-amber-100 text-amber-700',
      'Need-based': 'bg-purple-100 text-purple-700',
      Minority: 'bg-emerald-100 text-emerald-700',
      Disability: 'bg-rose-100 text-rose-700',
      Government: 'bg-indigo-100 text-indigo-700',
      Other: 'bg-gray-100 text-gray-700'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colors[type] || colors.Other}`}>
        {type}
      </span>);

  };

  // Table columns
  const columns = [
  {
    key: 'select',
    header:
    <input
      type="checkbox"
      className="rounded border-gray-300"
      checked={selectedScholarships.length === filteredScholarships.length && filteredScholarships.length > 0}
      onChange={(e) =>
      setSelectedScholarships(e.target.checked ? filteredScholarships.map((s) => s.id) : [])
      } />,


    render: (row: Scholarship) =>
    <input
      type="checkbox"
      className="rounded border-gray-300"
      checked={selectedScholarships.includes(row.id)}
      onChange={() =>
      setSelectedScholarships((prev) =>
      prev.includes(row.id) ? prev.filter((id) => id !== row.id) : [...prev, row.id]
      )
      } />


  },
  {
    key: 'student',
    header: 'Student Details',
    render: (row: Scholarship) =>
    <div className="flex items-center gap-3">
          <img
        src={row.student.photo}
        alt={row.student.name}
        className="w-10 h-10 rounded-full" />

          <div>
            <div className="font-medium text-gray-900">{row.student.name}</div>
            <div className="text-xs text-gray-500">
              {row.student.grNo} | Class {row.student.class}-{row.student.section}
            </div>
            <div className="flex gap-1 mt-1">
              {row.student.isRTE &&
          <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] rounded font-medium">
                  RTE
                </span>
          }
              {row.student.isEWS &&
          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded font-medium">
                  EWS
                </span>
          }
              {row.student.isBPL &&
          <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] rounded font-medium">
                  BPL
                </span>
          }
              {row.student.isDisabled &&
          <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 text-[10px] rounded font-medium">
                  PwD
                </span>
          }
            </div>
          </div>
        </div>

  },
  {
    key: 'category',
    header: 'Category',
    render: (row: Scholarship) =>
    <div className="text-sm">
          <div className="font-medium">{row.student.category}</div>
          <div className="text-xs text-gray-500">{row.student.religion}</div>
        </div>

  },
  {
    key: 'scheme',
    header: 'Scholarship Scheme',
    render: (row: Scholarship) =>
    <div>
          <div className="font-medium text-gray-900">{row.schemeName}</div>
          <div className="flex items-center gap-2 mt-1">
            {getSchemeTypeBadge(row.schemeType)}
            <span className="text-xs text-gray-500">{row.schemeCategory}</span>
          </div>
        </div>

  },
  {
    key: 'amount',
    header: 'Amount Details',
    render: (row: Scholarship) =>
    <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-500">Sanctioned:</span>
            <span className="font-bold text-gray-900">₹{row.sanctionedAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Disbursed:</span>
            <span className="text-emerald-600 font-medium">₹{row.disbursedAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Pending:</span>
            <span className={`font-medium ${row.pendingAmount > 0 ? 'text-amber-600' : 'text-gray-400'}`}>
              ₹{row.pendingAmount.toLocaleString()}
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
            <div
          className="bg-emerald-500 h-1.5 rounded-full"
          style={{ width: `${row.disbursedAmount / row.sanctionedAmount * 100}%` }} />

          </div>
        </div>

  },
  {
    key: 'validity',
    header: 'Validity',
    render: (row: Scholarship) =>
    <div className="text-sm">
          <div className="text-gray-600">
            {new Date(row.validFrom).toLocaleDateString('en-IN')}
          </div>
          <div className="text-gray-400">to</div>
          <div className="text-gray-600">
            {new Date(row.validTo).toLocaleDateString('en-IN')}
          </div>
        </div>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: Scholarship) =>
    <div className="space-y-1">
          {getStatusBadge(row.status)}
          <div className="text-xs text-gray-500">{row.disbursementSchedule}</div>
        </div>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: Scholarship) =>
    <div className="flex items-center gap-1">
          <Button
        variant="ghost"
        size="sm"
        title="View Details"
        onClick={() => {
          setSelectedScholarship(row);
          setShowDetailModal(true);
        }}>

            <Eye className="w-4 h-4 text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            title="Download Certificate"
            onClick={() => {
              downloadScholarshipCertificate(row);
            }}
          >
            <Download className="w-4 h-4 text-purple-600" />
          </Button>
        </div>

  }];


  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                Student Scholarship List
                <Badge variant="secondary" className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200">
                  FY: 2025-26
                </Badge>
              </h1>
              <p className="text-xs text-gray-500">
                Comprehensive view of all scholarships including RTE, EWS, and government schemes
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {Object.values(filters).filter((f) => f !== 'all' && f !== '2023-24').length > 0 &&
            <span className="ml-2 px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                {Object.values(filters).filter((f) => f !== 'all' && f !== '2023-24').length}
              </span>
            }
          </Button>
          <div className="relative">
            <Button variant="outline" onClick={() => setShowExportMenu(!showExportMenu)}>
              <Download className="w-4 h-4 mr-2" />
              Export
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
            {showExportMenu &&
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
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

                    <FileText className="w-4 h-4" />
                    Export as PDF
                  </button>
                </div>
              </div>
            }
          </div>
         
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Total Beneficiaries</p>
              <p className="text-2xl font-bold text-purple-900">{stats.totalBeneficiaries}</p>
              <p className="text-xs text-purple-500">{stats.uniqueStudents} unique students</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-600 font-medium">RTE Students</p>
              <p className="text-2xl font-bold text-emerald-900">{stats.rteStudents}</p>
              <p className="text-xs text-emerald-500">Under RTE quota</p>
            </div>
            <Shield className="w-8 h-8 text-emerald-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">EWS Students</p>
              <p className="text-2xl font-bold text-blue-900">{stats.ewsStudents}</p>
              <p className="text-xs text-blue-500">EWS category</p>
            </div>
            <Home className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-600 font-medium">Total Sanctioned</p>
              <p className="text-2xl font-bold text-emerald-900">
                ₹{(stats.totalSanctioned / 100000).toFixed(1)}L
              </p>
            </div>
            <IndianRupee className="w-8 h-8 text-emerald-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-600 font-medium">Total Disbursed</p>
              <p className="text-2xl font-bold text-emerald-900">
                ₹{(stats.totalDisbursed / 100000).toFixed(1)}L
              </p>
              <p className="text-xs text-emerald-500">{stats.disbursementRate}% disbursed</p>
            </div>
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-600 font-medium">Pending Disbursement</p>
              <p className="text-2xl font-bold text-amber-900">
                ₹{(stats.totalPending / 100000).toFixed(1)}L
              </p>
            </div>
            <Clock className="w-8 h-8 text-amber-500" />
          </div>
        </Card>
      </div>

      {/* Scheme Type Distribution */}
      <div className="grid grid-cols-7 gap-2">
        {Object.entries(stats.bySchemeType).map(([type, count]) =>
        <Card key={type} className="p-3 text-center">
            <p className="text-lg font-bold text-gray-900">{count}</p>
            <p className="text-xs text-gray-500">{type}</p>
          </Card>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto">
        {[
        { id: 'all', label: 'All Scholarships', icon: Award },
        { id: 'rte', label: 'RTE', icon: Shield },
        { id: 'ews', label: 'EWS', icon: Home },
        { id: 'merit', label: 'Merit', icon: Star },
        { id: 'sports', label: 'Sports', icon: Award },
        { id: 'government', label: 'Government', icon: Building }].
        map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === tab.id ?
              'bg-blue-600 text-white' :
              'bg-white text-gray-600 hover:bg-gray-100 border'}`
              }
              onClick={() => setActiveTab(tab.id as any)}>

              <Icon className="w-4 h-4" />
              {tab.label}
            </button>);

        })}
      </div>

      {/* Advanced Filters */}
      {showFilters &&
      <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Advanced Filters</h3>
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <Select
            label="Class"
            options={[
            { value: 'all', label: 'All Classes' },
            { value: '6', label: 'Class 6' },
            { value: '7', label: 'Class 7' },
            { value: '8', label: 'Class 8' },
            { value: '9', label: 'Class 9' },
            { value: '10', label: 'Class 10' },
            { value: '11', label: 'Class 11' },
            { value: '12', label: 'Class 12' }]
            }
            value={filters.class}
            onChange={(e) => setFilters({ ...filters, class: e.target.value })} />


            <Select
            label="Section"
            options={[
            { value: 'all', label: 'All Sections' },
            { value: 'A', label: 'Section A' },
            { value: 'B', label: 'Section B' },
            { value: 'C', label: 'Section C' }]
            }
            value={filters.section}
            onChange={(e) => setFilters({ ...filters, section: e.target.value })} />


            <Select
            label="Scheme Type"
            options={[
            { value: 'all', label: 'All Types' },
            { value: 'Merit', label: 'Merit' },
            { value: 'RTE', label: 'RTE' },
            { value: 'EWS', label: 'EWS' },
            { value: 'Sports', label: 'Sports' },
            { value: 'Need-based', label: 'Need-based' },
            { value: 'Minority', label: 'Minority' },
            { value: 'Disability', label: 'Disability' },
            { value: 'Government', label: 'Government' }]
            }
            value={filters.schemeType}
            onChange={(e) => setFilters({ ...filters, schemeType: e.target.value })} />


            <Select
            label="Status"
            options={[
            { value: 'all', label: 'All Status' },
            { value: 'Active', label: 'Active' },
            { value: 'Approved', label: 'Approved' },
            { value: 'Under Review', label: 'Under Review' },
            { value: 'Applied', label: 'Applied' },
            { value: 'Completed', label: 'Completed' },
            { value: 'Rejected', label: 'Rejected' },
            { value: 'Suspended', label: 'Suspended' }]
            }
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })} />


            <Select
            label="Category"
            options={[
            { value: 'all', label: 'All Categories' },
            { value: 'General', label: 'General' },
            { value: 'OBC', label: 'OBC' },
            { value: 'SC', label: 'SC' },
            { value: 'ST', label: 'ST' },
            { value: 'EWS', label: 'EWS' }]
            }
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })} />


            <Select
            label="RTE Status"
            options={[
            { value: 'all', label: 'All' },
            { value: 'yes', label: 'RTE Student' },
            { value: 'no', label: 'Non-RTE' }]
            }
            value={filters.isRTE}
            onChange={(e) => setFilters({ ...filters, isRTE: e.target.value })} />


            <Select
            label="EWS Status"
            options={[
            { value: 'all', label: 'All' },
            { value: 'yes', label: 'EWS Student' },
            { value: 'no', label: 'Non-EWS' }]
            }
            value={filters.isEWS}
            onChange={(e) => setFilters({ ...filters, isEWS: e.target.value })} />


            <Select
            label="BPL Status"
            options={[
            { value: 'all', label: 'All' },
            { value: 'yes', label: 'BPL Family' },
            { value: 'no', label: 'Non-BPL' }]
            }
            value={filters.isBPL}
            onChange={(e) => setFilters({ ...filters, isBPL: e.target.value })} />


            <Select
            label="Gender"
            options={[
            { value: 'all', label: 'All' },
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' },
            { value: 'Other', label: 'Other' }]
            }
            value={filters.gender}
            onChange={(e) => setFilters({ ...filters, gender: e.target.value })} />


            <Select
            label="Disbursement Status"
            options={[
            { value: 'all', label: 'All' },
            { value: 'fully', label: 'Fully Disbursed' },
            { value: 'partial', label: 'Partially Disbursed' },
            { value: 'pending', label: 'Pending' }]
            }
            value={filters.disbursementStatus}
            onChange={(e) => setFilters({ ...filters, disbursementStatus: e.target.value })} />


            <Select
            label="Family Income"
            options={[
            { value: 'all', label: 'All Income Levels' },
            { value: 'below1', label: 'Below ₹1 Lakh' },
            { value: '1to2.5', label: '₹1-2.5 Lakh' },
            { value: '2.5to5', label: '₹2.5-5 Lakh' },
            { value: 'above5', label: 'Above ₹5 Lakh' }]
            }
            value={filters.incomeRange}
            onChange={(e) => setFilters({ ...filters, incomeRange: e.target.value })} />


            <Select
            label="Academic Year"
            options={[
            { value: '2023-24', label: '2023-24' },
            { value: '2022-23', label: '2022-23' },
            { value: '2021-22', label: '2021-22' }]
            }
            value={filters.academicYear}
            onChange={(e) => setFilters({ ...filters, academicYear: e.target.value })} />

          </div>
        </Card>
      }

      {/* Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by student name, GR No, admission number, father's name, or scheme..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-gray-400" />} />

          </div>
          <div className="flex gap-2">
            <Select
              options={[
              { value: 'all', label: 'All Schemes' },
              ...schemes.map((s) => ({ value: s.id, label: s.name }))]
              }
              value={filters.scheme}
              onChange={(e) => setFilters({ ...filters, scheme: e.target.value })} />

          </div>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedScholarships.length > 0 &&
      <Card className="p-3 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800 font-medium">
              {selectedScholarships.length} scholarship(s) selected
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-white"
                onClick={() => {
                  exportToCSV();
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Selected
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white"
                onClick={() => {
                  alert(`Notification dispatched to ${selectedScholarships.length} student(s) / parents via SMS and Portal.`);
                }}
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Notification
              </Button>
            </div>
          </div>
        </Card>
      }

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          Showing <strong>{filteredScholarships.length}</strong> of{' '}
          <strong>{scholarships.length}</strong> scholarships
        </span>
        <span className="text-sm text-gray-500">
          Total Value: ₹{filteredScholarships.reduce((sum, s) => sum + s.sanctionedAmount, 0).toLocaleString()}
        </span>
      </div>

      {/* Scholarship List Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table columns={columns} data={filteredScholarships} />
        </div>
      </Card>

      {/* Detail Modal */}
      {showDetailModal && selectedScholarship &&
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white z-10">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Scholarship Details</h2>
                  <p className="text-sm text-gray-500">{selectedScholarship.schemeName}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowDetailModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Student Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <img
                src={selectedScholarship.student.photo}
                alt={selectedScholarship.student.name}
                className="w-20 h-20 rounded-xl" />

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">
                    {selectedScholarship.student.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedScholarship.student.grNo} | {selectedScholarship.student.admissionNo}
                  </p>
                  <p className="text-sm text-gray-500">
                    Class {selectedScholarship.student.class}-{selectedScholarship.student.section}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {selectedScholarship.student.isRTE &&
                  <Badge variant="success">RTE</Badge>
                  }
                    {selectedScholarship.student.isEWS &&
                  <Badge variant="info">EWS</Badge>
                  }
                    {selectedScholarship.student.isBPL &&
                  <Badge variant="warning">BPL</Badge>
                  }
                    <Badge variant="default">{selectedScholarship.student.category}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  {getStatusBadge(selectedScholarship.status)}
                  <div className="text-sm text-gray-500 mt-2">
                    Valid: {new Date(selectedScholarship.validFrom).toLocaleDateString()} -{' '}
                    {new Date(selectedScholarship.validTo).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Scheme & Amount Info */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-900">Scheme Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Scheme Name:</span>
                      <span className="font-medium">{selectedScholarship.schemeName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Type:</span>
                      {getSchemeTypeBadge(selectedScholarship.schemeType)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Category:</span>
                      <span>{selectedScholarship.schemeCategory}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Schedule:</span>
                      <span>{selectedScholarship.disbursementSchedule}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Academic Year:</span>
                      <span>{selectedScholarship.academicYear}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-gray-900">Amount Details</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-blue-700">Sanctioned Amount:</span>
                      <span className="text-xl font-bold text-blue-900">
                        ₹{selectedScholarship.sanctionedAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                      <span className="text-emerald-700">Disbursed Amount:</span>
                      <span className="text-xl font-bold text-emerald-900">
                        ₹{selectedScholarship.disbursedAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                      <span className="text-amber-700">Pending Amount:</span>
                      <span className="text-xl font-bold text-amber-900">
                        ₹{selectedScholarship.pendingAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Disbursement History */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Disbursement History</h4>
                {selectedScholarship.disbursements.length > 0 ?
              <div className="space-y-2">
                    {selectedScholarship.disbursements.map((d) =>
                <div
                  key={d.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">

                        <div>
                          <div className="font-medium">₹{d.amount.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">
                            {d.mode} • {d.reference}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm">
                            {new Date(d.date).toLocaleDateString()}
                          </div>
                          <Badge
                      variant={d.status === 'Completed' ? 'success' : 'warning'}
                      className="text-xs">

                            {d.status}
                          </Badge>
                        </div>
                      </div>
                )}
                  </div> :

              <div className="text-center py-6 text-gray-500">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No disbursements yet</p>
                  </div>
              }
              </div>

              {/* Documents */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Documents</h4>
                <div className="grid grid-cols-2 gap-3">
                  {selectedScholarship.documents.map((doc, index) =>
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg">

                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium">{doc.name}</div>
                          <div className="text-xs text-gray-500">{doc.type}</div>
                        </div>
                      </div>
                      <Badge
                    variant={
                    doc.status === 'Verified' ?
                    'success' :
                    doc.status === 'Rejected' ?
                    'danger' :
                    'warning'
                    }>

                        {doc.status}
                      </Badge>
                    </div>
                )}
                </div>
              </div>

              {/* Remarks */}
              {selectedScholarship.remarks &&
            <div className="p-4 bg-amber-50 rounded-lg">
                  <h4 className="font-bold text-amber-800 mb-2">Remarks</h4>
                  <p className="text-sm text-amber-700">{selectedScholarship.remarks}</p>
                </div>
            }

              {/* Student Contact Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Contact Information</h4>
                  <div className="space-y-1">
                    <p>
                      <Phone className="w-4 h-4 inline mr-2 text-gray-400" />
                      {selectedScholarship.student.phone}
                    </p>
                    <p>
                      <Mail className="w-4 h-4 inline mr-2 text-gray-400" />
                      {selectedScholarship.student.email}
                    </p>
                    <p>
                      <MapPin className="w-4 h-4 inline mr-2 text-gray-400" />
                      {selectedScholarship.student.address}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Bank Details</h4>
                  <div className="space-y-1">
                    <p>Bank: {selectedScholarship.student.bankName}</p>
                    <p>A/C: {selectedScholarship.student.bankAccount}</p>
                    <p>IFSC: {selectedScholarship.student.ifscCode}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-3 sticky bottom-0 bg-white">
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
              <Button variant="outline" onClick={() => handlePrintCertificate(selectedScholarship)}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" onClick={() => downloadScholarshipCertificate(selectedScholarship)}>
                <Download className="w-4 h-4 mr-2" />
                Download Certificate
              </Button>
            </div>
          </div>
        </div>
      }


      {/* Edit Scholarship Modal */}
      {showEditModal && editingScholarship && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-2xl border space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Edit Student Scholarship</h3>
                <p className="text-xs text-gray-500">
                  {editingScholarship.student.name} ({editingScholarship.student.grNo})
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowEditModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Scheme Name"
                  value={editingScholarship.schemeName}
                  onChange={(e) => setEditingScholarship({ ...editingScholarship, schemeName: e.target.value })}
                />
                <Select
                  label="Status"
                  options={[
                    { value: 'Active', label: 'Active' },
                    { value: 'Approved', label: 'Approved' },
                    { value: 'Completed', label: 'Completed' },
                    { value: 'Rejected', label: 'Rejected' },
                    { value: 'Expired', label: 'Expired' }
                  ]}
                  value={editingScholarship.status}
                  onChange={(e) => setEditingScholarship({ ...editingScholarship, status: (typeof e === 'string' ? e : e.target.value) as any })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Sanctioned Amount (₹)"
                  type="number"
                  value={String(editingScholarship.sanctionedAmount)}
                  onChange={(e) => {
                    const newSanctioned = Number(e.target.value);
                    const newPending = Math.max(0, newSanctioned - editingScholarship.disbursedAmount);
                    setEditingScholarship({
                      ...editingScholarship,
                      sanctionedAmount: newSanctioned,
                      pendingAmount: newPending
                    });
                  }}
                />
                <Select
                  label="Disbursement Schedule"
                  options={[
                    { value: 'Quarterly', label: 'Quarterly' },
                    { value: 'Monthly', label: 'Monthly' },
                    { value: 'Annual', label: 'Annual' },
                    { value: 'One-time', label: 'One-time' }
                  ]}
                  value={editingScholarship.disbursementSchedule}
                  onChange={(e) => setEditingScholarship({ ...editingScholarship, disbursementSchedule: typeof e === 'string' ? e : e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Valid From"
                  type="date"
                  value={editingScholarship.validFrom}
                  onChange={(e) => setEditingScholarship({ ...editingScholarship, validFrom: e.target.value })}
                />
                <Input
                  label="Valid To"
                  type="date"
                  value={editingScholarship.validTo}
                  onChange={(e) => setEditingScholarship({ ...editingScholarship, validTo: e.target.value })}
                />
              </div>

              <div>
                <Input
                  label="Remarks"
                  value={editingScholarship.remarks || ''}
                  onChange={(e) => setEditingScholarship({ ...editingScholarship, remarks: e.target.value })}
                  placeholder="Notes, sanctions or criteria notes"
                />
              </div>
            </div>

            <div className="border-t pt-3 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveScholarshipEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Info Card */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">Scholarship Management Information:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>RTE students are admitted under Right to Education Act quota with 100% fee waiver</li>
              <li>EWS students receive fee concession based on Economic Weaker Section certificate</li>
              <li>BPL families are eligible for additional government scholarships</li>
              <li>Disbursements can be processed in bulk or individually</li>
              <li>All scholarship documents must be verified before approval</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>);

}