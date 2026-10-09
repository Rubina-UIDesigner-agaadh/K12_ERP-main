import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { MultiSelect } from '../../../components/ui/MultiSelect';
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
  Grid,
  List,
  Tag,
  Calendar,
  CheckCircle,
  Loader2,
  FolderOpen,
  Pencil,
  Music,
  BookOpen,
  Star,
  Users,
  Filter } from
'lucide-react';
type PortfolioCategory =
'Art Work' |
'Writing Practice' |
'Project Work' |
'Event Participation' |
'General';
type ItemStatus = 'Uploaded' | 'Reviewed' | 'Approved';
interface PortfolioItem {
  id: string;
  studentId: string;
  category: PortfolioCategory;
  title: string;
  description: string;
  date: string;
  teacherComment: string;
  status: ItemStatus;
  thumbnailColor: string;
  activityTag: string;
}
interface Student {
  id: string;
  name: string;
  rollNo: string;
  class: string;
  initials: string;
}
const CATEGORY_ICONS: Record<PortfolioCategory, any> = {
  'Art Work': Pencil,
  'Writing Practice': FileText,
  'Project Work': Star,
  'Event Participation': Award,
  General: FolderOpen
};
const CATEGORY_COLORS: Record<PortfolioCategory, string> = {
  'Art Work': 'bg-pink-100 text-pink-700',
  'Writing Practice': 'bg-blue-100 text-blue-700',
  'Project Work': 'bg-purple-100 text-purple-700',
  'Event Participation': 'bg-yellow-100 text-yellow-700',
  General: 'bg-gray-100 text-gray-700'
};
const THUMBNAIL_COLORS = [
'bg-pink-200',
'bg-blue-200',
'bg-purple-200',
'bg-yellow-200',
'bg-green-200',
'bg-orange-200',
'bg-teal-200'];

const mockStudents: Student[] = [
{
  id: 's1',
  name: 'Aarav Kumar',
  rollNo: '01',
  class: 'Nursery A',
  initials: 'AK'
},
{
  id: 's2',
  name: 'Diya Sharma',
  rollNo: '02',
  class: 'Nursery A',
  initials: 'DS'
},
{
  id: 's3',
  name: 'Rohan Patel',
  rollNo: '03',
  class: 'Nursery A',
  initials: 'RP'
},
{
  id: 's4',
  name: 'Ananya Reddy',
  rollNo: '04',
  class: 'Nursery A',
  initials: 'AR'
},
{
  id: 's5',
  name: 'Kabir Singh',
  rollNo: '05',
  class: 'Nursery A',
  initials: 'KS'
}];

const mockItems: PortfolioItem[] = [
{
  id: 'p1',
  studentId: 's1',
  category: 'Art Work',
  title: 'Clay Animal Models',
  description:
  'Student created clay models of farm animals during art activity.',
  date: '2024-11-15',
  teacherComment: 'Excellent creativity and fine motor skills shown.',
  status: 'Approved',
  thumbnailColor: 'bg-pink-200',
  activityTag: 'Clay Modeling'
},
{
  id: 'p2',
  studentId: 's1',
  category: 'Event Participation',
  title: 'Annual Day Performance',
  description: 'Participated in rhymes recitation on Annual Day.',
  date: '2024-12-10',
  teacherComment: 'Performed confidently on stage.',
  status: 'Approved',
  thumbnailColor: 'bg-yellow-200',
  activityTag: 'Annual Day 2024'
},
{
  id: 'p3',
  studentId: 's1',
  category: 'Writing Practice',
  title: 'Letter Tracing Worksheet',
  description: 'Completed letter tracing A-E with good pencil control.',
  date: '2025-01-08',
  teacherComment: 'Good improvement in pencil grip.',
  status: 'Reviewed',
  thumbnailColor: 'bg-blue-200',
  activityTag: 'Writing Practice'
},
{
  id: 'p4',
  studentId: 's1',
  category: 'Project Work',
  title: 'My Family Project',
  description:
  'Drew and described family members for the "My Family" project.',
  date: '2025-01-20',
  teacherComment: 'Showed good understanding of family relationships.',
  status: 'Uploaded',
  thumbnailColor: 'bg-purple-200',
  activityTag: 'Family Project'
},
{
  id: 'p5',
  studentId: 's1',
  category: 'Art Work',
  title: 'Color Sorting Activity',
  description: 'Sorted colored objects and created a color collage.',
  date: '2025-02-05',
  teacherComment: 'Correctly identified all primary and secondary colors.',
  status: 'Approved',
  thumbnailColor: 'bg-green-200',
  activityTag: 'Color Activity'
},
{
  id: 'p6',
  studentId: 's2',
  category: 'Art Work',
  title: 'Finger Painting',
  description: 'Created a nature scene using finger painting technique.',
  date: '2024-11-20',
  teacherComment: 'Beautiful use of colors and imagination.',
  status: 'Approved',
  thumbnailColor: 'bg-pink-200',
  activityTag: 'Art Activity'
},
{
  id: 'p7',
  studentId: 's2',
  category: 'Event Participation',
  title: 'Sports Day Race',
  description: 'Participated in the 30m sprint on Sports Day.',
  date: '2024-12-15',
  teacherComment: 'Showed great enthusiasm and sportsmanship.',
  status: 'Approved',
  thumbnailColor: 'bg-orange-200',
  activityTag: 'Sports Day 2024'
},
{
  id: 'p8',
  studentId: 's3',
  category: 'Project Work',
  title: 'Shape Collage',
  description: 'Created a collage using different geometric shapes.',
  date: '2025-01-10',
  teacherComment: 'Correctly identified and used all shapes.',
  status: 'Reviewed',
  thumbnailColor: 'bg-teal-200',
  activityTag: 'Shape Activity'
}];

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
}];

export function PreschoolDevelopmentProgressTracker() {
  const [selectedStudentId, setSelectedStudentId] = useState('s1');
  const [portfolioItems, setPortfolioItems] =
  useState<PortfolioItem[]>(mockItems);
  const [studentSearch, setStudentSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<PortfolioCategory | ''>(
    ''
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [form, setForm] = useState({
    category: 'Art Work' as PortfolioCategory,
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    activityTag: '',
    teacherComment: ''
  });
  const selectedStudent = mockStudents.find((s) => s.id === selectedStudentId)!;
  const filteredStudents = mockStudents.filter(
    (s) =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.rollNo.includes(studentSearch)
  );
  const studentItems = useMemo(() => {
    let items = portfolioItems.filter((p) => p.studentId === selectedStudentId);
    if (filterCategory)
    items = items.filter((p) => p.category === filterCategory);
    return items;
  }, [portfolioItems, selectedStudentId, filterCategory]);
  const categoryCounts = useMemo(() => {
    const items = portfolioItems.filter(
      (p) => p.studentId === selectedStudentId
    );
    const counts: Record<string, number> = {};
    (
    [
    'Art Work',
    'Writing Practice',
    'Project Work',
    'Event Participation',
    'General'] as
    PortfolioCategory[]).
    forEach((cat) => {
      counts[cat] = items.filter((p) => p.category === cat).length;
    });
    return counts;
  }, [portfolioItems, selectedStudentId]);
  const handleUpload = async () => {
    if (!form.title) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    const newItem: PortfolioItem = {
      id: `p${Date.now()}`,
      studentId: selectedStudentId,
      category: form.category,
      title: form.title,
      description: form.description,
      date: form.date,
      teacherComment: form.teacherComment,
      activityTag: form.activityTag,
      status: 'Uploaded',
      thumbnailColor:
      THUMBNAIL_COLORS[Math.floor(Math.random() * THUMBNAIL_COLORS.length)]
    };
    setPortfolioItems((prev) => [...prev, newItem]);
    setSaving(false);
    setShowUploadModal(false);
    setForm({
      category: 'Art Work',
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      activityTag: '',
      teacherComment: ''
    });
  };
  const handleDelete = (id: string) => {
    if (confirm('Delete this portfolio item?'))
    setPortfolioItems((prev) => prev.filter((p) => p.id !== id));
  };
  const statusColors: Record<ItemStatus, string> = {
    Uploaded: 'bg-blue-100 text-blue-700',
    Reviewed: 'bg-yellow-100 text-yellow-700',
    Approved: 'bg-green-100 text-green-700'
  };
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Portfolio Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Digital record of child's work — art, writing, projects, and events
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500 bg-white border border-gray-200 rounded-lg px-3 py-2">
            <span className="font-semibold text-gray-900">
              {portfolioItems.length}
            </span>{' '}
            total items
          </div>
          <Button variant="primary" onClick={() => setShowUploadModal(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Add Portfolio Item
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MultiSelect
            label="Branch"
            options={BRANCH_OPTIONS}
            value={selectedBranches}
            onChange={setSelectedBranches}
            placeholder="All Branches" />

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Class
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Nursery</option>
              <option>Jr KG</option>
              <option>Sr KG</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Section
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>A</option>
              <option>B</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Academic Year
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>2024-25</option>
              <option>2023-24</option>
            </select>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Student List */}
        <div className="lg:col-span-1">
          <Card className="overflow-hidden">
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {filteredStudents.map((student) => {
                const count = portfolioItems.filter(
                  (p) => p.studentId === student.id
                ).length;
                return (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudentId(student.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${selectedStudentId === student.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-gray-50'}`}>

                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${selectedStudentId === student.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>

                        {student.initials}
                      </div>
                      <div>
                        <p
                          className={`text-sm font-medium ${selectedStudentId === student.id ? 'text-blue-700' : 'text-gray-900'}`}>

                          {student.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {student.class} · Roll {student.rollNo}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${selectedStudentId === student.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>

                      {count}
                    </span>
                  </button>);

              })}
            </div>
          </Card>
        </div>

        {/* Portfolio Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Student Header & Category Stats */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  {selectedStudent.initials}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedStudent.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedStudent.class} · Roll No. {selectedStudent.rollNo}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}>

                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}>

                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterCategory('')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${filterCategory === '' ? 'border-gray-800 bg-gray-100' : 'border-gray-200 hover:bg-gray-50'}`}>

                <FolderOpen className="w-4 h-4" />
                All (
                {
                portfolioItems.filter(
                  (p) => p.studentId === selectedStudentId
                ).length
                }
                )
              </button>
              {(Object.keys(CATEGORY_ICONS) as PortfolioCategory[]).map(
                (cat) => {
                  const Icon = CATEGORY_ICONS[cat];
                  return (
                    <button
                      key={cat}
                      onClick={() =>
                      setFilterCategory(filterCategory === cat ? '' : cat)
                      }
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${filterCategory === cat ? 'border-gray-800 shadow-sm' : 'border-transparent'} ${CATEGORY_COLORS[cat]}`}>

                      <Icon className="w-4 h-4" />
                      {cat} ({categoryCounts[cat]})
                    </button>);

                }
              )}
            </div>
          </Card>

          {/* Grid View */}
          {viewMode === 'grid' &&
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {studentItems.map((item) => {
              const Icon = CATEGORY_ICONS[item.category];
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">

                    <div
                    className={`h-24 ${item.thumbnailColor} flex items-center justify-center`}>

                      <Icon className="w-10 h-10 text-white opacity-60" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[item.category]}`}>

                          {item.category}
                        </span>
                        <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[item.status]}`}>

                          {item.status}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                        {item.description}
                      </p>
                      {item.teacherComment &&
                    <div className="bg-blue-50 rounded-lg p-2 mb-2">
                          <p className="text-xs text-blue-700 italic">
                            "{item.teacherComment}"
                          </p>
                        </div>
                    }
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {item.date}
                        </span>
                        {item.activityTag &&
                      <span className="flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {item.activityTag}
                          </span>
                      }
                      </div>
                      <div className="flex items-center gap-1 pt-2 border-t border-gray-100">
                        <button className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-gray-600 hover:bg-gray-50 rounded-lg">
                          <Eye className="w-3 h-3" />
                          View
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-gray-600 hover:bg-gray-50 rounded-lg">
                          <Download className="w-3 h-3" />
                          Download
                        </button>
                        <button
                        onClick={() => handleDelete(item.id)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-red-500 hover:bg-red-50 rounded-lg">

                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>);

            })}
              {studentItems.length === 0 &&
            <div className="col-span-full p-12 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">
                    No portfolio items found
                  </p>
                  <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => setShowUploadModal(true)}>

                    <Plus className="w-4 h-4 mr-2" />
                    Add First Item
                  </Button>
                </div>
            }
            </div>
          }

          {/* List View */}
          {viewMode === 'list' &&
          <Card className="overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Item
                    </th>
                    <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                      Category
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Activity Tag
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
                  const Icon = CATEGORY_ICONS[item.category];
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
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[item.category]}`}>

                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {item.activityTag || '—'}
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
            </Card>
          }
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal &&
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                Add Portfolio Item
              </h2>
              <button
              onClick={() => setShowUploadModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg">

                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Portfolio Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(CATEGORY_ICONS) as PortfolioCategory[]).map(
                  (cat) => {
                    const Icon = CATEGORY_ICONS[cat];
                    return (
                      <button
                        key={cat}
                        onClick={() =>
                        setForm((p) => ({
                          ...p,
                          category: cat
                        }))
                        }
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 text-xs font-medium transition-all ${form.category === cat ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>

                          <Icon className="w-5 h-5" />
                          {cat}
                        </button>);

                  }
                )}
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
                placeholder="e.g., Clay Animal Models"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

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
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>
              <div className="grid grid-cols-2 gap-3">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Activity Tag
                  </label>
                  <input
                  value={form.activityTag}
                  onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    activityTag: e.target.value
                  }))
                  }
                  placeholder="e.g., Annual Day"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teacher Comment
                </label>
                <textarea
                value={form.teacherComment}
                onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  teacherComment: e.target.value
                }))
                }
                rows={2}
                placeholder="Observation or feedback..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <Upload className="w-7 h-7 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Click to upload drawing, photo, or document
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  JPG, PNG, PDF up to 10MB
                </p>
              </div>
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
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">

                {saving ?
              <Loader2 className="w-4 h-4 animate-spin" /> :

              <Upload className="w-4 h-4" />
              }
                Add to Portfolio
              </button>
            </div>
          </div>
        </div>
      }
    </div>);

}