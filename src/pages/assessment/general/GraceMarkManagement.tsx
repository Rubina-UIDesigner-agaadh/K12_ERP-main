import React, { useState, useMemo } from 'react';
import { Search, Save, Download, CheckCircle, XCircle, GraduationCap, Users } from 'lucide-react';

// Types
interface Student {
  id: string;
  rollNo: string;
  name: string;
  standard: string;
  division: string;
  totalMarks: number;
  obtainedMarks: number;
  graceMarks: number;
  achievementMarks: number;
}

// Utility Components
const Card: React.FC<{children: React.ReactNode;className?: string;}> = ({ children, className = '' }) =>
<div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>{children}</div>;


const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}> = ({ children, variant = 'primary', onClick, disabled, className = '' }) => {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50',
    ghost: 'text-gray-600 hover:bg-gray-100'
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-all disabled:opacity-50 ${variants[variant]} ${className}`}>

      {children}
    </button>);

};

const Badge: React.FC<{children: React.ReactNode;variant: 'success' | 'danger' | 'warning' | 'default';}> = ({
  children,
  variant
}) => {
  const variants = {
    success: 'bg-green-100 text-green-700',
    danger: 'bg-red-100 text-red-700',
    warning: 'bg-amber-100 text-amber-700',
    default: 'bg-gray-100 text-gray-700'
  };
  return <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${variants[variant]}`}>{children}</span>;
};

// Helper Functions
const calculateGrade = (percentage: number): string => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 35) return 'D';
  return 'F';
};

const getGradeColor = (grade: string): 'success' | 'warning' | 'danger' | 'default' => {
  if (['A+', 'A', 'B+'].includes(grade)) return 'success';
  if (['B', 'C'].includes(grade)) return 'warning';
  if (['D', 'F'].includes(grade)) return 'danger';
  return 'default';
};

// Main Component
export default function GraceMarkManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState({ standard: '10', division: 'A' });
  const [students, setStudents] = useState<Student[]>([
  { id: '1', rollNo: '001', name: 'Aadhya Sharma', standard: '10', division: 'A', totalMarks: 500, obtainedMarks: 432, graceMarks: 0, achievementMarks: 0 },
  { id: '2', rollNo: '002', name: 'Vivaan Patel', standard: '10', division: 'A', totalMarks: 500, obtainedMarks: 168, graceMarks: 0, achievementMarks: 0 },
  { id: '3', rollNo: '003', name: 'Ananya Reddy', standard: '10', division: 'A', totalMarks: 500, obtainedMarks: 162, graceMarks: 0, achievementMarks: 0 },
  { id: '4', rollNo: '004', name: 'Arjun Kumar', standard: '10', division: 'A', totalMarks: 500, obtainedMarks: 245, graceMarks: 0, achievementMarks: 0 },
  { id: '5', rollNo: '005', name: 'Priya Verma', standard: '10', division: 'A', totalMarks: 500, obtainedMarks: 310, graceMarks: 0, achievementMarks: 0 },
  { id: '6', rollNo: '006', name: 'Rohit Gupta', standard: '10', division: 'A', totalMarks: 500, obtainedMarks: 172, graceMarks: 0, achievementMarks: 0 },
  { id: '7', rollNo: '007', name: 'Sneha Iyer', standard: '10', division: 'B', totalMarks: 500, obtainedMarks: 385, graceMarks: 0, achievementMarks: 0 },
  { id: '8', rollNo: '008', name: 'Karan Singh', standard: '10', division: 'B', totalMarks: 500, obtainedMarks: 290, graceMarks: 0, achievementMarks: 0 }]
  );

  const standards = ['8', '9', '10', '11', '12'];
  const divisions = ['A', 'B', 'C', 'D'];

  const filteredStudents = useMemo(() => {
    return students.filter(
      (s) =>
      s.standard === selectedClass.standard &&
      s.division === selectedClass.division && (
      searchQuery === '' || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.rollNo.includes(searchQuery))
    );
  }, [students, selectedClass, searchQuery]);

  const updateStudent = (id: string, field: 'graceMarks' | 'achievementMarks', value: number) => {
    setStudents((prev) => prev.map((s) => s.id === id ? { ...s, [field]: Math.max(0, Math.min(value, 20)) } : s));
  };

  const getFinalScore = (s: Student) => s.obtainedMarks + s.graceMarks + s.achievementMarks;
  const getPercentage = (s: Student) => (getFinalScore(s) / s.totalMarks * 100).toFixed(1);
  const isPassing = (s: Student) => parseFloat(getPercentage(s)) >= 35;

  const stats = useMemo(() => {
    const total = filteredStudents.length;
    const passed = filteredStudents.filter(isPassing).length;
    const withGrace = filteredStudents.filter((s) => s.graceMarks > 0 || s.achievementMarks > 0).length;
    return { total, passed, failed: total - passed, withGrace };
  }, [filteredStudents]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-xl">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Grace & Achievement Marks</h1>
              <p className="text-sm text-gray-500">Final Examination Only</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline"><Download className="w-4 h-4 mr-2" />Export</Button>
            <Button><Save className="w-4 h-4 mr-2" />Save All</Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Standard</label>
              <select
                value={selectedClass.standard}
                onChange={(e) => setSelectedClass((p) => ({ ...p, standard: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">

                {standards.map((s) => <option key={s} value={s}>Standard {s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Division</label>
              <select
                value={selectedClass.division}
                onChange={(e) => setSelectedClass((p) => ({ ...p, division: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">

                {divisions.map((d) => <option key={d} value={d}>Division {d}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or roll no..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />

              </div>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
          { label: 'Total Students', value: stats.total, color: 'bg-blue-100 text-blue-600' },
          { label: 'Passed', value: stats.passed, color: 'bg-green-100 text-green-600' },
          { label: 'Failed', value: stats.failed, color: 'bg-red-100 text-red-600' },
          { label: 'With Grace/Achievement', value: stats.withGrace, color: 'bg-purple-100 text-purple-600' }].
          map((stat) =>
          <Card key={stat.label} className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.color}`}><Users className="w-5 h-5" /></div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </Card>
          )}
        </div>

        {/* Student Table */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="font-semibold text-gray-900">
              Standard {selectedClass.standard}-{selectedClass.division} Students ({filteredStudents.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['Roll No', 'Student Name', 'Obtained', 'Grace Marks', 'Achievement Marks', 'Final Score', 'Percentage', 'Grade', 'Status'].map((h) =>
                  <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.map((student) => {
                  const finalScore = getFinalScore(student);
                  const percentage = getPercentage(student);
                  const grade = calculateGrade(parseFloat(percentage));
                  const passed = isPassing(student);

                  return (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-sm font-medium">{student.rollNo}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                            {student.name.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900">{student.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span className="font-semibold">{student.obtainedMarks}</span>
                        <span className="text-gray-400">/{student.totalMarks}</span>
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={student.graceMarks}
                          onChange={(e) => updateStudent(student.id, 'graceMarks', parseInt(e.target.value) || 0)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-center focus:ring-2 focus:ring-blue-500" />

                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={student.achievementMarks}
                          onChange={(e) => updateStudent(student.id, 'achievementMarks', parseInt(e.target.value) || 0)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-center focus:ring-2 focus:ring-blue-500" />

                      </td>
                      <td className="py-3 px-4">
                        <span className="text-lg font-bold text-blue-600">{finalScore}</span>
                      </td>
                      <td className="py-3 px-4 font-semibold">{percentage}%</td>
                      <td className="py-3 px-4"><Badge variant={getGradeColor(grade)}>{grade}</Badge></td>
                      <td className="py-3 px-4">
                        <Badge variant={passed ? 'success' : 'danger'}>
                          {passed ? <><CheckCircle className="w-3 h-3 mr-1" />Pass</> : <><XCircle className="w-3 h-3 mr-1" />Fail</>}
                        </Badge>
                      </td>
                    </tr>);

                })}
              </tbody>
            </table>
            {filteredStudents.length === 0 &&
            <div className="p-12 text-center text-gray-500">No students found</div>
            }
          </div>
        </Card>
      </div>
    </div>);

}