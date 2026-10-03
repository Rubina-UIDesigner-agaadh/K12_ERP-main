import React, { useMemo, useState } from 'react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { Badge } from '../../../../components/ui/Badge';
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  XIcon,
  EyeIcon,
  CheckIcon,
  SendIcon,
  CopyIcon } from
'lucide-react';
const CLASSES = [
{
  value: 'ix-a',
  label: 'Class IX-A'
},
{
  value: 'ix-b',
  label: 'Class IX-B'
},
{
  value: 'x-a',
  label: 'Class X-A'
},
{
  value: 'x-b',
  label: 'Class X-B'
},
{
  value: 'xi-sci',
  label: 'Class XI-Sci'
},
{
  value: 'xii-sci',
  label: 'Class XII-Sci'
}];

const SUBJECTS = [
{
  value: 'math',
  label: 'Mathematics'
},
{
  value: 'science',
  label: 'Science'
},
{
  value: 'english',
  label: 'English'
},
{
  value: 'history',
  label: 'History'
},
{
  value: 'hindi',
  label: 'Hindi'
}];

const TEACHERS = [
{
  id: 't1',
  name: 'R. Sharma',
  subject: 'Mathematics'
},
{
  id: 't2',
  name: 'A. Gupta',
  subject: 'Science'
},
{
  id: 't3',
  name: 'M. Singh',
  subject: 'English'
},
{
  id: 't4',
  name: 'S. Patel',
  subject: 'History'
}];

interface LessonPlan {
  id: string;
  title: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  date: string;
  duration: string;
  teacherId: string;
  teacherName: string;
  status: 'Draft' | 'Pending' | 'Approved' | 'Rejected';
  objectives: string;
  materials: string;
  activities: string;
  assessment: string;
  homework: string;
  notes: string;
  createdAt: string;
  reviewedBy?: string;
  reviewNotes?: string;
}
const INITIAL_PLANS: LessonPlan[] = [
{
  id: '1',
  title: 'Introduction to Quadratic Equations',
  classId: 'x-a',
  className: 'X-A',
  subjectId: 'math',
  subjectName: 'Math',
  date: '2025-03-15',
  duration: '2 Periods',
  teacherId: 't1',
  teacherName: 'R. Sharma',
  status: 'Approved',
  objectives:
  'Students will understand quadratic equations and solve basic problems',
  materials: 'Textbook, Whiteboard, Calculator',
  activities: 'Lecture, Practice problems, Group work',
  assessment: 'Quiz at end of lesson',
  homework: 'Exercise 5.1, Q1-10',
  notes: '',
  createdAt: '2025-03-10',
  reviewedBy: 'Principal'
},
{
  id: '2',
  title: 'Laws of Reflection Lab Demo',
  classId: 'x-b',
  className: 'X-B',
  subjectId: 'science',
  subjectName: 'Science',
  date: '2025-03-16',
  duration: '1 Period',
  teacherId: 't2',
  teacherName: 'A. Gupta',
  status: 'Pending',
  objectives: 'Demonstrate and understand laws of reflection',
  materials: 'Mirrors, Light source, Protractor',
  activities: 'Lab demonstration, Student experiments',
  assessment: 'Lab report submission',
  homework: 'Complete lab observation sheet',
  notes: 'Ensure lab safety protocols',
  createdAt: '2025-03-12'
},
{
  id: '3',
  title: 'Poetry Analysis: The Road Not Taken',
  classId: 'ix-a',
  className: 'IX-A',
  subjectId: 'english',
  subjectName: 'English',
  date: '2025-03-15',
  duration: '1 Period',
  teacherId: 't3',
  teacherName: 'M. Singh',
  status: 'Approved',
  objectives: 'Analyze poem structure, themes, and literary devices',
  materials: 'Poetry anthology, Worksheets',
  activities: 'Reading, Discussion, Written analysis',
  assessment: 'Class participation, Written response',
  homework: 'Write personal reflection on the poem',
  notes: '',
  createdAt: '2025-03-08',
  reviewedBy: 'HOD English'
},
{
  id: '4',
  title: 'French Revolution Causes',
  classId: 'ix-b',
  className: 'IX-B',
  subjectId: 'history',
  subjectName: 'History',
  date: '2025-03-17',
  duration: '2 Periods',
  teacherId: 't4',
  teacherName: 'S. Patel',
  status: 'Draft',
  objectives: 'Understand socio-economic causes of French Revolution',
  materials: 'Textbook, Maps, Timeline charts',
  activities: 'Lecture, Video, Group discussion',
  assessment: 'Oral questions',
  homework: 'Read Chapter 4, prepare notes',
  notes: 'Include visual timeline',
  createdAt: '2025-03-14'
}];

export function LessonPlanning() {
  const [plans, setPlans] = useState<LessonPlan[]>(INITIAL_PLANS);
  const [filterTeacher, setFilterTeacher] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<LessonPlan | null>(null);
  const [viewingPlan, setViewingPlan] = useState<LessonPlan | null>(null);
  const [currentUser] = useState({
    id: 't1',
    name: 'R. Sharma',
    role: 'teacher'
  });
  const filteredPlans = useMemo(() => {
    return plans.filter((p) => {
      const matchesTeacher =
      filterTeacher === 'all' ||
      filterTeacher === 'me' && p.teacherId === currentUser.id ||
      p.teacherId === filterTeacher;
      const matchesStatus =
      filterStatus === 'all' || p.status.toLowerCase() === filterStatus;
      const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.className.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTeacher && matchesStatus && matchesSearch;
    });
  }, [plans, filterTeacher, filterStatus, searchTerm, currentUser.id]);
  const stats = useMemo(() => {
    const thisMonth = plans.filter(
      (p) => new Date(p.createdAt).getMonth() === new Date().getMonth()
    );
    const thisWeek = plans.filter((p) => {
      const planDate = new Date(p.createdAt);
      const now = new Date();
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      return planDate >= weekAgo;
    });
    return {
      total: thisMonth.length,
      submitted: thisWeek.length,
      approved: plans.filter((p) => p.status === 'Approved').length,
      pending: plans.filter((p) => p.status === 'Pending').length
    };
  }, [plans]);
  const handleSavePlan = (
  data: Partial<LessonPlan>,
  status: 'Draft' | 'Pending') =>
  {
    const classInfo = CLASSES.find((c) => c.value === data.classId);
    const subjectInfo = SUBJECTS.find((s) => s.value === data.subjectId);
    if (editingPlan) {
      setPlans((prev) =>
      prev.map((p) =>
      p.id === editingPlan.id ?
      {
        ...p,
        ...data,
        className: classInfo?.label.replace('Class ', '') || '',
        subjectName: subjectInfo?.label || '',
        status
      } :
      p
      )
      );
    } else {
      const newPlan: LessonPlan = {
        id: Date.now().toString(),
        title: data.title || '',
        classId: data.classId || '',
        className: classInfo?.label.replace('Class ', '') || '',
        subjectId: data.subjectId || '',
        subjectName: subjectInfo?.label || '',
        date: data.date || '',
        duration: data.duration || '1 Period',
        teacherId: currentUser.id,
        teacherName: currentUser.name,
        status,
        objectives: data.objectives || '',
        materials: data.materials || '',
        activities: data.activities || '',
        assessment: data.assessment || '',
        homework: data.homework || '',
        notes: data.notes || '',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setPlans((prev) => [...prev, newPlan]);
    }
    setShowModal(false);
    setEditingPlan(null);
  };
  const handleDelete = (id: string) => {
    if (window.confirm('Delete this lesson plan?')) {
      setPlans((prev) => prev.filter((p) => p.id !== id));
    }
  };
  const handleDuplicate = (plan: LessonPlan) => {
    const newPlan: LessonPlan = {
      ...plan,
      id: Date.now().toString(),
      title: `${plan.title} (Copy)`,
      status: 'Draft',
      date: '',
      createdAt: new Date().toISOString().split('T')[0],
      reviewedBy: undefined,
      reviewNotes: undefined
    };
    setPlans((prev) => [...prev, newPlan]);
  };
  const handleApprove = (id: string, approved: boolean, notes?: string) => {
    setPlans((prev) =>
    prev.map((p) =>
    p.id === id ?
    {
      ...p,
      status: approved ? 'Approved' : 'Rejected',
      reviewedBy: currentUser.name,
      reviewNotes: notes
    } :
    p
    )
    );
    setShowViewModal(false);
    setViewingPlan(null);
  };
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short'
    });
  };
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lesson Planning</h1>
          <p className="text-sm text-gray-500">
            Create, submit, and review daily/weekly lesson plans
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setEditingPlan(null);
            setShowModal(true);
          }}>
          
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Lesson Plan
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
        {
          value: stats.total,
          label: 'Total Plans (This Month)',
          color: 'text-gray-900'
        },
        {
          value: stats.submitted,
          label: 'Submitted This Week',
          color: 'text-blue-600'
        },
        {
          value: stats.approved,
          label: 'Approved',
          color: 'text-green-600'
        },
        {
          value: stats.pending,
          label: 'Pending Review',
          color: 'text-orange-500'
        }].
        map((stat, i) =>
        <Card key={i}>
            <div className="p-3 text-center">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Lesson Plans Directory">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Input
                  placeholder="Search plans..."
                  className="flex-1"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} />
                
                <Select
                  options={[
                  {
                    value: 'all',
                    label: 'All Teachers'
                  },
                  {
                    value: 'me',
                    label: 'My Plans'
                  },
                  ...TEACHERS.map((t) => ({
                    value: t.id,
                    label: t.name
                  }))]
                  }
                  value={filterTeacher}
                  onChange={(e) => setFilterTeacher(e.target.value)} />
                
                <Select
                  options={[
                  {
                    value: 'all',
                    label: 'All Status'
                  },
                  {
                    value: 'draft',
                    label: 'Draft'
                  },
                  {
                    value: 'pending',
                    label: 'Pending'
                  },
                  {
                    value: 'approved',
                    label: 'Approved'
                  },
                  {
                    value: 'rejected',
                    label: 'Rejected'
                  }]
                  }
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)} />
                
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      {[
                      'Lesson Title',
                      'Class/Sub',
                      'Date/Duration',
                      'Teacher',
                      'Status',
                      'Actions'].
                      map((h) =>
                      <th
                        key={h}
                        className="text-left py-3 px-4 font-medium text-gray-600">
                        
                          {h}
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlans.length === 0 ?
                    <tr>
                        <td
                        colSpan={6}
                        className="text-center py-8 text-gray-500">
                        
                          No lesson plans found
                        </td>
                      </tr> :

                    filteredPlans.map((row) =>
                    <tr
                      key={row.id}
                      className="border-b border-gray-100 hover:bg-gray-50">
                      
                          <td className="py-3 px-4">
                            <button
                          onClick={() => {
                            setViewingPlan(row);
                            setShowViewModal(true);
                          }}
                          className="font-medium text-blue-600 hover:underline text-left">
                          
                              {row.title}
                            </button>
                          </td>
                          <td className="py-3 px-4">
                            <p>{row.className}</p>
                            <p className="text-xs text-gray-500">
                              {row.subjectName}
                            </p>
                          </td>
                          <td className="py-3 px-4 text-xs text-gray-600">
                            <p>{formatDate(row.date)}</p>
                            <p>{row.duration}</p>
                          </td>
                          <td className="py-3 px-4">{row.teacherName}</td>
                          <td className="py-3 px-4">
                            <Badge
                          variant={
                          row.status === 'Approved' ?
                          'success' :
                          row.status === 'Pending' ?
                          'warning' :
                          row.status === 'Rejected' ?
                          'danger' :
                          'default'
                          }>
                          
                              {row.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-1">
                              <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setViewingPlan(row);
                              setShowViewModal(true);
                            }}>
                            
                                <EyeIcon className="w-3 h-3" />
                              </Button>
                              {row.status === 'Draft' &&
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingPlan(row);
                              setShowModal(true);
                            }}>
                            
                                  <EditIcon className="w-3 h-3" />
                                </Button>
                          }
                              <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDuplicate(row)}>
                            
                                <CopyIcon className="w-3 h-3" />
                              </Button>
                              {row.status === 'Draft' &&
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(row.id)}>
                            
                                  <TrashIcon className="w-3 h-3" />
                                </Button>
                          }
                            </div>
                          </td>
                        </tr>
                    )
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <QuickCreateCard
            onSave={handleSavePlan}
            classes={CLASSES}
            subjects={SUBJECTS} />
          
        </div>
      </div>

      {showModal &&
      <LessonPlanModal
        plan={editingPlan}
        classes={CLASSES}
        subjects={SUBJECTS}
        onSave={handleSavePlan}
        onClose={() => {
          setShowModal(false);
          setEditingPlan(null);
        }} />

      }

      {showViewModal && viewingPlan &&
      <ViewPlanModal
        plan={viewingPlan}
        onClose={() => {
          setShowViewModal(false);
          setViewingPlan(null);
        }}
        onApprove={handleApprove}
        onEdit={() => {
          setShowViewModal(false);
          setEditingPlan(viewingPlan);
          setShowModal(true);
        }}
        canApprove={
        currentUser.role === 'admin' || currentUser.role === 'hod'
        }
        canEdit={
        viewingPlan.teacherId === currentUser.id &&
        viewingPlan.status === 'Draft'
        } />

      }
    </div>);

}
function QuickCreateCard({
  onSave,
  classes,
  subjects










}: {onSave: (data: Partial<LessonPlan>, status: 'Draft' | 'Pending') => void;classes: {value: string;label: string;}[];subjects: {value: string;label: string;}[];}) {
  const [form, setForm] = useState({
    title: '',
    classId: '',
    subjectId: '',
    date: '',
    objectives: '',
    duration: '1 Period'
  });
  const handleSubmit = (status: 'Draft' | 'Pending') => {
    if (!form.title || !form.classId || !form.subjectId || !form.date) {
      alert('Please fill required fields');
      return;
    }
    onSave(form, status);
    setForm({
      title: '',
      classId: '',
      subjectId: '',
      date: '',
      objectives: '',
      duration: '1 Period'
    });
  };
  return (
    <Card title="Quick Create Plan">
      <div className="space-y-4">
        <Input
          label="Lesson Title *"
          placeholder="e.g. Intro to Algebra"
          value={form.title}
          onChange={(e) =>
          setForm({
            ...form,
            title: e.target.value
          })
          } />
        
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Class *"
            options={[
            {
              value: '',
              label: 'Select'
            },
            ...classes]
            }
            value={form.classId}
            onChange={(e) =>
            setForm({
              ...form,
              classId: e.target.value
            })
            } />
          
          <Select
            label="Subject *"
            options={[
            {
              value: '',
              label: 'Select'
            },
            ...subjects]
            }
            value={form.subjectId}
            onChange={(e) =>
            setForm({
              ...form,
              subjectId: e.target.value
            })
            } />
          
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Planned Date *"
            type="date"
            value={form.date}
            onChange={(e) =>
            setForm({
              ...form,
              date: e.target.value
            })
            } />
          
          <Select
            label="Duration"
            options={[
            {
              value: '1 Period',
              label: '1 Period'
            },
            {
              value: '2 Periods',
              label: '2 Periods'
            },
            {
              value: '3 Periods',
              label: '3 Periods'
            }]
            }
            value={form.duration}
            onChange={(e) =>
            setForm({
              ...form,
              duration: e.target.value
            })
            } />
          
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Learning Objectives
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
            rows={3}
            placeholder="Students will be able to..."
            value={form.objectives}
            onChange={(e) =>
            setForm({
              ...form,
              objectives: e.target.value
            })
            } />
          
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => handleSubmit('Draft')}>
            
            <PlusIcon className="w-4 h-4 mr-1" />
            Save Draft
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={() => handleSubmit('Pending')}>
            
            <SendIcon className="w-4 h-4 mr-1" />
            Submit
          </Button>
        </div>
      </div>
    </Card>);

}
function LessonPlanModal({
  plan,
  classes,
  subjects,
  onSave,
  onClose












}: {plan: LessonPlan | null;classes: {value: string;label: string;}[];subjects: {value: string;label: string;}[];onSave: (data: Partial<LessonPlan>, status: 'Draft' | 'Pending') => void;onClose: () => void;}) {
  const [form, setForm] = useState({
    title: plan?.title || '',
    classId: plan?.classId || '',
    subjectId: plan?.subjectId || '',
    date: plan?.date || '',
    duration: plan?.duration || '1 Period',
    objectives: plan?.objectives || '',
    materials: plan?.materials || '',
    activities: plan?.activities || '',
    assessment: plan?.assessment || '',
    homework: plan?.homework || '',
    notes: plan?.notes || ''
  });
  const handleSubmit = (status: 'Draft' | 'Pending') => {
    if (!form.title || !form.classId || !form.subjectId || !form.date) {
      alert('Please fill required fields');
      return;
    }
    onSave(form, status);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {plan ? 'Edit' : 'Create'} Lesson Plan
          </h2>
          <button onClick={onClose}>
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <Input
            label="Lesson Title *"
            value={form.title}
            onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value
            })
            } />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Select
              label="Class *"
              options={[
              {
                value: '',
                label: 'Select'
              },
              ...classes]
              }
              value={form.classId}
              onChange={(e) =>
              setForm({
                ...form,
                classId: e.target.value
              })
              } />
            
            <Select
              label="Subject *"
              options={[
              {
                value: '',
                label: 'Select'
              },
              ...subjects]
              }
              value={form.subjectId}
              onChange={(e) =>
              setForm({
                ...form,
                subjectId: e.target.value
              })
              } />
            
            <Input
              label="Date *"
              type="date"
              value={form.date}
              onChange={(e) =>
              setForm({
                ...form,
                date: e.target.value
              })
              } />
            
            <Select
              label="Duration"
              options={[
              {
                value: '1 Period',
                label: '1 Period'
              },
              {
                value: '2 Periods',
                label: '2 Periods'
              },
              {
                value: '3 Periods',
                label: '3 Periods'
              }]
              }
              value={form.duration}
              onChange={(e) =>
              setForm({
                ...form,
                duration: e.target.value
              })
              } />
            
          </div>
          {[
          {
            label: 'Learning Objectives *',
            key: 'objectives',
            placeholder: 'Students will be able to...'
          },
          {
            label: 'Materials Required',
            key: 'materials',
            placeholder: 'Textbook, worksheets, etc.'
          },
          {
            label: 'Activities',
            key: 'activities',
            placeholder: 'Lecture, group work, etc.'
          },
          {
            label: 'Assessment',
            key: 'assessment',
            placeholder: 'Quiz, oral questions, etc.'
          },
          {
            label: 'Homework',
            key: 'homework',
            placeholder: 'Exercises, reading, etc.'
          },
          {
            label: 'Additional Notes',
            key: 'notes',
            placeholder: 'Any other notes...'
          }].
          map((field) =>
          <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <textarea
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
              rows={2}
              placeholder={field.placeholder}
              value={form[field.key as keyof typeof form]}
              onChange={(e) =>
              setForm({
                ...form,
                [field.key]: e.target.value
              })
              } />
            
            </div>
          )}
          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="outline" onClick={() => handleSubmit('Draft')}>
              Save as Draft
            </Button>
            <Button variant="primary" onClick={() => handleSubmit('Pending')}>
              <SendIcon className="w-4 h-4 mr-2" />
              Submit for Review
            </Button>
          </div>
        </div>
      </div>
    </div>);

}
function ViewPlanModal({
  plan,
  onClose,
  onApprove,
  onEdit,
  canApprove,
  canEdit







}: {plan: LessonPlan;onClose: () => void;onApprove: (id: string, approved: boolean, notes?: string) => void;onEdit: () => void;canApprove: boolean;canEdit: boolean;}) {
  const [reviewNotes, setReviewNotes] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const sections = [
  {
    label: 'Learning Objectives',
    value: plan.objectives
  },
  {
    label: 'Materials Required',
    value: plan.materials
  },
  {
    label: 'Activities',
    value: plan.activities
  },
  {
    label: 'Assessment',
    value: plan.assessment
  },
  {
    label: 'Homework',
    value: plan.homework
  },
  {
    label: 'Notes',
    value: plan.notes
  }];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold">{plan.title}</h2>
            <p className="text-sm text-gray-500">
              {plan.className} | {plan.subjectName} | {plan.teacherName}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={
              plan.status === 'Approved' ?
              'success' :
              plan.status === 'Pending' ?
              'warning' :
              plan.status === 'Rejected' ?
              'danger' :
              'default'
              }>
              
              {plan.status}
            </Badge>
            <button onClick={onClose}>
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded">
          <div>
            <span className="text-sm text-gray-500">Date:</span>{' '}
            <span className="font-medium">
              {new Date(plan.date).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="text-sm text-gray-500">Duration:</span>{' '}
            <span className="font-medium">{plan.duration}</span>
          </div>
        </div>

        <div className="space-y-4">
          {sections.
          filter((s) => s.value).
          map((section) =>
          <div key={section.label}>
                <h4 className="font-medium text-gray-700 mb-1">
                  {section.label}
                </h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  {section.value}
                </p>
              </div>
          )}
        </div>

        {plan.reviewedBy &&
        <div className="mt-4 p-3 bg-blue-50 rounded">
            <p className="text-sm">
              <span className="font-medium">Reviewed by:</span>{' '}
              {plan.reviewedBy}
            </p>
            {plan.reviewNotes &&
          <p className="text-sm mt-1">
                <span className="font-medium">Notes:</span> {plan.reviewNotes}
              </p>
          }
          </div>
        }

        {canApprove && plan.status === 'Pending' && !showReviewForm &&
        <div className="flex gap-2 mt-4">
            <Button
            variant="primary"
            className="flex-1"
            onClick={() => onApprove(plan.id, true)}>
            
              <CheckIcon className="w-4 h-4 mr-2" />
              Approve
            </Button>
            <Button
            variant="outline"
            className="flex-1"
            onClick={() => setShowReviewForm(true)}>
            
              Request Changes
            </Button>
          </div>
        }

        {showReviewForm &&
        <div className="mt-4 space-y-3">
            <textarea
            className="w-full border rounded p-2 text-sm"
            rows={3}
            placeholder="Review notes..."
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)} />
          
            <div className="flex gap-2">
              <Button
              variant="outline"
              onClick={() => setShowReviewForm(false)}>
              
                Cancel
              </Button>
              <Button
              variant="danger"
              onClick={() => onApprove(plan.id, false, reviewNotes)}>
              
                Reject with Notes
              </Button>
            </div>
          </div>
        }

        {canEdit &&
        <div className="flex gap-2 mt-4 justify-end">
            <Button variant="outline" onClick={onEdit}>
              <EditIcon className="w-4 h-4 mr-2" />
              Edit Plan
            </Button>
          </div>
        }
      </div>
    </div>);

}