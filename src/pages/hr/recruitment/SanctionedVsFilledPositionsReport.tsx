import React, { useMemo, useState } from 'react';
import {
  Building,
  X,
  Target,
  CheckCircle,
  AlertCircle,
  Download,
  RefreshCw,
  Users,
  TrendingUp,
  BarChart3,
  Filter,
  Calendar } from
'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
const BRANCHES = [
{
  id: 'all',
  name: 'All Branches'
},
{
  id: 'main',
  name: 'Main Campus'
},
{
  id: 'north',
  name: 'North Wing'
},
{
  id: 'south',
  name: 'South Wing'
},
{
  id: 'east',
  name: 'East Campus'
}];

const ACADEMIC_YEARS = [
{
  value: '2024-2025',
  label: '2024-2025'
},
{
  value: '2023-2024',
  label: '2023-2024'
},
{
  value: '2022-2023',
  label: '2022-2023'
}];

interface DeptData {
  dept: string;
  branch: string;
  campus: string;
  sanctioned: number;
  filled: number;
  vacant: number;
  inProgress: number;
  roleType: 'Teaching' | 'Non-Teaching' | 'Mixed';
}
const deptData: DeptData[] = [
{
  dept: 'Mathematics',
  branch: 'main',
  campus: 'Main Campus',
  sanctioned: 10,
  filled: 8,
  vacant: 2,
  inProgress: 2,
  roleType: 'Teaching'
},
{
  dept: 'Science',
  branch: 'main',
  campus: 'Main Campus',
  sanctioned: 12,
  filled: 10,
  vacant: 2,
  inProgress: 1,
  roleType: 'Teaching'
},
{
  dept: 'English',
  branch: 'main',
  campus: 'Main Campus',
  sanctioned: 8,
  filled: 7,
  vacant: 1,
  inProgress: 1,
  roleType: 'Teaching'
},
{
  dept: 'Administration',
  branch: 'north',
  campus: 'North Wing',
  sanctioned: 6,
  filled: 5,
  vacant: 1,
  inProgress: 1,
  roleType: 'Non-Teaching'
},
{
  dept: 'Computer Science',
  branch: 'north',
  campus: 'North Wing',
  sanctioned: 6,
  filled: 4,
  vacant: 2,
  inProgress: 2,
  roleType: 'Teaching'
},
{
  dept: 'Social Studies',
  branch: 'north',
  campus: 'North Wing',
  sanctioned: 7,
  filled: 6,
  vacant: 1,
  inProgress: 0,
  roleType: 'Teaching'
},
{
  dept: 'Physical Education',
  branch: 'south',
  campus: 'South Wing',
  sanctioned: 4,
  filled: 3,
  vacant: 1,
  inProgress: 1,
  roleType: 'Teaching'
},
{
  dept: 'Library',
  branch: 'south',
  campus: 'South Wing',
  sanctioned: 3,
  filled: 2,
  vacant: 1,
  inProgress: 0,
  roleType: 'Non-Teaching'
},
{
  dept: 'Arts & Craft',
  branch: 'east',
  campus: 'East Campus',
  sanctioned: 5,
  filled: 3,
  vacant: 2,
  inProgress: 1,
  roleType: 'Teaching'
},
{
  dept: 'Transport',
  branch: 'east',
  campus: 'East Campus',
  sanctioned: 4,
  filled: 4,
  vacant: 0,
  inProgress: 0,
  roleType: 'Non-Teaching'
},
{
  dept: 'Finance',
  branch: 'main',
  campus: 'Main Campus',
  sanctioned: 3,
  filled: 2,
  vacant: 1,
  inProgress: 0,
  roleType: 'Non-Teaching'
},
{
  dept: 'IT Support',
  branch: 'north',
  campus: 'North Wing',
  sanctioned: 2,
  filled: 1,
  vacant: 1,
  inProgress: 1,
  roleType: 'Non-Teaching'
}];

export function SanctionedVsFilledPositionsReport() {
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['all']);
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [filterRoleType, setFilterRoleType] = useState('all');
  const [filterDept, setFilterDept] = useState('all');
  const handleBranchToggle = (branchId: string) => {
    if (branchId === 'all') {
      setSelectedBranches(['all']);
    } else {
      const without = selectedBranches.filter(
        (b) => b !== 'all' && b !== branchId
      );
      const adding = !selectedBranches.includes(branchId);
      const next = adding ? [...without, branchId] : without;
      setSelectedBranches(next.length === 0 ? ['all'] : next);
    }
  };
  const activeBranches = selectedBranches.includes('all') ?
  ['main', 'north', 'south', 'east'] :
  selectedBranches;
  const filtered = useMemo(
    () =>
    deptData.filter((d) => {
      const branchMatch = activeBranches.includes(d.branch);
      const roleMatch =
      filterRoleType === 'all' || d.roleType === filterRoleType;
      const deptMatch = filterDept === 'all' || d.dept === filterDept;
      return branchMatch && roleMatch && deptMatch;
    }),
    [activeBranches, filterRoleType, filterDept]
  );
  const totals = useMemo(
    () => ({
      sanctioned: filtered.reduce((s, d) => s + d.sanctioned, 0),
      filled: filtered.reduce((s, d) => s + d.filled, 0),
      vacant: filtered.reduce((s, d) => s + d.vacant, 0),
      inProgress: filtered.reduce((s, d) => s + d.inProgress, 0)
    }),
    [filtered]
  );
  const filledPct =
  totals.sanctioned > 0 ?
  (totals.filled / totals.sanctioned * 100).toFixed(1) :
  '0';
  const vacancyPct =
  totals.sanctioned > 0 ?
  (totals.vacant / totals.sanctioned * 100).toFixed(1) :
  '0';
  const getBranchName = (id: string) =>
  BRANCHES.find((b) => b.id === id)?.name || id;
  const departments = [...new Set(deptData.map((d) => d.dept))];
  // Group by branch for branch-wise summary
  const branchSummary = useMemo(() => {
    const summary: Record<
      string,
      {
        sanctioned: number;
        filled: number;
        vacant: number;
        inProgress: number;
      }> =
    {};
    filtered.forEach((d) => {
      if (!summary[d.branch])
      summary[d.branch] = {
        sanctioned: 0,
        filled: 0,
        vacant: 0,
        inProgress: 0
      };
      summary[d.branch].sanctioned += d.sanctioned;
      summary[d.branch].filled += d.filled;
      summary[d.branch].vacant += d.vacant;
      summary[d.branch].inProgress += d.inProgress;
    });
    return summary;
  }, [filtered]);
  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Target className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Sanctioned vs Filled Positions Report
              </h1>
              <p className="text-sm text-gray-500">
                Department-wise headcount analysis and vacancy tracking
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select
              label=""
              options={ACADEMIC_YEARS}
              value={academicYear}
              onChange={setAcademicYear}
              className="w-36" />

            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t flex flex-wrap items-center gap-3">
          <Building className="w-5 h-5 text-gray-500 flex-shrink-0" />
          <span className="text-sm font-medium text-gray-700 flex-shrink-0">
            Branches:
          </span>
          {BRANCHES.map((branch) =>
          <button
            key={branch.id}
            onClick={() => handleBranchToggle(branch.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${selectedBranches.includes(branch.id) || branch.id !== 'all' && selectedBranches.includes('all') ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>

              {branch.name}
              {selectedBranches.includes(branch.id) && branch.id !== 'all' &&
            <X
              className="w-3 h-3"
              onClick={(e) => {
                e.stopPropagation();
                handleBranchToggle(branch.id);
              }} />

            }
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Select
            label=""
            options={[
            {
              value: 'all',
              label: 'All Role Types'
            },
            {
              value: 'Teaching',
              label: 'Teaching'
            },
            {
              value: 'Non-Teaching',
              label: 'Non-Teaching'
            }]
            }
            value={filterRoleType}
            onChange={setFilterRoleType}
            className="w-40" />

          <Select
            label=""
            options={[
            {
              value: 'all',
              label: 'All Departments'
            },
            ...departments.map((d) => ({
              value: d,
              label: d
            }))]
            }
            value={filterDept}
            onChange={setFilterDept}
            className="w-44" />

        </div>
      </Card>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="p-2 bg-blue-100 rounded-lg w-fit mb-3">
            <Target className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {totals.sanctioned}
          </p>
          <p className="text-sm text-gray-500">Sanctioned Posts</p>
          <p className="text-xs text-gray-400 mt-1">AY {academicYear}</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="p-2 bg-green-100 rounded-lg w-fit mb-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-700">{totals.filled}</p>
          <p className="text-sm text-gray-500">Filled Posts</p>
          <p className="text-xs text-green-600 mt-1">{filledPct}% filled</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500">
          <div className="p-2 bg-red-100 rounded-lg w-fit mb-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-red-700">{totals.vacant}</p>
          <p className="text-sm text-gray-500">Vacant Posts</p>
          <p className="text-xs text-red-600 mt-1">{vacancyPct}% vacancy</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-orange-500">
          <div className="p-2 bg-orange-100 rounded-lg w-fit mb-3">
            <Users className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-orange-700">
            {totals.inProgress}
          </p>
          <p className="text-sm text-gray-500">Hiring in Progress</p>
          <p className="text-xs text-orange-600 mt-1">Active recruitment</p>
        </Card>
      </div>

      {/* Overall Fill Rate */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Overall Fill Rate</h3>
          <span className="text-sm font-bold text-indigo-700">
            {filledPct}%
          </span>
        </div>
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-green-500 transition-all"
            style={{
              width: `${filledPct}%`
            }}>
          </div>
          <div
            className="h-full bg-orange-400 transition-all"
            style={{
              width: `${totals.sanctioned > 0 ? totals.inProgress / totals.sanctioned * 100 : 0}%`
            }}>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
            Filled ({totals.filled})
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-orange-400 inline-block"></span>
            In Progress ({totals.inProgress})
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-gray-200 inline-block"></span>
            Vacant ({totals.vacant})
          </span>
        </div>
      </Card>

      {/* Branch-wise Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(branchSummary).map(([branch, stats]) => {
          const pct =
          stats.sanctioned > 0 ?
          Math.round(stats.filled / stats.sanctioned * 100) :
          0;
          return (
            <Card key={branch} className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Building className="w-4 h-4 text-indigo-600" />
                <h4 className="font-semibold text-gray-900">
                  {getBranchName(branch)}
                </h4>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div className="bg-blue-50 rounded-lg p-2 text-center">
                  <p className="font-bold text-blue-700">{stats.sanctioned}</p>
                  <p className="text-xs text-gray-500">Sanctioned</p>
                </div>
                <div className="bg-green-50 rounded-lg p-2 text-center">
                  <p className="font-bold text-green-700">{stats.filled}</p>
                  <p className="text-xs text-gray-500">Filled</p>
                </div>
                <div className="bg-red-50 rounded-lg p-2 text-center">
                  <p className="font-bold text-red-700">{stats.vacant}</p>
                  <p className="text-xs text-gray-500">Vacant</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-2 text-center">
                  <p className="font-bold text-orange-700">
                    {stats.inProgress}
                  </p>
                  <p className="text-xs text-gray-500">In Progress</p>
                </div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{
                    width: `${pct}%`
                  }}>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-right">
                {pct}% filled
              </p>
            </Card>);

        })}
      </div>

      {/* Department-wise Table */}
      <Card title="Department-wise Detailed Report">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left py-3 px-4 text-gray-500 font-medium">
                  Department
                </th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">
                  Campus
                </th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">
                  Role Type
                </th>
                <th className="text-center py-3 px-4 text-gray-500 font-medium">
                  Sanctioned
                </th>
                <th className="text-center py-3 px-4 text-gray-500 font-medium">
                  Filled
                </th>
                <th className="text-center py-3 px-4 text-gray-500 font-medium">
                  Vacant
                </th>
                <th className="text-center py-3 px-4 text-gray-500 font-medium">
                  In Progress
                </th>
                <th className="text-center py-3 px-4 text-gray-500 font-medium">
                  Vacancy %
                </th>
                <th className="text-center py-3 px-4 text-gray-500 font-medium">
                  Fill Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((dept, i) => {
                const vacPct =
                dept.sanctioned > 0 ?
                (dept.vacant / dept.sanctioned * 100).toFixed(0) :
                '0';
                const fillPct =
                dept.sanctioned > 0 ?
                (dept.filled / dept.sanctioned * 100).toFixed(0) :
                '0';
                return (
                  <tr
                    key={i}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors">

                    <td className="py-3 px-4 font-medium text-gray-900">
                      {dept.dept}
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs">
                      {dept.campus}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${dept.roleType === 'Teaching' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>

                        {dept.roleType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-gray-900">
                      {dept.sanctioned}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-green-700">
                      {dept.filled}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`font-bold ${dept.vacant > 0 ? 'text-red-600' : 'text-gray-400'}`}>

                        {dept.vacant}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {dept.inProgress > 0 ?
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
                          {dept.inProgress} active
                        </span> :

                      <span className="text-gray-400">—</span>
                      }
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-sm font-bold ${parseInt(vacPct) > 20 ? 'text-red-600' : parseInt(vacPct) > 10 ? 'text-orange-600' : 'text-gray-600'}`}>

                        {vacPct}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${parseInt(fillPct) >= 90 ? 'bg-green-500' : parseInt(fillPct) >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{
                              width: `${fillPct}%`
                            }}>
                          </div>
                        </div>
                        <span className="text-xs font-medium text-gray-700 w-8">
                          {fillPct}%
                        </span>
                      </div>
                    </td>
                  </tr>);

              })}
            </tbody>
            <tfoot>
              <tr className="bg-indigo-50 font-semibold">
                <td className="py-3 px-4 text-indigo-900" colSpan={3}>
                  Grand Total
                </td>
                <td className="py-3 px-4 text-center text-indigo-900">
                  {totals.sanctioned}
                </td>
                <td className="py-3 px-4 text-center text-green-700">
                  {totals.filled}
                </td>
                <td className="py-3 px-4 text-center text-red-700">
                  {totals.vacant}
                </td>
                <td className="py-3 px-4 text-center text-orange-700">
                  {totals.inProgress}
                </td>
                <td className="py-3 px-4 text-center text-indigo-700">
                  {vacancyPct}%
                </td>
                <td className="py-3 px-4 text-center text-indigo-700">
                  {filledPct}%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>);

}