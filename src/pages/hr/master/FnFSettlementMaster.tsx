import React, { useState } from 'react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Calculator, Plus, Save, Trash2 } from 'lucide-react';

const EMPLOYMENT_TYPES = ['Permanent', 'Contract', 'Probation'];

interface NoticeRule {
  employmentType: string;
  noticeDays: number;
  gratuity: boolean;
  leaveEncashment: boolean;
}

interface ApproverRole {
  id: string;
  role: string;
  required: boolean;
}

interface SettlementHead {
  id: string;
  name: string;
  kind: 'Earning' | 'Deduction';
  appliesTo: string;
}

export function FnFSettlementMaster() {
  const [notice, setNotice] = useState<string | null>(null);
  const [noticeRules, setNoticeRules] = useState<NoticeRule[]>([
    { employmentType: 'Permanent', noticeDays: 30, gratuity: true, leaveEncashment: true },
    { employmentType: 'Contract', noticeDays: 30, gratuity: false, leaveEncashment: true },
    { employmentType: 'Probation', noticeDays: 15, gratuity: false, leaveEncashment: false }
  ]);
  const [approvers, setApprovers] = useState<ApproverRole[]>([
    { id: '1', role: 'Reporting Manager', required: true },
    { id: '2', role: 'HR Manager', required: true },
    { id: '3', role: 'Principal', required: true }
  ]);
  const [approverDraft, setApproverDraft] = useState('');
  const [documents, setDocuments] = useState(['Relieving Letter', 'Experience Certificate', 'No Dues Certificate', 'Salary Certificate', 'Full & Final Statement']);
  const [docDraft, setDocDraft] = useState('');
  const [heads, setHeads] = useState<SettlementHead[]>([
    { id: '1', name: 'Pending Salary (Pro-rated)', kind: 'Earning', appliesTo: 'All' },
    { id: '2', name: 'Leave Encashment', kind: 'Earning', appliesTo: 'Permanent, Contract' },
    { id: '3', name: 'Gratuity', kind: 'Earning', appliesTo: 'Permanent' },
    { id: '4', name: 'Asset damage / loss fine', kind: 'Deduction', appliesTo: 'All' },
    { id: '5', name: 'Notice period shortfall', kind: 'Deduction', appliesTo: 'All' },
    { id: '6', name: 'TDS', kind: 'Deduction', appliesTo: 'All' }
  ]);
  const [headDraft, setHeadDraft] = useState({ name: '', kind: 'Earning' as 'Earning' | 'Deduction', appliesTo: 'All' });

  const setRule = (type: string, patch: Partial<NoticeRule>) => {
    setNoticeRules((list) => list.map((r) => r.employmentType === type ? { ...r, ...patch } : r));
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><Calculator className="w-5 h-5 text-blue-600" /> Resignation & F&F Setup (All Employees)</h3>
        <p className="text-sm text-gray-500 mt-1">Master setup for how every employee resignation, approval, documents and full & final settlement are processed.</p>
      </div>
      {notice && <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-800 flex justify-between"><span>{notice}</span><button type="button" onClick={() => setNotice(null)}>×</button></div>}

      <Card title="Notice period & eligibility by employee type">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>{['Employee type', 'Notice period (days)', 'Gratuity', 'Leave encashment'].map((h) => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr>
            </thead>
            <tbody>
              {noticeRules.map((r) => (
                <tr key={r.employmentType} className="border-t">
                  <td className="px-3 py-2 font-medium">{r.employmentType}</td>
                  <td className="px-3 py-2">
                    <Input type="number" min={0} value={String(r.noticeDays)} onChange={(e) => setRule(r.employmentType, { noticeDays: Number(e.target.value) || 0 })} />
                  </td>
                  <td className="px-3 py-2">
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={r.gratuity} onChange={(e) => setRule(r.employmentType, { gratuity: e.target.checked })} /> Eligible</label>
                  </td>
                  <td className="px-3 py-2">
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={r.leaveEncashment} onChange={(e) => setRule(r.employmentType, { leaveEncashment: e.target.checked })} /> Eligible</label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Resignation approvers">
        <div className="flex gap-2 mb-3">
          <Input placeholder="Role name" value={approverDraft} onChange={(e) => setApproverDraft(e.target.value)} />
          <Button onClick={() => {
            if (!approverDraft.trim()) return;
            setApprovers((list) => [...list, { id: String(Date.now()), role: approverDraft.trim(), required: true }]);
            setApproverDraft('');
          }}><Plus className="w-4 h-4 mr-1" /> Add role</Button>
        </div>
        <div className="space-y-2">
          {approvers.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
              <div className="flex items-center gap-3">
                <span className="font-medium text-sm">{a.role}</span>
                <label className="text-xs text-gray-600 flex items-center gap-1"><input type="checkbox" checked={a.required} onChange={(e) => setApprovers((list) => list.map((x) => x.id === a.id ? { ...x, required: e.target.checked } : x))} /> Required</label>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setApprovers((list) => list.filter((x) => x.id !== a.id))}><Trash2 className="w-4 h-4 text-red-500" /></Button>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Documents generated on exit">
        <div className="flex gap-2 mb-3">
          <Input placeholder="Document name" value={docDraft} onChange={(e) => setDocDraft(e.target.value)} />
          <Button onClick={() => {
            if (!docDraft.trim()) return;
            setDocuments((list) => [...list, docDraft.trim()]);
            setDocDraft('');
          }}><Plus className="w-4 h-4 mr-1" /> Add document</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {documents.map((d) => (
            <Badge key={d} variant="primary" className="gap-2">
              {d}
              <button type="button" className="ml-1" onClick={() => setDocuments((list) => list.filter((x) => x !== d))}>×</button>
            </Badge>
          ))}
        </div>
      </Card>

      <Card title="F&F settlement heads (all employees)">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
          <Input placeholder="Head name" value={headDraft.name} onChange={(e) => setHeadDraft({ ...headDraft, name: e.target.value })} />
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" value={headDraft.kind} onChange={(e) => setHeadDraft({ ...headDraft, kind: e.target.value as 'Earning' | 'Deduction' })}>
            <option>Earning</option>
            <option>Deduction</option>
          </select>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" value={headDraft.appliesTo} onChange={(e) => setHeadDraft({ ...headDraft, appliesTo: e.target.value })}>
            <option>All</option>
            {EMPLOYMENT_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
          <Button onClick={() => {
            if (!headDraft.name.trim()) return;
            setHeads((list) => [...list, { id: String(Date.now()), ...headDraft, name: headDraft.name.trim() }]);
            setHeadDraft({ name: '', kind: 'Earning', appliesTo: 'All' });
          }}><Plus className="w-4 h-4 mr-1" /> Add head</Button>
        </div>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>{['Head', 'Type', 'Applies to', ''].map((h) => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr>
          </thead>
          <tbody>
            {heads.map((h) => (
              <tr key={h.id} className="border-t">
                <td className="px-3 py-2 font-medium">{h.name}</td>
                <td className="px-3 py-2"><Badge variant={h.kind === 'Earning' ? 'success' : 'danger'}>{h.kind}</Badge></td>
                <td className="px-3 py-2">{h.appliesTo}</td>
                <td className="px-3 py-2"><Button variant="ghost" size="sm" onClick={() => setHeads((list) => list.filter((x) => x.id !== h.id))}><Trash2 className="w-4 h-4 text-red-500" /></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="flex justify-end">
        <Button variant="primary" onClick={() => setNotice('Resignation and F&F setup saved for all employees.')}><Save className="w-4 h-4 mr-1" /> Save setup</Button>
      </div>
    </div>
  );
}

export default FnFSettlementMaster;
