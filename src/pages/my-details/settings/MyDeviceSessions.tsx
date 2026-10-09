import React from 'react';
import { Smartphone, Monitor, LogOut, ShieldCheck, Globe } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
export function MyDeviceSessions() {
  const sessions = [
  {
    id: 1,
    device: 'Chrome on Windows',
    type: 'Desktop',
    ip: '192.168.1.105',
    location: 'Ahmedabad, India',
    lastActive: 'Active Now',
    current: true
  },
  {
    id: 2,
    device: 'Safari on iPhone 13',
    type: 'Mobile',
    ip: '10.5.4.32',
    location: 'Ahmedabad, India',
    lastActive: '2 hours ago',
    current: false
  },
  {
    id: 3,
    device: 'Firefox on MacOS',
    type: 'Desktop',
    ip: '172.16.0.5',
    location: 'Mumbai, India',
    lastActive: '3 days ago',
    current: false
  }];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Device Management
          </h1>
          <p className="text-sm text-gray-500">
            View and manage devices currently logged into your account.
          </p>
        </div>
        <Button variant="outline" className="text-red-600 hover:bg-red-50">
          <LogOut className="w-4 h-4 mr-2" /> Sign Out All Other Sessions
        </Button>
      </div>

      <div className="space-y-4">
        {sessions.map((session) =>
        <Card
          key={session.id}
          className={session.current ? 'border-blue-200 bg-blue-50/30' : ''}>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-start gap-4">
                <div
                className={`p-3 rounded-full ${session.current ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>

                  {session.type === 'Mobile' ?
                <Smartphone className="w-6 h-6" /> :

                <Monitor className="w-6 h-6" />
                }
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900">
                      {session.device}
                    </h3>
                    {session.current &&
                  <Badge variant="success">Current Session</Badge>
                  }
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3" /> {session.ip}
                    </span>
                    <span>•</span>
                    <span>{session.location}</span>
                    <span>•</span>
                    <span
                    className={
                    session.current ? 'text-green-600 font-medium' : ''
                    }>

                      {session.lastActive}
                    </span>
                  </div>
                </div>
              </div>

              {!session.current &&
            <Button variant="outline" size="sm">
                  Sign Out
                </Button>
            }
            </div>
          </Card>
        )}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5" />
        <div>
          <h4 className="font-bold text-gray-900 text-sm">Security Tip</h4>
          <p className="text-sm text-gray-600 mt-1">
            If you see a device you don't recognize, sign it out immediately and
            change your password.
          </p>
        </div>
      </div>
    </div>);

}