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
import { BookmarkIcon, ExternalLinkIcon, BellIcon } from 'lucide-react';
const scholarships = [
{
  id: 1,
  title: 'National Merit Scholarship 2025-26',
  type: 'Government',
  eligibility: 'Class 10 pass, 80%+',
  amount: '₹12,000/year',
  deadline: '2025-07-31',
  category: 'Merit',
  status: 'Open'
},
{
  id: 2,
  title: 'EWS Scholarship - State Government',
  type: 'State',
  eligibility: 'EWS Category, Income < 2.5L',
  amount: '₹8,000/year',
  deadline: '2025-08-15',
  category: 'EWS',
  status: 'Open'
},
{
  id: 3,
  title: 'Minority Community Scholarship',
  type: 'Central',
  eligibility: 'Minority community students',
  amount: '₹10,000/year',
  deadline: '2025-07-15',
  category: 'Minority',
  status: 'Open'
},
{
  id: 4,
  title: 'Infrastructure Development Grant',
  type: 'Government',
  eligibility: 'School institutions',
  amount: '₹5,00,000',
  deadline: '2025-09-30',
  category: 'Infrastructure',
  status: 'Open'
}];

const statusBadge = (s: string) => {
  const c: Record<string, string> = {
    Open: 'bg-green-100 text-green-700',
    Closed: 'bg-gray-100 text-gray-600',
    'Closing Soon': 'bg-orange-100 text-orange-700'
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c[s] || 'bg-gray-100 text-gray-600'}`}>

      {s}
    </span>);

};
export function ScholarshipsGrants() {
  const [tab, setTab] = useState('all');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Scholarships & Grants
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Government scholarships, minority schemes, student financial aid and
            infrastructure funding
          </p>
        </div>
        <Button variant="outline">
          <BellIcon className="w-4 h-4 mr-2" />
          Alert Me
        </Button>
      </div>

      <Card noPadding>
        <Tabs defaultValue="all" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="all">All Scholarships</TabsTrigger>
            <TabsTrigger value="student">Student Aid</TabsTrigger>
            <TabsTrigger value="teacher">Teacher Grants</TabsTrigger>
            <TabsTrigger value="infra">Infrastructure</TabsTrigger>
          </TabsList>

          {['all', 'student', 'teacher', 'infra'].map((tabVal) =>
          <TabsContent key={tabVal} value={tabVal} className="p-5">
              <div className="flex gap-3 mb-4">
                <Input
                placeholder="Search scholarships..."
                className="flex-1" />

                <Select
                options={[
                {
                  value: 'all',
                  label: 'All Categories'
                },
                {
                  value: 'merit',
                  label: 'Merit'
                },
                {
                  value: 'ews',
                  label: 'EWS'
                },
                {
                  value: 'minority',
                  label: 'Minority'
                },
                {
                  value: 'infra',
                  label: 'Infrastructure'
                }]
                }
                className="w-40" />

              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scholarships.map((sch, i) =>
              <div
                key={i}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">

                    <div className="flex items-start justify-between mb-2">
                      <p className="font-semibold text-gray-800 text-sm flex-1 pr-2">
                        {sch.title}
                      </p>
                      {statusBadge(sch.status)}
                    </div>
                    <div className="space-y-1 text-xs text-gray-500 mb-3">
                      <p>
                        <span className="font-medium text-gray-700">Type:</span>{' '}
                        {sch.type}
                      </p>
                      <p>
                        <span className="font-medium text-gray-700">
                          Eligibility:
                        </span>{' '}
                        {sch.eligibility}
                      </p>
                      <p>
                        <span className="font-medium text-gray-700">
                          Amount:
                        </span>{' '}
                        <span className="text-green-600 font-semibold">
                          {sch.amount}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium text-gray-700">
                          Deadline:
                        </span>{' '}
                        <span className="text-red-600">{sch.deadline}</span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="primary" className="flex-1 text-xs h-7">
                        Apply Now
                      </Button>
                      <Button variant="ghost" className="text-xs h-7 px-2">
                        <BookmarkIcon className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" className="text-xs h-7 px-2">
                        <ExternalLinkIcon className="w-3 h-3" />
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