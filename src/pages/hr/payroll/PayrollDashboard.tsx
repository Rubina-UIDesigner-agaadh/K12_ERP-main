import React, { useState } from 'react';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  DownloadIcon,
  PlayIcon,
  AlertTriangleIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  TrendingUpIcon,
  FilterIcon,
  InfoIcon,
  Building,
  X } from
'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell } from
'recharts';
import { Button } from '../../../components/ui/Button';
import { KpiInfoModal, KpiInfo } from '../../../components/ui/KpiInfoModal';
const KPI_DATA = [
{
  id: 'gross',
  label: 'Total Gross Payroll',
  value: '₹42,80,000',
  trend: '+3.2%',
  trendDir: 'up',
  subtext: 'vs last month',
  info: {
    title: 'Total Gross Payroll',
    description:
    'The total gross payroll represents the sum of all employee salaries before any deductions such as PF, ESI, TDS, or other statutory/voluntary deductions for the current payroll period.',
    whyItMatters:
    'Tracking gross payroll helps management understand the total compensation liability and compare it against budget allocations. It is the baseline for all payroll calculations.',
    actionRequired:
    'Review if the gross payroll is within the approved budget. Investigate any significant month-on-month variance and ensure all new joiners and increments are correctly reflected.'
  }
},
{
  id: 'net',
  label: 'Net Disbursed',
  value: '₹36,54,200',
  trend: '+2.8%',
  trendDir: 'up',
  subtext: 'vs last month',
  info: {
    title: 'Net Disbursed',
    description:
    'Net disbursed is the actual amount transferred to employee bank accounts after all statutory and voluntary deductions are applied to the gross salary.',
    whyItMatters:
    'This figure directly impacts employee satisfaction and cash flow planning. It must match the bank transfer file to ensure accurate disbursement.',
    actionRequired:
    'Verify the bank advice file has been generated and uploaded. Confirm all bank account details are up to date to avoid failed transactions.'
  }
},
{
  id: 'deductions',
  label: 'Total Deductions',
  value: '₹6,25,800',
  trend: '-1.1%',
  trendDir: 'down',
  subtext: 'vs last month',
  info: {
    title: 'Total Deductions',
    description:
    'Total deductions include all statutory deductions (PF, ESI, TDS, PT) and voluntary deductions (loans, advances, insurance premiums) across all employees for the period.',
    whyItMatters:
    'Accurate deduction tracking ensures compliance with statutory obligations and prevents under/over-deduction issues that can lead to penalties or employee disputes.',
    actionRequired:
    'Ensure all statutory challans (PF, ESI, TDS) are filed on time. Review any unusual deduction variances and verify loan/advance recovery schedules.'
  }
},
{
  id: 'employees',
  label: 'Employees on Payroll',
  value: '248',
  trend: '+4',
  trendDir: 'up',
  subtext: 'new joins',
  info: {
    title: 'Employees on Payroll',
    description:
    'The total count of active employees included in the current payroll run, including all departments and employment types (full-time, part-time, contractual).',
    whyItMatters:
    'Headcount accuracy is critical for payroll correctness. Any discrepancy between HR records and payroll headcount indicates data sync issues.',
    actionRequired:
    'Cross-verify with HR employee list to ensure all new joiners are added and separated employees are removed. Reconcile any headcount mismatches before finalizing payroll.'
  }
},
{
  id: 'avg',
  label: 'Avg. Gross Salary',
  value: '₹17,258',
  trend: '+0.8%',
  trendDir: 'up',
  subtext: 'vs last month',
  info: {
    title: 'Average Gross Salary',
    description:
    'The average gross salary is calculated by dividing the total gross payroll by the number of employees on payroll. It provides a benchmark for compensation levels across the organization.',
    whyItMatters:
    'Monitoring average salary trends helps identify the impact of increments, promotions, and new hires on overall compensation costs. It is useful for benchmarking against industry standards.',
    actionRequired:
    'Review if the average aligns with the approved salary bands. Investigate significant increases that may indicate unauthorized increments or data entry errors.'
  }
},
{
  id: 'ytd',
  label: 'YTD Payroll Cost',
  value: '₹2.14 Cr',
  trend: 'On Track',
  trendDir: 'neutral',
  subtext: 'Budget: ₹2.5 Cr',
  info: {
    title: 'YTD Payroll Cost',
    description:
    'Year-to-Date payroll cost is the cumulative total of all payroll expenses from the start of the financial year to the current month, compared against the annual payroll budget.',
    whyItMatters:
    'YTD tracking enables proactive budget management. It helps forecast if the organization will stay within budget for the remaining months of the financial year.',
    actionRequired:
    'If YTD cost is trending above budget, initiate a review of headcount and compensation. Prepare a variance report for management if the deviation exceeds 5% of the budget.'
  }
}];

const MONTHLY_TREND_DATA = [
{
  name: 'Jun',
  gross: 3800000,
  net: 3200000
},
{
  name: 'Jul',
  gross: 3850000,
  net: 3250000
},
{
  name: 'Aug',
  gross: 3900000,
  net: 3300000
},
{
  name: 'Sep',
  gross: 3880000,
  net: 3280000
},
{
  name: 'Oct',
  gross: 4000000,
  net: 3400000
},
{
  name: 'Nov',
  gross: 4050000,
  net: 3450000
},
{
  name: 'Dec',
  gross: 4100000,
  net: 3500000
},
{
  name: 'Jan',
  gross: 4150000,
  net: 3550000
},
{
  name: 'Feb',
  gross: 4120000,
  net: 3520000
},
{
  name: 'Mar',
  gross: 4200000,
  net: 3600000
},
{
  name: 'Apr',
  gross: 4250000,
  net: 3620000
},
{
  name: 'May',
  gross: 4280000,
  net: 3654200
}];

const DEPT_COST_DATA = [
{
  name: 'Teaching',
  cost: 1850000
},
{
  name: 'Admin',
  cost: 850000
},
{
  name: 'Support',
  cost: 620000
},
{
  name: 'Finance',
  cost: 450000
},
{
  name: 'IT',
  cost: 380000
},
{
  name: 'Ops',
  cost: 280000
}];

const DEPT_TABLE_DATA = [
{
  dept: 'Teaching Staff',
  emp: 142,
  gross: '₹24,50,000',
  ded: '₹3,20,000',
  net: '₹21,30,000',
  status: 'Processed'
},
{
  dept: 'Administration',
  emp: 45,
  gross: '₹8,50,000',
  ded: '₹1,10,000',
  net: '₹7,40,000',
  status: 'Processed'
},
{
  dept: 'Support Staff',
  emp: 38,
  gross: '₹6,20,000',
  ded: '₹85,000',
  net: '₹5,35,000',
  status: 'Pending'
},
{
  dept: 'Finance & Accounts',
  emp: 12,
  gross: '₹4,50,000',
  ded: '₹60,000',
  net: '₹3,90,000',
  status: 'Processed'
},
{
  dept: 'IT Department',
  emp: 8,
  gross: '₹3,80,000',
  ded: '₹45,000',
  net: '₹3,35,000',
  status: 'On Hold'
},
{
  dept: 'Operations',
  emp: 3,
  gross: '₹2,80,000',
  ded: '₹35,000',
  net: '₹2,45,000',
  status: 'Processed'
}];

const ALERTS_DATA = [
{
  id: 1,
  type: 'warning',
  title: 'Bank File Pending',
  desc: 'Upload salary bank advice file for May 2025',
  meta: 'Due today'
},
{
  id: 2,
  type: 'critical',
  title: 'TDS Filing Due',
  desc: 'Form 24Q submission deadline in 3 days',
  meta: 'Jun 7, 2025'
},
{
  id: 3,
  type: 'warning',
  title: 'Payslip Distribution',
  desc: '12 employees have not downloaded their payslip',
  action: 'Remind All'
}];

const STATUS_DATA = [
{
  name: 'Processed',
  value: 186,
  color: '#2563eb'
},
{
  name: 'Pending',
  value: 42,
  color: '#f59e0b'
},
{
  name: 'On Hold',
  value: 20,
  color: '#ef4444'
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

const BATCH_YEARS = ['2024-2025', '2023-2024', '2022-2023'];
function StatusBadge({ status }: {status: string;}) {
  const styles: Record<string, string> = {
    Processed: 'bg-green-100 text-green-700 border border-green-200',
    Pending: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    'On Hold': 'bg-red-100 text-red-700 border border-red-200'
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-600'}`}>

      {status}
    </span>);

}
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-3">
        <p className="text-xs font-semibold text-gray-500 mb-2">{label}</p>
        {payload.map((entry: any, index: number) =>
        <div key={index} className="flex items-center gap-2 mb-1 last:mb-0">
            <div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: entry.stroke
            }} />

            <span className="text-xs text-gray-600 capitalize">
              {entry.name}:
            </span>
            <span className="text-sm font-semibold text-gray-900">
              ₹{(entry.value as number).toLocaleString()}
            </span>
          </div>
        )}
      </div>);

  }
  return null;
}
export function PayrollDashboard() {
  const [activeKpiInfo, setActiveKpiInfo] = useState<KpiInfo | null>(null);
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['all']);
  const [batchYear, setBatchYear] = useState('2024-2025');
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
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      <KpiInfoModal
        info={activeKpiInfo}
        onClose={() => setActiveKpiInfo(null)} />


      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Payroll Dashboard
          </h1>
          <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
            <CalendarIcon className="w-4 h-4" /> May 2025
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <DownloadIcon className="w-4 h-4 mr-2" />
            Export Report
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors">
            <PlayIcon className="w-4 h-4 mr-2" />
            Run Payroll
          </button>
        </div>
      </div>

      {/* Branch & Batch Year Selector */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
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
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              Batch Year:
            </span>
            <select
              value={batchYear}
              onChange={(e) => setBatchYear(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">

              {BATCH_YEARS.map((y) =>
              <option key={y} value={y}>
                  {y}
                </option>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-white rounded-xl border border-gray-200 shadow-sm p-3">
        {[
        {
          label: 'Year: 2025',
          active: true
        },
        {
          label: 'Month: May',
          active: true
        },
        {
          label: 'Department: All',
          active: false
        },
        {
          label: 'Status: All',
          active: false
        }].
        map((pill) =>
        <button
          key={pill.label}
          className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${pill.active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}`}>

            {pill.label}
          </button>
        )}
        <button className="ml-auto text-xs font-medium text-gray-500 hover:text-gray-700">
          Clear Filters
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {KPI_DATA.map((kpi) =>
        <div
          key={kpi.id}
          className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative group">

            {/* Info button */}
            <button
            onClick={() => setActiveKpiInfo(kpi.info)}
            className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full text-gray-300 hover:text-blue-600 hover:bg-blue-50 transition-colors opacity-0 group-hover:opacity-100"
            title="More info">

              <InfoIcon className="w-4 h-4" />
            </button>
            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mt-1">
              {kpi.label}
            </p>
            <div className="flex items-center gap-1 mt-3">
              {kpi.trendDir === 'up' &&
            <ArrowUpIcon className="w-3 h-3 text-green-600" />
            }
              {kpi.trendDir === 'down' &&
            <ArrowDownIcon className="w-3 h-3 text-blue-600" />
            }
              <span
              className={`text-xs font-medium ${kpi.trendDir === 'neutral' ? 'text-gray-500' : kpi.trendDir === 'up' ? 'text-green-600' : 'text-blue-600'}`}>

                {kpi.trend}
              </span>
              <span className="text-xs text-gray-400">{kpi.subtext}</span>
            </div>
          </div>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-gray-900">
              Payroll Trend
            </h3>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                Gross
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                Net
              </span>
            </div>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={MONTHLY_TREND_DATA}
                margin={{
                  top: 5,
                  right: 0,
                  left: -20,
                  bottom: 0
                }}>

                <defs>
                  <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9" />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#94a3b8',
                    fontSize: 11
                  }}
                  dy={10} />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#94a3b8',
                    fontSize: 11
                  }}
                  tickFormatter={(v) => `₹${v / 100000}L`} />

                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="gross"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorGross)" />

                <Area
                  type="monotone"
                  dataKey="net"
                  stroke="#60a5fa"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorNet)" />

              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Cost */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-gray-900">
              Cost by Department
            </h3>
            <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
              View Details
            </button>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={DEPT_COST_DATA}
                layout="vertical"
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5
                }}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  vertical={true}
                  stroke="#f1f5f9" />

                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#64748b',
                    fontSize: 12
                  }}
                  width={70} />

                <Tooltip
                  cursor={{
                    fill: '#f8fafc'
                  }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-3">
                          <p className="text-xs font-semibold text-gray-700">
                            {payload[0].payload.name}
                          </p>
                          <p className="text-sm font-bold text-blue-600">
                            ₹{(payload[0].value as number).toLocaleString()}
                          </p>
                        </div>);

                    }
                    return null;
                  }} />

                <Bar
                  dataKey="cost"
                  fill="#2563eb"
                  radius={[0, 4, 4, 0]}
                  barSize={20} />

              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Department Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Department Summary</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All Departments
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employees
                </th>
                <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gross Salary
                </th>
                <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deductions
                </th>
                <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Salary
                </th>
                <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {DEPT_TABLE_DATA.map((row, idx) =>
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-6 font-medium text-gray-900 text-sm">
                    {row.dept}
                  </td>
                  <td className="py-3 px-6 text-gray-600 text-sm text-right">
                    {row.emp}
                  </td>
                  <td className="py-3 px-6 text-gray-600 text-sm text-right">
                    {row.gross}
                  </td>
                  <td className="py-3 px-6 text-gray-600 text-sm text-right">
                    {row.ded}
                  </td>
                  <td className="py-3 px-6 font-semibold text-gray-900 text-sm text-right">
                    {row.net}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="font-semibold text-gray-900">Action Items</h3>
          {ALERTS_DATA.map((alert) =>
          <div
            key={alert.id}
            className={`bg-white border border-gray-200 rounded-xl p-4 flex items-start justify-between shadow-sm border-l-4 ${alert.type === 'critical' ? 'border-l-red-400' : 'border-l-yellow-400'}`}>

              <div>
                <h4 className="text-sm font-semibold text-gray-900">
                  {alert.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1">{alert.desc}</p>
              </div>
              <div>
                {alert.action ?
              <button className="text-xs font-medium text-blue-600 hover:text-blue-700 px-3 py-1.5 bg-blue-50 rounded-lg transition-colors border border-blue-200">
                    {alert.action}
                  </button> :

              <span
                className={`text-xs font-medium px-2 py-1 rounded-lg ${alert.type === 'critical' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'}`}>

                    {alert.meta}
                  </span>
              }
              </div>
            </div>
          )}
        </div>

        {/* Processing Status */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            Processing Status
          </h3>
          <div className="flex flex-col items-center">
            <div className="h-[160px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={STATUS_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={72}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none">

                    {STATUS_DATA.map((entry, index) =>
                    <Cell key={`cell-${index}`} fill={entry.color} />
                    )}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-gray-900">248</span>
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  Total
                </span>
              </div>
            </div>
            <div className="w-full mt-4 space-y-2">
              {STATUS_DATA.map((item) =>
              <div
                key={item.name}
                className="flex items-center justify-between text-sm">

                  <div className="flex items-center gap-2">
                    <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor: item.color
                    }} />

                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {item.value}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>);

}