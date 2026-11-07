import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Textarea } from '../../../components/ui/Textarea';
import { Award, TrendingUp, ArrowRightLeft, ClipboardList } from 'lucide-react';

type TabId = 'summary' | 'increment' | 'promotion' | 'pip';

type Outcome = {
  id: string;
  employee: string;
  employeeId: string;
  appraisal: string;
  cycle: string;
  designation: string;
  department: string;
  overall: number;
  rating: string;
  incrementPct: number;
  incrementAmt: number;
  incrementReason: string;
  incrementStatus: 'Draft' | 'Approved' | 'Applied';
  effectiveFrom: string;
  promotion: boolean;
  newDesignation: string;
  newDepartment: string;
  promotionEffective: string;
  promotionJustification: string;
  transfer: boolean;
  transferCampus: string;
  transferEffective: string;
  transferReason: string;
  pipRequired: boolean;
  pipDuration: string;
  pipGoals: string;
  pipReviewer: string;
  pipReviewDate: string;
  pipConsequences: string;
  letterStatus: 'Not generated' | 'Generated' | 'Issued';
};

const SEED: Outcome[] = [
  {
    id: 'OUT-001',
    employee: 'Rajesh Kumar',
    employeeId: 'EMP-1001',
    appraisal: 'APR-2026-1001',
    cycle: 'AY 2026-27 — Annual Appraisal',
    designation: 'PGT Physics',
    department: 'Science',
    overall: 3.8,
    rating: 'Meets Expectations',
    incrementPct: 8,
    incrementAmt: 4800,
    incrementReason: 'Meets expectations with strong board results.',
    incrementStatus: 'Draft',
    effectiveFrom: '2026-07-01',
    promotion: false,
    newDesignation: '',
    newDepartment: '',
    promotionEffective: '',
    promotionJustification: '',
    transfer: false,
    transferCampus: '',
    transferEffective: '',
    transferReason: '',
    pipRequired: false,
    pipDuration: '3 months',
    pipGoals: '',
    pipReviewer: 'HOD Science',
    pipReviewDate: '',
    pipConsequences: 'If goals are not met, increment will be withheld in the next cycle.',
    letterStatus: 'Not generated'
  }
];

const TAB_BTNS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'summary', label: 'Summary', icon: <Award className="h-4 w-4" /> },
  { id: 'increment', label: 'Increment', icon: <TrendingUp className="h-4 w-4" /> },
  { id: 'promotion', label: 'Promotion & Transfer', icon: <ArrowRightLeft className="h-4 w-4" /> },
  { id: 'pip', label: 'Development Plan / PIP', icon: <ClipboardList className="h-4 w-4" /> }
];

export function AppraisalOutcomeIncrement() {
  const [rows, setRows] = useState(SEED);
  const [current, setCurrent] = useState(SEED[0]);
  const [tab, setTab] = useState<TabId>('summary');
  const [notice, setNotice] = useState('');
  const [letterOpen, setLetterOpen] = useState(false);

  const flash = (t: string) => { setNotice(t); window.setTimeout(() => setNotice(''), 4500); };
  const save = (patch: Partial<Outcome>) => {
    const next = { ...current, ...patch };
    setCurrent(next);
    setRows((p) => p.map((r) => (r.id === next.id ? next : r)));
  };

  const suggestedPct = current.overall >= 4.5 ? 12 : current.overall >= 4 ? 10 : current.overall >= 3.5 ? 8 : current.overall >= 3 ? 5 : 0;
  const suggestedAmt = Math.round(60000 * suggestedPct / 100);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Appraisal Outcome & Increment</h1>
        <p className="text-sm text-gray-500">Final score, increment, promotion / transfer and PIP after appraisal is completed.</p>
      </div>
      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}

      <Card>
        <div className="flex flex-wrap items-center gap-3 p-4">
          <Select
            label="Employee"
            value={current.employeeId}
            onChange={(e) => {
              const id = typeof e === 'string' ? e : e.target.value;
              const found = rows.find((r) => r.employeeId === id) || current;
              setCurrent(found);
            }}
            options={rows.map((r) => ({ value: r.employeeId, label: `${r.employee} (${r.employeeId})` }))}
          />
          <div className="text-sm text-gray-600">
            Appraisal <span className="font-semibold">{current.appraisal}</span> · {current.cycle}
          </div>
          <Badge variant={current.overall >= 4 ? 'success' : current.overall >= 3 ? 'info' : 'warning'}>{current.rating} · {current.overall}</Badge>
        </div>
      </Card>

      <div className="flex flex-wrap gap-2">
        {TAB_BTNS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium ${tab === t.id ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {tab === 'summary' && (
        <Card>
          <div className="grid gap-4 p-5 md:grid-cols-3">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs uppercase text-gray-500">Employee</p>
              <p className="font-semibold">{current.employee}</p>
              <p className="text-sm text-gray-600">{current.designation} · {current.department}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs uppercase text-gray-500">Final Score</p>
              <p className="text-3xl font-bold text-blue-700">{current.overall}</p>
              <p className="text-sm">{current.rating}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs uppercase text-gray-500">Letter</p>
              <p className="font-semibold">{current.letterStatus}</p>
              <Button size="sm" className="mt-2" onClick={() => { save({ letterStatus: 'Generated' }); setLetterOpen(true); }}>Generate Appraisal Letter</Button>
            </div>
          </div>
          <div className="grid gap-3 border-t p-5 md:grid-cols-3 text-sm">
            <div>Proposed increment: <strong>{current.incrementPct}%</strong> (₹{current.incrementAmt.toLocaleString('en-IN')})</div>
            <div>Promotion: <strong>{current.promotion ? current.newDesignation : 'No'}</strong></div>
            <div>PIP: <strong>{current.pipRequired ? 'Yes' : 'No'}</strong></div>
          </div>
        </Card>
      )}

      {tab === 'increment' && (
        <Card>
          <div className="space-y-4 p-5">
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-800">
              Suggested from rating scale: {suggestedPct}% · ₹{suggestedAmt.toLocaleString('en-IN')} (on current basic ₹60,000). Override allowed with reason.
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Input label="Increment %" type="number" value={String(current.incrementPct)} onChange={(e) => save({ incrementPct: Number(e.target.value), incrementAmt: Math.round(60000 * Number(e.target.value) / 100) })} />
              <Input label="Increment Amount (₹)" type="number" value={String(current.incrementAmt)} onChange={(e) => save({ incrementAmt: Number(e.target.value) })} />
              <Input label="Effective From" type="date" value={current.effectiveFrom} onChange={(e) => save({ effectiveFrom: e.target.value })} />
            </div>
            <Textarea label="Reason / justification" rows={3} value={current.incrementReason} onChange={(e) => save({ incrementReason: e.target.value })} />
            <div className="flex items-center gap-2">
              <Badge variant={current.incrementStatus === 'Applied' ? 'success' : 'warning'}>{current.incrementStatus}</Badge>
              {current.incrementStatus !== 'Applied' && (
                <Button onClick={() => { save({ incrementStatus: 'Applied' }); flash('Salary structure updated. New basic effective from ' + current.effectiveFrom + '.'); }}>Apply to Salary Structure</Button>
              )}
            </div>
            {current.incrementStatus === 'Applied' && <p className="text-xs text-gray-500">Locked after apply. Reversal requires payroll admin.</p>}
          </div>
        </Card>
      )}

      {tab === 'promotion' && (
        <Card>
          <div className="space-y-4 p-5">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" checked={current.promotion} onChange={(e) => save({ promotion: e.target.checked })} /> Recommend promotion
            </label>
            {current.promotion && (
              <div className="grid gap-4 md:grid-cols-2">
                <Select label="New Designation *" value={current.newDesignation} onChange={(e) => save({ newDesignation: typeof e === 'string' ? e : e.target.value })} options={[{ value: 'Senior PGT Physics', label: 'Senior PGT Physics' }, { value: 'HOD Science', label: 'HOD Science' }]} />
                <Select label="New Department" value={current.newDepartment} onChange={(e) => save({ newDepartment: typeof e === 'string' ? e : e.target.value })} options={[{ value: 'Science', label: 'Science' }, { value: 'Academics', label: 'Academics' }]} />
                <Input label="Effective Date" type="date" value={current.promotionEffective} onChange={(e) => save({ promotionEffective: e.target.value })} />
                <div className="md:col-span-2"><Textarea label="Justification" rows={3} value={current.promotionJustification} onChange={(e) => save({ promotionJustification: e.target.value })} /></div>
              </div>
            )}
            <hr />
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" checked={current.transfer} onChange={(e) => save({ transfer: e.target.checked })} /> Recommend campus / department transfer
            </label>
            {current.transfer && (
              <div className="grid gap-4 md:grid-cols-2">
                <Select label="Transfer Campus" value={current.transferCampus} onChange={(e) => save({ transferCampus: typeof e === 'string' ? e : e.target.value })} options={[{ value: 'Main Campus', label: 'Main Campus' }, { value: 'North Campus', label: 'North Campus' }]} />
                <Input label="Effective Date" type="date" value={current.transferEffective} onChange={(e) => save({ transferEffective: e.target.value })} />
                <div className="md:col-span-2"><Textarea label="Reason" rows={3} value={current.transferReason} onChange={(e) => save({ transferReason: e.target.value })} /></div>
              </div>
            )}
            <Button onClick={() => flash('Promotion / transfer recommendation saved for HR action.')}>Save recommendation</Button>
          </div>
        </Card>
      )}

      {tab === 'pip' && (
        <Card>
          <div className="space-y-4 p-5">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" checked={current.pipRequired} onChange={(e) => save({ pipRequired: e.target.checked })} /> Place on Performance Improvement Plan
            </label>
            {current.pipRequired && (
              <>
                <Select label="Duration" value={current.pipDuration} onChange={(e) => save({ pipDuration: typeof e === 'string' ? e : e.target.value })} options={[{ value: '3 months', label: '3 months' }, { value: '6 months', label: '6 months' }]} />
                <Textarea label="PIP Goals" rows={4} value={current.pipGoals} onChange={(e) => save({ pipGoals: e.target.value })} />
                <Input label="Reviewer" value={current.pipReviewer} onChange={(e) => save({ pipReviewer: e.target.value })} />
                <Input label="Review Date" type="date" value={current.pipReviewDate} onChange={(e) => save({ pipReviewDate: e.target.value })} />
                <Textarea label="Consequences if not met" rows={3} value={current.pipConsequences} onChange={(e) => save({ pipConsequences: e.target.value })} />
                <Button onClick={() => flash('PIP saved. Employee and reviewer will be notified.')}>Save PIP</Button>
              </>
            )}
            {!current.pipRequired && <p className="text-sm text-gray-500">No PIP required for this outcome.</p>}
          </div>
        </Card>
      )}

      {letterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setLetterOpen(false)}>
          <div className="max-w-lg rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-3 font-semibold">Appraisal Letter — {current.employee}</h3>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {`Dear ${current.employee},\n\nFollowing the ${current.cycle}, your overall rating is ${current.rating} (${current.overall}).\n\nIncrement: ${current.incrementPct}% (₹${current.incrementAmt.toLocaleString('en-IN')}) effective ${current.effectiveFrom}.\n${current.promotion ? `Promotion to ${current.newDesignation}.\n` : ''}${current.pipRequired ? 'You have been placed on a Performance Improvement Plan.\n' : ''}\nWith regards,\nPrincipal`}
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setLetterOpen(false)}>Close</Button>
              <Button onClick={() => { save({ letterStatus: 'Issued' }); setLetterOpen(false); flash('Letter issued to employee.'); }}>Issue to employee</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppraisalOutcomeIncrement;
