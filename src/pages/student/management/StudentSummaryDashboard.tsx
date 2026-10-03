import React, { useEffect, useMemo, useState } from 'react';
import {
  Users, UserCheck, TrendingUp, TrendingDown, AlertCircle, ArrowRight, GraduationCap,
  Home, Info, X, Send, Gift, Clock, UserMinus, Building, CalendarDays, Trophy, UserX,
  Cake, Mail, Phone, MessageSquare, Bell, Edit, Download, Search, FileText, Medal, Star, ChevronDown, Check } from
'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  AreaChart, Area, PieChart, Pie, Cell, Legend } from
'recharts';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { useNavigate } from 'react-router-dom';

// --- Constants ---
const BRANCHES = [
{ id: 'main', name: 'Main Branch', color: '#3b82f6' },
{ id: 'north', name: 'North Campus', color: '#10b981' },
{ id: 'south', name: 'South Campus', color: '#f59e0b' },
{ id: 'west', name: 'West Campus', color: '#8b5cf6' }];


const BATCHES = [
{ value: '2024-2025', label: '2024-2025' },
{ value: '2023-2024', label: '2023-2024' },
{ value: '2022-2023', label: '2022-2023' }];


// --- Branch-wise Mock Data ---
const getBranchData = (branchId: string, batch: string) => {
  const baseData: Record<string, any> = {
    main: { students: 450, attendance: 95.2, admissions: 20, defaulters: 12, capacity: 500, present: 428, absent: 22 },
    north: { students: 320, attendance: 93.8, admissions: 12, defaulters: 8, capacity: 400, present: 300, absent: 20 },
    south: { students: 180, attendance: 94.5, admissions: 8, defaulters: 5, capacity: 250, present: 170, absent: 10 },
    west: { students: 100, attendance: 96.1, admissions: 5, defaulters: 3, capacity: 150, present: 96, absent: 4 }
  };
  return baseData[branchId] || baseData.main;
};

const getEnrollmentTrend = (branchId: string) => {
  const multiplier: Record<string, number> = { main: 1, north: 0.7, south: 0.4, west: 0.22 };
  const m = multiplier[branchId] || 1;
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => ({
    month, students: Math.round((1010 + i * 5) * m)
  }));
};

const getAttendanceTrend = (branchId: string) => {
  const offset: Record<string, number> = { main: 0, north: -1, south: 1, west: 2 };
  const o = offset[branchId] || 0;
  return [1, 5, 10, 15, 20, 25, 30].map((day, i) => ({
    day: String(day), current: Math.min(99, 92 + i + o), previous: 90 + i
  }));
};

const getClassData = (branchId: string) => {
  const classes = [
  { class: 'Class 1', section: 'A', enrolled: 35, capacity: 40 },
  { class: 'Class 1', section: 'B', enrolled: 38, capacity: 40 },
  { class: 'Class 5', section: 'A', enrolled: 40, capacity: 40 },
  { class: 'Class 10', section: 'A', enrolled: 42, capacity: 45 }];

  const m: Record<string, number> = { main: 1, north: 0.8, south: 0.6, west: 0.5 };
  return classes.map((c) => ({ ...c, enrolled: Math.round(c.enrolled * (m[branchId] || 1)), branchId }));
};

const getBirthdays = (branchId: string) => [
{ id: 1, name: 'Arjun Sharma', class: 'Class 5-A', date: 'Today', avatar: 'AS', age: 11, branch: branchId },
{ id: 2, name: 'Priya Patel', class: 'Class 7-B', date: 'Tomorrow', avatar: 'PP', age: 13, branch: branchId }];


const getActivities = (branchId: string) => [
{ id: 1, type: 'admission', title: 'New Student Enrolled', description: `Student enrolled at ${BRANCHES.find((b) => b.id === branchId)?.name}`, time: '10 min ago', icon: Edit, color: 'bg-green-100 text-green-600', performer: 'Admin' },
{ id: 2, type: 'update', title: 'Profile Updated', description: 'Contact details updated', time: '1 hour ago', icon: Edit, color: 'bg-blue-100 text-blue-600', performer: 'Mrs. Gupta' }];


const getAchievements = (branchId: string) => [
{ id: 1, name: 'Aryan Das', class: 'Class 10-A', achievement: 'Chess Gold', category: 'Sports', date: 'Dec 10', branch: branchId },
{ id: 2, name: 'Kavya Sharma', class: 'Class 9-B', achievement: 'Science Olympiad', category: 'Academic', date: 'Dec 8', branch: branchId }];


const genderData = [{ name: 'Boys', value: 580, color: '#3b82f6' }, { name: 'Girls', value: 470, color: '#ec4899' }];
const houseData = [
{ name: 'Red House', value: 265, color: '#ef4444' },
{ name: 'Blue House', value: 258, color: '#3b82f6' },
{ name: 'Green House', value: 270, color: '#22c55e' },
{ name: 'Yellow House', value: 257, color: '#eab308' }];


// --- Helper Components ---
const MultiSelect = ({ options, selected, onChange, label }: any) => {
  const [open, setOpen] = useState(false);
  const allSelected = selected.length === options.length;
  const toggleAll = () => onChange(allSelected ? [] : options.map((o: any) => o.id));
  const toggle = (id: string) => onChange(selected.includes(id) ? selected.filter((s: string) => s !== id) : [...selected, id]);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:border-gray-400">
        <Building className="w-4 h-4 text-gray-500" />
        <span>{selected.length === 0 ? 'Select Branches' : selected.length === options.length ? 'All Branches' : `${selected.length} Branch${selected.length > 1 ? 'es' : ''}`}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>
      {open &&
      <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px]">
            <div className="p-2 border-b border-gray-100">
              <button onClick={toggleAll} className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-gray-50 rounded">
                <div className={`w-4 h-4 border rounded flex items-center justify-center ${allSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                  {allSelected && <Check className="w-3 h-3 text-white" />}
                </div>
                Select All
              </button>
            </div>
            <div className="p-2 max-h-48 overflow-y-auto">
              {options.map((opt: any) =>
            <button key={opt.id} onClick={() => toggle(opt.id)} className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-gray-50 rounded">
                  <div className={`w-4 h-4 border rounded flex items-center justify-center ${selected.includes(opt.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                    {selected.includes(opt.id) && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: opt.color }} />
                  {opt.name}
                </button>
            )}
            </div>
          </div>
        </>
      }
    </div>);

};

const InfoModal = ({ isOpen, onClose, title, data }: any) => {
  if (!isOpen || !data) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-5">
          <div><h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Description</h3><p className="text-sm text-gray-700">{data.description}</p></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg"><h3 className="text-xs font-bold text-blue-800 uppercase mb-1">Data Source</h3><p className="text-xs text-blue-700">{data.dataSource}</p></div>
            <div className="bg-purple-50 p-3 rounded-lg"><h3 className="text-xs font-bold text-purple-800 uppercase mb-1">Why It Matters</h3><p className="text-xs text-purple-700">{data.whyItMatters}</p></div>
          </div>
          <div><h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Actions</h3>
            {data.actions?.map((a: string, i: number) => <button key={i} className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm mb-2 flex items-center justify-between"><span>{a}</span><ArrowRight className="w-4 h-4" /></button>)}
          </div>
        </div>
        <div className="p-5 border-t bg-gray-50 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button variant="primary"><Download className="w-4 h-4 mr-2" />Export</Button>
        </div>
      </div>
    </div>);

};

const BirthdayWishModal = ({ isOpen, onClose, student }: any) => {
  const [msg, setMsg] = useState('');
  const [via, setVia] = useState(['sms', 'app']);
  useEffect(() => {if (student && isOpen) setMsg(`Dear ${student?.name}, wishing you a Happy Birthday! 🎂`);}, [student, isOpen]);
  if (!isOpen || !student) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
        <div className="p-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-t-xl">
          <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-bold">Send Birthday Wish</h2><button onClick={onClose}><X className="w-5 h-5" /></button></div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold">{student.avatar}</div>
            <div><p className="font-semibold">{student.name}</p><p className="text-pink-100 text-sm">{student.class}</p></div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={3} className="w-full border rounded-lg p-2 text-sm" />
          <div className="flex gap-2">
            {['sms', 'email', 'whatsapp', 'app'].map((m) =>
            <button key={m} onClick={() => setVia(via.includes(m) ? via.filter((v) => v !== m) : [...via, m])} className={`flex-1 p-2 rounded-lg border text-xs ${via.includes(m) ? 'border-pink-500 bg-pink-50' : 'border-gray-200'}`}>{m.toUpperCase()}</button>
            )}
          </div>
        </div>
        <div className="p-4 border-t flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" className="bg-gradient-to-r from-pink-500 to-purple-600"><Send className="w-4 h-4 mr-2" />Send</Button>
        </div>
      </div>
    </div>);

};

const Panel = ({ title, children, onInfoClick, actions, className = '' }: any) =>
<div className={`bg-white rounded-xl border shadow-sm flex flex-col ${className}`}>
    <div className="px-5 py-4 border-b flex items-center justify-between bg-gray-50/50 rounded-t-xl">
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <div className="flex items-center gap-2">
        {actions}
        {onInfoClick && <button onClick={onInfoClick} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-full"><Info className="w-4 h-4" /></button>}
      </div>
    </div>
    <div className="p-5 flex-1">{children}</div>
  </div>;


const KPICard = ({ title, value, subtext, icon: Icon, color, trendPositive, onInfoClick, branchBreakdown }: any) =>
<div className="bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow relative group">
    {onInfoClick && <button onClick={onInfoClick} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded-full"><Info className="w-3.5 h-3.5 text-gray-400" /></button>}
    <div className="flex items-start gap-4">
      <div className={`p-3 rounded-lg ${color} shrink-0`}><Icon className="w-6 h-6" /></div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
        <p className={`text-xs mt-1 font-medium flex items-center gap-1 ${trendPositive === true ? 'text-green-600' : trendPositive === false ? 'text-red-600' : 'text-gray-500'}`}>
          {trendPositive === true && <TrendingUp className="w-3 h-3" />}{trendPositive === false && <TrendingDown className="w-3 h-3" />}{subtext}
        </p>
        {branchBreakdown && branchBreakdown.length > 1 &&
      <div className="mt-3 pt-3 border-t space-y-1">
            {branchBreakdown.map((b: any) =>
        <div key={b.id} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: b.color }} />{b.name}</span>
                <span className="font-semibold">{b.value}</span>
              </div>
        )}
          </div>
      }
      </div>
    </div>
  </div>;


const BranchBadge = ({ branch }: {branch: any;}) =>
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: `${branch.color}15`, color: branch.color }}>
    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: branch.color }} />
    {branch.name}
  </span>;


// --- Main Dashboard ---
export function StudentSummaryDashboard() {
  const navigate = useNavigate();
  const [batch, setBatch] = useState('2024-2025');
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['main']);
  const [enrollmentPeriod, setEnrollmentPeriod] = useState('6months');
  const [attendanceMonth, setAttendanceMonth] = useState('Oct');
  const [attendanceCompare, setAttendanceCompare] = useState(false);
  const [genderClassFilter, setGenderClassFilter] = useState('All');
  const [classSearch, setClassSearch] = useState('');
  const [infoModal, setInfoModal] = useState<{isOpen: boolean;title: string;data: any;}>({ isOpen: false, title: '', data: null });
  const [birthdayModal, setBirthdayModal] = useState<{isOpen: boolean;student: any;}>({ isOpen: false, student: null });

  const activeBranches = useMemo(() => BRANCHES.filter((b) => selectedBranches.includes(b.id)), [selectedBranches]);

  const aggregatedData = useMemo(() => {
    const data = selectedBranches.map((id) => ({ id, ...getBranchData(id, batch), ...BRANCHES.find((b) => b.id === id) }));
    return {
      totalStudents: data.reduce((s, d) => s + d.students, 0),
      attendance: data.length ? (data.reduce((s, d) => s + d.attendance, 0) / data.length).toFixed(1) : 0,
      admissions: data.reduce((s, d) => s + d.admissions, 0),
      defaulters: data.reduce((s, d) => s + d.defaulters, 0),
      capacity: data.reduce((s, d) => s + d.capacity, 0),
      present: data.reduce((s, d) => s + d.present, 0),
      absent: data.reduce((s, d) => s + d.absent, 0),
      breakdown: data.map((d) => ({ id: d.id, name: d.name, color: d.color, students: d.students, attendance: d.attendance, admissions: d.admissions, defaulters: d.defaulters }))
    };
  }, [selectedBranches, batch]);

  const enrollmentData = useMemo(() => {
    if (selectedBranches.length === 1) return getEnrollmentTrend(selectedBranches[0]);
    const combined: Record<string, any> = {};
    selectedBranches.forEach((id) => {
      getEnrollmentTrend(id).forEach((d) => {
        if (!combined[d.month]) combined[d.month] = { month: d.month };
        combined[d.month][id] = d.students;
      });
    });
    return Object.values(combined);
  }, [selectedBranches]);

  const attendanceData = useMemo(() => getAttendanceTrend(selectedBranches[0] || 'main'), [selectedBranches]);

  const classData = useMemo(() => {
    const all = selectedBranches.flatMap((id) => getClassData(id).map((c) => ({ ...c, branch: BRANCHES.find((b) => b.id === id) })));
    if (!classSearch) return all;
    return all.filter((c) => c.class.toLowerCase().includes(classSearch.toLowerCase()) || c.section.toLowerCase().includes(classSearch.toLowerCase()));
  }, [selectedBranches, classSearch]);

  const birthdays = useMemo(() => selectedBranches.flatMap((id) => getBirthdays(id).map((b) => ({ ...b, branchData: BRANCHES.find((br) => br.id === id) }))), [selectedBranches]);
  const activities = useMemo(() => selectedBranches.flatMap((id) => getActivities(id).map((a) => ({ ...a, branchData: BRANCHES.find((br) => br.id === id) }))), [selectedBranches]);
  const achievements = useMemo(() => selectedBranches.flatMap((id) => getAchievements(id).map((a) => ({ ...a, branchData: BRANCHES.find((br) => br.id === id) }))), [selectedBranches]);

  const openInfo = (key: string, title: string) => {
    const info: Record<string, any> = {
      totalStudents: { description: 'Total active students enrolled.', dataSource: 'Admission Register', whyItMatters: 'Primary indicator of school size.', actions: ['View List', 'Export Report'] },
      attendance: { description: 'Percentage present today.', dataSource: 'Attendance Log', whyItMatters: 'High attendance = better performance.', actions: ['View Absentees', 'Send Alert'] },
      newAdmissions: { description: 'New admissions this session.', dataSource: 'Admission Module', whyItMatters: 'Indicates growth.', actions: ['Review Trends', 'Assign Classes'] },
      feeDefaulters: { description: 'Students with overdue fees.', dataSource: 'Fee Module', whyItMatters: 'Critical for cash flow.', actions: ['Send Reminders', 'View List'] }
    };
    setInfoModal({ isOpen: true, title, data: info[key] || info.totalStudents });
  };

  return (
    <div className="bg-gray-50/50 min-h-screen p-6 space-y-6">
      <InfoModal isOpen={infoModal.isOpen} onClose={() => setInfoModal((p) => ({ ...p, isOpen: false }))} title={infoModal.title} data={infoModal.data} />
      <BirthdayWishModal isOpen={birthdayModal.isOpen} onClose={() => setBirthdayModal({ isOpen: false, student: null })} student={birthdayModal.student} />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Summary</h1>
          <p className="text-sm text-gray-500">Overview of student metrics by branch and batch</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <MultiSelect options={BRANCHES} selected={selectedBranches} onChange={setSelectedBranches} label="Branches" />
          <Select value={batch} onChange={setBatch} options={BATCHES} className="h-10" />
        </div>
      </div>

      {/* Active Filters */}
      {selectedBranches.length > 0 &&
      <div className="flex flex-wrap items-center gap-2 p-3 bg-white rounded-lg border">
          <span className="text-xs font-medium text-gray-500">Showing data for:</span>
          {activeBranches.map((b) => <BranchBadge key={b.id} branch={b} />)}
          <span className="text-xs text-gray-400">|</span>
          <span className="text-xs font-medium text-gray-600">Batch: {batch}</span>
        </div>
      }

      {selectedBranches.length === 0 ?
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <Building className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
          <h3 className="font-semibold text-yellow-800">No Branch Selected</h3>
          <p className="text-sm text-yellow-600">Please select at least one branch to view dashboard data</p>
        </div> :

      <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard title="Total Students" value={aggregatedData.totalStudents.toLocaleString()} subtext="↑ +12 this month" icon={Users} color="bg-blue-100 text-blue-600" trendPositive={true} onInfoClick={() => openInfo('totalStudents', 'Total Students')} branchBreakdown={aggregatedData.breakdown.map((b) => ({ ...b, value: b.students }))} />
            <KPICard title="Today's Attendance" value={`${aggregatedData.attendance}%`} subtext="↑ +2.1% vs yesterday" icon={UserCheck} color="bg-emerald-100 text-emerald-600" trendPositive={true} onInfoClick={() => openInfo('attendance', 'Attendance')} branchBreakdown={aggregatedData.breakdown.map((b) => ({ ...b, value: `${b.attendance}%` }))} />
            <KPICard title="New Admissions" value={aggregatedData.admissions} subtext="Current Session" icon={GraduationCap} color="bg-purple-100 text-purple-600" onInfoClick={() => openInfo('newAdmissions', 'New Admissions')} branchBreakdown={aggregatedData.breakdown.map((b) => ({ ...b, value: b.admissions }))} />
            <KPICard title="Fee Defaulters" value={aggregatedData.defaulters} subtext="Needs Attention" icon={AlertCircle} color="bg-red-100 text-red-600" trendPositive={false} onInfoClick={() => openInfo('feeDefaulters', 'Fee Defaulters')} branchBreakdown={aggregatedData.breakdown.map((b) => ({ ...b, value: b.defaulters }))} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard title="School Capacity" value={`${Math.round(aggregatedData.totalStudents / aggregatedData.capacity * 100)}%`} subtext={`${aggregatedData.capacity - aggregatedData.totalStudents} seats available`} icon={Building} color="bg-indigo-100 text-indigo-600" trendPositive={true} />
            <KPICard title="Present Today" value={aggregatedData.present} subtext={`↓ ${aggregatedData.absent} absent`} icon={UserCheck} color="bg-green-100 text-green-600" trendPositive={true} />
            <KPICard title="Not in School" value={aggregatedData.absent} subtext="Need follow-up" icon={UserX} color="bg-orange-100 text-orange-600" trendPositive={false} />
            <KPICard title="Year Progress" value="68%" subtext="64 days remaining" icon={CalendarDays} color="bg-cyan-100 text-cyan-600" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Panel title="Enrollment Trend" actions={<Select value={enrollmentPeriod} onChange={setEnrollmentPeriod} options={[{ value: '6months', label: '6 Months' }, { value: 'year', label: 'Full Year' }]} className="h-8 text-xs" />}>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={enrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <Tooltip />
                    <Legend />
                    {selectedBranches.length === 1 ?
                  <Line type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} /> :

                  activeBranches.map((b) => <Line key={b.id} type="monotone" dataKey={b.id} name={b.name} stroke={b.color} strokeWidth={2} dot={{ r: 3 }} />)
                  }
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel title="Attendance Trend" actions={
          <div className="flex items-center gap-2">
                <label className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  <input type="checkbox" checked={attendanceCompare} onChange={(e) => setAttendanceCompare(e.target.checked)} className="rounded text-blue-600" />Compare
                </label>
                <Select value={attendanceMonth} onChange={setAttendanceMonth} options={[{ value: 'Oct', label: 'October' }, { value: 'Sep', label: 'September' }]} className="h-8 text-xs" />
              </div>
          }>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={attendanceData}>
                    <defs><linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.1} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <YAxis domain={[80, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="current" stroke="#10b981" fillOpacity={1} fill="url(#colorCurrent)" strokeWidth={2} name="This Month" />
                    {attendanceCompare && <Area type="monotone" dataKey="previous" stroke="#94a3b8" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" name="Last Month" />}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel title="Gender Distribution" actions={<Select value={genderClassFilter} onChange={setGenderClassFilter} options={[{ value: 'All', label: 'All Classes' }, { value: '1-5', label: 'Class 1-5' }]} className="h-8 text-xs" />}>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart><Pie data={genderData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">{genderData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip /><Legend verticalAlign="middle" align="right" layout="vertical" /></PieChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel title="House Distribution">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 h-full content-center">
                {houseData.map((h, i) =>
              <div key={i} className="p-4 rounded-xl border-2 hover:shadow-md transition-all text-center" style={{ borderColor: `${h.color}30`, backgroundColor: `${h.color}05` }}>
                    <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ backgroundColor: h.color }} />
                    <h4 className="font-semibold text-gray-800 text-sm mb-1">{h.name}</h4>
                    <p className="text-xl font-bold" style={{ color: h.color }}>{h.value}</p>
                  </div>
              )}
              </div>
            </Panel>
          </div>

          {/* Class Strength & Achievements */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Panel title="Class Strength" className="lg:col-span-2" actions={
          <div className="relative">
                <Search className="w-4 h-4 absolute left-2 top-2 text-gray-400" />
                <input type="text" placeholder="Search..." value={classSearch} onChange={(e) => setClassSearch(e.target.value)} className="pl-8 pr-3 py-1 border rounded-md text-sm w-40" />
              </div>
          }>
              <div className="overflow-auto max-h-80">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 font-medium border-b sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left">Class</th>
                      {selectedBranches.length > 1 && <th className="px-4 py-3 text-left">Branch</th>}
                      <th className="px-4 py-3 text-center">Enrolled</th>
                      <th className="px-4 py-3 text-center">Capacity</th>
                      <th className="px-4 py-3 text-left">Occupancy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {classData.map((c, i) => {
                    const pct = Math.round(c.enrolled / c.capacity * 100);
                    return (
                      <tr key={i} className="hover:bg-gray-50/50">
                          <td className="px-4 py-3 font-medium">{c.class} - {c.section}</td>
                          {selectedBranches.length > 1 && <td className="px-4 py-3"><BranchBadge branch={c.branch} /></td>}
                          <td className="px-4 py-3 text-center">{c.enrolled}</td>
                          <td className="px-4 py-3 text-center text-gray-500">{c.capacity}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${pct >= 100 ? 'bg-red-500' : pct > 80 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${pct}%` }} />
                              </div>
                              <span className={`text-xs font-medium ${pct >= 100 ? 'text-red-600' : 'text-gray-600'}`}>{pct}%</span>
                            </div>
                          </td>
                        </tr>);

                  })}
                  </tbody>
                </table>
              </div>
            </Panel>

            <Panel title="Recent Achievements" actions={<Button size="xs" variant="outline" className="text-xs">View All</Button>}>
              <div className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <div className="flex-1 bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-center">
                    <span className="block text-xl font-bold text-yellow-700">156</span>
                    <span className="text-xs text-yellow-600 uppercase">Year</span>
                  </div>
                  <div className="flex-1 bg-blue-50 p-3 rounded-lg border border-blue-100 text-center">
                    <span className="block text-xl font-bold text-blue-700">23</span>
                    <span className="text-xs text-blue-600 uppercase">Month</span>
                  </div>
                </div>
                {achievements.slice(0, 3).map((a) =>
              <div key={a.id} className="flex gap-3 items-start p-3 rounded-lg bg-gray-50 border">
                    <div className="p-2 bg-white rounded-md shadow-sm text-yellow-500">{a.category === 'Sports' ? <Medal className="w-4 h-4" /> : <Star className="w-4 h-4" />}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold">{a.name} <span className="text-gray-400 font-normal text-xs">({a.class})</span></p>
                        {selectedBranches.length > 1 && a.branchData && <BranchBadge branch={a.branchData} />}
                      </div>
                      <p className="text-xs text-gray-600">{a.achievement}</p>
                    </div>
                  </div>
              )}
              </div>
            </Panel>
          </div>

          {/* Activity, Birthdays, Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Panel title="Recent Activities">
              <div className="space-y-4">
                {activities.slice(0, 3).map((a) =>
              <div key={a.id} className="flex gap-3">
                    <div className={`mt-1 p-1.5 rounded-full h-fit ${a.color}`}><a.icon className="w-3.5 h-3.5" /></div>
                    <div className="flex-1 pb-4 border-b last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{a.title}</p>
                        {selectedBranches.length > 1 && a.branchData && <BranchBadge branch={a.branchData} />}
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">{a.description}</p>
                      <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 mt-1 inline-block">{a.time}</span>
                    </div>
                  </div>
              )}
                <button className="w-full text-center text-sm text-blue-600 hover:underline pt-2">View Activity Log</button>
              </div>
            </Panel>

            <Panel title="Upcoming Birthdays 🎂">
              <div className="space-y-3">
                {birthdays.slice(0, 4).map((s) =>
              <div key={s.id} className={`flex items-center justify-between p-3 rounded-lg border ${s.date === 'Today' ? 'bg-gradient-to-r from-pink-50 to-white border-pink-200' : 'bg-white border-gray-100'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${s.date === 'Today' ? 'bg-pink-100 text-pink-600' : 'bg-gray-100'}`}>{s.avatar}</div>
                      <div>
                        <p className="text-sm font-semibold">{s.name}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">{s.class}</span>
                          {selectedBranches.length > 1 && s.branchData && <BranchBadge branch={s.branchData} />}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.date === 'Today' ? 'bg-pink-500 text-white' : 'bg-gray-100'}`}>{s.date}</span>
                      <button onClick={() => setBirthdayModal({ isOpen: true, student: s })} className="text-xs flex items-center gap-1 text-pink-600 font-medium"><Gift className="w-3 h-3" />Wish</button>
                    </div>
                  </div>
              )}
              </div>
            </Panel>

            <Panel title="Alerts & Exceptions">
              <div className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-red-900">Fee Defaulters High</h4>
                    <p className="text-xs text-red-700 mt-0.5">{aggregatedData.defaulters} students with overdue fees</p>
                    <div className="mt-2 flex gap-2">
                      <button className="text-xs bg-white border border-red-200 text-red-700 px-2 py-1 rounded">View List</button>
                      <button className="text-xs text-red-700 hover:underline">Send Reminder</button>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-orange-50 border border-orange-100 rounded-lg flex items-start gap-3">
                  <UserX className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-orange-900">Chronic Absenteeism</h4>
                    <p className="text-xs text-orange-700 mt-0.5">5 students absent &gt;3 days</p>
                    <button className="mt-2 text-xs text-orange-700 font-medium hover:underline">Check Attendance</button>
                  </div>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg flex items-start gap-3">
                  <FileText className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-yellow-900">Docs Pending</h4>
                    <p className="text-xs text-yellow-700 mt-0.5">8 admissions need verification</p>
                    <button className="mt-2 text-xs text-yellow-700 font-medium hover:underline">Verify Now</button>
                  </div>
                </div>
              </div>
            </Panel>
          </div>
        </>
      }
    </div>);

}