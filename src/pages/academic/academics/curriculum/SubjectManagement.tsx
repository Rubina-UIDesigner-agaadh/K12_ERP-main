import React, { useState } from 'react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { Badge } from '../../../../components/ui/Badge';
import {
  PlusIcon,
  BookIcon,
  EditIcon,
  TrashIcon,
  SearchIcon,
  XIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BookOpenIcon,
  CheckCircleIcon } from
'lucide-react';
interface Chapter {
  id: string;
  number: number;
  name: string;
  topicsCount: number;
  status: 'Pending' | 'In Progress' | 'Completed';
}
interface Subject {
  id: string;
  name: string;
  code: string;
  type: 'Core' | 'Elective';
  classes: string[];
  teacherName: string;
  status: 'Active' | 'Inactive';
  chapters: Chapter[];
}
const MOCK_SUBJECTS: Subject[] = [
{
  id: 'SUB001',
  name: 'Mathematics',
  code: 'MAT-101',
  type: 'Core',
  classes: ['X-A', 'X-B'],
  teacherName: 'R. Sharma',
  status: 'Active',
  chapters: [
  {
    id: 'C1',
    number: 1,
    name: 'Real Numbers',
    topicsCount: 4,
    status: 'Completed'
  },
  {
    id: 'C2',
    number: 2,
    name: 'Polynomials',
    topicsCount: 5,
    status: 'In Progress'
  },
  {
    id: 'C3',
    number: 3,
    name: 'Linear Equations',
    topicsCount: 6,
    status: 'Pending'
  }]

},
{
  id: 'SUB002',
  name: 'Science',
  code: 'SCI-101',
  type: 'Core',
  classes: ['X-A', 'X-B'],
  teacherName: 'A. Gupta',
  status: 'Active',
  chapters: [
  {
    id: 'C4',
    number: 1,
    name: 'Chemical Reactions',
    topicsCount: 5,
    status: 'Completed'
  },
  {
    id: 'C5',
    number: 2,
    name: 'Acids, Bases and Salts',
    topicsCount: 7,
    status: 'Pending'
  }]

}];

export function SubjectManagement() {
  const [subjects, setSubjects] = useState<Subject[]>(MOCK_SUBJECTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSubject, setExpandedSubject] = useState<string | null>(
    MOCK_SUBJECTS[0].id
  );
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showChapterModal, setShowChapterModal] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const filteredSubjects = subjects.filter(
    (sub) =>
    sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.code.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const toggleExpand = (id: string) => {
    setExpandedSubject(expandedSubject === id ? null : id);
  };
  const getChapterStatusVariant = (status: Chapter['status']) => {
    switch (status) {
      case 'Completed':
        return 'success' as const;
      case 'In Progress':
        return 'warning' as const;
      case 'Pending':
        return 'default' as const;
    }
  };
  const handleStatusClick = (
  subjectId: string,
  chapterId: string,
  currentStatus: Chapter['status']) =>
  {
    const nextStatus: Chapter['status'] =
    currentStatus === 'Pending' ?
    'In Progress' :
    currentStatus === 'In Progress' ?
    'Completed' :
    'Pending';
    setSubjects((prev) =>
    prev.map((sub) => {
      if (sub.id === subjectId) {
        return {
          ...sub,
          chapters: sub.chapters.map((chap) =>
          chap.id === chapterId ?
          {
            ...chap,
            status: nextStatus
          } :
          chap
          )
        };
      }
      return sub;
    })
    );
    setToastMessage(`Status updated to ${nextStatus}`);
    setTimeout(() => setToastMessage(null), 3000);
  };
  return (
    <div className="p-6 space-y-6 relative">
      {toastMessage &&
      <div className="fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircleIcon className="w-4 h-4 text-green-400" />
          {toastMessage}
        </div>
      }

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Subject & Chapter Management
          </h1>
          <p className="text-gray-500">
            Manage subjects and their respective chapters
          </p>
        </div>
        <Button onClick={() => setShowSubjectModal(true)}>
          <PlusIcon className="w-4 h-4 mr-2" /> Add Subject
        </Button>
      </div>

      <Card noPadding>
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-full max-w-md">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9" />
              
            </div>
          </div>

          <div className="space-y-4">
            {filteredSubjects.map((subject) =>
            <div
              key={subject.id}
              className="border rounded-lg overflow-hidden">
              
                <div
                className="bg-gray-50 p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => toggleExpand(subject.id)}>
                
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <BookIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {subject.name}
                        </h3>
                        <Badge variant="outline">{subject.code}</Badge>
                        <Badge
                        variant={subject.type === 'Core' ? 'primary' : 'info'}>
                        
                          {subject.type}
                        </Badge>
                        <Badge
                        variant={
                        subject.status === 'Active' ? 'success' : 'default'
                        }>
                        
                          {subject.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                        <span>Classes: {subject.classes.join(', ')}</span>
                        <span>Teacher: {subject.teacherName}</span>
                        <span>{subject.chapters.length} chapters</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}>
                    
                      <EditIcon className="w-4 h-4" />
                    </Button>
                    <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}>
                    
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                    {expandedSubject === subject.id ?
                  <ChevronUpIcon className="w-5 h-5 text-gray-400" /> :

                  <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                  }
                  </div>
                </div>

                {expandedSubject === subject.id &&
              <div className="p-4 border-t">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Chapters
                      </h4>
                      <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowChapterModal(subject.id)}>
                    
                        <PlusIcon className="w-4 h-4 mr-1" /> Add Chapter
                      </Button>
                    </div>
                    {subject.chapters.length > 0 ?
                <div className="space-y-3">
                        {subject.chapters.map((chapter) =>
                  <div
                    key={chapter.id}
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 transition-colors">
                    
                            <div className="flex items-center gap-4">
                              <span className="text-sm font-medium text-gray-500 w-8">
                                #{chapter.number}
                              </span>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {chapter.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {chapter.topicsCount} topics
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div
                        onClick={() =>
                        handleStatusClick(
                          subject.id,
                          chapter.id,
                          chapter.status
                        )
                        }
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        title="Click to change status">
                        
                                <Badge
                          variant={getChapterStatusVariant(
                            chapter.status
                          )}>
                          
                                  {chapter.status}
                                </Badge>
                              </div>
                              <Button variant="ghost" size="sm">
                                <EditIcon className="w-3 h-3" />
                              </Button>
                              <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600">
                        
                                <TrashIcon className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                  )}
                      </div> :

                <div className="text-center py-4 text-gray-500">
                        No chapters added yet.
                      </div>
                }
                  </div>
              }
              </div>
            )}
            {filteredSubjects.length === 0 &&
            <div className="text-center py-8 text-gray-500">
                No subjects found.
              </div>
            }
          </div>
        </div>
      </Card>

      {showSubjectModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add Subject</h2>
              <button
              onClick={() => setShowSubjectModal(false)}
              className="text-gray-500 hover:text-gray-700">
              
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <Input label="Subject Name" placeholder="e.g. Mathematics" />
              <Input label="Subject Code" placeholder="e.g. MAT-101" />
              <Select
              label="Type"
              options={[
              {
                value: 'core',
                label: 'Core'
              },
              {
                value: 'elective',
                label: 'Elective'
              }]
              }
              placeholder="Select Type" />
            
              <Input label="Teacher Name" placeholder="e.g. R. Sharma" />
              <Input
              label="Classes (comma-separated)"
              placeholder="e.g. X-A, X-B" />
            
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button
              variant="outline"
              onClick={() => setShowSubjectModal(false)}>
              
                Cancel
              </Button>
              <Button onClick={() => setShowSubjectModal(false)}>
                Save Subject
              </Button>
            </div>
          </div>
        </div>
      }

      {showChapterModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add Chapter</h2>
              <button
              onClick={() => setShowChapterModal(null)}
              className="text-gray-500 hover:text-gray-700">
              
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <Input
              label="Chapter Number"
              type="number"
              placeholder="e.g. 1" />
            
              <Input label="Chapter Name" placeholder="e.g. Real Numbers" />
              <Input
              label="Number of Topics"
              type="number"
              placeholder="e.g. 5" />
            
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button
              variant="outline"
              onClick={() => setShowChapterModal(null)}>
              
                Cancel
              </Button>
              <Button onClick={() => setShowChapterModal(null)}>
                Save Chapter
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}