import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { MultiSelect } from '../../../components/ui/MultiSelect';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Download,
  Share2,
  Printer,
  Calendar,
  ChevronDown,
  ChevronUp,
  User,
  Star,
  ArrowUp,
  ArrowDown,
  BarChart3 } from
'lucide-react';
interface SkillProgress {
  name: string;
  domain: string;
  term1: string;
  term2: string;
  term3: string;
  trend: 'improved' | 'same' | 'declined';
}
const GRADE_ORDER = ['Not Observed', 'Beginning', 'Developing', 'Achieved'];
const gradeScore = (g: string) => GRADE_ORDER.indexOf(g);
const getTrend = (t1: string, t3: string): 'improved' | 'same' | 'declined' => {
  const diff = gradeScore(t3) - gradeScore(t1);
  if (diff > 0) return 'improved';
  if (diff < 0) return 'declined';
  return 'same';
};
const GRADE_COLORS: Record<string, string> = {
  Achieved: 'bg-green-100 text-green-800',
  Developing: 'bg-blue-100 text-blue-800',
  Beginning: 'bg-yellow-100 text-yellow-800',
  'Not Observed': 'bg-gray-100 text-gray-500'
};
const mockSkillProgress: SkillProgress[] = [
{
  name: 'Recognizes colors',
  domain: 'Cognitive',
  term1: 'Beginning',
  term2: 'Developing',
  term3: 'Achieved',
  trend: 'improved'
},
{
  name: 'Identifies shapes',
  domain: 'Cognitive',
  term1: 'Developing',
  term2: 'Developing',
  term3: 'Achieved',
  trend: 'improved'
},
{
  name: 'Counts 1-10',
  domain: 'Cognitive',
  term1: 'Beginning',
  term2: 'Developing',
  term3: 'Developing',
  trend: 'improved'
},
{
  name: 'Speaks simple sentences',
  domain: 'Language',
  term1: 'Achieved',
  term2: 'Achieved',
  term3: 'Achieved',
  trend: 'same'
},
{
  name: 'Follows instructions',
  domain: 'Language',
  term1: 'Developing',
  term2: 'Achieved',
  term3: 'Achieved',
  trend: 'improved'
},
{
  name: 'Holds pencil correctly',
  domain: 'Motor',
  term1: 'Beginning',
  term2: 'Beginning',
  term3: 'Developing',
  trend: 'improved'
},
{
  name: 'Runs and jumps',
  domain: 'Motor',
  term1: 'Achieved',
  term2: 'Achieved',
  term3: 'Achieved',
  trend: 'same'
},
{
  name: 'Shares toys with peers',
  domain: 'Social',
  term1: 'Developing',
  term2: 'Beginning',
  term3: 'Beginning',
  trend: 'declined'
},
{
  name: 'Follows classroom rules',
  domain: 'Social',
  term1: 'Developing',
  term2: 'Developing',
  term3: 'Developing',
  trend: 'same'
},
{
  name: 'Participates in art activities',
  domain: 'Creativity',
  term1: 'Beginning',
  term2: 'Developing',
  term3: 'Achieved',
  trend: 'improved'
}];

const domainPerformance = [
{
  domain: 'Cognitive Skills',
  term1: 55,
  term2: 72,
  term3: 85,
  color: 'bg-blue-500'
},
{
  domain: 'Language & Communication',
  term1: 75,
  term2: 85,
  term3: 90,
  color: 'bg-green-500'
},
{
  domain: 'Motor Skills',
  term1: 60,
  term2: 65,
  term3: 75,
  color: 'bg-purple-500'
},
{
  domain: 'Social & Emotional',
  term1: 70,
  term2: 65,
  term3: 68,
  color: 'bg-yellow-500'
},
{
  domain: 'Creativity & Expression',
  term1: 50,
  term2: 68,
  term3: 80,
  color: 'bg-pink-500'
}];

const milestones = [
{
  date: 'Sep 2024',
  term: 'Term 1',
  event: 'Started recognizing primary colors',
  type: 'achievement'
},
{
  date: 'Oct 2024',
  term: 'Term 1',
  event: 'Improved pencil grip with teacher support',
  type: 'improvement'
},
{
  date: 'Dec 2024',
  term: 'Term 2',
  event: 'Began counting up to 10 independently',
  type: 'achievement'
},
{
  date: 'Jan 2025',
  term: 'Term 2',
  event: 'Needs support in social sharing activities',
  type: 'attention'
},
{
  date: 'Mar 2025',
  term: 'Term 3',
  event: 'Excellent progress in creative arts activities',
  type: 'achievement'
}];

const BRANCH_OPTIONS = [
{
  value: 'main',
  label: 'Main Campus'
},
{
  value: 'west',
  label: 'West Branch'
},
{
  value: 'east',
  label: 'East Branch'
},
{
  value: 'north',
  label: 'North Branch'
}];

export function PreschoolBulkSkillEntry() {
  const [selectedStudent, setSelectedStudent] = useState('Aarav Kumar');
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState('Nursery');
  const [filterDomain, setFilterDomain] = useState('');
  const [expandedDomains, setExpandedDomains] = useState<string[]>([
  'Cognitive',
  'Language']
  );
  const filteredSkills = filterDomain ?
  mockSkillProgress.filter((s) => s.domain === filterDomain) :
  mockSkillProgress;
  const strengthAreas = domainPerformance.
  filter((d) => d.term3 >= 80).
  map((d) => d.domain);
  const improvementAreas = domainPerformance.
  filter((d) => d.term3 < 75).
  map((d) => d.domain);
  const toggleDomain = (domain: string) => {
    setExpandedDomains((prev) =>
    prev.includes(domain) ?
    prev.filter((d) => d !== domain) :
    [...prev, domain]
    );
  };
  const groupedSkills = useMemo(() => {
    const groups: Record<string, SkillProgress[]> = {};
    filteredSkills.forEach((skill) => {
      if (!groups[skill.domain]) groups[skill.domain] = [];
      groups[skill.domain].push(skill);
    });
    return groups;
  }, [filteredSkills]);
  const getTrendBadge = (trend: string) => {
    if (trend === 'improved')
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <TrendingUp className="w-3 h-3" />
          Improved
        </span>);

    if (trend === 'declined')
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <TrendingDown className="w-3 h-3" />
          Declined
        </span>);

    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <Minus className="w-3 h-3" />
        Same
      </span>);

  };
  const overallScore = Math.round(
    domainPerformance.reduce((acc, d) => acc + d.term3, 0) /
    domainPerformance.length
  );
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Growth Tracking</h1>
          <p className="text-sm text-gray-500">
            Track developmental progress over time — term by term
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="w-4 h-4 mr-2" />
            Print Summary
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="primary" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share with Parents
          </Button>
        </div>
      </div>

      {/* Student Selector */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <MultiSelect
            label="School Branch"
            options={BRANCH_OPTIONS}
            value={selectedBranches}
            onChange={setSelectedBranches}
            placeholder="All Branches" />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">

              <option>Nursery</option>
              <option>Jr KG</option>
              <option>Sr KG</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student
            </label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">

              <option>Aarav Kumar</option>
              <option>Diya Sharma</option>
              <option>Rohan Patel</option>
              <option>Ananya Reddy</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Domain Filter
            </label>
            <select
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">

              <option value="">All Domains</option>
              <option>Cognitive</option>
              <option>Language</option>
              <option>Motor</option>
              <option>Social</option>
              <option>Creativity</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Student Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 md:col-span-1">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold mx-auto mb-2">
              {selectedStudent.
              split(' ').
              map((n) => n[0]).
              join('')}
            </div>
            <p className="font-bold text-gray-900">{selectedStudent}</p>
            <p className="text-sm text-gray-500">{selectedClass} · Section A</p>
            <div className="mt-3 p-2 bg-white rounded-lg">
              <p className="text-xs text-gray-500">Overall Progress</p>
              <p className="text-2xl font-bold text-blue-700">
                {overallScore}%
              </p>
            </div>
          </div>
        </Card>

        {/* Term Comparison Cards */}
        {[
        {
          term: 'Term 1',
          score: Math.round(
            domainPerformance.reduce((a, d) => a + d.term1, 0) /
            domainPerformance.length
          ),
          period: 'Apr–Jul 2024'
        },
        {
          term: 'Term 2',
          score: Math.round(
            domainPerformance.reduce((a, d) => a + d.term2, 0) /
            domainPerformance.length
          ),
          period: 'Aug–Nov 2024'
        },
        {
          term: 'Term 3',
          score: Math.round(
            domainPerformance.reduce((a, d) => a + d.term3, 0) /
            domainPerformance.length
          ),
          period: 'Dec–Mar 2025'
        }].
        map((t, i) =>
        <Card
          key={t.term}
          className={`p-4 ${i === 2 ? 'ring-2 ring-blue-400' : ''}`}>

            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-900">{t.term}</h3>
              {i === 2 &&
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  Latest
                </span>
            }
            </div>
            <p className="text-xs text-gray-500 mb-3">{t.period}</p>
            <div className="text-center">
              <p
              className={`text-3xl font-bold ${i === 2 ? 'text-blue-700' : 'text-gray-700'}`}>

                {t.score}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Average across all domains
              </p>
            </div>
            {i > 0 &&
          <div
            className={`mt-2 flex items-center justify-center gap-1 text-xs font-medium ${t.score > (i === 1 ? Math.round(domainPerformance.reduce((a, d) => a + d.term1, 0) / domainPerformance.length) : Math.round(domainPerformance.reduce((a, d) => a + d.term2, 0) / domainPerformance.length)) ? 'text-green-600' : 'text-red-500'}`}>

                <TrendingUp className="w-3 h-3" />
                {i === 1 ? '+' : '+'}
                {t.score - (i === 1 ? 62 : 77)}% from previous
              </div>
          }
          </Card>
        )}
      </div>

      {/* Domain Performance Chart */}
      <Card className="p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Domain-wise Progress (Term 1 → Term 2 → Term 3)
        </h2>
        <div className="space-y-5">
          {domainPerformance.map((domain) =>
          <div key={domain.domain}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {domain.domain}
                </span>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>
                    T1:{' '}
                    <span className="font-semibold text-gray-700">
                      {domain.term1}%
                    </span>
                  </span>
                  <span>
                    T2:{' '}
                    <span className="font-semibold text-gray-700">
                      {domain.term2}%
                    </span>
                  </span>
                  <span>
                    T3:{' '}
                    <span className="font-bold text-blue-700">
                      {domain.term3}%
                    </span>
                  </span>
                </div>
              </div>
              <div className="relative h-5 bg-gray-100 rounded-full overflow-hidden">
                <div
                className="absolute inset-y-0 left-0 bg-gray-300 rounded-full transition-all"
                style={{
                  width: `${domain.term1}%`,
                  opacity: 0.4
                }} />

                <div
                className="absolute inset-y-0 left-0 bg-gray-400 rounded-full transition-all"
                style={{
                  width: `${domain.term2}%`,
                  opacity: 0.6
                }} />

                <div
                className={`absolute inset-y-0 left-0 ${domain.color} rounded-full transition-all`}
                style={{
                  width: `${domain.term3}%`
                }} />

              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gray-300" />
            Term 1
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gray-400" />
            Term 2
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            Term 3 (Current)
          </div>
        </div>
      </Card>

      {/* Skill Progress Table */}
      <Card className="overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-800">
            Indicator-wise Progress
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {Object.entries(groupedSkills).map(([domain, skills]) =>
          <div key={domain}>
              <button
              onClick={() => toggleDomain(domain)}
              className="w-full flex items-center justify-between px-5 py-3 bg-gray-50 hover:bg-gray-100 transition-colors">

                <span className="font-semibold text-gray-700 text-sm">
                  {domain} Skills
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {skills.length} indicators
                  </span>
                  {expandedDomains.includes(domain) ?
                <ChevronUp className="w-4 h-4 text-gray-400" /> :

                <ChevronDown className="w-4 h-4 text-gray-400" />
                }
                </div>
              </button>
              {expandedDomains.includes(domain) &&
            <table className="w-full">
                  <thead className="bg-white border-b border-gray-100">
                    <tr>
                      <th className="py-2 px-5 text-left text-xs font-semibold text-gray-500 uppercase">
                        Skill / Indicator
                      </th>
                      <th className="py-2 px-4 text-center text-xs font-semibold text-gray-500 uppercase">
                        Term 1
                      </th>
                      <th className="py-2 px-4 text-center text-xs font-semibold text-gray-500 uppercase">
                        Term 2
                      </th>
                      <th className="py-2 px-4 text-center text-xs font-semibold text-gray-500 uppercase">
                        Term 3
                      </th>
                      <th className="py-2 px-4 text-center text-xs font-semibold text-gray-500 uppercase">
                        Progress
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {skills.map((skill) =>
                <tr key={skill.name} className="hover:bg-gray-50">
                        <td className="py-3 px-5 text-sm font-medium text-gray-900">
                          {skill.name}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${GRADE_COLORS[skill.term1]}`}>

                            {skill.term1}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${GRADE_COLORS[skill.term2]}`}>

                            {skill.term2}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${GRADE_COLORS[skill.term3]}`}>

                            {skill.term3}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {getTrendBadge(skill.trend)}
                        </td>
                      </tr>
                )}
                  </tbody>
                </table>
            }
            </div>
          )}
        </div>
      </Card>

      {/* Strength & Improvement Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5 border-green-200 bg-green-50">
          <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
            <Star className="w-5 h-5" />
            Strength Areas
          </h3>
          {strengthAreas.length > 0 ?
          <ul className="space-y-2">
              {strengthAreas.map((area) =>
            <li
              key={area}
              className="flex items-center gap-2 text-sm text-green-800">

                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  {area}
                </li>
            )}
            </ul> :

          <p className="text-sm text-green-700">
              Keep working — strengths are developing!
            </p>
          }
        </Card>
        <Card className="p-5 border-orange-200 bg-orange-50">
          <h3 className="font-bold text-orange-800 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Areas for Improvement
          </h3>
          {improvementAreas.length > 0 ?
          <ul className="space-y-2">
              {improvementAreas.map((area) =>
            <li
              key={area}
              className="flex items-center gap-2 text-sm text-orange-800">

                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  {area}
                </li>
            )}
            </ul> :

          <p className="text-sm text-orange-700">
              Great progress across all areas!
            </p>
          }
        </Card>
      </div>

      {/* Development Timeline */}
      <Card className="p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Development Timeline
        </h2>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
          <div className="space-y-4">
            {milestones.map((milestone, index) =>
            <div key={index} className="flex gap-4 relative">
                <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${milestone.type === 'achievement' ? 'bg-green-500' : milestone.type === 'improvement' ? 'bg-blue-500' : 'bg-yellow-500'}`}>

                  {milestone.type === 'achievement' ?
                <Star className="w-4 h-4 text-white" /> :
                milestone.type === 'improvement' ?
                <TrendingUp className="w-4 h-4 text-white" /> :

                <Minus className="w-4 h-4 text-white" />
                }
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-gray-900">
                      {milestone.date}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {milestone.term}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{milestone.event}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Overall Summary */}
      <Card className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <h2 className="text-lg font-bold text-gray-900 mb-3">
          Overall Development Summary
        </h2>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <strong>{selectedStudent} is progressing well</strong> in cognitive
            and language skills, showing consistent improvement across terms.
          </p>
          <p>
            <strong>Strength areas:</strong>{' '}
            {strengthAreas.join(', ') || 'Developing across all areas'}.
          </p>
          {improvementAreas.length > 0 &&
          <p>
              <strong>Areas for attention:</strong>{' '}
              {improvementAreas.join(', ')} — encourage supportive activities at
              home.
            </p>
          }
          <p className="pt-1 font-medium text-blue-700">
            Overall, {selectedStudent.split(' ')[0]} demonstrates enthusiasm for
            learning and is developing at an appropriate pace.
          </p>
        </div>
      </Card>
    </div>);

}