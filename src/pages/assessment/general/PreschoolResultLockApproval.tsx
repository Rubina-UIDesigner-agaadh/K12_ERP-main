import React, { useMemo, useState, Fragment } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { MultiSelect } from '../../../components/ui/MultiSelect';
import {
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Send,
  Eye,
  FileText,
  User,
  Users,
  ChevronRight,
  Shield,
  History,
  Download,
  Filter,
  RefreshCw } from
'lucide-react';
type ApprovalStatus = 'Draft' | 'Submitted' | 'Approved' | 'Locked';
type ApprovalStage = 'Teacher' | 'Coordinator' | 'Principal';
interface ClassRecord {
  id: string;
  class: string;
  section: string;
  term: string;
  teacherName: string;
  studentCount: number;
  completedCount: number;
  status: ApprovalStatus;
  currentStage: ApprovalStage;
  submittedAt?: string;
  approvedAt?: string;
  lockedAt?: string;
  remarks: string;
}
interface AuditLog {
  id: string;
  classId: string;
  action: string;
  performedBy: string;
  role: ApprovalStage;
  timestamp: string;
  remarks: string;
}
const mockRecords: ClassRecord[] = [
{
  id: '1',
  class: 'Nursery',
  section: 'A',
  term: 'Term 1',
  teacherName: 'Ms. Priya Desai',
  studentCount: 20,
  completedCount: 20,
  status: 'Locked',
  currentStage: 'Principal',
  submittedAt: '2024-11-20',
  approvedAt: '2024-11-22',
  lockedAt: '2024-11-25',
  remarks: ''
},
{
  id: '2',
  class: 'Nursery',
  section: 'B',
  term: 'Term 1',
  teacherName: 'Ms. Kavitha Rao',
  studentCount: 18,
  completedCount: 18,
  status: 'Approved',
  currentStage: 'Principal',
  submittedAt: '2024-11-21',
  approvedAt: '2024-11-23',
  remarks: ''
},
{
  id: '3',
  class: 'Jr KG',
  section: 'A',
  term: 'Term 1',
  teacherName: 'Ms. Anita Sharma',
  studentCount: 22,
  completedCount: 22,
  status: 'Submitted',
  currentStage: 'Coordinator',
  submittedAt: '2024-11-22',
  remarks: ''
},
{
  id: '4',
  class: 'Jr KG',
  section: 'B',
  term: 'Term 1',
  teacherName: 'Ms. Rekha Pillai',
  studentCount: 20,
  completedCount: 19,
  status: 'Draft',
  currentStage: 'Teacher',
  remarks: '1 student entry pending'
},
{
  id: '5',
  class: 'Sr KG',
  section: 'A',
  term: 'Term 1',
  teacherName: 'Ms. Deepa Nair',
  studentCount: 24,
  completedCount: 24,
  status: 'Submitted',
  currentStage: 'Coordinator',
  submittedAt: '2024-11-23',
  remarks: ''
},
{
  id: '6',
  class: 'Sr KG',
  section: 'B',
  term: 'Term 1',
  teacherName: 'Ms. Sunita Joshi',
  studentCount: 21,
  completedCount: 18,
  status: 'Draft',
  currentStage: 'Teacher',
  remarks: '3 students pending'
}];

const mockAuditLogs: AuditLog[] = [
{
  id: '1',
  classId: '1',
  action: 'Locked',
  performedBy: 'Mr. Rajesh Kumar',
  role: 'Principal',
  timestamp: '2024-11-25 10:30 AM',
  remarks: 'All records verified and locked.'
},
{
  id: '2',
  classId: '1',
  action: 'Approved',
  performedBy: 'Ms. Sunita Mehta',
  role: 'Coordinator',
  timestamp: '2024-11-22 02:15 PM',
  remarks: 'Reviewed and approved.'
},
{
  id: '3',
  classId: '1',
  action: 'Submitted',
  performedBy: 'Ms. Priya Desai',
  role: 'Teacher',
  timestamp: '2024-11-20 04:00 PM',
  remarks: 'All 20 students completed.'
}];

const BRANCH_OPTIONS = [
{
  value: 'main',
  label: 'Main Campus'
},
{
  value: 'west',
  label: 'West Branch'
},
{
  value: 'east',
  label: 'East Branch'
}];

export function PreschoolResultLockApproval() {
  const [records, setRecords] = useState<ClassRecord[]>(mockRecords);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [filterTerm, setFilterTerm] = useState('Term 1');
  const [filterLevel, setFilterLevel] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<ClassRecord | null>(null);
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [remarkInput, setRemarkInput] = useState('');
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (filterLevel && r.class !== filterLevel) return false;
      if (filterSection && r.section !== filterSection) return false;
      if (filterStatus && r.status !== filterStatus) return false;
      return true;
    });
  }, [records, filterLevel, filterSection, filterStatus]);
  const stats = useMemo(
    () => ({
      total: records.length,
      draft: records.filter((r) => r.status === 'Draft').length,
      submitted: records.filter((r) => r.status === 'Submitted').length,
      approved: records.filter((r) => r.status === 'Approved').length,
      locked: records.filter((r) => r.status === 'Locked').length
    }),
    [records]
  );
  const handleAction = (
  record: ClassRecord,
  action: 'submit' | 'approve' | 'lock' | 'reject') =>
  {
    setRecords((prev) =>
    prev.map((r) => {
      if (r.id !== record.id) return r;
      switch (action) {
        case 'submit':
          return {
            ...r,
            status: 'Submitted',
            currentStage: 'Coordinator',
            submittedAt: new Date().toLocaleDateString()
          };
        case 'approve':
          return {
            ...r,
            status: 'Approved',
            currentStage: 'Principal',
            approvedAt: new Date().toLocaleDateString()
          };
        case 'lock':
          return {
            ...r,
            status: 'Locked',
            lockedAt: new Date().toLocaleDateString()
          };
        case 'reject':
          return {
            ...r,
            status: 'Draft',
            currentStage: 'Teacher',
            remarks: remarkInput || 'Returned for correction'
          };
        default:
          return r;
      }
    })
    );
    setRemarkInput('');
  };
  const statusConfig: Record<
    ApprovalStatus,
    {
      color: string;
      icon: any;
      label: string;
    }> =
  {
    Draft: {
      color: 'bg-gray-100 text-gray-700',
      icon: FileText,
      label: 'Draft'
    },
    Submitted: {
      color: 'bg-blue-100 text-blue-700',
      icon: Send,
      label: 'Submitted'
    },
    Approved: {
      color: 'bg-green-100 text-green-700',
      icon: CheckCircle,
      label: 'Approved'
    },
    Locked: {
      color: 'bg-purple-100 text-purple-700',
      icon: Lock,
      label: 'Locked'
    }
  };
  const stageFlow: ApprovalStage[] = ['Teacher', 'Coordinator', 'Principal'];
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Result Lock & Approval
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Finalize term evaluation — Teacher → Coordinator → Principal
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAuditLog(!showAuditLog)}>

            <History className="w-4 h-4 mr-2" />
            Audit Log
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <p className="text-xs text-gray-500 uppercase font-medium">Total</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </Card>
        <Card className="p-4 border-gray-200">
          <p className="text-xs text-gray-500 uppercase font-medium">Draft</p>
          <p className="text-2xl font-bold text-gray-500 mt-1">{stats.draft}</p>
        </Card>
        <Card className="p-4 border-blue-200">
          <p className="text-xs text-blue-600 uppercase font-medium">
            Submitted
          </p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {stats.submitted}
          </p>
        </Card>
        <Card className="p-4 border-green-200">
          <p className="text-xs text-green-600 uppercase font-medium">
            Approved
          </p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {stats.approved}
          </p>
        </Card>
        <Card className="p-4 border-purple-200">
          <p className="text-xs text-purple-600 uppercase font-medium">
            Locked
          </p>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            {stats.locked}
          </p>
        </Card>
      </div>

      {/* Approval Flow Diagram */}
      <Card className="p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Approval Workflow</h3>
        <div className="flex items-center gap-2">
          {stageFlow.map((stage, idx) =>
          <Fragment key={stage}>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  {stage}
                </span>
              </div>
              {idx < stageFlow.length - 1 &&
            <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
            }
            </Fragment>
          )}
          <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg">
            <Lock className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Locked</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          After locking, no editing is allowed. All status changes are logged in
          the audit trail.
        </p>
      </Card>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <MultiSelect
            label=""
            options={BRANCH_OPTIONS}
            value={selectedBranches}
            onChange={setSelectedBranches}
            placeholder="All Branches" />

          <select
            value={filterTerm}
            onChange={(e) => setFilterTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

            <option>Term 1</option>
            <option>Term 2</option>
            <option>Term 3</option>
          </select>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

            <option value="">All Levels</option>
            <option>Nursery</option>
            <option>Jr KG</option>
            <option>Sr KG</option>
          </select>
          <select
            value={filterSection}
            onChange={(e) => setFilterSection(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

            <option value="">All Sections</option>
            <option>A</option>
            <option>B</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

            <option value="">All Status</option>
            <option>Draft</option>
            <option>Submitted</option>
            <option>Approved</option>
            <option>Locked</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFilterLevel('');
              setFilterSection('');
              setFilterStatus('');
            }}>

            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Records Table */}
      <Card className="overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-800">
            Class-wise Approval Status — {filterTerm}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Class
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Teacher
                </th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                  Completion
                </th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                  Current Stage
                </th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Remarks
                </th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRecords.map((record) => {
                const StatusIcon = statusConfig[record.status].icon;
                return (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-gray-900">
                        {record.class} - {record.section}
                      </p>
                      <p className="text-xs text-gray-500">{record.term}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold">
                          {record.teacherName.split(' ').slice(-1)[0][0]}
                        </div>
                        <span className="text-sm text-gray-700">
                          {record.teacherName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {record.completedCount}/{record.studentCount}
                        </p>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{
                              width: `${record.completedCount / record.studentCount * 100}%`
                            }} />

                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        <User className="w-3 h-3" />
                        {record.currentStage}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[record.status].color}`}>

                        <StatusIcon className="w-3 h-3" />
                        {record.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {record.remarks || '—'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        {record.status === 'Draft' &&
                        record.completedCount === record.studentCount &&
                        <button
                          onClick={() => handleAction(record, 'submit')}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700">

                              <Send className="w-3 h-3" />
                              Submit
                            </button>
                        }
                        {record.status === 'Submitted' &&
                        <>
                            <button
                            onClick={() => handleAction(record, 'approve')}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700">

                              <CheckCircle className="w-3 h-3" />
                              Approve
                            </button>
                            <button
                            onClick={() => handleAction(record, 'reject')}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600">

                              <XCircle className="w-3 h-3" />
                              Reject
                            </button>
                          </>
                        }
                        {record.status === 'Approved' &&
                        <button
                          onClick={() => handleAction(record, 'lock')}
                          className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700">

                            <Lock className="w-3 h-3" />
                            Lock
                          </button>
                        }
                        {record.status === 'Locked' &&
                        <span className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">
                            <Lock className="w-3 h-3" />
                            Locked
                          </span>
                        }
                        <button
                          onClick={() =>
                          setSelectedRecord(
                            selectedRecord?.id === record.id ? null : record
                          )
                          }
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600">

                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Audit Log */}
      {showAuditLog &&
      <Card className="overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <History className="w-5 h-5 text-gray-600" />
              Audit Log
            </h3>
            <button
            onClick={() => setShowAuditLog(false)}
            className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-500">

              <XCircle className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {mockAuditLogs.map((log) =>
          <div key={log.id} className="px-5 py-4 flex items-start gap-4">
                <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${log.action === 'Locked' ? 'bg-purple-100 text-purple-700' : log.action === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>

                  {log.action === 'Locked' ?
              <Lock className="w-4 h-4" /> :
              log.action === 'Approved' ?
              <CheckCircle className="w-4 h-4" /> :

              <Send className="w-4 h-4" />
              }
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-gray-900 text-sm">
                      {log.action}
                    </span>
                    <span className="text-xs text-gray-500">
                      by {log.performedBy} ({log.role})
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{log.timestamp}</p>
                  {log.remarks &&
              <p className="text-xs text-gray-600 mt-1 italic">
                      "{log.remarks}"
                    </p>
              }
                </div>
              </div>
          )}
          </div>
        </Card>
      }
    </div>);

}