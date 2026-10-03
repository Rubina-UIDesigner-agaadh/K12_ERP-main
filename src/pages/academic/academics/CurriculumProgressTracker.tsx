import React, { useState, Component } from 'react';
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
  DownloadIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  BookOpenIcon,
  TrendingUpIcon,
  FilterIcon,
  EditIcon,
  FlagIcon } from
'lucide-react';
interface CurriculumTopic {
  id: string;
  subject: string;
  class: string;
  chapter: string;
  topic: string;
  plannedMonth: string;
  completedMonth: string | null;
  coveragePercent: number;
  isDelayed: boolean;
  status: 'Completed' | 'In Progress' | 'Not Started' | 'Delayed';
}
interface Milestone {
  id: string;
  class: string;
  subject: string;
  month: string;
  milestone: string;
  targetTopics: number;
  completedTopics: number;
  status: 'On Track' | 'Delayed' | 'Completed';
}
interface SkillEntry {
  id: string;
  class: string;
  skillType: 'Motor' | 'Social' | 'Cognitive';
  skill: string;
  targetMonth: string;
  completionPercent: number;
  status: 'Achieved' | 'In Progress' | 'Not Started';
}
const curriculumTopics: CurriculumTopic[] = [
{
  id: 't1',
  subject: 'Mathematics',
  class: 'Class 6',
  chapter: 'Ch. 1',
  topic: 'Integers & Number Line',
  plannedMonth: 'April',
  completedMonth: 'April',
  coveragePercent: 100,
  isDelayed: false,
  status: 'Completed'
},
{
  id: 't2',
  subject: 'Mathematics',
  class: 'Class 6',
  chapter: 'Ch. 2',
  topic: 'Fractions & Decimals',
  plannedMonth: 'May',
  completedMonth: 'May',
  coveragePercent: 100,
  isDelayed: false,
  status: 'Completed'
},
{
  id: 't3',
  subject: 'Mathematics',
  class: 'Class 6',
  chapter: 'Ch. 3',
  topic: 'Algebra – Basics',
  plannedMonth: 'June',
  completedMonth: null,
  coveragePercent: 65,
  isDelayed: false,
  status: 'In Progress'
},
{
  id: 't4',
  subject: 'Science',
  class: 'Class 6',
  chapter: 'Ch. 1',
  topic: 'Food: Where Does It Come From?',
  plannedMonth: 'April',
  completedMonth: 'April',
  coveragePercent: 100,
  isDelayed: false,
  status: 'Completed'
},
{
  id: 't5',
  subject: 'Science',
  class: 'Class 6',
  chapter: 'Ch. 2',
  topic: 'Components of Food',
  plannedMonth: 'April',
  completedMonth: 'May',
  coveragePercent: 100,
  isDelayed: true,
  status: 'Completed'
},
{
  id: 't6',
  subject: 'Science',
  class: 'Class 6',
  chapter: 'Ch. 3',
  topic: 'Fibre to Fabric',
  plannedMonth: 'May',
  completedMonth: null,
  coveragePercent: 40,
  isDelayed: true,
  status: 'Delayed'
},
{
  id: 't7',
  subject: 'English',
  class: 'Class 7',
  chapter: 'Unit 1',
  topic: 'Three Questions',
  plannedMonth: 'April',
  completedMonth: 'April',
  coveragePercent: 100,
  isDelayed: false,
  status: 'Completed'
},
{
  id: 't8',
  subject: 'English',
  class: 'Class 7',
  chapter: 'Unit 2',
  topic: 'A Gift of Chappals',
  plannedMonth: 'May',
  completedMonth: null,
  coveragePercent: 80,
  isDelayed: false,
  status: 'In Progress'
},
{
  id: 't9',
  subject: 'History',
  class: 'Class 7',
  chapter: 'Ch. 1',
  topic: 'Tracing Changes Through 1000 Years',
  plannedMonth: 'April',
  completedMonth: null,
  coveragePercent: 0,
  isDelayed: true,
  status: 'Delayed'
}];

const milestones: Milestone[] = [
{
  id: 'm1',
  class: 'Class 6',
  subject: 'Mathematics',
  month: 'April',
  milestone: 'Complete Number Systems unit',
  targetTopics: 3,
  completedTopics: 3,
  status: 'Completed'
},
{
  id: 'm2',
  class: 'Class 6',
  subject: 'Science',
  month: 'April',
  milestone: 'Complete Food & Nutrition unit',
  targetTopics: 2,
  completedTopics: 2,
  status: 'Completed'
},
{
  id: 'm3',
  class: 'Class 6',
  subject: 'Mathematics',
  month: 'May',
  milestone: 'Complete Fractions unit',
  targetTopics: 2,
  completedTopics: 2,
  status: 'Completed'
},
{
  id: 'm4',
  class: 'Class 6',
  subject: 'Science',
  month: 'May',
  milestone: 'Complete Materials unit',
  targetTopics: 3,
  completedTopics: 1,
  status: 'Delayed'
},
{
  id: 'm5',
  class: 'Class 7',
  subject: 'English',
  month: 'May',
  milestone: 'Complete Honeycomb Unit 1–2',
  targetTopics: 2,
  completedTopics: 1,
  status: 'On Track'
},
{
  id: 'm6',
  class: 'Class 7',
  subject: 'History',
  month: 'April',
  milestone: 'Complete Medieval History Ch 1',
  targetTopics: 1,
  completedTopics: 0,
  status: 'Delayed'
}];

const skillEntries: SkillEntry[] = [
{
  id: 's1',
  class: 'Class 1',
  skillType: 'Motor',
  skill: 'Pencil grip & handwriting',
  targetMonth: 'June',
  completionPercent: 85,
  status: 'In Progress'
},
{
  id: 's2',
  class: 'Class 1',
  skillType: 'Motor',
  skill: 'Cutting with scissors',
  targetMonth: 'May',
  completionPercent: 100,
  status: 'Achieved'
},
{
  id: 's3',
  class: 'Class 2',
  skillType: 'Social',
  skill: 'Group participation in activities',
  targetMonth: 'June',
  completionPercent: 70,
  status: 'In Progress'
},
{
  id: 's4',
  class: 'Class 2',
  skillType: 'Social',
  skill: 'Conflict resolution basics',
  targetMonth: 'July',
  completionPercent: 30,
  status: 'Not Started'
},
{
  id: 's5',
  class: 'Class 3',
  skillType: 'Cognitive',
  skill: 'Problem-solving with patterns',
  targetMonth: 'May',
  completionPercent: 90,
  status: 'In Progress'
},
{
  id: 's6',
  class: 'Class 3',
  skillType: 'Cognitive',
  skill: 'Reading comprehension level 2',
  targetMonth: 'June',
  completionPercent: 100,
  status: 'Achieved'
}];

const classSummary = [
{
  class: 'Class 4',
  totalTopics: 48,
  completed: 32,
  inProgress: 8,
  delayed: 4,
  coverage: 67
},
{
  class: 'Class 5',
  totalTopics: 52,
  completed: 38,
  inProgress: 6,
  delayed: 3,
  coverage: 73
},
{
  class: 'Class 6',
  totalTopics: 56,
  completed: 40,
  inProgress: 9,
  delayed: 5,
  coverage: 71
},
{
  class: 'Class 7',
  totalTopics: 60,
  completed: 42,
  inProgress: 10,
  delayed: 6,
  coverage: 70
},
{
  class: 'Class 8',
  totalTopics: 64,
  completed: 50,
  inProgress: 8,
  delayed: 2,
  coverage: 78
}];

function CoverageBar({
  percent,
  isDelayed



}: {percent: number;isDelayed: boolean;}) {
  const color = isDelayed ?
  'bg-red-400' :
  percent === 100 ?
  'bg-green-500' :
  'bg-blue-500';
  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{
            width: `${percent}%`
          }} />

      </div>
      <span className="text-xs font-medium text-gray-700 w-8 text-right">
        {percent}%
      </span>
    </div>);

}
function statusBadge(status: string) {
  if (status === 'Completed' || status === 'Achieved')
  return <Badge variant="success">{status}</Badge>;
  if (status === 'Delayed') return <Badge variant="danger">Delayed</Badge>;
  if (status === 'In Progress' || status === 'On Track')
  return <Badge variant="info">{status}</Badge>;
  return <Badge variant="default">{status}</Badge>;
}
export function CurriculumProgressTracker() {
  const [activeTab, setActiveTab] = useState('overview');
  const [filterClass, setFilterClass] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterYear, setFilterYear] = useState('2023-24');
  const [filterSkillType, setFilterSkillType] = useState('');
  const filteredTopics = curriculumTopics.filter((t) => {
    const matchClass = !filterClass || t.class === filterClass;
    const matchSubject = !filterSubject || t.subject === filterSubject;
    return matchClass && matchSubject;
  });
  const filteredMilestones = milestones.filter((m) => {
    const matchClass = !filterClass || m.class === filterClass;
    const matchSubject = !filterSubject || m.subject === filterSubject;
    return matchClass && matchSubject;
  });
  const filteredSkills = skillEntries.filter((s) => {
    const matchClass = !filterClass || s.class === filterClass;
    const matchType = !filterSkillType || s.skillType === filterSkillType;
    return matchClass && matchType;
  });
  const totalTopics = curriculumTopics.length;
  const completedTopics = curriculumTopics.filter(
    (t) => t.status === 'Completed'
  ).length;
  const delayedTopics = curriculumTopics.filter((t) => t.isDelayed).length;
  const overallCoverage = Math.round(completedTopics / totalTopics * 100);
  const topicColumns = [
  {
    key: 'subject',
    header: 'Subject'
  },
  {
    key: 'class',
    header: 'Class'
  },
  {
    key: 'chapter',
    header: 'Chapter'
  },
  {
    key: 'topic',
    header: 'Topic',
    render: (row: CurriculumTopic) =>
    <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">{row.topic}</span>
          {row.isDelayed &&
      <AlertTriangleIcon
        className="w-3.5 h-3.5 text-red-500"
        title="Delayed" />

      }
        </div>

  },
  {
    key: 'plannedMonth',
    header: 'Planned'
  },
  {
    key: 'completedMonth',
    header: 'Completed',
    render: (row: CurriculumTopic) =>
    row.completedMonth || <span className="text-gray-400">—</span>
  },
  {
    key: 'coveragePercent',
    header: 'Coverage',
    render: (row: CurriculumTopic) =>
    <CoverageBar percent={row.coveragePercent} isDelayed={row.isDelayed} />

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: CurriculumTopic) => statusBadge(row.status)
  },
  {
    key: 'actions',
    header: '',
    render: () =>
    <Button
      size="xs"
      variant="ghost"
      icon={<EditIcon className="w-3.5 h-3.5" />} />


  }];

  const milestoneColumns = [
  {
    key: 'class',
    header: 'Class'
  },
  {
    key: 'subject',
    header: 'Subject'
  },
  {
    key: 'month',
    header: 'Month'
  },
  {
    key: 'milestone',
    header: 'Milestone',
    render: (row: Milestone) =>
    <span className="font-medium text-gray-900">{row.milestone}</span>

  },
  {
    key: 'progress',
    header: 'Topics',
    render: (row: Milestone) =>
    <span className="text-sm">
          {row.completedTopics}/{row.targetTopics}
        </span>

  },
  {
    key: 'coverage',
    header: 'Progress',
    render: (row: Milestone) =>
    <CoverageBar
      percent={Math.round(row.completedTopics / row.targetTopics * 100)}
      isDelayed={row.status === 'Delayed'} />


  },
  {
    key: 'status',
    header: 'Status',
    render: (row: Milestone) => statusBadge(row.status)
  }];

  const skillColumns = [
  {
    key: 'class',
    header: 'Class'
  },
  {
    key: 'skillType',
    header: 'Skill Type',
    render: (row: SkillEntry) => {
      const colors: Record<string, string> = {
        Motor: 'primary',
        Social: 'warning',
        Cognitive: 'info'
      };
      return (
        <Badge variant={colors[row.skillType] as any}>{row.skillType}</Badge>);

    }
  },
  {
    key: 'skill',
    header: 'Skill',
    render: (row: SkillEntry) =>
    <span className="font-medium text-gray-900">{row.skill}</span>

  },
  {
    key: 'targetMonth',
    header: 'Target Month'
  },
  {
    key: 'completionPercent',
    header: 'Completion',
    render: (row: SkillEntry) =>
    <CoverageBar percent={row.completionPercent} isDelayed={false} />

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: SkillEntry) => statusBadge(row.status)
  },
  {
    key: 'actions',
    header: '',
    render: () =>
    <Button
      size="xs"
      variant="ghost"
      icon={<EditIcon className="w-3.5 h-3.5" />} />


  }];

  const summaryColumns = [
  {
    key: 'class',
    header: 'Class',
    render: (row: any) =>
    <span className="font-semibold text-gray-900">{row.class}</span>

  },
  {
    key: 'totalTopics',
    header: 'Total Topics'
  },
  {
    key: 'completed',
    header: 'Completed',
    render: (row: any) =>
    <span className="text-green-600 font-medium">{row.completed}</span>

  },
  {
    key: 'inProgress',
    header: 'In Progress',
    render: (row: any) =>
    <span className="text-blue-600 font-medium">{row.inProgress}</span>

  },
  {
    key: 'delayed',
    header: 'Delayed',
    render: (row: any) =>
    <span className="text-red-600 font-medium">{row.delayed}</span>

  },
  {
    key: 'coverage',
    header: 'Coverage %',
    render: (row: any) =>
    <CoverageBar percent={row.coverage} isDelayed={row.delayed > 3} />

  }];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Curriculum Progress Tracker
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Monitor annual curriculum coverage, milestones, and skill
            development
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={filterYear}
            onChange={setFilterYear}
            options={[
            {
              value: '2023-24',
              label: 'AY 2023–24'
            },
            {
              value: '2024-25',
              label: 'AY 2024–25'
            }]
            } />

          <Button
            variant="outline"
            size="sm"
            leftIcon={<DownloadIcon className="w-4 h-4" />}>

            Export Report
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<PlusIcon className="w-4 h-4" />}>

            Add Entry
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="!p-0">
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <BookOpenIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalTopics}</p>
              <p className="text-xs text-gray-500">Total Topics</p>
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
                {completedTopics}
              </p>
              <p className="text-xs text-gray-500">Completed</p>
            </div>
          </div>
        </Card>
        <Card className="!p-0">
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
              <AlertTriangleIcon className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {delayedTopics}
              </p>
              <p className="text-xs text-gray-500">Delayed</p>
            </div>
          </div>
        </Card>
        <Card className="!p-0">
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
              <TrendingUpIcon className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {overallCoverage}%
              </p>
              <p className="text-xs text-gray-500">Overall Coverage</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card noPadding>
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3 items-center">
          <FilterIcon className="w-4 h-4 text-gray-400" />
          <Select
            placeholder="All Classes"
            value={filterClass}
            onChange={setFilterClass}
            options={[
            {
              value: '',
              label: 'All Classes'
            },
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
            className="w-40" />

          <Select
            placeholder="All Subjects"
            value={filterSubject}
            onChange={setFilterSubject}
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
            }]
            }
            className="w-40" />

          {activeTab === 'skills' &&
          <Select
            placeholder="All Skill Types"
            value={filterSkillType}
            onChange={setFilterSkillType}
            options={[
            {
              value: '',
              label: 'All Skill Types'
            },
            {
              value: 'Motor',
              label: 'Motor'
            },
            {
              value: 'Social',
              label: 'Social'
            },
            {
              value: 'Cognitive',
              label: 'Cognitive'
            }]
            }
            className="w-40" />

          }
          {(filterClass || filterSubject || filterSkillType) &&
          <Button
            size="xs"
            variant="ghost"
            onClick={() => {
              setFilterClass('');
              setFilterSubject('');
              setFilterSkillType('');
            }}>

              Clear Filters
            </Button>
          }
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="px-4 pt-2">
            <TabsTrigger value="overview">Topic Coverage</TabsTrigger>
            <TabsTrigger value="milestones">Monthly Milestones</TabsTrigger>
            <TabsTrigger value="skills">Skill Tracking</TabsTrigger>
            <TabsTrigger value="summary">Class Summary</TabsTrigger>
          </TabsList>

          {/* TOPIC COVERAGE */}
          <TabsContent value="overview" className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />{' '}
                  Completed
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />{' '}
                  In Progress
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />{' '}
                  Delayed
                </span>
                <span className="flex items-center gap-1.5">
                  <AlertTriangleIcon className="w-3.5 h-3.5 text-red-500" />{' '}
                  Delayed Flag
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<PlusIcon className="w-4 h-4" />}>

                Add Topic
              </Button>
            </div>
            <Table
              columns={topicColumns}
              data={filteredTopics}
              emptyMessage="No topics found for selected filters." />

          </TabsContent>

          {/* MONTHLY MILESTONES */}
          <TabsContent value="milestones" className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                Monthly Milestone Entries
              </h3>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<PlusIcon className="w-4 h-4" />}>

                Add Milestone
              </Button>
            </div>
            <Table
              columns={milestoneColumns}
              data={filteredMilestones}
              emptyMessage="No milestones found." />

          </TabsContent>

          {/* SKILL TRACKING */}
          <TabsContent value="skills" className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm">
                <Badge variant="primary">Motor</Badge>
                <Badge variant="warning">Social</Badge>
                <Badge variant="info">Cognitive</Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<PlusIcon className="w-4 h-4" />}>

                Add Skill Entry
              </Button>
            </div>
            <Table
              columns={skillColumns}
              data={filteredSkills}
              emptyMessage="No skill entries found." />

          </TabsContent>

          {/* CLASS SUMMARY */}
          <TabsContent value="summary" className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                Class-wise Progress Summary
              </h3>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<DownloadIcon className="w-4 h-4" />}>

                Export Summary
              </Button>
            </div>
            <Table
              columns={summaryColumns}
              data={classSummary}
              emptyMessage="No data available." />


            {/* Coverage visualization */}
            <Card title="Coverage Overview by Class">
              <div className="space-y-3">
                {classSummary.map((row) =>
                <div key={row.class} className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700 w-20">
                      {row.class}
                    </span>
                    <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"
                      style={{
                        width: `${row.coverage}%`
                      }} />

                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-10 text-right">
                      {row.coverage}%
                    </span>
                    {row.delayed > 3 &&
                  <FlagIcon
                    className="w-4 h-4 text-red-500"
                    title="High delay count" />

                  }
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}