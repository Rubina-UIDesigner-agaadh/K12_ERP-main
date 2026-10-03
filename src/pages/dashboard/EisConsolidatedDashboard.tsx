import React, { useState, useMemo } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Users, UserCheck, UserX, Calendar, Cake, Award, Clock, CheckCircle, UserPlus, UserMinus,
  GraduationCap, Briefcase, IndianRupee, FileText, ChevronRight, RefreshCcw, Download, Filter, Eye,
  Mail, Star, BookOpen, ClipboardCheck, CalendarDays, ArrowUpRight, ArrowDownRight, BarChart3, Activity,
  Shield, PartyPopper, ChevronDown, X, Building2, Check } from
'lucide-react';

const BRANCHES = [
{ id: 'main', name: 'Main Campus', city: 'Delhi', color: 'bg-blue-500' },
{ id: 'north', name: 'North Branch', city: 'Noida', color: 'bg-green-500' },
{ id: 'south', name: 'South Branch', city: 'Gurgaon', color: 'bg-purple-500' },
{ id: 'east', name: 'East Branch', city: 'Faridabad', color: 'bg-orange-500' },
{ id: 'west', name: 'West Branch', city: 'Ghaziabad', color: 'bg-pink-500' }];


const BATCHES = ['2024-25', '2023-24', '2022-23', '2021-22', '2020-21'];

const branchData: Record<string, any> = {
  main: {
    stats: { total: 52, active: 50, onLeave: 2, attendance: 96.2, newJoinings: 2, resignations: 0 },
    categories: { teaching: 28, administrative: 10, support: 10, special: 4 },
    departments: [
    { name: 'Science', count: 8, head: 'Dr. R.K. Gupta' },
    { name: 'Mathematics', count: 6, head: 'Mrs. S. Nair' },
    { name: 'English', count: 5, head: 'Mr. A. Khan' }],

    leaves: { casual: 45, sick: 18, earned: 32 },
    salary: { total: 1350000, avg: 26000 }
  },
  north: {
    stats: { total: 38, active: 36, onLeave: 2, attendance: 94.7, newJoinings: 1, resignations: 1 },
    categories: { teaching: 20, administrative: 6, support: 9, special: 3 },
    departments: [
    { name: 'Science', count: 5, head: 'Dr. P. Sharma' },
    { name: 'Mathematics', count: 4, head: 'Mr. V. Kumar' },
    { name: 'Hindi', count: 4, head: 'Mrs. M. Devi' }],

    leaves: { casual: 38, sick: 12, earned: 28 },
    salary: { total: 980000, avg: 25800 }
  },
  south: {
    stats: { total: 42, active: 40, onLeave: 2, attendance: 95.2, newJoinings: 1, resignations: 0 },
    categories: { teaching: 22, administrative: 8, support: 9, special: 3 },
    departments: [
    { name: 'Science', count: 6, head: 'Mr. T. Reddy' },
    { name: 'Commerce', count: 5, head: 'Mrs. L. Kapoor' },
    { name: 'English', count: 4, head: 'Ms. R. Singh' }],

    leaves: { casual: 42, sick: 15, earned: 35 },
    salary: { total: 1120000, avg: 26700 }
  },
  east: {
    stats: { total: 28, active: 26, onLeave: 2, attendance: 92.9, newJoinings: 0, resignations: 1 },
    categories: { teaching: 15, administrative: 5, support: 6, special: 2 },
    departments: [
    { name: 'Science', count: 4, head: 'Dr. N. Joshi' },
    { name: 'Mathematics', count: 3, head: 'Mr. S. Verma' },
    { name: 'Social Studies', count: 3, head: 'Mrs. K. Rao' }],

    leaves: { casual: 28, sick: 10, earned: 22 },
    salary: { total: 720000, avg: 25700 }
  },
  west: {
    stats: { total: 26, active: 24, onLeave: 2, attendance: 92.3, newJoinings: 1, resignations: 0 },
    categories: { teaching: 14, administrative: 4, support: 6, special: 2 },
    departments: [
    { name: 'Science', count: 4, head: 'Mr. H. Patel' },
    { name: 'Hindi', count: 3, head: 'Mrs. S. Gupta' },
    { name: 'Computer Science', count: 3, head: 'Mr. A. Roy' }],

    leaves: { casual: 26, sick: 8, earned: 20 },
    salary: { total: 680000, avg: 26200 }
  }
};

const commonData = {
  birthdays: [
  { name: 'Suresh Raina', branch: 'main', designation: 'Sports Coach', date: '24 Feb', daysLeft: 0 },
  { name: 'Anita Desai', branch: 'north', designation: 'PGT Chemistry', date: '28 Feb', daysLeft: 4 },
  { name: 'Rajesh Verma', branch: 'south', designation: 'Office Manager', date: '02 Mar', daysLeft: 6 },
  { name: 'Meera Patel', branch: 'east', designation: 'TGT Mathematics', date: '05 Mar', daysLeft: 9 },
  { name: 'Sanjay Kumar', branch: 'west', designation: 'PGT Hindi', date: '08 Mar', daysLeft: 12 }],

  anniversaries: [
  { name: 'Dr. Anil Sharma', branch: 'main', years: 15, date: '25 Feb', designation: 'HOD Science' },
  { name: 'Mrs. Kavita Nair', branch: 'north', years: 10, date: '28 Feb', designation: 'Senior Teacher' },
  { name: 'Mr. Prakash Singh', branch: 'south', years: 20, date: '01 Mar', designation: 'Senior Admin' }],

  leaveRequests: [
  { name: 'Priya Sharma', branch: 'main', type: 'Casual', days: 2, status: 'Pending' },
  { name: 'Rahul Verma', branch: 'north', type: 'Sick', days: 1, status: 'Approved' },
  { name: 'Anita Desai', branch: 'south', type: 'Earned', days: 5, status: 'Pending' },
  { name: 'Vikram Singh', branch: 'east', type: 'Half Day', days: 0.5, status: 'Approved' }],

  activities: [
  { action: 'New employee joined', name: 'Ravi Kumar', branch: 'main', time: '2 hours ago', type: 'join' },
  { action: 'Leave approved', name: 'Priya Sharma', branch: 'north', time: '3 hours ago', type: 'leave' },
  { action: 'Salary processed', name: 'February Payroll', branch: 'all', time: '1 day ago', type: 'salary' },
  { action: 'Training completed', name: 'Digital Workshop', branch: 'south', time: '2 days ago', type: 'training' }],

  events: [
  { event: 'Staff Meeting', date: '25 Feb', time: '10:00 AM', type: 'meeting', branch: 'all' },
  { event: 'Training Workshop', date: '28 Feb', time: '02:00 PM', type: 'training', branch: 'main' },
  { event: 'Performance Review', date: '01 Mar', time: '11:00 AM', type: 'review', branch: 'north' }],

  pendingApprovals: [
  { type: 'Leave Requests', count: 8, icon: Calendar, urgent: 3 },
  { type: 'Expense Claims', count: 5, icon: IndianRupee, urgent: 1 },
  { type: 'Document Requests', count: 12, icon: FileText, urgent: 0 },
  { type: 'Training Requests', count: 4, icon: BookOpen, urgent: 2 }]

};

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export function EisConsolidatedDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedBatch, setSelectedBatch] = useState('2024-25');
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);

  const isAllSelected = selectedBranches.length === 0 || selectedBranches.length === BRANCHES.length;

  const toggleBranch = (branchId: string) => {
    if (branchId === 'all') {
      setSelectedBranches([]);
    } else {
      setSelectedBranches((prev) => {
        if (prev.includes(branchId)) {
          return prev.filter((b) => b !== branchId);
        } else {
          return [...prev, branchId];
        }
      });
    }
  };

  const activeBranches = useMemo(() =>
  isAllSelected ? BRANCHES : BRANCHES.filter((b) => selectedBranches.includes(b.id)),
  [selectedBranches, isAllSelected]);

  const aggregatedStats = useMemo(() => {
    const branchIds = activeBranches.map((b) => b.id);
    return branchIds.reduce((acc, id) => {
      const d = branchData[id];
      return {
        total: acc.total + d.stats.total,
        active: acc.active + d.stats.active,
        onLeave: acc.onLeave + d.stats.onLeave,
        newJoinings: acc.newJoinings + d.stats.newJoinings,
        resignations: acc.resignations + d.stats.resignations,
        teaching: acc.teaching + d.categories.teaching,
        administrative: acc.administrative + d.categories.administrative,
        support: acc.support + d.categories.support,
        special: acc.special + d.categories.special,
        casualLeaves: acc.casualLeaves + d.leaves.casual,
        sickLeaves: acc.sickLeaves + d.leaves.sick,
        earnedLeaves: acc.earnedLeaves + d.leaves.earned,
        totalSalary: acc.totalSalary + d.salary.total
      };
    }, { total: 0, active: 0, onLeave: 0, newJoinings: 0, resignations: 0, teaching: 0, administrative: 0, support: 0, special: 0, casualLeaves: 0, sickLeaves: 0, earnedLeaves: 0, totalSalary: 0 });
  }, [activeBranches]);

  const avgAttendance = useMemo(() => {
    if (activeBranches.length === 0) return '0.0';
    const branchIds = activeBranches.map((b) => b.id);
    const total = branchIds.reduce((acc, id) => acc + parseFloat(branchData[id].stats.attendance), 0);
    return (total / branchIds.length).toFixed(1);
  }, [activeBranches]);

  const filteredData = useMemo(() => {
    const branchIds = isAllSelected ? BRANCHES.map((b) => b.id) : selectedBranches;
    return {
      birthdays: commonData.birthdays.filter((b) => branchIds.includes(b.branch)),
      anniversaries: commonData.anniversaries.filter((a) => branchIds.includes(a.branch)),
      leaveRequests: commonData.leaveRequests.filter((l) => branchIds.includes(l.branch)),
      activities: commonData.activities.filter((a) => a.branch === 'all' || branchIds.includes(a.branch)),
      events: commonData.events.filter((e) => e.branch === 'all' || branchIds.includes(e.branch))
    };
  }, [selectedBranches, isAllSelected]);

  const getBranchName = (branchId: string) => BRANCHES.find((b) => b.id === branchId)?.name || branchId;
  const getBranchColor = (branchId: string) => BRANCHES.find((b) => b.id === branchId)?.color || 'bg-gray-500';

  const keyStats = [
  { label: 'Total Employees', value: aggregatedStats.total, icon: Users, bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
  { label: 'Active Staff', value: aggregatedStats.active, icon: UserCheck, bgColor: 'bg-green-50', iconColor: 'text-green-600' },
  { label: 'On Leave Today', value: aggregatedStats.onLeave, icon: UserX, bgColor: 'bg-orange-50', iconColor: 'text-orange-600' },
  { label: 'Attendance Rate', value: `${avgAttendance}%`, icon: Calendar, bgColor: 'bg-purple-50', iconColor: 'text-purple-600' },
  { label: 'New Joinings', value: aggregatedStats.newJoinings, icon: UserPlus, bgColor: 'bg-teal-50', iconColor: 'text-teal-600' },
  { label: 'Resignations', value: aggregatedStats.resignations, icon: UserMinus, bgColor: 'bg-red-50', iconColor: 'text-red-600' }];


  const staffCategories = [
  { category: 'Teaching Staff', key: 'teaching', count: aggregatedStats.teaching, icon: GraduationCap, color: 'blue' },
  { category: 'Administrative', key: 'administrative', count: aggregatedStats.administrative, icon: Briefcase, color: 'purple' },
  { category: 'Support Staff', key: 'support', count: aggregatedStats.support, icon: Shield, color: 'orange' },
  { category: 'Special Staff', key: 'special', count: aggregatedStats.special, icon: Star, color: 'green' }];


  const removeBranch = (branchId: string) => {
    setSelectedBranches((prev) => prev.filter((b) => b !== branchId));
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header with Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">EIS Consolidated Dashboard</h1>
          <p className="text-gray-500 mt-1">Employee Information System • Batch: {selectedBatch} • Last updated: {new Date().toLocaleString()}</p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none">
            {BATCHES.map((batch) => <option key={batch} value={batch}>{batch}</option>)}
          </select>

          <div className="relative">
            <button onClick={() => setShowBranchDropdown(!showBranchDropdown)} className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none min-w-[200px]">
              <Building2 className="w-4 h-4 text-gray-500" />
              <span className="flex-1 text-left">
                {isAllSelected ? 'All Branches' : `${selectedBranches.length} Branch${selectedBranches.length > 1 ? 'es' : ''}`}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            {showBranchDropdown &&
            <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-2">
                  <div onClick={() => toggleBranch('all')} className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-50 ${isAllSelected ? 'bg-blue-50' : ''}`}>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${isAllSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                      {isAllSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-sm font-medium">All Branches</span>
                  </div>
                  <div className="border-t my-2" />
                  {BRANCHES.map((branch) => {
                  const isSelected = selectedBranches.includes(branch.id);
                  return (
                    <div key={branch.id} onClick={() => toggleBranch(branch.id)} className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div className={`w-3 h-3 rounded-full ${branch.color}`} />
                        <div>
                          <p className="text-sm font-medium">{branch.name}</p>
                          <p className="text-xs text-gray-500">{branch.city}</p>
                        </div>
                      </div>);

                })}
                </div>
                <div className="border-t p-2">
                  <button onClick={() => setShowBranchDropdown(false)} className="w-full py-2 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600">Apply</button>
                </div>
              </div>
            }
          </div>

          <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none">
            <option value="today">Today</option>
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
            <option value="thisYear">This Year</option>
          </select>
          <Button variant="outline" size="sm"><RefreshCcw className="w-4 h-4 mr-2" />Refresh</Button>
          <Button variant="primary" size="sm"><Download className="w-4 h-4 mr-2" />Export</Button>
        </div>
      </div>

      {/* Selected Branches Tags */}
      {!isAllSelected && selectedBranches.length > 0 &&
      <div className="flex flex-wrap gap-2">
          {selectedBranches.map((branchId) => {
          const branch = BRANCHES.find((b) => b.id === branchId);
          return branch ?
          <span key={branchId} className="inline-flex items-center gap-2 px-3 py-1 bg-white border rounded-full text-sm">
                <span className={`w-2 h-2 rounded-full ${branch.color}`} />
                {branch.name}
                <X className="w-3 h-3 cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => removeBranch(branchId)} />
              </span> :
          null;
        })}
          <button onClick={() => setSelectedBranches([])} className="text-sm text-blue-600 hover:text-blue-800 px-2">Clear All</button>
        </div>
      }

      {/* Key Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {keyStats.map((stat, idx) =>
        <Card key={idx} className="p-4">
            <div className={`p-2 rounded-lg ${stat.bgColor} w-fit`}><stat.icon className={`w-5 h-5 ${stat.iconColor}`} /></div>
            <h3 className="text-2xl font-bold text-gray-900 mt-3">{stat.value}</h3>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </Card>
        )}
      </div>

      {/* Branch-wise Overview */}
      {activeBranches.length > 1 &&
      <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Branch-wise Overview</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Branch</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">Active</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">On Leave</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">Attendance</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">Teaching</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">Non-Teaching</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">Payroll</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {activeBranches.map((branch) => {
                const d = branchData[branch.id];
                return (
                  <tr key={branch.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${branch.color}`} />
                          <div>
                            <p className="font-medium text-gray-900">{branch.name}</p>
                            <p className="text-xs text-gray-500">{branch.city}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-semibold">{d.stats.total}</td>
                      <td className="py-3 px-4 text-center text-green-600 font-medium">{d.stats.active}</td>
                      <td className="py-3 px-4 text-center text-orange-600">{d.stats.onLeave}</td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={parseFloat(d.stats.attendance) >= 95 ? 'success' : parseFloat(d.stats.attendance) >= 90 ? 'warning' : 'danger'}>{d.stats.attendance}%</Badge>
                      </td>
                      <td className="py-3 px-4 text-center">{d.categories.teaching}</td>
                      <td className="py-3 px-4 text-center">{d.categories.administrative + d.categories.support + d.categories.special}</td>
                      <td className="py-3 px-4 text-center text-blue-600 font-medium">{formatCurrency(d.salary.total)}</td>
                    </tr>);

              })}
                <tr className="bg-gray-50 font-semibold">
                  <td className="py-3 px-4">Total</td>
                  <td className="py-3 px-4 text-center">{aggregatedStats.total}</td>
                  <td className="py-3 px-4 text-center text-green-600">{aggregatedStats.active}</td>
                  <td className="py-3 px-4 text-center text-orange-600">{aggregatedStats.onLeave}</td>
                  <td className="py-3 px-4 text-center"><Badge variant="info">{avgAttendance}%</Badge></td>
                  <td className="py-3 px-4 text-center">{aggregatedStats.teaching}</td>
                  <td className="py-3 px-4 text-center">{aggregatedStats.administrative + aggregatedStats.support + aggregatedStats.special}</td>
                  <td className="py-3 px-4 text-center text-blue-600">{formatCurrency(aggregatedStats.totalSalary)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      }

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-6">
          {/* Staff Categories */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Staff Categories</h2>
              <Button variant="ghost" size="sm"><Eye className="w-4 h-4 mr-2" />View All</Button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {staffCategories.map((cat, idx) =>
              <div key={idx} className="p-4 bg-gray-50 rounded-xl hover:shadow-md transition-shadow">
                  <div className={`p-2 rounded-lg bg-${cat.color}-100 w-fit mb-3`}><cat.icon className={`w-5 h-5 text-${cat.color}-600`} /></div>
                  <h3 className="text-2xl font-bold text-gray-900">{cat.count}</h3>
                  <p className="text-sm text-gray-600">{cat.category}</p>
                  {activeBranches.length > 1 &&
                <div className="mt-2 flex flex-wrap gap-1">
                      {activeBranches.slice(0, 3).map((branch) =>
                  <span key={branch.id} className={`px-2 py-0.5 rounded text-xs text-white ${branch.color}`}>
                          {branchData[branch.id].categories[cat.key]}
                        </span>
                  )}
                    </div>
                }
                </div>
              )}
            </div>
          </Card>

          {/* Department Distribution by Branch */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Department-wise Distribution</h2>
              <Button variant="ghost" size="sm">View Details<ChevronRight className="w-4 h-4 ml-1" /></Button>
            </div>
            <div className="space-y-4">
              {activeBranches.map((branch) =>
              <div key={branch.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-3 h-3 rounded-full ${branch.color}`} />
                    <h3 className="font-semibold text-gray-900">{branch.name}</h3>
                    <span className="text-sm text-gray-500">({branch.city})</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {branchData[branch.id].departments.map((dept: any, idx: number) =>
                  <div key={idx} className="bg-white p-3 rounded-lg">
                        <p className="font-medium text-gray-900">{dept.name}</p>
                        <p className="text-xs text-gray-500">Head: {dept.head}</p>
                        <p className="text-lg font-bold text-blue-600 mt-1">{dept.count}</p>
                      </div>
                  )}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Attendance & Leave Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Today's Attendance</h2>
                <Badge variant="success">Live</Badge>
              </div>
              <div className="space-y-3">
                {activeBranches.map((branch) => {
                  const d = branchData[branch.id];
                  const attendancePercent = (d.stats.active / d.stats.total * 100).toFixed(0);
                  return (
                    <div key={branch.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${branch.color}`} />
                          <span className="font-medium text-sm">{branch.name}</span>
                        </div>
                        <span className="text-sm font-bold text-green-600">{attendancePercent}%</span>
                      </div>
                      <div className="flex gap-4 text-xs">
                        <span className="text-green-600">Present: {d.stats.active}</span>
                        <span className="text-orange-600">Leave: {d.stats.onLeave}</span>
                        <span className="text-gray-600">Total: {d.stats.total}</span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full bg-green-500" style={{ width: `${attendancePercent}%` }} />
                      </div>
                    </div>);

                })}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Leave Utilization</h2>
                <span className="text-xs text-gray-500">This Year</span>
              </div>
              <div className="space-y-4">
                {[
                { type: 'Casual Leave', value: aggregatedStats.casualLeaves, max: aggregatedStats.total * 8, color: 'bg-blue-500' },
                { type: 'Sick Leave', value: aggregatedStats.sickLeaves, max: aggregatedStats.total * 4, color: 'bg-red-500' },
                { type: 'Earned Leave', value: aggregatedStats.earnedLeaves, max: aggregatedStats.total * 5, color: 'bg-green-500' }].
                map((leave, idx) =>
                <div key={idx}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{leave.type}</span>
                      <span className="text-xs text-gray-500">{leave.value} / {leave.max}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${leave.color}`} style={{ width: `${Math.min(leave.value / leave.max * 100, 100)}%` }} />
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-xl font-bold text-gray-900">{aggregatedStats.casualLeaves + aggregatedStats.sickLeaves + aggregatedStats.earnedLeaves}</p>
                  <p className="text-xs text-gray-500">Total Taken</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-green-600">{Math.max(0, aggregatedStats.total * 17 - (aggregatedStats.casualLeaves + aggregatedStats.sickLeaves + aggregatedStats.earnedLeaves))}</p>
                  <p className="text-xs text-gray-500">Available</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Salary Overview by Branch */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Salary Overview by Branch</h2>
              <span className="text-xs text-gray-500">This Month</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeBranches.map((branch) => {
                const d = branchData[branch.id];
                return (
                  <div key={branch.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-3 h-3 rounded-full ${branch.color}`} />
                      <span className="font-medium">{branch.name}</span>
                    </div>
                    <p className="text-xl font-bold text-blue-600">{formatCurrency(d.salary.total)}</p>
                    <p className="text-xs text-gray-500">Avg: {formatCurrency(d.salary.avg)}/employee</p>
                  </div>);

              })}
            </div>
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Total Monthly Payroll</p>
                  <p className="text-2xl font-bold text-blue-700">{formatCurrency(aggregatedStats.totalSalary)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Average Salary</p>
                  <p className="text-xl font-bold text-gray-700">{aggregatedStats.total > 0 ? formatCurrency(Math.round(aggregatedStats.totalSalary / aggregatedStats.total)) : '₹0'}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Leave Requests */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Leave Requests</h2>
              <Badge variant="warning">{filteredData.leaveRequests.filter((r) => r.status === 'Pending').length} Pending</Badge>
            </div>
            <div className="space-y-3">
              {filteredData.leaveRequests.length > 0 ? filteredData.leaveRequests.map((request, idx) =>
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-semibold text-gray-600">{request.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{request.name}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className={`w-2 h-2 rounded-full ${getBranchColor(request.branch)}`} />
                        {getBranchName(request.branch)} • {request.type} • {request.days} day(s)
                      </div>
                    </div>
                  </div>
                  <Badge variant={request.status === 'Approved' ? 'success' : 'warning'}>{request.status}</Badge>
                </div>
              ) :
              <p className="text-gray-500 text-center py-4">No leave requests for selected branches</p>
              }
            </div>
            <Button variant="outline" className="w-full mt-4" size="sm">View All Requests</Button>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Pending Approvals */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Pending Approvals</h2>
              <Badge variant="danger">{commonData.pendingApprovals.reduce((acc, item) => acc + item.urgent, 0)} Urgent</Badge>
            </div>
            <div className="space-y-3">
              {commonData.pendingApprovals.map((item, idx) =>
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm"><item.icon className="w-4 h-4 text-gray-600" /></div>
                    <span className="text-sm font-medium">{item.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">{item.count}</span>
                    {item.urgent > 0 && <span className="w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full">{item.urgent}</span>}
                  </div>
                </div>
              )}
            </div>
            <Button variant="primary" className="w-full mt-4" size="sm">Review All</Button>
          </Card>

          {/* Birthdays */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <Cake className="w-5 h-5 text-pink-500" />Upcoming Birthdays
            </h2>
            <div className="space-y-3">
              {filteredData.birthdays.length > 0 ? filteredData.birthdays.map((person, idx) =>
              <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg ${person.daysLeft === 0 ? 'bg-pink-50 border border-pink-200' : 'bg-gray-50'}`}>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-semibold">{person.name.charAt(0)}</div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{person.name}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <span className={`w-2 h-2 rounded-full ${getBranchColor(person.branch)}`} />
                      {person.designation}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{person.date}</p>
                    {person.daysLeft === 0 ? <Badge variant="success" className="text-xs">Today! 🎂</Badge> : <p className="text-xs text-gray-500">{person.daysLeft} days</p>}
                  </div>
                </div>
              ) :
              <p className="text-gray-500 text-center py-4">No upcoming birthdays</p>
              }
            </div>
          </Card>

          {/* Work Anniversaries */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-yellow-500" />Work Anniversaries
            </h2>
            <div className="space-y-3">
              {filteredData.anniversaries.length > 0 ? filteredData.anniversaries.map((person, idx) =>
              <div key={idx} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-semibold">{person.years}</div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{person.name}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <span className={`w-2 h-2 rounded-full ${getBranchColor(person.branch)}`} />
                      {person.designation}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{person.date}</p>
                    <p className="text-xs text-yellow-600">{person.years} years</p>
                  </div>
                </div>
              ) :
              <p className="text-gray-500 text-center py-4">No upcoming anniversaries</p>
              }
            </div>
          </Card>

          {/* Upcoming Events */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <CalendarDays className="w-5 h-5 text-blue-500" />Upcoming Events
            </h2>
            <div className="space-y-3">
              {filteredData.events.length > 0 ? filteredData.events.map((event, idx) =>
              <div key={idx} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="p-2 bg-white rounded-lg">
                    {event.type === 'meeting' && <Users className="w-4 h-4 text-blue-600" />}
                    {event.type === 'training' && <BookOpen className="w-4 h-4 text-green-600" />}
                    {event.type === 'review' && <ClipboardCheck className="w-4 h-4 text-purple-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{event.event}</p>
                    <p className="text-xs text-gray-500">{event.date} • {event.time}</p>
                  </div>
                  {event.branch !== 'all' && <span className={`w-2 h-2 rounded-full ${getBranchColor(event.branch)}`} />}
                </div>
              ) :
              <p className="text-gray-500 text-center py-4">No upcoming events</p>
              }
            </div>
          </Card>

          {/* Recent Activities */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-green-500" />Recent Activities
            </h2>
            <div className="space-y-3">
              {filteredData.activities.length > 0 ? filteredData.activities.map((activity, idx) =>
              <div key={idx} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                  <div className={`p-2 rounded-full ${activity.type === 'join' ? 'bg-green-100 text-green-600' : activity.type === 'leave' ? 'bg-blue-100 text-blue-600' : activity.type === 'salary' ? 'bg-purple-100 text-purple-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    {activity.type === 'join' && <UserPlus className="w-3 h-3" />}
                    {activity.type === 'leave' && <Calendar className="w-3 h-3" />}
                    {activity.type === 'salary' && <IndianRupee className="w-3 h-3" />}
                    {activity.type === 'training' && <BookOpen className="w-3 h-3" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      {activity.branch !== 'all' && <span className={`w-2 h-2 rounded-full ${getBranchColor(activity.branch)}`} />}
                      {activity.name}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ) :
              <p className="text-gray-500 text-center py-4">No recent activities</p>
              }
            </div>
            <Button variant="ghost" className="w-full mt-4" size="sm">View All</Button>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
              { icon: UserPlus, label: 'Add Employee', color: 'text-blue-600' },
              { icon: Calendar, label: 'Mark Attendance', color: 'text-green-600' },
              { icon: FileText, label: 'Generate Report', color: 'text-purple-600' },
              { icon: IndianRupee, label: 'Process Payroll', color: 'text-orange-600' },
              { icon: Mail, label: 'Send Notice', color: 'text-red-600' },
              { icon: BookOpen, label: 'Schedule Training', color: 'text-teal-600' }].
              map((action, idx) =>
              <Button key={idx} variant="outline" size="sm" className="flex-col h-20 gap-2">
                  <action.icon className={`w-5 h-5 ${action.color}`} />
                  <span className="text-xs">{action.label}</span>
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Attendance Trend */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Monthly Attendance Trend</h2>
          <div className="flex items-center gap-4 flex-wrap">
            {activeBranches.map((branch) =>
            <div key={branch.id} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${branch.color}`} />
                <span className="text-sm text-gray-600">{branch.name}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-end justify-between h-48 gap-4">
          {['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'].map((month, idx) =>
          <div key={idx} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-gray-100 rounded-t-lg relative h-40 flex items-end gap-0.5">
                {activeBranches.map((branch, bIdx) => {
                const percentage = 88 + (Math.sin(idx + bIdx) + 1) * 5;
                return (
                  <div key={bIdx} className={`flex-1 ${branch.color} rounded-t transition-all`} style={{ height: `${percentage}%` }} title={`${branch.name}: ${percentage.toFixed(1)}%`} />);

              })}
              </div>
              <span className="text-sm font-medium text-gray-600">{month}</span>
            </div>
          )}
        </div>
      </Card>
    </div>);

}

export default EisConsolidatedDashboard;