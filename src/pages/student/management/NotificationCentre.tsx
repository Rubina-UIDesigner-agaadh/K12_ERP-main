import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

const NOTES = [
  { id: 1, title: 'Round 1 result date announced', body: 'Allotment result on 24 Jun 2025 10:00 AM.', at: '21-06-2025', unread: true, tag: 'Allotment' },
  { id: 2, title: 'Income certificate pending', body: 'Upload a clearer scan before freeze.', at: '19-06-2025', unread: true, tag: 'Documents' },
  { id: 3, title: 'Preferences received', body: 'Science > Commerce > Arts locked until freeze.', at: '15-06-2025', unread: false, tag: 'Application' },
  { id: 4, title: 'Counsellor helpdesk', body: 'Walk-in 10 AM–2 PM, Room 12.', at: '12-06-2025', unread: false, tag: 'Help' }
];

export function NotificationCentre() {
  const [items, setItems] = useState(NOTES);

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen max-w-3xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500">Home → Notifications</p>
          <div className="flex items-center gap-2 mt-1"><Bell className="w-6 h-6 text-indigo-600" /><h1 className="text-2xl font-bold">Notification Centre</h1></div>
        </div>
        <Button variant="outline" onClick={() => setItems((n) => n.map((x) => ({ ...x, unread: false })))}>Mark all read</Button>
      </div>

      <div className="space-y-3">
        {items.map((n) => (
          <button key={n.id} type="button" onClick={() => setItems((rows) => rows.map((r) => r.id === n.id ? { ...r, unread: false } : r))} className={`w-full text-left bg-white border rounded-xl p-4 ${n.unread ? 'border-indigo-300' : ''}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{n.title}</p>
                <p className="text-sm text-gray-600 mt-1">{n.body}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">{n.at}</p>
                <Badge variant={n.unread ? 'info' : 'secondary'}>{n.tag}</Badge>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default NotificationCentre;
