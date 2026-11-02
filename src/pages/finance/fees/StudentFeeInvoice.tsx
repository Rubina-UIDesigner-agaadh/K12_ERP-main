import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Toggle } from '../../../components/ui/Toggle';
import { Modal } from '../../../components/ui/Modal';
import { Textarea } from '../../../components/ui/Textarea';
import { AlertTriangle, Ban, BookOpen, FileText, Printer, Receipt, Save, Search, Send, User } from 'lucide-react';
import { STUDENT_FEE_INVOICE_STORE, type StoredFeeInvoice } from '../../admin/masters/FeeCategoryInstallmentDueRulesMaster';

const TODAY = '2026-10-31';
const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const loadInvoices = (): StoredFeeInvoice[] => {
  try {
    const raw = localStorage.getItem(STUDENT_FEE_INVOICE_STORE);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};
const saveInvoices = (rows: StoredFeeInvoice[]) => localStorage.setItem(STUDENT_FEE_INVOICE_STORE, JSON.stringify(rows));

const SEED: StoredFeeInvoice[] = [
  {
    id: 'INV-2025-06-00412',
    scheduleId: 'SCH-G6-T1',
    studentId: 'STU009',
    studentName: 'Kabir Mehta',
    parentName: 'Nilesh Mehta',
    grade: '6',
    section: 'A',
    academicYear: '2025-26',
    academicTerm: 'Term 1',
    invoiceDate: '2025-06-10',
    dueDate: '2025-06-25',
    status: 'Overdue',
    lines: [
      { category: 'Tuition', description: 'Term tuition fee', original: 9000, discount: 1000, tax: 0, net: 8000 },
      { category: 'Transport', description: 'School bus', original: 1500, discount: 0, tax: 0, net: 1500 },
      { category: 'Exam', description: 'Term examination fee', original: 500, discount: 0, tax: 225, net: 725 }
    ],
    paid: 0,
    lateFinePerDay: 50,
    includeLateFine: false,
    installments: [
      { name: '1st Installment', dueDate: '2025-04-15', amount: 3741, status: 'Paid' },
      { name: '2nd Installment', dueDate: '2025-07-15', amount: 3742, status: 'Pending' },
      { name: '3rd Installment', dueDate: '2025-10-15', amount: 3742, status: 'Pending' }
    ],
    payments: [],
    scholarship: 1500
  }
];

const statusVariant = (status: StoredFeeInvoice['status']): 'secondary' | 'primary' | 'success' | 'warning' | 'danger' => {
  if (status === 'Paid') return 'success';
  if (status === 'Submitted') return 'primary';
  if (status === 'Partially Paid') return 'warning';
  if (status === 'Overdue' || status === 'Cancelled') return 'danger';
  return 'secondary';
};

const daysOverdue = (due: string) => {
  const a = new Date(`${due}T00:00:00`);
  const b = new Date(`${TODAY}T00:00:00`);
  return Math.max(0, Math.round((b.getTime() - a.getTime()) / 86400000));
};

export function StudentFeeInvoice() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<StoredFeeInvoice[]>(() => {
    const stored = loadInvoices();
    return stored.length ? stored : SEED;
  });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentId, setCurrentId] = useState('');
  const [notice, setNotice] = useState('');
  const [scholarshipOpen, setScholarshipOpen] = useState(false);
  const [scholarshipAmt, setScholarshipAmt] = useState('0');
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [creditOpen, setCreditOpen] = useState(false);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('invoice') || '';
    if (id) setCurrentId(id);
  }, []);

  const persist = (next: StoredFeeInvoice[], message?: string) => {
    setRows(next);
    saveInvoices(next);
    if (message) setNotice(message);
  };

  const invoice = rows.find((item) => item.id === currentId) || null;
  const patch = (partial: Partial<StoredFeeInvoice>, message?: string) => {
    if (!invoice) return;
    persist(rows.map((item) => item.id === invoice.id ? { ...item, ...partial } : item), message);
  };

  const filtered = rows.filter((item) => {
    if (statusFilter !== 'All' && item.status !== statusFilter) return false;
    if (search && !(`${item.id} ${item.studentId} ${item.studentName}`.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  const totals = useMemo(() => {
    if (!invoice) return { sub: 0, discount: 0, tax: 0, due: 0, paid: 0, late: 0, balance: 0, days: 0 };
    const sub = invoice.lines.reduce((sum, line) => sum + line.original, 0);
    const discount = invoice.lines.reduce((sum, line) => sum + line.discount, 0) + invoice.scholarship;
    const tax = invoice.lines.reduce((sum, line) => sum + line.tax, 0);
    const due = invoice.lines.reduce((sum, line) => sum + line.net, 0);
    const days = invoice.status === 'Overdue' || invoice.dueDate < TODAY ? daysOverdue(invoice.dueDate) : 0;
    const late = days > 0 ? days * invoice.lateFinePerDay : 0;
    const charged = due + (invoice.includeLateFine ? late : 0);
    return { sub, discount, tax, due, paid: invoice.paid, late, balance: Math.max(0, charged - invoice.paid), days };
  }, [invoice]);

  const submitInvoice = () => {
    if (!invoice || invoice.status !== 'Draft') return;
    const overdue = invoice.dueDate < TODAY;
    patch({ status: overdue ? 'Overdue' : 'Submitted' }, 'Invoice submitted. Ledger effect posted from accounts on the document — you do not enter debit/credit lines yourself.');
  };

  const applyScholarship = () => {
    if (!invoice || invoice.status !== 'Draft') return;
    const amount = Number(scholarshipAmt) || 0;
    const lines = invoice.lines.map((line, index) => index === 0 ? { ...line, discount: line.discount + amount, net: Math.max(0, line.net - amount) } : line);
    patch({ lines, scholarship: invoice.scholarship + amount }, `Scholarship / waiver of ${inr(amount)} applied.`);
    setScholarshipOpen(false);
  };

  const addLateFine = () => {
    if (!invoice) return;
    patch({ includeLateFine: true, status: invoice.status === 'Draft' ? invoice.status : 'Overdue' }, 'Late fine added to balance due.');
  };

  const cancelInvoice = () => {
    if (!cancelReason.trim()) { setNotice('A cancellation reason is required.'); return; }
    patch({ status: 'Cancelled' }, `Invoice cancelled. Ledger reversed. Reason: ${cancelReason}`);
    setCancelOpen(false);
  };

  if (!invoice) {
    return (
      <div className="space-y-6 p-6">
        {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs text-gray-400">Finance &gt; Fees &gt; Student Fee Invoice</p>
            <h1 className="text-2xl font-bold text-gray-900">Student Fee Invoice</h1>
            <p className="text-sm text-gray-500">Primary billing document for each student. Payments post against the student ledger.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/finance/fees/fee-category-installment-due-rules-master')}>Fee Schedules</Button>
            <Button variant="outline" onClick={() => navigate('/finance/fees/fee-receipt')}>Record Payment</Button>
          </div>
        </div>
        <Card>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {['All', 'Draft', 'Submitted', 'Paid', 'Partially Paid', 'Overdue', 'Cancelled'].map((item) => (
              <button key={item} type="button" onClick={() => setStatusFilter(item)} className={`rounded-lg border px-3 py-1.5 text-sm ${statusFilter === item ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300'}`}>{item}</button>
            ))}
            <div className="relative min-w-[220px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search invoice, student ID or name" className="h-9 w-full rounded-lg border border-gray-300 pl-9 pr-3 text-sm" />
            </div>
          </div>
          {filtered.length === 0 ? (
            <p className="p-6 text-sm text-gray-500">No invoices yet. Generate them from a submitted Fee Schedule.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-3 py-3 text-left">Invoice</th>
                    <th className="px-3 py-3 text-left">Student</th>
                    <th className="px-3 py-3">Period</th>
                    <th className="px-3 py-3">Due date</th>
                    <th className="px-3 py-3">Net</th>
                    <th className="px-3 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr key={row.id} className="border-t hover:bg-gray-50">
                      <td className="px-3 py-3">
                        <button type="button" className="font-medium text-indigo-700 hover:underline" onClick={() => setCurrentId(row.id)}>{row.id}</button>
                      </td>
                      <td className="px-3 py-3">{row.studentName}<p className="text-xs text-gray-500">{row.studentId}</p></td>
                      <td className="px-3 py-3 text-center">{row.academicYear} {row.academicTerm}</td>
                      <td className="px-3 py-3 text-center">{row.dueDate}</td>
                      <td className="px-3 py-3 text-center">{inr(row.lines.reduce((sum, line) => sum + line.net, 0) - row.paid)}</td>
                      <td className="px-3 py-3 text-center"><Badge variant={statusVariant(row.status)}>{row.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    );
  }

  const unpaid = invoice.status === 'Submitted' && invoice.paid === 0;
  const canRecord = invoice.status !== 'Draft' && invoice.status !== 'Cancelled';

  return (
    <div className="space-y-6 p-6">
      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}
      <button type="button" className="text-sm text-indigo-600" onClick={() => setCurrentId('')}>← All invoices</button>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs text-gray-400">Finance &gt; Fees &gt; Student Fee Invoice</p>
          <h1 className="text-2xl font-bold text-gray-900">{invoice.id}</h1>
          <p className="text-sm text-gray-500">Primary billing document. Ledger postings are created from this document, not entered by hand.</p>
        </div>
        <Badge variant={statusVariant(invoice.status)}>{invoice.status}</Badge>
      </div>

      <Card title="Invoice header">
        <div className="grid gap-4 md:grid-cols-3">
          <Input label="Invoice number" value={invoice.id} readOnly />
          <Input label="Student ID" value={invoice.studentId} readOnly />
          <Input label="Student name" value={invoice.studentName} readOnly />
          <Input label="Parent / guardian" value={invoice.parentName} readOnly />
          <Input label="Program / Grade / Section" value={`${invoice.grade} / ${invoice.section}`} readOnly />
          <Input label="Academic year" value={invoice.academicYear} readOnly />
          <Input label="Academic term" value={invoice.academicTerm} readOnly />
          <Input label="Invoice date" type="date" value={invoice.invoiceDate} onChange={(e) => patch({ invoiceDate: e.target.value })} />
          <Input label="Due date" type="date" value={invoice.dueDate} onChange={(e) => patch({ dueDate: e.target.value, status: e.target.value < TODAY && invoice.status !== 'Paid' && invoice.status !== 'Cancelled' ? 'Overdue' : invoice.status })} />
        </div>
      </Card>

      <Card title="Fee breakup">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-3 py-3 text-left">Fee category</th>
                <th className="px-3 py-3 text-left">Description</th>
                <th className="px-3 py-3">Original amount</th>
                <th className="px-3 py-3">Discount</th>
                <th className="px-3 py-3">Tax</th>
                <th className="px-3 py-3">Net amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lines.map((line, index) => (
                <tr key={`${line.category}-${index}`} className="border-t">
                  <td className="px-3 py-2">{line.category}</td>
                  <td className="px-3 py-2">{line.description}</td>
                  <td className="px-3 py-2 text-center">{inr(line.original)}</td>
                  <td className="px-3 py-2 text-center">{inr(line.discount)}</td>
                  <td className="px-3 py-2 text-center">{inr(line.tax)}</td>
                  <td className="px-3 py-2 text-center font-medium">{inr(line.net)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 ml-auto w-full max-w-sm space-y-1 rounded-lg bg-gray-50 p-4 font-mono text-sm">
          <div className="flex justify-between"><span>Sub-Total</span><span>{inr(totals.sub)}</span></div>
          <div className="flex justify-between"><span>Discount Applied</span><span>{inr(totals.discount)}</span></div>
          <div className="flex justify-between"><span>Tax (if any)</span><span>{inr(totals.tax)}</span></div>
          <div className="flex justify-between border-t pt-1 font-semibold"><span>Total Due</span><span>{inr(totals.due)}</span></div>
          <div className="flex justify-between"><span>Amount Paid</span><span>{inr(totals.paid)}</span></div>
          {invoice.includeLateFine && totals.late > 0 && <div className="flex justify-between text-amber-800"><span>Late fine</span><span>{inr(totals.late)}</span></div>}
          <div className="flex justify-between border-t pt-1 font-bold"><span>Balance Due</span><span>{inr(totals.balance)}</span></div>
        </div>
      </Card>

      <Card title="Payment history">
        {invoice.payments.length === 0 ? (
          <p className="text-sm text-gray-500">No payments recorded against this invoice.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-gray-500"><tr><th className="py-2 text-left">Date</th><th>Amount</th><th>Mode</th><th>Receipt No.</th><th>Recorded By</th><th></th></tr></thead>
            <tbody>
              {invoice.payments.map((row) => (
                <tr key={row.receiptNo} className="border-t">
                  <td className="py-2">{row.date}</td>
                  <td className="text-center">{inr(row.amount)}</td>
                  <td className="text-center">{row.mode}</td>
                  <td className="text-center">{row.receiptNo}</td>
                  <td className="text-center">{row.recordedBy}</td>
                  <td className="text-center"><Button size="xs" variant="outline" onClick={() => navigate('/finance/fees/fee-receipt')}>View Receipt</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {totals.days > 0 && invoice.status !== 'Cancelled' && invoice.status !== 'Paid' && (
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-amber-800">
              <AlertTriangle className="mr-1 inline h-4 w-4" />
              Late Fine: {inr(totals.late)} ({inr(invoice.lateFinePerDay)}/day × {totals.days} days)
            </p>
            <Toggle label="Include late fine in payment" checked={invoice.includeLateFine} onChange={(checked) => patch({ includeLateFine: checked })} />
          </div>
        </Card>
      )}

      <Card title="Installment plan">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-gray-500"><tr><th className="py-2 text-left">Installment</th><th>Due date</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>
            {invoice.installments.map((row) => (
              <tr key={row.name} className="border-t">
                <td className="py-2">{row.name}</td>
                <td className="text-center">{row.dueDate}</td>
                <td className="text-center">{inr(row.amount)}</td>
                <td className="text-center">{row.status === 'Paid' ? '✅ Paid' : '⏳ Pending'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {invoice.status !== 'Draft' && invoice.status !== 'Cancelled' && (
        <Card title="Ledger effect on submit">
          <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-100">{`Dr. Student Fees Receivable (Asset)    ${inr(totals.due)}
  Cr. Tuition Fee Income (Income)              ${inr(invoice.lines.find((l) => l.category === 'Tuition')?.net || 0)}
  Cr. Transport Fee Income (Income)            ${inr(invoice.lines.find((l) => l.category === 'Transport')?.net || 0)}
  Cr. Exam Fee Income (Income)                 ${inr(invoice.lines.find((l) => l.category === 'Exam')?.net || 0)}
  Cr. Tax Payable (if applicable)              ${inr(totals.tax)}`}</pre>
          <p className="mt-2 text-xs text-gray-500">Every submitted accounting transaction creates balanced debit and credit entries in the General Ledger. You create the business document; accounts and amounts create the ledger effect.</p>
        </Card>
      )}

      <div className="flex flex-wrap gap-2">
        {invoice.status === 'Draft' && <Button onClick={submitInvoice}><Save className="h-4 w-4 mr-1" />Submit Invoice</Button>}
        {canRecord && <Button onClick={() => navigate('/finance/fees/fee-receipt')}><Receipt className="h-4 w-4 mr-1" />Record Payment</Button>}
        <Button variant="outline" onClick={() => setNotice(`Invoice PDF and payment link emailed to ${invoice.parentName}.`)}><Send className="h-4 w-4 mr-1" />Send to Parent</Button>
        <Button variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4 mr-1" />Print Invoice</Button>
        {invoice.status === 'Draft' && <Button variant="outline" onClick={() => { setScholarshipAmt(String(invoice.scholarship || 1500)); setScholarshipOpen(true); }}>Apply Scholarship</Button>}
        {invoice.status === 'Overdue' && <Button variant="warning" onClick={addLateFine}>Add Late Fine</Button>}
        {unpaid && <Button variant="danger" onClick={() => setCancelOpen(true)}><Ban className="h-4 w-4 mr-1" />Cancel Invoice</Button>}
        {invoice.status === 'Paid' && <Button variant="outline" onClick={() => setCreditOpen(true)}>Create Credit Note</Button>}
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        <Button variant="ghost" onClick={() => navigate('/student/student-management/student-list')}><User className="h-4 w-4 mr-1" />View Student Profile</Button>
        <Button variant="ghost" onClick={() => navigate('/finance/ledgers/general-ledger')}><BookOpen className="h-4 w-4 mr-1" />View Ledger</Button>
        <Button variant="ghost" onClick={() => { setSearch(invoice.studentId); setCurrentId(''); }}><FileText className="h-4 w-4 mr-1" />View All Invoices for Student</Button>
      </div>

      <Modal isOpen={scholarshipOpen} onClose={() => setScholarshipOpen(false)} title="Apply scholarship / waiver" footer={
        <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setScholarshipOpen(false)}>Cancel</Button><Button onClick={applyScholarship}>Apply</Button></div>
      }>
        <Input label="Discount amount (₹)" type="number" value={scholarshipAmt} onChange={(e) => setScholarshipAmt(e.target.value)} />
        <p className="mt-2 text-xs text-gray-500">Draft invoices only. Applied as a waiver on the first fee line.</p>
      </Modal>

      <Modal isOpen={cancelOpen} onClose={() => setCancelOpen(false)} title="Cancel invoice" footer={
        <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setCancelOpen(false)}>Keep invoice</Button><Button variant="danger" onClick={cancelInvoice}>Cancel invoice</Button></div>
      }>
        <Textarea label="Reason *" rows={3} value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="Required. Reverses the ledger if the invoice was submitted and unpaid." />
      </Modal>

      <Modal isOpen={creditOpen} onClose={() => setCreditOpen(false)} title="Create credit note" footer={
        <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setCreditOpen(false)}>Close</Button><Button onClick={() => { setCreditOpen(false); setNotice(`Credit note CN-${invoice.id} issued for ${inr(invoice.paid)}.`); }}>Issue refund credit note</Button></div>
      }>
        <p className="text-sm text-gray-700">Issues a refund credit note against this paid invoice. The original invoice stays submitted; the credit note offsets the student ledger.</p>
      </Modal>
    </div>
  );
}

export default StudentFeeInvoice;
