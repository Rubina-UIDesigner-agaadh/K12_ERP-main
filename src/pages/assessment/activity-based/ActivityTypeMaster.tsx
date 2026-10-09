import React, { useMemo, useState, Fragment, Component } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Save,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Info,
  Layers,
  BookOpen,
  Heart,
  Shield,
  Activity,
  Users,
  Star,
  Globe,
  Award,
  Filter,
  Download,
  Upload,
  MoreVertical,
  Eye,
  Copy,
  RefreshCw,
  Settings,
  Tag,
  Calendar,
  BarChart3,
  Loader2,
  AlertTriangle,
  Check } from
'lucide-react';
interface CoScholasticArea {
  id: string;
  code: string;
  name: string;
  description: string;
  applicableClasses: string[];
  termMapping: string[];
  gradingType: 'Grade' | 'Scale' | 'Remarks Based';
  status: 'Active' | 'Inactive';
  indicatorCount: number;
  createdAt: string;
  icon: string;
  color: string;
}
const ALL_CLASSES = [
'1',
'2',
'3',
'4',
'5',
'6',
'7',
'8',
'9',
'10',
'11',
'12'];

const ALL_TERMS = ['Term 1', 'Term 2', 'Annual', '2024-25'];
const AREA_ICONS: Record<
  string,
  ComponentType<{
    className?: string;
  }>> =
{
  LS001: Heart,
  WE001: Settings,
  VPA001: Star,
  AV001: Shield,
  HPE001: Activity,
  DIS001: CheckCircle,
  CAP001: Users,
  SR001: Globe
};
const AREA_COLORS: Record<string, string> = {
  LS001: 'indigo',
  WE001: 'amber',
  VPA001: 'purple',
  AV001: 'teal',
  HPE001: 'green',
  DIS001: 'blue',
  CAP001: 'orange',
  SR001: 'rose'
};
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
const mockAreas: CoScholasticArea[] = [
{
  id: '1',
  code: 'LS001',
  name: 'Life Skills',
  color: 'indigo',
  icon: 'LS001',
  description:
  'Assesses essential life competencies including problem solving, critical thinking, decision making, and communication skills.',
  applicableClasses: ['6', '7', '8', '9', '10'],
  termMapping: ['Term 1', 'Term 2', '2024-25'],
  gradingType: 'Grade',
  status: 'Active',
  indicatorCount: 4,
  createdAt: '2024-04-01'
},
{
  id: '2',
  code: 'WE001',
  name: 'Work Education',
  color: 'amber',
  icon: 'WE001',
  description:
  'Evaluates practical skills, project work, and vocational activities that prepare students for real-world challenges.',
  applicableClasses: ['6', '7', '8', '9', '10'],
  termMapping: ['Term 1', 'Term 2', '2024-25'],
  gradingType: 'Grade',
  status: 'Active',
  indicatorCount: 3,
  createdAt: '2024-04-01'
},
{
  id: '3',
  code: 'VPA001',
  name: 'Visual & Performing Arts',
  color: 'purple',
  icon: 'VPA001',
  description:
  'Covers drawing, painting, music, dance, and drama. Encourages creative expression and aesthetic appreciation.',
  applicableClasses: ['1', '2', '3', '4', '5', '6', '7', '8'],
  termMapping: ['Term 1', 'Term 2', '2024-25'],
  gradingType: 'Grade',
  status: 'Active',
  indicatorCount: 5,
  createdAt: '2024-04-01'
},
{
  id: '4',
  code: 'AV001',
  name: 'Attitudes & Values',
  color: 'teal',
  icon: 'AV001',
  description:
  'Measures respect, responsibility, integrity, and empathy — core values for holistic student development.',
  applicableClasses: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
  termMapping: ['Term 1', 'Term 2', 'Annual', '2024-25'],
  gradingType: 'Remarks Based',
  status: 'Active',
  indicatorCount: 4,
  createdAt: '2024-04-01'
},
{
  id: '5',
  code: 'HPE001',
  name: 'Health & Physical Education',
  color: 'green',
  icon: 'HPE001',
  description:
  'Assesses physical fitness, sports participation, yoga practice, and health awareness among students.',
  applicableClasses: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
  termMapping: ['Term 1', 'Term 2', '2024-25'],
  gradingType: 'Grade',
  status: 'Active',
  indicatorCount: 4,
  createdAt: '2024-04-01'
},
{
  id: '6',
  code: 'DIS001',
  name: 'Discipline',
  color: 'blue',
  icon: 'DIS001',
  description:
  'Tracks punctuality, conduct, uniform compliance, and overall behavior in school environment.',
  applicableClasses: [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12'],

  termMapping: ['Term 1', 'Term 2', 'Annual', '2024-25'],
  gradingType: 'Scale',
  status: 'Active',
  indicatorCount: 4,
  createdAt: '2024-04-01'
},
{
  id: '7',
  code: 'CAP001',
  name: 'Club & Activity Participation',
  color: 'orange',
  icon: 'CAP001',
  description:
  'Records participation in Science Club, Literary Club, Sports Club, Eco Club, and other extracurricular activities.',
  applicableClasses: ['6', '7', '8', '9', '10', '11', '12'],
  termMapping: ['Term 1', 'Term 2', '2024-25'],
  gradingType: 'Grade',
  status: 'Active',
  indicatorCount: 3,
  createdAt: '2024-04-01'
},
{
  id: '8',
  code: 'SR001',
  name: 'Social Responsibility / Community Work',
  color: 'rose',
  icon: 'SR001',
  description:
  'Evaluates community service, environmental awareness, and social outreach activities undertaken by students.',
  applicableClasses: ['8', '9', '10', '11', '12'],
  termMapping: ['Term 1', 'Term 2', 'Annual', '2024-25'],
  gradingType: 'Remarks Based',
  status: 'Active',
  indicatorCount: 3,
  createdAt: '2024-04-01'
}];

function StatCard({
  title,
  value,
  icon: Icon,
  color







}: {title: string;value: string | number;icon: ComponentType<{className?: string;}>;color: string;}) {
  const c = colorMap[color] || colorMap.blue;
  return (
    <div className={`bg-white rounded-xl border ${c.border} p-4`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
            {title}
          </p>
          <p className={`text-2xl font-bold mt-1 ${c.text}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${c.light}`}>
          <Icon className={`w-6 h-6 ${c.text}`} />
        </div>
      </div>
    </div>);

}
function GradingTypeBadge({ type }: {type: string;}) {
  const config: Record<string, string> = {
    Grade: 'bg-green-100 text-green-700 border-green-200',
    Scale: 'bg-blue-100 text-blue-700 border-blue-200',
    'Remarks Based': 'bg-purple-100 text-purple-700 border-purple-200'
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config[type] || 'bg-gray-100 text-gray-700'}`}>

      {type}
    </span>);

}
export function ActivityTypeMaster() {
  const [areas, setAreas] = useState<CoScholasticArea[]>(mockAreas);
  const [search, setSearch] = useState('');
  const [filterGrading, setFilterGrading] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingArea, setEditingArea] = useState<CoScholasticArea | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<CoScholasticArea>>({});
  const filtered = useMemo(() => {
    let r = areas;
    if (search)
    r = r.filter(
      (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.code.toLowerCase().includes(search.toLowerCase())
    );
    if (filterGrading) r = r.filter((a) => a.gradingType === filterGrading);
    if (filterStatus) r = r.filter((a) => a.status === filterStatus);
    return r;
  }, [areas, search, filterGrading, filterStatus]);
  const stats = useMemo(
    () => ({
      total: areas.length,
      active: areas.filter((a) => a.status === 'Active').length,
      gradeType: areas.filter((a) => a.gradingType === 'Grade').length,
      remarksType: areas.filter((a) => a.gradingType === 'Remarks Based').
      length
    }),
    [areas]
  );
  const openAdd = () => {
    setEditingArea(null);
    setForm({
      code: '',
      name: '',
      description: '',
      applicableClasses: [],
      termMapping: ['Term 1', 'Term 2', '2024-25'],
      gradingType: 'Grade',
      status: 'Active',
      color: 'blue',
      icon: 'DIS001'
    });
    setShowModal(true);
  };
  const openEdit = (area: CoScholasticArea) => {
    setEditingArea(area);
    setForm({
      ...area
    });
    setShowModal(true);
  };
  const handleSave = async () => {
    if (!form.name || !form.code) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    if (editingArea) {
      setAreas((prev) =>
      prev.map((a) =>
      a.id === editingArea.id ?
      {
        ...a,
        ...form
      } as CoScholasticArea :
      a
      )
      );
    } else {
      setAreas((prev) => [
      ...prev,
      {
        ...form,
        id: String(Date.now()),
        indicatorCount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      } as CoScholasticArea]
      );
    }
    setSaving(false);
    setShowModal(false);
  };
  const handleDelete = (id: string) => {
    if (confirm('Delete this co-scholastic area?'))
    setAreas((prev) => prev.filter((a) => a.id !== id));
  };
  const toggleClass = (cls: string) => {
    const current = form.applicableClasses || [];
    setForm((prev) => ({
      ...prev,
      applicableClasses: current.includes(cls) ?
      current.filter((c) => c !== cls) :
      [...current, cls]
    }));
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg">
            <Layers className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Co-Scholastic Area Master
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Define and manage major co-scholastic assessment areas for
              holistic student evaluation
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-sm font-medium text-gray-700">
            <Download className="w-4 h-4" /> Export
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">

            <Plus className="w-4 h-4" /> Add Area
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Areas"
          value={stats.total}
          icon={Layers}
          color="indigo" />

        <StatCard
          title="Active"
          value={stats.active}
          icon={CheckCircle}
          color="green" />

        <StatCard
          title="Grade Based"
          value={stats.gradeType}
          icon={Award}
          color="blue" />

        <StatCard
          title="Remarks Based"
          value={stats.remarksType}
          icon={BookOpen}
          color="purple" />

      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search areas by name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />

          </div>
          <select
            value={filterGrading}
            onChange={(e) => setFilterGrading(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">

            <option value="">All Grading Types</option>
            <option value="Grade">Grade</option>
            <option value="Scale">Scale</option>
            <option value="Remarks Based">Remarks Based</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">

            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          {(search || filterGrading || filterStatus) &&
          <button
            onClick={() => {
              setSearch('');
              setFilterGrading('');
              setFilterStatus('');
            }}
            className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 hover:text-gray-700">

              <X className="w-4 h-4" /> Clear
            </button>
          }
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase w-8"></th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Area
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Code
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Applicable Classes
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Term Mapping
                </th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                  Grading Type
                </th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                  Indicators
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
              {filtered.map((area) => {
                const c = colorMap[area.color] || colorMap.blue;
                const Icon = AREA_ICONS[area.icon] || Layers;
                const isExpanded = expandedRow === area.id;
                return (
                  <Fragment key={area.id}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <button
                          onClick={() =>
                          setExpandedRow(isExpanded ? null : area.id)
                          }
                          className="p-1 text-gray-400 hover:text-gray-600">

                          {isExpanded ?
                          <ChevronUp className="w-4 h-4" /> :

                          <ChevronDown className="w-4 h-4" />
                          }
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${c.light}`}>
                            <Icon className={`w-5 h-5 ${c.text}`} />
                          </div>
                          <span className="font-semibold text-gray-900">
                            {area.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-mono text-xs font-semibold px-2 py-1 rounded ${c.light} ${c.text}`}>

                          {area.code}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {area.applicableClasses.slice(0, 5).map((cls) =>
                          <span
                            key={cls}
                            className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">

                              Cls {cls}
                            </span>
                          )}
                          {area.applicableClasses.length > 5 &&
                          <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">
                              +{area.applicableClasses.length - 5}
                            </span>
                          }
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {area.termMapping.map((t) =>
                          <span
                            key={t}
                            className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded text-xs">

                              {t}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <GradingTypeBadge type={area.gradingType} />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold">
                          {area.indicatorCount}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${area.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>

                          {area.status === 'Active' ?
                          <CheckCircle className="w-3 h-3" /> :

                          <XCircle className="w-3 h-3" />
                          }
                          {area.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openEdit(area)}
                            className="p-1.5 hover:bg-indigo-50 rounded-lg text-gray-400 hover:text-indigo-600 transition-colors"
                            title="Edit">

                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(area.id)}
                            className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete">

                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded &&
                    <tr className="bg-indigo-50/30">
                        <td colSpan={9} className="px-8 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                Description
                              </p>
                              <p className="text-sm text-gray-700">
                                {area.description}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                All Applicable Classes
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {area.applicableClasses.map((cls) =>
                              <span
                                key={cls}
                                className="px-2 py-0.5 bg-white border border-gray-200 text-gray-700 rounded text-xs">

                                    Class {cls}
                                  </span>
                              )}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                Created
                              </p>
                              <p className="text-sm text-gray-700">
                                {area.createdAt}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {area.indicatorCount} indicators defined
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    }
                  </Fragment>);

              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 &&
        <div className="p-12 text-center">
            <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              No areas found matching your criteria
            </p>
          </div>
        }
      </div>

      {/* Add/Edit Modal */}
      {showModal &&
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                {editingArea ?
              'Edit Co-Scholastic Area' :
              'Add Co-Scholastic Area'}
              </h2>
              <button
              onClick={() => setShowModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg">

                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area Code <span className="text-red-500">*</span>
                  </label>
                  <input
                  value={form.code || ''}
                  onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    code: e.target.value
                  }))
                  }
                  placeholder="e.g. LS001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />

                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area Name <span className="text-red-500">*</span>
                  </label>
                  <input
                  value={form.name || ''}
                  onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    name: e.target.value
                  }))
                  }
                  placeholder="e.g. Life Skills"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />

                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                value={form.description || ''}
                onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  description: e.target.value
                }))
                }
                rows={3}
                placeholder="Describe this co-scholastic area..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500" />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Applicable Classes
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_CLASSES.map((cls) =>
                <button
                  key={cls}
                  type="button"
                  onClick={() => toggleClass(cls)}
                  className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${(form.applicableClasses || []).includes(cls) ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>

                      Class {cls}
                    </button>
                )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grading Type
                  </label>
                  <select
                  value={form.gradingType || 'Grade'}
                  onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    gradingType: e.target.value as any
                  }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">

                    <option value="Grade">Grade (A–E)</option>
                    <option value="Scale">Scale (1–5)</option>
                    <option value="Remarks Based">Remarks Based</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                  value={form.status || 'Active'}
                  onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    status: e.target.value as any
                  }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">

                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">

                Cancel
              </button>
              <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">

                {saving ?
              <Loader2 className="w-4 h-4 animate-spin" /> :

              <Save className="w-4 h-4" />
              }
                {editingArea ? 'Update Area' : 'Save Area'}
              </button>
            </div>
          </div>
        </div>
      }
    </div>);

}