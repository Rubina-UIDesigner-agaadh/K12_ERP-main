import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Download, Eye, Printer, Search, Send } from 'lucide-react';

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

type Slip = {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  designation: string;
  branch: string;
  period: string;
  structure: string;
  present: number;
  paidLeave: number;
  unpaidLeave: number;
  holidays: number;
  workingDays: number;
  earnings: { name: string; amount: number }[];
  deductions: { name: string; amount: number }[];
  gross: number;
  net: number;
  paymentMode: string;
  bank: string;
  account: string;
  status: 'Draft' | 'Submitted' | 'Published';
};

const SLIPS: Slip[] = [
  {
    id: 'PS-2026-10-001',
    employeeId: 'EMP-1001',
    name: 'Teacher A',
    department: 'Science',
    designation: 'PGT Physics',
    branch: 'Main Branch',
    period: 'October 2026',
    structure: 'Teaching Grade A 2026',
    present: 24,
    paidLeave: 2,
    unpaidLeave: 0,
    holidays: 2,
    workingDays: 28,
    earnings: [{ name: 'Basic', amount: 25000 }, { name: 'HRA', amount: 10000 }, { name: 'Allowances', amount: 7000 }],
    deductions: [{ name: 'PF', amount: 1800 }, { name: 'PT', amount: 200 }, { name: 'TDS', amount: 1000 }],
    gross: 42000,
    net: 39000,
    paymentMode: 'Bank transfer',
    bank: 'HDFC Bank',
    account: 'XXXX1234',
    status: 'Draft',
  },
  {
    id: 'PS-2026-10-002',
    employeeId: 'EMP-1002',
    name: 'Teacher B',
    department: 'Mathematics',
    designation: 'TGT Maths',
    branch: 'Main Branch',
    period: 'October 2026',
    structure: 'Teaching Grade A 2026',
    present: 26,
    paidLeave: 1,
    unpaidLeave: 0,
    holidays: 2,
    workingDays: 29,
    earnings: [{ name: 'Basic', amount: 28000 }, { name: 'HRA', amount: 12000 }, { name: 'Allowances', amount: 8000 }],
    deductions: [{ name: 'PF', amount: 2100 }, { name: 'PT', amount: 200 }, { name: 'TDS', amount: 1700 }],
    gross: 48000,
    net: 44000,
    paymentMode: 'Bank transfer',
    bank: 'SBI',
    account: 'XXXX5678',
    status: 'Submitted',
  },
  {
    id: 'PS-2026-10-003',
    employeeId: 'EMP-1003',
    name: 'Staff C',
    department: 'Administration',
    designation: 'Clerk',
    branch: 'Main Branch',
    period: 'October 2026',
    structure: 'Non-Teaching Grade C',
    present: 22,
    paidLeave: 2,
    unpaidLeave: 1,
    holidays: 2,
    workingDays: 26,
    earnings: [{ name: 'Basic', amount: 18000 }, { name: 'HRA', amount: 7000 }, { name: 'Allowances', amount: 5000 }],
    deductions: [{ name: 'PF', amount: 1200 }, { name: 'PT', amount: 200 }, { name: 'TDS', amount: 600 }],
    gross: 30000,
    net: 28000,
    paymentMode: 'Bank transfer',
    bank: 'Axis Bank',
    account: 'XXXX9012',
    status: 'Published',
  },
];

export function EmployeePayslipList() {
  const [slips, setSlips] = useState(SLIPS);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState<Slip | null>(null);
  const [notice, setNotice] = useState('');

  const flash = (text: string) => {
    setNotice(text);
    window.setTimeout(() => setNotice(''), 3500);
  };

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return slips.filter((s) => !q || `${s.name} ${s.employeeId} ${s.period}`.toLowerCase().includes(q));
  }, [slips, search]);

  const patch = (id: string, status: Slip['status']) => {
    setSlips((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    if (open?.id === id) setOpen({ ...open, status });
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Salary Slips</h1>
        <p className="text-sm text-gray-500">Each slip shows the finalized payroll calculation. It does not recalculate salary with different rules.</p>
      </div>

      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-4">
          <div className="relative min-w-[220px] flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search employee or period" className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr>{['Employee', 'Period', 'Structure', 'Gross', 'Net', 'Status', ''].map((h) => <th key={h || 'a'} className="px-3 py-2">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2"><p className="font-medium">{s.name}</p><p className="text-xs text-gray-500">{s.employeeId} · {s.designation}</p></td>
                  <td className="px-3 py-2">{s.period}</td>
                  <td className="px-3 py-2 text-xs">{s.structure}</td>
                  <td className="px-3 py-2">{inr(s.gross)}</td>
                  <td className="px-3 py-2 font-semibold">{inr(s.net)}</td>
                  <td className="px-3 py-2"><Badge variant={s.status === 'Published' ? 'success' : s.status === 'Submitted' ? 'info' : 'warning'}>{s.status}</Badge></td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      <Button size="xs" variant="ghost" onClick={() => setOpen(s)}><Eye className="h-3.5 w-3.5" />Preview</Button>
                      <Button size="xs" variant="ghost" onClick={() => flash(`PDF downloaded for ${s.name}.`)}><Download className="h-3.5 w-3.5" />PDF</Button>
                      <Button size="xs" variant="ghost" onClick={() => window.print()}><Printer className="h-3.5 w-3.5" />Print</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={Boolean(open)}
        onClose={() => setOpen(null)}
        title="Salary slip"
        size="xl"
        footer={open && (
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(null)}>Close</Button>
            <Button variant="outline" onClick={() => flash(`PDF downloaded for ${open.name}.`)}><Download className="h-4 w-4" />Download PDF</Button>
            <Button variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4" />Print</Button>
            {open.status === 'Draft' && <Button onClick={() => { patch(open.id, 'Submitted'); flash('Slip submitted. Amounts stay as calculated in payroll.'); }}>Submit</Button>}
            {open.status !== 'Published' && <Button variant="outline" onClick={() => { patch(open.id, 'Published'); flash('Published to staff portal.'); }}><Send className="h-4 w-4" />Publish to Staff Portal</Button>}
          </div>
        )}
      >
        {open && (
          <div className="space-y-4 text-sm">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">E</div>
                <div>
                  <p className="font-bold text-gray-900">EduManager School</p>
                  <p className="text-xs text-gray-500">{open.branch} · Salary slip</p>
                </div>
              </div>
              <Badge variant={open.status === 'Published' ? 'success' : open.status === 'Submitted' ? 'info' : 'warning'}>{open.status}</Badge>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              <p><span className="text-gray-500">Employee</span><br /><b>{open.name}</b> · {open.employeeId}</p>
              <p><span className="text-gray-500">Department / designation</span><br />{open.department} · {open.designation}</p>
              <p><span className="text-gray-500">Pay period</span><br />{open.period}</p>
              <p><span className="text-gray-500">Salary structure</span><br />{open.structure}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 rounded-lg bg-gray-50 p-3 text-xs md:grid-cols-5">
              <div>Working days<br /><b>{open.workingDays}</b></div>
              <div>Present<br /><b>{open.present}</b></div>
              <div>Paid leave<br /><b>{open.paidLeave}</b></div>
              <div>Unpaid leave<br /><b>{open.unpaidLeave}</b></div>
              <div>Holidays<br /><b>{open.holidays}</b></div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-gray-500">Earnings</p>
                {open.earnings.map((row) => (
                  <div key={row.name} className="flex justify-between py-1"><span>{row.name}</span><span>{inr(row.amount)}</span></div>
                ))}
                <div className="mt-1 flex justify-between border-t pt-1 font-semibold"><span>Gross pay</span><span>{inr(open.gross)}</span></div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-gray-500">Deductions</p>
                {open.deductions.map((row) => (
                  <div key={row.name} className="flex justify-between py-1"><span>{row.name}</span><span>{inr(row.amount)}</span></div>
                ))}
                <div className="mt-1 flex justify-between border-t pt-1 font-semibold"><span>Net pay</span><span>{inr(open.net)}</span></div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-100 p-3 text-xs text-gray-600">
              Payment: {open.paymentMode} · {open.bank} · {open.account}
            </div>
            <p className="text-xs text-gray-500">Figures come from payroll run PE-2026-10. This slip does not recalculate independently.</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default EmployeePayslipList;
