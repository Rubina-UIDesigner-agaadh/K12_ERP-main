import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import {
  FileText,
  Printer,
  Download,
  Search,
  GraduationCap,
  Award,
  Activity,
  Calendar,
  BookOpen,
  Shield,
  Star,
  Eye,
  X,
  Upload,
  ArrowLeft,
  User } from
'lucide-react';

// Types
interface Student {
  id: string;
  name: string;
  class: string;
  section: string;
  rollNo: string;
  admissionNo: string;
  dob: string;
  parentName: string;
  photo?: string;
}

interface ScholasticData {
  subject: string;
  code: string;
  theory: number;
  ia: number;
  total: number;
  grade: string;
  gp: number;
}

export function CBSEReportCard() {
  // Filter States
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showStudentList, setShowStudentList] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [viewingReportCard, setViewingReportCard] = useState(false);

  // Sample Data
  const classes = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  const sections = ['A', 'B', 'C', 'D'];
  const exams = ['Unit Test 1', 'Unit Test 2', 'Half Yearly', 'Annual'];
  const terms = ['Term I', 'Term II', 'Annual'];

  // Sample Students Data
  const students: Student[] = [
  { id: 'S001', name: 'Aditya Vardhan', class: 'X', section: 'A', rollNo: '12', admissionNo: 'DPS/2020/1245', dob: '15 August 2009', parentName: 'Mr. Rajesh Vardhan' },
  { id: 'S002', name: 'Priya Sharma', class: 'X', section: 'A', rollNo: '15', admissionNo: 'DPS/2020/1248', dob: '22 March 2009', parentName: 'Mr. Vikash Sharma' },
  { id: 'S003', name: 'Rahul Kumar', class: 'X', section: 'B', rollNo: '08', admissionNo: 'DPS/2020/1252', dob: '10 January 2009', parentName: 'Mr. Suresh Kumar' },
  { id: 'S004', name: 'Ananya Gupta', class: 'IX', section: 'A', rollNo: '03', admissionNo: 'DPS/2021/1301', dob: '05 July 2010', parentName: 'Mr. Amit Gupta' },
  { id: 'S005', name: 'Vikram Singh', class: 'X', section: 'A', rollNo: '22', admissionNo: 'DPS/2020/1260', dob: '18 November 2009', parentName: 'Mr. Ranjit Singh' },
  { id: 'S006', name: 'Sneha Patel', class: 'IX', section: 'B', rollNo: '11', admissionNo: 'DPS/2021/1310', dob: '28 September 2010', parentName: 'Mr. Dinesh Patel' },
  { id: 'S007', name: 'Arjun Reddy', class: 'X', section: 'B', rollNo: '05', admissionNo: 'DPS/2020/1255', dob: '12 December 2009', parentName: 'Mr. Krishna Reddy' },
  { id: 'S008', name: 'Kavya Nair', class: 'X', section: 'A', rollNo: '18', admissionNo: 'DPS/2020/1262', dob: '30 April 2009', parentName: 'Mr. Sunil Nair' }];


  // School Details
  const schoolInfo = {
    name: 'Delhi Public School',
    address: 'Sector 19, Dwarka, New Delhi - 110075',
    affiliation: 'CBSE Affiliation No: 2730XXX',
    phone: '011-2804XXXX',
    email: 'info@dpsdwarka.edu.in',
    logo: null
  };

  // Scholastic Areas (Subjects)
  const scholasticData: ScholasticData[] = [
  { subject: 'English', code: '184', theory: 72, ia: 18, total: 90, grade: 'A1', gp: 10 },
  { subject: 'Hindi', code: '002', theory: 65, ia: 16, total: 81, grade: 'A2', gp: 9 },
  { subject: 'Mathematics', code: '041', theory: 78, ia: 19, total: 97, grade: 'A1', gp: 10 },
  { subject: 'Science', code: '086', theory: 70, ia: 17, total: 87, grade: 'A1', gp: 10 },
  { subject: 'Social Science', code: '087', theory: 68, ia: 18, total: 86, grade: 'A1', gp: 10 },
  { subject: 'Information Technology', code: '402', theory: 35, ia: 9, total: 44, grade: 'A2', gp: 9 }];


  // Internal Assessment Breakdown
  const iaBreakdown = [
  { subject: 'English', periodic: 8, notebook: 5, enrichment: 5, total: 18 },
  { subject: 'Hindi', periodic: 7, notebook: 4, enrichment: 5, total: 16 },
  { subject: 'Mathematics', periodic: 9, notebook: 5, enrichment: 5, total: 19 },
  { subject: 'Science', periodic: 8, notebook: 4, enrichment: 5, total: 17 },
  { subject: 'Social Science', periodic: 9, notebook: 5, enrichment: 4, total: 18 },
  { subject: 'Information Technology', periodic: 4, notebook: 2, enrichment: 3, total: 9 }];


  // Co-Scholastic Areas
  const coScholasticData = [
  { area: 'Work Education', grade: 'A' },
  { area: 'Art Education', grade: 'A' },
  { area: 'Health & Physical Education', grade: 'B' }];


  // Discipline
  const discipline = { grade: 'A', remarks: 'Excellent conduct and behavior' };

  // Grade Legend
  const gradeLegend = [
  { grade: 'A1', marks: '91-100', gp: 10 },
  { grade: 'A2', marks: '81-90', gp: 9 },
  { grade: 'B1', marks: '71-80', gp: 8 },
  { grade: 'B2', marks: '61-70', gp: 7 },
  { grade: 'C1', marks: '51-60', gp: 6 },
  { grade: 'C2', marks: '41-50', gp: 5 },
  { grade: 'D', marks: '33-40', gp: 4 },
  { grade: 'E', marks: '0-32', gp: 0 }];


  // Co-Scholastic Grade Legend
  const coScholasticGrades = [
  { grade: 'A', desc: 'Outstanding' },
  { grade: 'B', desc: 'Very Good' },
  { grade: 'C', desc: 'Fair' }];


  // Calculate totals
  const totalMarks = scholasticData.reduce((acc, s) => acc + s.total, 0);
  const maxMarks = scholasticData.length * 100;
  const percentage = (totalMarks / maxMarks * 100).toFixed(2);
  const totalGP = scholasticData.reduce((acc, s) => acc + s.gp, 0);
  const cgpa = (totalGP / scholasticData.length).toFixed(1);

  // Filter students based on search and filters
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesClass = !selectedClass || student.class === selectedClass;
      const matchesSearch = !searchQuery ||
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNo.includes(searchQuery) ||
      student.admissionNo.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesClass && matchesSearch;
    });
  }, [selectedClass, searchQuery]);

  // Handle View Report Card
  const handleViewReportCard = (student: Student) => {
    setSelectedStudent(student);
    setViewingReportCard(true);
    setShowStudentList(false);
  };

  // Handle Back to Search
  const handleBackToSearch = () => {
    setViewingReportCard(false);
    setSelectedStudent(null);
  };

  // Handle Search
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setShowStudentList(value.length > 0 || selectedClass !== '');
  };

  // Handle filter apply
  const handleApplyFilters = () => {
    setShowStudentList(true);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSelectedClass('');
    setSelectedExam('');
    setSelectedTerm('');
    setSearchQuery('');
    setShowStudentList(false);
  };

  // If viewing report card, show the report card view
  if (viewingReportCard && selectedStudent) {
    return (
      <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
        {/* Header Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 print:hidden">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleBackToSearch} className="bg-white">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Search
            </Button>
            <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-100">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CBSE Report Card</h1>
              <p className="text-gray-500 mt-1 text-sm">{selectedStudent.name} • {selectedStudent.class}-{selectedStudent.section}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" className="bg-white">
              <Printer className="w-4 h-4 mr-2" /> Print
            </Button>
            <Button variant="outline" size="sm" className="bg-white">
              <Upload className="w-4 h-4 mr-2" /> Export
            </Button>
            <Button variant="primary" size="sm" className="bg-blue-600 shadow-md">
              <Download className="w-4 h-4 mr-2" /> Download PDF
            </Button>
          </div>
        </div>

        {/* Report Card Document */}
        <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden print:shadow-none print:rounded-none">
          
          {/* Official Header with Border */}
          <div className="border-8 border-double border-blue-800 m-4 print:m-0">
            
            {/* School Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b-2 border-blue-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-blue-800 flex items-center justify-center text-white">
                    <GraduationCap className="w-10 h-10" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-black text-blue-900 uppercase tracking-wide">{schoolInfo.name}</h1>
                    <p className="text-sm text-gray-600 mt-1">{schoolInfo.address}</p>
                    <p className="text-xs text-blue-700 font-semibold mt-1">{schoolInfo.affiliation}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-16 h-16 bg-orange-600 rounded-lg flex items-center justify-center text-white font-black text-xs">
                    CBSE
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <h2 className="text-xl font-bold text-blue-900 uppercase tracking-widest border-y-2 border-blue-300 py-2">
                  Report Card - {selectedTerm || 'Term II'} ({selectedExam || 'Annual'}) - 2023-24
                </h2>
              </div>
            </div>

            {/* Student Information */}
            <div className="p-6 bg-white">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Student's Name</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">{selectedStudent.name}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Class & Section</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">{selectedStudent.class}-{selectedStudent.section}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Roll Number</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">{selectedStudent.rollNo}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Admission No.</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">{selectedStudent.admissionNo}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Date of Birth</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">{selectedStudent.dob}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg md:col-span-2">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Father's/Guardian's Name</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">{selectedStudent.parentName}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Academic Session</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">2023-24</p>
                </div>
              </div>
            </div>

            {/* Part I: Scholastic Areas */}
            <div className="p-6 border-t-2 border-blue-800">
              <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Part I: Scholastic Areas
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-blue-800 text-white">
                      <th className="border border-blue-700 px-3 py-2 text-left text-[10px] uppercase">Subject</th>
                      <th className="border border-blue-700 px-3 py-2 text-center text-[10px] uppercase">Code</th>
                      <th className="border border-blue-700 px-3 py-2 text-center text-[10px] uppercase">Theory<br />(80)</th>
                      <th className="border border-blue-700 px-3 py-2 text-center text-[10px] uppercase">Internal<br />Assessment (20)</th>
                      <th className="border border-blue-700 px-3 py-2 text-center text-[10px] uppercase">Total<br />(100)</th>
                      <th className="border border-blue-700 px-3 py-2 text-center text-[10px] uppercase">Grade</th>
                      <th className="border border-blue-700 px-3 py-2 text-center text-[10px] uppercase">Grade<br />Point</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scholasticData.map((subject, idx) =>
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'}>
                        <td className="border border-gray-300 px-3 py-2 font-semibold text-gray-800">{subject.subject}</td>
                        <td className="border border-gray-300 px-3 py-2 text-center text-gray-600">{subject.code}</td>
                        <td className="border border-gray-300 px-3 py-2 text-center font-bold">{subject.theory}</td>
                        <td className="border border-gray-300 px-3 py-2 text-center font-bold">{subject.ia}</td>
                        <td className="border border-gray-300 px-3 py-2 text-center font-black text-blue-700">{subject.total}</td>
                        <td className="border border-gray-300 px-3 py-2 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 text-green-700 font-black text-xs">
                            {subject.grade}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-center font-bold">{subject.gp}</td>
                      </tr>
                    )}
                    <tr className="bg-blue-100 font-bold">
                      <td colSpan={4} className="border border-gray-300 px-3 py-2 text-right uppercase text-xs">Overall Total / Percentage / CGPA</td>
                      <td className="border border-gray-300 px-3 py-2 text-center font-black text-blue-800">{totalMarks}/{maxMarks}</td>
                      <td className="border border-gray-300 px-3 py-2 text-center font-black text-blue-800">{percentage}%</td>
                      <td className="border border-gray-300 px-3 py-2 text-center font-black text-blue-800">{cgpa}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Internal Assessment Breakdown */}
              <div className="mt-6">
                <h4 className="text-xs font-bold text-gray-700 uppercase mb-3">Internal Assessment Breakup</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-2 py-1.5 text-left">Subject</th>
                        <th className="border border-gray-300 px-2 py-1.5 text-center">Periodic Test<br />(10)</th>
                        <th className="border border-gray-300 px-2 py-1.5 text-center">Notebook<br />(5)</th>
                        <th className="border border-gray-300 px-2 py-1.5 text-center">Subject Enrichment<br />(5)</th>
                        <th className="border border-gray-300 px-2 py-1.5 text-center">Total<br />(20)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {iaBreakdown.map((item, idx) =>
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="border border-gray-300 px-2 py-1.5 font-medium">{item.subject}</td>
                          <td className="border border-gray-300 px-2 py-1.5 text-center">{item.periodic}</td>
                          <td className="border border-gray-300 px-2 py-1.5 text-center">{item.notebook}</td>
                          <td className="border border-gray-300 px-2 py-1.5 text-center">{item.enrichment}</td>
                          <td className="border border-gray-300 px-2 py-1.5 text-center font-bold">{item.total}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Part II: Co-Scholastic Areas */}
            <div className="p-6 border-t-2 border-blue-800">
              <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Part II: Co-Scholastic Areas
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-purple-700 text-white">
                        <th className="border border-purple-600 px-3 py-2 text-left text-[10px] uppercase">Activity</th>
                        <th className="border border-purple-600 px-3 py-2 text-center text-[10px] uppercase w-24">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coScholasticData.map((item, idx) =>
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-purple-50/30'}>
                          <td className="border border-gray-300 px-3 py-2 font-medium">{item.area}</td>
                          <td className="border border-gray-300 px-3 py-2 text-center">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 text-purple-700 font-black text-sm">
                              {item.grade}
                            </span>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div>
                  <div className="border-2 border-gray-300 rounded-lg p-4">
                    <h4 className="text-xs font-bold text-gray-700 uppercase mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-600" /> Discipline
                    </h4>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">{discipline.remarks}</p>
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-green-100 text-green-700 font-black text-lg">
                        {discipline.grade}
                      </span>
                    </div>
                  </div>

                  <div className="border-2 border-gray-300 rounded-lg p-4 mt-4">
                    <h4 className="text-xs font-bold text-gray-700 uppercase mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" /> Attendance
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-black text-blue-700">172</p>
                        <p className="text-[10px] text-gray-500 uppercase">Days Present</p>
                      </div>
                      <div>
                        <p className="text-2xl font-black text-gray-700">180</p>
                        <p className="text-[10px] text-gray-500 uppercase">Total Working Days</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Grade Scales / Legend */}
            <div className="p-6 border-t-2 border-blue-800 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500" /> 9-Point Grading Scale (Scholastic)
                  </h4>
                  <div className="grid grid-cols-4 gap-1 text-[10px]">
                    {gradeLegend.map((g) =>
                    <div key={g.grade} className="p-2 bg-white rounded border text-center">
                        <span className="font-black text-blue-700">{g.grade}</span>
                        <p className="text-gray-500">{g.marks}</p>
                        <p className="text-gray-400">GP: {g.gp}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-500" /> Co-Scholastic Grade Scale
                  </h4>
                  <div className="flex gap-2">
                    {coScholasticGrades.map((g) =>
                    <div key={g.grade} className="flex-1 p-3 bg-white rounded border text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 text-purple-700 font-black">
                          {g.grade}
                        </span>
                        <p className="text-[10px] text-gray-500 mt-1">{g.desc}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Remarks Section */}
            <div className="p-6 border-t-2 border-blue-800">
              <h4 className="text-xs font-bold text-gray-700 uppercase mb-3">Remarks</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-xs font-bold text-blue-800 mb-2">Class Teacher's Remarks:</p>
                  <p className="text-sm text-gray-700 italic leading-relaxed">
                    "{selectedStudent.name} has shown exceptional academic performance this term. Actively participates in class discussions and demonstrates excellent analytical skills. Keep up the great work!"
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <p className="text-xs font-bold text-purple-800 mb-2">Principal's Remarks:</p>
                  <p className="text-sm text-gray-700 italic leading-relaxed">
                    "Commendable performance. Continue to strive for excellence."
                  </p>
                </div>
              </div>
            </div>

            {/* Signature Block */}
            <div className="p-6 border-t-2 border-blue-800 bg-gradient-to-r from-gray-50 to-white">
              <div className="grid grid-cols-3 gap-8 text-center">
                <div className="space-y-12">
                  <div className="h-16 border-b-2 border-gray-400"></div>
                  <div>
                    <p className="text-xs font-bold text-gray-700 uppercase">Class Teacher</p>
                    <p className="text-[10px] text-gray-500">Date: ___________</p>
                  </div>
                </div>
                <div className="space-y-12">
                  <div className="h-16 border-b-2 border-gray-400"></div>
                  <div>
                    <p className="text-xs font-bold text-gray-700 uppercase">Examination I/C</p>
                    <p className="text-[10px] text-gray-500">Date: ___________</p>
                  </div>
                </div>
                <div className="space-y-12">
                  <div className="h-16 border-b-2 border-gray-400 relative">
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                      <div className="w-16 h-8 bg-blue-100 rounded flex items-center justify-center">
                        <span className="text-[8px] text-blue-400">SEAL</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-700 uppercase">Principal</p>
                    <p className="text-[10px] text-gray-500">Date: ___________</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-700 uppercase">Parent's / Guardian's Signature</p>
                    <p className="text-[10px] text-gray-500 mt-1">I have seen the report card and discussed it with my child.</p>
                  </div>
                  <div className="w-48 h-12 border-b-2 border-gray-400"></div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-blue-800 text-center">
              <p className="text-[10px] text-blue-200">
                This is a computer generated report card. For any queries, please contact the school office.
              </p>
              <p className="text-[10px] text-blue-300 mt-1 font-semibold">
                {schoolInfo.phone} | {schoolInfo.email}
              </p>
            </div>
          </div>
        </div>
      </div>);

  }

  // Search and Filter View
  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-100">
          <FileText className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CBSE Report Card</h1>
          <p className="text-gray-500 mt-1 text-sm">Search and view student report cards</p>
        </div>
      </div>

      {/* Search and Filter Card */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-600" />
          Search & Filter
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Class Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">

              <option value="">All Classes</option>
              {classes.map((cls) =>
              <option key={cls} value={cls}>Class {cls}</option>
              )}
            </select>
          </div>

          {/* Student Search */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, roll no, admission no..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

              {searchQuery &&
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">

                  <X className="w-4 h-4" />
                </button>
              }
            </div>
          </div>

          {/* Exam Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exam</label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">

              <option value="">Select Exam</option>
              {exams.map((exam) =>
              <option key={exam} value={exam}>{exam}</option>
              )}
            </select>
          </div>

          {/* Term Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Term</label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">

              <option value="">Select Term</option>
              {terms.map((term) =>
              <option key={term} value={term}>{term}</option>
              )}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Button
            variant="primary"
            className="bg-blue-600"
            onClick={handleApplyFilters}>

            <Search className="w-4 h-4 mr-2" />
            Search Students
          </Button>
          <Button
            variant="outline"
            onClick={handleResetFilters}>

            <X className="w-4 h-4 mr-2" />
            Reset Filters
          </Button>
        </div>
      </Card>

      {/* Student List */}
      {showStudentList &&
      <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Students ({filteredStudents.length})
            </h2>
            {selectedClass &&
          <Badge variant="primary" className="bg-blue-100 text-blue-700">
                Class {selectedClass}
              </Badge>
          }
          </div>

          {filteredStudents.length === 0 ?
        <div className="text-center py-12">
              <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No students found matching your criteria</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search query</p>
            </div> :

        <div className="space-y-3">
              {filteredStudents.map((student) =>
          <div
            key={student.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all">

                  <div className="flex items-center gap-4">
                    {/* Student Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                      {student.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    
                    {/* Student Info */}
                    <div>
                      <h3 className="font-semibold text-gray-900">{student.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <GraduationCap className="w-3.5 h-3.5" />
                          Class {student.class}-{student.section}
                        </span>
                        <span>•</span>
                        <span>Roll No: {student.rollNo}</span>
                        <span>•</span>
                        <span>Adm No: {student.admissionNo}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                variant="primary"
                size="sm"
                className="bg-blue-600"
                onClick={() => handleViewReportCard(student)}>

                      <Eye className="w-4 h-4 mr-2" />
                      View Report Card
                    </Button>
                    <Button variant="outline" size="sm">
                      <Printer className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
          )}
            </div>
        }
        </Card>
      }

      {/* Initial State - No Search Yet */}
      {!showStudentList &&
      <Card className="p-12">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Search for Students</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Use the filters above to search for students and view their CBSE report cards. 
              You can filter by class, exam type, term, or search by student name.
            </p>
          </div>
        </Card>
      }
    </div>);

}

export default CBSEReportCard;