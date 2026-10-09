import React, { useState, useMemo, useCallback, useRef } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import {
  Download,
  FileSpreadsheet,
  Search,
  Filter,
  BookOpen,
  Users,
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Calendar,
  TrendingUp,
  BarChart3,
  Printer,
  X,
  Edit2,
  Save,
  Trash2,
  Eye,
  MessageSquare,
  Plus,
  RotateCcw,
  ChevronUp,
  ChevronsUpDown,
  CheckSquare,
  Square,
  RefreshCw,
  Mail,
  Bell,
  FileText,
  ArrowUpDown,
  SortAsc,
  SortDesc } from
'lucide-react';

interface Note {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

interface TrainingNeed {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  weakness: string;
  proposedTraining: string;
  priority: 'High' | 'Medium' | 'Low';
  targetDate: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
  appraisalScore: number;
  grade: string;
  description?: string;
  completedDate?: string;
  notes?: Note[];
  assignedTrainer?: string;
  budget?: number;
  actualCost?: number;
  createdAt?: string;
  updatedAt?: string;
}

const priorityColor = (p: string) =>
p === 'High' ?
'bg-red-100 text-red-700' :
p === 'Medium' ?
'bg-amber-100 text-amber-700' :
'bg-green-100 text-green-700';

const statusColor = (s: string) => {
  if (s === 'Completed') return 'bg-green-100 text-green-700';
  if (s === 'In Progress') return 'bg-blue-100 text-blue-700';
  if (s === 'Overdue') return 'bg-red-100 text-red-700';
  return 'bg-gray-100 text-gray-700';
};

const initialMockData: TrainingNeed[] = [
{
  id: '1',
  employeeName: 'Dr. Robert Smith',
  employeeId: 'EMP001',
  department: 'Mathematics',
  weakness: 'Technology Integration',
  proposedTraining: 'Google Certified Educator Level 2',
  priority: 'High',
  targetDate: '2025-06-30',
  status: 'In Progress',
  appraisalScore: 84,
  grade: 'A',
  description: 'Complete Google certification to enhance digital teaching capabilities.',
  assignedTrainer: 'Google Training Center',
  budget: 500,
  createdAt: '2025-01-01',
  updatedAt: '2025-01-15',
  notes: [
  {
    id: 'n1',
    content: 'Started online modules, progressing well.',
    author: 'HR Manager',
    createdAt: '2025-01-15'
  }]

},
{
  id: '2',
  employeeName: 'Dr. Robert Smith',
  employeeId: 'EMP001',
  department: 'Mathematics',
  weakness: 'Student Engagement',
  proposedTraining: 'Peer Observation Program',
  priority: 'Medium',
  targetDate: '2025-04-15',
  status: 'In Progress',
  appraisalScore: 84,
  grade: 'A',
  description: 'Participate in peer observation sessions to learn engagement techniques.',
  createdAt: '2025-01-02',
  notes: []
},
{
  id: '3',
  employeeName: 'Mr. Michael Chen',
  employeeId: 'EMP003',
  department: 'Science',
  weakness: 'Classroom Management',
  proposedTraining: 'Advanced Classroom Management Workshop',
  priority: 'High',
  targetDate: '2025-03-31',
  status: 'Pending',
  appraisalScore: 72,
  grade: 'B',
  description: 'Intensive workshop on managing large classroom settings.',
  budget: 750,
  createdAt: '2025-01-03',
  notes: []
},
{
  id: '4',
  employeeName: 'Mr. Michael Chen',
  employeeId: 'EMP003',
  department: 'Science',
  weakness: 'Assessment & Evaluation',
  proposedTraining: 'Assessment Design Course',
  priority: 'Medium',
  targetDate: '2025-05-31',
  status: 'Pending',
  appraisalScore: 72,
  grade: 'B',
  description: 'Learn modern assessment methodologies and rubric design.',
  createdAt: '2025-01-04',
  notes: []
},
{
  id: '5',
  employeeName: 'Ms. Emily Davis',
  employeeId: 'EMP004',
  department: 'English',
  weakness: 'Technology Integration',
  proposedTraining: 'Digital Teaching Tools Certification',
  priority: 'High',
  targetDate: '2025-04-30',
  status: 'In Progress',
  appraisalScore: 77,
  grade: 'B+',
  description: 'Certification program for digital classroom tools.',
  assignedTrainer: 'EdTech Academy',
  budget: 600,
  createdAt: '2025-01-05',
  notes: []
},
{
  id: '6',
  employeeName: 'Mr. David Wilson',
  employeeId: 'EMP005',
  department: 'English',
  weakness: 'Subject Knowledge',
  proposedTraining: 'Advanced English Literature Course',
  priority: 'High',
  targetDate: '2025-03-15',
  status: 'Overdue',
  appraisalScore: 61,
  grade: 'B',
  description: 'Advanced course in modern English literature.',
  budget: 800,
  createdAt: '2024-12-01',
  notes: [
  {
    id: 'n1',
    content: 'Training delayed due to scheduling conflicts.',
    author: 'Department Head',
    createdAt: '2025-03-10'
  }]

},
{
  id: '7',
  employeeName: 'Mr. David Wilson',
  employeeId: 'EMP005',
  department: 'English',
  weakness: 'Communication Skills',
  proposedTraining: 'Communication Skills Seminar',
  priority: 'Medium',
  targetDate: '2025-05-31',
  status: 'Pending',
  appraisalScore: 61,
  grade: 'B',
  description: 'Two-day intensive seminar on effective communication.',
  createdAt: '2025-01-06',
  notes: []
},
{
  id: '8',
  employeeName: 'Mr. David Wilson',
  employeeId: 'EMP005',
  department: 'English',
  weakness: 'Professional Development',
  proposedTraining: 'Teaching Methodology Workshop',
  priority: 'Low',
  targetDate: '2025-07-31',
  status: 'Pending',
  appraisalScore: 61,
  grade: 'B',
  description: 'Workshop covering modern teaching methodologies.',
  createdAt: '2025-01-07',
  notes: []
},
{
  id: '9',
  employeeName: 'Mr. Thomas White',
  employeeId: 'EMP011',
  department: 'Administration',
  weakness: 'Communication Skills',
  proposedTraining: 'Business Communication Course',
  priority: 'High',
  targetDate: '2025-04-30',
  status: 'Pending',
  appraisalScore: 49,
  grade: 'C',
  description: 'Professional business communication training.',
  budget: 400,
  createdAt: '2025-01-08',
  notes: []
},
{
  id: '10',
  employeeName: 'Mr. Thomas White',
  employeeId: 'EMP011',
  department: 'Administration',
  weakness: 'Technology Integration',
  proposedTraining: 'MS Office Advanced Training',
  priority: 'High',
  targetDate: '2025-03-31',
  status: 'Completed',
  appraisalScore: 49,
  grade: 'C',
  description: 'Advanced Microsoft Office skills training.',
  completedDate: '2025-03-25',
  actualCost: 350,
  budget: 400,
  createdAt: '2025-01-09',
  updatedAt: '2025-03-25',
  notes: [
  {
    id: 'n1',
    content: 'Successfully completed with excellent results.',
    author: 'HR Manager',
    createdAt: '2025-03-25'
  }]

},
{
  id: '11',
  employeeName: 'Mrs. Lisa Taylor',
  employeeId: 'EMP006',
  department: 'Science',
  weakness: 'Teamwork & Collaboration',
  proposedTraining: 'Team Leadership Workshop',
  priority: 'Low',
  targetDate: '2025-08-31',
  status: 'Pending',
  appraisalScore: 86,
  grade: 'A',
  description: 'Leadership and team collaboration training.',
  createdAt: '2025-01-10',
  notes: []
}];


type SortField = 'employeeName' | 'department' | 'priority' | 'targetDate' | 'status' | 'appraisalScore';
type SortDirection = 'asc' | 'desc';

export function TrainingNeedsActionPlanReport() {
  const [data, setData] = useState<TrainingNeed[]>(initialMockData);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [weaknessFilter, setWeaknessFilter] = useState('');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');
  const [groupBy, setGroupBy] = useState<'department' | 'weakness' | 'employee' | 'status' | 'priority'>('department');
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>('targetDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkActionModal, setShowBulkActionModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TrainingNeed | null>(null);
  const [editingItem, setEditingItem] = useState<TrainingNeed | null>(null);
  const [newNote, setNewNote] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const [newItem, setNewItem] = useState<Partial<TrainingNeed>>({
    employeeName: '',
    employeeId: '',
    department: '',
    weakness: '',
    proposedTraining: '',
    priority: 'Medium',
    targetDate: '',
    status: 'Pending',
    appraisalScore: 0,
    grade: '',
    description: '',
    budget: 0
  });

  const departments = useMemo(() => [...new Set(data.map((d) => d.department))], [data]);
  const weaknesses = useMemo(() => [...new Set(data.map((d) => d.weakness))], [data]);
  const employees = useMemo(() => {
    const unique = new Map<string, {id: string;name: string;department: string;}>();
    data.forEach((d) => {
      if (!unique.has(d.employeeId)) {
        unique.set(d.employeeId, { id: d.employeeId, name: d.employeeName, department: d.department });
      }
    });
    return Array.from(unique.values());
  }, [data]);

  const filtered = useMemo(() => {
    return data.filter((d) => {
      const matchSearch =
      d.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      d.proposedTraining.toLowerCase().includes(search.toLowerCase()) ||
      d.weakness.toLowerCase().includes(search.toLowerCase()) ||
      d.employeeId.toLowerCase().includes(search.toLowerCase());
      const matchDept = !deptFilter || d.department === deptFilter;
      const matchStatus = !statusFilter || d.status === statusFilter;
      const matchPriority = !priorityFilter || d.priority === priorityFilter;
      const matchWeakness = !weaknessFilter || d.weakness === weaknessFilter;
      const matchDateFrom = !dateFromFilter || new Date(d.targetDate) >= new Date(dateFromFilter);
      const matchDateTo = !dateToFilter || new Date(d.targetDate) <= new Date(dateToFilter);
      return matchSearch && matchDept && matchStatus && matchPriority && matchWeakness && matchDateFrom && matchDateTo;
    });
  }, [data, search, deptFilter, statusFilter, priorityFilter, weaknessFilter, dateFromFilter, dateToFilter]);

  const sortedFiltered = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'employeeName':
          comparison = a.employeeName.localeCompare(b.employeeName);
          break;
        case 'department':
          comparison = a.department.localeCompare(b.department);
          break;
        case 'priority':
          const priorityOrder = { High: 3, Medium: 2, Low: 1 };
          comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
          break;
        case 'targetDate':
          comparison = new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
          break;
        case 'status':
          const statusOrder = { Overdue: 4, Pending: 3, 'In Progress': 2, Completed: 1 };
          comparison = statusOrder[b.status] - statusOrder[a.status];
          break;
        case 'appraisalScore':
          comparison = a.appraisalScore - b.appraisalScore;
          break;
      }
      return sortDirection === 'desc' ? -comparison : comparison;
    });
  }, [filtered, sortField, sortDirection]);

  const grouped = useMemo(() => {
    return sortedFiltered.reduce(
      (acc, item) => {
        let key = '';
        switch (groupBy) {
          case 'department':
            key = item.department;
            break;
          case 'weakness':
            key = item.weakness;
            break;
          case 'employee':
            key = item.employeeName;
            break;
          case 'status':
            key = item.status;
            break;
          case 'priority':
            key = item.priority;
            break;
        }
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      },
      {} as Record<string, TrainingNeed[]>
    );
  }, [sortedFiltered, groupBy]);

  const toggleCollapse = (key: string) =>
  setCollapsed((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);

  const expandAll = () => setCollapsed([]);

  const collapseAll = () => setCollapsed(Object.keys(grouped));

  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    setSelectedItems(new Set(sortedFiltered.map((d) => d.id)));
  };

  const deselectAll = () => {
    setSelectedItems(new Set());
  };

  const toggleSelectGroup = (groupItems: TrainingNeed[]) => {
    const groupIds = groupItems.map((i) => i.id);
    const allSelected = groupIds.every((id) => selectedItems.has(id));
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (allSelected) {
        groupIds.forEach((id) => newSet.delete(id));
      } else {
        groupIds.forEach((id) => newSet.add(id));
      }
      return newSet;
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 text-gray-400" />;
    return sortDirection === 'asc' ?
    <SortAsc className="w-3 h-3 text-blue-600" /> :

    <SortDesc className="w-3 h-3 text-blue-600" />;

  };

  const updateItemStatus = (id: string, newStatus: TrainingNeed['status']) => {
    setData((prev) =>
    prev.map((item) =>
    item.id === id ?
    {
      ...item,
      status: newStatus,
      completedDate: newStatus === 'Completed' ? new Date().toISOString().split('T')[0] : item.completedDate,
      updatedAt: new Date().toISOString().split('T')[0]
    } :
    item
    )
    );
  };

  const bulkUpdateStatus = (newStatus: TrainingNeed['status']) => {
    setData((prev) =>
    prev.map((item) =>
    selectedItems.has(item.id) ?
    {
      ...item,
      status: newStatus,
      completedDate: newStatus === 'Completed' ? new Date().toISOString().split('T')[0] : item.completedDate,
      updatedAt: new Date().toISOString().split('T')[0]
    } :
    item
    )
    );
    setSelectedItems(new Set());
    setShowBulkActionModal(false);
  };

  const bulkUpdatePriority = (newPriority: TrainingNeed['priority']) => {
    setData((prev) =>
    prev.map((item) =>
    selectedItems.has(item.id) ?
    {
      ...item,
      priority: newPriority,
      updatedAt: new Date().toISOString().split('T')[0]
    } :
    item
    )
    );
    setSelectedItems(new Set());
    setShowBulkActionModal(false);
  };

  const bulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedItems.size} selected items?`)) {
      setData((prev) => prev.filter((item) => !selectedItems.has(item.id)));
      setSelectedItems(new Set());
      setShowBulkActionModal(false);
    }
  };

  const deleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this training need?')) {
      setData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const openDetailModal = (item: TrainingNeed) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const openEditModal = (item: TrainingNeed) => {
    setEditingItem({ ...item });
    setShowEditModal(true);
  };

  const saveEditedItem = () => {
    if (!editingItem) return;
    setData((prev) =>
    prev.map((item) =>
    item.id === editingItem.id ?
    {
      ...editingItem,
      updatedAt: new Date().toISOString().split('T')[0]
    } :
    item
    )
    );
    setShowEditModal(false);
    setEditingItem(null);
  };

  const addNote = (itemId: string, content: string) => {
    if (!content.trim()) return;
    const note: Note = {
      id: `note-${Date.now()}`,
      content: content.trim(),
      author: 'Current User',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setData((prev) =>
    prev.map((item) =>
    item.id === itemId ?
    {
      ...item,
      notes: [...(item.notes || []), note],
      updatedAt: new Date().toISOString().split('T')[0]
    } :
    item
    )
    );
    if (selectedItem && selectedItem.id === itemId) {
      setSelectedItem({
        ...selectedItem,
        notes: [...(selectedItem.notes || []), note]
      });
    }
    setNewNote('');
  };

  const deleteNote = (itemId: string, noteId: string) => {
    setData((prev) =>
    prev.map((item) =>
    item.id === itemId ?
    {
      ...item,
      notes: item.notes?.filter((n) => n.id !== noteId),
      updatedAt: new Date().toISOString().split('T')[0]
    } :
    item
    )
    );
    if (selectedItem && selectedItem.id === itemId) {
      setSelectedItem({
        ...selectedItem,
        notes: selectedItem.notes?.filter((n) => n.id !== noteId)
      });
    }
  };

  const addNewItem = () => {
    if (!newItem.employeeName || !newItem.proposedTraining || !newItem.weakness) {
      alert('Please fill in required fields: Employee Name, Proposed Training, and Weakness Area');
      return;
    }
    const now = new Date().toISOString().split('T')[0];
    const item: TrainingNeed = {
      id: `new-${Date.now()}`,
      employeeName: newItem.employeeName || '',
      employeeId: newItem.employeeId || `EMP${Date.now()}`,
      department: newItem.department || '',
      weakness: newItem.weakness || '',
      proposedTraining: newItem.proposedTraining || '',
      priority: newItem.priority || 'Medium',
      targetDate: newItem.targetDate || '',
      status: 'Pending',
      appraisalScore: newItem.appraisalScore || 0,
      grade: newItem.grade || '',
      description: newItem.description,
      budget: newItem.budget,
      createdAt: now,
      notes: []
    };
    setData((prev) => [...prev, item]);
    setNewItem({
      employeeName: '',
      employeeId: '',
      department: '',
      weakness: '',
      proposedTraining: '',
      priority: 'Medium',
      targetDate: '',
      status: 'Pending',
      appraisalScore: 0,
      grade: '',
      description: '',
      budget: 0
    });
    setShowAddModal(false);
  };

  const resetFilters = () => {
    setSearch('');
    setDeptFilter('');
    setStatusFilter('');
    setPriorityFilter('');
    setWeaknessFilter('');
    setDateFromFilter('');
    setDateToFilter('');
  };

  const exportToExcel = () => {
    const headers = [
    'Employee ID',
    'Employee Name',
    'Department',
    'Weakness Area',
    'Proposed Training',
    'Priority',
    'Target Date',
    'Status',
    'Appraisal Score',
    'Grade',
    'Description',
    'Budget',
    'Actual Cost',
    'Completed Date'];

    const rows = sortedFiltered.map((item) => [
    item.employeeId,
    item.employeeName,
    item.department,
    item.weakness,
    item.proposedTraining,
    item.priority,
    item.targetDate,
    item.status,
    item.appraisalScore,
    item.grade,
    item.description || '',
    item.budget || '',
    item.actualCost || '',
    item.completedDate || '']
    );

    const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `training_needs_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    const dataToExport = {
      exportedAt: new Date().toISOString(),
      totalRecords: sortedFiltered.length,
      filters: {
        department: deptFilter,
        status: statusFilter,
        priority: priorityFilter,
        weakness: weaknessFilter,
        dateFrom: dateFromFilter,
        dateTo: dateToFilter
      },
      data: sortedFiltered
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `training_needs_report_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printContent = document.createElement('div');
    printContent.innerHTML = `
      <html>
        <head>
          <title>Training Needs & Action Plan Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { font-size: 24px; margin-bottom: 10px; }
            .summary { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .group-header { background-color: #e5e5e5; font-weight: bold; }
            @media print { body { -webkit-print-color-adjust: exact; } }
          </style>
        </head>
        <body>
          <h1>Training Needs & Action Plan Report</h1>
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <div class="summary">
            <p>Total Records: ${sortedFiltered.length}</p>
            <p>Pending: ${sortedFiltered.filter((d) => d.status === 'Pending').length}</p>
            <p>In Progress: ${sortedFiltered.filter((d) => d.status === 'In Progress').length}</p>
            <p>Completed: ${sortedFiltered.filter((d) => d.status === 'Completed').length}</p>
            <p>Overdue: ${sortedFiltered.filter((d) => d.status === 'Overdue').length}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Weakness</th>
                <th>Training</th>
                <th>Priority</th>
                <th>Target Date</th>
                <th>Status</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              ${sortedFiltered.
    map(
      (item) => `
                <tr>
                  <td>${item.employeeName}<br/><small>${item.employeeId}</small></td>
                  <td>${item.department}</td>
                  <td>${item.weakness}</td>
                  <td>${item.proposedTraining}</td>
                  <td>${item.priority}</td>
                  <td>${item.targetDate}</td>
                  <td>${item.status}</td>
                  <td>${item.appraisalScore}</td>
                </tr>
              `
    ).
    join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent.innerHTML);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const sendReminder = (item: TrainingNeed) => {
    alert(`Reminder sent to ${item.employeeName} for "${item.proposedTraining}"`);
    const note: Note = {
      id: `note-${Date.now()}`,
      content: `Reminder sent for this training.`,
      author: 'System',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setData((prev) =>
    prev.map((d) =>
    d.id === item.id ?
    {
      ...d,
      notes: [...(d.notes || []), note]
    } :
    d
    )
    );
  };

  const sendBulkReminders = () => {
    const selectedData = data.filter((d) => selectedItems.has(d.id));
    selectedData.forEach((item) => {
      const note: Note = {
        id: `note-${Date.now()}-${item.id}`,
        content: `Bulk reminder sent for this training.`,
        author: 'System',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setData((prev) =>
      prev.map((d) =>
      d.id === item.id ?
      {
        ...d,
        notes: [...(d.notes || []), note]
      } :
      d
      )
      );
    });
    alert(`Reminders sent to ${selectedData.length} employees`);
    setSelectedItems(new Set());
    setShowBulkActionModal(false);
  };

  const checkOverdueItems = () => {
    const today = new Date();
    setData((prev) =>
    prev.map((item) => {
      if (item.status !== 'Completed' && new Date(item.targetDate) < today) {
        return { ...item, status: 'Overdue' };
      }
      return item;
    })
    );
  };

  const duplicateItem = (item: TrainingNeed) => {
    const now = new Date().toISOString().split('T')[0];
    const duplicated: TrainingNeed = {
      ...item,
      id: `dup-${Date.now()}`,
      status: 'Pending',
      completedDate: undefined,
      actualCost: undefined,
      createdAt: now,
      updatedAt: now,
      notes: []
    };
    setData((prev) => [...prev, duplicated]);
  };

  const getDaysUntilTarget = (targetDate: string) => {
    const diff = new Date(targetDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const pendingCount = filtered.filter((d) => d.status === 'Pending').length;
  const inProgressCount = filtered.filter((d) => d.status === 'In Progress').length;
  const completedCount = filtered.filter((d) => d.status === 'Completed').length;
  const overdueCount = filtered.filter((d) => d.status === 'Overdue').length;

  return (
    <div className="space-y-6 p-6" ref={printRef}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Training Needs & Action Plan Report</h1>
          <p className="text-sm text-gray-500">Track training requirements identified from appraisal results</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Training Need
          </Button>
          <Button variant="outline" onClick={checkOverdueItems}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Check Overdue
          </Button>
          <Button variant="outline" onClick={exportToExcel}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button variant="outline" onClick={exportToJSON}>
            <Download className="w-4 h-4 mr-2" />
            Export JSON
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{filtered.length}</p>
            <p className="text-xs text-gray-500">Total Needs</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
            <Clock className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{pendingCount}</p>
            <p className="text-xs text-gray-500">Pending</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Target className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{inProgressCount}</p>
            <p className="text-xs text-gray-500">In Progress</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{completedCount}</p>
            <p className="text-xs text-gray-500">Completed</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{overdueCount}</p>
            <p className="text-xs text-gray-500">Overdue</p>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedItems.size > 0 &&
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-blue-800">{selectedItems.size} items selected</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowBulkActionModal(true)}>
              Bulk Actions
            </Button>
            <Button variant="outline" size="sm" onClick={deselectAll}>
              Clear Selection
            </Button>
          </div>
        </div>
      }

      <Card>
        {/* Search and Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, training, weakness, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

            {search &&
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2">

                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            }
          </div>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {(deptFilter || statusFilter || priorityFilter || weaknessFilter || dateFromFilter || dateToFilter) &&
            <span className="ml-2 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {[deptFilter, statusFilter, priorityFilter, weaknessFilter, dateFromFilter, dateToFilter].filter(Boolean).length}
              </span>
            }
          </Button>
          <Select
            options={[
            { value: 'department', label: 'Group by Department' },
            { value: 'weakness', label: 'Group by Weakness' },
            { value: 'employee', label: 'Group by Employee' },
            { value: 'status', label: 'Group by Status' },
            { value: 'priority', label: 'Group by Priority' }]
            }
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as any)} />

          <div className="flex gap-1 border-l pl-3">
            <Button variant="outline" size="sm" onClick={expandAll}>
              Expand All
            </Button>
            <Button variant="outline" size="sm" onClick={collapseAll}>
              Collapse All
            </Button>
          </div>
          <div className="flex gap-1 border-l pl-3">
            <Button variant="outline" size="sm" onClick={selectAll}>
              Select All
            </Button>
            <Button variant="outline" size="sm" onClick={deselectAll}>
              Deselect All
            </Button>
          </div>
        </div>

        {/* Extended Filters */}
        {showFilters &&
        <div className="grid grid-cols-6 gap-3 mb-4 p-4 bg-gray-50 rounded-lg">
            <Select
            label="Department"
            options={[{ value: '', label: 'All Departments' }, ...departments.map((d) => ({ value: d, label: d }))]}
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)} />

            <Select
            label="Status"
            options={[
            { value: '', label: 'All Status' },
            { value: 'Pending', label: 'Pending' },
            { value: 'In Progress', label: 'In Progress' },
            { value: 'Completed', label: 'Completed' },
            { value: 'Overdue', label: 'Overdue' }]
            }
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)} />

            <Select
            label="Priority"
            options={[
            { value: '', label: 'All Priority' },
            { value: 'High', label: 'High' },
            { value: 'Medium', label: 'Medium' },
            { value: 'Low', label: 'Low' }]
            }
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)} />

            <Select
            label="Weakness"
            options={[{ value: '', label: 'All Weaknesses' }, ...weaknesses.map((w) => ({ value: w, label: w }))]}
            value={weaknessFilter}
            onChange={(e) => setWeaknessFilter(e.target.value)} />

            <Input
            label="Date From"
            type="date"
            value={dateFromFilter}
            onChange={(e) => setDateFromFilter(e.target.value)} />

            <Input
            label="Date To"
            type="date"
            value={dateToFilter}
            onChange={(e) => setDateToFilter(e.target.value)} />

            <div className="col-span-6 flex justify-end">
              <Button variant="outline" onClick={resetFilters}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Filters
              </Button>
            </div>
          </div>
        }

        {/* Data Table */}
        <div className="space-y-4">
          {Object.entries(grouped).map(([key, items]) =>
          <div key={key} className="border rounded-lg overflow-hidden">
              <button
              onClick={() => toggleCollapse(key)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors">

                <div className="flex items-center gap-2">
                  <input
                  type="checkbox"
                  checked={items.every((i) => selectedItems.has(i.id))}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleSelectGroup(items);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="rounded" />

                  {collapsed.includes(key) ?
                <ChevronRight className="w-4 h-4 text-gray-400" /> :

                <ChevronDown className="w-4 h-4 text-gray-400" />
                }
                  <span className="text-sm font-semibold text-gray-800">{key}</span>
                  <Badge variant="secondary">{items.length} items</Badge>
                </div>
                <div className="flex gap-2">
                  {items.some((i) => i.status === 'Overdue') && <Badge variant="danger">Overdue</Badge>}
                  {items.some((i) => i.priority === 'High') &&
                <span className="px-2 py-0.5 text-xs font-bold rounded bg-red-100 text-red-700">High Priority</span>
                }
                </div>
              </button>
              {!collapsed.includes(key) &&
            <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/50">
                      <th className="w-10 py-2 px-2">
                        <span className="sr-only">Select</span>
                      </th>
                      {groupBy !== 'employee' &&
                  <th
                    className="text-left py-2 px-4 text-xs font-medium text-gray-500 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('employeeName')}>

                          <div className="flex items-center gap-1">
                            Employee
                            {getSortIcon('employeeName')}
                          </div>
                        </th>
                  }
                      {groupBy !== 'weakness' &&
                  <th className="text-left py-2 px-4 text-xs font-medium text-gray-500">Weakness Area</th>
                  }
                      <th className="text-left py-2 px-4 text-xs font-medium text-gray-500">Proposed Training</th>
                      <th
                    className="text-center py-2 px-4 text-xs font-medium text-gray-500 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('priority')}>

                        <div className="flex items-center justify-center gap-1">
                          Priority
                          {getSortIcon('priority')}
                        </div>
                      </th>
                      <th
                    className="text-center py-2 px-4 text-xs font-medium text-gray-500 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('targetDate')}>

                        <div className="flex items-center justify-center gap-1">
                          Target Date
                          {getSortIcon('targetDate')}
                        </div>
                      </th>
                      <th
                    className="text-center py-2 px-4 text-xs font-medium text-gray-500 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('status')}>

                        <div className="flex items-center justify-center gap-1">
                          Status
                          {getSortIcon('status')}
                        </div>
                      </th>
                      <th
                    className="text-center py-2 px-4 text-xs font-medium text-gray-500 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('appraisalScore')}>

                        <div className="flex items-center justify-center gap-1">
                          Score
                          {getSortIcon('appraisalScore')}
                        </div>
                      </th>
                      <th className="text-center py-2 px-4 text-xs font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, i) => {
                  const daysUntil = getDaysUntilTarget(item.targetDate);
                  return (
                    <tr
                      key={item.id}
                      className={`border-b border-gray-100 ${
                      item.status === 'Overdue' ? 'bg-red-50/50' : i % 2 ? 'bg-gray-50/30' : ''} ${
                      selectedItems.has(item.id) ? 'bg-blue-50' : ''}`}>

                          <td className="py-2.5 px-2 text-center">
                            <input
                          type="checkbox"
                          checked={selectedItems.has(item.id)}
                          onChange={() => toggleSelectItem(item.id)}
                          className="rounded" />

                          </td>
                          {groupBy !== 'employee' &&
                      <td className="py-2.5 px-4">
                              <p className="text-sm font-medium text-gray-900">{item.employeeName}</p>
                              <p className="text-xs text-gray-500">
                                {item.employeeId} · {item.department}
                              </p>
                            </td>
                      }
                          {groupBy !== 'weakness' &&
                      <td className="py-2.5 px-4">
                              <Badge variant="secondary">{item.weakness}</Badge>
                            </td>
                      }
                          <td className="py-2.5 px-4">
                            <p className="text-sm text-gray-900">{item.proposedTraining}</p>
                            {item.notes && item.notes.length > 0 &&
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                <MessageSquare className="w-3 h-3" />
                                {item.notes.length} note(s)
                              </p>
                        }
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            <span className={`px-2 py-0.5 text-xs font-bold rounded ${priorityColor(item.priority)}`}>
                              {item.priority}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            <p className="text-sm text-gray-600">{item.targetDate}</p>
                            {item.status !== 'Completed' && daysUntil !== null &&
                        <p className={`text-xs ${daysUntil < 0 ? 'text-red-500' : daysUntil <= 7 ? 'text-amber-500' : 'text-gray-400'}`}>
                                {daysUntil < 0 ? `${Math.abs(daysUntil)} days overdue` : `${daysUntil} days left`}
                              </p>
                        }
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            <select
                          value={item.status}
                          onChange={(e) => updateItemStatus(item.id, e.target.value as TrainingNeed['status'])}
                          className={`px-2 py-0.5 text-xs font-medium rounded-full border-0 cursor-pointer ${statusColor(item.status)}`}>

                              <option value="Pending">Pending</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                              <option value="Overdue">Overdue</option>
                            </select>
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            <span className="text-sm font-bold text-gray-700">{item.appraisalScore}</span>
                          </td>
                          <td className="py-2.5 px-4">
                            <div className="flex items-center justify-center gap-1">
                              <button
                            onClick={() => openDetailModal(item)}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="View Details">

                                <Eye className="w-4 h-4 text-gray-500" />
                              </button>
                              <button
                            onClick={() => openEditModal(item)}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="Edit">

                                <Edit2 className="w-4 h-4 text-gray-500" />
                              </button>
                              <button
                            onClick={() => duplicateItem(item)}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="Duplicate">

                                <FileText className="w-4 h-4 text-gray-500" />
                              </button>
                              <button
                            onClick={() => sendReminder(item)}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="Send Reminder">

                                <Bell className="w-4 h-4 text-gray-500" />
                              </button>
                              <button
                            onClick={() => deleteItem(item.id)}
                            className="p-1 hover:bg-red-50 rounded"
                            title="Delete">

                                <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                              </button>
                            </div>
                          </td>
                        </tr>);

                })}
                  </tbody>
                </table>
            }
            </div>
          )}
          {Object.keys(grouped).length === 0 &&
          <div className="text-center py-12 text-gray-400">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No training needs found matching your filters</p>
            </div>
          }
        </div>
      </Card>

      {/* Detail Modal */}
      {showDetailModal && selectedItem &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Training Need Details</h2>
              <button
              onClick={() => {
                setShowDetailModal(false);
                setSelectedItem(null);
                setNewNote('');
              }}
              className="p-1 hover:bg-gray-100 rounded">

                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedItem.proposedTraining}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">{selectedItem.weakness}</Badge>
                  <span className={`px-2 py-0.5 text-xs font-bold rounded ${priorityColor(selectedItem.priority)}`}>
                    {selectedItem.priority}
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColor(selectedItem.status)}`}>
                    {selectedItem.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">{selectedItem.employeeName}</p>
                      <p className="text-xs text-gray-500">
                        {selectedItem.employeeId} · {selectedItem.department}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm">Target: {selectedItem.targetDate}</p>
                      {selectedItem.completedDate &&
                    <p className="text-xs text-green-600">Completed: {selectedItem.completedDate}</p>
                    }
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-gray-400" />
                    <p className="text-sm">
                      Appraisal Score: <strong>{selectedItem.appraisalScore}</strong> (Grade: {selectedItem.grade})
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  {selectedItem.assignedTrainer &&
                <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <p className="text-sm">Trainer: {selectedItem.assignedTrainer}</p>
                    </div>
                }
                  {selectedItem.budget &&
                <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-gray-400" />
                      <p className="text-sm">
                        Budget: ${selectedItem.budget}
                        {selectedItem.actualCost && ` / Actual: $${selectedItem.actualCost}`}
                      </p>
                    </div>
                }
                  {selectedItem.createdAt &&
                <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-500">Created: {selectedItem.createdAt}</p>
                    </div>
                }
                </div>
              </div>

              {selectedItem.description &&
            <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Description</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{selectedItem.description}</p>
                </div>
            }

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Notes ({selectedItem.notes?.length || 0})</h4>
                <div className="flex items-start gap-2 mb-3">
                  <textarea
                  placeholder="Add a note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2} />

                  <Button variant="primary" onClick={() => addNote(selectedItem.id, newNote)} disabled={!newNote.trim()}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {selectedItem.notes && selectedItem.notes.length > 0 ?
              <ul className="space-y-2">
                    {selectedItem.notes.map((note) =>
                <li key={note.id} className="p-3 bg-gray-50 rounded">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm text-gray-700">{note.content}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {note.author} • {note.createdAt}
                            </p>
                          </div>
                          <button
                      onClick={() => deleteNote(selectedItem.id, note.id)}
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
                openEditModal(selectedItem);
                setShowDetailModal(false);
              }}>

                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" onClick={() => sendReminder(selectedItem)}>
                <Bell className="w-4 h-4 mr-2" />
                Send Reminder
              </Button>
              <Button
              variant="primary"
              onClick={() => {
                setShowDetailModal(false);
                setSelectedItem(null);
              }}>

                Close
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Edit Modal */}
      {showEditModal && editingItem &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Edit Training Need</h2>
              <button
              onClick={() => {
                setShowEditModal(false);
                setEditingItem(null);
              }}
              className="p-1 hover:bg-gray-100 rounded">

                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                label="Employee Name"
                value={editingItem.employeeName}
                onChange={(e) => setEditingItem({ ...editingItem, employeeName: e.target.value })} />

                <Input
                label="Employee ID"
                value={editingItem.employeeId}
                onChange={(e) => setEditingItem({ ...editingItem, employeeId: e.target.value })} />

              </div>
              <div className="grid grid-cols-2 gap-4">
                <Select
                label="Department"
                options={departments.map((d) => ({ value: d, label: d }))}
                value={editingItem.department}
                onChange={(e) => setEditingItem({ ...editingItem, department: e.target.value })} />

                <Select
                label="Weakness Area"
                options={weaknesses.map((w) => ({ value: w, label: w }))}
                value={editingItem.weakness}
                onChange={(e) => setEditingItem({ ...editingItem, weakness: e.target.value })} />

              </div>
              <Input
              label="Proposed Training"
              value={editingItem.proposedTraining}
              onChange={(e) => setEditingItem({ ...editingItem, proposedTraining: e.target.value })} />

              <div className="grid grid-cols-3 gap-4">
                <Select
                label="Priority"
                options={[
                { value: 'High', label: 'High' },
                { value: 'Medium', label: 'Medium' },
                { value: 'Low', label: 'Low' }]
                }
                value={editingItem.priority}
                onChange={(e) => setEditingItem({ ...editingItem, priority: e.target.value as any })} />

                <Input
                label="Target Date"
                type="date"
                value={editingItem.targetDate}
                onChange={(e) => setEditingItem({ ...editingItem, targetDate: e.target.value })} />

                <Select
                label="Status"
                options={[
                { value: 'Pending', label: 'Pending' },
                { value: 'In Progress', label: 'In Progress' },
                { value: 'Completed', label: 'Completed' },
                { value: 'Overdue', label: 'Overdue' }]
                }
                value={editingItem.status}
                onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value as any })} />

              </div>
              <div className="grid grid-cols-3 gap-4">
                <Input
                label="Appraisal Score"
                type="number"
                value={editingItem.appraisalScore}
                onChange={(e) => setEditingItem({ ...editingItem, appraisalScore: parseInt(e.target.value) || 0 })} />

                <Input
                label="Grade"
                value={editingItem.grade}
                onChange={(e) => setEditingItem({ ...editingItem, grade: e.target.value })} />

                <Input
                label="Assigned Trainer"
                value={editingItem.assignedTrainer || ''}
                onChange={(e) => setEditingItem({ ...editingItem, assignedTrainer: e.target.value })} />

              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                label="Budget"
                type="number"
                value={editingItem.budget || ''}
                onChange={(e) => setEditingItem({ ...editingItem, budget: parseInt(e.target.value) || 0 })} />

                <Input
                label="Actual Cost"
                type="number"
                value={editingItem.actualCost || ''}
                onChange={(e) => setEditingItem({ ...editingItem, actualCost: parseInt(e.target.value) || 0 })} />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                value={editingItem.description || ''}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3} />

              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <Button
              variant="outline"
              onClick={() => {
                setShowEditModal(false);
                setEditingItem(null);
              }}>

                Cancel
              </Button>
              <Button variant="primary" onClick={saveEditedItem}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Add Modal */}
      {showAddModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Add New Training Need</h2>
              <button
              onClick={() => setShowAddModal(false)}
              className="p-1 hover:bg-gray-100 rounded">

                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Select
                label="Employee *"
                options={[
                { value: '', label: 'Select Employee...' },
                ...employees.map((e) => ({ value: e.id, label: `${e.name} (${e.id})` }))]
                }
                value={newItem.employeeId || ''}
                onChange={(e) => {
                  const emp = employees.find((emp) => emp.id === e.target.value);
                  setNewItem({
                    ...newItem,
                    employeeId: e.target.value,
                    employeeName: emp?.name || '',
                    department: emp?.department || ''
                  });
                }} />

                <Select
                label="Department"
                options={[
                { value: '', label: 'Select Department...' },
                ...departments.map((d) => ({ value: d, label: d }))]
                }
                value={newItem.department || ''}
                onChange={(e) => setNewItem({ ...newItem, department: e.target.value })} />

              </div>
              <Select
              label="Weakness Area *"
              options={[
              { value: '', label: 'Select Weakness...' },
              ...weaknesses.map((w) => ({ value: w, label: w }))]
              }
              value={newItem.weakness || ''}
              onChange={(e) => setNewItem({ ...newItem, weakness: e.target.value })} />

              <Input
              label="Proposed Training *"
              value={newItem.proposedTraining || ''}
              onChange={(e) => setNewItem({ ...newItem, proposedTraining: e.target.value })}
              placeholder="Enter training program name" />

              <div className="grid grid-cols-3 gap-4">
                <Select
                label="Priority"
                options={[
                { value: 'High', label: 'High' },
                { value: 'Medium', label: 'Medium' },
                { value: 'Low', label: 'Low' }]
                }
                value={newItem.priority || 'Medium'}
                onChange={(e) => setNewItem({ ...newItem, priority: e.target.value as any })} />

                <Input
                label="Target Date"
                type="date"
                value={newItem.targetDate || ''}
                onChange={(e) => setNewItem({ ...newItem, targetDate: e.target.value })} />

                <Input
                label="Budget"
                type="number"
                value={newItem.budget || ''}
                onChange={(e) => setNewItem({ ...newItem, budget: parseInt(e.target.value) || 0 })} />

              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                label="Appraisal Score"
                type="number"
                value={newItem.appraisalScore || ''}
                onChange={(e) => setNewItem({ ...newItem, appraisalScore: parseInt(e.target.value) || 0 })} />

                <Input
                label="Grade"
                value={newItem.grade || ''}
                onChange={(e) => setNewItem({ ...newItem, grade: e.target.value })} />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                value={newItem.description || ''}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Additional details about this training need" />

              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={addNewItem}>
                <Plus className="w-4 h-4 mr-2" />
                Add Training Need
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Bulk Action Modal */}
      {showBulkActionModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Bulk Actions ({selectedItems.size} items)</h2>
              <button onClick={() => setShowBulkActionModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Change Status</h4>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => bulkUpdateStatus('Pending')}>
                    Set Pending
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => bulkUpdateStatus('In Progress')}>
                    Set In Progress
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => bulkUpdateStatus('Completed')}>
                    Set Completed
                  </Button>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Change Priority</h4>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => bulkUpdatePriority('High')}>
                    Set High
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => bulkUpdatePriority('Medium')}>
                    Set Medium
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => bulkUpdatePriority('Low')}>
                    Set Low
                  </Button>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Other Actions</h4>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={sendBulkReminders}>
                    <Bell className="w-4 h-4 mr-2" />
                    Send Reminders
                  </Button>
                  <Button variant="outline" size="sm" onClick={bulkDelete} className="text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Selected
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <Button variant="outline" onClick={() => setShowBulkActionModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}