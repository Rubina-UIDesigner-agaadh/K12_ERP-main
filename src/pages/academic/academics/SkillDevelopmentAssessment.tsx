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
  SearchIcon,
  EditIcon,
  EyeIcon,
  UploadIcon,
  PaperclipIcon,
  ActivityIcon,
  UsersIcon,
  BrainIcon,
  MessageSquareIcon,
  HeartIcon,
  ZapIcon,
  CalendarIcon,
  UserIcon,
  BookOpenIcon,
  FlaskConicalIcon,
  LightbulbIcon,
  MicIcon,
  TrendingUpIcon,
  GraduationCapIcon,
  TargetIcon,
  ShieldIcon,
  StarIcon } from
'lucide-react';
type MilestoneStatus = 'Yes' | 'No' | 'Partial';
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
  range: 'Pre-KG – KG-2',
  color: 'text-pink-700',
  bg: 'bg-pink-50 border-pink-200'
},
{
  id: 'primary',
  label: 'Primary',
  range: 'Class 1–5',
  color: 'text-blue-700',
  bg: 'bg-blue-50 border-blue-200'
},
{
  id: 'middle',
  label: 'Middle School',
  range: 'Class 6–8',
  color: 'text-green-700',
  bg: 'bg-green-50 border-green-200'
},
{
  id: 'secondary',
  label: 'Secondary',
  range: 'Class 9–10',
  color: 'text-orange-700',
  bg: 'bg-orange-50 border-orange-200'
},
{
  id: 'senior',
  label: 'Senior Secondary',
  range: 'Class 11–12',
  color: 'text-purple-700',
  bg: 'bg-purple-50 border-purple-200'
}];

const skillCategoriesByGroup: Record<
  GradeGroup,
  {
    category: string;
    icon: React.ReactNode;
    color: string;
    bg: string;
  }[]> =
{
  preschool: [
  {
    category: 'Fine Motor',
    icon: <ActivityIcon className="w-5 h-5" />,
    color: 'text-purple-600',
    bg: 'bg-purple-50'
  },
  {
    category: 'Gross Motor',
    icon: <ZapIcon className="w-5 h-5" />,
    color: 'text-orange-600',
    bg: 'bg-orange-50'
  },
  {
    category: 'Social Interaction',
    icon: <UsersIcon className="w-5 h-5" />,
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  {
    category: 'Language Development',
    icon: <MessageSquareIcon className="w-5 h-5" />,
    color: 'text-green-600',
    bg: 'bg-green-50'
  },
  {
    category: 'Emotional Development',
    icon: <HeartIcon className="w-5 h-5" />,
    color: 'text-red-600',
    bg: 'bg-red-50'
  },
  {
    category: 'Cognitive Skills',
    icon: <BrainIcon className="w-5 h-5" />,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50'
  }],

  primary: [
  {
    category: 'Reading Comprehension',
    icon: <BookOpenIcon className="w-5 h-5" />,
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  {
    category: 'Mathematical Reasoning',
    icon: <BrainIcon className="w-5 h-5" />,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50'
  },
  {
    category: 'Creative Expression',
    icon: <StarIcon className="w-5 h-5" />,
    color: 'text-pink-600',
    bg: 'bg-pink-50'
  },
  {
    category: 'Social Skills',
    icon: <UsersIcon className="w-5 h-5" />,
    color: 'text-green-600',
    bg: 'bg-green-50'
  },
  {
    category: 'Physical Development',
    icon: <ZapIcon className="w-5 h-5" />,
    color: 'text-orange-600',
    bg: 'bg-orange-50'
  },
  {
    category: 'Environmental Awareness',
    icon: <FlaskConicalIcon className="w-5 h-5" />,
    color: 'text-teal-600',
    bg: 'bg-teal-50'
  }],

  middle: [
  {
    category: 'Critical Thinking',
    icon: <LightbulbIcon className="w-5 h-5" />,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50'
  },
  {
    category: 'Communication Skills',
    icon: <MessageSquareIcon className="w-5 h-5" />,
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  {
    category: 'Teamwork & Collaboration',
    icon: <UsersIcon className="w-5 h-5" />,
    color: 'text-green-600',
    bg: 'bg-green-50'
  },
  {
    category: 'Scientific Inquiry',
    icon: <FlaskConicalIcon className="w-5 h-5" />,
    color: 'text-purple-600',
    bg: 'bg-purple-50'
  },
  {
    category: 'Digital Literacy',
    icon: <BrainIcon className="w-5 h-5" />,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50'
  },
  {
    category: 'Leadership',
    icon: <StarIcon className="w-5 h-5" />,
    color: 'text-orange-600',
    bg: 'bg-orange-50'
  }],

  secondary: [
  {
    category: 'Analytical Thinking',
    icon: <BrainIcon className="w-5 h-5" />,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50'
  },
  {
    category: 'Research Skills',
    icon: <SearchIcon className="w-5 h-5" />,
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  {
    category: 'Problem Solving',
    icon: <LightbulbIcon className="w-5 h-5" />,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50'
  },
  {
    category: 'Public Speaking',
    icon: <MicIcon className="w-5 h-5" />,
    color: 'text-red-600',
    bg: 'bg-red-50'
  },
  {
    category: 'Self-Management',
    icon: <TargetIcon className="w-5 h-5" />,
    color: 'text-green-600',
    bg: 'bg-green-50'
  },
  {
    category: 'Career Awareness',
    icon: <TrendingUpIcon className="w-5 h-5" />,
    color: 'text-purple-600',
    bg: 'bg-purple-50'
  }],

  senior: [
  {
    category: 'Advanced Research',
    icon: <FlaskConicalIcon className="w-5 h-5" />,
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  {
    category: 'Entrepreneurial Thinking',
    icon: <TrendingUpIcon className="w-5 h-5" />,
    color: 'text-green-600',
    bg: 'bg-green-50'
  },
  {
    category: 'Technical Skills',
    icon: <BrainIcon className="w-5 h-5" />,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50'
  },
  {
    category: 'Professional Communication',
    icon: <MessageSquareIcon className="w-5 h-5" />,
    color: 'text-purple-600',
    bg: 'bg-purple-50'
  },
  {
    category: 'Civic Responsibility',
    icon: <ShieldIcon className="w-5 h-5" />,
    color: 'text-orange-600',
    bg: 'bg-orange-50'
  },
  {
    category: 'Life Skills',
    icon: <StarIcon className="w-5 h-5" />,
    color: 'text-pink-600',
    bg: 'bg-pink-50'
  }]

};
const classOptionsByGroup: Record<
  GradeGroup,
  {
    value: string;
    label: string;
  }[]> =
{
  preschool: [
  {
    value: '',
    label: 'All Classes'
  },
  {
    value: 'Pre-KG',
    label: 'Pre-KG'
  },
  {
    value: 'KG-1',
    label: 'KG-1'
  },
  {
    value: 'KG-2',
    label: 'KG-2'
  }],

  primary: [
  {
    value: '',
    label: 'All Classes'
  },
  ...Array.from(
    {
      length: 5
    },
    (_, i) => ({
      value: `Class ${i + 1}`,
      label: `Class ${i + 1}`
    })
  )],

  middle: [
  {
    value: '',
    label: 'All Classes'
  },
  ...Array.from(
    {
      length: 3
    },
    (_, i) => ({
      value: `Class ${i + 6}`,
      label: `Class ${i + 6}`
    })
  )],

  secondary: [
  {
    value: '',
    label: 'All Classes'
  },
  {
    value: 'Class 9',
    label: 'Class 9'
  },
  {
    value: 'Class 10',
    label: 'Class 10'
  }],

  senior: [
  {
    value: '',
    label: 'All Classes'
  },
  {
    value: 'Class 11',
    label: 'Class 11'
  },
  {
    value: 'Class 12',
    label: 'Class 12'
  }]

};
const allAssessments = [
// Preschool
{
  id: 'SA001',
  studentName: 'Aarav Mehta',
  class: 'KG-1',
  gradeGroup: 'preschool',
  rollNo: '01',
  skillCategory: 'Fine Motor',
  skillName: 'Pencil grip and letter formation',
  assessmentDate: '2024-01-10',
  milestoneAchieved: 'Yes' as MilestoneStatus,
  observation: 'Student demonstrates correct pencil grip consistently.',
  teacherRemarks: 'Excellent progress. Ready for cursive writing.',
  parentRemark: 'Practices writing at home daily.',
  evidenceCount: 2,
  assessedBy: 'Mrs. Priya Sharma'
},
{
  id: 'SA002',
  studentName: 'Diya Patel',
  class: 'KG-2',
  gradeGroup: 'preschool',
  rollNo: '05',
  skillCategory: 'Gross Motor',
  skillName: 'Balance and coordination (beam walking)',
  assessmentDate: '2024-01-11',
  milestoneAchieved: 'Partial' as MilestoneStatus,
  observation: 'Can walk beam with support. Needs more practice.',
  teacherRemarks: 'Improving steadily. Additional PT sessions recommended.',
  parentRemark: '',
  evidenceCount: 1,
  assessedBy: 'Mr. Vijay Rao'
},
{
  id: 'SA003',
  studentName: 'Rohan Gupta',
  class: 'KG-1',
  gradeGroup: 'preschool',
  rollNo: '12',
  skillCategory: 'Social Interaction',
  skillName: 'Cooperative play and turn-taking',
  assessmentDate: '2024-01-12',
  milestoneAchieved: 'Yes' as MilestoneStatus,
  observation: 'Actively participates in group games. Waits for turn.',
  teacherRemarks: 'Strong social skills. Good leadership qualities emerging.',
  parentRemark: 'Very social at home too.',
  evidenceCount: 0,
  assessedBy: 'Mrs. Anita Patel'
},
// Primary
{
  id: 'SA004',
  studentName: 'Sneha Iyer',
  class: 'Class 3',
  gradeGroup: 'primary',
  rollNo: '08',
  skillCategory: 'Reading Comprehension',
  skillName: 'Reading and understanding grade-level texts',
  assessmentDate: '2024-01-13',
  milestoneAchieved: 'Partial' as MilestoneStatus,
  observation: 'Reads fluently but struggles with inference questions.',
  teacherRemarks: 'Encourage more reading of varied texts.',
  parentRemark: 'Reads books at home regularly.',
  evidenceCount: 1,
  assessedBy: 'Mrs. Priya Sharma'
},
{
  id: 'SA005',
  studentName: 'Arjun Singh',
  class: 'Class 2',
  gradeGroup: 'primary',
  rollNo: '03',
  skillCategory: 'Mathematical Reasoning',
  skillName: 'Number sense and basic operations',
  assessmentDate: '2024-01-14',
  milestoneAchieved: 'Yes' as MilestoneStatus,
  observation: 'Demonstrates strong number sense. Solves problems quickly.',
  teacherRemarks: 'Ready for advanced problem sets.',
  parentRemark: 'Loves math puzzles.',
  evidenceCount: 2,
  assessedBy: 'Mr. Rajesh Kumar'
},
{
  id: 'SA006',
  studentName: 'Kavya Nair',
  class: 'Class 4',
  gradeGroup: 'primary',
  rollNo: '15',
  skillCategory: 'Creative Expression',
  skillName: 'Art, craft and creative writing',
  assessmentDate: '2024-01-15',
  milestoneAchieved: 'Yes' as MilestoneStatus,
  observation: 'Exceptional creativity in art and written expression.',
  teacherRemarks: 'Encourage participation in competitions.',
  parentRemark: 'Very artistic at home.',
  evidenceCount: 3,
  assessedBy: 'Mrs. Anita Patel'
},
// Middle
{
  id: 'SA007',
  studentName: 'Vikram Sharma',
  class: 'Class 7',
  gradeGroup: 'middle',
  rollNo: '04',
  skillCategory: 'Critical Thinking',
  skillName: 'Analyzing arguments and drawing conclusions',
  assessmentDate: '2024-01-16',
  milestoneAchieved: 'Yes' as MilestoneStatus,
  observation: 'Excellent ability to analyze and evaluate information.',
  teacherRemarks: 'Encourage debate participation.',
  parentRemark: '',
  evidenceCount: 1,
  assessedBy: 'Mr. Suresh Kumar'
},
{
  id: 'SA008',
  studentName: 'Pooja Desai',
  class: 'Class 8',
  gradeGroup: 'middle',
  rollNo: '09',
  skillCategory: 'Scientific Inquiry',
  skillName: 'Hypothesis formation and experimental design',
  assessmentDate: '2024-01-17',
  milestoneAchieved: 'Partial' as MilestoneStatus,
  observation: 'Can form hypotheses but struggles with experimental design.',
  teacherRemarks: 'More lab practice needed.',
  parentRemark: 'Interested in science.',
  evidenceCount: 0,
  assessedBy: 'Ms. Anita Verma'
},
{
  id: 'SA009',
  studentName: 'Rahul Mehta',
  class: 'Class 6',
  gradeGroup: 'middle',
  rollNo: '11',
  skillCategory: 'Digital Literacy',
  skillName: 'Using technology for learning and research',
  assessmentDate: '2024-01-18',
  milestoneAchieved: 'No' as MilestoneStatus,
  observation: 'Limited exposure to digital tools. Needs guidance.',
  teacherRemarks: 'Assign digital projects to build skills.',
  parentRemark: 'Limited screen time at home.',
  evidenceCount: 0,
  assessedBy: 'Ms. Kavita Nair'
},
// Secondary
{
  id: 'SA010',
  studentName: 'Aisha Khan',
  class: 'Class 9',
  gradeGroup: 'secondary',
  rollNo: '02',
  skillCategory: 'Analytical Thinking',
  skillName: 'Data interpretation and logical reasoning',
  assessmentDate: '2024-01-19',
  milestoneAchieved: 'Yes' as MilestoneStatus,
  observation: 'Excellent data analysis skills. Strong logical reasoning.',
  teacherRemarks: 'Recommend for Olympiad preparation.',
  parentRemark: '',
  evidenceCount: 2,
  assessedBy: 'Mr. Rajesh Kumar'
},
{
  id: 'SA011',
  studentName: 'Siddharth Rao',
  class: 'Class 10',
  gradeGroup: 'secondary',
  rollNo: '07',
  skillCategory: 'Public Speaking',
  skillName: 'Confident presentation and debate skills',
  assessmentDate: '2024-01-20',
  milestoneAchieved: 'Partial' as MilestoneStatus,
  observation: 'Good content but lacks confidence in delivery.',
  teacherRemarks: 'More practice sessions needed.',
  parentRemark: 'Shy at home too.',
  evidenceCount: 1,
  assessedBy: 'Ms. Priya Sharma'
},
// Senior
{
  id: 'SA012',
  studentName: 'Meera Joshi',
  class: 'Class 11',
  gradeGroup: 'senior',
  rollNo: '06',
  skillCategory: 'Advanced Research',
  skillName: 'Literature review and research methodology',
  assessmentDate: '2024-01-21',
  milestoneAchieved: 'Yes' as MilestoneStatus,
  observation: 'Excellent research skills. Well-structured project report.',
  teacherRemarks: 'Recommend for inter-school research competition.',
  parentRemark: 'Very dedicated.',
  evidenceCount: 3,
  assessedBy: 'Mr. Suresh Kumar'
},
{
  id: 'SA013',
  studentName: 'Karan Malhotra',
  class: 'Class 12',
  gradeGroup: 'senior',
  rollNo: '13',
  skillCategory: 'Technical Skills',
  skillName: 'Programming and computational thinking',
  assessmentDate: '2024-01-22',
  milestoneAchieved: 'Yes' as MilestoneStatus,
  observation: 'Strong programming skills. Developed a working app.',
  teacherRemarks: 'Exceptional talent. Recommend for tech competitions.',
  parentRemark: 'Codes at home regularly.',
  evidenceCount: 4,
  assessedBy: 'Ms. Kavita Nair'
},
{
  id: 'SA014',
  studentName: 'Priya Verma',
  class: 'Class 11',
  gradeGroup: 'senior',
  rollNo: '18',
  skillCategory: 'Life Skills',
  skillName: 'Time management and self-organization',
  assessmentDate: '2024-01-23',
  milestoneAchieved: 'Partial' as MilestoneStatus,
  observation: 'Good at planning but struggles with time management.',
  teacherRemarks: 'Introduce time-blocking techniques.',
  parentRemark: 'Working on it.',
  evidenceCount: 0,
  assessedBy: 'Mrs. Deepa Menon'
}];

const auditLog = [
{
  id: 'al1',
  action: 'Created',
  assessment: 'SA013 – Karan Malhotra (Technical Skills)',
  by: 'Ms. Kavita Nair',
  date: '2024-01-22 11:30',
  note: ''
},
{
  id: 'al2',
  action: 'Updated',
  assessment: 'SA011 – Siddharth Rao (Public Speaking)',
  by: 'Ms. Priya Sharma',
  date: '2024-01-21 15:00',
  note: 'Updated teacher remarks'
},
{
  id: 'al3',
  action: 'Evidence Added',
  assessment: 'SA012 – Meera Joshi (Advanced Research)',
  by: 'Mr. Suresh Kumar',
  date: '2024-01-21 09:45',
  note: '3 documents uploaded'
},
{
  id: 'al4',
  action: 'Created',
  assessment: 'SA010 – Aisha Khan (Analytical Thinking)',
  by: 'Mr. Rajesh Kumar',
  date: '2024-01-19 14:20',
  note: ''
}];

function milestoneBadge(status: MilestoneStatus) {
  if (status === 'Yes') return <Badge variant="success">Yes – Achieved</Badge>;
  if (status === 'No') return <Badge variant="danger">No – Not Yet</Badge>;
  return <Badge variant="warning">Partial</Badge>;
}
function categoryBadge(category: string) {
  return <Badge variant="primary">{category}</Badge>;
}
export function SkillDevelopmentAssessment() {
  const [activeTab, setActiveTab] = useState('list');
  const [gradeGroup, setGradeGroup] = useState<GradeGroup>('preschool');
  const [searchStudent, setSearchStudent] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterSkill, setFilterSkill] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [selectedAssessment, setSelectedAssessment] = useState<
    (typeof allAssessments)[0] | null>(
    null);
  const [formData, setFormData] = useState({
    studentName: '',
    class: '',
    rollNo: '',
    skillCategory: '',
    skillName: '',
    assessmentDate: '',
    milestoneAchieved: '',
    observation: '',
    teacherRemarks: '',
    parentRemark: ''
  });
  const currentCategories = skillCategoriesByGroup[gradeGroup];
  const currentClassOptions = classOptionsByGroup[gradeGroup];
  const filtered = allAssessments.filter((a) => {
    const matchGroup = a.gradeGroup === gradeGroup;
    const matchStudent =
    !searchStudent ||
    a.studentName.toLowerCase().includes(searchStudent.toLowerCase());
    const matchClass = !filterClass || a.class === filterClass;
    const matchSkill = !filterSkill || a.skillCategory === filterSkill;
    const matchDateFrom = !filterDateFrom || a.assessmentDate >= filterDateFrom;
    const matchDateTo = !filterDateTo || a.assessmentDate <= filterDateTo;
    return (
      matchGroup &&
      matchStudent &&
      matchClass &&
      matchSkill &&
      matchDateFrom &&
      matchDateTo);

  });
  const statsByCategory = currentCategories.map((sc) => ({
    ...sc,
    total: allAssessments.filter(
      (a) => a.gradeGroup === gradeGroup && a.skillCategory === sc.category
    ).length,
    achieved: allAssessments.filter(
      (a) =>
      a.gradeGroup === gradeGroup &&
      a.skillCategory === sc.category &&
      a.milestoneAchieved === 'Yes'
    ).length,
    partial: allAssessments.filter(
      (a) =>
      a.gradeGroup === gradeGroup &&
      a.skillCategory === sc.category &&
      a.milestoneAchieved === 'Partial'
    ).length,
    notYet: allAssessments.filter(
      (a) =>
      a.gradeGroup === gradeGroup &&
      a.skillCategory === sc.category &&
      a.milestoneAchieved === 'No'
    ).length
  }));
  const allClassOptions = [
  {
    value: '',
    label: 'All Classes'
  },
  {
    value: 'Pre-KG',
    label: 'Pre-KG'
  },
  {
    value: 'KG-1',
    label: 'KG-1'
  },
  {
    value: 'KG-2',
    label: 'KG-2'
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

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Skill Development Assessment
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Track student skill milestones from Preschool to Class 12 across all
            developmental domains
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<DownloadIcon className="w-4 h-4" />}>

            Export Report
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<PlusIcon className="w-4 h-4" />}
            onClick={() => {
              setSelectedAssessment(null);
              setActiveTab('form');
            }}>

            New Assessment
          </Button>
        </div>
      </div>

      {/* Grade Group Selector */}
      <Card>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700">Grade Group</p>
          <div className="flex flex-wrap gap-2">
            {gradeGroups.map((g) =>
            <button
              key={g.id}
              onClick={() => {
                setGradeGroup(g.id);
                setFilterClass('');
                setFilterSkill('');
              }}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${gradeGroup === g.id ? `${g.bg} ${g.color} border-current` : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>

                {g.label}{' '}
                <span className="text-xs opacity-70 ml-1">({g.range})</span>
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Skill Category Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {statsByCategory.map((sc) =>
        <Card
          key={sc.category}
          className="!p-0 cursor-pointer"
          onClick={() => {
            setFilterSkill(sc.category);
            setActiveTab('list');
          }}>

            <div className="p-3 text-center">
              <div
              className={`w-10 h-10 rounded-lg ${sc.bg} flex items-center justify-center mx-auto mb-2`}>

                <span className={sc.color}>{sc.icon}</span>
              </div>
              <p className="text-xs font-semibold text-gray-700 leading-tight mb-2">
                {sc.category}
              </p>
              <div className="flex justify-center gap-2 text-xs">
                <span className="text-green-600 font-medium">
                  {sc.achieved}✓
                </span>
                <span className="text-yellow-600 font-medium">
                  {sc.partial}~
                </span>
                <span className="text-red-500 font-medium">{sc.notYet}✗</span>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Main Content */}
      <Card noPadding>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="px-4 pt-2">
            <TabsTrigger value="list">Assessment List</TabsTrigger>
            <TabsTrigger value="form">New Assessment</TabsTrigger>
            {selectedAssessment &&
            <TabsTrigger value="detail">View Detail</TabsTrigger>
            }
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          {/* LIST TAB */}
          <TabsContent value="list" className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <Input
                placeholder="Search student..."
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />} />

              <Select
                placeholder="All Classes"
                value={filterClass}
                onChange={setFilterClass}
                options={currentClassOptions} />

              <Select
                placeholder="All Skill Types"
                value={filterSkill}
                onChange={setFilterSkill}
                options={[
                {
                  value: '',
                  label: 'All Skill Types'
                },
                ...currentCategories.map((c) => ({
                  value: c.category,
                  label: c.category
                }))]
                } />

              <Input
                type="date"
                placeholder="From date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)} />

              <Input
                type="date"
                placeholder="To date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)} />

            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {filtered.length} assessment{filtered.length !== 1 ? 's' : ''}{' '}
                found
              </p>
              {(searchStudent ||
              filterClass ||
              filterSkill ||
              filterDateFrom ||
              filterDateTo) &&
              <Button
                size="xs"
                variant="ghost"
                onClick={() => {
                  setSearchStudent('');
                  setFilterClass('');
                  setFilterSkill('');
                  setFilterDateFrom('');
                  setFilterDateTo('');
                }}>

                  Clear Filters
                </Button>
              }
            </div>
            <Table
              columns={[
              {
                key: 'id',
                header: 'ID'
              },
              {
                key: 'studentName',
                header: 'Student',
                render: (row) =>
                <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                        <UserIcon className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {row.studentName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {row.class} · Roll {row.rollNo}
                        </p>
                      </div>
                    </div>

              },
              {
                key: 'skillCategory',
                header: 'Skill Category',
                render: (row) => categoryBadge(row.skillCategory)
              },
              {
                key: 'skillName',
                header: 'Skill',
                render: (row) =>
                <span className="text-sm text-gray-700">
                      {row.skillName}
                    </span>

              },
              {
                key: 'assessmentDate',
                header: 'Date',
                render: (row) =>
                <span className="flex items-center gap-1 text-gray-600">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      {row.assessmentDate}
                    </span>

              },
              {
                key: 'milestoneAchieved',
                header: 'Milestone',
                render: (row) => milestoneBadge(row.milestoneAchieved)
              },
              {
                key: 'evidenceCount',
                header: 'Evidence',
                render: (row) =>
                row.evidenceCount > 0 ?
                <span className="flex items-center gap-1 text-blue-600 text-sm">
                        <PaperclipIcon className="w-3.5 h-3.5" />
                        {row.evidenceCount}
                      </span> :

                <span className="text-gray-400 text-sm">—</span>

              },
              {
                key: 'assessedBy',
                header: 'Assessed By',
                render: (row) =>
                <span className="text-sm text-gray-600">
                      {row.assessedBy}
                    </span>

              },
              {
                key: 'actions',
                header: 'Actions',
                render: (row) =>
                <div className="flex items-center gap-1">
                      <Button
                    size="xs"
                    variant="ghost"
                    icon={<EyeIcon className="w-3.5 h-3.5" />}
                    onClick={() => {
                      setSelectedAssessment(row);
                      setActiveTab('detail');
                    }} />

                      <Button
                    size="xs"
                    variant="ghost"
                    icon={<EditIcon className="w-3.5 h-3.5" />} />

                    </div>

              }]
              }
              data={filtered}
              emptyMessage="No assessments found for the selected filters." />

          </TabsContent>

          {/* FORM TAB */}
          <TabsContent value="form" className="p-4">
            <div className="max-w-3xl space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  New Skill Assessment Entry
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab('list')}>

                    Cancel
                  </Button>
                  <Button variant="primary" size="sm">
                    Save Assessment
                  </Button>
                </div>
              </div>
              <Card title="Student Information">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Student Name *"
                    placeholder="Search or enter student name"
                    value={formData.studentName}
                    onChange={(e) =>
                    setFormData((f) => ({
                      ...f,
                      studentName: e.target.value
                    }))
                    }
                    leftIcon={<UserIcon className="w-4 h-4 text-gray-400" />} />

                  <Select
                    label="Class & Section *"
                    value={formData.class}
                    onChange={(v) =>
                    setFormData((f) => ({
                      ...f,
                      class: v
                    }))
                    }
                    placeholder="Select Class"
                    options={allClassOptions} />

                  <Input
                    label="Roll No."
                    placeholder="e.g. 01"
                    value={formData.rollNo}
                    onChange={(e) =>
                    setFormData((f) => ({
                      ...f,
                      rollNo: e.target.value
                    }))
                    } />

                </div>
              </Card>
              <Card title="Skill Assessment Details">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label="Skill Category *"
                      value={formData.skillCategory}
                      onChange={(v) =>
                      setFormData((f) => ({
                        ...f,
                        skillCategory: v
                      }))
                      }
                      placeholder="Select Skill Category"
                      options={[
                      {
                        value: '',
                        label: 'Select Category'
                      },
                      ...currentCategories.map((c) => ({
                        value: c.category,
                        label: c.category
                      }))]
                      } />

                    <Input
                      label="Specific Skill / Milestone *"
                      placeholder="Describe the specific skill being assessed"
                      value={formData.skillName}
                      onChange={(e) =>
                      setFormData((f) => ({
                        ...f,
                        skillName: e.target.value
                      }))
                      } />

                    <Input
                      label="Assessment Date *"
                      type="date"
                      value={formData.assessmentDate}
                      onChange={(e) =>
                      setFormData((f) => ({
                        ...f,
                        assessmentDate: e.target.value
                      }))
                      }
                      leftIcon={
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                      } />

                    <Select
                      label="Milestone Achieved *"
                      value={formData.milestoneAchieved}
                      onChange={(v) =>
                      setFormData((f) => ({
                        ...f,
                        milestoneAchieved: v
                      }))
                      }
                      placeholder="Select Status"
                      options={[
                      {
                        value: 'Yes',
                        label: 'Yes – Milestone Achieved'
                      },
                      {
                        value: 'Partial',
                        label: 'Partial – In Progress'
                      },
                      {
                        value: 'No',
                        label: 'No – Not Yet Achieved'
                      }]
                      } />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observation Entry *
                    </label>
                    <textarea
                      className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Describe what was observed during the assessment session..."
                      value={formData.observation}
                      onChange={(e) =>
                      setFormData((f) => ({
                        ...f,
                        observation: e.target.value
                      }))
                      } />

                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teacher Remarks
                      </label>
                      <textarea
                        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                        placeholder="Teacher's professional remarks..."
                        value={formData.teacherRemarks}
                        onChange={(e) =>
                        setFormData((f) => ({
                          ...f,
                          teacherRemarks: e.target.value
                        }))
                        } />

                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Parent Remark{' '}
                        <span className="text-gray-400 font-normal">
                          (if allowed)
                        </span>
                      </label>
                      <textarea
                        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                        placeholder="Parent's observations or comments..."
                        value={formData.parentRemark}
                        onChange={(e) =>
                        setFormData((f) => ({
                          ...f,
                          parentRemark: e.target.value
                        }))
                        } />

                    </div>
                  </div>
                </div>
              </Card>
              <Card title="Evidence Upload">
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                  <UploadIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">
                    Upload images or notes as evidence
                  </p>
                  <p className="text-xs text-gray-400">
                    JPG, PNG, PDF — Max 5MB per file
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    leftIcon={<PaperclipIcon className="w-4 h-4" />}>

                    Attach Evidence
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* DETAIL VIEW TAB */}
          {selectedAssessment &&
          <TabsContent value="detail" className="p-4">
              <div className="max-w-3xl space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab('list')}>

                      ← Back
                    </Button>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Assessment Detail – {selectedAssessment.id}
                    </h2>
                  </div>
                  <div className="flex gap-2">
                    <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<EditIcon className="w-4 h-4" />}>

                      Edit
                    </Button>
                    <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<DownloadIcon className="w-4 h-4" />}>

                      Export PDF
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card title="Student Information">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Name</span>
                        <span className="font-medium text-gray-900">
                          {selectedAssessment.studentName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Class</span>
                        <span className="font-medium text-gray-900">
                          {selectedAssessment.class}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Roll No.</span>
                        <span className="font-medium text-gray-900">
                          {selectedAssessment.rollNo}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Assessed By</span>
                        <span className="font-medium text-gray-900">
                          {selectedAssessment.assessedBy}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Date</span>
                        <span className="font-medium text-gray-900">
                          {selectedAssessment.assessmentDate}
                        </span>
                      </div>
                    </div>
                  </Card>
                  <Card title="Skill Assessment Summary">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-gray-500 shrink-0">Category</span>
                        {categoryBadge(selectedAssessment.skillCategory)}
                      </div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-gray-500 shrink-0">Skill</span>
                        <span className="font-medium text-gray-900 text-right">
                          {selectedAssessment.skillName}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Milestone</span>
                        {milestoneBadge(selectedAssessment.milestoneAchieved)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Evidence</span>
                        {selectedAssessment.evidenceCount > 0 ?
                      <span className="flex items-center gap-1 text-blue-600">
                            <PaperclipIcon className="w-3.5 h-3.5" />
                            {selectedAssessment.evidenceCount} file(s)
                          </span> :

                      <span className="text-gray-400">None</span>
                      }
                      </div>
                    </div>
                  </Card>
                </div>
                <Card title="Observation & Remarks">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Observation
                      </p>
                      <p className="text-sm text-gray-800 bg-gray-50 rounded-lg p-3">
                        {selectedAssessment.observation}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Teacher Remarks
                      </p>
                      <p className="text-sm text-gray-800 bg-blue-50 rounded-lg p-3">
                        {selectedAssessment.teacherRemarks}
                      </p>
                    </div>
                    {selectedAssessment.parentRemark &&
                  <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Parent Remark
                        </p>
                        <p className="text-sm text-gray-800 bg-green-50 rounded-lg p-3">
                          {selectedAssessment.parentRemark}
                        </p>
                      </div>
                  }
                  </div>
                </Card>
              </div>
            </TabsContent>
          }

          {/* AUDIT LOG TAB */}
          <TabsContent value="audit" className="p-4 space-y-4">
            <div className="flex items-center justify-between">
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
              columns={[
              {
                key: 'action',
                header: 'Action',
                render: (row) =>
                <Badge
                  variant={
                  row.action === 'Created' ?
                  'success' :
                  row.action === 'Updated' ?
                  'info' :
                  'primary'
                  }>

                      {row.action}
                    </Badge>

              },
              {
                key: 'assessment',
                header: 'Assessment'
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
                key: 'note',
                header: 'Note',
                render: (row) =>
                row.note || <span className="text-gray-400">—</span>
              }]
              }
              data={auditLog}
              emptyMessage="No audit entries found." />

          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}