import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { MultiSelect } from '../../../components/ui/MultiSelect';
import { Toggle } from '../../../components/ui/Toggle';
import {
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ClockIcon,
  CopyIcon,
  DownloadIcon,
  EyeIcon,
  FileTextIcon,
  FilterIcon,
  FolderIcon,
  GraduationCapIcon,
  HelpCircleIcon,
  BookOpenIcon,
  BriefcaseIcon,
  UsersIcon,
  WalletIcon,
  PlayIcon,
  PlusIcon,
  PrinterIcon,
  RefreshCwIcon,
  SaveIcon,
  SearchIcon,
  StarIcon,
  Trash2Icon,
  XIcon,
} from 'lucide-react';

type ModuleId = 'info' | 'attendance' | 'admission' | 'staff' | 'fees' | 'academic' | 'payroll';
type Kind = 'text' | 'number' | 'date' | 'select' | 'multi' | 'boolean' | 'percent';
type Logic = 'AND' | 'OR';
type ReportType = 'table' | 'chart' | 'both';
type Status = 'Draft' | 'Saved' | 'Scheduled';
type ChartKind = 'bar' | 'pie' | 'line' | 'donut' | 'area' | 'heat';

interface FieldDef {
  id: string;
  label: string;
  group: string;
  module: ModuleId;
  kind: Kind;
  options?: { value: string; label: string }[];
  required?: boolean;
}

interface FilterItem {
  id: string;
  field: string;
  operator: string;
  value: string;
  value2: string;
  picks: string[];
}

interface FilterGroup {
  id: string;
  name: string;
  logic: Logic;
  collapsed: boolean;
  filters: FilterItem[];
}

interface FormatRule {
  id: string;
  field: string;
  operator: string;
  value: string;
  style: 'red-row' | 'yellow-row' | 'orange-text' | 'blue-border' | 'icon';
}

interface SavedReport {
  id: string;
  name: string;
  description: string;
  category: string;
  reportType: ReportType;
  visibility: string;
  theme: string;
  modules: ModuleId[];
  combine: boolean;
  columns: string[];
  groups: FilterGroup[];
  groupConnector: Logic;
  logicMode: 'AND' | 'OR' | 'MIXED';
  groupBy: string[];
  showSubtotals: boolean;
  sortKey: string;
  sortDir: 'asc' | 'desc';
  sortKey2: string;
  sortDir2: 'asc' | 'desc';
  aggregations: string[];
  summaryPos: 'bottom' | 'top' | 'both';
  formatRules: FormatRule[];
  favourite: boolean;
  scheduled: boolean;
  createdAt: string;
  lastRun: string;
  createdBy: string;
}

type Row = Record<string, string>;

const STORAGE = 'k12-advanced-report-builder-v1';
const REQUIRED = ['studentId', 'fullName'];

const o = (list: string[]) => list.map((v) => ({ value: v, label: v }));
const years = o(['2023-24', '2024-25', '2025-26']);
const classes = o(['Nursery', 'LKG', 'UKG', ...Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`)]);
const sections = o(['A', 'B', 'C', 'D']);
const genders = o(['Male', 'Female', 'Transgender', 'Other']);
const bloods = o(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']);
const religions = o(['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other']);
const categories = o(['General', 'OBC', 'SC', 'ST', 'EWS', 'NT', 'VJ']);
const streams = o(['Science', 'Commerce', 'Arts', 'Vocational']);
const mediums = o(['English', 'Hindi', 'Gujarati', 'Marathi']);
const boards = o(['CBSE', 'ICSE', 'State Board', 'IB', 'IGCSE']);
const shifts = o(['Morning', 'Afternoon', 'Full Day']);
const statuses = o(['Active', 'Inactive', 'Transferred', 'Dropped', 'Alumni']);
const studentTypes = o(['Regular', 'Private', 'Ex-Student']);
const yn = o(['Yes', 'No']);
const submitted = o(['Submitted', 'Pending', 'Not Submitted', 'Not Applicable']);
const attStatuses = o(['Present', 'Absent', 'Late', 'Half Day', 'Leave', 'Holiday']);
const attCats = o(['Excellent', 'Good', 'Average', 'Poor']);
const leaveTypes = o(['Medical', 'Casual', 'Emergency', 'Approved']);
const entryModes = o(['Manual', 'Biometric', 'RFID', 'App']);
const admStatuses = o(['New', 'Shortlisted', 'Approved', 'Rejected', 'Waitlisted', 'Pending']);
const appModes = o(['Online', 'Offline', 'Walk-in']);
const seatTypes = o(['General', 'RTE', 'Management', 'NRI', 'Minority']);
const occupations = o(['Govt. Service', 'Private', 'Business', 'Farmer', 'Housewife', 'Other']);
const quals = o(['Illiterate', 'Primary', 'Secondary', 'Graduate', 'Post Graduate']);
const districts = o(['Ahmedabad', 'Gandhinagar', 'Surat', 'Vadodara', 'Rajkot']);
const states = o(['Gujarat', 'Maharashtra', 'Rajasthan', 'Delhi']);
const areas = o(['Urban', 'Rural', 'Semi-Urban', 'Tribal']);
const bplTypes = o(['APL', 'BPL', 'Antyodaya', 'NA']);
const months = o(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']);
const weekdays = o(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
const houses = o(['Red', 'Blue', 'Green', 'Yellow']);
const routes = o(['Route 1', 'Route 2', 'Route 3', 'Route 4']);
const teachers = o(['Mrs. Patel', 'Mr. Verma', 'Mr. Joshi', 'Ms. Iyer', 'Mrs. Nair']);
const disabilities = o(['Locomotor', 'Visual', 'Hearing', 'Intellectual', 'Multiple']);
const scholarships = o(['Government', 'Private', 'Merit', 'Minority', 'SC/ST']);
const parentTypes = o(['Both', 'Single Father', 'Single Mother', 'Guardian']);
const bmi = o(['Underweight', 'Normal', 'Overweight', 'Obese']);
const medical = o(['Asthma', 'Allergy', 'Diabetes', 'None']);
const vac = o(['Complete', 'Partial', 'Pending']);
const examElig = o(['Eligible', 'Not Eligible', 'Borderline']);
const absentReasons = o(['Sick', 'Family', 'Unknown', 'Suspended']);
const minAtt = o(['<75%', '<60%', '<50%', 'Custom']);
const terms = o(['Term 1', 'Term 2', 'Term 3']);
const categoriesTag = o(['Monthly', 'Weekly', 'Government', 'Internal', 'Academic', 'Custom']);
const themes = [
  { id: 'blue', hex: '#1E88E5' },
  { id: 'green', hex: '#43A047' },
  { id: 'red', hex: '#E53935' },
  { id: 'purple', hex: '#7E57C2' },
  { id: 'orange', hex: '#FB8C00' },
  { id: 'grey', hex: '#757575' },
];

function F(id: string, label: string, group: string, module: ModuleId, kind: Kind, options?: { value: string; label: string }[], required?: boolean): FieldDef {
  return { id, label, group, module, kind, options, required };
}

const FIELDS: FieldDef[] = [
  F('studentId', 'Student ID', 'Identity', 'info', 'text', undefined, true),
  F('fullName', 'Full Name', 'Identity', 'info', 'text', undefined, true),
  F('firstName', 'First Name', 'Identity', 'info', 'text'),
  F('dob', 'Date of Birth', 'Identity', 'info', 'date'),
  F('age', 'Age', 'Identity', 'info', 'number'),
  F('gender', 'Gender', 'Identity', 'info', 'multi', genders),
  F('bloodGroup', 'Blood Group', 'Identity', 'info', 'multi', bloods),
  F('nationality', 'Nationality', 'Identity', 'info', 'select', o(['Indian', 'Other'])),
  F('motherTongue', 'Mother Tongue', 'Identity', 'info', 'select', mediums),
  F('religion', 'Religion', 'Identity', 'info', 'multi', religions),
  F('category', 'Caste / Category', 'Identity', 'info', 'multi', categories),
  F('aadhar', 'Aadhar Number', 'Identity', 'info', 'text'),
  F('aadharStatus', 'Aadhar Enrollment', 'Identity', 'info', 'select', o(['Enrolled', 'Not Enrolled', 'Applied'])),
  F('udise', 'UDISE Student Code', 'Identity', 'info', 'text'),
  F('pen', 'PEN Number', 'Identity', 'info', 'text'),
  F('apaar', 'APAAR ID', 'Identity', 'info', 'text'),
  F('minority', 'Minority Status', 'Identity', 'info', 'boolean', yn),
  F('bpl', 'BPL Status', 'Identity', 'info', 'boolean', yn),
  F('bplCard', 'BPL Card Number', 'Identity', 'info', 'text'),
  F('divyang', 'Disability / Divyang', 'Identity', 'info', 'boolean', yn),
  F('disabilityType', 'Disability Type', 'Identity', 'info', 'multi', disabilities),
  F('disabilityPct', 'Disability %', 'Identity', 'info', 'number'),
  F('orphan', 'Orphan Status', 'Identity', 'info', 'select', o(['Both Parents', 'Single', 'Orphan'])),
  F('ration', 'Ration Card Type', 'Identity', 'info', 'select', bplTypes),

  F('academicYear', 'Academic Year', 'Academic', 'info', 'select', years),
  F('className', 'Class / Grade', 'Academic', 'info', 'multi', classes),
  F('section', 'Section', 'Academic', 'info', 'multi', sections),
  F('stream', 'Stream', 'Academic', 'info', 'multi', streams),
  F('medium', 'Medium', 'Academic', 'info', 'select', mediums),
  F('board', 'Board', 'Academic', 'info', 'select', boards),
  F('shift', 'Shift', 'Academic', 'info', 'select', shifts),
  F('rollNo', 'Roll Number', 'Academic', 'info', 'text'),
  F('grNo', 'GR Number', 'Academic', 'info', 'text'),
  F('admissionNo', 'Admission Number', 'Academic', 'info', 'text'),
  F('house', 'House / Group', 'Academic', 'info', 'select', houses),
  F('classTeacher', 'Class Teacher', 'Academic', 'info', 'select', teachers),
  F('status', 'Student Status', 'Academic', 'info', 'multi', statuses),
  F('studentType', 'Student Type', 'Academic', 'info', 'select', studentTypes),
  F('busUser', 'School Bus User', 'Academic', 'info', 'boolean', yn),
  F('busRoute', 'Bus Route', 'Academic', 'info', 'select', routes),
  F('hostel', 'Hostel Resident', 'Academic', 'info', 'boolean', yn),
  F('concession', 'Fee Concession', 'Academic', 'info', 'boolean', yn),
  F('scholarship', 'Scholarship Holder', 'Academic', 'info', 'boolean', yn),
  F('scholarshipType', 'Scholarship Type', 'Academic', 'info', 'multi', scholarships),
  F('rte', 'RTE Student', 'Academic', 'info', 'boolean', yn),
  F('ncc', 'NCC Cadet', 'Academic', 'info', 'boolean', yn),
  F('nss', 'NSS Member', 'Academic', 'info', 'boolean', yn),

  F('fatherName', 'Father Name', 'Parent Info', 'info', 'text'),
  F('fatherOcc', 'Father Occupation', 'Parent Info', 'info', 'select', occupations),
  F('fatherIncome', 'Father Annual Income', 'Parent Info', 'info', 'number'),
  F('fatherQual', 'Father Qualification', 'Parent Info', 'info', 'select', quals),
  F('motherName', 'Mother Name', 'Parent Info', 'info', 'text'),
  F('motherOcc', 'Mother Occupation', 'Parent Info', 'info', 'select', occupations),
  F('familyIncome', 'Family Annual Income', 'Parent Info', 'info', 'number'),
  F('parentType', 'Parent Type', 'Parent Info', 'info', 'select', parentTypes),
  F('guardianName', 'Guardian Name', 'Parent Info', 'info', 'text'),
  F('contact', 'Contact No.', 'Parent Info', 'info', 'text'),

  F('city', 'Village / Town / City', 'Address', 'info', 'text'),
  F('district', 'District', 'Address', 'info', 'select', districts),
  F('state', 'State', 'Address', 'info', 'select', states),
  F('pincode', 'PIN Code', 'Address', 'info', 'text'),
  F('areaType', 'Area Type', 'Address', 'info', 'select', areas),
  F('distanceKm', 'Distance from School (KM)', 'Address', 'info', 'number'),

  F('height', 'Height (cm)', 'Health', 'info', 'number'),
  F('weight', 'Weight (kg)', 'Health', 'info', 'number'),
  F('bmiCat', 'BMI Category', 'Health', 'info', 'select', bmi),
  F('medicalCond', 'Medical Condition', 'Health', 'info', 'multi', medical),
  F('vaccination', 'Vaccination Status', 'Health', 'info', 'select', vac),
  F('ayushman', 'Ayushman Bharat Card', 'Health', 'info', 'boolean', yn),

  F('attDate', 'Attendance Date', 'Attendance', 'attendance', 'date'),
  F('attMonth', 'Month', 'Attendance', 'attendance', 'select', months),
  F('attTerm', 'Term / Quarter', 'Attendance', 'attendance', 'select', terms),
  F('weekday', 'Day of Week', 'Attendance', 'attendance', 'multi', weekdays),
  F('attStatus', 'Attendance Status', 'Attendance', 'attendance', 'multi', attStatuses),
  F('attPct', 'Overall Attendance %', 'Attendance', 'attendance', 'percent'),
  F('monthPct', 'Monthly Attendance %', 'Attendance', 'attendance', 'percent'),
  F('belowMin', 'Below Minimum Attendance', 'Attendance', 'attendance', 'select', minAtt),
  F('attCategory', 'Attendance Category', 'Attendance', 'attendance', 'select', attCats),
  F('presentDays', 'Total Present Days', 'Attendance', 'attendance', 'number'),
  F('absentDays', 'Total Absent Days', 'Attendance', 'attendance', 'number'),
  F('lateDays', 'Total Late Days', 'Attendance', 'attendance', 'number'),
  F('leaveDays', 'Total Leave Days', 'Attendance', 'attendance', 'number'),
  F('contAbsent', 'Continuous Absent Days', 'Attendance', 'attendance', 'number'),
  F('examElig', 'Exam Eligibility', 'Attendance', 'attendance', 'select', examElig),
  F('absentReason', 'Absent Reason', 'Attendance', 'attendance', 'select', absentReasons),
  F('leaveType', 'Leave Type', 'Attendance', 'attendance', 'multi', leaveTypes),
  F('lateArrival', 'Late Arrival', 'Attendance', 'attendance', 'boolean', yn),
  F('markedBy', 'Attendance Marked By', 'Attendance', 'attendance', 'select', teachers),
  F('entryMode', 'Entry Mode', 'Attendance', 'attendance', 'select', entryModes),
  F('smsSent', 'SMS Sent to Parent', 'Attendance', 'attendance', 'boolean', yn),

  F('applicationNo', 'Application Number', 'Admission', 'admission', 'text'),
  F('appDate', 'Application Date', 'Admission', 'admission', 'date'),
  F('appMode', 'Application Mode', 'Admission', 'admission', 'select', appModes),
  F('classApplying', 'Class Applying For', 'Admission', 'admission', 'multi', classes),
  F('appStatus', 'Application Status', 'Admission', 'admission', 'multi', admStatuses),
  F('sibling', 'Sibling in School', 'Admission', 'admission', 'boolean', yn),
  F('admissionDate', 'Admission Date', 'Admission', 'admission', 'date'),
  F('admStatus', 'Admission Status', 'Admission', 'admission', 'multi', admStatuses),
  F('approvedBy', 'Approved By', 'Admission', 'admission', 'select', teachers),
  F('seatType', 'Seat Type', 'Admission', 'admission', 'select', seatTypes),
  F('classAllotted', 'Class Allotted', 'Admission', 'admission', 'multi', classes),
  F('sectionAllotted', 'Section Allotted', 'Admission', 'admission', 'multi', sections),
  F('grIssued', 'GR Number Issued', 'Admission', 'admission', 'boolean', yn),
  F('birthCert', 'Birth Certificate', 'Admission', 'admission', 'select', submitted),
  F('tcReceived', 'TC Received', 'Admission', 'admission', 'select', submitted),
  F('aadharCopy', 'Aadhar Copy', 'Admission', 'admission', 'select', submitted),
  F('docsComplete', 'All Documents Complete', 'Admission', 'admission', 'select', o(['Yes', 'No', 'Partial'])),
  F('prevSchool', 'Previous School Name', 'Admission', 'admission', 'text'),
  F('prevBoard', 'Previous Board', 'Admission', 'admission', 'select', boards),
  F('prevMarks', 'Previous % Marks', 'Admission', 'admission', 'percent'),
  F('admFeePaid', 'Admission Fee Paid', 'Admission', 'admission', 'select', o(['Paid', 'Unpaid', 'Partial'])),
  F('rteFree', 'RTE Free Admission', 'Admission', 'admission', 'boolean', yn),
  F('employeeId', 'Employee ID', 'Staff', 'staff', 'text', undefined, true),
  F('empName', 'Employee Name', 'Staff', 'staff', 'text', undefined, true),
  F('department', 'Department', 'Staff', 'staff', 'select', o(['Science', 'Mathematics', 'Administration', 'Sports', 'Languages'])),
  F('designation', 'Designation', 'Staff', 'staff', 'select', o(['PGT', 'TGT', 'PRT', 'Clerk', 'Principal'])),
  F('empStatus', 'Employment Status', 'Staff', 'staff', 'select', o(['Active', 'On Leave', 'Resigned'])),
  F('joiningDate', 'Joining Date', 'Staff', 'staff', 'date'),
  F('salary', 'Gross Salary', 'Staff', 'staff', 'number'),
  F('feeHead', 'Fee Head', 'Fees', 'fees', 'select', o(['Tuition', 'Transport', 'Hostel', 'Exam'])),
  F('invoiceNo', 'Invoice No', 'Fees', 'fees', 'text'),
  F('feeStatus', 'Fee Status', 'Fees', 'fees', 'select', o(['Paid', 'Partial', 'Outstanding'])),
  F('amountDue', 'Amount Due', 'Fees', 'fees', 'number'),
  F('amountPaid', 'Amount Paid', 'Fees', 'fees', 'number'),
  F('teacherName', 'Teacher', 'Academic', 'academic', 'text'),
  F('subject', 'Subject', 'Academic', 'academic', 'select', o(['Math', 'Science', 'English', 'SST'])),
  F('chapter', 'Chapter', 'Academic', 'academic', 'text'),
  F('planStatus', 'Plan Status', 'Academic', 'academic', 'select', o(['Draft', 'Pending', 'Approved'])),
  F('completionPct', 'Plan Completion %', 'Academic', 'academic', 'percent'),
  F('payHead', 'Pay Head', 'Payroll', 'payroll', 'select', o(['Basic', 'HRA', 'DA'])),
  F('grossPay', 'Gross Pay', 'Payroll', 'payroll', 'number'),
  F('netPay', 'Net Pay', 'Payroll', 'payroll', 'number'),
];

const MODULES: { id: ModuleId; label: string; sub: string; count: string; color: string; active: string; icon: React.ReactNode }[] = [
  { id: 'info', label: 'Student Information', sub: 'Identity, academic, parent', count: '1,240 Rec.', color: 'text-blue-700', active: 'border-blue-500 bg-blue-50', icon: <FolderIcon className="h-5 w-5 text-blue-600" /> },
  { id: 'attendance', label: 'Attendance', sub: 'Daily & summary', count: '45,600 Rec.', color: 'text-green-700', active: 'border-green-500 bg-green-50', icon: <CalendarIcon className="h-5 w-5 text-green-600" /> },
  { id: 'admission', label: 'Admission', sub: 'Application & documents', count: '320 Rec.', color: 'text-orange-700', active: 'border-orange-500 bg-orange-50', icon: <GraduationCapIcon className="h-5 w-5 text-orange-600" /> },
  { id: 'staff', label: 'Staff / HR', sub: 'Employee records', count: '186 Rec.', color: 'text-purple-700', active: 'border-purple-500 bg-purple-50', icon: <BriefcaseIcon className="h-5 w-5 text-purple-600" /> },
  { id: 'fees', label: 'Fees (ERP)', sub: 'Invoices & collection', count: '2,410 Rec.', color: 'text-emerald-700', active: 'border-emerald-500 bg-emerald-50', icon: <WalletIcon className="h-5 w-5 text-emerald-600" /> },
  { id: 'academic', label: 'Academic', sub: 'Plans & subjects', count: '980 Rec.', color: 'text-indigo-700', active: 'border-indigo-500 bg-indigo-50', icon: <BookOpenIcon className="h-5 w-5 text-indigo-600" /> },
  { id: 'payroll', label: 'Payroll (ERP)', sub: 'Pay heads & salary', count: '186 Rec.', color: 'text-rose-700', active: 'border-rose-500 bg-rose-50', icon: <UsersIcon className="h-5 w-5 text-rose-600" /> },
];

const FIRST = ['Priya', 'Anjali', 'Sneha', 'Aarav', 'Rohan', 'Diya', 'Kabir', 'Myra', 'Vihaan', 'Isha', 'Ananya', 'Reyansh'];
const LAST = ['Sharma', 'Verma', 'Patil', 'Shah', 'Patel', 'Nair', 'Joshi', 'Mehta', 'Rao', 'Desai', 'Kapoor', 'Iyer'];
const CITIES = ['Ahmedabad', 'Gandhinagar', 'Surat', 'Vadodara', 'Rajkot'];

function makeRow(i: number): Row {
  const first = FIRST[i % FIRST.length];
  const last = LAST[i % LAST.length];
  const gender = i % 5 === 0 ? 'Male' : i % 3 === 0 ? 'Female' : i % 11 === 0 ? 'Other' : 'Female';
  const cls = classes[4 + (i % 10)].value;
  const section = sections[i % 4].value;
  const att = 52 + ((i * 11) % 48);
  const present = Math.round((att / 100) * 180);
  const absent = 180 - present;
  const cat = categories[i % categories.length].value;
  const rte = i % 6 === 0 ? 'Yes' : 'No';
  const bpl = i % 7 === 0 ? 'Yes' : 'No';
  const divyang = i % 13 === 0 ? 'Yes' : 'No';
  const adm = admStatuses[i % admStatuses.length].value;
  const status = att < 60 ? 'Dropped' : statuses[i % 3].value;
  const month = String((i % 8) + 4).padStart(2, '0');
  const day = String(8 + (i % 18)).padStart(2, '0');
  return {
    studentId: `STU-${1001 + i}`,
    fullName: `${first} ${last}`,
    firstName: first,
    dob: `${2010 + (i % 8)}-${month}-${day}`,
    age: String(10 + (i % 8)),
    gender,
    bloodGroup: bloods[i % bloods.length].value,
    nationality: 'Indian',
    motherTongue: mediums[i % 3].value,
    religion: religions[i % religions.length].value,
    category: cat,
    aadhar: `XXXX-XXXX-${1000 + i}`,
    aadharStatus: i % 9 === 0 ? 'Applied' : 'Enrolled',
    udise: `UDISE-${24000 + i}`,
    pen: `PEN-${33000 + i}`,
    apaar: `APAAR-${44000 + i}`,
    minority: i % 8 === 0 ? 'Yes' : 'No',
    bpl,
    bplCard: bpl === 'Yes' ? `BPL-${i}` : '',
    divyang,
    disabilityType: divyang === 'Yes' ? disabilities[i % disabilities.length].value : '',
    disabilityPct: divyang === 'Yes' ? String(20 + (i % 40)) : '0',
    orphan: i % 17 === 0 ? 'Orphan' : 'Both Parents',
    ration: bplTypes[i % bplTypes.length].value,
    academicYear: i % 10 === 0 ? '2024-25' : '2025-26',
    className: cls,
    section,
    stream: cls.includes('11') || cls.includes('12') ? streams[i % 3].value : '',
    medium: mediums[i % 3].value,
    board: 'CBSE',
    shift: shifts[i % 3].value,
    rollNo: String(1 + (i % 40)),
    grNo: `GR-2025-${200 + i}`,
    admissionNo: `ADM-2025-${1200 + i}`,
    house: houses[i % 4].value,
    classTeacher: teachers[i % teachers.length].value,
    status,
    studentType: studentTypes[i % 3].value,
    busUser: i % 3 === 0 ? 'Yes' : 'No',
    busRoute: i % 3 === 0 ? routes[i % 4].value : '',
    hostel: i % 9 === 0 ? 'Yes' : 'No',
    concession: i % 5 === 0 ? 'Yes' : 'No',
    scholarship: i % 6 === 0 ? 'Yes' : 'No',
    scholarshipType: i % 6 === 0 ? scholarships[i % scholarships.length].value : '',
    rte,
    ncc: i % 10 === 0 ? 'Yes' : 'No',
    nss: i % 11 === 0 ? 'Yes' : 'No',
    fatherName: `${['Rajesh', 'Nilesh', 'Suresh', 'Amit'][i % 4]} ${last}`,
    fatherOcc: occupations[i % occupations.length].value,
    fatherIncome: String(180000 + i * 12000),
    fatherQual: quals[i % quals.length].value,
    motherName: `${['Meena', 'Kavita', 'Anjali', 'Pooja'][i % 4]} ${last}`,
    motherOcc: occupations[(i + 2) % occupations.length].value,
    familyIncome: String(280000 + i * 15000),
    parentType: parentTypes[i % parentTypes.length].value,
    guardianName: '',
    contact: `98${70000000 + i}`,
    city: CITIES[i % CITIES.length],
    district: districts[i % districts.length].value,
    state: 'Gujarat',
    pincode: `3800${10 + (i % 80)}`,
    areaType: areas[i % areas.length].value,
    distanceKm: String(1 + (i % 18)),
    height: String(130 + (i % 40)),
    weight: String(28 + (i % 30)),
    bmiCat: bmi[i % bmi.length].value,
    medicalCond: medical[i % medical.length].value,
    vaccination: vac[i % vac.length].value,
    ayushman: i % 4 === 0 ? 'Yes' : 'No',
    attDate: `2026-${month}-${day}`,
    attMonth: months[(Number(month) - 1) % 12].value,
    attTerm: terms[i % 3].value,
    weekday: weekdays[i % 6].value,
    attStatus: att < 60 ? 'Absent' : attStatuses[i % 3].value,
    attPct: String(att),
    monthPct: String(Math.max(40, att - 4)),
    belowMin: att < 50 ? '<50%' : att < 60 ? '<60%' : att < 75 ? '<75%' : '',
    attCategory: att >= 90 ? 'Excellent' : att >= 75 ? 'Good' : att >= 60 ? 'Average' : 'Poor',
    presentDays: String(present),
    absentDays: String(absent),
    lateDays: String(i % 8),
    leaveDays: String(i % 5),
    contAbsent: String(att < 60 ? 6 + (i % 5) : i % 3),
    examElig: att >= 75 ? 'Eligible' : att >= 60 ? 'Borderline' : 'Not Eligible',
    absentReason: att < 75 ? absentReasons[i % absentReasons.length].value : '',
    leaveType: leaveTypes[i % leaveTypes.length].value,
    lateArrival: i % 4 === 0 ? 'Yes' : 'No',
    markedBy: teachers[i % teachers.length].value,
    entryMode: entryModes[i % entryModes.length].value,
    smsSent: i % 2 === 0 ? 'Yes' : 'No',
    applicationNo: `APP-26-${500 + i}`,
    appDate: `2025-${month}-04`,
    appMode: appModes[i % 3].value,
    classApplying: cls,
    appStatus: adm,
    sibling: i % 5 === 0 ? 'Yes' : 'No',
    admissionDate: `2025-04-${String(10 + (i % 15)).padStart(2, '0')}`,
    admStatus: adm,
    approvedBy: teachers[i % teachers.length].value,
    seatType: rte === 'Yes' ? 'RTE' : seatTypes[i % seatTypes.length].value,
    classAllotted: cls,
    sectionAllotted: section,
    grIssued: 'Yes',
    birthCert: submitted[i % 3].value,
    tcReceived: submitted[(i + 1) % 4].value,
    aadharCopy: i % 9 === 0 ? 'Not Submitted' : 'Submitted',
    docsComplete: i % 9 === 0 ? 'Partial' : 'Yes',
    prevSchool: i % 4 === 0 ? 'City Public School' : 'Green Valley School',
    prevBoard: boards[i % 3].value,
    prevMarks: String(62 + (i % 35)),
    admFeePaid: i % 8 === 0 ? 'Partial' : 'Paid',
    rteFree: rte,
    employeeId: `EMP-${1000 + i}`,
    empName: `${['Meera', 'Rajesh', 'Kavita', 'Anil'][i % 4]} ${last}`,
    department: ['Science', 'Mathematics', 'Administration', 'Sports', 'Languages'][i % 5],
    designation: ['PGT', 'TGT', 'PRT', 'Clerk', 'Principal'][i % 5],
    empStatus: i % 9 === 0 ? 'On Leave' : 'Active',
    joiningDate: `201${i % 9}-06-01`,
    salary: String(35000 + i * 1200),
    feeHead: ['Tuition', 'Transport', 'Hostel', 'Exam'][i % 4],
    invoiceNo: `INV-26-${2000 + i}`,
    feeStatus: i % 4 === 0 ? 'Outstanding' : i % 3 === 0 ? 'Partial' : 'Paid',
    amountDue: String(i % 4 === 0 ? 12000 + i * 100 : 0),
    amountPaid: String(8000 + i * 200),
    teacherName: teachers[i % teachers.length].value,
    subject: ['Math', 'Science', 'English', 'SST'][i % 4],
    chapter: `Chapter ${1 + (i % 8)}`,
    planStatus: i % 5 === 0 ? 'Pending' : i % 7 === 0 ? 'Draft' : 'Approved',
    completionPct: String(40 + ((i * 7) % 60)),
    payHead: ['Basic', 'HRA', 'DA'][i % 3],
    grossPay: String(42000 + i * 800),
    netPay: String(38000 + i * 700),
  };
}

const ROWS = Array.from({ length: 40 }, (_, i) => makeRow(i));
const DEFAULT_COLS = ['studentId', 'fullName', 'className', 'section', 'gender', 'attPct', 'status'];
const COLS_BY_MODULE: Record<ModuleId, string[]> = {
  info: DEFAULT_COLS,
  attendance: ['studentId', 'fullName', 'className', 'attPct', 'attStatus', 'presentDays'],
  admission: ['studentId', 'fullName', 'classApplying', 'appStatus', 'admissionDate'],
  staff: ['employeeId', 'empName', 'department', 'designation', 'empStatus'],
  fees: ['studentId', 'fullName', 'feeHead', 'invoiceNo', 'feeStatus', 'amountDue'],
  academic: ['teacherName', 'className', 'subject', 'planStatus', 'completionPct'],
  payroll: ['employeeId', 'empName', 'payHead', 'grossPay', 'netPay'],
};

const OPS: Record<Kind, { value: string; label: string }[]> = {
  text: o(['Is Equal To', 'Is Not Equal To', 'Contains', 'Does Not Contain', 'Starts With', 'Ends With', 'Is Empty', 'Is Not Empty']).map((x, i) => ({
    value: ['eq', 'neq', 'contains', 'notcontains', 'starts', 'ends', 'empty', 'notempty'][i],
    label: x.label,
  })),
  number: [
    { value: 'eq', label: '=' }, { value: 'neq', label: '≠' }, { value: 'gt', label: '>' }, { value: 'lt', label: '<' },
    { value: 'gte', label: '≥' }, { value: 'lte', label: '≤' }, { value: 'between', label: 'Between' }, { value: 'empty', label: 'Is Empty' },
  ],
  percent: [
    { value: 'eq', label: '=' }, { value: 'gt', label: '>' }, { value: 'lt', label: '<' }, { value: 'gte', label: '≥' },
    { value: 'lte', label: '≤' }, { value: 'between', label: 'Between' },
  ],
  date: [
    { value: 'eq', label: 'Is' }, { value: 'neq', label: 'Is Not' }, { value: 'before', label: 'Before' }, { value: 'after', label: 'After' },
    { value: 'between', label: 'Between' }, { value: 'empty', label: 'Is Empty' },
  ],
  select: [
    { value: 'eq', label: 'Is' }, { value: 'neq', label: 'Is Not' }, { value: 'any', label: 'Is Any Of' }, { value: 'none', label: 'Is None Of' }, { value: 'empty', label: 'Is Empty' },
  ],
  multi: [
    { value: 'eq', label: 'Is' }, { value: 'neq', label: 'Is Not' }, { value: 'any', label: 'Is Any Of' }, { value: 'none', label: 'Is None Of' }, { value: 'empty', label: 'Is Empty' },
  ],
  boolean: [{ value: 'eq', label: 'Is Yes' }, { value: 'neq', label: 'Is No' }],
};

function uid() {
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}
function stamp() {
  return new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
function emptyFilter(): FilterItem {
  return { id: uid(), field: 'className', operator: 'eq', value: '', value2: '', picks: [] };
}
function emptyGroup(n: number): FilterGroup {
  return { id: uid(), name: `Filter group ${n}`, logic: 'AND', collapsed: false, filters: [emptyFilter()] };
}
function csvEscape(v: string) {
  if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}
function fieldById(id: string) {
  return FIELDS.find((f) => f.id === id);
}
function matchText(raw: string, op: string, val: string) {
  const a = raw.toLowerCase();
  const b = val.toLowerCase();
  if (op === 'empty') return !raw;
  if (op === 'notempty') return Boolean(raw);
  if (!b && op !== 'empty') return true;
  if (op === 'eq') return a === b;
  if (op === 'neq') return a !== b;
  if (op === 'contains') return a.includes(b);
  if (op === 'notcontains') return !a.includes(b);
  if (op === 'starts') return a.startsWith(b);
  if (op === 'ends') return a.endsWith(b);
  return true;
}
function matchNum(raw: string, op: string, val: string, val2: string) {
  if (op === 'empty') return !raw;
  const n = parseFloat(raw);
  const v = parseFloat(val);
  const v2 = parseFloat(val2);
  if (Number.isNaN(n)) return false;
  if (op === 'eq') return n === v;
  if (op === 'neq') return n !== v;
  if (op === 'gt') return n > v;
  if (op === 'lt') return n < v;
  if (op === 'gte') return n >= v;
  if (op === 'lte') return n <= v;
  if (op === 'between') return n >= v && n <= v2;
  return true;
}
function matchDate(raw: string, op: string, val: string, val2: string) {
  if (op === 'empty') return !raw;
  if (!raw) return false;
  if (op === 'eq') return raw === val;
  if (op === 'neq') return raw !== val;
  if (op === 'before') return raw < val;
  if (op === 'after') return raw > val;
  if (op === 'between') return raw >= val && raw <= val2;
  return true;
}
function matchFilter(row: Row, f: FilterItem) {
  const def = fieldById(f.field);
  if (!def) return true;
  const raw = String(row[f.field] ?? '');
  const op = f.operator;
  if (def.kind === 'boolean') {
    if (op === 'eq') return raw === 'Yes';
    if (op === 'neq') return raw === 'No';
  }
  if (['select', 'multi'].includes(def.kind)) {
    if (op === 'empty') return !raw;
    if (op === 'any' || op === 'none') {
      const hit = f.picks.includes(raw);
      return op === 'any' ? hit : !hit;
    }
    if (op === 'eq') return f.value ? raw === f.value : true;
    if (op === 'neq') return f.value ? raw !== f.value : true;
  }
  if (def.kind === 'text') return matchText(raw, op, f.value);
  if (def.kind === 'number' || def.kind === 'percent') return matchNum(raw, op, f.value, f.value2);
  if (def.kind === 'date') return matchDate(raw, op, f.value, f.value2);
  return true;
}
function filterActive(f: FilterItem) {
  if (!f.field) return false;
  if (f.picks.length) return true;
  if (f.operator === 'empty' || f.operator === 'notempty') return true;
  if (f.operator === 'eq' && fieldById(f.field)?.kind === 'boolean') return true;
  return Boolean(f.value);
}

function printHtml(title: string, cols: FieldDef[], rows: Row[]) {
  const html = `<!doctype html><html><head><title>${title}</title>
    <style>body{font-family:Arial,sans-serif;padding:24px;color:#212121}h1{font-size:18px}
    table{width:100%;border-collapse:collapse;font-size:12px}th,td{border:1px solid #e0e0e0;padding:8px;text-align:left}th{background:#f5f7fa}</style></head>
    <body><h1>${title}</h1>
    <table><thead><tr>${cols.map((c) => `<th>${c.label}</th>`).join('')}</tr></thead>
    <tbody>${rows.map((r) => `<tr>${cols.map((c) => `<td>${r[c.id] || ''}</td>`).join('')}</tr>`).join('')}</tbody></table>
    <p>Generated ${stamp()}</p></body></html>`;
  const frame = document.createElement('iframe');
  frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
  document.body.appendChild(frame);
  const win = frame.contentWindow;
  if (!win) return;
  win.document.open();
  win.document.write(html);
  win.document.close();
  setTimeout(() => {
    win.focus();
    win.print();
    document.body.removeChild(frame);
  }, 250);
}

const PRESETS: { id: string; label: string; apply: () => { columns: string[]; groups: FilterGroup[] } }[] = [
  {
    id: 'today-absent',
    label: 'Today Absent',
    apply: () => ({
      columns: ['studentId', 'fullName', 'className', 'section', 'attStatus', 'attPct', 'contact'],
      groups: [{ id: uid(), name: 'Attendance', logic: 'AND', collapsed: false, filters: [{ id: uid(), field: 'attStatus', operator: 'eq', value: 'Absent', value2: '', picks: [] }] }],
    }),
  },
  {
    id: 'low-att',
    label: 'Low Attendance',
    apply: () => ({
      columns: ['studentId', 'fullName', 'className', 'attPct', 'absentDays', 'examElig'],
      groups: [{ id: uid(), name: 'Attendance', logic: 'AND', collapsed: false, filters: [{ id: uid(), field: 'attPct', operator: 'lt', value: '75', value2: '', picks: [] }] }],
    }),
  },
  {
    id: 'rte',
    label: 'RTE Students',
    apply: () => ({
      columns: ['studentId', 'fullName', 'className', 'rte', 'seatType', 'admStatus'],
      groups: [{ id: uid(), name: 'RTE', logic: 'AND', collapsed: false, filters: [{ id: uid(), field: 'rte', operator: 'eq', value: 'Yes', value2: '', picks: [] }] }],
    }),
  },
  {
    id: 'scst',
    label: 'SC/ST List',
    apply: () => ({
      columns: ['studentId', 'fullName', 'className', 'category', 'scholarship', 'contact'],
      groups: [{ id: uid(), name: 'Category', logic: 'OR', collapsed: false, filters: [{ id: uid(), field: 'category', operator: 'any', value: '', value2: '', picks: ['SC', 'ST'] }] }],
    }),
  },
  {
    id: 'pending-adm',
    label: 'Pending Admissions',
    apply: () => ({
      columns: ['applicationNo', 'fullName', 'classApplying', 'appStatus', 'docsComplete'],
      groups: [{ id: uid(), name: 'Admission', logic: 'AND', collapsed: false, filters: [{ id: uid(), field: 'appStatus', operator: 'eq', value: 'Pending', value2: '', picks: [] }] }],
    }),
  },
  {
    id: 'bpl',
    label: 'BPL Students',
    apply: () => ({
      columns: ['studentId', 'fullName', 'className', 'bpl', 'ration', 'familyIncome'],
      groups: [{ id: uid(), name: 'BPL', logic: 'AND', collapsed: false, filters: [{ id: uid(), field: 'bpl', operator: 'eq', value: 'Yes', value2: '', picks: [] }] }],
    }),
  },
  {
    id: 'new-adm',
    label: 'New Admissions',
    apply: () => ({
      columns: ['admissionNo', 'fullName', 'className', 'admissionDate', 'admStatus'],
      groups: [{ id: uid(), name: 'Admission', logic: 'AND', collapsed: false, filters: [{ id: uid(), field: 'admStatus', operator: 'eq', value: 'Approved', value2: '', picks: [] }] }],
    }),
  },
];

const GOV: { id: string; label: string; columns: string[]; field: string; value: string; picks?: string[] }[] = [
  { id: 'udise', label: 'UDISE Report', columns: ['studentId', 'fullName', 'udise', 'className', 'gender', 'category', 'aadharStatus'], field: 'udise', value: '' },
  { id: 'dropout', label: 'Dropout Report', columns: ['studentId', 'fullName', 'className', 'status', 'attPct'], field: 'status', value: 'Dropped' },
  { id: 'schol', label: 'Scholarship List', columns: ['studentId', 'fullName', 'className', 'scholarshipType', 'category'], field: 'scholarship', value: 'Yes' },
  { id: 'divyang', label: 'Divyang Report', columns: ['studentId', 'fullName', 'className', 'disabilityType', 'disabilityPct'], field: 'divyang', value: 'Yes' },
  { id: 'enrol', label: 'Enrolment Report', columns: ['studentId', 'fullName', 'className', 'section', 'gender', 'admissionDate'], field: 'status', value: 'Active' },
  { id: 'aadhar', label: 'Aadhar Seeding', columns: ['studentId', 'fullName', 'aadhar', 'aadharStatus', 'apaar'], field: 'aadharStatus', value: 'Enrolled' },
];

const HELP_STEPS = [
  { title: 'Choose a module', body: 'Pick a student, staff or ERP module (fees, academic, payroll). System modules are not included. Combine joins related records.' },
  { title: 'Name the report', body: 'Give it a name, category and visibility. Table, chart, or both.' },
  { title: 'Pick columns', body: 'Search or tick fields by group. Student ID and Name stay selected. Drag chips to reorder.' },
  { title: 'Add filters', body: 'Build AND / OR conditions, or start from a preset / government template.' },
  { title: 'Preview & export', body: 'The right panel updates live. Save, schedule, or export PDF / Excel / CSV / print / email.' },
];

export function AdvancedReportBuilder() {
  const [activeModule, setActiveModule] = useState<ModuleId>('info');
  const [combine, setCombine] = useState(false);
  const [combineWith, setCombineWith] = useState<ModuleId[]>(['info', 'attendance']);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Custom');
  const [reportType, setReportType] = useState<ReportType>('table');
  const [visibility, setVisibility] = useState('Private');
  const [theme, setTheme] = useState('blue');
  const [status, setStatus] = useState<Status>('Draft');
  const [columns, setColumns] = useState<string[]>(DEFAULT_COLS);
  const [colSearch, setColSearch] = useState('');
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ Identity: true, Academic: true });
  const [logicMode, setLogicMode] = useState<'AND' | 'OR' | 'MIXED'>('AND');
  const [groups, setGroups] = useState<FilterGroup[]>([emptyGroup(1)]);
  const [groupConnector, setGroupConnector] = useState<Logic>('AND');
  const [groupBy, setGroupBy] = useState<string[]>([]);
  const [showSubtotals, setShowSubtotals] = useState(true);
  const [sortKey, setSortKey] = useState('attPct');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [sortKey2, setSortKey2] = useState('fullName');
  const [sortDir2, setSortDir2] = useState<'asc' | 'desc'>('asc');
  const [aggregations, setAggregations] = useState<string[]>(['count', 'avg']);
  const [summaryPos, setSummaryPos] = useState<'bottom' | 'top' | 'both'>('bottom');
  const [formatRules, setFormatRules] = useState<FormatRule[]>([
    { id: 'r1', field: 'attPct', operator: 'lt', value: '60', style: 'red-row' },
    { id: 'r2', field: 'attPct', operator: 'lt', value: '75', style: 'yellow-row' },
  ]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [picked, setPicked] = useState<string[]>([]);
  const [tableSearch, setTableSearch] = useState('');
  const [notice, setNotice] = useState('');
  const [saved, setSaved] = useState<SavedReport[]>([]);
  const [drawer, setDrawer] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpStep, setHelpStep] = useState(0);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'xlsx' | 'csv' | 'print' | 'email'>('xlsx');
  const [exportScope, setExportScope] = useState<'all' | 'selected' | 'page'>('all');
  const [emailTo, setEmailTo] = useState('');
  const [emailCc, setEmailCc] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [schedName, setSchedName] = useState('');
  const [freq, setFreq] = useState('monthly');
  const [schedTime, setSchedTime] = useState('08:00');
  const [schedDay, setSchedDay] = useState('1');
  const [chartKind, setChartKind] = useState<ChartKind>('bar');
  const [chartX, setChartX] = useState('className');
  const [dragId, setDragId] = useState<string | null>(null);
  const [customLabel, setCustomLabel] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [hoverField, setHoverField] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      setSaved(raw ? (JSON.parse(raw) as SavedReport[]) : []);
    } catch {
      setSaved([]);
    }
  }, []);

  const persist = (next: SavedReport[]) => {
    setSaved(next);
    localStorage.setItem(STORAGE, JSON.stringify(next));
  };

  const enabledModules: ModuleId[] = combine ? (combineWith.length ? combineWith : [activeModule]) : [activeModule];
  const availableFields = useMemo(() => {
    const set = new Set(enabledModules);
    return FIELDS.filter((f) => set.has(f.module) || f.required);
  }, [enabledModules]);

  const selectedDefs = columns.map((id) => fieldById(id)).filter((f): f is FieldDef => Boolean(f));

  const matched = useMemo(() => {
    const activeGroups = groups.map((g) => ({ ...g, filters: g.filters.filter(filterActive) })).filter((g) => g.filters.length);
    if (!activeGroups.length) return ROWS;
    const groupHit = (row: Row, g: FilterGroup) => {
      const flags = g.filters.map((f) => matchFilter(row, f));
      return g.logic === 'OR' ? flags.some(Boolean) : flags.every(Boolean);
    };
    return ROWS.filter((row) => {
      const flags = activeGroups.map((g) => groupHit(row, g));
      if (logicMode === 'OR') return flags.some(Boolean);
      if (logicMode === 'MIXED') return groupConnector === 'OR' ? flags.some(Boolean) : flags.every(Boolean);
      return flags.every(Boolean);
    });
  }, [groups, logicMode, groupConnector]);

  const searched = useMemo(() => {
    const q = tableSearch.trim().toLowerCase();
    if (!q) return matched;
    return matched.filter((row) => columns.some((k) => String(row[k] || '').toLowerCase().includes(q)));
  }, [matched, tableSearch, columns]);

  const sorted = useMemo(() => {
    const list = [...searched];
    const cmp = (a: Row, b: Row, key: string, dir: 'asc' | 'desc') => {
      if (!key) return 0;
      const n = String(a[key] || '').localeCompare(String(b[key] || ''), undefined, { numeric: true });
      return dir === 'asc' ? n : -n;
    };
    list.sort((a, b) => cmp(a, b, sortKey, sortDir) || cmp(a, b, sortKey2, sortDir2));
    return list;
  }, [searched, sortKey, sortDir, sortKey2, sortDir2]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const avgAtt = sorted.length
    ? (sorted.reduce((s, r) => s + (parseFloat(r.attPct) || 0), 0) / sorted.length).toFixed(1)
    : '0';

  const chips = groups.flatMap((g) => g.filters.filter(filterActive).map((f) => ({ ...f, groupId: g.id })));

  const exportRows = exportScope === 'selected'
    ? sorted.filter((r) => picked.includes(r.studentId))
    : exportScope === 'page'
      ? pageRows
      : sorted;

  const toggleColumn = (id: string) => {
    if (REQUIRED.includes(id)) return;
    setColumns((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const resetAll = () => {
    setName('');
    setDescription('');
    setCategory('Custom');
    setReportType('table');
    setVisibility('Private');
    setTheme('blue');
    setStatus('Draft');
    setColumns(DEFAULT_COLS);
    setGroups([emptyGroup(1)]);
    setLogicMode('AND');
    setGroupBy([]);
    setPicked([]);
    setPage(1);
    setTableSearch('');
    setNotice('Started a new report');
  };

  const snapshot = (): SavedReport => ({
    id: uid(),
    name: name.trim() || `Untitled ${stamp()}`,
    description,
    category,
    reportType,
    visibility,
    theme,
    modules: enabledModules,
    combine,
    columns,
    groups,
    groupConnector,
    logicMode,
    groupBy,
    showSubtotals,
    sortKey,
    sortDir,
    sortKey2,
    sortDir2,
    aggregations,
    summaryPos,
    formatRules,
    favourite: false,
    scheduled: status === 'Scheduled',
    createdAt: stamp(),
    lastRun: stamp(),
    createdBy: 'Admin',
  });

  const loadSaved = (r: SavedReport, run?: boolean) => {
    setName(r.name);
    setDescription(r.description);
    setCategory(r.category);
    setReportType(r.reportType);
    setVisibility(r.visibility);
    setTheme(r.theme);
    setCombine(r.combine);
    setCombineWith(r.modules);
    setActiveModule(r.modules[0] || 'info');
    setColumns(r.columns);
    setGroups(r.groups);
    setGroupConnector(r.groupConnector);
    setLogicMode(r.logicMode);
    setGroupBy(r.groupBy);
    setShowSubtotals(r.showSubtotals);
    setSortKey(r.sortKey);
    setSortDir(r.sortDir);
    setSortKey2(r.sortKey2);
    setSortDir2(r.sortDir2);
    setAggregations(r.aggregations);
    setSummaryPos(r.summaryPos);
    setFormatRules(r.formatRules);
    setStatus(r.scheduled ? 'Scheduled' : 'Saved');
    setDrawer(false);
    if (run) {
      persist(saved.map((s) => (s.id === r.id ? { ...s, lastRun: stamp() } : s)));
      setNotice(`Generated “${r.name}” again`);
    } else {
      setNotice(`Loaded “${r.name}”`);
    }
  };

  const confirmSave = () => {
    if (!name.trim()) {
      setNotice('Report name is required');
      return;
    }
    const rec = snapshot();
    persist([rec, ...saved.filter((s) => s.name.toLowerCase() !== rec.name.toLowerCase())]);
    setStatus('Saved');
    setSaveOpen(false);
    setNotice(`Report saved successfully!`);
  };

  const doExport = () => {
    const title = name.trim() || 'Advanced report';
    const cols = selectedDefs;
    if (exportFormat === 'email') {
      setExportOpen(false);
      setNotice(`Report queued to ${emailTo || 'recipients'}`);
      return;
    }
    if (exportFormat === 'print' || exportFormat === 'pdf') {
      printHtml(title, cols, exportRows);
      setExportOpen(false);
      setNotice(exportFormat === 'pdf' ? 'PDF print dialog opened' : 'Print preview opened');
      return;
    }
    const lines = [cols.map((c) => csvEscape(c.label)).join(','), ...exportRows.map((row) => cols.map((c) => csvEscape(row[c.id] || '')).join(','))];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${title.replace(/\s+/g, '-').toLowerCase()}.${exportFormat === 'xlsx' ? 'csv' : 'csv'}`;
    a.click();
    URL.revokeObjectURL(a.href);
    setExportOpen(false);
    setNotice('Export downloaded');
  };

  const applyPreset = (p: (typeof PRESETS)[0]) => {
    const next = p.apply();
    setColumns(Array.from(new Set([...REQUIRED, ...next.columns])));
    setGroups(next.groups);
    setNotice(`Applied preset “${p.label}”`);
  };

  const applyGov = (g: (typeof GOV)[0]) => {
    setColumns(Array.from(new Set([...REQUIRED, ...g.columns])));
    setGroups([{
      id: uid(),
      name: g.label,
      logic: 'AND',
      collapsed: false,
      filters: [{ id: uid(), field: g.field, operator: g.picks ? 'any' : 'eq', value: g.value, value2: '', picks: g.picks || [] }],
    }]);
    setCategory('Government');
    setNotice(`Loaded ${g.label} template`);
  };

  const rowStyle = (row: Row) => {
    const att = parseFloat(row.attPct) || 0;
    let cls = '';
    formatRules.forEach((rule) => {
      const raw = row[rule.field] || '';
      const n = parseFloat(raw);
      let hit = false;
      if (rule.operator === 'lt') hit = n < parseFloat(rule.value);
      if (rule.operator === 'eq') hit = raw === rule.value;
      if (!hit) return;
      if (rule.style === 'red-row') cls = 'bg-red-50';
      else if (rule.style === 'yellow-row' && cls !== 'bg-red-50') cls = 'bg-amber-50';
      else if (rule.style === 'orange-text') cls += ' text-orange-700';
      else if (rule.style === 'blue-border') cls += ' border-l-4 border-l-blue-500';
    });
    if (row.gender === 'Female' && !cls.includes('border-l')) cls += ' border-l-4 border-l-blue-400';
    return cls;
  };

  const groupedPreview = useMemo(() => {
    if (!groupBy[0]) return [{ key: '', rows: pageRows }];
    const map = new Map<string, Row[]>();
    pageRows.forEach((r) => {
      const key = groupBy.map((k) => r[k] || '—').join(' · ');
      map.set(key, [...(map.get(key) || []), r]);
    });
    return Array.from(map.entries()).map(([key, rows]) => ({ key, rows }));
  }, [pageRows, groupBy]);

  const chartData = useMemo(() => {
    const map = new Map<string, number>();
    sorted.forEach((r) => {
      const k = r[chartX] || '—';
      map.set(k, (map.get(k) || 0) + 1);
    });
    return Array.from(map.entries()).map(([label, value]) => ({ label, value }));
  }, [sorted, chartX]);

  const themeHex = themes.find((t) => t.id === theme)?.hex || '#1E88E5';

  const onDragStart = (id: string) => setDragId(id);
  const onDrop = (id: string) => {
    if (!dragId || dragId === id) return;
    setColumns((prev) => {
      const next = [...prev];
      const from = next.indexOf(dragId);
      const to = next.indexOf(id);
      if (from < 0 || to < 0) return prev;
      next.splice(from, 1);
      next.splice(to, 0, dragId);
      return next;
    });
    setDragId(null);
  };

  const colGroups = Array.from(new Set(availableFields.map((f) => f.group)));

  return (
    <div className="min-h-screen space-y-4 p-5" style={{ background: '#F5F7FA', color: '#212121' }}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm text-gray-500">Dashboard &gt; Reports &gt; Advanced Report Builder</p>
          <h1 className="mt-1 flex items-center gap-2 text-2xl font-bold text-gray-900">
            <FilterIcon className="h-6 w-6" style={{ color: '#1E88E5' }} />
            Advanced Report Builder
          </h1>
          <p className="text-sm text-gray-500">Build powerful custom reports with advanced filters, grouping, and export options</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
            <Badge variant={status === 'Draft' ? 'warning' : status === 'Scheduled' ? 'info' : 'success'}>● {status}</Badge>
            <span className="text-gray-500">Data last synced: 27 Oct 2026, 09:45 AM</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" size="sm" onClick={() => { setHelpStep(0); setHelpOpen(true); }}>
            <HelpCircleIcon className="h-4 w-4" /> Help
          </Button>
          <Button variant="outline" size="sm" onClick={() => setDrawer(true)}>
            <FileTextIcon className="h-4 w-4" /> Saved Reports
          </Button>
          <Button variant="primary" size="sm" onClick={resetAll}>
            <PlusIcon className="h-4 w-4" /> New Report
          </Button>
        </div>
      </div>

      {notice && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">{notice}</div>
      )}

      <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
        <div className="space-y-4 xl:w-[38%] xl:max-h-[calc(100vh-150px)] xl:overflow-y-auto xl:pr-1">
          <Card title="Select module">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {MODULES.map((m) => {
                const on = activeModule === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setActiveModule(m.id);
                      setColumns(COLS_BY_MODULE[m.id]);
                    }}
                    className={`rounded-lg border p-3 text-left ${on ? m.active : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center justify-between">
                      {m.icon}
                      {on && <CheckIcon className="h-4 w-4 text-blue-600" />}
                    </div>
                    <p className={`mt-2 text-sm font-semibold ${m.color}`}>{m.label}</p>
                    <p className="text-xs text-gray-500">{m.count}</p>
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex flex-col gap-2">
              <Toggle label="Combine modules" checked={combine} onChange={setCombine} size="sm" />
              {combine && (
                <>
                  <p className="text-xs text-gray-500">Records will be joined by Student ID.</p>
                  <MultiSelect
                    options={MODULES.map((m) => ({ value: m.id, label: m.label }))}
                    value={combineWith}
                    onChange={(v) => setCombineWith(v as ModuleId[])}
                    placeholder="Student Info + Attendance"
                  />
                </>
              )}
            </div>
          </Card>

          <Card title="Report information">
            <div className="space-y-3">
              <Input label="Report name *" value={name} maxLength={100} onChange={(e) => setName(e.target.value)} placeholder="e.g. Monthly attendance — Class 10" />
              <Textarea label="Description" value={description} maxLength={300} rows={2} onChange={(e) => setDescription(e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <Select label="Category / Tag" value={category} options={categoriesTag} onChange={setCategory} />
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-700">Report type</p>
                  <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
                    {(['table', 'chart', 'both'] as ReportType[]).map((t) => (
                      <button key={t} type="button" onClick={() => setReportType(t)} className={`flex-1 rounded-md px-2 py-1.5 text-sm capitalize ${reportType === t ? 'bg-white font-medium shadow-sm' : 'text-gray-600'}`}>{t}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-gray-700">Visibility</p>
                <div className="flex flex-wrap gap-3 text-sm">
                  {['Private', 'Shared with Staff', 'Public'].map((v) => (
                    <label key={v} className="flex items-center gap-1.5">
                      <input type="radio" checked={visibility === v} onChange={() => setVisibility(v)} /> {v}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-gray-700">Report colour theme</p>
                <div className="flex gap-2">
                  {themes.map((t) => (
                    <button key={t.id} type="button" onClick={() => setTheme(t.id)} className={`h-6 w-6 rounded-full border-2 ${theme === t.id ? 'border-gray-900' : 'border-white'}`} style={{ background: t.hex }} />
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card
            title="Select columns"
            headerAction={<span className="text-sm text-gray-500">{columns.length} columns selected</span>}
          >
            <Input className="mb-2" placeholder="Search columns..." leftIcon={<SearchIcon className="h-4 w-4 text-gray-400" />} value={colSearch} onChange={(e) => setColSearch(e.target.value)} />
            <div className="mb-3 flex flex-wrap gap-1.5">
              <Button variant="outline" size="xs" onClick={() => setColumns(Array.from(new Set([...REQUIRED, ...availableFields.map((f) => f.id)])))}>Select All</Button>
              <Button variant="outline" size="xs" onClick={() => setColumns([...REQUIRED])}>Clear All</Button>
              <Button variant="outline" size="xs" onClick={() => setColumns(DEFAULT_COLS)}>Reset Default</Button>
              <Button variant="ghost" size="xs" onClick={() => setShowCustom((v) => !v)}>+ Add Custom Column</Button>
            </div>
            {showCustom && (
              <div className="mb-3 flex gap-2">
                <Input placeholder="Column label" value={customLabel} onChange={(e) => setCustomLabel(e.target.value)} />
                <Button size="sm" onClick={() => { if (customLabel.trim()) { const id = `custom_${uid()}`; FIELDS.push(F(id, customLabel.trim(), 'Identity', 'info', 'text')); setColumns((p) => [...p, id]); setCustomLabel(''); setShowCustom(false); } }}>Add</Button>
              </div>
            )}
            <div className="mb-3 flex flex-wrap gap-1.5">
              {selectedDefs.map((f) => (
                <span
                  key={f.id}
                  draggable
                  onDragStart={() => onDragStart(f.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onDrop(f.id)}
                  className="inline-flex cursor-grab items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-sm text-blue-800"
                >
                  ⠿ {f.label}
                  {!f.required && (
                    <button type="button" onClick={() => toggleColumn(f.id)}><XIcon className="h-3.5 w-3.5" /></button>
                  )}
                </span>
              ))}
            </div>
            <p className="mb-2 text-xs text-gray-500">Drag ⠿ columns to reorder them. Student ID and Name stay selected.</p>
            <div className="max-h-72 space-y-2 overflow-y-auto">
              {colGroups.map((group) => {
                const q = colSearch.trim().toLowerCase();
                const items = availableFields.filter((f) => f.group === group && (!q || f.label.toLowerCase().includes(q)));
                if (!items.length) return null;
                const open = openGroups[group] !== false;
                return (
                  <div key={group} className="rounded-lg border border-gray-200">
                    <button type="button" className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium" onClick={() => setOpenGroups((p) => ({ ...p, [group]: p[group] === false }))}>
                      {group}
                      {open ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />}
                    </button>
                    {open && (
                      <div className="grid grid-cols-1 gap-1 border-t border-gray-100 p-2 sm:grid-cols-2">
                        {items.map((f) => {
                          const on = columns.includes(f.id);
                          return (
                            <label key={f.id} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm hover:bg-gray-50" onMouseEnter={() => setHoverField(f.id)} onMouseLeave={() => setHoverField(null)}>
                              <input type="checkbox" className="h-4 w-4" checked={on} disabled={f.required} onChange={() => toggleColumn(f.id)} />
                              <span>{f.label}{f.required ? ' *' : ''}</span>
                              {hoverField === f.id && (
                                <span className="ml-auto text-xs text-gray-400">{ROWS[0]?.[f.id] || f.kind}</span>
                              )}
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          <Card
            title="Search filters"
            headerAction={
              <div className="flex gap-1">
                <Button variant="outline" size="xs" onClick={() => setGroups((p) => p.map((g, i) => i === 0 ? { ...g, filters: [...g.filters, emptyFilter()] } : g))}>+ Add Filter</Button>
                <Button variant="ghost" size="xs" onClick={() => setGroups([emptyGroup(1)])}>Clear All</Button>
              </div>
            }
          >
            <div className="mb-3 flex gap-1 rounded-lg bg-gray-100 p-1 text-sm">
              {(['AND', 'OR', 'MIXED'] as const).map((m) => (
                <button key={m} type="button" onClick={() => setLogicMode(m)} className={`flex-1 rounded-md px-2 py-1.5 ${logicMode === m ? 'bg-white font-medium shadow-sm' : 'text-gray-600'}`}>
                  {m === 'MIXED' ? 'Mixed (Group)' : m}
                </button>
              ))}
            </div>
            {groups.map((g, gi) => (
              <div key={g.id} className="mb-3 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between px-3 py-2">
                  <button type="button" className="flex items-center gap-2 text-sm font-medium" onClick={() => setGroups((p) => p.map((x) => x.id === g.id ? { ...x, collapsed: !x.collapsed } : x))}>
                    {g.collapsed ? <ChevronRightIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                    {g.name} [{g.logic}]
                  </button>
                  <div className="flex gap-1">
                    <Select value={g.logic} options={[{ value: 'AND', label: 'AND' }, { value: 'OR', label: 'OR' }]} onChange={(v) => setGroups((p) => p.map((x) => x.id === g.id ? { ...x, logic: v as Logic } : x))} className="w-24" />
                    <Button variant="ghost" size="xs" onClick={() => setGroups((p) => [...p, { ...g, id: uid(), name: `${g.name} copy`, filters: g.filters.map((f) => ({ ...f, id: uid() })) }])}>Copy</Button>
                    {groups.length > 1 && <Button variant="ghost" size="xs" onClick={() => setGroups((p) => p.filter((x) => x.id !== g.id))}><XIcon className="h-3.5 w-3.5" /></Button>}
                  </div>
                </div>
                {!g.collapsed && (
                  <div className="space-y-2 border-t border-gray-100 p-3">
                    {g.filters.map((f) => {
                      const def = fieldById(f.field);
                      const ops = def ? OPS[def.kind] : OPS.text;
                      return (
                        <div key={f.id} className="grid grid-cols-1 gap-1 rounded-md bg-gray-50 p-2 md:grid-cols-[1fr_110px_1fr_auto]">
                          <Select
                            value={f.field}
                            options={availableFields.map((x) => ({ value: x.id, label: `${x.group} · ${x.label}` }))}
                            onChange={(v) => setGroups((p) => p.map((gr) => gr.id === g.id ? { ...gr, filters: gr.filters.map((it) => it.id === f.id ? { ...it, field: v, operator: OPS[fieldById(v)?.kind || 'text'][0].value, value: '', picks: [] } : it) } : gr))}
                          />
                          <Select value={f.operator} options={ops} onChange={(v) => setGroups((p) => p.map((gr) => gr.id === g.id ? { ...gr, filters: gr.filters.map((it) => it.id === f.id ? { ...it, operator: v } : it) } : gr))} />
                          <FilterValue def={def} item={f} onChange={(next) => setGroups((p) => p.map((gr) => gr.id === g.id ? { ...gr, filters: gr.filters.map((it) => it.id === f.id ? next : it) } : gr))} />
                          <button type="button" className="text-red-500" onClick={() => setGroups((p) => p.map((gr) => gr.id === g.id ? { ...gr, filters: gr.filters.filter((it) => it.id !== f.id) } : gr))}><XIcon className="h-4 w-4" /></button>
                        </div>
                      );
                    })}
                    <Button variant="outline" size="xs" onClick={() => setGroups((p) => p.map((gr) => gr.id === g.id ? { ...gr, filters: [...gr.filters, emptyFilter()] } : gr))}>+ Add filter</Button>
                  </div>
                )}
                {logicMode === 'MIXED' && gi < groups.length - 1 && (
                  <div className="border-t px-3 py-1 text-center text-xs font-medium text-gray-500">{groupConnector} between groups</div>
                )}
              </div>
            ))}
            {logicMode === 'MIXED' && (
              <div className="mb-3 flex items-center gap-2 text-sm">
                <span>Group connector</span>
                <Button size="xs" variant={groupConnector === 'AND' ? 'primary' : 'outline'} onClick={() => setGroupConnector('AND')}>AND</Button>
                <Button size="xs" variant={groupConnector === 'OR' ? 'primary' : 'outline'} onClick={() => setGroupConnector('OR')}>OR</Button>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={() => setGroups((p) => [...p, emptyGroup(p.length + 1)])}>+ Add Filter Group</Button>

            <p className="mt-4 mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Quick preset filters</p>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p) => (
                <Button key={p.id} variant="outline" size="xs" onClick={() => applyPreset(p)}>{p.label}</Button>
              ))}
            </div>
            <p className="mt-4 mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Government report templates</p>
            <div className="flex flex-wrap gap-1.5">
              {GOV.map((g) => (
                <Button key={g.id} variant="secondary" size="xs" onClick={() => applyGov(g)}>{g.label}</Button>
              ))}
            </div>
          </Card>

          <Card title="Group, sort & summary">
            <div className="space-y-3">
              <MultiSelect label="Group by" options={selectedDefs.map((f) => ({ value: f.id, label: f.label }))} value={groupBy} onChange={(v) => setGroupBy(v.slice(0, 3))} placeholder="Class, Section…" />
              <Toggle label="Show subtotals" checked={showSubtotals} onChange={setShowSubtotals} size="sm" />
              <div className="grid grid-cols-2 gap-2">
                <Select label="Sort by" value={sortKey} options={[{ value: '', label: 'None' }, ...selectedDefs.map((f) => ({ value: f.id, label: f.label }))]} onChange={setSortKey} />
                <Select label="Order" value={sortDir} options={[{ value: 'asc', label: '↑ Ascending' }, { value: 'desc', label: '↓ Descending' }]} onChange={(v) => setSortDir(v as 'asc' | 'desc')} />
                <Select label="Then sort by" value={sortKey2} options={[{ value: '', label: 'None' }, ...selectedDefs.map((f) => ({ value: f.id, label: f.label }))]} onChange={setSortKey2} />
                <Select label="Order" value={sortDir2} options={[{ value: 'asc', label: '↑ Ascending' }, { value: 'desc', label: '↓ Descending' }]} onChange={(v) => setSortDir2(v as 'asc' | 'desc')} />
              </div>
              <p className="text-sm font-medium text-gray-700">Aggregation</p>
              <div className="flex flex-wrap gap-3 text-sm">
                {[
                  ['count', 'COUNT — Total students'],
                  ['avg', 'AVERAGE — Attendance %'],
                  ['sum', 'SUM — Present days'],
                  ['min', 'MIN — Lowest attendance %'],
                  ['max', 'MAX — Highest attendance %'],
                ].map(([id, label]) => (
                  <label key={id} className="flex items-center gap-1.5">
                    <input type="checkbox" checked={aggregations.includes(id)} onChange={() => setAggregations((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id])} />
                    {label}
                  </label>
                ))}
              </div>
              <div className="flex gap-3 text-sm">
                <span>Show summary at</span>
                {(['bottom', 'top', 'both'] as const).map((p) => (
                  <label key={p} className="flex items-center gap-1"><input type="radio" checked={summaryPos === p} onChange={() => setSummaryPos(p)} /> {p}</label>
                ))}
              </div>
            </div>
          </Card>

          <Card title="Conditional formatting" headerAction={<Button variant="outline" size="xs" onClick={() => setFormatRules((p) => [...p, { id: uid(), field: 'attPct', operator: 'lt', value: '60', style: 'red-row' }])}>+ Add Rule</Button>}>
            <div className="space-y-2">
              {formatRules.map((rule) => (
                <div key={rule.id} className="grid grid-cols-[1fr_80px_80px_1fr_auto] items-center gap-1">
                  <Select value={rule.field} options={selectedDefs.map((f) => ({ value: f.id, label: f.label }))} onChange={(v) => setFormatRules((p) => p.map((r) => r.id === rule.id ? { ...r, field: v } : r))} />
                  <Select value={rule.operator} options={[{ value: 'lt', label: '<' }, { value: 'eq', label: '=' }]} onChange={(v) => setFormatRules((p) => p.map((r) => r.id === rule.id ? { ...r, operator: v } : r))} />
                  <Input value={rule.value} onChange={(e) => setFormatRules((p) => p.map((r) => r.id === rule.id ? { ...r, value: e.target.value } : r))} />
                  <Select value={rule.style} options={[{ value: 'red-row', label: 'Red row' }, { value: 'yellow-row', label: 'Yellow row' }, { value: 'orange-text', label: 'Orange text' }, { value: 'blue-border', label: 'Blue border' }]} onChange={(v) => setFormatRules((p) => p.map((r) => r.id === rule.id ? { ...r, style: v as FormatRule['style'] } : r))} />
                  <button type="button" onClick={() => setFormatRules((p) => p.filter((r) => r.id !== rule.id))}><XIcon className="h-4 w-4 text-gray-400" /></button>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setNotice('Preview refreshed')}><EyeIcon className="h-4 w-4" /> Preview</Button>
            <Button variant="primary" size="sm" onClick={() => setSaveOpen(true)}><SaveIcon className="h-4 w-4" /> Save Report</Button>
            <Button variant="outline" size="sm" onClick={() => setExportOpen(true)}><DownloadIcon className="h-4 w-4" /> Export</Button>
            <Button variant="outline" size="sm" onClick={() => { setSchedName(name); setScheduleOpen(true); }}><ClockIcon className="h-4 w-4" /> Schedule</Button>
            <Button variant="ghost" size="sm" onClick={resetAll}><RefreshCwIcon className="h-4 w-4" /> Reset All</Button>
            <Button variant="ghost" size="sm" onClick={() => { setName((n) => (n ? `${n} (Copy)` : 'Untitled (Copy)')); setStatus('Draft'); setNotice('Duplicated current configuration'); }}><CopyIcon className="h-4 w-4" /> Duplicate</Button>
            <Button variant="ghost" size="sm" onClick={() => printHtml(name || 'Advanced report', selectedDefs, exportRows)}><PrinterIcon className="h-4 w-4" /> Print Preview</Button>
          </div>
        </div>

        <div className="space-y-4 xl:w-[62%] xl:sticky xl:top-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              ['Total records', String(ROWS.length), '#1E88E5'],
              ['Matched records', String(sorted.length), '#43A047'],
              ['Avg. attend. %', `${avgAtt}%`, '#FB8C00'],
              ['Ready to export', `${sorted.length} rows`, '#7E57C2'],
            ].map(([l, v, c]) => (
              <div key={l} className="rounded-lg border border-gray-200 bg-white p-3">
                <p className="text-xs text-gray-500">{l}</p>
                <p className="text-xl font-semibold" style={{ color: c }}>{v}</p>
              </div>
            ))}
          </div>

          {chips.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {chips.map((c) => {
                const def = fieldById(c.field);
                const color = def?.module === 'attendance' ? 'border-green-200 bg-green-50 text-green-800' : def?.module === 'admission' ? 'border-orange-200 bg-orange-50 text-orange-800' : 'border-blue-200 bg-blue-50 text-blue-800';
                return (
                  <button
                    key={c.id}
                    type="button"
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${color}`}
                    onClick={() => setGroups((p) => p.map((g) => ({ ...g, filters: g.filters.map((f) => f.id === c.id ? { ...f, value: '', picks: [] } : f) })))}
                  >
                    {def?.label}: {c.picks.join(', ') || c.value || c.operator}
                    <XIcon className="h-3 w-3" />
                  </button>
                );
              })}
              <Button variant="ghost" size="xs" onClick={() => setGroups([emptyGroup(1)])}>Clear All</Button>
            </div>
          )}

          {(reportType === 'chart' || reportType === 'both') && (
            <Card title="Chart configuration">
              <div className="mb-3 flex flex-wrap gap-1">
                {([
                  ['bar', 'Bar'], ['pie', 'Pie'], ['line', 'Line'], ['donut', 'Donut'], ['area', 'Area'], ['heat', 'Heat'],
                ] as [ChartKind, string][]).map(([id, label]) => (
                  <Button key={id} size="xs" variant={chartKind === id ? 'primary' : 'outline'} onClick={() => setChartKind(id)}>{label}</Button>
                ))}
              </div>
              <div className="mb-3 grid grid-cols-2 gap-2">
                <Select label="X-axis" value={chartX} options={selectedDefs.map((f) => ({ value: f.id, label: f.label }))} onChange={setChartX} />
                <Select label="Y-axis" value="count" options={[{ value: 'count', label: 'Count' }]} onChange={() => undefined} />
              </div>
              <ChartPreview kind={chartKind} data={chartData} color={themeHex} />
              <div className="mt-2 flex gap-2">
                <Button variant="outline" size="xs" onClick={() => setNotice('Chart exported as PNG (preview)')}>Export Chart as PNG</Button>
                <Button variant="outline" size="xs" onClick={() => printHtml(name || 'Chart', selectedDefs, sorted)}>Export Chart as PDF</Button>
              </div>
            </Card>
          )}

          {(reportType === 'table' || reportType === 'both') && (
            <Card
              title="Live report preview"
              headerAction={
                <Input className="w-48" placeholder="Search table..." value={tableSearch} onChange={(e) => { setTableSearch(e.target.value); setPage(1); }} />
              }
            >
              {sorted.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm font-medium text-gray-700">No records match your filters.</p>
                  <button type="button" className="mt-2 text-sm text-blue-600" onClick={() => setGroups([emptyGroup(1)])}>Reset filters</button>
                </div>
              ) : (
                <div className="max-h-[520px] overflow-auto">
                  <table className="w-full min-w-[640px] text-sm">
                    <thead className="sticky top-0 bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left">
                          <input
                            type="checkbox"
                            checked={pageRows.length > 0 && pageRows.every((r) => picked.includes(r.studentId))}
                            onChange={(e) => {
                              const ids = pageRows.map((r) => r.studentId);
                              setPicked(e.target.checked ? Array.from(new Set([...picked, ...ids])) : picked.filter((id) => !ids.includes(id)));
                            }}
                          />
                        </th>
                        {selectedDefs.map((c) => (
                          <th key={c.id} className="whitespace-nowrap px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-600" title={`${c.label} · ${c.kind}`}>{c.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(summaryPos === 'top' || summaryPos === 'both') && <SummaryRow cols={selectedDefs} rows={sorted} aggregations={aggregations} />}
                      {groupedPreview.map((g) => (
                        <React.Fragment key={g.key || 'all'}>
                          {g.key && (
                            <tr className="bg-gray-100">
                              <td colSpan={selectedDefs.length + 1} className="px-3 py-1.5 text-sm font-semibold">
                                {g.key} {showSubtotals ? `· ${g.rows.length}` : ''}
                              </td>
                            </tr>
                          )}
                          {g.rows.map((row) => (
                            <tr key={row.studentId} className={rowStyle(row)}>
                              <td className="px-3 py-2">
                                <input type="checkbox" checked={picked.includes(row.studentId)} onChange={() => setPicked((p) => p.includes(row.studentId) ? p.filter((x) => x !== row.studentId) : [...p, row.studentId])} />
                              </td>
                              {selectedDefs.map((c) => (
                                <td key={c.id} className="whitespace-nowrap px-3 py-2">
                                  {c.id === 'attPct' ? (
                                    <span className="inline-flex items-center gap-2">
                                      <span className="inline-block h-1.5 w-16 overflow-hidden rounded bg-gray-200">
                                        <span className="block h-full bg-blue-500" style={{ width: `${Math.min(100, parseFloat(row.attPct) || 0)}%` }} />
                                      </span>
                                      {row.attPct}%
                                    </span>
                                  ) : c.id === 'status' || c.id === 'examElig' || c.id === 'attCategory' ? (
                                    <Badge variant={['Dropped', 'Not Eligible', 'Poor', 'Critical'].includes(row[c.id]) ? 'danger' : ['Borderline', 'Average', 'Pending'].includes(row[c.id]) ? 'warning' : 'success'}>{row[c.id] || '—'}</Badge>
                                  ) : (
                                    row[c.id] || '—'
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                      {(summaryPos === 'bottom' || summaryPos === 'both') && <SummaryRow cols={selectedDefs} rows={sorted} aggregations={aggregations} />}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600">
                <span>Showing {pageRows.length ? (safePage - 1) * pageSize + 1 : 0}–{Math.min(safePage * pageSize, sorted.length)} of {sorted.length} records · {picked.length} selected</span>
                <div className="flex items-center gap-2">
                  <Select value={String(pageSize)} options={[10, 25, 50, 100].map((n) => ({ value: String(n), label: `${n}/page` }))} onChange={(v) => { setPageSize(Number(v)); setPage(1); }} />
                  <Button variant="outline" size="xs" disabled={safePage <= 1} onClick={() => setPage((p) => p - 1)}>&lt;</Button>
                  <span> {safePage} / {totalPages} </span>
                  <Button variant="outline" size="xs" disabled={safePage >= totalPages} onClick={() => setPage((p) => p + 1)}>&gt;</Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      <Card title="Saved reports" headerAction={<Button variant="outline" size="xs" onClick={() => setDrawer(true)}>View all saved reports</Button>}>
        {saved.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-500">No saved reports yet. Save the current layout to run it again.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-gray-500">
                  <th className="px-3 py-2">Report name</th>
                  <th className="px-3 py-2">Module</th>
                  <th className="px-3 py-2">Created</th>
                  <th className="px-3 py-2">Last run</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {saved.slice(0, 6).map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="px-3 py-2">
                      <button type="button" className="mr-1" onClick={() => persist(saved.map((s) => s.id === r.id ? { ...s, favourite: !s.favourite } : s))}>
                        <StarIcon className={`h-4 w-4 ${r.favourite ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                      </button>
                      {r.name} {r.scheduled && <Badge variant="info">Scheduled</Badge>}
                    </td>
                    <td className="px-3 py-2">{r.combine ? 'Combined' : r.modules[0]}</td>
                    <td className="px-3 py-2">{r.createdAt}</td>
                    <td className="px-3 py-2">{r.lastRun}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-1">
                        <Button variant="primary" size="xs" onClick={() => loadSaved(r, true)}><PlayIcon className="h-3.5 w-3.5" /> Run</Button>
                        <Button variant="outline" size="xs" onClick={() => loadSaved(r)}>Edit</Button>
                        <Button variant="outline" size="xs" onClick={() => { loadSaved(r, true); setExportOpen(true); }}><DownloadIcon className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="xs" onClick={() => persist(saved.filter((s) => s.id !== r.id))}><Trash2Icon className="h-3.5 w-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {drawer && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawer(false)} />
          <div className="relative z-50 h-full w-full max-w-md overflow-y-auto bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Saved reports</h2>
              <button type="button" onClick={() => setDrawer(false)}><XIcon className="h-5 w-5" /></button>
            </div>
            <Input className="mb-3" placeholder="Search reports..." leftIcon={<SearchIcon className="h-4 w-4 text-gray-400" />} value={tableSearch} onChange={(e) => setTableSearch(e.target.value)} />
            <div className="space-y-2">
              {[...saved].sort((a, b) => Number(b.favourite) - Number(a.favourite)).map((r) => (
                <div key={r.id} className="rounded-lg border border-gray-200 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{r.name}</p>
                      <p className="text-xs text-gray-500">{r.modules.join(' + ')} · {r.createdAt}</p>
                    </div>
                    <StarIcon className={`h-4 w-4 ${r.favourite ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                  </div>
                  <div className="mt-2 flex gap-1">
                    <Button size="xs" onClick={() => loadSaved(r, true)}>Run</Button>
                    <Button variant="outline" size="xs" onClick={() => loadSaved(r)}>Edit</Button>
                    <Button variant="ghost" size="xs" onClick={() => persist(saved.filter((s) => s.id !== r.id))}>Delete</Button>
                  </div>
                </div>
              ))}
              {saved.length === 0 && <p className="text-sm text-gray-500">Nothing saved yet.</p>}
            </div>
          </div>
        </div>
      )}

      <Modal isOpen={saveOpen} onClose={() => setSaveOpen(false)} title="Save report" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setSaveOpen(false)}>Cancel</Button><Button onClick={confirmSave}>Save report</Button></div>}>
        <div className="space-y-3">
          <Input label="Report name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Monthly Attendance Auto Report" />
          <Select label="Category" value={category} options={categoriesTag} onChange={setCategory} />
          <Select label="Visibility" value={visibility} options={[{ value: 'Private', label: 'Private' }, { value: 'Shared with Staff', label: 'Shared with Staff' }, { value: 'Public', label: 'Public' }]} onChange={setVisibility} />
        </div>
      </Modal>

      <Modal isOpen={exportOpen} onClose={() => setExportOpen(false)} title="Export report" size="lg" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setExportOpen(false)}>Cancel</Button><Button onClick={doExport}>Export now</Button></div>}>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {([
              ['pdf', 'PDF'], ['xlsx', 'Excel'], ['csv', 'CSV'], ['print', 'Print'], ['email', 'Email'],
            ] as const).map(([id, label]) => (
              <Button key={id} size="sm" variant={exportFormat === id ? 'primary' : 'outline'} onClick={() => setExportFormat(id)}>{label}</Button>
            ))}
          </div>
          {(exportFormat === 'pdf' || exportFormat === 'print') && (
            <p className="text-sm text-gray-500">Portrait A4 · school logo · title · page numbers · filter summary · generated date.</p>
          )}
          {exportFormat === 'xlsx' && <p className="text-sm text-gray-500">Header row, summary row, freeze header, cell colours, DD/MM/YYYY dates.</p>}
          {exportFormat === 'email' && (
            <div className="space-y-2">
              <Input label="To" value={emailTo} onChange={(e) => setEmailTo(e.target.value)} />
              <Input label="CC" value={emailCc} onChange={(e) => setEmailCc(e.target.value)} />
              <Input label="Subject" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} placeholder="Monthly Attendance Report - Oct 2026" />
            </div>
          )}
          <div className="space-y-1 text-sm">
            <p className="font-medium">Export scope</p>
            <label className="flex items-center gap-2"><input type="radio" checked={exportScope === 'all'} onChange={() => setExportScope('all')} /> All filtered records ({sorted.length})</label>
            <label className="flex items-center gap-2"><input type="radio" checked={exportScope === 'selected'} onChange={() => setExportScope('selected')} /> Selected records only ({picked.length})</label>
            <label className="flex items-center gap-2"><input type="radio" checked={exportScope === 'page'} onChange={() => setExportScope('page')} /> Current page only ({pageRows.length})</label>
          </div>
        </div>
      </Modal>

      <Modal isOpen={scheduleOpen} onClose={() => setScheduleOpen(false)} title="Schedule report" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setScheduleOpen(false)}>Cancel</Button><Button variant="outline" onClick={() => setNotice('Test send queued')}>Test send now</Button><Button onClick={() => { setStatus('Scheduled'); setScheduleOpen(false); persist([{ ...snapshot(), scheduled: true, name: schedName || name || 'Scheduled report' }, ...saved]); setNotice('Schedule saved · next run 01 Nov 2026, 08:00 AM'); }}>Save schedule</Button></div>}>
        <div className="space-y-3">
          <Input label="Schedule name" value={schedName} onChange={(e) => setSchedName(e.target.value)} />
          <Select label="Frequency" value={freq} options={[{ value: 'daily', label: 'Daily' }, { value: 'weekly', label: 'Weekly' }, { value: 'monthly', label: 'Monthly' }, { value: 'custom', label: 'Custom' }]} onChange={setFreq} />
          <div className="grid grid-cols-2 gap-2">
            <Select label="Day of month" value={schedDay} options={Array.from({ length: 28 }, (_, i) => ({ value: String(i + 1), label: `${i + 1}` }))} onChange={setSchedDay} />
            <Input label="Time" type="time" value={schedTime} onChange={(e) => setSchedTime(e.target.value)} />
          </div>
          <Input label="Send to" value={emailTo} onChange={(e) => setEmailTo(e.target.value)} placeholder="admin@school.com" />
          <p className="text-sm text-gray-500">Next run: 01 Nov 2026, 08:00 AM IST</p>
        </div>
      </Modal>

      <Modal isOpen={helpOpen} onClose={() => setHelpOpen(false)} title="Guided walkthrough" footer={<div className="flex justify-between"><Button variant="outline" disabled={helpStep === 0} onClick={() => setHelpStep((s) => s - 1)}>Back</Button><Button onClick={() => helpStep === HELP_STEPS.length - 1 ? setHelpOpen(false) : setHelpStep((s) => s + 1)}>{helpStep === HELP_STEPS.length - 1 ? 'Done' : 'Next'}</Button></div>}>
        <p className="text-sm font-medium text-gray-900">{HELP_STEPS[helpStep].title}</p>
        <p className="mt-2 text-sm text-gray-600">{HELP_STEPS[helpStep].body}</p>
        <p className="mt-3 text-xs text-gray-400">Step {helpStep + 1} of {HELP_STEPS.length}</p>
      </Modal>
    </div>
  );
}

function FilterValue({ def, item, onChange }: { def?: FieldDef; item: FilterItem; onChange: (n: FilterItem) => void }) {
  if (!def) return <Input value={item.value} onChange={(e) => onChange({ ...item, value: e.target.value })} />;
  if (item.operator === 'empty' || item.operator === 'notempty') return <span className="text-sm text-gray-400">—</span>;
  if (def.kind === 'boolean') return <span className="text-sm text-gray-500">{item.operator === 'eq' ? 'Yes' : 'No'}</span>;
  if (item.operator === 'any' || item.operator === 'none') {
    return <MultiSelect options={def.options || []} value={item.picks} onChange={(picks) => onChange({ ...item, picks })} placeholder={def.label} />;
  }
  if (item.operator === 'between') {
    const type = def.kind === 'date' ? 'date' : 'number';
    return (
      <div className="grid grid-cols-2 gap-1">
        <Input type={type} value={item.value} onChange={(e) => onChange({ ...item, value: e.target.value })} />
        <Input type={type} value={item.value2} onChange={(e) => onChange({ ...item, value2: e.target.value })} />
      </div>
    );
  }
  if (def.kind === 'select' || def.kind === 'multi') {
    return <Select value={item.value} options={[{ value: '', label: 'Select' }, ...(def.options || [])]} onChange={(v) => onChange({ ...item, value: v })} />;
  }
  if (def.kind === 'date') return <Input type="date" value={item.value} onChange={(e) => onChange({ ...item, value: e.target.value })} />;
  if (def.kind === 'number' || def.kind === 'percent') return <Input type="number" value={item.value} onChange={(e) => onChange({ ...item, value: e.target.value })} />;
  return <Input value={item.value} onChange={(e) => onChange({ ...item, value: e.target.value })} placeholder={def.label} />;
}

function SummaryRow({ cols, rows, aggregations }: { cols: FieldDef[]; rows: Row[]; aggregations: string[] }) {
  const att = rows.map((r) => parseFloat(r.attPct) || 0);
  const present = rows.map((r) => parseFloat(r.presentDays) || 0);
  const cells = cols.map((c) => {
    if (c.id === 'fullName' && aggregations.includes('count')) return `Count ${rows.length}`;
    if (c.id === 'attPct' && aggregations.includes('avg')) return `Avg ${(att.reduce((a, b) => a + b, 0) / (att.length || 1)).toFixed(1)}%`;
    if (c.id === 'attPct' && aggregations.includes('min')) return `Min ${Math.min(...att, 0)}`;
    if (c.id === 'attPct' && aggregations.includes('max')) return `Max ${Math.max(...att, 0)}`;
    if (c.id === 'presentDays' && aggregations.includes('sum')) return `Sum ${present.reduce((a, b) => a + b, 0)}`;
    return '';
  });
  return (
    <tr className="bg-blue-50 font-medium">
      <td className="px-3 py-2 text-xs text-blue-800">Summary</td>
      {cells.map((v, i) => <td key={cols[i].id} className="px-3 py-2 text-xs text-blue-800">{v}</td>)}
    </tr>
  );
}

function ChartPreview({ kind, data, color }: { kind: ChartKind; data: { label: string; value: number }[]; color: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  if (kind === 'pie' || kind === 'donut') {
    let acc = 0;
    const stops = data.map((d) => {
      const from = acc;
      acc += (d.value / total) * 100;
      return `${color}${kind === 'donut' ? '99' : ''} ${from}% ${acc}%`;
    });
    return (
      <div className="flex items-center gap-6">
        <div className="h-40 w-40 rounded-full" style={{ background: `conic-gradient(${stops.join(',')})`, mask: kind === 'donut' ? 'radial-gradient(circle, transparent 45%, black 46%)' : undefined }} />
        <div className="space-y-1 text-sm">
          {data.slice(0, 8).map((d) => <div key={d.label}>{d.label}: {d.value}</div>)}
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-48 items-end gap-2 rounded-lg border border-gray-100 bg-gray-50 p-3">
      {data.slice(0, 12).map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-1">
          <div className="w-full rounded-t" style={{ height: `${(d.value / max) * 100}%`, background: color, minHeight: 4 }} />
          <span className="w-full truncate text-center text-[10px] text-gray-500">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export default AdvancedReportBuilder;
