import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { MultiSelect } from '../../../components/ui/MultiSelect';
import {
  Plus,
  Save,
  Trash2,
  Edit,
  X,
  CheckCircle,
  Calendar,
  Tag,
  Users,
  Settings,
  Star,
  Palette,
  Music,
  Blocks,
  Layers } from
'lucide-react';
interface SkillCategory {
  id: string;
  name: string;
  color: string;
  skills: string[];
}
interface ActivityEntry {
  id: string;
  studentId: string;
  grades: Record<string, string>;
  remark: string;
}
interface Student {
  id: string;
  name: string;
  rollNo: string;
  initials: string;
}
const SCALE_OPTIONS = [
'Excellent',
'Good',
'Developing',
'Needs Support',
'Not Observed'];

const SCALE_COLORS: Record<string, string> = {
  Excellent: 'bg-green-100 text-green-800 border-green-300',
  Good: 'bg-blue-100 text-blue-800 border-blue-300',
  Developing: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'Needs Support': 'bg-orange-100 text-orange-800 border-orange-300',
  'Not Observed': 'bg-gray-100 text-gray-600 border-gray-300'
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
}];

const mockStudents: Student[] = [
{
  id: 's1',
  name: 'Aarav Kumar',
  rollNo: '01',
  initials: 'AK'
},
{
  id: 's2',
  name: 'Diya Sharma',
  rollNo: '02',
  initials: 'DS'
},
{
  id: 's3',
  name: 'Rohan Patel',
  rollNo: '03',
  initials: 'RP'
},
{
  id: 's4',
  name: 'Ananya Reddy',
  rollNo: '04',
  initials: 'AR'
},
{
  id: 's5',
  name: 'Kabir Singh',
  rollNo: '05',
  initials: 'KS'
},
{
  id: 's6',
  name: 'Meera Nair',
  rollNo: '06',
  initials: 'MN'
}];

const DEFAULT_CATEGORIES: SkillCategory[] = [
{
  id: '1',
  name: 'Creative Arts',
  color: 'purple',
  skills: ['Clay Modeling', 'Drawing & Coloring', 'Craft Making']
},
{
  id: '2',
  name: 'Language & Expression',
  color: 'blue',
  skills: ['Story Telling', 'Rhymes Recitation', 'Show & Tell']
},
{
  id: '3',
  name: 'Cognitive Play',
  color: 'green',
  skills: ['Color Sorting', 'Shape Matching', 'Puzzle Solving']
},
{
  id: '4',
  name: 'Social Play',
  color: 'orange',
  skills: ['Group Play', 'Sharing & Turn Taking', 'Role Play']
}];

const ACTIVITY_EXAMPLES = [
'Clay modeling',
'Story telling',
'Rhymes recitation',
'Color sorting',
'Group play',
'Drawing',
'Craft activity',
'Music & movement'];

export function PreschoolGradeScaleConfig() {
  const [categories, setCategories] =
  useState<SkillCategory[]>(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [activityName, setActivityName] = useState('');
  const [activityDate, setActivityDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [selectedClass, setSelectedClass] = useState('Nursery');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<SkillCategory | null>(
    null
  );
  const [catFormData, setCatFormData] = useState({
    name: '',
    color: 'blue',
    skills: ['']
  });
  const [entries, setEntries] = useState<ActivityEntry[]>(
    mockStudents.map((s) => ({
      id: s.id,
      studentId: s.id,
      grades: {},
      remark: ''
    }))
  );
  const [teacherRemark, setTeacherRemark] = useState('');
  const [saved, setSaved] = useState(false);
  const currentCategory = categories.find((c) => c.id === selectedCategory);
  const updateGrade = (studentId: string, indicator: string, value: string) => {
    setEntries((prev) =>
    prev.map((e) =>
    e.studentId === studentId ?
    {
      ...e,
      grades: {
        ...e.grades,
        [indicator]: value
      }
    } :
    e
    )
    );
  };
  const updateRemark = (studentId: string, remark: string) => {
    setEntries((prev) =>
    prev.map((e) =>
    e.studentId === studentId ?
    {
      ...e,
      remark
    } :
    e
    )
    );
  };
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  const handleAddCategory = () => {
    setEditingCategory(null);
    setCatFormData({
      name: '',
      color: 'blue',
      skills: ['']
    });
    setShowCategoryModal(true);
  };
  const handleEditCategory = (cat: SkillCategory) => {
    setEditingCategory(cat);
    setCatFormData({
      name: cat.name,
      color: cat.color,
      skills: [...cat.skills]
    });
    setShowCategoryModal(true);
  };
  const handleSaveCategory = () => {
    const validSkills = catFormData.skills.filter((s) => s.trim());
    if (editingCategory) {
      setCategories((prev) =>
      prev.map((c) =>
      c.id === editingCategory.id ?
      {
        ...c,
        name: catFormData.name,
        color: catFormData.color,
        skills: validSkills
      } :
      c
      )
      );
    } else {
      setCategories((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: catFormData.name,
        color: catFormData.color,
        skills: validSkills
      }]
      );
    }
    setShowCategoryModal(false);
  };
  const handleDeleteCategory = (id: string) => {
    if (confirm('Delete this category?'))
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };
  const addSkillField = () =>
  setCatFormData((prev) => ({
    ...prev,
    skills: [...prev.skills, '']
  }));
  const updateSkillField = (idx: number, val: string) =>
  setCatFormData((prev) => ({
    ...prev,
    skills: prev.skills.map((s, i) => i === idx ? val : s)
  }));
  const removeSkillField = (idx: number) =>
  setCatFormData((prev) => ({
    ...prev,
    skills: prev.skills.filter((_, i) => i !== idx)
  }));
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    purple: 'bg-purple-100 text-purple-700',
    orange: 'bg-orange-100 text-orange-700',
    red: 'bg-red-100 text-red-700',
    yellow: 'bg-yellow-100 text-yellow-700'
  };
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Activity-Based Assessment
          </h1>
          <p className="text-sm text-gray-500">
            Evaluate children through classroom activities — no totals, no
            percentages
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saved &&
          <span className="flex items-center gap-1 text-sm text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
              <CheckCircle className="w-4 h-4" />
              Saved
            </span>
          }
          <Button variant="primary" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Entry
          </Button>
        </div>
      </div>

      {/* Activity Setup */}
      <Card className="p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Activity Setup</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <MultiSelect
            label="Branch"
            options={BRANCH_OPTIONS}
            value={selectedBranches}
            onChange={setSelectedBranches}
            placeholder="All" />

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">

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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">

              <option>A</option>
              <option>B</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Activity Date
            </label>
            <input
              type="date"
              value={activityDate}
              onChange={(e) => setActivityDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />

          </div>
          <div className="lg:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Activity Name
            </label>
            <input
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              placeholder="e.g., Clay modeling, Story telling..."
              list="activity-examples"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />

            <datalist id="activity-examples">
              {ACTIVITY_EXAMPLES.map((a) =>
              <option key={a} value={a} />
              )}
            </datalist>
          </div>
        </div>
      </Card>

      {/* Skill Categories Management */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">
            Skill Categories & Indicators
          </h3>
          <Button variant="outline" size="sm" onClick={handleAddCategory}>
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((cat) =>
          <div key={cat.id} className="flex items-center gap-1">
              <button
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-all ${selectedCategory === cat.id ? 'border-gray-800 shadow-sm' : 'border-transparent'} ${colorMap[cat.color] || 'bg-gray-100 text-gray-700'}`}>

                {cat.name}
                <span className="text-xs opacity-70">
                  ({cat.skills.length})
                </span>
              </button>
              <button
              onClick={() => handleEditCategory(cat)}
              className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600">

                <Edit className="w-3 h-3" />
              </button>
              <button
              onClick={() => handleDeleteCategory(cat.id)}
              className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500">

                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
        {currentCategory &&
        <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
              Indicators in {currentCategory.name}:
            </p>
            <div className="flex flex-wrap gap-2">
              {currentCategory.skills.map((skill) =>
            <span
              key={skill}
              className={`px-3 py-1 rounded-full text-xs font-medium ${colorMap[currentCategory.color] || 'bg-gray-100 text-gray-700'}`}>

                  {skill}
                </span>
            )}
            </div>
          </div>
        }
      </Card>

      {/* Student Assessment Grid */}
      {currentCategory &&
      <Card className="overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-200 bg-purple-50 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-purple-800">
                Student Assessment Grid
              </h3>
              <p className="text-xs text-purple-600 mt-0.5">
                {activityName || 'Activity'} — {currentCategory.name} — Class{' '}
                {selectedClass}-{selectedSection}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-purple-700 bg-purple-100 px-3 py-1.5 rounded-lg">
              <Users className="w-3 h-3" />
              {mockStudents.length} students
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase sticky left-0 bg-gray-50">
                    Student
                  </th>
                  {currentCategory.skills.map((skill) =>
                <th
                  key={skill}
                  className="py-3 px-3 text-center text-xs font-semibold text-gray-600 uppercase whitespace-nowrap min-w-[140px]">

                      {skill}
                    </th>
                )}
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase min-w-[200px]">
                    Teacher Remark
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockStudents.map((student) => {
                const entry = entries.find((e) => e.studentId === student.id)!;
                return (
                  <tr key={student.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 sticky left-0 bg-white">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
                            {student.initials}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {student.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              Roll: {student.rollNo}
                            </p>
                          </div>
                        </div>
                      </td>
                      {currentCategory.skills.map((skill) =>
                    <td key={skill} className="py-3 px-3 text-center">
                          <select
                        value={entry.grades[skill] || ''}
                        onChange={(e) =>
                        updateGrade(student.id, skill, e.target.value)
                        }
                        className={`w-full px-2 py-1.5 border rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 ${entry.grades[skill] ? SCALE_COLORS[entry.grades[skill]] : 'border-gray-200 bg-white text-gray-400'}`}>

                            <option value="">— Select —</option>
                            {SCALE_OPTIONS.map((s) =>
                        <option key={s} value={s}>
                                {s}
                              </option>
                        )}
                          </select>
                        </td>
                    )}
                      <td className="py-3 px-4">
                        <input
                        value={entry.remark}
                        onChange={(e) =>
                        updateRemark(student.id, e.target.value)
                        }
                        placeholder="Teacher remark..."
                        className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-500" />

                      </td>
                    </tr>);

              })}
              </tbody>
            </table>
          </div>
        </Card>
      }

      {/* Evaluation Scale Legend */}
      <Card className="p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
          Evaluation Scale
        </p>
        <div className="flex flex-wrap gap-3">
          {SCALE_OPTIONS.map((scale) =>
          <div
            key={scale}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${SCALE_COLORS[scale]}`}>

              {scale}
            </div>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Note: No totals or percentages are calculated for activity-based
          assessment.
        </p>
      </Card>

      {/* Category Modal */}
      {showCategoryModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add Skill Category'}
              </h2>
              <button
              onClick={() => setShowCategoryModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg">

                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name
                </label>
                <input
                value={catFormData.name}
                onChange={(e) =>
                setCatFormData({
                  ...catFormData,
                  name: e.target.value
                })
                }
                placeholder="e.g., Creative Arts"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="flex gap-2">
                  {Object.keys(colorMap).map((c) =>
                <button
                  key={c}
                  onClick={() =>
                  setCatFormData({
                    ...catFormData,
                    color: c
                  })
                  }
                  className={`w-8 h-8 rounded-full border-4 transition-all ${catFormData.color === c ? 'border-gray-800 scale-110' : 'border-transparent'} ${colorMap[c]}`} />

                )}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Skills / Indicators
                  </label>
                  <button
                  onClick={addSkillField}
                  className="text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1">

                    <Plus className="w-3 h-3" />
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {catFormData.skills.map((skill, idx) =>
                <div key={idx} className="flex items-center gap-2">
                      <input
                    value={skill}
                    onChange={(e) => updateSkillField(idx, e.target.value)}
                    placeholder={`Skill ${idx + 1}`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />

                      {catFormData.skills.length > 1 &&
                  <button
                    onClick={() => removeSkillField(idx)}
                    className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-500">

                          <X className="w-4 h-4" />
                        </button>
                  }
                    </div>
                )}
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-gray-200 flex justify-end gap-3">
              <Button
              variant="outline"
              onClick={() => setShowCategoryModal(false)}>

                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveCategory}>
                <Save className="w-4 h-4 mr-2" />
                {editingCategory ? 'Save Changes' : 'Add Category'}
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}
export default PreschoolGradeScaleConfig;