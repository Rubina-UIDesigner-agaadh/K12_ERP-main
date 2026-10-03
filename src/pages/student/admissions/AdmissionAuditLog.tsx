import React, { useState, useMemo } from 'react'
import {
  Search,
  Filter,
  Download,
  Eye,
  Shield,
  History,
  ArrowRight,
  FileText,
  UserCheck,
  XCircle,
  Edit3,
  RefreshCw,
  Calendar,
  User,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Mail,
  Phone,
  FileCheck,
  AlertTriangle,
  CheckCircle,
  Upload,
  Printer,
  Send,
  DollarSign,
  UserPlus,
  FileX,
  MessageSquare,
  Link,
  Trash2,
  RotateCcw,
  Settings,
  Lock,
  Unlock,
  Copy,
  ExternalLink,
} from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Table } from '../../../components/ui/Table'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Badge } from '../../../components/ui/Badge'
import { Modal } from '../../../components/ui/Modal'

// Types
interface AuditLogDetails {
  enquiryId?: string
  applicationId?: string
  admissionId?: string
  studentId?: string
  parentName?: string
  fatherName?: string
  motherName?: string
  contactNumber?: string
  email?: string
  applyingClass?: string
  section?: string
  stream?: string
  academicYear?: string
  status?: string
  previousStatus?: string
  approvedBy?: string
  rejectedBy?: string
  remarks?: string
  reason?: string
  notifiedParent?: boolean
  notificationMethod?: string
  field?: string
  oldValue?: string
  newValue?: string
  documentName?: string
  documentType?: string
  documentSize?: string
  uploadedBy?: string
  verifiedBy?: string
  verificationDate?: string
  feeAmount?: number
  feeType?: string
  paymentMode?: string
  transactionId?: string
  receiptNumber?: string
  rollNumber?: string
  grNumber?: string
  admissionDate?: string
  withdrawalReason?: string
  refundAmount?: number
  refundStatus?: string
  ipAddress?: string
  browser?: string
  device?: string
  sessionId?: string
  linkedRecords?: string[]
  attachments?: string[]
  previousSchool?: string
  transferCertificateNo?: string
  dateOfBirth?: string
  gender?: string
  bloodGroup?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  scheduledDate?: string
  scheduledTime?: string
  interviewerName?: string
  interviewScore?: number
  interviewRemarks?: string
  waitlistPosition?: number
  priorityLevel?: string
  scholarshipApplied?: boolean
  scholarshipType?: string
  scholarshipAmount?: number
  rteApplicant?: boolean
  ewsCategory?: boolean
  siblingInfo?: string
  transportRequired?: boolean
  hostelRequired?: boolean
  templateName?: string
  recipientCount?: number
  deliveryStatus?: string
  mergeFields?: Record<string, string>
}

interface AuditLog {
  id: string
  timestamp: string
  date: string
  time: string
  userId: string
  userName: string
  userRole: string
  userEmail: string
  studentName: string
  referenceId: string
  actionType: string
  actionCategory: string
  sourceModule: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'success' | 'failed' | 'pending' | 'warning'
  details: AuditLogDetails
  ipAddress: string
  browser: string
  device: string
}

// Action Types Configuration
const ACTION_TYPES = {
  // Enquiry Actions
  'Enquiry Creation': { icon: UserPlus, color: 'blue', category: 'Enquiry' },
  'Enquiry Conversion': { icon: ArrowRight, color: 'blue', category: 'Enquiry' },
  'Enquiry Follow-up': { icon: Phone, color: 'blue', category: 'Enquiry' },
  'Enquiry Status Change': { icon: RefreshCw, color: 'blue', category: 'Enquiry' },
  'Enquiry Deletion': { icon: Trash2, color: 'red', category: 'Enquiry' },
  
  // Application Actions
  'Application Creation': { icon: FileText, color: 'indigo', category: 'Application' },
  'Application Submission': { icon: Send, color: 'indigo', category: 'Application' },
  'Application Update': { icon: Edit3, color: 'orange', category: 'Application' },
  'Application Verification': { icon: FileCheck, color: 'green', category: 'Application' },
  'Application Withdrawal': { icon: FileX, color: 'red', category: 'Application' },
  
  // Admission Actions
  'Admission Approval': { icon: UserCheck, color: 'green', category: 'Admission' },
  'Admission Rejection': { icon: XCircle, color: 'red', category: 'Admission' },
  'Admission Confirmation': { icon: CheckCircle, color: 'green', category: 'Admission' },
  'Admission Cancellation': { icon: XCircle, color: 'red', category: 'Admission' },
  'Admission Deferral': { icon: Clock, color: 'yellow', category: 'Admission' },
  'Waitlist Addition': { icon: Clock, color: 'yellow', category: 'Admission' },
  'Waitlist Promotion': { icon: ArrowRight, color: 'green', category: 'Admission' },
  
  // Document Actions
  'Document Upload': { icon: Upload, color: 'purple', category: 'Document' },
  'Document Verification': { icon: FileCheck, color: 'green', category: 'Document' },
  'Document Rejection': { icon: FileX, color: 'red', category: 'Document' },
  'Document Re-upload': { icon: RefreshCw, color: 'orange', category: 'Document' },
  'Document Deletion': { icon: Trash2, color: 'red', category: 'Document' },
  
  // Fee Actions
  'Fee Payment': { icon: DollarSign, color: 'green', category: 'Fee' },
  'Fee Waiver Applied': { icon: DollarSign, color: 'blue', category: 'Fee' },
  'Fee Refund Initiated': { icon: RotateCcw, color: 'orange', category: 'Fee' },
  'Fee Refund Completed': { icon: CheckCircle, color: 'green', category: 'Fee' },
  'Fee Structure Update': { icon: Edit3, color: 'orange', category: 'Fee' },
  
  // Communication Actions
  'Email Sent': { icon: Mail, color: 'blue', category: 'Communication' },
  'SMS Sent': { icon: MessageSquare, color: 'blue', category: 'Communication' },
  'Notification Sent': { icon: Send, color: 'blue', category: 'Communication' },
  'Bulk Communication': { icon: Send, color: 'purple', category: 'Communication' },
  
  // Interview Actions
  'Interview Scheduled': { icon: Calendar, color: 'blue', category: 'Interview' },
  'Interview Completed': { icon: CheckCircle, color: 'green', category: 'Interview' },
  'Interview Rescheduled': { icon: RefreshCw, color: 'orange', category: 'Interview' },
  'Interview Cancelled': { icon: XCircle, color: 'red', category: 'Interview' },
  'Interview Score Updated': { icon: Edit3, color: 'orange', category: 'Interview' },
  
  // Data Actions
  'Data Modification': { icon: Edit3, color: 'orange', category: 'Data' },
  'Data Import': { icon: Upload, color: 'blue', category: 'Data' },
  'Data Export': { icon: Download, color: 'blue', category: 'Data' },
  'Bulk Update': { icon: RefreshCw, color: 'orange', category: 'Data' },
  
  // System Actions
  'Print Generated': { icon: Printer, color: 'gray', category: 'System' },
  'Report Generated': { icon: FileText, color: 'gray', category: 'System' },
  'Record Locked': { icon: Lock, color: 'red', category: 'System' },
  'Record Unlocked': { icon: Unlock, color: 'green', category: 'System' },
  'Session Activity': { icon: Settings, color: 'gray', category: 'System' },
}

// Mock Data - Extended
const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'AAL-001',
    timestamp: '2024-03-18 10:30:45 AM',
    date: '2024-03-18',
    time: '10:30:45 AM',
    userId: 'U-101',
    userName: 'Admin User',
    userRole: 'System Administrator',
    userEmail: 'admin@school.edu',
    studentName: 'Ananya Roy',
    referenceId: 'APP-2024-001',
    actionType: 'Enquiry Conversion',
    actionCategory: 'Enquiry',
    sourceModule: 'Enquiry Management',
    description: 'Converted enquiry INQ-2024-005 to admission application APP-2024-001',
    severity: 'medium',
    status: 'success',
    details: {
      enquiryId: 'INQ-2024-005',
      applicationId: 'APP-2024-001',
      parentName: 'Bimal Roy',
      fatherName: 'Bimal Roy',
      motherName: 'Sunita Roy',
      contactNumber: '9876543214',
      email: 'bimal.roy@email.com',
      applyingClass: 'Class 9',
      section: 'A',
      academicYear: '2024-2025',
      previousSchool: 'Delhi Public School',
      dateOfBirth: '2010-05-15',
      gender: 'Female',
      address: '123, Park Street',
      city: 'Kolkata',
      state: 'West Bengal',
      pincode: '700001',
    },
    ipAddress: '192.168.1.105',
    browser: 'Chrome 122.0',
    device: 'Windows PC',
  },
  {
    id: 'AAL-002',
    timestamp: '2024-03-18 11:15:22 AM',
    date: '2024-03-18',
    time: '11:15:22 AM',
    userId: 'U-105',
    userName: 'Priya Sharma',
    userRole: 'Admission Officer',
    userEmail: 'priya.sharma@school.edu',
    studentName: 'Kabir Singh',
    referenceId: 'ADM-2024-089',
    actionType: 'Application Creation',
    actionCategory: 'Application',
    sourceModule: 'Admission Management',
    description: 'Created admission form ADM-2024-089 from application APP-2024-004',
    severity: 'medium',
    status: 'success',
    details: {
      applicationId: 'APP-2024-004',
      admissionId: 'ADM-2024-089',
      parentName: 'Rajesh Singh',
      fatherName: 'Rajesh Singh',
      motherName: 'Kavita Singh',
      contactNumber: '9876543230',
      email: 'rajesh.singh@email.com',
      applyingClass: 'Class 1',
      section: 'B',
      academicYear: '2024-2025',
      dateOfBirth: '2018-08-20',
      gender: 'Male',
      bloodGroup: 'B+',
      transportRequired: true,
      siblingInfo: 'Sister: Priya Singh (Class 4-A)',
    },
    ipAddress: '192.168.1.110',
    browser: 'Firefox 123.0',
    device: 'MacBook Pro',
  },
  {
    id: 'AAL-003',
    timestamp: '2024-03-18 02:45:10 PM',
    date: '2024-03-18',
    time: '02:45:10 PM',
    userId: 'U-105',
    userName: 'Priya Sharma',
    userRole: 'Admission Officer',
    userEmail: 'priya.sharma@school.edu',
    studentName: 'Kabir Singh',
    referenceId: 'DOC-2024-0456',
    actionType: 'Document Upload',
    actionCategory: 'Document',
    sourceModule: 'Document Management',
    description: 'Uploaded Birth Certificate for student Kabir Singh',
    severity: 'low',
    status: 'success',
    details: {
      applicationId: 'APP-2024-004',
      documentName: 'Birth_Certificate_Kabir_Singh.pdf',
      documentType: 'Birth Certificate',
      documentSize: '2.4 MB',
      uploadedBy: 'Priya Sharma',
    },
    ipAddress: '192.168.1.110',
    browser: 'Firefox 123.0',
    device: 'MacBook Pro',
  },
  {
    id: 'AAL-004',
    timestamp: '2024-03-18 03:30:55 PM',
    date: '2024-03-18',
    time: '03:30:55 PM',
    userId: 'U-108',
    userName: 'Document Verifier',
    userRole: 'Verification Staff',
    userEmail: 'verifier@school.edu',
    studentName: 'Kabir Singh',
    referenceId: 'DOC-2024-0456',
    actionType: 'Document Verification',
    actionCategory: 'Document',
    sourceModule: 'Document Management',
    description: 'Verified Birth Certificate for student Kabir Singh',
    severity: 'medium',
    status: 'success',
    details: {
      applicationId: 'APP-2024-004',
      documentName: 'Birth_Certificate_Kabir_Singh.pdf',
      documentType: 'Birth Certificate',
      verifiedBy: 'Document Verifier',
      verificationDate: '2024-03-18',
      remarks: 'Document is authentic and matches provided information',
    },
    ipAddress: '192.168.1.115',
    browser: 'Chrome 122.0',
    device: 'Windows PC',
  },
  {
    id: 'AAL-005',
    timestamp: '2024-03-19 09:45:33 AM',
    date: '2024-03-19',
    time: '09:45:33 AM',
    userId: 'U-102',
    userName: 'Principal Desk',
    userRole: 'Principal',
    userEmail: 'principal@school.edu',
    studentName: 'Kabir Singh',
    referenceId: 'ADM-2024-089',
    actionType: 'Admission Approval',
    actionCategory: 'Admission',
    sourceModule: 'Admission Management',
    description: 'Approved admission form ADM-2024-089 and confirmed admission',
    severity: 'high',
    status: 'success',
    details: {
      admissionId: 'ADM-2024-089',
      studentId: 'STU-2024-00089',
      grNumber: 'GR-2024-0089',
      rollNumber: '15',
      section: 'B',
      status: 'Confirmed',
      previousStatus: 'Pending Approval',
      approvedBy: 'Principal Desk',
      admissionDate: '2024-03-19',
      remarks: 'All documents verified. Student meets admission criteria.',
      notifiedParent: true,
      notificationMethod: 'Email & SMS',
    },
    ipAddress: '192.168.1.100',
    browser: 'Safari 17.0',
    device: 'iPad Pro',
  },
  {
    id: 'AAL-006',
    timestamp: '2024-03-19 10:15:20 AM',
    date: '2024-03-19',
    time: '10:15:20 AM',
    userId: 'U-106',
    userName: 'Accounts Officer',
    userRole: 'Finance Staff',
    userEmail: 'accounts@school.edu',
    studentName: 'Kabir Singh',
    referenceId: 'FEE-2024-00234',
    actionType: 'Fee Payment',
    actionCategory: 'Fee',
    sourceModule: 'Fee Management',
    description: 'Received admission fee payment for student Kabir Singh',
    severity: 'high',
    status: 'success',
    details: {
      studentId: 'STU-2024-00089',
      feeAmount: 75000,
      feeType: 'Admission Fee',
      paymentMode: 'Online (NEFT)',
      transactionId: 'TXN-2024-03-19-78945',
      receiptNumber: 'RCP-2024-00234',
      remarks: 'First installment of annual fees',
    },
    ipAddress: '192.168.1.120',
    browser: 'Chrome 122.0',
    device: 'Windows PC',
  },
  {
    id: 'AAL-007',
    timestamp: '2024-03-19 02:20:18 PM',
    date: '2024-03-19',
    time: '02:20:18 PM',
    userId: 'U-101',
    userName: 'Admin User',
    userRole: 'System Administrator',
    userEmail: 'admin@school.edu',
    studentName: 'Neha Gupta',
    referenceId: 'APP-2024-005',
    actionType: 'Admission Rejection',
    actionCategory: 'Admission',
    sourceModule: 'Admission Management',
    description: 'Rejected admission application APP-2024-005 due to class capacity',
    severity: 'high',
    status: 'success',
    details: {
      applicationId: 'APP-2024-005',
      applyingClass: 'Class 3',
      section: 'A',
      status: 'Rejected',
      previousStatus: 'Under Review',
      rejectedBy: 'Admin User',
      reason: 'Class 3-A has reached maximum capacity of 40 students',
      notifiedParent: true,
      notificationMethod: 'Email',
      remarks: 'Suggested to apply for Class 3-B or next academic year',
      waitlistPosition: 5,
    },
    ipAddress: '192.168.1.105',
    browser: 'Chrome 122.0',
    device: 'Windows PC',
  },
  {
    id: 'AAL-008',
    timestamp: '2024-03-19 03:45:42 PM',
    date: '2024-03-19',
    time: '03:45:42 PM',
    userId: 'U-105',
    userName: 'Priya Sharma',
    userRole: 'Admission Officer',
    userEmail: 'priya.sharma@school.edu',
    studentName: 'Neha Gupta',
    referenceId: 'APP-2024-005',
    actionType: 'Waitlist Addition',
    actionCategory: 'Admission',
    sourceModule: 'Admission Management',
    description: 'Added applicant Neha Gupta to waitlist for Class 3-A',
    severity: 'medium',
    status: 'success',
    details: {
      applicationId: 'APP-2024-005',
      applyingClass: 'Class 3',
      section: 'A',
      waitlistPosition: 5,
      priorityLevel: 'Normal',
      notifiedParent: true,
      remarks: 'Will be notified if seat becomes available',
    },
    ipAddress: '192.168.1.110',
    browser: 'Firefox 123.0',
    device: 'MacBook Pro',
  },
  {
    id: 'AAL-009',
    timestamp: '2024-03-20 10:05:15 AM',
    date: '2024-03-20',
    time: '10:05:15 AM',
    userId: 'U-103',
    userName: 'Admission Clerk',
    userRole: 'Data Entry Operator',
    userEmail: 'clerk@school.edu',
    studentName: 'Rohan Sharma',
    referenceId: 'APP-2024-002',
    actionType: 'Data Modification',
    actionCategory: 'Data',
    sourceModule: 'Admission Management',
    description: 'Updated previous school details in application APP-2024-002',
    severity: 'medium',
    status: 'success',
    details: {
      applicationId: 'APP-2024-002',
      field: 'Previous School',
      oldValue: 'Unknown',
      newValue: "St. Xavier's High School, Mumbai",
      remarks: 'Updated based on Transfer Certificate received',
      linkedRecords: ['DOC-2024-0234', 'TC-2024-0045'],
    },
    ipAddress: '192.168.1.108',
    browser: 'Edge 122.0',
    device: 'Windows PC',
  },
  {
    id: 'AAL-010',
    timestamp: '2024-03-20 11:30:28 AM',
    date: '2024-03-20',
    time: '11:30:28 AM',
    userId: 'U-105',
    userName: 'Priya Sharma',
    userRole: 'Admission Officer',
    userEmail: 'priya.sharma@school.edu',
    studentName: 'Amit Kumar',
    referenceId: 'INT-2024-0078',
    actionType: 'Interview Scheduled',
    actionCategory: 'Interview',
    sourceModule: 'Interview Management',
    description: 'Scheduled admission interview for student Amit Kumar',
    severity: 'low',
    status: 'success',
    details: {
      applicationId: 'APP-2024-008',
      applyingClass: 'Class 6',
      scheduledDate: '2024-03-25',
      scheduledTime: '10:30 AM',
      interviewerName: 'Mrs. Sunita Verma (Class Coordinator)',
      notifiedParent: true,
      notificationMethod: 'Email & SMS',
      remarks: 'Parent to accompany the student',
    },
    ipAddress: '192.168.1.110',
    browser: 'Firefox 123.0',
    device: 'MacBook Pro',
  },
  {
    id: 'AAL-011',
    timestamp: '2024-03-20 02:15:45 PM',
    date: '2024-03-20',
    time: '02:15:45 PM',
    userId: 'U-107',
    userName: 'Communication Admin',
    userRole: 'Communication Manager',
    userEmail: 'comm.admin@school.edu',
    studentName: 'Multiple Students',
    referenceId: 'COMM-2024-0156',
    actionType: 'Bulk Communication',
    actionCategory: 'Communication',
    sourceModule: 'Communication Management',
    description: 'Sent admission confirmation emails to 25 newly admitted students',
    severity: 'medium',
    status: 'success',
    details: {
      templateName: 'Admission Confirmation - 2024',
      recipientCount: 25,
      deliveryStatus: 'Delivered: 24, Failed: 1',
      remarks: 'One email bounced - invalid email address for STU-2024-00067',
    },
    ipAddress: '192.168.1.125',
    browser: 'Chrome 122.0',
    device: 'Windows PC',
  },
  {
    id: 'AAL-012',
    timestamp: '2024-03-20 04:30:12 PM',
    date: '2024-03-20',
    time: '04:30:12 PM',
    userId: 'U-105',
    userName: 'Priya Sharma',
    userRole: 'Admission Officer',
    userEmail: 'priya.sharma@school.edu',
    studentName: 'Sanya Mehta',
    referenceId: 'APP-2024-012',
    actionType: 'Application Submission',
    actionCategory: 'Application',
    sourceModule: 'Admission Management',
    description: 'Submitted complete application for student Sanya Mehta',
    severity: 'medium',
    status: 'success',
    details: {
      applicationId: 'APP-2024-012',
      applyingClass: 'Class 4',
      section: 'Pending',
      academicYear: '2024-2025',
      fatherName: 'Vikram Mehta',
      motherName: 'Pooja Mehta',
      contactNumber: '9876543250',
      email: 'vikram.mehta@email.com',
      rteApplicant: true,
      ewsCategory: true,
      scholarshipApplied: true,
      scholarshipType: 'RTE Quota',
      remarks: 'Application complete with all required documents',
    },
    ipAddress: '192.168.1.110',
    browser: 'Firefox 123.0',
    device: 'MacBook Pro',
  },
  {
    id: 'AAL-013',
    timestamp: '2024-03-21 09:00:05 AM',
    date: '2024-03-21',
    time: '09:00:05 AM',
    userId: 'U-103',
    userName: 'Admission Clerk',
    userRole: 'Data Entry Operator',
    userEmail: 'clerk@school.edu',
    studentName: 'Arjun Patel',
    referenceId: 'ENQ-2024-089',
    actionType: 'Enquiry Creation',
    actionCategory: 'Enquiry',
    sourceModule: 'Enquiry Management',
    description: 'Created new admission enquiry for Arjun Patel',
    severity: 'low',
    status: 'success',
    details: {
      enquiryId: 'ENQ-2024-089',
      parentName: 'Suresh Patel',
      contactNumber: '9876543278',
      email: 'suresh.patel@email.com',
      applyingClass: 'Class 2',
      previousSchool: 'Ryan International School',
      remarks: 'Parent enquired about admission process and fee structure',
    },
    ipAddress: '192.168.1.108',
    browser: 'Edge 122.0',
    device: 'Windows PC',
  },
  {
    id: 'AAL-014',
    timestamp: '2024-03-21 10:45:30 AM',
    date: '2024-03-21',
    time: '10:45:30 AM',
    userId: 'U-108',
    userName: 'Document Verifier',
    userRole: 'Verification Staff',
    userEmail: 'verifier@school.edu',
    studentName: 'Sanya Mehta',
    referenceId: 'DOC-2024-0512',
    actionType: 'Document Rejection',
    actionCategory: 'Document',
    sourceModule: 'Document Management',
    description: 'Rejected Address Proof document for student Sanya Mehta',
    severity: 'medium',
    status: 'warning',
    details: {
      applicationId: 'APP-2024-012',
      documentName: 'Address_Proof_Sanya_Mehta.pdf',
      documentType: 'Address Proof',
      verifiedBy: 'Document Verifier',
      verificationDate: '2024-03-21',
      reason: 'Document is more than 6 months old. Please provide recent utility bill or bank statement.',
      notifiedParent: true,
      notificationMethod: 'Email',
    },
    ipAddress: '192.168.1.115',
    browser: 'Chrome 122.0',
    device: 'Windows PC',
  },
  {
    id: 'AAL-015',
    timestamp: '2024-03-21 02:30:18 PM',
    date: '2024-03-21',
    time: '02:30:18 PM',
    userId: 'U-106',
    userName: 'Accounts Officer',
    userRole: 'Finance Staff',
    userEmail: 'accounts@school.edu',
    studentName: 'Rahul Verma',
    referenceId: 'FEE-2024-00256',
    actionType: 'Fee Waiver Applied',
    actionCategory: 'Fee',
    sourceModule: 'Fee Management',
    description: 'Applied 50% fee waiver for student Rahul Verma under scholarship quota',
    severity: 'high',
    status: 'success',
    details: {
      studentId: 'STU-2024-00092',
      applicationId: 'APP-2024-015',
      feeAmount: 75000,
      scholarshipType: 'Merit Scholarship',
      scholarshipAmount: 37500,
      approvedBy: 'Principal Desk',
      remarks: 'Student scored 95% in entrance test - eligible for 50% merit scholarship',
    },
    ipAddress: '192.168.1.120',
    browser: 'Chrome 122.0',
    device: 'Windows PC',
  },
  {
    id: 'AAL-016',
    timestamp: '2024-03-21 04:15:42 PM',
    date: '2024-03-21',
    time: '04:15:42 PM',
    userId: 'U-102',
    userName: 'Principal Desk',
    userRole: 'Principal',
    userEmail: 'principal@school.edu',
    studentName: 'Vikram Reddy',
    referenceId: 'APP-2024-018',
    actionType: 'Admission Deferral',
    actionCategory: 'Admission',
    sourceModule: 'Admission Management',
    description: 'Deferred admission for student Vikram Reddy to next academic session',
    severity: 'medium',
    status: 'success',
    details: {
      applicationId: 'APP-2024-018',
      applyingClass: 'Class 8',
      status: 'Deferred',
      previousStatus: 'Approved',
      reason: 'Parent requested deferral due to family relocation plans',
      academicYear: '2025-2026',
      notifiedParent: true,
      remarks: 'Admission fee will be adjusted for next session. No refund required.',
    },
    ipAddress: '192.168.1.100',
    browser: 'Safari 17.0',
    device: 'iPad Pro',
  },
  {
    id: 'AAL-017',
    timestamp: '2024-03-22 09:30:00 AM',
    date: '2024-03-22',
    time: '09:30:00 AM',
    userId: 'U-101',
    userName: 'Admin User',
    userRole: 'System Administrator',
    userEmail: 'admin@school.edu',
    studentName: 'System',
    referenceId: 'RPT-2024-0034',
    actionType: 'Report Generated',
    actionCategory: 'System',
    sourceModule: 'Reports',
    description: 'Generated daily admission summary report for March 21, 2024',
    severity: 'low',
    status: 'success',
    details: {
      templateName: 'Daily Admission Summary',
      remarks: 'Report includes 15 new applications, 8 approvals, 2 rejections',
    },
    ipAddress: '192.168.1.105',
    browser: 'Chrome 122.0',
    device: 'Windows PC',
  },
  {
    id: 'AAL-018',
    timestamp: '2024-03-22 11:00:25 AM',
    date: '2024-03-22',
    time: '11:00:25 AM',
    userId: 'U-109',
    userName: 'Mrs. Sunita Verma',
    userRole: 'Class Coordinator',
    userEmail: 'sunita.verma@school.edu',
    studentName: 'Amit Kumar',
    referenceId: 'INT-2024-0078',
    actionType: 'Interview Completed',
    actionCategory: 'Interview',
    sourceModule: 'Interview Management',
    description: 'Completed admission interview for student Amit Kumar',
    severity: 'medium',
    status: 'success',
    details: {
      applicationId: 'APP-2024-008',
      applyingClass: 'Class 6',
      interviewerName: 'Mrs. Sunita Verma',
      interviewScore: 85,
      interviewRemarks: 'Student shows good communication skills and academic aptitude. Recommended for admission.',
      status: 'Passed',
    },
    ipAddress: '192.168.1.130',
    browser: 'Chrome 122.0',
    device: 'Windows PC',
  },
  {
    id: 'AAL-019',
    timestamp: '2024-03-22 03:45:10 PM',
    date: '2024-03-22',
    time: '03:45:10 PM',
    userId: 'U-105',
    userName: 'Priya Sharma',
    userRole: 'Admission Officer',
    userEmail: 'priya.sharma@school.edu',
    studentName: 'Shreya Das',
    referenceId: 'APP-2024-020',
    actionType: 'Application Withdrawal',
    actionCategory: 'Application',
    sourceModule: 'Admission Management',
    description: 'Withdrawn application APP-2024-020 as per parent request',
    severity: 'medium',
    status: 'success',
    details: {
      applicationId: 'APP-2024-020',
      applyingClass: 'Class 5',
      status: 'Withdrawn',
      previousStatus: 'Under Review',
      withdrawalReason: 'Family relocating to another city',
      refundAmount: 5000,
      refundStatus: 'Initiated',
      notifiedParent: true,
      remarks: 'Registration fee refund initiated. Will be processed within 7 working days.',
    },
    ipAddress: '192.168.1.110',
    browser: 'Firefox 123.0',
    device: 'MacBook Pro',
  },
  {
    id: 'AAL-020',
    timestamp: '2024-03-22 05:00:00 PM',
    date: '2024-03-22',
    time: '05:00:00 PM',
    userId: 'U-101',
    userName: 'Admin User',
    userRole: 'System Administrator',
    userEmail: 'admin@school.edu',
    studentName: 'Neha Gupta',
    referenceId: 'APP-2024-005',
    actionType: 'Waitlist Promotion',
    actionCategory: 'Admission',
    sourceModule: 'Admission Management',
    description: 'Promoted Neha Gupta from waitlist to confirmed admission for Class 3-A',
    severity: 'high',
    status: 'success',
    details: {
      applicationId: 'APP-2024-005',
      applyingClass: 'Class 3',
      section: 'A',
      status: 'Confirmed',
      previousStatus: 'Waitlisted',
      waitlistPosition: 5,
      grNumber: 'GR-2024-0098',
      rollNumber: '41',
      admissionDate: '2024-03-22',
      remarks: 'Seat available due to withdrawal. Parent confirmed acceptance.',
      notifiedParent: true,
      notificationMethod: 'Phone Call & Email',
    },
    ipAddress: '192.168.1.105',
    browser: 'Chrome 122.0',
    device: 'Windows PC',
  },
]

// Utility functions
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function AdmissionAuditLog() {
  const [logs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS)
  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [severityFilter, setSeverityFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [userFilter, setUserFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Get unique values for filters
  const uniqueUsers = useMemo(() => {
    const users = [...new Set(logs.map((log) => log.userName))]
    return users.sort()
  }, [logs])

  const uniqueCategories = useMemo(() => {
    const categories = [...new Set(logs.map((log) => log.actionCategory))]
    return categories.sort()
  }, [logs])

  const actionTypeOptions = useMemo(() => {
    return Object.keys(ACTION_TYPES).map((type) => ({
      value: type,
      label: type,
    }))
  }, [])

  // Filtering
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.referenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.id.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesAction = actionFilter ? log.actionType === actionFilter : true
      const matchesCategory = categoryFilter ? log.actionCategory === categoryFilter : true
      const matchesSeverity = severityFilter ? log.severity === severityFilter : true
      const matchesStatus = statusFilter ? log.status === statusFilter : true
      const matchesUser = userFilter ? log.userName === userFilter : true

      let matchesDate = true
      if (dateFrom) {
        matchesDate = log.date >= dateFrom
      }
      if (dateTo && matchesDate) {
        matchesDate = log.date <= dateTo
      }

      return (
        matchesSearch &&
        matchesAction &&
        matchesCategory &&
        matchesSeverity &&
        matchesStatus &&
        matchesUser &&
        matchesDate
      )
    })
  }, [
    logs,
    searchTerm,
    actionFilter,
    categoryFilter,
    severityFilter,
    statusFilter,
    userFilter,
    dateFrom,
    dateTo,
  ])

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredLogs.slice(start, start + itemsPerPage)
  }, [filteredLogs, currentPage, itemsPerPage])

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log)
    setIsDetailModalOpen(true)
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setActionFilter('')
    setCategoryFilter('')
    setSeverityFilter('')
    setStatusFilter('')
    setUserFilter('')
    setDateFrom('')
    setDateTo('')
    setCurrentPage(1)
  }

  const handleExport = () => {
    // Export functionality placeholder
    console.log('Exporting audit logs...')
  }

  const getActionIcon = (type: string) => {
    const config = ACTION_TYPES[type as keyof typeof ACTION_TYPES]
    if (config) {
      const IconComponent = config.icon
      const colorClass = {
        blue: 'text-blue-500',
        indigo: 'text-indigo-500',
        green: 'text-green-500',
        red: 'text-red-500',
        orange: 'text-orange-500',
        yellow: 'text-yellow-500',
        purple: 'text-purple-500',
        gray: 'text-gray-500',
      }[config.color]
      return <IconComponent className={`w-4 h-4 ${colorClass}`} />
    }
    return <History className="w-4 h-4 text-gray-500" />
  }

  const getActionBadge = (type: string) => {
    const config = ACTION_TYPES[type as keyof typeof ACTION_TYPES]
    if (config) {
      const variantMap: Record<string, 'info' | 'primary' | 'success' | 'danger' | 'warning' | 'default'> = {
        blue: 'info',
        indigo: 'primary',
        green: 'success',
        red: 'danger',
        orange: 'warning',
        yellow: 'warning',
        purple: 'primary',
        gray: 'default',
      }
      return <Badge variant={variantMap[config.color] || 'default'}>{type}</Badge>
    }
    return <Badge variant="default">{type}</Badge>
  }

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, 'success' | 'info' | 'warning' | 'danger'> = {
      low: 'success',
      medium: 'info',
      high: 'warning',
      critical: 'danger',
    }
    return (
      <Badge variant={variants[severity] || 'default'}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'danger' | 'warning' | 'info'> = {
      success: 'success',
      failed: 'danger',
      pending: 'warning',
      warning: 'warning',
    }
    const icons: Record<string, React.ReactNode> = {
      success: <CheckCircle className="w-3 h-3" />,
      failed: <XCircle className="w-3 h-3" />,
      pending: <Clock className="w-3 h-3" />,
      warning: <AlertTriangle className="w-3 h-3" />,
    }
    return (
      <Badge variant={variants[status] || 'default'}>
        <span className="flex items-center gap-1">
          {icons[status]}
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </Badge>
    )
  }

  const columns = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      render: (row: AuditLog) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">{row.date}</span>
          <span className="text-xs text-gray-500">{row.time}</span>
        </div>
      ),
    },
    {
      key: 'id',
      header: 'Event ID',
      render: (row: AuditLog) => (
        <span className="text-sm font-mono text-blue-600 hover:underline cursor-pointer">
          {row.id}
        </span>
      ),
    },
    {
      key: 'user',
      header: 'User',
      render: (row: AuditLog) => (
        <div>
          <p className="font-medium text-gray-900">{row.userName}</p>
          <p className="text-xs text-gray-500">{row.userRole}</p>
        </div>
      ),
    },
    {
      key: 'student',
      header: 'Student / Ref ID',
      render: (row: AuditLog) => (
        <div>
          <p className="font-medium text-gray-900">{row.studentName}</p>
          <p className="text-xs font-mono text-blue-600">{row.referenceId}</p>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      render: (row: AuditLog) => (
        <div className="flex items-center gap-2">
          {getActionIcon(row.actionType)}
          <div>
            <p className="text-sm font-medium text-gray-900">{row.actionType}</p>
            <p className="text-xs text-gray-500">{row.actionCategory}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: AuditLog) => (
        <div className="flex flex-col gap-1">
          {getStatusBadge(row.status)}
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (row: AuditLog) => (
        <span
          className="text-sm text-gray-700 truncate max-w-xs block"
          title={row.description}
        >
          {row.description}
        </span>
      ),
    },
    {
      key: 'view',
      header: '',
      render: (row: AuditLog) => (
        <Button variant="ghost" size="sm" onClick={() => handleViewDetails(row)}>
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ]

  // Render detail section based on action type
  const renderDetailSection = (log: AuditLog) => {
    const { actionType, details } = log

    switch (actionType) {
      case 'Enquiry Conversion':
      case 'Enquiry Creation':
        return (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col">
              <span className="text-gray-500">Enquiry ID</span>
              <span className="font-mono text-blue-600">{details.enquiryId}</span>
            </div>
            {details.applicationId && (
              <div className="flex flex-col">
                <span className="text-gray-500">Application ID</span>
                <span className="font-mono text-indigo-600">{details.applicationId}</span>
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-gray-500">Student Name</span>
              <span className="font-medium">{log.studentName}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500">Applying Class</span>
              <span className="font-medium">{details.applyingClass}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500">Father's Name</span>
              <span className="font-medium">{details.fatherName || details.parentName}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500">Mother's Name</span>
              <span className="font-medium">{details.motherName || '-'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500">Contact Number</span>
              <span className="font-medium">{details.contactNumber}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500">Email</span>
              <span className="font-medium">{details.email}</span>
            </div>
            {details.previousSchool && (
              <div className="flex flex-col col-span-2">
                <span className="text-gray-500">Previous School</span>
                <span className="font-medium">{details.previousSchool}</span>
              </div>
            )}
            {details.address && (
              <div className="flex flex-col col-span-2">
                <span className="text-gray-500">Address</span>
                <span className="font-medium">
                  {details.address}, {details.city}, {details.state} - {details.pincode}
                </span>
              </div>
            )}
          </div>
        )

      case 'Application Creation':
      case 'Application Submission':
        return (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col">
              <span className="text-gray-500">Application ID</span>
              <span className="font-mono text-indigo-600">{details.applicationId}</span>
            </div>
            {details.admissionId && (
              <div className="flex flex-col">
                <span className="text-gray-500">Admission ID</span>
                <span className="font-mono text-green-600">{details.admissionId}</span>
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-gray-500">Applying Class</span>
              <span className="font-medium">{details.applyingClass}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500">Section</span>
              <span className="font-medium">{details.section || 'Pending'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500">Academic Year</span>
              <span className="font-medium">{details.academicYear}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500">Father's Name</span>
              <span className="font-medium">{details.fatherName}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500">Contact Number</span>
              <span className="font-medium">{details.contactNumber}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500">Email</span>
              <span className="font-medium">{details.email}</span>
            </div>
            {details.rteApplicant && (
              <div className="flex flex-col">
                <span className="text-gray-500">RTE Applicant</span>
                <Badge variant="info">Yes</Badge>
              </div>
            )}
            {details.ewsCategory && (
              <div className="flex flex-col">
                <span className="text-gray-500">EWS Category</span>
                <Badge variant="warning">Yes</Badge>
              </div>
            )}
            {details.scholarshipApplied && (
              <div className="flex flex-col col-span-2">
                <span className="text-gray-500">Scholarship</span>
                <span className="font-medium">{details.scholarshipType}</span>
              </div>
            )}
            {details.transportRequired && (
              <div className="flex flex-col">
                <span className="text-gray-500">Transport Required</span>
                <Badge variant="info">Yes</Badge>
              </div>
            )}
            {details.siblingInfo && (
              <div className="flex flex-col">
                <span className="text-gray-500">Sibling Info</span>
                <span className="font-medium">{details.siblingInfo}</span>
              </div>
            )}
            {details.remarks && (
              <div className="flex flex-col col-span-2">
                <span className="text-gray-500">Remarks</span>
                <span className="font-medium">{details.remarks}</span>
              </div>
            )}
          </div>
        )

      case 'Admission Approval':
      case 'Admission Confirmation':
      case 'Waitlist Promotion':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col">
                <span className="text-gray-500">Admission ID</span>
                <span className="font-mono text-green-600">{details.admissionId || details.applicationId}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">Student ID</span>
                <span className="font-mono text-purple-600">{details.studentId}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">GR Number</span>
                <span className="font-mono font-medium">{details.grNumber}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">Roll Number</span>
                <span className="font-medium">{details.rollNumber}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">Section</span>
                <span className="font-medium">{details.section}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">Admission Date</span>
                <span className="font-medium">{details.admissionDate}</span>
              </div>
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-800">Status Change</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="warning">{details.previousStatus}</Badge>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <Badge variant="success">{details.status}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col">
                <span className="text-gray-500">Approved By</span>
                <span className="font-medium">{details.approvedBy}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">Parent Notified</span>
                <span className="font-medium">
                  {details.notifiedParent ? `Yes (${details.notificationMethod})` : 'No'}
                </span>
              </div>
              {details.waitlistPosition && (
                <div className="flex flex-col">
                  <span className="text-gray-500">Previous Waitlist Position</span>
                  <span className="font-medium">#{details.waitlistPosition}</span>
                </div>
              )}
            </div>
            {details.remarks && (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <span className="text-gray-500 text-sm">Remarks</span>
                <p className="font-medium text-gray-900 mt-1">{details.remarks}</p>
              </div>
            )}
          </div>
        )

      case 'Admission Rejection':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col">
                <span className="text-gray-500">Application ID</span>
                <span className="font-mono text-indigo-600">{details.applicationId}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">Applying Class</span>
                <span className="font-medium">{details.applyingClass} - {details.section}</span>
              </div>
            </div>
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <span className="font-medium text-red-800">Rejection Reason</span>
              </div>
              <p className="text-sm text-red-700">{details.reason}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col">
                <span className="text-gray-500">Rejected By</span>
                <span className="font-medium">{details.rejectedBy || log.userName}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">Parent Notified</span>
                <span className="font-medium">
                  {details.notifiedParent ? `Yes (${details.notificationMethod})` : 'No'}
                </span>
              </div>
              {details.waitlistPosition && (
                <div className="flex flex-col">
                  <span className="text-gray-500">Waitlist Position</span>
                  <span className="font-medium">#{details.waitlistPosition}</span>
                </div>
              )}
            </div>
            {details.remarks && (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <span className="text-gray-500 text-sm">Additional Remarks</span>
                <p className="font-medium text-gray-900 mt-1">{details.remarks}</p>
              </div>
            )}
          </div>
        )

      case 'Waitlist Addition':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col">
                <span className="text-gray-500">Application ID</span>
                <span className="font-mono text-indigo-600">{details.applicationId}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">Applying Class</span>
                <span className="font-medium">{details.applyingClass} - {details.section}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">Waitlist Position</span>
                <span className="font-medium text-lg">#{details.waitlistPosition}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">Priority Level</span>
                <Badge variant={details.priorityLevel === 'High' ? 'danger' : 'info'}>
                  {details.priorityLevel}
                </Badge>
              </div>
            </div>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-700">{details.remarks}</span>
              </div>
            </div>
          </div>
        )

      case 'Document Upload':
      case 'Document Verification':
      case 'Document Rejection':
      case 'Document Re-upload':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col">
                <span className="text-gray-500">Application ID</span>
                <span className="font-mono text-indigo-600">{details.applicationId}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">Document Type</span>
                <span className="font-medium">{details.documentType}</span>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white border border-gray-200 rounded-lg">
                  <FileText className="w-8 h-8 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{details.documentName}</p>
                  <p className="text-sm text-gray-500">{details.documentSize}</p>
                </div>
                {actionType === 'Document Verification' && (
                  <Badge variant="success">Verified</Badge>
                )}
                {actionType === 'Document Rejection' && (
                  <Badge variant="danger">Rejected</Badge>
                )}
              </div>
            </div>
            {(details.verifiedBy || details.uploadedBy) && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                {details.uploadedBy && (
                  <div className="flex flex-col">
                    <span className="text-gray-500">Uploaded By</span>
                    <span className="font-medium">{details.uploadedBy}</span>
                  </div>
                )}
                {details.verifiedBy && (
                  <div className="flex flex-col">
                    <span className="text-gray-500">Verified By</span>
                    <span className="font-medium">{details.verifiedBy}</span>
                  </div>
                )}
                {details.verificationDate && (
                  <div className="flex flex-col">
                    <span className="text-gray-500">Verification Date</span>
                    <span className="font-medium">{details.verificationDate}</span>
                  </div>
                )}
              </div>
            )}
            {details.reason && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <span className="text-gray-500 text-sm">Rejection Reason</span>
                <p className="font-medium text-red-700 mt-1">{details.reason}</p>
              </div>
            )}
            {details.remarks && !details.reason && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <span className="text-gray-500 text-sm">Verification Remarks</span>
                <p className="font-medium text-green-700 mt-1">{details.remarks}</p>
              </div>
            )}
          </div>
        )

      case 'Fee Payment':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Amount Received</p>
                  <p className="text-2xl font-bold text-green-800">
                    {formatCurrency(details.feeAmount || 0)}
                  </p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col">
                <span className="text-gray-500">Student ID</span>
                <span className="font-mono text-purple-600">{details.studentId}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">Fee Type</span>
                <span className="font-medium">{details.feeType}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">Payment Mode</span>
                <span className="font-medium">{details.paymentMode}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">Transaction ID</span>
                <span className="font-mono text-blue-600">{details.transactionId}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">Receipt Number</span>
                <span className="font-mono font-medium">{details.receiptNumber}</span>
              </div>
            </div>
            {details.remarks && (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <span className="text-gray-500 text-sm">Remarks</span>
                <p className="font-medium text-gray-900 mt-1">{details.remarks}</p>
              </div>
            )}
          </div>
        )

      case 'Fee Waiver Applied':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Scholarship Amount</p>
                  <p className="text-2xl font-bold text-blue-800">
                    {formatCurrency(details.scholarshipAmount || 0)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Original Fee</p>
                  <p className="text-lg font-medium text-gray-700">
                    {formatCurrency(details.feeAmount || 0)}
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col">
                <span className="text-gray-500">Student ID</span>
                <span className="font-mono text-purple-600">{details.studentId}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">Application ID</span>
                <span className="font-mono text-indigo-600">{details.applicationId}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">Scholarship Type</span>
                <Badge variant="info">{details.scholarshipType}</Badge>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">Approved By</span>
                <span className="font-medium">{details.approvedBy}</span>
              </div>
            </div>
            {details.remarks && (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <span className="text-gray-500 text-sm">Remarks</span>
                <p className="font-medium text-gray-900 mt-1">{details.remarks}</p>
              </div>
            )}
          </div>
        )

      case 'Interview Scheduled':
      case 'Interview Completed':
      case 'Interview Rescheduled':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col">
                <span className="text-gray-500">Application ID</span>
                <span className="font-mono text-indigo-600">{details.applicationId}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">Applying Class</span>
                <span className="font-medium">{details.applyingClass}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">Scheduled Date</span>
                <span className="font-medium">{details.scheduledDate}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">Scheduled Time</span>
                <span className="font-medium">{details.scheduledTime}</span>
              </div>
              <div className="flex flex-col col-span-2">
                <span className="text-gray-500">Interviewer</span>
                <span className="font-medium">{details.interviewerName}</span>
              </div>
            </div>
            {actionType === 'Interview Completed' && details.interviewScore !== undefined && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-green-800">Interview Score</span>
                  <span className="text-2xl font-bold text-green-800">{details.interviewScore}/100</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${details.interviewScore}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-green-700">{details.interviewRemarks}</p>
              </div>
            )}
            {details.notifiedParent && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Parent notified via {details.notificationMethod}</span>
              </div>
            )}
            {details.remarks && (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <span className="text-gray-500 text-sm">Remarks</span>
                <p className="font-medium text-gray-900 mt-1">{details.remarks}</p>
              </div>
            )}
          </div>
        )

      case 'Data Modification':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col">
                <span className="text-gray-500">Application ID</span>
                <span className="font-mono text-indigo-600">{details.applicationId}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">Modified Field</span>
                <span className="font-medium">{details.field}</span>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Field
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Old Value
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      New Value
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {details.field}
                    </td>
                    <td className="px-4 py-3 text-sm text-red-600 bg-red-50">
                      {details.oldValue}
                    </td>
                    <td className="px-4 py-3 text-sm text-green-600 bg-green-50">
                      {details.newValue}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {details.linkedRecords && details.linkedRecords.length > 0 && (
              <div className="flex flex-col text-sm">
                <span className="text-gray-500 mb-1">Linked Records</span>
                <div className="flex flex-wrap gap-2">
                  {details.linkedRecords.map((record, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded font-mono text-xs"
                    >
                      {record}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {details.remarks && (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <span className="text-gray-500 text-sm">Remarks</span>
                <p className="font-medium text-gray-900 mt-1">{details.remarks}</p>
              </div>
            )}
          </div>
        )

      case 'Application Withdrawal':
      case 'Admission Cancellation':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col">
                <span className="text-gray-500">Application ID</span>
                <span className="font-mono text-indigo-600">{details.applicationId}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">Applying Class</span>
                <span className="font-medium">{details.applyingClass}</span>
              </div>
            </div>
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <span className="font-medium text-red-800">Withdrawal Reason</span>
              </div>
              <p className="text-sm text-red-700">{details.withdrawalReason}</p>
            </div>
            {details.refundAmount !== undefined && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-600">Refund Amount</p>
                    <p className="text-xl font-bold text-orange-800">
                      {formatCurrency(details.refundAmount)}
                    </p>
                  </div>
                  <Badge variant={details.refundStatus === 'Completed' ? 'success' : 'warning'}>
                    {details.refundStatus}
                  </Badge>
                </div>
              </div>
            )}
            {details.remarks && (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <span className="text-gray-500 text-sm">Remarks</span>
                <p className="font-medium text-gray-900 mt-1">{details.remarks}</p>
              </div>
            )}
          </div>
        )

      case 'Admission Deferral':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col">
                <span className="text-gray-500">Application ID</span>
                <span className="font-mono text-indigo-600">{details.applicationId}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">Applying Class</span>
                <span className="font-medium">{details.applyingClass}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">Deferred To</span>
                <span className="font-medium">{details.academicYear}</span>
              </div>
            </div>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                <span className="font-medium text-yellow-800">Deferral Reason</span>
              </div>
              <p className="text-sm text-yellow-700">{details.reason}</p>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ArrowRight className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-800">Status Change</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="success">{details.previousStatus}</Badge>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <Badge variant="warning">{details.status}</Badge>
              </div>
            </div>
            {details.remarks && (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <span className="text-gray-500 text-sm">Remarks</span>
                <p className="font-medium text-gray-900 mt-1">{details.remarks}</p>
              </div>
            )}
          </div>
        )

      case 'Bulk Communication':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col">
                <span className="text-gray-500">Template Used</span>
                <span className="font-medium">{details.templateName}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">Recipients</span>
                <span className="font-medium">{details.recipientCount} students</span>
              </div>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Send className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-800">Delivery Status</span>
              </div>
              <p className="text-sm text-blue-700">{details.deliveryStatus}</p>
            </div>
            {details.remarks && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <span className="text-gray-500 text-sm">Notes</span>
                <p className="font-medium text-yellow-700 mt-1">{details.remarks}</p>
              </div>
            )}
          </div>
        )

      case 'Report Generated':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="p-3 bg-white border border-gray-200 rounded-lg">
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{details.templateName}</p>
                <p className="text-sm text-gray-500">{details.remarks}</p>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="grid grid-cols-2 gap-y-3 text-sm bg-gray-50 p-4 rounded-lg border border-gray-100">
            {Object.entries(details).map(([key, value]) => {
              if (value === undefined || value === null) return null
              return (
                <div key={key} className="flex flex-col">
                  <span className="text-gray-500 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="font-medium">
                    {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                  </span>
                </div>
              )
            })}
          </div>
        )
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admission Audit Log</h1>
          <p className="text-gray-500">
            Track and monitor all significant actions during the admission workflow
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" leftIcon={<RefreshCw className="w-4 h-4" />}>
            Refresh
          </Button>
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />} onClick={handleExport}>
            Export Log
          </Button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-2 p-3 bg-blue-50 text-blue-800 text-sm rounded-lg border border-blue-100">
        <Shield className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-600" />
        <div>
          <p className="font-medium">Immutable Audit Trail</p>
          <p className="text-blue-700 mt-1">
            This audit log maintains a permanent, immutable record of all admission-related
            activities. Records cannot be deleted or modified to ensure complete transparency and
            traceability. All timestamps are in IST (Indian Standard Time).
          </p>
        </div>
      </div>

      {/* Filters Card */}
      <Card>
        <div className="space-y-4">
          {/* Search and Primary Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by student, user, reference ID, or description..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Input
              type="date"
              placeholder="From Date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
            <Input
              type="date"
              placeholder="To Date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>

          {/* Advanced Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Select
              options={[
                { value: '', label: 'All Categories' },
                ...uniqueCategories.map((cat) => ({ value: cat, label: cat })),
              ]}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            />
            <Select
              options={[{ value: '', label: 'All Action Types' }, ...actionTypeOptions]}
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
            />
            <Select
              options={[
                { value: '', label: 'All Users' },
                ...uniqueUsers.map((user) => ({ value: user, label: user })),
              ]}
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
            />
            <Select
              options={[
                { value: '', label: 'All Severities' },
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'critical', label: 'Critical' },
              ]}
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
            />
            <Select
              options={[
                { value: '', label: 'All Statuses' },
                { value: 'success', label: 'Success' },
                { value: 'failed', label: 'Failed' },
                { value: 'pending', label: 'Pending' },
                { value: 'warning', label: 'Warning' },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="text-sm text-gray-500">
              Showing {paginatedLogs.length} of {filteredLogs.length} records
              {filteredLogs.length !== logs.length && (
                <span className="text-blue-600"> (filtered from {logs.length} total)</span>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Table Card */}
      <Card>
        <Table columns={columns} data={paginatedLogs} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Rows per page:</span>
              <Select
                options={[
                  { value: '10', label: '10' },
                  { value: '25', label: '25' },
                  { value: '50', label: '50' },
                  { value: '100', label: '100' },
                ]}
                value={String(itemsPerPage)}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
              />
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="px-4 text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Audit Event Details"
        size="lg"
        footer={
          <div className="flex justify-between w-full">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Copy className="w-4 h-4" />}
                onClick={() => {
                  if (selectedLog) {
                    navigator.clipboard.writeText(JSON.stringify(selectedLog, null, 2))
                  }
                }}
              >
                Copy JSON
              </Button>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Printer className="w-4 h-4" />}
              >
                Print
              </Button>
            </div>
            <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
              Close
            </Button>
          </div>
        }
      >
        {selectedLog && (
          <div className="space-y-6">
            {/* Event Header */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getActionIcon(selectedLog.actionType)}
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedLog.actionType}</h3>
                    <p className="text-sm text-gray-500">{selectedLog.actionCategory}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getSeverityBadge(selectedLog.severity)}
                  {getStatusBadge(selectedLog.status)}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 block mb-1">Event ID</span>
                  <span className="font-mono font-medium text-blue-600">{selectedLog.id}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Timestamp</span>
                  <span className="font-medium">{selectedLog.timestamp}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Reference ID</span>
                  <span className="font-mono font-medium">{selectedLog.referenceId}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Source Module</span>
                  <span className="font-medium">{selectedLog.sourceModule}</span>
                </div>
              </div>
            </div>

            {/* User Information */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" /> User Information
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 block mb-1">User Name</span>
                  <span className="font-medium">{selectedLog.userName}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">User ID</span>
                  <span className="font-mono">{selectedLog.userId}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Role</span>
                  <span className="font-medium">{selectedLog.userRole}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Email</span>
                  <span className="font-medium">{selectedLog.userEmail}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
              <p className="text-gray-700">{selectedLog.description}</p>
            </div>

            {/* Event Specific Details */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 border-b pb-2">
                <FileText className="w-4 h-4 text-gray-500" /> Event Details
              </h4>
              {renderDetailSection(selectedLog)}
            </div>

            {/* Technical Information */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Settings className="w-4 h-4 text-gray-500" /> Technical Information
              </h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 block mb-1">IP Address</span>
                  <span className="font-mono">{selectedLog.ipAddress}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Browser</span>
                  <span className="font-medium">{selectedLog.browser}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Device</span>
                  <span className="font-medium">{selectedLog.device}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}