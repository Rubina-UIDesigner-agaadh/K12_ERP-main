import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent } from
'../../../components/ui/Tabs';
import { ExternalLinkIcon, BookmarkIcon, BellIcon } from 'lucide-react';
const updates = [
{
  id: 1,
  title: 'NEP 2020 Implementation Guidelines Updated',
  source: 'Ministry of Education',
  category: 'Policy',
  date: '2025-06-08',
  priority: 'High',
  read: false
},
{
  id: 2,
  title: 'State Board Exam Pattern Changes for 2025-26',
  source: 'State Education Dept.',
  category: 'State',
  date: '2025-06-07',
  priority: 'High',
  read: true
},
{
  id: 3,
  title: 'RTE Act Amendment - EWS Seat Allocation',
  source: 'Central Govt.',
  category: 'RTE/EWS',
  date: '2025-06-05',
  priority: 'Medium',
  read: false
},
{
  id: 4,
  title: 'Safety & Security Guidelines for Schools',
  source: 'NCPCR',
  category: 'Safety',
  date: '2025-06-03',
  priority: 'Medium',
  read: true
},
{
  id: 5,
  title: 'Digital Literacy Program for Government Schools',
  source: 'State Govt.',
  category: 'State',
  date: '2025-06-01',
  priority: 'Low',
  read: true
}];

const priorityBadge = (p: string) => {
  const c: Record<string, string> = {
    High: 'bg-red-100 text-red-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Low: 'bg-green-100 text-green-700'
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c[p] || 'bg-gray-100 text-gray-600'}`}>

      {p}
    </span>);

};
export function GovernmentPolicyUpdates() {
  const [tab, setTab] = useState('all');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Government & Policy Updates
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Central & state government education updates, policy changes and
            compliance mandates
          </p>
        </div>
        <Button variant="outline">
          <BellIcon className="w-4 h-4 mr-2" />
          Subscribe
        </Button>
      </div>

      <Card noPadding>
        <Tabs defaultValue="all" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="all">All Updates</TabsTrigger>
            <TabsTrigger value="central">Central Govt.</TabsTrigger>
            <TabsTrigger value="state">State Govt.</TabsTrigger>
            <TabsTrigger value="rte">RTE / EWS</TabsTrigger>
            <TabsTrigger value="safety">Safety & Compliance</TabsTrigger>
          </TabsList>

          {['all', 'central', 'state', 'rte', 'safety'].map((tabVal) =>
          <TabsContent key={tabVal} value={tabVal} className="p-5">
              <div className="flex gap-3 mb-4">
                <Input placeholder="Search updates..." className="flex-1" />
                <Select
                options={[
                {
                  value: 'all',
                  label: 'All Priority'
                },
                {
                  value: 'high',
                  label: 'High'
                },
                {
                  value: 'medium',
                  label: 'Medium'
                },
                {
                  value: 'low',
                  label: 'Low'
                }]
                }
                className="w-40" />

              </div>
              <div className="space-y-3">
                {updates.
              filter(
                (u) =>
                tabVal === 'all' ||
                tabVal === 'central' && u.category === 'Policy' ||
                tabVal === 'state' && u.category === 'State' ||
                tabVal === 'rte' && u.category === 'RTE/EWS' ||
                tabVal === 'safety' && u.category === 'Safety'
              ).
              map((update, i) =>
              <div
                key={i}
                className={`p-4 border rounded-xl ${!update.read ? 'border-blue-200 bg-blue-50/20' : 'border-gray-200'}`}>

                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start gap-2">
                          {!update.read &&
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                    }
                          <p
                      className={`font-semibold text-sm ${!update.read ? 'text-gray-900' : 'text-gray-600'}`}>

                            {update.title}
                          </p>
                        </div>
                        {priorityBadge(update.priority)}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-400 mb-2">
                        <span>Source: {update.source}</span>
                        <span>{update.date}</span>
                        <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                          {update.category}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" className="text-xs h-6 px-2">
                          Read More
                        </Button>
                        <Button variant="ghost" className="text-xs h-6 px-2">
                          <BookmarkIcon className="w-3 h-3 mr-1" />
                          Save
                        </Button>
                        <Button variant="ghost" className="text-xs h-6 px-2">
                          <ExternalLinkIcon className="w-3 h-3 mr-1" />
                          Source
                        </Button>
                      </div>
                    </div>
              )}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </Card>
    </div>);

}