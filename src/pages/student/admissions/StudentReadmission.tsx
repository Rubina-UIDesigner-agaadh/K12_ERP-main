import React, { useState, Component } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import {
  SearchIcon,
  UserPlusIcon,
  EyeIcon,
  RefreshCwIcon,
  XIcon,
  UserIcon,
  PhoneIcon,
  MailIcon,
  FileTextIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ChevronDownIcon,
  MapPinIcon,
  CalendarIcon,
  BookOpenIcon,
  IndianRupeeIcon,
  ClipboardListIcon } from
'lucide-react';
// ─── Types ───────────────────────────────────────────────────────────────────
interface ArchivedStudent {
  grNo: string;
  name: string;
  previousClass: string;
  section: string;
  leavingDate: string;
  reason: 'Transfer' | 'Withdrawal' | 'Rustication' | 'Other';
  status: 'Eligible' | 'Pending Review' | 'Not Eligible';
  dob: string;
  gender: string;
  category: string;
  parentName: string;
  contact: string;
  email: string;
  address: string;
  academicYear: string;
}
interface SearchForm {
  name: string;
  grNo: string;
  previousClass: string;
  academicYear: string;
  reason: string;
}
interface ReadmissionForm {
  fullName: string;
  parentName: string;
  mobile: string;
  email: string;
  address: string;
  newAcademicYear: string;
  classApplying: string;
  sectionPreference: string;
  reasonForReadmission: string;
  paymentMode: string;
  docs: Record<string, boolean>;
}
// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_STUDENTS: ArchivedStudent[] = [
{
  grNo: 'GR-2021-001',
  name: 'Aarav Gupta',
  previousClass: 'Class 7',
  section: 'A',
  leavingDate: '15 Mar 2023',
  reason: 'Transfer',
  status: 'Eligible',
  dob: '12 Apr 2011',
  gender: 'Male',
  category: 'General',
  parentName: 'Rajesh Gupta',
  contact: '9876543210',
  email: 'rajesh.gupta@email.com',
  address: '45, Sector 12, Noida, UP - 201301',
  academicYear: '2022-23'
},
{
  grNo: 'GR-2020-045',
  name: 'Priya Sharma',
  previousClass: 'Class 5',
  section: 'B',
  leavingDate: '20 Jun 2022',
  reason: 'Withdrawal',
  status: 'Eligible',
  dob: '08 Sep 2012',
  gender: 'Female',
  category: 'OBC',
  parentName: 'Sunita Sharma',
  contact: '9812345678',
  email: 'sunita.sharma@email.com',
  address: '12, Green Park, Delhi - 110016',
  academicYear: '2021-22'
},
{
  grNo: 'GR-2022-012',
  name: 'Rohan Patel',
  previousClass: 'Class 9',
  section: 'A',
  leavingDate: '10 Jan 2024',
  reason: 'Transfer',
  status: 'Pending Review',
  dob: '22 Nov 2009',
  gender: 'Male',
  category: 'General',
  parentName: 'Suresh Patel',
  contact: '9988776655',
  email: 'suresh.patel@email.com',
  address: '78, Andheri West, Mumbai - 400058',
  academicYear: '2023-24'
},
{
  grNo: 'GR-2019-088',
  name: 'Ananya Singh',
  previousClass: 'Class 3',
  section: 'C',
  leavingDate: '05 Apr 2021',
  reason: 'Withdrawal',
  status: 'Eligible',
  dob: '30 Jul 2013',
  gender: 'Female',
  category: 'SC',
  parentName: 'Mohan Singh',
  contact: '9765432109',
  email: 'mohan.singh@email.com',
  address: '23, Civil Lines, Allahabad, UP - 211001',
  academicYear: '2020-21'
},
{
  grNo: 'GR-2023-034',
  name: 'Vikram Mehta',
  previousClass: 'Class 11',
  section: 'Science',
  leavingDate: '28 Feb 2024',
  reason: 'Rustication',
  status: 'Not Eligible',
  dob: '14 Jan 2007',
  gender: 'Male',
  category: 'General',
  parentName: 'Anil Mehta',
  contact: '9654321098',
  email: 'anil.mehta@email.com',
  address: '56, Banjara Hills, Hyderabad - 500034',
  academicYear: '2023-24'
},
{
  grNo: 'GR-2021-067',
  name: 'Kavya Reddy',
  previousClass: 'Class 6',
  section: 'B',
  leavingDate: '12 Aug 2023',
  reason: 'Other',
  status: 'Eligible',
  dob: '18 Mar 2012',
  gender: 'Female',
  category: 'OBC',
  parentName: 'Ramesh Reddy',
  contact: '9543210987',
  email: 'ramesh.reddy@email.com',
  address: '34, Koramangala, Bengaluru - 560034',
  academicYear: '2022-23'
}];

const CLASS_OPTIONS = [
{
  value: '',
  label: 'All Classes'
},
{
  value: 'Nursery',
  label: 'Nursery'
},
{
  value: 'LKG',
  label: 'LKG'
},
{
  value: 'UKG',
  label: 'UKG'
},
...Array.from(
  {
    length: 12
  },
  (_, i) => ({
    value: `Class ${i + 1}`,
    label: `Class ${i + 1}`
  })
)];

const ACADEMIC_YEAR_OPTIONS = [
{
  value: '',
  label: 'All Years'
},
{
  value: '2024-25',
  label: '2024-25'
},
{
  value: '2023-24',
  label: '2023-24'
},
{
  value: '2022-23',
  label: '2022-23'
},
{
  value: '2021-22',
  label: '2021-22'
},
{
  value: '2020-21',
  label: '2020-21'
}];

const REASON_OPTIONS = [
{
  value: '',
  label: 'All Reasons'
},
{
  value: 'Transfer',
  label: 'Transfer'
},
{
  value: 'Withdrawal',
  label: 'Withdrawal'
},
{
  value: 'Rustication',
  label: 'Rustication'
},
{
  value: 'Other',
  label: 'Other'
}];

const SEAT_AVAILABILITY: Record<string, number> = {
  Nursery: 5,
  LKG: 8,
  UKG: 3,
  'Class 1': 12,
  'Class 2': 7,
  'Class 3': 0,
  'Class 4': 4,
  'Class 5': 9,
  'Class 6': 6,
  'Class 7': 2,
  'Class 8': 11,
  'Class 9': 0,
  'Class 10': 5,
  'Class 11': 8,
  'Class 12': 3
};
const INITIAL_DOCS: Record<string, boolean> = {
  'Original Transfer Certificate': true,
  'Previous School Report Card': true,
  'Birth Certificate': true,
  'Medical Fitness Certificate': false,
  'Passport Size Photos': false,
  'Address Proof': false
};
// ─── Helper Components ────────────────────────────────────────────────────────
const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  readOnly = false







}: {label: string;value: string;onChange?: (v: string) => void;placeholder?: string;type?: string;readOnly?: boolean;}) =>
<div>
    <label className="block text-xs font-medium text-gray-600 mb-1">
      {label}
    </label>
    <input
    type={type}
    value={value}
    onChange={onChange ? (e) => onChange(e.target.value) : undefined}
    placeholder={placeholder}
    readOnly={readOnly}
    className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${readOnly ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : 'bg-white'}`} />

  </div>;

const SelectField = ({
  label,
  value,
  onChange,
  options,
  readOnly = false









}: {label: string;value: string;onChange?: (v: string) => void;options: {value: string;label: string;}[];readOnly?: boolean;}) =>
<div>
    <label className="block text-xs font-medium text-gray-600 mb-1">
      {label}
    </label>
    <div className="relative">
      <select
      value={value}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      disabled={readOnly}
      className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all ${readOnly ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : 'bg-white cursor-pointer'}`}>

        {options.map((opt) =>
      <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
      )}
      </select>
      <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  </div>;

const TextareaField = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  readOnly = false







}: {label: string;value: string;onChange?: (v: string) => void;placeholder?: string;rows?: number;readOnly?: boolean;}) =>
<div>
    <label className="block text-xs font-medium text-gray-600 mb-1">
      {label}
    </label>
    <textarea
    value={value}
    onChange={onChange ? (e) => onChange(e.target.value) : undefined}
    placeholder={placeholder}
    rows={rows}
    readOnly={readOnly}
    className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all ${readOnly ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : 'bg-white'}`} />

  </div>;

const InfoRow = ({ label, value }: {label: string;value: string;}) =>
<div className="flex flex-col">
    <span className="text-xs text-gray-500 font-medium">{label}</span>
    <span className="text-sm text-gray-900 font-medium mt-0.5">{value}</span>
  </div>;

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: {status: ArchivedStudent['status'];}) {
  if (status === 'Eligible') return <Badge variant="success">Eligible</Badge>;
  if (status === 'Pending Review')
  return <Badge variant="warning">Pending Review</Badge>;
  return <Badge variant="danger">Not Eligible</Badge>;
}
// ─── Main Component ───────────────────────────────────────────────────────────
export function StudentReadmission() {
  const [searchForm, setSearchForm] = useState<SearchForm>({
    name: '',
    grNo: '',
    previousClass: '',
    academicYear: '',
    reason: ''
  });
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<ArchivedStudent[]>([]);
  // Modals
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [readmitModalOpen, setReadmitModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] =
  useState<ArchivedStudent | null>(null);
  // Readmission form
  const [readmitForm, setReadmitForm] = useState<ReadmissionForm>({
    fullName: '',
    parentName: '',
    mobile: '',
    email: '',
    address: '',
    newAcademicYear: '2024-25',
    classApplying: '',
    sectionPreference: '',
    reasonForReadmission: '',
    paymentMode: 'Cash',
    docs: {
      ...INITIAL_DOCS
    }
  });
  const updateSearch = (key: keyof SearchForm) => (val: string) =>
  setSearchForm((prev) => ({
    ...prev,
    [key]: val
  }));
  const updateReadmit = (key: keyof ReadmissionForm) => (val: string) =>
  setReadmitForm((prev) => ({
    ...prev,
    [key]: val
  }));
  const handleSearch = () => {
    const filtered = MOCK_STUDENTS.filter((s) => {
      const nameMatch =
      !searchForm.name ||
      s.name.toLowerCase().includes(searchForm.name.toLowerCase());
      const grMatch =
      !searchForm.grNo ||
      s.grNo.toLowerCase().includes(searchForm.grNo.toLowerCase());
      const classMatch =
      !searchForm.previousClass ||
      s.previousClass === searchForm.previousClass;
      const yearMatch =
      !searchForm.academicYear || s.academicYear === searchForm.academicYear;
      const reasonMatch = !searchForm.reason || s.reason === searchForm.reason;
      return nameMatch && grMatch && classMatch && yearMatch && reasonMatch;
    });
    setResults(filtered);
    setHasSearched(true);
  };
  const handleClear = () => {
    setSearchForm({
      name: '',
      grNo: '',
      previousClass: '',
      academicYear: '',
      reason: ''
    });
    setResults([]);
    setHasSearched(false);
  };
  const openViewModal = (student: ArchivedStudent) => {
    setSelectedStudent(student);
    setViewModalOpen(true);
  };
  const openReadmitModal = (student: ArchivedStudent) => {
    setSelectedStudent(student);
    setReadmitForm({
      fullName: student.name,
      parentName: student.parentName,
      mobile: student.contact,
      email: student.email,
      address: student.address,
      newAcademicYear: '2024-25',
      classApplying: '',
      sectionPreference: '',
      reasonForReadmission: '',
      paymentMode: 'Cash',
      docs: {
        ...INITIAL_DOCS
      }
    });
    setViewModalOpen(false);
    setReadmitModalOpen(true);
  };
  const toggleDoc = (docName: string) => {
    setReadmitForm((prev) => ({
      ...prev,
      docs: {
        ...prev.docs,
        [docName]: !prev.docs[docName]
      }
    }));
  };
  const seatsAvailable = SEAT_AVAILABILITY[readmitForm.classApplying] ?? null;
  const getInitials = (name: string) =>
  name.
  split(' ').
  map((n) => n[0]).
  join('').
  toUpperCase().
  slice(0, 2);
  // ─── Table Columns ──────────────────────────────────────────────────────────
  const columns = [
  {
    key: 'grNo',
    header: 'GR No',
    render: (row: ArchivedStudent) =>
    <span className="font-mono text-xs font-medium text-gray-700">
          {row.grNo}
        </span>

  },
  {
    key: 'name',
    header: 'Student Name',
    render: (row: ArchivedStudent) =>
    <span className="font-medium text-gray-900">{row.name}</span>

  },
  {
    key: 'previousClass',
    header: 'Previous Class',
    render: (row: ArchivedStudent) =>
    <span className="text-sm text-gray-700">{row.previousClass}</span>

  },
  {
    key: 'section',
    header: 'Section',
    render: (row: ArchivedStudent) =>
    <span className="text-sm text-gray-700">{row.section}</span>

  },
  {
    key: 'leavingDate',
    header: 'Leaving Date',
    render: (row: ArchivedStudent) =>
    <span className="text-sm text-gray-600">{row.leavingDate}</span>

  },
  {
    key: 'reason',
    header: 'Reason',
    render: (row: ArchivedStudent) =>
    <Badge variant="secondary">{row.reason}</Badge>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: ArchivedStudent) => <StatusBadge status={row.status} />
  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: ArchivedStudent) =>
    <div className="flex items-center gap-1">
          <Button
        variant="ghost"
        size="sm"
        onClick={() => openViewModal(row)}
        title="View Details">

            <EyeIcon className="w-4 h-4 text-blue-600" />
          </Button>
          <Button
        variant="ghost"
        size="sm"
        onClick={() => openReadmitModal(row)}
        disabled={row.status === 'Not Eligible'}
        title={
        row.status === 'Not Eligible' ?
        'Not eligible for readmission' :
        'Readmit Student'
        }>

            <UserPlusIcon
          className={`w-4 h-4 ${row.status === 'Not Eligible' ? 'text-gray-300' : 'text-green-600'}`} />

          </Button>
        </div>

  }];

  return (
    <div className="h-[calc(100vh-64px)] w-full overflow-y-auto bg-gray-50">
      <div className="p-6 space-y-5 max-w-7xl mx-auto">
        {/* ── Header ── */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Student Readmission
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Search and re-enroll previously withdrawn or transferred students
            </p>
          </div>
        </div>

        {/* ── Search Panel ── */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <SearchIcon className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-semibold text-gray-900">
              Search Archived Students
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
            <InputField
              label="Student Name"
              value={searchForm.name}
              onChange={updateSearch('name')}
              placeholder="Enter student name" />

            <InputField
              label="GR Number / Student ID"
              value={searchForm.grNo}
              onChange={updateSearch('grNo')}
              placeholder="e.g. GR-2021-001" />

            <SelectField
              label="Previous Class"
              value={searchForm.previousClass}
              onChange={updateSearch('previousClass')}
              options={CLASS_OPTIONS} />

            <SelectField
              label="Academic Year of Leaving"
              value={searchForm.academicYear}
              onChange={updateSearch('academicYear')}
              options={ACADEMIC_YEAR_OPTIONS} />

            <SelectField
              label="Reason for Leaving"
              value={searchForm.reason}
              onChange={updateSearch('reason')}
              options={REASON_OPTIONS} />

          </div>

          <div className="flex items-center gap-3">
            <Button variant="primary" onClick={handleSearch}>
              <SearchIcon className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" onClick={handleClear}>
              <RefreshCwIcon className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </Card>

        {/* ── Results ── */}
        {!hasSearched ?
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <SearchIcon className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-700 mb-1">
              Search for Archived Students
            </h3>
            <p className="text-sm text-gray-500 max-w-sm">
              Use the search panel above to find students who were previously
              enrolled and have since left the institution.
            </p>
          </div> :
        results.length === 0 ?
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4">
              <AlertCircleIcon className="w-8 h-8 text-orange-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-700 mb-1">
              No Students Found
            </h3>
            <p className="text-sm text-gray-500 max-w-sm">
              No archived students match your search criteria. Try adjusting the
              filters or search with different terms.
            </p>
          </div> :

        <Card className="overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ClipboardListIcon className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-semibold text-gray-900">
                  Search Results
                </h2>
                <Badge variant="info">
                  {results.length} student{results.length !== 1 ? 's' : ''}{' '}
                  found
                </Badge>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {columns.map((col) =>
                  <th
                    key={col.key}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">

                        {col.header}
                      </th>
                  )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {results.map((row) =>
                <tr
                  key={row.grNo}
                  className="hover:bg-gray-50 transition-colors">

                      {columns.map((col) =>
                  <td
                    key={col.key}
                    className="px-4 py-3 whitespace-nowrap">

                          {col.render(row)}
                        </td>
                  )}
                    </tr>
                )}
                </tbody>
              </table>
            </div>
          </Card>
        }
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
             VIEW MODAL
         ══════════════════════════════════════════════════════════════════════ */}
      {viewModalOpen && selectedStudent &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Student Details
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedStudent.name} · {selectedStudent.grNo}
                </p>
              </div>
              <button
              onClick={() => setViewModalOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors">

                <XIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Photo + Basic Info */}
              <div className="flex gap-5">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
                  {getInitials(selectedStudent.name)}
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <InfoRow label="GR Number" value={selectedStudent.grNo} />
                  <InfoRow label="Full Name" value={selectedStudent.name} />
                  <InfoRow label="Date of Birth" value={selectedStudent.dob} />
                  <InfoRow label="Gender" value={selectedStudent.gender} />
                  <InfoRow label="Category" value={selectedStudent.category} />
                  <InfoRow label="Status" value={selectedStudent.status} />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <BookOpenIcon className="w-4 h-4 text-blue-500" />
                  Academic Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <InfoRow
                  label="Previous Class"
                  value={selectedStudent.previousClass} />

                  <InfoRow label="Section" value={selectedStudent.section} />
                  <InfoRow
                  label="Academic Year"
                  value={selectedStudent.academicYear} />

                  <InfoRow
                  label="Leaving Date"
                  value={selectedStudent.leavingDate} />

                  <InfoRow
                  label="Reason for Leaving"
                  value={selectedStudent.reason} />

                </div>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-blue-500" />
                  Parent / Guardian
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <InfoRow
                  label="Parent Name"
                  value={selectedStudent.parentName} />

                  <InfoRow label="Contact" value={selectedStudent.contact} />
                  <InfoRow label="Email" value={selectedStudent.email} />
                  <div className="col-span-2">
                    <InfoRow label="Address" value={selectedStudent.address} />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <FileTextIcon className="w-4 h-4 text-blue-500" />
                  Previous Documents on Record
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 shrink-0" />
                    Birth Certificate
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 shrink-0" />
                    Transfer Certificate
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 shrink-0" />
                    Report Card
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 shrink-0" />
                    Admission Form
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-3 rounded-b-2xl">
              <Button variant="outline" onClick={() => setViewModalOpen(false)}>
                Close
              </Button>
              {selectedStudent.status !== 'Not Eligible' &&
            <Button
              variant="primary"
              onClick={() => openReadmitModal(selectedStudent)}>

                  <UserPlusIcon className="w-4 h-4 mr-2" />
                  Proceed to Readmit
                </Button>
            }
            </div>
          </div>
        </div>
      }

      {/* ══════════════════════════════════════════════════════════════════════
             READMISSION MODAL
         ══════════════════════════════════════════════════════════════════════ */}
      {readmitModalOpen && selectedStudent &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Readmission Form
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedStudent.name} · {selectedStudent.grNo}
                </p>
              </div>
              <button
              onClick={() => setReadmitModalOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors">

                <XIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* ── Section 1: Student Info ── */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                    1
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800">
                    Student Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                  label="GR Number"
                  value={selectedStudent.grNo}
                  readOnly />

                  <InputField
                  label="Previous Class"
                  value={selectedStudent.previousClass}
                  readOnly />

                  <InputField
                  label="Full Name"
                  value={readmitForm.fullName}
                  onChange={updateReadmit('fullName')}
                  placeholder="Full name" />

                  <InputField
                  label="Date of Birth"
                  value={selectedStudent.dob}
                  readOnly />

                  <InputField
                  label="Gender"
                  value={selectedStudent.gender}
                  readOnly />

                  <InputField
                  label="Parent / Guardian Name"
                  value={readmitForm.parentName}
                  onChange={updateReadmit('parentName')}
                  placeholder="Parent name" />

                  <InputField
                  label="Mobile Number"
                  value={readmitForm.mobile}
                  onChange={updateReadmit('mobile')}
                  placeholder="10-digit mobile" />

                  <InputField
                  label="Email Address"
                  value={readmitForm.email}
                  onChange={updateReadmit('email')}
                  placeholder="email@example.com" />

                  <div className="md:col-span-2">
                    <TextareaField
                    label="Address"
                    value={readmitForm.address}
                    onChange={updateReadmit('address')}
                    placeholder="Full residential address"
                    rows={2} />

                  </div>
                </div>
              </div>

              {/* ── Section 2: New Admission Details ── */}
              <div className="border-t border-gray-100 pt-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                    2
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800">
                    New Admission Details
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectField
                  label="Academic Year"
                  value={readmitForm.newAcademicYear}
                  onChange={updateReadmit('newAcademicYear')}
                  options={[
                  {
                    value: '2024-25',
                    label: '2024-25'
                  },
                  {
                    value: '2025-26',
                    label: '2025-26'
                  }]
                  } />

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Class Applying For
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <select
                        value={readmitForm.classApplying}
                        onChange={(e) =>
                        updateReadmit('classApplying')(e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer">

                          <option value="">Select Class</option>
                          {[
                        'Nursery',
                        'LKG',
                        'UKG',
                        ...Array.from(
                          {
                            length: 12
                          },
                          (_, i) => `Class ${i + 1}`
                        )].
                        map((c) =>
                        <option key={c} value={c}>
                              {c}
                            </option>
                        )}
                        </select>
                        <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                      {readmitForm.classApplying &&
                    seatsAvailable !== null && (
                    seatsAvailable > 0 ?
                    <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full whitespace-nowrap">
                            Seats: {seatsAvailable}
                          </span> :

                    <span className="text-xs font-semibold text-red-700 bg-red-100 px-2 py-1 rounded-full whitespace-nowrap">
                            Seats Full
                          </span>)
                    }
                    </div>
                  </div>
                  <SelectField
                  label="Section Preference"
                  value={readmitForm.sectionPreference}
                  onChange={updateReadmit('sectionPreference')}
                  options={[
                  {
                    value: '',
                    label: 'No Preference'
                  },
                  {
                    value: 'A',
                    label: 'Section A'
                  },
                  {
                    value: 'B',
                    label: 'Section B'
                  },
                  {
                    value: 'C',
                    label: 'Section C'
                  }]
                  } />

                  <InputField
                  label="Admission Type"
                  value="Readmission"
                  readOnly />

                  <div className="md:col-span-2">
                    <TextareaField
                    label="Reason for Readmission"
                    value={readmitForm.reasonForReadmission}
                    onChange={updateReadmit('reasonForReadmission')}
                    placeholder="Briefly describe the reason for readmission..."
                    rows={2} />

                  </div>
                </div>
              </div>

              {/* ── Section 3: Documents Required ── */}
              <div className="border-t border-gray-100 pt-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                    3
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800">
                    Documents Required
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                  {Object.entries(readmitForm.docs).map(
                  ([docName, checked]) =>
                  <label
                    key={docName}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">

                        <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleDoc(docName)}
                      className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500" />

                        <span
                      className={`text-sm ${checked ? 'text-gray-900' : 'text-gray-600'}`}>

                          {docName}
                        </span>
                        {checked &&
                    <CheckCircleIcon className="w-4 h-4 text-green-500 ml-auto shrink-0" />
                    }
                      </label>

                )}
                </div>
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircleIcon className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-700">
                    Please ensure all required documents are submitted before
                    proceeding with the readmission.
                  </p>
                </div>
              </div>

              {/* ── Section 4: Fee Information ── */}
              <div className="border-t border-gray-100 pt-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                    4
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800">
                    Fee Information
                  </h3>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Readmission Fee</span>
                    <span className="font-medium text-gray-900">₹2,500</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Processing Fee</span>
                    <span className="font-medium text-gray-900">₹500</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between text-sm font-semibold">
                    <span className="text-gray-900">Total Payable</span>
                    <span className="text-blue-700 text-base">₹3,000</span>
                  </div>
                </div>
                <div className="max-w-xs">
                  <SelectField
                  label="Payment Mode"
                  value={readmitForm.paymentMode}
                  onChange={updateReadmit('paymentMode')}
                  options={[
                  {
                    value: 'Cash',
                    label: 'Cash'
                  },
                  {
                    value: 'Online',
                    label: 'Online'
                  },
                  {
                    value: 'Cheque',
                    label: 'Cheque'
                  }]
                  } />

                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-3 rounded-b-2xl">
              <Button
              variant="outline"
              onClick={() => setReadmitModalOpen(false)}>

                Cancel
              </Button>
              <Button variant="outline">Save as Draft</Button>
              <Button variant="primary">
                <UserPlusIcon className="w-4 h-4 mr-2" />
                Proceed with Readmission
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}