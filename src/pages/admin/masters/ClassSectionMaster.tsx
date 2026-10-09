import React, { useState, useMemo, useCallback } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Plus, Search, Edit2, Trash2, X, AlertTriangle, Check } from 'lucide-react';

// ==================== TYPES ====================
interface ClassSection {
  id: number;
  class: string;
  section: string;
  capacity: number;
  teacher: string;
  room: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  class: string;
  section: string;
  capacity: number | string;
  teacher: string;
  room: string;
  status: 'Active' | 'Inactive';
}

interface FormErrors {
  class?: string;
  section?: string;
  capacity?: string;
  teacher?: string;
  room?: string;
  general?: string;
}

type ModalType = 'add' | 'edit' | 'delete' | 'view' | null;

// ==================== MOCK DATA ====================
const mockTeachers = [
{ id: 1, value: 'Mrs. Sharma', label: 'Mrs. Sharma', subject: 'Mathematics', available: true },
{ id: 2, value: 'Mr. Verma', label: 'Mr. Verma', subject: 'Science', available: true },
{ id: 3, value: 'Ms. Patel', label: 'Ms. Patel', subject: 'English', available: true },
{ id: 4, value: 'Mr. Singh', label: 'Mr. Singh', subject: 'Physics', available: true },
{ id: 5, value: 'Mrs. Gupta', label: 'Mrs. Gupta', subject: 'Chemistry', available: true },
{ id: 6, value: 'Mr. Kumar', label: 'Mr. Kumar', subject: 'Biology', available: true },
{ id: 7, value: 'Mrs. Joshi', label: 'Mrs. Joshi', subject: 'Hindi', available: true },
{ id: 8, value: 'Mr. Reddy', label: 'Mr. Reddy', subject: 'Social Studies', available: true },
{ id: 9, value: 'Ms. Nair', label: 'Ms. Nair', subject: 'Computer Science', available: true },
{ id: 10, value: 'Mr. Pillai', label: 'Mr. Pillai', subject: 'Physical Education', available: false },
{ id: 11, value: 'Mrs. Iyer', label: 'Mrs. Iyer', subject: 'Sanskrit', available: true },
{ id: 12, value: 'Mr. Rao', label: 'Mr. Rao', subject: 'Economics', available: true }];


const mockClasses = [
{ value: 'Class 1', label: 'Class 1', level: 'Primary' },
{ value: 'Class 2', label: 'Class 2', level: 'Primary' },
{ value: 'Class 3', label: 'Class 3', level: 'Primary' },
{ value: 'Class 4', label: 'Class 4', level: 'Primary' },
{ value: 'Class 5', label: 'Class 5', level: 'Primary' },
{ value: 'Class 6', label: 'Class 6', level: 'Middle' },
{ value: 'Class 7', label: 'Class 7', level: 'Middle' },
{ value: 'Class 8', label: 'Class 8', level: 'Middle' },
{ value: 'Class 9', label: 'Class 9', level: 'Secondary' },
{ value: 'Class 10', label: 'Class 10', level: 'Secondary' },
{ value: 'Class 11', label: 'Class 11', level: 'Senior Secondary' },
{ value: 'Class 12', label: 'Class 12', level: 'Senior Secondary' }];


const mockSections = [
{ value: 'A', label: 'Section A' },
{ value: 'B', label: 'Section B' },
{ value: 'C', label: 'Section C' },
{ value: 'D', label: 'Section D' },
{ value: 'E', label: 'Section E' }];


const mockRooms = [
{ value: '101', label: 'Room 101 - Ground Floor', floor: 'Ground' },
{ value: '102', label: 'Room 102 - Ground Floor', floor: 'Ground' },
{ value: '103', label: 'Room 103 - Ground Floor', floor: 'Ground' },
{ value: '104', label: 'Room 104 - Ground Floor', floor: 'Ground' },
{ value: '201', label: 'Room 201 - First Floor', floor: 'First' },
{ value: '202', label: 'Room 202 - First Floor', floor: 'First' },
{ value: '203', label: 'Room 203 - First Floor', floor: 'First' },
{ value: '204', label: 'Room 204 - First Floor', floor: 'First' },
{ value: '301', label: 'Room 301 - Second Floor', floor: 'Second' },
{ value: '302', label: 'Room 302 - Second Floor', floor: 'Second' },
{ value: '303', label: 'Room 303 - Second Floor', floor: 'Second' },
{ value: '304', label: 'Room 304 - Second Floor', floor: 'Second' }];


const initialClassSections: ClassSection[] = [
{
  id: 1,
  class: 'Class 1',
  section: 'A',
  capacity: 40,
  teacher: 'Mrs. Sharma',
  room: '101',
  status: 'Active',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z'
},
{
  id: 2,
  class: 'Class 1',
  section: 'B',
  capacity: 40,
  teacher: 'Mr. Verma',
  room: '102',
  status: 'Active',
  createdAt: '2024-01-15T10:35:00Z',
  updatedAt: '2024-01-15T10:35:00Z'
},
{
  id: 3,
  class: 'Class 2',
  section: 'A',
  capacity: 40,
  teacher: 'Ms. Patel',
  room: '103',
  status: 'Active',
  createdAt: '2024-01-15T10:40:00Z',
  updatedAt: '2024-01-15T10:40:00Z'
},
{
  id: 4,
  class: 'Class 2',
  section: 'B',
  capacity: 38,
  teacher: 'Mr. Kumar',
  room: '104',
  status: 'Active',
  createdAt: '2024-01-16T09:00:00Z',
  updatedAt: '2024-01-16T09:00:00Z'
},
{
  id: 5,
  class: 'Class 3',
  section: 'A',
  capacity: 42,
  teacher: 'Mrs. Joshi',
  room: '201',
  status: 'Active',
  createdAt: '2024-01-16T09:15:00Z',
  updatedAt: '2024-01-16T09:15:00Z'
},
{
  id: 6,
  class: 'Class 5',
  section: 'A',
  capacity: 35,
  teacher: 'Ms. Nair',
  room: '202',
  status: 'Active',
  createdAt: '2024-01-17T11:00:00Z',
  updatedAt: '2024-01-17T11:00:00Z'
},
{
  id: 7,
  class: 'Class 8',
  section: 'A',
  capacity: 45,
  teacher: 'Mr. Rao',
  room: '301',
  status: 'Inactive',
  createdAt: '2024-01-18T14:00:00Z',
  updatedAt: '2024-02-01T10:00:00Z'
},
{
  id: 8,
  class: 'Class 10',
  section: 'A',
  capacity: 35,
  teacher: 'Mr. Singh',
  room: '302',
  status: 'Active',
  createdAt: '2024-01-15T10:45:00Z',
  updatedAt: '2024-01-15T10:45:00Z'
},
{
  id: 9,
  class: 'Class 10',
  section: 'B',
  capacity: 35,
  teacher: 'Mrs. Gupta',
  room: '303',
  status: 'Active',
  createdAt: '2024-01-15T10:50:00Z',
  updatedAt: '2024-01-15T10:50:00Z'
},
{
  id: 10,
  class: 'Class 12',
  section: 'A',
  capacity: 30,
  teacher: 'Mrs. Iyer',
  room: '304',
  status: 'Active',
  createdAt: '2024-01-20T09:30:00Z',
  updatedAt: '2024-01-20T09:30:00Z'
}];


// ==================== INITIAL FORM STATE ====================
const initialFormData: FormData = {
  class: '',
  section: '',
  capacity: 40,
  teacher: '',
  room: '',
  status: 'Active'
};

// ==================== MAIN COMPONENT ====================
export function ClassSectionMaster() {
  // State Management
  const [classSections, setClassSections] = useState<ClassSection[]>(initialClassSections);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedSection, setSelectedSection] = useState<ClassSection | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // ==================== COMPUTED VALUES ====================

  // Generate unique class options from existing data
  const classFilterOptions = useMemo(() => {
    const uniqueClasses = [...new Set(classSections.map((section) => section.class))];
    const sortedClasses = uniqueClasses.sort((a, b) => {
      const numA = parseInt(a.replace('Class ', ''));
      const numB = parseInt(b.replace('Class ', ''));
      return numA - numB;
    });
    return [
    { value: 'all', label: 'All Classes' },
    ...sortedClasses.map((cls) => ({ value: cls, label: cls }))];

  }, [classSections]);

  // Get available teachers (not already assigned as class teacher)
  const availableTeachers = useMemo(() => {
    const assignedTeachers = classSections.
    filter((section) => section.id !== selectedSection?.id).
    map((section) => section.teacher);

    return mockTeachers.filter(
      (teacher) =>
      !assignedTeachers.includes(teacher.value) ||
      teacher.value === selectedSection?.teacher
    );
  }, [classSections, selectedSection]);

  // Get available rooms (not already assigned)
  const availableRooms = useMemo(() => {
    const assignedRooms = classSections.
    filter((section) => section.id !== selectedSection?.id && section.status === 'Active').
    map((section) => section.room);

    return mockRooms.filter(
      (room) =>
      !assignedRooms.includes(room.value) ||
      room.value === selectedSection?.room
    );
  }, [classSections, selectedSection]);

  // Filter and search data
  const filteredData = useMemo(() => {
    return classSections.filter((section) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase().trim();
      const matchesSearch = searchLower === '' ||
      section.class.toLowerCase().includes(searchLower) ||
      section.section.toLowerCase().includes(searchLower) ||
      section.teacher.toLowerCase().includes(searchLower) ||
      section.room.toLowerCase().includes(searchLower);

      // Class filter
      const matchesClass = classFilter === 'all' || section.class === classFilter;

      // Status filter
      const matchesStatus = statusFilter === 'all' || section.status === statusFilter;

      return matchesSearch && matchesClass && matchesStatus;
    });
  }, [classSections, searchQuery, classFilter, statusFilter]);

  // ==================== VALIDATION ====================

  const validateForm = useCallback((): boolean => {
    const errors: FormErrors = {};

    // Class validation
    if (!formData.class || formData.class.trim() === '') {
      errors.class = 'Please select a class';
    }

    // Section validation
    if (!formData.section || formData.section.trim() === '') {
      errors.section = 'Please select a section';
    }

    // Capacity validation
    const capacityNum = typeof formData.capacity === 'string' ?
    parseInt(formData.capacity) :
    formData.capacity;

    if (!capacityNum || isNaN(capacityNum)) {
      errors.capacity = 'Please enter a valid capacity';
    } else if (capacityNum < 1) {
      errors.capacity = 'Capacity must be at least 1';
    } else if (capacityNum > 100) {
      errors.capacity = 'Capacity cannot exceed 100 students';
    }

    // Teacher validation
    if (!formData.teacher || formData.teacher.trim() === '') {
      errors.teacher = 'Please select a class teacher';
    }

    // Room validation
    if (!formData.room || formData.room.trim() === '') {
      errors.room = 'Please select a room';
    }

    // Check for duplicate class-section combination
    const isDuplicate = classSections.some(
      (section) =>
      section.class === formData.class &&
      section.section === formData.section &&
      section.id !== selectedSection?.id
    );

    if (isDuplicate) {
      errors.section = `${formData.class} - Section ${formData.section} already exists`;
    }

    // Check if teacher is already assigned to another active class
    const teacherAlreadyAssigned = classSections.some(
      (section) =>
      section.teacher === formData.teacher &&
      section.status === 'Active' &&
      section.id !== selectedSection?.id
    );

    if (teacherAlreadyAssigned && formData.status === 'Active') {
      errors.teacher = `${formData.teacher} is already assigned as a class teacher`;
    }

    // Check if room is already assigned to another active class
    const roomAlreadyAssigned = classSections.some(
      (section) =>
      section.room === formData.room &&
      section.status === 'Active' &&
      section.id !== selectedSection?.id
    );

    if (roomAlreadyAssigned && formData.status === 'Active') {
      errors.room = `Room ${formData.room} is already assigned to another class`;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, classSections, selectedSection]);

  // ==================== HANDLERS ====================

  // Handle form input changes
  const handleInputChange = useCallback((field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));

    // Clear error for the field being edited
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as keyof FormErrors];
        return newErrors;
      });
    }
  }, [formErrors]);

  // Handle search input
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  // Handle class filter change
  const handleClassFilterChange = useCallback((value: string) => {
    setClassFilter(value);
  }, []);

  // Handle status filter change
  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value);
  }, []);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setClassFilter('all');
    setStatusFilter('all');
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setFormErrors({});
    setSelectedSection(null);
  }, []);

  // Show success message temporarily
  const showSuccessMessage = useCallback((message: string) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  }, []);

  // Open Add Modal
  const handleOpenAddModal = useCallback(() => {
    resetForm();
    setActiveModal('add');
  }, [resetForm]);

  // Open Edit Modal
  const handleOpenEditModal = useCallback((section: ClassSection) => {
    setSelectedSection(section);
    setFormData({
      class: section.class,
      section: section.section,
      capacity: section.capacity,
      teacher: section.teacher,
      room: section.room,
      status: section.status
    });
    setFormErrors({});
    setActiveModal('edit');
  }, []);

  // Open Delete Modal
  const handleOpenDeleteModal = useCallback((section: ClassSection) => {
    setSelectedSection(section);
    setActiveModal('delete');
  }, []);

  // Open View Modal
  const handleOpenViewModal = useCallback((section: ClassSection) => {
    setSelectedSection(section);
    setActiveModal('view');
  }, []);

  // Close Modal
  const handleCloseModal = useCallback(() => {
    setActiveModal(null);
    resetForm();
  }, [resetForm]);

  // Add new section
  const handleAddSection = useCallback(async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newSection: ClassSection = {
      id: Math.max(...classSections.map((s) => s.id), 0) + 1,
      class: formData.class,
      section: formData.section,
      capacity: typeof formData.capacity === 'string' ?
      parseInt(formData.capacity) :
      formData.capacity,
      teacher: formData.teacher,
      room: formData.room,
      status: formData.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setClassSections((prev) => [...prev, newSection]);
    setIsSubmitting(false);
    handleCloseModal();
    showSuccessMessage(`${newSection.class} - Section ${newSection.section} has been added successfully`);
  }, [validateForm, formData, classSections, handleCloseModal, showSuccessMessage]);

  // Update section
  const handleUpdateSection = useCallback(async () => {
    if (!validateForm() || !selectedSection) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    setClassSections((prev) =>
    prev.map((section) =>
    section.id === selectedSection.id ?
    {
      ...section,
      class: formData.class,
      section: formData.section,
      capacity: typeof formData.capacity === 'string' ?
      parseInt(formData.capacity) :
      formData.capacity,
      teacher: formData.teacher,
      room: formData.room,
      status: formData.status,
      updatedAt: new Date().toISOString()
    } :
    section
    )
    );

    setIsSubmitting(false);
    handleCloseModal();
    showSuccessMessage(`${formData.class} - Section ${formData.section} has been updated successfully`);
  }, [validateForm, selectedSection, formData, handleCloseModal, showSuccessMessage]);

  // Delete section
  const handleDeleteSection = useCallback(async () => {
    if (!selectedSection) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    setClassSections((prev) =>
    prev.filter((section) => section.id !== selectedSection.id)
    );

    setIsSubmitting(false);
    handleCloseModal();
    showSuccessMessage(`${selectedSection.class} - Section ${selectedSection.section} has been deleted successfully`);
  }, [selectedSection, handleCloseModal, showSuccessMessage]);

  // Toggle section status
  const handleToggleStatus = useCallback(async (section: ClassSection) => {
    const newStatus = section.status === 'Active' ? 'Inactive' : 'Active';

    // Check if room/teacher conflict when activating
    if (newStatus === 'Active') {
      const roomConflict = classSections.some(
        (s) => s.id !== section.id && s.room === section.room && s.status === 'Active'
      );
      const teacherConflict = classSections.some(
        (s) => s.id !== section.id && s.teacher === section.teacher && s.status === 'Active'
      );

      if (roomConflict || teacherConflict) {
        setFormErrors({
          general: `Cannot activate: ${roomConflict ? 'Room' : 'Teacher'} is already assigned to another active class`
        });
        setTimeout(() => setFormErrors({}), 3000);
        return;
      }
    }

    setClassSections((prev) =>
    prev.map((s) =>
    s.id === section.id ?
    { ...s, status: newStatus, updatedAt: new Date().toISOString() } :
    s
    )
    );

    showSuccessMessage(`${section.class} - Section ${section.section} is now ${newStatus}`);
  }, [classSections, showSuccessMessage]);

  // Duplicate section
  const handleDuplicateSection = useCallback((section: ClassSection) => {
    // Find the next available section letter
    const existingSections = classSections.
    filter((s) => s.class === section.class).
    map((s) => s.section);

    const allSections = ['A', 'B', 'C', 'D', 'E'];
    const nextSection = allSections.find((s) => !existingSections.includes(s));

    if (!nextSection) {
      setFormErrors({ general: 'All sections (A-E) already exist for this class' });
      setTimeout(() => setFormErrors({}), 3000);
      return;
    }

    setFormData({
      class: section.class,
      section: nextSection,
      capacity: section.capacity,
      teacher: '',
      room: '',
      status: 'Active'
    });
    setSelectedSection(null);
    setActiveModal('add');
  }, [classSections]);

  // Bulk status update
  const handleBulkStatusUpdate = useCallback((newStatus: 'Active' | 'Inactive') => {
    const filteredIds = filteredData.map((s) => s.id);

    setClassSections((prev) =>
    prev.map((section) =>
    filteredIds.includes(section.id) ?
    { ...section, status: newStatus, updatedAt: new Date().toISOString() } :
    section
    )
    );

    showSuccessMessage(`${filteredIds.length} sections have been marked as ${newStatus}`);
  }, [filteredData, showSuccessMessage]);

  // ==================== TABLE COLUMNS ====================
  const columns = [
  {
    key: 'class',
    header: 'Class Name',
    sortable: true
  },
  {
    key: 'section',
    header: 'Section',
    sortable: true
  },
  {
    key: 'capacity',
    header: 'Capacity',
    sortable: true
  },
  {
    key: 'teacher',
    header: 'Class Teacher',
    sortable: true
  },
  {
    key: 'room',
    header: 'Room No',
    sortable: true
  },
  {
    key: 'status',
    header: 'Status',
    render: (row: ClassSection) =>
    <Badge
      variant={row.status === 'Active' ? 'success' : 'secondary'}
      className="cursor-pointer"
      onClick={() => handleToggleStatus(row)}>

          {row.status}
        </Badge>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: ClassSection) =>
    <div className="flex gap-2">
          <Button
        variant="ghost"
        size="xs"
        onClick={() => handleOpenEditModal(row)}
        title="Edit Section">

            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
        variant="ghost"
        size="xs"
        className="text-red-500"
        onClick={() => handleOpenDeleteModal(row)}
        title="Delete Section">

            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

  }];


  // ==================== FORM COMPONENT ====================
  const SectionForm = () =>
  <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Class <span className="text-red-500">*</span>
          </label>
          <Select
          value={formData.class}
          options={mockClasses}
          onChange={(value) => handleInputChange('class', value)}
          placeholder="Select Class" />

          {formErrors.class &&
        <p className="text-red-500 text-xs mt-1">{formErrors.class}</p>
        }
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Section <span className="text-red-500">*</span>
          </label>
          <Select
          value={formData.section}
          options={mockSections}
          onChange={(value) => handleInputChange('section', value)}
          placeholder="Select Section" />

          {formErrors.section &&
        <p className="text-red-500 text-xs mt-1">{formErrors.section}</p>
        }
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Capacity <span className="text-red-500">*</span>
          </label>
          <Input
          type="number"
          min={1}
          max={100}
          value={formData.capacity}
          onChange={(e) => handleInputChange('capacity', e.target.value)}
          placeholder="Enter capacity" />

          {formErrors.capacity &&
        <p className="text-red-500 text-xs mt-1">{formErrors.capacity}</p>
        }
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Room Number <span className="text-red-500">*</span>
          </label>
          <Select
          value={formData.room}
          options={availableRooms}
          onChange={(value) => handleInputChange('room', value)}
          placeholder="Select Room" />

          {formErrors.room &&
        <p className="text-red-500 text-xs mt-1">{formErrors.room}</p>
        }
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Class Teacher <span className="text-red-500">*</span>
          </label>
          <Select
          value={formData.teacher}
          options={availableTeachers}
          onChange={(value) => handleInputChange('teacher', value)}
          placeholder="Select Teacher" />

          {formErrors.teacher &&
        <p className="text-red-500 text-xs mt-1">{formErrors.teacher}</p>
        }
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <Select
          value={formData.status}
          options={[
          { value: 'Active', label: 'Active' },
          { value: 'Inactive', label: 'Inactive' }]
          }
          onChange={(value) => handleInputChange('status', value as 'Active' | 'Inactive')} />

        </div>
      </div>
    </div>;


  // ==================== VIEW DETAILS COMPONENT ====================
  const ViewDetails = () => {
    if (!selectedSection) return null;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Class</p>
            <p className="font-medium">{selectedSection.class}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Section</p>
            <p className="font-medium">{selectedSection.section}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Capacity</p>
            <p className="font-medium">{selectedSection.capacity} students</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Room Number</p>
            <p className="font-medium">{selectedSection.room}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Class Teacher</p>
            <p className="font-medium">{selectedSection.teacher}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <Badge variant={selectedSection.status === 'Active' ? 'success' : 'secondary'}>
              {selectedSection.status}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-gray-500">Created At</p>
            <p className="font-medium">
              {new Date(selectedSection.createdAt).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="font-medium">
              {new Date(selectedSection.updatedAt).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      </div>);

  };

  // ==================== RENDER ====================
  return (
    <div className="space-y-6 p-6">
      {/* Success Message */}
      {successMessage &&
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-lg">
          <Check className="w-5 h-5" />
          <span>{successMessage}</span>
        </div>
      }

      {/* Error Message */}
      {formErrors.general &&
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-lg">
          <AlertTriangle className="w-5 h-5" />
          <span>{formErrors.general}</span>
        </div>
      }

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Class & Section Master
          </h1>
          <p className="text-sm text-gray-500">
            Manage classes, sections, and class teachers
          </p>
        </div>
        <Button onClick={handleOpenAddModal}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Section
        </Button>
      </div>

      {/* Main Content */}
      <Card>
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <Input
              leftIcon={<Search className="w-4 h-4" />}
              placeholder="Search by class, section, teacher, or room..."
              value={searchQuery}
              onChange={handleSearchChange} />

          </div>
          <Select
            placeholder="Filter by Class"
            value={classFilter}
            options={classFilterOptions}
            onChange={handleClassFilterChange} />

          <Select
            placeholder="Filter by Status"
            value={statusFilter}
            options={[
            { value: 'all', label: 'All Status' },
            { value: 'Active', label: 'Active' },
            { value: 'Inactive', label: 'Inactive' }]
            }
            onChange={handleStatusFilterChange} />

          {(searchQuery || classFilter !== 'all' || statusFilter !== 'all') &&
          <Button variant="outline" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          }
        </div>

        {/* Bulk Actions */}
        {filteredData.length > 0 &&
        <div className="flex gap-2 mb-4">
            <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkStatusUpdate('Active')}>

              Mark All as Active
            </Button>
            <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkStatusUpdate('Inactive')}>

              Mark All as Inactive
            </Button>
          </div>
        }

        {/* Results Count */}
        <div className="text-sm text-gray-500 mb-4">
          Showing {filteredData.length} of {classSections.length} sections
        </div>

        {/* Table */}
        <Table columns={columns} data={filteredData} />

        {/* Empty State */}
        {filteredData.length === 0 &&
        <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {classSections.length === 0 ?
            'No class sections have been added yet.' :
            'No sections found matching your search criteria.'}
            </p>
            {classSections.length === 0 ?
          <Button onClick={handleOpenAddModal}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Section
              </Button> :

          <Button variant="outline" onClick={handleClearFilters}>
                Clear Filters
              </Button>
          }
          </div>
        }
      </Card>

      {/* Add Modal */}
      {activeModal === 'add' &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Add New Section</h2>
              <button
              onClick={handleCloseModal}
              className="text-gray-400 hover:text-gray-600">

                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <SectionForm />
            </div>
            <div className="flex justify-end gap-3 p-6 border-t">
              <Button variant="outline" onClick={handleCloseModal} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleAddSection} disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Section'}
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Edit Modal */}
      {activeModal === 'edit' &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Edit Section</h2>
              <button
              onClick={handleCloseModal}
              className="text-gray-400 hover:text-gray-600">

                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <SectionForm />
            </div>
            <div className="flex justify-end gap-3 p-6 border-t">
              <Button variant="outline" onClick={handleCloseModal} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleUpdateSection} disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Section'}
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Delete Confirmation Modal */}
      {activeModal === 'delete' && selectedSection &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Confirm Delete</h2>
              <button
              onClick={handleCloseModal}
              className="text-gray-400 hover:text-gray-600">

                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-gray-700">
                    Are you sure you want to delete{' '}
                    <strong>{selectedSection.class} - Section {selectedSection.section}</strong>?
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    This action cannot be undone. All associated data including student assignments will be permanently removed.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t">
              <Button variant="outline" onClick={handleCloseModal} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
              variant="destructive"
              onClick={handleDeleteSection}
              disabled={isSubmitting}>

                {isSubmitting ? 'Deleting...' : 'Delete Section'}
              </Button>
            </div>
          </div>
        </div>
      }

      {/* View Details Modal */}
      {activeModal === 'view' && selectedSection &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Section Details</h2>
              <button
              onClick={handleCloseModal}
              className="text-gray-400 hover:text-gray-600">

                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <ViewDetails />
            </div>
            <div className="flex justify-end gap-3 p-6 border-t">
              <Button variant="outline" onClick={handleCloseModal}>
                Close
              </Button>
              <Button onClick={() => {
              handleCloseModal();
              handleOpenEditModal(selectedSection);
            }}>
                Edit Section
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}

export default ClassSectionMaster;