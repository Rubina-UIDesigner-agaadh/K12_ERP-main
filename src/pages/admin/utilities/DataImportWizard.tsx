import React, { useState, useCallback, useRef } from 'react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Select } from '../../../components/ui/Select'
import { Table } from '../../../components/ui/Table'
import { Badge } from '../../../components/ui/Badge'
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  X,
  Download,
  Loader2,
  RefreshCw,
  Eye,
  Trash2,
  Edit,
  Save,
  XCircle,
  Info,
  Clock,
  FileSpreadsheet,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  CalendarDays,
  Users,
  Briefcase,
} from 'lucide-react'

// ==================== TYPE DEFINITIONS ====================

interface Step {
  num: number
  label: string
  description: string
}

interface EntityOption {
  value: string
  label: string
  description: string
  requiredFields: string[]
  optionalFields: string[]
  icon: string
}

interface UploadedFile {
  name: string
  size: number
  type: string
  lastModified: number
  headers: string[]
  rows: string[][]
  totalRows: number
}

interface UploadedSimpleFile {
  name: string
  size: number
  type: string
  lastModified: number
}

interface UploadedDocumentZip extends UploadedSimpleFile {
  totalFiles: number
}

interface ColumnMapping {
  col: string
  colIndex: number
  header: string
  field: string
  required: boolean
  matched: boolean
  sampleData: string[]
}

interface FieldOption {
  value: string
  label: string
  required: boolean
  type: 'text' | 'number' | 'date' | 'email' | 'phone' | 'select'
}

interface ValidationRow {
  row: number
  status: 'valid' | 'error' | 'warning'
  data: string
  rawData: string[]
  error: string
  fieldErrors: { field: string; message: string; value: string }[]
  isEdited: boolean
  originalData: string[]
}

interface ImportResult {
  success: boolean
  importedCount: number
  skippedCount: number
  warningCount: number
  errors: { row?: number; fileName?: string; error: string }[]
  timestamp: Date
  importId: string
  duration: number
  periodSummary?: { label: string; range: string; recordType: string }
}

interface ImportHistoryItem {
  id: string
  entityType: string
  entityLabel: string
  fileName: string
  importedCount: number
  skippedCount: number
  timestamp: Date
  status: 'completed' | 'partial' | 'failed'
  user: string
  periodLabel?: string
}

interface EditingCell {
  rowIndex: number
  colIndex: number
  value: string
}

type DocumentStatus = 'ready' | 'student_not_found' | 'duplicate' | 'invalid_name'
type DocumentResolution = 'attach' | 'skip' | 'replace_existing' | 'keep_both' | 'keep_existing' | 'resolve_student'

interface DocumentValidationRow {
  id: string
  fileName: string
  admissionNo: string
  studentName: string
  documentType: string
  extension: string
  status: DocumentStatus
  issue: string
  resolution: DocumentResolution
  resolvedAdmissionNo?: string
  existingDocumentName?: string
  matchedBy: 'filename' | 'filename + manifest' | 'manual'
}

interface DocumentValidationSummary {
  total: number
  ready: number
  importable: number
  studentNotFound: number
  duplicates: number
  invalidNames: number
}

// ==================== ATTENDANCE SPECIFIC TYPES ====================

type AttendanceRecordType = 'student' | 'staff'

/** Which kind of person a bulk document ZIP belongs to. */
type DocumentRecordType = 'student' | 'staff'

/**
 * An attendance import always targets one full academic session.
 * sessionStartYear is the calendar year the session begins in (e.g. 2025 => 2025-26,
 * which runs 01 April 2025 to 31 March 2026).
 */
interface AttendancePeriodConfig {
  sessionStartYear: number
}

interface PeriodRange {
  start: Date
  end: Date
}

interface ParsedDate {
  iso: string
  valid: boolean
}

interface PeriodOption {
  value: string
  label: string
}

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const ATTENDANCE_STATUS_VALUES = [
  'Present',
  'Absent',
  'Half Day',
  'Late',
  'Leave',
  'Holiday',
  'On Duty',
  'Work From Home',
]

// ==================== MOCK DATA GENERATORS ====================

export const pad = (value: number): string => String(value).padStart(2, '0')

export const toIsoDate = (date: Date): string => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

/**
 * Shifts a date by a number of days. Negative values move backwards in time,
 * which is what the attendance preview mock data needs.
 */
export const shiftDate = (base: Date, days: number): Date => {
  const next = new Date(base.getFullYear(), base.getMonth(), base.getDate())
  next.setDate(next.getDate() + days)
  return next
}

export const generateMockFileData = (entityType: string, now: Date = new Date()): { headers: string[]; rows: string[][] } => {
  const iso = (offsetDays: number) => toIsoDate(shiftDate(now, offsetDays))

  const mockData: Record<string, { headers: string[]; rows: string[][] }> = {
    student: {
      headers: [
        'Student Name',
        'Admission No',
        'Class',
        'Section',
        'Parent Name',
        'Date of Birth',
        'Gender',
        'Phone',
        'Email',
        'Address',
        'Blood Group',
        'Nationality',
      ],
      rows: [
        ['Rahul Sharma', 'A-101', '10', 'A', 'Amit Sharma', '2008-05-15', 'Male', '9876543210', 'rahul@email.com', '123 Main Street, Delhi', 'A+', 'Indian'],
        ['Priya Patel', 'A-102', '10', 'A', 'Rajesh Patel', '2008-07-22', 'Female', '9876543211', 'priya@email.com', '456 Oak Avenue, Mumbai', 'B+', 'Indian'],
        ['Amit Kumar', '', '10', 'B', 'Suresh Kumar', '2008-03-10', 'Male', '9876543212', 'amit@email.com', '789 Pine Road, Bangalore', 'O+', 'Indian'],
        ['Sneha Gupta', 'A-104', '10', 'B', 'Vijay Gupta', '2008-11-08', 'Female', '9876543213', 'sneha@email.com', '321 Elm Street, Chennai', 'AB+', 'Indian'],
        ['Rahul Sharma', 'A-101', '10', 'A', 'Amit Sharma', '2008-05-15', 'Male', '9876543210', 'rahul@email.com', '123 Main Street, Delhi', 'A+', 'Indian'],
        ['Vikram Singh', 'A-105', '10', 'C', 'Rajendra Singh', '2008-02-28', 'Male', '9876543214', 'vikram@email.com', '654 Maple Lane, Pune', 'B-', 'Indian'],
        ['Anita Reddy', 'A-106', '10', 'C', 'Krishna Reddy', '2008-09-14', 'Female', '9876543215', 'anita@email.com', '987 Cedar Drive, Hyderabad', 'O-', 'Indian'],
        ['Mohammed Ali', 'A-107', '11', 'A', 'Ahmed Ali', '2007-12-01', 'Male', '9876543216', 'mohammed@email.com', '147 Birch Way, Kolkata', 'A-', 'Indian'],
        ['Pooja Verma', 'A-108', '11', 'A', '', '', 'Female', '9876543217', 'pooja@email.com', '258 Spruce Court, Jaipur', 'B+', 'Indian'],
        ['Arjun Nair', 'A-109', '11', 'B', 'Suresh Nair', '2007-06-20', 'Male', '', 'arjun@email.com', '369 Willow Path, Kochi', 'AB-', 'Indian'],
        ['Kavitha Menon', 'A-110', '11', 'B', 'Ramesh Menon', '2007-04-18', 'Female', '9876543219', 'kavitha@email.com', '741 Ash Street, Trivandrum', 'O+', 'Indian'],
        ['Ravi Krishnan', 'A-111', '12', 'A', 'Venkat Krishnan', '2006-08-25', 'Male', '9876543220', 'invalid-email', '852 Poplar Road, Coimbatore', 'A+', 'Indian'],
        ['Deepa Iyer', 'A-112', '12', 'A', 'Gopal Iyer', '2006-10-30', 'Female', '9876543221', 'deepa@email.com', '963 Oak Lane, Madurai', 'B-', 'Indian'],
        ['Karthik Raj', 'A-113', '12', 'B', '', '2006-01-15', 'Male', '9876543222', 'karthik@email.com', '159 Pine Avenue, Salem', 'O+', 'Indian'],
        ['Lakshmi Devi', 'A-114', '12', 'B', 'Mohan Devi', '2006-06-08', 'Female', '98765', 'lakshmi@email.com', '357 Elm Road, Trichy', 'AB+', 'Indian'],
      ],
    },
    employee: {
      headers: [
        'Employee Name',
        'Employee ID',
        'Department',
        'Designation',
        'Email',
        'Phone',
        'Join Date',
        'Salary',
        'Qualification',
        'Experience',
        'Address',
        'Emergency Contact',
      ],
      rows: [
        ['Dr. Ramesh Kumar', 'EMP-001', 'Mathematics', 'Senior Teacher', 'ramesh@school.com', '9876543220', '2015-06-01', '45000', 'M.Sc Mathematics', '15 years', '123 Teacher Colony', '9876543230'],
        ['Mrs. Sunita Devi', 'EMP-002', 'English', 'Teacher', 'sunita@school.com', '9876543221', '2018-07-15', '35000', 'M.A English', '8 years', '456 Faculty Housing', '9876543231'],
        ['Mr. Anil Mehta', '', 'Science', 'Lab Assistant', 'anil@school.com', '9876543222', '2020-01-10', '25000', 'B.Sc', '3 years', '789 Staff Quarters', '9876543232'],
        ['Ms. Kavita Rao', 'EMP-004', 'Hindi', 'Teacher', 'kavita@school.com', '9876543223', '2019-03-22', '35000', 'M.A Hindi', '6 years', '321 Teacher Lane', '9876543233'],
        ['Mr. Suresh Iyer', 'EMP-005', 'Administration', 'Office Manager', '', '9876543224', '2016-08-05', '40000', 'MBA', '10 years', '654 Admin Block', '9876543234'],
        ['Dr. Meena Sharma', 'EMP-006', 'Science', 'HOD', 'meena@school.com', '9876543225', '2010-04-12', '55000', 'Ph.D Physics', '20 years', '987 Principal Row', '9876543235'],
        ['Mr. Prakash Joshi', 'EMP-007', 'Physical Education', 'Sports Coach', 'prakash@school.com', '9876543226', '2017-09-01', '30000', 'B.P.Ed', '5 years', '147 Sports Complex', '9876543236'],
        ['Mrs. Lakshmi Rao', 'EMP-002', 'Social Studies', 'Teacher', 'lakshmi@school.com', '9876543227', '2019-06-15', '35000', 'M.A History', '4 years', '258 Faculty Homes', '9876543237'],
        ['Mr. Venkat Reddy', 'EMP-009', 'Computer Science', 'Teacher', 'venkat@school.com', '9876543228', '2021-01-20', '-32000', 'MCA', '2 years', '369 IT Block', '9876543238'],
        ['Ms. Priya Nair', 'EMP-010', 'Arts', 'Teacher', 'priya@school.com', '9876543229', '', '28000', 'B.F.A', '7 years', '741 Arts Wing', '9876543239'],
      ],
    },
    fee_structure: {
      headers: [
        'Class',
        'Fee Type',
        'Amount',
        'Due Date',
        'Academic Year',
        'Description',
        'Late Fee',
        'Installments Allowed',
        'Category',
        'Frequency',
      ],
      rows: [
        ['10', 'Tuition Fee', '5000', '2024-04-10', '2024-25', 'Monthly tuition fee', '100', 'Yes', 'Academic', 'Monthly'],
        ['10', 'Lab Fee', '1500', '2024-04-10', '2024-25', 'Science lab charges', '50', 'No', 'Academic', 'Quarterly'],
        ['10', 'Library Fee', '500', '2024-04-10', '2024-25', 'Annual library fee', '25', 'No', 'Academic', 'Annual'],
        ['11', 'Tuition Fee', '6000', '2024-04-10', '2024-25', 'Monthly tuition fee', '120', 'Yes', 'Academic', 'Monthly'],
        ['11', 'Lab Fee', '2000', '2024-04-10', '2024-25', 'Science lab charges', '75', 'No', 'Academic', 'Quarterly'],
        ['12', 'Tuition Fee', '', '2024-04-10', '2024-25', 'Monthly tuition fee', '150', 'Yes', 'Academic', 'Monthly'],
        ['12', 'Lab Fee', '2500', '2024-04-10', '2024-25', 'Science lab charges', '100', 'No', 'Academic', 'Quarterly'],
        ['12', 'Exam Fee', '1000', '', '2024-25', 'Board exam registration', '0', 'No', 'Examination', 'Annual'],
        ['All', 'Transport Fee', '2000', '2024-04-10', '2024-25', 'School bus charges', '200', 'Yes', 'Transport', 'Monthly'],
        ['All', 'Sports Fee', 'abc', '2024-04-10', '2024-25', 'Sports activities', '50', 'No', 'Extra-curricular', 'Annual'],
      ],
    },
    marks: {
      headers: [
        'Student Admission No',
        'Subject',
        'Exam Type',
        'Max Marks',
        'Obtained Marks',
        'Grade',
        'Remarks',
        'Examiner',
        'Exam Date',
        'Attendance',
      ],
      rows: [
        ['A-101', 'Mathematics', 'Mid Term', '100', '85', 'A', 'Good performance', 'Mr. Sharma', '2024-01-15', 'Present'],
        ['A-101', 'Science', 'Mid Term', '100', '78', 'B+', 'Can improve', 'Dr. Meena', '2024-01-16', 'Present'],
        ['A-101', 'English', 'Mid Term', '100', '92', 'A+', 'Excellent', 'Mrs. Sunita', '2024-01-17', 'Present'],
        ['A-102', 'Mathematics', 'Mid Term', '100', '92', 'A+', 'Outstanding', 'Mr. Sharma', '2024-01-15', 'Present'],
        ['A-102', 'Science', 'Mid Term', '100', '105', 'Invalid', 'Error in marks', 'Dr. Meena', '2024-01-16', 'Present'],
        ['A-103', 'Mathematics', 'Mid Term', '100', '67', 'B', 'Average', 'Mr. Sharma', '2024-01-15', 'Present'],
        ['A-103', 'Science', 'Mid Term', '100', '72', 'B+', 'Good', 'Dr. Meena', '2024-01-16', 'Present'],
        ['A-104', 'Mathematics', 'Mid Term', '100', '88', 'A', 'Very Good', 'Mr. Sharma', '2024-01-15', 'Present'],
        ['', 'Science', 'Mid Term', '100', '90', 'A+', 'Excellent', 'Dr. Meena', '2024-01-16', 'Present'],
        ['A-105', 'Mathematics', 'Mid Term', '100', '45', 'C', 'Needs improvement', 'Mr. Sharma', '2024-01-15', 'Present'],
        ['A-105', 'Science', 'Mid Term', '100', '-10', 'Invalid', 'Negative marks', 'Dr. Meena', '2024-01-16', 'Absent'],
        ['A-106', 'Mathematics', 'Mid Term', '100', '91', 'A+', 'Excellent', 'Mr. Sharma', '2024-01-15', 'Present'],
      ],
    },
    inventory: {
      headers: [
        'Item Name',
        'Item Code',
        'Category',
        'Quantity',
        'Unit Price',
        'Supplier',
        'Location',
        'Reorder Level',
        'Last Updated',
        'Warranty',
      ],
      rows: [
        ['Whiteboard Marker', 'INV-001', 'Stationery', '500', '25', 'ABC Suppliers', 'Store Room A', '100', '2024-01-15', 'N/A'],
        ['Student Chair', 'INV-002', 'Furniture', '100', '1500', 'XYZ Furniture', 'Warehouse', '20', '2024-01-10', '2 years'],
        ['Projector', 'INV-003', 'Electronics', '10', '25000', 'Tech Solutions', 'IT Room', '2', '2024-01-08', '3 years'],
        ['Chemistry Kit', '', 'Lab Equipment', '25', '3500', 'Lab Essentials', 'Science Lab', '5', '2024-01-12', '1 year'],
        ['Football', 'INV-005', 'Sports', '-5', '800', 'Sports World', 'Sports Room', '10', '2024-01-14', 'N/A'],
        ['Desktop Computer', 'INV-006', 'Electronics', '50', '35000', 'Tech Solutions', 'Computer Lab', '10', '2024-01-11', '3 years'],
        ['Notebook (200 pages)', 'INV-007', 'Stationery', '2000', '45', 'ABC Suppliers', 'Store Room A', '500', '2024-01-16', 'N/A'],
        ['First Aid Kit', 'INV-008', 'Medical', '15', '1200', 'Medical Supplies Co', 'Infirmary', '5', '2024-01-09', '2 years'],
        ['Microscope', 'INV-009', 'Lab Equipment', '20', '8500', 'Lab Essentials', 'Science Lab', '5', '2024-01-07', '5 years'],
        ['Basketball', 'INV-005', 'Sports', '30', '1200', 'Sports World', 'Sports Room', '8', '2024-01-13', 'N/A'],
        ['Printer', 'INV-011', 'Electronics', '8', '-15000', 'Tech Solutions', 'Admin Office', '2', '2024-01-18', '1 year'],
        ['Laboratory Table', 'INV-012', 'Furniture', '30', '5000', 'XYZ Furniture', 'Science Lab', '5', '2024-01-19', '5 years'],
      ],
    },
    // ---------- Student attendance (generated around the selected period) ----------
    attendance_student: {
      headers: ['Student Admission No', 'Student Name', 'Date', 'Attendance', 'Late Minutes', 'Remarks'],
      rows: [
        ['A-101', 'Rahul Sharma', iso(-40), 'Present', '0', 'Regular'],
        ['A-101', 'Rahul Sharma', iso(-39), 'Absent', '', 'Sick leave'],
        ['A-102', 'Priya Patel', iso(-39), 'Late', '12', 'Reached late'],
        ['A-102', 'Priya Patel', iso(-39), 'Present', '0', 'Duplicate row in file'],
        ['A-103', 'Amit Kumar', iso(-38), 'Half Day', '', 'Left early'],
        ['A-104', 'Sneha Gupta', iso(-38), 'Holiday', '', 'School holiday'],
        ['A-101', 'Rahul Sharma', iso(-37), '', '', 'Status left blank'],
        ['A-105', 'Vikram Singh', iso(-37), 'P', '0', 'Short code used'],
        ['A-102', 'Priya Patel', iso(-36), 'On Duty', '', 'Sports meet'],
        ['A-900', 'Unknown Student', iso(-36), 'Present', '0', 'Admission no not in system'],
        ['A-103', 'Amit Kumar', iso(2), 'Present', '0', 'Future date outside period'],
      ],
    },
    // ---------- Staff attendance (generated around the selected period) ----------
    attendance_staff: {
      headers: [
        'Employee ID',
        'Employee Name',
        'Date',
        'Shift',
        'Attendance',
        'Overtime Hours',
        'Remarks',
        'Approved By',
      ],
      rows: [
        ['EMP-001', 'Dr. Ramesh Kumar', iso(-40), 'Morning', 'Present', '0', 'Regular duty', 'Principal'],
        ['EMP-001', 'Dr. Ramesh Kumar', iso(-39), 'Morning', 'On Duty', '2', 'External workshop', 'Principal'],
        ['EMP-002', 'Mrs. Sunita Devi', iso(-39), 'Morning', 'Half Day', '0', 'Half day approved', 'HOD'],
        ['EMP-003', 'Mr. Anil Mehta', iso(-38), 'Afternoon', 'Leave', '0', 'Casual leave', 'HOD'],
        ['EMP-003', 'Mr. Anil Mehta', iso(-38), 'Afternoon', 'Present', '0', 'Duplicate row in file', 'HOD'],
        ['EMP-004', 'Ms. Kavita Rao', iso(-37), 'Morning', 'WFH', '0', 'Short code used', 'Principal'],
        ['EMP-999', 'Unknown Staff', iso(-37), 'Morning', 'Present', '0', 'Employee not in system', 'Principal'],
        ['EMP-005', 'Mr. Suresh Iyer', iso(3), 'Morning', 'Present', '0', 'Future date outside period', 'Principal'],
      ],
    },
  }

  return mockData[entityType] || mockData.student
}

export const getEntityFields = (entityType: string): FieldOption[] => {
  const fields: Record<string, FieldOption[]> = {
    student: [
      { value: 'student_name', label: 'Student Name', required: true, type: 'text' },
      { value: 'admission_no', label: 'Admission No', required: true, type: 'text' },
      { value: 'class_id', label: 'Class', required: true, type: 'select' },
      { value: 'section_id', label: 'Section', required: false, type: 'select' },
      { value: 'guardian_name', label: 'Guardian Name', required: false, type: 'text' },
      { value: 'dob', label: 'Date of Birth', required: false, type: 'date' },
      { value: 'gender', label: 'Gender', required: false, type: 'select' },
      { value: 'phone', label: 'Phone Number', required: false, type: 'phone' },
      { value: 'email', label: 'Email', required: false, type: 'email' },
      { value: 'address', label: 'Address', required: false, type: 'text' },
      { value: 'blood_group', label: 'Blood Group', required: false, type: 'select' },
      { value: 'nationality', label: 'Nationality', required: false, type: 'text' },
      { value: 'ignore', label: '-- Ignore Column --', required: false, type: 'text' },
    ],
    employee: [
      { value: 'employee_name', label: 'Employee Name', required: true, type: 'text' },
      { value: 'employee_id', label: 'Employee ID', required: true, type: 'text' },
      { value: 'department', label: 'Department', required: true, type: 'select' },
      { value: 'designation', label: 'Designation', required: false, type: 'text' },
      { value: 'email', label: 'Email', required: false, type: 'email' },
      { value: 'phone', label: 'Phone', required: false, type: 'phone' },
      { value: 'join_date', label: 'Join Date', required: false, type: 'date' },
      { value: 'salary', label: 'Salary', required: false, type: 'number' },
      { value: 'qualification', label: 'Qualification', required: false, type: 'text' },
      { value: 'experience', label: 'Experience', required: false, type: 'text' },
      { value: 'address', label: 'Address', required: false, type: 'text' },
      { value: 'emergency_contact', label: 'Emergency Contact', required: false, type: 'phone' },
      { value: 'ignore', label: '-- Ignore Column --', required: false, type: 'text' },
    ],
    fee_structure: [
      { value: 'class_id', label: 'Class', required: true, type: 'select' },
      { value: 'fee_type', label: 'Fee Type', required: true, type: 'text' },
      { value: 'amount', label: 'Amount', required: true, type: 'number' },
      { value: 'due_date', label: 'Due Date', required: false, type: 'date' },
      { value: 'academic_year', label: 'Academic Year', required: false, type: 'text' },
      { value: 'description', label: 'Description', required: false, type: 'text' },
      { value: 'late_fee', label: 'Late Fee', required: false, type: 'number' },
      { value: 'installments', label: 'Installments Allowed', required: false, type: 'select' },
      { value: 'category', label: 'Category', required: false, type: 'select' },
      { value: 'frequency', label: 'Frequency', required: false, type: 'select' },
      { value: 'ignore', label: '-- Ignore Column --', required: false, type: 'text' },
    ],
    marks: [
      { value: 'admission_no', label: 'Student Admission No', required: true, type: 'text' },
      { value: 'subject', label: 'Subject', required: true, type: 'select' },
      { value: 'exam_type', label: 'Exam Type', required: true, type: 'select' },
      { value: 'max_marks', label: 'Max Marks', required: true, type: 'number' },
      { value: 'obtained_marks', label: 'Obtained Marks', required: true, type: 'number' },
      { value: 'grade', label: 'Grade', required: false, type: 'text' },
      { value: 'remarks', label: 'Remarks', required: false, type: 'text' },
      { value: 'examiner', label: 'Examiner', required: false, type: 'text' },
      { value: 'exam_date', label: 'Exam Date', required: false, type: 'date' },
      { value: 'attendance', label: 'Attendance', required: false, type: 'select' },
      { value: 'ignore', label: '-- Ignore Column --', required: false, type: 'text' },
    ],
    inventory: [
      { value: 'item_name', label: 'Item Name', required: true, type: 'text' },
      { value: 'item_code', label: 'Item Code', required: true, type: 'text' },
      { value: 'category', label: 'Category', required: true, type: 'select' },
      { value: 'quantity', label: 'Quantity', required: true, type: 'number' },
      { value: 'unit_price', label: 'Unit Price', required: false, type: 'number' },
      { value: 'supplier', label: 'Supplier', required: false, type: 'text' },
      { value: 'location', label: 'Location', required: false, type: 'text' },
      { value: 'reorder_level', label: 'Reorder Level', required: false, type: 'number' },
      { value: 'last_updated', label: 'Last Updated', required: false, type: 'date' },
      { value: 'warranty', label: 'Warranty', required: false, type: 'text' },
      { value: 'ignore', label: '-- Ignore Column --', required: false, type: 'text' },
    ],
    // ---------- Student attendance fields ----------
    attendance_student: [
      { value: 'admission_no', label: 'Student Admission No', required: true, type: 'text' },
      { value: 'student_name', label: 'Student Name', required: false, type: 'text' },
      { value: 'attendance_date', label: 'Attendance Date', required: true, type: 'date' },
      { value: 'attendance_status', label: 'Attendance Status', required: true, type: 'select' },
      { value: 'late_minutes', label: 'Late Minutes', required: false, type: 'number' },
      { value: 'remarks', label: 'Remarks', required: false, type: 'text' },
      { value: 'ignore', label: '-- Ignore Column --', required: false, type: 'text' },
    ],
    // ---------- Staff attendance fields ----------
    attendance_staff: [
      { value: 'employee_id', label: 'Employee ID', required: true, type: 'text' },
      { value: 'employee_name', label: 'Employee Name', required: false, type: 'text' },
      { value: 'attendance_date', label: 'Attendance Date', required: true, type: 'date' },
      { value: 'shift', label: 'Shift', required: false, type: 'select' },
      { value: 'attendance_status', label: 'Attendance Status', required: true, type: 'select' },
      { value: 'overtime_hours', label: 'Overtime Hours', required: false, type: 'number' },
      { value: 'remarks', label: 'Remarks', required: false, type: 'text' },
      { value: 'approved_by', label: 'Approved By', required: false, type: 'text' },
      { value: 'ignore', label: '-- Ignore Column --', required: false, type: 'text' },
    ],
  }

  return fields[entityType] || fields.student
}

export /**
 * Whole-word keyword match. Substring matching is deliberately avoided so that
 * headers like "Attendance" are not captured by the "date" keyword, and "Shift"
 * is not captured by "salary".
 */
const headerMatchesKeyword = (normalizedHeader: string, keyword: string): boolean => {
  if (!normalizedHeader || !keyword) return false
  if (normalizedHeader === keyword) return true

  const headerTokens = normalizedHeader.split(/[\s_\-./]+/).filter(Boolean)
  const keywordTokens = keyword.split(/[\s_\-./]+/).filter(Boolean)

  // The keyword must be fully contained in the header (token-wise). The reverse
  // direction is deliberately not allowed, otherwise the header "Attendance"
  // would satisfy the keyword "Attendance Date".
  if (keywordTokens.length > 0 && keywordTokens.every((token) => headerTokens.includes(token))) return true

  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(^|[^a-z0-9])${escapedKeyword}([^a-z0-9]|$)`).test(normalizedHeader)
}

export const autoMapColumns = (headers: string[], entityType: string): Record<string, string> => {
  const mappingRules: Record<string, Record<string, string[]>> = {
    student: {
      student_name: ['student name', 'name', 'student', 'full name', 'pupil name', 'learner name', 'student full name'],
      admission_no: ['admission no', 'admission number', 'adm no', 'roll no', 'enrollment no', 'registration no', 'adm number', 'admission'],
      class_id: ['class', 'grade', 'standard', 'class id', 'form', 'year', 'std'],
      section_id: ['section', 'division', 'section id', 'stream', 'div'],
      guardian_name: ['parent name', 'guardian name', 'father name', 'mother name', 'guardian', 'parent', 'father', 'mother'],
      dob: ['dob', 'date of birth', 'birth date', 'birthday', 'birthdate', 'date_of_birth'],
      gender: ['gender', 'sex', 'm/f', 'male/female'],
      phone: ['phone', 'mobile', 'contact', 'phone number', 'mobile number', 'telephone', 'cell', 'contact number'],
      email: ['email', 'email address', 'e-mail', 'mail', 'email id'],
      address: ['address', 'home address', 'residential address', 'location', 'addr', 'residence'],
      blood_group: ['blood group', 'blood type', 'bloodgroup', 'blood'],
      nationality: ['nationality', 'nation', 'country', 'citizenship'],
    },
    employee: {
      employee_name: ['employee name', 'name', 'full name', 'staff name', 'teacher name', 'emp name'],
      employee_id: ['employee id', 'emp id', 'staff id', 'id', 'employee code', 'emp code', 'employee no'],
      department: ['department', 'dept', 'division', 'subject', 'dept name'],
      designation: ['designation', 'position', 'role', 'title', 'job title', 'post'],
      email: ['email', 'email address', 'e-mail', 'mail', 'official email'],
      phone: ['phone', 'mobile', 'contact', 'telephone', 'cell', 'contact number'],
      join_date: ['join date', 'joining date', 'start date', 'hired date', 'date of joining', 'doj'],
      salary: ['salary', 'pay', 'compensation', 'wage', 'ctc', 'monthly salary'],
      qualification: ['qualification', 'education', 'degree', 'educational qualification', 'edu'],
      experience: ['experience', 'work experience', 'years of experience', 'exp', 'total experience'],
      address: ['address', 'home address', 'residential address', 'location'],
      emergency_contact: ['emergency contact', 'emergency', 'emergency phone', 'emergency number'],
    },
    fee_structure: {
      class_id: ['class', 'grade', 'standard', 'form', 'year'],
      fee_type: ['fee type', 'type', 'fee category', 'fee name', 'fee head'],
      amount: ['amount', 'fee amount', 'price', 'cost', 'fee', 'value'],
      due_date: ['due date', 'deadline', 'payment date', 'due', 'last date'],
      academic_year: ['academic year', 'year', 'session', 'academic session', 'ay'],
      description: ['description', 'details', 'remarks', 'notes', 'desc'],
      late_fee: ['late fee', 'penalty', 'fine', 'late charge', 'late payment fee'],
      installments: ['installments', 'installments allowed', 'emi', 'payment plan', 'installment'],
      category: ['category', 'fee category', 'type', 'cat'],
      frequency: ['frequency', 'payment frequency', 'freq', 'cycle'],
    },
    marks: {
      admission_no: ['admission no', 'student admission no', 'roll no', 'student id', 'student roll no', 'adm no'],
      subject: ['subject', 'course', 'paper', 'subject name', 'sub'],
      exam_type: ['exam type', 'exam', 'test type', 'assessment', 'examination', 'test'],
      max_marks: ['max marks', 'maximum marks', 'total marks', 'out of', 'full marks', 'max'],
      obtained_marks: ['obtained marks', 'marks obtained', 'score', 'marks', 'scored', 'obtained'],
      grade: ['grade', 'letter grade', 'result', 'grade obtained'],
      remarks: ['remarks', 'comments', 'notes', 'feedback', 'remark'],
      examiner: ['examiner', 'teacher', 'evaluator', 'checked by', 'corrected by'],
      exam_date: ['exam date', 'date', 'test date', 'examination date'],
      attendance: ['attendance', 'present', 'status', 'present/absent'],
    },
    inventory: {
      item_name: ['item name', 'name', 'product name', 'item', 'product', 'goods'],
      item_code: ['item code', 'code', 'sku', 'product code', 'item id', 'product id'],
      category: ['category', 'type', 'group', 'item category', 'product category'],
      quantity: ['quantity', 'qty', 'stock', 'count', 'available', 'stock qty'],
      unit_price: ['unit price', 'price', 'rate', 'cost', 'mrp', 'unit cost'],
      supplier: ['supplier', 'vendor', 'provider', 'supplier name', 'vendor name'],
      location: ['location', 'storage', 'warehouse', 'place', 'store', 'storage location'],
      reorder_level: ['reorder level', 'minimum stock', 'min qty', 'reorder point', 'min stock'],
      last_updated: ['last updated', 'updated date', 'last modified', 'date', 'update date'],
      warranty: ['warranty', 'warranty period', 'guarantee', 'warranty info'],
    },
    attendance_student: {
      admission_no: ['admission no', 'student admission no', 'admission number', 'adm no', 'student id', 'roll no', 'student roll no'],
      student_name: ['student name', 'name', 'student', 'full name', 'pupil name'],
      attendance_date: ['date', 'attendance date', 'date of attendance', 'attended date', 'on date'],
      attendance_status: ['attendance', 'status', 'attendance status', 'present/absent', 'p/a', 'mark'],
      late_minutes: ['late minutes', 'late', 'minutes late', 'delay minutes'],
      remarks: ['remarks', 'remark', 'comments', 'notes', 'reason', 'note'],
    },
    attendance_staff: {
      employee_id: ['employee id', 'emp id', 'staff id', 'employee code', 'emp code', 'employee no', 'staff code'],
      employee_name: ['employee name', 'name', 'staff name', 'teacher name', 'full name', 'emp name'],
      attendance_date: ['date', 'attendance date', 'date of attendance', 'on date'],
      shift: ['shift', 'shift name', 'duty shift', 'shift timing'],
      attendance_status: ['attendance', 'status', 'attendance status', 'present/absent', 'p/a', 'mark'],
      overtime_hours: ['overtime hours', 'overtime', 'ot hours', 'extra hours'],
      remarks: ['remarks', 'remark', 'comments', 'notes', 'reason', 'note'],
      approved_by: ['approved by', 'approver', 'verified by', 'approved', 'authorised by'],
    },
  }

  const rules = mappingRules[entityType] || mappingRules.student
  const mapping: Record<string, string> = {}

  headers.forEach((header, index) => {
    const normalizedHeader = header.toLowerCase().trim()
    let matched = false

    for (const [field, keywords] of Object.entries(rules)) {
      if (keywords.some((keyword) => headerMatchesKeyword(normalizedHeader, keyword))) {
        mapping[String.fromCharCode(65 + index)] = field
        matched = true
        break
      }
    }

    if (!matched) {
      mapping[String.fromCharCode(65 + index)] = 'ignore'
    }
  })

  return mapping
}

const generateImportId = (): string => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `IMP-${timestamp}-${random}`
}

// ==================== ATTENDANCE PERIOD HELPERS ====================

export const parseDateValue = (value: string): ParsedDate => {
  const raw = (value || '').trim()

  const isoMatch = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
  const slashMatch = raw.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/)

  let year: number
  let month: number
  let day: number

  if (isoMatch) {
    year = Number(isoMatch[1])
    month = Number(isoMatch[2])
    day = Number(isoMatch[3])
  } else if (slashMatch) {
    day = Number(slashMatch[1])
    month = Number(slashMatch[2])
    year = Number(slashMatch[3])
  } else {
    return { iso: '', valid: false }
  }

  if (month < 1 || month > 12 || day < 1) return { iso: '', valid: false }

  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return { iso: '', valid: false }
  }

  return { iso: toIsoDate(date), valid: true }
}

export const daysInMonth = (year: number, month: number): number => new Date(year, month, 0).getDate()

/**
 * Returns the inclusive date range covered by an academic session.
 * e.g. session 2025-26 => 01 April 2025 to 31 March 2026.
 */
export const getPeriodRange = (config: AttendancePeriodConfig): PeriodRange => {
  return {
    start: new Date(config.sessionStartYear, 3, 1),
    end: new Date(config.sessionStartYear + 1, 2, 31),
  }
}

export const formatShortDate = (date: Date): string =>
  date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

export const isDateWithinRange = (iso: string, range: PeriodRange): boolean => {
  const parsed = parseDateValue(iso)
  if (!parsed.valid) return false

  const candidate = new Date(parsed.iso)
  const start = new Date(toIsoDate(range.start))
  const end = new Date(toIsoDate(range.end))

  return candidate >= start && candidate <= end
}

export const getCurrentAcademicSessionStartYear = (now: Date): number =>
  now.getMonth() + 1 >= 4 ? now.getFullYear() : now.getFullYear() - 1

/** Default session is the previous academic year (e.g. in 2026 => 2024-25, the most recent closed session). */
export const getDefaultAttendancePeriod = (now: Date = new Date()): AttendancePeriodConfig => ({
  sessionStartYear: getCurrentAcademicSessionStartYear(now) - 1,
})

export const getYearPeriodOptions = (now: Date = new Date()): PeriodOption[] => {
  const currentSessionStart = getCurrentAcademicSessionStartYear(now)
  const options: PeriodOption[] = []

  for (let offset = 1; offset <= 5; offset += 1) {
    const startYear = currentSessionStart - offset
    options.push({
      value: String(startYear),
      label: `${startYear}-${String(startYear + 1).slice(-2)}`,
    })
  }

  return options
}

export const describePeriod = (config: AttendancePeriodConfig): { label: string; range: string } => {
  const range = getPeriodRange(config)
  return {
    label: `Session ${config.sessionStartYear}-${String(config.sessionStartYear + 1).slice(-2)}`,
    range: `${formatShortDate(range.start)} to ${formatShortDate(range.end)}`,
  }
}

const ATTENDANCE_STATUS_LOOKUP: Record<string, string> = {
  p: 'Present',
  present: 'Present',
  a: 'Absent',
  absent: 'Absent',
  h: 'Half Day',
  hd: 'Half Day',
  'half day': 'Half Day',
  halfday: 'Half Day',
  l: 'Late',
  late: 'Late',
  lv: 'Leave',
  leave: 'Leave',
  'on leave': 'Leave',
  hol: 'Holiday',
  holiday: 'Holiday',
  od: 'On Duty',
  'on duty': 'On Duty',
  wfh: 'Work From Home',
  'work from home': 'Work From Home',
}

export const normalizeAttendanceStatus = (value: string): string | null =>
  ATTENDANCE_STATUS_LOOKUP[(value || '').trim().toLowerCase()] || null

const mockStudentDirectory: Record<string, string> = {
  STU001: 'Aarav Shah',
  STU002: 'Riya Patel',
  STU003: 'Vivaan Mehta',
  STU004: 'Diya Joshi',
}

/** Demo directory used to verify that staff document rows point at real employees. */
const mockEmployeeDocDirectory: Record<string, string> = {
  EMP001: 'Dr. Ramesh Kumar',
  EMP002: 'Mrs. Sunita Devi',
  EMP003: 'Mr. Anil Mehta',
  EMP004: 'Ms. Kavita Rao',
  EMP005: 'Mr. Suresh Iyer',
}

/** Demo directory used to verify that attendance rows point at real students. */
const mockAttendanceStudentDirectory: Record<string, string> = {
  'A-101': 'Rahul Sharma',
  'A-102': 'Priya Patel',
  'A-103': 'Amit Kumar',
  'A-104': 'Sneha Gupta',
  'A-105': 'Vikram Singh',
  'A-106': 'Anita Reddy',
}

/** Demo directory used to verify that staff attendance rows point at real employees. */
const mockAttendanceEmployeeDirectory: Record<string, string> = {
  'EMP-001': 'Dr. Ramesh Kumar',
  'EMP-002': 'Mrs. Sunita Devi',
  'EMP-003': 'Mr. Anil Mehta',
  'EMP-004': 'Ms. Kavita Rao',
  'EMP-005': 'Mr. Suresh Iyer',
  'EMP-006': 'Dr. Meena Sharma',
}

const supportedDocumentExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx']

/** Demo ZIP contents used when importing student documents. */
const mockStudentDocumentZipFiles = [
  'STU001_Aadhaar.pdf',
  'STU001_Birth_Certificate.pdf',
  'STU001_Photo.jpg',
  'STU002_Aadhaar.pdf',
  'STU002_Birth_Certificate.pdf',
  'STU002_Photo.jpg',
  'STU003_Aadhaar.pdf',
  'STU003_Photo.jpg',
  'STU004_Birth_Certificate.pdf',
  'STU009_Aadhaar.pdf',
  'STU001_Aadhaar_2.pdf',
  'ARYA_ID_PROOF.pdf',
]

/** Demo ZIP contents used when importing staff documents. */
const mockStaffDocumentZipFiles = [
  'EMP001_Appointment_Letter.pdf',
  'EMP001_ID_Proof.pdf',
  'EMP001_Photo.jpg',
  'EMP002_Appointment_Letter.pdf',
  'EMP002_Photo.jpg',
  'EMP003_Joining_Certificate.pdf',
  'EMP003_Photo.jpg',
  'EMP004_ID_Proof.pdf',
  'EMP999_Appointment_Letter.pdf',
  'EMP001_Appointment_Letter_2.pdf',
  'UNKNOWN_DOC.pdf',
]

/** Filename -> (person id + document type) manifest reference, per record type. */
const mockManifestMapByType: Record<DocumentRecordType, Record<string, { id: string; documentType: string }>> = {
  student: {
    'STU001_Aadhaar.pdf': { id: 'STU001', documentType: 'Aadhaar' },
    'STU001_Birth_Certificate.pdf': { id: 'STU001', documentType: 'Birth Certificate' },
    'STU001_Photo.jpg': { id: 'STU001', documentType: 'Photo' },
    'STU002_Aadhaar.pdf': { id: 'STU002', documentType: 'Aadhaar' },
    'STU002_Birth_Certificate.pdf': { id: 'STU002', documentType: 'Birth Certificate' },
    'STU002_Photo.jpg': { id: 'STU002', documentType: 'Photo' },
    'STU003_Aadhaar.pdf': { id: 'STU003', documentType: 'Aadhaar' },
    'STU003_Photo.jpg': { id: 'STU003', documentType: 'Photo' },
    'STU004_Birth_Certificate.pdf': { id: 'STU004', documentType: 'Birth Certificate' },
    'STU009_Aadhaar.pdf': { id: 'STU009', documentType: 'Aadhaar' },
    'STU001_Aadhaar_2.pdf': { id: 'STU001', documentType: 'Aadhaar' },
    'ARYA_ID_PROOF.pdf': { id: 'STU004', documentType: 'Aadhaar' },
  },
  staff: {
    'EMP001_Appointment_Letter.pdf': { id: 'EMP001', documentType: 'Appointment Letter' },
    'EMP001_ID_Proof.pdf': { id: 'EMP001', documentType: 'ID Proof' },
    'EMP001_Photo.jpg': { id: 'EMP001', documentType: 'Photo' },
    'EMP002_Appointment_Letter.pdf': { id: 'EMP002', documentType: 'Appointment Letter' },
    'EMP002_Photo.jpg': { id: 'EMP002', documentType: 'Photo' },
    'EMP003_Joining_Certificate.pdf': { id: 'EMP003', documentType: 'Joining Certificate' },
    'EMP003_Photo.jpg': { id: 'EMP003', documentType: 'Photo' },
    'EMP004_ID_Proof.pdf': { id: 'EMP004', documentType: 'ID Proof' },
    'EMP999_Appointment_Letter.pdf': { id: 'EMP999', documentType: 'Appointment Letter' },
    'EMP001_Appointment_Letter_2.pdf': { id: 'EMP001', documentType: 'Appointment Letter' },
    'UNKNOWN_DOC.pdf': { id: 'EMP002', documentType: 'ID Proof' },
  },
}

/** First token of a person id in a document filename, keyed by record type. */
const documentIdPrefixByType: Record<DocumentRecordType, string> = {
  student: 'STU',
  staff: 'EMP',
}

/** Demo roster of the students in a given class, used for class-aware document manifests. */
const getDocumentClassStudents = (cls: string): { id: string; name: string }[] =>
  ['Aarav Shah', 'Riya Patel', 'Vivaan Mehta', 'Diya Joshi', 'Kabir Rao'].map((name, index) => ({
    id: `STU${cls}${String(index + 1).padStart(2, '0')}`,
    name,
  }))

/** Demo roster of the students in a given class, used for the attendance register. */
const getAttendanceClassStudents = (cls: string): { id: string; name: string }[] =>
  ['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Gupta', 'Vikram Singh', 'Anita Reddy'].map((name, index) => ({
    id: `A-${String(cls).padStart(2, '0')}${index + 1}`,
    name,
  }))

const normalizeDocumentType = (value: string): string => {
  const cleaned = value
    .replace(/\.[^.]+$/, '')
    .replace(/[\-_]+/g, ' ')
    .replace(/\b\d+\b/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  const lower = cleaned.toLowerCase()

  if (/(aadhaar|aadhar|id proof|idproof)/.test(lower)) return 'Aadhaar'
  if (/(birth certificate|birthcertificate|birth cert)/.test(lower)) return 'Birth Certificate'
  if (/(photo|profile photo|passport photo)/.test(lower)) return 'Photo'
  if (/(transfer certificate|tc)/.test(lower)) return 'Transfer Certificate'
  if (/(marksheet|mark sheet|report card)/.test(lower)) return 'Marksheet'
  if (/(appointment letter|appointment)/.test(lower)) return 'Appointment Letter'
  if (/(joining certificate|joining)/.test(lower)) return 'Joining Certificate'
  if (/(relieving|experience letter|experience)/.test(lower)) return 'Experience Letter'

  return cleaned || 'Unknown'
}

const parseDocumentFileName = (fileName: string, recordType: DocumentRecordType): { valid: boolean; id: string; documentType: string; extension: string; issue?: string } => {
  const extension = fileName.split('.').pop()?.toLowerCase() || ''

  if (!supportedDocumentExtensions.includes(extension)) {
    return {
      valid: false,
      id: '',
      documentType: '',
      extension,
      issue: `Unsupported file type .${extension || 'unknown'}`,
    }
  }

  const baseName = fileName.replace(/\.[^.]+$/, '')
  const parts = baseName.split('_').filter(Boolean)

  if (parts.length < 2) {
    return {
      valid: false,
      id: '',
      documentType: '',
      extension,
      issue: 'Filename must follow ID_DocumentType.ext format',
    }
  }

  const id = parts[0].toUpperCase()
  const documentType = normalizeDocumentType(parts.slice(1).join(' '))
  const prefix = documentIdPrefixByType[recordType]

  if (prefix && !id.startsWith(prefix)) {
    const personLabel = recordType === 'staff' ? 'Employee' : 'Student'
    return {
      valid: false,
      id,
      documentType,
      extension,
      issue: `${personLabel} ID prefix (${prefix}) could not be safely determined from filename`,
    }
  }

  return {
    valid: true,
    id,
    documentType,
    extension,
  }
}

const getDocumentImportableCount = (rows: DocumentValidationRow[]): number =>
  rows.filter((row) => row.status === 'ready' || (row.status === 'duplicate' && ['replace_existing', 'keep_both'].includes(row.resolution))).length

const summarizeDocumentValidationResults = (rows: DocumentValidationRow[]): DocumentValidationSummary => ({
  total: rows.length,
  ready: rows.filter((row) => row.status === 'ready').length,
  importable: getDocumentImportableCount(rows),
  studentNotFound: rows.filter((row) => row.status === 'student_not_found').length,
  duplicates: rows.filter((row) => row.status === 'duplicate').length,
  invalidNames: rows.filter((row) => row.status === 'invalid_name').length,
})

const buildMockDocumentValidationRows = (recordType: DocumentRecordType, hasManifestReference: boolean): DocumentValidationRow[] => {
  const isStaff = recordType === 'staff'
  const directory = isStaff ? mockEmployeeDocDirectory : mockStudentDirectory
  const zipFiles = isStaff ? mockStaffDocumentZipFiles : mockStudentDocumentZipFiles
  const manifestMap = mockManifestMapByType[recordType]
  const seenDocumentKeys = new Map<string, string>()

  return zipFiles.map((fileName, index) => {
    const manifestEntry = hasManifestReference ? manifestMap[fileName] : undefined
    const parsed = parseDocumentFileName(fileName, recordType)

    if (!parsed.valid) {
      return {
        id: `DOC-${index + 1}`,
        fileName,
        admissionNo: parsed.id,
        studentName: '',
        documentType: parsed.documentType || 'Unknown',
        extension: parsed.extension,
        status: 'invalid_name' as const,
        issue: manifestEntry
          ? `${parsed.issue || 'Invalid filename format'} (manifest reference found but filename still needs correction)`
          : parsed.issue || 'Invalid filename format',
        resolution: 'skip' as const,
        matchedBy: 'filename' as const,
      }
    }

    const key = `${parsed.id}|${parsed.documentType}`
    const personName = directory[parsed.id]
    const matchedBy = manifestEntry ? 'filename + manifest' : 'filename'

    if (manifestEntry && (manifestEntry.id !== parsed.id || manifestEntry.documentType !== parsed.documentType)) {
      return {
        id: `DOC-${index + 1}`,
        fileName,
        admissionNo: parsed.id,
        studentName: personName || '',
        documentType: parsed.documentType,
        extension: parsed.extension,
        status: 'invalid_name' as const,
        issue: `Filename and manifest reference do not match for ${fileName}`,
        resolution: 'skip' as const,
        matchedBy,
      }
    }

    if (!personName) {
      return {
        id: `DOC-${index + 1}`,
        fileName,
        admissionNo: parsed.id,
        studentName: '',
        documentType: parsed.documentType,
        extension: parsed.extension,
        status: 'student_not_found' as const,
        issue: `${isStaff ? 'Employee ID' : 'Admission No.'} ${parsed.id} does not exist in this school`,
        resolution: 'skip' as const,
        matchedBy,
      }
    }

    if (seenDocumentKeys.has(key)) {
      return {
        id: `DOC-${index + 1}`,
        fileName,
        admissionNo: parsed.id,
        studentName: personName,
        documentType: parsed.documentType,
        extension: parsed.extension,
        status: 'duplicate' as const,
        issue: `Duplicate ${parsed.documentType} found for ${parsed.id}`,
        resolution: 'keep_existing' as const,
        existingDocumentName: seenDocumentKeys.get(key),
        matchedBy,
      }
    }

    seenDocumentKeys.set(key, fileName)

    return {
      id: `DOC-${index + 1}`,
      fileName,
      admissionNo: parsed.id,
      studentName: personName,
      documentType: parsed.documentType,
      extension: parsed.extension,
      status: 'ready' as const,
      issue: manifestEntry ? 'Matched using filename and verified with manifest reference' : 'Matched using filename',
      resolution: 'attach' as const,
      matchedBy,
    }
  })
}

// Mock import history
const initialImportHistory: ImportHistoryItem[] = [
  {
    id: 'IMP-1704067200000-ABC123',
    entityType: 'student',
    entityLabel: 'Student Records',
    fileName: 'students_batch_2024.csv',
    importedCount: 150,
    skippedCount: 5,
    timestamp: new Date('2024-01-01T10:00:00'),
    status: 'completed',
    user: 'Admin User',
  },
  {
    id: 'IMP-1704153600000-DEF456',
    entityType: 'employee',
    entityLabel: 'Employee Records',
    fileName: 'new_teachers.xlsx',
    importedCount: 25,
    skippedCount: 2,
    timestamp: new Date('2024-01-02T14:30:00'),
    status: 'partial',
    user: 'HR Manager',
  },
  {
    id: 'IMP-1704240000000-GHI789',
    entityType: 'marks',
    entityLabel: 'Exam Marks',
    fileName: 'midterm_results.csv',
    importedCount: 500,
    skippedCount: 0,
    timestamp: new Date('2024-01-03T09:15:00'),
    status: 'completed',
    user: 'Academic Coordinator',
  },
  {
    id: 'IMP-1704326400000-JKL012',
    entityType: 'inventory',
    entityLabel: 'Inventory Items',
    fileName: 'stock_update.xlsx',
    importedCount: 0,
    skippedCount: 50,
    timestamp: new Date('2024-01-04T11:45:00'),
    status: 'failed',
    user: 'Store Manager',
  },
  {
    id: 'IMP-1704412800000-MNO345',
    entityType: 'attendance',
    entityLabel: 'Attendance Records',
    fileName: 'attendance_2023-24.csv',
    importedCount: 1240,
    skippedCount: 18,
    timestamp: new Date('2024-01-05T16:20:00'),
    status: 'partial',
    user: 'Admin User',
    periodLabel: 'Session 2023-24 (Student)',
  },
]

// ==================== MAIN COMPONENT ====================

export function DataImportWizard() {
  // Step management
  const [step, setStep] = useState<number>(1)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [processingMessage, setProcessingMessage] = useState<string>('')

  // Entity selection state
  const [selectedEntity, setSelectedEntity] = useState<string>('')

  // File upload state for data imports
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [uploadError, setUploadError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // File upload state for document imports
  const [uploadedDocumentZip, setUploadedDocumentZip] = useState<UploadedDocumentZip | null>(null)
  const [uploadedManifestFile, setUploadedManifestFile] = useState<UploadedSimpleFile | null>(null)
  const documentZipInputRef = useRef<HTMLInputElement>(null)
  const documentManifestInputRef = useRef<HTMLInputElement>(null)

  // Column mapping state
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([])

  // Validation state for data imports
  const [validationResults, setValidationResults] = useState<ValidationRow[]>([])
  const [validationSummary, setValidationSummary] = useState<{
    valid: number
    errors: number
    warnings: number
    total: number
  }>({ valid: 0, errors: 0, warnings: 0, total: 0 })
  const [validationFilter, setValidationFilter] = useState<'all' | 'valid' | 'error' | 'warning'>('all')
  const [validationSearch, setValidationSearch] = useState<string>('')

  // Validation state for document imports
  const [documentValidationResults, setDocumentValidationResults] = useState<DocumentValidationRow[]>([])
  const [documentValidationSummary, setDocumentValidationSummary] = useState<DocumentValidationSummary>({
    total: 0,
    ready: 0,
    importable: 0,
    studentNotFound: 0,
    duplicates: 0,
    invalidNames: 0,
  })
  const [documentValidationFilter, setDocumentValidationFilter] = useState<'all' | 'ready' | 'student_not_found' | 'duplicate' | 'invalid_name'>('all')
  const [documentValidationSearch, setDocumentValidationSearch] = useState<string>('')
  const [documentResolutionDrafts, setDocumentResolutionDrafts] = useState<Record<string, string>>({})

  // Attendance period state (student + staff, one full academic session)
  const [attendanceRecordType, setAttendanceRecordType] = useState<AttendanceRecordType>('student')

  // Which kind of person a bulk document ZIP belongs to (student or staff).
  const [documentRecordType, setDocumentRecordType] = useState<DocumentRecordType>('student')
  const [attendancePeriod, setAttendancePeriod] = useState<AttendancePeriodConfig>(() => getDefaultAttendancePeriod())

  // Combined "Student & Staff Records" import state
  // - combinedRecordType picks whether we are importing student or staff profiles.
  // - selectedClasses holds the class(es) being added, used for students only.
  const [combinedRecordType, setCombinedRecordType] = useState<'student' | 'employee'>('student')
  const [selectedClasses, setSelectedClasses] = useState<string[]>([])

  // Editing state
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null)
  const [editedRows, setEditedRows] = useState<Set<number>>(new Set())

  // Import state
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [importProgress, setImportProgress] = useState<number>(0)

  // Import history state
  const [importHistory, setImportHistory] = useState<ImportHistoryItem[]>(initialImportHistory)
  const [showHistory, setShowHistory] = useState<boolean>(false)
  const [historyFilter, setHistoryFilter] = useState<string>('all')

  // Preview modal state
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false)
  const [previewRowData, setPreviewRowData] = useState<ValidationRow | null>(null)

  // Expand/collapse state for sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    filePreview: true,
    validationTable: true,
  })

  const isDocumentImport = selectedEntity === 'student_documents'
  const isAttendanceImport = selectedEntity === 'attendance'
  const isCombinedImport = selectedEntity === 'student_staff'
  const attendanceEntityKey = attendanceRecordType === 'staff' ? 'attendance_staff' : 'attendance_student'

  // The key used to resolve entity fields, mock data and auto-mapping.
  // For the combined import this is either 'student' or 'employee'.
  const getEntityTypeKey = (): string =>
    isAttendanceImport ? attendanceEntityKey : isCombinedImport ? combinedRecordType : selectedEntity

  // ---- Upload limits & scope shown on the upload step, per import type ----
  interface ImportLimit {
    size: string
    records: string
    scope: string
  }
  const importLimitConfig: Record<string, ImportLimit> = {
    student: { size: '25 MB', records: '50K records', scope: 'School → Class → Section' },
    employee: { size: '25 MB', records: '10K records', scope: 'School → Department → Branch' },
    student_documents: { size: '100 MB ZIP', records: '—', scope: 'School → Class → Section' },
    staff_documents: { size: '100 MB ZIP', records: '—', scope: 'School → Department' },
    attendance_student: { size: '25 MB', records: '250K records', scope: 'Class → Section → Date Range' },
    attendance_staff: { size: '25 MB', records: '250K records', scope: 'Department → Date Range' },
    marks: { size: '25 MB', records: '100K marks', scope: 'Exam → Class → Section → Subject' },
    inventory: { size: '25 MB', records: '50K records', scope: 'Category → Store' },
  }
  const getImportLimitKey = (): string | null => {
    if (!selectedEntity) return null
    if (isCombinedImport) return combinedRecordType === 'student' ? 'student' : 'employee'
    if (isDocumentImport) return documentRecordType === 'student' ? 'student_documents' : 'staff_documents'
    if (isAttendanceImport) return attendanceRecordType === 'staff' ? 'attendance_staff' : 'attendance_student'
    if (selectedEntity === 'marks') return 'marks'
    if (selectedEntity === 'inventory') return 'inventory'
    // Fee Structures is not part of the published limit matrix.
    return null
  }
  const activeImportLimit = (): ImportLimit | null => {
    const key = getImportLimitKey()
    return key ? importLimitConfig[key] : null
  }

  // Data files are auto-mapped immediately after upload and proceed directly to validation.
  const combinedSteps: Step[] = [
    { num: 1, label: 'Select Entity', description: 'Choose the type of data to import' },
    { num: 2, label: 'Record Type & Class', description: 'Choose student or staff, and select the class(es) being added for students' },
    { num: 3, label: 'Upload File', description: 'Upload your CSV or Excel file' },
    { num: 4, label: 'Validate', description: 'Review and fix validation errors' },
    { num: 5, label: 'Confirm', description: 'Confirm and complete import' },
  ]

  const dataSteps: Step[] = [
    { num: 1, label: 'Select Entity', description: 'Choose the type of data to import' },
    { num: 2, label: 'Upload File', description: 'Upload your CSV or Excel file' },
    { num: 3, label: 'Validate', description: 'Review and fix validation errors' },
    { num: 4, label: 'Confirm', description: 'Confirm and complete import' },
  ]

  const documentSteps: Step[] = [
    { num: 1, label: 'Select Import', description: 'Choose student or staff documents bulk import' },
    { num: 2, label: 'Record Type & Class', description: 'Choose student or staff, and pick the class for student documents' },
    { num: 3, label: 'Upload ZIP', description: 'Upload ZIP and optional manifest reference file' },
    { num: 4, label: 'Review Rules', description: 'Review filename matching and manifest reference behavior' },
    { num: 5, label: 'Validate', description: 'Validate person matches, duplicates, and file issues' },
    { num: 6, label: 'Confirm', description: 'Attach validated documents to the right profiles' },
  ]

  const attendanceSteps: Step[] = [
    { num: 1, label: 'Select Entity', description: 'Choose student or staff attendance import' },
    { num: 2, label: 'Record Type & Class', description: 'Choose student or staff, the class for student attendance, and the academic year' },
    { num: 3, label: 'Upload File', description: 'Upload the full-year attendance register file' },
    { num: 4, label: 'Validate', description: 'Validate rows against the selected academic year' },
    { num: 5, label: 'Confirm', description: 'Post a full year of attendance records' },
  ]

  const steps = isDocumentImport ? documentSteps : isAttendanceImport ? attendanceSteps : isCombinedImport ? combinedSteps : dataSteps

  // Step numbers vary by flow. Only document imports retain their distinct Review Rules step.
  const hasRecordTypeClassStep = isCombinedImport || isDocumentImport || isAttendanceImport
  const stepRecordTypeClass = 2
  const stepUpload = hasRecordTypeClassStep ? 3 : 2
  const stepRules = isDocumentImport ? stepUpload + 1 : 0
  const stepValidate = isDocumentImport ? stepRules + 1 : stepUpload + 1
  const stepConfirm = stepValidate + 1

  // School classes offered when importing student profiles.
  const schoolClassOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']

  // Entity options configuration
  const entityOptions: EntityOption[] = [
    {
      value: 'student_staff',
      label: 'Student & Staff Records',
      description: 'Import student or staff profiles. For students, choose the class(es) being added first, then download the tailored template.',
      requiredFields: ['Student Name', 'Admission No', 'Class'],
      optionalFields: ['Section', 'Guardian Name', 'Date of Birth', 'Gender', 'Phone', 'Email', 'Address'],
      icon: '👨‍🎓',
    },
    {
      value: 'student_documents',
      label: 'Student & Staff Documents',
      description: 'Bulk upload student or staff documents using ZIP files, with ERP matching the person from filenames and using the manifest as a reference',
      requiredFields: ['Student Admission No / Employee ID', 'Document Type', 'Document File'],
      optionalFields: ['ZIP Manifest', 'Replace Strategy', 'Document Notes', 'Manual Person Resolution'],
      icon: '🗂️',
    },
    {
      value: 'attendance',
      label: 'Attendance Records',
      description: 'Back-fill student or staff attendance for a full previous academic year (Apr–Mar)',
      requiredFields: ['Student Admission No / Employee ID', 'Attendance Date', 'Attendance Status'],
      optionalFields: ['Student / Employee Name', 'Late Minutes', 'Shift', 'Overtime Hours', 'Remarks', 'Approved By'],
      icon: '📅',
    },
    {
      value: 'fee_structure',
      label: 'Fee Structures',
      description: 'Import fee configurations for different classes and categories',
      requiredFields: ['Class', 'Fee Type', 'Amount'],
      optionalFields: ['Due Date', 'Academic Year', 'Description', 'Late Fee', 'Installments'],
      icon: '💰',
    },
    {
      value: 'marks',
      label: 'Exam Marks',
      description: 'Import student examination marks, grades, and assessment data',
      requiredFields: ['Student Admission No', 'Subject', 'Exam Type', 'Max Marks', 'Obtained Marks'],
      optionalFields: ['Grade', 'Remarks', 'Examiner'],
      icon: '📝',
    },
    {
      value: 'inventory',
      label: 'Inventory Items',
      description: 'Import inventory and stock information for school assets',
      requiredFields: ['Item Name', 'Item Code', 'Category', 'Quantity'],
      optionalFields: ['Unit Price', 'Supplier', 'Location', 'Reorder Level', 'Last Updated'],
      icon: '📦',
    },
  ]

  const primaryEntityOptions = entityOptions.filter(
    (option) => option.value === 'student_staff' || option.value === 'student_documents' || option.value === 'attendance'
  )
  const secondaryEntityOptions = entityOptions.filter((option) => !primaryEntityOptions.some((primary) => primary.value === option.value))

  // ==================== UTILITY FUNCTIONS ====================

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`
    const seconds = Math.floor(ms / 1000)
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const getSelectedEntityInfo = (): EntityOption | undefined => entityOptions.find((entity) => entity.value === selectedEntity)

  const getActiveEntityFields = (): FieldOption[] => getEntityFields(getEntityTypeKey())

  const setDocumentValidationData = (rows: DocumentValidationRow[]) => {
    setDocumentValidationResults(rows)
    setDocumentValidationSummary(summarizeDocumentValidationResults(rows))
  }

  const attendancePeriodInfo = describePeriod(attendancePeriod)
  const attendancePeriodRange = getPeriodRange(attendancePeriod)

  const getAttendanceStatusDistribution = (rows: ValidationRow[]): Record<string, number> => {
    const statusIndex = columnMappings.find((mapping) => mapping.field === 'attendance_status')?.colIndex ?? -1
    if (statusIndex < 0) return {}

    const distribution: Record<string, number> = {}

    rows.forEach((row) => {
      const normalized = normalizeAttendanceStatus(row.rawData[statusIndex] || '')
      if (!normalized) return
      distribution[normalized] = (distribution[normalized] || 0) + 1
    })

    return distribution
  }

  // ==================== ENTITY SELECTION HANDLERS ====================

  const handleEntitySelect = (value: string) => {
    setSelectedEntity(value)

    if (value === 'attendance') {
      setAttendanceRecordType('student')
      setAttendancePeriod(getDefaultAttendancePeriod())
    }

    if (value === 'student_documents') {
      setDocumentRecordType('student')
    }

    if (value === 'student_staff') {
      setCombinedRecordType('student')
      setSelectedClasses([])
    }

    resetWizardState(false)
  }

  const resetWizardState = (resetEntity: boolean = true) => {
    if (resetEntity) {
      setSelectedEntity('')
    }

    setUploadedFile(null)
    setUploadedDocumentZip(null)
    setUploadedManifestFile(null)
    setUploadError('')
    setColumnMappings([])
    setValidationResults([])
    setValidationSummary({ valid: 0, errors: 0, warnings: 0, total: 0 })
    setValidationFilter('all')
    setValidationSearch('')
    setDocumentValidationResults([])
    setDocumentValidationSummary({ total: 0, ready: 0, importable: 0, studentNotFound: 0, duplicates: 0, invalidNames: 0 })
    setDocumentValidationFilter('all')
    setDocumentValidationSearch('')
    setDocumentResolutionDrafts({})
    setDocumentRecordType('student')
    setImportResult(null)
    setImportProgress(0)
    setEditingCell(null)
    setEditedRows(new Set())
    setShowPreviewModal(false)
    setPreviewRowData(null)
    setCombinedRecordType('student')
    setSelectedClasses([])
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (documentZipInputRef.current) documentZipInputRef.current.value = ''
    if (documentManifestInputRef.current) documentManifestInputRef.current.value = ''
  }

  // ==================== FILE UPLOAD HANDLERS ====================

  const validateFile = (file: File): { valid: boolean; error: string } => {
    const maxSize = 25 * 1024 * 1024
    if (file.size > maxSize) {
      return { valid: false, error: `File size (${formatFileSize(file.size)}) exceeds the maximum limit of 25MB.` }
    }

    const validTypes = ['.csv', '.xls', '.xlsx']
    const fileName = file.name.toLowerCase()
    const hasValidExtension = validTypes.some((ext) => fileName.endsWith(ext))
    if (!hasValidExtension) {
      return { valid: false, error: 'Invalid file type. Please upload CSV, XLS, or XLSX files only.' }
    }

    if (file.size === 0) {
      return { valid: false, error: 'The uploaded file is empty. Please select a valid file.' }
    }

    return { valid: true, error: '' }
  }

  const validateDocumentZipFile = (file: File): { valid: boolean; error: string } => {
    const maxSize = 100 * 1024 * 1024
    if (file.size > maxSize) {
      return { valid: false, error: `ZIP size (${formatFileSize(file.size)}) exceeds the maximum limit of 100MB.` }
    }

    if (!file.name.toLowerCase().endsWith('.zip')) {
      return { valid: false, error: 'Invalid file type. Please upload a ZIP archive containing documents.' }
    }

    if (file.size === 0) {
      return { valid: false, error: 'The uploaded ZIP is empty. Please select a valid archive.' }
    }

    return { valid: true, error: '' }
  }

  const buildColumnMappings = useCallback(
    (headers: string[], rows: string[][], entityTypeKey: string): ColumnMapping[] => {
      const autoMappings = autoMapColumns(headers, entityTypeKey)

      return headers.map((header, index) => {
        const col = String.fromCharCode(65 + index)
        const field = autoMappings[col] || 'ignore'
        const entityFields = getEntityFields(entityTypeKey)
        const fieldInfo = entityFields.find((fieldOption) => fieldOption.value === field)
        const sampleData = rows.slice(0, 3).map((row) => row[index] || '')

        return {
          col,
          colIndex: index,
          header,
          field,
          required: fieldInfo?.required || false,
          matched: field !== 'ignore',
          sampleData,
        }
      })
    },
    []
  )

  const processFile = useCallback(
    (file: File) => {
      if (!selectedEntity) {
        setUploadError('Please select an entity type first.')
        return
      }

      const validation = validateFile(file)
      if (!validation.valid) {
        setUploadError(validation.error)
        return
      }

      setIsProcessing(true)
      setProcessingMessage('Reading file contents...')
      setUploadError('')

      const entityTypeKey = getEntityTypeKey()

      setTimeout(() => {
        setProcessingMessage('Analyzing columns...')

        setTimeout(() => {
          setProcessingMessage(isAttendanceImport ? 'Preparing attendance preview...' : 'Preparing data preview...')

          setTimeout(() => {
            const mockData = generateMockFileData(entityTypeKey)

            const uploadedFileData: UploadedFile = {
              name: file.name,
              size: file.size,
              type: file.type || `application/${file.name.split('.').pop()}`,
              lastModified: file.lastModified,
              headers: mockData.headers,
              rows: mockData.rows,
              totalRows: mockData.rows.length,
            }

            setUploadedFile(uploadedFileData)
            setColumnMappings(buildColumnMappings(mockData.headers, mockData.rows, entityTypeKey))
            setIsProcessing(false)
            setProcessingMessage('')
          }, 500)
        }, 500)
      }, 500)
    },
    [selectedEntity, isAttendanceImport, attendanceEntityKey, buildColumnMappings, isCombinedImport, combinedRecordType]
  )

  const processDocumentZipFile = useCallback((file: File) => {
    const validation = validateDocumentZipFile(file)
    if (!validation.valid) {
      setUploadError(validation.error)
      return
    }

    setIsProcessing(true)
    setProcessingMessage('Scanning ZIP archive...')
    setUploadError('')

    setTimeout(() => {
      setProcessingMessage('Reading document filenames...')
      setTimeout(() => {
        setProcessingMessage('Preparing bulk document preview...')
        setTimeout(() => {
          const zipFiles = documentRecordType === 'staff' ? mockStaffDocumentZipFiles : mockStudentDocumentZipFiles
          setUploadedDocumentZip({
            name: file.name,
            size: file.size,
            type: file.type || 'application/zip',
            lastModified: file.lastModified,
            totalFiles: zipFiles.length,
          })
          setDocumentValidationData([])
          setIsProcessing(false)
          setProcessingMessage('')
        }, 500)
      }, 500)
    }, 500)
  }, [documentRecordType])

  const handleFileSelect = useCallback(
    (file: File) => {
      processFile(file)
    },
    [processFile]
  )

  const handleDocumentZipSelect = useCallback(
    (file: File) => {
      processDocumentZipFile(file)
    },
    [processDocumentZipFile]
  )

  const handleDocumentManifestSelect = useCallback((file: File) => {
    const validation = validateFile(file)
    if (!validation.valid) {
      setUploadError(`Manifest: ${validation.error}`)
      return
    }

    setUploadError('')
    setUploadedManifestFile({
      name: file.name,
      size: file.size,
      type: file.type || `application/${file.name.split('.').pop()}`,
      lastModified: file.lastModified,
    })
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const files = e.dataTransfer.files
      if (files.length > 0) {
        if (isDocumentImport) {
          handleDocumentZipSelect(files[0])
        } else {
          handleFileSelect(files[0])
        }
      }
    },
    [handleDocumentZipSelect, handleFileSelect, isDocumentImport]
  )

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDocumentZipInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleDocumentZipSelect(files[0])
    }
  }

  const handleDocumentManifestInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleDocumentManifestSelect(files[0])
    }
  }

  const handleRemoveFile = () => {
    setUploadedFile(null)
    setUploadError('')
    setColumnMappings([])
    setValidationResults([])
    setValidationSummary({ valid: 0, errors: 0, warnings: 0, total: 0 })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveDocumentZip = () => {
    setUploadedDocumentZip(null)
    setDocumentValidationData([])
    setDocumentResolutionDrafts({})
    setUploadError('')
    if (documentZipInputRef.current) {
      documentZipInputRef.current.value = ''
    }
  }

  const handleRemoveDocumentManifest = () => {
    setUploadedManifestFile(null)
    setUploadError('')
    if (documentManifestInputRef.current) {
      documentManifestInputRef.current.value = ''
    }
  }

  const handleClickUpload = () => {
    fileInputRef.current?.click()
  }

  const handleClickDocumentZipUpload = () => {
    documentZipInputRef.current?.click()
  }

  const handleClickManifestUpload = () => {
    documentManifestInputRef.current?.click()
  }

  // ==================== ATTENDANCE PERIOD HANDLERS ====================

  const handleAttendanceRecordTypeChange = (recordType: AttendanceRecordType) => {
    if (recordType === attendanceRecordType) return

    setAttendanceRecordType(recordType)
    // Staff registers are not class-scoped, so clear any selected class.
    if (recordType === 'staff') setSelectedClasses([])
    // Rebuild the parsed file and its automatic column detection for the new record type.
    setUploadedFile(null)
    setColumnMappings([])
    setValidationResults([])
    setValidationSummary({ valid: 0, errors: 0, warnings: 0, total: 0 })
    setUploadError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handlePeriodSessionChange = (value: string) => {
    const sessionStartYear = Number(value)
    if (!sessionStartYear) return

    setAttendancePeriod((prev) => ({ ...prev, sessionStartYear }))
  }

  // ==================== COMBINED (STUDENT & STAFF) HANDLERS ====================

  const handleCombinedRecordTypeChange = (recordType: 'student' | 'employee') => {
    if (recordType === combinedRecordType) return

    setCombinedRecordType(recordType)
    // Student and staff profiles have different columns, so automatic detection and validation are rebuilt on switch.
    setUploadedFile(null)
    setColumnMappings([])
    setValidationResults([])
    setValidationSummary({ valid: 0, errors: 0, warnings: 0, total: 0 })
    setValidationFilter('all')
    setValidationSearch('')
    setUploadError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleClassToggle = (classValue: string) => {
    // Attendance registers belong to a single class, so the toggle is single-select there.
    // Combined records and documents allow multiple classes at once.
    if (isAttendanceImport) {
      setSelectedClasses([classValue])
      return
    }
    setSelectedClasses((prev) => (prev.includes(classValue) ? prev.filter((item) => item !== classValue) : [...prev, classValue]))
  }

  const handleSelectAllClasses = () => {
    if (isAttendanceImport) {
      // Only a single class can back a register, so keep the current selection.
      return
    }
    setSelectedClasses([...schoolClassOptions])
  }

  const handleClearClasses = () => {
    setSelectedClasses([])
  }

  // ==================== VALIDATION HANDLERS ====================

  const runValidation = useCallback(() => {
    if (!uploadedFile || !selectedEntity) return

    setIsProcessing(true)
    setProcessingMessage(isAttendanceImport ? `Validating attendance for ${attendancePeriodInfo.label}...` : 'Validating data...')
    setValidationResults([])

    const startTime = Date.now()

    setTimeout(() => {
      const seenIds = new Set<string>()
      const seenAttendanceKeys = new Set<string>()
      const entityTypeKey = getEntityTypeKey()
      const entityFields = getEntityFields(entityTypeKey)
      const mappedFieldNames = columnMappings.filter((mapping) => mapping.field !== 'ignore').map((mapping) => mapping.field)
      const unmappedRequiredFields = entityFields.filter((field) => field.required && !mappedFieldNames.includes(field.value))
      const duplicateMappedFields = Array.from(new Set(mappedFieldNames.filter((field, index) => mappedFieldNames.indexOf(field) !== index)))

      const dateMapping = columnMappings.find((mapping) => mapping.field === 'attendance_date')
      const statusMapping = columnMappings.find((mapping) => mapping.field === 'attendance_status')
      const studentIdMapping = columnMappings.find((mapping) => mapping.field === 'admission_no')
      const staffIdMapping = columnMappings.find((mapping) => mapping.field === 'employee_id')

      const results: ValidationRow[] = uploadedFile.rows.map((row, index) => {
        const rowData = row.join(', ')
        const fieldErrors: { field: string; message: string; value: string }[] = []
        let status: 'valid' | 'error' | 'warning' = 'valid'
        let primaryError = ''

        unmappedRequiredFields.forEach((field) => {
          fieldErrors.push({ field: field.label, message: `Required field "${field.label}" was not detected in the uploaded headers`, value: '' })
          status = 'error'
          if (!primaryError) primaryError = `Missing ${field.label} column`
        })
        duplicateMappedFields.forEach((fieldValue) => {
          const fieldLabel = entityFields.find((field) => field.value === fieldValue)?.label || fieldValue
          fieldErrors.push({ field: fieldLabel, message: `More than one uploaded column was auto-mapped to "${fieldLabel}"`, value: '' })
          status = 'error'
          if (!primaryError) primaryError = `Ambiguous mapping for ${fieldLabel}`
        })

        columnMappings.forEach((mapping) => {
          if (mapping.field !== 'ignore') {
            const value = row[mapping.colIndex]?.trim() || ''
            const fieldInfo = entityFields.find((fieldOption) => fieldOption.value === mapping.field)

            if (fieldInfo?.required && !value) {
              fieldErrors.push({
                field: mapping.header,
                message: `Required field "${mapping.header}" is empty`,
                value,
              })
              status = 'error'
              if (!primaryError) primaryError = `Missing ${mapping.header}`
            }

            if (value && fieldInfo) {
              switch (fieldInfo.type) {
                case 'email':
                  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    fieldErrors.push({
                      field: mapping.header,
                      message: `Invalid email format: "${value}"`,
                      value,
                    })
                    if (status === 'valid') status = 'warning'
                  }
                  break

                case 'phone': {
                  const phoneDigits = value.replace(/[\s\-\(\)]/g, '')
                  if (!/^\d{10,12}$/.test(phoneDigits)) {
                    fieldErrors.push({
                      field: mapping.header,
                      message: `Invalid phone number: "${value}" (expected 10-12 digits)`,
                      value,
                    })
                    if (status === 'valid') status = 'warning'
                  }
                  break
                }

                case 'number': {
                  const numValue = parseFloat(value)
                  if (isNaN(numValue)) {
                    fieldErrors.push({
                      field: mapping.header,
                      message: `Invalid number format: "${value}"`,
                      value,
                    })
                    status = 'error'
                    if (!primaryError) primaryError = `Invalid ${mapping.header}`
                  } else if (numValue < 0 && ['quantity', 'salary', 'amount', 'unit_price', 'late_minutes', 'overtime_hours'].includes(mapping.field)) {
                    fieldErrors.push({
                      field: mapping.header,
                      message: `Negative value not allowed: "${value}"`,
                      value,
                    })
                    status = 'error'
                    if (!primaryError) primaryError = `Negative ${mapping.header}`
                  }
                  break
                }

                case 'date': {
                  const parsedDate = parseDateValue(value)
                  if (!parsedDate.valid) {
                    fieldErrors.push({
                      field: mapping.header,
                      message: `Invalid date format: "${value}" (expected YYYY-MM-DD or DD/MM/YYYY)`,
                      value,
                    })
                    status = 'error'
                    if (!primaryError) primaryError = `Invalid ${mapping.header}`
                  } else if (isAttendanceImport && mapping.field === 'attendance_date' && !isDateWithinRange(parsedDate.iso, attendancePeriodRange)) {
                    fieldErrors.push({
                      field: mapping.header,
                      message: `Date ${parsedDate.iso} is outside the selected period (${attendancePeriodInfo.range})`,
                      value,
                    })
                    status = 'error'
                    if (!primaryError) primaryError = `Date outside ${attendancePeriodInfo.label}`
                  }
                  break
                }
              }
            }
          }
        })

        // ---------- Attendance specific checks (student + staff) ----------
        if (isAttendanceImport) {
          const personIdMapping = attendanceRecordType === 'staff' ? staffIdMapping : studentIdMapping
          const personLabel = attendanceRecordType === 'staff' ? 'Employee ID' : 'Admission No'
          const directory =
            attendanceRecordType === 'staff' ? mockAttendanceEmployeeDirectory : mockAttendanceStudentDirectory

          if (personIdMapping) {
            const personId = (row[personIdMapping.colIndex] || '').trim()

            if (personId && !directory[personId.toUpperCase()]) {
              fieldErrors.push({
                field: personIdMapping.header,
                message: `${personLabel} "${personId}" does not exist in the ${attendanceRecordType === 'staff' ? 'staff' : 'student'} directory`,
                value: personId,
              })
              status = 'error'
              if (!primaryError) primaryError = `${personLabel} not found`
            }
          }

          if (statusMapping) {
            const rawStatus = (row[statusMapping.colIndex] || '').trim()

            if (rawStatus) {
              const normalizedStatus = normalizeAttendanceStatus(rawStatus)

              if (!normalizedStatus) {
                fieldErrors.push({
                  field: statusMapping.header,
                  message: `Unknown attendance status "${rawStatus}". Allowed: ${ATTENDANCE_STATUS_VALUES.join(', ')}`,
                  value: rawStatus,
                })
                status = 'error'
                if (!primaryError) primaryError = 'Invalid attendance status'
              } else if (['Half Day', 'Late'].includes(normalizedStatus)) {
                fieldErrors.push({
                  field: statusMapping.header,
                  message: `"${normalizedStatus}" is counted as partial attendance and will be imported with a review flag`,
                  value: rawStatus,
                })
                if (status === 'valid') status = 'warning'
              }
            }
          }

          if (personIdMapping && dateMapping && statusMapping) {
            const personId = (row[personIdMapping.colIndex] || '').trim()
            const parsedDate = parseDateValue(row[dateMapping.colIndex] || '')
            const rawStatus = (row[statusMapping.colIndex] || '').trim()

            if (personId && parsedDate.valid && rawStatus) {
              const attendanceKey = `${personId.toUpperCase()}|${parsedDate.iso}`

              if (seenAttendanceKeys.has(attendanceKey)) {
                fieldErrors.push({
                  field: dateMapping.header,
                  message: `Duplicate attendance entry for ${personId} on ${parsedDate.iso}`,
                  value: parsedDate.iso,
                })
                status = 'error'
                if (!primaryError) primaryError = 'Duplicate attendance entry'
              } else {
                seenAttendanceKeys.add(attendanceKey)
              }
            }
          }
        }

        const idFields = ['admission_no', 'employee_id', 'item_code']
        const idMapping = columnMappings.find((mapping) => idFields.includes(mapping.field))

        // Attendance rows are uniquely keyed on person + date, so the plain
        // "same ID twice" rule must not be applied there.
        if (idMapping && !isAttendanceImport) {
          const currentId = row[idMapping.colIndex]?.trim()
          if (currentId) {
            if (seenIds.has(currentId.toLowerCase())) {
              status = 'error'
              primaryError = 'Duplicate entry'
              fieldErrors.push({
                field: idMapping.header,
                message: `Duplicate ID found: "${currentId}" already exists in file`,
                value: currentId,
              })
            } else {
              seenIds.add(currentId.toLowerCase())
            }
          }
        }

        if (selectedEntity === 'marks') {
          const maxMarksMapping = columnMappings.find((mapping) => mapping.field === 'max_marks')
          const obtainedMarksMapping = columnMappings.find((mapping) => mapping.field === 'obtained_marks')

          if (maxMarksMapping && obtainedMarksMapping) {
            const maxMarks = parseFloat(row[maxMarksMapping.colIndex])
            const obtainedMarks = parseFloat(row[obtainedMarksMapping.colIndex])

            if (!isNaN(maxMarks) && !isNaN(obtainedMarks) && obtainedMarks > maxMarks) {
              status = 'error'
              primaryError = 'Marks exceed maximum'
              fieldErrors.push({
                field: 'Obtained Marks',
                message: `Obtained marks (${obtainedMarks}) exceed maximum marks (${maxMarks})`,
                value: String(obtainedMarks),
              })
            }
          }
        }

        return {
          row: index + 1,
          status,
          data: rowData,
          rawData: [...row],
          error: primaryError,
          fieldErrors,
          isEdited: editedRows.has(index),
          originalData: [...row],
        }
      })

      const summary = {
        valid: results.filter((result) => result.status === 'valid').length,
        errors: results.filter((result) => result.status === 'error').length,
        warnings: results.filter((result) => result.status === 'warning').length,
        total: results.length,
      }

      setValidationResults(results)
      setValidationSummary(summary)
      setIsProcessing(false)
      setProcessingMessage('')

      console.log(`Validation completed in ${Date.now() - startTime}ms`)
    }, 1500)
  }, [
    uploadedFile,
    selectedEntity,
    columnMappings,
    editedRows,
    isAttendanceImport,
    attendanceEntityKey,
    attendanceRecordType,
    attendancePeriodRange,
    attendancePeriodInfo.label,
    attendancePeriodInfo.range,
    isCombinedImport,
    combinedRecordType,
  ])

  const runDocumentValidation = useCallback(() => {
    if (!uploadedDocumentZip) return

    const personLabel = documentRecordType === 'staff' ? 'employees' : 'students'
    setIsProcessing(true)
    setProcessingMessage(
      uploadedManifestFile ? 'Parsing filenames and cross-checking manifest reference...' : `Parsing filenames and matching ${personLabel}...`
    )
    setDocumentValidationResults([])

    setTimeout(() => {
      const rows = buildMockDocumentValidationRows(documentRecordType, !!uploadedManifestFile)
      setDocumentValidationData(rows)
      setDocumentResolutionDrafts({})
      setIsProcessing(false)
      setProcessingMessage('')
    }, 1400)
  }, [uploadedDocumentZip, uploadedManifestFile, documentRecordType])

  const getFilteredValidationResults = (): ValidationRow[] => {
    let filtered = validationResults

    if (validationFilter !== 'all') {
      filtered = filtered.filter((result) => result.status === validationFilter)
    }

    if (validationSearch.trim()) {
      const search = validationSearch.toLowerCase()
      filtered = filtered.filter(
        (result) =>
          result.data.toLowerCase().includes(search) ||
          result.error.toLowerCase().includes(search) ||
          String(result.row).includes(search)
      )
    }

    return filtered
  }

  const getFilteredDocumentValidationResults = (): DocumentValidationRow[] => {
    let filtered = documentValidationResults

    if (documentValidationFilter !== 'all') {
      filtered = filtered.filter((row) => row.status === documentValidationFilter)
    }

    if (documentValidationSearch.trim()) {
      const search = documentValidationSearch.toLowerCase()
      filtered = filtered.filter(
        (row) =>
          row.fileName.toLowerCase().includes(search) ||
          row.admissionNo.toLowerCase().includes(search) ||
          row.studentName.toLowerCase().includes(search) ||
          row.documentType.toLowerCase().includes(search) ||
          row.issue.toLowerCase().includes(search)
      )
    }

    return filtered
  }

  const handleDocumentResolutionChange = (rowId: string, resolution: DocumentResolution) => {
    const nextRows = documentValidationResults.map((row) =>
      row.id === rowId
        ? {
            ...row,
            resolution,
          }
        : row
    )
    setDocumentValidationData(nextRows)
  }

  const handleDocumentResolutionDraftChange = (rowId: string, value: string) => {
    setDocumentResolutionDrafts((prev) => ({
      ...prev,
      [rowId]: value,
    }))
  }

  const handleApplyResolvedStudent = (rowId: string) => {
    const isStaff = documentRecordType === 'staff'
    const directory = isStaff ? mockEmployeeDocDirectory : mockStudentDirectory
    const idLabel = isStaff ? 'Employee ID' : 'Admission No.'

    const enteredId = (documentResolutionDrafts[rowId] || '').trim().toUpperCase()
    if (!enteredId) return

    const personName = directory[enteredId]
    if (!personName) {
      setUploadError(`${idLabel} ${enteredId} does not exist in the demo ${isStaff ? 'staff' : 'student'} directory.`)
      return
    }

    setUploadError('')

    const currentRow = documentValidationResults.find((row) => row.id === rowId)
    if (!currentRow) return

    const wouldDuplicate = documentValidationResults.some(
      (row) => row.id !== rowId && row.admissionNo === enteredId && row.documentType === currentRow.documentType && row.status !== 'invalid_name'
    )

    const nextRows = documentValidationResults.map((row) => {
      if (row.id !== rowId) return row

      if (wouldDuplicate) {
        return {
          ...row,
          admissionNo: enteredId,
          studentName: personName,
          status: 'duplicate' as const,
          issue: `Resolved ${isStaff ? 'employee' : 'student'}, but ${currentRow.documentType} already exists for ${enteredId} in this upload`,
          resolution: 'keep_existing' as const,
          matchedBy: 'manual' as const,
          resolvedAdmissionNo: enteredId,
        }
      }

      return {
        ...row,
        admissionNo: enteredId,
        studentName: personName,
        status: 'ready' as const,
        issue: `Resolved manually to ${enteredId}`,
        resolution: 'attach' as const,
        matchedBy: 'manual' as const,
        resolvedAdmissionNo: enteredId,
      }
    })

    setDocumentValidationData(nextRows)
  }

  const handleDocumentRecordTypeChange = (recordType: DocumentRecordType) => {
    if (recordType === documentRecordType) return

    setDocumentRecordType(recordType)
    // Staff documents are not class-scoped, so clear any selected class.
    if (recordType === 'staff') setSelectedClasses([])
    // Student and staff document matching use different ID prefixes and directories,
    // so the uploaded ZIP, manifest and any validation results are cleared on switch.
    setUploadedDocumentZip(null)
    setUploadedManifestFile(null)
    setDocumentValidationData([])
    setDocumentResolutionDrafts({})
    setUploadError('')
    if (documentZipInputRef.current) documentZipInputRef.current.value = ''
    if (documentManifestInputRef.current) documentManifestInputRef.current.value = ''
  }

  // ==================== ROW EDITING HANDLERS ====================

  const handleStartEdit = (rowIndex: number, colIndex: number, currentValue: string) => {
    setEditingCell({
      rowIndex,
      colIndex,
      value: currentValue,
    })
  }

  const handleEditChange = (value: string) => {
    if (editingCell) {
      setEditingCell({
        ...editingCell,
        value,
      })
    }
  }

  const handleSaveEdit = () => {
    if (!editingCell || !uploadedFile) return

    const newRows = [...uploadedFile.rows]
    newRows[editingCell.rowIndex] = [...newRows[editingCell.rowIndex]]
    newRows[editingCell.rowIndex][editingCell.colIndex] = editingCell.value

    setUploadedFile({
      ...uploadedFile,
      rows: newRows,
    })

    setEditedRows((prev) => new Set([...prev, editingCell.rowIndex]))

    if (validationResults.length > 0) {
      setValidationResults((prev) =>
        prev.map((result) => {
          if (result.row === editingCell.rowIndex + 1) {
            const newRawData = [...result.rawData]
            newRawData[editingCell.colIndex] = editingCell.value
            return {
              ...result,
              rawData: newRawData,
              data: newRawData.join(', '),
              isEdited: true,
            }
          }
          return result
        })
      )
    }

    setEditingCell(null)
  }

  const handleCancelEdit = () => {
    setEditingCell(null)
  }

  const handleDeleteRow = (rowIndex: number) => {
    if (!uploadedFile) return

    const newRows = uploadedFile.rows.filter((_, index) => index !== rowIndex)

    setUploadedFile({
      ...uploadedFile,
      rows: newRows,
      totalRows: newRows.length,
    })

    setValidationResults((prev) =>
      prev
        .filter((result) => result.row !== rowIndex + 1)
        .map((result) => ({
          ...result,
          row: result.row > rowIndex + 1 ? result.row - 1 : result.row,
        }))
    )

    setValidationSummary((prev) => ({
      ...prev,
      total: Math.max(prev.total - 1, 0),
    }))
  }

  // ==================== PREVIEW MODAL HANDLERS ====================

  const handleOpenPreview = (result: ValidationRow) => {
    setPreviewRowData(result)
    setShowPreviewModal(true)
  }

  const handleClosePreview = () => {
    setShowPreviewModal(false)
    setPreviewRowData(null)
  }

  // ==================== IMPORT HANDLERS ====================

  const handleStartImport = () => {
    const startTime = Date.now()
    setIsProcessing(true)
    setImportProgress(0)

    let currentProgress = 0
    const progressInterval = setInterval(() => {
      currentProgress += Math.random() * 10 + 5
      if (currentProgress >= 100) {
        currentProgress = 100
        clearInterval(progressInterval)
      }
      setImportProgress(currentProgress)
    }, 200)

    setTimeout(() => {
      clearInterval(progressInterval)
      setImportProgress(100)

      const importId = generateImportId()
      const duration = Date.now() - startTime
      const selectedEntityInfo = getSelectedEntityInfo()
      let result: ImportResult
      let fileName = 'Unknown'
      let status: 'completed' | 'partial' | 'failed' = 'completed'
      let importedCountForHistory = 0
      let skippedCountForHistory = 0

      if (isDocumentImport) {
        const importableRows = documentValidationResults.filter(
          (row) => row.status === 'ready' || (row.status === 'duplicate' && ['replace_existing', 'keep_both'].includes(row.resolution))
        )
        const warningRows = importableRows.filter(
          (row) => row.matchedBy === 'manual' || (row.status === 'duplicate' && ['replace_existing', 'keep_both'].includes(row.resolution))
        )
        const skippedRows = documentValidationResults.filter(
          (row) => !importableRows.some((importable) => importable.id === row.id)
        )

        result = {
          success: importableRows.length > 0,
          importedCount: importableRows.length - warningRows.length,
          warningCount: warningRows.length,
          skippedCount: skippedRows.length,
          errors: skippedRows.map((row) => ({ fileName: row.fileName, error: row.issue })),
          timestamp: new Date(),
          importId,
          duration,
        }

        fileName = uploadedDocumentZip?.name || `${documentRecordType === 'staff' ? 'Staff' : 'Student'}_Documents.zip`
        importedCountForHistory = importableRows.length
        skippedCountForHistory = skippedRows.length
        status = skippedRows.length === 0 ? 'completed' : importableRows.length > 0 ? 'partial' : 'failed'
      } else {
        const validRows = validationResults.filter((row) => row.status === 'valid' || row.status === 'warning')
        result = {
          success: true,
          importedCount: validRows.filter((row) => row.status === 'valid').length,
          warningCount: validRows.filter((row) => row.status === 'warning').length,
          skippedCount: validationResults.filter((row) => row.status === 'error').length,
          errors: validationResults.filter((row) => row.status === 'error').map((row) => ({ row: row.row, error: row.error })),
          timestamp: new Date(),
          importId,
          duration,
        }

        if (isAttendanceImport) {
          result.periodSummary = {
            label: attendancePeriodInfo.label,
            range: attendancePeriodInfo.range,
            recordType: attendanceRecordType === 'staff' ? 'Staff Attendance' : 'Student Attendance',
          }
        }

        fileName = uploadedFile?.name || 'Unknown'
        importedCountForHistory = result.importedCount + result.warningCount
        skippedCountForHistory = result.skippedCount
        status = result.skippedCount === 0 ? 'completed' : result.importedCount > 0 ? 'partial' : 'failed'
      }

      const historyItem: ImportHistoryItem = {
        id: importId,
        entityType: selectedEntity,
        entityLabel: selectedEntityInfo?.label || selectedEntity,
        fileName,
        importedCount: importedCountForHistory,
        skippedCount: skippedCountForHistory,
        timestamp: result.timestamp,
        status,
        user: 'Current User',
        periodLabel: isAttendanceImport ? `${attendancePeriodInfo.label} (${attendanceRecordType === 'staff' ? 'Staff' : 'Student'})` : undefined,
      }

      setImportHistory((prev) => [historyItem, ...prev])
      setImportResult(result)
      setIsProcessing(false)
    }, 3000)
  }

  // ==================== DOWNLOAD HANDLERS ====================

  const downloadBlob = (content: BlobPart, fileName: string, type: string) => {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const buildAttendanceTemplate = (recordType: AttendanceRecordType, periodLabel: string): string => {
    const rows = recordType === 'staff' ? generateMockFileData('attendance_staff').rows : generateMockFileData('attendance_student').rows
    const headers = getEntityFields(recordType === 'staff' ? 'attendance_staff' : 'attendance_student')
      .filter((field) => field.value !== 'ignore')
      .map((field) => (field.required ? `${field.label}*` : field.label))

    const sampleRows = rows.slice(0, 3).map((row) => row.map((cell) => (cell.includes(',') ? `"${cell}"` : cell)).join(','))

    return [
      `# Attendance import template - ${recordType === 'staff' ? 'Staff' : 'Student'} records`,
      `# Fill this register for the period you are back-filling (example shown: ${periodLabel}).`,
      `# Allowed attendance status values: ${ATTENDANCE_STATUS_VALUES.join(', ')}`,
      headers.join(','),
      ...sampleRows,
    ].join('\n')
  }

  const handleDownloadTemplate = (entityType?: string) => {
    const targetEntity = entityType || selectedEntity

    if (!targetEntity || targetEntity === 'student_documents') {
      let content = 'DATA IMPORT TEMPLATES\n'
      content += '='.repeat(50) + '\n\n'

      entityOptions
        .filter((option) => option.value !== 'student_documents')
        .forEach((option) => {
          const optionKey = option.value === 'attendance' ? 'attendance_student' : option.value
          const fields = getEntityFields(optionKey)
          content += `${option.label}\n`
          content += '-'.repeat(30) + '\n'
          content += 'Required: ' + fields.filter((field) => field.required).map((field) => field.label).join(', ') + '\n'
          content += 'Optional: ' + fields.filter((field) => !field.required && field.value !== 'ignore').map((field) => field.label).join(', ') + '\n\n'
        })

      downloadBlob(content, 'import_templates_info.txt', 'text/plain')
      return
    }

    if (targetEntity === 'attendance') {
      const recordType: AttendanceRecordType = attendanceRecordType
      downloadBlob(
        buildAttendanceTemplate(recordType, attendancePeriodInfo.label),
        `${recordType}_attendance_import_template.csv`,
        'text/csv'
      )
      return
    }

    const entityKey = isCombinedImport ? combinedRecordType : targetEntity
    const entityFields = getEntityFields(entityKey)
    const headers = entityFields
      .filter((field) => field.value !== 'ignore')
      .map((field) => (field.required ? `${field.label}*` : field.label))
      .join(',')

    // For combined student imports, show the selected class(es) in the template header and
    // fill the Class column with them in the sample rows.
    if (isCombinedImport && combinedRecordType === 'student') {
      const classComment = selectedClasses.length
        ? `# Classes being added: ${selectedClasses.join(', ')}\n# Fill this template for the selected class(es). The class column below shows them.`
        : '# No class selected yet. Go back to the "Record Type & Class" step and choose class(es).'

      const mockData = generateMockFileData('student')
      const sampleRows = mockData.rows.slice(0, 3).map((row) => [...row])
      const classIndex = mockData.headers.findIndex((header) => /^class$/i.test(header.trim()))
      if (classIndex >= 0 && selectedClasses.length > 0) {
        sampleRows.forEach((row, index) => {
          row[classIndex] = selectedClasses[index % selectedClasses.length]
        })
      }

      const sampleContent = sampleRows.map((row) => row.map((cell) => (cell.includes(',') ? `"${cell}"` : cell)).join(',')).join('\n')
      downloadBlob(`${classComment}\n${headers}\n${sampleContent}\n`, `student_import_template.csv`, 'text/csv')
      return
    }

    downloadBlob(`${headers}\n`, `${entityKey}_import_template.csv`, 'text/csv')
  }

  const handleDownloadSampleData = () => {
    if (!selectedEntity || isDocumentImport) return

    const entityTypeKey = getEntityTypeKey()
    const mockData = generateMockFileData(entityTypeKey)
    const rows = mockData.rows.slice(0, 5).map((row) => [...row])

    // For combined student imports, fill the Class column with the selected class(es).
    if (isCombinedImport && combinedRecordType === 'student' && selectedClasses.length > 0) {
      const classIndex = mockData.headers.findIndex((header) => /^class$/i.test(header.trim()))
      if (classIndex >= 0) {
        rows.forEach((row, index) => {
          row[classIndex] = selectedClasses[index % selectedClasses.length]
        })
      }
    }

    const csvContent = [mockData.headers.join(','), ...rows.map((row) => row.map((cell) => (cell.includes(',') ? `"${cell}"` : cell)).join(','))].join(
      '\n'
    )

    const suffix = isAttendanceImport ? `${attendanceRecordType}_attendance` : entityTypeKey
    downloadBlob(csvContent, `${suffix}_sample_data.csv`, 'text/csv')
  }

  const handleDownloadDocumentInstructions = () => {
    const isStaff = documentRecordType === 'staff'
    const personTitle = isStaff ? 'Employee' : 'Student'
    const idLabel = isStaff ? 'Employee ID' : 'Admission No.'
    const prefix = isStaff ? 'EMP' : 'STU'

    const content = [
      `${(isStaff ? 'STAFF' : 'STUDENT')} DOCUMENT BULK IMPORT INSTRUCTIONS`,
      '='.repeat(60),
      '',
      'WORKFLOW',
      '1. Download these instructions and optional manifest template.',
      `2. Prepare document files using the naming pattern ${idLabel}_DocumentType.ext.`,
      '3. Zip all files into a single archive.',
      '4. Upload the ZIP and optionally upload the manifest as a reference file.',
      `5. ERP reads the filename, matches the ${personTitle.toLowerCase()} ${isStaff ? 'employee id' : 'admission number'}, and cross-checks with the manifest when available.`,
      '6. Validate results before import.',
      '',
      'FILENAME EXAMPLES',
      `- ${prefix}001_Aadhaar.pdf`,
      `- ${prefix}001_Birth_Certificate.pdf`,
      `- ${prefix}001_Photo.jpg`,
      `- ${prefix}002_${isStaff ? 'Appointment_Letter' : 'Transfer_Certificate'}.pdf`,
      '',
      'MANIFEST REFERENCE',
      `Columns: ${isStaff ? 'Employee ID' : 'Student ID'}, Document Type, File Name`,
      'The manifest is used as a reference/check against the filename-based match.',
      '',
      'SUPPORTED FILE TYPES',
      '- PDF',
      '- JPG / JPEG',
      '- PNG',
      '- DOC / DOCX',
      '',
      'VALIDATION RULES',
      `- ${idLabel} must exist in the ${isStaff ? 'staff' : 'school'} records.`,
      `- Do not guess ${isStaff ? 'employees' : 'students'} using names or fuzzy matching.`,
      '- Duplicate document types should be reviewed before import.',
      '- Invalid filename formats should be fixed or skipped.',
      '- If manifest details conflict with the filename, the file should be reviewed before import.',
      '',
      'RECOMMENDATION',
      `Use one active document per type (Aadhaar, Birth Certificate, ${isStaff ? 'Appointment Letter, ID Proof' : 'Transfer Certificate'}, etc.) with optional history/versioning.`,
    ].join('\n')

    downloadBlob(content, `${isStaff ? 'staff' : 'student'}_documents_instructions.txt`, 'text/plain')
  }

  const handleDownloadDocumentManifestTemplate = () => {
    const isStaff = documentRecordType === 'staff'
    const prefix = isStaff ? 'EMP' : 'STU'

    // Staff documents: a general employee manifest, no class needed.
    if (isStaff) {
      const idLabel = 'Employee ID'
      const doc1 = 'Appointment Letter'
      const doc2 = 'ID Proof'
      const content = [
        `${idLabel},Document Type,File Name`,
        `${prefix}001,${doc1},${prefix}001_${doc1.replace(/ /g, '_')}.pdf`,
        `${prefix}001,${doc2},${prefix}001_${doc2.replace(/ /g, '_')}.pdf`,
        `${prefix}001,Photo,${prefix}001_Photo.jpg`,
        `${prefix}002,${doc1},${prefix}002_${doc1.replace(/ /g, '_')}.pdf`,
        `${prefix}002,Photo,${prefix}002_Photo.jpg`,
      ].join('\n')
      downloadBlob(content, 'staff_documents_manifest_template.csv', 'text/csv')
      return
    }

    // Student documents: pre-fill the manifest with the selected class(es), one
    // row per common document type, so the admin only adds filenames.
    const docTypes = ['Aadhaar', 'Birth Certificate', 'Photo']
    const classes = selectedClasses.length ? selectedClasses : ['ALL']
    const people = selectedClasses.length
      ? classes.flatMap((cls) => getDocumentClassStudents(cls))
      : Object.entries(mockStudentDirectory).map(([id, name]) => ({ id, name }))

    const lines = ['Student ID,Document Type,File Name']
    people.forEach((student) => {
      docTypes.forEach((docType) => {
        lines.push(`${student.id},${docType},${student.id}_${docType.replace(/ /g, '_')}.pdf`)
      })
    })

    const suffix = selectedClasses.length ? `class_${selectedClasses.join('_')}` : 'all'
    downloadBlob(lines.join('\n'), `student_documents_manifest_template_${suffix}.csv`, 'text/csv')
  }

  const handleDownloadAttendanceRegister = () => {
    const isStaff = attendanceRecordType === 'staff'
    const periodLabel = attendancePeriodInfo.label
    const sessionStartYear = attendancePeriod.sessionStartYear

    // The register covers the WHOLE session (April -> March). Each student gets one
    // row per month, with a column for each day, so a teacher can mark a full year.
    const sessionMonths: { name: string; days: number }[] = []
    for (let month = 3; month < 15; month += 1) {
      const monthIndex = month % 12
      const year = sessionStartYear + (month >= 12 ? 1 : 0)
      sessionMonths.push({
        name: MONTH_NAMES[monthIndex],
        days: daysInMonth(year, monthIndex + 1),
      })
    }

    const people = isStaff
      ? Object.entries(mockAttendanceEmployeeDirectory).map(([id, name]) => ({ id, name }))
      : getAttendanceClassStudents(selectedClasses[0] || '1')

    const idLabel = isStaff ? 'Employee ID' : 'Admission No'
    const nameLabel = isStaff ? 'Employee Name' : 'Student Name'
    const dayColumns = Array.from({ length: 31 }, (_, i) => i + 1).join(',')

    const lines = [
      `# Full-Year Attendance Register - ${isStaff ? 'Staff' : `Class ${selectedClasses[0] || '1'}`} - ${periodLabel}`,
      '# One row per person per month. Mark each day: Present (P), Absent (A), Half Day (H), Late (L), Leave (LV), Holiday (Hol), On Duty (OD).',
      '# Leave a cell blank if the day is not applicable (e.g. non-school days).',
      `${idLabel},${nameLabel},Month,${dayColumns}`,
    ]
    people.forEach((person) => {
      sessionMonths.forEach((month) => {
        const blanks = Array.from({ length: 31 }, () => '').join(',')
        lines.push(`${person.id},${person.name},${month.name},${blanks}`)
      })
    })

    const suffix = isStaff ? 'staff' : `class_${selectedClasses[0] || '1'}`
    downloadBlob(lines.join('\n'), `attendance_register_${suffix}_${sessionStartYear}-${String(sessionStartYear + 1).slice(-2)}.csv`, 'text/csv')
  }

  const handleDownloadAttendanceInstructions = () => {
    const content = [
      'ATTENDANCE BULK IMPORT INSTRUCTIONS (PREVIOUS ACADEMIC YEAR)',
      '='.repeat(60),
      '',
      'WHEN TO USE',
      'Use this utility to back-fill attendance that was not marked in the ERP,',
      'for example a full previous academic year of student or staff attendance.',
      '',
      'RECORD TYPES',
      '- Student attendance: keyed on Student Admission No + Date',
      '- Staff attendance: keyed on Employee ID + Date',
      '',
      'SESSION',
      '- Every import covers one full academic session (01 April to 31 March).',
      `Current selection: ${attendancePeriodInfo.label} (${attendancePeriodInfo.range})`,
      '',
      'ALLOWED ATTENDANCE STATUS VALUES',
      `- ${ATTENDANCE_STATUS_VALUES.join(', ')}`,
      'Short codes are accepted too: P, A, H/HD, L, LV, HOL, OD, WFH.',
      '',
      'DATE FORMAT',
      '- YYYY-MM-DD (recommended) or DD/MM/YYYY',
      '- Every date must fall inside the selected session, otherwise the row is rejected.',
      '',
      'VALIDATION RULES',
      '- Admission No / Employee ID must exist in the school records.',
      '- One record per person per date. Duplicates in the file are rejected.',
      '- Required fields cannot be empty.',
      '- Half Day and Late rows are imported with a review flag.',
      '- Future dates are rejected.',
    ].join('\n')

    downloadBlob(content, 'attendance_import_instructions.txt', 'text/plain')
  }

  const handleDownloadErrorReport = () => {
    if (isDocumentImport) {
      const flaggedRows = documentValidationResults.filter((row) => row.status !== 'ready')
      if (flaggedRows.length === 0) return

      const isStaff = documentRecordType === 'staff'
      const idLabel = isStaff ? 'Employee ID' : 'Admission No'
      const nameLabel = isStaff ? 'Employee Name' : 'Student Name'
      let csvContent = `File Name,${idLabel},${nameLabel},Document Type,Status,Issue,Resolution\n`
      flaggedRows.forEach((row) => {
        csvContent += `"${row.fileName}","${row.admissionNo}","${row.studentName}","${row.documentType}","${row.status}","${row.issue}","${row.resolution}"\n`
      })

      downloadBlob(csvContent, `document_import_exceptions_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
      return
    }

    const errorRows = validationResults.filter((row) => row.status === 'error')
    if (errorRows.length === 0) return

    const periodColumn = isAttendanceImport ? ',Period' : ''
    let csvContent = `Row Number,Primary Error,Field Errors,Row Data${periodColumn}\n`
    errorRows.forEach((row) => {
      const fieldErrorsStr = row.fieldErrors.map((fieldError) => `${fieldError.field}: ${fieldError.message}`).join('; ')
      const periodValue = isAttendanceImport ? `,"${attendancePeriodInfo.label}"` : ''
      csvContent += `${row.row},"${row.error}","${fieldErrorsStr}","${row.data.replace(/"/g, '""')}"${periodValue}\n`
    })

    const prefix = isAttendanceImport ? `${attendanceRecordType}_attendance_errors` : 'import_errors'
    downloadBlob(csvContent, `${prefix}_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
  }

  const handleDownloadImportReport = () => {
    if (!importResult) return

    if (isDocumentImport) {
      let content = `${documentRecordType === 'staff' ? 'STAFF' : 'STUDENT'} DOCUMENT IMPORT REPORT\n`
      content += '='.repeat(60) + '\n\n'
      content += `Import ID: ${importResult.importId}\n`
      content += `Import Type: ${documentRecordType === 'staff' ? 'Staff Documents' : 'Student Documents'}\n`
      content += `ZIP File: ${uploadedDocumentZip?.name}\n`
      content += `Manifest File: ${uploadedManifestFile?.name || 'Not provided'}\n`
      content += `Matching Logic: Filename recognition${uploadedManifestFile ? ' + manifest reference check' : ''}\n`
      content += `Date: ${formatDate(importResult.timestamp)}\n`
      content += `Duration: ${formatDuration(importResult.duration)}\n\n`
      content += 'SUMMARY\n'
      content += '-'.repeat(30) + '\n'
      content += `Imported Automatically: ${importResult.importedCount}\n`
      content += `Imported After Review / Resolution: ${importResult.warningCount}\n`
      content += `Skipped Files: ${importResult.skippedCount}\n\n`

      if (importResult.errors.length > 0) {
        content += 'SKIPPED FILES\n'
        content += '-'.repeat(30) + '\n'
        importResult.errors.forEach((error) => {
          content += `${error.fileName || 'Unknown File'}: ${error.error}\n`
        })
      }

      downloadBlob(content, `document_import_report_${importResult.importId}.txt`, 'text/plain')
      return
    }

    let content = 'IMPORT REPORT\n'
    content += '='.repeat(50) + '\n\n'
    content += `Import ID: ${importResult.importId}\n`
    content += `Entity: ${getSelectedEntityInfo()?.label}\n`
    content += `File: ${uploadedFile?.name}\n`

    if (importResult.periodSummary) {
      content += `Record Type: ${importResult.periodSummary.recordType}\n`
      content += `Attendance Period: ${importResult.periodSummary.label}\n`
      content += `Period Range: ${importResult.periodSummary.range}\n`
    }

    content += `Date: ${formatDate(importResult.timestamp)}\n`
    content += `Duration: ${formatDuration(importResult.duration)}\n\n`
    content += 'SUMMARY\n'
    content += '-'.repeat(30) + '\n'
    content += `Successfully Imported: ${importResult.importedCount}\n`
    content += `Imported with Warnings: ${importResult.warningCount}\n`
    content += `Skipped (Errors): ${importResult.skippedCount}\n\n`

    if (isAttendanceImport) {
      const distribution = getAttendanceStatusDistribution(validationResults)
      if (Object.keys(distribution).length > 0) {
        content += 'ATTENDANCE BREAKDOWN\n'
        content += '-'.repeat(30) + '\n'
        Object.entries(distribution).forEach(([statusLabel, count]) => {
          content += `${statusLabel}: ${count}\n`
        })
        content += '\n'
      }
    }

    if (importResult.errors.length > 0) {
      content += 'SKIPPED ROWS\n'
      content += '-'.repeat(30) + '\n'
      importResult.errors.forEach((error) => {
        content += `Row ${error.row}: ${error.error}\n`
      })
    }

    const prefix = isAttendanceImport ? `${attendanceRecordType}_attendance_import_report` : 'import_report'
    downloadBlob(content, `${prefix}_${importResult.importId}.txt`, 'text/plain')
  }

  // ==================== HISTORY HANDLERS ====================

  const handleDeleteHistoryItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this import record?')) {
      setImportHistory((prev) => prev.filter((item) => item.id !== id))
    }
  }

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all import history?')) {
      setImportHistory([])
    }
  }

  const getFilteredHistory = (): ImportHistoryItem[] => {
    if (historyFilter === 'all') return importHistory
    return importHistory.filter((item) => item.status === historyFilter)
  }

  // ==================== NAVIGATION HANDLERS ====================

  const isPeriodValid = (): boolean => attendancePeriod.sessionStartYear > 1900

  const canProceedToNextStep = (): boolean => {
    if (step === 1) return !!selectedEntity

    if (step === stepRecordTypeClass) {
      if (isAttendanceImport) {
        // Student attendance requires a class; staff does not. Both need a valid academic year.
        const classOk = attendanceRecordType === 'student' ? selectedClasses.length > 0 : true
        return classOk && isPeriodValid()
      }
      // Student variants require at least one class selected; staff variants do not.
      if (isCombinedImport) return combinedRecordType === 'student' ? selectedClasses.length > 0 : true
      if (isDocumentImport) return documentRecordType === 'student' ? selectedClasses.length > 0 : true
    }

    if (step === stepUpload) {
      return isDocumentImport ? !!uploadedDocumentZip && !uploadError : !!uploadedFile && !uploadError
    }

    if (step === stepRules && isDocumentImport) {
      return !!uploadedDocumentZip
    }

    if (step === stepValidate) {
      return isDocumentImport
        ? documentValidationResults.length > 0 && documentValidationSummary.importable > 0
        : validationResults.length > 0 && (validationSummary.valid > 0 || validationSummary.warnings > 0)
    }

    if (step === stepConfirm) return !isProcessing

    return true
  }

  const handleNextStep = () => {
    if (!canProceedToNextStep()) return

    if (step === stepUpload) {
      if (isDocumentImport) {
        setStep(stepRules)
        return
      }
      // Auto-mapped data imports validate immediately after upload.
      setStep(stepValidate)
      setTimeout(() => runValidation(), 100)
      return
    }

    if (isDocumentImport && step === stepRules) {
      setStep(stepValidate)
      setTimeout(() => runDocumentValidation(), 100)
      return
    }

    setStep(Math.min(stepConfirm, step + 1))
  }

  const handlePreviousStep = () => {
    if (step === stepValidate) {
      setValidationResults([])
      setValidationSummary({ valid: 0, errors: 0, warnings: 0, total: 0 })
      setDocumentValidationData([])
    }
    setStep(Math.max(1, step - 1))
  }

  const handleGoToStep = (targetStep: number) => {
    if (targetStep < step) {
      if (targetStep < stepValidate && step >= stepValidate) {
        setValidationResults([])
        setValidationSummary({ valid: 0, errors: 0, warnings: 0, total: 0 })
        setDocumentValidationData([])
      }
      setStep(targetStep)
    }
  }

  const handleStartNewImport = () => {
    setStep(1)
    resetWizardState(true)
  }

  const getNextButtonLabel = () => {
    if (step === stepRecordTypeClass && (isCombinedImport || isDocumentImport || isAttendanceImport)) {
      const isStudent = isCombinedImport
        ? combinedRecordType === 'student'
        : isDocumentImport
        ? documentRecordType === 'student'
        : attendanceRecordType === 'student'
      return isStudent ? (selectedClasses.length > 0 ? 'Upload File' : 'Select Class') : 'Upload File'
    }
    if (isDocumentImport && step === stepRules) return 'Validate Matches'
    if (step === stepValidate) return 'Continue to Import'
    if (isDocumentImport && step === stepUpload) return 'Review Rules'
    if (step === stepUpload) return 'Validate Data'
    return 'Next Step'
  }

  // ==================== RENDER HELPERS ====================

  const selectedEntityInfo = getSelectedEntityInfo()
  const filteredValidationResults = getFilteredValidationResults()
  const filteredDocumentValidationResults = getFilteredDocumentValidationResults()
  const filteredHistory = getFilteredHistory()
  const attendanceStatusDistribution = isAttendanceImport ? getAttendanceStatusDistribution(validationResults) : {}
  const yearPeriodOptions = getYearPeriodOptions()
  const selectedPeriodValue = String(attendancePeriod.sessionStartYear)

  const renderEntityCard = (option: EntityOption) => (
    <div
      key={option.value}
      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
        selectedEntity === option.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
      onClick={() => handleEntitySelect(option.value)}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{option.icon}</span>
        <div className="flex-grow">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-gray-900">{option.label}</h4>
            {selectedEntity === option.value && <CheckCircle className="w-5 h-5 text-blue-600" />}
          </div>
          <p className="text-sm text-gray-500 mt-1">{option.description}</p>
        </div>
      </div>
    </div>
  )

  const renderStepOne = () => (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-gray-900">Select Import Type</h3>
        <p className="text-sm text-gray-500 mt-1">Choose what you want to import into the ERP</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Student Imports</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{primaryEntityOptions.map(renderEntityCard)}</div>
      </div>

      <div>
        <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">Other Data Imports</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{secondaryEntityOptions.map(renderEntityCard)}</div>
      </div>

          </div>
  )

  const renderAttendanceRecordTypePicker = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <button
        type="button"
        className={`text-left border-2 rounded-lg p-4 transition-all ${
          attendanceRecordType === 'student' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={() => handleAttendanceRecordTypeChange('student')}
      >
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-blue-600" />
          <div>
            <p className="font-semibold text-gray-900">Student Attendance</p>
            <p className="text-sm text-gray-500 mt-1">Keyed on Student Admission No + Date</p>
          </div>
          {attendanceRecordType === 'student' && <CheckCircle className="w-5 h-5 text-blue-600 ml-auto" />}
        </div>
      </button>

      <button
        type="button"
        className={`text-left border-2 rounded-lg p-4 transition-all ${
          attendanceRecordType === 'staff' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={() => handleAttendanceRecordTypeChange('staff')}
      >
        <div className="flex items-center gap-3">
          <Briefcase className="w-6 h-6 text-blue-600" />
          <div>
            <p className="font-semibold text-gray-900">Staff Attendance</p>
            <p className="text-sm text-gray-500 mt-1">Keyed on Employee ID + Date</p>
          </div>
          {attendanceRecordType === 'staff' && <CheckCircle className="w-5 h-5 text-blue-600 ml-auto" />}
        </div>
      </button>
    </div>
  )

  const renderCombinedRecordTypePicker = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <button
        type="button"
        className={`text-left border-2 rounded-lg p-4 transition-all ${
          combinedRecordType === 'student' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={() => handleCombinedRecordTypeChange('student')}
      >
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-blue-600" />
          <div>
            <p className="font-semibold text-gray-900">Student Records</p>
            <p className="text-sm text-gray-500 mt-1">Select the class(es) being added, then get a tailored template</p>
          </div>
          {combinedRecordType === 'student' && <CheckCircle className="w-5 h-5 text-blue-600 ml-auto" />}
        </div>
      </button>

      <button
        type="button"
        className={`text-left border-2 rounded-lg p-4 transition-all ${
          combinedRecordType === 'employee' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={() => handleCombinedRecordTypeChange('employee')}
      >
        <div className="flex items-center gap-3">
          <Briefcase className="w-6 h-6 text-blue-600" />
          <div>
            <p className="font-semibold text-gray-900">Staff / Employee Records</p>
            <p className="text-sm text-gray-500 mt-1">Import staff profiles directly — no class selection or template</p>
          </div>
          {combinedRecordType === 'employee' && <CheckCircle className="w-5 h-5 text-blue-600 ml-auto" />}
        </div>
      </button>
    </div>
  )

  const renderDocumentRecordTypePicker = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <button
        type="button"
        className={`text-left border-2 rounded-lg p-4 transition-all ${
          documentRecordType === 'student' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={() => handleDocumentRecordTypeChange('student')}
      >
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-blue-600" />
          <div>
            <p className="font-semibold text-gray-900">Student Documents</p>
            <p className="text-sm text-gray-500 mt-1">Keyed on Admission No (e.g. STU001_Aadhaar.pdf)</p>
          </div>
          {documentRecordType === 'student' && <CheckCircle className="w-5 h-5 text-blue-600 ml-auto" />}
        </div>
      </button>

      <button
        type="button"
        className={`text-left border-2 rounded-lg p-4 transition-all ${
          documentRecordType === 'staff' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={() => handleDocumentRecordTypeChange('staff')}
      >
        <div className="flex items-center gap-3">
          <Briefcase className="w-6 h-6 text-blue-600" />
          <div>
            <p className="font-semibold text-gray-900">Staff Documents</p>
            <p className="text-sm text-gray-500 mt-1">Keyed on Employee ID (e.g. EMP001_Appointment_Letter.pdf)</p>
          </div>
          {documentRecordType === 'staff' && <CheckCircle className="w-5 h-5 text-blue-600 ml-auto" />}
        </div>
      </button>
    </div>
  )

  const renderRecordTypeClassStep = () => {
    const isStudent = isCombinedImport
      ? combinedRecordType === 'student'
      : isDocumentImport
      ? documentRecordType === 'student'
      : isAttendanceImport
      ? attendanceRecordType === 'student'
      : false

    const title =
      isAttendanceImport ? 'Choose Record Type, Class &amp; Academic Year' : isDocumentImport ? 'Choose Document Type &amp; Class' : 'Choose Record Type &amp; Class'
    const subtitle = isDocumentImport
      ? 'Pick whether you are uploading student or staff documents, then choose the class for student documents'
      : isAttendanceImport
      ? 'Pick student or staff attendance, then choose the class and the full academic year to import'
      : 'Pick whether you are adding student or staff records, then choose the class(es) for students'

    return (
      <div className="max-w-3xl mx-auto space-y-6 py-4">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>

        {renderImportLimitsBanner()}

        {isCombinedImport ? renderCombinedRecordTypePicker() : isDocumentImport ? renderDocumentRecordTypePicker() : renderAttendanceRecordTypePicker()}

        {isAttendanceImport && (
          <div className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Academic year to import</h4>
              <p className="text-sm text-gray-500 mb-3">
                The register covers a full academic session (01 April to 31 March). Choose which session you are importing.
              </p>
              <Select
                value={selectedPeriodValue}
                onChange={(e) => handlePeriodSessionChange(e.target.value)}
                options={yearPeriodOptions}
                className="w-full md:w-64"
              />
              <p className="text-xs text-gray-500 mt-2">
                {attendancePeriodInfo.label} — {attendancePeriodInfo.range}
              </p>
            </div>
          </div>
        )}

        {isStudent ? (
          <div className="border border-gray-200 rounded-lg p-4 space-y-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">{isAttendanceImport ? 'Class for this register' : 'Classes being added'}</h4>
                <p className="text-sm text-gray-500 mb-3">
                  {isAttendanceImport
                    ? 'Select the class this attendance register belongs to. The downloadable register reflects your selection.'
                    : isDocumentImport
                    ? 'Select the class these documents belong to. The downloadable manifest template is pre-filled with that class.'
                    : 'Select the class(es) these student records belong to. The download template will be filled with your selection.'}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {!isAttendanceImport && (
                  <Button variant="outline" size="sm" onClick={handleSelectAllClasses}>
                    Select All
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearClasses}
                  disabled={selectedClasses.length === 0}
                >
                  Clear
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {schoolClassOptions.map((classValue) => {
                const isSelected = selectedClasses.includes(classValue)
                return (
                  <button
                    key={classValue}
                    type="button"
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                      isSelected ? 'border-blue-500 bg-blue-600 text-white' : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:text-blue-600'
                    }`}
                    onClick={() => handleClassToggle(classValue)}
                  >
                    Class {classValue}
                  </button>
                )
              })}
            </div>

            {selectedClasses.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                <span className="font-medium">Selected class{selectedClasses.length > 1 ? 'es' : ''}:</span>{' '}
                <span className="font-mono">{selectedClasses.map((c) => `Class ${c}`).join(', ')}</span>
              </div>
            )}

            {selectedClasses.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                Select at least one class to continue.
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              {isDocumentImport ? (
                <Button variant="outline" size="sm" onClick={handleDownloadDocumentManifestTemplate}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Class Manifest Template
                </Button>
              ) : isAttendanceImport ? (
                <Button variant="outline" size="sm" onClick={handleDownloadAttendanceRegister}>
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Download Attendance Register
                </Button>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={() => handleDownloadTemplate(selectedEntity)}>
                    <Download className="w-4 h-4 mr-2" />
                    Download Class Template
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownloadSampleData}>
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Download Sample Data
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="border border-gray-200 rounded-lg p-4 space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700">
              {isAttendanceImport ? (
                <span>
                  <span className="font-medium">Staff attendance:</span> no class selection is needed. Upload your staff attendance file on the
                  next step.
                </span>
              ) : isDocumentImport ? (
                <span>
                  <span className="font-medium">Staff documents:</span> files use Employee IDs (e.g. EMP001_Appointment_Letter.pdf) and no class
                  selection is needed.
                </span>
              ) : (
                <span>
                  <span className="font-medium">Staff / Employee import:</span> no class selection is needed and no class template is generated.
                  Upload your staff register on the next step.
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {isAttendanceImport ? (
                <Button variant="outline" size="sm" onClick={handleDownloadAttendanceRegister}>
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Download Staff Register
                </Button>
              ) : isDocumentImport ? (
                <Button variant="outline" size="sm" onClick={handleDownloadDocumentManifestTemplate}>
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Download Staff Manifest Template
                </Button>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={() => handleDownloadTemplate(selectedEntity)}>
                    <Download className="w-4 h-4 mr-2" />
                    Download Staff Template
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownloadSampleData}>
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Download Sample Data
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-2">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">How this works</p>
              <p className="mt-1">
                {isDocumentImport
                  ? 'For students, the class-aware manifest template is pre-filled with that class so you only add filenames. Staff documents need no class.'
                  : isAttendanceImport
                  ? 'For students, the register shows the selected class with students as rows and the days of the period as columns. Staff registers skip the class.'
                  : 'For students, you first choose the class(es) being added, and the downloadable template reflects that selection with the Class column pre-filled. For staff, the class selection and template step are skipped entirely.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderImportLimitsBanner = () => {
    const limit = activeImportLimit()
    if (!limit) return null

    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-gray-900">Upload Limits</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
          <div>
            <span className="text-xs text-gray-500 block">Max File Size</span>
            <span className="font-semibold text-gray-800">{limit.size}</span>
          </div>
          <div>
            <span className="text-xs text-gray-500 block">Max Records</span>
            <span className="font-semibold text-gray-800">{limit.records}</span>
          </div>
          <div>
            <span className="text-xs text-gray-500 block">Import Scope</span>
            <span className="font-semibold text-gray-800">{limit.scope}</span>
          </div>
        </div>
      </div>
    )
  }

  const renderDataUploadStep = () => (
    <div className="max-w-2xl mx-auto space-y-6 py-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          {isAttendanceImport ? 'Upload Attendance Register' : 'Upload Your File'}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {isAttendanceImport
            ? `Choose the register type, then upload the ${attendanceRecordType === 'staff' ? 'staff' : 'student'} attendance file (CSV or Excel)`
            : `Upload a CSV or Excel file containing your ${
                isCombinedImport ? (combinedRecordType === 'student' ? 'student' : 'staff') : selectedEntityInfo?.label.toLowerCase()
              } records`}
        </p>
      </div>

      {renderImportLimitsBanner()}

      {isCombinedImport && uploadedFile && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-sm text-indigo-800 flex gap-2">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            Importing{' '}
            {combinedRecordType === 'student' ? `student records for ${selectedClasses.length ? selectedClasses.map((c) => `Class ${c}`).join(', ') : 'the selected class(es)'}` : 'staff / employee records'}.
            Use “Previous” to change the record type or class selection.
          </span>
        </div>
      )}

      {isAttendanceImport && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-sm text-indigo-800 flex flex-wrap items-center gap-2">
          <span className="font-medium text-gray-900">
            {attendanceRecordType === 'staff' ? 'Staff attendance' : 'Student attendance'}
          </span>
          {attendanceRecordType === 'student' && selectedClasses.length > 0 && (
            <>
              <span className="text-gray-400">•</span>
              <span>Class {selectedClasses.join(', ')}</span>
            </>
          )}
          <span className="ml-auto text-indigo-700">Use “Previous” to change the type or class.</span>
        </div>
      )}

      {!uploadedFile ? (
        <div className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-blue-500 bg-blue-50 scale-[1.02]'
                : uploadError
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleClickUpload}
          >
            {isProcessing ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Processing File...</p>
                  <p className="text-sm text-gray-500 mt-1">{processingMessage}</p>
                </div>
              </div>
            ) : (
              <>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${uploadError ? 'bg-red-100' : 'bg-blue-100'}`}>
                  {uploadError ? <XCircle className="w-8 h-8 text-red-600" /> : <Upload className="w-8 h-8 text-blue-600" />}
                </div>
                <p className="font-medium text-gray-900">{isDragging ? 'Drop your file here' : 'Click to upload or drag and drop'}</p>
                <p className="text-sm text-gray-500 mt-1">Supported formats: CSV, XLS, XLSX (Max 25MB)</p>
                {uploadError && <p className="text-sm text-red-600 mt-2">{uploadError}</p>}
              </>
            )}
          </div>

          <input ref={fileInputRef} type="file" accept=".csv,.xls,.xlsx" className="hidden" onChange={handleFileInputChange} />

          {!(isCombinedImport && combinedRecordType === 'employee') && (
            <div className="flex justify-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleDownloadSampleData}>
                <Download className="w-4 h-4 mr-2" />
                Download Sample CSV
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDownloadTemplate(selectedEntity)}>
                <FileText className="w-4 h-4 mr-2" />
                Download Empty Template
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileSpreadsheet className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                  <div className="flex gap-3 text-sm text-gray-500 mt-1">
                    <span>{formatFileSize(uploadedFile.size)}</span>
                    <span>•</span>
                    <span>{uploadedFile.totalRows} rows</span>
                    <span>•</span>
                    <span>{uploadedFile.headers.length} columns</span>
                    {isAttendanceImport && (
                      <>
                        <span>•</span>
                        <span>{attendanceRecordType === 'staff' ? 'Staff register' : 'Student register'}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleRemoveFile}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {isAttendanceImport && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <div className="flex gap-2">
                <CalendarDays className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-indigo-800">
                  <p className="font-medium">Posting into {attendancePeriodInfo.label}</p>
                  <p className="mt-1">
                    Every row in this file will be checked against the selected academic session ({attendancePeriodInfo.range}). Use
                    “Previous” to change the session if needed.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="border border-gray-200 rounded-lg">
            <div
              className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200 cursor-pointer"
              onClick={() => toggleSection('filePreview')}
            >
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-700">Data Preview</span>
                <Badge variant="secondary">{uploadedFile.totalRows} rows</Badge>
              </div>
              {expandedSections.filePreview ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </div>

            {expandedSections.filePreview && (
              <div className="p-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-3 py-2 text-left font-medium text-gray-500 border-b">#</th>
                      {uploadedFile.headers.map((header, index) => (
                        <th key={index} className="px-3 py-2 text-left font-medium text-gray-700 border-b whitespace-nowrap">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {uploadedFile.rows.slice(0, 5).map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2 text-gray-400">{rowIndex + 1}</td>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-3 py-2 max-w-[200px] truncate" title={cell}>
                            {cell || <span className="text-gray-300">—</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {uploadedFile.totalRows > 5 && <p className="text-center text-sm text-gray-500 mt-3">... and {uploadedFile.totalRows - 5} more rows</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )

  const renderDocumentUploadStep = () => (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Upload {documentRecordType === 'staff' ? 'Staff' : 'Student'} Documents
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Choose student or staff documents, then upload a ZIP and an optional manifest Excel/CSV as a reference file
        </p>
      </div>

      {renderImportLimitsBanner()}

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-sm text-indigo-800 flex flex-wrap items-center gap-2">
        <span className="font-medium text-gray-900">
          {documentRecordType === 'staff' ? 'Staff documents' : 'Student documents'}
        </span>
        {documentRecordType === 'student' && selectedClasses.length > 0 && (
          <>
            <span className="text-gray-400">•</span>
            <span>Class {selectedClasses.join(', ')}</span>
          </>
        )}
        <span className="ml-auto text-indigo-700">Use “Previous” to change the type or class.</span>
      </div>

      {!uploadedDocumentZip ? (
        <div className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-blue-500 bg-blue-50 scale-[1.02]'
                : uploadError
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleClickDocumentZipUpload}
          >
            {isProcessing ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Processing ZIP...</p>
                  <p className="text-sm text-gray-500 mt-1">{processingMessage}</p>
                </div>
              </div>
            ) : (
              <>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${uploadError ? 'bg-red-100' : 'bg-blue-100'}`}>
                  {uploadError ? <XCircle className="w-8 h-8 text-red-600" /> : <Upload className="w-8 h-8 text-blue-600" />}
                </div>
                <p className="font-medium text-gray-900">{isDragging ? 'Drop ZIP here' : 'Click to upload or drag and drop ZIP archive'}</p>
                <p className="text-sm text-gray-500 mt-1">Supported: ZIP archives up to 100MB</p>
                {uploadError && <p className="text-sm text-red-600 mt-2">{uploadError}</p>}
              </>
            )}
          </div>

          <input ref={documentZipInputRef} type="file" accept=".zip" className="hidden" onChange={handleDocumentZipInputChange} />
          <input ref={documentManifestInputRef} type="file" accept=".csv,.xls,.xlsx" className="hidden" onChange={handleDocumentManifestInputChange} />

          <div className="flex justify-center gap-4 flex-wrap">
            <Button variant="ghost" size="sm" onClick={handleDownloadDocumentInstructions}>
              <Download className="w-4 h-4 mr-2" />
              Download Naming Instructions
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDownloadDocumentManifestTemplate}>
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Download Manifest Template
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClickManifestUpload}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Optional Manifest
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{uploadedDocumentZip.name}</p>
                  <div className="flex gap-3 text-sm text-gray-500 mt-1 flex-wrap">
                    <span>{formatFileSize(uploadedDocumentZip.size)}</span>
                    <span>•</span>
                    <span>{uploadedDocumentZip.totalFiles} detected documents</span>
                    <span>•</span>
                    <span>ZIP archive</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleRemoveDocumentZip}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Optional Manifest Reference</h4>
                <p className="text-sm text-gray-500 mt-1">
                  Upload CSV/XLS/XLSX to cross-check filename-based {documentRecordType === 'staff' ? 'employee' : 'student'} and document
                  matching
                </p>
              </div>
              {!uploadedManifestFile ? (
                <Button variant="outline" size="sm" onClick={handleClickManifestUpload}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Manifest
                </Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={handleRemoveDocumentManifest}>
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>

            {uploadedManifestFile ? (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-green-900">{uploadedManifestFile.name}</p>
                  <p className="text-sm text-green-700 mt-1">{formatFileSize(uploadedManifestFile.size)} • Manifest reference check enabled</p>
                </div>
                <Badge variant="success">Manifest Ready</Badge>
              </div>
            ) : (
              <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-600">
                No manifest uploaded. The ERP will recognize {documentRecordType === 'staff' ? 'employees' : 'students'} directly from filenames like{' '}
                <span className="font-mono">
                  {documentRecordType === 'staff' ? 'EMP001_Appointment_Letter.pdf' : 'STU001_Aadhaar.pdf'}
                </span>
                .
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-2">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">How matching works</p>
                <p className="mt-1">
                  The ERP reads the {documentRecordType === 'staff' ? 'employee ID' : 'admission number'} from the filename, validates the{' '}
                  {documentRecordType === 'staff' ? 'employee' : 'student'} exists, optionally cross-checks against the manifest reference, detects
                  duplicates, and then shows a preview before anything gets attached.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderDocumentRulesStep = () => (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Review Matching Rules</h3>
          <p className="text-sm text-gray-500 mt-1">
            {documentRecordType === 'staff' ? 'Staff' : 'Student'} documents are matched from the filename, and the manifest is used only as a
            reference check
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handleDownloadDocumentInstructions}>
            <FileText className="w-4 h-4 mr-2" />
            Instructions
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadDocumentManifestTemplate}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Manifest Template
          </Button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-5">
        <div>
          <h4 className="font-semibold text-gray-900">How ERP recognizes the document</h4>
          <p className="text-sm text-gray-600 mt-1">
            The ERP reads the first part of the filename as the {documentRecordType === 'staff' ? 'employee ID' : 'student admission number'}, then
            reads the remaining filename as the document type.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900 mb-2">Filename examples</p>
            <div className="font-mono text-sm text-blue-800 space-y-1">
              {documentRecordType === 'staff' ? (
                <>
                  <div>EMP001_Appointment_Letter.pdf</div>
                  <div>EMP001_ID_Proof.pdf</div>
                  <div>EMP001_Photo.jpg</div>
                </>
              ) : (
                <>
                  <div>STU001_Aadhaar.pdf</div>
                  <div>STU001_Birth_Certificate.pdf</div>
                  <div>STU001_Photo.jpg</div>
                </>
              )}
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-900 mb-2">Manifest reference columns</p>
            <div className="text-sm text-gray-700 space-y-1">
              <div>{documentRecordType === 'staff' ? 'Employee ID' : 'Student ID'}</div>
              <div>Document Type</div>
              <div>File Name</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-500">ZIP File</p>
            <p className="font-medium text-gray-900 mt-1">{uploadedDocumentZip?.name || 'Not uploaded'}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-500">Manifest File</p>
            <p className="font-medium text-gray-900 mt-1">{uploadedManifestFile?.name || 'Optional / Not uploaded'}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-500">Supported Types</p>
            <p className="font-medium text-gray-900 mt-1">PDF, JPG, JPEG, PNG, DOC, DOCX</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-2">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Validation behavior</p>
            <p className="mt-1">
              The preview will show total files found, ready-to-import files, students not found, duplicate document types, invalid naming issues,
              and any filename vs manifest mismatch. Nothing is attached until the admin confirms import.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderDataValidationStep = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {isAttendanceImport ? 'Attendance Validation' : 'Data Validation'}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {isAttendanceImport
              ? `Reviewing ${attendanceRecordType === 'staff' ? 'staff' : 'student'} records for ${attendancePeriodInfo.label} (${attendancePeriodInfo.range})`
              : 'Review validation results and fix any errors before importing'}
          </p>
        </div>
        {validationResults.length > 0 && (
          <div className="flex gap-3">
            <Badge variant="success" className="text-sm py-1 px-3">
              <CheckCircle className="w-4 h-4 mr-1" />
              {validationSummary.valid} Valid
            </Badge>
            {validationSummary.warnings > 0 && (
              <Badge variant="warning" className="text-sm py-1 px-3">
                <AlertCircle className="w-4 h-4 mr-1" />
                {validationSummary.warnings} Warnings
              </Badge>
            )}
            <Badge variant="danger" className="text-sm py-1 px-3">
              <XCircle className="w-4 h-4 mr-1" />
              {validationSummary.errors} Errors
            </Badge>
          </div>
        )}
      </div>

      {isAttendanceImport && validationResults.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-sm font-medium text-indigo-900">Posting into {attendancePeriodInfo.label}</p>
                <p className="text-xs text-indigo-700">{attendancePeriodInfo.range}</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(attendanceStatusDistribution).map(([statusLabel, count]) => (
                <Badge key={statusLabel} variant="secondary">
                  {statusLabel}: {count}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {isProcessing ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
          <h4 className="text-lg font-medium text-gray-900">Validating Data...</h4>
          <p className="text-gray-500 mt-2">{processingMessage || `Checking ${uploadedFile?.totalRows} rows`}</p>
          <div className="w-64 bg-gray-200 rounded-full h-2 mt-6">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      ) : validationResults.length > 0 ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    validationFilter === 'all' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setValidationFilter('all')}
                >
                  All ({validationSummary.total})
                </button>
                <button
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    validationFilter === 'valid' ? 'bg-white shadow text-green-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setValidationFilter('valid')}
                >
                  Valid ({validationSummary.valid})
                </button>
                {validationSummary.warnings > 0 && (
                  <button
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      validationFilter === 'warning' ? 'bg-white shadow text-yellow-700' : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setValidationFilter('warning')}
                  >
                    Warnings ({validationSummary.warnings})
                  </button>
                )}
                <button
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    validationFilter === 'error' ? 'bg-white shadow text-red-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setValidationFilter('error')}
                >
                  Errors ({validationSummary.errors})
                </button>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search rows..."
                  value={validationSearch}
                  onChange={(e) => setValidationSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {validationSearch && (
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setValidationSearch('')}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={runValidation}>
                <RefreshCw className="w-4 h-4 mr-1" />
                Re-validate
              </Button>
              {validationSummary.errors > 0 && (
                <Button variant="outline" size="sm" onClick={handleDownloadErrorReport}>
                  <Download className="w-4 h-4 mr-1" />
                  Download Error Report
                </Button>
              )}
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="max-h-[400px] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-20">Row</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-24">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Preview</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issues</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase w-28">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredValidationResults.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        No rows match your filter criteria
                      </td>
                    </tr>
                  ) : (
                    filteredValidationResults.map((result) => (
                      <tr
                        key={result.row}
                        className={`hover:bg-gray-50 ${
                          result.status === 'error' ? 'bg-red-50/50' : result.status === 'warning' ? 'bg-yellow-50/50' : ''
                        } ${result.isEdited ? 'border-l-4 border-l-blue-500' : ''}`}
                      >
                        <td className="px-4 py-3">
                          <span className="font-mono text-sm">{result.row}</span>
                          {result.isEdited && (
                            <span className="ml-1 text-xs text-blue-600" title="Row has been edited">
                              ✎
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {result.status === 'valid' ? (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="w-5 h-5" />
                              <span className="text-sm font-medium">Valid</span>
                            </div>
                          ) : result.status === 'warning' ? (
                            <div className="flex items-center gap-1 text-yellow-600">
                              <AlertCircle className="w-5 h-5" />
                              <span className="text-sm font-medium">Warning</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-red-600">
                              <XCircle className="w-5 h-5" />
                              <span className="text-sm font-medium">Error</span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs text-gray-600 block truncate max-w-[300px]" title={result.data}>
                            {result.data.length > 80 ? result.data.substring(0, 80) + '...' : result.data}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm">
                            {result.error && <span className="text-red-600 font-medium">{result.error}</span>}
                            {result.fieldErrors.length > 1 && <span className="text-gray-500 ml-1 text-xs">(+{result.fieldErrors.length - 1} more)</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleOpenPreview(result)} title="View Details">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteRow(result.row - 1)} title="Remove Row">
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>
              Showing {filteredValidationResults.length} of {validationResults.length} rows
            </span>
            <span>
              Ready to import: {validationSummary.valid + validationSummary.warnings} rows | Will skip: {validationSummary.errors} rows
            </span>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-lg font-medium">Validation Not Started</p>
          <p className="text-sm mt-1">Click the button below to validate your data</p>
          <Button className="mt-6" onClick={runValidation}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Start Validation
          </Button>
        </div>
      )}
    </div>
  )

  const renderDocumentValidationStep = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Document Import Preview</h3>
          <p className="text-sm text-gray-500 mt-1">
            Validate matching results before attaching documents to {documentRecordType === 'staff' ? 'employee' : 'student'} profiles
          </p>
        </div>
        {documentValidationResults.length > 0 && (
          <div className="flex gap-3 flex-wrap">
            <Badge variant="secondary" className="text-sm py-1 px-3">
              {documentValidationSummary.total} Total Files
            </Badge>
            <Badge variant="success" className="text-sm py-1 px-3">
              <CheckCircle className="w-4 h-4 mr-1" />
              {documentValidationSummary.importable} Ready to Import
            </Badge>
            {documentValidationSummary.studentNotFound > 0 && (
              <Badge variant="warning" className="text-sm py-1 px-3">
                <AlertCircle className="w-4 h-4 mr-1" />
                {documentValidationSummary.studentNotFound} {documentRecordType === 'staff' ? 'Employee' : 'Student'} Not Found
              </Badge>
            )}
            {documentValidationSummary.duplicates > 0 && (
              <Badge variant="danger" className="text-sm py-1 px-3">
                <XCircle className="w-4 h-4 mr-1" />
                {documentValidationSummary.duplicates} Duplicate Documents
              </Badge>
            )}
          </div>
        )}
      </div>

      {isProcessing ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
          <h4 className="text-lg font-medium text-gray-900">Validating Documents...</h4>
          <p className="text-gray-500 mt-2">
            {processingMessage || `Matching filenames to ${documentRecordType === 'staff' ? 'employee' : 'student'} IDs`}
          </p>
          <div className="w-64 bg-gray-200 rounded-full h-2 mt-6">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      ) : documentValidationResults.length > 0 ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex bg-gray-100 rounded-lg p-1">
                {[
                  { key: 'all', label: `All (${documentValidationSummary.total})` },
                  { key: 'ready', label: `Ready (${documentValidationSummary.ready})` },
                  { key: 'student_not_found', label: `Not Found (${documentValidationSummary.studentNotFound})` },
                  { key: 'duplicate', label: `Duplicate (${documentValidationSummary.duplicates})` },
                  { key: 'invalid_name', label: `Invalid (${documentValidationSummary.invalidNames})` },
                ].map((filter) => (
                  <button
                    key={filter.key}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      documentValidationFilter === filter.key ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setDocumentValidationFilter(filter.key as typeof documentValidationFilter)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search files or ${documentRecordType === 'staff' ? 'employee' : 'student'} IDs...`}
                  value={documentValidationSearch}
                  onChange={(e) => setDocumentValidationSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {documentValidationSearch && (
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setDocumentValidationSearch('')}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={runDocumentValidation}>
                <RefreshCw className="w-4 h-4 mr-1" />
                Re-validate
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadErrorReport}>
                <Download className="w-4 h-4 mr-1" />
                Download Exceptions
              </Button>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="max-h-[480px] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {documentRecordType === 'staff' ? 'Employee' : 'Student'}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {documentRecordType === 'staff' ? 'Employee ID' : 'Admission No.'}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Document Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">File</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[220px]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredDocumentValidationResults.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                        No files match your filter criteria
                      </td>
                    </tr>
                  ) : (
                    filteredDocumentValidationResults.map((row) => (
                      <tr
                        key={row.id}
                        className={`hover:bg-gray-50 ${
                          row.status === 'student_not_found'
                            ? 'bg-yellow-50/40'
                            : row.status === 'duplicate' || row.status === 'invalid_name'
                            ? 'bg-red-50/40'
                            : ''
                        }`}
                      >
                        <td className="px-4 py-3">
                          {row.status === 'ready' ? (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="w-5 h-5" />
                              <span className="text-sm font-medium">Ready</span>
                            </div>
                          ) : row.status === 'student_not_found' ? (
                            <div className="flex items-center gap-1 text-yellow-600">
                              <AlertCircle className="w-5 h-5" />
                              <span className="text-sm font-medium">Not Found</span>
                            </div>
                          ) : row.status === 'duplicate' ? (
                            <div className="flex items-center gap-1 text-red-600">
                              <XCircle className="w-5 h-5" />
                              <span className="text-sm font-medium">Duplicate</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-red-600">
                              <XCircle className="w-5 h-5" />
                              <span className="text-sm font-medium">Invalid</span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.studentName || '—'}</td>
                        <td className="px-4 py-3 text-sm font-mono text-gray-700">{row.admissionNo || '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{row.documentType || '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <div className="truncate max-w-[220px]" title={row.fileName}>
                            {row.fileName}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">Matched by {row.matchedBy}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {row.issue}
                          {row.existingDocumentName && (
                            <div className="text-xs text-gray-500 mt-1">First file: {row.existingDocumentName}</div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {row.status === 'ready' ? (
                            <span className="text-sm text-gray-400">—</span>
                          ) : row.status === 'duplicate' ? (
                            <Select
                              value={row.resolution}
                              onChange={(e) => handleDocumentResolutionChange(row.id, e.target.value as DocumentResolution)}
                              options={[
                                { value: 'keep_existing', label: 'Keep existing / Skip new' },
                                { value: 'replace_existing', label: 'Replace existing' },
                                { value: 'keep_both', label: 'Keep both as versions' },
                                { value: 'skip', label: 'Skip' },
                              ]}
                              className="w-full"
                            />
                          ) : row.status === 'student_not_found' ? (
                            <div className="space-y-2">
                              <Select
                                value={row.resolution}
                                onChange={(e) => handleDocumentResolutionChange(row.id, e.target.value as DocumentResolution)}
                                options={[
                                  { value: 'skip', label: 'Skip' },
                                  { value: 'resolve_student', label: `Resolve ${documentRecordType === 'staff' ? 'Employee' : 'Student'}` },
                                ]}
                                className="w-full"
                              />
                              {row.resolution === 'resolve_student' && (
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={documentResolutionDrafts[row.id] || ''}
                                    onChange={(e) => handleDocumentResolutionDraftChange(row.id, e.target.value)}
                                    placeholder={`Enter ${documentRecordType === 'staff' ? 'Employee ID' : 'Admission No.'}`}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                  <Button size="sm" variant="outline" onClick={() => handleApplyResolvedStudent(row.id)}>
                                    Apply
                                  </Button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Fix filename and re-upload or skip</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>
              Showing {filteredDocumentValidationResults.length} of {documentValidationResults.length} files
            </span>
            <span>
              Ready to attach: {documentValidationSummary.importable} files | Will skip: {documentValidationSummary.total - documentValidationSummary.importable} files
            </span>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-lg font-medium">Validation Not Started</p>
          <p className="text-sm mt-1">Click the button below to validate your document ZIP</p>
          <Button className="mt-6" onClick={runDocumentValidation}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Start Validation
          </Button>
        </div>
      )}
    </div>
  )

  const renderAttendanceConfirmSummary = () => (
    <div className="bg-gray-50 rounded-xl p-6 text-left space-y-4">
      <h4 className="font-semibold text-gray-900 pb-2 border-b border-gray-200">Attendance Import Summary</h4>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-sm text-gray-500">Record Type</span>
          <p className="font-medium text-gray-900">{attendanceRecordType === 'staff' ? 'Staff Attendance' : 'Student Attendance'}</p>
        </div>
        <div>
          <span className="text-sm text-gray-500">Attendance Period</span>
          <p className="font-medium text-gray-900">{attendancePeriodInfo.label}</p>
        </div>
        <div>
          <span className="text-sm text-gray-500">Period Range</span>
          <p className="font-medium text-gray-900">{attendancePeriodInfo.range}</p>
        </div>
        <div>
          <span className="text-sm text-gray-500">Source File</span>
          <p className="font-medium text-gray-900 truncate" title={uploadedFile?.name}>
            {uploadedFile?.name}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Total Rows in File</span>
          <span className="font-semibold">{validationSummary.total}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Valid Rows</span>
          <span className="font-semibold text-green-600">{validationSummary.valid}</span>
        </div>
        {validationSummary.warnings > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Rows with Warnings (Half Day / Late)</span>
            <span className="font-semibold text-yellow-600">{validationSummary.warnings}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-600">Rows to Skip (Errors)</span>
          <span className="font-semibold text-red-600">{validationSummary.errors}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-gray-200">
          <span className="font-medium text-gray-900">Total Attendance Records to Post</span>
          <span className="font-bold text-blue-600">{validationSummary.valid + validationSummary.warnings}</span>
        </div>
      </div>

      {Object.keys(attendanceStatusDistribution).length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Status breakdown</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(attendanceStatusDistribution).map(([statusLabel, count]) => (
              <Badge key={statusLabel} variant="secondary">
                {statusLabel}: {count}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderConfirmStep = () => {
    if (isDocumentImport) {
      return (
        <div className="max-w-xl mx-auto py-6">
          {!importResult ? (
            <>
              {isProcessing ? (
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Attaching Documents...</h3>
                    <p className="text-gray-500 mt-2">
                      Please wait while we attach documents to {documentRecordType === 'staff' ? 'employee' : 'student'} profiles
                    </p>
                  </div>
                  <div className="w-full max-w-xs mx-auto">
                    <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div className="bg-blue-600 h-full transition-all duration-300 ease-out" style={{ width: `${Math.min(importProgress, 100)}%` }} />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{Math.round(Math.min(importProgress, 100))}% complete</p>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Ready to Import Documents</h3>
                    <p className="text-gray-500 mt-2">Review the summary below and confirm the document attachment import</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6 text-left space-y-4">
                    <h4 className="font-semibold text-gray-900 pb-2 border-b border-gray-200">Document Import Summary</h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Import Type</span>
                        <p className="font-medium text-gray-900">{documentRecordType === 'staff' ? 'Staff Documents' : 'Student Documents'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">ZIP File</span>
                        <p className="font-medium text-gray-900 truncate" title={uploadedDocumentZip?.name}>
                          {uploadedDocumentZip?.name}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Manifest</span>
                        <p className="font-medium text-gray-900">{uploadedManifestFile?.name || 'Not uploaded'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Matching Logic</span>
                        <p className="font-medium text-gray-900">Filename recognition{uploadedManifestFile ? ' + manifest reference' : ''}</p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Files in ZIP</span>
                        <span className="font-semibold">{documentValidationSummary.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ready Files</span>
                        <span className="font-semibold text-green-600">{documentValidationSummary.ready}</span>
                      </div>
                      {documentValidationSummary.studentNotFound > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Student Not Found</span>
                          <span className="font-semibold text-yellow-600">{documentValidationSummary.studentNotFound}</span>
                        </div>
                      )}
                      {documentValidationSummary.duplicates > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duplicate Documents</span>
                          <span className="font-semibold text-red-600">{documentValidationSummary.duplicates}</span>
                        </div>
                      )}
                      {documentValidationSummary.invalidNames > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Invalid Naming</span>
                          <span className="font-semibold text-red-600">{documentValidationSummary.invalidNames}</span>
                        </div>
                      )}
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="font-medium text-gray-900">Total to Import</span>
                        <span className="font-bold text-blue-600">{documentValidationSummary.importable}</span>
                      </div>
                    </div>
                  </div>

                  {(documentValidationSummary.studentNotFound > 0 || documentValidationSummary.duplicates > 0 || documentValidationSummary.invalidNames > 0) && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
                      <div className="flex gap-2">
                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                        <div className="text-sm text-yellow-800">
                          <p className="font-medium">Review Summary</p>
                          <p className="mt-1">
                            Some files are flagged or will be skipped. Only validated and approved documents will be attached to{' '}
                            {documentRecordType === 'staff' ? 'employee' : 'student'} profiles.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center space-y-8">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${importResult.success ? 'bg-green-100' : 'bg-red-100'}`}>
                {importResult.success ? <CheckCircle className="w-10 h-10 text-green-600" /> : <XCircle className="w-10 h-10 text-red-600" />}
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900">{importResult.success ? 'Document Import Completed!' : 'Document Import Failed'}</h3>
                <p className="text-gray-500 mt-2">
                  {importResult.success
                    ? `Successfully attached ${importResult.importedCount + importResult.warningCount} documents to ${documentRecordType === 'staff' ? 'employee' : 'student'} profiles`
                    : 'There was an error during the document import process'}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 text-left space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-900">Import Details</h4>
                  <span className="text-xs font-mono text-gray-500">{importResult.importId}</span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Attached Automatically</span>
                    <span className="font-semibold text-green-600">{importResult.importedCount} documents</span>
                  </div>
                  {importResult.warningCount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Attached After Review / Resolution</span>
                      <span className="font-semibold text-yellow-600">{importResult.warningCount} documents</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Skipped</span>
                    <span className="font-semibold text-red-600">{importResult.skippedCount} documents</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{formatDuration(importResult.duration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed At</span>
                    <span className="font-medium">{formatDate(importResult.timestamp)}</span>
                  </div>
                </div>
              </div>

              {importResult.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium text-red-800">Skipped Files ({importResult.errors.length})</span>
                    <Button variant="ghost" size="sm" className="text-red-700" onClick={handleDownloadErrorReport}>
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                  </div>
                  <ul className="text-sm text-red-700 space-y-1 max-h-32 overflow-y-auto">
                    {importResult.errors.slice(0, 5).map((error, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="font-mono">{error.fileName || 'Unknown File'}:</span>
                        <span>{error.error}</span>
                      </li>
                    ))}
                    {importResult.errors.length > 5 && <li className="text-gray-500 italic">... and {importResult.errors.length - 5} more</li>}
                  </ul>
                </div>
              )}

              <div className="flex gap-3 justify-center pt-4">
                <Button variant="outline" onClick={handleDownloadImportReport}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
                <Button variant="outline" onClick={handleStartNewImport}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  New Import
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    const target = documentRecordType === 'staff' ? '/hr/employees/documents' : '/students/documents'
                    console.log(`Navigate to ${target}`)
                    alert(`Would navigate to the ${documentRecordType === 'staff' ? 'employee' : 'student'} documents listing page`)
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View {documentRecordType === 'staff' ? 'Employee' : 'Student'} Profiles
                </Button>
              </div>
            </div>
          )}
        </div>
      )
    }

    const attendanceNavigateTarget = attendanceRecordType === 'staff' ? '/hr/attendance' : '/students/attendance'

    return (
      <div className="max-w-xl mx-auto py-6">
        {!importResult ? (
          <>
            {isProcessing ? (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {isAttendanceImport ? 'Posting Attendance Records...' : 'Importing Data...'}
                  </h3>
                  <p className="text-gray-500 mt-2">
                    {isAttendanceImport
                      ? `Writing ${attendanceRecordType === 'staff' ? 'staff' : 'student'} attendance for ${attendancePeriodInfo.label}`
                      : 'Please wait while we process your import'}
                  </p>
                </div>
                <div className="w-full max-w-xs mx-auto">
                  <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-blue-600 h-full transition-all duration-300 ease-out" style={{ width: `${Math.min(importProgress, 100)}%` }} />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{Math.round(Math.min(importProgress, 100))}% complete</p>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {isAttendanceImport ? 'Ready to Post Attendance' : 'Ready to Import'}
                  </h3>
                  <p className="text-gray-500 mt-2">
                    {isAttendanceImport
                      ? `Review the summary below and click “Confirm Import” to post attendance for ${attendancePeriodInfo.label}`
                      : 'Review the summary below and click “Confirm Import” to proceed'}
                  </p>
                </div>

                {isAttendanceImport ? (
                  renderAttendanceConfirmSummary()
                ) : (
                  <div className="bg-gray-50 rounded-xl p-6 text-left space-y-4">
                    <h4 className="font-semibold text-gray-900 pb-2 border-b border-gray-200">Import Summary</h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Entity Type</span>
                        <p className="font-medium text-gray-900">{selectedEntityInfo?.label}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Source File</span>
                        <p className="font-medium text-gray-900 truncate" title={uploadedFile?.name}>
                          {uploadedFile?.name}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Rows in File</span>
                        <span className="font-semibold">{validationSummary.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Valid Rows</span>
                        <span className="font-semibold text-green-600">{validationSummary.valid}</span>
                      </div>
                      {validationSummary.warnings > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rows with Warnings</span>
                          <span className="font-semibold text-yellow-600">{validationSummary.warnings}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rows to Skip (Errors)</span>
                        <span className="font-semibold text-red-600">{validationSummary.errors}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="font-medium text-gray-900">Total to Import</span>
                        <span className="font-bold text-blue-600">{validationSummary.valid + validationSummary.warnings}</span>
                      </div>
                    </div>
                  </div>
                )}

                {validationSummary.warnings > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
                    <div className="flex gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium">Note About Warnings</p>
                        <p className="mt-1">
                          {validationSummary.warnings} rows have warnings but will still be imported.{' '}
                          {isAttendanceImport
                            ? 'Half Day and Late records are stored with a review flag so they can be audited later.'
                            : 'You may want to review and update this data after import.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {validationSummary.errors > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
                    <div className="flex gap-2">
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <div className="text-sm text-red-800">
                        <p className="font-medium">Rows Will Be Skipped</p>
                        <p className="mt-1">
                          {validationSummary.errors} rows have errors and will not be imported. You can download an error report to review these rows.
                        </p>
                        <Button variant="ghost" size="sm" className="mt-2 text-red-700" onClick={handleDownloadErrorReport}>
                          <Download className="w-4 h-4 mr-1" />
                          Download Error Report
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center space-y-8">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${importResult.success ? 'bg-green-100' : 'bg-red-100'}`}>
              {importResult.success ? <CheckCircle className="w-10 h-10 text-green-600" /> : <XCircle className="w-10 h-10 text-red-600" />}
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {importResult.success
                  ? isAttendanceImport
                    ? 'Attendance Posted!'
                    : 'Import Completed!'
                  : 'Import Failed'}
              </h3>
              <p className="text-gray-500 mt-2">
                {importResult.success
                  ? isAttendanceImport
                    ? `Posted ${importResult.importedCount + importResult.warningCount} ${attendanceRecordType === 'staff' ? 'staff' : 'student'} attendance records for ${attendancePeriodInfo.label}`
                    : `Successfully imported ${importResult.importedCount + importResult.warningCount} records`
                  : 'There was an error during the import process'}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 text-left space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <h4 className="font-semibold text-gray-900">Import Details</h4>
                <span className="text-xs font-mono text-gray-500">{importResult.importId}</span>
              </div>

              {importResult.periodSummary && (
                <div className="grid grid-cols-2 gap-4 pb-2 border-b border-gray-200">
                  <div>
                    <span className="text-sm text-gray-500">Record Type</span>
                    <p className="font-medium text-gray-900">{importResult.periodSummary.recordType}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Period</span>
                    <p className="font-medium text-gray-900">{importResult.periodSummary.label}</p>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Successfully Imported</span>
                  <span className="font-semibold text-green-600">
                    {importResult.importedCount} {isAttendanceImport ? 'records' : 'records'}
                  </span>
                </div>
                {importResult.warningCount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Imported with Warnings</span>
                    <span className="font-semibold text-yellow-600">{importResult.warningCount} records</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Skipped (Errors)</span>
                  <span className="font-semibold text-red-600">{importResult.skippedCount} records</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{formatDuration(importResult.duration)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed At</span>
                  <span className="font-medium">{formatDate(importResult.timestamp)}</span>
                </div>
              </div>
            </div>

            {importResult.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-red-800">Skipped Rows ({importResult.errors.length})</span>
                  <Button variant="ghost" size="sm" className="text-red-700" onClick={handleDownloadErrorReport}>
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </Button>
                </div>
                <ul className="text-sm text-red-700 space-y-1 max-h-32 overflow-y-auto">
                  {importResult.errors.slice(0, 5).map((error, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="font-mono">Row {error.row}:</span>
                      <span>{error.error}</span>
                    </li>
                  ))}
                  {importResult.errors.length > 5 && <li className="text-gray-500 italic">... and {importResult.errors.length - 5} more</li>}
                </ul>
              </div>
            )}

            <div className="flex gap-3 justify-center pt-4">
              <Button variant="outline" onClick={handleDownloadImportReport}>
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              <Button variant="outline" onClick={handleStartNewImport}>
                <RefreshCw className="w-4 h-4 mr-2" />
                New Import
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  const target = isAttendanceImport
                    ? attendanceNavigateTarget
                    : isCombinedImport
                    ? combinedRecordType === 'student'
                      ? '/students'
                      : '/employees'
                    : `/${selectedEntity}s`
                  console.log(`Navigate to ${target}`)
                  alert(`Would navigate to ${target} listing page`)
                }}
              >
                <Eye className="w-4 h-4 mr-2" />
                {isAttendanceImport
                  ? attendanceRecordType === 'staff'
                    ? 'View Staff Attendance'
                    : 'View Student Attendance'
                  : 'View Imported Data'}
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ==================== RENDER ====================

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Import Wizard</h1>
          <p className="text-sm text-gray-500">Bulk import structured data, attendance registers and student documents from external files</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowHistory(!showHistory)}>
            <Clock className="w-4 h-4 mr-2" />
            {showHistory ? 'Hide History' : 'Import History'} ({importHistory.length})
          </Button>
          <Button variant="outline" onClick={() => handleDownloadTemplate()}>
            <FileText className="w-4 h-4 mr-2" />
            Download Data Templates
          </Button>
        </div>
      </div>

      {showHistory && (
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Import History</h3>
            <div className="flex gap-2">
              <Select
                value={historyFilter}
                onChange={(e) => setHistoryFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'partial', label: 'Partial' },
                  { value: 'failed', label: 'Failed' },
                ]}
                className="w-40"
              />
              {importHistory.length > 0 && (
                <Button variant="ghost" size="sm" onClick={handleClearHistory}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => setShowHistory(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No import history available</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table
                columns={[
                  {
                    key: 'id',
                    header: 'Import ID',
                    render: (row: ImportHistoryItem) => <span className="font-mono text-xs">{row.id}</span>,
                  },
                  {
                    key: 'entityLabel',
                    header: 'Entity',
                  },
                  {
                    key: 'fileName',
                    header: 'File Name',
                    render: (row: ImportHistoryItem) => (
                      <span className="truncate max-w-[150px] block" title={row.fileName}>
                        {row.fileName}
                      </span>
                    ),
                  },
                  {
                    key: 'periodLabel',
                    header: 'Period',
                    render: (row: ImportHistoryItem) => <span className="text-sm text-gray-600">{row.periodLabel || '—'}</span>,
                  },
                  {
                    key: 'importedCount',
                    header: 'Imported',
                    render: (row: ImportHistoryItem) => <span className="text-green-600 font-medium">{row.importedCount}</span>,
                  },
                  {
                    key: 'skippedCount',
                    header: 'Skipped',
                    render: (row: ImportHistoryItem) => <span className="text-red-600 font-medium">{row.skippedCount}</span>,
                  },
                  {
                    key: 'timestamp',
                    header: 'Date',
                    render: (row: ImportHistoryItem) => <span className="text-sm">{formatDate(row.timestamp)}</span>,
                  },
                  {
                    key: 'user',
                    header: 'User',
                  },
                  {
                    key: 'status',
                    header: 'Status',
                    render: (row: ImportHistoryItem) => (
                      <Badge variant={row.status === 'completed' ? 'success' : row.status === 'partial' ? 'warning' : 'danger'}>
                        {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                      </Badge>
                    ),
                  },
                  {
                    key: 'actions',
                    header: 'Actions',
                    render: (row: ImportHistoryItem) => (
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteHistoryItem(row.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    ),
                  },
                ]}
                data={filteredHistory}
              />
            </div>
          )}
        </Card>
      )}

      <div className="relative py-4">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded"></div>
        <div className="relative flex justify-between max-w-3xl mx-auto">
          {steps.map((stepItem) => (
            <div
              key={stepItem.num}
              className={`flex flex-col items-center gap-2 bg-white px-3 ${stepItem.num < step ? 'cursor-pointer' : ''}`}
              onClick={() => handleGoToStep(stepItem.num)}
              title={stepItem.description}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                  step > stepItem.num
                    ? 'bg-green-600 text-white scale-90'
                    : step === stepItem.num
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step > stepItem.num ? <CheckCircle className="w-5 h-5" /> : stepItem.num}
              </div>
              <span className={`text-xs font-medium text-center ${step >= stepItem.num ? 'text-blue-700' : 'text-gray-500'}`}>{stepItem.label}</span>
            </div>
          ))}
        </div>
      </div>

      <Card className="min-h-[500px] flex flex-col">
        <div className="p-6 flex-grow">
          {step === 1 && renderStepOne()}
          {(isCombinedImport || isDocumentImport || isAttendanceImport) && step === stepRecordTypeClass && renderRecordTypeClassStep()}
          {step === stepUpload && (isDocumentImport ? renderDocumentUploadStep() : renderDataUploadStep())}
          {isDocumentImport && step === stepRules && renderDocumentRulesStep()}
          {step === stepValidate && (isDocumentImport ? renderDocumentValidationStep() : renderDataValidationStep())}
          {step === stepConfirm && renderConfirmStep()}
        </div>

        {!importResult && (
          <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-gray-50">
            <Button variant="outline" data-action="previous-step" onClick={handlePreviousStep} disabled={step === 1 || isProcessing}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="text-sm text-gray-500">
              Step {step} of {steps.length}: {steps[step - 1]?.label}
            </div>

            {step < stepConfirm ? (
              <Button onClick={handleNextStep} disabled={!canProceedToNextStep() || isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {getNextButtonLabel()}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleStartImport}
                disabled={
                  isProcessing ||
                  (isDocumentImport ? documentValidationSummary.importable === 0 : validationSummary.valid + validationSummary.warnings === 0)
                }
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm Import
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </Card>

      {!isDocumentImport && showPreviewModal && previewRowData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Row {previewRowData.row} Details</h3>
                <div className="flex items-center gap-2 mt-1">
                  {previewRowData.status === 'valid' ? (
                    <Badge variant="success">Valid</Badge>
                  ) : previewRowData.status === 'warning' ? (
                    <Badge variant="warning">Warning</Badge>
                  ) : (
                    <Badge variant="danger">Error</Badge>
                  )}
                  {previewRowData.isEdited && <Badge variant="secondary">Edited</Badge>}
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleClosePreview}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Field Values</h4>
                <div className="grid gap-2">
                  {columnMappings
                    .filter((mapping) => mapping.field !== 'ignore')
                    .map((mapping, index) => {
                      const value = previewRowData.rawData[mapping.colIndex]
                      const fieldError = previewRowData.fieldErrors.find((error) => error.field === mapping.header)
                      const hasError = !!fieldError

                      return (
                        <div key={index} className={`p-3 rounded-lg ${hasError ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <span className="text-sm font-medium text-gray-700">
                                {mapping.header}
                                {mapping.required && <span className="text-red-500 ml-1">*</span>}
                              </span>
                              {editingCell?.rowIndex === previewRowData.row - 1 && editingCell?.colIndex === mapping.colIndex ? (
                                <div className="flex items-center gap-2 mt-1">
                                  <input
                                    type="text"
                                    value={editingCell.value}
                                    onChange={(e) => handleEditChange(e.target.value)}
                                    className="flex-grow px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    autoFocus
                                  />
                                  <Button variant="ghost" size="sm" onClick={handleSaveEdit}>
                                    <Save className="w-4 h-4 text-green-600" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                                    <X className="w-4 h-4 text-gray-500" />
                                  </Button>
                                </div>
                              ) : (
                                <p className="text-gray-900 mt-1">{value || <span className="text-gray-400 italic">Empty</span>}</p>
                              )}
                            </div>
                            {!(editingCell?.rowIndex === previewRowData.row - 1 && editingCell?.colIndex === mapping.colIndex) && (
                              <Button variant="ghost" size="sm" onClick={() => handleStartEdit(previewRowData.row - 1, mapping.colIndex, value || '')}>
                                <Edit className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          {fieldError && (
                            <p className="text-sm text-red-600 mt-2">
                              <AlertCircle className="w-4 h-4 inline mr-1" />
                              {fieldError.message}
                            </p>
                          )}
                        </div>
                      )
                    })}
                </div>
              </div>

              {previewRowData.fieldErrors.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-700 mb-3">All Issues ({previewRowData.fieldErrors.length})</h4>
                  <div className="space-y-2">
                    {previewRowData.fieldErrors.map((error, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <span className="font-medium text-red-800">{error.field}:</span>
                          <span className="text-red-700 ml-1">{error.message}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-between">
              <Button variant="outline" onClick={() => handleDeleteRow(previewRowData.row - 1)}>
                <Trash2 className="w-4 h-4 mr-2 text-red-500" />
                Remove Row
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    handleClosePreview()
                    runValidation()
                  }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Re-validate
                </Button>
                <Button variant="primary" onClick={handleClosePreview}>
                  Done
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataImportWizard
