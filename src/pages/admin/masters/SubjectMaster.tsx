// src/pages/admin/masters/SubjectMaster.tsx

import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';

interface Subject {
  id: number;
  name: string;
  code: string;
  type: string;
  dept: string;
  credits: number;
}

export function SubjectMaster() {
  const [subjects, setSubjects] = useState<Subject[]>([
  {
    id: 1,
    name: 'Mathematics',
    code: 'MATH01',
    type: 'Theory',
    dept: 'Mathematics',
    credits: 4
  },
  {
    id: 2,
    name: 'Physics',
    code: 'PHY01',
    type: 'Theory + Practical',
    dept: 'Science',
    credits: 4
  },
  {
    id: 3,
    name: 'English Literature',
    code: 'ENG01',
    type: 'Theory',
    dept: 'Languages',
    credits: 3
  },
  {
    id: 4,
    name: 'Physical Education',
    code: 'PE01',
    type: 'Practical',
    dept: 'Sports',
    credits: 2
  },
  {
    id: 5,
    name: 'Computer Science',
    code: 'CS01',
    type: 'Theory + Practical',
    dept: 'Computer Science',
    credits: 4
  },
  {
    id: 6,
    name: 'Chemistry',
    code: 'CHEM01',
    type: 'Theory + Practical',
    dept: 'Science',
    credits: 4
  },
  {
    id: 7,
    name: 'Biology',
    code: 'BIO01',
    type: 'Theory + Practical',
    dept: 'Science',
    credits: 4
  },
  {
    id: 8,
    name: 'History',
    code: 'HIST01',
    type: 'Theory',
    dept: 'Social Studies',
    credits: 3
  },
  {
    id: 9,
    name: 'Geography',
    code: 'GEO01',
    type: 'Theory',
    dept: 'Social Studies',
    credits: 3
  },
  {
    id: 10,
    name: 'Hindi',
    code: 'HIN01',
    type: 'Theory',
    dept: 'Languages',
    credits: 3
  }]
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'Theory',
    dept: '',
    credits: 0
  });

  // Get unique departments from subjects
  const departments = Array.from(new Set(subjects.map((s) => s.dept)));

  // Filter subjects based on search and department
  const filteredSubjects = subjects.filter((subject) => {
    const matchesSearch =
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept =
    selectedDept === 'all' || subject.dept === selectedDept;
    return matchesSearch && matchesDept;
  });

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle department filter
  const handleDeptFilter = (value: string) => {
    setSelectedDept(value);
  };

  // Handle add new subject
  const handleAddNew = () => {
    setEditingSubject(null);
    setFormData({
      name: '',
      code: '',
      type: 'Theory',
      dept: '',
      credits: 0
    });
    setIsModalOpen(true);
  };

  // Handle edit subject
  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      code: subject.code,
      type: subject.type,
      dept: subject.dept,
      credits: subject.credits
    });
    setIsModalOpen(true);
  };

  // Handle delete subject
  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      setSubjects(subjects.filter((subject) => subject.id !== id));
    }
  };

  // Handle form input change
  const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
  {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'credits' ? parseInt(value) || 0 : value
    });
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
    !formData.name ||
    !formData.code ||
    !formData.dept ||
    formData.credits <= 0)
    {
      alert('Please fill all required fields');
      return;
    }

    if (editingSubject) {
      // Update existing subject
      setSubjects(
        subjects.map((subject) =>
        subject.id === editingSubject.id ?
        { ...subject, ...formData } :
        subject
        )
      );
    } else {
      // Add new subject
      const newSubject: Subject = {
        id: Math.max(...subjects.map((s) => s.id)) + 1,
        ...formData
      };
      setSubjects([...subjects, newSubject]);
    }

    setIsModalOpen(false);
    setFormData({
      name: '',
      code: '',
      type: 'Theory',
      dept: '',
      credits: 0
    });
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSubject(null);
    setFormData({
      name: '',
      code: '',
      type: 'Theory',
      dept: '',
      credits: 0
    });
  };

  const columns = [
  {
    key: 'name',
    header: 'Subject Name',
    render: (row: Subject) => <span className="font-medium">{row.name}</span>
  },
  {
    key: 'code',
    header: 'Code'
  },
  {
    key: 'type',
    header: 'Type'
  },
  {
    key: 'dept',
    header: 'Department'
  },
  {
    key: 'credits',
    header: 'Credits'
  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: Subject) =>
    <div className="flex gap-2">
          <Button variant="ghost" size="xs" onClick={() => handleEdit(row)}>
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
        variant="ghost"
        size="xs"
        className="text-red-500"
        onClick={() => handleDelete(row.id)}>

            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

  }];


  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subject Master</h1>
          <p className="text-sm text-gray-500">
            Manage subjects and course details
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Subject
        </Button>
      </div>

      <Card>
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <Input
              leftIcon={<Search className="w-4 h-4" />}
              placeholder="Search subjects..."
              value={searchTerm}
              onChange={handleSearch} />

          </div>
          <Select
            placeholder="Department"
            value={selectedDept}
            onChange={(e) => handleDeptFilter(e.target.value)}
            options={[
            {
              value: 'all',
              label: 'All Departments'
            },
            ...departments.map((dept) => ({
              value: dept,
              label: dept
            }))]
            } />

        </div>
        <Table columns={columns} data={filteredSubjects} />
      </Card>

      {/* Add/Edit Modal */}
      {isModalOpen &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingSubject ? 'Edit Subject' : 'Add New Subject'}
              </h2>
              <button
              onClick={handleCloseModal}
              className="text-gray-500 hover:text-gray-700">

                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Subject Name *
                </label>
                <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter subject name"
                required />

              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Subject Code *
                </label>
                <Input
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                placeholder="Enter subject code"
                required />

              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Subject Type *
                </label>
                <Select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                options={[
                { value: 'Theory', label: 'Theory' },
                { value: 'Practical', label: 'Practical' },
                {
                  value: 'Theory + Practical',
                  label: 'Theory + Practical'
                }]
                }
                required />

              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Department *
                </label>
                <Select
                name="dept"
                value={formData.dept}
                onChange={handleInputChange}
                options={[
                { value: '', label: 'Select Department' },
                ...departments.map((dept) => ({
                  value: dept,
                  label: dept
                })),
                { value: 'Other', label: 'Other' }]
                }
                required />

              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Credits *
                </label>
                <Input
                type="number"
                name="credits"
                value={formData.credits}
                onChange={handleInputChange}
                placeholder="Enter credits"
                min="1"
                max="10"
                required />

              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  {editingSubject ? 'Update Subject' : 'Add Subject'}
                </Button>
                <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
                className="flex-1">

                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>);

}