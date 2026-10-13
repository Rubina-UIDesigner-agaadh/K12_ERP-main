import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Textarea } from '../../../components/ui/Textarea';

const DOCS = [
  { student: 'Priya Sharma', roll: 'CBSE1001', type: 'Class 10 Marksheet', uploaded: '15-06-2025', size: '2.1 MB', status: 'Pending', preview: true },
  { student: 'Arjun Patel', roll: 'CBSE1002', type: 'Caste Certificate', uploaded: '16-06-2025', size: '1.4 MB', status: 'Verified', preview: true },
  { student: 'Rohan Mehta', roll: 'CBSE1003', type: 'Income Certificate', uploaded: '17-06-2025', size: '980 KB', status: 'Rejected', preview: true },
  { student: 'Ananya Iyer', roll: 'CBSE1004', type: 'Transfer Certificate', uploaded: '18-06-2025', size: '1.1 MB', status: 'Pending', preview: true }
];

export function DocumentVerification() {
  const [status, setStatus] = useState('All');
  const [type, setType] = useState('All');
  const [picked, setPicked] = useState<typeof DOCS[0] | null>(null);
  const [reason, setReason] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const rows = DOCS.filter((d) => (status === 'All' || d.status === status) && (type === 'All' || d.type === type));
  const counts = { pending: DOCS.filter((d) => d.status === 'Pending').length, verified: DOCS.filter((d) => d.status === 'Verified').length, rejected: DOCS.filter((d) => d.status === 'Rejected').length };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div>
        <p className="text-xs text-gray-500">Home → Documents → Verification Queue</p>
        <h1 className="text-2xl font-bold mt-1">Document Verification</h1>
        <p className="text-sm text-gray-500">Review uploaded documents for stream applications</p>
      </div>
      {notice && <div className="rounded-lg bg-indigo-50 border border-indigo-200 px-4 py-3 text-sm text-indigo-800">{notice}</div>}

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border rounded-xl p-4"><p className="text-xs text-gray-500">Pending</p><p className="text-2xl font-bold text-amber-600">{counts.pending}</p></div>
        <div className="bg-white border rounded-xl p-4"><p className="text-xs text-gray-500">Verified</p><p className="text-2xl font-bold text-emerald-600">{counts.verified}</p></div>
        <div className="bg-white border rounded-xl p-4"><p className="text-xs text-gray-500">Rejected</p><p className="text-2xl font-bold text-red-600">{counts.rejected}</p></div>
      </div>

      <div className="flex flex-wrap gap-3">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 border rounded-lg text-sm bg-white"><option>All</option><option>Pending</option><option>Verified</option><option>Rejected</option></select>
        <select value={type} onChange={(e) => setType(e.target.value)} className="px-3 py-2 border rounded-lg text-sm bg-white"><option>All</option><option>Class 10 Marksheet</option><option>Caste Certificate</option><option>Income Certificate</option><option>Transfer Certificate</option></select>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-xl border overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50"><tr>{['Student', 'Roll', 'Document', 'Uploaded', 'Size', 'Status', ''].map((h) => <th key={h} className="px-3 py-2 text-left text-xs uppercase text-gray-500">{h}</th>)}</tr></thead>
            <tbody className="divide-y">
              {rows.map((d) => (
                <tr key={d.roll + d.type} className={picked?.roll === d.roll && picked?.type === d.type ? 'bg-indigo-50' : ''}>
                  <td className="px-3 py-2 font-medium">{d.student}</td>
                  <td className="px-3 py-2">{d.roll}</td>
                  <td className="px-3 py-2">{d.type}</td>
                  <td className="px-3 py-2">{d.uploaded}</td>
                  <td className="px-3 py-2">{d.size}</td>
                  <td className="px-3 py-2"><Badge variant={d.status === 'Verified' ? 'success' : d.status === 'Rejected' ? 'danger' : 'warning'}>{d.status}</Badge></td>
                  <td className="px-3 py-2"><Button size="sm" variant="ghost" onClick={() => setPicked(d)}><Eye className="w-4 h-4" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white rounded-xl border p-5 space-y-3">
          <h2 className="font-semibold">Review Panel</h2>
          {picked ? (
            <>
              <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-500">Preview · {picked.type}</div>
              <p className="text-sm"><b>{picked.student}</b> · {picked.roll}</p>
              <p className="text-xs text-gray-500">{picked.uploaded} · {picked.size}</p>
              <Textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Verifier remarks / rejection reason" />
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => setNotice(`${picked.type} verified for ${picked.student}.`)}><CheckCircle className="w-4 h-4 mr-1" /> Verify</Button>
                <Button variant="outline" onClick={() => setNotice(reason.trim() ? `${picked.type} rejected.` : 'Rejection reason required.')}><XCircle className="w-4 h-4 mr-1" /> Reject</Button>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500 flex items-center gap-2"><Clock className="w-4 h-4" /> Select a document to review.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DocumentVerification;
