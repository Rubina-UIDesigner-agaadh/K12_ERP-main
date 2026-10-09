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
import {
  SearchIcon,
  DownloadIcon,
  CheckCircleIcon,
  EyeIcon } from
'lucide-react';
const deliveryReports = [
{
  id: 'DR-001',
  message: 'Fee Reminder - June 2025',
  channel: 'SMS',
  sent: 450,
  delivered: 443,
  failed: 7,
  date: '2025-06-10'
},
{
  id: 'DR-002',
  message: 'Annual Day Invitation',
  channel: 'Email',
  sent: 450,
  delivered: 441,
  failed: 9,
  date: '2025-06-09'
},
{
  id: 'DR-003',
  message: 'Exam Schedule Update',
  channel: 'WhatsApp',
  sent: 380,
  delivered: 378,
  failed: 2,
  date: '2025-06-08'
},
{
  id: 'DR-004',
  message: 'Holiday Notice',
  channel: 'Push',
  sent: 1248,
  delivered: 1201,
  failed: 47,
  date: '2025-06-07'
}];

const readReceipts = [
{
  id: 'RR-001',
  message: 'Fee Reminder - June 2025',
  totalSent: 450,
  opened: 312,
  openRate: '69.3%',
  lastOpened: '2025-06-10 14:30'
},
{
  id: 'RR-002',
  message: 'Annual Day Invitation',
  totalSent: 450,
  opened: 389,
  openRate: '86.4%',
  lastOpened: '2025-06-09 18:45'
}];

const history = [
{
  id: 'H-001',
  type: 'SMS',
  message: 'Fee due reminder',
  from: 'Admin',
  to: 'All Parents',
  date: '2025-06-10 09:00',
  channel: 'SMS',
  status: 'Delivered'
},
{
  id: 'H-002',
  type: 'Email',
  message: 'Annual Day Invitation',
  from: 'Principal',
  to: 'All Parents',
  date: '2025-06-09 10:00',
  channel: 'Email',
  status: 'Delivered'
},
{
  id: 'H-003',
  type: 'WhatsApp',
  message: 'Exam timetable',
  from: 'Exam Cell',
  to: 'Class 10',
  date: '2025-06-08 14:00',
  channel: 'WhatsApp',
  status: 'Delivered'
},
{
  id: 'H-004',
  type: 'Push',
  message: 'Holiday announcement',
  from: 'Admin',
  to: 'All Users',
  date: '2025-06-07 08:00',
  channel: 'Push',
  status: 'Delivered'
}];

const channelBadge = (c: string) => {
  const colors: Record<string, string> = {
    SMS: 'bg-blue-100 text-blue-700',
    Email: 'bg-purple-100 text-purple-700',
    WhatsApp: 'bg-green-100 text-green-700',
    Push: 'bg-orange-100 text-orange-700'
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors[c] || 'bg-gray-100 text-gray-600'}`}>

      {c}
    </span>);

};
export function CommunicationLogs() {
  const [tab, setTab] = useState('delivery');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Communication Logs
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            View delivery reports, read receipts and full communication history
          </p>
        </div>
        <Button variant="outline">
          <DownloadIcon className="w-4 h-4 mr-2" />
          Export All Logs
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
        {
          label: 'Total Messages Sent',
          value: '2,528',
          color: 'text-blue-600'
        },
        {
          label: 'Delivery Rate',
          value: '97.8%',
          color: 'text-green-600'
        },
        {
          label: 'Average Open Rate',
          value: '74.2%',
          color: 'text-purple-600'
        },
        {
          label: 'Failed Messages',
          value: '65',
          color: 'text-red-600'
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
        <Tabs defaultValue="delivery" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="delivery">Delivery Reports</TabsTrigger>
            <TabsTrigger value="receipts">Read Receipts</TabsTrigger>
            <TabsTrigger value="history">Communication History</TabsTrigger>
            <TabsTrigger value="export">Export Log</TabsTrigger>
          </TabsList>

          <TabsContent value="delivery" className="p-5">
            <div className="flex gap-3 mb-4">
              <Input
                placeholder="Search messages..."
                leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                className="flex-1" />

              <Select
                options={[
                {
                  value: 'all',
                  label: 'All Channels'
                },
                {
                  value: 'sms',
                  label: 'SMS'
                },
                {
                  value: 'email',
                  label: 'Email'
                },
                {
                  value: 'whatsapp',
                  label: 'WhatsApp'
                },
                {
                  value: 'push',
                  label: 'Push'
                }]
                }
                className="w-40" />

              <Input type="date" className="w-44" />
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
                header: 'Channel',
                render: (r) => channelBadge(r.channel)
              },
              {
                key: 'sent',
                header: 'Sent'
              },
              {
                key: 'delivered',
                header: 'Delivered',
                render: (r) =>
                <span className="text-green-600 font-medium">
                      {r.delivered}
                    </span>

              },
              {
                key: 'failed',
                header: 'Failed',
                render: (r) =>
                <span className="text-red-500 font-medium">{r.failed}</span>

              },
              {
                key: 'date',
                header: 'Date'
              },
              {
                key: 'actions',
                header: '',
                render: () =>
                <Button variant="ghost" className="text-xs h-7 px-2">
                      <EyeIcon className="w-3 h-3 mr-1" />
                      Details
                    </Button>

              }]
              }
              data={deliveryReports} />

          </TabsContent>

          <TabsContent value="receipts" className="p-5">
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
                key: 'totalSent',
                header: 'Total Sent'
              },
              {
                key: 'opened',
                header: 'Opened',
                render: (r) =>
                <span className="text-blue-600 font-medium">
                      {r.opened}
                    </span>

              },
              {
                key: 'openRate',
                header: 'Open Rate',
                render: (r) =>
                <span className="font-semibold text-green-600">
                      {r.openRate}
                    </span>

              },
              {
                key: 'lastOpened',
                header: 'Last Opened'
              },
              {
                key: 'actions',
                header: '',
                render: () =>
                <Button variant="ghost" className="text-xs h-7 px-2">
                      View Who Read
                    </Button>

              }]
              }
              data={readReceipts} />

          </TabsContent>

          <TabsContent value="history" className="p-5">
            <div className="flex gap-3 mb-4">
              <Input
                placeholder="Search history..."
                leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                className="flex-1" />

              <Select
                options={[
                {
                  value: 'all',
                  label: 'All Channels'
                },
                {
                  value: 'sms',
                  label: 'SMS'
                },
                {
                  value: 'email',
                  label: 'Email'
                },
                {
                  value: 'whatsapp',
                  label: 'WhatsApp'
                }]
                }
                className="w-40" />

              <Input type="date" className="w-44" />
            </div>
            <Table
              columns={[
              {
                key: 'id',
                header: 'ID'
              },
              {
                key: 'type',
                header: 'Type',
                render: (r) => channelBadge(r.type)
              },
              {
                key: 'message',
                header: 'Message'
              },
              {
                key: 'from',
                header: 'From'
              },
              {
                key: 'to',
                header: 'To'
              },
              {
                key: 'date',
                header: 'Date & Time'
              },
              {
                key: 'status',
                header: 'Status',
                render: () =>
                <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                      <CheckCircleIcon className="w-3 h-3" />
                      Delivered
                    </span>

              }]
              }
              data={history} />

          </TabsContent>

          <TabsContent value="export" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Export Communication Log">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="From Date" type="date" />
                    <Input label="To Date" type="date" />
                  </div>
                  <Select
                    label="Channel"
                    options={[
                    {
                      value: 'all',
                      label: 'All Channels'
                    },
                    {
                      value: 'sms',
                      label: 'SMS'
                    },
                    {
                      value: 'email',
                      label: 'Email'
                    },
                    {
                      value: 'whatsapp',
                      label: 'WhatsApp'
                    },
                    {
                      value: 'push',
                      label: 'Push'
                    }]
                    } />

                  <Select
                    label="Message Type"
                    options={[
                    {
                      value: 'all',
                      label: 'All Types'
                    },
                    {
                      value: 'fee',
                      label: 'Fee Related'
                    },
                    {
                      value: 'academic',
                      label: 'Academic'
                    },
                    {
                      value: 'event',
                      label: 'Events'
                    },
                    {
                      value: 'emergency',
                      label: 'Emergency'
                    }]
                    } />

                  <Select
                    label="Export Format"
                    options={[
                    {
                      value: 'excel',
                      label: 'Excel (.xlsx)'
                    },
                    {
                      value: 'pdf',
                      label: 'PDF'
                    },
                    {
                      value: 'csv',
                      label: 'CSV'
                    }]
                    } />

                  <Button variant="primary" className="w-full">
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Export Log
                  </Button>
                </div>
              </Card>
              <Card title="Scheduled Export">
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">
                    Set up automatic log exports to be delivered to your email.
                  </p>
                  <Select
                    label="Frequency"
                    options={[
                    {
                      value: 'daily',
                      label: 'Daily'
                    },
                    {
                      value: 'weekly',
                      label: 'Weekly'
                    },
                    {
                      value: 'monthly',
                      label: 'Monthly'
                    }]
                    } />

                  <Input
                    label="Email Address"
                    placeholder="admin@school.edu"
                    type="email" />

                  <Select
                    label="Format"
                    options={[
                    {
                      value: 'excel',
                      label: 'Excel'
                    },
                    {
                      value: 'pdf',
                      label: 'PDF'
                    }]
                    } />

                  <Button variant="outline" className="w-full">
                    Setup Scheduled Export
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}