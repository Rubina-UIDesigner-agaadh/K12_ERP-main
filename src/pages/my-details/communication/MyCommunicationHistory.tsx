import React from 'react';
import { MessageSquare, Mail, Eye, Filter } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
export function MyCommunicationHistory() {
  const history = [
  {
    id: 1,
    date: '10-Nov-2024 10:30 AM',
    channel: 'SMS',
    sender: 'System',
    content: 'Your leave application for 15-Nov has been approved.',
    status: 'Delivered'
  },
  {
    id: 2,
    date: '08-Nov-2024 09:00 AM',
    channel: 'Email',
    sender: 'HR Dept',
    content: 'Subject: Policy Update - Please review the new IT policy...',
    status: 'Sent'
  },
  {
    id: 3,
    date: '05-Nov-2024 02:15 PM',
    channel: 'SMS',
    sender: 'Admin',
    content: 'Reminder: Staff meeting at 3 PM in Conference Hall.',
    status: 'Delivered'
  }];

  const columns = [
  {
    key: 'date',
    header: 'Date & Time'
  },
  {
    key: 'channel',
    header: 'Channel',
    render: (row: any) =>
    <div className="flex items-center gap-2">
          {row.channel === 'SMS' ?
      <MessageSquare className="w-4 h-4 text-blue-500" /> :

      <Mail className="w-4 h-4 text-orange-500" />
      }
          <span>{row.channel}</span>
        </div>

  },
  {
    key: 'sender',
    header: 'Sender'
  },
  {
    key: 'content',
    header: 'Message Preview',
    render: (row: any) =>
    <span className="text-gray-600 truncate block max-w-xs">
          {row.content}
        </span>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: any) => <Badge variant="success">{row.status}</Badge>
  },
  {
    key: 'actions',
    header: 'Action',
    render: () =>
    <Button variant="ghost" size="xs">
          <Eye className="w-4 h-4" />
        </Button>

  }];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Communication Log</h1>
        <p className="text-sm text-gray-500">
          History of all SMS and Emails sent to you by the system.
        </p>
      </div>

      <Card>
        <div className="flex flex-wrap gap-4 mb-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
            <Input type="date" />
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
              }]
              } />

            <Select
              options={[
              {
                value: 'all',
                label: 'All Categories'
              },
              {
                value: 'alert',
                label: 'Alerts'
              },
              {
                value: 'reminder',
                label: 'Reminders'
              }]
              } />

          </div>
        </div>

        <Table columns={columns} data={history} />
      </Card>
    </div>);

}