import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Mail, FileText, Download, Eye } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Textarea } from '../../../components/ui/Textarea';
const STREAM_STORE_KEY = 'k12-stream-selection-v1';

type AppStatus =
  | 'Draft' | 'Submitted' | 'Under Review' | 'Eligible' | 'Not Eligible'
  | 'Allotted' | 'Waitlisted' | 'Accepted' | 'Rejected';

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
  status: AppStatus | string;
  eligibility: string;
  allotted: string;
  submitted: string;
  year?: string;
  round?: string;
};

type StreamDoc = {
  id: string;
  student: string;
  roll: string;
  type: string;
  uploaded: string;
  size: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  remarks: string;
};

const stamp = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getDate())}-${p(d.getMonth() + 1)}-${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

const streamMeets = (pct: number, stream: string) => {
  if (stream === 'Science') return pct >= 75;
  if (stream === 'Commerce') return pct >= 60;
  if (stream === 'Arts') return pct >= 45;
  return pct >= 40;
};

const loadStore = () => {
  try {
    const raw = window.localStorage.getItem(STREAM_STORE_KEY);
    return raw ? JSON.parse(raw) : { applications: [], docs: [], audit: [], waitlist: [] };
  } catch {
    return { applications: [], docs: [], audit: [], waitlist: [] };
  }
};

const saveStore = (store: any) => window.localStorage.setItem(STREAM_STORE_KEY, JSON.stringify(store));

const pushAudit = (store: any, action: string, entity: string, detail: string) => {
  store.audit = [{ at: stamp(), actor: 'Admin Rao', role: 'Admin', action, entity, detail, ip: '10.0.1.12' }, ...(store.audit || [])];
};

const runEligibilityOn = (app: StreamApplication): StreamApplication => {
  const any = streamMeets(app.pct, app.p1) || streamMeets(app.pct, app.p2) || streamMeets(app.pct, app.p3);
  const locked = app.status === 'Allotted' || app.status === 'Accepted' || app.status === 'Waitlisted' || app.status === 'Rejected' || app.status === 'Draft';
  return { ...app, eligibility: any ? 'Eligible' : 'Not Eligible', status: locked ? app.status : any ? 'Eligible' : 'Not Eligible' };
};

const FALLBACK: StreamApplication = {
  id: 'APP-2025-10042', name: 'Aarav Patel', photo: 'AP', roll: 'CBSE1001', classSec: '10 — A',
  pct: 91.2, category: 'General', p1: 'Science', p2: 'Commerce', p3: 'Arts',
  status: 'Accepted', eligibility: 'Eligible', allotted: 'Science', submitted: '05-06-2025 10:30',
  year: '2025-26', round: 'Round 1'
};

const MARKS_FOR = (pct: number) => {
  const math = Math.min(99, Math.round(pct + 4));
  const sci = Math.min(99, Math.round(pct - 3));
  const eng = Math.min(99, Math.round(pct + 1));
  const sst = Math.min(99, Math.round(pct - 6));
  const lang = Math.min(99, Math.round(pct - 8));
  const grade = (n: number) => n >= 80 ? 'A' : n >= 70 ? 'B+' : n >= 60 ? 'B' : n >= 45 ? 'C' : 'D';
  return [
    { subject: 'Mathematics', max: 100, obtained: math, grade: grade(math) },
    { subject: 'Science', max: 100, obtained: sci, grade: grade(sci) },
    { subject: 'English', max: 100, obtained: eng, grade: grade(eng) },
    { subject: 'Social Studies', max: 100, obtained: sst, grade: grade(sst) },
    { subject: 'Language', max: 100, obtained: lang, grade: grade(lang) }
  ];
};

export function StudentApplicationDetail({
  application,
  onBack,
  onChange
}: {
  application?: StreamApplication;
  onBack?: () => void;
  onChange?: (app: StreamApplication) => void;
} = {}) {
  const [app, setApp] = useState<StreamApplication>(application ?? FALLBACK);
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([{ at: '19-06-2025 09:10', by: 'Admin Rao', text: 'Round 1 allotment verified.' }]);
  const [notice, setNotice] = useState<string | null>(null);
  const [allotStream, setAllotStream] = useState(application?.p1 || 'Science');
  const [mailBody, setMailBody] = useState('');
  const [pickedDoc, setPickedDoc] = useState<StreamDoc | null>(null);
  const [docReason, setDocReason] = useState('');
  const [docs, setDocs] = useState<StreamDoc[]>(() => (loadStore().docs || []).filter((d: StreamDoc) => d.roll === (application ?? FALLBACK).roll));

  useEffect(() => {
    if (application) {
      setApp(application);
      setAllotStream(application.allotted || application.p1);
      setDocs((loadStore().docs || []).filter((d: StreamDoc) => d.roll === application.roll));
    }
  }, [application]);

  const marks = useMemo(() => MARKS_FOR(app.pct), [app.pct]);
  const total = marks.reduce((s, m) => s + m.obtained, 0);
  const avg = (total / 5).toFixed(1);

  const persistApp = (next: StreamApplication, action: string, detail: string) => {
    setApp(next);
    onChange?.(next);
    const store = loadStore();
    store.applications = store.applications || [];
    store.docs = store.docs || [];
    store.audit = store.audit || [];
    store.waitlist = store.waitlist || [];
    if (store.applications.some((a: StreamApplication) => a.id === next.id)) {
      store.applications = store.applications.map((a: StreamApplication) => a.id === next.id ? next : a);
    } else {
      store.applications = [next, ...store.applications];
    }
    pushAudit(store, action, next.id, detail);
    saveStore(store);
  };

  const needReason = () => {
    if (reason.trim().length < 8) {
      setNotice('A reason of at least 8 characters is required.');
      return false;
    }
    return true;
  };

  const updateDoc = (status: 'Verified' | 'Rejected') => {
    if (!pickedDoc) return;
    if (status === 'Rejected' && docReason.trim().length < 8) {
      setNotice('Rejection remarks of at least 8 characters are required.');
      return;
    }
    const nextDocs = loadStore();
    nextDocs.docs = (nextDocs.docs || []).map((d: StreamDoc) => d.id === pickedDoc.id ? { ...d, status, remarks: docReason } : d);
    pushAudit(nextDocs, status === 'Verified' ? 'Document Verified' : 'Document Rejected', app.name, `${pickedDoc.type} — ${docReason || 'verified'}`);
    saveStore(nextDocs);
    setDocs(nextDocs.docs.filter((d: StreamDoc) => d.roll === app.roll));
    setPickedDoc({ ...pickedDoc, status, remarks: docReason });
    setNotice(`${pickedDoc.type} ${status.toLowerCase()} for ${app.name}.`);
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
          <Badge variant={app.status === 'Accepted' || app.status === 'Eligible' || app.status === 'Allotted' ? 'success' : app.status === 'Rejected' || app.status === 'Not Eligible' ? 'danger' : 'primary'}>{app.status}</Badge>
          {onBack && <Button variant="outline" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>}
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
                  ['Full Name', app.name], ['Date of Birth', '15-05-2009'], ['Gender', '—'],
                  ['Category', app.category], ['Admission Number', app.id.replace('APP-', 'ADM')], ['Board Roll Number', app.roll],
                  ['Class & Section', app.classSec], ['Academic Year', app.year], ['Round', app.round],
                  ['Contact Number', '+91 98765 43210'], ['Email Address', `${app.name.split(' ')[0].toLowerCase()}.parent@email.com`], ['Submitted', app.submitted]
                ].map(([k, v]) => <div key={k}><p className="text-xs text-gray-500">{k}</p><p className="font-medium">{v}</p></div>)}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-5 overflow-x-auto">
            <h2 className="font-semibold mb-3">Tenth Marks</h2>
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50"><tr>{['Subject', 'Max', 'Obtained', '%', 'Grade', 'Pass / Fail'].map((h) => <th key={h} className="px-3 py-2 text-left text-xs uppercase text-gray-500">{h}</th>)}</tr></thead>
              <tbody className="divide-y">
                {marks.map((m) => (
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
              <p>Recorded Aggregate: <b>{app.pct}%</b></p>
              <p>Board Result: <b>PASS</b></p>
              <p>Category: <b>{app.category}</b></p>
              <p>Eligibility: <b>{app.eligibility}</b></p>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-5">
            <h2 className="font-semibold mb-3">Submitted Preferences</h2>
            <table className="min-w-full text-sm mb-3">
              <thead className="bg-gray-50"><tr>{['', '1st Preference', '2nd Preference', '3rd Preference'].map((h) => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr></thead>
              <tbody>
                <tr><td className="px-3 py-2 text-gray-500">Stream</td><td className="px-3 py-2">{app.p1}</td><td className="px-3 py-2">{app.p2}</td><td className="px-3 py-2">{app.p3}</td></tr>
                <tr><td className="px-3 py-2 text-gray-500">Meets cutoff</td>
                  <td className="px-3 py-2">{streamMeets(app.pct, app.p1) ? '✅ Yes' : '❌ No'}</td>
                  <td className="px-3 py-2">{streamMeets(app.pct, app.p2) ? '✅ Yes' : '❌ No'}</td>
                  <td className="px-3 py-2">{streamMeets(app.pct, app.p3) ? '✅ Yes' : '❌ No'}</td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-gray-500">Submitted On {app.submitted} · Allotted {app.allotted || '—'}</p>
          </div>

          <div className="bg-white rounded-xl border p-5 overflow-x-auto">
            <h2 className="font-semibold mb-3">Document Verification</h2>
            <p className="text-xs text-gray-500 mb-3">Review documents for this application (Document Verification is handled here).</p>
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50"><tr>{['Document', 'Uploaded', 'Size', 'Status', ''].map((h) => <th key={h} className="px-3 py-2 text-left text-xs uppercase text-gray-500">{h}</th>)}</tr></thead>
              <tbody className="divide-y">
                {docs.length === 0 && <tr><td colSpan={5} className="px-3 py-4 text-gray-400">No documents uploaded.</td></tr>}
                {docs.map((d) => (
                  <tr key={d.id} className={pickedDoc?.id === d.id ? 'bg-indigo-50' : ''}>
                    <td className="px-3 py-2">{d.type}</td>
                    <td className="px-3 py-2">{d.uploaded}</td>
                    <td className="px-3 py-2">{d.size}</td>
                    <td className="px-3 py-2"><Badge variant={d.status === 'Verified' ? 'success' : d.status === 'Rejected' ? 'danger' : 'warning'}>{d.status}</Badge></td>
                    <td className="px-3 py-2"><Button size="sm" variant="ghost" onClick={() => { setPickedDoc(d); setDocReason(d.remarks); }}><Eye className="w-4 h-4" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {pickedDoc && (
              <div className="mt-4 border rounded-lg p-4 space-y-3">
                <div className="h-28 bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-500">Preview · {pickedDoc.type}</div>
                <p className="text-sm"><b>{pickedDoc.type}</b> · {pickedDoc.size}</p>
                <Textarea rows={2} value={docReason} onChange={(e) => setDocReason(e.target.value)} placeholder="Verifier remarks / rejection reason" />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => updateDoc('Verified')}><CheckCircle className="w-4 h-4 mr-1" /> Verify</Button>
                  <Button size="sm" variant="outline" onClick={() => updateDoc('Rejected')}><XCircle className="w-4 h-4 mr-1" /> Reject</Button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border p-5 overflow-x-auto">
            <h2 className="font-semibold mb-3">Eligibility Check Results</h2>
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50"><tr>{['Rule Name', 'Required', "Student's Value", 'Result'].map((h) => <th key={h} className="px-3 py-2 text-left text-xs uppercase text-gray-500">{h}</th>)}</tr></thead>
              <tbody className="divide-y">
                {[
                  ['Min Aggregate Science', '≥ 75%', `${app.pct}%`, streamMeets(app.pct, 'Science')],
                  ['Min Aggregate Commerce', '≥ 60%', `${app.pct}%`, streamMeets(app.pct, 'Commerce')],
                  ['Min Aggregate Arts', '≥ 45%', `${app.pct}%`, streamMeets(app.pct, 'Arts')],
                  ['Board Result', 'PASS', 'PASS', true]
                ].map((r) => (
                  <tr key={String(r[0])}>
                    <td className="px-3 py-2">{r[0]}</td>
                    <td className="px-3 py-2">{r[1]}</td>
                    <td className="px-3 py-2">{r[2]}</td>
                    <td className="px-3 py-2">{r[3] ? '✅ Pass' : '❌ Fail'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="grid grid-cols-3 gap-3 mt-4 text-sm">
              {[[app.p1, streamMeets(app.pct, app.p1)], [app.p2, streamMeets(app.pct, app.p2)], [app.p3, streamMeets(app.pct, app.p3)]].map(([s, v]) => (
                <div key={String(s)} className="border rounded-lg p-3"><p className="text-gray-500">{String(s)}</p><p className="font-semibold">{v ? '✅ ELIGIBLE' : '❌ NOT ELIGIBLE'}</p></div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border p-5 space-y-3">
            <h2 className="font-semibold">Admin Actions</h2>
            <Textarea rows={2} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason (mandatory for override / cancel)" />
            <select value={allotStream} onChange={(e) => setAllotStream(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
              {[app.p1, app.p2, app.p3].filter((v, i, a) => a.indexOf(v) === i).map((s) => <option key={s}>{s}</option>)}
            </select>
            <Button className="w-full" onClick={() => { if (!needReason()) return; persistApp({ ...app, eligibility: 'Eligible', status: 'Eligible' }, 'Mark Eligible', reason); setNotice('Marked Eligible.'); }}><CheckCircle className="w-4 h-4 mr-1" /> Mark Eligible</Button>
            <Button variant="outline" className="w-full" onClick={() => { if (!needReason()) return; persistApp({ ...app, eligibility: 'Not Eligible', status: 'Not Eligible' }, 'Mark Not Eligible', reason); setNotice('Marked Not Eligible.'); }}><XCircle className="w-4 h-4 mr-1" /> Mark Not Eligible</Button>
            <Button variant="outline" className="w-full" onClick={() => { persistApp(runEligibilityOn(app), 'Eligibility Run', `Single check for ${app.name}`); setNotice('Eligibility re-checked against cutoff rules.'); }}>▶ Re-run Eligibility</Button>
            <Button variant="outline" className="w-full" onClick={() => { persistApp({ ...app, status: 'Allotted', allotted: allotStream, eligibility: 'Eligible' }, 'Manual Allotment', allotStream); setNotice(`Allotted ${allotStream}.`); }}>🎯 Manual Allot</Button>
            <Button variant="outline" className="w-full" onClick={() => {
              persistApp({ ...app, status: 'Waitlisted' }, 'Waitlist Add', reason || 'Added from detail');
              const store = loadStore();
              store.waitlist = store.waitlist || [];
              if (!store.waitlist.some((w: { roll: string }) => w.roll === app.roll)) {
                store.waitlist = [...store.waitlist, { pos: store.waitlist.length + 1, name: app.name, roll: app.roll, cat: app.category, pct: app.pct, stream: allotStream, comb: allotStream === 'Science' ? 'PCM' : allotStream, why: reason || 'Added from application detail', date: stamp().split(' ')[0], round: app.round, notified: 'No' }];
                saveStore(store);
              }
              setNotice('Added to waitlist.');
            }}>⏳ Add to Waitlist</Button>
            <Button variant="danger" className="w-full" onClick={() => { if (!needReason()) return; persistApp({ ...app, status: 'Rejected' }, 'Cancel Application', reason); setNotice('Application cancelled.'); }}>🚫 Cancel</Button>
            <Textarea rows={2} value={mailBody} onChange={(e) => setMailBody(e.target.value)} placeholder="Notification message" />
            <Button variant="outline" className="w-full" onClick={() => {
              const store = loadStore();
              pushAudit(store, 'Notification', app.id, mailBody || `Update sent to ${app.name}`);
              saveStore(store);
              setNotice('Message queued to student.');
            }}><Mail className="w-4 h-4 mr-1" /> Notify</Button>
            <div className="flex gap-2">
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Internal note" className="flex-1 px-3 py-2 border rounded-lg text-sm" />
              <Button variant="outline" onClick={() => { if (!note.trim()) return; setNotes((n) => [{ at: stamp(), by: 'Current Admin', text: note.trim() }, ...n]); setNote(''); }}>Add</Button>
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
              {(loadStore().audit || []).filter((a: { entity: string; detail: string }) => a.entity.includes(app.id) || a.entity.includes(app.name) || a.detail.includes(app.name)).slice(0, 8).map((a: { at: string; action: string; detail: string; actor: string }) => (
                <li key={a.at + a.action}>{a.at} · {a.action} · {a.detail} · {a.actor}</li>
              ))}
              {(loadStore().audit || []).filter((a: { entity: string }) => a.entity.includes(app.id) || a.entity.includes(app.name)).length === 0 && (
                <li>No application-specific audit entries yet.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentApplicationDetail;
