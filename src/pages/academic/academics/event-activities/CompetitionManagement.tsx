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
import { PlusIcon, SearchIcon, TrophyIcon, AwardIcon } from 'lucide-react';
const competitions = [
{
  id: 'COMP-001',
  name: 'Inter-House Debate',
  category: 'Literary',
  date: '2025-06-18',
  participants: 24,
  houses: 4,
  status: 'Upcoming'
},
{
  id: 'COMP-002',
  name: 'Science Quiz',
  category: 'Academic',
  date: '2025-06-20',
  participants: 40,
  houses: 4,
  status: 'Upcoming'
},
{
  id: 'COMP-003',
  name: 'Drawing Competition',
  category: 'Art',
  date: '2025-06-10',
  participants: 56,
  houses: 4,
  status: 'Completed'
}];

const results = [
{
  competition: 'Drawing Competition',
  position: '1st',
  house: 'Red House',
  participant: 'Arjun Sharma',
  score: '95/100'
},
{
  competition: 'Drawing Competition',
  position: '2nd',
  house: 'Blue House',
  participant: 'Priya Patel',
  score: '88/100'
},
{
  competition: 'Drawing Competition',
  position: '3rd',
  house: 'Green House',
  participant: 'Rohan Mehta',
  score: '82/100'
}];

const statusBadge = (s: string) => {
  const c: Record<string, string> = {
    Upcoming: 'bg-blue-100 text-blue-700',
    Completed: 'bg-green-100 text-green-700',
    'In Progress': 'bg-orange-100 text-orange-700'
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c[s] || 'bg-gray-100 text-gray-600'}`}>

      {s}
    </span>);

};
export function CompetitionManagement() {
  const [tab, setTab] = useState('setup');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Competition Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Setup competitions, allocate houses, record results and generate
            certificates
          </p>
        </div>
        <Button variant="primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          New Competition
        </Button>
      </div>

      <Card noPadding>
        <Tabs defaultValue="setup" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="setup">Competition Setup</TabsTrigger>
            <TabsTrigger value="houses">House Allocation</TabsTrigger>
            <TabsTrigger value="results">Result Entry</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="p-5">
            <div className="flex gap-3 mb-4">
              <Input
                placeholder="Search competitions..."
                leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                className="flex-1" />

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
                  value: 'sports',
                  label: 'Sports'
                },
                {
                  value: 'art',
                  label: 'Art'
                },
                {
                  value: 'literary',
                  label: 'Literary'
                }]
                }
                className="w-40" />

            </div>
            <Table
              columns={[
              {
                key: 'id',
                header: 'ID'
              },
              {
                key: 'name',
                header: 'Competition Name'
              },
              {
                key: 'category',
                header: 'Category'
              },
              {
                key: 'date',
                header: 'Date'
              },
              {
                key: 'participants',
                header: 'Participants'
              },
              {
                key: 'houses',
                header: 'Houses'
              },
              {
                key: 'status',
                header: 'Status',
                render: (r) => statusBadge(r.status)
              },
              {
                key: 'actions',
                header: '',
                render: () =>
                <div className="flex gap-1">
                      <Button variant="ghost" className="text-xs h-7 px-2">
                        Edit
                      </Button>
                      <Button variant="ghost" className="text-xs h-7 px-2">
                        Manage
                      </Button>
                    </div>

              }]
              }
              data={competitions} />

          </TabsContent>

          <TabsContent value="houses" className="p-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
              {
                house: 'Red House',
                color: 'bg-red-500',
                students: 112,
                points: 245
              },
              {
                house: 'Blue House',
                color: 'bg-blue-500',
                students: 108,
                points: 218
              },
              {
                house: 'Green House',
                color: 'bg-green-500',
                students: 115,
                points: 232
              },
              {
                house: 'Yellow House',
                color: 'bg-yellow-500',
                students: 110,
                points: 198
              }].
              map((h, i) =>
              <Card key={i}>
                  <div className="text-center">
                    <div
                    className={`w-12 h-12 ${h.color} rounded-full mx-auto mb-2 flex items-center justify-center`}>

                      <TrophyIcon className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-bold text-gray-800 text-sm">{h.house}</p>
                    <p className="text-xs text-gray-500">
                      {h.students} students
                    </p>
                    <p className="text-lg font-bold text-gray-900 mt-1">
                      {h.points} pts
                    </p>
                  </div>
                </Card>
              )}
            </div>
            <Card title="Allocate Students to Houses">
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Competition"
                  options={competitions.map((c) => ({
                    value: c.id,
                    label: c.name
                  }))} />

                <Select
                  label="House"
                  options={[
                  {
                    value: 'red',
                    label: 'Red House'
                  },
                  {
                    value: 'blue',
                    label: 'Blue House'
                  },
                  {
                    value: 'green',
                    label: 'Green House'
                  },
                  {
                    value: 'yellow',
                    label: 'Yellow House'
                  }]
                  } />

                <Input
                  label="Student Roll No."
                  placeholder="Enter roll number" />

                <Select
                  label="Category/Event"
                  options={[
                  {
                    value: 'individual',
                    label: 'Individual'
                  },
                  {
                    value: 'team',
                    label: 'Team Event'
                  }]
                  } />

              </div>
              <Button variant="primary" className="mt-4">
                Allocate to House
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Enter Results">
                <div className="space-y-3">
                  <Select
                    label="Competition"
                    options={competitions.
                    filter((c) => c.status === 'Completed').
                    map((c) => ({
                      value: c.id,
                      label: c.name
                    }))} />

                  <Input
                    label="Participant Name / Roll No."
                    placeholder="Search participant" />

                  <Select
                    label="Position"
                    options={[
                    {
                      value: '1',
                      label: '1st Place'
                    },
                    {
                      value: '2',
                      label: '2nd Place'
                    },
                    {
                      value: '3',
                      label: '3rd Place'
                    },
                    {
                      value: 'participation',
                      label: 'Participation'
                    }]
                    } />

                  <Input label="Score / Marks" placeholder="e.g. 95/100" />
                  <Input
                    label="Remarks"
                    placeholder="Judge's remarks (optional)" />

                  <Button variant="primary" className="w-full">
                    Save Result
                  </Button>
                </div>
              </Card>
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">
                  Results - Drawing Competition
                </h3>
                <Table
                  columns={[
                  {
                    key: 'position',
                    header: 'Position',
                    render: (r) =>
                    <span className="font-bold text-yellow-600">
                          {r.position}
                        </span>

                  },
                  {
                    key: 'participant',
                    header: 'Participant'
                  },
                  {
                    key: 'house',
                    header: 'House'
                  },
                  {
                    key: 'score',
                    header: 'Score'
                  },
                  {
                    key: 'actions',
                    header: '',
                    render: () =>
                    <Button variant="ghost" className="text-xs h-7 px-2">
                          Edit
                        </Button>

                  }]
                  }
                  data={results} />

              </div>
            </div>
          </TabsContent>

          <TabsContent value="certificates" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Generate Certificates">
                <div className="space-y-4">
                  <Select
                    label="Competition"
                    options={competitions.
                    filter((c) => c.status === 'Completed').
                    map((c) => ({
                      value: c.id,
                      label: c.name
                    }))} />

                  <Select
                    label="Certificate Type"
                    options={[
                    {
                      value: 'winner',
                      label: 'Winner Certificate'
                    },
                    {
                      value: 'participation',
                      label: 'Participation Certificate'
                    },
                    {
                      value: 'merit',
                      label: 'Merit Certificate'
                    }]
                    } />

                  <Select
                    label="Template"
                    options={[
                    {
                      value: 'gold',
                      label: 'Gold Template'
                    },
                    {
                      value: 'silver',
                      label: 'Silver Template'
                    },
                    {
                      value: 'standard',
                      label: 'Standard Template'
                    }]
                    } />

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      Include School Logo
                    </span>
                    <button className="relative w-9 h-5 rounded-full bg-blue-500">
                      <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow translate-x-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      Include Principal Signature
                    </span>
                    <button className="relative w-9 h-5 rounded-full bg-blue-500">
                      <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow translate-x-4" />
                    </button>
                  </div>
                  <Button variant="primary" className="w-full">
                    <AwardIcon className="w-4 h-4 mr-2" />
                    Generate Certificates
                  </Button>
                </div>
              </Card>
              <Card title="Certificate Preview">
                <div className="border-4 border-yellow-400 rounded-xl p-6 text-center bg-gradient-to-b from-yellow-50 to-white">
                  <div className="text-yellow-600 text-2xl mb-2">🏆</div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">
                    Certificate of Achievement
                  </p>
                  <p className="text-lg font-bold text-gray-900 mt-2">
                    Arjun Sharma
                  </p>
                  <p className="text-xs text-gray-500 mt-1">has won</p>
                  <p className="text-base font-bold text-yellow-700 mt-1">
                    1st Place
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    in Drawing Competition
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between text-xs text-gray-400">
                    <span>Principal</span>
                    <span>Date: 10 Jun 2025</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}