import React, { useMemo, useState } from 'react';
import {
  Link as LinkIcon,
  Search,
  Plus,
  Trash2,
  UserPlus,
  X,
  Users,
  AlertCircle } from
'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Table } from '../../../components/ui/Table';
import { Modal } from '../../../components/ui/Modal';
import { Select } from '../../../components/ui/Select';
// --- Types & Interfaces ---
interface Student {
  id: number;
  firstName: string;
  lastName: string;
  grNo: string;
  admissionNo: string;
  suId: string;
  penNo: string;
  department: string;
  class: string;
  section: string;
  rollNo: string;
  motherName: string;
  fatherName: string;
  motherContact: string;
  fatherContact: string;
  siblingGroupId: string | null; // If null, no siblings. If string, linked to that group.
}
interface FilterState {
  firstName: string;
  lastName: string;
  grNo: string;
  admissionNo: string;
  suId: string;
  penNo: string;
  department: string;
  contactNumber: string;
  class: string;
  section: string;
  rollNo: string;
  motherName: string;
  fatherName: string;
  motherContact: string;
  fatherContact: string;
}
// --- Mock Data ---
const INITIAL_STUDENTS: Student[] = [
{
  id: 1,
  firstName: 'Aarav',
  lastName: 'Patel',
  grNo: 'GR-001',
  admissionNo: 'ADM-101',
  suId: 'SU-001',
  penNo: 'PEN-111',
  department: 'Science',
  class: '10',
  section: 'A',
  rollNo: '12',
  motherName: 'Meera Patel',
  fatherName: 'Vikram Patel',
  motherContact: '9876543210',
  fatherContact: '9876543211',
  siblingGroupId: 'GRP-001'
},
{
  id: 2,
  firstName: 'Riya',
  lastName: 'Patel',
  grNo: 'GR-105',
  admissionNo: 'ADM-205',
  suId: 'SU-055',
  penNo: 'PEN-122',
  department: 'General',
  class: '6',
  section: 'B',
  rollNo: '05',
  motherName: 'Meera Patel',
  fatherName: 'Vikram Patel',
  motherContact: '9876543210',
  fatherContact: '9876543211',
  siblingGroupId: 'GRP-001'
},
{
  id: 3,
  firstName: 'Ananya',
  lastName: 'Das',
  grNo: 'GR-006',
  admissionNo: 'ADM-300',
  suId: 'SU-099',
  penNo: 'PEN-333',
  department: 'Arts',
  class: '8',
  section: 'A',
  rollNo: '20',
  motherName: 'Priya Das',
  fatherName: 'Sanjay Das',
  motherContact: '9123456789',
  fatherContact: '9988776655',
  siblingGroupId: null
},
{
  id: 4,
  firstName: 'Rahul',
  lastName: 'Das',
  grNo: 'GR-210',
  admissionNo: 'ADM-310',
  suId: 'SU-100',
  penNo: 'PEN-334',
  department: 'General',
  class: '4',
  section: 'C',
  rollNo: '11',
  motherName: 'Priya Das',
  fatherName: 'Sanjay Das',
  motherContact: '9123456789',
  fatherContact: '9988776655',
  siblingGroupId: null
},
{
  id: 5,
  firstName: 'Zara',
  lastName: 'Khan',
  grNo: 'GR-002',
  admissionNo: 'ADM-401',
  suId: 'SU-500',
  penNo: 'PEN-999',
  department: 'Commerce',
  class: '9',
  section: 'B',
  rollNo: '02',
  motherName: 'Aisha Khan',
  fatherName: 'Rehan Khan',
  motherContact: '8877665544',
  fatherContact: '7766554433',
  siblingGroupId: null
}];

const INITIAL_FILTERS: FilterState = {
  firstName: '',
  lastName: '',
  grNo: '',
  admissionNo: '',
  suId: '',
  penNo: '',
  department: '',
  contactNumber: '',
  class: '',
  section: '',
  rollNo: '',
  motherName: '',
  fatherName: '',
  motherContact: '',
  fatherContact: ''
};
export function StudentSiblingPage() {
  // --- State ---
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [showResults, setShowResults] = useState(false);
  // Selection state for Main Table
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  // Modal State
  const [viewingSiblingGroup, setViewingSiblingGroup] =
  useState<Student | null>(null);
  const [selectedSiblingsInModal, setSelectedSiblingsInModal] = useState<
    number[]>(
    []);
  // Context Mode State (for "Add Sibling" flow)
  const [addSiblingContext, setAddSiblingContext] = useState<Student | null>(
    null
  );
  // --- Handlers ---
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  };
  const handleSearch = () => {
    // In a real app, this would trigger an API call.
    // For now, we reveal the table.
    setShowResults(true);
  };
  const handleReset = () => {
    setFilters(INITIAL_FILTERS);
    setShowResults(false);
    setSelectedStudentIds([]);
    setAddSiblingContext(null);
  };
  // --- Filtering Logic (Mock) ---
  const filteredStudents = useMemo(() => {
    if (!showResults) return [];
    return students.filter((student) => {
      // Basic partial match for demonstration
      const match = (val: string, filterVal: string) =>
      val.toLowerCase().includes(filterVal.toLowerCase());
      return (
        match(student.firstName, filters.firstName) &&
        match(student.lastName, filters.lastName) &&
        match(student.grNo, filters.grNo) &&
        match(student.admissionNo, filters.admissionNo) &&
        match(student.suId, filters.suId) &&
        match(student.penNo, filters.penNo) && (
        filters.department === '' ||
        student.department === filters.department) && (
        filters.class === '' || student.class === filters.class) && (
        filters.section === '' || student.section === filters.section) &&
        match(student.rollNo, filters.rollNo) &&
        match(student.motherName, filters.motherName) &&
        match(student.fatherName, filters.fatherName) &&
        match(student.motherContact, filters.motherContact) &&
        match(student.fatherContact, filters.fatherContact) && (
        filters.contactNumber === '' ||
        student.motherContact.includes(filters.contactNumber) ||
        student.fatherContact.includes(filters.contactNumber)));

    });
  }, [students, filters, showResults]);
  // --- Main Table Logic ---
  const toggleStudentSelection = (id: number) => {
    if (selectedStudentIds.includes(id)) {
      setSelectedStudentIds(selectedStudentIds.filter((sid) => sid !== id));
    } else {
      setSelectedStudentIds([...selectedStudentIds, id]);
    }
  };
  // Action: Top Button "Link Siblings" / "Add Sibling"
  const handleTopAction = () => {
    if (addSiblingContext) {
      // Logic for "Add Sibling" Context
      // We are adding selectedStudentIds to the addSiblingContext's group
      const targetGroupId =
      addSiblingContext.siblingGroupId ||
      `GRP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const updatedStudents = students.map((s) => {
        // Update the context student if it didn't have a group yet
        if (s.id === addSiblingContext.id && !s.siblingGroupId) {
          return {
            ...s,
            siblingGroupId: targetGroupId
          };
        }
        // Update newly selected students
        if (selectedStudentIds.includes(s.id)) {
          return {
            ...s,
            siblingGroupId: targetGroupId
          };
        }
        return s;
      });
      setStudents(updatedStudents);
      setAddSiblingContext(null); // Exit context mode
      setSelectedStudentIds([]);
      alert('Sibling added successfully.');
    } else {
      // Logic for "Link Siblings" (Create new group)
      if (selectedStudentIds.length < 2) return;
      const newGroupId = `GRP-${Date.now()}`;
      const updatedStudents = students.map((s) => {
        if (selectedStudentIds.includes(s.id)) {
          return {
            ...s,
            siblingGroupId: newGroupId
          };
        }
        return s;
      });
      setStudents(updatedStudents);
      setSelectedStudentIds([]);
      alert('Selected students linked as siblings.');
    }
  };
  // Action: Row Button "View / Link"
  const handleViewSiblings = (student: Student) => {
    setViewingSiblingGroup(student);
    setSelectedSiblingsInModal([]); // Reset modal selection
  };
  // --- Modal Logic ---
  // Get all students in the currently viewed group
  const siblingsInGroup = useMemo(() => {
    if (!viewingSiblingGroup) return [];
    if (!viewingSiblingGroup.siblingGroupId) return [viewingSiblingGroup]; // Just show self if no group yet
    return students.filter(
      (s) => s.siblingGroupId === viewingSiblingGroup.siblingGroupId
    );
  }, [students, viewingSiblingGroup]);
  const toggleModalSelection = (id: number) => {
    if (selectedSiblingsInModal.includes(id)) {
      setSelectedSiblingsInModal(
        selectedSiblingsInModal.filter((sid) => sid !== id)
      );
    } else {
      setSelectedSiblingsInModal([...selectedSiblingsInModal, id]);
    }
  };
  const handleUnlink = () => {
    if (!viewingSiblingGroup) return;
    if (
    !confirm(
      'Are you sure you want to unlink the selected students from this group?'
    ))

    return;
    const updatedStudents = students.map((s) => {
      if (selectedSiblingsInModal.includes(s.id)) {
        return {
          ...s,
          siblingGroupId: null
        };
      }
      return s;
    });
    // If only 1 student remains in that group ID, unlink them too (cleanup)
    const remainingGroupMembers = updatedStudents.filter(
      (s) =>
      s.siblingGroupId === viewingSiblingGroup.siblingGroupId &&
      s.siblingGroupId !== null
    );
    if (remainingGroupMembers.length === 1) {
      const loneStudentId = remainingGroupMembers[0].id;
      const finalCleanup = updatedStudents.map((s) =>
      s.id === loneStudentId ?
      {
        ...s,
        siblingGroupId: null
      } :
      s
      );
      setStudents(finalCleanup);
    } else {
      setStudents(updatedStudents);
    }
    setViewingSiblingGroup(null); // Close modal
    alert('Students unlinked.');
  };
  const handleAddSiblingStart = () => {
    if (!viewingSiblingGroup) return;
    setAddSiblingContext(viewingSiblingGroup);
    setViewingSiblingGroup(null); // Close modal
    setShowResults(false); // Optionally clear results to force new search, or keep them
    setFilters(INITIAL_FILTERS); // Reset filters to help find new person
    setSelectedStudentIds([]); // Clear main table selection
  };
  // --- Derived UI State ---
  const isLinkButtonDisabled = addSiblingContext ?
  selectedStudentIds.length === 0 // Adding sibling: need at least 1 new selection
  : selectedStudentIds.length < 2; // Creating group: need at least 2 selections
  const topButtonLabel = addSiblingContext ? 'Add Sibling' : 'Link Siblings';
  const topButtonIcon = addSiblingContext ?
  <UserPlus className="w-4 h-4" /> :

  <LinkIcon className="w-4 h-4" />;

  // --- Columns Configuration ---
  const mainTableColumns = [
  {
    key: 'select',
    header: 'Select',
    render: (row: Student) =>
    <input
      type="checkbox"
      className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
      checked={selectedStudentIds.includes(row.id)}
      onChange={() => toggleStudentSelection(row.id)} />


  },
  {
    key: 'name',
    header: 'Student Name',
    render: (row: Student) =>
    <span className="font-medium text-gray-900">
          {row.firstName} {row.lastName}
        </span>

  },
  {
    key: 'grNo',
    header: 'GR No'
  },
  {
    key: 'admissionNo',
    header: 'Adm No'
  },
  {
    key: 'suId',
    header: 'SU ID'
  },
  {
    key: 'penNo',
    header: 'PEN No'
  },
  {
    key: 'department',
    header: 'Dept'
  },
  {
    key: 'class',
    header: 'Class'
  },
  {
    key: 'section',
    header: 'Sec'
  },
  {
    key: 'rollNo',
    header: 'Roll'
  },
  {
    key: 'siblingInfo',
    header: 'Sibling Info',
    render: (row: Student) => {
      if (!row.siblingGroupId) {
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
              No siblings linked
            </span>);

      }
      // Count how many in this group
      const count = students.filter(
        (s) => s.siblingGroupId === row.siblingGroupId
      ).length;
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
            {count - 1} Sibling(s) linked
          </span>);

    }
  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: Student) => {
      const hasSiblings = !!row.siblingGroupId;
      return (
        <Button
          variant="ghost"
          size="xs"
          className="text-blue-600 hover:text-blue-800"
          onClick={() => handleViewSiblings(row)}>

            {hasSiblings ? 'View Siblings' : 'Link Siblings'}
          </Button>);

    }
  }];

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Student Sibling
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Search and manage sibling relationships.
            </p>
          </div>
          <Button
            variant="primary"
            leftIcon={topButtonIcon}
            disabled={isLinkButtonDisabled}
            onClick={handleTopAction}>

            {topButtonLabel}
          </Button>
        </div>

        {/* Add Sibling Context Banner */}
        {addSiblingContext &&
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-yellow-800">
                Adding sibling for: {addSiblingContext.firstName}{' '}
                {addSiblingContext.lastName} ({addSiblingContext.grNo})
              </h4>
              <p className="text-sm text-yellow-700 mt-1">
                Please search for the sibling below, select them using the
                checkbox, and click "Add Sibling" at the top right.
              </p>
            </div>
            <Button
            variant="ghost"
            size="sm"
            className="text-yellow-800 hover:bg-yellow-100"
            onClick={() => {
              setAddSiblingContext(null);
              setSelectedStudentIds([]);
            }}>

              Cancel
            </Button>
          </div>
        }
      </div>

      {/* Search Filters Panel */}
      <Card className="p-4">
        <h3 className="text-md font-semibold text-gray-800 mb-4 border-b pb-2">
          Search Filters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            label="First Name"
            placeholder="Search..."
            value={filters.firstName}
            onChange={(e) => handleFilterChange('firstName', e.target.value)} />

          <Input
            label="Last Name"
            placeholder="Search..."
            value={filters.lastName}
            onChange={(e) => handleFilterChange('lastName', e.target.value)} />

          <Input
            label="GR Number"
            placeholder="Search..."
            value={filters.grNo}
            onChange={(e) => handleFilterChange('grNo', e.target.value)} />

          <Input
            label="Admission Number"
            placeholder="Search..."
            value={filters.admissionNo}
            onChange={(e) => handleFilterChange('admissionNo', e.target.value)} />

          <Input
            label="SU ID"
            placeholder="Search..."
            value={filters.suId}
            onChange={(e) => handleFilterChange('suId', e.target.value)} />

          <Input
            label="PEN No"
            placeholder="Search..."
            value={filters.penNo}
            onChange={(e) => handleFilterChange('penNo', e.target.value)} />

          <Select
            label="Department"
            value={filters.department}
            onChange={(val) => handleFilterChange('department', val)}
            options={[
            {
              value: '',
              label: 'All Departments'
            },
            {
              value: 'Science',
              label: 'Science'
            },
            {
              value: 'Commerce',
              label: 'Commerce'
            },
            {
              value: 'Arts',
              label: 'Arts'
            },
            {
              value: 'General',
              label: 'General'
            }]
            } />

          <Input
            label="Contact Number"
            placeholder="Search..."
            value={filters.contactNumber}
            onChange={(e) =>
            handleFilterChange('contactNumber', e.target.value)
            } />

          <Select
            label="Class"
            value={filters.class}
            onChange={(val) => handleFilterChange('class', val)}
            options={[
            {
              value: '',
              label: 'All Classes'
            },
            {
              value: '10',
              label: 'Class 10'
            },
            {
              value: '9',
              label: 'Class 9'
            },
            {
              value: '8',
              label: 'Class 8'
            },
            {
              value: '6',
              label: 'Class 6'
            },
            {
              value: '4',
              label: 'Class 4'
            }]
            } />

          <Select
            label="Section"
            value={filters.section}
            onChange={(val) => handleFilterChange('section', val)}
            options={[
            {
              value: '',
              label: 'All Sections'
            },
            {
              value: 'A',
              label: 'A'
            },
            {
              value: 'B',
              label: 'B'
            },
            {
              value: 'C',
              label: 'C'
            }]
            } />

          <Input
            label="Roll Number"
            placeholder="Search..."
            value={filters.rollNo}
            onChange={(e) => handleFilterChange('rollNo', e.target.value)} />

          <Input
            label="Mother Name"
            placeholder="Search..."
            value={filters.motherName}
            onChange={(e) => handleFilterChange('motherName', e.target.value)} />

          <Input
            label="Father Name"
            placeholder="Search..."
            value={filters.fatherName}
            onChange={(e) => handleFilterChange('fatherName', e.target.value)} />

          <Input
            label="Mother Contact"
            placeholder="Search..."
            value={filters.motherContact}
            onChange={(e) =>
            handleFilterChange('motherContact', e.target.value)
            } />

          <Input
            label="Father Contact"
            placeholder="Search..."
            value={filters.fatherContact}
            onChange={(e) =>
            handleFilterChange('fatherContact', e.target.value)
            } />

        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button
            variant="primary"
            leftIcon={<Search className="w-4 h-4" />}
            onClick={handleSearch}>

            Search
          </Button>
        </div>
      </Card>

      {/* Results Table */}
      {showResults &&
      <Card
        noPadding
        title="Student List"
        className="flex-1 overflow-hidden flex flex-col">

          <div className="overflow-auto max-h-[600px]">
            <Table
            columns={mainTableColumns}
            data={filteredStudents}
            emptyMessage="No students found matching current filters." />

          </div>
          <div className="p-2 border-t text-xs text-gray-500 bg-gray-50">
            {filteredStudents.length} record(s) found.
          </div>
        </Card>
      }

      {/* Sibling Management Modal */}
      <Modal
        isOpen={!!viewingSiblingGroup}
        onClose={() => setViewingSiblingGroup(null)}
        title={
        viewingSiblingGroup ?
        `Siblings for ${viewingSiblingGroup.firstName} ${viewingSiblingGroup.lastName} (${viewingSiblingGroup.grNo})` :
        'Manage Siblings'
        }
        size="2xl"
        footer={
        <div className="flex justify-between w-full">
            <Button
            variant="danger"
            disabled={selectedSiblingsInModal.length === 0}
            onClick={handleUnlink}
            leftIcon={<Trash2 className="w-4 h-4" />}>

              Unlink Selected
            </Button>
            <div className="flex gap-2">
              <Button
              variant="outline"
              onClick={() => setViewingSiblingGroup(null)}>

                Close
              </Button>
              <Button
              variant="primary"
              onClick={handleAddSiblingStart}
              leftIcon={<Plus className="w-4 h-4" />}>

                Add Sibling
              </Button>
            </div>
          </div>
        }>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {/* Sibling List Table inside Modal */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-2">
              Current Group Members
            </h4>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                      Select
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      GR No
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Roll
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {siblingsInGroup.map((sib) =>
                  <tr key={sib.id}>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <input
                        type="checkbox"
                        className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                        checked={selectedSiblingsInModal.includes(sib.id)}
                        onChange={() => toggleModalSelection(sib.id)} />

                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        {sib.firstName} {sib.lastName}
                        {sib.id === viewingSiblingGroup?.id &&
                      <span className="ml-2 text-xs text-gray-400">
                            (Current)
                          </span>
                      }
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        {sib.grNo}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        {sib.class}-{sib.section}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        {sib.rollNo}
                      </td>
                    </tr>
                  )}
                  {siblingsInGroup.length === 0 &&
                  <tr>
                      <td
                      colSpan={5}
                      className="px-3 py-4 text-center text-sm text-gray-500 italic">

                        No siblings currently linked. Click "Add Sibling" to
                        start.
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>

          {/* Common Parents Section */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Parent Information (from current student)
            </h4>
            {viewingSiblingGroup &&
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 text-xs uppercase">Father Name</p>
                  <p className="font-medium">
                    {viewingSiblingGroup.fatherName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase">
                    Father Contact
                  </p>
                  <p className="font-medium">
                    {viewingSiblingGroup.fatherContact}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase">Mother Name</p>
                  <p className="font-medium">
                    {viewingSiblingGroup.motherName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase">
                    Mother Contact
                  </p>
                  <p className="font-medium">
                    {viewingSiblingGroup.motherContact}
                  </p>
                </div>
              </div>
            }
            <div className="mt-2 text-xs text-gray-400 italic">
              Note: If parents differ between siblings, verify manual records.
            </div>
          </div>
        </div>
      </Modal>
    </div>);

}
// Alias for PageRegistry compatibility
export { StudentSiblingPage as StudentSibling };