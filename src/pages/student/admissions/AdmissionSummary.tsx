// AdmissionSummary.tsx
import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import {
  Users, UserPlus, UserCheck, FileText, TrendingUp, TrendingDown, Info, X, IndianRupee, Target,
  AlertCircle, Filter, Building2, BookOpen, Calendar, CheckCircle, Clock, Phone, Globe, Megaphone,
  Newspaper, UserCircle, ChevronDown, ChevronRight, HelpCircle, ArrowDownRight, Check } from
'lucide-react';

// Constants
const BRANCHES = [
{ id: 'main', name: 'Main Campus', city: 'Delhi', color: 'bg-blue-500' },
{ id: 'north', name: 'North Branch', city: 'Noida', color: 'bg-green-500' },
{ id: 'south', name: 'South Branch', city: 'Gurgaon', color: 'bg-purple-500' },
{ id: 'east', name: 'East Branch', city: 'Faridabad', color: 'bg-orange-500' }];


const BATCHES = ['2024-25', '2023-24', '2022-23', '2021-22', '2020-21'];

// Branch-wise Data
const branchData: Record<string, any> = {
  main: {
    enquiries: 280, applications: 190, confirmed: 125, seats: 150, feeCollected: 1875000,
    pendingDocs: 10, categories: { general: 70, obc: 25, sc: 15, st: 5, ews: 10 },
    gender: { male: 68, female: 55, other: 2 },
    feeStatus: { fullPaid: 95, partial: 18, pending: 8, overdue: 4 },
    sources: { walkin: 75, phone: 55, website: 52, social: 38, reference: 32, newspaper: 18, other: 10 },
    monthly: [
    { month: 'Nov', enq: 15, app: 8, adm: 4 }, { month: 'Dec', enq: 28, app: 16, adm: 9 },
    { month: 'Jan', enq: 55, app: 35, adm: 20 }, { month: 'Feb', enq: 65, app: 45, adm: 28 },
    { month: 'Mar', enq: 72, app: 55, adm: 35 }, { month: 'Apr', enq: 30, app: 22, adm: 18 },
    { month: 'May', enq: 15, app: 9, adm: 11 }],

    classes: [
    { class: 'Nursery', seats: 15, admitted: 14 }, { class: 'LKG', seats: 15, admitted: 13 },
    { class: 'UKG', seats: 15, admitted: 12 }, { class: 'Class 1', seats: 18, admitted: 16 },
    { class: 'Class 2', seats: 15, admitted: 10 }, { class: 'Class 3', seats: 15, admitted: 9 },
    { class: 'Class 4', seats: 15, admitted: 8 }, { class: 'Class 5', seats: 15, admitted: 11 },
    { class: 'Class 6', seats: 17, admitted: 7 }, { class: 'Class 7', seats: 17, admitted: 6 },
    { class: 'Class 8', seats: 17, admitted: 5 }, { class: 'Class 9', seats: 20, admitted: 8 },
    { class: 'Class 10', seats: 20, admitted: 10 }, { class: 'Class 11', seats: 23, admitted: 14 },
    { class: 'Class 12', seats: 23, admitted: 8 }]

  },
  north: {
    enquiries: 180, applications: 120, confirmed: 72, seats: 100, feeCollected: 1080000,
    pendingDocs: 6, categories: { general: 40, obc: 15, sc: 8, st: 4, ews: 5 },
    gender: { male: 38, female: 33, other: 1 },
    feeStatus: { fullPaid: 55, partial: 10, pending: 5, overdue: 2 },
    sources: { walkin: 48, phone: 35, website: 32, social: 22, reference: 20, newspaper: 12, other: 11 },
    monthly: [
    { month: 'Nov', enq: 10, app: 5, adm: 2 }, { month: 'Dec', enq: 18, app: 10, adm: 6 },
    { month: 'Jan', enq: 35, app: 22, adm: 13 }, { month: 'Feb', enq: 42, app: 28, adm: 17 },
    { month: 'Mar', enq: 48, app: 35, adm: 22 }, { month: 'Apr', enq: 18, app: 13, adm: 8 },
    { month: 'May', enq: 9, app: 7, adm: 4 }],

    classes: [
    { class: 'Nursery', seats: 10, admitted: 9 }, { class: 'LKG', seats: 10, admitted: 8 },
    { class: 'UKG', seats: 10, admitted: 7 }, { class: 'Class 1', seats: 12, admitted: 10 },
    { class: 'Class 2', seats: 10, admitted: 6 }, { class: 'Class 3', seats: 10, admitted: 5 },
    { class: 'Class 4', seats: 10, admitted: 5 }, { class: 'Class 5', seats: 10, admitted: 6 },
    { class: 'Class 6', seats: 11, admitted: 4 }, { class: 'Class 7', seats: 11, admitted: 3 },
    { class: 'Class 8', seats: 11, admitted: 2 }, { class: 'Class 9', seats: 13, admitted: 5 },
    { class: 'Class 10', seats: 13, admitted: 6 }, { class: 'Class 11', seats: 15, admitted: 8 },
    { class: 'Class 12', seats: 15, admitted: 5 }]

  },
  south: {
    enquiries: 200, applications: 130, confirmed: 78, seats: 100, feeCollected: 1170000,
    pendingDocs: 7, categories: { general: 45, obc: 16, sc: 9, st: 4, ews: 4 },
    gender: { male: 42, female: 35, other: 1 },
    feeStatus: { fullPaid: 60, partial: 12, pending: 4, overdue: 2 },
    sources: { walkin: 55, phone: 40, website: 35, social: 25, reference: 22, newspaper: 14, other: 9 },
    monthly: [
    { month: 'Nov', enq: 12, app: 6, adm: 3 }, { month: 'Dec', enq: 22, app: 12, adm: 7 },
    { month: 'Jan', enq: 40, app: 25, adm: 15 }, { month: 'Feb', enq: 48, app: 32, adm: 20 },
    { month: 'Mar', enq: 52, app: 38, adm: 24 }, { month: 'Apr', enq: 18, app: 12, adm: 6 },
    { month: 'May', enq: 8, app: 5, adm: 3 }],

    classes: [
    { class: 'Nursery', seats: 10, admitted: 9 }, { class: 'LKG', seats: 10, admitted: 9 },
    { class: 'UKG', seats: 10, admitted: 8 }, { class: 'Class 1', seats: 12, admitted: 10 },
    { class: 'Class 2', seats: 10, admitted: 7 }, { class: 'Class 3', seats: 10, admitted: 6 },
    { class: 'Class 4', seats: 10, admitted: 5 }, { class: 'Class 5', seats: 10, admitted: 7 },
    { class: 'Class 6', seats: 11, admitted: 4 }, { class: 'Class 7', seats: 11, admitted: 3 },
    { class: 'Class 8', seats: 11, admitted: 3 }, { class: 'Class 9', seats: 13, admitted: 5 },
    { class: 'Class 10', seats: 13, admitted: 6 }, { class: 'Class 11', seats: 15, admitted: 9 },
    { class: 'Class 12', seats: 15, admitted: 6 }]

  },
  east: {
    enquiries: 120, applications: 80, confirmed: 45, seats: 80, feeCollected: 750000,
    pendingDocs: 4, categories: { general: 25, obc: 9, sc: 5, st: 2, ews: 4 },
    gender: { male: 24, female: 20, other: 1 },
    feeStatus: { fullPaid: 35, partial: 6, pending: 3, overdue: 1 },
    sources: { walkin: 32, phone: 26, website: 23, social: 13, reference: 11, newspaper: 8, other: 7 },
    monthly: [
    { month: 'Nov', enq: 8, app: 3, adm: 1 }, { month: 'Dec', enq: 12, app: 7, adm: 3 },
    { month: 'Jan', enq: 20, app: 13, adm: 7 }, { month: 'Feb', enq: 25, app: 15, adm: 10 },
    { month: 'Mar', enq: 28, app: 22, adm: 14 }, { month: 'Apr', enq: 19, app: 13, adm: 8 },
    { month: 'May', enq: 8, app: 7, adm: 2 }],

    classes: [
    { class: 'Nursery', seats: 8, admitted: 6 }, { class: 'LKG', seats: 8, admitted: 6 },
    { class: 'UKG', seats: 8, admitted: 5 }, { class: 'Class 1', seats: 10, admitted: 6 },
    { class: 'Class 2', seats: 8, admitted: 5 }, { class: 'Class 3', seats: 8, admitted: 5 },
    { class: 'Class 4', seats: 8, admitted: 4 }, { class: 'Class 5', seats: 8, admitted: 6 },
    { class: 'Class 6', seats: 9, admitted: 3 }, { class: 'Class 7', seats: 9, admitted: 3 },
    { class: 'Class 8', seats: 9, admitted: 2 }, { class: 'Class 9', seats: 10, admitted: 2 },
    { class: 'Class 10', seats: 10, admitted: 3 }, { class: 'Class 11', seats: 12, admitted: 4 },
    { class: 'Class 12', seats: 12, admitted: 3 }]

  }
};

// Types
interface KPIInfo {title: string;definition: string;calculation?: string;importance: string;example: string;}
interface PanelInfo {title: string;description: string;howToRead: string[];decisionHelp: string[];}

// Helper Functions
const formatIndianNumber = (num: number) => num.toLocaleString('en-IN');
const formatIndianCurrency = (num: number) => {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} Lakh`;
  return `₹${num.toLocaleString('en-IN')}`;
};
const getBranchColor = (id: string) => BRANCHES.find((b) => b.id === id)?.color || 'bg-gray-500';
const getBranchName = (id: string) => BRANCHES.find((b) => b.id === id)?.name || id;

// Components
const InfoModal = ({ isOpen, onClose, title, info }: {isOpen: boolean;onClose: () => void;title: string;info: KPIInfo | PanelInfo;}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />
        <div className="relative w-full max-w-lg p-6 bg-white rounded-xl shadow-xl">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg"><HelpCircle className="w-5 h-5 text-blue-600" /></div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
          </div>
          <div className="space-y-4">
            {'definition' in info &&
            <>
                <div><h4 className="text-sm font-medium text-gray-500 mb-1">What does this mean?</h4><p className="text-gray-700">{info.definition}</p></div>
                {info.calculation && <div><h4 className="text-sm font-medium text-gray-500 mb-1">How is it calculated?</h4><div className="p-3 bg-gray-50 rounded-lg font-mono text-sm">{info.calculation}</div></div>}
                <div><h4 className="text-sm font-medium text-gray-500 mb-1">Why is this important?</h4><p className="text-gray-700">{info.importance}</p></div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100"><h4 className="text-sm font-medium text-blue-800 mb-1">Example</h4><p className="text-blue-700 text-sm">{info.example}</p></div>
              </>
            }
            {'howToRead' in info &&
            <>
                <div><h4 className="text-sm font-medium text-gray-500 mb-1">What does this show?</h4><p className="text-gray-700">{info.description}</p></div>
                <div><h4 className="text-sm font-medium text-gray-500 mb-2">How to read this chart</h4>
                  <ul className="space-y-2">{info.howToRead.map((p, i) => <li key={i} className="flex items-start gap-2 text-sm text-gray-700"><ChevronRight className="w-4 h-4 text-blue-500 mt-0.5" />{p}</li>)}</ul>
                </div>
                <div><h4 className="text-sm font-medium text-gray-500 mb-2">How this helps in decision-making</h4>
                  <ul className="space-y-2">{info.decisionHelp.map((p, i) => <li key={i} className="flex items-start gap-2 text-sm text-gray-700"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />{p}</li>)}</ul>
                </div>
              </>
            }
          </div>
          <div className="mt-6 pt-4 border-t"><Button onClick={onClose} className="w-full">Got it, thanks!</Button></div>
        </div>
      </div>
    </div>);

};

const Tooltip = ({ children, content }: {children: React.ReactNode;content: string;}) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block">
      <div onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>{children}</div>
      {show && <div className="absolute z-50 px-3 py-2 text-xs text-white bg-gray-900 rounded-lg shadow-lg -top-2 left-full ml-2 w-48">{content}<div className="absolute w-2 h-2 bg-gray-900 rotate-45 -left-1 top-3" /></div>}
    </div>);

};

const InfoButton = ({ tooltip, onClick }: {tooltip: string;onClick: () => void;}) =>
<Tooltip content={tooltip}><button onClick={onClick} className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"><Info className="w-4 h-4" /></button></Tooltip>;


const KPICard = ({ title, value, subtitle, icon: Icon, trend, trendValue, color, tooltip, onInfoClick, branchBreakdown }: any) => {
  const colors: any = {
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-100' },
    green: { bg: 'bg-green-50', icon: 'text-green-600', border: 'border-green-100' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-100' },
    orange: { bg: 'bg-orange-50', icon: 'text-orange-600', border: 'border-orange-100' },
    red: { bg: 'bg-red-50', icon: 'text-red-600', border: 'border-red-100' },
    indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', border: 'border-indigo-100' }
  };
  const c = colors[color];
  return (
    <div className={`bg-white rounded-xl border ${c.border} p-5 hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-lg ${c.bg}`}><Icon className={`w-5 h-5 ${c.icon}`} /></div>
        <InfoButton tooltip={tooltip} onClick={onInfoClick} />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
      {trend && trendValue &&
      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1.5">
          {trend === 'up' ? <TrendingUp className="w-4 h-4 text-green-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
          <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>{trendValue}</span>
          <span className="text-xs text-gray-400">vs last year</span>
        </div>
      }
      {branchBreakdown && branchBreakdown.length > 1 &&
      <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
          {branchBreakdown.map((b: any) =>
        <div key={b.id} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${b.color}`} /><span className="text-gray-500">{b.name}</span></div>
              <span className="font-medium text-gray-700">{b.value}</span>
            </div>
        )}
        </div>
      }
    </div>);

};

const PanelHeader = ({ title, description, tooltip, onInfoClick }: any) =>
<div className="flex items-start justify-between mb-4">
    <div><h3 className="text-lg font-semibold text-gray-900">{title}</h3><p className="text-sm text-gray-500 mt-0.5">{description}</p></div>
    <InfoButton tooltip={tooltip} onClick={onInfoClick} />
  </div>;


// Main Component
export function AdmissionSummary() {
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedBatch, setSelectedBatch] = useState('2024-25');
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [activeInfoModal, setActiveInfoModal] = useState<{type: 'kpi' | 'panel';id: string;} | null>(null);
  const [filters, setFilters] = useState({ stream: 'all', dateFrom: '', dateTo: '' });

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
      const d = branchData[id];
      return {
        enquiries: acc.enquiries + d.enquiries, applications: acc.applications + d.applications,
        confirmed: acc.confirmed + d.confirmed, seats: acc.seats + d.seats, feeCollected: acc.feeCollected + d.feeCollected,
        pendingDocs: acc.pendingDocs + d.pendingDocs,
        categories: { general: acc.categories.general + d.categories.general, obc: acc.categories.obc + d.categories.obc, sc: acc.categories.sc + d.categories.sc, st: acc.categories.st + d.categories.st, ews: acc.categories.ews + d.categories.ews },
        gender: { male: acc.gender.male + d.gender.male, female: acc.gender.female + d.gender.female, other: acc.gender.other + d.gender.other },
        feeStatus: { fullPaid: acc.feeStatus.fullPaid + d.feeStatus.fullPaid, partial: acc.feeStatus.partial + d.feeStatus.partial, pending: acc.feeStatus.pending + d.feeStatus.pending, overdue: acc.feeStatus.overdue + d.feeStatus.overdue }
      };
    }, { enquiries: 0, applications: 0, confirmed: 0, seats: 0, feeCollected: 0, pendingDocs: 0, categories: { general: 0, obc: 0, sc: 0, st: 0, ews: 0 }, gender: { male: 0, female: 0, other: 0 }, feeStatus: { fullPaid: 0, partial: 0, pending: 0, overdue: 0 } });
  }, [activeBranches]);

  const conversionRate = stats.applications > 0 ? (stats.confirmed / stats.applications * 100).toFixed(1) : '0';
  const seatsFillRate = stats.seats > 0 ? (stats.confirmed / stats.seats * 100).toFixed(0) : '0';

  // KPI Info Data
  const kpiInfo: Record<string, KPIInfo> = {
    enquiries: { title: 'Total Enquiries', definition: 'Total count of unique admission enquiries received by your school from all sources.', importance: 'Tracking enquiries helps you understand parent interest and marketing effectiveness.', example: 'If you receive 50 walk-in, 30 phone, and 20 website enquiries, Total = 100.' },
    applications: { title: 'Applications Submitted', definition: 'Number of students/parents who submitted admission application forms.', calculation: 'Count of all submitted application forms', importance: 'Shows how many enquiries convert to serious interest.', example: 'Out of 780 enquiries, if 520 submitted forms, application rate is 66.7%.' },
    confirmed: { title: 'Admissions Confirmed', definition: 'Count of students whose admission is approved AND who have paid fees.', calculation: 'Count of approved admissions with fee payment received', importance: 'This is your actual admission count for planning.', example: 'If 350 approved but only 320 paid, Confirmed = 320.' },
    conversionRate: { title: 'Overall Conversion Rate', definition: 'Percentage of applications that converted to confirmed admissions.', calculation: '(Admissions Confirmed ÷ Applications Submitted) × 100', importance: 'Higher rate means effective admission process.', example: '320 confirmed ÷ 520 applications × 100 = 61.5%' },
    seatsFilled: { title: 'Seats Filled', definition: 'Confirmed admissions vs total sanctioned seats available.', calculation: 'Confirmed Admissions ÷ Total Seats × 100', importance: 'Helps understand capacity utilization.', example: '35 confirmed ÷ 40 seats = 87.5% filled' },
    feeCollected: { title: 'Fee Collected', definition: 'Total fees collected from newly admitted students.', importance: 'Directly impacts school revenue and cash flow.', example: '320 students × ₹15,234 avg = ₹48,75,000' },
    pendingDocs: { title: 'Pending Documents', definition: 'Admitted students with incomplete document submission.', importance: 'Complete documentation required for official enrollment.', example: '27 out of 320 missing TC or Birth Certificate.' }
  };

  const panelInfo: Record<string, PanelInfo> = {
    funnel: { title: 'Admission Funnel', description: 'Shows student journey from enquiry to confirmation.', howToRead: ['Each bar shows count at that stage', 'Percentage shows progression from previous stage', 'Look for stages with big drops'], decisionHelp: ['Low applications? Improve follow-up calls', 'Low approvals? Review selection criteria', 'Low confirmations? Check fee competitiveness'] },
    classWise: { title: 'Class-wise Seats', description: 'Seat availability and admission status per class.', howToRead: ['Bar shows seat fill percentage', 'Green >90%, Blue 50-90%, Orange <50%', 'High/Low demand indicators'], decisionHelp: ['Plan sections for high demand classes', 'Focus marketing on low fill classes', 'Stop admissions for full classes'] },
    monthlyTrend: { title: 'Monthly Trend', description: 'Track admissions over months.', howToRead: ['Blue = Enquiries, Purple = Applications, Green = Admissions', 'Peaks show busy months'], decisionHelp: ['Plan staff for peak months', 'Time advertisements before peaks', 'Identify slow months for drives'] },
    categoryGender: { title: 'Category & Gender', description: 'Diversity distribution of admitted students.', howToRead: ['Each segment = percentage of total', 'Categories per government norms'], decisionHelp: ['Ensure reservation compliance', 'Plan facilities based on gender ratio'] },
    feeStatus: { title: 'Fee Status', description: 'Fee collection status from new admissions.', howToRead: ['Green = fully paid, Yellow = partial', 'Red = overdue'], decisionHelp: ['Follow up pending payments', 'Offer payment plans', 'Flag overdue cases'] },
    enquirySource: { title: 'Enquiry Sources', description: 'Which channels bring most enquiries.', howToRead: ['Compare enquiry counts across sources', 'Check conversion rates'], decisionHelp: ['Invest in high-conversion sources', 'Improve or stop weak channels'] }
  };

  // Funnel Data
  const funnelStages = [
  { stage: 'Enquiries', count: stats.enquiries, color: 'bg-blue-500' },
  { stage: 'Applications', count: stats.applications, color: 'bg-purple-500' },
  { stage: 'Shortlisted', count: Math.round(stats.applications * 0.79), color: 'bg-indigo-500' },
  { stage: 'Approved', count: Math.round(stats.confirmed * 1.09), color: 'bg-orange-500' },
  { stage: 'Confirmed', count: stats.confirmed, color: 'bg-green-500' }];


  // Aggregated Classes
  const aggregatedClasses = useMemo(() => {
    const classMap: Record<string, {seats: number;admitted: number;}> = {};
    activeBranches.forEach((branch) => {
      branchData[branch.id].classes.forEach((c: any) => {
        if (!classMap[c.class]) classMap[c.class] = { seats: 0, admitted: 0 };
        classMap[c.class].seats += c.seats;
        classMap[c.class].admitted += c.admitted;
      });
    });
    return Object.entries(classMap).map(([cls, data]) => ({ class: cls, ...data, demand: data.admitted / data.seats > 0.9 ? 'high' : data.admitted / data.seats < 0.5 ? 'low' : 'normal' }));
  }, [activeBranches]);

  // Aggregated Monthly
  const aggregatedMonthly = useMemo(() => {
    const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];
    return months.map((month, i) => ({
      month,
      enquiries: activeBranches.reduce((sum, b) => sum + branchData[b.id].monthly[i].enq, 0),
      applications: activeBranches.reduce((sum, b) => sum + branchData[b.id].monthly[i].app, 0),
      admissions: activeBranches.reduce((sum, b) => sum + branchData[b.id].monthly[i].adm, 0)
    }));
  }, [activeBranches]);

  // Sources Data
  const sourceKeys = ['walkin', 'phone', 'website', 'social', 'reference', 'newspaper', 'other'];
  const sourceNames: Record<string, string> = { walkin: 'Walk-in', phone: 'Phone Call', website: 'Website', social: 'Social Media', reference: 'Reference', newspaper: 'Newspaper', other: 'Other' };
  const sourceIcons: Record<string, any> = { walkin: Users, phone: Phone, website: Globe, social: Megaphone, reference: UserCircle, newspaper: Newspaper, other: FileText };
  const aggregatedSources = useMemo(() => sourceKeys.map((key) => ({
    source: sourceNames[key], icon: sourceIcons[key],
    enquiries: activeBranches.reduce((sum, b) => sum + branchData[b.id].sources[key], 0),
    admissions: Math.round(activeBranches.reduce((sum, b) => sum + branchData[b.id].sources[key], 0) * 0.45)
  })), [activeBranches]);

  return (
    <div className="h-screen overflow-hidden bg-gray-50">
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 10px; } .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 5px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 5px; } .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }`}</style>
      
      <div className="h-full overflow-y-auto custom-scrollbar">
        <div className="p-6 space-y-6 pb-12">
          {/* Header */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between sticky top-0 bg-gray-50 py-2 z-10">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admission Summary</h1>
              <p className="text-gray-500 mt-1">Batch: {selectedBatch} • Complete overview of admission data</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-2 rounded-lg border"><Calendar className="w-4 h-4" /><span>Last updated: {new Date().toLocaleString()}</span></div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4"><Filter className="w-5 h-5 text-gray-500" /><span className="font-medium text-gray-700">Filters</span></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Batch */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Academic Year</label>
                <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500">
                  {BATCHES.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              
              {/* Branch Multi-Select */}
              <div className="relative">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Branch / Campus</label>
                <button onClick={() => setShowBranchDropdown(!showBranchDropdown)} className="w-full flex items-center gap-2 px-3 py-2 text-sm border rounded-lg bg-white">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  <span className="flex-1 text-left">{isAllSelected ? 'All Branches' : `${selectedBranches.length} Selected`}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                {showBranchDropdown &&
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border rounded-lg shadow-lg z-50">
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
                            <div className={`w-3 h-3 rounded-full ${branch.color}`} />
                            <div><p className="text-sm font-medium">{branch.name}</p><p className="text-xs text-gray-500">{branch.city}</p></div>
                          </div>);

                    })}
                    </div>
                    <div className="border-t p-2"><button onClick={() => setShowBranchDropdown(false)} className="w-full py-2 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600">Apply</button></div>
                  </div>
                }
              </div>

              <div><label className="block text-xs font-medium text-gray-500 mb-1.5">Stream</label><select value={filters.stream} onChange={(e) => setFilters({ ...filters, stream: e.target.value })} className="w-full px-3 py-2 text-sm border rounded-lg"><option value="all">All</option><option value="science">Science</option><option value="commerce">Commerce</option><option value="arts">Arts</option></select></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1.5">Date From</label><input type="date" value={filters.dateFrom} onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })} className="w-full px-3 py-2 text-sm border rounded-lg" /></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1.5">Date To</label><input type="date" value={filters.dateTo} onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })} className="w-full px-3 py-2 text-sm border rounded-lg" /></div>
            </div>
          </div>

          {/* Selected Branches Tags */}
          {!isAllSelected && selectedBranches.length > 0 &&
          <div className="flex flex-wrap gap-2">
              {selectedBranches.map((id) => {
              const branch = BRANCHES.find((b) => b.id === id);
              return branch &&
              <span key={id} className="inline-flex items-center gap-2 px-3 py-1 bg-white border rounded-full text-sm">
                    <span className={`w-2 h-2 rounded-full ${branch.color}`} />{branch.name}
                    <X className="w-3 h-3 cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => toggleBranch(id)} />
                  </span>;

            })}
              <button onClick={() => setSelectedBranches([])} className="text-sm text-blue-600 hover:text-blue-800 px-2">Clear All</button>
            </div>
          }

          {/* Branch Overview Table */}
          {activeBranches.length > 1 &&
          <div className="bg-white rounded-xl border p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Branch-wise Overview</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="border-b">{['Branch', 'Enquiries', 'Applications', 'Confirmed', 'Seats', 'Fill %', 'Fee Collected'].map((h) => <th key={h} className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">{h}</th>)}</tr></thead>
                  <tbody className="divide-y">
                    {activeBranches.map((branch) => {
                    const d = branchData[branch.id];
                    return (
                      <tr key={branch.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4"><div className="flex items-center gap-2"><div className={`w-3 h-3 rounded-full ${branch.color}`} /><div><p className="font-medium text-gray-900">{branch.name}</p><p className="text-xs text-gray-500">{branch.city}</p></div></div></td>
                          <td className="py-3 px-4 font-medium">{d.enquiries}</td>
                          <td className="py-3 px-4">{d.applications}</td>
                          <td className="py-3 px-4 text-green-600 font-medium">{d.confirmed}</td>
                          <td className="py-3 px-4">{d.seats}</td>
                          <td className="py-3 px-4"><span className={`px-2 py-1 rounded text-xs font-medium ${d.confirmed / d.seats >= 0.8 ? 'bg-green-100 text-green-700' : d.confirmed / d.seats >= 0.5 ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>{(d.confirmed / d.seats * 100).toFixed(0)}%</span></td>
                          <td className="py-3 px-4 text-blue-600 font-medium">{formatIndianCurrency(d.feeCollected)}</td>
                        </tr>);

                  })}
                    <tr className="bg-gray-50 font-semibold">
                      <td className="py-3 px-4">Total</td>
                      <td className="py-3 px-4">{stats.enquiries}</td>
                      <td className="py-3 px-4">{stats.applications}</td>
                      <td className="py-3 px-4 text-green-600">{stats.confirmed}</td>
                      <td className="py-3 px-4">{stats.seats}</td>
                      <td className="py-3 px-4"><span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">{seatsFillRate}%</span></td>
                      <td className="py-3 px-4 text-blue-600">{formatIndianCurrency(stats.feeCollected)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          }

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard title="Total Enquiries" value={formatIndianNumber(stats.enquiries)} subtitle="Unique enquiries received" icon={Users} color="blue" trend="up" trendValue="+12%" tooltip="Count of all admission enquiries" onInfoClick={() => setActiveInfoModal({ type: 'kpi', id: 'enquiries' })} branchBreakdown={activeBranches.length > 1 ? activeBranches.map((b) => ({ id: b.id, name: b.name, color: b.color, value: branchData[b.id].enquiries })) : null} />
            <KPICard title="Applications Submitted" value={formatIndianNumber(stats.applications)} subtitle="Forms submitted" icon={FileText} color="purple" trend="up" trendValue="+8%" tooltip="Admission forms submitted" onInfoClick={() => setActiveInfoModal({ type: 'kpi', id: 'applications' })} branchBreakdown={activeBranches.length > 1 ? activeBranches.map((b) => ({ id: b.id, name: b.name, color: b.color, value: branchData[b.id].applications })) : null} />
            <KPICard title="Admissions Confirmed" value={formatIndianNumber(stats.confirmed)} subtitle="Approved with fee paid" icon={UserCheck} color="green" trend="up" trendValue="+15%" tooltip="Confirmed admissions" onInfoClick={() => setActiveInfoModal({ type: 'kpi', id: 'confirmed' })} branchBreakdown={activeBranches.length > 1 ? activeBranches.map((b) => ({ id: b.id, name: b.name, color: b.color, value: branchData[b.id].confirmed })) : null} />
            <KPICard title="Conversion Rate" value={`${conversionRate}%`} subtitle="Application to admission" icon={Target} color="indigo" trend="up" trendValue="+3.2%" tooltip="Percentage of applications converted" onInfoClick={() => setActiveInfoModal({ type: 'kpi', id: 'conversionRate' })} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KPICard title="Seats Filled" value={`${stats.confirmed} / ${stats.seats}`} subtitle={`${seatsFillRate}% of capacity`} icon={BookOpen} color="orange" trend="up" trendValue="+5%" tooltip="Seats filled vs available" onInfoClick={() => setActiveInfoModal({ type: 'kpi', id: 'seatsFilled' })} />
            <KPICard title="Fee Collected" value={formatIndianCurrency(stats.feeCollected)} subtitle="From new admissions" icon={IndianRupee} color="green" trend="up" trendValue="+22%" tooltip="Total fees collected" onInfoClick={() => setActiveInfoModal({ type: 'kpi', id: 'feeCollected' })} branchBreakdown={activeBranches.length > 1 ? activeBranches.map((b) => ({ id: b.id, name: b.name, color: b.color, value: formatIndianCurrency(branchData[b.id].feeCollected) })) : null} />
            <KPICard title="Pending Documents" value={formatIndianNumber(stats.pendingDocs)} subtitle="Incomplete submissions" icon={AlertCircle} color="red" trend="down" trendValue="-8" tooltip="Students with pending docs" onInfoClick={() => setActiveInfoModal({ type: 'kpi', id: 'pendingDocs' })} />
          </div>

          {/* Panels Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Funnel */}
            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <PanelHeader title="Admission Funnel" description="Student journey from enquiry to confirmation" tooltip="Shows drop-off at each stage" onInfoClick={() => setActiveInfoModal({ type: 'panel', id: 'funnel' })} />
              <div className="space-y-3">
                {funnelStages.map((item, i) => {
                  const pct = stats.enquiries > 0 ? item.count / stats.enquiries * 100 : 0;
                  const prevPct = i > 0 && funnelStages[i - 1].count > 0 ? (item.count / funnelStages[i - 1].count * 100).toFixed(1) : '100';
                  return (
                    <div key={i} className="relative">
                      <div className={`${item.color} rounded-lg p-4 transition-all hover:shadow-md`} style={{ width: `${Math.max(pct, 30)}%`, marginLeft: `${i * 2}%` }}>
                        <div className="flex items-center justify-between text-white">
                          <span className="font-medium text-sm">{item.stage}</span>
                          <div className="flex items-center gap-3">
                            <span className="font-bold">{formatIndianNumber(item.count)}</span>
                            {i > 0 && <span className="text-xs bg-white/20 px-2 py-0.5 rounded">{prevPct}%</span>}
                          </div>
                        </div>
                      </div>
                      {i < funnelStages.length - 1 && <div className="absolute -bottom-2 left-1/4"><ArrowDownRight className="w-4 h-4 text-gray-300" /></div>}
                    </div>);

                })}
              </div>
              <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm">
                <span className="text-gray-500">Overall Funnel Conversion</span>
                <span className="font-bold text-green-600">{stats.enquiries > 0 ? (stats.confirmed / stats.enquiries * 100).toFixed(1) : 0}%</span>
              </div>
            </div>

            {/* Class-wise */}
            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <PanelHeader title="Class-wise Seats & Admissions" description="Seat availability per class" tooltip="Compare seats vs admissions" onInfoClick={() => setActiveInfoModal({ type: 'panel', id: 'classWise' })} />
              <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                {aggregatedClasses.map((item, i) => {
                  const fillPct = item.seats > 0 ? item.admitted / item.seats * 100 : 0;
                  return (
                    <div key={i} className="flex items-center gap-3 hover:bg-gray-50 p-1 rounded">
                      <span className="w-16 text-xs font-medium text-gray-600">{item.class}</span>
                      <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden relative">
                        <div className={`h-full rounded-full ${fillPct > 90 ? 'bg-green-500' : fillPct > 50 ? 'bg-blue-500' : 'bg-orange-500'}`} style={{ width: `${fillPct}%` }} />
                        <div className="absolute inset-0 flex items-center justify-center"><span className="text-xs font-medium text-gray-700">{item.admitted}/{item.seats}</span></div>
                      </div>
                      <span className="w-12 text-xs text-right text-gray-500">{fillPct.toFixed(0)}%</span>
                      {item.demand === 'high' && <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded">High</span>}
                      {item.demand === 'low' && <span className="px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-700 rounded">Low</span>}
                    </div>);

                })}
              </div>
              <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4 text-center">
                <div><p className="text-xs text-gray-500">Total Seats</p><p className="font-bold text-gray-900">{aggregatedClasses.reduce((s, c) => s + c.seats, 0)}</p></div>
                <div><p className="text-xs text-gray-500">Filled</p><p className="font-bold text-green-600">{aggregatedClasses.reduce((s, c) => s + c.admitted, 0)}</p></div>
                <div><p className="text-xs text-gray-500">Available</p><p className="font-bold text-orange-600">{aggregatedClasses.reduce((s, c) => s + c.seats - c.admitted, 0)}</p></div>
              </div>
            </div>
          </div>

          {/* Panels Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Monthly Trend */}
            <div className="lg:col-span-2 bg-white rounded-xl border p-6 shadow-sm">
              <PanelHeader title="Monthly Admission Trend" description="Track admissions over months" tooltip="Seasonal patterns" onInfoClick={() => setActiveInfoModal({ type: 'panel', id: 'monthlyTrend' })} />
              <div className="h-64 relative">
                <div className="absolute left-0 top-0 bottom-8 w-10 flex flex-col justify-between text-xs text-gray-400">{[200, 150, 100, 50, 0].map((n) => <span key={n}>{n}</span>)}</div>
                <div className="ml-12 h-full flex items-end justify-between gap-2 pb-8">
                  {aggregatedMonthly.map((item, i) =>
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                      <div className="w-full flex items-end justify-center gap-1 h-44">
                        <div className="w-3 bg-blue-500 rounded-t group-hover:bg-blue-600" style={{ height: `${Math.min(item.enquiries / 200 * 100, 100)}%` }} title={`Enquiries: ${item.enquiries}`} />
                        <div className="w-3 bg-purple-500 rounded-t group-hover:bg-purple-600" style={{ height: `${Math.min(item.applications / 200 * 100, 100)}%` }} title={`Applications: ${item.applications}`} />
                        <div className="w-3 bg-green-500 rounded-t group-hover:bg-green-600" style={{ height: `${Math.min(item.admissions / 200 * 100, 100)}%` }} title={`Admissions: ${item.admissions}`} />
                      </div>
                      <span className="text-xs text-gray-500">{item.month}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                {[['Enquiries', 'bg-blue-500'], ['Applications', 'bg-purple-500'], ['Admissions', 'bg-green-500']].map(([label, color]) =>
                <div key={label} className="flex items-center gap-2"><div className={`w-3 h-3 ${color} rounded`} /><span className="text-gray-600">{label}</span></div>
                )}
              </div>
            </div>

            {/* Category & Gender */}
            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <PanelHeader title="Category & Gender" description="Student diversity" tooltip="Breakdown by category and gender" onInfoClick={() => setActiveInfoModal({ type: 'panel', id: 'categoryGender' })} />
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">By Category</h4>
                <div className="space-y-2">
                  {[['General', stats.categories.general, 'bg-blue-500'], ['OBC', stats.categories.obc, 'bg-purple-500'], ['SC', stats.categories.sc, 'bg-orange-500'], ['ST', stats.categories.st, 'bg-green-500'], ['EWS', stats.categories.ews, 'bg-red-500']].map(([name, count, color]) =>
                  <div key={name as string} className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded">
                      <div className={`w-3 h-3 rounded-full ${color}`} />
                      <span className="flex-1 text-sm text-gray-600">{name}</span>
                      <span className="text-sm font-medium text-gray-900">{count as number}</span>
                      <span className="text-xs text-gray-400 w-12 text-right">{stats.confirmed > 0 ? ((count as number) / stats.confirmed * 100).toFixed(1) : 0}%</span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">By Gender</h4>
                <div className="flex gap-2 mb-3">
                  {[['male', 'bg-blue-500'], ['female', 'bg-pink-500'], ['other', 'bg-gray-500']].map(([key, color]) =>
                  <div key={key} className={`${color} h-4 rounded-full`} style={{ width: `${stats.confirmed > 0 ? stats.gender[key as keyof typeof stats.gender] / stats.confirmed * 100 : 0}%` }} />
                  )}
                </div>
                <div className="flex justify-between text-xs">
                  {[['Male', stats.gender.male, 'bg-blue-500'], ['Female', stats.gender.female, 'bg-pink-500'], ['Other', stats.gender.other, 'bg-gray-500']].map(([name, count, color]) =>
                  <div key={name as string} className="flex items-center gap-1"><div className={`w-2 h-2 rounded-full ${color}`} /><span className="text-gray-600">{name}: {count as number}</span></div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Panels Row 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fee Status */}
            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <PanelHeader title="Fee Status for New Admissions" description="Collection status" tooltip="Monitor fee payment health" onInfoClick={() => setActiveInfoModal({ type: 'panel', id: 'feeStatus' })} />
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                ['Fully Paid', stats.feeStatus.fullPaid, stats.feeStatus.fullPaid * 15000, 'bg-green-50 border-green-200'],
                ['Partially Paid', stats.feeStatus.partial, stats.feeStatus.partial * 15000, 'bg-yellow-50 border-yellow-200'],
                ['Pending', stats.feeStatus.pending, stats.feeStatus.pending * 14000, 'bg-orange-50 border-orange-200'],
                ['Overdue', stats.feeStatus.overdue, stats.feeStatus.overdue * 7000, 'bg-red-50 border-red-200']].
                map(([status, count, amount, classes]) =>
                <div key={status as string} className={`p-4 rounded-lg border ${classes} hover:shadow-md cursor-pointer`}>
                    <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium text-gray-700">{status}</span><span className="text-lg font-bold text-gray-900">{count as number}</span></div>
                    <p className="text-sm text-gray-600">{formatIndianCurrency(amount as number)}</p>
                  </div>
                )}
              </div>
              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between items-center"><span className="text-sm text-gray-500">Total Expected</span><span className="font-bold text-gray-900">{formatIndianCurrency(stats.confirmed * 18000)}</span></div>
                <div className="flex justify-between items-center"><span className="text-sm text-gray-500">Total Collected</span><span className="font-bold text-green-600">{formatIndianCurrency(stats.feeCollected)}</span></div>
                <div className="flex justify-between items-center"><span className="text-sm text-gray-500">Collection Rate</span><span className="font-bold text-blue-600">{stats.confirmed > 0 ? (stats.feeCollected / (stats.confirmed * 18000) * 100).toFixed(1) : 0}%</span></div>
              </div>
            </div>

            {/* Enquiry Source */}
            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <PanelHeader title="Enquiry Source Breakdown" description="Channel effectiveness" tooltip="Know your best marketing channels" onInfoClick={() => setActiveInfoModal({ type: 'panel', id: 'enquirySource' })} />
              <div className="space-y-3">
                {aggregatedSources.map((item, i) => {
                  const maxEnq = Math.max(...aggregatedSources.map((d) => d.enquiries));
                  const convRate = item.enquiries > 0 ? (item.admissions / item.enquiries * 100).toFixed(1) : '0';
                  return (
                    <div key={i} className="group hover:bg-gray-50 p-2 rounded-lg">
                      <div className="flex items-center gap-3 mb-1">
                        <item.icon className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                        <span className="flex-1 text-sm font-medium text-gray-700">{item.source}</span>
                        <span className="text-sm text-gray-600">{item.enquiries}</span>
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">{convRate}% conv.</span>
                      </div>
                      <div className="ml-7 flex gap-1">
                        <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${item.enquiries / maxEnq * 100}%` }} />
                        <div className="h-2 bg-green-500 rounded-full" style={{ width: `${item.admissions / maxEnq * 100}%` }} />
                      </div>
                    </div>);

                })}
              </div>
              <div className="mt-4 pt-4 border-t flex items-center justify-center gap-6 text-xs">
                {[['Enquiries', 'bg-blue-500'], ['Converted', 'bg-green-500']].map(([label, color]) =>
                <div key={label} className="flex items-center gap-2"><div className={`w-3 h-3 ${color} rounded`} /><span className="text-gray-600">{label}</span></div>
                )}
              </div>
            </div>
          </div>

          {/* Back to Top */}
          <div className="flex justify-center pt-4">
            <button onClick={() => document.querySelector('.custom-scrollbar')?.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-white border rounded-lg hover:bg-gray-50 shadow-sm">
              <ChevronDown className="w-4 h-4 rotate-180" />Back to Top
            </button>
          </div>
        </div>
      </div>

      {/* Info Modals */}
      {activeInfoModal?.type === 'kpi' && kpiInfo[activeInfoModal.id] &&
      <InfoModal isOpen={true} onClose={() => setActiveInfoModal(null)} title={kpiInfo[activeInfoModal.id].title} info={kpiInfo[activeInfoModal.id]} />
      }
      {activeInfoModal?.type === 'panel' && panelInfo[activeInfoModal.id] &&
      <InfoModal isOpen={true} onClose={() => setActiveInfoModal(null)} title={panelInfo[activeInfoModal.id].title} info={panelInfo[activeInfoModal.id]} />
      }
    </div>);

}

export default AdmissionSummary;