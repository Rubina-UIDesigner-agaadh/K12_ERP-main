import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Textarea } from '../../../components/ui/Textarea';
import { Plus } from 'lucide-react';

type Tab = 'timesheet' | 'slip' | 'flow';
type TsStatus = 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
type Log = { id: string; activity: string; from: string; to: string; hours: number; isOt: boolean; rate: number; amount: number; expected: number; project: string };
type Timesheet = {
  id: string;
  employeeId: string;
  employee: string;
  department: string;
  shift: string;
  designation: string;
  company: string;
  start: string;
  end: string;
  logs: Log[];
  status: TsStatus;
};
type OtRow = { employeeId: string; employee: string; hours: number; rate: number; amount: number; approved: boolean; remarks: string; multiplier: number; category: string };

const STAFF = [
  { id: 'EMP-1120', name: 'Anil Patel', department: 'Sports', shift: 'General', designation: 'PET', category: 'Teaching Staff', multiplier: 1.5 },
  { id: 'EMP-1101', name: 'Kavita Shah', department: 'Administration', shift: 'General', designation: 'Clerk', category: 'Administrative', multiplier: 1.5 },
  { id: 'EMP-1204', name: 'Suresh Yadav', department: 'Support', shift: 'Night', designation: 'Boarding Warden', category: 'Support Staff', multiplier: 2 },
  { id: 'EMP-1042', name: 'Meera Iyer', department: 'Science', shift: 'General', designation: 'PGT Physics', category: 'Teaching Staff', multiplier: 1.5 }
];
const ACTIVITIES = ['Evening Duty', 'Exam Supervision', 'Sports Coaching', 'Board Exam Admin', 'Night Duty'];
const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const hoursBetween = (a: string, b: string) => {
  const d = (new Date(b).getTime() - new Date(a).getTime()) / 3600000;
  return Math.max(0, Math.round(d * 100) / 100);
};

const emptyLog = (): Log => ({ id: `L-${Date.now()}`, activity: 'Exam Supervision', from: '2026-10-28T17:00', to: '2026-10-28T21:00', hours: 4, isOt: true, rate: 312.5, amount: 1250, expected: 8, project: '' });

export function OvertimeManagement() {
  const [tab, setTab] = useState<Tab>('timesheet');
  const [notice, setNotice] = useState('');
  const [sheets, setSheets] = useState<Timesheet[]>([{
    id: 'TS-2026-014',
    employeeId: 'EMP-1042',
    employee: 'Meera Iyer',
    department: 'Science',
    shift: 'General',
    designation: 'PGT Physics',
    company: 'EduManager School',
    start: '2026-10-01',
    end: '2026-10-31',
    status: 'Submitted',
    logs: [{ id: 'L1', activity: 'Exam Supervision', from: '2026-10-28T17:00', to: '2026-10-28T21:00', hours: 4, isOt: true, rate: 312.5, amount: 1250, expected: 8, project: 'Board Exams' }]
  }]);
  const [form, setForm] = useState<Timesheet>({
    id: '',
    employeeId: 'EMP-1042',
    employee: 'Meera Iyer',
    department: 'Science',
    shift: 'General',
    designation: 'PGT Physics',
    company: 'EduManager School',
    start: '2026-10-01',
    end: '2026-10-31',
    logs: [emptyLog()],
    status: 'Draft'
  });
  const [showTs, setShowTs] = useState(false);
  const [period, setPeriod] = useState('FY 2026-27 · Oct 2026');
  const [otRows, setOtRows] = useState<OtRow[]>([]);
  const [entryName] = useState('OT-ENTRY-10-2026-001');

  const flash = (t: string) => { setNotice(t); window.setTimeout(() => setNotice(''), 4500); };

  const pickStaff = (id: string) => {
    const s = STAFF.find((x) => x.id === id);
    if (!s) return;
    setForm((f) => ({ ...f, employeeId: s.id, employee: s.name, department: s.department, shift: s.shift, designation: s.designation }));
  };

  const patchLog = (id: string, patch: Partial<Log>) => {
    setForm((f) => ({
      ...f,
      logs: f.logs.map((l) => {
        if (l.id !== id) return l;
        const next = { ...l, ...patch };
        next.hours = hoursBetween(next.from, next.to);
        next.amount = Math.round(next.hours * next.rate);
        return next;
      })
    }));
  };

  const saveTs = (status: TsStatus) => {
    if (!form.employeeId || !form.logs.length) { flash('Employee and at least one time log are required.'); return; }
    const record = { ...form, id: form.id || `TS-${Date.now()}`, status };
    setSheets((p) => [record, ...p.filter((s) => s.id !== record.id)]);
    setShowTs(false);
    flash(status === 'Submitted' ? 'Timesheet submitted. Teaching staff OT awaits Principal / VP approval.' : `Timesheet ${status.toLowerCase()}.`);
  };

  const getTimesheets = () => {
    const grouped: { [id: string]: OtRow } = {};
    sheets.filter((s) => s.status === 'Submitted' || s.status === 'Approved').forEach((s) => {
      const staff = STAFF.find((x) => x.id === s.employeeId);
      const hours = s.logs.filter((l) => l.isOt).reduce((n, l) => n + l.hours, 0);
      const basic = 50000;
      const rate = Math.round((basic / 26 / 8) * (staff?.multiplier || 1.5) * 100) / 100;
      grouped[s.employeeId] = {
        employeeId: s.employeeId,
        employee: s.employee,
        hours,
        rate,
        amount: Math.round(hours * rate),
        approved: true,
        remarks: 'Approved — Board Exam Duty Oct 28',
        multiplier: staff?.multiplier || 1.5,
        category: staff?.category || 'Teaching Staff'
      };
    });
    const list = Object.values(grouped);
    setOtRows(list.length ? list : [{
      employeeId: 'EMP-1042', employee: 'Meera Iyer', hours: 8, rate: 312.5, amount: 2500, approved: true, remarks: 'Approved — Board Exam Duty Oct 28', multiplier: 1.5, category: 'Teaching Staff'
    }, {
      employeeId: 'EMP-1204', employee: 'Suresh Yadav', hours: 12, rate: 384.6, amount: 4615, approved: true, remarks: 'Night duty — boarding', multiplier: 2, category: 'Support Staff'
    }]);
    flash('Submitted timesheets with OT rows loaded for the selected period.');
  };

  const submitEntry = () => {
    const approved = otRows.filter((r) => r.approved);
    if (!approved.length) { flash('Approve at least one employee.'); return; }
    flash(`Overtime submitted. Additional Salary (OT Pay) created for ${approved.length} employees. Payroll Entry will pick this up.`);
  };

  const otHours = useMemo(() => form.logs.filter((l) => l.isOt).reduce((s, l) => s + l.hours, 0), [form.logs]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Overtime Management</h1>
          <p className="text-sm text-gray-500">Timesheet → Overtime Slip → Additional Salary → Payroll Entry → Salary Slip</p>
        </div>
        {tab === 'timesheet' && <Button onClick={() => { setForm({ ...form, id: '', status: 'Draft', logs: [emptyLog()] }); setShowTs(true); }}><Plus className="h-4 w-4" />New Timesheet</Button>}
      </div>
      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}

      <div className="flex flex-wrap gap-2">
        {[{ id: 'timesheet' as const, label: 'Timesheet' }, { id: 'slip' as const, label: 'Overtime Slip' }, { id: 'flow' as const, label: 'Salary Slip Flow' }].map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`rounded-lg border px-4 py-2 text-sm font-medium ${tab === t.id ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-200 bg-white text-gray-600'}`}>{t.label}</button>
        ))}
      </div>

      {tab === 'timesheet' && !showTs && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">{['Timesheet', 'Employee', 'Period', 'OT Hours', 'Status', ''].map((h) => <th key={h || 'a'} className="px-3 py-2">{h}</th>)}</tr></thead>
              <tbody>
                {sheets.map((s) => (
                  <tr key={s.id} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-2 font-mono text-xs">{s.id}</td>
                    <td className="px-3 py-2">{s.employee}<p className="text-xs text-gray-400">{s.designation} · {s.department}</p></td>
                    <td className="px-3 py-2 text-xs">{s.start} → {s.end}</td>
                    <td className="px-3 py-2">{s.logs.filter((l) => l.isOt).reduce((n, l) => n + l.hours, 0)} h</td>
                    <td className="px-3 py-2"><Badge variant={s.status === 'Approved' ? 'success' : s.status === 'Rejected' ? 'danger' : s.status === 'Submitted' ? 'warning' : 'secondary'}>{s.status}</Badge></td>
                    <td className="px-3 py-2">
                      <Button size="xs" variant="ghost" onClick={() => { setForm(s); setShowTs(true); }}>Open</Button>
                      {s.status === 'Submitted' && (
                        <>
                          <Button size="xs" variant="ghost" onClick={() => { setSheets((p) => p.map((x) => x.id === s.id ? { ...x, status: 'Approved' } : x)); flash('Approved by Principal / VP.'); }}>Approve</Button>
                          <Button size="xs" variant="ghost" onClick={() => { setSheets((p) => p.map((x) => x.id === s.id ? { ...x, status: 'Rejected' } : x)); flash('Timesheet rejected.'); }}>Reject</Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 'timesheet' && showTs && (
        <Card title={form.id || 'New Timesheet'}>
          <div className="grid gap-4 md:grid-cols-3">
            <Select label="Employee *" value={form.employeeId} onChange={(e) => pickStaff(typeof e === 'string' ? e : e.target.value)} options={STAFF.map((s) => ({ value: s.id, label: `${s.name} (${s.id})` }))} />
            <Input label="Department" value={form.department} readOnly />
            <Input label="Shift / Designation" value={`${form.shift} · ${form.designation}`} readOnly />
            <Input label="Company" value={form.company} readOnly />
            <Input label="Start Date" type="date" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} />
            <Input label="End Date" type="date" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} />
          </div>
          <p className="mt-4 text-sm font-semibold">Time Logs · OT hours {otHours}</p>
          <p className="mb-2 text-xs text-gray-500">Only rows marked Is Overtime feed the Overtime Slip. Teaching staff OT needs Principal / VP approval.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left text-xs uppercase text-gray-500">{['Activity', 'From', 'To', 'Hours', 'Is OT', 'Rate', 'Amount', 'Project', ''].map((h) => <th key={h || 'b'} className="px-2 py-2">{h}</th>)}</tr></thead>
              <tbody>
                {form.logs.map((l) => (
                  <tr key={l.id} className="border-b">
                    <td className="px-2 py-2"><select className="rounded border px-1 py-1" value={l.activity} onChange={(e) => patchLog(l.id, { activity: e.target.value })}>{ACTIVITIES.map((a) => <option key={a}>{a}</option>)}</select></td>
                    <td className="px-2 py-2"><input type="datetime-local" className="rounded border px-1 py-1 text-xs" value={l.from} onChange={(e) => patchLog(l.id, { from: e.target.value })} /></td>
                    <td className="px-2 py-2"><input type="datetime-local" className="rounded border px-1 py-1 text-xs" value={l.to} onChange={(e) => patchLog(l.id, { to: e.target.value })} /></td>
                    <td className="px-2 py-2">{l.hours}</td>
                    <td className="px-2 py-2"><input type="checkbox" checked={l.isOt} onChange={(e) => patchLog(l.id, { isOt: e.target.checked })} /></td>
                    <td className="px-2 py-2"><input type="number" className="w-20 rounded border px-1 py-1" value={l.rate} onChange={(e) => patchLog(l.id, { rate: Number(e.target.value) })} /></td>
                    <td className="px-2 py-2">{inr(l.amount)}</td>
                    <td className="px-2 py-2"><input className="w-28 rounded border px-1 py-1" value={l.project} onChange={(e) => patchLog(l.id, { project: e.target.value })} /></td>
                    <td className="px-2 py-2"><Button size="xs" variant="ghost" onClick={() => setForm({ ...form, logs: form.logs.filter((x) => x.id !== l.id) })}>Remove</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button size="sm" variant="outline" className="mt-2" onClick={() => setForm({ ...form, logs: [...form.logs, emptyLog()] })}>Add row</Button>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowTs(false)}>Cancel</Button>
            <Button variant="outline" onClick={() => saveTs('Draft')}>Save Draft</Button>
            <Button onClick={() => saveTs('Submitted')}>Submit</Button>
          </div>
        </Card>
      )}

      {tab === 'slip' && (
        <div className="space-y-4">
          <Card title="Overtime Entry">
            <div className="grid gap-4 md:grid-cols-4">
              <Input label="Overtime Entry Name" value={entryName} readOnly />
              <Input label="Company" value="EduManager School" readOnly />
              <Select label="Payroll Period" value={period} onChange={(e) => setPeriod(typeof e === 'string' ? e : e.target.value)} options={[{ value: 'FY 2026-27 · Oct 2026', label: 'FY 2026-27 · Oct 2026' }, { value: 'FY 2026-27 · Nov 2026', label: 'FY 2026-27 · Nov 2026' }]} />
              <Input label="Window" value="2026-10-01 → 2026-10-31" readOnly />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={getTimesheets}>Get Timesheets</Button>
              <Button variant="outline" onClick={() => setOtRows((p) => p.map((r) => ({ ...r, approved: true })))}>Approve All</Button>
              <Button onClick={submitEntry} disabled={!otRows.length}>Submit Overtime Entry</Button>
            </div>
            <p className="mt-2 text-xs text-gray-500">Rate = (Basic ÷ working days ÷ 8) × multiplier. Teaching 1.5× · Support (night/weekend) 2.0× · Admin 1.5× · Management N/A.</p>
          </Card>
          {otRows.length > 0 && (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">{['Employee', 'Category', 'OT Hours', 'Rate / Hour', 'Amount', 'Approved', 'Remarks'].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}</tr></thead>
                  <tbody>
                    {otRows.map((r) => (
                      <tr key={r.employeeId} className={`border-b ${r.approved ? '' : 'opacity-50'}`}>
                        <td className="px-3 py-2">{r.employee}<p className="text-xs text-gray-400">{r.employeeId}</p></td>
                        <td className="px-3 py-2 text-xs">{r.category} · {r.multiplier}×</td>
                        <td className="px-3 py-2">{r.hours}</td>
                        <td className="px-3 py-2"><input type="number" className="w-24 rounded border px-2 py-1" value={r.rate} onChange={(e) => setOtRows((p) => p.map((x) => x.employeeId === r.employeeId ? { ...x, rate: Number(e.target.value), amount: Math.round(x.hours * Number(e.target.value)) } : x))} /></td>
                        <td className="px-3 py-2 font-semibold">{inr(r.amount)}</td>
                        <td className="px-3 py-2"><input type="checkbox" checked={r.approved} onChange={(e) => setOtRows((p) => p.map((x) => x.employeeId === r.employeeId ? { ...x, approved: e.target.checked } : x))} /></td>
                        <td className="px-3 py-2"><input className="w-full rounded border px-2 py-1 text-xs" value={r.remarks} onChange={(e) => setOtRows((p) => p.map((x) => x.employeeId === r.employeeId ? { ...x, remarks: e.target.value } : x))} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}

      {tab === 'flow' && (
        <Card title="Overtime → Salary Slip">
          <ol className="list-decimal space-y-2 pl-5 text-sm text-gray-700">
            <li>Timesheet rows marked Is Overtime are submitted and approved.</li>
            <li>Overtime Entry batches them for the payroll period.</li>
            <li>Submit creates Additional Salary component <b>Overtime Pay (OT)</b> — earning, tax applicable, additional component ON, formula <code className="rounded bg-gray-100 px-1">(basic / total_working_days / 8) * ot_hours * 1.5</code>.</li>
            <li>Payroll Entry picks up Additional Salary.</li>
            <li>Salary Slip earnings show e.g. Overtime Pay (8 hrs × ₹312.50) = ₹2,500.</li>
            <li>Journal Entry books OT Expense Account.</li>
          </ol>
          <div className="mt-4 rounded-lg bg-emerald-50 p-4 font-mono text-xs text-emerald-800 whitespace-pre-wrap">{`EARNINGS:\nBasic Pay .......................... ₹50,000\nDA .................................. ₹22,500\nHRA ................................. ₹20,000\nOvertime Pay (8 hrs × ₹312.50) ..... ₹2,500\nGross Earnings ..................... ₹95,000`}</div>
        </Card>
      )}
    </div>
  );
}

export default OvertimeManagement;
