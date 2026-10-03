import React, { useMemo, useState } from 'react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  XIcon,
  EyeIcon,
  CheckIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon,
  BellIcon } from
'lucide-react';
const ACTIVITY_TYPES = [
{
  value: 'duty',
  label: 'Duty'
},
{
  value: 'meeting',
  label: 'Meeting'
},
{
  value: 'invigilation',
  label: 'Invigilation'
},
{
  value: 'supervision',
  label: 'Supervision'
},
{
  value: 'committee',
  label: 'Committee Work'
},
{
  value: 'event',
  label: 'Event Support'
},
{
  value: 'counseling',
  label: 'Counseling'
},
{
  value: 'training',
  label: 'Training'
}];

const LOCATIONS = [
'Hall A',
'Hall B',
'Staff Room',
'Auditorium',
'Library',
'Lab 1',
'Lab 2',
'Transport Bay',
'Counseling Room',
'Conference Room',
'Playground',
'Main Gate',
'Cafeteria'];

const TEACHERS = [
{
  id: 't1',
  name: 'R. Sharma',
  dept: 'Mathematics'
},
{
  id: 't2',
  name: 'A. Gupta',
  dept: 'Science'
},
{
  id: 't3',
  name: 'M. Singh',
  dept: 'English'
},
{
  id: 't4',
  name: 'S. Patel',
  dept: 'History'
},
{
  id: 't5',
  name: 'P. Kumar',
  dept: 'Physics'
},
{
  id: 't6',
  name: 'V. Verma',
  dept: 'Chemistry'
}];

const GROUPS = [
{
  value: 'all-teachers',
  label: 'All Teachers'
},
{
  value: 'science-dept',
  label: 'Science Department'
},
{
  value: 'math-dept',
  label: 'Mathematics Department'
},
{
  value: 'primary-teachers',
  label: 'Primary Teachers'
},
{
  value: 'senior-teachers',
  label: 'Senior Teachers'
}];

const MASTER_FRANCHISES = [
{
  value: 'all',
  label: 'All Franchises'
},
{
  value: 'mf1',
  label: 'ABC Education Group'
},
{
  value: 'mf2',
  label: 'XYZ Learning Hub'
},
{
  value: 'mf3',
  label: 'PQR Academy Network'
}];

const CENTRES = [
{
  value: 'all',
  label: 'All Centres'
},
{
  value: 'c1',
  label: 'Main Campus'
},
{
  value: 'c2',
  label: 'North Branch'
},
{
  value: 'c3',
  label: 'South Branch'
},
{
  value: 'c4',
  label: 'East Wing'
},
{
  value: 'c5',
  label: 'West Campus'
}];

interface Activity {
  id: string;
  name: string;
  description: string;
  type: string;
  typeLabel: string;
  assignedTo: string[];
  assignedNames: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  status: 'Scheduled' | 'Active' | 'Completed' | 'Cancelled';
  priority: 'Normal' | 'High' | 'Urgent';
  recurring: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly';
  notifyBefore: number;
  createdBy: string;
  createdAt: string;
  notes: string;
  completedAt?: string;
  completedBy?: string;
}
const INITIAL_ACTIVITIES: Activity[] = [
{
  id: '1',
  name: 'Exam Invigilation',
  description: 'Mathematics Mid-term exam supervision',
  type: 'invigilation',
  typeLabel: 'Invigilation',
  assignedTo: ['t1'],
  assignedNames: 'R. Sharma',
  date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
  startTime: '09:00',
  endTime: '12:00',
  location: 'Hall A',
  status: 'Scheduled',
  priority: 'High',
  recurring: false,
  notifyBefore: 60,
  createdBy: 'Admin',
  createdAt: new Date().toISOString(),
  notes: 'Ensure attendance sheet is signed'
},
{
  id: '2',
  name: 'Science Dept Meeting',
  description: 'Quarterly planning and review meeting',
  type: 'meeting',
  typeLabel: 'Meeting',
  assignedTo: ['t2', 't5', 't6'],
  assignedNames: 'Science Teachers',
  date: new Date().toISOString().split('T')[0],
  startTime: '15:00',
  endTime: '16:30',
  location: 'Staff Room',
  status: 'Active',
  priority: 'Normal',
  recurring: true,
  recurringPattern: 'monthly',
  notifyBefore: 30,
  createdBy: 'HOD Science',
  createdAt: new Date().toISOString(),
  notes: 'Agenda: Lab equipment procurement'
},
{
  id: '3',
  name: 'Bus Duty Route 4',
  description: 'Afternoon bus departure supervision',
  type: 'supervision',
  typeLabel: 'Supervision',
  assignedTo: ['t2'],
  assignedNames: 'A. Gupta',
  date: new Date().toISOString().split('T')[0],
  startTime: '14:30',
  endTime: '15:00',
  location: 'Transport Bay',
  status: 'Active',
  priority: 'Normal',
  recurring: true,
  recurringPattern: 'daily',
  notifyBefore: 15,
  createdBy: 'Transport Head',
  createdAt: new Date().toISOString(),
  notes: 'Check student attendance in buses'
},
{
  id: '4',
  name: 'Parent Counseling',
  description: 'Student performance discussion',
  type: 'counseling',
  typeLabel: 'Counseling',
  assignedTo: ['t3'],
  assignedNames: 'M. Singh',
  date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
  startTime: '11:00',
  endTime: '12:00',
  location: 'Counseling Room',
  status: 'Completed',
  priority: 'Normal',
  recurring: false,
  notifyBefore: 120,
  createdBy: 'M. Singh',
  createdAt: new Date(Date.now() - 172800000).toISOString(),
  notes: 'Parents of Aarav Patel',
  completedAt: new Date(Date.now() - 86400000).toISOString(),
  completedBy: 'M. Singh'
},
{
  id: '5',
  name: 'Sports Day Committee Meeting',
  description: 'Annual sports day planning',
  type: 'committee',
  typeLabel: 'Committee Work',
  assignedTo: ['t1', 't4'],
  assignedNames: 'R. Sharma, S. Patel',
  date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
  startTime: '13:00',
  endTime: '14:00',
  location: 'Conference Room',
  status: 'Scheduled',
  priority: 'High',
  recurring: false,
  notifyBefore: 120,
  createdBy: 'Principal',
  createdAt: new Date().toISOString(),
  notes: 'Discuss event schedule and budget'
}];

export function ActivityManagement() {
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTeacher, setFilterTeacher] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [filterMasterFranchise, setFilterMasterFranchise] = useState('all');
  const [filterCentre, setFilterCentre] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [viewingActivity, setViewingActivity] = useState<Activity | null>(null);
  const filteredActivities = useMemo(() => {
    return activities.
    filter((a) => {
      const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || a.type === filterType;
      const matchesStatus =
      filterStatus === 'all' || a.status.toLowerCase() === filterStatus;
      const matchesTeacher =
      filterTeacher === 'all' || a.assignedTo.includes(filterTeacher);
      const matchesDate =
      filterDate === 'all' ||
      filterDate === 'today' &&
      a.date === new Date().toISOString().split('T')[0] ||
      filterDate === 'upcoming' && new Date(a.date) > new Date() ||
      filterDate === 'past' && new Date(a.date) < new Date();
      return (
        matchesSearch &&
        matchesType &&
        matchesStatus &&
        matchesTeacher &&
        matchesDate);

    }).
    sort(
      (a, b) =>
      new Date(a.date + ' ' + a.startTime).getTime() -
      new Date(b.date + ' ' + b.startTime).getTime()
    );
  }, [
  activities,
  searchTerm,
  filterType,
  filterStatus,
  filterTeacher,
  filterDate]
  );
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const active = activities.filter((a) => a.status === 'Active').length;
    const scheduled = activities.filter((a) => a.status === 'Scheduled').length;
    const todayActivities = activities.filter((a) => a.date === today).length;
    return {
      active,
      scheduled,
      todayActivities,
      total: activities.length
    };
  }, [activities]);
  const handleSaveActivity = (data: Partial<Activity>) => {
    const typeLabel =
    ACTIVITY_TYPES.find((t) => t.value === data.type)?.label || '';
    const assignedNames =
    data.assignedTo?.
    map((id) => TEACHERS.find((t) => t.id === id)?.name).
    join(', ') || '';
    if (editingActivity) {
      setActivities((prev) =>
      prev.map((a) =>
      a.id === editingActivity.id ?
      {
        ...a,
        ...data,
        typeLabel,
        assignedNames
      } :
      a
      )
      );
    } else {
      const newActivity: Activity = {
        id: Date.now().toString(),
        name: data.name || '',
        description: data.description || '',
        type: data.type || 'duty',
        typeLabel,
        assignedTo: data.assignedTo || [],
        assignedNames,
        date: data.date || '',
        startTime: data.startTime || '',
        endTime: data.endTime || '',
        location: data.location || '',
        status: new Date(data.date || '') > new Date() ? 'Scheduled' : 'Active',
        priority: data.priority || 'Normal',
        recurring: data.recurring || false,
        recurringPattern: data.recurringPattern,
        notifyBefore: data.notifyBefore || 30,
        createdBy: 'Admin',
        createdAt: new Date().toISOString(),
        notes: data.notes || ''
      };
      setActivities((prev) => [...prev, newActivity]);
    }
    setShowModal(false);
    setEditingActivity(null);
  };
  const handleDelete = (id: string) => {
    if (window.confirm('Delete this activity?')) {
      setActivities((prev) => prev.filter((a) => a.id !== id));
    }
  };
  const handleMarkComplete = (id: string) => {
    setActivities((prev) =>
    prev.map((a) =>
    a.id === id ?
    {
      ...a,
      status: 'Completed',
      completedAt: new Date().toISOString(),
      completedBy: 'Current User'
    } :
    a
    )
    );
  };
  const handleCancel = (id: string) => {
    if (window.confirm('Cancel this activity?')) {
      setActivities((prev) =>
      prev.map((a) =>
      a.id === id ?
      {
        ...a,
        status: 'Cancelled'
      } :
      a
      )
      );
    }
  };
  const getRelativeTime = (dateStr: string, timeStr: string) => {
    const activityDate = new Date(`${dateStr} ${timeStr}`);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (dateStr === today.toISOString().split('T')[0]) {
      return `Today, ${timeStr}`;
    } else if (dateStr === tomorrow.toISOString().split('T')[0]) {
      return `Tomorrow, ${timeStr}`;
    } else if (dateStr === yesterday.toISOString().split('T')[0]) {
      return `Yesterday, ${timeStr}`;
    } else {
      return `${new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short'
      })}, ${timeStr}`;
    }
  };
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Activity Management
          </h1>
          <p className="text-sm text-gray-500">
            Create and manage individual teacher duties and activities
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setEditingActivity(null);
            setShowModal(true);
          }}>
          
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Activity
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
        {
          value: stats.todayActivities,
          label: "Today's Activities",
          color: 'text-blue-600'
        },
        {
          value: stats.active,
          label: 'Active Now',
          color: 'text-green-600'
        },
        {
          value: stats.scheduled,
          label: 'Scheduled',
          color: 'text-orange-500'
        },
        {
          value: stats.total,
          label: 'Total Activities',
          color: 'text-gray-900'
        }].
        map((stat, i) =>
        <Card key={i}>
            <div className="p-3 text-center">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </Card>
        )}
      </div>

      <Card title="Activity List">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Input
              placeholder="Search activities..."
              className="flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} />
            
            <Select
              options={MASTER_FRANCHISES}
              value={filterMasterFranchise}
              onChange={(e) => setFilterMasterFranchise(e.target.value)} />
            
            <Select
              options={CENTRES}
              value={filterCentre}
              onChange={(e) => setFilterCentre(e.target.value)} />
            
            <Select
              options={[
              {
                value: 'all',
                label: 'All Types'
              },
              ...ACTIVITY_TYPES]
              }
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)} />
            
            <Select
              options={[
              {
                value: 'all',
                label: 'All Status'
              },
              {
                value: 'scheduled',
                label: 'Scheduled'
              },
              {
                value: 'active',
                label: 'Active'
              },
              {
                value: 'completed',
                label: 'Completed'
              },
              {
                value: 'cancelled',
                label: 'Cancelled'
              }]
              }
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)} />
            
            <Select
              options={[
              {
                value: 'all',
                label: 'All Teachers'
              },
              ...TEACHERS.map((t) => ({
                value: t.id,
                label: t.name
              }))]
              }
              value={filterTeacher}
              onChange={(e) => setFilterTeacher(e.target.value)} />
            
            <Select
              options={[
              {
                value: 'all',
                label: 'All Dates'
              },
              {
                value: 'today',
                label: 'Today'
              },
              {
                value: 'upcoming',
                label: 'Upcoming'
              },
              {
                value: 'past',
                label: 'Past'
              }]
              }
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)} />
            
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  {[
                  'Activity Name',
                  'Type',
                  'Assigned To',
                  'Date & Time',
                  'Location',
                  'Status',
                  'Actions'].
                  map((h) =>
                  <th
                    key={h}
                    className="text-left py-3 px-4 font-medium text-gray-600">
                    
                      {h}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredActivities.length === 0 ?
                <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      No activities found
                    </td>
                  </tr> :

                filteredActivities.map((row) =>
                <tr
                  key={row.id}
                  className="border-b border-gray-100 hover:bg-gray-50">
                  
                      <td className="py-3 px-4">
                        <button
                      onClick={() => {
                        setViewingActivity(row);
                        setShowViewModal(true);
                      }}
                      className="font-medium text-blue-600 hover:underline text-left">
                      
                          {row.name}
                        </button>
                        {row.recurring &&
                    <Badge variant="default" className="ml-2 text-xs">
                            Recurring
                          </Badge>
                    }
                        {row.priority !== 'Normal' &&
                    <Badge
                      variant={
                      row.priority === 'Urgent' ? 'danger' : 'warning'
                      }
                      className="ml-2 text-xs">
                      
                            {row.priority}
                          </Badge>
                    }
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-500">
                        {row.typeLabel}
                      </td>
                      <td className="py-3 px-4 text-sm">{row.assignedNames}</td>
                      <td className="py-3 px-4 text-xs">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3" />
                          {getRelativeTime(row.date, row.startTime)}
                        </div>
                        <div className="text-gray-400">{row.endTime}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-xs flex items-center gap-1">
                        <MapPinIcon className="w-3 h-3" />
                        {row.location}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                      variant={
                      row.status === 'Active' ?
                      'success' :
                      row.status === 'Completed' ?
                      'default' :
                      row.status === 'Cancelled' ?
                      'danger' :
                      'warning'
                      }>
                      
                          {row.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setViewingActivity(row);
                          setShowViewModal(true);
                        }}>
                        
                            <EyeIcon className="w-3 h-3" />
                          </Button>
                          {row.status !== 'Completed' &&
                      row.status !== 'Cancelled' &&
                      <>
                                <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingActivity(row);
                            setShowModal(true);
                          }}>
                          
                                  <EditIcon className="w-3 h-3" />
                                </Button>
                                <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkComplete(row.id)}>
                          
                                  <CheckIcon className="w-3 h-3" />
                                </Button>
                              </>
                      }
                          {row.status === 'Scheduled' &&
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(row.id)}>
                        
                              <TrashIcon className="w-3 h-3" />
                            </Button>
                      }
                        </div>
                      </td>
                    </tr>
                )
                }
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {showModal &&
      <ActivityModal
        activity={editingActivity}
        teachers={TEACHERS}
        groups={GROUPS}
        types={ACTIVITY_TYPES}
        locations={LOCATIONS}
        onSave={handleSaveActivity}
        onClose={() => {
          setShowModal(false);
          setEditingActivity(null);
        }} />

      }

      {showViewModal && viewingActivity &&
      <ViewActivityModal
        activity={viewingActivity}
        onClose={() => {
          setShowViewModal(false);
          setViewingActivity(null);
        }}
        onEdit={() => {
          setShowViewModal(false);
          setEditingActivity(viewingActivity);
          setShowModal(true);
        }}
        onComplete={() => {
          handleMarkComplete(viewingActivity.id);
          setShowViewModal(false);
        }}
        onCancel={() => {
          handleCancel(viewingActivity.id);
          setShowViewModal(false);
        }} />

      }
    </div>);

}
function ActivityModal({
  activity,
  teachers,
  groups,
  types,
  locations,
  onSave,
  onClose


















}: {activity: Activity | null;teachers: {id: string;name: string;dept: string;}[];groups: {value: string;label: string;}[];types: {value: string;label: string;}[];locations: string[];onSave: (data: Partial<Activity>) => void;onClose: () => void;}) {
  const [form, setForm] = useState({
    name: activity?.name || '',
    description: activity?.description || '',
    type: activity?.type || 'duty',
    assignedTo: activity?.assignedTo || [],
    date: activity?.date || '',
    startTime: activity?.startTime || '',
    endTime: activity?.endTime || '',
    location: activity?.location || '',
    priority: activity?.priority || 'Normal',
    recurring: activity?.recurring || false,
    recurringPattern: activity?.recurringPattern || 'weekly',
    notifyBefore: activity?.notifyBefore || 30,
    notes: activity?.notes || ''
  });
  const handleTeacherToggle = (teacherId: string) => {
    setForm((prev) => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(teacherId) ?
      prev.assignedTo.filter((t) => t !== teacherId) :
      [...prev.assignedTo, teacherId]
    }));
  };
  const handleSubmit = () => {
    if (
    !form.name ||
    !form.date ||
    !form.startTime ||
    !form.endTime ||
    form.assignedTo.length === 0)
    {
      alert('Please fill all required fields');
      return;
    }
    onSave(form);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {activity ? 'Edit' : 'Create'} Activity
          </h2>
          <button onClick={onClose}>
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <Input
            label="Activity Name *"
            value={form.name}
            onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value
            })
            }
            placeholder="e.g., Exam Invigilation" />
          

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Type *"
              options={types}
              value={form.type}
              onChange={(e) =>
              setForm({
                ...form,
                type: e.target.value
              })
              } />
            
            <Select
              label="Priority"
              options={[
              {
                value: 'Normal',
                label: 'Normal'
              },
              {
                value: 'High',
                label: 'High'
              },
              {
                value: 'Urgent',
                label: 'Urgent'
              }]
              }
              value={form.priority}
              onChange={(e) =>
              setForm({
                ...form,
                priority: e.target.value as 'Normal' | 'High' | 'Urgent'
              })
              } />
            
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Assigned To *
            </label>
            <div className="flex flex-wrap gap-2 p-3 border rounded max-h-32 overflow-y-auto">
              {teachers.map((t) =>
              <button
                key={t.id}
                type="button"
                onClick={() => handleTeacherToggle(t.id)}
                className={`px-3 py-1 rounded text-sm ${form.assignedTo.includes(t.id) ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
                
                  {t.name}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Date *"
              type="date"
              value={form.date}
              onChange={(e) =>
              setForm({
                ...form,
                date: e.target.value
              })
              } />
            
            <Input
              label="Start Time *"
              type="time"
              value={form.startTime}
              onChange={(e) =>
              setForm({
                ...form,
                startTime: e.target.value
              })
              } />
            
            <Input
              label="End Time *"
              type="time"
              value={form.endTime}
              onChange={(e) =>
              setForm({
                ...form,
                endTime: e.target.value
              })
              } />
            
          </div>

          <Select
            label="Location *"
            options={locations.map((l) => ({
              value: l,
              label: l
            }))}
            value={form.location}
            onChange={(e) =>
            setForm({
              ...form,
              location: e.target.value
            })
            } />
          

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="recurring"
                checked={form.recurring}
                onChange={(e) =>
                setForm({
                  ...form,
                  recurring: e.target.checked
                })
                } />
              
              <label htmlFor="recurring" className="text-sm">
                Recurring Activity
              </label>
            </div>
            {form.recurring &&
            <Select
              options={[
              {
                value: 'daily',
                label: 'Daily'
              },
              {
                value: 'weekly',
                label: 'Weekly'
              },
              {
                value: 'monthly',
                label: 'Monthly'
              }]
              }
              value={form.recurringPattern || 'weekly'}
              onChange={(e) =>
              setForm({
                ...form,
                recurringPattern: e.target.value as
                'daily' |
                'weekly' |
                'monthly'
              })
              } />

            }
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Notify Before (minutes)"
              options={[
              {
                value: '15',
                label: '15 minutes'
              },
              {
                value: '30',
                label: '30 minutes'
              },
              {
                value: '60',
                label: '1 hour'
              },
              {
                value: '120',
                label: '2 hours'
              }]
              }
              value={String(form.notifyBefore)}
              onChange={(e) =>
              setForm({
                ...form,
                notifyBefore: Number(e.target.value)
              })
              } />
            
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              className="w-full border rounded p-2 text-sm"
              rows={2}
              value={form.description}
              onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value
              })
              }
              placeholder="Activity description..." />
            
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Additional Notes
            </label>
            <textarea
              className="w-full border rounded p-2 text-sm"
              rows={2}
              value={form.notes}
              onChange={(e) =>
              setForm({
                ...form,
                notes: e.target.value
              })
              }
              placeholder="Any special instructions..." />
            
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {activity ? 'Update' : 'Create'} Activity
            </Button>
          </div>
        </div>
      </div>
    </div>);

}
function ViewActivityModal({
  activity,
  onClose,
  onEdit,
  onComplete,
  onCancel






}: {activity: Activity;onClose: () => void;onEdit: () => void;onComplete: () => void;onCancel: () => void;}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold">{activity.name}</h2>
            <p className="text-sm text-gray-500">{activity.typeLabel}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={
              activity.status === 'Active' ?
              'success' :
              activity.status === 'Completed' ?
              'default' :
              activity.status === 'Cancelled' ?
              'danger' :
              'warning'
              }>
              
              {activity.status}
            </Badge>
            {activity.priority !== 'Normal' &&
            <Badge
              variant={activity.priority === 'Urgent' ? 'danger' : 'warning'}>
              
                {activity.priority}
              </Badge>
            }
            <button onClick={onClose}>
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {activity.description &&
        <div className="mb-4 p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-700">{activity.description}</p>
          </div>
        }

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Date:</span>{' '}
            <span className="font-medium">
              {new Date(activity.date).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Time:</span>{' '}
            <span className="font-medium">
              {activity.startTime} - {activity.endTime}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Location:</span>{' '}
            <span className="font-medium">{activity.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Assigned:</span>{' '}
            <span className="font-medium">{activity.assignedNames}</span>
          </div>
          {activity.recurring &&
          <div className="flex items-center gap-2">
              <BellIcon className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Recurring:</span>{' '}
              <span className="font-medium capitalize">
                {activity.recurringPattern}
              </span>
            </div>
          }
          <div className="flex items-center gap-2">
            <BellIcon className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Notify:</span>{' '}
            <span className="font-medium">
              {activity.notifyBefore} mins before
            </span>
          </div>
        </div>

        {activity.notes &&
        <div className="mb-4">
            <h4 className="font-medium text-sm mb-2">Notes</h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              {activity.notes}
            </p>
          </div>
        }

        {activity.completedAt &&
        <div className="mb-4 p-3 bg-green-50 rounded text-sm">
            <p>
              <span className="font-medium">Completed by:</span>{' '}
              {activity.completedBy}
            </p>
            <p>
              <span className="font-medium">Completed at:</span>{' '}
              {new Date(activity.completedAt).toLocaleString()}
            </p>
          </div>
        }

        <div className="flex gap-2 justify-end pt-4">
          {activity.status !== 'Completed' &&
          activity.status !== 'Cancelled' &&
          <>
                <Button variant="outline" onClick={onEdit}>
                  <EditIcon className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" onClick={onCancel}>
                  Cancel Activity
                </Button>
                <Button variant="primary" onClick={onComplete}>
                  <CheckIcon className="w-4 h-4 mr-2" />
                  Mark Complete
                </Button>
              </>
          }
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>);

}