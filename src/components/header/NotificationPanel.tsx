import React, { useState } from 'react';
import {
  X,
  Bell,
  Check,
  Clock,
  Info,
  AlertTriangle,
  CheckCircle } from
'lucide-react';
interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}
interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success';
}
const MOCK_NOTIFICATIONS: Notification[] = [
{
  id: '1',
  title: 'New Assignment Posted',
  description: 'Mathematics assignment for Class 10-A has been posted.',
  time: '10 min ago',
  read: false,
  type: 'info'
},
{
  id: '2',
  title: 'Fee Payment Reminder',
  description: 'Tuition fee submission deadline is approaching.',
  time: '2 hours ago',
  read: false,
  type: 'warning'
},
{
  id: '3',
  title: 'Leave Application Approved',
  description: 'Your leave application for Dec 15 has been approved.',
  time: '1 day ago',
  read: false,
  type: 'success'
},
{
  id: '4',
  title: 'System Maintenance',
  description: 'Scheduled maintenance on Saturday at 10 PM.',
  time: '2 days ago',
  read: true,
  type: 'info'
},
{
  id: '5',
  title: 'Exam Schedule Released',
  description: 'Mid-term examination schedule is now available.',
  time: '3 days ago',
  read: true,
  type: 'info'
}];

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const [activeTab, setActiveTab] = useState<'unread' | 'read'>('unread');
  const unreadNotifications = MOCK_NOTIFICATIONS.filter((n) => !n.read);
  const readNotifications = MOCK_NOTIFICATIONS.filter((n) => n.read);
  const displayNotifications =
  activeTab === 'unread' ? unreadNotifications : readNotifications;
  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };
  return (
    <>
      {/* Backdrop */}
      {isOpen &&
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose} />

      }

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">
                Notifications
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">

              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            <button
              className={`flex-1 py-3 text-sm font-medium transition-colors relative ${activeTab === 'unread' ? 'text-[#0F4C5C]' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('unread')}>

              Unread
              <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">
                {unreadNotifications.length}
              </span>
              {activeTab === 'unread' &&
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0F4C5C]" />
              }
            </button>
            <button
              className={`flex-1 py-3 text-sm font-medium transition-colors relative ${activeTab === 'read' ? 'text-[#0F4C5C]' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('read')}>

              Read
              <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                {readNotifications.length}
              </span>
              {activeTab === 'read' &&
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0F4C5C]" />
              }
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {displayNotifications.length > 0 ?
            <div className="divide-y divide-gray-50">
                {displayNotifications.map((notification) =>
              <div
                key={notification.id}
                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group">

                    <div className="flex gap-3">
                      <div className="mt-1 shrink-0">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#0F4C5C] transition-colors">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                          {notification.description}
                        </p>
                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                          <Clock className="h-3 w-3" />
                          <span>{notification.time}</span>
                        </div>
                      </div>
                      {!notification.read &&
                  <div className="mt-2">
                          <div className="h-2 w-2 rounded-full bg-red-500" />
                        </div>
                  }
                    </div>
                  </div>
              )}
              </div> :

            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <Bell className="h-12 w-12 mb-3 opacity-20" />
                <p>No {activeTab} notifications</p>
              </div>
            }
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <button className="w-full py-2 text-sm font-medium text-[#0F4C5C] hover:text-[#145369] transition-colors">
              Mark all as read
            </button>
          </div>
        </div>
      </div>
    </>);

}