import React, { useMemo, useState } from 'react';
import {
  Users,
  Briefcase,
  Calendar,
  TrendingUp,
  TrendingDown,
  UserCheck,
  Clock,
  Building,
  X,
  RefreshCw,
  Download,
  Filter,
  Bell,
  ChevronRight,
  Target,
  Award,
  UserPlus,
  FileText,
  CheckCircle,
  AlertCircle,
  BarChart3,
  ArrowRight,
  Star,
  MapPin,
  Video,
  MessageSquare,
  Info } from
'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { KpiInfoModal, KpiInfo } from '../../../components/ui/KpiInfoModal';
const BRANCHES = [
{
  id: 'all',
  name: 'All Branches'
},
{
  id: 'main',
  name: 'Main Campus'
},
{
  id: 'north',
  name: 'North Wing'
},
{
  id: 'south',
  name: 'South Wing'
},
{
  id: 'east',
  name: 'East Campus'
}];

const ACADEMIC_YEARS = [
{
  value: '2024-2025',
  label: '2024-2025'
},
{
  value: '2023-2024',
  label: '2023-2024'
},
{
  value: '2022-2023',
  label: '2022-2023'
}];

const departmentHiringData = [
{
  dept: 'Mathematics',
  sanctioned: 8,
  filled: 6,
  vacant: 2,
  ongoing: 2,
  branch: 'main'
},
{
  dept: 'Science',
  sanctioned: 10,
  filled: 8,
  vacant: 2,
  ongoing: 1,
  branch: 'main'
},
{
  dept: 'English',
  sanctioned: 6,
  filled: 5,
  vacant: 1,
  ongoing: 1,
  branch: 'north'
},
{
  dept: 'Social Studies',
  sanctioned: 5,
  filled: 4,
  vacant: 1,
  ongoing: 0,
  branch: 'north'
},
{
  dept: 'Administration',
  sanctioned: 4,
  filled: 3,
  vacant: 1,
  ongoing: 1,
  branch: 'south'
},
{
  dept: 'Physical Education',
  sanctioned: 3,
  filled: 2,
  vacant: 1,
  ongoing: 1,
  branch: 'south'
},
{
  dept: 'Arts & Craft',
  sanctioned: 4,
  filled: 3,
  vacant: 1,
  ongoing: 0,
  branch: 'east'
},
{
  dept: 'Computer Science',
  sanctioned: 5,
  filled: 3,
  vacant: 2,
  ongoing: 2,
  branch: 'east'
}];

const upcomingInterviews = [
{
  id: 1,
  candidate: 'Priya Sharma',
  position: 'Math Teacher',
  type: 'Demo Class',
  date: 'Today',
  time: '10:00 AM',
  interviewer: 'Dr. Amit Shah',
  branch: 'main',
  avatar: 'PS'
},
{
  id: 2,
  candidate: 'Rahul Verma',
  position: 'Science HOD',
  type: 'Panel Interview',
  date: 'Today',
  time: '2:00 PM',
  interviewer: 'Principal + HR',
  branch: 'north',
  avatar: 'RV'
},
{
  id: 3,
  candidate: 'Anita Desai',
  position: 'Admin Officer',
  type: 'HR Interview',
  date: 'Tomorrow',
  time: '11:00 AM',
  interviewer: 'Mrs. Kavita',
  branch: 'south',
  avatar: 'AD'
},
{
  id: 4,
  candidate: 'Suresh Kumar',
  position: 'PE Teacher',
  type: 'Demo Class',
  date: 'Dec 20',
  time: '9:00 AM',
  interviewer: 'Mr. Rajan',
  branch: 'east',
  avatar: 'SK'
},
{
  id: 5,
  candidate: 'Meera Patel',
  position: 'CS Teacher',
  type: 'Written Test',
  date: 'Dec 21',
  time: '10:30 AM',
  interviewer: 'Mr. Vikram',
  branch: 'main',
  avatar: 'MP'
}];

const recentActivities = [
{
  id: 1,
  type: 'job_posted',
  text: 'New job posted for Senior Math Teacher',
  time: '1 hour ago',
  icon: FileText,
  color: 'text-blue-600',
  bg: 'bg-blue-50',
  branch: 'main'
},
{
  id: 2,
  type: 'interview_scheduled',
  text: 'Interview scheduled for Priya Sharma',
  time: '3 hours ago',
  icon: Calendar,
  color: 'text-purple-600',
  bg: 'bg-purple-50',
  branch: 'main'
},
{
  id: 3,
  type: 'offer_released',
  text: 'Offer letter sent to Rahul Verma',
  time: '5 hours ago',
  icon: Award,
  color: 'text-green-600',
  bg: 'bg-green-50',
  branch: 'north'
},
{
  id: 4,
  type: 'candidate_joined',
  text: 'Anita Desai joined as Admin Officer',
  time: '1 day ago',
  icon: UserCheck,
  color: 'text-blue-600',
  bg: 'bg-blue-50',
  branch: 'south'
},
{
  id: 5,
  type: 'shortlisted',
  text: '5 candidates shortlisted for CS Teacher',
  time: '2 days ago',
  icon: Star,
  color: 'text-orange-600',
  bg: 'bg-orange-50',
  branch: 'east'
}];

const pipelineData = [
{
  stage: 'Applied',
  count: 248,
  color: 'bg-blue-500',
  width: '100%'
},
{
  stage: 'Screened',
  count: 186,
  color: 'bg-indigo-500',
  width: '75%'
},
{
  stage: 'Shortlisted',
  count: 124,
  color: 'bg-violet-500',
  width: '50%'
},
{
  stage: 'Interviewed',
  count: 78,
  color: 'bg-purple-500',
  width: '31%'
},
{
  stage: 'Selected',
  count: 42,
  color: 'bg-pink-500',
  width: '17%'
},
{
  stage: 'Offered',
  count: 28,
  color: 'bg-rose-500',
  width: '11%'
},
{
  stage: 'Joined',
  count: 19,
  color: 'bg-red-500',
  width: '8%'
}];

const KPI_INFO_MAP: Record<string, KpiInfo> = {
  'Open Positions': {
    title: 'Open Positions',
    description:
    'The total number of sanctioned positions that are currently vacant and actively being recruited for across all departments and branches.',
    whyItMatters:
    "Open positions directly impact the school's ability to deliver quality education. A high number of vacancies can strain existing staff and affect student outcomes.",
    actionRequired:
    'Prioritize filling critical teaching positions first. Ensure job postings are active on all channels and follow up with hiring managers on pending approvals.'
  },
  Applications: {
    title: 'Applications Received',
    description:
    'Total number of job applications received across all open positions for the selected academic year and branch filter.',
    whyItMatters:
    'Application volume indicates the effectiveness of your recruitment outreach. Low application counts may signal issues with job visibility or employer branding.',
    actionRequired:
    'Review application sources to identify the most effective channels. If volumes are low, consider boosting job postings or expanding to additional platforms.'
  },
  Shortlisted: {
    title: 'Shortlisted Candidates',
    description:
    'The number of candidates who have passed the initial screening stage and have been shortlisted for further evaluation or interviews.',
    whyItMatters:
    'Shortlisting rate reflects the quality of incoming applications. A very low shortlist rate may indicate a mismatch between job requirements and applicant profiles.',
    actionRequired:
    'Ensure shortlisting criteria are clearly defined and consistently applied. Schedule interviews promptly to avoid losing shortlisted candidates to other opportunities.'
  },
  'Interviews Today': {
    title: 'Interviews Scheduled Today',
    description:
    'The count of candidate interviews (including demo classes, panel interviews, and HR rounds) scheduled for today across all branches.',
    whyItMatters:
    'Tracking daily interviews ensures the recruitment process is progressing and helps coordinators manage logistics, panel availability, and candidate communication.',
    actionRequired:
    'Confirm all interview panels have been notified. Ensure interview rooms/video links are set up. Send reminder communications to candidates.'
  },
  'Offers Released': {
    title: 'Offers Released',
    description:
    'The total number of formal offer letters issued to selected candidates in the current recruitment cycle.',
    whyItMatters:
    'Offer release rate indicates how effectively the selection process is converting shortlisted candidates to hires. Delays in offer release can cause candidate drop-offs.',
    actionRequired:
    'Follow up on pending offer acceptances. Track offer-to-joining conversion rate. Escalate any offers pending management approval.'
  },
  'Positions Filled': {
    title: 'Positions Filled',
    description:
    'The number of previously vacant positions that have been successfully filled with candidates who have joined and are active on payroll.',
    whyItMatters:
    'This is the ultimate measure of recruitment success. It directly reduces the vacancy burden and helps the school return to full operational capacity.',
    actionRequired:
    'Ensure all joined candidates are onboarded in the HR system. Update department heads on filled positions. Close the corresponding job requisitions.'
  },
  'Avg. Time to Hire': {
    title: 'Average Time to Hire',
    description:
    'The average number of days taken from the date a position is opened (requisition raised) to the date the selected candidate joins the organization.',
    whyItMatters:
    'A shorter time-to-hire reduces the impact of vacancies on operations and lowers the risk of losing top candidates to competitors. It also reflects process efficiency.',
    actionRequired:
    'Identify bottlenecks in the hiring pipeline (e.g., slow approvals, delayed interviews). Set stage-wise SLAs and monitor adherence to reduce overall cycle time.'
  }
};
export function RecruitmentDashboard() {
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['all']);
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [activeKpiInfo, setActiveKpiInfo] = useState<KpiInfo | null>(null);
  const handleBranchToggle = (branchId: string) => {
    if (branchId === 'all') {
      setSelectedBranches(['all']);
    } else {
      const without = selectedBranches.filter(
        (b) => b !== 'all' && b !== branchId
      );
      const adding = !selectedBranches.includes(branchId);
      const next = adding ? [...without, branchId] : without;
      setSelectedBranches(next.length === 0 ? ['all'] : next);
    }
  };
  const activeBranches = selectedBranches.includes('all') ?
  ['main', 'north', 'south', 'east'] :
  selectedBranches;
  const filteredDepts = useMemo(
    () => departmentHiringData.filter((d) => activeBranches.includes(d.branch)),
    [activeBranches]
  );
  const filteredInterviews = useMemo(
    () => upcomingInterviews.filter((i) => activeBranches.includes(i.branch)),
    [activeBranches]
  );
  const filteredActivities = useMemo(
    () => recentActivities.filter((a) => activeBranches.includes(a.branch)),
    [activeBranches]
  );
  const totalVacant = filteredDepts.reduce((s, d) => s + d.vacant, 0);
  const totalOngoing = filteredDepts.reduce((s, d) => s + d.ongoing, 0);
  const getBranchName = (id: string) =>
  BRANCHES.find((b) => b.id === id)?.name || id;
  const getInterviewTypeBadge = (type: string) => {
    if (type === 'Demo Class') return 'bg-orange-100 text-orange-700';
    if (type === 'Panel Interview') return 'bg-purple-100 text-purple-700';
    if (type === 'HR Interview') return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-700';
  };
  const kpis = [
  {
    label: 'Open Positions',
    value: totalVacant,
    icon: Target,
    color: 'blue',
    trend: '+2'
  },
  {
    label: 'Applications',
    value: 248,
    icon: FileText,
    color: 'indigo',
    trend: '+18'
  },
  {
    label: 'Shortlisted',
    value: 124,
    icon: Star,
    color: 'violet',
    trend: '+5'
  },
  {
    label: 'Interviews Today',
    value: filteredInterviews.filter((i) => i.date === 'Today').length,
    icon: Calendar,
    color: 'purple',
    trend: null
  },
  {
    label: 'Offers Released',
    value: 28,
    icon: Award,
    color: 'pink',
    trend: '+3'
  },
  {
    label: 'Positions Filled',
    value: 19,
    icon: UserCheck,
    color: 'green',
    trend: '+2'
  },
  {
    label: 'Avg. Time to Hire',
    value: '18d',
    icon: Clock,
    color: 'orange',
    trend: '-2d'
  }];

  return (
    <div className="space-y-6 pb-8">
      <KpiInfoModal
        info={activeKpiInfo}
        onClose={() => setActiveKpiInfo(null)} />


      {/* Header */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Recruitment Dashboard
              </h1>
              <p className="text-sm text-gray-500">
                Real-time hiring overview across all departments
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select
              label=""
              options={ACADEMIC_YEARS}
              value={academicYear}
              onChange={setAcademicYear}
              className="w-36" />

            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
            <Button variant="primary" size="sm">
              <BarChart3 className="w-4 h-4 mr-1" />
              Full Report
            </Button>
          </div>
        </div>

        {/* Branch Selector */}
        <div className="mt-5 pt-5 border-t flex flex-wrap items-center gap-3">
          <Building className="w-5 h-5 text-gray-500 flex-shrink-0" />
          <span className="text-sm font-medium text-gray-700 flex-shrink-0">
            Branches:
          </span>
          {BRANCHES.map((branch) =>
          <button
            key={branch.id}
            onClick={() => handleBranchToggle(branch.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${selectedBranches.includes(branch.id) || branch.id !== 'all' && selectedBranches.includes('all') ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>

              {branch.name}
              {selectedBranches.includes(branch.id) && branch.id !== 'all' &&
            <X
              className="w-3 h-3"
              onClick={(e) => {
                e.stopPropagation();
                handleBranchToggle(branch.id);
              }} />

            }
            </button>
          )}
          <div className="ml-auto flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1.5 text-gray-500">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
              AY: {academicYear}
            </span>
            <span className="flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-orange-500" />
              <span className="text-orange-600 font-medium">3 Urgent</span>
            </span>
          </div>
        </div>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {kpis.map((kpi, i) =>
        <Card key={i} className="p-4 relative group">
            <button
            onClick={() => setActiveKpiInfo(KPI_INFO_MAP[kpi.label] || null)}
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full text-gray-300 hover:text-blue-600 hover:bg-blue-50 transition-colors opacity-0 group-hover:opacity-100"
            title="More info">

              <Info className="w-4 h-4" />
            </button>
            <div
            className={`w-10 h-10 rounded-lg bg-${kpi.color}-100 flex items-center justify-center mb-3`}>

              <kpi.icon className={`w-5 h-5 text-${kpi.color}-600`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
            {kpi.trend &&
          <p
            className={`text-xs mt-1 font-medium ${kpi.trend.startsWith('+') ? 'text-green-600' : 'text-blue-600'}`}>

                {kpi.trend} this week
              </p>
          }
          </Card>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Pipeline + Dept Table */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recruitment Pipeline Funnel */}
          <Card
            title="Recruitment Pipeline"
            headerAction={
            <span className="text-xs text-gray-500">AY {academicYear}</span>
            }>

            <div className="space-y-3 py-2">
              {pipelineData.map((stage, i) =>
              <div key={i} className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 w-24 flex-shrink-0">
                    {stage.stage}
                  </span>
                  <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                    className={`h-full ${stage.color} rounded-lg flex items-center justify-end pr-3 transition-all`}
                    style={{
                      width: stage.width
                    }}>

                      <span className="text-white text-xs font-bold">
                        {stage.count}
                      </span>
                    </div>
                  </div>
                  {i > 0 &&
                <span className="text-xs text-gray-400 w-12 text-right flex-shrink-0">
                      {Math.round(
                    stage.count / pipelineData[i - 1].count * 100
                  )}
                      %
                    </span>
                }
                </div>
              )}
            </div>
            <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm">
              <span className="text-gray-500">
                Overall conversion:{' '}
                <span className="font-semibold text-gray-900">7.7%</span>
              </span>
              <Button variant="outline" size="sm">
                View Details <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </Card>

          {/* Department-wise Hiring Status */}
          <Card
            title="Department-wise Hiring Status"
            headerAction={
            <Button variant="outline" size="xs">
                <Filter className="w-3 h-3 mr-1" />
                Filter
              </Button>
            }>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-2 text-gray-500 font-medium">
                      Department
                    </th>
                    <th className="text-center py-3 px-2 text-gray-500 font-medium">
                      Sanctioned
                    </th>
                    <th className="text-center py-3 px-2 text-gray-500 font-medium">
                      Filled
                    </th>
                    <th className="text-center py-3 px-2 text-gray-500 font-medium">
                      Vacant
                    </th>
                    <th className="text-center py-3 px-2 text-gray-500 font-medium">
                      Ongoing
                    </th>
                    <th className="text-center py-3 px-2 text-gray-500 font-medium">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDepts.map((dept, i) =>
                  <tr
                    key={i}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors">

                      <td className="py-3 px-2">
                        <div>
                          <p className="font-medium text-gray-900">
                            {dept.dept}
                          </p>
                          <p className="text-xs text-gray-400">
                            {getBranchName(dept.branch)}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center font-medium text-gray-900">
                        {dept.sanctioned}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className="font-medium text-green-700">
                          {dept.filled}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span
                        className={`font-medium ${dept.vacant > 0 ? 'text-red-600' : 'text-gray-400'}`}>

                          {dept.vacant}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center">
                        {dept.ongoing > 0 ?
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            {dept.ongoing} active
                          </span> :

                      <span className="text-gray-400">—</span>
                      }
                      </td>
                      <td className="py-3 px-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                            className="h-full bg-green-500 rounded-full"
                            style={{
                              width: `${dept.filled / dept.sanctioned * 100}%`
                            }}>
                          </div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {Math.round(dept.filled / dept.sanctioned * 100)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50">
                    <td className="py-3 px-2 font-semibold text-gray-900">
                      Total
                    </td>
                    <td className="py-3 px-2 text-center font-semibold">
                      {filteredDepts.reduce((s, d) => s + d.sanctioned, 0)}
                    </td>
                    <td className="py-3 px-2 text-center font-semibold text-green-700">
                      {filteredDepts.reduce((s, d) => s + d.filled, 0)}
                    </td>
                    <td className="py-3 px-2 text-center font-semibold text-red-600">
                      {totalVacant}
                    </td>
                    <td className="py-3 px-2 text-center font-semibold text-blue-700">
                      {totalOngoing}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className="text-xs font-semibold text-gray-700">
                        {Math.round(
                          filteredDepts.reduce((s, d) => s + d.filled, 0) /
                          filteredDepts.reduce(
                            (s, d) => s + d.sanctioned,
                            0
                          ) *
                          100
                        )}
                        % filled
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Upcoming Interviews */}
          <Card
            title="Upcoming Interviews"
            headerAction={
            <Button variant="outline" size="xs">
                View All
              </Button>
            }>

            <div className="space-y-3">
              {filteredInterviews.slice(0, 5).map((interview) =>
              <div
                key={interview.id}
                className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {interview.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {interview.candidate}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {interview.position}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${getInterviewTypeBadge(interview.type)}`}>

                          {interview.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {interview.date} · {interview.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {getBranchName(interview.branch)}
                    </span>
                    <span className="text-xs text-blue-600">
                      {interview.interviewer}
                    </span>
                  </div>
                </div>
              )}
              {filteredInterviews.length === 0 &&
              <p className="text-sm text-gray-400 text-center py-4">
                  No interviews scheduled
                </p>
              }
            </div>
          </Card>

          {/* Recent Activity */}
          <Card
            title="Recent Activity"
            headerAction={
            <button className="text-xs text-blue-600 font-medium">
                View All
              </button>
            }>

            <div className="space-y-3">
              {filteredActivities.slice(0, 5).map((activity) =>
              <div key={activity.id} className="flex gap-3">
                  <div
                  className={`p-2 ${activity.bg} rounded-lg h-fit flex-shrink-0`}>

                    <activity.icon className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700">{activity.text}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      <span>{activity.time}</span>
                      <span>·</span>
                      <span className="text-blue-500">
                        {getBranchName(activity.branch)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card title="Quick Actions">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-auto py-3 flex flex-col items-center gap-1.5">

                <FileText className="w-5 h-5 text-blue-600" />
                <span className="text-xs">Post Job</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-auto py-3 flex flex-col items-center gap-1.5">

                <UserPlus className="w-5 h-5 text-green-600" />
                <span className="text-xs">Add Applicant</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-auto py-3 flex flex-col items-center gap-1.5">

                <Calendar className="w-5 h-5 text-purple-600" />
                <span className="text-xs">Schedule Interview</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-auto py-3 flex flex-col items-center gap-1.5">

                <Award className="w-5 h-5 text-orange-600" />
                <span className="text-xs">Issue Offer</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>);

}