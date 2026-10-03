import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Table } from '../../../components/ui/Table';
import {
  SaveIcon,
  AlertTriangleIcon,
  BookOpenIcon,
  CheckCircleIcon,
  ClipboardListIcon,
  PaperclipIcon,
  TrendingUpIcon,
  AlertCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
  DownloadIcon,
  RefreshCwIcon,
  MonitorIcon,
  WifiIcon,
  UsersIcon,
  LayersIcon,
  PenLineIcon,
  FlaskConicalIcon,
  MessageSquareIcon,
  PresentationIcon,
  BookIcon,
  VideoIcon,
  FileTextIcon,
  LayoutIcon } from
'lucide-react';
const today = new Date().toISOString().split('T')[0];
const CHAPTERS = [
{
  value: 'ch1',
  label: 'Chapter 1 – Number Systems'
},
{
  value: 'ch2',
  label: 'Chapter 2 – Polynomials'
},
{
  value: 'ch3',
  label: 'Chapter 3 – Coordinate Geometry'
},
{
  value: 'ch4',
  label: 'Chapter 4 – Linear Equations'
},
{
  value: 'ch5',
  label: 'Chapter 5 – Introduction to Euclid'
}];

const TOPICS_BY_CHAPTER: Record<string, string[]> = {
  ch1: [
  'Rational Numbers',
  'Irrational Numbers',
  'Real Numbers on Number Line',
  'Decimal Expansions'],

  ch2: [
  'Polynomials in One Variable',
  'Zeroes of Polynomial',
  'Remainder Theorem',
  'Factor Theorem'],

  ch3: [
  'Cartesian System',
  'Plotting Points',
  'Quadrants',
  'Coordinates of a Point'],

  ch4: [
  'Linear Equations',
  'Solution of Linear Equation',
  'Graph of Linear Equation',
  'Equations of Lines'],

  ch5: [
  "Euclid's Definitions",
  "Euclid's Postulates",
  "Euclid's Axioms",
  'Equivalent Versions']

};
const recentEntries = [
{
  id: 1,
  date: '28 Feb 2026',
  standard: 'Class 9-A',
  subject: 'Mathematics',
  period: 'Period 2',
  chapter: 'Chapter 2 – Polynomials',
  topic: 'Zeroes of Polynomial',
  coverage: 'Full Completion',
  mode: 'Offline',
  homework: 'Yes'
},
{
  id: 2,
  date: '27 Feb 2026',
  standard: 'Class 9-A',
  subject: 'Mathematics',
  period: 'Period 2',
  chapter: 'Chapter 2 – Polynomials',
  topic: 'Polynomials in One Variable',
  coverage: 'Full Completion',
  mode: 'Offline',
  homework: 'No'
},
{
  id: 3,
  date: '26 Feb 2026',
  standard: 'Class 9-B',
  subject: 'Mathematics',
  period: 'Period 3',
  chapter: 'Chapter 1 – Number Systems',
  topic: 'Decimal Expansions',
  coverage: 'Partial Coverage',
  mode: 'Hybrid',
  homework: 'Yes'
}];

type TeachingMode = 'Offline' | 'Online' | 'Hybrid';
type CoverageType = 'Full Completion' | 'Partial Coverage';
export function Classwork() {
  const [teachingMode, setTeachingMode] = useState<TeachingMode>('Offline');
  const [selectedChapter, setSelectedChapter] = useState('ch2');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
  'Zeroes of Polynomial']
  );
  const [coverageType, setCoverageType] =
  useState<CoverageType>('Full Completion');
  const [teachingMethod, setTeachingMethod] = useState('Lecture');
  const [teachingAids, setTeachingAids] = useState<string[]>(['PPT']);
  const [homeworkAssigned, setHomeworkAssigned] = useState(false);
  const [lessonObjective, setLessonObjective] = useState('');
  const [classNotes, setClassNotes] = useState('');
  const [showDuplicateWarning] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([
  'syllabus',
  'activity',
  'homework']
  );
  const toggleSection = (s: string) =>
  setExpandedSections((prev) =>
  prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
  );
  const toggleTopic = (topic: string) =>
  setSelectedTopics((prev) =>
  prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
  );
  const toggleAid = (aid: string) =>
  setTeachingAids((prev) =>
  prev.includes(aid) ? prev.filter((a) => a !== aid) : [...prev, aid]
  );
  const topics = TOPICS_BY_CHAPTER[selectedChapter] || [];
  const totalTopics = Object.values(TOPICS_BY_CHAPTER).flat().length;
  const completedTopics = 6;
  const syllabusPercent = Math.round(completedTopics / totalTopics * 100);
  const isOnSchedule = syllabusPercent >= 40;
  const modeIcons: Record<TeachingMode, React.ReactNode> = {
    Offline: <UsersIcon className="w-3.5 h-3.5" />,
    Online: <WifiIcon className="w-3.5 h-3.5" />,
    Hybrid: <MonitorIcon className="w-3.5 h-3.5" />
  };
  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Classwork</h1>
          <p className="text-sm text-gray-500 mt-1">
            Record daily syllabus progress, classroom activities, and homework
            assignments
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<DownloadIcon className="w-4 h-4" />}>

            Export Log
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<SaveIcon className="w-4 h-4" />}>

            Save Entry
          </Button>
        </div>
      </div>

      {/* Duplicate Warning */}
      {showDuplicateWarning &&
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertTriangleIcon className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              Duplicate Entry Detected
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              A classwork entry already exists for this Date + Period + Subject
              combination. Please review before saving.
            </p>
          </div>
        </div>
      }

      {/* Context Selection Panel */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <LayoutIcon className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="font-semibold text-gray-900">Session Context</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Select
            label="Academic Year"
            options={[
            {
              value: '2024-25',
              label: '2024-2025'
            },
            {
              value: '2023-24',
              label: '2023-2024'
            }]
            }
            value="2024-25"
            onChange={() => {}} />

          <Input label="Date" type="date" defaultValue={today} />
          <Select
            label="Standard"
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
            value="class-9"
            onChange={() => {}} />

          <Select
            label="Section"
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
            value="A"
            onChange={() => {}} />

          <Select
            label="Subject"
            options={[
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
            },
            {
              value: 'physics',
              label: 'Physics'
            },
            {
              value: 'chemistry',
              label: 'Chemistry'
            },
            {
              value: 'biology',
              label: 'Biology'
            },
            {
              value: 'computer-science',
              label: 'Computer Science'
            }]
            }
            value="mathematics"
            onChange={() => {}} />

          <Select
            label="Period"
            options={Array.from(
              {
                length: 8
              },
              (_, i) => ({
                value: `p${i + 1}`,
                label: `Period ${i + 1}`
              })
            )}
            value="p2"
            onChange={() => {}} />

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Teaching Mode
            </label>
            <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
              {(['Offline', 'Online', 'Hybrid'] as TeachingMode[]).map(
                (mode) =>
                <button
                  key={mode}
                  onClick={() => setTeachingMode(mode)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all ${teachingMode === mode ? 'bg-white text-blue-700 shadow-sm border border-blue-200' : 'text-gray-600 hover:text-gray-800'}`}>

                    {modeIcons[mode]}
                    {mode}
                  </button>

              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Main Form */}
        <div className="lg:col-span-2 space-y-4">
          {/* Syllabus Coverage */}
          <Card>
            <button
              className="flex items-center justify-between w-full"
              onClick={() => toggleSection('syllabus')}>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <BookOpenIcon className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">
                    Syllabus Coverage
                  </h3>
                  <p className="text-xs text-gray-500">
                    Chapter, topics, and coverage type
                  </p>
                </div>
              </div>
              {expandedSections.includes('syllabus') ?
              <ChevronDownIcon className="w-5 h-5 text-gray-400" /> :

              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
              }
            </button>

            {expandedSections.includes('syllabus') &&
            <div className="mt-4 pt-4 border-t space-y-4">
                <Select
                label="Chapter / Unit *"
                options={CHAPTERS}
                value={selectedChapter}
                onChange={setSelectedChapter} />


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Topic / Sub-topic *{' '}
                    <span className="text-xs text-gray-400">
                      (select all covered)
                    </span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {topics.map((topic) =>
                  <label
                    key={topic}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${selectedTopics.includes(topic) ? 'bg-blue-50 border-blue-300 text-blue-800' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'}`}>

                        <input
                      type="checkbox"
                      checked={selectedTopics.includes(topic)}
                      onChange={() => toggleTopic(topic)}
                      className="rounded text-blue-600" />

                        <span className="text-sm">{topic}</span>
                        {selectedTopics.includes(topic) &&
                    <CheckCircleIcon className="w-3.5 h-3.5 text-blue-500 ml-auto flex-shrink-0" />
                    }
                      </label>
                  )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coverage Type *
                  </label>
                  <div className="flex gap-3">
                    {(
                  ['Full Completion', 'Partial Coverage'] as CoverageType[]).
                  map((type) =>
                  <button
                    key={type}
                    onClick={() => setCoverageType(type)}
                    className={`flex-1 py-2.5 px-4 rounded-lg border text-sm font-medium transition-all ${coverageType === type ? type === 'Full Completion' ? 'bg-green-50 border-green-400 text-green-700' : 'bg-amber-50 border-amber-400 text-amber-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>

                        {type === 'Full Completion' ? '✓ ' : '◑ '}
                        {type}
                      </button>
                  )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Lesson Objective <span className="text-red-500">*</span>
                  </label>
                  <textarea
                  value={lessonObjective}
                  onChange={(e) => setLessonObjective(e.target.value)}
                  placeholder="e.g. Students will understand the concept of zeroes of a polynomial and apply the factor theorem..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3} />

                  {lessonObjective.length === 0 &&
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircleIcon className="w-3 h-3" /> Lesson objective
                      is mandatory
                    </p>
                }
                </div>
              </div>
            }
          </Card>

          {/* Classroom Activity */}
          <Card>
            <button
              className="flex items-center justify-between w-full"
              onClick={() => toggleSection('activity')}>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <PresentationIcon className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">
                    Classroom Activity
                  </h3>
                  <p className="text-xs text-gray-500">
                    Teaching method, aids, and class notes
                  </p>
                </div>
              </div>
              {expandedSections.includes('activity') ?
              <ChevronDownIcon className="w-5 h-5 text-gray-400" /> :

              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
              }
            </button>

            {expandedSections.includes('activity') &&
            <div className="mt-4 pt-4 border-t space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teaching Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                  {
                    id: 'Lecture',
                    icon: <MessageSquareIcon className="w-4 h-4" />
                  },
                  {
                    id: 'Activity-Based',
                    icon: <LayersIcon className="w-4 h-4" />
                  },
                  {
                    id: 'Discussion',
                    icon: <UsersIcon className="w-4 h-4" />
                  },
                  {
                    id: 'Practical',
                    icon: <FlaskConicalIcon className="w-4 h-4" />
                  },
                  {
                    id: 'Smart Board',
                    icon: <MonitorIcon className="w-4 h-4" />
                  }].
                  map(({ id, icon }) =>
                  <button
                    key={id}
                    onClick={() => setTeachingMethod(id)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-sm font-medium transition-all ${teachingMethod === id ? 'bg-purple-50 border-purple-400 text-purple-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}>

                        {icon} {id}
                      </button>
                  )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teaching Aids Used
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                  {
                    id: 'PPT',
                    icon: <LayoutIcon className="w-3.5 h-3.5" />
                  },
                  {
                    id: 'Worksheet',
                    icon: <FileTextIcon className="w-3.5 h-3.5" />
                  },
                  {
                    id: 'Video',
                    icon: <VideoIcon className="w-3.5 h-3.5" />
                  },
                  {
                    id: 'Textbook',
                    icon: <BookIcon className="w-3.5 h-3.5" />
                  },
                  {
                    id: 'Lab Material',
                    icon: <FlaskConicalIcon className="w-3.5 h-3.5" />
                  }].
                  map(({ id, icon }) =>
                  <button
                    key={id}
                    onClick={() => toggleAid(id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${teachingAids.includes(id) ? 'bg-indigo-50 border-indigo-400 text-indigo-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>

                        {icon} {id}
                      </button>
                  )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Class Notes
                  </label>
                  <textarea
                  value={classNotes}
                  onChange={(e) => setClassNotes(e.target.value)}
                  placeholder="Additional notes about today's class, student engagement, observations..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4} />

                </div>
              </div>
            }
          </Card>

          {/* Homework Section */}
          <Card>
            <button
              className="flex items-center justify-between w-full"
              onClick={() => toggleSection('homework')}>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                  <PenLineIcon className="w-4 h-4 text-orange-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Homework</h3>
                  <p className="text-xs text-gray-500">
                    Assign homework for this session
                  </p>
                </div>
              </div>
              {expandedSections.includes('homework') ?
              <ChevronDownIcon className="w-5 h-5 text-gray-400" /> :

              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
              }
            </button>

            {expandedSections.includes('homework') &&
            <div className="mt-4 pt-4 border-t space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Homework Assigned?
                    </p>
                    <p className="text-xs text-gray-500">
                      Toggle to assign homework for this class
                    </p>
                  </div>
                  <button
                  onClick={() => setHomeworkAssigned(!homeworkAssigned)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${homeworkAssigned ? 'bg-green-500' : 'bg-gray-300'}`}>

                    <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${homeworkAssigned ? 'left-7' : 'left-1'}`} />

                  </button>
                </div>

                {homeworkAssigned &&
              <div className="space-y-4 pl-1">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Homework Description *
                      </label>
                      <textarea
                    placeholder="e.g. Solve Exercise 2.3 Q1-Q10 from NCERT textbook..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3} />

                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Submission Date *" type="date" />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Attachment (optional)
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-blue-400 transition-colors cursor-pointer">
                          <PaperclipIcon className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                          <p className="text-xs text-gray-500">
                            PDF/Image up to 5MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
              }
              </div>
            }
          </Card>

          {/* Save Actions */}
          <div className="flex gap-3">
            <Button
              variant="primary"
              leftIcon={<SaveIcon className="w-4 h-4" />}>

              Save Classwork Entry
            </Button>
            <Button variant="outline">Reset Form</Button>
          </div>
        </div>

        {/* Right: Progress Summary */}
        <div className="space-y-4">
          {/* Syllabus Progress */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <TrendingUpIcon className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Progress Summary</h3>
            </div>

            {/* Circular Progress */}
            <div className="flex flex-col items-center py-4">
              <div className="relative w-28 h-28">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="10" />

                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={isOnSchedule ? '#22c55e' : '#ef4444'}
                    strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - syllabusPercent / 100)}`}
                    strokeLinecap="round" />

                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">
                    {syllabusPercent}%
                  </span>
                  <span className="text-xs text-gray-500">Completed</span>
                </div>
              </div>
              <div
                className={`mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${isOnSchedule ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>

                {isOnSchedule ? '✓ On Schedule' : '🔴 Behind Schedule'}
              </div>
            </div>

            <div className="space-y-3 mt-2">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Total Chapters</span>
                <span className="text-sm font-semibold text-gray-900">5</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">
                  Completed Chapters
                </span>
                <span className="text-sm font-semibold text-green-600">1</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Total Topics</span>
                <span className="text-sm font-semibold text-gray-900">
                  {totalTopics}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Topics Covered</span>
                <span className="text-sm font-semibold text-blue-600">
                  {completedTopics}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">% Completed</span>
                <span
                  className={`text-sm font-bold ${isOnSchedule ? 'text-green-600' : 'text-red-600'}`}>

                  {syllabusPercent}%
                </span>
              </div>
            </div>
          </Card>

          {/* Current Session Summary */}
          <Card>
            <h3 className="font-semibold text-gray-900 mb-3">
              Today's Session
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <Badge
                  variant={
                  teachingMode === 'Offline' ?
                  'default' :
                  teachingMode === 'Online' ?
                  'info' :
                  'success'
                  }>

                  {teachingMode}
                </Badge>
                <span className="text-xs text-gray-600">Teaching Mode</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <span className="text-xs font-medium text-gray-700">
                  {teachingMethod}
                </span>
                <span className="text-xs text-gray-500">Method</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <span className="text-xs font-medium text-gray-700">
                  {selectedTopics.length} topic(s)
                </span>
                <span className="text-xs text-gray-500">Selected</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <Badge
                  variant={
                  coverageType === 'Full Completion' ? 'success' : 'warning'
                  }>

                  {coverageType === 'Full Completion' ? 'Full' : 'Partial'}
                </Badge>
                <span className="text-xs text-gray-600">Coverage</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <Badge variant={homeworkAssigned ? 'primary' : 'default'}>
                  {homeworkAssigned ? 'Yes' : 'No'}
                </Badge>
                <span className="text-xs text-gray-600">Homework</span>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-blue-700">12</p>
              <p className="text-xs text-blue-600 mt-0.5">Classes This Month</p>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-green-700">8</p>
              <p className="text-xs text-green-600 mt-0.5">HW Assigned</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Entries */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
              <ClipboardListIcon className="w-4 h-4 text-slate-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Recent Entries</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RefreshCwIcon className="w-4 h-4" />}>

            Refresh
          </Button>
        </div>
        <Table
          columns={[
          {
            key: 'date',
            header: 'Date',
            render: (row) =>
            <span className="text-sm text-gray-600">{row.date}</span>

          },
          {
            key: 'standard',
            header: 'Class',
            render: (row) =>
            <span className="font-medium text-gray-900 text-sm">
                  {row.standard}
                </span>

          },
          {
            key: 'subject',
            header: 'Subject',
            render: (row) => <Badge variant="info">{row.subject}</Badge>
          },
          {
            key: 'period',
            header: 'Period',
            render: (row) =>
            <span className="text-sm text-gray-600">{row.period}</span>

          },
          {
            key: 'topic',
            header: 'Topic Covered',
            render: (row) =>
            <span className="text-sm text-gray-700">{row.topic}</span>

          },
          {
            key: 'coverage',
            header: 'Coverage',
            render: (row) =>
            <Badge
              variant={
              row.coverage === 'Full Completion' ? 'success' : 'warning'
              }>

                  {row.coverage === 'Full Completion' ? 'Full' : 'Partial'}
                </Badge>

          },
          {
            key: 'mode',
            header: 'Mode',
            render: (row) => <Badge variant="default">{row.mode}</Badge>
          },
          {
            key: 'homework',
            header: 'HW',
            render: (row) =>
            <Badge variant={row.homework === 'Yes' ? 'primary' : 'default'}>
                  {row.homework}
                </Badge>

          }]
          }
          data={recentEntries} />

      </Card>
    </div>);

}