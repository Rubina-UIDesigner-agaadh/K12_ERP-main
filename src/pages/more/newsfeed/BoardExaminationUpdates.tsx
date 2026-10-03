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
import { BookmarkIcon, BellIcon, ExternalLinkIcon } from 'lucide-react';
const boardUpdates = [
{
  id: 1,
  title: 'CBSE Board Exam 2026 Date Sheet Released',
  board: 'CBSE',
  category: 'Exam Dates',
  date: '2025-06-10',
  priority: 'High',
  read: false
},
{
  id: 2,
  title: 'New Assessment Guidelines for Class 10 & 12',
  board: 'CBSE',
  category: 'Assessment',
  date: '2025-06-08',
  priority: 'High',
  read: false
},
{
  id: 3,
  title: 'Syllabus Revision for Science Stream 2025-26',
  board: 'CBSE',
  category: 'Syllabus',
  date: '2025-06-05',
  priority: 'Medium',
  read: true
},
{
  id: 4,
  title: 'ICSE Practical Exam Schedule Announced',
  board: 'ICSE',
  category: 'Exam Dates',
  date: '2025-06-03',
  priority: 'High',
  read: true
},
{
  id: 5,
  title: 'State Board Result Declaration Date',
  board: 'State Board',
  category: 'Results',
  date: '2025-06-01',
  priority: 'Medium',
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
const boardBadge = (b: string) => {
  const c: Record<string, string> = {
    CBSE: 'bg-blue-100 text-blue-700',
    ICSE: 'bg-purple-100 text-purple-700',
    'State Board': 'bg-orange-100 text-orange-700'
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c[b] || 'bg-gray-100 text-gray-600'}`}>

      {b}
    </span>);

};
export function BoardExaminationUpdates() {
  const [tab, setTab] = useState('all');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Board & Examination Updates
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Board circulars, exam patterns, syllabus revisions and result
            notifications
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
            <TabsTrigger value="cbse">CBSE</TabsTrigger>
            <TabsTrigger value="icse">ICSE</TabsTrigger>
            <TabsTrigger value="state">State Board</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          {['all', 'cbse', 'icse', 'state', 'results'].map((tabVal) =>
          <TabsContent key={tabVal} value={tabVal} className="p-5">
              <div className="flex gap-3 mb-4">
                <Input
                placeholder="Search board updates..."
                className="flex-1" />

                <Select
                options={[
                {
                  value: 'all',
                  label: 'All Categories'
                },
                {
                  value: 'dates',
                  label: 'Exam Dates'
                },
                {
                  value: 'syllabus',
                  label: 'Syllabus'
                },
                {
                  value: 'assessment',
                  label: 'Assessment'
                },
                {
                  value: 'results',
                  label: 'Results'
                }]
                }
                className="w-44" />

              </div>
              <div className="space-y-3">
                {boardUpdates.
              filter(
                (u) =>
                tabVal === 'all' ||
                tabVal === 'cbse' && u.board === 'CBSE' ||
                tabVal === 'icse' && u.board === 'ICSE' ||
                tabVal === 'state' && u.board === 'State Board' ||
                tabVal === 'results' && u.category === 'Results'
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
                        <div className="flex gap-1 shrink-0">
                          {boardBadge(update.board)}
                          {priorityBadge(update.priority)}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-400 mb-2">
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
                          Official Link
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