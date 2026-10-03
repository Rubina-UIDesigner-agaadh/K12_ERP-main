import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { KpiInfoModal, KpiInfo } from '../../../components/ui/KpiInfoModal';
import {
  Users,
  CheckCircle,
  Clock,
  Target,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertTriangle,
  ChevronRight,
  Home,
  BarChart3,
  RefreshCw,
  Download,
  Settings,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Building,
  X } from
'lucide-react';
interface DeadlineItem {
  id: string;
  cycleName: string;
  phase: string;
  deadline: string;
  daysRemaining: number;
  status: 'critical' | 'warning' | 'normal';
}
const deadlines: DeadlineItem[] = [
{
  id: '1',
  cycleName: 'Annual Review 2024-25',
  phase: 'Self Appraisal',
  deadline: '2024-02-28',
  daysRemaining: 2,
  status: 'critical'
},
{
  id: '2',
  cycleName: 'Annual Review 2024-25',
  phase: 'Manager Review',
  deadline: '2024-03-05',
  daysRemaining: 7,
  status: 'warning'
},
{
  id: '3',
  cycleName: 'Mid-Term Review Q2',
  phase: 'Calibration',
  deadline: '2024-03-15',
  daysRemaining: 17,
  status: 'normal'
},
{
  id: '4',
  cycleName: 'Probation Review - Batch 3',
  phase: 'Final Rating',
  deadline: '2024-03-10',
  daysRemaining: 12,
  status: 'normal'
},
{
  id: '5',
  cycleName: 'Annual Review 2024-25',
  phase: 'Publication',
  deadline: '2024-03-20',
  daysRemaining: 22,
  status: 'normal'
}];

const ratingDistribution = [
{
  label: 'Outstanding',
  count: 12,
  percentage: 5,
  color: 'bg-emerald-500'
},
{
  label: 'Excellent',
  count: 49,
  percentage: 20,
  color: 'bg-green-500'
},
{
  label: 'Good',
  count: 110,
  percentage: 45,
  color: 'bg-blue-500'
},
{
  label: 'Average',
  count: 61,
  percentage: 25,
  color: 'bg-amber-500'
},
{
  label: 'Below Average',
  count: 13,
  percentage: 5,
  color: 'bg-red-500'
}];

const departmentCompletion = [
{
  name: 'Science Department',
  completion: 92,
  total: 45,
  completed: 41
},
{
  name: 'English Department',
  completion: 85,
  total: 32,
  completed: 27
},
{
  name: 'Mathematics',
  completion: 78,
  total: 28,
  completed: 22
},
{
  name: 'Admin Staff',
  completion: 65,
  total: 40,
  completed: 26
},
{
  name: 'Support Staff',
  completion: 45,
  total: 55,
  completed: 25
}];

const KPI_INFO: KpiInfo[] = [
{
  title: 'Total Staff Eligible',
  description:
  'The total number of employees who are eligible to participate in the current appraisal cycle, based on their employment type, tenure, and department inclusion criteria.',
  whyItMatters:
  'Knowing the eligible headcount helps HR plan the appraisal process, assign reviewers, and set realistic completion targets. It also ensures no eligible employee is inadvertently excluded.',
  actionRequired:
  'Verify the eligibility list with department heads. Ensure new joiners who have completed their probation are included and recently separated employees are excluded.'
},
{
  title: 'Self-Appraisals Submitted',
  description:
  'The count of employees who have completed and submitted their self-appraisal forms in the current appraisal cycle.',
  whyItMatters:
  'Self-appraisal submission rate is a leading indicator of overall process completion. Low submission rates can delay manager reviews and the entire appraisal timeline.',
  actionRequired:
  'Send reminders to employees who have not yet submitted. Escalate to department heads for employees approaching the deadline. Check if any employees are facing system access issues.'
},
{
  title: 'Pending Review',
  description:
  'The number of employees whose appraisal is still pending — either self-appraisal not submitted, manager review not completed, or final rating not assigned.',
  whyItMatters:
  'Pending reviews indicate process bottlenecks. High pending counts close to the deadline can jeopardize timely completion and delay salary revision decisions.',
  actionRequired:
  'Identify the specific stage at which each pending appraisal is stuck. Send targeted reminders to employees and managers. Escalate critical cases to HR leadership.'
},
{
  title: 'Process Completion',
  description:
  'The overall percentage of the appraisal process that has been completed, calculated as the ratio of fully completed appraisals to total eligible employees.',
  whyItMatters:
  'Process completion percentage gives a holistic view of where the organization stands in the appraisal cycle. It helps predict if the cycle will close on time.',
  actionRequired:
  'If completion is below target for the current date, identify lagging departments and initiate corrective actions. Prepare a status report for management review.'
}];

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

export function AppraisalDashboard() {
  const [activeKpiInfo, setActiveKpiInfo] = useState<KpiInfo | null>(null);
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['all']);
  const [academicYear, setAcademicYear] = useState('2024-25');
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
  const getDeadlineColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'text-red-600 bg-red-50';
      case 'warning':
        return 'text-amber-600 bg-amber-50';
      default:
        return 'text-green-600 bg-green-50';
    }
  };
  const getDeadlineBadge = (status: string, days: number) => {
    if (status === 'critical')
    return <Badge variant="danger">{days} days left</Badge>;else
    if (status === 'warning')
    return <Badge variant="warning">{days} days left</Badge>;
    return <Badge variant="success">{days} days left</Badge>;
  };
  return (
    <div className="space-y-6 p-6">
      <KpiInfoModal
        info={activeKpiInfo}
        onClose={() => setActiveKpiInfo(null)} />


      <nav className="flex items-center text-sm text-gray-500">
        <Home className="w-4 h-4" />
        <ChevronRight className="w-4 h-4 mx-2" />
        <span>HR</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span>Appraisal</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900 font-medium">Dashboard</span>
      </nav>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Appraisal Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Executive overview of staff performance appraisal process
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            label=""
            options={[
            {
              value: '2024-25',
              label: 'Academic Year 2024-25'
            },
            {
              value: '2023-24',
              label: 'Academic Year 2023-24'
            }]
            }
            value={academicYear}
            onChange={setAcademicYear} />

          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="primary">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Branch Selector */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Building className="w-5 h-5 text-gray-500 flex-shrink-0" />
          <span className="text-sm font-medium text-gray-700 flex-shrink-0">
            School Branch:
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
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 relative group">
          <button
            onClick={() => setActiveKpiInfo(KPI_INFO[0])}
            className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full text-gray-300 hover:text-blue-600 hover:bg-blue-50 transition-colors opacity-0 group-hover:opacity-100">

            <Info className="w-4 h-4" />
          </button>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Staff Eligible
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">245</p>
              <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                <ArrowUpRight className="w-4 h-4" />
                <span>+12 from last cycle</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 relative group">
          <button
            onClick={() => setActiveKpiInfo(KPI_INFO[1])}
            className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full text-gray-300 hover:text-blue-600 hover:bg-blue-50 transition-colors opacity-0 group-hover:opacity-100">

            <Info className="w-4 h-4" />
          </button>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Self-Appraisals Submitted
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">189</p>
              <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                <ArrowUpRight className="w-4 h-4" />
                <span>77% completion</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 relative group">
          <button
            onClick={() => setActiveKpiInfo(KPI_INFO[2])}
            className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full text-gray-300 hover:text-blue-600 hover:bg-blue-50 transition-colors opacity-0 group-hover:opacity-100">

            <Info className="w-4 h-4" />
          </button>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Pending Review
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">56</p>
              <div className="flex items-center gap-1 mt-2 text-sm text-amber-600">
                <Clock className="w-4 h-4" />
                <span>23% remaining</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 relative group">
          <button
            onClick={() => setActiveKpiInfo(KPI_INFO[3])}
            className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full text-gray-300 hover:text-blue-600 hover:bg-blue-50 transition-colors opacity-0 group-hover:opacity-100">

            <Info className="w-4 h-4" />
          </button>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Process Completion
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">77%</p>
              <div className="flex items-center gap-1 mt-2 text-sm text-purple-600">
                <TrendingUp className="w-4 h-4" />
                <span>On track</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gray-400" />
              Rating Distribution (Bell Curve)
            </h3>
            <Badge variant="secondary">245 Employees</Badge>
          </div>
          <div className="space-y-4">
            {ratingDistribution.map((item, idx) =>
            <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">
                    {item.label}
                  </span>
                  <span className="text-gray-500">
                    {item.count} ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                  <div
                  className={`h-full ${item.color} rounded-lg transition-all duration-500 flex items-center justify-end pr-2`}
                  style={{
                    width: `${item.percentage * 2}%`
                  }}>

                    {item.percentage >= 15 &&
                  <span className="text-xs font-bold text-white">
                        {item.count}
                      </span>
                  }
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Target Distribution</span>
              <span className="text-gray-500">5% - 20% - 50% - 20% - 5%</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gray-400" />
              Department-wise Completion
            </h3>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {departmentCompletion.map((dept, idx) =>
            <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{dept.name}</span>
                  <span className="text-gray-500">
                    {dept.completed}/{dept.total} ({dept.completion}%)
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                  className={`h-full rounded-full transition-all duration-500 ${dept.completion >= 80 ? 'bg-green-500' : dept.completion >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{
                    width: `${dept.completion}%`
                  }} />

                </div>
              </div>
            )}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-600">≥80%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-gray-600">60-79%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-gray-600">&lt;60%</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-400" />
            Approaching Deadlines
          </h3>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            View Calendar
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Cycle Name
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Phase
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Deadline
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                  Days Remaining
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {deadlines.map((item) =>
              <tr
                key={item.id}
                className={`border-b border-gray-100 ${item.status === 'critical' ? 'bg-red-50/50' : ''}`}>

                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-gray-900">
                      {item.cycleName}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600">{item.phase}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600">
                      {item.deadline}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${getDeadlineColor(item.status)}`}>

                      {item.daysRemaining}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {getDeadlineBadge(item.status, item.daysRemaining)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span>Critical: &lt;3 days</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Warning: &lt;7 days</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Normal: &gt;7 days</span>
          </div>
        </div>
      </Card>
    </div>);

}