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
  ClipboardListIcon,
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

const inspectionData = [
{
  id: 1,
  item: 'School Profile Auto-fill',
  status: 'Complete',
  lastUpdated: '10 Jan 2025',
  remarks: 'All fields populated'
},
{
  id: 2,
  item: 'Staff Details',
  status: 'Complete',
  lastUpdated: '08 Jan 2025',
  remarks: '42 staff records verified'
},
{
  id: 3,
  item: 'Student Enrollment',
  status: 'Complete',
  lastUpdated: '05 Jan 2025',
  remarks: '1,248 students enrolled'
},
{
  id: 4,
  item: 'Infrastructure Details',
  status: 'Complete',
  lastUpdated: '12 Jan 2025',
  remarks: 'All rooms documented'
},
{
  id: 5,
  item: 'Lab Equipment Compliance',
  status: 'Partial',
  lastUpdated: '03 Jan 2025',
  remarks: 'Chemistry lab equipment list pending'
},
{
  id: 6,
  item: 'Approval Status',
  status: 'Approved',
  lastUpdated: '15 Jan 2025',
  remarks: 'District Education Officer approved'
}];

const examCenterData = [
{
  id: 1,
  item: 'CCTV Compliance',
  status: 'Compliant',
  details: '24 cameras installed, all functional'
},
{
  id: 2,
  item: 'Fire Safety Certificate',
  status: 'Expiring Soon',
  details: 'Expires 20 Feb 2025'
},
{
  id: 3,
  item: 'Exam Center Readiness',
  status: 'Ready',
  details: 'All 12 exam halls prepared'
},
{
  id: 4,
  item: 'Invigilator Deployment',
  status: 'Pending',
  details: '28 invigilators assigned, 4 pending'
},
{
  id: 5,
  item: 'Strong Room Security',
  status: 'Compliant',
  details: 'Dual-lock system in place'
},
{
  id: 6,
  item: 'Seating Arrangement',
  status: 'Ready',
  details: 'Seating chart finalized'
}];

const marksheetData = [
{
  id: 1,
  student: 'Aarav Mehta',
  class: 'X',
  rollNo: 'GJ-X-001',
  marksheet: 'Distributed',
  acknowledgement: 'Received'
},
{
  id: 2,
  student: 'Diya Patel',
  class: 'X',
  rollNo: 'GJ-X-002',
  marksheet: 'Distributed',
  acknowledgement: 'Received'
},
{
  id: 3,
  student: 'Rohan Shah',
  class: 'XII',
  rollNo: 'GJ-XII-001',
  marksheet: 'Pending',
  acknowledgement: 'Pending'
},
{
  id: 4,
  student: 'Priya Joshi',
  class: 'XII',
  rollNo: 'GJ-XII-002',
  marksheet: 'Distributed',
  acknowledgement: 'Received'
},
{
  id: 5,
  student: 'Arjun Nair',
  class: 'X',
  rollNo: 'GJ-X-003',
  marksheet: 'Distributed',
  acknowledgement: 'Pending'
}];

const rteData = [
{
  id: 1,
  class: 'Std. I',
  rteSeats: 12,
  filled: 11,
  vacant: 1,
  boys: 6,
  girls: 5,
  obc: 4,
  sc: 5,
  st: 2
},
{
  id: 2,
  class: 'Std. II',
  rteSeats: 12,
  filled: 12,
  vacant: 0,
  boys: 7,
  girls: 5,
  obc: 5,
  sc: 4,
  st: 3
},
{
  id: 3,
  class: 'Std. III',
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
  id: 4,
  class: 'Std. IV',
  rteSeats: 10,
  filled: 10,
  vacant: 0,
  boys: 6,
  girls: 4,
  obc: 4,
  sc: 3,
  st: 3
}];

const religionData = [
{
  id: 1,
  religion: 'Hindu',
  count: 860,
  percentage: '68.9%',
  boys: 448,
  girls: 412
},
{
  id: 2,
  religion: 'Muslim',
  count: 196,
  percentage: '15.7%',
  boys: 102,
  girls: 94
},
{
  id: 3,
  religion: 'Jain',
  count: 98,
  percentage: '7.9%',
  boys: 52,
  girls: 46
},
{
  id: 4,
  religion: 'Christian',
  count: 62,
  percentage: '5.0%',
  boys: 32,
  girls: 30
},
{
  id: 5,
  religion: 'Sikh',
  count: 20,
  percentage: '1.6%',
  boys: 12,
  girls: 8
},
{
  id: 6,
  religion: 'Other',
  count: 12,
  percentage: '1.0%',
  boys: 6,
  girls: 6
}];

const casteData = [
{
  id: 1,
  category: 'General',
  count: 640,
  percentage: '51.3%',
  boys: 332,
  girls: 308
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
  count: 174,
  percentage: '13.9%',
  boys: 92,
  girls: 82
},
{
  id: 4,
  category: 'ST',
  count: 52,
  percentage: '4.2%',
  boys: 28,
  girls: 24
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
  class: 'Std. I',
  boys: 54,
  girls: 50,
  total: 104,
  ratio: '52:48'
},
{
  id: 2,
  class: 'Std. V',
  boys: 60,
  girls: 56,
  total: 116,
  ratio: '52:48'
},
{
  id: 3,
  class: 'Std. VIII',
  boys: 66,
  girls: 62,
  total: 128,
  ratio: '52:48'
},
{
  id: 4,
  class: 'Std. X',
  boys: 74,
  girls: 70,
  total: 144,
  ratio: '51:49'
},
{
  id: 5,
  class: 'Std. XII',
  boys: 70,
  girls: 66,
  total: 136,
  ratio: '51:49'
}];

const strengthData = [
{
  id: 1,
  class: 'Std. I',
  sections: 3,
  boys: 54,
  girls: 50,
  total: 104,
  capacity: 120,
  utilization: '87%'
},
{
  id: 2,
  class: 'Std. V',
  sections: 3,
  boys: 60,
  girls: 56,
  total: 116,
  capacity: 120,
  utilization: '97%'
},
{
  id: 3,
  class: 'Std. VIII',
  sections: 4,
  boys: 66,
  girls: 62,
  total: 128,
  capacity: 160,
  utilization: '80%'
},
{
  id: 4,
  class: 'Std. X',
  sections: 4,
  boys: 74,
  girls: 70,
  total: 144,
  capacity: 160,
  utilization: '90%'
},
{
  id: 5,
  class: 'Std. XII',
  sections: 4,
  boys: 70,
  girls: 66,
  total: 136,
  capacity: 160,
  utilization: '85%'
}];

const attendanceSummaryData = [
{
  id: 1,
  class: 'Std. I',
  avgAttendance: '93.4%',
  lowAttendance: 4,
  totalStudents: 104,
  status: 'Good'
},
{
  id: 2,
  class: 'Std. V',
  avgAttendance: '90.2%',
  lowAttendance: 6,
  totalStudents: 116,
  status: 'Good'
},
{
  id: 3,
  class: 'Std. VIII',
  avgAttendance: '94.8%',
  lowAttendance: 3,
  totalStudents: 128,
  status: 'Good'
},
{
  id: 4,
  class: 'Std. X',
  avgAttendance: '97.1%',
  lowAttendance: 1,
  totalStudents: 144,
  status: 'Excellent'
},
{
  id: 5,
  class: 'Std. XII',
  avgAttendance: '98.2%',
  lowAttendance: 0,
  totalStudents: 136,
  status: 'Excellent'
}];

const examPerformanceData = [
{
  id: 1,
  class: 'Std. X (SSC)',
  appeared: 144,
  passed: 140,
  passPercent: '97.2%',
  distinction: 52,
  avgScore: '76.4%',
  topScorer: 'Diya Patel (97.8%)'
},
{
  id: 2,
  class: 'Std. XII (HSC)',
  appeared: 136,
  passed: 132,
  passPercent: '97.1%',
  distinction: 56,
  avgScore: '78.2%',
  topScorer: 'Aarav Mehta (98.4%)'
}];

const generatedReports = [
{
  id: 1,
  name: 'Annual Inspection Report 2024-25',
  type: 'Inspection',
  generatedAt: '25 Feb 2026, 10:30',
  generatedBy: 'Admin',
  branches: 'All Branches',
  format: 'PDF',
  size: '2.4 MB',
  status: 'Completed'
},
{
  id: 2,
  name: 'SSC Board Exam Compliance',
  type: 'Examination',
  generatedAt: '24 Feb 2026, 15:00',
  generatedBy: 'Principal',
  branches: 'Main Campus',
  format: 'PDF',
  size: '1.6 MB',
  status: 'Completed'
},
{
  id: 3,
  name: 'Marksheet Distribution Record',
  type: 'Certificate',
  generatedAt: '24 Feb 2026, 09:15',
  generatedBy: 'Admin',
  branches: 'All Branches',
  format: 'Excel',
  size: '0.9 MB',
  status: 'Completed'
},
{
  id: 4,
  name: 'RTE Seats Utilization Report',
  type: 'Demographics',
  generatedAt: '23 Feb 2026, 14:30',
  generatedBy: 'Admin',
  branches: 'North, South',
  format: 'PDF',
  size: '0.7 MB',
  status: 'Completed'
},
{
  id: 5,
  name: 'Gender Distribution — Gujarat',
  type: 'Demographics',
  generatedAt: '23 Feb 2026, 11:00',
  generatedBy: 'System',
  branches: 'All Branches',
  format: 'Excel',
  size: '0.8 MB',
  status: 'Processing'
},
{
  id: 6,
  name: 'HSC Performance Analysis',
  type: 'Examination',
  generatedAt: '22 Feb 2026, 16:45',
  generatedBy: 'Admin',
  branches: 'East Branch',
  format: 'PDF',
  size: '2.8 MB',
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
  id: 'inspection',
  label: 'Inspection Reports',
  color: 'bg-blue-600',
  bgColor: 'bg-blue-50',
  reports: [
  {
    id: 'annual-inspection',
    name: 'Annual Inspection Report',
    description: 'GSEB annual school inspection report with all fields',
    tags: ['Inspection', 'GSEB'],
    isFeatured: true
  },
  {
    id: 'infrastructure-report',
    name: 'Infrastructure Compliance',
    description: 'Building, labs, and facilities compliance status',
    tags: ['Infrastructure', 'Compliance']
  },
  {
    id: 'staff-inspection',
    name: 'Staff Inspection Report',
    description: 'Staff qualification and deployment inspection data',
    tags: ['Staff', 'Inspection']
  }]

},
{
  id: 'examination',
  label: 'Examination Reports',
  color: 'bg-green-600',
  bgColor: 'bg-green-50',
  reports: [
  {
    id: 'exam-compliance',
    name: 'Board Exam Compliance',
    description: 'SSC/HSC exam center readiness and compliance',
    tags: ['Exam', 'Compliance'],
    isFeatured: true
  },
  {
    id: 'marksheet-dist',
    name: 'Certificate & Marksheet Distribution',
    description: 'Marksheet distribution record with acknowledgements',
    tags: ['Marksheet', 'Distribution'],
    isFeatured: true
  },
  {
    id: 'board-result',
    name: 'SSC/HSC Result Summary',
    description: 'Board exam performance for Std. X and XII',
    tags: ['SSC', 'HSC', 'Result']
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
    description: 'Standard-wise RTE allocation vs filled seats',
    tags: ['RTE', 'EWS']
  },
  {
    id: 'gender-dist',
    name: 'Gender-wise Distribution',
    description: 'Standard-wise gender distribution and M:F ratio',
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
    description: 'Religion-wise student distribution for Gujarat',
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
    name: 'Standard-wise Strength Report',
    description: 'Division-wise strength with capacity utilization',
    tags: ['Strength', 'Capacity']
  },
  {
    id: 'attendance-summary',
    name: 'Attendance Summary',
    description: 'Standard-wise average attendance and alerts',
    tags: ['Attendance', 'Summary']
  }]

},
{
  id: 'certificate',
  label: 'Certificate & Records',
  color: 'bg-yellow-600',
  bgColor: 'bg-yellow-50',
  reports: [
  {
    id: 'tc-report',
    name: 'Transfer Certificate Records',
    description: 'TC issued and received records for GSEB',
    tags: ['TC', 'Transfer']
  },
  {
    id: 'bonafide',
    name: 'Bonafide Certificate Log',
    description: 'Bonafide certificates issued to students',
    tags: ['Bonafide', 'Certificate']
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
export function GsebComplianceReports() {
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['all']);
  const [batchYear, setBatchYear] = useState('2024-25');
  const [mainTab, setMainTab] = useState('templates');
  const [liveInnerTab, setLiveInnerTab] = useState('inspection');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generateForm, setGenerateForm] = useState({
    batchYear: '2024-25',
    standard: '',
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
            GSEB / Gujarat Board Compliance Reports
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Annual inspection, board examination compliance, RTE/EWS, minority,
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">Approved</p>
                <p className="text-xs text-gray-500">Inspection Status</p>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangleIcon className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">2</p>
                <p className="text-xs text-gray-500">Pending Items</p>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ClipboardListIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">280</p>
                <p className="text-xs text-gray-500">Board Candidates</p>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileTextIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">210</p>
                <p className="text-xs text-gray-500">Marksheets Distributed</p>
              </div>
            </div>
          </div>

          <Tabs value={liveInnerTab} onValueChange={setLiveInnerTab}>
            <div className="overflow-x-auto">
              <TabsList>
                <TabsTrigger value="inspection">Annual Inspection</TabsTrigger>
                <TabsTrigger value="exam-compliance">
                  Exam Compliance
                </TabsTrigger>
                <TabsTrigger value="marksheet">
                  Certificate & Marksheet
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

            <TabsContent value="inspection" className="mt-4">
              <Card
                title="Annual Inspection Report — GSEB"
                headerAction={
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<DownloadIcon className="w-4 h-4" />}>

                    Download Report
                  </Button>
                }>

                <Table
                  columns={[
                  {
                    key: 'item',
                    header: 'Inspection Item'
                  },
                  {
                    key: 'status',
                    header: 'Status',
                    render: (row) =>
                    <Badge
                      variant={
                      row.status === 'Complete' ||
                      row.status === 'Approved' ?
                      'success' :
                      row.status === 'Partial' ?
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
                  data={inspectionData} />

              </Card>
            </TabsContent>

            <TabsContent value="exam-compliance" className="mt-4">
              <Card title="Board Examination Compliance Report">
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
                      row.status === 'Compliant' || row.status === 'Ready' ?
                      'success' :
                      row.status === 'Expiring Soon' ?
                      'warning' :
                      'default'
                      }>

                          {row.status}
                        </Badge>

                  },
                  {
                    key: 'details',
                    header: 'Details'
                  }]
                  }
                  data={examCenterData} />

              </Card>
            </TabsContent>

            <TabsContent value="marksheet" className="mt-4">
              <Card
                title="Certificate & Marksheet Distribution Record"
                headerAction={
                <div className="flex gap-2">
                    <Badge variant="info">210 Distributed</Badge>
                    <Badge variant="warning">70 Pending</Badge>
                  </div>
                }>

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
                    key: 'marksheet',
                    header: 'Marksheet',
                    render: (row) =>
                    <Badge
                      variant={
                      row.marksheet === 'Distributed' ?
                      'success' :
                      'warning'
                      }>

                          {row.marksheet}
                        </Badge>

                  },
                  {
                    key: 'acknowledgement',
                    header: 'Acknowledgement',
                    render: (row) =>
                    <Badge
                      variant={
                      row.acknowledgement === 'Received' ?
                      'success' :
                      'default'
                      }>

                          {row.acknowledgement}
                        </Badge>

                  }]
                  }
                  data={marksheetData} />

              </Card>
            </TabsContent>

            <TabsContent value="rte-ews" className="mt-4 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-700">42</p>
                  <p className="text-xs text-green-600 mt-1">
                    RTE Seats Filled
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-700">44</p>
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
                  <p className="text-2xl font-bold text-purple-700">62</p>
                  <p className="text-xs text-purple-600 mt-1">EWS Admissions</p>
                </div>
              </div>
              <Card
                title="RTE Seats — Standard-wise Allocation vs Filled"
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
                    header: 'Standard'
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
                title="Religion-wise Student Distribution (Gujarat)"
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
                  <p className="text-2xl font-bold text-blue-700">656</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Male Students (52.6%)
                  </p>
                </div>
                <div className="bg-pink-50 border border-pink-100 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-pink-700">592</p>
                  <p className="text-xs text-pink-600 mt-1">
                    Female Students (47.4%)
                  </p>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-700">53:47</p>
                  <p className="text-xs text-green-600 mt-1">M:F Ratio</p>
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-purple-700">+3.1%</p>
                  <p className="text-xs text-purple-600 mt-1">
                    Girl Enrollment Growth
                  </p>
                </div>
              </div>
              <Card
                title="Gender Distribution by Standard"
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
                    header: 'Standard'
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
                  <p className="text-2xl font-bold text-green-700">40</p>
                  <p className="text-xs text-green-600 mt-1">Divisions</p>
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-purple-700">31.2</p>
                  <p className="text-xs text-purple-600 mt-1">
                    Avg Division Size
                  </p>
                </div>
                <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-orange-700">88%</p>
                  <p className="text-xs text-orange-600 mt-1">
                    Avg Capacity Utilization
                  </p>
                </div>
              </div>
              <Card
                title="Standard-wise Strength Report"
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
                    header: 'Standard'
                  },
                  {
                    key: 'sections',
                    header: 'Divisions'
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
                title="Standard-wise Attendance Summary"
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
                    header: 'Standard'
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
                title="Board Exam Performance Summary (SSC & HSC)"
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
                  <p className="text-3xl font-bold text-green-700">97.1%</p>
                  <p className="text-sm text-green-600 mt-1">Overall Pass %</p>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-blue-700">39.4%</p>
                  <p className="text-sm text-blue-600 mt-1">Distinction %</p>
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-purple-700">77.3%</p>
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
              label="Standard"
              options={[
              {
                value: '',
                label: 'All Standards'
              },
              ...Array.from(
                {
                  length: 12
                },
                (_, i) => ({
                  value: `${i + 1}`,
                  label: `Std. ${i + 1}`
                })
              )]
              }
              value={generateForm.standard}
              onChange={(v) =>
              setGenerateForm((f) => ({
                ...f,
                standard: v
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