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
  PlusIcon,
  SearchIcon,
  FilterIcon,
  DownloadIcon,
  UploadIcon,
  EyeIcon,
  EditIcon,
  Trash2Icon,
  CheckCircleIcon,
  ClockIcon,
  FileTextIcon,
  HistoryIcon,
  SendIcon,
  PaperclipIcon,
  ChevronLeftIcon,
  ChevronRightIcon } from
'lucide-react';
type PlanStatus = 'Draft' | 'Pending' | 'Approved';
interface LessonPlan {
  id: string;
  theme: string;
  class: string;
  section: string;
  teacher: string;
  subject: string;
  weekDate: string;
  status: PlanStatus;
  learningObjective: string;
  materials: string;
  activityPlan: string;
  assessmentMethod: string;
  homework: string;
  parentNote: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  attachments: number;
}
const mockPlans: LessonPlan[] = [
{
  id: 'LP001',
  theme: 'Photosynthesis & Plant Life',
  class: 'Class 6',
  section: 'A',
  teacher: 'Mrs. Priya Sharma',
  subject: 'Science',
  weekDate: '2024-01-15',
  status: 'Approved',
  learningObjective: 'Students will understand the process of photosynthesis',
  materials: 'Charts, lab equipment, worksheets',
  activityPlan: 'Experiment with plants and light',
  assessmentMethod: 'Written test + observation',
  homework: 'Draw and label a plant cell',
  parentNote: 'Please send a small plant from home',
  version: 3,
  createdAt: '2024-01-10',
  updatedAt: '2024-01-13',
  attachments: 2
},
{
  id: 'LP002',
  theme: 'Fractions & Decimals',
  class: 'Class 5',
  section: 'B',
  teacher: 'Mr. Rajesh Kumar',
  subject: 'Mathematics',
  weekDate: '2024-01-15',
  status: 'Pending',
  learningObjective: 'Convert fractions to decimals and vice versa',
  materials: 'Number cards, worksheets, ruler',
  activityPlan: 'Group activity with fraction tiles',
  assessmentMethod: 'Class quiz',
  homework: 'Practice problems 1–20',
  parentNote: 'Revision of multiplication tables needed',
  version: 1,
  createdAt: '2024-01-12',
  updatedAt: '2024-01-12',
  attachments: 1
},
{
  id: 'LP003',
  theme: 'The Mughal Empire',
  class: 'Class 7',
  section: 'A',
  teacher: 'Mrs. Anita Patel',
  subject: 'History',
  weekDate: '2024-01-22',
  status: 'Draft',
  learningObjective: 'Understand the rise and fall of the Mughal Empire',
  materials: 'Textbook, maps, timeline chart',
  activityPlan: 'Timeline creation activity',
  assessmentMethod: 'Oral presentation',
  homework: 'Read chapter 4 and make notes',
  parentNote: '',
  version: 1,
  createdAt: '2024-01-14',
  updatedAt: '2024-01-14',
  attachments: 0
},
{
  id: 'LP004',
  theme: 'Poetry Appreciation',
  class: 'Class 8',
  section: 'C',
  teacher: 'Mr. Suresh Nair',
  subject: 'English',
  weekDate: '2024-01-22',
  status: 'Approved',
  learningObjective: 'Analyze poetic devices and themes',
  materials: 'Poetry anthology, audio recordings',
  activityPlan: 'Read aloud and group discussion',
  assessmentMethod: 'Written analysis',
  homework: 'Write a short poem on nature',
  parentNote: 'Encourage reading at home',
  version: 2,
  createdAt: '2024-01-11',
  updatedAt: '2024-01-15',
  attachments: 3
},
{
  id: 'LP005',
  theme: 'Water Cycle & Weather',
  class: 'Class 4',
  section: 'A',
  teacher: 'Mrs. Deepa Menon',
  subject: 'EVS',
  weekDate: '2024-01-29',
  status: 'Pending',
  learningObjective: 'Explain the water cycle with diagrams',
  materials: 'Globe, water, heat source for demo',
  activityPlan: 'Water cycle experiment',
  assessmentMethod: 'Diagram labeling',
  homework: 'Observe weather for 3 days and record',
  parentNote: 'Weather observation chart sent home',
  version: 1,
  createdAt: '2024-01-15',
  updatedAt: '2024-01-15',
  attachments: 1
}];

const versionHistory = [
{
  id: 'v3',
  plan: 'LP001 – Photosynthesis',
  version: 'v3',
  changedBy: 'Mrs. Priya Sharma',
  date: '2024-01-13',
  change: 'Updated assessment method'
},
{
  id: 'v2',
  plan: 'LP001 – Photosynthesis',
  version: 'v2',
  changedBy: 'Mrs. Priya Sharma',
  date: '2024-01-12',
  change: 'Added parent communication note'
},
{
  id: 'v1a',
  plan: 'LP004 – Poetry',
  version: 'v2',
  changedBy: 'Mr. Suresh Nair',
  date: '2024-01-15',
  change: 'Revised activity plan'
},
{
  id: 'v1b',
  plan: 'LP002 – Fractions',
  version: 'v1',
  changedBy: 'Mr. Rajesh Kumar',
  date: '2024-01-12',
  change: 'Initial creation'
}];

const auditLog = [
{
  id: 'a1',
  action: 'Approved',
  plan: 'LP001 – Photosynthesis',
  by: 'Principal Mehta',
  date: '2024-01-13 10:30',
  remarks: 'Well structured plan'
},
{
  id: 'a2',
  action: 'Submitted',
  plan: 'LP002 – Fractions',
  by: 'Mr. Rajesh Kumar',
  date: '2024-01-12 14:15',
  remarks: ''
},
{
  id: 'a3',
  action: 'Approved',
  plan: 'LP004 – Poetry',
  by: 'HOD English',
  date: '2024-01-15 09:00',
  remarks: 'Approved with minor suggestions'
},
{
  id: 'a4',
  action: 'Created',
  plan: 'LP003 – Mughal Empire',
  by: 'Mrs. Anita Patel',
  date: '2024-01-14 11:45',
  remarks: ''
},
{
  id: 'a5',
  action: 'Submitted',
  plan: 'LP005 – Water Cycle',
  by: 'Mrs. Deepa Menon',
  date: '2024-01-15 16:00',
  remarks: ''
}];

function statusBadge(status: PlanStatus) {
  if (status === 'Approved') return <Badge variant="success">Approved</Badge>;
  if (status === 'Pending') return <Badge variant="warning">Pending</Badge>;
  return <Badge variant="default">Draft</Badge>;
}
export function AcademicPlanningExecution() {
  const [activeTab, setActiveTab] = useState('list');
  const [searchTheme, setSearchTheme] = useState('');
  const [filterTeacher, setFilterTeacher] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<LessonPlan | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [formData, setFormData] = useState({
    theme: '',
    class: '',
    section: '',
    subject: '',
    weekDate: '',
    learningObjective: '',
    materials: '',
    activityPlan: '',
    assessmentMethod: '',
    homework: '',
    parentNote: ''
  });
  const filtered = mockPlans.filter((p) => {
    const matchTheme =
    !searchTheme || p.theme.toLowerCase().includes(searchTheme.toLowerCase());
    const matchTeacher = !filterTeacher || p.teacher === filterTeacher;
    const matchClass = !filterClass || p.class === filterClass;
    const matchDate = !filterDate || p.weekDate === filterDate;
    const matchStatus = !filterStatus || p.status === filterStatus;
    return matchTheme && matchTeacher && matchClass && matchDate && matchStatus;
  });
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handleEdit = (plan: LessonPlan) => {
    setSelectedPlan(plan);
    setFormData({
      theme: plan.theme,
      class: plan.class,
      section: plan.section,
      subject: plan.subject,
      weekDate: plan.weekDate,
      learningObjective: plan.learningObjective,
      materials: plan.materials,
      activityPlan: plan.activityPlan,
      assessmentMethod: plan.assessmentMethod,
      homework: plan.homework,
      parentNote: plan.parentNote
    });
    setFormMode('edit');
    setActiveTab('form');
  };
  const handleCreate = () => {
    setSelectedPlan(null);
    setFormData({
      theme: '',
      class: '',
      section: '',
      subject: '',
      weekDate: '',
      learningObjective: '',
      materials: '',
      activityPlan: '',
      assessmentMethod: '',
      homework: '',
      parentNote: ''
    });
    setFormMode('create');
    setActiveTab('form');
  };
  const listColumns = [
  {
    key: 'id',
    header: 'Plan ID'
  },
  {
    key: 'theme',
    header: 'Theme',
    render: (row: LessonPlan) =>
    <span className="font-medium text-gray-900">{row.theme}</span>

  },
  {
    key: 'class',
    header: 'Class/Sec',
    render: (row: LessonPlan) => `${row.class} – ${row.section}`
  },
  {
    key: 'subject',
    header: 'Subject'
  },
  {
    key: 'teacher',
    header: 'Teacher'
  },
  {
    key: 'weekDate',
    header: 'Week Of'
  },
  {
    key: 'version',
    header: 'Ver.',
    render: (row: LessonPlan) =>
    <span className="text-gray-500">v{row.version}</span>

  },
  {
    key: 'attachments',
    header: 'Attach.',
    render: (row: LessonPlan) =>
    row.attachments > 0 ?
    <span className="flex items-center gap-1 text-blue-600">
            <PaperclipIcon className="w-3 h-3" />
            {row.attachments}
          </span> :

    <span className="text-gray-400">—</span>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: LessonPlan) => statusBadge(row.status)
  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: LessonPlan) =>
    <div className="flex items-center gap-1">
          <Button
        size="xs"
        variant="ghost"
        icon={<EyeIcon className="w-3.5 h-3.5" />}
        title="View" />

          <Button
        size="xs"
        variant="ghost"
        icon={<EditIcon className="w-3.5 h-3.5" />}
        title="Edit"
        onClick={() => handleEdit(row)} />

          {row.status === 'Draft' &&
      <Button
        size="xs"
        variant="ghost"
        icon={<SendIcon className="w-3.5 h-3.5 text-blue-500" />}
        title="Submit for Approval" />

      }
          <Button
        size="xs"
        variant="ghost"
        icon={<Trash2Icon className="w-3.5 h-3.5 text-red-400" />}
        title="Delete" />

        </div>

  }];

  const versionColumns = [
  {
    key: 'plan',
    header: 'Lesson Plan'
  },
  {
    key: 'version',
    header: 'Version',
    render: (row: any) => <Badge variant="outline">{row.version}</Badge>
  },
  {
    key: 'changedBy',
    header: 'Changed By'
  },
  {
    key: 'date',
    header: 'Date'
  },
  {
    key: 'change',
    header: 'Change Summary'
  },
  {
    key: 'actions',
    header: '',
    render: () =>
    <Button
      size="xs"
      variant="ghost"
      icon={<EyeIcon className="w-3.5 h-3.5" />} />


  }];

  const auditColumns = [
  {
    key: 'action',
    header: 'Action',
    render: (row: any) => {
      const v =
      row.action === 'Approved' ?
      'success' :
      row.action === 'Submitted' ?
      'info' :
      'default';
      return <Badge variant={v as any}>{row.action}</Badge>;
    }
  },
  {
    key: 'plan',
    header: 'Lesson Plan'
  },
  {
    key: 'by',
    header: 'By'
  },
  {
    key: 'date',
    header: 'Date & Time'
  },
  {
    key: 'remarks',
    header: 'Remarks',
    render: (row: any) =>
    row.remarks || <span className="text-gray-400">—</span>
  }];

  const stats = {
    total: mockPlans.length,
    approved: mockPlans.filter((p) => p.status === 'Approved').length,
    pending: mockPlans.filter((p) => p.status === 'Pending').length,
    draft: mockPlans.filter((p) => p.status === 'Draft').length
  };
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Academic Planning & Execution
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage weekly lesson plans, approvals, and curriculum delivery
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<DownloadIcon className="w-4 h-4" />}>

            Export
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<PlusIcon className="w-4 h-4" />}
            onClick={handleCreate}>

            Create Lesson Plan
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="!p-0">
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <FileTextIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500">Total Plans</p>
            </div>
          </div>
        </Card>
        <Card className="!p-0">
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.approved}
              </p>
              <p className="text-xs text-gray-500">Approved</p>
            </div>
          </div>
        </Card>
        <Card className="!p-0">
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
              <ClockIcon className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.pending}
              </p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
          </div>
        </Card>
        <Card className="!p-0">
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
              <EditIcon className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.draft}</p>
              <p className="text-xs text-gray-500">Drafts</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Tabs */}
      <Card noPadding>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="px-4 pt-2">
            <TabsTrigger value="list">Lesson Plans</TabsTrigger>
            <TabsTrigger value="form">
              {formMode === 'edit' ? 'Edit Plan' : 'Create Plan'}
            </TabsTrigger>
            <TabsTrigger value="versions">Version History</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          {/* LIST TAB */}
          <TabsContent value="list" className="p-4 space-y-4">
            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <Input
                placeholder="Search by theme..."
                value={searchTheme}
                onChange={(e) => {
                  setSearchTheme(e.target.value);
                  setCurrentPage(1);
                }}
                leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />} />

              <Select
                placeholder="Filter by Teacher"
                value={filterTeacher}
                onChange={(v) => {
                  setFilterTeacher(v);
                  setCurrentPage(1);
                }}
                options={[
                {
                  value: '',
                  label: 'All Teachers'
                },
                {
                  value: 'Mrs. Priya Sharma',
                  label: 'Mrs. Priya Sharma'
                },
                {
                  value: 'Mr. Rajesh Kumar',
                  label: 'Mr. Rajesh Kumar'
                },
                {
                  value: 'Mrs. Anita Patel',
                  label: 'Mrs. Anita Patel'
                },
                {
                  value: 'Mr. Suresh Nair',
                  label: 'Mr. Suresh Nair'
                },
                {
                  value: 'Mrs. Deepa Menon',
                  label: 'Mrs. Deepa Menon'
                }]
                } />

              <Select
                placeholder="Filter by Class"
                value={filterClass}
                onChange={(v) => {
                  setFilterClass(v);
                  setCurrentPage(1);
                }}
                options={[
                {
                  value: '',
                  label: 'All Classes'
                },
                {
                  value: 'Class 4',
                  label: 'Class 4'
                },
                {
                  value: 'Class 5',
                  label: 'Class 5'
                },
                {
                  value: 'Class 6',
                  label: 'Class 6'
                },
                {
                  value: 'Class 7',
                  label: 'Class 7'
                },
                {
                  value: 'Class 8',
                  label: 'Class 8'
                }]
                } />

              <Input
                type="date"
                value={filterDate}
                onChange={(e) => {
                  setFilterDate(e.target.value);
                  setCurrentPage(1);
                }} />

              <Select
                placeholder="All Statuses"
                value={filterStatus}
                onChange={(v) => {
                  setFilterStatus(v);
                  setCurrentPage(1);
                }}
                options={[
                {
                  value: '',
                  label: 'All Statuses'
                },
                {
                  value: 'Draft',
                  label: 'Draft'
                },
                {
                  value: 'Pending',
                  label: 'Pending'
                },
                {
                  value: 'Approved',
                  label: 'Approved'
                }]
                } />

            </div>

            <Table
              columns={listColumns}
              data={paginated}
              emptyMessage="No lesson plans found matching filters." />


            {/* Pagination */}
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-gray-500">
                Showing{' '}
                {Math.min(
                  (currentPage - 1) * itemsPerPage + 1,
                  filtered.length
                )}
                –{Math.min(currentPage * itemsPerPage, filtered.length)} of{' '}
                {filtered.length} plans
              </p>
              <div className="flex items-center gap-2">
                <Button
                  size="xs"
                  variant="outline"
                  icon={<ChevronLeftIcon className="w-3.5 h-3.5" />}
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)} />

                {Array.from(
                  {
                    length: totalPages
                  },
                  (_, i) =>
                  <Button
                    key={i}
                    size="xs"
                    variant={currentPage === i + 1 ? 'primary' : 'outline'}
                    onClick={() => setCurrentPage(i + 1)}>

                      {i + 1}
                    </Button>

                )}
                <Button
                  size="xs"
                  variant="outline"
                  icon={<ChevronRightIcon className="w-3.5 h-3.5" />}
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)} />

              </div>
            </div>
          </TabsContent>

          {/* FORM TAB */}
          <TabsContent value="form" className="p-4">
            <div className="max-w-4xl space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  {formMode === 'edit' ?
                  `Edit: ${selectedPlan?.theme}` :
                  'New Lesson Plan'}
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab('list')}>

                    Cancel
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<FileTextIcon className="w-4 h-4" />}>

                    Save as Draft
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<SendIcon className="w-4 h-4" />}>

                    Submit for Approval
                  </Button>
                </div>
              </div>

              {/* Basic Info */}
              <Card title="Weekly Planning Entry">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Input
                    label="Theme / Topic *"
                    placeholder="e.g. Photosynthesis & Plant Life"
                    value={formData.theme}
                    onChange={(e) =>
                    setFormData((f) => ({
                      ...f,
                      theme: e.target.value
                    }))
                    } />

                  <Select
                    label="Class *"
                    value={formData.class}
                    onChange={(v) =>
                    setFormData((f) => ({
                      ...f,
                      class: v
                    }))
                    }
                    options={[
                    {
                      value: 'Class 1',
                      label: 'Class 1'
                    },
                    {
                      value: 'Class 2',
                      label: 'Class 2'
                    },
                    {
                      value: 'Class 3',
                      label: 'Class 3'
                    },
                    {
                      value: 'Class 4',
                      label: 'Class 4'
                    },
                    {
                      value: 'Class 5',
                      label: 'Class 5'
                    },
                    {
                      value: 'Class 6',
                      label: 'Class 6'
                    },
                    {
                      value: 'Class 7',
                      label: 'Class 7'
                    },
                    {
                      value: 'Class 8',
                      label: 'Class 8'
                    }]
                    }
                    placeholder="Select Class" />

                  <Select
                    label="Section *"
                    value={formData.section}
                    onChange={(v) =>
                    setFormData((f) => ({
                      ...f,
                      section: v
                    }))
                    }
                    options={[
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
                    },
                    {
                      value: 'D',
                      label: 'Section D'
                    }]
                    }
                    placeholder="Select Section" />

                  <Select
                    label="Subject *"
                    value={formData.subject}
                    onChange={(v) =>
                    setFormData((f) => ({
                      ...f,
                      subject: v
                    }))
                    }
                    options={[
                    {
                      value: 'Mathematics',
                      label: 'Mathematics'
                    },
                    {
                      value: 'Science',
                      label: 'Science'
                    },
                    {
                      value: 'English',
                      label: 'English'
                    },
                    {
                      value: 'History',
                      label: 'History'
                    },
                    {
                      value: 'Geography',
                      label: 'Geography'
                    },
                    {
                      value: 'EVS',
                      label: 'EVS'
                    },
                    {
                      value: 'Hindi',
                      label: 'Hindi'
                    }]
                    }
                    placeholder="Select Subject" />

                  <Input
                    label="Week Starting Date *"
                    type="date"
                    value={formData.weekDate}
                    onChange={(e) =>
                    setFormData((f) => ({
                      ...f,
                      weekDate: e.target.value
                    }))
                    } />

                </div>
              </Card>

              {/* Lesson Details */}
              <Card title="Lesson Details">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Learning Objective *
                    </label>
                    <textarea
                      className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                      placeholder="What students will learn by end of week..."
                      value={formData.learningObjective}
                      onChange={(e) =>
                      setFormData((f) => ({
                        ...f,
                        learningObjective: e.target.value
                      }))
                      } />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Materials Required
                    </label>
                    <textarea
                      className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                      placeholder="List all materials, resources, equipment needed..."
                      value={formData.materials}
                      onChange={(e) =>
                      setFormData((f) => ({
                        ...f,
                        materials: e.target.value
                      }))
                      } />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Activity Plan
                    </label>
                    <textarea
                      className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Describe day-wise activities planned for the week..."
                      value={formData.activityPlan}
                      onChange={(e) =>
                      setFormData((f) => ({
                        ...f,
                        activityPlan: e.target.value
                      }))
                      } />

                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Assessment Method
                      </label>
                      <textarea
                        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                        placeholder="How will learning be assessed..."
                        value={formData.assessmentMethod}
                        onChange={(e) =>
                        setFormData((f) => ({
                          ...f,
                          assessmentMethod: e.target.value
                        }))
                        } />

                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Homework / Assignment
                      </label>
                      <textarea
                        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                        placeholder="Homework tasks for students..."
                        value={formData.homework}
                        onChange={(e) =>
                        setFormData((f) => ({
                          ...f,
                          homework: e.target.value
                        }))
                        } />

                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Parent Communication Note
                    </label>
                    <textarea
                      className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                      placeholder="Any message or request for parents..."
                      value={formData.parentNote}
                      onChange={(e) =>
                      setFormData((f) => ({
                        ...f,
                        parentNote: e.target.value
                      }))
                      } />

                  </div>
                </div>
              </Card>

              {/* Attachments */}
              <Card title="Attachments">
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                  <UploadIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">
                    Drag & drop files here, or click to browse
                  </p>
                  <p className="text-xs text-gray-400">
                    PDF, DOC, DOCX, PPT, PPTX, JPG, PNG — Max 10MB per file
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    leftIcon={<PaperclipIcon className="w-4 h-4" />}>

                    Browse Files
                  </Button>
                </div>
              </Card>

              {/* Approval Workflow */}
              <Card title="Approval Workflow">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">1</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Teacher Submits
                      </p>
                      <p className="text-xs text-gray-500">Draft → Pending</p>
                    </div>
                  </div>
                  <div className="flex-1 h-px bg-gray-200" />
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-yellow-600">
                        2
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        HOD Reviews
                      </p>
                      <p className="text-xs text-gray-500">Pending → Review</p>
                    </div>
                  </div>
                  <div className="flex-1 h-px bg-gray-200" />
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-green-600">
                        3
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Principal Approves
                      </p>
                      <p className="text-xs text-gray-500">Review → Approved</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* VERSION HISTORY TAB */}
          <TabsContent value="versions" className="p-4 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <HistoryIcon className="w-5 h-5 text-gray-500" />
              <h2 className="text-base font-semibold text-gray-900">
                Version History
              </h2>
            </div>
            <Table
              columns={versionColumns}
              data={versionHistory}
              emptyMessage="No version history available." />

          </TabsContent>

          {/* AUDIT LOG TAB */}
          <TabsContent value="audit" className="p-4 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-semibold text-gray-900">
                Audit Log
              </h2>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<DownloadIcon className="w-4 h-4" />}>

                Export Log
              </Button>
            </div>
            <Table
              columns={auditColumns}
              data={auditLog}
              emptyMessage="No audit entries found." />

          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}