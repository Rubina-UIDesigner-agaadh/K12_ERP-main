import React, { useMemo, useState } from 'react';
import { Bell, Clock3, Mail, MessageSquare, RotateCcw, Save, Send, Settings2, ShieldCheck, Smartphone, Volume2 } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

type ChannelKey = 'email' | 'inApp' | 'push' | 'sms';
type EventPreference = Record<ChannelKey, boolean>;
type NotificationEvent = { id: string; group: string; label: string; detail: string; critical?: boolean };

const EVENTS: NotificationEvent[] = [
  { id: 'assigned', group: 'Approval activity', label: 'New approval assigned', detail: 'A request enters your approval queue.' },
  { id: 'dueSoon', group: 'Approval activity', label: 'Approval due soon', detail: 'The SLA is within the configured reminder window.' },
  { id: 'approved', group: 'Approval activity', label: 'Request approved', detail: 'A request you submitted or follow is approved.' },
  { id: 'rejected', group: 'Approval activity', label: 'Request rejected or returned', detail: 'A decision or correction request is recorded.' },
  { id: 'comment', group: 'Approval activity', label: 'Comment or clarification requested', detail: 'An approver adds a comment or asks for information.' },
  { id: 'overdue', group: 'SLA & escalation', label: 'Approval overdue', detail: 'The request crosses its service-level target.', critical: true },
  { id: 'escalated', group: 'SLA & escalation', label: 'Request escalated or reassigned', detail: 'A workflow rule routes the request to another approver.', critical: true },
  { id: 'delegated', group: 'Delegation & governance', label: 'Delegation created or expiring', detail: 'Authority is delegated, updated, revoked, or near expiry.' },
  { id: 'limit', group: 'Delegation & governance', label: 'Approval limit exception', detail: 'A request crosses a configured approval threshold.', critical: true },
  { id: 'dailyDigest', group: 'Summary & digest', label: 'Daily pending approvals digest', detail: 'A daily summary of open approvals and upcoming due dates.' },
  { id: 'weeklyDigest', group: 'Summary & digest', label: 'Weekly approval performance digest', detail: 'A weekly summary for managers and workflow owners.' }
];
const DEFAULT_PREFERENCES: Record<string, EventPreference> = {
  assigned: { email: true, inApp: true, push: true, sms: false },
  dueSoon: { email: true, inApp: true, push: true, sms: false },
  approved: { email: true, inApp: true, push: false, sms: false },
  rejected: { email: true, inApp: true, push: true, sms: false },
  comment: { email: false, inApp: true, push: true, sms: false },
  overdue: { email: true, inApp: true, push: true, sms: true },
  escalated: { email: true, inApp: true, push: true, sms: true },
  delegated: { email: true, inApp: true, push: false, sms: false },
  limit: { email: true, inApp: true, push: true, sms: true },
  dailyDigest: { email: true, inApp: false, push: false, sms: false },
  weeklyDigest: { email: true, inApp: false, push: false, sms: false }
};
const CHANNELS: { key: ChannelKey; label: string; icon: React.ElementType }[] = [
  { key: 'email', label: 'Email', icon: Mail },
  { key: 'inApp', label: 'In-app', icon: Bell },
  { key: 'push', label: 'Push', icon: Smartphone },
  { key: 'sms', label: 'SMS', icon: MessageSquare }
];

export function ApprovalNotificationSettings() {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [digestFrequency, setDigestFrequency] = useState('Daily at 8:00 AM');
  const [reminderWindow, setReminderWindow] = useState('2 hours before due');
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(true);
  const [quietStart, setQuietStart] = useState('20:00');
  const [quietEnd, setQuietEnd] = useState('07:00');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [criticalBypass, setCriticalBypass] = useState(true);
  const [businessDaysOnly, setBusinessDaysOnly] = useState(false);
  const [toast, setToast] = useState('');

  const enabledCount = useMemo(() => Object.values(preferences).reduce((sum, preference) => sum + Object.values(preference).filter(Boolean).length, 0), [preferences]);
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 2800); };
  const setChannel = (eventId: string, channel: ChannelKey, enabled: boolean) => setPreferences((current) => ({ ...current, [eventId]: { ...current[eventId], [channel]: enabled } }));
  const resetDefaults = () => { setPreferences(DEFAULT_PREFERENCES); setDigestFrequency('Daily at 8:00 AM'); setReminderWindow('2 hours before due'); setQuietHoursEnabled(true); setQuietStart('20:00'); setQuietEnd('07:00'); setTimezone('Asia/Kolkata'); setCriticalBypass(true); setBusinessDaysOnly(false); notify('Default notification preferences restored.'); };
  const saveSettings = () => notify('Notification settings saved in this preview.');
  const groups = Array.from(new Set(EVENTS.map((event) => event.group)));

  return (
    <div className="min-h-full space-y-5 bg-slate-50 p-4 md:p-6">
      <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><div><div className="mb-1 text-xs text-slate-500">Administration / Central Approval Desk / <span className="text-blue-700">Notification Settings</span></div><div className="flex flex-wrap items-center gap-3"><h1 className="text-2xl font-bold text-slate-900">Notification Settings</h1><Badge variant="info">{enabledCount} delivery rules enabled</Badge></div><p className="mt-1 text-sm text-slate-500">Configure how approvers, requesters, and workflow owners receive approval and SLA updates.</p></div><div className="flex flex-wrap gap-2"><Button variant="outline" size="sm" onClick={resetDefaults}><RotateCcw className="h-4 w-4" /> Restore defaults</Button><Button size="sm" onClick={saveSettings}><Save className="h-4 w-4" /> Save settings</Button></div></header>

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">{[
        { label: 'Event types', value: EVENTS.length, detail: 'Across 4 categories', icon: Settings2, tone: 'bg-blue-50 text-blue-700' },
        { label: 'Active delivery rules', value: enabledCount, detail: 'Channel and event combinations', icon: Bell, tone: 'bg-emerald-50 text-emerald-700' },
        { label: 'Critical SMS alerts', value: '3 events', detail: 'Overdue, escalated, limit exception', icon: MessageSquare, tone: 'bg-amber-50 text-amber-700' },
        { label: 'Quiet hours', value: quietHoursEnabled ? `${quietStart}–${quietEnd}` : 'Off', detail: criticalBypass ? 'Critical alerts bypass quiet hours' : 'All alerts follow quiet hours', icon: Clock3, tone: 'bg-violet-50 text-violet-700' }
      ].map((metric) => { const Icon = metric.icon; return <Card key={metric.label} className="p-4"><div className="flex items-start justify-between"><div><p className="text-xs text-slate-500">{metric.label}</p><p className="mt-1 text-xl font-bold text-slate-900">{metric.value}</p><p className="mt-1 text-[11px] text-slate-400">{metric.detail}</p></div><span className={`rounded-lg p-2 ${metric.tone}`}><Icon className="h-4 w-4" /></span></div></Card>; })}</section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
        <Card className="overflow-hidden p-0"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4"><div><h2 className="font-semibold text-slate-900">Event delivery matrix</h2><p className="mt-1 text-xs text-slate-500">Select one or more channels for each approval event.</p></div><Button variant="outline" size="sm" onClick={() => notify('Test notification queued for your profile.') }><Send className="h-4 w-4" /> Send test</Button></div>
          <div className="overflow-x-auto"><table className="min-w-[760px] w-full text-left text-xs"><thead className="bg-slate-50 uppercase tracking-wider text-slate-500"><tr><th className="w-[46%] px-5 py-3">Event</th>{CHANNELS.map((channel) => { const Icon = channel.icon; return <th key={channel.key} className="px-3 py-3 text-center"><span className="inline-flex items-center gap-1.5"><Icon className="h-3.5 w-3.5" />{channel.label}</span></th>; })}</tr></thead><tbody className="divide-y divide-slate-100">{groups.map((group) => <React.Fragment key={group}><tr className="bg-slate-50/70"><td colSpan={5} className="px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">{group}</td></tr>{EVENTS.filter((event) => event.group === group).map((event) => <tr key={event.id} className="hover:bg-slate-50"><td className="px-5 py-3"><div className="flex items-start gap-2"><span className="mt-0.5 text-slate-400">{event.critical ? <ShieldCheck className="h-4 w-4 text-amber-600" /> : <Bell className="h-4 w-4" />}</span><div><p className="font-semibold text-slate-800">{event.label}{event.critical && <Badge variant="warning" className="ml-2">Critical</Badge>}</p><p className="mt-1 max-w-md text-[11px] leading-relaxed text-slate-400">{event.detail}</p></div></div></td>{CHANNELS.map((channel) => <td key={channel.key} className="px-3 py-3 text-center"><label className="inline-flex cursor-pointer items-center justify-center"><input aria-label={`${event.label} via ${channel.label}`} type="checkbox" checked={preferences[event.id]?.[channel.key] ?? false} onChange={(change) => setChannel(event.id, channel.key, change.target.checked)} /></label></td>)}</tr>)}</React.Fragment>)}</tbody></table></div>
          <div className="border-t border-slate-200 px-5 py-3 text-xs text-slate-400">SMS delivery depends on the recipient’s verified mobile number and institution messaging plan.</div>
        </Card>

        <div className="space-y-5">
          <Card title="Delivery preferences"><div className="space-y-4"><label className="block text-xs font-semibold text-slate-600">Digest frequency<select value={digestFrequency} onChange={(event) => setDigestFrequency(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-700"><option>Off</option><option>Daily at 8:00 AM</option><option>Daily at 5:00 PM</option><option>Weekly on Monday</option></select></label><label className="block text-xs font-semibold text-slate-600">Due-date reminder<select value={reminderWindow} onChange={(event) => setReminderWindow(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-700"><option>30 minutes before due</option><option>2 hours before due</option><option>1 day before due</option><option>At 75% of SLA</option></select></label><label className="block text-xs font-semibold text-slate-600">Time zone<select value={timezone} onChange={(event) => setTimezone(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-700"><option>Asia/Kolkata</option><option>Asia/Dubai</option><option>UTC</option></select></label><label className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3"><span><span className="block text-xs font-semibold text-slate-800">Business days only</span><span className="mt-1 block text-[10px] text-slate-400">Pause routine reminders on weekends.</span></span><input type="checkbox" checked={businessDaysOnly} onChange={(event) => setBusinessDaysOnly(event.target.checked)} /></label></div></Card>

          <Card title="Quiet hours"><div className="space-y-4"><label className="flex items-center justify-between gap-3"><span><span className="block text-sm font-semibold text-slate-800">Enable quiet hours</span><span className="mt-1 block text-[11px] text-slate-400">Routine approval updates are held.</span></span><input type="checkbox" checked={quietHoursEnabled} onChange={(event) => setQuietHoursEnabled(event.target.checked)} /></label><div className="grid grid-cols-2 gap-3"><label className="text-xs font-semibold text-slate-500">Start<input type="time" disabled={!quietHoursEnabled} value={quietStart} onChange={(event) => setQuietStart(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal disabled:bg-slate-100" /></label><label className="text-xs font-semibold text-slate-500">End<input type="time" disabled={!quietHoursEnabled} value={quietEnd} onChange={(event) => setQuietEnd(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal disabled:bg-slate-100" /></label></div><label className="flex items-start gap-2 rounded-lg border border-amber-100 bg-amber-50 p-3 text-xs text-amber-900"><input className="mt-0.5" type="checkbox" checked={criticalBypass} onChange={(event) => setCriticalBypass(event.target.checked)} /><span><strong>Allow critical SLA exceptions</strong><span className="mt-1 block text-amber-800">Critical escalations and high-risk limit exceptions can be delivered during quiet hours.</span></span></label></div></Card>

          <Card title="Notification health"><div className="space-y-3 text-xs"><div className="flex items-center justify-between"><span className="flex items-center gap-2 text-slate-600"><Mail className="h-4 w-4 text-blue-600" />Email service</span><Badge variant="success">Operational</Badge></div><div className="flex items-center justify-between"><span className="flex items-center gap-2 text-slate-600"><Smartphone className="h-4 w-4 text-violet-600" />Push service</span><Badge variant="success">Operational</Badge></div><div className="flex items-center justify-between"><span className="flex items-center gap-2 text-slate-600"><MessageSquare className="h-4 w-4 text-emerald-600" />SMS service</span><Badge variant="info">Plan-dependent</Badge></div><p className="border-t border-slate-100 pt-3 text-[11px] leading-relaxed text-slate-400">Delivery health is illustrative in this frontend preview.</p></div></Card>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3"><p className="flex items-center gap-2 text-xs leading-relaxed text-blue-800"><Volume2 className="h-4 w-4 shrink-0" />Save applies preferences to this frontend preview. Individual approvers may also manage their personal channel preferences.</p><Button size="sm" onClick={saveSettings}><Save className="h-4 w-4" /> Save notification settings</Button></div>
      {toast && <div role="status" className="fixed bottom-5 right-5 z-50 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-xl">{toast}</div>}
    </div>
  );
}

export default ApprovalNotificationSettings;
