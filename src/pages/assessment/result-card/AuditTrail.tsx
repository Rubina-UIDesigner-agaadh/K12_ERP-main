import React, { useState } from 'react';
import {
  Shield,
  Search,
  Filter,
  Download,
  Eye,
  Printer,
  RefreshCw,
  CheckCircle,
  Edit,
  FileText,
  Lock,
  Clock,
  Monitor } from
'lucide-react';
interface AuditLog {
  id: string;
  studentName: string;
  rollNo: string;
  examName: string;
  action:
  'Generated' |
  'Regenerated' |
  'Printed' |
  'Reprinted' |
  'Marked Collected' |
  'Collection Edited';
  performedBy: string;
  dateTime: string;
  previousValue: string;
  updatedValue: string;
  ipSystem: string;
}
const auditLogs: AuditLog[] = [
{
  id: '1',
  studentName: 'Advait Krishnan',
  rollNo: '01',
  examName: 'Annual Exam 2024-25',
  action: 'Generated',
  performedBy: 'Admin User',
  dateTime: '2025-03-08 10:15:32',
  previousValue: '—',
  updatedValue: 'PDF Generated',
  ipSystem: '192.168.1.10'
},
{
  id: '2',
  studentName: 'Advait Krishnan',
  rollNo: '01',
  examName: 'Annual Exam 2024-25',
  action: 'Printed',
  performedBy: 'Admin User',
  dateTime: '2025-03-08 10:22:14',
  previousValue: 'Not Printed',
  updatedValue: 'Printed',
  ipSystem: '192.168.1.10'
},
{
  id: '3',
  studentName: 'Advait Krishnan',
  rollNo: '01',
  examName: 'Annual Exam 2024-25',
  action: 'Marked Collected',
  performedBy: 'Class Teacher',
  dateTime: '2025-03-10 14:05:00',
  previousValue: 'Not Collected',
  updatedValue: 'Collected by Parent',
  ipSystem: '192.168.1.22'
},
{
  id: '4',
  studentName: 'Ananya Sharma',
  rollNo: '02',
  examName: 'Annual Exam 2024-25',
  action: 'Generated',
  performedBy: 'Admin User',
  dateTime: '2025-03-08 10:15:32',
  previousValue: '—',
  updatedValue: 'PDF Generated',
  ipSystem: '192.168.1.10'
},
{
  id: '5',
  studentName: 'Ananya Sharma',
  rollNo: '02',
  examName: 'Annual Exam 2024-25',
  action: 'Reprinted',
  performedBy: 'Principal',
  dateTime: '2025-03-12 09:30:00',
  previousValue: 'Printed (1)',
  updatedValue: 'Reprinted (2)',
  ipSystem: '192.168.1.05'
},
{
  id: '6',
  studentName: 'Arjun Patel',
  rollNo: '03',
  examName: 'Annual Exam 2024-25',
  action: 'Regenerated',
  performedBy: 'Admin User',
  dateTime: '2025-03-09 11:00:00',
  previousValue: 'v1 PDF',
  updatedValue: 'v2 PDF (Grace applied)',
  ipSystem: '192.168.1.10'
},
{
  id: '7',
  studentName: 'Divya Nair',
  rollNo: '04',
  examName: 'Annual Exam 2024-25',
  action: 'Generated',
  performedBy: 'Admin User',
  dateTime: '2025-03-08 10:15:32',
  previousValue: '—',
  updatedValue: 'PDF Generated',
  ipSystem: '192.168.1.10'
},
{
  id: '8',
  studentName: 'Ishaan Mehta',
  rollNo: '05',
  examName: 'Annual Exam 2024-25',
  action: 'Marked Collected',
  performedBy: 'Class Teacher',
  dateTime: '2025-03-11 15:20:00',
  previousValue: 'Not Collected',
  updatedValue: 'Collected by Student',
  ipSystem: '192.168.1.22'
},
{
  id: '9',
  studentName: 'Kavitha Pillai',
  rollNo: '06',
  examName: 'Annual Exam 2024-25',
  action: 'Collection Edited',
  performedBy: 'Admin User',
  dateTime: '2025-03-13 10:00:00',
  previousValue: 'Collected by Parent',
  updatedValue: 'Collected by Guardian',
  ipSystem: '192.168.1.10'
}];

const actionConfig: Record<
  string,
  {
    color: string;
    icon: React.ElementType;
  }> =
{
  Generated: {
    color: 'bg-teal-100 text-teal-700',
    icon: FileText
  },
  Regenerated: {
    color: 'bg-blue-100 text-blue-700',
    icon: RefreshCw
  },
  Printed: {
    color: 'bg-indigo-100 text-indigo-700',
    icon: Printer
  },
  Reprinted: {
    color: 'bg-violet-100 text-violet-700',
    icon: Printer
  },
  'Marked Collected': {
    color: 'bg-green-100 text-green-700',
    icon: CheckCircle
  },
  'Collection Edited': {
    color: 'bg-amber-100 text-amber-700',
    icon: Edit
  }
};
export function AuditTrail() {
  const [selectedYear, setSelectedYear] = useState('2024-25');
  const [selectedExam, setSelectedExam] = useState('All');
  const [selectedStd, setSelectedStd] = useState('All');
  const [actionFilter, setActionFilter] = useState('All');
  const [search, setSearch] = useState('');
  const filtered = auditLogs.filter((log) => {
    const matchesAction = actionFilter === 'All' || log.action === actionFilter;
    const matchesSearch =
    log.studentName.toLowerCase().includes(search.toLowerCase()) ||
    log.rollNo.includes(search);
    return matchesAction && matchesSearch;
  });
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-slate-600 to-gray-700 rounded-xl text-white shadow-lg">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Audit Trail</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Complete tracking of result card generation and distribution
              activities
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-xs font-medium text-amber-700">
            <Lock className="w-3.5 h-3.5" /> Read-Only — Logs cannot be edited
            or deleted
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Download className="w-4 h-4" /> Export Log
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
        {
          label: 'Total Log Entries',
          value: auditLogs.length,
          color: 'text-gray-900'
        },
        {
          label: 'Generated',
          value: auditLogs.filter((l) => l.action === 'Generated').length,
          color: 'text-teal-600'
        },
        {
          label: 'Printed / Reprinted',
          value: auditLogs.filter(
            (l) => l.action === 'Printed' || l.action === 'Reprinted'
          ).length,
          color: 'text-indigo-600'
        },
        {
          label: 'Collection Updates',
          value: auditLogs.filter(
            (l) =>
            l.action === 'Marked Collected' ||
            l.action === 'Collection Edited'
          ).length,
          color: 'text-green-600'
        }].
        map(({ label, value, color }) =>
        <div
          key={label}
          className="bg-white rounded-xl border border-gray-200 p-4">

            <p className="text-xs text-gray-500 uppercase font-medium">
              {label}
            </p>
            <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
          {
            label: 'Academic Year',
            value: selectedYear,
            setter: setSelectedYear,
            options: ['2024-25', '2023-24']
          },
          {
            label: 'Exam',
            value: selectedExam,
            setter: setSelectedExam,
            options: ['All', 'Annual Exam', 'Term 1', 'Term 2']
          },
          {
            label: 'Standard',
            value: selectedStd,
            setter: setSelectedStd,
            options: ['All', '8', '9', '10', '11', '12']
          },
          {
            label: 'Action Type',
            value: actionFilter,
            setter: setActionFilter,
            options: [
            'All',
            'Generated',
            'Regenerated',
            'Printed',
            'Reprinted',
            'Marked Collected',
            'Collection Edited']

          }].
          map(({ label, value, setter, options }) =>
          <div key={label}>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {label}
              </label>
              <select
              value={value}
              onChange={(e) => setter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-500">

                {options.map((o) =>
              <option key={o}>{o}</option>
              )}
              </select>
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Search Student
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Name or Roll No..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500" />

            </div>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Activity Log</h3>
          <span className="text-sm text-gray-500">
            {filtered.length} entries
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Student
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Exam
                </th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                  Action
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Performed By
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Date & Time
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Previous Value
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Updated Value
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  IP / System
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((log) => {
                const config = actionConfig[log.action];
                const ActionIcon = config.icon;
                return (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">
                        {log.studentName}
                      </p>
                      <p className="text-xs text-gray-400">
                        Roll: {log.rollNo}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-xs">
                      {log.examName}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>

                        <ActionIcon className="w-3 h-3" /> {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700 text-sm">
                      {log.performedBy}
                    </td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />{' '}
                        {log.dateTime}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-500 italic">
                      {log.previousValue}
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-700 font-medium">
                      {log.updatedValue}
                    </td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Monitor className="w-3.5 h-3.5 text-gray-400" />{' '}
                        {log.ipSystem}
                      </span>
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>);

}