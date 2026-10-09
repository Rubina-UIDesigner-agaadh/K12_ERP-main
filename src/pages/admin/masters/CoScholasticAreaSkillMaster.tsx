// filepath: src/pages/academic/masters/CoScholasticAreaSkillMaster.tsx

import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Plus, Edit2, Trash2, X, Save, Search } from 'lucide-react';

interface CoScholasticData {
  id: number;
  area: string;
  skill: string;
  indicators: string;
  scale: string;
  status: 'Active' | 'Inactive';
  description?: string;
  maxScore?: number;
}

interface FormData {
  area: string;
  skill: string;
  indicators: string;
  scale: string;
  status: 'Active' | 'Inactive';
  description: string;
  maxScore: number;
}

interface IndicatorItem {
  id: number;
  name: string;
}

export function CoScholasticAreaSkillMaster() {
  const [data, setData] = useState<CoScholasticData[]>([
  {
    id: 1,
    area: 'Work Education',
    skill: 'Computer Literacy',
    indicators: 'Usage of tools, Logic, Problem Solving',
    scale: 'A-E',
    status: 'Active',
    description: 'Assessment of computer skills and digital literacy',
    maxScore: 5
  },
  {
    id: 2,
    area: 'Art Education',
    skill: 'Visual Arts',
    indicators: 'Creativity, Technique, Expression',
    scale: 'A-E',
    status: 'Active',
    description: 'Assessment of artistic abilities and creativity',
    maxScore: 5
  },
  {
    id: 3,
    area: 'Health & PE',
    skill: 'Sports',
    indicators: 'Stamina, Teamwork, Sportsmanship',
    scale: 'A-E',
    status: 'Active',
    description: 'Physical education and sports participation',
    maxScore: 5
  },
  {
    id: 4,
    area: 'Discipline',
    skill: 'Attendance',
    indicators: 'Regularity, Punctuality',
    scale: 'A-E',
    status: 'Active',
    description: 'Student discipline and attendance tracking',
    maxScore: 5
  },
  {
    id: 5,
    area: 'Art Education',
    skill: 'Music',
    indicators: 'Rhythm, Melody, Performance',
    scale: 'A-E',
    status: 'Active',
    description: 'Musical skills and performance abilities',
    maxScore: 5
  },
  {
    id: 6,
    area: 'Art Education',
    skill: 'Dance',
    indicators: 'Grace, Coordination, Expression',
    scale: 'A-E',
    status: 'Active',
    description: 'Dance performance and movement skills',
    maxScore: 5
  },
  {
    id: 7,
    area: 'Health & PE',
    skill: 'Yoga',
    indicators: 'Flexibility, Concentration, Breathing',
    scale: 'A-E',
    status: 'Active',
    description: 'Yoga practice and wellness',
    maxScore: 5
  },
  {
    id: 8,
    area: 'Work Education',
    skill: 'Craft Work',
    indicators: 'Creativity, Precision, Finishing',
    scale: 'A-E',
    status: 'Inactive',
    description: 'Handicraft and manual skills',
    maxScore: 5
  },
  {
    id: 9,
    area: 'Discipline',
    skill: 'Behavior',
    indicators: 'Respect, Cooperation, Self-control',
    scale: 'A-E',
    status: 'Active',
    description: 'Behavioral assessment and conduct',
    maxScore: 5
  },
  {
    id: 10,
    area: 'Health & PE',
    skill: 'Swimming',
    indicators: 'Technique, Endurance, Safety',
    scale: 'A-E',
    status: 'Inactive',
    description: 'Swimming skills and water safety',
    maxScore: 5
  }]
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    area: '',
    skill: '',
    indicators: '',
    scale: 'A-E',
    status: 'Active',
    description: '',
    maxScore: 5
  });

  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  const [customIndicator, setCustomIndicator] = useState('');
  const [filterArea, setFilterArea] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Predefined areas
  const areaOptions = [
  'Work Education',
  'Art Education',
  'Health & PE',
  'Discipline',
  'Literary Activities',
  'Scientific Skills',
  'Club Activities'];


  // Grading scale options
  const scaleOptions = [
  { value: 'A-E', label: 'A-E (5 Point)' },
  { value: 'A-D', label: 'A-D (4 Point)' },
  { value: '1-5', label: '1-5 (Numeric)' },
  { value: '1-10', label: '1-10 (Numeric)' },
  { value: 'Pass/Fail', label: 'Pass/Fail' }];


  // Predefined indicators based on area
  const indicatorsByArea: {[key: string]: IndicatorItem[];} = {
    'Work Education': [
    { id: 1, name: 'Usage of tools' },
    { id: 2, name: 'Logic' },
    { id: 3, name: 'Problem Solving' },
    { id: 4, name: 'Creativity' },
    { id: 5, name: 'Technical Skills' },
    { id: 6, name: 'Project Completion' }],

    'Art Education': [
    { id: 7, name: 'Creativity' },
    { id: 8, name: 'Technique' },
    { id: 9, name: 'Expression' },
    { id: 10, name: 'Originality' },
    { id: 11, name: 'Presentation' },
    { id: 12, name: 'Rhythm' },
    { id: 13, name: 'Melody' },
    { id: 14, name: 'Grace' }],

    'Health & PE': [
    { id: 15, name: 'Stamina' },
    { id: 16, name: 'Teamwork' },
    { id: 17, name: 'Sportsmanship' },
    { id: 18, name: 'Discipline' },
    { id: 19, name: 'Flexibility' },
    { id: 20, name: 'Coordination' },
    { id: 21, name: 'Endurance' },
    { id: 22, name: 'Technique' }],

    'Discipline': [
    { id: 23, name: 'Regularity' },
    { id: 24, name: 'Punctuality' },
    { id: 25, name: 'Respect' },
    { id: 26, name: 'Cooperation' },
    { id: 27, name: 'Self-control' },
    { id: 28, name: 'Responsibility' }],

    'Literary Activities': [
    { id: 29, name: 'Reading' },
    { id: 30, name: 'Writing' },
    { id: 31, name: 'Speaking' },
    { id: 32, name: 'Debate' },
    { id: 33, name: 'Comprehension' }],

    'Scientific Skills': [
    { id: 34, name: 'Observation' },
    { id: 35, name: 'Experimentation' },
    { id: 36, name: 'Analysis' },
    { id: 37, name: 'Documentation' }],

    'Club Activities': [
    { id: 38, name: 'Participation' },
    { id: 39, name: 'Leadership' },
    { id: 40, name: 'Initiative' },
    { id: 41, name: 'Contribution' }]

  };

  // Filter data based on search and filters
  const filteredData = data.filter((item) => {
    const matchesSearch =
    item.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.indicators.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesArea = filterArea === '' || item.area === filterArea;
    const matchesStatus = filterStatus === '' || item.status === filterStatus;

    return matchesSearch && matchesArea && matchesStatus;
  });

  // Get unique areas for filter
  const uniqueAreas = [...new Set(data.map((item) => item.area))];

  // Validate form
  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {};

    if (!formData.area.trim()) {
      errors.area = 'Co-scholastic area is required';
    }
    if (!formData.skill.trim()) {
      errors.skill = 'Skill/Activity name is required';
    }
    if (!formData.indicators.trim()) {
      errors.indicators = 'At least one indicator is required';
    }
    if (!formData.scale) {
      errors.scale = 'Grading scale is required';
    }

    // Check for duplicate skill in the same area
    const isDuplicate = data.some(
      (item) =>
      item.area === formData.area &&
      item.skill.toLowerCase() === formData.skill.toLowerCase() &&
      item.id !== editingId
    );
    if (isDuplicate) {
      errors.skill = 'This skill already exists in the selected area';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle add new skill
  const handleAddNew = () => {
    setIsFormOpen(true);
    setEditingId(null);
    setFormData({
      area: '',
      skill: '',
      indicators: '',
      scale: 'A-E',
      status: 'Active',
      description: '',
      maxScore: 5
    });
    setSelectedIndicators([]);
    setFormErrors({});
  };

  // Handle edit
  const handleEdit = (row: CoScholasticData) => {
    setIsFormOpen(true);
    setEditingId(row.id);
    setFormData({
      area: row.area,
      skill: row.skill,
      indicators: row.indicators,
      scale: row.scale,
      status: row.status,
      description: row.description || '',
      maxScore: row.maxScore || 5
    });
    setSelectedIndicators(row.indicators.split(', ').map((i) => i.trim()));
    setFormErrors({});
  };

  // Handle delete
  const handleDelete = (id: number) => {
    const itemToDelete = data.find((item) => item.id === id);
    if (
    window.confirm(
      `Are you sure you want to delete "${itemToDelete?.skill}" from "${itemToDelete?.area}"?`
    ))
    {
      setData(data.filter((item) => item.id !== id));
    }
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submissionData = {
      ...formData,
      indicators: selectedIndicators.join(', ')
    };

    if (editingId) {
      // Update existing
      setData(
        data.map((item) =>
        item.id === editingId ? { ...item, ...submissionData } : item
        )
      );
    } else {
      // Add new
      const newId = Math.max(...data.map((item) => item.id), 0) + 1;
      setData([...data, { id: newId, ...submissionData }]);
    }

    setIsFormOpen(false);
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      area: '',
      skill: '',
      indicators: '',
      scale: 'A-E',
      status: 'Active',
      description: '',
      maxScore: 5
    });
    setSelectedIndicators([]);
    setFormErrors({});
    setEditingId(null);
    setCustomIndicator('');
  };

  // Handle cancel
  const handleCancel = () => {
    setIsFormOpen(false);
    resetForm();
  };

  // Handle indicator toggle
  const handleIndicatorToggle = (indicator: string) => {
    let newSelected: string[];
    if (selectedIndicators.includes(indicator)) {
      newSelected = selectedIndicators.filter((i) => i !== indicator);
    } else {
      newSelected = [...selectedIndicators, indicator];
    }
    setSelectedIndicators(newSelected);
    setFormData({
      ...formData,
      indicators: newSelected.join(', ')
    });
  };

  // Handle adding custom indicator
  const handleAddCustomIndicator = () => {
    if (
    customIndicator.trim() &&
    !selectedIndicators.includes(customIndicator.trim()))
    {
      const newSelected = [...selectedIndicators, customIndicator.trim()];
      setSelectedIndicators(newSelected);
      setFormData({
        ...formData,
        indicators: newSelected.join(', ')
      });
      setCustomIndicator('');
    }
  };

  // Handle area change in form
  const handleAreaChange = (area: string) => {
    setFormData({ ...formData, area });
    // Clear selected indicators when area changes
    setSelectedIndicators([]);
  };

  // Handle toggle status
  const handleToggleStatus = (id: number) => {
    setData(
      data.map((item) =>
      item.id === id ?
      { ...item, status: item.status === 'Active' ? 'Inactive' : 'Active' } :
      item
      )
    );
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterArea('');
    setFilterStatus('');
  };

  const columns = [
  {
    key: 'area',
    header: 'Co-Scholastic Area'
  },
  {
    key: 'skill',
    header: 'Skill / Activity'
  },
  {
    key: 'indicators',
    header: 'Assessment Indicators',
    render: (row: CoScholasticData) =>
    <div className="max-w-xs">
          <span className="text-sm text-gray-600">{row.indicators}</span>
        </div>

  },
  {
    key: 'scale',
    header: 'Grading Scale',
    render: (row: CoScholasticData) =>
    <Badge variant="default">{row.scale}</Badge>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: CoScholasticData) =>
    <Badge
      variant={row.status === 'Active' ? 'success' : 'default'}
      onClick={() => handleToggleStatus(row.id)}
      className="cursor-pointer">

          {row.status}
        </Badge>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: CoScholasticData) =>
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
            Co-Scholastic Areas & Skills
          </h1>
          <p className="text-sm text-gray-500">
            Manage co-curricular assessment areas
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {/* Form Card */}
      {isFormOpen &&
      <Card>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {editingId ? 'Edit Skill / Activity' : 'Add New Skill / Activity'}
              </h2>
              <Button variant="ghost" size="xs" onClick={handleCancel}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Area Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Co-Scholastic Area *
                  </label>
                  <select
                  value={formData.area}
                  onChange={(e) => handleAreaChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md">

                    <option value="">Select Area</option>
                    {areaOptions.map((area) =>
                  <option key={area} value={area}>
                        {area}
                      </option>
                  )}
                  </select>
                  {formErrors.area &&
                <p className="text-red-500 text-xs mt-1">{formErrors.area}</p>
                }
                </div>

                {/* Skill Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Skill / Activity Name *
                  </label>
                  <Input
                  value={formData.skill}
                  onChange={(e) =>
                  setFormData({ ...formData, skill: e.target.value })
                  }
                  placeholder="e.g., Visual Arts, Sports, Music" />

                  {formErrors.skill &&
                <p className="text-red-500 text-xs mt-1">{formErrors.skill}</p>
                }
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Grading Scale */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Grading Scale *
                  </label>
                  <select
                  value={formData.scale}
                  onChange={(e) =>
                  setFormData({ ...formData, scale: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md">

                    {scaleOptions.map((scale) =>
                  <option key={scale.value} value={scale.value}>
                        {scale.label}
                      </option>
                  )}
                  </select>
                  {formErrors.scale &&
                <p className="text-red-500 text-xs mt-1">{formErrors.scale}</p>
                }
                </div>

                {/* Max Score */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Maximum Score
                  </label>
                  <Input
                  type="number"
                  value={formData.maxScore}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxScore: parseInt(e.target.value) || 5
                  })
                  }
                  min={1}
                  max={100} />

                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                value={formData.description}
                onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description of this skill/activity..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={2} />

              </div>

              {/* Indicator Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Assessment Indicators *
                </label>
                {formData.area && indicatorsByArea[formData.area] ?
              <div className="border border-gray-300 rounded-md p-4 max-h-48 overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {indicatorsByArea[formData.area].map((indicator) =>
                  <label
                    key={indicator.id}
                    className="flex items-center space-x-2 cursor-pointer">

                          <input
                      type="checkbox"
                      checked={selectedIndicators.includes(indicator.name)}
                      onChange={() => handleIndicatorToggle(indicator.name)}
                      className="rounded" />

                          <span className="text-sm">{indicator.name}</span>
                        </label>
                  )}
                    </div>
                  </div> :

              <p className="text-sm text-gray-500 italic">
                    Please select an area first to see available indicators
                  </p>
              }
                {formErrors.indicators &&
              <p className="text-red-500 text-xs mt-1">
                    {formErrors.indicators}
                  </p>
              }

                {/* Custom Indicator Input */}
                <div className="mt-3 flex gap-2">
                  <Input
                  value={customIndicator}
                  onChange={(e) => setCustomIndicator(e.target.value)}
                  placeholder="Add custom indicator..."
                  className="flex-1" />

                  <Button
                  type="button"
                  variant="ghost"
                  onClick={handleAddCustomIndicator}
                  disabled={!customIndicator.trim()}>

                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Selected Indicators Display */}
                {selectedIndicators.length > 0 &&
              <div className="mt-3">
                    <p className="text-sm font-medium mb-2">Selected Indicators:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedIndicators.map((indicator, index) =>
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 text-sm bg-gray-100 rounded">

                          {indicator}
                          <button
                      type="button"
                      onClick={() => handleIndicatorToggle(indicator)}
                      className="ml-1 text-gray-500 hover:text-gray-700">

                            <X className="w-3 h-3" />
                          </button>
                        </span>
                  )}
                    </div>
                  </div>
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
                  {editingId ? 'Update Skill' : 'Save Skill'}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      }

      {/* Filters and Table Card */}
      <Card>
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <Input
              leftIcon={<Search className="w-4 h-4" />}
              placeholder="Search areas, skills, or indicators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} />

          </div>

          {/* Area Filter */}
          <div className="min-w-[150px]">
            <select
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md">

              <option value="">All Areas</option>
              {uniqueAreas.map((area) =>
              <option key={area} value={area}>
                  {area}
                </option>
              )}
            </select>
          </div>

          {/* Status Filter */}
          <div className="min-w-[120px]">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md">

              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Clear Filters */}
          {(searchQuery || filterArea || filterStatus) &&
          <Button variant="ghost" onClick={handleClearFilters}>
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          }
        </div>

        {/* Results Summary */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredData.length} of {data.length} skills
        </div>

        {filteredData.length === 0 ?
        <div className="text-center py-12">
            <p className="text-gray-500">
              {searchQuery || filterArea || filterStatus ?
            'No skills found matching your filters.' :
            'No skills added yet. Click "Add Skill" to create one.'}
            </p>
            {(searchQuery || filterArea || filterStatus) &&
          <Button
            variant="ghost"
            onClick={handleClearFilters}
            className="mt-2">

                Clear Filters
              </Button>
          }
          </div> :

        <Table columns={columns} data={filteredData} />
        }
      </Card>
    </div>);

}