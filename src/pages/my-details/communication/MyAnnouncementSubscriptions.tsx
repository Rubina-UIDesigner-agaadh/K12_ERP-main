import React from 'react';
import { Bell, Lock, Check } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
export function MyAnnouncementSubscriptions() {
  const channels = [
  {
    id: 1,
    name: 'All Staff Announcements',
    description: 'Mandatory announcements for all staff members.',
    type: 'Mandatory',
    subscribed: true
  },
  {
    id: 2,
    name: 'Science Department',
    description: 'Internal updates for Science faculty.',
    type: 'Mandatory',
    subscribed: true
  },
  {
    id: 3,
    name: 'Cultural Club',
    description: 'Updates about cultural events and activities.',
    type: 'Optional',
    subscribed: true
  },
  {
    id: 4,
    name: 'Sports Updates',
    description: 'News about school sports teams and matches.',
    type: 'Optional',
    subscribed: false
  },
  {
    id: 5,
    name: 'Library News',
    description: 'New arrivals and library events.',
    type: 'Optional',
    subscribed: false
  }];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Announcement Channels
        </h1>
        <p className="text-sm text-gray-500">
          Manage your subscriptions to optional announcement groups.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {channels.map((channel) =>
        <Card key={channel.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-4">
                <div
                className={`p-3 rounded-full ${channel.subscribed ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>

                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-gray-900">
                      {channel.name}
                    </h3>
                    {channel.type === 'Mandatory' &&
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1">

                        <Lock className="w-3 h-3" /> Required
                      </Badge>
                  }
                  </div>
                  <p className="text-gray-600 mt-1">{channel.description}</p>
                </div>
              </div>

              <div>
                {channel.type === 'Mandatory' ?
              <span className="text-sm text-gray-400 italic flex items-center gap-1">
                    <Check className="w-4 h-4" /> Subscribed
                  </span> :

              <label className="relative inline-flex items-center cursor-pointer">
                    <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={channel.subscribed}
                  onChange={() => {}} />

                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      {channel.subscribed ? 'Subscribed' : 'Unsubscribed'}
                    </span>
                  </label>
              }
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>);

}