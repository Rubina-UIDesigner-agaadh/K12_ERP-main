import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent } from
'../../../components/ui/Tabs';
import { Textarea } from '../../../components/ui/Textarea';
import { StarIcon, RotateCcwIcon, CheckCircleIcon } from 'lucide-react';
const resolvedTickets = [
{
  id: 'TKT-003',
  title: 'Canteen food quality complaint',
  resolvedBy: 'Admin',
  resolvedOn: '2025-06-09',
  resolution: 'Discussed with canteen vendor, menu improved',
  rating: 4,
  feedback: 'Issue resolved satisfactorily'
},
{
  id: 'TKT-005',
  title: 'Library books not available',
  resolvedBy: 'Librarian',
  resolvedOn: '2025-06-08',
  resolution: 'New books ordered and added to catalog',
  rating: 5,
  feedback: 'Excellent response time'
},
{
  id: 'TKT-006',
  title: 'Classroom fan not working',
  resolvedBy: 'Maintenance',
  resolvedOn: '2025-06-07',
  resolution: 'Fan replaced with new unit',
  rating: 3,
  feedback: 'Took too long to resolve'
}];

const renderStars = (rating: number) =>
<div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((i) =>
  <StarIcon
    key={i}
    className={`w-3.5 h-3.5 ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />

  )}
  </div>;

export function FeedbackClosure() {
  const [tab, setTab] = useState('resolution');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Feedback & Closure
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Resolution notes, satisfaction ratings and ticket reopening
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
        {
          label: 'Resolved This Week',
          value: '12',
          color: 'text-green-600'
        },
        {
          label: 'Avg. Satisfaction',
          value: '4.2/5',
          color: 'text-blue-600'
        },
        {
          label: 'Reopened Tickets',
          value: '2',
          color: 'text-orange-600'
        }].
        map((s, i) =>
        <Card key={i}>
            <div className="text-center p-1">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          </Card>
        )}
      </div>

      <Card noPadding>
        <Tabs defaultValue="resolution" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="resolution">Resolution Notes</TabsTrigger>
            <TabsTrigger value="ratings">Satisfaction Ratings</TabsTrigger>
            <TabsTrigger value="reopen">Reopen Ticket</TabsTrigger>
          </TabsList>

          <TabsContent value="resolution" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">
                  Resolved Tickets
                </h3>
                <div className="space-y-3">
                  {resolvedTickets.map((t, i) =>
                  <div
                    key={i}
                    className="border border-gray-200 rounded-xl p-4">

                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            {t.title}
                          </p>
                          <p className="text-xs text-gray-400">
                            {t.id} • Resolved by {t.resolvedBy} on{' '}
                            {t.resolvedOn}
                          </p>
                        </div>
                        <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                          <CheckCircleIcon className="w-3 h-3" />
                          Resolved
                        </span>
                      </div>
                      <div className="bg-green-50 border border-green-100 rounded-lg p-3 mt-2">
                        <p className="text-xs font-medium text-gray-700">
                          Resolution:
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {t.resolution}
                        </p>
                      </div>
                      {renderStars(t.rating)}
                    </div>
                  )}
                </div>
              </div>
              <Card title="Add Resolution Note">
                <div className="space-y-3">
                  <Input label="Ticket ID" placeholder="Enter ticket ID" />
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Resolution Summary
                    </label>
                    <Textarea
                      placeholder="Describe how the issue was resolved..."
                      rows={4} />

                  </div>
                  <Input label="Resolved By" placeholder="Staff name" />
                  <Input label="Resolution Date" type="date" />
                  <Select
                    label="Closure Status"
                    options={[
                    {
                      value: 'resolved',
                      label: 'Resolved - Close Ticket'
                    },
                    {
                      value: 'partial',
                      label: 'Partially Resolved'
                    },
                    {
                      value: 'workaround',
                      label: 'Workaround Applied'
                    }]
                    } />

                  <Button variant="primary" className="w-full">
                    <CheckCircleIcon className="w-4 h-4 mr-2" />
                    Close Ticket
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ratings" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Table
                  columns={[
                  {
                    key: 'id',
                    header: 'Ticket ID'
                  },
                  {
                    key: 'title',
                    header: 'Issue'
                  },
                  {
                    key: 'resolvedBy',
                    header: 'Resolved By'
                  },
                  {
                    key: 'rating',
                    header: 'Rating',
                    render: (r) => renderStars(r.rating)
                  },
                  {
                    key: 'feedback',
                    header: 'Feedback'
                  }]
                  }
                  data={resolvedTickets} />

              </div>
              <Card title="Rating Summary">
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = resolvedTickets.filter(
                      (t) => t.rating === rating
                    ).length;
                    const pct = count / resolvedTickets.length * 100;
                    return (
                      <div key={rating} className="flex items-center gap-3">
                        <div className="flex gap-0.5 w-20 shrink-0">
                          {[1, 2, 3, 4, 5].map((i) =>
                          <StarIcon
                            key={i}
                            className={`w-3 h-3 ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />

                          )}
                        </div>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400 rounded-full"
                            style={{
                              width: `${pct}%`
                            }} />

                        </div>
                        <span className="text-xs text-gray-500 w-6">
                          {count}
                        </span>
                      </div>);

                  })}
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-center text-2xl font-bold text-gray-900">
                      4.0
                    </p>
                    <p className="text-center text-xs text-gray-500">
                      Average Rating
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reopen" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Reopen a Ticket">
                <div className="space-y-4">
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <p className="text-xs font-semibold text-orange-700">
                      ⚠ Reopen Policy
                    </p>
                    <p className="text-xs text-orange-600 mt-1">
                      Tickets can be reopened within 7 days of closure. Provide
                      a valid reason for reopening.
                    </p>
                  </div>
                  <Input
                    label="Ticket ID"
                    placeholder="Enter closed ticket ID" />

                  <Select
                    label="Reason for Reopening"
                    options={[
                    {
                      value: 'not-resolved',
                      label: 'Issue not actually resolved'
                    },
                    {
                      value: 'recurred',
                      label: 'Issue recurred'
                    },
                    {
                      value: 'partial',
                      label: 'Only partially resolved'
                    },
                    {
                      value: 'other',
                      label: 'Other reason'
                    }]
                    } />

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Detailed Reason
                    </label>
                    <Textarea
                      placeholder="Explain why the ticket needs to be reopened..."
                      rows={4} />

                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-orange-300 text-orange-600">

                    <RotateCcwIcon className="w-4 h-4 mr-2" />
                    Reopen Ticket
                  </Button>
                </div>
              </Card>
              <Card title="Recently Reopened">
                <div className="space-y-3">
                  {[
                  {
                    id: 'TKT-007',
                    title: 'Water leakage in corridor',
                    reopenedOn: '2025-06-09',
                    reason: 'Issue recurred after 2 days'
                  },
                  {
                    id: 'TKT-008',
                    title: 'Printer not working',
                    reopenedOn: '2025-06-08',
                    reason: 'Only partially resolved'
                  }].
                  map((t, i) =>
                  <div
                    key={i}
                    className="p-3 bg-orange-50 border border-orange-100 rounded-lg">

                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-gray-800">
                          {t.title}
                        </p>
                        <span className="text-xs text-orange-600 font-medium">
                          {t.id}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Reopened: {t.reopenedOn}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Reason: {t.reason}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}