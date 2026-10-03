import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import {
  SearchIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  UserIcon,
  EyeIcon,
  DownloadIcon,
  ShieldCheckIcon,
  RotateCcwIcon,
  SaveIcon,
  ArrowLeftIcon,
  FileTextIcon,
  CameraIcon,
  UploadIcon,
  AlertTriangleIcon,
  CheckIcon,
  XIcon,
  EditIcon,
  ImageIcon,
  FilterIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PrinterIcon,
  RefreshCwIcon,
  ClipboardCheckIcon,
  InfoIcon } from
'lucide-react';

// Types
interface UploadedDocument {
  name: string;
  key: string;
  submitted: boolean;
  verified: boolean;
  verifiedBy?: string;
  verifiedDate?: string;
  remarks?: string;
  fileName?: string;
  fileSize?: string;
  category: 'identity' | 'academic' | 'photo' | 'certificate' | 'other';
  required: boolean;
  linkedFields?: string[];
}

interface ValidationWarning {
  type: 'missing' | 'mismatch' | 'invalid' | 'incomplete';
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  linkedDocument?: string;
}

interface Student {
  id: string;
  grNo: string;
  suId: string;
  penNo: string;
  dateOfAdmission: string;
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string;
  dobInWords: string;
  gender: string;
  nationality: string;
  bloodGroup: string;
  religion: string;
  caste: string;
  subCaste: string;
  category: string;
  motherTongue: string;
  placeOfBirth: string;
  aadharNo: string;
  panCardNo: string;
  photo: string | null;
  socialCategory: string;
  admissionType: string;
  ews: string;
  rte: string;
  minorityStatus: string;
  disability: string;
  disabilityType: string;
  disabilityPercentage: string;
  rteApplicationNumber: string;
  rteApprovalOrder: string;
  rteIncomeCertificate: string;
  ewsIncomeCertificate: string;
  ewsIssuingAuthority: string;
  ewsCertificateNumber: string;
  ewsValidUpto: string;
  minorityCertificate: string;
  minorityCertificateNumber: string;
  minorityType: string;
  currentAddress: string;
  currentCity: string;
  currentState: string;
  currentPincode: string;
  permanentAddress: string;
  permanentCity: string;
  permanentState: string;
  permanentPincode: string;
  sameAsPermanent: boolean;
  studentMobile: string;
  studentEmail: string;
  class: string;
  section: string;
  rollNo: string;
  department: string;
  academicYear: string;
  medium: string;
  board: string;
  house: string;
  previousSchoolName: string;
  previousBoard: string;
  lastClassAttended: string;
  percentageGrade: string;
  tcNumber: string;
  tcDate: string;
  scholarshipEligible: boolean;
  selectedScheme: string;
  scholarshipRemarks: string;
  fatherName: string;
  fatherOccupation: string;
  fatherOrganization: string;
  fatherDesignation: string;
  fatherQualification: string;
  fatherAnnualIncome: string;
  fatherMobile: string;
  fatherEmail: string;
  fatherAadhar: string;
  motherName: string;
  motherOccupation: string;
  motherOrganization: string;
  motherDesignation: string;
  motherQualification: string;
  motherAnnualIncome: string;
  motherMobile: string;
  motherEmail: string;
  motherAadhar: string;
  hasGuardian: boolean;
  guardianName: string;
  guardianRelation: string;
  guardianOccupation: string;
  guardianMobile: string;
  guardianEmail: string;
  guardianAadhar: string;
  height: string;
  weight: string;
  visionLeft: string;
  visionRight: string;
  medicalConditions: string;
  allergies: string;
  regularMedications: string;
  familyDoctorName: string;
  doctorContact: string;
  insuranceProvider: string;
  policyNumber: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactNumber: string;
  transportRequired: boolean;
  pickupPoint: string;
  preferredRoute: string;
  hostelRequired: boolean;
  hostelType: string;
  roomPreference: string;
  messPreference: string;
  verificationStatus: 'Verified' | 'Partial' | 'Pending';
  verifiedFields: number;
  totalFields: number;
  documents: UploadedDocument[];
}

// Document configurations with linked fields
const documentConfigs: Omit<UploadedDocument, 'submitted' | 'verified'>[] = [
{ name: 'Student Passport Photo', key: 'studentPhoto', category: 'photo', required: true, linkedFields: ['photo'] },
{ name: 'Birth Certificate', key: 'birthCertificate', category: 'identity', required: true, linkedFields: ['dateOfBirth', 'placeOfBirth', 'fullName'] },
{ name: 'Aadhar Card (Student)', key: 'aadharCardStudent', category: 'identity', required: true, linkedFields: ['aadharNo', 'fullName', 'dateOfBirth'] },
{ name: 'Aadhar Card (Father)', key: 'aadharCardFather', category: 'identity', required: true, linkedFields: ['fatherAadhar', 'fatherName'] },
{ name: 'Aadhar Card (Mother)', key: 'aadharCardMother', category: 'identity', required: true, linkedFields: ['motherAadhar', 'motherName'] },
{ name: 'Transfer Certificate', key: 'transferCertificate', category: 'academic', required: false, linkedFields: ['tcNumber', 'tcDate', 'previousSchoolName'] },
{ name: 'Character Certificate', key: 'characterCertificate', category: 'academic', required: false },
{ name: 'Previous Marksheet', key: 'previousMarksheet', category: 'academic', required: false, linkedFields: ['percentageGrade', 'lastClassAttended'] },
{ name: 'Caste Certificate', key: 'casteCertificate', category: 'certificate', required: false, linkedFields: ['caste', 'category'] },
{ name: 'Income Certificate', key: 'incomeCertificate', category: 'certificate', required: false, linkedFields: ['fatherAnnualIncome'] },
{ name: 'Domicile Certificate', key: 'domicileCertificate', category: 'certificate', required: false },
{ name: 'Migration Certificate', key: 'migrationCertificate', category: 'academic', required: false },
{ name: 'Medical Fitness Certificate', key: 'medicalFitnessCertificate', category: 'certificate', required: false, linkedFields: ['medicalConditions'] },
{ name: 'Address Proof', key: 'addressProof', category: 'identity', required: true, linkedFields: ['currentAddress', 'currentCity', 'currentState', 'currentPincode'] },
{ name: 'Parent/Guardian Photo', key: 'parentPhoto', category: 'photo', required: false },
{ name: 'Student Signature', key: 'signatureStudent', category: 'other', required: false },
{ name: 'Parent Signature', key: 'signatureParent', category: 'other', required: true },
{ name: 'EWS Certificate', key: 'ewsCertificate', category: 'certificate', required: false, linkedFields: ['ewsCertificateNumber', 'ewsValidUpto'] },
{ name: 'Minority Certificate', key: 'minorityCertificateDoc', category: 'certificate', required: false, linkedFields: ['minorityCertificateNumber', 'minorityType'] },
{ name: 'Disability Certificate', key: 'disabilityCertificate', category: 'certificate', required: false, linkedFields: ['disabilityType', 'disabilityPercentage'] },
{ name: 'RTE Approval Order', key: 'rteApprovalOrderDoc', category: 'certificate', required: false, linkedFields: ['rteApplicationNumber'] }];


// Mock Student Data
const studentsData: Student[] = [
{
  id: '1',
  grNo: 'GR-2024-001',
  suId: 'SU-2024-001',
  penNo: 'PEN-2024-001',
  dateOfAdmission: '2024-04-01',
  firstName: 'Aarav',
  middleName: 'Kumar',
  lastName: 'Sharma',
  fullName: 'Aarav Kumar Sharma',
  dateOfBirth: '2008-05-15',
  dobInWords: 'Fifteenth May Two Thousand Eight',
  gender: 'Male',
  nationality: 'Indian',
  bloodGroup: 'B+',
  religion: 'Hindu',
  caste: 'Brahmin',
  subCaste: 'Sharma',
  category: 'General',
  motherTongue: 'Hindi',
  placeOfBirth: 'Mumbai',
  aadharNo: '1234-5678-9012',
  panCardNo: '',
  photo: '/api/placeholder/150/150',
  socialCategory: 'General',
  admissionType: 'Regular',
  ews: 'No',
  rte: 'No',
  minorityStatus: 'No',
  disability: 'No',
  disabilityType: '',
  disabilityPercentage: '',
  rteApplicationNumber: '',
  rteApprovalOrder: '',
  rteIncomeCertificate: '',
  ewsIncomeCertificate: '',
  ewsIssuingAuthority: '',
  ewsCertificateNumber: '',
  ewsValidUpto: '',
  minorityCertificate: '',
  minorityCertificateNumber: '',
  minorityType: '',
  currentAddress: '45, Green Park Colony, Near City Mall',
  currentCity: 'Mumbai',
  currentState: 'Maharashtra',
  currentPincode: '400001',
  permanentAddress: '45, Green Park Colony, Near City Mall',
  permanentCity: 'Mumbai',
  permanentState: 'Maharashtra',
  permanentPincode: '400001',
  sameAsPermanent: true,
  studentMobile: '9876543210',
  studentEmail: 'aarav.sharma@email.com',
  class: '10',
  section: 'A',
  rollNo: '01',
  department: 'Science',
  academicYear: '2024-2025',
  medium: 'English',
  board: 'CBSE',
  house: 'Blue House',
  previousSchoolName: 'St. Xavier School',
  previousBoard: 'CBSE',
  lastClassAttended: '9th',
  percentageGrade: '92%',
  tcNumber: 'TC-2024-001',
  tcDate: '2024-03-15',
  scholarshipEligible: false,
  selectedScheme: '',
  scholarshipRemarks: '',
  fatherName: 'Rajesh Kumar Sharma',
  fatherOccupation: 'Engineer',
  fatherOrganization: 'Tata Consultancy Services',
  fatherDesignation: 'Senior Manager',
  fatherQualification: 'B.Tech',
  fatherAnnualIncome: '5l_10l',
  fatherMobile: '9876543211',
  fatherEmail: 'rajesh.sharma@email.com',
  fatherAadhar: '2345-6789-0123',
  motherName: 'Priya Sharma',
  motherOccupation: 'Teacher',
  motherOrganization: 'DPS School',
  motherDesignation: 'PGT',
  motherQualification: 'M.A.',
  motherAnnualIncome: '3l_5l',
  motherMobile: '9876543212',
  motherEmail: 'priya.sharma@email.com',
  motherAadhar: '3456-7890-1234',
  hasGuardian: false,
  guardianName: '',
  guardianRelation: '',
  guardianOccupation: '',
  guardianMobile: '',
  guardianEmail: '',
  guardianAadhar: '',
  height: '155 cm',
  weight: '45 kg',
  visionLeft: '6/6',
  visionRight: '6/6',
  medicalConditions: 'None',
  allergies: 'None',
  regularMedications: 'None',
  familyDoctorName: 'Dr. Suresh Gupta',
  doctorContact: '9876543200',
  insuranceProvider: 'Star Health',
  policyNumber: 'SH-2024-001234',
  emergencyContactName: 'Rajesh Sharma',
  emergencyContactRelation: 'Father',
  emergencyContactNumber: '9876543211',
  transportRequired: true,
  pickupPoint: 'Green Park Main Gate',
  preferredRoute: 'Route 2 - North Zone',
  hostelRequired: false,
  hostelType: '',
  roomPreference: '',
  messPreference: '',
  verificationStatus: 'Verified',
  verifiedFields: 85,
  totalFields: 85,
  documents: [
  { name: 'Student Passport Photo', key: 'studentPhoto', submitted: true, verified: true, verifiedBy: 'Admin', verifiedDate: '15 Mar 2024', category: 'photo', required: true },
  { name: 'Birth Certificate', key: 'birthCertificate', submitted: true, verified: true, verifiedBy: 'Admin', verifiedDate: '15 Mar 2024', category: 'identity', required: true },
  { name: 'Aadhar Card (Student)', key: 'aadharCardStudent', submitted: true, verified: true, verifiedBy: 'Admin', verifiedDate: '15 Mar 2024', category: 'identity', required: true },
  { name: 'Aadhar Card (Father)', key: 'aadharCardFather', submitted: true, verified: true, verifiedBy: 'Admin', verifiedDate: '15 Mar 2024', category: 'identity', required: true },
  { name: 'Aadhar Card (Mother)', key: 'aadharCardMother', submitted: true, verified: true, verifiedBy: 'Admin', verifiedDate: '15 Mar 2024', category: 'identity', required: true },
  { name: 'Transfer Certificate', key: 'transferCertificate', submitted: true, verified: true, verifiedBy: 'Admin', verifiedDate: '15 Mar 2024', category: 'academic', required: false },
  { name: 'Previous Marksheet', key: 'previousMarksheet', submitted: true, verified: true, verifiedBy: 'Admin', verifiedDate: '15 Mar 2024', category: 'academic', required: false },
  { name: 'Address Proof', key: 'addressProof', submitted: true, verified: true, verifiedBy: 'Admin', verifiedDate: '15 Mar 2024', category: 'identity', required: true },
  { name: 'Parent Signature', key: 'signatureParent', submitted: true, verified: true, verifiedBy: 'Admin', verifiedDate: '15 Mar 2024', category: 'other', required: true }]

},
{
  id: '2',
  grNo: 'GR-2024-002',
  suId: 'SU-2024-002',
  penNo: 'PEN-2024-002',
  dateOfAdmission: '2024-04-01',
  firstName: 'Priya',
  middleName: '',
  lastName: 'Patel',
  fullName: 'Priya Patel',
  dateOfBirth: '2008-08-22',
  dobInWords: '',
  gender: 'Female',
  nationality: 'Indian',
  bloodGroup: 'A+',
  religion: 'Hindu',
  caste: 'Patel',
  subCaste: 'Kadva Patel',
  category: 'OBC',
  motherTongue: 'Gujarati',
  placeOfBirth: 'Ahmedabad',
  aadharNo: '2345-6789-0123',
  panCardNo: '',
  photo: null,
  socialCategory: 'OBC',
  admissionType: 'RTE',
  ews: 'No',
  rte: 'Yes',
  minorityStatus: 'No',
  disability: 'No',
  disabilityType: '',
  disabilityPercentage: '',
  rteApplicationNumber: 'RTE-2024-5678',
  rteApprovalOrder: 'Uploaded',
  rteIncomeCertificate: 'Uploaded',
  ewsIncomeCertificate: '',
  ewsIssuingAuthority: '',
  ewsCertificateNumber: '',
  ewsValidUpto: '',
  minorityCertificate: '',
  minorityCertificateNumber: '',
  minorityType: '',
  currentAddress: '12, Sunrise Apartments, MG Road',
  currentCity: 'Pune',
  currentState: 'Maharashtra',
  currentPincode: '411001',
  permanentAddress: '',
  permanentCity: '',
  permanentState: '',
  permanentPincode: '',
  sameAsPermanent: false,
  studentMobile: '',
  studentEmail: '',
  class: '10',
  section: 'B',
  rollNo: '15',
  department: 'Commerce',
  academicYear: '2024-2025',
  medium: 'English',
  board: 'State Board',
  house: '',
  previousSchoolName: 'Modern School',
  previousBoard: 'State Board',
  lastClassAttended: '9th',
  percentageGrade: '85%',
  tcNumber: '',
  tcDate: '',
  scholarshipEligible: true,
  selectedScheme: 'rte',
  scholarshipRemarks: 'RTE Quota admission',
  fatherName: 'Suresh Patel',
  fatherOccupation: 'Business',
  fatherOrganization: 'Self Employed',
  fatherDesignation: 'Owner',
  fatherQualification: 'B.Com',
  fatherAnnualIncome: '1l_3l',
  fatherMobile: '9876543220',
  fatherEmail: '',
  fatherAadhar: '4567-8901-2345',
  motherName: 'Kavita Patel',
  motherOccupation: 'Homemaker',
  motherOrganization: '',
  motherDesignation: '',
  motherQualification: '12th',
  motherAnnualIncome: '',
  motherMobile: '9876543221',
  motherEmail: '',
  motherAadhar: '',
  hasGuardian: false,
  guardianName: '',
  guardianRelation: '',
  guardianOccupation: '',
  guardianMobile: '',
  guardianEmail: '',
  guardianAadhar: '',
  height: '150 cm',
  weight: '42 kg',
  visionLeft: '6/6',
  visionRight: '6/9',
  medicalConditions: '',
  allergies: '',
  regularMedications: '',
  familyDoctorName: '',
  doctorContact: '',
  insuranceProvider: '',
  policyNumber: '',
  emergencyContactName: 'Suresh Patel',
  emergencyContactRelation: 'Father',
  emergencyContactNumber: '9876543220',
  transportRequired: false,
  pickupPoint: '',
  preferredRoute: '',
  hostelRequired: false,
  hostelType: '',
  roomPreference: '',
  messPreference: '',
  verificationStatus: 'Partial',
  verifiedFields: 55,
  totalFields: 85,
  documents: [
  { name: 'Birth Certificate', key: 'birthCertificate', submitted: true, verified: true, verifiedBy: 'Staff', verifiedDate: '10 Mar 2024', category: 'identity', required: true },
  { name: 'Aadhar Card (Student)', key: 'aadharCardStudent', submitted: true, verified: true, verifiedBy: 'Staff', verifiedDate: '10 Mar 2024', category: 'identity', required: true },
  { name: 'Aadhar Card (Father)', key: 'aadharCardFather', submitted: true, verified: true, verifiedBy: 'Staff', verifiedDate: '10 Mar 2024', category: 'identity', required: true },
  { name: 'Caste Certificate', key: 'casteCertificate', submitted: true, verified: true, verifiedBy: 'Staff', verifiedDate: '10 Mar 2024', category: 'certificate', required: false },
  { name: 'Income Certificate', key: 'incomeCertificate', submitted: true, verified: true, verifiedBy: 'Staff', verifiedDate: '10 Mar 2024', category: 'certificate', required: false },
  { name: 'RTE Approval Order', key: 'rteApprovalOrderDoc', submitted: true, verified: false, remarks: 'Pending verification', category: 'certificate', required: false },
  { name: 'Medical Fitness Certificate', key: 'medicalFitnessCertificate', submitted: true, verified: false, remarks: 'Pending verification', category: 'certificate', required: false }]

},
{
  id: '3',
  grNo: 'GR-2024-003',
  suId: 'SU-2024-003',
  penNo: '',
  dateOfAdmission: '2024-04-05',
  firstName: 'Rohan',
  middleName: 'Vijay',
  lastName: 'Desai',
  fullName: 'Rohan Vijay Desai',
  dateOfBirth: '2009-03-10',
  dobInWords: '',
  gender: 'Male',
  nationality: 'Indian',
  bloodGroup: 'O+',
  religion: 'Hindu',
  caste: 'Desai',
  subCaste: '',
  category: 'General',
  motherTongue: 'Marathi',
  placeOfBirth: 'Mumbai',
  aadharNo: '',
  panCardNo: '',
  photo: null,
  socialCategory: 'General',
  admissionType: 'Transfer',
  ews: 'Yes',
  rte: 'No',
  minorityStatus: 'No',
  disability: 'No',
  disabilityType: '',
  disabilityPercentage: '',
  rteApplicationNumber: '',
  rteApprovalOrder: '',
  rteIncomeCertificate: '',
  ewsIncomeCertificate: 'Uploaded',
  ewsIssuingAuthority: 'Tehsildar',
  ewsCertificateNumber: 'EWS-2024-123',
  ewsValidUpto: '2025-03-31',
  minorityCertificate: '',
  minorityCertificateNumber: '',
  minorityType: '',
  currentAddress: '78, Lake View Society',
  currentCity: 'Mumbai',
  currentState: 'Maharashtra',
  currentPincode: '400050',
  permanentAddress: '',
  permanentCity: '',
  permanentState: '',
  permanentPincode: '',
  sameAsPermanent: false,
  studentMobile: '',
  studentEmail: '',
  class: '9',
  section: 'A',
  rollNo: '08',
  department: 'Science',
  academicYear: '2024-2025',
  medium: 'English',
  board: 'CBSE',
  house: '',
  previousSchoolName: '',
  previousBoard: '',
  lastClassAttended: '',
  percentageGrade: '',
  tcNumber: '',
  tcDate: '',
  scholarshipEligible: true,
  selectedScheme: 'need',
  scholarshipRemarks: 'EWS category',
  fatherName: 'Vijay Desai',
  fatherOccupation: 'Doctor',
  fatherOrganization: '',
  fatherDesignation: '',
  fatherQualification: 'MBBS',
  fatherAnnualIncome: 'below_1l',
  fatherMobile: '9876543230',
  fatherEmail: 'vijay.desai@email.com',
  fatherAadhar: '',
  motherName: 'Sunita Desai',
  motherOccupation: 'Nurse',
  motherOrganization: '',
  motherDesignation: '',
  motherQualification: 'B.Sc Nursing',
  motherAnnualIncome: '',
  motherMobile: '9876543231',
  motherEmail: '',
  motherAadhar: '',
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
  verificationStatus: 'Pending',
  verifiedFields: 25,
  totalFields: 85,
  documents: [
  { name: 'Birth Certificate', key: 'birthCertificate', submitted: true, verified: false, category: 'identity', required: true },
  { name: 'EWS Certificate', key: 'ewsCertificate', submitted: true, verified: false, category: 'certificate', required: false }]

},
{
  id: '4',
  grNo: 'GR-2024-004',
  suId: 'SU-2024-004',
  penNo: 'PEN-2024-004',
  dateOfAdmission: '2024-04-02',
  firstName: 'Imran',
  middleName: '',
  lastName: 'Khan',
  fullName: 'Imran Khan',
  dateOfBirth: '2009-11-05',
  dobInWords: 'Fifth November Two Thousand Nine',
  gender: 'Male',
  nationality: 'Indian',
  bloodGroup: 'AB+',
  religion: 'Islam',
  caste: 'Khan',
  subCaste: 'Pathan',
  category: 'General',
  motherTongue: 'Urdu',
  placeOfBirth: 'Mumbai',
  aadharNo: '4567-8901-2345',
  panCardNo: '',
  photo: '/api/placeholder/150/150',
  socialCategory: 'General',
  admissionType: 'Regular',
  ews: 'No',
  rte: 'No',
  minorityStatus: 'Yes',
  disability: 'No',
  disabilityType: '',
  disabilityPercentage: '',
  rteApplicationNumber: '',
  rteApprovalOrder: '',
  rteIncomeCertificate: '',
  ewsIncomeCertificate: '',
  ewsIssuingAuthority: '',
  ewsCertificateNumber: '',
  ewsValidUpto: '',
  minorityCertificate: 'Uploaded',
  minorityCertificateNumber: 'MIN-2024-567',
  minorityType: 'Muslim',
  currentAddress: '34, Bandra West',
  currentCity: 'Mumbai',
  currentState: 'Maharashtra',
  currentPincode: '400050',
  permanentAddress: '34, Bandra West',
  permanentCity: 'Mumbai',
  permanentState: 'Maharashtra',
  permanentPincode: '400050',
  sameAsPermanent: true,
  studentMobile: '9876543240',
  studentEmail: 'imran.khan@email.com',
  class: '9',
  section: 'C',
  rollNo: '22',
  department: 'Arts',
  academicYear: '2024-2025',
  medium: 'English',
  board: 'ICSE',
  house: 'Red House',
  previousSchoolName: 'DAV School',
  previousBoard: 'ICSE',
  lastClassAttended: '8th',
  percentageGrade: '88%',
  tcNumber: 'TC-2024-004',
  tcDate: '2024-03-20',
  scholarshipEligible: false,
  selectedScheme: '',
  scholarshipRemarks: '',
  fatherName: 'Ahmed Khan',
  fatherOccupation: 'Professor',
  fatherOrganization: 'Mumbai University',
  fatherDesignation: 'Associate Professor',
  fatherQualification: 'Ph.D',
  fatherAnnualIncome: '5l_10l',
  fatherMobile: '9876543241',
  fatherEmail: 'ahmed.khan@email.com',
  fatherAadhar: '5678-9012-3456',
  motherName: 'Fatima Khan',
  motherOccupation: 'Accountant',
  motherOrganization: 'ICICI Bank',
  motherDesignation: 'Manager',
  motherQualification: 'M.Com, CA',
  motherAnnualIncome: '3l_5l',
  motherMobile: '9876543242',
  motherEmail: 'fatima.khan@email.com',
  motherAadhar: '6789-0123-4567',
  hasGuardian: false,
  guardianName: '',
  guardianRelation: '',
  guardianOccupation: '',
  guardianMobile: '',
  guardianEmail: '',
  guardianAadhar: '',
  height: '148 cm',
  weight: '40 kg',
  visionLeft: '6/6',
  visionRight: '6/6',
  medicalConditions: 'None',
  allergies: 'Peanuts',
  regularMedications: 'None',
  familyDoctorName: 'Dr. Ali Khan',
  doctorContact: '9876543250',
  insuranceProvider: 'HDFC Ergo',
  policyNumber: 'HE-2024-5678',
  emergencyContactName: 'Ahmed Khan',
  emergencyContactRelation: 'Father',
  emergencyContactNumber: '9876543241',
  transportRequired: true,
  pickupPoint: 'Bandra Station',
  preferredRoute: 'Route 3 - South Zone',
  hostelRequired: false,
  hostelType: '',
  roomPreference: '',
  messPreference: '',
  verificationStatus: 'Verified',
  verifiedFields: 85,
  totalFields: 85,
  documents: [
  { name: 'Student Passport Photo', key: 'studentPhoto', submitted: true, verified: true, verifiedBy: 'Admin', verifiedDate: '12 Mar 2024', category: 'photo', required: true },
  { name: 'Birth Certificate', key: 'birthCertificate', submitted: true, verified: true, verifiedBy: 'Admin', verifiedDate: '12 Mar 2024', category: 'identity', required: true },
  { name: 'Aadhar Card (Student)', key: 'aadharCardStudent', submitted: true, verified: true, verifiedBy: 'Admin', verifiedDate: '12 Mar 2024', category: 'identity', required: true },
  { name: 'Aadhar Card (Father)', key: 'aadharCardFather', submitted: true, verified: true, verifiedBy: 'Admin', verifiedDate: '12 Mar 2024', category: 'identity', required: true },
  { name: 'Aadhar Card (Mother)', key: 'aadharCardMother', submitted: true, verified: true, verifiedBy: 'Admin', verifiedDate: '12 Mar 2024', category: 'identity', required: true },
  { name: 'Transfer Certificate', key: 'transferCertificate', submitted: true, verified: true, verifiedBy: 'Admin', verifiedDate: '12 Mar 2024', category: 'academic', required: false },
  { name: 'Previous Marksheet', key: 'previousMarksheet', submitted: true, verified: true, verifiedBy: 'Admin', verifiedDate: '12 Mar 2024', category: 'academic', required: false },
  { name: 'Address Proof', key: 'addressProof', submitted: true, verified: true, verifiedBy: 'Admin', verifiedDate: '12 Mar 2024', category: 'identity', required: true },
  { name: 'Parent Signature', key: 'signatureParent', submitted: true, verified: true, verifiedBy: 'Admin', verifiedDate: '12 Mar 2024', category: 'other', required: true },
  { name: 'Minority Certificate', key: 'minorityCertificateDoc', submitted: true, verified: true, verifiedBy: 'Admin', verifiedDate: '12 Mar 2024', category: 'certificate', required: false }]

},
{
  id: '5',
  grNo: 'GR-2024-005',
  suId: 'SU-2024-005',
  penNo: 'PEN-2024-005',
  dateOfAdmission: '2024-04-03',
  firstName: 'Sneha',
  middleName: 'Anil',
  lastName: 'Kulkarni',
  fullName: 'Sneha Anil Kulkarni',
  dateOfBirth: '2010-07-18',
  dobInWords: '',
  gender: 'Female',
  nationality: 'Indian',
  bloodGroup: 'B-',
  religion: 'Hindu',
  caste: 'Brahmin',
  subCaste: 'Kulkarni',
  category: 'SC',
  motherTongue: 'Marathi',
  placeOfBirth: 'Nagpur',
  aadharNo: '5678-9012-3456',
  panCardNo: '',
  photo: '/api/placeholder/150/150',
  socialCategory: 'SC',
  admissionType: 'Management',
  ews: 'No',
  rte: 'No',
  minorityStatus: 'No',
  disability: 'Yes',
  disabilityType: 'Visual Impairment',
  disabilityPercentage: '40%',
  rteApplicationNumber: '',
  rteApprovalOrder: '',
  rteIncomeCertificate: '',
  ewsIncomeCertificate: '',
  ewsIssuingAuthority: '',
  ewsCertificateNumber: '',
  ewsValidUpto: '',
  minorityCertificate: '',
  minorityCertificateNumber: '',
  minorityType: '',
  currentAddress: '56, Civil Lines, Near Court',
  currentCity: 'Nagpur',
  currentState: 'Maharashtra',
  currentPincode: '440001',
  permanentAddress: '56, Civil Lines, Near Court',
  permanentCity: 'Nagpur',
  permanentState: 'Maharashtra',
  permanentPincode: '440001',
  sameAsPermanent: true,
  studentMobile: '',
  studentEmail: '',
  class: '8',
  section: 'B',
  rollNo: '12',
  department: 'Science',
  academicYear: '2024-2025',
  medium: 'English',
  board: 'CBSE',
  house: 'Green House',
  previousSchoolName: 'Central School',
  previousBoard: 'CBSE',
  lastClassAttended: '7th',
  percentageGrade: '78%',
  tcNumber: 'TC-2024-005',
  tcDate: '2024-03-18',
  scholarshipEligible: true,
  selectedScheme: 'merit',
  scholarshipRemarks: 'SC Category with Disability',
  fatherName: 'Anil Kulkarni',
  fatherOccupation: 'Lawyer',
  fatherOrganization: 'High Court',
  fatherDesignation: 'Advocate',
  fatherQualification: 'LLB',
  fatherAnnualIncome: '3l_5l',
  fatherMobile: '9876543250',
  fatherEmail: '',
  fatherAadhar: '7890-1234-5678',
  motherName: 'Rani Kulkarni',
  motherOccupation: 'Teacher',
  motherOrganization: 'Govt. School',
  motherDesignation: 'Primary Teacher',
  motherQualification: 'B.Ed',
  motherAnnualIncome: '1l_3l',
  motherMobile: '9876543251',
  motherEmail: '',
  motherAadhar: '',
  hasGuardian: true,
  guardianName: 'Sunil Kulkarni',
  guardianRelation: 'Uncle',
  guardianOccupation: 'Business',
  guardianMobile: '9876543260',
  guardianEmail: 'sunil.kulkarni@email.com',
  guardianAadhar: '8901-2345-6789',
  height: '140 cm',
  weight: '35 kg',
  visionLeft: '6/18',
  visionRight: '6/18',
  medicalConditions: 'Low Vision',
  allergies: 'None',
  regularMedications: 'Eye drops',
  familyDoctorName: 'Dr. Meera Shah',
  doctorContact: '9876543270',
  insuranceProvider: 'LIC',
  policyNumber: 'LIC-2024-7890',
  emergencyContactName: 'Sunil Kulkarni',
  emergencyContactRelation: 'Uncle',
  emergencyContactNumber: '9876543260',
  transportRequired: true,
  pickupPoint: 'Civil Lines Bus Stop',
  preferredRoute: 'Route 4 - East Zone',
  hostelRequired: false,
  hostelType: '',
  roomPreference: '',
  messPreference: '',
  verificationStatus: 'Partial',
  verifiedFields: 70,
  totalFields: 85,
  documents: [
  { name: 'Student Passport Photo', key: 'studentPhoto', submitted: true, verified: true, verifiedBy: 'Staff', verifiedDate: '14 Mar 2024', category: 'photo', required: true },
  { name: 'Birth Certificate', key: 'birthCertificate', submitted: true, verified: true, verifiedBy: 'Staff', verifiedDate: '14 Mar 2024', category: 'identity', required: true },
  { name: 'Aadhar Card (Student)', key: 'aadharCardStudent', submitted: true, verified: true, verifiedBy: 'Staff', verifiedDate: '14 Mar 2024', category: 'identity', required: true },
  { name: 'Aadhar Card (Father)', key: 'aadharCardFather', submitted: true, verified: true, verifiedBy: 'Staff', verifiedDate: '14 Mar 2024', category: 'identity', required: true },
  { name: 'Transfer Certificate', key: 'transferCertificate', submitted: true, verified: true, verifiedBy: 'Staff', verifiedDate: '14 Mar 2024', category: 'academic', required: false },
  { name: 'Previous Marksheet', key: 'previousMarksheet', submitted: true, verified: false, remarks: 'Original required', category: 'academic', required: false },
  { name: 'Caste Certificate', key: 'casteCertificate', submitted: true, verified: true, verifiedBy: 'Staff', verifiedDate: '14 Mar 2024', category: 'certificate', required: false },
  { name: 'Disability Certificate', key: 'disabilityCertificate', submitted: true, verified: false, remarks: 'Validity to be checked', category: 'certificate', required: false }]

}];


// Filter Options
const classOptions = [
{ value: '', label: 'All Classes' },
...Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: `Class ${i + 1}` }))];


const sectionOptions = [
{ value: '', label: 'All Sections' },
{ value: 'A', label: 'Section A' },
{ value: 'B', label: 'Section B' },
{ value: 'C', label: 'Section C' },
{ value: 'D', label: 'Section D' }];


const verificationStatusOptions = [
{ value: '', label: 'All Status' },
{ value: 'Verified', label: 'Verified' },
{ value: 'Partial', label: 'Partially Verified' },
{ value: 'Pending', label: 'Pending' }];


const categoryOptions = [
{ value: '', label: 'All Categories' },
{ value: 'General', label: 'General' },
{ value: 'OBC', label: 'OBC' },
{ value: 'SC', label: 'SC' },
{ value: 'ST', label: 'ST' }];


interface FilterState {
  grNo: string;
  suId: string;
  firstName: string;
  lastName: string;
  class: string;
  section: string;
  verificationStatus: string;
  category: string;
}

const initialFilters: FilterState = {
  grNo: '',
  suId: '',
  firstName: '',
  lastName: '',
  class: '',
  section: '',
  verificationStatus: '',
  category: ''
};

// Field Labels Mapping
const fieldLabels: Record<string, string> = {
  grNo: 'GR Number',
  suId: 'SU ID',
  penNo: 'PEN Number',
  dateOfAdmission: 'Date of Admission',
  firstName: 'First Name',
  middleName: 'Middle Name',
  lastName: 'Last Name',
  fullName: 'Full Name',
  dateOfBirth: 'Date of Birth',
  dobInWords: 'DOB in Words',
  gender: 'Gender',
  nationality: 'Nationality',
  bloodGroup: 'Blood Group',
  religion: 'Religion',
  caste: 'Caste',
  subCaste: 'Sub Caste',
  category: 'Category',
  motherTongue: 'Mother Tongue',
  placeOfBirth: 'Place of Birth',
  aadharNo: 'Aadhar Number',
  panCardNo: 'PAN Card Number',
  photo: 'Student Photo',
  socialCategory: 'Social Category',
  admissionType: 'Admission Type',
  ews: 'EWS Status',
  rte: 'RTE Status',
  minorityStatus: 'Minority Status',
  disability: 'Disability Status',
  disabilityType: 'Disability Type',
  disabilityPercentage: 'Disability Percentage',
  rteApplicationNumber: 'RTE Application Number',
  ewsCertificateNumber: 'EWS Certificate Number',
  minorityCertificateNumber: 'Minority Certificate Number',
  currentAddress: 'Current Address',
  currentCity: 'Current City',
  currentState: 'Current State',
  currentPincode: 'Current Pincode',
  permanentAddress: 'Permanent Address',
  permanentCity: 'Permanent City',
  permanentState: 'Permanent State',
  permanentPincode: 'Permanent Pincode',
  studentMobile: 'Student Mobile',
  studentEmail: 'Student Email',
  class: 'Class',
  section: 'Section',
  rollNo: 'Roll Number',
  department: 'Department',
  academicYear: 'Academic Year',
  medium: 'Medium',
  board: 'Board',
  house: 'House',
  previousSchoolName: 'Previous School',
  previousBoard: 'Previous Board',
  lastClassAttended: 'Last Class Attended',
  percentageGrade: 'Percentage/Grade',
  tcNumber: 'TC Number',
  tcDate: 'TC Date',
  fatherName: "Father's Name",
  fatherOccupation: "Father's Occupation",
  fatherMobile: "Father's Mobile",
  fatherEmail: "Father's Email",
  fatherAadhar: "Father's Aadhar",
  motherName: "Mother's Name",
  motherOccupation: "Mother's Occupation",
  motherMobile: "Mother's Mobile",
  motherEmail: "Mother's Email",
  motherAadhar: "Mother's Aadhar",
  guardianName: "Guardian's Name",
  guardianMobile: "Guardian's Mobile",
  emergencyContactName: 'Emergency Contact Name',
  emergencyContactNumber: 'Emergency Contact Number',
  height: 'Height',
  weight: 'Weight'
};

// Required Fields
const requiredFields = [
'grNo', 'suId', 'dateOfAdmission', 'firstName', 'lastName', 'fullName',
'dateOfBirth', 'gender', 'nationality', 'bloodGroup', 'category', 'aadharNo',
'currentAddress', 'currentCity', 'currentState', 'currentPincode',
'class', 'section', 'rollNo', 'academicYear',
'fatherName', 'fatherMobile', 'motherName',
'emergencyContactName', 'emergencyContactNumber'];


// Main Component
export function VerifyInfoDocuments() {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [hasSearched, setHasSearched] = useState(false);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedStudent, setEditedStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'documents'>('details');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [saving, setSaving] = useState(false);
  const [verifiedFields, setVerifiedFields] = useState<Set<string>>(new Set());

  // Validation function
  const validateStudent = (student: Student): ValidationWarning[] => {
    const warnings: ValidationWarning[] = [];

    // Check required fields
    requiredFields.forEach((field) => {
      const value = student[field as keyof Student];
      if (!value || typeof value === 'string' && value.trim() === '') {
        warnings.push({
          type: 'missing',
          field: fieldLabels[field] || field,
          message: `${fieldLabels[field] || field} is required but missing`,
          severity: 'error'
        });
      }
    });

    // Check photo
    if (!student.photo) {
      warnings.push({
        type: 'missing',
        field: 'Student Photo',
        message: 'Student photo is not uploaded',
        severity: 'error',
        linkedDocument: 'studentPhoto'
      });
    }

    // RTE specific validations
    if (student.rte === 'Yes') {
      if (!student.rteApplicationNumber) {
        warnings.push({
          type: 'missing',
          field: 'RTE Application Number',
          message: 'RTE Application Number is required for RTE students',
          severity: 'error',
          linkedDocument: 'rteApprovalOrderDoc'
        });
      }
      const rteDoc = student.documents.find((d) => d.key === 'rteApprovalOrderDoc');
      if (!rteDoc?.submitted) {
        warnings.push({
          type: 'missing',
          field: 'RTE Approval Order',
          message: 'RTE Approval Order document is required',
          severity: 'error',
          linkedDocument: 'rteApprovalOrderDoc'
        });
      }
    }

    // EWS specific validations
    if (student.ews === 'Yes') {
      if (!student.ewsCertificateNumber) {
        warnings.push({
          type: 'missing',
          field: 'EWS Certificate Number',
          message: 'EWS Certificate Number is required',
          severity: 'error',
          linkedDocument: 'ewsCertificate'
        });
      }
      const ewsDoc = student.documents.find((d) => d.key === 'ewsCertificate');
      if (!ewsDoc?.submitted) {
        warnings.push({
          type: 'missing',
          field: 'EWS Certificate',
          message: 'EWS Certificate document is required',
          severity: 'error',
          linkedDocument: 'ewsCertificate'
        });
      }
    }

    // Minority specific validations
    if (student.minorityStatus === 'Yes') {
      if (!student.minorityType) {
        warnings.push({
          type: 'missing',
          field: 'Minority Type',
          message: 'Minority Type is required',
          severity: 'error'
        });
      }
      const minorityDoc = student.documents.find((d) => d.key === 'minorityCertificateDoc');
      if (!minorityDoc?.submitted) {
        warnings.push({
          type: 'missing',
          field: 'Minority Certificate',
          message: 'Minority Certificate document is required',
          severity: 'error',
          linkedDocument: 'minorityCertificateDoc'
        });
      }
    }

    // Disability specific validations
    if (student.disability === 'Yes') {
      if (!student.disabilityType) {
        warnings.push({
          type: 'missing',
          field: 'Disability Type',
          message: 'Disability Type is required',
          severity: 'error'
        });
      }
      if (!student.disabilityPercentage) {
        warnings.push({
          type: 'missing',
          field: 'Disability Percentage',
          message: 'Disability Percentage is required',
          severity: 'error'
        });
      }
      const disabilityDoc = student.documents.find((d) => d.key === 'disabilityCertificate');
      if (!disabilityDoc?.submitted) {
        warnings.push({
          type: 'missing',
          field: 'Disability Certificate',
          message: 'Disability Certificate document is required',
          severity: 'error',
          linkedDocument: 'disabilityCertificate'
        });
      }
    }

    // Category specific - Caste Certificate
    if (['SC', 'ST', 'OBC', 'NT', 'VJ', 'SBC'].includes(student.category)) {
      const casteDoc = student.documents.find((d) => d.key === 'casteCertificate');
      if (!casteDoc?.submitted) {
        warnings.push({
          type: 'missing',
          field: 'Caste Certificate',
          message: `Caste Certificate is required for ${student.category} category`,
          severity: 'warning',
          linkedDocument: 'casteCertificate'
        });
      }
    }

    // Previous school validation - TC required for transfer students
    if (student.admissionType === 'Transfer') {
      if (!student.tcNumber) {
        warnings.push({
          type: 'missing',
          field: 'TC Number',
          message: 'Transfer Certificate Number is required for transfer admissions',
          severity: 'error'
        });
      }
      const tcDoc = student.documents.find((d) => d.key === 'transferCertificate');
      if (!tcDoc?.submitted) {
        warnings.push({
          type: 'missing',
          field: 'Transfer Certificate',
          message: 'Transfer Certificate document is required',
          severity: 'error',
          linkedDocument: 'transferCertificate'
        });
      }
    }

    // Aadhar validation
    if (student.aadharNo && !/^\d{4}-\d{4}-\d{4}$/.test(student.aadharNo)) {
      warnings.push({
        type: 'invalid',
        field: 'Aadhar Number',
        message: 'Aadhar Number format is invalid (should be XXXX-XXXX-XXXX)',
        severity: 'warning'
      });
    }

    // Mother's Aadhar missing but document submitted
    const motherAadharDoc = student.documents.find((d) => d.key === 'aadharCardMother');
    if (motherAadharDoc?.submitted && !student.motherAadhar) {
      warnings.push({
        type: 'mismatch',
        field: "Mother's Aadhar",
        message: "Mother's Aadhar document is uploaded but number not entered in form",
        severity: 'warning',
        linkedDocument: 'aadharCardMother'
      });
    }

    // Permanent address check
    if (!student.sameAsPermanent && !student.permanentAddress) {
      warnings.push({
        type: 'incomplete',
        field: 'Permanent Address',
        message: 'Permanent address is not filled and "Same as Current" is not checked',
        severity: 'warning'
      });
    }

    return warnings;
  };

  // Get missing documents
  const getMissingDocuments = (student: Student) => {
    const missing: string[] = [];
    const conditional: {doc: string;reason: string;}[] = [];

    // Required documents
    documentConfigs.filter((d) => d.required).forEach((docConfig) => {
      const doc = student.documents.find((d) => d.key === docConfig.key);
      if (!doc?.submitted) {
        missing.push(docConfig.name);
      }
    });

    // Conditional documents
    if (student.rte === 'Yes') {
      const doc = student.documents.find((d) => d.key === 'rteApprovalOrderDoc');
      if (!doc?.submitted) {
        conditional.push({ doc: 'RTE Approval Order', reason: 'Required for RTE admission' });
      }
    }

    if (student.ews === 'Yes') {
      const doc = student.documents.find((d) => d.key === 'ewsCertificate');
      if (!doc?.submitted) {
        conditional.push({ doc: 'EWS Certificate', reason: 'Required for EWS quota' });
      }
    }

    if (student.minorityStatus === 'Yes') {
      const doc = student.documents.find((d) => d.key === 'minorityCertificateDoc');
      if (!doc?.submitted) {
        conditional.push({ doc: 'Minority Certificate', reason: 'Required for Minority status' });
      }
    }

    if (student.disability === 'Yes') {
      const doc = student.documents.find((d) => d.key === 'disabilityCertificate');
      if (!doc?.submitted) {
        conditional.push({ doc: 'Disability Certificate', reason: 'Required for PWD status' });
      }
    }

    if (['SC', 'ST', 'OBC', 'NT', 'VJ', 'SBC'].includes(student.category)) {
      const doc = student.documents.find((d) => d.key === 'casteCertificate');
      if (!doc?.submitted) {
        conditional.push({ doc: 'Caste Certificate', reason: `Required for ${student.category} category` });
      }
    }

    return { missing, conditional };
  };

  const selectClass = "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors disabled:bg-gray-50";

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    const results = studentsData.filter((student) => {
      if (filters.grNo && !student.grNo.toLowerCase().includes(filters.grNo.toLowerCase())) return false;
      if (filters.suId && !student.suId.toLowerCase().includes(filters.suId.toLowerCase())) return false;
      if (filters.firstName && !student.firstName.toLowerCase().includes(filters.firstName.toLowerCase())) return false;
      if (filters.lastName && !student.lastName.toLowerCase().includes(filters.lastName.toLowerCase())) return false;
      if (filters.class && student.class !== filters.class) return false;
      if (filters.section && student.section !== filters.section) return false;
      if (filters.verificationStatus && student.verificationStatus !== filters.verificationStatus) return false;
      if (filters.category && student.category !== filters.category) return false;
      return true;
    });
    setFilteredStudents(results);
    setHasSearched(true);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    setHasSearched(false);
    setFilteredStudents([]);
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setEditedStudent({ ...student });
    setEditMode(false);
    setActiveTab('details');
    setVerifiedFields(new Set());
  };

  const handleBackToList = () => {
    setSelectedStudent(null);
    setEditedStudent(null);
    setEditMode(false);
    setVerifiedFields(new Set());
  };

  const handleSaveChanges = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setEditMode(false);
      alert('Changes saved successfully!');
    }, 1500);
  };

  const handleVerifyField = (field: string) => {
    setVerifiedFields((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(field)) {
        newSet.delete(field);
      } else {
        newSet.add(field);
      }
      return newSet;
    });
  };

  const handleVerifyDocument = (docKey: string) => {
    if (!editedStudent) return;
    const updatedDocs = editedStudent.documents.map((doc) =>
    doc.key === docKey ?
    { ...doc, verified: true, verifiedBy: 'Current User', verifiedDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) } :
    doc
    );
    setEditedStudent({ ...editedStudent, documents: updatedDocs });
  };

  const handleMarkAllVerified = () => {
    if (!editedStudent) return;
    const updatedDocs = editedStudent.documents.map((doc) =>
    doc.submitted ?
    { ...doc, verified: true, verifiedBy: 'Current User', verifiedDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) } :
    doc
    );
    setEditedStudent({
      ...editedStudent,
      verificationStatus: 'Verified',
      verifiedFields: editedStudent.totalFields,
      documents: updatedDocs
    });
    alert('All submitted documents and fields marked as verified!');
  };

  const getDocumentStats = (docs: UploadedDocument[]) => {
    const submitted = docs.filter((d) => d.submitted).length;
    const verified = docs.filter((d) => d.verified).length;
    const required = documentConfigs.filter((d) => d.required).length;
    const requiredSubmitted = docs.filter((d) => d.required && d.submitted).length;
    return { submitted, verified, total: documentConfigs.length, required, requiredSubmitted };
  };

  // Student Detail View
  if (selectedStudent && editedStudent) {
    const warnings = validateStudent(editedStudent);
    const missingDocs = getMissingDocuments(editedStudent);
    const docStats = getDocumentStats(editedStudent.documents);

    const errorCount = warnings.filter((w) => w.severity === 'error').length;
    const warningCount = warnings.filter((w) => w.severity === 'warning').length;

    const renderFieldRow = (label: string, value: string | undefined | null, fieldKey: string, required: boolean = false) => {
      const isEmpty = !value || value.trim() === '';
      const isVerified = verifiedFields.has(fieldKey);
      const hasWarning = warnings.some((w) => w.field === label);

      return (
        <tr key={fieldKey} className={`${isEmpty && required ? 'bg-red-50' : hasWarning ? 'bg-amber-50' : ''}`}>
          <td className="px-4 py-2 text-sm font-medium text-gray-700 w-1/4">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </td>
          <td className="px-4 py-2 text-sm text-gray-900 w-2/4">
            {editMode ?
            <input
              type="text"
              value={value || ''}
              onChange={(e) => setEditedStudent({ ...editedStudent, [fieldKey]: e.target.value })}
              className={`w-full px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 ${isEmpty && required ? 'border-red-300 bg-red-50' : 'border-gray-300'}`} /> :


            <span className={isEmpty ? 'text-red-500 italic' : ''}>
                {value || (isEmpty ? 'Missing' : '-')}
              </span>
            }
          </td>
          <td className="px-4 py-2 text-center w-1/4">
            <div className="flex items-center justify-center gap-2">
              {isEmpty && required &&
              <AlertTriangleIcon className="w-4 h-4 text-red-500" />
              }
              {hasWarning && !isEmpty &&
              <AlertCircleIcon className="w-4 h-4 text-amber-500" />
              }
              <button
                onClick={() => handleVerifyField(fieldKey)}
                className={`p-1.5 rounded-lg transition-colors ${isVerified ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100 text-gray-400'}`}
                title={isVerified ? 'Verified' : 'Click to verify'}>

                <CheckCircleIcon className="w-5 h-5" />
              </button>
            </div>
          </td>
        </tr>);

    };

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleBackToList}>
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{editedStudent.fullName}</h1>
              <p className="text-sm text-gray-500">
                {editedStudent.grNo} · {editedStudent.suId} · Class {editedStudent.class}-{editedStudent.section}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setEditMode(!editMode)}>
              <EditIcon className="w-4 h-4 mr-2" />
              {editMode ? 'Cancel Edit' : 'Edit Details'}
            </Button>
            <Button variant="outline">
              <PrinterIcon className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="success" onClick={handleMarkAllVerified}>
              <ShieldCheckIcon className="w-4 h-4 mr-2" />
              Mark All Verified
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              {editedStudent.photo ?
              <img src={editedStudent.photo} alt="Student" className="w-14 h-14 rounded-full object-cover border-2 border-gray-200" /> :

              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center border-2 border-dashed border-red-300">
                  <ImageIcon className="w-6 h-6 text-red-400" />
                </div>
              }
              <div>
                <p className="text-xs font-medium text-gray-500">Photo</p>
                {editedStudent.photo ?
                <Badge variant="success">Uploaded</Badge> :

                <Badge variant="danger">Missing</Badge>
                }
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-50 rounded-xl">
                <XCircleIcon className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Errors</p>
                <p className="text-lg font-bold text-red-600">{errorCount}</p>
                <p className="text-xs text-gray-500">critical issues</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-50 rounded-xl">
                <AlertTriangleIcon className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Warnings</p>
                <p className="text-lg font-bold text-amber-600">{warningCount}</p>
                <p className="text-xs text-gray-500">need attention</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-xl">
                <FileTextIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Documents</p>
                <p className="text-lg font-bold text-gray-900">{docStats.submitted}/{docStats.total}</p>
                <p className="text-xs text-gray-500">{docStats.verified} verified</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${editedStudent.verificationStatus === 'Verified' ? 'bg-green-50' : editedStudent.verificationStatus === 'Partial' ? 'bg-amber-50' : 'bg-red-50'}`}>
                <ShieldCheckIcon className={`w-5 h-5 ${editedStudent.verificationStatus === 'Verified' ? 'text-green-600' : editedStudent.verificationStatus === 'Partial' ? 'text-amber-600' : 'text-red-600'}`} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Status</p>
                <Badge variant={editedStudent.verificationStatus === 'Verified' ? 'success' : editedStudent.verificationStatus === 'Partial' ? 'warning' : 'danger'}>
                  {editedStudent.verificationStatus}
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Warnings Panel */}
        {warnings.length > 0 &&
        <Card className="p-4 border-l-4 border-l-amber-500 bg-amber-50">
            <div className="flex items-start gap-3">
              <AlertTriangleIcon className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-bold text-amber-800 mb-2">
                  Validation Issues ({errorCount} Errors, {warningCount} Warnings)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {warnings.slice(0, 8).map((warning, idx) =>
                <div key={idx} className={`flex items-start gap-2 text-sm ${warning.severity === 'error' ? 'text-red-700' : 'text-amber-700'}`}>
                      {warning.severity === 'error' ?
                  <XCircleIcon className="w-4 h-4 flex-shrink-0 mt-0.5" /> :

                  <AlertCircleIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  }
                      <span>{warning.message}</span>
                    </div>
                )}
                </div>
                {warnings.length > 8 &&
              <p className="text-sm text-amber-700 mt-2">+ {warnings.length - 8} more issues</p>
              }
              </div>
            </div>
          </Card>
        }

        {/* Missing Documents Alert */}
        {(missingDocs.missing.length > 0 || missingDocs.conditional.length > 0) &&
        <Card className="p-4 border-l-4 border-l-red-500 bg-red-50">
            <div className="flex items-start gap-3">
              <FileTextIcon className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-bold text-red-800 mb-2">
                  Missing Documents ({missingDocs.missing.length + missingDocs.conditional.length} total)
                </h4>
                <div className="space-y-2">
                  {missingDocs.missing.length > 0 &&
                <div>
                      <p className="text-xs font-semibold text-red-700 mb-1">Required Documents:</p>
                      <div className="flex flex-wrap gap-2">
                        {missingDocs.missing.map((doc, idx) =>
                    <Badge key={idx} variant="danger" className="text-xs">{doc}</Badge>
                    )}
                      </div>
                    </div>
                }
                  {missingDocs.conditional.length > 0 &&
                <div>
                      <p className="text-xs font-semibold text-amber-700 mb-1">Conditionally Required:</p>
                      <div className="space-y-1">
                        {missingDocs.conditional.map((item, idx) =>
                    <div key={idx} className="text-sm text-amber-700">
                            <span className="font-medium">{item.doc}</span> - {item.reason}
                          </div>
                    )}
                      </div>
                    </div>
                }
                </div>
              </div>
            </div>
          </Card>
        }

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'details' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>

            <UserIcon className="w-4 h-4 inline-block mr-2" />
            Student Details
            {errorCount > 0 && <Badge variant="danger" className="ml-2">{errorCount}</Badge>}
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'documents' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>

            <FileTextIcon className="w-4 h-4 inline-block mr-2" />
            Documents
            {missingDocs.missing.length > 0 && <Badge variant="danger" className="ml-2">{missingDocs.missing.length}</Badge>}
          </button>
        </div>

        {/* Details Tab */}
        {activeTab === 'details' &&
        <Card className="overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Complete Student Information</h3>
              <div className="text-sm text-gray-500">
                {verifiedFields.size} fields verified
              </div>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Field</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Value</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {/* Institutional Details */}
                  <tr className="bg-blue-50">
                    <td colSpan={3} className="px-4 py-2 text-sm font-bold text-blue-800">Institutional Details</td>
                  </tr>
                  {renderFieldRow('GR Number', editedStudent.grNo, 'grNo', true)}
                  {renderFieldRow('SU ID', editedStudent.suId, 'suId', true)}
                  {renderFieldRow('PEN Number', editedStudent.penNo, 'penNo', false)}
                  {renderFieldRow('Date of Admission', editedStudent.dateOfAdmission, 'dateOfAdmission', true)}

                  {/* Personal Details */}
                  <tr className="bg-green-50">
                    <td colSpan={3} className="px-4 py-2 text-sm font-bold text-green-800">Personal Details</td>
                  </tr>
                  {renderFieldRow('First Name', editedStudent.firstName, 'firstName', true)}
                  {renderFieldRow('Middle Name', editedStudent.middleName, 'middleName', false)}
                  {renderFieldRow('Last Name', editedStudent.lastName, 'lastName', true)}
                  {renderFieldRow('Full Name', editedStudent.fullName, 'fullName', true)}
                  {renderFieldRow('Date of Birth', editedStudent.dateOfBirth, 'dateOfBirth', true)}
                  {renderFieldRow('DOB in Words', editedStudent.dobInWords, 'dobInWords', false)}
                  {renderFieldRow('Gender', editedStudent.gender, 'gender', true)}
                  {renderFieldRow('Nationality', editedStudent.nationality, 'nationality', true)}
                  {renderFieldRow('Blood Group', editedStudent.bloodGroup, 'bloodGroup', true)}
                  {renderFieldRow('Religion', editedStudent.religion, 'religion', false)}
                  {renderFieldRow('Caste', editedStudent.caste, 'caste', false)}
                  {renderFieldRow('Sub Caste', editedStudent.subCaste, 'subCaste', false)}
                  {renderFieldRow('Category', editedStudent.category, 'category', true)}
                  {renderFieldRow('Mother Tongue', editedStudent.motherTongue, 'motherTongue', false)}
                  {renderFieldRow('Place of Birth', editedStudent.placeOfBirth, 'placeOfBirth', false)}
                  {renderFieldRow('Aadhar Number', editedStudent.aadharNo, 'aadharNo', true)}
                  {renderFieldRow('PAN Card Number', editedStudent.panCardNo, 'panCardNo', false)}

                  {/* Category & Reservation */}
                  <tr className="bg-purple-50">
                    <td colSpan={3} className="px-4 py-2 text-sm font-bold text-purple-800">Category & Reservation</td>
                  </tr>
                  {renderFieldRow('Social Category', editedStudent.socialCategory, 'socialCategory', false)}
                  {renderFieldRow('Admission Type', editedStudent.admissionType, 'admissionType', true)}
                  {renderFieldRow('EWS Status', editedStudent.ews, 'ews', false)}
                  {renderFieldRow('RTE Status', editedStudent.rte, 'rte', false)}
                  {renderFieldRow('Minority Status', editedStudent.minorityStatus, 'minorityStatus', false)}
                  {renderFieldRow('Disability Status', editedStudent.disability, 'disability', false)}
                  {editedStudent.rte === 'Yes' && renderFieldRow('RTE Application Number', editedStudent.rteApplicationNumber, 'rteApplicationNumber', true)}
                  {editedStudent.ews === 'Yes' && renderFieldRow('EWS Certificate Number', editedStudent.ewsCertificateNumber, 'ewsCertificateNumber', true)}
                  {editedStudent.minorityStatus === 'Yes' &&
                <>
                      {renderFieldRow('Minority Type', editedStudent.minorityType, 'minorityType', true)}
                      {renderFieldRow('Minority Certificate Number', editedStudent.minorityCertificateNumber, 'minorityCertificateNumber', false)}
                    </>
                }
                  {editedStudent.disability === 'Yes' &&
                <>
                      {renderFieldRow('Disability Type', editedStudent.disabilityType, 'disabilityType', true)}
                      {renderFieldRow('Disability Percentage', editedStudent.disabilityPercentage, 'disabilityPercentage', true)}
                    </>
                }

                  {/* Address Details */}
                  <tr className="bg-orange-50">
                    <td colSpan={3} className="px-4 py-2 text-sm font-bold text-orange-800">Address Details</td>
                  </tr>
                  {renderFieldRow('Current Address', editedStudent.currentAddress, 'currentAddress', true)}
                  {renderFieldRow('Current City', editedStudent.currentCity, 'currentCity', true)}
                  {renderFieldRow('Current State', editedStudent.currentState, 'currentState', true)}
                  {renderFieldRow('Current Pincode', editedStudent.currentPincode, 'currentPincode', true)}
                  {renderFieldRow('Permanent Address', editedStudent.permanentAddress, 'permanentAddress', false)}
                  {renderFieldRow('Permanent City', editedStudent.permanentCity, 'permanentCity', false)}
                  {renderFieldRow('Permanent State', editedStudent.permanentState, 'permanentState', false)}
                  {renderFieldRow('Permanent Pincode', editedStudent.permanentPincode, 'permanentPincode', false)}
                  {renderFieldRow('Student Mobile', editedStudent.studentMobile, 'studentMobile', false)}
                  {renderFieldRow('Student Email', editedStudent.studentEmail, 'studentEmail', false)}

                  {/* Academic Details */}
                  <tr className="bg-cyan-50">
                    <td colSpan={3} className="px-4 py-2 text-sm font-bold text-cyan-800">Academic Details</td>
                  </tr>
                  {renderFieldRow('Class', editedStudent.class, 'class', true)}
                  {renderFieldRow('Section', editedStudent.section, 'section', true)}
                  {renderFieldRow('Roll Number', editedStudent.rollNo, 'rollNo', true)}
                  {renderFieldRow('Department', editedStudent.department, 'department', false)}
                  {renderFieldRow('Academic Year', editedStudent.academicYear, 'academicYear', true)}
                  {renderFieldRow('Medium', editedStudent.medium, 'medium', false)}
                  {renderFieldRow('Board', editedStudent.board, 'board', false)}
                  {renderFieldRow('House', editedStudent.house, 'house', false)}

                  {/* Previous School */}
                  <tr className="bg-indigo-50">
                    <td colSpan={3} className="px-4 py-2 text-sm font-bold text-indigo-800">Previous School Details</td>
                  </tr>
                  {renderFieldRow('Previous School Name', editedStudent.previousSchoolName, 'previousSchoolName', false)}
                  {renderFieldRow('Previous Board', editedStudent.previousBoard, 'previousBoard', false)}
                  {renderFieldRow('Last Class Attended', editedStudent.lastClassAttended, 'lastClassAttended', false)}
                  {renderFieldRow('Percentage/Grade', editedStudent.percentageGrade, 'percentageGrade', false)}
                  {renderFieldRow('TC Number', editedStudent.tcNumber, 'tcNumber', editedStudent.admissionType === 'Transfer')}
                  {renderFieldRow('TC Date', editedStudent.tcDate, 'tcDate', false)}

                  {/* Father Details */}
                  <tr className="bg-teal-50">
                    <td colSpan={3} className="px-4 py-2 text-sm font-bold text-teal-800">Father's Details</td>
                  </tr>
                  {renderFieldRow("Father's Name", editedStudent.fatherName, 'fatherName', true)}
                  {renderFieldRow("Father's Occupation", editedStudent.fatherOccupation, 'fatherOccupation', false)}
                  {renderFieldRow("Father's Organization", editedStudent.fatherOrganization, 'fatherOrganization', false)}
                  {renderFieldRow("Father's Designation", editedStudent.fatherDesignation, 'fatherDesignation', false)}
                  {renderFieldRow("Father's Qualification", editedStudent.fatherQualification, 'fatherQualification', false)}
                  {renderFieldRow("Father's Annual Income", editedStudent.fatherAnnualIncome, 'fatherAnnualIncome', false)}
                  {renderFieldRow("Father's Mobile", editedStudent.fatherMobile, 'fatherMobile', true)}
                  {renderFieldRow("Father's Email", editedStudent.fatherEmail, 'fatherEmail', false)}
                  {renderFieldRow("Father's Aadhar", editedStudent.fatherAadhar, 'fatherAadhar', false)}

                  {/* Mother Details */}
                  <tr className="bg-pink-50">
                    <td colSpan={3} className="px-4 py-2 text-sm font-bold text-pink-800">Mother's Details</td>
                  </tr>
                  {renderFieldRow("Mother's Name", editedStudent.motherName, 'motherName', true)}
                  {renderFieldRow("Mother's Occupation", editedStudent.motherOccupation, 'motherOccupation', false)}
                  {renderFieldRow("Mother's Organization", editedStudent.motherOrganization, 'motherOrganization', false)}
                  {renderFieldRow("Mother's Designation", editedStudent.motherDesignation, 'motherDesignation', false)}
                  {renderFieldRow("Mother's Qualification", editedStudent.motherQualification, 'motherQualification', false)}
                  {renderFieldRow("Mother's Annual Income", editedStudent.motherAnnualIncome, 'motherAnnualIncome', false)}
                  {renderFieldRow("Mother's Mobile", editedStudent.motherMobile, 'motherMobile', false)}
                  {renderFieldRow("Mother's Email", editedStudent.motherEmail, 'motherEmail', false)}
                  {renderFieldRow("Mother's Aadhar", editedStudent.motherAadhar, 'motherAadhar', false)}

                  {/* Guardian Details */}
                  {editedStudent.hasGuardian &&
                <>
                      <tr className="bg-amber-50">
                        <td colSpan={3} className="px-4 py-2 text-sm font-bold text-amber-800">Guardian Details</td>
                      </tr>
                      {renderFieldRow("Guardian's Name", editedStudent.guardianName, 'guardianName', false)}
                      {renderFieldRow("Guardian's Relation", editedStudent.guardianRelation, 'guardianRelation', false)}
                      {renderFieldRow("Guardian's Occupation", editedStudent.guardianOccupation, 'guardianOccupation', false)}
                      {renderFieldRow("Guardian's Mobile", editedStudent.guardianMobile, 'guardianMobile', false)}
                      {renderFieldRow("Guardian's Email", editedStudent.guardianEmail, 'guardianEmail', false)}
                      {renderFieldRow("Guardian's Aadhar", editedStudent.guardianAadhar, 'guardianAadhar', false)}
                    </>
                }

                  {/* Medical Information */}
                  <tr className="bg-red-50">
                    <td colSpan={3} className="px-4 py-2 text-sm font-bold text-red-800">Medical Information</td>
                  </tr>
                  {renderFieldRow('Height', editedStudent.height, 'height', false)}
                  {renderFieldRow('Weight', editedStudent.weight, 'weight', false)}
                  {renderFieldRow('Vision (Left)', editedStudent.visionLeft, 'visionLeft', false)}
                  {renderFieldRow('Vision (Right)', editedStudent.visionRight, 'visionRight', false)}
                  {renderFieldRow('Medical Conditions', editedStudent.medicalConditions, 'medicalConditions', false)}
                  {renderFieldRow('Allergies', editedStudent.allergies, 'allergies', false)}
                  {renderFieldRow('Regular Medications', editedStudent.regularMedications, 'regularMedications', false)}
                  {renderFieldRow('Family Doctor Name', editedStudent.familyDoctorName, 'familyDoctorName', false)}
                  {renderFieldRow("Doctor's Contact", editedStudent.doctorContact, 'doctorContact', false)}
                  {renderFieldRow('Insurance Provider', editedStudent.insuranceProvider, 'insuranceProvider', false)}
                  {renderFieldRow('Policy Number', editedStudent.policyNumber, 'policyNumber', false)}
                  {renderFieldRow('Emergency Contact Name', editedStudent.emergencyContactName, 'emergencyContactName', true)}
                  {renderFieldRow('Emergency Contact Relation', editedStudent.emergencyContactRelation, 'emergencyContactRelation', false)}
                  {renderFieldRow('Emergency Contact Number', editedStudent.emergencyContactNumber, 'emergencyContactNumber', true)}

                  {/* Transport & Hostel */}
                  <tr className="bg-yellow-50">
                    <td colSpan={3} className="px-4 py-2 text-sm font-bold text-yellow-800">Transport & Hostel</td>
                  </tr>
                  {renderFieldRow('Transport Required', editedStudent.transportRequired ? 'Yes' : 'No', 'transportRequired', false)}
                  {editedStudent.transportRequired &&
                <>
                      {renderFieldRow('Pickup Point', editedStudent.pickupPoint, 'pickupPoint', false)}
                      {renderFieldRow('Preferred Route', editedStudent.preferredRoute, 'preferredRoute', false)}
                    </>
                }
                  {renderFieldRow('Hostel Required', editedStudent.hostelRequired ? 'Yes' : 'No', 'hostelRequired', false)}
                  {editedStudent.hostelRequired &&
                <>
                      {renderFieldRow('Hostel Type', editedStudent.hostelType, 'hostelType', false)}
                      {renderFieldRow('Room Preference', editedStudent.roomPreference, 'roomPreference', false)}
                      {renderFieldRow('Mess Preference', editedStudent.messPreference, 'messPreference', false)}
                    </>
                }
                </tbody>
              </table>
            </div>
          </Card>
        }

        {/* Documents Tab */}
        {activeTab === 'documents' &&
        <Card className="overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Document Verification</h3>
                <div className="flex gap-4 text-sm">
                  <span className="text-green-600 font-medium">{docStats.verified} Verified</span>
                  <span className="text-amber-600 font-medium">{docStats.submitted - docStats.verified} Pending</span>
                  <span className="text-red-600 font-medium">{docStats.total - docStats.submitted} Missing</span>
                </div>
              </div>
            </div>

            {/* Document Stats */}
            <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 border-b">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{docStats.total}</p>
                <p className="text-xs text-gray-500">Total Required</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-600">{docStats.submitted}</p>
                <p className="text-xs text-gray-500">Submitted</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{docStats.verified}</p>
                <p className="text-xs text-gray-500">Verified</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{missingDocs.missing.length + missingDocs.conditional.length}</p>
                <p className="text-xs text-gray-500">Missing</p>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* All Documents List */}
              {documentConfigs.map((docConfig) => {
              const doc = editedStudent.documents.find((d) => d.key === docConfig.key);
              const isSubmitted = doc?.submitted || false;
              const isVerified = doc?.verified || false;
              const isRequired = docConfig.required;
              const isConditionallyRequired = missingDocs.conditional.some((c) => c.doc === docConfig.name);

              return (
                <div
                  key={docConfig.key}
                  className={`p-4 rounded-lg border-2 ${
                  isVerified ?
                  'bg-green-50 border-green-200' :
                  isSubmitted ?
                  'bg-amber-50 border-amber-200' :
                  isRequired || isConditionallyRequired ?
                  'bg-red-50 border-red-300' :
                  'bg-gray-50 border-gray-200'}`
                  }>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {isVerified ?
                      <CheckCircleIcon className="w-6 h-6 text-green-600" /> :
                      isSubmitted ?
                      <AlertCircleIcon className="w-6 h-6 text-amber-600" /> :

                      <XCircleIcon className="w-6 h-6 text-red-400" />
                      }
                        <div>
                          <p className="font-medium text-gray-900 flex items-center gap-2">
                            {docConfig.name}
                            {isRequired && <Badge variant="danger" className="text-xs">Required</Badge>}
                            {isConditionallyRequired && !isRequired && <Badge variant="warning" className="text-xs">Required*</Badge>}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">{docConfig.category}</p>
                          {isVerified && doc?.verifiedBy &&
                        <p className="text-xs text-green-600">Verified by {doc.verifiedBy} on {doc.verifiedDate}</p>
                        }
                          {doc?.remarks && <p className="text-xs text-amber-700 mt-1">{doc.remarks}</p>}
                          {!isSubmitted && (isRequired || isConditionallyRequired) &&
                        <p className="text-xs text-red-600 font-medium">Document not uploaded</p>
                        }
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {isSubmitted && !isVerified &&
                      <Button variant="success" size="sm" onClick={() => handleVerifyDocument(docConfig.key)}>
                            <CheckIcon className="w-4 h-4 mr-1" />
                            Verify
                          </Button>
                      }
                        {isSubmitted &&
                      <Button variant="ghost" size="sm" title="View Document">
                            <EyeIcon className="w-4 h-4" />
                          </Button>
                      }
                        {!isSubmitted &&
                      <Button variant="outline" size="sm">
                            <UploadIcon className="w-4 h-4 mr-1" />
                            Upload
                          </Button>
                      }
                      </div>
                    </div>
                  </div>);

            })}
            </div>
          </Card>
        }

        {/* Save Button */}
        {editMode &&
        <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveChanges} disabled={saving}>
              {saving && <RefreshCwIcon className="w-4 h-4 mr-2 animate-spin" />}
              <SaveIcon className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        }
      </div>);

  }

  // Search Page View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ClipboardCheckIcon className="w-7 h-7" />
            Verify Info & Documents
          </h1>
          <p className="text-sm text-gray-500 mt-1">Search students to verify their information and documents</p>
        </div>
        <Badge variant="info">{studentsData.length} Total Students</Badge>
      </div>

      {/* Search Panel */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <SearchIcon className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Search Filters</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
            {showAdvancedFilters ?
            <><ChevronUpIcon className="w-4 h-4 mr-1" /> Hide Filters</> :

            <><ChevronDownIcon className="w-4 h-4 mr-1" /> More Filters</>
            }
          </Button>
        </div>

        {/* Basic Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GR No.</label>
            <Input placeholder="Enter GR Number" value={filters.grNo} onChange={(e) => handleFilterChange('grNo', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SU ID</label>
            <Input placeholder="Enter SU ID" value={filters.suId} onChange={(e) => handleFilterChange('suId', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <Input placeholder="Enter First Name" value={filters.firstName} onChange={(e) => handleFilterChange('firstName', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <Input placeholder="Enter Last Name" value={filters.lastName} onChange={(e) => handleFilterChange('lastName', e.target.value)} />
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters &&
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <select value={filters.class} onChange={(e) => handleFilterChange('class', e.target.value)} className={selectClass}>
                {classOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
              <select value={filters.section} onChange={(e) => handleFilterChange('section', e.target.value)} className={selectClass}>
                {sectionOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={filters.category} onChange={(e) => handleFilterChange('category', e.target.value)} className={selectClass}>
                {categoryOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Verification Status</label>
              <select value={filters.verificationStatus} onChange={(e) => handleFilterChange('verificationStatus', e.target.value)} className={selectClass}>
                {verificationStatusOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
          </div>
        }

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
          <Button variant="primary" leftIcon={<SearchIcon className="h-4 w-4" />} onClick={handleSearch}>
            Search Students
          </Button>
          <Button variant="outline" leftIcon={<RotateCcwIcon className="h-4 w-4" />} onClick={handleReset}>
            Reset Filters
          </Button>
        </div>
      </Card>

      {/* Results */}
      {hasSearched &&
      <Card>
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">{filteredStudents.length} students found</span>
                {filteredStudents.length > 0 &&
              <div className="flex gap-2">
                    <Badge variant="success">{filteredStudents.filter((s) => s.verificationStatus === 'Verified').length} Verified</Badge>
                    <Badge variant="warning">{filteredStudents.filter((s) => s.verificationStatus === 'Partial').length} Partial</Badge>
                    <Badge variant="danger">{filteredStudents.filter((s) => s.verificationStatus === 'Pending').length} Pending</Badge>
                  </div>
              }
              </div>
              {filteredStudents.length > 0 &&
            <Button variant="outline" size="sm">
                  <DownloadIcon className="w-4 h-4 mr-1" /> Export
                </Button>
            }
            </div>
          </div>

          {filteredStudents.length > 0 ?
        <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">IDs</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Photo</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documents</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issues</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => {
                const docStats = getDocumentStats(student.documents);
                const warnings = validateStudent(student);
                const errorCount = warnings.filter((w) => w.severity === 'error').length;
                const warningCount = warnings.filter((w) => w.severity === 'warning').length;

                return (
                  <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {student.photo ?
                        <img src={student.photo} alt={student.firstName} className="w-10 h-10 rounded-full object-cover border-2 border-gray-200" /> :

                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center border-2 border-red-200">
                                <UserIcon className="w-5 h-5 text-red-400" />
                              </div>
                        }
                            <div>
                              <p className="font-medium text-gray-900">{student.fullName}</p>
                              <p className="text-xs text-gray-500">{student.gender}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-mono text-gray-700">{student.grNo}</p>
                          <p className="text-xs font-mono text-gray-500">{student.suId}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-gray-700">{student.class}-{student.section}</p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary" className="text-xs">{student.category}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          {student.photo ?
                      <Badge variant="success"><CameraIcon className="w-3 h-3 mr-1" />Yes</Badge> :

                      <Badge variant="danger"><XCircleIcon className="w-3 h-3 mr-1" />No</Badge>
                      }
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{docStats.submitted}/{docStats.total}</span>
                            {docStats.submitted === docStats.total ?
                        <CheckCircleIcon className="w-4 h-4 text-green-500" /> :

                        <AlertTriangleIcon className="w-4 h-4 text-amber-500" />
                        }
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            {errorCount > 0 && <Badge variant="danger" className="text-xs">{errorCount} errors</Badge>}
                            {warningCount > 0 && <Badge variant="warning" className="text-xs">{warningCount} warn</Badge>}
                            {errorCount === 0 && warningCount === 0 && <Badge variant="success" className="text-xs">OK</Badge>}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={student.verificationStatus === 'Verified' ? 'success' : student.verificationStatus === 'Partial' ? 'warning' : 'danger'}>
                            {student.verificationStatus}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Button variant="outline" size="sm" onClick={() => handleViewStudent(student)}>
                            <EyeIcon className="w-4 h-4 mr-1" />
                            Verify
                          </Button>
                        </td>
                      </tr>);

              })}
                </tbody>
              </table>
            </div> :

        <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="rounded-full bg-gray-100 p-4 mb-4">
                <UserIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Students Found</h3>
              <p className="text-sm text-gray-500 text-center max-w-md">
                No students match your search criteria. Try adjusting your filters.
              </p>
            </div>
        }
        </Card>
      }

      {/* Initial State */}
      {!hasSearched &&
      <Card>
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="rounded-full bg-blue-50 p-4 mb-4">
              <SearchIcon className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Search for Students</h3>
            <p className="text-sm text-gray-500 text-center max-w-md">
              Use the search filters above to find students whose information and documents need verification.
            </p>
          </div>
        </Card>
      }
    </div>);

}

export default VerifyInfoDocuments;