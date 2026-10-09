import React, { useState } from 'react';
import { Send, FileEdit, Trash2, RefreshCw, Eye } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Tabs } from '../../../components/ui/Tabs';
export function MySentDrafts() {
  const sentMessages = [
  {
    id: 1,
    subject: 'Leave Application - Nov',
    recipients: 'HOD Science, HR',
    date: '10-Nov-2024',
    status: 'Delivered'
  },
  {
    id: 2,
    subject: 'Lab Equipment Request',
    recipients: 'Admin Office',
    date: '05-Nov-2024',
    status: 'Read'
  },
  {
    id: 3,
    subject: 'Student Report Query',
    recipients: 'Class Teacher 10-A',
    date: '01-Nov-2024',
    status: 'Delivered'
  }];

  const drafts = [
  {
    id: 1,
    subject: 'Proposal for Science Fair',
    lastEdited: 'Yesterday'
  },
  {
    id: 2,
    subject: 'Meeting Notes',
    lastEdited: '2 days ago'
  }];

  const sentColumns = [
  {
    key: 'subject',
    header: 'Subject'
  },
  {
    key: 'recipients',
    header: 'To'
  },
  {
    key: 'date',
    header: 'Sent On'
  },
  {
    key: 'status',
    header: 'Status',
    render: (row: any) =>
    <Badge variant={row.status === 'Read' ? 'success' : 'info'}>
          {row.status}
        </Badge>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: () =>
    <div className="flex gap-2">
          <Button variant="ghost" size="xs">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="xs">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

  }];

  const draftColumns = [
  {
    key: 'subject',
    header: 'Subject'
  },
  {
    key: 'lastEdited',
    header: 'Last Edited'
  },
  {
    key: 'actions',
    header: 'Actions',
    render: () =>
    <div className="flex gap-2">
          <Button variant="ghost" size="xs">
            <FileEdit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="xs" className="text-red-500">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

  }];

  const tabs = [
  {
    id: 'sent',
    label: 'Sent Items',
    content:
    <Card noPadding>
          <Table columns={sentColumns} data={sentMessages} />
        </Card>

  },
  {
    id: 'drafts',
    label: 'Drafts',
    content:
    <Card noPadding>
          <Table columns={draftColumns} data={drafts} />
        </Card>

  }];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Sent Items & Drafts
        </h1>
        <p className="text-sm text-gray-500">
          Review messages you've sent or saved for later.
        </p>
      </div>

      <Tabs tabs={tabs} />
    </div>);

}