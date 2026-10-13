import React, { useMemo, useState } from 'react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { Select } from '../../../components/ui/Select';
import { Star } from 'lucide-react';

const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
const addDays = (iso: string, n: number) => {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};
const fmt = (iso: string) => iso ? iso.split('-').reverse().join('-') : '—';
const POLICY_NOTICE = 30;

export function ExitProcessMaster() {
  const [tab, setTab] = useState<'resign' | 'approval' | 'dues' | 'interview' | 'handover'>('resign');
  const [notice, setNotice] = useState<string | null>(null);
  const [pullback, setPullback] = useState(false);
  const [pullReason, setPullReason] = useState('');

  const [resDate, setResDate] = useState('2026-10-01');
  const [lwd, setLwd] = useState('2026-10-31');
  const [reason, setReason] = useState('Better Opportunity');
  const [remarks, setRemarks] = useState('');
  const [letter, setLetter] = useState('resignation-letter.pdf');
  const noticeDays = useMemo(() => {
    const a = new Date(`${resDate}T00:00:00`);
    const b = new Date(`${lwd}T00:00:00`);
    return Math.max(0, Math.round((b.getTime() - a.getTime()) / 86400000));
  }, [resDate, lwd]);
  const shortfall = Math.max(0, POLICY_NOTICE - noticeDays);
  const noticeStatus = shortfall === 0 ? (noticeDays > POLICY_NOTICE ? 'Excess served' : 'Fully Served') : `Short by ${shortfall} days`;

  const [levels, setLevels] = useState([
    { level: 1, role: 'Reporting Manager', name: 'Mr. Kapoor', status: 'Approved', date: '2026-10-03', remarks: 'Approved, LWD confirmed' },
    { level: 2, role: 'HR Department', name: 'Ms. Priya', status: 'Pending', date: '', remarks: '' },
    { level: 3, role: 'School Principal', name: 'Dr. Sharma', status: 'Locked', date: '', remarks: '' }
  ]);
  const [apprComment, setApprComment] = useState('');
  const [notify, setNotify] = useState(true);

  const [dues, setDues] = useState([
    { dept: 'Accounts / Finance', person: 'Anita Shah', status: 'Cleared', amount: 0, remarks: '', by: 'Anita Shah' },
    { dept: 'Library', person: 'R. Iyer', status: 'Cleared', amount: 0, remarks: '', by: 'R. Iyer' },
    { dept: 'IT Department', person: 'Karan Patel', status: 'Pending', amount: 2500, remarks: 'Laptop charger', by: '' },
    { dept: 'Admin / Estate', person: 'S. Nair', status: 'Pending', amount: 0, remarks: '', by: '' },
    { dept: 'HR Department', person: 'HR Desk', status: 'Cleared', amount: 0, remarks: '', by: 'HR Desk' },
    { dept: 'Academic / Class', person: 'HOD Science', status: 'Cleared', amount: 0, remarks: '', by: 'HOD Science' },
    { dept: 'Transport', person: 'Transport I/C', status: 'Cleared', amount: 0, remarks: '', by: 'Transport I/C' },
    { dept: 'Hostel (if appl.)', person: 'Warden', status: 'Cleared', amount: 0, remarks: 'N/A', by: 'Warden' }
  ]);
  const duesRecovery = dues.reduce((s, d) => s + (Number(d.amount) || 0), 0);
  const duesPending = dues.filter((d) => d.status !== 'Cleared').length;

  const [iv, setIv] = useState({ date: '2026-10-08', interviewer: 'Ms. Priya', mode: 'Self-Fill Form', q1: 'Better Opportunity', q1n: '', q2: 4, q3: 4, q4: 4, q5: 4, q6: 5, q7: 3, q8: 3, q9: 3, q10: '', q11: 'Yes', q12: '' });
  const StarRow = ({ value, onChange }: { value: number; onChange: (n: number) => void }) => (
    <div className="flex gap-1">{[1, 2, 3, 4, 5].map((n) => <button key={n} type="button" onClick={() => onChange(n)}><Star className={`w-4 h-4 ${n <= value ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} /></button>)}</div>
  );

  const [handoverTo, setHandoverTo] = useState('Ram Gupta');
  const [handoverDate, setHandoverDate] = useState('2026-10-28');
  const [tasks, setTasks] = useState([
    { task: 'Class Management (Grade 9A)', desc: 'Timetable & substitutes', to: 'Ram Gupta', due: '2026-10-25', status: 'Completed' },
    { task: 'Student Performance Records', desc: 'Term files', to: 'Ram Gupta', due: '2026-10-26', status: 'In Progress' },
    { task: 'Lab Equipment Supervision', desc: 'Inventory', to: 'Mary Jose', due: '2026-10-26', status: 'Pending' },
    { task: 'Annual Curriculum Planning Doc', desc: 'Science 2026-27', to: 'Ram Gupta', due: '2026-10-27', status: 'Pending' },
    { task: 'Exam Paper Templates', desc: 'Term 2', to: 'Mary Jose', due: '2026-10-28', status: 'Pending' }
  ]);
  const [ack, setAck] = useState(false);
  const donePct = Math.round((tasks.filter((t) => t.status === 'Completed').length / tasks.length) * 100);

  return (
    <div className="p-4 md:p-6 space-y-4 bg-gray-50 min-h-full">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Exit Process Master</h1>
        <p className="text-sm text-gray-500">Resignation, approvals, no-dues, interview and handover templates.</p>
      </div>
      {notice && <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-800 flex justify-between"><span>{notice}</span><button type="button" onClick={() => setNotice(null)}>×</button></div>}
      <div className="flex flex-wrap gap-1 border-b">
        {([['resign', '2A Resignation'], ['approval', '2B Approval Tracker'], ['dues', '2C No-Dues'], ['interview', '2D Exit Interview'], ['handover', '2E Handover']] as const).map(([id, l]) => (
          <button key={id} type="button" onClick={() => setTab(id)} className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px ${tab === id ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500'}`}>{l}</button>
        ))}
      </div>

      {tab === 'resign' && (
        <Card title="Resignation / Separation Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Resignation Date *" type="date" value={resDate} onChange={(e) => { setResDate(e.target.value); setLwd(addDays(e.target.value, POLICY_NOTICE)); }} />
            <Input label="Last Working Date *" type="date" value={lwd} onChange={(e) => setLwd(e.target.value)} />
            <Input label="Notice Period (Days)" value={`${noticeDays} (policy ${POLICY_NOTICE})`} disabled />
            <Input label="Notice Period Status" value={noticeStatus} disabled />
            <Input label="Notice Shortfall Days" value={String(shortfall)} disabled />
            <Select label="Reason for Leaving *" options={['Personal Reason', 'Better Opportunity', 'Health Issues', 'Higher Studies', 'Relocation', 'Retirement (Superannuation)', 'Termination by Management', 'Contract Completion', 'Absconding', 'Other (specify)'].map((r) => ({ value: r, label: r }))} value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
          <textarea className={`${inputClass} mt-3`} rows={3} placeholder="Employee remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
          <label className="mt-3 inline-flex items-center gap-2 text-sm border border-dashed rounded-lg px-3 py-2 cursor-pointer">📎 {letter}<input type="file" className="hidden" onChange={(e) => setLetter(e.target.files?.[0]?.name || letter)} /></label>
          <div className="flex flex-wrap gap-2 mt-4">
            <Button variant="primary" onClick={() => setNotice('Resignation submitted.')}>Submit Resignation</Button>
            <Button variant="outline" onClick={() => setPullback(true)}>Withdraw / Pullback Request</Button>
          </div>
        </Card>
      )}

      {tab === 'approval' && (
        <Card title="Approval Workflow Tracker">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr>{['Level', 'Approver Role', 'Approver Name', 'Status', 'Date & Remarks'].map((h) => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>
              {levels.map((l) => (
                <tr key={l.level} className="border-t">
                  <td className="px-3 py-2">Level {l.level}</td>
                  <td className="px-3 py-2">{l.role}</td>
                  <td className="px-3 py-2">{l.name}</td>
                  <td className="px-3 py-2"><Badge variant={l.status === 'Approved' ? 'success' : l.status === 'Pending' ? 'warning' : 'default'}>{l.status}</Badge></td>
                  <td className="px-3 py-2 text-xs">{l.date ? fmt(l.date) : '—'}{l.remarks ? ` · ${l.remarks}` : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <textarea className={`${inputClass} mt-3`} rows={2} placeholder="Comments" value={apprComment} onChange={(e) => setApprComment(e.target.value)} />
          <label className="flex items-center gap-2 text-sm mt-2"><input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} /> Notify stakeholders</label>
          <div className="flex flex-wrap gap-2 mt-3">
            <Button variant="primary" onClick={() => { setLevels((list) => list.map((l) => l.status === 'Pending' ? { ...l, status: 'Approved', date: new Date().toISOString().slice(0, 10), remarks: apprComment } : l.status === 'Locked' ? { ...l, status: 'Pending' } : l)); setNotice('Approved.'); }}>Approve</Button>
            <Button variant="danger" onClick={() => setNotice('Rejected.')}>Reject</Button>
            <Button variant="outline" onClick={() => setNotice('Put on hold.')}>Put on Hold</Button>
            <Button variant="outline" onClick={() => setNotice('Retention conversation logged.')}>Try to Retain</Button>
          </div>
        </Card>
      )}

      {tab === 'dues' && (
        <Card title={`Department-wise Clearance / No-Dues · Exit ${fmt(lwd)}`}>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr>{['Department', 'Responsible Person', 'Clearance Status', 'Recovery', 'Remarks', 'Approved By'].map((h) => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr></thead>
              <tbody>
                {dues.map((row, i) => (
                  <tr key={row.dept} className="border-t">
                    <td className="px-3 py-2 font-medium">{row.dept}</td>
                    <td className="px-3 py-2"><input className={inputClass} value={row.person} onChange={(e) => setDues((list) => list.map((r, idx) => idx === i ? { ...r, person: e.target.value } : r))} /></td>
                    <td className="px-3 py-2"><select className={inputClass} value={row.status} onChange={(e) => setDues((list) => list.map((r, idx) => idx === i ? { ...r, status: e.target.value } : r))}><option>Cleared</option><option>Pending</option><option>Recovery Needed</option></select></td>
                    <td className="px-3 py-2"><input type="number" className={inputClass} value={row.amount} onChange={(e) => setDues((list) => list.map((r, idx) => idx === i ? { ...r, amount: Number(e.target.value) || 0 } : r))} /></td>
                    <td className="px-3 py-2"><input className={inputClass} value={row.remarks} onChange={(e) => setDues((list) => list.map((r, idx) => idx === i ? { ...r, remarks: e.target.value } : r))} /></td>
                    <td className="px-3 py-2"><input className={inputClass} value={row.by} onChange={(e) => setDues((list) => list.map((r, idx) => idx === i ? { ...r, by: e.target.value } : r))} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm font-semibold mt-3">Total Recovery from Clearances: ₹{duesRecovery.toLocaleString('en-IN')} ← flows into F&F</p>
          <p className="text-sm">Overall Clearance Status: {duesPending === 0 ? 'All cleared' : `${duesPending} departments pending`}</p>
          <Button className="mt-3" variant="primary" onClick={() => setNotice('All clearances submitted.')}>Submit All Clearances</Button>
        </Card>
      )}

      {tab === 'interview' && (
        <Card title="Exit Interview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input label="Interview Date" type="date" value={iv.date} onChange={(e) => setIv({ ...iv, date: e.target.value })} />
            <Select label="Interviewer Name" options={['Ms. Priya', 'HR Manager', 'Principal'].map((n) => ({ value: n, label: n }))} value={iv.interviewer} onChange={(e) => setIv({ ...iv, interviewer: e.target.value })} />
            <Select label="Interview Mode" options={['In-Person', 'Online', 'Self-Fill Form'].map((n) => ({ value: n, label: n }))} value={iv.mode} onChange={(e) => setIv({ ...iv, mode: e.target.value })} />
          </div>
          <p className="text-sm font-semibold mt-4">Section A: Reason & Role Satisfaction</p>
          <Select label="Q1. Primary reason for leaving?" options={['Personal Reason', 'Better Opportunity', 'Health Issues', 'Other'].map((n) => ({ value: n, label: n }))} value={iv.q1} onChange={(e) => setIv({ ...iv, q1: e.target.value })} />
          <div className="flex items-center justify-between text-sm mt-2"><span>Q2. Was your role clearly defined?</span><StarRow value={iv.q2} onChange={(n) => setIv({ ...iv, q2: n })} /></div>
          <div className="flex items-center justify-between text-sm mt-2"><span>Q3. Were you satisfied with your workload?</span><StarRow value={iv.q3} onChange={(n) => setIv({ ...iv, q3: n })} /></div>
          <p className="text-sm font-semibold mt-4">Section B: Management & Environment</p>
          {([['q4', 'Q4. How was the school work environment?'], ['q5', 'Q5. Satisfaction with school management?'], ['q6', 'Q6. Relationship with colleagues?']] as const).map(([k, l]) => (
            <div key={k} className="flex items-center justify-between text-sm mt-2"><span>{l}</span><StarRow value={(iv as any)[k]} onChange={(n) => setIv({ ...iv, [k]: n })} /></div>
          ))}
          <p className="text-sm font-semibold mt-4">Section C: Compensation & Benefits</p>
          {([['q7', 'Q7. Were you satisfied with your salary?'], ['q8', 'Q8. Were benefits adequate?'], ['q9', 'Q9. Were growth opportunities available?']] as const).map(([k, l]) => (
            <div key={k} className="flex items-center justify-between text-sm mt-2"><span>{l}</span><StarRow value={(iv as any)[k]} onChange={(n) => setIv({ ...iv, [k]: n })} /></div>
          ))}
          <p className="text-sm font-semibold mt-4">Section D: Feedback</p>
          <textarea className={inputClass} rows={2} placeholder="Q10. Suggestions for school improvement" value={iv.q10} onChange={(e) => setIv({ ...iv, q10: e.target.value })} />
          <Select label="Q11. Would you recommend this school as a workplace?" options={['Yes', 'No', 'Maybe'].map((n) => ({ value: n, label: n }))} value={iv.q11} onChange={(e) => setIv({ ...iv, q11: e.target.value })} />
          <textarea className={`${inputClass} mt-2`} rows={2} placeholder="Q12. Any other comments" value={iv.q12} onChange={(e) => setIv({ ...iv, q12: e.target.value })} />
          <Button className="mt-3" variant="primary" onClick={() => setNotice('Exit interview submitted.')}>Submit Exit Interview</Button>
        </Card>
      )}

      {tab === 'handover' && (
        <Card title="Knowledge Transfer & Handover">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input label="Handover-To Person" value={handoverTo} onChange={(e) => setHandoverTo(e.target.value)} />
            <Input label="Target Completion Date" type="date" value={handoverDate} onChange={(e) => setHandoverDate(e.target.value)} />
            <Input label="Manager Overseeing" value="Mr. Kapoor" disabled />
          </div>
          <div className="overflow-x-auto mt-3">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr>{['Task / Responsibility', 'Description', 'Assigned To', 'Due Date', 'Status'].map((h) => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr></thead>
              <tbody>
                {tasks.map((t, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-3 py-2"><input className={inputClass} value={t.task} onChange={(e) => setTasks((list) => list.map((r, idx) => idx === i ? { ...r, task: e.target.value } : r))} /></td>
                    <td className="px-3 py-2"><input className={inputClass} value={t.desc} onChange={(e) => setTasks((list) => list.map((r, idx) => idx === i ? { ...r, desc: e.target.value } : r))} /></td>
                    <td className="px-3 py-2"><input className={inputClass} value={t.to} onChange={(e) => setTasks((list) => list.map((r, idx) => idx === i ? { ...r, to: e.target.value } : r))} /></td>
                    <td className="px-3 py-2"><input type="date" className={inputClass} value={t.due} onChange={(e) => setTasks((list) => list.map((r, idx) => idx === i ? { ...r, due: e.target.value } : r))} /></td>
                    <td className="px-3 py-2"><select className={inputClass} value={t.status} onChange={(e) => setTasks((list) => list.map((r, idx) => idx === i ? { ...r, status: e.target.value } : r))}><option>Pending</option><option>In Progress</option><option>Completed</option></select></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button variant="outline" className="mt-2" onClick={() => setTasks((list) => [...list, { task: '', desc: '', to: '', due: handoverDate, status: 'Pending' }])}>+ Add New Task Row</Button>
          <p className="text-sm mt-3">Handover Completion: <b>{donePct}%</b></p>
          <label className="flex items-center gap-2 text-sm mt-2"><input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} /> I confirm the handover is complete</label>
          <p className="text-xs text-gray-500">Acknowledged By: HR Admin · Date: {fmt(new Date().toISOString().slice(0, 10))}</p>
          <Button className="mt-3" variant="primary" disabled={!ack} onClick={() => setNotice('Handover submitted.')}>Submit Handover</Button>
        </Card>
      )}

      <Modal isOpen={pullback} onClose={() => setPullback(false)} title="Pullback Reason (mandatory)" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setPullback(false)}>Cancel</Button><Button variant="danger" onClick={() => { setPullback(false); setNotice('Resignation withdrawn.'); }}>Confirm Pullback</Button></div>}>
        <textarea className={inputClass} rows={3} value={pullReason} onChange={(e) => setPullReason(e.target.value)} />
      </Modal>
    </div>
  );
}

export default ExitProcessMaster;
