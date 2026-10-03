import React, { useState } from 'react';
import {
  Download,
  Search,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Eye,
  User,
  AlertCircle,
  Filter,
  Users,
  FileText } from
'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';

// --- Types ---
interface Student {
  id: string;
  photo?: string;
  firstName: string;
  lastName: string;
  grNumber: string;
  admissionNumber: string;
  suId: string;
  penNo: string;
  department: string;
  contactNumber: string;
  class: string;
  section: string;
  rollNumber: string;
  status: 'Active' | 'Inactive' | 'Left' | 'Transferred' | 'Alumni';
  classStatus: string;
  gender: string;
  house: string;
  category: string;
  bloodGroup: string;
  transport: string;
  hostel: string;
  ews: string;
  rte: string;
  minority: string;
  religion: string;
  caste: string;
  admissionType: string;
}

// Mock Data
const MOCK_STUDENTS: Student[] = [
{
  id: 'S001',
  firstName: 'Aarav',
  lastName: 'Patel',
  grNumber: 'GR1001',
  admissionNumber: 'ADM202301',
  suId: 'SU5501',
  penNo: 'PEN889',
  department: 'Science',
  contactNumber: '9876543210',
  class: '10',
  section: 'A',
  rollNumber: '1',
  status: 'Active',
  classStatus: 'Regular',
  gender: 'Male',
  house: 'Red House',
  category: 'General',
  bloodGroup: 'B+',
  transport: 'Transport User',
  hostel: 'Day Scholar',
  ews: 'No',
  rte: 'No',
  minority: 'No',
  religion: 'Hindu',
  caste: 'Patel',
  admissionType: 'Regular'
},
{
  id: 'S002',
  firstName: 'Isha',
  lastName: 'Sharma',
  grNumber: 'GR1002',
  admissionNumber: 'ADM202302',
  suId: 'SU5502',
  penNo: 'PEN890',
  department: 'Commerce',
  contactNumber: '9876543211',
  class: '11',
  section: 'B',
  rollNumber: '12',
  status: 'Active',
  classStatus: 'Regular',
  gender: 'Female',
  house: 'Blue House',
  category: 'OBC',
  bloodGroup: 'O+',
  transport: 'Non Transport User',
  hostel: 'Hostel Resident',
  ews: 'Yes',
  rte: 'No',
  minority: 'No',
  religion: 'Hindu',
  caste: 'Sharma',
  admissionType: 'Regular'
},
{
  id: 'S003',
  firstName: 'Rohan',
  lastName: 'Verma',
  grNumber: 'GR1005',
  admissionNumber: 'ADM202305',
  suId: 'SU5505',
  penNo: 'PEN900',
  department: 'Arts',
  contactNumber: '9876543222',
  class: '12',
  section: 'C',
  rollNumber: '5',
  status: 'Left',
  classStatus: 'Repeater',
  gender: 'Male',
  house: 'Green House',
  category: 'SC',
  bloodGroup: 'A-',
  transport: 'Non Transport User',
  hostel: 'Day Scholar',
  ews: 'Yes',
  rte: 'Yes',
  minority: 'No',
  religion: 'Hindu',
  caste: 'Verma',
  admissionType: 'RTE'
},
{
  id: 'S004',
  firstName: 'Meera',
  lastName: 'Singh',
  grNumber: 'GR1006',
  admissionNumber: 'ADM202306',
  suId: 'SU5506',
  penNo: 'PEN901',
  department: 'Science',
  contactNumber: '9876543333',
  class: '10',
  section: 'A',
  rollNumber: '2',
  status: 'Active',
  classStatus: 'Regular',
  gender: 'Female',
  house: 'Yellow House',
  category: 'General',
  bloodGroup: 'B+',
  transport: 'Transport User',
  hostel: 'Day Scholar',
  ews: 'No',
  rte: 'No',
  minority: 'Yes',
  religion: 'Sikh',
  caste: 'Singh',
  admissionType: 'Regular'
},
{
  id: 'S005',
  firstName: 'Mohammed',
  lastName: 'Khan',
  grNumber: 'GR1007',
  admissionNumber: 'ADM202307',
  suId: 'SU5507',
  penNo: 'PEN902',
  department: 'Commerce',
  contactNumber: '9876543444',
  class: '11',
  section: 'A',
  rollNumber: '8',
  status: 'Active',
  classStatus: 'Regular',
  gender: 'Male',
  house: 'Red House',
  category: 'General',
  bloodGroup: 'A+',
  transport: 'Transport User',
  hostel: 'Day Scholar',
  ews: 'No',
  rte: 'No',
  minority: 'Yes',
  religion: 'Muslim',
  caste: 'Khan',
  admissionType: 'Management'
},
{
  id: 'S006',
  firstName: 'Priya',
  lastName: 'Joshi',
  grNumber: 'GR1008',
  admissionNumber: 'ADM202308',
  suId: 'SU5508',
  penNo: 'PEN903',
  department: 'Science',
  contactNumber: '9876543555',
  class: '9',
  section: 'B',
  rollNumber: '15',
  status: 'Active',
  classStatus: 'New',
  gender: 'Female',
  house: 'Blue House',
  category: 'ST',
  bloodGroup: 'O-',
  transport: 'Non Transport User',
  hostel: 'Hostel Resident',
  ews: 'Yes',
  rte: 'Yes',
  minority: 'No',
  religion: 'Hindu',
  caste: 'Joshi',
  admissionType: 'RTE'
},
{
  id: 'S007',
  firstName: 'David',
  lastName: 'Thomas',
  grNumber: 'GR1009',
  admissionNumber: 'ADM202309',
  suId: 'SU5509',
  penNo: 'PEN904',
  department: 'Arts',
  contactNumber: '9876543666',
  class: '10',
  section: 'C',
  rollNumber: '20',
  status: 'Active',
  classStatus: 'Regular',
  gender: 'Male',
  house: 'Green House',
  category: 'General',
  bloodGroup: 'AB+',
  transport: 'Transport User',
  hostel: 'Day Scholar',
  ews: 'No',
  rte: 'No',
  minority: 'Yes',
  religion: 'Christian',
  caste: 'Thomas',
  admissionType: 'Transfer'
},
{
  id: 'S008',
  firstName: 'Ananya',
  lastName: 'Reddy',
  grNumber: 'GR1010',
  admissionNumber: 'ADM202310',
  suId: 'SU5510',
  penNo: 'PEN905',
  department: 'Commerce',
  contactNumber: '9876543777',
  class: '12',
  section: 'A',
  rollNumber: '3',
  status: 'Active',
  classStatus: 'Promoted',
  gender: 'Female',
  house: 'Yellow House',
  category: 'OBC',
  bloodGroup: 'B-',
  transport: 'Non Transport User',
  hostel: 'Day Scholar',
  ews: 'No',
  rte: 'No',
  minority: 'No',
  religion: 'Hindu',
  caste: 'Reddy',
  admissionType: 'Regular'
}];


// --- Options Constants ---
const DEPARTMENTS = ['All Departments', 'Science', 'Commerce', 'Arts', 'General'];
const CLASSES = ['All Classes', '9', '10', '11', '12'];
const SECTIONS = ['All Sections', 'A', 'B', 'C', 'D'];
const STATUSES = ['All Status', 'Active', 'Inactive', 'Left', 'Transferred', 'Alumni'];
const CLASS_STATUSES = ['All Class Status', 'Regular', 'Promoted', 'Repeated', 'New'];
const GENDERS = ['All Genders', 'Male', 'Female', 'Other'];
const HOUSES = ['All Houses', 'Red House', 'Blue House', 'Green House', 'Yellow House'];
const CATEGORIES = ['All Categories', 'General', 'OBC', 'SC', 'ST', 'EWS', 'Other'];
const BLOOD_GROUPS = ['All Blood Groups', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const TRANSPORT_OPTS = ['All', 'Transport User', 'Non Transport User'];
const HOSTEL_OPTS = ['All', 'Hostel Resident', 'Day Scholar'];
const EWS_OPTS = ['All', 'Yes', 'No'];
const RTE_OPTS = ['All', 'Yes', 'No'];
const MINORITY_OPTS = ['All', 'Yes', 'No'];
const RELIGIONS = ['All Religions', 'Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Parsi', 'Other'];
const CASTES = ['All Castes', 'Patel', 'Sharma', 'Verma', 'Singh', 'Khan', 'Joshi', 'Thomas', 'Reddy', 'Other'];
const ADMISSION_TYPES = ['All Admission Types', 'Regular', 'RTE', 'Management', 'Transfer'];

// Dynamic Column Map
const DYNAMIC_COLUMN_MAP: Record<string, string> = {
  gender: 'Gender',
  house: 'House',
  category: 'Category',
  bloodGroup: 'Blood Group',
  transport: 'Transport',
  hostel: 'Hostel',
  contactNumber: 'Contact No',
  classStatus: 'Class Status',
  ews: 'EWS',
  rte: 'RTE',
  minority: 'Minority',
  religion: 'Religion',
  caste: 'Caste',
  admissionType: 'Admission Type'
};

interface FilterState {
  firstName: string;
  lastName: string;
  grNumber: string;
  admissionNumber: string;
  suId: string;
  penNo: string;
  department: string;
  contactNumber: string;
  class: string;
  section: string;
  rollNumber: string;
  status: string;
  classStatus: string;
  showPhoto: boolean;
  gender: string;
  house: string;
  category: string;
  bloodGroup: string;
  transport: string;
  hostel: string;
  ews: string;
  rte: string;
  minority: string;
  religion: string;
  caste: string;
  admissionType: string;
}

const INITIAL_FILTERS: FilterState = {
  firstName: '',
  lastName: '',
  grNumber: '',
  admissionNumber: '',
  suId: '',
  penNo: '',
  department: 'All Departments',
  contactNumber: '',
  class: 'All Classes',
  section: 'All Sections',
  rollNumber: '',
  status: 'All Status',
  classStatus: 'All Class Status',
  showPhoto: false,
  gender: 'All Genders',
  house: 'All Houses',
  category: 'All Categories',
  bloodGroup: 'All Blood Groups',
  transport: 'All',
  hostel: 'All',
  ews: 'All',
  rte: 'All',
  minority: 'All',
  religion: 'All Religions',
  caste: 'All Castes',
  admissionType: 'All Admission Types'
};

export function StudentListPage() {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showCategoryFilters, setShowCategoryFilters] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<Student[]>([]);
  const [dynamicColumns, setDynamicColumns] = useState<string[]>([]);

  const handleInputChange = (field: keyof FilterState, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReset = () => {
    setFilters(INITIAL_FILTERS);
    setHasSearched(false);
    setResults([]);
    setDynamicColumns([]);
  };

  const handleSearch = () => {
    const newDynamicCols: string[] = [];

    if (filters.gender !== 'All Genders') newDynamicCols.push('gender');
    if (filters.house !== 'All Houses') newDynamicCols.push('house');
    if (filters.category !== 'All Categories') newDynamicCols.push('category');
    if (filters.bloodGroup !== 'All Blood Groups') newDynamicCols.push('bloodGroup');
    if (filters.transport !== 'All') newDynamicCols.push('transport');
    if (filters.hostel !== 'All') newDynamicCols.push('hostel');
    if (filters.contactNumber.trim() !== '') newDynamicCols.push('contactNumber');
    if (filters.classStatus !== 'All Class Status') newDynamicCols.push('classStatus');
    if (filters.ews !== 'All') newDynamicCols.push('ews');
    if (filters.rte !== 'All') newDynamicCols.push('rte');
    if (filters.minority !== 'All') newDynamicCols.push('minority');
    if (filters.religion !== 'All Religions') newDynamicCols.push('religion');
    if (filters.caste !== 'All Castes') newDynamicCols.push('caste');
    if (filters.admissionType !== 'All Admission Types') newDynamicCols.push('admissionType');

    setDynamicColumns(newDynamicCols);

    const filtered = MOCK_STUDENTS.filter((s) => {
      if (filters.firstName && !s.firstName.toLowerCase().includes(filters.firstName.toLowerCase())) return false;
      if (filters.lastName && !s.lastName.toLowerCase().includes(filters.lastName.toLowerCase())) return false;
      if (filters.grNumber && !s.grNumber.toLowerCase().includes(filters.grNumber.toLowerCase())) return false;
      if (filters.admissionNumber && !s.admissionNumber.toLowerCase().includes(filters.admissionNumber.toLowerCase())) return false;
      if (filters.suId && !s.suId.toLowerCase().includes(filters.suId.toLowerCase())) return false;
      if (filters.penNo && !s.penNo.toLowerCase().includes(filters.penNo.toLowerCase())) return false;
      if (filters.contactNumber && !s.contactNumber.includes(filters.contactNumber)) return false;
      if (filters.rollNumber && s.rollNumber !== filters.rollNumber) return false;
      if (filters.department !== 'All Departments' && s.department !== filters.department) return false;
      if (filters.class !== 'All Classes' && s.class !== filters.class) return false;
      if (filters.section !== 'All Sections' && s.section !== filters.section) return false;
      if (filters.status !== 'All Status' && s.status !== filters.status) return false;
      if (filters.classStatus !== 'All Class Status' && s.classStatus !== filters.classStatus) return false;
      if (filters.gender !== 'All Genders' && s.gender !== filters.gender) return false;
      if (filters.house !== 'All Houses' && s.house !== filters.house) return false;
      if (filters.category !== 'All Categories' && s.category !== filters.category) return false;
      if (filters.bloodGroup !== 'All Blood Groups' && s.bloodGroup !== filters.bloodGroup) return false;
      if (filters.transport !== 'All' && s.transport !== filters.transport) return false;
      if (filters.hostel !== 'All' && s.hostel !== filters.hostel) return false;
      if (filters.ews !== 'All' && s.ews !== filters.ews) return false;
      if (filters.rte !== 'All' && s.rte !== filters.rte) return false;
      if (filters.minority !== 'All' && s.minority !== filters.minority) return false;
      if (filters.religion !== 'All Religions' && s.religion !== filters.religion) return false;
      if (filters.caste !== 'All Castes' && s.caste !== filters.caste) return false;
      if (filters.admissionType !== 'All Admission Types' && s.admissionType !== filters.admissionType) return false;

      return true;
    });

    setResults(filtered);
    setHasSearched(true);
  };

  const handleExport = () => {
    const fileName = `Student_List_${new Date().toISOString().slice(0, 10)}.csv`;
    console.log(`Exporting filtered list to ${fileName}`, results);
    alert(`Export initiated: ${fileName}`);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'default';
      case 'Left':
        return 'destructive';
      case 'Transferred':
        return 'warning';
      case 'Alumni':
        return 'info';
      default:
        return 'default';
    }
  };

  const getAdmissionTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'Regular':
        return 'success';
      case 'RTE':
        return 'warning';
      case 'Management':
        return 'info';
      case 'Transfer':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.firstName) count++;
    if (filters.lastName) count++;
    if (filters.grNumber) count++;
    if (filters.admissionNumber) count++;
    if (filters.suId) count++;
    if (filters.penNo) count++;
    if (filters.department !== 'All Departments') count++;
    if (filters.contactNumber) count++;
    if (filters.class !== 'All Classes') count++;
    if (filters.section !== 'All Sections') count++;
    if (filters.rollNumber) count++;
    if (filters.status !== 'All Status') count++;
    if (filters.classStatus !== 'All Class Status') count++;
    if (filters.gender !== 'All Genders') count++;
    if (filters.house !== 'All Houses') count++;
    if (filters.category !== 'All Categories') count++;
    if (filters.bloodGroup !== 'All Blood Groups') count++;
    if (filters.transport !== 'All') count++;
    if (filters.hostel !== 'All') count++;
    if (filters.ews !== 'All') count++;
    if (filters.rte !== 'All') count++;
    if (filters.minority !== 'All') count++;
    if (filters.religion !== 'All Religions') count++;
    if (filters.caste !== 'All Castes') count++;
    if (filters.admissionType !== 'All Admission Types') count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="space-y-6 pb-10">
      {/* Page Title & Export */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-7 h-7" />
              Student Search
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Search and filter students with advanced criteria
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {activeFilterCount > 0 &&
          <Badge variant="info" className="px-3 py-1">
              {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
            </Badge>
          }
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={!hasSearched || results.length === 0}>

            <Download className="w-4 h-4 mr-2" /> Export List
          </Button>
        </div>
      </div>

      {/* Search Filters Panel */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            Search Filters
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCategoryFilters(!showCategoryFilters)}
              className="text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center">

              {showCategoryFilters ? 'Hide Category Filters' : 'Category & Reservation'}
              {showCategoryFilters ?
              <ChevronUp className="w-4 h-4 ml-1" /> :

              <ChevronDown className="w-4 h-4 ml-1" />
              }
            </button>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">

              {showAdvanced ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
              {showAdvanced ?
              <ChevronUp className="w-4 h-4 ml-1" /> :

              <ChevronDown className="w-4 h-4 ml-1" />
              }
            </button>
          </div>
        </div>

        {/* Basic Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <Input
            placeholder="Enter first name"
            label="First Name"
            value={filters.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)} />

          <Input
            placeholder="Enter last name"
            label="Last Name"
            value={filters.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)} />

          <Input
            placeholder="Enter GR number"
            label="GR Number"
            value={filters.grNumber}
            onChange={(e) => handleInputChange('grNumber', e.target.value)} />

          <Input
            placeholder="Enter admission number"
            label="Admission Number"
            value={filters.admissionNumber}
            onChange={(e) => handleInputChange('admissionNumber', e.target.value)} />

          <Input
            placeholder="Enter SU ID"
            label="SU ID"
            value={filters.suId}
            onChange={(e) => handleInputChange('suId', e.target.value)} />

          <Input
            placeholder="Enter PEN number"
            label="PEN No"
            value={filters.penNo}
            onChange={(e) => handleInputChange('penNo', e.target.value)} />

          <Select
            label="Department"
            options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
            value={filters.department}
            onChange={(value) => handleInputChange('department', value)} />

          <Input
            placeholder="Enter contact number"
            label="Contact Number"
            value={filters.contactNumber}
            onChange={(e) => handleInputChange('contactNumber', e.target.value)} />

          <Select
            label="Class"
            options={CLASSES.map((c) => ({ value: c, label: c }))}
            value={filters.class}
            onChange={(value) => handleInputChange('class', value)} />

          <Select
            label="Section"
            options={SECTIONS.map((s) => ({ value: s, label: s }))}
            value={filters.section}
            onChange={(value) => handleInputChange('section', value)} />

          <Input
            placeholder="Enter roll number"
            label="Roll Number"
            value={filters.rollNumber}
            onChange={(e) => handleInputChange('rollNumber', e.target.value)} />

          <Select
            label="Status"
            options={STATUSES.map((s) => ({ value: s, label: s }))}
            value={filters.status}
            onChange={(value) => handleInputChange('status', value)} />

          <Select
            label="Class Status"
            options={CLASS_STATUSES.map((s) => ({ value: s, label: s }))}
            value={filters.classStatus}
            onChange={(value) => handleInputChange('classStatus', value)} />

          <Select
            label="Admission Type"
            options={ADMISSION_TYPES.map((s) => ({ value: s, label: s }))}
            value={filters.admissionType}
            onChange={(value) => handleInputChange('admissionType', value)} />

        </div>

        {/* Checkbox */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            id="showPhoto"
            checked={filters.showPhoto}
            onChange={(e) => handleInputChange('showPhoto', e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

          <label htmlFor="showPhoto" className="text-sm font-medium text-gray-700">
            Show with Photo
          </label>
        </div>

        {/* Category & Reservation Filters */}
        {showCategoryFilters &&
        <div className="mb-6 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-semibold text-purple-800">Category & Reservation Filters</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select
              label="Category"
              options={CATEGORIES.map((o) => ({ value: o, label: o }))}
              value={filters.category}
              onChange={(value) => handleInputChange('category', value)} />

              <Select
              label="EWS (Economically Weaker Section)"
              options={EWS_OPTS.map((o) => ({ value: o, label: o }))}
              value={filters.ews}
              onChange={(value) => handleInputChange('ews', value)} />

              <Select
              label="RTE (Right to Education)"
              options={RTE_OPTS.map((o) => ({ value: o, label: o }))}
              value={filters.rte}
              onChange={(value) => handleInputChange('rte', value)} />

              <Select
              label="Minority Status"
              options={MINORITY_OPTS.map((o) => ({ value: o, label: o }))}
              value={filters.minority}
              onChange={(value) => handleInputChange('minority', value)} />

              <Select
              label="Religion"
              options={RELIGIONS.map((o) => ({ value: o, label: o }))}
              value={filters.religion}
              onChange={(value) => handleInputChange('religion', value)} />

              <Select
              label="Caste"
              options={CASTES.map((o) => ({ value: o, label: o }))}
              value={filters.caste}
              onChange={(value) => handleInputChange('caste', value)} />

            </div>
          </div>
        }

        {/* Advanced Filters Grid */}
        {showAdvanced &&
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 pt-4 border-t border-gray-100">
            <Select
            label="Gender"
            options={GENDERS.map((o) => ({ value: o, label: o }))}
            value={filters.gender}
            onChange={(value) => handleInputChange('gender', value)} />

            <Select
            label="House"
            options={HOUSES.map((o) => ({ value: o, label: o }))}
            value={filters.house}
            onChange={(value) => handleInputChange('house', value)} />

            <Select
            label="Blood Group"
            options={BLOOD_GROUPS.map((o) => ({ value: o, label: o }))}
            value={filters.bloodGroup}
            onChange={(value) => handleInputChange('bloodGroup', value)} />

            <Select
            label="Transport"
            options={TRANSPORT_OPTS.map((o) => ({ value: o, label: o }))}
            value={filters.transport}
            onChange={(value) => handleInputChange('transport', value)} />

            <Select
            label="Hostel"
            options={HOSTEL_OPTS.map((o) => ({ value: o, label: o }))}
            value={filters.hostel}
            onChange={(value) => handleInputChange('hostel', value)} />

          </div>
        }

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button onClick={handleSearch} className="px-6">
            <Search className="w-4 h-4 mr-2" /> Search Students
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" /> Reset Filters
          </Button>
        </div>
      </Card>

      {/* Results Panel */}
      {hasSearched &&
      <Card className="p-0 overflow-hidden border border-gray-200 shadow-sm">
          {results.length === 0 ?
        <div className="p-12 text-center text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-lg font-medium">No students found</p>
              <p className="text-sm">Try adjusting your filters to find who you're looking for.</p>
            </div> :

        <>
              {/* Results Summary */}
              <div className="px-4 py-3 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Found <span className="font-bold">{results.length}</span> student
                    {results.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-blue-600">
                  {dynamicColumns.length > 0 &&
              <span className="px-2 py-1 bg-blue-100 rounded">
                      +{dynamicColumns.length} dynamic column{dynamicColumns.length > 1 ? 's' : ''}
                    </span>
              }
                </div>
              </div>

              {/* Table Container */}
              <div className="overflow-x-auto overflow-y-auto max-h-[600px] w-full">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0 z-10 shadow-sm">
                    <tr>
                      {filters.showPhoto &&
                  <th className="px-4 py-3 font-medium w-16 whitespace-nowrap bg-gray-100">
                          Photo
                        </th>
                  }
                      <th className="px-4 py-3 font-medium whitespace-nowrap bg-gray-100">
                        Student Name
                      </th>
                      <th className="px-4 py-3 font-medium whitespace-nowrap bg-gray-100">
                        GR No
                      </th>
                      <th className="px-4 py-3 font-medium whitespace-nowrap bg-gray-100">
                        SU ID
                      </th>
                      <th className="px-4 py-3 font-medium whitespace-nowrap bg-gray-100">
                        Roll No
                      </th>
                      <th className="px-4 py-3 font-medium whitespace-nowrap bg-gray-100">
                        Class
                      </th>
                      <th className="px-4 py-3 font-medium whitespace-nowrap bg-gray-100">
                        Section
                      </th>
                      <th className="px-4 py-3 font-medium whitespace-nowrap bg-gray-100">
                        Department
                      </th>

                      {dynamicColumns.map((colKey) =>
                  <th
                    key={colKey}
                    className="px-4 py-3 font-medium text-blue-700 whitespace-nowrap bg-blue-50">

                          {DYNAMIC_COLUMN_MAP[colKey] || colKey}
                        </th>
                  )}

                      <th className="px-4 py-3 font-medium whitespace-nowrap bg-gray-100">
                        Status
                      </th>
                      <th className="px-4 py-3 font-medium text-right whitespace-nowrap bg-gray-100">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {results.map((student) =>
                <tr key={student.id} className="bg-white hover:bg-blue-50 transition-colors">
                        {filters.showPhoto &&
                  <td className="px-4 py-3 whitespace-nowrap">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-200">
                              {student.photo ?
                      <img
                        src={student.photo}
                        alt=""
                        className="w-full h-full object-cover" /> :


                      <User className="w-5 h-5 text-gray-400" />
                      }
                            </div>
                          </td>
                  }

                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                          {student.grNumber}
                        </td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                          {student.suId}
                        </td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                          {student.rollNumber}
                        </td>
                        <td className="px-4 py-3 text-gray-900 whitespace-nowrap">
                          {student.class}
                        </td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                          {student.section}
                        </td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                          {student.department}
                        </td>

                        {dynamicColumns.map((colKey) =>
                  <td key={colKey} className="px-4 py-3 whitespace-nowrap bg-blue-50/30">
                            {colKey === 'ews' || colKey === 'rte' || colKey === 'minority' ?
                    <Badge
                      variant={
                      student[colKey as keyof Student] === 'Yes' ? 'success' : 'secondary'
                      }>

                                {student[colKey as keyof Student]}
                              </Badge> :
                    colKey === 'admissionType' ?
                    <Badge
                      variant={getAdmissionTypeBadgeVariant(
                        student[colKey as keyof Student] as string
                      )}>

                                {student[colKey as keyof Student]}
                              </Badge> :
                    colKey === 'category' ?
                    <Badge
                      variant={student.category === 'General' ? 'secondary' : 'warning'}>

                                {student[colKey as keyof Student]}
                              </Badge> :

                    <span className="text-gray-600">
                                {student[colKey as keyof Student]}
                              </span>
                    }
                          </td>
                  )}

                        <td className="px-4 py-3 whitespace-nowrap">
                          <Badge variant={getStatusBadgeVariant(student.status)}>
                            {student.status}
                          </Badge>
                        </td>

                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4 text-gray-500" />
                          </Button>
                        </td>
                      </tr>
                )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t bg-white">
                <span className="text-sm text-gray-500">
                  Showing <span className="font-medium">{results.length}</span> results
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Next
                  </Button>
                </div>
              </div>
            </>
        }
        </Card>
      }
    </div>);

}

export { StudentListPage as StudentList };