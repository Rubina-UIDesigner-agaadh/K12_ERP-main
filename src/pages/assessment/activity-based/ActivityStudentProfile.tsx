import React, { useState } from 'react';
import {
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  Star,
  MessageSquare,
  AlertTriangle,
  ChevronDown,
  User,
  BarChart3,
  Heart,
  Settings,
  Palette,
  Shield,
  Activity,
  Users,
  Globe,
  CheckCircle,
  Calendar,
  BookOpen } from
'lucide-react';
interface StudentData {
  id: string;
  rollNo: string;
  name: string;
  class: string;
  section: string;
  photo?: string;
  grades: {
    term1: Record<string, string>;
    term2: Record<string, string>;
  };
  remarks: {
    teacher: string;
    area: string;
    date: string;
    text: string;
  }[];
  disciplineLog: {
    date: string;
    incident: string;
    action: string;
    severity: 'Low' | 'Medium' | 'High';
  }[];
  attendance: number;
}
const AREAS = [
{
  id: 'ls',
  name: 'Life Skills',
  icon: Heart,
  color: 'indigo'
},
{
  id: 'we',
  name: 'Work Education',
  icon: Settings,
  color: 'amber'
},
{
  id: 'vpa',
  name: 'Visual & Performing Arts',
  icon: Palette,
  color: 'purple'
},
{
  id: 'av',
  name: 'Attitudes & Values',
  icon: Shield,
  color: 'teal'
},
{
  id: 'hpe',
  name: 'Health & Physical Education',
  icon: Activity,
  color: 'green'
},
{
  id: 'dis',
  name: 'Discipline',
  icon: CheckCircle,
  color: 'blue'
},
{
  id: 'cap',
  name: 'Club Participation',
  icon: Users,
  color: 'orange'
},
{
  id: 'sr',
  name: 'Social Responsibility',
  icon: Globe,
  color: 'rose'
}];

const colorMap: Record<
  string,
  {
    bg: string;
    text: string;
    light: string;
    border: string;
  }> =
{
  indigo: {
    bg: 'bg-indigo-500',
    text: 'text-indigo-700',
    light: 'bg-indigo-50',
    border: 'border-indigo-200'
  },
  amber: {
    bg: 'bg-amber-500',
    text: 'text-amber-700',
    light: 'bg-amber-50',
    border: 'border-amber-200'
  },
  purple: {
    bg: 'bg-purple-500',
    text: 'text-purple-700',
    light: 'bg-purple-50',
    border: 'border-purple-200'
  },
  teal: {
    bg: 'bg-teal-500',
    text: 'text-teal-700',
    light: 'bg-teal-50',
    border: 'border-teal-200'
  },
  green: {
    bg: 'bg-green-500',
    text: 'text-green-700',
    light: 'bg-green-50',
    border: 'border-green-200'
  },
  blue: {
    bg: 'bg-blue-500',
    text: 'text-blue-700',
    light: 'bg-blue-50',
    border: 'border-blue-200'
  },
  orange: {
    bg: 'bg-orange-500',
    text: 'text-orange-700',
    light: 'bg-orange-50',
    border: 'border-orange-200'
  },
  rose: {
    bg: 'bg-rose-500',
    text: 'text-rose-700',
    light: 'bg-rose-50',
    border: 'border-rose-200'
  }
};
const gradeColors: Record<string, string> = {
  A: 'bg-green-100 text-green-700 border-green-200',
  B: 'bg-blue-100 text-blue-700 border-blue-200',
  C: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  D: 'bg-orange-100 text-orange-700 border-orange-200',
  E: 'bg-red-100 text-red-700 border-red-200'
};
const gradePoints: Record<string, number> = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
  E: 1
};
const mockStudents: StudentData[] = [
{
  id: 's1',
  rollNo: '01',
  name: 'Advait Krishnan',
  class: '8',
  section: 'A',
  attendance: 96.5,
  grades: {
    term1: {
      ls: 'A',
      we: 'B',
      vpa: 'A',
      av: 'A',
      hpe: 'B',
      dis: 'A',
      cap: 'B',
      sr: 'A'
    },
    term2: {
      ls: 'A',
      we: 'A',
      vpa: 'A',
      av: 'A',
      hpe: 'A',
      dis: 'A',
      cap: 'A',
      sr: 'A'
    }
  },
  remarks: [
  {
    teacher: 'Mrs. Priya Sharma',
    area: 'Life Skills',
    date: '2024-12-10',
    text: 'Advait demonstrates exceptional problem-solving abilities and consistently helps peers in group activities. His communication skills have improved remarkably this term.'
  },
  {
    teacher: 'Mr. Rajesh Kumar',
    area: 'Visual & Performing Arts',
    date: '2024-11-20',
    text: 'Outstanding performance in the Annual Art Exhibition. His artwork showed creativity and technical skill beyond his age group.'
  },
  {
    teacher: 'Mr. Suresh Nair',
    area: 'Health & Physical Education',
    date: '2024-10-15',
    text: 'Excellent sportsmanship and physical fitness. Represented the school in the inter-school athletics meet.'
  },
  {
    teacher: 'Mrs. Kavitha Menon',
    area: 'Social Responsibility',
    date: '2024-12-01',
    text: 'Took initiative in organizing the community service drive. Showed great empathy and leadership.'
  }],

  disciplineLog: [
  {
    date: '2024-07-15',
    incident: 'Minor classroom disruption during free period',
    action: 'Verbal counseling by class teacher',
    severity: 'Low'
  }]

},
{
  id: 's2',
  rollNo: '02',
  name: 'Ananya Sharma',
  class: '8',
  section: 'A',
  attendance: 92.0,
  grades: {
    term1: {
      ls: 'B',
      we: 'B',
      vpa: 'A',
      av: 'A',
      hpe: 'C',
      dis: 'B',
      cap: 'A',
      sr: 'B'
    },
    term2: {
      ls: 'A',
      we: 'B',
      vpa: 'A',
      av: 'A',
      hpe: 'B',
      dis: 'A',
      cap: 'A',
      sr: 'A'
    }
  },
  remarks: [
  {
    teacher: 'Mrs. Priya Sharma',
    area: 'Life Skills',
    date: '2024-12-08',
    text: 'Ananya has shown significant improvement in decision-making skills. She is more confident in expressing her ideas.'
  },
  {
    teacher: 'Mr. Rajesh Kumar',
    area: 'Visual & Performing Arts',
    date: '2024-11-18',
    text: 'Exceptional talent in classical dance. Won First Prize at the Cultural Fest.'
  }],

  disciplineLog: []
},
{
  id: 's3',
  rollNo: '03',
  name: 'Arjun Patel',
  class: '8',
  section: 'A',
  attendance: 88.5,
  grades: {
    term1: {
      ls: 'C',
      we: 'C',
      vpa: 'B',
      av: 'B',
      hpe: 'A',
      dis: 'C',
      cap: 'B',
      sr: 'C'
    },
    term2: {
      ls: 'B',
      we: 'C',
      vpa: 'B',
      av: 'B',
      hpe: 'A',
      dis: 'B',
      cap: 'B',
      sr: 'C'
    }
  },
  remarks: [
  {
    teacher: 'Mr. Suresh Nair',
    area: 'Health & Physical Education',
    date: '2024-12-05',
    text: 'Excellent athlete. Arjun excels in sports but needs to balance academics and extracurriculars better.'
  }],

  disciplineLog: [
  {
    date: '2024-08-20',
    incident: 'Late to school on 3 consecutive days',
    action: 'Parent meeting conducted',
    severity: 'Medium'
  },
  {
    date: '2024-10-05',
    incident: 'Incomplete homework submission',
    action: 'Written warning issued',
    severity: 'Low'
  }]

}];

function RadarChart({ grades }: {grades: Record<string, string>;}) {
  const size = 200;
  const center = size / 2;
  const maxRadius = 80;
  const n = AREAS.length;
  const getPoint = (index: number, radius: number) => {
    const angle = index * 2 * Math.PI / n - Math.PI / 2;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle)
    };
  };
  const getLabelPoint = (index: number) => {
    const angle = index * 2 * Math.PI / n - Math.PI / 2;
    const r = maxRadius + 22;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };
  const dataPoints = AREAS.map((area, idx) => {
    const grade = grades[area.id] || 'C';
    const val = (gradePoints[grade] || 3) / 5;
    return getPoint(idx, val * maxRadius);
  });
  const dataPath =
  dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') +
  ' Z';
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];
  return (
    <svg
      width={size + 60}
      height={size + 60}
      viewBox={`-30 -30 ${size + 60} ${size + 60}`}
      className="mx-auto">

      {/* Grid */}
      {gridLevels.map((level, li) => {
        const pts = AREAS.map((_, idx) => getPoint(idx, level * maxRadius));
        const path =
        pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') +
        ' Z';
        return (
          <path
            key={li}
            d={path}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1" />);


      })}
      {/* Axes */}
      {AREAS.map((_, idx) => {
        const outer = getPoint(idx, maxRadius);
        return (
          <line
            key={idx}
            x1={center}
            y1={center}
            x2={outer.x}
            y2={outer.y}
            stroke="#e5e7eb"
            strokeWidth="1" />);


      })}
      {/* Data polygon */}
      <path
        d={dataPath}
        fill="rgba(99, 102, 241, 0.2)"
        stroke="rgb(99, 102, 241)"
        strokeWidth="2" />

      {/* Data points */}
      {dataPoints.map((p, idx) =>
      <circle key={idx} cx={p.x} cy={p.y} r="4" fill="rgb(99, 102, 241)" />
      )}
      {/* Labels */}
      {AREAS.map((area, idx) => {
        const lp = getLabelPoint(idx);
        const shortNames: Record<string, string> = {
          ls: 'Life Skills',
          we: 'Work Ed.',
          vpa: 'Arts',
          av: 'Values',
          hpe: 'Health',
          dis: 'Discipline',
          cap: 'Clubs',
          sr: 'Social'
        };
        return (
          <text
            key={idx}
            x={lp.x}
            y={lp.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="9"
            fill="#6b7280"
            fontWeight="500">

            {shortNames[area.id]}
          </text>);

      })}
    </svg>);

}
export function ActivityStudentProfile() {
  const [selectedStudentId, setSelectedStudentId] = useState('s1');
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const student = mockStudents.find((s) => s.id === selectedStudentId)!;
  const getOverallGrade = (areaId: string) => {
    const t1 = gradePoints[student.grades.term1[areaId]] || 3;
    const t2 = gradePoints[student.grades.term2[areaId]] || 3;
    const avg = t1 * 0.4 + t2 * 0.6;
    if (avg >= 4.5) return 'A';
    if (avg >= 3.5) return 'B';
    if (avg >= 2.5) return 'C';
    if (avg >= 1.5) return 'D';
    return 'E';
  };
  const getTrend = (areaId: string) => {
    const t1 = gradePoints[student.grades.term1[areaId]] || 3;
    const t2 = gradePoints[student.grades.term2[areaId]] || 3;
    if (t2 > t1) return 'up';
    if (t2 < t1) return 'down';
    return 'same';
  };
  const overallGrades = Object.fromEntries(
    AREAS.map((a) => [a.id, getOverallGrade(a.id)])
  );
  const topAreas = AREAS.filter((a) => overallGrades[a.id] === 'A').slice(0, 3);
  const overallGP =
  AREAS.reduce((sum, a) => sum + (gradePoints[overallGrades[a.id]] || 3), 0) /
  AREAS.length;
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg">
          <User className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Co-Scholastic Student Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Holistic view of student's co-scholastic performance and development
          </p>
        </div>
      </div>

      {/* Student Selector */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Select Student
            </label>
            <div className="flex gap-3">
              {mockStudents.map((s) =>
              <button
                key={s.id}
                onClick={() => setSelectedStudentId(s.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${selectedStudentId === s.id ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}>

                  <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold">
                    {s.rollNo}
                  </span>
                  {s.name}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Student Info Card */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold">
              {student.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{student.name}</h2>
              <p className="text-indigo-200">
                Class {student.class}-{student.section} · Roll No.{' '}
                {student.rollNo}
              </p>
              <p className="text-indigo-200 text-sm mt-1">
                Academic Year 2024-25
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-2xl font-bold">{overallGP.toFixed(1)}</p>
              <p className="text-xs text-indigo-200">Avg Grade Point</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-2xl font-bold">
                {AREAS.filter((a) => overallGrades[a.id] === 'A').length}
              </p>
              <p className="text-xs text-indigo-200">A Grades</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-2xl font-bold">{student.attendance}%</p>
              <p className="text-xs text-indigo-200">Attendance</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-600" /> Skill Radar —
            Overall
          </h3>
          <RadarChart grades={overallGrades} />
        </div>

        {/* Area-wise Grades */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600" /> Area-wise Grade
            Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {AREAS.map((area) => {
              const c = colorMap[area.color];
              const Icon = area.icon;
              const overall = overallGrades[area.id];
              const trend = getTrend(area.id);
              return (
                <div
                  key={area.id}
                  className={`p-3 rounded-xl border ${c.border} ${c.light}`}>

                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-5 h-5 ${c.text}`} />
                    {trend === 'up' ?
                    <TrendingUp className="w-4 h-4 text-green-500" /> :
                    trend === 'down' ?
                    <TrendingDown className="w-4 h-4 text-red-500" /> :

                    <Minus className="w-4 h-4 text-gray-400" />
                    }
                  </div>
                  <p className="text-xs font-medium text-gray-600 mb-1">
                    {area.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border ${gradeColors[overall]}`}>

                      {overall}
                    </span>
                    <div className="text-xs text-gray-500">
                      <div>
                        T1:{' '}
                        <span className="font-medium">
                          {student.grades.term1[area.id]}
                        </span>
                      </div>
                      <div>
                        T2:{' '}
                        <span className="font-medium">
                          {student.grades.term2[area.id]}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>);

            })}
          </div>
        </div>
      </div>

      {/* Term Comparison Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Term Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Co-Scholastic Area
                </th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                  Term 1
                </th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                  Term 2
                </th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                  Overall
                </th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {AREAS.map((area) => {
                const t1 = student.grades.term1[area.id];
                const t2 = student.grades.term2[area.id];
                const overall = overallGrades[area.id];
                const trend = getTrend(area.id);
                const Icon = area.icon;
                const c = colorMap[area.color];
                return (
                  <tr key={area.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${c.light}`}>
                          <Icon className={`w-4 h-4 ${c.text}`} />
                        </div>
                        <span className="font-medium text-gray-900">
                          {area.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border ${gradeColors[t1]}`}>

                        {t1}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border ${gradeColors[t2]}`}>

                        {t2}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border ${gradeColors[overall]}`}>

                        {overall}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {trend === 'up' ?
                      <TrendingUp className="w-5 h-5 text-green-500 mx-auto" /> :
                      trend === 'down' ?
                      <TrendingDown className="w-5 h-5 text-red-500 mx-auto" /> :

                      <Minus className="w-5 h-5 text-gray-400 mx-auto" />
                      }
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strength Indicators */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" /> Strength Indicators
          </h3>
          <div className="space-y-3">
            {topAreas.length > 0 ?
            topAreas.map((area) => {
              const c = colorMap[area.color];
              const Icon = area.icon;
              return (
                <div
                  key={area.id}
                  className={`flex items-center gap-3 p-3 rounded-xl ${c.light} border ${c.border}`}>

                    <div className={`p-2 rounded-lg bg-white`}>
                      <Icon className={`w-5 h-5 ${c.text}`} />
                    </div>
                    <div>
                      <p className={`font-semibold ${c.text}`}>{area.name}</p>
                      <p className="text-xs text-gray-500">
                        Outstanding performance — Grade A in both terms
                      </p>
                    </div>
                    <span
                    className={`ml-auto inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border ${gradeColors['A']}`}>

                      A
                    </span>
                  </div>);

            }) :

            <p className="text-sm text-gray-500">
                No A-grade areas identified yet.
              </p>
            }
          </div>
        </div>

        {/* Teacher Remarks */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-500" /> Teacher Remarks
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {student.remarks.map((remark, idx) =>
            <div
              key={idx}
              className="p-3 bg-blue-50 rounded-xl border border-blue-100">

                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-blue-700">
                    {remark.teacher}
                  </span>
                  <span className="text-xs text-gray-400">{remark.date}</span>
                </div>
                <p className="text-xs text-gray-500 mb-1">{remark.area}</p>
                <p className="text-sm text-gray-700">{remark.text}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Discipline Log */}
      {student.disciplineLog.length > 0 &&
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            <h3 className="font-semibold text-gray-900">
              Behavior / Discipline Log
            </h3>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Date
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Incident
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Action Taken
                </th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                  Severity
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {student.disciplineLog.map((entry, idx) =>
            <tr key={idx} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {entry.date}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {entry.incident}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {entry.action}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${entry.severity === 'High' ? 'bg-red-100 text-red-700' : entry.severity === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'}`}>

                      {entry.severity}
                    </span>
                  </td>
                </tr>
            )}
            </tbody>
          </table>
        </div>
      }
    </div>);

}