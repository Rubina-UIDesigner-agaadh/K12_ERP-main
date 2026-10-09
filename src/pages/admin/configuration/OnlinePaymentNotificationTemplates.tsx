// pages/admin/settings/OnlinePaymentNotificationTemplates.tsx
// Payment notification template configuration - Email/SMS/WhatsApp/In-App templates
// Manages templates for payment events with dynamic variables, multi-channel support, and versioning

import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Textarea } from '../../../components/ui/Textarea';
import { Toggle } from '../../../components/ui/Toggle';
import {
  Plus, Edit, Trash2, Search, Eye, Send, Copy, RefreshCw,
  Mail, MessageSquare, Bell, History, Play, Clock } from
'lucide-react';

// Mock Data
const MOCK_TEMPLATES = [
{ id: 'T001', name: 'Payment Success - Email', event: 'Payment Successful', channel: 'Email', subject: 'Payment Received - ₹{amount}', status: 'Active', trigger: 'Instant', lastModified: '2024-03-10', version: 3 },
{ id: 'T002', name: 'Payment Success - SMS', event: 'Payment Successful', channel: 'SMS', subject: 'Your payment of ₹{amount} received.', status: 'Active', trigger: 'Instant', lastModified: '2024-03-10', version: 2 },
{ id: 'T003', name: 'Payment Failed - Email', event: 'Payment Failed', channel: 'Email', subject: 'Payment Failed - Please Retry', status: 'Active', trigger: 'Instant', lastModified: '2024-03-08', version: 1 },
{ id: 'T004', name: 'Payment Initiated - WhatsApp', event: 'Payment Initiated', channel: 'WhatsApp', subject: 'Payment link sent for ₹{amount}', status: 'Active', trigger: 'Instant', lastModified: '2024-03-09', version: 1 },
{ id: 'T005', name: 'Refund Processed - Email', event: 'Refund Processed', channel: 'Email', subject: 'Refund of ₹{amount} Initiated', status: 'Active', trigger: 'After Settlement', lastModified: '2024-03-01', version: 2 },
{ id: 'T006', name: 'Partial Payment - In-App', event: 'Partial Payment Received', channel: 'In-App', subject: 'Partial payment received', status: 'Inactive', trigger: 'After Confirmation', lastModified: '2024-02-28', version: 1 }];


const EVENTS = ['Payment Initiated', 'Payment Successful', 'Payment Failed', 'Refund Processed', 'Partial Payment Received'];
const CHANNELS = ['Email', 'SMS', 'WhatsApp', 'In-App'];
const TRIGGERS = ['Instant', 'After Confirmation', 'After Settlement'];

const VARIABLES = [
{ var: '{student_name}', desc: 'Student full name' },
{ var: '{class}', desc: 'Class/Grade' },
{ var: '{installment_name}', desc: 'Fee installment' },
{ var: '{amount}', desc: 'Paid amount' },
{ var: '{due_amount}', desc: 'Remaining due' },
{ var: '{transaction_id}', desc: 'Transaction ID' },
{ var: '{payment_date}', desc: 'Payment date' },
{ var: '{gateway}', desc: 'Payment gateway' },
{ var: '{receipt_no}', desc: 'Receipt number' },
{ var: '{school_name}', desc: 'School name' }];


export function OnlinePaymentNotificationTemplates() {
  const [search, setSearch] = useState('');
  const [eventFilter, setEventFilter] = useState('');
  const [channelFilter, setChannelFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState<any>(null);
  const [showHistory, setShowHistory] = useState<any>(null);
  const [editTemplate, setEditTemplate] = useState<any>(null);

  const [form, setForm] = useState({
    name: '', event: '', channel: '', subject: '', body: '',
    isActive: true, trigger: 'Instant', enableEmail: true,
    enableSMS: false, enableWhatsApp: false, enableInApp: false
  });

  const openAdd = () => {
    setEditTemplate(null);
    setForm({ name: '', event: '', channel: '', subject: '', body: '', isActive: true, trigger: 'Instant', enableEmail: true, enableSMS: false, enableWhatsApp: false, enableInApp: false });
    setShowModal(true);
  };

  const openEdit = (t: any) => {
    setEditTemplate(t);
    setForm({ name: t.name, event: t.event, channel: t.channel, subject: t.subject, body: '', isActive: t.status === 'Active', trigger: t.trigger, enableEmail: t.channel === 'Email', enableSMS: t.channel === 'SMS', enableWhatsApp: t.channel === 'WhatsApp', enableInApp: t.channel === 'In-App' });
    setShowModal(true);
  };

  const filtered = MOCK_TEMPLATES.filter((t) => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase());
    const matchEvent = !eventFilter || t.event === eventFilter;
    const matchChannel = !channelFilter || t.channel === channelFilter;
    return matchSearch && matchEvent && matchChannel;
  });

  const channelBadge = (channel: string) => {
    const variants: Record<string, 'info' | 'success' | 'warning' | 'secondary'> = {
      Email: 'info', SMS: 'success', WhatsApp: 'warning', 'In-App': 'secondary'
    };
    return <Badge variant={variants[channel] || 'secondary'}>{channel}</Badge>;
  };

  const columns = [
  { key: 'id', header: 'ID', render: (r: any) => <span className="font-mono text-xs text-gray-500">{r.id}</span> },
  { key: 'name', header: 'Template Name', render: (r: any) => <span className="font-medium text-gray-900">{r.name}</span> },
  { key: 'event', header: 'Trigger Event', render: (r: any) => <span className="text-sm text-gray-700">{r.event}</span> },
  { key: 'channel', header: 'Channel', render: (r: any) => channelBadge(r.channel) },
  { key: 'trigger', header: 'Timing', render: (r: any) => <Badge variant="secondary" size="sm"><Clock className="w-3 h-3 mr-1" />{r.trigger}</Badge> },
  { key: 'status', header: 'Status', render: (r: any) => <Badge variant={r.status === 'Active' ? 'success' : 'secondary'}>{r.status}</Badge> },
  { key: 'version', header: 'Ver.', render: (r: any) => <span className="text-xs text-gray-500">v{r.version}</span> },
  {
    key: 'actions', header: 'Actions',
    render: (r: any) =>
    <div className="flex gap-1">
          <Button variant="ghost" size="xs" onClick={() => setShowPreview(r)} title="Preview"><Eye className="w-3 h-3" /></Button>
          <Button variant="ghost" size="xs" onClick={() => openEdit(r)} title="Edit"><Edit className="w-3 h-3" /></Button>
          <Button variant="ghost" size="xs" title="Duplicate"><Copy className="w-3 h-3" /></Button>
          <Button variant="ghost" size="xs" title="Send Test"><Send className="w-3 h-3 text-blue-600" /></Button>
          <Button variant="ghost" size="xs" onClick={() => setShowHistory(r)} title="History"><History className="w-3 h-3 text-purple-600" /></Button>
          <Button variant="ghost" size="xs" title="Delete"><Trash2 className="w-3 h-3 text-red-500" /></Button>
        </div>

  }];


  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Online Payment Notification Templates</h1>
          <p className="text-sm text-gray-500 mt-1">Configure multi-channel templates for payment events with dynamic variables</p>
        </div>
        <Button variant="primary" onClick={openAdd}>
          <Plus className="w-4 h-4 mr-2" />Add Template
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
        { label: 'Total Templates', value: MOCK_TEMPLATES.length, icon: <Mail className="w-5 h-5" />, color: 'blue' },
        { label: 'Active', value: MOCK_TEMPLATES.filter((t) => t.status === 'Active').length, icon: <Play className="w-5 h-5" />, color: 'green' },
        { label: 'Email', value: MOCK_TEMPLATES.filter((t) => t.channel === 'Email').length, icon: <Mail className="w-5 h-5" />, color: 'indigo' },
        { label: 'SMS', value: MOCK_TEMPLATES.filter((t) => t.channel === 'SMS').length, icon: <MessageSquare className="w-5 h-5" />, color: 'amber' },
        { label: 'WhatsApp', value: MOCK_TEMPLATES.filter((t) => t.channel === 'WhatsApp').length, icon: <MessageSquare className="w-5 h-5" />, color: 'green' }].
        map((s) =>
        <Card key={s.label} className={`p-4 bg-${s.color}-50 border-${s.color}-200`}>
            <div className="flex items-center gap-2 mb-1">
              <div className={`text-${s.color}-600`}>{s.icon}</div>
              <p className={`text-2xl font-bold text-${s.color}-600`}>{s.value}</p>
            </div>
            <p className="text-sm text-gray-600">{s.label}</p>
          </Card>
        )}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input placeholder="Search templates..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="w-4 h-4 text-gray-400" />} />
          <Select placeholder="All Events" options={EVENTS.map((e) => ({ value: e, label: e }))} value={eventFilter} onChange={setEventFilter} />
          <Select placeholder="All Channels" options={CHANNELS.map((c) => ({ value: c, label: c }))} value={channelFilter} onChange={setChannelFilter} />
          <Button variant="outline" onClick={() => {setSearch('');setEventFilter('');setChannelFilter('');}}>
            <RefreshCw className="w-4 h-4 mr-2" />Reset
          </Button>
        </div>
      </Card>

      {/* Variable Reference */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <p className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Bell className="w-4 h-4" />Available Template Variables
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {VARIABLES.map((v) =>
          <div key={v.var} className="px-3 py-2 bg-white border border-blue-200 rounded-lg hover:shadow-sm transition-shadow cursor-pointer" title={v.desc}>
              <span className="text-xs font-mono text-blue-700 font-medium">{v.var}</span>
              <p className="text-xs text-gray-500 mt-0.5">{v.desc}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Table */}
      <Card noPadding>
        <div className="p-4 border-b flex justify-between items-center">
          <p className="text-sm text-gray-600">Showing {filtered.length} of {MOCK_TEMPLATES.length} templates</p>
        </div>
        <Table columns={columns} data={filtered} />
      </Card>

      {/* Add/Edit Modal */}
      {showModal &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[700px] max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-semibold mb-4">{editTemplate ? 'Edit Template' : 'Add Notification Template'}</h2>
            
            {/* SECTION 1: Event Selection */}
            <Card title="Event & Trigger" className="mb-4" noPadding>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Template Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  <Select label="Trigger Event *" options={EVENTS.map((e) => ({ value: e, label: e }))} value={form.event} onChange={(v) => setForm({ ...form, event: v })} />
                </div>
                <Select label="Trigger Timing *" options={TRIGGERS.map((t) => ({ value: t, label: t }))} value={form.trigger} onChange={(v) => setForm({ ...form, trigger: v })} helperText="When to send notification" />
              </div>
            </Card>

            {/* SECTION 2: Channel Selection */}
            <Card title="Notification Channels" className="mb-4" noPadding>
              <div className="p-4 grid grid-cols-2 gap-3">
                <Toggle label="Email" checked={form.enableEmail} onChange={(v) => setForm({ ...form, enableEmail: v })} icon={<Mail className="w-4 h-4" />} />
                <Toggle label="SMS" checked={form.enableSMS} onChange={(v) => setForm({ ...form, enableSMS: v })} icon={<MessageSquare className="w-4 h-4" />} />
                <Toggle label="WhatsApp" checked={form.enableWhatsApp} onChange={(v) => setForm({ ...form, enableWhatsApp: v })} icon={<MessageSquare className="w-4 h-4" />} />
                <Toggle label="In-App Notification" checked={form.enableInApp} onChange={(v) => setForm({ ...form, enableInApp: v })} icon={<Bell className="w-4 h-4" />} />
              </div>
            </Card>

            {/* SECTION 3: Template Editor */}
            <Card title="Template Content" className="mb-4" noPadding>
              <div className="p-4 space-y-4">
                <Input label="Subject / Message Title *" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} helperText="For email/WhatsApp" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message Body *</label>
                  <Textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={6} placeholder="Dear {student_name}, your payment of ₹{amount} for {installment_name} has been received successfully. Transaction ID: {transaction_id}. Thank you!" />
                  <p className="text-xs text-gray-500 mt-1">Use variables like {'{student_name}'}, {'{amount}'}, etc.</p>
                </div>
                <Toggle label="Enable Template" checked={form.isActive} onChange={(v) => setForm({ ...form, isActive: v })} />
              </div>
            </Card>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="outline"><Eye className="w-4 h-4 mr-2" />Preview</Button>
              <Button variant="primary">{editTemplate ? 'Update Template' : 'Save Template'}</Button>
            </div>
          </div>
        </div>
      }

      {/* Preview Modal */}
      {showPreview &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowPreview(null)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[550px] p-6">
            <h2 className="text-lg font-semibold mb-4">Template Preview</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Template:</span>
                <span className="font-medium">{showPreview.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Event:</span>
                <span>{showPreview.event}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Channel:</span>
                {channelBadge(showPreview.channel)}
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Trigger:</span>
                <Badge variant="secondary">{showPreview.trigger}</Badge>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border mt-4">
                <p className="text-xs text-gray-500 mb-2">Subject</p>
                <p className="font-medium text-gray-900">{showPreview.subject}</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowPreview(null)}>Close</Button>
              <Button variant="primary"><Send className="w-4 h-4 mr-2" />Send Test</Button>
            </div>
          </div>
        </div>
      }

      {/* Version History Modal */}
      {showHistory &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowHistory(null)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[600px] p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <History className="w-5 h-5" />Version History - {showHistory.name}
            </h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {[3, 2, 1].map((v) =>
            <div key={v} className={`p-3 rounded-lg border ${v === showHistory.version ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">Version {v} {v === showHistory.version && <Badge variant="info" size="xs">Current</Badge>}</p>
                      <p className="text-xs text-gray-500">Modified on 2024-03-{10 - v} by Admin User</p>
                    </div>
                    {v !== showHistory.version &&
                <Button variant="outline" size="xs">Restore</Button>
                }
                  </div>
                </div>
            )}
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setShowHistory(null)}>Close</Button>
            </div>
          </div>
        </div>
      }
    </div>);

}