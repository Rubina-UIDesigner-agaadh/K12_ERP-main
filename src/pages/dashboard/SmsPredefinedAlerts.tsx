import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import {
  Plus,
  Edit2,
  Trash2,
  Power,
  SearchIcon,
  MessageSquareIcon,
  BellIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ClockIcon,
  XIcon,
  InfoIcon,
  SendIcon,
  EyeIcon,
  CopyIcon,
  RefreshCwIcon,
  SettingsIcon,
  UsersIcon,
  CalendarIcon,
  ZapIcon,
  FilterIcon,
  DownloadIcon,
  PlayIcon,
  PauseIcon,
  TestTubeIcon,
  SmartphoneIcon,
  MailIcon,
  TagIcon,
  LayersIcon,
  HistoryIcon,
  TrendingUpIcon,
  AlertTriangleIcon,
  BookOpenIcon } from
'lucide-react';

interface Variable {
  name: string;
  description: string;
  example: string;
}

interface TriggerCondition {
  event: string;
  timing: string;
  frequency: string;
}

interface Recipient {
  type: string;
  filter?: string;
}

interface Template {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  content: string;
  status: 'Active' | 'Inactive' | 'Draft';
  priority: 'High' | 'Medium' | 'Low';
  triggerType: 'Automatic' | 'Manual' | 'Scheduled';
  triggerCondition?: TriggerCondition;
  recipients: Recipient[];
  variables: string[];
  lastModified: string;
  createdBy: string;
  sentCount: number;
  deliveryRate: number;
  isDefault: boolean;
}

interface InfoModalContent {
  title: string;
  description: string;
  tips: string[];
}

const categoriesData = [
{
  id: 'attendance',
  name: 'Attendance',
  icon: CalendarIcon,
  color: 'bg-blue-500',
  count: 4,
  subcategories: ['Absent Alert', 'Late Arrival', 'Early Leave', 'Attendance Summary']
},
{
  id: 'fee',
  name: 'Fee & Finance',
  icon: MessageSquareIcon,
  color: 'bg-emerald-500',
  count: 5,
  subcategories: ['Due Reminder', 'Payment Confirmation', 'Overdue Alert', 'Fee Structure', 'Scholarship']
},
{
  id: 'exam',
  name: 'Examination',
  icon: BookOpenIcon,
  color: 'bg-purple-500',
  count: 3,
  subcategories: ['Schedule', 'Result', 'Admit Card']
},
{
  id: 'emergency',
  name: 'Emergency',
  icon: AlertTriangleIcon,
  color: 'bg-red-500',
  count: 2,
  subcategories: ['Holiday', 'Safety Alert']
},
{
  id: 'general',
  name: 'General',
  icon: BellIcon,
  color: 'bg-amber-500',
  count: 3,
  subcategories: ['Announcement', 'Event', 'Meeting']
},
{
  id: 'transport',
  name: 'Transport',
  icon: SmartphoneIcon,
  color: 'bg-cyan-500',
  count: 2,
  subcategories: ['Route Change', 'Delay Alert']
}];


const variablesData: Variable[] = [
{ name: '{StudentName}', description: 'Full name of the student', example: 'Aarav Sharma' },
{ name: '{StudentFirstName}', description: 'First name of the student', example: 'Aarav' },
{ name: '{Class}', description: 'Class and section', example: '10-A' },
{ name: '{Date}', description: 'Current or specified date', example: '15 Mar 2024' },
{ name: '{Time}', description: 'Current or specified time', example: '10:30 AM' },
{ name: '{Amount}', description: 'Fee or payment amount', example: '₹15,000' },
{ name: '{DueDate}', description: 'Payment due date', example: '20 Mar 2024' },
{ name: '{ParentName}', description: 'Parent/Guardian name', example: 'Rajesh Sharma' },
{ name: '{GRNo}', description: 'Student GR number', example: 'GR-2024-001' },
{ name: '{ExamName}', description: 'Name of examination', example: 'Mid-Term Exam' },
{ name: '{Subject}', description: 'Subject name', example: 'Mathematics' },
{ name: '{Marks}', description: 'Obtained marks', example: '85/100' },
{ name: '{Percentage}', description: 'Percentage obtained', example: '85%' },
{ name: '{Reason}', description: 'Reason for alert', example: 'Heavy rainfall' },
{ name: '{TeacherName}', description: 'Teacher name', example: 'Mrs. Patel' },
{ name: '{SchoolName}', description: 'School name', example: 'ABC Public School' },
{ name: '{ContactNo}', description: 'School contact number', example: '1800-XXX-XXXX' }];


const templatesData: Template[] = [
{
  id: 1,
  name: 'Daily Absence Alert',
  category: 'Attendance',
  subcategory: 'Absent Alert',
  content: 'Dear {ParentName}, your ward {StudentName} of class {Class} was absent on {Date}. Please contact school office if this is incorrect. - {SchoolName}',
  status: 'Active',
  priority: 'High',
  triggerType: 'Automatic',
  triggerCondition: {
    event: 'Student marked absent',
    timing: 'Same day at 11:00 AM',
    frequency: 'Daily'
  },
  recipients: [{ type: 'Parent', filter: 'Primary Contact' }],
  variables: ['{ParentName}', '{StudentName}', '{Class}', '{Date}', '{SchoolName}'],
  lastModified: '2024-03-10',
  createdBy: 'Admin',
  sentCount: 1250,
  deliveryRate: 98.5,
  isDefault: true
},
{
  id: 2,
  name: 'Fee Due Reminder',
  category: 'Fee & Finance',
  subcategory: 'Due Reminder',
  content: 'Reminder: Fee of {Amount} for {StudentName} ({Class}) is due by {DueDate}. Please pay to avoid late fee. Contact: {ContactNo}',
  status: 'Active',
  priority: 'High',
  triggerType: 'Scheduled',
  triggerCondition: {
    event: 'Fee due date approaching',
    timing: '7 days before due date',
    frequency: 'Once per cycle'
  },
  recipients: [{ type: 'Parent', filter: 'All Contacts' }],
  variables: ['{Amount}', '{StudentName}', '{Class}', '{DueDate}', '{ContactNo}'],
  lastModified: '2024-03-08',
  createdBy: 'Accounts',
  sentCount: 2840,
  deliveryRate: 97.2,
  isDefault: true
},
{
  id: 3,
  name: 'Fee Payment Confirmation',
  category: 'Fee & Finance',
  subcategory: 'Payment Confirmation',
  content: 'Payment of {Amount} received for {StudentName} ({Class}) on {Date}. Receipt No: {ReceiptNo}. Thank you! - {SchoolName}',
  status: 'Active',
  priority: 'Medium',
  triggerType: 'Automatic',
  triggerCondition: {
    event: 'Fee payment received',
    timing: 'Immediate',
    frequency: 'Per transaction'
  },
  recipients: [{ type: 'Parent', filter: 'Primary Contact' }],
  variables: ['{Amount}', '{StudentName}', '{Class}', '{Date}', '{ReceiptNo}', '{SchoolName}'],
  lastModified: '2024-03-05',
  createdBy: 'Accounts',
  sentCount: 3560,
  deliveryRate: 99.1,
  isDefault: true
},
{
  id: 4,
  name: 'Emergency Holiday Notice',
  category: 'Emergency',
  subcategory: 'Holiday',
  content: 'URGENT: School will remain CLOSED on {Date} due to {Reason}. Students need not come. Stay safe. - {SchoolName}',
  status: 'Active',
  priority: 'High',
  triggerType: 'Manual',
  recipients: [
  { type: 'Parent', filter: 'All Contacts' },
  { type: 'Staff', filter: 'All' }],

  variables: ['{Date}', '{Reason}', '{SchoolName}'],
  lastModified: '2024-02-28',
  createdBy: 'Principal',
  sentCount: 45,
  deliveryRate: 99.8,
  isDefault: false
},
{
  id: 5,
  name: 'Exam Schedule Notification',
  category: 'Examination',
  subcategory: 'Schedule',
  content: '{ExamName} for class {Class} starts from {Date}. Download schedule from school portal. All the best! - {SchoolName}',
  status: 'Active',
  priority: 'Medium',
  triggerType: 'Manual',
  recipients: [{ type: 'Parent', filter: 'Class-wise' }],
  variables: ['{ExamName}', '{Class}', '{Date}', '{SchoolName}'],
  lastModified: '2024-02-25',
  createdBy: 'Exam Cell',
  sentCount: 890,
  deliveryRate: 97.8,
  isDefault: false
},
{
  id: 6,
  name: 'Result Declaration',
  category: 'Examination',
  subcategory: 'Result',
  content: '{ExamName} results for {StudentName} ({Class}): Percentage - {Percentage}. View detailed report on parent portal. - {SchoolName}',
  status: 'Active',
  priority: 'Medium',
  triggerType: 'Automatic',
  triggerCondition: {
    event: 'Result published',
    timing: 'Immediate',
    frequency: 'Per exam'
  },
  recipients: [{ type: 'Parent', filter: 'Primary Contact' }],
  variables: ['{ExamName}', '{StudentName}', '{Class}', '{Percentage}', '{SchoolName}'],
  lastModified: '2024-02-20',
  createdBy: 'Exam Cell',
  sentCount: 2450,
  deliveryRate: 98.9,
  isDefault: true
},
{
  id: 7,
  name: 'Late Arrival Alert',
  category: 'Attendance',
  subcategory: 'Late Arrival',
  content: 'Dear {ParentName}, {StudentName} ({Class}) arrived late at {Time} on {Date}. Please ensure timely arrival. - {SchoolName}',
  status: 'Inactive',
  priority: 'Low',
  triggerType: 'Automatic',
  triggerCondition: {
    event: 'Student arrives after 8:30 AM',
    timing: 'Same day at 9:00 AM',
    frequency: 'Daily'
  },
  recipients: [{ type: 'Parent', filter: 'Primary Contact' }],
  variables: ['{ParentName}', '{StudentName}', '{Class}', '{Time}', '{Date}', '{SchoolName}'],
  lastModified: '2024-02-15',
  createdBy: 'Admin',
  sentCount: 320,
  deliveryRate: 96.5,
  isDefault: false
},
{
  id: 8,
  name: 'Fee Overdue Alert',
  category: 'Fee & Finance',
  subcategory: 'Overdue Alert',
  content: 'OVERDUE: Fee of {Amount} for {StudentName} ({Class}) is overdue by {Days} days. Late fee applicable. Pay immediately to avoid further action.',
  status: 'Active',
  priority: 'High',
  triggerType: 'Scheduled',
  triggerCondition: {
    event: 'Fee overdue',
    timing: '3, 7, 15 days after due date',
    frequency: 'Multiple reminders'
  },
  recipients: [{ type: 'Parent', filter: 'All Contacts' }],
  variables: ['{Amount}', '{StudentName}', '{Class}', '{Days}'],
  lastModified: '2024-02-10',
  createdBy: 'Accounts',
  sentCount: 456,
  deliveryRate: 98.2,
  isDefault: true
},
{
  id: 9,
  name: 'PTM Reminder',
  category: 'General',
  subcategory: 'Meeting',
  content: 'Parent-Teacher Meeting for {Class} on {Date} at {Time}. Your presence is important for {StudentName}\'s progress. - {SchoolName}',
  status: 'Draft',
  priority: 'Medium',
  triggerType: 'Scheduled',
  triggerCondition: {
    event: 'PTM scheduled',
    timing: '3 days before event',
    frequency: 'Once'
  },
  recipients: [{ type: 'Parent', filter: 'Primary Contact' }],
  variables: ['{Class}', '{Date}', '{Time}', '{StudentName}', '{SchoolName}'],
  lastModified: '2024-03-01',
  createdBy: 'Admin',
  sentCount: 0,
  deliveryRate: 0,
  isDefault: false
},
{
  id: 10,
  name: 'Transport Route Change',
  category: 'Transport',
  subcategory: 'Route Change',
  content: 'Bus route for {StudentName} ({Class}) is temporarily changed from {Date}. New pickup time: {Time}. Contact transport desk for details.',
  status: 'Active',
  priority: 'High',
  triggerType: 'Manual',
  recipients: [{ type: 'Parent', filter: 'Transport Users' }],
  variables: ['{StudentName}', '{Class}', '{Date}', '{Time}'],
  lastModified: '2024-02-28',
  createdBy: 'Transport',
  sentCount: 85,
  deliveryRate: 99.0,
  isDefault: false
}];


export function SmsPredefinedAlerts() {
  const [templates, setTemplates] = useState<Template[]>(templatesData);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [triggerFilter, setTriggerFilter] = useState('all');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isVariableModalOpen, setIsVariableModalOpen] = useState(false);
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false);

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [infoContent, setInfoContent] = useState<InfoModalContent | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    content: '',
    status: 'Draft',
    priority: 'Medium',
    triggerType: 'Manual',
    triggerEvent: '',
    triggerTiming: '',
    triggerFrequency: '',
    recipientType: 'Parent',
    recipientFilter: 'Primary Contact'
  });

  const [testPhoneNumber, setTestPhoneNumber] = useState('');
  const [previewContent, setPreviewContent] = useState('');

  // Statistics
  const stats = {
    total: templates.length,
    active: templates.filter((t) => t.status === 'Active').length,
    inactive: templates.filter((t) => t.status === 'Inactive').length,
    draft: templates.filter((t) => t.status === 'Draft').length,
    automatic: templates.filter((t) => t.triggerType === 'Automatic').length,
    totalSent: templates.reduce((acc, t) => acc + t.sentCount, 0),
    avgDeliveryRate:
    templates.filter((t) => t.sentCount > 0).reduce((acc, t) => acc + t.deliveryRate, 0) /
    templates.filter((t) => t.sentCount > 0).length
  };

  // Filtered templates
  const filteredTemplates = templates.filter((t) => {
    const matchesSearch =
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesTrigger = triggerFilter === 'all' || t.triggerType === triggerFilter;
    return matchesSearch && matchesCategory && matchesStatus && matchesTrigger;
  });

  const handleOpenInfo = (content: InfoModalContent) => {
    setInfoContent(content);
    setIsInfoModalOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedTemplate(null);
    setFormData({
      name: '',
      category: '',
      subcategory: '',
      content: '',
      status: 'Draft',
      priority: 'Medium',
      triggerType: 'Manual',
      triggerEvent: '',
      triggerTiming: '',
      triggerFrequency: '',
      recipientType: 'Parent',
      recipientFilter: 'Primary Contact'
    });
    setIsCreateModalOpen(true);
  };

  const handleEdit = (template: Template) => {
    setSelectedTemplate(template);
    setFormData({
      name: template.name,
      category: template.category,
      subcategory: template.subcategory,
      content: template.content,
      status: template.status,
      priority: template.priority,
      triggerType: template.triggerType,
      triggerEvent: template.triggerCondition?.event || '',
      triggerTiming: template.triggerCondition?.timing || '',
      triggerFrequency: template.triggerCondition?.frequency || '',
      recipientType: template.recipients[0]?.type || 'Parent',
      recipientFilter: template.recipients[0]?.filter || 'Primary Contact'
    });
    setIsCreateModalOpen(true);
  };

  const handlePreview = (template: Template) => {
    setSelectedTemplate(template);
    // Replace variables with sample data
    let preview = template.content;
    variablesData.forEach((v) => {
      preview = preview.replace(new RegExp(v.name.replace(/[{}]/g, '\\$&'), 'g'), v.example);
    });
    setPreviewContent(preview);
    setIsPreviewModalOpen(true);
  };

  const handleTestSMS = (template: Template) => {
    setSelectedTemplate(template);
    setTestPhoneNumber('');
    setIsTestModalOpen(true);
  };

  const toggleStatus = (id: number) => {
    setTemplates(
      templates.map((t) =>
      t.id === id ?
      {
        ...t,
        status: t.status === 'Active' ? 'Inactive' : 'Active'
      } :
      t
      )
    );
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      setTemplates(templates.filter((t) => t.id !== id));
    }
  };

  const handleDuplicate = (template: Template) => {
    const newTemplate: Template = {
      ...template,
      id: Math.max(...templates.map((t) => t.id)) + 1,
      name: `${template.name} (Copy)`,
      status: 'Draft',
      isDefault: false,
      sentCount: 0,
      deliveryRate: 0,
      lastModified: new Date().toISOString().split('T')[0]
    };
    setTemplates([...templates, newTemplate]);
  };

  const insertVariable = (variable: string) => {
    setFormData({
      ...formData,
      content: formData.content + variable
    });
  };

  const columns = [
  {
    key: 'name',
    header: 'Template',
    render: (row: Template) =>
    <div className="flex items-start gap-3">
          <div
        className={`p-2 rounded-lg ${
        row.category === 'Attendance' ?
        'bg-blue-100' :
        row.category === 'Fee & Finance' ?
        'bg-emerald-100' :
        row.category === 'Examination' ?
        'bg-purple-100' :
        row.category === 'Emergency' ?
        'bg-red-100' :
        row.category === 'Transport' ?
        'bg-cyan-100' :
        'bg-amber-100'}`
        }>

            <MessageSquareIcon
          className={`w-4 h-4 ${
          row.category === 'Attendance' ?
          'text-blue-600' :
          row.category === 'Fee & Finance' ?
          'text-emerald-600' :
          row.category === 'Examination' ?
          'text-purple-600' :
          row.category === 'Emergency' ?
          'text-red-600' :
          row.category === 'Transport' ?
          'text-cyan-600' :
          'text-amber-600'}`
          } />

          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{row.name}</span>
              {row.isDefault &&
          <Badge variant="secondary" className="text-xs">
                  Default
                </Badge>
          }
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {row.category}
              </Badge>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500">{row.subcategory}</span>
            </div>
          </div>
        </div>

  },
  {
    key: 'content',
    header: 'Message Preview',
    render: (row: Template) =>
    <div className="max-w-xs">
          <p className="text-sm text-gray-600 truncate" title={row.content}>
            {row.content}
          </p>
          <div className="flex items-center gap-1 mt-1">
            {row.variables.slice(0, 3).map((v) =>
        <span key={v} className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                {v}
              </span>
        )}
            {row.variables.length > 3 &&
        <span className="text-xs text-gray-400">+{row.variables.length - 3} more</span>
        }
          </div>
        </div>

  },
  {
    key: 'trigger',
    header: 'Trigger',
    render: (row: Template) =>
    <div>
          <Badge
        variant={
        row.triggerType === 'Automatic' ?
        'success' :
        row.triggerType === 'Scheduled' ?
        'warning' :
        'secondary'
        }>

            {row.triggerType === 'Automatic' && <ZapIcon className="w-3 h-3 mr-1" />}
            {row.triggerType === 'Scheduled' && <ClockIcon className="w-3 h-3 mr-1" />}
            {row.triggerType === 'Manual' && <PlayIcon className="w-3 h-3 mr-1" />}
            {row.triggerType}
          </Badge>
          {row.triggerCondition &&
      <p className="text-xs text-gray-500 mt-1 max-w-32 truncate" title={row.triggerCondition.timing}>
              {row.triggerCondition.timing}
            </p>
      }
        </div>

  },
  {
    key: 'priority',
    header: 'Priority',
    render: (row: Template) =>
    <Badge
      variant={
      row.priority === 'High' ? 'danger' : row.priority === 'Medium' ? 'warning' : 'secondary'
      }>

          {row.priority}
        </Badge>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: Template) =>
    <Badge
      variant={
      row.status === 'Active' ? 'success' : row.status === 'Inactive' ? 'secondary' : 'warning'
      }>

          {row.status === 'Active' && <CheckCircleIcon className="w-3 h-3 mr-1" />}
          {row.status === 'Inactive' && <PauseIcon className="w-3 h-3 mr-1" />}
          {row.status === 'Draft' && <Edit2 className="w-3 h-3 mr-1" />}
          {row.status}
        </Badge>

  },
  {
    key: 'stats',
    header: 'Statistics',
    render: (row: Template) =>
    <div>
          <div className="flex items-center gap-1">
            <SendIcon className="w-3 h-3 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">
              {row.sentCount.toLocaleString()}
            </span>
          </div>
          {row.sentCount > 0 &&
      <div className="flex items-center gap-1 mt-0.5">
              <TrendingUpIcon className="w-3 h-3 text-emerald-500" />
              <span className="text-xs text-emerald-600">{row.deliveryRate}% delivered</span>
            </div>
      }
        </div>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: Template) =>
    <div className="flex gap-1">
          <Button variant="ghost" size="sm" title="Preview" onClick={() => handlePreview(row)}>
            <EyeIcon className="w-4 h-4 text-blue-600" />
          </Button>
          <Button variant="ghost" size="sm" title="Test SMS" onClick={() => handleTestSMS(row)}>
            <SmartphoneIcon className="w-4 h-4 text-purple-600" />
          </Button>
          <Button variant="ghost" size="sm" title="Edit" onClick={() => handleEdit(row)}>
            <Edit2 className="w-4 h-4 text-gray-600" />
          </Button>
          <Button variant="ghost" size="sm" title="Duplicate" onClick={() => handleDuplicate(row)}>
            <CopyIcon className="w-4 h-4 text-gray-600" />
          </Button>
          <Button
        variant="ghost"
        size="sm"
        title={row.status === 'Active' ? 'Deactivate' : 'Activate'}
        onClick={() => toggleStatus(row.id)}>

            <Power
          className={`w-4 h-4 ${row.status === 'Active' ? 'text-green-600' : 'text-gray-400'}`} />

          </Button>
          {!row.isDefault &&
      <Button variant="ghost" size="sm" title="Delete" onClick={() => handleDelete(row.id)}>
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
      }
        </div>

  }];


  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquareIcon className="w-6 h-6 text-blue-600" />
            SMS Predefined Alerts
          </h1>
          <p className="text-gray-500 mt-1">
            Manage automated SMS templates, triggers, and alert configurations
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
            handleOpenInfo({
              title: 'About SMS Predefined Alerts',
              description:
              'SMS Predefined Alerts allow you to create and manage automated message templates that are sent to parents and staff based on specific events or schedules.',
              tips: [
              'Use Automatic triggers for real-time alerts like attendance',
              'Use Scheduled triggers for reminders like fee due dates',
              'Use Manual triggers for one-time announcements',
              'Always test SMS before activating a new template',
              'Keep messages concise - SMS has character limits',
              'Use variables to personalize messages']

            })
            }>

            <InfoIcon className="w-4 h-4 mr-2" />
            How It Works
          </Button>
          <Button variant="outline" onClick={() => setIsVariableModalOpen(true)}>
            <TagIcon className="w-4 h-4 mr-2" />
            Variables
          </Button>
          <Button variant="outline" onClick={() => setIsHistoryPanelOpen(true)}>
            <HistoryIcon className="w-4 h-4 mr-2" />
            History
          </Button>
          <Button variant="primary" onClick={handleCreateNew}>
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <LayersIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Total Templates</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Active</p>
              <p className="text-xl font-bold text-emerald-600">{stats.active}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <PauseIcon className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Inactive</p>
              <p className="text-xl font-bold text-gray-600">{stats.inactive}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Edit2 className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Drafts</p>
              <p className="text-xl font-bold text-amber-600">{stats.draft}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <ZapIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Automatic</p>
              <p className="text-xl font-bold text-purple-600">{stats.automatic}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-50 rounded-lg">
              <SendIcon className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Total Sent</p>
              <p className="text-xl font-bold text-cyan-600">{stats.totalSent.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-50 rounded-lg">
              <TrendingUpIcon className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Delivery Rate</p>
              <p className="text-xl font-bold text-teal-600">{stats.avgDeliveryRate.toFixed(1)}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Category Overview */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <TagIcon className="w-4 h-4 text-gray-500" />
            Categories
          </h3>
          <button
            onClick={() =>
            handleOpenInfo({
              title: 'Template Categories',
              description:
              'Templates are organized into categories based on their purpose. Each category has specific subcategories for better organization.',
              tips: [
              'Attendance alerts should be sent same-day for relevance',
              'Fee alerts should have escalating reminders',
              'Emergency alerts should reach all contacts immediately',
              'Exam alerts should be sent well in advance']

            })
            }
            className="p-1 hover:bg-gray-100 rounded">

            <InfoIcon className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categoriesData.map((category) =>
          <button
            key={category.id}
            onClick={() => setCategoryFilter(category.name)}
            className={`p-3 rounded-xl border transition-all hover:shadow-md ${
            categoryFilter === category.name ?
            'border-blue-300 bg-blue-50' :
            'border-gray-200 hover:border-gray-300'}`
            }>

              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg ${category.color} bg-opacity-10`}>
                  <category.icon className={`w-4 h-4 ${category.color.replace('bg-', 'text-')}`} />
                </div>
                <span className="font-medium text-gray-900 text-sm">{category.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{category.count} templates</span>
                <span className="text-xs text-gray-400">{category.subcategories.length} types</span>
              </div>
            </button>
          )}
        </div>
      </Card>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
              className="w-64" />

            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={[
              { value: 'all', label: 'All Categories' },
              ...categoriesData.map((c) => ({ value: c.name, label: c.name }))]
              } />

            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
              { value: 'all', label: 'All Status' },
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
              { value: 'Draft', label: 'Draft' }]
              } />

            <Select
              value={triggerFilter}
              onChange={(e) => setTriggerFilter(e.target.value)}
              options={[
              { value: 'all', label: 'All Triggers' },
              { value: 'Automatic', label: 'Automatic' },
              { value: 'Scheduled', label: 'Scheduled' },
              { value: 'Manual', label: 'Manual' }]
              } />

          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
                setStatusFilter('all');
                setTriggerFilter('all');
              }}>

              <RefreshCwIcon className="w-4 h-4 mr-1" />
              Reset
            </Button>
            <Button variant="outline" size="sm">
              <DownloadIcon className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Templates Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Showing {filteredTemplates.length} of {templates.length} templates
          </span>
        </div>
        <Table columns={columns} data={filteredTemplates} />
      </Card>

      {/* Create/Edit Modal */}
      {isCreateModalOpen &&
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                {selectedTemplate ? 'Edit Template' : 'Create New Template'}
              </h2>
              <button
              onClick={() => setIsCreateModalOpen(false)}
              className="p-1 hover:bg-gray-100 rounded">

                <XIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <InfoIcon className="w-4 h-4 text-blue-500" />
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                  label="Template Name"
                  placeholder="e.g., Daily Absence Alert"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} />

                  <Select
                  label="Priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  options={[
                  { value: 'High', label: 'High Priority' },
                  { value: 'Medium', label: 'Medium Priority' },
                  { value: 'Low', label: 'Low Priority' }]
                  } />

                  <Select
                  label="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value, subcategory: '' })}
                  options={[
                  { value: '', label: 'Select Category' },
                  ...categoriesData.map((c) => ({ value: c.name, label: c.name }))]
                  } />

                  <Select
                  label="Subcategory"
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  options={[
                  { value: '', label: 'Select Subcategory' },
                  ...(categoriesData.
                  find((c) => c.name === formData.category)?.
                  subcategories.map((s) => ({ value: s, label: s })) || [])]
                  } />

                </div>
              </div>

              {/* Message Content */}
              <div>
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <MessageSquareIcon className="w-4 h-4 text-blue-500" />
                  Message Content
                </h4>
                <div className="space-y-3">
                  <Textarea
                  label="SMS Content"
                  placeholder="Type your message here. Use {Variable} for dynamic data."
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })} />

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      Characters: {formData.content.length} / 160 (
                      {Math.ceil(formData.content.length / 160)} SMS)
                    </span>
                    <button
                    onClick={() => setIsVariableModalOpen(true)}
                    className="text-blue-600 hover:underline">

                      Insert Variable
                    </button>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs font-medium text-blue-800 mb-2">Quick Variables:</p>
                    <div className="flex flex-wrap gap-1">
                      {variablesData.slice(0, 8).map((v) =>
                    <button
                      key={v.name}
                      onClick={() => insertVariable(v.name)}
                      className="px-2 py-1 bg-white border border-blue-200 rounded text-xs text-blue-700 hover:bg-blue-100">

                          {v.name}
                        </button>
                    )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Trigger Configuration */}
              <div>
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <ZapIcon className="w-4 h-4 text-blue-500" />
                  Trigger Configuration
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select
                  label="Trigger Type"
                  value={formData.triggerType}
                  onChange={(e) => setFormData({ ...formData, triggerType: e.target.value })}
                  options={[
                  { value: 'Manual', label: 'Manual - Send on demand' },
                  { value: 'Automatic', label: 'Automatic - Event triggered' },
                  { value: 'Scheduled', label: 'Scheduled - Time based' }]
                  } />

                  {formData.triggerType !== 'Manual' &&
                <>
                      <Input
                    label="Trigger Event"
                    placeholder="e.g., Student marked absent"
                    value={formData.triggerEvent}
                    onChange={(e) => setFormData({ ...formData, triggerEvent: e.target.value })} />

                      <Input
                    label="Timing"
                    placeholder="e.g., Same day at 11:00 AM"
                    value={formData.triggerTiming}
                    onChange={(e) => setFormData({ ...formData, triggerTiming: e.target.value })} />

                    </>
                }
                </div>
                {formData.triggerType !== 'Manual' &&
              <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-100">
                    <div className="flex items-start gap-2">
                      <AlertCircleIcon className="w-4 h-4 text-amber-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">Trigger Information</p>
                        <p className="text-xs text-amber-700 mt-1">
                          {formData.triggerType === 'Automatic' ?
                      'Automatic triggers send SMS immediately when the specified event occurs in the system.' :
                      'Scheduled triggers send SMS at specified times/dates, useful for reminders.'}
                        </p>
                      </div>
                    </div>
                  </div>
              }
              </div>

              {/* Recipients */}
              <div>
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <UsersIcon className="w-4 h-4 text-blue-500" />
                  Recipients
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                  label="Recipient Type"
                  value={formData.recipientType}
                  onChange={(e) => setFormData({ ...formData, recipientType: e.target.value })}
                  options={[
                  { value: 'Parent', label: 'Parents' },
                  { value: 'Staff', label: 'Staff' },
                  { value: 'Both', label: 'Both Parents & Staff' }]
                  } />

                  <Select
                  label="Filter"
                  value={formData.recipientFilter}
                  onChange={(e) => setFormData({ ...formData, recipientFilter: e.target.value })}
                  options={[
                  { value: 'Primary Contact', label: 'Primary Contact Only' },
                  { value: 'All Contacts', label: 'All Registered Contacts' },
                  { value: 'Class-wise', label: 'Class-wise Selection' },
                  { value: 'Transport Users', label: 'Transport Users Only' }]
                  } />

                </div>
              </div>

              {/* Status */}
              <div>
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <SettingsIcon className="w-4 h-4 text-blue-500" />
                  Status
                </h4>
                <Select
                label="Template Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                options={[
                { value: 'Draft', label: 'Draft - Not active, for testing' },
                { value: 'Active', label: 'Active - Will send SMS' },
                { value: 'Inactive', label: 'Inactive - Temporarily disabled' }]
                } />

              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-between">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <div className="flex gap-2">
                <Button variant="outline">
                  <EyeIcon className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button variant="primary" onClick={() => setIsCreateModalOpen(false)}>
                  {selectedTemplate ? 'Update Template' : 'Create Template'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Preview Modal */}
      {isPreviewModalOpen && selectedTemplate &&
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Message Preview</h2>
              <button
              onClick={() => setIsPreviewModalOpen(false)}
              className="p-1 hover:bg-gray-100 rounded">

                <XIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-gray-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <MessageSquareIcon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">School SMS</p>
                    <p className="text-xs text-gray-500">Now</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-3 shadow-sm">
                  <p className="text-sm text-gray-800 leading-relaxed">{previewContent}</p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700">
                  <strong>Template:</strong> {selectedTemplate.name}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  <strong>Variables used:</strong> {selectedTemplate.variables.join(', ')}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  <strong>Character count:</strong> {previewContent.length} (
                  {Math.ceil(previewContent.length / 160)} SMS)
                </p>
              </div>
            </div>

            <div className="border-t px-6 py-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsPreviewModalOpen(false)}>
                Close
              </Button>
              <Button
              variant="primary"
              onClick={() => {
                setIsPreviewModalOpen(false);
                handleTestSMS(selectedTemplate);
              }}>

                <SmartphoneIcon className="w-4 h-4 mr-2" />
                Send Test
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Test SMS Modal */}
      {isTestModalOpen && selectedTemplate &&
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Send Test SMS</h2>
              <button
              onClick={() => setIsTestModalOpen(false)}
              className="p-1 hover:bg-gray-100 rounded">

                <XIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                <div className="flex items-start gap-2">
                  <AlertCircleIcon className="w-4 h-4 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Test Mode</p>
                    <p className="text-xs text-amber-700 mt-1">
                      This will send a test SMS with sample data. Variables will be replaced with
                      example values.
                    </p>
                  </div>
                </div>
              </div>

              <Input
              label="Mobile Number"
              placeholder="Enter 10-digit mobile number"
              value={testPhoneNumber}
              onChange={(e) => setTestPhoneNumber(e.target.value)}
              leftIcon={<SmartphoneIcon className="w-4 h-4 text-gray-400" />} />


              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-600 mb-2">Message Preview:</p>
                <p className="text-sm text-gray-700">{selectedTemplate.content}</p>
              </div>

              <div className="text-xs text-gray-500">
                <strong>Note:</strong> Test SMS will be deducted from your SMS balance.
              </div>
            </div>

            <div className="border-t px-6 py-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsTestModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" disabled={testPhoneNumber.length !== 10}>
                <SendIcon className="w-4 h-4 mr-2" />
                Send Test SMS
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Variables Reference Modal */}
      {isVariableModalOpen &&
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Available Variables</h2>
              <button
              onClick={() => setIsVariableModalOpen(false)}
              className="p-1 hover:bg-gray-100 rounded">

                <XIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <p className="text-sm text-gray-600 mb-4">
                Use these variables in your SMS templates. They will be replaced with actual data
                when the message is sent.
              </p>

              <div className="space-y-2">
                {variablesData.map((variable) =>
              <div
                key={variable.name}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <code className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-sm font-mono">
                          {variable.name}
                        </code>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{variable.description}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Example: {variable.example}</p>
                    </div>
                    <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(variable.name);
                  }}>

                      <CopyIcon className="w-4 h-4" />
                    </Button>
                  </div>
              )}
              </div>
            </div>

            <div className="border-t px-6 py-4 flex justify-end">
              <Button variant="primary" onClick={() => setIsVariableModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Info Modal */}
      {isInfoModalOpen && infoContent &&
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            <div className="border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <InfoIcon className="w-5 h-5 text-blue-600" />
                {infoContent.title}
              </h2>
              <button
              onClick={() => setIsInfoModalOpen(false)}
              className="p-1 hover:bg-gray-100 rounded">

                <XIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-700 leading-relaxed">{infoContent.description}</p>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-bold text-blue-800 mb-2">Tips & Best Practices</h4>
                <ul className="space-y-2">
                  {infoContent.tips.map((tip, idx) =>
                <li key={idx} className="flex items-start gap-2 text-sm text-blue-700">
                      <CheckCircleIcon className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                      {tip}
                    </li>
                )}
                </ul>
              </div>
            </div>

            <div className="border-t px-6 py-4 flex justify-end">
              <Button variant="primary" onClick={() => setIsInfoModalOpen(false)}>
                Got It
              </Button>
            </div>
          </div>
        </div>
      }

      {/* History Panel */}
      {isHistoryPanelOpen &&
      <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-gray-900">SMS History</h2>
              <button
              onClick={() => setIsHistoryPanelOpen(false)}
              className="p-1 hover:bg-gray-100 rounded">

                <XIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex gap-2">
                <Input placeholder="Search messages..." className="flex-1" />
                <Select
                options={[
                { value: 'all', label: 'All' },
                { value: 'delivered', label: 'Delivered' },
                { value: 'failed', label: 'Failed' }]
                } />

              </div>

              <div className="space-y-3">
                {[
              {
                template: 'Daily Absence Alert',
                recipient: '+91 98765 43210',
                status: 'Delivered',
                time: '10:32 AM',
                date: 'Today'
              },
              {
                template: 'Fee Due Reminder',
                recipient: '+91 98765 43211',
                status: 'Delivered',
                time: '09:00 AM',
                date: 'Today'
              },
              {
                template: 'Fee Payment Confirmation',
                recipient: '+91 98765 43212',
                status: 'Delivered',
                time: '03:45 PM',
                date: 'Yesterday'
              },
              {
                template: 'Daily Absence Alert',
                recipient: '+91 98765 43213',
                status: 'Failed',
                time: '10:30 AM',
                date: 'Yesterday'
              },
              {
                template: 'Exam Schedule Notification',
                recipient: '+91 98765 43214',
                status: 'Delivered',
                time: '11:00 AM',
                date: '2 days ago'
              }].
              map((item, idx) =>
              <div key={idx} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{item.template}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{item.recipient}</p>
                      </div>
                      <Badge variant={item.status === 'Delivered' ? 'success' : 'danger'}>
                        {item.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      {item.date} at {item.time}
                    </p>
                  </div>
              )}
              </div>

              <div className="text-center">
                <Button variant="outline" size="sm">
                  Load More
                </Button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}