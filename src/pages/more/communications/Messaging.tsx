import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent } from
'../../../components/ui/Tabs';
import { Textarea } from '../../../components/ui/Textarea';
import {
  SendIcon,
  PlusIcon,
  SearchIcon,
  ZapIcon,
  ClockIcon,
  MessageSquareIcon } from
'lucide-react';
const smsLogs = [
{
  id: 'SMS-001',
  recipient: 'All Parents - Class 8',
  message: 'Fee due reminder',
  sent: '2025-06-10 09:00',
  count: 124,
  delivered: 121,
  status: 'Delivered'
},
{
  id: 'SMS-002',
  recipient: 'Class 10 Students',
  message: 'Exam schedule update',
  sent: '2025-06-09 14:00',
  count: 56,
  delivered: 54,
  status: 'Delivered'
},
{
  id: 'SMS-003',
  recipient: 'All Staff',
  message: 'Staff meeting tomorrow',
  sent: '2025-06-09 16:00',
  count: 45,
  delivered: 45,
  status: 'Delivered'
}];

const emailCampaigns = [
{
  id: 'EC-001',
  subject: 'Annual Day Invitation',
  audience: 'All Parents',
  scheduled: '2025-06-12 10:00',
  opens: '68%',
  clicks: '24%',
  status: 'Scheduled'
},
{
  id: 'EC-002',
  subject: 'Result Published - Term 1',
  audience: 'Class 9 & 10 Parents',
  scheduled: '2025-06-08 09:00',
  opens: '82%',
  clicks: '61%',
  status: 'Sent'
}];

const autoTriggers = [
{
  trigger: 'Attendance Alert',
  event: 'Student absent 3+ days',
  channel: 'SMS + WhatsApp',
  audience: 'Parents',
  status: true
},
{
  trigger: 'Fee Due Reminder',
  event: '3 days before due date',
  channel: 'SMS + Email',
  audience: 'Parents',
  status: true
},
{
  trigger: 'Result Published',
  event: 'When result is uploaded',
  channel: 'SMS + Push',
  audience: 'Parents + Students',
  status: true
},
{
  trigger: 'Late Entry Alert',
  event: 'Student arrives late',
  channel: 'SMS',
  audience: 'Parents',
  status: false
},
{
  trigger: 'Exam Reminder',
  event: '1 day before exam',
  channel: 'Push + SMS',
  audience: 'Students',
  status: true
}];

const statusBadge = (s: string) => {
  const c: Record<string, string> = {
    Delivered: 'bg-green-100 text-green-700',
    Sent: 'bg-green-100 text-green-700',
    Scheduled: 'bg-blue-100 text-blue-700',
    Failed: 'bg-red-100 text-red-700',
    Draft: 'bg-gray-100 text-gray-600'
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c[s] || 'bg-gray-100 text-gray-600'}`}>

      {s}
    </span>);

};
export function Messaging() {
  const [tab, setTab] = useState('sms');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messaging</h1>
          <p className="text-sm text-gray-500 mt-1">
            Send SMS, emails, WhatsApp messages and push notifications
          </p>
        </div>
        <Button variant="primary">
          <SendIcon className="w-4 h-4 mr-2" />
          Compose Message
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
        {
          label: 'SMS Sent Today',
          value: '342',
          color: 'text-blue-600'
        },
        {
          label: 'Emails Sent',
          value: '89',
          color: 'text-purple-600'
        },
        {
          label: 'WhatsApp Messages',
          value: '156',
          color: 'text-green-600'
        },
        {
          label: 'Push Notifications',
          value: '234',
          color: 'text-orange-600'
        }].
        map((s, i) =>
        <Card key={i}>
            <div className="text-center p-1">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          </Card>
        )}
      </div>

      <Card noPadding>
        <Tabs defaultValue="sms" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="sms">SMS Management</TabsTrigger>
            <TabsTrigger value="email">Email Campaigns</TabsTrigger>
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
            <TabsTrigger value="push">Push Notifications</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="triggers">Auto Triggers</TabsTrigger>
          </TabsList>

          <TabsContent value="sms" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Send SMS">
                <div className="space-y-3">
                  <Select
                    label="Recipient Group"
                    options={[
                    {
                      value: 'all-parents',
                      label: 'All Parents'
                    },
                    {
                      value: 'all-students',
                      label: 'All Students'
                    },
                    {
                      value: 'all-staff',
                      label: 'All Staff'
                    },
                    {
                      value: 'class',
                      label: 'Specific Class'
                    },
                    {
                      value: 'individual',
                      label: 'Individual'
                    }]
                    } />

                  <Select
                    label="Class (if applicable)"
                    options={[
                    {
                      value: '',
                      label: 'Select class'
                    },
                    {
                      value: '8',
                      label: 'Class 8'
                    },
                    {
                      value: '9',
                      label: 'Class 9'
                    },
                    {
                      value: '10',
                      label: 'Class 10'
                    }]
                    } />

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Message
                    </label>
                    <Textarea placeholder="Type your SMS message..." rows={4} />
                    <p className="text-xs text-gray-400 mt-1">
                      0/160 characters
                    </p>
                  </div>
                  <Button variant="primary" className="w-full">
                    <SendIcon className="w-4 h-4 mr-2" />
                    Send SMS
                  </Button>
                </div>
              </Card>
              <div>
                <div className="flex gap-3 mb-4">
                  <Input
                    placeholder="Search SMS logs..."
                    leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                    className="flex-1" />

                </div>
                <Table
                  columns={[
                  {
                    key: 'id',
                    header: 'ID'
                  },
                  {
                    key: 'recipient',
                    header: 'Recipient'
                  },
                  {
                    key: 'count',
                    header: 'Count'
                  },
                  {
                    key: 'delivered',
                    header: 'Delivered'
                  },
                  {
                    key: 'status',
                    header: 'Status',
                    render: (r) => statusBadge(r.status)
                  }]
                  }
                  data={smsLogs} />

              </div>
            </div>
          </TabsContent>

          <TabsContent value="email" className="p-5">
            <div className="flex gap-3 mb-4">
              <Input
                placeholder="Search campaigns..."
                leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                className="flex-1" />

              <Button variant="primary">
                <PlusIcon className="w-4 h-4 mr-2" />
                New Campaign
              </Button>
            </div>
            <Table
              columns={[
              {
                key: 'id',
                header: 'Campaign ID'
              },
              {
                key: 'subject',
                header: 'Subject'
              },
              {
                key: 'audience',
                header: 'Audience'
              },
              {
                key: 'scheduled',
                header: 'Scheduled'
              },
              {
                key: 'opens',
                header: 'Open Rate'
              },
              {
                key: 'clicks',
                header: 'Click Rate'
              },
              {
                key: 'status',
                header: 'Status',
                render: (r) => statusBadge(r.status)
              },
              {
                key: 'actions',
                header: '',
                render: () =>
                <Button variant="ghost" className="text-xs h-7 px-2">
                      View
                    </Button>

              }]
              }
              data={emailCampaigns} />

          </TabsContent>

          <TabsContent value="whatsapp" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Send WhatsApp Message">
                <div className="space-y-3">
                  <Select
                    label="Recipient Group"
                    options={[
                    {
                      value: 'all-parents',
                      label: 'All Parents'
                    },
                    {
                      value: 'class',
                      label: 'Class-wise'
                    },
                    {
                      value: 'individual',
                      label: 'Individual Number'
                    }]
                    } />

                  <Select
                    label="Template"
                    options={[
                    {
                      value: 'fee-reminder',
                      label: 'Fee Reminder'
                    },
                    {
                      value: 'attendance',
                      label: 'Attendance Alert'
                    },
                    {
                      value: 'result',
                      label: 'Result Published'
                    },
                    {
                      value: 'custom',
                      label: 'Custom Message'
                    }]
                    } />

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Message Preview
                    </label>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-gray-700">
                      Dear Parent, your child's fee for June 2025 is due on 15th
                      June. Please pay at the earliest. — Sunrise School
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    className="w-full"
                    style={{
                      backgroundColor: '#25D366'
                    }}>

                    <MessageSquareIcon className="w-4 h-4 mr-2" />
                    Send via WhatsApp
                  </Button>
                </div>
              </Card>
              <Card title="WhatsApp Stats">
                <div className="space-y-3">
                  {[
                  {
                    label: 'Messages Sent Today',
                    value: '156'
                  },
                  {
                    label: 'Delivered',
                    value: '154 (98.7%)'
                  },
                  {
                    label: 'Read',
                    value: '132 (84.6%)'
                  },
                  {
                    label: 'Failed',
                    value: '2 (1.3%)'
                  },
                  {
                    label: 'Templates Active',
                    value: '8'
                  }].
                  map((r, i) =>
                  <div
                    key={i}
                    className="flex justify-between py-2 border-b border-gray-50 last:border-0">

                      <span className="text-sm text-gray-500">{r.label}</span>
                      <span className="text-sm font-semibold text-gray-800">
                        {r.value}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="push" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Send Push Notification">
                <div className="space-y-3">
                  <Input label="Notification Title" placeholder="Enter title" />
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Message Body
                    </label>
                    <Textarea placeholder="Notification message..." rows={3} />
                  </div>
                  <Select
                    label="Target Audience"
                    options={[
                    {
                      value: 'all',
                      label: 'All Users'
                    },
                    {
                      value: 'parents',
                      label: 'Parents'
                    },
                    {
                      value: 'students',
                      label: 'Students'
                    },
                    {
                      value: 'staff',
                      label: 'Staff'
                    }]
                    } />

                  <Input
                    label="Deep Link URL (Optional)"
                    placeholder="app://screen/path" />

                  <Button variant="primary" className="w-full">
                    Send Push Notification
                  </Button>
                </div>
              </Card>
              <Card title="Recent Push Notifications">
                <div className="space-y-2">
                  {[
                  {
                    title: 'Exam Schedule Released',
                    sent: '2025-06-10',
                    reach: '1,248',
                    opened: '876'
                  },
                  {
                    title: 'Holiday Announcement',
                    sent: '2025-06-09',
                    reach: '1,248',
                    opened: '1,102'
                  },
                  {
                    title: 'Fee Reminder',
                    sent: '2025-06-08',
                    reach: '892',
                    opened: '734'
                  }].
                  map((n, i) =>
                  <div key={i} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-800">
                        {n.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {n.sent} • Reach: {n.reach} • Opened: {n.opened}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="scheduled" className="p-5">
            <div className="flex gap-3 mb-4">
              <Input
                placeholder="Search scheduled messages..."
                leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                className="flex-1" />

              <Button variant="primary">
                <ClockIcon className="w-4 h-4 mr-2" />
                Schedule Message
              </Button>
            </div>
            <Table
              columns={[
              {
                key: 'id',
                header: 'ID'
              },
              {
                key: 'message',
                header: 'Message'
              },
              {
                key: 'channel',
                header: 'Channel'
              },
              {
                key: 'audience',
                header: 'Audience'
              },
              {
                key: 'scheduledFor',
                header: 'Scheduled For'
              },
              {
                key: 'status',
                header: 'Status',
                render: (r) => statusBadge(r.status)
              },
              {
                key: 'actions',
                header: '',
                render: () =>
                <Button
                  variant="ghost"
                  className="text-xs h-7 px-2 text-red-500">

                      Cancel
                    </Button>

              }]
              }
              data={[
              {
                id: 'SCH-001',
                message: 'PTM Reminder',
                channel: 'SMS + WhatsApp',
                audience: 'All Parents',
                scheduledFor: '2025-06-14 08:00',
                status: 'Scheduled'
              },
              {
                id: 'SCH-002',
                message: 'Annual Day Invitation',
                channel: 'Email',
                audience: 'All Parents',
                scheduledFor: '2025-06-12 10:00',
                status: 'Scheduled'
              }]
              } />

          </TabsContent>

          <TabsContent value="triggers" className="p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                Configure automatic messages triggered by system events
              </p>
              <Button variant="primary">
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Trigger
              </Button>
            </div>
            <div className="space-y-3">
              {autoTriggers.map((t, i) =>
              <div
                key={i}
                className={`flex items-center gap-4 p-4 rounded-xl border ${t.status ? 'border-green-200 bg-green-50/50' : 'border-gray-200 bg-gray-50'}`}>

                  <ZapIcon
                  className={`w-5 h-5 ${t.status ? 'text-green-500' : 'text-gray-400'}`} />

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">
                      {t.trigger}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t.event} → {t.channel} → {t.audience}
                    </p>
                  </div>
                  <button
                  className={`relative w-11 h-6 rounded-full transition-colors ${t.status ? 'bg-green-500' : 'bg-gray-300'}`}>

                    <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${t.status ? 'translate-x-5' : 'translate-x-0'}`} />

                  </button>
                  <Button variant="ghost" className="text-xs h-7 px-2">
                    Edit
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}