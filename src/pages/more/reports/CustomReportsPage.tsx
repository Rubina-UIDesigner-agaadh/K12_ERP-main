import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { MultiSelect } from '../../../components/ui/MultiSelect';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ClockIcon,
  DownloadIcon,
  EyeIcon,
  FilePlus,
  PlusIcon,
  PrinterIcon,
  SaveIcon,
  SearchIcon,
  Trash2Icon,
  XIcon,
} from 'lucide-react';

type Field = { id: string; label: string };
type Row = Record<string, string>;
type ModuleId = 'info' | 'attendance' | 'admission';

interface SectionConfig {
  title: string;
  description: string;
  fields: Field[];
  rows: Row[];
}

interface SavedReport {
  id: string;
  name: string;
  columns: string[];
  createdAt: string;
}

const SECTIONS: Record<string, SectionConfig> = {
  'government-custom-reports': {
    title: 'Government Custom Reports',
    description: 'Build a custom board and affiliation compliance extract.',
    fields: [
      { id: 'board', label: 'Board' },
      { id: 'requirement', label: 'Requirement' },
      { id: 'owner', label: 'Owner' },
      { id: 'due', label: 'Due date' },
      { id: 'status', label: 'Status' },
    ],
    rows: [
      { board: 'CBSE', requirement: 'OASIS annual submission', owner: 'Academic Office', due: '15 Jul 2026', status: 'Complete' },
      { board: 'CBSE', requirement: 'Class X LOC', owner: 'Exam Cell', due: '10 Nov 2026', status: 'Pending' },
      { board: 'CISCE', requirement: 'Candidate registration', owner: 'Exam Cell', due: '20 Sep 2026', status: 'In Progress' },
      { board: 'GSEB', requirement: 'SSC form upload', owner: 'Admin', due: '30 Nov 2026', status: 'Pending' },
      { board: 'GSEB', requirement: 'Index number update', owner: 'Principal', due: '15 Jun 2026', status: 'Complete' },
    ],
  },
  'finance-custom-reports': {
    title: 'Finance Custom Reports',
    description: 'Fee and receipt fields in a custom layout.',
    fields: [
      { id: 'receipt', label: 'Receipt No' },
      { id: 'student', label: 'Student' },
      { id: 'head', label: 'Fee head' },
      { id: 'amount', label: 'Amount' },
      { id: 'mode', label: 'Mode' },
    ],
    rows: [
      { receipt: 'R-88021', student: 'Aarav Shah', head: 'Tuition', amount: '18500', mode: 'UPI' },
      { receipt: 'R-88022', student: 'Diya Patel', head: 'Transport', amount: '4200', mode: 'Cash' },
      { receipt: 'R-88030', student: 'Isha Nair', head: 'Tuition', amount: '18500', mode: 'NEFT' },
      { receipt: 'R-88041', student: 'Rohan Joshi', head: 'Exam', amount: '2500', mode: 'Card' },
      { receipt: 'R-88055', student: 'Kabir Mehta', head: 'Admission', amount: '15000', mode: 'Cheque' },
    ],
  },
  'examination-custom-reports': {
    title: 'Examination Custom Reports',
    description: 'Internal and board exam extracts with selected columns.',
    fields: [
      { id: 'exam', label: 'Exam' },
      { id: 'className', label: 'Class' },
      { id: 'appeared', label: 'Appeared' },
      { id: 'passPct', label: 'Pass %' },
      { id: 'status', label: 'Status' },
    ],
    rows: [
      { exam: 'Term 1', className: '8-A', appeared: '42', passPct: '93', status: 'Published' },
      { exam: 'Term 1', className: '10-A', appeared: '48', passPct: '88', status: 'Published' },
      { exam: 'Pre-Board', className: '10-A', appeared: '47', passPct: '81', status: 'Draft' },
      { exam: 'Board', className: '12-A', appeared: '39', passPct: '96', status: 'Submitted' },
      { exam: 'Unit Test 2', className: '6-B', appeared: '36', passPct: '86', status: 'Published' },
    ],
  },
};

function storageKey(pageId: string) {
  return `k12-custom-reports-${pageId}-v1`;
}

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function printRows(title: string, fields: Field[], rows: Row[]) {
  const html = `<!doctype html><html><head><title>${title}</title>
    <style>
      body{font-family:Arial,sans-serif;padding:24px;color:#111}
      h1{font-size:18px;margin:0 0 16px}
      table{width:100%;border-collapse:collapse;font-size:13px}
      th,td{border:1px solid #d1d5db;padding:8px;text-align:left}
      th{background:#f3f4f6}
    </style></head><body>
    <h1>${title}</h1>
    <table><thead><tr>${fields.map((f) => `<th>${f.label}</th>`).join('')}</tr></thead>
    <tbody>${rows.map((r) => `<tr>${fields.map((f) => `<td>${r[f.id] || ''}</td>`).join('')}</tr>`).join('')}</tbody>
    </table></body></html>`;
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
  }, 300);
}


const PAGE_IDS = Object.keys(SECTIONS);
const STUDENT_STORAGE = 'k12-student-custom-report-builder-v1';
const FILTER_SET_STORAGE = 'k12-student-filter-sets-v1';
const FILTER_HISTORY_STORAGE = 'k12-student-filter-history-v1';


type Kind = 'text' | 'select' | 'multi' | 'dates' | 'nums';
type Logic = 'AND' | 'OR' | 'NOT';

interface FilterDef {
  id: string;
  label: string;
  kind: Kind;
  group: string;
  module: string;
  options?: { value: string; label: string }[];
}

interface FVal {
  mode?: string;
  text?: string;
  pick?: string;
  picks?: string[];
  min?: string;
  max?: string;
  from?: string;
  to?: string;
}

interface StudentSaved {
  id: string;
  name: string;
  description: string;
  tag: string;
  module: ModuleId;
  columns: string[];
  values: Record<string, FVal>;
  logic: Logic;
  createdBy: string;
  createdDate: string;
  lastRun: string;
}

interface FilterSet {
  id: string;
  name: string;
  module: ModuleId;
  values: Record<string, FVal>;
  logic: Logic;
}

const TEXT_MODES = [
  { value: 'contains', label: 'Contains' },
  { value: 'exact', label: 'Exact' },
  { value: 'starts', label: 'Starts With' },
  { value: 'ends', label: 'Ends With' },
];

const yn = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
];
const submitted = [
  { value: 'Submitted', label: 'Submitted' },
  { value: 'Not Submitted', label: 'Not Submitted' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Not Applicable', label: 'Not Applicable' },
  { value: 'Not Required', label: 'Not Required' },
];
const years = ['2022-23', '2023-24', '2024-25', '2025-26'].map((v) => ({ value: v, label: v }));
const classes = ['Nursery', 'LKG', 'UKG', ...Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`)].map((v) => ({ value: v, label: v }));
const sections = ['A', 'B', 'C', 'D', 'E'].map((v) => ({ value: v, label: v }));
const genders = ['Male', 'Female', 'Transgender', 'Other'].map((v) => ({ value: v, label: v }));
const bloods = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((v) => ({ value: v, label: v }));
const religions = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other'].map((v) => ({ value: v, label: v }));
const castes = ['General', 'OBC', 'SC', 'ST', 'NT', 'Other'].map((v) => ({ value: v, label: v }));
const casteCats = ['General', 'EWS', 'OBC-A', 'OBC-B', 'SC', 'ST', 'VJ', 'NT'].map((v) => ({ value: v, label: v }));
const statuses = ['Active', 'Inactive', 'Transferred', 'Dropped Out', 'Passed Out', 'Alumni'].map((v) => ({ value: v, label: v }));
const streams = ['Science', 'Commerce', 'Arts', 'Vocational'].map((v) => ({ value: v, label: v }));
const mediums = ['English', 'Hindi', 'Marathi', 'Urdu', 'Gujarati'].map((v) => ({ value: v, label: v }));
const shifts = ['Morning', 'Afternoon', 'Full Day'].map((v) => ({ value: v, label: v }));
const houses = ['Red', 'Blue', 'Green', 'Yellow'].map((v) => ({ value: v, label: v }));
const boards = ['CBSE', 'ICSE', 'State Board', 'IB', 'IGCSE'].map((v) => ({ value: v, label: v }));
const teachers = ['Mrs. Patel', 'Mr. Verma', 'Mr. Joshi', 'Ms. Iyer', 'Mrs. Nair'].map((v) => ({ value: v, label: v }));
const routes = ['Route 1', 'Route 2', 'Route 3', 'Route 4'].map((v) => ({ value: v, label: v }));
const hostels = ['Ganga', 'Yamuna', 'Narmada'].map((v) => ({ value: v, label: v }));
const scholarships = ['Government', 'Private', 'Merit', 'Minority', 'SC/ST', 'OBC'].map((v) => ({ value: v, label: v }));
const occupations = ['Govt. Service', 'Private', 'Business', 'Farmer', 'Daily Wage', 'Housewife', 'Other'].map((v) => ({ value: v, label: v }));
const quals = ['Illiterate', 'Primary', 'Secondary', 'Graduate', 'Post Graduate', 'Professional'].map((v) => ({ value: v, label: v }));
const districts = ['Ahmedabad', 'Gandhinagar', 'Surat', 'Vadodara', 'Rajkot'].map((v) => ({ value: v, label: v }));
const states = ['Gujarat', 'Maharashtra', 'Rajasthan', 'Madhya Pradesh', 'Delhi'].map((v) => ({ value: v, label: v }));
const talukas = ['City', 'Daskroi', 'Sanand', 'Dholka'].map((v) => ({ value: v, label: v }));
const areas = ['Urban', 'Rural', 'Semi-Urban', 'Tribal'].map((v) => ({ value: v, label: v }));
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((v) => ({ value: v, label: v }));
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((v) => ({ value: v, label: v }));
const attStatuses = ['Present', 'Absent', 'Late', 'Half Day', 'Leave', 'Holiday', 'Suspended'].map((v) => ({ value: v, label: v }));
const subjects = ['Mathematics', 'Science', 'English', 'Hindi', 'Social Science'].map((v) => ({ value: v, label: v }));
const leaveTypes = ['Medical Leave', 'Casual Leave', 'Emergency', 'Approved', 'Unapproved'].map((v) => ({ value: v, label: v }));
const admStatuses = ['Pending', 'Approved', 'Rejected', 'Cancelled', 'Deferred', 'Waitlisted'].map((v) => ({ value: v, label: v }));
const appStatuses = ['New', 'Under Review', 'Shortlisted', 'Waitlisted', 'Approved', 'Rejected', 'Cancelled'].map((v) => ({ value: v, label: v }));
const opt = (list: string[]) => list.map((v) => ({ value: v, label: v }));

function F(id: string, label: string, kind: Kind, group: string, module: string, options?: { value: string; label: string }[]): FilterDef {
  return { id, label, kind, group, module, options };
}

const FILTERS: FilterDef[] = [
  F('academicYear', 'Academic Year', 'select', 'Global', 'all', years),
  F('classGrade', 'Class / Grade', 'multi', 'Global', 'all', classes),
  F('section', 'Section', 'multi', 'Global', 'all', sections),
  F('gender', 'Gender', 'multi', 'Global', 'all', genders),
  F('caste', 'Category (Caste)', 'multi', 'Global', 'all', castes),
  F('religion', 'Religion', 'multi', 'Global', 'all', religions),
  F('areaType', 'Area Type', 'select', 'Global', 'all', areas),
  F('district', 'District', 'select', 'Global', 'all', districts),
  F('scholarship', 'Scholarship Holder', 'select', 'Global', 'all', yn),
  F('rte', 'RTE Student', 'select', 'Global', 'all', yn),
  F('disability', 'Disability Status', 'select', 'Global', 'all', yn),
  F('status', 'Student Status', 'multi', 'Global', 'all', statuses),
  F('enrolledFrom', 'Date Created / Enrolled', 'dates', 'Global', 'all'),
  F('createdBy', 'Created By (Record)', 'select', 'Global', 'all', teachers),
  F('lastModified', 'Last Modified Date', 'dates', 'Global', 'all'),
  F('recordStatus', 'Record Status', 'select', 'Global', 'all', opt(['Complete', 'Incomplete'])),

  F('studentId', 'Student ID / Roll Number', 'text', 'A. Basic Identity', 'info'),
  F('fullName', 'Student Full Name', 'text', 'A. Basic Identity', 'info'),
  F('firstName', 'First Name', 'text', 'A. Basic Identity', 'info'),
  F('middleName', 'Middle Name', 'text', 'A. Basic Identity', 'info'),
  F('lastName', 'Last Name / Surname', 'text', 'A. Basic Identity', 'info'),
  F('dob', 'Date of Birth', 'dates', 'A. Basic Identity', 'info'),
  F('age', 'Age', 'nums', 'A. Basic Identity', 'info'),
  F('bloodGroup', 'Blood Group', 'multi', 'A. Basic Identity', 'info', bloods),
  F('nationality', 'Nationality', 'select', 'A. Basic Identity', 'info', opt(['Indian', 'NRI', 'Foreign National', 'Other'])),
  F('motherTongue', 'Mother Tongue', 'select', 'A. Basic Identity', 'info', opt(['Gujarati', 'Hindi', 'English', 'Marathi', 'Urdu', 'Other'])),
  F('casteCategory', 'Caste Category', 'select', 'A. Basic Identity', 'info', casteCats),
  F('subCaste', 'Sub-Caste', 'text', 'A. Basic Identity', 'info'),
  F('aadhar', 'Aadhar Card Number', 'text', 'A. Basic Identity', 'info'),
  F('aadharStatus', 'Aadhar Enrollment Status', 'select', 'A. Basic Identity', 'info', opt(['Enrolled', 'Not Enrolled', 'Applied'])),
  F('udise', 'UDISE Student Code', 'text', 'A. Basic Identity', 'info'),
  F('pen', 'PEN Number', 'text', 'A. Basic Identity', 'info'),
  F('minority', 'Minority Status', 'select', 'A. Basic Identity', 'info', yn),
  F('disabilityType', 'Disability Type', 'multi', 'A. Basic Identity', 'info', opt(['Visual', 'Hearing', 'Locomotor', 'Mental', 'Speech', 'Multiple'])),
  F('disabilityPct', 'Disability Percentage', 'nums', 'A. Basic Identity', 'info'),
  F('bpl', 'BPL (Below Poverty Line)', 'select', 'A. Basic Identity', 'info', yn),
  F('bplCard', 'BPL Card Number', 'text', 'A. Basic Identity', 'info'),
  F('orphan', 'Orphan Status', 'select', 'A. Basic Identity', 'info', opt(['Both Parents', 'Single Parent', 'Orphan'])),
  F('photo', 'Student Photo Available', 'select', 'A. Basic Identity', 'info', yn),

  F('stream', 'Stream', 'multi', 'B. Academic / Class', 'info', streams),
  F('medium', 'Medium of Instruction', 'select', 'B. Academic / Class', 'info', mediums),
  F('shift', 'Shift', 'select', 'B. Academic / Class', 'info', shifts),
  F('house', 'House / Group', 'select', 'B. Academic / Class', 'info', houses),
  F('classTeacher', 'Class Teacher', 'select', 'B. Academic / Class', 'info', teachers),
  F('rollNo', 'Roll Number', 'text', 'B. Academic / Class', 'info'),
  F('admissionNo', 'Admission Number', 'text', 'B. Academic / Class', 'info'),
  F('grNo', 'GR Number', 'text', 'B. Academic / Class', 'info'),
  F('board', 'Board', 'select', 'B. Academic / Class', 'info', boards),
  F('studentType', 'Student Type', 'select', 'B. Academic / Class', 'info', opt(['Regular', 'Private', 'Ex-Student', 'Transferred'])),
  F('promoted', 'Promoted Status', 'select', 'B. Academic / Class', 'info', opt(['Promoted', 'Detained', 'Transferred'])),
  F('busUser', 'School Bus User', 'select', 'B. Academic / Class', 'info', yn),
  F('busRoute', 'Bus Route', 'select', 'B. Academic / Class', 'info', routes),
  F('hostel', 'Hostel Resident', 'select', 'B. Academic / Class', 'info', yn),
  F('hostelName', 'Hostel Name', 'select', 'B. Academic / Class', 'info', hostels),
  F('feeConcession', 'Fee Concession', 'select', 'B. Academic / Class', 'info', yn),
  F('scholarshipType', 'Scholarship Type', 'multi', 'B. Academic / Class', 'info', scholarships),

  F('fatherName', "Father's Name", 'text', 'C. Parent / Guardian', 'info'),
  F('fatherOccupation', "Father's Occupation", 'select', 'C. Parent / Guardian', 'info', occupations),
  F('fatherIncome', "Father's Annual Income", 'nums', 'C. Parent / Guardian', 'info'),
  F('fatherQual', "Father's Qualification", 'select', 'C. Parent / Guardian', 'info', quals),
  F('fatherContact', "Father's Contact Number", 'text', 'C. Parent / Guardian', 'info'),
  F('fatherAadhar', "Father's Aadhar Number", 'text', 'C. Parent / Guardian', 'info'),
  F('motherName', "Mother's Name", 'text', 'C. Parent / Guardian', 'info'),
  F('motherOccupation', "Mother's Occupation", 'select', 'C. Parent / Guardian', 'info', occupations),
  F('motherIncome', "Mother's Annual Income", 'nums', 'C. Parent / Guardian', 'info'),
  F('motherQual', "Mother's Qualification", 'select', 'C. Parent / Guardian', 'info', quals),
  F('motherContact', "Mother's Contact Number", 'text', 'C. Parent / Guardian', 'info'),
  F('motherAadhar', "Mother's Aadhar Number", 'text', 'C. Parent / Guardian', 'info'),
  F('guardianName', 'Guardian Name', 'text', 'C. Parent / Guardian', 'info'),
  F('guardianRelation', 'Guardian Relation', 'select', 'C. Parent / Guardian', 'info', opt(['Uncle', 'Aunt', 'Grandparent', 'Elder Sibling', 'Other'])),
  F('guardianContact', 'Guardian Contact', 'text', 'C. Parent / Guardian', 'info'),
  F('parentType', 'Parent Type', 'select', 'C. Parent / Guardian', 'info', opt(['Both Parents', 'Single Father', 'Single Mother', 'Guardian'])),
  F('familyIncome', 'Family Annual Income', 'nums', 'C. Parent / Guardian', 'info'),
  F('incomeCert', 'Income Certificate Available', 'select', 'C. Parent / Guardian', 'info', yn),
  F('rationNo', 'Ration Card Number', 'text', 'C. Parent / Guardian', 'info'),
  F('rationType', 'Ration Card Type', 'select', 'C. Parent / Guardian', 'info', opt(['APL', 'BPL', 'Antyodaya', 'Not Available'])),

  F('currentAddress', 'Current Address', 'text', 'D. Address / Location', 'info'),
  F('permanentAddress', 'Permanent Address', 'text', 'D. Address / Location', 'info'),
  F('city', 'Village / Town / City', 'text', 'D. Address / Location', 'info'),
  F('taluka', 'Taluka / Tehsil', 'select', 'D. Address / Location', 'info', talukas),
  F('state', 'State', 'select', 'D. Address / Location', 'info', states),
  F('pin', 'PIN Code', 'text', 'D. Address / Location', 'info'),
  F('distanceKm', 'Distance from School (KM)', 'nums', 'D. Address / Location', 'info'),
  F('transport', 'Transport Mode', 'select', 'D. Address / Location', 'info', opt(['School Bus', 'Private', 'Walking', 'Bicycle', 'Other'])),

  F('height', 'Height (cm)', 'nums', 'E. Health & Medical', 'info'),
  F('weight', 'Weight (kg)', 'nums', 'E. Health & Medical', 'info'),
  F('bmi', 'BMI Category', 'select', 'E. Health & Medical', 'info', opt(['Underweight', 'Normal', 'Overweight', 'Obese'])),
  F('medical', 'Medical Condition / Illness', 'multi', 'E. Health & Medical', 'info', opt(['Asthma', 'Epilepsy', 'Diabetes', 'Hearing Loss', 'Vision', 'Other', 'None'])),
  F('vaccination', 'Vaccination Status', 'select', 'E. Health & Medical', 'info', opt(['Complete', 'Incomplete', 'Not Done'])),
  F('covidVax', 'COVID Vaccination', 'select', 'E. Health & Medical', 'info', opt(['Vaccinated', 'Not Vaccinated', 'Partially Vaccinated'])),
  F('physicallyChallenged', 'Physically Challenged', 'select', 'E. Health & Medical', 'info', yn),
  F('spectacles', 'Spectacles / Vision Issue', 'select', 'E. Health & Medical', 'info', yn),
  F('healthInsurance', 'Health Insurance', 'select', 'E. Health & Medical', 'info', yn),
  F('ayushman', 'Ayushman Bharat Card', 'select', 'E. Health & Medical', 'info', yn),

  F('samagra', 'Samagra ID', 'text', 'F. Government / Statutory', 'info'),
  F('apaar', 'APAAR ID', 'text', 'F. Government / Statutory', 'info'),
  F('casteCert', 'Caste Certificate Available', 'select', 'F. Government / Statutory', 'info', yn),
  F('casteCertNo', 'Caste Certificate Number', 'text', 'F. Government / Statutory', 'info'),
  F('domicile', 'Domicile Certificate', 'select', 'F. Government / Statutory', 'info', yn),
  F('migration', 'Migration Certificate', 'select', 'F. Government / Statutory', 'info', opt(['Yes', 'No', 'Not Required'])),
  F('tc', 'Transfer Certificate (TC)', 'select', 'F. Government / Statutory', 'info', opt(['Issued', 'Not Issued', 'Received'])),
  F('tcNo', 'TC Number', 'text', 'F. Government / Statutory', 'info'),
  F('ews', 'EWS Certificate', 'select', 'F. Government / Statutory', 'info', yn),
  F('sportsQuota', 'Sports Quota', 'select', 'F. Government / Statutory', 'info', yn),
  F('ncc', 'NCC Cadet', 'select', 'F. Government / Statutory', 'info', yn),
  F('nss', 'NSS Member', 'select', 'F. Government / Statutory', 'info', yn),
  F('scout', 'Scout & Guide', 'select', 'F. Government / Statutory', 'info', yn),
  F('exServiceman', 'Ex-Serviceman Ward', 'select', 'F. Government / Statutory', 'info', yn),
  F('freedomFighter', 'Freedom Fighter Ward', 'select', 'F. Government / Statutory', 'info', yn),
  F('kashmiri', 'Kashmiri Migrant', 'select', 'F. Government / Statutory', 'info', yn),
  F('bankName', 'Bank Name', 'text', 'F. Government / Statutory', 'info'),
  F('dropoutReason', 'Dropout Reason', 'text', 'F. Government / Statutory', 'info'),

  F('applicationNo', 'Application Number', 'text', 'A. Application / Registration', 'admission'),
  F('applicationDate', 'Application Date', 'dates', 'A. Application / Registration', 'admission'),
  F('applicationMode', 'Application Mode', 'select', 'A. Application / Registration', 'admission', opt(['Online', 'Offline', 'Walk-in'])),
  F('source', 'Application Source', 'select', 'A. Application / Registration', 'admission', opt(['Website', 'Mobile App', 'Agent', 'Referral', 'Camp', 'Advertisement'])),
  F('yearApplying', 'Academic Year Applying For', 'select', 'A. Application / Registration', 'admission', years),
  F('classApplying', 'Class Applying For', 'multi', 'A. Application / Registration', 'admission', classes),
  F('round', 'Admission Round', 'select', 'A. Application / Registration', 'admission', opt(['Round 1', 'Round 2', 'Round 3', 'Merit List', 'Waiting List'])),
  F('applicationStatus', 'Application Status', 'multi', 'A. Application / Registration', 'admission', appStatuses),
  F('referredBy', 'Referred By (Student / Staff)', 'text', 'A. Application / Registration', 'admission'),
  F('sibling', 'Sibling Studying in School', 'select', 'A. Application / Registration', 'admission', yn),
  F('siblingName', 'Sibling Name', 'text', 'A. Application / Registration', 'admission'),
  F('siblingClass', 'Sibling Class', 'select', 'A. Application / Registration', 'admission', classes),

  F('admissionDate', 'Admission Date', 'dates', 'B. Admission Approval', 'admission'),
  F('admissionStatus', 'Admission Status', 'multi', 'B. Admission Approval', 'admission', admStatuses),
  F('approvedBy', 'Approved By', 'select', 'B. Admission Approval', 'admission', teachers),
  F('approvedDate', 'Approved Date', 'dates', 'B. Admission Approval', 'admission'),
  F('rejectionReason', 'Rejection Reason', 'select', 'B. Admission Approval', 'admission', opt(['Seat Full', 'Document Missing', 'Age Criteria', 'Merit', 'Other'])),
  F('seatType', 'Seat Type', 'select', 'B. Admission Approval', 'admission', opt(['General', 'RTE', 'Management Quota', 'NRI Quota', 'Minority'])),
  F('classAllotted', 'Class Allotted', 'multi', 'B. Admission Approval', 'admission', classes),
  F('sectionAllotted', 'Section Allotted', 'multi', 'B. Admission Approval', 'admission', sections),
  F('grIssued', 'GR Number Issued', 'select', 'B. Admission Approval', 'admission', yn),
  F('admNoIssued', 'Admission Number Issued', 'select', 'B. Admission Approval', 'admission', yn),

  F('birthCert', 'Birth Certificate', 'select', 'C. Document Submission', 'admission', submitted),
  F('prevTc', 'Previous School TC', 'select', 'C. Document Submission', 'admission', submitted),
  F('prevMarksheet', 'Previous School Mark Sheet', 'select', 'C. Document Submission', 'admission', submitted),
  F('aadharCopy', 'Aadhar Card Copy', 'select', 'C. Document Submission', 'admission', submitted),
  F('parentAadharCopy', 'Parent Aadhar Copy', 'select', 'C. Document Submission', 'admission', submitted),
  F('photoDoc', 'Passport Size Photo', 'select', 'C. Document Submission', 'admission', submitted),
  F('casteDoc', 'Caste Certificate', 'select', 'C. Document Submission', 'admission', submitted),
  F('incomeDoc', 'Income Certificate', 'select', 'C. Document Submission', 'admission', submitted),
  F('addressProof', 'Address Proof', 'select', 'C. Document Submission', 'admission', submitted),
  F('medicalCert', 'Medical / Fitness Certificate', 'select', 'C. Document Submission', 'admission', submitted),
  F('migrationDoc', 'Migration Certificate', 'select', 'C. Document Submission', 'admission', submitted),
  F('allDocs', 'All Documents Complete', 'select', 'C. Document Submission', 'admission', opt(['Yes', 'No', 'Partial'])),

  F('feePaid', 'Admission Fee Paid', 'select', 'D. Fee / Payment', 'admission', opt(['Paid', 'Unpaid', 'Partial'])),
  F('feeDate', 'Admission Fee Payment Date', 'dates', 'D. Fee / Payment', 'admission'),
  F('paymentMode', 'Payment Mode', 'select', 'D. Fee / Payment', 'admission', opt(['Cash', 'Online', 'Cheque', 'DD', 'UPI'])),
  F('receiptNo', 'Receipt Number', 'text', 'D. Fee / Payment', 'admission'),
  F('concession', 'Fee Concession Applied', 'select', 'D. Fee / Payment', 'admission', yn),
  F('rteFree', 'RTE Free Admission', 'select', 'D. Fee / Payment', 'admission', yn),
  F('scholarshipApplied', 'Scholarship Applied at Admission', 'select', 'D. Fee / Payment', 'admission', yn),

  F('prevSchool', 'Previous School Name', 'text', 'E. Previous School', 'admission'),
  F('prevSchoolType', 'Previous School Type', 'select', 'E. Previous School', 'admission', opt(['Government', 'Private', 'Semi-Government', 'Aided'])),
  F('prevBoard', 'Previous School Board', 'select', 'E. Previous School', 'admission', boards),
  F('prevClass', 'Previous Class Passed', 'select', 'E. Previous School', 'admission', classes),
  F('prevPct', 'Previous Year Percentage', 'nums', 'E. Previous School', 'admission'),
  F('prevMedium', 'Medium at Previous School', 'select', 'E. Previous School', 'admission', mediums),
  F('yearLeaving', 'Year of Leaving Previous School', 'select', 'E. Previous School', 'admission', years),
  F('tcVerify', 'TC Verification Status', 'select', 'E. Previous School', 'admission', opt(['Verified', 'Not Verified', 'Pending'])),

  F('date', 'Date', 'dates', 'A. Date & Period', 'attendance'),
  F('month', 'Month', 'select', 'A. Date & Period', 'attendance', months),
  F('attYear', 'Year', 'select', 'A. Date & Period', 'attendance', years),
  F('week', 'Week', 'text', 'A. Date & Period', 'attendance'),
  F('term', 'Term / Quarter', 'select', 'A. Date & Period', 'attendance', opt(['Term 1', 'Term 2', 'Term 3', 'Quarterly'])),
  F('dayOfWeek', 'Day of Week', 'multi', 'A. Date & Period', 'attendance', weekdays),
  F('workingDays', 'Working Days Count', 'nums', 'A. Date & Period', 'attendance'),
  F('holidayExclusion', 'Holiday Exclusion', 'select', 'A. Date & Period', 'attendance', opt(['Include Holidays', 'Exclude Holidays'])),

  F('subject', 'Subject', 'multi', 'B. Class & Section', 'attendance', subjects),
  F('subjectTeacher', 'Subject Teacher', 'select', 'B. Class & Section', 'attendance', teachers),
  F('batch', 'Batch', 'select', 'B. Class & Section', 'attendance', opt(['Batch 1', 'Batch 2', 'Batch 3'])),

  F('attStatus', 'Attendance Status', 'multi', 'C. Attendance Status', 'attendance', attStatuses),
  F('late', 'Late Arrival', 'select', 'C. Attendance Status', 'attendance', yn),
  F('lateMinutes', 'Late Arrival Minutes', 'nums', 'C. Attendance Status', 'attendance'),
  F('leaveType', 'Leave Type', 'multi', 'C. Attendance Status', 'attendance', leaveTypes),
  F('leaveApprovedBy', 'Leave Approved By', 'select', 'C. Attendance Status', 'attendance', teachers),
  F('absentReason', 'Absent Reason', 'select', 'C. Attendance Status', 'attendance', opt(['Sick', 'Family Function', 'Not Known', 'Suspended', 'Other'])),
  F('absentWithoutInfo', 'Absent without Information', 'select', 'C. Attendance Status', 'attendance', yn),
  F('continuousAbsent', 'Continuous Absent Days', 'nums', 'C. Attendance Status', 'attendance'),

  F('overallPct', 'Overall Attendance %', 'nums', 'D. Attendance Percentage', 'attendance'),
  F('monthlyPct', 'Monthly Attendance %', 'nums', 'D. Attendance Percentage', 'attendance'),
  F('termPct', 'Term-wise Attendance %', 'nums', 'D. Attendance Percentage', 'attendance'),
  F('belowMin', 'Below Minimum Attendance', 'select', 'D. Attendance Percentage', 'attendance', opt(['Below 75%', 'Below 60%', 'Below 50%'])),
  F('aboveTarget', 'Above Attendance Target', 'select', 'D. Attendance Percentage', 'attendance', opt(['Above 90%', 'Above 95%', 'Above 100%'])),
  F('attCategory', 'Attendance Category', 'select', 'D. Attendance Percentage', 'attendance', opt(['Excellent (>95%)', 'Good (75–95%)', 'Average (60–75%)', 'Poor (<60%)'])),
  F('examEligible', 'Eligible for Exam (Attendance %)', 'select', 'D. Attendance Percentage', 'attendance', opt(['Eligible', 'Not Eligible', 'Borderline'])),
  F('presentDays', 'Total Present Days', 'nums', 'D. Attendance Percentage', 'attendance'),
  F('absentDays', 'Total Absent Days', 'nums', 'D. Attendance Percentage', 'attendance'),
  F('lateDays', 'Total Late Days', 'nums', 'D. Attendance Percentage', 'attendance'),
  F('halfDays', 'Total Half Days', 'nums', 'D. Attendance Percentage', 'attendance'),
  F('leaveDays', 'Total Leave Days', 'nums', 'D. Attendance Percentage', 'attendance'),

  F('markedBy', 'Attendance Marked By', 'select', 'E. Marked By / Entry', 'attendance', opt(['Teacher', 'Admin', 'System', 'Biometric'])),
  F('entryMode', 'Attendance Entry Mode', 'select', 'E. Marked By / Entry', 'attendance', opt(['Manual', 'Biometric', 'RFID', 'App', 'SMS'])),
  F('markedAt', 'Marked Date & Time', 'dates', 'E. Marked By / Entry', 'attendance'),
  F('edited', 'Attendance Correction / Edited', 'select', 'E. Marked By / Entry', 'attendance', yn),
  F('correctedBy', 'Corrected By', 'select', 'E. Marked By / Entry', 'attendance', teachers),
  F('deviceId', 'Biometric Device ID', 'select', 'E. Marked By / Entry', 'attendance', opt(['DEV-01', 'DEV-02', 'DEV-03'])),
  F('notified', 'Attendance Notified to Parent', 'select', 'E. Marked By / Entry', 'attendance', opt(['Yes', 'No', 'Failed'])),
  F('smsSent', 'SMS Sent for Absence', 'select', 'E. Marked By / Entry', 'attendance', yn),
];

const NAMES: [string, string, string][] = [
  ['Aarav', 'Kumar', 'Shah'], ['Diya', 'R', 'Patel'], ['Kabir', 'A', 'Mehta'], ['Isha', 'S', 'Nair'],
  ['Rohan', 'M', 'Joshi'], ['Ananya', 'P', 'Desai'], ['Vivaan', 'K', 'Rao'], ['Myra', 'I', 'Khan'],
  ['Arjun', 'V', 'Iyer'], ['Sara', 'N', 'Trivedi'], ['Dev', 'R', 'Sharma'], ['Kiara', 'D', 'Shah'],
  ['Harsh', 'J', 'Patel'], ['Nisha', 'S', 'Verma'], ['Yash', 'K', 'Mehta'], ['Aanya', 'V', 'Gupta'],
  ['Reyansh', 'A', 'Jain'], ['Pari', 'M', 'Singh'], ['Om', 'B', 'Trivedi'], ['Saanvi', 'K', 'Reddy'],
  ['Avi', 'R', 'Kapoor'], ['Meera', 'A', 'Bose'], ['Ishaan', 'N', 'Gill'], ['Tara', 'S', 'Menon'],
  ['Kabir', 'A', 'Das'], ['Riya', 'P', 'Shah'], ['Neil', 'G', 'Chopra'], ['Zara', 'F', 'Ali'],
  ['Advik', 'D', 'Nair'], ['Ira', 'N', 'Joshi'], ['Veer', 'K', 'Patel'], ['Anvi', 'S', 'Reddy'],
  ['Neel', 'H', 'Shah'], ['Mira', 'L', 'Desai'], ['Yuvaan', 'P', 'Rao'], ['Kiara', 'J', 'Mehta'],
];

function makeInfo(i: number): Row {
  const [first, middle, last] = NAMES[i];
  const caste = ['General', 'OBC', 'SC', 'ST', 'EWS'][i % 5];
  const status = i % 17 === 0 ? 'Dropped Out' : i % 13 === 0 ? 'Alumni' : i % 11 === 0 ? 'Inactive' : 'Active';
  const cls = classes[3 + (i % 12)].value;
  const section = sections[i % 4].value;
  const gender = genders[i % 4].value;
  const religion = religions[i % 6].value;
  const year = i % 13 === 0 ? '2024-25' : '2025-26';
  const disability = i % 9 === 0 ? 'Yes' : 'No';
  const pct = String(58 + ((i * 7) % 42));
  return {
    studentId: `STU-${1001 + i}`,
    rollNo: String(i + 1),
    fullName: `${first} ${middle} ${last}`,
    firstName: first,
    middleName: middle,
    lastName: last,
    dob: `${2010 + (i % 8)}-${String((i % 12) + 1).padStart(2, '0')}-12`,
    age: String(16 - (i % 8)),
    gender,
    bloodGroup: bloods[i % 8].value,
    nationality: i % 15 === 0 ? 'NRI' : 'Indian',
    motherTongue: i % 3 === 0 ? 'Gujarati' : i % 3 === 1 ? 'Hindi' : 'English',
    religion,
    caste: caste === 'EWS' ? 'General' : caste,
    casteCategory: caste === 'OBC' ? (i % 2 ? 'OBC-A' : 'OBC-B') : caste,
    subCaste: i % 4 === 0 ? 'Patel' : '',
    aadhar: `9999${String(100000 + i)}`,
    aadharStatus: i % 10 === 0 ? 'Not Enrolled' : 'Enrolled',
    udise: `UDISE${10000 + i}`,
    pen: `PEN${20000 + i}`,
    minority: religion === 'Muslim' || religion === 'Christian' || religion === 'Sikh' ? 'Yes' : 'No',
    disability,
    disabilityType: disability === 'Yes' ? ['Visual', 'Hearing', 'Locomotor'][i % 3] : '',
    disabilityPct: disability === 'Yes' ? String(20 + (i % 5) * 10) : '0',
    bpl: i % 6 === 0 ? 'Yes' : 'No',
    bplCard: i % 6 === 0 ? `BPL${300 + i}` : '',
    orphan: i % 20 === 0 ? 'Orphan' : i % 9 === 0 ? 'Single Parent' : 'Both Parents',
    photo: i % 8 === 0 ? 'No' : 'Yes',
    academicYear: year,
    classGrade: cls,
    section,
    stream: Number(cls.replace('Class ', '')) >= 11 ? streams[i % 3].value : '',
    medium: mediums[i % 3].value,
    shift: shifts[i % 3].value,
    house: houses[i % 4].value,
    classTeacher: teachers[i % 5].value,
    admissionNo: `A-${10200 + i}`,
    grNo: `GR-${500 + i}`,
    board: 'CBSE',
    studentType: 'Regular',
    status,
    promoted: i % 14 === 0 ? 'Detained' : 'Promoted',
    busUser: i % 3 === 0 ? 'Yes' : 'No',
    busRoute: i % 3 === 0 ? routes[i % 4].value : '',
    hostel: i % 12 === 0 ? 'Yes' : 'No',
    hostelName: i % 12 === 0 ? hostels[i % 3].value : '',
    feeConcession: i % 5 === 0 ? 'Yes' : 'No',
    scholarship: i % 5 === 0 ? 'Yes' : 'No',
    scholarshipType: i % 5 === 0 ? scholarships[i % 6].value : '',
    rte: i % 7 === 0 ? 'Yes' : 'No',
    fatherName: `Mr ${last}`,
    fatherOccupation: occupations[i % 6].value,
    fatherIncome: String(180000 + i * 12000),
    fatherQual: quals[i % 6].value,
    fatherContact: `9876500${String(i).padStart(3, '0')}`,
    fatherAadhar: `8888${String(100000 + i)}`,
    motherName: `Mrs ${last}`,
    motherOccupation: occupations[(i + 2) % 7].value,
    motherIncome: String(80000 + i * 4000),
    motherQual: quals[(i + 1) % 6].value,
    motherContact: `9876510${String(i).padStart(3, '0')}`,
    motherAadhar: `7777${String(100000 + i)}`,
    guardianName: '',
    guardianRelation: '',
    guardianContact: '',
    parentType: i % 9 === 0 ? 'Single Mother' : 'Both Parents',
    familyIncome: String(260000 + i * 15000),
    incomeCert: i % 4 === 0 ? 'Yes' : 'No',
    rationNo: `RC${4000 + i}`,
    rationType: i % 6 === 0 ? 'BPL' : 'APL',
    currentAddress: `${10 + i} CG Road, Ahmedabad`,
    permanentAddress: `${10 + i} CG Road, Ahmedabad`,
    city: 'Ahmedabad',
    taluka: talukas[i % 4].value,
    district: districts[i % 5].value,
    state: 'Gujarat',
    pin: `3800${String(i % 10)}1`,
    areaType: areas[i % 4].value,
    distanceKm: String((i % 20) + 1),
    transport: i % 3 === 0 ? 'School Bus' : i % 3 === 1 ? 'Private' : 'Walking',
    height: String(120 + (i % 30)),
    weight: String(25 + (i % 28)),
    bmi: ['Normal', 'Underweight', 'Overweight'][i % 3],
    medical: i % 10 === 0 ? 'Asthma' : 'None',
    vaccination: i % 8 === 0 ? 'Incomplete' : 'Complete',
    covidVax: 'Vaccinated',
    physicallyChallenged: disability,
    spectacles: i % 5 === 0 ? 'Yes' : 'No',
    healthInsurance: i % 3 === 0 ? 'Yes' : 'No',
    ayushman: i % 4 === 0 ? 'Yes' : 'No',
    samagra: `SAM${70000 + i}`,
    apaar: i % 10 === 0 ? '' : `APAAR${80000 + i}`,
    casteCert: caste === 'General' ? 'No' : 'Yes',
    casteCertNo: caste === 'General' ? '' : `CC${i}`,
    domicile: 'Yes',
    migration: 'Not Required',
    tc: status === 'Dropped Out' || status === 'Alumni' ? 'Issued' : 'Not Issued',
    tcNo: '',
    ews: caste === 'EWS' || casteCats[i % 8].value === 'EWS' ? 'Yes' : i % 5 === 0 ? 'Yes' : 'No',
    sportsQuota: i % 16 === 0 ? 'Yes' : 'No',
    ncc: i % 11 === 0 ? 'Yes' : 'No',
    nss: i % 12 === 0 ? 'Yes' : 'No',
    scout: i % 14 === 0 ? 'Yes' : 'No',
    exServiceman: 'No',
    freedomFighter: 'No',
    kashmiri: 'No',
    bankName: i % 5 === 0 ? 'SBI' : '',
    dropoutReason: status === 'Dropped Out' ? 'Relocated' : '',
    enrolledFrom: `${year === '2024-25' ? '2024' : '2025'}-06-12`,
    createdBy: teachers[i % 5].value,
    lastModified: '2026-10-20',
    recordStatus: i % 15 === 0 ? 'Incomplete' : 'Complete',
    overallPct: pct,
  };
}

function makeAttendance(info: Row, i: number): Row {
  const statuses = ['Present', 'Present', 'Present', 'Absent', 'Late', 'Half Day', 'Leave', 'Present'];
  const att = statuses[i % 8];
  const pct = Number(info.overallPct);
  return {
    ...info,
    studentName: info.fullName,
    classSection: `${info.classGrade}-${info.section}`,
    date: '2026-10-23',
    month: 'October',
    attYear: info.academicYear,
    week: '43',
    term: 'Term 1',
    dayOfWeek: 'Friday',
    holidayExclusion: 'Exclude Holidays',
    subject: subjects[i % 5].value,
    subjectTeacher: teachers[i % 5].value,
    batch: 'Batch 1',
    attStatus: att,
    late: att === 'Late' ? 'Yes' : 'No',
    lateMinutes: att === 'Late' ? String(8 + (i % 20)) : '0',
    leaveType: att === 'Leave' ? 'Medical Leave' : '',
    leaveApprovedBy: att === 'Leave' ? teachers[0].value : '',
    absentReason: att === 'Absent' ? (i % 2 ? 'Sick' : 'Not Known') : '',
    absentWithoutInfo: att === 'Absent' && i % 2 === 0 ? 'Yes' : 'No',
    continuousAbsent: att === 'Absent' ? String(1 + (i % 4)) : '0',
    monthlyPct: String(Math.max(40, pct - 3)),
    termPct: String(Math.min(100, pct + 2)),
    belowMin: pct < 75 ? 'Below 75%' : '',
    aboveTarget: pct >= 95 ? 'Above 95%' : pct >= 90 ? 'Above 90%' : '',
    attCategory: pct > 95 ? 'Excellent (>95%)' : pct >= 75 ? 'Good (75–95%)' : pct >= 60 ? 'Average (60–75%)' : 'Poor (<60%)',
    examEligible: pct >= 75 ? 'Eligible' : pct >= 70 ? 'Borderline' : 'Not Eligible',
    presentDays: String(Math.round((pct / 100) * 168)),
    absentDays: String(Math.round(((100 - pct) / 100) * 168)),
    lateDays: att === 'Late' ? '4' : '1',
    halfDays: att === 'Half Day' ? '3' : '0',
    leaveDays: att === 'Leave' ? '2' : '0',
    workingDays: '168',
    markedBy: 'Teacher',
    entryMode: i % 4 === 0 ? 'Biometric' : 'Manual',
    markedAt: '2026-10-23',
    edited: i % 10 === 0 ? 'Yes' : 'No',
    correctedBy: i % 10 === 0 ? teachers[1].value : '',
    deviceId: i % 4 === 0 ? 'DEV-01' : '',
    notified: att === 'Absent' ? 'Yes' : 'No',
    smsSent: att === 'Absent' ? 'Yes' : 'No',
  };
}

function makeAdmission(info: Row, i: number): Row {
  const st = ['Approved', 'Pending', 'Waitlisted', 'Rejected', 'Approved', 'Approved'][i % 6];
  const month = String((i % 7) + 4).padStart(2, '0');
  return {
    ...info,
    studentName: info.fullName,
    applicationNo: `APP-26${String(i + 1).padStart(3, '0')}`,
    applicationDate: `2026-${month}-08`,
    applicationMode: i % 2 ? 'Online' : 'Offline',
    source: ['Website', 'Referral', 'Walk-in', 'Camp'][i % 4],
    yearApplying: '2025-26',
    classApplying: info.classGrade,
    round: ['Round 1', 'Round 2', 'Waiting List'][i % 3],
    applicationStatus: st === 'Approved' ? 'Approved' : st === 'Pending' ? 'Under Review' : st,
    referredBy: i % 5 === 0 ? 'Mrs. Patel' : '',
    sibling: i % 4 === 0 ? 'Yes' : 'No',
    siblingName: i % 4 === 0 ? 'Sibling Shah' : '',
    siblingClass: i % 4 === 0 ? 'Class 6' : '',
    admissionDate: st === 'Approved' ? `2026-${month}-18` : '',
    admissionStatus: st,
    approvedBy: st === 'Approved' ? 'Mrs. Nair' : '',
    approvedDate: st === 'Approved' ? `2026-${month}-16` : '',
    rejectionReason: st === 'Rejected' ? 'Seat Full' : '',
    seatType: info.rte === 'Yes' ? 'RTE' : 'General',
    classAllotted: st === 'Approved' ? info.classGrade : '',
    sectionAllotted: st === 'Approved' ? info.section : '',
    grIssued: st === 'Approved' ? 'Yes' : 'No',
    admNoIssued: st === 'Approved' ? 'Yes' : 'No',
    birthCert: 'Submitted',
    prevTc: i % 5 === 0 ? 'Pending' : 'Submitted',
    prevMarksheet: 'Submitted',
    aadharCopy: i % 8 === 0 ? 'Not Submitted' : 'Submitted',
    parentAadharCopy: 'Submitted',
    photoDoc: info.photo === 'Yes' ? 'Submitted' : 'Not Submitted',
    casteDoc: info.caste === 'General' ? 'Not Required' : 'Submitted',
    incomeDoc: info.bpl === 'Yes' ? 'Submitted' : 'Not Required',
    addressProof: 'Submitted',
    medicalCert: 'Submitted',
    migrationDoc: 'Not Required',
    allDocs: i % 5 === 0 || i % 8 === 0 ? 'No' : 'Yes',
    feePaid: st === 'Approved' ? 'Paid' : i % 3 === 0 ? 'Partial' : 'Unpaid',
    feeDate: st === 'Approved' ? `2026-${month}-19` : '',
    paymentMode: 'UPI',
    receiptNo: st === 'Approved' ? `R-88${100 + i}` : '',
    concession: info.feeConcession,
    rteFree: info.rte,
    scholarshipApplied: info.scholarship,
    prevSchool: ['Little Flower', "St. Mary's", 'DPS West', 'Kids Campus'][i % 4],
    prevSchoolType: i % 2 ? 'Private' : 'Government',
    prevBoard: 'CBSE',
    prevClass: classes[Math.max(0, 2 + (i % 10))].value,
    prevPct: String(60 + (i % 35)),
    prevMedium: 'English',
    yearLeaving: '2024-25',
    tcVerify: i % 5 === 0 ? 'Pending' : 'Verified',
  };
}

const INFO_ROWS = NAMES.map((_, i) => makeInfo(i));
const ATT_ROWS = INFO_ROWS.map((r, i) => makeAttendance(r, i));
const ADM_ROWS = INFO_ROWS.map((r, i) => makeAdmission(r, i));

const UNIFIED_ROWS: Row[] = INFO_ROWS.map((info, i) => ({
  ...info,
  ...ATT_ROWS[i],
  ...ADM_ROWS[i],
  studentId: info.studentId,
  fullName: info.fullName,
  classGrade: info.classGrade,
  section: info.section,
  status: info.status,
}));

const DEFAULT_COLS = [
  'studentId',
  'fullName',
  'classGrade',
  'section',
  'gender',
  'status',
  'attStatus',
  'overallPct',
  'admissionStatus',
];

function groupTitle(f: FilterDef) {
  if (f.module === 'info') return `Student Information · ${f.group}`;
  if (f.module === 'attendance') return `Attendance · ${f.group}`;
  if (f.module === 'admission') return `Admission · ${f.group}`;
  return f.group;
}

function isActive(v?: FVal) {
  if (!v) return false;
  if (v.text && v.text.trim()) return true;
  if (v.pick) return true;
  if (v.picks && v.picks.length) return true;
  if (v.min || v.max) return true;
  if (v.from || v.to) return true;
  return false;
}

function matchText(raw: string, val: string, mode?: string) {
  const a = raw.toLowerCase();
  const b = val.toLowerCase();
  if (!b) return true;
  if (mode === 'exact') return a === b;
  if (mode === 'starts') return a.startsWith(b);
  if (mode === 'ends') return a.endsWith(b);
  return a.includes(b);
}

function inDate(raw: string, from?: string, to?: string) {
  if (!raw) return false;
  if (from && raw < from) return false;
  if (to && raw > to) return false;
  return true;
}

function matchDef(row: Row, def: FilterDef, v: FVal) {
  const raw = String(row[def.id] ?? '');
  if (def.kind === 'text') return matchText(raw, v.text || '', v.mode);
  if (def.kind === 'select') return v.pick ? raw === v.pick : true;
  if (def.kind === 'multi') return v.picks && v.picks.length ? v.picks.includes(raw) : true;
  if (def.kind === 'dates') return inDate(raw, v.from, v.to);
  if (def.kind === 'nums') {
    const n = parseFloat(raw);
    if (Number.isNaN(n)) return false;
    if (v.min && n < parseFloat(v.min)) return false;
    if (v.max && n > parseFloat(v.max)) return false;
    return true;
  }
  return true;
}

function chipValue(def: FilterDef, v: FVal) {
  if (def.kind === 'text') return v.text || '';
  if (def.kind === 'select') return v.pick || '';
  if (def.kind === 'multi') return (v.picks || []).join(', ');
  if (def.kind === 'dates') return [v.from, v.to].filter(Boolean).join(' → ');
  if (def.kind === 'nums') return [v.min, v.max].filter(Boolean).join(' – ');
  return '';
}

function uid() {
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function stampNow() {
  return new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function reportFingerprint(columns: string[], vals: Record<string, FVal>, lg: Logic) {
  return JSON.stringify({ columns, values: vals, logic: lg });
}

function FilterControl({
  def,
  value,
  onChange,
}: {
  def: FilterDef;
  value: FVal;
  onChange: (v: FVal) => void;
}) {
  if (def.kind === 'text') {
    return (
      <div className="grid grid-cols-[110px_1fr] gap-1">
        <Select value={value.mode || 'contains'} options={TEXT_MODES} onChange={(m) => onChange({ ...value, mode: m })} />
        <Input value={value.text || ''} placeholder={def.label} onChange={(e) => onChange({ ...value, text: e.target.value })} />
      </div>
    );
  }
  if (def.kind === 'select') {
    return (
      <Select
        value={value.pick || ''}
        options={[{ value: '', label: 'All' }, ...(def.options || [])]}
        onChange={(m) => onChange({ ...value, pick: m })}
      />
    );
  }
  if (def.kind === 'multi') {
    return <MultiSelect options={def.options || []} value={value.picks || []} onChange={(picks) => onChange({ ...value, picks })} placeholder={def.label} />;
  }
  if (def.kind === 'dates') {
    return (
      <div className="grid grid-cols-2 gap-1">
        <Input type="date" value={value.from || ''} onChange={(e) => onChange({ ...value, from: e.target.value })} />
        <Input type="date" value={value.to || ''} onChange={(e) => onChange({ ...value, to: e.target.value })} />
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-1">
      <Input type="number" placeholder="Min" value={value.min || ''} onChange={(e) => onChange({ ...value, min: e.target.value })} />
      <Input type="number" placeholder="Max" value={value.max || ''} onChange={(e) => onChange({ ...value, max: e.target.value })} />
    </div>
  );
}

const ACADEMIC_STORAGE = 'k12-academic-custom-report-builder-v1';
const ACADEMIC_FILTER_SET_STORAGE = 'k12-academic-filter-sets-v1';
const ACADEMIC_FILTER_HISTORY_STORAGE = 'k12-academic-filter-history-v1';

const planStatuses = opt(['Draft', 'Submitted', 'Approved', 'Revise']);
const hwStatuses = opt(['Assigned', 'Submitted', 'Evaluated']);
const cwModes = opt(['Offline', 'Online', 'Hybrid']);
const coverageTypes = opt(['Full Completion', 'Partial Coverage']);
const materialTypes = opt(['Notes', 'Worksheet', 'Video', 'Textbook', 'Question Bank', 'Lab Manual']);
const diaryTypes = opt(['Circular', 'Homework note', 'Reminder', 'Activity']);
const eventKinds = opt(['Event', 'Competition']);
const eventCats = opt(['Academic', 'Cultural', 'Sports', 'Literary', 'National']);
const eventStatuses = opt(['Upcoming', 'Ongoing', 'Completed']);
const dutyTypes = opt(['Invigilation', 'Assembly', 'Break duty', 'Lab supervision', 'Bus duty', 'Sports ground']);
const bloomOpts = opt(['Remember', 'Understand', 'Apply', 'Analyse', 'Evaluate', 'Create']);
const methodOpts = opt(['Lecture', 'Discussion', 'Demonstration', 'Activity', 'Project', 'Problem Solving']);
const academicSubjects = opt(['Mathematics', 'Science', 'English', 'Hindi', 'Social Science', 'Physics', 'Chemistry', 'Computer Science']);
const terms = opt(['Term 1', 'Term 2', 'Term 3']);

const ACADEMIC_FILTERS: FilterDef[] = [
  F('academicYear', 'Academic Year', 'select', 'Global', 'all', years),
  F('term', 'Term', 'select', 'Global', 'all', terms),
  F('classGrade', 'Class / Grade', 'multi', 'Global', 'all', classes),
  F('section', 'Section', 'multi', 'Global', 'all', sections),
  F('subject', 'Subject', 'multi', 'Global', 'all', academicSubjects),
  F('teacher', 'Teacher', 'select', 'Global', 'all', teachers),
  F('board', 'Board', 'select', 'Global', 'all', boards),
  F('stream', 'Stream', 'select', 'Global', 'all', streams),
  F('medium', 'Medium', 'select', 'Global', 'all', mediums),
  F('shift', 'Shift', 'select', 'Global', 'all', shifts),

  F('chapterName', 'Chapter', 'text', 'Plan details', 'plan'),
  F('topicName', 'Topic', 'text', 'Plan details', 'plan'),
  F('planStatus', 'Plan status', 'select', 'Plan details', 'plan', planStatuses),
  F('planPct', 'Plan completion %', 'nums', 'Plan details', 'plan'),
  F('periodsAllocated', 'Periods allocated', 'nums', 'Plan details', 'plan'),
  F('periodsCompleted', 'Periods completed', 'nums', 'Plan details', 'plan'),
  F('laggingTopic', 'Lagging topic', 'text', 'Plan details', 'plan'),
  F('bloomLevel', "Bloom's level", 'select', 'Plan details', 'plan', bloomOpts),
  F('teachingMethod', 'Teaching method', 'select', 'Plan details', 'plan', methodOpts),

  F('classworkTitle', 'Classwork title', 'text', 'Lesson coverage', 'classwork'),
  F('classworkDate', 'Classwork date', 'dates', 'Lesson coverage', 'classwork'),
  F('period', 'Period', 'select', 'Lesson coverage', 'classwork', opt(['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5', 'Period 6'])),
  F('teachingMode', 'Teaching mode', 'select', 'Lesson coverage', 'classwork', cwModes),
  F('coverageType', 'Coverage type', 'select', 'Lesson coverage', 'classwork', coverageTypes),
  F('classworkStatus', 'Classwork status', 'select', 'Lesson coverage', 'classwork', opt(['Planned', 'Completed', 'Partial', 'Missed'])),

  F('homeworkTitle', 'Homework / assignment title', 'text', 'Work assigned', 'homework'),
  F('homeworkType', 'Work type', 'select', 'Work assigned', 'homework', opt(['Homework', 'Assignment', 'Project', 'Worksheet'])),
  F('assignedDate', 'Assigned date', 'dates', 'Work assigned', 'homework'),
  F('dueDate', 'Due date', 'dates', 'Work assigned', 'homework'),
  F('homeworkStatus', 'Homework status', 'select', 'Work assigned', 'homework', hwStatuses),
  F('submissionPct', 'Submission %', 'nums', 'Work assigned', 'homework'),
  F('evaluatedPct', 'Evaluated %', 'nums', 'Work assigned', 'homework'),
  F('lateCount', 'Late submissions', 'nums', 'Work assigned', 'homework'),

  F('materialTitle', 'Material title', 'text', 'Resources', 'material'),
  F('materialType', 'Material type', 'select', 'Resources', 'material', materialTypes),
  F('materialStatus', 'Material status', 'select', 'Resources', 'material', opt(['Published', 'Draft', 'Archived'])),
  F('materialChapter', 'Linked chapter', 'text', 'Resources', 'material'),

  F('diaryDate', 'Diary date', 'dates', 'Entries', 'diary'),
  F('diaryType', 'Diary entry type', 'select', 'Entries', 'diary', diaryTypes),
  F('diaryAudience', 'Diary audience', 'select', 'Entries', 'diary', opt(['Class', 'Whole school', 'Teachers', 'Parents'])),
  F('diaryStatus', 'Diary status', 'select', 'Entries', 'diary', opt(['Published', 'Draft'])),

  F('eventName', 'Event / competition name', 'text', 'Activity', 'event'),
  F('eventKind', 'Kind', 'select', 'Activity', 'event', eventKinds),
  F('eventCategory', 'Category', 'select', 'Activity', 'event', eventCats),
  F('eventDate', 'Event date', 'dates', 'Activity', 'event'),
  F('eventStatus', 'Event status', 'select', 'Activity', 'event', eventStatuses),
  F('participants', 'Participants', 'nums', 'Activity', 'event'),

  F('dutyType', 'Duty type', 'select', 'Roster', 'duty', dutyTypes),
  F('dutyAssigned', 'Duties assigned', 'nums', 'Roster', 'duty'),
  F('dutyCompleted', 'Duties completed', 'nums', 'Roster', 'duty'),
  F('dutyMissed', 'Duties missed', 'nums', 'Roster', 'duty'),
];

const CHAPTERS = ['Fractions', 'Polynomials', 'Atoms & Molecules', 'Trigonometry', 'Organic chemistry', 'Tenses', 'The Mughal Empire', 'Light', 'Number Systems', 'Democracy', 'Life Processes', 'Coordination Compounds'];
const TOPICS = ['Introduction', 'Practice set', 'Lab activity', 'Revision', 'Word problems', 'Map work'];

function makeAcademic(i: number): Row {
  const cls = classes[3 + (i % 12)].value;
  const section = sections[i % 4].value;
  const subject = academicSubjects[i % academicSubjects.length].value;
  const teacher = teachers[i % teachers.length].value;
  const planPct = 52 + ((i * 11) % 48);
  const periodsAllocated = 16 + (i % 10);
  const periodsCompleted = Math.round((planPct / 100) * periodsAllocated);
  const submitted = 18 + (i % 14);
  const total = 32;
  const evaluated = Math.max(0, submitted - (i % 5));
  const chapter = CHAPTERS[i % CHAPTERS.length];
  const month = String((i % 6) + 4).padStart(2, '0');
  return {
    academicId: `AC-${1101 + i}`,
    academicYear: i % 11 === 0 ? '2024-25' : '2025-26',
    term: terms[i % 3].value,
    classGrade: cls,
    section,
    subject,
    teacher,
    board: 'CBSE',
    stream: cls === 'Class 11' || cls === 'Class 12' ? streams[i % 3].value : '',
    medium: mediums[i % 3].value,
    shift: shifts[i % 3].value,
    chapterName: chapter,
    topicName: TOPICS[i % TOPICS.length],
    planStatus: planStatuses[i % planStatuses.length].value,
    planPct: String(planPct),
    periodsAllocated: String(periodsAllocated),
    periodsCompleted: String(periodsCompleted),
    laggingTopic: planPct < 75 ? chapter : '—',
    bloomLevel: bloomOpts[i % bloomOpts.length].value,
    teachingMethod: methodOpts[i % methodOpts.length].value,
    classworkTitle: `${subject} — ${chapter}`,
    classworkDate: `2026-${month}-${String(10 + (i % 15)).padStart(2, '0')}`,
    period: `Period ${(i % 6) + 1}`,
    teachingMode: cwModes[i % 3].value,
    coverageType: planPct >= 80 ? 'Full Completion' : 'Partial Coverage',
    classworkStatus: planPct >= 85 ? 'Completed' : planPct >= 60 ? 'Partial' : 'Planned',
    homeworkTitle: i % 3 === 0 ? `${subject} worksheet — ${chapter}` : i % 3 === 1 ? `${subject} assignment` : `${subject} project`,
    homeworkType: ['Homework', 'Assignment', 'Project', 'Worksheet'][i % 4],
    assignedDate: `2026-${month}-08`,
    dueDate: `2026-${month}-18`,
    homeworkStatus: hwStatuses[i % 3].value,
    submissionPct: String(Math.round((submitted / total) * 100)),
    evaluatedPct: String(Math.round((evaluated / total) * 100)),
    lateCount: String(i % 4),
    materialTitle: `${chapter} notes`,
    materialType: materialTypes[i % materialTypes.length].value,
    materialStatus: i % 8 === 0 ? 'Draft' : 'Published',
    materialChapter: chapter,
    diaryDate: `2026-${month}-12`,
    diaryType: diaryTypes[i % diaryTypes.length].value,
    diaryAudience: ['Class', 'Whole school', 'Teachers', 'Parents'][i % 4],
    diaryStatus: i % 9 === 0 ? 'Draft' : 'Published',
    eventName: ['Science Exhibition', 'Math Olympiad', 'Inter-House Debate', 'Sports Day', 'Annual Day'][i % 5],
    eventKind: i % 2 ? 'Competition' : 'Event',
    eventCategory: eventCats[i % eventCats.length].value,
    eventDate: `2026-${month}-22`,
    eventStatus: eventStatuses[i % 3].value,
    participants: String(20 + i * 7),
    dutyType: dutyTypes[i % dutyTypes.length].value,
    dutyAssigned: String(8 + (i % 12)),
    dutyCompleted: String(6 + (i % 10)),
    dutyMissed: String(i % 3),
  };
}

const ACADEMIC_ROWS = Array.from({ length: 28 }, (_, i) => makeAcademic(i));
const ACADEMIC_DEFAULT_COLS = [
  'classGrade',
  'section',
  'subject',
  'teacher',
  'planPct',
  'homeworkTitle',
  'homeworkStatus',
  'classworkStatus',
  'materialTitle',
  'laggingTopic',
];

function academicGroupTitle(f: FilterDef) {
  if (f.module === 'plan') return `Teaching Plan · ${f.group}`;
  if (f.module === 'classwork') return `Classwork · ${f.group}`;
  if (f.module === 'homework') return `Homework & Assignments · ${f.group}`;
  if (f.module === 'material') return `Study Material · ${f.group}`;
  if (f.module === 'diary') return `School Diary · ${f.group}`;
  if (f.module === 'event') return `Events & Competitions · ${f.group}`;
  if (f.module === 'duty') return `Teacher Duties · ${f.group}`;
  return f.group;
}

const EMPLOYEE_STORAGE = 'k12-employee-custom-report-builder-v1';
const EMPLOYEE_FILTER_SET_STORAGE = 'k12-employee-filter-sets-v1';
const EMPLOYEE_FILTER_HISTORY_STORAGE = 'k12-employee-filter-history-v1';

const empDepts = opt(['Mathematics', 'English', 'Science', 'Administration', 'HR', 'Accounts', 'Library', 'Sports', 'IT', 'Transport']);
const empDesigs = opt(['PGT', 'TGT', 'PRT', 'HOD', 'Principal', 'Vice Principal', 'Admin Officer', 'Accountant', 'Librarian', 'Clerk', 'Coordinator']);
const staffTypes = opt(['Teaching', 'Non-Teaching', 'Support', 'Contract']);
const empStatuses = opt(['Active', 'Probation', 'On Leave', 'Resigned', 'Terminated', 'Retired']);
const empTypes = opt(['Permanent', 'Contract', 'Temporary', 'Probation']);
const empGrades = opt(['Grade A', 'Grade B', 'Grade C', 'Grade D']);
const empBranches = opt(['Main Campus', 'North Campus', 'West Campus']);
const empLocations = opt(['Main Campus', 'Annex', 'Hostel Block']);
const empMarital = opt(['Single', 'Married', 'Widowed', 'Divorced']);
const empQuais = opt(['Ph.D', 'Post Graduate', 'Graduate', 'Diploma', 'B.Ed', 'M.Ed']);
const payModes = opt(['Bank Transfer', 'Cheque', 'Cash']);
const payrollStatuses = opt(['Processed', 'On Hold', 'Exception', 'Draft']);
const regimes = opt(['Old', 'New']);
const ratingLabels = opt(['Outstanding', 'Very Good', 'Good', 'Satisfactory', 'Needs Improvement']);
const appraisalStatuses = opt(['Not Started', 'Self Review', 'Manager Review', 'Completed']);
const proofStatuses = opt(['Verified', 'Pending', 'Rejected', 'Not Submitted']);
const form16Statuses = opt(['Generated', 'Pending', 'Issued']);
const fnfStatuses = opt(['Not Applicable', 'Pending', 'In Progress', 'Settled']);
const exitReasons = opt(['Resignation', 'Retirement', 'Termination', 'End of Contract']);
const hireSources = opt(['Direct', 'Referral', 'Job portal', 'Campus', 'Internal']);
const probationStatuses = opt(['Confirmed', 'On Probation', 'Extended', 'Not Applicable']);
const empLeaveTypes = opt(['Casual Leave', 'Sick Leave', 'Earned Leave', 'Maternity Leave', 'On Duty']);
const appraisalCycles = opt(['AY 2024-25', 'AY 2025-26', 'Mid-year 2026']);
const reporters = opt(['Principal', 'Vice Principal', 'HOD Mathematics', 'HOD English', 'Admin Head', 'HR Manager']);

const EMPLOYEE_FILTERS: FilterDef[] = [
  F('financialYear', 'Financial Year', 'select', 'Global', 'all', years),
  F('branch', 'Branch / Campus', 'multi', 'Global', 'all', empBranches),
  F('department', 'Department', 'multi', 'Global', 'all', empDepts),
  F('designation', 'Designation', 'multi', 'Global', 'all', empDesigs),
  F('staffType', 'Staff Type', 'multi', 'Global', 'all', staffTypes),
  F('gender', 'Gender', 'multi', 'Global', 'all', genders),
  F('status', 'Employee Status', 'multi', 'Global', 'all', empStatuses),
  F('shift', 'Shift', 'select', 'Global', 'all', shifts),

  F('empId', 'Employee ID', 'text', 'Identity', 'profile'),
  F('fullName', 'Employee Full Name', 'text', 'Identity', 'profile'),
  F('dob', 'Date of Birth', 'dates', 'Identity', 'profile'),
  F('age', 'Age', 'nums', 'Identity', 'profile'),
  F('bloodGroup', 'Blood Group', 'multi', 'Identity', 'profile', bloods),
  F('maritalStatus', 'Marital Status', 'select', 'Identity', 'profile', empMarital),
  F('category', 'Category', 'multi', 'Identity', 'profile', castes),
  F('religion', 'Religion', 'select', 'Identity', 'profile', religions),
  F('aadhar', 'Aadhar Number', 'text', 'Identity', 'profile'),
  F('pan', 'PAN', 'text', 'Identity', 'profile'),
  F('email', 'Email', 'text', 'Identity', 'profile'),
  F('phone', 'Phone', 'text', 'Identity', 'profile'),
  F('qualification', 'Qualification', 'select', 'Identity', 'profile', empQuais),

  F('joiningDate', 'Joining Date', 'dates', 'Service', 'employment'),
  F('confirmationDate', 'Confirmation Date', 'dates', 'Service', 'employment'),
  F('experience', 'Experience (years)', 'nums', 'Service', 'employment'),
  F('employmentType', 'Employment Type', 'select', 'Service', 'employment', empTypes),
  F('grade', 'Grade / Level', 'select', 'Service', 'employment', empGrades),
  F('reportingTo', 'Reporting To', 'select', 'Service', 'employment', reporters),
  F('location', 'Work Location', 'select', 'Service', 'employment', empLocations),
  F('subjectsTaught', 'Subjects Taught', 'text', 'Service', 'employment'),
  F('probationStatus', 'Probation Status', 'select', 'Service', 'employment', probationStatuses),
  F('hireSource', 'Hire Source', 'select', 'Service', 'employment', hireSources),
  F('uan', 'UAN', 'text', 'Service', 'employment'),
  F('esiNo', 'ESI Number', 'text', 'Service', 'employment'),

  F('attMonth', 'Attendance Month', 'select', 'Period', 'attendance', months),
  F('attYear', 'Attendance Year', 'select', 'Period', 'attendance', years),
  F('attStatus', 'Today Status', 'multi', 'Period', 'attendance', attStatuses),
  F('presentDays', 'Present Days', 'nums', 'Period', 'attendance'),
  F('absentDays', 'Absent Days', 'nums', 'Period', 'attendance'),
  F('lateDays', 'Late Days', 'nums', 'Period', 'attendance'),
  F('overtimeHours', 'Overtime Hours', 'nums', 'Period', 'attendance'),
  F('leaveType', 'Leave Type', 'select', 'Period', 'attendance', empLeaveTypes),
  F('leaveBalance', 'Leave Balance', 'nums', 'Period', 'attendance'),
  F('leaveTaken', 'Leave Taken', 'nums', 'Period', 'attendance'),
  F('overallPct', 'Attendance %', 'nums', 'Period', 'attendance'),

  F('payScale', 'Pay Scale', 'select', 'Salary', 'payroll', empGrades),
  F('basicSalary', 'Basic Salary', 'nums', 'Salary', 'payroll'),
  F('grossPay', 'Gross Pay', 'nums', 'Salary', 'payroll'),
  F('netPay', 'Net Pay', 'nums', 'Salary', 'payroll'),
  F('pfAmount', 'PF Amount', 'nums', 'Salary', 'payroll'),
  F('tdsAmount', 'TDS Amount', 'nums', 'Salary', 'payroll'),
  F('payrollStatus', 'Payroll Status', 'select', 'Salary', 'payroll', payrollStatuses),
  F('disbursementMode', 'Disbursement Mode', 'select', 'Salary', 'payroll', payModes),
  F('bankName', 'Bank Name', 'text', 'Salary', 'payroll'),
  F('advanceOutstanding', 'Advance Outstanding', 'nums', 'Salary', 'payroll'),

  F('appraisalCycle', 'Appraisal Cycle', 'select', 'Review', 'appraisal', appraisalCycles),
  F('appraisalRating', 'Appraisal Rating', 'select', 'Review', 'appraisal', ratingLabels),
  F('appraisalScore', 'Appraisal Score', 'nums', 'Review', 'appraisal'),
  F('appraisalStatus', 'Appraisal Status', 'select', 'Review', 'appraisal', appraisalStatuses),
  F('trainingNeed', 'Training Need', 'select', 'Review', 'appraisal', yn),

  F('taxRegime', 'Tax Regime', 'select', 'TDS', 'tax', regimes),
  F('tdsYtd', 'TDS YTD', 'nums', 'TDS', 'tax'),
  F('form16Status', 'Form-16 Status', 'select', 'TDS', 'tax', form16Statuses),
  F('investmentDeclared', 'Investment Declared', 'select', 'TDS', 'tax', yn),
  F('proofStatus', 'Proof Status', 'select', 'TDS', 'tax', proofStatuses),

  F('exitStatus', 'Exit Status', 'select', 'Separation', 'exit', opt(['In Service', 'Notice Period', 'Relieved'])),
  F('lastWorkingDay', 'Last Working Day', 'dates', 'Separation', 'exit'),
  F('fnfStatus', 'FnF Status', 'select', 'Separation', 'exit', fnfStatuses),
  F('exitReason', 'Exit Reason', 'select', 'Separation', 'exit', exitReasons),
];

const EMP_NAMES: [string, string][] = [
  ['Priya', 'Sharma'], ['Ramesh', 'Patel'], ['Neeta', 'Mishra'], ['Amit', 'Rao'],
  ['Kavita', 'Das'], ['Rajesh', 'Kumar'], ['Sarah', 'Jenkins'], ['Michael', 'Chen'],
  ['Anita', 'Desai'], ['Suresh', 'Iyer'], ['Meera', 'Nair'], ['Vikram', 'Shah'],
  ['Pooja', 'Joshi'], ['Farhan', 'Khan'], ['Deepa', 'Reddy'], ['Arun', 'Menon'],
  ['Sunita', 'Verma'], ['Nikhil', 'Gupta'], ['Lata', 'Bhatt'], ['Imran', 'Sheikh'],
  ['Geeta', 'Trivedi'], ['Harsh', 'Mehta'], ['Ritu', 'Kapoor'], ['Sanjay', 'Yadav'],
  ['Nisha', 'Pillai'], ['Kiran', 'Solanki'], ['Asha', 'Banerjee'], ['Dev', 'Chauhan'],
];

function makeEmployee(i: number): Row {
  const [first, last] = EMP_NAMES[i % EMP_NAMES.length];
  const staffType = staffTypes[i % staffTypes.length].value;
  const teaching = staffType === 'Teaching';
  const status = i % 11 === 0 ? 'Resigned' : i % 7 === 0 ? 'Probation' : i % 9 === 0 ? 'On Leave' : 'Active';
  const inService = status !== 'Resigned' && status !== 'Terminated' && status !== 'Retired';
  const present = 18 + (i % 6);
  const absent = i % 4;
  const late = i % 3;
  const working = 24;
  const pct = Math.round((present / working) * 100);
  const basic = 22000 + (i % 10) * 4500;
  const gross = basic + 12000 + (i % 5) * 2000;
  const tds = Math.round(gross * 0.08);
  const pf = Math.round(basic * 0.12);
  const net = gross - tds - pf - (i % 4) * 500;
  const score = 62 + (i * 7) % 36;
  const month = String((i % 9) + 1).padStart(2, '0');
  const joinYear = 2016 + (i % 9);
  return {
    financialYear: i % 10 === 0 ? '2024-25' : '2025-26',
    branch: empBranches[i % empBranches.length].value,
    department: teaching ? empDepts[i % 4].value : empDepts[4 + (i % 6)].value,
    designation: teaching ? empDesigs[i % 6].value : empDesigs[6 + (i % 5)].value,
    staffType,
    gender: i % 3 === 0 ? 'Female' : 'Male',
    status,
    shift: shifts[i % 3].value,
    empId: `EMP${String(1001 + i).padStart(4, '0')}`,
    fullName: `${first} ${last}`,
    dob: `${1976 + (i % 20)}-${month}-12`,
    age: String(28 + (i % 22)),
    bloodGroup: bloods[i % bloods.length].value,
    maritalStatus: empMarital[i % empMarital.length].value,
    category: castes[i % castes.length].value,
    religion: religions[i % religions.length].value,
    aadhar: `XXXX-XXXX-${1000 + i}`,
    pan: `ABCDE${1000 + i}F`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@school.edu`,
    phone: `98765${43200 + i}`,
    qualification: empQuais[i % empQuais.length].value,
    joiningDate: `${joinYear}-06-${String(10 + (i % 18)).padStart(2, '0')}`,
    confirmationDate: status === 'Probation' ? '' : `${joinYear + 1}-06-15`,
    experience: String(2026 - joinYear),
    employmentType: status === 'Probation' ? 'Probation' : empTypes[i % 3].value,
    grade: empGrades[i % empGrades.length].value,
    reportingTo: reporters[i % reporters.length].value,
    location: empLocations[i % empLocations.length].value,
    subjectsTaught: teaching ? ['Mathematics', 'English', 'Science', 'Hindi', 'Social Science'][i % 5] : '—',
    probationStatus: status === 'Probation' ? 'On Probation' : inService ? 'Confirmed' : 'Not Applicable',
    hireSource: hireSources[i % hireSources.length].value,
    uan: `10020${88000 + i}`,
    esiNo: i % 5 === 0 ? '—' : `ESI-${2200 + i}`,
    attMonth: months[i % 12].value,
    attYear: '2025-26',
    attStatus: status === 'On Leave' ? 'Leave' : attStatuses[i % 5].value,
    presentDays: String(present),
    absentDays: String(absent),
    lateDays: String(late),
    overtimeHours: String(i % 8),
    leaveType: empLeaveTypes[i % empLeaveTypes.length].value,
    leaveBalance: String(6 + (i % 12)),
    leaveTaken: String(i % 7),
    overallPct: String(pct),
    payScale: empGrades[i % empGrades.length].value,
    basicSalary: String(basic),
    grossPay: String(gross),
    netPay: String(net),
    pfAmount: String(pf),
    tdsAmount: String(tds),
    payrollStatus: i % 8 === 0 ? 'Exception' : 'Processed',
    disbursementMode: payModes[i % 3].value,
    bankName: ['SBI', 'HDFC', 'ICICI', 'BOB'][i % 4],
    advanceOutstanding: String(i % 6 === 0 ? 5000 : 0),
    appraisalCycle: appraisalCycles[i % appraisalCycles.length].value,
    appraisalRating: ratingLabels[score >= 90 ? 0 : score >= 80 ? 1 : score >= 70 ? 2 : score >= 60 ? 3 : 4].value,
    appraisalScore: String(score),
    appraisalStatus: appraisalStatuses[i % appraisalStatuses.length].value,
    trainingNeed: score < 75 ? 'Yes' : 'No',
    taxRegime: regimes[i % 2].value,
    tdsYtd: String(tds * 8),
    form16Status: form16Statuses[i % 3].value,
    investmentDeclared: i % 4 === 0 ? 'No' : 'Yes',
    proofStatus: proofStatuses[i % proofStatuses.length].value,
    exitStatus: inService ? (status === 'On Leave' ? 'In Service' : 'In Service') : 'Relieved',
    lastWorkingDay: inService ? '' : `2026-${month}-28`,
    fnfStatus: inService ? 'Not Applicable' : fnfStatuses[1 + (i % 3)].value,
    exitReason: inService ? '' : exitReasons[i % exitReasons.length].value,
  };
}

const EMPLOYEE_ROWS = Array.from({ length: 28 }, (_, i) => makeEmployee(i));
const EMPLOYEE_DEFAULT_COLS = [
  'empId',
  'fullName',
  'department',
  'designation',
  'staffType',
  'status',
  'attStatus',
  'overallPct',
  'netPay',
];

function employeeGroupTitle(f: FilterDef) {
  if (f.module === 'profile') return `Employee Profile · ${f.group}`;
  if (f.module === 'employment') return `Employment · ${f.group}`;
  if (f.module === 'attendance') return `Attendance & Leave · ${f.group}`;
  if (f.module === 'payroll') return `Payroll · ${f.group}`;
  if (f.module === 'appraisal') return `Appraisal · ${f.group}`;
  if (f.module === 'tax') return `Income Tax · ${f.group}`;
  if (f.module === 'exit') return `Exit & Separation · ${f.group}`;
  return f.group;
}

const FINANCE_STORAGE = 'k12-finance-custom-report-builder-v1';
const FINANCE_FILTER_SET_STORAGE = 'k12-finance-filter-sets-v1';
const FINANCE_FILTER_HISTORY_STORAGE = 'k12-finance-filter-history-v1';

const finBranches = opt(['Main Campus', 'East Wing', 'West Wing']);
const finRecordTypes = opt(['Fee Collection', 'Charge', 'Scholarship', 'Expense', 'Ledger', 'Refund']);
const finFeeHeads = opt(['Tuition', 'Transport', 'Admission', 'Exam', 'Library', 'Lab', 'Hostel']);
const finFeeCats = opt(['General', 'RTE', 'Staff Ward', 'Sibling']);
const finInstallments = opt(['Term 1', 'Term 2', 'Term 3', 'Annual']);
const finPayModes = opt(['Cash', 'UPI', 'Card', 'NEFT', 'Cheque', 'DD']);
const finFeeStatuses = opt(['Paid', 'Partial', 'Due', 'Overdue']);
const finExemptions = opt(['None', 'Sibling', 'Staff Ward', 'RTE', 'Scholarship']);
const finChargeTypes = opt(['ID Card', 'Certificate', 'Duplicate Marksheet', 'Bus Pass', 'Prospectus']);
const finChargeStatuses = opt(['Collected', 'Pending', 'Cancelled']);
const finSchemes = opt(['Merit', 'Minority', 'SC/ST', 'Government', 'Private']);
const finAgencies = opt(['State Govt', 'Central Govt', 'Trust', 'CSR Partner']);
const finDisbStatuses = opt(['Awarded', 'Disbursed', 'Pending', 'Cancelled']);
const finExpenseHeads = opt(['Utilities', 'Stationery', 'Maintenance', 'Transport', 'Lab consumables', 'Petty Cash']);
const finVendors = opt(['ABC Supplies', 'City Electricals', 'School Books Co', 'Green Clean', 'HDFC Vendor']);
const finExpenseStatuses = opt(['Requested', 'Approved', 'Paid', 'Rejected']);
const finAccounts = opt(['Tuition Fees', 'Bank - HDFC', 'Cash in Hand', 'Salary Payable', 'Scholarship Expense', 'Transport Income']);
const finVoucherTypes = opt(['Receipt', 'Payment', 'Journal', 'Contra']);
const finBooks = opt(['Cash Book', 'Bank Book', 'Day Book']);
const finRefundStatuses = opt(['Requested', 'Approved', 'Paid', 'Rejected']);
const finTerms = opt(['Term 1', 'Term 2', 'Term 3']);

const FINANCE_FILTERS: FilterDef[] = [
  F('academicYear', 'Academic Year', 'select', 'Global', 'all', years),
  F('branch', 'Branch / Centre', 'select', 'Global', 'all', finBranches),
  F('term', 'Term', 'select', 'Global', 'all', finTerms),
  F('recordType', 'Record type', 'select', 'Global', 'all', finRecordTypes),
  F('classGrade', 'Class / Grade', 'multi', 'Global', 'all', classes),
  F('section', 'Section', 'multi', 'Global', 'all', sections),

  F('student', 'Student', 'text', 'Party', 'party'),
  F('admissionNo', 'Admission No', 'text', 'Party', 'party'),
  F('parentName', 'Parent', 'text', 'Party', 'party'),
  F('employee', 'Employee / payee', 'text', 'Party', 'party'),
  F('vendor', 'Vendor', 'select', 'Party', 'party', finVendors),

  F('receiptNo', 'Receipt No', 'text', 'Collection', 'fees'),
  F('feeHead', 'Fee head', 'select', 'Collection', 'fees', finFeeHeads),
  F('feeCategory', 'Fee category', 'select', 'Collection', 'fees', finFeeCats),
  F('installment', 'Installment', 'select', 'Collection', 'fees', finInstallments),
  F('grossAmount', 'Gross amount', 'nums', 'Collection', 'fees'),
  F('concession', 'Concession', 'nums', 'Collection', 'fees'),
  F('paidAmount', 'Paid amount', 'nums', 'Collection', 'fees'),
  F('balanceAmount', 'Balance due', 'nums', 'Collection', 'fees'),
  F('lateFine', 'Late fine', 'nums', 'Collection', 'fees'),
  F('dueDate', 'Due date', 'dates', 'Collection', 'fees'),
  F('collectionDate', 'Collection date', 'dates', 'Collection', 'fees'),
  F('paymentMode', 'Payment mode', 'select', 'Collection', 'fees', finPayModes),
  F('feeStatus', 'Fee status', 'select', 'Collection', 'fees', finFeeStatuses),
  F('exemptionType', 'Exemption', 'select', 'Collection', 'fees', finExemptions),

  F('chargeType', 'Charge type', 'select', 'Other receipts', 'charge', finChargeTypes),
  F('chargeReceipt', 'Charge receipt', 'text', 'Other receipts', 'charge'),
  F('chargeAmount', 'Charge amount', 'nums', 'Other receipts', 'charge'),
  F('chargeStatus', 'Charge status', 'select', 'Other receipts', 'charge', finChargeStatuses),

  F('scheme', 'Scholarship scheme', 'select', 'Award', 'scholarship', finSchemes),
  F('agency', 'Agency / donor', 'select', 'Award', 'scholarship', finAgencies),
  F('awardAmount', 'Award amount', 'nums', 'Award', 'scholarship'),
  F('disbursementStatus', 'Disbursement status', 'select', 'Award', 'scholarship', finDisbStatuses),
  F('disbursementDate', 'Disbursement date', 'dates', 'Award', 'scholarship'),

  F('voucherNo', 'Voucher / bill no', 'text', 'Spend', 'expense'),
  F('expenseHead', 'Expense head', 'select', 'Spend', 'expense', finExpenseHeads),
  F('billNo', 'Bill / invoice no', 'text', 'Spend', 'expense'),
  F('requestedAmount', 'Requested amount', 'nums', 'Spend', 'expense'),
  F('approvedAmount', 'Approved / paid', 'nums', 'Spend', 'expense'),
  F('expenseStatus', 'Expense status', 'select', 'Spend', 'expense', finExpenseStatuses),
  F('expenseDate', 'Expense date', 'dates', 'Spend', 'expense'),

  F('accountName', 'Account', 'select', 'Books', 'ledger', finAccounts),
  F('accountCode', 'Account code', 'text', 'Books', 'ledger'),
  F('voucherType', 'Voucher type', 'select', 'Books', 'ledger', finVoucherTypes),
  F('debit', 'Debit', 'nums', 'Books', 'ledger'),
  F('credit', 'Credit', 'nums', 'Books', 'ledger'),
  F('book', 'Book', 'select', 'Books', 'ledger', finBooks),

  F('refundNo', 'Refund no', 'text', 'Returns', 'refund'),
  F('refundAmount', 'Refund amount', 'nums', 'Returns', 'refund'),
  F('refundStatus', 'Refund status', 'select', 'Returns', 'refund', finRefundStatuses),
];

const FIN_STUDENTS = ['Aarav Shah', 'Diya Patel', 'Isha Nair', 'Rohan Joshi', 'Kabir Mehta', 'Ananya Desai', 'Vihaan Rao', 'Myra Kapoor'];
const FIN_PARENTS = ['Rajesh Shah', 'Nilesh Patel', 'Suresh Nair', 'Amit Joshi', 'Karan Mehta', 'Mehul Desai', 'Arun Rao', 'Nikhil Kapoor'];
const FIN_EMPLOYEES = ['Mrs. Patel', 'Mr. Verma', 'Accounts Desk', 'Transport Desk', 'Admin Office'];

function makeFinance(i: number): Row {
  const student = FIN_STUDENTS[i % FIN_STUDENTS.length];
  const recordType = finRecordTypes[i % finRecordTypes.length].value;
  const cls = classes[3 + (i % 12)].value;
  const month = String((i % 8) + 4).padStart(2, '0');
  const day = String(8 + (i % 18)).padStart(2, '0');
  const gross = 8000 + (i % 7) * 2500;
  const concession = i % 4 === 0 ? Math.round(gross * 0.1) : 0;
  const paid = recordType === 'Refund' ? 0 : i % 5 === 0 ? Math.round((gross - concession) * 0.5) : gross - concession;
  const balance = Math.max(0, gross - concession - paid);
  const chargeAmt = 150 + (i % 5) * 50;
  const award = 5000 + (i % 6) * 2000;
  const requested = 1200 + (i % 8) * 800;
  const approved = i % 7 === 0 ? 0 : requested;
  return {
    financeId: `FN-${2401 + i}`,
    academicYear: i % 9 === 0 ? '2024-25' : '2025-26',
    branch: finBranches[i % finBranches.length].value,
    term: finTerms[i % 3].value,
    recordType,
    classGrade: cls,
    section: sections[i % 4].value,
    student,
    admissionNo: `ADM-2025-${1200 + i}`,
    parentName: FIN_PARENTS[i % FIN_PARENTS.length],
    employee: FIN_EMPLOYEES[i % FIN_EMPLOYEES.length],
    vendor: finVendors[i % finVendors.length].value,
    receiptNo: `R-88${200 + i}`,
    feeHead: finFeeHeads[i % finFeeHeads.length].value,
    feeCategory: finFeeCats[i % finFeeCats.length].value,
    installment: finInstallments[i % finInstallments.length].value,
    grossAmount: String(gross),
    concession: String(concession),
    paidAmount: String(paid),
    balanceAmount: String(balance),
    lateFine: String(balance > 0 && i % 3 === 0 ? 200 : 0),
    dueDate: `2026-${month}-05`,
    collectionDate: paid > 0 ? `2026-${month}-${day}` : '',
    paymentMode: finPayModes[i % finPayModes.length].value,
    feeStatus: balance === 0 ? 'Paid' : paid > 0 ? 'Partial' : i % 4 === 0 ? 'Overdue' : 'Due',
    exemptionType: concession > 0 ? finExemptions[(i % 4) + 1].value : 'None',
    chargeType: finChargeTypes[i % finChargeTypes.length].value,
    chargeReceipt: `CH-31${100 + i}`,
    chargeAmount: String(chargeAmt),
    chargeStatus: finChargeStatuses[i % finChargeStatuses.length].value,
    scheme: finSchemes[i % finSchemes.length].value,
    agency: finAgencies[i % finAgencies.length].value,
    awardAmount: String(award),
    disbursementStatus: finDisbStatuses[i % finDisbStatuses.length].value,
    disbursementDate: `2026-${month}-20`,
    voucherNo: `EXP-9${300 + i}`,
    expenseHead: finExpenseHeads[i % finExpenseHeads.length].value,
    billNo: `BILL-${4500 + i}`,
    requestedAmount: String(requested),
    approvedAmount: String(approved),
    expenseStatus: finExpenseStatuses[i % finExpenseStatuses.length].value,
    expenseDate: `2026-${month}-${day}`,
    accountName: finAccounts[i % finAccounts.length].value,
    accountCode: `AC-${1000 + (i % 12)}`,
    voucherType: finVoucherTypes[i % finVoucherTypes.length].value,
    debit: String(i % 2 === 0 ? paid || requested : 0),
    credit: String(i % 2 === 1 ? paid || requested : 0),
    book: finBooks[i % finBooks.length].value,
    refundNo: `RF-70${i}`,
    refundAmount: String(i % 6 === 5 ? 2500 : 0),
    refundStatus: finRefundStatuses[i % finRefundStatuses.length].value,
  };
}

const FINANCE_ROWS = Array.from({ length: 30 }, (_, i) => makeFinance(i));
const FINANCE_DEFAULT_COLS = [
  'recordType',
  'student',
  'classGrade',
  'receiptNo',
  'feeHead',
  'paidAmount',
  'balanceAmount',
  'paymentMode',
  'feeStatus',
  'collectionDate',
];

function financeGroupTitle(f: FilterDef) {
  if (f.module === 'party') return `Party · ${f.group}`;
  if (f.module === 'fees') return `Fees · ${f.group}`;
  if (f.module === 'charge') return `Charges · ${f.group}`;
  if (f.module === 'scholarship') return `Scholarship · ${f.group}`;
  if (f.module === 'expense') return `Expenses · ${f.group}`;
  if (f.module === 'ledger') return `Ledgers · ${f.group}`;
  if (f.module === 'refund') return `Refunds · ${f.group}`;
  return f.group;
}

function SharedCustomReportBuilder({
  title,
  subtitle,
  listTitle,
  searchPlaceholder,
  filters,
  rows,
  defaultCols,
  groupTitleFn,
  storageKey,
  filterSetKey,
  historyKey,
  columnsHint = 'Search a field or tick it by group. Selected columns appear in the table below.',
  exportFallback = 'Custom report',
}: {
  title: string;
  subtitle: string;
  listTitle: string;
  searchPlaceholder: string;
  filters: FilterDef[];
  rows: Row[];
  defaultCols: string[];
  groupTitleFn: (f: FilterDef) => string;
  storageKey: string;
  filterSetKey: string;
  historyKey: string;
  columnsHint?: string;
  exportFallback?: string;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [values, setValues] = useState<Record<string, FVal>>({});
  const [logic, setLogic] = useState<Logic>('AND');
  const [selected, setSelected] = useState<string[]>(defaultCols);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ Global: true });
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [picked, setPicked] = useState<string[]>([]);
  const [saved, setSaved] = useState<StudentSaved[]>([]);
  const [filterSets, setFilterSets] = useState<FilterSet[]>([]);
  const [history, setHistory] = useState<FilterSet[]>([]);
  const [loadSet, setLoadSet] = useState('');
  const [filterSetName, setFilterSetName] = useState('');
  const [exportOpen, setExportOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  const [emailTo, setEmailTo] = useState('');
  const [freq, setFreq] = useState('weekly');
  const [time, setTime] = useState('08:00');
  const [recipients, setRecipients] = useState('');
  const [nameError, setNameError] = useState('');
  const [saveOpen, setSaveOpen] = useState(false);
  const [saveNameDraft, setSaveNameDraft] = useState('');
  const [saveDescDraft, setSaveDescDraft] = useState('');
  const [colSearch, setColSearch] = useState('');
  const [colGroupsOpen, setColGroupsOpen] = useState<Record<string, boolean>>({});

  const groups = Array.from(new Set(filters.map(groupTitleFn)));

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      setSaved(raw ? (JSON.parse(raw) as StudentSaved[]) : []);
      const fs = localStorage.getItem(filterSetKey);
      setFilterSets(fs ? (JSON.parse(fs) as FilterSet[]) : []);
      const h = localStorage.getItem(historyKey);
      setHistory(h ? (JSON.parse(h) as FilterSet[]) : []);
    } catch {
      setSaved([]);
    }
  }, []);

  const persistSaved = (next: StudentSaved[]) => {
    setSaved(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };
  const persistSets = (next: FilterSet[]) => {
    setFilterSets(next);
    localStorage.setItem(filterSetKey, JSON.stringify(next));
  };
  const pushHistory = (nextValues: Record<string, FVal>, nextLogic: Logic) => {
    const item: FilterSet = { id: uid(), name: new Date().toLocaleString('en-IN'), module: 'info', values: nextValues, logic: nextLogic };
    const next = [item, ...history].slice(0, 5);
    setHistory(next);
    localStorage.setItem(historyKey, JSON.stringify(next));
  };

  const activeDefs = filters.filter((f) => isActive(values[f.id]));

  const filtered = useMemo(() => {
    const defs = filters.filter((f) => isActive(values[f.id]));
    if (!defs.length) return rows;
    const hit = (row: Row) => {
      const flags = defs.map((d) => matchDef(row, d, values[d.id]));
      if (logic === 'OR') return flags.some(Boolean);
      return flags.every(Boolean);
    };
    const matched = rows.filter(hit);
    return logic === 'NOT' ? rows.filter((r) => !matched.includes(r)) : matched;
  }, [values, logic]);

  const searched = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return filtered;
    return filtered.filter((row) => selected.some((k) => String(row[k] || '').toLowerCase().includes(q)));
  }, [filtered, search, selected]);

  const sorted = useMemo(() => {
    if (!sortKey) return searched;
    return [...searched].sort((a, b) => {
      const cmp = String(a[sortKey] || '').localeCompare(String(b[sortKey] || ''), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [searched, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);
  const cols = selected.map((id) => filters.find((f) => f.id === id)).filter((f): f is FilterDef => Boolean(f));
  const rowId = (row: Row) =>
    row.financeId || row.empId || row.employeeId || row.academicId || row.studentId || row.applicationNo || row.receiptNo;
  const exportRows = picked.length ? sorted.filter((r) => picked.includes(rowId(r))) : sorted;

  const setVal = (id: string, v: FVal) => {
    setValues((prev) => ({ ...prev, [id]: v }));
    setPage(1);
  };

  const clearAll = () => {
    setValues({});
    setSearch('');
    setPicked([]);
    setPage(1);
    setNotice('All filters cleared');
  };

  const applyBundle = (next: Record<string, FVal>, columns?: string[], label?: string) => {
    setValues(next);
    if (columns) setSelected(columns);
    setPage(1);
    setPicked([]);
    pushHistory(next, logic);
    if (label) setNotice(`Applied ${label}`);
  };

  const saveFilterSet = () => {
    if (!filterSetName.trim()) {
      setNotice('Name the filter set first');
      return;
    }
    persistSets([{ id: uid(), name: filterSetName.trim(), module: 'info', values, logic }, ...filterSets]);
    setFilterSetName('');
    setNotice('Filter set saved');
  };

  const rememberRun = (named?: string) => {
    const label = (named || name).trim() || `Generated ${stampNow()}`;
    const fp = reportFingerprint(selected, values, logic);
    const existing = saved.find((s) => reportFingerprint(s.columns, s.values, s.logic) === fp);
    const now = stampNow();
    if (existing) {
      persistSaved(
        saved.map((s) =>
          s.id === existing.id
            ? { ...s, lastRun: now, name: named?.trim() || s.name, description: named ? description : s.description }
            : s,
        ),
      );
      return;
    }
    persistSaved([
      {
        id: uid(),
        name: label,
        description,
        tag: named ? 'custom' : 'generated',
        module: 'info',
        columns: selected,
        values,
        logic,
        createdBy: 'Admin',
        createdDate: now,
        lastRun: now,
      },
      ...saved,
    ]);
  };

  const saveReport = () => {
    setSaveNameDraft(name);
    setSaveDescDraft(description);
    setNameError('');
    setSaveOpen(true);
  };

  const confirmSave = () => {
    const label = saveNameDraft.trim();
    if (!label) {
      setNameError('Report name is required');
      return;
    }
    if (selected.length === 0) {
      setNameError('Select at least one column');
      return;
    }
    setName(label);
    setDescription(saveDescDraft);
    setNameError('');
    const now = stampNow();
    persistSaved([
      {
        id: uid(),
        name: label,
        description: saveDescDraft,
        tag: 'custom',
        module: 'info',
        columns: selected,
        values,
        logic,
        createdBy: 'Admin',
        createdDate: now,
        lastRun: now,
      },
      ...saved.filter((s) => s.name.toLowerCase() !== label.toLowerCase()),
    ]);
    setSaveOpen(false);
    setNotice(`Saved “${label}”. Open it anytime from Previously generated reports.`);
  };

  const doExport = () => {
    rememberRun();
    if (exportFormat === 'email') {
      setExportOpen(false);
      setNotice(`Report queued to ${emailTo || 'recipients'} and saved for re-run`);
      return;
    }
    if (exportFormat === 'print' || exportFormat === 'pdf') {
      printRows(name.trim() || exportFallback, cols, exportRows);
      setExportOpen(false);
      setNotice('Report printed and saved for re-run');
      return;
    }
    const lines = [
      cols.map((f) => csvEscape(f.label)).join(','),
      ...exportRows.map((row) => cols.map((f) => csvEscape(row[f.id] || '')).join(',')),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${(name.trim() || exportFallback).replace(/\s+/g, '-').toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    setExportOpen(false);
    setNotice('Export downloaded and saved for re-run');
  };

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const togglePick = (id: string) => {
    setPicked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };



  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs text-gray-500">Dashboard &gt; Reports &gt; Custom Report</p>
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setName('');
            setDescription('');
            clearAll();
            setSelected(defaultCols);
          }}
        >
          <PlusIcon className="h-4 w-4" /> Create New Report
        </Button>
      </div>

      {notice && <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">{notice}</div>}

      {saved.length > 0 && (
        <Card
          title="Previously generated reports"
          headerAction={<span className="text-sm text-gray-500">{saved.length} saved</span>}
        >
          <p className="mb-3 text-sm text-gray-500">Run a saved layout again with the same filters and columns.</p>
          <div className="flex flex-wrap gap-2">
            {saved.slice(0, 10).map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setName(r.name);
                  setDescription(r.description);
                  applyBundle(r.values, r.columns, r.name);
                  persistSaved(saved.map((s) => (s.id === r.id ? { ...s, lastRun: stampNow() } : s)));
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 hover:border-blue-300 hover:bg-blue-50"
              >
                <span className="font-medium">{r.name}</span>
                <Badge variant={r.tag === 'generated' ? 'secondary' : 'primary'}>
                  {r.tag === 'generated' ? 'Generated' : 'Named'}
                </Badge>
              </button>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_140px] md:items-end">
          <Input
            label="Search"
            leftIcon={<SearchIcon className="h-4 w-4 text-gray-400" />}
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          <Select
            label="Per page"
            value={String(pageSize)}
            options={[10, 25, 50, 100].map((n) => ({ value: String(n), label: `${n} / page` }))}
            onChange={(v) => { setPageSize(Number(v)); setPage(1); }}
          />
        </div>
      </Card>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="info">Showing {pageRows.length ? (safePage - 1) * pageSize + 1 : 0}–{Math.min(safePage * pageSize, sorted.length)} of {sorted.length} (from {rows.length})</Badge>
        <Badge variant="primary">🔍 {activeDefs.length} Filters Applied</Badge>
        <Button variant="outline" size="xs" onClick={clearAll}>Clear All Filters</Button>
      </div>

      {activeDefs.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {activeDefs.map((def) => (
            <button
              key={def.id}
              type="button"
              className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs text-blue-800"
              onClick={() => setVal(def.id, {})}
            >
              {def.label}: {chipValue(def, values[def.id])}
              <XIcon className="h-3 w-3" />
            </button>
          ))}
        </div>
      )}

      <Card
        title="Detailed search filters"
        headerAction={
          <Button variant="ghost" size="xs" onClick={() => setFiltersOpen((o) => !o)}>
            {filtersOpen ? 'Collapse' : 'Expand'}
          </Button>
        }
      >
        {filtersOpen && (
          <div className="max-h-[520px] space-y-3 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Input label="Report Name" value={name} error={nameError} onChange={(e) => setName(e.target.value)} placeholder="Named report" />
              <Select
                label="Match logic"
                value={logic}
                options={[
                  { value: 'AND', label: 'AND — all conditions' },
                  { value: 'OR', label: 'OR — any condition' },
                  { value: 'NOT', label: 'NOT — exclude matches' },
                ]}
                onChange={(v) => setLogic(v as Logic)}
              />
            </div>
            <Textarea label="Description" value={description} rows={2} onChange={(e) => setDescription(e.target.value)} />
            {groups.map((group) => (
              <div key={group} className="rounded-md border border-gray-200">
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium text-gray-800"
                  onClick={() => setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }))}
                >
                  <span>{group}</span>
                  {openGroups[group] ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />}
                </button>
                {openGroups[group] && (
                  <div className="grid grid-cols-1 gap-3 border-t border-gray-100 p-3 md:grid-cols-2">
                    {filters.filter((f) => groupTitleFn(f) === group).map((def) => (
                      <div key={def.id}>
                        <p className="mb-1 text-xs font-medium text-gray-600">{def.label}</p>
                        <FilterControl def={def} value={values[def.id] || {}} onChange={(v) => setVal(def.id, v)} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto] md:items-end">
              <Input label="Save filter set as" value={filterSetName} onChange={(e) => setFilterSetName(e.target.value)} placeholder="e.g. RTE active 2025-26" />
              <Button variant="outline" size="sm" onClick={saveFilterSet}>Save Filter Set</Button>
            </div>
            <Select
              label="Load saved filter set"
              value={loadSet}
              options={[{ value: '', label: 'Select a saved set' }, ...filterSets.map((s) => ({ value: s.id, label: s.name }))]}
              onChange={(id) => {
                setLoadSet(id);
                const found = filterSets.find((s) => s.id === id);
                if (found) applyBundle(found.values, undefined, found.name);
              }}
            />
            {history.length > 0 && (
              <div>
                <p className="mb-1 text-xs font-medium text-gray-600">Filter history (last 5)</p>
                <div className="flex flex-wrap gap-1">
                  {history.map((h) => (
                    <Button key={h.id} variant="ghost" size="xs" onClick={() => applyBundle(h.values, undefined, 'history')}>
                      {h.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      <Card
        title="Table columns"
        headerAction={<span className="text-sm text-gray-500">{selected.length} of {filters.length} selected</span>}
      >
        <p className="mb-3 text-sm text-gray-500">{columnsHint}</p>
        <div className="mb-3 rounded-lg border border-blue-100 bg-blue-50/60 p-3">
          <p className="mb-2 text-sm font-medium text-gray-800">Shown in table</p>
          {cols.length === 0 ? (
            <p className="text-sm text-gray-500">No columns selected. Tick fields below.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {cols.map((f) => (
                <span
                  key={f.id}
                  className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-white px-2 py-1 text-sm text-gray-800"
                >
                  {f.label}
                  <button
                    type="button"
                    className="rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                    onClick={() => setSelected((prev) => prev.filter((x) => x !== f.id))}
                    aria-label={`Remove ${f.label}`}
                  >
                    <XIcon className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-end">
          <Input
            className="flex-1"
            label="Find a column"
            leftIcon={<SearchIcon className="h-4 w-4 text-gray-400" />}
            placeholder="Type a field name, e.g. Class or Receipt"
            value={colSearch}
            onChange={(e) => setColSearch(e.target.value)}
          />
          <div className="flex flex-wrap gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const q = colSearch.trim().toLowerCase();
                const ids = filters.filter((f) => !q || f.label.toLowerCase().includes(q)).map((f) => f.id);
                setSelected((prev) => Array.from(new Set([...prev, ...ids])));
              }}
            >
              Select visible
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelected([])}>Clear</Button>
            <Button variant="outline" size="sm" onClick={() => setSelected(defaultCols)}>Reset</Button>
          </div>
        </div>
        <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1">
          {groups.map((group) => {
            const q = colSearch.trim().toLowerCase();
            const items = filters.filter((f) => groupTitleFn(f) === group && (!q || f.label.toLowerCase().includes(q)));
            if (!items.length) return null;
            const open = colGroupsOpen[group] !== false;
            const selectedInGroup = items.filter((f) => selected.includes(f.id)).length;
            return (
              <div key={group} className="rounded-lg border border-gray-200">
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-3 py-2 text-left"
                  onClick={() => setColGroupsOpen((prev) => ({ ...prev, [group]: prev[group] === false }))}
                >
                  <span className="text-sm font-medium text-gray-800">{group}</span>
                  <span className="flex items-center gap-2 text-sm text-gray-500">
                    {selectedInGroup}/{items.length}
                    {open ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />}
                  </span>
                </button>
                {open && (
                  <div className="grid grid-cols-1 gap-1 border-t border-gray-100 p-3 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((f) => {
                      const on = selected.includes(f.id);
                      return (
                        <label key={f.id} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-gray-800 hover:bg-gray-50">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600"
                            checked={on}
                            onChange={() =>
                              setSelected((prev) => (on ? prev.filter((x) => x !== f.id) : [...prev, f.id]))
                            }
                          />
                          <span>{f.label}</span>
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
        title={listTitle}
        headerAction={
          <div className="flex flex-wrap gap-1.5">
            <Button
              variant="outline"
              size="xs"
              onClick={() => {
                rememberRun();
                setPreviewOpen(true);
              }}
            >
              <EyeIcon className="h-3.5 w-3.5" /> Preview
            </Button>
            <Button variant="outline" size="xs" onClick={() => setExportOpen(true)}>
              <DownloadIcon className="h-3.5 w-3.5" /> Export
            </Button>
            <Button variant="outline" size="xs" onClick={saveReport}>
              <SaveIcon className="h-3.5 w-3.5" /> Save as Named Report
            </Button>
            <Button variant="outline" size="xs" onClick={() => setScheduleOpen(true)}>
              <ClockIcon className="h-3.5 w-3.5" /> Schedule
            </Button>
          </div>
        }
      >
            {sorted.length === 0 ? (
              <p className="py-10 text-center text-sm text-gray-500">No records found. Adjust your filters.</p>
            ) : (
              <div className="max-h-[560px] overflow-auto">
                <table className="w-full min-w-[720px] text-sm">
                  <thead className="sticky top-0 bg-gray-50">
                    <tr>
                      <th className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={pageRows.length > 0 && pageRows.every((r) => picked.includes(rowId(r)))}
                          onChange={(e) => {
                            const ids = pageRows.map(rowId);
                            setPicked(e.target.checked ? Array.from(new Set([...picked, ...ids])) : picked.filter((id) => !ids.includes(id)));
                          }}
                        />
                      </th>
                      {cols.map((f) => (
                        <th
                          key={f.id}
                          className="cursor-pointer whitespace-nowrap px-3 py-2 text-left text-xs font-semibold uppercase text-gray-600"
                          onClick={() => toggleSort(f.id)}
                        >
                          {f.label} {sortKey === f.id ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((row, idx) => {
                      const id = rowId(row);
                      return (
                        <tr key={id} className={idx % 2 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="px-3 py-2">
                            <input type="checkbox" checked={picked.includes(id)} onChange={() => togglePick(id)} />
                          </td>
                          {cols.map((f) => (
                            <td key={f.id} className="whitespace-nowrap px-3 py-2 text-gray-800">{row[f.id] || '—'}</td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600">
              <span>{picked.length} row(s) selected for export</span>
              <div className="flex gap-1">
                <Button variant="outline" size="xs" disabled={safePage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>
                <span className="px-2 py-1">Page {safePage} of {totalPages}</span>
                <Button variant="outline" size="xs" disabled={safePage >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
              </div>
            </div>
          </Card>

      <Card title="Saved reports">
        <Table
          columns={[
            { key: 'name', header: 'Report Name' },
            {
              key: 'tag',
              header: 'Type',
              render: (r: StudentSaved) => (
                <Badge variant={r.tag === 'generated' ? 'secondary' : 'primary'}>
                  {r.tag === 'generated' ? 'Generated' : 'Named'}
                </Badge>
              ),
            },
            { key: 'createdBy', header: 'Created By' },
            { key: 'createdDate', header: 'Created Date' },
            { key: 'lastRun', header: 'Last Run' },
            {
              key: 'actions',
              header: 'Actions',
              render: (r: StudentSaved) => (
                <div className="flex flex-wrap gap-1">
                  <Button variant="outline" size="xs" onClick={() => applyBundle(r.values, r.columns, r.name)}>View</Button>
                  <Button variant="outline" size="xs" onClick={() => { setName(r.name); setDescription(r.description); applyBundle(r.values, r.columns, r.name); }}>Edit</Button>
                  <Button
                    variant="primary"
                    size="xs"
                    onClick={() => {
                      setName(r.name);
                      setDescription(r.description);
                      applyBundle(r.values, r.columns, r.name);
                      persistSaved(saved.map((s) => (s.id === r.id ? { ...s, lastRun: stampNow() } : s)));
                      setNotice(`Generated “${r.name}” again`);
                    }}
                  >
                    Run
                  </Button>
                  <Button variant="ghost" size="xs" onClick={() => persistSaved(saved.filter((s) => s.id !== r.id))}>Delete</Button>
                </div>
              ),
            },
          ]}
          data={saved}
          emptyMessage="No saved reports yet. Preview, export, or Save as Named Report to keep a layout."
        />
      </Card>

      <Modal
        isOpen={saveOpen}
        onClose={() => setSaveOpen(false)}
        title="Save as Named Report"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSaveOpen(false)}>Cancel</Button>
            <Button onClick={confirmSave}>Save report</Button>
          </div>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-500">Give this layout a name so you can generate it again from this page.</p>
          <Input
            label="Report name"
            value={saveNameDraft}
            error={nameError}
            onChange={(e) => { setSaveNameDraft(e.target.value); setNameError(''); }}
            placeholder="e.g. Pending tuition Term 1"
          />
          <Textarea
            label="Description"
            value={saveDescDraft}
            rows={2}
            onChange={(e) => setSaveDescDraft(e.target.value)}
          />
        </div>
      </Modal>

      <Modal isOpen={previewOpen} onClose={() => setPreviewOpen(false)} title="Preview before export" size="xl" footer={<Button onClick={() => setPreviewOpen(false)}>Close</Button>}>
        <p className="mb-2 text-xs text-gray-500">{exportRows.length} row(s) · {cols.length} column(s)</p>
        <div className="max-h-[480px] overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>{cols.map((c) => <th key={c.id} className="border-b px-2 py-1 text-left text-xs">{c.label}</th>)}</tr>
            </thead>
            <tbody>
              {exportRows.slice(0, 50).map((row, i) => (
                <tr key={rowId(row) + i}>
                  {cols.map((c) => <td key={c.id} className="border-b px-2 py-1">{row[c.id] || '—'}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>

      <Modal
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
        title="Export filtered data"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setExportOpen(false)}>Cancel</Button>
            <Button onClick={doExport}>Export</Button>
          </div>
        }
      >
        <Select
          label="Format"
          value={exportFormat}
          options={[
            { value: 'pdf', label: 'PDF' },
            { value: 'xlsx', label: 'Excel' },
            { value: 'csv', label: 'CSV' },
            { value: 'print', label: 'Print' },
            { value: 'email', label: 'Email' },
          ]}
          onChange={setExportFormat}
        />
        {exportFormat === 'email' && <Input className="mt-3" label="To" value={emailTo} onChange={(e) => setEmailTo(e.target.value)} />}
        <p className="mt-2 text-xs text-gray-500">{picked.length ? `${picked.length} selected row(s)` : `${sorted.length} filtered row(s)`}</p>
      </Modal>

      <Modal
        isOpen={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        title="Schedule this report"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setScheduleOpen(false)}>Cancel</Button>
            <Button onClick={() => { setScheduleOpen(false); setNotice(`Schedule saved · ${freq} at ${time}`); }}>Save schedule</Button>
          </div>
        }
      >
        <div className="space-y-3">
          <Select label="Frequency" value={freq} options={[{ value: 'daily', label: 'Daily' }, { value: 'weekly', label: 'Weekly' }, { value: 'monthly', label: 'Monthly' }]} onChange={setFreq} />
          <Input label="Time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          <Input label="Recipients" value={recipients} onChange={(e) => setRecipients(e.target.value)} />
        </div>
      </Modal>
    </div>
  );
}

function StudentCustomReportBuilder() {
  return (
    <SharedCustomReportBuilder
      title="Custom Report Builder"
      subtitle="Create, filter and export reports for Student Information, Attendance & Admission"
      listTitle="Students"
      searchPlaceholder="Search students by any visible column"
      filters={FILTERS}
      rows={UNIFIED_ROWS}
      defaultCols={DEFAULT_COLS}
      groupTitleFn={groupTitle}
      storageKey={STUDENT_STORAGE}
      filterSetKey={FILTER_SET_STORAGE}
      historyKey={FILTER_HISTORY_STORAGE}
    />
  );
}

function AcademicCustomReportBuilder() {
  return (
    <SharedCustomReportBuilder
      title="Academic Custom Report Builder"
      subtitle="Create, filter and export reports for Teaching Plan, Classwork, Homework, Study Material, School Diary, Events and Duties"
      listTitle="Academic records"
      searchPlaceholder="Search academic records by any visible column"
      filters={ACADEMIC_FILTERS}
      rows={ACADEMIC_ROWS}
      defaultCols={ACADEMIC_DEFAULT_COLS}
      groupTitleFn={academicGroupTitle}
      storageKey={ACADEMIC_STORAGE}
      filterSetKey={ACADEMIC_FILTER_SET_STORAGE}
      historyKey={ACADEMIC_FILTER_HISTORY_STORAGE}
    />
  );
}

function EmployeeCustomReportBuilder() {
  return (
    <SharedCustomReportBuilder
      title="Employee Custom Report Builder"
      subtitle="Create, filter and export reports for Employee Profile, Employment, Attendance & Leave, Payroll, Appraisal, Income Tax and Exit"
      listTitle="Employees"
      searchPlaceholder="Search employees by any visible column"
      filters={EMPLOYEE_FILTERS}
      rows={EMPLOYEE_ROWS}
      defaultCols={EMPLOYEE_DEFAULT_COLS}
      groupTitleFn={employeeGroupTitle}
      storageKey={EMPLOYEE_STORAGE}
      filterSetKey={EMPLOYEE_FILTER_SET_STORAGE}
      historyKey={EMPLOYEE_FILTER_HISTORY_STORAGE}
      columnsHint="Search a field or tick it by group. Selected columns appear in the employee table."
      exportFallback="Employee custom report"
    />
  );
}

function FinanceCustomReportBuilder() {
  return (
    <SharedCustomReportBuilder
      title="Finance Custom Report Builder"
      subtitle="Create, filter and export reports for Fees, Charges, Scholarships, Expenses, Ledgers and Refunds"
      listTitle="Finance records"
      searchPlaceholder="Search finance records by any visible column"
      filters={FINANCE_FILTERS}
      rows={FINANCE_ROWS}
      defaultCols={FINANCE_DEFAULT_COLS}
      groupTitleFn={financeGroupTitle}
      storageKey={FINANCE_STORAGE}
      filterSetKey={FINANCE_FILTER_SET_STORAGE}
      historyKey={FINANCE_FILTER_HISTORY_STORAGE}
      columnsHint="Search a field or tick it by group. Selected columns appear in the finance table."
      exportFallback="Finance custom report"
    />
  );
}

function GenericCustomReports({ pageId }: { pageId: string }) {
  const section = SECTIONS[pageId];

  const [name, setName] = useState('');
  const [selected, setSelected] = useState<string[]>(section.fields.map((f) => f.id));
  const [saved, setSaved] = useState<SavedReport[]>([]);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    setName('');
    setSelected(section.fields.map((f) => f.id));
    setGeneratedAt(null);
    setNotice('');
    setPreview(false);
    try {
      const raw = localStorage.getItem(storageKey(pageId));
      setSaved(raw ? (JSON.parse(raw) as SavedReport[]) : []);
    } catch {
      setSaved([]);
    }
  }, [pageId, section.fields]);

  const persist = (next: SavedReport[]) => {
    setSaved(next);
    localStorage.setItem(storageKey(pageId), JSON.stringify(next));
  };

  const activeFields = useMemo(
    () => section.fields.filter((f) => selected.includes(f.id)),
    [section.fields, selected],
  );

  const columns = activeFields.map((f) => ({ key: f.id, header: f.label }));

  const toggleField = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    setPreview(false);
  };

  const handleGenerate = () => {
    if (activeFields.length === 0) {
      setNotice('Select at least one column');
      return;
    }
    const stamp = new Date().toLocaleString('en-IN');
    setGeneratedAt(stamp);
    setPreview(true);
    setNotice(`Generated ${section.title} at ${stamp}`);
  };

  const handleDownload = () => {
    if (activeFields.length === 0) {
      setNotice('Select at least one column');
      return;
    }
    const lines = [
      activeFields.map((f) => csvEscape(f.label)).join(','),
      ...section.rows.map((row) => activeFields.map((f) => csvEscape(row[f.id] || '')).join(',')),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${pageId}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    setNotice(`Downloaded ${section.rows.length} rows`);
  };

  const handleSave = () => {
    const label = name.trim();
    if (!label) {
      setNotice('Enter a report name to save');
      return;
    }
    if (activeFields.length === 0) {
      setNotice('Select at least one column');
      return;
    }
    persist([
      {
        id: `CR-${Date.now()}`,
        name: label,
        columns: selected,
        createdAt: new Date().toLocaleString('en-IN'),
      },
      ...saved,
    ]);
    setName('');
    setNotice(`Saved “${label}”`);
  };

  const loadSaved = (report: SavedReport) => {
    setName(report.name);
    setSelected(report.columns);
    setPreview(false);
    setNotice(`Loaded “${report.name}”`);
  };

  return (
    <div className="space-y-4 p-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{section.title}</h1>
        <p className="text-sm text-gray-500">{section.description}</p>
      </div>

      {notice && (
        <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          {notice}
        </div>
      )}

      <Card title="Report definition">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <Input
            label="Report name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Pending board returns"
          />
          <Button variant="outline" onClick={handleSave}>
            <SaveIcon className="mr-1 h-4 w-4" /> Save
          </Button>
        </div>
        <p className="mt-4 mb-2 text-sm font-medium text-gray-700">Columns</p>
        <div className="flex flex-wrap gap-2">
          {section.fields.map((field) => {
            const on = selected.includes(field.id);
            return (
              <button
                key={field.id}
                type="button"
                onClick={() => toggleField(field.id)}
                className={`rounded-full border px-3 py-1 text-sm ${
                  on
                    ? 'border-indigo-300 bg-indigo-50 text-indigo-800'
                    : 'border-gray-200 bg-white text-gray-600'
                }`}
              >
                {field.label}
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => printRows(section.title, activeFields, section.rows)}>
            <PrinterIcon className="mr-1 h-4 w-4" /> Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <DownloadIcon className="mr-1 h-4 w-4" /> Download
          </Button>
          <Button variant="primary" size="sm" onClick={handleGenerate}>
            <FilePlus className="mr-1 h-4 w-4" /> Generate
          </Button>
        </div>
        {generatedAt && <p className="mt-3 text-xs text-gray-500">Last generated {generatedAt}</p>}
      </Card>

      {saved.length > 0 && (
        <Card title="Saved custom reports">
          <div className="space-y-2">
            {saved.map((report) => (
              <div
                key={report.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-gray-200 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{report.name}</p>
                  <p className="text-xs text-gray-500">
                    {report.columns.length} columns · {report.createdAt}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <Button variant="outline" size="sm" onClick={() => loadSaved(report)}>
                    Load
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => persist(saved.filter((r) => r.id !== report.id))}
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {preview && (
        <Card title={name.trim() || section.title}>
          <Table columns={columns} data={section.rows} emptyMessage="No rows" />
        </Card>
      )}

      {!preview && (
        <p className="text-sm text-gray-500">
          Select columns and click Generate to preview. Saved layouts stay in this section.
        </p>
      )}
    </div>
  );
}

export function CustomReportsPage() {
  const params = useParams<{ pageId?: string }>();
  if (params.pageId === 'student-custom-reports') {
    return <StudentCustomReportBuilder />;
  }
  if (params.pageId === 'academic-custom-reports') {
    return <AcademicCustomReportBuilder />;
  }
  if (params.pageId === 'employee-custom-reports') {
    return <EmployeeCustomReportBuilder />;
  }
  if (params.pageId === 'finance-custom-reports') {
    return <FinanceCustomReportBuilder />;
  }
  const pageId = PAGE_IDS.includes(params.pageId || '') ? params.pageId! : 'government-custom-reports';
  return <GenericCustomReports pageId={pageId} />;
}

export default CustomReportsPage;
