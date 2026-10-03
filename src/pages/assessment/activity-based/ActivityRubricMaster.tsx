import React, { useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Save,
  ChevronRight,
  CheckCircle,
  BookOpen,
  Layers,
  Award,
  Star,
  Info,
  ToggleLeft,
  ToggleRight,
  Eye,
  Loader2,
  AlertCircle,
  Tag } from
'lucide-react';
interface Indicator {
  id: string;
  areaId: string;
  name: string;
  description: string;
  gradeMapping: 'A-E' | '5-point';
  teacherRemarksEnabled: boolean;
  rubric: RubricRow[];
}
interface RubricRow {
  grade: string;
  gradePoint: number;
  performanceDescription: string;
  behavioralIndicators: string;
}
interface CoScholasticArea {
  id: string;
  code: string;
  name: string;
  color: string;
  indicatorCount: number;
}
const areas: CoScholasticArea[] = [
{
  id: '1',
  code: 'LS001',
  name: 'Life Skills',
  color: 'indigo',
  indicatorCount: 4
},
{
  id: '2',
  code: 'WE001',
  name: 'Work Education',
  color: 'amber',
  indicatorCount: 3
},
{
  id: '3',
  code: 'VPA001',
  name: 'Visual & Performing Arts',
  color: 'purple',
  indicatorCount: 5
},
{
  id: '4',
  code: 'AV001',
  name: 'Attitudes & Values',
  color: 'teal',
  indicatorCount: 4
},
{
  id: '5',
  code: 'HPE001',
  name: 'Health & Physical Education',
  color: 'green',
  indicatorCount: 4
},
{
  id: '6',
  code: 'DIS001',
  name: 'Discipline',
  color: 'blue',
  indicatorCount: 4
},
{
  id: '7',
  code: 'CAP001',
  name: 'Club & Activity Participation',
  color: 'orange',
  indicatorCount: 3
},
{
  id: '8',
  code: 'SR001',
  name: 'Social Responsibility',
  color: 'rose',
  indicatorCount: 3
}];

const defaultRubric: RubricRow[] = [
{
  grade: 'A',
  gradePoint: 5,
  performanceDescription: 'Outstanding',
  behavioralIndicators:
  'Consistently demonstrates the skill with exceptional proficiency and independence.'
},
{
  grade: 'B',
  gradePoint: 4,
  performanceDescription: 'Very Good',
  behavioralIndicators:
  'Frequently demonstrates the skill with good proficiency and minimal guidance.'
},
{
  grade: 'C',
  gradePoint: 3,
  performanceDescription: 'Good',
  behavioralIndicators:
  'Demonstrates the skill adequately with occasional guidance from teacher.'
},
{
  grade: 'D',
  gradePoint: 2,
  performanceDescription: 'Satisfactory',
  behavioralIndicators:
  'Shows basic understanding but requires regular support and encouragement.'
},
{
  grade: 'E',
  gradePoint: 1,
  performanceDescription: 'Needs Improvement',
  behavioralIndicators:
  'Rarely demonstrates the skill and requires intensive support and intervention.'
}];

const mockIndicators: Indicator[] = [
{
  id: 'i1',
  areaId: '1',
  name: 'Problem Solving',
  description:
  'Ability to identify, analyze, and resolve problems effectively using logical reasoning.',
  gradeMapping: 'A-E',
  teacherRemarksEnabled: true,
  rubric: [
  {
    grade: 'A',
    gradePoint: 5,
    performanceDescription: 'Outstanding Problem Solver',
    behavioralIndicators:
    'Independently identifies complex problems, generates multiple solutions, evaluates options, and implements the best solution.'
  },
  {
    grade: 'B',
    gradePoint: 4,
    performanceDescription: 'Proficient Problem Solver',
    behavioralIndicators:
    'Identifies problems clearly, proposes logical solutions with minimal prompting, and follows through effectively.'
  },
  {
    grade: 'C',
    gradePoint: 3,
    performanceDescription: 'Developing Problem Solver',
    behavioralIndicators:
    'Can identify obvious problems and suggest basic solutions with some teacher guidance.'
  },
  {
    grade: 'D',
    gradePoint: 2,
    performanceDescription: 'Basic Problem Awareness',
    behavioralIndicators:
    'Recognizes problems when pointed out but struggles to generate solutions independently.'
  },
  {
    grade: 'E',
    gradePoint: 1,
    performanceDescription: 'Needs Support',
    behavioralIndicators:
    'Has difficulty identifying or addressing problems even with significant teacher support.'
  }]

},
{
  id: 'i2',
  areaId: '1',
  name: 'Critical Thinking',
  description:
  'Capacity to analyze information objectively and make reasoned judgments.',
  gradeMapping: 'A-E',
  teacherRemarksEnabled: true,
  rubric: [
  {
    grade: 'A',
    gradePoint: 5,
    performanceDescription: 'Exceptional Critical Thinker',
    behavioralIndicators:
    'Consistently questions assumptions, evaluates evidence rigorously, and forms well-reasoned conclusions.'
  },
  {
    grade: 'B',
    gradePoint: 4,
    performanceDescription: 'Strong Critical Thinker',
    behavioralIndicators:
    'Often analyzes information carefully and draws logical conclusions with minor guidance.'
  },
  {
    grade: 'C',
    gradePoint: 3,
    performanceDescription: 'Adequate Critical Thinking',
    behavioralIndicators:
    'Shows ability to analyze simple situations and form basic judgments with teacher support.'
  },
  {
    grade: 'D',
    gradePoint: 2,
    performanceDescription: 'Limited Critical Thinking',
    behavioralIndicators:
    'Tends to accept information at face value; requires prompting to think analytically.'
  },
  {
    grade: 'E',
    gradePoint: 1,
    performanceDescription: 'Needs Development',
    behavioralIndicators:
    'Struggles to analyze or evaluate information even with substantial guidance.'
  }]

},
{
  id: 'i3',
  areaId: '1',
  name: 'Decision Making',
  description:
  'Ability to make sound decisions by weighing options and considering consequences.',
  gradeMapping: 'A-E',
  teacherRemarksEnabled: false,
  rubric: defaultRubric
},
{
  id: 'i4',
  areaId: '1',
  name: 'Communication Skills',
  description:
  'Effectiveness in expressing ideas clearly through verbal and written communication.',
  gradeMapping: 'A-E',
  teacherRemarksEnabled: true,
  rubric: defaultRubric
},
{
  id: 'i5',
  areaId: '2',
  name: 'Practical Skills',
  description:
  'Ability to apply theoretical knowledge in practical, hands-on activities.',
  gradeMapping: 'A-E',
  teacherRemarksEnabled: true,
  rubric: defaultRubric
},
{
  id: 'i6',
  areaId: '2',
  name: 'Project Work',
  description:
  'Quality and effort demonstrated in project-based learning activities.',
  gradeMapping: 'A-E',
  teacherRemarksEnabled: true,
  rubric: defaultRubric
},
{
  id: 'i7',
  areaId: '2',
  name: 'Vocational Activities',
  description:
  'Participation and skill development in vocational and career-oriented activities.',
  gradeMapping: 'A-E',
  teacherRemarksEnabled: false,
  rubric: defaultRubric
},
{
  id: 'i8',
  areaId: '3',
  name: 'Drawing & Painting',
  description: 'Creative expression through visual art forms.',
  gradeMapping: 'A-E',
  teacherRemarksEnabled: true,
  rubric: defaultRubric
},
{
  id: 'i9',
  areaId: '3',
  name: 'Music',
  description: 'Participation and skill in vocal or instrumental music.',
  gradeMapping: 'A-E',
  teacherRemarksEnabled: true,
  rubric: defaultRubric
},
{
  id: 'i10',
  areaId: '3',
  name: 'Dance',
  description: 'Participation and skill in classical or folk dance forms.',
  gradeMapping: 'A-E',
  teacherRemarksEnabled: false,
  rubric: defaultRubric
},
{
  id: 'i11',
  areaId: '3',
  name: 'Drama',
  description: 'Participation in theatrical performances and dramatic arts.',
  gradeMapping: 'A-E',
  teacherRemarksEnabled: true,
  rubric: defaultRubric
},
{
  id: 'i12',
  areaId: '3',
  name: 'Craft',
  description: 'Skill in handicrafts and creative making activities.',
  gradeMapping: 'A-E',
  teacherRemarksEnabled: false,
  rubric: defaultRubric
},
{
  id: 'i13',
  areaId: '4',
  name: 'Respect',
  description:
  'Demonstrates respect for peers, teachers, and school property.',
  gradeMapping: 'A-E',
  teacherRemarksEnabled: true,
  rubric: defaultRubric
},
{
  id: 'i14',
  areaId: '4',
  name: 'Responsibility',
  description: 'Takes ownership of tasks and fulfills commitments reliably.',
  gradeMapping: 'A-E',
  teacherRemarksEnabled: true,
  rubric: defaultRubric
},
{
  id: 'i15',
  areaId: '4',
  name: 'Integrity',
  description: 'Demonstrates honesty and ethical behavior in all situations.',
  gradeMapping: 'A-E',
  teacherRemarksEnabled: false,
  rubric: defaultRubric
},
{
  id: 'i16',
  areaId: '4',
  name: 'Empathy',
  description: "Shows understanding and compassion toward others' feelings.",
  gradeMapping: 'A-E',
  teacherRemarksEnabled: true,
  rubric: defaultRubric
}];

const colorMap: Record<
  string,
  {
    text: string;
    light: string;
    border: string;
    dot: string;
  }> =
{
  indigo: {
    text: 'text-indigo-700',
    light: 'bg-indigo-50',
    border: 'border-indigo-200',
    dot: 'bg-indigo-500'
  },
  amber: {
    text: 'text-amber-700',
    light: 'bg-amber-50',
    border: 'border-amber-200',
    dot: 'bg-amber-500'
  },
  purple: {
    text: 'text-purple-700',
    light: 'bg-purple-50',
    border: 'border-purple-200',
    dot: 'bg-purple-500'
  },
  teal: {
    text: 'text-teal-700',
    light: 'bg-teal-50',
    border: 'border-teal-200',
    dot: 'bg-teal-500'
  },
  green: {
    text: 'text-green-700',
    light: 'bg-green-50',
    border: 'border-green-200',
    dot: 'bg-green-500'
  },
  blue: {
    text: 'text-blue-700',
    light: 'bg-blue-50',
    border: 'border-blue-200',
    dot: 'bg-blue-500'
  },
  orange: {
    text: 'text-orange-700',
    light: 'bg-orange-50',
    border: 'border-orange-200',
    dot: 'bg-orange-500'
  },
  rose: {
    text: 'text-rose-700',
    light: 'bg-rose-50',
    border: 'border-rose-200',
    dot: 'bg-rose-500'
  }
};
const gradeColors: Record<string, string> = {
  A: 'bg-green-100 text-green-700',
  B: 'bg-blue-100 text-blue-700',
  C: 'bg-yellow-100 text-yellow-700',
  D: 'bg-orange-100 text-orange-700',
  E: 'bg-red-100 text-red-700'
};
export function ActivityRubricMaster() {
  const [indicators, setIndicators] = useState<Indicator[]>(mockIndicators);
  const [selectedAreaId, setSelectedAreaId] = useState('1');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingIndicator, setEditingIndicator] = useState<Indicator | null>(
    null
  );
  const [previewIndicator, setPreviewIndicator] = useState<Indicator | null>(
    null
  );
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<Indicator>>({});
  const selectedArea = areas.find((a) => a.id === selectedAreaId)!;
  const areaIndicators = indicators.filter(
    (i) =>
    i.areaId === selectedAreaId && (
    search === '' || i.name.toLowerCase().includes(search.toLowerCase()))
  );
  const openAdd = () => {
    setEditingIndicator(null);
    setForm({
      areaId: selectedAreaId,
      name: '',
      description: '',
      gradeMapping: 'A-E',
      teacherRemarksEnabled: false,
      rubric: JSON.parse(JSON.stringify(defaultRubric))
    });
    setShowModal(true);
  };
  const openEdit = (ind: Indicator) => {
    setEditingIndicator(ind);
    setForm({
      ...ind,
      rubric: JSON.parse(JSON.stringify(ind.rubric))
    });
    setShowModal(true);
  };
  const handleSave = async () => {
    if (!form.name) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    if (editingIndicator) {
      setIndicators((prev) =>
      prev.map((i) =>
      i.id === editingIndicator.id ?
      {
        ...i,
        ...form
      } as Indicator :
      i
      )
      );
    } else {
      setIndicators((prev) => [
      ...prev,
      {
        ...form,
        id: `i${Date.now()}`
      } as Indicator]
      );
    }
    setSaving(false);
    setShowModal(false);
  };
  const handleDelete = (id: string) => {
    if (confirm('Delete this indicator?'))
    setIndicators((prev) => prev.filter((i) => i.id !== id));
  };
  const toggleRemarks = (id: string) => {
    setIndicators((prev) =>
    prev.map((i) =>
    i.id === id ?
    {
      ...i,
      teacherRemarksEnabled: !i.teacherRemarksEnabled
    } :
    i
    )
    );
  };
  const updateRubricRow = (
  idx: number,
  field: keyof RubricRow,
  value: string | number) =>
  {
    const rubric = [...(form.rubric || [])];
    rubric[idx] = {
      ...rubric[idx],
      [field]: value
    };
    setForm((p) => ({
      ...p,
      rubric
    }));
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl text-white shadow-lg">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Assessment Criteria / Indicator Master
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Define measurable indicators and rubric definitions for each
              co-scholastic area
            </p>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">

          <Plus className="w-4 h-4" /> Add Indicator
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-medium">
            Total Indicators
          </p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">
            {indicators.length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-medium">
            Areas Covered
          </p>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            {areas.length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-medium">
            With Rubrics
          </p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {indicators.filter((i) => i.rubric.length > 0).length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-medium">
            Remarks Enabled
          </p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {indicators.filter((i) => i.teacherRemarksEnabled).length}
          </p>
        </div>
      </div>

      {/* Two-panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Area List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-700">
                Co-Scholastic Areas
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {areas.map((area) => {
                const c = colorMap[area.color] || colorMap.blue;
                const count = indicators.filter(
                  (i) => i.areaId === area.id
                ).length;
                const isSelected = selectedAreaId === area.id;
                return (
                  <button
                    key={area.id}
                    onClick={() => setSelectedAreaId(area.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${isSelected ? `${c.light} border-l-4 ${c.border.replace('border-', 'border-l-')}` : 'hover:bg-gray-50'}`}>

                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${c.dot}`} />
                      <span
                        className={`text-sm font-medium ${isSelected ? c.text : 'text-gray-700'}`}>

                        {area.name}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isSelected ? `${c.light} ${c.text}` : 'bg-gray-100 text-gray-500'}`}>

                      {count}
                    </span>
                  </button>);

              })}
            </div>
          </div>
        </div>

        {/* Right: Indicators */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedArea.name} — Indicators
              </h2>
              <p className="text-sm text-gray-500">
                {areaIndicators.length} indicator(s) defined
              </p>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search indicators..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-56" />

            </div>
          </div>

          {areaIndicators.map((ind) => {
            const c = colorMap[selectedArea.color] || colorMap.blue;
            return (
              <div
                key={ind.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden">

                <div className="px-5 py-4 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {ind.name}
                      </h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.light} ${c.text}`}>

                        {ind.gradeMapping}
                      </span>
                      {ind.teacherRemarksEnabled &&
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium">
                          Remarks Enabled
                        </span>
                      }
                    </div>
                    <p className="text-sm text-gray-500">{ind.description}</p>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    <button
                      onClick={() =>
                      setPreviewIndicator(
                        previewIndicator?.id === ind.id ? null : ind
                      )
                      }
                      className="p-1.5 hover:bg-indigo-50 rounded-lg text-gray-400 hover:text-indigo-600 transition-colors"
                      title="Preview Rubric">

                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleRemarks(ind.id)}
                      className="p-1.5 hover:bg-amber-50 rounded-lg text-gray-400 hover:text-amber-600 transition-colors"
                      title="Toggle Remarks">

                      {ind.teacherRemarksEnabled ?
                      <ToggleRight className="w-4 h-4 text-amber-500" /> :

                      <ToggleLeft className="w-4 h-4" />
                      }
                    </button>
                    <button
                      onClick={() => openEdit(ind)}
                      className="p-1.5 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-blue-600 transition-colors">

                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(ind.id)}
                      className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors">

                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Rubric Preview */}
                {previewIndicator?.id === ind.id &&
                <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                      Rubric Definition
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left">
                            <th className="pb-2 pr-4 text-xs font-semibold text-gray-500 uppercase w-16">
                              Grade
                            </th>
                            <th className="pb-2 pr-4 text-xs font-semibold text-gray-500 uppercase w-20">
                              Points
                            </th>
                            <th className="pb-2 pr-4 text-xs font-semibold text-gray-500 uppercase w-40">
                              Performance Level
                            </th>
                            <th className="pb-2 text-xs font-semibold text-gray-500 uppercase">
                              Behavioral Indicators
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {ind.rubric.map((row, idx) =>
                        <tr key={idx}>
                              <td className="py-2 pr-4">
                                <span
                              className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${gradeColors[row.grade] || 'bg-gray-100 text-gray-700'}`}>

                                  {row.grade}
                                </span>
                              </td>
                              <td className="py-2 pr-4 font-semibold text-gray-700">
                                {row.gradePoint}
                              </td>
                              <td className="py-2 pr-4 font-medium text-gray-800">
                                {row.performanceDescription}
                              </td>
                              <td className="py-2 text-gray-600 text-xs">
                                {row.behavioralIndicators}
                              </td>
                            </tr>
                        )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                }
              </div>);

          })}

          {areaIndicators.length === 0 &&
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                No indicators defined for this area yet.
              </p>
              <button
              onClick={openAdd}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium mx-auto hover:bg-indigo-700">

                <Plus className="w-4 h-4" /> Add First Indicator
              </button>
            </div>
          }
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal &&
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                {editingIndicator ? 'Edit Indicator' : 'Add Indicator'}
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
                    Indicator Name <span className="text-red-500">*</span>
                  </label>
                  <input
                  value={form.name || ''}
                  onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    name: e.target.value
                  }))
                  }
                  placeholder="e.g. Problem Solving"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />

                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grade Mapping
                  </label>
                  <select
                  value={form.gradeMapping || 'A-E'}
                  onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    gradeMapping: e.target.value as any
                  }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">

                    <option value="A-E">A–E (5 Grade)</option>
                    <option value="5-point">5-Point Scale</option>
                  </select>
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
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500" />

              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                type="checkbox"
                checked={form.teacherRemarksEnabled || false}
                onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  teacherRemarksEnabled: e.target.checked
                }))
                }
                className="w-4 h-4 rounded border-gray-300 text-indigo-600" />

                <span className="text-sm font-medium text-gray-700">
                  Enable Teacher Remarks for this indicator
                </span>
              </label>

              {/* Rubric Table */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Rubric Definition
                </h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-2 px-3 text-left text-xs font-semibold text-gray-600 w-16">
                          Grade
                        </th>
                        <th className="py-2 px-3 text-left text-xs font-semibold text-gray-600 w-20">
                          Points
                        </th>
                        <th className="py-2 px-3 text-left text-xs font-semibold text-gray-600">
                          Performance Level
                        </th>
                        <th className="py-2 px-3 text-left text-xs font-semibold text-gray-600">
                          Behavioral Indicators
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(form.rubric || []).map((row, idx) =>
                    <tr key={idx}>
                          <td className="py-2 px-3">
                            <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${gradeColors[row.grade] || 'bg-gray-100 text-gray-700'}`}>

                              {row.grade}
                            </span>
                          </td>
                          <td className="py-2 px-3">
                            <input
                          type="number"
                          value={row.gradePoint}
                          onChange={(e) =>
                          updateRubricRow(
                            idx,
                            'gradePoint',
                            Number(e.target.value)
                          )
                          }
                          className="w-14 px-2 py-1 border border-gray-200 rounded text-sm" />

                          </td>
                          <td className="py-2 px-3">
                            <input
                          value={row.performanceDescription}
                          onChange={(e) =>
                          updateRubricRow(
                            idx,
                            'performanceDescription',
                            e.target.value
                          )
                          }
                          className="w-full px-2 py-1 border border-gray-200 rounded text-sm" />

                          </td>
                          <td className="py-2 px-3">
                            <input
                          value={row.behavioralIndicators}
                          onChange={(e) =>
                          updateRubricRow(
                            idx,
                            'behavioralIndicators',
                            e.target.value
                          )
                          }
                          className="w-full px-2 py-1 border border-gray-200 rounded text-sm" />

                          </td>
                        </tr>
                    )}
                    </tbody>
                  </table>
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
                {editingIndicator ? 'Update' : 'Save'} Indicator
              </button>
            </div>
          </div>
        </div>
      }
    </div>);

}