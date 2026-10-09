import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Table } from '../../../components/ui/Table';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent } from
'../../../components/ui/Tabs';
import {
  SendIcon,
  BookIcon,
  UserIcon,
  UsersIcon,
  LayoutGridIcon,
  PaperclipIcon,
  BellIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertTriangleIcon,
  MessageSquareIcon,
  DownloadIcon,
  SearchIcon,
  FilterIcon,
  RefreshCwIcon,
  EyeIcon,
  MailIcon,
  SmartphoneIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  StarIcon,
  AlertCircleIcon,
  FileTextIcon,
  ImageIcon,
  XCircleIcon } from
'lucide-react';
const today = new Date().toISOString().split('T')[0];
type RecipientMode = 'single' | 'multiple' | 'class';
type MessageCategory =
'Academic Update' |
'Behaviour Update' |
'Homework Reminder' |
'Appreciation' |
'General Note' |
'Urgent Notice';
const categoryConfig: Record<
  MessageCategory,
  {
    color: string;
    bg: string;
    icon: React.ReactNode;
  }> =
{
  'Academic Update': {
    color: 'text-blue-700',
    bg: 'bg-blue-50 border-blue-300',
    icon: <BookIcon className="w-4 h-4" />
  },
  'Behaviour Update': {
    color: 'text-orange-700',
    bg: 'bg-orange-50 border-orange-300',
    icon: <AlertTriangleIcon className="w-4 h-4" />
  },
  'Homework Reminder': {
    color: 'text-purple-700',
    bg: 'bg-purple-50 border-purple-300',
    icon: <ClockIcon className="w-4 h-4" />
  },
  Appreciation: {
    color: 'text-green-700',
    bg: 'bg-green-50 border-green-300',
    icon: <StarIcon className="w-4 h-4" />
  },
  'General Note': {
    color: 'text-gray-700',
    bg: 'bg-gray-50 border-gray-300',
    icon: <MessageSquareIcon className="w-4 h-4" />
  },
  'Urgent Notice': {
    color: 'text-red-700',
    bg: 'bg-red-50 border-red-300',
    icon: <AlertCircleIcon className="w-4 h-4" />
  }
};
const diaryHistory = [
{
  id: 1,
  date: '28 Feb 2026',
  student: 'Aarav Sharma',
  class: '9-A',
  category: 'Academic Update',
  subject: 'Mathematics Test Performance',
  message:
  "Aarav scored 18/20 in today's unit test. Excellent performance. Please encourage him to maintain this.",
  sentBy: 'Mr. Rajesh Patel',
  sentStatus: 'Delivered',
  viewedStatus: 'Viewed',
  acknowledged: 'Yes',
  parentReply: 'Thank you for the update!',
  notificationSent: true
},
{
  id: 2,
  date: '27 Feb 2026',
  student: 'Priya Singh',
  class: '9-A',
  category: 'Homework Reminder',
  subject: 'Pending Algebra Homework',
  message:
  'Priya has not submitted the algebra homework assigned on 25 Feb. Please ensure it is submitted tomorrow.',
  sentBy: 'Mr. Rajesh Patel',
  sentStatus: 'Delivered',
  viewedStatus: 'Viewed',
  acknowledged: 'No',
  parentReply: '',
  notificationSent: true
},
{
  id: 3,
  date: '26 Feb 2026',
  student: 'Amit Kumar',
  class: '9-B',
  category: 'Behaviour Update',
  subject: 'Classroom Behaviour Concern',
  message:
  'Amit was disruptive during the science period today. Please discuss the importance of classroom discipline at home.',
  sentBy: 'Ms. Anita Verma',
  sentStatus: 'Delivered',
  viewedStatus: 'Not Viewed',
  acknowledged: 'No',
  parentReply: '',
  notificationSent: true
},
{
  id: 4,
  date: '25 Feb 2026',
  student: 'Sneha Patel',
  class: '9-B',
  category: 'Appreciation',
  subject: 'Outstanding Science Project',
  message:
  'Sneha presented an outstanding science project on renewable energy. She demonstrated excellent research skills.',
  sentBy: 'Ms. Anita Verma',
  sentStatus: 'Delivered',
  viewedStatus: 'Viewed',
  acknowledged: 'Yes',
  parentReply: 'We are very proud of her!',
  notificationSent: true
},
{
  id: 5,
  date: '24 Feb 2026',
  student: 'Vikram Reddy',
  class: '9-A',
  category: 'Urgent Notice',
  subject: 'Medical Certificate Required',
  message:
  'Vikram was absent for 3 consecutive days. Please submit a medical certificate to the school office.',
  sentBy: 'Mr. Rajesh Patel',
  sentStatus: 'Delivered',
  viewedStatus: 'Viewed',
  acknowledged: 'Yes',
  parentReply: 'Certificate submitted.',
  notificationSent: true
}];

const students = [
{
  value: 'aarav',
  label: 'Aarav Sharma (Roll: 01)'
},
{
  value: 'priya',
  label: 'Priya Singh (Roll: 02)'
},
{
  value: 'amit',
  label: 'Amit Kumar (Roll: 03)'
},
{
  value: 'sneha',
  label: 'Sneha Patel (Roll: 04)'
},
{
  value: 'vikram',
  label: 'Vikram Reddy (Roll: 05)'
},
{
  value: 'ananya',
  label: 'Ananya Singh (Roll: 06)'
},
{
  value: 'rohan',
  label: 'Rohan Mehta (Roll: 07)'
}];

export function SchoolDiary() {
  const [activeTab, setActiveTab] = useState('compose');
  const [recipientMode, setRecipientMode] = useState<RecipientMode>('single');
  const [selectedCategory, setSelectedCategory] =
  useState<MessageCategory>('Academic Update');
  const [actionRequired, setActionRequired] = useState(false);
  const [notifyPush, setNotifyPush] = useState(true);
  const [notifySms, setNotifySms] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [messageTitle, setMessageTitle] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [searchHistory, setSearchHistory] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [expandedEntry, setExpandedEntry] = useState<number | null>(null);
  const todayEntries = diaryHistory.filter(
    (e) => e.date === '28 Feb 2026'
  ).length;
  const pendingAck = diaryHistory.filter((e) => e.acknowledged === 'No').length;
  const urgentCount = diaryHistory.filter(
    (e) => e.category === 'Urgent Notice'
  ).length;
  const viewedCount = diaryHistory.filter(
    (e) => e.viewedStatus === 'Viewed'
  ).length;
  const filteredHistory = diaryHistory.filter((entry) => {
    const matchSearch =
    !searchHistory ||
    entry.student.toLowerCase().includes(searchHistory.toLowerCase()) ||
    entry.subject.toLowerCase().includes(searchHistory.toLowerCase());
    const matchCategory = !filterCategory || entry.category === filterCategory;
    return matchSearch && matchCategory;
  });
  const recipientModes: {
    id: RecipientMode;
    label: string;
    icon: React.ReactNode;
  }[] = [
  {
    id: 'single',
    label: 'Single Student',
    icon: <UserIcon className="w-3.5 h-3.5" />
  },
  {
    id: 'multiple',
    label: 'Multiple Students',
    icon: <UsersIcon className="w-3.5 h-3.5" />
  },
  {
    id: 'class',
    label: 'Entire Class',
    icon: <LayoutGridIcon className="w-3.5 h-3.5" />
  }];

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">School Diary</h1>
          <p className="text-sm text-gray-500 mt-1">
            Send structured messages to parents and track acknowledgements
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<DownloadIcon className="w-4 h-4" />}>

            Export Log
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<SendIcon className="w-4 h-4" />}
            onClick={() => setActiveTab('compose')}>

            New Entry
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <BookIcon className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
              Today's Entries
            </span>
          </div>
          <p className="text-2xl font-bold text-blue-700">{todayEntries}</p>
          <p className="text-xs text-blue-500 mt-1">Sent today</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <ClockIcon className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-medium text-amber-600 uppercase tracking-wide">
              Pending Ack.
            </span>
          </div>
          <p className="text-2xl font-bold text-amber-700">{pendingAck}</p>
          <p className="text-xs text-amber-500 mt-1">Awaiting response</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircleIcon className="w-4 h-4 text-red-600" />
            <span className="text-xs font-medium text-red-600 uppercase tracking-wide">
              Urgent
            </span>
          </div>
          <p className="text-2xl font-bold text-red-700">{urgentCount}</p>
          <p className="text-xs text-red-500 mt-1">Urgent messages</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <EyeIcon className="w-4 h-4 text-green-600" />
            <span className="text-xs font-medium text-green-600 uppercase tracking-wide">
              Viewed
            </span>
          </div>
          <p className="text-2xl font-bold text-green-700">{viewedCount}</p>
          <p className="text-xs text-green-500 mt-1">Parent viewed</p>
        </div>
      </div>

      {/* Main Tabs */}
      <Card noPadding>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-5 pt-4">
            <TabsList>
              <TabsTrigger value="compose">
                <SendIcon className="w-3.5 h-3.5" /> Compose Entry
              </TabsTrigger>
              <TabsTrigger value="history">
                <ClockIcon className="w-3.5 h-3.5" /> Communication History
              </TabsTrigger>
              <TabsTrigger value="acknowledgements">
                <CheckCircleIcon className="w-3.5 h-3.5" /> Acknowledgements
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Compose Tab */}
          <TabsContent value="compose" className="p-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Form */}
              <div className="lg:col-span-2 space-y-5">
                {/* Context Panel */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                  <h3 className="font-semibold text-gray-800 text-sm">
                    Session Context
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Select
                      label="Academic Year"
                      options={[
                      {
                        value: '2024-25',
                        label: '2024-2025'
                      }]
                      }
                      value="2024-25"
                      onChange={() => {}} />

                    <Input label="Date" type="date" defaultValue={today} />
                    <Select
                      label="Standard"
                      options={[
                      {
                        value: '',
                        label: 'Select Class'
                      },
                      ...Array.from(
                        {
                          length: 12
                        },
                        (_, i) => ({
                          value: `class-${i + 1}`,
                          label: `Class ${i + 1}`
                        })
                      )]
                      }
                      value="class-9"
                      onChange={() => {}} />

                    <Select
                      label="Section"
                      options={[
                      {
                        value: 'A',
                        label: 'Section A'
                      },
                      {
                        value: 'B',
                        label: 'Section B'
                      },
                      {
                        value: 'C',
                        label: 'Section C'
                      }]
                      }
                      value="A"
                      onChange={() => {}} />

                  </div>
                </div>

                {/* Recipient Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Send To
                  </label>
                  <div className="flex gap-2">
                    {recipientModes.map(({ id, label, icon }) =>
                    <button
                      key={id}
                      onClick={() => setRecipientMode(id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${recipientMode === id ? 'bg-blue-50 border-blue-400 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>

                        {icon} {label}
                      </button>
                    )}
                  </div>
                </div>

                {/* Student Selection */}
                {recipientMode === 'single' &&
                <Select
                  label="Student Name *"
                  options={[
                  {
                    value: '',
                    label: 'Search & select student...'
                  },
                  ...students]
                  }
                  value=""
                  onChange={() => {}} />

                }
                {recipientMode === 'multiple' &&
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Students *
                    </label>
                    <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1">
                      {students.map((s) =>
                    <label
                      key={s.value}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer">

                          <input
                        type="checkbox"
                        className="rounded text-blue-600" />

                          <span className="text-sm text-gray-700">
                            {s.label}
                          </span>
                        </label>
                    )}
                    </div>
                  </div>
                }
                {recipientMode === 'class' &&
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
                    <LayoutGridIcon className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-700">
                      Message will be sent to all students in{' '}
                      <strong>Class 9-A</strong> (32 students)
                    </span>
                  </div>
                }

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category of Message *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {(Object.keys(categoryConfig) as MessageCategory[]).map(
                      (cat) => {
                        const cfg = categoryConfig[cat];
                        return (
                          <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all ${selectedCategory === cat ? `${cfg.bg} ${cfg.color}` : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>

                            {cfg.icon} {cat}
                          </button>);

                      }
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <Input
                    label="Subject / Title *"
                    placeholder="e.g. Mathematics Test Performance – Feb 28"
                    value={messageTitle}
                    onChange={(e) => setMessageTitle(e.target.value)} />

                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Message Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Write your message to the parent here..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={5} />

                  <p className="text-xs text-gray-400 mt-1">
                    {messageContent.length} characters
                  </p>
                </div>

                {/* Action Required */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Action Required from Parent?
                      </p>
                      <p className="text-xs text-gray-500">
                        Enable if parent needs to take specific action
                      </p>
                    </div>
                    <button
                      onClick={() => setActionRequired(!actionRequired)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${actionRequired ? 'bg-blue-500' : 'bg-gray-300'}`}>

                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${actionRequired ? 'left-7' : 'left-1'}`} />

                    </button>
                  </div>
                  {actionRequired &&
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Action Description
                        </label>
                        <input
                        type="text"
                        placeholder="e.g. Submit medical certificate"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

                      </div>
                      <Input label="Response Required By" type="date" />
                    </div>
                  }
                </div>

                {/* Attachment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attachment (optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <PaperclipIcon className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </p>
                    <div className="flex justify-center gap-3 mt-2">
                      {[
                      {
                        icon: <FileTextIcon className="w-3.5 h-3.5" />,
                        label: 'PDF'
                      },
                      {
                        icon: <ImageIcon className="w-3.5 h-3.5" />,
                        label: 'Image'
                      },
                      {
                        icon: <FileTextIcon className="w-3.5 h-3.5" />,
                        label: 'Homework Sheet'
                      }].
                      map(({ icon, label }) =>
                      <span
                        key={label}
                        className="flex items-center gap-1 text-xs text-gray-400">

                          {icon} {label}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Max file size: 5MB
                    </p>
                  </div>
                </div>

                {/* Send Button */}
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="primary"
                    leftIcon={<SendIcon className="w-4 h-4" />}
                    disabled={!messageTitle || !messageContent}>

                    Send Diary Entry
                  </Button>
                  <Button variant="outline">Save as Draft</Button>
                </div>
              </div>

              {/* Right: Notification & Preview */}
              <div className="space-y-4">
                {/* Notification Settings */}
                <Card>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <BellIcon className="w-4 h-4 text-gray-600" /> Notification
                    Channels
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <SmartphoneIcon className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-gray-700">
                          Push Notification
                        </span>
                      </div>
                      <button
                        onClick={() => setNotifyPush(!notifyPush)}
                        className={`relative w-10 h-5 rounded-full transition-colors ${notifyPush ? 'bg-green-500' : 'bg-gray-300'}`}>

                        <span
                          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${notifyPush ? 'left-5' : 'left-0.5'}`} />

                      </button>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <MessageSquareIcon className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-700">SMS</span>
                      </div>
                      <button
                        onClick={() => setNotifySms(!notifySms)}
                        className={`relative w-10 h-5 rounded-full transition-colors ${notifySms ? 'bg-green-500' : 'bg-gray-300'}`}>

                        <span
                          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${notifySms ? 'left-5' : 'left-0.5'}`} />

                      </button>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <MailIcon className="w-4 h-4 text-purple-500" />
                        <span className="text-sm text-gray-700">Email</span>
                      </div>
                      <button
                        onClick={() => setNotifyEmail(!notifyEmail)}
                        className={`relative w-10 h-5 rounded-full transition-colors ${notifyEmail ? 'bg-green-500' : 'bg-gray-300'}`}>

                        <span
                          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${notifyEmail ? 'left-5' : 'left-0.5'}`} />

                      </button>
                    </div>
                  </div>
                </Card>

                {/* Message Preview */}
                <Card>
                  <h3 className="font-semibold text-gray-900 mb-3">Preview</h3>
                  <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <div
                      className={`flex items-center gap-2 mb-2 px-2 py-1 rounded-md w-fit text-xs font-medium ${categoryConfig[selectedCategory].bg} ${categoryConfig[selectedCategory].color}`}>

                      {categoryConfig[selectedCategory].icon}
                      {selectedCategory}
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {messageTitle || 'Message Title'}
                    </p>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-3">
                      {messageContent ||
                      'Your message content will appear here...'}
                    </p>
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-400">
                        From: Mr. Rajesh Patel
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-400">
                        {new Date().toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Validation Checklist */}
                <Card>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Checklist
                  </h3>
                  <div className="space-y-2">
                    {[
                    {
                      label: 'Student selected',
                      valid: true
                    },
                    {
                      label: 'Category chosen',
                      valid: !!selectedCategory
                    },
                    {
                      label: 'Subject / Title filled',
                      valid: !!messageTitle
                    },
                    {
                      label: 'Message content written',
                      valid: !!messageContent
                    },
                    {
                      label: 'Notification channel set',
                      valid: notifyPush || notifySms || notifyEmail
                    }].
                    map(({ label, valid }) =>
                    <div key={label} className="flex items-center gap-2">
                        {valid ?
                      <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" /> :

                      <XCircleIcon className="w-4 h-4 text-gray-300 flex-shrink-0" />
                      }
                        <span
                        className={`text-xs ${valid ? 'text-gray-700' : 'text-gray-400'}`}>

                          {label}
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="p-5">
            <div className="flex flex-wrap gap-3 items-end mb-5">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by student or subject..."
                    value={searchHistory}
                    onChange={(e) => setSearchHistory(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

                </div>
              </div>
              <Select
                label=""
                options={[
                {
                  value: '',
                  label: 'All Categories'
                },
                ...Object.keys(categoryConfig).map((k) => ({
                  value: k,
                  label: k
                }))]
                }
                value={filterCategory}
                onChange={setFilterCategory} />

              <Button
                variant="outline"
                size="sm"
                leftIcon={<RefreshCwIcon className="w-4 h-4" />}>

                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<DownloadIcon className="w-4 h-4" />}>

                Export
              </Button>
            </div>

            <div className="space-y-3">
              {filteredHistory.map((entry) => {
                const cfg = categoryConfig[entry.category as MessageCategory];
                const isExpanded = expandedEntry === entry.id;
                return (
                  <div
                    key={entry.id}
                    className="border border-gray-200 rounded-xl overflow-hidden bg-white">

                    <button
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                      onClick={() =>
                      setExpandedEntry(isExpanded ? null : entry.id)
                      }>

                      <div className="flex items-center gap-3 text-left">
                        <div className={`p-2 rounded-lg ${cfg.bg}`}>
                          <span className={cfg.color}>{cfg.icon}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900 text-sm">
                              {entry.subject}
                            </p>
                            {entry.category === 'Urgent Notice' &&
                            <Badge variant="danger">Urgent</Badge>
                            }
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {entry.student} · {entry.class} · {entry.date} ·{' '}
                            {entry.sentBy}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <Badge
                          variant={
                          entry.acknowledged === 'Yes' ? 'success' : 'warning'
                          }>

                          {entry.acknowledged === 'Yes' ?
                          'Acknowledged' :
                          'Pending'}
                        </Badge>
                        <Badge
                          variant={
                          entry.viewedStatus === 'Viewed' ? 'info' : 'default'
                          }>

                          {entry.viewedStatus}
                        </Badge>
                        {isExpanded ?
                        <ChevronDownIcon className="w-4 h-4 text-gray-400" /> :

                        <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                        }
                      </div>
                    </button>

                    {isExpanded &&
                    <div className="px-4 pb-4 pt-0 border-t border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">
                              Message
                            </p>
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                              {entry.message}
                            </p>
                          </div>
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="p-2 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500">
                                  Sent Status
                                </p>
                                <p className="text-sm font-medium text-gray-800">
                                  {entry.sentStatus}
                                </p>
                              </div>
                              <div className="p-2 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500">Viewed</p>
                                <p className="text-sm font-medium text-gray-800">
                                  {entry.viewedStatus}
                                </p>
                              </div>
                              <div className="p-2 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500">
                                  Acknowledged
                                </p>
                                <p
                                className={`text-sm font-medium ${entry.acknowledged === 'Yes' ? 'text-green-600' : 'text-amber-600'}`}>

                                  {entry.acknowledged}
                                </p>
                              </div>
                              <div className="p-2 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500">
                                  Notification
                                </p>
                                <p className="text-sm font-medium text-gray-800">
                                  {entry.notificationSent ?
                                'Sent ✓' :
                                'Not Sent'}
                                </p>
                              </div>
                            </div>
                            {entry.parentReply &&
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-xs font-medium text-green-700 mb-1">
                                  Parent Reply
                                </p>
                                <p className="text-sm text-green-800">
                                  "{entry.parentReply}"
                                </p>
                              </div>
                          }
                            {entry.acknowledged === 'No' &&
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<BellIcon className="w-3.5 h-3.5" />}
                            className="w-full">

                                Send Follow-up Reminder
                              </Button>
                          }
                          </div>
                        </div>
                      </div>
                    }
                  </div>);

              })}
            </div>
          </TabsContent>

          {/* Acknowledgements Tab */}
          <TabsContent value="acknowledgements" className="p-5">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center">
                <p className="text-2xl font-bold text-green-700">
                  {diaryHistory.filter((e) => e.acknowledged === 'Yes').length}
                </p>
                <p className="text-xs text-green-600 mt-1">Acknowledged</p>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
                <p className="text-2xl font-bold text-amber-700">
                  {pendingAck}
                </p>
                <p className="text-xs text-amber-600 mt-1">Pending</p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
                <p className="text-2xl font-bold text-blue-700">
                  {Math.round(
                    diaryHistory.filter((e) => e.acknowledged === 'Yes').
                    length /
                    diaryHistory.length *
                    100
                  )}
                  %
                </p>
                <p className="text-xs text-blue-600 mt-1">Response Rate</p>
              </div>
            </div>

            <Table
              columns={[
              {
                key: 'date',
                header: 'Date',
                render: (row) =>
                <span className="text-sm text-gray-600">{row.date}</span>

              },
              {
                key: 'student',
                header: 'Student',
                render: (row) =>
                <span className="font-medium text-gray-900 text-sm">
                      {row.student}
                    </span>

              },
              {
                key: 'class',
                header: 'Class',
                render: (row) =>
                <span className="text-sm text-gray-600">{row.class}</span>

              },
              {
                key: 'category',
                header: 'Category',
                render: (row) => {
                  const cfg = categoryConfig[row.category as MessageCategory];
                  return (
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.color}`}>

                        {cfg.icon} {row.category}
                      </span>);

                }
              },
              {
                key: 'subject',
                header: 'Subject',
                render: (row) =>
                <span className="text-sm text-gray-700">{row.subject}</span>

              },
              {
                key: 'viewedStatus',
                header: 'Viewed',
                render: (row) =>
                <Badge
                  variant={
                  row.viewedStatus === 'Viewed' ? 'info' : 'default'
                  }>

                      {row.viewedStatus}
                    </Badge>

              },
              {
                key: 'acknowledged',
                header: 'Acknowledged',
                render: (row) =>
                <Badge
                  variant={
                  row.acknowledged === 'Yes' ? 'success' : 'warning'
                  }>

                      {row.acknowledged === 'Yes' ? 'Yes ✓' : 'Pending'}
                    </Badge>

              },
              {
                key: 'actions',
                header: 'Actions',
                render: (row) =>
                <div className="flex gap-1">
                      {row.acknowledged === 'No' &&
                  <Button
                    variant="ghost"
                    size="xs"
                    leftIcon={<BellIcon className="w-3 h-3" />}>

                          Remind
                        </Button>
                  }
                      <Button
                    variant="ghost"
                    size="xs"
                    leftIcon={<EyeIcon className="w-3 h-3" />}>

                        View
                      </Button>
                    </div>

              }]
              }
              data={diaryHistory} />

          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}