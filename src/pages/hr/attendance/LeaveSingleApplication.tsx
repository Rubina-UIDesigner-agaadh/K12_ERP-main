import React, { useCallback, useState, useRef } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import {
  ChevronRight,
  Home,
  Calendar,
  Clock,
  Upload,
  FileText,
  Phone,
  User,
  Send,
  Save,
  X,
  Check,
  AlertCircle,
  AlertTriangle,
  Info,
  Coffee,
  Heart,
  Briefcase,
  Baby,
  CalendarDays,
  CalendarCheck,
  FileImage,
  Trash2,
  CheckCircle,
  ChevronDown,
  HelpCircle,
  Sparkles } from
'lucide-react';
interface LeaveType {
  id: string;
  name: string;
  shortName: string;
  icon: React.ReactNode;
  balance: number;
  maxDays: number;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  requiresDocument: boolean;
}
interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
}
interface LeaveFormData {
  leaveType: string;
  fromDate: string;
  toDate: string;
  fromHalfDay: boolean;
  toHalfDay: boolean;
  halfDayType: 'first_half' | 'second_half';
  reason: string;
  contactNumber: string;
  emergencyContact: string;
  address: string;
  attachments: UploadedFile[];
}
const currentUser = {
  id: 'EMP001',
  name: 'Dr. Rajesh Kumar',
  avatar: 'RK',
  email: 'rajesh.kumar@school.edu',
  department: 'Mathematics',
  designation: 'Senior Teacher',
  reportingManager: 'Dr. Amit Shah',
  joiningDate: '2018-06-15'
};
const leaveTypes: LeaveType[] = [
{
  id: 'casual',
  name: 'Casual Leave',
  shortName: 'CL',
  icon: <Coffee className="w-5 h-5" />,
  balance: 8,
  maxDays: 12,
  color: 'text-blue-600',
  bgColor: 'bg-blue-50',
  borderColor: 'border-blue-500',
  description: 'For personal matters and emergencies',
  requiresDocument: false
},
{
  id: 'sick',
  name: 'Sick Leave',
  shortName: 'SL',
  icon: <Heart className="w-5 h-5" />,
  balance: 4,
  maxDays: 10,
  color: 'text-red-600',
  bgColor: 'bg-red-50',
  borderColor: 'border-red-500',
  description: 'Medical leave with certificate required for >2 days',
  requiresDocument: true
},
{
  id: 'earned',
  name: 'Earned Leave',
  shortName: 'EL',
  icon: <Briefcase className="w-5 h-5" />,
  balance: 15,
  maxDays: 30,
  color: 'text-green-600',
  bgColor: 'bg-green-50',
  borderColor: 'border-green-500',
  description: 'Pre-planned leaves, apply 7 days in advance',
  requiresDocument: false
},
{
  id: 'maternity',
  name: 'Maternity Leave',
  shortName: 'ML',
  icon: <Baby className="w-5 h-5" />,
  balance: 180,
  maxDays: 180,
  color: 'text-pink-600',
  bgColor: 'bg-pink-50',
  borderColor: 'border-pink-500',
  description: 'For expecting and new mothers',
  requiresDocument: true
},
{
  id: 'paternity',
  name: 'Paternity Leave',
  shortName: 'PL',
  icon: <Baby className="w-5 h-5" />,
  balance: 15,
  maxDays: 15,
  color: 'text-indigo-600',
  bgColor: 'bg-indigo-50',
  borderColor: 'border-indigo-500',
  description: 'For new fathers',
  requiresDocument: true
},
{
  id: 'compensatory',
  name: 'Compensatory Off',
  shortName: 'CO',
  icon: <CalendarCheck className="w-5 h-5" />,
  balance: 3,
  maxDays: 10,
  color: 'text-purple-600',
  bgColor: 'bg-purple-50',
  borderColor: 'border-purple-500',
  description: 'For extra work on holidays/weekends',
  requiresDocument: false
}];

const halfDayOptions = [
{
  value: 'first_half',
  label: 'First Half (Morning)'
},
{
  value: 'second_half',
  label: 'Second Half (Afternoon)'
}];

export function LeaveSingleApplication() {
  const [formData, setFormData] = useState<LeaveFormData>({
    leaveType: '',
    fromDate: '',
    toDate: '',
    fromHalfDay: false,
    toHalfDay: false,
    halfDayType: 'first_half',
    reason: '',
    contactNumber: '',
    emergencyContact: '',
    address: '',
    attachments: []
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showLeavePolicy, setShowLeavePolicy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedLeaveType = leaveTypes.find(
    (lt) => lt.id === formData.leaveType
  );
  const calculateLeaveDays = (): number => {
    if (!formData.fromDate || !formData.toDate) return 0;
    const from = new Date(formData.fromDate);
    const to = new Date(formData.toDate);
    let days =
    Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    if (days === 1 && (formData.fromHalfDay || formData.toHalfDay)) {
      days = 0.5;
    } else if (days > 1) {
      if (formData.fromHalfDay) days -= 0.5;
      if (formData.toHalfDay) days -= 0.5;
    }
    return Math.max(days, 0);
  };
  const leaveDays = calculateLeaveDays();
  const hasInsufficientBalance =
  selectedLeaveType && leaveDays > selectedLeaveType.balance;
  const handleLeaveTypeSelect = (leaveId: string) => {
    setFormData((prev) => ({
      ...prev,
      leaveType: leaveId
    }));
    setErrors((prev) => ({
      ...prev,
      leaveType: ''
    }));
  };
  const handleInputChange = (field: keyof LeaveFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
    setErrors((prev) => ({
      ...prev,
      [field]: ''
    }));
  };
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(files);
  };
  const handleFiles = (files: File[]) => {
    const newFiles: UploadedFile[] = files.map((file) => ({
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 100
    }));
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...newFiles]
    }));
  };
  const removeFile = (fileId: string) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((f) => f.id !== fileId)
    }));
  };
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/'))
    return <FileImage className="w-5 h-5 text-blue-500" />;
    return <FileText className="w-5 h-5 text-gray-500" />;
  };
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.leaveType) newErrors.leaveType = 'Please select a leave type';
    if (!formData.fromDate) newErrors.fromDate = 'From date is required';
    if (!formData.toDate) newErrors.toDate = 'To date is required';
    if (
    formData.fromDate &&
    formData.toDate &&
    new Date(formData.fromDate) > new Date(formData.toDate))

    newErrors.toDate = 'To date must be after from date';
    if (!formData.reason.trim())
    newErrors.reason = 'Please provide a reason for leave';
    if (!formData.contactNumber.trim())
    newErrors.contactNumber = 'Contact number is required';
    if (hasInsufficientBalance)
    newErrors.leaveType = 'Insufficient leave balance';
    if (
    selectedLeaveType?.requiresDocument &&
    leaveDays > 2 &&
    formData.attachments.length === 0)

    newErrors.attachments =
    'Medical certificate is required for sick leave > 2 days';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
    }, 2000);
  };
  const handleSaveDraft = () => {
    setIsSavingDraft(true);
    setTimeout(() => {
      setIsSavingDraft(false);
      alert('Draft saved successfully!');
    }, 1000);
  };
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  const today = new Date().toISOString().split('T')[0];
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Application Submitted!
          </h2>
          <p className="text-gray-600 mb-6">
            Your leave application has been submitted successfully and is
            pending approval from{' '}
            <span className="font-medium">{currentUser.reportingManager}</span>.
          </p>
          <div className="p-4 bg-gray-50 rounded-lg mb-6 text-left">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Leave Type:</span>
              <span className="font-medium text-gray-900">
                {selectedLeaveType?.name}
              </span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Duration:</span>
              <span className="font-medium text-gray-900">
                {leaveDays} day(s)
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Dates:</span>
              <span className="font-medium text-gray-900">
                {formatDate(formData.fromDate)} – {formatDate(formData.toDate)}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              onClick={() => {
                setShowSuccess(false);
                setFormData({
                  leaveType: '',
                  fromDate: '',
                  toDate: '',
                  fromHalfDay: false,
                  toHalfDay: false,
                  halfDayType: 'first_half',
                  reason: '',
                  contactNumber: '',
                  emergencyContact: '',
                  address: '',
                  attachments: []
                });
              }}>

              Apply Another
            </button>
            <button className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors">
              View Applications
            </button>
          </div>
        </div>
      </div>);

  }
  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500">
          <Home className="w-4 h-4" />
          <ChevronRight className="w-4 h-4 mx-2" />
          <span>Leave</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900 font-medium">Apply for Leave</span>
        </nav>

        {/* Main Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Apply for Leave</h1>
                <p className="text-teal-100 mt-1 text-sm">
                  Submit your leave application for approval
                </p>
              </div>
              <button
                onClick={() => setShowLeavePolicy(!showLeavePolicy)}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium">

                <HelpCircle className="w-4 h-4" />
                Leave Policy
              </button>
            </div>

            {/* User Info */}
            <div className="mt-6 flex items-center gap-4 p-4 bg-white/10 rounded-xl">
              <div className="w-14 h-14 rounded-full bg-white text-teal-700 flex items-center justify-center text-xl font-bold shadow-lg">
                {currentUser.avatar}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-lg">{currentUser.name}</p>
                <p className="text-teal-100 text-sm">
                  {currentUser.id} • {currentUser.designation} •{' '}
                  {currentUser.department}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-teal-100">Reporting Manager</p>
                <p className="font-semibold">{currentUser.reportingManager}</p>
              </div>
            </div>
          </div>

          {/* Leave Policy Panel */}
          {showLeavePolicy &&
          <div className="px-8 py-4 bg-blue-50 border-b border-blue-200">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800 flex-1">
                  <p className="font-semibold mb-2">Leave Policy Guidelines:</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-700">
                    <li>Earned Leave must be applied 7 days in advance</li>
                    <li>
                      Sick Leave requires medical certificate for more than 2
                      consecutive days
                    </li>
                    <li>
                      Casual Leave cannot be taken for more than 3 consecutive
                      days
                    </li>
                    <li>
                      Compensatory offs must be availed within 30 days of
                      earning
                    </li>
                    <li>All leaves are subject to manager approval</li>
                  </ul>
                </div>
                <button
                onClick={() => setShowLeavePolicy(false)}
                className="text-blue-600 hover:text-blue-800">

                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          }

          {/* Form Content */}
          <div className="px-8 py-6 space-y-8">
            {/* Leave Type Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Select Leave Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {leaveTypes.map((leave) =>
                <button
                  key={leave.id}
                  onClick={() => handleLeaveTypeSelect(leave.id)}
                  disabled={leave.balance === 0}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all ${formData.leaveType === leave.id ? `${leave.borderColor} ${leave.bgColor} shadow-md` : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'} ${leave.balance === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>

                    {formData.leaveType === leave.id &&
                  <div
                    className={`absolute top-2 right-2 w-5 h-5 rounded-full ${leave.color} bg-white border-2 flex items-center justify-center`}>

                        <Check className="w-3 h-3" />
                      </div>
                  }
                    <div
                    className={`w-9 h-9 rounded-lg ${leave.bgColor} ${leave.color} flex items-center justify-center mb-2`}>

                      {leave.icon}
                    </div>
                    <p
                    className={`font-semibold text-sm text-gray-900 ${formData.leaveType === leave.id ? leave.color : ''}`}>

                      {leave.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-tight">
                      {leave.description}
                    </p>
                    <div
                    className={`mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${leave.balance > 5 ? 'bg-green-100 text-green-700' : leave.balance > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>

                      <span>{leave.balance} days remaining</span>
                    </div>
                  </button>
                )}
              </div>
              {errors.leaveType &&
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.leaveType}
                </p>
              }
            </div>

            {/* Selected Leave Summary */}
            {selectedLeaveType &&
            <div
              className={`p-4 rounded-xl ${selectedLeaveType.bgColor} border ${selectedLeaveType.borderColor}`}>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                    className={`w-10 h-10 rounded-lg bg-white ${selectedLeaveType.color} flex items-center justify-center`}>

                      {selectedLeaveType.icon}
                    </div>
                    <div>
                      <p className={`font-semibold ${selectedLeaveType.color}`}>
                        {selectedLeaveType.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Balance: {selectedLeaveType.balance} of{' '}
                        {selectedLeaveType.maxDays} days
                      </p>
                    </div>
                  </div>
                  {leaveDays > 0 &&
                <div
                  className={`text-right ${hasInsufficientBalance ? 'text-red-600' : selectedLeaveType.color}`}>

                      <p className="text-2xl font-bold">{leaveDays}</p>
                      <p className="text-xs">day(s) requested</p>
                    </div>
                }
                </div>
                {hasInsufficientBalance &&
              <div className="mt-3 flex items-center gap-2 p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-700">
                      Insufficient balance! You only have{' '}
                      {selectedLeaveType.balance} days available.
                    </span>
                  </div>
              }
              </div>
            }

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Leave Duration <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">From Date</span>
                  </div>
                  <input
                    type="date"
                    value={formData.fromDate}
                    onChange={(e) =>
                    handleInputChange('fromDate', e.target.value)
                    }
                    min={today}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.fromDate ? 'border-red-300' : 'border-gray-300'}`} />

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.fromHalfDay}
                      onChange={(e) =>
                      handleInputChange('fromHalfDay', e.target.checked)
                      }
                      className="h-4 w-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500" />

                    <span className="text-sm text-gray-600">Half Day</span>
                  </label>
                  {formData.fromHalfDay &&
                  <select
                    value={formData.halfDayType}
                    onChange={(e) =>
                    handleInputChange('halfDayType', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">

                      {halfDayOptions.map((opt) =>
                    <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                    )}
                    </select>
                  }
                  {errors.fromDate &&
                  <p className="text-sm text-red-600">{errors.fromDate}</p>
                  }
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">To Date</span>
                  </div>
                  <input
                    type="date"
                    value={formData.toDate}
                    onChange={(e) =>
                    handleInputChange('toDate', e.target.value)
                    }
                    min={formData.fromDate || today}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.toDate ? 'border-red-300' : 'border-gray-300'}`} />

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.toHalfDay}
                      onChange={(e) =>
                      handleInputChange('toHalfDay', e.target.checked)
                      }
                      className="h-4 w-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                      disabled={
                      formData.fromDate === formData.toDate &&
                      formData.fromHalfDay
                      } />

                    <span className="text-sm text-gray-600">Half Day</span>
                  </label>
                  {errors.toDate &&
                  <p className="text-sm text-red-600">{errors.toDate}</p>
                  }
                </div>
              </div>

              {formData.fromDate && formData.toDate &&
              <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between border border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(formData.fromDate)}</span>
                    <span className="text-gray-400">→</span>
                    <span>{formatDate(formData.toDate)}</span>
                  </div>
                  <span
                  className={`font-semibold ${hasInsufficientBalance ? 'text-red-600' : 'text-teal-600'}`}>

                    {leaveDays} day(s)
                  </span>
                </div>
              }
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Reason for Leave <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => handleInputChange('reason', e.target.value)}
                placeholder="Please provide a brief explanation for your leave request..."
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none ${errors.reason ? 'border-red-300' : 'border-gray-300'}`} />

              <div className="flex justify-between mt-1">
                {errors.reason ?
                <p className="text-sm text-red-600">{errors.reason}</p> :

                <p className="text-xs text-gray-500">Minimum 10 characters</p>
                }
                <p className="text-xs text-gray-500">
                  {formData.reason.length}/500
                </p>
              </div>
            </div>

            {/* Attachments */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Attachments
                {selectedLeaveType?.requiresDocument && leaveDays > 2 &&
                <span className="text-red-500 ml-1">*</span>
                }
              </label>
              {selectedLeaveType?.requiresDocument &&
              <p className="text-sm text-amber-600 mb-3 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  Medical certificate required for {selectedLeaveType.name}{' '}
                  exceeding 2 days
                </p>
              }
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all ${isDragging ? 'border-teal-500 bg-teal-50' : errors.attachments ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />

                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${isDragging ? 'bg-teal-100' : 'bg-gray-100'}`}>

                    <Upload
                      className={`w-6 h-6 ${isDragging ? 'text-teal-600' : 'text-gray-400'}`} />

                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {isDragging ?
                    'Drop files here' :
                    'Drag & drop files here or'}
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-teal-600 font-medium text-sm hover:text-teal-700">

                    Browse files
                  </button>
                  <p className="text-xs text-gray-400 mt-2">
                    Supported: PDF, JPG, PNG, DOC (Max 5MB)
                  </p>
                </div>
              </div>
              {errors.attachments &&
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.attachments}
                </p>
              }
              {formData.attachments.length > 0 &&
              <div className="mt-4 space-y-2">
                  {formData.attachments.map((file) =>
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">

                      {getFileIcon(file.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                      <button
                    onClick={() => removeFile(file.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">

                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                )}
                </div>
              }
            </div>

            {/* Contact Details */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Contact Details While on Leave
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Contact Number <span className="text-red-500">*</span>
                    </span>
                  </div>
                  <input
                    type="tel"
                    value={formData.contactNumber}
                    onChange={(e) =>
                    handleInputChange('contactNumber', e.target.value)
                    }
                    placeholder="+91 98765 43210"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.contactNumber ? 'border-red-300' : 'border-gray-300'}`} />

                  {errors.contactNumber &&
                  <p className="mt-1 text-sm text-red-600">
                      {errors.contactNumber}
                    </p>
                  }
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Emergency Contact (Optional)
                    </span>
                  </div>
                  <input
                    type="tel"
                    value={formData.emergencyContact}
                    onChange={(e) =>
                    handleInputChange('emergencyContact', e.target.value)
                    }
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />

                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Home className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Address While on Leave (Optional)
                </span>
              </div>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter your address during the leave period..."
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" />

            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-5 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Sparkles className="w-4 h-4" />
                <span>
                  Application will be sent to{' '}
                  <strong>{currentUser.reportingManager}</strong> for approval
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSaveDraft}
                  disabled={isSavingDraft || isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">

                  {isSavingDraft ?
                  <>
                      <div className="w-4 h-4 mr-2 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </> :

                  <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Draft
                    </>
                  }
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !!hasInsufficientBalance}
                  className={`inline-flex items-center px-6 py-2 rounded-lg font-semibold text-white text-sm transition-all ${isSubmitting || hasInsufficientBalance ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 shadow-sm'}`}>

                  {isSubmitting ?
                  <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </> :

                  <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Application
                    </>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Leave Balance Summary */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-gray-500" />
            Your Leave Balance Summary
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {leaveTypes.map((leave) =>
            <div
              key={leave.id}
              className={`p-3 rounded-lg ${leave.bgColor} text-center border border-gray-100`}>

                <p className={`text-2xl font-bold ${leave.color}`}>
                  {leave.balance}
                </p>
                <p className="text-xs text-gray-600 mt-1">{leave.shortName}</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            Recent Leave Applications
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <CalendarDays className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Casual Leave
                  </p>
                  <p className="text-xs text-gray-500">Dec 20-21, 2024</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">2 day(s)</span>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  <CheckCircle className="w-3 h-3" />
                  Approved
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <CalendarDays className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Sick Leave
                  </p>
                  <p className="text-xs text-gray-500">Dec 15, 2024</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">1 day(s)</span>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  <CheckCircle className="w-3 h-3" />
                  Approved
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <CalendarDays className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Earned Leave
                  </p>
                  <p className="text-xs text-gray-500">Nov 10-15, 2024</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">6 day(s)</span>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  <CheckCircle className="w-3 h-3" />
                  Approved
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}