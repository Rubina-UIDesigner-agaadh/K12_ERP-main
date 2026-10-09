import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { MultiSelect } from '../../../components/ui/MultiSelect';
import {
  Save,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  User,
  Search,
  Filter,
  Users,
  CheckCircle,
  Clock } from
'lucide-react';
interface SkillEntry {
  id: string;
  name: string;
  grade: string;
  comment: string;
}
interface DomainEntry {
  name: string;
  skills: SkillEntry[];
  expanded: boolean;
}
interface StudentRecord {
  id: string;
  name: string;
  rollNo: string;
  gender: 'M' | 'F';
  initials: string;
  domains: DomainEntry[];
  overallRemark: string;
  status: 'Pending' | 'Draft' | 'Submitted';
}
const GRADE_OPTIONS = ['Achieved', 'Developing', 'Beginning', 'Not Observed'];
const GRADE_COLORS: Record<string, string> = {
  Achieved: 'bg-green-100 text-green-800',
  Developing: 'bg-blue-100 text-blue-800',
  Beginning: 'bg-yellow-100 text-yellow-800',
  'Not Observed': 'bg-gray-100 text-gray-600'
};
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

const createDomains = (): DomainEntry[] => [
{
  name: 'Cognitive Skills',
  expanded: true,
  skills: [
  {
    id: '1',
    name: 'Recognizes colors',
    grade: '',
    comment: ''
  },
  {
    id: '2',
    name: 'Identifies shapes',
    grade: '',
    comment: ''
  },
  {
    id: '3',
    name: 'Counts 1-10',
    grade: '',
    comment: ''
  },
  {
    id: '4',
    name: 'Sorts objects by size',
    grade: '',
    comment: ''
  }]

},
{
  name: 'Language & Communication',
  expanded: false,
  skills: [
  {
    id: '5',
    name: 'Speaks simple sentences',
    grade: '',
    comment: ''
  },
  {
    id: '6',
    name: 'Follows instructions',
    grade: '',
    comment: ''
  },
  {
    id: '7',
    name: 'Identifies letters',
    grade: '',
    comment: ''
  }]

},
{
  name: 'Motor Skills',
  expanded: false,
  skills: [
  {
    id: '8',
    name: 'Holds pencil correctly',
    grade: '',
    comment: ''
  },
  {
    id: '9',
    name: 'Runs and jumps',
    grade: '',
    comment: ''
  },
  {
    id: '10',
    name: 'Uses scissors',
    grade: '',
    comment: ''
  }]

},
{
  name: 'Social & Emotional Development',
  expanded: false,
  skills: [
  {
    id: '11',
    name: 'Shares toys with peers',
    grade: '',
    comment: ''
  },
  {
    id: '12',
    name: 'Expresses emotions appropriately',
    grade: '',
    comment: ''
  },
  {
    id: '13',
    name: 'Follows classroom rules',
    grade: '',
    comment: ''
  }]

},
{
  name: 'Creativity & Expression',
  expanded: false,
  skills: [
  {
    id: '14',
    name: 'Participates in art activities',
    grade: '',
    comment: ''
  },
  {
    id: '15',
    name: 'Sings rhymes',
    grade: '',
    comment: ''
  }]

}];

const mockStudents: StudentRecord[] = [
{
  id: '1',
  name: 'Aarav Kumar',
  rollNo: '01',
  gender: 'M',
  initials: 'AK',
  domains: createDomains(),
  overallRemark: '',
  status: 'Pending'
},
{
  id: '2',
  name: 'Diya Sharma',
  rollNo: '02',
  gender: 'F',
  initials: 'DS',
  domains: createDomains(),
  overallRemark: '',
  status: 'Pending'
},
{
  id: '3',
  name: 'Rohan Patel',
  rollNo: '03',
  gender: 'M',
  initials: 'RP',
  domains: createDomains(),
  overallRemark: '',
  status: 'Draft'
},
{
  id: '4',
  name: 'Ananya Reddy',
  rollNo: '04',
  gender: 'F',
  initials: 'AR',
  domains: createDomains(),
  overallRemark: 'Excellent progress this term',
  status: 'Submitted'
},
{
  id: '5',
  name: 'Kabir Singh',
  rollNo: '05',
  gender: 'M',
  initials: 'KS',
  domains: createDomains(),
  overallRemark: '',
  status: 'Pending'
},
{
  id: '6',
  name: 'Meera Nair',
  rollNo: '06',
  gender: 'F',
  initials: 'MN',
  domains: createDomains(),
  overallRemark: '',
  status: 'Pending'
}];

export function PreschoolObservationEntry() {
  const [students, setStudents] = useState<StudentRecord[]>(mockStudents);
  const [selectedStudentId, setSelectedStudentId] = useState('1');
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState('Nursery');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedTerm, setSelectedTerm] = useState('Term 1');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('2024-25');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [assessmentDate, setAssessmentDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const selectedStudent = students.find((s) => s.id === selectedStudentId)!;
  const selectedIdx = students.findIndex((s) => s.id === selectedStudentId);
  const filteredStudents = students.filter((s) => {
    if (
    searchQuery &&
    !s.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !s.rollNo.includes(searchQuery))

    return false;
    if (filterGender && s.gender !== filterGender) return false;
    if (filterStatus && s.status !== filterStatus) return false;
    return true;
  });
  const toggleDomain = (domainIndex: number) => {
    setStudents((prev) =>
    prev.map((s) => {
      if (s.id !== selectedStudentId) return s;
      return {
        ...s,
        domains: s.domains.map((d, i) =>
        i === domainIndex ?
        {
          ...d,
          expanded: !d.expanded
        } :
        d
        )
      };
    })
    );
  };
  const updateSkillGrade = (
  domainIndex: number,
  skillIndex: number,
  grade: string) =>
  {
    setStudents((prev) =>
    prev.map((s) => {
      if (s.id !== selectedStudentId) return s;
      const newDomains = s.domains.map((d, di) =>
      di !== domainIndex ?
      d :
      {
        ...d,
        skills: d.skills.map((sk, si) =>
        si !== skillIndex ?
        sk :
        {
          ...sk,
          grade
        }
        )
      }
      );
      return {
        ...s,
        domains: newDomains,
        status: 'Draft' as const
      };
    })
    );
  };
  const updateSkillComment = (
  domainIndex: number,
  skillIndex: number,
  comment: string) =>
  {
    setStudents((prev) =>
    prev.map((s) => {
      if (s.id !== selectedStudentId) return s;
      const newDomains = s.domains.map((d, di) =>
      di !== domainIndex ?
      d :
      {
        ...d,
        skills: d.skills.map((sk, si) =>
        si !== skillIndex ?
        sk :
        {
          ...sk,
          comment
        }
        )
      }
      );
      return {
        ...s,
        domains: newDomains
      };
    })
    );
  };
  const updateOverallRemark = (remark: string) => {
    setStudents((prev) =>
    prev.map((s) =>
    s.id === selectedStudentId ?
    {
      ...s,
      overallRemark: remark
    } :
    s
    )
    );
  };
  const handleSave = (submit = false) => {
    setStudents((prev) =>
    prev.map((s) =>
    s.id === selectedStudentId ?
    {
      ...s,
      status: submit ? 'Submitted' : 'Draft'
    } :
    s
    )
    );
  };
  const goToStudent = (direction: 'prev' | 'next') => {
    const newIdx = direction === 'prev' ? selectedIdx - 1 : selectedIdx + 1;
    if (newIdx >= 0 && newIdx < students.length)
    setSelectedStudentId(students[newIdx].id);
  };
  const statusColors: Record<string, string> = {
    Pending: 'bg-orange-100 text-orange-700',
    Draft: 'bg-blue-100 text-blue-700',
    Submitted: 'bg-green-100 text-green-700'
  };
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Term Assessment Entry
          </h1>
          <p className="text-sm text-gray-500">
            Term-wise structured skill evaluation — no numeric calculation
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleSave(false)}>
            Save Draft
          </Button>
          <Button variant="primary" onClick={() => handleSave(true)}>
            <Save className="w-4 h-4 mr-2" />
            Save & Submit
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <MultiSelect
            label="Branch"
            options={BRANCH_OPTIONS}
            value={selectedBranches}
            onChange={setSelectedBranches}
            placeholder="All" />

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Academic Year
            </label>
            <select
              value={selectedAcademicYear}
              onChange={(e) => setSelectedAcademicYear(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

              <option>2024-25</option>
              <option>2023-24</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Level / Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

              <option>Nursery</option>
              <option>Jr KG</option>
              <option>Sr KG</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Section
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

              <option>A</option>
              <option>B</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Term
            </label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

              <option>Term 1</option>
              <option>Term 2</option>
              <option>Term 3</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Assessment Date
            </label>
            <input
              type="date"
              value={assessmentDate}
              onChange={(e) => setAssessmentDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Student List Panel */}
        <div className="lg:col-span-1">
          <Card className="overflow-hidden">
            <div className="p-3 border-b border-gray-100 space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search student..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>
              <div className="flex gap-2">
                <select
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value)}
                  className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none">

                  <option value="">All</option>
                  <option value="M">Boys</option>
                  <option value="F">Girls</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none">

                  <option value="">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Draft">Draft</option>
                  <option value="Submitted">Submitted</option>
                </select>
              </div>
            </div>
            <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
              {filteredStudents.map((student) =>
              <button
                key={student.id}
                onClick={() => setSelectedStudentId(student.id)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${selectedStudentId === student.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-gray-50'}`}>

                  <div className="flex items-center gap-3">
                    <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${selectedStudentId === student.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>

                      {student.initials}
                    </div>
                    <div>
                      <p
                      className={`text-sm font-medium ${selectedStudentId === student.id ? 'text-blue-700' : 'text-gray-900'}`}>

                        {student.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        Roll: {student.rollNo} ·{' '}
                        {student.gender === 'M' ? 'Boy' : 'Girl'}
                      </p>
                    </div>
                  </div>
                  <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[student.status]}`}>

                    {student.status}
                  </span>
                </button>
              )}
            </div>
          </Card>
        </div>

        {/* Assessment Entry Panel */}
        <div className="lg:col-span-3 space-y-4">
          {/* Student Profile */}
          <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-bold">
                {selectedStudent.initials}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedStudent.name}
                </h2>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                  <span>
                    <span className="font-medium">Class:</span> {selectedClass}-
                    {selectedSection}
                  </span>
                  <span>
                    <span className="font-medium">Roll No:</span>{' '}
                    {selectedStudent.rollNo}
                  </span>
                  <span>
                    <span className="font-medium">Term:</span> {selectedTerm}
                  </span>
                </div>
              </div>
              <span
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${statusColors[selectedStudent.status]}`}>

                {selectedStudent.status}
              </span>
            </div>
          </Card>

          {/* Domain Skill Entries */}
          {selectedStudent.domains.map((domain, domainIndex) =>
          <Card key={domain.name} className="overflow-hidden">
              <div
              onClick={() => toggleDomain(domainIndex)}
              className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900">{domain.name}</h3>
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                    {domain.skills.length} skills
                  </span>
                  {domain.skills.some((s) => s.grade) &&
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      {domain.skills.filter((s) => s.grade).length}/
                      {domain.skills.length} filled
                    </span>
                }
                </div>
                {domain.expanded ?
              <ChevronUp className="w-5 h-5 text-gray-400" /> :

              <ChevronDown className="w-5 h-5 text-gray-400" />
              }
              </div>

              {domain.expanded &&
            <div className="p-4 space-y-3">
                  {domain.skills.map((skill, skillIndex) =>
              <div
                key={skill.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 bg-gray-50 rounded-lg">

                      <div className="md:col-span-4 flex items-center">
                        <p className="font-medium text-gray-900 text-sm">
                          {skill.name}
                        </p>
                      </div>
                      <div className="md:col-span-3">
                        <select
                    value={skill.grade}
                    onChange={(e) =>
                    updateSkillGrade(
                      domainIndex,
                      skillIndex,
                      e.target.value
                    )
                    }
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${skill.grade ? GRADE_COLORS[skill.grade] + ' border-transparent' : 'border-gray-300 bg-white'}`}>

                          <option value="">Select Grade</option>
                          {GRADE_OPTIONS.map((g) =>
                    <option key={g} value={g}>
                              {g}
                            </option>
                    )}
                        </select>
                      </div>
                      <div className="md:col-span-5">
                        <textarea
                    value={skill.comment}
                    onChange={(e) =>
                    updateSkillComment(
                      domainIndex,
                      skillIndex,
                      e.target.value
                    )
                    }
                    placeholder="Optional comment..."
                    rows={1}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />

                      </div>
                    </div>
              )}
                </div>
            }
            </Card>
          )}

          {/* Overall Remark */}
          <Card className="p-5">
            <h3 className="font-bold text-gray-900 mb-3">
              Teacher General Remark & Overall Development Comment
            </h3>
            <textarea
              value={selectedStudent.overallRemark}
              onChange={(e) => updateOverallRemark(e.target.value)}
              placeholder="Enter your overall observations about the student's development and progress this term..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />

          </Card>

          {/* Navigation */}
          <Card className="p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Student {selectedIdx + 1} of {students.length}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={selectedIdx === 0}
                  onClick={() => goToStudent('prev')}>

                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={selectedIdx === students.length - 1}
                  onClick={() => goToStudent('next')}>

                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Grade Scale Legend */}
      <Card className="p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
          Evaluation Scale
        </p>
        <div className="flex flex-wrap gap-3">
          {GRADE_OPTIONS.map((g) =>
          <div
            key={g}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${GRADE_COLORS[g]}`}>

              {g}
            </div>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          No numeric calculation, no pass/fail, no rank — purely skill-based
          evaluation.
        </p>
      </Card>
    </div>);

}