// EmployeeProfile.tsx

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  User, MapPin, Briefcase, GraduationCap, CreditCard, Users, Shield, Save,
  Search, Clock, Target, Award, TrendingUp, Heart, FileText,
  Settings, Mail, Phone, Building, Plus, Trash2, Upload, Star,
  CheckCircle, Activity } from
'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';

const tabConfig = [
{ id: 'personal', label: 'Personal Details', icon: User },
{ id: 'contact', label: 'Contact & Address', icon: MapPin },
{ id: 'employment', label: 'Employment Info', icon: Briefcase },
{ id: 'qualification', label: 'Qualification', icon: GraduationCap },
{ id: 'bank', label: 'Bank & Salary', icon: CreditCard },
{ id: 'family', label: 'Family & Nominee', icon: Users },
{ id: 'documents', label: 'Documents', icon: FileText },
{ id: 'health', label: 'Health Records', icon: Heart },
{ id: 'operations', label: 'Operations', icon: Clock }];


const genderOptions = [{ value: 'm', label: 'Male' }, { value: 'f', label: 'Female' }, { value: 'o', label: 'Other' }];
const maritalOptions = [{ value: 's', label: 'Single' }, { value: 'm', label: 'Married' }, { value: 'd', label: 'Divorced' }, { value: 'w', label: 'Widowed' }];
const religionOptions = [{ value: 'h', label: 'Hindu' }, { value: 'm', label: 'Muslim' }, { value: 'c', label: 'Christian' }, { value: 's', label: 'Sikh' }, { value: 'o', label: 'Other' }];
const categoryOptions = [{ value: 'gen', label: 'General' }, { value: 'obc', label: 'OBC' }, { value: 'sc', label: 'SC' }, { value: 'st', label: 'ST' }, { value: 'ews', label: 'EWS' }];
const bloodOptions = [{ value: 'ap', label: 'A+' }, { value: 'an', label: 'A-' }, { value: 'bp', label: 'B+' }, { value: 'bn', label: 'B-' }, { value: 'op', label: 'O+' }, { value: 'on', label: 'O-' }, { value: 'abp', label: 'AB+' }, { value: 'abn', label: 'AB-' }];
const staffTypeOptions = [{ value: 't', label: 'Teaching' }, { value: 'nt', label: 'Non-Teaching' }, { value: 'a', label: 'Admin' }, { value: 's', label: 'Support' }, { value: 'mg', label: 'Management' }];
const employmentOptions = [{ value: 'p', label: 'Permanent' }, { value: 'c', label: 'Contract' }, { value: 'pt', label: 'Part-time' }, { value: 'tr', label: 'Trainee' }, { value: 'in', label: 'Intern' }];
const statusOptions = [{ value: 'active', label: 'Active' }, { value: 'probation', label: 'Probation' }, { value: 'notice', label: 'Notice Period' }, { value: 'inactive', label: 'Inactive' }];
const departmentOptions = [{ value: 'math', label: 'Mathematics' }, { value: 'sci', label: 'Science' }, { value: 'eng', label: 'English' }, { value: 'sst', label: 'Social Studies' }, { value: 'cs', label: 'Computer Science' }, { value: 'admin', label: 'Administration' }, { value: 'hr', label: 'Human Resources' }, { value: 'fin', label: 'Finance' }];
const designationOptions = [{ value: 'prin', label: 'Principal' }, { value: 'vprin', label: 'Vice Principal' }, { value: 'hod', label: 'HOD' }, { value: 'st', label: 'Senior Teacher' }, { value: 'jt', label: 'Junior Teacher' }, { value: 'coord', label: 'Coordinator' }, { value: 'clerk', label: 'Clerk' }, { value: 'peon', label: 'Peon' }, { value: 'math-teacher', label: 'Math Teacher' }, { value: 'science-teacher', label: 'Science Teacher' }, { value: 'english-teacher', label: 'English Teacher' }, { value: 'computer-teacher', label: 'Computer Science Teacher' }, { value: 'admin-officer', label: 'Admin Officer' }];
const paymentOptions = [{ value: 'bank', label: 'Bank Transfer' }, { value: 'cheque', label: 'Cheque' }, { value: 'cash', label: 'Cash' }];
const gradeOptions = [{ value: 'g1', label: 'Grade 1' }, { value: 'g2', label: 'Grade 2' }, { value: 'g3', label: 'Grade 3' }, { value: 'g4', label: 'Grade 4' }, { value: 'g5', label: 'Grade 5' }];
const relationOptions = [{ value: 'spouse', label: 'Spouse' }, { value: 'father', label: 'Father' }, { value: 'mother', label: 'Mother' }, { value: 'child', label: 'Child' }, { value: 'sibling', label: 'Sibling' }];
const shiftOptions = [{ value: 'morning', label: 'Morning (7AM-3PM)' }, { value: 'day', label: 'Day (9AM-5PM)' }, { value: 'evening', label: 'Evening (2PM-10PM)' }, { value: 'flexible', label: 'Flexible' }];
const leaveTypeOptions = [{ value: 'cl', label: 'Casual Leave' }, { value: 'sl', label: 'Sick Leave' }, { value: 'el', label: 'Earned Leave' }, { value: 'ml', label: 'Maternity Leave' }, { value: 'pl', label: 'Paternity Leave' }];
const ratingOptions = [{ value: '5', label: '5 - Outstanding' }, { value: '4', label: '4 - Exceeds Expectations' }, { value: '3', label: '3 - Meets Expectations' }, { value: '2', label: '2 - Needs Improvement' }, { value: '1', label: '1 - Unsatisfactory' }];
const roleOptions = [{ value: 'admin', label: 'Administrator' }, { value: 'hr', label: 'HR Manager' }, { value: 'teacher', label: 'Teacher' }, { value: 'staff', label: 'Staff' }, { value: 'viewer', label: 'Viewer' }];
const branchOptions = [{ value: 'Main Campus', label: 'Main Campus' }, { value: 'City Campus', label: 'City Campus' }, { value: 'North Campus', label: 'North Campus' }];

const EMPLOYEE_HEALTH_RECORDS_STORAGE_KEY = 'k12-employee-health-records-v1';
type EmployeeHealthRecord = {
  bloodGroup: string;
  allergies: string[];
  medicalConditions: string[];
  emergencyMedical: string;
  insuranceNumber: string;
  lastCheckup: string;
  vaccinations: { name: string; date: string }[];
};
type EmployeeHealthRecordMap = Record<string, EmployeeHealthRecord>;

const normalizeEmployeeCode = (code: string) => code.trim().toUpperCase();

type ApplicantImportRecord = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  position: string;
  department: string;
  subject: string;
  qualification: string;
  experience: string;
  source: string;
  expectedSalary: string;
  tags: string[];
  branch: string;
  status: string;
  appliedDate: string;
};

// Frontend applicant records mirror the recruitment applicant list for this import workflow.
const employeeApplicantRecords: ApplicantImportRecord[] = [
  { id: 'APP-2024-001', fullName: 'Priya Sharma', email: 'priya@email.com', phone: '+91 98765 43210', address: '123, Sector 15, Noida', position: 'Math Teacher', department: 'Mathematics', subject: 'Mathematics', qualification: 'M.Sc Mathematics, B.Ed', experience: '5 years', source: 'LinkedIn', expectedSalary: '₹45,000 / month', tags: ['Experienced', 'Senior'], branch: 'Main Campus', status: 'Screening', appliedDate: '2024-12-01' },
  { id: 'APP-2024-002', fullName: 'Rahul Verma', email: 'rahul.verma@email.com', phone: '+91 98765 43211', address: '456, MG Road, Delhi', position: 'Science Teacher', department: 'Science', subject: 'Physics', qualification: 'M.Sc Physics, B.Ed', experience: '3 years', source: 'Naukri', expectedSalary: '₹40,000 / month', tags: ['Physics', 'Lab Experience'], branch: 'Main Campus', status: 'New', appliedDate: '2024-12-05' },
  { id: 'APP-2024-003', fullName: 'Anita Desai', email: 'anita@email.com', phone: '+91 98765 43212', address: '22, Lake View Road, Ahmedabad', position: 'Admin Officer', department: 'Administration', subject: '', qualification: 'MBA', experience: '7 years', source: 'School Website', expectedSalary: '₹55,000 / month', tags: ['Administration', 'Communication'], branch: 'North Wing', status: 'Selected', appliedDate: '2024-12-08' },
  { id: 'APP-2024-004', fullName: 'Meera Patel', email: 'meera.patel@email.com', phone: '+91 98765 43213', address: '8, Riverfront Road, Ahmedabad', position: 'Computer Science Teacher', department: 'Computer Science', subject: 'Computer Science', qualification: 'MCA, B.Ed', experience: '4 years', source: 'Job Portal', expectedSalary: '₹50,000 / month', tags: ['Python', 'Web Development'], branch: 'Main Campus', status: 'Shortlisted', appliedDate: '2024-12-12' },
];

const readEmployeeHealthRecordMap = (): EmployeeHealthRecordMap => {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem(EMPLOYEE_HEALTH_RECORDS_STORAGE_KEY) || '{}') as EmployeeHealthRecordMap;
  } catch {
    return {};
  }
};

// Picks the option whose label matches the directory value (e.g. "Male" -> "m").
// When the fixed list has no match, the employee's own value is kept so it is still shown.
const pickOption = (options: { value: string; label: string }[], text?: string): string => {
  const wanted = (text ?? '').trim();
  if (!wanted) return '';
  const match = options.find((option) => option.label.toLowerCase() === wanted.toLowerCase());
  return match ? match.value : wanted;
};

// Adds the current value as an extra option when the fixed list does not contain it.
const withOption = (options: { value: string; label: string }[], current?: string) => {
  if (!current || options.some((option) => option.value === current)) return options;
  return [...options, { value: current, label: current }];
};

type EmployeePrefill = Record<string, string>;

export function EmployeeProfile() {
  const navigate = useNavigate();
  // Values sent from Employee Directory & Profile (Edit button); empty when the form is opened directly.
  const location = useLocation();
  const prefill: EmployeePrefill = (location.state as { prefill?: EmployeePrefill } | null)?.prefill ?? {};
  const [activeTab, setActiveTab] = useState('personal');
  const [showApplicantPicker, setShowApplicantPicker] = useState(false);
  const [applicantSearch, setApplicantSearch] = useState('');
  const [importedApplicant, setImportedApplicant] = useState<ApplicantImportRecord | null>(null);
  const [employeeRole, setEmployeeRole] = useState('');
  const [applicantPrefill, setApplicantPrefill] = useState({
    firstName: prefill.firstName ?? '',
    lastName: prefill.lastName ?? '',
    phone: prefill.primaryMobile ?? '',
    personalEmail: prefill.personalEmail ?? '',
    address: prefill.permanentLine2 ?? '',
    department: pickOption(departmentOptions, prefill.department),
    designation: pickOption(designationOptions, prefill.designation),
    branch: prefill.campus ?? '',
    subject: prefill.primarySubject ?? '',
    qualification: prefill.highestQualification ?? '',
    specialization: prefill.fieldOfStudy ?? '',
    experience: '',
    source: '',
    expectedSalary: '',
    tags: prefill.technicalSkills ?? ''
  });
  const [experiences, setExperiences] = useState([{ id: 1 }]);
  const [familyMembers, setFamilyMembers] = useState([{ id: 1 }]);
  const [documents, setDocuments] = useState([{ id: 1 }]);
  const [goals, setGoals] = useState([{ id: 1 }]);
  const [trainings, setTrainings] = useState([{ id: 1 }]);
  const [employeeCode, setEmployeeCode] = useState(prefill.code ?? '');
  const [healthForm, setHealthForm] = useState({
    bloodGroup: '',
    allergies: prefill.allergies ?? '',
    medicalConditions: prefill.medicalConditions ?? '',
    emergencyMedical: '',
    insuranceNumber: prefill.insuranceNumber ?? '',
    lastCheckup: prefill.lastCheckup ?? ''
  });
  const [vaccinations, setVaccinations] = useState([{ id: 1, name: '', date: '' }]);
  const [healthSavedMessage, setHealthSavedMessage] = useState('');

  const addItem = (setter: any, items: any[]) => setter([...items, { id: Date.now() }]);
  const removeItem = (setter: any, items: any[], id: number) => setter(items.filter((i) => i.id !== id));

  const handleEmployeeCodeChange = (value: string) => {
    setEmployeeCode(value);
    setHealthSavedMessage('');
    const storedRecord = readEmployeeHealthRecordMap()[normalizeEmployeeCode(value)];
    if (!storedRecord) {
      setHealthForm({ bloodGroup: '', allergies: '', medicalConditions: '', emergencyMedical: '', insuranceNumber: '', lastCheckup: '' });
      setVaccinations([{ id: 1, name: '', date: '' }]);
      return;
    }
    setHealthForm({
      bloodGroup: storedRecord.bloodGroup || '',
      allergies: (storedRecord.allergies || []).join(', '),
      medicalConditions: (storedRecord.medicalConditions || []).join(', '),
      emergencyMedical: storedRecord.emergencyMedical || '',
      insuranceNumber: storedRecord.insuranceNumber || '',
      lastCheckup: storedRecord.lastCheckup || ''
    });
    setVaccinations(
      storedRecord.vaccinations?.length
        ? storedRecord.vaccinations.map((vaccination, index) => ({ ...vaccination, id: index + 1 }))
        : [{ id: 1, name: '', date: '' }]
    );
  };

  const saveHealthRecord = () => {
    const code = normalizeEmployeeCode(employeeCode);
    if (!code) {
      setHealthSavedMessage('Enter an employee code in Personal Details or below before saving health records.');
      return;
    }

    const splitValues = (value: string) => value.split(',').map((item) => item.trim()).filter(Boolean);
    const record: EmployeeHealthRecord = {
      bloodGroup: healthForm.bloodGroup,
      allergies: splitValues(healthForm.allergies),
      medicalConditions: splitValues(healthForm.medicalConditions),
      emergencyMedical: healthForm.emergencyMedical,
      insuranceNumber: healthForm.insuranceNumber,
      lastCheckup: healthForm.lastCheckup,
      vaccinations: vaccinations.filter((vaccination) => vaccination.name.trim()).map(({ name, date }) => ({ name: name.trim(), date }))
    };

    try {
      const currentRecords = readEmployeeHealthRecordMap();
      window.localStorage.setItem(
        EMPLOYEE_HEALTH_RECORDS_STORAGE_KEY,
        JSON.stringify({ ...currentRecords, [code]: record })
      );
      window.dispatchEvent(new Event('k12-employee-health-records-updated'));
      setHealthSavedMessage(`Health records saved for ${code}. They will appear in Profile View → Engagement → Health.`);
    } catch {
      setHealthSavedMessage('Health records could not be saved in this browser.');
    }
  };

  const optionValueForLabel = (options: { value: string; label: string }[], label: string) =>
    options.find((option) => option.label.toLowerCase() === label.toLowerCase())?.value || '';

  const handleImportApplicant = (applicant: ApplicantImportRecord) => {
    const [firstName = '', ...lastNameParts] = applicant.fullName.trim().split(/\s+/);
    setImportedApplicant(applicant);
    setApplicantPrefill({
      firstName,
      lastName: lastNameParts.join(' '),
      phone: applicant.phone,
      personalEmail: applicant.email,
      address: applicant.address,
      department: optionValueForLabel(departmentOptions, applicant.department),
      designation: optionValueForLabel(designationOptions, applicant.position),
      branch: applicant.branch,
      subject: applicant.subject,
      specialization: applicant.subject,
      qualification: applicant.qualification,
      experience: applicant.experience,
      source: applicant.source,
      expectedSalary: applicant.expectedSalary,
      tags: applicant.tags.join(', ')
    });
    setActiveTab('personal');
    setApplicantSearch('');
    setShowApplicantPicker(false);
  };

  const filteredApplicantRecords = employeeApplicantRecords.filter((applicant) =>
    [applicant.id, applicant.fullName, applicant.email, applicant.position, applicant.department]
      .some((value) => value.toLowerCase().includes(applicantSearch.trim().toLowerCase()))
  );

  const FormSection = ({ title, children }: {title: string;children: React.ReactNode;}) =>
  <div className="border-t pt-4 first:border-t-0 first:pt-0">
      <h4 className="font-semibold text-gray-900 mb-4">{title}</h4>
      {children}
    </div>;


  const PersonalDetails = () =>
  <div className="space-y-6">
      <div className="flex items-center gap-6 mb-6">
        <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
          <Upload className="w-8 h-8 text-gray-400" />
        </div>
        <div>
          <Button variant="outline" size="sm"><Upload className="w-4 h-4 mr-2" />Upload Photo</Button>
          <p className="text-xs text-gray-500 mt-2">JPG, PNG max 2MB. 200x200px recommended.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input label="Employee Code" placeholder="Auto-generated" value={employeeCode} onChange={(event) => handleEmployeeCodeChange(event.target.value)} />
        <Input label="Title" placeholder="Mr/Mrs/Ms/Dr" />
        <Input label="First Name" placeholder="First Name" value={applicantPrefill.firstName} onChange={(event) => setApplicantPrefill((current) => ({ ...current, firstName: event.target.value }))} required />
        <Input label="Last Name" placeholder="Last Name" value={applicantPrefill.lastName} onChange={(event) => setApplicantPrefill((current) => ({ ...current, lastName: event.target.value }))} required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select label="Gender" options={withOption(genderOptions, prefill.gender)} defaultValue={pickOption(genderOptions, prefill.gender)} onChange={() => {}} />
        <Input label="Date of Birth" defaultValue={prefill.dateOfBirth} type="date" required />
        <Select label="Marital Status" options={withOption(maritalOptions, prefill.maritalStatus)} defaultValue={pickOption(maritalOptions, prefill.maritalStatus)} onChange={() => {}} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input label="Nationality" defaultValue={prefill.nationality} placeholder="Indian" />
        <Select label="Religion" options={withOption(religionOptions, prefill.religion)} defaultValue={pickOption(religionOptions, prefill.religion)} onChange={() => {}} />
        <Select label="Category" options={withOption(categoryOptions, prefill.category)} defaultValue={pickOption(categoryOptions, prefill.category)} onChange={() => {}} />
        <Input label="Caste" defaultValue={prefill.caste} placeholder="Caste (optional)" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input label="Height (cm)" type="number" placeholder="170" />
        <Input label="Weight (kg)" type="number" placeholder="70" />
        <Input label="Mother Tongue" placeholder="Hindi" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input label="Aadhaar Number" defaultValue={prefill.aadhaar} placeholder="XXXX XXXX XXXX" required />
        <Input label="PAN Number" defaultValue={prefill.pan} placeholder="ABCDE1234F" />
        <Input label="Voter ID" defaultValue={prefill.voterId} placeholder="Voter ID" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Identification Marks" placeholder="Any visible marks" />
        <Input label="Known Languages" placeholder="Hindi, English, etc." />
      </div>
      <div className="grid grid-cols-1 gap-4">
        <Input label="Medical Conditions (if any)" defaultValue={prefill.medicalConditions} placeholder="Diabetes, BP, allergies, etc." />
      </div>
    </div>;


  const ContactAddress = () =>
  <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input label="Primary Mobile" placeholder="+91 XXXXXXXXXX" value={applicantPrefill.phone} onChange={(event) => setApplicantPrefill((current) => ({ ...current, phone: event.target.value }))} required />
        <Input label="Secondary Mobile" defaultValue={prefill.secondaryMobile} placeholder="+91 XXXXXXXXXX" />
        <Input label="WhatsApp Number" placeholder="+91 XXXXXXXXXX" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input label="Official Email" defaultValue={prefill.officialEmail} type="email" placeholder="name@school.edu" required />
        <Input label="Personal Email" type="email" placeholder="personal@email.com" value={applicantPrefill.personalEmail} onChange={(event) => setApplicantPrefill((current) => ({ ...current, personalEmail: event.target.value }))} />
        <Input label="LinkedIn Profile" placeholder="linkedin.com/in/username" />
      </div>
      <FormSection title="Permanent Address">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="House No. / Building" defaultValue={prefill.permanentLine1} placeholder="House/Flat No." />
          <Input label="Street / Locality" placeholder="Street Name" value={applicantPrefill.address} onChange={(event) => setApplicantPrefill((current) => ({ ...current, address: event.target.value }))} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <Input label="City" defaultValue={prefill.permanentCity} placeholder="City" />
          <Input label="District" placeholder="District" />
          <Input label="State" defaultValue={prefill.permanentState} placeholder="State" />
          <Input label="Pincode" defaultValue={prefill.permanentPincode} placeholder="XXXXXX" />
        </div>
        <Input label="Landmark" placeholder="Near..." className="mt-4" />
      </FormSection>
      <FormSection title="Current Address">
        <div className="flex items-center mb-4">
          <input type="checkbox" id="sameAddress" className="mr-2" />
          <label htmlFor="sameAddress" className="text-sm text-gray-600">Same as Permanent Address</label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="House No. / Building" defaultValue={prefill.currentLine1} placeholder="House/Flat No." />
          <Input label="Street / Locality" defaultValue={prefill.currentLine2} placeholder="Street Name" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <Input label="City" defaultValue={prefill.currentCity} placeholder="City" />
          <Input label="District" placeholder="District" />
          <Input label="State" defaultValue={prefill.currentState} placeholder="State" />
          <Input label="Pincode" defaultValue={prefill.currentPincode} placeholder="XXXXXX" />
        </div>
      </FormSection>
      <FormSection title="Emergency Contacts">
        <div className="space-y-4">
          {[1, 2].map((i) =>
        <div key={i} className="bg-gray-50 p-4 rounded-lg border">
              <h5 className="font-medium text-gray-700 mb-3">Emergency Contact {i}</h5>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input label="Name" defaultValue={prefill.emergencyName} placeholder="Full Name" />
                <Select label="Relationship" options={withOption(relationOptions, prefill.emergencyRelation)} defaultValue={pickOption(relationOptions, prefill.emergencyRelation)} onChange={() => {}} />
                <Input label="Phone" defaultValue={prefill.emergencyPhone} placeholder="+91 XXXXXXXXXX" />
                <Input label="Address" defaultValue={prefill.emergencyAddress} placeholder="Address" />
              </div>
            </div>
        )}
        </div>
      </FormSection>
    </div>;


  const EmploymentInfo = () =>
  <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select label="Staff Type" options={withOption(staffTypeOptions, prefill.staffType)} defaultValue={pickOption(staffTypeOptions, prefill.staffType)} onChange={() => {}} />
        <Select label="Employment Type" options={withOption(employmentOptions, prefill.employmentType)} defaultValue={pickOption(employmentOptions, prefill.employmentType)} onChange={() => {}} />
        <Select label="Status" options={withOption(statusOptions, prefill.status)} defaultValue={pickOption(statusOptions, prefill.status)} onChange={() => {}} />
        <Input label="Date of Joining" defaultValue={prefill.dateOfJoining} type="date" required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select label="Department" options={withOption(departmentOptions, applicantPrefill.department)} value={applicantPrefill.department} onChange={(event) => setApplicantPrefill((current) => ({ ...current, department: event.target.value }))} />
        <Select label="Designation" options={withOption(designationOptions, applicantPrefill.designation)} value={applicantPrefill.designation} onChange={(event) => setApplicantPrefill((current) => ({ ...current, designation: event.target.value }))} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select label="Campus/Branch" options={withOption([{ value: '', label: 'Select campus/branch' }, ...branchOptions], applicantPrefill.branch)} value={applicantPrefill.branch} onChange={(event) => setApplicantPrefill((current) => ({ ...current, branch: event.target.value }))} />
        <Select label="Role" options={[{ value: '', label: 'Select role' }, ...roleOptions]} value={employeeRole} onChange={(event) => setEmployeeRole(event.target.value)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input label="Probation End Date" type="date" />
        <Input label="Notice Period (Days)" defaultValue={prefill.noticePeriod} type="number" placeholder="30" />
      </div>
      <FormSection title="Teaching Details (if applicable)">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Primary Subject" placeholder="Mathematics" value={applicantPrefill.subject} onChange={(event) => setApplicantPrefill((current) => ({ ...current, subject: event.target.value }))} />
          <Input label="Secondary Subjects" defaultValue={prefill.secondarySubjects} placeholder="Physics, Chemistry" />
          <Input label="Classes Handling" placeholder="IX, X, XI, XII" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Select label="Class Teacher Of" options={[{ value: '', label: 'None' }, { value: '10a', label: 'Class 10-A' }]} value="" onChange={() => {}} />
        </div>
      </FormSection>
    </div>;


  const Qualification = () =>
  <div className="space-y-6">
      <FormSection title="Academic Qualifications">
        {['10th', '12th', 'Graduation', 'Post Graduation', 'Doctorate'].map((level) =>
      <div key={level} className="bg-gray-50 p-4 rounded-lg border mb-4">
            <h5 className="font-medium text-gray-700 mb-3">{level}</h5>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Input label="Board/University" placeholder="CBSE/University" />
              <Input label="School/College" placeholder="Institution Name" />
              <Input label="Year of Passing" type="number" placeholder="2020" />
              <Input label="Percentage/CGPA" placeholder="85% / 8.5" />
              <Input label="Subjects/Stream" placeholder="PCM/Commerce" />
            </div>
          </div>
      )}
      </FormSection>
      <FormSection title="Professional Qualifications">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input label="Degree/Certification" placeholder="B.Ed, M.Ed, etc." value={applicantPrefill.qualification} onChange={(event) => setApplicantPrefill((current) => ({ ...current, qualification: event.target.value }))} />
          <Input label="Institution" defaultValue={prefill.university} placeholder="University Name" />
          <Input label="Year" defaultValue={prefill.yearOfPassing} type="number" placeholder="2020" />
          <Input label="Grade/Score" defaultValue={prefill.percentage} placeholder="A / 80%" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Input label="Specialization" placeholder="Special Education, etc." value={applicantPrefill.specialization} onChange={(event) => setApplicantPrefill((current) => ({ ...current, specialization: event.target.value }))} />
          <Input label="Registration Number" placeholder="If applicable" />
        </div>
      </FormSection>
      <FormSection title="Certifications & Courses">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input label="Course Name" placeholder="Course/Certification" />
          <Input label="Provider" placeholder="Institution/Platform" />
          <Input label="Completion Date" type="date" />
          <Input label="Certificate ID" placeholder="ID/URL" />
        </div>
        <Button variant="outline" size="sm" className="mt-4"><Plus className="w-4 h-4 mr-2" />Add Certification</Button>
      </FormSection>
      <FormSection title="Previous Work Experience">
        {importedApplicant && <Input label="Total Prior Experience" value={applicantPrefill.experience} onChange={(event) => setApplicantPrefill((current) => ({ ...current, experience: event.target.value }))} />}
        {experiences.map((exp, idx) =>
      <div key={exp.id} className="bg-gray-50 p-4 rounded-lg border mb-4">
            <div className="flex justify-between items-center mb-3">
              <h5 className="font-medium text-gray-700">Experience {idx + 1}</h5>
              {experiences.length > 1 && <Button variant="outline" size="sm" onClick={() => removeItem(setExperiences, experiences, exp.id)}><Trash2 className="w-4 h-4" /></Button>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input label="Organization" placeholder="Company Name" />
              <Input label="Designation" placeholder="Role/Title" />
              <Input label="From" type="date" />
              <Input label="To" type="date" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Input label="Location" placeholder="City" />
              <Input label="Last Salary" placeholder="Monthly CTC" />
              <Input label="Reason for Leaving" placeholder="Reason" />
            </div>
            <Input label="Key Responsibilities" placeholder="Describe your role..." className="mt-4" />
          </div>
      )}
        <Button variant="outline" size="sm" onClick={() => addItem(setExperiences, experiences)}><Plus className="w-4 h-4 mr-2" />Add Experience</Button>
      </FormSection>
      <FormSection title="Skills & Expertise">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Technical Skills" placeholder="MS Office, Tally, etc." value={applicantPrefill.tags} onChange={(event) => setApplicantPrefill((current) => ({ ...current, tags: event.target.value }))} />
          <Input label="Soft Skills" defaultValue={prefill.softSkills} placeholder="Communication, Leadership" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Input label="Languages Known" placeholder="English (Fluent), Hindi (Native)" />
          <Input label="Hobbies & Interests" defaultValue={prefill.hobbies} placeholder="Reading, Sports, etc." />
        </div>
      </FormSection>
    </div>;


  const BankSalary = () =>
  <div className="space-y-6">
      <FormSection title="Primary Bank Account">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input label="Bank Name" defaultValue={prefill.bankName} placeholder="State Bank of India" />
          <Input label="Branch Name" defaultValue={prefill.bankBranch} placeholder="Main Branch" />
          <Input label="Account Number" defaultValue={prefill.accountNumber} placeholder="XXXXXXXXXX" />
          <Input label="Confirm Account" defaultValue={prefill.accountNumber} placeholder="Re-enter Account" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <Input label="IFSC Code" defaultValue={prefill.ifsc} placeholder="SBIN0001234" />
          <Input label="Account Type" defaultValue={prefill.accountType} placeholder="Savings/Current" />
          <Input label="MICR Code" defaultValue={prefill.micrCode} placeholder="XXXXXX" />
          <Select label="Payment Mode" options={withOption(paymentOptions, prefill.paymentMode)} defaultValue={pickOption(paymentOptions, prefill.paymentMode)} onChange={() => {}} />
        </div>
      </FormSection>
      <FormSection title="Secondary Bank Account (Optional)">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input label="Bank Name" placeholder="HDFC Bank" />
          <Input label="Branch Name" placeholder="Branch" />
          <Input label="Account Number" placeholder="XXXXXXXXXX" />
          <Input label="IFSC Code" placeholder="HDFC0001234" />
        </div>
      </FormSection>
      <FormSection title="Salary Structure">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select label="Salary Grade" options={withOption(gradeOptions, prefill.salaryGrade)} defaultValue={pickOption(gradeOptions, prefill.salaryGrade)} onChange={() => {}} />
          <Input label="Basic Pay" defaultValue={prefill.basicPay} type="number" placeholder="25000" />
          <Input label="DA" type="number" placeholder="5000" />
          <Input label="HRA" type="number" placeholder="10000" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <Input label="Conveyance" type="number" placeholder="3000" />
          <Input label="Medical Allowance" type="number" placeholder="2000" />
          <Input label="Special Allowance" type="number" placeholder="5000" />
          <Input label="Other Allowances" type="number" placeholder="0" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <Input label="Gross Salary" type="number" placeholder="50000" disabled />
          <Input label="PF Deduction" type="number" placeholder="3000" />
          <Input label="Professional Tax" type="number" placeholder="200" />
          <Input label="Net Salary" type="number" placeholder="46800" disabled />
        </div>
      </FormSection>
      <FormSection title="Statutory Details">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input label="PF Number" defaultValue={prefill.pfNumber} placeholder="PF Account Number" />
          <Input label="UAN Number" defaultValue={prefill.uanNumber} placeholder="Universal Account No." />
          <Input label="ESI Number" defaultValue={prefill.esiNumber} placeholder="ESI Number" />
          <Input label="TDS Applicable" placeholder="Yes/No" />
        </div>
      </FormSection>
      <FormSection title="Loan & Advances">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input label="Loan Amount" type="number" placeholder="0" />
          <Input label="EMI Amount" type="number" placeholder="0" />
          <Input label="Outstanding" type="number" placeholder="0" disabled />
          <Input label="Loan Start Date" type="date" />
        </div>
      </FormSection>
    </div>;


  const FamilyNominee = () =>
  <div className="space-y-6">
      <FormSection title="Family Members">
        {familyMembers.map((member, idx) =>
      <div key={member.id} className="bg-gray-50 p-4 rounded-lg border mb-4">
            <div className="flex justify-between items-center mb-3">
              <h5 className="font-medium text-gray-700">Family Member {idx + 1}</h5>
              {familyMembers.length > 1 && <Button variant="outline" size="sm" onClick={() => removeItem(setFamilyMembers, familyMembers, member.id)}><Trash2 className="w-4 h-4" /></Button>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Input label="Name" placeholder="Full Name" />
              <Select label="Relationship" options={relationOptions} value="" onChange={() => {}} />
              <Input label="Date of Birth" type="date" />
              <Input label="Occupation" placeholder="Occupation" />
              <Input label="Phone" placeholder="Phone Number" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <Input label="Aadhaar Number" placeholder="XXXX XXXX XXXX" />
              <div className="flex items-center gap-4 pt-6">
                <label className="flex items-center"><input type="checkbox" className="mr-2" />Dependent</label>
                <label className="flex items-center"><input type="checkbox" className="mr-2" />Nominee</label>
              </div>
            </div>
          </div>
      )}
        <Button variant="outline" size="sm" onClick={() => addItem(setFamilyMembers, familyMembers)}><Plus className="w-4 h-4 mr-2" />Add Family Member</Button>
      </FormSection>
      <FormSection title="Nominee for PF">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input label="Nominee Name" placeholder="Full Name" />
          <Select label="Relationship" options={relationOptions} value="" onChange={() => {}} />
          <Input label="Date of Birth" type="date" />
          <Input label="Share %" type="number" placeholder="100" />
        </div>
        <div className="grid grid-cols-1 gap-4 mt-4">
          <Input label="Address" placeholder="Full Address" />
        </div>
      </FormSection>
      <FormSection title="Nominee for Gratuity">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input label="Nominee Name" placeholder="Full Name" />
          <Select label="Relationship" options={relationOptions} value="" onChange={() => {}} />
          <Input label="Date of Birth" type="date" />
          <Input label="Share %" type="number" placeholder="100" />
        </div>
      </FormSection>
      <FormSection title="Insurance Nominee">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input label="Nominee Name" placeholder="Full Name" />
          <Select label="Relationship" options={relationOptions} value="" onChange={() => {}} />
          <Input label="Phone" placeholder="Phone Number" />
          <Input label="Share %" type="number" placeholder="100" />
        </div>
      </FormSection>
    </div>;


  const Documents = () =>
  <div className="space-y-6">
      <FormSection title="Identity Documents">
        {[{ label: 'Aadhaar Card', required: true }, { label: 'PAN Card', required: true }, { label: 'Voter ID', required: false }].map((doc) =>
      <div key={doc.label} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border mb-2">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-400" />
              <span className="font-medium">{doc.label}</span>
              {doc.required && <Badge variant="error" className="text-xs">Required</Badge>}
            </div>
            <Button variant="outline" size="sm"><Upload className="w-4 h-4 mr-2" />Upload</Button>
          </div>
      )}
      </FormSection>
      <FormSection title="Educational Documents">
        {['10th Marksheet', '12th Marksheet', 'Graduation Certificate', 'Post Graduation Certificate', 'B.Ed Certificate', 'Other Certificates'].map((doc) =>
      <div key={doc} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border mb-2">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-5 h-5 text-gray-400" />
              <span className="font-medium">{doc}</span>
            </div>
            <Button variant="outline" size="sm"><Upload className="w-4 h-4 mr-2" />Upload</Button>
          </div>
      )}
      </FormSection>
      <FormSection title="Employment Documents">
        {['Appointment Letter', 'Experience Letters', 'Relieving Letters', 'Salary Slips', 'Bank Passbook', 'Cancelled Cheque'].map((doc) =>
      <div key={doc} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border mb-2">
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-gray-400" />
              <span className="font-medium">{doc}</span>
            </div>
            <Button variant="outline" size="sm"><Upload className="w-4 h-4 mr-2" />Upload</Button>
          </div>
      )}
      </FormSection>
      <FormSection title="Other Documents">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Document Name" placeholder="Document Title" />
          <Input label="Document Number" placeholder="Reference Number" />
          <div className="flex items-end"><Button variant="outline"><Upload className="w-4 h-4 mr-2" />Upload Document</Button></div>
        </div>
      </FormSection>
    </div>;


  const HealthRecords = () =>
  <div className="space-y-6">
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
        <h4 className="font-semibold text-blue-900">Employee health record link</h4>
        <p className="mt-1 text-sm text-blue-800">Use the same employee code as Personal Details. Saved records appear in Profile View → Engagement → Health.</p>
      </div>
      <FormSection title="Health Profile">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input label="Employee Code" placeholder="Enter the employee code" value={employeeCode} onChange={(event) => handleEmployeeCodeChange(event.target.value)} required />
          <Input label="Health Insurance Number" placeholder="Policy / member number" value={healthForm.insuranceNumber} onChange={(event) => setHealthForm((current) => ({ ...current, insuranceNumber: event.target.value }))} />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input label="Allergies (comma separated)" placeholder="e.g. Penicillin, peanuts" value={healthForm.allergies} onChange={(event) => setHealthForm((current) => ({ ...current, allergies: event.target.value }))} />
          <Input label="Medical Conditions (comma separated)" placeholder="e.g. Asthma, diabetes" value={healthForm.medicalConditions} onChange={(event) => setHealthForm((current) => ({ ...current, medicalConditions: event.target.value }))} />
          <Input label="Last Medical Checkup" type="date" value={healthForm.lastCheckup} onChange={(event) => setHealthForm((current) => ({ ...current, lastCheckup: event.target.value }))} />
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="employee-emergency-medical">Emergency Medical Information</label>
            <textarea id="employee-emergency-medical" rows={3} value={healthForm.emergencyMedical} onChange={(event) => setHealthForm((current) => ({ ...current, emergencyMedical: event.target.value }))} placeholder="Emergency instructions or relevant medical notes" className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </FormSection>
      <FormSection title="Vaccination Records">
        <div className="space-y-3">
          {vaccinations.map((vaccination, index) =>
        <div key={vaccination.id} className="grid grid-cols-1 items-end gap-3 rounded-lg border bg-gray-50 p-3 md:grid-cols-[1fr_220px_auto]">
              <Input label={`Vaccination ${index + 1}`} placeholder="Vaccine / dose" value={vaccination.name} onChange={(event) => setVaccinations((current) => current.map((item) => item.id === vaccination.id ? { ...item, name: event.target.value } : item))} />
              <Input label="Date" type="date" value={vaccination.date} onChange={(event) => setVaccinations((current) => current.map((item) => item.id === vaccination.id ? { ...item, date: event.target.value } : item))} />
              {vaccinations.length > 1 && <Button variant="outline" size="sm" onClick={() => setVaccinations((current) => current.filter((item) => item.id !== vaccination.id))}><Trash2 className="h-4 w-4" /><span className="sr-only">Remove vaccination</span></Button>}
            </div>
        )}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setVaccinations((current) => [...current, { id: Date.now(), name: '', date: '' }])}><Plus className="h-4 w-4" />Add Vaccination</Button>
          <Button variant="primary" onClick={saveHealthRecord}><Save className="h-4 w-4" />Save Health Record</Button>
        </div>
        {healthSavedMessage && <p role="status" className={`mt-3 text-sm ${healthSavedMessage.startsWith('Health records saved') ? 'text-green-700' : 'text-red-600'}`}>{healthSavedMessage}</p>}
      </FormSection>
    </div>;


  const Operations = () =>
  <div className="space-y-6">
      <FormSection title="Attendance Settings">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select label="Default Shift" options={withOption(shiftOptions, prefill.shift)} defaultValue={pickOption(shiftOptions, prefill.shift)} onChange={() => {}} />
          <Select label="Attendance Mode" options={[{ value: 'bio', label: 'Biometric' }, { value: 'app', label: 'App Based' }, { value: 'manual', label: 'Manual' }]} value="" onChange={() => {}} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <Input label="Check-in Time" type="time" />
          <Input label="Check-out Time" type="time" />
          <Input label="Grace Period (mins)" type="number" placeholder="15" />
          <Input label="Half Day After (hrs)" type="number" placeholder="4" />
        </div>
      </FormSection>
      <FormSection title="Leave Balance">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[{ type: 'CL', total: 12 }, { type: 'SL', total: 10 }, { type: 'EL', total: 15 }, { type: 'ML/PL', total: 90 }, { type: 'LOP', total: 0 }, { type: 'Comp Off', total: 0 }].map((leave) =>
        <div key={leave.type} className="bg-gray-50 p-4 rounded-lg border text-center">
              <p className="text-sm text-gray-600">{leave.type}</p>
              <p className="text-2xl font-bold text-gray-900">{leave.total}</p>
              <p className="text-xs text-gray-500">Available</p>
            </div>
        )}
        </div>
      </FormSection>
      <FormSection title="Overtime Settings">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select label="OT Eligible" options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} value="" onChange={() => {}} />
          <Input label="OT Rate (per hour)" type="number" placeholder="100" />
          <Input label="Max OT Hours/Month" type="number" placeholder="30" />
          <Input label="Min Hours for OT" type="number" placeholder="1" />
        </div>
      </FormSection>
      <FormSection title="Asset Allocation">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input label="Laptop/Desktop" placeholder="Asset ID" />
          <Input label="ID Card Number" placeholder="ID-XXXX" />
          <Input label="Parking Slot" placeholder="P-XXX" />
          <Input label="Locker Number" placeholder="L-XXX" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <Input label="Mobile Device" placeholder="Device ID" />
          <Input label="Access Card" placeholder="Card Number" />
          <Input label="Keys Issued" placeholder="Key Numbers" />
          <Input label="Other Assets" placeholder="List" />
        </div>
      </FormSection>
    </div>;


  const renderTabContent = () => {
    const tabs: Record<string, JSX.Element> = {
      personal: <PersonalDetails />,
      contact: <ContactAddress />,
      employment: <EmploymentInfo />,
      qualification: <Qualification />,
      bank: <BankSalary />,
      family: <FamilyNominee />,
      documents: <Documents />,
      health: <HealthRecords />,
      operations: <Operations />
    };
    return tabs[activeTab] || <div className="text-center py-12 text-gray-500">Content coming soon</div>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add Employee Profile</h1>
            <p className="text-sm text-gray-500">Create a comprehensive employee record</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setShowApplicantPicker(true)} leftIcon={<Users className="w-4 h-4" />}>Import Applicant Data</Button>
          <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          <Button variant="outline"><Save className="w-4 h-4 mr-2" />Save Draft</Button>
          <Button variant="primary"><CheckCircle className="w-4 h-4 mr-2" />Save & Submit</Button>
        </div>
      </div>

      <Card className="p-6">
        {importedApplicant && (
          <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Applicant data imported</p>
                <h2 className="mt-1 text-lg font-semibold text-blue-950">{importedApplicant.fullName} <span className="text-sm font-normal text-blue-700">· {importedApplicant.id}</span></h2>
                <p className="mt-1 text-sm text-blue-800">Mapped fields are prefilled below. The original application details are retained here for review.</p>
              </div>
              <Badge variant="info">{importedApplicant.status}</Badge>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div><p className="text-xs text-blue-700">Role / Department</p><p className="text-sm font-medium text-gray-900">{importedApplicant.position} · {importedApplicant.department}</p></div>
              <div><p className="text-xs text-blue-700">Contact</p><p className="text-sm font-medium text-gray-900">{importedApplicant.email} · {importedApplicant.phone}</p></div>
              <div><p className="text-xs text-blue-700">Qualification / Experience</p><p className="text-sm font-medium text-gray-900">{importedApplicant.qualification} · {importedApplicant.experience}</p></div>
              <div><p className="text-xs text-blue-700">Source / Applied</p><p className="text-sm font-medium text-gray-900">{importedApplicant.source} · {importedApplicant.appliedDate}</p></div>
              <div><p className="text-xs text-blue-700">Expected Salary</p><p className="text-sm font-medium text-gray-900">{importedApplicant.expectedSalary}</p></div>
              <div><p className="text-xs text-blue-700">Branch</p><p className="text-sm font-medium text-gray-900">{importedApplicant.branch}</p></div>
              <div className="sm:col-span-2 xl:col-span-2"><p className="text-xs text-blue-700">Address / Skills</p><p className="text-sm font-medium text-gray-900">{importedApplicant.address} · {importedApplicant.tags.join(', ')}</p></div>
            </div>
          </div>
        )}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-56 flex-shrink-0 space-y-1">
            {tabConfig.map((tab) =>
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                <tab.icon className="w-4 h-4" />{tab.label}
              </button>
            )}
          </div>
          <div className="flex-1 min-w-0">{renderTabContent()}</div>
        </div>
      </Card>

      <Modal isOpen={showApplicantPicker} onClose={() => setShowApplicantPicker(false)} title="Import Applicant Data" size="lg">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Select an applicant to prefill matching Employee Profile fields. Review and complete any details not included in their application.</p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input aria-label="Search applicants" type="search" placeholder="Search by applicant name, ID, email, position or department" value={applicantSearch} onChange={(event) => setApplicantSearch(event.target.value)} className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="max-h-[55vh] space-y-2 overflow-y-auto">
            {filteredApplicantRecords.length > 0 ? filteredApplicantRecords.map((applicant) => (
              <button key={applicant.id} type="button" onClick={() => handleImportApplicant(applicant)} className="w-full rounded-xl border border-gray-200 p-4 text-left transition-colors hover:border-blue-300 hover:bg-blue-50">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div><p className="font-semibold text-gray-900">{applicant.fullName}</p><p className="text-xs text-gray-500">{applicant.id} · {applicant.position} · {applicant.department}</p></div>
                  <Badge variant={applicant.status === 'Selected' ? 'success' : 'info'}>{applicant.status}</Badge>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-gray-600 sm:grid-cols-2">
                  <p>{applicant.email} · {applicant.phone}</p><p>{applicant.qualification} · {applicant.experience}</p>
                  <p>{applicant.source} · Applied {applicant.appliedDate}</p><p>Expected {applicant.expectedSalary} · {applicant.branch}</p>
                  <p className="sm:col-span-2">Skills / tags: {applicant.tags.join(', ')}</p>
                </div>
              </button>
            )) : <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">No applicants match that search.</div>}
          </div>
        </div>
      </Modal>
    </div>);

}