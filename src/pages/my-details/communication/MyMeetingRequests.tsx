import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Check,
  X,
  RefreshCw } from
'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
export function MyMeetingRequests() {
  const [isNewMeetingModalOpen, setIsNewMeetingModalOpen] = useState(false);
  const incomingRequests = [
  {
    id: 1,
    organizer: 'Mrs. Sharma (Parent)',
    subject: 'Discuss Student Progress',
    date: '15-Nov-2024',
    time: '10:00 AM',
    location: 'Staff Room',
    status: 'Pending'
  },
  {
    id: 2,
    organizer: 'Principal',
    subject: 'Staff Review',
    date: '18-Nov-2024',
    time: '02:00 PM',
    location: 'Principal Office',
    status: 'Accepted'
  }];

  const outgoingRequests = [
  {
    id: 1,
    recipient: 'Mr. Patel (Parent)',
    subject: 'Discipline Issue',
    date: '20-Nov-2024',
    status: 'Pending'
  }];

  const incomingColumns = [
  {
    key: 'organizer',
    header: 'Organizer'
  },
  {
    key: 'subject',
    header: 'Subject'
  },
  {
    key: 'datetime',
    header: 'Date & Time',
    render: (row: any) =>
    <div className="text-sm">
          <div>{row.date}</div>
          <div className="text-gray-500 text-xs">{row.time}</div>
        </div>

  },
  {
    key: 'location',
    header: 'Location'
  },
  {
    key: 'status',
    header: 'Status',
    render: (row: any) =>
    <Badge
      variant={
      row.status === 'Accepted' ?
      'success' :
      row.status === 'Pending' ?
      'warning' :
      'default'
      }>

          {row.status}
        </Badge>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: any) =>
    row.status === 'Pending' ?
    <div className="flex gap-2">
            <Button variant="ghost" size="xs" className="text-green-600">
              <Check className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="xs" className="text-red-600">
              <X className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="xs" className="text-blue-600">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div> :
    null
  }];

  const outgoingColumns = [
  {
    key: 'recipient',
    header: 'Recipient'
  },
  {
    key: 'subject',
    header: 'Subject'
  },
  {
    key: 'date',
    header: 'Proposed Date'
  },
  {
    key: 'status',
    header: 'Status',
    render: (row: any) => <Badge variant="warning">{row.status}</Badge>
  }];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meeting Requests</h1>
          <p className="text-sm text-gray-500">
            Manage appointments with parents, students, and staff.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsNewMeetingModalOpen(true)}>

          <Plus className="w-4 h-4 mr-2" /> Request Meeting
        </Button>
      </div>

      <Card title="Incoming Requests">
        <Table columns={incomingColumns} data={incomingRequests} />
      </Card>

      <Card title="My Sent Requests">
        <Table columns={outgoingColumns} data={outgoingRequests} />
      </Card>

      <Modal
        isOpen={isNewMeetingModalOpen}
        onClose={() => setIsNewMeetingModalOpen(false)}
        title="Request New Meeting">

        <div className="space-y-4">
          <Select
            label="Meeting With"
            options={[
            {
              value: 'parent',
              label: 'Parent'
            },
            {
              value: 'student',
              label: 'Student'
            },
            {
              value: 'staff',
              label: 'Staff Member'
            }]
            } />

          <Input label="Name/ID" placeholder="Search person..." />
          <Input label="Subject" placeholder="Purpose of meeting" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Proposed Date" type="date" />
            <Input label="Proposed Time" type="time" />
          </div>
          <Select
            label="Location"
            options={[
            {
              value: 'online',
              label: 'Online (Video Call)'
            },
            {
              value: 'staffroom',
              label: 'Staff Room'
            },
            {
              value: 'office',
              label: 'Office'
            }]
            } />

          <Textarea label="Message/Notes" rows={3} />
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsNewMeetingModalOpen(false)}>

              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => setIsNewMeetingModalOpen(false)}>

              Send Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>);

}