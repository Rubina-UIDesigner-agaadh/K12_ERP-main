import React, { useState, Component } from 'react';
import {
  Trophy,
  Medal,
  Award,
  Search,
  Filter,
  Plus,
  Download,
  Star,
  Calendar,
  User,
  BookOpen,
  Activity,
  Users,
  Heart,
  FileText,
  Clock,
  Edit,
  Trash2,
  Eye,
  Upload,
  ChevronDown,
  ChevronUp,
  FileDown,
  AlertCircle } from
'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Modal } from '../../../components/ui/Modal';
import { Tabs } from '../../../components/ui/Tabs';
// --- Types ---
interface Student {
  id: string;
  grNo: string;
  suId: string;
  name: string;
  class: string;
  division: string;
  department: string;
  photo?: string;
}
interface Achievement {
  id: string;
  studentId: string;
  academicYear: string;
  category:
  'Academic' |
  'Sports' |
  'Cultural' |
  'Arts' |
  'Leadership' |
  'Community Service' |
  'Other';
  title: string;
  eventName: string;
  eventType: string;
  level:
  'School' |
  'Inter-School' |
  'District' |
  'State' |
  'National' |
  'International';
  position: string;
  date: string;
  enteredBy: string;
  points?: number;
  description?: string;
  organizer?: string;
  location?: string;
  hasDocument?: boolean;
}
// --- Mock Data ---
const MOCK_STUDENTS: Student[] = [
{
  id: '1',
  grNo: 'GR-1001',
  suId: 'SU-2023-001',
  name: 'Aarav Patel',
  class: '10',
  division: 'A',
  department: 'Secondary'
},
{
  id: '2',
  grNo: 'GR-1002',
  suId: 'SU-2023-002',
  name: 'Zara Khan',
  class: '9',
  division: 'B',
  department: 'Secondary'
},
{
  id: '3',
  grNo: 'GR-1003',
  suId: 'SU-2023-003',
  name: 'Rohan Verma',
  class: '11',
  division: 'A',
  department: 'Science'
}];

const MOCK_ACHIEVEMENTS: Achievement[] = [
{
  id: 'ACH-001',
  studentId: '1',
  academicYear: '2023-24',
  category: 'Academic',
  title: 'National Science Olympiad',
  eventName: 'NSO 2023',
  eventType: 'Olympiad',
  level: 'National',
  position: 'Gold Medal',
  date: '2023-11-15',
  enteredBy: 'Admin User',
  points: 50,
  organizer: 'SOF',
  hasDocument: true
},
{
  id: 'ACH-002',
  studentId: '1',
  academicYear: '2023-24',
  category: 'Sports',
  title: 'Inter-School Football Tournament',
  eventName: 'City Cup',
  eventType: 'Tournament',
  level: 'Inter-School',
  position: 'Winner',
  date: '2023-12-10',
  enteredBy: 'Coach Sharma',
  points: 30,
  hasDocument: false
},
{
  id: 'ACH-003',
  studentId: '2',
  academicYear: '2023-24',
  category: 'Cultural',
  title: 'Classical Dance Competition',
  eventName: 'State Arts Fest',
  eventType: 'Competition',
  level: 'State',
  position: 'Runner Up',
  date: '2024-01-20',
  enteredBy: 'Mrs. Iyer',
  points: 40,
  hasDocument: true
}];

// --- Components ---
export function StudentAchievements() {
  // --- State ---
  const [showResults, setShowResults] = useState(false);
  const [filters, setFilters] = useState({
    grNo: '',
    suId: '',
    name: '',
    class: '',
    division: '',
    department: '',
    academicYear: '',
    status: ''
  });
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  // Add Achievement Form State
  const [newAchievement, setNewAchievement] = useState<Partial<Achievement>>({
    academicYear: '2024-25',
    category: 'Academic',
    level: 'School'
  });
  const [selectedStudentForAdd, setSelectedStudentForAdd] =
  useState<Student | null>(null);
  // Expand/Collapse state for student panels
  const [expandedStudentIds, setExpandedStudentIds] = useState<string[]>([]);
  // --- Handlers ---
  const handleSearch = () => {
    // Basic validation: ensure at least one criteria is present
    const hasCriteria = Object.values(filters).some((val) => val.trim() !== '');
    if (!hasCriteria) {
      alert(
        'Enter at least one search criterion (student ID, name, class, etc.) to view achievements.'
      );
      return;
    }
    setShowResults(true);
    // In real app, fetch data here based on filters
  };
  const toggleStudentExpand = (id: string) => {
    if (expandedStudentIds.includes(id)) {
      setExpandedStudentIds(expandedStudentIds.filter((sid) => sid !== id));
    } else {
      setExpandedStudentIds([...expandedStudentIds, id]);
    }
  };
  const handleAddAchievementClick = (student?: Student) => {
    if (student) {
      setSelectedStudentForAdd(student);
      setNewAchievement({
        ...newAchievement
        // Pre-fill student context if needed or just use ID
      });
    } else {
      setSelectedStudentForAdd(null); // Global add mode
    }
    setIsAddModalOpen(true);
  };
  const handleSaveAchievement = () => {
    // Validation Logic
    if (!selectedStudentForAdd && !newAchievement.studentId) {
      alert('Please select a student.');
      return;
    }
    // ... validate other required fields
    alert('Achievement added successfully.');
    setIsAddModalOpen(false);
    // In real app, refresh list
  };
  // --- Helpers ---
  const getStudentAchievements = (studentId: string) => {
    return MOCK_ACHIEVEMENTS.filter((a) => a.studentId === studentId).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };
  const LevelBadge = ({ level }: {level: string;}) => {
    const colors: Record<string, any> = {
      School: 'secondary',
      'Inter-School': 'info',
      District: 'warning',
      State: 'primary',
      National: 'danger',
      International: 'success'
    };
    return <Badge variant={colors[level] || 'secondary'}>{level}</Badge>;
  };
  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      {/* --- Header (Fixed) --- */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-white border-b sticky top-0 z-20 shadow-sm gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Student Achievements
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track academic, co-curricular, and leadership achievements.
          </p>
        </div>
        <div className="flex gap-2">
          {showResults &&
          <Button
            variant="outline"
            leftIcon={<FileDown className="w-4 h-4" />}
            onClick={() => setIsExportModalOpen(true)}>

              Export
            </Button>
          }
          <Button
            variant="outline"
            leftIcon={<Upload className="w-4 h-4" />}
            onClick={() => setIsImportModalOpen(true)}>

            Import
          </Button>
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => handleAddAchievementClick()}>

            Add Achievement
          </Button>
        </div>
      </div>

      {/* --- Scrollable Content --- */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Search Panel */}
        <Card className="p-4">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Search className="w-4 h-4" /> Find Students
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="GR No / Admission No"
              placeholder="Search..."
              value={filters.grNo}
              onChange={(e) =>
              setFilters({
                ...filters,
                grNo: e.target.value
              })
              } />

            <Input
              label="SU ID / Unique ID"
              placeholder="Search..."
              value={filters.suId}
              onChange={(e) =>
              setFilters({
                ...filters,
                suId: e.target.value
              })
              } />

            <Input
              label="Student Name"
              placeholder="Partial match..."
              value={filters.name}
              onChange={(e) =>
              setFilters({
                ...filters,
                name: e.target.value
              })
              } />

            <Select
              label="Class"
              options={[
              {
                value: '',
                label: 'Select Class'
              },
              {
                value: '9',
                label: 'Class 9'
              },
              {
                value: '10',
                label: 'Class 10'
              },
              {
                value: '11',
                label: 'Class 11'
              }]
              }
              value={filters.class}
              onChange={(val) =>
              setFilters({
                ...filters,
                class: val
              })
              } />

            <Select
              label="Division"
              options={[
              {
                value: '',
                label: 'All Divisions'
              },
              {
                value: 'A',
                label: 'A'
              },
              {
                value: 'B',
                label: 'B'
              }]
              }
              value={filters.division}
              onChange={(val) =>
              setFilters({
                ...filters,
                division: val
              })
              } />

            <Select
              label="Department"
              options={[
              {
                value: '',
                label: 'All Departments'
              },
              {
                value: 'Secondary',
                label: 'Secondary'
              },
              {
                value: 'Science',
                label: 'Science'
              }]
              }
              value={filters.department}
              onChange={(val) =>
              setFilters({
                ...filters,
                department: val
              })
              } />

            <Select
              label="Academic Year"
              options={[
              {
                value: '',
                label: 'All Years'
              },
              {
                value: '2023-24',
                label: '2023-2024'
              },
              {
                value: '2024-25',
                label: '2024-2025'
              }]
              }
              value={filters.academicYear}
              onChange={(val) =>
              setFilters({
                ...filters,
                academicYear: val
              })
              } />

            <Select
              label="Student Status"
              options={[
              {
                value: '',
                label: 'All Status'
              },
              {
                value: 'active',
                label: 'Active'
              },
              {
                value: 'alumni',
                label: 'Alumni'
              }]
              }
              value={filters.status}
              onChange={(val) =>
              setFilters({
                ...filters,
                status: val
              })
              } />

          </div>
          <div className="flex justify-end mt-4">
            <Button
              variant="primary"
              leftIcon={<Search className="w-4 h-4" />}
              onClick={handleSearch}>

              Find Student
            </Button>
          </div>
        </Card>

        {/* Results Area */}
        {showResults &&
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                Student Achievement List
              </h3>
              <span className="text-sm text-gray-500">
                Showing {MOCK_STUDENTS.length} students
              </span>
            </div>

            {MOCK_STUDENTS.length === 0 ?
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-500">
                  No students found for the selected criteria.
                </p>
              </div> :

          <div className="space-y-4">
                {MOCK_STUDENTS.map((student) => {
              const achievements = getStudentAchievements(student.id);
              const isExpanded = expandedStudentIds.includes(student.id);
              // Summary counts
              const total = achievements.length;
              const academicCount = achievements.filter(
                (a) => a.category === 'Academic'
              ).length;
              const sportsCount = achievements.filter(
                (a) => a.category === 'Sports'
              ).length;
              const culturalCount = achievements.filter(
                (a) => a.category === 'Cultural'
              ).length;
              return (
                <div
                  key={student.id}
                  className="border rounded-lg bg-white shadow-sm overflow-hidden">

                      {/* Student Header */}
                      <div
                    className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleStudentExpand(student.id)}>

                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg hover:text-blue-600">
                              {student.name}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span>
                                {student.class}-{student.division}
                              </span>
                              <span>•</span>
                              <span>{student.grNo}</span>
                              <span>•</span>
                              <span>{student.department}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex gap-2">
                            <Badge variant="secondary">Total: {total}</Badge>
                            <Badge variant="outline" className="text-xs">
                              Acad: {academicCount}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Sports: {sportsCount}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Cult: {culturalCount}
                            </Badge>
                          </div>
                          <Button
                        size="sm"
                        variant="ghost"
                        leftIcon={<Plus className="w-4 h-4" />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddAchievementClick(student);
                        }}>

                            Add
                          </Button>
                          {isExpanded ?
                      <ChevronUp className="w-5 h-5 text-gray-400" /> :

                      <ChevronDown className="w-5 h-5 text-gray-400" />
                      }
                        </div>
                      </div>

                      {/* Achievements List (Body) */}
                      {isExpanded &&
                  <div className="border-t bg-gray-50/50 p-4">
                          {achievements.length > 0 ?
                    <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="px-3 py-2 text-left font-medium text-gray-600">
                                      Title
                                    </th>
                                    <th className="px-3 py-2 text-left font-medium text-gray-600">
                                      Category
                                    </th>
                                    <th className="px-3 py-2 text-left font-medium text-gray-600">
                                      Event/Activity
                                    </th>
                                    <th className="px-3 py-2 text-left font-medium text-gray-600">
                                      Level
                                    </th>
                                    <th className="px-3 py-2 text-left font-medium text-gray-600">
                                      Position
                                    </th>
                                    <th className="px-3 py-2 text-left font-medium text-gray-600">
                                      Date
                                    </th>
                                    <th className="px-3 py-2 text-left font-medium text-gray-600">
                                      Entered By
                                    </th>
                                    <th className="px-3 py-2 text-center font-medium text-gray-600">
                                      Doc
                                    </th>
                                    <th className="px-3 py-2 text-center font-medium text-gray-600">
                                      Actions
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                  {achievements.map((ach) =>
                          <tr key={ach.id}>
                                      <td className="px-3 py-2 font-medium">
                                        {ach.title}
                                      </td>
                                      <td className="px-3 py-2">
                                        {ach.category}
                                      </td>
                                      <td className="px-3 py-2">
                                        <div>{ach.eventName}</div>
                                        <div className="text-xs text-gray-500">
                                          {ach.eventType}
                                        </div>
                                      </td>
                                      <td className="px-3 py-2">
                                        <LevelBadge level={ach.level} />
                                      </td>
                                      <td className="px-3 py-2 font-medium text-blue-600">
                                        {ach.position}
                                      </td>
                                      <td className="px-3 py-2 text-gray-500">
                                        {ach.date}
                                      </td>
                                      <td className="px-3 py-2 text-gray-500 text-xs">
                                        {ach.enteredBy}
                                      </td>
                                      <td className="px-3 py-2 text-center">
                                        {ach.hasDocument ?
                              <FileText className="w-4 h-4 text-blue-500 mx-auto cursor-pointer" /> :

                              <span className="text-gray-300">
                                            -
                                          </span>
                              }
                                      </td>
                                      <td className="px-3 py-2 text-center">
                                        <div className="flex justify-center gap-1">
                                          <Button
                                  size="xs"
                                  variant="ghost"
                                  className="h-6 w-6 p-0">

                                            <Edit className="w-3 h-3 text-gray-600" />
                                          </Button>
                                          <Button
                                  size="xs"
                                  variant="ghost"
                                  className="h-6 w-6 p-0">

                                            <Trash2 className="w-3 h-3 text-red-500" />
                                          </Button>
                                        </div>
                                      </td>
                                    </tr>
                          )}
                                </tbody>
                              </table>
                            </div> :

                    <div className="text-center py-6 text-gray-500 italic">
                              No achievements recorded yet.
                              <Button
                        variant="link"
                        size="sm"
                        onClick={() =>
                        handleAddAchievementClick(student)
                        }>

                                Add Achievement
                              </Button>
                            </div>
                    }
                        </div>
                  }
                    </div>);

            })}
              </div>
          }
          </div>
        }
      </div>

      {/* --- Add Achievement Modal --- */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Achievement"
        size="lg"
        footer={
        <div className="flex justify-end gap-2 w-full">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveAchievement}>
              Save Achievement
            </Button>
          </div>
        }>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {/* Section 1: Student Details */}
          <div className="p-4 bg-gray-50 rounded border">
            <h4 className="text-sm font-bold text-gray-700 mb-3 border-b pb-1">
              Student Details
            </h4>
            {selectedStudentForAdd ?
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 text-xs block">
                    Student Name
                  </span>
                  <span className="font-medium">
                    {selectedStudentForAdd.name}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 text-xs block">GR No</span>
                  <span className="font-medium">
                    {selectedStudentForAdd.grNo}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 text-xs block">Class</span>
                  <span className="font-medium">
                    {selectedStudentForAdd.class}-
                    {selectedStudentForAdd.division}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 text-xs block">
                    Academic Year
                  </span>
                  <span className="font-medium">
                    {newAchievement.academicYear}
                  </span>
                </div>
              </div> :

            <div className="space-y-3">
                <p className="text-xs text-blue-600 mb-2">
                  Search and select a student to add achievement.
                </p>
                <Input placeholder="Search Student by Name or ID..." />
                {/* In real implementation, this would be an autocomplete/select */}
              </div>
            }
          </div>

          {/* Section 2: Achievement Details */}
          <div>
            <h4 className="text-sm font-bold text-gray-700 mb-3 border-b pb-1">
              Achievement Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Achievement Title *"
                  placeholder="e.g. National Science Olympiad Gold"
                  required
                  value={newAchievement.title}
                  onChange={(e) =>
                  setNewAchievement({
                    ...newAchievement,
                    title: e.target.value
                  })
                  } />

              </div>
              <Select
                label="Category *"
                options={[
                {
                  value: 'Academic',
                  label: 'Academic'
                },
                {
                  value: 'Sports',
                  label: 'Sports'
                },
                {
                  value: 'Cultural',
                  label: 'Cultural'
                },
                {
                  value: 'Arts',
                  label: 'Arts'
                },
                {
                  value: 'Leadership',
                  label: 'Leadership'
                },
                {
                  value: 'Community Service',
                  label: 'Community Service'
                },
                {
                  value: 'Other',
                  label: 'Other'
                }]
                }
                value={newAchievement.category}
                onChange={(val) =>
                setNewAchievement({
                  ...newAchievement,
                  category: val as any
                })
                } />

              <Input
                label="Achievement Date *"
                type="date"
                required
                value={newAchievement.date}
                onChange={(e) =>
                setNewAchievement({
                  ...newAchievement,
                  date: e.target.value
                })
                } />

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description / Notes
                </label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  rows={2}
                  value={newAchievement.description}
                  onChange={(e) =>
                  setNewAchievement({
                    ...newAchievement,
                    description: e.target.value
                  })
                  } />

              </div>
              <Select
                label="Result / Position"
                options={[
                {
                  value: 'Winner',
                  label: 'Winner'
                },
                {
                  value: 'Runner-up',
                  label: 'Runner-up'
                },
                {
                  value: '1st',
                  label: '1st Place'
                },
                {
                  value: '2nd',
                  label: '2nd Place'
                },
                {
                  value: '3rd',
                  label: '3rd Place'
                },
                {
                  value: 'Participation',
                  label: 'Participation'
                },
                {
                  value: 'Merit',
                  label: 'Merit'
                }]
                }
                value={newAchievement.position}
                onChange={(val) =>
                setNewAchievement({
                  ...newAchievement,
                  position: val
                })
                } />

              <Input
                label="Points / Credits"
                type="number"
                value={newAchievement.points}
                onChange={(e) =>
                setNewAchievement({
                  ...newAchievement,
                  points: parseInt(e.target.value)
                })
                } />

              <div className="md:col-span-2 pt-2">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" className="rounded text-blue-600" />
                  Is Group / Team Achievement?
                </label>
              </div>
            </div>
          </div>

          {/* Section 3: Event Details */}
          <div>
            <h4 className="text-sm font-bold text-gray-700 mb-3 border-b pb-1">
              Event / Extra-Curricular Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Event / Activity Name"
                placeholder="e.g. Annual Sports Meet"
                value={newAchievement.eventName}
                onChange={(e) =>
                setNewAchievement({
                  ...newAchievement,
                  eventName: e.target.value
                })
                } />

              <Select
                label="Event Type"
                options={[
                {
                  value: 'Competition',
                  label: 'Competition'
                },
                {
                  value: 'Tournament',
                  label: 'Tournament'
                },
                {
                  value: 'Olympiad',
                  label: 'Olympiad'
                },
                {
                  value: 'Exhibition',
                  label: 'Exhibition'
                },
                {
                  value: 'Other',
                  label: 'Other'
                }]
                }
                value={newAchievement.eventType}
                onChange={(val) =>
                setNewAchievement({
                  ...newAchievement,
                  eventType: val
                })
                } />

              <Select
                label="Level"
                options={[
                {
                  value: 'School',
                  label: 'School'
                },
                {
                  value: 'Inter-School',
                  label: 'Inter-School'
                },
                {
                  value: 'District',
                  label: 'District'
                },
                {
                  value: 'State',
                  label: 'State'
                },
                {
                  value: 'National',
                  label: 'National'
                },
                {
                  value: 'International',
                  label: 'International'
                }]
                }
                value={newAchievement.level}
                onChange={(val) =>
                setNewAchievement({
                  ...newAchievement,
                  level: val as any
                })
                } />

              <Input
                label="Organising Body"
                placeholder="e.g. CBSE"
                value={newAchievement.organizer}
                onChange={(e) =>
                setNewAchievement({
                  ...newAchievement,
                  organizer: e.target.value
                })
                } />

              <div className="md:col-span-2">
                <Input
                  label="Location / Venue"
                  placeholder="e.g. City Stadium"
                  value={newAchievement.location}
                  onChange={(e) =>
                  setNewAchievement({
                    ...newAchievement,
                    location: e.target.value
                  })
                  } />

              </div>
            </div>
          </div>

          {/* Section 4: Documents */}
          <div>
            <h4 className="text-sm font-bold text-gray-700 mb-3 border-b pb-1">
              Documents
            </h4>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Certificate / Document
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <Upload className="w-4 h-4" />
                Choose File
                <input type="file" className="hidden" />
              </label>
              <span className="text-sm text-gray-500">No file chosen</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Accepted: PDF, JPG, PNG (Max 10MB)
            </p>
          </div>
        </div>
      </Modal>

      {/* --- Import Modal --- */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Achievements"
        size="md"
        footer={
        <div className="flex justify-end gap-2 w-full">
            <Button
            variant="outline"
            onClick={() => setIsImportModalOpen(false)}>

              Cancel
            </Button>
            <Button variant="primary" disabled>
              Import Achievements
            </Button>
          </div>
        }>

        <div className="space-y-6">
          <div className="bg-blue-50 p-3 rounded border border-blue-200 text-sm text-blue-800">
            <p className="font-semibold mb-1">Instructions:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Download the template.</li>
              <li>Fill in achievement details for multiple students.</li>
              <li>Upload the filled file back here.</li>
            </ul>
          </div>

          <div className="flex justify-between items-center p-3 border rounded bg-gray-50">
            <span className="text-sm font-medium text-gray-700">
              Achievement_Import_Template.xlsx
            </span>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}>

              Download Template
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Filled File
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <Upload className="w-4 h-4" />
                Choose File
                <input type="file" className="hidden" />
              </label>
              <span className="text-sm text-gray-500">No file chosen</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: .xlsx, .csv
            </p>
          </div>
        </div>
      </Modal>

      {/* --- Export Modal --- */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export Achievements"
        size="sm"
        footer={
        <div className="flex justify-end gap-2 w-full">
            <Button
            variant="outline"
            onClick={() => setIsExportModalOpen(false)}>

              Cancel
            </Button>
            <Button
            variant="primary"
            onClick={() => {
              alert('Export started');
              setIsExportModalOpen(false);
            }}>

              Export
            </Button>
          </div>
        }>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scope
            </label>
            <Select
              options={[
              {
                value: 'all',
                label: 'All students in current results (Default)'
              },
              {
                value: 'selected',
                label: 'Selected students only'
              }]
              }
              defaultValue="all" />

          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Format
            </label>
            <Select
              options={[
              {
                value: 'excel',
                label: 'Excel (.xlsx)'
              },
              {
                value: 'csv',
                label: 'CSV'
              },
              {
                value: 'pdf',
                label: 'PDF'
              }]
              }
              defaultValue="excel" />

          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Options
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded text-blue-600" />
                {' '}
                Include student details
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded text-blue-600" />
                {' '}
                Include achievement details
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded text-blue-600" />
                {' '}
                Include document links
              </label>
            </div>
          </div>
        </div>
      </Modal>
    </div>);

}