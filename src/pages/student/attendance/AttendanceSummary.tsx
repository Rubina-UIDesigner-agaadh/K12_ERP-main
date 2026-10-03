// AttendanceSummary.tsx
import React, { useState, useMemo } from 'react';
import {
  Users, CheckCircle, XCircle, Clock, TrendingUp, Calendar, AlertTriangle, BarChart3, Info, X, ChevronDown, ChevronUp, Filter, Download, RefreshCcw, Bell, UserCheck, UserX, CalendarDays, CalendarRange, Timer, TimerOff, Activity, Target, BookOpen, AlertCircle, Send, Eye, ChevronRight, ArrowUpRight, ArrowDownRight, Minus, Percent, Building2, Check, HelpCircle } from
'lucide-react';

// Constants
const BRANCHES = [
{ id: 'main', name: 'Main Campus', city: 'Delhi', color: 'bg-blue-500' },
{ id: 'north', name: 'North Branch', city: 'Noida', color: 'bg-green-500' },
{ id: 'south', name: 'South Branch', city: 'Gurgaon', color: 'bg-purple-500' },
{ id: 'east', name: 'East Branch', city: 'Faridabad', color: 'bg-orange-500' }];


const BATCHES = ['2024-25', '2023-24', '2022-23', '2021-22', '2020-21'];

// Branch-wise Attendance Data
const branchAttendanceData: Record<string, any> = {
  main: {
    totalStudents: 850, present: 795, absent: 35, late: 15, onLeave: 5, attendanceRate: 93.5, previousDayRate: 92.8, weeklyAverage: 93.2, monthlyAverage: 92.9,
    boys: { total: 450, present: 420, absent: 20, late: 8, percentage: 93.3 },
    girls: { total: 400, present: 375, absent: 15, late: 7, percentage: 93.8 },
    timeAnalysis: { onTime: 752, late15Min: 10, late30Min: 4, late1Hour: 1, earlyDeparture: 3 },
    departments: [
    { department: 'Primary (1-5)', total: 300, present: 285, percentage: 95.0 },
    { department: 'Middle (6-8)', total: 250, present: 232, percentage: 92.8 },
    { department: 'Secondary (9-10)', total: 180, present: 168, percentage: 93.3 },
    { department: 'Senior Secondary', total: 120, present: 110, percentage: 91.7 }],

    classes: [
    { className: 'Class 1', section: 'A', totalStudents: 42, present: 40, absent: 1, late: 1, onLeave: 0, percentage: 95.2, previousPercentage: 94.5 },
    { className: 'Class 1', section: 'B', totalStudents: 40, present: 38, absent: 1, late: 1, onLeave: 0, percentage: 95.0, previousPercentage: 95.2 },
    { className: 'Class 2', section: 'A', totalStudents: 45, present: 43, absent: 1, late: 1, onLeave: 0, percentage: 95.6, previousPercentage: 94.8 }],

    defaulters: [
    { name: 'Rahul Sharma', class: '5-A', attendance: 68, absences: 32, parentNotified: true, counselingDone: false },
    { name: 'Priya Patel', class: '7-B', attendance: 71, absences: 29, parentNotified: true, counselingDone: true }],

    recentAbsentees: [
    { name: 'Arjun Mehta', class: '4-A', reason: 'Sick Leave', notified: true },
    { name: 'Kavita Rao', class: '6-B', reason: 'Family Emergency', notified: true }],

    leaveRequests: [
    { name: 'Sanjay Verma', class: '7-A', type: 'Medical', from: '2025-02-25', to: '2025-02-27', status: 'pending' }],

    dailyTrend: [91.5, 93.8, 92.5, 94.5, 93.2, 92.8, 93.5]
  },
  north: {
    totalStudents: 620, present: 578, absent: 28, late: 12, onLeave: 2, attendanceRate: 93.2, previousDayRate: 92.5, weeklyAverage: 92.8, monthlyAverage: 92.5,
    boys: { total: 330, present: 308, absent: 15, late: 6, percentage: 93.3 },
    girls: { total: 290, present: 270, absent: 13, late: 6, percentage: 93.1 },
    timeAnalysis: { onTime: 548, late15Min: 8, late30Min: 3, late1Hour: 1, earlyDeparture: 2 },
    departments: [
    { department: 'Primary (1-5)', total: 220, present: 210, percentage: 95.5 },
    { department: 'Middle (6-8)', total: 180, present: 166, percentage: 92.2 },
    { department: 'Secondary (9-10)', total: 130, present: 120, percentage: 92.3 },
    { department: 'Senior Secondary', total: 90, present: 82, percentage: 91.1 }],

    classes: [
    { className: 'Class 1', section: 'A', totalStudents: 38, present: 36, absent: 1, late: 1, onLeave: 0, percentage: 94.7, previousPercentage: 93.8 },
    { className: 'Class 2', section: 'A', totalStudents: 40, present: 38, absent: 1, late: 1, onLeave: 0, percentage: 95.0, previousPercentage: 94.2 }],

    defaulters: [
    { name: 'Amit Kumar', class: '9-A', attendance: 72, absences: 28, parentNotified: false, counselingDone: false }],

    recentAbsentees: [
    { name: 'Ravi Joshi', class: '8-C', reason: 'Not Notified', notified: false }],

    leaveRequests: [
    { name: 'Meera Kapoor', class: '10-B', type: 'Family Function', from: '2025-02-26', to: '2025-02-28', status: 'approved' }],

    dailyTrend: [90.8, 93.2, 92.1, 93.8, 92.5, 92.0, 93.2]
  },
  south: {
    totalStudents: 580, present: 542, absent: 25, late: 11, onLeave: 2, attendanceRate: 93.4, previousDayRate: 93.0, weeklyAverage: 93.0, monthlyAverage: 92.7,
    boys: { total: 305, present: 285, absent: 13, late: 5, percentage: 93.4 },
    girls: { total: 275, present: 257, absent: 12, late: 6, percentage: 93.5 },
    timeAnalysis: { onTime: 512, late15Min: 7, late30Min: 3, late1Hour: 1, earlyDeparture: 2 },
    departments: [
    { department: 'Primary (1-5)', total: 200, present: 192, percentage: 96.0 },
    { department: 'Middle (6-8)', total: 170, present: 158, percentage: 92.9 },
    { department: 'Secondary (9-10)', total: 125, present: 116, percentage: 92.8 },
    { department: 'Senior Secondary', total: 85, present: 76, percentage: 89.4 }],

    classes: [
    { className: 'Class 1', section: 'A', totalStudents: 35, present: 34, absent: 0, late: 1, onLeave: 0, percentage: 97.1, previousPercentage: 96.5 },
    { className: 'Class 2', section: 'A', totalStudents: 38, present: 36, absent: 1, late: 1, onLeave: 0, percentage: 94.7, previousPercentage: 95.0 }],

    defaulters: [
    { name: 'Sneha Gupta', class: '3-B', attendance: 73, absences: 27, parentNotified: true, counselingDone: false }],

    recentAbsentees: [
    { name: 'Anita Das', class: '2-A', reason: 'Medical Appointment', notified: true }],

    leaveRequests: [
    { name: 'Raj Malhotra', class: '5-C', type: 'Sports Event', from: '2025-02-27', to: '2025-02-27', status: 'pending' }],

    dailyTrend: [91.2, 93.5, 92.8, 94.0, 93.5, 92.5, 93.4]
  },
  east: {
    totalStudents: 400, present: 374, absent: 18, late: 6, onLeave: 2, attendanceRate: 93.5, previousDayRate: 93.2, weeklyAverage: 93.3, monthlyAverage: 93.0,
    boys: { total: 210, present: 197, absent: 9, late: 3, percentage: 93.8 },
    girls: { total: 190, present: 177, absent: 9, late: 3, percentage: 93.2 },
    timeAnalysis: { onTime: 355, late15Min: 4, late30Min: 2, late1Hour: 0, earlyDeparture: 1 },
    departments: [
    { department: 'Primary (1-5)', total: 140, present: 135, percentage: 96.4 },
    { department: 'Middle (6-8)', total: 120, present: 112, percentage: 93.3 },
    { department: 'Secondary (9-10)', total: 85, present: 78, percentage: 91.8 },
    { department: 'Senior Secondary', total: 55, present: 49, percentage: 89.1 }],

    classes: [
    { className: 'Class 1', section: 'A', totalStudents: 32, present: 31, absent: 0, late: 1, onLeave: 0, percentage: 96.9, previousPercentage: 96.0 },
    { className: 'Class 2', section: 'A', totalStudents: 35, present: 33, absent: 1, late: 1, onLeave: 0, percentage: 94.3, previousPercentage: 93.8 }],

    defaulters: [
    { name: 'Vikram Singh', class: '8-A', attendance: 74, absences: 26, parentNotified: false, counselingDone: false }],

    recentAbsentees: [
    { name: 'Pooja Sharma', class: '5-B', reason: 'Fever', notified: true }],

    leaveRequests: [],
    dailyTrend: [92.0, 93.8, 93.0, 94.2, 93.8, 93.0, 93.5]
  }
};

// Helper Components
const InfoPanel = ({ isOpen, onClose, title, description, whyImportant, howToUse, benchmarks }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center"><Info className="w-5 h-5 text-blue-600" /></div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-gray-600 leading-relaxed">{description}</p>
          <div><h4 className="text-sm font-semibold text-gray-900 uppercase mb-3 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-orange-500" />Why is this Important?</h4>
            <ul className="space-y-2">{whyImportant?.map((p: string, i: number) => <li key={i} className="flex items-start gap-2 text-sm text-gray-600"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />{p}</li>)}</ul>
          </div>
          <div><h4 className="text-sm font-semibold text-gray-900 uppercase mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4 text-blue-500" />How to Use This Data</h4>
            <ul className="space-y-2">{howToUse?.map((p: string, i: number) => <li key={i} className="flex items-start gap-2 text-sm text-gray-600"><span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">{i + 1}</span>{p}</li>)}</ul>
          </div>
          {benchmarks && <div><h4 className="text-sm font-semibold text-gray-900 uppercase mb-3 flex items-center gap-2"><Target className="w-4 h-4 text-purple-500" />Benchmarks</h4>
            <div className="space-y-2">{benchmarks.map((b: any, i: number) => <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${b.status === 'good' ? 'bg-green-50' : b.status === 'warning' ? 'bg-yellow-50' : 'bg-red-50'}`}>
              <span className="text-sm text-gray-700">{b.label}</span>
              <span className={`text-sm font-bold ${b.status === 'good' ? 'text-green-600' : b.status === 'warning' ? 'text-yellow-600' : 'text-red-600'}`}>{b.value}</span>
            </div>)}</div>
          </div>}
        </div>
        <div className="border-t px-6 py-4 bg-gray-50 rounded-b-2xl"><button onClick={onClose} className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Got it, Thanks!</button></div>
      </div>
    </div>);

};

const InfoButton = ({ onClick }: {onClick: () => void;}) =>
<button onClick={onClick} className="w-6 h-6 rounded-full bg-gray-100 hover:bg-blue-100 flex items-center justify-center group">
    <Info className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-600" />
  </button>;


const StatCard = ({ title, value, change, changeType, icon: Icon, color, bgColor, subStats, onInfoClick, trend, branchBreakdown }: any) =>
<div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className={`w-10 h-10 rounded-xl ${bgColor} flex items-center justify-center`}><Icon className={`w-5 h-5 ${color}`} /></div>
        {onInfoClick && <InfoButton onClick={onInfoClick} />}
      </div>
      {trend && <div className="flex items-end gap-0.5 h-8">{trend.map((val: number, idx: number) => <div key={idx} className={`w-1.5 rounded-full ${color.replace('text-', 'bg-')}`} style={{ height: `${val / Math.max(...trend) * 100}%`, minHeight: '4px', opacity: 0.4 + idx * 0.1 }} />)}</div>}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {change && <p className={`text-xs mt-2 flex items-center gap-1 ${changeType === 'positive' ? 'text-green-600' : changeType === 'negative' ? 'text-red-600' : 'text-gray-500'}`}>
        {changeType === 'positive' && <ArrowUpRight className="w-3 h-3" />}{changeType === 'negative' && <ArrowDownRight className="w-3 h-3" />}{changeType === 'neutral' && <Minus className="w-3 h-3" />}{change}
      </p>}
    </div>
    {subStats && <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">{subStats.map((s: any, i: number) => <div key={i} className="text-center"><p className="text-xs text-gray-500">{s.label}</p><p className="text-sm font-semibold text-gray-700">{s.value}</p></div>)}</div>}
    {branchBreakdown && branchBreakdown.length > 1 && <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">{branchBreakdown.map((b: any) => <div key={b.id} className="flex items-center justify-between text-xs"><div className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${b.color}`} /><span className="text-gray-500">{b.name}</span></div><span className="font-medium text-gray-700">{b.value}</span></div>)}</div>}
  </div>;


const AttendanceStatusBadge = ({ status }: {status: string;}) => {
  const config: Record<string, any> = { excellent: { bg: 'bg-green-100', text: 'text-green-700', label: 'Excellent' }, good: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Good' }, warning: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Warning' }, critical: { bg: 'bg-red-100', text: 'text-red-700', label: 'Critical' } };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${config[status].bg} ${config[status].text}`}>{config[status].label}</span>;
};

const ClassAttendanceRow = ({ className, section, totalStudents, present, absent, late, onLeave, percentage, previousPercentage, branchColor }: any) => {
  const getColor = (pct: number) => pct >= 90 ? 'text-green-600 bg-green-50 border-green-200' : pct >= 75 ? 'text-yellow-600 bg-yellow-50 border-yellow-200' : 'text-red-600 bg-red-50 border-red-200';
  const diff = percentage - previousPercentage;
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors group">
      <td className="py-4 px-4"><div className="flex items-center gap-3">{branchColor && <span className={`w-2 h-2 rounded-full ${branchColor}`} />}<div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">{className.replace('Class ', '')}</div><div><span className="font-semibold text-gray-900">{className}</span><span className="text-gray-400 mx-1">•</span><span className="text-gray-500">Sec {section}</span></div></div></td>
      <td className="py-4 px-4 text-center font-semibold text-gray-900">{totalStudents}</td>
      <td className="py-4 px-4 text-center"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-50 text-green-700 font-medium"><CheckCircle className="w-4 h-4" />{present}</span></td>
      <td className="py-4 px-4 text-center"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 font-medium"><XCircle className="w-4 h-4" />{absent}</span></td>
      <td className="py-4 px-4 text-center"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-yellow-50 text-yellow-700 font-medium"><Clock className="w-4 h-4" />{late}</span></td>
      <td className="py-4 px-4 text-center"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-medium"><CalendarDays className="w-4 h-4" />{onLeave}</span></td>
      <td className="py-4 px-4 text-center"><div className="flex items-center justify-center gap-2"><span className={`px-3 py-1.5 rounded-lg text-sm font-bold border ${getColor(percentage)}`}>{percentage}%</span>{diff !== 0 && <span className={`text-xs flex items-center ${diff > 0 ? 'text-green-600' : 'text-red-600'}`}>{diff > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}{Math.abs(diff).toFixed(1)}%</span>}</div></td>
      <td className="py-4 px-4 text-center"><button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-100 rounded-lg"><Eye className="w-4 h-4 text-gray-500" /></button></td>
    </tr>);

};

// Main Component
export function AttendanceSummary() {
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedBatch, setSelectedBatch] = useState('2024-25');
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [activeInfoPanel, setActiveInfoPanel] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const isAllSelected = selectedBranches.length === 0 || selectedBranches.length === BRANCHES.length;
  const activeBranches = useMemo(() => isAllSelected ? BRANCHES : BRANCHES.filter((b) => selectedBranches.includes(b.id)), [selectedBranches, isAllSelected]);

  const toggleBranch = (id: string) => {
    if (id === 'all') setSelectedBranches([]);else
    setSelectedBranches((prev) => prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]);
  };

  // Aggregated Stats
  const stats = useMemo(() => {
    const ids = activeBranches.map((b) => b.id);
    return ids.reduce((acc, id) => {
      const d = branchAttendanceData[id];
      return {
        totalStudents: acc.totalStudents + d.totalStudents, present: acc.present + d.present, absent: acc.absent + d.absent,
        late: acc.late + d.late, onLeave: acc.onLeave + d.onLeave,
        boysTotal: acc.boysTotal + d.boys.total, boysPresent: acc.boysPresent + d.boys.present,
        girlsTotal: acc.girlsTotal + d.girls.total, girlsPresent: acc.girlsPresent + d.girls.present,
        onTime: acc.onTime + d.timeAnalysis.onTime, late15: acc.late15 + d.timeAnalysis.late15Min,
        late30: acc.late30 + d.timeAnalysis.late30Min, earlyLeave: acc.earlyLeave + d.timeAnalysis.earlyDeparture
      };
    }, { totalStudents: 0, present: 0, absent: 0, late: 0, onLeave: 0, boysTotal: 0, boysPresent: 0, girlsTotal: 0, girlsPresent: 0, onTime: 0, late15: 0, late30: 0, earlyLeave: 0 });
  }, [activeBranches]);

  const attendanceRate = stats.totalStudents > 0 ? (stats.present / stats.totalStudents * 100).toFixed(1) : '0';
  const avgWeeklyRate = useMemo(() => {
    const ids = activeBranches.map((b) => b.id);
    const sum = ids.reduce((acc, id) => acc + branchAttendanceData[id].weeklyAverage, 0);
    return (sum / ids.length).toFixed(1);
  }, [activeBranches]);

  const avgMonthlyRate = useMemo(() => {
    const ids = activeBranches.map((b) => b.id);
    const sum = ids.reduce((acc, id) => acc + branchAttendanceData[id].monthlyAverage, 0);
    return (sum / ids.length).toFixed(1);
  }, [activeBranches]);

  // Aggregated Classes
  const aggregatedClasses = useMemo(() => {
    const classes: any[] = [];
    activeBranches.forEach((branch) => {
      branchAttendanceData[branch.id].classes.forEach((c: any) => {
        classes.push({ ...c, branchId: branch.id, branchName: branch.name, branchColor: branch.color });
      });
    });
    return classes;
  }, [activeBranches]);

  // Aggregated Defaulters
  const aggregatedDefaulters = useMemo(() => {
    const defaulters: any[] = [];
    activeBranches.forEach((branch) => {
      branchAttendanceData[branch.id].defaulters.forEach((d: any) => {
        defaulters.push({ ...d, branchId: branch.id, branchName: branch.name, branchColor: branch.color });
      });
    });
    return defaulters.sort((a, b) => a.attendance - b.attendance);
  }, [activeBranches]);

  // Aggregated Absentees
  const aggregatedAbsentees = useMemo(() => {
    const absentees: any[] = [];
    activeBranches.forEach((branch) => {
      branchAttendanceData[branch.id].recentAbsentees.forEach((a: any) => {
        absentees.push({ ...a, branchId: branch.id, branchName: branch.name, branchColor: branch.color });
      });
    });
    return absentees;
  }, [activeBranches]);

  // Aggregated Leave Requests
  const aggregatedLeaves = useMemo(() => {
    const leaves: any[] = [];
    activeBranches.forEach((branch) => {
      branchAttendanceData[branch.id].leaveRequests.forEach((l: any) => {
        leaves.push({ ...l, branchId: branch.id, branchName: branch.name, branchColor: branch.color });
      });
    });
    return leaves;
  }, [activeBranches]);

  // Aggregated Daily Trend
  const aggregatedTrend = useMemo(() => {
    const days = 7;
    const trend = new Array(days).fill(0);
    activeBranches.forEach((branch) => {
      branchAttendanceData[branch.id].dailyTrend.forEach((val: number, idx: number) => {
        trend[idx] += val;
      });
    });
    return trend.map((val) => val / activeBranches.length);
  }, [activeBranches]);

  // Info Panel Content
  const infoPanelContent: Record<string, any> = {
    totalStudents: { title: 'Total Students', description: 'Total enrolled students expected to attend.', whyImportant: ['Track enrollment trends', 'Calculate percentages', 'Resource planning'], howToUse: ['Compare with previous periods', 'Monitor capacity'], benchmarks: [{ label: 'Optimal Class Size', value: '30-40 students', status: 'good' }] },
    presentToday: { title: 'Present Today', description: 'Students marked present for today.', whyImportant: ['Daily engagement indicator', 'Operational planning'], howToUse: ['Track trends', 'Meal planning'], benchmarks: [{ label: 'Excellent', value: '>95%', status: 'good' }, { label: 'Good', value: '90-95%', status: 'good' }] },
    absentToday: { title: 'Absent Today', description: 'Students who did not attend today.', whyImportant: ['Identify issues', 'Parent communication'], howToUse: ['Send notifications', 'Track patterns'], benchmarks: [{ label: 'Acceptable', value: '<5%', status: 'good' }, { label: 'Critical', value: '>10%', status: 'danger' }] },
    lateArrivals: { title: 'Late Arrivals', description: 'Students arriving after scheduled time.', whyImportant: ['Affects academic performance', 'May indicate issues'], howToUse: ['Identify patterns', 'Communicate with parents'], benchmarks: [{ label: 'Acceptable', value: '<3%', status: 'good' }] },
    attendanceRate: { title: 'Attendance Rate', description: 'Percentage of present students.', whyImportant: ['Key performance metric', 'Regulatory compliance'], howToUse: ['Monitor trends', 'Set targets'], benchmarks: [{ label: 'RTE Requirement', value: '75% min', status: 'warning' }, { label: 'Excellent', value: '>95%', status: 'good' }] },
    defaulters: { title: 'Attendance Defaulters', description: 'Students below 75% attendance.', whyImportant: ['Academic performance impact', 'Dropout risk'], howToUse: ['Parent contact', 'Counseling'], benchmarks: [{ label: 'Warning', value: '80%', status: 'warning' }, { label: 'Critical', value: '<75%', status: 'danger' }] }
  };

  const getStatus = (rate: number) => rate >= 95 ? 'excellent' : rate >= 90 ? 'good' : rate >= 80 ? 'warning' : 'critical';
  const getStatusColor = (rate: number) => rate >= 95 ? 'bg-green-50 border-green-200' : rate >= 90 ? 'bg-blue-50 border-blue-200' : rate >= 80 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200';
  const getStatusIconColor = (rate: number) => rate >= 95 ? 'bg-green-100 text-green-600' : rate >= 90 ? 'bg-blue-100 text-blue-600' : rate >= 80 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600';

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {activeInfoPanel && infoPanelContent[activeInfoPanel] && <InfoPanel isOpen={true} onClose={() => setActiveInfoPanel(null)} {...infoPanelContent[activeInfoPanel]} />}

      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">Attendance Summary<span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">Live</span></h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2"><Calendar className="w-4 h-4" />{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}<span className="text-gray-300">•</span><span>Batch: {selectedBatch}</span></p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {/* Batch Select */}
          <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
            {BATCHES.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>

          {/* Branch Multi-Select */}
          <div className="relative">
            <button onClick={() => setShowBranchDropdown(!showBranchDropdown)} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm min-w-[180px]">
              <Building2 className="w-4 h-4 text-gray-500" />
              <span className="flex-1 text-left">{isAllSelected ? 'All Branches' : `${selectedBranches.length} Selected`}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            {showBranchDropdown &&
            <div className="absolute top-full right-0 mt-1 w-64 bg-white border rounded-lg shadow-lg z-50">
                <div className="p-2">
                  <div onClick={() => toggleBranch('all')} className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-50 ${isAllSelected ? 'bg-blue-50' : ''}`}>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${isAllSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>{isAllSelected && <Check className="w-3 h-3 text-white" />}</div>
                    <span className="text-sm font-medium">All Branches</span>
                  </div>
                  <div className="border-t my-2" />
                  {BRANCHES.map((branch) => {
                  const isSelected = selectedBranches.includes(branch.id);
                  return (
                    <div key={branch.id} onClick={() => toggleBranch(branch.id)} className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>{isSelected && <Check className="w-3 h-3 text-white" />}</div>
                        <span className={`w-3 h-3 rounded-full ${branch.color}`} />
                        <div><p className="text-sm font-medium">{branch.name}</p><p className="text-xs text-gray-500">{branch.city}</p></div>
                      </div>);

                })}
                </div>
                <div className="border-t p-2"><button onClick={() => setShowBranchDropdown(false)} className="w-full py-2 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600">Apply</button></div>
              </div>
            }
          </div>

          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm" />
          <button onClick={() => setShowFilters(!showFilters)} className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Filter className="w-4 h-4" />Filters{showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"><RefreshCcw className="w-4 h-4" />Refresh</button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"><Download className="w-4 h-4" />Export</button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700"><BarChart3 className="w-4 h-4" />Reports</button>
        </div>
      </div>

      {/* Selected Branches Tags */}
      {!isAllSelected && selectedBranches.length > 0 &&
      <div className="flex flex-wrap gap-2">
          {selectedBranches.map((id) => {
          const branch = BRANCHES.find((b) => b.id === id);
          return branch && <span key={id} className="inline-flex items-center gap-2 px-3 py-1 bg-white border rounded-full text-sm"><span className={`w-2 h-2 rounded-full ${branch.color}`} />{branch.name}<X className="w-3 h-3 cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => toggleBranch(id)} /></span>;
        })}
          <button onClick={() => setSelectedBranches([])} className="text-sm text-blue-600 hover:text-blue-800 px-2">Clear All</button>
        </div>
      }

      {/* Filters Panel */}
      {showFilters &&
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Class</label><select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"><option value="all">All Classes</option>{[...Array(12)].map((_, i) => <option key={i + 1} value={i + 1}>Class {i + 1}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Section</label><select className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"><option value="all">All Sections</option>{['A', 'B', 'C'].map((s) => <option key={s} value={s}>Section {s}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Department</label><select className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"><option value="all">All</option><option value="primary">Primary (1-5)</option><option value="middle">Middle (6-8)</option><option value="secondary">Secondary (9-12)</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label><select className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"><option value="all">All</option><option value="present">Present</option><option value="absent">Absent</option><option value="late">Late</option></select></div>
          </div>
        </div>
      }

      {/* Branch-wise Overview Table */}
      {activeBranches.length > 1 &&
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200"><h2 className="text-lg font-semibold text-gray-900">Branch-wise Attendance Overview</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>{['Branch', 'Total', 'Present', 'Absent', 'Late', 'On Leave', 'Rate', 'Status'].map((h) => <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y">
                {activeBranches.map((branch) => {
                const d = branchAttendanceData[branch.id];
                return (
                  <tr key={branch.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4"><div className="flex items-center gap-2"><span className={`w-3 h-3 rounded-full ${branch.color}`} /><div><p className="font-medium text-gray-900">{branch.name}</p><p className="text-xs text-gray-500">{branch.city}</p></div></div></td>
                      <td className="py-3 px-4 font-semibold">{d.totalStudents}</td>
                      <td className="py-3 px-4 text-green-600 font-medium">{d.present}</td>
                      <td className="py-3 px-4 text-red-600">{d.absent}</td>
                      <td className="py-3 px-4 text-yellow-600">{d.late}</td>
                      <td className="py-3 px-4 text-blue-600">{d.onLeave}</td>
                      <td className="py-3 px-4"><span className={`px-2 py-1 rounded text-sm font-bold ${d.attendanceRate >= 93 ? 'bg-green-100 text-green-700' : d.attendanceRate >= 90 ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{d.attendanceRate}%</span></td>
                      <td className="py-3 px-4"><AttendanceStatusBadge status={getStatus(d.attendanceRate)} /></td>
                    </tr>);

              })}
                <tr className="bg-gray-50 font-semibold">
                  <td className="py-3 px-4">Total</td>
                  <td className="py-3 px-4">{stats.totalStudents}</td>
                  <td className="py-3 px-4 text-green-600">{stats.present}</td>
                  <td className="py-3 px-4 text-red-600">{stats.absent}</td>
                  <td className="py-3 px-4 text-yellow-600">{stats.late}</td>
                  <td className="py-3 px-4 text-blue-600">{stats.onLeave}</td>
                  <td className="py-3 px-4"><span className="px-2 py-1 rounded text-sm bg-blue-100 text-blue-700">{attendanceRate}%</span></td>
                  <td className="py-3 px-4"><AttendanceStatusBadge status={getStatus(parseFloat(attendanceRate))} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      }

      {/* Overall Status Banner */}
      <div className={`rounded-xl p-4 flex items-center justify-between border ${getStatusColor(parseFloat(attendanceRate))}`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getStatusIconColor(parseFloat(attendanceRate))}`}><Activity className="w-6 h-6" /></div>
          <div>
            <h3 className="font-semibold text-gray-900">Today's Attendance Status: <AttendanceStatusBadge status={getStatus(parseFloat(attendanceRate))} /></h3>
            <p className="text-sm text-gray-600 mt-1">{stats.present.toLocaleString()} out of {stats.totalStudents.toLocaleString()} students present</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm">
          <div className="text-center"><p className="text-gray-500">Weekly Avg</p><p className="font-bold text-gray-900">{avgWeeklyRate}%</p></div>
          <div className="text-center"><p className="text-gray-500">Monthly Avg</p><p className="font-bold text-gray-900">{avgMonthlyRate}%</p></div>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Students" value={stats.totalStudents.toLocaleString()} icon={Users} color="text-blue-600" bgColor="bg-blue-100" onInfoClick={() => setActiveInfoPanel('totalStudents')} subStats={[{ label: 'Boys', value: stats.boysTotal }, { label: 'Girls', value: stats.girlsTotal }]} branchBreakdown={activeBranches.length > 1 ? activeBranches.map((b) => ({ id: b.id, name: b.name, color: b.color, value: branchAttendanceData[b.id].totalStudents })) : null} />
        <StatCard title="Present Today" value={stats.present.toLocaleString()} change="+0.6% vs yesterday" changeType="positive" icon={UserCheck} color="text-green-600" bgColor="bg-green-100" onInfoClick={() => setActiveInfoPanel('presentToday')} trend={aggregatedTrend} branchBreakdown={activeBranches.length > 1 ? activeBranches.map((b) => ({ id: b.id, name: b.name, color: b.color, value: branchAttendanceData[b.id].present })) : null} />
        <StatCard title="Absent Today" value={stats.absent} change="-5 vs yesterday" changeType="positive" icon={UserX} color="text-red-600" bgColor="bg-red-100" onInfoClick={() => setActiveInfoPanel('absentToday')} subStats={[{ label: 'Notified', value: Math.round(stats.absent * 0.73) }, { label: 'Not Notified', value: Math.round(stats.absent * 0.27) }]} branchBreakdown={activeBranches.length > 1 ? activeBranches.map((b) => ({ id: b.id, name: b.name, color: b.color, value: branchAttendanceData[b.id].absent })) : null} />
        <StatCard title="Late Arrivals" value={stats.late} change="+3 vs yesterday" changeType="negative" icon={Clock} color="text-yellow-600" bgColor="bg-yellow-100" onInfoClick={() => setActiveInfoPanel('lateArrivals')} subStats={[{ label: '<15 min', value: stats.late15 }, { label: '>15 min', value: stats.late30 }]} />
        <StatCard title="Attendance Rate" value={`${attendanceRate}%`} change="+0.6% vs last week" changeType="positive" icon={Percent} color="text-purple-600" bgColor="bg-purple-100" onInfoClick={() => setActiveInfoPanel('attendanceRate')} trend={aggregatedTrend} />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
        { label: 'On Leave', value: stats.onLeave, icon: CalendarDays, color: 'text-blue-500' },
        { label: 'On Time', value: stats.onTime, icon: Timer, color: 'text-green-500' },
        { label: 'Early Leave', value: stats.earlyLeave, icon: TimerOff, color: 'text-orange-500' },
        { label: 'Below 75%', value: aggregatedDefaulters.length, icon: AlertTriangle, color: 'text-red-500' }].
        map((item, i) =>
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><item.icon className={`w-5 h-5 ${item.color}`} /><span className="text-sm font-medium text-gray-600">{item.label}</span></div>
              <span className={`text-xl font-bold ${item.color}`}>{item.value}</span>
            </div>
          </div>
        )}
      </div>

      {/* Gender & Department Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gender-wise */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200"><h2 className="text-lg font-semibold text-gray-900">Gender-wise Analysis</h2></div>
          <div className="p-5 grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"><Users className="w-5 h-5 text-blue-600" /></div><div><p className="text-sm text-gray-600">Boys</p><p className="text-xl font-bold text-gray-900">{stats.boysTotal}</p></div></div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Present</span><span className="font-semibold text-green-600">{stats.boysPresent}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Attendance</span><span className="font-bold text-blue-600">{stats.boysTotal > 0 ? (stats.boysPresent / stats.boysTotal * 100).toFixed(1) : 0}%</span></div>
              </div>
              {activeBranches.length > 1 && <div className="mt-3 pt-3 border-t border-blue-200 space-y-1">{activeBranches.map((b) => <div key={b.id} className="flex items-center justify-between text-xs"><div className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${b.color}`} /><span className="text-gray-500">{b.name}</span></div><span className="font-medium">{branchAttendanceData[b.id].boys.present}/{branchAttendanceData[b.id].boys.total}</span></div>)}</div>}
            </div>
            <div className="p-4 bg-pink-50 rounded-xl border border-pink-100">
              <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center"><Users className="w-5 h-5 text-pink-600" /></div><div><p className="text-sm text-gray-600">Girls</p><p className="text-xl font-bold text-gray-900">{stats.girlsTotal}</p></div></div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Present</span><span className="font-semibold text-green-600">{stats.girlsPresent}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Attendance</span><span className="font-bold text-pink-600">{stats.girlsTotal > 0 ? (stats.girlsPresent / stats.girlsTotal * 100).toFixed(1) : 0}%</span></div>
              </div>
              {activeBranches.length > 1 && <div className="mt-3 pt-3 border-t border-pink-200 space-y-1">{activeBranches.map((b) => <div key={b.id} className="flex items-center justify-between text-xs"><div className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${b.color}`} /><span className="text-gray-500">{b.name}</span></div><span className="font-medium">{branchAttendanceData[b.id].girls.present}/{branchAttendanceData[b.id].girls.total}</span></div>)}</div>}
            </div>
          </div>
        </div>

        {/* Department-wise */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200"><h2 className="text-lg font-semibold text-gray-900">Department-wise Analysis</h2></div>
          <div className="p-5 space-y-3">
            {['Primary (1-5)', 'Middle (6-8)', 'Secondary (9-10)', 'Senior Secondary'].map((dept, idx) => {
              const total = activeBranches.reduce((sum, b) => sum + branchAttendanceData[b.id].departments[idx].total, 0);
              const present = activeBranches.reduce((sum, b) => sum + branchAttendanceData[b.id].departments[idx].present, 0);
              const pct = total > 0 ? (present / total * 100).toFixed(1) : '0';
              return (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-32 text-sm font-medium text-gray-700">{dept}</div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div className={`h-3 rounded-full ${parseFloat(pct) >= 95 ? 'bg-green-500' : parseFloat(pct) >= 90 ? 'bg-blue-500' : parseFloat(pct) >= 85 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-12 text-sm font-bold text-gray-700">{pct}%</span>
                  </div>
                  <span className="text-sm text-gray-500">{present}/{total}</span>
                </div>);

            })}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Class-wise Attendance */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2"><h2 className="text-lg font-semibold text-gray-900">Class-wise Attendance</h2><InfoButton onClick={() => setActiveInfoPanel('classWise')} /></div>
            <select className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm"><option>All Classes</option><option>Primary</option><option>Middle</option><option>Secondary</option></select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50"><tr>{['Class', 'Total', 'Present', 'Absent', 'Late', 'Leave', 'Rate', ''].map((h) => <th key={h} className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">{h}</th>)}</tr></thead>
              <tbody>{aggregatedClasses.slice(0, 10).map((item, i) => <ClassAttendanceRow key={i} {...item} branchColor={activeBranches.length > 1 ? item.branchColor : null} />)}</tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <span className="text-sm text-gray-500">Showing {Math.min(10, aggregatedClasses.length)} of {aggregatedClasses.length} classes</span>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">View All<ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Defaulters */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2"><h2 className="text-lg font-semibold text-gray-900">Attendance Defaulters</h2><InfoButton onClick={() => setActiveInfoPanel('defaulters')} /></div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold"><AlertTriangle className="w-3 h-3" />{aggregatedDefaulters.length} at risk</span>
            </div>
            <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
              {aggregatedDefaulters.length > 0 ? aggregatedDefaulters.map((student, i) =>
              <div key={i} className="px-5 py-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {activeBranches.length > 1 && <span className={`w-2 h-2 rounded-full ${student.branchColor}`} />}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${student.attendance < 70 ? 'bg-red-500' : student.attendance < 75 ? 'bg-orange-500' : 'bg-yellow-500'}`}>{student.attendance}%</div>
                      <div><p className="font-medium text-gray-900">{student.name}</p><p className="text-sm text-gray-500">Class {student.class}</p></div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-red-600">{student.absences} absences</p>
                      <div className="flex gap-1 mt-1">
                        {student.parentNotified && <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs">Notified</span>}
                        {student.counselingDone && <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">Counseled</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ) : <p className="p-5 text-gray-500 text-center">No defaulters found</p>}
            </div>
            <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 flex gap-2">
              <button className="flex-1 py-2 text-sm bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 flex items-center justify-center gap-1"><Bell className="w-4 h-4" />Send Alerts</button>
              <button className="flex-1 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">View All</button>
            </div>
          </div>

          {/* Today's Absentees */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200"><h2 className="text-lg font-semibold text-gray-900">Today's Absentees</h2></div>
            <div className="divide-y divide-gray-100">
              {aggregatedAbsentees.length > 0 ? aggregatedAbsentees.map((student, i) =>
              <div key={i} className="px-5 py-3 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {activeBranches.length > 1 && <span className={`w-2 h-2 rounded-full ${student.branchColor}`} />}
                      <div><p className="font-medium text-gray-900 text-sm">{student.name}</p><p className="text-xs text-gray-500">Class {student.class}</p></div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${student.notified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{student.reason}</span>
                  </div>
                </div>
              ) : <p className="p-5 text-gray-500 text-center">No absentees found</p>}
            </div>
            <div className="px-5 py-3 border-t border-gray-200 bg-gray-50">
              <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium">View All {stats.absent} Absentees →</button>
            </div>
          </div>

          {/* Leave Requests */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Leave Requests</h2>
              <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">{aggregatedLeaves.filter((l) => l.status === 'pending').length} pending</span>
            </div>
            <div className="divide-y divide-gray-100">
              {aggregatedLeaves.length > 0 ? aggregatedLeaves.map((request, i) =>
              <div key={i} className="px-5 py-3 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {activeBranches.length > 1 && <span className={`w-2 h-2 rounded-full ${request.branchColor}`} />}
                      <div><p className="font-medium text-gray-900 text-sm">{request.name}</p><p className="text-xs text-gray-500">{request.type} • {request.from} to {request.to}</p></div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${request.status === 'approved' ? 'bg-green-100 text-green-700' : request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{request.status}</span>
                  </div>
                </div>
              ) : <p className="p-5 text-gray-500 text-center">No leave requests</p>}
            </div>
            <div className="px-5 py-3 border-t border-gray-200 bg-gray-50">
              <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium">Manage Leave Requests →</button>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Trend Chart */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Attendance Trend (Last 7 Days)</h2>
          <div className="flex items-center gap-4 text-sm">
            {activeBranches.map((b) => <div key={b.id} className="flex items-center gap-2"><span className={`w-3 h-3 rounded-full ${b.color}`} /><span className="text-gray-600">{b.name}</span></div>)}
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-end justify-between h-48 gap-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) =>
            <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center gap-1 h-36">
                  {activeBranches.map((branch, bIdx) =>
                <div key={bIdx} className={`flex-1 ${branch.color} rounded-t`} style={{ height: `${branchAttendanceData[branch.id].dailyTrend[idx]}%`, maxWidth: '12px' }} title={`${branch.name}: ${branchAttendanceData[branch.id].dailyTrend[idx]}%`} />
                )}
                </div>
                <span className="text-xs text-gray-500">{day}</span>
                <span className="text-xs font-bold text-gray-700">{aggregatedTrend[idx].toFixed(1)}%</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {[
          { icon: CheckCircle, label: 'Mark Attendance', color: 'blue' },
          { icon: BarChart3, label: 'Generate Report', color: 'green' },
          { icon: Send, label: 'Send SMS Alert', color: 'yellow' },
          { icon: CalendarRange, label: 'Manage Leaves', color: 'purple' },
          { icon: AlertTriangle, label: 'View Defaulters', color: 'red' },
          { icon: Download, label: 'Export Data', color: 'indigo' }].
          map((action, i) =>
          <button key={i} className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-${action.color}-300 hover:bg-${action.color}-50 transition-all group`}>
              <div className={`w-12 h-12 rounded-xl bg-${action.color}-100 flex items-center justify-center group-hover:bg-${action.color}-200`}><action.icon className={`w-6 h-6 text-${action.color}-600`} /></div>
              <span className={`text-sm font-medium text-gray-700 group-hover:text-${action.color}-700 text-center`}>{action.label}</span>
            </button>
          )}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        {[
        { label: 'Working Days (This Month)', value: '22', color: 'from-blue-500 to-blue-600' },
        { label: 'Average Attendance', value: `${avgMonthlyRate}%`, color: 'from-green-500 to-green-600' },
        { label: 'Total Leaves Approved', value: aggregatedLeaves.filter((l) => l.status === 'approved').length.toString(), color: 'from-orange-500 to-orange-600' },
        { label: 'SMS Sent Today', value: Math.round(stats.absent * 2.5).toString(), color: 'from-purple-500 to-purple-600' }].
        map((stat, i) =>
        <div key={i} className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 text-white`}>
            <p className="text-white/80 text-sm">{stat.label}</p>
            <p className="text-3xl font-bold mt-1">{stat.value}</p>
          </div>
        )}
      </div>
    </div>);

}

export default AttendanceSummary;