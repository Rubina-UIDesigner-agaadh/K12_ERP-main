import React, { useState } from 'react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

const STREAMS = [
  { name: 'Science', seats: 80, combos: ['PCM', 'PCB', 'PCMB'], subjects: 'Physics, Chemistry, Maths / Biology', careers: 'Engineering, Medicine, Research', cutoff: '70% agg, 75% in PCM/PCB' },
  { name: 'Commerce', seats: 70, combos: ['Commerce with Math', 'Commerce without Math'], subjects: 'Accountancy, BST, Economics', careers: 'CA, Banking, Business', cutoff: '60% agg' },
  { name: 'Arts', seats: 55, combos: ['Humanities', 'Humanities with Psychology'], subjects: 'History, Pol. Science, Geography', careers: 'Civil services, Media, Law', cutoff: '50% agg' },
  { name: 'Vocational', seats: 25, combos: ['IT', 'Retail'], subjects: 'Skill papers + language', careers: 'Jobs + further skill courses', cutoff: 'Pass in Class 10' }
];

export function StreamExplorer() {
  const [picked, setPicked] = useState(STREAMS[0]);

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div>
        <p className="text-xs text-gray-500">Home → Explore Streams</p>
        <h1 className="text-2xl font-bold mt-1">Stream Explorer</h1>
        <p className="text-sm text-gray-500">Compare streams, combinations and typical cut-offs for 2025-26</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {STREAMS.map((s) => (
          <button key={s.name} type="button" onClick={() => setPicked(s)} className={`text-left bg-white border rounded-xl p-4 ${picked.name === s.name ? 'ring-2 ring-indigo-500' : ''}`}>
            <p className="font-semibold">{s.name}</p>
            <p className="text-xs text-gray-500 mt-1">{s.seats} seats</p>
            <div className="flex flex-wrap gap-1 mt-2">{s.combos.map((c) => <Badge key={c} variant="secondary">{c}</Badge>)}</div>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-bold">{picked.name}</h2>
          <p className="text-sm text-gray-600 mt-2"><b>Subjects:</b> {picked.subjects}</p>
          <p className="text-sm text-gray-600 mt-2"><b>Careers:</b> {picked.careers}</p>
          <p className="text-sm text-gray-600 mt-2"><b>Eligibility hint:</b> {picked.cutoff}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Combinations</h3>
          <ul className="space-y-2">{picked.combos.map((c) => <li key={c} className="border rounded-lg px-3 py-2 text-sm">{c}</li>)}</ul>
          <Button className="mt-4">Check my eligibility</Button>
        </div>
      </div>
    </div>
  );
}

export default StreamExplorer;
