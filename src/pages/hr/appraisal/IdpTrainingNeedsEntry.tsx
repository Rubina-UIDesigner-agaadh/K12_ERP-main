import React, { useState, useMemo, useCallback } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  Plus,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Target,
  Flag,
  CheckCircle,
  Clock,
  Trash2,
  ChevronDown,
  ChevronUp,
  User,
  BookOpen,
  X,
  Edit2,
  Copy,
  Save,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  RotateCcw,
  MessageSquare,
  Milestone,
  Eye,
  EyeOff,
  AlertCircle,
  Download,
  Upload } from
'lucide-react';

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

interface Note {
  id: string;
  content: string;
  createdAt: string;
  author: string;
}

interface Goal {
  id: string;
  title: string;
  weakness: string;
  targetDate: string;
  successMetric: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'todo' | 'inprogress' | 'completed';
  progress: number;
  description?: string;
  milestones?: Milestone[];
  notes?: Note[];
  createdAt?: string;
  updatedAt?: string;
  assignedTo?: string;
}

interface Employee {
  id: string;
  name: string;
  department: string;
  goals: Goal[];
}

const initialEmployees: Employee[] = [
{
  id: 'emp1',
  name: 'Dr. Robert Smith',
  department: 'Mathematics',
  goals: [
  {
    id: '1',
    title: 'Advanced Classroom Management Workshop',
    weakness: 'Classroom Management',
    targetDate: '2025-03-31',
    successMetric: 'Complete certification',
    priority: 'High',
    status: 'inprogress',
    progress: 60,
    description: 'Attend a comprehensive workshop on classroom management techniques.',
    createdAt: '2025-01-01',
    updatedAt: '2025-01-15',
    milestones: [
    { id: 'm1', title: 'Register for workshop', completed: true },
    { id: 'm2', title: 'Complete Module 1', completed: true },
    { id: 'm3', title: 'Complete Module 2', completed: false },
    { id: 'm4', title: 'Final Assessment', completed: false }],

    notes: [
    {
      id: 'n1',
      content: 'Started the first module, very informative.',
      createdAt: '2025-01-10',
      author: 'Dr. Robert Smith'
    }]

  },
  {
    id: '2',
    title: 'Google Certified Educator Level 2',
    weakness: 'Technology Integration',
    targetDate: '2025-06-30',
    successMetric: 'Pass certification exam',
    priority: 'High',
    status: 'todo',
    progress: 0,
    createdAt: '2025-01-05',
    milestones: [
    { id: 'm1', title: 'Complete online training', completed: false },
    { id: 'm2', title: 'Practice tests', completed: false },
    { id: 'm3', title: 'Schedule exam', completed: false },
    { id: 'm4', title: 'Pass certification', completed: false }],

    notes: []
  },
  {
    id: '3',
    title: 'Peer Observation Program (5 sessions)',
    weakness: 'Student Engagement',
    targetDate: '2025-04-15',
    successMetric: 'Complete 5 peer observations',
    priority: 'Medium',
    status: 'inprogress',
    progress: 40,
    createdAt: '2025-01-02',
    milestones: [
    { id: 'm1', title: 'Session 1', completed: true },
    { id: 'm2', title: 'Session 2', completed: true },
    { id: 'm3', title: 'Session 3', completed: false },
    { id: 'm4', title: 'Session 4', completed: false },
    { id: 'm5', title: 'Session 5', completed: false }],

    notes: []
  },
  {
    id: '5',
    title: 'Communication Skills Seminar',
    weakness: 'Communication Skills',
    targetDate: '2025-02-28',
    successMetric: 'Attend 2-day seminar',
    priority: 'Low',
    status: 'completed',
    progress: 100,
    createdAt: '2024-12-01',
    updatedAt: '2025-02-28',
    notes: [
    {
      id: 'n1',
      content: 'Successfully completed the seminar with excellent feedback.',
      createdAt: '2025-02-28',
      author: 'Dr. Robert Smith'
    }]

  },
  {
    id: '6',
    title: 'Research Paper Publication',
    weakness: 'Professional Development',
    targetDate: '2025-01-15',
    successMetric: 'Publish in peer-reviewed journal',
    priority: 'High',
    status: 'completed',
    progress: 100,
    createdAt: '2024-10-01',
    updatedAt: '2025-01-15',
    notes: []
  }]

},
{
  id: 'emp2',
  name: 'Mr. Michael Chen',
  department: 'Science',
  goals: [
  {
    id: '4',
    title: 'Assessment Design Course',
    weakness: 'Assessment & Evaluation',
    targetDate: '2025-05-31',
    successMetric: 'Design 3 new assessment rubrics',
    priority: 'Medium',
    status: 'todo',
    progress: 0,
    createdAt: '2025-01-10',
    milestones: [
    { id: 'm1', title: 'Complete course enrollment', completed: false },
    { id: 'm2', title: 'Design rubric 1', completed: false },
    { id: 'm3', title: 'Design rubric 2', completed: false },
    { id: 'm4', title: 'Design rubric 3', completed: false }],

    notes: []
  },
  {
    id: '7',
    title: 'Collaborative Teaching Project',
    weakness: 'Teamwork & Collaboration',
    targetDate: '2025-07-31',
    successMetric: 'Lead cross-department project',
    priority: 'Low',
    status: 'todo',
    progress: 0,
    createdAt: '2025-01-12',
    milestones: [
    { id: 'm1', title: 'Form project team', completed: false },
    { id: 'm2', title: 'Define project scope', completed: false },
    { id: 'm3', title: 'Execute project', completed: false },
    { id: 'm4', title: 'Present outcomes', completed: false }],

    notes: []
  },
  {
    id: '8',
    title: 'Laboratory Safety Certification',
    weakness: 'Subject Knowledge',
    targetDate: '2025-04-30',
    successMetric: 'Obtain safety certification',
    priority: 'High',
    status: 'inprogress',
    progress: 30,
    createdAt: '2025-01-08',
    milestones: [
    { id: 'm1', title: 'Complete online modules', completed: true },
    { id: 'm2', title: 'Practical training', completed: false },
    { id: 'm3', title: 'Written exam', completed: false }],

    notes: []
  }]

}];


const weaknesses = [
'Classroom Management',
'Subject Knowledge',
'Student Engagement',
'Assessment & Evaluation',
'Professional Development',
'Communication Skills',
'Technology Integration',
'Teamwork & Collaboration'];


const priorityColor = (p: string) => {
  if (p === 'High') return 'bg-red-100 text-red-700';
  if (p === 'Medium') return 'bg-amber-100 text-amber-700';
  return 'bg-green-100 text-green-700';
};

type SortOption = 'priority' | 'targetDate' | 'title' | 'progress' | 'createdAt';
type SortDirection = 'asc' | 'desc';

export function IdpTrainingNeedsEntry() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('emp1');
  const [showForm, setShowForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [viewingGoal, setViewingGoal] = useState<Goal | null>(null);
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('');
  const [filterWeakness, setFilterWeakness] = useState<string>('');
  const [sortOption, setSortOption] = useState<SortOption>('priority');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [showMilestoneInput, setShowMilestoneInput] = useState(false);

  const [newGoal, setNewGoal] = useState({
    title: '',
    weakness: '',
    targetDate: '',
    successMetric: '',
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
    description: ''
  });

  const selectedEmployee = employees.find((e) => e.id === selectedEmployeeId);
  const goals = selectedEmployee?.goals || [];

  const setGoals = useCallback(
    (updater: (prev: Goal[]) => Goal[]) => {
      setEmployees((prev) =>
      prev.map((emp) =>
      emp.id === selectedEmployeeId ?
      { ...emp, goals: updater(emp.goals) } :
      emp
      )
      );
    },
    [selectedEmployeeId]
  );

  const filteredAndSortedGoals = useMemo(() => {
    let result = [...goals];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (g) =>
        g.title.toLowerCase().includes(query) ||
        g.weakness.toLowerCase().includes(query) ||
        g.successMetric?.toLowerCase().includes(query) ||
        g.description?.toLowerCase().includes(query)
      );
    }

    if (filterPriority) {
      result = result.filter((g) => g.priority === filterPriority);
    }

    if (filterWeakness) {
      result = result.filter((g) => g.weakness === filterWeakness);
    }

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortOption) {
        case 'priority':
          const priorityOrder = { High: 3, Medium: 2, Low: 1 };
          comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
          break;
        case 'targetDate':
          comparison =
          new Date(a.targetDate || '9999-12-31').getTime() -
          new Date(b.targetDate || '9999-12-31').getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'progress':
          comparison = a.progress - b.progress;
          break;
        case 'createdAt':
          comparison =
          new Date(a.createdAt || '1970-01-01').getTime() -
          new Date(b.createdAt || '1970-01-01').getTime();
          break;
      }
      return sortDirection === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [goals, searchQuery, filterPriority, filterWeakness, sortOption, sortDirection]);

  const todoGoals = filteredAndSortedGoals.filter((g) => g.status === 'todo');
  const inProgressGoals = filteredAndSortedGoals.filter((g) => g.status === 'inprogress');
  const completedGoals = filteredAndSortedGoals.filter((g) => g.status === 'completed');

  const moveGoal = (id: string, newStatus: 'todo' | 'inprogress' | 'completed') => {
    setGoals((prev) =>
    prev.map((g) =>
    g.id === id ?
    {
      ...g,
      status: newStatus,
      progress:
      newStatus === 'completed' ? 100 : newStatus === 'todo' ? 0 : g.progress,
      updatedAt: new Date().toISOString().split('T')[0]
    } :
    g
    )
    );
  };

  const removeGoal = (id: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      setGoals((prev) => prev.filter((g) => g.id !== id));
    }
  };

  const addGoal = () => {
    if (!newGoal.title || !newGoal.weakness) {
      alert('Please fill in the required fields: Title and Weakness');
      return;
    }
    const now = new Date().toISOString().split('T')[0];
    setGoals((prev) => [
    ...prev,
    {
      ...newGoal,
      id: Date.now().toString(),
      status: 'todo',
      progress: 0,
      createdAt: now,
      updatedAt: now,
      milestones: [],
      notes: []
    }]
    );
    setNewGoal({
      title: '',
      weakness: '',
      targetDate: '',
      successMetric: '',
      priority: 'Medium',
      description: ''
    });
    setShowForm(false);
  };

  const duplicateGoal = (goal: Goal) => {
    const now = new Date().toISOString().split('T')[0];
    const duplicated: Goal = {
      ...goal,
      id: Date.now().toString(),
      title: `${goal.title} (Copy)`,
      status: 'todo',
      progress: 0,
      createdAt: now,
      updatedAt: now,
      milestones: goal.milestones?.map((m) => ({
        ...m,
        id: `${m.id}-copy-${Date.now()}`,
        completed: false
      })),
      notes: []
    };
    setGoals((prev) => [...prev, duplicated]);
  };

  const openEditModal = (goal: Goal) => {
    setEditingGoal({ ...goal });
    setShowEditModal(true);
  };

  const saveEditedGoal = () => {
    if (!editingGoal) return;
    if (!editingGoal.title || !editingGoal.weakness) {
      alert('Please fill in the required fields: Title and Weakness');
      return;
    }
    setGoals((prev) =>
    prev.map((g) =>
    g.id === editingGoal.id ?
    {
      ...editingGoal,
      updatedAt: new Date().toISOString().split('T')[0]
    } :
    g
    )
    );
    setShowEditModal(false);
    setEditingGoal(null);
  };

  const openDetailModal = (goal: Goal) => {
    setViewingGoal(goal);
    setShowDetailModal(true);
  };

  const updateProgress = (goalId: string, newProgress: number) => {
    const clampedProgress = Math.max(0, Math.min(100, newProgress));
    setGoals((prev) =>
    prev.map((g) =>
    g.id === goalId ?
    {
      ...g,
      progress: clampedProgress,
      status: clampedProgress === 100 ? 'completed' : clampedProgress > 0 ? 'inprogress' : 'todo',
      updatedAt: new Date().toISOString().split('T')[0]
    } :
    g
    )
    );
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals((prev) =>
    prev.map((g) => {
      if (g.id !== goalId) return g;
      const updatedMilestones = g.milestones?.map((m) =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
      );
      const completedCount = updatedMilestones?.filter((m) => m.completed).length || 0;
      const totalCount = updatedMilestones?.length || 1;
      const newProgress = Math.round(completedCount / totalCount * 100);
      return {
        ...g,
        milestones: updatedMilestones,
        progress: newProgress,
        status: newProgress === 100 ? 'completed' : newProgress > 0 ? 'inprogress' : g.status,
        updatedAt: new Date().toISOString().split('T')[0]
      };
    })
    );
    if (viewingGoal && viewingGoal.id === goalId) {
      const updatedGoal = goals.find((g) => g.id === goalId);
      if (updatedGoal) {
        const updatedMilestones = updatedGoal.milestones?.map((m) =>
        m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        setViewingGoal({ ...updatedGoal, milestones: updatedMilestones });
      }
    }
  };

  const addMilestone = (goalId: string, title: string) => {
    if (!title.trim()) return;
    const newMilestone: Milestone = {
      id: `m-${Date.now()}`,
      title: title.trim(),
      completed: false
    };
    setGoals((prev) =>
    prev.map((g) =>
    g.id === goalId ?
    {
      ...g,
      milestones: [...(g.milestones || []), newMilestone],
      updatedAt: new Date().toISOString().split('T')[0]
    } :
    g
    )
    );
    if (viewingGoal && viewingGoal.id === goalId) {
      setViewingGoal({
        ...viewingGoal,
        milestones: [...(viewingGoal.milestones || []), newMilestone]
      });
    }
    setNewMilestoneTitle('');
    setShowMilestoneInput(false);
  };

  const removeMilestone = (goalId: string, milestoneId: string) => {
    setGoals((prev) =>
    prev.map((g) => {
      if (g.id !== goalId) return g;
      const updatedMilestones = g.milestones?.filter((m) => m.id !== milestoneId);
      const completedCount = updatedMilestones?.filter((m) => m.completed).length || 0;
      const totalCount = updatedMilestones?.length || 1;
      const newProgress = totalCount > 0 ? Math.round(completedCount / totalCount * 100) : 0;
      return {
        ...g,
        milestones: updatedMilestones,
        progress: newProgress,
        updatedAt: new Date().toISOString().split('T')[0]
      };
    })
    );
    if (viewingGoal && viewingGoal.id === goalId) {
      setViewingGoal({
        ...viewingGoal,
        milestones: viewingGoal.milestones?.filter((m) => m.id !== milestoneId)
      });
    }
  };

  const addNote = (goalId: string, content: string) => {
    if (!content.trim()) return;
    const note: Note = {
      id: `note-${Date.now()}`,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      author: selectedEmployee?.name || 'Unknown'
    };
    setGoals((prev) =>
    prev.map((g) =>
    g.id === goalId ?
    {
      ...g,
      notes: [...(g.notes || []), note],
      updatedAt: new Date().toISOString().split('T')[0]
    } :
    g
    )
    );
    if (viewingGoal && viewingGoal.id === goalId) {
      setViewingGoal({
        ...viewingGoal,
        notes: [...(viewingGoal.notes || []), note]
      });
    }
    setNewNote('');
  };

  const removeNote = (goalId: string, noteId: string) => {
    setGoals((prev) =>
    prev.map((g) =>
    g.id === goalId ?
    {
      ...g,
      notes: g.notes?.filter((n) => n.id !== noteId),
      updatedAt: new Date().toISOString().split('T')[0]
    } :
    g
    )
    );
    if (viewingGoal && viewingGoal.id === goalId) {
      setViewingGoal({
        ...viewingGoal,
        notes: viewingGoal.notes?.filter((n) => n.id !== noteId)
      });
    }
  };

  const toggleGoalExpansion = (goalId: string) => {
    setExpandedGoals((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(goalId)) {
        newSet.delete(goalId);
      } else {
        newSet.add(goalId);
      }
      return newSet;
    });
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilterPriority('');
    setFilterWeakness('');
    setSortOption('priority');
    setSortDirection('desc');
  };

  const toggleSortDirection = () => {
    setSortDirection((prev) => prev === 'asc' ? 'desc' : 'asc');
  };

  const exportGoals = () => {
    const dataToExport = {
      employee: selectedEmployee,
      exportedAt: new Date().toISOString(),
      goals: goals
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `idp-goals-${selectedEmployee?.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importGoals = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        if (imported.goals && Array.isArray(imported.goals)) {
          const importedGoals = imported.goals.map((g: Goal) => ({
            ...g,
            id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          }));
          setGoals((prev) => [...prev, ...importedGoals]);
          alert(`Successfully imported ${importedGoals.length} goals`);
        }
      } catch (error) {
        alert('Failed to import goals. Please check the file format.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const resetGoalProgress = (goalId: string) => {
    if (window.confirm('Are you sure you want to reset progress for this goal?')) {
      setGoals((prev) =>
      prev.map((g) =>
      g.id === goalId ?
      {
        ...g,
        progress: 0,
        status: 'todo',
        milestones: g.milestones?.map((m) => ({ ...m, completed: false })),
        updatedAt: new Date().toISOString().split('T')[0]
      } :
      g
      )
      );
    }
  };

  const isOverdue = (targetDate: string) => {
    if (!targetDate) return false;
    return new Date(targetDate) < new Date() && targetDate !== '';
  };

  const getDaysRemaining = (targetDate: string) => {
    if (!targetDate) return null;
    const diff = new Date(targetDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const GoalCard = ({ goal }: {goal: Goal;}) => {
    const isExpanded = expandedGoals.has(goal.id);
    const daysRemaining = getDaysRemaining(goal.targetDate);
    const overdue = isOverdue(goal.targetDate) && goal.status !== 'completed';

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-sm font-semibold text-gray-900 flex-1 pr-2">{goal.title}</h4>
          <span className={`px-1.5 py-0.5 text-xs font-bold rounded ${priorityColor(goal.priority)}`}>
            {goal.priority}
          </span>
        </div>

        <div className="flex items-center gap-1 mb-2 flex-wrap">
          <Badge variant="secondary">{goal.weakness}</Badge>
          {overdue &&
          <Badge variant="destructive">
              <AlertCircle className="w-3 h-3 mr-1" />
              Overdue
            </Badge>
          }
        </div>

        {goal.targetDate &&
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <Calendar className="w-3 h-3" />
            <span>{goal.targetDate}</span>
            {daysRemaining !== null && goal.status !== 'completed' &&
          <span className={`ml-1 ${overdue ? 'text-red-500' : 'text-gray-400'}`}>
                ({overdue ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days left`})
              </span>
          }
          </div>
        }

        {goal.successMetric &&
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
            <Target className="w-3 h-3" />
            {goal.successMetric}
          </div>
        }

        {goal.status === 'inprogress' &&
        <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <div className="flex items-center gap-2">
                <button
                onClick={() => updateProgress(goal.id, goal.progress - 10)}
                className="p-0.5 hover:bg-gray-100 rounded"
                title="Decrease progress">

                  <ChevronDown className="w-3 h-3" />
                </button>
                <span>{goal.progress}%</span>
                <button
                onClick={() => updateProgress(goal.id, goal.progress + 10)}
                className="p-0.5 hover:bg-gray-100 rounded"
                title="Increase progress">

                  <ChevronUp className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${goal.progress}%` }} />

            </div>
          </div>
        }

        {/* Milestones Preview */}
        {goal.milestones && goal.milestones.length > 0 &&
        <div className="mb-2">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Milestone className="w-3 h-3" />
              <span>
                {goal.milestones.filter((m) => m.completed).length}/{goal.milestones.length} milestones
              </span>
            </div>
          </div>
        }

        {/* Notes Preview */}
        {goal.notes && goal.notes.length > 0 &&
        <div className="mb-2">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MessageSquare className="w-3 h-3" />
              <span>{goal.notes.length} note(s)</span>
            </div>
          </div>
        }

        {/* Expanded Content */}
        {isExpanded &&
        <div className="mt-3 pt-3 border-t border-gray-100">
            {goal.description &&
          <p className="text-xs text-gray-600 mb-2">{goal.description}</p>
          }
            {goal.milestones && goal.milestones.length > 0 &&
          <div className="mb-2">
                <p className="text-xs font-medium text-gray-700 mb-1">Milestones:</p>
                <ul className="space-y-1">
                  {goal.milestones.map((m) =>
              <li key={m.id} className="flex items-center gap-2 text-xs">
                      <input
                  type="checkbox"
                  checked={m.completed}
                  onChange={() => toggleMilestone(goal.id, m.id)}
                  className="rounded" />

                      <span className={m.completed ? 'line-through text-gray-400' : 'text-gray-600'}>
                        {m.title}
                      </span>
                    </li>
              )}
                </ul>
              </div>
          }
            {goal.createdAt &&
          <p className="text-xs text-gray-400">Created: {goal.createdAt}</p>
          }
            {goal.updatedAt &&
          <p className="text-xs text-gray-400">Updated: {goal.updatedAt}</p>
          }
          </div>
        }

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex gap-1">
            {goal.status !== 'todo' &&
            <button
              onClick={() => moveGoal(goal.id, goal.status === 'completed' ? 'inprogress' : 'todo')}
              className="p-1 hover:bg-gray-100 rounded"
              title="Move left">

                <ArrowLeft className="w-3.5 h-3.5 text-gray-500" />
              </button>
            }
            {goal.status !== 'completed' &&
            <button
              onClick={() => moveGoal(goal.id, goal.status === 'todo' ? 'inprogress' : 'completed')}
              className="p-1 hover:bg-gray-100 rounded"
              title="Move right">

                <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
              </button>
            }
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => toggleGoalExpansion(goal.id)}
              className="p-1 hover:bg-gray-100 rounded"
              title={isExpanded ? 'Collapse' : 'Expand'}>

              {isExpanded ?
              <EyeOff className="w-3.5 h-3.5 text-gray-500" /> :

              <Eye className="w-3.5 h-3.5 text-gray-500" />
              }
            </button>
            <button
              onClick={() => openDetailModal(goal)}
              className="p-1 hover:bg-gray-100 rounded"
              title="View details">

              <BookOpen className="w-3.5 h-3.5 text-gray-500" />
            </button>
            <button
              onClick={() => openEditModal(goal)}
              className="p-1 hover:bg-gray-100 rounded"
              title="Edit">

              <Edit2 className="w-3.5 h-3.5 text-gray-500" />
            </button>
            <button
              onClick={() => duplicateGoal(goal)}
              className="p-1 hover:bg-gray-100 rounded"
              title="Duplicate">

              <Copy className="w-3.5 h-3.5 text-gray-500" />
            </button>
            {goal.status !== 'todo' &&
            <button
              onClick={() => resetGoalProgress(goal.id)}
              className="p-1 hover:bg-gray-100 rounded"
              title="Reset progress">

                <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
              </button>
            }
            <button
              onClick={() => removeGoal(goal.id)}
              className="p-1 hover:bg-red-50 rounded"
              title="Delete">

              <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
            </button>
          </div>
        </div>
      </div>);

  };

  const Column = ({
    title,
    icon: Icon,
    color,
    goals: columnGoals,
    headerBg






  }: {title: string;icon: any;color: string;goals: Goal[];headerBg: string;}) =>
  <div className="flex-1 min-w-[280px]">
      <div className={`${headerBg} rounded-t-lg px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${color}`} />
          <span className="text-sm font-semibold text-gray-800">{title}</span>
        </div>
        <span className="text-xs font-bold bg-white/60 px-2 py-0.5 rounded-full">
          {columnGoals.length}
        </span>
      </div>
      <div className="bg-gray-50 rounded-b-lg p-3 space-y-3 min-h-[300px] border border-t-0 border-gray-200">
        {columnGoals.map((g) =>
      <GoalCard key={g.id} goal={g} />
      )}
        {columnGoals.length === 0 &&
      <div className="text-center py-8 text-gray-400">
            <p className="text-sm">No goals here</p>
          </div>
      }
      </div>
    </div>;


  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">IDP / Training Needs Entry</h1>
          <p className="text-sm text-gray-500">
            Individual Development Plan — Track training goals and progress
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            options={employees.map((emp) => ({
              value: emp.id,
              label: `${emp.name} — ${emp.department}`
            }))}
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(e.target.value)} />

          <Button variant="primary" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Goal
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{goals.length}</p>
            <p className="text-xs text-gray-500">Total Goals</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
            <Clock className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{todoGoals.length}</p>
            <p className="text-xs text-gray-500">To Do</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Target className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{inProgressGoals.length}</p>
            <p className="text-xs text-gray-500">In Progress</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{completedGoals.length}</p>
            <p className="text-xs text-gray-500">Completed</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search goals by title, weakness, or success metric..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

            {searchQuery &&
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2">

                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            }
          </div>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {(filterPriority || filterWeakness) &&
            <span className="ml-2 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {[filterPriority, filterWeakness].filter(Boolean).length}
              </span>
            }
          </Button>
          <div className="flex items-center gap-2 border-l pl-4">
            <Select
              options={[
              { value: 'priority', label: 'Sort by Priority' },
              { value: 'targetDate', label: 'Sort by Target Date' },
              { value: 'title', label: 'Sort by Title' },
              { value: 'progress', label: 'Sort by Progress' },
              { value: 'createdAt', label: 'Sort by Created Date' }]
              }
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)} />

            <button onClick={toggleSortDirection} className="p-2 hover:bg-gray-100 rounded">
              {sortDirection === 'asc' ?
              <SortAsc className="w-4 h-4 text-gray-600" /> :

              <SortDesc className="w-4 h-4 text-gray-600" />
              }
            </button>
          </div>
          <div className="flex items-center gap-2 border-l pl-4">
            <Button variant="outline" onClick={exportGoals}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <label className="cursor-pointer">
              <Button variant="outline" as="span">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <input type="file" accept=".json" onChange={importGoals} className="hidden" />
            </label>
          </div>
        </div>

        {showFilters &&
        <div className="flex items-center gap-4 pt-4 border-t">
            <Select
            label="Priority"
            options={[
            { value: '', label: 'All Priorities' },
            { value: 'High', label: 'High' },
            { value: 'Medium', label: 'Medium' },
            { value: 'Low', label: 'Low' }]
            }
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)} />

            <Select
            label="Weakness"
            options={[
            { value: '', label: 'All Weaknesses' },
            ...weaknesses.map((w) => ({ value: w, label: w }))]
            }
            value={filterWeakness}
            onChange={(e) => setFilterWeakness(e.target.value)} />

            <Button variant="outline" onClick={resetFilters}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Filters
            </Button>
          </div>
        }
      </div>

      {/* Add Goal Form */}
      {showForm &&
      <Card title="Add New Learning Goal">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input
            label="Training / Goal Title *"
            value={newGoal.title}
            onChange={(e) => setNewGoal((p) => ({ ...p, title: e.target.value }))}
            placeholder="e.g., Advanced Classroom Management Workshop" />

            <Select
            label="Weakness Identified *"
            options={[
            { value: '', label: 'Select...' },
            ...weaknesses.map((w) => ({ value: w, label: w }))]
            }
            value={newGoal.weakness}
            onChange={(e) => setNewGoal((p) => ({ ...p, weakness: e.target.value }))} />

            <Input
            label="Target Completion Date"
            type="date"
            value={newGoal.targetDate}
            onChange={(e) => setNewGoal((p) => ({ ...p, targetDate: e.target.value }))} />

            <Input
            label="Success Metric"
            value={newGoal.successMetric}
            onChange={(e) => setNewGoal((p) => ({ ...p, successMetric: e.target.value }))}
            placeholder="How will success be measured?" />

            <Select
            label="Priority"
            options={[
            { value: 'High', label: 'High' },
            { value: 'Medium', label: 'Medium' },
            { value: 'Low', label: 'Low' }]
            }
            value={newGoal.priority}
            onChange={(e) => setNewGoal((p) => ({ ...p, priority: e.target.value as any }))} />

            <Input
            label="Description (Optional)"
            value={newGoal.description}
            onChange={(e) => setNewGoal((p) => ({ ...p, description: e.target.value }))}
            placeholder="Additional details about this goal" />

          </div>
          <div className="flex gap-2">
            <Button variant="primary" onClick={addGoal}>
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </Card>
      }

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        <Column
          title="To Do"
          icon={Clock}
          color="text-gray-600"
          goals={todoGoals}
          headerBg="bg-gray-200" />

        <Column
          title="In Progress"
          icon={Target}
          color="text-blue-600"
          goals={inProgressGoals}
          headerBg="bg-blue-200" />

        <Column
          title="Completed"
          icon={CheckCircle}
          color="text-green-600"
          goals={completedGoals}
          headerBg="bg-green-200" />

      </div>

      {/* Edit Modal */}
      {showEditModal && editingGoal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Edit Goal</h2>
              <button
              onClick={() => {
                setShowEditModal(false);
                setEditingGoal(null);
              }}
              className="p-1 hover:bg-gray-100 rounded">

                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <Input
              label="Training / Goal Title *"
              value={editingGoal.title}
              onChange={(e) => setEditingGoal((p) => p ? { ...p, title: e.target.value } : null)} />

              <Select
              label="Weakness Identified *"
              options={[
              { value: '', label: 'Select...' },
              ...weaknesses.map((w) => ({ value: w, label: w }))]
              }
              value={editingGoal.weakness}
              onChange={(e) =>
              setEditingGoal((p) => p ? { ...p, weakness: e.target.value } : null)
              } />

              <div className="grid grid-cols-2 gap-4">
                <Input
                label="Target Completion Date"
                type="date"
                value={editingGoal.targetDate}
                onChange={(e) =>
                setEditingGoal((p) => p ? { ...p, targetDate: e.target.value } : null)
                } />

                <Select
                label="Priority"
                options={[
                { value: 'High', label: 'High' },
                { value: 'Medium', label: 'Medium' },
                { value: 'Low', label: 'Low' }]
                }
                value={editingGoal.priority}
                onChange={(e) =>
                setEditingGoal((p) =>
                p ? { ...p, priority: e.target.value as 'High' | 'Medium' | 'Low' } : null
                )
                } />

              </div>
              <Input
              label="Success Metric"
              value={editingGoal.successMetric}
              onChange={(e) =>
              setEditingGoal((p) => p ? { ...p, successMetric: e.target.value } : null)
              } />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                value={editingGoal.description || ''}
                onChange={(e) =>
                setEditingGoal((p) => p ? { ...p, description: e.target.value } : null)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3} />

              </div>
              {editingGoal.status === 'inprogress' &&
            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Progress: {editingGoal.progress}%
                  </label>
                  <input
                type="range"
                min="0"
                max="100"
                value={editingGoal.progress}
                onChange={(e) =>
                setEditingGoal((p) =>
                p ? { ...p, progress: parseInt(e.target.value) } : null
                )
                }
                className="w-full" />

                </div>
            }
              <Select
              label="Status"
              options={[
              { value: 'todo', label: 'To Do' },
              { value: 'inprogress', label: 'In Progress' },
              { value: 'completed', label: 'Completed' }]
              }
              value={editingGoal.status}
              onChange={(e) =>
              setEditingGoal((p) =>
              p ?
              {
                ...p,
                status: e.target.value as 'todo' | 'inprogress' | 'completed',
                progress:
                e.target.value === 'completed' ?
                100 :
                e.target.value === 'todo' ?
                0 :
                p.progress
              } :
              null
              )
              } />

            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <Button
              variant="outline"
              onClick={() => {
                setShowEditModal(false);
                setEditingGoal(null);
              }}>

                Cancel
              </Button>
              <Button variant="primary" onClick={saveEditedGoal}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Detail Modal */}
      {showDetailModal && viewingGoal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Goal Details</h2>
              <button
              onClick={() => {
                setShowDetailModal(false);
                setViewingGoal(null);
                setNewNote('');
                setNewMilestoneTitle('');
                setShowMilestoneInput(false);
              }}
              className="p-1 hover:bg-gray-100 rounded">

                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-6">
              {/* Goal Header */}
              <div>
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">{viewingGoal.title}</h3>
                  <span
                  className={`px-2 py-1 text-xs font-bold rounded ${priorityColor(
                    viewingGoal.priority
                  )}`}>

                    {viewingGoal.priority} Priority
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">{viewingGoal.weakness}</Badge>
                  <Badge
                  variant={
                  viewingGoal.status === 'completed' ?
                  'success' :
                  viewingGoal.status === 'inprogress' ?
                  'primary' :
                  'default'
                  }>

                    {viewingGoal.status === 'todo' ?
                  'To Do' :
                  viewingGoal.status === 'inprogress' ?
                  'In Progress' :
                  'Completed'}
                  </Badge>
                </div>
              </div>

              {/* Goal Info */}
              <div className="grid grid-cols-2 gap-4">
                {viewingGoal.targetDate &&
              <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      Target: {viewingGoal.targetDate}
                      {isOverdue(viewingGoal.targetDate) && viewingGoal.status !== 'completed' &&
                  <span className="text-red-500 ml-2">(Overdue)</span>
                  }
                    </span>
                  </div>
              }
                {viewingGoal.successMetric &&
              <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Success: {viewingGoal.successMetric}</span>
                  </div>
              }
                {viewingGoal.createdAt &&
              <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Created: {viewingGoal.createdAt}</span>
                  </div>
              }
                {viewingGoal.updatedAt &&
              <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Updated: {viewingGoal.updatedAt}</span>
                  </div>
              }
              </div>

              {viewingGoal.description &&
            <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Description</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{viewingGoal.description}</p>
                </div>
            }

              {/* Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Progress</h4>
                  <span className="text-sm font-semibold">{viewingGoal.progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${viewingGoal.progress}%` }} />

                </div>
              </div>

              {/* Milestones */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700">
                    Milestones ({viewingGoal.milestones?.filter((m) => m.completed).length || 0}/
                    {viewingGoal.milestones?.length || 0})
                  </h4>
                  <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMilestoneInput(!showMilestoneInput)}>

                    <Plus className="w-3 h-3 mr-1" />
                    Add Milestone
                  </Button>
                </div>
                {showMilestoneInput &&
              <div className="flex items-center gap-2 mb-3">
                    <input
                  type="text"
                  placeholder="Enter milestone title..."
                  value={newMilestoneTitle}
                  onChange={(e) => setNewMilestoneTitle(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addMilestone(viewingGoal.id, newMilestoneTitle);
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

                    <Button
                  variant="primary"
                  size="sm"
                  onClick={() => addMilestone(viewingGoal.id, newMilestoneTitle)}>

                      Add
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowMilestoneInput(false)}>
                      Cancel
                    </Button>
                  </div>
              }
                {viewingGoal.milestones && viewingGoal.milestones.length > 0 ?
              <ul className="space-y-2">
                    {viewingGoal.milestones.map((m) =>
                <li
                  key={m.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded">

                        <div className="flex items-center gap-3">
                          <input
                      type="checkbox"
                      checked={m.completed}
                      onChange={() => toggleMilestone(viewingGoal.id, m.id)}
                      className="rounded" />

                          <span
                      className={m.completed ? 'line-through text-gray-400' : 'text-gray-700'}>

                            {m.title}
                          </span>
                        </div>
                        <button
                    onClick={() => removeMilestone(viewingGoal.id, m.id)}
                    className="p-1 hover:bg-red-50 rounded">

                          <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                        </button>
                      </li>
                )}
                  </ul> :

              <p className="text-sm text-gray-400 text-center py-4">No milestones added yet</p>
              }
              </div>

              {/* Notes */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Notes ({viewingGoal.notes?.length || 0})
                </h4>
                <div className="flex items-start gap-2 mb-3">
                  <textarea
                  placeholder="Add a note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2} />

                  <Button
                  variant="primary"
                  onClick={() => addNote(viewingGoal.id, newNote)}
                  disabled={!newNote.trim()}>

                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {viewingGoal.notes && viewingGoal.notes.length > 0 ?
              <ul className="space-y-2">
                    {viewingGoal.notes.map((note) =>
                <li key={note.id} className="p-3 bg-gray-50 rounded">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm text-gray-700">{note.content}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {note.author} • {new Date(note.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                      onClick={() => removeNote(viewingGoal.id, note.id)}
                      className="p-1 hover:bg-red-50 rounded">

                            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                          </button>
                        </div>
                      </li>
                )}
                  </ul> :

              <p className="text-sm text-gray-400 text-center py-4">No notes added yet</p>
              }
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <Button
              variant="outline"
              onClick={() => {
                openEditModal(viewingGoal);
                setShowDetailModal(false);
              }}>

                <Edit2 className="w-4 h-4 mr-2" />
                Edit Goal
              </Button>
              <Button
              variant="primary"
              onClick={() => {
                setShowDetailModal(false);
                setViewingGoal(null);
              }}>

                Close
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}