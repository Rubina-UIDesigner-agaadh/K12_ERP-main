// src/pages/admin/masters/FeeStructureTemplateMaster.tsx

import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Plus, Edit2, Trash2, Copy, Search, X, Eye, FileText } from 'lucide-react';

interface FeeHeadItem {
  id: number;
  name: string;
  amount: number;
  frequency: string;
  dueMonth: string;
}

interface FeeStructureTemplate {
  id: number;
  name: string;
  description: string;
  totalAmount: number;
  classes: string[];
  academicYear: string;
  feeHeads: FeeHeadItem[];
  installments: number;
  isActive: boolean;
  createdDate: string;
  lastModified: string;
}

// Available fee heads for selection
const availableFeeHeads = [
{ id: 1, name: 'Tuition Fee', defaultAmount: 20000, frequency: 'Monthly' },
{ id: 2, name: 'Admission Fee', defaultAmount: 5000, frequency: 'One-time' },
{ id: 3, name: 'Term Fee', defaultAmount: 8000, frequency: 'Term-wise' },
{ id: 4, name: 'Activity Fee', defaultAmount: 3000, frequency: 'Annual' },
{ id: 5, name: 'Lab Fee', defaultAmount: 4000, frequency: 'Annual' },
{ id: 6, name: 'Exam Fee', defaultAmount: 2500, frequency: 'Term-wise' },
{ id: 7, name: 'Library Fee', defaultAmount: 1500, frequency: 'Annual' },
{ id: 8, name: 'Sports Fee', defaultAmount: 2000, frequency: 'Annual' },
{ id: 9, name: 'Computer Fee', defaultAmount: 3500, frequency: 'Annual' },
{ id: 10, name: 'Transport Fee', defaultAmount: 15000, frequency: 'Monthly' },
{ id: 11, name: 'Development Fee', defaultAmount: 5000, frequency: 'Annual' },
{ id: 12, name: 'Smart Class Fee', defaultAmount: 2500, frequency: 'Annual' }];


// Available classes
const availableClasses = [
'Nursery',
'LKG',
'UKG',
'Class 1',
'Class 2',
'Class 3',
'Class 4',
'Class 5',
'Class 6',
'Class 7',
'Class 8',
'Class 9',
'Class 10',
'Class 11',
'Class 12'];


// Due months
const dueMonths = [
'April',
'May',
'June',
'July',
'August',
'September',
'October',
'November',
'December',
'January',
'February',
'March'];


export function FeeStructureTemplateMaster() {
  const [templates, setTemplates] = useState<FeeStructureTemplate[]>([
  {
    id: 1,
    name: 'Primary Standard',
    description: 'Standard fee structure for primary classes',
    totalAmount: 35000,
    classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'],
    academicYear: '2024-25',
    feeHeads: [
    { id: 1, name: 'Tuition Fee', amount: 20000, frequency: 'Monthly', dueMonth: 'April' },
    { id: 3, name: 'Term Fee', amount: 8000, frequency: 'Term-wise', dueMonth: 'April' },
    { id: 4, name: 'Activity Fee', amount: 3000, frequency: 'Annual', dueMonth: 'April' },
    { id: 7, name: 'Library Fee', amount: 1500, frequency: 'Annual', dueMonth: 'April' },
    { id: 8, name: 'Sports Fee', amount: 2500, frequency: 'Annual', dueMonth: 'April' }],

    installments: 4,
    isActive: true,
    createdDate: '2024-01-15',
    lastModified: '2024-02-20'
  },
  {
    id: 2,
    name: 'Secondary Standard',
    description: 'Standard fee structure for secondary classes',
    totalAmount: 45000,
    classes: ['Class 6', 'Class 7', 'Class 8'],
    academicYear: '2024-25',
    feeHeads: [
    { id: 1, name: 'Tuition Fee', amount: 25000, frequency: 'Monthly', dueMonth: 'April' },
    { id: 5, name: 'Lab Fee', amount: 4000, frequency: 'Annual', dueMonth: 'April' },
    { id: 3, name: 'Term Fee', amount: 10000, frequency: 'Term-wise', dueMonth: 'April' },
    { id: 9, name: 'Computer Fee', amount: 3500, frequency: 'Annual', dueMonth: 'April' },
    { id: 7, name: 'Library Fee', amount: 2500, frequency: 'Annual', dueMonth: 'April' }],

    installments: 4,
    isActive: true,
    createdDate: '2024-01-15',
    lastModified: '2024-02-18'
  },
  {
    id: 3,
    name: 'High School Science',
    description: 'Fee structure for high school science stream',
    totalAmount: 60000,
    classes: ['Class 9', 'Class 10'],
    academicYear: '2024-25',
    feeHeads: [
    { id: 1, name: 'Tuition Fee', amount: 35000, frequency: 'Monthly', dueMonth: 'April' },
    { id: 5, name: 'Lab Fee', amount: 8000, frequency: 'Annual', dueMonth: 'April' },
    { id: 6, name: 'Exam Fee', amount: 5000, frequency: 'Term-wise', dueMonth: 'April' },
    { id: 9, name: 'Computer Fee', amount: 5000, frequency: 'Annual', dueMonth: 'April' },
    { id: 12, name: 'Smart Class Fee', amount: 4000, frequency: 'Annual', dueMonth: 'April' },
    { id: 7, name: 'Library Fee', amount: 3000, frequency: 'Annual', dueMonth: 'April' }],

    installments: 3,
    isActive: true,
    createdDate: '2024-01-10',
    lastModified: '2024-02-25'
  },
  {
    id: 4,
    name: 'Pre-Primary',
    description: 'Fee structure for nursery and kindergarten',
    totalAmount: 25000,
    classes: ['Nursery', 'LKG', 'UKG'],
    academicYear: '2024-25',
    feeHeads: [
    { id: 1, name: 'Tuition Fee', amount: 18000, frequency: 'Monthly', dueMonth: 'April' },
    { id: 4, name: 'Activity Fee', amount: 5000, frequency: 'Annual', dueMonth: 'April' },
    { id: 8, name: 'Sports Fee', amount: 2000, frequency: 'Annual', dueMonth: 'April' }],

    installments: 4,
    isActive: true,
    createdDate: '2024-01-12',
    lastModified: '2024-02-15'
  },
  {
    id: 5,
    name: 'Senior Secondary Science',
    description: 'Fee structure for class 11-12 science stream',
    totalAmount: 75000,
    classes: ['Class 11', 'Class 12'],
    academicYear: '2024-25',
    feeHeads: [
    { id: 1, name: 'Tuition Fee', amount: 45000, frequency: 'Monthly', dueMonth: 'April' },
    { id: 5, name: 'Lab Fee', amount: 12000, frequency: 'Annual', dueMonth: 'April' },
    { id: 6, name: 'Exam Fee', amount: 6000, frequency: 'Term-wise', dueMonth: 'April' },
    { id: 9, name: 'Computer Fee', amount: 5000, frequency: 'Annual', dueMonth: 'April' },
    { id: 12, name: 'Smart Class Fee', amount: 4000, frequency: 'Annual', dueMonth: 'April' },
    { id: 7, name: 'Library Fee', amount: 3000, frequency: 'Annual', dueMonth: 'April' }],

    installments: 2,
    isActive: true,
    createdDate: '2024-01-08',
    lastModified: '2024-02-22'
  },
  {
    id: 6,
    name: 'Day Scholar with Transport',
    description: 'Fee structure including transport for day scholars',
    totalAmount: 55000,
    classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'],
    academicYear: '2024-25',
    feeHeads: [
    { id: 1, name: 'Tuition Fee', amount: 20000, frequency: 'Monthly', dueMonth: 'April' },
    { id: 10, name: 'Transport Fee', amount: 18000, frequency: 'Monthly', dueMonth: 'April' },
    { id: 3, name: 'Term Fee', amount: 8000, frequency: 'Term-wise', dueMonth: 'April' },
    { id: 4, name: 'Activity Fee', amount: 3000, frequency: 'Annual', dueMonth: 'April' },
    { id: 11, name: 'Development Fee', amount: 6000, frequency: 'Annual', dueMonth: 'April' }],

    installments: 4,
    isActive: true,
    createdDate: '2024-01-20',
    lastModified: '2024-02-10'
  },
  {
    id: 7,
    name: 'RTE Category',
    description: 'Subsidized fee structure for RTE students',
    totalAmount: 0,
    classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8'],
    academicYear: '2024-25',
    feeHeads: [
    { id: 4, name: 'Activity Fee', amount: 0, frequency: 'Annual', dueMonth: 'April' }],

    installments: 1,
    isActive: true,
    createdDate: '2024-01-25',
    lastModified: '2024-02-05'
  },
  {
    id: 8,
    name: 'Staff Ward Concession',
    description: 'Discounted fee structure for staff children',
    totalAmount: 15000,
    classes: ['Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'],
    academicYear: '2024-25',
    feeHeads: [
    { id: 1, name: 'Tuition Fee', amount: 10000, frequency: 'Monthly', dueMonth: 'April' },
    { id: 4, name: 'Activity Fee', amount: 2000, frequency: 'Annual', dueMonth: 'April' },
    { id: 7, name: 'Library Fee', amount: 1000, frequency: 'Annual', dueMonth: 'April' },
    { id: 8, name: 'Sports Fee', amount: 2000, frequency: 'Annual', dueMonth: 'April' }],

    installments: 4,
    isActive: true,
    createdDate: '2024-02-01',
    lastModified: '2024-02-28'
  }]
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<FeeStructureTemplate | null>(null);
  const [viewingTemplate, setViewingTemplate] = useState<FeeStructureTemplate | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    classes: string[];
    academicYear: string;
    feeHeads: FeeHeadItem[];
    installments: number;
    isActive: boolean;
  }>({
    name: '',
    description: '',
    classes: [],
    academicYear: '2024-25',
    feeHeads: [],
    installments: 4,
    isActive: true
  });

  // Academic year options
  const academicYearOptions = ['2023-24', '2024-25', '2025-26'];

  // Filter templates
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.classes.some((c) =>
    c.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesYear =
    selectedAcademicYear === 'all' ||
    template.academicYear === selectedAcademicYear;
    const matchesStatus =
    selectedStatus === 'all' ||
    selectedStatus === 'active' && template.isActive ||
    selectedStatus === 'inactive' && !template.isActive;
    return matchesSearch && matchesYear && matchesStatus;
  });

  // Calculate total amount from fee heads
  const calculateTotalAmount = (feeHeads: FeeHeadItem[]): number => {
    return feeHeads.reduce((total, head) => total + head.amount, 0);
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return `₹ ${amount.toLocaleString('en-IN')}`;
  };

  // Format classes display
  const formatClasses = (classes: string[]): string => {
    if (classes.length === 0) return 'None';
    if (classes.length <= 3) return classes.join(', ');
    return `${classes.slice(0, 2).join(', ')} +${classes.length - 2} more`;
  };

  // Format fee heads display
  const formatFeeHeads = (feeHeads: FeeHeadItem[]): string => {
    if (feeHeads.length === 0) return 'None';
    const names = feeHeads.map((h) => h.name.replace(' Fee', ''));
    if (names.length <= 3) return names.join(', ');
    return `${names.slice(0, 3).join(', ')} +${names.length - 3} more`;
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle create new template
  const handleCreateNew = () => {
    setEditingTemplate(null);
    setFormData({
      name: '',
      description: '',
      classes: [],
      academicYear: '2024-25',
      feeHeads: [],
      installments: 4,
      isActive: true
    });
    setIsModalOpen(true);
  };

  // Handle edit template
  const handleEdit = (template: FeeStructureTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description,
      classes: [...template.classes],
      academicYear: template.academicYear,
      feeHeads: [...template.feeHeads],
      installments: template.installments,
      isActive: template.isActive
    });
    setIsModalOpen(true);
  };

  // Handle clone template
  const handleClone = (template: FeeStructureTemplate) => {
    setEditingTemplate(null);
    setFormData({
      name: `${template.name} (Copy)`,
      description: template.description,
      classes: [...template.classes],
      academicYear: template.academicYear,
      feeHeads: [...template.feeHeads],
      installments: template.installments,
      isActive: true
    });
    setIsModalOpen(true);
  };

  // Handle view template
  const handleView = (template: FeeStructureTemplate) => {
    setViewingTemplate(template);
    setIsViewModalOpen(true);
  };

  // Handle delete template
  const handleDelete = (id: number) => {
    const template = templates.find((t) => t.id === id);
    if (
    window.confirm(
      `Are you sure you want to delete "${template?.name}"? This action cannot be undone.`
    ))
    {
      setTemplates(templates.filter((t) => t.id !== id));
    }
  };

  // Handle form input change
  const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
  {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: name === 'installments' ? parseInt(value) || 1 : value
      });
    }
  };

  // Handle class selection
  const handleClassToggle = (className: string) => {
    setFormData((prev) => ({
      ...prev,
      classes: prev.classes.includes(className) ?
      prev.classes.filter((c) => c !== className) :
      [...prev.classes, className]
    }));
  };

  // Handle select all classes in a range
  const handleSelectClassRange = (range: string) => {
    let classesToAdd: string[] = [];
    switch (range) {
      case 'pre-primary':
        classesToAdd = ['Nursery', 'LKG', 'UKG'];
        break;
      case 'primary':
        classesToAdd = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'];
        break;
      case 'secondary':
        classesToAdd = ['Class 6', 'Class 7', 'Class 8'];
        break;
      case 'high-school':
        classesToAdd = ['Class 9', 'Class 10'];
        break;
      case 'senior-secondary':
        classesToAdd = ['Class 11', 'Class 12'];
        break;
      case 'all':
        classesToAdd = [...availableClasses];
        break;
      case 'clear':
        classesToAdd = [];
        setFormData((prev) => ({ ...prev, classes: [] }));
        return;
    }
    setFormData((prev) => ({
      ...prev,
      classes: [...new Set([...prev.classes, ...classesToAdd])]
    }));
  };

  // Handle add fee head
  const handleAddFeeHead = (feeHeadId: number) => {
    const feeHead = availableFeeHeads.find((h) => h.id === feeHeadId);
    if (feeHead && !formData.feeHeads.some((h) => h.id === feeHeadId)) {
      setFormData((prev) => ({
        ...prev,
        feeHeads: [
        ...prev.feeHeads,
        {
          id: feeHead.id,
          name: feeHead.name,
          amount: feeHead.defaultAmount,
          frequency: feeHead.frequency,
          dueMonth: 'April'
        }]

      }));
    }
  };

  // Handle remove fee head
  const handleRemoveFeeHead = (feeHeadId: number) => {
    setFormData((prev) => ({
      ...prev,
      feeHeads: prev.feeHeads.filter((h) => h.id !== feeHeadId)
    }));
  };

  // Handle fee head amount change
  const handleFeeHeadAmountChange = (feeHeadId: number, amount: number) => {
    setFormData((prev) => ({
      ...prev,
      feeHeads: prev.feeHeads.map((h) =>
      h.id === feeHeadId ? { ...h, amount } : h
      )
    }));
  };

  // Handle fee head due month change
  const handleFeeHeadDueMonthChange = (feeHeadId: number, dueMonth: string) => {
    setFormData((prev) => ({
      ...prev,
      feeHeads: prev.feeHeads.map((h) =>
      h.id === feeHeadId ? { ...h, dueMonth } : h
      )
    }));
  };

  // Validate form
  const validateForm = (): string | null => {
    if (!formData.name.trim()) {
      return 'Template name is required';
    }
    if (formData.classes.length === 0) {
      return 'Please select at least one class';
    }
    if (formData.feeHeads.length === 0) {
      return 'Please add at least one fee head';
    }
    if (formData.installments < 1 || formData.installments > 12) {
      return 'Installments must be between 1 and 12';
    }

    // Check for duplicate name
    const duplicateName = templates.find(
      (t) =>
      t.name.toLowerCase() === formData.name.toLowerCase() &&
      t.id !== editingTemplate?.id
    );
    if (duplicateName) {
      return 'A template with this name already exists';
    }

    return null;
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    const totalAmount = calculateTotalAmount(formData.feeHeads);
    const currentDate = new Date().toISOString().split('T')[0];

    if (editingTemplate) {
      setTemplates(
        templates.map((template) =>
        template.id === editingTemplate.id ?
        {
          ...template,
          ...formData,
          totalAmount,
          lastModified: currentDate
        } :
        template
        )
      );
    } else {
      const newTemplate: FeeStructureTemplate = {
        id: Math.max(...templates.map((t) => t.id), 0) + 1,
        ...formData,
        totalAmount,
        createdDate: currentDate,
        lastModified: currentDate
      };
      setTemplates([...templates, newTemplate]);
    }

    handleCloseModal();
  };

  // Handle close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTemplate(null);
    setFormData({
      name: '',
      description: '',
      classes: [],
      academicYear: '2024-25',
      feeHeads: [],
      installments: 4,
      isActive: true
    });
  };

  // Handle close view modal
  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingTemplate(null);
  };

  const columns = [
  {
    key: 'name',
    header: 'Template Name',
    render: (row: FeeStructureTemplate) =>
    <div>
          <span
        className="font-medium cursor-pointer hover:underline"
        onClick={() => handleView(row)}>

            {row.name}
          </span>
          {!row.isActive &&
      <Badge variant="secondary" className="ml-2">
              Inactive
            </Badge>
      }
        </div>

  },
  {
    key: 'amount',
    header: 'Total Annual Fee',
    render: (row: FeeStructureTemplate) => formatCurrency(row.totalAmount)
  },
  {
    key: 'classes',
    header: 'Applicable Classes',
    render: (row: FeeStructureTemplate) => formatClasses(row.classes)
  },
  {
    key: 'heads',
    header: 'Fee Heads Included',
    render: (row: FeeStructureTemplate) => formatFeeHeads(row.feeHeads)
  },
  {
    key: 'installments',
    header: 'Installments'
  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: FeeStructureTemplate) =>
    <div className="flex gap-2">
          <Button
        variant="ghost"
        size="xs"
        title="View"
        onClick={() => handleView(row)}>

            <Eye className="w-4 h-4" />
          </Button>
          <Button
        variant="ghost"
        size="xs"
        title="Clone"
        onClick={() => handleClone(row)}>

            <Copy className="w-4 h-4" />
          </Button>
          <Button
        variant="ghost"
        size="xs"
        title="Edit"
        onClick={() => handleEdit(row)}>

            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
        variant="ghost"
        size="xs"
        className="text-red-500"
        title="Delete"
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
            Fee Structure Templates
          </h1>
          <p className="text-sm text-gray-500">
            Create reusable fee structures for classes
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      <Card>
        <div className="flex gap-4 mb-6 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <Input
              leftIcon={<Search className="w-4 h-4" />}
              placeholder="Search templates..."
              value={searchTerm}
              onChange={handleSearch} />

          </div>
          <Select
            placeholder="Academic Year"
            value={selectedAcademicYear}
            onChange={(e) => setSelectedAcademicYear(e.target.value)}
            options={[
            { value: 'all', label: 'All Years' },
            ...academicYearOptions.map((year) => ({
              value: year,
              label: year
            }))]
            } />

          <Select
            placeholder="Status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            options={[
            { value: 'all', label: 'All Status' },
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' }]
            } />

        </div>

        <div className="mb-4 text-sm text-gray-500">
          Showing {filteredTemplates.length} of {templates.length} templates
        </div>

        <Table columns={columns} data={filteredTemplates} />
      </Card>

      {/* Create/Edit Modal */}
      {isModalOpen &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingTemplate ? 'Edit Template' : 'Create New Template'}
              </h2>
              <button
              onClick={handleCloseModal}
              className="text-gray-500 hover:text-gray-700">

                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold border-b pb-2">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Template Name *
                    </label>
                    <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter template name"
                    required />

                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Academic Year *
                    </label>
                    <Select
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleInputChange}
                    options={academicYearOptions.map((year) => ({
                      value: year,
                      label: year
                    }))}
                    required />

                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2} />

                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Number of Installments *
                    </label>
                    <Input
                    type="number"
                    name="installments"
                    value={formData.installments}
                    onChange={handleInputChange}
                    min="1"
                    max="12"
                    required />

                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="w-4 h-4" />

                    <label htmlFor="isActive" className="text-sm font-medium">
                      Active Template
                    </label>
                  </div>
                </div>
              </div>

              {/* Class Selection */}
              <div className="space-y-4">
                <h3 className="font-semibold border-b pb-2">
                  Applicable Classes ({formData.classes.length} selected)
                </h3>
                <div className="flex gap-2 flex-wrap mb-2">
                  <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectClassRange('pre-primary')}>

                    Pre-Primary
                  </Button>
                  <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectClassRange('primary')}>

                    Primary (1-5)
                  </Button>
                  <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectClassRange('secondary')}>

                    Secondary (6-8)
                  </Button>
                  <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectClassRange('high-school')}>

                    High School (9-10)
                  </Button>
                  <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectClassRange('senior-secondary')}>

                    Sr. Secondary (11-12)
                  </Button>
                  <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectClassRange('all')}>

                    Select All
                  </Button>
                  <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectClassRange('clear')}>

                    Clear All
                  </Button>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {availableClasses.map((className) =>
                <label
                  key={className}
                  className={`flex items-center gap-2 p-2 border rounded cursor-pointer ${
                  formData.classes.includes(className) ?
                  'bg-blue-50 border-blue-300' :
                  'hover:bg-gray-50'}`
                  }>

                      <input
                    type="checkbox"
                    checked={formData.classes.includes(className)}
                    onChange={() => handleClassToggle(className)}
                    className="w-4 h-4" />

                      <span className="text-sm">{className}</span>
                    </label>
                )}
                </div>
              </div>

              {/* Fee Heads */}
              <div className="space-y-4">
                <h3 className="font-semibold border-b pb-2">
                  Fee Heads ({formData.feeHeads.length} added) - Total:{' '}
                  {formatCurrency(calculateTotalAmount(formData.feeHeads))}
                </h3>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Add Fee Head
                  </label>
                  <Select
                  value=""
                  onChange={(e) => handleAddFeeHead(parseInt(e.target.value))}
                  options={[
                  { value: '', label: 'Select fee head to add' },
                  ...availableFeeHeads.
                  filter(
                    (h) => !formData.feeHeads.some((fh) => fh.id === h.id)
                  ).
                  map((h) => ({
                    value: h.id.toString(),
                    label: `${h.name} (Default: ${formatCurrency(
                      h.defaultAmount
                    )})`
                  }))]
                  } />

                </div>

                {formData.feeHeads.length > 0 &&
              <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium">
                            Fee Head
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium">
                            Frequency
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium">
                            Amount (₹)
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium">
                            Due Month
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.feeHeads.map((feeHead) =>
                    <tr key={feeHead.id} className="border-t">
                            <td className="px-4 py-2">{feeHead.name}</td>
                            <td className="px-4 py-2">{feeHead.frequency}</td>
                            <td className="px-4 py-2">
                              <Input
                          type="number"
                          value={feeHead.amount}
                          onChange={(e) =>
                          handleFeeHeadAmountChange(
                            feeHead.id,
                            parseFloat(e.target.value) || 0
                          )
                          }
                          min="0"
                          className="w-32" />

                            </td>
                            <td className="px-4 py-2">
                              <Select
                          value={feeHead.dueMonth}
                          onChange={(e) =>
                          handleFeeHeadDueMonthChange(
                            feeHead.id,
                            e.target.value
                          )
                          }
                          options={dueMonths.map((month) => ({
                            value: month,
                            label: month
                          }))}
                          className="w-32" />

                            </td>
                            <td className="px-4 py-2">
                              <Button
                          type="button"
                          variant="ghost"
                          size="xs"
                          className="text-red-500"
                          onClick={() => handleRemoveFeeHead(feeHead.id)}>

                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                    )}
                      </tbody>
                    </table>
                  </div>
              }
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button type="submit" className="flex-1">
                  {editingTemplate ? 'Update Template' : 'Create Template'}
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

      {/* View Details Modal */}
      {isViewModalOpen && viewingTemplate &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Template Details
              </h2>
              <button
              onClick={handleCloseViewModal}
              className="text-gray-500 hover:text-gray-700">

                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Template Name</label>
                  <p className="font-medium">{viewingTemplate.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Academic Year</label>
                  <p className="font-medium">{viewingTemplate.academicYear}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Total Amount</label>
                  <p className="font-medium text-lg">
                    {formatCurrency(viewingTemplate.totalAmount)}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Installments</label>
                  <p className="font-medium">{viewingTemplate.installments}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Status</label>
                  <p className="font-medium">
                    {viewingTemplate.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Per Installment</label>
                  <p className="font-medium">
                    {formatCurrency(
                    Math.round(
                      viewingTemplate.totalAmount / viewingTemplate.installments
                    )
                  )}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500">Description</label>
                <p className="font-medium">
                  {viewingTemplate.description || 'No description'}
                </p>
              </div>

              {/* Applicable Classes */}
              <div>
                <label className="text-sm text-gray-500 block mb-2">
                  Applicable Classes ({viewingTemplate.classes.length})
                </label>
                <div className="flex flex-wrap gap-2">
                  {viewingTemplate.classes.map((className) =>
                <Badge key={className} variant="secondary">
                      {className}
                    </Badge>
                )}
                </div>
              </div>

              {/* Fee Heads Breakdown */}
              <div>
                <label className="text-sm text-gray-500 block mb-2">
                  Fee Heads Breakdown
                </label>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium">
                          Fee Head
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium">
                          Frequency
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium">
                          Due Month
                        </th>
                        <th className="px-4 py-2 text-right text-sm font-medium">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewingTemplate.feeHeads.map((feeHead) =>
                    <tr key={feeHead.id} className="border-t">
                          <td className="px-4 py-2">{feeHead.name}</td>
                          <td className="px-4 py-2">{feeHead.frequency}</td>
                          <td className="px-4 py-2">{feeHead.dueMonth}</td>
                          <td className="px-4 py-2 text-right">
                            {formatCurrency(feeHead.amount)}
                          </td>
                        </tr>
                    )}
                      <tr className="border-t bg-gray-50 font-semibold">
                        <td className="px-4 py-2" colSpan={3}>
                          Total
                        </td>
                        <td className="px-4 py-2 text-right">
                          {formatCurrency(viewingTemplate.totalAmount)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-gray-500">Created Date</label>
                  <p>{viewingTemplate.createdDate}</p>
                </div>
                <div>
                  <label className="text-gray-500">Last Modified</label>
                  <p>{viewingTemplate.lastModified}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button
                onClick={() => {
                  handleCloseViewModal();
                  handleEdit(viewingTemplate);
                }}
                className="flex-1">

                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Template
                </Button>
                <Button
                variant="outline"
                onClick={() => {
                  handleCloseViewModal();
                  handleClone(viewingTemplate);
                }}
                className="flex-1">

                  <Copy className="w-4 h-4 mr-2" />
                  Clone Template
                </Button>
                <Button
                variant="outline"
                onClick={handleCloseViewModal}
                className="flex-1">

                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}