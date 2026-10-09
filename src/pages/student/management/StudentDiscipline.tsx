import React, { useState, Component } from 'react';
import {
  ShieldAlert,
  Gavel,
  Star,
  Search,
  Filter,
  Plus,
  FileText,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Phone,
  MessageSquare,
  Calendar,
  Eye,
  Edit,
  Save,
  X,
  Upload,
  Settings,
  Trash2,
  Lock,
  Megaphone } from
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
  name: string;
  class: string;
  division: string;
  department: string;
  status: string;
}
interface Incident {
  id: string;
  date: string;
  time: string;
  studentId: string;
  studentName: string;
  classDiv: string;
  type: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Draft' | 'Under Review' | 'Action Decided' | 'Closed';
  description: string;
  reportedBy: string;
  hasConsequences: boolean;
  isRepeatOffender: boolean;
  location: string;
  triggers: string;
  impact: string;
}
interface DisciplineActionConfig {
  id: string;
  name: string;
  code: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  notifyParents: boolean;
  affectsAttendance: boolean;
  defaultDuration?: number;
  active: boolean;
  description: string;
}
// --- Mock Data ---
const MOCK_STUDENTS: Student[] = [
{
  id: '1',
  grNo: 'GR-1001',
  name: 'Aarav Patel',
  class: '10',
  division: 'A',
  department: 'Secondary',
  status: 'Active'
},
{
  id: '2',
  grNo: 'GR-1002',
  name: 'Zara Khan',
  class: '9',
  division: 'B',
  department: 'Secondary',
  status: 'Active'
},
{
  id: '3',
  grNo: 'GR-1003',
  name: 'Rohan Verma',
  class: '11',
  division: 'A',
  department: 'Science',
  status: 'Active'
}];

const MOCK_INCIDENTS: Incident[] = [
{
  id: 'INC-2024-001',
  date: '2024-03-15',
  time: '10:30',
  studentId: '1',
  studentName: 'Aarav Patel',
  classDiv: '10-A',
  type: 'Academic Dishonesty',
  severity: 'High',
  status: 'Action Decided',
  description: 'Caught using cheat notes.',
  reportedBy: 'Mr. Sharma',
  hasConsequences: true,
  isRepeatOffender: false,
  location: 'Classroom',
  triggers: 'Exam pressure',
  impact: 'Unfair advantage'
},
{
  id: 'INC-2024-002',
  date: '2024-03-14',
  time: '14:15',
  studentId: '2',
  studentName: 'Zara Khan',
  classDiv: '9-B',
  type: 'Minor Disruption',
  severity: 'Low',
  status: 'Closed',
  description: 'Talking during lecture.',
  reportedBy: 'Mrs. Gupta',
  hasConsequences: true,
  isRepeatOffender: true,
  location: 'Classroom',
  triggers: 'Boredom',
  impact: 'Distracted others'
}];

const MOCK_ACTION_MASTER: DisciplineActionConfig[] = [
{
  id: 'ACT-001',
  name: 'Written Warning',
  code: 'WARN',
  severity: 'Low',
  notifyParents: true,
  affectsAttendance: false,
  active: true,
  description: 'Formal written warning log.'
},
{
  id: 'ACT-002',
  name: 'Parent Call',
  code: 'PCALL',
  severity: 'Medium',
  notifyParents: true,
  affectsAttendance: false,
  active: true,
  description: 'Call to parents to discuss behavior.'
},
{
  id: 'ACT-003',
  name: 'Suspension',
  code: 'SUSP',
  severity: 'High',
  notifyParents: true,
  affectsAttendance: true,
  defaultDuration: 3,
  active: true,
  description: 'Student barred from attending classes.'
},
{
  id: 'ACT-004',
  name: 'Rusticate',
  code: 'RUST',
  severity: 'Critical',
  notifyParents: true,
  affectsAttendance: true,
  active: true,
  description: 'Permanent removal from institution.'
}];

const REPEAT_OFFENDERS_DATA = [
{
  id: '2',
  name: 'Zara Khan',
  grNo: 'GR-1002',
  class: '9',
  div: 'B',
  incidentCount: 5,
  category: 'Disruption',
  status: 'On Probation'
},
{
  id: '3',
  name: 'Rohan Verma',
  grNo: 'GR-1003',
  class: '11',
  div: 'A',
  incidentCount: 3,
  category: 'Attendance',
  status: 'Counselling'
}];

export function StudentDiscipline() {
  // --- State ---
  const [activeTab, setActiveTab] = useState('report');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showStudentResults, setShowStudentResults] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    null
  );
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
  // Action Modals State
  const [isSuspensionModalOpen, setIsSuspensionModalOpen] = useState(false);
  const [isRusticationModalOpen, setIsRusticationModalOpen] = useState(false);
  const [selectedOffenderForAction, setSelectedOffenderForAction] =
  useState<any>(null);
  // Handlers
  const handleStudentSearch = () => {
    setShowStudentResults(true);
  };
  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowStudentResults(false);
  };
  const handleViewIncident = (incident: Incident) => {
    setSelectedIncident(incident);
    setIsIncidentModalOpen(true);
  };
  const handleOpenSuspension = (offender: any) => {
    setSelectedOffenderForAction(offender);
    setIsSuspensionModalOpen(true);
  };
  const handleOpenRustication = (offender: any) => {
    setSelectedOffenderForAction(offender);
    setIsRusticationModalOpen(true);
  };
  const handleConfirmRustication = () => {
    // Logic to move student to Deleted List and lock attendance would go here
    alert(
      `Student ${selectedOffenderForAction?.name} has been rusticated. Attendance locked. Moved to deleted list.`
    );
    setIsRusticationModalOpen(false);
  };
  const handleConfirmSuspension = () => {
    // Logic to apply suspension and lock attendance for duration would go here
    alert(
      `Student ${selectedOffenderForAction?.name} has been suspended. Attendance locked for specified duration.`
    );
    setIsSuspensionModalOpen(false);
  };
  const handleCallParents = (studentName: string) => {
    alert(`Parent Call action recorded for ${studentName}. Notification sent.`);
  };
  const handleWrittenWarning = (studentName: string) => {
    alert(
      `Written Warning recorded for ${studentName}. Added to discipline log.`
    );
  };
  // --- Tab Content Components ---
  const ReportIncidentPanel = () =>
  <div className="space-y-6">
      {/* 1. Find Student */}
      <Card title="1. Find Student" className="border-l-4 border-l-blue-500">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Input label="GR No / Admission No." placeholder="Search..." />
          <Input label="SU ID / Unique Student ID" placeholder="Search..." />
          <Input label="Student Name" placeholder="Partial match..." />
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
          }]
          } />

        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Select
          label="Division / Section"
          options={[
          {
            value: '',
            label: 'All'
          },
          {
            value: 'A',
            label: 'A'
          },
          {
            value: 'B',
            label: 'B'
          }]
          } />

          <Select
          label="Department"
          options={[
          {
            value: '',
            label: 'All'
          },
          {
            value: 'secondary',
            label: 'Secondary'
          }]
          } />

          <Select
          label="Academic Year"
          options={[
          {
            value: '',
            label: 'All'
          },
          {
            value: '2024-25',
            label: '2024-2025'
          }]
          } />

          <Select
          label="Student Status"
          options={[
          {
            value: '',
            label: 'All'
          },
          {
            value: 'active',
            label: 'Active'
          }]
          } />

        </div>
        <div className="flex justify-end">
          <Button
          variant="primary"
          leftIcon={<Search className="w-4 h-4" />}
          onClick={handleStudentSearch}>

            Search Student
          </Button>
        </div>

        {showStudentResults &&
      <div className="mt-4 border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    GR No
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Class
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {MOCK_STUDENTS.map((student) =>
            <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {student.grNo}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 font-medium">
                      {student.name}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500">
                      {student.class}-{student.division}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <Button
                  size="xs"
                  variant="outline"
                  onClick={() => handleSelectStudent(student)}>

                        Select
                      </Button>
                    </td>
                  </tr>
            )}
              </tbody>
            </table>
          </div>
      }
      </Card>

      {/* 2. Incident Details Form */}
      {selectedStudent &&
    <Card
      title="2. Incident Details"
      className="border-l-4 border-l-orange-500">

          {/* Header */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl">
              {selectedStudent.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-gray-900">
                {selectedStudent.name}
              </h3>
              <p className="text-sm text-gray-600">
                {selectedStudent.class}-{selectedStudent.division} •{' '}
                {selectedStudent.grNo} • {selectedStudent.department}
              </p>
            </div>
            <div className="ml-auto">
              <Button
            size="sm"
            variant="ghost"
            onClick={() => setSelectedStudent(null)}>

                Change Student
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Input label="Incident ID" value="INC-2024-NEW" disabled />
            <Input label="Date" type="date" />
            <Input label="Time" type="time" />

            <Select
          label="Incident Type"
          options={[
          {
            value: 'minor',
            label: 'Minor Disruption'
          },
          {
            value: 'disrespect',
            label: 'Disrespect / Insubordination'
          },
          {
            value: 'bullying',
            label: 'Bullying / Harassment'
          },
          {
            value: 'fight',
            label: 'Physical Fight / Violence'
          },
          {
            value: 'vandalism',
            label: 'Vandalism / Property Damage'
          },
          {
            value: 'academic',
            label: 'Academic Dishonesty'
          },
          {
            value: 'attendance',
            label: 'Attendance Related'
          },
          {
            value: 'tech',
            label: 'Technology Misuse'
          },
          {
            value: 'substance',
            label: 'Substance Related'
          },
          {
            value: 'other',
            label: 'Other'
          }]
          } />

            <Select
          label="Severity Level"
          options={[
          {
            value: 'low',
            label: 'Low'
          },
          {
            value: 'medium',
            label: 'Medium'
          },
          {
            value: 'high',
            label: 'High'
          },
          {
            value: 'critical',
            label: 'Critical'
          }]
          } />

            <Select
          label="Immediate Risk?"
          options={[
          {
            value: 'no',
            label: 'No'
          },
          {
            value: 'yes',
            label: 'Yes'
          }]
          } />


            <Select
          label="Location"
          options={[
          {
            value: 'classroom',
            label: 'Classroom'
          },
          {
            value: 'corridor',
            label: 'Corridor'
          },
          {
            value: 'playground',
            label: 'Playground'
          },
          {
            value: 'laboratory',
            label: 'Laboratory'
          },
          {
            value: 'bus',
            label: 'School Bus'
          },
          {
            value: 'online',
            label: 'Online Class'
          }]
          } />

            <Input label="Reporting Staff" value="Current User" disabled />
            <Input label="Witnesses" placeholder="Names of witnesses..." />
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Incident Description
              </label>
              <textarea
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            placeholder="Detailed narrative..." />

            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Triggers / Context
                </label>
                <textarea
              className="w-full p-2 border rounded-md"
              rows={3}
              placeholder="What led to the incident..." />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Impact
                </label>
                <textarea
              className="w-full p-2 border rounded-md"
              rows={3}
              placeholder="Impact on learning, peers, property..." />

              </div>
            </div>
          </div>

          <div className="border-t pt-6 flex justify-between items-center">
            <Button variant="outline" leftIcon={<Upload className="w-4 h-4" />}>
              Attach Evidence
            </Button>
            <div className="flex gap-2">
              <Button variant="outline">Save Draft</Button>
              <Button variant="primary" leftIcon={<Save className="w-4 h-4" />}>
                Submit Incident
              </Button>
            </div>
          </div>
        </Card>
    }
    </div>;

  const IncidentListPanel = () =>
  <div className="space-y-6">
      <Card noPadding>
        {/* Filters */}
        <div className="p-4 border-b bg-gray-50 flex flex-wrap gap-4 items-end">
          <div className="w-40">
            <Input label="Date From" type="date" />
          </div>
          <div className="w-40">
            <Input label="Date To" type="date" />
          </div>
          <div className="w-40">
            <Select
            label="Severity"
            options={[
            {
              value: 'all',
              label: 'All'
            },
            {
              value: 'low',
              label: 'Low'
            },
            {
              value: 'high',
              label: 'High'
            }]
            } />

          </div>
          <div className="w-40">
            <Select
            label="Status"
            options={[
            {
              value: 'all',
              label: 'All'
            },
            {
              value: 'open',
              label: 'Open'
            },
            {
              value: 'closed',
              label: 'Closed'
            }]
            } />

          </div>
          <div className="flex-1">
            <Input
            label="Search"
            placeholder="Student Name, GR, ID..."
            leftIcon={<Search className="w-4 h-4" />} />

          </div>
          <Button variant="secondary" leftIcon={<Filter className="w-4 h-4" />}>
            Apply Filters
          </Button>
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
            Export
          </Button>
        </div>

        {/* Table */}
        <Table
        columns={[
        {
          key: 'id',
          header: 'ID',
          render: (row: Incident) =>
          <span className="font-mono text-xs">{row.id}</span>

        },
        {
          key: 'date',
          header: 'Date & Time',
          render: (row: Incident) =>
          <div className="text-sm">
                  <div>{row.date}</div>
                  <div className="text-gray-500 text-xs">{row.time}</div>
                </div>

        },
        {
          key: 'student',
          header: 'Student',
          render: (row: Incident) =>
          <div>
                  <div className="font-medium">{row.studentName}</div>
                  <div className="text-xs text-gray-500">{row.classDiv}</div>
                </div>

        },
        {
          key: 'type',
          header: 'Type',
          render: (row: Incident) =>
          <span className="text-sm">{row.type}</span>

        },
        {
          key: 'severity',
          header: 'Severity',
          render: (row: Incident) =>
          <Badge
            variant={
            row.severity === 'High' || row.severity === 'Critical' ?
            'danger' :
            row.severity === 'Medium' ?
            'warning' :
            'secondary'
            }>

                  {row.severity}
                </Badge>

        },
        {
          key: 'status',
          header: 'Status',
          render: (row: Incident) =>
          <Badge variant={row.status === 'Closed' ? 'success' : 'info'}>
                  {row.status}
                </Badge>

        },
        {
          key: 'repeat',
          header: 'Repeat?',
          render: (row: Incident) =>
          row.isRepeatOffender ?
          <Badge variant="danger">Yes</Badge> :

          <span className="text-gray-400">-</span>

        },
        {
          key: 'action',
          header: 'Action',
          render: (row: Incident) =>
          <Button
            size="xs"
            variant="ghost"
            onClick={() => handleViewIncident(row)}>

                  <Eye className="w-4 h-4" />
                </Button>

        }]
        }
        data={MOCK_INCIDENTS} />

      </Card>
    </div>;

  const RepeatOffendersPanel = () =>
  <div className="space-y-6">
      {/* Rules */}
      <Card title="Repeat Offender Rules" className="bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            <span>3+ incidents in current term</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span>2+ High/Critical incidents in year</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-blue-500" />
            <span>2+ Bullying incidents in 6 months</span>
          </div>
        </div>
      </Card>

      {/* Search */}
      <div className="flex gap-4 items-end bg-white p-4 rounded-lg border">
        <Select
        label="Class"
        options={[
        {
          value: '',
          label: 'All Classes'
        }]
        }
        className="w-48" />

        <Select
        label="Academic Year"
        options={[
        {
          value: '',
          label: 'All Years'
        }]
        }
        className="w-48" />

        <div className="flex-1">
          <Input
          label="Search"
          placeholder="Student Name, GR, SU ID..."
          leftIcon={<Search className="w-4 h-4" />} />

        </div>
        <Button variant="primary">Apply Filters</Button>
      </div>

      {/* Flagged Students */}
      <Card title="Flagged Students" noPadding>
        <Table
        columns={[
        {
          key: 'name',
          header: 'Student Name',
          render: (row: any) =>
          <div>
                  <div className="font-bold">{row.name}</div>
                  <div className="text-xs text-gray-500">{row.grNo}</div>
                </div>

        },
        {
          key: 'class',
          header: 'Class',
          render: (row: any) => `${row.class}-${row.div}`
        },
        {
          key: 'count',
          header: 'Incidents',
          render: (row: any) =>
          <span className="font-bold text-red-600">
                  {row.incidentCount}
                </span>

        },
        {
          key: 'category',
          header: 'Dominant Category'
        },
        {
          key: 'status',
          header: 'Status',
          render: (row: any) =>
          <Badge variant="danger">{row.status}</Badge>

        },
        {
          key: 'action',
          header: 'Actions',
          render: (row: any) =>
          <div className="flex gap-2">
                  <Button
              size="xs"
              variant="outline"
              onClick={() => handleViewIncident(MOCK_INCIDENTS[0])}>

                    View Profile
                  </Button>
                  <Button
              size="xs"
              variant="secondary"
              onClick={() => handleCallParents(row.name)}
              title="Call Parents">

                    <Phone className="w-3 h-3" />
                  </Button>
                  <Button
              size="xs"
              variant="warning"
              onClick={() => handleWrittenWarning(row.name)}
              title="Written Warning">

                    <FileText className="w-3 h-3" />
                  </Button>
                  <Button
              size="xs"
              variant="danger"
              onClick={() => handleOpenSuspension(row)}
              title="Suspend">

                    <Lock className="w-3 h-3" />
                  </Button>
                  <Button
              size="xs"
              variant="ghost"
              className="text-red-700 hover:bg-red-50"
              onClick={() => handleOpenRustication(row)}
              title="Rusticate">

                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>

        }]
        }
        data={REPEAT_OFFENDERS_DATA} />

      </Card>
    </div>;

  const DisciplineActionMasterPanel = () =>
  <div className="space-y-6">
      <div className="flex justify-end">
        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
          Add New Action
        </Button>
      </div>
      <Card title="Discipline Action Master" noPadding>
        <Table
        columns={[
        {
          key: 'name',
          header: 'Action Name',
          render: (row: any) =>
          <span className="font-medium">{row.name}</span>

        },
        {
          key: 'code',
          header: 'Code'
        },
        {
          key: 'severity',
          header: 'Default Severity',
          render: (row: any) =>
          <Badge
            variant={
            row.severity === 'Critical' ?
            'danger' :
            row.severity === 'High' ?
            'danger' :
            'secondary'
            }>

                  {row.severity}
                </Badge>

        },
        {
          key: 'notifyParents',
          header: 'Notify Parents?',
          render: (row: any) => row.notifyParents ? 'Yes' : 'No'
        },
        {
          key: 'affectsAttendance',
          header: 'Affects Attendance?',
          render: (row: any) =>
          row.affectsAttendance ?
          <span className="text-red-600 font-bold">Yes (Locks)</span> :

          'No'

        },
        {
          key: 'active',
          header: 'Active',
          render: (row: any) =>
          row.active ?
          <Badge variant="success">Yes</Badge> :

          <Badge variant="secondary">No</Badge>

        },
        {
          key: 'actions',
          header: 'Actions',
          render: () =>
          <Button size="xs" variant="outline">
                  <Edit className="w-3 h-3" />
                </Button>

        }]
        }
        data={MOCK_ACTION_MASTER} />

      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
          <strong>Note on Suspension:</strong> Applying a "Suspension" action
          will lock the student's attendance for the specified duration.
          Teachers cannot mark them present.
        </div>
        <div className="p-4 bg-red-50 border border-red-200 rounded text-sm text-red-800">
          <strong>Note on Rustication:</strong> Applying a "Rusticate" action is
          permanent. The student will be moved to the "Deleted Student" list and
          exit processes will be triggered.
        </div>
      </div>
    </div>;

  // --- Main Render ---
  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      <div className="flex-shrink-0 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Student Discipline & Behaviour
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage incidents, track behaviour patterns, and record actions.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-6 space-y-6">
        <Tabs
          tabs={[
          {
            id: 'report',
            label: 'Report Incident',
            content: <ReportIncidentPanel />
          },
          {
            id: 'list',
            label: 'Incident List',
            content: <IncidentListPanel />
          },
          {
            id: 'repeat',
            label: 'Repeat Offenders',
            content: <RepeatOffendersPanel />
          },
          {
            id: 'master',
            label: 'Discipline Action Master',
            content: <DisciplineActionMasterPanel />
          }]
          } />

      </div>

      {/* --- Modals --- */}

      {/* Incident Detail Modal */}
      <Modal
        isOpen={isIncidentModalOpen}
        onClose={() => setIsIncidentModalOpen(false)}
        title="Incident Details"
        size="lg"
        footer={
        <div className="flex justify-end gap-2 w-full">
            <Button
            variant="outline"
            onClick={() => setIsIncidentModalOpen(false)}>

              Close
            </Button>
            <Button variant="primary" leftIcon={<Edit className="w-4 h-4" />}>
              Edit Incident
            </Button>
          </div>
        }>

        {selectedIncident &&
        <div className="space-y-6">
            <div className="flex justify-between items-start bg-gray-50 p-4 rounded-lg">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {selectedIncident.type}
                </h3>
                <p className="text-sm text-gray-600">
                  ID: {selectedIncident.id} • {selectedIncident.date} at{' '}
                  {selectedIncident.time}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge
                variant={
                selectedIncident.severity === 'High' ? 'danger' : 'warning'
                }>

                  {selectedIncident.severity}
                </Badge>
                <Badge variant="outline">{selectedIncident.status}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Student
                </label>
                <p className="font-medium">
                  {selectedIncident.studentName} ({selectedIncident.classDiv})
                </p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Reported By
                </label>
                <p className="font-medium">{selectedIncident.reportedBy}</p>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Description
              </label>
              <p className="text-gray-800 bg-white p-3 border rounded mt-1">
                {selectedIncident.description}
              </p>
            </div>
            <div className="border-t pt-4">
              <h4 className="font-bold text-gray-900 mb-2">Actions Taken</h4>
              <p className="text-sm text-gray-500 italic">
                No actions recorded yet.
              </p>
            </div>
          </div>
        }
      </Modal>

      {/* Suspension Modal */}
      <Modal
        isOpen={isSuspensionModalOpen}
        onClose={() => setIsSuspensionModalOpen(false)}
        title="Suspend Student"
        size="md">

        <div className="space-y-4">
          <div className="bg-yellow-50 p-3 rounded text-sm text-yellow-800 flex gap-2">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <div>
              <strong>Warning:</strong> Attendance will be locked for{' '}
              {selectedOffenderForAction?.name} during the suspension period.
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" />
            <Input label="End Date" type="date" />
          </div>
          <Input
            label="Reason for Suspension"
            placeholder="e.g. Repeated disruption" />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked
              readOnly
              className="rounded text-blue-600" />

            <label className="text-sm">Notify Parents (SMS/Email)</label>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsSuspensionModalOpen(false)}>

              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmSuspension}>
              Confirm Suspension
            </Button>
          </div>
        </div>
      </Modal>

      {/* Rustication Modal */}
      <Modal
        isOpen={isRusticationModalOpen}
        onClose={() => setIsRusticationModalOpen(false)}
        title="Rusticate Student"
        size="md">

        <div className="space-y-4">
          <div className="bg-red-50 p-3 rounded text-sm text-red-800 flex gap-2">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <div>
              <strong>CRITICAL ACTION:</strong> This will permanently remove{' '}
              {selectedOffenderForAction?.name} from active rolls and move them
              to the Deleted Student list.
            </div>
          </div>
          <Input label="Rustication Date" type="date" />
          <Input
            label="Authority Approval Ref"
            placeholder="Principal/Board Order No." />

          <Input label="Reason" placeholder="Detailed reason for rustication" />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked
              readOnly
              className="rounded text-blue-600" />

            <label className="text-sm">
              Trigger Exit Process (TC, Fees, etc.)
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsRusticationModalOpen(false)}>

              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmRustication}>
              Confirm Rustication
            </Button>
          </div>
        </div>
      </Modal>
    </div>);

}