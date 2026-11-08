import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { TAX_STAFF, RETURN_STORE, computeEmployeeTax, inr, loadJson, saveJson } from './taxRecords';

type ReturnStatus = 'Draft' | 'Validation pending' | 'Validation failed' | 'Ready for filing' | 'Filing initiated' | 'Submitted' | 'Filed' | 'Accepted' | 'Failed' | 'Correction required';
type TdsReturn = {
  id: string;
  company: string;
  fy: string;
  quarter: string;
  type: string;
  tan: string;
  responsible: string;
  status: ReturnStatus;
  receipt: string;
  token: string;
  created: string;
  parentId?: string;
  version: number;
  errors: string[];
  warnings: string[];
};

const empty = (): TdsReturn => ({
  id: '',
  company: 'EduManager School',
  fy: 'AY-2026-27',
  quarter: 'Q3',
  type: '24Q',
  tan: '',
  responsible: '',
  status: 'Draft',
  receipt: '',
  token: '',
  created: new Date().toISOString().slice(0, 10),
  version: 1,
  errors: [],
  warnings: []
});

export function TdsReturnFiling() {
  const [list, setList] = useState<TdsReturn[]>(() => loadJson(RETURN_STORE, []));
  const [form, setForm] = useState<TdsReturn>(empty);
  const [mode, setMode] = useState<'list' | 'form'>('list');
  const [notice, setNotice] = useState('');
  const [csiName, setCsiName] = useState('');
  const deductees = TAX_STAFF.map((e) => {
    const tax = computeEmployeeTax(e.id, form.fy);
    return { e, tax, panOk: true };
  });
  const deducted = deductees.reduce((s, d) => s + d.tax.tdsDeductedYtd, 0);
  const persist = (next: TdsReturn[], msg: string) => {
    setList(next);
    saveJson(RETURN_STORE, next);
    setNotice(msg);
  };

  const validate = (row: TdsReturn) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!row.tan.trim()) errors.push('TAN is required.');
    if (!row.responsible.trim()) errors.push('Responsible person is required.');
    if (!deductees.length) errors.push('No deductees available from shared employee tax records.');
    if (!csiName) warnings.push('CSI file not selected — challan verification against TRACES is not claimed.');
    return { errors, warnings };
  };

  const save = (status: ReturnStatus) => {
    const v = validate(form);
    if (status !== 'Draft' && v.errors.length) {
      persist(list, 'Fix mandatory errors before leaving Draft.');
      setForm({ ...form, errors: v.errors, warnings: v.warnings, status: 'Validation failed' });
      return;
    }
    const rec = { ...form, id: form.id || `RET-${Date.now()}`, status, errors: v.errors, warnings: v.warnings };
    persist(list.some((r) => r.id === rec.id) ? list.map((r) => r.id === rec.id ? rec : r) : [rec, ...list], `Return ${rec.id} saved as ${status}.`);
    setForm(rec);
    if (status !== 'Draft') setMode('list');
  };

  const revise = (row: TdsReturn) => {
    const copy = { ...row, id: `RET-${Date.now()}`, parentId: row.id, version: row.version + 1, status: 'Draft' as const, receipt: '', token: '' };
    setForm(copy);
    setMode('form');
    setNotice(`Revision of ${row.id} started. Original return is kept.`);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">TDS Return Management and Filing</h1>
          <p className="text-sm text-gray-500">Frontend workflow only. Filed / Accepted is never set by a local click.</p>
        </div>
        <Button onClick={() => { setForm(empty()); setMode('form'); }}>New quarterly return</Button>
      </div>
      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}
      <div className="grid gap-3 md:grid-cols-4">
        {['Draft', 'Ready for filing', 'Submitted', 'Correction required'].map((s) => (
          <Card key={s}><div className="p-4"><p className="text-xs text-gray-500">{s}</p><p className="text-2xl font-semibold">{list.filter((r) => r.status === s).length}</p></div></Card>
        ))}
      </div>

      {mode === 'list' && (
        <Card>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500"><tr><th className="px-3 py-2">Return</th><th className="px-3 py-2">FY / Q</th><th className="px-3 py-2">Type</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Receipt</th><th className="px-3 py-2">Version</th><th className="px-3 py-2" /></tr></thead>
            <tbody>
              {list.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-3 py-2">{r.id}{r.parentId ? <p className="text-xs text-gray-400">Revision of {r.parentId}</p> : null}</td>
                  <td className="px-3 py-2">{r.fy} {r.quarter}</td>
                  <td className="px-3 py-2">{r.type}</td>
                  <td className="px-3 py-2"><Badge variant={r.status === 'Validation failed' ? 'danger' : 'warning'}>{r.status}</Badge></td>
                  <td className="px-3 py-2">{r.receipt || '—'}</td>
                  <td className="px-3 py-2">{r.version}</td>
                  <td className="px-3 py-2 space-x-2"><button type="button" className="text-indigo-700" onClick={() => { setForm(r); setMode('form'); }}>Open</button><button type="button" className="text-indigo-700" onClick={() => revise(r)}>Revise</button></td>
                </tr>
              ))}
              {!list.length && <tr><td colSpan={7} className="px-3 py-8 text-center text-gray-500">No returns yet.</td></tr>}
            </tbody>
          </table>
        </Card>
      )}

      {mode === 'form' && (
        <div className="space-y-4">
          <Card title="Return creation / deductor">
            <div className="grid gap-3 p-4 md:grid-cols-2">
              <Input label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              <Select label="Financial year" options={[{ value: 'AY-2026-27', label: 'AY 2026-27' }]} value={form.fy} onChange={(e) => setForm({ ...form, fy: typeof e === 'string' ? e : e.target.value })} />
              <Select label="Quarter" options={['Q1', 'Q2', 'Q3', 'Q4'].map((q) => ({ value: q, label: q }))} value={form.quarter} onChange={(e) => setForm({ ...form, quarter: typeof e === 'string' ? e : e.target.value })} />
              <Select label="Return type" options={[{ value: '24Q', label: '24Q (salary)' }]} value={form.type} onChange={(e) => setForm({ ...form, type: typeof e === 'string' ? e : e.target.value })} />
              <Input label="TAN *" value={form.tan} onChange={(e) => setForm({ ...form, tan: e.target.value.toUpperCase() })} />
              <Input label="Responsible person *" value={form.responsible} onChange={(e) => setForm({ ...form, responsible: e.target.value })} />
            </div>
          </Card>
          <Card title="Deductees (from shared employee tax records)">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500"><tr><th className="px-3 py-2">Employee</th><th className="px-3 py-2">Taxable</th><th className="px-3 py-2">TDS</th><th className="px-3 py-2">Cess</th><th className="px-3 py-2">Surcharge</th></tr></thead>
              <tbody>
                {deductees.map((d) => (
                  <tr key={d.e.id} className="border-t">
                    <td className="px-3 py-2">{d.e.name}<p className="text-xs text-gray-400">{d.e.id}</p></td>
                    <td className="px-3 py-2">{inr(d.tax.taxableIncome)}</td>
                    <td className="px-3 py-2">{inr(d.tax.tdsDeductedYtd)}</td>
                    <td className="px-3 py-2">{inr(d.tax.cess)}</td>
                    <td className="px-3 py-2">{inr(d.tax.surcharge)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="p-4 text-sm">Total TDS deducted {inr(deducted)}. Map challans on Challan Tax Payment Register — only submitted/available challans should be allocated, never beyond available balance.</p>
          </Card>
          <Card title="Reconciliation">
            <div className="grid gap-2 p-4 text-sm md:grid-cols-2">
              <p>Tax deducted (employees) {inr(deducted)}</p>
              <p>Tax deposited (challans) — open challan register</p>
              <p>Difference flagged for review until challans are mapped</p>
            </div>
          </Card>
          <Card title="CSI / filing preparation (simulated)">
            <div className="space-y-3 p-4 text-sm">
              <input type="file" onChange={(e) => setCsiName(e.target.files?.[0]?.name || '')} />
              <p>CSI file: {csiName || 'not selected'}</p>
              <p>TXT / FVU / Form 27A: preview only — not an official generation.</p>
              <Input label="Receipt number (after real filing)" value={form.receipt} onChange={(e) => setForm({ ...form, receipt: e.target.value })} />
              <Input label="Token number" value={form.token} onChange={(e) => setForm({ ...form, token: e.target.value })} />
              {form.errors.map((er) => <p key={er} className="text-red-700">{er}</p>)}
              {form.warnings.map((w) => <p key={w} className="text-amber-700">{w}</p>)}
            </div>
          </Card>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => save('Draft')}>Save draft</Button>
            <Button variant="outline" onClick={() => save('Validation pending')}>Validate</Button>
            <Button variant="outline" onClick={() => save('Ready for filing')}>Mark ready for filing</Button>
            <Button variant="outline" onClick={() => setNotice('Filing initiated is a local status. Submitted / Filed / Accepted require a real TIN/NSDL response.')}>Simulate filing initiated</Button>
            <Button variant="outline" onClick={() => setMode('list')}>Back</Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TdsReturnFiling;
