// src/pages/admin/reports/EventParticipationReport.tsx

import React, { useState, useMemo, useCallback } from 'react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import {
  Calendar, Users, Award, TrendingUp, Download, Filter, Search, Eye, X, ChevronDown,
  ChevronUp, ArrowUpDown, FileText, BarChart3, PieChart, Clock, CheckCircle, XCircle,
  Trophy, Star, Target, Activity, MapPin, Edit, Send, Plus, AlertCircle, UserCheck } from
'lucide-react';

// ==================== TYPES ====================

type EventCategory = 'Academic' | 'Cultural' | 'Sports' | 'Social' | 'Technical' | 'Community Service' | 'Competition' | 'Workshop' | 'Seminar' | 'Festival';
type EventType = 'Single Day' | 'Multi Day' | 'Series' | 'Recurring';
type ParticipationRole = 'Organizer' | 'Coordinator' | 'Mentor' | 'Judge' | 'Volunteer' | 'Supervisor' | 'Speaker' | 'Facilitator';
type ParticipationStatus = 'Confirmed' | 'Completed' | 'Pending' | 'Cancelled' | 'No Show';
type Department = 'Mathematics' | 'Science' | 'English' | 'Hindi' | 'Social Studies' | 'Computer Science' | 'Physical Education' | 'Arts' | 'Commerce';

type Event = {
  id: number;
  name: string;
  category: EventCategory;
  type: EventType;
  description: string;
  startDate: string;
  endDate: string;
  duration: string;
  venue: string;
  targetAudience: string;
  expectedParticipants: number;
  actualParticipants: number;
  organizedBy: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
  budget?: number;
  outcome?: string;
};

type Participation = {
  id: string;
  eventId: number;
  eventName: string;
  teacherId: number;
  teacherName: string;
  department: Department;
  role: ParticipationRole;
  hoursContributed: number;
  status: ParticipationStatus;
  feedback?: string;
  rating?: number;
  recognitionReceived?: string;
  certificateIssued: boolean;
};

type Teacher = {
  id: number;
  name: string;
  employeeId: string;
  department: Department;
  designation: string;
  email: string;
  totalEvents: number;
  totalHours: number;
  rolesPerformed: ParticipationRole[];
  categoriesParticipated: EventCategory[];
  completedEvents: number;
  upcomingEvents: number;
  averageRating: number;
  recognitions: string[];
  certificatesEarned: number;
  lastEventDate?: string;
};

type SortKey = 'teacherName' | 'department' | 'totalEvents' | 'totalHours' | 'rating';
type SortOrder = 'asc' | 'desc';
type FilterDepartment = 'All' | Department;
type FilterCategory = 'All' | EventCategory;
type FilterRole = 'All' | ParticipationRole;
type ModalType = 'none' | 'viewTeacher' | 'viewEvent' | 'addParticipation' | 'export' | 'analytics';

// ==================== DATA ====================

const EVENT_CATEGORIES: EventCategory[] = ['Academic', 'Cultural', 'Sports', 'Social', 'Technical', 'Community Service', 'Competition', 'Workshop', 'Seminar', 'Festival'];
const PARTICIPATION_ROLES: ParticipationRole[] = ['Organizer', 'Coordinator', 'Mentor', 'Judge', 'Volunteer', 'Supervisor', 'Speaker', 'Facilitator'];
const DEPARTMENTS: Department[] = ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 'Computer Science', 'Physical Education', 'Arts', 'Commerce'];

const eventsData: Event[] = [
{ id: 1, name: 'Annual Science Exhibition', category: 'Academic', type: 'Multi Day', description: 'Annual science project exhibition', startDate: '2026-03-10', endDate: '2026-03-12', duration: '3 days', venue: 'Main Auditorium', targetAudience: 'Classes VI-XII', expectedParticipants: 500, actualParticipants: 485, organizedBy: 'Science Department', status: 'Completed', budget: 50000, outcome: 'Successful exhibition with 120 projects' },
{ id: 2, name: 'Inter-House Sports Competition', category: 'Sports', type: 'Multi Day', description: 'Annual sports day with multiple events', startDate: '2026-02-25', endDate: '2026-02-27', duration: '3 days', venue: 'Sports Ground', targetAudience: 'All Students', expectedParticipants: 800, actualParticipants: 750, organizedBy: 'Physical Education Dept', status: 'Completed', budget: 80000 },
{ id: 3, name: 'Cultural Festival - Harmony 2026', category: 'Cultural', type: 'Single Day', description: 'Annual cultural event', startDate: '2026-01-26', endDate: '2026-01-26', duration: '1 day', venue: 'Main Ground', targetAudience: 'All Students', expectedParticipants: 1000, actualParticipants: 950, organizedBy: 'Cultural Committee', status: 'Completed', budget: 100000 },
{ id: 4, name: 'Parent-Teacher Meeting', category: 'Academic', type: 'Recurring', description: 'Quarterly PTM', startDate: '2026-03-20', endDate: '2026-03-20', duration: '4 hours', venue: 'Classrooms', targetAudience: 'Parents', expectedParticipants: 600, actualParticipants: 0, organizedBy: 'Administration', status: 'Upcoming' },
{ id: 5, name: 'Mathematics Olympiad', category: 'Competition', type: 'Single Day', description: 'Math competition for students', startDate: '2026-02-15', endDate: '2026-02-15', duration: '3 hours', venue: 'Exam Halls', targetAudience: 'Classes VIII-XII', expectedParticipants: 200, actualParticipants: 185, organizedBy: 'Math Department', status: 'Completed', outcome: 'Top 20 students qualified for state level' },
{ id: 6, name: 'Blood Donation Camp', category: 'Community Service', type: 'Single Day', description: 'Annual blood donation drive', startDate: '2026-01-15', endDate: '2026-01-15', duration: '6 hours', venue: 'School Hall', targetAudience: 'Staff & Parents', expectedParticipants: 100, actualParticipants: 95, organizedBy: 'NSS Club', status: 'Completed' },
{ id: 7, name: 'Computer Science Workshop', category: 'Workshop', type: 'Series', description: 'AI/ML workshop series', startDate: '2026-03-01', endDate: '2026-03-05', duration: '5 days', venue: 'Computer Lab', targetAudience: 'Classes XI-XII', expectedParticipants: 60, actualParticipants: 58, organizedBy: 'CS Department', status: 'Completed' },
{ id: 8, name: 'Annual Day Celebration', category: 'Festival', type: 'Single Day', description: 'School anniversary celebration', startDate: '2026-04-15', endDate: '2026-04-15', duration: 'Full Day', venue: 'Main Ground', targetAudience: 'All', expectedParticipants: 1500, actualParticipants: 0, organizedBy: 'Management', status: 'Upcoming', budget: 200000 },
{ id: 9, name: 'Career Guidance Seminar', category: 'Seminar', type: 'Single Day', description: 'Career counseling for Class XII', startDate: '2026-02-20', endDate: '2026-02-20', duration: '3 hours', venue: 'Auditorium', targetAudience: 'Class XII', expectedParticipants: 150, actualParticipants: 142, organizedBy: 'Counseling Cell', status: 'Completed' },
{ id: 10, name: 'Republic Day Celebration', category: 'Festival', type: 'Single Day', description: 'Republic Day celebrations', startDate: '2026-01-26', endDate: '2026-01-26', duration: '2 hours', venue: 'Assembly Ground', targetAudience: 'All Students', expectedParticipants: 1200, actualParticipants: 1150, organizedBy: 'Administration', status: 'Completed' }];


const participationsData: Participation[] = [
{ id: 'p1', eventId: 1, eventName: 'Annual Science Exhibition', teacherId: 2, teacherName: 'Mrs. Anita Gupta', department: 'Science', role: 'Organizer', hoursContributed: 25, status: 'Completed', rating: 5, certificateIssued: true, recognitionReceived: 'Best Organizer Award' },
{ id: 'p2', eventId: 1, eventName: 'Annual Science Exhibition', teacherId: 8, teacherName: 'Dr. Priya Verma', department: 'Science', role: 'Coordinator', hoursContributed: 20, status: 'Completed', rating: 5, certificateIssued: true },
{ id: 'p3', eventId: 1, eventName: 'Annual Science Exhibition', teacherId: 10, teacherName: 'Mrs. Sunita Rao', department: 'Science', role: 'Judge', hoursContributed: 8, status: 'Completed', rating: 4, certificateIssued: true },
{ id: 'p4', eventId: 2, eventName: 'Inter-House Sports Competition', teacherId: 7, teacherName: 'Mr. Pradeep Joshi', department: 'Physical Education', role: 'Organizer', hoursContributed: 35, status: 'Completed', rating: 5, certificateIssued: true, recognitionReceived: 'Excellence in Sports Management' },
{ id: 'p5', eventId: 2, eventName: 'Inter-House Sports Competition', teacherId: 1, teacherName: 'Dr. Ramesh Sharma', department: 'Mathematics', role: 'Volunteer', hoursContributed: 6, status: 'Completed', rating: 4, certificateIssued: true },
{ id: 'p6', eventId: 3, eventName: 'Cultural Festival - Harmony 2026', teacherId: 3, teacherName: 'Mr. Mohit Singh', department: 'English', role: 'Coordinator', hoursContributed: 15, status: 'Completed', rating: 5, certificateIssued: true },
{ id: 'p7', eventId: 3, eventName: 'Cultural Festival - Harmony 2026', teacherId: 9, teacherName: 'Mr. Ajay Mishra', department: 'Hindi', role: 'Mentor', hoursContributed: 12, status: 'Completed', rating: 4, certificateIssued: true },
{ id: 'p8', eventId: 4, eventName: 'Parent-Teacher Meeting', teacherId: 1, teacherName: 'Dr. Ramesh Sharma', department: 'Mathematics', role: 'Coordinator', hoursContributed: 4, status: 'Confirmed', certificateIssued: false },
{ id: 'p9', eventId: 5, eventName: 'Mathematics Olympiad', teacherId: 1, teacherName: 'Dr. Ramesh Sharma', department: 'Mathematics', role: 'Organizer', hoursContributed: 18, status: 'Completed', rating: 5, certificateIssued: true },
{ id: 'p10', eventId: 6, eventName: 'Blood Donation Camp', teacherId: 5, teacherName: 'Mrs. Vidya Kumar', department: 'Social Studies', role: 'Volunteer', hoursContributed: 6, status: 'Completed', rating: 4, certificateIssued: true },
{ id: 'p11', eventId: 7, eventName: 'Computer Science Workshop', teacherId: 4, teacherName: 'Mr. Suresh Patel', department: 'Computer Science', role: 'Speaker', hoursContributed: 20, status: 'Completed', rating: 5, certificateIssued: true, recognitionReceived: 'Expert Speaker Certificate' },
{ id: 'p12', eventId: 8, eventName: 'Annual Day Celebration', teacherId: 3, teacherName: 'Mr. Mohit Singh', department: 'English', role: 'Organizer', hoursContributed: 30, status: 'Confirmed', certificateIssued: false },
{ id: 'p13', eventId: 9, eventName: 'Career Guidance Seminar', teacherId: 8, teacherName: 'Dr. Priya Verma', department: 'Science', role: 'Speaker', hoursContributed: 3, status: 'Completed', rating: 5, certificateIssued: true },
{ id: 'p14', eventId: 10, eventName: 'Republic Day Celebration', teacherId: 7, teacherName: 'Mr. Pradeep Joshi', department: 'Physical Education', role: 'Coordinator', hoursContributed: 4, status: 'Completed', rating: 4, certificateIssued: true },
{ id: 'p15', eventId: 2, eventName: 'Inter-House Sports Competition', teacherId: 5, teacherName: 'Mrs. Vidya Kumar', department: 'Social Studies', role: 'Supervisor', hoursContributed: 8, status: 'Completed', rating: 4, certificateIssued: true }];


// Aggregate teacher data
const aggregateTeacherData = (): Teacher[] => {
  const teacherMap = new Map<number, Teacher>();

  participationsData.forEach((p) => {
    if (!teacherMap.has(p.teacherId)) {
      teacherMap.set(p.teacherId, {
        id: p.teacherId, name: p.teacherName, employeeId: `EMP${String(p.teacherId).padStart(3, '0')}`, department: p.department,
        designation: 'Teacher', email: `${p.teacherName.toLowerCase().replace(/\s+/g, '.')}@school.edu`,
        totalEvents: 0, totalHours: 0, rolesPerformed: [], categoriesParticipated: [], completedEvents: 0, upcomingEvents: 0,
        averageRating: 0, recognitions: [], certificatesEarned: 0
      });
    }

    const teacher = teacherMap.get(p.teacherId)!;
    teacher.totalEvents++;
    teacher.totalHours += p.hoursContributed;
    if (!teacher.rolesPerformed.includes(p.role)) teacher.rolesPerformed.push(p.role);

    const event = eventsData.find((e) => e.id === p.eventId);
    if (event && !teacher.categoriesParticipated.includes(event.category)) teacher.categoriesParticipated.push(event.category);

    if (p.status === 'Completed') teacher.completedEvents++;
    if (p.status === 'Confirmed' || p.status === 'Pending') teacher.upcomingEvents++;
    if (p.certificateIssued) teacher.certificatesEarned++;
    if (p.recognitionReceived) teacher.recognitions.push(p.recognitionReceived);
    if (event) teacher.lastEventDate = event.endDate;
  });

  // Calculate average ratings
  teacherMap.forEach((teacher) => {
    const ratings = participationsData.filter((p) => p.teacherId === teacher.id && p.rating).map((p) => p.rating!);
    teacher.averageRating = ratings.length ? Number((ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1)) : 0;
  });

  return Array.from(teacherMap.values());
};

// ==================== UTILITIES ====================

const getStatusVariant = (status: ParticipationStatus): 'success' | 'warning' | 'destructive' | 'default' => {
  const map: Record<ParticipationStatus, 'success' | 'warning' | 'destructive' | 'default'> = {
    Completed: 'success', Confirmed: 'default', Pending: 'warning', Cancelled: 'destructive', 'No Show': 'destructive'
  };
  return map[status];
};

const formatDate = (date: string) => new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
const formatDateRange = (start: string, end: string) => start === end ? formatDate(start) : `${formatDate(start)} - ${formatDate(end)}`;

// ==================== COMPONENTS ====================

const Modal = ({ isOpen, onClose, title, children, size = 'lg' }: {isOpen: boolean;onClose: () => void;title: string;children: React.ReactNode;size?: 'sm' | 'md' | 'lg' | 'xl';}) => {
  if (!isOpen) return null;
  const sizeClasses = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative bg-white rounded-lg shadow-lg w-full ${sizeClasses[size]} mx-4 max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>);

};

const StatCard = ({ icon: Icon, value, label, color, subtext }: {icon: React.ElementType;value: string | number;label: string;color: string;subtext?: string;}) =>
<div className="border rounded-lg p-4">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${color}`}><Icon className="h-5 w-5" /></div>
      <div className="flex-1">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
        {subtext && <p className="text-xs text-gray-400">{subtext}</p>}
      </div>
    </div>
  </div>;


const TeacherDetailView = ({ teacher, participations, events, onClose }: {teacher: Teacher;participations: Participation[];events: Event[];onClose: () => void;}) => {
  const teacherParticipations = participations.filter((p) => p.teacherId === teacher.id);
  const eventsByCategory = EVENT_CATEGORIES.map((cat) => ({
    category: cat,
    count: teacherParticipations.filter((p) => events.find((e) => e.id === p.eventId)?.category === cat).length
  })).filter((c) => c.count > 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
          {teacher.name.split(' ').map((n) => n[0]).join('')}
        </div>
        <div>
          <h3 className="text-xl font-semibold">{teacher.name}</h3>
          <p className="text-gray-500">{teacher.designation} • {teacher.department}</p>
          <p className="text-sm text-gray-400">{teacher.employeeId}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="border rounded-lg p-3 text-center">
          <Calendar className="h-5 w-5 text-blue-500 mx-auto mb-1" />
          <p className="text-xl font-bold">{teacher.totalEvents}</p>
          <p className="text-xs text-gray-500">Total Events</p>
        </div>
        <div className="border rounded-lg p-3 text-center">
          <Clock className="h-5 w-5 text-green-500 mx-auto mb-1" />
          <p className="text-xl font-bold">{teacher.totalHours}h</p>
          <p className="text-xs text-gray-500">Hours Contributed</p>
        </div>
        <div className="border rounded-lg p-3 text-center">
          <Star className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
          <p className="text-xl font-bold">{teacher.averageRating}/5</p>
          <p className="text-xs text-gray-500">Avg Rating</p>
        </div>
        <div className="border rounded-lg p-3 text-center">
          <Award className="h-5 w-5 text-purple-500 mx-auto mb-1" />
          <p className="text-xl font-bold">{teacher.certificatesEarned}</p>
          <p className="text-xs text-gray-500">Certificates</p>
        </div>
      </div>

      {/* Participation by Category */}
      <div>
        <h4 className="font-medium mb-2">Participation by Category</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {eventsByCategory.map((c) =>
          <div key={c.category} className="p-2 border rounded text-sm">
              <p className="font-medium">{c.category}</p>
              <p className="text-gray-500">{c.count} event(s)</p>
            </div>
          )}
        </div>
      </div>

      {/* Roles Performed */}
      <div>
        <h4 className="font-medium mb-2">Roles Performed</h4>
        <div className="flex flex-wrap gap-1">
          {teacher.rolesPerformed.map((role) => <Badge key={role} variant="default">{role}</Badge>)}
        </div>
      </div>

      {/* Recognitions */}
      {teacher.recognitions.length > 0 &&
      <div>
          <h4 className="font-medium mb-2 flex items-center gap-2"><Trophy className="h-4 w-4 text-yellow-500" />Recognitions</h4>
          <div className="space-y-1">
            {teacher.recognitions.map((r, i) => <div key={i} className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">{r}</div>)}
          </div>
        </div>
      }

      {/* Recent Events */}
      <div>
        <h4 className="font-medium mb-2">Event Participation History ({teacherParticipations.length})</h4>
        <div className="border rounded-lg overflow-hidden max-h-60 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="text-left py-2 px-3 font-medium">Event</th>
                <th className="text-left py-2 px-3 font-medium">Role</th>
                <th className="text-center py-2 px-3 font-medium">Hours</th>
                <th className="text-left py-2 px-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {teacherParticipations.map((p) =>
              <tr key={p.id} className="border-t">
                  <td className="py-2 px-3">{p.eventName}</td>
                  <td className="py-2 px-3"><Badge variant="default">{p.role}</Badge></td>
                  <td className="py-2 px-3 text-center font-mono">{p.hoursContributed}h</td>
                  <td className="py-2 px-3"><Badge variant={getStatusVariant(p.status)}>{p.status}</Badge></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>
    </div>);

};

const EventDetailView = ({ event, participations, onClose }: {event: Event;participations: Participation[];onClose: () => void;}) => {
  const eventParticipations = participations.filter((p) => p.eventId === event.id);
  const totalHours = eventParticipations.reduce((sum, p) => sum + p.hoursContributed, 0);
  const avgRating = eventParticipations.filter((p) => p.rating).length ? (eventParticipations.filter((p) => p.rating).reduce((sum, p) => sum + (p.rating || 0), 0) / eventParticipations.filter((p) => p.rating).length).toFixed(1) : 'N/A';

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold">{event.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="default">{event.category}</Badge>
            <Badge variant={event.status === 'Completed' ? 'success' : event.status === 'Ongoing' ? 'warning' : 'default'}>{event.status}</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg text-sm">
        <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-gray-400" /><span>{formatDateRange(event.startDate, event.endDate)}</span></div>
        <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-gray-400" /><span>{event.duration}</span></div>
        <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-400" /><span>{event.venue}</span></div>
        <div className="flex items-center gap-2"><Users className="h-4 w-4 text-gray-400" /><span>{event.targetAudience}</span></div>
      </div>

      {event.description && <p className="text-sm text-gray-600">{event.description}</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="border rounded-lg p-3 text-center">
          <Users className="h-5 w-5 text-blue-500 mx-auto mb-1" />
          <p className="text-xl font-bold">{eventParticipations.length}</p>
          <p className="text-xs text-gray-500">Staff Involved</p>
        </div>
        <div className="border rounded-lg p-3 text-center">
          <Clock className="h-5 w-5 text-green-500 mx-auto mb-1" />
          <p className="text-xl font-bold">{totalHours}h</p>
          <p className="text-xs text-gray-500">Total Hours</p>
        </div>
        <div className="border rounded-lg p-3 text-center">
          <Target className="h-5 w-5 text-purple-500 mx-auto mb-1" />
          <p className="text-xl font-bold">{event.actualParticipants || 0}/{event.expectedParticipants}</p>
          <p className="text-xs text-gray-500">Participants</p>
        </div>
        <div className="border rounded-lg p-3 text-center">
          <Star className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
          <p className="text-xl font-bold">{avgRating}</p>
          <p className="text-xs text-gray-500">Avg Rating</p>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Teacher Participation</h4>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-2 px-3 font-medium">Teacher</th>
                <th className="text-left py-2 px-3 font-medium">Department</th>
                <th className="text-left py-2 px-3 font-medium">Role</th>
                <th className="text-center py-2 px-3 font-medium">Hours</th>
                <th className="text-center py-2 px-3 font-medium">Rating</th>
                <th className="text-left py-2 px-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {eventParticipations.map((p) =>
              <tr key={p.id} className="border-t">
                  <td className="py-2 px-3 font-medium">{p.teacherName}</td>
                  <td className="py-2 px-3 text-gray-600">{p.department}</td>
                  <td className="py-2 px-3"><Badge variant="default">{p.role}</Badge></td>
                  <td className="py-2 px-3 text-center font-mono">{p.hoursContributed}h</td>
                  <td className="py-2 px-3 text-center">{p.rating ? `${p.rating}/5` : '-'}</td>
                  <td className="py-2 px-3"><Badge variant={getStatusVariant(p.status)}>{p.status}</Badge></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {event.outcome &&
      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm font-medium text-green-800">Outcome</p>
          <p className="text-sm text-green-700">{event.outcome}</p>
        </div>
      }

      <div className="flex justify-end pt-4 border-t">
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>
    </div>);

};

// ==================== MAIN COMPONENT ====================

export function EventParticipationReport() {
  const [teachers] = useState<Teacher[]>(aggregateTeacherData());
  const [participations] = useState<Participation[]>(participationsData);
  const [events] = useState<Event[]>(eventsData);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<FilterDepartment>('All');
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>('All');
  const [roleFilter, setRoleFilter] = useState<FilterRole>('All');
  const [sortKey, setSortKey] = useState<SortKey>('totalEvents');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [modal, setModal] = useState<ModalType>('none');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'teachers' | 'events'>('teachers');

  // Stats
  const stats = useMemo(() => {
    const totalTeachers = teachers.length;
    const totalEvents = events.length;
    const completedEvents = events.filter((e) => e.status === 'Completed').length;
    const totalParticipations = participations.length;
    const totalHours = participations.reduce((sum, p) => sum + p.hoursContributed, 0);
    const avgParticipationPerTeacher = (totalParticipations / totalTeachers).toFixed(1);
    const certificatesIssued = participations.filter((p) => p.certificateIssued).length;
    const topTeacher = teachers.reduce((top, t) => t.totalEvents > top.totalEvents ? t : top, teachers[0]);

    return { totalTeachers, totalEvents, completedEvents, totalParticipations, totalHours, avgParticipationPerTeacher, certificatesIssued, topTeacher };
  }, [teachers, events, participations]);

  // Filtered data
  const filteredTeachers = useMemo(() => {
    let data = [...teachers];
    if (search) data = data.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.employeeId.toLowerCase().includes(search.toLowerCase()));
    if (departmentFilter !== 'All') data = data.filter((t) => t.department === departmentFilter);
    if (categoryFilter !== 'All') data = data.filter((t) => t.categoriesParticipated.includes(categoryFilter));
    if (roleFilter !== 'All') data = data.filter((t) => t.rolesPerformed.includes(roleFilter));

    data.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'teacherName') cmp = a.name.localeCompare(b.name);else
      if (sortKey === 'department') cmp = a.department.localeCompare(b.department);else
      if (sortKey === 'totalEvents') cmp = a.totalEvents - b.totalEvents;else
      if (sortKey === 'totalHours') cmp = a.totalHours - b.totalHours;else
      if (sortKey === 'rating') cmp = a.averageRating - b.averageRating;
      return sortOrder === 'asc' ? cmp : -cmp;
    });
    return data;
  }, [teachers, search, departmentFilter, categoryFilter, roleFilter, sortKey, sortOrder]);

  const handleSort = (key: SortKey) => {if (sortKey === key) setSortOrder((o) => o === 'asc' ? 'desc' : 'asc');else {setSortKey(key);setSortOrder('desc');}};
  const SortIcon = ({ column }: {column: SortKey;}) => sortKey === column ? sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" /> : <ArrowUpDown className="h-3 w-3 opacity-30" />;

  const closeModal = () => {setModal('none');setSelectedTeacher(null);setSelectedEvent(null);};

  const exportData = (format: 'csv' | 'json') => {
    const content = format === 'csv' ?
    [['Teacher', 'Department', 'Total Events', 'Total Hours', 'Avg Rating', 'Certificates'].join(','),
    ...teachers.map((t) => [t.name, t.department, t.totalEvents, t.totalHours, t.averageRating, t.certificatesEarned].join(','))].join('\n') :
    JSON.stringify(teachers, null, 2);
    const blob = new Blob([content], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const a = document.createElement('a');a.href = URL.createObjectURL(blob);a.download = `event_participation.${format}`;a.click();
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Participation Report</h1>
          <p className="text-sm text-gray-500">Track teacher involvement in school events</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setModal('analytics')}><BarChart3 className="h-4 w-4 mr-2" />Analytics</Button>
          <Button variant="outline" size="sm" onClick={() => setModal('export')}><Download className="h-4 w-4 mr-2" />Export</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <StatCard icon={Users} value={stats.totalTeachers} label="Total Teachers" color="bg-blue-100 text-blue-600" />
        <StatCard icon={Calendar} value={stats.totalEvents} label="Total Events" color="bg-green-100 text-green-600" />
        <StatCard icon={CheckCircle} value={stats.completedEvents} label="Completed" color="bg-emerald-100 text-emerald-600" />
        <StatCard icon={Activity} value={stats.totalParticipations} label="Participations" color="bg-purple-100 text-purple-600" />
        <StatCard icon={Clock} value={`${stats.totalHours}h`} label="Total Hours" color="bg-orange-100 text-orange-600" />
        <StatCard icon={Award} value={stats.certificatesIssued} label="Certificates" color="bg-yellow-100 text-yellow-600" />
        <StatCard icon={Trophy} value={stats.topTeacher?.name.split(' ')[0] || 'N/A'} label="Top Contributor" color="bg-pink-100 text-pink-600" subtext={`${stats.topTeacher?.totalEvents || 0} events`} />
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-2">
        <Button variant={viewMode === 'teachers' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('teachers')}><Users className="h-4 w-4 mr-2" />By Teachers</Button>
        <Button variant={viewMode === 'events' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('events')}><Calendar className="h-4 w-4 mr-2" />By Events</Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input type="text" placeholder={`Search ${viewMode}...`} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)}><Filter className="h-4 w-4 mr-2" />Filters</Button>
      </div>

      {showFilters &&
      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Department</label>
            <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value as FilterDepartment)} className="px-3 py-1.5 border rounded text-sm">
              <option value="All">All Departments</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Category</label>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value as FilterCategory)} className="px-3 py-1.5 border rounded text-sm">
              <option value="All">All Categories</option>
              {EVENT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Role</label>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as FilterRole)} className="px-3 py-1.5 border rounded text-sm">
              <option value="All">All Roles</option>
              {PARTICIPATION_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <Button variant="ghost" size="sm" onClick={() => {setDepartmentFilter('All');setCategoryFilter('All');setRoleFilter('All');setSearch('');}}>Clear</Button>
          </div>
        </div>
      }

      {/* Teachers View */}
      {viewMode === 'teachers' &&
      <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('teacherName')}><div className="flex items-center gap-1">Teacher Name <SortIcon column="teacherName" /></div></th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('department')}><div className="flex items-center gap-1">Department <SortIcon column="department" /></div></th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('totalEvents')}><div className="flex items-center justify-center gap-1">Events <SortIcon column="totalEvents" /></div></th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('totalHours')}><div className="flex items-center justify-center gap-1">Hours <SortIcon column="totalHours" /></div></th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Roles</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('rating')}><div className="flex items-center justify-center gap-1">Rating <SortIcon column="rating" /></div></th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Certificates</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.length ? filteredTeachers.map((teacher) =>
              <tr key={teacher.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{teacher.name}</p>
                        <p className="text-xs text-gray-400">{teacher.employeeId}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{teacher.department}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-mono font-medium">{teacher.totalEvents}</span>
                        <span className="text-xs text-gray-400">{teacher.completedEvents} done</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-medium">{teacher.totalHours}h</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {teacher.rolesPerformed.slice(0, 2).map((r) => <Badge key={r} variant="default" className="text-xs">{r}</Badge>)}
                        {teacher.rolesPerformed.length > 2 && <span className="text-xs text-gray-400">+{teacher.rolesPerformed.length - 2}</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="font-medium">{teacher.averageRating || '-'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-mono">{teacher.certificatesEarned}</td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="sm" onClick={() => {setSelectedTeacher(teacher);setModal('viewTeacher');}}><Eye className="h-4 w-4" /></Button>
                    </td>
                  </tr>
              ) :
              <tr><td colSpan={8} className="py-8 text-center text-gray-500">No teachers found matching your criteria</td></tr>
              }
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t text-sm text-gray-500">Showing {filteredTeachers.length} of {teachers.length} teachers</div>
        </Card>
      }

      {/* Events View */}
      {viewMode === 'events' &&
      <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {events.map((event) => {
            const eventParticipations = participations.filter((p) => p.eventId === event.id);
            return (
              <div key={event.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => {setSelectedEvent(event);setModal('viewEvent');}}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{event.name}</h3>
                      <p className="text-xs text-gray-500">{formatDateRange(event.startDate, event.endDate)}</p>
                    </div>
                    <Badge variant={event.status === 'Completed' ? 'success' : event.status === 'Ongoing' ? 'warning' : 'default'}>{event.status}</Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="default">{event.category}</Badge>
                    <span className="text-xs text-gray-400">• {event.venue}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 bg-gray-50 rounded">
                      <p className="font-bold text-blue-600">{eventParticipations.length}</p>
                      <p className="text-gray-500">Staff</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <p className="font-bold text-green-600">{eventParticipations.reduce((sum, p) => sum + p.hoursContributed, 0)}h</p>
                      <p className="text-gray-500">Hours</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <p className="font-bold text-purple-600">{event.actualParticipants || 0}</p>
                      <p className="text-gray-500">Participants</p>
                    </div>
                  </div>
                </div>);

          })}
          </div>
        </Card>
      }

      {/* Modals */}
      <Modal isOpen={modal === 'viewTeacher'} onClose={closeModal} title="Teacher Participation Details" size="xl">
        {selectedTeacher && <TeacherDetailView teacher={selectedTeacher} participations={participations} events={events} onClose={closeModal} />}
      </Modal>

      <Modal isOpen={modal === 'viewEvent'} onClose={closeModal} title="Event Details" size="lg">
        {selectedEvent && <EventDetailView event={selectedEvent} participations={participations} onClose={closeModal} />}
      </Modal>

      <Modal isOpen={modal === 'export'} onClose={closeModal} title="Export Report" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Export participation data for {teachers.length} teachers</p>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={() => {exportData('csv');closeModal();}}><FileText className="h-4 w-4 mr-2" />Export as CSV</Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => {exportData('json');closeModal();}}><FileText className="h-4 w-4 mr-2" />Export as JSON</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={modal === 'analytics'} onClose={closeModal} title="Participation Analytics" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {EVENT_CATEGORIES.map((cat) => {
              const catEvents = events.filter((e) => e.category === cat);
              const catParticipations = participations.filter((p) => catEvents.some((e) => e.id === p.eventId));
              return (
                <div key={cat} className="p-4 border rounded-lg">
                  <p className="text-sm font-medium">{cat}</p>
                  <p className="text-2xl font-bold">{catEvents.length}</p>
                  <p className="text-xs text-gray-500">{catParticipations.length} participations</p>
                </div>);

            })}
          </div>
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-3">Top Contributors</h4>
            <div className="space-y-2">
              {teachers.slice(0, 5).map((t, i) =>
              <div key={t.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">{i + 1}</span>
                    <div>
                      <p className="font-medium text-sm">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">{t.totalEvents} events</p>
                    <p className="text-xs text-gray-500">{t.totalHours}h</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>);

}