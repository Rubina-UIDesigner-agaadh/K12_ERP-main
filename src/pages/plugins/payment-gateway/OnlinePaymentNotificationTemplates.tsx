import React, { useState, useRef, useCallback } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import {
  FileText,
  Mail,
  MessageSquare,
  Bell,
  Smartphone,
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertTriangle,
  Save,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Plus,
  Edit,
  Send,
  Clock,
  User,
  Calendar,
  IndianRupee,
  Hash,
  Building,
  GripVertical,
  ChevronDown,
  ChevronRight,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link,
  Image,
  Code,
  Undo,
  Redo,
  Type,
  Palette,
  Maximize2,
  Minimize2,
  Info,
  HelpCircle,
  Loader2,
  Check,
  X,
  History,
  Layers,
  Variable,
  Zap,
  TestTube,
  ExternalLink,
  Download,
  Upload,
  Settings,
  Sparkles,
  Phone,
  CreditCard,
  Receipt,
  FileCheck,
  AlertCircle,
  MousePointer } from
'lucide-react';

type TemplateType = 'payment_success' | 'payment_failed' | 'refund_processed' | 'payment_reminder';
type ChannelType = 'email' | 'sms' | 'push';

interface VariableItem {
  id: string;
  name: string;
  key: string;
  description: string;
  example: string;
  category: 'student' | 'transaction' | 'school' | 'date' | 'payment';
}

interface TemplateVersion {
  id: string;
  version: number;
  createdAt: string;
  createdBy: string;
  changes: string;
}

interface Template {
  id: TemplateType;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  channels: {
    email: {
      subject: string;
      body: string;
      isEnabled: boolean;
      lastModified: string;
    };
    sms: {
      body: string;
      isEnabled: boolean;
      lastModified: string;
    };
    push: {
      title: string;
      body: string;
      isEnabled: boolean;
      lastModified: string;
    };
  };
}

export function OnlinePaymentNotificationTemplates() {
  // State
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('payment_success');
  const [selectedChannel, setSelectedChannel] = useState<ChannelType>('email');
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchVariable, setSearchVariable] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [testPhone, setTestPhone] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['student', 'transaction', 'payment', 'school', 'date'])
  );
  const [draggedVariable, setDraggedVariable] = useState<VariableItem | null>(null);
  const [cursorPosition, setCursorPosition] = useState(0);

  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Template definitions
  const [templates, setTemplates] = useState<Template[]>([
  {
    id: 'payment_success',
    name: 'Payment Success',
    description: 'Sent when payment is successfully processed',
    icon: CheckCircle,
    color: 'green',
    channels: {
      email: {
        subject: 'Payment Received - Receipt for {{StudentName}}',
        body: `<p>Dear {{ParentName}},</p>

<p>We are pleased to confirm that your payment has been successfully processed.</p>

<h3>Payment Details:</h3>
<ul>
  <li><strong>Student Name:</strong> {{StudentName}}</li>
  <li><strong>Class:</strong> {{ClassName}}</li>
  <li><strong>Transaction ID:</strong> {{TransactionID}}</li>
  <li><strong>Receipt Number:</strong> {{ReceiptNumber}}</li>
  <li><strong>Amount Paid:</strong> ₹{{Amount}}</li>
  <li><strong>Payment Date:</strong> {{TransactionDate}}</li>
  <li><strong>Payment Mode:</strong> {{PaymentMode}}</li>
</ul>

<p>A copy of your receipt has been attached to this email for your records.</p>

<p>Thank you for your prompt payment.</p>

<p>Warm regards,<br>
{{SchoolName}}<br>
{{SchoolAddress}}</p>`,
        isEnabled: true,
        lastModified: '2024-03-15 10:30 AM'
      },
      sms: {
        body: `Dear {{ParentName}}, Payment of ₹{{Amount}} received for {{StudentName}} ({{ClassName}}). Txn ID: {{TransactionID}}. Receipt: {{ReceiptNumber}}. Thank you! - {{SchoolName}}`,
        isEnabled: true,
        lastModified: '2024-03-15 10:30 AM'
      },
      push: {
        title: 'Payment Successful ✓',
        body: `₹{{Amount}} paid for {{StudentName}}. Transaction ID: {{TransactionID}}`,
        isEnabled: true,
        lastModified: '2024-03-15 10:30 AM'
      }
    }
  },
  {
    id: 'payment_failed',
    name: 'Payment Failed',
    description: 'Sent when payment attempt fails',
    icon: XCircle,
    color: 'red',
    channels: {
      email: {
        subject: 'Payment Failed - Action Required for {{StudentName}}',
        body: `<p>Dear {{ParentName}},</p>

<p>We regret to inform you that your recent payment attempt was unsuccessful.</p>

<h3>Transaction Details:</h3>
<ul>
  <li><strong>Student Name:</strong> {{StudentName}}</li>
  <li><strong>Transaction ID:</strong> {{TransactionID}}</li>
  <li><strong>Amount:</strong> ₹{{Amount}}</li>
  <li><strong>Date:</strong> {{TransactionDate}}</li>
  <li><strong>Error:</strong> {{ErrorMessage}}</li>
</ul>

<p><strong>What to do next:</strong></p>
<ol>
  <li>Please check your payment method and ensure sufficient balance</li>
  <li>Try again using our online payment portal</li>
  <li>If the issue persists, contact your bank or our finance office</li>
</ol>

<p><a href="{{PaymentLink}}">Click here to retry payment</a></p>

<p>For assistance, please contact us at {{SchoolPhone}} or {{SchoolEmail}}.</p>

<p>Regards,<br>
{{SchoolName}}</p>`,
        isEnabled: true,
        lastModified: '2024-03-14 02:15 PM'
      },
      sms: {
        body: `Dear {{ParentName}}, Payment of ₹{{Amount}} for {{StudentName}} failed. Error: {{ErrorMessage}}. Please retry: {{PaymentLink}} - {{SchoolName}}`,
        isEnabled: true,
        lastModified: '2024-03-14 02:15 PM'
      },
      push: {
        title: 'Payment Failed ✗',
        body: `Payment of ₹{{Amount}} failed for {{StudentName}}. Tap to retry.`,
        isEnabled: true,
        lastModified: '2024-03-14 02:15 PM'
      }
    }
  },
  {
    id: 'refund_processed',
    name: 'Refund Processed',
    description: 'Sent when refund is successfully processed',
    icon: RefreshCw,
    color: 'blue',
    channels: {
      email: {
        subject: 'Refund Processed - {{StudentName}}',
        body: `<p>Dear {{ParentName}},</p>

<p>We wish to inform you that your refund request has been successfully processed.</p>

<h3>Refund Details:</h3>
<ul>
  <li><strong>Student Name:</strong> {{StudentName}}</li>
  <li><strong>Original Transaction ID:</strong> {{OriginalTransactionID}}</li>
  <li><strong>Refund Transaction ID:</strong> {{TransactionID}}</li>
  <li><strong>Refund Amount:</strong> ₹{{RefundAmount}}</li>
  <li><strong>Refund Date:</strong> {{RefundDate}}</li>
  <li><strong>Refund Reason:</strong> {{RefundReason}}</li>
</ul>

<p>The refund amount will be credited to your original payment method within 5-7 business days.</p>

<p>If you have any questions, please contact our finance office.</p>

<p>Regards,<br>
{{SchoolName}}<br>
{{SchoolPhone}}</p>`,
        isEnabled: true,
        lastModified: '2024-03-13 11:45 AM'
      },
      sms: {
        body: `Dear {{ParentName}}, Refund of ₹{{RefundAmount}} for {{StudentName}} processed. Refund ID: {{TransactionID}}. Amount will be credited in 5-7 days. - {{SchoolName}}`,
        isEnabled: true,
        lastModified: '2024-03-13 11:45 AM'
      },
      push: {
        title: 'Refund Processed',
        body: `₹{{RefundAmount}} refund initiated for {{StudentName}}. Will be credited in 5-7 days.`,
        isEnabled: true,
        lastModified: '2024-03-13 11:45 AM'
      }
    }
  },
  {
    id: 'payment_reminder',
    name: 'Payment Reminder',
    description: 'Sent as reminder for pending payments',
    icon: Clock,
    color: 'orange',
    channels: {
      email: {
        subject: 'Payment Reminder - {{StudentName}} | Due: {{DueDate}}',
        body: `<p>Dear {{ParentName}},</p>

<p>This is a friendly reminder that a fee payment is due for your ward.</p>

<h3>Payment Details:</h3>
<ul>
  <li><strong>Student Name:</strong> {{StudentName}}</li>
  <li><strong>Class:</strong> {{ClassName}}</li>
  <li><strong>Fee Type:</strong> {{FeeType}}</li>
  <li><strong>Amount Due:</strong> ₹{{DueAmount}}</li>
  <li><strong>Due Date:</strong> {{DueDate}}</li>
  <li><strong>Days Overdue:</strong> {{DaysOverdue}}</li>
</ul>

{{#if LateFee}}
<p style="color: red;"><strong>Note:</strong> A late fee of ₹{{LateFee}} may be applicable after the due date.</p>
{{/if}}

<p><a href="{{PaymentLink}}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Pay Now</a></p>

<p>If you have already made the payment, please disregard this reminder.</p>

<p>For any queries, contact us at {{SchoolPhone}}.</p>

<p>Thank you,<br>
{{SchoolName}}</p>`,
        isEnabled: true,
        lastModified: '2024-03-12 09:00 AM'
      },
      sms: {
        body: `Dear {{ParentName}}, Reminder: ₹{{DueAmount}} fee due for {{StudentName}} by {{DueDate}}. Pay now: {{PaymentLink}} - {{SchoolName}}`,
        isEnabled: true,
        lastModified: '2024-03-12 09:00 AM'
      },
      push: {
        title: 'Payment Reminder 🔔',
        body: `₹{{DueAmount}} pending for {{StudentName}}. Due: {{DueDate}}. Tap to pay.`,
        isEnabled: true,
        lastModified: '2024-03-12 09:00 AM'
      }
    }
  }]
  );

  // Dynamic variables
  const variables: VariableItem[] = [
  // Student variables
  { id: 'student_name', name: 'Student Name', key: '{{StudentName}}', description: 'Full name of the student', example: 'Rahul Sharma', category: 'student' },
  { id: 'student_id', name: 'Student ID', key: '{{StudentID}}', description: 'Unique student ID', example: 'STU2024001', category: 'student' },
  { id: 'class_name', name: 'Class', key: '{{ClassName}}', description: 'Class and section', example: '10-A', category: 'student' },
  { id: 'roll_number', name: 'Roll Number', key: '{{RollNumber}}', description: 'Student roll number', example: '15', category: 'student' },
  { id: 'parent_name', name: 'Parent Name', key: '{{ParentName}}', description: 'Parent/Guardian name', example: 'Mr. Vijay Sharma', category: 'student' },
  { id: 'parent_email', name: 'Parent Email', key: '{{ParentEmail}}', description: 'Parent email address', example: 'vijay@email.com', category: 'student' },
  { id: 'parent_phone', name: 'Parent Phone', key: '{{ParentPhone}}', description: 'Parent phone number', example: '+91 98765 43210', category: 'student' },

  // Transaction variables
  { id: 'transaction_id', name: 'Transaction ID', key: '{{TransactionID}}', description: 'Unique transaction reference', example: 'TXN_RAZ_001234', category: 'transaction' },
  { id: 'receipt_number', name: 'Receipt Number', key: '{{ReceiptNumber}}', description: 'Payment receipt number', example: 'RCP-2024-000123', category: 'transaction' },
  { id: 'original_txn_id', name: 'Original Transaction ID', key: '{{OriginalTransactionID}}', description: 'Original transaction for refunds', example: 'TXN_RAZ_001200', category: 'transaction' },
  { id: 'error_message', name: 'Error Message', key: '{{ErrorMessage}}', description: 'Payment failure reason', example: 'Insufficient funds', category: 'transaction' },
  { id: 'gateway_name', name: 'Gateway Name', key: '{{GatewayName}}', description: 'Payment gateway used', example: 'Razorpay', category: 'transaction' },

  // Payment variables
  { id: 'amount', name: 'Amount', key: '{{Amount}}', description: 'Transaction amount', example: '25,000', category: 'payment' },
  { id: 'due_amount', name: 'Due Amount', key: '{{DueAmount}}', description: 'Pending payment amount', example: '15,000', category: 'payment' },
  { id: 'refund_amount', name: 'Refund Amount', key: '{{RefundAmount}}', description: 'Refund amount', example: '5,000', category: 'payment' },
  { id: 'late_fee', name: 'Late Fee', key: '{{LateFee}}', description: 'Late payment penalty', example: '500', category: 'payment' },
  { id: 'convenience_fee', name: 'Convenience Fee', key: '{{ConvenienceFee}}', description: 'Online payment fee', example: '250', category: 'payment' },
  { id: 'payment_mode', name: 'Payment Mode', key: '{{PaymentMode}}', description: 'Payment method used', example: 'UPI', category: 'payment' },
  { id: 'fee_type', name: 'Fee Type', key: '{{FeeType}}', description: 'Type of fee', example: 'Tuition Fee', category: 'payment' },
  { id: 'payment_link', name: 'Payment Link', key: '{{PaymentLink}}', description: 'Online payment URL', example: 'https://pay.school.edu/...', category: 'payment' },
  { id: 'refund_reason', name: 'Refund Reason', key: '{{RefundReason}}', description: 'Reason for refund', example: 'Duplicate payment', category: 'payment' },

  // School variables
  { id: 'school_name', name: 'School Name', key: '{{SchoolName}}', description: 'Name of the school', example: 'Delhi Public School', category: 'school' },
  { id: 'school_address', name: 'School Address', key: '{{SchoolAddress}}', description: 'School full address', example: 'Sector 24, Noida', category: 'school' },
  { id: 'school_phone', name: 'School Phone', key: '{{SchoolPhone}}', description: 'School contact number', example: '+91 120 1234567', category: 'school' },
  { id: 'school_email', name: 'School Email', key: '{{SchoolEmail}}', description: 'School email address', example: 'info@school.edu.in', category: 'school' },
  { id: 'school_logo', name: 'School Logo', key: '{{SchoolLogo}}', description: 'School logo URL', example: '[Image]', category: 'school' },

  // Date variables
  { id: 'transaction_date', name: 'Transaction Date', key: '{{TransactionDate}}', description: 'Date of transaction', example: '15 Mar 2024', category: 'date' },
  { id: 'transaction_time', name: 'Transaction Time', key: '{{TransactionTime}}', description: 'Time of transaction', example: '10:30 AM', category: 'date' },
  { id: 'due_date', name: 'Due Date', key: '{{DueDate}}', description: 'Payment due date', example: '31 Mar 2024', category: 'date' },
  { id: 'refund_date', name: 'Refund Date', key: '{{RefundDate}}', description: 'Date of refund', example: '20 Mar 2024', category: 'date' },
  { id: 'days_overdue', name: 'Days Overdue', key: '{{DaysOverdue}}', description: 'Days past due date', example: '5', category: 'date' },
  { id: 'current_date', name: 'Current Date', key: '{{CurrentDate}}', description: 'Today\'s date', example: '15 Mar 2024', category: 'date' },
  { id: 'academic_year', name: 'Academic Year', key: '{{AcademicYear}}', description: 'Current academic year', example: '2023-24', category: 'date' }];


  // Version history
  const versionHistory: TemplateVersion[] = [
  { id: '1', version: 5, createdAt: '2024-03-15 10:30 AM', createdBy: 'Admin', changes: 'Updated payment details format' },
  { id: '2', version: 4, createdAt: '2024-03-10 02:15 PM', createdBy: 'Finance Manager', changes: 'Added late fee information' },
  { id: '3', version: 3, createdAt: '2024-03-05 11:00 AM', createdBy: 'Admin', changes: 'Changed email subject line' },
  { id: '4', version: 2, createdAt: '2024-02-28 09:45 AM', createdBy: 'Admin', changes: 'Added school contact details' },
  { id: '5', version: 1, createdAt: '2024-02-20 03:00 PM', createdBy: 'System', changes: 'Initial template creation' }];


  // Get current template
  const currentTemplate = templates.find((t) => t.id === selectedTemplate)!;

  // Get current channel content
  const getCurrentContent = () => {
    const template = currentTemplate;
    if (selectedChannel === 'email') {
      return {
        subject: template.channels.email.subject,
        body: template.channels.email.body
      };
    } else if (selectedChannel === 'sms') {
      return {
        body: template.channels.sms.body
      };
    } else {
      return {
        title: template.channels.push.title,
        body: template.channels.push.body
      };
    }
  };

  // Filter variables by search
  const filteredVariables = variables.filter(
    (v) =>
    v.name.toLowerCase().includes(searchVariable.toLowerCase()) ||
    v.key.toLowerCase().includes(searchVariable.toLowerCase())
  );

  // Group variables by category
  const groupedVariables = filteredVariables.reduce(
    (acc, variable) => {
      if (!acc[variable.category]) {
        acc[variable.category] = [];
      }
      acc[variable.category].push(variable);
      return acc;
    },
    {} as Record<string, VariableItem[]>
  );

  // Category labels
  const categoryLabels: Record<string, {label: string;icon: React.ElementType;}> = {
    student: { label: 'Student Information', icon: User },
    transaction: { label: 'Transaction Details', icon: Receipt },
    payment: { label: 'Payment Information', icon: CreditCard },
    school: { label: 'School Details', icon: Building },
    date: { label: 'Date & Time', icon: Calendar }
  };

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  // Insert variable at cursor position
  const insertVariable = (variable: VariableItem) => {
    if (editorRef.current) {
      const textarea = editorRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end);
      const newValue = before + variable.key + after;

      // Update the appropriate field
      updateTemplateContent('body', newValue);

      // Set cursor position after inserted variable
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.key.length, start + variable.key.length);
      }, 0);

      setHasChanges(true);
    }
  };

  // Handle drag start
  const handleDragStart = (variable: VariableItem) => {
    setDraggedVariable(variable);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedVariable(null);
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedVariable) {
      insertVariable(draggedVariable);
      setDraggedVariable(null);
    }
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Update template content
  const updateTemplateContent = (field: string, value: string) => {
    setTemplates((prev) =>
    prev.map((t) => {
      if (t.id === selectedTemplate) {
        return {
          ...t,
          channels: {
            ...t.channels,
            [selectedChannel]: {
              ...t.channels[selectedChannel as ChannelType],
              [field]: value
            }
          }
        };
      }
      return t;
    })
    );
    setHasChanges(true);
  };

  // Toggle channel enabled
  const toggleChannelEnabled = () => {
    setTemplates((prev) =>
    prev.map((t) => {
      if (t.id === selectedTemplate) {
        return {
          ...t,
          channels: {
            ...t.channels,
            [selectedChannel]: {
              ...t.channels[selectedChannel as ChannelType],
              isEnabled: !t.channels[selectedChannel as ChannelType].isEnabled
            }
          }
        };
      }
      return t;
    })
    );
    setHasChanges(true);
  };

  // Save template
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setHasChanges(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  // Send test notification
  const handleSendTest = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setShowTestModal(false);
      // Show success message
    }, 2000);
  };

  // Preview content with sample data
  const getPreviewContent = (content: string): string => {
    const sampleData: Record<string, string> = {
      '{{StudentName}}': 'Rahul Sharma',
      '{{StudentID}}': 'STU2024001',
      '{{ClassName}}': '10-A',
      '{{RollNumber}}': '15',
      '{{ParentName}}': 'Mr. Vijay Sharma',
      '{{ParentEmail}}': 'vijay.sharma@email.com',
      '{{ParentPhone}}': '+91 98765 43210',
      '{{TransactionID}}': 'TXN_RAZ_001234',
      '{{ReceiptNumber}}': 'RCP-2024-000123',
      '{{Amount}}': '25,000',
      '{{DueAmount}}': '15,000',
      '{{RefundAmount}}': '5,000',
      '{{LateFee}}': '500',
      '{{ConvenienceFee}}': '250',
      '{{PaymentMode}}': 'UPI',
      '{{FeeType}}': 'Tuition Fee',
      '{{TransactionDate}}': '15 Mar 2024',
      '{{TransactionTime}}': '10:30 AM',
      '{{DueDate}}': '31 Mar 2024',
      '{{RefundDate}}': '20 Mar 2024',
      '{{DaysOverdue}}': '5',
      '{{CurrentDate}}': '15 Mar 2024',
      '{{AcademicYear}}': '2023-24',
      '{{SchoolName}}': 'Delhi Public School',
      '{{SchoolAddress}}': 'Sector 24, Noida - 201301',
      '{{SchoolPhone}}': '+91 120 1234567',
      '{{SchoolEmail}}': 'info@dps.edu.in',
      '{{PaymentLink}}': 'https://pay.school.edu/p/ABC123',
      '{{ErrorMessage}}': 'Insufficient funds',
      '{{RefundReason}}': 'Duplicate payment',
      '{{OriginalTransactionID}}': 'TXN_RAZ_001200',
      '{{GatewayName}}': 'Razorpay'
    };

    let preview = content;
    Object.entries(sampleData).forEach(([key, value]) => {
      preview = preview.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), value);
    });
    return preview;
  };

  // Character count for SMS
  const getSmsCharacterCount = () => {
    const content = currentTemplate.channels.sms.body;
    const count = content.length;
    const segments = Math.ceil(count / 160);
    return { count, segments };
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Notification Templates
          </h1>
          <p className="text-sm text-gray-500">
            Configure email, SMS, and push notification templates for payment events
          </p>
        </div>
        <div className="flex items-center gap-3">
          {hasChanges &&
          <Badge variant="warning" className="flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Unsaved Changes
            </Badge>
          }
          {saveSuccess &&
          <Badge variant="success" className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Saved Successfully
            </Badge>
          }
          <Button variant="outline" onClick={() => setShowHistory(true)}>
            <History className="w-4 h-4 mr-2" />
            History
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isSaving || !hasChanges}>

            {isSaving ?
            <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </> :

            <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            }
          </Button>
        </div>
      </div>

      {/* Template Selection */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {templates.map((template) => {
          const Icon = template.icon;
          const isSelected = selectedTemplate === template.id;
          return (
            <Card
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={`p-4 cursor-pointer transition-all ${
              isSelected ?
              `ring-2 ring-${template.color}-500 bg-${template.color}-50` :
              'hover:shadow-md'}`
              }
              style={{
                borderLeftWidth: '4px',
                borderLeftColor: isSelected ?
                template.color === 'green' ?
                '#22c55e' :
                template.color === 'red' ?
                '#ef4444' :
                template.color === 'blue' ?
                '#3b82f6' :
                '#f97316' :
                '#e5e7eb'
              }}>

              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg ${
                  template.color === 'green' ?
                  'bg-green-100' :
                  template.color === 'red' ?
                  'bg-red-100' :
                  template.color === 'blue' ?
                  'bg-blue-100' :
                  'bg-orange-100'}`
                  }>

                  <Icon
                    className={`w-5 h-5 ${
                    template.color === 'green' ?
                    'text-green-600' :
                    template.color === 'red' ?
                    'text-red-600' :
                    template.color === 'blue' ?
                    'text-blue-600' :
                    'text-orange-600'}`
                    } />

                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {template.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {template.channels.email.isEnabled &&
                    <Badge variant="secondary" className="text-xs">
                        <Mail className="w-3 h-3 mr-1" />
                        Email
                      </Badge>
                    }
                    {template.channels.sms.isEnabled &&
                    <Badge variant="secondary" className="text-xs">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        SMS
                      </Badge>
                    }
                    {template.channels.push.isEnabled &&
                    <Badge variant="secondary" className="text-xs">
                        <Bell className="w-3 h-3 mr-1" />
                        Push
                      </Badge>
                    }
                  </div>
                </div>
              </div>
            </Card>);

        })}
      </div>

      {/* Editor Section */}
      <div className={`grid gap-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-white p-6' : 'grid-cols-1 lg:grid-cols-4'}`}>
        {/* Variables Sidebar */}
        <Card className={`${isFullscreen ? 'hidden' : ''} lg:col-span-1 overflow-hidden`}>
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center gap-2 mb-3">
              <Variable className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Dynamic Variables</h3>
            </div>
            <div className="relative">
              <Input
                placeholder="Search variables..."
                value={searchVariable}
                onChange={(e) => setSearchVariable(e.target.value)}
                className="pr-8" />

              {searchVariable &&
              <button
                onClick={() => setSearchVariable('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">

                  <X className="w-4 h-4" />
                </button>
              }
            </div>
          </div>

          <div className="overflow-y-auto max-h-[500px]">
            {Object.entries(groupedVariables).map(([category, vars]) => {
              const CategoryIcon = categoryLabels[category]?.icon || Hash;
              const isExpanded = expandedCategories.has(category);

              return (
                <div key={category} className="border-b last:border-b-0">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors">

                    <div className="flex items-center gap-2">
                      <CategoryIcon className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-sm text-gray-700">
                        {categoryLabels[category]?.label || category}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {vars.length}
                      </Badge>
                    </div>
                    {isExpanded ?
                    <ChevronDown className="w-4 h-4 text-gray-400" /> :

                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    }
                  </button>

                  {isExpanded &&
                  <div className="px-3 pb-3 space-y-1">
                      {vars.map((variable) =>
                    <div
                      key={variable.id}
                      draggable
                      onDragStart={() => handleDragStart(variable)}
                      onDragEnd={handleDragEnd}
                      onClick={() => insertVariable(variable)}
                      className="group flex items-center gap-2 p-2 rounded-lg border border-transparent hover:border-blue-200 hover:bg-blue-50 cursor-pointer transition-all"
                      title={variable.description}>

                          <GripVertical className="w-3 h-3 text-gray-300 group-hover:text-gray-500" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-700 truncate">
                              {variable.name}
                            </p>
                            <p className="text-xs text-gray-400 font-mono truncate">
                              {variable.key}
                            </p>
                          </div>
                          <MousePointer className="w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100" />
                        </div>
                    )}
                    </div>
                  }
                </div>);

            })}
          </div>

          <div className="p-3 bg-blue-50 border-t">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                Click or drag variables into the editor to insert them at cursor position
              </p>
            </div>
          </div>
        </Card>

        {/* Main Editor */}
        <Card className={`${isFullscreen ? 'w-full' : 'lg:col-span-3'} overflow-hidden`}>
          {/* Channel Tabs */}
          <div className="flex items-center justify-between border-b bg-gray-50">
            <div className="flex">
              {[
              { id: 'email', label: 'Email', icon: Mail },
              { id: 'sms', label: 'SMS', icon: MessageSquare },
              { id: 'push', label: 'Push Notification', icon: Bell }].
              map((channel) => {
                const isActive = selectedChannel === channel.id;
                const isEnabled = currentTemplate.channels[channel.id as ChannelType].isEnabled;
                return (
                  <button
                    key={channel.id}
                    onClick={() => setSelectedChannel(channel.id as ChannelType)}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    isActive ?
                    'border-blue-600 text-blue-600 bg-white' :
                    'border-transparent text-gray-500 hover:text-gray-700'}`
                    }>

                    <channel.icon className="w-4 h-4" />
                    <span className="font-medium">{channel.label}</span>
                    {!isEnabled &&
                    <Badge variant="secondary" className="text-xs">
                        Disabled
                      </Badge>
                    }
                  </button>);

              })}
            </div>
            <div className="flex items-center gap-2 pr-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}>

                {showPreview ?
                <EyeOff className="w-4 h-4 mr-1" /> :

                <Eye className="w-4 h-4 mr-1" />
                }
                {showPreview ? 'Hide Preview' : 'Preview'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTestModal(true)}>

                <TestTube className="w-4 h-4 mr-1" />
                Test
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}>

                {isFullscreen ?
                <Minimize2 className="w-4 h-4" /> :

                <Maximize2 className="w-4 h-4" />
                }
              </Button>
            </div>
          </div>

          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleChannelEnabled}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                currentTemplate.channels[selectedChannel].isEnabled ?
                'bg-green-600' :
                'bg-gray-300'}`
                }>

                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  currentTemplate.channels[selectedChannel].isEnabled ?
                  'translate-x-6' :
                  'translate-x-1'}`
                  } />

              </button>
              <span className="text-sm font-medium text-gray-700">
                {currentTemplate.channels[selectedChannel].isEnabled ?
                'Enabled' :
                'Disabled'}{' '}
                for this template
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Last modified: {currentTemplate.channels[selectedChannel].lastModified}
            </p>
          </div>

          {/* Editor Content */}
          <div className={`grid ${showPreview ? 'grid-cols-2 divide-x' : ''}`}>
            {/* Edit Section */}
            <div className="p-4 space-y-4">
              {/* Email Subject */}
              {selectedChannel === 'email' &&
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Subject
                  </label>
                  <Input
                  value={currentTemplate.channels.email.subject}
                  onChange={(e) => updateTemplateContent('subject', e.target.value)}
                  placeholder="Enter email subject..." />

                </div>
              }

              {/* Push Title */}
              {selectedChannel === 'push' &&
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notification Title
                  </label>
                  <Input
                  value={currentTemplate.channels.push.title}
                  onChange={(e) => updateTemplateContent('title', e.target.value)}
                  placeholder="Enter notification title..."
                  maxLength={50} />

                  <p className="text-xs text-gray-500 mt-1">
                    {currentTemplate.channels.push.title.length}/50 characters
                  </p>
                </div>
              }

              {/* Body Editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {selectedChannel === 'email' ?
                    'Email Body' :
                    selectedChannel === 'sms' ?
                    'SMS Content' :
                    'Notification Body'}
                  </label>
                  {selectedChannel === 'sms' &&
                  <div className="text-xs text-gray-500">
                      {getSmsCharacterCount().count} chars | {getSmsCharacterCount().segments} SMS
                    </div>
                  }
                </div>

                {/* Rich Text Toolbar (for email) */}
                {selectedChannel === 'email' &&
                <div className="flex items-center gap-1 p-2 bg-gray-50 border border-b-0 rounded-t-lg">
                    <Button variant="ghost" size="sm" title="Bold">
                      <Bold className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title="Italic">
                      <Italic className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title="Underline">
                      <Underline className="w-4 h-4" />
                    </Button>
                    <div className="w-px h-4 bg-gray-300 mx-1" />
                    <Button variant="ghost" size="sm" title="Align Left">
                      <AlignLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title="Align Center">
                      <AlignCenter className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title="Align Right">
                      <AlignRight className="w-4 h-4" />
                    </Button>
                    <div className="w-px h-4 bg-gray-300 mx-1" />
                    <Button variant="ghost" size="sm" title="Bullet List">
                      <List className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title="Numbered List">
                      <ListOrdered className="w-4 h-4" />
                    </Button>
                    <div className="w-px h-4 bg-gray-300 mx-1" />
                    <Button variant="ghost" size="sm" title="Insert Link">
                      <Link className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title="Insert Image">
                      <Image className="w-4 h-4" />
                    </Button>
                    <div className="w-px h-4 bg-gray-300 mx-1" />
                    <Button variant="ghost" size="sm" title="View HTML">
                      <Code className="w-4 h-4" />
                    </Button>
                    <div className="flex-1" />
                    <Button variant="ghost" size="sm" title="Undo">
                      <Undo className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title="Redo">
                      <Redo className="w-4 h-4" />
                    </Button>
                  </div>
                }

                {/* Text Area */}
                <Textarea
                  ref={editorRef}
                  value={
                  selectedChannel === 'email' ?
                  currentTemplate.channels.email.body :
                  selectedChannel === 'sms' ?
                  currentTemplate.channels.sms.body :
                  currentTemplate.channels.push.body
                  }
                  onChange={(e) => updateTemplateContent('body', e.target.value)}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  placeholder="Enter template content..."
                  rows={selectedChannel === 'email' ? 15 : selectedChannel === 'sms' ? 6 : 4}
                  className={`font-mono text-sm ${
                  selectedChannel === 'email' ? 'rounded-t-none' : ''} ${
                  draggedVariable ? 'ring-2 ring-blue-400 ring-dashed' : ''}`}
                  maxLength={selectedChannel === 'sms' ? 320 : selectedChannel === 'push' ? 200 : undefined} />


                {selectedChannel === 'push' &&
                <p className="text-xs text-gray-500 mt-1">
                    {currentTemplate.channels.push.body.length}/200 characters
                  </p>
                }
              </div>

              {/* Variable Quick Insert */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-500">Quick insert:</span>
                {['{{StudentName}}', '{{Amount}}', '{{TransactionID}}', '{{SchoolName}}'].map(
                  (v) =>
                  <button
                    key={v}
                    onClick={() =>
                    insertVariable(variables.find((vr) => vr.key === v)!)
                    }
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 rounded transition-colors">

                      {v}
                    </button>

                )}
              </div>
            </div>

            {/* Preview Section */}
            {showPreview &&
            <div className="p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-700">Live Preview</h4>
                  <Badge variant="info" className="text-xs">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Sample Data
                  </Badge>
                </div>

                {selectedChannel === 'email' &&
              <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <div className="p-3 border-b bg-gray-50">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">Subject:</span>
                        <span className="font-medium">
                          {getPreviewContent(currentTemplate.channels.email.subject)}
                        </span>
                      </div>
                    </div>
                    <div
                  className="p-4 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: getPreviewContent(currentTemplate.channels.email.body)
                  }} />

                  </div>
              }

                {selectedChannel === 'sms' &&
              <div className="max-w-xs mx-auto">
                    <div className="bg-gray-800 rounded-3xl p-4 shadow-lg">
                      <div className="bg-white rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b">
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                            <Building className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium text-sm">School SMS</span>
                        </div>
                        <p className="text-sm text-gray-700">
                          {getPreviewContent(currentTemplate.channels.sms.body)}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">Just now</p>
                      </div>
                    </div>
                  </div>
              }

                {selectedChannel === 'push' &&
              <div className="max-w-sm mx-auto">
                    <div className="bg-white rounded-xl border shadow-lg overflow-hidden">
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                            <Building className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-sm">
                                {getPreviewContent(currentTemplate.channels.push.title)}
                              </span>
                              <span className="text-xs text-gray-400">now</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {getPreviewContent(currentTemplate.channels.push.body)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              }
              </div>
            }
          </div>
        </Card>
      </div>

      {/* Test Modal */}
      {showTestModal &&
      <Modal
        isOpen={showTestModal}
        onClose={() => setShowTestModal(false)}
        title="Send Test Notification">

          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Test with Sample Data
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    The notification will be sent with sample data to help you verify the template formatting.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {(selectedChannel === 'email' || selectedChannel === 'push') &&
            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Email Address
                  </label>
                  <Input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Enter email address" />

                </div>
            }

              {selectedChannel === 'sms' &&
            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Phone Number
                  </label>
                  <Input
                type="tel"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="+91 98765 43210" />

                </div>
            }
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
              {selectedChannel === 'email' &&
            <div className="text-sm space-y-1">
                  <p>
                    <strong>Subject:</strong>{' '}
                    {getPreviewContent(currentTemplate.channels.email.subject)}
                  </p>
                </div>
            }
              {selectedChannel === 'sms' &&
            <p className="text-sm text-gray-600">
                  {getPreviewContent(currentTemplate.channels.sms.body)}
                </p>
            }
              {selectedChannel === 'push' &&
            <div className="text-sm space-y-1">
                  <p>
                    <strong>Title:</strong>{' '}
                    {getPreviewContent(currentTemplate.channels.push.title)}
                  </p>
                  <p>
                    <strong>Body:</strong>{' '}
                    {getPreviewContent(currentTemplate.channels.push.body)}
                  </p>
                </div>
            }
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowTestModal(false)}>
                Cancel
              </Button>
              <Button
              variant="primary"
              onClick={handleSendTest}
              disabled={
              isSending ||
              selectedChannel !== 'sms' && !testEmail ||
              selectedChannel === 'sms' && !testPhone
              }>

                {isSending ?
              <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </> :

              <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Test
                  </>
              }
              </Button>
            </div>
          </div>
        </Modal>
      }

      {/* History Modal */}
      {showHistory &&
      <Modal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        title="Template Version History"
        size="lg">

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <FileText className="w-4 h-4" />
              <span>
                {currentTemplate.name} - {selectedChannel.toUpperCase()} Template
              </span>
            </div>

            <div className="space-y-3">
              {versionHistory.map((version, index) =>
            <div
              key={version.id}
              className={`border rounded-lg p-4 ${
              index === 0 ? 'border-blue-200 bg-blue-50' : ''}`
              }>

                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Badge
                    variant={index === 0 ? 'primary' : 'secondary'}
                    className="text-xs">

                        v{version.version}
                      </Badge>
                      {index === 0 &&
                  <Badge variant="success" className="text-xs">
                          Current
                        </Badge>
                  }
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      {index !== 0 &&
                  <Button variant="ghost" size="sm">
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Restore
                        </Button>
                  }
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{version.changes}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {version.createdAt}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {version.createdBy}
                    </span>
                  </div>
                </div>
            )}
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setShowHistory(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      }

      {/* Sticky Save Bar */}
      {hasChanges &&
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">You have unsaved changes</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => window.location.reload()}>
                Discard Changes
              </Button>
              <Button variant="primary" onClick={handleSave} disabled={isSaving}>
                {isSaving ?
              <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </> :

              <>
                    <Save className="w-4 h-4 mr-2" />
                    Save All Changes
                  </>
              }
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}