import React from 'react';
import { Badge } from '../../../components/ui/Badge';

const TIMELINE = [
  { at: '15-06-2025 09:10', title: 'Application created', detail: 'APP-1001 drafted', state: 'done' },
  { at: '15-06-2025 10:02', title: 'Preferences submitted', detail: 'Science > Commerce > Arts', state: 'done' },
  { at: '16-06-2025 14:20', title: 'Documents uploaded', detail: 'Marksheet + TC verified', state: 'done' },
  { at: '20-06-2025 09:40', title: 'Eligibility checked', detail: 'Eligible for Science, Commerce, Arts', state: 'done' },
  { at: '—', title: 'Allotment Round 1', detail: 'Result expected 24 Jun 2025', state: 'current' },
  { at: '—', title: 'Accept / decline seat', detail: '48-hour window after result', state: 'pending' }
];

export function ApplicationStatusTracker() {
  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen max-w-3xl">
      <div>
        <p className="text-xs text-gray-500">Home → Application Status</p>
        <h1 className="text-2xl font-bold mt-1">Application Status Tracker</h1>
        <p className="text-sm text-gray-500">APP-1001 · Priya Sharma · 2025-26</p>
      </div>

      <div className="bg-white rounded-xl border p-5 flex flex-wrap gap-3 items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">Current stage</p>
          <p className="font-semibold">Awaiting Round 1 allotment</p>
        </div>
        <Badge variant="warning">In progress</Badge>
      </div>

      <ol className="space-y-3">
        {TIMELINE.map((t) => (
          <li key={t.title} className={`bg-white border rounded-xl p-4 ${t.state === 'current' ? 'ring-2 ring-indigo-400' : ''}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{t.title}</p>
                <p className="text-sm text-gray-600">{t.detail}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">{t.at}</p>
                <Badge variant={t.state === 'done' ? 'success' : t.state === 'current' ? 'info' : 'secondary'}>{t.state}</Badge>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default ApplicationStatusTracker;
