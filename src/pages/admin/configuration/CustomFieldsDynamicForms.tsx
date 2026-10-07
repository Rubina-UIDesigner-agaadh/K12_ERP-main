import React, { DragEvent, useEffect, useMemo, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Badge } from '../../../components/ui/Badge';
import {
  ArrowDown, ArrowUp, BarChart3, Check, CheckCircle2, ChevronDown,
  ChevronRight, Clock3, Copy, Download, Eye, FilePlus2, FileText, Filter,
  GripVertical, Plus, Search, Send, Trash2, Users, X
} from 'lucide-react';

type FormStatus = 'Draft' | 'Published' | 'Paused';
type ResponseStatus = 'New' | 'In Review' | 'Approved' | 'Rejected';
type ListTab = 'Forms' | 'Submissions' | 'Analytics';
type WizardPage = 'list' | 'wizard';
type PropertyTab = 'General' | 'Validation' | 'Logic';
type FieldWidth = 'Full' | 'Half' | 'Third';

interface FieldOption { id: string; label: string; }
interface FormField {
  id: string;
  sectionId: string;
  type: string;
  label: string;
  description: string;
  placeholder: string;
  required: boolean;
  hidden: boolean;
  readOnly: boolean;
  defaultValue: string;
  width: FieldWidth;
  options: FieldOption[];
  minLength: number;
  maxLength: number;
  minValue: string;
  maxValue: string;
  regex: string;
  errorMessage: string;
  fileTypes: string;
  maxFileSize: number;
  unique: boolean;
  mappedTo: string;
  logicEnabled: boolean;
  logicFieldId: string;
  logicOperator: string;
  logicValue: string;
}
interface FormSection { id: string; title: string; description: string; collapsed: boolean; }
interface FormMeta { id: string; title: string; category: string; status: FormStatus; updatedAt: string; }
interface FormSettings {
  description: string;
  layout: string;
  progressIndicator: boolean;
  sectionIntro: boolean;
  theme: string;
  accentColor: string;
  fontSize: string;
  logoUrl: string;
  module: string;
  recordType: string;
  createRecord: boolean;
  recordOwner: string;
  scheduledFrom: string;
  scheduledUntil: string;
  timeZone: string;
  submissionLimit: number;
  requireLogin: boolean;
  allowAnonymous: boolean;
  allowSaveResume: boolean;
  allowEditResponse: boolean;
  captcha: boolean;
  allowedDomains: string;
  emailNotifications: boolean;
  adminEmails: string;
  respondentConfirmation: boolean;
  smsNotifications: boolean;
  webhookUrl: string;
  successMessage: string;
  redirectUrl: string;
  allowAnotherResponse: boolean;
  downloadCopy: boolean;
  reviewRequired: boolean;
  approvalStages: string;
  reviewer: string;
  language: string;
  locale: string;
  dateFormat: string;
  currency: string;
}
interface Respondent {
  id: string;
  name: string;
  number: string;
  className: string;
  email: string;
  submittedAt: string;
  status: ResponseStatus;
  duration: number;
  score: number;
  note: string;
  answers: Record<string, string>;
}
interface Recipient {
  id: string;
  name: string;
  number: string;
  className: string;
  email: string;
  parentName: string;
  selected: boolean;
}
interface VersionEntry { id: string; version: string; at: string; author: string; note: string; }
interface DistributionSettings {
  audience: string;
  audienceType: string;
  selectedClasses: string[];
  selectedSections: string[];
  selectedStreams: string[];
  selectedBatches: string[];
  selectedBranches: string[];
  selectedMasterFranchises: string[];
  selectedStudents: string[];
  selectedStaff: string[];
  channels: string[];
  sendMode: string;
  sendAt: string;
  reminder: boolean;
  reminderAfterDays: number;
  publicLink: boolean;
}
interface FormDocument {
  form: FormMeta;
  fields: FormField[];
  sections: FormSection[];
  settings: FormSettings;
  distribution: DistributionSettings;
  responses: Respondent[];
  recipients: Recipient[];
  versions: VersionEntry[];
}
interface StaffRecipient { id: string; name: string; department: string; email: string; }
interface SubmissionRow extends Respondent { formId: string; formTitle: string; }

const STORAGE_KEY = 'k12-custom-fields-dynamic-forms-v3';
const LEGACY_STORAGE_KEY = 'k12-custom-fields-dynamic-forms-v2';
const WIZARD_STEPS = ['General Settings', 'Module Linking', 'Post-Submit', 'Audience Targeting', 'Form Builder'];
const FORM_CATEGORIES = ['Admissions', 'Student Records', 'Academic', 'Human Resources', 'Finance', 'Operations', 'General'];
const MODULES = ['Admissions', 'Students', 'Staff', 'Academic', 'Finance', 'Transport', 'Library', 'General'];
const CLASSES = ['Nursery', 'KG', ...Array.from({ length: 12 }, (_, index) => String(index + 1))];
const SECTIONS = ['A', 'B', 'C', 'D', 'E', 'F'];
const STREAMS = ['Science', 'Commerce', 'Arts & Humanities'];
const BATCHES = ['2024–25', '2025–26', '2026–27', '2027–28'];
const BRANCHES = ['Main Campus', 'City Centre Branch', 'North Zone Campus', 'West Branch'];
const MASTER_FRANCHISES = ['Agaadh Education Network', 'Sunshine Learning Group', 'Gujarat Schools Collective'];
const STAFF_TARGETS: StaffRecipient[] = [
  { id: 'EMP-1001', name: 'Priya Shah', department: 'Admissions', email: 'priya.shah@example.edu' },
  { id: 'EMP-1002', name: 'Amit Patel', department: 'Teaching', email: 'amit.patel@example.edu' },
  { id: 'EMP-1003', name: 'Nisha Mehta', department: 'Administration', email: 'nisha.mehta@example.edu' },
  { id: 'EMP-1004', name: 'Rahul Desai', department: 'Finance', email: 'rahul.desai@example.edu' },
  { id: 'EMP-1005', name: 'Kavita Joshi', department: 'Student Services', email: 'kavita.joshi@example.edu' }
];
const FIELD_GROUPS: Array<{ name: string; types: string[] }> = [
  { name: 'Basic fields', types: ['Short Text', 'Long Text', 'Rich Text', 'Number', 'Email', 'Phone', 'URL', 'Address', 'Name'] },
  { name: 'Choice fields', types: ['Dropdown', 'Single Choice', 'Multi-Select', 'Checkboxes', 'Yes / No', 'Rating', 'Scale'] },
  { name: 'Date & time', types: ['Date', 'Date Range', 'Time', 'Date & Time', 'Month / Year'] },
  { name: 'Uploads & consent', types: ['File Upload', 'Image Upload', 'Signature', 'Consent Checkbox', 'Terms & Conditions'] },
  { name: 'School fields', types: ['Student Selector', 'Parent / Guardian', 'Class & Section', 'Stream Selector', 'Employee Selector', 'Department', 'Fee Amount', 'Payment Status'] },
  { name: 'Layout & content', types: ['Heading', 'Paragraph', 'Divider', 'Page Break', 'Hidden Field'] }
];
const DEFAULT_SETTINGS: FormSettings = {
  description: '', layout: 'One column', progressIndicator: true, sectionIntro: true,
  theme: 'Clean', accentColor: '#4f46e5', fontSize: 'Comfortable', logoUrl: '',
  module: 'General', recordType: '', createRecord: true, recordOwner: '',
  scheduledFrom: '', scheduledUntil: '', timeZone: 'Asia/Kolkata', submissionLimit: 1,
  requireLogin: false, allowAnonymous: true, allowSaveResume: true, allowEditResponse: false,
  captcha: true, allowedDomains: '', emailNotifications: true, adminEmails: '',
  respondentConfirmation: true, smsNotifications: false, webhookUrl: '',
  successMessage: 'Thank you. Your response has been received.', redirectUrl: '',
  allowAnotherResponse: false, downloadCopy: true, reviewRequired: false,
  approvalStages: '', reviewer: '', language: 'English', locale: 'India (en-IN)',
  dateFormat: 'DD/MM/YYYY', currency: 'INR (₹)'
};
const DEFAULT_DISTRIBUTION: DistributionSettings = {
  audience: 'All Students', audienceType: 'All Students', selectedClasses: [], selectedSections: [],
  selectedStreams: [], selectedBatches: [], selectedBranches: [], selectedMasterFranchises: [],
  selectedStudents: [], selectedStaff: [], channels: ['Public link'], sendMode: 'Send immediately',
  sendAt: '', reminder: false, reminderAfterDays: 3, publicLink: true
};
const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
const createField = (type: string, sectionId: string, index = 1): FormField => ({
  id: createId('FLD'), sectionId, type,
  label: type === 'Short Text' ? `Short answer ${index}` : type,
  description: '', placeholder: `Enter ${type.toLowerCase()}`, required: false,
  hidden: type === 'Hidden Field', readOnly: false, defaultValue: '', width: 'Full',
  options: ['Option 1', 'Option 2', 'Option 3'].map((label) => ({ id: createId('OPT'), label })),
  minLength: 0, maxLength: 250, minValue: '', maxValue: '', regex: '',
  errorMessage: 'Please check this value.', fileTypes: 'PDF, JPG, PNG', maxFileSize: 10,
  unique: false, mappedTo: '', logicEnabled: false, logicFieldId: '',
  logicOperator: 'equals', logicValue: ''
});
const createSection = (title: string): FormSection => ({ id: createId('SEC'), title, description: '', collapsed: false });
const cloneDocument = (record: FormDocument): FormDocument => JSON.parse(JSON.stringify(record));
const fieldStatusTone = (status: ResponseStatus) => status === 'Approved' ? 'success' : status === 'Rejected' ? 'danger' : status === 'In Review' ? 'warning' : 'info';
const statusTone = (status: FormStatus) => status === 'Published' ? 'success' : status === 'Paused' ? 'warning' : 'default';

const STUDENT_TARGETS: Recipient[] = [
  { id: 'STU-2401', name: 'Aarav Patel', number: 'STU-2401', className: 'Class 6', email: 'aarav.patel@example.com', parentName: 'Patel Family', selected: false },
  { id: 'STU-2402', name: 'Diya Shah', number: 'STU-2402', className: 'Class 11', email: 'diya.shah@example.com', parentName: 'Shah Family', selected: false },
  { id: 'STU-2403', name: 'Kabir Mehta', number: 'STU-2403', className: 'Class 4', email: 'kabir.mehta@example.com', parentName: 'Mehta Family', selected: false },
  { id: 'STU-2404', name: 'Anaya Desai', number: 'STU-2404', className: 'Class 11', email: 'anaya.desai@example.com', parentName: 'Desai Family', selected: false },
  { id: 'STU-2405', name: 'Ishaan Joshi', number: 'STU-2405', className: 'Class 8', email: 'ishaan.joshi@example.com', parentName: 'Joshi Family', selected: false },
  { id: 'STU-2406', name: 'Kiara Trivedi', number: 'STU-2406', className: 'Class 10', email: 'kiara.trivedi@example.com', parentName: 'Trivedi Family', selected: false },
  { id: 'STU-2407', name: 'Reyansh Rao', number: 'STU-2407', className: 'Class 9', email: 'reyansh.rao@example.com', parentName: 'Rao Family', selected: false },
  { id: 'STU-2408', name: 'Myra Kapoor', number: 'STU-2408', className: 'Class 5', email: 'myra.kapoor@example.com', parentName: 'Kapoor Family', selected: false }
];

const makeSeedField = (id: string, type: string, sectionId: string, label: string, patch: Partial<FormField> = {}): FormField => ({ ...createField(type, sectionId), id, label, ...patch });
const admissionSections: FormSection[] = [
  { id: 'SEC-ADM-STUDENT', title: 'Student information', description: 'Tell us about the student applying.', collapsed: false },
  { id: 'SEC-ADM-GUARDIAN', title: 'Parent / guardian details', description: 'Contact details for the primary guardian.', collapsed: false },
  { id: 'SEC-ADM-CONSENT', title: 'Documents & consent', description: 'Upload relevant documents and confirm consent.', collapsed: false }
];
const admissionFields: FormField[] = [
  makeSeedField('FLD-FIRST', 'Short Text', 'SEC-ADM-STUDENT', 'Student first name', { placeholder: 'Enter legal first name', required: true, mappedTo: 'student.firstName' }),
  makeSeedField('FLD-LAST', 'Short Text', 'SEC-ADM-STUDENT', 'Student last name', { placeholder: 'Enter legal last name', required: true, mappedTo: 'student.lastName' }),
  makeSeedField('FLD-DOB', 'Date', 'SEC-ADM-STUDENT', 'Date of birth', { required: true, mappedTo: 'student.dateOfBirth' }),
  makeSeedField('FLD-CLASS', 'Dropdown', 'SEC-ADM-STUDENT', 'Applying for class', { required: true, options: CLASSES.map((label, index) => ({ id: `CLASS-${index}`, label: label === 'KG' || label === 'Nursery' ? label : `Class ${label}` })), mappedTo: 'student.admissionClass' }),
  makeSeedField('FLD-STREAM', 'Stream Selector', 'SEC-ADM-STUDENT', 'Preferred stream', { options: STREAMS.map((label, index) => ({ id: `STR-${index}`, label })), mappedTo: 'student.stream' }),
  makeSeedField('FLD-GUARDIAN', 'Parent / Guardian', 'SEC-ADM-GUARDIAN', 'Primary guardian', { required: true, mappedTo: 'guardian.primary' }),
  makeSeedField('FLD-EMAIL', 'Email', 'SEC-ADM-GUARDIAN', 'Guardian email', { required: true, mappedTo: 'guardian.email' }),
  makeSeedField('FLD-PHONE', 'Phone', 'SEC-ADM-GUARDIAN', 'Contact number', { required: true, mappedTo: 'guardian.phone' }),
  makeSeedField('FLD-DOC', 'File Upload', 'SEC-ADM-CONSENT', 'Previous report card', { fileTypes: 'PDF, JPG, PNG', maxFileSize: 10, mappedTo: 'admission.attachments' }),
  makeSeedField('FLD-CONSENT', 'Consent Checkbox', 'SEC-ADM-CONSENT', 'I confirm that the information above is accurate.', { required: true, mappedTo: 'admission.consent' })
];
const admissionResponses: Respondent[] = [
  { id: 'RSP-2601', name: 'Aarav Patel', number: 'STU-ENQ-1042', className: 'Class 6', email: 'parent.patel@example.com', submittedAt: '2026-10-01T10:14:00', status: 'New', duration: 5, score: 0, note: '', answers: { 'Student first name': 'Aarav', 'Student last name': 'Patel', 'Applying for class': 'Class 6', 'Guardian email': 'parent.patel@example.com' } },
  { id: 'RSP-2602', name: 'Diya Shah', number: 'STU-ENQ-1043', className: 'Class 11', email: 'shah.family@example.com', submittedAt: '2026-10-01T11:22:00', status: 'In Review', duration: 7, score: 0, note: 'Verify previous school certificate.', answers: { 'Student first name': 'Diya', 'Student last name': 'Shah', 'Applying for class': 'Class 11', 'Preferred stream': 'Science' } },
  { id: 'RSP-2603', name: 'Kabir Mehta', number: 'STU-ENQ-1044', className: 'Class 4', email: 'mehta.parent@example.com', submittedAt: '2026-10-02T09:03:00', status: 'Approved', duration: 4, score: 92, note: '', answers: { 'Student first name': 'Kabir', 'Student last name': 'Mehta', 'Applying for class': 'Class 4' } },
  { id: 'RSP-2604', name: 'Anaya Desai', number: 'STU-ENQ-1045', className: 'Class 11', email: 'desai.home@example.com', submittedAt: '2026-10-03T14:31:00', status: 'In Review', duration: 9, score: 0, note: '', answers: { 'Student first name': 'Anaya', 'Student last name': 'Desai', 'Applying for class': 'Class 11', 'Preferred stream': 'Commerce' } },
  { id: 'RSP-2605', name: 'Ishaan Joshi', number: 'STU-ENQ-1046', className: 'Class 8', email: 'joshi.guardian@example.com', submittedAt: '2026-10-04T08:42:00', status: 'Rejected', duration: 6, score: 0, note: 'Incomplete supporting documents.', answers: { 'Student first name': 'Ishaan', 'Student last name': 'Joshi', 'Applying for class': 'Class 8' } }
];
const createDemoForms = (): FormDocument[] => {
  const tripSection: FormSection = { id: 'SEC-TRIP', title: 'Trip details & consent', description: 'Confirm the student and parent consent for the upcoming trip.', collapsed: false };
  const staffSection: FormSection = { id: 'SEC-LEAVE', title: 'Leave request', description: 'Provide the dates and reason for the leave request.', collapsed: false };
  return [
    {
      form: { id: 'FRM-2026-001', title: 'Student Admission & Enrolment Form', category: 'Admissions', status: 'Published', updatedAt: '2026-10-04T09:30:00' },
      fields: admissionFields, sections: admissionSections,
      settings: { ...DEFAULT_SETTINGS, description: 'Collect admission and student information using one structured form.', module: 'Admissions', recordType: 'Student admission enquiry', createRecord: true, recordOwner: 'Admissions Office', adminEmails: 'admissions@school.edu.in', reviewRequired: true, approvalStages: 'Admissions review, Final verification', reviewer: 'Admissions Office' },
      distribution: { ...DEFAULT_DISTRIBUTION, audience: 'Class & Section', audienceType: 'Class & Section', selectedClasses: ['9', '10', '11'], selectedStreams: ['Science', 'Commerce'], channels: ['Public link', 'In-app', 'Email'], reminder: true },
      responses: admissionResponses, recipients: STUDENT_TARGETS, versions: [{ id: 'VER-ADM-1', version: 'v1.0', at: '2026-09-20T09:00:00', author: 'Priya Gupta', note: 'Initial admission enquiry form' }]
    },
    {
      form: { id: 'FRM-2026-002', title: 'Student Trip & Activity Consent', category: 'Operations', status: 'Published', updatedAt: '2026-10-02T15:10:00' },
      fields: [
        makeSeedField('FLD-TRIP-STUDENT', 'Student Selector', 'SEC-TRIP', 'Student name', { required: true, mappedTo: 'student.id' }),
        makeSeedField('FLD-TRIP-CLASS', 'Class & Section', 'SEC-TRIP', 'Class and section', { required: true, mappedTo: 'student.classSection' }),
        makeSeedField('FLD-TRIP-DATE', 'Date', 'SEC-TRIP', 'Trip date', { required: true, mappedTo: 'activity.date' }),
        makeSeedField('FLD-TRIP-CONSENT', 'Consent Checkbox', 'SEC-TRIP', 'I give permission for my child to participate.', { required: true, mappedTo: 'activity.parentConsent' })
      ],
      sections: [tripSection],
      settings: { ...DEFAULT_SETTINGS, description: 'Collect trip participation and parent consent.', module: 'Students', recordType: 'Activity consent', recordOwner: 'Student Services', reviewRequired: true },
      distribution: { ...DEFAULT_DISTRIBUTION, audience: 'Class & Section', audienceType: 'Class & Section', selectedClasses: ['6', '7', '8'], selectedSections: ['A', 'B', 'C'], channels: ['In-app', 'Email'] },
      responses: [
        { id: 'RSP-TR-1', name: 'Kiara Trivedi', number: 'STU-2406', className: 'Class 10', email: 'kiara.family@example.com', submittedAt: '2026-10-03T09:10:00', status: 'Approved', duration: 3, score: 100, note: '', answers: { 'Trip date': '18 October 2026', 'Parent consent': 'Yes' } },
        { id: 'RSP-TR-2', name: 'Reyansh Rao', number: 'STU-2407', className: 'Class 9', email: 'rao.family@example.com', submittedAt: '2026-10-04T10:25:00', status: 'New', duration: 4, score: 0, note: '', answers: { 'Trip date': '18 October 2026', 'Parent consent': 'Yes' } }
      ],
      recipients: STUDENT_TARGETS, versions: [{ id: 'VER-TR-1', version: 'v1.0', at: '2026-09-28T12:00:00', author: 'Amit Patel', note: 'Published for the October activity trip' }]
    },
    {
      form: { id: 'FRM-2026-003', title: 'Staff Leave Request', category: 'Human Resources', status: 'Draft', updatedAt: '2026-10-05T11:45:00' },
      fields: [
        makeSeedField('FLD-LEAVE-STAFF', 'Employee Selector', 'SEC-LEAVE', 'Employee name', { required: true, mappedTo: 'employee.id' }),
        makeSeedField('FLD-LEAVE-TYPE', 'Dropdown', 'SEC-LEAVE', 'Leave type', { required: true, options: ['Casual leave', 'Sick leave', 'Earned leave', 'Other'].map((label, index) => ({ id: `LEAVE-${index}`, label })), mappedTo: 'leave.type' }),
        makeSeedField('FLD-LEAVE-DATES', 'Date Range', 'SEC-LEAVE', 'Leave dates', { required: true, mappedTo: 'leave.dates' }),
        makeSeedField('FLD-LEAVE-REASON', 'Long Text', 'SEC-LEAVE', 'Reason for leave', { required: true, mappedTo: 'leave.reason' })
      ],
      sections: [staffSection],
      settings: { ...DEFAULT_SETTINGS, description: 'Submit a leave request for manager review.', module: 'Staff', recordType: 'Leave request', createRecord: true, recordOwner: 'Human Resources', reviewRequired: true, approvalStages: 'Department head, Human Resources', reviewer: 'HR Office' },
      distribution: { ...DEFAULT_DISTRIBUTION, audience: 'Staff', audienceType: 'Staff', channels: ['In-app', 'Email'] },
      responses: [{ id: 'RSP-LV-1', name: 'Priya Shah', number: 'EMP-1001', className: 'Admissions', email: 'priya.shah@example.edu', submittedAt: '2026-10-05T08:35:00', status: 'In Review', duration: 3, score: 0, note: 'Pending department approval.', answers: { 'Leave type': 'Casual leave', 'Leave dates': '12–13 October 2026', 'Reason for leave': 'Family event' } }],
      recipients: STUDENT_TARGETS, versions: [{ id: 'VER-LV-1', version: 'v0.1', at: '2026-10-05T11:45:00', author: 'HR Office', note: 'Draft prepared for review' }]
    }
  ];
};

const normalizeRecord = (record: any): FormDocument => {
  const distribution = record?.distribution || {};
  const legacyAudience = distribution.audience || 'All Students';
  const audienceType = distribution.audienceType || (legacyAudience === 'By class' ? 'Class & Section' : legacyAudience === 'Employees' ? 'Staff' : legacyAudience === 'By stream' ? 'Class & Section' : legacyAudience);
  const legacyRecipients = Array.isArray(record?.recipients) ? record.recipients : STUDENT_TARGETS;
  const selectedStudents = Array.isArray(distribution.selectedStudents)
    ? distribution.selectedStudents
    : legacyRecipients.filter((recipient: Recipient) => recipient.selected).map((recipient: Recipient) => recipient.id);
  return {
    form: { id: createId('FRM'), title: 'Untitled Form', category: 'General', status: 'Draft', updatedAt: new Date().toISOString(), ...(record?.form || {}) },
    fields: Array.isArray(record?.fields) ? record.fields : [],
    sections: Array.isArray(record?.sections) && record.sections.length ? record.sections : [createSection('Section 1')],
    settings: { ...DEFAULT_SETTINGS, ...(record?.settings || {}) },
    distribution: { ...DEFAULT_DISTRIBUTION, ...distribution, audience: audienceType, audienceType, selectedStudents, selectedStaff: Array.isArray(distribution.selectedStaff) ? distribution.selectedStaff : [] },
    responses: Array.isArray(record?.responses) ? record.responses : [],
    recipients: legacyRecipients,
    versions: Array.isArray(record?.versions) ? record.versions : []
  };
};
const loadForms = (): FormDocument[] => {
  if (typeof window === 'undefined') return createDemoForms();
  const parseStored = (key: string) => {
    try { return JSON.parse(window.localStorage.getItem(key) || 'null'); } catch { return null; }
  };
  const current = parseStored(STORAGE_KEY);
  if (Array.isArray(current?.forms)) return current.forms.map(normalizeRecord);
  const legacy = parseStored(LEGACY_STORAGE_KEY);
  if (legacy?.form) return [normalizeRecord(legacy)];
  return createDemoForms();
};
const makeBlankDocument = (): FormDocument => {
  const section = createSection('Section 1');
  return {
    form: { id: `FRM-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`, title: '', category: 'General', status: 'Draft', updatedAt: new Date().toISOString() },
    fields: [], sections: [section], settings: { ...DEFAULT_SETTINGS },
    distribution: { ...DEFAULT_DISTRIBUTION }, responses: [], recipients: STUDENT_TARGETS.map((recipient) => ({ ...recipient })), versions: []
  };
};

function FieldPreview({ field }: { field: FormField }) {
  if (field.type === 'Heading') return <h4 className="text-base font-bold text-gray-900">{field.label}</h4>;
  if (field.type === 'Paragraph') return <p className="text-sm text-gray-600">{field.description || field.label}</p>;
  if (field.type === 'Divider' || field.type === 'Page Break') return <div className="h-px w-full bg-gray-200" />;
  if (field.type === 'Terms & Conditions' || field.type === 'Consent Checkbox' || field.type === 'Checkboxes') {
    return <div className="space-y-2">{(field.type === 'Consent Checkbox' ? [{ id: field.id, label: field.label }] : field.options.slice(0, 3)).map((option) => <label key={option.id} className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" disabled />{option.label}</label>)}</div>;
  }
  if (field.type === 'Single Choice' || field.type === 'Yes / No') {
    return <div className="flex flex-wrap gap-3">{(field.type === 'Yes / No' ? ['Yes', 'No'] : field.options.slice(0, 3).map((option) => option.label)).map((option) => <label key={option} className="flex items-center gap-2 text-sm text-gray-700"><input type="radio" disabled name={field.id} />{option}</label>)}</div>;
  }
  if (['Dropdown', 'Multi-Select', 'Class & Section', 'Stream Selector', 'Student Selector', 'Employee Selector', 'Department', 'Payment Status'].includes(field.type)) {
    return <select disabled className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm"><option>{field.placeholder || 'Select an option'}</option>{field.options.slice(0, 4).map((option) => <option key={option.id}>{option.label}</option>)}</select>;
  }
  if (field.type === 'File Upload' || field.type === 'Image Upload') return <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-xs text-gray-500">Drop a file here or browse · {field.fileTypes} · up to {field.maxFileSize} MB</div>;
  if (field.type === 'Signature') return <div className="h-20 rounded-lg border border-dashed border-gray-300 bg-white" />;
  if (field.type === 'Rating' || field.type === 'Scale') return <div className="flex gap-2">{[1, 2, 3, 4, 5].map((number) => <span key={number} className="grid h-8 w-8 place-items-center rounded-full border text-xs text-gray-500">{number}</span>)}</div>;
  const inputType = field.type === 'Email' ? 'email' : field.type === 'Number' ? 'number' : field.type === 'Date' ? 'date' : field.type === 'Time' ? 'time' : field.type === 'Date & Time' ? 'datetime-local' : field.type === 'URL' ? 'url' : field.type === 'Phone' ? 'tel' : 'text';
  if (['Long Text', 'Rich Text', 'Address'].includes(field.type)) return <textarea disabled rows={3} placeholder={field.placeholder} className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm" />;
  return <input disabled type={inputType} placeholder={field.placeholder} className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm" />;
}

function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: (value: boolean) => void; label: string; description?: string }) {
  return <label className="flex cursor-pointer items-start justify-between gap-3 rounded-xl border border-gray-200 bg-white p-3"><span><span className="block text-xs font-semibold text-gray-800">{label}</span>{description && <span className="mt-1 block text-[10px] text-gray-500">{description}</span>}</span><input className="mt-0.5 h-4 w-4 accent-indigo-600" type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /></label>;
}

function ChoiceGroup({ label, options, selected, onToggle, columns = 'flex' }: { label: string; options: string[]; selected: string[]; onToggle: (value: string) => void; columns?: 'flex' | 'grid' }) {
  return <div><p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-gray-500">{label}</p><div className={columns === 'grid' ? 'grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4' : 'flex flex-wrap gap-2'}>{options.map((option) => <label key={option} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs transition ${selected.includes(option) ? 'border-indigo-300 bg-indigo-50 text-indigo-800' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}><input className="accent-indigo-600" type="checkbox" checked={selected.includes(option)} onChange={() => onToggle(option)} /><span>{option}</span></label>)}</div></div>;
}

export function CustomFieldsDynamicForms() {
  const [forms, setForms] = useState<FormDocument[]>(() => loadForms());
  const [page, setPage] = useState<WizardPage>('list');
  const [listTab, setListTab] = useState<ListTab>('Forms');
  const [wizardStep, setWizardStep] = useState(0);
  const [draft, setDraft] = useState<FormDocument | null>(null);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [activeSectionId, setActiveSectionId] = useState('');
  const [propertyTab, setPropertyTab] = useState<PropertyTab>('General');
  const [paletteSearch, setPaletteSearch] = useState('');
  const [formSearch, setFormSearch] = useState('');
  const [formStatusFilter, setFormStatusFilter] = useState('All statuses');
  const [submissionSearch, setSubmissionSearch] = useState('');
  const [submissionStatusFilter, setSubmissionStatusFilter] = useState('All statuses');
  const [submissionFormFilter, setSubmissionFormFilter] = useState('All forms');
  const [studentSearch, setStudentSearch] = useState('');
  const [staffSearch, setStaffSearch] = useState('');
  const [draggingField, setDraggingField] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [toast, setToast] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<{ formId: string; responseId: string } | null>(null);
  const [versionFormId, setVersionFormId] = useState<string | null>(null);
  const [analyticsRange, setAnalyticsRange] = useState('Last 30 days');

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ forms })); }
    catch { /* the page remains usable when local storage is unavailable */ }
  }, [forms]);

  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 3200); };
  const updateDraft = (updater: (current: FormDocument) => FormDocument) => setDraft((current) => current ? updater(current) : current);
  const patchForm = (patch: Partial<FormMeta>) => updateDraft((current) => ({ ...current, form: { ...current.form, ...patch } }));
  const patchSetting = <K extends keyof FormSettings,>(key: K, value: FormSettings[K]) => updateDraft((current) => ({ ...current, settings: { ...current.settings, [key]: value } }));
  const patchDistribution = <K extends keyof DistributionSettings,>(key: K, value: DistributionSettings[K]) => updateDraft((current) => ({ ...current, distribution: { ...current.distribution, [key]: value } }));
  const toggleDistributionArray = (key: 'selectedClasses' | 'selectedSections' | 'selectedStreams' | 'selectedBatches' | 'selectedBranches' | 'selectedMasterFranchises' | 'selectedStudents' | 'selectedStaff' | 'channels', value: string) => updateDraft((current) => {
    const currentValues = current.distribution[key];
    const nextValues = currentValues.includes(value) ? currentValues.filter((item) => item !== value) : [...currentValues, value];
    return { ...current, distribution: { ...current.distribution, [key]: nextValues } };
  });

  const submissions = useMemo<SubmissionRow[]>(() => forms.flatMap((record) => record.responses.map((response) => ({ ...response, formId: record.form.id, formTitle: record.form.title }))), [forms]);
  const visibleForms = useMemo(() => forms.filter((record) => {
    const searchText = `${record.form.title} ${record.form.id} ${record.form.category} ${record.settings.module}`.toLowerCase();
    return (!formSearch || searchText.includes(formSearch.toLowerCase())) && (formStatusFilter === 'All statuses' || record.form.status === formStatusFilter);
  }), [forms, formSearch, formStatusFilter]);
  const visibleSubmissions = useMemo(() => submissions.filter((response) => {
    const searchText = `${response.name} ${response.number} ${response.className} ${response.email} ${response.formTitle} ${response.id}`.toLowerCase();
    return (!submissionSearch || searchText.includes(submissionSearch.toLowerCase())) && (submissionStatusFilter === 'All statuses' || response.status === submissionStatusFilter) && (submissionFormFilter === 'All forms' || response.formId === submissionFormFilter);
  }), [submissions, submissionSearch, submissionStatusFilter, submissionFormFilter]);
  const responseStats = useMemo(() => ({
    total: submissions.length,
    new: submissions.filter((item) => item.status === 'New').length,
    inReview: submissions.filter((item) => item.status === 'In Review').length,
    approved: submissions.filter((item) => item.status === 'Approved').length,
    rejected: submissions.filter((item) => item.status === 'Rejected').length,
    averageTime: submissions.length ? Math.round(submissions.reduce((sum, item) => sum + item.duration, 0) / submissions.length) : 0
  }), [submissions]);
  const selectedField = draft?.fields.find((field) => field.id === selectedFieldId) || null;
  const selectedRecord = selectedSubmission ? forms.find((record) => record.form.id === selectedSubmission.formId) : undefined;
  const selectedResponse = selectedRecord?.responses.find((response) => response.id === selectedSubmission?.responseId);
  const historyRecord = versionFormId ? forms.find((record) => record.form.id === versionFormId) : undefined;
  const studentTargets = draft?.recipients || STUDENT_TARGETS;
  const filteredStudentTargets = studentTargets.filter((recipient) => !studentSearch || `${recipient.name} ${recipient.number} ${recipient.className} ${recipient.email}`.toLowerCase().includes(studentSearch.toLowerCase()));
  const filteredStaffTargets = STAFF_TARGETS.filter((recipient) => !staffSearch || `${recipient.name} ${recipient.department} ${recipient.email}`.toLowerCase().includes(staffSearch.toLowerCase()));
  const visibleFieldGroups = FIELD_GROUPS.map((group) => ({ ...group, types: group.types.filter((type) => !paletteSearch || type.toLowerCase().includes(paletteSearch.toLowerCase())) })).filter((group) => group.types.length > 0);

  const openCreateForm = () => {
    const blank = makeBlankDocument();
    setDraft(blank);
    setWizardStep(0);
    setPage('wizard');
    setSelectedFieldId(null);
    setActiveSectionId(blank.sections[0]?.id || '');
    setPropertyTab('General');
    setPaletteSearch('');
  };
  const openExistingForm = (record: FormDocument) => {
    const editable = cloneDocument(record);
    setDraft(editable);
    setWizardStep(4);
    setPage('wizard');
    setSelectedFieldId(editable.fields[0]?.id || null);
    setActiveSectionId(editable.sections[0]?.id || '');
    setPropertyTab('General');
    setPaletteSearch('');
  };
  const cancelWizard = () => {
    if (draft && (draft.form.title.trim() || draft.fields.length > 0) && !window.confirm('Leave this form setup without saving?')) return;
    setDraft(null);
    setPage('list');
    setListTab('Forms');
  };
  const goToPreviousStep = () => {
    if (wizardStep > 0) setWizardStep((step) => Math.max(0, step - 1));
    else cancelWizard();
  };
  const goToNextStep = () => {
    if (wizardStep === 0 && !draft?.form.title.trim()) { notify('Enter a form title to continue.'); return; }
    setWizardStep((step) => Math.min(WIZARD_STEPS.length - 1, step + 1));
  };
  const saveForm = (publish = false) => {
    if (!draft?.form.title.trim()) { notify('Enter a form title before saving.'); setWizardStep(0); return; }
    if (publish && !draft.fields.some((field) => !field.hidden)) { notify('Add at least one visible field before publishing.'); return; }
    const updatedAt = new Date().toISOString();
    const status: FormStatus = publish ? 'Published' : draft.form.status;
    const nextVersion: VersionEntry = { id: createId('VER'), version: `v${draft.versions.length + 1}.0`, at: updatedAt, author: 'Current user', note: publish ? 'Published form update' : 'Saved form changes' };
    const saved: FormDocument = { ...draft, form: { ...draft.form, status, updatedAt }, versions: [...draft.versions, nextVersion] };
    setForms((previous) => previous.some((record) => record.form.id === saved.form.id) ? previous.map((record) => record.form.id === saved.form.id ? saved : record) : [saved, ...previous]);
    setDraft(null);
    setPage('list');
    setListTab('Forms');
    setFormSearch('');
    notify(publish ? 'Form published and saved. You are back in the forms list.' : 'Form saved. You are back in the forms list.');
  };
  const duplicateForm = (record: FormDocument) => {
    const duplicate = cloneDocument(record);
    duplicate.form = { ...duplicate.form, id: `FRM-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`, title: `${duplicate.form.title} (copy)`, status: 'Draft', updatedAt: new Date().toISOString() };
    duplicate.responses = [];
    duplicate.versions = [{ id: createId('VER'), version: 'v1.0', at: new Date().toISOString(), author: 'Current user', note: 'Duplicated from an existing form' }];
    setForms((previous) => [duplicate, ...previous]);
    notify('A draft copy was added to the forms list.');
  };
  const deleteForm = (record: FormDocument) => {
    if (!window.confirm(`Delete “${record.form.title}” and its local submissions?`)) return;
    setForms((previous) => previous.filter((item) => item.form.id !== record.form.id));
    notify('Form removed from the local list.');
  };
  const updateFormStatus = (formId: string, status: FormStatus) => {
    setForms((previous) => previous.map((record) => record.form.id === formId ? { ...record, form: { ...record.form, status, updatedAt: new Date().toISOString() } } : record));
    notify(`Form status changed to ${status.toLowerCase()}.`);
  };
  const addSection = () => {
    if (!draft) return;
    const section = createSection(`New section ${draft.sections.length + 1}`);
    updateDraft((current) => ({ ...current, sections: [...current.sections, section] }));
    setActiveSectionId(section.id);
  };
  const addField = (type: string, sectionId = activeSectionId) => {
    if (!draft) return;
    const targetSection = draft.sections.some((section) => section.id === sectionId) ? sectionId : draft.sections[0]?.id;
    if (!targetSection) { addSection(); return; }
    const field = createField(type, targetSection, draft.fields.filter((item) => item.type === type).length + 1);
    updateDraft((current) => ({ ...current, fields: [...current.fields, field] }));
    setSelectedFieldId(field.id);
    setActiveSectionId(targetSection);
    setPropertyTab('General');
    setPaletteSearch('');
  };
  const updateField = (id: string, patch: Partial<FormField>) => updateDraft((current) => ({ ...current, fields: current.fields.map((field) => field.id === id ? { ...field, ...patch } : field) }));
  const updateSection = (id: string, patch: Partial<FormSection>) => updateDraft((current) => ({ ...current, sections: current.sections.map((section) => section.id === id ? { ...section, ...patch } : section) }));
  const removeField = (id: string) => {
    if (!draft) return;
    const remaining = draft.fields.filter((field) => field.id !== id);
    updateDraft((current) => ({ ...current, fields: remaining }));
    if (selectedFieldId === id) setSelectedFieldId(remaining[0]?.id || null);
  };
  const duplicateField = (id: string) => {
    if (!draft) return;
    const original = draft.fields.find((field) => field.id === id);
    if (!original) return;
    const copy: FormField = { ...original, id: createId('FLD'), label: `${original.label} (copy)`, options: original.options.map((option) => ({ ...option, id: createId('OPT') })) };
    const index = draft.fields.findIndex((field) => field.id === id);
    const fields = [...draft.fields];
    fields.splice(index + 1, 0, copy);
    updateDraft((current) => ({ ...current, fields }));
    setSelectedFieldId(copy.id);
  };
  const moveField = (fieldId: string, sectionId: string, beforeId?: string) => {
    if (!draft || fieldId === beforeId) return;
    const source = draft.fields.find((field) => field.id === fieldId);
    if (!source) return;
    const remaining = draft.fields.filter((field) => field.id !== fieldId);
    const moved = { ...source, sectionId };
    const targetIndex = beforeId ? remaining.findIndex((field) => field.id === beforeId) : -1;
    if (targetIndex >= 0) remaining.splice(targetIndex, 0, moved);
    else {
      const lastInSection = remaining.reduce((latest, field, index) => field.sectionId === sectionId ? index : latest, -1);
      remaining.splice(lastInSection + 1, 0, moved);
    }
    updateDraft((current) => ({ ...current, fields: remaining }));
    setActiveSectionId(sectionId);
  };
  const handleDrop = (event: DragEvent<HTMLDivElement>, sectionId: string, beforeId?: string) => {
    event.preventDefault();
    const payload = event.dataTransfer.getData('text/plain') || draggingField;
    if (!payload) return;
    if (payload.startsWith('palette:')) addField(payload.slice('palette:'.length), sectionId);
    else if (payload.startsWith('field:')) moveField(payload.slice('field:'.length), sectionId, beforeId);
    setDraggingField(null);
  };
  const reorderField = (fieldId: string, direction: -1 | 1) => {
    if (!draft) return;
    const fields = [...draft.fields];
    const index = fields.findIndex((field) => field.id === fieldId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= fields.length || fields[target].sectionId !== fields[index].sectionId) return;
    [fields[index], fields[target]] = [fields[target], fields[index]];
    updateDraft((current) => ({ ...current, fields }));
  };
  const reorderSection = (sectionId: string, direction: -1 | 1) => {
    if (!draft) return;
    const sections = [...draft.sections];
    const index = sections.findIndex((section) => section.id === sectionId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= sections.length) return;
    [sections[index], sections[target]] = [sections[target], sections[index]];
    updateDraft((current) => ({ ...current, sections }));
  };
  const removeSection = (section: FormSection) => {
    if (!draft) return;
    if (draft.sections.length <= 1) { notify('Keep at least one section in the form.'); return; }
    if (!window.confirm(`Delete “${section.title}” and its fields?`)) return;
    const sections = draft.sections.filter((item) => item.id !== section.id);
    const fields = draft.fields.filter((field) => field.sectionId !== section.id);
    updateDraft((current) => ({ ...current, sections, fields }));
    setActiveSectionId(sections[0]?.id || '');
    if (selectedFieldId && !fields.some((field) => field.id === selectedFieldId)) setSelectedFieldId(fields[0]?.id || null);
  };
  const updateResponse = (formId: string, responseId: string, patch: Partial<Respondent>) => setForms((previous) => previous.map((record) => record.form.id === formId ? { ...record, responses: record.responses.map((response) => response.id === responseId ? { ...response, ...patch } : response) } : record));
  const exportSubmissions = () => {
    const rows = [['Form', 'Submission ID', 'Name', 'Student / Staff ID', 'Class / Department', 'Email', 'Submitted', 'Status', 'Minutes'], ...visibleSubmissions.map((item) => [item.formTitle, item.id, item.name, item.number, item.className, item.email, item.submittedAt, item.status, String(item.duration)])];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'custom-form-submissions.csv'; anchor.click(); URL.revokeObjectURL(url);
    notify('Submissions exported as CSV.');
  };
  const exportFormJson = (record: FormDocument) => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(record, null, 2)], { type: 'application/json' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${record.form.id.toLowerCase()}-form.json`; anchor.click(); URL.revokeObjectURL(url);
    notify('Form configuration exported as JSON.');
  };
  const formatDate = (value: string) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };
  const renderPreview = (record: FormDocument) => <div className="mx-auto max-w-3xl space-y-4">
    <div className="rounded-xl border border-gray-200 bg-white p-5"><div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-wide text-gray-500"><Badge variant="info">{record.form.category}</Badge><span>{record.form.id}</span></div><h2 className="text-xl font-bold" style={{ color: record.settings.accentColor }}>{record.form.title}</h2><p className="mt-2 text-sm text-gray-600">{record.settings.description}</p>{record.settings.progressIndicator && <div className="mt-4 h-1.5 rounded-full bg-gray-100"><div className="h-full w-1/3 rounded-full" style={{ backgroundColor: record.settings.accentColor }} /></div>}</div>
    {record.sections.map((section) => <div key={section.id} className="space-y-4 rounded-xl border border-gray-200 bg-white p-5"><div><h3 className="font-semibold">{section.title}</h3>{record.settings.sectionIntro && section.description && <p className="mt-1 text-xs text-gray-500">{section.description}</p>}</div><div className="grid grid-cols-1 gap-4 md:grid-cols-12">{record.fields.filter((field) => field.sectionId === section.id && !field.hidden).map((field) => <div key={field.id} className={field.width === 'Full' ? 'md:col-span-12' : field.width === 'Half' ? 'md:col-span-6' : 'md:col-span-4'}><label className="mb-1.5 block text-sm font-medium text-gray-800">{field.label}{field.required && <span className="ml-1 text-red-500">*</span>}</label>{field.description && <p className="mb-2 text-xs text-gray-500">{field.description}</p>}<FieldPreview field={field} /></div>)}</div></div>)}
    <Button className="w-full" onClick={() => notify('Preview submission is simulated locally.')}>Submit response</Button>
  </div>;

  const renderGeneralStep = () => draft && <div className="mx-auto max-w-4xl space-y-5">
    <div><h2 className="text-xl font-bold text-gray-900">General settings</h2><p className="mt-1 text-sm text-gray-500">Name the form, choose its category, and set the respondent-facing introduction.</p></div>
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><div className="grid gap-4 md:grid-cols-2">
      <label className="text-xs font-semibold text-gray-600 md:col-span-2">FORM TITLE <span className="text-red-500">*</span><input autoFocus value={draft.form.title} onChange={(event) => patchForm({ title: event.target.value })} placeholder="e.g. Student Admission Form" className="mt-1.5 w-full rounded-lg border border-gray-300 p-3 text-sm font-normal text-gray-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100" /></label>
      <label className="text-xs font-semibold text-gray-600">CATEGORY<select value={draft.form.category} onChange={(event) => patchForm({ category: event.target.value })} className="mt-1.5 w-full rounded-lg border border-gray-300 p-3 text-sm font-normal text-gray-900">{FORM_CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></label>
      <label className="text-xs font-semibold text-gray-600">FORM LAYOUT<select value={draft.settings.layout} onChange={(event) => patchSetting('layout', event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 p-3 text-sm font-normal text-gray-900"><option>One column</option><option>Two columns</option><option>Card sections</option><option>Step-by-step wizard</option></select></label>
      <label className="text-xs font-semibold text-gray-600 md:col-span-2">DESCRIPTION<textarea value={draft.settings.description} onChange={(event) => patchSetting('description', event.target.value)} rows={4} placeholder="Explain what this form collects and who should complete it." className="mt-1.5 w-full rounded-lg border border-gray-300 p-3 text-sm font-normal text-gray-900" /></label>
      <label className="text-xs font-semibold text-gray-600">VISUAL THEME<select value={draft.settings.theme} onChange={(event) => patchSetting('theme', event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 p-3 text-sm font-normal text-gray-900"><option>Clean</option><option>Modern</option><option>Classic</option><option>High contrast</option></select></label>
      <label className="text-xs font-semibold text-gray-600">ACCENT COLOR<div className="mt-1.5 flex h-11 items-center gap-3 rounded-lg border border-gray-300 px-3"><input type="color" value={draft.settings.accentColor} onChange={(event) => patchSetting('accentColor', event.target.value)} className="h-7 w-10 cursor-pointer border-0 bg-transparent p-0" /><span className="font-mono text-xs text-gray-600">{draft.settings.accentColor}</span></div></label>
    </div><div className="mt-4 grid gap-3 md:grid-cols-2"><Toggle checked={draft.settings.progressIndicator} onChange={(value) => patchSetting('progressIndicator', value)} label="Show a progress indicator" description="Display progress as respondents move through the form." /><Toggle checked={draft.settings.sectionIntro} onChange={(value) => patchSetting('sectionIntro', value)} label="Show section descriptions" /></div></section>
    <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-xs text-indigo-900"><strong>Form ID:</strong> {draft.form.id} <span className="mx-2 text-indigo-300">·</span><strong>Initial status:</strong> Draft</div>
  </div>;

  const renderModuleStep = () => draft && <div className="mx-auto max-w-4xl space-y-5">
    <div><h2 className="text-xl font-bold text-gray-900">Module linking</h2><p className="mt-1 text-sm text-gray-500">Choose which ERP module receives each response. Field-level mappings can be completed in the builder.</p></div>
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><div className="grid gap-4 md:grid-cols-2">
      <label className="text-xs font-semibold text-gray-600">ERP MODULE<select value={draft.settings.module} onChange={(event) => patchSetting('module', event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 p-3 text-sm font-normal text-gray-900">{MODULES.map((module) => <option key={module}>{module}</option>)}</select></label>
      <label className="text-xs font-semibold text-gray-600">RECORD TYPE<input value={draft.settings.recordType} onChange={(event) => patchSetting('recordType', event.target.value)} placeholder="e.g. Student admission enquiry" className="mt-1.5 w-full rounded-lg border border-gray-300 p-3 text-sm font-normal text-gray-900" /></label>
      <label className="text-xs font-semibold text-gray-600 md:col-span-2">DEFAULT RECORD OWNER<input value={draft.settings.recordOwner} onChange={(event) => patchSetting('recordOwner', event.target.value)} placeholder="Team or role responsible for these records" className="mt-1.5 w-full rounded-lg border border-gray-300 p-3 text-sm font-normal text-gray-900" /></label>
    </div><div className="mt-4"><Toggle checked={draft.settings.createRecord} onChange={(value) => patchSetting('createRecord', value)} label="Create or update an ERP record on submission" description="When disabled, responses remain in the Submissions tab without creating a linked record." /></div></section>
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"><div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 p-4"><div><h3 className="text-sm font-semibold text-gray-900">Field mapping</h3><p className="mt-1 text-xs text-gray-500">Connect form inputs to the selected module's data fields.</p></div><Badge variant="info">{draft.fields.filter((field) => field.mappedTo).length} mapped</Badge></div>{draft.fields.length ? <div className="divide-y divide-gray-100">{draft.fields.map((field) => <div key={field.id} className="grid gap-2 p-3 sm:grid-cols-2 sm:items-center"><span className="text-xs font-medium text-gray-800">{field.label}</span><input value={field.mappedTo} onChange={(event) => updateField(field.id, { mappedTo: event.target.value })} placeholder="e.g. student.firstName" className="w-full rounded-lg border border-gray-300 p-2 text-xs" /></div>)}</div> : <div className="p-5 text-center text-xs text-gray-500">No form fields yet. Add and map fields in the Form Builder step.</div>}</section>
  </div>;

  const renderPostSubmitStep = () => draft && <div className="mx-auto max-w-4xl space-y-5">
    <div><h2 className="text-xl font-bold text-gray-900">Post-submit experience</h2><p className="mt-1 text-sm text-gray-500">Set the confirmation shown after a respondent submits the form.</p></div>
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><div className="space-y-4">
      <label className="block text-xs font-semibold text-gray-600">SUCCESS MESSAGE<textarea value={draft.settings.successMessage} onChange={(event) => patchSetting('successMessage', event.target.value)} rows={4} className="mt-1.5 w-full rounded-lg border border-gray-300 p-3 text-sm font-normal text-gray-900" /></label>
      <label className="block text-xs font-semibold text-gray-600">REDIRECT URL <span className="font-normal text-gray-400">(optional)</span><input value={draft.settings.redirectUrl} onChange={(event) => patchSetting('redirectUrl', event.target.value)} placeholder="https://school.example/thanks" className="mt-1.5 w-full rounded-lg border border-gray-300 p-3 text-sm font-normal text-gray-900" /></label>
      <div className="grid gap-3 md:grid-cols-2"><Toggle checked={draft.settings.allowAnotherResponse} onChange={(value) => patchSetting('allowAnotherResponse', value)} label="Allow another response in the same browser" /><Toggle checked={draft.settings.downloadCopy} onChange={(value) => patchSetting('downloadCopy', value)} label="Offer a downloadable response copy" /></div>
    </div></section>
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><h3 className="mb-3 text-sm font-semibold text-gray-900">Confirmation notifications</h3><div className="grid gap-3 md:grid-cols-2"><Toggle checked={draft.settings.respondentConfirmation} onChange={(value) => patchSetting('respondentConfirmation', value)} label="Send a confirmation to the respondent" /><Toggle checked={draft.settings.emailNotifications} onChange={(value) => patchSetting('emailNotifications', value)} label="Notify the form owner by email" /><label className="text-xs font-semibold text-gray-600 md:col-span-2">NOTIFY THESE EMAILS<input value={draft.settings.adminEmails} onChange={(event) => patchSetting('adminEmails', event.target.value)} placeholder="team@example.edu" className="mt-1.5 w-full rounded-lg border border-gray-300 p-3 text-sm font-normal" /></label></div></section>
  </div>;

  const renderAudienceStep = () => draft && <div className="mx-auto max-w-5xl space-y-5">
    <div><h2 className="text-xl font-bold text-gray-900">Audience targeting</h2><p className="mt-1 text-sm text-gray-500">Choose who can receive or access the form, then refine by class, branch, batch, or named respondents.</p></div>
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><label className="block max-w-xl text-xs font-semibold text-gray-600">AUDIENCE TYPE<select value={draft.distribution.audienceType} onChange={(event) => { patchDistribution('audienceType', event.target.value); patchDistribution('audience', event.target.value); }} className="mt-1.5 w-full rounded-lg border border-gray-300 p-3 text-sm font-normal text-gray-900"><option>All Students</option><option>Selected Students</option><option>Class &amp; Section</option><option>Batch</option><option>Branch</option><option>Master Franchise</option><option>Students</option><option>Staff</option><option>Parents / Guardians</option></select></label><p className="mt-3 text-xs text-gray-500">Selections below can be combined to narrow the eligible audience.</p></section>
    <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <ChoiceGroup label="Class" options={CLASSES} selected={draft.distribution.selectedClasses} onToggle={(value) => toggleDistributionArray('selectedClasses', value)} columns="grid" />
      <ChoiceGroup label="Section" options={SECTIONS} selected={draft.distribution.selectedSections} onToggle={(value) => toggleDistributionArray('selectedSections', value)} />
      <ChoiceGroup label="Stream" options={STREAMS} selected={draft.distribution.selectedStreams} onToggle={(value) => toggleDistributionArray('selectedStreams', value)} />
      <ChoiceGroup label="Batch" options={BATCHES} selected={draft.distribution.selectedBatches} onToggle={(value) => toggleDistributionArray('selectedBatches', value)} />
      <ChoiceGroup label="Branch" options={BRANCHES} selected={draft.distribution.selectedBranches} onToggle={(value) => toggleDistributionArray('selectedBranches', value)} />
      <ChoiceGroup label="Master franchise" options={MASTER_FRANCHISES} selected={draft.distribution.selectedMasterFranchises} onToggle={(value) => toggleDistributionArray('selectedMasterFranchises', value)} />
    </section>
    <section className="grid gap-5 xl:grid-cols-2">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"><div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 p-4"><div><h3 className="text-sm font-semibold text-gray-900">Students</h3><p className="mt-1 text-[10px] text-gray-500">{draft.distribution.selectedStudents.length} selected · {studentTargets.length} available</p></div><label className="relative"><Search className="absolute left-2 top-2 h-3.5 w-3.5 text-gray-400" /><input value={studentSearch} onChange={(event) => setStudentSearch(event.target.value)} placeholder="Find student" className="w-40 rounded-lg border py-1.5 pl-7 pr-2 text-[10px]" /></label></div><div className="max-h-64 divide-y divide-gray-100 overflow-y-auto">{filteredStudentTargets.map((recipient) => <label key={recipient.id} className="flex cursor-pointer items-center gap-3 px-4 py-2.5 hover:bg-gray-50"><input type="checkbox" checked={draft.distribution.selectedStudents.includes(recipient.id)} onChange={() => toggleDistributionArray('selectedStudents', recipient.id)} className="accent-indigo-600" /><span className="min-w-0 flex-1"><strong className="block truncate text-xs text-gray-800">{recipient.name}</strong><span className="text-[10px] text-gray-500">{recipient.number} · {recipient.className}</span></span><span className="hidden text-[10px] text-gray-500 sm:block">{recipient.email}</span></label>)}{filteredStudentTargets.length === 0 && <p className="p-5 text-center text-xs text-gray-500">No matching students.</p>}</div></div>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"><div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 p-4"><div><h3 className="text-sm font-semibold text-gray-900">Staff</h3><p className="mt-1 text-[10px] text-gray-500">{draft.distribution.selectedStaff.length} selected · {STAFF_TARGETS.length} available</p></div><label className="relative"><Search className="absolute left-2 top-2 h-3.5 w-3.5 text-gray-400" /><input value={staffSearch} onChange={(event) => setStaffSearch(event.target.value)} placeholder="Find staff" className="w-40 rounded-lg border py-1.5 pl-7 pr-2 text-[10px]" /></label></div><div className="max-h-64 divide-y divide-gray-100 overflow-y-auto">{filteredStaffTargets.map((person) => <label key={person.id} className="flex cursor-pointer items-center gap-3 px-4 py-2.5 hover:bg-gray-50"><input type="checkbox" checked={draft.distribution.selectedStaff.includes(person.id)} onChange={() => toggleDistributionArray('selectedStaff', person.id)} className="accent-indigo-600" /><span className="min-w-0 flex-1"><strong className="block truncate text-xs text-gray-800">{person.name}</strong><span className="text-[10px] text-gray-500">{person.id} · {person.department}</span></span><span className="hidden text-[10px] text-gray-500 sm:block">{person.email}</span></label>)}</div></div>
    </section>
    <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><div><h3 className="text-sm font-semibold text-gray-900">Distribution and access</h3><p className="mt-1 text-xs text-gray-500">Choose channels and optional delivery controls for this audience.</p></div><ChoiceGroup label="Delivery channels" options={['Public link', 'In-app', 'Email', 'SMS', 'QR code', 'Embed']} selected={draft.distribution.channels} onToggle={(value) => toggleDistributionArray('channels', value)} />
      <div className="grid gap-3 md:grid-cols-2"><label className="text-xs font-semibold text-gray-600">SEND TIMING<select value={draft.distribution.sendMode} onChange={(event) => patchDistribution('sendMode', event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 p-2.5 text-sm font-normal"><option>Send immediately</option><option>Schedule send</option><option>Save as draft</option></select></label>{draft.distribution.sendMode === 'Schedule send' && <label className="text-xs font-semibold text-gray-600">SEND AT<input type="datetime-local" value={draft.distribution.sendAt} onChange={(event) => patchDistribution('sendAt', event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 p-2.5 text-sm font-normal" /></label>}</div>
      <div className="grid gap-3 md:grid-cols-2"><Toggle checked={draft.distribution.reminder} onChange={(value) => patchDistribution('reminder', value)} label="Send a reminder to non-respondents" /><label className="text-xs font-semibold text-gray-600">REMINDER AFTER (DAYS)<input type="number" min={1} value={draft.distribution.reminderAfterDays} onChange={(event) => patchDistribution('reminderAfterDays', Number(event.target.value))} className="mt-1.5 w-full rounded-lg border border-gray-300 p-2.5 text-sm font-normal" /></label></div>
      <div className="grid gap-3 md:grid-cols-2"><Toggle checked={draft.settings.requireLogin} onChange={(value) => patchSetting('requireLogin', value)} label="Require sign-in" description="Limit access to authenticated users." /><Toggle checked={draft.settings.allowAnonymous} onChange={(value) => patchSetting('allowAnonymous', value)} label="Allow public / anonymous responses" /></div>
    </section>
  </div>;

  const renderFieldProperties = () => {
    if (!draft || !selectedField) return <div className="rounded-xl border border-dashed border-gray-300 p-5 text-center text-xs text-gray-500">Select a field on the canvas to adjust its size, validation, and logic.</div>;
    const choiceField = ['Dropdown', 'Single Choice', 'Multi-Select', 'Checkboxes'].includes(selectedField.type);
    return <div className="space-y-3"><div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase text-indigo-700">{selectedField.type}</p><h3 className="font-semibold text-gray-900">Element properties</h3></div><button onClick={() => removeField(selectedField.id)} className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600" title="Delete field"><Trash2 className="h-4 w-4" /></button></div>
      <div className="flex rounded-lg bg-gray-100 p-1">{(['General', 'Validation', 'Logic'] as PropertyTab[]).map((tab) => <button key={tab} onClick={() => setPropertyTab(tab)} className={`flex-1 rounded-md px-2 py-1.5 text-[10px] font-semibold ${propertyTab === tab ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500'}`}>{tab}</button>)}</div>
      {propertyTab === 'General' && <div className="space-y-3"><label className="block text-[10px] font-semibold text-gray-500">FIELD LABEL<input value={selectedField.label} onChange={(event) => updateField(selectedField.id, { label: event.target.value })} className="mt-1 w-full rounded-md border p-2 text-xs font-normal text-gray-800" /></label><label className="block text-[10px] font-semibold text-gray-500">HELP TEXT<textarea value={selectedField.description} onChange={(event) => updateField(selectedField.id, { description: event.target.value })} className="mt-1 w-full rounded-md border p-2 text-xs font-normal" rows={2} /></label><label className="block text-[10px] font-semibold text-gray-500">PLACEHOLDER<input value={selectedField.placeholder} onChange={(event) => updateField(selectedField.id, { placeholder: event.target.value })} className="mt-1 w-full rounded-md border p-2 text-xs font-normal" /></label><label className="block text-[10px] font-semibold text-gray-500">ELEMENT SIZE / WIDTH<select value={selectedField.width} onChange={(event) => updateField(selectedField.id, { width: event.target.value as FieldWidth })} className="mt-1 w-full rounded-md border p-2 text-xs font-normal"><option>Full</option><option>Half</option><option>Third</option></select></label><label className="block text-[10px] font-semibold text-gray-500">DEFAULT VALUE<input value={selectedField.defaultValue} onChange={(event) => updateField(selectedField.id, { defaultValue: event.target.value })} className="mt-1 w-full rounded-md border p-2 text-xs font-normal" /></label><Toggle checked={selectedField.required} onChange={(value) => updateField(selectedField.id, { required: value })} label="Required field" /><Toggle checked={selectedField.hidden} onChange={(value) => updateField(selectedField.id, { hidden: value })} label="Hidden field" description="Keep the field on the form but do not display it to respondents." /><Toggle checked={selectedField.readOnly} onChange={(value) => updateField(selectedField.id, { readOnly: value })} label="Read-only" />
        {choiceField && <div><div className="mb-2 flex items-center justify-between"><p className="text-[10px] font-semibold text-gray-500">OPTIONS</p><button onClick={() => updateField(selectedField.id, { options: [...selectedField.options, { id: createId('OPT'), label: `Option ${selectedField.options.length + 1}` }] })} className="text-[10px] font-semibold text-indigo-700">+ Add</button></div><div className="space-y-1.5">{selectedField.options.map((option, index) => <div key={option.id} className="flex gap-1"><input value={option.label} onChange={(event) => updateField(selectedField.id, { options: selectedField.options.map((item) => item.id === option.id ? { ...item, label: event.target.value } : item) })} className="min-w-0 flex-1 rounded border p-1.5 text-xs" /><button onClick={() => updateField(selectedField.id, { options: selectedField.options.filter((item) => item.id !== option.id) })} className="p-1 text-gray-400 hover:text-red-600" disabled={selectedField.options.length <= 1} title={`Remove option ${index + 1}`}><X className="h-3.5 w-3.5" /></button></div>)}</div></div>}
        <label className="block text-[10px] font-semibold text-gray-500">MODULE FIELD MAPPING<input value={selectedField.mappedTo} onChange={(event) => updateField(selectedField.id, { mappedTo: event.target.value })} placeholder="e.g. student.firstName" className="mt-1 w-full rounded-md border p-2 text-xs font-normal" /></label><Toggle checked={selectedField.unique} onChange={(value) => updateField(selectedField.id, { unique: value })} label="Require unique value" />
      </div>}
      {propertyTab === 'Validation' && <div className="space-y-3"><p className="text-[10px] text-gray-500">Set field-level validation rules.</p><div className="grid grid-cols-2 gap-2"><label className="text-[10px] text-gray-500">MIN LENGTH<input type="number" min={0} value={selectedField.minLength} onChange={(event) => updateField(selectedField.id, { minLength: Number(event.target.value) })} className="mt-1 w-full rounded-md border p-2 text-xs" /></label><label className="text-[10px] text-gray-500">MAX LENGTH<input type="number" min={0} value={selectedField.maxLength} onChange={(event) => updateField(selectedField.id, { maxLength: Number(event.target.value) })} className="mt-1 w-full rounded-md border p-2 text-xs" /></label><label className="text-[10px] text-gray-500">MIN VALUE<input type="number" value={selectedField.minValue} onChange={(event) => updateField(selectedField.id, { minValue: event.target.value })} className="mt-1 w-full rounded-md border p-2 text-xs" /></label><label className="text-[10px] text-gray-500">MAX VALUE<input type="number" value={selectedField.maxValue} onChange={(event) => updateField(selectedField.id, { maxValue: event.target.value })} className="mt-1 w-full rounded-md border p-2 text-xs" /></label></div><label className="block text-[10px] font-semibold text-gray-500">REGULAR EXPRESSION<input value={selectedField.regex} onChange={(event) => updateField(selectedField.id, { regex: event.target.value })} placeholder="Optional pattern" className="mt-1 w-full rounded-md border p-2 text-xs font-normal" /></label><label className="block text-[10px] font-semibold text-gray-500">ERROR MESSAGE<input value={selectedField.errorMessage} onChange={(event) => updateField(selectedField.id, { errorMessage: event.target.value })} className="mt-1 w-full rounded-md border p-2 text-xs font-normal" /></label>{selectedField.type.includes('Upload') && <><label className="block text-[10px] font-semibold text-gray-500">ALLOWED FILE TYPES<input value={selectedField.fileTypes} onChange={(event) => updateField(selectedField.id, { fileTypes: event.target.value })} className="mt-1 w-full rounded-md border p-2 text-xs font-normal" /></label><label className="block text-[10px] font-semibold text-gray-500">MAX FILE SIZE (MB)<input type="number" min={1} value={selectedField.maxFileSize} onChange={(event) => updateField(selectedField.id, { maxFileSize: Number(event.target.value) })} className="mt-1 w-full rounded-md border p-2 text-xs font-normal" /></label></>}</div>}
      {propertyTab === 'Logic' && <div className="space-y-3"><div className="rounded-lg bg-indigo-50 p-3 text-[10px] text-indigo-900">Show this element based on another response.</div><Toggle checked={selectedField.logicEnabled} onChange={(value) => updateField(selectedField.id, { logicEnabled: value })} label="Enable conditional logic" /><label className="block text-[10px] font-semibold text-gray-500">WHEN FIELD<select value={selectedField.logicFieldId} onChange={(event) => updateField(selectedField.id, { logicFieldId: event.target.value })} className="mt-1 w-full rounded-md border p-2 text-xs font-normal"><option value="">Choose a field</option>{draft.fields.filter((field) => field.id !== selectedField.id).map((field) => <option key={field.id} value={field.id}>{field.label}</option>)}</select></label><label className="block text-[10px] font-semibold text-gray-500">CONDITION<select value={selectedField.logicOperator} onChange={(event) => updateField(selectedField.id, { logicOperator: event.target.value })} className="mt-1 w-full rounded-md border p-2 text-xs font-normal"><option value="equals">Is equal to</option><option value="not-equals">Is not equal to</option><option value="contains">Contains</option><option value="answered">Has a response</option></select></label><label className="block text-[10px] font-semibold text-gray-500">VALUE<input value={selectedField.logicValue} onChange={(event) => updateField(selectedField.id, { logicValue: event.target.value })} className="mt-1 w-full rounded-md border p-2 text-xs font-normal" /></label></div>}
    </div>;
  };

  const renderBuilder = () => draft && <div className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-bold text-gray-900">Drag-and-drop form builder</h2><p className="mt-1 text-xs text-gray-500">Add fields, drag to reorder, and adjust each element's size in its properties.</p></div><div className="flex flex-wrap gap-2"><Button variant="outline" size="sm" onClick={addSection}><FilePlus2 className="mr-1.5 h-3.5 w-3.5" />Add section</Button><Button variant="outline" size="sm" onClick={() => setShowPreview(true)}><Eye className="mr-1.5 h-3.5 w-3.5" />Preview</Button></div></div>
    <div className="grid items-start gap-4 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[230px_minmax(0,1fr)_300px]">
      <aside className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Field palette</p><p className="text-[10px] text-gray-400">Click or drag to add</p></div></div><label className="relative mt-3 block"><Search className="absolute left-2 top-2 h-3.5 w-3.5 text-gray-400" /><input value={paletteSearch} onChange={(event) => setPaletteSearch(event.target.value)} placeholder="Find a field" className="w-full rounded-md border py-1.5 pl-7 pr-2 text-xs" /></label><div className="mt-3 space-y-4">{visibleFieldGroups.map((group) => <div key={group.name}><p className="mb-1.5 text-[10px] font-semibold text-gray-500">{group.name}</p><div className="grid gap-1">{group.types.map((type) => <button key={type} draggable onDragStart={(event) => { setDraggingField(`palette:${type}`); event.dataTransfer.setData('text/plain', `palette:${type}`); }} onClick={() => addField(type)} className="flex items-center justify-between rounded-md border border-transparent bg-gray-50 px-2.5 py-2 text-left text-[11px] text-gray-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"><span>{type}</span><Plus className="h-3 w-3 text-gray-400" /></button>)}</div></div>)}</div><div className="mt-4 rounded-lg border border-dashed border-indigo-200 bg-indigo-50 p-3 text-[10px] text-indigo-800"><strong>Quick tip:</strong> Drag a field into a section, then choose Full, Half, or Third width in its properties.</div></aside>
      <main className="min-w-0 space-y-3 rounded-2xl border border-gray-200 bg-slate-100 p-3 shadow-sm sm:p-5"><div className="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-5 shadow-sm"><div className="mb-4 border-b border-gray-100 pb-4"><div className="flex flex-wrap items-center gap-2"><Badge variant="info">{draft.form.category}</Badge><span className="text-[10px] text-gray-400">{draft.form.id}</span></div><h2 className="mt-2 text-xl font-bold" style={{ color: draft.settings.accentColor }}>{draft.form.title || 'Untitled form'}</h2><p className="mt-1 text-xs text-gray-500">{draft.settings.description || 'Form description will appear here.'}</p>{draft.settings.progressIndicator && <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100"><div className="h-full w-1/3 rounded-full" style={{ backgroundColor: draft.settings.accentColor }} /></div>}</div>
        <div className="space-y-3">{draft.sections.map((section, sectionIndex) => {
          const sectionFields = draft.fields.filter((field) => field.sectionId === section.id);
          return <div key={section.id} onDragOver={(event) => event.preventDefault()} onDrop={(event) => handleDrop(event, section.id)} className={`rounded-xl border bg-white ${activeSectionId === section.id ? 'border-indigo-300 shadow-sm' : 'border-gray-200'}`}>
            <div className="flex items-start gap-2 border-b border-gray-100 bg-gray-50/80 p-3"><GripVertical className="mt-1 h-4 w-4 text-gray-400" /><div className="min-w-0 flex-1"><input value={section.title} onFocus={() => setActiveSectionId(section.id)} onChange={(event) => updateSection(section.id, { title: event.target.value })} className="w-full bg-transparent text-sm font-semibold text-gray-900 focus:outline-none" placeholder="Section title" /><input value={section.description} onChange={(event) => updateSection(section.id, { description: event.target.value })} placeholder="Section description (optional)" className="mt-1 w-full bg-transparent text-[10px] text-gray-500 focus:outline-none" /></div><div className="flex gap-1"><button title="Move section up" disabled={sectionIndex === 0} onClick={() => reorderSection(section.id, -1)} className="rounded p-1 text-gray-400 hover:bg-white disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5" /></button><button title="Move section down" disabled={sectionIndex === draft.sections.length - 1} onClick={() => reorderSection(section.id, 1)} className="rounded p-1 text-gray-400 hover:bg-white disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5" /></button><button title="Collapse section" onClick={() => updateSection(section.id, { collapsed: !section.collapsed })} className="rounded p-1 text-gray-400 hover:bg-white"><ChevronDown className={`h-3.5 w-3.5 transition-transform ${section.collapsed ? '-rotate-90' : ''}`} /></button><button title="Delete section" onClick={() => removeSection(section)} className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button></div></div>
            {!section.collapsed && <div className="space-y-2 p-3"><div className="grid grid-cols-1 gap-3 md:grid-cols-12">{sectionFields.map((field, fieldIndex) => <div key={field.id} draggable onDragStart={(event) => { setDraggingField(`field:${field.id}`); event.dataTransfer.setData('text/plain', `field:${field.id}`); }} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.stopPropagation(); handleDrop(event, section.id, field.id); }} onClick={() => { setSelectedFieldId(field.id); setActiveSectionId(section.id); setPropertyTab('General'); }} className={`group relative cursor-pointer rounded-lg border p-3 transition-colors ${field.width === 'Full' ? 'col-span-1 md:col-span-12' : field.width === 'Half' ? 'col-span-1 md:col-span-6' : 'col-span-1 md:col-span-4'} ${selectedFieldId === field.id ? 'border-indigo-400 bg-indigo-50/40 ring-1 ring-indigo-100' : 'border-gray-200 hover:border-indigo-200'} ${field.hidden ? 'opacity-60' : ''}`}>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-2"><GripVertical className="h-3.5 w-3.5 text-gray-300" /><span className="text-[10px] font-bold uppercase text-indigo-700">{field.type}</span>{field.required && <Badge variant="warning">Required</Badge>}{field.hidden && <Badge variant="default">Hidden</Badge>}{field.logicEnabled && <Badge variant="info">Logic</Badge>}</div><div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100"><select aria-label="Element size" value={field.width} onClick={(event) => event.stopPropagation()} onChange={(event) => updateField(field.id, { width: event.target.value as FieldWidth })} className="rounded border bg-white px-1 py-1 text-[9px]"><option>Full</option><option>Half</option><option>Third</option></select><button title="Move up" onClick={(event) => { event.stopPropagation(); reorderField(field.id, -1); }} className="rounded p-1 text-gray-400 hover:bg-white"><ArrowUp className="h-3.5 w-3.5" /></button><button title="Move down" onClick={(event) => { event.stopPropagation(); reorderField(field.id, 1); }} className="rounded p-1 text-gray-400 hover:bg-white"><ArrowDown className="h-3.5 w-3.5" /></button><button title="Duplicate" onClick={(event) => { event.stopPropagation(); duplicateField(field.id); }} className="rounded p-1 text-gray-400 hover:bg-white"><Copy className="h-3.5 w-3.5" /></button><button title="Delete" onClick={(event) => { event.stopPropagation(); removeField(field.id); }} className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button></div></div>
              {field.type !== 'Heading' && field.type !== 'Paragraph' && field.type !== 'Divider' && <label className="mb-1.5 block text-xs font-semibold text-gray-800">{field.label}{field.required && <span className="ml-1 text-red-500">*</span>}</label>}{field.description && <p className="mb-2 text-[10px] text-gray-500">{field.description}</p>}<FieldPreview field={field} /><div className="mt-2 flex justify-between text-[9px] text-gray-400"><span>{field.mappedTo ? `Maps to ${field.mappedTo}` : 'Not linked to a module field'}</span><span>#{fieldIndex + 1}</span></div>
            </div>)}</div><button onClick={() => addField('Short Text', section.id)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.stopPropagation(); handleDrop(event, section.id); }} className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 py-3 text-xs text-gray-500 hover:border-indigo-300 hover:text-indigo-700"><Plus className="h-4 w-4" />Add field to {section.title}</button></div>}
          </div>;
        })}{draft.sections.length === 0 && <div className="rounded-xl border border-dashed p-10 text-center text-gray-500">No sections yet. Add a section to start building.</div>}</div>
        <div onDragOver={(event) => event.preventDefault()} onDrop={(event) => handleDrop(event, activeSectionId)} className="mt-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-[10px] text-gray-500"><Plus className="mr-1 inline h-3.5 w-3.5" />Drop a field here or choose one from the palette.</div>
      </div>
      </main>
      <aside className="hidden rounded-2xl border border-gray-200 bg-white p-3 shadow-sm xl:block"><div className="mb-3 flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Field properties</p><span className="rounded bg-gray-100 px-1.5 py-1 text-[9px] text-gray-500">{selectedField?.type || 'Field'}</span></div>{renderFieldProperties()}</aside>
      <aside className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm xl:hidden"><p className="mb-3 text-xs font-semibold text-gray-800">Selected field properties</p>{renderFieldProperties()}</aside>
    </div>
  </div>;

  const renderWizardContent = () => wizardStep === 0 ? renderGeneralStep() : wizardStep === 1 ? renderModuleStep() : wizardStep === 2 ? renderPostSubmitStep() : wizardStep === 3 ? renderAudienceStep() : renderBuilder();

  const renderFormsList = () => <div className="space-y-5">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-lg font-bold text-gray-900">Your forms</h2><p className="mt-1 text-xs text-gray-500">Create, edit, publish, and manage your institute's dynamic forms.</p></div><div className="flex flex-wrap gap-2"><label className="relative"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" /><input value={formSearch} onChange={(event) => setFormSearch(event.target.value)} placeholder="Search forms" className="w-48 rounded-lg border py-2 pl-8 pr-3 text-xs" /></label><select value={formStatusFilter} onChange={(event) => setFormStatusFilter(event.target.value)} className="rounded-lg border bg-white px-3 py-2 text-xs"><option>All statuses</option><option>Draft</option><option>Published</option><option>Paused</option></select></div></div>
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-xs"><thead><tr className="bg-gray-50 text-[10px] uppercase tracking-wide text-gray-500"><th className="px-4 py-3">Form</th><th className="px-4 py-3">Module</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Submissions</th><th className="px-4 py-3">Last updated</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{visibleForms.map((record) => <tr key={record.form.id} className="hover:bg-gray-50/70"><td className="px-4 py-3"><div className="flex items-start gap-3"><span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-700"><FileText className="h-4 w-4" /></span><span><strong className="block text-sm text-gray-900">{record.form.title || 'Untitled form'}</strong><span className="mt-1 block text-[10px] text-gray-500">{record.form.category} · {record.form.id}</span></span></div></td><td className="px-4 py-3"><span className="font-medium text-gray-700">{record.settings.module || '—'}</span><span className="mt-1 block text-[10px] text-gray-500">{record.settings.recordType || 'No record type'}</span></td><td className="px-4 py-3"><Badge variant={statusTone(record.form.status)}>{record.form.status}</Badge></td><td className="px-4 py-3"><span className="font-semibold text-gray-800">{record.responses.length}</span><span className="ml-1 text-[10px] text-gray-500">responses</span></td><td className="px-4 py-3 text-gray-600">{formatDate(record.form.updatedAt)}</td><td className="px-4 py-3"><div className="flex justify-end gap-1"><Button size="sm" variant="outline" onClick={() => openExistingForm(record)}>Edit</Button><button title="Duplicate form" onClick={() => duplicateForm(record)} className="rounded-md p-2 text-gray-500 hover:bg-indigo-50 hover:text-indigo-700"><Copy className="h-3.5 w-3.5" /></button><button title="Export form JSON" onClick={() => exportFormJson(record)} className="rounded-md p-2 text-gray-500 hover:bg-gray-100"><Download className="h-3.5 w-3.5" /></button><button title="Version history" onClick={() => setVersionFormId(record.form.id)} className="rounded-md p-2 text-gray-500 hover:bg-gray-100"><Clock3 className="h-3.5 w-3.5" /></button><button title="Delete form" onClick={() => deleteForm(record)} className="rounded-md p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button></div></td></tr>)}{visibleForms.length === 0 && <tr><td colSpan={6} className="p-12 text-center text-gray-500"><FileText className="mx-auto mb-3 h-8 w-8 text-gray-300" /><p className="font-semibold text-gray-700">No forms match your search</p><p className="mt-1 text-xs">Create a new form or adjust the filters.</p></td></tr>}</tbody></table></div><div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 px-4 py-3 text-[10px] text-gray-500"><span>Showing {visibleForms.length} of {forms.length} forms</span><span>Changes are stored in this browser.</span></div></div>
  </div>;

  const renderSubmissionsList = () => <div className="space-y-5">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-lg font-bold text-gray-900">Submissions</h2><p className="mt-1 text-xs text-gray-500">Review responses across all dynamic forms.</p></div><Button variant="outline" size="sm" onClick={exportSubmissions}><Download className="mr-1.5 h-3.5 w-3.5" />Export CSV</Button></div>
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">{[['Total', responseStats.total], ['New', responseStats.new], ['In review', responseStats.inReview], ['Approved', responseStats.approved], ['Rejected', responseStats.rejected]].map(([label, value]) => <div key={String(label)} className="rounded-xl border border-gray-200 bg-white p-4"><span className="text-[10px] text-gray-500">{label}</span><strong className="mt-1 block text-xl text-gray-900">{value}</strong></div>)}</div>
    <div className="flex flex-wrap gap-2 rounded-xl border border-gray-200 bg-white p-3"><label className="relative min-w-[220px] flex-1"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" /><input value={submissionSearch} onChange={(event) => setSubmissionSearch(event.target.value)} placeholder="Search by name, ID, class, or form" className="w-full rounded-lg border py-2 pl-8 pr-3 text-xs" /></label><select value={submissionFormFilter} onChange={(event) => setSubmissionFormFilter(event.target.value)} className="rounded-lg border bg-white px-3 py-2 text-xs"><option>All forms</option>{forms.map((record) => <option key={record.form.id} value={record.form.id}>{record.form.title}</option>)}</select><select value={submissionStatusFilter} onChange={(event) => setSubmissionStatusFilter(event.target.value)} className="rounded-lg border bg-white px-3 py-2 text-xs"><option>All statuses</option><option>New</option><option>In Review</option><option>Approved</option><option>Rejected</option></select></div>
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[930px] text-left text-xs"><thead><tr className="bg-gray-50 text-[10px] uppercase tracking-wide text-gray-500"><th className="px-4 py-3">Respondent</th><th className="px-4 py-3">Form</th><th className="px-4 py-3">Class / ID</th><th className="px-4 py-3">Submitted</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Time</th><th className="px-4 py-3 text-right">Action</th></tr></thead><tbody className="divide-y divide-gray-100">{visibleSubmissions.map((response) => <tr key={`${response.formId}-${response.id}`} className="hover:bg-gray-50"><td className="px-4 py-3"><strong className="block text-gray-900">{response.name}</strong><span className="mt-1 block text-[10px] text-gray-500">{response.email}</span></td><td className="max-w-[230px] px-4 py-3"><span className="block truncate font-medium text-gray-800">{response.formTitle}</span><span className="mt-1 block text-[10px] text-gray-500">{response.formId}</span></td><td className="px-4 py-3"><span className="block">{response.className}</span><span className="mt-1 block font-mono text-[10px] text-gray-500">{response.number}</span></td><td className="px-4 py-3">{formatDate(response.submittedAt)}</td><td className="px-4 py-3"><Badge variant={fieldStatusTone(response.status)}>{response.status}</Badge></td><td className="px-4 py-3">{response.duration} min</td><td className="px-4 py-3 text-right"><Button size="sm" variant="outline" onClick={() => setSelectedSubmission({ formId: response.formId, responseId: response.id })}>Review</Button></td></tr>)}{visibleSubmissions.length === 0 && <tr><td colSpan={7} className="p-12 text-center text-gray-500"><Users className="mx-auto mb-3 h-8 w-8 text-gray-300" /><p className="font-semibold text-gray-700">No submissions found</p><p className="mt-1 text-xs">Try changing the filters or open another tab.</p></td></tr>}</tbody></table></div><div className="border-t border-gray-100 px-4 py-3 text-[10px] text-gray-500">Showing {visibleSubmissions.length} of {submissions.length} submissions</div></div>
  </div>;

  const renderAnalytics = () => {
    const maxResponses = Math.max(1, ...forms.map((record) => record.responses.length));
    const statusRows: Array<[ResponseStatus, number, string]> = [['New', responseStats.new, 'bg-blue-500'], ['In Review', responseStats.inReview, 'bg-amber-500'], ['Approved', responseStats.approved, 'bg-emerald-500'], ['Rejected', responseStats.rejected, 'bg-red-500']];
    return <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-lg font-bold text-gray-900">Analytics</h2><p className="mt-1 text-xs text-gray-500">Form activity and submission status across your workspace.</p></div><select value={analyticsRange} onChange={(event) => setAnalyticsRange(event.target.value)} className="rounded-lg border bg-white px-3 py-2 text-xs"><option>Last 7 days</option><option>Last 30 days</option><option>This term</option><option>All time</option></select></div>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">{[['Total forms', forms.length], ['Published', forms.filter((record) => record.form.status === 'Published').length], ['Submissions', responseStats.total], ['Average completion', `${responseStats.averageTime} min`]].map(([label, value]) => <div key={String(label)} className="rounded-xl border border-gray-200 bg-white p-4"><span className="text-[10px] text-gray-500">{label}</span><strong className="mt-1 block text-2xl text-gray-900">{value}</strong><span className="mt-1 block text-[9px] text-gray-400">{analyticsRange}</span></div>)}</div>
      <div className="grid gap-4 xl:grid-cols-2"><section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-indigo-600" /><div><h3 className="text-sm font-semibold text-gray-900">Submissions by form</h3><p className="text-[10px] text-gray-500">Response volume per form</p></div></div><div className="mt-5 space-y-4">{forms.map((record) => <div key={record.form.id}><div className="mb-1.5 flex items-center justify-between gap-3 text-xs"><span className="min-w-0 truncate text-gray-700">{record.form.title}</span><strong className="shrink-0 text-gray-900">{record.responses.length}</strong></div><div className="h-2 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-indigo-500" style={{ width: `${Math.max(record.responses.length ? 8 : 0, record.responses.length / maxResponses * 100)}%` }} /></div></div>)}{forms.length === 0 && <p className="py-8 text-center text-xs text-gray-500">No forms available.</p>}</div></section>
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><Filter className="h-4 w-4 text-indigo-600" /><div><h3 className="text-sm font-semibold text-gray-900">Submission review status</h3><p className="text-[10px] text-gray-500">Across all forms</p></div></div><div className="mt-5 space-y-4">{statusRows.map(([label, count, color]) => <div key={label}><div className="mb-1.5 flex justify-between text-xs"><span className="text-gray-700">{label}</span><strong className="text-gray-900">{count}{responseStats.total ? ` · ${Math.round(count / responseStats.total * 100)}%` : ''}</strong></div><div className="h-2 overflow-hidden rounded-full bg-gray-100"><div className={`h-full rounded-full ${color}`} style={{ width: `${responseStats.total ? count / responseStats.total * 100 : 0}%` }} /></div></div>)}</div><div className="mt-5 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4"><div><span className="text-[10px] text-gray-500">Forms with responses</span><strong className="mt-1 block text-lg text-gray-900">{forms.filter((record) => record.responses.length > 0).length}</strong></div><div><span className="text-[10px] text-gray-500">Awaiting review</span><strong className="mt-1 block text-lg text-gray-900">{responseStats.new + responseStats.inReview}</strong></div></div></section></div>
    </div>;
  };

  const renderListContent = () => listTab === 'Forms' ? renderFormsList() : listTab === 'Submissions' ? renderSubmissionsList() : renderAnalytics();

  const selectedAudienceCount = draft ? draft.distribution.selectedStudents.length + draft.distribution.selectedStaff.length : 0;
  const progressPercent = ((wizardStep + 1) / WIZARD_STEPS.length) * 100;

  return <div className="min-h-[calc(100vh-4rem)] bg-gray-50 text-gray-900">
    <header className="border-b border-gray-200 bg-white shadow-sm"><div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
      <div className="min-w-0"><div className="mb-1 flex items-center gap-1 text-[10px] text-gray-400"><span>Admin Tools</span><ChevronRight className="h-3 w-3" /><span>Masters</span><ChevronRight className="h-3 w-3" /><span>Custom Fields &amp; Dynamic Forms</span></div>{page === 'list' ? <><h1 className="text-2xl font-bold tracking-tight">Custom Fields &amp; Dynamic Forms</h1><p className="mt-1 text-xs text-gray-500">Create reusable forms, target audiences, and review submissions in one workspace.</p></> : <div className="flex flex-wrap items-center gap-2"><button onClick={cancelWizard} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100" title="Back to forms list"><ChevronRight className="h-4 w-4 rotate-180" /></button><div><h1 className="text-xl font-bold">{draft?.form.title || 'Create new form'}</h1><p className="mt-0.5 text-[10px] text-gray-500">{draft?.form.id} · Step {wizardStep + 1} of {WIZARD_STEPS.length}</p></div></div>}</div>
      {page === 'list' ? <Button onClick={openCreateForm}><FilePlus2 className="mr-1.5 h-4 w-4" />Create New</Button> : <div className="flex items-center gap-2"><Badge variant={statusTone(draft?.form.status || 'Draft')}>{draft?.form.status || 'Draft'}</Badge><span className="hidden text-[10px] text-gray-400 sm:inline">{draft?.fields.length || 0} fields</span></div>}
    </div></header>

    {page === 'list' ? <main className="mx-auto max-w-[1600px] space-y-5 px-4 py-6 sm:px-6 lg:px-8">
      <nav className="flex flex-wrap gap-1 rounded-xl border border-gray-200 bg-white p-1 shadow-sm">{(['Forms', 'Submissions', 'Analytics'] as ListTab[]).map((tab) => { const Icon = tab === 'Forms' ? FileText : tab === 'Submissions' ? Users : BarChart3; const count = tab === 'Submissions' ? submissions.length : undefined; return <button key={tab} onClick={() => setListTab(tab)} className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold transition ${listTab === tab ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}><Icon className="h-4 w-4" />{tab}{count !== undefined && <span className={`rounded-full px-1.5 py-0.5 text-[9px] ${listTab === tab ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>{count}</span>}</button>; })}</nav>
      {renderListContent()}
    </main> : <main className="mx-auto w-full max-w-[1680px] space-y-5 px-4 py-5 pb-28 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4"><div className="grid grid-cols-5 gap-2">{WIZARD_STEPS.map((stepName, index) => <button key={stepName} disabled={index > wizardStep} onClick={() => index <= wizardStep && setWizardStep(index)} className={`group min-w-0 rounded-xl p-2 text-left transition sm:p-3 ${index === wizardStep ? 'bg-indigo-50 ring-1 ring-indigo-200' : index < wizardStep ? 'hover:bg-gray-50' : 'cursor-not-allowed opacity-60'}`}><span className={`mb-2 grid h-7 w-7 place-items-center rounded-full text-[10px] font-bold ${index < wizardStep ? 'bg-emerald-100 text-emerald-700' : index === wizardStep ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>{index < wizardStep ? <Check className="h-3.5 w-3.5" /> : `0${index + 1}`}</span><span className={`block truncate text-[9px] font-semibold sm:text-xs ${index === wizardStep ? 'text-indigo-800' : 'text-gray-600'}`}>{stepName}</span></button>)}</div><div className="mt-3 h-1 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${progressPercent}%` }} /></div></div>
      {renderWizardContent()}
    </main>}

    {page === 'wizard' && <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white/95 shadow-[0_-4px_12px_rgba(15,23,42,0.05)] backdrop-blur"><div className="mx-auto flex max-w-[1680px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8"><div className="flex items-center gap-2"><Button variant="outline" onClick={goToPreviousStep}>{wizardStep === 0 ? 'Cancel' : 'Back'}</Button><span className="hidden text-[10px] text-gray-500 sm:inline">{wizardStep === 3 ? `${selectedAudienceCount} named respondents selected` : WIZARD_STEPS[wizardStep]}</span></div><div className="flex flex-wrap items-center gap-2">{wizardStep < WIZARD_STEPS.length - 1 ? <Button onClick={goToNextStep}>Continue<ChevronRight className="ml-1.5 h-4 w-4" /></Button> : <><Button variant="outline" onClick={() => saveForm(false)}><Check className="mr-1.5 h-4 w-4" />Save &amp; return to forms</Button><Button onClick={() => saveForm(true)}><Send className="mr-1.5 h-4 w-4" />Publish</Button></>}</div></div></footer>}

    {showPreview && draft && <Modal isOpen onClose={() => setShowPreview(false)} title={`Preview · ${draft.form.title || 'Untitled form'}`} size="xl"><div className="max-h-[78vh] overflow-y-auto rounded-xl bg-gray-50 p-4">{renderPreview(draft)}</div></Modal>}
    {selectedSubmission && selectedResponse && selectedRecord && <Modal isOpen onClose={() => setSelectedSubmission(null)} title={`Submission · ${selectedResponse.name}`} size="xl"><div className="max-h-[78vh] space-y-4 overflow-y-auto text-xs"><div className="grid gap-3 rounded-xl bg-gray-50 p-4 sm:grid-cols-2"><div><span className="text-[10px] text-gray-500">FORM</span><strong className="mt-1 block">{selectedRecord.form.title}</strong></div><div><span className="text-[10px] text-gray-500">SUBMITTED</span><strong className="mt-1 block">{new Date(selectedResponse.submittedAt).toLocaleString('en-IN')}</strong></div><div><span className="text-[10px] text-gray-500">ID / CLASS</span><strong className="mt-1 block">{selectedResponse.number} · {selectedResponse.className}</strong></div><div><span className="text-[10px] text-gray-500">EMAIL</span><strong className="mt-1 block">{selectedResponse.email}</strong></div></div><div><h3 className="mb-2 font-semibold">Answers</h3><div className="grid gap-2 sm:grid-cols-2">{Object.entries(selectedResponse.answers).map(([label, value]) => <div key={label} className="rounded-lg border border-gray-200 p-3"><span className="block text-[10px] text-gray-500">{label}</span><strong className="mt-1 block text-gray-800">{value}</strong></div>)}</div></div><div className="grid gap-3 md:grid-cols-2"><label className="text-[10px] font-semibold text-gray-500">REVIEW STATUS<select value={selectedResponse.status} onChange={(event) => updateResponse(selectedRecord.form.id, selectedResponse.id, { status: event.target.value as ResponseStatus })} className="mt-1 w-full rounded-lg border p-2.5 text-xs font-normal"><option>New</option><option>In Review</option><option>Approved</option><option>Rejected</option></select></label><label className="text-[10px] font-semibold text-gray-500">INTERNAL NOTE<textarea value={selectedResponse.note} onChange={(event) => updateResponse(selectedRecord.form.id, selectedResponse.id, { note: event.target.value })} rows={2} placeholder="Add a note for reviewers" className="mt-1 w-full rounded-lg border p-2.5 text-xs font-normal" /></label></div><div className="flex justify-end"><Button onClick={() => setSelectedSubmission(null)}>Done</Button></div></div></Modal>}
    {historyRecord && <Modal isOpen onClose={() => setVersionFormId(null)} title={`Version history · ${historyRecord.form.title}`} size="lg"><div className="max-h-[70vh] space-y-3 overflow-y-auto">{historyRecord.versions.length ? historyRecord.versions.map((version) => <div key={version.id} className="flex items-start gap-3 rounded-xl border border-gray-200 p-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-50 text-indigo-700"><Clock3 className="h-4 w-4" /></span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><strong className="text-sm">{version.version}</strong><span className="text-[10px] text-gray-500">{new Date(version.at).toLocaleString('en-IN')}</span></div><p className="mt-1 text-xs text-gray-600">{version.note}</p><p className="mt-1 text-[10px] text-gray-400">{version.author}</p></div></div>) : <p className="rounded-lg border border-dashed p-6 text-center text-xs text-gray-500">No saved versions yet.</p>}</div></Modal>}
    {toast && <div role="status" className="fixed bottom-20 right-5 z-50 flex max-w-[90vw] items-center gap-2 rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-xs text-white shadow-2xl"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />{toast}<button onClick={() => setToast('')} className="ml-1"><X className="h-3.5 w-3.5" /></button></div>}
  </div>;
}

export default CustomFieldsDynamicForms;
