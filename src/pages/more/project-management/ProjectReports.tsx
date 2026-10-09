import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent } from
'../../../components/ui/Tabs';
import { DownloadIcon, CheckCircleIcon } from 'lucide-react';
export function ProjectReports() {
  const [tab, setTab] = useState('milestone');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Reports</h1>
          <p className="text-sm text-gray-500 mt-1">
            Milestone tracking and project completion reports
          </p>
        </div>
        <Button variant="outline">
          <DownloadIcon className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      <Card noPadding>
        <Tabs defaultValue="milestone" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="milestone">Milestone Report</TabsTrigger>
            <TabsTrigger value="completion">Completion Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="milestone" className="p-5">
            <div className="mb-4">
              <Select
                options={[
                {
                  value: 'all',
                  label: 'All Projects'
                },
                {
                  value: 'lab',
                  label: 'Science Lab Setup'
                },
                {
                  value: 'annual',
                  label: 'Annual Day 2025'
                }]
                }
                className="w-56" />

            </div>
            <div className="space-y-4">
              {[
              {
                project: 'Science Lab Setup',
                milestones: 5,
                completed: 1,
                inProgress: 1,
                pending: 3,
                completion: 20
              },
              {
                project: 'Annual Day 2025',
                milestones: 8,
                completed: 2,
                inProgress: 2,
                pending: 4,
                completion: 25
              },
              {
                project: 'Smart Classroom',
                milestones: 6,
                completed: 3,
                inProgress: 1,
                pending: 2,
                completion: 50
              }].
              map((proj, i) =>
              <Card key={i} title={proj.project}>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    {[
                  {
                    label: 'Total Milestones',
                    value: proj.milestones,
                    color: 'text-gray-800'
                  },
                  {
                    label: 'Completed',
                    value: proj.completed,
                    color: 'text-green-600'
                  },
                  {
                    label: 'In Progress',
                    value: proj.inProgress,
                    color: 'text-blue-600'
                  },
                  {
                    label: 'Pending',
                    value: proj.pending,
                    color: 'text-gray-500'
                  },
                  {
                    label: 'Completion %',
                    value: `${proj.completion}%`,
                    color: 'text-purple-600'
                  }].
                  map((s, si) =>
                  <div
                    key={si}
                    className="text-center p-2 bg-gray-50 rounded-lg">

                        <p className={`text-lg font-bold ${s.color}`}>
                          {s.value}
                        </p>
                        <p className="text-xs text-gray-400">{s.label}</p>
                      </div>
                  )}
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${proj.completion}%`
                    }} />

                  </div>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completion" className="p-5">
            <div className="space-y-4">
              {[
              {
                project: 'Annual Sports Day 2024',
                completedOn: '2024-11-25',
                budget: '₹45,000',
                spent: '₹42,800',
                outcome: 'Successful',
                participants: 450
              },
              {
                project: 'Science Fair 2024',
                completedOn: '2024-10-15',
                budget: '₹20,000',
                spent: '₹18,500',
                outcome: 'Successful',
                participants: 180
              }].
              map((proj, i) =>
              <Card key={i}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-gray-800">
                          {proj.project}
                        </p>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                          {proj.outcome}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        {[
                      {
                        label: 'Completed On',
                        value: proj.completedOn
                      },
                      {
                        label: 'Budget',
                        value: proj.budget
                      },
                      {
                        label: 'Actual Spend',
                        value: proj.spent
                      },
                      {
                        label: 'Participants',
                        value: proj.participants.toString()
                      }].
                      map((s, si) =>
                      <div key={si}>
                            <p className="text-xs text-gray-400">{s.label}</p>
                            <p className="font-semibold text-gray-800">
                              {s.value}
                            </p>
                          </div>
                      )}
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}