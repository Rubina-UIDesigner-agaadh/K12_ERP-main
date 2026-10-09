// EmployeeProfile.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
{ id: 'operations', label: 'Operations', icon: Clock },
{ id: 'performance', label: 'Performance', icon: Target },
{ id: 'engagement', label: 'Engagement', icon: Heart },
{ id: 'account', label: 'Account Details', icon: Settings },
{ id: 'system', label: 'System Access', icon: Shield }];


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

export function EmployeeProfile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [showApplicantPicker, setShowApplicantPicker] = useState(false);
  const [applicantSearch, setApplicantSearch] = useState('');
  const [importedApplicant, setImportedApplicant] = useState<ApplicantImportRecord | null>(null);
  const [applicantPrefill, setApplicantPrefill] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    personalEmail: '',
    address: '',
    department: '',
    designation: '',
    branch: '',
    subject: '',
    qualification: '',
    experience: '',
    source: '',
    expectedSalary: '',
    tags: ''
  });
  const [experiences, setExperiences] = useState([{ id: 1 }]);
  const [familyMembers, setFamilyMembers] = useState([{ id: 1 }]);
  const [documents, setDocuments] = useState([{ id: 1 }]);
  const [goals, setGoals] = useState([{ id: 1 }]);
  const [trainings, setTrainings] = useState([{ id: 1 }]);
  const [employeeCode, setEmployeeCode] = useState('');
  const [healthForm, setHealthForm] = useState({
    bloodGroup: '',
    allergies: '',
    medicalConditions: '',
    emergencyMedical: '',
    insuranceNumber: '',
    lastCheckup: ''
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
        <Select label="Gender" options={genderOptions} value="" onChange={() => {}} />
        <Input label="Date of Birth" type="date" required />
        <Select label="Marital Status" options={maritalOptions} value="" onChange={() => {}} />
        <Input label="Anniversary Date" type="date" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input label="Nationality" placeholder="Indian" />
        <Select label="Religion" options={religionOptions} value="" onChange={() => {}} />
        <Select label="Category" options={categoryOptions} value="" onChange={() => {}} />
        <Input label="Caste" placeholder="Caste (optional)" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select label="Blood Group" options={bloodOptions} value="" onChange={() => {}} />
        <Input label="Height (cm)" type="number" placeholder="170" />
        <Input label="Weight (kg)" type="number" placeholder="70" />
        <Input label="Mother Tongue" placeholder="Hindi" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input label="Aadhaar Number" placeholder="XXXX XXXX XXXX" required />
        <Input label="PAN Number" placeholder="ABCDE1234F" />
        <Input label="Voter ID" placeholder="Voter ID" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input label="Passport Number" placeholder="Passport (optional)" />
        <Input label="Passport Expiry" type="date" />
        <Input label="Driving License" placeholder="DL Number" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Identification Marks" placeholder="Any visible marks" />
        <Input label="Known Languages" placeholder="Hindi, English, etc." />
      </div>
      <div className="grid grid-cols-1 gap-4">
        <Input label="Medical Conditions (if any)" placeholder="Diabetes, BP, allergies, etc." />
      </div>
    </div>;


  const ContactAddress = () =>
  <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input label="Primary Mobile" placeholder="+91 XXXXXXXXXX" value={applicantPrefill.phone} onChange={(event) => setApplicantPrefill((current) => ({ ...current, phone: event.target.value }))} required />
        <Input label="Secondary Mobile" placeholder="+91 XXXXXXXXXX" />
        <Input label="WhatsApp Number" placeholder="+91 XXXXXXXXXX" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input label="Official Email" type="email" placeholder="name@school.edu" required />
        <Input label="Personal Email" type="email" placeholder="personal@email.com" value={applicantPrefill.personalEmail} onChange={(event) => setApplicantPrefill((current) => ({ ...current, personalEmail: event.target.value }))} />
        <Input label="LinkedIn Profile" placeholder="linkedin.com/in/username" />
      </div>
      <FormSection title="Permanent Address">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="House No. / Building" placeholder="House/Flat No." />
          <Input label="Street / Locality" placeholder="Street Name" value={applicantPrefill.address} onChange={(event) => setApplicantPrefill((current) => ({ ...current, address: event.target.value }))} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <Input label="City" placeholder="City" />
          <Input label="District" placeholder="District" />
          <Input label="State" placeholder="State" />
          <Input label="Pincode" placeholder="XXXXXX" />
        </div>
        <Input label="Landmark" placeholder="Near..." className="mt-4" />
      </FormSection>
      <FormSection title="Current Address">
        <div className="flex items-center mb-4">
          <input type="checkbox" id="sameAddress" className="mr-2" />
          <label htmlFor="sameAddress" className="text-sm text-gray-600">Same as Permanent Address</label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="House No. / Building" placeholder="House/Flat No." />
          <Input label="Street / Locality" placeholder="Street Name" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <Input label="City" placeholder="City" />
          <Input label="District" placeholder="District" />
          <Input label="State" placeholder="State" />
          <Input label="Pincode" placeholder="XXXXXX" />
        </div>
      </FormSection>
      <FormSection title="Emergency Contacts">
        <div className="space-y-4">
          {[1, 2].map((i) =>
        <div key={i} className="bg-gray-50 p-4 rounded-lg border">
              <h5 className="font-medium text-gray-700 mb-3">Emergency Contact {i}</h5>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input label="Name" placeholder="Full Name" />
                <Select label="Relationship" options={relationOptions} value="" onChange={() => {}} />
                <Input label="Phone" placeholder="+91 XXXXXXXXXX" />
                <Input label="Address" placeholder="Address" />
              </div>
            </div>
        )}
        </div>
      </FormSection>
    </div>;


  const EmploymentInfo = () =>
  <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select label="Staff Type" options={staffTypeOptions} value="" onChange={() => {}} />
        <Select label="Employment Type" options={employmentOptions} value="" onChange={() => {}} />
        <Select label="Status" options={statusOptions} value="" onChange={() => {}} />
        <Input label="Date of Joining" type="date" required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select label="Department" options={departmentOptions} value={applicantPrefill.department} onChange={(event) => setApplicantPrefill((current) => ({ ...current, department: event.target.value }))} />
        <Select label="Designation" options={designationOptions} value={applicantPrefill.designation} onChange={(event) => setApplicantPrefill((current) => ({ ...current, designation: event.target.value }))} />
        <Input label="Reporting Manager" placeholder="Select Manager" />
        <Input label="Secondary Manager" placeholder="Select (optional)" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input label="Campus/Branch" placeholder="Main Campus" value={applicantPrefill.branch} onChange={(event) => setApplicantPrefill((current) => ({ ...current, branch: event.target.value }))} />
        <Input label="Building/Block" placeholder="Block A" />
        <Input label="Office Room" placeholder="Room 101" />
        <Input label="Extension Number" placeholder="Ext. 123" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input label="Probation End Date" type="date" />
        <Input label="Confirmation Date" type="date" />
        <Input label="Contract End Date" type="date" />
        <Input label="Notice Period (Days)" type="number" placeholder="30" />
      </div>
      <FormSection title="Teaching Details (if applicable)">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Primary Subject" placeholder="Mathematics" value={applicantPrefill.subject} onChange={(event) => setApplicantPrefill((current) => ({ ...current, subject: event.target.value }))} />
          <Input label="Secondary Subjects" placeholder="Physics, Chemistry" />
          <Input label="Classes Handling" placeholder="IX, X, XI, XII" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Input label="Weekly Teaching Hours" type="number" placeholder="30" />
          <Input label="Max Periods/Day" type="number" placeholder="6" />
          <Select label="Class Teacher Of" options={[{ value: '', label: 'None' }, { value: '10a', label: 'Class 10-A' }]} value="" onChange={() => {}} />
        </div>
      </FormSection>
      <FormSection title="Previous Employment in Organization">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Previous Employee Code" placeholder="If rejoined" />
          <Input label="Previous Joining Date" type="date" />
          <Input label="Previous Exit Date" type="date" />
        </div>
        <Input label="Reason for Leaving" placeholder="Reason" className="mt-4" />
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
          <Input label="Institution" placeholder="University Name" />
          <Input label="Year" type="number" placeholder="2020" />
          <Input label="Grade/Score" placeholder="A / 80%" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Input label="Specialization" placeholder="Special Education, etc." value={applicantPrefill.subject} onChange={(event) => setApplicantPrefill((current) => ({ ...current, subject: event.target.value }))} />
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
          <Input label="Soft Skills" placeholder="Communication, Leadership" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Input label="Languages Known" placeholder="English (Fluent), Hindi (Native)" />
          <Input label="Hobbies & Interests" placeholder="Reading, Sports, etc." />
        </div>
      </FormSection>
    </div>;


  const BankSalary = () =>
  <div className="space-y-6">
      <FormSection title="Primary Bank Account">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input label="Bank Name" placeholder="State Bank of India" />
          <Input label="Branch Name" placeholder="Main Branch" />
          <Input label="Account Number" placeholder="XXXXXXXXXX" />
          <Input label="Confirm Account" placeholder="Re-enter Account" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <Input label="IFSC Code" placeholder="SBIN0001234" />
          <Input label="Account Type" placeholder="Savings/Current" />
          <Input label="MICR Code" placeholder="XXXXXX" />
          <Select label="Payment Mode" options={paymentOptions} value="" onChange={() => {}} />
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
          <Select label="Salary Grade" options={gradeOptions} value="" onChange={() => {}} />
          <Input label="Basic Pay" type="number" placeholder="25000" />
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
          <Input label="PF Number" placeholder="PF Account Number" />
          <Input label="UAN Number" placeholder="Universal Account No." />
          <Input label="ESI Number" placeholder="ESI Number" />
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
        {[{ label: 'Aadhaar Card', required: true }, { label: 'PAN Card', required: true }, { label: 'Passport', required: false }, { label: 'Voter ID', required: false }, { label: 'Driving License', required: false }].map((doc) =>
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
          <Select label="Blood Group" options={[{ value: '', label: 'Select blood group' }, ...bloodOptions.map((option) => ({ value: option.label, label: option.label }))]} value={healthForm.bloodGroup} onChange={(event) => setHealthForm((current) => ({ ...current, bloodGroup: event.target.value }))} />
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
          <Select label="Default Shift" options={shiftOptions} value="" onChange={() => {}} />
          <Input label="Work Hours/Day" type="number" placeholder="8" />
          <Input label="Weekly Off" placeholder="Sunday" />
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


  const Performance = () =>
  <div className="space-y-6">
      <FormSection title="Current Goals & KPIs">
        {goals.map((goal, idx) =>
      <div key={goal.id} className="bg-gray-50 p-4 rounded-lg border mb-4">
            <div className="flex justify-between items-center mb-3">
              <h5 className="font-medium text-gray-700">Goal {idx + 1}</h5>
              {goals.length > 1 && <Button variant="outline" size="sm" onClick={() => removeItem(setGoals, goals, goal.id)}><Trash2 className="w-4 h-4" /></Button>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input label="Goal Title" placeholder="Goal Name" />
              <Select label="Category" options={[{ value: 'academic', label: 'Academic' }, { value: 'admin', label: 'Administrative' }, { value: 'personal', label: 'Personal Development' }]} value="" onChange={() => {}} />
              <Input label="Target Date" type="date" />
              <Input label="Weightage %" type="number" placeholder="25" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Input label="KPI Metric" placeholder="e.g., Student Pass %" />
              <Input label="Target Value" placeholder="e.g., 95%" />
              <Select label="Status" options={[{ value: 'pending', label: 'Pending' }, { value: 'progress', label: 'In Progress' }, { value: 'completed', label: 'Completed' }]} value="" onChange={() => {}} />
            </div>
            <Input label="Description" placeholder="Goal description..." className="mt-4" />
          </div>
      )}
        <Button variant="outline" size="sm" onClick={() => addItem(setGoals, goals)}><Plus className="w-4 h-4 mr-2" />Add Goal</Button>
      </FormSection>
      <FormSection title="Performance Appraisal">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input label="Appraisal Period" placeholder="FY 2024-25" />
          <Select label="Self Rating" options={ratingOptions} value="" onChange={() => {}} />
          <Select label="Manager Rating" options={ratingOptions} value="" onChange={() => {}} />
          <Select label="Final Rating" options={ratingOptions} value="" onChange={() => {}} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Input label="Strengths" placeholder="Key strengths identified" />
          <Input label="Areas of Improvement" placeholder="Areas to work on" />
        </div>
        <Input label="Manager Comments" placeholder="Detailed feedback..." className="mt-4" />
      </FormSection>
      <FormSection title="Awards & Recognition">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input label="Award Title" placeholder="Best Teacher Award" />
          <Input label="Awarded By" placeholder="Organization" />
          <Input label="Award Date" type="date" />
          <Input label="Description" placeholder="Details" />
        </div>
        <Button variant="outline" size="sm" className="mt-4"><Plus className="w-4 h-4 mr-2" />Add Award</Button>
      </FormSection>
      <FormSection title="Disciplinary Records">
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input label="Incident Date" type="date" />
            <Select label="Type" options={[{ value: 'warning', label: 'Warning' }, { value: 'suspension', label: 'Suspension' }, { value: 'show_cause', label: 'Show Cause' }]} value="" onChange={() => {}} />
            <Input label="Issued By" placeholder="Manager Name" />
            <Select label="Status" options={[{ value: 'open', label: 'Open' }, { value: 'closed', label: 'Closed' }]} value="" onChange={() => {}} />
          </div>
          <Input label="Details" placeholder="Incident description..." className="mt-4" />
        </div>
      </FormSection>
    </div>;


  const Engagement = () =>
  <div className="space-y-6">
      <FormSection title="Training & Development">
        {trainings.map((training, idx) =>
      <div key={training.id} className="bg-gray-50 p-4 rounded-lg border mb-4">
            <div className="flex justify-between items-center mb-3">
              <h5 className="font-medium text-gray-700">Training {idx + 1}</h5>
              {trainings.length > 1 && <Button variant="outline" size="sm" onClick={() => removeItem(setTrainings, trainings, training.id)}><Trash2 className="w-4 h-4" /></Button>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input label="Training Name" placeholder="Program Title" />
              <Input label="Provider" placeholder="Training Provider" />
              <Input label="Date" type="date" />
              <Input label="Duration (hours)" type="number" placeholder="8" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Select label="Mode" options={[{ value: 'online', label: 'Online' }, { value: 'offline', label: 'Offline' }, { value: 'hybrid', label: 'Hybrid' }]} value="" onChange={() => {}} />
              <Select label="Status" options={[{ value: 'upcoming', label: 'Upcoming' }, { value: 'ongoing', label: 'Ongoing' }, { value: 'completed', label: 'Completed' }]} value="" onChange={() => {}} />
              <Input label="Certificate ID" placeholder="If completed" />
            </div>
          </div>
      )}
        <Button variant="outline" size="sm" onClick={() => addItem(setTrainings, trainings)}><Plus className="w-4 h-4 mr-2" />Add Training</Button>
      </FormSection>
      <FormSection title="Committee & Club Memberships">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input label="Committee/Club Name" placeholder="Sports Committee" />
          <Select label="Role" options={[{ value: 'member', label: 'Member' }, { value: 'coordinator', label: 'Coordinator' }, { value: 'head', label: 'Head' }]} value="" onChange={() => {}} />
          <Input label="Since" type="date" />
          <Input label="Responsibilities" placeholder="Key duties" />
        </div>
        <Button variant="outline" size="sm" className="mt-4"><Plus className="w-4 h-4 mr-2" />Add Membership</Button>
      </FormSection>
      <FormSection title="Activities & Events">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input label="Event Name" placeholder="Annual Day" />
          <Input label="Role" placeholder="Organizer/Participant" />
          <Input label="Date" type="date" />
          <Input label="Contribution" placeholder="Details" />
        </div>
        <Button variant="outline" size="sm" className="mt-4"><Plus className="w-4 h-4 mr-2" />Add Activity</Button>
      </FormSection>
      <FormSection title="Employee Satisfaction">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
            <Star className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-900">4.5/5</p>
            <p className="text-sm text-green-700">Job Satisfaction</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
            <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-900">85%</p>
            <p className="text-sm text-blue-700">Engagement Score</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 text-center">
            <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-900">High</p>
            <p className="text-sm text-purple-700">Growth Potential</p>
          </div>
        </div>
      </FormSection>
      <FormSection title="Feedback & Suggestions">
        <Input label="Recent Feedback" placeholder="Employee's recent feedback..." />
        <Input label="Suggestions" placeholder="Improvement suggestions..." className="mt-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Input label="Last Survey Date" type="date" />
          <Select label="Survey Participation" options={[{ value: 'yes', label: 'Participated' }, { value: 'no', label: 'Not Participated' }]} value="" onChange={() => {}} />
        </div>
      </FormSection>
    </div>;


  const AccountDetails = () =>
  <div className="space-y-6">
      <FormSection title="Login Credentials">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Username" placeholder="Auto-generated from Email" disabled />
          <Input label="Temporary Password" type="password" placeholder="System Generated" disabled />
          <div className="flex items-end gap-2">
            <Button variant="outline"><Mail className="w-4 h-4 mr-2" />Send Credentials</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Input label="Last Login" placeholder="Never" disabled />
          <Input label="Password Last Changed" placeholder="N/A" disabled />
          <Select label="Account Status" options={[{ value: 'active', label: 'Active' }, { value: 'locked', label: 'Locked' }, { value: 'disabled', label: 'Disabled' }]} value="" onChange={() => {}} />
        </div>
      </FormSection>
      <FormSection title="Multi-Factor Authentication">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select label="MFA Enabled" options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} value="" onChange={() => {}} />
          <Select label="MFA Method" options={[{ value: 'sms', label: 'SMS OTP' }, { value: 'email', label: 'Email OTP' }, { value: 'app', label: 'Authenticator App' }]} value="" onChange={() => {}} />
          <Input label="Recovery Email" type="email" placeholder="backup@email.com" />
        </div>
      </FormSection>
      <FormSection title="Session & Security">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input label="Session Timeout (mins)" type="number" placeholder="30" />
          <Select label="IP Restriction" options={[{ value: 'no', label: 'No Restriction' }, { value: 'office', label: 'Office Only' }, { value: 'custom', label: 'Custom IPs' }]} value="" onChange={() => {}} />
          <Input label="Allowed IPs" placeholder="192.168.1.*" />
          <Select label="Device Limit" options={[{ value: '1', label: '1 Device' }, { value: '3', label: '3 Devices' }, { value: 'unlimited', label: 'Unlimited' }]} value="" onChange={() => {}} />
        </div>
      </FormSection>
      <FormSection title="Notifications Preferences">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Email Notifications', 'SMS Alerts', 'Push Notifications', 'WhatsApp Updates', 'Leave Alerts', 'Salary Alerts', 'Announcement Alerts', 'Task Reminders'].map((pref) =>
        <label key={pref} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-sm">{pref}</span>
            </label>
        )}
        </div>
      </FormSection>
      <FormSection title="API & Integration Access">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="API Key" placeholder="Auto-generated" disabled />
          <Select label="API Access" options={[{ value: 'none', label: 'No Access' }, { value: 'read', label: 'Read Only' }, { value: 'full', label: 'Full Access' }]} value="" onChange={() => {}} />
          <div className="flex items-end"><Button variant="outline">Generate New Key</Button></div>
        </div>
      </FormSection>
    </div>;


  const SystemAccess = () =>
  <div className="space-y-6">
      <FormSection title="Role & Permissions">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select label="Primary Role" options={roleOptions} value="" onChange={() => {}} />
          <Select label="Secondary Role" options={[{ value: '', label: 'None' }, ...roleOptions]} value="" onChange={() => {}} />
          <Input label="Custom Role" placeholder="If applicable" />
        </div>
      </FormSection>
      <FormSection title="Module Access">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Dashboard', 'Students', 'Employees', 'Attendance', 'Fees', 'Payroll', 'Timetable', 'Examinations', 'Reports', 'Library', 'Transport', 'Inventory', 'Communication', 'Settings', 'HR Management', 'Accounts'].map((module) =>
        <label key={module} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border cursor-pointer hover:bg-gray-100">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm font-medium">{module}</span>
            </label>
        )}
        </div>
      </FormSection>
      <FormSection title="Data Access Level">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select label="Branch Access" options={[{ value: 'own', label: 'Own Branch Only' }, { value: 'selected', label: 'Selected Branches' }, { value: 'all', label: 'All Branches' }]} value="" onChange={() => {}} />
          <Select label="Department Access" options={[{ value: 'own', label: 'Own Department' }, { value: 'selected', label: 'Selected Departments' }, { value: 'all', label: 'All Departments' }]} value="" onChange={() => {}} />
          <Select label="Class Access" options={[{ value: 'assigned', label: 'Assigned Classes' }, { value: 'all', label: 'All Classes' }]} value="" onChange={() => {}} />
        </div>
      </FormSection>
      <FormSection title="Action Permissions">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3">Module</th>
                <th className="text-center p-3">View</th>
                <th className="text-center p-3">Create</th>
                <th className="text-center p-3">Edit</th>
                <th className="text-center p-3">Delete</th>
                <th className="text-center p-3">Export</th>
                <th className="text-center p-3">Approve</th>
              </tr>
            </thead>
            <tbody>
              {['Students', 'Employees', 'Fees', 'Attendance', 'Reports'].map((module) =>
            <tr key={module} className="border-b">
                  <td className="p-3 font-medium">{module}</td>
                  {[...Array(6)].map((_, i) =>
              <td key={i} className="text-center p-3"><input type="checkbox" className="w-4 h-4" /></td>
              )}
                </tr>
            )}
            </tbody>
          </table>
        </div>
      </FormSection>
      <FormSection title="Time-based Access">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select label="Access Type" options={[{ value: '24x7', label: '24x7 Access' }, { value: 'working', label: 'Working Hours Only' }, { value: 'custom', label: 'Custom Schedule' }]} value="" onChange={() => {}} />
          <Input label="Access Start Time" type="time" />
          <Input label="Access End Time" type="time" />
          <Input label="Access Days" placeholder="Mon-Fri" />
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
      operations: <Operations />,
      performance: <Performance />,
      engagement: <Engagement />,
      account: <AccountDetails />,
      system: <SystemAccess />
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