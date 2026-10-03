import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Tabs } from '../../../components/ui/Tabs';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  Search,
  GraduationCap,
  BookOpen,
  Link,
  CheckSquare,
  Square } from
'lucide-react';
interface Qualification {
  id: string;
  code: string;
  name: string;
  level:
  'Certificate' |
  'Diploma' |
  'Graduate' |
  'Postgraduate' |
  'Doctorate' |
  'Other';
  discipline: 'Science' | 'Arts' | 'Commerce' | 'Management' | 'Other';
  minPercentage: number;
  recognizedBoard: string;
  status: 'Active' | 'Inactive';
}
interface Subject {
  id: string;
  code: string;
  name: string;
  group: 'Language' | 'Core' | 'Elective' | 'Co-scholastic' | 'Activity';
  classFrom: number;
  classTo: number;
  status: 'Active' | 'Inactive';
}
interface QualSubjectMapping {
  qualificationId: string;
  subjectId: string;
}
const mockQualifications: Qualification[] = [
{
  id: 'Q001',
  code: 'BED',
  name: 'Bachelor of Education',
  level: 'Graduate',
  discipline: 'Arts',
  minPercentage: 50,
  recognizedBoard: 'UGC',
  status: 'Active'
},
{
  id: 'Q002',
  code: 'MSC',
  name: 'Master of Science',
  level: 'Postgraduate',
  discipline: 'Science',
  minPercentage: 55,
  recognizedBoard: 'UGC',
  status: 'Active'
},
{
  id: 'Q003',
  code: 'PHD',
  name: 'Doctor of Philosophy',
  level: 'Doctorate',
  discipline: 'Science',
  minPercentage: 0,
  recognizedBoard: 'UGC',
  status: 'Active'
},
{
  id: 'Q004',
  code: 'DIPL',
  name: 'Diploma in Education',
  level: 'Diploma',
  discipline: 'Arts',
  minPercentage: 45,
  recognizedBoard: 'State Board',
  status: 'Active'
},
{
  id: 'Q005',
  code: 'MCOM',
  name: 'Master of Commerce',
  level: 'Postgraduate',
  discipline: 'Commerce',
  minPercentage: 50,
  recognizedBoard: 'UGC',
  status: 'Active'
},
{
  id: 'Q006',
  code: 'MBA',
  name: 'Master of Business Administration',
  level: 'Postgraduate',
  discipline: 'Management',
  minPercentage: 50,
  recognizedBoard: 'AICTE',
  status: 'Active'
}];

const mockSubjects: Subject[] = [
{
  id: 'S001',
  code: 'MATH',
  name: 'Mathematics',
  group: 'Core',
  classFrom: 1,
  classTo: 12,
  status: 'Active'
},
{
  id: 'S002',
  code: 'ENG',
  name: 'English',
  group: 'Language',
  classFrom: 1,
  classTo: 12,
  status: 'Active'
},
{
  id: 'S003',
  code: 'PHY',
  name: 'Physics',
  group: 'Core',
  classFrom: 9,
  classTo: 12,
  status: 'Active'
},
{
  id: 'S004',
  code: 'CHEM',
  name: 'Chemistry',
  group: 'Core',
  classFrom: 9,
  classTo: 12,
  status: 'Active'
},
{
  id: 'S005',
  code: 'HIST',
  name: 'History',
  group: 'Elective',
  classFrom: 6,
  classTo: 12,
  status: 'Active'
},
{
  id: 'S006',
  code: 'BIO',
  name: 'Biology',
  group: 'Core',
  classFrom: 9,
  classTo: 12,
  status: 'Active'
},
{
  id: 'S007',
  code: 'ACC',
  name: 'Accountancy',
  group: 'Elective',
  classFrom: 11,
  classTo: 12,
  status: 'Active'
},
{
  id: 'S008',
  code: 'ART',
  name: 'Art & Craft',
  group: 'Co-scholastic',
  classFrom: 1,
  classTo: 8,
  status: 'Active'
}];

const mockMappings: QualSubjectMapping[] = [
{
  qualificationId: 'Q001',
  subjectId: 'S001'
},
{
  qualificationId: 'Q001',
  subjectId: 'S002'
},
{
  qualificationId: 'Q001',
  subjectId: 'S005'
},
{
  qualificationId: 'Q002',
  subjectId: 'S003'
},
{
  qualificationId: 'Q002',
  subjectId: 'S004'
},
{
  qualificationId: 'Q002',
  subjectId: 'S006'
},
{
  qualificationId: 'Q003',
  subjectId: 'S003'
},
{
  qualificationId: 'Q003',
  subjectId: 'S004'
},
{
  qualificationId: 'Q003',
  subjectId: 'S006'
},
{
  qualificationId: 'Q005',
  subjectId: 'S007'
},
{
  qualificationId: 'Q006',
  subjectId: 'S007'
}];

const levelColor = (level: string) => {
  const map: Record<string, string> = {
    Certificate: 'secondary',
    Diploma: 'info',
    Graduate: 'success',
    Postgraduate: 'warning',
    Doctorate: 'info',
    Other: 'secondary'
  };
  return (map[level] || 'secondary') as
  'secondary' |
  'info' |
  'success' |
  'warning';
};
const groupColor = (group: string) => {
  const map: Record<string, string> = {
    Language: 'info',
    Core: 'success',
    Elective: 'warning',
    'Co-scholastic': 'secondary',
    Activity: 'secondary'
  };
  return (map[group] || 'secondary') as
  'secondary' |
  'info' |
  'success' |
  'warning';
};
export function QualificationSubjectMaster() {
  const [activeTab, setActiveTab] = useState('qualifications');
  const [qualifications, setQualifications] = useState(mockQualifications);
  const [subjects, setSubjects] = useState(mockSubjects);
  const [mappings, setMappings] = useState(mockMappings);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const [selectedQualForMapping, setSelectedQualForMapping] =
  useState<string>('');
  const [qualForm, setQualForm] = useState({
    code: '',
    name: '',
    level: 'Graduate' as Qualification['level'],
    discipline: 'Science' as Qualification['discipline'],
    minPercentage: 0,
    recognizedBoard: ''
  });
  const [subjectForm, setSubjectForm] = useState({
    code: '',
    name: '',
    group: 'Core' as Subject['group'],
    classFrom: 1,
    classTo: 12
  });
  const resetForms = () => {
    setQualForm({
      code: '',
      name: '',
      level: 'Graduate',
      discipline: 'Science',
      minPercentage: 0,
      recognizedBoard: ''
    });
    setSubjectForm({
      code: '',
      name: '',
      group: 'Core',
      classFrom: 1,
      classTo: 12
    });
    setShowForm(false);
    setEditId(null);
  };
  const handleSaveQual = () => {
    if (editId) {
      setQualifications((prev) =>
      prev.map((q) =>
      q.id === editId ?
      {
        ...q,
        ...qualForm
      } :
      q
      )
      );
    } else {
      setQualifications((prev) => [
      ...prev,
      {
        ...qualForm,
        id: `Q${Date.now()}`,
        status: 'Active' as const
      }]
      );
    }
    resetForms();
  };
  const handleSaveSubject = () => {
    if (editId) {
      setSubjects((prev) =>
      prev.map((s) =>
      s.id === editId ?
      {
        ...s,
        ...subjectForm
      } :
      s
      )
      );
    } else {
      setSubjects((prev) => [
      ...prev,
      {
        ...subjectForm,
        id: `S${Date.now()}`,
        status: 'Active' as const
      }]
      );
    }
    resetForms();
  };
  const handleEditQual = (q: Qualification) => {
    setQualForm({
      code: q.code,
      name: q.name,
      level: q.level,
      discipline: q.discipline,
      minPercentage: q.minPercentage,
      recognizedBoard: q.recognizedBoard
    });
    setEditId(q.id);
    setShowForm(true);
  };
  const handleEditSubject = (s: Subject) => {
    setSubjectForm({
      code: s.code,
      name: s.name,
      group: s.group,
      classFrom: s.classFrom,
      classTo: s.classTo
    });
    setEditId(s.id);
    setShowForm(true);
  };
  const toggleMapping = (qualId: string, subjectId: string) => {
    const exists = mappings.some(
      (m) => m.qualificationId === qualId && m.subjectId === subjectId
    );
    if (exists) {
      setMappings((prev) =>
      prev.filter(
        (m) => !(m.qualificationId === qualId && m.subjectId === subjectId)
      )
      );
    } else {
      setMappings((prev) => [
      ...prev,
      {
        qualificationId: qualId,
        subjectId: subjectId
      }]
      );
    }
  };
  const isMapped = (qualId: string, subjectId: string) =>
  mappings.some(
    (m) => m.qualificationId === qualId && m.subjectId === subjectId
  );
  const filteredQuals = qualifications.filter((q) => {
    const matchSearch =
    q.name.toLowerCase().includes(search.toLowerCase()) ||
    q.code.toLowerCase().includes(search.toLowerCase());
    const matchLevel = !levelFilter || q.level === levelFilter;
    return matchSearch && matchLevel;
  });
  const filteredSubjects = subjects.filter((s) => {
    const matchSearch =
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase());
    const matchGroup = !groupFilter || s.group === groupFilter;
    return matchSearch && matchGroup;
  });
  const tabs = [
  {
    id: 'qualifications',
    label: 'Qualifications'
  },
  {
    id: 'subjects',
    label: 'Subjects'
  },
  {
    id: 'mapping',
    label: 'Qual → Subject Mapping'
  }];

  const activeQuals = qualifications.filter((q) => q.status === 'Active').length;
  const activeSubjects = subjects.filter((s) => s.status === 'Active').length;
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Qualification & Subject Master
          </h1>
          <p className="text-sm text-gray-500">
            Manage qualifications, teaching subjects, and their mappings
          </p>
        </div>
        {activeTab !== 'mapping' &&
        <Button
          variant="primary"
          onClick={() => {
            resetForms();
            setShowForm(true);
          }}>

            <Plus className="w-4 h-4 mr-2" />
            Add {activeTab === 'qualifications' ? 'Qualification' : 'Subject'}
          </Button>
        }
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{qualifications.length}</p>
            <p className="text-xs text-gray-500">Total Qualifications</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{subjects.length}</p>
            <p className="text-xs text-gray-500">Total Subjects</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <Link className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{mappings.length}</p>
            <p className="text-xs text-gray-500">Total Mappings</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{activeQuals + activeSubjects}</p>
            <p className="text-xs text-gray-500">Active Records</p>
          </div>
        </div>
      </div>

      {/* Form */}
      {showForm && activeTab === 'qualifications' &&
      <Card title={editId ? 'Edit Qualification' : 'Add New Qualification'}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input
            label="Qualification Code *"
            value={qualForm.code}
            onChange={(e) =>
            setQualForm({
              ...qualForm,
              code: e.target.value
            })
            }
            placeholder="e.g., BED" />

            <Input
            label="Qualification Name *"
            value={qualForm.name}
            onChange={(e) =>
            setQualForm({
              ...qualForm,
              name: e.target.value
            })
            }
            placeholder="e.g., Bachelor of Education" />

            <Select
            label="Level *"
            options={[
            {
              value: 'Certificate',
              label: 'Certificate'
            },
            {
              value: 'Diploma',
              label: 'Diploma'
            },
            {
              value: 'Graduate',
              label: 'Graduate'
            },
            {
              value: 'Postgraduate',
              label: 'Postgraduate'
            },
            {
              value: 'Doctorate',
              label: 'Doctorate'
            },
            {
              value: 'Other',
              label: 'Other'
            }]
            }
            value={qualForm.level}
            onChange={(e) =>
            setQualForm({
              ...qualForm,
              level: e.target.value as Qualification['level']
            })
            } />

            <Select
            label="Discipline *"
            options={[
            {
              value: 'Science',
              label: 'Science'
            },
            {
              value: 'Arts',
              label: 'Arts'
            },
            {
              value: 'Commerce',
              label: 'Commerce'
            },
            {
              value: 'Management',
              label: 'Management'
            },
            {
              value: 'Other',
              label: 'Other'
            }]
            }
            value={qualForm.discipline}
            onChange={(e) =>
            setQualForm({
              ...qualForm,
              discipline: e.target.value as Qualification['discipline']
            })
            } />

            <Input
            label="Minimum Percentage / Grade"
            type="number"
            value={qualForm.minPercentage}
            onChange={(e) =>
            setQualForm({
              ...qualForm,
              minPercentage: parseFloat(e.target.value) || 0
            })
            }
            placeholder="e.g., 50" />

            <Input
            label="Recognized Board / University"
            value={qualForm.recognizedBoard}
            onChange={(e) =>
            setQualForm({
              ...qualForm,
              recognizedBoard: e.target.value
            })
            }
            placeholder="e.g., UGC, AICTE" />

          </div>
          <div className="flex gap-2">
            <Button variant="primary" onClick={handleSaveQual}>
              <Save className="w-4 h-4 mr-2" />
              {editId ? 'Update' : 'Create'} Qualification
            </Button>
            <Button variant="outline" onClick={resetForms}>
              Cancel
            </Button>
          </div>
        </Card>
      }

      {showForm && activeTab === 'subjects' &&
      <Card title={editId ? 'Edit Subject' : 'Add New Subject'}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input
            label="Subject Code *"
            value={subjectForm.code}
            onChange={(e) =>
            setSubjectForm({
              ...subjectForm,
              code: e.target.value
            })
            }
            placeholder="e.g., MATH" />

            <Input
            label="Subject Name *"
            value={subjectForm.name}
            onChange={(e) =>
            setSubjectForm({
              ...subjectForm,
              name: e.target.value
            })
            }
            placeholder="e.g., Mathematics" />

            <Select
            label="Subject Group *"
            options={[
            {
              value: 'Language',
              label: 'Language'
            },
            {
              value: 'Core',
              label: 'Core'
            },
            {
              value: 'Elective',
              label: 'Elective'
            },
            {
              value: 'Co-scholastic',
              label: 'Co-scholastic'
            },
            {
              value: 'Activity',
              label: 'Activity'
            }]
            }
            value={subjectForm.group}
            onChange={(e) =>
            setSubjectForm({
              ...subjectForm,
              group: e.target.value as Subject['group']
            })
            } />

            <div />
            <Input
            label="Applicable From Class *"
            type="number"
            value={subjectForm.classFrom}
            onChange={(e) =>
            setSubjectForm({
              ...subjectForm,
              classFrom: parseInt(e.target.value) || 1
            })
            } />

            <Input
            label="Applicable To Class *"
            type="number"
            value={subjectForm.classTo}
            onChange={(e) =>
            setSubjectForm({
              ...subjectForm,
              classTo: parseInt(e.target.value) || 12
            })
            } />

          </div>
          <div className="flex gap-2">
            <Button variant="primary" onClick={handleSaveSubject}>
              <Save className="w-4 h-4 mr-2" />
              {editId ? 'Update' : 'Create'} Subject
            </Button>
            <Button variant="outline" onClick={resetForms}>
              Cancel
            </Button>
          </div>
        </Card>
      }

      {/* Main Card with Tabs */}
      <Card>
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(tab) => {
            setActiveTab(tab);
            setShowForm(false);
            setSearch('');
            setLevelFilter('');
            setGroupFilter('');
          }} />


        <div className="mt-4">
          {/* Qualifications Tab */}
          {activeTab === 'qualifications' &&
          <>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                  type="text"
                  placeholder="Search qualifications..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

                </div>
                <Select
                options={[
                {
                  value: '',
                  label: 'All Levels'
                },
                {
                  value: 'Certificate',
                  label: 'Certificate'
                },
                {
                  value: 'Diploma',
                  label: 'Diploma'
                },
                {
                  value: 'Graduate',
                  label: 'Graduate'
                },
                {
                  value: 'Postgraduate',
                  label: 'Postgraduate'
                },
                {
                  value: 'Doctorate',
                  label: 'Doctorate'
                },
                {
                  value: 'Other',
                  label: 'Other'
                }]
                }
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)} />

              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200 bg-gray-50">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Qualification
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Level
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Discipline
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Min %
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Board / University
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Subjects Mapped
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Status
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQuals.map((q, i) =>
                  <tr
                    key={q.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 ? 'bg-gray-50/30' : ''}`}>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-blue-500" />
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {q.name}
                              </p>
                              <p className="text-xs text-gray-500">{q.code}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant={levelColor(q.level)}>{q.level}</Badge>
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-gray-600">
                          {q.discipline}
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-gray-600">
                          {q.minPercentage > 0 ? `${q.minPercentage}%` : '-'}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {q.recognizedBoard || '-'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-bold">
                            {
                        mappings.filter((m) => m.qualificationId === q.id).
                        length
                        }
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge
                        variant={
                        q.status === 'Active' ? 'success' : 'secondary'
                        }>

                            {q.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                          onClick={() => handleEditQual(q)}
                          className="p-1.5 hover:bg-blue-100 rounded-lg"
                          title="Edit">

                              <Edit className="w-4 h-4 text-blue-600" />
                            </button>
                            <button
                          className="p-1.5 hover:bg-red-100 rounded-lg"
                          title="Delete">

                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </>
          }

          {/* Subjects Tab */}
          {activeTab === 'subjects' &&
          <>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                  type="text"
                  placeholder="Search subjects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

                </div>
                <Select
                options={[
                {
                  value: '',
                  label: 'All Groups'
                },
                {
                  value: 'Language',
                  label: 'Language'
                },
                {
                  value: 'Core',
                  label: 'Core'
                },
                {
                  value: 'Elective',
                  label: 'Elective'
                },
                {
                  value: 'Co-scholastic',
                  label: 'Co-scholastic'
                },
                {
                  value: 'Activity',
                  label: 'Activity'
                }]
                }
                value={groupFilter}
                onChange={(e) => setGroupFilter(e.target.value)} />

              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200 bg-gray-50">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Subject
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Group
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Class Range
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Qualifications Mapped
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Status
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubjects.map((s, i) =>
                  <tr
                    key={s.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 ? 'bg-gray-50/30' : ''}`}>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-green-500" />
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {s.name}
                              </p>
                              <p className="text-xs text-gray-500">{s.code}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant={groupColor(s.group)}>{s.group}</Badge>
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-gray-600">
                          Class {s.classFrom} – {s.classTo}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
                            {
                        mappings.filter((m) => m.subjectId === s.id).
                        length
                        }
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge
                        variant={
                        s.status === 'Active' ? 'success' : 'secondary'
                        }>

                            {s.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                          onClick={() => handleEditSubject(s)}
                          className="p-1.5 hover:bg-blue-100 rounded-lg"
                          title="Edit">

                              <Edit className="w-4 h-4 text-blue-600" />
                            </button>
                            <button
                          className="p-1.5 hover:bg-red-100 rounded-lg"
                          title="Delete">

                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </>
          }

          {/* Mapping Tab */}
          {activeTab === 'mapping' &&
          <div>
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Qualification → Subject Mapping:</strong> Check the
                  subjects that can be taught by employees holding each
                  qualification. Click any cell to toggle the mapping.
                </p>
              </div>

              <div className="mb-4">
                <Select
                label="Filter by Qualification"
                options={[
                {
                  value: '',
                  label: 'Show All Qualifications'
                },
                ...qualifications.map((q) => ({
                  value: q.id,
                  label: q.name
                }))]
                }
                value={selectedQualForMapping}
                onChange={(e) => setSelectedQualForMapping(e.target.value)} />

              </div>

              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="border-b-2 border-gray-200 bg-gray-50">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase sticky left-0 bg-gray-50 min-w-[200px]">
                        Qualification
                      </th>
                      {subjects.map((s) =>
                    <th
                      key={s.id}
                      className="text-center py-3 px-3 text-xs font-semibold text-gray-600 uppercase min-w-[100px]">

                          <div>{s.name}</div>
                          <div className="text-gray-400 font-normal normal-case">
                            {s.code}
                          </div>
                        </th>
                    )}
                    </tr>
                  </thead>
                  <tbody>
                    {qualifications.
                  filter(
                    (q) =>
                    !selectedQualForMapping ||
                    q.id === selectedQualForMapping
                  ).
                  map((q, i) =>
                  <tr
                    key={q.id}
                    className={`border-b border-gray-100 ${i % 2 ? 'bg-gray-50/30' : ''}`}>

                          <td className="py-3 px-4 sticky left-0 bg-white">
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {q.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {q.code} · {q.level}
                              </p>
                            </div>
                          </td>
                          {subjects.map((s) => {
                      const mapped = isMapped(q.id, s.id);
                      return (
                        <td key={s.id} className="py-3 px-3 text-center">
                                <button
                            onClick={() => toggleMapping(q.id, s.id)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto transition-colors ${mapped ? 'bg-green-100 hover:bg-green-200 text-green-600' : 'bg-gray-100 hover:bg-gray-200 text-gray-400'}`}
                            title={
                            mapped ? 'Remove mapping' : 'Add mapping'
                            }>

                                  {mapped ?
                            <CheckSquare className="w-5 h-5" /> :

                            <Square className="w-5 h-5" />
                            }
                                </button>
                              </td>);

                    })}
                        </tr>
                  )}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-green-100 flex items-center justify-center">
                    <CheckSquare className="w-4 h-4 text-green-600" />
                  </div>
                  <span>
                    Mapped – employee with this qualification can teach this
                    subject
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center">
                    <Square className="w-4 h-4 text-gray-400" />
                  </div>
                  <span>Not mapped</span>
                </div>
              </div>
            </div>
          }
        </div>
      </Card>
    </div>);

}