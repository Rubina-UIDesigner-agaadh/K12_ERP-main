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
  DownloadIcon,
  BellIcon,
  ArchiveIcon,
  EditIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  UsersIcon,
  UtensilsIcon,
  MoonIcon,
  ActivityIcon,
  FileTextIcon,
  FlaskConicalIcon,
  PresentationIcon,
  BookOpenIcon,
  MicIcon,
  GraduationCapIcon } from
'lucide-react';
type GradeGroup = 'preschool' | 'primary' | 'middle' | 'secondary' | 'senior';
const gradeGroups: {
  id: GradeGroup;
  label: string;
  range: string;
  color: string;
  bg: string;
}[] = [
{
  id: 'preschool',
  label: 'Preschool / KG',
  range: 'Pre-KG to KG-2',
  color: 'text-pink-700',
  bg: 'bg-pink-50 border-pink-200'
},
{
  id: 'primary',
  label: 'Primary',
  range: 'Class 1 – 5',
  color: 'text-blue-700',
  bg: 'bg-blue-50 border-blue-200'
},
{
  id: 'middle',
  label: 'Middle School',
  range: 'Class 6 – 8',
  color: 'text-green-700',
  bg: 'bg-green-50 border-green-200'
},
{
  id: 'secondary',
  label: 'Secondary',
  range: 'Class 9 – 10',
  color: 'text-orange-700',
  bg: 'bg-orange-50 border-orange-200'
},
{
  id: 'senior',
  label: 'Senior Secondary',
  range: 'Class 11 – 12',
  color: 'text-purple-700',
  bg: 'bg-purple-50 border-purple-200'
}];

const attendanceData = [
{
  id: 1,
  student: 'Aarav Sharma',
  rollNo: '01',
  status: 'Present',
  arrivalTime: '08:15',
  parentNotified: false
},
{
  id: 2,
  student: 'Priya Patel',
  rollNo: '02',
  status: 'Absent',
  arrivalTime: '—',
  parentNotified: true
},
{
  id: 3,
  student: 'Rohan Mehta',
  rollNo: '03',
  status: 'Late',
  arrivalTime: '09:10',
  parentNotified: true
},
{
  id: 4,
  student: 'Sneha Joshi',
  rollNo: '04',
  status: 'Present',
  arrivalTime: '08:05',
  parentNotified: false
},
{
  id: 5,
  student: 'Karan Verma',
  rollNo: '05',
  status: 'Present',
  arrivalTime: '08:20',
  parentNotified: false
},
{
  id: 6,
  student: 'Ananya Singh',
  rollNo: '06',
  status: 'Present',
  arrivalTime: '08:12',
  parentNotified: false
},
{
  id: 7,
  student: 'Dev Kapoor',
  rollNo: '07',
  status: 'Absent',
  arrivalTime: '—',
  parentNotified: true
},
{
  id: 8,
  student: 'Riya Gupta',
  rollNo: '08',
  status: 'Present',
  arrivalTime: '08:18',
  parentNotified: false
}];

const preschoolActivities = [
{
  id: 1,
  time: '09:00 – 09:45',
  activity: 'Circle Time – Morning Greeting',
  type: 'Routine',
  teacher: 'Ms. Priya Sharma',
  completion: 'Completed'
},
{
  id: 2,
  time: '09:45 – 10:30',
  activity: 'Phonics – Letter A & B',
  type: 'Academic',
  teacher: 'Ms. Priya Sharma',
  completion: 'Completed'
},
{
  id: 3,
  time: '10:30 – 11:00',
  activity: 'Snack Break',
  type: 'Break',
  teacher: '—',
  completion: 'Completed'
},
{
  id: 4,
  time: '11:00 – 11:45',
  activity: 'Number Counting 1–20',
  type: 'Academic',
  teacher: 'Mr. Rajesh Patel',
  completion: 'Completed'
},
{
  id: 5,
  time: '11:45 – 12:30',
  activity: 'Art & Craft – Paper Folding',
  type: 'Creative',
  teacher: 'Ms. Anita Verma',
  completion: 'In Progress'
},
{
  id: 6,
  time: '12:30 – 13:15',
  activity: 'Lunch Break',
  type: 'Break',
  teacher: '—',
  completion: 'Pending'
},
{
  id: 7,
  time: '13:15 – 14:00',
  activity: 'Story Time – The Lion & Mouse',
  type: 'Language',
  teacher: 'Ms. Priya Sharma',
  completion: 'Pending'
}];

const primaryActivities = [
{
  id: 1,
  time: '08:00 – 08:45',
  activity: 'Mathematics – Fractions',
  type: 'Academic',
  teacher: 'Mr. Rajesh Patel',
  completion: 'Completed'
},
{
  id: 2,
  time: '08:45 – 09:30',
  activity: 'English – Reading Comprehension',
  type: 'Academic',
  teacher: 'Ms. Priya Sharma',
  completion: 'Completed'
},
{
  id: 3,
  time: '09:30 – 09:45',
  activity: 'Short Break',
  type: 'Break',
  teacher: '—',
  completion: 'Completed'
},
{
  id: 4,
  time: '09:45 – 10:30',
  activity: 'Science – Plant Life Cycle',
  type: 'Academic',
  teacher: 'Ms. Anita Verma',
  completion: 'In Progress'
},
{
  id: 5,
  time: '10:30 – 11:15',
  activity: 'Class Project – Poster Making',
  type: 'Project',
  teacher: 'Ms. Anita Verma',
  completion: 'In Progress'
},
{
  id: 6,
  time: '11:15 – 12:00',
  activity: 'Lunch Break',
  type: 'Break',
  teacher: '—',
  completion: 'Pending'
},
{
  id: 7,
  time: '12:00 – 12:45',
  activity: 'Physical Education – Outdoor Games',
  type: 'Sports',
  teacher: 'Mr. Suresh Kumar',
  completion: 'Pending'
},
{
  id: 8,
  time: '12:45 – 13:30',
  activity: 'Library Session – Free Reading',
  type: 'Library',
  teacher: '—',
  completion: 'Pending'
}];

const middleActivities = [
{
  id: 1,
  time: '08:00 – 08:45',
  activity: 'Mathematics – Quadratic Equations',
  type: 'Academic',
  teacher: 'Mr. Rajesh Patel',
  completion: 'Completed'
},
{
  id: 2,
  time: '08:45 – 09:30',
  activity: 'Science Lab – Acid-Base Reactions',
  type: 'Lab Work',
  teacher: 'Ms. Anita Verma',
  completion: 'Completed'
},
{
  id: 3,
  time: '09:30 – 09:45',
  activity: 'Break',
  type: 'Break',
  teacher: '—',
  completion: 'Completed'
},
{
  id: 4,
  time: '09:45 – 10:30',
  activity: 'English – Group Discussion: Climate Change',
  type: 'Group Discussion',
  teacher: 'Ms. Priya Sharma',
  completion: 'In Progress'
},
{
  id: 5,
  time: '10:30 – 11:15',
  activity: 'Social Studies – Presentation: World Wars',
  type: 'Presentation',
  teacher: 'Mr. Suresh Kumar',
  completion: 'Pending'
},
{
  id: 6,
  time: '11:15 – 12:00',
  activity: 'Lunch Break',
  type: 'Break',
  teacher: '—',
  completion: 'Pending'
},
{
  id: 7,
  time: '12:00 – 12:45',
  activity: 'Computer Science – Python Basics',
  type: 'Academic',
  teacher: 'Ms. Kavita Nair',
  completion: 'Pending'
},
{
  id: 8,
  time: '12:45 – 13:30',
  activity: 'Physical Education – Athletics',
  type: 'Sports',
  teacher: 'Mr. Suresh Kumar',
  completion: 'Pending'
}];

const secondaryActivities = [
{
  id: 1,
  time: '08:00 – 08:45',
  activity: 'Physics – Laws of Motion',
  type: 'Academic',
  teacher: 'Ms. Anita Verma',
  completion: 'Completed'
},
{
  id: 2,
  time: '08:45 – 09:30',
  activity: 'Chemistry Lab – Titration Practical',
  type: 'Lab Session',
  teacher: 'Mr. Rajesh Patel',
  completion: 'Completed'
},
{
  id: 3,
  time: '09:30 – 09:45',
  activity: 'Break',
  type: 'Break',
  teacher: '—',
  completion: 'Completed'
},
{
  id: 4,
  time: '09:45 – 10:30',
  activity: 'Mathematics – Trigonometry',
  type: 'Academic',
  teacher: 'Mr. Rajesh Patel',
  completion: 'In Progress'
},
{
  id: 5,
  time: '10:30 – 11:15',
  activity: 'Project Work – Social Science Research',
  type: 'Project Work',
  teacher: 'Mr. Suresh Kumar',
  completion: 'Pending'
},
{
  id: 6,
  time: '11:15 – 12:00',
  activity: 'Lunch Break',
  type: 'Break',
  teacher: '—',
  completion: 'Pending'
},
{
  id: 7,
  time: '12:00 – 12:45',
  activity: 'Biology Practical – Microscopy',
  type: 'Practical',
  teacher: 'Ms. Anita Verma',
  completion: 'Pending'
},
{
  id: 8,
  time: '12:45 – 13:30',
  activity: 'English – Essay Writing Practice',
  type: 'Academic',
  teacher: 'Ms. Priya Sharma',
  completion: 'Pending'
}];

const seniorActivities = [
{
  id: 1,
  time: '08:00 – 08:45',
  activity: 'Physics – Electromagnetism',
  type: 'Academic',
  teacher: 'Ms. Anita Verma',
  completion: 'Completed'
},
{
  id: 2,
  time: '08:45 – 09:30',
  activity: 'Chemistry Lab – Organic Synthesis',
  type: 'Lab Session',
  teacher: 'Mr. Rajesh Patel',
  completion: 'Completed'
},
{
  id: 3,
  time: '09:30 – 09:45',
  activity: 'Break',
  type: 'Break',
  teacher: '—',
  completion: 'Completed'
},
{
  id: 4,
  time: '09:45 – 10:30',
  activity: 'Research Project – Environmental Study',
  type: 'Research Project',
  teacher: 'Mr. Suresh Kumar',
  completion: 'In Progress'
},
{
  id: 5,
  time: '10:30 – 11:15',
  activity: 'Seminar – Career in Engineering',
  type: 'Seminar',
  teacher: 'Guest Speaker',
  completion: 'Pending'
},
{
  id: 6,
  time: '11:15 – 12:00',
  activity: 'Lunch Break',
  type: 'Break',
  teacher: '—',
  completion: 'Pending'
},
{
  id: 7,
  time: '12:00 – 12:45',
  activity: 'Biology Practical – Dissection',
  type: 'Practical',
  teacher: 'Ms. Anita Verma',
  completion: 'Pending'
},
{
  id: 8,
  time: '12:45 – 13:30',
  activity: 'Mathematics – Calculus Problem Session',
  type: 'Academic',
  teacher: 'Mr. Rajesh Patel',
  completion: 'Pending'
}];

const mealData = [
{
  id: 1,
  student: 'Aarav Sharma',
  morningSnack: 'Full',
  lunch: 'Full',
  eveningSnack: '—',
  notes: ''
},
{
  id: 2,
  student: 'Priya Patel',
  morningSnack: '—',
  lunch: '—',
  eveningSnack: '—',
  notes: 'Absent'
},
{
  id: 3,
  student: 'Rohan Mehta',
  morningSnack: 'Partial',
  lunch: 'Full',
  eveningSnack: '—',
  notes: 'Picky eater today'
},
{
  id: 4,
  student: 'Sneha Joshi',
  morningSnack: 'Full',
  lunch: 'Partial',
  eveningSnack: '—',
  notes: 'Not feeling well'
},
{
  id: 5,
  student: 'Karan Verma',
  morningSnack: 'Full',
  lunch: 'Full',
  eveningSnack: '—',
  notes: ''
}];

const napData = [
{
  id: 1,
  student: 'Aarav Sharma',
  napStart: '13:00',
  napEnd: '14:00',
  duration: '60 min',
  quality: 'Good'
},
{
  id: 2,
  student: 'Rohan Mehta',
  napStart: '13:05',
  napEnd: '13:45',
  duration: '40 min',
  quality: 'Restless'
},
{
  id: 3,
  student: 'Sneha Joshi',
  napStart: '13:00',
  napEnd: '14:00',
  duration: '60 min',
  quality: 'Good'
},
{
  id: 4,
  student: 'Karan Verma',
  napStart: '13:10',
  napEnd: '13:50',
  duration: '40 min',
  quality: 'Good'
}];

const labWorkData = [
{
  id: 1,
  student: 'Aarav Sharma',
  experiment: 'Acid-Base Titration',
  labType: 'Chemistry',
  status: 'Completed',
  score: '18/20',
  remarks: 'Excellent technique'
},
{
  id: 2,
  student: 'Priya Patel',
  experiment: 'Acid-Base Titration',
  labType: 'Chemistry',
  status: 'Completed',
  score: '15/20',
  remarks: 'Good, needs practice'
},
{
  id: 3,
  student: 'Rohan Mehta',
  experiment: 'Acid-Base Titration',
  labType: 'Chemistry',
  status: 'In Progress',
  score: '—',
  remarks: ''
},
{
  id: 4,
  student: 'Sneha Joshi',
  experiment: 'Acid-Base Titration',
  labType: 'Chemistry',
  status: 'Completed',
  score: '20/20',
  remarks: 'Perfect execution'
},
{
  id: 5,
  student: 'Karan Verma',
  experiment: 'Acid-Base Titration',
  labType: 'Chemistry',
  status: 'Absent',
  score: '—',
  remarks: 'Needs make-up session'
}];

const projectData = [
{
  id: 1,
  student: 'Aarav Sharma',
  project: 'Environmental Impact Study',
  subject: 'Science',
  progress: '75%',
  dueDate: '10 Mar 2026',
  status: 'On Track'
},
{
  id: 2,
  student: 'Priya Patel',
  project: 'Environmental Impact Study',
  subject: 'Science',
  progress: '60%',
  dueDate: '10 Mar 2026',
  status: 'On Track'
},
{
  id: 3,
  student: 'Rohan Mehta',
  project: 'Environmental Impact Study',
  subject: 'Science',
  progress: '30%',
  dueDate: '10 Mar 2026',
  status: 'At Risk'
},
{
  id: 4,
  student: 'Sneha Joshi',
  project: 'Environmental Impact Study',
  subject: 'Science',
  progress: '90%',
  dueDate: '10 Mar 2026',
  status: 'Ahead'
}];

const homeworkCheckData = [
{
  id: 1,
  student: 'Aarav Sharma',
  subject: 'Mathematics',
  hwTitle: 'Fractions Worksheet',
  status: 'Completed',
  quality: 'Good',
  remarks: ''
},
{
  id: 2,
  student: 'Priya Patel',
  subject: 'Mathematics',
  hwTitle: 'Fractions Worksheet',
  status: 'Completed',
  quality: 'Excellent',
  remarks: 'Very neat'
},
{
  id: 3,
  student: 'Rohan Mehta',
  subject: 'Mathematics',
  hwTitle: 'Fractions Worksheet',
  status: 'Incomplete',
  quality: '—',
  remarks: 'Half done'
},
{
  id: 4,
  student: 'Sneha Joshi',
  subject: 'Mathematics',
  hwTitle: 'Fractions Worksheet',
  status: 'Not Done',
  quality: '—',
  remarks: 'Parent informed'
}];

const incidentData = [
{
  id: 1,
  time: '10:15',
  student: 'Rohan Mehta',
  type: 'Minor Injury',
  description: 'Fell during outdoor play, minor knee scrape',
  action: 'First aid applied',
  parentAlert: true,
  severity: 'Low'
},
{
  id: 2,
  time: '11:30',
  student: 'Karan Verma',
  type: 'Behavioral',
  description: 'Refused to participate in group activity',
  action: 'Counselled, rejoined group',
  parentAlert: false,
  severity: 'Low'
},
{
  id: 3,
  time: '14:00',
  student: 'Dev Kapoor',
  type: 'Health',
  description: 'Complained of stomach ache',
  action: 'Parents called, sent home',
  parentAlert: true,
  severity: 'Medium'
}];

const observationsData = [
{
  id: 1,
  student: 'Aarav Sharma',
  observation: 'Showed excellent leadership during group activity',
  category: 'Social',
  teacher: 'Ms. Priya Sharma',
  time: '11:00'
},
{
  id: 2,
  student: 'Sneha Joshi',
  observation: 'Demonstrated improved analytical skills in problem solving',
  category: 'Cognitive',
  teacher: 'Ms. Anita Verma',
  time: '11:45'
},
{
  id: 3,
  student: 'Ananya Singh',
  observation: 'Presented research findings confidently to the class',
  category: 'Communication',
  teacher: 'Ms. Priya Sharma',
  time: '09:45'
},
{
  id: 4,
  student: 'Riya Gupta',
  observation: 'Helped a classmate who was struggling with the experiment',
  category: 'Emotional',
  teacher: 'Ms. Priya Sharma',
  time: '10:30'
}];

const auditData = [
{
  id: 1,
  action: 'Daily Log Created',
  user: 'Ms. Priya Sharma',
  dateTime: '25 Feb 2026, 08:00',
  details: 'Class 8-A log for 25 Feb 2026'
},
{
  id: 2,
  action: 'Attendance Marked',
  user: 'Ms. Priya Sharma',
  dateTime: '25 Feb 2026, 08:30',
  details: '8 students marked, 2 absent'
},
{
  id: 3,
  action: 'Incident Logged',
  user: 'Ms. Priya Sharma',
  dateTime: '25 Feb 2026, 10:20',
  details: 'Minor injury — Rohan Mehta'
},
{
  id: 4,
  action: 'Lab Record Updated',
  user: 'Mr. Rajesh Patel',
  dateTime: '25 Feb 2026, 11:00',
  details: 'Chemistry lab scores entered'
}];

function getActivityTypeVariant(
type: string)
: 'primary' | 'success' | 'default' | 'info' | 'warning' | 'danger' {
  const map: Record<
    string,
    'primary' | 'success' | 'default' | 'info' | 'warning' | 'danger'> =
  {
    Academic: 'primary',
    Creative: 'success',
    Break: 'default',
    Routine: 'info',
    Language: 'warning',
    Project: 'success',
    'Project Work': 'success',
    Sports: 'info',
    Library: 'default',
    'Lab Work': 'danger',
    'Lab Session': 'danger',
    'Group Discussion': 'warning',
    Presentation: 'primary',
    Practical: 'danger',
    'Research Project': 'success',
    Seminar: 'info'
  };
  return map[type] || 'default';
}
export function ClassroomOperations() {
  const [gradeGroup, setGradeGroup] = useState<GradeGroup>('preschool');
  const [activeTab, setActiveTab] = useState('attendance');
  const [filterDate, setFilterDate] = useState('2026-02-25');
  const [filterClass, setFilterClass] = useState('');
  const [searchStudent, setSearchStudent] = useState('');
  const presentCount = attendanceData.filter(
    (s) => s.status === 'Present'
  ).length;
  const absentCount = attendanceData.filter((s) => s.status === 'Absent').length;
  const lateCount = attendanceData.filter((s) => s.status === 'Late').length;
  const getActivities = () => {
    switch (gradeGroup) {
      case 'preschool':
        return preschoolActivities;
      case 'primary':
        return primaryActivities;
      case 'middle':
        return middleActivities;
      case 'secondary':
        return secondaryActivities;
      case 'senior':
        return seniorActivities;
      default:
        return preschoolActivities;
    }
  };
  const getClassOptions = () => {
    switch (gradeGroup) {
      case 'preschool':
        return [
        {
          value: '',
          label: 'All'
        },
        {
          value: 'pre-kg',
          label: 'Pre-KG'
        },
        {
          value: 'kg1',
          label: 'KG-1'
        },
        {
          value: 'kg2',
          label: 'KG-2'
        }];

      case 'primary':
        return [
        {
          value: '',
          label: 'All'
        },
        ...Array.from(
          {
            length: 5
          },
          (_, i) => ({
            value: `class-${i + 1}`,
            label: `Class ${i + 1}`
          })
        )];

      case 'middle':
        return [
        {
          value: '',
          label: 'All'
        },
        ...Array.from(
          {
            length: 3
          },
          (_, i) => ({
            value: `class-${i + 6}`,
            label: `Class ${i + 6}`
          })
        )];

      case 'secondary':
        return [
        {
          value: '',
          label: 'All'
        },
        {
          value: 'class-9',
          label: 'Class 9'
        },
        {
          value: 'class-10',
          label: 'Class 10'
        }];

      case 'senior':
        return [
        {
          value: '',
          label: 'All'
        },
        {
          value: 'class-11',
          label: 'Class 11'
        },
        {
          value: 'class-12',
          label: 'Class 12'
        }];

    }
  };
  const currentGroup = gradeGroups.find((g) => g.id === gradeGroup)!;
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Classroom Operations
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Daily classroom log, attendance, activities and incident management
            for all grades
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<BellIcon className="w-4 h-4" />}>

            Send Parent Alert
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<DownloadIcon className="w-4 h-4" />}>

            Export Daily Log
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ArchiveIcon className="w-4 h-4" />}>

            Archive Log
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<PlusIcon className="w-4 h-4" />}>

            New Log Entry
          </Button>
        </div>
      </div>

      {/* Grade Group Selector */}
      <Card>
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-700">
            Select Grade Group
          </p>
          <div className="flex flex-wrap gap-2">
            {gradeGroups.map((g) =>
            <button
              key={g.id}
              onClick={() => {
                setGradeGroup(g.id);
                setActiveTab('attendance');
              }}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${gradeGroup === g.id ? `${g.bg} ${g.color} border-current` : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>

                <span>{g.label}</span>
                <span className="ml-1.5 text-xs opacity-70">({g.range})</span>
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap gap-3 items-end">
          <Input
            label="Date"
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-40" />

          <Select
            label="Class"
            options={getClassOptions()}
            value={filterClass}
            onChange={setFilterClass}
            className="w-40" />

          <Input
            label="Search Student"
            placeholder="Search by student name..."
            value={searchStudent}
            onChange={(e) => setSearchStudent(e.target.value)}
            className="w-56" />

          <div className="flex items-end gap-2 ml-auto">
            <Button variant="outline" size="sm">
              Reset
            </Button>
            <Button variant="primary" size="sm">
              Apply
            </Button>
          </div>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <UsersIcon className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
              Total
            </span>
          </div>
          <p className="text-2xl font-bold text-blue-700">
            {attendanceData.length}
          </p>
          <p className="text-xs text-blue-500 mt-1">{currentGroup.label}</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircleIcon className="w-4 h-4 text-green-600" />
            <span className="text-xs font-medium text-green-600 uppercase tracking-wide">
              Present
            </span>
          </div>
          <p className="text-2xl font-bold text-green-700">{presentCount}</p>
          <p className="text-xs text-green-500 mt-1">
            {Math.round(presentCount / attendanceData.length * 100)}%
            attendance
          </p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangleIcon className="w-4 h-4 text-red-600" />
            <span className="text-xs font-medium text-red-600 uppercase tracking-wide">
              Absent
            </span>
          </div>
          <p className="text-2xl font-bold text-red-700">{absentCount}</p>
          <p className="text-xs text-red-500 mt-1">Parents notified</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <ClockIcon className="w-4 h-4 text-yellow-600" />
            <span className="text-xs font-medium text-yellow-600 uppercase tracking-wide">
              Late
            </span>
          </div>
          <p className="text-2xl font-bold text-yellow-700">{lateCount}</p>
          <p className="text-xs text-yellow-500 mt-1">After 09:00 AM</p>
        </div>
      </div>

      {/* Main Tabs — dynamic based on grade group */}
      <Card noPadding>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-5 pt-4 overflow-x-auto">
            <TabsList>
              <TabsTrigger value="attendance">
                <UsersIcon className="w-3.5 h-3.5" /> Attendance
              </TabsTrigger>
              <TabsTrigger value="activities">
                <ActivityIcon className="w-3.5 h-3.5" /> Activities
              </TabsTrigger>
              {gradeGroup === 'preschool' &&
              <>
                  <TabsTrigger value="meals">
                    <UtensilsIcon className="w-3.5 h-3.5" /> Meal Tracking
                  </TabsTrigger>
                  <TabsTrigger value="nap">
                    <MoonIcon className="w-3.5 h-3.5" /> Nap Tracking
                  </TabsTrigger>
                </>
              }
              {gradeGroup === 'primary' &&
              <>
                  <TabsTrigger value="projects">
                    <BookOpenIcon className="w-3.5 h-3.5" /> Class Projects
                  </TabsTrigger>
                  <TabsTrigger value="hwcheck">
                    <CheckCircleIcon className="w-3.5 h-3.5" /> Homework Check
                  </TabsTrigger>
                </>
              }
              {gradeGroup === 'middle' &&
              <>
                  <TabsTrigger value="lab">
                    <FlaskConicalIcon className="w-3.5 h-3.5" /> Lab Work
                  </TabsTrigger>
                  <TabsTrigger value="projects">
                    <BookOpenIcon className="w-3.5 h-3.5" /> Group Discussions
                  </TabsTrigger>
                </>
              }
              {(gradeGroup === 'secondary' || gradeGroup === 'senior') &&
              <>
                  <TabsTrigger value="lab">
                    <FlaskConicalIcon className="w-3.5 h-3.5" /> Lab Sessions
                  </TabsTrigger>
                  <TabsTrigger value="projects">
                    <GraduationCapIcon className="w-3.5 h-3.5" />{' '}
                    {gradeGroup === 'senior' ?
                  'Research Projects' :
                  'Project Work'}
                  </TabsTrigger>
                  {gradeGroup === 'senior' &&
                <TabsTrigger value="seminars">
                      <MicIcon className="w-3.5 h-3.5" /> Seminars
                    </TabsTrigger>
                }
                </>
              }
              <TabsTrigger value="incidents">
                <AlertTriangleIcon className="w-3.5 h-3.5" /> Incidents
              </TabsTrigger>
              <TabsTrigger value="observations">
                <FileTextIcon className="w-3.5 h-3.5" /> Observations
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Attendance */}
          <TabsContent value="attendance" className="p-5">
            <Table
              columns={[
              {
                key: 'rollNo',
                header: 'Roll No'
              },
              {
                key: 'student',
                header: 'Student Name',
                render: (row) =>
                <span className="font-medium text-gray-900">
                      {row.student}
                    </span>

              },
              {
                key: 'status',
                header: 'Status',
                render: (row) =>
                <Badge
                  variant={
                  row.status === 'Present' ?
                  'success' :
                  row.status === 'Absent' ?
                  'danger' :
                  'warning'
                  }>

                      {row.status}
                    </Badge>

              },
              {
                key: 'arrivalTime',
                header: 'Arrival Time'
              },
              {
                key: 'parentNotified',
                header: 'Parent Notified',
                render: (row) =>
                row.parentNotified ?
                <Badge variant="info">Notified</Badge> :

                <span className="text-gray-400 text-xs">—</span>

              },
              {
                key: 'actions',
                header: 'Actions',
                render: (row) =>
                <div className="flex gap-1">
                      <Button
                    variant="ghost"
                    size="xs"
                    leftIcon={<EditIcon className="w-3 h-3" />}>

                        Edit
                      </Button>
                      {(row.status === 'Absent' || row.status === 'Late') &&
                  !row.parentNotified &&
                  <Button
                    variant="ghost"
                    size="xs"
                    leftIcon={<BellIcon className="w-3 h-3" />}>

                            Alert
                          </Button>
                  }
                    </div>

              }]
              }
              data={attendanceData} />

          </TabsContent>

          {/* Activities */}
          <TabsContent value="activities" className="p-5">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">{currentGroup.label}</span> —{' '}
                {new Date(filterDate).toLocaleDateString('en-IN', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<PlusIcon className="w-4 h-4" />}>

                Add Activity
              </Button>
            </div>
            <Table
              columns={[
              {
                key: 'time',
                header: 'Time Slot',
                render: (row) =>
                <span className="text-xs font-mono text-gray-600">
                      {row.time}
                    </span>

              },
              {
                key: 'activity',
                header: 'Activity',
                render: (row) =>
                <span className="font-medium text-gray-900">
                      {row.activity}
                    </span>

              },
              {
                key: 'type',
                header: 'Type',
                render: (row) =>
                <Badge variant={getActivityTypeVariant(row.type)}>
                      {row.type}
                    </Badge>

              },
              {
                key: 'teacher',
                header: 'Teacher'
              },
              {
                key: 'completion',
                header: 'Status',
                render: (row) =>
                <Badge
                  variant={
                  row.completion === 'Completed' ?
                  'success' :
                  row.completion === 'In Progress' ?
                  'primary' :
                  'default'
                  }>

                      {row.completion}
                    </Badge>

              },
              {
                key: 'actions',
                header: 'Actions',
                render: () =>
                <Button
                  variant="ghost"
                  size="xs"
                  leftIcon={<EditIcon className="w-3 h-3" />}>

                      Edit
                    </Button>

              }]
              }
              data={getActivities()} />

          </TabsContent>

          {/* Preschool: Meals */}
          {gradeGroup === 'preschool' &&
          <TabsContent value="meals" className="p-5">
              <Table
              columns={[
              {
                key: 'student',
                header: 'Student',
                render: (row) =>
                <span className="font-medium text-gray-900">
                        {row.student}
                      </span>

              },
              {
                key: 'morningSnack',
                header: 'Morning Snack',
                render: (row) =>
                <Badge
                  variant={
                  row.morningSnack === 'Full' ?
                  'success' :
                  row.morningSnack === 'Partial' ?
                  'warning' :
                  'default'
                  }>

                        {row.morningSnack}
                      </Badge>

              },
              {
                key: 'lunch',
                header: 'Lunch',
                render: (row) =>
                <Badge
                  variant={
                  row.lunch === 'Full' ?
                  'success' :
                  row.lunch === 'Partial' ?
                  'warning' :
                  'default'
                  }>

                        {row.lunch}
                      </Badge>

              },
              {
                key: 'eveningSnack',
                header: 'Evening Snack'
              },
              {
                key: 'notes',
                header: 'Notes',
                render: (row) =>
                <span className="text-xs text-gray-500">
                        {row.notes || '—'}
                      </span>

              },
              {
                key: 'actions',
                header: 'Actions',
                render: () =>
                <Button
                  variant="ghost"
                  size="xs"
                  leftIcon={<EditIcon className="w-3 h-3" />}>

                        Edit
                      </Button>

              }]
              }
              data={mealData} />

            </TabsContent>
          }

          {/* Preschool: Nap */}
          {gradeGroup === 'preschool' &&
          <TabsContent value="nap" className="p-5">
              <Table
              columns={[
              {
                key: 'student',
                header: 'Student',
                render: (row) =>
                <span className="font-medium text-gray-900">
                        {row.student}
                      </span>

              },
              {
                key: 'napStart',
                header: 'Nap Start'
              },
              {
                key: 'napEnd',
                header: 'Nap End'
              },
              {
                key: 'duration',
                header: 'Duration'
              },
              {
                key: 'quality',
                header: 'Quality',
                render: (row) =>
                <Badge
                  variant={row.quality === 'Good' ? 'success' : 'warning'}>

                        {row.quality}
                      </Badge>

              },
              {
                key: 'actions',
                header: 'Actions',
                render: () =>
                <Button
                  variant="ghost"
                  size="xs"
                  leftIcon={<EditIcon className="w-3 h-3" />}>

                        Edit
                      </Button>

              }]
              }
              data={napData} />

            </TabsContent>
          }

          {/* Primary: Class Projects */}
          {gradeGroup === 'primary' &&
          <TabsContent value="projects" className="p-5">
              <div className="flex justify-end mb-4">
                <Button
                variant="primary"
                size="sm"
                leftIcon={<PlusIcon className="w-4 h-4" />}>

                  Add Project
                </Button>
              </div>
              <Table
              columns={[
              {
                key: 'student',
                header: 'Student',
                render: (row) =>
                <span className="font-medium text-gray-900">
                        {row.student}
                      </span>

              },
              {
                key: 'project',
                header: 'Project Title'
              },
              {
                key: 'subject',
                header: 'Subject'
              },
              {
                key: 'progress',
                header: 'Progress',
                render: (row) =>
                <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                      className="h-2 rounded-full bg-blue-500"
                      style={{
                        width: row.progress
                      }} />

                        </div>
                        <span className="text-xs text-gray-600">
                          {row.progress}
                        </span>
                      </div>

              },
              {
                key: 'dueDate',
                header: 'Due Date'
              },
              {
                key: 'status',
                header: 'Status',
                render: (row) =>
                <Badge
                  variant={
                  row.status === 'Ahead' ?
                  'success' :
                  row.status === 'On Track' ?
                  'primary' :
                  'warning'
                  }>

                        {row.status}
                      </Badge>

              },
              {
                key: 'actions',
                header: 'Actions',
                render: () =>
                <Button
                  variant="ghost"
                  size="xs"
                  leftIcon={<EditIcon className="w-3 h-3" />}>

                        Edit
                      </Button>

              }]
              }
              data={projectData} />

            </TabsContent>
          }

          {/* Primary: Homework Check */}
          {gradeGroup === 'primary' &&
          <TabsContent value="hwcheck" className="p-5">
              <Table
              columns={[
              {
                key: 'student',
                header: 'Student',
                render: (row) =>
                <span className="font-medium text-gray-900">
                        {row.student}
                      </span>

              },
              {
                key: 'subject',
                header: 'Subject'
              },
              {
                key: 'hwTitle',
                header: 'Homework'
              },
              {
                key: 'status',
                header: 'Status',
                render: (row) =>
                <Badge
                  variant={
                  row.status === 'Completed' ?
                  'success' :
                  row.status === 'Incomplete' ?
                  'warning' :
                  'danger'
                  }>

                        {row.status}
                      </Badge>

              },
              {
                key: 'quality',
                header: 'Quality',
                render: (row) =>
                <span className="text-sm text-gray-600">
                        {row.quality}
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
                render: () =>
                <Button
                  variant="ghost"
                  size="xs"
                  leftIcon={<EditIcon className="w-3 h-3" />}>

                        Edit
                      </Button>

              }]
              }
              data={homeworkCheckData} />

            </TabsContent>
          }

          {/* Middle/Secondary/Senior: Lab Work */}
          {(gradeGroup === 'middle' ||
          gradeGroup === 'secondary' ||
          gradeGroup === 'senior') &&
          <TabsContent value="lab" className="p-5">
              <div className="flex justify-end mb-4">
                <Button
                variant="primary"
                size="sm"
                leftIcon={<PlusIcon className="w-4 h-4" />}>

                  Log Lab Session
                </Button>
              </div>
              <Table
              columns={[
              {
                key: 'student',
                header: 'Student',
                render: (row) =>
                <span className="font-medium text-gray-900">
                        {row.student}
                      </span>

              },
              {
                key: 'experiment',
                header: 'Experiment / Activity'
              },
              {
                key: 'labType',
                header: 'Lab Type'
              },
              {
                key: 'status',
                header: 'Status',
                render: (row) =>
                <Badge
                  variant={
                  row.status === 'Completed' ?
                  'success' :
                  row.status === 'In Progress' ?
                  'primary' :
                  'danger'
                  }>

                        {row.status}
                      </Badge>

              },
              {
                key: 'score',
                header: 'Score'
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
                render: () =>
                <Button
                  variant="ghost"
                  size="xs"
                  leftIcon={<EditIcon className="w-3 h-3" />}>

                        Edit
                      </Button>

              }]
              }
              data={labWorkData} />

            </TabsContent>
          }

          {/* Middle: Group Discussions / Secondary+Senior: Project Work / Research */}
          {(gradeGroup === 'middle' ||
          gradeGroup === 'secondary' ||
          gradeGroup === 'senior') &&
          <TabsContent value="projects" className="p-5">
              <div className="flex justify-end mb-4">
                <Button
                variant="primary"
                size="sm"
                leftIcon={<PlusIcon className="w-4 h-4" />}>

                  {gradeGroup === 'middle' ?
                'Add Discussion' :
                gradeGroup === 'senior' ?
                'Add Research Project' :
                'Add Project'}
                </Button>
              </div>
              <Table
              columns={[
              {
                key: 'student',
                header: 'Student',
                render: (row) =>
                <span className="font-medium text-gray-900">
                        {row.student}
                      </span>

              },
              {
                key: 'project',
                header:
                gradeGroup === 'middle' ?
                'Discussion Topic' :
                'Project Title'
              },
              {
                key: 'subject',
                header: 'Subject'
              },
              {
                key: 'progress',
                header: 'Progress',
                render: (row) =>
                <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                      className="h-2 rounded-full bg-blue-500"
                      style={{
                        width: row.progress
                      }} />

                        </div>
                        <span className="text-xs text-gray-600">
                          {row.progress}
                        </span>
                      </div>

              },
              {
                key: 'dueDate',
                header: 'Due Date'
              },
              {
                key: 'status',
                header: 'Status',
                render: (row) =>
                <Badge
                  variant={
                  row.status === 'Ahead' ?
                  'success' :
                  row.status === 'On Track' ?
                  'primary' :
                  'warning'
                  }>

                        {row.status}
                      </Badge>

              },
              {
                key: 'actions',
                header: 'Actions',
                render: () =>
                <Button
                  variant="ghost"
                  size="xs"
                  leftIcon={<EditIcon className="w-3 h-3" />}>

                        Edit
                      </Button>

              }]
              }
              data={projectData} />

            </TabsContent>
          }

          {/* Senior: Seminars */}
          {gradeGroup === 'senior' &&
          <TabsContent value="seminars" className="p-5">
              <div className="flex justify-end mb-4">
                <Button
                variant="primary"
                size="sm"
                leftIcon={<PlusIcon className="w-4 h-4" />}>

                  Schedule Seminar
                </Button>
              </div>
              <div className="space-y-3">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Career in Engineering — Guest Lecture
                      </h4>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Speaker: Mr. Vikram Mehta, IIT Bombay Alumni
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        25 Feb 2026 · 10:30 – 11:15 · Class 12-A, 12-B
                      </p>
                    </div>
                    <Badge variant="success">Scheduled</Badge>
                  </div>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Environmental Science Research Presentation
                      </h4>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Presenter: Student Group — Aarav, Sneha, Priya
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        28 Feb 2026 · 09:00 – 09:45 · Class 11-A
                      </p>
                    </div>
                    <Badge variant="warning">Upcoming</Badge>
                  </div>
                </div>
              </div>
            </TabsContent>
          }

          {/* Incidents */}
          <TabsContent value="incidents" className="p-5">
            <div className="flex justify-end mb-4">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<PlusIcon className="w-4 h-4" />}>

                Log Incident
              </Button>
            </div>
            <Table
              columns={[
              {
                key: 'time',
                header: 'Time',
                render: (row) =>
                <span className="text-xs font-mono">{row.time}</span>

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
                key: 'type',
                header: 'Type',
                render: (row) =>
                <Badge
                  variant={
                  row.type === 'Minor Injury' ?
                  'warning' :
                  row.type === 'Health' ?
                  'danger' :
                  'default'
                  }>

                      {row.type}
                    </Badge>

              },
              {
                key: 'description',
                header: 'Description',
                render: (row) =>
                <span className="text-sm text-gray-600 max-w-xs block">
                      {row.description}
                    </span>

              },
              {
                key: 'action',
                header: 'Action Taken',
                render: (row) =>
                <span className="text-sm text-gray-600">{row.action}</span>

              },
              {
                key: 'severity',
                header: 'Severity',
                render: (row) =>
                <Badge
                  variant={
                  row.severity === 'Low' ?
                  'success' :
                  row.severity === 'Medium' ?
                  'warning' :
                  'danger'
                  }>

                      {row.severity}
                    </Badge>

              },
              {
                key: 'parentAlert',
                header: 'Parent Alert',
                render: (row) =>
                row.parentAlert ?
                <Badge variant="info">Sent</Badge> :

                <Button
                  variant="ghost"
                  size="xs"
                  leftIcon={<BellIcon className="w-3 h-3" />}>

                        Send
                      </Button>

              },
              {
                key: 'actions',
                header: 'Actions',
                render: () =>
                <Button
                  variant="ghost"
                  size="xs"
                  leftIcon={<EditIcon className="w-3 h-3" />}>

                      Edit
                    </Button>

              }]
              }
              data={incidentData} />

          </TabsContent>

          {/* Observations */}
          <TabsContent value="observations" className="p-5">
            <div className="flex justify-end mb-4">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<PlusIcon className="w-4 h-4" />}>

                Add Observation
              </Button>
            </div>
            <Table
              columns={[
              {
                key: 'time',
                header: 'Time',
                render: (row) =>
                <span className="text-xs font-mono">{row.time}</span>

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
                key: 'observation',
                header: 'Observation',
                render: (row) =>
                <span className="text-sm text-gray-700">
                      {row.observation}
                    </span>

              },
              {
                key: 'category',
                header: 'Category',
                render: (row) => {
                  const v: Record<
                    string,
                    'primary' | 'success' | 'info' | 'warning'> =
                  {
                    Social: 'primary',
                    Cognitive: 'success',
                    Communication: 'info',
                    Emotional: 'warning',
                    Motor: 'success'
                  };
                  return (
                    <Badge variant={v[row.category] || 'default'}>
                        {row.category}
                      </Badge>);

                }
              },
              {
                key: 'teacher',
                header: 'Teacher'
              },
              {
                key: 'actions',
                header: 'Actions',
                render: () =>
                <Button
                  variant="ghost"
                  size="xs"
                  leftIcon={<EditIcon className="w-3 h-3" />}>

                      Edit
                    </Button>

              }]
              }
              data={observationsData} />

          </TabsContent>
        </Tabs>
      </Card>

      {/* Audit Trail */}
      <Card title="Audit Trail">
        <Table
          columns={[
          {
            key: 'action',
            header: 'Action',
            render: (row) =>
            <span className="font-medium text-gray-800">{row.action}</span>

          },
          {
            key: 'user',
            header: 'User'
          },
          {
            key: 'dateTime',
            header: 'Date & Time',
            render: (row) =>
            <span className="text-xs text-gray-500">{row.dateTime}</span>

          },
          {
            key: 'details',
            header: 'Details',
            render: (row) =>
            <span className="text-sm text-gray-600">{row.details}</span>

          }]
          }
          data={auditData} />

      </Card>
    </div>);

}