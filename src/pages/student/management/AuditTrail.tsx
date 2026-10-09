import React, { useState, Component } from 'react';
import {
  History,
  Search,
  Filter,
  Download,
  Eye,
  User,
  Calendar,
  FileText,
  Shield,
  Clock,
  ArrowRight,
  RefreshCw } from
'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Modal } from '../../../components/ui/Modal';
// --- Types ---
interface AuditDetail {
  id: string;
  fieldLabel: string;
  oldValue: string;
  newValue: string;
  isSensitive?: boolean;
}
interface AuditEvent {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  actionType:
  'CREATE' |
  'UPDATE' |
  'DELETE' |
  'STATUS_CHANGE' |
  'DOCUMENT_UPLOAD' |
  'DOCUMENT_DELETE' |
  'PHOTO_CHANGE';
  module: string;
  pageFeature: string;
  entityKey: string;
  summary: string;
  ipAddress: string;
  details: AuditDetail[];
}
// --- Mock Data ---
const MOCK_AUDIT_LOGS: AuditEvent[] = [
{
  id: 'AUD-001',
  timestamp: '2024-03-20 10:30 AM',
  userId: 'U-101',
  userName: 'Admin User',
  userRole: 'Administrator',
  actionType: 'UPDATE',
  module: 'StudentManagement',
  pageFeature: 'Student Master',
  entityKey: 'GR-1001 | Aarav Patel',
  summary: 'Updated permanent address',
  ipAddress: '192.168.1.10',
  details: [
  {
    id: 'D-1',
    fieldLabel: 'Address Line 1',
    oldValue: '123 Old St',
    newValue: '456 New Ave'
  },
  {
    id: 'D-2',
    fieldLabel: 'City',
    oldValue: 'Mumbai',
    newValue: 'Pune'
  }]

},
{
  id: 'AUD-002',
  timestamp: '2024-03-20 09:15 AM',
  userId: 'U-105',
  userName: 'Priya Sharma',
  userRole: 'Class Teacher',
  actionType: 'STATUS_CHANGE',
  module: 'StudentManagement',
  pageFeature: 'Student Status',
  entityKey: 'GR-1005 | Amit Kumar',
  summary: 'Marked status: Active → Withdrawn',
  ipAddress: '192.168.1.12',
  details: [
  {
    id: 'D-3',
    fieldLabel: 'Status',
    oldValue: 'Active',
    newValue: 'Withdrawn'
  },
  {
    id: 'D-4',
    fieldLabel: 'Reason',
    oldValue: '-',
    newValue: 'Parent Transfer'
  }]

},
{
  id: 'AUD-003',
  timestamp: '2024-03-19 04:45 PM',
  userId: 'U-102',
  userName: 'System',
  userRole: 'System',
  actionType: 'DOCUMENT_UPLOAD',
  module: 'StudentManagement',
  pageFeature: 'Documents',
  entityKey: 'GR-1002 | Zara Khan',
  summary: 'Uploaded Birth Certificate',
  ipAddress: '127.0.0.1',
  details: [
  {
    id: 'D-5',
    fieldLabel: 'Document',
    oldValue: '[none]',
    newValue: 'birth_cert.pdf'
  }]

},
{
  id: 'AUD-004',
  timestamp: '2024-03-19 02:00 PM',
  userId: 'U-101',
  userName: 'Admin User',
  userRole: 'Administrator',
  actionType: 'CREATE',
  module: 'StudentManagement',
  pageFeature: 'New Registration',
  entityKey: 'GR-1006 | New Student',
  summary: 'Created new student record',
  ipAddress: '192.168.1.10',
  details: []
},
// Added more items to demonstrate scrolling
{
  id: 'AUD-005',
  timestamp: '2024-03-18 11:00 AM',
  userId: 'U-103',
  userName: 'Rajesh Koothrappali',
  userRole: 'Clerk',
  actionType: 'UPDATE',
  module: 'Fees',
  pageFeature: 'Fee Collection',
  entityKey: 'GR-1003 | Rohan Verma',
  summary: 'Updated fee payment status',
  ipAddress: '192.168.1.15',
  details: [
  {
    id: 'D-6',
    fieldLabel: 'Payment Status',
    oldValue: 'Pending',
    newValue: 'Paid'
  }]

},
{
  id: 'AUD-006',
  timestamp: '2024-03-18 09:30 AM',
  userId: 'U-101',
  userName: 'Admin User',
  userRole: 'Administrator',
  actionType: 'DELETE',
  module: 'StudentManagement',
  pageFeature: 'Student Master',
  entityKey: 'GR-0099 | Test Student',
  summary: 'Deleted erroneous student record',
  ipAddress: '192.168.1.10',
  details: []
}];

export function AuditTrail() {
  // --- State ---
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    user: '',
    actionType: '',
    entity: ''
  });
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  // --- Handlers ---
  const handleViewDetail = (event: AuditEvent) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };
  const handleResetFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      user: '',
      actionType: '',
      entity: ''
    });
  };
  // --- Helper Components ---
  const ActionBadge = ({ type }: {type: string;}) => {
    const colors: Record<string, string> = {
      CREATE: 'success',
      UPDATE: 'info',
      DELETE: 'danger',
      STATUS_CHANGE: 'warning',
      DOCUMENT_UPLOAD: 'primary',
      DOCUMENT_DELETE: 'danger',
      PHOTO_CHANGE: 'secondary'
    };
    return (
      <Badge variant={colors[type] as any || 'secondary'}>
        {type.replace('_', ' ')}
      </Badge>);

  };
  // --- Main Render ---
  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Student Audit Trail
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Secure, immutable log of all changes to student records.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
            Export Log
          </Button>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto pr-2 pb-6 space-y-6">
        {/* Filters Card */}
        <Card className="p-4 bg-gray-50 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Input
              label="Date From"
              type="date"
              value={filters.dateFrom}
              onChange={(e) =>
              setFilters({
                ...filters,
                dateFrom: e.target.value
              })
              } />

            <Input
              label="Date To"
              type="date"
              value={filters.dateTo}
              onChange={(e) =>
              setFilters({
                ...filters,
                dateTo: e.target.value
              })
              } />

            <Select
              label="Action Type"
              options={[
              {
                value: '',
                label: 'All Actions'
              },
              {
                value: 'CREATE',
                label: 'Create'
              },
              {
                value: 'UPDATE',
                label: 'Update'
              },
              {
                value: 'DELETE',
                label: 'Delete'
              },
              {
                value: 'STATUS_CHANGE',
                label: 'Status Change'
              },
              {
                value: 'DOCUMENT_UPLOAD',
                label: 'Document Upload'
              }]
              }
              value={filters.actionType}
              onChange={(val) =>
              setFilters({
                ...filters,
                actionType: val
              })
              } />

            <Input
              label="User / Role"
              placeholder="Search User..."
              value={filters.user}
              onChange={(e) =>
              setFilters({
                ...filters,
                user: e.target.value
              })
              }
              leftIcon={<User className="w-4 h-4" />} />

            <Input
              label="Student / Entity"
              placeholder="GR, Name..."
              value={filters.entity}
              onChange={(e) =>
              setFilters({
                ...filters,
                entity: e.target.value
              })
              }
              leftIcon={<Search className="w-4 h-4" />} />

          </div>
          <div className="flex justify-end mt-4 gap-2">
            <Button
              variant="ghost"
              onClick={handleResetFilters}
              leftIcon={<RefreshCw className="w-4 h-4" />}>

              Reset
            </Button>
            <Button variant="primary" leftIcon={<Filter className="w-4 h-4" />}>
              Apply Filters
            </Button>
          </div>
        </Card>

        {/* Audit List Table Card */}
        <Card noPadding className="overflow-hidden">
          {/*
              Adding a max-height and overflow-auto to the table container
              ensures the table header sticks or scrolls independently if needed,
              though the parent container already scrolls.
              */}
          <div className="overflow-x-auto">
            <Table
              columns={[
              {
                key: 'timestamp',
                header: 'Timestamp',
                render: (row: AuditEvent) =>
                <div className="text-sm font-mono text-gray-600">
                      {row.timestamp}
                    </div>

              },
              {
                key: 'user',
                header: 'User',
                render: (row: AuditEvent) =>
                <div>
                      <div className="font-medium">{row.userName}</div>
                      <div className="text-xs text-gray-500">
                        {row.userRole}
                      </div>
                    </div>

              },
              {
                key: 'action',
                header: 'Action',
                render: (row: AuditEvent) =>
                <ActionBadge type={row.actionType} />

              },
              {
                key: 'feature',
                header: 'Feature',
                render: (row: AuditEvent) =>
                <span className="text-sm text-gray-600">
                      {row.pageFeature}
                    </span>

              },
              {
                key: 'entity',
                header: 'Student / Entity',
                render: (row: AuditEvent) =>
                <span className="font-medium text-sm">{row.entityKey}</span>

              },
              {
                key: 'summary',
                header: 'Summary',
                render: (row: AuditEvent) =>
                <span className="text-sm">{row.summary}</span>

              },
              {
                key: 'view',
                header: '',
                render: (row: AuditEvent) =>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => handleViewDetail(row)}>

                      <Eye className="w-4 h-4" />
                    </Button>

              }]
              }
              data={MOCK_AUDIT_LOGS} />

          </div>
        </Card>
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Audit Event Details"
        size="lg"
        footer={
        <div className="flex justify-end w-full">
            <Button
            variant="outline"
            onClick={() => setIsDetailModalOpen(false)}>

              Close
            </Button>
          </div>
        }>

        {selectedEvent &&
        <div className="space-y-6">
            {/* Header Info */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 block">Event ID</span>
                <span className="font-mono font-medium">
                  {selectedEvent.id}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">Timestamp</span>
                <span className="font-medium">{selectedEvent.timestamp}</span>
              </div>
              <div>
                <span className="text-gray-500 block">User</span>
                <span className="font-medium">
                  {selectedEvent.userName} ({selectedEvent.userRole})
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">IP Address</span>
                <span className="font-mono">{selectedEvent.ipAddress}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500 block">Action Summary</span>
                <span className="font-medium text-gray-900">
                  {selectedEvent.summary}
                </span>
              </div>
            </div>

            {/* Change Details */}
            <div>
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Change Details
              </h4>
              {selectedEvent.details.length > 0 ?
            <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Field
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Old Value
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          New Value
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedEvent.details.map((detail) =>
                  <tr key={detail.id}>
                          <td className="px-4 py-2 text-sm font-medium text-gray-900">
                            {detail.fieldLabel}
                          </td>
                          <td className="px-4 py-2 text-sm text-red-600 bg-red-50">
                            {detail.oldValue}
                          </td>
                          <td className="px-4 py-2 text-sm text-green-600 bg-green-50">
                            {detail.newValue}
                          </td>
                        </tr>
                  )}
                    </tbody>
                  </table>
                </div> :

            <div className="text-center py-8 bg-gray-50 rounded border border-dashed text-gray-500 text-sm">
                  No field-level changes recorded for this event.
                </div>
            }
            </div>

            {/* Security Note */}
            <div className="flex items-start gap-2 p-3 bg-blue-50 text-blue-700 text-xs rounded border border-blue-100">
              <Shield className="w-4 h-4 mt-0.5" />
              <p>
                This audit log is immutable. It cannot be edited or deleted by
                any user, including administrators. Retention policy: 7 years.
              </p>
            </div>
          </div>
        }
      </Modal>
    </div>);

}