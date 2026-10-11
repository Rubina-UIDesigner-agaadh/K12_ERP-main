import React from 'react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

const STEPS = [
  { id: 1, label: 'Explore Streams', done: true },
  { id: 2, label: 'Check Eligibility', done: true },
  { id: 3, label: 'Submit Preferences', done: true },
  { id: 4, label: 'Documents', done: false },
  { id: 5, label: 'Await Allotment', done: false },
  { id: 6, label: 'Accept Seat', done: false }
];

export function StudentStreamDashboard() {
  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div>
        <p className="text-xs text-gray-500">Home → My Stream Selection</p>
        <h1 className="text-2xl font-bold mt-1">Hi Priya, your stream journey</h1>
        <p className="text-sm text-gray-500">Academic Year 2025-26 · Roll CBSE1001</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-white border rounded-xl p-4"><p className="text-xs text-gray-500">Application</p><p className="font-semibold">APP-1001</p><Badge variant="info">Submitted</Badge></div>
        <div className="bg-white border rounded-xl p-4"><p className="text-xs text-gray-500">Eligibility</p><p className="font-semibold">Science, Commerce, Arts</p><Badge variant="success">Eligible</Badge></div>
        <div className="bg-white border rounded-xl p-4"><p className="text-xs text-gray-500">1st Preference</p><p className="font-semibold">Science — PCM</p></div>
        <div className="bg-white border rounded-xl p-4"><p className="text-xs text-gray-500">Allotment</p><p className="font-semibold">Awaiting Round 1</p><Badge variant="warning">Pending</Badge></div>
      </div>

      <div className="bg-white rounded-xl border p-5">
        <h2 className="font-semibold mb-4">Progress</h2>
        <ol className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {STEPS.map((s) => (
            <li key={s.id} className={`rounded-lg border p-3 text-sm ${s.done ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50'}`}>
              <p className="text-xs text-gray-500">Step {s.id}</p>
              <p className="font-medium">{s.label}</p>
              <p className="text-xs mt-1">{s.done ? 'Done' : 'Open'}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-5">
          <h3 className="font-semibold">Documents</h3>
          <p className="text-sm text-gray-500 mt-1">2 of 4 verified. Income certificate pending.</p>
          <Button className="mt-3" variant="outline">Upload remaining</Button>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <h3 className="font-semibold">Notifications</h3>
          <p className="text-sm text-gray-500 mt-1">Round 1 result on 24 Jun 2025.</p>
          <Button className="mt-3" variant="outline">Open centre</Button>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <h3 className="font-semibold">Help</h3>
          <p className="text-sm text-gray-500 mt-1">Counsellor window: 10 AM – 2 PM on working days.</p>
          <Button className="mt-3" variant="outline">Raise query</Button>
        </div>
      </div>
    </div>
  );
}

export default StudentStreamDashboard;
