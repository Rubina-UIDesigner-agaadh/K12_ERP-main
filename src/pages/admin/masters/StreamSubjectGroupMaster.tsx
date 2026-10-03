// filepath: src/pages/academic/masters/StreamSubjectGroupMaster.tsx

import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Plus, Search, Edit2, Trash2, X, Save } from 'lucide-react';

interface SubjectGroupData {
  id: number;
  stream: string;
  group: string;
  subjects: string;
  status: 'Active' | 'Inactive';
}

interface FormData {
  stream: string;
  group: string;
  subjects: string;
  status: 'Active' | 'Inactive';
}

export function StreamSubjectGroupMaster() {
  const [data, setData] = useState<SubjectGroupData[]>([
  {
    id: 1,
    stream: 'Science',
    group: 'PCM',
    subjects: 'Physics, Chemistry, Maths, English, CS',
    status: 'Active'
  },
  {
    id: 2,
    stream: 'Science',
    group: 'PCB',
    subjects: 'Physics, Chemistry, Biology, English, PE',
    status: 'Active'
  },
  {
    id: 3,
    stream: 'Commerce',
    group: 'Comm-Maths',
    subjects: 'Accounts, Business Studies, Economics, Maths, English',
    status: 'Active'
  },
  {
    id: 4,
    stream: 'Arts',
    group: 'Humanities',
    subjects: 'History, Pol Science, Sociology, English, Psychology',
    status: 'Active'
  },
  {
    id: 5,
    stream: 'Science',
    group: 'PCMB',
    subjects: 'Physics, Chemistry, Maths, Biology, English',
    status: 'Active'
  },
  {
    id: 6,
    stream: 'Commerce',
    group: 'Comm-CS',
    subjects: 'Accounts, Business Studies, Economics, Computer Science, English',
    status: 'Inactive'
  }]
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    stream: '',
    group: '',
    subjects: '',
    status: 'Active'
  });

  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});

  // Available options for dropdowns
  const streamOptions = ['Science', 'Commerce', 'Arts', 'Vocational'];
  const availableSubjects = [
  'Physics',
  'Chemistry',
  'Mathematics',
  'Biology',
  'English',
  'Computer Science',
  'Accounts',
  'Business Studies',
  'Economics',
  'History',
  'Political Science',
  'Sociology',
  'Psychology',
  'Physical Education',
  'Geography',
  'Hindi'];


  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  // Filter data based on search query
  const filteredData = data.filter(
    (item) =>
    item.stream.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.group.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.subjects.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Validate form
  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {};

    if (!formData.stream.trim()) {
      errors.stream = 'Stream is required';
    }
    if (!formData.group.trim()) {
      errors.group = 'Subject group is required';
    }
    if (!formData.subjects.trim()) {
      errors.subjects = 'At least one subject is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle add new group
  const handleAddNew = () => {
    setIsFormOpen(true);
    setEditingId(null);
    setFormData({
      stream: '',
      group: '',
      subjects: '',
      status: 'Active'
    });
    setSelectedSubjects([]);
    setFormErrors({});
  };

  // Handle edit
  const handleEdit = (row: SubjectGroupData) => {
    setIsFormOpen(true);
    setEditingId(row.id);
    setFormData({
      stream: row.stream,
      group: row.group,
      subjects: row.subjects,
      status: row.status
    });
    setSelectedSubjects(row.subjects.split(', ').map((s) => s.trim()));
    setFormErrors({});
  };

  // Handle delete
  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this subject group?')) {
      setData(data.filter((item) => item.id !== id));
    }
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (editingId) {
      // Update existing
      setData(
        data.map((item) =>
        item.id === editingId ?
        { ...item, ...formData } :
        item
        )
      );
    } else {
      // Add new
      const newId = Math.max(...data.map((item) => item.id), 0) + 1;
      setData([...data, { id: newId, ...formData }]);
    }

    setIsFormOpen(false);
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      stream: '',
      group: '',
      subjects: '',
      status: 'Active'
    });
    setSelectedSubjects([]);
    setFormErrors({});
    setEditingId(null);
  };

  // Handle cancel
  const handleCancel = () => {
    setIsFormOpen(false);
    resetForm();
  };

  // Handle subject selection
  const handleSubjectToggle = (subject: string) => {
    let newSelected: string[];
    if (selectedSubjects.includes(subject)) {
      newSelected = selectedSubjects.filter((s) => s !== subject);
    } else {
      newSelected = [...selectedSubjects, subject];
    }
    setSelectedSubjects(newSelected);
    setFormData({
      ...formData,
      subjects: newSelected.join(', ')
    });
  };

  const columns = [
  {
    key: 'stream',
    header: 'Stream Name'
  },
  {
    key: 'group',
    header: 'Subject Group'
  },
  {
    key: 'subjects',
    header: 'Subjects Included',
    render: (row: SubjectGroupData) =>
    <span className="text-sm text-gray-600">{row.subjects}</span>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: SubjectGroupData) =>
    <Badge variant={row.status === 'Active' ? 'success' : 'default'}>
          {row.status}
        </Badge>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: SubjectGroupData) =>
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
          <h1 className="text-2xl font-bold text-gray-900">
            Stream & Subject Group Master
          </h1>
          <p className="text-sm text-gray-500">
            Define academic streams and subject combinations
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Group
        </Button>
      </div>

      {/* Form Card */}
      {isFormOpen &&
      <Card>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {editingId ? 'Edit Subject Group' : 'Add New Subject Group'}
              </h2>
              <Button variant="ghost" size="xs" onClick={handleCancel}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Stream Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Stream Name *
                  </label>
                  <select
                  value={formData.stream}
                  onChange={(e) =>
                  setFormData({ ...formData, stream: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md">

                    <option value="">Select Stream</option>
                    {streamOptions.map((stream) =>
                  <option key={stream} value={stream}>
                        {stream}
                      </option>
                  )}
                  </select>
                  {formErrors.stream &&
                <p className="text-red-500 text-xs mt-1">
                      {formErrors.stream}
                    </p>
                }
                </div>

                {/* Group Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Subject Group Name *
                  </label>
                  <Input
                  value={formData.group}
                  onChange={(e) =>
                  setFormData({ ...formData, group: e.target.value })
                  }
                  placeholder="e.g., PCM, PCB, Commerce-Maths" />

                  {formErrors.group &&
                <p className="text-red-500 text-xs mt-1">
                      {formErrors.group}
                    </p>
                }
                </div>
              </div>

              {/* Subject Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Subjects *
                </label>
                <div className="border border-gray-300 rounded-md p-4 max-h-48 overflow-y-auto">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availableSubjects.map((subject) =>
                  <label
                    key={subject}
                    className="flex items-center space-x-2 cursor-pointer">

                        <input
                      type="checkbox"
                      checked={selectedSubjects.includes(subject)}
                      onChange={() => handleSubjectToggle(subject)}
                      className="rounded" />

                        <span className="text-sm">{subject}</span>
                      </label>
                  )}
                  </div>
                </div>
                {formErrors.subjects &&
              <p className="text-red-500 text-xs mt-1">
                    {formErrors.subjects}
                  </p>
              }
                {selectedSubjects.length > 0 &&
              <p className="text-sm text-gray-600 mt-2">
                    Selected: {selectedSubjects.join(', ')}
                  </p>
              }
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                    type="radio"
                    value="Active"
                    checked={formData.status === 'Active'}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as 'Active' | 'Inactive'
                    })
                    } />

                    <span>Active</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                    type="radio"
                    value="Inactive"
                    checked={formData.status === 'Inactive'}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as 'Active' | 'Inactive'
                    })
                    } />

                    <span>Inactive</span>
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  {editingId ? 'Update Group' : 'Save Group'}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      }

      {/* Table Card */}
      <Card>
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <Input
              leftIcon={<Search className="w-4 h-4" />}
              placeholder="Search streams, groups, or subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} />

          </div>
        </div>

        {filteredData.length === 0 ?
        <div className="text-center py-12">
            <p className="text-gray-500">
              {searchQuery ?
            'No subject groups found matching your search.' :
            'No subject groups added yet. Click "Add New Group" to create one.'}
            </p>
          </div> :

        <Table columns={columns} data={filteredData} />
        }
      </Card>
    </div>);

}