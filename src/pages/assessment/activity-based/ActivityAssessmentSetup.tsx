import React, { useState, Fragment, Component } from 'react';
import {
  Settings,
  Save,
  Plus,
  Edit,
  Trash2,
  X,
  Check,
  Calendar,
  Users,
  Lock,
  Unlock,
  ChevronDown,
  ChevronUp,
  Award,
  Layers,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle,
  Info,
  Loader2,
  ToggleLeft,
  ToggleRight,
  User,
  BookOpen,
  RefreshCw } from
'lucide-react';
type TabId = 'grade-scale' | 'term-setup' | 'teacher-assignment' | 'lock-rules';
interface GradeRow {
  grade: string;
  gradePoint: number;
  minMarks: number;
  maxMarks: number;
  description: string;
}
interface BoardGradeScale {
  board: string;
  grades: GradeRow[];
}
interface Term {
  id: string;
  name: string;
  type: 'Term 1' | 'Term 2' | 'Annual';
  startDate: string;
  endDate: string;
  continuousAssessment: boolean;
  weightage: number;
  status: 'Active' | 'Upcoming' | 'Closed';
}
interface TeacherAssignment {
  id: string;
  className: string;
  section: string;
  area: string;
  teacherName: string;
  role: 'Class Teacher' | 'Activity Teacher' | 'Evaluator';
  assignedDate: string;
}
interface LockRule {
  id: string;
  area: string;
  term: string;
  editableTill: string;
  approvalWorkflow: string[];
  status: 'Open' | 'Locked';
  lockedBy?: string;
  lockedAt?: string;
}
interface AuditEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
}
const boardScales: BoardGradeScale[] = [
{
  board: 'CBSE',
  grades: [
  {
    grade: 'A1',
    gradePoint: 10,
    minMarks: 91,
    maxMarks: 100,
    description: 'Outstanding'
  },
  {
    grade: 'A2',
    gradePoint: 9,
    minMarks: 81,
    maxMarks: 90,
    description: 'Excellent'
  },
  {
    grade: 'B1',
    gradePoint: 8,
    minMarks: 71,
    maxMarks: 80,
    description: 'Very Good'
  },
  {
    grade: 'B2',
    gradePoint: 7,
    minMarks: 61,
    maxMarks: 70,
    description: 'Good'
  },
  {
    grade: 'C1',
    gradePoint: 6,
    minMarks: 51,
    maxMarks: 60,
    description: 'Above Average'
  },
  {
    grade: 'C2',
    gradePoint: 5,
    minMarks: 41,
    maxMarks: 50,
    description: 'Average'
  },
  {
    grade: 'D',
    gradePoint: 4,
    minMarks: 33,
    maxMarks: 40,
    description: 'Below Average'
  },
  {
    grade: 'E',
    gradePoint: 0,
    minMarks: 0,
    maxMarks: 32,
    description: 'Needs Improvement'
  }]

},
{
  board: 'ICSE',
  grades: [
  {
    grade: 'A',
    gradePoint: 5,
    minMarks: 80,
    maxMarks: 100,
    description: 'Excellent'
  },
  {
    grade: 'B',
    gradePoint: 4,
    minMarks: 60,
    maxMarks: 79,
    description: 'Very Good'
  },
  {
    grade: 'C',
    gradePoint: 3,
    minMarks: 40,
    maxMarks: 59,
    description: 'Good'
  },
  {
    grade: 'D',
    gradePoint: 2,
    minMarks: 20,
    maxMarks: 39,
    description: 'Satisfactory'
  },
  {
    grade: 'E',
    gradePoint: 1,
    minMarks: 0,
    maxMarks: 19,
    description: 'Needs Improvement'
  }]

},
{
  board: 'State Board',
  grades: [
  {
    grade: 'A+',
    gradePoint: 10,
    minMarks: 90,
    maxMarks: 100,
    description: 'Exceptional'
  },
  {
    grade: 'A',
    gradePoint: 9,
    minMarks: 80,
    maxMarks: 89,
    description: 'Excellent'
  },
  {
    grade: 'B+',
    gradePoint: 8,
    minMarks: 70,
    maxMarks: 79,
    description: 'Very Good'
  },
  {
    grade: 'B',
    gradePoint: 7,
    minMarks: 60,
    maxMarks: 69,
    description: 'Good'
  },
  {
    grade: 'C',
    gradePoint: 6,
    minMarks: 50,
    maxMarks: 59,
    description: 'Average'
  },
  {
    grade: 'D',
    gradePoint: 5,
    minMarks: 33,
    maxMarks: 49,
    description: 'Below Average'
  },
  {
    grade: 'E',
    gradePoint: 0,
    minMarks: 0,
    maxMarks: 32,
    description: 'Needs Improvement'
  }]

}];

const mockTerms: Term[] = [
{
  id: 't1',
  name: 'Term 1 (2024-25)',
  type: 'Term 1',
  startDate: '2024-04-01',
  endDate: '2024-09-30',
  continuousAssessment: true,
  weightage: 40,
  status: 'Closed'
},
{
  id: 't2',
  name: 'Term 2 (2024-25)',
  type: 'Term 2',
  startDate: '2024-10-01',
  endDate: '2025-03-31',
  continuousAssessment: true,
  weightage: 60,
  status: 'Active'
},
{
  id: 't3',
  name: 'Annual (2025-26)',
  type: 'Annual',
  startDate: '2025-04-01',
  endDate: '2026-03-31',
  continuousAssessment: false,
  weightage: 100,
  status: 'Upcoming'
}];

const mockTeachers: TeacherAssignment[] = [
{
  id: 'ta1',
  className: 'Class 8',
  section: 'A',
  area: 'Life Skills',
  teacherName: 'Mrs. Priya Sharma',
  role: 'Class Teacher',
  assignedDate: '2024-04-01'
},
{
  id: 'ta2',
  className: 'Class 8',
  section: 'A',
  area: 'Visual & Performing Arts',
  teacherName: 'Mr. Rajesh Kumar',
  role: 'Activity Teacher',
  assignedDate: '2024-04-01'
},
{
  id: 'ta3',
  className: 'Class 8',
  section: 'A',
  area: 'Health & Physical Education',
  teacherName: 'Mr. Suresh Nair',
  role: 'Activity Teacher',
  assignedDate: '2024-04-01'
},
{
  id: 'ta4',
  className: 'Class 8',
  section: 'B',
  area: 'Life Skills',
  teacherName: 'Mrs. Anita Desai',
  role: 'Class Teacher',
  assignedDate: '2024-04-01'
},
{
  id: 'ta5',
  className: 'Class 9',
  section: 'A',
  area: 'Life Skills',
  teacherName: 'Mr. Vikram Patel',
  role: 'Class Teacher',
  assignedDate: '2024-04-01'
},
{
  id: 'ta6',
  className: 'Class 9',
  section: 'A',
  area: 'Work Education',
  teacherName: 'Mrs. Kavitha Menon',
  role: 'Activity Teacher',
  assignedDate: '2024-04-01'
},
{
  id: 'ta7',
  className: 'Class 10',
  section: 'A',
  area: 'Life Skills',
  teacherName: 'Dr. Arun Pillai',
  role: 'Evaluator',
  assignedDate: '2024-04-01'
}];

const mockLockRules: LockRule[] = [
{
  id: 'lr1',
  area: 'Life Skills',
  term: 'Term 1 (2024-25)',
  editableTill: '2024-10-15',
  approvalWorkflow: ['Teacher', 'Coordinator', 'Principal'],
  status: 'Locked',
  lockedBy: 'Admin',
  lockedAt: '2024-10-16'
},
{
  id: 'lr2',
  area: 'Work Education',
  term: 'Term 1 (2024-25)',
  editableTill: '2024-10-15',
  approvalWorkflow: ['Teacher', 'Coordinator'],
  status: 'Locked',
  lockedBy: 'Admin',
  lockedAt: '2024-10-16'
},
{
  id: 'lr3',
  area: 'Life Skills',
  term: 'Term 2 (2024-25)',
  editableTill: '2025-04-15',
  approvalWorkflow: ['Teacher', 'Coordinator', 'Principal'],
  status: 'Open'
},
{
  id: 'lr4',
  area: 'Visual & Performing Arts',
  term: 'Term 2 (2024-25)',
  editableTill: '2025-04-15',
  approvalWorkflow: ['Teacher', 'Coordinator'],
  status: 'Open'
},
{
  id: 'lr5',
  area: 'Attitudes & Values',
  term: 'Term 2 (2024-25)',
  editableTill: '2025-04-15',
  approvalWorkflow: ['Teacher', 'Principal'],
  status: 'Open'
}];

const mockAuditLog: AuditEntry[] = [
{
  id: 'a1',
  action: 'Grade Scale Updated',
  user: 'Admin',
  timestamp: '2024-10-16 09:30',
  details: 'Updated CBSE grade scale — A1 threshold changed to 91%'
},
{
  id: 'a2',
  action: 'Term Locked',
  user: 'Principal',
  timestamp: '2024-10-16 10:15',
  details: 'Term 1 (2024-25) locked for Life Skills — all entries finalized'
},
{
  id: 'a3',
  action: 'Teacher Assigned',
  user: 'Admin',
  timestamp: '2024-04-01 08:00',
  details:
  'Mrs. Priya Sharma assigned as Class Teacher for Class 8-A (Life Skills)'
},
{
  id: 'a4',
  action: 'Lock Rule Created',
  user: 'Admin',
  timestamp: '2024-04-01 08:30',
  details: 'Lock rule created for Term 2 — editable till 2025-04-15'
},
{
  id: 'a5',
  action: 'Weightage Updated',
  user: 'Academic Coordinator',
  timestamp: '2024-04-02 11:00',
  details: 'Term 1 weightage set to 40%, Term 2 to 60%'
}];

const gradeColors: Record<string, string> = {
  A1: 'bg-green-100 text-green-700',
  A2: 'bg-emerald-100 text-emerald-700',
  A: 'bg-green-100 text-green-700',
  'A+': 'bg-green-100 text-green-700',
  B1: 'bg-blue-100 text-blue-700',
  B2: 'bg-sky-100 text-sky-700',
  B: 'bg-blue-100 text-blue-700',
  'B+': 'bg-blue-100 text-blue-700',
  C1: 'bg-yellow-100 text-yellow-700',
  C2: 'bg-amber-100 text-amber-700',
  C: 'bg-yellow-100 text-yellow-700',
  D: 'bg-orange-100 text-orange-700',
  E: 'bg-red-100 text-red-700'
};
export function ActivityAssessmentSetup() {
  const [activeTab, setActiveTab] = useState<TabId>('grade-scale');
  const [selectedBoard, setSelectedBoard] = useState('CBSE');
  const [terms, setTerms] = useState<Term[]>(mockTerms);
  const [teachers, setTeachers] = useState<TeacherAssignment[]>(mockTeachers);
  const [lockRules, setLockRules] = useState<LockRule[]>(mockLockRules);
  const [saving, setSaving] = useState(false);
  const tabs: {
    id: TabId;
    label: string;
    icon: ComponentType<{
      className?: string;
    }>;
  }[] = [
  {
    id: 'grade-scale',
    label: 'Grade Scale Config',
    icon: Award
  },
  {
    id: 'term-setup',
    label: 'Term / Period Setup',
    icon: Calendar
  },
  {
    id: 'teacher-assignment',
    label: 'Teacher Assignment',
    icon: Users
  },
  {
    id: 'lock-rules',
    label: 'Assessment Lock Rules',
    icon: Lock
  }];

  const currentScale = boardScales.find((b) => b.board === selectedBoard)!;
  const toggleContinuous = (id: string) => {
    setTerms((prev) =>
    prev.map((t) =>
    t.id === id ?
    {
      ...t,
      continuousAssessment: !t.continuousAssessment
    } :
    t
    )
    );
  };
  const toggleLock = (id: string) => {
    setLockRules((prev) =>
    prev.map((r) =>
    r.id === id ?
    {
      ...r,
      status: r.status === 'Open' ? 'Locked' : 'Open',
      lockedBy: r.status === 'Open' ? 'Admin' : undefined,
      lockedAt:
      r.status === 'Open' ?
      new Date().toISOString().split('T')[0] :
      undefined
    } :
    r
    )
    );
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-teal-500 to-green-600 rounded-xl text-white shadow-lg">
          <Settings className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Assessment Configuration
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Configure grade scales, terms, teacher assignments, and lock rules
            for co-scholastic assessment
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>

                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>);

            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Grade Scale Config */}
          {activeTab === 'grade-scale' &&
          <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Grade Scale Configuration
                  </h2>
                  <p className="text-sm text-gray-500">
                    Configure board-wise grade-to-grade-point mapping
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                    {boardScales.map((b) =>
                  <button
                    key={b.board}
                    onClick={() => setSelectedBoard(b.board)}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${selectedBoard === b.board ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>

                        {b.board}
                      </button>
                  )}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800">
                    {selectedBoard} — Co-Scholastic Grade Scale
                  </h3>
                </div>
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Grade
                      </th>
                      <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                        Grade Point
                      </th>
                      <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                        Min Marks (%)
                      </th>
                      <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                        Max Marks (%)
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentScale.grades.map((row, idx) =>
                  <tr key={idx} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <span
                        className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold ${gradeColors[row.grade] || 'bg-gray-100 text-gray-700'}`}>

                            {row.grade}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-semibold text-gray-900">
                          {row.gradePoint}
                        </td>
                        <td className="py-3 px-4 text-center text-gray-700">
                          {row.minMarks}%
                        </td>
                        <td className="py-3 px-4 text-center text-gray-700">
                          {row.maxMarks}%
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {row.description}
                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl flex items-start gap-3">
                <Info className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-teal-800">
                  Grade scales are board-specific. Changes apply to all
                  co-scholastic areas using this board's grading system. Contact
                  the Academic Coordinator before modifying grade boundaries.
                </p>
              </div>
            </div>
          }

          {/* Term Setup */}
          {activeTab === 'term-setup' &&
          <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Term / Period Setup
                  </h2>
                  <p className="text-sm text-gray-500">
                    Configure assessment terms, weightages, and continuous
                    assessment settings
                  </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700">
                  <Plus className="w-4 h-4" /> Add Term
                </button>
              </div>

              <div className="space-y-4">
                {terms.map((term) =>
              <div
                key={term.id}
                className="bg-white border border-gray-200 rounded-xl p-5">

                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${term.status === 'Active' ? 'bg-green-100 text-green-700' : term.status === 'Closed' ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-700'}`}>

                          {term.status}
                        </div>
                        <h3 className="font-semibold text-gray-900">
                          {term.name}
                        </h3>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {term.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Start Date</p>
                        <p className="text-sm font-medium text-gray-900">
                          {term.startDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">End Date</p>
                        <p className="text-sm font-medium text-gray-900">
                          {term.endDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Weightage</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                          className="bg-teal-500 h-2 rounded-full"
                          style={{
                            width: `${term.weightage}%`
                          }} />

                          </div>
                          <span className="text-sm font-bold text-teal-700">
                            {term.weightage}%
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Continuous Assessment
                        </p>
                        <button
                      onClick={() => toggleContinuous(term.id)}
                      className="flex items-center gap-2">

                          {term.continuousAssessment ?
                      <ToggleRight className="w-6 h-6 text-teal-500" /> :

                      <ToggleLeft className="w-6 h-6 text-gray-400" />
                      }
                          <span
                        className={`text-sm font-medium ${term.continuousAssessment ? 'text-teal-700' : 'text-gray-500'}`}>

                            {term.continuousAssessment ? 'Enabled' : 'Disabled'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
              )}
              </div>
            </div>
          }

          {/* Teacher Assignment */}
          {activeTab === 'teacher-assignment' &&
          <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Teacher Assignment Mapping
                  </h2>
                  <p className="text-sm text-gray-500">
                    Assign class teachers and activity teachers per
                    co-scholastic area
                  </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700">
                  <Plus className="w-4 h-4" /> Assign Teacher
                </button>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Class & Section
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Co-Scholastic Area
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Teacher Name
                      </th>
                      <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                        Role
                      </th>
                      <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                        Assigned Date
                      </th>
                      <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {teachers.map((t) =>
                  <tr key={t.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <span className="font-medium text-gray-900">
                            {t.className}
                          </span>
                          <span className="text-gray-500 ml-1">
                            — Section {t.section}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-700">{t.area}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center">
                              <User className="w-4 h-4 text-teal-600" />
                            </div>
                            <span className="font-medium text-gray-900">
                              {t.teacherName}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${t.role === 'Class Teacher' ? 'bg-indigo-100 text-indigo-700' : t.role === 'Activity Teacher' ? 'bg-teal-100 text-teal-700' : 'bg-purple-100 text-purple-700'}`}>

                            {t.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-gray-600">
                          {t.assignedDate}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button className="p-1.5 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-blue-600">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </div>
          }

          {/* Lock Rules */}
          {activeTab === 'lock-rules' &&
          <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Assessment Lock Rules
                  </h2>
                  <p className="text-sm text-gray-500">
                    Control editable periods, approval workflows, and lock
                    status per area and term
                  </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700">
                  <Plus className="w-4 h-4" /> Add Lock Rule
                </button>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Area
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Term
                      </th>
                      <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                        Editable Till
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Approval Workflow
                      </th>
                      <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                        Status
                      </th>
                      <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {lockRules.map((rule) =>
                  <tr key={rule.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">
                          {rule.area}
                        </td>
                        <td className="py-3 px-4 text-gray-700">{rule.term}</td>
                        <td className="py-3 px-4 text-center text-sm text-gray-700">
                          {rule.editableTill}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            {rule.approvalWorkflow.map((step, idx) =>
                        <Fragment key={step}>
                                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                                  {step}
                                </span>
                                {idx < rule.approvalWorkflow.length - 1 &&
                          <span className="text-gray-400 text-xs">
                                    →
                                  </span>
                          }
                              </Fragment>
                        )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${rule.status === 'Locked' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>

                            {rule.status === 'Locked' ?
                        <Lock className="w-3 h-3" /> :

                        <Unlock className="w-3 h-3" />
                        }
                            {rule.status}
                          </span>
                          {rule.lockedBy &&
                      <p className="text-xs text-gray-400 mt-0.5">
                              by {rule.lockedBy}
                            </p>
                      }
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                        onClick={() => toggleLock(rule.id)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium mx-auto transition-colors ${rule.status === 'Open' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>

                            {rule.status === 'Open' ?
                        <>
                                <Lock className="w-3 h-3" /> Lock
                              </> :

                        <>
                                <Unlock className="w-3 h-3" /> Unlock
                              </>
                        }
                          </button>
                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>

              {/* Audit Log */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-teal-600" /> Audit Log
                </h3>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                          Action
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                          User
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                          Timestamp
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                          Details
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {mockAuditLog.map((entry) =>
                    <tr key={entry.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <span className="text-xs font-semibold px-2 py-1 bg-teal-50 text-teal-700 rounded">
                              {entry.action}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">
                            {entry.user}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-500">
                            {entry.timestamp}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {entry.details}
                          </td>
                        </tr>
                    )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>);

}