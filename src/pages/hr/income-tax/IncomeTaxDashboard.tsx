import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { KpiInfoModal, KpiInfo } from '../../../components/ui/KpiInfoModal';
import {
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  FileText,
  Download,
  RefreshCw,
  PieChart,
  BarChart3,
  Calendar,
  Filter,
  Info,
  Building,
  X } from
'lucide-react';
const KPI_INFO: KpiInfo[] = [
{
  title: 'Total Taxable Employees',
  description:
  'The number of employees whose annual income exceeds the basic exemption limit and are therefore subject to income tax deduction at source (TDS) for the current financial year.',
  whyItMatters:
  'Accurate identification of taxable employees ensures TDS is deducted only from eligible employees, preventing both under-deduction (compliance risk) and over-deduction (employee dissatisfaction).',
  actionRequired:
  'Verify the list against current salary structures. Ensure employees who have crossed the exemption threshold mid-year are added. Update the list after any salary revisions.'
},
{
  title: 'Total Projected Tax',
  description:
  'The estimated total income tax liability for all taxable employees for the entire financial year, calculated based on their projected annual income, declared investments, and applicable deductions.',
  whyItMatters:
  'Projected tax helps HR and Finance plan monthly TDS deductions to ensure the full tax liability is recovered by March without creating a large deduction burden in the final months.',
  actionRequired:
  'Review projections after each investment declaration cycle. Recalculate if there are significant salary changes. Ensure the monthly TDS is being spread evenly across remaining months.'
},
{
  title: 'Total TDS Deducted YTD',
  description:
  'The cumulative amount of Tax Deducted at Source (TDS) that has been deducted from employee salaries from April to the current month of the financial year.',
  whyItMatters:
  'YTD TDS tracking ensures the organization is on track to recover the full projected tax liability by year-end. It also helps verify that challan payments match deductions.',
  actionRequired:
  'Compare YTD TDS with projected tax to identify any shortfall. Ensure all TDS challans (Form 24Q) have been filed on time. Reconcile any discrepancies immediately.'
},
{
  title: 'Pending Declarations',
  description:
  'The count of employees who have not yet submitted their income and investment declarations for the current financial year, which are required to compute their accurate TDS.',
  whyItMatters:
  'Without declarations, TDS is computed on gross income without any deductions, resulting in higher deductions for employees. Pending declarations also delay accurate tax projections.',
  actionRequired:
  'Send reminders to employees with pending declarations. Set a firm deadline and escalate to department heads. Consider defaulting to maximum TDS for employees who miss the deadline.'
},
{
  title: 'Pending Proof Verification',
  description:
  'The number of employees who have submitted investment declarations but whose supporting documents (proofs) are yet to be verified by the HR/Finance team.',
  whyItMatters:
  'Unverified proofs can lead to incorrect TDS computation. If proofs are rejected after year-end, employees may face a higher tax burden and the organization may face compliance issues.',
  actionRequired:
  'Assign proof verification tasks to the HR/Finance team with clear deadlines. Reject invalid proofs and notify employees to resubmit. Complete verification before the final TDS computation.'
},
{
  title: 'No Regime Selected',
  description:
  'The count of employees who have not chosen between the Old Tax Regime and the New Tax Regime for the current financial year.',
  whyItMatters:
  'Without a regime selection, TDS cannot be accurately computed. The default regime (new regime) may not be optimal for all employees, potentially causing financial impact.',
  actionRequired:
  'Urgently notify these employees to select their preferred tax regime. Provide a comparison tool to help them make an informed choice. Set a hard deadline and escalate to managers.'
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

export function IncomeTaxDashboard() {
  const [activeKpiInfo, setActiveKpiInfo] = useState<KpiInfo | null>(null);
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['all']);
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
  const kpiCards = [
  {
    icon: Users,
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-500',
    value: '248',
    label: 'Total Taxable Employees',
    sub: '+12 from last month',
    subColor: 'text-gray-500',
    info: KPI_INFO[0]
  },
  {
    icon: DollarSign,
    iconColor: 'text-green-600',
    borderColor: 'border-green-500',
    value: '₹45.2L',
    label: 'Total Projected Tax',
    sub: 'For FY 2024-25',
    subColor: 'text-gray-500',
    info: KPI_INFO[1]
  },
  {
    icon: TrendingUp,
    iconColor: 'text-purple-600',
    borderColor: 'border-purple-500',
    value: '₹28.7L',
    label: 'Total TDS Deducted YTD',
    sub: 'Apr-Jan 2024',
    subColor: 'text-gray-500',
    info: KPI_INFO[2]
  },
  {
    icon: FileText,
    iconColor: 'text-yellow-600',
    borderColor: 'border-yellow-500',
    value: '42',
    label: 'Pending Declarations',
    sub: 'Action required',
    subColor: 'text-red-500',
    info: KPI_INFO[3]
  },
  {
    icon: AlertTriangle,
    iconColor: 'text-orange-600',
    borderColor: 'border-orange-500',
    value: '28',
    label: 'Pending Proof Verification',
    sub: 'Needs review',
    subColor: 'text-red-500',
    info: KPI_INFO[4]
  },
  {
    icon: Users,
    iconColor: 'text-red-600',
    borderColor: 'border-red-500',
    value: '15',
    label: 'No Regime Selected',
    sub: 'Urgent action needed',
    subColor: 'text-red-500',
    info: KPI_INFO[5]
  }];

  return (
    <div className="space-y-6 p-6">
      <KpiInfoModal
        info={activeKpiInfo}
        onClose={() => setActiveKpiInfo(null)} />


      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Income Tax Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            HR &gt; Payroll &gt; Income Tax
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
            <option>FY 2024-25</option>
            <option>FY 2023-24</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
            <option>AY 2025-26</option>
            <option>AY 2024-25</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
            <option>January 2024</option>
            <option>December 2023</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
            <option>All Departments</option>
            <option>IT</option>
            <option>HR</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
            <option>All Regimes</option>
            <option>Old Regime</option>
            <option>New Regime</option>
          </select>
          <Button variant="ghost" size="sm">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiCards.map((kpi, index) =>
        <Card
          key={index}
          className={`p-4 border-l-4 ${kpi.borderColor} relative group`}>

            <button
            onClick={() => setActiveKpiInfo(kpi.info)}
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full text-gray-300 hover:text-blue-600 hover:bg-blue-50 transition-colors opacity-0 group-hover:opacity-100"
            title="More info">

              <Info className="w-4 h-4" />
            </button>
            <div className="flex items-center justify-between mb-2">
              <kpi.icon className={`w-5 h-5 ${kpi.iconColor}`} />
              <span className="text-2xl font-bold text-gray-900">
                {kpi.value}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-700">{kpi.label}</p>
            <p className={`text-xs mt-1 ${kpi.subColor}`}>{kpi.sub}</p>
          </Card>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regime Distribution */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              Regime Distribution
            </h2>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="20"
                  strokeDasharray="150.8 251.2" />

                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="20"
                  strokeDasharray="100.5 251.2"
                  strokeDashoffset="-150.8" />

              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">248</p>
                  <p className="text-xs text-gray-500">Employees</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full" />
              <span className="text-sm text-gray-700">Old Regime (60%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-sm text-gray-700">New Regime (40%)</span>
            </div>
          </div>
        </Card>

        {/* Tax Slab Distribution */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              Tax Slab Distribution
            </h2>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Up to ₹2.5L</span>
                <span className="font-medium text-gray-900">45 employees</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-500"
                  style={{
                    width: '45%'
                  }} />

              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">₹2.5L - ₹5L</span>
                <span className="font-medium text-gray-900">62 employees</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-500"
                  style={{
                    width: '62.5%'
                  }} />

              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">₹5L - ₹10L</span>
                <span className="font-medium text-gray-900">85 employees</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-500"
                  style={{
                    width: '85%'
                  }} />

              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">₹10L - ₹15L</span>
                <span className="font-medium text-gray-900">38 employees</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-500"
                  style={{
                    width: '37.5%'
                  }} />

              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Above ₹15L</span>
                <span className="font-medium text-gray-900">18 employees</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-500"
                  style={{
                    width: '20%'
                  }} />

              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* TDS Monthly Trend */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">TDS Monthly Trend</h2>
          <Calendar className="w-5 h-5 text-gray-400" />
        </div>
        <div className="h-64 flex items-end justify-between gap-2">
          {[
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
          'Jan',
          'Feb',
          'Mar'].
          map((month, idx) => {
            const heights = [55, 60, 48, 65, 70, 58, 72, 68, 75, 80, 62, 85];
            const height = heights[idx];
            return (
              <div
                key={month}
                className="flex-1 flex flex-col items-center gap-2">

                <div
                  className="w-full bg-blue-600 rounded-t hover:bg-blue-700 transition-colors cursor-pointer relative group"
                  style={{
                    height: `${height}%`
                  }}>

                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ₹{(2.5 + idx * 0.2).toFixed(1)}L
                  </div>
                </div>
                <span className="text-xs text-gray-600">{month}</span>
              </div>);

          })}
        </div>
      </Card>

      {/* Alerts Panel */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Compliance Alerts
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-gray-900">
                Employees without PAN
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-white text-gray-900">8</Badge>
              <Button variant="ghost" size="sm" className="text-blue-600">
                View
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-gray-900">
                Missing Aadhaar
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-white text-gray-900">12</Badge>
              <Button variant="ghost" size="sm" className="text-blue-600">
                View
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-medium text-gray-900">
                No regime selected
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-white text-gray-900">15</Badge>
              <Button variant="ghost" size="sm" className="text-blue-600">
                View
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">
                Declaration not submitted
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-white text-gray-900">42</Badge>
              <Button variant="ghost" size="sm" className="text-blue-600">
                View
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-900">
                Proof pending verification
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-white text-gray-900">28</Badge>
              <Button variant="ghost" size="sm" className="text-blue-600">
                View
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>);

}