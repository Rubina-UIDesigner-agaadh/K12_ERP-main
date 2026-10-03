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
  DownloadIcon,
  EditIcon,
  Trash2Icon,
  SearchIcon,
  PaperclipIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  BookOpenIcon,
  FileTextIcon,
  BellIcon,
  ChevronRightIcon,
  XIcon,
  BookmarkIcon,
  ClipboardListIcon } from
'lucide-react';
interface WorkItem {
  id: number;
  title: string;
  subject: string;
  class: string;
  section: string;
  dueDate: string;
  assignedDate: string;
  teacher: string;
  status: 'Assigned' | 'Submitted' | 'Evaluated';
  totalStudents: number;
  submitted: number;
  evaluated: number;
  hasAttachment: boolean;
  description: string;
}
const assignmentsData: WorkItem[] = [
{
  id: 1,
  title: 'Science Project — Solar System Model',
  subject: 'Science',
  class: 'Class 5',
  section: 'A',
  dueDate: '05 Mar 2026',
  assignedDate: '20 Feb 2026',
  teacher: 'Ms. Anita Verma',
  status: 'Assigned',
  totalStudents: 32,
  submitted: 0,
  evaluated: 0,
  hasAttachment: true,
  description: 'Build a 3D model of the solar system with labeled planets.'
},
{
  id: 2,
  title: 'History Essay — Freedom Struggle',
  subject: 'Social Studies',
  class: 'Class 7',
  section: 'B',
  dueDate: '28 Feb 2026',
  assignedDate: '21 Feb 2026',
  teacher: 'Mr. Suresh Kumar',
  status: 'Submitted',
  totalStudents: 30,
  submitted: 27,
  evaluated: 0,
  hasAttachment: false,
  description:
  "Write a 500-word essay on the role of non-violence in India's freedom struggle."
},
{
  id: 3,
  title: 'Maths Problem Set — Algebra',
  subject: 'Mathematics',
  class: 'Class 8',
  section: 'A',
  dueDate: '24 Feb 2026',
  assignedDate: '22 Feb 2026',
  teacher: 'Mr. Rajesh Patel',
  status: 'Evaluated',
  totalStudents: 31,
  submitted: 31,
  evaluated: 29,
  hasAttachment: true,
  description: 'Solve all 25 problems from Chapter 6 — Linear Equations.'
},
{
  id: 4,
  title: 'English Creative Writing — Short Story',
  subject: 'English',
  class: 'Class 6',
  section: 'A',
  dueDate: '01 Mar 2026',
  assignedDate: '25 Feb 2026',
  teacher: 'Ms. Priya Sharma',
  status: 'Assigned',
  totalStudents: 28,
  submitted: 0,
  evaluated: 0,
  hasAttachment: false,
  description:
  'Write a short story of 300 words on the theme "A Rainy Day Adventure".'
}];

const homeworkData: WorkItem[] = [
{
  id: 5,
  title: 'Addition & Subtraction Worksheet',
  subject: 'Mathematics',
  class: 'Class 2',
  section: 'A',
  dueDate: '27 Feb 2026',
  assignedDate: '25 Feb 2026',
  teacher: 'Mr. Rajesh Patel',
  status: 'Assigned',
  totalStudents: 32,
  submitted: 0,
  evaluated: 0,
  hasAttachment: true,
  description: 'Complete exercises 1–20 from the worksheet provided.'
},
{
  id: 6,
  title: 'Write 10 sentences using new vocabulary',
  subject: 'English',
  class: 'Class 3',
  section: 'B',
  dueDate: '26 Feb 2026',
  assignedDate: '24 Feb 2026',
  teacher: 'Ms. Priya Sharma',
  status: 'Submitted',
  totalStudents: 30,
  submitted: 28,
  evaluated: 0,
  hasAttachment: false,
  description: 'Use the 10 vocabulary words from Chapter 4 in sentences.'
},
{
  id: 7,
  title: 'Draw and label parts of a plant',
  subject: 'Science',
  class: 'Class 3',
  section: 'A',
  dueDate: '24 Feb 2026',
  assignedDate: '22 Feb 2026',
  teacher: 'Ms. Anita Verma',
  status: 'Evaluated',
  totalStudents: 31,
  submitted: 31,
  evaluated: 29,
  hasAttachment: true,
  description:
  'Draw a plant and label its root, stem, leaves, flower and fruit.'
},
{
  id: 8,
  title: 'Hindi paragraph writing — My School',
  subject: 'Hindi',
  class: 'Class 2',
  section: 'B',
  dueDate: '25 Feb 2026',
  assignedDate: '23 Feb 2026',
  teacher: 'Ms. Kavita Nair',
  status: 'Submitted',
  totalStudents: 30,
  submitted: 25,
  evaluated: 0,
  hasAttachment: false,
  description:
  'Write a paragraph of 5–7 sentences about your school in Hindi.'
}];

const submissionData = [
{
  id: 1,
  student: 'Aarav Sharma',
  rollNo: '01',
  submittedOn: '25 Feb 2026, 18:30',
  status: 'Evaluated',
  marks: '9/10',
  remarks: 'Excellent work',
  lateSubmission: false
},
{
  id: 2,
  student: 'Priya Patel',
  rollNo: '02',
  submittedOn: '25 Feb 2026, 20:15',
  status: 'Evaluated',
  marks: '7/10',
  remarks: 'Good effort',
  lateSubmission: false
},
{
  id: 3,
  student: 'Rohan Mehta',
  rollNo: '03',
  submittedOn: '26 Feb 2026, 08:00',
  status: 'Submitted',
  marks: '—',
  remarks: '',
  lateSubmission: true
},
{
  id: 4,
  student: 'Sneha Joshi',
  rollNo: '04',
  submittedOn: '25 Feb 2026, 17:45',
  status: 'Evaluated',
  marks: '10/10',
  remarks: 'Perfect!',
  lateSubmission: false
},
{
  id: 5,
  student: 'Karan Verma',
  rollNo: '05',
  submittedOn: '—',
  status: 'Not Submitted',
  marks: '—',
  remarks: '',
  lateSubmission: false
}];

const auditData = [
{
  id: 1,
  action: 'Created',
  user: 'Ms. Anita Verma',
  dateTime: '22 Feb 2026, 09:00',
  details: 'Draw and label parts of a plant — Class 3-A'
},
{
  id: 2,
  action: 'Attachment Uploaded',
  user: 'Ms. Anita Verma',
  dateTime: '22 Feb 2026, 09:05',
  details: 'plant_worksheet.pdf attached'
},
{
  id: 3,
  action: 'Submission Received',
  user: 'System',
  dateTime: '25 Feb 2026, 16:30',
  details: 'Ananya Singh submitted'
},
{
  id: 4,
  action: 'Evaluation Done',
  user: 'Ms. Anita Verma',
  dateTime: '25 Feb 2026, 22:00',
  details: '29 students evaluated, avg marks 8.6/10'
}];

interface ActionsPanelProps {
  item: WorkItem;
  onClose: () => void;
  onTrack: () => void;
}
function ActionsPanel({ item, onClose, onTrack }: ActionsPanelProps) {
  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl border-l border-gray-200 z-50 flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">Actions</h3>
          <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[200px]">
            {item.title}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">

          <XIcon className="w-4 h-4 text-gray-500" />
        </button>
      </div>
      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="p-3 bg-gray-50 rounded-lg mb-4">
          <p className="text-xs text-gray-500 mb-1">Status</p>
          <Badge
            variant={
            item.status === 'Evaluated' ?
            'success' :
            item.status === 'Submitted' ?
            'primary' :
            'warning'
            }>

            {item.status}
          </Badge>
          <div className="mt-2 flex gap-3 text-xs text-gray-600">
            <span>
              {item.submitted}/{item.totalStudents} submitted
            </span>
            <span>{item.evaluated} evaluated</span>
          </div>
        </div>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 text-left transition-colors group">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <EditIcon className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">Edit</p>
            <p className="text-xs text-gray-500">Modify details or due date</p>
          </div>
          <ChevronRightIcon className="w-4 h-4 text-gray-400 ml-auto" />
        </button>
        <button
          onClick={onTrack}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-50 text-left transition-colors group">

          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
            <FileTextIcon className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">
              Track Submissions
            </p>
            <p className="text-xs text-gray-500">
              View student submission status
            </p>
          </div>
          <ChevronRightIcon className="w-4 h-4 text-gray-400 ml-auto" />
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-yellow-50 text-left transition-colors group">
          <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
            <BellIcon className="w-4 h-4 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">Send Reminder</p>
            <p className="text-xs text-gray-500">Notify pending students</p>
          </div>
          <ChevronRightIcon className="w-4 h-4 text-gray-400 ml-auto" />
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-50 text-left transition-colors group">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
            <DownloadIcon className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">Download</p>
            <p className="text-xs text-gray-500">Export submission report</p>
          </div>
          <ChevronRightIcon className="w-4 h-4 text-gray-400 ml-auto" />
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-left transition-colors group">
          <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
            <Trash2Icon className="w-4 h-4 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 text-red-700">
              Delete
            </p>
            <p className="text-xs text-gray-500">
              Permanently remove this item
            </p>
          </div>
          <ChevronRightIcon className="w-4 h-4 text-gray-400 ml-auto" />
        </button>
      </div>
    </div>);

}
interface SectionPanelProps {
  type: 'assignment' | 'homework';
  data: WorkItem[];
  label: string;
}
function SectionPanel({ type, data, label }: SectionPanelProps) {
  const [innerTab, setInnerTab] = useState('list');
  const [filterClass, setFilterClass] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTitle, setSearchTitle] = useState('');
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null);
  const [actionsPanelItem, setActionsPanelItem] = useState<WorkItem | null>(
    null
  );
  const filtered = data.filter((h) => {
    if (filterClass && !h.class.toLowerCase().includes(filterClass))
    return false;
    if (filterSubject && h.subject !== filterSubject) return false;
    if (filterStatus && h.status !== filterStatus) return false;
    if (
    searchTitle &&
    !h.title.toLowerCase().includes(searchTitle.toLowerCase()))

    return false;
    return true;
  });
  const assignedCount = data.filter((h) => h.status === 'Assigned').length;
  const submittedCount = data.filter((h) => h.status === 'Submitted').length;
  const evaluatedCount = data.filter((h) => h.status === 'Evaluated').length;
  return (
    <>
      {actionsPanelItem &&
      <>
          <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setActionsPanelItem(null)} />

          <ActionsPanel
          item={actionsPanelItem}
          onClose={() => setActionsPanelItem(null)}
          onTrack={() => {
            setSelectedItem(actionsPanelItem);
            setInnerTab('submissions');
            setActionsPanelItem(null);
          }} />

        </>
      }

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 flex items-center gap-3">
          <ClockIcon className="w-4 h-4 text-yellow-600 flex-shrink-0" />
          <div>
            <p className="text-lg font-bold text-yellow-700">{assignedCount}</p>
            <p className="text-xs text-yellow-600">Assigned</p>
          </div>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 flex items-center gap-3">
          <FileTextIcon className="w-4 h-4 text-indigo-600 flex-shrink-0" />
          <div>
            <p className="text-lg font-bold text-indigo-700">
              {submittedCount}
            </p>
            <p className="text-xs text-indigo-600">Submitted</p>
          </div>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex items-center gap-3">
          <CheckCircleIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
          <div>
            <p className="text-lg font-bold text-green-700">{evaluatedCount}</p>
            <p className="text-xs text-green-600">Evaluated</p>
          </div>
        </div>
      </div>

      <Card noPadding>
        <Tabs value={innerTab} onValueChange={setInnerTab}>
          <div className="px-5 pt-4">
            <TabsList>
              <TabsTrigger value="list">
                <BookOpenIcon className="w-3.5 h-3.5" /> List
              </TabsTrigger>
              <TabsTrigger value="create">
                <EditIcon className="w-3.5 h-3.5" /> Create / Edit
              </TabsTrigger>
              <TabsTrigger value="submissions">
                <FileTextIcon className="w-3.5 h-3.5" /> Submission Tracking
              </TabsTrigger>
              <TabsTrigger value="audit">
                <ClockIcon className="w-3.5 h-3.5" /> Audit Log
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="list" className="p-5">
            <div className="flex flex-wrap gap-3 items-end mb-4">
              <Input
                label="Search"
                placeholder="Search by title..."
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                className="w-52" />

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
                },
                {
                  value: 'class 5',
                  label: 'Class 5'
                },
                {
                  value: 'class 6',
                  label: 'Class 6'
                },
                {
                  value: 'class 7',
                  label: 'Class 7'
                },
                {
                  value: 'class 8',
                  label: 'Class 8'
                }]
                }
                value={filterClass}
                onChange={setFilterClass}
                className="w-36" />

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
                label="Status"
                options={[
                {
                  value: '',
                  label: 'All Status'
                },
                {
                  value: 'Assigned',
                  label: 'Assigned'
                },
                {
                  value: 'Submitted',
                  label: 'Submitted'
                },
                {
                  value: 'Evaluated',
                  label: 'Evaluated'
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
                <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {row.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {row.description.slice(0, 55)}...
                      </p>
                    </div>

              },
              {
                key: 'class',
                header: 'Class / Subject',
                render: (row) =>
                <div>
                      <p className="text-sm font-medium text-gray-800">
                        {row.class}-{row.section}
                      </p>
                      <p className="text-xs text-gray-500">{row.subject}</p>
                    </div>

              },
              {
                key: 'teacher',
                header: 'Teacher',
                render: (row) =>
                <span className="text-sm text-gray-700">{row.teacher}</span>

              },
              {
                key: 'dueDate',
                header: 'Due Date',
                render: (row) =>
                <div>
                      <p className="text-sm text-gray-800">{row.dueDate}</p>
                      <p className="text-xs text-gray-400">
                        Assigned: {row.assignedDate}
                      </p>
                    </div>

              },
              {
                key: 'status',
                header: 'Status',
                render: (row) =>
                <Badge
                  variant={
                  row.status === 'Evaluated' ?
                  'success' :
                  row.status === 'Submitted' ?
                  'primary' :
                  'warning'
                  }>

                      {row.status}
                    </Badge>

              },
              {
                key: 'submissions',
                header: 'Submissions',
                render: (row) =>
                <div className="text-sm">
                      <span className="font-medium text-gray-800">
                        {row.submitted}/{row.totalStudents}
                      </span>
                      <div className="w-20 bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                      className="h-1.5 rounded-full bg-blue-500"
                      style={{
                        width: `${Math.round(row.submitted / row.totalStudents * 100)}%`
                      }} />

                      </div>
                    </div>

              },
              {
                key: 'actions',
                header: 'Actions',
                render: (row) =>
                <Button
                  variant="outline"
                  size="xs"
                  rightIcon={<ChevronRightIcon className="w-3 h-3" />}
                  onClick={() => setActionsPanelItem(row)}>

                      Actions
                    </Button>

              }]
              }
              data={filtered} />

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">
                Showing {filtered.length} of {data.length} {label.toLowerCase()}
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

          <TabsContent value="create" className="p-5">
            <div className="max-w-3xl space-y-5">
              <h3 className="text-base font-semibold text-gray-900">
                Create New {label}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={`${label} Title`}
                  placeholder={`e.g. ${type === 'assignment' ? 'Science Project — Solar System' : 'Addition & Subtraction Worksheet'}`}
                  className="md:col-span-2" />

                <Select
                  label="Class"
                  options={[
                  {
                    value: '',
                    label: 'Select Class'
                  },
                  ...Array.from(
                    {
                      length: 12
                    },
                    (_, i) => ({
                      value: `class-${i + 1}`,
                      label: `Class ${i + 1}`
                    })
                  )]
                  }
                  placeholder="Select Class" />

                <Select
                  label="Section"
                  options={[
                  {
                    value: '',
                    label: 'Select Section'
                  },
                  {
                    value: 'a',
                    label: 'Section A'
                  },
                  {
                    value: 'b',
                    label: 'Section B'
                  },
                  {
                    value: 'c',
                    label: 'Section C'
                  }]
                  }
                  placeholder="Select Section" />

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

                <Input label="Due Date" type="date" />
                {type === 'assignment' &&
                <Select
                  label="Assignment Type"
                  options={[
                  {
                    value: '',
                    label: 'Select Type'
                  },
                  {
                    value: 'project',
                    label: 'Project'
                  },
                  {
                    value: 'worksheet',
                    label: 'Worksheet'
                  },
                  {
                    value: 'essay',
                    label: 'Essay'
                  },
                  {
                    value: 'presentation',
                    label: 'Presentation'
                  },
                  {
                    value: 'lab-report',
                    label: 'Lab Report'
                  }]
                  }
                  placeholder="Select Type" />

                }
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description / Instructions
                  </label>
                  <textarea
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Describe the task in detail..." />

                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Attach Document
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <PaperclipIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PDF, DOC, DOCX, JPG, PNG up to 10MB
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="primary">Create {label}</Button>
                <Button variant="outline" onClick={() => setInnerTab('list')}>
                  Cancel
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="submissions" className="p-5">
            {selectedItem &&
            <div className="mb-5 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {selectedItem.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {selectedItem.class}-{selectedItem.section} ·{' '}
                      {selectedItem.subject} · Due: {selectedItem.dueDate}
                    </p>
                  </div>
                  <div className="flex gap-3 text-center">
                    <div className="bg-white rounded-lg px-3 py-2 border border-blue-200">
                      <p className="text-lg font-bold text-blue-700">
                        {selectedItem.totalStudents}
                      </p>
                      <p className="text-xs text-gray-500">Total</p>
                    </div>
                    <div className="bg-white rounded-lg px-3 py-2 border border-blue-200">
                      <p className="text-lg font-bold text-green-700">
                        {selectedItem.submitted}
                      </p>
                      <p className="text-xs text-gray-500">Submitted</p>
                    </div>
                    <div className="bg-white rounded-lg px-3 py-2 border border-blue-200">
                      <p className="text-lg font-bold text-purple-700">
                        {selectedItem.evaluated}
                      </p>
                      <p className="text-xs text-gray-500">Evaluated</p>
                    </div>
                    <div className="bg-white rounded-lg px-3 py-2 border border-blue-200">
                      <p className="text-lg font-bold text-red-700">
                        {selectedItem.totalStudents - selectedItem.submitted}
                      </p>
                      <p className="text-xs text-gray-500">Pending</p>
                    </div>
                  </div>
                </div>
              </div>
            }
            {!selectedItem &&
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
                Select a {label.toLowerCase()} from the List tab to view its
                submissions.
              </div>
            }
            <Table
              columns={[
              {
                key: 'rollNo',
                header: 'Roll No'
              },
              {
                key: 'student',
                header: 'Student',
                render: (row) =>
                <span className="font-medium text-gray-900">
                      {row.student}
                    </span>

              },
              {
                key: 'submittedOn',
                header: 'Submitted On',
                render: (row) =>
                <span className="text-sm text-gray-600">
                      {row.submittedOn}
                    </span>

              },
              {
                key: 'lateSubmission',
                header: 'Late',
                render: (row) =>
                row.lateSubmission ?
                <Badge variant="warning">
                        <AlertCircleIcon className="w-3 h-3 mr-1" />
                        Late
                      </Badge> :

                <span className="text-gray-400 text-xs">—</span>

              },
              {
                key: 'status',
                header: 'Status',
                render: (row) =>
                <Badge
                  variant={
                  row.status === 'Evaluated' ?
                  'success' :
                  row.status === 'Submitted' ?
                  'primary' :
                  'danger'
                  }>

                      {row.status}
                    </Badge>

              },
              {
                key: 'marks',
                header: 'Marks',
                render: (row) =>
                <span className="font-medium text-gray-800">
                      {row.marks}
                    </span>

              },
              {
                key: 'remarks',
                header: 'Remarks',
                render: (row) =>
                <span className="text-xs text-gray-500">
                      {row.remarks || '—'}
                    </span>

              },
              {
                key: 'actions',
                header: 'Actions',
                render: (row) =>
                <div className="flex gap-1">
                      {row.status === 'Submitted' &&
                  <Button variant="primary" size="xs">
                          Evaluate
                        </Button>
                  }
                      {row.status === 'Evaluated' &&
                  <Button
                    variant="ghost"
                    size="xs"
                    leftIcon={<EditIcon className="w-3 h-3" />}>

                          Edit
                        </Button>
                  }
                    </div>

              }]
              }
              data={submissionData} />

            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<DownloadIcon className="w-4 h-4" />}>

                Export Submission List
              </Button>
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
    </>);

}
export function HomeworkAssignments() {
  const [topTab, setTopTab] = useState('assignments');
  const totalAssignments = assignmentsData.length;
  const totalHomework = homeworkData.length;
  const totalEvaluated = [...assignmentsData, ...homeworkData].filter(
    (h) => h.status === 'Evaluated'
  ).length;
  const totalSubmitted = [...assignmentsData, ...homeworkData].filter(
    (h) => h.status === 'Submitted'
  ).length;
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Homework & Assignments
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage assignments and homework separately — create, track
            submissions and evaluate
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<DownloadIcon className="w-4 h-4" />}>

          Export Submissions
        </Button>
      </div>

      {/* Combined Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <ClipboardListIcon className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
              Assignments
            </span>
          </div>
          <p className="text-2xl font-bold text-blue-700">{totalAssignments}</p>
          <p className="text-xs text-blue-500 mt-1">Active this month</p>
        </div>
        <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <BookmarkIcon className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-medium text-purple-600 uppercase tracking-wide">
              Homework
            </span>
          </div>
          <p className="text-2xl font-bold text-purple-700">{totalHomework}</p>
          <p className="text-xs text-purple-500 mt-1">Active this month</p>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <FileTextIcon className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
              Submitted
            </span>
          </div>
          <p className="text-2xl font-bold text-indigo-700">{totalSubmitted}</p>
          <p className="text-xs text-indigo-500 mt-1">Pending evaluation</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircleIcon className="w-4 h-4 text-green-600" />
            <span className="text-xs font-medium text-green-600 uppercase tracking-wide">
              Evaluated
            </span>
          </div>
          <p className="text-2xl font-bold text-green-700">{totalEvaluated}</p>
          <p className="text-xs text-green-500 mt-1">Fully graded</p>
        </div>
      </div>

      {/* Top-level section tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-1">
          <button
            onClick={() => setTopTab('assignments')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${topTab === 'assignments' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>

            <ClipboardListIcon className="w-4 h-4" />
            Assignments
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${topTab === 'assignments' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>

              {totalAssignments}
            </span>
          </button>
          <button
            onClick={() => setTopTab('homework')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${topTab === 'homework' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>

            <BookmarkIcon className="w-4 h-4" />
            Homework
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${topTab === 'homework' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>

              {totalHomework}
            </span>
          </button>
        </div>
      </div>

      {topTab === 'assignments' &&
      <SectionPanel
        type="assignment"
        data={assignmentsData}
        label="Assignment" />

      }
      {topTab === 'homework' &&
      <SectionPanel type="homework" data={homeworkData} label="Homework" />
      }
    </div>);

}