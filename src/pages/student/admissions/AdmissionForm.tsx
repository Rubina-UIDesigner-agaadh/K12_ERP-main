// AdmissionForm.tsx - Complete Student Admission Form with Editable PEN
import React, { useState, useRef } from 'react';
import {
  Save, User, X, ChevronDown, ChevronRight, CheckCircle, AlertCircle, HelpCircle,
  Building, Users, MapPin, BookOpen, Award, Heart, Bus, Home, Loader2, Upload,
  FileText, Shield, Camera, Trash2, FileCheck, Paperclip, Printer, QrCode, CreditCard,
  Landmark, Copy, Download, Mail, Search, Clock, Eye, History,
  UserCheck, FileSignature, Send, Check, ArrowRight, RefreshCw, Bell,
  GraduationCap, School, BadgeCheck, AlertTriangle, Edit3 } from
'lucide-react';

// ============================================================================
// TYPES
// ============================================================================
interface UploadedDocument {
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
  status: 'uploaded' | 'pending' | 'error';
}

interface DocumentConfig {
  key: string;
  label: string;
  required: boolean;
  accept: string;
  maxSize: string;
  description: string;
  category: string;
}

interface AdmissionRecord {
  id: string;
  grNo: string;
  studentUidNo: string;
  penNo: string;
  studentName: string;
  classForAdmission: string;
  stream?: string;
  section?: string;
  house?: string;
  rollNumber?: string;
  fatherName: string;
  fatherMobile: string;
  fatherEmail: string;
  motherName?: string;
  dateOfBirth?: string;
  gender?: string;
  bloodGroup?: string;
  aadharCardNo?: string;
  panCardNo?: string;
  permanentAddress?: string;
  dateOfAdmission: string;
  status: 'pending_parent' | 'pending_authority' | 'approved' | 'rejected';
  parentApprovedAt?: string;
  authorityApprovedAt?: string;
  createdAt: string;
  classTeacher?: string;
  medium?: string;
  board?: string;
}

type FormDataType = Record<string, any>;

// ============================================================================
// CONFIGS & OPTIONS
// ============================================================================
const documentConfigs: DocumentConfig[] = [
{ key: 'studentPhoto', label: 'Student Passport Photo', required: true, accept: 'image/*', maxSize: '2MB', description: 'Recent passport size photo', category: 'photo' },
{ key: 'birthCertificate', label: 'Birth Certificate', required: true, accept: '.pdf,.jpg,.jpeg,.png', maxSize: '5MB', description: 'Original birth certificate', category: 'identity' },
{ key: 'aadharCardStudent', label: 'Aadhar Card (Student)', required: true, accept: '.pdf,.jpg,.jpeg,.png', maxSize: '5MB', description: "Student's Aadhar card", category: 'identity' },
{ key: 'aadharCardFather', label: 'Aadhar Card (Father)', required: true, accept: '.pdf,.jpg,.jpeg,.png', maxSize: '5MB', description: "Father's Aadhar card", category: 'identity' },
{ key: 'aadharCardMother', label: 'Aadhar Card (Mother)', required: true, accept: '.pdf,.jpg,.jpeg,.png', maxSize: '5MB', description: "Mother's Aadhar card", category: 'identity' },
{ key: 'panCard', label: 'PAN Card', required: false, accept: '.pdf,.jpg,.jpeg,.png', maxSize: '5MB', description: "Student's or Parent's PAN Card", category: 'identity' },
{ key: 'transferCertificate', label: 'Transfer Certificate (TC)', required: false, accept: '.pdf,.jpg,.jpeg,.png', maxSize: '5MB', description: 'TC from previous school', category: 'academic' },
{ key: 'previousMarksheet', label: 'Previous Marksheet', required: false, accept: '.pdf,.jpg,.jpeg,.png', maxSize: '5MB', description: 'Last examination result', category: 'academic' },
{ key: 'casteCertificate', label: 'Caste Certificate', required: false, accept: '.pdf,.jpg,.jpeg,.png', maxSize: '5MB', description: 'If applicable', category: 'certificate' },
{ key: 'incomeCertificate', label: 'Income Certificate', required: false, accept: '.pdf,.jpg,.jpeg,.png', maxSize: '5MB', description: 'For scholarship', category: 'certificate' },
{ key: 'addressProof', label: 'Address Proof', required: true, accept: '.pdf,.jpg,.jpeg,.png', maxSize: '5MB', description: 'Electricity bill/Passport', category: 'identity' },
{ key: 'signatureParent', label: 'Parent Signature', required: true, accept: 'image/*', maxSize: '1MB', description: 'Parent signature on white paper', category: 'other' },
{ key: 'bankPassbook', label: 'Bank Passbook', required: false, accept: '.pdf,.jpg,.jpeg,.png', maxSize: '5MB', description: 'First page of passbook', category: 'bank' },
{ key: 'medicalFitness', label: 'Medical Fitness Certificate', required: false, accept: '.pdf,.jpg,.jpeg,.png', maxSize: '5MB', description: 'From registered doctor', category: 'certificate' }];


const OPTIONS = {
  classes: ['Nursery', 'LKG', 'UKG', ...Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`)],
  streams: ['Science', 'Commerce', 'Arts/Humanities'],
  bloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
  categories: ['General', 'OBC', 'SC', 'ST', 'Other'],
  admissionTypes: ['Regular', 'RTE', 'Management', 'Transfer'],
  yesNo: ['Yes', 'No'],
  boards: ['CBSE', 'ICSE', 'GSEB'],
  mediums: ['English', 'Hindi', 'Gujarati'],
  houses: ['Red House', 'Blue House', 'Green House', 'Yellow House'],
  sections: ['A', 'B', 'C', 'D', 'E'],
  incomes: [
  { v: 'below_1l', l: 'Below 1 Lakh' },
  { v: '1l_3l', l: '1-3 Lakhs' },
  { v: '3l_5l', l: '3-5 Lakhs' },
  { v: '5l_10l', l: '5-10 Lakhs' },
  { v: 'above_10l', l: 'Above 10 Lakhs' }],

  relations: ['Uncle', 'Aunt', 'Grandparent', 'Other'],
  scholarships: [
  { v: 'merit', l: 'Merit (50%)' },
  { v: 'need', l: 'Need-based (25%)' },
  { v: 'sports', l: 'Sports Quota' },
  { v: 'rte', l: 'RTE (100%)' }],

  routes: [
  { v: 'route1', l: 'Route 1 - City Center' },
  { v: 'route2', l: 'Route 2 - North Zone' },
  { v: 'route3', l: 'Route 3 - South Zone' }],

  banks: ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Punjab National Bank', 'Bank of Baroda', 'Canara Bank', 'Kotak Mahindra Bank', 'Other'],
  accountTypes: ['Savings Account', 'Current Account', 'Joint Account'],
  teachers: [
  { name: 'Mrs. Priya Sharma', class: 'Nursery', subject: 'All Subjects' },
  { name: 'Mrs. Anjali Verma', class: 'LKG', subject: 'All Subjects' },
  { name: 'Mrs. Sunita Patel', class: 'UKG', subject: 'All Subjects' },
  { name: 'Mr. Rajesh Kumar', class: 'Class 1', subject: 'All Subjects' },
  { name: 'Mrs. Meena Gupta', class: 'Class 2', subject: 'All Subjects' },
  { name: 'Mr. Anil Singh', class: 'Class 3', subject: 'All Subjects' },
  { name: 'Mrs. Kavita Joshi', class: 'Class 4', subject: 'All Subjects' },
  { name: 'Mr. Suresh Yadav', class: 'Class 5', subject: 'All Subjects' },
  { name: 'Mrs. Rekha Mishra', class: 'Class 6', subject: 'English/Hindi' },
  { name: 'Mr. Vikram Chauhan', class: 'Class 7', subject: 'Maths/Science' },
  { name: 'Mrs. Neha Agarwal', class: 'Class 8', subject: 'Social Studies' },
  { name: 'Mr. Deepak Tiwari', class: 'Class 9', subject: 'Science' },
  { name: 'Mrs. Pooja Saxena', class: 'Class 10', subject: 'Mathematics' },
  { name: 'Mr. Rahul Mehta', class: 'Class 11', subject: 'Physics' },
  { name: 'Mrs. Shalini Kapoor', class: 'Class 12', subject: 'Chemistry' }]

};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
const generateGRNo = () => `GR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`;
const generateStudentUID = () => `STU-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 99999) + 1).padStart(5, '0')}`;
const generateRollNumber = () => String(Math.floor(Math.random() * 50) + 1);
const getCurrentDate = () => new Date().toISOString().split('T')[0];
const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
const formatDateTime = (d: string) => d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
const isHigherClass = (cls: string) => cls === 'Class 11' || cls === 'Class 12';
const formatPAN = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
const formatPEN = (value: string) => value.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 15);
const validatePAN = (pan: string) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
const validatePEN = (pen: string) => pen.length >= 5;

// ============================================================================
// INITIAL FORM DATA
// ============================================================================
const getInitialFormData = (): FormDataType => ({
  grNo: generateGRNo(),
  studentUidNo: generateStudentUID(),
  penNo: '',
  dateOfAdmission: getCurrentDate(),
  studentName: '',
  dateOfBirth: '',
  gender: '',
  nationality: 'Indian',
  bloodGroup: '',
  dobInWords: '',
  religion: '',
  caste: '',
  subCaste: '',
  motherTongue: '',
  placeOfBirth: '',
  aadharCardNo: '',
  panCardNo: '',
  socialCategory: '',
  admissionType: '',
  ews: '',
  minorityStatus: '',
  disability: '',
  disabilityType: '',
  disabilityPercentage: '',
  permanentAddress: '',
  permanentCity: '',
  permanentState: '',
  permanentPincode: '',
  sameAsPermanent: false,
  currentAddress: '',
  currentCity: '',
  currentState: '',
  currentPincode: '',
  studentMobile: '',
  studentEmail: '',
  classForAdmission: '',
  stream: '',
  section: '',
  academicYear: '2024-2025',
  medium: '',
  board: '',
  house: '',
  previousSchoolName: '',
  previousBoard: '',
  lastClassAttended: '',
  percentageGrade: '',
  tcNumber: '',
  tcIssueDate: '',
  reasonForLeaving: '',
  scholarshipEligible: false,
  selectedScheme: '',
  scholarshipRemarks: '',
  fatherName: '',
  fatherOccupation: '',
  fatherOrganization: '',
  fatherDesignation: '',
  fatherQualification: '',
  fatherAnnualIncome: '',
  fatherMobile: '',
  fatherEmail: '',
  fatherAadhar: '',
  fatherPan: '',
  motherName: '',
  motherOccupation: '',
  motherOrganization: '',
  motherDesignation: '',
  motherQualification: '',
  motherAnnualIncome: '',
  motherMobile: '',
  motherEmail: '',
  motherAadhar: '',
  motherPan: '',
  hasGuardian: false,
  guardianName: '',
  guardianRelation: '',
  guardianOccupation: '',
  guardianMobile: '',
  guardianEmail: '',
  guardianAadhar: '',
  height: '',
  weight: '',
  visionLeft: '',
  visionRight: '',
  medicalConditions: '',
  allergies: '',
  regularMedications: '',
  familyDoctorName: '',
  doctorContact: '',
  insuranceProvider: '',
  policyNumber: '',
  emergencyContactName: '',
  emergencyContactRelation: '',
  emergencyContactNumber: '',
  transportRequired: false,
  pickupPoint: '',
  preferredRoute: '',
  hostelRequired: false,
  hostelType: '',
  roomPreference: '',
  messPreference: '',
  bankAccountHolder: '',
  bankName: '',
  bankBranch: '',
  bankAccountNumber: '',
  bankIfscCode: '',
  bankAccountType: '',
  bankMicrCode: '',
  bankUpiId: '',
  consentDataAccuracy: false,
  consentRulesRegulations: false,
  consentFeePayment: false,
  consentPhotoUsage: false,
  consentMedicalEmergency: false,
  consentCommunication: false,
  parentSignatureDate: '',
  parentSignaturePlace: '',
  documents: Object.fromEntries(documentConfigs.map((d) => [d.key, null]))
});

// ============================================================================
// SAMPLE DATA
// ============================================================================
const getSampleAdmissionHistory = (): AdmissionRecord[] => [
{
  id: '1',
  grNo: 'GR-2024-0001',
  studentUidNo: 'STU-2024-00001',
  penNo: 'PEN-12345-67890',
  studentName: 'Rahul Sharma',
  classForAdmission: 'Class 5',
  section: 'A',
  house: 'Red House',
  rollNumber: '15',
  fatherName: 'Mr. Vijay Sharma',
  motherName: 'Mrs. Sunita Sharma',
  fatherMobile: '9876543210',
  fatherEmail: 'vijay.sharma@email.com',
  dateOfBirth: '2014-05-15',
  gender: 'Male',
  bloodGroup: 'B+',
  aadharCardNo: '123456789012',
  panCardNo: 'ABCDE1234F',
  permanentAddress: '123 Gandhi Nagar, Delhi',
  dateOfAdmission: '2024-01-15',
  status: 'approved',
  parentApprovedAt: '2024-01-16',
  authorityApprovedAt: '2024-01-17',
  createdAt: '2024-01-15',
  classTeacher: 'Mr. Suresh Yadav',
  medium: 'English',
  board: 'CBSE'
},
{
  id: '2',
  grNo: 'GR-2024-0002',
  studentUidNo: 'STU-2024-00002',
  penNo: 'PEN-23456-78901',
  studentName: 'Priya Patel',
  classForAdmission: 'Class 3',
  section: 'B',
  house: 'Blue House',
  rollNumber: '22',
  fatherName: 'Mr. Amit Patel',
  motherName: 'Mrs. Meera Patel',
  fatherMobile: '9876543211',
  fatherEmail: 'amit.patel@email.com',
  dateOfBirth: '2016-08-20',
  gender: 'Female',
  bloodGroup: 'O+',
  aadharCardNo: '234567890123',
  permanentAddress: '456 Nehru Street, Mumbai',
  dateOfAdmission: '2024-01-18',
  status: 'approved',
  parentApprovedAt: '2024-01-19',
  authorityApprovedAt: '2024-01-20',
  createdAt: '2024-01-18',
  classTeacher: 'Mr. Anil Singh',
  medium: 'English',
  board: 'CBSE'
},
{
  id: '3',
  grNo: 'GR-2024-0003',
  studentUidNo: 'STU-2024-00003',
  penNo: 'PEN-34567-89012',
  studentName: 'Arjun Singh',
  classForAdmission: 'Class 11',
  stream: 'Science',
  fatherName: 'Mr. Rajveer Singh',
  motherName: 'Mrs. Kamla Singh',
  fatherMobile: '9876543212',
  fatherEmail: 'rajveer.singh@email.com',
  dateOfBirth: '2008-03-10',
  gender: 'Male',
  bloodGroup: 'A+',
  permanentAddress: '789 Tagore Road, Jaipur',
  dateOfAdmission: '2024-01-20',
  status: 'pending_authority',
  parentApprovedAt: '2024-01-21',
  createdAt: '2024-01-20',
  medium: 'English',
  board: 'CBSE'
},
{
  id: '4',
  grNo: 'GR-2024-0004',
  studentUidNo: 'STU-2024-00004',
  penNo: 'PEN-45678-90123',
  studentName: 'Ananya Gupta',
  classForAdmission: 'Class 1',
  fatherName: 'Mr. Sanjay Gupta',
  motherName: 'Mrs. Priya Gupta',
  fatherMobile: '9876543213',
  fatherEmail: 'sanjay.gupta@email.com',
  dateOfBirth: '2018-11-25',
  gender: 'Female',
  bloodGroup: 'AB+',
  permanentAddress: '101 Park Avenue, Bangalore',
  dateOfAdmission: '2024-01-22',
  status: 'pending_parent',
  createdAt: '2024-01-22',
  medium: 'English',
  board: 'CBSE'
}];


// ============================================================================
// UI COMPONENTS
// ============================================================================
const Tooltip = ({ children, content }: {children: React.ReactNode;content: string;}) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show &&
      <div className="absolute z-50 px-3 py-2 text-xs text-white bg-gray-900 rounded-lg shadow-lg bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 text-center">
          {content}
          <div className="absolute w-2 h-2 bg-gray-900 rotate-45 left-1/2 -translate-x-1/2 -bottom-1" />
        </div>
      }
    </div>);

};

const FormField = ({ label, required, error, children, help, className = '' }: any) =>
<div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
      {help &&
    <Tooltip content={help}>
          <HelpCircle className="w-3.5 h-3.5 text-gray-400 inline ml-1 cursor-help" />
        </Tooltip>
    }
    </label>
    {children}
    {error &&
  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        {error}
      </p>
  }
  </div>;


const Input = ({ value, onChange, type = 'text', placeholder, disabled, className = '', maxLength }: any) =>
<input
  type={type}
  value={value}
  onChange={onChange}
  placeholder={placeholder}
  disabled={disabled}
  maxLength={maxLength}
  className={`w-full px-3 py-2 text-sm border rounded-lg transition-colors ${
  disabled ?
  'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed' :
  'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'} ${
  className}`} />;



const Select = ({ value, onChange, options, placeholder, disabled }: any) =>
<select
  value={value}
  onChange={onChange}
  disabled={disabled}
  className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white ${
  disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`
  }>

    <option value="">{placeholder || 'Select'}</option>
    {options.map((opt: any) =>
  typeof opt === 'string' ?
  <option key={opt} value={opt}>{opt}</option> :

  <option key={opt.v || opt.value} value={opt.v || opt.value}>{opt.l || opt.label}</option>

  )}
  </select>;


const SectionHeader = ({ icon: Icon, title, description, isOpen, onToggle, badge, docCount }: any) =>
<button
  type="button"
  onClick={onToggle}
  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-t-xl hover:bg-gray-50">

    <div className="flex items-center gap-3">
      <div className="p-2 bg-blue-100 rounded-lg">
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <div className="text-left">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          {badge &&
        <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">{badge}</span>
        }
          {docCount &&
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
        docCount.done === docCount.total ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`
        }>
              {docCount.done}/{docCount.total}
            </span>
        }
        </div>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
    </div>
    {isOpen ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
  </button>;


const DocUpload = ({ config, doc, onUpload, onRemove, error }: any) =>
<div className={`border rounded-xl p-4 ${
doc ? 'border-green-200 bg-green-50/30' : error ? 'border-red-200 bg-red-50/30' : 'border-gray-200 hover:border-blue-300'}`
}>
    <div className="flex items-start gap-3">
      <div className={`p-2 rounded-lg ${doc ? 'bg-green-100' : 'bg-gray-100'}`}>
        {doc ? <FileCheck className="w-6 h-6 text-green-600" /> : <FileText className="w-6 h-6 text-blue-500" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium text-gray-900">{config.label}</h4>
          {config.required &&
        <span className="px-1.5 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded">Required</span>
        }
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{config.description}</p>
        {doc ?
      <div className="mt-3">
            <div className="flex items-center gap-2 p-2 bg-white border border-green-200 rounded-lg">
              <FileText className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-700 truncate flex-1">{doc.name}</span>
              <span className="text-xs text-gray-400">{doc.size}</span>
            </div>
            <button
          type="button"
          onClick={onRemove}
          className="flex items-center gap-1 px-2 py-1 mt-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded">

              <Trash2 className="w-3.5 h-3.5" />
              Remove
            </button>
          </div> :

      <div className="mt-3">
            <input
          type="file"
          accept={config.accept}
          onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
          className="hidden"
          id={`doc-${config.key}`} />

            <label
          htmlFor={`doc-${config.key}`}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-blue-600 bg-blue-50 border-2 border-dashed border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100">

              <Upload className="w-4 h-4" />
              Click to upload
            </label>
          </div>
      }
        {error &&
      <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {error}
          </p>
      }
      </div>
    </div>
  </div>;


// ============================================================================
// QR CODE COMPONENT
// ============================================================================
const QRCode = ({ data, size = 200 }: {data: string;size?: number;}) => {
  const moduleCount = 25;
  const cellSize = size / moduleCount;
  const hash = data.split('').reduce((a, c) => (a << 5) - a + c.charCodeAt(0) | 0, 0);
  const matrix = Array.from({ length: moduleCount }, (_, row) =>
  Array.from({ length: moduleCount }, (_, col) => {
    if (row < 7 && col < 7 || row < 7 && col >= moduleCount - 7 || row >= moduleCount - 7 && col < 7) {
      if (row === 0 || row === 6 || col === 0 || col === 6 || row >= 2 && row <= 4 && col >= 2 && col <= 4) return 1;
      return 0;
    }
    if (row === 6 || col === 6) return (row + col) % 2 === 0 ? 1 : 0;
    return hash * (row + 1) * (col + 1) % 100 > 45 ? 1 : 0;
  })
  );
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="white" />
      {matrix.flatMap((row, ri) =>
      row.map((cell, ci) =>
      cell ?
      <rect
        key={`${ri}-${ci}`}
        x={ci * cellSize}
        y={ri * cellSize}
        width={cellSize}
        height={cellSize}
        fill="black" /> :

      null
      )
      )}
    </svg>);

};

// ============================================================================
// MODALS
// ============================================================================

// QR Modal
const QRModal = ({ isOpen, onClose, formData }: {isOpen: boolean;onClose: () => void;formData: FormDataType;}) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const formLink = `https://school.edu/admission-form/${formData.grNo}`;

  const handleDownloadForm = () => {
    const w = window.open('', '_blank');
    if (w) {
      w.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Admission Form - ${formData.studentName || 'Student'}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            h1 { text-align: center; color: #1e40af; margin-bottom: 30px; }
            h2 { color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-top: 30px; }
            .section { margin-bottom: 30px; }
            .field { display: flex; margin: 10px 0; padding: 8px 12px; background: #f9fafb; border-radius: 6px; }
            .label { font-weight: bold; width: 200px; color: #4b5563; }
            .value { color: #111827; }
            .header-info { display: flex; justify-content: space-between; margin-bottom: 20px; padding: 15px; background: #eff6ff; border-radius: 8px; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; }
          </style>
        </head>
        <body>
          <h1>School Admission Form</h1>
          <div class="header-info">
            <div><strong>GR No:</strong> ${formData.grNo}</div>
            <div><strong>Student UID:</strong> ${formData.studentUidNo}</div>
            <div><strong>PEN No:</strong> ${formData.penNo || 'N/A'}</div>
            <div><strong>Date:</strong> ${formatDate(formData.dateOfAdmission)}</div>
          </div>
          <div class="section">
            <h2>Personal Information</h2>
            <div class="field"><span class="label">Student Name:</span><span class="value">${formData.studentName || '-'}</span></div>
            <div class="field"><span class="label">Date of Birth:</span><span class="value">${formatDate(formData.dateOfBirth) || '-'}</span></div>
            <div class="field"><span class="label">Gender:</span><span class="value">${formData.gender || '-'}</span></div>
            <div class="field"><span class="label">Blood Group:</span><span class="value">${formData.bloodGroup || '-'}</span></div>
            <div class="field"><span class="label">Aadhar No:</span><span class="value">${formData.aadharCardNo || '-'}</span></div>
            <div class="field"><span class="label">PAN No:</span><span class="value">${formData.panCardNo || '-'}</span></div>
          </div>
          <div class="section">
            <h2>Academic Information</h2>
            <div class="field"><span class="label">Class:</span><span class="value">${formData.classForAdmission || '-'}</span></div>
            <div class="field"><span class="label">Stream:</span><span class="value">${formData.stream || 'N/A'}</span></div>
            <div class="field"><span class="label">Medium:</span><span class="value">${formData.medium || '-'}</span></div>
            <div class="field"><span class="label">Board:</span><span class="value">${formData.board || '-'}</span></div>
          </div>
          <div class="section">
            <h2>Parent Information</h2>
            <div class="field"><span class="label">Father's Name:</span><span class="value">${formData.fatherName || '-'}</span></div>
            <div class="field"><span class="label">Father's Mobile:</span><span class="value">${formData.fatherMobile || '-'}</span></div>
            <div class="field"><span class="label">Mother's Name:</span><span class="value">${formData.motherName || '-'}</span></div>
          </div>
          <div class="section">
            <h2>Address</h2>
            <div class="field"><span class="label">Permanent Address:</span><span class="value">${formData.permanentAddress || '-'}, ${formData.permanentCity || ''}, ${formData.permanentState || ''} - ${formData.permanentPincode || ''}</span></div>
          </div>
          <div class="footer">
            <p>This is a computer-generated admission form.</p>
            <p>Generated on: ${new Date().toLocaleString()}</p>
          </div>
          <script>window.onload = () => window.print()</script>
        </body>
        </html>
      `);
      w.document.close();
    }
  };

  const handleDownloadQR = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new window.Image();
    img.onload = () => {
      canvas.width = canvas.height = 300;
      ctx?.drawImage(img, 0, 0, 300, 300);
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `AdmissionForm_QR_${formData.grNo || 'Form'}.png`;
      link.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(new XMLSerializer().serializeToString(svg));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <QrCode className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">Admission Form QR Code</h2>
              <p className="text-indigo-100 text-sm">Scan to access or download form</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col items-center">
            <div ref={qrRef} className="p-6 bg-white border-2 border-gray-200 rounded-2xl shadow-inner">
              <QRCode data={formLink} size={200} />
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-lg font-semibold text-gray-900">Admission Form</h3>
              {formData.studentName &&
              <p className="text-sm text-gray-500">{formData.studentName}</p>
              }
              <p className="text-xs text-gray-400 mt-2">Scan QR code to download the admission form</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={handleDownloadForm}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">

              <Download className="w-5 h-5" />
              Download Admission Form (PDF)
            </button>
            <button
              onClick={handleDownloadQR}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200">

              <QrCode className="w-5 h-5" />
              Download QR Code
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(formLink);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200">

              {copied ?
              <>
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-green-600">Link Copied!</span>
                </> :

              <>
                  <Copy className="w-5 h-5" />
                  Copy Form Link
                </>
              }
            </button>
          </div>
        </div>
      </div>
    </div>);

};

// Student Details View Modal
const StudentDetailsModal = ({ isOpen, onClose, record }: {isOpen: boolean;onClose: () => void;record: AdmissionRecord | null;}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !record) return null;

  const teacher = OPTIONS.teachers.find((t) => t.class === record.classForAdmission);

  const handlePrint = () => {
    const w = window.open('', '_blank');
    if (w && printRef.current) {
      w.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Student Details - ${record.studentName}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            h1 { text-align: center; color: #1e40af; }
            h2 { color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            .info-item { display: flex; justify-content: space-between; padding: 8px 12px; background: #f9fafb; border-radius: 8px; }
            .label { color: #6b7280; }
            .value { font-weight: 600; color: #111827; }
          </style>
        </head>
        <body>
          ${printRef.current.innerHTML}
          <script>window.onload = () => window.print()</script>
        </body>
        </html>
      `);
      w.document.close();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8">
        <div className="p-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="w-8 h-8" />
            <div>
              <h2 className="text-xl font-bold">Student Details</h2>
              <p className="text-green-100 text-sm">Complete admission information</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div ref={printRef}>
            <div className="flex items-start gap-6 mb-6 pb-6 border-b">
              <div className="w-24 h-24 bg-blue-100 rounded-xl flex items-center justify-center">
                <User className="w-12 h-12 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900">{record.studentName}</h3>
                <p className="text-gray-500">{record.classForAdmission} {record.stream ? `(${record.stream})` : ''}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-700 rounded-full">
                    ✓ Approved
                  </span>
                  <span className="text-sm text-gray-500">Admitted on {formatDate(record.dateOfAdmission)}</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                Institutional IDs
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                ['GR No', record.grNo],
                ['Student UID', record.studentUidNo],
                ['PEN No', record.penNo],
                ['Roll Number', record.rollNumber || 'N/A']].
                map(([label, value]) =>
                <div key={label} className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className="text-sm font-semibold text-blue-800">{value}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Personal Information
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                ['Date of Birth', formatDate(record.dateOfBirth || '')],
                ['Gender', record.gender || '-'],
                ['Blood Group', record.bloodGroup || '-'],
                ['Aadhar No', record.aadharCardNo || '-'],
                ['PAN No', record.panCardNo || '-'],
                ['Address', record.permanentAddress || '-']].
                map(([label, value]) =>
                <div key={label} className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="text-gray-500 text-sm">{label}:</span>
                    <span className="font-medium text-sm">{value}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Academic Information
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                ['Class', record.classForAdmission],
                ['Stream', record.stream || 'N/A'],
                ['Section', record.section || 'N/A'],
                ['House', record.house || 'N/A'],
                ['Medium', record.medium || '-'],
                ['Board', record.board || '-']].
                map(([label, value]) =>
                <div key={label} className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="text-gray-500 text-sm">{label}:</span>
                    <span className="font-medium text-sm">{value}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                Class Teacher
              </h4>
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-purple-200 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-7 h-7 text-purple-600" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-purple-800">{record.classTeacher || teacher?.name || 'To be assigned'}</h5>
                    <p className="text-sm text-purple-600">Class Teacher - {record.classForAdmission}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Parent Information
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                ["Father's Name", record.fatherName],
                ["Mother's Name", record.motherName || '-'],
                ['Contact Number', record.fatherMobile],
                ['Email', record.fatherEmail || '-']].
                map(([label, value]) =>
                <div key={label} className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="text-gray-500 text-sm">{label}:</span>
                    <span className="font-medium text-sm">{value}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Approval Timeline
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Application Submitted</p>
                    <p className="text-xs text-gray-500">{formatDateTime(record.createdAt)}</p>
                  </div>
                </div>
                {record.parentApprovedAt &&
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <UserCheck className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Parent Approved</p>
                      <p className="text-xs text-gray-500">{formatDateTime(record.parentApprovedAt)}</p>
                    </div>
                  </div>
                }
                {record.authorityApprovedAt &&
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <BadgeCheck className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Authority Approved (Final)</p>
                      <p className="text-xs text-green-600">{formatDateTime(record.authorityApprovedAt)}</p>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t flex flex-wrap gap-3 justify-center">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">

            <Printer className="w-5 h-5" />
            Print Details
          </button>
          <button
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700">

            <Download className="w-5 h-5" />
            Download PDF
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300">

            Close
          </button>
        </div>
      </div>
    </div>);

};

// Admission History Modal
const AdmissionHistoryModal = ({
  isOpen,
  onClose



}: {isOpen: boolean;onClose: () => void;}) => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'pending_parent' | 'pending_authority' | 'approved'>('pending_parent');
  const [records] = useState<AdmissionRecord[]>(getSampleAdmissionHistory());
  const [notifying, setNotifying] = useState<string | null>(null);
  const [notified, setNotified] = useState<string[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<AdmissionRecord | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const filteredRecords = records.filter(
    (r) => (r.studentName.toLowerCase().includes(search.toLowerCase()) || r.grNo.toLowerCase().includes(search.toLowerCase())) && r.status === activeTab
  );

  const handleNotifyParent = (record: AdmissionRecord) => {
    setNotifying(record.id);
    setTimeout(() => {
      setNotifying(null);
      setNotified((prev) => [...prev, record.id]);
    }, 2000);
  };

  const handleViewDetails = (record: AdmissionRecord) => {
    setSelectedRecord(record);
    setShowDetails(true);
  };

  // Non-functional handler - does nothing
  const handleLoadAndApprove = () => {


    // This function intentionally does nothing
    // The button appears enabled but has no functionality
  };const tabs = [
  { key: 'pending_parent', label: 'Pending Parent', count: records.filter((r) => r.status === 'pending_parent').length, icon: Clock, color: 'amber' },
  { key: 'pending_authority', label: 'Pending Authority', count: records.filter((r) => r.status === 'pending_authority').length, icon: UserCheck, color: 'blue' },
  { key: 'approved', label: 'Approved', count: records.filter((r) => r.status === 'approved').length, icon: CheckCircle, color: 'green' }];


  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <History className="w-8 h-8" />
              <div>
                <h2 className="text-xl font-bold">Admission History</h2>
                <p className="text-blue-100 text-sm">View and track all admission records</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex border-b">
            {tabs.map((tab) =>
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.key ?
              `text-${tab.color}-600 border-b-2 border-${tab.color}-600 bg-${tab.color}-50` :
              'text-gray-500 hover:bg-gray-50'}`
              }>

                <tab.icon className="w-4 h-4" />
                {tab.label}
                <span className={`px-2 py-0.5 text-xs rounded-full ${
              activeTab === tab.key ? `bg-${tab.color}-100 text-${tab.color}-700` : 'bg-gray-100 text-gray-600'}`
              }>
                  {tab.count}
                </span>
              </button>
            )}
          </div>

          <div className="p-4 border-b">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or GR No..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm" />

            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {filteredRecords.length === 0 ?
            <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No records found</p>
              </div> :

            <div className="space-y-4">
                {filteredRecords.map((record) => {
                const isNotified = notified.includes(record.id);
                const isNotifying = notifying === record.id;

                return (
                  <div key={record.id} className="border rounded-xl overflow-hidden hover:border-blue-300 transition-colors">
                      <div className="p-4 bg-white">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{record.studentName}</h4>
                              <p className="text-sm text-gray-500">
                                {record.classForAdmission} {record.stream ? `(${record.stream})` : ''} • GR: {record.grNo}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                Father: {record.fatherName} • {record.fatherMobile}
                              </p>
                              <p className="text-xs text-gray-400">
                                PEN: {record.penNo}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          record.status === 'approved' ?
                          'bg-green-100 text-green-700' :
                          record.status === 'pending_authority' ?
                          'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'}`
                          }>
                              {record.status === 'approved' ?
                            'Approved' :
                            record.status === 'pending_authority' ?
                            'Awaiting Authority' :
                            'Awaiting Parent'}
                            </span>
                            <span className="text-xs text-gray-400">{formatDate(record.createdAt)}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                          {/* Pending Parent - Only notify option */}
                          {record.status === 'pending_parent' &&
                        <button
                          onClick={() => handleNotifyParent(record)}
                          disabled={isNotifying || isNotified}
                          className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg ${
                          isNotified ?
                          'bg-green-50 text-green-600' :
                          isNotifying ?
                          'bg-amber-50 text-amber-600' :
                          'text-amber-600 bg-amber-50 hover:bg-amber-100'}`
                          }>

                              {isNotifying ?
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> :
                          isNotified ?
                          <Check className="w-3.5 h-3.5" /> :

                          <Bell className="w-3.5 h-3.5" />
                          }
                              {isNotifying ? 'Sending...' : isNotified ? 'Notified!' : 'Notify Parent'}
                            </button>
                        }

                          {/* Pending Authority - View details and non-functional load button */}
                          {record.status === 'pending_authority' &&
                        <>
                              <button
                            onClick={() => handleViewDetails(record)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100">

                                <Eye className="w-3.5 h-3.5" />
                                View Details
                              </button>
                              {/* Non-functional button - looks enabled but does nothing */}
                              <button
                            onClick={handleLoadAndApprove}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 cursor-pointer">

                                <Edit3 className="w-3.5 h-3.5" />
                                Load & Approve in Form
                              </button>
                            </>
                        }

                          {/* Approved - View details button */}
                          {record.status === 'approved' &&
                        <button
                          onClick={() => handleViewDetails(record)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100">

                              <Eye className="w-3.5 h-3.5" />
                              View Student Details
                            </button>
                        }
                        </div>
                      </div>

                      {/* School info for approved records */}
                      {record.status === 'approved' &&
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-t">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                        ['Section', record.section],
                        ['Roll Number', record.rollNumber],
                        ['House', record.house],
                        ['Class Teacher', record.classTeacher]].
                        map(([label, value]) =>
                        <div key={label} className="bg-white/60 rounded-lg p-2">
                                <p className="text-xs text-gray-500">{label}</p>
                                <p className="text-sm font-semibold text-gray-800">{value || 'N/A'}</p>
                              </div>
                        )}
                          </div>
                        </div>
                    }
                    </div>);

              })}
              </div>
            }
          </div>
        </div>
      </div>

      {/* Student Details Modal */}
      <StudentDetailsModal
        isOpen={showDetails}
        onClose={() => {
          setShowDetails(false);
          setSelectedRecord(null);
        }}
        record={selectedRecord} />

    </>);

};

// Parent Approval Modal
const ParentApprovalModal = ({
  isOpen,
  onClose,
  onApprove,
  formData





}: {isOpen: boolean;onClose: () => void;onApprove: () => void;formData: FormDataType;}) => {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendApproval = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
          <div className="flex items-center gap-3">
            <UserCheck className="w-8 h-8" />
            <div>
              <h2 className="text-xl font-bold">Parent Approval Required</h2>
              <p className="text-amber-100 text-sm">Step 1 of 2: Awaiting parent confirmation</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-10 h-10 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Send Approval Request</h3>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
            {[
            ['Student Name', formData.studentName],
            ['Class', `${formData.classForAdmission}${formData.stream ? ` (${formData.stream})` : ''}`],
            ['PEN No', formData.penNo || 'Not provided'],
            ['PAN Card', formData.panCardNo || 'Not provided'],
            ['Parent Mobile', formData.fatherMobile]].
            map(([label, value]) =>
            <div key={label} className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{label}:</span>
                <span className="font-medium">{value}</span>
              </div>
            )}
          </div>

          {sent ?
          <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-green-600 font-medium mb-4">Approval request sent!</p>
              <button
              onClick={onApprove}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700">

                <Check className="w-5 h-5" />
                Simulate Parent Approval
              </button>
            </div> :

          <div className="space-y-3">
              <button
              onClick={handleSendApproval}
              disabled={sending}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 disabled:opacity-50">

                {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {sending ? 'Sending...' : 'Send Approval Request'}
              </button>
              <button
              onClick={onClose}
              className="w-full px-4 py-3 text-gray-700 bg-gray-100 rounded-xl font-medium hover:bg-gray-200">

                Cancel
              </button>
            </div>
          }
        </div>
      </div>
    </div>);

};

// Authority Approval Modal
const AuthorityApprovalModal = ({
  isOpen,
  onClose,
  onApprove,
  formData





}: {isOpen: boolean;onClose: () => void;onApprove: () => void;formData: FormDataType;}) => {
  const [approving, setApproving] = useState(false);
  const [section, setSection] = useState('');
  const [house, setHouse] = useState('');

  const handleApprove = () => {
    setApproving(true);
    setTimeout(() => {
      setApproving(false);
      onApprove();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center gap-3">
            <BadgeCheck className="w-8 h-8" />
            <div>
              <h2 className="text-xl font-bold">Authority Approval</h2>
              <p className="text-blue-100 text-sm">Step 2 of 2: Final approval required</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-800">Parent Approved</p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              {[
              ['Student Name', formData.studentName],
              ['Class', `${formData.classForAdmission}${formData.stream ? ` (${formData.stream})` : ''}`],
              ['GR No', formData.grNo],
              ['PEN No', formData.penNo || 'Not provided'],
              ['PAN Card', formData.panCardNo || 'Not provided']].
              map(([label, value]) =>
              <div key={label} className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{label}:</span>
                  <span className="font-medium">{value}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Assign Section</label>
              <Select
                value={section}
                onChange={(e: any) => setSection(e.target.value)}
                options={OPTIONS.sections}
                placeholder="Select Section" />

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Assign House</label>
              <Select
                value={house}
                onChange={(e: any) => setHouse(e.target.value)}
                options={OPTIONS.houses}
                placeholder="Select House" />

            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleApprove}
              disabled={approving}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50">

              {approving ? <Loader2 className="w-5 h-5 animate-spin" /> : <BadgeCheck className="w-5 h-5" />}
              {approving ? 'Approving...' : 'Approve Admission'}
            </button>
            <button
              onClick={onClose}
              className="w-full px-4 py-3 text-gray-700 bg-gray-100 rounded-xl font-medium hover:bg-gray-200">

              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>);

};

// Admission Confirmation Modal
const AdmissionConfirmationModal = ({
  isOpen,
  onClose,
  formData




}: {isOpen: boolean;onClose: () => void;formData: FormDataType;}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const teacher = OPTIONS.teachers.find((t) => t.class === formData.classForAdmission);

  const handlePrint = () => {
    const w = window.open('', '_blank');
    if (w && printRef.current) {
      w.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Admission - ${formData.studentName}</title>
          <style>
            body { font-family: Arial; padding: 40px; max-width: 800px; margin: 0 auto; }
            h1 { text-align: center; color: #1e40af; }
            .info-item { display: flex; justify-content: space-between; padding: 8px 12px; background: #f9fafb; border-radius: 8px; margin: 8px 0; }
          </style>
        </head>
        <body>
          ${printRef.current.innerHTML}
          <script>window.onload = () => window.print()</script>
        </body>
        </html>
      `);
      w.document.close();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8">
        <div className="p-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8" />
            <div>
              <h2 className="text-xl font-bold">Admission Confirmed!</h2>
              <p className="text-green-100 text-sm">Both parent and authority have approved</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div ref={printRef}>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-blue-800">School Name</h1>
              <h2 className="text-xl font-bold text-gray-800 mt-4">ADMISSION CONFIRMATION LETTER</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
              ['GR No', formData.grNo],
              ['Student UID', formData.studentUidNo],
              ['PEN No', formData.penNo || 'N/A'],
              ['Admission Date', formatDate(formData.dateOfAdmission)]].
              map(([label, value]) =>
              <div key={label} className="flex justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-600 text-sm">{label}:</span>
                  <span className="font-semibold text-blue-800">{value}</span>
                </div>
              )}
            </div>

            <h3 className="font-semibold text-gray-800 border-b pb-2 mb-4">Student Information</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
              ['Student Name', formData.studentName],
              ['Class', formData.classForAdmission],
              ['Stream', formData.stream || 'N/A'],
              ['Section', formData.section || 'To be assigned'],
              ['House', formData.house || 'To be assigned'],
              ['PAN Card No', formData.panCardNo || 'Not provided'],
              ['Aadhar Card No', formData.aadharCardNo],
              ['Blood Group', formData.bloodGroup]].
              map(([label, value]) =>
              <div key={label} className="flex justify-between p-2 bg-gray-50 rounded">
                  <span className="text-gray-500 text-sm">{label}:</span>
                  <span className="font-medium">{value || '-'}</span>
                </div>
              )}
            </div>

            <h3 className="font-semibold text-gray-800 border-b pb-2 mb-4">Class Teacher</h3>
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-purple-800">{teacher?.name || 'To be assigned'}</h4>
                  <p className="text-sm text-purple-600">Class Teacher - {formData.classForAdmission}</p>
                </div>
              </div>
            </div>

            <h3 className="font-semibold text-gray-800 border-b pb-2 mb-4">Parent Information</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
              ["Father's Name", formData.fatherName],
              ['Father PAN', formData.fatherPan || 'Not provided'],
              ["Mother's Name", formData.motherName],
              ['Mobile', formData.fatherMobile]].
              map(([label, value]) =>
              <div key={label} className="flex justify-between p-2 bg-gray-50 rounded">
                  <span className="text-gray-500 text-sm">{label}:</span>
                  <span className="font-medium">{value || '-'}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t flex flex-wrap gap-3 justify-center">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">

            <Printer className="w-5 h-5" />
            Print
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700">
            <Mail className="w-5 h-5" />
            Email
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300">

            Close
          </button>
        </div>
      </div>
    </div>);

};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function AdmissionForm() {
  const [formData, setFormData] = useState<FormDataType>(getInitialFormData());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{message: string;type: 'success' | 'error';} | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showParentApproval, setShowParentApproval] = useState(false);
  const [showAuthorityApproval, setShowAuthorityApproval] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [sections, setSections] = useState<Record<string, boolean>>(
    Object.fromEntries(
      ['institutional', 'personal', 'category', 'contact', 'academic', 'scholarship', 'father', 'mother', 'guardian', 'medical', 'transport', 'bank', 'consent', 'documents'].map((s) => [s, true])
    )
  );

  const toggle = (s: string) => setSections((p) => ({ ...p, [s]: !p[s] }));

  const update = (field: string, value: any) => {
    setFormData((p) => {
      const u = { ...p, [field]: value };
      if (field === 'sameAsPermanent' && value) {
        u.currentAddress = p.permanentAddress;
        u.currentCity = p.permanentCity;
        u.currentState = p.permanentState;
        u.currentPincode = p.permanentPincode;
      }
      if (field === 'classForAdmission' && !isHigherClass(value)) {
        u.stream = '';
      }
      return u;
    });
    if (errors[field]) {
      setErrors((p) => {
        const n = { ...p };
        delete n[field];
        return n;
      });
    }
  };

  const updatePAN = (field: string, value: string) => update(field, formatPAN(value));
  const updatePEN = (field: string, value: string) => update(field, formatPEN(value));

  const regenerateIds = () => {
    setFormData((p) => ({
      ...p,
      grNo: generateGRNo(),
      studentUidNo: generateStudentUID(),
      dateOfAdmission: getCurrentDate()
    }));
  };

  const uploadDoc = (key: string, file: File) => {
    setFormData((p) => ({
      ...p,
      documents: {
        ...p.documents,
        [key]: {
          name: file.name,
          size: formatFileSize(file.size),
          type: file.type,
          uploadedAt: formatDate(new Date().toISOString()),
          status: 'uploaded'
        }
      }
    }));
  };

  const removeDoc = (key: string) => {
    setFormData((p) => ({
      ...p,
      documents: { ...p.documents, [key]: null }
    }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    const req = [
    'studentName', 'dateOfBirth', 'gender', 'bloodGroup', 'aadharCardNo', 'socialCategory',
    'admissionType', 'permanentAddress', 'permanentCity', 'permanentState', 'permanentPincode',
    'classForAdmission', 'medium', 'board', 'fatherName', 'fatherMobile', 'motherName',
    'emergencyContactName', 'emergencyContactNumber'];


    req.forEach((f) => {
      if (!formData[f]?.trim?.() && !formData[f]) e[f] = 'Required';
    });

    if (isHigherClass(formData.classForAdmission) && !formData.stream) {
      e.stream = 'Required for Class 11/12';
    }

    if (formData.aadharCardNo && !/^\d{12}$/.test(formData.aadharCardNo.replace(/\s/g, ''))) {
      e.aadharCardNo = 'Invalid Aadhar';
    }

    if (formData.penNo && !validatePEN(formData.penNo)) {
      e.penNo = 'PEN must be at least 5 characters';
    }

    if (formData.panCardNo && !validatePAN(formData.panCardNo)) {
      e.panCardNo = 'Invalid PAN format (e.g., ABCDE1234F)';
    }

    if (formData.fatherPan && !validatePAN(formData.fatherPan)) {
      e.fatherPan = 'Invalid PAN format';
    }

    if (formData.motherPan && !validatePAN(formData.motherPan)) {
      e.motherPan = 'Invalid PAN format';
    }

    if (formData.fatherMobile && !/^[6-9]\d{9}$/.test(formData.fatherMobile)) {
      e.fatherMobile = 'Invalid mobile';
    }

    if (formData.bankIfscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.bankIfscCode)) {
      e.bankIfscCode = 'Invalid IFSC';
    }

    if (!formData.consentDataAccuracy) e.consentDataAccuracy = 'Required';
    if (!formData.consentRulesRegulations) e.consentRulesRegulations = 'Required';
    if (!formData.consentFeePayment) e.consentFeePayment = 'Required';

    documentConfigs.
    filter((d) => d.required && !formData.documents[d.key]).
    forEach((d) => {
      e[`doc_${d.key}`] = 'Required';
    });

    setErrors(e);
    return !Object.keys(e).length;
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const submit = () => {
    if (!validate()) {
      return showToast('Please fill all required fields', 'error');
    }
    setShowParentApproval(true);
  };

  const handleParentApproval = () => {
    setShowParentApproval(false);
    setShowAuthorityApproval(true);
  };

  const handleAuthorityApproval = () => {
    setShowAuthorityApproval(false);
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setFormData((p) => ({
        ...p,
        section: OPTIONS.sections[Math.floor(Math.random() * OPTIONS.sections.length)],
        house: OPTIONS.houses[Math.floor(Math.random() * OPTIONS.houses.length)],
        rollNumber: generateRollNumber()
      }));
      setShowConfirmation(true);
      showToast('Admission completed successfully!');
    }, 1500);
  };

  const saveDraft = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast('Draft saved!');
    }, 1000);
  };

  const uploadedDocs = Object.values(formData.documents).filter(Boolean).length;
  const requiredDocs = documentConfigs.filter((d) => d.required).length;
  const uploadedReqDocs = documentConfigs.filter((d) => d.required && formData.documents[d.key]).length;
  const consentComplete = formData.consentDataAccuracy && formData.consentRulesRegulations && formData.consentFeePayment;

  const progress = Math.round(
    (

    ['studentName', 'dateOfBirth', 'gender', 'bloodGroup', 'aadharCardNo', 'permanentAddress', 'classForAdmission', 'fatherName', 'fatherMobile', 'motherName'].
    filter((f) => formData[f]).length +

    uploadedReqDocs + (
    consentComplete ? 3 : 0)) / (
    13 + requiredDocs) * 100
  );

  const renderField = (
  label: string,
  field: string,
  opts?: {
    type?: string;
    required?: boolean;
    placeholder?: string;
    options?: any[];
    disabled?: boolean;
    className?: string;
    help?: string;
    isPAN?: boolean;
    isPEN?: boolean;
  }) =>

  <FormField label={label} required={opts?.required} error={errors[field]} className={opts?.className} help={opts?.help}>
      {opts?.options ?
    <Select
      value={formData[field]}
      onChange={(e: any) => update(field, e.target.value)}
      options={opts.options}
      placeholder={opts?.placeholder}
      disabled={opts?.disabled} /> :


    <Input
      type={opts?.type || 'text'}
      value={formData[field]}
      onChange={(e: any) => {
        if (opts?.isPAN) {
          updatePAN(field, e.target.value);
        } else if (opts?.isPEN) {
          updatePEN(field, e.target.value);
        } else if (opts?.type === 'tel') {
          update(field, e.target.value.replace(/\D/g, '').slice(0, opts?.placeholder?.includes('12') ? 12 : 10));
        } else {
          update(field, e.target.value);
        }
      }}
      placeholder={opts?.placeholder}
      disabled={opts?.disabled}
      maxLength={opts?.isPAN ? 10 : opts?.isPEN ? 15 : undefined} />

    }
    </FormField>;


  const ConsentItem = ({
    field,
    title,
    desc,
    required = false





  }: {field: string;title: string;desc: string;required?: boolean;}) =>
  <label
    className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-colors ${
    formData[field] ?
    'bg-green-50 border-green-200' :
    errors[field] ?
    'bg-red-50 border-red-200' :
    'bg-gray-50 border-gray-200'} border`
    }>

      <input
      type="checkbox"
      checked={formData[field]}
      onChange={(e) => update(field, e.target.checked)}
      className="w-5 h-5 mt-0.5 text-green-600 rounded" />

      <div>
        <p className="font-medium text-gray-900">
          {title}
          {required && <span className="text-red-500 ml-1">*</span>}
        </p>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
      {formData[field] && <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />}
    </label>;


  return (
    <div className="h-screen overflow-hidden bg-gray-50 flex flex-col">
      <style>{`.scroll::-webkit-scrollbar{width:8px}.scroll::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px}`}</style>

      {/* Toast */}
      {toast &&
      <div
        className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
        toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white`
        }>

          {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-sm font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 p-1 hover:bg-white/20 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      }

      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b px-6 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admission Form</h1>
            <p className="text-gray-500 mt-1">Complete student details for new admission</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100">

              <History className="w-4 h-4" />
              History
            </button>
            <button
              onClick={() => setShowQR(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100">

              <QrCode className="w-4 h-4" />
              Download Form
            </button>
            <button
              onClick={saveDraft}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50">

              Save Draft
            </button>
            <button
              onClick={submit}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">

              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              <Save className="w-4 h-4" />
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="flex-shrink-0 bg-white border-b px-6 py-3">
        <div className="flex items-center gap-4 text-sm flex-wrap">
          <span className="text-gray-500">Progress:</span>
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-gray-200 rounded-full">
              <div
                className={`h-full rounded-full ${
                progress >= 80 ? 'bg-green-600' : progress >= 50 ? 'bg-blue-600' : 'bg-amber-500'}`
                }
                style={{ width: `${progress}%` }} />

            </div>
            <span className="font-medium">{progress}%</span>
          </div>
          <span className="text-gray-400">|</span>
          <span className="text-gray-500">Docs: {uploadedDocs}/{documentConfigs.length}</span>
          <span className="text-gray-400">|</span>
          <span className={consentComplete ? 'text-green-600' : 'text-amber-600'}>
            Consent: {consentComplete ? 'Complete' : 'Pending'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scroll">
        <div className="max-w-6xl mx-auto p-6 space-y-6 pb-24">

          {/* 1. Institutional Details */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <SectionHeader
              icon={Building}
              title="1. Institutional Details"
              description="GR No & Student UID auto-generated, PEN is editable"
              isOpen={sections.institutional}
              onToggle={() => toggle('institutional')} />

            {sections.institutional &&
            <div className="p-6 border-t">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-500" />
                    GR No and Student UID are auto-generated. PEN Number is editable.
                  </p>
                  <button
                  onClick={regenerateIds}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">

                    <RefreshCw className="w-4 h-4" />
                    Regenerate IDs
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {renderField('GR No.', 'grNo', { disabled: true })}
                  {renderField('Student UID', 'studentUidNo', { disabled: true })}
                  {renderField('PEN No.', 'penNo', {
                  placeholder: 'Enter PEN Number',
                  isPEN: true,
                  help: 'Permanent Education Number - Enter manually'
                })}
                  {renderField('Date of Admission', 'dateOfAdmission', { type: 'date', disabled: true })}
                </div>
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                  <FileText className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">PEN Number Information</p>
                    <p className="text-xs text-amber-600">
                      The Permanent Education Number (PEN) is a unique identifier assigned to each student. 
                      Please enter the PEN if available from previous school records.
                    </p>
                  </div>
                </div>
              </div>
            }
          </div>

          {/* 2. Personal Information */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <SectionHeader
              icon={User}
              title="2. Personal Information"
              description="Name, DOB, identity details"
              isOpen={sections.personal}
              onToggle={() => toggle('personal')} />

            {sections.personal &&
            <div className="p-6 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {renderField('Student Name', 'studentName', { required: true, placeholder: 'Full name', className: 'lg:col-span-2' })}
                  {renderField('Date of Birth', 'dateOfBirth', { required: true, type: 'date' })}
                  {renderField('Gender', 'gender', { required: true, options: ['Male', 'Female', 'Other'] })}
                  {renderField('Nationality', 'nationality', { options: ['Indian', 'Other'] })}
                  {renderField('Blood Group', 'bloodGroup', { required: true, options: OPTIONS.bloodGroups })}
                  {renderField('Religion', 'religion', { placeholder: 'Religion' })}
                  {renderField('Caste', 'caste', { placeholder: 'Caste' })}
                  {renderField('Mother Tongue', 'motherTongue', { placeholder: 'Mother tongue' })}
                  {renderField('Place of Birth', 'placeOfBirth', { placeholder: 'City/Town' })}
                  {renderField('Aadhar Card No.', 'aadharCardNo', { required: true, placeholder: '12-digit Aadhar', type: 'tel' })}
                  {renderField('PAN Card No.', 'panCardNo', { placeholder: 'ABCDE1234F', isPAN: true, help: 'Format: 5 letters + 4 digits + 1 letter' })}
                </div>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">PAN Card Information</p>
                    <p className="text-xs text-blue-600">
                      PAN is optional for students. If provided, it will be used for scholarship disbursements and financial records. Format: ABCDE1234F
                    </p>
                  </div>
                </div>
              </div>
            }
          </div>

          {/* 3. Category & Reservation */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <SectionHeader
              icon={Shield}
              title="3. Category & Reservation"
              description="Social category, admission type"
              isOpen={sections.category}
              onToggle={() => toggle('category')}
              badge={formData.admissionType === 'RTE' ? 'RTE' : undefined} />

            {sections.category &&
            <div className="p-6 border-t grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {renderField('Social Category', 'socialCategory', { required: true, options: OPTIONS.categories })}
                {renderField('Admission Type', 'admissionType', { required: true, options: OPTIONS.admissionTypes })}
                {renderField('EWS', 'ews', { options: OPTIONS.yesNo })}
                {renderField('Minority Status', 'minorityStatus', { options: OPTIONS.yesNo })}
              </div>
            }
          </div>

          {/* 4. Contact Information */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <SectionHeader
              icon={MapPin}
              title="4. Contact Information"
              description="Address and contact details"
              isOpen={sections.contact}
              onToggle={() => toggle('contact')} />

            {sections.contact &&
            <div className="p-6 border-t space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">Permanent Address</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {renderField('Address', 'permanentAddress', { required: true, placeholder: 'House/Street/Area', className: 'lg:col-span-2' })}
                    {renderField('City', 'permanentCity', { required: true, placeholder: 'City' })}
                    {renderField('State', 'permanentState', { required: true, placeholder: 'State' })}
                    {renderField('Pincode', 'permanentPincode', { required: true, placeholder: 'Pincode', type: 'tel' })}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-gray-700">Current Address</h4>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                      type="checkbox"
                      checked={formData.sameAsPermanent}
                      onChange={(e) => update('sameAsPermanent', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded" />

                      <span className="text-sm text-gray-600">Same as permanent</span>
                    </label>
                  </div>
                  {!formData.sameAsPermanent &&
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {renderField('Address', 'currentAddress', { placeholder: 'House/Street/Area', className: 'lg:col-span-2' })}
                      {renderField('City', 'currentCity', { placeholder: 'City' })}
                      {renderField('State', 'currentState', { placeholder: 'State' })}
                      {renderField('Pincode', 'currentPincode', { placeholder: 'Pincode', type: 'tel' })}
                    </div>
                }
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField('Student Mobile', 'studentMobile', { placeholder: '10-digit number', type: 'tel' })}
                  {renderField('Student Email', 'studentEmail', { type: 'email', placeholder: 'email@example.com' })}
                </div>
              </div>
            }
          </div>

          {/* 5. Academic Information */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <SectionHeader
              icon={BookOpen}
              title="5. Academic Information"
              description="Class, medium, previous school"
              isOpen={sections.academic}
              onToggle={() => toggle('academic')}
              badge={isHigherClass(formData.classForAdmission) ? formData.stream : undefined} />

            {sections.academic &&
            <div className="p-6 border-t space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {renderField('Class for Admission', 'classForAdmission', { required: true, options: OPTIONS.classes })}
                  {isHigherClass(formData.classForAdmission) &&
                <FormField label="Stream" required error={errors.stream}>
                      <Select
                    value={formData.stream}
                    onChange={(e: any) => update('stream', e.target.value)}
                    options={OPTIONS.streams}
                    placeholder="Select Stream" />

                    </FormField>
                }
                  {renderField('Academic Year', 'academicYear', { disabled: true })}
                  {renderField('Medium', 'medium', { required: true, options: OPTIONS.mediums })}
                  {renderField('Board', 'board', { required: true, options: OPTIONS.boards })}
                </div>
                {isHigherClass(formData.classForAdmission) &&
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Stream Selection Required</p>
                      <p className="text-xs text-amber-600">For Class 11 and 12, please select the appropriate stream</p>
                    </div>
                  </div>
              }
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <School className="w-4 h-4 text-blue-600" />
                    Previous School Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {renderField('Previous School Name', 'previousSchoolName', { placeholder: 'Full school name', className: 'lg:col-span-2' })}
                    {renderField('Board', 'previousBoard', { options: OPTIONS.boards })}
                    {renderField('Last Class Studied', 'lastClassAttended', { placeholder: 'Class/Grade' })}
                    {renderField('Percentage / Grade', 'percentageGrade', { placeholder: '85% or A+' })}
                    {renderField('TC Number', 'tcNumber', { placeholder: 'Transfer Certificate No.' })}
                  </div>
                </div>
              </div>
            }
          </div>

          {/* 6. Scholarship */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <SectionHeader
              icon={Award}
              title="6. Scholarship"
              description="Eligibility and scheme"
              isOpen={sections.scholarship}
              onToggle={() => toggle('scholarship')} />

            {sections.scholarship &&
            <div className="p-6 border-t">
                <label className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-lg cursor-pointer hover:bg-blue-100">
                  <input
                  type="checkbox"
                  checked={formData.scholarshipEligible}
                  onChange={(e) => update('scholarshipEligible', e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded" />

                  <div>
                    <p className="font-medium text-gray-900">Scholarship Eligible</p>
                    <p className="text-sm text-gray-500">Check if eligible</p>
                  </div>
                </label>
                {formData.scholarshipEligible &&
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pl-4 border-l-4 border-blue-200">
                    {renderField('Selected Scheme', 'selectedScheme', { options: OPTIONS.scholarships })}
                  </div>
              }
              </div>
            }
          </div>

          {/* 7. Father's Details */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <SectionHeader
              icon={User}
              title="7. Father's Details"
              description="Personal and contact info"
              isOpen={sections.father}
              onToggle={() => toggle('father')} />

            {sections.father &&
            <div className="p-6 border-t grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {renderField("Father's Name", 'fatherName', { required: true, placeholder: 'Full name' })}
                {renderField('Occupation', 'fatherOccupation', { placeholder: 'Business/Service' })}
                {renderField('Organization', 'fatherOrganization', { placeholder: 'Company' })}
                {renderField('Qualification', 'fatherQualification', { placeholder: 'Qualification' })}
                {renderField('Annual Income', 'fatherAnnualIncome', { options: OPTIONS.incomes })}
                {renderField('Mobile', 'fatherMobile', { required: true, placeholder: '10-digit', type: 'tel' })}
                {renderField('Email', 'fatherEmail', { type: 'email', placeholder: 'email@example.com' })}
                {renderField('Aadhar', 'fatherAadhar', { placeholder: '12-digit', type: 'tel' })}
                {renderField('PAN Card No.', 'fatherPan', { placeholder: 'ABCDE1234F', isPAN: true, help: 'Required for tax benefits' })}
              </div>
            }
          </div>

          {/* 8. Mother's Details */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <SectionHeader
              icon={User}
              title="8. Mother's Details"
              description="Personal and contact info"
              isOpen={sections.mother}
              onToggle={() => toggle('mother')} />

            {sections.mother &&
            <div className="p-6 border-t grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {renderField("Mother's Name", 'motherName', { required: true, placeholder: 'Full name' })}
                {renderField('Occupation', 'motherOccupation', { placeholder: 'Homemaker/Job' })}
                {renderField('Qualification', 'motherQualification', { placeholder: 'Qualification' })}
                {renderField('Mobile', 'motherMobile', { placeholder: '10-digit', type: 'tel' })}
                {renderField('Email', 'motherEmail', { type: 'email', placeholder: 'email@example.com' })}
                {renderField('Aadhar', 'motherAadhar', { placeholder: '12-digit', type: 'tel' })}
                {renderField('PAN Card No.', 'motherPan', { placeholder: 'ABCDE1234F', isPAN: true, help: 'Required for tax benefits' })}
              </div>
            }
          </div>

          {/* 9. Guardian Details */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <SectionHeader
              icon={Users}
              title="9. Guardian Details"
              description="If applicable"
              isOpen={sections.guardian}
              onToggle={() => toggle('guardian')} />

            {sections.guardian &&
            <div className="p-6 border-t">
                <label className="flex items-center gap-3 p-4 bg-gray-50 border rounded-lg cursor-pointer hover:bg-gray-100 mb-4">
                  <input
                  type="checkbox"
                  checked={formData.hasGuardian}
                  onChange={(e) => update('hasGuardian', e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded" />

                  <div>
                    <p className="font-medium text-gray-900">Add Guardian</p>
                    <p className="text-sm text-gray-500">Other than parents</p>
                  </div>
                </label>
                {formData.hasGuardian &&
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-4 border-l-4 border-gray-200">
                    {renderField('Name', 'guardianName', { placeholder: 'Full name' })}
                    {renderField('Relation', 'guardianRelation', { options: OPTIONS.relations })}
                    {renderField('Mobile', 'guardianMobile', { placeholder: '10-digit', type: 'tel' })}
                  </div>
              }
              </div>
            }
          </div>

          {/* 10. Medical Information */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <SectionHeader
              icon={Heart}
              title="10. Medical Information"
              description="Health and emergency"
              isOpen={sections.medical}
              onToggle={() => toggle('medical')} />

            {sections.medical &&
            <div className="p-6 border-t space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {renderField('Height', 'height', { placeholder: '145 cm' })}
                  {renderField('Weight', 'weight', { placeholder: '40 kg' })}
                  {renderField('Vision (L)', 'visionLeft', { placeholder: '6/6' })}
                  {renderField('Vision (R)', 'visionRight', { placeholder: '6/6' })}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {renderField('Medical Conditions', 'medicalConditions', { placeholder: 'Asthma, Diabetes' })}
                  {renderField('Allergies', 'allergies', { placeholder: 'Peanuts, Dust' })}
                  {renderField('Medications', 'regularMedications', { placeholder: 'Inhaler' })}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">Emergency Contact</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {renderField('Contact Name', 'emergencyContactName', { required: true, placeholder: 'Name' })}
                    {renderField('Relation', 'emergencyContactRelation', { placeholder: 'Father/Uncle' })}
                    {renderField('Contact Number', 'emergencyContactNumber', { required: true, placeholder: '10-digit', type: 'tel' })}
                  </div>
                </div>
              </div>
            }
          </div>

          {/* 11. Transport & Hostel */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <SectionHeader
              icon={Bus}
              title="11. Transport & Hostel"
              description="School facilities"
              isOpen={sections.transport}
              onToggle={() => toggle('transport')} />

            {sections.transport &&
            <div className="p-6 border-t space-y-6">
                <label className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-100 rounded-lg cursor-pointer hover:bg-orange-100">
                  <input
                  type="checkbox"
                  checked={formData.transportRequired}
                  onChange={(e) => update('transportRequired', e.target.checked)}
                  className="w-5 h-5 text-orange-600 rounded" />

                  <Bus className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-gray-900">Transport Required</p>
                  </div>
                </label>
                {formData.transportRequired &&
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-4 border-orange-200">
                    {renderField('Pickup Point', 'pickupPoint', { placeholder: 'Location' })}
                    {renderField('Route', 'preferredRoute', { options: OPTIONS.routes })}
                  </div>
              }
                <label className="flex items-center gap-3 p-4 bg-purple-50 border border-purple-100 rounded-lg cursor-pointer hover:bg-purple-100">
                  <input
                  type="checkbox"
                  checked={formData.hostelRequired}
                  onChange={(e) => update('hostelRequired', e.target.checked)}
                  className="w-5 h-5 text-purple-600 rounded" />

                  <Home className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Hostel Required</p>
                  </div>
                </label>
              </div>
            }
          </div>

          {/* 12. Bank Details */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <SectionHeader
              icon={Landmark}
              title="12. Parent's Bank Details"
              description="For payments and refunds"
              isOpen={sections.bank}
              onToggle={() => toggle('bank')} />

            {sections.bank &&
            <div className="p-6 border-t space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Bank Account Information</h4>
                    <p className="text-sm text-blue-700">Used for scholarships and refunds</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {renderField('Account Holder', 'bankAccountHolder', { placeholder: 'Name as per bank', className: 'lg:col-span-2' })}
                  {renderField('Account Type', 'bankAccountType', { options: OPTIONS.accountTypes })}
                  {renderField('Bank Name', 'bankName', { options: OPTIONS.banks })}
                  {renderField('Branch', 'bankBranch', { placeholder: 'Branch name' })}
                  {renderField('Account Number', 'bankAccountNumber', { placeholder: 'Account number', type: 'tel' })}
                  {renderField('IFSC Code', 'bankIfscCode', { placeholder: 'SBIN0001234', help: '11-character IFSC' })}
                  {renderField('UPI ID', 'bankUpiId', { placeholder: 'name@upi' })}
                </div>
              </div>
            }
          </div>

          {/* 13. Consent & Acknowledgement */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <SectionHeader
              icon={FileSignature}
              title="13. Consent & Acknowledgement"
              description="Parent/Guardian consent required"
              isOpen={sections.consent}
              onToggle={() => toggle('consent')}
              badge={consentComplete ? 'Complete' : 'Required'} />

            {sections.consent &&
            <div className="p-6 border-t space-y-4">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-900">Consent Required</h4>
                    <p className="text-sm text-amber-700">Mandatory items must be accepted</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <ConsentItem
                  field="consentDataAccuracy"
                  title="Data Accuracy Declaration"
                  desc="I declare that all information is true and accurate."
                  required />

                  <ConsentItem
                  field="consentRulesRegulations"
                  title="Rules & Regulations"
                  desc="I agree to abide by school rules."
                  required />

                  <ConsentItem
                  field="consentFeePayment"
                  title="Fee Payment Agreement"
                  desc="I agree to pay all fees on time."
                  required />

                  <ConsentItem
                  field="consentPhotoUsage"
                  title="Photo/Video Usage"
                  desc="I consent to use of photos for school publications." />

                  <ConsentItem
                  field="consentMedicalEmergency"
                  title="Medical Emergency Authorization"
                  desc="I authorize medical action in emergencies." />

                  <ConsentItem
                  field="consentCommunication"
                  title="Communication Consent"
                  desc="I consent to receive SMS, email, WhatsApp communications." />

                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  {renderField('Place', 'parentSignaturePlace', { placeholder: 'City name' })}
                  {renderField('Date', 'parentSignatureDate', { type: 'date' })}
                </div>
              </div>
            }
          </div>

          {/* 14. Document Upload */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <SectionHeader
              icon={Paperclip}
              title="14. Document Upload"
              description="Required documents"
              isOpen={sections.documents}
              onToggle={() => toggle('documents')}
              docCount={{ done: uploadedDocs, total: documentConfigs.length }} />

            {sections.documents &&
            <div className="p-6 border-t space-y-6">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileCheck className="w-6 h-6 text-blue-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Upload Progress</h4>
                      <p className="text-sm text-gray-600">
                        {uploadedDocs}/{documentConfigs.length} uploaded ({uploadedReqDocs}/{requiredDocs} required)
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(uploadedDocs / documentConfigs.length * 100)}%
                    </div>
                    <div className="w-32 h-2 bg-blue-200 rounded-full mt-1">
                      <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${uploadedDocs / documentConfigs.length * 100}%` }} />

                    </div>
                  </div>
                </div>

                {['photo', 'identity', 'academic', 'certificate', 'bank', 'other'].map((cat) => {
                const docs = documentConfigs.filter((d) => d.category === cat);
                if (!docs.length) return null;
                const icons: Record<string, any> = {
                  photo: Camera,
                  identity: Shield,
                  academic: BookOpen,
                  certificate: Award,
                  bank: Landmark,
                  other: FileText
                };
                const Icon = icons[cat] || FileText;
                return (
                  <div key={cat}>
                      <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2 capitalize">
                        <Icon className="w-4 h-4 text-blue-600" />
                        {cat === 'other' ? 'Other Documents' : `${cat} Documents`}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {docs.map((config) =>
                      <DocUpload
                        key={config.key}
                        config={config}
                        doc={formData.documents[config.key]}
                        onUpload={(f: File) => uploadDoc(config.key, f)}
                        onRemove={() => removeDoc(config.key)}
                        error={errors[`doc_${config.key}`]} />

                      )}
                      </div>
                    </div>);

              })}
              </div>
            }
          </div>

          {/* Submit Section */}
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="text-sm text-gray-500">By submitting, you confirm all information is accurate.</p>
                <p className="text-xs text-gray-400 mt-1">
                  <span className="text-red-500">*</span> fields are mandatory | Requires parent + authority approval
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button
                  onClick={saveDraft}
                  disabled={saving}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 border rounded-lg hover:bg-gray-200 disabled:opacity-50">

                  Save Draft
                </button>
                <button
                  onClick={submit}
                  disabled={saving || !consentComplete}
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">

                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <ArrowRight className="w-4 h-4" />
                  Submit for Approval
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <QRModal isOpen={showQR} onClose={() => setShowQR(false)} formData={formData} />
      <AdmissionHistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)} />

      <ParentApprovalModal
        isOpen={showParentApproval}
        onClose={() => setShowParentApproval(false)}
        onApprove={handleParentApproval}
        formData={formData} />

      <AuthorityApprovalModal
        isOpen={showAuthorityApproval}
        onClose={() => setShowAuthorityApproval(false)}
        onApprove={handleAuthorityApproval}
        formData={formData} />

      <AdmissionConfirmationModal
        isOpen={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          setFormData(getInitialFormData());
        }}
        formData={formData} />

    </div>);

}