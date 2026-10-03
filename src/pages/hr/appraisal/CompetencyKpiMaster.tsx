import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  Search,
  ChevronDown,
  ChevronRight,
  Target,
  Star,
  Layers,
  BookOpen,
  X } from
'lucide-react';
interface KPI {
  id: string;
  name: string;
  description: string;
  measurable: string;
  weight: number;
}
interface CompetencyGroup {
  id: string;
  name: string;
  category: string;
  kpis: KPI[];
  expanded?: boolean;
}
const mockGroups: CompetencyGroup[] = [
{
  id: 'CG001',
  name: 'Core Teaching Competencies',
  category: 'Teaching',
  kpis: [
  {
    id: 'K001',
    name: 'Classroom Management',
    description:
    'Ability to maintain discipline, manage time, and create a positive learning environment',
    measurable: 'Student feedback score, classroom observation rating',
    weight: 15
  },
  {
    id: 'K002',
    name: 'Subject Knowledge',
    description: 'Depth and currency of subject matter expertise',
    measurable: 'Peer review score, certification status',
    weight: 20
  },
  {
    id: 'K003',
    name: 'Student Engagement',
    description:
    'Techniques to actively involve students in the learning process',
    measurable: 'Student participation rate, activity completion rate',
    weight: 15
  },
  {
    id: 'K004',
    name: 'Assessment & Evaluation',
    description: 'Design and implementation of fair, effective assessments',
    measurable: 'Assessment quality audit score, result analysis accuracy',
    weight: 10
  }]

},
{
  id: 'CG002',
  name: 'Professional Growth',
  category: 'Development',
  kpis: [
  {
    id: 'K005',
    name: 'Professional Development',
    description:
    'Continuous learning, certifications, and skill enhancement activities',
    measurable: 'Training hours completed, certifications earned',
    weight: 10
  },
  {
    id: 'K006',
    name: 'Technology Integration',
    description: 'Effective use of digital tools and platforms in teaching',
    measurable: 'Digital tool adoption rate, online content creation',
    weight: 10
  },
  {
    id: 'K007',
    name: 'Research & Innovation',
    description:
    'Contributing to academic research and innovative teaching methods',
    measurable: 'Papers published, new methods implemented',
    weight: 5
  }]

},
{
  id: 'CG003',
  name: 'Interpersonal Skills',
  category: 'Soft Skills',
  kpis: [
  {
    id: 'K008',
    name: 'Communication Skills',
    description:
    'Clarity in verbal and written communication with all stakeholders',
    measurable: 'Parent feedback, peer feedback score',
    weight: 10
  },
  {
    id: 'K009',
    name: 'Teamwork & Collaboration',
    description:
    'Working effectively with colleagues, contributing to team goals',
    measurable: 'Team project participation, peer rating',
    weight: 10
  },
  {
    id: 'K010',
    name: 'Leadership',
    description:
    'Mentoring juniors, leading initiatives, taking responsibility',
    measurable: 'Mentees count, initiatives led',
    weight: 5
  }]

},
{
  id: 'CG004',
  name: 'Administrative Competencies',
  category: 'Administrative',
  kpis: [
  {
    id: 'K011',
    name: 'Task Completion',
    description: 'Timely and accurate completion of assigned duties',
    measurable: 'Task completion rate, error rate',
    weight: 20
  },
  {
    id: 'K012',
    name: 'Process Adherence',
    description: 'Following established procedures and protocols',
    measurable: 'Compliance audit score',
    weight: 15
  },
  {
    id: 'K013',
    name: 'Problem Solving',
    description: 'Ability to identify and resolve issues independently',
    measurable: 'Issue resolution time, escalation rate',
    weight: 10
  }]

}];

const categoryColor = (c: string) => {
  if (c === 'Teaching') return 'bg-blue-100 text-blue-700';
  if (c === 'Development') return 'bg-green-100 text-green-700';
  if (c === 'Soft Skills') return 'bg-purple-100 text-purple-700';
  return 'bg-amber-100 text-amber-700';
};
export function CompetencyKpiMaster() {
  const [groups, setGroups] = useState(mockGroups);
  const [expanded, setExpanded] = useState<string[]>(['CG001']);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const filtered = groups.filter((g) => {
    const matchSearch =
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.kpis.some((k) => k.name.toLowerCase().includes(search.toLowerCase()));
    const matchCat = !catFilter || g.category === catFilter;
    return matchSearch && matchCat;
  });
  const toggleExpand = (id: string) =>
  setExpanded((prev) =>
  prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
  );
  const totalKpis = groups.reduce((s, g) => s + g.kpis.length, 0);
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Competency & KPI Master
          </h1>
          <p className="text-sm text-gray-500">
            Define competency groups and key performance indicators
          </p>
        </div>
        <Button variant="primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Competency Group
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Layers className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{groups.length}</p>
            <p className="text-xs text-gray-500">Groups</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <Target className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{totalKpis}</p>
            <p className="text-xs text-gray-500">Total KPIs</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xl font-bold">4</p>
            <p className="text-xs text-gray-500">Categories</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <Star className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xl font-bold">100%</p>
            <p className="text-xs text-gray-500">Total Weight</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search competencies or KPIs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

        </div>
        <Select
          options={[
          {
            value: '',
            label: 'All Categories'
          },
          {
            value: 'Teaching',
            label: 'Teaching'
          },
          {
            value: 'Development',
            label: 'Development'
          },
          {
            value: 'Soft Skills',
            label: 'Soft Skills'
          },
          {
            value: 'Administrative',
            label: 'Administrative'
          }]
          }
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)} />

      </div>

      <div className="space-y-4">
        {filtered.map((group) =>
        <Card key={group.id}>
            <button
            onClick={() => toggleExpand(group.id)}
            className="w-full flex items-center justify-between">

              <div className="flex items-center gap-3">
                {expanded.includes(group.id) ?
              <ChevronDown className="w-5 h-5 text-gray-400" /> :

              <ChevronRight className="w-5 h-5 text-gray-400" />
              }
                <div className="text-left">
                  <h3 className="text-base font-semibold text-gray-900">
                    {group.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-full ${categoryColor(group.category)}`}>

                      {group.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {group.kpis.length} KPIs
                    </span>
                    <span className="text-xs text-gray-500">
                      · Total weight:{' '}
                      {group.kpis.reduce((s, k) => s + k.weight, 0)}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                className="p-1.5 hover:bg-blue-100 rounded-lg"
                title="Edit Group">

                  <Edit className="w-4 h-4 text-blue-600" />
                </button>
                <button
                className="p-1.5 hover:bg-green-100 rounded-lg"
                title="Add KPI">

                  <Plus className="w-4 h-4 text-green-600" />
                </button>
                <button
                className="p-1.5 hover:bg-red-100 rounded-lg"
                title="Delete Group">

                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </button>

            {expanded.includes(group.id) &&
          <div className="mt-4 pt-4 border-t border-gray-200">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">
                        KPI Name
                      </th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">
                        Description
                      </th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">
                        Measurable Criteria
                      </th>
                      <th className="text-center py-2 px-3 text-xs font-semibold text-gray-600 w-20">
                        Weight
                      </th>
                      <th className="text-center py-2 px-3 text-xs font-semibold text-gray-600 w-24">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.kpis.map((kpi) =>
                <tr
                  key={kpi.id}
                  className="border-b border-gray-100 hover:bg-gray-50">

                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            <span className="text-sm font-medium text-gray-900">
                              {kpi.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-sm text-gray-600 max-w-[250px]">
                          {kpi.description}
                        </td>
                        <td className="py-2.5 px-3 text-xs text-gray-500 max-w-[200px]">
                          {kpi.measurable}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="inline-flex items-center justify-center w-10 h-7 rounded bg-blue-100 text-xs font-bold text-blue-700">
                            {kpi.weight}%
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                        className="p-1 hover:bg-blue-100 rounded"
                        title="Edit">

                              <Edit className="w-3.5 h-3.5 text-blue-600" />
                            </button>
                            <button
                        className="p-1 hover:bg-red-100 rounded"
                        title="Delete">

                              <Trash2 className="w-3.5 h-3.5 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                )}
                  </tbody>
                </table>
              </div>
          }
          </Card>
        )}
      </div>
    </div>);

}