import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  X,
  Calendar,
  Clock,
  User,
  Users,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Check,
  AlertCircle,
  PhoneCall,
  MessageCircle,
  Send,
  Bell,
  FileText,
  ArrowRight,
  MoreVertical,
  RefreshCw,
  Download,
  Eye,
  Edit2,
  CheckCircle,
  XCircle,
  Loader2,
  AlertTriangle,
  MapPin,
  Video,
  Footprints,
  HelpCircle,
  ExternalLink,
  Copy,
  ChevronUp,
  Save,
  CalendarDays } from
'lucide-react';

// --- Types ---

interface FollowUp {
  id: string;
  inquiryId: string;
  inquiryNumber: string;
  studentName: string;
  classAppliedFor: string;
  stream: string;
  parentName: string;
  mobileNumber: string;
  alternateMobile: string;
  email: string;
  source: string;
  inquiryDate: string;
  inquiryStatus: string;
  assignedTo: string;
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  dueTime: string;
  dueStatus: 'Overdue' | 'Today' | 'Tomorrow' | 'Upcoming';
  lastInteraction: string;
  lastInteractionDate: string;
  siblingInSchool: boolean;
  siblingName: string;
  siblingClass: string;
  followUpHistory: FollowUpEntry[];
}

interface FollowUpEntry {
  id: string;
  date: string;
  time: string;
  type: string;
  staffName: string;
  outcome: string;
  remarks: string;
  statusBefore: string;
  statusAfter: string;
}

// --- Sample Data ---

const sampleFollowUps: FollowUp[] = [
{
  id: '1',
  inquiryId: 'inq1',
  inquiryNumber: 'INQ-2024-001',
  studentName: 'Aarav Sharma',
  classAppliedFor: 'Class 1',
  stream: 'Not Applicable',
  parentName: 'Rajesh Sharma',
  mobileNumber: '9876543210',
  alternateMobile: '9876543211',
  email: 'rajesh.sharma@email.com',
  source: 'School Website',
  inquiryDate: '15-03-2024',
  inquiryStatus: 'In Follow-up',
  assignedTo: 'Mrs. Sunita Verma',
  priority: 'High',
  dueDate: '18-03-2024',
  dueTime: '10:00 AM',
  dueStatus: 'Overdue',
  lastInteraction: 'Called - Interested, asked for fee details',
  lastInteractionDate: '15-03-2024',
  siblingInSchool: false,
  siblingName: '',
  siblingClass: '',
  followUpHistory: [
  {
    id: 'f1',
    date: '15-03-2024',
    time: '11:30 AM',
    type: 'Phone Call',
    staffName: 'Mrs. Sunita Verma',
    outcome: 'Spoke – Interested',
    remarks: 'Parent showed interest. Asked for detailed fee structure and transport options.',
    statusBefore: 'New',
    statusAfter: 'In Follow-up'
  }]

},
{
  id: '2',
  inquiryId: 'inq2',
  inquiryNumber: 'INQ-2024-002',
  studentName: 'Priya Patel',
  classAppliedFor: 'Class 5',
  stream: 'Not Applicable',
  parentName: 'Amit Patel',
  mobileNumber: '9876543212',
  alternateMobile: '',
  email: 'amit.patel@email.com',
  source: 'Parent Reference',
  inquiryDate: '14-03-2024',
  inquiryStatus: 'Interested',
  assignedTo: 'Mr. Rakesh Kumar',
  priority: 'High',
  dueDate: '20-03-2024',
  dueTime: '02:30 PM',
  dueStatus: 'Today',
  lastInteraction: 'WhatsApp - Will visit school on Saturday',
  lastInteractionDate: '17-03-2024',
  siblingInSchool: true,
  siblingName: 'Rahul Patel',
  siblingClass: 'Class 8',
  followUpHistory: [
  {
    id: 'f2',
    date: '17-03-2024',
    time: '04:15 PM',
    type: 'WhatsApp',
    staffName: 'Mr. Rakesh Kumar',
    outcome: 'Will Visit School',
    remarks: 'Confirmed visit for Saturday 10 AM. Need to arrange school tour.',
    statusBefore: 'In Follow-up',
    statusAfter: 'Interested'
  },
  {
    id: 'f3',
    date: '14-03-2024',
    time: '10:00 AM',
    type: 'Phone Call',
    staffName: 'Mr. Rakesh Kumar',
    outcome: 'Spoke – Interested',
    remarks: 'Referred by existing parent. Very positive about admission.',
    statusBefore: 'New',
    statusAfter: 'In Follow-up'
  }]

},
{
  id: '3',
  inquiryId: 'inq3',
  inquiryNumber: 'INQ-2024-003',
  studentName: 'Rohan Kumar',
  classAppliedFor: 'Class 8',
  stream: 'Not Applicable',
  parentName: 'Suresh Kumar',
  mobileNumber: '9876543213',
  alternateMobile: '9876543214',
  email: 'suresh.kumar@email.com',
  source: 'Walk-in',
  inquiryDate: '13-03-2024',
  inquiryStatus: 'In Follow-up',
  assignedTo: 'Mrs. Sunita Verma',
  priority: 'Medium',
  dueDate: '21-03-2024',
  dueTime: '11:00 AM',
  dueStatus: 'Tomorrow',
  lastInteraction: 'Visit - Parents impressed with infrastructure',
  lastInteractionDate: '16-03-2024',
  siblingInSchool: false,
  siblingName: '',
  siblingClass: '',
  followUpHistory: [
  {
    id: 'f4',
    date: '16-03-2024',
    time: '11:30 AM',
    type: 'Walk-in Visit',
    staffName: 'Mrs. Sunita Verma',
    outcome: 'Will Visit School',
    remarks: 'Parents visited school. Very impressed with labs and playground. Will discuss at home.',
    statusBefore: 'New',
    statusAfter: 'In Follow-up'
  }]

}];


// --- Configurations ---

const statusConfig: Record<string, {color: string;bgColor: string;label: string;}> = {
  'New': { color: 'text-blue-700', bgColor: 'bg-blue-100', label: 'New' },
  'In Follow-up': { color: 'text-yellow-700', bgColor: 'bg-yellow-100', label: 'In Follow-up' },
  'Interested': { color: 'text-purple-700', bgColor: 'bg-purple-100', label: 'Interested' },
  'Converted to Application': { color: 'text-indigo-700', bgColor: 'bg-indigo-100', label: 'Application' },
  'Converted to Admission': { color: 'text-green-700', bgColor: 'bg-green-100', label: 'Admitted' },
  'Not Interested': { color: 'text-gray-700', bgColor: 'bg-gray-100', label: 'Not Interested' },
  'Dropped': { color: 'text-red-700', bgColor: 'bg-red-100', label: 'Dropped' }
};

const dueStatusConfig: Record<string, {color: string;bgColor: string;borderColor: string;}> = {
  'Overdue': { color: 'text-red-700', bgColor: 'bg-red-100', borderColor: 'border-red-200' },
  'Today': { color: 'text-orange-700', bgColor: 'bg-orange-100', borderColor: 'border-orange-200' },
  'Tomorrow': { color: 'text-blue-700', bgColor: 'bg-blue-100', borderColor: 'border-blue-200' },
  'Upcoming': { color: 'text-green-700', bgColor: 'bg-green-100', borderColor: 'border-green-200' }
};

const priorityConfig: Record<string, {color: string;bgColor: string;}> = {
  'Low': { color: 'text-gray-600', bgColor: 'bg-gray-100' },
  'Medium': { color: 'text-blue-600', bgColor: 'bg-blue-100' },
  'High': { color: 'text-red-600', bgColor: 'bg-red-100' }
};

const followUpTypeOptions = [
{ value: 'Phone Call', label: 'Phone Call', icon: PhoneCall },
{ value: 'WhatsApp', label: 'WhatsApp', icon: MessageCircle },
{ value: 'SMS', label: 'SMS', icon: MessageSquare },
{ value: 'Email', label: 'Email', icon: Mail },
{ value: 'Walk-in Visit', label: 'Walk-in Visit', icon: Footprints },
{ value: 'Meeting', label: 'Meeting', icon: Users },
{ value: 'Video Call', label: 'Video Call', icon: Video },
{ value: 'Other', label: 'Other', icon: MoreVertical }];


const outcomeOptions = [
'No Response',
'Spoke – Interested',
'Spoke – Need Time to Decide',
'Spoke – Not Interested',
'Asked for Fee Details',
'Asked for Facility Visit',
'Will Visit School',
'Ready for Admission',
'Other'];


const statusOptions = [
'New',
'In Follow-up',
'Interested',
'Converted to Application',
'Converted to Admission',
'Not Interested',
'Dropped'];


const classOptions = [
'Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];


const staffOptions = [
'Mrs. Sunita Verma',
'Mr. Rakesh Kumar',
'Ms. Anjali Gupta',
'Mr. Deepak Singh'];


// --- Helper Components ---

function Tooltip({ children, content }: {children: React.ReactNode;content: string;}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block">
      <div onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
        {children}
      </div>
      {show &&
      <div className="absolute z-50 px-3 py-2 text-xs text-white bg-gray-900 rounded-lg shadow-lg bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max max-w-[200px] text-center">
          {content}
          <div className="absolute w-2 h-2 bg-gray-900 rotate-45 left-1/2 -translate-x-1/2 -bottom-1" />
        </div>
      }
    </div>);

}

function StatusBadge({ status }: {status: string;}) {
  const config = statusConfig[status] || statusConfig['New'];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
      {config.label}
    </span>);

}

function DueStatusBadge({ status }: {status: string;}) {
  const config = dueStatusConfig[status] || dueStatusConfig['Upcoming'];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.bgColor} ${config.color}`}>
      {status === 'Overdue' && <AlertTriangle className="w-3 h-3 mr-1" />}
      {status}
    </span>);

}

function PriorityBadge({ priority }: {priority: string;}) {
  const config = priorityConfig[priority] || priorityConfig['Low'];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.bgColor} ${config.color}`}>
      {priority}
    </span>);

}

function FormField({ label, required, error, children, helpText }: {label: string;required?: boolean;error?: string;children: React.ReactNode;helpText?: string;}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {helpText &&
      <p className="mt-1 text-xs text-gray-500">{helpText}</p>
      }
      {error &&
      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      }
    </div>);

}

function SummaryCard({ label, value, color, icon: Icon, isActive, onClick }: {label: string;value: number;color: 'red' | 'orange' | 'blue' | 'green' | 'purple';icon: React.ElementType;isActive: boolean;onClick: () => void;}) {
  const colorClasses = {
    red: { bg: isActive ? 'bg-red-100' : 'bg-white', border: 'border-red-200', text: 'text-red-600', hover: 'hover:bg-red-50' },
    orange: { bg: isActive ? 'bg-orange-100' : 'bg-white', border: 'border-orange-200', text: 'text-orange-600', hover: 'hover:bg-orange-50' },
    blue: { bg: isActive ? 'bg-blue-100' : 'bg-white', border: 'border-blue-200', text: 'text-blue-600', hover: 'hover:bg-blue-50' },
    green: { bg: isActive ? 'bg-green-100' : 'bg-white', border: 'border-green-200', text: 'text-green-600', hover: 'hover:bg-green-50' },
    purple: { bg: isActive ? 'bg-purple-100' : 'bg-white', border: 'border-purple-200', text: 'text-purple-600', hover: 'hover:bg-purple-50' }
  };
  const classes = colorClasses[color];
  return (
    <button
      onClick={onClick}
      className={`flex-1 min-w-[120px] p-4 rounded-xl border-2 ${classes.border} ${classes.bg} ${classes.hover} transition-all cursor-pointer ${isActive ? 'ring-2 ring-offset-2 ring-' + color + '-300' : ''}`}>

      <div className="flex items-center justify-between">
        <div>
          <p className={`text-2xl font-bold ${classes.text}`}>{value}</p>
          <p className="text-sm text-gray-600">{label}</p>
        </div>
        <div className={`p-2 rounded-lg ${classes.bg}`}>
          <Icon className={`w-5 h-5 ${classes.text}`} />
        </div>
      </div>
    </button>);

}

function TimelineEntry({ entry }: {entry: FollowUpEntry;}) {
  const getTypeIcon = (type: string) => {
    const typeOption = followUpTypeOptions.find((t) => t.value === type);
    return typeOption?.icon || MessageSquare;
  };
  const Icon = getTypeIcon(entry.type);
  return (
    <div className="flex gap-3 pb-4">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <Icon className="w-4 h-4 text-blue-600" />
        </div>
        <div className="flex-1 w-px bg-gray-200 mt-2" />
      </div>
      <div className="flex-1 pb-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">{entry.type}</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500">{entry.date} at {entry.time}</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-2">{entry.remarks}</p>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-gray-500">By: {entry.staffName}</span>
          <span className={`px-2 py-0.5 rounded ${entry.outcome === 'No Response' ? 'bg-gray-100 text-gray-600' : entry.outcome.includes('Interested') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
            {entry.outcome}
          </span>
          {entry.statusBefore !== entry.statusAfter &&
          <span className="text-purple-600 flex items-center gap-1">
              <ArrowRight className="w-3 h-3" />
              Status: {entry.statusAfter}
            </span>
          }
        </div>
      </div>
    </div>);

}

// --- Detail Panel Component ---

function DetailPanel({
  followUp,
  onClose,
  onSaveFollowUp,
  onConvert





}: {followUp: FollowUp | null;onClose: () => void;onSaveFollowUp: (data: any) => void;onConvert: (type: 'application' | 'admission') => void;}) {
  const [formData, setFormData] = useState({
    followUpType: 'Phone Call',
    followUpDate: new Date().toISOString().split('T')[0],
    followUpTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    remarks: '',
    outcome: '',
    updateStatus: '',
    nextFollowUpRequired: true,
    nextFollowUpDate: '',
    nextFollowUpTime: '',
    reminderType: ['ERP Notification'],
    nextPriority: 'Medium'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (followUp) {
      setFormData((prev) => ({
        ...prev,
        updateStatus: followUp.inquiryStatus,
        nextPriority: followUp.priority
      }));
    }
  }, [followUp]);

  if (!followUp) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.followUpType) newErrors.followUpType = 'Please select follow-up type';
    if (!formData.remarks.trim()) newErrors.remarks = 'Please enter follow-up remarks';
    if (!formData.outcome) newErrors.outcome = 'Please select outcome';
    if (formData.nextFollowUpRequired && !formData.nextFollowUpDate) {
      newErrors.nextFollowUpDate = 'Please select next follow-up date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (close: boolean = false) => {
    if (!validateForm()) return;
    setSaving(true);
    setTimeout(() => {
      onSaveFollowUp({
        ...formData,
        inquiryId: followUp.inquiryId
      });
      setSaving(false);
      if (close) onClose();else
      {
        setFormData((prev) => ({
          ...prev,
          remarks: '',
          outcome: ''
        }));
      }
    }, 500);
  };

  const canConvert = !['Converted to Application', 'Converted to Admission', 'Not Interested', 'Dropped'].includes(followUp.inquiryStatus);

  const inputClass = "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
  const selectClass = "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white";

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      {/* Panel Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">Follow-up Details</h2>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">

          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Inquiry Snapshot */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{followUp.studentName}</h3>
              <p className="text-sm text-gray-500">
                {followUp.classAppliedFor}
                {followUp.stream !== 'Not Applicable' && ` • ${followUp.stream}`}
              </p>
            </div>
            <StatusBadge status={followUp.inquiryStatus} />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Inquiry ID</p>
              <p className="text-sm font-medium text-gray-900">{followUp.inquiryNumber}</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Inquiry Date</p>
              <p className="text-sm font-medium text-gray-900">{followUp.inquiryDate}</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Source</p>
              <p className="text-sm font-medium text-gray-900">{followUp.source}</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Assigned To</p>
              <p className="text-sm font-medium text-gray-900">{followUp.assignedTo}</p>
            </div>
          </div>

          {/* Parent Contact */}
          <div className="p-3 bg-blue-50 rounded-lg mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-900">{followUp.parentName}</p>
              <div className="flex items-center gap-2">
                <Tooltip content="Call parent">
                  <a href={`tel:${followUp.mobileNumber}`} className="p-2 text-blue-600 bg-white rounded-lg hover:bg-blue-100 shadow-sm">
                    <Phone className="w-4 h-4" />
                  </a>
                </Tooltip>
                <Tooltip content="WhatsApp">
                  <a href={`https://wa.me/91${followUp.mobileNumber}`} target="_blank" rel="noopener noreferrer" className="p-2 text-green-600 bg-white rounded-lg hover:bg-green-100 shadow-sm">
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </Tooltip>
                {followUp.email &&
                <Tooltip content="Send email">
                    <a href={`mailto:${followUp.email}`} className="p-2 text-purple-600 bg-white rounded-lg hover:bg-purple-100 shadow-sm">
                      <Mail className="w-4 h-4" />
                    </a>
                  </Tooltip>
                }
              </div>
            </div>
            <p className="text-sm text-gray-600">{followUp.mobileNumber}</p>
            {followUp.email && <p className="text-sm text-gray-600">{followUp.email}</p>}
          </div>

          {/* Sibling Info */}
          {followUp.siblingInSchool &&
          <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg mb-4">
              <p className="text-xs text-yellow-700 font-medium mb-1">Sibling in School</p>
              <p className="text-sm text-gray-900">{followUp.siblingName} - {followUp.siblingClass}</p>
            </div>
          }

          {/* Quick Actions */}
          {canConvert &&
          <div className="flex gap-2">
              <button
              onClick={() => onConvert('application')}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100">

                <FileText className="w-4 h-4" />
                Convert to Application
              </button>
              <button
              onClick={() => onConvert('admission')}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100">

                <CheckCircle className="w-4 h-4" />
                Convert to Admission
              </button>
            </div>
          }
        </div>

        {/* Follow-up Timeline */}
        <div className="p-4 border-b border-gray-100">
          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            Follow-up History
          </h4>
          {followUp.followUpHistory.length === 0 ?
          <div className="text-center py-6 text-gray-400">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No follow-ups recorded yet</p>
            </div> :

          <div className="space-y-0">
              {followUp.followUpHistory.map((entry) =>
            <TimelineEntry key={entry.id} entry={entry} />
            )}
            </div>
          }
        </div>

        {/* Schedule / Add New Follow-up Panel Section */}
        <div className="p-4">
          <div className="bg-white border border-blue-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-blue-50 px-4 py-3 border-b border-blue-100 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-blue-700" />
              <h4 className="text-sm font-bold text-blue-900">Schedule & Log Follow-up</h4>
            </div>

            <div className="p-4 space-y-4">
              {/* Follow-up Type */}
              <FormField label="Interaction Type" required error={errors.followUpType}>
                <div className="grid grid-cols-4 gap-2">
                  {followUpTypeOptions.slice(0, 8).map((option) => {
                    const Icon = option.icon;
                    const isSelected = formData.followUpType === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, followUpType: option.value })}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-xs transition-colors ${
                        isSelected ?
                        'border-blue-500 bg-blue-50 text-blue-700' :
                        'border-gray-200 hover:bg-gray-50 text-gray-600'}`
                        }>

                        <Icon className="w-4 h-4" />
                        <span className="truncate w-full text-center">{option.label.split(' ')[0]}</span>
                      </button>);

                  })}
                </div>
              </FormField>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Date">
                  <input
                    type="date"
                    value={formData.followUpDate}
                    onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                    className={inputClass} />

                </FormField>
                <FormField label="Time">
                  <input
                    type="time"
                    value={formData.followUpTime}
                    onChange={(e) => setFormData({ ...formData, followUpTime: e.target.value })}
                    className={inputClass} />

                </FormField>
              </div>

              {/* Remarks */}
              <FormField label="Conversation Remarks" required error={errors.remarks}>
                <textarea
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="Enter discussion points and notes..."
                  rows={3}
                  className={inputClass} />

              </FormField>

              {/* Outcome */}
              <FormField label="Outcome" required error={errors.outcome}>
                <select
                  value={formData.outcome}
                  onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                  className={selectClass}>

                  <option value="">Select outcome</option>
                  {outcomeOptions.map((outcome) =>
                  <option key={outcome} value={outcome}>{outcome}</option>
                  )}
                </select>
              </FormField>

              {/* Update Status */}
              <FormField label="Update Inquiry Status">
                <select
                  value={formData.updateStatus}
                  onChange={(e) => setFormData({ ...formData, updateStatus: e.target.value })}
                  className={selectClass}>

                  {statusOptions.map((status) =>
                  <option key={status} value={status}>{status}</option>
                  )}
                </select>
              </FormField>

              {/* Next Follow-up Section */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    checked={formData.nextFollowUpRequired}
                    onChange={(e) => setFormData({ ...formData, nextFollowUpRequired: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />

                  <span className="text-sm font-bold text-gray-800">Schedule Next Follow-up</span>
                </label>

                {formData.nextFollowUpRequired &&
                <div className="bg-gray-50 p-3 rounded-lg space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-2 gap-3">
                      <FormField label="Next Date" required error={errors.nextFollowUpDate}>
                        <input
                        type="date"
                        value={formData.nextFollowUpDate}
                        onChange={(e) => setFormData({ ...formData, nextFollowUpDate: e.target.value })}
                        className={inputClass} />

                      </FormField>
                      <FormField label="Time">
                        <input
                        type="time"
                        value={formData.nextFollowUpTime}
                        onChange={(e) => setFormData({ ...formData, nextFollowUpTime: e.target.value })}
                        className={inputClass} />

                      </FormField>
                    </div>

                    <FormField label="Priority">
                      <div className="flex gap-2">
                        {['Low', 'Medium', 'High'].map((priority) =>
                      <button
                        key={priority}
                        type="button"
                        onClick={() => setFormData({ ...formData, nextPriority: priority })}
                        className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg border transition-colors ${
                        formData.nextPriority === priority ?
                        priority === 'High' ?
                        'bg-red-100 border-red-300 text-red-700' :
                        priority === 'Medium' ?
                        'bg-blue-100 border-blue-300 text-blue-700' :
                        'bg-gray-100 border-gray-300 text-gray-700' :
                        'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`
                        }>

                            {priority}
                          </button>
                      )}
                      </div>
                    </FormField>

                    <FormField label="Reminder Type">
                      <div className="space-y-2">
                        {['ERP Notification', 'Email to Counsellor', 'SMS Reminder'].map((type) =>
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                            <input
                          type="checkbox"
                          checked={formData.reminderType.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, reminderType: [...formData.reminderType, type] });
                            } else {
                              setFormData({ ...formData, reminderType: formData.reminderType.filter((t) => t !== type) });
                            }
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />

                            <span className="text-sm text-gray-600">{type}</span>
                          </label>
                      )}
                      </div>
                    </FormField>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panel Footer */}
      <div className="flex-shrink-0 flex items-center justify-between gap-2 p-4 border-t border-gray-200 bg-gray-50">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">

          Cancel
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 disabled:opacity-50">

            {saving ? 'Saving...' : 'Save Follow-up'}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">

            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Save & Close
          </button>
        </div>
      </div>
    </div>);

}

// --- Main Component ---

export function AdmissionInquiryFollowUp() {
  const [followUps, setFollowUps] = useState<FollowUp[]>(sampleFollowUps);
  const [selectedFollowUp, setSelectedFollowUp] = useState<FollowUp | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [toast, setToast] = useState<{message: string;type: 'success' | 'error';} | null>(null);

  // Filter State
  const [filters, setFilters] = useState({
    search: '',
    academicYear: '2024-25',
    classAppliedFor: '',
    stream: '',
    assignedTo: '',
    status: '',
    dateRange: 'all',
    priority: ''
  });

  // Sort State
  const [sortBy, setSortBy] = useState<{field: string;direction: 'asc' | 'desc';}>({
    field: 'dueDate',
    direction: 'asc'
  });

  // Stats
  const stats = {
    overdue: followUps.filter((f) => f.dueStatus === 'Overdue').length,
    today: followUps.filter((f) => f.dueStatus === 'Today').length,
    tomorrow: followUps.filter((f) => f.dueStatus === 'Tomorrow').length,
    upcoming: followUps.filter((f) => f.dueStatus === 'Upcoming').length,
    completed: 9
  };

  // Filter follow-ups
  const filteredFollowUps = followUps.filter((followUp) => {
    if (activeFilter !== 'all') {
      if (activeFilter === 'overdue' && followUp.dueStatus !== 'Overdue') return false;
      if (activeFilter === 'today' && followUp.dueStatus !== 'Today') return false;
      if (activeFilter === 'tomorrow' && followUp.dueStatus !== 'Tomorrow') return false;
      if (activeFilter === 'upcoming' && !['Tomorrow', 'Upcoming'].includes(followUp.dueStatus)) return false;
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      const matchesSearch =
      followUp.studentName.toLowerCase().includes(search) ||
      followUp.parentName.toLowerCase().includes(search) ||
      followUp.mobileNumber.includes(search) ||
      followUp.inquiryNumber.toLowerCase().includes(search);
      if (!matchesSearch) return false;
    }

    if (filters.classAppliedFor && followUp.classAppliedFor !== filters.classAppliedFor) return false;
    if (filters.assignedTo && followUp.assignedTo !== filters.assignedTo) return false;
    if (filters.status && followUp.inquiryStatus !== filters.status) return false;
    if (filters.priority && followUp.priority !== filters.priority) return false;

    return true;
  });

  // Sort follow-ups
  const sortedFollowUps = [...filteredFollowUps].sort((a, b) => {
    if (a.dueStatus === 'Overdue' && b.dueStatus !== 'Overdue') return -1;
    if (a.dueStatus !== 'Overdue' && b.dueStatus === 'Overdue') return 1;

    const dateA = new Date(a.dueDate.split('-').reverse().join('-'));
    const dateB = new Date(b.dueDate.split('-').reverse().join('-'));
    return sortBy.direction === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveFollowUp = (data: any) => {
    if (selectedFollowUp) {
      const newEntry: FollowUpEntry = {
        id: `f${Date.now()}`,
        date: new Date(data.followUpDate).toLocaleDateString('en-GB').split('/').join('-'),
        time: data.followUpTime,
        type: data.followUpType,
        staffName: 'Current User',
        outcome: data.outcome,
        remarks: data.remarks,
        statusBefore: selectedFollowUp.inquiryStatus,
        statusAfter: data.updateStatus
      };

      setFollowUps((prev) =>
      prev.map((f) =>
      f.id === selectedFollowUp.id ?
      {
        ...f,
        followUpHistory: [newEntry, ...f.followUpHistory],
        inquiryStatus: data.updateStatus,
        lastInteraction: `${data.followUpType} - ${data.outcome}`,
        lastInteractionDate: newEntry.date,
        dueDate: data.nextFollowUpRequired ? data.nextFollowUpDate.split('-').reverse().join('-') : f.dueDate,
        dueTime: data.nextFollowUpRequired ? data.nextFollowUpTime : f.dueTime,
        priority: data.nextPriority
      } :
      f
      )
      );

      setSelectedFollowUp((prev) =>
      prev ?
      {
        ...prev,
        followUpHistory: [newEntry, ...prev.followUpHistory],
        inquiryStatus: data.updateStatus
      } :
      null
      );

      showToast('Follow-up saved successfully!');
    }
  };

  const handleConvert = (type: 'application' | 'admission') => {
    if (!selectedFollowUp) return;

    const newStatus = type === 'application' ? 'Converted to Application' : 'Converted to Admission';

    setFollowUps((prev) =>
    prev.map((f) =>
    f.id === selectedFollowUp.id ?
    { ...f, inquiryStatus: newStatus } :
    f
    )
    );

    setSelectedFollowUp((prev) =>
    prev ? { ...prev, inquiryStatus: newStatus } : null
    );

    showToast(`Inquiry converted to ${type} successfully!`);
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      academicYear: '2024-25',
      classAppliedFor: '',
      stream: '',
      assignedTo: '',
      status: '',
      dateRange: 'all',
      priority: ''
    });
    setActiveFilter('all');
  };

  return (
    <div className="h-screen overflow-hidden bg-gray-50 flex flex-col">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      {/* Toast Notification */}
      {toast &&
      <div
        className={`fixed top-4 right-4 z-[60] flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
        toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white`
        }>

          {toast.type === 'success' ?
        <CheckCircle className="w-5 h-5" /> :

        <XCircle className="w-5 h-5" />
        }
          <span className="text-sm font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 p-1 hover:bg-white/20 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      }

      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">Admission Inquiry Follow-up</h1>
              {stats.overdue > 0 &&
              <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
                  <Bell className="w-3 h-3" />
                  {stats.overdue} Overdue
                </span>
              }
            </div>
            <p className="text-gray-500 mt-1">Track and manage inquiry follow-ups</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
              showFilters ?
              'bg-blue-50 text-blue-700 border-blue-200' :
              'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`
              }>

              <Filter className="w-4 h-4" />
              Filters
            </button>
           
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex gap-4 overflow-x-auto pb-2">
          <SummaryCard
            label="Overdue"
            value={stats.overdue}
            color="red"
            icon={AlertTriangle}
            isActive={activeFilter === 'overdue'}
            onClick={() => setActiveFilter(activeFilter === 'overdue' ? 'all' : 'overdue')} />

          <SummaryCard
            label="Today"
            value={stats.today}
            color="orange"
            icon={Calendar}
            isActive={activeFilter === 'today'}
            onClick={() => setActiveFilter(activeFilter === 'today' ? 'all' : 'today')} />

          <SummaryCard
            label="Tomorrow"
            value={stats.tomorrow}
            color="blue"
            icon={Clock}
            isActive={activeFilter === 'tomorrow'}
            onClick={() => setActiveFilter(activeFilter === 'tomorrow' ? 'all' : 'tomorrow')} />

          <SummaryCard
            label="Next 7 Days"
            value={stats.upcoming + stats.tomorrow}
            color="green"
            icon={ChevronRight}
            isActive={activeFilter === 'upcoming'}
            onClick={() => setActiveFilter(activeFilter === 'upcoming' ? 'all' : 'upcoming')} />

          <SummaryCard
            label="Completed Today"
            value={stats.completed}
            color="purple"
            icon={CheckCircle}
            isActive={false}
            onClick={() => {}} />

        </div>
      </div>

      {/* Filters Panel */}
      {showFilters &&
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Name, phone, ID..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Class</label>
              <select
              value={filters.classAppliedFor}
              onChange={(e) => setFilters({ ...filters, classAppliedFor: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">

                <option value="">All Classes</option>
                {classOptions.map((cls) =>
              <option key={cls} value={cls}>{cls}</option>
              )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
              <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">

                <option value="">All Status</option>
                {statusOptions.map((status) =>
              <option key={status} value={status}>{status}</option>
              )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Assigned To</label>
              <select
              value={filters.assignedTo}
              onChange={(e) => setFilters({ ...filters, assignedTo: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">

                <option value="">All Staff</option>
                {staffOptions.map((staff) =>
              <option key={staff} value={staff}>{staff}</option>
              )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Priority</label>
              <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">

                <option value="">All Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Date Range</label>
              <select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">

                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="week">Next 7 Days</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
              onClick={resetFilters}
              className="w-full px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">

                Reset All
              </button>
            </div>
          </div>
        </div>
      }

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Follow-up List */}
        <div className={`flex-1 overflow-hidden ${selectedFollowUp ? 'hidden lg:block lg:w-3/5' : 'w-full'}`}>
          <div className="h-full overflow-y-auto custom-scrollbar p-6">
            {/* Results Info */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium">{sortedFollowUps.length}</span> follow-ups
                {activeFilter !== 'all' &&
                <span className="ml-1">
                    • Filtered by: <span className="font-medium capitalize">{activeFilter}</span>
                  </span>
                }
              </p>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Follow-up Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Due Date & Time
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Student / Class
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Parent / Contact
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Last Interaction
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {sortedFollowUps.map((followUp) =>
                    <tr
                      key={followUp.id}
                      className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedFollowUp?.id === followUp.id ? 'bg-blue-50' : ''} ${
                      followUp.dueStatus === 'Overdue' ? 'bg-red-50/50' : ''}`}
                      onClick={() => setSelectedFollowUp(followUp)}>

                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <DueStatusBadge status={followUp.dueStatus} />
                            <div className="flex items-center gap-2 text-sm text-gray-900">
                              <Calendar className="w-3.5 h-3.5 text-gray-400" />
                              {followUp.dueDate}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock className="w-3 h-3 text-gray-400" />
                              {followUp.dueTime}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{followUp.studentName}</p>
                            <p className="text-xs text-gray-500">
                              {followUp.classAppliedFor}
                              {followUp.stream !== 'Not Applicable' && ` • ${followUp.stream}`}
                            </p>
                            <p className="text-xs text-gray-400">{followUp.inquiryNumber}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm text-gray-900">{followUp.parentName}</p>
                            <p className="text-xs text-gray-500">{followUp.mobileNumber}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={followUp.inquiryStatus} />
                        </td>
                        <td className="px-4 py-3">
                          <PriorityBadge priority={followUp.priority} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="max-w-[200px]">
                            <p className="text-xs text-gray-600 truncate">{followUp.lastInteraction}</p>
                            <p className="text-xs text-gray-400">{followUp.lastInteractionDate}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                           
                            <Tooltip content="View details">
                              <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedFollowUp(followUp);
                              }}
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">

                                <Eye className="w-4 h-4" />
                              </button>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {sortedFollowUps.length === 0 &&
              <div className="text-center py-12">
                  <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No follow-ups found</p>
                  <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
                </div>
              }
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        {selectedFollowUp &&
        <div className="w-full lg:w-2/5 border-l border-gray-200 overflow-hidden animate-in slide-in-from-right-10 duration-200">
            <div className="h-full overflow-y-auto custom-scrollbar">
              <DetailPanel
              followUp={selectedFollowUp}
              onClose={() => setSelectedFollowUp(null)}
              onSaveFollowUp={handleSaveFollowUp}
              onConvert={handleConvert} />

            </div>
          </div>
        }
      </div>
    </div>);

}