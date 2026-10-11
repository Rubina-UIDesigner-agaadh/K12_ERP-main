import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import {
  CalendarIcon,
  DownloadIcon,
  EditIcon,
  SaveIcon,
  PlusIcon,
  TrashIcon,
  XIcon,
  BookOpenIcon } from
'lucide-react';
interface ChapterData {
  id: number;
  unit: string;
  topics: number;
  topicList: {
    name: string;
    completed: boolean;
  }[];
  planned: number;
  completed: number;
  progress: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
  startDate: string;
  endDate: string;
  notes: string;
}
const MOCK_DATA: ChapterData[] = [
{
  id: 1,
  unit: 'Real Numbers',
  topics: 4,
  planned: 12,
  completed: 12,
  progress: 100,
  status: 'Completed',
  startDate: '2024-04-01',
  endDate: '2024-04-15',
  notes: 'Completed ahead of schedule',
  topicList: [
  {
    name: "Euclid's Division Lemma",
    completed: true
  },
  {
    name: 'Fundamental Theorem of Arithmetic',
    completed: true
  },
  {
    name: 'Decimal Expansion',
    completed: true
  },
  {
    name: 'Rational Numbers',
    completed: true
  }]

},
{
  id: 2,
  unit: 'Polynomials',
  topics: 5,
  planned: 15,
  completed: 15,
  progress: 100,
  status: 'Completed',
  startDate: '2024-04-16',
  endDate: '2024-05-05',
  notes: 'All topics covered',
  topicList: [
  {
    name: 'Introduction to Polynomials',
    completed: true
  },
  {
    name: 'Degree of Polynomial',
    completed: true
  },
  {
    name: 'Zeroes of Polynomial',
    completed: true
  },
  {
    name: 'Factorization',
    completed: true
  },
  {
    name: 'Algebraic Identities',
    completed: true
  }]

},
{
  id: 3,
  unit: 'Pair of Linear Equations',
  topics: 6,
  planned: 18,
  completed: 10,
  progress: 55,
  status: 'In Progress',
  startDate: '2024-05-06',
  endDate: '2024-05-30',
  notes: 'Currently on topic 4',
  topicList: [
  {
    name: 'Linear Equations in Two Variables',
    completed: true
  },
  {
    name: 'Graphical Method',
    completed: true
  },
  {
    name: 'Substitution Method',
    completed: true
  },
  {
    name: 'Elimination Method',
    completed: false
  },
  {
    name: 'Cross-multiplication',
    completed: false
  },
  {
    name: 'Word Problems',
    completed: false
  }]

}];

export function SyllabusPlanner() {
  const [selectedClass, setSelectedClass] = useState('x');
  const [selectedSubject, setSelectedSubject] = useState('math');
  const [selectedTerm, setSelectedTerm] = useState('term1');
  const [chapters, setChapters] = useState<ChapterData[]>(MOCK_DATA);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProgress, setEditingProgress] = useState<number | null>(null);
  const [tempCompleted, setTempCompleted] = useState<number>(0);
  const totalChapters = chapters.length;
  const completedChapters = chapters.filter(
    (c) => c.status === 'Completed'
  ).length;
  const overallProgress =
  totalChapters > 0 ?
  Math.round(
    chapters.reduce((sum, c) => sum + c.progress, 0) / totalChapters
  ) :
  0;
  const getStatusVariant = (status: ChapterData['status']) => {
    switch (status) {
      case 'Completed':
        return 'success' as const;
      case 'In Progress':
        return 'warning' as const;
      case 'Not Started':
        return 'default' as const;
    }
  };
  const toggleTopicStatus = (chapterId: number, topicIndex: number) => {
    setChapters((prev) =>
    prev.map((ch) => {
      if (ch.id === chapterId) {
        const newTopics = [...ch.topicList];
        newTopics[topicIndex].completed = !newTopics[topicIndex].completed;
        const completedCount = newTopics.filter((t) => t.completed).length;
        const newProgress = Math.round(
          completedCount / newTopics.length * 100
        );
        let newStatus = ch.status;
        if (newProgress === 100) newStatus = 'Completed';else
        if (newProgress > 0) newStatus = 'In Progress';else
        newStatus = 'Not Started';
        return {
          ...ch,
          topicList: newTopics,
          progress: newProgress,
          status: newStatus
        };
      }
      return ch;
    })
    );
  };
  const cycleStatus = (chapterId: number) => {
    setChapters((prev) =>
    prev.map((ch) => {
      if (ch.id === chapterId) {
        const nextStatus =
        ch.status === 'Not Started' ?
        'In Progress' :
        ch.status === 'In Progress' ?
        'Completed' :
        'Not Started';
        return {
          ...ch,
          status: nextStatus
        };
      }
      return ch;
    })
    );
  };
  const handleProgressSave = (chapterId: number) => {
    setChapters((prev) =>
    prev.map((ch) => {
      if (ch.id === chapterId) {
        const progress = Math.round(tempCompleted / ch.planned * 100);
        return {
          ...ch,
          completed: tempCompleted,
          progress: Math.min(progress, 100)
        };
      }
      return ch;
    })
    );
    setEditingProgress(null);
  };
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Syllabus Planner</h1>
          <p className="text-gray-500">Plan and track chapter progress</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <DownloadIcon className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <PlusIcon className="w-4 h-4 mr-2" /> Add Chapter
          </Button>
        </div>
      </div>

      <Card noPadding>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Select
              label="Class"
              value={selectedClass}
              onChange={(val) => setSelectedClass(val)}
              options={[
              {
                value: 'ix',
                label: 'Class IX'
              },
              {
                value: 'x',
                label: 'Class X'
              },
              {
                value: 'xi',
                label: 'Class XI'
              }]
              } />
            
            <Select
              label="Subject"
              value={selectedSubject}
              onChange={(val) => setSelectedSubject(val)}
              options={[
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
              }]
              } />
            
            <Select
              label="Term"
              value={selectedTerm}
              onChange={(val) => setSelectedTerm(val)}
              options={[
              {
                value: 'term1',
                label: 'Term 1'
              },
              {
                value: 'term2',
                label: 'Term 2'
              },
              {
                value: 'term3',
                label: 'Term 3'
              }]
              } />
            
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-700">
                {totalChapters}
              </p>
              <p className="text-sm text-blue-600">Total Chapters</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-700">
                {overallProgress}%
              </p>
              <p className="text-sm text-green-600">Overall Progress</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-purple-700">
                {completedChapters}
              </p>
              <p className="text-sm text-purple-600">Completed</p>
            </div>
          </div>

          <div className="space-y-4">
            {chapters.map((chapter) =>
            <div
              key={chapter.id}
              className="border rounded-lg p-5 hover:shadow-sm transition-shadow">
              
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <BookOpenIcon className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        Chapter {chapter.id}: {chapter.unit}
                      </h3>
                      <div
                      onClick={() => cycleStatus(chapter.id)}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      title="Click to change status">
                      
                        <Badge variant={getStatusVariant(chapter.status)}>
                          {chapter.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{chapter.topics} topics</span>
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        {chapter.startDate} to {chapter.endDate}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <EditIcon className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1 items-center">
                    {editingProgress === chapter.id ?
                  <div className="flex items-center gap-2">
                        <input
                      type="number"
                      value={tempCompleted}
                      onChange={(e) =>
                      setTempCompleted(Number(e.target.value))
                      }
                      className="w-16 border rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      min={0}
                      max={chapter.planned} />
                    
                        <span className="text-gray-600">
                          / {chapter.planned} periods
                        </span>
                        <Button
                      size="xs"
                      onClick={() => handleProgressSave(chapter.id)}>
                      
                          Save
                        </Button>
                        <Button
                      size="xs"
                      variant="outline"
                      onClick={() => setEditingProgress(null)}>
                      
                          Cancel
                        </Button>
                      </div> :

                  <span
                    className="text-gray-600 cursor-pointer hover:text-blue-600 flex items-center gap-1"
                    onClick={() => {
                      setEditingProgress(chapter.id);
                      setTempCompleted(chapter.completed);
                    }}
                    title="Click to edit periods">
                    
                        {chapter.completed}/{chapter.planned} periods{' '}
                        <EditIcon className="w-3 h-3" />
                      </span>
                  }
                    <span className="font-medium text-gray-900">
                      {chapter.progress}%
                    </span>
                  </div>
                  <div
                  className="w-full bg-gray-200 rounded-full h-2 cursor-pointer hover:h-3 transition-all"
                  onClick={() => {
                    setEditingProgress(chapter.id);
                    setTempCompleted(chapter.completed);
                  }}
                  title="Click to edit progress">
                  
                    <div
                    className={`h-full rounded-full transition-all ${chapter.progress === 100 ? 'bg-green-500' : 'bg-blue-600'}`}
                    style={{
                      width: `${chapter.progress}%`
                    }} />
                  
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {chapter.topicList.map((topic, idx) =>
                <span
                  key={idx}
                  onClick={() => toggleTopicStatus(chapter.id, idx)}
                  className={`text-xs px-2 py-1 rounded-md cursor-pointer transition-colors ${topic.completed ? 'bg-green-100 text-green-800 line-through' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  title="Click to toggle completion">
                  
                      {topic.name}
                    </span>
                )}
                </div>

                {chapter.notes &&
              <p className="text-sm text-gray-500 italic">
                    {chapter.notes}
                  </p>
              }
              </div>
            )}
          </div>
        </div>
      </Card>

      {showAddModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add Chapter</h2>
              <button
              onClick={() => setShowAddModal(false)}
              className="text-gray-500 hover:text-gray-700">
              
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <Input label="Chapter Name" placeholder="e.g. Real Numbers" />
              <div className="grid grid-cols-2 gap-4">
                <Input
                label="Number of Topics"
                type="number"
                placeholder="e.g. 5" />
              
                <Input
                label="Planned Periods"
                type="number"
                placeholder="e.g. 12" />
              
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Start Date" type="date" />
                <Input label="End Date" type="date" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Add notes..." />
              
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowAddModal(false)}>
                Save Chapter
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}