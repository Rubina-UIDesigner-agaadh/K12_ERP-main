import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import {
  SearchIcon, ArrowRightIcon, PlusIcon, FileTextIcon, UserIcon, SaveIcon, PrinterIcon,
  CheckCircleIcon, XCircleIcon, AlertTriangleIcon, CalendarIcon, PhoneIcon, MapPinIcon,
  SchoolIcon, ClipboardCheckIcon, RotateCcwIcon, UserPlusIcon, UserMinusIcon, FileIcon,
  BookOpenIcon, DollarSignIcon, Building2Icon, HeartIcon, ShieldIcon, UsersIcon, EyeIcon,
  ExternalLinkIcon, CheckIcon, XIcon, ClockIcon, BuildingIcon } from
'lucide-react';

// Types
type FormType = 'incoming' | 'transfer' | 'withdrawal';

interface Student {
  id: string;grNo: string;suId: string;firstName: string;middleName: string;lastName: string;
  class: string;section: string;department: string;rollNo: string;dob: string;gender: string;
  category: string;socialCategory: string;admissionType: string;ewsStatus: string;minorityStatus: string;
  disabilityStatus: string;disabilityType: string;fatherName: string;fatherMobile: string;
  motherName: string;motherMobile: string;address: string;city: string;state: string;pinCode: string;
  admissionDate: string;photo: string | null;feeStatus: 'Paid' | 'Pending' | 'Partial';
  libraryDues: boolean;labDues: boolean;
}

interface IncomingTransferRequest {
  id: string;requestDate: string;status: 'pending' | 'approved' | 'rejected' | 'admitted';
  fromBranch: string;toBranch: string;fromBranchName: string;toBranchName: string;
  student: {firstName: string;middleName: string;lastName: string;dob: string;gender: string;bloodGroup: string;category: string;socialCategory: string;admissionType: string;ewsStatus: string;minorityStatus: string;disabilityStatus: string;disabilityType: string;aadharNo: string;photo: string | null;};
  previousSchool: {name: string;address: string;board: string;class: string;rollNo: string;tcNumber: string;tcDate: string;dateOfLeaving: string;reason: string;conduct: string;};
  requestedClass: string;requestedSection: string;requestedDepartment: string;
  parent: {fatherName: string;fatherMobile: string;fatherEmail: string;fatherOccupation: string;motherName: string;motherMobile: string;motherEmail: string;motherOccupation: string;};
  address: {line1: string;line2: string;city: string;state: string;pinCode: string;};
  documents: {tc: boolean;birthCert: boolean;marksheet: boolean;aadhar: boolean;photo: boolean;casteCert: boolean;migration: boolean;medical: boolean;ewsCert: boolean;minorityCert: boolean;disabilityCert: boolean;};
  remarks: string;
}

interface TransferForm {
  lastDateOfAttendance: string;reasonForTransfer: string;otherReason: string;
  destinationBranchName: string;destinationBranchAddress: string;destinationCity: string;destinationState: string;
  socialCategory: string;admissionType: string;ewsStatus: string;minorityStatus: string;disabilityStatus: string;disabilityType: string;
  feeClearance: boolean;feeDues: string;libraryClearance: boolean;libraryDues: string;
  labClearance: boolean;labDues: string;sportsClearance: boolean;sportsDues: string;hostelClearance: boolean;hostelDues: string;
  tcNumber: string;tcIssueDate: string;conductCertificate: string;characterCertificate: string;
  parentConsent: boolean;principalApproval: boolean;remarks: string;
}

interface WithdrawalForm {
  withdrawalDate: string;lastDateOfAttendance: string;lastClassAttended: string;reasonForWithdrawal: string;otherReason: string;
  socialCategory: string;admissionType: string;ewsStatus: string;minorityStatus: string;disabilityStatus: string;disabilityType: string;
  feeClearance: boolean;feeDuesAmount: string;feeRefundAmount: string;libraryClearance: boolean;libraryBooksReturned: boolean;
  labClearance: boolean;labEquipmentReturned: boolean;sportsClearance: boolean;sportsEquipmentReturned: boolean;
  hostelClearance: boolean;hostelDuesCleared: boolean;idCardReturned: boolean;uniformReturned: boolean;
  documentType: string;documentNumber: string;issueDate: string;cautionMoneyRefund: boolean;cautionMoneyAmount: string;otherRefunds: string;refundMode: string;refundAccountNo: string;refundIFSC: string;
  parentSignature: boolean;studentSignature: boolean;principalApproval: boolean;accountsApproval: boolean;
  remarks: string;feedbackRating: string;feedbackComments: string;
}

// Mock Data
const branches = [{ id: 'main', name: 'Main Campus' }, { id: 'north', name: 'North Branch' }, { id: 'south', name: 'South Branch' }, { id: 'east', name: 'East Branch' }];
const branchColors: Record<string, string> = { main: 'bg-blue-500', north: 'bg-emerald-500', south: 'bg-violet-500', east: 'bg-amber-500' };

const incomingTransferRequests: IncomingTransferRequest[] = [
{ id: 'ITR-001', requestDate: '2025-02-20', status: 'pending', fromBranch: 'north', toBranch: 'main', fromBranchName: 'North Branch', toBranchName: 'Main Campus',
  student: { firstName: 'Aarav', middleName: 'Kumar', lastName: 'Sharma', dob: '2010-05-15', gender: 'Male', bloodGroup: 'B+', category: 'General', socialCategory: 'General', admissionType: 'Transfer', ewsStatus: 'No', minorityStatus: 'No', disabilityStatus: 'No', disabilityType: '', aadharNo: '1234-5678-9012', photo: '/api/placeholder/100/100' },
  previousSchool: { name: 'North Branch School', address: 'North Zone, City', board: 'CBSE', class: '8', rollNo: '15', tcNumber: 'TC-NB-2025-001', tcDate: '2025-02-15', dateOfLeaving: '2025-02-14', reason: 'Parent Job Transfer', conduct: 'Good' },
  requestedClass: '9', requestedSection: 'A', requestedDepartment: 'Science',
  parent: { fatherName: 'Rajesh Sharma', fatherMobile: '9876543210', fatherEmail: 'rajesh@email.com', fatherOccupation: 'Engineer', motherName: 'Priya Sharma', motherMobile: '9876543211', motherEmail: 'priya@email.com', motherOccupation: 'Teacher' },
  address: { line1: '45, Green Park Colony', line2: 'Near City Mall', city: 'Mumbai', state: 'Maharashtra', pinCode: '400001' },
  documents: { tc: true, birthCert: true, marksheet: true, aadhar: true, photo: true, casteCert: false, migration: false, medical: true, ewsCert: false, minorityCert: false, disabilityCert: false },
  remarks: 'Parent transferred to main city branch' },
{ id: 'ITR-002', requestDate: '2025-02-18', status: 'approved', fromBranch: 'south', toBranch: 'main', fromBranchName: 'South Branch', toBranchName: 'Main Campus',
  student: { firstName: 'Priya', middleName: '', lastName: 'Patel', dob: '2009-08-22', gender: 'Female', bloodGroup: 'A+', category: 'OBC', socialCategory: 'OBC', admissionType: 'Transfer', ewsStatus: 'Yes', minorityStatus: 'No', disabilityStatus: 'No', disabilityType: '', aadharNo: '2345-6789-0123', photo: null },
  previousSchool: { name: 'South Branch School', address: 'South Zone, City', board: 'CBSE', class: '9', rollNo: '08', tcNumber: 'TC-SB-2025-002', tcDate: '2025-02-12', dateOfLeaving: '2025-02-10', reason: 'Family Relocation', conduct: 'Excellent' },
  requestedClass: '10', requestedSection: 'B', requestedDepartment: 'Commerce',
  parent: { fatherName: 'Suresh Patel', fatherMobile: '9876543220', fatherEmail: 'suresh@email.com', fatherOccupation: 'Business', motherName: 'Kavita Patel', motherMobile: '9876543221', motherEmail: 'kavita@email.com', motherOccupation: 'Homemaker' },
  address: { line1: '12, Sunrise Apartments', line2: 'Sector 5', city: 'Pune', state: 'Maharashtra', pinCode: '411001' },
  documents: { tc: true, birthCert: true, marksheet: true, aadhar: true, photo: true, casteCert: true, migration: true, medical: true, ewsCert: true, minorityCert: false, disabilityCert: false },
  remarks: 'EWS student - verify certificates' },
{ id: 'ITR-003', requestDate: '2025-02-15', status: 'pending', fromBranch: 'east', toBranch: 'main', fromBranchName: 'East Branch', toBranchName: 'Main Campus',
  student: { firstName: 'Rohan', middleName: 'Vijay', lastName: 'Desai', dob: '2011-03-10', gender: 'Male', bloodGroup: 'O+', category: 'SC', socialCategory: 'SC', admissionType: 'Transfer', ewsStatus: 'No', minorityStatus: 'Yes', disabilityStatus: 'Yes', disabilityType: 'Visual Impairment', aadharNo: '3456-7890-1234', photo: '/api/placeholder/100/100' },
  previousSchool: { name: 'East Branch School', address: 'East Zone, City', board: 'State Board', class: '6', rollNo: '22', tcNumber: 'TC-EB-2025-003', tcDate: '2025-02-10', dateOfLeaving: '2025-02-08', reason: 'Better Opportunities', conduct: 'Good' },
  requestedClass: '7', requestedSection: 'A', requestedDepartment: 'Science',
  parent: { fatherName: 'Vijay Desai', fatherMobile: '9876543230', fatherEmail: 'vijay@email.com', fatherOccupation: 'Government', motherName: 'Sunita Desai', motherMobile: '9876543231', motherEmail: 'sunita@email.com', motherOccupation: 'Nurse' },
  address: { line1: '78, Lake View Society', line2: 'Near Hospital', city: 'Mumbai', state: 'Maharashtra', pinCode: '400050' },
  documents: { tc: true, birthCert: true, marksheet: true, aadhar: true, photo: true, casteCert: true, migration: false, medical: true, ewsCert: false, minorityCert: true, disabilityCert: true },
  remarks: 'PWD student - requires special arrangements' },
{ id: 'ITR-004', requestDate: '2025-02-12', status: 'admitted', fromBranch: 'north', toBranch: 'main', fromBranchName: 'North Branch', toBranchName: 'Main Campus',
  student: { firstName: 'Ananya', middleName: 'Raj', lastName: 'Gupta', dob: '2010-11-25', gender: 'Female', bloodGroup: 'AB+', category: 'General', socialCategory: 'General', admissionType: 'Transfer', ewsStatus: 'No', minorityStatus: 'No', disabilityStatus: 'No', disabilityType: '', aadharNo: '4567-8901-2345', photo: '/api/placeholder/100/100' },
  previousSchool: { name: 'North Branch School', address: 'North Zone, City', board: 'CBSE', class: '10', rollNo: '05', tcNumber: 'TC-NB-2025-004', tcDate: '2025-02-08', dateOfLeaving: '2025-02-07', reason: 'Parent Job Transfer', conduct: 'Excellent' },
  requestedClass: '11', requestedSection: 'A', requestedDepartment: 'Science',
  parent: { fatherName: 'Amit Gupta', fatherMobile: '9876543240', fatherEmail: 'amit@email.com', fatherOccupation: 'Doctor', motherName: 'Neha Gupta', motherMobile: '9876543241', motherEmail: 'neha@email.com', motherOccupation: 'Professor' },
  address: { line1: '23, Elite Residency', line2: 'Main Road', city: 'Mumbai', state: 'Maharashtra', pinCode: '400010' },
  documents: { tc: true, birthCert: true, marksheet: true, aadhar: true, photo: true, casteCert: false, migration: true, medical: true, ewsCert: false, minorityCert: false, disabilityCert: false },
  remarks: 'Admission completed' }];


const studentsData: Student[] = [
{ id: '1', grNo: 'GR-2024-001', suId: 'SU-2024-001', firstName: 'Aarav', middleName: 'Kumar', lastName: 'Sharma', class: '10', section: 'A', department: 'Science', rollNo: '01', dob: '2008-05-15', gender: 'Male', category: 'General', socialCategory: 'General', admissionType: 'Regular', ewsStatus: 'No', minorityStatus: 'No', disabilityStatus: 'No', disabilityType: '', fatherName: 'Rajesh Sharma', fatherMobile: '9876543210', motherName: 'Priya Sharma', motherMobile: '9876543211', address: '45, Green Park Colony', city: 'Mumbai', state: 'Maharashtra', pinCode: '400001', admissionDate: '2020-04-01', photo: '/api/placeholder/100/100', feeStatus: 'Paid', libraryDues: false, labDues: false },
{ id: '2', grNo: 'GR-2024-002', suId: 'SU-2024-002', firstName: 'Priya', middleName: '', lastName: 'Patel', class: '10', section: 'B', department: 'Commerce', rollNo: '15', dob: '2008-08-22', gender: 'Female', category: 'OBC', socialCategory: 'OBC', admissionType: 'RTE', ewsStatus: 'Yes', minorityStatus: 'No', disabilityStatus: 'No', disabilityType: '', fatherName: 'Suresh Patel', fatherMobile: '9876543220', motherName: 'Kavita Patel', motherMobile: '9876543221', address: '12, Sunrise Apartments', city: 'Pune', state: 'Maharashtra', pinCode: '411001', admissionDate: '2020-04-01', photo: null, feeStatus: 'Pending', libraryDues: true, labDues: false },
{ id: '3', grNo: 'GR-2024-003', suId: 'SU-2024-003', firstName: 'Rohan', middleName: 'Vijay', lastName: 'Desai', class: '9', section: 'A', department: 'Science', rollNo: '08', dob: '2009-03-10', gender: 'Male', category: 'General', socialCategory: 'SC', admissionType: 'Transfer', ewsStatus: 'No', minorityStatus: 'Yes', disabilityStatus: 'Yes', disabilityType: 'Visual Impairment', fatherName: 'Vijay Desai', fatherMobile: '9876543230', motherName: 'Sunita Desai', motherMobile: '9876543231', address: '78, Lake View Society', city: 'Mumbai', state: 'Maharashtra', pinCode: '400050', admissionDate: '2021-04-05', photo: '/api/placeholder/100/100', feeStatus: 'Paid', libraryDues: false, labDues: true }];


// Options
const createOptions = (arr: string[], prefix = '') => [{ value: '', label: prefix || 'Select' }, ...arr.map((v) => ({ value: v, label: v }))];
const socialCategoryOptions = createOptions(['General', 'OBC', 'SC', 'ST', 'Other'], 'Select Social Category');
const admissionTypeOptions = createOptions(['Regular', 'RTE', 'Management', 'Transfer'], 'Select Admission Type');
const yesNoOptions = [{ value: '', label: 'Select' }, { value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }];
const disabilityTypeOptions = createOptions(['Visual Impairment', 'Hearing Impairment', 'Locomotor Disability', 'Intellectual Disability', 'Autism', 'Cerebral Palsy', 'Multiple Disabilities', 'Other'], 'Select Type');
const transferReasonOptions = createOptions(['Parent Job Transfer', 'Family Relocation', 'Better Opportunities', 'Stream Change', 'Distance', 'Financial', 'Health', 'Other'], 'Select Reason');
const withdrawalReasonOptions = createOptions(['Family Relocation', 'Financial Constraints', 'Health Issues', 'Personal Reasons', 'Disciplinary', 'Not Satisfied', 'Shifting Abroad', 'Discontinuing', 'Other'], 'Select Reason');

const initialTransferForm: TransferForm = {
  lastDateOfAttendance: '', reasonForTransfer: '', otherReason: '', destinationBranchName: '', destinationBranchAddress: '', destinationCity: '', destinationState: '',
  socialCategory: '', admissionType: '', ewsStatus: 'No', minorityStatus: 'No', disabilityStatus: 'No', disabilityType: '',
  feeClearance: false, feeDues: '0', libraryClearance: false, libraryDues: '0', labClearance: false, labDues: '0', sportsClearance: false, sportsDues: '0', hostelClearance: false, hostelDues: '0',
  tcNumber: '', tcIssueDate: '', conductCertificate: 'Good', characterCertificate: 'Good', parentConsent: false, principalApproval: false, remarks: ''
};

const initialWithdrawalForm: WithdrawalForm = {
  withdrawalDate: '', lastDateOfAttendance: '', lastClassAttended: '', reasonForWithdrawal: '', otherReason: '',
  socialCategory: '', admissionType: '', ewsStatus: 'No', minorityStatus: 'No', disabilityStatus: 'No', disabilityType: '',
  feeClearance: false, feeDuesAmount: '0', feeRefundAmount: '0', libraryClearance: false, libraryBooksReturned: false,
  labClearance: false, labEquipmentReturned: false, sportsClearance: false, sportsEquipmentReturned: false,
  hostelClearance: false, hostelDuesCleared: false, idCardReturned: false, uniformReturned: false,
  documentType: 'LC', documentNumber: '', issueDate: '', cautionMoneyRefund: false, cautionMoneyAmount: '0', otherRefunds: '', refundMode: '', refundAccountNo: '', refundIFSC: '',
  parentSignature: false, studentSignature: false, principalApproval: false, accountsApproval: false, remarks: '', feedbackRating: '', feedbackComments: ''
};

export function StudentTransferWithdrawal() {
  const [formType, setFormType] = useState<FormType>('incoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [transferForm, setTransferForm] = useState<TransferForm>(initialTransferForm);
  const [withdrawalForm, setWithdrawalForm] = useState<WithdrawalForm>(initialWithdrawalForm);
  const [selectedTransfer, setSelectedTransfer] = useState<IncomingTransferRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterSocialCategory, setFilterSocialCategory] = useState('');
  const [filterAdmissionType, setFilterAdmissionType] = useState('');
  const [filterEWS, setFilterEWS] = useState('');
  const [filterMinority, setFilterMinority] = useState('');
  const [filterDisability, setFilterDisability] = useState('');

  const handleResetForm = () => {
    setSelectedStudent(null);setSearchQuery('');setShowSearchResults(false);
    setFilterSocialCategory('');setFilterAdmissionType('');setFilterEWS('');setFilterMinority('');setFilterDisability('');
    setTransferForm(initialTransferForm);setWithdrawalForm(initialWithdrawalForm);
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);setShowSearchResults(false);setSearchQuery('');
    const categoryData = { socialCategory: student.socialCategory, admissionType: student.admissionType, ewsStatus: student.ewsStatus, minorityStatus: student.minorityStatus, disabilityStatus: student.disabilityStatus, disabilityType: student.disabilityType };
    if (formType === 'transfer') setTransferForm({ ...transferForm, ...categoryData });
    if (formType === 'withdrawal') setWithdrawalForm({ ...withdrawalForm, ...categoryData, lastClassAttended: `${student.class}-${student.section}` });
  };

  const handleProceedToAdmission = (transfer: IncomingTransferRequest) => {
    alert(`Redirecting to Admission Form for ${transfer.student.firstName} ${transfer.student.lastName}...\n\nTransfer ID: ${transfer.id}\nFrom: ${transfer.fromBranchName}`);
  };

  const filteredStudents = studentsData.filter((s) => {
    const matchesSearch = s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || s.lastName.toLowerCase().includes(searchQuery.toLowerCase()) || s.grNo.toLowerCase().includes(searchQuery.toLowerCase()) || s.suId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && (!filterSocialCategory || s.socialCategory === filterSocialCategory) && (!filterAdmissionType || s.admissionType === filterAdmissionType) && (!filterEWS || s.ewsStatus === filterEWS) && (!filterMinority || s.minorityStatus === filterMinority) && (!filterDisability || s.disabilityStatus === filterDisability);
  });

  const filteredTransfers = incomingTransferRequests.filter((t) => (!filterStatus || t.status === filterStatus) && (!filterBranch || t.fromBranch === filterBranch));

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'warning' | 'success' | 'danger' | 'info'> = { pending: 'warning', approved: 'success', rejected: 'danger', admitted: 'info' };
    return <Badge variant={variants[status] || 'secondary'}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  const SelectField = ({ label, value, onChange, options, required }: {label: string;value: string;onChange: (v: string) => void;options: {value: string;label: string;}[];required?: boolean;}) =>
  <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}{required && <span className="text-red-500">*</span>}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
        {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>;


  const CategoryReservationSection = ({ data, setData }: {data: any;setData: (d: any) => void;}) =>
  <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><ShieldIcon className="w-5 h-5" />Category & Reservation Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SelectField label="Social Category" value={data.socialCategory} onChange={(v) => setData({ ...data, socialCategory: v })} options={socialCategoryOptions} required />
        <SelectField label="Admission Type" value={data.admissionType} onChange={(v) => setData({ ...data, admissionType: v })} options={admissionTypeOptions} required />
        <SelectField label="EWS Status" value={data.ewsStatus} onChange={(v) => setData({ ...data, ewsStatus: v })} options={yesNoOptions} required />
        <SelectField label="Minority Status" value={data.minorityStatus} onChange={(v) => setData({ ...data, minorityStatus: v })} options={yesNoOptions} required />
        <SelectField label="Disability Status" value={data.disabilityStatus} onChange={(v) => setData({ ...data, disabilityStatus: v, disabilityType: v === 'No' ? '' : data.disabilityType })} options={yesNoOptions} required />
        {data.disabilityStatus === 'Yes' && <SelectField label="Disability Type" value={data.disabilityType} onChange={(v) => setData({ ...data, disabilityType: v })} options={disabilityTypeOptions} required />}
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {data.socialCategory && data.socialCategory !== 'General' && <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200"><UsersIcon className="w-5 h-5 text-blue-600" /><div><p className="text-xs text-blue-600 font-medium">Social Category</p><p className="text-sm font-semibold text-blue-800">{data.socialCategory}</p></div></div>}
        {data.ewsStatus === 'Yes' && <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200"><DollarSignIcon className="w-5 h-5 text-orange-600" /><div><p className="text-xs text-orange-600 font-medium">EWS</p><p className="text-sm font-semibold text-orange-800">Eligible</p></div></div>}
        {data.minorityStatus === 'Yes' && <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg border border-purple-200"><ShieldIcon className="w-5 h-5 text-purple-600" /><div><p className="text-xs text-purple-600 font-medium">Minority</p><p className="text-sm font-semibold text-purple-800">Yes</p></div></div>}
        {data.disabilityStatus === 'Yes' && <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200"><HeartIcon className="w-5 h-5 text-yellow-600" /><div><p className="text-xs text-yellow-600 font-medium">PWD</p><p className="text-sm font-semibold text-yellow-800">{data.disabilityType || 'Yes'}</p></div></div>}
      </div>
    </Card>;


  const renderIncomingTransferList = () =>
  <div className="space-y-6">
      <Card className="p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]"><label className="block text-sm font-medium text-gray-700 mb-1">Search</label><Input placeholder="Search by name or ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} leftIcon={<SearchIcon className="h-4 w-4 text-gray-400" />} /></div>
          <div className="min-w-[150px]"><label className="block text-sm font-medium text-gray-700 mb-1">Status</label><select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"><option value="">All Status</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="admitted">Admitted</option><option value="rejected">Rejected</option></select></div>
          <div className="min-w-[150px]"><label className="block text-sm font-medium text-gray-700 mb-1">From Branch</label><select value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"><option value="">All Branches</option>{branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></div>
          <Button variant="outline" onClick={() => {setFilterStatus('');setFilterBranch('');setSearchQuery('');}}>Clear</Button>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[{ label: 'Total Requests', count: incomingTransferRequests.length, color: 'blue' }, { label: 'Pending', count: incomingTransferRequests.filter((t) => t.status === 'pending').length, color: 'amber' }, { label: 'Approved', count: incomingTransferRequests.filter((t) => t.status === 'approved').length, color: 'green' }, { label: 'Admitted', count: incomingTransferRequests.filter((t) => t.status === 'admitted').length, color: 'indigo' }].map((stat) =>
      <Card key={stat.label} className="p-4 text-center"><p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.count}</p><p className="text-sm text-gray-500">{stat.label}</p></Card>
      )}
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b bg-gray-50"><h3 className="font-semibold text-gray-900">Incoming Transfer Requests</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50">
              <tr>{['Request ID', 'Student', 'From Branch', 'Requested Class', 'Category', 'Request Date', 'Status', 'Actions'].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransfers.filter((t) => !searchQuery || t.student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || t.student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.toLowerCase().includes(searchQuery.toLowerCase())).map((transfer) =>
            <tr key={transfer.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3"><p className="font-mono text-sm font-medium text-gray-900">{transfer.id}</p></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {transfer.student.photo ? <img src={transfer.student.photo} alt="" className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center"><UserIcon className="w-5 h-5 text-gray-400" /></div>}
                      <div><p className="font-medium text-gray-900">{`${transfer.student.firstName} ${transfer.student.lastName}`}</p><p className="text-xs text-gray-500">{transfer.parent.fatherName}</p></div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><span className={`w-3 h-3 rounded-full ${branchColors[transfer.fromBranch]}`} /><div><p className="text-sm font-medium text-gray-900">{transfer.fromBranchName}</p><p className="text-xs text-gray-500">→ {transfer.toBranchName}</p></div></div></td>
                  <td className="px-4 py-3"><p className="text-sm">{transfer.requestedClass}-{transfer.requestedSection}</p><p className="text-xs text-gray-500">{transfer.requestedDepartment}</p></td>
                  <td className="px-4 py-3"><div className="flex flex-wrap gap-1"><Badge variant="secondary" className="text-xs">{transfer.student.socialCategory}</Badge>{transfer.student.ewsStatus === 'Yes' && <Badge variant="warning" className="text-xs">EWS</Badge>}{transfer.student.minorityStatus === 'Yes' && <Badge variant="info" className="text-xs">Minority</Badge>}{transfer.student.disabilityStatus === 'Yes' && <Badge variant="danger" className="text-xs">PWD</Badge>}</div></td>
                  <td className="px-4 py-3"><p className="text-sm text-gray-700">{new Date(transfer.requestDate).toLocaleDateString()}</p></td>
                  <td className="px-4 py-3">{getStatusBadge(transfer.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => {setSelectedTransfer(transfer);setShowDetailsModal(true);}}><EyeIcon className="w-4 h-4 mr-1" /> View</Button>
                      {(transfer.status === 'pending' || transfer.status === 'approved') && <Button variant="primary" size="sm" onClick={() => handleProceedToAdmission(transfer)}><ExternalLinkIcon className="w-4 h-4 mr-1" /> Admit</Button>}
                    </div>
                  </td>
                </tr>
            )}
            </tbody>
          </table>
        </div>
        {filteredTransfers.length === 0 && <div className="text-center py-12"><UserIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" /><p className="text-gray-500">No transfer requests found</p></div>}
      </Card>
    </div>;


  const renderDetailsModal = () => {
    if (!selectedTransfer) return null;
    const t = selectedTransfer;
    return (
      <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} title="Transfer Request Details" size="xl">
        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              {t.student.photo ? <img src={t.student.photo} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-white shadow" /> : <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center"><UserIcon className="w-8 h-8 text-gray-400" /></div>}
              <div><h3 className="text-lg font-semibold text-gray-900">{`${t.student.firstName} ${t.student.middleName} ${t.student.lastName}`}</h3><p className="text-sm text-gray-600">Request ID: {t.id}</p><div className="flex gap-2 mt-1">{getStatusBadge(t.status)}</div></div>
            </div>
            <div className="text-right"><div className="flex items-center gap-2 text-sm text-gray-600 mb-1"><span className={`w-3 h-3 rounded-full ${branchColors[t.fromBranch]}`} />{t.fromBranchName} → {t.toBranchName}</div><p className="text-sm text-gray-500">Requested: {new Date(t.requestDate).toLocaleDateString()}</p></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4"><h4 className="font-semibold text-gray-900 flex items-center gap-2"><UserIcon className="w-4 h-4" /> Personal Details</h4><div className="grid grid-cols-2 gap-3 text-sm"><div><span className="text-gray-500">DOB:</span> <span className="font-medium">{t.student.dob}</span></div><div><span className="text-gray-500">Gender:</span> <span className="font-medium">{t.student.gender}</span></div><div><span className="text-gray-500">Blood Group:</span> <span className="font-medium">{t.student.bloodGroup}</span></div><div><span className="text-gray-500">Aadhar:</span> <span className="font-medium">{t.student.aadharNo}</span></div></div></div>
            <div className="space-y-4"><h4 className="font-semibold text-gray-900 flex items-center gap-2"><ShieldIcon className="w-4 h-4" /> Category Details</h4><div className="flex flex-wrap gap-2"><Badge variant="secondary">{t.student.socialCategory}</Badge><Badge variant="info">{t.student.admissionType}</Badge>{t.student.ewsStatus === 'Yes' && <Badge variant="warning">EWS</Badge>}{t.student.minorityStatus === 'Yes' && <Badge variant="info">Minority</Badge>}{t.student.disabilityStatus === 'Yes' && <Badge variant="danger">PWD: {t.student.disabilityType}</Badge>}</div></div>
          </div>
          <div className="space-y-4"><h4 className="font-semibold text-gray-900 flex items-center gap-2"><SchoolIcon className="w-4 h-4" /> Previous School Details</h4><div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg text-sm"><div><span className="text-gray-500">School:</span> <span className="font-medium block">{t.previousSchool.name}</span></div><div><span className="text-gray-500">Board:</span> <span className="font-medium">{t.previousSchool.board}</span></div><div><span className="text-gray-500">Class:</span> <span className="font-medium">{t.previousSchool.class}</span></div><div><span className="text-gray-500">TC Number:</span> <span className="font-medium">{t.previousSchool.tcNumber}</span></div><div><span className="text-gray-500">TC Date:</span> <span className="font-medium">{t.previousSchool.tcDate}</span></div><div><span className="text-gray-500">Conduct:</span> <span className="font-medium">{t.previousSchool.conduct}</span></div><div className="md:col-span-3"><span className="text-gray-500">Reason:</span> <span className="font-medium">{t.previousSchool.reason}</span></div></div></div>
          <div className="space-y-4"><h4 className="font-semibold text-gray-900 flex items-center gap-2"><BookOpenIcon className="w-4 h-4" /> Requested Admission</h4><div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg text-sm"><div><span className="text-gray-500">Class:</span> <span className="font-medium text-lg">{t.requestedClass}-{t.requestedSection}</span></div><div><span className="text-gray-500">Department:</span> <span className="font-medium">{t.requestedDepartment}</span></div><div><span className="text-gray-500">Branch:</span> <span className="font-medium">{t.toBranchName}</span></div></div></div>
          <div className="space-y-4"><h4 className="font-semibold text-gray-900 flex items-center gap-2"><PhoneIcon className="w-4 h-4" /> Parent Details</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"><div className="p-4 bg-gray-50 rounded-lg"><p className="font-medium text-gray-900 mb-2">Father</p><p>{t.parent.fatherName} ({t.parent.fatherOccupation})</p><p className="text-gray-500">{t.parent.fatherMobile} | {t.parent.fatherEmail}</p></div><div className="p-4 bg-gray-50 rounded-lg"><p className="font-medium text-gray-900 mb-2">Mother</p><p>{t.parent.motherName} ({t.parent.motherOccupation})</p><p className="text-gray-500">{t.parent.motherMobile} | {t.parent.motherEmail}</p></div></div></div>
          <div className="space-y-4"><h4 className="font-semibold text-gray-900 flex items-center gap-2"><MapPinIcon className="w-4 h-4" /> Address</h4><div className="p-4 bg-gray-50 rounded-lg text-sm"><p>{t.address.line1}, {t.address.line2}</p><p>{t.address.city}, {t.address.state} - {t.address.pinCode}</p></div></div>
          <div className="space-y-4"><h4 className="font-semibold text-gray-900 flex items-center gap-2"><FileTextIcon className="w-4 h-4" /> Documents Submitted</h4><div className="flex flex-wrap gap-2">{[{ key: 'tc', label: 'Transfer Certificate' }, { key: 'birthCert', label: 'Birth Certificate' }, { key: 'marksheet', label: 'Marksheet' }, { key: 'aadhar', label: 'Aadhar Card' }, { key: 'photo', label: 'Photos' }, { key: 'casteCert', label: 'Caste Certificate' }, { key: 'migration', label: 'Migration Certificate' }, { key: 'medical', label: 'Medical Certificate' }, { key: 'ewsCert', label: 'EWS Certificate' }, { key: 'minorityCert', label: 'Minority Certificate' }, { key: 'disabilityCert', label: 'Disability Certificate' }].map((doc) => <Badge key={doc.key} variant={t.documents[doc.key as keyof typeof t.documents] ? 'success' : 'secondary'} className="flex items-center gap-1">{t.documents[doc.key as keyof typeof t.documents] ? <CheckIcon className="w-3 h-3" /> : <XIcon className="w-3 h-3" />}{doc.label}</Badge>)}</div></div>
          {t.remarks && <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200"><p className="text-sm font-medium text-yellow-800">Remarks: {t.remarks}</p></div>}
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t mt-4">
          <Button variant="outline" onClick={() => setShowDetailsModal(false)}>Close</Button>
          <Button variant="outline" leftIcon={<PrinterIcon className="w-4 h-4" />}>Print</Button>
          {(t.status === 'pending' || t.status === 'approved') && <Button variant="primary" onClick={() => {setShowDetailsModal(false);handleProceedToAdmission(t);}} leftIcon={<ExternalLinkIcon className="w-4 h-4" />}>Proceed to Admission</Button>}
        </div>
      </Modal>);

  };

  const renderStudentSearch = () =>
  <Card className="p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><SearchIcon className="w-5 h-5" />Search Student</h3>
      <div className="flex gap-3 mb-4"><Input placeholder="Search by GR No, SU ID, or Student Name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} leftIcon={<SearchIcon className="h-4 w-4 text-gray-400" />} className="flex-1" /><Button variant="primary" onClick={() => setShowSearchResults(true)}>Search</Button></div>
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2"><ShieldIcon className="w-4 h-4" />Filter Options</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {[{ value: filterSocialCategory, set: setFilterSocialCategory, label: 'Social Category', opts: ['General', 'OBC', 'SC', 'ST'] }, { value: filterAdmissionType, set: setFilterAdmissionType, label: 'Admission Type', opts: ['Regular', 'RTE', 'Management', 'Transfer'] }, { value: filterEWS, set: setFilterEWS, label: 'EWS', opts: ['Yes', 'No'] }, { value: filterMinority, set: setFilterMinority, label: 'Minority', opts: ['Yes', 'No'] }, { value: filterDisability, set: setFilterDisability, label: 'Disability', opts: ['Yes', 'No'] }].map((f) =>
        <div key={f.label}><label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label><select value={f.value} onChange={(e) => f.set(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"><option value="">All</option>{f.opts.map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
        )}
        </div>
        <div className="mt-3 flex justify-end"><Button variant="outline" size="sm" onClick={() => {setFilterSocialCategory('');setFilterAdmissionType('');setFilterEWS('');setFilterMinority('');setFilterDisability('');}}>Clear Filters</Button></div>
      </div>
      {showSearchResults &&
    <div className="mt-4">
          {filteredStudents.length > 0 ?
      <div className="border rounded-lg overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-gray-50"><tr>{['Student', 'GR No / SU ID', 'Class', 'Category', 'Admission', 'Status', 'Fee Status', 'Action'].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}</tr></thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents.map((s) =>
            <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3"><div className="flex items-center gap-3">{s.photo ? <img src={s.photo} alt="" className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center"><UserIcon className="w-5 h-5 text-gray-400" /></div>}<div><p className="font-medium text-gray-900">{`${s.firstName} ${s.lastName}`}</p><p className="text-xs text-gray-500">{s.fatherName}</p></div></div></td>
                      <td className="px-4 py-3"><p className="text-sm font-mono text-gray-700">{s.grNo}</p><p className="text-xs text-gray-500">{s.suId}</p></td>
                      <td className="px-4 py-3"><p className="text-sm text-gray-700">{`${s.class}-${s.section}`}</p><p className="text-xs text-gray-500">{s.department}</p></td>
                      <td className="px-4 py-3"><Badge variant={s.socialCategory === 'General' ? 'secondary' : 'info'}>{s.socialCategory}</Badge></td>
                      <td className="px-4 py-3"><p className="text-sm text-gray-700">{s.admissionType}</p><div className="flex gap-1 mt-1">{s.ewsStatus === 'Yes' && <Badge variant="warning" className="text-xs">EWS</Badge>}{s.minorityStatus === 'Yes' && <Badge variant="info" className="text-xs">Minority</Badge>}</div></td>
                      <td className="px-4 py-3">{s.disabilityStatus === 'Yes' ? <div><Badge variant="warning">PWD</Badge><p className="text-xs text-gray-500 mt-1">{s.disabilityType}</p></div> : <span className="text-xs text-gray-500">-</span>}</td>
                      <td className="px-4 py-3"><Badge variant={s.feeStatus === 'Paid' ? 'success' : s.feeStatus === 'Pending' ? 'danger' : 'warning'}>{s.feeStatus}</Badge></td>
                      <td className="px-4 py-3"><Button variant="primary" size="sm" onClick={() => handleSelectStudent(s)}>Select</Button></td>
                    </tr>
            )}
                </tbody>
              </table>
            </div> :
      <div className="text-center py-8 text-gray-500"><UserIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" /><p>No students found</p></div>}
        </div>
    }
    </Card>;


  const renderSelectedStudentCard = () => selectedStudent &&
  <Card className="p-6 mb-6 bg-blue-50 border-blue-200">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {selectedStudent.photo ? <img src={selectedStudent.photo} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-white shadow" /> : <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white shadow"><UserIcon className="w-8 h-8 text-gray-400" /></div>}
          <div><h3 className="text-lg font-semibold text-gray-900">{`${selectedStudent.firstName} ${selectedStudent.middleName} ${selectedStudent.lastName}`}</h3><p className="text-sm text-gray-600">{selectedStudent.grNo} · {selectedStudent.suId}</p><p className="text-sm text-gray-600">Class {selectedStudent.class}-{selectedStudent.section} · {selectedStudent.department}</p></div>
        </div>
        <div className="flex flex-col gap-2 items-start lg:items-end w-full lg:w-auto">
          <div className="flex flex-wrap gap-2"><Badge variant={selectedStudent.feeStatus === 'Paid' ? 'success' : 'danger'}>Fee: {selectedStudent.feeStatus}</Badge><Badge variant={selectedStudent.libraryDues ? 'danger' : 'success'}>Library: {selectedStudent.libraryDues ? 'Dues' : 'Clear'}</Badge></div>
          <div className="flex flex-wrap gap-2"><Badge variant="secondary">{selectedStudent.socialCategory}</Badge><Badge variant="info">{selectedStudent.admissionType}</Badge>{selectedStudent.ewsStatus === 'Yes' && <Badge variant="warning">EWS</Badge>}{selectedStudent.minorityStatus === 'Yes' && <Badge variant="info">Minority</Badge>}{selectedStudent.disabilityStatus === 'Yes' && <Badge variant="warning">PWD</Badge>}</div>
          <Button variant="outline" size="sm" onClick={handleResetForm}>Change Student</Button>
        </div>
      </div>
    </Card>;


  const renderTransferForm = () => !selectedStudent ?
  <Card className="p-12 text-center"><div className="rounded-full bg-blue-50 w-16 h-16 flex items-center justify-center mx-auto mb-4"><SearchIcon className="w-8 h-8 text-blue-500" /></div><h3 className="text-lg font-medium text-gray-900 mb-2">Select a Student</h3><p className="text-sm text-gray-500">Please search and select a student to process transfer</p></Card> :

  <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><ArrowRightIcon className="w-5 h-5" />Transfer Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Last Date of Attendance *</label><Input type="date" value={transferForm.lastDateOfAttendance} onChange={(e) => setTransferForm({ ...transferForm, lastDateOfAttendance: e.target.value })} /></div>
          <SelectField label="Reason for Transfer" value={transferForm.reasonForTransfer} onChange={(v) => setTransferForm({ ...transferForm, reasonForTransfer: v })} options={transferReasonOptions} required />
          {transferForm.reasonForTransfer === 'Other' && <div><label className="block text-sm font-medium text-gray-700 mb-1">Specify Reason</label><Input value={transferForm.otherReason} onChange={(e) => setTransferForm({ ...transferForm, otherReason: e.target.value })} placeholder="Please specify" /></div>}
        </div>
      </Card>

      <CategoryReservationSection data={transferForm} setData={setTransferForm} />

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Building2Icon className="w-5 h-5" />Destination Branch Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label><Input value={transferForm.destinationBranchName} onChange={(e) => setTransferForm({ ...transferForm, destinationBranchName: e.target.value })} placeholder="Enter destination branch name" /></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Branch Address</label><Input value={transferForm.destinationBranchAddress} onChange={(e) => setTransferForm({ ...transferForm, destinationBranchAddress: e.target.value })} placeholder="Enter branch address" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">City</label><Input value={transferForm.destinationCity} onChange={(e) => setTransferForm({ ...transferForm, destinationCity: e.target.value })} placeholder="Enter city" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">State</label><Input value={transferForm.destinationState} onChange={(e) => setTransferForm({ ...transferForm, destinationState: e.target.value })} placeholder="Enter state" /></div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><ClipboardCheckIcon className="w-5 h-5" />Clearance Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[{ key: 'fee', label: 'Fee', dues: 'feeDues', status: selectedStudent.feeStatus }, { key: 'library', label: 'Library', dues: 'libraryDues', status: selectedStudent.libraryDues ? 'Dues' : 'Clear' }, { key: 'lab', label: 'Lab', dues: 'labDues', status: selectedStudent.labDues ? 'Dues' : 'Clear' }, { key: 'sports', label: 'Sports', dues: 'sportsDues', status: 'Clear' }, { key: 'hostel', label: 'Hostel', dues: 'hostelDues', status: 'N/A' }].map((item) =>
        <div key={item.key} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3"><span className="font-medium text-gray-900">{item.label} Clearance</span><Badge variant={item.status === 'Paid' || item.status === 'Clear' ? 'success' : item.status === 'N/A' ? 'secondary' : 'danger'}>{item.status}</Badge></div>
              <label className="flex items-center gap-2 mb-2"><input type="checkbox" checked={transferForm[`${item.key}Clearance` as keyof TransferForm] as boolean} onChange={(e) => setTransferForm({ ...transferForm, [`${item.key}Clearance`]: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-green-600" /><span className="text-sm text-gray-600">Mark as Cleared</span></label>
              <Input placeholder="Dues amount" value={transferForm[item.dues as keyof TransferForm] as string} onChange={(e) => setTransferForm({ ...transferForm, [item.dues]: e.target.value })} className="text-sm" />
            </div>
        )}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><FileIcon className="w-5 h-5" />TC Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">TC Number *</label><Input value={transferForm.tcNumber} onChange={(e) => setTransferForm({ ...transferForm, tcNumber: e.target.value })} placeholder="Enter TC number" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Issue Date *</label><Input type="date" value={transferForm.tcIssueDate} onChange={(e) => setTransferForm({ ...transferForm, tcIssueDate: e.target.value })} /></div>
          <SelectField label="Conduct Certificate" value={transferForm.conductCertificate} onChange={(v) => setTransferForm({ ...transferForm, conductCertificate: v })} options={[{ value: 'Good', label: 'Good' }, { value: 'Satisfactory', label: 'Satisfactory' }, { value: 'Needs Improvement', label: 'Needs Improvement' }]} />
          <SelectField label="Character Certificate" value={transferForm.characterCertificate} onChange={(v) => setTransferForm({ ...transferForm, characterCertificate: v })} options={[{ value: 'Good', label: 'Good' }, { value: 'Satisfactory', label: 'Satisfactory' }, { value: 'Needs Improvement', label: 'Needs Improvement' }]} />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><CheckCircleIcon className="w-5 h-5" />Approvals</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[{ key: 'parentConsent', label: 'Parent/Guardian Consent', desc: 'Consent obtained' }, { key: 'principalApproval', label: 'Principal Approval', desc: 'Approved by Principal' }].map((item) =>
        <label key={item.key} className="flex items-center gap-3 p-4 rounded-lg border cursor-pointer hover:bg-gray-50"><input type="checkbox" checked={transferForm[item.key as keyof TransferForm] as boolean} onChange={(e) => setTransferForm({ ...transferForm, [item.key]: e.target.checked })} className="h-5 w-5 rounded border-gray-300 text-green-600" /><div><span className="font-medium text-gray-900">{item.label}</span><p className="text-xs text-gray-500">{item.desc}</p></div></label>
        )}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Remarks</h3>
        <textarea value={transferForm.remarks} onChange={(e) => setTransferForm({ ...transferForm, remarks: e.target.value })} rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" placeholder="Enter any additional remarks..." />
      </Card>
    </div>;


  const renderWithdrawalForm = () => !selectedStudent ?
  <Card className="p-12 text-center"><div className="rounded-full bg-red-50 w-16 h-16 flex items-center justify-center mx-auto mb-4"><SearchIcon className="w-8 h-8 text-red-500" /></div><h3 className="text-lg font-medium text-gray-900 mb-2">Select a Student</h3><p className="text-sm text-gray-500">Please search and select a student to process withdrawal</p></Card> :

  <div className="space-y-6">
      <Card className="p-4 bg-red-50 border-red-200"><div className="flex items-start gap-3"><AlertTriangleIcon className="w-5 h-5 text-red-600 mt-0.5" /><div><h4 className="font-semibold text-red-800">Important Notice</h4><p className="text-sm text-red-700 mt-1">Student withdrawal is permanent. Ensure all dues are cleared and items returned.</p></div></div></Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><UserMinusIcon className="w-5 h-5" />Withdrawal Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Withdrawal Date *</label><Input type="date" value={withdrawalForm.withdrawalDate} onChange={(e) => setWithdrawalForm({ ...withdrawalForm, withdrawalDate: e.target.value })} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Last Date of Attendance *</label><Input type="date" value={withdrawalForm.lastDateOfAttendance} onChange={(e) => setWithdrawalForm({ ...withdrawalForm, lastDateOfAttendance: e.target.value })} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Last Class Attended</label><Input value={withdrawalForm.lastClassAttended || `${selectedStudent.class}-${selectedStudent.section}`} disabled /></div>
          <SelectField label="Reason for Withdrawal" value={withdrawalForm.reasonForWithdrawal} onChange={(v) => setWithdrawalForm({ ...withdrawalForm, reasonForWithdrawal: v })} options={withdrawalReasonOptions} required />
          {withdrawalForm.reasonForWithdrawal === 'Other' && <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Specify Reason</label><Input value={withdrawalForm.otherReason} onChange={(e) => setWithdrawalForm({ ...withdrawalForm, otherReason: e.target.value })} placeholder="Please specify" /></div>}
        </div>
      </Card>

      <CategoryReservationSection data={withdrawalForm} setData={setWithdrawalForm} />

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><ClipboardCheckIcon className="w-5 h-5" />Clearances & Returns</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[{ key: 'fee', label: 'Fee Clearance', status: selectedStudent.feeStatus, extra: [{ k: 'feeDuesAmount', l: 'Dues' }, { k: 'feeRefundAmount', l: 'Refund' }] }, { key: 'library', label: 'Library Clearance', status: selectedStudent.libraryDues ? 'Dues' : 'Clear', checks: ['libraryBooksReturned'] }, { key: 'lab', label: 'Lab Clearance', status: selectedStudent.labDues ? 'Dues' : 'Clear', checks: ['labEquipmentReturned'] }].map((item) =>
        <div key={item.key} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between"><span className="font-medium text-gray-900">{item.label}</span><Badge variant={item.status === 'Paid' || item.status === 'Clear' ? 'success' : 'danger'}>{item.status}</Badge></div>
              <label className="flex items-center gap-2"><input type="checkbox" checked={withdrawalForm[`${item.key}Clearance` as keyof WithdrawalForm] as boolean} onChange={(e) => setWithdrawalForm({ ...withdrawalForm, [`${item.key}Clearance`]: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-green-600" /><span className="text-sm text-gray-600">Cleared</span></label>
              {item.extra && <div className="grid grid-cols-2 gap-2">{item.extra.map((e) => <div key={e.k}><label className="text-xs text-gray-500">{e.l}</label><Input value={withdrawalForm[e.k as keyof WithdrawalForm] as string} onChange={(ev) => setWithdrawalForm({ ...withdrawalForm, [e.k]: ev.target.value })} placeholder="₹0" /></div>)}</div>}
              {item.checks && item.checks.map((c) => <label key={c} className="flex items-center gap-2"><input type="checkbox" checked={withdrawalForm[c as keyof WithdrawalForm] as boolean} onChange={(e) => setWithdrawalForm({ ...withdrawalForm, [c]: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-green-600" /><span className="text-sm text-gray-600">{c.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}</span></label>)}
            </div>
        )}
          <div className="p-4 border rounded-lg space-y-3">
            <span className="font-medium text-gray-900">Other Returns</span>
            {['idCardReturned', 'uniformReturned', 'sportsEquipmentReturned'].map((k) => <label key={k} className="flex items-center gap-2"><input type="checkbox" checked={withdrawalForm[k as keyof WithdrawalForm] as boolean} onChange={(e) => setWithdrawalForm({ ...withdrawalForm, [k]: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-green-600" /><span className="text-sm text-gray-600">{k.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}</span></label>)}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><FileIcon className="w-5 h-5" />LC/TC Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SelectField label="Document Type" value={withdrawalForm.documentType} onChange={(v) => setWithdrawalForm({ ...withdrawalForm, documentType: v })} options={[{ value: 'LC', label: 'Leaving Certificate' }, { value: 'TC', label: 'Transfer Certificate' }, { value: 'Both', label: 'Both' }]} required />
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Document Number *</label><Input value={withdrawalForm.documentNumber} onChange={(e) => setWithdrawalForm({ ...withdrawalForm, documentNumber: e.target.value })} placeholder="Enter number" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Issue Date *</label><Input type="date" value={withdrawalForm.issueDate} onChange={(e) => setWithdrawalForm({ ...withdrawalForm, issueDate: e.target.value })} /></div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><CheckCircleIcon className="w-5 h-5" />Approvals</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[{ k: 'parentSignature', l: 'Parent Signature' }, { k: 'studentSignature', l: 'Student Signature' }, { k: 'principalApproval', l: 'Principal Approval' }, { k: 'accountsApproval', l: 'Accounts Approval' }].map((item) =>
        <label key={item.k} className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${withdrawalForm[item.k as keyof WithdrawalForm] ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50'}`}><input type="checkbox" checked={withdrawalForm[item.k as keyof WithdrawalForm] as boolean} onChange={(e) => setWithdrawalForm({ ...withdrawalForm, [item.k]: e.target.checked })} className="h-5 w-5 rounded border-gray-300 text-green-600" /><span className="font-medium text-gray-900">{item.l}</span></label>
        )}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Office Remarks</h3>
        <textarea value={withdrawalForm.remarks} onChange={(e) => setWithdrawalForm({ ...withdrawalForm, remarks: e.target.value })} rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" placeholder="Enter any additional remarks..." />
      </Card>
    </div>;


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div><h1 className="text-2xl font-bold text-gray-900">Student Transfer & Withdrawal</h1><p className="text-sm text-gray-500 mt-1">Process incoming transfers, transfers, and withdrawals</p></div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        {[
        { type: 'incoming' as FormType, icon: UserPlusIcon, label: 'Incoming Transfer', color: 'green' },
        { type: 'transfer' as FormType, icon: ArrowRightIcon, label: 'Transfer', color: 'blue' },
        { type: 'withdrawal' as FormType, icon: UserMinusIcon, label: 'Student Withdrawal', color: 'red' }].
        map((item) =>
        <button key={item.type} onClick={() => {setFormType(item.type);handleResetForm();}}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${formType === item.type ? `bg-${item.color}-600 text-white shadow-lg` : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            <item.icon className="w-5 h-5" />{item.label}
          </button>
        )}
      </div>

      {formType === 'incoming' && renderIncomingTransferList()}
      {formType === 'transfer' && <>{!selectedStudent && renderStudentSearch()}{renderSelectedStudentCard()}{renderTransferForm()}</>}
      {formType === 'withdrawal' && <>{!selectedStudent && renderStudentSearch()}{renderSelectedStudentCard()}{renderWithdrawalForm()}</>}

      {(formType === 'transfer' || formType === 'withdrawal') && selectedStudent &&
      <Card className="p-4">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <Button variant="outline" onClick={handleResetForm} leftIcon={<RotateCcwIcon className="w-4 h-4" />}>Reset Form</Button>
            <div className="flex gap-3">
              <Button variant="outline" leftIcon={<PrinterIcon className="w-4 h-4" />}>Print Preview</Button>
              <Button variant="primary" onClick={() => alert(`${formType === 'transfer' ? 'Transfer' : 'Withdrawal'} processed successfully!`)} leftIcon={<SaveIcon className="w-4 h-4" />}>
                {formType === 'transfer' ? 'Process Transfer & Generate TC' : 'Process Withdrawal & Generate LC'}
              </Button>
            </div>
          </div>
        </Card>
      }

      {renderDetailsModal()}
    </div>);

}

export default StudentTransferWithdrawal;