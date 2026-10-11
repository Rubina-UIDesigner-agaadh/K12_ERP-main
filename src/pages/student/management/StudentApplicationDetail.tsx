import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Mail, FileText, Download } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Textarea } from '../../../components/ui/Textarea';
type StreamApplication = {
  id: string;
  name: string;
  photo: string;
  roll: string;
  classSec: string;
  pct: number;
  category: string;
  p1: string;
  p2: string;
  p3: string;
  status: string;
  eligibility: string;
  allotted: string;
  submitted: string;
};

const FALLBACK: StreamApplication = {
  id: 'APP-2025-10042', name: 'Aarav Patel', photo: 'AP', roll: 'CBSE1001', classSec: '10 — A',
  pct: 91.2, category: 'General', p1: 'Science', p2: 'Commerce', p3: 'Arts',
  status: 'Accepted', eligibility: 'Eligible', allotted: 'Science', submitted: '05-06-2025 10:30'
};

const MARKS = [
  { subject: 'Mathematics', max: 100, obtained: 75, grade: 'A' },
  { subject: 'Science', max: 100, obtained: 68, grade: 'B+' },
  { subject: 'English', max: 100, obtained: 82, grade: 'A' },
  { subject: 'Social Studies', max: 100, obtained: 70, grade: 'B+' },
  { subject: 'Language', max: 100, obtained: 66, grade: 'B' }
];

export function StudentApplicationDetail({ application, onBack }: { application?: StreamApplication; onBack?: () => void } = {}) {
  const app = application ?? FALLBACK;
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([{ at: '19-06-2025 09:10', by: 'Admin Rao', text: 'Round 1 allotment verified.' }]);
  const [notice, setNotice] = useState<string | null>(null);
  const total = MARKS.reduce((s, m) => s + m.obtained, 0);
  const avg = (total / 5).toFixed(1);

  const act = (msg: string) => {
    if (msg.includes('reason') && reason.trim().length < 8) {
      setNotice('A reason of at least 8 characters is required.');
      return;
    }
    setNotice(msg);
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500 mb-1">Home → Applications → Student Detail</p>
          <h1 className="text-2xl font-bold text-gray-900">Application Detail</h1>
          <p className="text-sm text-gray-500">{app.name} — {app.roll}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="info">{app.id}</Badge>
          <Badge variant={app.status === 'Accepted' ? 'success' : app.status === 'Rejected' || app.status === 'Not Eligible' ? 'danger' : 'primary'}>{app.status}</Badge>
          <Button variant="outline" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
        </div>
      </div>
      {notice && <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">{notice}</div>}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border p-5">
            <h2 className="font-semibold mb-4">Student Profile</h2>
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold">{app.photo}</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm flex-1">
                {[
                  ['Full Name', app.name], ['Date of Birth', '15-05-2009'], ['Gender', 'Male'],
                  ['Category', app.category], ['Admission Number', 'ADM202301'], ['Board Roll Number', app.roll],
                  ['Class & Section', app.classSec], ["Father's Name", 'Rajesh Patel'], ["Mother's Name", 'Sunita Patel'],
                  ['Contact Number', '+91 98765 43210'], ['Email Address', 'aarav.parent@email.com'], ['Address', '42 Green Park, Ahmedabad']
                ].map(([k, v]) => <div key={k}><p className="text-xs text-gray-500">{k}</p><p className="font-medium">{v}</p></div>)}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-5 overflow-x-auto">
            <h2 className="font-semibold mb-3">Tenth Marks</h2>
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50"><tr>{['Subject', 'Max', 'Obtained', '%', 'Grade', 'Pass / Fail'].map((h) => <th key={h} className="px-3 py-2 text-left text-xs uppercase text-gray-500">{h}</th>)}</tr></thead>
              <tbody className="divide-y">
                {MARKS.map((m) => (
                  <tr key={m.subject}>
                    <td className="px-3 py-2">{m.subject}</td>
                    <td className="px-3 py-2">{m.max}</td>
                    <td className="px-3 py-2">{m.obtained}</td>
                    <td className="px-3 py-2">{m.obtained}%</td>
                    <td className="px-3 py-2">{m.grade}</td>
                    <td className="px-3 py-2">{m.obtained >= 33 ? '✅ Pass' : '❌ Fail'}</td>
                  </tr>
                ))}
                <tr className="font-semibold bg-gray-50">
                  <td className="px-3 py-2">Aggregate / Total</td><td className="px-3 py-2">500</td><td className="px-3 py-2">{total}</td>
                  <td className="px-3 py-2">{avg}%</td><td className="px-3 py-2">—</td><td className="px-3 py-2">PASS</td>
                </tr>
              </tbody>
            </table>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-sm">
              <p>Attendance: <b>82%</b></p>
              <p>Board Result: <b>PASS</b></p>
              <p>TC Submitted: <b>Yes</b></p>
              <p>TC Date: <b>02-06-2025</b></p>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-5">
            <h2 className="font-semibold mb-3">Submitted Preferences</h2>
            <table className="min-w-full text-sm mb-3">
              <thead className="bg-gray-50"><tr>{['', '1st Preference', '2nd Preference', '3rd Preference'].map((h) => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr></thead>
              <tbody>
                <tr><td className="px-3 py-2 text-gray-500">Stream</td><td className="px-3 py-2">{app.p1}</td><td className="px-3 py-2">{app.p2}</td><td className="px-3 py-2">{app.p3}</td></tr>
                <tr><td className="px-3 py-2 text-gray-500">Combination</td><td className="px-3 py-2">PCM</td><td className="px-3 py-2">Commerce with Math</td><td className="px-3 py-2">Humanities</td></tr>
                <tr><td className="px-3 py-2 text-gray-500">Elective</td><td className="px-3 py-2">Computer Science</td><td className="px-3 py-2">Entrepreneurship</td><td className="px-3 py-2">Psychology</td></tr>
              </tbody>
            </table>
            <p className="text-sm text-gray-600">Student's remarks: I prefer Science PCM. Interested in engineering.</p>
            <p className="text-xs text-gray-500 mt-1">Submitted On {app.submitted} · Last Edited On 05-06-2025 09:40</p>
          </div>

          <div className="bg-white rounded-xl border p-5 overflow-x-auto">
            <h2 className="font-semibold mb-3">Eligibility Check Results</h2>
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50"><tr>{['Rule Name', 'Type', 'Required', "Student's Value", 'Result'].map((h) => <th key={h} className="px-3 py-2 text-left text-xs uppercase text-gray-500">{h}</th>)}</tr></thead>
              <tbody className="divide-y">
                {[
                  ['Min Aggregate', 'Min Aggregate', '≥ 60%', `${avg}%`],
                  ['Min Math Marks', 'Min Subject Marks', '≥ 60/100', '75/100'],
                  ['Min Science Marks', 'Min Subject Marks', '≥ 60/100', '68/100'],
                  ['Must Pass Core Subjects', 'Mandatory Pass', 'Both Passed', 'Both Passed'],
                  ['Attendance Check', 'Attendance', '≥ 75%', '82%'],
                  ['Board Result', 'Board Exam', 'PASS', 'PASS']
                ].map((r) => <tr key={r[0]}>{r.map((c) => <td key={c} className="px-3 py-2">{c}</td>)}<td className="px-3 py-2">✅ Pass</td></tr>)}
              </tbody>
            </table>
            <div className="grid grid-cols-3 gap-3 mt-4 text-sm">
              {[[app.p1, '✅ ELIGIBLE'], [app.p2, '✅ ELIGIBLE'], [app.p3, '✅ ELIGIBLE']].map(([s, v]) => <div key={s} className="border rounded-lg p-3"><p className="text-gray-500">{s}</p><p className="font-semibold">{v}</p></div>)}
            </div>
            <p className="text-xs text-gray-500 mt-2">Eligibility Check Run On 07 June 2025, 2:00 PM · Done By System (Auto)</p>
          </div>

          <div className="bg-white rounded-xl border p-5 overflow-x-auto">
            <h2 className="font-semibold mb-3">Allotment History</h2>
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50"><tr>{['Round', 'Allotted Stream', 'Combination', 'Type', 'Allotted By', 'On', 'Response', 'Response Date', 'Rejection Reason'].map((h) => <th key={h} className="px-3 py-2 text-left text-xs uppercase text-gray-500">{h}</th>)}</tr></thead>
              <tbody>
                <tr>
                  <td className="px-3 py-2">Round 1</td><td className="px-3 py-2">{app.allotted || app.p1}</td><td className="px-3 py-2">PCM</td>
                  <td className="px-3 py-2">Auto</td><td className="px-3 py-2">System</td><td className="px-3 py-2">19-06-2025 09:00</td>
                  <td className="px-3 py-2">{app.status === 'Accepted' ? 'Accepted' : app.status === 'Rejected' ? 'Rejected' : 'Pending'}</td>
                  <td className="px-3 py-2">{app.status === 'Accepted' ? '21-06-2025 16:15' : '—'}</td>
                  <td className="px-3 py-2">{app.status === 'Rejected' ? 'Wanted different stream' : '—'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border p-5 space-y-3">
            <h2 className="font-semibold">Admin Actions</h2>
            <Textarea rows={2} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason (mandatory for override / cancel)" />
            <Button className="w-full" onClick={() => act('Marked Eligible. Reason stored.')}><CheckCircle className="w-4 h-4 mr-1" /> Mark Eligible</Button>
            <Button variant="outline" className="w-full" onClick={() => act('Marked Not Eligible. Reason stored.')}><XCircle className="w-4 h-4 mr-1" /> Mark Not Eligible</Button>
            <Button variant="outline" className="w-full" onClick={() => act('Manual allotment saved with reason.')}>🎯 Manual Allot</Button>
            <Button variant="outline" className="w-full" onClick={() => act('Added to waitlist.')}>⏳ Add to Waitlist</Button>
            <Button variant="danger" className="w-full" onClick={() => act('Application cancelled. Reason stored.')}>🚫 Cancel</Button>
            <Button variant="outline" className="w-full" onClick={() => act('Message queued to student.')}><Mail className="w-4 h-4 mr-1" /> Notify</Button>
            <div className="flex gap-2">
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Internal note" className="flex-1 px-3 py-2 border rounded-lg text-sm" />
              <Button variant="outline" onClick={() => { if (!note.trim()) return; setNotes((n) => [{ at: new Date().toLocaleString('en-IN'), by: 'Current Admin', text: note.trim() }, ...n]); setNote(''); }}>Add</Button>
            </div>
            <Button variant="outline" className="w-full" onClick={() => window.print()}><Download className="w-4 h-4 mr-1" /> Download PDF</Button>
          </div>
          <div className="bg-white rounded-xl border p-5">
            <h2 className="font-semibold mb-3">Internal Notes</h2>
            {notes.map((n, i) => <div key={i} className="text-sm border-b py-2"><p>{n.text}</p><p className="text-xs text-gray-500">{n.at} · {n.by}</p></div>)}
          </div>
          <div className="bg-white rounded-xl border p-5">
            <h2 className="font-semibold mb-3 flex items-center gap-2"><FileText className="w-4 h-4" /> Audit Log</h2>
            <ul className="text-xs space-y-2 text-gray-600">
              <li>05 Jun 2025, 10:30 AM · Application Submitted · Student</li>
              <li>07 Jun 2025, 2:00 PM · Eligibility Check Run · System (Auto)</li>
              <li>19 Jun 2025, 9:00 AM · Stream Allotted — Science PCM · System</li>
              <li>21 Jun 2025, 4:15 PM · Allotment Accepted · Student</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentApplicationDetail;
