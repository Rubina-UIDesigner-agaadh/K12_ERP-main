import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  SearchIcon,
  UploadCloudIcon,
  CameraIcon,
  FileTextIcon,
  Trash2Icon,
  CheckCircleIcon,
  AlertCircleIcon,
  UserIcon,
  XIcon,
  ImageIcon,
  FileIcon,
  ClockIcon,
  RefreshCwIcon } from
'lucide-react';

interface StudentDocument {
  name: string;
  key: string;
  uploaded: boolean;
  uploadedDate?: string;
}

interface Student {
  id: string;
  grNo: string;
  suId: string;
  firstName: string;
  lastName: string;
  class: string;
  section: string;
  department: string;
  hasPhoto: boolean;
  photoUploadedAt?: string;
  documents: StudentDocument[];
}

const studentsData: Student[] = [
{
  id: '1',
  grNo: 'GR-2024-001',
  suId: 'SU-10001',
  firstName: 'Aarav',
  lastName: 'Sharma',
  class: '10',
  section: 'A',
  department: 'Science',
  hasPhoto: true,
  photoUploadedAt: '15 Mar 2024, 10:30 AM',
  documents: [
  { name: 'Birth Certificate', key: 'birthCert', uploaded: true, uploadedDate: '10 Mar 2024' },
  { name: 'Aadhar Card', key: 'aadhar', uploaded: true, uploadedDate: '10 Mar 2024' },
  { name: 'Previous Marksheet', key: 'marksheet', uploaded: true, uploadedDate: '12 Mar 2024' },
  { name: 'Transfer Certificate', key: 'tc', uploaded: true, uploadedDate: '12 Mar 2024' },
  { name: 'Medical Certificate', key: 'medical', uploaded: false },
  { name: 'Caste Certificate', key: 'caste', uploaded: false }]

},
{
  id: '2',
  grNo: 'GR-2024-002',
  suId: 'SU-10002',
  firstName: 'Priya',
  lastName: 'Patel',
  class: '10',
  section: 'B',
  department: 'Commerce',
  hasPhoto: true,
  photoUploadedAt: '14 Mar 2024, 02:15 PM',
  documents: [
  { name: 'Birth Certificate', key: 'birthCert', uploaded: true, uploadedDate: '08 Mar 2024' },
  { name: 'Aadhar Card', key: 'aadhar', uploaded: true, uploadedDate: '08 Mar 2024' },
  { name: 'Previous Marksheet', key: 'marksheet', uploaded: false },
  { name: 'Transfer Certificate', key: 'tc', uploaded: false },
  { name: 'Medical Certificate', key: 'medical', uploaded: false },
  { name: 'Caste Certificate', key: 'caste', uploaded: true, uploadedDate: '09 Mar 2024' }]

},
{
  id: '3',
  grNo: 'GR-2024-003',
  suId: 'SU-10003',
  firstName: 'Rohan',
  lastName: 'Desai',
  class: '9',
  section: 'A',
  department: 'Science',
  hasPhoto: false,
  documents: [
  { name: 'Birth Certificate', key: 'birthCert', uploaded: true, uploadedDate: '05 Mar 2024' },
  { name: 'Aadhar Card', key: 'aadhar', uploaded: false },
  { name: 'Previous Marksheet', key: 'marksheet', uploaded: false },
  { name: 'Transfer Certificate', key: 'tc', uploaded: false },
  { name: 'Medical Certificate', key: 'medical', uploaded: false },
  { name: 'Caste Certificate', key: 'caste', uploaded: false }]

},
{
  id: '4',
  grNo: 'GR-2024-004',
  suId: 'SU-10004',
  firstName: 'Sneha',
  lastName: 'Kulkarni',
  class: '9',
  section: 'C',
  department: 'Arts',
  hasPhoto: true,
  photoUploadedAt: '10 Mar 2024, 11:45 AM',
  documents: [
  { name: 'Birth Certificate', key: 'birthCert', uploaded: true, uploadedDate: '01 Mar 2024' },
  { name: 'Aadhar Card', key: 'aadhar', uploaded: true, uploadedDate: '01 Mar 2024' },
  { name: 'Previous Marksheet', key: 'marksheet', uploaded: true, uploadedDate: '02 Mar 2024' },
  { name: 'Transfer Certificate', key: 'tc', uploaded: true, uploadedDate: '02 Mar 2024' },
  { name: 'Medical Certificate', key: 'medical', uploaded: true, uploadedDate: '03 Mar 2024' },
  { name: 'Caste Certificate', key: 'caste', uploaded: true, uploadedDate: '03 Mar 2024' }]

},
{
  id: '5',
  grNo: 'GR-2024-005',
  suId: 'SU-10005',
  firstName: 'Vikram',
  lastName: 'Joshi',
  class: '8',
  section: 'B',
  department: 'Science',
  hasPhoto: false,
  documents: [
  { name: 'Birth Certificate', key: 'birthCert', uploaded: false },
  { name: 'Aadhar Card', key: 'aadhar', uploaded: false },
  { name: 'Previous Marksheet', key: 'marksheet', uploaded: false },
  { name: 'Transfer Certificate', key: 'tc', uploaded: false },
  { name: 'Medical Certificate', key: 'medical', uploaded: false },
  { name: 'Caste Certificate', key: 'caste', uploaded: false }]

},
{
  id: '6',
  grNo: 'GR-2024-006',
  suId: 'SU-10006',
  firstName: 'Ananya',
  lastName: 'Reddy',
  class: '10',
  section: 'A',
  department: 'Science',
  hasPhoto: true,
  photoUploadedAt: '12 Mar 2024, 09:20 AM',
  documents: [
  { name: 'Birth Certificate', key: 'birthCert', uploaded: true, uploadedDate: '06 Mar 2024' },
  { name: 'Aadhar Card', key: 'aadhar', uploaded: true, uploadedDate: '06 Mar 2024' },
  { name: 'Previous Marksheet', key: 'marksheet', uploaded: true, uploadedDate: '07 Mar 2024' },
  { name: 'Transfer Certificate', key: 'tc', uploaded: true, uploadedDate: '07 Mar 2024' },
  { name: 'Medical Certificate', key: 'medical', uploaded: true, uploadedDate: '08 Mar 2024' },
  { name: 'Caste Certificate', key: 'caste', uploaded: false }]

}];


export function UploadStudentMedia() {
  const [searchFilters, setSearchFilters] = useState({
    grNo: '',
    suId: '',
    firstName: '',
    lastName: '',
    class: '',
    section: '',
    department: ''
  });
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activePanel, setActivePanel] = useState<'photo' | 'document' | null>(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFilterChange = (key: string, value: string) => {
    setSearchFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    const results = studentsData.filter((student) => {
      const matchGrNo = searchFilters.grNo ?
      student.grNo.toLowerCase().includes(searchFilters.grNo.toLowerCase()) :
      true;
      const matchSuId = searchFilters.suId ?
      student.suId.toLowerCase().includes(searchFilters.suId.toLowerCase()) :
      true;
      const matchFirstName = searchFilters.firstName ?
      student.firstName.toLowerCase().includes(searchFilters.firstName.toLowerCase()) :
      true;
      const matchLastName = searchFilters.lastName ?
      student.lastName.toLowerCase().includes(searchFilters.lastName.toLowerCase()) :
      true;
      const matchClass = searchFilters.class ?
      student.class === searchFilters.class :
      true;
      const matchSection = searchFilters.section ?
      student.section === searchFilters.section :
      true;
      const matchDepartment = searchFilters.department ?
      student.department === searchFilters.department :
      true;

      return (
        matchGrNo &&
        matchSuId &&
        matchFirstName &&
        matchLastName &&
        matchClass &&
        matchSection &&
        matchDepartment);

    });

    setSearchResults(results);
    setHasSearched(true);
  };

  const handleReset = () => {
    setSearchFilters({
      grNo: '',
      suId: '',
      firstName: '',
      lastName: '',
      class: '',
      section: '',
      department: ''
    });
    setSearchResults([]);
    setHasSearched(false);
  };

  const handleOpenPhotoPanel = (student: Student) => {
    setSelectedStudent(student);
    setActivePanel('photo');
    setUploadedFile(null);
  };

  const handleOpenDocumentPanel = (student: Student) => {
    setSelectedStudent(student);
    setActivePanel('document');
    setSelectedDocumentType('');
    setUploadedFile(null);
  };

  const handleClosePanel = () => {
    setSelectedStudent(null);
    setActivePanel(null);
    setSelectedDocumentType('');
    setUploadedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const getMissingDocuments = (student: Student) => {
    return student.documents.filter((doc) => !doc.uploaded);
  };

  const getUploadedDocuments = (student: Student) => {
    return student.documents.filter((doc) => doc.uploaded);
  };

  const columns = [
  {
    key: 'student',
    header: 'Student',
    render: (row: Student) =>
    <div className="flex items-center gap-3">
          <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
        row.hasPhoto ?
        'bg-gradient-to-br from-blue-500 to-blue-600 text-white' :
        'bg-gray-100'}`
        }>

            {row.hasPhoto ?
        <span className="font-semibold text-sm">
                {row.firstName.charAt(0)}
                {row.lastName.charAt(0)}
              </span> :

        <UserIcon className="w-5 h-5 text-gray-400" />
        }
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {row.firstName} {row.lastName}
            </div>
            <div className="text-xs text-gray-500">
              {row.grNo} · {row.suId}
            </div>
          </div>
        </div>

  },
  {
    key: 'class',
    header: 'Class & Section',
    render: (row: Student) =>
    <div>
          <div className="font-medium text-gray-900">
            Class {row.class}-{row.section}
          </div>
          <div className="text-xs text-gray-500">{row.department}</div>
        </div>

  },
  {
    key: 'photoStatus',
    header: 'Photo',
    render: (row: Student) =>
    row.hasPhoto ?
    <Badge variant="success">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            Uploaded
          </Badge> :

    <Badge variant="warning">
            <AlertCircleIcon className="w-3 h-3 mr-1" />
            Missing
          </Badge>

  },
  {
    key: 'documentStatus',
    header: 'Documents',
    render: (row: Student) => {
      const uploaded = getUploadedDocuments(row).length;
      const total = row.documents.length;
      const allUploaded = uploaded === total;

      return (
        <div className="flex items-center gap-2">
            {allUploaded ?
          <Badge variant="success">
                <CheckCircleIcon className="w-3 h-3 mr-1" />
                Complete
              </Badge> :

          <Badge variant="warning">
                {uploaded}/{total} Uploaded
              </Badge>
          }
          </div>);

    }
  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: Student) =>
    <div className="flex gap-2">
          <Button
        variant="outline"
        size="sm"
        onClick={() => handleOpenPhotoPanel(row)}>

            <CameraIcon className="w-4 h-4 mr-1" />
            Photo
          </Button>
          <Button
        variant="outline"
        size="sm"
        onClick={() => handleOpenDocumentPanel(row)}>

            <FileTextIcon className="w-4 h-4 mr-1" />
            Documents
          </Button>
        </div>

  }];


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upload Student Media</h1>
        <p className="text-sm text-gray-500">
          Search for students and manage their photos and documents
        </p>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <SearchIcon className="w-5 h-5 text-blue-600" />
          Search Students
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Input
            label="GR Number"
            placeholder="Enter GR No..."
            value={searchFilters.grNo}
            onChange={(e) => handleFilterChange('grNo', e.target.value)} />

          <Input
            label="SU ID"
            placeholder="Enter SU ID..."
            value={searchFilters.suId}
            onChange={(e) => handleFilterChange('suId', e.target.value)} />

          <Input
            label="First Name"
            placeholder="Enter first name..."
            value={searchFilters.firstName}
            onChange={(e) => handleFilterChange('firstName', e.target.value)} />

          <Input
            label="Last Name"
            placeholder="Enter last name..."
            value={searchFilters.lastName}
            onChange={(e) => handleFilterChange('lastName', e.target.value)} />

          <Select
            label="Class"
            value={searchFilters.class}
            onChange={(e) => handleFilterChange('class', e.target.value)}
            options={[
            { value: '', label: 'All Classes' },
            { value: '8', label: 'Class 8' },
            { value: '9', label: 'Class 9' },
            { value: '10', label: 'Class 10' },
            { value: '11', label: 'Class 11' },
            { value: '12', label: 'Class 12' }]
            } />

          <Select
            label="Section"
            value={searchFilters.section}
            onChange={(e) => handleFilterChange('section', e.target.value)}
            options={[
            { value: '', label: 'All Sections' },
            { value: 'A', label: 'Section A' },
            { value: 'B', label: 'Section B' },
            { value: 'C', label: 'Section C' },
            { value: 'D', label: 'Section D' }]
            } />

          <Select
            label="Department"
            value={searchFilters.department}
            onChange={(e) => handleFilterChange('department', e.target.value)}
            options={[
            { value: '', label: 'All Departments' },
            { value: 'Science', label: 'Science' },
            { value: 'Commerce', label: 'Commerce' },
            { value: 'Arts', label: 'Arts' }]
            } />

        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCwIcon className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button variant="primary" onClick={handleSearch}>
            <SearchIcon className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </Card>

      {hasSearched &&
      <Card className="p-0">
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">
                Search Results ({searchResults.length} students found)
              </h3>
            </div>
          </div>

          {searchResults.length > 0 ?
        <Table columns={columns} data={searchResults} /> :

        <div className="p-12 text-center">
              <UserIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Students Found
              </h3>
              <p className="text-sm text-gray-500">
                Try adjusting your search filters to find students
              </p>
            </div>
        }
        </Card>
      }

      {!hasSearched &&
      <Card className="p-12 text-center">
          <SearchIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Search for Students
          </h3>
          <p className="text-sm text-gray-500">
            Use the search filters above to find students and manage their photos
            and documents
          </p>
        </Card>
      }

      {activePanel === 'photo' && selectedStudent &&
      <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Upload Photo</h2>
                <p className="text-sm text-gray-500">
                  {selectedStudent.firstName} {selectedStudent.lastName} (
                  {selectedStudent.grNo})
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleClosePanel}>
                <XIcon className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div
                className={`w-20 h-20 rounded-full flex items-center justify-center ${
                selectedStudent.hasPhoto ?
                'bg-gradient-to-br from-blue-500 to-blue-600 text-white' :
                'bg-gray-200'}`
                }>

                  {selectedStudent.hasPhoto ?
                <span className="font-bold text-2xl">
                      {selectedStudent.firstName.charAt(0)}
                      {selectedStudent.lastName.charAt(0)}
                    </span> :

                <UserIcon className="w-10 h-10 text-gray-400" />
                }
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Class {selectedStudent.class}-{selectedStudent.section} ·{' '}
                    {selectedStudent.department}
                  </p>
                  {selectedStudent.hasPhoto ?
                <Badge variant="success" className="mt-2">
                      <CheckCircleIcon className="w-3 h-3 mr-1" />
                      Photo Uploaded
                    </Badge> :

                <Badge variant="warning" className="mt-2">
                      <AlertCircleIcon className="w-3 h-3 mr-1" />
                      No Photo
                    </Badge>
                }
                </div>
              </div>

              {selectedStudent.photoUploadedAt &&
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 text-blue-800">
                    <ClockIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Last Upload</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    {selectedStudent.photoUploadedAt}
                  </p>
                </div>
            }

              <div>
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
                  Upload New Photo
                </h4>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-300 transition-colors">
                  <input
                  type="file"
                  id="photo-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange} />

                  <label htmlFor="photo-upload" className="cursor-pointer">
                    {uploadedFile ?
                  <div className="space-y-2">
                        <ImageIcon className="w-10 h-10 text-green-500 mx-auto" />
                        <p className="text-sm font-medium text-gray-900">
                          {uploadedFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(uploadedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div> :

                  <>
                        <UploadCloudIcon className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG up to 5MB (Recommended: 300x300px)
                        </p>
                      </>
                  }
                  </label>
                </div>
              </div>

              {uploadedFile &&
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-700">{uploadedFile.name}</span>
                  </div>
                  <Button
                variant="ghost"
                size="sm"
                onClick={() => setUploadedFile(null)}>

                    <Trash2Icon className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
            }
            </div>

            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-between gap-3">
              <Button variant="outline" onClick={handleClosePanel}>
                Cancel
              </Button>
              <Button variant="primary" disabled={!uploadedFile}>
                <UploadCloudIcon className="w-4 h-4 mr-2" />
                Upload Photo
              </Button>
            </div>
          </div>
        </div>
      }

      {activePanel === 'document' && selectedStudent &&
      <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="w-full max-w-2xl bg-white h-full overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Upload Documents
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedStudent.firstName} {selectedStudent.lastName} (
                  {selectedStudent.grNo})
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleClosePanel}>
                <XIcon className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                  {selectedStudent.firstName.charAt(0)}
                  {selectedStudent.lastName.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Class {selectedStudent.class}-{selectedStudent.section} ·{' '}
                    {selectedStudent.department}
                  </p>
                </div>
                <div>
                  <Badge
                  variant={
                  getMissingDocuments(selectedStudent).length === 0 ?
                  'success' :
                  'warning'
                  }>

                    {getUploadedDocuments(selectedStudent).length}/
                    {selectedStudent.documents.length} Documents
                  </Badge>
                </div>
              </div>

              {getMissingDocuments(selectedStudent).length > 0 &&
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <div className="flex items-center gap-2 text-amber-800 mb-2">
                    <AlertCircleIcon className="w-4 h-4" />
                    <span className="text-sm font-bold">Missing Documents</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {getMissingDocuments(selectedStudent).map((doc) =>
                <Badge key={doc.key} variant="warning">
                        {doc.name}
                      </Badge>
                )}
                  </div>
                </div>
            }

              <div>
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
                  Document Status
                </h4>
                <div className="space-y-2">
                  {selectedStudent.documents.map((doc) =>
                <div
                  key={doc.key}
                  className={`p-3 rounded-lg border flex items-center justify-between ${
                  doc.uploaded ?
                  'bg-green-50 border-green-200' :
                  'bg-gray-50 border-gray-200'}`
                  }>

                      <div className="flex items-center gap-3">
                        <FileIcon
                      className={`w-5 h-5 ${
                      doc.uploaded ? 'text-green-600' : 'text-gray-400'}`
                      } />

                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            {doc.name}
                          </span>
                          {doc.uploadedDate &&
                      <p className="text-xs text-gray-500">
                              Uploaded: {doc.uploadedDate}
                            </p>
                      }
                        </div>
                      </div>
                      {doc.uploaded ?
                  <CheckCircleIcon className="w-5 h-5 text-green-600" /> :

                  <AlertCircleIcon className="w-5 h-5 text-amber-500" />
                  }
                    </div>
                )}
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
                  Upload New Document
                </h4>

                <div className="space-y-4">
                  <Select
                  label="Select Document Type"
                  value={selectedDocumentType}
                  onChange={(e) => setSelectedDocumentType(e.target.value)}
                  options={[
                  { value: '', label: 'Choose document type...' },
                  ...selectedStudent.documents.map((doc) => ({
                    value: doc.key,
                    label: `${doc.name}${doc.uploaded ? ' (Replace)' : ''}`
                  }))]
                  } />


                  {selectedDocumentType &&
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-300 transition-colors">
                      <input
                    type="file"
                    id="doc-upload"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange} />

                      <label htmlFor="doc-upload" className="cursor-pointer">
                        {uploadedFile ?
                    <div className="space-y-2">
                            <FileTextIcon className="w-10 h-10 text-green-500 mx-auto" />
                            <p className="text-sm font-medium text-gray-900">
                              {uploadedFile.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(uploadedFile.size / 1024).toFixed(2)} KB
                            </p>
                          </div> :

                    <>
                            <UploadCloudIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Click to upload
                            </p>
                            <p className="text-xs text-gray-500">
                              PDF, PNG, JPG up to 5MB
                            </p>
                          </>
                    }
                      </label>
                    </div>
                }

                  {uploadedFile && selectedDocumentType &&
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileTextIcon className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-700">
                            {uploadedFile.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Document:{' '}
                            {
                        selectedStudent.documents.find(
                          (d) => d.key === selectedDocumentType
                        )?.name
                        }
                          </p>
                        </div>
                      </div>
                      <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUploadedFile(null)}>

                        <Trash2Icon className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                }
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-between gap-3">
              <Button variant="outline" onClick={handleClosePanel}>
                Cancel
              </Button>
              <Button
              variant="primary"
              disabled={!uploadedFile || !selectedDocumentType}>

                <UploadCloudIcon className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}