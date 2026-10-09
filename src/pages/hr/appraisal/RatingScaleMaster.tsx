import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Search,
  Star,
  CheckCircle,
  AlertCircle } from
'lucide-react';
interface RatingLevel {
  id: string;
  value: number;
  label: string;
  description: string;
  minScore: number;
  maxScore: number;
  color: string;
}
interface RatingScale {
  id: string;
  name: string;
  levels: RatingLevel[];
  status: 'Active' | 'Draft';
  usedIn: number;
}
const mockScales: RatingScale[] = [
{
  id: 'RS001',
  name: '5-Point Performance Scale',
  status: 'Active',
  usedIn: 3,
  levels: [
  {
    id: 'L5',
    value: 5,
    label: 'Outstanding',
    description:
    'Consistently exceeds all expectations. Role model for others.',
    minScore: 90,
    maxScore: 100,
    color: '#059669'
  },
  {
    id: 'L4',
    value: 4,
    label: 'Excellent',
    description: 'Frequently exceeds expectations. Strong performer.',
    minScore: 75,
    maxScore: 89,
    color: '#2563eb'
  },
  {
    id: 'L3',
    value: 3,
    label: 'Good',
    description: 'Meets all expectations. Reliable and consistent.',
    minScore: 60,
    maxScore: 74,
    color: '#7c3aed'
  },
  {
    id: 'L2',
    value: 2,
    label: 'Needs Improvement',
    description: 'Partially meets expectations. Requires development.',
    minScore: 40,
    maxScore: 59,
    color: '#d97706'
  },
  {
    id: 'L1',
    value: 1,
    label: 'Unsatisfactory',
    description: 'Does not meet expectations. Immediate action required.',
    minScore: 0,
    maxScore: 39,
    color: '#dc2626'
  }]

},
{
  id: 'RS002',
  name: '4-Point Competency Scale',
  status: 'Active',
  usedIn: 1,
  levels: [
  {
    id: 'L4',
    value: 4,
    label: 'Expert',
    description: 'Demonstrates mastery. Can teach and mentor others.',
    minScore: 85,
    maxScore: 100,
    color: '#059669'
  },
  {
    id: 'L3',
    value: 3,
    label: 'Proficient',
    description: 'Competent and independent. Meets all requirements.',
    minScore: 65,
    maxScore: 84,
    color: '#2563eb'
  },
  {
    id: 'L2',
    value: 2,
    label: 'Developing',
    description: 'Growing capability. Needs some guidance.',
    minScore: 40,
    maxScore: 64,
    color: '#d97706'
  },
  {
    id: 'L1',
    value: 1,
    label: 'Beginner',
    description: 'Limited capability. Requires significant support.',
    minScore: 0,
    maxScore: 39,
    color: '#dc2626'
  }]

},
{
  id: 'RS003',
  name: 'Grade-Based Scale (A-D)',
  status: 'Draft',
  usedIn: 0,
  levels: [
  {
    id: 'LA+',
    value: 5,
    label: 'A+ (Outstanding)',
    description: 'Top 5% performer',
    minScore: 95,
    maxScore: 100,
    color: '#059669'
  },
  {
    id: 'LA',
    value: 4,
    label: 'A (Excellent)',
    description: 'Top 25% performer',
    minScore: 80,
    maxScore: 94,
    color: '#10b981'
  },
  {
    id: 'LB+',
    value: 3,
    label: 'B+ (Very Good)',
    description: 'Above average performer',
    minScore: 70,
    maxScore: 79,
    color: '#2563eb'
  },
  {
    id: 'LB',
    value: 3,
    label: 'B (Good)',
    description: 'Average performer',
    minScore: 60,
    maxScore: 69,
    color: '#7c3aed'
  },
  {
    id: 'LC',
    value: 2,
    label: 'C (Average)',
    description: 'Below average performer',
    minScore: 40,
    maxScore: 59,
    color: '#d97706'
  },
  {
    id: 'LD',
    value: 1,
    label: 'D (Below Average)',
    description: 'Poor performer',
    minScore: 0,
    maxScore: 39,
    color: '#dc2626'
  }]

}];

export function RatingScaleMaster() {
  const [scales] = useState(mockScales);
  const [expandedScale, setExpandedScale] = useState<string | null>('RS001');
  const [search, setSearch] = useState('');
  const filtered = scales.filter((s) =>
  s.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Rating Scale Master
          </h1>
          <p className="text-sm text-gray-500">
            Define rating scales, score ranges, and grade mappings
          </p>
        </div>
        <Button variant="primary">
          <Plus className="w-4 h-4 mr-2" />
          Create Scale
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search scales..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((scale) =>
        <Card key={scale.id}>
            <button
            onClick={() =>
            setExpandedScale(expandedScale === scale.id ? null : scale.id)
            }
            className="w-full flex items-center justify-between">

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Star className="w-6 h-6 text-amber-600" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {scale.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {scale.status === 'Active' ?
                  <Badge variant="success">Active</Badge> :

                  <Badge variant="secondary">Draft</Badge>
                  }
                    <span className="text-xs text-gray-500">
                      {scale.levels.length} levels
                    </span>
                    <span className="text-xs text-gray-500">
                      · Used in {scale.usedIn} templates
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                className="p-1.5 hover:bg-blue-100 rounded-lg"
                title="Edit">

                  <Edit className="w-4 h-4 text-blue-600" />
                </button>
                <button
                className="p-1.5 hover:bg-red-100 rounded-lg"
                title="Delete">

                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </button>

            {expandedScale === scale.id &&
          <div className="mt-4 pt-4 border-t border-gray-200">
                {/* Visual Scale */}
                <div className="flex gap-2 mb-6">
                  {scale.levels.map((level) =>
              <div key={level.id} className="flex-1 text-center">
                      <div
                  className="h-3 rounded-full mb-2"
                  style={{
                    backgroundColor: level.color
                  }} />

                      <p
                  className="text-xs font-bold"
                  style={{
                    color: level.color
                  }}>

                        {level.value}
                      </p>
                    </div>
              )}
                </div>

                {/* Detail Table */}
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200 bg-gray-50">
                      <th className="text-center py-2 px-3 text-xs font-semibold text-gray-600 w-16">
                        Value
                      </th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">
                        Label
                      </th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">
                        Description
                      </th>
                      <th className="text-center py-2 px-3 text-xs font-semibold text-gray-600">
                        Score Range
                      </th>
                      <th className="text-center py-2 px-3 text-xs font-semibold text-gray-600 w-20">
                        Color
                      </th>
                      <th className="text-center py-2 px-3 text-xs font-semibold text-gray-600 w-20">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {scale.levels.map((level) =>
                <tr
                  key={level.id}
                  className="border-b border-gray-100 hover:bg-gray-50">

                        <td className="py-3 px-3 text-center">
                          <span
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold text-white"
                      style={{
                        backgroundColor: level.color
                      }}>

                            {level.value}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                      className="text-sm font-semibold"
                      style={{
                        color: level.color
                      }}>

                            {level.label}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-sm text-gray-600">
                          {level.description}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="text-sm font-medium text-gray-700">
                            {level.minScore} – {level.maxScore}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div
                      className="w-6 h-6 rounded-full mx-auto border-2 border-white shadow"
                      style={{
                        backgroundColor: level.color
                      }} />

                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                      className="p-1 hover:bg-blue-100 rounded"
                      title="Edit">

                            <Edit className="w-3.5 h-3.5 text-blue-600" />
                          </button>
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