import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  TAX_STAFF,
  type DeclarationRec,
  computeEmployeeTax,
  flattenProofLines,
  inr,
  loadActivity,
  loadDeclarations,
  loadProofs,
  logActivity
} from './taxRecords';

export function InvestmentDeclarationStatus() {
  const navigate = useNavigate();
  const [fy, setFy] = useState('AY-2026-27');
  const [search, setSearch] = useState('');
  const [comment, setComment] = useState('');
  const [notice, setNotice] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const decls = loadDeclarations();
  const proofs = loadProofs();
  const activity = loadActivity();

  const rows = useMemo(() => TAX_STAFF.map((emp) => {
    const decl = decls.filter((d) => d.employeeId === emp.id && d.periodId === fy && d.status !== 'Cancelled').sort((a, b) => (a.status === 'Submitted' ? -1 : 1))[0] as DeclarationRec | undefined;
    const empProofs = proofs.filter((p) => p.employeeId === emp.id && p.periodId === fy);
    const lines = flattenProofLines(empProofs);
    const declared = decl ? decl.rows.reduce((s, r) => s + r.declared, 0) : 0;
    const submitted = lines.reduce((s, l) => s + l.row.submittedAmount, 0);
    const verified = lines.reduce((s, l) => s + l.row.verifiedAmount, 0);
    const pending = Math.max(0, submitted - verified);
    const proofStatus = !empProofs.length ? 'None' : lines.every((l) => l.row.status === 'Verified') ? 'Complete' : submitted ? 'Partial / pending' : 'None';
    const tax = computeEmployeeTax(emp.id, fy);
    return { emp, decl, declared, submitted, verified, pending, proofStatus, tax, declStatus: decl?.status || 'Not started' };
  }), [decls, proofs, fy]);

  const visible = rows.filter((r) => !search || `${r.emp.name} ${r.emp.id}`.toLowerCase().includes(search.toLowerCase()));
  const kpis = {
    total: TAX_STAFF.length,
    submitted: rows.filter((r) => r.declStatus === 'Submitted').length,
    none: rows.filter((r) => r.declStatus === 'Not started').length,
    draft: rows.filter((r) => r.declStatus === 'Draft').length,
    pendingProof: rows.filter((r) => r.proofStatus !== 'Complete' && r.declStatus === 'Submitted').length,
    completeProof: rows.filter((r) => r.proofStatus === 'Complete').length
  };

  const sendReminder = (id: string) => {
    const emp = TAX_STAFF.find((e) => e.id === id);
    if (!emp) return;
    logActivity({ employeeId: emp.id, employeeName: emp.name, action: 'Reminder sent', actor: 'HR', remarks: 'Please complete declaration / proofs' });
    setNotice(`Reminder recorded for ${emp.name} (frontend only — no email gateway).`);
  };

  const addComment = () => {
    if (!selected || !comment.trim()) return;
    const emp = TAX_STAFF.find((e) => e.id === selected);
    if (!emp) return;
    logActivity({ employeeId: emp.id, employeeName: emp.name, action: 'Comment added', actor: 'HR', remarks: comment });
    setComment('');
    setNotice('Comment stored in activity history.');
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Investment Declaration Monitoring Dashboard</h1>
        <p className="text-sm text-gray-500">Reads canonical declaration and proof stores — it does not keep a second employee dataset.</p>
      </div>
      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}
      <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
        {[
          ['Employees', kpis.total],
          ['Submitted', kpis.submitted],
          ['Not submitted', kpis.none],
          ['Draft', kpis.draft],
          ['Proof pending', kpis.pendingProof],
          ['Proof complete', kpis.completeProof]
        ].map(([l, n]) => <Card key={String(l)}><div className="p-4"><p className="text-xs text-gray-500">{l}</p><p className="text-2xl font-semibold">{n}</p></div></Card>)}
      </div>
      <div className="flex flex-wrap gap-2">
        <Input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select options={[{ value: 'AY-2026-27', label: 'AY 2026-27' }]} value={fy} onChange={(e) => setFy(typeof e === 'string' ? e : e.target.value)} />
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500"><tr><th className="px-3 py-2">Employee</th><th className="px-3 py-2">Dept / designation</th><th className="px-3 py-2">FY</th><th className="px-3 py-2">Regime</th><th className="px-3 py-2">Declaration</th><th className="px-3 py-2">Declared</th><th className="px-3 py-2">Submitted proof</th><th className="px-3 py-2">Verified</th><th className="px-3 py-2">Pending proof</th><th className="px-3 py-2">Tax (verified)</th><th className="px-3 py-2">Actions</th></tr></thead>
            <tbody>
              {visible.map((r) => (
                <tr key={r.emp.id} className="border-t">
                  <td className="px-3 py-2">{r.emp.name}<p className="text-xs text-gray-400">{r.emp.id}</p></td>
                  <td className="px-3 py-2">{r.emp.department}<p className="text-xs text-gray-400">{r.emp.designation} · {r.emp.branch}</p></td>
                  <td className="px-3 py-2">{fy}</td>
                  <td className="px-3 py-2">{r.emp.regime || r.decl?.regime || '—'}</td>
                  <td className="px-3 py-2"><Badge variant={r.declStatus === 'Submitted' ? 'success' : r.declStatus === 'Draft' ? 'warning' : 'secondary'}>{r.declStatus}</Badge></td>
                  <td className="px-3 py-2">{inr(r.declared)}</td>
                  <td className="px-3 py-2">{inr(r.submitted)}</td>
                  <td className="px-3 py-2">{inr(r.verified)}</td>
                  <td className="px-3 py-2">{inr(r.pending)}</td>
                  <td className="px-3 py-2">{inr(r.tax.finalAnnualTax)}</td>
                  <td className="px-3 py-2 space-x-2 whitespace-nowrap">
                    <button type="button" className="text-indigo-700" onClick={() => navigate('/hr/income-tax/employee-tax-exemption-declaration')}>Declaration</button>
                    <button type="button" className="text-indigo-700" onClick={() => navigate('/hr/income-tax/employee-tax-exemption-proof-submission')}>Proofs</button>
                    <button type="button" className="text-indigo-700" onClick={() => navigate('/hr/income-tax/employee-tax-profile-regime-selection')}>Profile</button>
                    <button type="button" className="text-indigo-700" onClick={() => sendReminder(r.emp.id)}>Remind</button>
                    <button type="button" className="text-indigo-700" onClick={() => setSelected(r.emp.id)}>Comment</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {selected && (
        <Card title={`Comment · ${selected}`}>
          <div className="flex gap-2 p-4">
            <Input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="HR comment" />
            <Button onClick={addComment}>Save comment</Button>
            <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
          </div>
        </Card>
      )}
      <Card title="Activity history">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500"><tr><th className="px-3 py-2">When</th><th className="px-3 py-2">Employee</th><th className="px-3 py-2">Action</th><th className="px-3 py-2">Actor</th><th className="px-3 py-2">Remarks</th></tr></thead>
          <tbody>
            {activity.slice(0, 40).map((a) => (
              <tr key={a.id} className="border-t"><td className="px-3 py-2">{a.at.slice(0, 16).replace('T', ' ')}</td><td className="px-3 py-2">{a.employeeName}</td><td className="px-3 py-2">{a.action}</td><td className="px-3 py-2">{a.actor}</td><td className="px-3 py-2">{a.remarks}</td></tr>
            ))}
            {!activity.length && <tr><td colSpan={5} className="px-3 py-8 text-center text-gray-500">No activity yet.</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default InvestmentDeclarationStatus;
