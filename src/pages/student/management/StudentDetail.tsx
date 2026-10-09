import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  User, Mail, Phone, MapPin, FileText, Bus, Home, Download, AlertTriangle,
  Stethoscope, Trophy, AlertCircle, Calendar, Edit, Printer, CheckCircle,
  Building, Shield, BookOpen, Award, Heart, Users, Eye, Image, GraduationCap,
  CreditCard, Globe, Droplets, Hash, IdCard, Wallet, LayoutDashboard, Clock,
  Bell, History, MessageSquare, Activity, Camera, FileCheck, Receipt, School,
  ClipboardList, UserCheck, BedDouble, Route, Car, QrCode, Barcode,
  ArrowRightLeft, TrendingUp, Filter, Plus, RefreshCw, Send, X, Minus, Upload, ExternalLink } from
'lucide-react';
import { Button } from '../../../components/ui/Button';

// ============================================================================
// CONSTANTS
// ============================================================================
const PRIMARY = '#24608A';

const STUDENT_DATA = {
  photo: 'https://randomuser.me/api/portraits/men/32.jpg',
  fullName: 'Arjun Sharma',
  admissionId: 'ADM-2024-001',
  studentId: 'STU-10A-012',
  class: '10',
  division: 'A',
  rollNumber: '12',
  gender: 'Male',
  dateOfBirth: '2008-05-15',
  academicYear: '2024-2025',
  classTeacher: 'Mrs. Priya Verma',
  grNumber: 'GR-2024-1234',
  uniqueCode: 'UC-78459612',
  barcodeData: '784596123456',
  father: { name: 'Rajesh Sharma', occupation: 'Business', mobile: '+91 98765 43210', email: 'rajesh.sharma@email.com' },
  mother: { name: 'Sunita Sharma', occupation: 'Teacher', mobile: '+91 98765 43211', email: 'sunita.sharma@email.com' },
  guardian: { name: 'Mohan Sharma', relation: 'Uncle', mobile: '+91 98765 43212' },
  emergencyContact: { name: 'Rajesh Sharma', relation: 'Father', mobile: '+91 98765 43210' },
  currentAddress: { line1: '42, Green Park Colony', line2: 'Near City Mall', city: 'Jaipur', state: 'Rajasthan', pinCode: '302001' },
  permanentAddress: { line1: '42, Green Park Colony', line2: 'Near City Mall', city: 'Jaipur', state: 'Rajasthan', pinCode: '302001' },
  attendance: { total: 180, present: 165, absent: 10, leave: 5, percentage: 91.7 },
  fee: { total: 85000, paid: 60000, pending: 25000, scholarship: 5000, concession: 2000, lastPayment: '2024-01-15', nextDue: '2024-04-01' },
  deposits: { security: 10000, library: 2000, lab: 3000 },
  transport: { assigned: true, route: 'Route 5 - North Zone', pickup: 'Green Park Bus Stop', vehicle: 'RJ-14-AB-1234', driver: 'Ramesh Kumar', driverContact: '+91 98765 00001' },
  hostel: { assigned: false },
  assessment: { grade: 'A1', gpa: 9.2, percentage: 92, rank: 3, status: 'Pass' },
  medical: { bloodGroup: 'B+', height: '168 cm', weight: '55 kg', allergies: ['Peanuts'], vision: { left: '6/6', right: '6/6' } },
  siblings: [{ name: 'Priya Sharma', class: '8', division: 'B', admissionNo: 'ADM-2022-045', relation: 'Sister' }],
  subjects: [
  { name: 'Mathematics', code: 'MATH101', teacher: 'Mr. Anil Kumar', contact: '+91 98765 11111' },
  { name: 'Science', code: 'SCI101', teacher: 'Mrs. Kavita Singh', contact: '+91 98765 22222' },
  { name: 'English', code: 'ENG101', teacher: 'Mr. David John', contact: '+91 98765 33333' },
  { name: 'Hindi', code: 'HIN101', teacher: 'Mrs. Sunita Devi', contact: '+91 98765 44444' },
  { name: 'Social Science', code: 'SSC101', teacher: 'Mr. Rahul Mehta', contact: '+91 98765 55555' }],

  timetable: [
  { period: 1, subject: 'Mathematics', time: '08:00 - 08:45', teacher: 'Mr. Anil Kumar', classroom: 'Room 101', isSubstitution: false },
  { period: 2, subject: 'Science', time: '08:45 - 09:30', teacher: 'Mrs. Kavita Singh', classroom: 'Lab 1', isSubstitution: false },
  { period: 3, subject: 'English', time: '09:45 - 10:30', teacher: 'Mr. David John', classroom: 'Room 101', isSubstitution: true, substitutionTeacher: 'Mrs. Priya Verma' },
  { period: 4, subject: 'Hindi', time: '10:30 - 11:15', teacher: 'Mrs. Sunita Devi', classroom: 'Room 101', isSubstitution: false },
  { period: 5, subject: 'Social Science', time: '11:30 - 12:15', teacher: 'Mr. Rahul Mehta', classroom: 'Room 102', isSubstitution: false }],

  behavior: { score: 92, incidents: [], rewards: [{ date: '2024-01-15', title: 'Best Student Award', description: 'Academic Excellence' }] },
  documents: [
  { name: 'Birth Certificate', category: 'Identity', status: 'Verified', uploadDate: '2024-01-01', size: '1.2 MB' },
  { name: 'Aadhar Card', category: 'Identity', status: 'Verified', uploadDate: '2024-01-01', size: '0.8 MB' },
  { name: 'Previous Marksheet', category: 'Academic', status: 'Verified', uploadDate: '2024-01-02', size: '2.1 MB' },
  { name: 'Transfer Certificate', category: 'Academic', status: 'Pending', uploadDate: '2024-01-03', size: '1.5 MB' }],

  monthlyAttendance: [
  { month: 'April', present: 22, absent: 2, percentage: 91.7 },
  { month: 'May', present: 20, absent: 1, percentage: 95.2 },
  { month: 'June', present: 18, absent: 2, percentage: 90.0 }],

  feeInstallments: [
  { installment: '1st Quarter', amount: 21250, dueDate: '2024-04-15', status: 'Paid' },
  { installment: '2nd Quarter', amount: 21250, dueDate: '2024-07-15', status: 'Paid' },
  { installment: '3rd Quarter', amount: 21250, dueDate: '2024-10-15', status: 'Pending' },
  { installment: '4th Quarter', amount: 21250, dueDate: '2025-01-15', status: 'Pending' }],

  paymentHistory: [
  { date: '2024-04-10', amount: 21250, mode: 'Online', receipt: 'RCP-2024-001' },
  { date: '2024-07-12', amount: 21250, mode: 'Cheque', receipt: 'RCP-2024-045' }],

  subjectMarks: [
  { subject: 'Mathematics', marks: 95, maxMarks: 100, grade: 'A1' },
  { subject: 'Science', marks: 92, maxMarks: 100, grade: 'A1' },
  { subject: 'English', marks: 88, maxMarks: 100, grade: 'A2' },
  { subject: 'Hindi', marks: 90, maxMarks: 100, grade: 'A1' },
  { subject: 'Social Science', marks: 85, maxMarks: 100, grade: 'A2' }],

  leaveApplications: [
  { date: '2024-02-10', reason: 'Family Function', status: 'Approved' },
  { date: '2024-03-05', reason: 'Medical', status: 'Approved' }]

};

const CLASSES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const DIVISIONS = ['A', 'B', 'C', 'D'];

const NAV_ITEMS = [
{ id: 'overview', label: 'Overview', icon: LayoutDashboard },
{ id: 'student-details', label: 'Student Details', icon: User },
{ id: 'fee', label: 'Fee', icon: CreditCard },
{ id: 'attendance', label: 'Attendance', icon: UserCheck },
{ id: 'assessment', label: 'Assessment', icon: ClipboardList },
{ id: 'certificates', label: 'Certificates', icon: Award },
{ id: 'charges', label: 'Charges', icon: Receipt },
{ id: 'deposit', label: 'Deposit', icon: Wallet },
{ id: 'photos-documents', label: 'Documents', icon: Image },
{ id: 'alerts', label: 'Alerts', icon: Bell },
{ id: 'transport', label: 'Transport', icon: Bus },
{ id: 'hostel', label: 'Hostel', icon: BedDouble },
{ id: 'discipline', label: 'Discipline', icon: Shield },
{ id: 'medical', label: 'Medical', icon: Heart },
{ id: 'siblings', label: 'Siblings', icon: Users },
{ id: 'activity', label: 'Activity', icon: Activity },
{ id: 'communication', label: 'Communication', icon: MessageSquare },
{ id: 'audit', label: 'Audit History', icon: History }];


// ============================================================================
// UI COMPONENTS
// ============================================================================
const Field = ({ label, value, icon: Icon, className = '' }: {label: string;value?: any;icon?: React.ElementType;className?: string;}) =>
<div className={className}>
    <div className="flex items-center gap-2 mb-1">
      {Icon && <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center"><Icon className="w-3 h-3" style={{ color: PRIMARY }} /></div>}
      <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{label}</span>
    </div>
    <p className="text-sm font-semibold text-slate-700 pl-8">{value ?? '—'}</p>
  </div>;


const Card = ({ title, icon: Icon, children, actions }: {title: string;icon: React.ElementType;children: React.ReactNode;actions?: React.ReactNode;}) =>
<div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: PRIMARY }}><Icon className="w-5 h-5 text-white" /></div>
        <h3 className="font-bold text-slate-800">{title}</h3>
      </div>
      <div className="flex gap-2">{actions}</div>
    </div>
    <div className="p-5">{children}</div>
  </div>;


const Table = ({ columns, data, empty = 'No data available' }: {columns: {key: string;label: string;render?: (v: any, r: any) => React.ReactNode;}[];data: any[];empty?: string;}) =>
<div className="overflow-x-auto rounded-xl border border-slate-200">
    {!data.length ? <div className="text-center py-12 text-slate-400 text-sm bg-slate-50/50">{empty}</div> :
  <table className="w-full text-sm">
        <thead><tr className="bg-slate-50">{columns.map((c) => <th key={c.key} className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">{c.label}</th>)}</tr></thead>
        <tbody className="divide-y divide-slate-100">{data.map((row, i) => <tr key={i} className="hover:bg-slate-50/50 transition-colors">{columns.map((c) => <td key={c.key} className="px-4 py-3 text-slate-600">{c.render ? c.render(row[c.key], row) : row[c.key]}</td>)}</tr>)}</tbody>
      </table>
  }
  </div>;


const Badge = ({ status }: {status: string;}) => {
  const s = status.toLowerCase();
  const styles: Record<string, string> = { verified: 'bg-emerald-50 text-emerald-700 border-emerald-200', paid: 'bg-emerald-50 text-emerald-700 border-emerald-200', approved: 'bg-emerald-50 text-emerald-700 border-emerald-200', pass: 'bg-emerald-50 text-emerald-700 border-emerald-200', pending: 'bg-amber-50 text-amber-700 border-amber-200', rejected: 'bg-rose-50 text-rose-700 border-rose-200' };
  return <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${s === 'active' ? '' : styles[s] || 'bg-slate-50 text-slate-600 border-slate-200'}`} style={s === 'active' ? { backgroundColor: `${PRIMARY}15`, color: PRIMARY, borderColor: `${PRIMARY}30` } : {}}>{status}</span>;
};

const Stat = ({ label, value, icon: Icon, color = PRIMARY }: {label: string;value: any;icon?: React.ElementType;color?: string;}) =>
<div className="group bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">{label}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
      
    </div>
  </div>;


const Modal = ({ open, onClose, title, children }: {open: boolean;onClose: () => void;title: string;children: React.ReactNode;}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center"><X className="w-4 h-4 text-slate-500" /></button>
        </div>
        {children}
      </div>
    </div>);

};

// ============================================================================
// HEADER & SIDEBAR
// ============================================================================
const Header = ({ student, onChangeClass, onChangeDivision, onEdit }: {student: typeof STUDENT_DATA;onChangeClass: () => void;onChangeDivision: () => void;onEdit: () => void;}) =>
<div className="px-8 py-6 shadow-xl" style={{ backgroundColor: PRIMARY }}>
    <div className="flex items-center gap-8">
      <div className="flex items-center gap-5">
        <div className="relative group">
          <div className="absolute -inset-1 bg-white/20 rounded-2xl blur group-hover:bg-white/30 transition-all" />
          <img src={student.photo} alt={student.fullName} className="relative w-24 h-24 rounded-2xl object-cover border-4 border-white/30 shadow-xl" />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-xl shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
            <Camera className="w-4 h-4" style={{ color: PRIMARY }} />
          </div>
        </div>
        <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
          <QrCode className="w-16 h-16 text-white/90" />
        </div>
      </div>
      
      <div className="flex-1">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">{student.fullName}</h1>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold text-white">Class {student.class}-{student.division}</span>
              <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/80">Roll #{student.rollNumber}</span>
              <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/80">{student.academicYear}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={onChangeClass}><ArrowRightLeft className="w-4 h-4 mr-2" />Change Class</Button>
            <Button variant="outline" size="sm" onClick={onChangeDivision}><RefreshCw className="w-4 h-4 mr-2" />Change Division</Button>
            <Button variant="primary" size="sm" onClick={onEdit}><Edit className="w-4 h-4 mr-2" />Edit Student</Button>
          </div>
        </div>
        
        <div className="grid grid-cols-6 gap-4">
          {[
        { label: 'Student ID', value: student.studentId },
        { label: 'GR Number', value: student.grNumber },
        { label: 'Date of Birth', value: student.dateOfBirth },
        { label: 'Gender', value: student.gender },
        { label: 'Class Teacher', value: student.classTeacher },
        { label: 'Barcode', value: student.barcodeData, icon: Barcode }].
        map(({ label, value, icon: Icon }) =>
        <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/10">
              <p className="text-[10px] font-medium text-white/60 uppercase tracking-wider mb-0.5">{label}</p>
              <div className="flex items-center gap-2">
                {Icon && <Icon className="w-4 h-4 text-white/70" />}
                <p className="text-sm font-semibold text-white truncate">{value}</p>
              </div>
            </div>
        )}
        </div>
      </div>
    </div>
  </div>;


const Sidebar = ({ active, onChange }: {active: string;onChange: (id: string) => void;}) =>
<aside className="w-64 bg-white border-r border-slate-200 overflow-y-auto flex-shrink-0">
    <nav className="p-4 space-y-1">
      {NAV_ITEMS.map(({ id, label, icon: Icon }) =>
    <button key={id} onClick={() => onChange(id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${active === id ? 'text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'}`} style={active === id ? { backgroundColor: PRIMARY } : {}}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${active === id ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
            <Icon className={`w-4 h-4 ${active === id ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
          </div>
          {label}
        </button>
    )}
    </nav>
  </aside>;


// ============================================================================
// SECTIONS
// ============================================================================
const ContactSection = ({ s }: {s: typeof STUDENT_DATA;}) =>
<Card title="Contact Details" icon={Phone}>
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <Field label="Father Name" value={s.father.name} icon={User} />
        <Field label="Father Mobile" value={s.father.mobile} icon={Phone} />
        <Field label="Mother Name" value={s.mother.name} icon={User} />
        <Field label="Mother Mobile" value={s.mother.mobile} icon={Phone} />
        <Field label="Father Email" value={s.father.email} icon={Mail} />
        <Field label="Occupation" value={s.father.occupation} icon={Building} />
        <Field label="Guardian" value={s.guardian.name} icon={User} />
        <Field label="Emergency" value={s.emergencyContact.mobile} icon={AlertCircle} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[{ title: 'Current Address', icon: Home, addr: s.currentAddress }, { title: 'Permanent Address', icon: MapPin, addr: s.permanentAddress }].map(({ title, icon: Icon, addr }) =>
      <div key={title} className="bg-slate-50 p-5 rounded-xl border border-slate-100">
            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: PRIMARY }}><Icon className="w-3.5 h-3.5 text-white" /></div>
              {title}
            </h5>
            <p className="text-sm text-slate-600 leading-relaxed">{addr.line1}, {addr.line2}<br />{addr.city}, {addr.state} - {addr.pinCode}</p>
          </div>
      )}
      </div>
    </div>
  </Card>;


const AttendanceSection = ({ s }: {s: typeof STUDENT_DATA;}) =>
<Card title="Attendance Details" icon={UserCheck} actions={<Button variant="outline" size="sm">View Details</Button>}>
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Stat label="Total Days" value={s.attendance.total} icon={Calendar} />
        <Stat label="Present" value={s.attendance.present} icon={CheckCircle} color="#10b981" />
        <Stat label="Absent" value={s.attendance.absent} icon={X} color="#f43f5e" />
        <Stat label="Leave" value={s.attendance.leave} icon={Clock} color="#f59e0b" />
        <Stat label="Percentage" value={`${s.attendance.percentage}%`} icon={TrendingUp} color="#8b5cf6" />
      </div>
      <Table columns={[{ key: 'month', label: 'Month' }, { key: 'present', label: 'Present' }, { key: 'absent', label: 'Absent' }, { key: 'percentage', label: '%', render: (v) => <span className="font-semibold" style={{ color: PRIMARY }}>{v}%</span> }]} data={s.monthlyAttendance} />
      <Table columns={[{ key: 'date', label: 'Date' }, { key: 'reason', label: 'Reason' }, { key: 'status', label: 'Status', render: (v) => <Badge status={v} /> }]} data={s.leaveApplications} />
    </div>
  </Card>;


const FeeSection = ({ s }: {s: typeof STUDENT_DATA;}) =>
<Card title="Fee Details" icon={CreditCard} actions={<><Button variant="primary" size="sm">Pay Fee</Button><Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Receipt</Button></>}>
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Stat label="Total Fees" value={`₹${s.fee.total.toLocaleString()}`} icon={Receipt} />
        <Stat label="Paid" value={`₹${s.fee.paid.toLocaleString()}`} icon={CheckCircle} color="#10b981" />
        <Stat label="Pending" value={`₹${s.fee.pending.toLocaleString()}`} icon={AlertCircle} color="#f43f5e" />
        <Stat label="Scholarship" value={`₹${s.fee.scholarship.toLocaleString()}`} icon={Award} color="#f59e0b" />
        <Stat label="Concession" value={`₹${s.fee.concession.toLocaleString()}`} icon={Minus} color="#8b5cf6" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Field label="Last Payment" value={s.fee.lastPayment} icon={Calendar} />
        <Field label="Next Due Date" value={s.fee.nextDue} icon={Calendar} />
      </div>
      <Table columns={[{ key: 'installment', label: 'Installment' }, { key: 'amount', label: 'Amount', render: (v) => `₹${v.toLocaleString()}` }, { key: 'dueDate', label: 'Due Date' }, { key: 'status', label: 'Status', render: (v) => <Badge status={v} /> }]} data={s.feeInstallments} />
    </div>
  </Card>;


const DepositSection = ({ s }: {s: typeof STUDENT_DATA;}) =>
<Card title="Deposit Details" icon={Wallet}>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <Stat label="Security Deposit" value={`₹${s.deposits.security.toLocaleString()}`} icon={Shield} />
      <Stat label="Library Deposit" value={`₹${s.deposits.library.toLocaleString()}`} icon={BookOpen} color="#10b981" />
      <Stat label="Lab Deposit" value={`₹${s.deposits.lab.toLocaleString()}`} icon={Stethoscope} color="#f59e0b" />
    </div>
  </Card>;


const TransportSection = ({ s }: {s: typeof STUDENT_DATA;}) =>
<Card title="Transport Details" icon={Bus} actions={<><Button variant="outline" size="sm">Assign Route</Button><Button variant="outline" size="sm">Change Pickup</Button></>}>
    <div className="flex items-center gap-3 mb-5">
      <span className="text-sm font-medium text-slate-600">Transport Status:</span>
      <Badge status={s.transport.assigned ? 'Active' : 'Not Assigned'} />
    </div>
    {s.transport.assigned &&
  <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        <Field label="Route Name" value={s.transport.route} icon={Route} />
        <Field label="Pickup Point" value={s.transport.pickup} icon={MapPin} />
        <Field label="Vehicle Number" value={s.transport.vehicle} icon={Car} />
        <Field label="Driver Name" value={s.transport.driver} icon={User} />
        <Field label="Driver Contact" value={s.transport.driverContact} icon={Phone} />
      </div>
  }
  </Card>;


const HostelSection = ({ s }: {s: typeof STUDENT_DATA;}) =>
<Card title="Hostel Details" icon={BedDouble} actions={<Button variant="outline" size="sm">Assign Room</Button>}>
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-slate-600">Hostel Status:</span>
      <Badge status={s.hostel.assigned ? 'Active' : 'Not Assigned'} />
    </div>
  </Card>;


const AssessmentSection = ({ s }: {s: typeof STUDENT_DATA;}) =>
<Card title="Assessment Details" icon={ClipboardList} actions={<><Button variant="outline" size="sm">View Marksheet</Button><Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Report Card</Button></>}>
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Stat label="Overall Grade" value={s.assessment.grade} icon={Award} />
        <Stat label="GPA" value={s.assessment.gpa} icon={TrendingUp} color="#10b981" />
        <Stat label="Percentage" value={`${s.assessment.percentage}%`} icon={CheckCircle} color="#f59e0b" />
        <Stat label="Rank" value={`#${s.assessment.rank}`} icon={Trophy} color="#8b5cf6" />
        <Stat label="Status" value={s.assessment.status} icon={FileCheck} />
      </div>
      <Table columns={[{ key: 'subject', label: 'Subject' }, { key: 'marks', label: 'Marks' }, { key: 'maxMarks', label: 'Max' }, { key: 'grade', label: 'Grade', render: (v) => <span className="font-bold" style={{ color: PRIMARY }}>{v}</span> }]} data={s.subjectMarks} />
    </div>
  </Card>;


const TimetableSection = ({ s }: {s: typeof STUDENT_DATA;}) =>
<Card title="Today's Lectures" icon={Clock}>
    <Table columns={[{ key: 'period', label: 'Period' }, { key: 'subject', label: 'Subject' }, { key: 'time', label: 'Time' }, { key: 'teacher', label: 'Teacher' }, { key: 'classroom', label: 'Room' }, { key: 'isSubstitution', label: 'Substitution', render: (v, r) => v ? <span className="text-amber-600 font-medium text-xs">{r.substitutionTeacher}</span> : '—' }]} data={s.timetable} />
  </Card>;


const SiblingSection = ({ s }: {s: typeof STUDENT_DATA;}) =>
<Card title="Sibling Details" icon={Users}>
    <Table columns={[{ key: 'name', label: 'Name', render: (v) => <button className="hover:underline font-medium flex items-center gap-1" style={{ color: PRIMARY }}>{v}<ExternalLink className="w-3 h-3" /></button> }, { key: 'class', label: 'Class' }, { key: 'division', label: 'Division' }, { key: 'admissionNo', label: 'Admission No' }, { key: 'relation', label: 'Relation' }]} data={s.siblings} empty="No siblings registered" />
  </Card>;


const TeacherSection = ({ s }: {s: typeof STUDENT_DATA;}) =>
<Card title="Teacher & Subject Details" icon={GraduationCap}>
    <Table columns={[{ key: 'name', label: 'Subject' }, { key: 'code', label: 'Code' }, { key: 'teacher', label: 'Teacher' }, { key: 'contact', label: 'Contact' }]} data={s.subjects} />
  </Card>;


const BehaviorSection = ({ s }: {s: typeof STUDENT_DATA;}) =>
<Card title="Behavior / Discipline" icon={Shield}>
    <div className="space-y-5">
      <div className="max-w-xs"><Stat label="Behavior Score" value={`${s.behavior.score}/100`} icon={TrendingUp} color="#10b981" /></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><h4 className="text-sm font-bold text-slate-700 mb-3">Disciplinary Records</h4><Table columns={[{ key: 'date', label: 'Date' }, { key: 'incident', label: 'Incident' }, { key: 'action', label: 'Action' }]} data={s.behavior.incidents} empty="No incidents recorded" /></div>
        <div><h4 className="text-sm font-bold text-slate-700 mb-3">Rewards & Appreciation</h4><Table columns={[{ key: 'date', label: 'Date' }, { key: 'title', label: 'Title' }, { key: 'description', label: 'Description' }]} data={s.behavior.rewards} /></div>
      </div>
    </div>
  </Card>;


const StudentDetailsView = ({ s }: {s: typeof STUDENT_DATA;}) =>
<div className="space-y-6">
    <Card title="Admission Details" icon={FileText}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <Field label="Admission Date" value="2024-04-01" icon={Calendar} />
        <Field label="Admission Number" value={s.admissionId} icon={Hash} />
        <Field label="Previous School" value="Delhi Public School" icon={School} />
        <Field label="Nationality" value="Indian" icon={Globe} />
        <Field label="Religion" value="Hindu" icon={Heart} />
        <Field label="Blood Group" value={s.medical.bloodGroup} icon={Droplets} />
        <Field label="Aadhar Number" value="1234-5678-9012" icon={IdCard} />
      </div>
    </Card>
    <Card title="Academic Information" icon={GraduationCap}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <Field label="Academic Stream" value="Science" />
        <Field label="Board" value="CBSE" />
        <Field label="Medium" value="English" />
        <Field label="Second Language" value="Hindi" />
      </div>
    </Card>
  </div>;


const DocumentsView = ({ s }: {s: typeof STUDENT_DATA;}) =>
<div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold text-slate-800">Photos & Documents</h2>
      <Button variant="primary" size="sm"><Upload className="w-4 h-4 mr-2" />Upload Document</Button>
    </div>
    <Card title="Profile Photo" icon={Camera}>
      <div className="flex items-center gap-8">
        <img src={s.photo} alt={s.fullName} className="w-36 h-36 rounded-2xl object-cover border-4 border-slate-100 shadow-lg" />
        <Button variant="outline" size="sm"><Upload className="w-4 h-4 mr-2" />Change Photo</Button>
      </div>
    </Card>
    <Card title="Document Verification Status" icon={FileCheck}>
      <Table columns={[{ key: 'name', label: 'Document' }, { key: 'category', label: 'Category' }, { key: 'uploadDate', label: 'Upload Date' }, { key: 'size', label: 'Size' }, { key: 'status', label: 'Status', render: (v) => <Badge status={v} /> }, { key: 'actions', label: 'Actions', render: () => <div className="flex gap-3"><Eye className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-600" /><Download className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-600" /></div> }]} data={s.documents} />
    </Card>
  </div>;


const MedicalView = ({ s }: {s: typeof STUDENT_DATA;}) =>
<div className="space-y-6">
    <Card title="Basic Medical Information" icon={Heart}>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
        <Field label="Blood Group" value={s.medical.bloodGroup} icon={Droplets} />
        <Field label="Height" value={s.medical.height} />
        <Field label="Weight" value={s.medical.weight} />
        <Field label="Vision (Left)" value={s.medical.vision.left} icon={Eye} />
        <Field label="Vision (Right)" value={s.medical.vision.right} icon={Eye} />
      </div>
    </Card>
    <Card title="Allergies" icon={AlertTriangle}>
      <div className="flex flex-wrap gap-3">
        {s.medical.allergies.length ? s.medical.allergies.map((a, i) => <span key={i} className="px-4 py-2 bg-rose-50 text-rose-700 rounded-full text-sm font-medium border border-rose-200">{a}</span>) : <span className="text-slate-400 text-sm">No allergies recorded</span>}
      </div>
    </Card>
  </div>;


const CertificatesView = () =>
<div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold text-slate-800">Certificates</h2>
      <Button variant="primary" size="sm"><Plus className="w-4 h-4 mr-2" />Request Certificate</Button>
    </div>
    {['Bonafide Certificate', 'Leaving Certificate', 'Character Certificate', 'Transfer Certificate'].map((cert) =>
  <Card key={cert} title={cert} icon={Award}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-5">
          <Field label="Certificate Number" value="—" />
          <Field label="Issue Date" value="—" />
          <Field label="Status" value="—" />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm"><Eye className="w-4 h-4 mr-2" />Preview</Button>
          <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Download</Button>
          <Button variant="outline" size="sm"><Printer className="w-4 h-4 mr-2" />Print</Button>
        </div>
      </Card>
  )}
  </div>;


const AlertsView = () =>
<div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold text-slate-800">Alerts & Notifications</h2>
      <div className="flex gap-3">
        <Button variant="outline" size="sm">Mark All Read</Button>
        <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-2" />Filter</Button>
      </div>
    </div>
    {['Fee Due Alerts', 'Attendance Warning', 'Academic Warning', 'Behavior Alert'].map((t) =>
  <Card key={t} title={t} icon={Bell}><Table columns={[{ key: 'date', label: 'Date' }, { key: 'message', label: 'Message' }, { key: 'priority', label: 'Priority' }]} data={[]} empty={`No ${t.toLowerCase()}`} /></Card>
  )}
  </div>;


const AuditView = () =>
<div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold text-slate-800">Audit History</h2>
      <div className="flex gap-3">
        <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-2" />Filter</Button>
        <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Export</Button>
      </div>
    </div>
    {[{ t: 'Record Modifications', i: Edit }, { t: 'Fee Changes', i: CreditCard }, { t: 'Class Changes', i: ArrowRightLeft }, { t: 'Admin Actions', i: Shield }].map(({ t, i }) =>
  <Card key={t} title={t} icon={i}><Table columns={[{ key: 'timestamp', label: 'Timestamp' }, { key: 'change', label: 'Change' }, { key: 'modifiedBy', label: 'Modified By' }]} data={[]} /></Card>
  )}
  </div>;


const Overview = ({ s }: {s: typeof STUDENT_DATA;}) =>
<div className="space-y-6">
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6"><ContactSection s={s} /><AttendanceSection s={s} /></div>
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6"><FeeSection s={s} /><DepositSection s={s} /></div>
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6"><TransportSection s={s} /><HostelSection s={s} /></div>
    <AssessmentSection s={s} />
    <TimetableSection s={s} />
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6"><SiblingSection s={s} /><TeacherSection s={s} /></div>
    <BehaviorSection s={s} />
  </div>;


// ============================================================================
// MAIN COMPONENT
// ============================================================================
export function StudentDetail() {
  const { id } = useParams();
  const [active, setActive] = useState('overview');
  const [student, setStudent] = useState(STUDENT_DATA);
  const [classModal, setClassModal] = useState(false);
  const [divModal, setDivModal] = useState(false);
  const [selClass, setSelClass] = useState(student.class);
  const [selDiv, setSelDiv] = useState(student.division);

  const changeClass = () => {setStudent((p) => ({ ...p, class: selClass, studentId: `STU-${selClass}${p.division}-${p.rollNumber}` }));setClassModal(false);};
  const changeDiv = () => {setStudent((p) => ({ ...p, division: selDiv, studentId: `STU-${p.class}${selDiv}-${p.rollNumber}` }));setDivModal(false);};

  const views: Record<string, React.ReactNode> = {
    'overview': <Overview s={student} />,
    'student-details': <StudentDetailsView s={student} />,
    'fee': <FeeSection s={student} />,
    'attendance': <AttendanceSection s={student} />,
    'assessment': <AssessmentSection s={student} />,
    'certificates': <CertificatesView />,
    'deposit': <DepositSection s={student} />,
    'photos-documents': <DocumentsView s={student} />,
    'alerts': <AlertsView />,
    'transport': <TransportSection s={student} />,
    'hostel': <HostelSection s={student} />,
    'discipline': <BehaviorSection s={student} />,
    'medical': <MedicalView s={student} />,
    'siblings': <SiblingSection s={student} />,
    'activity': <Card title="Activity / Co-Scholastic" icon={Activity}><Table columns={[{ key: 'activity', label: 'Activity' }, { key: 'grade', label: 'Grade' }]} data={[]} /></Card>,
    'communication': <Card title="Communication Log" icon={MessageSquare}><Table columns={[{ key: 'date', label: 'Date' }, { key: 'type', label: 'Type' }, { key: 'message', label: 'Message' }]} data={[]} /></Card>,
    'audit': <AuditView />,
    'charges': <Card title="Charges" icon={Receipt}><Table columns={[{ key: 'type', label: 'Type' }, { key: 'amount', label: 'Amount' }, { key: 'date', label: 'Date' }, { key: 'status', label: 'Status' }]} data={[]} /></Card>
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <Header student={student} onChangeClass={() => {setSelClass(student.class);setClassModal(true);}} onChangeDivision={() => {setSelDiv(student.division);setDivModal(true);}} onEdit={() => {}} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar active={active} onChange={setActive} />
        <main className="flex-1 overflow-y-auto p-6">{views[active] || <Overview s={student} />}</main>
      </div>

      <Modal open={classModal} onClose={() => setClassModal(false)} title="Change Class">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Current Class: <span style={{ color: PRIMARY }}>{student.class}</span></label>
            <select value={selClass} onChange={(e) => setSelClass(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {CLASSES.map((c) => <option key={c} value={c}>Class {c}</option>)}
            </select>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <span>This will update the student's class and may affect fee structure, subjects, and timetable.</span>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setClassModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={changeClass}>Confirm Change</Button>
          </div>
        </div>
      </Modal>

      <Modal open={divModal} onClose={() => setDivModal(false)} title="Change Division">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Current Division: <span style={{ color: PRIMARY }}>{student.division}</span></label>
            <select value={selDiv} onChange={(e) => setSelDiv(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {DIVISIONS.map((d) => <option key={d} value={d}>Division {d}</option>)}
            </select>
          </div>
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-sm text-sky-800 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
            <span>This will update the student's division and may change their class teacher and classroom.</span>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDivModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={changeDiv}>Confirm Change</Button>
          </div>
        </div>
      </Modal>
    </div>);

}

export default StudentDetail;