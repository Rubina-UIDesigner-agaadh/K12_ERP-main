// EmployeeProfile.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, MapPin, Briefcase, GraduationCap, CreditCard, Users, Shield, Save, ArrowLeft,
  Search, Filter, X, Calendar, Clock, Target, Award, TrendingUp, Heart, FileText,
  Settings, Bell, Mail, Phone, Building, ChevronDown, Plus, Trash2, Upload, Star,
  CheckCircle, AlertCircle, Activity, BookOpen, MessageSquare, Gift, Coffee } from
'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
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
const designationOptions = [{ value: 'prin', label: 'Principal' }, { value: 'vprin', label: 'Vice Principal' }, { value: 'hod', label: 'HOD' }, { value: 'st', label: 'Senior Teacher' }, { value: 'jt', label: 'Junior Teacher' }, { value: 'coord', label: 'Coordinator' }, { value: 'clerk', label: 'Clerk' }, { value: 'peon', label: 'Peon' }];
const paymentOptions = [{ value: 'bank', label: 'Bank Transfer' }, { value: 'cheque', label: 'Cheque' }, { value: 'cash', label: 'Cash' }];
const gradeOptions = [{ value: 'g1', label: 'Grade 1' }, { value: 'g2', label: 'Grade 2' }, { value: 'g3', label: 'Grade 3' }, { value: 'g4', label: 'Grade 4' }, { value: 'g5', label: 'Grade 5' }];
const relationOptions = [{ value: 'spouse', label: 'Spouse' }, { value: 'father', label: 'Father' }, { value: 'mother', label: 'Mother' }, { value: 'child', label: 'Child' }, { value: 'sibling', label: 'Sibling' }];
const shiftOptions = [{ value: 'morning', label: 'Morning (7AM-3PM)' }, { value: 'day', label: 'Day (9AM-5PM)' }, { value: 'evening', label: 'Evening (2PM-10PM)' }, { value: 'flexible', label: 'Flexible' }];
const leaveTypeOptions = [{ value: 'cl', label: 'Casual Leave' }, { value: 'sl', label: 'Sick Leave' }, { value: 'el', label: 'Earned Leave' }, { value: 'ml', label: 'Maternity Leave' }, { value: 'pl', label: 'Paternity Leave' }];
const ratingOptions = [{ value: '5', label: '5 - Outstanding' }, { value: '4', label: '4 - Exceeds Expectations' }, { value: '3', label: '3 - Meets Expectations' }, { value: '2', label: '2 - Needs Improvement' }, { value: '1', label: '1 - Unsatisfactory' }];
const roleOptions = [{ value: 'admin', label: 'Administrator' }, { value: 'hr', label: 'HR Manager' }, { value: 'teacher', label: 'Teacher' }, { value: 'staff', label: 'Staff' }, { value: 'viewer', label: 'Viewer' }];

export function EmployeeProfile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [showFilters, setShowFilters] = useState(false);
  const [experiences, setExperiences] = useState([{ id: 1 }]);
  const [familyMembers, setFamilyMembers] = useState([{ id: 1 }]);
  const [documents, setDocuments] = useState([{ id: 1 }]);
  const [goals, setGoals] = useState([{ id: 1 }]);
  const [trainings, setTrainings] = useState([{ id: 1 }]);

  const addItem = (setter: any, items: any[]) => setter([...items, { id: Date.now() }]);
  const removeItem = (setter: any, items: any[], id: number) => setter(items.filter((i) => i.id !== id));

  const FormSection = ({ title, children }: {title: string;children: React.ReactNode;}) =>
  <div className="border-t pt-4 first:border-t-0 first:pt-0">
      <h4 className="font-semibold text-gray-900 mb-4">{title}</h4>
      {children}
    </div>;


  const SearchFilters = () =>
  <Card className="p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Filter className="w-5 h-5" />Search & Filter Employees</h3>
        <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? <X className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>
      <div className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by name, code, email, phone..." className="w-full pl-10 pr-4 py-2 border rounded-lg" />
        </div>
        <Button variant="primary"><Search className="w-4 h-4 mr-2" />Search</Button>
      </div>
      {showFilters &&
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 pt-4 border-t">
          <Select label="Department" options={[{ value: '', label: 'All' }, ...departmentOptions]} value="" onChange={() => {}} />
          <Select label="Designation" options={[{ value: '', label: 'All' }, ...designationOptions]} value="" onChange={() => {}} />
          <Select label="Staff Type" options={[{ value: '', label: 'All' }, ...staffTypeOptions]} value="" onChange={() => {}} />
          <Select label="Employment Type" options={[{ value: '', label: 'All' }, ...employmentOptions]} value="" onChange={() => {}} />
          <Select label="Status" options={[{ value: '', label: 'All' }, ...statusOptions]} value="" onChange={() => {}} />
          <Select label="Gender" options={[{ value: '', label: 'All' }, ...genderOptions]} value="" onChange={() => {}} />
          <Input label="Joining From" type="date" />
          <Input label="Joining To" type="date" />
          <Select label="Salary Grade" options={[{ value: '', label: 'All' }, ...gradeOptions]} value="" onChange={() => {}} />
          <Select label="Blood Group" options={[{ value: '', label: 'All' }, ...bloodOptions]} value="" onChange={() => {}} />
          <Select label="Shift" options={[{ value: '', label: 'All' }, ...shiftOptions]} value="" onChange={() => {}} />
          <Select label="Category" options={[{ value: '', label: 'All' }, ...categoryOptions]} value="" onChange={() => {}} />
          <div className="col-span-full flex gap-2">
            <Button variant="outline">Clear Filters</Button>
            <Button variant="primary">Apply Filters</Button>
          </div>
        </div>
    }
    </Card>;


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
        <Input label="Employee Code" placeholder="Auto-generated" />
        <Input label="Title" placeholder="Mr/Mrs/Ms/Dr" />
        <Input label="First Name" placeholder="First Name" required />
        <Input label="Last Name" placeholder="Last Name" required />
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
        <Input label="Primary Mobile" placeholder="+91 XXXXXXXXXX" required />
        <Input label="Secondary Mobile" placeholder="+91 XXXXXXXXXX" />
        <Input label="WhatsApp Number" placeholder="+91 XXXXXXXXXX" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input label="Official Email" type="email" placeholder="name@school.edu" required />
        <Input label="Personal Email" type="email" placeholder="personal@email.com" />
        <Input label="LinkedIn Profile" placeholder="linkedin.com/in/username" />
      </div>
      <FormSection title="Permanent Address">
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
        <Select label="Department" options={departmentOptions} value="" onChange={() => {}} />
        <Select label="Designation" options={designationOptions} value="" onChange={() => {}} />
        <Input label="Reporting Manager" placeholder="Select Manager" />
        <Input label="Secondary Manager" placeholder="Select (optional)" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input label="Campus/Branch" placeholder="Main Campus" />
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
          <Input label="Primary Subject" placeholder="Mathematics" />
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
          <Input label="Degree/Certification" placeholder="B.Ed, M.Ed, etc." />
          <Input label="Institution" placeholder="University Name" />
          <Input label="Year" type="number" placeholder="2020" />
          <Input label="Grade/Score" placeholder="A / 80%" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Input label="Specialization" placeholder="Special Education, etc." />
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
          <Input label="Technical Skills" placeholder="MS Office, Tally, etc." />
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
        <div className="flex gap-2">
          <Button variant="outline">Cancel</Button>
          <Button variant="outline"><Save className="w-4 h-4 mr-2" />Save Draft</Button>
          <Button variant="primary"><CheckCircle className="w-4 h-4 mr-2" />Save & Submit</Button>
        </div>
      </div>

      <SearchFilters />

      <Card className="p-6">
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
    </div>);

}