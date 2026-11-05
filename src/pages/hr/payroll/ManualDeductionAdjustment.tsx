import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Textarea } from '../../../components/ui/Textarea';
import { Modal } from '../../../components/ui/Modal';
import { Plus } from 'lucide-react';

type Tab = 'deduction' | 'adjustment' | 'bulk';
type Kind = 'Deduction' | 'Earning';
type Status = 'Draft' | 'Pending Approval' | 'Approved' | 'Rejected';
type Component = { name: string; abbr: string; kind: Kind; use: string };
type Row = {
  id: string;
  employeeId: string;
  employee: string;
  department: string;
  designation: string;
  netPay: number;
  component: string;
  kind: Kind;
  amount: number;
  reason: string;
  showOnSlip: boolean;
  docs: string[];
  payrollDate: string;
  recurring: boolean;
  from: string;
  to: string;
  monthly: number;
  approvedBy: string;
  status: Status;
};

const COMPONENTS: Component[] = [
  { name: 'Notice Period Recovery', abbr: 'NPR', kind: 'Deduction', use: 'Teacher leaves mid-term' },
  { name: 'Property Damage Recovery', abbr: 'PDR', kind: 'Deduction', use: 'Laptop / projector damage' },
  { name: 'Training Bond Recovery', abbr: 'TBR', kind: 'Deduction', use: 'Leaves before bond period' },
  { name: 'Co-op Society Subscription', abbr: 'COOP', kind: 'Deduction', use: 'Cooperative society' },
  { name: 'Union Subscription', abbr: 'UNION', kind: 'Deduction', use: 'Staff union fee' },
  { name: 'Canteen Recovery', abbr: 'CANT', kind: 'Deduction', use: 'Canteen advance' },
  { name: 'Income Tax Shortfall', abbr: 'ITSF', kind: 'Deduction', use: 'TDS deficit' },
  { name: 'Uniform / ID Recovery', abbr: 'UNIF', kind: 'Deduction', use: 'New joiner kit' },
  { name: 'Examination Duty Allowance', abbr: 'EXAM', kind: 'Earning', use: 'Board exam invigilation' },
  { name: 'Sports Meet Duty Pay', abbr: 'SPORT', kind: 'Earning', use: 'Weekend sports event' },
  { name: 'Underpayment Correction', abbr: 'UPC', kind: 'Earning', use: 'Previous formula error' },
  { name: 'Wrongful Deduction Reversal', abbr: 'WDR', kind: 'Earning', use: 'Reverse an error' },
  { name: 'Tour / Field Trip Duty Pay', abbr: 'TOUR', kind: 'Earning', use: 'Educational tour' },
  { name: 'Election Duty Allowance', abbr: 'ELEC', kind: 'Earning', use: 'Election duty' }
];
const STAFF = [
  { id: 'EMP-1042', name: 'Meera Iyer', department: 'Science', designation: 'PGT Physics', net: 72660 },
  { id: 'EMP-1088', name: 'Rajesh Kumar', department: 'Mathematics', designation: 'TGT Maths', net: 58000 },
  { id: 'EMP-1101', name: 'Kavita Shah', department: 'Administration', designation: 'Clerk', net: 42000 }
];
const THRESHOLD = 5000;
const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

const empty = (kind: Kind): Row => ({
  id: '',
  employeeId: 'EMP-1042',
  employee: 'Meera Iyer',
  department: 'Science',
  designation: 'PGT Physics',
  netPay: 72660,
  component: kind === 'Deduction' ? 'Property Damage Recovery' : 'Examination Duty Allowance',
  kind,
  amount: 0,
  reason: '',
  showOnSlip: true,
  docs: [],
  payrollDate: '2026-10-01',
  recurring: false,
  from: '2026-10-01',
  to: '2027-03-31',
  monthly: 0,
  approvedBy: '',
  status: 'Draft'
});

export function ManualDeductionAdjustment() {
  const [tab, setTab] = useState<Tab>('deduction');
  const [rows, setRows] = useState<Row[]>([{
    ...empty('Deduction'),
    id: 'MD-001',
    component: 'Uniform / ID Recovery',
    amount: 800,
    reason: 'New joiner ID card and diary — Oct 2026',
    status: 'Approved',
    approvedBy: 'HR Manager'
  }]);
  const [form, setForm] = useState<Row>(empty('Deduction'));
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState('');
  const [disputeFor, setDisputeFor] = useState<Row | null>(null);
  const [disputeNote, setDisputeNote] = useState('');
  const [csvText, setCsvText] = useState('EMP-1042,Uniform / ID Recovery,500,Annual staff diary\nEMP-1088,Uniform / ID Recovery,500,Annual staff diary\nEMP-9999,Canteen Recovery,80000,Bad row');
  const [csvPreview, setCsvPreview] = useState<{ id: string; name: string; component: string; amount: number; reason: string; error?: string }[]>([]);

  const flash = (t: string) => { setNotice(t); window.setTimeout(() => setNotice(''), 5000); };
  const kind: Kind = tab === 'adjustment' ? 'Earning' : 'Deduction';
  const components = COMPONENTS.filter((c) => c.kind === (tab === 'adjustment' ? 'Earning' : 'Deduction'));
  const list = rows.filter((r) => (tab === 'adjustment' ? r.kind === 'Earning' : r.kind === 'Deduction'));

  const pickEmp = (id: string) => {
    const s = STAFF.find((x) => x.id === id);
    if (!s) return;
    setForm((f) => ({ ...f, employeeId: s.id, employee: s.name, department: s.department, designation: s.designation, netPay: s.net }));
  };

  const overNet = form.kind === 'Deduction' && form.amount > form.netPay;
  const overHalf = form.kind === 'Deduction' && form.amount > form.netPay * 0.5;
  const needsPrincipal = form.amount > THRESHOLD;

  const submit = () => {
    if (!form.employeeId || !form.component || !form.amount || !form.reason.trim()) {
      flash('Employee, component, amount and reason are required.');
      return;
    }
    if (overNet) { flash('Deduction cannot exceed employee net pay for the month.'); return; }
    const status: Status = needsPrincipal ? 'Pending Approval' : 'Approved';
    const record: Row = {
      ...form,
      id: form.id || `${form.kind === 'Deduction' ? 'MD' : 'SA'}-${Date.now()}`,
      status,
      approvedBy: needsPrincipal ? '' : 'HR Manager',
      kind: tab === 'adjustment' ? 'Earning' : 'Deduction'
    };
    setRows((p) => [record, ...p.filter((r) => r.id !== record.id)]);
    setShowForm(false);
    flash(needsPrincipal
      ? `Sent to Principal / VP — amount ${inr(form.amount)} exceeds ₹${THRESHOLD.toLocaleString('en-IN')} threshold.`
      : `Auto-approved by HR Manager. Will feed Payroll Entry for ${form.payrollDate.slice(0, 7)}.`);
  };

  const parseCsv = () => {
    const lines = csvText.split('\n').map((l) => l.trim()).filter(Boolean);
    const preview = lines.map((line) => {
      const [id, component, amountStr, reason] = line.split(',').map((x) => x.trim());
      const staff = STAFF.find((s) => s.id === id);
      const amount = Number(amountStr);
      let error = '';
      if (!staff) error = 'Employee not found';
      else if (!amount || amount <= 0) error = 'Invalid amount';
      else if (amount > staff.net) error = 'Amount exceeds net pay';
      return { id, name: staff?.name || id, component, amount, reason, error: error || undefined };
    });
    setCsvPreview(preview);
  };

  const applyCsv = () => {
    const ok = csvPreview.filter((r) => !r.error);
    const created: Row[] = ok.map((r, i) => {
      const s = STAFF.find((x) => x.id === r.id)!;
      return {
        ...empty('Deduction'),
        id: `MD-BULK-${Date.now()}-${i}`,
        employeeId: s.id,
        employee: s.name,
        department: s.department,
        designation: s.designation,
        netPay: s.net,
        component: r.component,
        amount: r.amount,
        reason: r.reason,
        status: r.amount > THRESHOLD ? 'Pending Approval' : 'Approved',
        approvedBy: r.amount > THRESHOLD ? '' : 'HR Manager'
      };
    });
    setRows((p) => [...created, ...p]);
    flash(`Bulk applied ${ok.length} rows. ${csvPreview.filter((r) => r.error).length} excluded.`);
  };

  const approveAllPending = () => {
    setRows((p) => p.map((r) => r.status === 'Pending Approval' ? { ...r, status: 'Approved', approvedBy: 'Principal' } : r));
    flash('Principal approved all pending bulk rows.');
  };

  const visibleFormKind = tab === 'adjustment' ? 'Earning' : 'Deduction';

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manual Deduction & Salary Adjustment</h1>
          <p className="text-sm text-gray-500">One-time Additional Salary of type Deduction or Earning. Distinct from PF, ESI, TDS and LWP.</p>
        </div>
        {tab !== 'bulk' && <Button onClick={() => { setForm(empty(visibleFormKind)); setShowForm(true); }}><Plus className="h-4 w-4" />New {visibleFormKind}</Button>}
      </div>
      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}

      <div className="flex flex-wrap gap-2">
        {[{ id: 'deduction' as const, label: 'Manual Deduction' }, { id: 'adjustment' as const, label: 'Salary Adjustment' }, { id: 'bulk' as const, label: 'Bulk Deduction' }].map((t) => (
          <button key={t.id} type="button" onClick={() => { setTab(t.id); setShowForm(false); }} className={`rounded-lg border px-4 py-2 text-sm font-medium ${tab === t.id ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-200 bg-white text-gray-600'}`}>{t.label}</button>
        ))}
      </div>

      {tab !== 'bulk' && !showForm && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">{['Employee', 'Component', 'Amount', 'Month', 'Status', ''].map((h) => <th key={h || 'a'} className="px-3 py-2">{h}</th>)}</tr></thead>
              <tbody>
                {list.map((r) => (
                  <tr key={r.id} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-2">{r.employee}<p className="text-xs text-gray-400">{r.employeeId}</p></td>
                    <td className="px-3 py-2">{r.component}</td>
                    <td className="px-3 py-2 font-semibold">{inr(r.amount)}</td>
                    <td className="px-3 py-2 text-xs">{r.payrollDate}</td>
                    <td className="px-3 py-2"><Badge variant={r.status === 'Approved' ? 'success' : r.status === 'Rejected' ? 'danger' : 'warning'}>{r.status}</Badge></td>
                    <td className="px-3 py-2">
                      {r.status === 'Pending Approval' && (
                        <>
                          <Button size="xs" onClick={() => { setRows((p) => p.map((x) => x.id === r.id ? { ...x, status: 'Approved', approvedBy: 'Principal' } : x)); flash(`A deduction of ${inr(r.amount)} has been approved for ${r.reason}. It will be reflected in the salary slip.`); }}>Approve</Button>
                          <Button size="xs" variant="ghost" onClick={() => { setRows((p) => p.map((x) => x.id === r.id ? { ...x, status: 'Rejected' } : x)); flash('Rejected. Employee notified.'); }}>Reject</Button>
                        </>
                      )}
                      {r.status === 'Approved' && <Button size="xs" variant="ghost" onClick={() => setDisputeFor(r)}>Dispute</Button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab !== 'bulk' && showForm && (
        <Card title={kind === 'Deduction' ? 'Manual Deduction' : 'Salary Adjustment (positive correction)'}>
          <div className="grid gap-4 md:grid-cols-2">
            <Select label="Employee *" value={form.employeeId} onChange={(e) => pickEmp(typeof e === 'string' ? e : e.target.value)} options={STAFF.map((s) => ({ value: s.id, label: `${s.name} (${s.id})` }))} />
            <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">{form.department} · {form.designation}<p>Current month net pay: <b>{inr(form.netPay)}</b></p></div>
            <Select label="Salary Component *" value={form.component} onChange={(e) => {
              const name = typeof e === 'string' ? e : e.target.value;
              const c = COMPONENTS.find((x) => x.name === name);
              setForm({ ...form, component: name, kind: c?.kind || kind });
            }} options={components.map((c) => ({ value: c.name, label: `${c.name} (${c.abbr})` }))} />
            <Input label="Type" value={kind} readOnly />
            <div>
              <Input label={`${kind} Amount *`} type="number" value={String(form.amount || '')} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} error={overNet ? 'Cannot exceed net pay' : undefined} />
              {overHalf && !overNet && <p className="mt-1 text-xs italic text-amber-600">Amount is more than 50% of net pay.</p>}
              {needsPrincipal && <p className="mt-1 text-xs text-amber-700">Above ₹5,000 — Principal approval required.</p>}
            </div>
            <Input label="Payroll Date" type="date" value={form.payrollDate} onChange={(e) => setForm({ ...form, payrollDate: e.target.value })} />
            <div className="md:col-span-2"><Textarea label="Reason * (audit trail)" rows={3} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} /></div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.showOnSlip} onChange={(e) => setForm({ ...form, showOnSlip: e.target.checked })} /> Show reason on salary slip</label>
            <Button size="sm" variant="outline" onClick={() => setForm({ ...form, docs: [...form.docs, 'supporting-document.pdf'] })}>Attach supporting document</Button>
            <label className="flex items-center gap-2 text-sm md:col-span-2"><input type="checkbox" checked={form.recurring} onChange={(e) => setForm({ ...form, recurring: e.target.checked })} /> Is Recurring (multi-month recovery)</label>
            {form.recurring && (
              <>
                <Input label="From Date" type="date" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} />
                <Input label="To Date" type="date" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} />
                <Input label="Monthly Amount" type="number" value={String(form.monthly || '')} onChange={(e) => setForm({ ...form, monthly: Number(e.target.value) })} />
              </>
            )}
            <Select label="Approved By" value={form.approvedBy} onChange={(e) => setForm({ ...form, approvedBy: typeof e === 'string' ? e : e.target.value })} options={[{ value: '', label: needsPrincipal ? 'Principal / VP' : 'HR Manager' }, { value: 'HR Manager', label: 'HR Manager' }, { value: 'Principal', label: 'Principal' }]} />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={submit}>Submit</Button>
          </div>
        </Card>
      )}

      {tab === 'bulk' && (
        <div className="space-y-4">
          <Card title="Bulk Deduction — CSV">
            <p className="mb-2 text-sm text-gray-500">Template columns: Employee ID, Deduction Component, Amount, Reason. Same deduction for many staff (e.g. ₹500 staff diary).</p>
            <Textarea rows={6} value={csvText} onChange={(e) => setCsvText(e.target.value)} />
            <div className="mt-3 flex gap-2">
              <Button variant="outline" onClick={() => setCsvText('Employee ID,Deduction Component,Amount,Reason\nEMP-1042,Uniform / ID Recovery,500,Annual staff diary')}>Download template</Button>
              <Button onClick={parseCsv}>Preview Before Apply</Button>
            </div>
          </Card>
          {csvPreview.length > 0 && (
            <Card>
              <p className="mb-2 text-sm">Total valid: {inr(csvPreview.filter((r) => !r.error).reduce((s, r) => s + r.amount, 0))}</p>
              <table className="w-full text-sm">
                <thead><tr className="border-b text-left text-xs uppercase text-gray-500">{['Employee', 'Component', 'Amount', 'Reason', 'Status'].map((h) => <th key={h} className="px-2 py-2">{h}</th>)}</tr></thead>
                <tbody>
                  {csvPreview.map((r, i) => (
                    <tr key={i} className={`border-b ${r.error ? 'bg-red-50 text-red-600' : ''}`}>
                      <td className="px-2 py-2">{r.name} ({r.id})</td>
                      <td className="px-2 py-2">{r.component}</td>
                      <td className="px-2 py-2">{inr(r.amount)}</td>
                      <td className="px-2 py-2">{r.reason}</td>
                      <td className="px-2 py-2">{r.error || 'OK'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-3 flex gap-2">
                <Button onClick={applyCsv}>Apply valid rows</Button>
                <Button variant="outline" onClick={approveAllPending}>Bulk Approval (Principal)</Button>
              </div>
            </Card>
          )}
        </div>
      )}

      <Modal isOpen={Boolean(disputeFor)} onClose={() => setDisputeFor(null)} title="Dispute deduction" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setDisputeFor(null)}>Close</Button><Button onClick={() => { flash('Dispute lodged. HR will review the comments chain.'); setDisputeFor(null); setDisputeNote(''); }}>Submit dispute</Button></div>}>
        <p className="mb-2 text-sm text-gray-600">{disputeFor?.employee} · {inr(disputeFor?.amount || 0)} · {disputeFor?.reason}</p>
        <Textarea label="Comments" rows={4} value={disputeNote} onChange={(e) => setDisputeNote(e.target.value)} />
      </Modal>
    </div>
  );
}

export default ManualDeductionAdjustment;
