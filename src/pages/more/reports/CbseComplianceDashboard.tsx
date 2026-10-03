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
  UsersIcon,
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

// ── Data ──────────────────────────────────────────────────────────────────────
const staffData = [
{
  id: 1,
  name: 'Ms. Priya Sharma',
  designation: 'Principal',
  qualification: 'M.Ed, PhD',
  experience: '18 yrs',
  status: 'Verified'
},
{
  id: 2,
  name: 'Mr. Rajesh Patel',
  designation: 'Vice Principal',
  qualification: 'M.Sc, B.Ed',
  experience: '14 yrs',
  status: 'Verified'
},
{
  id: 3,
  name: 'Ms. Anita Verma',
  designation: 'PGT Mathematics',
  qualification: 'M.Sc, B.Ed',
  experience: '10 yrs',
  status: 'Verified'
},
{
  id: 4,
  name: 'Mr. Suresh Kumar',
  designation: 'TGT Science',
  qualification: 'B.Sc, B.Ed',
  experience: '7 yrs',
  status: 'Pending'
},
{
  id: 5,
  name: 'Ms. Kavita Singh',
  designation: 'PRT English',
  qualification: 'BA, B.Ed',
  experience: '5 yrs',
  status: 'Verified'
}];

const locData = [
{
  id: 1,
  student: 'Aarav Mehta',
  class: 'X',
  rollNo: 'X-001',
  subject: 'Mathematics, Science, English',
  status: 'Submitted'
},
{
  id: 2,
  student: 'Diya Patel',
  class: 'X',
  rollNo: 'X-002',
  subject: 'Mathematics, Science, Hindi',
  status: 'Submitted'
},
{
  id: 3,
  student: 'Rohan Shah',
  class: 'XII',
  rollNo: 'XII-001',
  subject: 'Physics, Chemistry, Maths',
  status: 'Pending Correction'
},
{
  id: 4,
  student: 'Priya Joshi',
  class: 'XII',
  rollNo: 'XII-002',
  subject: 'Biology, Chemistry, English',
  status: 'Submitted'
},
{
  id: 5,
  student: 'Arjun Nair',
  class: 'X',
  rollNo: 'X-003',
  subject: 'Social Science, Hindi, English',
  status: 'Draft'
}];

const complianceItems = [
{
  item: 'Mandatory Public Disclosure',
  status: 'Compliant',
  lastUpdated: '15 Jan 2025',
  remarks: 'Published on website'
},
{
  item: 'Affiliation Certificate',
  status: 'Compliant',
  lastUpdated: '01 Apr 2024',
  remarks: 'Valid till 2027'
},
{
  item: 'Fire Safety Certificate',
  status: 'Expiring Soon',
  lastUpdated: '10 Mar 2024',
  remarks: 'Expires in 45 days'
},
{
  item: 'Building Safety Certificate',
  status: 'Compliant',
  lastUpdated: '20 Jun 2024',
  remarks: 'Valid till 2026'
},
{
  item: 'Teacher-Student Ratio',
  status: 'Compliant',
  lastUpdated: '01 Jan 2025',
  remarks: '1:28 (CBSE norm: 1:30)'
},
{
  item: 'PTA Details',
  status: 'Compliant',
  lastUpdated: '05 Dec 2024',
  remarks: 'Updated'
},
{
  item: 'SMC Details',
  status: 'Non-Compliant',
  lastUpdated: '—',
  remarks: 'SMC not formed for 2024-25'
},
{
  item: 'Fee Structure Published',
  status: 'Compliant',
  lastUpdated: '01 Apr 2024',
  remarks: 'On website'
}];

const rteData = [
{
  id: 1,
  class: 'Class I',
  rteSeats: 12,
  filled: 11,
  vacant: 1,
  boys: 6,
  girls: 5,
  general: 0,
  obc: 4,
  sc: 5,
  st: 2
},
{
  id: 2,
  class: 'Class II',
  rteSeats: 12,
  filled: 12,
  vacant: 0,
  boys: 7,
  girls: 5,
  general: 0,
  obc: 5,
  sc: 4,
  st: 3
},
{
  id: 3,
  class: 'Class III',
  rteSeats: 10,
  filled: 9,
  vacant: 1,
  boys: 5,
  girls: 4,
  general: 0,
  obc: 3,
  sc: 4,
  st: 2
},
{
  id: 4,
  class: 'Class IV',
  rteSeats: 10,
  filled: 10,
  vacant: 0,
  boys: 6,
  girls: 4,
  general: 0,
  obc: 4,
  sc: 3,
  st: 3
},
{
  id: 5,
  class: 'Class V',
  rteSeats: 8,
  filled: 7,
  vacant: 1,
  boys: 4,
  girls: 3,
  general: 0,
  obc: 3,
  sc: 2,
  st: 2
}];

const religionData = [
{
  id: 1,
  religion: 'Hindu',
  count: 820,
  percentage: '65.7%',
  boys: 428,
  girls: 392
},
{
  id: 2,
  religion: 'Muslim',
  count: 186,
  percentage: '14.9%',
  boys: 98,
  girls: 88
},
{
  id: 3,
  religion: 'Christian',
  count: 124,
  percentage: '9.9%',
  boys: 62,
  girls: 62
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
  count: 42,
  percentage: '3.4%',
  boys: 22,
  girls: 20
},
{
  id: 6,
  religion: 'Other',
  count: 14,
  percentage: '1.1%',
  boys: 8,
  girls: 6
}];

const casteData = [
{
  id: 1,
  category: 'General',
  count: 620,
  percentage: '49.7%',
  boys: 322,
  girls: 298
},
{
  id: 2,
  category: 'OBC',
  count: 310,
  percentage: '24.8%',
  boys: 162,
  girls: 148
},
{
  id: 3,
  category: 'SC',
  count: 186,
  percentage: '14.9%',
  boys: 98,
  girls: 88
},
{
  id: 4,
  category: 'ST',
  count: 70,
  percentage: '5.6%',
  boys: 38,
  girls: 32
},
{
  id: 5,
  category: 'EWS',
  count: 62,
  percentage: '5.0%',
  boys: 32,
  girls: 30
}];

const genderClassData = [
{
  id: 1,
  class: 'Class I',
  boys: 52,
  girls: 48,
  total: 100,
  ratio: '52:48'
},
{
  id: 2,
  class: 'Class III',
  boys: 58,
  girls: 54,
  total: 112,
  ratio: '52:48'
},
{
  id: 3,
  class: 'Class V',
  boys: 64,
  girls: 60,
  total: 124,
  ratio: '52:48'
},
{
  id: 4,
  class: 'Class VIII',
  boys: 68,
  girls: 64,
  total: 132,
  ratio: '52:48'
},
{
  id: 5,
  class: 'Class X',
  boys: 72,
  girls: 68,
  total: 140,
  ratio: '51:49'
},
{
  id: 6,
  class: 'Class XII',
  boys: 68,
  girls: 64,
  total: 132,
  ratio: '52:48'
}];

const strengthData = [
{
  id: 1,
  class: 'Class I',
  sections: 3,
  boys: 52,
  girls: 48,
  total: 100,
  capacity: 120,
  utilization: '83%'
},
{
  id: 2,
  class: 'Class II',
  sections: 3,
  boys: 56,
  girls: 52,
  total: 108,
  capacity: 120,
  utilization: '90%'
},
{
  id: 3,
  class: 'Class III',
  sections: 3,
  boys: 58,
  girls: 54,
  total: 112,
  capacity: 120,
  utilization: '93%'
},
{
  id: 4,
  class: 'Class V',
  sections: 3,
  boys: 64,
  girls: 60,
  total: 124,
  capacity: 120,
  utilization: '103%'
},
{
  id: 5,
  class: 'Class VIII',
  sections: 4,
  boys: 68,
  girls: 64,
  total: 132,
  capacity: 160,
  utilization: '83%'
},
{
  id: 6,
  class: 'Class X',
  sections: 4,
  boys: 72,
  girls: 68,
  total: 140,
  capacity: 160,
  utilization: '88%'
},
{
  id: 7,
  class: 'Class XII',
  sections: 4,
  boys: 68,
  girls: 64,
  total: 132,
  capacity: 160,
  utilization: '83%'
}];

const attendanceSummaryData = [
{
  id: 1,
  class: 'Class I',
  avgAttendance: '94.2%',
  lowAttendance: 3,
  totalStudents: 100,
  status: 'Good'
},
{
  id: 2,
  class: 'Class III',
  avgAttendance: '91.8%',
  lowAttendance: 5,
  totalStudents: 112,
  status: 'Good'
},
{
  id: 3,
  class: 'Class V',
  avgAttendance: '88.4%',
  lowAttendance: 8,
  totalStudents: 124,
  status: 'Average'
},
{
  id: 4,
  class: 'Class VIII',
  avgAttendance: '93.6%',
  lowAttendance: 4,
  totalStudents: 132,
  status: 'Good'
},
{
  id: 5,
  class: 'Class X',
  avgAttendance: '96.2%',
  lowAttendance: 2,
  totalStudents: 140,
  status: 'Excellent'
},
{
  id: 6,
  class: 'Class XII',
  avgAttendance: '97.8%',
  lowAttendance: 1,
  totalStudents: 132,
  status: 'Excellent'
}];

const examPerformanceData = [
{
  id: 1,
  class: 'Class X',
  appeared: 140,
  passed: 136,
  passPercent: '97.1%',
  distinction: 48,
  avgScore: '74.2%',
  topScorer: 'Sneha Joshi (98.4%)'
},
{
  id: 2,
  class: 'Class XII',
  appeared: 132,
  passed: 128,
  passPercent: '97.0%',
  distinction: 52,
  avgScore: '76.8%',
  topScorer: 'Aarav Mehta (97.2%)'
}];

const generatedReports = [
{
  id: 1,
  name: 'Mandatory Public Disclosure PDF',
  type: 'Compliance',
  generatedAt: '25 Feb 2026, 10:30',
  generatedBy: 'Admin',
  branches: 'All Branches',
  format: 'PDF',
  size: '2.1 MB',
  status: 'Completed'
},
{
  id: 2,
  name: 'LOC Submission — Class X',
  type: 'Examination',
  generatedAt: '24 Feb 2026, 15:00',
  generatedBy: 'Principal',
  branches: 'Main Campus',
  format: 'PDF',
  size: '1.4 MB',
  status: 'Completed'
},
{
  id: 3,
  name: 'Compliance Checklist Report',
  type: 'Compliance',
  generatedAt: '24 Feb 2026, 09:15',
  generatedBy: 'Admin',
  branches: 'All Branches',
  format: 'Excel',
  size: '0.8 MB',
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
  name: 'Gender Distribution Report',
  type: 'Demographics',
  generatedAt: '23 Feb 2026, 11:00',
  generatedBy: 'System',
  branches: 'All Branches',
  format: 'Excel',
  size: '0.9 MB',
  status: 'Processing'
},
{
  id: 6,
  name: 'Annual Academic Report 2024-25',
  type: 'Annual',
  generatedAt: '22 Feb 2026, 16:45',
  generatedBy: 'Admin',
  branches: 'East Branch',
  format: 'PDF',
  size: '3.2 MB',
  status: 'Failed'
}];

// ── Report categories ─────────────────────────────────────────────────────────
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
    id: 'public-disclosure',
    name: 'Mandatory Public Disclosure',
    description: 'Website-ready public disclosure PDF as per CBSE norms',
    tags: ['Disclosure', 'CBSE'],
    isFeatured: true
  },
  {
    id: 'affiliation-status',
    name: 'Affiliation Certificate Status',
    description: 'Affiliation validity and renewal status report',
    tags: ['Affiliation', 'Certificate']
  },
  {
    id: 'compliance-checklist',
    name: 'Compliance Checklist Report',
    description: 'Full CBSE compliance checklist with status',
    tags: ['Checklist', 'Compliance'],
    isFeatured: true
  },
  {
    id: 'fire-safety',
    name: 'Fire Safety Status',
    description: 'Fire safety certificate status and renewal tracking',
    tags: ['Fire Safety', 'Certificate']
  }]

},
{
  id: 'examination',
  label: 'Examination Reports',
  color: 'bg-green-600',
  bgColor: 'bg-green-50',
  reports: [
  {
    id: 'loc-submission',
    name: 'LOC (List of Candidates)',
    description: 'Class X & XII candidate list for CBSE board submission',
    tags: ['LOC', 'Board'],
    isFeatured: true
  },
  {
    id: 'exam-center',
    name: 'Exam Center Readiness',
    description: 'CCTV, seating, invigilator deployment status',
    tags: ['Exam Center', 'Readiness']
  },
  {
    id: 'board-result',
    name: 'Board Result Summary',
    description: 'Class X & XII board exam performance summary',
    tags: ['Board', 'Result'],
    isFeatured: true
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
    description: 'Class-wise RTE allocation vs filled seats with EWS data',
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
  },
  {
    id: 'capacity-util',
    name: 'Capacity Utilization Report',
    description: 'Room and section capacity utilization analysis',
    tags: ['Capacity', 'Utilization']
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
    description: 'Staff list with qualifications for public disclosure',
    tags: ['Staff', 'Qualification']
  },
  {
    id: 'teacher-ratio',
    name: 'Teacher-Student Ratio',
    description: 'Teacher-student ratio compliance with CBSE norms',
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
export function CbseComplianceDashboard() {
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['all']);
  const [batchYear, setBatchYear] = useState('2024-25');
  const [mainTab, setMainTab] = useState('templates');
  const [liveInnerTab, setLiveInnerTab] = useState('public-disclosure');
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
  const [locClassFilter, setLocClassFilter] = useState('all');
  const [locSearch, setLocSearch] = useState('');
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
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            CBSE Compliance Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Mandatory public disclosure, affiliation compliance, RTE/EWS,
            minority, gender and strength reports
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

      {/* Multi-Branch Filter */}
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

      {/* Main Tabs */}
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

        {/* TAB 1: Report Templates */}
        <TabsContent value="templates" className="mt-4 space-y-5">
          {/* Featured */}
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

          {/* Category filter + search */}
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

          {/* Report Cards */}
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
          {filteredReports.length === 0 &&
          <div className="text-center py-12 text-gray-400">
              <FileTextIcon className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No reports found matching your search.</p>
            </div>
          }
        </TabsContent>

        {/* TAB 2: Generated Reports */}
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
                  },
                  {
                    value: 'csv',
                    label: 'CSV'
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
                  className={`px-2 py-0.5 rounded text-xs font-semibold ${row.format === 'PDF' ? 'bg-red-100 text-red-700' : row.format === 'Excel' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>

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

        {/* TAB 3: Live Data & Analytics */}
        <TabsContent value="live" className="mt-4 space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">6</p>
                <p className="text-xs text-gray-500">Compliant Items</p>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangleIcon className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">2</p>
                <p className="text-xs text-gray-500">Non-Compliant</p>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UsersIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">1,248</p>
                <p className="text-xs text-gray-500">Total Students</p>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BuildingIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">42</p>
                <p className="text-xs text-gray-500">Staff Members</p>
              </div>
            </div>
          </div>

          {/* Inner Tabs */}
          <Tabs value={liveInnerTab} onValueChange={setLiveInnerTab}>
            <div className="overflow-x-auto">
              <TabsList>
                <TabsTrigger value="public-disclosure">
                  Public Disclosure
                </TabsTrigger>
                <TabsTrigger value="annual-report">Annual Report</TabsTrigger>
                <TabsTrigger value="loc-exam">LOC & Exam</TabsTrigger>
                <TabsTrigger value="compliance-checklist">
                  Compliance Checklist
                </TabsTrigger>
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

            <TabsContent value="public-disclosure" className="mt-4 space-y-4">
              <Card
                title="Mandatory Public Disclosure Report"
                headerAction={
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<DownloadIcon className="w-4 h-4" />}>

                    Website-ready PDF
                  </Button>
                }>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800 text-sm">
                      School Profile
                    </h4>
                    <div className="space-y-2 text-sm">
                      {[
                      ['School Name', 'Sunrise International School'],
                      ['Affiliation No.', '430-1234567'],
                      ['School Code', '56789'],
                      ['Affiliation Type', 'Secondary & Sr. Secondary'],
                      ['Affiliation Period', '01 Apr 2022 – 31 Mar 2027'],
                      ['Principal', 'Ms. Priya Sharma']].
                      map(([k, v]) =>
                      <div
                        key={k}
                        className="flex justify-between py-1 border-b border-gray-100">

                          <span className="text-gray-500">{k}</span>
                          <span className="font-medium">{v}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800 text-sm">
                      Infrastructure Report
                    </h4>
                    <div className="space-y-2 text-sm">
                      {[
                      ['Total Classrooms', '48'],
                      ['Labs', '6 (Science, Computer, Language)'],
                      ['Library', 'Yes (8,500 books)'],
                      ['Sports Ground', 'Yes (2 acres)'],
                      ['Drinking Water', 'RO Purified'],
                      ['Ramp for Disabled', 'Yes']].
                      map(([k, v]) =>
                      <div
                        key={k}
                        className="flex justify-between py-1 border-b border-gray-100">

                          <span className="text-gray-500">{k}</span>
                          <span className="font-medium">{v}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
              <Card title="Staff List with Qualifications">
                <Table
                  columns={[
                  {
                    key: 'name',
                    header: 'Name'
                  },
                  {
                    key: 'designation',
                    header: 'Designation'
                  },
                  {
                    key: 'qualification',
                    header: 'Qualification'
                  },
                  {
                    key: 'experience',
                    header: 'Experience'
                  },
                  {
                    key: 'status',
                    header: 'Status',
                    render: (row) =>
                    <Badge
                      variant={
                      row.status === 'Verified' ? 'success' : 'warning'
                      }>

                          {row.status}
                        </Badge>

                  }]
                  }
                  data={staffData} />

              </Card>
            </TabsContent>

            <TabsContent value="annual-report" className="mt-4 space-y-4">
              <Card title="Annual Academic Report Summary">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-blue-700">1,248</p>
                    <p className="text-sm text-blue-600 mt-1">
                      Total Student Strength
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-green-700">94.2%</p>
                    <p className="text-sm text-green-600 mt-1">
                      Board Pass Percentage
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-purple-700">42</p>
                    <p className="text-sm text-purple-600 mt-1">
                      Teaching Staff
                    </p>
                  </div>
                </div>
                <Table
                  columns={[
                  {
                    key: 'class',
                    header: 'Class'
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
                    header: 'Total'
                  },
                  {
                    key: 'sections',
                    header: 'Sections'
                  }]
                  }
                  data={[
                  {
                    id: 1,
                    class: 'Class I',
                    boys: 52,
                    girls: 48,
                    total: 100,
                    sections: 3
                  },
                  {
                    id: 2,
                    class: 'Class V',
                    boys: 58,
                    girls: 54,
                    total: 112,
                    sections: 3
                  },
                  {
                    id: 3,
                    class: 'Class VIII',
                    boys: 64,
                    girls: 60,
                    total: 124,
                    sections: 4
                  },
                  {
                    id: 4,
                    class: 'Class X',
                    boys: 72,
                    girls: 68,
                    total: 140,
                    sections: 4
                  },
                  {
                    id: 5,
                    class: 'Class XII',
                    boys: 68,
                    girls: 64,
                    total: 132,
                    sections: 4
                  }]
                  } />

              </Card>
            </TabsContent>

            <TabsContent value="loc-exam" className="mt-4 space-y-4">
              <Card
                title="List of Candidates (LOC) — Class X / XII"
                headerAction={
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Validate Data
                    </Button>
                    <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<DownloadIcon className="w-4 h-4" />}>

                      Submit to CBSE
                    </Button>
                  </div>
                }>

                <div className="flex flex-wrap gap-3 mb-4">
                  <Select
                    label="Class"
                    options={[
                    {
                      value: 'all',
                      label: 'All Classes'
                    },
                    {
                      value: 'X',
                      label: 'Class X'
                    },
                    {
                      value: 'XII',
                      label: 'Class XII'
                    }]
                    }
                    value={locClassFilter}
                    onChange={setLocClassFilter} />

                  <Input
                    label="Search Student"
                    placeholder="Name or Roll No..."
                    value={locSearch}
                    onChange={(e) => setLocSearch(e.target.value)} />

                </div>
                <Table
                  columns={[
                  {
                    key: 'rollNo',
                    header: 'Roll No'
                  },
                  {
                    key: 'student',
                    header: 'Student Name'
                  },
                  {
                    key: 'class',
                    header: 'Class'
                  },
                  {
                    key: 'subject',
                    header: 'Subjects'
                  },
                  {
                    key: 'status',
                    header: 'Status',
                    render: (row) =>
                    <Badge
                      variant={
                      row.status === 'Submitted' ?
                      'success' :
                      row.status === 'Pending Correction' ?
                      'warning' :
                      'default'
                      }>

                          {row.status}
                        </Badge>

                  }]
                  }
                  data={locData.filter(
                    (r) =>
                    (locClassFilter === 'all' ||
                    r.class === locClassFilter) && (
                    !locSearch ||
                    r.student.
                    toLowerCase().
                    includes(locSearch.toLowerCase()) ||
                    r.rollNo.
                    toLowerCase().
                    includes(locSearch.toLowerCase()))
                  )} />

              </Card>
            </TabsContent>

            <TabsContent value="compliance-checklist" className="mt-4">
              <Card
                title="CBSE Compliance Checklist"
                headerAction={
                <Badge variant="warning">2 Items Need Attention</Badge>
                }>

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
                      row.status === 'Expiring Soon' ?
                      'warning' :
                      'danger'
                      }>

                          {row.status}
                        </Badge>

                  },
                  {
                    key: 'lastUpdated',
                    header: 'Last Updated'
                  },
                  {
                    key: 'remarks',
                    header: 'Remarks'
                  }]
                  }
                  data={complianceItems} />

              </Card>
            </TabsContent>

            <TabsContent value="rte-ews" className="mt-4 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-700">104</p>
                  <p className="text-xs text-green-600 mt-1">
                    RTE Seats Filled
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-700">120</p>
                  <p className="text-xs text-blue-600 mt-1">
                    RTE Seats Allocated
                  </p>
                </div>
                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-700">16</p>
                  <p className="text-xs text-yellow-600 mt-1">
                    RTE Seats Vacant
                  </p>
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-purple-700">62</p>
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
                    header: 'RTE Seats Allocated'
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
                  <p className="text-2xl font-bold text-blue-700">648</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Male Students (52%)
                  </p>
                </div>
                <div className="bg-pink-50 border border-pink-100 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-pink-700">600</p>
                  <p className="text-xs text-pink-600 mt-1">
                    Female Students (48%)
                  </p>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-700">52:48</p>
                  <p className="text-xs text-green-600 mt-1">M:F Ratio</p>
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-purple-700">+2.4%</p>
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
                  <p className="text-2xl font-bold text-green-700">42</p>
                  <p className="text-xs text-green-600 mt-1">Classes</p>
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-purple-700">29.7</p>
                  <p className="text-xs text-purple-600 mt-1">Avg Class Size</p>
                </div>
                <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-orange-700">88%</p>
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
                title="Board Exam Performance Summary"
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
                  <p className="text-3xl font-bold text-green-700">97.0%</p>
                  <p className="text-sm text-green-600 mt-1">Overall Pass %</p>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-blue-700">38.2%</p>
                  <p className="text-sm text-blue-600 mt-1">Distinction %</p>
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-purple-700">75.5%</p>
                  <p className="text-sm text-purple-600 mt-1">
                    School Average Score
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>

      {/* Generate Modal */}
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
              ...Array.from(
                {
                  length: 12
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