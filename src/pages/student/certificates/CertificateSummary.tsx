import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  FileText, Award, Users, TrendingUp, ArrowRight, Printer, Download, Info, X, Clock,
  CheckCircle, AlertCircle, RefreshCw, Search, Filter, Eye, BarChart3, AlertTriangle,
  BookOpen, GraduationCap, UserCheck, FileCheck, Target, Zap, HelpCircle, ChevronRight,
  ArrowUpRight, ArrowDownRight, Plus, MoreVertical, ExternalLink, Copy, Share2, Activity,
  PieChart, LayoutGrid, List, Timer, Sparkles, ThumbsUp, MessageSquare, Mail, ChevronDown,
  Building2, Calendar } from
'lucide-react';

// Types
interface InfoPanelContent {
  title: string;icon: React.ElementType;iconColor: string;iconBg: string;
  description: string;purpose: string;importance: string;keyPoints: string[];
  metrics?: {label: string;value: string;description: string;}[];
  tips?: string[];relatedActions?: {label: string;icon: React.ElementType;}[];
  faqs?: {question: string;answer: string;}[];
}

interface BranchData {
  id: string;name: string;code: string;
  certificates: {bonafide: number;leaving: number;character: number;transfer: number;};
  pending: number;avgTime: string;
}

// Constants
const BATCHES = ['2024-2025', '2023-2024', '2022-2023', '2021-2022'];
const BRANCHES: BranchData[] = [
{ id: 'cse', name: 'Computer Science', code: 'CSE', certificates: { bonafide: 85, leaving: 28, character: 52, transfer: 12 }, pending: 5, avgTime: '4h' },
{ id: 'ece', name: 'Electronics & Comm', code: 'ECE', certificates: { bonafide: 62, leaving: 22, character: 38, transfer: 8 }, pending: 4, avgTime: '5h' },
{ id: 'me', name: 'Mechanical Eng', code: 'ME', certificates: { bonafide: 48, leaving: 18, character: 32, transfer: 6 }, pending: 3, avgTime: '6h' },
{ id: 'ce', name: 'Civil Engineering', code: 'CE', certificates: { bonafide: 32, leaving: 12, character: 22, transfer: 5 }, pending: 2, avgTime: '4h' },
{ id: 'ee', name: 'Electrical Eng', code: 'EE', certificates: { bonafide: 18, leaving: 9, character: 12, transfer: 3 }, pending: 2, avgTime: '5h' }];


const COLOR_MAP: Record<string, {bg: string;icon: string;light: string;border: string;}> = {
  blue: { bg: 'bg-blue-500', icon: 'text-blue-600', light: 'bg-blue-50', border: 'border-blue-200' },
  green: { bg: 'bg-green-500', icon: 'text-green-600', light: 'bg-green-50', border: 'border-green-200' },
  purple: { bg: 'bg-purple-500', icon: 'text-purple-600', light: 'bg-purple-50', border: 'border-purple-200' },
  orange: { bg: 'bg-orange-500', icon: 'text-orange-600', light: 'bg-orange-50', border: 'border-orange-200' },
  indigo: { bg: 'bg-indigo-500', icon: 'text-indigo-600', light: 'bg-indigo-50', border: 'border-indigo-200' },
  amber: { bg: 'bg-amber-500', icon: 'text-amber-600', light: 'bg-amber-50', border: 'border-amber-200' },
  cyan: { bg: 'bg-cyan-500', icon: 'text-cyan-600', light: 'bg-cyan-50', border: 'border-cyan-200' },
  rose: { bg: 'bg-rose-500', icon: 'text-rose-600', light: 'bg-rose-50', border: 'border-rose-200' }
};

const CERT_TYPES = [
{ id: 'bonafide', label: 'Bonafide', icon: FileText, color: 'blue' },
{ id: 'leaving', label: 'Leaving', icon: Award, color: 'green' },
{ id: 'character', label: 'Character', icon: UserCheck, color: 'purple' },
{ id: 'transfer', label: 'Transfer', icon: TrendingUp, color: 'orange' }];


// Info Panel Data (condensed)
const infoPanelData: Record<string, InfoPanelContent> = {
  overview: {
    title: 'Certificate Summary Dashboard', icon: LayoutGrid, iconColor: 'text-blue-600', iconBg: 'bg-blue-100',
    description: 'Comprehensive overview of all certificate-related activities with branch-wise breakdown.',
    purpose: 'Enable efficient management of certificate requests across all branches and batches.',
    importance: 'Certificates are official documents students require. Efficient management ensures satisfaction and compliance.',
    keyPoints: ['Real-time tracking by branch', 'Pending request management', 'Historical trend analysis', 'Quick action shortcuts', 'Comprehensive reporting'],
    metrics: [{ label: 'Total Certificates', value: '524', description: 'All certificates this year' }, { label: 'Processing Time', value: '1.5 days', description: 'Average time' }, { label: 'Satisfaction', value: '98%', description: 'Based on feedback' }],
    tips: ['Review pending requests daily', 'Set up automated reminders', 'Generate weekly reports', 'Keep templates updated']
  },
  bonafide: {
    title: 'Bonafide Certificate', icon: FileText, iconColor: 'text-blue-600', iconBg: 'bg-blue-100',
    description: 'Official document certifying student enrollment in the institution.',
    purpose: 'Required for bank accounts, scholarships, passport verification, and official purposes.',
    importance: 'Most frequently requested certificate. Quick turnaround impacts student experience.',
    keyPoints: ['Valid for current academic year', 'Contains student details and enrollment status', 'Bears official seal and signature', 'Can be issued multiple times', 'No fee clearance required'],
    metrics: [{ label: 'Total Issued', value: '245', description: 'This academic year' }, { label: 'This Month', value: '32', description: 'Current month' }, { label: 'Avg. Processing', value: '4 hours', description: 'Request to issuance' }],
    tips: ['Process requests same day', 'Verify enrollment status', 'Maintain digital register', 'Use bulk issuance for class-wide requirements']
  },
  leaving: {
    title: 'Leaving Certificate (LC)', icon: Award, iconColor: 'text-green-600', iconBg: 'bg-green-100',
    description: 'Issued when a student permanently leaves the school.',
    purpose: 'Required for admission to another institution. Contains complete academic record.',
    importance: 'Legally significant document issued only once. Errors impact student\'s future education.',
    keyPoints: ['Issued only once per student', 'Contains complete academic history', 'Requires clearance of all dues', 'Cannot be issued without withdrawal application', 'Original kept by receiving institution'],
    metrics: [{ label: 'Total Issued', value: '89', description: 'This year' }, { label: 'Pending Clearance', value: '8', description: 'Awaiting clearance' }, { label: 'Avg. Processing', value: '3 days', description: 'Complete processing' }],
    tips: ['Create clearance checklist', 'Coordinate with all departments', 'Keep scanned copies', 'Double-check all details']
  },
  character: {
    title: 'Character Certificate', icon: UserCheck, iconColor: 'text-purple-600', iconBg: 'bg-purple-100',
    description: 'Attests to moral character and conduct during tenure at school.',
    purpose: 'Required for higher education, jobs, government services, and visa applications.',
    importance: 'Reflects school\'s assessment. Accurate assessment crucial for student opportunities.',
    keyPoints: ['Based on conduct record', 'Reflects behavior and discipline', 'Valid for specified period', 'Available to current students and alumni', 'Mentions achievements or concerns'],
    metrics: [{ label: 'Total Issued', value: '156', description: 'This year' }, { label: 'Alumni', value: '45', description: 'From former students' }, { label: 'Current', value: '111', description: 'Enrolled students' }],
    tips: ['Review disciplinary records', 'Consult class teacher', 'Mention special achievements', 'Be factual and fair']
  },
  transfer: {
    title: 'Transfer Certificate (TC)', icon: TrendingUp, iconColor: 'text-orange-600', iconBg: 'bg-orange-100',
    description: 'Issued for transfers within same education board.',
    purpose: 'Essential for admission to another school under same board.',
    importance: 'Must comply with board regulations. Discrepancies cause admission issues.',
    keyPoints: ['Required for inter-school transfers', 'Contains promotion/detention status', 'Must follow board format', 'Needs counter-signature', 'Mentions special circumstances'],
    metrics: [{ label: 'Total Issued', value: '34', description: 'This year' }, { label: 'Incoming', value: '15', description: 'From other schools' }, { label: 'Outgoing', value: '19', description: 'Students leaving' }],
    tips: ['Follow board format strictly', 'Ensure accurate records', 'Process within timeframe', 'Verify receiving school']
  }
};

// Components
const InfoButton: React.FC<{onClick: () => void;size?: 'sm' | 'md' | 'lg';className?: string;}> = ({ onClick, size = 'md', className = '' }) => {
  const sizes = { sm: 'p-1', md: 'p-1.5', lg: 'p-2' };
  const icons = { sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' };
  return (
    <button onClick={(e) => {e.stopPropagation();onClick();}} className={`${sizes[size]} rounded-full hover:bg-blue-100 transition-all group border border-transparent hover:border-blue-200 ${className}`} title="More info">
      <Info className={`${icons[size]} text-gray-400 group-hover:text-blue-600 transition-colors`} />
    </button>);

};

const InfoModal: React.FC<{isOpen: boolean;onClose: () => void;contentKey: string;}> = ({ isOpen, onClose, contentKey }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'tips' | 'faq'>('overview');
  if (!isOpen) return null;
  const content = infoPanelData[contentKey];
  if (!content) return null;
  const IconComponent = content.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="flex items-start justify-between p-6 border-b bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-start gap-4">
            <div className={`p-4 rounded-2xl ${content.iconBg}`}><IconComponent className={`w-8 h-8 ${content.iconColor}`} /></div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{content.title}</h2>
              <p className="text-sm text-gray-500 mt-1">Understanding this metric</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X className="w-6 h-6 text-gray-500" /></button>
        </div>
        <div className="flex border-b bg-gray-50 px-6">
          {[{ id: 'overview', label: 'Overview', icon: Info }, { id: 'metrics', label: 'Metrics', icon: BarChart3 }, { id: 'tips', label: 'Tips', icon: Zap }, { id: 'faq', label: 'FAQ', icon: HelpCircle }].map((tab) =>
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              <tab.icon className="w-4 h-4" />{tab.label}
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' &&
          <div className="space-y-6">
              <div><h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Description</h3><p className="text-gray-700 text-lg">{content.description}</p></div>
              <div className="p-5 bg-blue-50 rounded-xl border border-blue-200"><div className="flex items-start gap-4"><div className="p-2 bg-blue-100 rounded-lg"><Target className="w-6 h-6 text-blue-600" /></div><div><h4 className="font-semibold text-blue-900 text-lg mb-2">Purpose</h4><p className="text-blue-800">{content.purpose}</p></div></div></div>
              <div className="p-5 bg-amber-50 rounded-xl border border-amber-200"><div className="flex items-start gap-4"><div className="p-2 bg-amber-100 rounded-lg"><AlertTriangle className="w-6 h-6 text-amber-600" /></div><div><h4 className="font-semibold text-amber-900 text-lg mb-2">Importance</h4><p className="text-amber-800">{content.importance}</p></div></div></div>
              <div><h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Key Points</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-3">{content.keyPoints.map((point, i) => <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"><CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" /><span className="text-gray-700">{point}</span></div>)}</div></div>
            </div>
          }
          {activeTab === 'metrics' && content.metrics &&
          <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{content.metrics.map((m, i) => <div key={i} className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border"><p className="text-sm text-gray-500 mb-1">{m.label}</p><p className="text-3xl font-bold text-gray-900 mb-2">{m.value}</p><p className="text-sm text-gray-600">{m.description}</p></div>)}</div>
              <div className="p-5 bg-green-50 rounded-xl border border-green-200"><div className="flex items-start gap-4"><div className="p-2 bg-green-100 rounded-lg"><TrendingUp className="w-6 h-6 text-green-600" /></div><div><h4 className="font-semibold text-green-900 mb-2">How to Interpret</h4><p className="text-green-800">Compare with previous periods to identify trends and areas needing attention.</p></div></div></div>
            </div>
          }
          {activeTab === 'tips' && content.tips &&
          <div className="space-y-3">{content.tips.map((tip, i) => <div key={i} className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100"><div className="p-2 bg-purple-100 rounded-lg"><Sparkles className="w-5 h-5 text-purple-600" /></div><div><p className="font-medium text-gray-900">Tip #{i + 1}</p><p className="text-gray-700 mt-1">{tip}</p></div></div>)}</div>
          }
          {activeTab === 'faq' && <div className="p-5 bg-gray-100 rounded-xl"><h4 className="font-semibold text-gray-900 mb-3">Need help?</h4><div className="flex gap-3"><Button variant="outline" className="gap-2"><Mail className="w-4 h-4" />Email Support</Button><Button variant="outline" className="gap-2"><MessageSquare className="w-4 h-4" />Live Chat</Button></div></div>}
        </div>
        <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
          <span className="text-sm text-gray-500 flex items-center gap-2"><Info className="w-4 h-4" />Last updated: March 2024</span>
          <div className="flex gap-2"><Button variant="outline" size="sm" className="gap-2"><Copy className="w-4 h-4" />Copy</Button><Button variant="outline" size="sm" className="gap-2"><Share2 className="w-4 h-4" />Share</Button><Button variant="primary" size="sm" onClick={onClose}>Got it</Button></div>
        </div>
      </div>
    </div>);

};

const MultiSelectDropdown: React.FC<{options: {value: string;label: string;}[];selected: string[];onChange: (selected: string[]) => void;placeholder: string;}> = ({ options, selected, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const allSelected = selected.length === options.length;
  const toggleAll = () => onChange(allSelected ? [] : options.map((o) => o.value));
  const toggleOption = (value: string) => onChange(selected.includes(value) ? selected.filter((s) => s !== value) : [...selected, value]);
  const displayText = selected.length === 0 ? placeholder : selected.length === options.length ? 'All Branches' : `${selected.length} Selected`;

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between gap-2 px-3 py-2 border rounded-lg bg-white min-w-[180px] hover:border-blue-400 transition-colors">
        <span className="flex items-center gap-2"><Building2 className="w-4 h-4 text-gray-500" /><span className="text-sm text-gray-700">{displayText}</span></span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen &&
      <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-1 w-64 bg-white border rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
            <div className="p-2 border-b">
              <label className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} className="w-4 h-4 text-blue-600 rounded border-gray-300" />
                <span className="font-medium text-sm">Select All</span>
              </label>
            </div>
            <div className="p-2">
              {options.map((opt) =>
            <label key={opt.value} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input type="checkbox" checked={selected.includes(opt.value)} onChange={() => toggleOption(opt.value)} className="w-4 h-4 text-blue-600 rounded border-gray-300" />
                  <span className="text-sm">{opt.label}</span>
                </label>
            )}
            </div>
          </div>
        </>
      }
    </div>);

};

// Main Component
export function CertificateSummaryDashboard() {
  const [activeInfoModal, setActiveInfoModal] = useState<string | null>(null);
  const [selectedBatch, setSelectedBatch] = useState('2024-2025');
  const [selectedBranches, setSelectedBranches] = useState<string[]>(BRANCHES.map((b) => b.id));
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredBranches = useMemo(() => BRANCHES.filter((b) => selectedBranches.includes(b.id)), [selectedBranches]);

  const aggregatedData = useMemo(() => {
    const totals = filteredBranches.reduce((acc, b) => ({
      bonafide: acc.bonafide + b.certificates.bonafide,
      leaving: acc.leaving + b.certificates.leaving,
      character: acc.character + b.certificates.character,
      transfer: acc.transfer + b.certificates.transfer,
      pending: acc.pending + b.pending
    }), { bonafide: 0, leaving: 0, character: 0, transfer: 0, pending: 0 });
    const total = totals.bonafide + totals.leaving + totals.character + totals.transfer;
    return { ...totals, total };
  }, [filteredBranches]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'info' | 'danger'> = { Issued: 'success', Pending: 'warning', Processing: 'info', Rejected: 'danger' };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const recentCertificates = [
  { id: '1', student: 'Rahul Sharma', grNo: 'GR-2024-001', class: '10-A', branch: 'CSE', type: 'Bonafide', date: '2024-03-15', status: 'Issued', purpose: 'Bank Account' },
  { id: '2', student: 'Priya Patel', grNo: 'GR-2024-002', class: '12-B', branch: 'ECE', type: 'Leaving', date: '2024-03-14', status: 'Pending', purpose: 'College Admission' },
  { id: '3', student: 'Amit Kumar', grNo: 'GR-2024-003', class: '9-A', branch: 'ME', type: 'Character', date: '2024-03-14', status: 'Issued', purpose: 'Scholarship' },
  { id: '4', student: 'Sneha Gupta', grNo: 'GR-2024-004', class: '11-A', branch: 'CE', type: 'Transfer', date: '2024-03-13', status: 'Processing', purpose: 'Transfer' },
  { id: '5', student: 'Rohan Verma', grNo: 'GR-2024-005', class: '8-C', branch: 'EE', type: 'Bonafide', date: '2024-03-13', status: 'Issued', purpose: 'Passport' }];


  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">Certificate Summary</h1>
              <InfoButton onClick={() => setActiveInfoModal('overview')} size="lg" />
            </div>
            <p className="text-gray-500 mt-1">Branch-wise certificate management overview</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg">
            <Calendar className="w-4 h-4 text-gray-500" />
            <Select className="border-0 p-0 min-w-[110px]" value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} options={BATCHES.map((b) => ({ value: b, label: b }))} />
          </div>
          <MultiSelectDropdown
            options={BRANCHES.map((b) => ({ value: b.id, label: b.name }))}
            selected={selectedBranches}
            onChange={setSelectedBranches}
            placeholder="Select Branches" />

          <Button variant="outline"><RefreshCw className="w-4 h-4 mr-2" />Refresh</Button>
          <Button variant="outline"><Download className="w-4 h-4 mr-2" />Export</Button>
          <Button variant="primary"><Plus className="w-4 h-4 mr-2" />New Certificate</Button>
        </div>
      </div>

      {/* Filter Summary */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-gray-500">Showing data for:</span>
        <Badge variant="info" className="gap-1"><Calendar className="w-3 h-3" />{selectedBatch}</Badge>
        {selectedBranches.length === BRANCHES.length ?
        <Badge variant="success" className="gap-1"><Building2 className="w-3 h-3" />All Branches</Badge> :

        filteredBranches.map((b) => <Badge key={b.id} variant="secondary" className="gap-1">{b.code}</Badge>)
        }
      </div>

      {/* Overview KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
        { id: 'totalIssued', title: 'Total Issued', value: aggregatedData.total.toString(), subtitle: 'This Academic Year', icon: FileCheck, color: 'indigo', trend: '+9.6%', positive: true },
        { id: 'pendingRequests', title: 'Pending Requests', value: aggregatedData.pending.toString(), subtitle: `${filteredBranches.length} Branches`, icon: Clock, color: 'amber', trend: '-23%', positive: true },
        { id: 'processingTime', title: 'Avg. Processing', value: '1.5 days', subtitle: 'Target: <2 days', icon: Timer, color: 'cyan', trend: '-0.3 days', positive: true },
        { id: 'satisfactionRate', title: 'Satisfaction', value: '98%', subtitle: 'Based on feedback', icon: ThumbsUp, color: 'green', trend: '+2%', positive: true }].
        map((kpi) => {
          const colors = COLOR_MAP[kpi.color];
          return (
            <Card key={kpi.id} className="p-5 hover:shadow-lg transition-all cursor-pointer group">
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl ${colors.light}`}><kpi.icon className={`w-6 h-6 ${colors.icon}`} /></div>
                <InfoButton onClick={() => setActiveInfoModal(kpi.id)} />
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">{kpi.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1 group-hover:text-blue-600 transition-colors">{kpi.value}</p>
                <p className="text-xs text-gray-500 mt-1">{kpi.subtitle}</p>
              </div>
              <div className="mt-3 flex items-center">
                {kpi.positive ? <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" /> : <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />}
                <span className={`text-sm ${kpi.positive ? 'text-green-600' : 'text-red-600'}`}>{kpi.trend}</span>
                <span className="text-gray-500 text-sm ml-1">vs last period</span>
              </div>
            </Card>);

        })}
      </div>

      {/* Branch-wise Certificate Breakdown */}
      <Card>
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-500" />Branch-wise Certificate Summary
          </h3>
          <div className="flex items-center gap-2">
            <Button variant={viewMode === 'grid' ? 'primary' : 'outline'} size="sm" onClick={() => setViewMode('grid')}><LayoutGrid className="w-4 h-4" /></Button>
            <Button variant={viewMode === 'list' ? 'primary' : 'outline'} size="sm" onClick={() => setViewMode('list')}><List className="w-4 h-4" /></Button>
          </div>
        </div>
        
        {viewMode === 'grid' ?
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {filteredBranches.map((branch) => {
            const total = branch.certificates.bonafide + branch.certificates.leaving + branch.certificates.character + branch.certificates.transfer;
            return (
              <div key={branch.id} className="p-4 border rounded-xl hover:shadow-md hover:border-blue-200 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">{branch.code}</div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{branch.code}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[80px]">{branch.name}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{total}</Badge>
                  </div>
                  <div className="space-y-2">
                    {CERT_TYPES.map((type) => {
                    const count = branch.certificates[type.id as keyof typeof branch.certificates];
                    const percentage = count / total * 100;
                    const colors = COLOR_MAP[type.color];
                    return (
                      <div key={type.id}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600">{type.label}</span>
                            <span className="font-medium">{count}</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full ${colors.bg} rounded-full transition-all`} style={{ width: `${percentage}%` }} />
                          </div>
                        </div>);

                  })}
                  </div>
                  <div className="mt-3 pt-3 border-t flex justify-between text-xs">
                    <span className="text-amber-600 flex items-center gap-1"><Clock className="w-3 h-3" />{branch.pending} pending</span>
                    <span className="text-gray-500">Avg: {branch.avgTime}</span>
                  </div>
                </div>);

          })}
          </div> :

        <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Branch</th>
                  {CERT_TYPES.map((t) => <th key={t.id} className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">{t.label}</th>)}
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Total</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Pending</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Avg Time</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredBranches.map((branch) => {
                const total = branch.certificates.bonafide + branch.certificates.leaving + branch.certificates.character + branch.certificates.transfer;
                return (
                  <tr key={branch.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">{branch.code}</div>
                          <span className="font-medium">{branch.name}</span>
                        </div>
                      </td>
                      {CERT_TYPES.map((t) =>
                    <td key={t.id} className="px-4 py-3 text-center">
                          <Badge variant="secondary">{branch.certificates[t.id as keyof typeof branch.certificates]}</Badge>
                        </td>
                    )}
                      <td className="px-4 py-3 text-center font-bold text-gray-900">{total}</td>
                      <td className="px-4 py-3 text-center"><Badge variant="warning">{branch.pending}</Badge></td>
                      <td className="px-4 py-3 text-center text-gray-600">{branch.avgTime}</td>
                    </tr>);

              })}
                <tr className="bg-gray-100 font-semibold">
                  <td className="px-4 py-3">Total ({filteredBranches.length} Branches)</td>
                  <td className="px-4 py-3 text-center">{aggregatedData.bonafide}</td>
                  <td className="px-4 py-3 text-center">{aggregatedData.leaving}</td>
                  <td className="px-4 py-3 text-center">{aggregatedData.character}</td>
                  <td className="px-4 py-3 text-center">{aggregatedData.transfer}</td>
                  <td className="px-4 py-3 text-center">{aggregatedData.total}</td>
                  <td className="px-4 py-3 text-center">{aggregatedData.pending}</td>
                  <td className="px-4 py-3 text-center">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        }
      </Card>

      {/* Quick Actions & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-500" />Quick Actions</h3>
          </div>
          <div className="p-4 space-y-3">
            {CERT_TYPES.map((action) => {
              const colors = COLOR_MAP[action.color];
              return (
                <button key={action.id} onClick={() => setActiveInfoModal(action.id)} className="w-full flex items-center gap-4 p-4 rounded-xl border hover:border-blue-300 hover:bg-blue-50 transition-all group text-left">
                  <div className={`p-3 rounded-xl ${colors.light} group-hover:scale-110 transition-transform`}><action.icon className={`w-5 h-5 ${colors.icon}`} /></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 group-hover:text-blue-600">Issue {action.label}</p>
                    <p className="text-xs text-gray-500">{aggregatedData[action.id as keyof typeof aggregatedData]} issued this year</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </button>);

            })}
          </div>
        </Card>

        {/* Distribution Chart */}
        <Card className="lg:col-span-2">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2"><PieChart className="w-5 h-5 text-violet-500" />Certificate Distribution</h3>
          </div>
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative w-48 h-48 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="12" />
                  {(() => {
                    const total = aggregatedData.total || 1;
                    const data = [
                    { value: aggregatedData.bonafide, color: '#3B82F6' },
                    { value: aggregatedData.character, color: '#8B5CF6' },
                    { value: aggregatedData.leaving, color: '#22C55E' },
                    { value: aggregatedData.transfer, color: '#F97316' }];

                    let offset = 0;
                    return data.map((d, i) => {
                      const pct = d.value / total * 100;
                      const dash = pct * 2.51;
                      const currentOffset = offset;
                      offset -= dash;
                      return <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={d.color} strokeWidth="12" strokeDasharray={`${dash} 251`} strokeDashoffset={currentOffset} />;
                    });
                  })()}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center"><p className="text-3xl font-bold text-gray-900">{aggregatedData.total}</p><p className="text-xs text-gray-500">Total</p></div>
                </div>
              </div>
              <div className="flex-1 space-y-4">
                {CERT_TYPES.map((type) => {
                  const count = aggregatedData[type.id as keyof typeof aggregatedData] as number;
                  const pct = aggregatedData.total ? (count / aggregatedData.total * 100).toFixed(1) : '0';
                  const colors = COLOR_MAP[type.color];
                  return (
                    <div key={type.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${colors.bg}`} />
                        <span className="font-medium text-gray-700">{type.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-900">{count}</span>
                        <Badge variant="secondary">{pct}%</Badge>
                      </div>
                    </div>);

                })}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Certificates */}
      <Card>
        <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Activity className="w-5 h-5 text-rose-500" />Recent Certificates</h3>
            <Badge variant="secondary">{recentCertificates.length} Recent</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-2" />Filter</Button>
            <Button variant="outline" size="sm"><Search className="w-4 h-4 mr-2" />Search</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Student', 'Branch', 'Certificate', 'Purpose', 'Date', 'Status', 'Actions'].map((h) =>
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{h}</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentCertificates.filter((c) => selectedBranches.length === BRANCHES.length || selectedBranches.some((b) => BRANCHES.find((br) => br.id === b)?.code === c.branch)).map((cert) =>
              <tr key={cert.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-gray-600">{cert.student.charAt(0)}</div>
                      <div><p className="font-medium text-gray-900">{cert.student}</p><p className="text-xs text-gray-500">{cert.grNo} • {cert.class}</p></div>
                    </div>
                  </td>
                  <td className="px-4 py-4"><Badge variant="info">{cert.branch}</Badge></td>
                  <td className="px-4 py-4"><span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${COLOR_MAP[CERT_TYPES.find((t) => t.label === cert.type)?.color || 'blue'].light} ${COLOR_MAP[CERT_TYPES.find((t) => t.label === cert.type)?.color || 'blue'].icon} ${COLOR_MAP[CERT_TYPES.find((t) => t.label === cert.type)?.color || 'blue'].border}`}>{cert.type}</span></td>
                  <td className="px-4 py-4 text-sm text-gray-700">{cert.purpose}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{cert.date}</td>
                  <td className="px-4 py-4">{getStatusBadge(cert.status)}</td>
                  <td className="px-4 py-4">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" title="View"><Eye className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" title="Print"><Printer className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" title="Download"><Download className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" title="More"><MoreVertical className="w-4 h-4" /></Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">Showing {recentCertificates.length} certificates</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="primary" size="sm">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </Card>

      <InfoModal isOpen={activeInfoModal !== null} onClose={() => setActiveInfoModal(null)} contentKey={activeInfoModal || ''} />
    </div>);

}

export default CertificateSummaryDashboard;