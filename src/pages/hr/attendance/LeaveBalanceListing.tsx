import React, { useState } from 'react';
import { Download, Search, RefreshCw, Printer, FileSpreadsheet, Eye, Edit, CheckCircle, XCircle, History } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Select } from '../../../components/ui/Select';

const leaveTypes = [
  { key: 'cl', label: 'CL', fullName: 'Casual Leave' },
  { key: 'pl', label: 'PL', fullName: 'Privilege Leave' },
  { key: 'sl', label: 'SL', fullName: 'Sick Leave' },
  { key: 'el', label: 'EL', fullName: 'Earned Leave' },
  { key: 'co', label: 'CO', fullName: 'Comp-Off' },
  { key: 'lop', label: 'LOP', fullName: 'Loss of Pay' }
];

const SEED_EMPLOYEES = [
  { id: 'EMP001', name: 'John Doe', department: 'Engineering', designation: 'Senior Developer', status: 'Active', cl: 8, pl: 12, sl: 5, el: 15, co: 3, lop: 0, total: 43, used: 14, carryForward: 5 },
  { id: 'EMP002', name: 'Jane Smith', department: 'HR', designation: 'HR Manager', status: 'Active', cl: 5, pl: 8, sl: 3, el: 10, co: 1, lop: 2, total: 27, used: 18, carryForward: 3 },
  { id: 'EMP003', name: 'Robert Johnson', department: 'Finance', designation: 'Accountant', status: 'Active', cl: 10, pl: 15, sl: 6, el: 18, co: 2, lop: 0, total: 51, used: 6, carryForward: 8 },
  { id: 'EMP004', name: 'Emily Davis', department: 'Marketing', designation: 'Marketing Lead', status: 'Active', cl: 6, pl: 10, sl: 4, el: 12, co: 4, lop: 1, total: 36, used: 12, carryForward: 4 },
  { id: 'EMP005', name: 'Michael Brown', department: 'Engineering', designation: 'Developer', status: 'Active', cl: 12, pl: 14, sl: 6, el: 20, co: 0, lop: 0, total: 52, used: 5, carryForward: 7 },
  { id: 'EMP006', name: 'Sarah Wilson', department: 'Operations', designation: 'Operations Manager', status: 'Active', cl: 4, pl: 6, sl: 2, el: 8, co: 5, lop: 3, total: 25, used: 22, carryForward: 2 },
  { id: 'EMP007', name: 'David Lee', department: 'IT Support', designation: 'IT Administrator', status: 'Active', cl: 9, pl: 11, sl: 5, el: 14, co: 2, lop: 0, total: 41, used: 10, carryForward: 6 },
  { id: 'EMP008', name: 'Lisa Anderson', department: 'Sales', designation: 'Sales Executive', status: 'Active', cl: 7, pl: 9, sl: 4, el: 11, co: 1, lop: 1, total: 32, used: 15, carryForward: 3 }
];

const SEED_LEAVES = [
  { id: 'LV001', employeeId: 'EMP001', employeeName: 'John Doe', department: 'Engineering', leaveType: 'Casual Leave', leaveTypeCode: 'CL', fromDate: '2024-02-05', toDate: '2024-02-07', duration: 3, reason: 'Family function', status: 'pending' },
  { id: 'LV002', employeeId: 'EMP002', employeeName: 'Jane Smith', department: 'HR', leaveType: 'Sick Leave', leaveTypeCode: 'SL', fromDate: '2024-02-01', toDate: '2024-02-02', duration: 2, reason: 'Medical checkup', status: 'approved' },
  { id: 'LV003', employeeId: 'EMP003', employeeName: 'Robert Johnson', department: 'Finance', leaveType: 'Privilege Leave', leaveTypeCode: 'PL', fromDate: '2024-02-15', toDate: '2024-02-20', duration: 6, reason: 'Vacation', status: 'approved' },
  { id: 'LV004', employeeId: 'EMP004', employeeName: 'Emily Davis', department: 'Marketing', leaveType: 'Casual Leave', leaveTypeCode: 'CL', fromDate: '2024-02-12', toDate: '2024-02-12', duration: 1, reason: 'Personal work', status: 'rejected' },
  { id: 'LV005', employeeId: 'EMP006', employeeName: 'Sarah Wilson', department: 'Operations', leaveType: 'Earned Leave', leaveTypeCode: 'EL', fromDate: '2024-03-01', toDate: '2024-03-05', duration: 5, reason: 'Travel', status: 'pending' }
];

const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800'
};

const downloadCsv = (filename: string, rows: (string | number)[][]) => {
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
};

export function LeaveBalanceListing() {
  const [tab, setTab] = useState<'balances' | 'history'>('balances');
  const [employees, setEmployees] = useState(SEED_EMPLOYEES);
  const [leaves, setLeaves] = useState(SEED_LEAVES);
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<typeof SEED_EMPLOYEES[0] | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editDraft, setEditDraft] = useState({ cl: 0, pl: 0, sl: 0, el: 0, co: 0 });
  const [leaveDetail, setLeaveDetail] = useState<typeof SEED_LEAVES[0] | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const filteredEmployees = employees.filter((emp) => {
    const term = search.trim().toLowerCase();
    const matchesSearch = !term || emp.name.toLowerCase().includes(term) || emp.id.toLowerCase().includes(term) || emp.department.toLowerCase().includes(term);
    const matchesDept = dept === 'all' || emp.department === dept;
    return matchesSearch && matchesDept;
  });

  const filteredLeaves = leaves.filter((row) => {
    const term = search.trim().toLowerCase();
    const matchesSearch = !term || row.employeeName.toLowerCase().includes(term) || row.employeeId.toLowerCase().includes(term) || row.leaveType.toLowerCase().includes(term);
    const matchesStatus = statusFilter === 'all' || row.status === statusFilter;
    const matchesDept = dept === 'all' || row.department === dept;
    return matchesSearch && matchesStatus && matchesDept;
  });

  const openEdit = (emp: typeof SEED_EMPLOYEES[0]) => {
    setSelected(emp);
    setEditDraft({ cl: emp.cl, pl: emp.pl, sl: emp.sl, el: emp.el, co: emp.co });
    setEditOpen(true);
  };

  const saveEdit = () => {
    if (!selected) return;
    const total = editDraft.cl + editDraft.pl + editDraft.sl + editDraft.el + editDraft.co;
    setEmployees((prev) => prev.map((emp) => emp.id === selected.id ? { ...emp, ...editDraft, total } : emp));
    setEditOpen(false);
    setNotice(`Leave balances updated for ${selected.name}.`);
  };

  const setLeaveStatus = (id: string, status: 'approved' | 'rejected') => {
    setLeaves((prev) => prev.map((row) => row.id === id ? { ...row, status } : row));
    setNotice(`Leave ${id} ${status}.`);
    setLeaveDetail(null);
  };

  const exportBalances = () => {
    downloadCsv('leave-balances.csv', [
      ['Emp ID', 'Name', 'Department', ...leaveTypes.map((t) => t.label), 'Total', 'Used', 'CF'],
      ...filteredEmployees.map((emp) => [emp.id, emp.name, emp.department, emp.cl, emp.pl, emp.sl, emp.el, emp.co, emp.lop, emp.total, emp.used, emp.carryForward])
    ]);
    setNotice('Balance report downloaded.');
  };

  const exportLeaves = () => {
    downloadCsv('leave-listing.csv', [
      ['ID', 'Employee', 'Department', 'Type', 'From', 'To', 'Days', 'Status', 'Reason'],
      ...filteredLeaves.map((row) => [row.id, row.employeeName, row.department, row.leaveType, row.fromDate, row.toDate, row.duration, row.status, row.reason])
    ]);
    setNotice('Leave listing downloaded.');
  };

  const printPage = () => {
    window.print();
    setNotice('Print dialog opened.');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Balance Listing</h1>
          <p className="text-sm text-gray-500">Company-wide leave ledger and leave application history</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setNotice('Balances refreshed.')}><RefreshCw className="w-4 h-4 mr-2" /> Refresh</Button>
          <Button variant="outline" onClick={printPage}><Printer className="w-4 h-4 mr-2" /> Print</Button>
          <Button variant="outline" onClick={tab === 'balances' ? exportBalances : exportLeaves}><FileSpreadsheet className="w-4 h-4 mr-2" /> Export Excel</Button>
          <Button onClick={tab === 'balances' ? exportBalances : exportLeaves}><Download className="w-4 h-4 mr-2" /> Download Report</Button>
        </div>
      </div>

      {notice && (
        <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice(null)}><XCircle className="w-4 h-4" /></button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200">
          {([{ id: 'balances', label: 'Leave Balances' }, { id: 'history', label: 'Leave History' }] as const).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px ${tab === item.id ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
            >
              {item.id === 'history' ? <span className="inline-flex items-center gap-1"><History className="w-4 h-4" /> {item.label}</span> : item.label}
            </button>
          ))}
        </div>

        <div className="p-4 flex flex-wrap items-center gap-3 border-b border-gray-100">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, ID, department..." className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-72" />
          </div>
          <Select
            value={dept}
            onChange={setDept}
            options={[{ value: 'all', label: 'All Departments' }, ...Array.from(new Set(employees.map((e) => e.department))).map((d) => ({ value: d, label: d }))]}
          />
          {tab === 'history' && (
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              options={[{ value: 'all', label: 'All Status' }, { value: 'pending', label: 'Pending' }, { value: 'approved', label: 'Approved' }, { value: 'rejected', label: 'Rejected' }]}
            />
          )}
        </div>

        {tab === 'balances' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Emp ID', 'Employee', 'Department', 'Status', ...leaveTypes.map((t) => t.label), 'Total', 'Used', 'CF', 'Actions'].map((h) =>
                    <th key={h} className="px-3 py-3 text-left text-xs font-semibold uppercase text-gray-500">{h}</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-medium text-blue-600">{emp.id}</td>
                    <td className="px-3 py-2">
                      <p className="font-medium text-gray-900">{emp.name}</p>
                      <p className="text-xs text-gray-500">{emp.designation}</p>
                    </td>
                    <td className="px-3 py-2 text-gray-600">{emp.department}</td>
                    <td className="px-3 py-2"><span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-green-100 text-green-700">{emp.status}</span></td>
                    <td className="px-3 py-2">{emp.cl}</td>
                    <td className="px-3 py-2">{emp.pl}</td>
                    <td className="px-3 py-2">{emp.sl}</td>
                    <td className="px-3 py-2">{emp.el}</td>
                    <td className="px-3 py-2">{emp.co}</td>
                    <td className="px-3 py-2 text-red-600">{emp.lop}</td>
                    <td className="px-3 py-2 font-semibold">{emp.total}</td>
                    <td className="px-3 py-2 text-orange-600">{emp.used}</td>
                    <td className="px-3 py-2 text-purple-600">{emp.carryForward}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-1">
                        <button type="button" className="p-1.5 hover:bg-gray-200 rounded" title="View Details" onClick={() => { setSelected(emp); setNotice(`Showing ${emp.name} — ${emp.total} days remaining.`); }}><Eye className="w-4 h-4 text-gray-500" /></button>
                        <button type="button" className="p-1.5 hover:bg-gray-200 rounded" title="Edit Balance" onClick={() => openEdit(emp)}><Edit className="w-4 h-4 text-gray-500" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredEmployees.length === 0 && <p className="p-8 text-center text-sm text-gray-500">No employees match the filters.</p>}
          </div>
        )}

        {tab === 'history' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Leave ID', 'Employee', 'Department', 'Type', 'From', 'To', 'Days', 'Reason', 'Status', 'Actions'].map((h) =>
                    <th key={h} className="px-3 py-3 text-left text-xs font-semibold uppercase text-gray-500">{h}</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLeaves.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-mono text-xs">{row.id}</td>
                    <td className="px-3 py-2"><p className="font-medium text-gray-900">{row.employeeName}</p><p className="text-xs text-gray-500">{row.employeeId}</p></td>
                    <td className="px-3 py-2 text-gray-600">{row.department}</td>
                    <td className="px-3 py-2">{row.leaveTypeCode}</td>
                    <td className="px-3 py-2">{row.fromDate}</td>
                    <td className="px-3 py-2">{row.toDate}</td>
                    <td className="px-3 py-2">{row.duration}</td>
                    <td className="px-3 py-2 text-gray-600 max-w-xs truncate">{row.reason}</td>
                    <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLE[row.status]}`}>{row.status}</span></td>
                    <td className="px-3 py-2">
                      <div className="flex gap-1">
                        <button type="button" className="p-1.5 hover:bg-gray-200 rounded" title="View" onClick={() => setLeaveDetail(row)}><Eye className="w-4 h-4 text-gray-500" /></button>
                        {row.status === 'pending' && (
                          <>
                            <button type="button" className="p-1.5 hover:bg-green-100 rounded text-green-700" title="Approve" onClick={() => setLeaveStatus(row.id, 'approved')}><CheckCircle className="w-4 h-4" /></button>
                            <button type="button" className="p-1.5 hover:bg-red-100 rounded text-red-700" title="Reject" onClick={() => setLeaveStatus(row.id, 'rejected')}><XCircle className="w-4 h-4" /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredLeaves.length === 0 && <p className="p-8 text-center text-sm text-gray-500">No leave applications match the filters.</p>}
          </div>
        )}
      </div>

      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title={selected ? `Edit balances — ${selected.name}` : 'Edit balances'}>
        <div className="grid grid-cols-2 gap-3">
          {(['cl', 'pl', 'sl', 'el', 'co'] as const).map((key) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{key.toUpperCase()}</label>
              <input type="number" min={0} value={editDraft[key]} onChange={(e) => setEditDraft((d) => ({ ...d, [key]: Number(e.target.value) || 0 }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={saveEdit}>Save</Button>
        </div>
      </Modal>

      <Modal isOpen={!!leaveDetail} onClose={() => setLeaveDetail(null)} title={leaveDetail ? leaveDetail.id : 'Leave'}>
        {leaveDetail && (
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-500">Employee:</span> {leaveDetail.employeeName} ({leaveDetail.employeeId})</p>
            <p><span className="text-gray-500">Type:</span> {leaveDetail.leaveType}</p>
            <p><span className="text-gray-500">Period:</span> {leaveDetail.fromDate} → {leaveDetail.toDate} ({leaveDetail.duration} days)</p>
            <p><span className="text-gray-500">Reason:</span> {leaveDetail.reason}</p>
            <p><span className="text-gray-500">Status:</span> {leaveDetail.status}</p>
            {leaveDetail.status === 'pending' && (
              <div className="flex justify-end gap-2 pt-3">
                <Button variant="outline" onClick={() => setLeaveStatus(leaveDetail.id, 'rejected')}>Reject</Button>
                <Button onClick={() => setLeaveStatus(leaveDetail.id, 'approved')}>Approve</Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default LeaveBalanceListing;
