import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  AlertCircle,
  Building2,
  CheckCircle,
  ChevronRight,
  Clock3,
  Download,
  Eye,
  Landmark,
  MapPin,
  Plus,
  Printer,
  RotateCcw,
  Save,
  School,
  ShieldAlert,
  ShieldCheck,
  Upload,
  Users,
  X
} from 'lucide-react';

type FormValue = string;
type FormData = Record<string, FormValue>;
type FieldKind = 'text' | 'email' | 'tel' | 'date' | 'number' | 'url' | 'password' | 'color' | 'textarea' | 'select' | 'heading';

interface FieldSpec {
  key: string;
  label: string;
  kind?: FieldKind;
  options?: string[];
  helper?: string;
  placeholder?: string;
  full?: boolean;
  readOnly?: boolean;
}

interface CheckGroupSpec {
  key: string;
  label: string;
  options: string[];
  helper?: string;
}

interface UploadSpec {
  key: string;
  label: string;
  accept?: string;
  helper?: string;
}

interface ProfileSectionSpec {
  title: string;
  description: string;
  fields: FieldSpec[];
  checks?: CheckGroupSpec[];
  uploads?: UploadSpec[];
}

const yesNo = ['Yes', 'No'];
const profileSections: ProfileSectionSpec[] = [
  {
    title: 'Basic Institute Information',
    description: 'The master record used across receipts, reports, certificates, salary slips, and ERP screens.',
    fields: [
      { key: 'fullName', label: 'Institute Full Name', helper: 'Official legal name as registered; used on official documents.', full: true },
      { key: 'shortName', label: 'Short Name / Display Name', helper: 'Short display name for the ERP and informal documents.' },
      { key: 'localName', label: 'Institute Name in Local Language' },
      { key: 'instituteType', label: 'Institute Type', kind: 'select', options: ['School', 'College', 'Coaching Institute', 'Polytechnic', 'University', 'Junior College', 'Senior Secondary School', 'Primary School', 'Other'] },
      { key: 'instituteCategory', label: 'Institute Category', kind: 'select', options: ['Private Unaided', 'Private Aided', 'Government', 'Government-Aided', 'Central Government', 'Autonomous', 'Deemed University', 'Other'] },
      { key: 'schoolType', label: 'School Type', kind: 'select', options: ['Co-education', 'Boys', 'Girls'] },
      { key: 'residentialType', label: 'Residential Type', kind: 'select', options: ['Day School', 'Boarding School', 'Day cum Boarding'] },
      { key: 'establishedYear', label: 'Year of Establishment', kind: 'number', helper: 'Year the institute was founded.' },
      { key: 'commencementYear', label: 'Year of Commencement', kind: 'number', helper: 'Year teaching and operations began.' },
      { key: 'motto', label: 'Institute Motto / Tagline', full: true },
      { key: 'description', label: 'Institute Description', kind: 'textarea', full: true, helper: 'A brief description for official communications.' }
    ],
    checks: [{ key: 'instructionMedium', label: 'Medium of Instruction', options: ['English', 'Hindi', 'Gujarati', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Urdu', 'Other'] }]
  },
  {
    title: 'Legal & Registration Details',
    description: 'Government recognition, registration, UDISE, trust, NOC, and RTE records.',
    fields: [
      { key: 'legalRegistration', label: 'Government Registration', kind: 'heading' },
      { key: 'registrationNumber', label: 'Registration Number' },
      { key: 'registeredWith', label: 'Registered With', kind: 'select', options: ['State Education Department', 'State Government', 'Central Government', 'Trust Registrar', 'Other'] },
      { key: 'registrationDate', label: 'Registration Date', kind: 'date' },
      { key: 'registrationValidity', label: 'Registration Validity', kind: 'select', options: ['Permanent', 'Valid Until Date'] },
      { key: 'registrationValidUntil', label: 'Registration Valid Until', kind: 'date' },
      { key: 'udiseCode', label: 'UDISE Code', helper: '11-digit Unified District Information System for Education code.' },
      { key: 'diseCode', label: 'DISE Code (Old)' },
      { key: 'trustRegistration', label: 'Trust / Society Registration', kind: 'heading' },
      { key: 'managedBy', label: 'Managed By' },
      { key: 'trustRegistrationNumber', label: 'Trust Registration Number' },
      { key: 'trustRegisteredUnder', label: 'Registered Under' },
      { key: 'trustPan', label: 'Trust PAN Number' },
      { key: 'trust80g', label: 'Trust 80G Registration' },
      { key: 'trust12a', label: 'Trust 12A Registration' },
      { key: 'trustRegistrationDate', label: 'Trust Registration Date', kind: 'date' },
      { key: 'nocDetails', label: 'No Objection Certificate (NOC)', kind: 'heading' },
      { key: 'nocNumber', label: 'NOC Number' },
      { key: 'nocIssuedBy', label: 'NOC Issued By' },
      { key: 'nocValidUntil', label: 'NOC Valid Until', kind: 'date' },
      { key: 'recognitionStatus', label: 'Recognition Status', kind: 'select', options: ['Recognized', 'Provisionally Recognized', 'Not Recognized', 'Applied'] },
      { key: 'recognizedBy', label: 'Recognized By' },
      { key: 'recognitionNumber', label: 'Recognition Number' },
      { key: 'recognitionValidUntil', label: 'Recognition Valid Until', kind: 'date' },
      { key: 'rteRegistered', label: 'RTE Registered?', kind: 'select', options: yesNo },
      { key: 'rteRegistrationNumber', label: 'RTE Registration Number' },
      { key: 'rteFreeSeats', label: 'RTE Free Seats (%)', kind: 'number' },
      { key: 'rteReimbursement', label: 'RTE Reimbursement Rate', helper: 'Annual reimbursement per eligible student.' }
    ],
    uploads: [
      { key: 'registrationCertificate', label: 'Registration Certificate', accept: '.pdf,image/*' },
      { key: 'trustDeed', label: 'Trust Deed / Registration Document', accept: '.pdf,image/*' },
      { key: 'nocDocument', label: 'NOC Document', accept: '.pdf,image/*' },
      { key: 'recognitionDocument', label: 'Recognition Certificate', accept: '.pdf,image/*' }
    ]
  },
  {
    title: 'Affiliation & Board Details',
    description: 'Board affiliation drives curriculum, examinations, and compliance reporting.',
    fields: [
      { key: 'primaryBoard', label: 'Primary Board', kind: 'select', options: ['CBSE', 'ICSE', 'Gujarat State Board', 'SSC State Board', 'IGCSE', 'IB', 'NIOS', 'Other'] },
      { key: 'affiliationNumber', label: 'Affiliation Number' },
      { key: 'affiliationType', label: 'Affiliation Type', kind: 'select', options: ['Provisional', 'Permanent', 'Under Renewal'] },
      { key: 'affiliationValidFrom', label: 'Affiliation Valid From', kind: 'date' },
      { key: 'affiliationValidUntil', label: 'Affiliation Valid Until', kind: 'date' },
      { key: 'classesAffiliated', label: 'Classes Affiliated', kind: 'select', options: ['Pre-Primary', 'Primary (1–5)', 'Upper Primary (6–8)', 'Secondary (9–10)', 'Senior Secondary (11–12)', 'All Classes'] },
      { key: 'boardSchoolCode', label: 'School Code (Board)' },
      { key: 'secondaryAffiliation', label: 'Secondary Affiliation?', kind: 'select', options: yesNo },
      { key: 'secondaryBoard', label: 'Secondary Board' },
      { key: 'cbseRegion', label: 'Board Region / Regional Office' },
      { key: 'state', label: 'State', kind: 'select', options: ['Gujarat', 'Maharashtra', 'Delhi', 'Rajasthan', 'Other'] },
      { key: 'district', label: 'District' },
      { key: 'blockTaluka', label: 'Block / Taluka' },
      { key: 'zone', label: 'Zone' },
      { key: 'naacStatus', label: 'NAAC Accreditation', kind: 'select', options: ['Not Applicable', 'Not Accredited', 'Applied', 'Accredited'] },
      { key: 'naacGrade', label: 'NAAC Grade', kind: 'select', options: ['A++', 'A+', 'A', 'B++', 'B+', 'B', 'C', 'D', 'Not Applicable'] },
      { key: 'naacValidUntil', label: 'NAAC Valid Until', kind: 'date' },
      { key: 'isoCertified', label: 'ISO Certified?', kind: 'select', options: yesNo },
      { key: 'isoNumber', label: 'ISO Number' },
      { key: 'isoValidUntil', label: 'ISO Valid Until', kind: 'date' },
      { key: 'otherCertifications', label: 'Other Certifications', kind: 'textarea', full: true }
    ],
    uploads: [{ key: 'affiliationDocument', label: 'Affiliation Certificate', accept: '.pdf,image/*' }]
  },
  {
    title: 'Contact & Communication Details',
    description: 'Primary contacts used on official documents, notifications, and parent communications.',
    fields: [
      { key: 'primaryPhone', label: 'Main Phone Number', kind: 'tel' },
      { key: 'alternatePhone', label: 'Alternate Phone', kind: 'tel' },
      { key: 'mobileNumber', label: 'Mobile Number', kind: 'tel' },
      { key: 'whatsappNumber', label: 'WhatsApp Number', kind: 'tel' },
      { key: 'faxNumber', label: 'Fax Number', kind: 'tel' },
      { key: 'officialEmail', label: 'Official Email (Primary)', kind: 'email' },
      { key: 'officeEmail', label: 'Admin / Office Email', kind: 'email' },
      { key: 'admissionEmail', label: 'Admission Enquiry Email', kind: 'email' },
      { key: 'feeEmail', label: 'Fee Related Email', kind: 'email' },
      { key: 'grievanceEmail', label: 'Grievance Email', kind: 'email' },
      { key: 'financeEmail', label: 'Finance / Accounts Email', kind: 'email' },
      { key: 'boardEmail', label: 'Board / Examination Email', kind: 'email' },
      { key: 'senderEmail', label: 'ERP Sender Email (From)', kind: 'email' },
      { key: 'replyToEmail', label: 'ERP Reply-To Email', kind: 'email' },
      { key: 'smsSenderId', label: 'SMS Sender ID', helper: 'Usually a six-character sender ID.' },
      { key: 'principalName', label: 'Principal Name' },
      { key: 'principalMobile', label: 'Principal Mobile', kind: 'tel' },
      { key: 'principalEmail', label: 'Principal Email', kind: 'email' },
      { key: 'principalDesignation', label: 'Principal Designation on Documents' },
      { key: 'vicePrincipalName', label: 'Vice Principal Name' },
      { key: 'vicePrincipalMobile', label: 'Vice Principal Mobile', kind: 'tel' },
      { key: 'officeManager', label: 'Admin / Office Manager' },
      { key: 'officeManagerMobile', label: 'Admin Mobile', kind: 'tel' },
      { key: 'financeHead', label: 'Finance / Accounts Head' },
      { key: 'financeHeadMobile', label: 'Finance Mobile', kind: 'tel' },
      { key: 'admissionContact', label: 'Admission Contact' },
      { key: 'admissionContactMobile', label: 'Admission Contact Mobile', kind: 'tel' },
      { key: 'emergencyNumber', label: 'Emergency Contact Number', kind: 'tel', full: true }
    ]
  },
  {
    title: 'Address & Location Details',
    description: 'Physical and correspondence addresses should match official government records.',
    fields: [
      { key: 'addressLine1', label: 'Physical Address Line 1', full: true },
      { key: 'addressLine2', label: 'Physical Address Line 2', full: true },
      { key: 'addressLine3', label: 'Physical Address Line 3' },
      { key: 'landmark', label: 'Landmark' },
      { key: 'area', label: 'Area / Locality' },
      { key: 'city', label: 'City / Town' },
      { key: 'districtAddress', label: 'District' },
      { key: 'stateAddress', label: 'State' },
      { key: 'country', label: 'Country', kind: 'select', options: ['India', 'Other'] },
      { key: 'pinCode', label: 'PIN Code' },
      { key: 'postalSame', label: 'Postal Address Same as Physical?', kind: 'select', options: yesNo },
      { key: 'postalAddress', label: 'Postal / Correspondence Address', full: true },
      { key: 'mapLink', label: 'Google Maps Link', kind: 'url', full: true },
      { key: 'latitude', label: 'Latitude' },
      { key: 'longitude', label: 'Longitude' },
      { key: 'campusArea', label: 'Total Campus Area' },
      { key: 'builtUpArea', label: 'Built-up Area' },
      { key: 'buildingCount', label: 'Number of Buildings', kind: 'number' },
      { key: 'floorCount', label: 'Number of Floors' },
      { key: 'classroomCount', label: 'Number of Classrooms', kind: 'number' },
      { key: 'studentCapacity', label: 'Total Capacity (Students)', kind: 'number' }
    ]
  },
  {
    title: 'Logo, Seal & Branding',
    description: 'Images and visual identity used on ERP pages and generated documents.',
    fields: [
      { key: 'primaryBrandColor', label: 'Primary Brand Color', kind: 'color' },
      { key: 'secondaryBrandColor', label: 'Secondary Brand Color', kind: 'color' },
      { key: 'textBrandColor', label: 'Text Color', kind: 'color' },
      { key: 'backgroundBrandColor', label: 'Background Color', kind: 'color' },
      { key: 'customLetterhead', label: 'Use Custom Letterhead?', kind: 'select', options: yesNo },
      { key: 'headerHeight', label: 'Document Header Height (px)', kind: 'number' },
      { key: 'footerHeight', label: 'Document Footer Height (px)', kind: 'number' },
      { key: 'showSeal', label: 'Show Seal on Documents?', kind: 'select', options: yesNo },
      { key: 'sealPosition', label: 'Seal Position', kind: 'select', options: ['Bottom Left', 'Bottom Right', 'Center'] }
    ],
    uploads: [
      { key: 'schoolLogo', label: 'Main School Logo', accept: 'image/png,image/jpeg', helper: 'PNG/JPG; recommended 500 × 500 px with transparent background.' },
      { key: 'darkLogo', label: 'Logo for Dark Backgrounds', accept: 'image/png,image/jpeg' },
      { key: 'favicon', label: 'School Favicon', accept: 'image/png,image/x-icon' },
      { key: 'schoolSeal', label: 'Official School Seal / Stamp', accept: 'image/png,image/jpeg' },
      { key: 'principalSignature', label: 'Principal Signature', accept: 'image/png,image/jpeg', helper: 'Restrict access and audit authorized document use.' },
      { key: 'letterheadFile', label: 'Custom Letterhead Template', accept: '.pdf,image/*' }
    ]
  },
  {
    title: 'Academic Configuration',
    description: 'Academic-year structure, classes, school timings, grading, and language settings.',
    fields: [
      { key: 'academicStartMonth', label: 'Academic Year Starts', kind: 'select', options: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] },
      { key: 'academicEndMonth', label: 'Academic Year Ends', kind: 'select', options: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] },
      { key: 'academicYearFormat', label: 'Academic Year Format', kind: 'select', options: ['2025-26', '2025-2026', '2025'] },
      { key: 'currentAcademicYear', label: 'Current Academic Year', readOnly: true, helper: 'Controlled by the Academic Session module.' },
      { key: 'termStructure', label: 'Term / Semester Structure', kind: 'select', options: ['2 Terms', '3 Terms', '4 Quarters', '2 Semesters', 'Annual', 'Other'] },
      { key: 'term1Name', label: 'Term 1 Name' },
      { key: 'term1From', label: 'Term 1 From' },
      { key: 'term1To', label: 'Term 1 To' },
      { key: 'term2Name', label: 'Term 2 Name' },
      { key: 'term2From', label: 'Term 2 From' },
      { key: 'term2To', label: 'Term 2 To' },
      { key: 'term3Name', label: 'Term 3 Name' },
      { key: 'term3From', label: 'Term 3 From' },
      { key: 'term3To', label: 'Term 3 To' },
      { key: 'sectionsOffered', label: 'Default Sections', helper: 'Comma-separated section names, for example A, B, C, D.' },
      { key: 'maxStudentsPerSection', label: 'Max Students per Section', kind: 'number' },
      { key: 'schoolStartTime', label: 'School Start Time' },
      { key: 'schoolEndTime', label: 'School End Time' },
      { key: 'officeStartTime', label: 'Office Hours Start' },
      { key: 'officeEndTime', label: 'Office Hours End' },
      { key: 'workingSaturday', label: 'Working Saturday', kind: 'select', options: ['Every Saturday', 'Alternate Saturday', 'No Saturdays'] },
      { key: 'gradingSystem', label: 'Grading System', kind: 'select', options: ['CBSE 10-Point GPA', 'Percentage', 'CGPA (10 point)', 'Grade (A–F)', 'Custom'] },
      { key: 'passPercentage', label: 'Pass Percentage', kind: 'number' },
      { key: 'firstLanguage', label: 'First Language' },
      { key: 'secondLanguage', label: 'Second Language' },
      { key: 'thirdLanguage', label: 'Third Language' },
      { key: 'additionalLanguages', label: 'Additional Languages', full: true }
    ],
    checks: [
      { key: 'classesOffered', label: 'Classes / Grades Offered', options: ['Play Group', 'Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'] },
      { key: 'streamsOffered', label: 'Streams Offered (Class 11–12)', options: ['Science (PCM)', 'Science (PCB)', 'Commerce', 'Arts / Humanities', 'Vocational', 'Computer Science', 'Home Science'] },
      { key: 'workingDays', label: 'Working Days', options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }
    ]
  },
  {
    title: 'Bank Account Details',
    description: 'Fee collection and other institutional bank accounts, along with payment-gateway configuration.',
    fields: [
      { key: 'primaryAccountHolder', label: 'Primary Account Holder' },
      { key: 'primaryBankName', label: 'Bank Name' },
      { key: 'primaryAccountNumber', label: 'Account Number' },
      { key: 'primaryAccountType', label: 'Account Type', kind: 'select', options: ['Current Account', 'Savings Account', 'Other'] },
      { key: 'primaryIfsc', label: 'IFSC Code' },
      { key: 'primaryMicr', label: 'MICR Code' },
      { key: 'primaryBankBranch', label: 'Bank Branch' },
      { key: 'primaryBankAddress', label: 'Branch Address' },
      { key: 'primaryAccountPurpose', label: 'Account Purpose' },
      { key: 'showBankOnReceipt', label: 'Show on Fee Receipt?', kind: 'select', options: yesNo },
      { key: 'onlinePayments', label: 'Online Payment Enabled?', kind: 'select', options: yesNo },
      { key: 'upiId', label: 'UPI ID' },
      { key: 'paymentGateway', label: 'Payment Gateway', kind: 'select', options: ['Razorpay', 'PayU', 'CCAvenue', 'Paytm', 'Instamojo', 'Cashfree', 'Other'] },
      { key: 'merchantId', label: 'Merchant ID' },
      { key: 'paymentApiKey', label: 'API Key', kind: 'password' },
      { key: 'paymentApiSecret', label: 'API Secret', kind: 'password' },
      { key: 'webhookUrl', label: 'Webhook URL', kind: 'url', readOnly: true },
      { key: 'paymentTestMode', label: 'Test Mode?', kind: 'select', options: yesNo }
    ],
    uploads: [{ key: 'paymentQrCode', label: 'UPI QR Code Image', accept: 'image/*' }]
  },
  {
    title: 'Social Media & Online Presence',
    description: 'Public URLs shown on approved document footers, email footers, and parent portals.',
    fields: [
      { key: 'websiteUrl', label: 'Official Website', kind: 'url' },
      { key: 'parentPortalUrl', label: 'Parent Portal URL', kind: 'url' },
      { key: 'studentPortalUrl', label: 'Student Portal URL', kind: 'url' },
      { key: 'feePortalUrl', label: 'Online Fee Payment URL', kind: 'url' },
      { key: 'facebookUrl', label: 'Facebook', kind: 'url' },
      { key: 'instagramUrl', label: 'Instagram', kind: 'url' },
      { key: 'twitterUrl', label: 'Twitter / X', kind: 'url' },
      { key: 'youtubeUrl', label: 'YouTube', kind: 'url' },
      { key: 'linkedinUrl', label: 'LinkedIn', kind: 'url' },
      { key: 'whatsappChannel', label: 'WhatsApp Channel', kind: 'url' }
    ],
    checks: [{ key: 'socialLinkLocations', label: 'Show Social Links On', options: ['Email Footers', 'Parent Portal', 'Fee Receipts', 'Certificates'] }]
  },
  {
    title: 'Document & Certificate Settings',
    description: 'Controls the information and presentation used by generated ERP documents.',
    fields: [
      { key: 'documentPrimaryLanguage', label: 'Primary Document Language' },
      { key: 'documentSecondaryLanguage', label: 'Secondary Document Language' },
      { key: 'showBilingual', label: 'Bilingual Documents?', kind: 'select', options: ['Yes — English + Secondary', 'No — Primary Only'] },
      { key: 'footerLine1', label: 'Document Footer Line 1', full: true },
      { key: 'footerLine2', label: 'Document Footer Line 2', full: true },
      { key: 'footerLine3', label: 'Document Footer Line 3', full: true },
      { key: 'receiptShowLogo', label: 'Fee Receipt: Show Logo?', kind: 'select', options: yesNo },
      { key: 'receiptShowAddress', label: 'Fee Receipt: Show Address?', kind: 'select', options: yesNo },
      { key: 'receiptShowContact', label: 'Fee Receipt: Show Contact?', kind: 'select', options: yesNo },
      { key: 'receiptShowBank', label: 'Fee Receipt: Show Bank Details?', kind: 'select', options: yesNo },
      { key: 'receiptShowQr', label: 'Fee Receipt: Show UPI QR?', kind: 'select', options: yesNo },
      { key: 'receiptDeclaration', label: 'Receipt Declaration Text', kind: 'textarea', full: true },
      { key: 'tcFormat', label: 'Transfer Certificate Format', kind: 'select', options: ['CBSE Standard Format', 'State Board Format', 'Custom'] },
      { key: 'tcShowSignature', label: 'TC: Show Principal Signature?', kind: 'select', options: yesNo },
      { key: 'tcShowSeal', label: 'TC: Show School Seal?', kind: 'select', options: yesNo },
      { key: 'tcDeclaration', label: 'TC Declaration Text', kind: 'textarea', full: true },
      { key: 'salaryShowLogo', label: 'Salary Slip: Show Logo?', kind: 'select', options: yesNo },
      { key: 'salaryShowPf', label: 'Salary Slip: Show PF Account Number?', kind: 'select', options: yesNo },
      { key: 'salaryShowEsi', label: 'Salary Slip: Show ESI Number?', kind: 'select', options: yesNo },
      { key: 'salaryDeclaration', label: 'Salary Slip Declaration', kind: 'textarea', full: true },
      { key: 'reportCardTitle', label: 'Report Card Title' },
      { key: 'reportCardShowCbseLogo', label: 'Report Card: Show CBSE Logo?', kind: 'select', options: yesNo },
      { key: 'reportCardShowClassTeacher', label: 'Report Card: Show Class Teacher Signature?', kind: 'select', options: yesNo },
      { key: 'reportCardShowPrincipal', label: 'Report Card: Show Principal Signature?', kind: 'select', options: yesNo },
      { key: 'reportCardPrincipalName', label: 'Principal Name on Report Card' },
      { key: 'reportCardDesignation', label: 'Designation on Report Card' },
      { key: 'certificateBorder', label: 'Certificate Border Style', kind: 'select', options: ['Gold Border', 'Classic', 'Modern', 'None'] },
      { key: 'certificateBackground', label: 'Certificate Background', kind: 'select', options: ['Plain White', 'Watermark', 'Custom'] },
      { key: 'certificateWatermark', label: 'Show School Name Watermark?', kind: 'select', options: yesNo },
      { key: 'paperSize', label: 'Paper Size', kind: 'select', options: ['A4', 'Letter', 'Legal'] },
      { key: 'orientation', label: 'Orientation', kind: 'select', options: ['Portrait', 'Landscape'] },
      { key: 'fontFamily', label: 'Font Family', kind: 'select', options: ['Arial', 'Times New Roman', 'Calibri'] },
      { key: 'fontSize', label: 'Body Font Size (pt)', kind: 'number' },
      { key: 'documentMargin', label: 'Margin (mm)' , kind: 'number' }
    ]
  },
  {
    title: 'Tax & Compliance Details',
    description: 'Statutory identifiers used on invoices, payroll, and compliance reports.',
    fields: [
      { key: 'panNumber', label: 'PAN Number' },
      { key: 'panName', label: 'PAN Name (as on card)' },
      { key: 'panType', label: 'PAN Type', kind: 'select', options: ['Trust', 'Society', 'Company', 'Individual', 'HUF', 'Firm'] },
      { key: 'incomeTaxCircle', label: 'Income Tax Circle' },
      { key: 'assessmentYear', label: 'Assessment Year' },
      { key: '12aNumber', label: '12A Registration Number' },
      { key: '12aFrom', label: '12A Valid From', kind: 'date' },
      { key: '12aUntil', label: '12A Valid Until', kind: 'date' },
      { key: '80gNumber', label: '80G Registration Number' },
      { key: '80gFrom', label: '80G Valid From', kind: 'date' },
      { key: '80gUntil', label: '80G Valid Until', kind: 'date' },
      { key: 'gstRegistered', label: 'GST Registered?', kind: 'select', options: yesNo },
      { key: 'gstNumber', label: 'GST Number' },
      { key: 'gstStateCode', label: 'GST State Code' },
      { key: 'gstType', label: 'GST Registration Type', kind: 'select', options: ['Regular', 'Composition', 'Other'] },
      { key: 'gstOnHostel', label: 'GST on Hostel?', kind: 'select', options: yesNo },
      { key: 'gstOnTransport', label: 'GST on Transport?', kind: 'select', options: yesNo },
      { key: 'tanNumber', label: 'TAN Number' },
      { key: 'tanJurisdiction', label: 'TAN Jurisdiction' },
      { key: 'professionalTaxNumber', label: 'Professional Tax Registration Number' },
      { key: 'professionalTaxState', label: 'Professional Tax State' },
      { key: 'professionalTaxDeductedFrom', label: 'Professional Tax Deducted From' },
      { key: 'pfRegistration', label: 'PF Registration Number' },
      { key: 'epfoSubOffice', label: 'EPFO Sub-Office' },
      { key: 'employerPfRate', label: 'Employer PF Rate (%)', kind: 'number' },
      { key: 'employeePfRate', label: 'Employee PF Rate (%)', kind: 'number' },
      { key: 'esiNumber', label: 'ESI Registration Number' },
      { key: 'esiApplicable', label: 'ESI Applicable?', kind: 'select', options: yesNo },
      { key: 'employerEsiRate', label: 'Employer ESI Rate (%)', kind: 'number' },
      { key: 'employeeEsiRate', label: 'Employee ESI Rate (%)', kind: 'number' }
    ],
    uploads: [
      { key: 'panDocument', label: 'PAN Card', accept: '.pdf,image/*' },
      { key: '12aDocument', label: '12A Certificate', accept: '.pdf,image/*' },
      { key: '80gDocument', label: '80G Certificate', accept: '.pdf,image/*' },
      { key: 'gstDocument', label: 'GST Certificate', accept: '.pdf,image/*' }
    ]
  },
  {
    title: 'Trust / Society / Management Details',
    description: 'Governing-body records, School Management Committee, and Parent Teacher Association.',
    fields: [
      { key: 'managementType', label: 'Management Type', kind: 'select', options: ['Educational Trust', 'Society', 'Company Section 8', 'Government', 'Other'] },
      { key: 'managementName', label: 'Managing Trust / Society Name' },
      { key: 'registeredOfficeAddress', label: 'Registered Office Address', full: true },
      { key: 'trustFoundedYear', label: 'Trust / Society Founded', kind: 'number' },
      { key: 'smcFormed', label: 'SMC Formed?', kind: 'select', options: yesNo },
      { key: 'smcChairman', label: 'SMC Chairman' },
      { key: 'smcFormedOn', label: 'SMC Formed On', kind: 'date' },
      { key: 'smcValidUntil', label: 'SMC Valid Until', kind: 'date' },
      { key: 'smcMemberCount', label: 'SMC Member Count', kind: 'number' },
      { key: 'ptaActive', label: 'PTA Active?', kind: 'select', options: yesNo },
      { key: 'ptaPresident', label: 'PTA President' },
      { key: 'ptaSecretary', label: 'PTA Secretary' }
    ]
  }
];

const initialProfile: FormData = {
  fullName: 'Sunshine Public School', shortName: 'Sunshine School', localName: 'સનશાઇન પબ્લિક સ્કૂલ',
  instituteType: 'School', instituteCategory: 'Private Unaided', schoolType: 'Co-education', residentialType: 'Day School',
  establishedYear: '1995', commencementYear: '1996', motto: 'Learning with purpose', description: 'A community-focused school providing a supportive, inclusive learning environment.',
  instructionMedium: 'English|Gujarati', registrationNumber: 'REG-GJ-1995-04128', registeredWith: 'State Education Department', registrationDate: '1995-06-15', registrationValidity: 'Permanent', registrationValidUntil: '', udiseCode: '24070101234', diseCode: '', managedBy: 'Sunshine Education Trust', trustRegistrationNumber: 'TRUST-GJ-1994-00981', trustRegisteredUnder: 'Gujarat Public Trusts Act', trustPan: 'AAATS1234A', trust80g: '80G/GJ/2002/2481', trust12a: '12A/TRUST/1996/891', trustRegistrationDate: '1994-12-12', nocNumber: 'NOC-GJ-EDU-1995-318', nocIssuedBy: 'District Education Officer, Ahmedabad', nocValidUntil: '', recognitionStatus: 'Recognized', recognizedBy: 'Gujarat Secondary and Higher Secondary Education Board', recognitionNumber: 'REC-GJ-1996-4128', recognitionValidUntil: '2030-03-31', rteRegistered: 'Yes', rteRegistrationNumber: 'RTE-GJ-2010-124', rteFreeSeats: '25', rteReimbursement: '₹ 18,000 per year per student',
  primaryBoard: 'Gujarat State Board', affiliationNumber: 'GSEB-04128', affiliationType: 'Permanent', affiliationValidFrom: '1996-04-01', affiliationValidUntil: '2030-03-31', classesAffiliated: 'All Classes', boardSchoolCode: 'GJ-56789', secondaryAffiliation: 'No', secondaryBoard: '', cbseRegion: 'Ahmedabad Regional Office', state: 'Gujarat', district: 'Ahmedabad', blockTaluka: 'Daskroi', zone: 'Ahmedabad Urban', naacStatus: 'Not Applicable', naacGrade: 'Not Applicable', naacValidUntil: '', isoCertified: 'No', isoNumber: '', isoValidUntil: '', otherCertifications: 'Green School Initiative',
  primaryPhone: '+91 79 4000 1200', alternatePhone: '+91 79 4000 1201', mobileNumber: '+91 98765 43210', whatsappNumber: '+91 98765 43210', faxNumber: '', officialEmail: 'principal@sunshine.edu.in', officeEmail: 'office@sunshine.edu.in', admissionEmail: 'admissions@sunshine.edu.in', feeEmail: 'fees@sunshine.edu.in', grievanceEmail: 'grievance@sunshine.edu.in', financeEmail: 'accounts@sunshine.edu.in', boardEmail: 'exams@sunshine.edu.in', senderEmail: 'noreply@sunshine.edu.in', replyToEmail: 'office@sunshine.edu.in', smsSenderId: 'SUNSCH', principalName: 'Dr. R. K. Sharma', principalMobile: '+91 98765 43211', principalEmail: 'principal@sunshine.edu.in', principalDesignation: 'Principal', vicePrincipalName: 'Mrs. S. Patel', vicePrincipalMobile: '+91 98765 43212', officeManager: 'Mr. A. Mehta', officeManagerMobile: '+91 98765 43213', financeHead: 'Mrs. N. Shah', financeHeadMobile: '+91 98765 43214', admissionContact: 'Mr. V. Patel', admissionContactMobile: '+91 98765 43215', emergencyNumber: '+91 98765 43210',
  addressLine1: '123, Education Lane, Science City Road', addressLine2: 'Near Science City Circle', addressLine3: '', landmark: 'Science City', area: 'Sola', city: 'Ahmedabad', districtAddress: 'Ahmedabad', stateAddress: 'Gujarat', country: 'India', pinCode: '380060', postalSame: 'Yes', postalAddress: '123, Education Lane, Science City Road, Ahmedabad, Gujarat 380060', mapLink: 'https://maps.google.com/?q=Sunshine+Public+School+Ahmedabad', latitude: '23.0734', longitude: '72.5178', campusArea: '4.2 Acres', builtUpArea: '45,000 sqft', buildingCount: '6', floorCount: 'G + 3', classroomCount: '45', studentCapacity: '1,800',
  primaryBrandColor: '#1B4F72', secondaryBrandColor: '#F1C40F', textBrandColor: '#2C3E50', backgroundBrandColor: '#FFFFFF', customLetterhead: 'No', headerHeight: '120', footerHeight: '60', showSeal: 'Yes', sealPosition: 'Bottom Left',
  academicStartMonth: 'April', academicEndMonth: 'March', academicYearFormat: '2025-26', currentAcademicYear: '2025-26', termStructure: '3 Terms', term1Name: 'First Term', term1From: 'April', term1To: 'August', term2Name: 'Second Term', term2From: 'September', term2To: 'December', term3Name: 'Third Term', term3From: 'January', term3To: 'March', sectionsOffered: 'A, B, C, D', maxStudentsPerSection: '40', schoolStartTime: '07:30 AM', schoolEndTime: '02:30 PM', officeStartTime: '08:00 AM', officeEndTime: '05:00 PM', workingSaturday: 'Alternate Saturday', gradingSystem: 'Percentage', passPercentage: '33', firstLanguage: 'English', secondLanguage: 'Gujarati', thirdLanguage: 'Hindi', additionalLanguages: 'Sanskrit', classesOffered: 'Nursery|LKG|UKG|Class 1|Class 2|Class 3|Class 4|Class 5|Class 6|Class 7|Class 8|Class 9|Class 10|Class 11|Class 12', streamsOffered: 'Science (PCM)|Science (PCB)|Commerce|Arts / Humanities', workingDays: 'Monday|Tuesday|Wednesday|Thursday|Friday|Saturday',
  primaryAccountHolder: 'Sunshine Education Trust', primaryBankName: 'State Bank of India', primaryAccountNumber: 'XXXXXXXXXXXX1234', primaryAccountType: 'Current Account', primaryIfsc: 'SBIN0001234', primaryMicr: '380002001', primaryBankBranch: 'Science City Branch, Ahmedabad', primaryBankAddress: 'Science City Road, Ahmedabad, Gujarat', primaryAccountPurpose: 'Fee Collection — Primary', showBankOnReceipt: 'Yes', onlinePayments: 'Yes', upiId: 'sunshineschool@sbi', paymentGateway: 'Razorpay', merchantId: 'rzp_live_demo123', paymentApiKey: '••••••••••••••••', paymentApiSecret: '••••••••••••••••', webhookUrl: 'https://erp.sunshine.edu.in/payment/webhook', paymentTestMode: 'No',
  websiteUrl: 'https://www.sunshine.edu.in', parentPortalUrl: 'https://parent.sunshine.edu.in', studentPortalUrl: 'https://student.sunshine.edu.in', feePortalUrl: 'https://fees.sunshine.edu.in', facebookUrl: 'https://facebook.com/sunshine-school', instagramUrl: 'https://instagram.com/sunshine.school', twitterUrl: '', youtubeUrl: 'https://youtube.com/@sunshine-school', linkedinUrl: '', whatsappChannel: '', socialLinkLocations: 'Email Footers|Parent Portal',
  documentPrimaryLanguage: 'English', documentSecondaryLanguage: 'Gujarati', showBilingual: 'No — Primary Only', footerLine1: 'Sunshine Public School — Learning with purpose', footerLine2: 'GSEB Affiliation No: GSEB-04128 | Phone: +91 79 4000 1200', footerLine3: 'www.sunshine.edu.in', receiptShowLogo: 'Yes', receiptShowAddress: 'Yes', receiptShowContact: 'Yes', receiptShowBank: 'Yes', receiptShowQr: 'Yes', receiptDeclaration: 'This is a computer-generated receipt and does not require a physical signature.', tcFormat: 'State Board Format', tcShowSignature: 'Yes', tcShowSeal: 'Yes', tcDeclaration: 'Certified that the above information is true and correct.', salaryShowLogo: 'Yes', salaryShowPf: 'Yes', salaryShowEsi: 'No', salaryDeclaration: 'This is a computer-generated payslip.', reportCardTitle: 'Progress Report Card', reportCardShowCbseLogo: 'No', reportCardShowClassTeacher: 'Yes', reportCardShowPrincipal: 'Yes', reportCardPrincipalName: 'Dr. R. K. Sharma', reportCardDesignation: 'Principal', certificateBorder: 'Gold Border', certificateBackground: 'Plain White', certificateWatermark: 'No', paperSize: 'A4', orientation: 'Portrait', fontFamily: 'Arial', fontSize: '10', documentMargin: '15',
  panNumber: 'AAATS1234A', panName: 'Sunshine Education Trust', panType: 'Trust', incomeTaxCircle: 'Ahmedabad-I, Ward 2', assessmentYear: '2025-26', '12aNumber': '12A/TRUST/1996/891', '12aFrom': '1996-04-01', '12aUntil': '', '80gNumber': '80G/GJ/2002/2481', '80gFrom': '2002-04-01', '80gUntil': '2026-03-31', gstRegistered: 'No', gstNumber: '', gstStateCode: '24 — Gujarat', gstType: 'Regular', gstOnHostel: 'No', gstOnTransport: 'No', tanNumber: 'AHMS12345B', tanJurisdiction: 'Ahmedabad', professionalTaxNumber: 'GJ-PT-024812', professionalTaxState: 'Gujarat', professionalTaxDeductedFrom: 'Employee Salaries', pfRegistration: 'GJ/AHM/004128/000', epfoSubOffice: 'Ahmedabad', employerPfRate: '12', employeePfRate: '12', esiNumber: '', esiApplicable: 'No', employerEsiRate: '3.25', employeeEsiRate: '0.75',
  managementType: 'Educational Trust', managementName: 'Sunshine Education Trust', registeredOfficeAddress: '456, Trust Road, Ahmedabad, Gujarat 380009', trustFoundedYear: '1994', smcFormed: 'Yes', smcChairman: 'Mr. Suresh Kumar (Parent Representative)', smcFormedOn: '2025-04-01', smcValidUntil: '2027-03-31', smcMemberCount: '15', ptaActive: 'Yes', ptaPresident: 'Mrs. Anita Roy (Parent)', ptaSecretary: 'Mr. Ravi Singh (Parent)',
  registrationCertificate: 'registration_certificate.pdf', trustDeed: 'sunshine_trust_deed.pdf', nocDocument: 'school_noc.pdf', recognitionDocument: 'recognition_certificate.pdf', affiliationDocument: 'gseb_affiliation.pdf', schoolLogo: 'sunshine_logo.png', darkLogo: 'sunshine_logo_dark.png', favicon: 'sunshine_favicon.png', schoolSeal: 'sunshine_seal.png', principalSignature: 'principal_signature.png', letterheadFile: '', paymentQrCode: 'fee_payment_qr.png', panDocument: 'trust_pan.pdf', '12aDocument': '12a_certificate.pdf', '80gDocument': '80g_certificate.pdf', gstDocument: ''
};

function FieldGrid({ fields, data, onChange, columns = 2 }: { fields: FieldSpec[]; data: FormData; onChange: (key: string, value: string) => void; columns?: 2 | 3 }) {
  const gridClass = columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2';
  return (
    <div className={`grid grid-cols-1 ${gridClass} gap-4`}>
      {fields.map((field) => {
        if (field.kind === 'heading') {
          return <div key={field.key} className="md:col-span-2 border-t pt-3 mt-1 text-xs font-bold uppercase tracking-wider text-gray-500">{field.label}</div>;
        }
        const value = data[field.key] ?? '';
        const spanClass = field.full ? (columns === 3 ? 'md:col-span-3' : 'md:col-span-2') : '';
        const common = { label: field.label, value, disabled: field.readOnly, helperText: field.helper, placeholder: field.placeholder, onChange: (event: React.ChangeEvent<HTMLInputElement>) => onChange(field.key, event.target.value) };
        return (
          <div key={field.key} className={spanClass}>
            {field.kind === 'select' ? (
              <Select label={field.label} options={(field.options || []).map((option) => ({ value: option, label: option }))} value={value} onChange={(event) => onChange(field.key, event.target.value)} />
            ) : field.kind === 'textarea' ? (
              <div><label className="mb-1 block text-sm font-medium text-gray-700">{field.label}</label><textarea value={value} onChange={(event) => onChange(field.key, event.target.value)} rows={3} className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500" />{field.helper && <p className="mt-1 text-xs text-gray-500">{field.helper}</p>}</div>
            ) : (
              <Input {...common} type={field.kind || 'text'} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function CheckboxGroup({ group, value, onChange }: { group: CheckGroupSpec; value: string; onChange: (key: string, value: string) => void }) {
  const selected = value ? value.split('|').filter(Boolean) : [];
  return (
    <div className="mt-5 rounded-lg border border-gray-200 p-4">
      <p className="mb-3 text-sm font-semibold text-gray-800">{group.label}</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {group.options.map((option) => (
          <label key={option} className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={selected.includes(option)} onChange={(event) => {
              const next = event.target.checked ? [...selected, option] : selected.filter((item) => item !== option);
              onChange(group.key, next.join('|'));
            }} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            {option}
          </label>
        ))}
      </div>
      {group.helper && <p className="mt-2 text-xs text-gray-500">{group.helper}</p>}
    </div>
  );
}

function FileUploadGrid({ files, data, onChange }: { files: UploadSpec[]; data: FormData; onChange: (key: string, value: string) => void }) {
  if (!files.length) return null;
  return (
    <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {files.map((file) => (
        <div key={file.key} className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-3">
          <p className="mb-2 text-sm font-medium text-gray-800">{file.label}</p>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50">
            <Upload className="h-4 w-4" /> Choose file
            <input type="file" accept={file.accept} className="sr-only" onChange={(event) => {
              const selectedFile = event.currentTarget.files?.[0];
              if (selectedFile) onChange(file.key, selectedFile.name);
            }} />
          </label>
          <p className="mt-2 truncate text-xs text-gray-500">{data[file.key] || 'No file selected'}</p>
          {file.helper && <p className="mt-1 text-xs text-gray-400">{file.helper}</p>}
        </div>
      ))}
    </div>
  );
}

function SectionCard({ number, title, description, children }: { number: number; title: string; description: string; children: React.ReactNode }) {
  return (
    <section id={`institute-section-${number}`} className="scroll-mt-6">
      <Card noPadding>
        <div className="border-b border-gray-100 px-5 py-4">
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-700">{String(number).padStart(2, '0')}</span>
            <div><h2 className="font-semibold text-gray-900">{title}</h2><p className="mt-1 text-sm text-gray-500">{description}</p></div>
          </div>
        </div>
        <div className="p-5">{children}</div>
      </Card>
    </section>
  );
}

interface BankAccount {
  id: number;
  name: string;
  bank: string;
  type: string;
  purpose: string;
  status: string;
}

interface ManagementMember {
  id: number;
  name: string;
  designation: string;
  contact: string;
}

interface BranchRecord {
  id: number;
  students: number;
  capacity: number;
  fields: FormData;
}

const branchFieldsBase: FormData = {
  name: '', shortName: '', code: '', isMain: 'No', status: 'Active', establishedYear: '',
  sameAffiliation: 'Yes', udiseCode: '', cbseAffiliation: '', boardSchoolCode: '', registrationNumber: '', recognitionNumber: '',
  phone: '', mobile: '', email: '', whatsapp: '', principal: '', principalMobile: '', principalEmail: '',
  addressLine1: '', addressLine2: '', city: '', district: '', state: 'Gujarat', pinCode: '', mapLink: '', latitude: '', longitude: '',
  classesOffered: 'Pre-Primary|Primary|Middle|Secondary', capacity: '800', currentStrength: '0', startTime: '07:30 AM', endTime: '02:30 PM', sameTiming: 'Yes',
  separateBank: 'No', accountHolder: '', bankName: '', accountNumber: '', ifsc: '', accountType: 'Current',
  useMainLogo: 'Yes', separateLetterhead: 'No', branchLogoFile: '', branchLetterheadFile: '', documentDisplay: 'Main Name + Branch Name', customDisplayName: '',
  shareStudentDatabase: 'Yes', shareStaffDatabase: 'Yes', shareFeeStructure: 'Yes', separateFeeStructure: 'No', shareReports: 'Yes', separateNumberSeries: 'No', branchAdmin: ''
};

const branchFormSections: { key: string; label: string; fields: FieldSpec[]; checks?: CheckGroupSpec[] }[] = [
  { key: 'basic', label: 'Basic', fields: [
    { key: 'name', label: 'Branch Name' }, { key: 'shortName', label: 'Branch Short Name' }, { key: 'code', label: 'Branch Code (max 6 characters)', helper: 'Used in branch-specific document and number series.' }, { key: 'isMain', label: 'Main Campus?', kind: 'select', options: yesNo }, { key: 'status', label: 'Status', kind: 'select', options: ['Active', 'Inactive'] }, { key: 'establishedYear', label: 'Established Year', kind: 'number' }
  ] },
  { key: 'affiliation', label: 'Affiliation', fields: [
    { key: 'sameAffiliation', label: 'Same as Main Campus Affiliation?', kind: 'select', options: yesNo }, { key: 'udiseCode', label: 'Branch UDISE Code' }, { key: 'cbseAffiliation', label: 'CBSE / Board Affiliation Number' }, { key: 'boardSchoolCode', label: 'School Code (Board)' }, { key: 'registrationNumber', label: 'Branch Registration Number' }, { key: 'recognitionNumber', label: 'Branch Recognition Number' }
  ] },
  { key: 'contact', label: 'Contact', fields: [
    { key: 'phone', label: 'Branch Phone', kind: 'tel' }, { key: 'mobile', label: 'Branch Mobile', kind: 'tel' }, { key: 'email', label: 'Branch Email', kind: 'email' }, { key: 'whatsapp', label: 'Branch WhatsApp', kind: 'tel' }, { key: 'principal', label: 'Branch Principal' }, { key: 'principalMobile', label: 'Principal Mobile', kind: 'tel' }, { key: 'principalEmail', label: 'Principal Email', kind: 'email' }
  ] },
  { key: 'address', label: 'Address', fields: [
    { key: 'addressLine1', label: 'Address Line 1', full: true }, { key: 'addressLine2', label: 'Address Line 2', full: true }, { key: 'city', label: 'City' }, { key: 'district', label: 'District' }, { key: 'state', label: 'State' }, { key: 'pinCode', label: 'PIN Code' }, { key: 'mapLink', label: 'Google Maps Link', kind: 'url', full: true }, { key: 'latitude', label: 'Latitude' }, { key: 'longitude', label: 'Longitude' }
  ] },
  { key: 'academic', label: 'Academic', fields: [
    { key: 'capacity', label: 'Total Capacity', kind: 'number' }, { key: 'currentStrength', label: 'Current Strength (read-only)', kind: 'number', readOnly: true }, { key: 'startTime', label: 'School Start Time' }, { key: 'endTime', label: 'School End Time' }, { key: 'sameTiming', label: 'Same Timing as Main Campus?', kind: 'select', options: yesNo }
  ], checks: [{ key: 'classesOffered', label: 'Classes Offered', options: ['Pre-Primary', 'Primary', 'Middle', 'Secondary', 'Senior Secondary'] }] },
  { key: 'bank', label: 'Bank', fields: [
    { key: 'separateBank', label: 'Separate Bank Account?', kind: 'select', options: yesNo }, { key: 'accountHolder', label: 'Account Holder' }, { key: 'bankName', label: 'Bank Name' }, { key: 'accountNumber', label: 'Account Number' }, { key: 'ifsc', label: 'IFSC Code' }, { key: 'accountType', label: 'Account Type', kind: 'select', options: ['Current', 'Savings', 'Other'] }
  ] },
  { key: 'branding', label: 'Branding', fields: [
    { key: 'useMainLogo', label: 'Use Main Campus Logo?', kind: 'select', options: yesNo }, { key: 'separateLetterhead', label: 'Branch-Specific Letterhead?', kind: 'select', options: yesNo }, { key: 'documentDisplay', label: 'Branch Display on Documents', kind: 'select', options: ['Main Name + Branch Name', 'Branch Name Only', 'Custom'] }, { key: 'customDisplayName', label: 'Custom Document Name', full: true }
  ] },
  { key: 'configuration', label: 'Configuration', fields: [
    { key: 'shareStudentDatabase', label: 'Shared Student Database?', kind: 'select', options: yesNo }, { key: 'shareStaffDatabase', label: 'Shared Staff Database?', kind: 'select', options: yesNo }, { key: 'shareFeeStructure', label: 'Shared Fee Structure?', kind: 'select', options: yesNo }, { key: 'separateFeeStructure', label: 'Separate Fee Structure?', kind: 'select', options: yesNo }, { key: 'shareReports', label: 'Combined Reports?', kind: 'select', options: yesNo }, { key: 'separateNumberSeries', label: 'Branch-Specific Number Series?', kind: 'select', options: yesNo }, { key: 'branchAdmin', label: 'Branch Admin ERP User' }
  ] }
];

function makeBranch(id: number, fields: FormData, students: number, capacity: number): BranchRecord {
  return { id, students, capacity, fields: { ...branchFieldsBase, ...fields } };
}

function makeDefaultBranchForm(): FormData {
  return { ...branchFieldsBase, code: 'BR-05', establishedYear: String(new Date().getFullYear()) };
}

function saveDownload(filename: string, content: string, type = 'application/json') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function InstituteProfileBranchManagement() {
  const [activeTab, setActiveTab] = useState<'Institute Profile' | 'Branches'>('Institute Profile');
  const [profile, setProfile] = useState<FormData>({ ...initialProfile });
  const [savedProfile, setSavedProfile] = useState<FormData>({ ...initialProfile });
  const [lastUpdated, setLastUpdated] = useState(new Date('2025-04-01T09:00:00'));
  const [updatedBy, setUpdatedBy] = useState('Admin User');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    { id: 1, name: 'Fee Collection A/c', bank: 'SBI', type: 'Current', purpose: 'Fee Income', status: 'Active' },
    { id: 2, name: 'Salary Payment A/c', bank: 'HDFC Bank', type: 'Current', purpose: 'Payroll', status: 'Active' },
    { id: 3, name: 'Vendor Payment A/c', bank: 'SBI', type: 'Current', purpose: 'Expenses', status: 'Active' },
    { id: 4, name: 'Government Grant A/c', bank: 'PNB', type: 'Savings', purpose: 'Grants', status: 'Active' }
  ]);
  const [savedBankAccounts, setSavedBankAccounts] = useState<BankAccount[]>([
    { id: 1, name: 'Fee Collection A/c', bank: 'SBI', type: 'Current', purpose: 'Fee Income', status: 'Active' },
    { id: 2, name: 'Salary Payment A/c', bank: 'HDFC Bank', type: 'Current', purpose: 'Payroll', status: 'Active' },
    { id: 3, name: 'Vendor Payment A/c', bank: 'SBI', type: 'Current', purpose: 'Expenses', status: 'Active' },
    { id: 4, name: 'Government Grant A/c', bank: 'PNB', type: 'Savings', purpose: 'Grants', status: 'Active' }
  ]);
  const [managementMembers, setManagementMembers] = useState<ManagementMember[]>([
    { id: 1, name: 'Mr. Rajesh Mehta', designation: 'Chairman / President', contact: '+91 98765 43001' },
    { id: 2, name: 'Mrs. Sunita Jain', designation: 'Secretary', contact: '+91 98765 43002' },
    { id: 3, name: 'Mr. Vikram Patel', designation: 'Treasurer', contact: '+91 98765 43003' },
    { id: 4, name: 'Dr. R. K. Sharma', designation: 'Principal', contact: '+91 98765 43211' }
  ]);
  const [savedManagementMembers, setSavedManagementMembers] = useState<ManagementMember[]>([
    { id: 1, name: 'Mr. Rajesh Mehta', designation: 'Chairman / President', contact: '+91 98765 43001' },
    { id: 2, name: 'Mrs. Sunita Jain', designation: 'Secretary', contact: '+91 98765 43002' },
    { id: 3, name: 'Mr. Vikram Patel', designation: 'Treasurer', contact: '+91 98765 43003' },
    { id: 4, name: 'Dr. R. K. Sharma', designation: 'Principal', contact: '+91 98765 43211' }
  ]);

  const [branches, setBranches] = useState<BranchRecord[]>([
    makeBranch(1, { name: 'Main Campus', shortName: 'Main Campus', code: 'MAIN', isMain: 'Yes', status: 'Active', establishedYear: '1995', city: 'Ahmedabad', district: 'Ahmedabad', state: 'Gujarat', pinCode: '380060', addressLine1: '123, Education Lane, Science City Road', addressLine2: 'Sola, Ahmedabad', phone: '+91 79 4000 1200', mobile: '+91 98765 43210', email: 'main@sunshine.edu.in', whatsapp: '+91 98765 43210', principal: 'Dr. R. K. Sharma', principalMobile: '+91 98765 43211', principalEmail: 'principal@sunshine.edu.in', capacity: '1800', currentStrength: '1800', udiseCode: '24070101234', branchAdmin: 'Admin User' }, 1800, 1800),
    makeBranch(2, { name: 'City Centre Branch', shortName: 'City Centre', code: 'CITY', isMain: 'No', status: 'Active', establishedYear: '2005', city: 'Ahmedabad', district: 'Ahmedabad', state: 'Gujarat', pinCode: '380009', addressLine1: '456, Central Avenue', addressLine2: 'Navrangpura, Ahmedabad', phone: '+91 79 4000 2200', email: 'city@sunshine.edu.in', principal: 'Mrs. S. Patel', principalMobile: '+91 98765 43212', capacity: '1400', currentStrength: '1200', branchAdmin: 'City Branch Admin' }, 1200, 1400),
    makeBranch(3, { name: 'North Zone Campus', shortName: 'North Zone', code: 'NORTH', isMain: 'No', status: 'Active', establishedYear: '2018', city: 'Gandhinagar', district: 'Gandhinagar', state: 'Gujarat', pinCode: '382021', addressLine1: '789, Knowledge Park', addressLine2: 'Sector 21, Gandhinagar', principal: 'Mr. A. Singh', principalMobile: '+91 98765 43213', capacity: '1000', currentStrength: '850', branchAdmin: 'North Campus Admin' }, 850, 1000),
    makeBranch(4, { name: 'West Branch', shortName: 'West Campus', code: 'WEST', isMain: 'No', status: 'Inactive', establishedYear: '2020', city: 'Ahmedabad', district: 'Ahmedabad', state: 'Gujarat', pinCode: '380054', addressLine1: '42, West Ring Road', addressLine2: 'Ahmedabad', principal: 'Mrs. K. Desai', principalMobile: '+91 98765 43214', capacity: '600', currentStrength: '400', branchAdmin: 'West Branch Admin' }, 400, 600)
  ]);
  const [branchFormOpen, setBranchFormOpen] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState<number | null>(null);
  const [branchForm, setBranchForm] = useState<FormData>(makeDefaultBranchForm());
  const [branchFormSection, setBranchFormSection] = useState('basic');
  const [branchSearch, setBranchSearch] = useState('');

  const updateProfile = (key: string, value: string) => setProfile((previous) => ({ ...previous, [key]: value }));
  const showToastMessage = (text: string) => {
    setToast(text);
    window.setTimeout(() => setToast(''), 3200);
  };

  const saveAllChanges = () => {
    setSavedProfile({ ...profile });
    setSavedBankAccounts(bankAccounts.map((account) => ({ ...account })));
    setSavedManagementMembers(managementMembers.map((member) => ({ ...member })));
    const now = new Date();
    setLastUpdated(now);
    setUpdatedBy('Admin User');
    showToastMessage('Institute profile changes saved.');
  };

  const resetToSaved = () => {
    setProfile({ ...savedProfile });
    setBankAccounts(savedBankAccounts.map((account) => ({ ...account })));
    setManagementMembers(savedManagementMembers.map((member) => ({ ...member })));
    showToastMessage('Unsaved institute profile changes were reset.');
  };

  const openNewBranch = () => {
    const nextCode = `BR${String(branches.length + 1).padStart(2, '0')}`;
    setBranchForm({ ...makeDefaultBranchForm(), code: nextCode });
    setEditingBranchId(null);
    setBranchFormSection('basic');
    setBranchFormOpen(true);
  };

  const openEditBranch = (branch: BranchRecord) => {
    setBranchForm({ ...branch.fields });
    setEditingBranchId(branch.id);
    setBranchFormSection('basic');
    setBranchFormOpen(true);
  };

  const saveBranch = () => {
    const name = branchForm.name?.trim();
    const code = branchForm.code?.trim().toUpperCase();
    if (!name || !code || !branchForm.city?.trim()) {
      showToastMessage('Branch name, code, and city are required.');
      setBranchFormSection('basic');
      return;
    }
    if (code.length > 6) {
      showToastMessage('Branch code must be no longer than 6 characters.');
      setBranchFormSection('basic');
      return;
    }
    if (branches.some((branch) => branch.id !== editingBranchId && branch.fields.code.toUpperCase() === code)) {
      showToastMessage('Branch code must be unique.');
      setBranchFormSection('basic');
      return;
    }
    const currentMain = branches.find((branch) => branch.fields.isMain === 'Yes');
    if (currentMain?.id === editingBranchId && branchForm.isMain !== 'Yes') {
      showToastMessage('Keep one campus designated as the main campus.');
      setBranchFormSection('basic');
      return;
    }
    const normalized = { ...branchForm, name, code };
    setBranches((previous) => {
      const prepared = previous.map((branch) => branchForm.isMain === 'Yes' ? { ...branch, fields: { ...branch.fields, isMain: 'No' } } : branch);
      if (editingBranchId !== null) {
        return prepared.map((branch) => branch.id === editingBranchId ? { ...branch, fields: normalized, students: Number(normalized.currentStrength || branch.students), capacity: Number(normalized.capacity || branch.capacity) } : branch);
      }
      const id = Math.max(0, ...prepared.map((branch) => branch.id)) + 1;
      const students = Number(normalized.currentStrength || 0);
      return [...prepared, { id, students, capacity: Number(normalized.capacity || 0), fields: normalized }];
    });
    setBranchFormOpen(false);
    setLastUpdated(new Date());
    setUpdatedBy('Admin User');
    showToastMessage(editingBranchId ? 'Branch details updated.' : 'Branch added successfully.');
  };

  const toggleBranchStatus = (branch: BranchRecord) => {
    if (branch.fields.isMain === 'Yes' && branch.fields.status === 'Active') {
      showToastMessage('The main campus cannot be deactivated.');
      return;
    }
    setBranches((previous) => previous.map((item) => item.id === branch.id ? { ...item, fields: { ...item.fields, status: item.fields.status === 'Active' ? 'Inactive' : 'Active' } } : item));
    setLastUpdated(new Date());
    setUpdatedBy('Admin User');
    showToastMessage(`${branch.fields.name} status updated.`);
  };

  const exportBranches = () => saveDownload('institute-branches.json', JSON.stringify(branches.map((branch) => ({ ...branch.fields, students: branch.students, capacity: branch.capacity })), null, 2));
  const filteredBranches = useMemo(() => branches.filter((branch) => `${branch.fields.name} ${branch.fields.city} ${branch.fields.code} ${branch.fields.principal}`.toLowerCase().includes(branchSearch.toLowerCase())), [branches, branchSearch]);
  const totalStudents = branches.reduce((sum, branch) => sum + branch.students, 0);
  const activeBranches = branches.filter((branch) => branch.fields.status === 'Active').length;
  const inactiveBranches = branches.length - activeBranches;
  const mainBranch = branches.find((branch) => branch.fields.isMain === 'Yes');
  const formattedUpdated = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(lastUpdated);

  const renderProfile = () => (
    <div className="space-y-5">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <div className="flex items-start gap-3"><ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" /><div><p className="font-semibold">Changes affect all ERP-generated documents</p><p className="mt-1">Confirm legal names, affiliation, contact, bank, branding, and compliance information before saving.</p></div></div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {profileSections.map((section, index) => <a key={section.title} href={`#institute-section-${index + 1}`} className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 hover:border-blue-300 hover:text-blue-700"><span className="text-blue-600">{String(index + 1).padStart(2, '0')}</span>{section.title}<ChevronRight className="ml-auto h-3.5 w-3.5" /></a>)}
      </div>
      {profileSections.map((section, index) => (
        <SectionCard key={section.title} number={index + 1} title={section.title} description={section.description}>
          <FieldGrid fields={section.fields} data={profile} onChange={updateProfile} />
          {section.checks?.map((group) => <CheckboxGroup key={group.key} group={group} value={profile[group.key] || ''} onChange={updateProfile} />)}
          {section.uploads && <FileUploadGrid files={section.uploads} data={profile} onChange={updateProfile} />}
          {index === 4 && <div className="mt-5 overflow-hidden rounded-xl border border-blue-100 bg-sky-50"><div className="relative flex min-h-[150px] items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#e0f2fe_25%,transparent_25%),linear-gradient(225deg,#e0f2fe_25%,transparent_25%),linear-gradient(45deg,#dbeafe_25%,transparent_25%),linear-gradient(315deg,#dbeafe_25%,#f8fafc_25%)] bg-[length:44px_44px]"><div className="absolute left-[18%] top-[30%] h-10 w-24 rounded bg-white/80 shadow-sm" /><div className="absolute right-[20%] top-[45%] h-12 w-28 rounded bg-white/80 shadow-sm" /><div className="absolute bottom-[18%] left-[42%] h-8 w-32 rounded bg-white/80 shadow-sm" /><div className="relative z-10 flex flex-col items-center rounded-xl bg-white px-4 py-3 text-center shadow-lg"><MapPin className="h-6 w-6 text-red-600" /><span className="mt-1 text-xs font-bold text-gray-900">{profile.shortName}</span><span className="text-[10px] text-gray-500">{profile.city}, {profile.stateAddress} {profile.pinCode}</span></div></div><div className="flex flex-wrap items-center justify-between gap-2 border-t border-blue-100 bg-white px-4 py-3 text-xs"><span className="text-gray-500">Map preview · {profile.latitude || 'Latitude'}, {profile.longitude || 'Longitude'}</span><a className="font-semibold text-blue-700 hover:underline" href={profile.mapLink || '#'} target="_blank" rel="noreferrer">Open map link</a></div></div>}
          {index === 7 && (
            <div className="mt-5 overflow-hidden rounded-lg border border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-gray-50 px-4 py-3"><div><h3 className="text-sm font-semibold text-gray-800">All Bank Accounts</h3><p className="text-xs text-gray-500">Accounts are retained in the institute record; use Active status to stop use.</p></div><Button size="sm" variant="outline" onClick={() => setBankAccounts((items) => [...items, { id: Date.now(), name: 'New Account', bank: '', type: 'Current', purpose: '', status: 'Active' }])}><Plus className="h-4 w-4" /> Add Another Bank Account</Button></div>
              <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-white text-xs uppercase text-gray-500"><tr><th className="px-4 py-3">Account Name</th><th className="px-4 py-3">Bank</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Purpose</th><th className="px-4 py-3">Status</th></tr></thead><tbody className="divide-y">{bankAccounts.map((account) => <tr key={account.id}><td className="px-4 py-2"><input value={account.name} onChange={(event) => setBankAccounts((items) => items.map((item) => item.id === account.id ? { ...item, name: event.target.value } : item))} className="w-full rounded border border-gray-200 px-2 py-1" /></td><td className="px-4 py-2"><input value={account.bank} onChange={(event) => setBankAccounts((items) => items.map((item) => item.id === account.id ? { ...item, bank: event.target.value } : item))} className="w-full rounded border border-gray-200 px-2 py-1" /></td><td className="px-4 py-2"><input value={account.type} onChange={(event) => setBankAccounts((items) => items.map((item) => item.id === account.id ? { ...item, type: event.target.value } : item))} className="w-full rounded border border-gray-200 px-2 py-1" /></td><td className="px-4 py-2"><input value={account.purpose} onChange={(event) => setBankAccounts((items) => items.map((item) => item.id === account.id ? { ...item, purpose: event.target.value } : item))} className="w-full rounded border border-gray-200 px-2 py-1" /></td><td className="px-4 py-2"><select value={account.status} onChange={(event) => setBankAccounts((items) => items.map((item) => item.id === account.id ? { ...item, status: event.target.value } : item))} className="rounded border border-gray-200 px-2 py-1"><option>Active</option><option>Inactive</option></select></td></tr>)}</tbody></table></div>
            </div>
          )}
          {index === 11 && (
            <div className="mt-5 overflow-hidden rounded-lg border border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-gray-50 px-4 py-3"><div><h3 className="text-sm font-semibold text-gray-800">Key Management Persons</h3><p className="text-xs text-gray-500">Keep current governing-body contacts for official records.</p></div><Button size="sm" variant="outline" onClick={() => setManagementMembers((items) => [...items, { id: Date.now(), name: '', designation: '', contact: '' }])}><Plus className="h-4 w-4" /> Add Member</Button></div>
              <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-white text-xs uppercase text-gray-500"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Designation</th><th className="px-4 py-3">Contact</th></tr></thead><tbody className="divide-y">{managementMembers.map((member) => <tr key={member.id}><td className="px-4 py-2"><input value={member.name} onChange={(event) => setManagementMembers((items) => items.map((item) => item.id === member.id ? { ...item, name: event.target.value } : item))} className="w-full rounded border border-gray-200 px-2 py-1" /></td><td className="px-4 py-2"><input value={member.designation} onChange={(event) => setManagementMembers((items) => items.map((item) => item.id === member.id ? { ...item, designation: event.target.value } : item))} className="w-full rounded border border-gray-200 px-2 py-1" /></td><td className="px-4 py-2"><input value={member.contact} onChange={(event) => setManagementMembers((items) => items.map((item) => item.id === member.id ? { ...item, contact: event.target.value } : item))} className="w-full rounded border border-gray-200 px-2 py-1" /></td></tr>)}</tbody></table></div>
            </div>
          )}
        </SectionCard>
      ))}
      <Card noPadding>
        <div className="flex flex-col gap-4 border-b border-amber-200 bg-amber-50 px-5 py-4 sm:flex-row sm:items-center"><AlertCircle className="h-5 w-5 shrink-0 text-amber-700" /><p className="text-sm text-amber-900">Saved institute-profile changes can appear on receipts, reports, certificates, and salary slips generated across the ERP.</p></div>
        <div className="flex flex-wrap items-center justify-between gap-3 p-5"><div className="text-xs text-gray-500">Last saved {formattedUpdated} · {updatedBy}</div><div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => setPreviewOpen(true)}><Eye className="h-4 w-4" /> Preview on Sample Document</Button><Button variant="outline" onClick={resetToSaved}><RotateCcw className="h-4 w-4" /> Reset Unsaved</Button><Button onClick={saveAllChanges}><Save className="h-4 w-4" /> Save All Changes</Button></div></div>
      </Card>
    </div>
  );

  const renderBranches = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard title="Total Branches" value={branches.length.toString()} icon={<Building2 className="h-5 w-5" />} tone="blue" />
        <KpiCard title="Active Branches" value={activeBranches.toString()} icon={<CheckCircle className="h-5 w-5" />} tone="green" />
        <KpiCard title="Inactive Branches" value={inactiveBranches.toString()} icon={<AlertCircle className="h-5 w-5" />} tone="amber" />
        <KpiCard title="Main Campus" value={mainBranch?.fields.name || 'Not set'} icon={<School className="h-5 w-5" />} tone="purple" />
        <KpiCard title="Total Students" value={totalStudents.toLocaleString('en-IN')} icon={<Users className="h-5 w-5" />} tone="cyan" />
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <Card title="All Branches" headerAction={<div className="flex gap-2"><Button size="sm" variant="outline" onClick={exportBranches}><Download className="h-4 w-4" /> Export</Button><Button size="sm" onClick={openNewBranch}><Plus className="h-4 w-4" /> Add New Branch</Button></div>} noPadding>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4"><p className="text-sm text-gray-500">Manage branch campuses linked to the institute master record.</p><Input value={branchSearch} onChange={(event) => setBranchSearch(event.target.value)} placeholder="Search branches…" className="w-full sm:max-w-xs" /></div>
          <Table columns={[
            { key: 'branch', header: 'Branch Name', render: (branch: BranchRecord) => <div className="min-w-[190px]"><div className="flex items-center gap-2 font-medium text-gray-900">{branch.fields.name}{branch.fields.isMain === 'Yes' && <Badge variant="primary">HQ</Badge>}</div><div className="mt-1 text-xs text-gray-500">{branch.fields.addressLine1}, {branch.fields.city}</div></div> },
            { key: 'code', header: 'Branch Code', render: (branch: BranchRecord) => <span className="font-mono text-xs">{branch.fields.code}</span> },
            { key: 'location', header: 'Location', render: (branch: BranchRecord) => <span>{branch.fields.city}, {branch.fields.state}</span> },
            { key: 'students', header: 'Students', render: (branch: BranchRecord) => <div><span className="font-medium">{branch.students.toLocaleString('en-IN')}</span><span className="block text-xs text-gray-500">Capacity {branch.capacity.toLocaleString('en-IN')}</span></div> },
            { key: 'principal', header: 'Principal / Head', render: (branch: BranchRecord) => <div><span>{branch.fields.principal || '—'}</span><span className="block text-xs text-gray-500">{branch.fields.principalEmail || branch.fields.email || '—'}</span></div> },
            { key: 'status', header: 'Status', render: (branch: BranchRecord) => <Badge variant={branch.fields.status === 'Active' ? 'success' : 'secondary'}>{branch.fields.status}</Badge> },
            { key: 'actions', header: 'Actions', render: (branch: BranchRecord) => <div className="flex min-w-[145px] gap-1"><Button size="xs" variant="outline" onClick={() => openEditBranch(branch)}>Edit</Button><Button size="xs" variant="ghost" onClick={() => toggleBranchStatus(branch)}>{branch.fields.status === 'Active' ? 'Deactivate' : 'Activate'}</Button></div> }
          ]} data={filteredBranches} emptyMessage="No branches match your search." />
        </Card>
        <div className="space-y-4">
          <Card title="Branch Configuration"><p className="text-sm text-gray-600">Each branch remains linked to the institute master record. Branch-specific affiliation, address, bank, branding, and configuration can be maintained independently.</p><div className="mt-4 space-y-3 text-xs text-gray-600"><div className="flex gap-2"><ShieldCheck className="h-4 w-4 shrink-0 text-green-600" /><span>Super Admin can add, edit, and deactivate branches.</span></div><div className="flex gap-2"><Eye className="h-4 w-4 shrink-0 text-blue-600" /><span>Principal and Finance roles may view branch details according to their access.</span></div><div className="flex gap-2"><AlertCircle className="h-4 w-4 shrink-0 text-amber-600" /><span>Branch data is never permanently deleted from this page.</span></div></div></Card>
          <Card title="Institute Master Link"><div className="flex items-start gap-3"><Landmark className="h-5 w-5 text-blue-600" /><div><p className="font-medium text-gray-800">{profile.shortName}</p><p className="mt-1 text-xs text-gray-500">{profile.fullName}</p><p className="mt-2 text-xs text-gray-500">{profile.primaryBoard} · {profile.city}, {profile.stateAddress}</p></div></div></Card>
          <Card title="Access Control"><div className="overflow-x-auto"><table className="w-full min-w-[420px] text-left text-[11px]"><thead className="bg-gray-50 text-gray-500"><tr><th className="px-2 py-2">Action</th><th className="px-2 py-2">Super Admin</th><th className="px-2 py-2">Principal</th><th className="px-2 py-2">Finance</th><th className="px-2 py-2">Staff</th></tr></thead><tbody className="divide-y">{[['View Branches', 'Full', 'View', 'View', 'No'], ['Add / Edit Branch', 'Yes', 'No', 'No', 'No'], ['Deactivate Branch', 'Yes', 'No', 'No', 'No'], ['Permanent Delete', 'Never', 'Never', 'Never', 'Never']].map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={`${row[0]}-${index}`} className="px-2 py-2 text-gray-600">{cell}</td>)}</tr>)}</tbody></table></div><p className="mt-3 text-[11px] text-gray-500">Institute profile and sensitive documents remain Super Admin controlled; changes should be audit logged.</p></Card>
        </div>
      </div>
    </div>
  );

  const branchSection = branchFormSections.find((section) => section.key === branchFormSection) || branchFormSections[0];
  const visibleBranchFields = branchSection.key === 'affiliation' && branchForm.sameAffiliation !== 'No'
    ? branchSection.fields.slice(0, 1)
    : branchSection.key === 'bank' && branchForm.separateBank !== 'Yes'
      ? branchSection.fields.slice(0, 1)
      : branchSection.fields;

  return (
    <div className="min-h-screen space-y-6 bg-gray-50/70 p-4 md:p-6">
      <header className="space-y-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs text-gray-500"><span className="font-semibold text-gray-700">School ERP</span><ChevronRight className="h-3 w-3" /><span>Home</span><ChevronRight className="h-3 w-3" /><span>Administration</span><ChevronRight className="h-3 w-3" /><span className="text-gray-800">Institute Profile & Branches</span></div>
            <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700"><School className="h-6 w-6" /></span><div><h1 className="text-2xl font-bold tracking-tight text-gray-900">Institute Profile & Branches</h1><p className="mt-1 text-sm text-gray-500">Institute master record and connected campus locations</p></div></div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={resetToSaved}><RotateCcw className="h-4 w-4" /> Reset to Saved</Button>
            <Button variant="outline" onClick={() => setPreviewOpen(true)}><Eye className="h-4 w-4" /> Preview on Document</Button>
            <Button onClick={saveAllChanges}><Save className="h-4 w-4" /> Save All Changes</Button>
          </div>
        </div>
        <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 md:flex-row md:items-center md:justify-between"><div className="flex items-center gap-2 text-sm font-semibold text-amber-900"><ShieldAlert className="h-5 w-5" /> Super Admin Only — changes here affect all documents, receipts, and reports.</div><div className="flex items-center gap-2 text-xs text-amber-800"><Clock3 className="h-4 w-4" /> Last Updated: {formattedUpdated} · Updated By: {updatedBy}</div></div>
      </header>

      <div className="flex gap-2 border-b border-gray-200">
        {(['Institute Profile', 'Branches'] as const).map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${activeTab === tab ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>{tab === 'Institute Profile' ? <School className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}{tab}</button>)}
      </div>

      {activeTab === 'Institute Profile' ? renderProfile() : renderBranches()}

      {toast && <div className="fixed bottom-5 right-5 z-[70] flex max-w-md items-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm text-white shadow-xl"><CheckCircle className="h-4 w-4 text-green-300" />{toast}<button onClick={() => setToast('')} aria-label="Dismiss"><X className="h-4 w-4" /></button></div>}

      {previewOpen && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-950/60 p-4" role="dialog" aria-modal="true" aria-label="Sample document preview"><div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"><div className="flex items-center justify-between border-b px-6 py-4"><div><h2 className="font-semibold text-gray-900">Sample Fee Receipt Preview</h2><p className="text-xs text-gray-500">Preview using the current unsaved institute profile fields.</p></div><button onClick={() => setPreviewOpen(false)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100" aria-label="Close preview"><X className="h-5 w-5" /></button></div><div className="m-6 border-2 border-slate-300 p-6"><div className="flex items-center gap-4 border-b pb-4"><div className="flex h-16 w-16 items-center justify-center rounded-lg bg-blue-50 text-blue-700"><School className="h-9 w-9" /></div><div className="min-w-0 flex-1 text-center"><p className="text-lg font-bold" style={{ color: profile.primaryBrandColor }}>{profile.fullName}</p><p className="text-xs text-gray-600">{profile.addressLine1}, {profile.city}, {profile.stateAddress} {profile.pinCode}</p><p className="text-xs text-gray-600">{profile.primaryPhone} · {profile.officialEmail}</p><p className="mt-1 text-xs font-semibold text-gray-500">{profile.primaryBoard} · Affiliation No: {profile.affiliationNumber}</p></div></div><div className="mt-5 flex items-center justify-between"><h3 className="text-base font-bold">FEE RECEIPT</h3><span className="text-xs text-gray-500">Receipt No: DEMO-2025-001</span></div><div className="mt-4 grid grid-cols-2 gap-3 text-sm"><p><span className="text-gray-500">Student:</span> Sample Student</p><p><span className="text-gray-500">Class:</span> Class 8-A</p><p><span className="text-gray-500">Academic Year:</span> {profile.currentAcademicYear}</p><p><span className="text-gray-500">Date:</span> 01-Apr-2025</p></div><div className="mt-4 flex justify-between border-y py-3 text-sm"><span>Tuition Fee</span><strong>₹ 25,000</strong></div><div className="flex justify-between py-3 text-sm font-bold"><span>Total Paid</span><span>₹ 25,000</span></div><div className="mt-6 flex justify-between border-t pt-3 text-xs text-gray-500"><span>{profile.footerLine1}</span><span>{profile.principalDesignation}</span></div></div><div className="flex justify-end gap-2 border-t bg-gray-50 px-6 py-4"><Button variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print Preview</Button><Button onClick={() => setPreviewOpen(false)}>Close Preview</Button></div></div></div>}

      {branchFormOpen && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-950/60 p-3" role="dialog" aria-modal="true" aria-label="Branch form"><div className="flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"><div className="flex items-center justify-between border-b px-5 py-4"><div><h2 className="text-lg font-bold text-gray-900">{editingBranchId ? 'Edit Branch' : 'Add New Branch'}</h2><p className="text-xs text-gray-500">Maintain branch details linked to the institute master record.</p></div><button onClick={() => setBranchFormOpen(false)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100" aria-label="Close branch form"><X className="h-5 w-5" /></button></div><div className="flex flex-wrap gap-1 border-b bg-gray-50 px-4 py-2">{branchFormSections.map((section) => <button key={section.key} onClick={() => setBranchFormSection(section.key)} className={`rounded-lg px-3 py-2 text-xs font-semibold ${branchFormSection === section.key ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-white'}`}>{section.label}</button>)}</div><div className="flex-1 overflow-y-auto p-5"><div className="mb-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-800"><strong>Branch setup · {branchSection.label}</strong><span className="ml-2">Fill branch-specific values; inherited affiliation, brand, bank, and timing settings can remain linked to the main campus.</span></div><FieldGrid fields={visibleBranchFields} data={branchForm} onChange={(key, value) => setBranchForm((previous) => ({ ...previous, [key]: value }))} />{branchSection.checks?.map((group) => <CheckboxGroup key={group.key} group={group} value={branchForm[group.key] || ''} onChange={(key, value) => setBranchForm((previous) => ({ ...previous, [key]: value }))} />)}{branchFormSection === 'affiliation' && branchForm.sameAffiliation !== 'No' && <p className="mt-4 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">Affiliation and registration details are inherited from the main campus. Choose “No” to enter branch-specific codes.</p>}{branchFormSection === 'academic' && <p className="mt-4 text-xs text-gray-500">Current strength is read-only in the live ERP and is normally synchronized from the student module.</p>}{branchFormSection === 'bank' && branchForm.separateBank !== 'Yes' && <p className="mt-4 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">This branch will use the institute's primary fee-collection account.</p>}{branchFormSection === 'branding' && <div className="mt-5 grid gap-4 md:grid-cols-2"><Input label="Branch Logo (optional)" type="file" accept="image/*" onChange={(event) => setBranchForm((previous) => ({ ...previous, branchLogoFile: event.target.files?.[0]?.name || previous.branchLogoFile }))} /><Input label="Branch-Specific Letterhead (optional)" type="file" accept=".pdf,image/*" onChange={(event) => setBranchForm((previous) => ({ ...previous, branchLetterheadFile: event.target.files?.[0]?.name || previous.branchLetterheadFile }))} /></div>}{branchFormSection === 'branding' && branchForm.useMainLogo === 'Yes' && <p className="mt-4 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">The main institute logo and letterhead will appear on branch documents.</p>}</div><div className="flex flex-wrap items-center justify-between gap-3 border-t bg-gray-50 px-5 py-4"><p className="text-xs text-gray-500">Permanent deletion is disabled; inactive branches remain in the audit record.</p><div className="flex gap-2"><Button variant="outline" onClick={() => setBranchFormOpen(false)}>Cancel</Button><Button onClick={saveBranch}><Save className="h-4 w-4" /> Save Branch</Button></div></div></div></div>}
    </div>
  );
}

function KpiCard({ title, value, icon, tone }: { title: string; value: string; icon: React.ReactNode; tone: 'blue' | 'green' | 'amber' | 'purple' | 'cyan' }) {
  const toneMap = { blue: 'bg-blue-50 text-blue-700', green: 'bg-green-50 text-green-700', amber: 'bg-amber-50 text-amber-700', purple: 'bg-violet-50 text-violet-700', cyan: 'bg-cyan-50 text-cyan-700' };
  return <Card noPadding className="min-h-[88px]"><div className="flex items-center gap-3 p-5"><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${toneMap[tone]}`}>{icon}</span><div className="min-w-0"><p className="text-xs font-medium text-gray-500">{title}</p><p className="truncate text-lg font-bold text-gray-900">{value}</p></div></div></Card>;
}
