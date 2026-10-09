import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent } from
'../../../components/ui/Tabs';
import {
  DownloadIcon,
  FileTextIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  BuildingIcon,
  PrinterIcon,
  ShieldCheckIcon,
  UserCheckIcon,
  BarChart2Icon,
  TrendingUpIcon,
  ClockIcon,
  SearchIcon,
  RefreshCwIcon,
  EyeIcon,
  StarIcon,
  SparklesIcon,
  MailIcon } from
'lucide-react';
const branchOptions = [
{
  value: 'all',
  label: 'All Branches',
  color: 'bg-gray-600'
},
{
  value: 'main',
  label: 'Main Campus',
  color: 'bg-blue-600'
},
{
  value: 'north',
  label: 'North Branch',
  color: 'bg-green-600'
},
{
  value: 'south',
  label: 'South Branch',
  color: 'bg-orange-600'
},
{
  value: 'east',
  label: 'East Branch',
  color: 'bg-purple-600'
}];

const batchYearOptions = [
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
}];

const affiliationItems = [
{
  id: 1,
  item: 'Society/Trust Registration',
  status: 'Compliant',
  validity: '31 Mar 2030',
  remarks: 'Registered under Societies Act'
},
{
  id: 2,
  item: 'NOC from State Government',
  status: 'Compliant',
  validity: '31 Mar 2026',
  remarks: 'Valid'
},
{
  id: 3,
  item: 'Infrastructure Compliance',
  status: 'Compliant',
  validity: 'Ongoing',
  remarks: 'All norms met'
},
{
  id: 4,
  item: 'Staff Qualification Compliance',
  status: 'Partial',
  validity: 'Ongoing',
  remarks: '2 staff pending verification'
},
{
  id: 5,
  item: 'Fire Safety Certificate',
  status: 'Expiring Soon',
  validity: '15 Mar 2025',
  remarks: 'Renewal in progress'
},
{
  id: 6,
  item: 'Building Safety Certificate',
  status: 'Compliant',
  validity: '31 Dec 2026',
  remarks: 'Inspected Jun 2024'
}];

const candidateData = [
{
  id: 1,
  rollNo: 'IC-001',
  name: 'Aanya Kapoor',
  class: 'X',
  stream: 'General',
  subjects: 'English, Math, Science, History, Geography',
  internalMarks: 'Submitted',
  status: 'Registered'
},
{
  id: 2,
  rollNo: 'IC-002',
  name: 'Vivaan Mehta',
  class: 'X',
  stream: 'General',
  subjects: 'English, Math, Science, Hindi, Computer',
  internalMarks: 'Submitted',
  status: 'Registered'
},
{
  id: 3,
  rollNo: 'IS-001',
  name: 'Riya Sharma',
  class: 'XII',
  stream: 'Science',
  subjects: 'English, Physics, Chemistry, Math, Biology',
  internalMarks: 'Pending',
  status: 'Pending'
},
{
  id: 4,
  rollNo: 'IS-002',
  name: 'Aryan Patel',
  class: 'XII',
  stream: 'Commerce',
  subjects: 'English, Accounts, Economics, Business Studies',
  internalMarks: 'Submitted',
  status: 'Registered'
},
{
  id: 5,
  rollNo: 'IS-003',
  name: 'Ishaan Joshi',
  class: 'XII',
  stream: 'Science',
  subjects: 'English, Physics, Chemistry, Math',
  internalMarks: 'Submitted',
  status: 'Registered'
}];

const practicalData = [
{
  id: 1,
  subject: 'Physics Practical',
  class: 'XII',
  totalStudents: 68,
  marksUploaded: 65,
  status: 'Partial'
},
{
  id: 2,
  subject: 'Chemistry Practical',
  class: 'XII',
  totalStudents: 68,
  marksUploaded: 68,
  status: 'Complete'
},
{
  id: 3,
  subject: 'Biology Practical',
  class: 'XII',
  totalStudents: 42,
  marksUploaded: 42,
  status: 'Complete'
},
{
  id: 4,
  subject: 'Computer Practical',
  class: 'X',
  totalStudents: 140,
  marksUploaded: 138,
  status: 'Partial'
},
{
  id: 5,
  subject: 'Art & Craft',
  class: 'X',
  totalStudents: 140,
  marksUploaded: 140,
  status: 'Complete'
}];

const rteData = [
{
  id: 1,
  class: 'Class I',
  rteSeats: 10,
  filled: 10,
  vacant: 0,
  boys: 6,
  girls: 4,
  obc: 4,
  sc: 4,
  st: 2
},
{
  id: 2,
  class: 'Class II',
  rteSeats: 10,
  filled: 9,
  vacant: 1,
  boys: 5,
  girls: 4,
  obc: 3,
  sc: 4,
  st: 2
},
{
  id: 3,
  class: 'Class III',
  rteSeats: 8,
  filled: 8,
  vacant: 0,
  boys: 4,
  girls: 4,
  obc: 3,
  sc: 3,
  st: 2
},
{
  id: 4,
  class: 'Class IV',
  rteSeats: 8,
  filled: 7,
  vacant: 1,
  boys: 4,
  girls: 3,
  obc: 3,
  sc: 2,
  st: 2
}];

const religionData = [
{
  id: 1,
  religion: 'Hindu',
  count: 780,
  percentage: '62.5%',
  boys: 406,
  girls: 374
},
{
  id: 2,
  religion: 'Muslim',
  count: 200,
  percentage: '16.0%',
  boys: 104,
  girls: 96
},
{
  id: 3,
  religion: 'Christian',
  count: 148,
  percentage: '11.9%',
  boys: 74,
  girls: 74
},
{
  id: 4,
  religion: 'Sikh',
  count: 62,
  percentage: '5.0%',
  boys: 34,
  girls: 28
},
{
  id: 5,
  religion: 'Jain',
  count: 38,
  percentage: '3.0%',
  boys: 20,
  girls: 18
},
{
  id: 6,
  religion: 'Other',
  count: 20,
  percentage: '1.6%',
  boys: 10,
  girls: 10
}];

const casteData = [
{
  id: 1,
  category: 'General',
  count: 600,
  percentage: '48.1%',
  boys: 312,
  girls: 288
},
{
  id: 2,
  category: 'OBC',
  count: 320,
  percentage: '25.6%',
  boys: 168,
  girls: 152
},
{
  id: 3,
  category: 'SC',
  count: 190,
  percentage: '15.2%',
  boys: 100,
  girls: 90
},
{
  id: 4,
  category: 'ST',
  count: 68,
  percentage: '5.4%',
  boys: 36,
  girls: 32
},
{
  id: 5,
  category: 'EWS',
  count: 70,
  percentage: '5.6%',
  boys: 36,
  girls: 34
}];

const genderClassData = [
{
  id: 1,
  class: 'Class I',
  boys: 52,
  girls: 50,
  total: 102,
  ratio: '51:49'
},
{
  id: 2,
  class: 'Class V',
  boys: 60,
  girls: 58,
  total: 118,
  ratio: '51:49'
},
{
  id: 3,
  class: 'Class VIII',
  boys: 66,
  girls: 64,
  total: 130,
  ratio: '51:49'
},
{
  id: 4,
  class: 'Class X (ICSE)',
  boys: 72,
  girls: 68,
  total: 140,
  ratio: '51:49'
},
{
  id: 5,
  class: 'Class XII (ISC)',
  boys: 68,
  girls: 66,
  total: 134,
  ratio: '51:49'
}];

const strengthData = [
{
  id: 1,
  class: 'Class I',
  sections: 3,
  boys: 52,
  girls: 50,
  total: 102,
  capacity: 120,
  utilization: '85%'
},
{
  id: 2,
  class: 'Class V',
  sections: 3,
  boys: 60,
  girls: 58,
  total: 118,
  capacity: 120,
  utilization: '98%'
},
{
  id: 3,
  class: 'Class VIII',
  sections: 4,
  boys: 66,
  girls: 64,
  total: 130,
  capacity: 160,
  utilization: '81%'
},
{
  id: 4,
  class: 'Class X',
  sections: 4,
  boys: 72,
  girls: 68,
  total: 140,
  capacity: 160,
  utilization: '88%'
},
{
  id: 5,
  class: 'Class XII',
  sections: 4,
  boys: 68,
  girls: 66,
  total: 134,
  capacity: 160,
  utilization: '84%'
}];

const attendanceSummaryData = [
{
  id: 1,
  class: 'Class I',
  avgAttendance: '92.8%',
  lowAttendance: 4,
  totalStudents: 102,
  status: 'Good'
},
{
  id: 2,
  class: 'Class V',
  avgAttendance: '91.4%',
  lowAttendance: 5,
  totalStudents: 118,
  status: 'Good'
},
{
  id: 3,
  class: 'Class VIII',
  avgAttendance: '94.2%',
  lowAttendance: 3,
  totalStudents: 130,
  status: 'Good'
},
{
  id: 4,
  class: 'Class X',
  avgAttendance: '96.8%',
  lowAttendance: 2,
  totalStudents: 140,
  status: 'Excellent'
},
{
  id: 5,
  class: 'Class XII',
  avgAttendance: '97.4%',
  lowAttendance: 1,
  totalStudents: 134,
  status: 'Excellent'
}];

const examPerformanceData = [
{
  id: 1,
  class: 'ICSE (Class X)',
  appeared: 140,
  passed: 138,
  passPercent: '98.6%',
  distinction: 58,
  avgScore: '78.4%',
  topScorer: 'Aanya Kapoor (97.6%)'
},
{
  id: 2,
  class: 'ISC (Class XII)',
  appeared: 134,
  passed: 130,
  passPercent: '97.0%',
  distinction: 54,
  avgScore: '76.8%',
  topScorer: 'Ishaan Joshi (96.8%)'
}];

const generatedReports = [
{
  id: 1,
  name: 'ICSE/CISCE Affiliation Compliance',
  type: 'Compliance',
  generatedAt: '25 Feb 2026, 10:30',
  generatedBy: 'Admin',
  branches: 'All Branches',
  format: 'PDF',
  size: '1.8 MB',
  status: 'Completed'
},
{
  id: 2,
  name: 'ICSE Candidate Registration',
  type: 'Examination',
  generatedAt: '24 Feb 2026, 15:00',
  generatedBy: 'Principal',
  branches: 'Main Campus',
  format: 'PDF',
  size: '1.2 MB',
  status: 'Completed'
},
{
  id: 3,
  name: 'Practical Marks Upload Summary',
  type: 'Examination',
  generatedAt: '24 Feb 2026, 09:15',
  generatedBy: 'Admin',
  branches: 'All Branches',
  format: 'Excel',
  size: '0.7 MB',
  status: 'Completed'
},
{
  id: 4,
  name: 'RTE & EWS Seats Report',
  type: 'Demographics',
  generatedAt: '23 Feb 2026, 14:30',
  generatedBy: 'Admin',
  branches: 'North, South',
  format: 'PDF',
  size: '0.6 MB',
  status: 'Completed'
},
{
  id: 5,
  name: 'ISC Performance Analysis',
  type: 'Examination',
  generatedAt: '23 Feb 2026, 11:00',
  generatedBy: 'System',
  branches: 'All Branches',
  format: 'Excel',
  size: '1.1 MB',
  status: 'Processing'
},
{
  id: 6,
  name: 'Gender Distribution Report',
  type: 'Demographics',
  generatedAt: '22 Feb 2026, 16:45',
  generatedBy: 'Admin',
  branches: 'East Branch',
  format: 'PDF',
  size: '0.9 MB',
  status: 'Failed'
}];

interface ReportItem {
  id: string;
  name: string;
  description: string;
  tags: string[];
  isNew?: boolean;
  isFeatured?: boolean;
}
interface ReportCategory {
  id: string;
  label: string;
  color: string;
  bgColor: string;
  reports: ReportItem[];
}
const reportCategories: ReportCategory[] = [
{
  id: 'compliance',
  label: 'Compliance Reports',
  color: 'bg-blue-600',
  bgColor: 'bg-blue-50',
  reports: [
  {
    id: 'affiliation-compliance',
    name: 'ICSE/CISCE Affiliation Compliance',
    description: 'Full affiliation compliance checklist for CISCE',
    tags: ['Affiliation', 'CISCE'],
    isFeatured: true
  },
  {
    id: 'noc-status',
    name: 'NOC & Registration Status',
    description: 'Society registration and state NOC validity',
    tags: ['NOC', 'Registration']
  },
  {
    id: 'fire-safety',
    name: 'Fire & Building Safety Status',
    description: 'Safety certificate validity and renewal tracking',
    tags: ['Safety', 'Certificate']
  }]

},
{
  id: 'examination',
  label: 'Examination Reports',
  color: 'bg-green-600',
  bgColor: 'bg-green-50',
  reports: [
  {
    id: 'candidate-reg',
    name: 'ICSE/ISC Candidate Registration',
    description: 'Class X & XII candidate list for CISCE submission',
    tags: ['Candidate', 'Registration'],
    isFeatured: true
  },
  {
    id: 'internal-assessment',
    name: 'Internal Assessment Submission',
    description: 'Internal marks submission status for CISCE portal',
    tags: ['Internal', 'Assessment'],
    isFeatured: true
  },
  {
    id: 'practical-marks',
    name: 'Practical Marks Upload Summary',
    description: 'Subject-wise practical marks upload status',
    tags: ['Practical', 'Marks']
  },
  {
    id: 'board-result',
    name: 'ICSE/ISC Result Summary',
    description: 'Board exam performance for Class X and XII',
    tags: ['ICSE', 'ISC', 'Result']
  }]

},
{
  id: 'demographics',
  label: 'Student Demographics',
  color: 'bg-purple-600',
  bgColor: 'bg-purple-50',
  reports: [
  {
    id: 'rte-ews',
    name: 'RTE & EWS Seats Report',
    description: 'Class-wise RTE allocation vs filled seats',
    tags: ['RTE', 'EWS']
  },
  {
    id: 'gender-dist',
    name: 'Gender-wise Distribution',
    description: 'Class-wise gender distribution and M:F ratio',
    tags: ['Gender', 'Distribution']
  },
  {
    id: 'caste-report',
    name: 'Caste/Category Report',
    description: 'General, OBC, SC, ST, EWS category breakdown',
    tags: ['Caste', 'Category']
  },
  {
    id: 'religion-report',
    name: 'Religion-wise Report',
    description:
    'Religion-wise student distribution for minority reporting',
    tags: ['Religion', 'Minority'],
    isNew: true
  }]

},
{
  id: 'strength',
  label: 'Strength & Attendance',
  color: 'bg-orange-600',
  bgColor: 'bg-orange-50',
  reports: [
  {
    id: 'strength-report',
    name: 'Class-wise Strength Report',
    description: 'Section-wise strength with capacity utilization',
    tags: ['Strength', 'Capacity']
  },
  {
    id: 'attendance-summary',
    name: 'Attendance Summary',
    description: 'Class-wise average attendance and low-attendance alerts',
    tags: ['Attendance', 'Summary']
  }]

},
{
  id: 'staff',
  label: 'Staff Reports',
  color: 'bg-yellow-600',
  bgColor: 'bg-yellow-50',
  reports: [
  {
    id: 'staff-qual',
    name: 'Staff Qualification Report',
    description: 'Staff list with qualifications for CISCE compliance',
    tags: ['Staff', 'Qualification']
  },
  {
    id: 'teacher-ratio',
    name: 'Teacher-Student Ratio',
    description: 'Teacher-student ratio compliance with CISCE norms',
    tags: ['Ratio', 'Compliance']
  }]

}];

const featuredReports = reportCategories.flatMap((c) =>
c.reports.
filter((r) => r.isFeatured).
map((r) => ({
  ...r,
  cat: c
}))
);
export function IcseComplianceReports() {
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['all']);
  const [batchYear, setBatchYear] = useState('2024-25');
  const [mainTab, setMainTab] = useState('templates');
  const [liveInnerTab, setLiveInnerTab] = useState('affiliation');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generateForm, setGenerateForm] = useState({
    batchYear: '2024-25',
    class: '',
    format: 'pdf',
    includeCharts: true
  });
  const toggleBranch = (val: string) => {
    if (val === 'all') {
      setSelectedBranches(['all']);
      return;
    }
    setSelectedBranches((prev) => {
      const without = prev.filter((b) => b !== 'all');
      return without.includes(val) ?
      without.filter((b) => b !== val) :
      [...without, val];
    });
  };
  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };
  const handleGenerate = (report: ReportItem) => {
    setSelectedReport(report);
    setShowGenerateModal(true);
  };
  const handleSubmitGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setShowGenerateModal(false);
    }, 1500);
  };
  const allReports = reportCategories.flatMap((c) =>
  c.reports.map((r) => ({
    ...r,
    catId: c.id,
    catLabel: c.label,
    catColor: c.color,
    catBg: c.bgColor
  }))
  );
  const filteredReports = allReports.filter((r) => {
    const matchCat = selectedCategory === 'all' || r.catId === selectedCategory;
    const matchSearch =
    !searchQuery ||
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });
  const selectedBranchLabels = selectedBranches.includes('all') ?
  'All Branches' :
  branchOptions.
  filter((b) => selectedBranches.includes(b.value)).
  map((b) => b.label).
  join(', ');
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            ICSE / CISCE Compliance Reports
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Affiliation compliance, examination reports, RTE/EWS, minority,
            gender and strength reports
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<PrinterIcon className="w-4 h-4" />}>

            Print
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<DownloadIcon className="w-4 h-4" />}>

            Export Excel
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<FileTextIcon className="w-4 h-4" />}>

            Export PDF (Signed)
          </Button>
        </div>
      </div>

      <Card>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              School Branch
            </label>
            <div className="flex flex-wrap gap-2">
              {branchOptions.map((b) =>
              <button
                key={b.value}
                onClick={() => toggleBranch(b.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${selectedBranches.includes(b.value) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>

                  <span className={`w-2 h-2 rounded-full ${b.color}`} />
                  {b.label}
                </button>
              )}
            </div>
          </div>
          <Select
            label="Batch Year"
            options={batchYearOptions}
            value={batchYear}
            onChange={setBatchYear} />

        </div>
        {!selectedBranches.includes('all') && selectedBranches.length > 0 &&
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
            <BuildingIcon className="w-3.5 h-3.5" />
            <span>
              Showing data for:{' '}
              <strong className="text-gray-700">{selectedBranchLabels}</strong>
            </span>
          </div>
        }
      </Card>

      <Tabs value={mainTab} onValueChange={setMainTab}>
        <TabsList>
          <TabsTrigger value="templates">
            <FileTextIcon className="w-3.5 h-3.5" /> Report Templates
          </TabsTrigger>
          <TabsTrigger value="generated">
            <ClockIcon className="w-3.5 h-3.5" /> Generated Reports
          </TabsTrigger>
          <TabsTrigger value="live">
            <BarChart2Icon className="w-3.5 h-3.5" /> Live Data & Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-4 space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <SparklesIcon className="w-4 h-4 text-yellow-500" /> Featured
              Reports
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {featuredReports.map((r) =>
              <div
                key={r.id}
                className={`p-4 rounded-xl border-2 ${r.cat.bgColor} cursor-pointer hover:shadow-md transition-shadow`}>

                  <div className="flex items-start justify-between mb-2">
                    <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full text-white ${r.cat.color}`}>

                      {r.cat.label}
                    </span>
                    {r.isNew && <Badge variant="success">New</Badge>}
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">
                    {r.name}
                  </h4>
                  <p className="text-xs text-gray-600 mb-3">{r.description}</p>
                  <div className="flex gap-1">
                    <Button
                    variant="outline"
                    size="xs"
                    leftIcon={<EyeIcon className="w-3 h-3" />}>

                      Preview
                    </Button>
                    <Button
                    variant="primary"
                    size="xs"
                    onClick={() => handleGenerate(r)}>

                      Generate
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <Input
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
              className="w-56" />

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${selectedCategory === 'all' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>

                All{' '}
                <span className="ml-1 opacity-70">({allReports.length})</span>
              </button>
              {reportCategories.map((cat) =>
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${selectedCategory === cat.id ? `${cat.color} text-white border-current` : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>

                  {cat.label}{' '}
                  <span className="ml-1 opacity-70">
                    ({cat.reports.length})
                  </span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReports.map((r) =>
            <div
              key={r.id}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">

                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                    className={`w-2.5 h-2.5 rounded-full ${r.catColor}`} />

                    <span className="text-xs text-gray-500">{r.catLabel}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {r.isNew && <Badge variant="success">New</Badge>}
                    <button
                    onClick={() => toggleFavorite(r.id)}
                    className="p-1 rounded hover:bg-gray-100 transition-colors">

                      <StarIcon
                      className={`w-3.5 h-3.5 ${favorites.has(r.id) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />

                    </button>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">
                  {r.name}
                </h4>
                <p className="text-xs text-gray-500 mb-3">{r.description}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {r.tags.map((tag) =>
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">

                      {tag}
                    </span>
                )}
                </div>
                <div className="flex gap-1.5">
                  <Button
                  variant="ghost"
                  size="xs"
                  leftIcon={<EyeIcon className="w-3 h-3" />}>

                    Preview
                  </Button>
                  <Button
                  variant="outline"
                  size="xs"
                  leftIcon={<DownloadIcon className="w-3 h-3" />}>

                    Download
                  </Button>
                  <Button
                  variant="primary"
                  size="xs"
                  onClick={() => handleGenerate(r)}>

                    Generate
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="generated" className="mt-4">
          <Card noPadding>
            <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3 items-center justify-between">
              <div className="flex gap-3 flex-wrap">
                <Input
                  placeholder="Search reports..."
                  leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                  className="w-52" />

                <Select
                  options={[
                  {
                    value: '',
                    label: 'All Types'
                  },
                  ...reportCategories.map((c) => ({
                    value: c.id,
                    label: c.label
                  }))]
                  }
                  className="w-44" />

                <Select
                  options={[
                  {
                    value: '',
                    label: 'All Formats'
                  },
                  {
                    value: 'pdf',
                    label: 'PDF'
                  },
                  {
                    value: 'excel',
                    label: 'Excel'
                  }]
                  }
                  className="w-32" />

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
                key: 'name',
                header: 'Report Name',
                render: (row) =>
                <span className="font-medium text-gray-900 text-sm">
                      {row.name}
                    </span>

              },
              {
                key: 'type',
                header: 'Type',
                render: (row) => <Badge variant="primary">{row.type}</Badge>
              },
              {
                key: 'generatedAt',
                header: 'Generated',
                render: (row) =>
                <span className="text-xs text-gray-500">
                      {row.generatedAt}
                    </span>

              },
              {
                key: 'generatedBy',
                header: 'By',
                render: (row) =>
                <span className="text-sm text-gray-600">
                      {row.generatedBy}
                    </span>

              },
              {
                key: 'branches',
                header: 'Branches',
                render: (row) =>
                <span className="text-xs text-gray-500">
                      {row.branches}
                    </span>

              },
              {
                key: 'format',
                header: 'Format',
                render: (row) =>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-semibold ${row.format === 'PDF' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>

                      {row.format}
                    </span>

              },
              {
                key: 'size',
                header: 'Size',
                render: (row) =>
                <span className="text-xs text-gray-500">{row.size}</span>

              },
              {
                key: 'status',
                header: 'Status',
                render: (row) =>
                <Badge
                  variant={
                  row.status === 'Completed' ?
                  'success' :
                  row.status === 'Processing' ?
                  'warning' :
                  'danger'
                  }>

                      {row.status}
                    </Badge>

              },
              {
                key: 'actions',
                header: 'Actions',
                render: (row) =>
                <div className="flex gap-1">
                      {row.status === 'Completed' &&
                  <>
                          <Button
                      variant="ghost"
                      size="xs"
                      leftIcon={<EyeIcon className="w-3 h-3" />}>

                            View
                          </Button>
                          <Button
                      variant="ghost"
                      size="xs"
                      leftIcon={<DownloadIcon className="w-3 h-3" />}>

                            DL
                          </Button>
                          <Button
                      variant="ghost"
                      size="xs"
                      leftIcon={<PrinterIcon className="w-3 h-3" />}>

                            Print
                          </Button>
                          <Button
                      variant="ghost"
                      size="xs"
                      leftIcon={<MailIcon className="w-3 h-3" />}>

                            Email
                          </Button>
                        </>
                  }
                    </div>

              }]
              }
              data={generatedReports} />

          </Card>
        </TabsContent>

        <TabsContent value="live" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">4</p>
                <p className="text-xs text-gray-500">Compliant</p>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangleIcon className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">2</p>
                <p className="text-xs text-gray-500">Needs Attention</p>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileTextIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">274</p>
                <p className="text-xs text-gray-500">Candidates Registered</p>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckCircleIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">97.8%</p>
                <p className="text-xs text-gray-500">Pass Percentage</p>
              </div>
            </div>
          </div>

          <Tabs value={liveInnerTab} onValueChange={setLiveInnerTab}>
            <div className="overflow-x-auto">
              <TabsList>
                <TabsTrigger value="affiliation">
                  Affiliation Compliance
                </TabsTrigger>
                <TabsTrigger value="candidates">
                  Candidate Registration
                </TabsTrigger>
                <TabsTrigger value="internal-assessment">
                  Internal Assessment
                </TabsTrigger>
                <TabsTrigger value="practicals">Practical Marks</TabsTrigger>
                <TabsTrigger value="rte-ews">
                  <ShieldCheckIcon className="w-3.5 h-3.5" /> RTE & EWS
                </TabsTrigger>
                <TabsTrigger value="minority-caste">
                  Minority & Caste
                </TabsTrigger>
                <TabsTrigger value="gender">
                  <UserCheckIcon className="w-3.5 h-3.5" /> Gender-wise
                </TabsTrigger>
                <TabsTrigger value="strength">
                  <BarChart2Icon className="w-3.5 h-3.5" /> Strength
                </TabsTrigger>
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
                <TabsTrigger value="exam-performance">
                  <TrendingUpIcon className="w-3.5 h-3.5" /> Exam Performance
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="affiliation" className="mt-4">
              <Card title="ICSE/CISCE Affiliation Compliance Report">
                <Table
                  columns={[
                  {
                    key: 'item',
                    header: 'Compliance Item'
                  },
                  {
                    key: 'status',
                    header: 'Status',
                    render: (row) =>
                    <Badge
                      variant={
                      row.status === 'Compliant' ?
                      'success' :
                      row.status === 'Partial' ||
                      row.status === 'Expiring Soon' ?
                      'warning' :
                      'danger'
                      }>

                          {row.status}
                        </Badge>

                  },
                  {
                    key: 'validity',
                    header: 'Validity'
                  },
                  {
                    key: 'remarks',
                    header: 'Remarks'
                  }]
                  }
                  data={affiliationItems} />

              </Card>
            </TabsContent>

            <TabsContent value="candidates" className="mt-4">
              <Card
                title="ICSE/ISC Candidate Registration Summary"
                headerAction={
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<DownloadIcon className="w-4 h-4" />}>

                    Submit to CISCE
                  </Button>
                }>

                <Table
                  columns={[
                  {
                    key: 'rollNo',
                    header: 'Roll No'
                  },
                  {
                    key: 'name',
                    header: 'Student Name'
                  },
                  {
                    key: 'class',
                    header: 'Class'
                  },
                  {
                    key: 'stream',
                    header: 'Stream'
                  },
                  {
                    key: 'subjects',
                    header: 'Subjects',
                    render: (row) =>
                    <span className="text-xs text-gray-600">
                          {row.subjects}
                        </span>

                  },
                  {
                    key: 'status',
                    header: 'Status',
                    render: (row) =>
                    <Badge
                      variant={
                      row.status === 'Registered' ? 'success' : 'warning'
                      }>

                          {row.status}
                        </Badge>

                  }]
                  }
                  data={candidateData} />

              </Card>
            </TabsContent>

            <TabsContent value="internal-assessment" className="mt-4">
              <Card title="Internal Assessment Marks Submission">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-700">
                  Internal assessment marks must be submitted to CISCE portal
                  before 15 February 2025.
                </div>
                <Table
                  columns={[
                  {
                    key: 'rollNo',
                    header: 'Roll No'
                  },
                  {
                    key: 'name',
                    header: 'Student'
                  },
                  {
                    key: 'class',
                    header: 'Class'
                  },
                  {
                    key: 'internalMarks',
                    header: 'Internal Marks',
                    render: (row) =>
                    <Badge
                      variant={
                      row.internalMarks === 'Submitted' ?
                      'success' :
                      'warning'
                      }>

                          {row.internalMarks}
                        </Badge>

                  },
                  {
                    key: 'status',
                    header: 'Registration',
                    render: (row) =>
                    <Badge
                      variant={
                      row.status === 'Registered' ? 'success' : 'warning'
                      }>

                          {row.status}
                        </Badge>

                  }]
                  }
                  data={candidateData} />

              </Card>
            </TabsContent>

            <TabsContent value="practicals" className="mt-4">
              <Card title="Practical Marks Upload Summary">
                <Table
                  columns={[
                  {
                    key: 'subject',
                    header: 'Subject'
                  },
                  {
                    key: 'class',
                    header: 'Class'
                  },
                  {
                    key: 'totalStudents',
                    header: 'Total Students'
                  },
                  {
                    key: 'marksUploaded',
                    header: 'Marks Uploaded'
                  },
                  {
                    key: 'status',
                    header: 'Status',
                    render: (row) =>
                    <Badge
                      variant={
                      row.status === 'Complete' ? 'success' : 'warning'
                      }>

                          {row.status}
                        </Badge>

                  }]
                  }
                  data={practicalData} />

              </Card>
            </TabsContent>

            <TabsContent value="rte-ews" className="mt-4 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-700">34</p>
                  <p className="text-xs text-green-600 mt-1">
                    RTE Seats Filled
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-700">36</p>
                  <p className="text-xs text-blue-600 mt-1">
                    RTE Seats Allocated
                  </p>
                </div>
                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-700">2</p>
                  <p className="text-xs text-yellow-600 mt-1">
                    RTE Seats Vacant
                  </p>
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-purple-700">70</p>
                  <p className="text-xs text-purple-600 mt-1">EWS Admissions</p>
                </div>
              </div>
              <Card
                title="RTE Seats — Class-wise Allocation vs Filled"
                headerAction={
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<DownloadIcon className="w-4 h-4" />}>

                    Export
                  </Button>
                }>

                <Table
                  columns={[
                  {
                    key: 'class',
                    header: 'Class'
                  },
                  {
                    key: 'rteSeats',
                    header: 'RTE Seats'
                  },
                  {
                    key: 'filled',
                    header: 'Filled',
                    render: (row) =>
                    <span className="font-medium text-green-700">
                          {row.filled}
                        </span>

                  },
                  {
                    key: 'vacant',
                    header: 'Vacant',
                    render: (row) =>
                    <span
                      className={`font-medium ${row.vacant > 0 ? 'text-red-600' : 'text-gray-400'}`}>

                          {row.vacant}
                        </span>

                  },
                  {
                    key: 'boys',
                    header: 'Boys'
                  },
                  {
                    key: 'girls',
                    header: 'Girls'
                  },
                  {
                    key: 'obc',
                    header: 'OBC'
                  },
                  {
                    key: 'sc',
                    header: 'SC'
                  },
                  {
                    key: 'st',
                    header: 'ST'
                  }]
                  }
                  data={rteData} />

              </Card>
            </TabsContent>

            <TabsContent value="minority-caste" className="mt-4 space-y-4">
              <Card
                title="Religion-wise Student Distribution"
                headerAction={
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<DownloadIcon className="w-4 h-4" />}>

                    Export
                  </Button>
                }>

                <Table
                  columns={[
                  {
                    key: 'religion',
                    header: 'Religion',
                    render: (row) =>
                    <span className="font-medium text-gray-900">
                          {row.religion}
                        </span>

                  },
                  {
                    key: 'count',
                    header: 'Count',
                    render: (row) =>
                    <span className="font-medium text-blue-700">
                          {row.count}
                        </span>

                  },
                  {
                    key: 'percentage',
                    header: 'Percentage',
                    render: (row) =>
                    <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                          className="h-2 rounded-full bg-blue-500"
                          style={{
                            width: row.percentage
                          }} />

                          </div>
                          <span className="text-sm">{row.percentage}</span>
                        </div>

                  },
                  {
                    key: 'boys',
                    header: 'Boys'
                  },
                  {
                    key: 'girls',
                    header: 'Girls'
                  }]
                  }
                  data={religionData} />

              </Card>
              <Card
                title="Caste Category Breakdown"
                headerAction={
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<DownloadIcon className="w-4 h-4" />}>

                    Export
                  </Button>
                }>

                <Table
                  columns={[
                  {
                    key: 'category',
                    header: 'Category',
                    render: (row) =>
                    <span className="font-medium text-gray-900">
                          {row.category}
                        </span>

                  },
                  {
                    key: 'count',
                    header: 'Count',
                    render: (row) =>
                    <span className="font-medium text-blue-700">
                          {row.count}
                        </span>

                  },
                  {
                    key: 'percentage',
                    header: 'Percentage',
                    render: (row) =>
                    <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                          className="h-2 rounded-full bg-purple-500"
                          style={{
                            width: row.percentage
                          }} />

                          </div>
                          <span className="text-sm">{row.percentage}</span>
                        </div>

                  },
                  {
                    key: 'boys',
                    header: 'Boys'
                  },
                  {
                    key: 'girls',
                    header: 'Girls'
                  }]
                  }
                  data={casteData} />

              </Card>
            </TabsContent>

            <TabsContent value="gender" className="mt-4 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-700">638</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Male Students (51.1%)
                  </p>
                </div>
                <div className="bg-pink-50 border border-pink-100 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-pink-700">610</p>
                  <p className="text-xs text-pink-600 mt-1">
                    Female Students (48.9%)
                  </p>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-700">51:49</p>
                  <p className="text-xs text-green-600 mt-1">M:F Ratio</p>
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-purple-700">+1.8%</p>
                  <p className="text-xs text-purple-600 mt-1">
                    Girl Enrollment Growth
                  </p>
                </div>
              </div>
              <Card
                title="Gender Distribution by Class"
                headerAction={
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<DownloadIcon className="w-4 h-4" />}>

                    Export
                  </Button>
                }>

                <Table
                  columns={[
                  {
                    key: 'class',
                    header: 'Class'
                  },
                  {
                    key: 'boys',
                    header: 'Boys',
                    render: (row) =>
                    <span className="font-medium text-blue-700">
                          {row.boys}
                        </span>

                  },
                  {
                    key: 'girls',
                    header: 'Girls',
                    render: (row) =>
                    <span className="font-medium text-pink-700">
                          {row.girls}
                        </span>

                  },
                  {
                    key: 'total',
                    header: 'Total'
                  },
                  {
                    key: 'ratio',
                    header: 'M:F Ratio'
                  },
                  {
                    key: 'bar',
                    header: 'Distribution',
                    render: (row) =>
                    <div className="flex h-3 rounded-full overflow-hidden w-32">
                          <div
                        className="bg-blue-400"
                        style={{
                          width: `${row.boys / row.total * 100}%`
                        }} />

                          <div
                        className="bg-pink-400"
                        style={{
                          width: `${row.girls / row.total * 100}%`
                        }} />

                        </div>

                  }]
                  }
                  data={genderClassData} />

              </Card>
            </TabsContent>

            <TabsContent value="strength" className="mt-4 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-700">1,248</p>
                  <p className="text-xs text-blue-600 mt-1">Total Students</p>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-700">38</p>
                  <p className="text-xs text-green-600 mt-1">Sections</p>
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-purple-700">32.8</p>
                  <p className="text-xs text-purple-600 mt-1">
                    Avg Section Size
                  </p>
                </div>
                <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-orange-700">87%</p>
                  <p className="text-xs text-orange-600 mt-1">
                    Avg Capacity Utilization
                  </p>
                </div>
              </div>
              <Card
                title="Class-wise Strength Report"
                headerAction={
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<DownloadIcon className="w-4 h-4" />}>

                    Export
                  </Button>
                }>

                <Table
                  columns={[
                  {
                    key: 'class',
                    header: 'Class'
                  },
                  {
                    key: 'sections',
                    header: 'Sections'
                  },
                  {
                    key: 'boys',
                    header: 'Boys'
                  },
                  {
                    key: 'girls',
                    header: 'Girls'
                  },
                  {
                    key: 'total',
                    header: 'Total',
                    render: (row) =>
                    <span className="font-bold text-gray-900">
                          {row.total}
                        </span>

                  },
                  {
                    key: 'capacity',
                    header: 'Capacity'
                  },
                  {
                    key: 'utilization',
                    header: 'Utilization',
                    render: (row) =>
                    <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                          className={`h-2 rounded-full ${parseInt(row.utilization) > 100 ? 'bg-red-500' : parseInt(row.utilization) > 90 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{
                            width: `${Math.min(parseInt(row.utilization), 100)}%`
                          }} />

                          </div>
                          <span className="text-sm">{row.utilization}</span>
                        </div>

                  }]
                  }
                  data={strengthData} />

              </Card>
            </TabsContent>

            <TabsContent value="attendance" className="mt-4 space-y-4">
              <Card
                title="Class-wise Attendance Summary"
                headerAction={
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<DownloadIcon className="w-4 h-4" />}>

                    Export
                  </Button>
                }>

                <Table
                  columns={[
                  {
                    key: 'class',
                    header: 'Class'
                  },
                  {
                    key: 'totalStudents',
                    header: 'Total Students'
                  },
                  {
                    key: 'avgAttendance',
                    header: 'Avg Attendance',
                    render: (row) =>
                    <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                          className={`h-2 rounded-full ${parseFloat(row.avgAttendance) >= 95 ? 'bg-green-500' : parseFloat(row.avgAttendance) >= 85 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{
                            width: row.avgAttendance
                          }} />

                          </div>
                          <span className="font-medium text-sm">
                            {row.avgAttendance}
                          </span>
                        </div>

                  },
                  {
                    key: 'lowAttendance',
                    header: 'Low Attendance (<75%)',
                    render: (row) =>
                    <span
                      className={`font-medium ${row.lowAttendance > 5 ? 'text-red-600' : 'text-gray-700'}`}>

                          {row.lowAttendance}
                        </span>

                  },
                  {
                    key: 'status',
                    header: 'Status',
                    render: (row) =>
                    <Badge
                      variant={
                      row.status === 'Excellent' ?
                      'success' :
                      row.status === 'Good' ?
                      'primary' :
                      'warning'
                      }>

                          {row.status}
                        </Badge>

                  }]
                  }
                  data={attendanceSummaryData} />

              </Card>
            </TabsContent>

            <TabsContent value="exam-performance" className="mt-4 space-y-4">
              <Card
                title="ICSE/ISC Exam Performance Summary"
                headerAction={
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<DownloadIcon className="w-4 h-4" />}>

                    Export
                  </Button>
                }>

                <Table
                  columns={[
                  {
                    key: 'class',
                    header: 'Exam'
                  },
                  {
                    key: 'appeared',
                    header: 'Appeared'
                  },
                  {
                    key: 'passed',
                    header: 'Passed',
                    render: (row) =>
                    <span className="font-medium text-green-700">
                          {row.passed}
                        </span>

                  },
                  {
                    key: 'passPercent',
                    header: 'Pass %',
                    render: (row) =>
                    <Badge variant="success">{row.passPercent}</Badge>

                  },
                  {
                    key: 'distinction',
                    header: 'Distinction'
                  },
                  {
                    key: 'avgScore',
                    header: 'Avg Score'
                  },
                  {
                    key: 'topScorer',
                    header: 'Top Scorer',
                    render: (row) =>
                    <span className="text-sm text-blue-700 font-medium">
                          {row.topScorer}
                        </span>

                  }]
                  }
                  data={examPerformanceData} />

              </Card>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-green-700">97.8%</p>
                  <p className="text-sm text-green-600 mt-1">Overall Pass %</p>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-blue-700">41.2%</p>
                  <p className="text-sm text-blue-600 mt-1">Distinction %</p>
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-purple-700">77.6%</p>
                  <p className="text-sm text-purple-600 mt-1">
                    School Average Score
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>

      <Modal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        title={`Generate Report: ${selectedReport?.name || ''}`}
        size="lg">

        <div className="space-y-5">
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex flex-wrap gap-2 items-center text-xs">
            <span className="text-blue-700 font-medium">Scope:</span>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
              {selectedBranchLabels}
            </span>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
              AY {generateForm.batchYear}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Batch Year"
              options={batchYearOptions}
              value={generateForm.batchYear}
              onChange={(v) =>
              setGenerateForm((f) => ({
                ...f,
                batchYear: v
              }))
              } />

            <Select
              label="Class"
              options={[
              {
                value: '',
                label: 'All Classes'
              },
              {
                value: 'X',
                label: 'Class X (ICSE)'
              },
              {
                value: 'XII',
                label: 'Class XII (ISC)'
              },
              ...Array.from(
                {
                  length: 9
                },
                (_, i) => ({
                  value: `${i + 1}`,
                  label: `Class ${i + 1}`
                })
              )]
              }
              value={generateForm.class}
              onChange={(v) =>
              setGenerateForm((f) => ({
                ...f,
                class: v
              }))
              } />

            <Select
              label="Output Format"
              options={[
              {
                value: 'pdf',
                label: 'PDF (Styled)'
              },
              {
                value: 'excel',
                label: 'Excel (Formatted)'
              },
              {
                value: 'csv',
                label: 'CSV (Raw Data)'
              }]
              }
              value={generateForm.format}
              onChange={(v) =>
              setGenerateForm((f) => ({
                ...f,
                format: v
              }))
              } />

          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={generateForm.includeCharts}
              onChange={(e) =>
              setGenerateForm((f) => ({
                ...f,
                includeCharts: e.target.checked
              }))
              }
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />

            Include Charts & Graphs
          </label>
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={() => setShowGenerateModal(false)}>

              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmitGenerate}
              leftIcon={
              generating ?
              <RefreshCwIcon className="w-4 h-4 animate-spin" /> :

              <FileTextIcon className="w-4 h-4" />

              }>

              {generating ? 'Generating...' : 'Generate Report'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>);

}