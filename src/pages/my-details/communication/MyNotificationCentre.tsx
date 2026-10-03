import React, { useState } from 'react';
import {
  Bell,
  BookOpen,
  Settings,
  Calendar,
  CheckCircle,
  Trash2,
  Filter } from
'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
export function MyNotificationCentre() {
  const notifications = [
  {
    id: 1,
    category: 'academic',
    message: 'New assignment posted for Class 10 Physics.',
    date: '10 mins ago',
    read: false,
    link: 'View Assignment'
  },
  {
    id: 2,
    category: 'system',
    message: 'Password expires in 5 days. Please update.',
    date: '2 hours ago',
    read: false,
    link: 'Update Now'
  },
  {
    id: 3,
    category: 'communication',
    message: 'New message from Principal Office regarding Annual Day.',
    date: 'Yesterday',
    read: true,
    link: 'Read Message'
  },
  {
    id: 4,
    category: 'academic',
    message: 'Exam schedule for Term 1 has been released.',
    date: '2 days ago',
    read: true,
    link: 'Download Schedule'
  }];

  const getIcon = (category: string) => {
    switch (category) {
      case 'academic':
        return <BookOpen className="w-5 h-5 text-blue-500" />;
      case 'system':
        return <Settings className="w-5 h-5 text-gray-500" />;
      case 'communication':
        return <Bell className="w-5 h-5 text-orange-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500">
            Stay updated with latest alerts and announcements.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <CheckCircle className="w-4 h-4 mr-2" /> Mark All Read
          </Button>
          <Button variant="ghost" className="text-red-500 hover:bg-red-50">
            <Trash2 className="w-4 h-4 mr-2" /> Clear Old
          </Button>
        </div>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filter:</span>
            </div>
            <Select
              options={[
              {
                value: 'all',
                label: 'All Categories'
              },
              {
                value: 'academic',
                label: 'Academic'
              },
              {
                value: 'system',
                label: 'System'
              }]
              }
              className="w-40 h-8 py-0 text-sm" />

            <Select
              options={[
              {
                value: 'all',
                label: 'All Status'
              },
              {
                value: 'unread',
                label: 'Unread'
              }]
              }
              className="w-32 h-8 py-0 text-sm" />

          </div>
        </div>

        <div className="space-y-4">
          {notifications.map((notif) =>
          <div
            key={notif.id}
            className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${!notif.read ? 'bg-blue-50 border border-blue-100' : 'bg-white border border-gray-100 hover:bg-gray-50'}`}>

              <div className="mt-1 p-2 bg-white rounded-full shadow-sm">
                {getIcon(notif.category)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p
                  className={`text-sm ${!notif.read ? 'font-bold text-gray-900' : 'text-gray-700'}`}>

                    {notif.message}
                  </p>
                  <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                    {notif.date}
                  </span>
                </div>
                {notif.link &&
              <button className="text-xs font-medium text-blue-600 hover:underline mt-2">
                    {notif.link}
                  </button>
              }
              </div>
              {!notif.read &&
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
            }
            </div>
          )}
        </div>
      </Card>
    </div>);

}