import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent } from
'../../../components/ui/Tabs';
import {
  UploadIcon,
  DownloadIcon,
  EditIcon,
  Trash2Icon,
  SearchIcon,
  ArchiveIcon,
  FileTextIcon,
  ImageIcon,
  VideoIcon,
  FileIcon,
  BookOpenIcon,
  ShieldIcon,
  ClockIcon } from
'lucide-react';
interface StudyMaterialItem {
  id: number;
  title: string;
  subject: string;
  class: string;
  fileType: 'PDF' | 'DOC' | 'PPT' | 'Image' | 'Video';
  fileSize: string;
  uploadedBy: string;
  uploadedOn: string;
  status: 'Active' | 'Archived';
  accessRole: string;
  downloads: number;
}
const materialsData: StudyMaterialItem[] = [
{
  id: 1,
  title: 'Chapter 1 – Introduction to Numbers',
  subject: 'Mathematics',
  class: 'Class 2',
  fileType: 'PDF',
  fileSize: '1.2 MB',
  uploadedBy: 'Mr. Rajesh Patel',
  uploadedOn: '10 Feb 2026',
  status: 'Active',
  accessRole: 'Students & Parents',
  downloads: 45
},
{
  id: 2,
  title: 'English Grammar – Parts of Speech',
  subject: 'English',
  class: 'Class 3',
  fileType: 'DOC',
  fileSize: '856 KB',
  uploadedBy: 'Ms. Priya Sharma',
  uploadedOn: '12 Feb 2026',
  status: 'Active',
  accessRole: 'Students Only',
  downloads: 38
},
{
  id: 3,
  title: 'Plant Life Cycle – Presentation',
  subject: 'Science',
  class: 'Class 3',
  fileType: 'PPT',
  fileSize: '4.5 MB',
  uploadedBy: 'Ms. Anita Verma',
  uploadedOn: '15 Feb 2026',
  status: 'Active',
  accessRole: 'Teachers Only',
  downloads: 12
},
{
  id: 4,
  title: 'Map of India – Political',
  subject: 'Social Studies',
  class: 'Class 4',
  fileType: 'Image',
  fileSize: '2.1 MB',
  uploadedBy: 'Mr. Suresh Kumar',
  uploadedOn: '18 Feb 2026',
  status: 'Active',
  accessRole: 'Students & Parents',
  downloads: 62
},
{
  id: 5,
  title: 'Hindi Vyakaran – Sangya & Sarvanam',
  subject: 'Hindi',
  class: 'Class 2',
  fileType: 'PDF',
  fileSize: '980 KB',
  uploadedBy: 'Ms. Kavita Nair',
  uploadedOn: '20 Feb 2026',
  status: 'Active',
  accessRole: 'Students & Parents',
  downloads: 29
},
{
  id: 6,
  title: 'Multiplication Tables Video',
  subject: 'Mathematics',
  class: 'Class 3',
  fileType: 'Video',
  fileSize: '45 MB',
  uploadedBy: 'Mr. Rajesh Patel',
  uploadedOn: '22 Feb 2026',
  status: 'Active',
  accessRole: 'Students Only',
  downloads: 88
},
{
  id: 7,
  title: 'Chapter 5 – Fractions (Old)',
  subject: 'Mathematics',
  class: 'Class 3',
  fileType: 'PDF',
  fileSize: '1.5 MB',
  uploadedBy: 'Mr. Rajesh Patel',
  uploadedOn: '05 Jan 2026',
  status: 'Archived',
  accessRole: 'Teachers Only',
  downloads: 15
},
{
  id: 8,
  title: 'Science Lab Safety Rules',
  subject: 'Science',
  class: 'Class 4',
  fileType: 'PDF',
  fileSize: '650 KB',
  uploadedBy: 'Ms. Anita Verma',
  uploadedOn: '08 Feb 2026',
  status: 'Active',
  accessRole: 'Students & Parents',
  downloads: 55
}];

const auditData = [
{
  id: 1,
  action: 'Material Uploaded',
  user: 'Mr. Rajesh Patel',
  dateTime: '22 Feb 2026, 10:00',
  details: 'Multiplication Tables Video — Class 3 Mathematics'
},
{
  id: 2,
  action: 'Material Downloaded',
  user: 'Aarav Sharma (Student)',
  dateTime: '22 Feb 2026, 14:30',
  details: 'Chapter 1 – Introduction to Numbers'
},
{
  id: 3,
  action: 'Material Edited',
  user: 'Ms. Priya Sharma',
  dateTime: '20 Feb 2026, 09:15',
  details: 'Updated title and class tag for English Grammar doc'
},
{
  id: 4,
  action: 'Material Archived',
  user: 'Mr. Rajesh Patel',
  dateTime: '15 Feb 2026, 11:00',
  details: 'Chapter 5 – Fractions (Old) archived'
},
{
  id: 5,
  action: 'Access Role Changed',
  user: 'Admin',
  dateTime: '18 Feb 2026, 16:00',
  details: 'Plant Life Cycle PPT changed to Teachers Only'
}];

const fileTypeIcon = (type: string) => {
  switch (type) {
    case 'PDF':
      return <FileTextIcon className="w-4 h-4 text-red-500" />;
    case 'DOC':
      return <FileTextIcon className="w-4 h-4 text-blue-500" />;
    case 'PPT':
      return <FileIcon className="w-4 h-4 text-orange-500" />;
    case 'Image':
      return <ImageIcon className="w-4 h-4 text-green-500" />;
    case 'Video':
      return <VideoIcon className="w-4 h-4 text-purple-500" />;
    default:
      return <FileIcon className="w-4 h-4 text-gray-500" />;
  }
};
export function StudyMaterial() {
  const [filterSubject, setFilterSubject] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterStatus, setFilterStatus] = useState('Active');
  const [searchTitle, setSearchTitle] = useState('');
  const activeCount = materialsData.filter((m) => m.status === 'Active').length;
  const archivedCount = materialsData.filter(
    (m) => m.status === 'Archived'
  ).length;
  const totalDownloads = materialsData.reduce((s, m) => s + m.downloads, 0);
  const filteredMaterials = materialsData.filter((m) => {
    if (filterSubject && m.subject !== filterSubject) return false;
    if (filterClass && !m.class.toLowerCase().includes(filterClass))
    return false;
    if (filterStatus && m.status !== filterStatus) return false;
    if (
    searchTitle &&
    !m.title.toLowerCase().includes(searchTitle.toLowerCase()))

    return false;
    return true;
  });
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Study Material</h1>
          <p className="text-sm text-gray-500 mt-1">
            Upload, manage and share study materials with role-based access
            control
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<UploadIcon className="w-4 h-4" />}>

            Upload Material
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <BookOpenIcon className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
              Total Materials
            </span>
          </div>
          <p className="text-2xl font-bold text-blue-700">
            {materialsData.length}
          </p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <FileTextIcon className="w-4 h-4 text-green-600" />
            <span className="text-xs font-medium text-green-600 uppercase tracking-wide">
              Active
            </span>
          </div>
          <p className="text-2xl font-bold text-green-700">{activeCount}</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <ArchiveIcon className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Archived
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-600">{archivedCount}</p>
        </div>
        <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <DownloadIcon className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-medium text-purple-600 uppercase tracking-wide">
              Total Downloads
            </span>
          </div>
          <p className="text-2xl font-bold text-purple-700">{totalDownloads}</p>
        </div>
      </div>

      {/* Main Content */}
      <Card noPadding>
        <Tabs defaultValue="materials">
          <div className="px-5 pt-4">
            <TabsList>
              <TabsTrigger value="materials">
                <BookOpenIcon className="w-3.5 h-3.5" /> Materials Library
              </TabsTrigger>
              <TabsTrigger value="upload">
                <UploadIcon className="w-3.5 h-3.5" /> Upload New
              </TabsTrigger>
              <TabsTrigger value="audit">
                <ClockIcon className="w-3.5 h-3.5" /> Audit Log
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="materials" className="p-5">
            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-end mb-4">
              <Input
                label="Search"
                placeholder="Search by title..."
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                className="w-56" />

              <Select
                label="Subject"
                options={[
                {
                  value: '',
                  label: 'All Subjects'
                },
                {
                  value: 'Mathematics',
                  label: 'Mathematics'
                },
                {
                  value: 'English',
                  label: 'English'
                },
                {
                  value: 'Science',
                  label: 'Science'
                },
                {
                  value: 'Social Studies',
                  label: 'Social Studies'
                },
                {
                  value: 'Hindi',
                  label: 'Hindi'
                }]
                }
                value={filterSubject}
                onChange={setFilterSubject}
                className="w-40" />

              <Select
                label="Class"
                options={[
                {
                  value: '',
                  label: 'All Classes'
                },
                {
                  value: 'class 2',
                  label: 'Class 2'
                },
                {
                  value: 'class 3',
                  label: 'Class 3'
                },
                {
                  value: 'class 4',
                  label: 'Class 4'
                }]
                }
                value={filterClass}
                onChange={setFilterClass}
                className="w-36" />

              <Select
                label="Status"
                options={[
                {
                  value: '',
                  label: 'All Status'
                },
                {
                  value: 'Active',
                  label: 'Active'
                },
                {
                  value: 'Archived',
                  label: 'Archived'
                }]
                }
                value={filterStatus}
                onChange={setFilterStatus}
                className="w-36" />

            </div>

            <Table
              columns={[
              {
                key: 'title',
                header: 'Title',
                render: (row) =>
                <div className="flex items-center gap-2">
                      {fileTypeIcon(row.fileType)}
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {row.title}
                        </p>
                        <p className="text-xs text-gray-400">{row.fileSize}</p>
                      </div>
                    </div>

              },
              {
                key: 'subject',
                header: 'Subject / Class',
                render: (row) =>
                <div>
                      <p className="text-sm font-medium text-gray-800">
                        {row.subject}
                      </p>
                      <p className="text-xs text-gray-500">{row.class}</p>
                    </div>

              },
              {
                key: 'fileType',
                header: 'Type',
                render: (row) =>
                <Badge
                  variant={
                  row.fileType === 'PDF' ?
                  'danger' :
                  row.fileType === 'Video' ?
                  'info' :
                  row.fileType === 'Image' ?
                  'success' :
                  'default'
                  }>

                      {row.fileType}
                    </Badge>

              },
              {
                key: 'accessRole',
                header: 'Access',
                render: (row) =>
                <div className="flex items-center gap-1">
                      <ShieldIcon className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-600">
                        {row.accessRole}
                      </span>
                    </div>

              },
              {
                key: 'uploadedBy',
                header: 'Uploaded By',
                render: (row) =>
                <span className="text-sm text-gray-600">
                      {row.uploadedBy}
                    </span>

              },
              {
                key: 'uploadedOn',
                header: 'Date',
                render: (row) =>
                <span className="text-xs text-gray-500">
                      {row.uploadedOn}
                    </span>

              },
              {
                key: 'downloads',
                header: 'Downloads',
                render: (row) =>
                <span className="font-medium text-gray-700">
                      {row.downloads}
                    </span>

              },
              {
                key: 'status',
                header: 'Status',
                render: (row) =>
                <Badge
                  variant={
                  row.status === 'Active' ? 'success' : 'secondary'
                  }>

                      {row.status}
                    </Badge>

              },
              {
                key: 'actions',
                header: 'Actions',
                render: (row) =>
                <div className="flex gap-1">
                      <Button
                    variant="ghost"
                    size="xs"
                    leftIcon={<DownloadIcon className="w-3 h-3" />}>

                        Download
                      </Button>
                      <Button
                    variant="ghost"
                    size="xs"
                    leftIcon={<EditIcon className="w-3 h-3" />}>

                        Edit
                      </Button>
                      {row.status === 'Active' ?
                  <Button
                    variant="ghost"
                    size="xs"
                    leftIcon={<ArchiveIcon className="w-3 h-3" />}>

                          Archive
                        </Button> :

                  <Button
                    variant="ghost"
                    size="xs"
                    leftIcon={<Trash2Icon className="w-3 h-3" />}
                    className="text-red-500">

                          Delete
                        </Button>
                  }
                    </div>

              }]
              }
              data={filteredMaterials} />


            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">
                Showing 1–{filteredMaterials.length} of {materialsData.length}{' '}
                materials
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
          </TabsContent>

          <TabsContent value="upload" className="p-5">
            <div className="max-w-2xl space-y-5">
              <h3 className="text-base font-semibold text-gray-900">
                Upload New Study Material
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Material Title"
                  placeholder="e.g. Chapter 1 – Introduction to Numbers"
                  className="md:col-span-2" />

                <Select
                  label="Subject"
                  options={[
                  {
                    value: '',
                    label: 'Select Subject'
                  },
                  {
                    value: 'mathematics',
                    label: 'Mathematics'
                  },
                  {
                    value: 'english',
                    label: 'English'
                  },
                  {
                    value: 'science',
                    label: 'Science'
                  },
                  {
                    value: 'social-studies',
                    label: 'Social Studies'
                  },
                  {
                    value: 'hindi',
                    label: 'Hindi'
                  }]
                  }
                  placeholder="Select Subject" />

                <Select
                  label="Class"
                  options={[
                  {
                    value: '',
                    label: 'Select Class'
                  },
                  {
                    value: 'class-1',
                    label: 'Class 1'
                  },
                  {
                    value: 'class-2',
                    label: 'Class 2'
                  },
                  {
                    value: 'class-3',
                    label: 'Class 3'
                  },
                  {
                    value: 'class-4',
                    label: 'Class 4'
                  },
                  {
                    value: 'class-5',
                    label: 'Class 5'
                  }]
                  }
                  placeholder="Select Class" />

                <Select
                  label="Role-based Access"
                  options={[
                  {
                    value: 'all',
                    label: 'Students & Parents'
                  },
                  {
                    value: 'students',
                    label: 'Students Only'
                  },
                  {
                    value: 'teachers',
                    label: 'Teachers Only'
                  },
                  {
                    value: 'admin',
                    label: 'Admin Only'
                  }]
                  }
                  defaultValue="all" />

                <Select
                  label="File Type"
                  options={[
                  {
                    value: 'pdf',
                    label: 'PDF Document'
                  },
                  {
                    value: 'doc',
                    label: 'Word Document'
                  },
                  {
                    value: 'ppt',
                    label: 'PowerPoint'
                  },
                  {
                    value: 'image',
                    label: 'Image'
                  },
                  {
                    value: 'video',
                    label: 'Video'
                  }]
                  }
                  defaultValue="pdf" />

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload File
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <UploadIcon className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-700">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PDF, DOC, DOCX, PPT, JPG, PNG, MP4 up to 100MB
                    </p>
                    <p className="text-xs text-red-500 mt-2">
                      File validation: Only allowed formats will be accepted
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  variant="primary"
                  leftIcon={<UploadIcon className="w-4 h-4" />}>

                  Upload Material
                </Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="audit" className="p-5">
            <Table
              columns={[
              {
                key: 'action',
                header: 'Action',
                render: (row) =>
                <span className="font-medium text-gray-800">
                      {row.action}
                    </span>

              },
              {
                key: 'user',
                header: 'User'
              },
              {
                key: 'dateTime',
                header: 'Date & Time',
                render: (row) =>
                <span className="text-xs text-gray-500">
                      {row.dateTime}
                    </span>

              },
              {
                key: 'details',
                header: 'Details',
                render: (row) =>
                <span className="text-sm text-gray-600">{row.details}</span>

              }]
              }
              data={auditData} />

          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}