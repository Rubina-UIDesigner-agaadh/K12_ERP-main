import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowDownRight, ArrowRight, ArrowUpRight, BarChart3, CheckCircle2, Clock3, Download, Filter, Target, Timer, TrendingUp, XCircle } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

const MODULE_METRICS = [
  { module: 'Finance & Accounts', submitted: 842, approved: 734, rejected: 48, auto: 128, overdue: 32, avgHours: 5.2, sla: 93 },
  { module: 'Procurement', submitted: 618, approved: 512, rejected: 39, auto: 74, overdue: 41, avgHours: 7.1, sla: 89 },
  { module: 'Human Resources', submitted: 493, approved: 426, rejected: 22, auto: 91, overdue: 21, avgHours: 4.4, sla: 95 },
  { module: 'Student Services', submitted: 726, approved: 604, rejected: 57, auto: 102, overdue: 37, avgHours: 6.8, sla: 91 },
  { module: 'Admissions', submitted: 389, approved: 318, rejected: 28, auto: 42, overdue: 19, avgHours: 8.1, sla: 88 },
  { module: 'Transport & Fleet', submitted: 302, approved: 261, rejected: 20, auto: 37, overdue: 13, avgHours: 5.9, sla: 94 },
  { module: 'Operations', submitted: 274, approved: 231, rejected: 18, auto: 31, overdue: 11, avgHours: 4.8, sla: 96 },
  { module: 'IT & Facilities', submitted: 186, approved: 154, rejected: 12, auto: 24, overdue: 8, avgHours: 3.9, sla: 97 }
];
const APPROVER_METRICS = [
  { name: 'Ananya Desai', role: 'Principal', assigned: 186, approved: 172, rejected: 8, avg: '4.2h', onTime: 96, load: 'High' },
  { name: 'Rahul Mehta', role: 'Finance Controller', assigned: 142, approved: 129, rejected: 7, avg: '5.4h', onTime: 92, load: 'High' },
  { name: 'Neha Trivedi', role: 'HR Manager', assigned: 97, approved: 92, rejected: 2, avg: '3.8h', onTime: 98, load: 'Balanced' },
  { name: 'Vikram Joshi', role: 'Operations Director', assigned: 118, approved: 101, rejected: 9, avg: '6.1h', onTime: 88, load: 'High' },
  { name: 'Pooja Shah', role: 'Admissions Lead', assigned: 105, approved: 98, rejected: 4, avg: '3.5h', onTime: 97, load: 'Balanced' },
  { name: 'Amit Patel', role: 'Vice Principal', assigned: 88, approved: 81, rejected: 4, avg: '5.8h', onTime: 91, load: 'Balanced' }
];
const MONTH_TREND = [
  { label: 'May', submitted: 754, decided: 691, hours: 7.6 }, { label: 'Jun', submitted: 810, decided: 741, hours: 7.2 },
  { label: 'Jul', submitted: 892, decided: 823, hours: 6.9 }, { label: 'Aug', submitted: 968, decided: 911, hours: 6.7 },
  { label: 'Sep', submitted: 1024, decided: 966, hours: 6.2 }, { label: 'Oct', submitted: 1102, decided: 1055, hours: 5.8 }
];
const BRANCHES = ['All branches', 'Main Campus', 'North Branch', 'South Branch'];

export function ApprovalAnalytics() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('Last 6 months');
  const [moduleFilter, setModuleFilter] = useState('All modules');
  const [branchFilter, setBranchFilter] = useState('All branches');
  const [toast, setToast] = useState('');

  const branchFactor = branchFilter === 'Main Campus' ? 0.52 : branchFilter === 'North Branch' ? 0.28 : branchFilter === 'South Branch' ? 0.20 : 1;
  const visibleModules = useMemo(() => MODULE_METRICS
    .filter((metric) => moduleFilter === 'All modules' || metric.module === moduleFilter)
    .map((metric) => branchFilter === 'All branches' ? metric : {
      ...metric,
      submitted: Math.round(metric.submitted * branchFactor),
      approved: Math.round(metric.approved * branchFactor),
      rejected: Math.round(metric.rejected * branchFactor),
      auto: Math.round(metric.auto * branchFactor),
      overdue: Math.round(metric.overdue * branchFactor)
    }), [moduleFilter, branchFilter, branchFactor]);
  const totals = useMemo(() => visibleModules.reduce((sum, row) => ({
    submitted: sum.submitted + row.submitted, approved: sum.approved + row.approved, rejected: sum.rejected + row.rejected,
    auto: sum.auto + row.auto, overdue: sum.overdue + row.overdue, weightedHours: sum.weightedHours + row.avgHours * row.submitted,
    weightedSla: sum.weightedSla + row.sla * row.submitted
  }), { submitted: 0, approved: 0, rejected: 0, auto: 0, overdue: 0, weightedHours: 0, weightedSla: 0 }), [visibleModules]);
  const avgHours = totals.submitted ? (totals.weightedHours / totals.submitted).toFixed(1) : '0';
  const avgSla = totals.submitted ? Math.round(totals.weightedSla / totals.submitted) : 0;
  const completionRate = totals.submitted ? Math.round((totals.approved + totals.rejected) / totals.submitted * 100) : 0;
  const maxVolume = Math.max(...MONTH_TREND.map((month) => month.submitted));

  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 2800); };
  const exportReport = () => {
    const rows = [['Module', 'Submitted', 'Approved', 'Rejected', 'Auto-approved', 'Overdue', 'Average hours', 'SLA met'], ...visibleModules.map((row) => [row.module, row.submitted, row.approved, row.rejected, row.auto, row.overdue, row.avgHours, `${row.sla}%`])];
    const csv = rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'approval-analytics.csv'; link.click(); URL.revokeObjectURL(link.href); notify('Analytics report exported.');
  };

  return (
    <div className="min-h-full space-y-5 bg-slate-50 p-4 md:p-6">
      <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><div><div className="mb-1 text-xs text-slate-500">Administration / Central Approval Desk / <span className="text-blue-700">Approval Analytics</span></div><div className="flex flex-wrap items-center gap-3"><h1 className="text-2xl font-bold text-slate-900">Approval Analytics</h1><Badge variant="info">Operational insights</Badge></div><p className="mt-1 text-sm text-slate-500">Track throughput, service-level performance, workload, and bottlenecks across approval workflows.</p></div><div className="flex flex-wrap gap-2"><Button variant="outline" size="sm" onClick={() => navigate('/admin-tools/administration/approval-history-audit')}>Audit history <ArrowRight className="h-4 w-4" /></Button><Button variant="outline" size="sm" onClick={exportReport}><Download className="h-4 w-4" /> Export report</Button></div></header>

      <Card className="p-4"><div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_1fr_auto]"><label className="text-xs font-semibold text-slate-500">Reporting period<select value={period} onChange={(event) => setPeriod(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-700"><option>Last 30 days</option><option>Last 6 months</option><option>This academic year</option><option>Custom period</option></select></label><label className="text-xs font-semibold text-slate-500">Module<select value={moduleFilter} onChange={(event) => setModuleFilter(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-700"><option>All modules</option>{MODULE_METRICS.map((metric) => <option key={metric.module}>{metric.module}</option>)}</select></label><label className="text-xs font-semibold text-slate-500">Branch<select value={branchFilter} onChange={(event) => setBranchFilter(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-700">{BRANCHES.map((branch) => <option key={branch}>{branch}</option>)}</select></label><div className="flex items-end"><Button variant="ghost" size="sm" onClick={() => { setPeriod('Last 6 months'); setModuleFilter('All modules'); setBranchFilter('All branches'); }}><Filter className="h-4 w-4" /> Reset filters</Button></div></div></Card>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">{[
        { label: 'Submitted', value: totals.submitted.toLocaleString(), note: `${period} · ${branchFilter}`, icon: BarChart3, tone: 'text-blue-700 bg-blue-50' },
        { label: 'Decided', value: (totals.approved + totals.rejected).toLocaleString(), note: `${completionRate}% of submissions`, icon: CheckCircle2, tone: 'text-emerald-700 bg-emerald-50' },
        { label: 'Approved', value: totals.approved.toLocaleString(), note: 'Includes auto-approved', icon: Target, tone: 'text-teal-700 bg-teal-50' },
        { label: 'Rejected', value: totals.rejected.toLocaleString(), note: 'With decision reason', icon: XCircle, tone: 'text-rose-700 bg-rose-50' },
        { label: 'Avg. decision time', value: `${avgHours}h`, note: 'Weighted by submissions', icon: Timer, tone: 'text-violet-700 bg-violet-50' },
        { label: 'SLA met', value: `${avgSla}%`, note: 'Across filtered scope', icon: Clock3, tone: 'text-amber-700 bg-amber-50' }
      ].map((metric) => { const Icon = metric.icon; return <Card key={metric.label} className="p-4"><span className={`inline-flex rounded-lg p-2 ${metric.tone}`}><Icon className="h-4 w-4" /></span><p className="mt-3 text-xs text-slate-500">{metric.label}</p><p className="mt-1 text-xl font-bold text-slate-900">{metric.value}</p><p className="mt-1 text-[10px] text-slate-400">{metric.note}</p></Card>; })}</section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card title="Approval throughput" className="xl:col-span-2" headerAction={<span className="text-xs text-slate-400">Submitted vs decided</span>}><div className="flex h-52 items-end gap-3 border-b border-slate-100 pb-2">{MONTH_TREND.map((month) => <div key={month.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><div className="flex h-full w-full max-w-14 items-end justify-center gap-1"><div title={`${month.submitted} submitted`} className="w-4 rounded-t bg-blue-200 hover:bg-blue-400" style={{ height: `${month.submitted / maxVolume * 100}%` }} /><div title={`${month.decided} decided`} className="w-4 rounded-t bg-blue-600" style={{ height: `${month.decided / maxVolume * 100}%` }} /></div><span className="text-[11px] text-slate-400">{month.label}</span></div>)}</div><div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs"><div className="flex gap-4"><span className="flex items-center gap-1.5 text-slate-500"><i className="h-2 w-2 rounded-sm bg-blue-200" />Submitted</span><span className="flex items-center gap-1.5 text-slate-500"><i className="h-2 w-2 rounded-sm bg-blue-600" />Decided</span></div><Badge variant="success"><TrendingUp className="mr-1 h-3 w-3" /> 12.6% decisions vs previous period</Badge></div></Card>
        <Card title="Decision time trend"><div className="flex h-52 items-end justify-between gap-2 border-b border-slate-100 pb-2">{MONTH_TREND.map((month) => <div key={month.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><div className="flex w-full flex-1 items-end"><div title={`${month.hours} hours`} className="mx-auto w-5 rounded-t bg-violet-400" style={{ height: `${month.hours / 8 * 100}%` }} /></div><span className="text-[11px] text-slate-400">{month.label}</span></div>)}</div><p className="mt-4 flex items-center gap-1 text-xs font-medium text-emerald-700"><ArrowDownRight className="h-4 w-4" /> Average decision time has reduced by 24% since May.</p></Card>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="overflow-hidden p-0 xl:col-span-2"><div className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><div><h2 className="font-semibold text-slate-900">Module performance comparison</h2><p className="mt-1 text-xs text-slate-500">Volumes, average turnaround, and SLA achievement</p></div><span className="text-xs text-slate-400">{visibleModules.length} modules</span></div><div className="overflow-x-auto"><table className="min-w-[820px] w-full text-left text-xs"><thead className="bg-slate-50 uppercase tracking-wider text-slate-500"><tr><th className="px-4 py-3">Module</th><th className="px-3 py-3">Submitted</th><th className="px-3 py-3">Approved</th><th className="px-3 py-3">Rejected</th><th className="px-3 py-3">Auto-approved</th><th className="px-3 py-3">Overdue</th><th className="px-3 py-3">Avg. hours</th><th className="px-3 py-3">SLA met</th></tr></thead><tbody className="divide-y divide-slate-100">{visibleModules.map((row) => <tr key={row.module} className="hover:bg-slate-50"><td className="px-4 py-3 font-semibold text-slate-800">{row.module}</td><td className="px-3 py-3 text-slate-700">{row.submitted.toLocaleString()}</td><td className="px-3 py-3 text-emerald-700">{row.approved.toLocaleString()}</td><td className="px-3 py-3 text-rose-700">{row.rejected}</td><td className="px-3 py-3 text-slate-600">{row.auto}</td><td className="px-3 py-3"><Badge variant={row.overdue > 30 ? 'danger' : 'warning'}>{row.overdue}</Badge></td><td className="px-3 py-3 text-slate-700">{row.avgHours}h</td><td className="px-3 py-3"><div className="flex items-center gap-2"><div className="h-1.5 w-12 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${row.sla >= 94 ? 'bg-emerald-500' : row.sla >= 90 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${row.sla}%` }} /></div><span className="text-slate-600">{row.sla}%</span></div></td></tr>)}</tbody></table></div></Card>
        <Card title="Bottlenecks & insights"><div className="space-y-3">{[
          { title: 'Procurement has the largest overdue queue', detail: '41 items exceed their target SLA; 12 are above 48 hours.', tag: 'Needs action', tone: 'danger' },
          { title: 'Admissions turnaround is trending high', detail: 'Average decision time is 8.1 hours, 26% above group median.', tag: 'Watch', tone: 'warning' },
          { title: 'Auto-approval is reducing routine load', detail: '356 low-risk items were routed without manual handling.', tag: 'Positive', tone: 'success' }
        ].map((insight) => <div key={insight.title} className="rounded-lg border border-slate-100 p-3"><div className="flex items-start justify-between gap-2"><p className="text-sm font-semibold leading-snug text-slate-800">{insight.title}</p><Badge variant={insight.tone as 'danger' | 'warning' | 'success'}>{insight.tag}</Badge></div><p className="mt-1.5 text-xs leading-relaxed text-slate-500">{insight.detail}</p></div>)}<Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/admin-tools/administration/unified-approval-inbox')}>Review overdue queue <ArrowRight className="h-3.5 w-3.5" /></Button></div></Card>
      </div>

      <Card className="overflow-hidden p-0"><div className="border-b border-slate-200 px-5 py-4"><h2 className="font-semibold text-slate-900">Approver performance</h2><p className="mt-1 text-xs text-slate-500">Decision count, average turnaround, on-time rate, and assigned workload</p></div><div className="overflow-x-auto"><table className="min-w-[900px] w-full text-left text-xs"><thead className="bg-slate-50 uppercase tracking-wider text-slate-500"><tr><th className="px-4 py-3">Approver</th><th className="px-3 py-3">Assigned</th><th className="px-3 py-3">Approved</th><th className="px-3 py-3">Rejected</th><th className="px-3 py-3">Avg. time</th><th className="px-3 py-3">On time</th><th className="px-3 py-3">Workload</th><th className="px-4 py-3 text-right">Trend</th></tr></thead><tbody className="divide-y divide-slate-100">{APPROVER_METRICS.map((person) => <tr key={person.name} className="hover:bg-slate-50"><td className="px-4 py-3"><span className="block font-semibold text-slate-800">{person.name}</span><span className="mt-1 block text-slate-400">{person.role}</span></td><td className="px-3 py-3 text-slate-700">{person.assigned}</td><td className="px-3 py-3 text-emerald-700">{person.approved}</td><td className="px-3 py-3 text-rose-700">{person.rejected}</td><td className="px-3 py-3 text-slate-700">{person.avg}</td><td className="px-3 py-3"><Badge variant={person.onTime >= 95 ? 'success' : person.onTime >= 90 ? 'warning' : 'danger'}>{person.onTime}%</Badge></td><td className="px-3 py-3"><Badge variant={person.load === 'High' ? 'warning' : 'info'}>{person.load}</Badge></td><td className="px-4 py-3 text-right"><span className="inline-flex items-center gap-1 text-emerald-700"><ArrowUpRight className="h-3.5 w-3.5" /> +{Math.round(person.onTime / 10)}%</span></td></tr>)}</tbody></table></div></Card>

      <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500"><Activity className="mr-1 inline h-3.5 w-3.5 text-blue-600" /> Analytics shown for <strong className="text-slate-700">{period}</strong> · {branchFilter} · figures are illustrative frontend data and can be exported for review.</div>
      {toast && <div role="status" className="fixed bottom-5 right-5 z-50 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-xl">{toast}</div>}
    </div>
  );
}

export default ApprovalAnalytics;
