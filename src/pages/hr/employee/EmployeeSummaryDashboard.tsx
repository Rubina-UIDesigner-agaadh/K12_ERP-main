// File: src/pages/hr/employee/EmployeeSummaryDashboard.tsx

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, UserPlus, Clock, AlertTriangle, FileText, Briefcase, GraduationCap, UserCheck,
  UserMinus, ArrowRight, Info, X, Database, Zap, ChevronRight, Download, TrendingUp,
  TrendingDown, Calendar, Award, Building, MapPin, Star, Layers, GitBranch, BookOpen,
  FileCheck, UserX, CheckCircle, XCircle, AlertCircle, RefreshCw, Filter, Search, Bell,
  Settings, PieChart, BarChart3 } from
'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';

// Types & Constants
interface MetricInfo {
  title: string;description: string;
  dataSource: {title: string;description: string;};
  whyItMatters: {title: string;description: string;};
  recommendedActions: {title: string;link?: string;}[];
}

interface Employee {
  id: number;name: string;branch: string;batch: string;department: string;
  category: 'teaching' | 'non-teaching' | 'support';status: 'confirmed' | 'probation' | 'contract' | 'trainee' | 'notice' | 'leave';
  gender: 'male' | 'female';age: number;qualification: string;experience: number;
  joiningDate: string;performanceRating: number;
}

const BRANCHES = [
{ id: 'all', name: 'All Branches' },
{ id: 'main', name: 'Main Campus' },
{ id: 'north', name: 'North Wing' },
{ id: 'south', name: 'South Wing' },
{ id: 'east', name: 'East Campus' }];


const BATCHES = [
{ value: 'all', label: 'All Batches' },
{ value: '2024-2025', label: '2024-2025' },
{ value: '2023-2024', label: '2023-2024' },
{ value: '2022-2023', label: '2022-2023' }];


const DEPARTMENTS = ['Primary Section', 'High School', 'Administration', 'Science Dept', 'Transport', 'IT', 'Finance', 'HR'];

const generateEmployees = (): Employee[] => {
  const branches = ['main', 'north', 'south', 'east'];
  const batches = ['2024-2025', '2023-2024', '2022-2023'];
  const categories: Employee['category'][] = ['teaching', 'non-teaching', 'support'];
  const statuses: Employee['status'][] = ['confirmed', 'probation', 'contract', 'trainee', 'notice', 'leave'];
  const qualifications = ['PhD', 'M.Ed', 'MA', 'B.Ed', 'BA', 'BSc', 'Diploma'];

  return Array.from({ length: 200 }, (_, i) => ({
    id: i + 1,
    name: `Employee ${i + 1}`,
    branch: branches[Math.floor(Math.random() * branches.length)],
    batch: batches[Math.floor(Math.random() * batches.length)],
    department: DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)],
    category: categories[Math.floor(Math.random() * 100) < 60 ? 0 : Math.floor(Math.random() * 100) < 85 ? 1 : 2],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    gender: Math.random() > 0.45 ? 'female' : 'male',
    age: Math.floor(Math.random() * 35) + 22,
    qualification: qualifications[Math.floor(Math.random() * qualifications.length)],
    experience: Math.floor(Math.random() * 20),
    joiningDate: `202${Math.floor(Math.random() * 4)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-01`,
    performanceRating: Math.floor(Math.random() * 3) + 2
  }));
};

const metricsInfo: Record<string, MetricInfo> = {
  totalEmployees: { title: 'Total Active Employees', description: 'Current count of all active employees across all departments.', dataSource: { title: 'Data Source', description: 'Aggregated from HRMS Employee Master Database.' }, whyItMatters: { title: 'Why It Matters', description: 'Understanding workforce helps in resource planning and budget allocation.' }, recommendedActions: [{ title: 'Review headcount against approved positions' }, { title: 'Analyze department-wise distribution' }] },
  newJoiners: { title: 'New Joiners', description: 'Employees joined in current month.', dataSource: { title: 'Data Source', description: 'From onboarding module.' }, whyItMatters: { title: 'Why It Matters', description: 'Helps ensure proper onboarding.' }, recommendedActions: [{ title: 'Verify onboarding completion' }, { title: 'Schedule orientation' }] },
  onProbation: { title: 'On Probation', description: 'Employees serving probation period.', dataSource: { title: 'Data Source', description: 'From employee records.' }, whyItMatters: { title: 'Why It Matters', description: 'Timely reviews prevent complications.' }, recommendedActions: [{ title: 'Review pending evaluations' }, { title: 'Schedule discussions' }] },
  exiting: { title: 'Notice Period', description: 'Employees serving notice or exiting.', dataSource: { title: 'Data Source', description: 'From exit management module.' }, whyItMatters: { title: 'Why It Matters', description: 'Helps in knowledge transfer planning.' }, recommendedActions: [{ title: 'Conduct exit interviews' }, { title: 'Plan replacements' }] },
  teachingStaff: { title: 'Teaching Staff', description: 'Academic staff across departments.', dataSource: { title: 'Data Source', description: 'Filtered by job category.' }, whyItMatters: { title: 'Why It Matters', description: 'Student-teacher ratio compliance.' }, recommendedActions: [{ title: 'Review ratios' }, { title: 'Assess workload' }] },
  attritionRate: { title: 'Attrition Rate', description: 'Percentage of employees who left.', dataSource: { title: 'Data Source', description: 'From exit records.' }, whyItMatters: { title: 'Why It Matters', description: 'High attrition increases costs.' }, recommendedActions: [{ title: 'Analyze feedback' }, { title: 'Develop retention programs' }] }
};

const recentActivities = [
{ type: 'join', name: 'Priya Sharma', action: 'joined as Math Teacher', department: 'High School', time: '2 hours ago', icon: UserPlus, color: 'text-green-600', bgColor: 'bg-green-50', branch: 'main' },
{ type: 'promotion', name: 'Rahul Verma', action: 'promoted to Senior Teacher', department: 'Primary', time: '5 hours ago', icon: Award, color: 'text-purple-600', bgColor: 'bg-purple-50', branch: 'north' },
{ type: 'transfer', name: 'Anita Desai', action: 'transferred to North Wing', department: 'Science', time: '1 day ago', icon: GitBranch, color: 'text-blue-600', bgColor: 'bg-blue-50', branch: 'north' },
{ type: 'exit', name: 'Suresh Kumar', action: 'submitted resignation', department: 'Admin', time: '2 days ago', icon: UserMinus, color: 'text-red-600', bgColor: 'bg-red-50', branch: 'south' },
{ type: 'confirmation', name: 'Meera Patel', action: 'confirmed after probation', department: 'Transport', time: '3 days ago', icon: UserCheck, color: 'text-teal-600', bgColor: 'bg-teal-50', branch: 'main' }];


const upcomingEvents = [
{ title: 'Probation Review - Amit Singh', date: 'Tomorrow', time: '10:00 AM', priority: 'high', branch: 'main' },
{ title: 'New Employee Orientation', date: 'Dec 18', time: '9:00 AM', priority: 'medium', branch: 'north' },
{ title: 'Annual Training Session', date: 'Dec 20', time: '2:00 PM', priority: 'low', branch: 'all' },
{ title: 'Exit Interview - Suresh Kumar', date: 'Dec 22', time: '11:00 AM', priority: 'high', branch: 'south' }];


export function EmployeeSummaryDashboard() {
  const navigate = useNavigate();
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['all']);
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allEmployees] = useState<Employee[]>(generateEmployees);

  const getActiveBranches = () => selectedBranches.includes('all') ? ['main', 'north', 'south', 'east'] : selectedBranches;
  const getBranchName = (id: string) => BRANCHES.find((b) => b.id === id)?.name || id;

  const handleBranchToggle = (branchId: string) => {
    if (branchId === 'all') setSelectedBranches(['all']);else
    {
      const newSelection = selectedBranches.includes('all') ? [branchId] : selectedBranches.includes(branchId) ? selectedBranches.filter((b) => b !== branchId) : [...selectedBranches, branchId];
      setSelectedBranches(newSelection.length === 0 ? ['all'] : newSelection);
    }
  };

  const filteredEmployees = useMemo(() => {
    return allEmployees.filter((emp) => {
      const branchMatch = selectedBranches.includes('all') || selectedBranches.includes(emp.branch);
      const batchMatch = selectedBatch === 'all' || emp.batch === selectedBatch;
      return branchMatch && batchMatch;
    });
  }, [allEmployees, selectedBranches, selectedBatch]);

  const getBranchEmployees = (branch: string) => filteredEmployees.filter((e) => e.branch === branch);

  const calculateBranchStats = (employees: Employee[]) => ({
    total: employees.length,
    teaching: employees.filter((e) => e.category === 'teaching').length,
    nonTeaching: employees.filter((e) => e.category === 'non-teaching').length,
    support: employees.filter((e) => e.category === 'support').length,
    confirmed: employees.filter((e) => e.status === 'confirmed').length,
    probation: employees.filter((e) => e.status === 'probation').length,
    notice: employees.filter((e) => e.status === 'notice').length,
    male: employees.filter((e) => e.gender === 'male').length,
    female: employees.filter((e) => e.gender === 'female').length,
    newJoiners: employees.filter((e) => new Date(e.joiningDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length
  });

  const totalStats = calculateBranchStats(filteredEmployees);

  const InfoIcon = ({ metricKey }: {metricKey: string;}) =>
  <button onClick={(e) => {e.stopPropagation();setSelectedMetric(metricKey);setIsModalOpen(true);}} className="p-1 hover:bg-gray-200 rounded-full" title="View Details">
      <Info className="w-4 h-4 text-gray-400 hover:text-gray-600" />
    </button>;


  const MetricCard = ({ title, value, icon: Icon, color, bgColor, borderColor, trend, trendValue, metricKey, subtitle, onClick }: any) =>
  <Card className={`p-5 border-l-4 ${borderColor} hover:shadow-lg transition-shadow cursor-pointer`} onClick={onClick}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-500">{title}</p>
            {metricKey && <InfoIcon metricKey={metricKey} />}
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mt-1">{value}</h3>
        </div>
        <div className={`p-3 ${bgColor} rounded-xl`}><Icon className={`w-6 h-6 ${color}`} /></div>
      </div>
      {(trend || subtitle) &&
    <div className="mt-4 flex items-center justify-between">
          {trend && <div className={`flex items-center text-xs ${trend === 'up' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'} px-2 py-1 rounded-full`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            <span>{trendValue}</span>
          </div>}
          {subtitle && <span className="text-xs text-gray-500">{subtitle}</span>}
        </div>
    }
    </Card>;


  const BranchStatsCard = ({ branch, stats }: {branch: string;stats: ReturnType<typeof calculateBranchStats>;}) =>
  <Card className="p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b">
        <div className="p-2 bg-blue-100 rounded-lg"><Building className="w-5 h-5 text-blue-600" /></div>
        <div>
          <h3 className="font-semibold text-gray-900">{getBranchName(branch)}</h3>
          <p className="text-sm text-gray-500">{stats.total} employees</p>
        </div>
        <Badge variant="primary" className="ml-auto">{selectedBatch === 'all' ? 'All Batches' : selectedBatch}</Badge>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        {[{ label: 'Teaching', value: stats.teaching, color: 'text-indigo-600', bg: 'bg-indigo-50' },
      { label: 'Non-Teaching', value: stats.nonTeaching, color: 'text-teal-600', bg: 'bg-teal-50' },
      { label: 'Support', value: stats.support, color: 'text-gray-600', bg: 'bg-gray-50' }].
      map((item) =>
      <div key={item.label} className={`${item.bg} rounded-lg p-3 text-center`}>
            <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
            <p className="text-xs text-gray-500">{item.label}</p>
          </div>
      )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        {[{ label: 'Confirmed', value: stats.confirmed, icon: CheckCircle, color: 'text-green-600' },
      { label: 'Probation', value: stats.probation, icon: Clock, color: 'text-orange-600' },
      { label: 'New Joiners', value: stats.newJoiners, icon: UserPlus, color: 'text-blue-600' },
      { label: 'Notice Period', value: stats.notice, icon: AlertCircle, color: 'text-red-600' }].
      map((item) =>
      <div key={item.label} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <item.icon className={`w-4 h-4 ${item.color}`} />
            <span className="text-gray-600">{item.label}:</span>
            <span className="font-semibold ml-auto">{item.value}</span>
          </div>
      )}
      </div>

      <div className="mt-4 pt-3 border-t">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Gender Ratio</span>
          <span className="font-medium">M: {stats.male} | F: {stats.female}</span>
        </div>
        <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden flex">
          <div className="bg-blue-500 h-full" style={{ width: `${stats.male / stats.total * 100}%` }}></div>
          <div className="bg-pink-500 h-full" style={{ width: `${stats.female / stats.total * 100}%` }}></div>
        </div>
      </div>
    </Card>;


  return (
    <div className="space-y-6 pb-8">
      {/* Metric Modal */}
      {isModalOpen && selectedMetric && metricsInfo[selectedMetric] &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{metricsInfo[selectedMetric].title}</h2>
                  <p className="mt-2 text-sm text-gray-600">{metricsInfo[selectedMetric].description}</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg"><Database className="w-5 h-5 text-blue-600" /></div>
                    <h3 className="font-semibold text-blue-900 uppercase text-sm">Data Source</h3>
                  </div>
                  <p className="text-sm text-blue-800">{metricsInfo[selectedMetric].dataSource.description}</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-100 rounded-lg"><Zap className="w-5 h-5 text-purple-600" /></div>
                    <h3 className="font-semibold text-purple-900 uppercase text-sm">Why It Matters</h3>
                  </div>
                  <p className="text-sm text-purple-800">{metricsInfo[selectedMetric].whyItMatters.description}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 uppercase text-sm mb-4">Recommended Actions</h3>
                <div className="space-y-2">
                  {metricsInfo[selectedMetric].recommendedActions.map((action, i) =>
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer group">
                      <span className="text-sm text-gray-700 font-medium">{action.title}</span>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-all" />
                    </div>
                )}
                </div>
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Close</Button>
              <Button variant="primary" className="bg-blue-600 text-white"><Download className="w-4 h-4 mr-2" />Export</Button>
            </div>
          </div>
        </div>
      }

      {/* Header */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg"><Users className="w-6 h-6 text-blue-600" /></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Employee Summary Dashboard</h1>
              <p className="text-sm text-gray-500">Real-time workforce metrics and insights</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search employees..." className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 w-48" />
            </div>
            <Select label="" options={BATCHES} value={selectedBatch} onChange={setSelectedBatch} className="w-36" />
            <Button variant="outline"><Filter className="w-4 h-4 mr-2" />Filters</Button>
            <Button variant="outline"><RefreshCw className="w-4 h-4 mr-2" />Refresh</Button>
          </div>
        </div>

        {/* Branch Selection */}
        <div className="mt-6 pt-6 border-t flex flex-wrap items-center gap-3">
          <Building className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Branches:</span>
          {BRANCHES.map((branch) =>
          <button key={branch.id} onClick={() => handleBranchToggle(branch.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${selectedBranches.includes(branch.id) || branch.id !== 'all' && selectedBranches.includes('all') ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              {branch.name}
              {selectedBranches.includes(branch.id) && branch.id !== 'all' && <X className="w-3 h-3" onClick={(e) => {e.stopPropagation();handleBranchToggle(branch.id);}} />}
            </button>
          )}
          <div className="ml-auto flex items-center gap-4 text-sm">
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span>Last Sync: 2 min ago</span>
            <span className="flex items-center gap-2"><Bell className="w-4 h-4 text-orange-500" /><span className="text-orange-600 font-medium">5 Alerts</span></span>
          </div>
        </div>
      </Card>

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Active Employees" value={totalStats.total} icon={Users} color="text-blue-600" bgColor="bg-blue-50" borderColor="border-l-blue-500" trend="up" trendValue={`+${totalStats.newJoiners} this month`} metricKey="totalEmployees" />
        <MetricCard title="New Joiners (This Month)" value={totalStats.newJoiners} icon={UserPlus} color="text-green-600" bgColor="bg-green-50" borderColor="border-l-green-500" metricKey="newJoiners" subtitle="Across all branches" />
        <MetricCard title="On Probation" value={totalStats.probation} icon={Clock} color="text-orange-600" bgColor="bg-orange-50" borderColor="border-l-orange-500" metricKey="onProbation" subtitle="Action needed" onClick={() => navigate('/hr/employee/probation')} />
        <MetricCard title="Notice Period / Exiting" value={totalStats.notice} icon={UserMinus} color="text-red-600" bgColor="bg-red-50" borderColor="border-l-red-500" metricKey="exiting" onClick={() => navigate('/hr/employee/exit-list')} />
      </div>

      {/* Branch-wise Stats */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><Building className="w-5 h-5 text-blue-600" />Branch-wise Overview</h2>
          <Badge variant="primary">{getActiveBranches().length} Branch(es) Selected</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {getActiveBranches().map((branch) =>
          <BranchStatsCard key={branch} branch={branch} stats={calculateBranchStats(getBranchEmployees(branch))} />
          )}
        </div>
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[{ title: 'Teaching Staff', value: totalStats.teaching, percent: Math.round(totalStats.teaching / totalStats.total * 100), icon: GraduationCap, color: 'indigo', metricKey: 'teachingStaff' },
        { title: 'Non-Teaching', value: totalStats.nonTeaching, percent: Math.round(totalStats.nonTeaching / totalStats.total * 100), icon: Briefcase, color: 'teal' },
        { title: 'Support Staff', value: totalStats.support, percent: Math.round(totalStats.support / totalStats.total * 100), icon: UserCheck, color: 'gray' },
        { title: 'Attrition Rate', value: '4.2%', percent: 4.2, icon: TrendingDown, color: 'red', metricKey: 'attritionRate' },
        { title: 'Avg. Tenure', value: '5.2 yrs', percent: 52, icon: Award, color: 'purple' }].
        map((item) =>
        <Card key={item.title} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 bg-${item.color}-50 rounded-lg`}><item.icon className={`w-5 h-5 text-${item.color}-600`} /></div>
              {item.metricKey && <InfoIcon metricKey={item.metricKey} />}
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">{item.title}</p>
            <div className="flex items-end justify-between mt-1">
              <h3 className="text-2xl font-bold text-gray-900">{item.value}</h3>
              <span className="text-xs text-gray-400">{item.percent}%</span>
            </div>
            <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full bg-${item.color}-500 rounded-full`} style={{ width: `${Math.min(item.percent, 100)}%` }}></div>
            </div>
          </Card>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Department Distribution by Branch */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div><h3 className="text-lg font-semibold text-gray-900">Department Distribution</h3><p className="text-sm text-gray-500">By branch and category</p></div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm"><PieChart className="w-4 h-4" /></Button>
                <Button variant="outline" size="sm"><BarChart3 className="w-4 h-4" /></Button>
              </div>
            </div>
            
            {getActiveBranches().map((branch) => {
              const branchEmps = getBranchEmployees(branch);
              const deptCounts = DEPARTMENTS.map((dept) => ({ name: dept, count: branchEmps.filter((e) => e.department === dept).length })).filter((d) => d.count > 0).sort((a, b) => b.count - a.count).slice(0, 5);

              return (
                <div key={branch} className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-4">
                    <Building className="w-4 h-4 text-blue-600" />
                    <h4 className="font-semibold text-gray-800">{getBranchName(branch)}</h4>
                    <Badge variant="secondary" className="ml-auto">{branchEmps.length} employees</Badge>
                  </div>
                  <div className="space-y-3">
                    {deptCounts.map((dept, i) =>
                    <div key={dept.name} className="group">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-700">{dept.name}</span>
                          <span className="font-bold text-gray-900">{dept.count}</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${['bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-teal-500', 'bg-orange-500'][i]}`} style={{ width: `${dept.count / branchEmps.length * 100}%` }}></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>);

            })}
          </Card>

          {/* Employment Status */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Status by Branch</h3>
            <div className="space-y-4">
              {getActiveBranches().map((branch) => {
                const stats = calculateBranchStats(getBranchEmployees(branch));
                const statusItems = [
                { label: 'Confirmed', count: stats.confirmed, icon: CheckCircle, color: 'green' },
                { label: 'Probation', count: stats.probation, icon: Clock, color: 'orange' },
                { label: 'Notice', count: stats.notice, icon: AlertCircle, color: 'red' }];

                return (
                  <div key={branch} className="p-4 border rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <Building className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">{getBranchName(branch)}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {statusItems.map((item) =>
                      <div key={item.label} className={`bg-${item.color}-50 border border-${item.color}-200 rounded-lg p-3 text-center`}>
                          <item.icon className={`w-5 h-5 text-${item.color}-600 mx-auto mb-1`} />
                          <p className="text-xl font-bold text-gray-900">{item.count}</p>
                          <p className="text-xs text-gray-600">{item.label}</p>
                        </div>
                      )}
                    </div>
                  </div>);

              })}
            </div>
          </Card>

          {/* Compliance Status */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Compliance Status</h3>
              <Button variant="outline" size="sm" onClick={() => navigate('/hr/employee/documents')}>View All</Button>
            </div>
            {[{ name: 'Background Verification', completed: 138, total: totalStats.total },
            { name: 'Document Submission', completed: 135, total: totalStats.total },
            { name: 'Safety Training', completed: totalStats.total, total: totalStats.total },
            { name: 'ID Card Issuance', completed: 128, total: totalStats.total }].
            map((item) => {
              const pct = Math.round(item.completed / item.total * 100);
              const status = pct === 100 ? 'success' : pct >= 90 ? 'warning' : 'danger';
              return (
                <div key={item.name} className={`p-4 rounded-xl mb-3 ${status === 'success' ? 'bg-green-50' : status === 'warning' ? 'bg-yellow-50' : 'bg-red-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {status === 'success' ? <CheckCircle className="w-5 h-5 text-green-600" /> : status === 'warning' ? <AlertCircle className="w-5 h-5 text-yellow-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold">{item.completed}/{item.total} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-white rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${status === 'success' ? 'bg-green-500' : status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>);

            })}
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Alerts */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Alerts & Actions</h3>
              <Badge variant="danger">5 pending</Badge>
            </div>
            {[{ title: 'Probation Ending Soon', desc: '3 employees in next 15 days', icon: AlertTriangle, color: 'yellow', link: '/hr/employee/probation' },
            { title: 'Missing Documents', desc: '5 employees pending', icon: FileText, color: 'red', link: '/hr/employee/documents' },
            { title: 'Contract Expiring', desc: '2 contracts next month', icon: Calendar, color: 'blue', link: '/hr/employee/contracts' },
            { title: 'Training Overdue', desc: '8 employees pending', icon: BookOpen, color: 'purple', link: '/hr/training' }].
            map((alert) =>
            <div key={alert.title} className={`p-4 bg-${alert.color}-50 border border-${alert.color}-200 rounded-xl mb-3`}>
                <div className="flex gap-3">
                  <div className={`p-2 bg-${alert.color}-100 rounded-lg h-fit`}><alert.icon className={`w-5 h-5 text-${alert.color}-600`} /></div>
                  <div className="flex-1">
                    <h5 className={`text-sm font-semibold text-${alert.color}-800`}>{alert.title}</h5>
                    <p className={`text-xs text-${alert.color}-700 mt-1`}>{alert.desc}</p>
                    <Button variant="outline" size="sm" className="mt-2 h-7 text-xs" onClick={() => navigate(alert.link)}>Review</Button>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Quick Links */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-3">
              {[{ icon: Users, label: 'Directory', path: '/hr/employee/list', color: 'blue' },
              { icon: UserPlus, label: 'Add Employee', path: '/hr/employee/profile', color: 'green' },
              { icon: FileCheck, label: 'Attendance', path: '/hr/employee/attendance', color: 'teal' },
              { icon: BarChart3, label: 'Reports', path: '/hr/employee/report', color: 'orange' },
              { icon: UserX, label: 'Exit List', path: '/hr/employee/exit-list', color: 'red' },
              { icon: Settings, label: 'Settings', path: '/hr/settings', color: 'gray' }].
              map((link) =>
              <Button key={link.label} variant="outline" size="sm" className={`h-auto py-3 flex flex-col items-center gap-2 hover:bg-${link.color}-50`} onClick={() => navigate(link.path)}>
                  <link.icon className={`w-5 h-5 text-${link.color}-600`} /><span className="text-xs">{link.label}</span>
                </Button>
              )}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
              <button className="text-sm text-blue-600 font-medium">View All</button>
            </div>
            {recentActivities.filter((a) => selectedBranches.includes('all') || selectedBranches.includes(a.branch)).slice(0, 5).map((activity, i) =>
            <div key={i} className="flex gap-3 mb-4">
                <div className={`p-2 ${activity.bgColor} rounded-lg h-fit`}><activity.icon className={`w-4 h-4 ${activity.color}`} /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm"><span className="font-medium">{activity.name}</span> <span className="text-gray-600">{activity.action}</span></p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span>{activity.department}</span>•<span>{activity.time}</span>•<span className="text-blue-600">{getBranchName(activity.branch)}</span>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Upcoming Events */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Upcoming Events</h3>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            {upcomingEvents.filter((e) => e.branch === 'all' || selectedBranches.includes('all') || selectedBranches.includes(e.branch)).map((event, i) =>
            <div key={i} className={`p-3 bg-gray-50 rounded-lg border-l-4 mb-2 ${event.priority === 'high' ? 'border-l-red-500' : event.priority === 'medium' ? 'border-l-yellow-500' : 'border-l-green-500'}`}>
                <p className="text-sm font-medium truncate">{event.title}</p>
                <div className="flex items-center gap-2 mt-1 text-xs">
                  <span className="text-blue-600 font-medium">{event.date}</span>•<span className="text-gray-500">{event.time}</span>
                  {event.branch !== 'all' && <span className="text-gray-400">• {getBranchName(event.branch)}</span>}
                </div>
              </div>
            )}
            <Button variant="outline" size="sm" className="w-full mt-3" onClick={() => navigate('/hr/calendar')}>View Calendar</Button>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>Last updated: {new Date().toLocaleString()}</span>•<span>Data refresh: Every 15 minutes</span>
        </div>
        <div className="flex gap-3">
          <Button variant="outline"><Download className="w-4 h-4 mr-2" />Export</Button>
          <Button variant="outline"><Settings className="w-4 h-4 mr-2" />Customize</Button>
          <Button variant="primary" className="bg-blue-600 text-white"><BarChart3 className="w-4 h-4 mr-2" />Generate Report</Button>
        </div>
      </div>
    </div>);

}