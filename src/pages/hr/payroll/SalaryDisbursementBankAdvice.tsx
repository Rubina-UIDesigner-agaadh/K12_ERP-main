import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Textarea } from '../../../components/ui/Textarea';

type Tab = 'mandate' | 'neft' | 'letter' | 'recon';
type Mode = 'NEFT' | 'RTGS' | 'ECS';
type PayStatus = 'Initiated' | 'Paid' | 'Failed' | 'Pending';
type Row = {
  sr: number;
  id: string;
  name: string;
  designation: string;
  bank: string;
  account: string;
  ifsc: string;
  micr: string;
  net: number;
  mode: Mode;
  status: PayStatus;
  utr?: string;
  fail?: string;
};

const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const words = (n: number) => `${n.toLocaleString('en-IN')} Only`;

const SEED: Row[] = [
  { sr: 1, id: 'EMP-1042', name: 'Meera Iyer', designation: 'PGT Physics', bank: 'SBI', account: '12345678901', ifsc: 'SBIN0001234', micr: '380002001', net: 72660, mode: 'NEFT', status: 'Initiated' },
  { sr: 2, id: 'EMP-1088', name: 'Rajesh Kumar', designation: 'TGT Maths', bank: 'HDFC', account: '98765432101', ifsc: 'HDFC0001234', micr: '380240002', net: 58900, mode: 'NEFT', status: 'Initiated' },
  { sr: 3, id: 'EMP-1101', name: 'Kavita Shah', designation: 'Clerk', bank: 'SBI', account: '11223344556', ifsc: 'SBIN0001234', micr: '380002001', net: 42000, mode: 'NEFT', status: 'Initiated' },
  { sr: 4, id: 'EMP-1308', name: 'Principal Rao', designation: 'Principal', bank: 'SBI', account: '55667788990', ifsc: 'SBIN0005678', micr: '380002009', net: 248500, mode: 'RTGS', status: 'Initiated' },
  { sr: 5, id: 'EMP-1120', name: 'Anil Patel', designation: 'PET', bank: 'ICICI', account: '44556677889', ifsc: 'ICIC0001122', micr: '380229003', net: 36000, mode: 'ECS', status: 'Failed', fail: 'Account frozen' }
];

export function SalaryDisbursementBankAdvice() {
  const [tab, setTab] = useState<Tab>('mandate');
  const [month, setMonth] = useState('2026-10');
  const [dept, setDept] = useState('');
  const [bank, setBank] = useState('');
  const [mode, setMode] = useState('');
  const [branch, setBranch] = useState('');
  const [rows, setRows] = useState(SEED);
  const [notice, setNotice] = useState('');
  const [fmt, setFmt] = useState('SBI NEFT format');
  const [ref] = useState('DPS-PAY-OCT-2026-001');
  const [valueDate, setValueDate] = useState('2026-10-28');
  const [debit, setDebit] = useState('SBI Current ****5678');
  const [signatory, setSignatory] = useState('Principal');
  const [letterOpen, setLetterOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('EMP-1042,UTR123456\nEMP-1088,UTR123457\nEMP-1101,UTR123458\nEMP-1308,UTR123459');

  const flash = (t: string) => { setNotice(t); window.setTimeout(() => setNotice(''), 4500); };
  const visible = rows.filter((r) => {
    if (bank && r.bank !== bank) return false;
    if (mode && r.mode !== mode) return false;
    return true;
  });
  const total = visible.reduce((s, r) => s + r.net, 0);
  const neft = visible.filter((r) => r.mode === 'NEFT');
  const rtgs = visible.filter((r) => r.mode === 'RTGS');
  const stats = useMemo(() => ({
    initiated: rows.length,
    paid: rows.filter((r) => r.status === 'Paid').length,
    failed: rows.filter((r) => r.status === 'Failed').length,
    pending: rows.filter((r) => r.status === 'Pending' || r.status === 'Initiated').length
  }), [rows]);

  const csv = ['RECORD_TYPE, ACCOUNT_NO, IFSC, AMOUNT, ACCOUNT_NAME, PAYMENT_REF',
    ...visible.map((r) => `C, ${r.account}, ${r.ifsc}, ${r.net.toFixed(2)}, ${r.name.toUpperCase()}, ${ref}`)].join('\n');

  const applyUtr = () => {
    const map: Record<string, string> = {};
    confirmText.split('\n').forEach((line) => {
      const [id, utr] = line.split(',').map((x) => x.trim());
      if (id && utr) map[id] = utr;
    });
    setRows((p) => p.map((r) => map[r.id] ? { ...r, status: 'Paid', utr: map[r.id], fail: undefined } : r));
    flash('UTR matching complete. Matched slips marked Paid.');
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Salary Disbursement & Bank Advice</h1>
        <p className="text-sm text-gray-500">Bank mandate, NEFT file, advice letter and UTR reconciliation after payroll bank entry.</p>
      </div>
      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}

      <div className="flex flex-wrap gap-2">
        {[{ id: 'mandate' as const, label: 'Bank Mandate Report' }, { id: 'neft' as const, label: 'NEFT / ECS File' }, { id: 'letter' as const, label: 'Bank Advice Letter' }, { id: 'recon' as const, label: 'Confirmation & Reconciliation' }].map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`rounded-lg border px-4 py-2 text-sm font-medium ${tab === t.id ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-200 bg-white text-gray-600'}`}>{t.label}</button>
        ))}
      </div>

      {tab === 'mandate' && (
        <Card>
          <div className="mb-4 grid gap-3 md:grid-cols-5">
            <Input label="Month / Year" type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
            <Select label="Department" value={dept} onChange={(e) => setDept(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All' }, { value: 'Science', label: 'Science' }]} />
            <Select label="Bank" value={bank} onChange={(e) => setBank(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All banks' }, { value: 'SBI', label: 'SBI' }, { value: 'HDFC', label: 'HDFC' }, { value: 'ICICI', label: 'ICICI' }]} />
            <Select label="Payment Mode" value={mode} onChange={(e) => setMode(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All' }, { value: 'NEFT', label: 'NEFT' }, { value: 'RTGS', label: 'RTGS' }, { value: 'ECS', label: 'ECS' }]} />
            <Select label="Branch" value={branch} onChange={(e) => setBranch(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All' }, { value: 'Main', label: 'Main' }]} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
                  {['Sr.', 'Employee ID', 'Name', 'Designation', 'Bank', 'Account', 'IFSC', 'MICR', 'Net Pay', 'Mode'].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {visible.map((r) => (
                  <tr key={r.id} className="border-b">
                    <td className="px-3 py-2">{r.sr}</td>
                    <td className="px-3 py-2 font-mono text-xs">{r.id}</td>
                    <td className="px-3 py-2">{r.name}</td>
                    <td className="px-3 py-2">{r.designation}</td>
                    <td className="px-3 py-2">{r.bank}</td>
                    <td className="px-3 py-2 font-mono text-xs">{r.account}</td>
                    <td className="px-3 py-2 font-mono text-xs">{r.ifsc}</td>
                    <td className="px-3 py-2 font-mono text-xs">{r.micr}</td>
                    <td className="px-3 py-2 font-semibold">{inr(r.net)}</td>
                    <td className="px-3 py-2"><Badge variant={r.mode === 'RTGS' ? 'warning' : 'info'}>{r.mode}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 rounded-lg bg-gray-50 p-4 text-sm">
            <p>Total Employees: <b>{visible.length}</b> · Total Disbursement: <b>{inr(total)}</b></p>
            <p>Via NEFT: {neft.length} employees — {inr(neft.reduce((s, r) => s + r.net, 0))}</p>
            <p>Via RTGS: {rtgs.length} employees — {inr(rtgs.reduce((s, r) => s + r.net, 0))} (amounts &gt; ₹2 lakhs)</p>
          </div>
        </Card>
      )}

      {tab === 'neft' && (
        <Card title="NEFT / ECS Bank File Export">
          <div className="grid gap-4 md:grid-cols-2">
            <Select label="Export Format" value={fmt} onChange={(e) => setFmt(typeof e === 'string' ? e : e.target.value)} options={['SBI NEFT format', 'HDFC NEFT', 'ICICI NEFT', 'Generic (CSV)'].map((v) => ({ value: v, label: v }))} />
            <Input label="File Reference Number" value={ref} readOnly />
            <Input label="Value Date" type="date" value={valueDate} onChange={(e) => setValueDate(e.target.value)} />
            <Select label="Debit Account" value={debit} onChange={(e) => setDebit(typeof e === 'string' ? e : e.target.value)} options={[{ value: 'SBI Current ****5678', label: 'SBI Current ****5678' }]} />
          </div>
          <pre className="mt-4 overflow-auto rounded-lg bg-gray-50 p-3 text-xs">{csv}</pre>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={() => flash(`File ${ref} generated in ${fmt}. Download logged.`)}>Generate File</Button>
            <Button variant="outline" onClick={() => flash(`Downloaded ${ref}. Login audit recorded.`)}>Download</Button>
            <Button variant="outline" onClick={() => flash('Opening school corporate banking portal…')}>Upload to Bank Portal</Button>
          </div>
        </Card>
      )}

      {tab === 'letter' && (
        <Card title="Bank Advice Letter">
          <div className="grid gap-4 md:grid-cols-2">
            <Select label="Signatory Name" value={signatory} onChange={(e) => setSignatory(typeof e === 'string' ? e : e.target.value)} options={['Principal', 'Finance Officer', 'Both'].map((v) => ({ value: v, label: v }))} />
            <Select label="Bank Account" value={debit} onChange={(e) => setDebit(typeof e === 'string' ? e : e.target.value)} options={[{ value: 'SBI Current ****5678', label: 'SBI Current ****5678' }]} />
          </div>
          <p className="mt-2 text-sm text-gray-500">Attached file: {ref}.csv (NEFT beneficiary list — {visible.length} employees)</p>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => setLetterOpen(true)}>Generate Letter</Button>
            <Button variant="outline" onClick={() => flash('Letter + NEFT file emailed to configured bank address.')}>Email to Bank</Button>
          </div>
        </Card>
      )}

      {tab === 'recon' && (
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-4">
            {[{ l: 'Initiated', v: stats.initiated }, { l: 'Success / Paid', v: stats.paid }, { l: 'Failed', v: stats.failed }, { l: 'Pending', v: stats.pending }].map((s) => (
              <div key={s.l} className={`rounded-xl border p-4 ${s.l.startsWith('Failed') && s.v ? 'border-red-200 bg-red-50' : 'bg-white'}`}>
                <p className="text-[11px] font-semibold uppercase text-gray-400">{s.l}</p>
                <p className="text-2xl font-bold">{s.v}</p>
              </div>
            ))}
          </div>
          <Card title="Upload bank confirmation (UTR file)">
            <Textarea rows={5} value={confirmText} onChange={(e) => setConfirmText(e.target.value)} helperText="Employee ID, UTR per line" />
            <Button className="mt-3" onClick={applyUtr}>Match UTR & mark Paid</Button>
          </Card>
          <Card>
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">{['Employee', 'Net', 'Status', 'UTR', ''].map((h) => <th key={h || 'a'} className="px-3 py-2">{h}</th>)}</tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className={`border-b ${r.status === 'Failed' ? 'bg-red-50' : ''}`}>
                    <td className="px-3 py-2">{r.name}<p className="text-xs text-gray-400">{r.id}</p></td>
                    <td className="px-3 py-2">{inr(r.net)}</td>
                    <td className="px-3 py-2"><Badge variant={r.status === 'Paid' ? 'success' : r.status === 'Failed' ? 'danger' : 'warning'}>{r.status}</Badge> {r.fail && <span className="text-xs text-red-600">{r.fail}</span>}</td>
                    <td className="px-3 py-2 font-mono text-xs">{r.utr || '—'}</td>
                    <td className="px-3 py-2">{r.status === 'Failed' && <Button size="xs" onClick={() => { setRows((p) => p.map((x) => x.id === r.id ? { ...x, status: 'Paid', utr: 'RE-NEFT-' + r.id, fail: undefined } : x)); flash(`Re-initiated NEFT for ${r.name}.`); }}>Re-initiate</Button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      <Modal isOpen={letterOpen} onClose={() => setLetterOpen(false)} title="Bank Advice Letter" size="lg" footer={<Button onClick={() => setLetterOpen(false)}>Close</Button>}>
        <pre className="whitespace-pre-wrap text-sm text-gray-700">{`EduManager School
Date: 28 October 2026

To,
The Branch Manager,
State Bank of India

Subject: Salary Disbursement Instructions — October 2026

Kindly credit the salaries for October 2026 to the accounts of our staff as per the attached list.

Total Amount: ${inr(total)} (${words(total)})

Please debit our Current Account ${debit}.

Enclosed: NEFT beneficiary list (${visible.length} employees)

Authorized Signatory: ${signatory}`}</pre>
      </Modal>
    </div>
  );
}

export default SalaryDisbursementBankAdvice;
