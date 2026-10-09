import React, { useState, useMemo } from 'react';
import {
  LayoutDashboardIcon, UsersIcon, CalendarIcon, TrendingUpIcon, BellIcon, InfoIcon, XIcon,
  GraduationCapIcon, ClipboardCheckIcon, CreditCardIcon, AwardIcon, BriefcaseIcon, ClockIcon,
  CheckCircleIcon, AlertTriangleIcon, ArrowUpIcon, ArrowDownIcon, PieChartIcon, BarChart3Icon,
  ActivityIcon, TargetIcon, AlertCircleIcon, FileTextIcon, UserCheckIcon, IndianRupeeIcon,
  CircleDollarSignIcon, UserXIcon, ListTodoIcon, CalendarCheckIcon, CalendarXIcon, ReceiptIcon,
  ChevronDownIcon, BuildingIcon, FilterIcon, CheckIcon } from
'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

interface KPIInfo {
  title: string;
  description: string;
  whyItMatters: string;
  actionRequired: string[];
  trend?: string;
}

interface BranchData {
  students: number;
  employees: number;
  feesCollected: number;
  pendingFees: number;
  expenses: number;
  surplus: number;
  scholarships: number;
  studentAttendance: number;
  staffAttendance: number;
  transferred: number;
  pendingCharges: number;
  pendingTasks: number;
}

const branches = [
{ id: 'main', name: 'Main Campus', color: 'blue' },
{ id: 'north', name: 'North Branch', color: 'emerald' },
{ id: 'south', name: 'South Branch', color: 'violet' },
{ id: 'east', name: 'East Branch', color: 'amber' }];


const batches = ['2024-25', '2023-24', '2022-23', '2021-22'];

const branchWiseData: Record<string, Record<string, BranchData>> = {
  '2024-25': {
    main: { students: 1247, employees: 82, feesCollected: 840000, pendingFees: 220000, expenses: 580000, surplus: 260000, scholarships: 120000, studentAttendance: 94.5, staffAttendance: 98.2, transferred: 8, pendingCharges: 75000, pendingTasks: 4 },
    north: { students: 623, employees: 42, feesCollected: 420000, pendingFees: 120000, expenses: 290000, surplus: 130000, scholarships: 60000, studentAttendance: 93.8, staffAttendance: 97.5, transferred: 6, pendingCharges: 45000, pendingTasks: 3 },
    south: { students: 512, employees: 35, feesCollected: 350000, pendingFees: 95000, expenses: 240000, surplus: 110000, scholarships: 40000, studentAttendance: 94.8, staffAttendance: 98.0, transferred: 5, pendingCharges: 35000, pendingTasks: 3 },
    east: { students: 465, employees: 27, feesCollected: 230000, pendingFees: 85000, expenses: 170000, surplus: 60000, scholarships: 20000, studentAttendance: 93.2, staffAttendance: 97.8, transferred: 4, pendingCharges: 25000, pendingTasks: 2 }
  },
  '2023-24': {
    main: { students: 1180, employees: 78, feesCollected: 780000, pendingFees: 180000, expenses: 540000, surplus: 240000, scholarships: 100000, studentAttendance: 93.2, staffAttendance: 97.8, transferred: 12, pendingCharges: 65000, pendingTasks: 0 },
    north: { students: 590, employees: 40, feesCollected: 380000, pendingFees: 100000, expenses: 270000, surplus: 110000, scholarships: 50000, studentAttendance: 92.5, staffAttendance: 97.0, transferred: 8, pendingCharges: 40000, pendingTasks: 0 },
    south: { students: 480, employees: 32, feesCollected: 320000, pendingFees: 80000, expenses: 220000, surplus: 100000, scholarships: 35000, studentAttendance: 93.5, staffAttendance: 97.5, transferred: 7, pendingCharges: 30000, pendingTasks: 0 },
    east: { students: 420, employees: 24, feesCollected: 200000, pendingFees: 70000, expenses: 150000, surplus: 50000, scholarships: 15000, studentAttendance: 92.0, staffAttendance: 97.2, transferred: 6, pendingCharges: 20000, pendingTasks: 0 }
  },
  '2022-23': {
    main: { students: 1100, employees: 75, feesCollected: 720000, pendingFees: 150000, expenses: 500000, surplus: 220000, scholarships: 90000, studentAttendance: 92.8, staffAttendance: 97.5, transferred: 15, pendingCharges: 55000, pendingTasks: 0 },
    north: { students: 550, employees: 38, feesCollected: 350000, pendingFees: 90000, expenses: 250000, surplus: 100000, scholarships: 45000, studentAttendance: 91.8, staffAttendance: 96.8, transferred: 10, pendingCharges: 35000, pendingTasks: 0 },
    south: { students: 450, employees: 30, feesCollected: 300000, pendingFees: 70000, expenses: 200000, surplus: 100000, scholarships: 30000, studentAttendance: 93.0, staffAttendance: 97.2, transferred: 8, pendingCharges: 25000, pendingTasks: 0 },
    east: { students: 380, employees: 22, feesCollected: 180000, pendingFees: 60000, expenses: 130000, surplus: 50000, scholarships: 12000, studentAttendance: 91.5, staffAttendance: 96.5, transferred: 7, pendingCharges: 18000, pendingTasks: 0 }
  },
  '2021-22': {
    main: { students: 1020, employees: 72, feesCollected: 680000, pendingFees: 130000, expenses: 480000, surplus: 200000, scholarships: 80000, studentAttendance: 91.5, staffAttendance: 97.0, transferred: 18, pendingCharges: 50000, pendingTasks: 0 },
    north: { students: 510, employees: 35, feesCollected: 320000, pendingFees: 80000, expenses: 230000, surplus: 90000, scholarships: 40000, studentAttendance: 90.8, staffAttendance: 96.5, transferred: 12, pendingCharges: 32000, pendingTasks: 0 },
    south: { students: 420, employees: 28, feesCollected: 280000, pendingFees: 65000, expenses: 190000, surplus: 90000, scholarships: 25000, studentAttendance: 92.2, staffAttendance: 96.8, transferred: 10, pendingCharges: 22000, pendingTasks: 0 },
    east: { students: 350, employees: 20, feesCollected: 160000, pendingFees: 55000, expenses: 120000, surplus: 40000, scholarships: 10000, studentAttendance: 90.5, staffAttendance: 96.2, transferred: 8, pendingCharges: 15000, pendingTasks: 0 }
  }
};

const tasksData = [
{ id: '1', title: 'Review admission applications for Class 1', priority: 'high' as const, dueDate: 'Today', assignedBy: 'Principal', status: 'in-progress' as const, module: 'Admissions', branch: 'main' },
{ id: '2', title: 'Approve pending leave requests (8)', priority: 'high' as const, dueDate: 'Today', assignedBy: 'HR Manager', status: 'pending' as const, module: 'HR', branch: 'north' },
{ id: '3', title: 'Generate monthly fee collection report', priority: 'high' as const, dueDate: 'Today', assignedBy: 'Accountant', status: 'pending' as const, module: 'Finance', branch: 'main' },
{ id: '4', title: 'Review scholarship applications', priority: 'medium' as const, dueDate: 'Tomorrow', assignedBy: 'Principal', status: 'pending' as const, module: 'Scholarships', branch: 'south' },
{ id: '5', title: 'Update student transfer records', priority: 'medium' as const, dueDate: '2 days', assignedBy: 'Office Manager', status: 'pending' as const, module: 'Student Records', branch: 'east' },
{ id: '6', title: 'Prepare quarterly expense analysis', priority: 'medium' as const, dueDate: '3 days', assignedBy: 'Director', status: 'pending' as const, module: 'Finance', branch: 'main' },
{ id: '7', title: 'Verify document submissions', priority: 'low' as const, dueDate: '5 days', assignedBy: 'Admissions Head', status: 'pending' as const, module: 'Admissions', branch: 'north' },
{ id: '8', title: 'Send attendance alerts to parents', priority: 'low' as const, dueDate: '1 week', assignedBy: 'Class Teacher', status: 'pending' as const, module: 'Attendance', branch: 'south' }];


const recentActivity = [
{ text: 'Fee receipt #4521 generated for Rahul Sharma', time: '2 min ago', type: 'finance', icon: ReceiptIcon, branch: 'main' },
{ text: 'New admission inquiry from Priya Patel', time: '15 min ago', type: 'admission', icon: GraduationCapIcon, branch: 'north' },
{ text: 'Leave approved for Mr. Desai (2 days)', time: '1 hr ago', type: 'hr', icon: CalendarIcon, branch: 'main' },
{ text: 'Monthly attendance report generated', time: '2 hrs ago', type: 'attendance', icon: CalendarCheckIcon, branch: 'south' },
{ text: 'Scholarship disbursement completed', time: '3 hrs ago', type: 'finance', icon: AwardIcon, branch: 'east' },
{ text: 'Transfer certificate issued for Amit Kumar', time: '4 hrs ago', type: 'transfer', icon: FileTextIcon, branch: 'main' },
{ text: 'Expense voucher approved for ₹25,000', time: '5 hrs ago', type: 'expense', icon: CreditCardIcon, branch: 'north' }];


const formatCurrency = (amount: number) => amount >= 100000 ? `₹${(amount / 100000).toFixed(1)}L` : `₹${(amount / 1000).toFixed(0)}K`;

const kpiConfig = [
{ id: 'students', label: 'Total Students', key: 'students' as keyof BranchData, icon: GraduationCapIcon, color: 'blue', format: (v: number) => v.toLocaleString() },
{ id: 'employees', label: 'Active Employees', key: 'employees' as keyof BranchData, icon: BriefcaseIcon, color: 'violet', format: (v: number) => v.toString() },
{ id: 'feesCollected', label: 'Fees Collected', key: 'feesCollected' as keyof BranchData, icon: IndianRupeeIcon, color: 'emerald', format: formatCurrency },
{ id: 'pendingFees', label: 'Pending Fees', key: 'pendingFees' as keyof BranchData, icon: ReceiptIcon, color: 'amber', format: formatCurrency },
{ id: 'expenses', label: 'Monthly Expenses', key: 'expenses' as keyof BranchData, icon: CreditCardIcon, color: 'red', format: formatCurrency },
{ id: 'surplus', label: 'Net Surplus', key: 'surplus' as keyof BranchData, icon: TrendingUpIcon, color: 'teal', format: formatCurrency },
{ id: 'scholarships', label: 'Scholarships', key: 'scholarships' as keyof BranchData, icon: AwardIcon, color: 'purple', format: formatCurrency },
{ id: 'studentAttendance', label: 'Student Attendance', key: 'studentAttendance' as keyof BranchData, icon: CalendarCheckIcon, color: 'cyan', format: (v: number) => `${v}%` },
{ id: 'staffAttendance', label: 'Staff Attendance', key: 'staffAttendance' as keyof BranchData, icon: UserCheckIcon, color: 'indigo', format: (v: number) => `${v}%` },
{ id: 'transferred', label: 'Transferred Out', key: 'transferred' as keyof BranchData, icon: UserXIcon, color: 'orange', format: (v: number) => v.toString() },
{ id: 'pendingCharges', label: 'Pending Charges', key: 'pendingCharges' as keyof BranchData, icon: CircleDollarSignIcon, color: 'rose', format: formatCurrency },
{ id: 'pendingTasks', label: 'Pending Tasks', key: 'pendingTasks' as keyof BranchData, icon: ListTodoIcon, color: 'pink', format: (v: number) => v.toString() }];


const colorMap: Record<string, {text: string;bg: string;border: string;}> = {
  blue: { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  emerald: { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  violet: { text: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200' },
  amber: { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  red: { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  teal: { text: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200' },
  purple: { text: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  cyan: { text: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-200' },
  indigo: { text: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  orange: { text: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  rose: { text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
  pink: { text: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-200' }
};

const branchColors: Record<string, string> = { main: 'bg-blue-500', north: 'bg-emerald-500', south: 'bg-violet-500', east: 'bg-amber-500' };

export function UserDashboard() {
  const [infoModal, setInfoModal] = useState<KPIInfo | null>(null);
  const [selectedBranches, setSelectedBranches] = useState<string[]>(branches.map((b) => b.id));
  const [selectedBatch, setSelectedBatch] = useState(batches[0]);
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [showBatchDropdown, setShowBatchDropdown] = useState(false);

  const filteredData = useMemo(() => {
    const batchData = branchWiseData[selectedBatch] || {};
    return selectedBranches.map((branchId) => ({
      branch: branches.find((b) => b.id === branchId)!,
      data: batchData[branchId] || {} as BranchData
    })).filter((item) => item.branch);
  }, [selectedBranches, selectedBatch]);

  const totals = useMemo(() => {
    const initial: BranchData = { students: 0, employees: 0, feesCollected: 0, pendingFees: 0, expenses: 0, surplus: 0, scholarships: 0, studentAttendance: 0, staffAttendance: 0, transferred: 0, pendingCharges: 0, pendingTasks: 0 };
    const sum = filteredData.reduce((acc, { data }) => {
      Object.keys(initial).forEach((key) => {acc[key as keyof BranchData] += data[key as keyof BranchData] || 0;});
      return acc;
    }, { ...initial });
    if (filteredData.length > 0) {
      sum.studentAttendance = +(sum.studentAttendance / filteredData.length).toFixed(1);
      sum.staffAttendance = +(sum.staffAttendance / filteredData.length).toFixed(1);
    }
    return sum;
  }, [filteredData]);

  const toggleBranch = (branchId: string) => {
    setSelectedBranches((prev) => prev.includes(branchId) ? prev.filter((id) => id !== branchId) : [...prev, branchId]);
  };

  const selectAllBranches = () => setSelectedBranches(branches.map((b) => b.id));

  const filteredTasks = tasksData.filter((t) => selectedBranches.includes(t.branch));
  const filteredActivity = recentActivity.filter((a) => selectedBranches.includes(a.branch));

  const quickActions = [
  { label: 'New Admission', icon: GraduationCapIcon, color: 'text-blue-600 bg-blue-50' },
  { label: 'Collect Fee', icon: IndianRupeeIcon, color: 'text-emerald-600 bg-emerald-50' },
  { label: 'Mark Attendance', icon: CalendarCheckIcon, color: 'text-amber-600 bg-amber-50' },
  { label: 'Add Employee', icon: BriefcaseIcon, color: 'text-violet-600 bg-violet-50' },
  { label: 'Generate Report', icon: FileTextIcon, color: 'text-pink-600 bg-pink-50' },
  { label: 'Send Notice', icon: BellIcon, color: 'text-cyan-600 bg-cyan-50' },
  { label: 'Add Expense', icon: CreditCardIcon, color: 'text-red-600 bg-red-50' },
  { label: 'Issue TC', icon: FileTextIcon, color: 'text-orange-600 bg-orange-50' },
  { label: 'Apply Scholarship', icon: AwardIcon, color: 'text-purple-600 bg-purple-50' },
  { label: 'Approve Leave', icon: CalendarXIcon, color: 'text-teal-600 bg-teal-50' },
  { label: 'View Defaulters', icon: AlertCircleIcon, color: 'text-rose-600 bg-rose-50' },
  { label: 'All Reports', icon: BarChart3Icon, color: 'text-indigo-600 bg-indigo-50' }];


  return (
    <div className="w-full min-h-full bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <LayoutDashboardIcon className="h-6 w-6 text-blue-600" />
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">Welcome back! Here's a comprehensive overview of your institution.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Batch Filter */}
            <div className="relative">
              <button onClick={() => {setShowBatchDropdown(!showBatchDropdown);setShowBranchDropdown(false);}}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
                <CalendarIcon className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">{selectedBatch}</span>
                <ChevronDownIcon className="w-4 h-4 text-gray-400" />
              </button>
              {showBatchDropdown &&
              <div className="absolute top-full mt-1 right-0 bg-white border rounded-lg shadow-lg z-20 min-w-[140px]">
                  {batches.map((batch) =>
                <button key={batch} onClick={() => {setSelectedBatch(batch);setShowBatchDropdown(false);}}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${selectedBatch === batch ? 'bg-blue-50 text-blue-600' : ''}`}>
                      {batch}
                    </button>
                )}
                </div>
              }
            </div>
            {/* Branch Filter */}
            <div className="relative">
              <button onClick={() => {setShowBranchDropdown(!showBranchDropdown);setShowBatchDropdown(false);}}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
                <BuildingIcon className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">
                  {selectedBranches.length === branches.length ? 'All Branches' : `${selectedBranches.length} Branch${selectedBranches.length > 1 ? 'es' : ''}`}
                </span>
                <ChevronDownIcon className="w-4 h-4 text-gray-400" />
              </button>
              {showBranchDropdown &&
              <div className="absolute top-full mt-1 right-0 bg-white border rounded-lg shadow-lg z-20 min-w-[180px]">
                  <button onClick={selectAllBranches} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 border-b flex items-center gap-2">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedBranches.length === branches.length ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                      {selectedBranches.length === branches.length && <CheckIcon className="w-3 h-3 text-white" />}
                    </div>
                    All Branches
                  </button>
                  {branches.map((branch) =>
                <button key={branch.id} onClick={() => toggleBranch(branch.id)}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedBranches.includes(branch.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                        {selectedBranches.includes(branch.id) && <CheckIcon className="w-3 h-3 text-white" />}
                      </div>
                      <span className={`w-2 h-2 rounded-full ${branchColors[branch.id]}`} />
                      {branch.name}
                    </button>
                )}
                </div>
              }
            </div>
            <Button variant="primary" size="sm">
              <BellIcon className="w-4 h-4 mr-2" />Notifications<Badge variant="danger" className="ml-2">5</Badge>
            </Button>
          </div>
        </div>

        {/* Selected Filters Display */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500">Showing data for:</span>
          <Badge variant="primary">{selectedBatch}</Badge>
          {selectedBranches.map((branchId) => {
            const branch = branches.find((b) => b.id === branchId);
            return branch && <Badge key={branchId} variant="secondary" className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${branchColors[branchId]}`} />{branch.name}
            </Badge>;
          })}
        </div>

        {/* Summary Cards with Totals */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-100 text-sm">Today's Overview</span>
              <CalendarIcon className="w-5 h-5 text-blue-200" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between"><span className="text-blue-100">Total Students</span><span className="font-bold">{totals.students.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-blue-100">Total Staff</span><span className="font-bold">{totals.employees}</span></div>
              <div className="flex justify-between"><span className="text-blue-100">Avg Attendance</span><span className="font-bold">{totals.studentAttendance}%</span></div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-emerald-100 text-sm">Financial Summary</span>
              <TrendingUpIcon className="w-5 h-5 text-emerald-200" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between"><span className="text-emerald-100">Collected</span><span className="font-bold">{formatCurrency(totals.feesCollected)}</span></div>
              <div className="flex justify-between"><span className="text-emerald-100">Expenses</span><span className="font-bold">{formatCurrency(totals.expenses)}</span></div>
              <div className="flex justify-between"><span className="text-emerald-100">Surplus</span><span className="font-bold">{formatCurrency(totals.surplus)}</span></div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-amber-100 text-sm">Pending Actions</span>
              <AlertTriangleIcon className="w-5 h-5 text-amber-200" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between"><span className="text-amber-100">Pending Fees</span><span className="font-bold">{formatCurrency(totals.pendingFees)}</span></div>
              <div className="flex justify-between"><span className="text-amber-100">Pending Charges</span><span className="font-bold">{formatCurrency(totals.pendingCharges)}</span></div>
              <div className="flex justify-between"><span className="text-amber-100">Tasks</span><span className="font-bold">{totals.pendingTasks}</span></div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-100 text-sm">Scholarships & Transfers</span>
              <AwardIcon className="w-5 h-5 text-purple-200" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between"><span className="text-purple-100">Scholarships</span><span className="font-bold">{formatCurrency(totals.scholarships)}</span></div>
              <div className="flex justify-between"><span className="text-purple-100">Transferred</span><span className="font-bold">{totals.transferred}</span></div>
              <div className="flex justify-between"><span className="text-purple-100">Staff Attendance</span><span className="font-bold">{totals.staffAttendance}%</span></div>
            </div>
          </Card>
        </div>

        {/* Branch-wise KPI Comparison */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TargetIcon className="w-5 h-5 text-blue-600" />
              Branch-wise Performance Comparison
            </h2>
            <button onClick={() => setInfoModal({ title: 'Branch-wise Comparison', description: 'Compare key metrics across selected branches.', whyItMatters: 'Helps identify high and low performing branches for strategic decisions.', actionRequired: ['Review underperforming branches', 'Share best practices from top performers', 'Allocate resources based on needs'] })}
            className="p-1 rounded-full hover:bg-gray-100"><InfoIcon className="w-4 h-4 text-gray-400" /></button>
          </div>
          
          {selectedBranches.length > 0 ?
          <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Metric</th>
                    {filteredData.map(({ branch }) =>
                  <th key={branch.id} className="text-right py-3 px-2 font-semibold">
                        <div className="flex items-center justify-end gap-2">
                          <span className={`w-3 h-3 rounded-full ${branchColors[branch.id]}`} />
                          <span className="text-gray-700">{branch.name}</span>
                        </div>
                      </th>
                  )}
                    {selectedBranches.length > 1 && <th className="text-right py-3 px-2 font-semibold text-blue-600">Total</th>}
                  </tr>
                </thead>
                <tbody>
                  {kpiConfig.map((kpi) =>
                <tr key={kpi.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <div className={`${colorMap[kpi.color].bg} rounded p-1.5`}>
                            <kpi.icon className={`w-4 h-4 ${colorMap[kpi.color].text}`} />
                          </div>
                          <span className="font-medium text-gray-700">{kpi.label}</span>
                        </div>
                      </td>
                      {filteredData.map(({ branch, data }) =>
                  <td key={branch.id} className="text-right py-3 px-2 font-semibold text-gray-900">
                          {kpi.format(data[kpi.key] || 0)}
                        </td>
                  )}
                      {selectedBranches.length > 1 &&
                  <td className="text-right py-3 px-2 font-bold text-blue-600">
                          {kpi.format(totals[kpi.key])}
                        </td>
                  }
                    </tr>
                )}
                </tbody>
              </table>
            </div> :

          <div className="text-center py-8 text-gray-500">Please select at least one branch to view data.</div>
          }
        </Card>

        {/* Visual Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Fee Collection by Branch */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <BarChart3Icon className="w-4 h-4 text-blue-600" />Fee Collection by Branch
              </h3>
            </div>
            <div className="space-y-3">
              {filteredData.map(({ branch, data }) => {
                const total = data.feesCollected + data.pendingFees;
                const collectedPercent = total > 0 ? data.feesCollected / total * 100 : 0;
                return (
                  <div key={branch.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${branchColors[branch.id]}`} />{branch.name}</span>
                      <span className="font-medium">{formatCurrency(data.feesCollected)} / {formatCurrency(total)}</span>
                    </div>
                    <div className="h-6 bg-gray-100 rounded-lg overflow-hidden flex">
                      <div className={`${branchColors[branch.id]} transition-all flex items-center justify-end pr-2`} style={{ width: `${collectedPercent}%` }}>
                        <span className="text-xs text-white font-medium">{collectedPercent.toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>);

              })}
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t">
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-gray-400 rounded" /><span className="text-xs text-gray-500">Target</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded" /><span className="text-xs text-gray-500">Collected</span></div>
            </div>
          </Card>

          {/* Attendance Comparison */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <ActivityIcon className="w-4 h-4 text-emerald-600" />Attendance by Branch
              </h3>
            </div>
            <div className="flex items-end justify-around h-48 gap-4">
              {filteredData.map(({ branch, data }) =>
              <div key={branch.id} className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full flex gap-1 items-end h-36">
                    <div className="flex-1 bg-blue-400 rounded-t-lg transition-all" style={{ height: `${data.studentAttendance}%` }}>
                      <div className="text-xs text-white text-center pt-1">{data.studentAttendance}%</div>
                    </div>
                    <div className="flex-1 bg-emerald-400 rounded-t-lg transition-all" style={{ height: `${data.staffAttendance}%` }}>
                      <div className="text-xs text-white text-center pt-1">{data.staffAttendance}%</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${branchColors[branch.id]}`} />
                    <span className="text-xs text-gray-500 truncate max-w-[60px]">{branch.name.split(' ')[0]}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t">
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-400 rounded" /><span className="text-xs text-gray-500">Students</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-400 rounded" /><span className="text-xs text-gray-500">Staff</span></div>
            </div>
          </Card>

          {/* Expense Distribution */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-purple-600" />Expense Distribution
              </h3>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative w-40 h-40 shrink-0">
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  {filteredData.reduce((acc, { branch, data }, index) => {
                    const totalExpense = filteredData.reduce((s, d) => s + d.data.expenses, 0);
                    const percentage = totalExpense > 0 ? data.expenses / totalExpense * 100 : 0;
                    const startAngle = acc.offset;
                    const angle = percentage / 100 * 360;
                    const endAngle = startAngle + angle;
                    const largeArcFlag = angle > 180 ? 1 : 0;
                    const [startX, startY] = [50 + 40 * Math.cos(startAngle * Math.PI / 180), 50 + 40 * Math.sin(startAngle * Math.PI / 180)];
                    const [endX, endY] = [50 + 40 * Math.cos(endAngle * Math.PI / 180), 50 + 40 * Math.sin(endAngle * Math.PI / 180)];
                    const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'];
                    acc.paths.push(<path key={branch.id} d={`M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY} Z`} fill={colors[index % colors.length]} className="hover:opacity-80" />);
                    acc.offset = endAngle;
                    return acc;
                  }, { paths: [] as React.ReactNode[], offset: 0 }).paths}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center"><p className="text-lg font-bold text-gray-900">{formatCurrency(totals.expenses)}</p><p className="text-xs text-gray-500">Total</p></div>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                {filteredData.map(({ branch, data }) =>
                <div key={branch.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 ${branchColors[branch.id]} rounded`} />
                      <span className="text-sm text-gray-600">{branch.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(data.expenses)}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Student Distribution */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <UsersIcon className="w-4 h-4 text-indigo-600" />Student Distribution
              </h3>
            </div>
            <div className="space-y-3">
              {filteredData.map(({ branch, data }) => {
                const maxStudents = Math.max(...filteredData.map((d) => d.data.students));
                const percent = maxStudents > 0 ? data.students / maxStudents * 100 : 0;
                return (
                  <div key={branch.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${branchColors[branch.id]}`} />{branch.name}</span>
                      <span className="font-medium">{data.students.toLocaleString()} students</span>
                    </div>
                    <div className="h-6 bg-gray-100 rounded-lg overflow-hidden">
                      <div className={`h-full ${branchColors[branch.id]} rounded-lg transition-all flex items-center pl-2`} style={{ width: `${percent}%` }}>
                        <span className="text-xs text-white font-medium">{(data.students / totals.students * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>);

              })}
            </div>
            <div className="mt-4 pt-4 border-t text-center">
              <span className="text-sm text-gray-500">Total: <span className="font-bold text-gray-900">{totals.students.toLocaleString()}</span> students</span>
            </div>
          </Card>
        </div>

        {/* Tasks and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <ClipboardCheckIcon className="w-4 h-4 text-pink-600" />My Tasks
                <Badge variant="warning" className="ml-2">{filteredTasks.filter((t) => t.status !== 'completed').length} Pending</Badge>
              </h3>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {filteredTasks.map((task) => {
                const branch = branches.find((b) => b.id === task.branch);
                return (
                  <div key={task.id} className={`p-3 rounded-lg border ${task.status === 'completed' ? 'bg-gray-50 border-gray-200' : task.priority === 'high' ? 'bg-red-50 border-red-200' : task.priority === 'medium' ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${task.status === 'completed' ? 'bg-emerald-500' : task.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-300'}`}>
                          {task.status === 'completed' ? <CheckCircleIcon className="w-3 h-3 text-white" /> : task.status === 'in-progress' ? <ClockIcon className="w-3 h-3 text-white" /> : <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{task.title}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <Badge variant={task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'secondary'}>{task.priority}</Badge>
                            {branch && <Badge variant="secondary" className="flex items-center gap-1"><span className={`w-1.5 h-1.5 rounded-full ${branchColors[branch.id]}`} />{branch.name}</Badge>}
                            <span className="text-xs text-gray-500">{task.module}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`text-xs font-medium shrink-0 ${task.dueDate === 'Today' ? 'text-red-600' : task.dueDate === 'Tomorrow' ? 'text-amber-600' : 'text-gray-500'}`}>Due: {task.dueDate}</span>
                    </div>
                  </div>);

              })}
            </div>
            <div className="flex justify-end mt-4 pt-4 border-t"><Button variant="outline" size="sm">View All Tasks</Button></div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <BellIcon className="w-4 h-4 text-amber-600" />Recent Activity
              </h3>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {filteredActivity.map((item, idx) => {
                const branch = branches.find((b) => b.id === item.branch);
                return (
                  <div key={idx} className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
                    <div className={`p-1.5 rounded-lg shrink-0 ${item.type === 'finance' ? 'bg-emerald-100' : item.type === 'admission' ? 'bg-blue-100' : item.type === 'hr' ? 'bg-violet-100' : item.type === 'attendance' ? 'bg-amber-100' : 'bg-gray-100'}`}>
                      <item.icon className={`w-3.5 h-3.5 ${item.type === 'finance' ? 'text-emerald-600' : item.type === 'admission' ? 'text-blue-600' : item.type === 'hr' ? 'text-violet-600' : item.type === 'attendance' ? 'text-amber-600' : 'text-gray-600'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 leading-tight">{item.text}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400">{item.time}</span>
                        {branch && <Badge variant="secondary" className="text-xs py-0 flex items-center gap-1"><span className={`w-1.5 h-1.5 rounded-full ${branchColors[branch.id]}`} />{branch.name.split(' ')[0]}</Badge>}
                      </div>
                    </div>
                  </div>);

              })}
            </div>
            <div className="flex justify-end mt-4 pt-4 border-t"><Button variant="outline" size="sm">View All</Button></div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-5">
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <TargetIcon className="w-4 h-4 text-blue-600" />Quick Actions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {quickActions.map((action) =>
            <button key={action.label} className={`flex flex-col items-center gap-2 p-4 rounded-xl ${action.color} transition-all hover:scale-105 hover:shadow-md`}>
                <action.icon className="w-6 h-6" /><span className="text-xs font-medium text-center">{action.label}</span>
              </button>
            )}
          </div>
        </Card>
      </div>

      {/* Info Modal */}
      {infoModal &&
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={(handleCloseInfo) => setInfoModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><InfoIcon className="w-5 h-5 text-blue-600" />{infoModal.title}</h2>
              <button onClick={() => setInfoModal(null)} className="p-1 rounded-full hover:bg-gray-100"><XIcon className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div><h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">What is this?</h4><p className="text-sm text-gray-700 leading-relaxed">{infoModal.description}</p></div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2"><AlertCircleIcon className="w-4 h-4" />Why It Matters</h4>
                <p className="text-sm text-blue-700 leading-relaxed">{infoModal.whyItMatters}</p>
              </div>
              {infoModal.trend && <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100"><h4 className="text-sm font-bold text-emerald-800 mb-2 flex items-center gap-2"><TrendingUpIcon className="w-4 h-4" />Current Trend</h4><p className="text-sm text-emerald-700">{infoModal.trend}</p></div>}
              <div>
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2"><CheckCircleIcon className="w-4 h-4 text-amber-500" />Action Required</h4>
                <ul className="space-y-2">{infoModal.actionRequired.map((action, idx) => <li key={idx} className="flex items-start gap-2 text-sm text-gray-700"><span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{idx + 1}</span>{action}</li>)}</ul>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t px-6 py-4"><Button variant="primary" className="w-full" onClick={() => setInfoModal(null)}>Got It</Button></div>
          </div>
        </div>
      }
    </div>);

}