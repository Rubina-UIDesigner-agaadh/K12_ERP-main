import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Textarea } from '../../../components/ui/Textarea';
import { Modal } from '../../../components/ui/Modal';
import { Plus, RefreshCw, Search, Trash2, Upload } from 'lucide-react';

const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

type Section = 'timesheet' | 'slip' | 'additional';
type TsStatus = 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
type TimeLog = {
  id: string;
  activity: string;
  from: string;
  to: string;
  hours: number;
  isOvertime: boolean;
  rate: number;
  amount: number;
  expectedHours: number;
  project: string;
};
type Timesheet = {
  id: string;
  employeeId: string;
  employee: string;
  department: string;
  designation: string;
  shift: string;
  company: string;
  startDate: string;
  endDate: string;
  status: TsStatus;
  category: 'Teaching Staff' | 'Support Staff' | 'Administrative' | 'Management';
  logs: TimeLog[];
  approver: string;
};
type OtRow = {
  employeeId: string;
  employee: string;
  category: Timesheet['category'];
  hours: number;
  rate: number;
  amount: number;
  approved: boolean;
  remarks: string;
};
type Additional = {
  id: string;
  employeeId: string;
  employee: string;
  component: string;
  type: 'Earning' | 'Deduction';
  amount: number;
  payrollDate: string;
  recurring: boolean;
  fromDate: string;
  toDate: string;
  frequency: string;
  overwrite: boolean;
  notes: string;
  status: 'Pending' | 'Processed';
};

const EMPLOYEES = [
  { id: 'EMP-1001', name: 'Rajesh Kumar', department: 'Science', designation: 'PGT Physics', shift: 'General', category: 'Teaching Staff' as const, basic: 50000 },
  { id: 'EMP-1008', name: 'Anil Patel', department: 'Administration', designation: 'Clerk', shift: 'General', category: 'Administrative' as const, basic: 28000 },
  { id: 'EMP-1022', name: 'Sunil Yadav', department: 'Sports', designation: 'Coach', shift: 'Morning', category: 'Support Staff' as const, basic: 32000 },
  { id: 'EMP-1030', name: 'Board Secretary', department: 'Management', designation: 'Vice Principal', shift: 'General', category: 'Management' as const, basic: 90000 }
];

const ACTIVITIES = ['Evening Duty', 'Exam Supervision', 'Sports Coaching', 'Board Exam Season', 'Boarding Night Duty'];
const ADDITIONAL_COMPONENTS = [
  { value: 'Overtime Pay', type: 'Earning' as const },
  { value: 'Annual Performance Bonus', type: 'Earning' as const },
  { value: 'Festival Advance', type: 'Earning' as const },
  { value: 'Examination Duty Remuneration', type: 'Earning' as const },
  { value: 'Special Duty Allowance', type: 'Earning' as const },
  { value: 'House Building Advance Recovery', type: 'Deduction' as const },
  { value: 'Arrears from Pay Revision', type: 'Earning' as const }
];

const MULTIPLIER: Record<Timesheet['category'], number | null> = {
  'Teaching Staff': 1.5,
  'Support Staff': 2.0,
  Administrative: 1.5,
  Management: null
};

const hoursBetween = (from: string, to: string) => {
  const a = new Date(from).getTime();
  const b = new Date(to).getTime();
  if (!a || !b || b <= a) return 0;
  return Math.round((b - a) / 36e5 * 100) / 100;
};

const otRate = (category: Timesheet['category'], basic: number) => {
  const mult = MULTIPLIER[category];
  if (!mult) return 0;
  return Math.round(basic / 26 / 8 * mult);
};

const seedSheets = (): Timesheet[] => [
  {
    id: 'TS-2026-10-001',
    employeeId: 'EMP-1001',
    employee: 'Rajesh Kumar',
    department: 'Science',
    designation: 'PGT Physics',
    shift: 'General',
    company: 'EduManager School',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    status: 'Submitted',
    category: 'Teaching Staff',
    approver: 'Principal',
    logs: [
      { id: 'L1', activity: 'Exam Supervision', from: '2026-10-28T17:00', to: '2026-10-28T21:00', hours: 4, isOvertime: true, rate: 361, amount: 1444, expectedHours: 8, project: 'Board Exams' },
      { id: 'L2', activity: 'Evening Duty', from: '2026-10-29T17:00', to: '2026-10-29T21:00', hours: 4, isOvertime: true, rate: 361, amount: 1444, expectedHours: 8, project: '' }
    ]
  },
  {
    id: 'TS-2026-10-002',
    employeeId: 'EMP-1022',
    employee: 'Sunil Yadav',
    department: 'Sports',
    designation: 'Coach',
    shift: 'Morning',
    company: 'EduManager School',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    status: 'Approved',
    category: 'Support Staff',
    approver: 'HR Manager',
    logs: [
      { id: 'L3', activity: 'Sports Coaching', from: '2026-10-18T16:00', to: '2026-10-18T20:00', hours: 4, isOvertime: true, rate: 308, amount: 1232, expectedHours: 8, project: 'Inter-school tournament' }
    ]
  },
  {
    id: 'TS-2026-10-003',
    employeeId: 'EMP-1008',
    employee: 'Anil Patel',
    department: 'Administration',
    designation: 'Clerk',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    shift: 'General',
    company: 'EduManager School',
    status: 'Draft',
    category: 'Administrative',
    approver: 'HR Manager',
    logs: [
      { id: 'L4', activity: 'Board Exam Season', from: '2026-10-20T17:00', to: '2026-10-20T20:00', hours: 3, isOvertime: true, rate: 202, amount: 606, expectedHours: 8, project: '' }
    ]
  }
];

const emptyLog = (): TimeLog => ({
  id: `L-${Date.now()}`,
  activity: 'Evening Duty',
  from: '2026-10-31T17:00',
  to: '2026-10-31T20:00',
  hours: 3,
  isOvertime: true,
  rate: 361,
  amount: 1083,
  expectedHours: 8,
  project: ''
});

export function OvertimeAdditionalEarnings() {
  const [section, setSection] = useState<Section>('timesheet');
  const [notice, setNotice] = useState('');
  const [sheets, setSheets] = useState<Timesheet[]>(seedSheets);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editing, setEditing] = useState<Timesheet | null>(null);
  const [entryName] = useState('OT-ENTRY-10-2026-001');
  const [period, setPeriod] = useState('2026-10');
  const [otRows, setOtRows] = useState<OtRow[]>([]);
  const [additionals, setAdditionals] = useState<Additional[]>([
    { id: 'AS-001', employeeId: 'EMP-1001', employee: 'Rajesh Kumar', component: 'Examination Duty Remuneration', type: 'Earning', amount: 2000, payrollDate: '2026-10-31', recurring: false, fromDate: '', toDate: '', frequency: 'Monthly', overwrite: false, notes: 'Board exam coordination duty — October 2026.', status: 'Pending' },
    { id: 'AS-002', employeeId: 'EMP-1008', employee: 'Anil Patel', component: 'House Building Advance Recovery', type: 'Deduction', amount: 5000, payrollDate: '2026-10-31', recurring: true, fromDate: '2026-04-01', toDate: '2027-03-31', frequency: 'Monthly', overwrite: false, notes: '₹5,000/month for 12 months', status: 'Pending' }
  ]);
  const [addForm, setAddForm] = useState<Additional | null>(null);
  const [monthFilter, setMonthFilter] = useState('2026-10');
  const [statusList, setStatusList] = useState('');
  const [confirmSubmit, setConfirmSubmit] = useState(false);

  const flash = (text: string) => {
    setNotice(text);
    window.setTimeout(() => setNotice(''), 4000);
  };

  const filteredSheets = sheets.filter((row) => {
    if (statusFilter && row.status !== statusFilter) return false;
    const q = search.trim().toLowerCase();
    if (q && !`${row.employee} ${row.employeeId} ${row.id}`.toLowerCase().includes(q)) return false;
    return true;
  });

  const otHours = (sheet: Timesheet) => sheet.logs.filter((l) => l.isOvertime).reduce((s, l) => s + l.hours, 0);
  const otAmount = (sheet: Timesheet) => sheet.logs.filter((l) => l.isOvertime).reduce((s, l) => s + l.amount, 0);

  const openNewSheet = () => {
    const emp = EMPLOYEES[0];
    setEditing({
      id: `TS-2026-10-${String(sheets.length + 1).padStart(3, '0')}`,
      employeeId: emp.id,
      employee: emp.name,
      department: emp.department,
      designation: emp.designation,
      shift: emp.shift,
      company: 'EduManager School',
      startDate: '2026-10-01',
      endDate: '2026-10-31',
      status: 'Draft',
      category: emp.category,
      approver: emp.category === 'Teaching Staff' ? 'Principal / Vice Principal' : 'HR Manager',
      logs: [emptyLog()]
    });
  };

  const applyEmployee = (sheet: Timesheet, id: string) => {
    const emp = EMPLOYEES.find((e) => e.id === id);
    if (!emp) return sheet;
    const rate = otRate(emp.category, emp.basic);
    return {
      ...sheet,
      employeeId: emp.id,
      employee: emp.name,
      department: emp.department,
      designation: emp.designation,
      shift: emp.shift,
      category: emp.category,
      approver: emp.category === 'Teaching Staff' ? 'Principal / Vice Principal' : 'HR Manager',
      logs: sheet.logs.map((log) => ({ ...log, rate, amount: Math.round(log.hours * rate) }))
    };
  };

  const patchLog = (index: number, patch: Partial<TimeLog>) => {
    if (!editing) return;
    const logs = editing.logs.map((log, i) => {
      if (i !== index) return log;
      const next = { ...log, ...patch };
      next.hours = hoursBetween(next.from, next.to);
      next.amount = Math.round(next.hours * next.rate);
      return next;
    });
    setEditing({ ...editing, logs });
  };

  const saveSheet = (submit: boolean) => {
    if (!editing) return;
    if (editing.category === 'Management') {
      flash('Management staff are all-inclusive. Overtime is not applicable.');
      return;
    }
    const next = { ...editing, status: submit ? 'Submitted' as const : editing.status };
    setSheets((prev) => {
      const exists = prev.some((s) => s.id === next.id);
      return exists ? prev.map((s) => (s.id === next.id ? next : s)) : [next, ...prev];
    });
    setEditing(null);
    flash(submit ? 'Timesheet submitted. Teaching staff need Principal / Vice Principal approval.' : 'Timesheet saved as draft.');
  };

  const getTimesheets = () => {
    const rows: OtRow[] = sheets
      .filter((s) => s.status === 'Submitted' || s.status === 'Approved')
      .map((s) => {
        const emp = EMPLOYEES.find((e) => e.id === s.employeeId);
        const hours = otHours(s);
        const rate = emp ? otRate(s.category, emp.basic) : 0;
        return {
          employeeId: s.employeeId,
          employee: s.employee,
          category: s.category,
          hours,
          rate,
          amount: Math.round(hours * rate),
          approved: s.status === 'Approved',
          remarks: s.logs[0]?.activity ? `Approved — ${s.logs[0].activity}` : ''
        };
      });
    setOtRows(rows);
    flash(`Fetched ${rows.length} employee overtime row(s) from submitted timesheets with Is Overtime marked.`);
  };

  const submitOtEntry = () => {
    const approved = otRows.filter((r) => r.approved && r.category !== 'Management');
    if (!approved.length) {
      flash('Approve at least one employee before submitting the overtime entry.');
      return;
    }
    const created: Additional[] = approved.map((r, i) => ({
      id: `AS-OT-${Date.now()}-${i}`,
      employeeId: r.employeeId,
      employee: r.employee,
      component: 'Overtime Pay',
      type: 'Earning',
      amount: r.amount,
      payrollDate: `${period}-31`,
      recurring: false,
      fromDate: '',
      toDate: '',
      frequency: 'Monthly',
      overwrite: false,
      notes: r.remarks || `OT ${r.hours} hrs × ${inr(r.rate)}`,
      status: 'Pending'
    }));
    setAdditionals((prev) => [...created, ...prev]);
    setConfirmSubmit(false);
    setSection('additional');
    flash(`Overtime entry submitted. ${created.length} Additional Salary record(s) created for Payroll Entry.`);
  };

  const filteredAdds = additionals.filter((row) => {
    if (statusList && row.status !== statusList) return false;
    if (monthFilter && !row.payrollDate.startsWith(monthFilter)) return false;
    return true;
  });

  const saveAdditional = () => {
    if (!addForm) return;
    if (!addForm.employeeId || !addForm.component || !addForm.amount) {
      flash('Employee, salary component and amount are required.');
      return;
    }
    setAdditionals((prev) => {
      const exists = prev.some((a) => a.id === addForm.id);
      return exists ? prev.map((a) => (a.id === addForm.id ? addForm : a)) : [addForm, ...prev];
    });
    setAddForm(null);
    flash('Additional salary saved. Payroll Entry will pick this up for the payroll date.');
  };

  const sections: { id: Section; label: string }[] = [
    { id: 'timesheet', label: 'Timesheet' },
    { id: 'slip', label: 'Overtime Slip' },
    { id: 'additional', label: 'Additional Salary' }
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Overtime & Additional Earnings</h1>
        <p className="text-sm text-gray-500">Timesheet (Is Overtime) → Overtime Slip → Additional Salary → Payroll Entry → Salary Slip. Teaching overtime is approved by Principal / Vice Principal.</p>
      </div>

      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}

      <div className="flex gap-1 border-b border-gray-200 bg-white">
        {sections.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSection(item.id)}
            className={`whitespace-nowrap px-4 py-2.5 text-sm font-medium border-b-2 ${section === item.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>
            {item.label}
          </button>
        ))}
      </div>

      {section === 'timesheet' && (
        <>
          <Card>
            <div className="flex flex-wrap items-end gap-3 p-4">
              <div className="relative min-w-[220px] flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Employee, ID, timesheet" className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm" />
              </div>
              <Select label="Status" value={statusFilter} onChange={(e) => setStatusFilter(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All' }, { value: 'Draft', label: 'Draft' }, { value: 'Submitted', label: 'Submitted' }, { value: 'Approved', label: 'Approved' }, { value: 'Rejected', label: 'Rejected' }]} />
              <Button size="sm" onClick={openNewSheet}><Plus className="mr-1 h-4 w-4" />New Timesheet</Button>
            </div>
          </Card>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
                    {['Timesheet', 'Employee', 'Period', 'OT hours', 'OT amount', 'Approver', 'Status', ''].map((h) => <th key={h || 'a'} className="px-3 py-2">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {filteredSheets.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-3 py-2 font-mono text-xs">{row.id}</td>
                      <td className="px-3 py-2"><p className="font-medium">{row.employee}</p><p className="text-xs text-gray-500">{row.employeeId} · {row.category}</p></td>
                      <td className="px-3 py-2 text-xs">{row.startDate} — {row.endDate}</td>
                      <td className="px-3 py-2">{otHours(row)}</td>
                      <td className="px-3 py-2">{inr(otAmount(row))}</td>
                      <td className="px-3 py-2 text-xs">{row.approver}</td>
                      <td className="px-3 py-2"><Badge variant={row.status === 'Approved' ? 'success' : row.status === 'Rejected' ? 'danger' : row.status === 'Submitted' ? 'info' : 'warning'}>{row.status}</Badge></td>
                      <td className="px-3 py-2">
                        <div className="flex gap-1">
                          <Button size="xs" variant="ghost" onClick={() => setEditing(row)}>Open</Button>
                          {row.status === 'Submitted' && (
                            <>
                              <Button size="xs" variant="outline" onClick={() => { setSheets((p) => p.map((s) => s.id === row.id ? { ...s, status: 'Approved' } : s)); flash('Timesheet approved.'); }}>Approve</Button>
                              <Button size="xs" variant="ghost" onClick={() => { setSheets((p) => p.map((s) => s.id === row.id ? { ...s, status: 'Rejected' } : s)); flash('Timesheet rejected.'); }}>Reject</Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {section === 'slip' && (
        <>
          <Card title="Overtime Entry">
            <div className="grid gap-4 p-5 md:grid-cols-4">
              <Input label="Overtime Entry Name" value={entryName} readOnly />
              <Input label="Company" value="EduManager School" readOnly />
              <Input label="Payroll Period" type="month" value={period} onChange={(e) => setPeriod(e.target.value)} />
              <Input label="Window" value="01 Oct 2026 — 31 Oct 2026" readOnly />
            </div>
            <div className="flex flex-wrap gap-2 border-t px-5 py-3">
              <Button size="sm" onClick={getTimesheets}><RefreshCw className="mr-1 h-4 w-4" />Get Timesheets</Button>
              <Button size="sm" variant="outline" onClick={() => setOtRows((p) => p.map((r) => r.category === 'Management' ? r : { ...r, approved: true }))}>Approve All</Button>
              <Button size="sm" onClick={() => setConfirmSubmit(true)}>Submit Overtime Entry</Button>
            </div>
          </Card>
          <Card title="Employee Overtime">
            <p className="px-5 pt-3 text-xs text-gray-500">Rate = (Basic / 26 working days / 8 hours) × multiplier. Teaching 1.5× · Support 2.0× · Administrative 1.5× · Management not applicable.</p>
            <div className="overflow-x-auto p-5 pt-3">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
                    {['Employee', 'Category', 'OT hours', 'Rate / hour', 'OT amount', 'Approved', 'Remarks'].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {otRows.map((row) => (
                    <tr key={row.employeeId} className="border-b border-gray-100">
                      <td className="px-3 py-2"><p className="font-medium">{row.employee}</p><p className="text-xs text-gray-500">{row.employeeId}</p></td>
                      <td className="px-3 py-2">{row.category}</td>
                      <td className="px-3 py-2">{row.hours}</td>
                      <td className="px-3 py-2">{row.rate ? inr(row.rate) : 'N/A'}</td>
                      <td className="px-3 py-2 font-semibold">{row.rate ? inr(row.amount) : '—'}</td>
                      <td className="px-3 py-2">
                        <input type="checkbox" checked={row.approved} disabled={row.category === 'Management'} onChange={(e) => setOtRows((p) => p.map((r) => r.employeeId === row.employeeId ? { ...r, approved: e.target.checked } : r))} />
                      </td>
                      <td className="px-3 py-2">
                        <input className="w-full rounded border px-2 py-1 text-xs" value={row.remarks} onChange={(e) => setOtRows((p) => p.map((r) => r.employeeId === row.employeeId ? { ...r, remarks: e.target.value } : r))} />
                      </td>
                    </tr>
                  ))}
                  {otRows.length === 0 && <tr><td colSpan={7} className="px-3 py-8 text-center text-gray-500">Click Get Timesheets to load submitted OT rows for this period.</td></tr>}
                </tbody>
              </table>
            </div>
          </Card>
          <Card>
            <div className="space-y-2 p-5 text-sm text-gray-600">
              <p className="font-semibold text-gray-900">Salary slip flow</p>
              <p>Timesheet (Is OT rows) → Overtime Entry (Approved) → Additional Salary (OT component) → Payroll Entry → Salary Slip earnings → Journal Entry to OT Expense Account.</p>
              <p>Salary component: Overtime Pay (OT), Earning, additional component, taxable, formula (basic / total_working_days / 8) * ot_hours * 1.5, does not depend on LWP.</p>
            </div>
          </Card>
        </>
      )}

      {section === 'additional' && (
        <>
          <Card>
            <div className="flex flex-wrap items-end gap-3 p-4">
              <Input label="Month" type="month" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} />
              <Select label="Status" value={statusList} onChange={(e) => setStatusList(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All' }, { value: 'Pending', label: 'Pending' }, { value: 'Processed', label: 'Processed' }]} />
              <Button size="sm" variant="outline" onClick={() => flash('CSV imported for exam duty allowance.')}><Upload className="mr-1 h-4 w-4" />Bulk Create CSV</Button>
              <Button size="sm" onClick={() => setAddForm({ id: `AS-${Date.now()}`, employeeId: '', employee: '', component: 'Overtime Pay', type: 'Earning', amount: 0, payrollDate: '2026-10-31', recurring: false, fromDate: '', toDate: '', frequency: 'Monthly', overwrite: false, notes: '', status: 'Pending' })}><Plus className="mr-1 h-4 w-4" />New Additional Salary</Button>
            </div>
          </Card>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
                    {['Employee', 'Component', 'Type', 'Amount', 'Payroll date', 'Recurring', 'Status', ''].map((h) => <th key={h || 'a'} className="px-3 py-2">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {filteredAdds.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-3 py-2"><p className="font-medium">{row.employee}</p><p className="text-xs text-gray-500">{row.employeeId}</p></td>
                      <td className="px-3 py-2">{row.component}{row.overwrite && <span className="ml-1 text-xs text-amber-700">overwrite</span>}</td>
                      <td className="px-3 py-2"><Badge variant={row.type === 'Earning' ? 'success' : 'danger'}>{row.type}</Badge></td>
                      <td className="px-3 py-2 font-semibold">{inr(row.amount)}</td>
                      <td className="px-3 py-2 text-xs">{row.payrollDate}</td>
                      <td className="px-3 py-2 text-xs">{row.recurring ? `${row.frequency} ${row.fromDate}–${row.toDate}` : 'No'}</td>
                      <td className="px-3 py-2"><Badge variant={row.status === 'Processed' ? 'success' : 'warning'}>{row.status}</Badge></td>
                      <td className="px-3 py-2"><Button size="xs" variant="ghost" onClick={() => setAddForm(row)}>Open</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      <Modal isOpen={Boolean(editing)} onClose={() => setEditing(null)} title={editing ? `Timesheet ${editing.id}` : 'Timesheet'} size="xl" footer={editing && (
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setEditing(null)}>Close</Button>
          <Button variant="outline" onClick={() => saveSheet(false)}>Save Draft</Button>
          <Button onClick={() => saveSheet(true)}>Submit</Button>
        </div>
      )}>
        {editing && (
          <div className="space-y-4 text-sm">
            <div className="grid gap-3 md:grid-cols-3">
              <Select label="Employee *" value={editing.employeeId} onChange={(e) => setEditing(applyEmployee(editing, typeof e === 'string' ? e : e.target.value))} options={EMPLOYEES.map((e) => ({ value: e.id, label: `${e.name} (${e.id})` }))} />
              <Input label="Company" value={editing.company} readOnly />
              <Input label="Department / Shift" value={`${editing.department} · ${editing.shift}`} readOnly />
              <Input label="Start Date" type="date" value={editing.startDate} onChange={(e) => setEditing({ ...editing, startDate: e.target.value })} />
              <Input label="End Date" type="date" value={editing.endDate} onChange={(e) => setEditing({ ...editing, endDate: e.target.value })} />
              <Input label="Approver" value={editing.approver} readOnly />
            </div>
            {editing.category === 'Management' && <p className="rounded-lg bg-amber-50 px-3 py-2 text-amber-800">Management salaries are all-inclusive. Overtime is not applicable.</p>}
            <div className="flex items-center justify-between">
              <p className="font-semibold">Time Logs</p>
              <Button size="xs" variant="outline" onClick={() => setEditing({ ...editing, logs: [...editing.logs, emptyLog()] })}><Plus className="h-3.5 w-3.5" />Add row</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b bg-gray-50 text-left uppercase text-gray-500">
                    {['Activity', 'From', 'To', 'Hours', 'Is OT', 'Rate', 'Amount', 'Expected hrs', 'Project', ''].map((h) => <th key={h || 'x'} className="px-2 py-2">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {editing.logs.map((log, i) => (
                    <tr key={log.id} className="border-b">
                      <td className="px-2 py-1">
                        <select className="rounded border px-1 py-1" value={log.activity} onChange={(e) => patchLog(i, { activity: e.target.value })}>
                          {ACTIVITIES.map((a) => <option key={a}>{a}</option>)}
                        </select>
                      </td>
                      <td className="px-2 py-1"><input type="datetime-local" className="rounded border px-1 py-1" value={log.from} onChange={(e) => patchLog(i, { from: e.target.value })} /></td>
                      <td className="px-2 py-1"><input type="datetime-local" className="rounded border px-1 py-1" value={log.to} onChange={(e) => patchLog(i, { to: e.target.value })} /></td>
                      <td className="px-2 py-1">{log.hours}</td>
                      <td className="px-2 py-1 text-center"><input type="checkbox" checked={log.isOvertime} onChange={(e) => patchLog(i, { isOvertime: e.target.checked })} /></td>
                      <td className="px-2 py-1"><input type="number" className="w-20 rounded border px-1 py-1" value={log.rate} onChange={(e) => patchLog(i, { rate: Number(e.target.value) })} /></td>
                      <td className="px-2 py-1">{inr(log.amount)}</td>
                      <td className="px-2 py-1"><input type="number" className="w-16 rounded border px-1 py-1" value={log.expectedHours} onChange={(e) => patchLog(i, { expectedHours: Number(e.target.value) })} /></td>
                      <td className="px-2 py-1"><input className="w-28 rounded border px-1 py-1" value={log.project} onChange={(e) => patchLog(i, { project: e.target.value })} /></td>
                      <td className="px-2 py-1"><button type="button" onClick={() => setEditing({ ...editing, logs: editing.logs.filter((_, idx) => idx !== i) })}><Trash2 className="h-4 w-4 text-gray-400" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500">Only rows marked Is Overtime feed the Overtime Slip. Unmarked rows are regular work hours.</p>
          </div>
        )}
      </Modal>

      <Modal isOpen={Boolean(addForm)} onClose={() => setAddForm(null)} title="Additional Salary" size="lg" footer={addForm && (
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setAddForm(null)}>Cancel</Button>
          <Button onClick={saveAdditional}>Save</Button>
        </div>
      )}>
        {addForm && (
          <div className="grid gap-3 md:grid-cols-2">
            <Select label="Employee *" value={addForm.employeeId} onChange={(e) => {
              const id = typeof e === 'string' ? e : e.target.value;
              const emp = EMPLOYEES.find((x) => x.id === id);
              setAddForm({ ...addForm, employeeId: id, employee: emp?.name || '' });
            }} options={[{ value: '', label: 'Select employee' }, ...EMPLOYEES.map((e) => ({ value: e.id, label: `${e.name} (${e.id})` }))]} />
            <Select label="Salary Component *" value={addForm.component} onChange={(e) => {
              const value = typeof e === 'string' ? e : e.target.value;
              const comp = ADDITIONAL_COMPONENTS.find((c) => c.value === value);
              setAddForm({ ...addForm, component: value, type: comp?.type || 'Earning' });
            }} options={ADDITIONAL_COMPONENTS.map((c) => ({ value: c.value, label: c.value }))} />
            <Select label="Type" value={addForm.type} onChange={(e) => setAddForm({ ...addForm, type: (typeof e === 'string' ? e : e.target.value) as Additional['type'] })} options={[{ value: 'Earning', label: 'Earning' }, { value: 'Deduction', label: 'Deduction' }]} />
            <Input label="Amount *" type="number" value={String(addForm.amount)} onChange={(e) => setAddForm({ ...addForm, amount: Number(e.target.value) })} />
            <Input label="Payroll Date" type="date" value={addForm.payrollDate} onChange={(e) => setAddForm({ ...addForm, payrollDate: e.target.value })} />
            <label className="flex items-center gap-2 text-sm pt-6"><input type="checkbox" checked={addForm.recurring} onChange={(e) => setAddForm({ ...addForm, recurring: e.target.checked })} /> Is Recurring</label>
            {addForm.recurring && (
              <>
                <Input label="From Date" type="date" value={addForm.fromDate} onChange={(e) => setAddForm({ ...addForm, fromDate: e.target.value })} />
                <Input label="To Date" type="date" value={addForm.toDate} onChange={(e) => setAddForm({ ...addForm, toDate: e.target.value })} />
                <Select label="Frequency" value={addForm.frequency} onChange={(e) => setAddForm({ ...addForm, frequency: typeof e === 'string' ? e : e.target.value })} options={[{ value: 'Monthly', label: 'Monthly' }, { value: 'Quarterly', label: 'Quarterly' }]} />
              </>
            )}
            <label className="flex items-center gap-2 text-sm md:col-span-2"><input type="checkbox" checked={addForm.overwrite} onChange={(e) => setAddForm({ ...addForm, overwrite: e.target.checked })} /> Overwrite Salary Structure Amount</label>
            <div className="md:col-span-2"><Textarea label="Notes" value={addForm.notes} onChange={(e) => setAddForm({ ...addForm, notes: e.target.value })} /></div>
            <p className="md:col-span-2 text-xs text-gray-500">Only components with Is Additional Component = ON are listed. Notes are internal and are not printed on the salary slip.</p>
          </div>
        )}
      </Modal>

      <Modal isOpen={confirmSubmit} onClose={() => setConfirmSubmit(false)} title="Submit overtime entry" size="md" footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setConfirmSubmit(false)}>Cancel</Button>
          <Button onClick={submitOtEntry}>Create Additional Salary</Button>
        </div>
      }>
        <p className="text-sm text-gray-600">Submitting creates Additional Salary records for each approved employee. Payroll Entry will pick them up for {period}. Unchecked employees are excluded.</p>
      </Modal>
    </div>
  );
}

export default OvertimeAdditionalEarnings;
