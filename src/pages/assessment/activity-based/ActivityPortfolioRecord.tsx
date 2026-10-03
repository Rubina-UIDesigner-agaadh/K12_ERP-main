import React, { useMemo, useState, Component } from 'react';
import {
  Upload,
  Search,
  Image,
  FileText,
  Award,
  Camera,
  Plus,
  X,
  Eye,
  Trash2,
  Download,
  Filter,
  Grid,
  List,
  Tag,
  Calendar,
  CheckCircle,
  Clock,
  Paperclip,
  Star,
  Users,
  BookOpen,
  Loader2,
  Save,
  ExternalLink,
  FolderOpen } from
'lucide-react';
interface PortfolioItem {
  id: string;
  studentId: string;
  type: 'Photo' | 'Certificate' | 'Activity Record' | 'Reflection Note';
  title: string;
  description: string;
  date: string;
  eventTag: string;
  module: 'Event' | 'Clubs' | 'Sports' | 'Academic' | 'General';
  status: 'Uploaded' | 'Pending Review' | 'Approved';
  fileSize?: string;
  thumbnailColor: string;
}
interface Student {
  id: string;
  rollNo: string;
  name: string;
  class: string;
  section: string;
  portfolioCount: number;
}
const mockStudents: Student[] = [
{
  id: 's1',
  rollNo: '01',
  name: 'Advait Krishnan',
  class: '8',
  section: 'A',
  portfolioCount: 7
},
{
  id: 's2',
  rollNo: '02',
  name: 'Ananya Sharma',
  class: '8',
  section: 'A',
  portfolioCount: 5
},
{
  id: 's3',
  rollNo: '03',
  name: 'Arjun Patel',
  class: '8',
  section: 'A',
  portfolioCount: 3
},
{
  id: 's4',
  rollNo: '04',
  name: 'Divya Nair',
  class: '8',
  section: 'A',
  portfolioCount: 8
},
{
  id: 's5',
  rollNo: '05',
  name: 'Ishaan Mehta',
  class: '8',
  section: 'A',
  portfolioCount: 4
},
{
  id: 's6',
  rollNo: '06',
  name: 'Kavitha Pillai',
  class: '8',
  section: 'A',
  portfolioCount: 6
},
{
  id: 's7',
  rollNo: '07',
  name: 'Kiran Reddy',
  class: '8',
  section: 'A',
  portfolioCount: 2
},
{
  id: 's8',
  rollNo: '08',
  name: 'Meera Iyer',
  class: '8',
  section: 'A',
  portfolioCount: 9
},
{
  id: 's9',
  rollNo: '09',
  name: 'Neha Gupta',
  class: '8',
  section: 'A',
  portfolioCount: 4
},
{
  id: 's10',
  rollNo: '10',
  name: 'Om Desai',
  class: '8',
  section: 'A',
  portfolioCount: 3
}];

const mockPortfolioItems: PortfolioItem[] = [
{
  id: 'p1',
  studentId: 's1',
  type: 'Photo',
  title: 'Science Fair Project Display',
  description:
  'Photographs from the Annual Science Fair 2024 where student presented a working model of solar energy.',
  date: '2024-11-15',
  eventTag: 'Science Fair 2024',
  module: 'Event',
  status: 'Approved',
  fileSize: '2.4 MB',
  thumbnailColor: 'bg-blue-200'
},
{
  id: 'p2',
  studentId: 's1',
  type: 'Certificate',
  title: 'First Prize — Inter-School Debate',
  description:
  'Certificate of achievement for winning First Prize in the Inter-School Debate Competition.',
  date: '2024-10-20',
  eventTag: 'Literary Week',
  module: 'Clubs',
  status: 'Approved',
  fileSize: '1.1 MB',
  thumbnailColor: 'bg-yellow-200'
},
{
  id: 'p3',
  studentId: 's1',
  type: 'Activity Record',
  title: 'Eco Club Monthly Activity Log',
  description:
  'Record of participation in Eco Club activities including tree plantation drive and waste management workshop.',
  date: '2024-12-01',
  eventTag: 'Eco Club',
  module: 'Clubs',
  status: 'Approved',
  fileSize: '0.8 MB',
  thumbnailColor: 'bg-green-200'
},
{
  id: 'p4',
  studentId: 's1',
  type: 'Reflection Note',
  title: 'Community Service Reflection',
  description:
  'Personal reflection on the community service visit to the local orphanage and lessons learned about empathy.',
  date: '2024-11-28',
  eventTag: 'Community Service',
  module: 'General',
  status: 'Pending Review',
  thumbnailColor: 'bg-purple-200'
},
{
  id: 'p5',
  studentId: 's1',
  type: 'Photo',
  title: 'Sports Day Athletics',
  description:
  'Action photos from Sports Day 2024 — 100m sprint and relay race participation.',
  date: '2024-09-15',
  eventTag: 'Sports Day 2024',
  module: 'Sports',
  status: 'Approved',
  fileSize: '3.2 MB',
  thumbnailColor: 'bg-orange-200'
},
{
  id: 'p6',
  studentId: 's1',
  type: 'Certificate',
  title: 'Yoga Excellence Award',
  description:
  'Certificate for outstanding performance in the Annual Yoga Competition.',
  date: '2024-08-10',
  eventTag: 'Yoga Competition',
  module: 'Sports',
  status: 'Approved',
  fileSize: '0.9 MB',
  thumbnailColor: 'bg-teal-200'
},
{
  id: 'p7',
  studentId: 's1',
  type: 'Activity Record',
  title: 'Literary Club Participation',
  description:
  'Record of participation in Literary Club activities — story writing, poetry recitation, and book reviews.',
  date: '2024-12-10',
  eventTag: 'Literary Club',
  module: 'Clubs',
  status: 'Pending Review',
  thumbnailColor: 'bg-indigo-200'
},
{
  id: 'p8',
  studentId: 's2',
  type: 'Photo',
  title: 'Art Exhibition Artwork',
  description:
  'Photographs of artwork displayed at the Annual Art Exhibition.',
  date: '2024-11-05',
  eventTag: 'Art Exhibition',
  module: 'Event',
  status: 'Approved',
  fileSize: '2.1 MB',
  thumbnailColor: 'bg-pink-200'
},
{
  id: 'p9',
  studentId: 's2',
  type: 'Certificate',
  title: 'Dance Competition — Second Prize',
  description:
  'Certificate for Second Prize in Classical Dance category at the Cultural Fest.',
  date: '2024-10-12',
  eventTag: 'Cultural Fest',
  module: 'Event',
  status: 'Approved',
  fileSize: '1.0 MB',
  thumbnailColor: 'bg-rose-200'
},
{
  id: 'p10',
  studentId: 's4',
  type: 'Certificate',
  title: 'Mathematics Olympiad — State Level',
  description:
  'Certificate of participation in State Level Mathematics Olympiad.',
  date: '2024-09-20',
  eventTag: 'Math Olympiad',
  module: 'Academic',
  status: 'Approved',
  fileSize: '1.2 MB',
  thumbnailColor: 'bg-cyan-200'
}];

const EVENT_TAGS = [
'Science Fair 2024',
'Literary Week',
'Eco Club',
'Community Service',
'Sports Day 2024',
'Yoga Competition',
'Art Exhibition',
'Cultural Fest',
'Math Olympiad',
'Literary Club'];

const typeIcons: Record<
  string,
  ComponentType<{
    className?: string;
  }>> =
{
  Photo: Camera,
  Certificate: Award,
  'Activity Record': FileText,
  'Reflection Note': BookOpen
};
const typeColors: Record<string, string> = {
  Photo: 'bg-blue-100 text-blue-700',
  Certificate: 'bg-yellow-100 text-yellow-700',
  'Activity Record': 'bg-green-100 text-green-700',
  'Reflection Note': 'bg-purple-100 text-purple-700'
};
const statusColors: Record<string, string> = {
  Approved: 'bg-green-100 text-green-700',
  'Pending Review': 'bg-yellow-100 text-yellow-700',
  Uploaded: 'bg-blue-100 text-blue-700'
};
export function ActivityPortfolioRecord() {
  const [selectedStudentId, setSelectedStudentId] = useState('s1');
  const [portfolioItems, setPortfolioItems] =
  useState<PortfolioItem[]>(mockPortfolioItems);
  const [studentSearch, setStudentSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterModule, setFilterModule] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    type: 'Photo',
    title: '',
    description: '',
    date: '',
    eventTag: '',
    module: 'General',
    reflectionNote: ''
  });
  const selectedStudent = mockStudents.find((s) => s.id === selectedStudentId)!;
  const filteredStudents = mockStudents.filter(
    (s) =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.rollNo.includes(studentSearch)
  );
  const studentItems = useMemo(() => {
    let items = portfolioItems.filter((p) => p.studentId === selectedStudentId);
    if (filterType) items = items.filter((p) => p.type === filterType);
    if (filterModule) items = items.filter((p) => p.module === filterModule);
    return items;
  }, [portfolioItems, selectedStudentId, filterType, filterModule]);
  const typeCounts = useMemo(() => {
    const items = portfolioItems.filter(
      (p) => p.studentId === selectedStudentId
    );
    return {
      Photo: items.filter((p) => p.type === 'Photo').length,
      Certificate: items.filter((p) => p.type === 'Certificate').length,
      'Activity Record': items.filter((p) => p.type === 'Activity Record').
      length,
      'Reflection Note': items.filter((p) => p.type === 'Reflection Note').
      length
    };
  }, [portfolioItems, selectedStudentId]);
  const totalUploads = portfolioItems.length;
  const handleUpload = async () => {
    if (!form.title) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    const newItem: PortfolioItem = {
      id: `p${Date.now()}`,
      studentId: selectedStudentId,
      type: form.type as any,
      title: form.title,
      description: form.description,
      date: form.date || new Date().toISOString().split('T')[0],
      eventTag: form.eventTag,
      module: form.module as any,
      status: 'Pending Review',
      thumbnailColor: 'bg-gray-200'
    };
    setPortfolioItems((prev) => [...prev, newItem]);
    setSaving(false);
    setShowUploadModal(false);
    setForm({
      type: 'Photo',
      title: '',
      description: '',
      date: '',
      eventTag: '',
      module: 'General',
      reflectionNote: ''
    });
  };
  const handleDelete = (id: string) => {
    if (confirm('Delete this portfolio item?'))
    setPortfolioItems((prev) => prev.filter((p) => p.id !== id));
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl text-white shadow-lg">
            <FolderOpen className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Portfolio / Evidence Upload
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage student portfolio items — photos, certificates, activity
              records, and reflections
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500 bg-white border border-gray-200 rounded-lg px-3 py-2">
            <span className="font-semibold text-gray-900">{totalUploads}</span>{' '}
            total uploads
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium">

            <Upload className="w-4 h-4" /> Upload Evidence
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Student List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />

              </div>
            </div>
            <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
              {filteredStudents.map((student) =>
              <button
                key={student.id}
                onClick={() => setSelectedStudentId(student.id)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${selectedStudentId === student.id ? 'bg-purple-50 border-l-4 border-l-purple-500' : 'hover:bg-gray-50'}`}>

                  <div className="flex items-center gap-3">
                    <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${selectedStudentId === student.id ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>

                      {student.rollNo}
                    </div>
                    <div>
                      <p
                      className={`text-sm font-medium ${selectedStudentId === student.id ? 'text-purple-700' : 'text-gray-900'}`}>

                        {student.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        Class {student.class}-{student.section}
                      </p>
                    </div>
                  </div>
                  <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${selectedStudentId === student.id ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>

                    {
                  portfolioItems.filter((p) => p.studentId === student.id).
                  length
                  }
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Portfolio Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Student Header */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedStudent.name}
                </h2>
                <p className="text-sm text-gray-500">
                  Class {selectedStudent.class}-{selectedStudent.section} · Roll
                  No. {selectedStudent.rollNo}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:bg-gray-100'}`}>

                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:bg-gray-100'}`}>

                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
            {/* Type Stats */}
            <div className="grid grid-cols-4 gap-3">
              {Object.entries(typeCounts).map(([type, count]) => {
                const Icon = typeIcons[type];
                return (
                  <button
                    key={type}
                    onClick={() =>
                    setFilterType(filterType === type ? '' : type)
                    }
                    className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${filterType === type ? 'border-purple-300 bg-purple-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}>

                    <Icon
                      className={`w-4 h-4 ${filterType === type ? 'text-purple-600' : 'text-gray-500'}`} />

                    <div className="text-left">
                      <p className="text-xs text-gray-500">{type}</p>
                      <p
                        className={`text-sm font-bold ${filterType === type ? 'text-purple-700' : 'text-gray-900'}`}>

                        {count}
                      </p>
                    </div>
                  </button>);

              })}
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <select
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500">

              <option value="">All Modules</option>
              <option value="Event">Event Module</option>
              <option value="Clubs">Clubs Module</option>
              <option value="Sports">Sports Module</option>
              <option value="Academic">Academic</option>
              <option value="General">General</option>
            </select>
            {(filterType || filterModule) &&
            <button
              onClick={() => {
                setFilterType('');
                setFilterModule('');
              }}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 hover:text-gray-700">

                <X className="w-4 h-4" /> Clear
              </button>
            }
            <span className="text-sm text-gray-500 ml-auto">
              {studentItems.length} item(s)
            </span>
          </div>

          {/* Grid View */}
          {viewMode === 'grid' &&
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {studentItems.map((item) => {
              const Icon = typeIcons[item.type];
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">

                    <div
                    className={`h-28 ${item.thumbnailColor} flex items-center justify-center`}>

                      <Icon className="w-12 h-12 text-white opacity-60" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[item.type]}`}>

                          {item.type}
                        </span>
                        <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[item.status]}`}>

                          {item.status}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {item.date}
                        </span>
                        {item.eventTag &&
                      <span className="flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {item.eventTag}
                          </span>
                      }
                      </div>
                      <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100">
                        <button className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-gray-600 hover:bg-gray-50 rounded-lg">
                          <Eye className="w-3 h-3" /> View
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-gray-600 hover:bg-gray-50 rounded-lg">
                          <Download className="w-3 h-3" /> Download
                        </button>
                        <button
                        onClick={() => handleDelete(item.id)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-red-500 hover:bg-red-50 rounded-lg">

                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>);

            })}
            </div>
          }

          {/* List View */}
          {viewMode === 'list' &&
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Title
                    </th>
                    <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                      Type
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Event Tag
                    </th>
                    <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                      Date
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
                  {studentItems.map((item) => {
                  const Icon = typeIcons[item.type];
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div
                            className={`w-8 h-8 rounded-lg ${item.thumbnailColor} flex items-center justify-center`}>

                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">
                                {item.title}
                              </p>
                              <p className="text-xs text-gray-400 line-clamp-1">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[item.type]}`}>

                            {item.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {item.eventTag || '—'}
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-gray-600">
                          {item.date}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[item.status]}`}>

                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600">
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600">

                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>);

                })}
                </tbody>
              </table>
              {studentItems.length === 0 &&
            <div className="p-12 text-center">
                  <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No portfolio items found</p>
                </div>
            }
            </div>
          }
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal &&
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                Upload Portfolio Evidence
              </h2>
              <button
              onClick={() => setShowUploadModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg">

                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Evidence Type
                  </label>
                  <select
                  value={form.type}
                  onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    type: e.target.value
                  }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500">

                    <option>Photo</option>
                    <option>Certificate</option>
                    <option>Activity Record</option>
                    <option>Reflection Note</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Module
                  </label>
                  <select
                  value={form.module}
                  onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    module: e.target.value
                  }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500">

                    <option>Event</option>
                    <option>Clubs</option>
                    <option>Sports</option>
                    <option>Academic</option>
                    <option>General</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                value={form.title}
                onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  title: e.target.value
                }))
                }
                placeholder="e.g. Science Fair Project Display"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                value={form.description}
                onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  description: e.target.value
                }))
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500" />

              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    date: e.target.value
                  }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />

                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Tag
                  </label>
                  <select
                  value={form.eventTag}
                  onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    eventTag: e.target.value
                  }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500">

                    <option value="">Select Event</option>
                    {EVENT_TAGS.map((t) =>
                  <option key={t} value={t}>
                        {t}
                      </option>
                  )}
                  </select>
                </div>
              </div>
              {form.type === 'Reflection Note' &&
            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student Reflection Notes
                  </label>
                  <textarea
                value={form.reflectionNote}
                onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  reflectionNote: e.target.value
                }))
                }
                rows={4}
                placeholder="Student's personal reflection on the activity..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500" />

                </div>
            }
              {form.type !== 'Reflection Note' &&
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload or drag & drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PDF, JPG, PNG up to 10MB
                  </p>
                </div>
            }
            </div>
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
              onClick={() => setShowUploadModal(false)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">

                Cancel
              </button>
              <button
              onClick={handleUpload}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50">

                {saving ?
              <Loader2 className="w-4 h-4 animate-spin" /> :

              <Upload className="w-4 h-4" />
              }
                Upload Evidence
              </button>
            </div>
          </div>
        </div>
      }
    </div>);

}