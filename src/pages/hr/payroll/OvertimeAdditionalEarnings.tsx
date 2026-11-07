import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Download, Search } from 'lucide-react';

const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

type StaffCategory = 'Teaching Staff' | 'Support Staff' | 'Administrative';

type Staff = {
  id: string;
  name: string;
  department: string;
  designation: string;
  category: StaffCategory;
  basic: number;
};

type OtStatus = 'Pending' | 'Approved' | 'Rejected';

type OvertimeWork = {
  id: string;
  employeeId: string;
  date: string;
  activity: string;
  from: string;
  to: string;
  hours: number;
  status: OtStatus;
};

const STAFF: Staff[] = [
  { id: 'EMP-1001', name: 'Rajesh Kumar', department: 'Science', designation: 'PGT Physics', category: 'Teaching Staff', basic: 50000 },
  { id: 'EMP-1008', name: 'Anil Patel', department: 'Administration', designation: 'Clerk', category: 'Administrative', basic: 28000 },
  { id: 'EMP-1022', name: 'Sunil Yadav', department: 'Sports', designation: 'Coach', category: 'Support Staff', basic: 32000 },
  { id: 'EMP-1042', name: 'Meera Iyer', department: 'Science', designation: 'PGT Physics', category: 'Teaching Staff', basic: 48000 },
  { id: 'EMP-1101', name: 'Kavita Shah', department: 'Administration', designation: 'Office Superintendent', category: 'Administrative', basic: 36000 }
];

const MULTIPLIER: Record<StaffCategory, number> = {
  'Teaching Staff': 1.5,
  'Support Staff': 2,
  Administrative: 1.5
};

const WORK: OvertimeWork[] = [
  { id: 'OT-241', employeeId: 'EMP-1001', date: '2026-10-08', activity: 'Exam Supervision', from: '17:00', to: '20:00', hours: 3, status: 'Approved' },
  { id: 'OT-242', employeeId: 'EMP-1001', date: '2026-10-15', activity: 'Board Exam Season', from: '16:30', to: '20:30', hours: 4, status: 'Pending' },
  { id: 'OT-243', employeeId: 'EMP-1008', date: '2026-10-10', activity: 'Evening Duty', from: '18:00', to: '21:00', hours: 3, status: 'Pending' },
  { id: 'OT-244', employeeId: 'EMP-1022', date: '2026-10-12', activity: 'Sports Coaching', from: '06:00', to: '08:00', hours: 2, status: 'Approved' },
  { id: 'OT-245', employeeId: 'EMP-1022', date: '2026-10-19', activity: 'Sports Coaching', from: '16:00', to: '19:00', hours: 3, status: 'Pending' },
  { id: 'OT-246', employeeId: 'EMP-1042', date: '2026-10-22', activity: 'Exam Supervision', from: '17:00', to: '21:00', hours: 4, status: 'Approved' },
  { id: 'OT-247', employeeId: 'EMP-1101', date: '2026-10-28', activity: 'Evening Duty', from: '17:30', to: '20:30', hours: 3, status: 'Rejected' }
];

const hourlyRate = (staff: Staff) => Math.round(staff.basic / 26 / 8 * MULTIPLIER[staff.category]);

export function OvertimeAdditionalEarnings() {
  const [view, setView] = useState<'pay' | 'slip'>('pay');
  const [month, setMonth] = useState('2026-10');
  const [department, setDepartment] = useState('');
  const [search, setSearch] = useState('');
  const [work, setWork] = useState<OvertimeWork[]>(WORK);
  const [notice, setNotice] = useState('');

  const setStatus = (id: string, status: OtStatus) => {
    setWork((prev) => prev.map((row) => row.id === id ? { ...row, status } : row));
    setNotice(status === 'Approved' ? 'Overtime approved for payroll.' : status === 'Rejected' ? 'Overtime rejected.' : '');
  };

  const monthWork = useMemo(
    () => work.filter((row) => row.date.startsWith(month)),
    [month, work]
  );

  const staffRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return STAFF.map((staff) => {
      const sessions = monthWork.filter((row) => row.employeeId === staff.id);
      const approved = sessions.filter((row) => row.status === 'Approved');
      const pending = sessions.filter((row) => row.status === 'Pending');
      const hours = approved.reduce((sum, row) => sum + row.hours, 0);
      const rate = hourlyRate(staff);
      return { staff, hours, rate, amount: Math.round(hours * rate), sessions: sessions.length, pendingIds: pending.map((row) => row.id), pendingHours: pending.reduce((sum, row) => sum + row.hours, 0) };
    }).filter((row) => {
      if (!row.sessions) return false;
      if (department && row.staff.department !== department) return false;
      if (q && !`${row.staff.name} ${row.staff.id} ${row.staff.designation}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [monthWork, department, search]);

  const slipRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return monthWork.flatMap((row) => {
      const staff = STAFF.find((s) => s.id === row.employeeId);
      if (!staff) return [];
      if (department && staff.department !== department) return [];
      if (q && !`${staff.name} ${staff.id} ${row.activity}`.toLowerCase().includes(q)) return [];
      const rate = hourlyRate(staff);
      return [{ ...row, staff, rate, amount: Math.round(row.hours * rate) }];
    });
  }, [monthWork, department, search]);

  const totalPay = staffRows.reduce((sum, row) => sum + row.amount, 0);
  const totalHours = staffRows.reduce((sum, row) => sum + row.hours, 0);
  const departments = Array.from(new Set(STAFF.map((s) => s.department)));

  const downloadCsv = () => {
    const header = view === 'pay'
      ? ['Employee ID', 'Name', 'Department', 'OT Hours', 'Rate', 'Amount to add']
      : ['OT ID', 'Date', 'Employee', 'Activity', 'From', 'To', 'Hours', 'Amount'];
    const body = view === 'pay'
      ? staffRows.map((row) => [row.staff.id, row.staff.name, row.staff.department, row.hours, row.rate, row.amount])
      : slipRows.map((row) => [row.id, row.date, row.staff.name, row.activity, row.from, row.to, row.hours, row.amount]);
    const csv = [header, ...body].map((line) => line.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `overtime-${view}-${month}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Overtime Earnings</h1>
          <p className="mt-1 text-sm text-gray-500">Approved overtime from attendance requests, with the amount to add in payroll</p>
        </div>
        <Button variant="outline" onClick={downloadCsv}><Download className="w-4 h-4 mr-1" />Export</Button>
      </div>
      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}

      <div className="inline-flex rounded-full border border-gray-200 bg-gray-100 p-1">
        {([{ id: 'pay', label: 'Staff Overtime Pay' }, { id: 'slip', label: 'Overtime Slip' }] as const).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setView(item.id)}
            className={`rounded-full px-5 py-2 text-sm font-semibold ${view === item.id ? 'bg-indigo-600 text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}>
            {item.label}
          </button>
        ))}
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Input type="month" label="Month" value={month} onChange={(e) => setMonth(e.target.value)} />
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Department</label>
            <select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
              <option value="">All departments</option>
              {departments.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <Input
              label="Search"
              placeholder="Employee, ID or activity"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-gray-400" />} />
          </div>
        </div>
      </Card>

      {view === 'pay' &&
      <Card noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <tr>
                  {['Employee', 'Department', 'Designation', 'OT hours', 'Hourly rate', 'Amount to add', 'Approval'].map((h) =>
                    <th key={h} className="px-4 py-3">{h}</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {staffRows.map((row) =>
                  <tr key={row.staff.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{row.staff.name}</p>
                      <p className="text-xs text-gray-500">{row.staff.id} · {row.sessions} session{row.sessions === 1 ? '' : 's'}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{row.staff.department}</td>
                    <td className="px-4 py-3 text-gray-700">{row.staff.designation}</td>
                    <td className="px-4 py-3 font-medium">{row.hours}</td>
                    <td className="px-4 py-3">{inr(row.rate)}</td>
                    <td className="px-4 py-3 font-semibold text-indigo-700">{inr(row.amount)}</td>
                    <td className="px-4 py-3">
                      {row.pendingIds.length > 0 ?
                      <div className="flex flex-wrap gap-1">
                          <Button size="xs" onClick={() => row.pendingIds.forEach((id) => setStatus(id, 'Approved'))}>Approve ({row.pendingHours}h)</Button>
                          <Button size="xs" variant="ghost" onClick={() => row.pendingIds.forEach((id) => setStatus(id, 'Rejected'))}>Reject</Button>
                        </div> :
                      <span className="text-xs text-gray-400">No pending</span>}
                    </td>
                  </tr>
                )}
                {staffRows.length === 0 &&
                <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-500">No overtime for this month</td></tr>
                }
              </tbody>
              {staffRows.length > 0 &&
              <tfoot>
                  <tr className="border-t bg-indigo-50 text-sm font-semibold">
                    <td className="px-4 py-3" colSpan={3}>Total to add in payroll</td>
                    <td className="px-4 py-3">{totalHours} hrs</td>
                    <td />
                    <td className="px-4 py-3 text-indigo-800">{inr(totalPay)}</td>
                    <td />
                  </tr>
                </tfoot>
              }
            </table>
          </div>
        </Card>
      }

      {view === 'slip' &&
      <Card noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <tr>
                  {['Date', 'Employee', 'Work done', 'From', 'To', 'Hours', 'Rate', 'Amount', 'Status', 'Approval'].map((h) =>
                    <th key={h} className="px-4 py-3">{h}</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {slipRows.map((row) =>
                  <tr key={row.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">{row.date}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{row.staff.name}</p>
                      <p className="text-xs text-gray-500">{row.staff.id}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{row.activity}</td>
                    <td className="px-4 py-3">{row.from}</td>
                    <td className="px-4 py-3">{row.to}</td>
                    <td className="px-4 py-3 font-medium">{row.hours}</td>
                    <td className="px-4 py-3">{inr(row.rate)}</td>
                    <td className="px-4 py-3 font-semibold text-indigo-700">{inr(row.amount)}</td>
                    <td className="px-4 py-3"><Badge variant={row.status === 'Approved' ? 'success' : row.status === 'Rejected' ? 'danger' : 'warning'}>{row.status}</Badge></td>
                    <td className="px-4 py-3">
                      {row.status === 'Pending' ?
                      <div className="flex gap-1">
                          <Button size="xs" onClick={() => setStatus(row.id, 'Approved')}>Approve</Button>
                          <Button size="xs" variant="ghost" onClick={() => setStatus(row.id, 'Rejected')}>Reject</Button>
                        </div> :
                      <span className="text-xs text-gray-400">—</span>}
                    </td>
                  </tr>
                )}
                {slipRows.length === 0 &&
                <tr><td colSpan={10} className="px-4 py-10 text-center text-gray-500">No overtime work recorded for this month</td></tr>
                }
              </tbody>
            </table>
          </div>
        </Card>
      }
    </div>
  );
}
