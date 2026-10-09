import React, { Fragment, useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  AlertTriangle,
  ArrowRightLeft,
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  History,
  Moon,
  Search,
  Send,
  Sun,
  Users,
  X,
  XCircle,
} from 'lucide-react';

type ShiftType = 'Morning' | 'Afternoon' | 'Both';
type RequestStatus = 'Pending' | 'Approved' | 'Rejected' | 'Applied';
type ShiftTab = 'assignments' | 'requests' | 'history';

interface AssignedClass {
  id: string;
  className: string;
  section: string;
  subject: string;
  periods: number;
}

interface Teacher {
  id: string;
  empId: string;
  name: string;
  avatar: string;
  department: string;
  currentShift: ShiftType;
  assignedClasses: AssignedClass[];
  totalPeriods: number;
  maxPeriods: number;
}

interface ShiftChangeRequest {
  id: string;
  teacherId: string;
  teacherName: string;
  currentShift: ShiftType;
  requestedShift: ShiftType;
  reason: string;
  status: RequestStatus;
  requestedAt: string;
  impact: {
    unassignedClasses: string[];
    workloadChange: string;
  };
}

interface ShiftHistory {
  id: string;
  teacherName: string;
  previousShift: ShiftType;
  newShift: ShiftType;
  changeDate: string;
  approvedBy: string;
  status: RequestStatus;
}

const departments = ['Mathematics', 'Science', 'English', 'History'];

const mockTeachers: Teacher[] = Array.from({ length: 15 }).map((_, index) => {
  const isMorning = index % 2 === 0;
  const isBoth = index % 5 === 0;
  const shift: ShiftType = isBoth ? 'Both' : isMorning ? 'Morning' : 'Afternoon';
  const periods = 15 + ((index * 7) % 20);
  return {
    id: `TCH${index + 1}`,
    empId: `EMP${1000 + index}`,
    name: `Teacher ${index + 1}`,
    avatar: `T${index + 1}`,
    department: departments[index % departments.length],
    currentShift: shift,
    totalPeriods: periods,
    maxPeriods: 30,
    assignedClasses: [
      { id: `C${index}1`, className: 'Grade 8', section: 'A', subject: 'Math', periods: 5 },
      { id: `C${index}2`, className: 'Grade 9', section: 'B', subject: 'Science', periods: 6 },
      { id: `C${index}3`, className: 'Grade 10', section: 'A', subject: 'English', periods: periods - 11 },
    ],
  };
});

const initialRequests: ShiftChangeRequest[] = [
  {
    id: 'REQ1', teacherId: 'TCH1', teacherName: 'Teacher 1', currentShift: 'Morning', requestedShift: 'Afternoon',
    reason: 'Personal scheduling conflict in the mornings.', status: 'Pending', requestedAt: '2024-03-15',
    impact: { unassignedClasses: ['Grade 8 A (Math)', 'Grade 9 B (Science)'], workloadChange: 'No change in total periods, but requires morning replacements.' },
  },
  {
    id: 'REQ2', teacherId: 'TCH2', teacherName: 'Teacher 2', currentShift: 'Afternoon', requestedShift: 'Morning',
    reason: 'Enrolled in evening classes.', status: 'Pending', requestedAt: '2024-03-14',
    impact: { unassignedClasses: ['Grade 10 A (English)'], workloadChange: 'Shift to morning requires 15 periods to be reassigned.' },
  },
  {
    id: 'REQ3', teacherId: 'TCH3', teacherName: 'Teacher 3', currentShift: 'Both', requestedShift: 'Morning',
    reason: 'Health reasons, cannot manage full day.', status: 'Pending', requestedAt: '2024-03-12',
    impact: { unassignedClasses: ['Grade 11 C (Physics) - Afternoon'], workloadChange: 'Reduction of 8 periods.' },
  },
];

const mockHistory: ShiftHistory[] = [
  { id: 'H1', teacherName: 'Teacher 4', previousShift: 'Morning', newShift: 'Afternoon', changeDate: '2024-02-01', approvedBy: 'Admin User', status: 'Applied' },
  { id: 'H2', teacherName: 'Teacher 5', previousShift: 'Afternoon', newShift: 'Morning', changeDate: '2024-01-15', approvedBy: 'Admin User', status: 'Applied' },
  { id: 'H3', teacherName: 'Teacher 6', previousShift: 'Both', newShift: 'Morning', changeDate: '2023-11-20', approvedBy: 'Admin User', status: 'Applied' },
  { id: 'H4', teacherName: 'Teacher 7', previousShift: 'Morning', newShift: 'Afternoon', changeDate: '2023-10-05', approvedBy: 'Admin User', status: 'Rejected' },
  { id: 'H5', teacherName: 'Teacher 8', previousShift: 'Afternoon', newShift: 'Both', changeDate: '2023-09-10', approvedBy: 'Admin User', status: 'Applied' },
];

const getShiftBadge = (shift: ShiftType) => {
  if (shift === 'Morning') return <Badge variant="info">Morning</Badge>;
  if (shift === 'Afternoon') return <Badge variant="secondary">Afternoon</Badge>;
  return <Badge variant="warning">Both</Badge>;
};

const getStatusBadge = (status: RequestStatus) => {
  const color = status === 'Pending'
    ? 'bg-yellow-100 text-yellow-800'
    : status === 'Approved'
      ? 'bg-green-100 text-green-800'
      : status === 'Rejected'
        ? 'bg-red-100 text-red-800'
        : 'bg-blue-100 text-blue-800';
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>{status}</span>;
};

export function ShiftViewAndSwitch() {
  const [activeTab, setActiveTab] = useState<ShiftTab>('assignments');
  const [batchFilter, setBatchFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [requestStatusFilter, setRequestStatusFilter] = useState('all');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestTeacherId, setRequestTeacherId] = useState('TCH1');
  const [requestForm, setRequestForm] = useState({ requestedShift: 'Afternoon' as ShiftType, reason: '' });
  const [requestError, setRequestError] = useState('');
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ShiftChangeRequest | null>(null);
  const [approvalAction, setApprovalAction] = useState<'Approve' | 'Reject' | null>(null);
  const [requests, setRequests] = useState<ShiftChangeRequest[]>(initialRequests);
  const [historyData, setHistoryData] = useState<ShiftHistory[]>(mockHistory);

  const requestTeacher = mockTeachers.find((teacher) => teacher.id === requestTeacherId) || null;
  const morningCount = mockTeachers.filter((teacher) => teacher.currentShift === 'Morning' || teacher.currentShift === 'Both').length;
  const afternoonCount = mockTeachers.filter((teacher) => teacher.currentShift === 'Afternoon' || teacher.currentShift === 'Both').length;
  const bothCount = mockTeachers.filter((teacher) => teacher.currentShift === 'Both').length;
  const overloadedCount = mockTeachers.filter((teacher) => teacher.totalPeriods > teacher.maxPeriods).length;

  const filteredTeachers = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    return mockTeachers.filter((teacher) => {
      const matchesBatch = batchFilter === 'All'
        || teacher.currentShift === batchFilter
        || (teacher.currentShift === 'Both' && batchFilter !== 'Both');
      const matchesDepartment = !departmentFilter || teacher.department === departmentFilter;
      const matchesSearch = !term || [teacher.name, teacher.empId, teacher.department].some((value) => value.toLowerCase().includes(term));
      return matchesBatch && matchesDepartment && matchesSearch;
    });
  }, [batchFilter, departmentFilter, searchQuery]);

  const filteredRequests = useMemo(() => {
    if (requestStatusFilter === 'all') return requests;
    return requests.filter((request) => request.status.toLowerCase() === requestStatusFilter);
  }, [requests, requestStatusFilter]);

  const toggleRow = (id: string) => {
    setExpandedRows((current) => {
      const updated = new Set(current);
      if (updated.has(id)) updated.delete(id);
      else updated.add(id);
      return updated;
    });
  };

  const openRequestModal = () => {
    const firstTeacher = mockTeachers[0];
    setRequestTeacherId(firstTeacher.id);
    setRequestForm({ requestedShift: firstTeacher.currentShift === 'Morning' ? 'Afternoon' : 'Morning', reason: '' });
    setRequestError('');
    setIsRequestModalOpen(true);
  };

  const handleRequestSubmit = () => {
    if (!requestTeacher) return;
    if (!requestForm.reason.trim()) {
      setRequestError('Enter a reason for the shift change request.');
      return;
    }
    if (requestForm.requestedShift === requestTeacher.currentShift) {
      setRequestError('Choose a shift different from the current assignment.');
      return;
    }
    const request: ShiftChangeRequest = {
      id: `REQ-${Date.now().toString().slice(-6)}`,
      teacherId: requestTeacher.id,
      teacherName: requestTeacher.name,
      currentShift: requestTeacher.currentShift,
      requestedShift: requestForm.requestedShift,
      reason: requestForm.reason.trim(),
      status: 'Pending',
      requestedAt: new Date().toISOString().slice(0, 10),
      impact: {
        unassignedClasses: requestTeacher.assignedClasses.map((assignedClass) => `${assignedClass.className} ${assignedClass.section} (${assignedClass.subject})`),
        workloadChange: `Review ${requestTeacher.totalPeriods} assigned periods for replacement coverage.`,
      },
    };
    setRequests((current) => [request, ...current]);
    setActiveTab('requests');
    setIsRequestModalOpen(false);
    setRequestError('');
  };

  const handleApproval = (request: ShiftChangeRequest, action: 'Approve' | 'Reject') => {
    setSelectedRequest(request);
    setApprovalAction(action);
    setIsApprovalModalOpen(true);
  };

  const handleApprovalSubmit = () => {
    if (!selectedRequest || !approvalAction) return;
    const newStatus: RequestStatus = approvalAction === 'Approve' ? 'Approved' : 'Rejected';
    setRequests((current) => current.map((request) => request.id === selectedRequest.id ? { ...request, status: newStatus } : request));
    if (approvalAction === 'Approve') {
      setHistoryData((current) => [{
        id: `H${Date.now()}`,
        teacherName: selectedRequest.teacherName,
        previousShift: selectedRequest.currentShift,
        newShift: selectedRequest.requestedShift,
        changeDate: new Date().toISOString().slice(0, 10),
        approvedBy: 'Admin User',
        status: 'Applied',
      }, ...current]);
    }
    setIsApprovalModalOpen(false);
    setSelectedRequest(null);
    setApprovalAction(null);
  };

  const tabClasses = (tab: ShiftTab) => `flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors sm:px-5 ${activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`;

  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-4 text-gray-900 sm:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">Employee · Attendance &amp; Scheduling</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">Teacher Shift View &amp; Switch</h1>
          <p className="mt-1 text-sm text-gray-500">View teacher shift assignments and manage shift change requests.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-44"><Select value={batchFilter} onChange={(event) => setBatchFilter(event.target.value)} options={[{ value: 'All', label: 'All Shifts' }, { value: 'Morning', label: 'Morning Shift' }, { value: 'Afternoon', label: 'Afternoon Shift' }, { value: 'Both', label: 'Both Shifts' }]} /></div>
          <Button variant="outline" onClick={() => { setSearchQuery(''); setDepartmentFilter(''); setBatchFilter('All'); }}>Clear filters</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="flex items-center gap-4 p-4"><div className="rounded-lg bg-amber-100 p-3 text-amber-600"><Sun className="h-6 w-6" /></div><div><p className="text-sm text-gray-500">Morning Teachers</p><p className="text-2xl font-bold text-gray-900">{morningCount}</p></div></Card>
        <Card className="flex items-center gap-4 p-4"><div className="rounded-lg bg-indigo-100 p-3 text-indigo-600"><Moon className="h-6 w-6" /></div><div><p className="text-sm text-gray-500">Afternoon Teachers</p><p className="text-2xl font-bold text-gray-900">{afternoonCount}</p></div></Card>
        <Card className="flex items-center gap-4 p-4"><div className="rounded-lg bg-purple-100 p-3 text-purple-600"><ArrowRightLeft className="h-6 w-6" /></div><div><p className="text-sm text-gray-500">Both Shifts</p><p className="text-2xl font-bold text-gray-900">{bothCount}</p></div></Card>
        <Card className="flex items-center gap-4 p-4"><div className="rounded-lg bg-red-100 p-3 text-red-600"><AlertTriangle className="h-6 w-6" /></div><div><p className="text-sm text-gray-500">Overloaded</p><p className="text-2xl font-bold text-gray-900">{overloadedCount}</p></div></Card>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto border-b border-gray-200 bg-white">
          <nav className="flex min-w-max px-2" aria-label="Shift workspace tabs">
            <button type="button" onClick={() => setActiveTab('assignments')} className={tabClasses('assignments')}><Users className="h-4 w-4" />Shift Assignments</button>
            <button type="button" onClick={() => setActiveTab('requests')} className={tabClasses('requests')}><Clock className="h-4 w-4" />Change Requests{requests.filter((request) => request.status === 'Pending').length > 0 && <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700">{requests.filter((request) => request.status === 'Pending').length}</span>}</button>
            <button type="button" onClick={() => setActiveTab('history')} className={tabClasses('history')}><History className="h-4 w-4" />History</button>
          </nav>
        </div>

        <div className="p-4 sm:p-6">
          {activeTab === 'assignments' && (
            <div className="space-y-4">
              <div className="flex flex-col gap-3 md:flex-row">
                <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input type="search" aria-label="Search teachers" placeholder="Search by name, employee ID, or department..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
                <div className="min-w-48"><Select value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value)} options={[{ value: '', label: 'All Departments' }, ...departments.map((department) => ({ value: department, label: department }))]} /></div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50"><tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Teacher</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Department</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-600">Shift</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-600">Periods</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-600">Workload</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-600">Details</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {filteredTeachers.map((teacher) => (
                      <Fragment key={teacher.id}>
                        <tr className="hover:bg-gray-50">
                          <td className="whitespace-nowrap px-4 py-3"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">{teacher.avatar}</span><span><span className="block text-sm font-medium text-gray-900">{teacher.name}</span><span className="text-xs text-gray-500">{teacher.empId}</span></span></div></td>
                          <td className="px-4 py-3 text-sm text-gray-600">{teacher.department}</td>
                          <td className="px-4 py-3 text-center">{getShiftBadge(teacher.currentShift)}</td>
                          <td className="px-4 py-3 text-center text-sm font-medium text-gray-900">{teacher.totalPeriods}/{teacher.maxPeriods}</td>
                          <td className="px-4 py-3"><div className="mx-auto h-2 w-full max-w-[120px] overflow-hidden rounded-full bg-gray-200"><div className={`h-full rounded-full ${teacher.totalPeriods > teacher.maxPeriods ? 'bg-red-500' : teacher.totalPeriods / teacher.maxPeriods > 0.8 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${Math.min((teacher.totalPeriods / teacher.maxPeriods) * 100, 100)}%` }} /></div></td>
                          <td className="px-4 py-3 text-center"><button type="button" aria-label={`${expandedRows.has(teacher.id) ? 'Hide' : 'Show'} classes for ${teacher.name}`} aria-expanded={expandedRows.has(teacher.id)} onClick={() => toggleRow(teacher.id)} className="rounded-lg p-1.5 transition-colors hover:bg-gray-100">{expandedRows.has(teacher.id) ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}</button></td>
                        </tr>
                        {expandedRows.has(teacher.id) && <tr><td colSpan={6} className="bg-gray-50 px-4 py-4 sm:px-8"><p className="mb-2 text-xs font-semibold uppercase text-gray-500">Assigned Classes</p><div className="grid grid-cols-1 gap-2 md:grid-cols-3">{teacher.assignedClasses.map((assignedClass) => <div key={assignedClass.id} className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-3"><BookOpen className="h-4 w-4 shrink-0 text-indigo-500" /><div><p className="text-sm font-medium text-gray-900">{assignedClass.className} {assignedClass.section} · {assignedClass.subject}</p><p className="text-xs text-gray-500">{assignedClass.periods} periods/week</p></div></div>)}</div></td></tr>}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
                {filteredTeachers.length === 0 && <div className="py-12 text-center text-gray-400"><Users className="mx-auto mb-2 h-10 w-10" /><p>No teachers match the current filters.</p></div>}
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="min-w-52"><Select value={requestStatusFilter} onChange={(event) => setRequestStatusFilter(event.target.value)} options={[{ value: 'all', label: 'All Statuses' }, { value: 'pending', label: 'Pending' }, { value: 'approved', label: 'Approved' }, { value: 'rejected', label: 'Rejected' }]} /></div>
                <Button variant="primary" onClick={openRequestModal}><Send className="mr-2 h-4 w-4" />Request Shift Change</Button>
              </div>
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <article key={request.id} className="rounded-xl border border-gray-200 bg-white p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3"><h3 className="text-base font-semibold text-gray-900">{request.teacherName}</h3>{getStatusBadge(request.status)}</div>
                        <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-gray-600"><span className="inline-flex items-center gap-2">{getShiftBadge(request.currentShift)}<span>→</span>{getShiftBadge(request.requestedShift)}</span><span className="text-xs text-gray-400">Requested: {request.requestedAt}</span></div>
                        <p className="mb-3 text-sm text-gray-600"><strong>Reason:</strong> {request.reason}</p>
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3"><p className="mb-1 flex items-center gap-1 text-xs font-semibold text-amber-800"><AlertTriangle className="h-3.5 w-3.5" />Impact Preview</p><p className="mb-1 text-xs text-amber-700"><strong>Affected classes:</strong> {request.impact.unassignedClasses.join(', ') || 'None listed'}</p><p className="text-xs text-amber-700"><strong>Workload:</strong> {request.impact.workloadChange}</p></div>
                      </div>
                      {request.status === 'Pending' && <div className="flex gap-2 lg:flex-col"><Button variant="primary" onClick={() => handleApproval(request, 'Approve')}><CheckCircle className="mr-1 h-4 w-4" />Approve</Button><Button variant="outline" onClick={() => handleApproval(request, 'Reject')}><XCircle className="mr-1 h-4 w-4" />Reject</Button></div>}
                    </div>
                  </article>
                ))}
                {filteredRequests.length === 0 && <div className="py-12 text-center text-gray-400"><Clock className="mx-auto mb-2 h-10 w-10" /><p>No shift change requests found.</p></div>}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Teacher</th><th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-600">Previous Shift</th><th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-600">New Shift</th><th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-600">Date</th><th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-600">Approved By</th><th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-600">Status</th></tr></thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {historyData.map((history) => <tr key={history.id} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm font-medium text-gray-900">{history.teacherName}</td><td className="px-4 py-3 text-center">{getShiftBadge(history.previousShift)}</td><td className="px-4 py-3 text-center">{getShiftBadge(history.newShift)}</td><td className="px-4 py-3 text-center text-sm text-gray-600">{history.changeDate}</td><td className="px-4 py-3 text-center text-sm text-gray-600">{history.approvedBy}</td><td className="px-4 py-3 text-center">{getStatusBadge(history.status)}</td></tr>)}
                </tbody>
              </table>
              {historyData.length === 0 && <div className="py-12 text-center text-gray-400"><History className="mx-auto mb-2 h-10 w-10" /><p>No shift change history found.</p></div>}
            </div>
          )}
        </div>
      </Card>

      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="presentation">
          <div role="dialog" aria-modal="true" aria-labelledby="shift-request-title" className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between"><h2 id="shift-request-title" className="text-lg font-semibold text-gray-900">Request Shift Change</h2><button type="button" aria-label="Close request dialog" onClick={() => setIsRequestModalOpen(false)} className="rounded-lg p-1 hover:bg-gray-100"><X className="h-5 w-5 text-gray-500" /></button></div>
            <div className="space-y-4">
              <div><label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="request-teacher">Employee</label><select id="request-teacher" value={requestTeacherId} onChange={(event) => { const nextTeacher = mockTeachers.find((teacher) => teacher.id === event.target.value); setRequestTeacherId(event.target.value); setRequestForm((current) => ({ ...current, requestedShift: nextTeacher?.currentShift === 'Morning' ? 'Afternoon' : 'Morning' })); setRequestError(''); }} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">{mockTeachers.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.name} · {teacher.empId}</option>)}</select></div>
              <div><label className="mb-1 block text-sm font-medium text-gray-700">Current Shift</label><div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">{requestTeacher ? getShiftBadge(requestTeacher.currentShift) : '—'}</div></div>
              <div><label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="requested-shift">Requested Shift</label><select id="requested-shift" value={requestForm.requestedShift} onChange={(event) => setRequestForm((current) => ({ ...current, requestedShift: event.target.value as ShiftType }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"><option value="Morning">Morning</option><option value="Afternoon">Afternoon</option><option value="Both">Both</option></select></div>
              <div><label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="shift-request-reason">Reason <span className="text-rose-600">*</span></label><textarea id="shift-request-reason" value={requestForm.reason} onChange={(event) => setRequestForm((current) => ({ ...current, reason: event.target.value }))} placeholder="Explain why you need a shift change..." rows={3} className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              {requestError && <p role="alert" className="text-sm text-red-600">{requestError}</p>}
            </div>
            <div className="mt-6 flex justify-end gap-2"><Button variant="outline" onClick={() => setIsRequestModalOpen(false)}>Cancel</Button><Button variant="primary" onClick={handleRequestSubmit} disabled={!requestForm.reason.trim()}><Send className="mr-2 h-4 w-4" />Submit Request</Button></div>
          </div>
        </div>
      )}

      {isApprovalModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="presentation">
          <div role="dialog" aria-modal="true" aria-labelledby="shift-approval-title" className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between"><h2 id="shift-approval-title" className="text-lg font-semibold text-gray-900">{approvalAction === 'Approve' ? 'Approve' : 'Reject'} Shift Change</h2><button type="button" aria-label="Close approval dialog" onClick={() => setIsApprovalModalOpen(false)} className="rounded-lg p-1 hover:bg-gray-100"><X className="h-5 w-5 text-gray-500" /></button></div>
            <p className="mb-4 text-sm text-gray-600">Are you sure you want to <strong>{approvalAction?.toLowerCase()}</strong> the shift change request from <strong>{selectedRequest.teacherName}</strong>?</p>
            <div className="mb-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-700"><p><strong>From:</strong> {selectedRequest.currentShift} → <strong>To:</strong> {selectedRequest.requestedShift}</p><p className="mt-1"><strong>Reason:</strong> {selectedRequest.reason}</p></div>
            {approvalAction === 'Approve' && <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3"><p className="mb-1 text-xs font-semibold text-amber-800">Impact Warning</p><p className="text-xs text-amber-700">{selectedRequest.impact.unassignedClasses.join(', ')} will need reassignment.</p></div>}
            <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setIsApprovalModalOpen(false)}>Cancel</Button><Button variant={approvalAction === 'Approve' ? 'primary' : 'outline'} onClick={handleApprovalSubmit}>{approvalAction === 'Approve' ? <><CheckCircle className="mr-1 h-4 w-4" />Confirm Approval</> : <><XCircle className="mr-1 h-4 w-4" />Confirm Rejection</>}</Button></div>
          </div>
        </div>
      )}
    </div>
  );
}

export const TeacherShiftViewSwitch = ShiftViewAndSwitch;
export default ShiftViewAndSwitch;
