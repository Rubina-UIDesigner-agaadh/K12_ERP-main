import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  Search,
  Mail,
  Smartphone,
  Bell,
  CheckCircle,
  Copy,
  Play,
  Check,
  X } from
'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Tabs } from '../../../components/ui/Tabs';
interface MessageTemplate {
  id: string;
  name: string;
  category: string;
  channels: ('SMS' | 'Email' | 'App' | 'WhatsApp')[];
  emailSubject?: string;
  emailBody?: string;
  smsBody?: string;
  notificationTitle?: string;
  notificationBody?: string;
  isActive: boolean;
  language: string;
  usageCount: number;
  dltId?: string;
  senderId?: string;
}
const MOCK_TEMPLATES: MessageTemplate[] = [
{
  id: 'TMP001',
  name: 'Fee Due Reminder',
  category: 'Fee',
  channels: ['SMS', 'Email'],
  emailSubject: 'Fee Payment Reminder for {{student_name}}',
  emailBody:
  'Dear Parent,\n\nThis is a gentle reminder that the fee of Rs. {{fee_amount}} for your ward {{student_name}} (Class: {{class_section}}) is due on {{due_date}}.\n\nPlease pay online via the parent portal or visit the school office.\n\nRegards,\n{{school_name}}',
  smsBody:
  'Dear Parent, fee of Rs. {{fee_amount}} for {{student_name}} is due on {{due_date}}. Please pay to avoid late fees. - {{school_name}}',
  isActive: true,
  language: 'English',
  usageCount: 1250,
  dltId: '10074589632145',
  senderId: 'SCHFEE'
},
{
  id: 'TMP002',
  name: 'Absent Alert',
  category: 'Attendance',
  channels: ['SMS', 'App'],
  smsBody:
  'Alert: {{student_name}} was marked absent today ({{date}}). Please contact class teacher if this is an error. - {{school_name}}',
  notificationTitle: 'Attendance Alert',
  notificationBody:
  '{{student_name}} has been marked absent for today, {{date}}.',
  isActive: true,
  language: 'English',
  usageCount: 450,
  dltId: '10074589632146',
  senderId: 'SCHATT'
},
{
  id: 'TMP003',
  name: 'Exam Schedule',
  category: 'Exam',
  channels: ['Email'],
  emailSubject: 'Exam Schedule Published: {{exam_name}}',
  emailBody:
  'Dear Parent,\n\nThe exam schedule for {{exam_name}} has been published. You can view and download the detailed timetable from the parent portal.\n\nBest wishes,\n{{school_name}}',
  isActive: true,
  language: 'English',
  usageCount: 0
}];

const PLACEHOLDERS = [
{
  tag: '{{student_name}}',
  label: 'Student Name'
},
{
  tag: '{{class_section}}',
  label: 'Class & Section'
},
{
  tag: '{{roll_no}}',
  label: 'Roll No'
},
{
  tag: '{{parent_name}}',
  label: 'Parent Name'
},
{
  tag: '{{school_name}}',
  label: 'School Name'
},
{
  tag: '{{branch_name}}',
  label: 'Branch Name'
},
{
  tag: '{{date}}',
  label: 'Current Date'
},
{
  tag: '{{month}}',
  label: 'Current Month'
},
{
  tag: '{{academic_year}}',
  label: 'Academic Year'
},
{
  tag: '{{fee_amount}}',
  label: 'Fee Amount'
},
{
  tag: '{{due_date}}',
  label: 'Due Date'
},
{
  tag: '{{receipt_no}}',
  label: 'Receipt No'
},
{
  tag: '{{exam_name}}',
  label: 'Exam Name'
},
{
  tag: '{{marks_obtained}}',
  label: 'Marks Obtained'
},
{
  tag: '{{grade}}',
  label: 'Grade'
}];

export function StudentSmsTemplate() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<MessageTemplate[]>(MOCK_TEMPLATES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  // Form State
  const [currentTemplate, setCurrentTemplate] = useState<
    Partial<MessageTemplate>>(
    {
      channels: ['SMS'],
      isActive: true,
      language: 'English'
    });
  const handleSave = () => {
    // Logic to save template
    setIsModalOpen(false);
  };
  const insertPlaceholder = (
  tag: string,
  field: 'emailBody' | 'smsBody' | 'notificationBody') =>
  {
    // Logic to insert placeholder at cursor position would go here
    // For now just appending
    setCurrentTemplate((prev) => ({
      ...prev,
      [field]: (prev[field] || '') + tag
    }));
  };
  const columns = [
  {
    key: 'name',
    header: 'Template Name',
    render: (row: MessageTemplate) =>
    <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-xs text-gray-500">
            {row.id} • {row.language}
          </div>
        </div>

  },
  {
    key: 'category',
    header: 'Category',
    render: (row: MessageTemplate) =>
    <Badge variant="outline">{row.category}</Badge>

  },
  {
    key: 'channels',
    header: 'Channels',
    render: (row: MessageTemplate) =>
    <div className="flex gap-1">
          {row.channels.includes('SMS') &&
      <div className="p-1 bg-blue-50 text-blue-600 rounded" title="SMS">
              <Smartphone className="w-3 h-3" />
            </div>
      }
          {row.channels.includes('Email') &&
      <div
        className="p-1 bg-purple-50 text-purple-600 rounded"
        title="Email">

              <Mail className="w-3 h-3" />
            </div>
      }
          {row.channels.includes('App') &&
      <div
        className="p-1 bg-green-50 text-green-600 rounded"
        title="App Notification">

              <Bell className="w-3 h-3" />
            </div>
      }
          {row.channels.includes('WhatsApp') &&
      <div
        className="p-1 bg-green-100 text-green-700 rounded"
        title="WhatsApp">

              <MessageSquare className="w-3 h-3" />
            </div>
      }
        </div>

  },
  {
    key: 'usage',
    header: 'Usage',
    render: (row: MessageTemplate) =>
    <span className="text-sm text-gray-600">{row.usageCount} times</span>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: MessageTemplate) =>
    <Badge variant={row.isActive ? 'success' : 'default'}>
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: MessageTemplate) =>
    <div className="flex gap-2">
          <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsTestModalOpen(true)}
        title="Test Send">

            <Play className="w-4 h-4 text-blue-600" />
          </Button>
          <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setCurrentTemplate(row);
          setIsModalOpen(true);
        }}>

            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Copy className="w-4 h-4" />
          </Button>
        </div>

  }];

  const filteredTemplates = templates.filter(
    (t) =>
    (selectedCategory === 'All' || t.category === selectedCategory) && (
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.content?.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/student-settings')}>

            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Student SMS/Email Template Setup
            </h1>
            <p className="text-gray-500">
              Manage communication templates for automated notifications
            </p>
          </div>
        </div>
        <Button
          onClick={() => {
            setCurrentTemplate({
              channels: ['SMS'],
              isActive: true,
              language: 'English'
            });
            setIsModalOpen(true);
          }}>

          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search templates..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} />

          </div>
          <div className="w-full md:w-48">
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              options={[
              {
                value: 'All',
                label: 'All Categories'
              },
              {
                value: 'Fee',
                label: 'Fee'
              },
              {
                value: 'Attendance',
                label: 'Attendance'
              },
              {
                value: 'Exam',
                label: 'Exam'
              },
              {
                value: 'Transport',
                label: 'Transport'
              },
              {
                value: 'General',
                label: 'General'
              },
              {
                value: 'Homework',
                label: 'Homework'
              }]
              } />

          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <Table columns={columns} data={filteredTemplates} />
      </Card>

      {/* Create/Edit Template Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentTemplate.id ? 'Edit Template' : 'Create Message Template'}
        size="xl"
        footer={
        <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Template</Button>
          </>
        }>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {/* Basic Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Template Name"
              placeholder="e.g. Fee Reminder"
              value={currentTemplate.name}
              onChange={(e) =>
              setCurrentTemplate({
                ...currentTemplate,
                name: e.target.value
              })
              } />

            <Select
              label="Category"
              value={currentTemplate.category}
              onChange={(e) =>
              setCurrentTemplate({
                ...currentTemplate,
                category: e.target.value
              })
              }
              options={[
              {
                value: 'Fee',
                label: 'Fee'
              },
              {
                value: 'Attendance',
                label: 'Attendance'
              },
              {
                value: 'Exam',
                label: 'Exam'
              },
              {
                value: 'Transport',
                label: 'Transport'
              },
              {
                value: 'General',
                label: 'General'
              },
              {
                value: 'Login Credentials',
                label: 'Login Credentials'
              },
              {
                value: 'OTP',
                label: 'OTP'
              },
              {
                value: 'Circular',
                label: 'Circular'
              },
              {
                value: 'Homework',
                label: 'Homework'
              },
              {
                value: 'Event',
                label: 'Event'
              }]
              } />

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Channels
            </label>
            <div className="flex flex-wrap gap-4">
              {['SMS', 'Email', 'App', 'WhatsApp'].map((channel) =>
              <label
                key={channel}
                className={`flex items-center gap-2 cursor-pointer border p-3 rounded-lg flex-1 min-w-[120px] hover:bg-gray-50 ${currentTemplate.channels?.includes(channel as any) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>

                  <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600"
                  checked={currentTemplate.channels?.includes(channel as any)}
                  onChange={(e) => {
                    const newChannels = e.target.checked ?
                    [...(currentTemplate.channels || []), channel] :
                    (currentTemplate.channels || []).filter(
                      (c) => c !== channel
                    );
                    setCurrentTemplate({
                      ...currentTemplate,
                      channels: newChannels as any
                    });
                  }} />

                  {channel === 'SMS' &&
                <Smartphone className="w-4 h-4 text-gray-500" />
                }
                  {channel === 'Email' &&
                <Mail className="w-4 h-4 text-gray-500" />
                }
                  {channel === 'App' &&
                <Bell className="w-4 h-4 text-gray-500" />
                }
                  {channel === 'WhatsApp' &&
                <MessageSquare className="w-4 h-4 text-gray-500" />
                }
                  <span className="text-sm font-medium">{channel}</span>
                </label>
              )}
            </div>
          </div>

          <Tabs
            tabs={[
            ...(currentTemplate.channels?.includes('SMS') ?
            [
            {
              id: 'sms',
              label: 'SMS Content',
              content:
              <div className="space-y-4 pt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                    label="DLT Template ID"
                    placeholder="Required for compliance"
                    value={currentTemplate.dltId}
                    onChange={(e) =>
                    setCurrentTemplate({
                      ...currentTemplate,
                      dltId: e.target.value
                    })
                    } />

                            <Input
                    label="Sender ID / Header"
                    placeholder="e.g. SCHLNM"
                    value={currentTemplate.senderId}
                    onChange={(e) =>
                    setCurrentTemplate({
                      ...currentTemplate,
                      senderId: e.target.value
                    })
                    } />

                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <label className="block text-sm font-medium text-gray-700">
                                SMS Body
                              </label>
                              <span className="text-xs text-gray-500">
                                {(currentTemplate.smsBody || '').length} chars (
                                {Math.ceil(
                        (currentTemplate.smsBody || '').length / 160
                      )}{' '}
                                credits)
                              </span>
                            </div>
                            <textarea
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border h-32"
                    placeholder="Type your SMS content here..."
                    value={currentTemplate.smsBody}
                    onChange={(e) =>
                    setCurrentTemplate({
                      ...currentTemplate,
                      smsBody: e.target.value
                    })
                    }>
                  </textarea>
                          </div>
                          <div className="p-3 bg-gray-50 rounded border border-gray-200">
                            <p className="text-xs font-medium text-gray-700 mb-2">
                              Insert Placeholders:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {PLACEHOLDERS.map((p) =>
                    <button
                      key={p.tag}
                      onClick={() =>
                      insertPlaceholder(p.tag, 'smsBody')
                      }
                      className="text-xs bg-white px-2 py-1 rounded border border-gray-300 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      title={p.label}>

                                  {p.tag}
                                </button>
                    )}
                            </div>
                          </div>
                        </div>

            }] :

            []),
            ...(currentTemplate.channels?.includes('Email') ?
            [
            {
              id: 'email',
              label: 'Email Content',
              content:
              <div className="space-y-4 pt-4">
                          <Input
                  label="Subject Line"
                  placeholder="e.g. Important Notice: Fee Due"
                  value={currentTemplate.emailSubject}
                  onChange={(e) =>
                  setCurrentTemplate({
                    ...currentTemplate,
                    emailSubject: e.target.value
                  })
                  } />

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email Body (Rich Text)
                            </label>
                            <div className="border border-gray-300 rounded-md">
                              <div className="bg-gray-50 p-2 border-b border-gray-300 flex gap-2">
                                <button className="p-1 hover:bg-gray-200 rounded font-bold">
                                  B
                                </button>
                                <button className="p-1 hover:bg-gray-200 rounded italic">
                                  I
                                </button>
                                <button className="p-1 hover:bg-gray-200 rounded underline">
                                  U
                                </button>
                              </div>
                              <textarea
                      className="w-full border-0 rounded-b-md shadow-none focus:ring-0 sm:text-sm p-3 h-48 resize-y"
                      placeholder="Type your email content here..."
                      value={currentTemplate.emailBody}
                      onChange={(e) =>
                      setCurrentTemplate({
                        ...currentTemplate,
                        emailBody: e.target.value
                      })
                      }>
                    </textarea>
                            </div>
                          </div>
                          <div className="p-3 bg-gray-50 rounded border border-gray-200">
                            <p className="text-xs font-medium text-gray-700 mb-2">
                              Insert Placeholders:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {PLACEHOLDERS.map((p) =>
                    <button
                      key={p.tag}
                      onClick={() =>
                      insertPlaceholder(p.tag, 'emailBody')
                      }
                      className="text-xs bg-white px-2 py-1 rounded border border-gray-300 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      title={p.label}>

                                  {p.tag}
                                </button>
                    )}
                            </div>
                          </div>
                        </div>

            }] :

            []),
            ...(currentTemplate.channels?.includes('App') ?
            [
            {
              id: 'app',
              label: 'App Notification',
              content:
              <div className="space-y-4 pt-4">
                          <Input
                  label="Notification Title"
                  placeholder="e.g. Fee Alert"
                  value={currentTemplate.notificationTitle}
                  onChange={(e) =>
                  setCurrentTemplate({
                    ...currentTemplate,
                    notificationTitle: e.target.value
                  })
                  } />

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Notification Body
                            </label>
                            <textarea
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border h-24"
                    placeholder="Short notification text..."
                    value={currentTemplate.notificationBody}
                    onChange={(e) =>
                    setCurrentTemplate({
                      ...currentTemplate,
                      notificationBody: e.target.value
                    })
                    }>
                  </textarea>
                          </div>
                          <div className="p-3 bg-gray-50 rounded border border-gray-200">
                            <p className="text-xs font-medium text-gray-700 mb-2">
                              Insert Placeholders:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {PLACEHOLDERS.map((p) =>
                    <button
                      key={p.tag}
                      onClick={() =>
                      insertPlaceholder(p.tag, 'notificationBody')
                      }
                      className="text-xs bg-white px-2 py-1 rounded border border-gray-300 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      title={p.label}>

                                  {p.tag}
                                </button>
                    )}
                            </div>
                          </div>
                        </div>

            }] :

            [])]
            } />


          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <Select
              label="Language"
              value={currentTemplate.language}
              onChange={(e) =>
              setCurrentTemplate({
                ...currentTemplate,
                language: e.target.value
              })
              }
              options={[
              {
                value: 'English',
                label: 'English'
              },
              {
                value: 'Hindi',
                label: 'Hindi'
              },
              {
                value: 'Marathi',
                label: 'Marathi'
              },
              {
                value: 'Gujarati',
                label: 'Gujarati'
              }]
              } />

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600"
                  checked={currentTemplate.isActive}
                  onChange={(e) =>
                  setCurrentTemplate({
                    ...currentTemplate,
                    isActive: e.target.checked
                  })
                  } />

                <span className="text-sm text-gray-700">Active Template</span>
              </label>
            </div>
          </div>
        </div>
      </Modal>

      {/* Test Send Modal */}
      <Modal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        title="Test Send Template"
        size="md"
        footer={
        <>
            <Button variant="outline" onClick={() => setIsTestModalOpen(false)}>
              Cancel
            </Button>
            <Button>Send Test</Button>
          </>
        }>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Send a test message to verify the template formatting and
            placeholders. Placeholders will be replaced with dummy data.
          </p>
          <Input label="Test Mobile Number" placeholder="+91 9876543210" />
          <Input label="Test Email Address" placeholder="test@example.com" />
        </div>
      </Modal>
    </div>);

}