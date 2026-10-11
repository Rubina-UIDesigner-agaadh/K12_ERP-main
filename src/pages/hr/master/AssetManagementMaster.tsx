import React, { useState } from 'react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { Select } from '../../../components/ui/Select';
import { Download, Package, Plus, Save } from 'lucide-react';

type Status = 'In Use' | 'Returned' | 'Damaged' | 'Missing';
type ReturnStatus = 'Returned' | 'Pending' | 'Damaged' | 'Missing';
type Condition = 'Good' | 'Fair' | 'Damaged' | 'Missing';

interface AssetRow {
  id: string;
  name: string;
  code: string;
  category: string;
  issued: string;
  status: Status;
  recovery: number;
  reason: string;
  returnStatus: ReturnStatus;
  condition: Condition;
  remarks: string;
}

const EMP = { id: 'EMP-2045', name: 'John Smith', lwd: '2026-10-31' };
const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
const fmt = (iso: string) => iso.split('-').reverse().join('-');

const SEED: AssetRow[] = [
  { id: '1', name: 'Laptop', code: 'AST-0021', category: 'IT Equipment', issued: '2018-08-12', status: 'In Use', recovery: 0, reason: '', returnStatus: 'Pending', condition: 'Good', remarks: '' },
  { id: '2', name: 'School ID', code: 'AST-0022', category: 'Identity Card', issued: '2018-08-12', status: 'In Use', recovery: 0, reason: '', returnStatus: 'Pending', condition: 'Good', remarks: '' },
  { id: '3', name: 'Access Card', code: 'AST-0023', category: 'Security', issued: '2019-01-01', status: 'In Use', recovery: 0, reason: '', returnStatus: 'Pending', condition: 'Good', remarks: '' },
  { id: '4', name: 'Projector', code: 'AST-0045', category: 'AV Equipment', issued: '2021-03-10', status: 'In Use', recovery: 0, reason: '', returnStatus: 'Pending', condition: 'Fair', remarks: '' },
  { id: '5', name: 'Uniform Set', code: 'AST-0078', category: 'Clothing', issued: '2018-08-12', status: 'Returned', recovery: 0, reason: '', returnStatus: 'Returned', condition: 'Good', remarks: 'Returned on joining anniversary' },
  { id: '6', name: 'Lab Keys', code: 'AST-0091', category: 'Keys', issued: '2020-06-05', status: 'In Use', recovery: 0, reason: '', returnStatus: 'Pending', condition: 'Good', remarks: '' }
];

export function AssetManagementMaster() {
  const [tab, setTab] = useState<'register' | 'return' | 'summary'>('register');
  const [rows, setRows] = useState<AssetRow[]>(SEED);
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [notice, setNotice] = useState<string | null>(null);
  const [viewRow, setViewRow] = useState<AssetRow | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [draft, setDraft] = useState({ name: '', code: '', category: 'IT Equipment', issued: new Date().toISOString().slice(0, 10) });
  const [verifier, setVerifier] = useState('Karan Patel');
  const [verifyDate, setVerifyDate] = useState(new Date().toISOString().slice(0, 10));
  const [otpOk, setOtpOk] = useState(false);

  const filtered = rows.filter((r) =>
    (category === 'All' || r.category === category) &&
    (status === 'All' || r.status === status) &&
    (!from || r.issued >= from) &&
    (!to || r.issued <= to)
  );
  const pending = rows.filter((r) => r.status === 'In Use' || r.returnStatus === 'Pending');
  const returned = rows.filter((r) => r.status === 'Returned').length;
  const damaged = rows.filter((r) => r.status === 'Damaged' || r.returnStatus === 'Damaged').length;
  const missing = rows.filter((r) => r.status === 'Missing' || r.returnStatus === 'Missing').length;
  const recoveryTotal = rows.reduce((s, r) => s + (Number(r.recovery) || 0), 0);
  const clearance = pending.length === 0 ? 'Cleared' : 'Pending';

  const setRow = (id: string, patch: Partial<AssetRow>) => setRows((list) => list.map((r) => r.id === id ? { ...r, ...patch } : r));

  const badge = (s: string) => s === 'Returned' || s === 'Cleared' ? 'success' : s === 'In Use' || s === 'Pending' ? 'warning' : 'danger';

  return (
    <div className="p-4 md:p-6 space-y-4 bg-gray-50 min-h-full">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Package className="w-5 h-5 text-blue-600" /> Asset Management Master</h1>
          <p className="text-sm text-gray-500">Employee: {EMP.name} | {EMP.id}</p>
        </div>
        <Button variant="outline" onClick={() => setNotice('Asset register exported.')}><Download className="w-4 h-4 mr-1" /> Export</Button>
      </div>
      {notice && <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-800 flex justify-between"><span>{notice}</span><button type="button" onClick={() => setNotice(null)}>×</button></div>}

      <div className="flex gap-1 border-b">
        {([['register', '1A Asset Assignment Register'], ['return', '1B Asset Return Processing'], ['summary', '1C Asset Status Summary']] as const).map(([id, label]) => (
          <button key={id} type="button" onClick={() => setTab(id)} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === id ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500'}`}>{label}</button>
        ))}
      </div>

      {tab === 'register' && (
        <Card>
          <div className="flex flex-wrap gap-2 mb-4">
            <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value)}><option>All</option>{[...new Set(rows.map((r) => r.category))].map((c) => <option key={c}>{c}</option>)}</select>
            <select className={inputClass} value={status} onChange={(e) => setStatus(e.target.value)}><option>All</option><option>In Use</option><option>Returned</option><option>Damaged</option><option>Missing</option></select>
            <input type="date" className={inputClass} value={from} onChange={(e) => setFrom(e.target.value)} />
            <input type="date" className={inputClass} value={to} onChange={(e) => setTo(e.target.value)} />
            <Button variant="primary" onClick={() => setAssignOpen(true)}><Plus className="w-4 h-4 mr-1" /> Assign New Asset</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr>{['#', 'Asset Name', 'Asset Code', 'Category', 'Issued Date', 'Current Status', 'Action'].map((h) => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr></thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={r.id} className="border-t">
                    <td className="px-3 py-2">{i + 1}</td>
                    <td className="px-3 py-2 font-medium">{r.name}</td>
                    <td className="px-3 py-2 font-mono text-xs">{r.code}</td>
                    <td className="px-3 py-2">{r.category}</td>
                    <td className="px-3 py-2">{fmt(r.issued)}</td>
                    <td className="px-3 py-2"><Badge variant={badge(r.status) as any}>{r.status}</Badge></td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <Button variant="outline" onClick={() => setViewRow(r)}>View</Button>
                      {r.status === 'In Use' && <Button variant="outline" className="ml-1" onClick={() => { setRow(r.id, { status: 'Returned', returnStatus: 'Returned' }); setNotice(`${r.name} marked returned.`); }}>Mark Return</Button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm mt-3 text-gray-700">Total Assets Issued: {rows.length} | Returned: {returned} | Pending Return: {pending.length} | Damaged: {damaged}</p>
        </Card>
      )}

      {tab === 'return' && (
        <Card title={`Asset Return Processing · Last Working Date ${fmt(EMP.lwd)}`}>
          <p className="text-xs text-gray-500 mb-3">Auto-fetched from Asset Register — pending (unreturned) assets</p>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr>{['#', 'Asset Name', 'Code', 'Issued', 'Return Status', 'Condition', 'Remarks'].map((h) => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr></thead>
              <tbody>
                {pending.map((r, i) => (
                  <tr key={r.id} className="border-t">
                    <td className="px-3 py-2">{i + 1}</td>
                    <td className="px-3 py-2">{r.name}</td>
                    <td className="px-3 py-2 font-mono text-xs">{r.code}</td>
                    <td className="px-3 py-2">{fmt(r.issued)}</td>
                    <td className="px-3 py-2"><select className={inputClass} value={r.returnStatus} onChange={(e) => setRow(r.id, { returnStatus: e.target.value as ReturnStatus, status: e.target.value === 'Returned' ? 'Returned' : e.target.value === 'Damaged' ? 'Damaged' : e.target.value === 'Missing' ? 'Missing' : 'In Use' })}><option>Returned</option><option>Pending</option><option>Damaged</option><option>Missing</option></select></td>
                    <td className="px-3 py-2"><select className={inputClass} value={r.condition} onChange={(e) => setRow(r.id, { condition: e.target.value as Condition })}><option>Good</option><option>Fair</option><option>Damaged</option><option>Missing</option></select></td>
                    <td className="px-3 py-2"><input className={inputClass} value={r.remarks} onChange={(e) => setRow(r.id, { remarks: e.target.value })} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm font-semibold mt-4 mb-2">Damage / Loss Recovery</p>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr>{['Asset Name', 'Recovery Amount', 'Reason'].map((h) => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr></thead>
              <tbody>
                {rows.filter((r) => r.returnStatus === 'Damaged' || r.returnStatus === 'Missing').map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="px-3 py-2">{r.name}</td>
                    <td className="px-3 py-2"><input type="number" className={inputClass} value={r.recovery} onChange={(e) => setRow(r.id, { recovery: Number(e.target.value) || 0 })} /></td>
                    <td className="px-3 py-2"><input className={inputClass} value={r.reason} onChange={(e) => setRow(r.id, { reason: e.target.value })} /></td>
                  </tr>
                ))}
                {rows.every((r) => r.returnStatus !== 'Damaged' && r.returnStatus !== 'Missing') && <tr><td colSpan={3} className="px-3 py-4 text-gray-500">No damaged or missing assets. Recovery = ₹0</td></tr>}
              </tbody>
            </table>
          </div>
          <p className="text-lg font-bold mt-3">Total Asset Recovery Amount: ₹{recoveryTotal.toLocaleString('en-IN')} <span className="text-xs font-normal text-gray-500">← flows into F&F Module</span></p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <Select label="Verified By (Admin/IT)" options={['Karan Patel', 'Anita Shah', 'IT Desk'].map((n) => ({ value: n, label: n }))} value={verifier} onChange={(e) => setVerifier(e.target.value)} />
            <Input label="Verification Date" type="date" value={verifyDate} onChange={(e) => setVerifyDate(e.target.value)} />
            <div className="flex items-end"><Button variant={otpOk ? 'primary' : 'outline'} onClick={() => { setOtpOk(true); setNotice('OTP verified / digital signature captured.'); }}>{otpOk ? 'Verified ✓' : 'Sign / OTP Verify'}</Button></div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={() => setNotice('Asset return draft saved.')}><Save className="w-4 h-4 mr-1" /> Save Draft</Button>
            <Button variant="primary" onClick={() => setNotice('Asset return submitted. Recovery amount sent to F&F.')}>Confirm & Submit Asset Return</Button>
          </div>
        </Card>
      )}

      {tab === 'summary' && (
        <Card title={`Asset Summary — ${EMP.name}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm max-w-lg">
            {[['Total Assets Issued', rows.length], ['Assets Returned', returned], ['Pending Returns', pending.length], ['Damaged Assets', damaged], ['Missing Assets', missing], ['Total Recovery Amt.', `₹ ${recoveryTotal.toLocaleString('en-IN')}`]].map(([k, v]) => (
              <div key={String(k)} className="flex justify-between border rounded-lg px-3 py-2"><span className="text-gray-600">{k}</span><b>{v}</b></div>
            ))}
            <div className="flex justify-between border rounded-lg px-3 py-2 md:col-span-2">
              <span className="text-gray-600">Asset Clearance Status</span>
              <Badge variant={clearance === 'Cleared' ? 'success' : 'danger'}>{clearance}</Badge>
            </div>
          </div>
        </Card>
      )}

      <Modal isOpen={!!viewRow} onClose={() => setViewRow(null)} title={viewRow?.name}>
        {viewRow && <div className="text-sm space-y-1"><p>Code: {viewRow.code}</p><p>Category: {viewRow.category}</p><p>Issued: {fmt(viewRow.issued)}</p><p>Status: {viewRow.status}</p></div>}
      </Modal>
      <Modal isOpen={assignOpen} onClose={() => setAssignOpen(false)} title="Assign New Asset" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setAssignOpen(false)}>Cancel</Button><Button variant="primary" onClick={() => { setRows((list) => [...list, { id: String(list.length + 1), name: draft.name || 'New Asset', code: draft.code || `AST-${1000 + list.length}`, category: draft.category, issued: draft.issued, status: 'In Use', recovery: 0, reason: '', returnStatus: 'Pending', condition: 'Good', remarks: '' }]); setAssignOpen(false); setNotice('Asset assigned.'); }}>Assign</Button></div>}>
        <div className="space-y-3">
          <Input label="Asset Name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          <Input label="Asset Code" value={draft.code} onChange={(e) => setDraft({ ...draft, code: e.target.value })} />
          <Select label="Category" options={['IT Equipment', 'Identity Card', 'Security', 'AV Equipment', 'Clothing', 'Keys'].map((c) => ({ value: c, label: c }))} value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} />
          <Input label="Issued Date" type="date" value={draft.issued} onChange={(e) => setDraft({ ...draft, issued: e.target.value })} />
        </div>
      </Modal>
    </div>
  );
}

export default AssetManagementMaster;
