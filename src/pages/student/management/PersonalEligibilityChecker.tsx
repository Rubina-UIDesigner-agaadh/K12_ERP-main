import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

const RESULT = [
  { stream: 'Science', ok: true, reason: 'Aggregate 91.2% and PCM 88% meet cut-off.' },
  { stream: 'Commerce', ok: true, reason: 'Aggregate above 60%.' },
  { stream: 'Arts', ok: true, reason: 'Aggregate above 50%.' },
  { stream: 'Vocational', ok: true, reason: 'Class 10 passed.' }
];

export function PersonalEligibilityChecker() {
  const [ran, setRan] = useState(false);

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen max-w-3xl">
      <div>
        <p className="text-xs text-gray-500">Home → Eligibility Checker</p>
        <h1 className="text-2xl font-bold mt-1">Personal Eligibility Checker</h1>
        <p className="text-sm text-gray-500">Uses your Class 10 marks already on file. This is indicative, not an allotment.</p>
      </div>

      <div className="bg-white rounded-xl border p-5 space-y-2 text-sm">
        <p><b>Priya Sharma</b> · CBSE1001 · General</p>
        <p>Aggregate 91.2% · Attendance 96% · Board CBSE</p>
        <p>PCM 88% · PCB 86%</p>
        <Button className="mt-3" onClick={() => setRan(true)}>Run eligibility</Button>
      </div>

      {ran && (
        <div className="bg-white rounded-xl border divide-y">
          {RESULT.map((r) => (
            <div key={r.stream} className="px-5 py-4 flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{r.stream}</p>
                <p className="text-sm text-gray-600">{r.reason}</p>
              </div>
              <Badge variant={r.ok ? 'success' : 'danger'}>{r.ok ? 'Eligible' : 'Not eligible'}</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PersonalEligibilityChecker;
