import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  CalendarClock,
  Plus,
  Edit2,
  Trash2,
  Save,
  RotateCcw,
  Zap,
  BellRing,
  PlayCircle,
  PauseCircle,
  X,
  Info,
  ChevronDown,
  ChevronUp,
  History,
  Calendar,
  Clock,
  IndianRupee,
  User,
  Building2,
  Tag,
  MessageSquare,
  Download,
  Printer,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Zap as ZapIcon,
  Database,
  HelpCircle,
  Search,
  Filter,
  MoreVertical,
  Copy,
  Eye,
  Settings,
  Bell,
  Mail,
  Smartphone,
  FileText,
  Receipt,
  CreditCard,
  Banknote,
  ArrowRight,
  ArrowLeft,
  CalendarDays,
  CalendarRange,
  Repeat,
  Timer,
  Activity,
  BarChart3,
  PieChart,
  Send,
  Shield,
  Lock,
  Unlock,
  ExternalLink,
  Hash } from
'lucide-react';

// --- Types ---
interface Schedule {
  id: string;
  vendorName: string;
  vendorCode: string;
  expenseHead: string;
  expenseCode: string;
  description: string;
  amount: number;
  frequency: 'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Yearly' | 'Custom';
  customDays?: number;
  nextDueDate: string;
  startDate: string;
  endDate?: string;
  actionType: 'Auto-Voucher' | 'Reminder Only' | 'Auto-Payment';
  status: 'Active' | 'Paused' | 'Expired';
  reminderDays: number;
  notifyVia: ('email' | 'sms' | 'push')[];
  department: string;
  costCenter: string;
  lastExecuted?: string;
  executionCount: number;
  totalAmountProcessed: number;
  createdBy: string;
  createdAt: string;
  notes: string;
}

interface ExecutionLog {
  id: string;
  scheduleId: string;
  scheduleName: string;
  executedAt: string;
  amount: number;
  status: 'success' | 'failed' | 'skipped';
  voucherId?: string;
  message: string;
  type: 'voucher' | 'reminder' | 'payment';
}

interface UpcomingDue {
  id: string;
  name: string;
  vendor: string;
  amount: number;
  dueDate: string;
  daysUntilDue: number;
  status: 'upcoming' | 'due_today' | 'overdue';
}

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  dataSource: string[];
  whyItMatters: string[];
}

// --- Info Modal Component ---
function InfoModal({ isOpen, onClose, title, description, dataSource, whyItMatters }: InfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              <p className="text-gray-600 mt-2 leading-relaxed">{description}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Database className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-blue-900 uppercase text-sm tracking-wide">Data Source</h3>
              </div>
              <ul className="space-y-2">
                {dataSource.map((item, index) =>
                <li key={index} className="flex items-start gap-2 text-sm text-blue-800">
                    <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                )}
              </ul>
            </div>

            <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-purple-900 uppercase text-sm tracking-wide">Why It Matters</h3>
              </div>
              <ul className="space-y-2">
                {whyItMatters.map((item, index) =>
                <li key={index} className="flex items-start gap-2 text-sm text-purple-800">
                    <Zap className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" className="bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
    </div>);

}

// --- Mock Data ---
const INITIAL_SCHEDULES: Schedule[] = [
{
  id: '1',
  vendorName: 'Global ISP Ltd',
  vendorCode: 'VEND-001',
  expenseHead: 'Internet Charges',
  expenseCode: 'EXP-INT',
  description: 'Monthly internet service charges for all campus locations',
  amount: 2500,
  frequency: 'Monthly',
  nextDueDate: '2024-05-01',
  startDate: '2024-01-01',
  actionType: 'Auto-Voucher',
  status: 'Active',
  reminderDays: 3,
  notifyVia: ['email', 'push'],
  department: 'Administration',
  costCenter: 'IT Operations',
  lastExecuted: '2024-04-01',
  executionCount: 4,
  totalAmountProcessed: 10000,
  createdBy: 'Ms. Anjali Sharma',
  createdAt: '2024-01-15',
  notes: 'Auto-debit enabled with vendor'
},
{
  id: '2',
  vendorName: 'City Municipal Corp',
  vendorCode: 'VEND-002',
  expenseHead: 'Water Tax',
  expenseCode: 'EXP-WTR',
  description: 'Quarterly water tax for main campus and branch locations',
  amount: 15000,
  frequency: 'Quarterly',
  nextDueDate: '2024-06-15',
  startDate: '2024-01-01',
  actionType: 'Reminder Only',
  status: 'Active',
  reminderDays: 7,
  notifyVia: ['email', 'sms'],
  department: 'Facilities',
  costCenter: 'Utilities',
  lastExecuted: '2024-03-15',
  executionCount: 1,
  totalAmountProcessed: 15000,
  createdBy: 'Mr. Rajesh Kumar',
  createdAt: '2024-01-10',
  notes: 'Manual payment required at municipal office'
},
{
  id: '3',
  vendorName: 'Secure Guards Agency',
  vendorCode: 'VEND-003',
  expenseHead: 'Security Services',
  expenseCode: 'EXP-SEC',
  description: 'Monthly security personnel charges - 24x7 coverage',
  amount: 45000,
  frequency: 'Monthly',
  nextDueDate: '2024-05-05',
  startDate: '2023-04-01',
  actionType: 'Auto-Voucher',
  status: 'Paused',
  reminderDays: 5,
  notifyVia: ['email'],
  department: 'Administration',
  costCenter: 'Security',
  lastExecuted: '2024-03-05',
  executionCount: 12,
  totalAmountProcessed: 540000,
  createdBy: 'Mr. Vikram Singh',
  createdAt: '2023-04-01',
  notes: 'Contract under review - paused until renewal'
},
{
  id: '4',
  vendorName: 'Landlord - Mr. Sharma',
  vendorCode: 'VEND-004',
  expenseHead: 'Office Rent',
  expenseCode: 'EXP-RNT',
  description: 'Monthly rent for branch office premises',
  amount: 75000,
  frequency: 'Monthly',
  nextDueDate: '2024-05-10',
  startDate: '2023-01-01',
  actionType: 'Auto-Payment',
  status: 'Active',
  reminderDays: 5,
  notifyVia: ['email', 'sms', 'push'],
  department: 'Finance',
  costCenter: 'Branch Operations',
  lastExecuted: '2024-04-10',
  executionCount: 16,
  totalAmountProcessed: 1200000,
  createdBy: 'Ms. Sunita Verma',
  createdAt: '2023-01-05',
  notes: 'NEFT transfer to landlord account on 10th of every month'
},
{
  id: '5',
  vendorName: 'Tech Solutions AMC',
  vendorCode: 'VEND-005',
  expenseHead: 'IT Equipment AMC',
  expenseCode: 'EXP-AMC',
  description: 'Annual maintenance contract for computers and printers',
  amount: 120000,
  frequency: 'Yearly',
  nextDueDate: '2024-07-01',
  startDate: '2023-07-01',
  actionType: 'Reminder Only',
  status: 'Active',
  reminderDays: 30,
  notifyVia: ['email'],
  department: 'IT',
  costCenter: 'IT Operations',
  lastExecuted: '2023-07-01',
  executionCount: 1,
  totalAmountProcessed: 120000,
  createdBy: 'Mr. David Wilson',
  createdAt: '2023-06-15',
  notes: 'Renewal discussion needed 30 days before due date'
}];


const EXECUTION_LOGS: ExecutionLog[] = [
{
  id: 'LOG-001',
  scheduleId: '1',
  scheduleName: 'Internet Charges - Global ISP Ltd',
  executedAt: '2024-04-01 09:00 AM',
  amount: 2500,
  status: 'success',
  voucherId: 'VCH-2024-0401',
  message: 'Voucher auto-generated successfully',
  type: 'voucher'
},
{
  id: 'LOG-002',
  scheduleId: '4',
  scheduleName: 'Office Rent - Mr. Sharma',
  executedAt: '2024-04-10 10:30 AM',
  amount: 75000,
  status: 'success',
  voucherId: 'PAY-2024-0410',
  message: 'NEFT payment initiated successfully',
  type: 'payment'
},
{
  id: 'LOG-003',
  scheduleId: '2',
  scheduleName: 'Water Tax - City Municipal',
  executedAt: '2024-03-08 08:00 AM',
  amount: 15000,
  status: 'success',
  message: 'Reminder email sent to finance team',
  type: 'reminder'
},
{
  id: 'LOG-004',
  scheduleId: '3',
  scheduleName: 'Security Services - Secure Guards',
  executedAt: '2024-03-05 09:00 AM',
  amount: 45000,
  status: 'skipped',
  message: 'Schedule paused - execution skipped',
  type: 'voucher'
}];


const VENDORS = [
{ value: 'Global ISP Ltd', label: 'Global ISP Ltd' },
{ value: 'City Municipal Corp', label: 'City Municipal Corp' },
{ value: 'Secure Guards Agency', label: 'Secure Guards Agency' },
{ value: 'Landlord - Mr. Sharma', label: 'Landlord - Mr. Sharma' },
{ value: 'Tech Solutions AMC', label: 'Tech Solutions AMC' },
{ value: 'Power Corp Ltd', label: 'Power Corp Ltd' }];


const EXPENSE_HEADS = [
{ value: 'Internet Charges', label: 'Internet Charges' },
{ value: 'Water Tax', label: 'Water Tax' },
{ value: 'Security Services', label: 'Security Services' },
{ value: 'Office Rent', label: 'Office Rent' },
{ value: 'IT Equipment AMC', label: 'IT Equipment AMC' },
{ value: 'Electricity', label: 'Electricity' },
{ value: 'Maintenance Contract', label: 'Maintenance Contract' }];


const DEPARTMENTS = [
{ value: 'Administration', label: 'Administration' },
{ value: 'Finance', label: 'Finance' },
{ value: 'IT', label: 'IT' },
{ value: 'Facilities', label: 'Facilities' },
{ value: 'HR', label: 'Human Resources' }];


const COST_CENTERS = [
{ value: 'IT Operations', label: 'IT Operations' },
{ value: 'Utilities', label: 'Utilities' },
{ value: 'Security', label: 'Security' },
{ value: 'Branch Operations', label: 'Branch Operations' },
{ value: 'General Admin', label: 'General Admin' }];


const FREQUENCIES = [
{ value: 'Monthly', label: 'Monthly', description: 'Every month on same date' },
{ value: 'Quarterly', label: 'Quarterly', description: 'Every 3 months' },
{ value: 'Half-Yearly', label: 'Half-Yearly', description: 'Every 6 months' },
{ value: 'Yearly', label: 'Yearly', description: 'Once a year' },
{ value: 'Custom', label: 'Custom', description: 'Define custom interval' }];


export function RecurringExpenseScheduler() {
  // --- State ---
  const [schedules, setSchedules] = useState<Schedule[]>(INITIAL_SCHEDULES);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'cards' | 'history'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [frequencyFilter, setFrequencyFilter] = useState('all');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [activeInfoModal, setActiveInfoModal] = useState<string | null>(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Schedule>>({
    vendorName: '',
    vendorCode: '',
    expenseHead: '',
    expenseCode: '',
    description: '',
    amount: 0,
    frequency: 'Monthly',
    nextDueDate: '',
    startDate: new Date().toISOString().split('T')[0],
    actionType: 'Reminder Only',
    status: 'Active',
    reminderDays: 3,
    notifyVia: ['email'],
    department: '',
    costCenter: '',
    notes: ''
  });

  // Calculate stats
  const stats = useMemo(() => {
    const activeSchedules = schedules.filter((s) => s.status === 'Active').length;
    const pausedSchedules = schedules.filter((s) => s.status === 'Paused').length;
    const totalMonthlyCommitment = schedules.
    filter((s) => s.status === 'Active').
    reduce((sum, s) => {
      if (s.frequency === 'Monthly') return sum + s.amount;
      if (s.frequency === 'Quarterly') return sum + s.amount / 3;
      if (s.frequency === 'Half-Yearly') return sum + s.amount / 6;
      if (s.frequency === 'Yearly') return sum + s.amount / 12;
      return sum;
    }, 0);
    const totalProcessed = schedules.reduce((sum, s) => sum + s.totalAmountProcessed, 0);
    const autoVoucherCount = schedules.filter((s) => s.actionType === 'Auto-Voucher' && s.status === 'Active').length;
    const upcomingThisWeek = schedules.filter((s) => {
      const dueDate = new Date(s.nextDueDate);
      const today = new Date();
      const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7 && s.status === 'Active';
    }).length;

    return {
      activeSchedules,
      pausedSchedules,
      totalMonthlyCommitment,
      totalProcessed,
      autoVoucherCount,
      upcomingThisWeek
    };
  }, [schedules]);

  // Get upcoming dues
  const upcomingDues: UpcomingDue[] = useMemo(() => {
    return schedules.
    filter((s) => s.status === 'Active').
    map((s) => {
      const dueDate = new Date(s.nextDueDate);
      const today = new Date();
      const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      return {
        id: s.id,
        name: s.expenseHead,
        vendor: s.vendorName,
        amount: s.amount,
        dueDate: s.nextDueDate,
        daysUntilDue: diffDays,
        status: diffDays < 0 ? 'overdue' : diffDays === 0 ? 'due_today' : 'upcoming'
      };
    }).
    sort((a, b) => a.daysUntilDue - b.daysUntilDue).
    slice(0, 5);
  }, [schedules]);

  // Filter schedules
  const filteredSchedules = useMemo(() => {
    return schedules.filter((s) => {
      const matchesSearch =
      searchQuery === '' ||
      s.expenseHead.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
      const matchesFrequency = frequencyFilter === 'all' || s.frequency === frequencyFilter;

      return matchesSearch && matchesStatus && matchesFrequency;
    });
  }, [schedules, searchQuery, statusFilter, frequencyFilter]);

  // Get selected schedule details
  const selectedSchedule = useMemo(() => {
    return schedules.find((s) => s.id === selectedScheduleId);
  }, [schedules, selectedScheduleId]);

  // --- Handlers ---
  const handleAddNew = () => {
    setFormData({
      vendorName: '',
      vendorCode: '',
      expenseHead: '',
      expenseCode: '',
      description: '',
      amount: 0,
      frequency: 'Monthly',
      nextDueDate: '',
      startDate: new Date().toISOString().split('T')[0],
      actionType: 'Reminder Only',
      status: 'Active',
      reminderDays: 3,
      notifyVia: ['email'],
      department: '',
      costCenter: '',
      notes: ''
    });
    setEditingId(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: Schedule) => {
    setFormData(item);
    setEditingId(item.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this schedule? Future automation will stop.')) {
      setSchedules((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleDuplicate = (item: Schedule) => {
    const newSchedule: Schedule = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      status: 'Paused',
      executionCount: 0,
      totalAmountProcessed: 0,
      lastExecuted: undefined,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setSchedules([...schedules, newSchedule]);
  };

  const toggleStatus = (id: string) => {
    setSchedules((prev) =>
    prev.map((s) =>
    s.id === id ? { ...s, status: s.status === 'Active' ? 'Paused' : 'Active' } : s
    )
    );
  };

  const toggleNotification = (type: 'email' | 'sms' | 'push') => {
    const current = formData.notifyVia || [];
    if (current.includes(type)) {
      setFormData({ ...formData, notifyVia: current.filter((n) => n !== type) });
    } else {
      setFormData({ ...formData, notifyVia: [...current, type] });
    }
  };

  const handleSave = () => {
    if (!formData.vendorName || !formData.expenseHead || !formData.nextDueDate) {
      alert('Please fill all mandatory fields.');
      return;
    }

    if (editingId) {
      setSchedules((prev) =>
      prev.map((s) => s.id === editingId ? { ...formData, id: editingId } as Schedule : s)
      );
    } else {
      const newSchedule: Schedule = {
        ...(formData as Schedule),
        id: Math.random().toString(36).substr(2, 9),
        executionCount: 0,
        totalAmountProcessed: 0,
        createdBy: 'Current User',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setSchedules([...schedules, newSchedule]);
    }
    setIsFormOpen(false);
  };

  const getStatusBadge = (status: Schedule['status']) => {
    switch (status) {
      case 'Active':
        return <Badge variant="success">Active</Badge>;
      case 'Paused':
        return <Badge variant="warning">Paused</Badge>;
      case 'Expired':
        return <Badge variant="danger">Expired</Badge>;
    }
  };

  const getActionTypeBadge = (actionType: Schedule['actionType']) => {
    switch (actionType) {
      case 'Auto-Voucher':
        return (
          <div className="flex items-center gap-2 text-purple-600">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Auto-Voucher</span>
          </div>);

      case 'Auto-Payment':
        return (
          <div className="flex items-center gap-2 text-green-600">
            <CreditCard className="w-4 h-4" />
            <span className="text-sm font-medium">Auto-Payment</span>
          </div>);

      case 'Reminder Only':
        return (
          <div className="flex items-center gap-2 text-blue-600">
            <BellRing className="w-4 h-4" />
            <span className="text-sm font-medium">Reminder Only</span>
          </div>);

    }
  };

  const getFrequencyIcon = (frequency: Schedule['frequency']) => {
    switch (frequency) {
      case 'Monthly':
        return <CalendarDays className="w-4 h-4" />;
      case 'Quarterly':
        return <CalendarRange className="w-4 h-4" />;
      case 'Half-Yearly':
        return <Calendar className="w-4 h-4" />;
      case 'Yearly':
        return <CalendarClock className="w-4 h-4" />;
      default:
        return <Repeat className="w-4 h-4" />;
    }
  };

  const getLogStatusBadge = (status: ExecutionLog['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="success">Success</Badge>;
      case 'failed':
        return <Badge variant="danger">Failed</Badge>;
      case 'skipped':
        return <Badge variant="warning">Skipped</Badge>;
    }
  };

  const getDaysUntilDueColor = (days: number) => {
    if (days < 0) return 'text-red-600 bg-red-50 border-red-200';
    if (days === 0) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (days <= 3) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  // --- Columns ---
  const columns = [
  {
    key: 'details',
    header: 'Expense Details',
    render: (row: Schedule) =>
    <div className="space-y-1">
          <div className="font-semibold text-gray-900">{row.expenseHead}</div>
          <div className="text-xs text-gray-500">{row.vendorName}</div>
          <div className="text-xs text-gray-400">{row.expenseCode}</div>
        </div>

  },
  {
    key: 'schedule',
    header: 'Schedule',
    render: (row: Schedule) =>
    <div className="space-y-1">
          <div className="flex items-center gap-2">
            {getFrequencyIcon(row.frequency)}
            <Badge variant="outline" className="bg-gray-50 border-gray-200">
              {row.frequency}
            </Badge>
          </div>
          <div className="text-xs text-gray-500">Next: {row.nextDueDate}</div>
          <div className="text-xs text-gray-400">Reminder: {row.reminderDays} days before</div>
        </div>

  },
  {
    key: 'amount',
    header: 'Amount',
    render: (row: Schedule) =>
    <div>
          <span className="font-mono text-lg font-bold text-gray-800">
            ₹{row.amount.toLocaleString()}
          </span>
          <div className="text-xs text-gray-500 mt-1">
            Processed: ₹{row.totalAmountProcessed.toLocaleString()}
          </div>
        </div>

  },
  {
    key: 'actionType',
    header: 'Automation',
    render: (row: Schedule) =>
    <div className="space-y-2">
          {getActionTypeBadge(row.actionType)}
          <div className="flex gap-1">
            {row.notifyVia.includes('email') &&
        <Mail className="w-3 h-3 text-gray-400" title="Email" />
        }
            {row.notifyVia.includes('sms') &&
        <Smartphone className="w-3 h-3 text-gray-400" title="SMS" />
        }
            {row.notifyVia.includes('push') &&
        <Bell className="w-3 h-3 text-gray-400" title="Push" />
        }
          </div>
        </div>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: Schedule) =>
    <div className="space-y-1">
          {getStatusBadge(row.status)}
          <div className="text-xs text-gray-500">{row.executionCount} executions</div>
        </div>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: Schedule) =>
    <div className="flex gap-1">
          <Button
        variant="ghost"
        size="sm"
        onClick={() => setSelectedScheduleId(row.id)}
        title="View Details">

            <Eye className="w-4 h-4 text-gray-500" />
          </Button>
          <Button
        variant="ghost"
        size="sm"
        onClick={() => toggleStatus(row.id)}
        title={row.status === 'Active' ? 'Pause' : 'Resume'}
        className={row.status === 'Active' ? 'text-orange-600' : 'text-green-600'}>

            {row.status === 'Active' ?
        <PauseCircle className="w-4 h-4" /> :

        <PlayCircle className="w-4 h-4" />
        }
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleEdit(row)} title="Edit">
            <Edit2 className="w-4 h-4 text-blue-600" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDuplicate(row)} title="Duplicate">
            <Copy className="w-4 h-4 text-purple-600" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(row.id)} title="Delete">
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>

  }];


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <CalendarClock className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Recurring Expense Scheduler</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Automate fixed bills like Rent, Internet, AMCs, and utility payments
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`
                  }>

                  List
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'cards' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`
                  }>

                  Cards
                </button>
                <button
                  onClick={() => setViewMode('history')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'history' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`
                  }>

                  <History className="w-4 h-4 mr-1 inline" />
                  Logs
                </button>
              </div>

              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>

              {!isFormOpen &&
              <Button variant="primary" onClick={handleAddNew}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Schedule
                </Button>
              }
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <PlayCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">{stats.activeSchedules}</p>
                <p className="text-xs text-gray-500">Active</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-orange-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <PauseCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-700">{stats.pausedSchedules}</p>
                <p className="text-xs text-gray-500">Paused</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-purple-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-700">{stats.autoVoucherCount}</p>
                <p className="text-xs text-gray-500">Auto-Voucher</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-blue-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Timer className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">{stats.upcomingThisWeek}</p>
                <p className="text-xs text-gray-500">Due This Week</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-indigo-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <IndianRupee className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-indigo-700">
                  ₹{(stats.totalMonthlyCommitment / 1000).toFixed(0)}K
                </p>
                <p className="text-xs text-gray-500">Monthly Avg</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-emerald-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-700">
                  ₹{(stats.totalProcessed / 100000).toFixed(1)}L
                </p>
                <p className="text-xs text-gray-500">Total Processed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Schedules List/Cards */}
          <div className={isFormOpen || selectedScheduleId ? 'lg:col-span-2' : 'lg:col-span-3'}>
            {viewMode !== 'history' &&
            <>
                {/* Search and Filters */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input
                      className="pl-10"
                      placeholder="Search by expense, vendor..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)} />

                    </div>
                    <Select
                    className="w-40"
                    options={[
                    { value: 'all', label: 'All Status' },
                    { value: 'Active', label: 'Active' },
                    { value: 'Paused', label: 'Paused' },
                    { value: 'Expired', label: 'Expired' }]
                    }
                    value={statusFilter}
                    onChange={(e: any) => setStatusFilter(e.target.value)} />

                    <Select
                    className="w-40"
                    options={[
                    { value: 'all', label: 'All Frequency' },
                    { value: 'Monthly', label: 'Monthly' },
                    { value: 'Quarterly', label: 'Quarterly' },
                    { value: 'Half-Yearly', label: 'Half-Yearly' },
                    { value: 'Yearly', label: 'Yearly' }]
                    }
                    value={frequencyFilter}
                    onChange={(e: any) => setFrequencyFilter(e.target.value)} />

                  </div>
                </div>

                {/* List View */}
                {viewMode === 'list' &&
              <Card className="p-0 border-gray-200 overflow-hidden">
                    <Table columns={columns} data={filteredSchedules} />
                    {filteredSchedules.length === 0 &&
                <div className="p-12 text-center">
                        <CalendarClock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-gray-500">No recurring expenses found</p>
                        <Button variant="outline" className="mt-4" onClick={handleAddNew}>
                          <Plus className="w-4 h-4 mr-2" />
                          Create First Schedule
                        </Button>
                      </div>
                }
                  </Card>
              }

                {/* Cards View */}
                {viewMode === 'cards' &&
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredSchedules.map((schedule) =>
                <div
                  key={schedule.id}
                  className={`bg-white rounded-xl border p-5 hover:shadow-md transition-shadow ${
                  schedule.status === 'Paused' ?
                  'border-orange-200 bg-orange-50/30' :
                  'border-gray-200'}`
                  }>

                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div
                        className={`p-2 rounded-lg ${
                        schedule.actionType === 'Auto-Voucher' ?
                        'bg-purple-100' :
                        schedule.actionType === 'Auto-Payment' ?
                        'bg-green-100' :
                        'bg-blue-100'}`
                        }>

                              {schedule.actionType === 'Auto-Voucher' ?
                        <Zap className="w-5 h-5 text-purple-600" /> :
                        schedule.actionType === 'Auto-Payment' ?
                        <CreditCard className="w-5 h-5 text-green-600" /> :

                        <BellRing className="w-5 h-5 text-blue-600" />
                        }
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{schedule.expenseHead}</h4>
                              <p className="text-xs text-gray-500">{schedule.vendorName}</p>
                            </div>
                          </div>
                          {getStatusBadge(schedule.status)}
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Amount</span>
                            <span className="text-lg font-bold text-gray-900">
                              ₹{schedule.amount.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Frequency</span>
                            <Badge variant="outline">{schedule.frequency}</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Next Due</span>
                            <span className="text-sm font-medium text-gray-700">
                              {schedule.nextDueDate}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                          <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedScheduleId(schedule.id)}>

                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(schedule)}>

                            <Edit2 className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleStatus(schedule.id)}
                      className={schedule.status === 'Active' ? 'text-orange-600' : 'text-green-600'}>

                            {schedule.status === 'Active' ?
                      <PauseCircle className="w-4 h-4" /> :

                      <PlayCircle className="w-4 h-4" />
                      }
                          </Button>
                        </div>
                      </div>
                )}
                  </div>
              }
              </>
            }

            {/* History View */}
            {viewMode === 'history' &&
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Execution Logs</h3>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
                <div className="divide-y divide-gray-100">
                  {EXECUTION_LOGS.map((log) =>
                <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div
                        className={`p-2 rounded-lg ${
                        log.status === 'success' ?
                        'bg-green-100' :
                        log.status === 'failed' ?
                        'bg-red-100' :
                        'bg-yellow-100'}`
                        }>

                            {log.type === 'voucher' ?
                        <FileText
                          className={`w-4 h-4 ${
                          log.status === 'success' ?
                          'text-green-600' :
                          log.status === 'failed' ?
                          'text-red-600' :
                          'text-yellow-600'}`
                          } /> :

                        log.type === 'payment' ?
                        <CreditCard
                          className={`w-4 h-4 ${
                          log.status === 'success' ?
                          'text-green-600' :
                          log.status === 'failed' ?
                          'text-red-600' :
                          'text-yellow-600'}`
                          } /> :


                        <Bell
                          className={`w-4 h-4 ${
                          log.status === 'success' ?
                          'text-green-600' :
                          log.status === 'failed' ?
                          'text-red-600' :
                          'text-yellow-600'}`
                          } />

                        }
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{log.scheduleName}</p>
                            <p className="text-sm text-gray-500 mt-1">{log.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{log.executedAt}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {getLogStatusBadge(log.status)}
                          <p className="text-sm font-bold text-gray-900 mt-2">
                            ₹{log.amount.toLocaleString()}
                          </p>
                          {log.voucherId &&
                      <p className="text-xs text-gray-500 mt-1">{log.voucherId}</p>
                      }
                        </div>
                      </div>
                    </div>
                )}
                </div>
              </div>
            }
          </div>

          {/* Sidebar - Upcoming Dues or Form or Details */}
          <div className={isFormOpen || selectedScheduleId ? 'lg:col-span-2' : 'lg:col-span-1'}>
            {/* Form Panel */}
            {isFormOpen &&
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-in slide-in-from-right-4">
                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">
                    {editingId ? 'Edit Schedule' : 'New Recurring Expense'}
                  </h3>
                  <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-full">

                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="p-6 space-y-5">
                  <Select
                  label="Expense Head *"
                  options={EXPENSE_HEADS}
                  value={formData.expenseHead}
                  onChange={(e: any) => setFormData({ ...formData, expenseHead: e.target.value })} />


                  <Select
                  label="Vendor / Payee *"
                  options={VENDORS}
                  value={formData.vendorName}
                  onChange={(e: any) => setFormData({ ...formData, vendorName: e.target.value })} />


                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Description
                    </label>
                    <textarea
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    rows={2}
                    placeholder="Brief description of this recurring expense..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} />

                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Fixed Amount (₹) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                        <Input
                        type="number"
                        className="pl-7"
                        value={formData.amount}
                        onChange={(e) =>
                        setFormData({ ...formData, amount: Number(e.target.value) })
                        } />

                      </div>
                    </div>
                    <Select
                    label="Frequency *"
                    options={FREQUENCIES.map((f) => ({ value: f.value, label: f.label }))}
                    value={formData.frequency}
                    onChange={(e: any) =>
                    setFormData({ ...formData, frequency: e.target.value as any })
                    } />

                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Start Date *
                      </label>
                      <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />

                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Next Due Date *
                      </label>
                      <Input
                      type="date"
                      value={formData.nextDueDate}
                      onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })} />

                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Select
                    label="Department"
                    options={DEPARTMENTS}
                    value={formData.department}
                    onChange={(e: any) => setFormData({ ...formData, department: e.target.value })} />

                    <Select
                    label="Cost Center"
                    options={COST_CENTERS}
                    value={formData.costCenter}
                    onChange={(e: any) => setFormData({ ...formData, costCenter: e.target.value })} />

                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Automation Action *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <div
                      onClick={() => setFormData({ ...formData, actionType: 'Reminder Only' })}
                      className={`cursor-pointer p-3 border rounded-xl flex flex-col items-center justify-center gap-2 text-center transition-all ${
                      formData.actionType === 'Reminder Only' ?
                      'bg-blue-50 border-blue-500 ring-1 ring-blue-500' :
                      'bg-white border-gray-200 hover:bg-gray-50'}`
                      }>

                        <BellRing
                        className={`w-5 h-5 ${
                        formData.actionType === 'Reminder Only' ? 'text-blue-600' : 'text-gray-400'}`
                        } />

                        <span className="text-xs font-semibold text-gray-700">Reminder</span>
                      </div>

                      <div
                      onClick={() => setFormData({ ...formData, actionType: 'Auto-Voucher' })}
                      className={`cursor-pointer p-3 border rounded-xl flex flex-col items-center justify-center gap-2 text-center transition-all ${
                      formData.actionType === 'Auto-Voucher' ?
                      'bg-purple-50 border-purple-500 ring-1 ring-purple-500' :
                      'bg-white border-gray-200 hover:bg-gray-50'}`
                      }>

                        <Zap
                        className={`w-5 h-5 ${
                        formData.actionType === 'Auto-Voucher' ? 'text-purple-600' : 'text-gray-400'}`
                        } />

                        <span className="text-xs font-semibold text-gray-700">Auto-Voucher</span>
                      </div>

                      <div
                      onClick={() => setFormData({ ...formData, actionType: 'Auto-Payment' })}
                      className={`cursor-pointer p-3 border rounded-xl flex flex-col items-center justify-center gap-2 text-center transition-all ${
                      formData.actionType === 'Auto-Payment' ?
                      'bg-green-50 border-green-500 ring-1 ring-green-500' :
                      'bg-white border-gray-200 hover:bg-gray-50'}`
                      }>

                        <CreditCard
                        className={`w-5 h-5 ${
                        formData.actionType === 'Auto-Payment' ? 'text-green-600' : 'text-gray-400'}`
                        } />

                        <span className="text-xs font-semibold text-gray-700">Auto-Pay</span>
                      </div>
                    </div>
                  </div>

                  {/* Advanced Options */}
                  <div>
                    <button
                    onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">

                      {showAdvancedOptions ?
                    <ChevronUp className="w-4 h-4" /> :

                    <ChevronDown className="w-4 h-4" />
                    }
                      <span>Advanced Options</span>
                    </button>

                    {showAdvancedOptions &&
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4 animate-in fade-in">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                            Reminder Days Before Due
                          </label>
                          <Input
                        type="number"
                        min="1"
                        max="30"
                        value={formData.reminderDays}
                        onChange={(e) =>
                        setFormData({ ...formData, reminderDays: Number(e.target.value) })
                        } />

                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Notification Channels
                          </label>
                          <div className="flex gap-3">
                            <button
                          onClick={() => toggleNotification('email')}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                          formData.notifyVia?.includes('email') ?
                          'bg-blue-50 border-blue-300 text-blue-700' :
                          'bg-white border-gray-200 text-gray-600'}`
                          }>

                              <Mail className="w-4 h-4" />
                              <span className="text-sm">Email</span>
                            </button>
                            <button
                          onClick={() => toggleNotification('sms')}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                          formData.notifyVia?.includes('sms') ?
                          'bg-green-50 border-green-300 text-green-700' :
                          'bg-white border-gray-200 text-gray-600'}`
                          }>

                              <Smartphone className="w-4 h-4" />
                              <span className="text-sm">SMS</span>
                            </button>
                            <button
                          onClick={() => toggleNotification('push')}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                          formData.notifyVia?.includes('push') ?
                          'bg-purple-50 border-purple-300 text-purple-700' :
                          'bg-white border-gray-200 text-gray-600'}`
                          }>

                              <Bell className="w-4 h-4" />
                              <span className="text-sm">Push</span>
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                            Notes
                          </label>
                          <textarea
                        className="w-full border border-gray-300 rounded-lg p-3 text-sm"
                        rows={2}
                        placeholder="Any additional notes..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />

                        </div>
                      </div>
                  }
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <Button variant="outline" className="flex-1" onClick={() => setIsFormOpen(false)}>
                      <RotateCcw className="w-4 h-4 mr-2" /> Cancel
                    </Button>
                    <Button variant="primary" className="flex-1" onClick={handleSave}>
                      <Save className="w-4 h-4 mr-2" /> Save Schedule
                    </Button>
                  </div>
                </div>
              </div>
            }

            {/* Schedule Details Panel */}
            {selectedScheduleId && selectedSchedule && !isFormOpen &&
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-in slide-in-from-right-4">
                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Schedule Details</h3>
                  <button
                  onClick={() => setSelectedScheduleId(null)}
                  className="p-1.5 hover:bg-gray-100 rounded-full">

                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Header */}
                  <div className="flex items-start gap-4">
                    <div
                    className={`p-3 rounded-xl ${
                    selectedSchedule.actionType === 'Auto-Voucher' ?
                    'bg-purple-100' :
                    selectedSchedule.actionType === 'Auto-Payment' ?
                    'bg-green-100' :
                    'bg-blue-100'}`
                    }>

                      {selectedSchedule.actionType === 'Auto-Voucher' ?
                    <Zap className="w-6 h-6 text-purple-600" /> :
                    selectedSchedule.actionType === 'Auto-Payment' ?
                    <CreditCard className="w-6 h-6 text-green-600" /> :

                    <BellRing className="w-6 h-6 text-blue-600" />
                    }
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-bold text-gray-900">{selectedSchedule.expenseHead}</h4>
                        {getStatusBadge(selectedSchedule.status)}
                      </div>
                      <p className="text-sm text-gray-500">{selectedSchedule.vendorName}</p>
                      <p className="text-xs text-gray-400 mt-1">{selectedSchedule.expenseCode}</p>
                    </div>
                  </div>

                  {/* Description */}
                  {selectedSchedule.description &&
                <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">{selectedSchedule.description}</p>
                    </div>
                }

                  {/* Details Grid */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-purple-50 rounded-xl text-center">
                        <p className="text-2xl font-bold text-purple-700">
                          ₹{selectedSchedule.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-purple-600 mt-1">Per {selectedSchedule.frequency}</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-xl text-center">
                        <p className="text-2xl font-bold text-blue-700">
                          {selectedSchedule.executionCount}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">Executions</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-500">Frequency</span>
                        <Badge variant="outline">{selectedSchedule.frequency}</Badge>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-500">Next Due</span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedSchedule.nextDueDate}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-500">Last Executed</span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedSchedule.lastExecuted || 'Never'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-500">Total Processed</span>
                        <span className="text-sm font-bold text-green-600">
                          ₹{selectedSchedule.totalAmountProcessed.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-500">Department</span>
                        <span className="text-sm text-gray-900">{selectedSchedule.department}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-500">Cost Center</span>
                        <span className="text-sm text-gray-900">{selectedSchedule.costCenter}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-500">Notifications</span>
                        <div className="flex gap-2">
                          {selectedSchedule.notifyVia.map((channel) =>
                        <Badge key={channel} variant="outline" className="capitalize">
                              {channel}
                            </Badge>
                        )}
                        </div>
                      </div>
                    </div>

                    {selectedSchedule.notes &&
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                        <p className="text-xs font-medium text-yellow-800 mb-1">Notes</p>
                        <p className="text-sm text-yellow-700">{selectedSchedule.notes}</p>
                      </div>
                  }
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <Button variant="outline" className="flex-1" onClick={() => handleEdit(selectedSchedule)}>
                      <Edit2 className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button
                    variant={selectedSchedule.status === 'Active' ? 'outline' : 'primary'}
                    className="flex-1"
                    onClick={() => toggleStatus(selectedSchedule.id)}>

                      {selectedSchedule.status === 'Active' ?
                    <>
                          <PauseCircle className="w-4 h-4 mr-2" /> Pause
                        </> :

                    <>
                          <PlayCircle className="w-4 h-4 mr-2" /> Resume
                        </>
                    }
                    </Button>
                  </div>
                </div>
              </div>
            }

            {/* Upcoming Dues (when no form/details open) */}
            {!isFormOpen && !selectedScheduleId && viewMode !== 'history' &&
            <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Timer className="w-4 h-4 text-orange-500" />
                      Upcoming Dues
                    </h3>
                    <Badge variant="warning">{upcomingDues.length}</Badge>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {upcomingDues.map((due) =>
                  <div
                    key={due.id}
                    className={`p-4 ${getDaysUntilDueColor(due.daysUntilDue).split(' ')[1]} border-l-4 ${getDaysUntilDueColor(due.daysUntilDue).split(' ')[2]}`}>

                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{due.name}</p>
                            <p className="text-xs text-gray-500">{due.vendor}</p>
                          </div>
                          <span className="text-sm font-bold text-gray-900">
                            ₹{due.amount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">{due.dueDate}</span>
                          <span
                        className={`text-xs font-medium ${getDaysUntilDueColor(due.daysUntilDue).split(' ')[0]}`}>

                            {due.daysUntilDue < 0 ?
                        `${Math.abs(due.daysUntilDue)} days overdue` :
                        due.daysUntilDue === 0 ?
                        'Due Today' :
                        `${due.daysUntilDue} days left`}
                          </span>
                        </div>
                      </div>
                  )}
                  </div>
                </div>

                {/* Quick Tips */}
                <div className="bg-purple-50 rounded-xl border border-purple-200 p-4">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-purple-900 mb-2">Automation Tips</h4>
                      <ul className="space-y-1.5 text-sm text-purple-700">
                        <li className="flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                          <span>Auto-Voucher creates expense voucher automatically</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                          <span>Auto-Payment initiates bank transfer on due date</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                          <span>Set reminders for manual payment entries</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
          <div className="flex items-start gap-4">
            <HelpCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-3">Recurring Expense Scheduler Guide</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-blue-800">
                <div>
                  <h4 className="font-medium mb-2">Setting Up Schedules</h4>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      Define expense head and vendor
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      Set fixed amount and frequency
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      Choose automation action type
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Automation Types</h4>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2">
                      <BellRing className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      Reminder: Sends notification only
                    </li>
                    <li className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      Auto-Voucher: Creates expense voucher
                    </li>
                    <li className="flex items-start gap-2">
                      <CreditCard className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      Auto-Payment: Initiates bank transfer
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Best Practices</h4>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      Set reminders 3-7 days before due
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      Review schedules monthly
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      Pause schedules during contract review
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Modals */}
      <InfoModal
        isOpen={activeInfoModal === 'schedule'}
        onClose={() => setActiveInfoModal(null)}
        title="Recurring Expense Scheduler"
        description="Automate fixed recurring expenses like rent, utilities, and maintenance contracts. The system can create vouchers, initiate payments, or send reminders automatically."
        dataSource={[
        'Vendor Master Database',
        'Expense Head Configuration',
        'Payment Calendar System']
        }
        whyItMatters={[
        'Never miss a recurring payment deadline',
        'Reduces manual data entry and errors',
        'Improves cash flow predictability']
        } />

    </div>);

}