import React, { useState, useMemo } from 'react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Select } from '../../../../components/ui/Select';
import { Input } from '../../../../components/ui/Input';
import { Badge } from '../../../../components/ui/Badge';
import { BellIcon, SaveIcon, PlusIcon, TrashIcon, ClockIcon, UsersIcon, MailIcon, MessageSquareIcon, SmartphoneIcon, XIcon, EyeIcon } from 'lucide-react';

interface NotificationChannel {
  sms: boolean;
  email: boolean;
  app: boolean;
}

interface NotificationRule {
  id: string;
  event: string;
  description: string;
  channels: NotificationChannel;
  enabled: boolean;
  timing: 'immediate' | 'scheduled';
  scheduledTime?: number;
  scheduledUnit?: 'minutes' | 'hours' | 'days';
  recipients: ('teacher' | 'admin' | 'hod')[];
  conditions?: string[];
  template?: string;
  priority: 'low' | 'medium' | 'high';
}

interface NotificationLog {
  id: string;
  rule: string;
  recipient: string;
  channel: 'sms' | 'email' | 'app';
  status: 'sent' | 'failed' | 'pending';
  sentAt: string;
  message: string;
}

const INITIAL_RULES: NotificationRule[] = [
{
  id: '1',
  event: 'New Duty Assigned',
  description: 'Notify teacher when a new duty is allocated',
  channels: { sms: true, email: true, app: true },
  enabled: true,
  timing: 'immediate',
  recipients: ['teacher'],
  priority: 'high',
  template: 'You have been assigned a new duty: {duty_name} on {date} at {time}'
},
{
  id: '2',
  event: 'Duty Reminder (1 Day Before)',
  description: 'Send reminder 24 hours before duty starts',
  channels: { sms: false, email: true, app: true },
  enabled: true,
  timing: 'scheduled',
  scheduledTime: 24,
  scheduledUnit: 'hours',
  recipients: ['teacher'],
  priority: 'medium',
  template: 'Reminder: You have {duty_name} duty tomorrow at {time} in {location}'
},
{
  id: '3',
  event: 'Duty Reminder (1 Hour Before)',
  description: 'Send immediate alert before duty',
  channels: { sms: true, email: false, app: true },
  enabled: true,
  timing: 'scheduled',
  scheduledTime: 1,
  scheduledUnit: 'hours',
  recipients: ['teacher'],
  priority: 'high',
  template: 'Alert: Your duty {duty_name} starts in 1 hour at {location}'
},
{
  id: '4',
  event: 'Substitution Alert',
  description: 'Notify substitute teacher immediately',
  channels: { sms: true, email: true, app: true },
  enabled: true,
  timing: 'immediate',
  recipients: ['teacher', 'admin'],
  priority: 'high',
  template: 'Urgent: You are assigned as substitute for {original_teacher} for {class} on {date} at {time}'
},
{
  id: '5',
  event: 'Activity Scheduled',
  description: 'Notify when new activity is created',
  channels: { sms: false, email: true, app: true },
  enabled: true,
  timing: 'immediate',
  recipients: ['teacher'],
  priority: 'medium',
  template: 'New activity scheduled: {activity_name} on {date} at {time}'
},
{
  id: '6',
  event: 'Activity Cancelled',
  description: 'Alert when activity is cancelled',
  channels: { sms: true, email: true, app: true },
  enabled: true,
  timing: 'immediate',
  recipients: ['teacher', 'admin'],
  priority: 'high',
  template: 'Activity cancelled: {activity_name} scheduled for {date}'
},
{
  id: '7',
  event: 'Meeting Reminder',
  description: 'Reminder for scheduled meetings',
  channels: { sms: false, email: true, app: true },
  enabled: true,
  timing: 'scheduled',
  scheduledTime: 30,
  scheduledUnit: 'minutes',
  recipients: ['teacher'],
  priority: 'medium',
  template: 'Meeting reminder: {meeting_name} in 30 minutes at {location}'
},
{
  id: '8',
  event: 'Workload Exceeded',
  description: 'Alert when teacher workload exceeds threshold',
  channels: { sms: false, email: true, app: false },
  enabled: true,
  timing: 'immediate',
  recipients: ['teacher', 'admin', 'hod'],
  conditions: ['workload > 90%'],
  priority: 'high',
  template: 'Alert: Workload for {teacher_name} has exceeded 90% ({current_load} periods)'
}];


const SAMPLE_LOGS: NotificationLog[] = [
{ id: '1', rule: 'New Duty Assigned', recipient: 'R. Sharma', channel: 'email', status: 'sent', sentAt: new Date().toISOString(), message: 'You have been assigned a new duty: Assembly Supervision on 2025-03-15 at 08:00' },
{ id: '2', rule: 'Duty Reminder (1 Hour Before)', recipient: 'A. Gupta', channel: 'sms', status: 'sent', sentAt: new Date(Date.now() - 3600000).toISOString(), message: 'Alert: Your duty Bus Duty Route 4 starts in 1 hour at Transport Bay' },
{ id: '3', rule: 'Substitution Alert', recipient: 'M. Singh', channel: 'app', status: 'sent', sentAt: new Date(Date.now() - 7200000).toISOString(), message: 'Urgent: You are assigned as substitute for S. Patel for Class X-A on 2025-03-14 at 10:30' },
{ id: '4', rule: 'Meeting Reminder', recipient: 'P. Kumar', channel: 'email', status: 'failed', sentAt: new Date(Date.now() - 1800000).toISOString(), message: 'Meeting reminder: Science Dept Meeting in 30 minutes at Staff Room' }];


export function NotificationsReminders() {
  const [rules, setRules] = useState<NotificationRule[]>(INITIAL_RULES);
  const [logs, setLogs] = useState<NotificationLog[]>(SAMPLE_LOGS);
  const [showModal, setShowModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [editingRule, setEditingRule] = useState<NotificationRule | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterChannel, setFilterChannel] = useState('all');

  const stats = useMemo(() => {
    const enabled = rules.filter((r) => r.enabled).length;
    const totalSent = logs.filter((l) => l.status === 'sent').length;
    const failed = logs.filter((l) => l.status === 'failed').length;
    const pending = logs.filter((l) => l.status === 'pending').length;
    return { enabled, total: rules.length, totalSent, failed, pending };
  }, [rules, logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      const matchesStatus = filterStatus === 'all' || l.status === filterStatus;
      const matchesChannel = filterChannel === 'all' || l.channel === filterChannel;
      return matchesStatus && matchesChannel;
    }).sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
  }, [logs, filterStatus, filterChannel]);

  const handleToggleRule = (id: string) => {
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const handleToggleChannel = (id: string, channel: keyof NotificationChannel) => {
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, channels: { ...r.channels, [channel]: !r.channels[channel] } } : r));
  };

  const handleSaveRule = (data: Partial<NotificationRule>) => {
    if (editingRule) {
      setRules((prev) => prev.map((r) => r.id === editingRule.id ? { ...r, ...data } : r));
    } else {
      const newRule: NotificationRule = {
        id: Date.now().toString(),
        event: data.event || '',
        description: data.description || '',
        channels: data.channels || { sms: false, email: false, app: false },
        enabled: true,
        timing: data.timing || 'immediate',
        scheduledTime: data.scheduledTime,
        scheduledUnit: data.scheduledUnit,
        recipients: data.recipients || ['teacher'],
        priority: data.priority || 'medium',
        template: data.template,
        conditions: data.conditions
      };
      setRules((prev) => [...prev, newRule]);
    }
    setShowModal(false);
    setEditingRule(null);
  };

  const handleDeleteRule = (id: string) => {
    if (window.confirm('Delete this notification rule?')) {
      setRules((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleTestNotification = (rule: NotificationRule) => {
    const testLog: NotificationLog = {
      id: Date.now().toString(),
      rule: rule.event,
      recipient: 'Test User',
      channel: 'app',
      status: 'sent',
      sentAt: new Date().toISOString(),
      message: rule.template || 'Test notification'
    };
    setLogs((prev) => [testLog, ...prev]);
    alert('Test notification sent!');
  };

  const handleSaveSettings = () => {
    alert('Notification settings saved successfully!');
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications & Reminders</h1>
          <p className="text-sm text-gray-500">Manage automated alerts for teacher duties and activities</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowLogModal(true)}><EyeIcon className="w-4 h-4 mr-2" />View Logs</Button>
          <Button variant="primary" onClick={() => {setEditingRule(null);setShowModal(true);}}><PlusIcon className="w-4 h-4 mr-2" />Add Rule</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
        { label: 'Active Rules', value: stats.enabled, icon: BellIcon, color: 'blue' },
        { label: 'Total Sent', value: stats.totalSent, icon: MailIcon, color: 'green' },
        { label: 'Failed', value: stats.failed, icon: XIcon, color: 'red' },
        { label: 'Pending', value: stats.pending, icon: ClockIcon, color: 'orange' }].
        map((stat, i) =>
        <Card key={i}>
            <div className="p-3 flex items-center gap-3">
              <div className={`p-2 bg-${stat.color}-100 rounded`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      <Card title="Notification Rules">
        <div className="space-y-3">
          {rules.map((item) =>
          <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-100 rounded-lg bg-gray-50">
              <div className="mb-3 md:mb-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <BellIcon className={`w-4 h-4 ${item.enabled ? 'text-blue-500' : 'text-gray-400'}`} />
                  <p className="text-sm font-medium text-gray-900">{item.event}</p>
                  <Badge variant={item.priority === 'high' ? 'danger' : item.priority === 'medium' ? 'warning' : 'default'} className="text-xs">{item.priority}</Badge>
                  {!item.enabled && <Badge variant="default" className="text-xs">Disabled</Badge>}
                </div>
                <p className="text-xs text-gray-500 ml-6">{item.description}</p>
                {item.timing === 'scheduled' &&
              <p className="text-xs text-blue-600 ml-6 mt-1">Sends {item.scheduledTime} {item.scheduledUnit} before event</p>
              }
                {item.conditions &&
              <p className="text-xs text-orange-600 ml-6 mt-1">Condition: {item.conditions.join(', ')}</p>
              }
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-4 items-center">
                  <label className="flex items-center gap-1 text-xs cursor-pointer">
                    <input type="checkbox" checked={item.channels.sms} onChange={() => handleToggleChannel(item.id, 'sms')} disabled={!item.enabled} />
                    <MessageSquareIcon className="w-3 h-3" />SMS
                  </label>
                  <label className="flex items-center gap-1 text-xs cursor-pointer">
                    <input type="checkbox" checked={item.channels.email} onChange={() => handleToggleChannel(item.id, 'email')} disabled={!item.enabled} />
                    <MailIcon className="w-3 h-3" />Email
                  </label>
                  <label className="flex items-center gap-1 text-xs cursor-pointer">
                    <input type="checkbox" checked={item.channels.app} onChange={() => handleToggleChannel(item.id, 'app')} disabled={!item.enabled} />
                    <SmartphoneIcon className="w-3 h-3" />App
                  </label>
                </div>
                <div className="flex gap-1 justify-end">
                  <Button size="sm" variant="outline" onClick={() => handleToggleRule(item.id)}>
                    {item.enabled ? 'Disable' : 'Enable'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleTestNotification(item)}>Test</Button>
                  <Button size="sm" variant="outline" onClick={() => {setEditingRule(item);setShowModal(true);}}>Edit</Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteRule(item.id)}><TrashIcon className="w-3 h-3" /></Button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="primary" onClick={handleSaveSettings}><SaveIcon className="w-4 h-4 mr-2" />Save All Settings</Button>
        </div>
      </Card>

      <Card title="Recent Notifications">
        <div className="space-y-3">
          <div className="flex gap-3">
            <Select options={[{ value: 'all', label: 'All Status' }, { value: 'sent', label: 'Sent' }, { value: 'failed', label: 'Failed' }, { value: 'pending', label: 'Pending' }]} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} />
            <Select options={[{ value: 'all', label: 'All Channels' }, { value: 'sms', label: 'SMS' }, { value: 'email', label: 'Email' }, { value: 'app', label: 'App Push' }]} value={filterChannel} onChange={(e) => setFilterChannel(e.target.value)} />
          </div>
          {filteredLogs.slice(0, 5).map((log) =>
          <div key={log.id} className="flex items-start gap-3 p-3 border rounded hover:bg-gray-50">
              <div className={`p-2 rounded ${log.channel === 'sms' ? 'bg-blue-100' : log.channel === 'email' ? 'bg-green-100' : 'bg-purple-100'}`}>
                {log.channel === 'sms' ? <MessageSquareIcon className="w-4 h-4 text-blue-600" /> :
              log.channel === 'email' ? <MailIcon className="w-4 h-4 text-green-600" /> :
              <SmartphoneIcon className="w-4 h-4 text-purple-600" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-sm">{log.rule}</p>
                  <Badge variant={log.status === 'sent' ? 'success' : log.status === 'failed' ? 'danger' : 'warning'}>{log.status}</Badge>
                </div>
                <p className="text-xs text-gray-600">To: {log.recipient}</p>
                <p className="text-xs text-gray-500 mt-1">{log.message}</p>
              </div>
              <p className="text-xs text-gray-400">{formatTime(log.sentAt)}</p>
            </div>
          )}
          <div className="text-center">
            <Button variant="outline" onClick={() => setShowLogModal(true)}>View All Logs</Button>
          </div>
        </div>
      </Card>

      {showModal &&
      <NotificationRuleModal
        rule={editingRule}
        onSave={handleSaveRule}
        onClose={() => {setShowModal(false);setEditingRule(null);}} />

      }

      {showLogModal &&
      <NotificationLogsModal
        logs={filteredLogs}
        onClose={() => setShowLogModal(false)} />

      }
    </div>);

}

function NotificationRuleModal({ rule, onSave, onClose }: {rule: NotificationRule | null;onSave: (data: Partial<NotificationRule>) => void;onClose: () => void;}) {
  const [form, setForm] = useState({
    event: rule?.event || '',
    description: rule?.description || '',
    channels: rule?.channels || { sms: false, email: false, app: false },
    timing: rule?.timing || 'immediate',
    scheduledTime: rule?.scheduledTime || 30,
    scheduledUnit: rule?.scheduledUnit || 'minutes',
    recipients: rule?.recipients || ['teacher'],
    priority: rule?.priority || 'medium',
    template: rule?.template || '',
    conditions: rule?.conditions?.join(', ') || ''
  });

  const handleSubmit = () => {
    if (!form.event || !form.description) {
      alert('Please fill all required fields');
      return;
    }
    onSave({
      ...form,
      conditions: form.conditions ? form.conditions.split(',').map((c) => c.trim()).filter(Boolean) : undefined
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{rule ? 'Edit' : 'Add'} Notification Rule</h2>
          <button onClick={onClose}><XIcon className="w-5 h-5" /></button>
        </div>
        <div className="space-y-4">
          <Input label="Event Name *" value={form.event} onChange={(e) => setForm({ ...form, event: e.target.value })} placeholder="e.g., New Duty Assigned" />
          <Input label="Description *" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description of when this notification is sent" />
          
          <div className="grid grid-cols-2 gap-4">
            <Select label="Timing" options={[{ value: 'immediate', label: 'Immediate' }, { value: 'scheduled', label: 'Scheduled' }]} value={form.timing} onChange={(e) => setForm({ ...form, timing: e.target.value as 'immediate' | 'scheduled' })} />
            <Select label="Priority" options={[{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }]} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as 'low' | 'medium' | 'high' })} />
          </div>

          {form.timing === 'scheduled' &&
          <div className="grid grid-cols-2 gap-4">
              <Input label="Time Before Event" type="number" value={form.scheduledTime} onChange={(e) => setForm({ ...form, scheduledTime: Number(e.target.value) })} />
              <Select label="Unit" options={[{ value: 'minutes', label: 'Minutes' }, { value: 'hours', label: 'Hours' }, { value: 'days', label: 'Days' }]} value={form.scheduledUnit} onChange={(e) => setForm({ ...form, scheduledUnit: e.target.value as 'minutes' | 'hours' | 'days' })} />
            </div>
          }

          <div>
            <label className="block text-sm font-medium mb-2">Notification Channels</label>
            <div className="flex gap-4">
              {[
              { key: 'sms', label: 'SMS', icon: MessageSquareIcon },
              { key: 'email', label: 'Email', icon: MailIcon },
              { key: 'app', label: 'App Push', icon: SmartphoneIcon }].
              map((channel) =>
              <label key={channel.key} className="flex items-center gap-2 cursor-pointer p-2 border rounded">
                  <input type="checkbox" checked={form.channels[channel.key as keyof NotificationChannel]} onChange={(e) => setForm({ ...form, channels: { ...form.channels, [channel.key]: e.target.checked } })} />
                  <channel.icon className="w-4 h-4" />
                  {channel.label}
                </label>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Recipients</label>
            <div className="flex gap-4">
              {[
              { value: 'teacher', label: 'Teacher' },
              { value: 'admin', label: 'Admin' },
              { value: 'hod', label: 'HOD' }].
              map((recipient) =>
              <label key={recipient.value} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.recipients.includes(recipient.value as 'teacher' | 'admin' | 'hod')} onChange={(e) => {
                  if (e.target.checked) {
                    setForm({ ...form, recipients: [...form.recipients, recipient.value as 'teacher' | 'admin' | 'hod'] });
                  } else {
                    setForm({ ...form, recipients: form.recipients.filter((r) => r !== recipient.value) });
                  }
                }} />
                  {recipient.label}
                </label>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Message Template</label>
            <textarea className="w-full border rounded p-2 text-sm" rows={3} value={form.template} onChange={(e) => setForm({ ...form, template: e.target.value })} placeholder="Use variables like {duty_name}, {date}, {time}, {location}" />
            <p className="text-xs text-gray-500 mt-1">Available variables: {'{duty_name}'}, {'{date}'}, {'{time}'}, {'{location}'}, {'{class}'}, {'{teacher_name}'}</p>
          </div>

          <Input label="Conditions (comma-separated)" value={form.conditions} onChange={(e) => setForm({ ...form, conditions: e.target.value })} placeholder="e.g., workload > 90%, priority = high" />

          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit}>{rule ? 'Update' : 'Add'} Rule</Button>
          </div>
        </div>
      </div>
    </div>);

}

function NotificationLogsModal({ logs, onClose }: {logs: NotificationLog[];onClose: () => void;}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Notification Logs</h2>
          <button onClick={onClose}><XIcon className="w-5 h-5" /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3">Time</th>
                <th className="text-left py-2 px-3">Rule</th>
                <th className="text-left py-2 px-3">Recipient</th>
                <th className="text-left py-2 px-3">Channel</th>
                <th className="text-left py-2 px-3">Status</th>
                <th className="text-left py-2 px-3">Message</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) =>
              <tr key={log.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3 text-xs">{new Date(log.sentAt).toLocaleString()}</td>
                  <td className="py-2 px-3">{log.rule}</td>
                  <td className="py-2 px-3">{log.recipient}</td>
                  <td className="py-2 px-3"><Badge variant="default">{log.channel}</Badge></td>
                  <td className="py-2 px-3"><Badge variant={log.status === 'sent' ? 'success' : log.status === 'failed' ? 'danger' : 'warning'}>{log.status}</Badge></td>
                  <td className="py-2 px-3 text-xs max-w-xs truncate">{log.message}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>);

}