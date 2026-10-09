import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { MessageCircleIcon, SendIcon } from 'lucide-react';
export function TwoWayCommunication() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Two-Way Communication
          </h1>
          <p className="text-sm text-gray-500">
            Manage incoming WhatsApp messages and reply to parents/students
          </p>
        </div>
        <Button variant="primary">
          <MessageCircleIcon className="w-4 h-4 mr-2" />
          Open Inbox
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-gray-900">48</p>
            <p className="text-sm text-gray-500">Unread Messages</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-orange-600">12</p>
            <p className="text-sm text-gray-500">Pending Replies</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-green-600">234</p>
            <p className="text-sm text-gray-500">Resolved Today</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-blue-600">4.2 hrs</p>
            <p className="text-sm text-gray-500">Avg. Response Time</p>
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Conversations">
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {[
            {
              name: 'Rahul Sharma (Parent)',
              msg: 'When is the next PTM?',
              time: '10:32 AM',
              unread: true
            },
            {
              name: 'Priya Patel (Parent)',
              msg: 'Fee receipt not received',
              time: '09:45 AM',
              unread: true
            },
            {
              name: 'Amit Singh (Parent)',
              msg: 'Thank you for the update',
              time: '09:12 AM',
              unread: false
            },
            {
              name: 'Sunita Verma (Parent)',
              msg: 'Can I get the timetable?',
              time: 'Yesterday',
              unread: false
            }].
            map((conv) =>
            <div
              key={conv.name}
              className={`p-3 rounded-lg cursor-pointer ${conv.unread ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'}`}>

                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium text-gray-900">
                    {conv.name}
                  </p>
                  <span className="text-xs text-gray-500">{conv.time}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1 truncate">
                  {conv.msg}
                </p>
                {conv.unread &&
              <Badge variant="info" className="mt-1">
                    New
                  </Badge>
              }
              </div>
            )}
          </div>
        </Card>
        <div className="lg:col-span-2">
          <Card title="Chat Window">
            <div className="flex flex-col h-80">
              <div className="flex-1 space-y-3 overflow-y-auto p-2">
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                    <p className="text-sm">When is the next PTM scheduled?</p>
                    <p className="text-xs text-gray-500 mt-1">10:32 AM</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-green-100 rounded-lg p-3 max-w-xs">
                    <p className="text-sm">
                      The next PTM is scheduled for March 5th, 2026 from 9 AM to
                      12 PM.
                    </p>
                    <p className="text-xs text-gray-500 mt-1">10:35 AM ✓✓</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                <Input placeholder="Type a reply..." className="flex-1" />
                <Button variant="primary">
                  <SendIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>);

}