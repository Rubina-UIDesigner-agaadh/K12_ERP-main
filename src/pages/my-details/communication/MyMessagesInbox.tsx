import React, { useState } from 'react';
import {
  Search,
  Inbox,
  Archive,
  Trash2,
  Reply,
  Forward,
  MoreVertical } from
'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Select } from '../../../components/ui/Select';
export function MyMessagesInbox() {
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
  const messages = [
  {
    id: 1,
    sender: 'Admin Office',
    role: 'Admin',
    subject: 'Holiday Announcement',
    preview: 'School will remain closed on...',
    date: '10:30 AM',
    priority: 'High',
    read: false,
    body: 'Dear Staff/Student, School will remain closed on 15th Nov due to local elections. Regular classes resume on 16th Nov.'
  },
  {
    id: 2,
    sender: 'Dr. Anita Verma',
    role: 'HOD Science',
    subject: 'Department Meeting',
    preview: 'Please join us for a quick sync...',
    date: 'Yesterday',
    priority: 'Normal',
    read: true,
    body: 'Hi Team, Please join us for a quick sync regarding the upcoming Science Fair. Date: Tomorrow, 2 PM. Venue: Lab 1.'
  },
  {
    id: 3,
    sender: 'Library',
    role: 'System',
    subject: 'Book Due Reminder',
    preview: 'You have books due for return...',
    date: '12-Nov',
    priority: 'Normal',
    read: true,
    body: 'This is a reminder to return "Advanced Physics Vol 1" by 14th Nov to avoid late fees.'
  }];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inbox</h1>
          <p className="text-sm text-gray-500">
            Internal messages from school administration and staff.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Archive className="w-4 h-4 mr-2" /> Archive
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Message List */}
        <Card className="lg:col-span-1 flex flex-col h-full p-0 overflow-hidden">
          <div className="p-4 border-b border-gray-100 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

            </div>
            <div className="flex gap-2">
              <Select
                options={[
                {
                  value: 'all',
                  label: 'All'
                },
                {
                  value: 'unread',
                  label: 'Unread'
                }]
                }
                className="text-xs h-8 py-0" />

              <Select
                options={[
                {
                  value: 'newest',
                  label: 'Newest'
                },
                {
                  value: 'oldest',
                  label: 'Oldest'
                }]
                }
                className="text-xs h-8 py-0" />

            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {messages.map((msg) =>
            <div
              key={msg.id}
              onClick={() => setSelectedMessage(msg.id)}
              className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${selectedMessage === msg.id ? 'bg-blue-50' : ''} ${!msg.read ? 'bg-white' : 'bg-gray-50/50'}`}>

                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-gray-900">
                      {msg.sender}
                    </span>
                    {!msg.read &&
                  <span className="w-2 h-2 bg-blue-600 rounded-full" />
                  }
                  </div>
                  <span className="text-xs text-gray-500">{msg.date}</span>
                </div>
                <p
                className={`text-sm mb-1 ${!msg.read ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>

                  {msg.subject}
                </p>
                <p className="text-xs text-gray-500 truncate">{msg.preview}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Message Detail */}
        <Card className="lg:col-span-2 h-full flex flex-col p-0 overflow-hidden">
          {selectedMessage ?
          <>
              {/* Toolbar */}
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Reply className="w-4 h-4 mr-2" /> Reply
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Forward className="w-4 h-4 mr-2" /> Forward
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-gray-500">
                    <Archive className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 overflow-y-auto">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                      {messages.
                    find((m) => m.id === selectedMessage)?.
                    sender.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {
                      messages.find((m) => m.id === selectedMessage)?.
                      subject
                      }
                      </h2>
                      <p className="text-sm text-gray-500">
                        From:{' '}
                        <span className="font-medium text-gray-900">
                          {
                        messages.find((m) => m.id === selectedMessage)?.
                        sender
                        }
                        </span>{' '}
                        <Badge variant="secondary" className="ml-2">
                          {messages.find((m) => m.id === selectedMessage)?.role}
                        </Badge>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {messages.find((m) => m.id === selectedMessage)?.date}
                    </p>
                    {messages.find((m) => m.id === selectedMessage)?.
                  priority === 'High' &&
                  <Badge variant="danger" className="mt-1">
                        High Priority
                      </Badge>
                  }
                  </div>
                </div>

                <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed">
                  {messages.find((m) => m.id === selectedMessage)?.body}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                  <Button variant="outline" size="sm">
                    <Reply className="w-4 h-4 mr-2" /> Click to Reply
                  </Button>
                </div>
              </div>
            </> :

          <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Inbox className="w-16 h-16 mb-4 opacity-20" />
              <p>Select a message to read</p>
            </div>
          }
        </Card>
      </div>
    </div>);

}