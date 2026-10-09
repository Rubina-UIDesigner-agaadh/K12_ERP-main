import React, { useState } from 'react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { Table } from '../../../../components/ui/Table';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent } from
'../../../../components/ui/Tabs';
import { Textarea } from '../../../../components/ui/Textarea';
import { CheckCircleIcon, StarIcon, MessageSquareIcon } from 'lucide-react';
const participants = [
{
  id: '001',
  name: 'Arjun Sharma',
  class: 'Class 8-A',
  activity: 'Science Club',
  present: true,
  performance: 'Excellent'
},
{
  id: '002',
  name: 'Priya Patel',
  class: 'Class 9-B',
  activity: 'Drama Club',
  present: true,
  performance: 'Good'
},
{
  id: '003',
  name: 'Rohan Mehta',
  class: 'Class 7-A',
  activity: 'Chess Club',
  present: false,
  performance: '-'
},
{
  id: '004',
  name: 'Kavya Nair',
  class: 'Class 8-B',
  activity: 'Science Club',
  present: true,
  performance: 'Average'
}];

export function ActivityAttendanceEvaluation() {
  const [tab, setTab] = useState('attendance');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Activity Attendance & Evaluation
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track participant attendance, evaluate performance and collect
            feedback
          </p>
        </div>
        <Button variant="primary">
          <CheckCircleIcon className="w-4 h-4 mr-2" />
          Mark Attendance
        </Button>
      </div>

      <Card noPadding>
        <Tabs defaultValue="attendance" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="attendance">Participant Attendance</TabsTrigger>
            <TabsTrigger value="evaluation">Performance Evaluation</TabsTrigger>
            <TabsTrigger value="feedback">Activity Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="p-5">
            <div className="flex gap-3 mb-4">
              <Select
                label=""
                options={[
                {
                  value: 'science',
                  label: 'Science Club'
                },
                {
                  value: 'drama',
                  label: 'Drama Club'
                },
                {
                  value: 'chess',
                  label: 'Chess Club'
                }]
                }
                className="w-44" />

              <Input type="date" className="w-44" />
              <Button variant="primary">Mark Attendance</Button>
            </div>
            <Table
              columns={[
              {
                key: 'id',
                header: 'Roll No.'
              },
              {
                key: 'name',
                header: 'Participant'
              },
              {
                key: 'class',
                header: 'Class'
              },
              {
                key: 'activity',
                header: 'Activity'
              },
              {
                key: 'present',
                header: 'Present',
                render: (r) =>
                <button
                  className={`relative w-11 h-6 rounded-full transition-colors ${r.present ? 'bg-green-500' : 'bg-gray-300'}`}>

                      <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${r.present ? 'translate-x-5' : 'translate-x-0'}`} />

                    </button>

              }]
              }
              data={participants} />

            <div className="flex justify-end mt-4">
              <Button variant="primary">Save Attendance</Button>
            </div>
          </TabsContent>

          <TabsContent value="evaluation" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Evaluate Participant">
                <div className="space-y-3">
                  <Select
                    label="Activity / Club"
                    options={[
                    {
                      value: 'science',
                      label: 'Science Club'
                    },
                    {
                      value: 'drama',
                      label: 'Drama Club'
                    },
                    {
                      value: 'chess',
                      label: 'Chess Club'
                    }]
                    } />

                  <Input
                    label="Student Roll No."
                    placeholder="Enter roll number" />

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Performance Rating
                    </label>
                    <div className="flex gap-2">
                      {[
                      'Poor',
                      'Average',
                      'Good',
                      'Very Good',
                      'Excellent'].
                      map((r, i) =>
                      <button
                        key={i}
                        className={`px-2 py-1 text-xs rounded-lg border transition-colors ${i === 4 ? 'bg-green-100 border-green-400 text-green-700 font-semibold' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>

                          {r}
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Evaluation Notes
                    </label>
                    <Textarea
                      placeholder="Mentor's evaluation notes..."
                      rows={3} />

                  </div>
                  <Button variant="primary" className="w-full">
                    Save Evaluation
                  </Button>
                </div>
              </Card>
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">
                  Evaluation Summary
                </h3>
                <Table
                  columns={[
                  {
                    key: 'name',
                    header: 'Participant'
                  },
                  {
                    key: 'activity',
                    header: 'Activity'
                  },
                  {
                    key: 'performance',
                    header: 'Performance',
                    render: (r) => {
                      const c: Record<string, string> = {
                        Excellent: 'text-green-600',
                        Good: 'text-blue-600',
                        Average: 'text-yellow-600',
                        '-': 'text-gray-400'
                      };
                      return (
                        <span
                          className={`text-xs font-semibold ${c[r.performance] || 'text-gray-600'}`}>

                            {r.performance}
                          </span>);

                    }
                  }]
                  }
                  data={participants} />

              </div>
            </div>
          </TabsContent>

          <TabsContent value="feedback" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Submit Feedback">
                <div className="space-y-3">
                  <Select
                    label="Activity / Club"
                    options={[
                    {
                      value: 'science',
                      label: 'Science Club'
                    },
                    {
                      value: 'drama',
                      label: 'Drama Club'
                    }]
                    } />

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Overall Rating
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) =>
                      <StarIcon
                        key={i}
                        className={`w-6 h-6 cursor-pointer ${i <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />

                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Feedback
                    </label>
                    <Textarea
                      placeholder="Share your feedback about the activity..."
                      rows={4} />

                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Suggestions
                    </label>
                    <Textarea
                      placeholder="Any suggestions for improvement..."
                      rows={3} />

                  </div>
                  <Button variant="primary" className="w-full">
                    <MessageSquareIcon className="w-4 h-4 mr-2" />
                    Submit Feedback
                  </Button>
                </div>
              </Card>
              <Card title="Recent Feedback">
                <div className="space-y-3">
                  {[
                  {
                    from: 'Mrs. Sharma (Mentor)',
                    activity: 'Science Club',
                    rating: 5,
                    comment: 'Students are very enthusiastic and engaged.'
                  },
                  {
                    from: 'Mr. Patel (Parent)',
                    activity: 'Drama Club',
                    rating: 4,
                    comment:
                    'Great improvement in confidence and communication.'
                  }].
                  map((fb, i) =>
                  <div key={i} className="p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-semibold text-gray-700">
                          {fb.from}
                        </p>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((si) =>
                        <StarIcon
                          key={si}
                          className={`w-3 h-3 ${si <= fb.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />

                        )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">{fb.activity}</p>
                      <p className="text-xs text-gray-600 mt-1 italic">
                        "{fb.comment}"
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