import React, { useState, useMemo } from 'react';
import {
  Printer, Download, QrCode, Calendar, Clock, BookOpen, Search, Filter, RefreshCcw,
  CheckCircle, Eye, ChevronRight, ChevronLeft, Users, GraduationCap, Building2,
  Armchair, Camera, Settings, List, X, MoreVertical, AlertTriangle, Barcode, Ticket,
  FileCheck, Loader2, ZoomIn, ZoomOut, Layout, CalendarDays, Save, Sparkles, Wand2,
  SlidersHorizontal, LayoutTemplate, Palette, Plus, Trash2, Check, Mail } from
'lucide-react';

// Types
interface Student {
  id: string;
  rollNo: string;
  seatNo: string;
  admissionNo: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  class: string;
  section: string;
  category: string;
  contactNo: string;
  email: string;
  address: string;
  bloodGroup: string;
}

interface ExamSchedule {
  subjectCode: string;
  subjectName: string;
  date: string;
  day: string;
  startTime: string;
  endTime: string;
  duration: string;
}

interface Exam {
  id: string;
  name: string;
  code: string;
  type: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  classes: string[];
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  schedule: ExamSchedule[];
}

interface HallTicket {
  id: string;
  ticketNo: string;
  student: Student;
  exam: Exam;
  roomNo: string;
  seatNo: string;
  status: 'Generated' | 'Printed' | 'Issued';
  generatedAt: string;
}

interface Template {
  colorScheme: 'Blue' | 'Green' | 'Red' | 'Purple' | 'Orange' | 'Teal';
  headerStyle: 'Classic' | 'Modern' | 'Minimal';
  borderStyle: 'None' | 'Simple' | 'Double';
  includePhoto: boolean;
  includeQRCode: boolean;
  includeBarcode: boolean;
  includeInstructions: boolean;
  showSchedule: boolean;
  showCenter: boolean;
  footerText: string;
}

// Components
const Card: React.FC<{children: React.ReactNode;className?: string;}> = ({ children, className = '' }) =>
<div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>{children}</div>;


const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}> = ({ children, variant = 'primary', size = 'md', className = '', disabled = false, onClick }) => {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white',
    ghost: 'text-gray-600 hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700'
  };
  const sizes = { xs: 'px-2 py-1 text-xs', sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };
  return (
    <button className={`inline-flex items-center justify-center font-medium rounded-lg transition-all ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`} disabled={disabled} onClick={onClick}>
      {children}
    </button>);

};

const Badge: React.FC<{children: React.ReactNode;variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';}> = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800', success: 'bg-green-100 text-green-800', warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800', info: 'bg-blue-100 text-blue-800', purple: 'bg-purple-100 text-purple-800'
  };
  return <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>{children}</span>;
};

const Select: React.FC<{value: string;onChange: (v: string) => void;options: {value: string;label: string;}[];placeholder?: string;className?: string;disabled?: boolean;}> =
({ value, onChange, options, placeholder = 'Select...', className = '', disabled = false }) =>
<select value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}
className={`w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${className}`}>
    <option value="">{placeholder}</option>
    {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
  </select>;


const Input: React.FC<{value: string;onChange: (v: string) => void;placeholder?: string;className?: string;icon?: React.ReactNode;disabled?: boolean;}> =
({ value, onChange, placeholder, className = '', icon, disabled = false }) =>
<div className="relative">
    {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} disabled={disabled}
  className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${icon ? 'pl-10' : ''} ${className}`} />
  </div>;


const Toggle: React.FC<{checked: boolean;onChange: (v: boolean) => void;label: string;}> = ({ checked, onChange, label }) =>
<label className="flex items-center justify-between cursor-pointer">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <div className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-300'}`} onClick={() => onChange(!checked)}>
      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5 left-0.5' : 'left-0.5'}`} />
    </div>
  </label>;


// Mock Data Generator
const generateStudents = (): Student[] => {
  const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Ananya', 'Diya', 'Myra', 'Sara', 'Aanya', 'Rohan', 'Kabir', 'Shaurya', 'Atharv', 'Advait', 'Zara', 'Kiara', 'Avni', 'Prisha', 'Navya'];
  const lastNames = ['Sharma', 'Verma', 'Patel', 'Kumar', 'Singh', 'Gupta', 'Reddy', 'Nair', 'Iyer', 'Chopra'];
  const students: Student[] = [];
  const classes = ['IX', 'X', 'XI', 'XII'];
  const sections = ['A', 'B', 'C', 'D'];

  for (let i = 0; i < 50; i++) {
    const cls = classes[Math.floor(i / 12.5)];
    const sec = sections[i % 4];
    students.push({
      id: `STU${String(i + 1).padStart(5, '0')}`,
      rollNo: `${cls}${sec}${String(i + 1).padStart(3, '0')}`,
      seatNo: `${sec}-${String(i % 25 + 1).padStart(3, '0')}`,
      admissionNo: `ADM/2020/${String(1000 + i)}`,
      firstName: firstNames[i % 20],
      lastName: lastNames[i % 10],
      fatherName: `Mr. ${lastNames[(i + 3) % 10]}`,
      motherName: `Mrs. ${lastNames[(i + 5) % 10]}`,
      dateOfBirth: `200${7 + i % 3}-0${i % 9 + 1}-${String(i % 28 + 1).padStart(2, '0')}`,
      gender: i % 3 === 0 ? 'Female' : 'Male',
      class: cls,
      section: sec,
      category: ['General', 'OBC', 'SC', 'ST'][i % 4],
      contactNo: `98765${String(i).padStart(5, '0')}`,
      email: `${firstNames[i % 20].toLowerCase()}@email.com`,
      address: `${i + 1}, Block ${String.fromCharCode(65 + i % 5)}, Sector ${i % 30 + 1}`,
      bloodGroup: ['A+', 'B+', 'O+', 'AB+'][i % 4]
    });
  }
  return students;
};

const generateSchedule = (startDate: string): ExamSchedule[] => {
  const subjects = [
  { code: 'ENG', name: 'English' }, { code: 'HIN', name: 'Hindi' }, { code: 'MAT', name: 'Mathematics' },
  { code: 'SCI', name: 'Science' }, { code: 'SST', name: 'Social Studies' }, { code: 'CS', name: 'Computer Science' }];

  return subjects.map((sub, idx) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + idx * 2);
    return {
      subjectCode: sub.code, subjectName: sub.name, date: date.toISOString().split('T')[0],
      day: date.toLocaleDateString('en-US', { weekday: 'long' }), startTime: '10:00 AM', endTime: '01:00 PM', duration: '3 Hours'
    };
  });
};

const mockExams: Exam[] = [
{ id: 'EXM001', name: 'Annual Examination 2024-25', code: 'AE2025', type: 'Annual', academicYear: '2024-25', startDate: '2025-03-01', endDate: '2025-03-15', classes: ['IX', 'X', 'XI', 'XII'], status: 'Upcoming', schedule: generateSchedule('2025-03-01') },
{ id: 'EXM002', name: 'Half Yearly Examination 2024-25', code: 'HY2025', type: 'Half Yearly', academicYear: '2024-25', startDate: '2024-09-15', endDate: '2024-09-30', classes: ['IX', 'X', 'XI', 'XII'], status: 'Completed', schedule: generateSchedule('2024-09-15') },
{ id: 'EXM003', name: 'Pre-Board Examination', code: 'PB2025', type: 'Pre-Board', academicYear: '2024-25', startDate: '2025-01-15', endDate: '2025-01-27', classes: ['X', 'XII'], status: 'Upcoming', schedule: generateSchedule('2025-01-15') }];


const mockStudents = generateStudents();
const roomOptions = ['Hall A', 'Hall B', 'Hall C', 'Room 101', 'Room 102', 'Room 201', 'Room 202'];
const classOptions = ['IX', 'X', 'XI', 'XII'];
const sectionOptions = ['A', 'B', 'C', 'D'];

const instructions = [
'Reach the examination center 30 minutes before the scheduled time.',
'Carry this hall ticket along with a valid photo ID proof.',
'Electronic devices including mobile phones are strictly prohibited.',
'No candidate will be allowed entry after 15 minutes of exam start.',
'Use only blue/black ball point pen for writing.',
'Any form of malpractice will lead to disqualification.'];


const center = { name: 'Delhi Public School - Main Building', address: '123 Education Lane, Sector 15', city: 'Gurugram, Haryana - 122001' };

// Main Component
export default function HallTicketGenerator() {
  const [activeTab, setActiveTab] = useState<'tickets' | 'templates' | 'generate'>('tickets');
  const [template, setTemplate] = useState<Template>({
    colorScheme: 'Blue', headerStyle: 'Classic', borderStyle: 'Simple', includePhoto: true,
    includeQRCode: true, includeBarcode: true, includeInstructions: true, showSchedule: true, showCenter: true,
    footerText: 'This is a computer-generated hall ticket and does not require signature.'
  });
  const [hallTickets, setHallTickets] = useState<HallTicket[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [ticketSearch, setTicketSearch] = useState('');
  const [ticketFilterClass, setTicketFilterClass] = useState('');
  const [ticketFilterExam, setTicketFilterExam] = useState('');
  const [selectedTickets, setSelectedTickets] = useState<Set<string>>(new Set());

  // Generation
  const [studentsToGenerate, setStudentsToGenerate] = useState<{student: Student;roomNo: string;selected: boolean;}[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  // Preview
  const [showPreview, setShowPreview] = useState(false);
  const [previewTicket, setPreviewTicket] = useState<HallTicket | null>(null);
  const [zoom, setZoom] = useState(100);

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    let result = hallTickets;
    if (ticketSearch) {
      const q = ticketSearch.toLowerCase();
      result = result.filter((t) => t.student.firstName.toLowerCase().includes(q) || t.student.lastName.toLowerCase().includes(q) || t.ticketNo.toLowerCase().includes(q));
    }
    if (ticketFilterClass) result = result.filter((t) => t.student.class === ticketFilterClass);
    if (ticketFilterExam) result = result.filter((t) => t.exam.id === ticketFilterExam);
    return result;
  }, [hallTickets, ticketSearch, ticketFilterClass, ticketFilterExam]);

  // Search students
  const searchedStudents = useMemo(() => {
    if (!selectedExam) return [];
    let result = mockStudents;
    const exam = mockExams.find((e) => e.id === selectedExam);
    if (exam) result = result.filter((s) => exam.classes.includes(s.class));
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((s) => s.firstName.toLowerCase().includes(q) || s.lastName.toLowerCase().includes(q) || s.rollNo.includes(q));
    }
    if (filterClass) result = result.filter((s) => s.class === filterClass);
    if (filterSection) result = result.filter((s) => s.section === filterSection);
    const existingIds = hallTickets.filter((t) => t.exam.id === selectedExam).map((t) => t.student.id);
    return result.filter((s) => !existingIds.includes(s.id));
  }, [searchQuery, filterClass, filterSection, selectedExam, hallTickets]);

  const totalPages = Math.ceil(searchedStudents.length / perPage);
  const paginatedStudents = searchedStudents.slice((currentPage - 1) * perPage, currentPage * perPage);

  const addStudent = (student: Student) => {
    if (!studentsToGenerate.find((s) => s.student.id === student.id)) {
      setStudentsToGenerate((prev) => [...prev, { student, roomNo: '', selected: true }]);
    }
  };

  const addAllStudents = () => {
    const newStudents = searchedStudents.filter((s) => !studentsToGenerate.find((st) => st.student.id === s.id)).
    map((student) => ({ student, roomNo: '', selected: true }));
    setStudentsToGenerate((prev) => [...prev, ...newStudents]);
  };

  const removeStudent = (id: string) => setStudentsToGenerate((prev) => prev.filter((s) => s.student.id !== id));

  const updateRoom = (id: string, roomNo: string) => {
    setStudentsToGenerate((prev) => prev.map((s) => s.student.id === id ? { ...s, roomNo } : s));
  };

  const assignRoomToAll = (roomNo: string) => {
    setStudentsToGenerate((prev) => prev.map((s) => s.selected ? { ...s, roomNo } : s));
  };

  const toggleStudent = (id: string) => {
    setStudentsToGenerate((prev) => prev.map((s) => s.student.id === id ? { ...s, selected: !s.selected } : s));
  };

  const handleGenerate = () => {
    if (!selectedExam) return alert('Select an examination');
    const selected = studentsToGenerate.filter((s) => s.selected && s.roomNo);
    if (selected.length === 0) return alert('Add students and assign rooms');
    const missing = studentsToGenerate.filter((s) => s.selected && !s.roomNo);
    if (missing.length > 0) return alert(`${missing.length} student(s) need room assignment`);

    setIsGenerating(true);
    setProgress(0);
    const exam = mockExams.find((e) => e.id === selectedExam)!;
    let count = 0;

    const interval = setInterval(() => {
      count++;
      setProgress(Math.round(count / selected.length * 100));
      if (count >= selected.length) {
        clearInterval(interval);
        setIsGenerating(false);
        const newTickets: HallTicket[] = selected.map((item, idx) => ({
          id: `HT${Date.now()}${idx}`,
          ticketNo: `HT-${exam.code}-${item.student.rollNo}`,
          student: item.student,
          exam,
          roomNo: item.roomNo,
          seatNo: item.student.seatNo,
          status: 'Generated',
          generatedAt: new Date().toISOString()
        }));
        setHallTickets((prev) => [...prev, ...newTickets]);
        setStudentsToGenerate([]);
        setSearchQuery('');
        setFilterClass('');
        setFilterSection('');
        alert(`Generated ${selected.length} hall tickets!`);
        setActiveTab('tickets');
      }
    }, 50);
  };

  const stats = useMemo(() => ({
    total: hallTickets.length,
    generated: hallTickets.filter((t) => t.status === 'Generated').length,
    printed: hallTickets.filter((t) => t.status === 'Printed').length,
    issued: hallTickets.filter((t) => t.status === 'Issued').length
  }), [hallTickets]);

  const colorClass = (scheme: string) => ({
    Blue: 'from-blue-600 to-blue-800', Green: 'from-green-600 to-green-800', Red: 'from-red-600 to-red-800',
    Purple: 'from-purple-600 to-purple-800', Orange: 'from-orange-500 to-orange-700', Teal: 'from-teal-600 to-teal-800'
  })[scheme] || 'from-blue-600 to-blue-800';

  const borderClass = (style: string) => ({ None: '', Simple: 'border-2 border-gray-800', Double: 'border-double border-4 border-gray-800' })[style] || '';

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Ticket className="w-7 h-7 text-blue-600" />Hall Ticket Generator</h1>
          <p className="text-sm text-gray-500">Generate and print examination hall tickets</p>
        </div>
        {isGenerating && <Badge variant="info"><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating... {progress}%</Badge>}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
        { label: 'Total', value: stats.total, icon: Ticket, color: 'blue' },
        { label: 'Generated', value: stats.generated, icon: FileCheck, color: 'blue' },
        { label: 'Printed', value: stats.printed, icon: Printer, color: 'purple' },
        { label: 'Issued', value: stats.issued, icon: CheckCircle, color: 'green' }].
        map((s, i) =>
        <Card key={i} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <s.icon className={`w-5 h-5 text-${s.color}-600`} />
              <Badge variant={s.color === 'green' ? 'success' : s.color === 'purple' ? 'purple' : 'info'}>{s.label}</Badge>
            </div>
            <p className={`text-2xl font-bold text-${s.color}-600`}>{s.value}</p>
          </Card>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 bg-white p-1 rounded-xl border w-fit">
        {[
        { id: 'tickets', label: 'Hall Tickets', icon: Ticket },
        { id: 'templates', label: 'Template Settings', icon: LayoutTemplate },
        { id: 'generate', label: 'Generate New', icon: Wand2 }].
        map((tab) =>
        <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
            <tab.icon className="w-4 h-4" />{tab.label}
          </button>
        )}
      </div>

      {/* Tickets Tab */}
      {activeTab === 'tickets' &&
      <Card>
          <div className="p-4 border-b flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input value={ticketSearch} onChange={setTicketSearch} placeholder="Search..." icon={<Search className="w-4 h-4" />} />
            </div>
            <Select value={ticketFilterClass} onChange={setTicketFilterClass} options={classOptions.map((c) => ({ value: c, label: `Class ${c}` }))} placeholder="All Classes" className="w-32" />
            <Select value={ticketFilterExam} onChange={setTicketFilterExam} options={mockExams.map((e) => ({ value: e.id, label: e.name }))} placeholder="All Exams" className="w-48" />
            <Button variant="outline" onClick={() => {setTicketSearch('');setTicketFilterClass('');setTicketFilterExam('');}}><RefreshCcw className="w-4 h-4" /></Button>
          </div>

          <div className="p-4 border-b flex justify-between items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={filteredTickets.length > 0 && filteredTickets.every((t) => selectedTickets.has(t.id))}
            onChange={() => setSelectedTickets(filteredTickets.every((t) => selectedTickets.has(t.id)) ? new Set() : new Set(filteredTickets.map((t) => t.id)))}
            className="w-4 h-4 rounded" />
              <span className="text-sm text-gray-600">Select All ({filteredTickets.length})</span>
            </label>
            <div className="flex gap-2">
              {selectedTickets.size > 0 &&
            <>
                  <Button variant="outline" size="sm"><Printer className="w-4 h-4 mr-1" />Print</Button>
                  <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1" />Download</Button>
                  <Button variant="outline" size="sm"><Mail className="w-4 h-4 mr-1" />Email</Button>
                </>
            }
              <Button size="sm" onClick={() => setActiveTab('generate')}><Plus className="w-4 h-4 mr-1" />Generate New</Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 w-8"><input type="checkbox" checked={filteredTickets.every((t) => selectedTickets.has(t.id))} onChange={() => {}} className="w-4 h-4 rounded" /></th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Ticket No</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Student</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Examination</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Class</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Room / Seat</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredTickets.length === 0 ?
              <tr><td colSpan={8} className="py-12 text-center text-gray-500">
                    <Ticket className="w-12 h-12 mx-auto mb-3 text-gray-300" />No hall tickets found
                    <Button size="sm" className="mt-4" onClick={() => setActiveTab('generate')}><Plus className="w-4 h-4 mr-1" />Generate</Button>
                  </td></tr> :
              filteredTickets.map((ticket) =>
              <tr key={ticket.id} className={`hover:bg-gray-50 ${selectedTickets.has(ticket.id) ? 'bg-blue-50' : ''}`}>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selectedTickets.has(ticket.id)}
                  onChange={() => {const s = new Set(selectedTickets);s.has(ticket.id) ? s.delete(ticket.id) : s.add(ticket.id);setSelectedTickets(s);}} className="w-4 h-4 rounded" />
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-blue-600">{ticket.ticketNo}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${ticket.student.gender === 'Female' ? 'bg-pink-500' : 'bg-blue-500'}`}>
                          {ticket.student.firstName[0]}{ticket.student.lastName[0]}
                        </div>
                        <div><p className="font-medium">{ticket.student.firstName} {ticket.student.lastName}</p><p className="text-xs text-gray-500">Roll: {ticket.student.rollNo}</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><p className="font-medium">{ticket.exam.name}</p><p className="text-xs text-gray-500">{ticket.exam.code}</p></td>
                    <td className="px-4 py-3 text-center"><Badge variant="info">{ticket.student.class}-{ticket.student.section}</Badge></td>
                    <td className="px-4 py-3 text-center"><p className="font-medium">{ticket.roomNo}</p><p className="text-xs text-gray-500">Seat: {ticket.seatNo}</p></td>
                    <td className="px-4 py-3 text-center"><Badge variant={ticket.status === 'Generated' ? 'info' : ticket.status === 'Printed' ? 'purple' : 'success'}>{ticket.status}</Badge></td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-1">
                        <Button variant="ghost" size="xs" onClick={() => {setPreviewTicket(ticket);setShowPreview(true);}}><Eye className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="xs"><Printer className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="xs"><Download className="w-4 h-4" /></Button>
                      </div>
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        </Card>
      }

      {/* Templates Tab */}
      {activeTab === 'templates' &&
      <div className="grid grid-cols-3 gap-6">
          <Card className="col-span-2 p-6">
            <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2"><Settings className="w-5 h-5" />Configuration</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2"><Layout className="w-4 h-4" />Layout</h4>
                <div><label className="text-sm text-gray-600 mb-1 block">Color Scheme</label>
                  <Select value={template.colorScheme} onChange={(v) => setTemplate({ ...template, colorScheme: v as any })} options={['Blue', 'Green', 'Red', 'Purple', 'Orange', 'Teal'].map((c) => ({ value: c, label: c }))} /></div>
                <div><label className="text-sm text-gray-600 mb-1 block">Header Style</label>
                  <Select value={template.headerStyle} onChange={(v) => setTemplate({ ...template, headerStyle: v as any })} options={['Classic', 'Modern', 'Minimal'].map((h) => ({ value: h, label: h }))} /></div>
                <div><label className="text-sm text-gray-600 mb-1 block">Border Style</label>
                  <Select value={template.borderStyle} onChange={(v) => setTemplate({ ...template, borderStyle: v as any })} options={['None', 'Simple', 'Double'].map((b) => ({ value: b, label: b }))} /></div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2"><SlidersHorizontal className="w-4 h-4" />Options</h4>
                <Toggle checked={template.includePhoto} onChange={(v) => setTemplate({ ...template, includePhoto: v })} label="Include Photo" />
                <Toggle checked={template.includeQRCode} onChange={(v) => setTemplate({ ...template, includeQRCode: v })} label="Include QR Code" />
                <Toggle checked={template.includeBarcode} onChange={(v) => setTemplate({ ...template, includeBarcode: v })} label="Include Barcode" />
                <Toggle checked={template.includeInstructions} onChange={(v) => setTemplate({ ...template, includeInstructions: v })} label="Include Instructions" />
                <Toggle checked={template.showSchedule} onChange={(v) => setTemplate({ ...template, showSchedule: v })} label="Show Schedule" />
                <Toggle checked={template.showCenter} onChange={(v) => setTemplate({ ...template, showCenter: v })} label="Show Center Details" />
              </div>
            </div>
            <div className="mt-6"><label className="text-sm text-gray-600 mb-1 block">Footer Text</label>
              <Input value={template.footerText} onChange={(v) => setTemplate({ ...template, footerText: v })} placeholder="Footer text..." /></div>
            <div className="mt-6 flex gap-3">
              <Button><Save className="w-4 h-4 mr-2" />Save Template</Button>
              <Button variant="outline" onClick={() => setTemplate({ colorScheme: 'Blue', headerStyle: 'Classic', borderStyle: 'Simple', includePhoto: true, includeQRCode: true, includeBarcode: true, includeInstructions: true, showSchedule: true, showCenter: true, footerText: 'This is a computer-generated hall ticket.' })}><RefreshCcw className="w-4 h-4 mr-2" />Reset</Button>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Eye className="w-5 h-5" />Preview</h3>
            <div className={`border rounded-lg p-3 bg-white ${borderClass(template.borderStyle)}`}>
              <div className={`bg-gradient-to-r ${colorClass(template.colorScheme)} text-white p-3 rounded-t`}>
                <div className="flex items-center gap-2"><div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center"><GraduationCap className="w-4 h-4" /></div>
                  <div><p className="font-bold text-sm">School Name</p><p className="text-[10px] opacity-80">ADMIT CARD</p></div></div>
              </div>
              <div className="p-3 space-y-2">
                <div className="flex gap-3">
                  {template.includePhoto && <div className="w-14 h-16 bg-gray-100 rounded flex items-center justify-center"><Camera className="w-5 h-5 text-gray-400" /></div>}
                  <div className="flex-1 space-y-1"><div className="h-2 bg-gray-200 rounded w-3/4" /><div className="h-2 bg-gray-100 rounded w-1/2" /></div>
                </div>
                {template.showSchedule && <div className="space-y-1"><div className="h-2 bg-gray-200 rounded w-full" /><div className="h-2 bg-gray-100 rounded w-full" /></div>}
                <div className="flex justify-between items-end">
                  {template.includeQRCode && <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center"><QrCode className="w-5 h-5 text-gray-400" /></div>}
                  <div className="w-14 h-6 border-b border-gray-300" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      }

      {/* Generate Tab */}
      {activeTab === 'generate' &&
      <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><Search className="w-5 h-5 text-blue-600" />Search Students</h3>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div><label className="text-sm text-gray-600 mb-1 block">Examination *</label>
                  <Select value={selectedExam} onChange={setSelectedExam} options={mockExams.map((e) => ({ value: e.id, label: `${e.name} (${e.code})` }))} placeholder="Select Exam" /></div>
                <div><label className="text-sm text-gray-600 mb-1 block">Class</label>
                  <Select value={filterClass} onChange={(v) => {setFilterClass(v);setCurrentPage(1);}}
                options={selectedExam ? mockExams.find((e) => e.id === selectedExam)?.classes.map((c) => ({ value: c, label: `Class ${c}` })) || [] : classOptions.map((c) => ({ value: c, label: `Class ${c}` }))}
                placeholder="All" disabled={!selectedExam} /></div>
                <div><label className="text-sm text-gray-600 mb-1 block">Section</label>
                  <Select value={filterSection} onChange={(v) => {setFilterSection(v);setCurrentPage(1);}} options={sectionOptions.map((s) => ({ value: s, label: `Section ${s}` }))} placeholder="All" disabled={!selectedExam} /></div>
                <div><label className="text-sm text-gray-600 mb-1 block">Search</label>
                  <Input value={searchQuery} onChange={(v) => {setSearchQuery(v);setCurrentPage(1);}} placeholder="Name, Roll..." icon={<Search className="w-4 h-4" />} disabled={!selectedExam} /></div>
              </div>

              {!selectedExam ?
            <div className="p-4 bg-yellow-50 rounded-xl text-center"><AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" /><p className="text-sm text-yellow-700 font-medium">Select an examination first</p></div> :
            (searchQuery || filterClass || filterSection) &&
            <div>
                  <div className="flex justify-between mb-3">
                    <p className="text-sm text-gray-600">Found <span className="font-semibold">{searchedStudents.length}</span> students</p>
                    {searchedStudents.length > 0 && <Button variant="outline" size="sm" onClick={addAllStudents}><Plus className="w-4 h-4 mr-1" />Add All</Button>}
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50"><tr><th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Student</th><th className="px-4 py-2 text-center text-xs font-semibold">Roll No</th><th className="px-4 py-2 text-center text-xs font-semibold">Class</th><th className="px-4 py-2 text-center text-xs font-semibold">Action</th></tr></thead>
                      <tbody className="divide-y">
                        {paginatedStudents.length === 0 ? <tr><td colSpan={4} className="py-8 text-center text-gray-500"><Users className="w-10 h-10 mx-auto mb-2 text-gray-300" />No students found</td></tr> :
                    paginatedStudents.map((student) => {
                      const added = studentsToGenerate.find((s) => s.student.id === student.id);
                      return (
                        <tr key={student.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3"><div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${student.gender === 'Female' ? 'bg-pink-500' : 'bg-blue-500'}`}>{student.firstName[0]}{student.lastName[0]}</div>
                                  <div><p className="font-medium text-sm">{student.firstName} {student.lastName}</p><p className="text-xs text-gray-500">{student.admissionNo}</p></div>
                                </div></td>
                                <td className="px-4 py-3 text-center font-mono text-sm">{student.rollNo}</td>
                                <td className="px-4 py-3 text-center"><Badge variant="info">{student.class}-{student.section}</Badge></td>
                                <td className="px-4 py-3 text-center">{added ? <Badge variant="success"><Check className="w-3 h-3 mr-1" />Added</Badge> : <Button variant="outline" size="xs" onClick={() => addStudent(student)}><Plus className="w-3 h-3 mr-1" />Add</Button>}</td>
                              </tr>);

                    })}
                      </tbody>
                    </table>
                  </div>
                  {totalPages > 1 && <div className="flex justify-between mt-4"><p className="text-sm text-gray-500">Page {currentPage} of {totalPages}</p>
                    <div className="flex gap-2"><Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}><ChevronLeft className="w-4 h-4" /></Button>
                      <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}><ChevronRight className="w-4 h-4" /></Button></div></div>}
                </div>
            }
            </Card>

            <Card className="p-6">
              <div className="flex justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2"><Users className="w-5 h-5 text-green-600" />Students to Generate ({studentsToGenerate.length})</h3>
                {studentsToGenerate.length > 0 && <div className="flex gap-2">
                  <Select value="" onChange={assignRoomToAll} options={roomOptions.map((r) => ({ value: r, label: r }))} placeholder="Assign Room to All" className="w-48" />
                  <Button variant="ghost" size="sm" onClick={() => setStudentsToGenerate([])}><Trash2 className="w-4 h-4 mr-1" />Clear</Button>
                </div>}
              </div>

              {studentsToGenerate.length === 0 ?
            <div className="py-12 text-center text-gray-500"><Armchair className="w-12 h-12 mx-auto mb-3 text-gray-300" /><p className="font-medium">No students added</p></div> :

            <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50"><tr>
                      <th className="px-4 py-2 w-8"><input type="checkbox" checked={studentsToGenerate.every((s) => s.selected)} onChange={() => setStudentsToGenerate((prev) => prev.map((s) => ({ ...s, selected: !studentsToGenerate.every((x) => x.selected) })))} className="w-4 h-4 rounded" /></th>
                      <th className="px-4 py-2 text-left text-xs font-semibold">Student</th>
                      <th className="px-4 py-2 text-center text-xs font-semibold">Class</th>
                      <th className="px-4 py-2 text-center text-xs font-semibold">Room *</th>
                      <th className="px-4 py-2 text-center text-xs font-semibold">Action</th>
                    </tr></thead>
                    <tbody className="divide-y">
                      {studentsToGenerate.map((item) =>
                  <tr key={item.student.id} className={`hover:bg-gray-50 ${item.selected ? '' : 'opacity-50'}`}>
                          <td className="px-4 py-3"><input type="checkbox" checked={item.selected} onChange={() => toggleStudent(item.student.id)} className="w-4 h-4 rounded" /></td>
                          <td className="px-4 py-3"><div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${item.student.gender === 'Female' ? 'bg-pink-500' : 'bg-blue-500'}`}>{item.student.firstName[0]}{item.student.lastName[0]}</div>
                            <div><p className="font-medium text-sm">{item.student.firstName} {item.student.lastName}</p><p className="text-xs text-gray-500">Roll: {item.student.rollNo}</p></div>
                          </div></td>
                          <td className="px-4 py-3 text-center"><Badge variant="info">{item.student.class}-{item.student.section}</Badge></td>
                          <td className="px-4 py-3"><Select value={item.roomNo} onChange={(v) => updateRoom(item.student.id, v)} options={roomOptions.map((r) => ({ value: r, label: r }))} placeholder="Select" className={`w-32 ${!item.roomNo ? 'border-red-300' : ''}`} /></td>
                          <td className="px-4 py-3 text-center"><Button variant="ghost" size="xs" onClick={() => removeStudent(item.student.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button></td>
                        </tr>
                  )}
                    </tbody>
                  </table>
                </div>
            }

              {isGenerating && <div className="mt-4 p-4 bg-blue-50 rounded-xl"><div className="flex justify-between mb-2"><span className="text-sm text-blue-700 font-medium">Generating...</span><span className="font-bold text-blue-700">{progress}%</span></div>
                <div className="w-full bg-blue-200 rounded-full h-2"><div className="h-2 rounded-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} /></div></div>}

              {studentsToGenerate.length > 0 && !isGenerating && <div className="mt-4 flex justify-end">
                <Button variant="success" size="lg" onClick={handleGenerate} disabled={!selectedExam || studentsToGenerate.filter((s) => s.selected && s.roomNo).length === 0}>
                  <Wand2 className="w-5 h-5 mr-2" />Generate {studentsToGenerate.filter((s) => s.selected).length} Hall Tickets
                </Button>
              </div>}
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><CalendarDays className="w-5 h-5 text-blue-600" />Selected Exam</h3>
              {selectedExam ? (() => {
              const exam = mockExams.find((e) => e.id === selectedExam);
              return exam ? <div className="p-4 bg-blue-50 rounded-xl">
                  <h4 className="font-semibold text-blue-900">{exam.name}</h4>
                  <p className="text-sm text-blue-700">{exam.code}</p>
                  <div className="mt-3 space-y-1 text-sm text-blue-700">
                    <p className="flex items-center gap-2"><Calendar className="w-4 h-4" />{exam.startDate} to {exam.endDate}</p>
                    <p className="flex items-center gap-2"><GraduationCap className="w-4 h-4" />Classes: {exam.classes.join(', ')}</p>
                  </div>
                  <Badge variant={exam.status === 'Upcoming' ? 'info' : exam.status === 'Ongoing' ? 'warning' : 'success'} className="mt-3">{exam.status}</Badge>
                </div> : null;
            })() : <div className="p-4 bg-gray-50 rounded-xl text-center"><CalendarDays className="w-8 h-8 text-gray-400 mx-auto mb-2" /><p className="text-sm text-gray-500">No exam selected</p></div>}
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><Building2 className="w-5 h-5 text-purple-600" />Exam Center</h3>
              <div className="p-3 bg-gray-50 rounded-lg text-sm">
                <p className="font-medium">{center.name}</p>
                <p className="text-gray-600 mt-1">{center.address}</p>
                <p className="text-gray-600">{center.city}</p>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-yellow-500" />Summary</h3>
              <div className="space-y-3">
                {[
              { label: 'Total Students', value: studentsToGenerate.length },
              { label: 'Selected', value: studentsToGenerate.filter((s) => s.selected).length, color: 'text-blue-600' },
              { label: 'Rooms Assigned', value: studentsToGenerate.filter((s) => s.roomNo).length, color: 'text-green-600' },
              { label: 'Pending Rooms', value: studentsToGenerate.filter((s) => !s.roomNo && s.selected).length, color: 'text-red-600' }].
              map((item, i) => <div key={i} className="flex justify-between"><span className="text-sm text-gray-600">{item.label}</span><span className={`font-bold ${item.color || ''}`}>{item.value}</span></div>)}
              </div>
            </Card>
          </div>
        </div>
      }

      {/* Preview Modal */}
      {showPreview && previewTicket &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl">
            <div className="bg-gray-800 text-white rounded-t-xl p-4 flex justify-between items-center">
              <h3 className="font-semibold flex items-center gap-2"><Eye className="w-5 h-5" />Preview - {previewTicket.ticketNo}</h3>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700" onClick={() => setZoom(Math.max(50, zoom - 10))}><ZoomOut className="w-4 h-4" /></Button>
                <span className="text-sm w-12 text-center">{zoom}%</span>
                <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700" onClick={() => setZoom(Math.min(150, zoom + 10))}><ZoomIn className="w-4 h-4" /></Button>
                <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700"><Printer className="w-4 h-4 mr-1" />Print</Button>
                <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700"><Download className="w-4 h-4 mr-1" />Download</Button>
                <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700" onClick={() => {setShowPreview(false);setPreviewTicket(null);}}><X className="w-5 h-5" /></Button>
              </div>
            </div>

            <div className="bg-gray-200 p-8 overflow-auto rounded-b-xl" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              <div className="bg-white mx-auto shadow-2xl" style={{ width: '210mm', minHeight: '297mm', transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}>
                <div className={`p-8 ${borderClass(template.borderStyle)}`}>
                  {/* Header */}
                  <div className={`pb-4 mb-6 border-b-4 border-${template.colorScheme.toLowerCase()}-600`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className={`w-20 h-20 rounded-lg flex items-center justify-center bg-gradient-to-br ${colorClass(template.colorScheme)}`}><GraduationCap className="w-10 h-10 text-white" /></div>
                        <div><h1 className="text-2xl font-bold">Delhi Public School</h1><p className="text-sm text-gray-600">{center.address}</p></div>
                      </div>
                      <div className="text-right"><h2 className={`text-xl font-bold text-${template.colorScheme.toLowerCase()}-600`}>ADMIT CARD</h2><p className="text-sm text-gray-600">{previewTicket.exam.name}</p><p className="text-xs text-gray-500">{previewTicket.ticketNo}</p></div>
                    </div>
                  </div>

                  {/* Student Details */}
                  <div className="grid grid-cols-4 gap-6 mb-6">
                    {template.includePhoto && <div className="col-span-1"><div className="w-32 h-40 border-2 rounded-lg bg-gray-100 flex items-center justify-center"><Camera className="w-10 h-10 text-gray-400" /></div></div>}
                    <div className={template.includePhoto ? 'col-span-3' : 'col-span-4'}>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                      { label: 'Student Name', value: `${previewTicket.student.firstName} ${previewTicket.student.lastName}`, bold: true },
                      { label: "Father's Name", value: previewTicket.student.fatherName },
                      { label: "Mother's Name", value: previewTicket.student.motherName },
                      { label: 'Date of Birth', value: previewTicket.student.dateOfBirth },
                      { label: 'Roll Number', value: previewTicket.student.rollNo },
                      { label: 'Seat Number', value: previewTicket.seatNo, highlight: true },
                      { label: 'Class & Section', value: `${previewTicket.student.class}-${previewTicket.student.section}` },
                      { label: 'Room / Hall', value: previewTicket.roomNo }].
                      map((item, i) =>
                      <div key={i} className={`p-3 rounded-lg ${item.highlight ? `bg-${template.colorScheme.toLowerCase()}-50 border-2 border-${template.colorScheme.toLowerCase()}-200` : 'bg-gray-50'}`}>
                            <p className={`text-xs uppercase font-medium ${item.highlight ? `text-${template.colorScheme.toLowerCase()}-600` : 'text-gray-500'}`}>{item.label}</p>
                            <p className={`${item.bold ? 'text-lg font-bold' : item.highlight ? `text-2xl font-black text-${template.colorScheme.toLowerCase()}-700` : 'font-medium'}`}>{item.value}</p>
                          </div>
                      )}
                      </div>
                    </div>
                  </div>

                  {/* Center */}
                  {template.showCenter && <div className="mb-6 p-4 bg-gray-50 rounded-lg"><h3 className="font-bold flex items-center gap-2"><Building2 className="w-4 h-4" />Examination Center</h3>
                    <div className="grid grid-cols-2 gap-4 mt-2 text-sm"><div><p className="text-gray-500">Center</p><p className="font-medium">{center.name}</p></div><div><p className="text-gray-500">Room</p><p className="font-medium">{previewTicket.roomNo}</p></div></div></div>}

                  {/* Schedule */}
                  {template.showSchedule && <div className="mb-6"><h3 className="font-bold mb-3 flex items-center gap-2"><Calendar className="w-4 h-4" />Examination Schedule</h3>
                    <table className="w-full text-sm border"><thead className="bg-gray-100"><tr><th className="border px-3 py-2 text-left">Subject</th><th className="border px-3 py-2 text-center">Code</th><th className="border px-3 py-2 text-center">Date</th><th className="border px-3 py-2 text-center">Day</th><th className="border px-3 py-2 text-center">Time</th></tr></thead>
                      <tbody>{previewTicket.exam.schedule.map((s, i) => <tr key={i} className={i % 2 ? 'bg-gray-50' : ''}><td className="border px-3 py-2">{s.subjectName}</td><td className="border px-3 py-2 text-center">{s.subjectCode}</td><td className="border px-3 py-2 text-center">{s.date}</td><td className="border px-3 py-2 text-center">{s.day}</td><td className="border px-3 py-2 text-center">{s.startTime} - {s.endTime}</td></tr>)}</tbody></table></div>}

                  {/* Instructions */}
                  {template.includeInstructions && <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200"><h3 className="font-bold text-yellow-800 flex items-center gap-2"><AlertTriangle className="w-4 h-4" />Important Instructions</h3>
                    <ol className="text-xs text-yellow-700 space-y-1 mt-2 list-decimal list-inside">{instructions.map((ins, i) => <li key={i}>{ins}</li>)}</ol></div>}

                  {/* Footer */}
                  <div className="flex justify-between items-end pt-6 border-t">
                    <div className="flex gap-4">
                      {template.includeQRCode && <div className="text-center"><div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center"><QrCode className="w-12 h-12 text-gray-600" /></div><p className="text-[10px] text-gray-500 mt-1">Scan to verify</p></div>}
                      {template.includeBarcode && <div className="text-center"><div className="w-32 h-12 bg-gray-100 rounded flex items-center justify-center"><Barcode className="w-24 h-8 text-gray-600" /></div></div>}
                    </div>
                    <div className="flex gap-8">{['Class Teacher', 'Exam Controller', 'Principal'].map((title, i) => <div key={i} className="text-center"><div className="w-24 h-12 border-b-2 border-gray-400" /><p className="text-xs text-gray-600 mt-2">{title}</p></div>)}</div>
                  </div>
                  <div className="mt-6 pt-4 border-t text-center"><p className="text-xs text-gray-500">{template.footerText}</p><p className="text-[10px] text-gray-400 mt-1">Generated: {new Date(previewTicket.generatedAt).toLocaleString()}</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}