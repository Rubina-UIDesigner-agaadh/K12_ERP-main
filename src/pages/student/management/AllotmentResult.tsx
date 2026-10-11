import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Textarea } from '../../../components/ui/Textarea';

export function AllotmentResult() {
  const [decision, setDecision] = useState<'none' | 'accept' | 'decline'>('none');
  const [reason, setReason] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen max-w-3xl">
      <div>
        <p className="text-xs text-gray-500">Home → Allotment Result</p>
        <h1 className="text-2xl font-bold mt-1">Allotment Result — Round 1</h1>
        <p className="text-sm text-gray-500">Priya Sharma · APP-1001 · 2025-26</p>
      </div>
      {notice && <div className="rounded-lg bg-indigo-50 border border-indigo-200 px-4 py-3 text-sm text-indigo-800">{notice}</div>}

      <div className="bg-white rounded-xl border p-6 space-y-3">
        <Badge variant="success">Provisional allotment</Badge>
        <h2 className="text-xl font-bold">Science — PCM</h2>
        <p className="text-sm text-gray-600">Section A · Elective: Computer Science · Category: General</p>
        <p className="text-sm">Respond by <b>26 Jun 2025 11:59 PM</b> (48 hours). No response moves the seat to waitlist.</p>
      </div>

      {decision === 'none' && (
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setDecision('accept')}>Accept seat</Button>
          <Button variant="outline" onClick={() => setDecision('decline')}>Decline / wait for next round</Button>
        </div>
      )}

      {decision === 'accept' && (
        <div className="bg-white rounded-xl border p-5 space-y-3">
          <p className="text-sm">You are accepting Science — PCM. Download the allotment letter after confirmation.</p>
          <Button onClick={() => setNotice('Seat accepted. Allotment letter is ready.')}>Confirm acceptance</Button>
        </div>
      )}

      {decision === 'decline' && (
        <div className="bg-white rounded-xl border p-5 space-y-3">
          <Textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Optional reason for declining" />
          <Button variant="outline" onClick={() => setNotice('Decline recorded. You remain on waitlist for higher preferences if any.')}>Confirm decline</Button>
        </div>
      )}
    </div>
  );
}

export default AllotmentResult;
