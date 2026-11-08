import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { CheckCircle, Eye, X } from 'lucide-react';
import {
  type ProofLine,
  type ProofRec,
  type ProofStatus,
  appendHistory,
  computeEmployeeTax,
  flattenProofLines,
  inr,
  loadHistory,
  loadProofs,
  logActivity,
  saveProofs
} from './taxRecords';

type Tab = 'pending' | 'verified' | 'partial' | 'rejected' | 'history';

const statusOf = (row: ProofLine, parent: ProofRec): ProofStatus => {
  if (row.status && row.status !== 'Submitted') return row.status;
  if (parent.status === 'Draft') return 'Draft';
  return 'Pending Verification';
};

export function ProofVerificationStatus() {
  const [proofs, setProofs] = useState<ProofRec[]>(() => loadProofs());
  const [tab, setTab] = useState<Tab>('pending');
  const [fy, setFy] = useState('AY-2026-27');
  const [dept, setDept] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [drawer, setDrawer] = useState<{ proof: ProofRec; row: ProofLine; mode: 'preview' | 'verify' } | null>(null);
  const [verifiedAmt, setVerifiedAmt] = useState(0);
  const [remarks, setRemarks] = useState('');
  const [reason, setReason] = useState('');
  const [notice, setNotice] = useState('');
  const [confirmBulk, setConfirmBulk] = useState<'approve' | 'reject' | null>(null);
  const history = loadHistory();

  const lines = useMemo(() => flattenProofLines(proofs).map(({ proof, row }) => ({ proof, row, status: statusOf(row, proof) })), [proofs]);
  const filtered = lines.filter(({ proof, row, status }) => {
    if (fy && proof.periodId !== fy) return false;
    if (dept !== 'all' && proof.department !== dept) return false;
    if (search && !`${proof.employeeName} ${proof.employeeId} ${row.sub} ${proof.id}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (tab === 'pending') return status === 'Pending Verification' || status === 'Submitted' || status === 'Resubmission Required';
    if (tab === 'verified') return status === 'Verified';
    if (tab === 'partial') return status === 'Partially Verified';
    if (tab === 'rejected') return status === 'Rejected';
    return true;
  });

  const persist = (next: ProofRec[]) => {
    setProofs(next);
    saveProofs(next);
  };

  const applyLine = (proofId: string, lineId: string, patch: Partial<ProofLine>, historyNote: { previous: string; next: string; amount: number; remarks: string; reason: string }) => {
    const next = proofs.map((p) => p.id !== proofId ? p : {
      ...p,
      rows: p.rows.map((r) => r.id !== lineId ? r : { ...r, ...patch }),
      status: 'Pending Verification'
    }).map((p) => {
      if (p.id !== proofId) return p;
      const statuses = p.rows.map((r) => r.status);
      let status: ProofStatus = 'Pending Verification';
      if (statuses.every((s) => s === 'Verified')) status = 'Verified';
      else if (statuses.some((s) => s === 'Partially Verified') && !statuses.some((s) => s === 'Pending Verification' || s === 'Submitted')) status = 'Partially Verified';
      else if (statuses.every((s) => s === 'Rejected')) status = 'Rejected';
      else if (statuses.some((s) => s === 'Resubmission Required')) status = 'Resubmission Required';
      return { ...p, status };
    });
    persist(next);
    appendHistory({ proofId, lineId, previousStatus: historyNote.previous, newStatus: historyNote.next, verifiedAmount: historyNote.amount, reviewer: 'HR Admin', remarks: historyNote.remarks, rejectionReason: historyNote.reason });
  };

  const openVerify = (proof: ProofRec, row: ProofLine, mode: 'preview' | 'verify') => {
    setDrawer({ proof, row, mode });
    setVerifiedAmt(row.submittedAmount);
    setRemarks(row.remarks);
    setReason(row.rejectReason);
  };

  const approve = (kind: 'full' | 'partial') => {
    if (!drawer) return;
    const { proof, row } = drawer;
    if (verifiedAmt > row.submittedAmount) { setNotice('Verified amount cannot exceed submitted amount.'); return; }
    if (verifiedAmt > row.declared) { setNotice('Verified amount cannot exceed declared / eligible amount.'); return; }
    if (kind === 'partial' && !remarks.trim()) { setNotice('Partial approval requires an explanation.'); return; }
    const rejected = Math.max(0, row.submittedAmount - verifiedAmt);
    const status: ProofStatus = verifiedAmt <= 0 ? 'Rejected' : (verifiedAmt < row.submittedAmount ? 'Partially Verified' : 'Verified');
    applyLine(proof.id, row.id, { verifiedAmount: verifiedAmt, rejectedAmount: rejected, status, remarks, rejectReason: kind === 'partial' ? remarks : '' }, { previous: row.status, next: status, amount: verifiedAmt, remarks, reason: '' });
    logActivity({ employeeId: proof.employeeId, employeeName: proof.employeeName, action: status, actor: 'HR Admin', remarks: `${row.sub} ${inr(verifiedAmt)}`, ref: proof.id });
    setNotice(`${row.sub}: ${status}.`);
    setDrawer(null);
  };

  const reject = () => {
    if (!drawer) return;
    if (!reason.trim()) { setNotice('A rejection reason is mandatory.'); return; }
    const { proof, row } = drawer;
    applyLine(proof.id, row.id, { verifiedAmount: 0, rejectedAmount: row.submittedAmount, status: 'Rejected', rejectReason: reason, remarks }, { previous: row.status, next: 'Rejected', amount: 0, remarks, reason });
    logActivity({ employeeId: proof.employeeId, employeeName: proof.employeeName, action: 'Proof rejected', actor: 'HR Admin', remarks: reason, ref: proof.id });
    setNotice(`${row.sub} rejected.`);
    setDrawer(null);
  };

  const bulkEligible = filtered.filter(({ status }) => status === 'Pending Verification' || status === 'Submitted');
  const runBulk = (action: 'approve' | 'reject') => {
    const chosen = bulkEligible.filter(({ row }) => selected.includes(row.id));
    if (action === 'reject' && !reason.trim()) { setNotice('Bulk reject requires a reason.'); return; }
    chosen.forEach(({ proof, row }) => {
      if (action === 'approve') {
        applyLine(proof.id, row.id, { verifiedAmount: row.submittedAmount, rejectedAmount: 0, status: 'Verified', remarks: 'Bulk approve' }, { previous: row.status, next: 'Verified', amount: row.submittedAmount, remarks: 'Bulk approve', reason: '' });
      } else {
        applyLine(proof.id, row.id, { verifiedAmount: 0, rejectedAmount: row.submittedAmount, status: 'Rejected', rejectReason: reason }, { previous: row.status, next: 'Rejected', amount: 0, remarks: 'Bulk reject', reason });
      }
    });
    setSelected([]);
    setConfirmBulk(null);
    setNotice(`Bulk ${action} applied to ${chosen.length} line(s).`);
  };

  const kpis = {
    pending: lines.filter((l) => l.status === 'Pending Verification' || l.status === 'Submitted').length,
    verified: lines.filter((l) => l.status === 'Verified').length,
    partial: lines.filter((l) => l.status === 'Partially Verified').length,
    rejected: lines.filter((l) => l.status === 'Rejected').length
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'pending', label: `Pending (${kpis.pending})` },
    { id: 'verified', label: `Verified (${kpis.verified})` },
    { id: 'partial', label: `Partially verified (${kpis.partial})` },
    { id: 'rejected', label: `Rejected (${kpis.rejected})` },
    { id: 'history', label: 'Verification history' }
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Proof Verification Status</h1>
        <p className="text-sm text-gray-500">HR reviews employee proof submissions. Verified amounts feed the shared tax engine.</p>
      </div>
      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}
      <div className="grid gap-3 md:grid-cols-4">
        {[['Pending', kpis.pending], ['Verified', kpis.verified], ['Partial', kpis.partial], ['Rejected', kpis.rejected]].map(([l, n]) => (
          <Card key={String(l)}><div className="p-4"><p className="text-xs text-gray-500">{l}</p><p className="text-2xl font-semibold">{n}</p></div></Card>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 border-b">
        {tabs.map((t) => <button key={t.id} type="button" className={`px-3 py-2 text-sm font-medium border-b-2 ${tab === t.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`} onClick={() => setTab(t.id)}>{t.label}</button>)}
      </div>
      <div className="flex flex-wrap gap-2">
        <Input placeholder="Search employee / proof / category" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select options={[{ value: 'AY-2026-27', label: 'AY 2026-27' }, { value: 'AY-2025-26', label: 'AY 2025-26' }]} value={fy} onChange={(e) => setFy(typeof e === 'string' ? e : e.target.value)} />
        <Select options={[{ value: 'all', label: 'All departments' }, { value: 'Science', label: 'Science' }, { value: 'Mathematics', label: 'Mathematics' }, { value: 'Administration', label: 'Administration' }]} value={dept} onChange={(e) => setDept(typeof e === 'string' ? e : e.target.value)} />
      </div>

      {tab !== 'history' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-3 py-2"><input type="checkbox" onChange={(e) => setSelected(e.target.checked ? filtered.map(({ row }) => row.id) : [])} /></th>
                  <th className="px-3 py-2">Proof ID</th><th className="px-3 py-2">Employee</th><th className="px-3 py-2">Company / branch</th>
                  <th className="px-3 py-2">FY</th><th className="px-3 py-2">Declaration</th><th className="px-3 py-2">Section</th>
                  <th className="px-3 py-2">Declared</th><th className="px-3 py-2">Submitted</th><th className="px-3 py-2">Verified</th>
                  <th className="px-3 py-2">Date</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(({ proof, row, status }) => (
                  <tr key={`${proof.id}-${row.id}`} className="border-t">
                    <td className="px-3 py-2"><input type="checkbox" checked={selected.includes(row.id)} onChange={(e) => setSelected((s) => e.target.checked ? [...s, row.id] : s.filter((id) => id !== row.id))} /></td>
                    <td className="px-3 py-2">{proof.id}</td>
                    <td className="px-3 py-2">{proof.employeeName}<p className="text-xs text-gray-400">{proof.employeeId}</p></td>
                    <td className="px-3 py-2">{proof.company} · {proof.branch}</td>
                    <td className="px-3 py-2">{proof.periodId}</td>
                    <td className="px-3 py-2">{proof.declarationId}</td>
                    <td className="px-3 py-2">{row.category}<p className="text-xs text-gray-400">{row.sub}</p></td>
                    <td className="px-3 py-2">{inr(row.declared)}</td>
                    <td className="px-3 py-2">{inr(row.submittedAmount)}</td>
                    <td className="px-3 py-2">{inr(row.verifiedAmount)}</td>
                    <td className="px-3 py-2">{proof.submittedOn}</td>
                    <td className="px-3 py-2"><Badge variant={status === 'Verified' ? 'success' : status === 'Rejected' ? 'danger' : 'warning'}>{status}</Badge></td>
                    <td className="px-3 py-2 space-x-2">
                      <button type="button" className="text-indigo-700" onClick={() => openVerify(proof, row, 'preview')}><Eye className="inline h-4 w-4" /></button>
                      {(status === 'Pending Verification' || status === 'Submitted' || status === 'Resubmission Required') && <button type="button" className="text-emerald-700" onClick={() => openVerify(proof, row, 'verify')}>Review</button>}
                    </td>
                  </tr>
                ))}
                {!filtered.length && <tr><td colSpan={13} className="px-3 py-8 text-center text-gray-500">No proofs in this view. Employees submit from Tax Exemption Proof Submission.</td></tr>}
              </tbody>
            </table>
          </div>
          {tab === 'pending' && selected.length > 0 && (
            <div className="flex flex-wrap gap-2 border-t p-3">
              <Button size="sm" onClick={() => setConfirmBulk('approve')}>Bulk approve eligible</Button>
              <Button size="sm" variant="outline" onClick={() => setConfirmBulk('reject')}>Bulk reject (reason required)</Button>
            </div>
          )}
        </Card>
      )}

      {tab === 'history' && (
        <Card>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500"><tr><th className="px-3 py-2">Proof</th><th className="px-3 py-2">From</th><th className="px-3 py-2">To</th><th className="px-3 py-2">Amount</th><th className="px-3 py-2">Reviewer</th><th className="px-3 py-2">Date</th><th className="px-3 py-2">Remarks</th></tr></thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id} className="border-t">
                  <td className="px-3 py-2">{h.proofId}</td>
                  <td className="px-3 py-2">{h.previousStatus}</td>
                  <td className="px-3 py-2">{h.newStatus}</td>
                  <td className="px-3 py-2">{inr(h.verifiedAmount)}</td>
                  <td className="px-3 py-2">{h.reviewer}</td>
                  <td className="px-3 py-2">{h.reviewDate.slice(0, 16).replace('T', ' ')}</td>
                  <td className="px-3 py-2">{h.remarks} {h.rejectionReason}</td>
                </tr>
              ))}
              {!history.length && <tr><td colSpan={7} className="px-3 py-8 text-center text-gray-500">No verification history yet. History is appended, never overwritten.</td></tr>}
            </tbody>
          </table>
        </Card>
      )}

      {confirmBulk && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-lg">
            <div className="space-y-3 p-4">
              <h3 className="font-semibold">Confirm bulk {confirmBulk}</h3>
              <p className="text-sm">{selected.length} selected · submitted {inr(filtered.filter((x) => selected.includes(x.row.id)).reduce((s, x) => s + x.row.submittedAmount, 0))}</p>
              <p className="text-xs text-amber-800">Bulk approve is only for pending lines with documents. Prefer individual review for HRA / high-value proofs.</p>
              {confirmBulk === 'reject' && <Input label="Rejection reason *" value={reason} onChange={(e) => setReason(e.target.value)} />}
              <div className="flex gap-2">
                <Button onClick={() => runBulk(confirmBulk)}>{confirmBulk === 'approve' ? 'Confirm approve' : 'Confirm reject'}</Button>
                <Button variant="outline" onClick={() => setConfirmBulk(null)}>Cancel</Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {drawer && (
        <div className="fixed inset-y-0 right-0 z-40 w-full max-w-md overflow-y-auto border-l bg-white shadow-xl">
          <div className="flex items-center justify-between border-b p-4">
            <h3 className="font-semibold">{drawer.mode === 'preview' ? 'Document preview' : 'Verify proof'}</h3>
            <button type="button" onClick={() => setDrawer(null)}><X className="h-4 w-4" /></button>
          </div>
          <div className="space-y-3 p-4 text-sm">
            <p>{drawer.proof.employeeName} · {drawer.proof.employeeId}</p>
            <p>{drawer.proof.company} · {drawer.proof.branch} · {drawer.proof.periodId}</p>
            <p>Declaration {drawer.proof.declarationId}</p>
            <p>Category {drawer.row.category} / {drawer.row.sub}</p>
            <p>Declared {inr(drawer.row.declared)} · Submitted {inr(drawer.row.submittedAmount)}</p>
            <p>Document {drawer.row.fileName || '—'} ({drawer.row.docType}) ref {drawer.row.refNo || '—'}</p>
            <div className="rounded-lg border bg-slate-50 p-6 text-center text-gray-500">Preview: {drawer.row.fileName || 'No file uploaded'} (frontend mock)</div>
            <p className="text-xs text-gray-500">Live tax if this line is ignored: {inr(computeEmployeeTax(drawer.proof.employeeId, drawer.proof.periodId).finalAnnualTax)}</p>
            {drawer.mode === 'verify' && (
              <>
                <Input label="Verified amount" type="number" value={verifiedAmt} onChange={(e) => setVerifiedAmt(Number(e.target.value) || 0)} />
                <p className="text-xs">Unverified difference {inr(Math.max(0, drawer.row.submittedAmount - verifiedAmt))}</p>
                <Input label="Remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
                <Input label="Rejection reason (required to reject)" value={reason} onChange={(e) => setReason(e.target.value)} />
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => approve('full')}><CheckCircle className="mr-1 h-4 w-4" />Approve</Button>
                  <Button variant="outline" onClick={() => approve('partial')}>Partial approve</Button>
                  <Button variant="outline" onClick={reject}>Reject</Button>
                </div>
              </>
            )}
            <div>
              <p className="font-medium">Previous history</p>
              {history.filter((h) => h.proofId === drawer.proof.id).slice(0, 8).map((h) => (
                <p key={h.id} className="text-xs text-gray-600">{h.reviewDate.slice(0, 10)} {h.previousStatus} → {h.newStatus} {inr(h.verifiedAmount)} {h.remarks}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProofVerificationStatus;
