// NotificationQueueResendUtility.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  RefreshCw,
  Trash2,
  Mail,
  MessageSquare,
  Bell,
  Search,
  Filter,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye,
  RotateCcw,
  Download,
  ChevronDown } from
'lucide-react';

interface QueueItem {
  id: number;
  recipient: string;
  recipientEmail?: string;
  recipientPhone?: string;
  channel: 'SMS' | 'Email' | 'App';
  subject: string;
  message: string;
  status: 'Failed' | 'Pending' | 'Processing' | 'Sent';
  retry: number;
  maxRetries: number;
  time: string;
  timestamp: Date;
  errorMessage?: string;
  priority: 'High' | 'Medium' | 'Low';
  category: string;
  selected?: boolean;
}

interface NotificationStats {
  pending: number;
  failed: number;
  sentToday: number;
  processing: number;
}

export function NotificationQueueResendUtility() {
  // Initial mock data
  const initialQueue: QueueItem[] = [
  {
    id: 1,
    recipient: 'Rahul Sharma (Parent)',
    recipientEmail: 'rahul.sharma@email.com',
    recipientPhone: '+91 98765 43210',
    channel: 'SMS',
    subject: 'Fee Reminder',
    message: 'Dear Parent, this is a reminder that the school fee for the month of January is due. Please pay by the 15th to avoid late fees.',
    status: 'Failed',
    retry: 2,
    maxRetries: 5,
    time: '10 mins ago',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    errorMessage: 'SMS gateway timeout - provider unreachable',
    priority: 'High',
    category: 'Fee Collection'
  },
  {
    id: 2,
    recipient: 'Staff Group',
    recipientEmail: 'staff@school.edu',
    channel: 'Email',
    subject: 'Meeting Notice',
    message: 'All staff members are requested to attend the monthly review meeting scheduled for tomorrow at 10:00 AM in the conference room.',
    status: 'Pending',
    retry: 0,
    maxRetries: 5,
    time: '2 mins ago',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    priority: 'Medium',
    category: 'Staff Communication'
  },
  {
    id: 3,
    recipient: 'Priya Patel',
    recipientEmail: 'priya.patel@email.com',
    channel: 'App',
    subject: 'Homework Alert',
    message: 'Your child has been assigned new homework in Mathematics. Please ensure completion by Friday.',
    status: 'Failed',
    retry: 3,
    maxRetries: 5,
    time: '1 hour ago',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    errorMessage: 'Push notification service unavailable',
    priority: 'Medium',
    category: 'Academic'
  },
  {
    id: 4,
    recipient: 'Class 10-A Parents',
    recipientEmail: 'class10a-parents@school.edu',
    channel: 'Email',
    subject: 'PTM Schedule',
    message: 'Parent-Teacher Meeting for Class 10-A is scheduled for next Saturday from 9:00 AM to 1:00 PM.',
    status: 'Pending',
    retry: 0,
    maxRetries: 5,
    time: '5 mins ago',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    priority: 'High',
    category: 'Parent Communication'
  },
  {
    id: 5,
    recipient: 'Amit Kumar (Parent)',
    recipientPhone: '+91 87654 32109',
    channel: 'SMS',
    subject: 'Attendance Alert',
    message: 'Your child was marked absent today. Please contact the school office if this is an error.',
    status: 'Failed',
    retry: 4,
    maxRetries: 5,
    time: '30 mins ago',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    errorMessage: 'Invalid phone number format',
    priority: 'High',
    category: 'Attendance'
  },
  {
    id: 6,
    recipient: 'All Students',
    channel: 'App',
    subject: 'Holiday Announcement',
    message: 'School will remain closed on Monday due to the national holiday. Classes will resume on Tuesday.',
    status: 'Pending',
    retry: 0,
    maxRetries: 5,
    time: '1 min ago',
    timestamp: new Date(Date.now() - 1 * 60 * 1000),
    priority: 'Low',
    category: 'Announcement'
  },
  {
    id: 7,
    recipient: 'Transport Department',
    recipientEmail: 'transport@school.edu',
    channel: 'Email',
    subject: 'Route Change Notice',
    message: 'Bus route 7 has been modified due to road construction. Please check the updated schedule.',
    status: 'Failed',
    retry: 1,
    maxRetries: 5,
    time: '45 mins ago',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    errorMessage: 'SMTP server connection refused',
    priority: 'Medium',
    category: 'Transport'
  },
  {
    id: 8,
    recipient: 'Sneha Reddy (Parent)',
    recipientPhone: '+91 76543 21098',
    channel: 'SMS',
    subject: 'Exam Schedule',
    message: 'Final examination schedule has been released. Please check the school portal for detailed timetable.',
    status: 'Pending',
    retry: 0,
    maxRetries: 5,
    time: '8 mins ago',
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    priority: 'High',
    category: 'Examination'
  },
  {
    id: 9,
    recipient: 'Library Committee',
    recipientEmail: 'library@school.edu',
    channel: 'Email',
    subject: 'Book Return Reminder',
    message: 'Multiple books are overdue for return. Please remind the students to return their borrowed books.',
    status: 'Failed',
    retry: 2,
    maxRetries: 5,
    time: '2 hours ago',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    errorMessage: 'Recipient mailbox full',
    priority: 'Low',
    category: 'Library'
  },
  {
    id: 10,
    recipient: 'Vikram Singh (Parent)',
    channel: 'App',
    subject: 'Report Card Available',
    message: 'Your child\'s quarterly report card is now available for download on the school portal.',
    status: 'Pending',
    retry: 0,
    maxRetries: 5,
    time: '3 mins ago',
    timestamp: new Date(Date.now() - 3 * 60 * 1000),
    priority: 'Medium',
    category: 'Academic'
  }];


  // State management
  const [queue, setQueue] = useState<QueueItem[]>(initialQueue);
  const [filteredQueue, setFilteredQueue] = useState<QueueItem[]>(initialQueue);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [channelFilter, setChannelFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [detailModal, setDetailModal] = useState<QueueItem | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'clearFailed' | 'retryAll' | 'deleteSelected' | 'retrySelected' | null;
    message: string;
  }>({ isOpen: false, type: null, message: '' });
  const [toast, setToast] = useState<{
    isVisible: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({ isVisible: false, message: '', type: 'info' });
  const [processingItems, setProcessingItems] = useState<number[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  }>({ key: 'timestamp', direction: 'desc' });

  // Calculate statistics
  const stats: NotificationStats = {
    pending: queue.filter((item) => item.status === 'Pending').length,
    failed: queue.filter((item) => item.status === 'Failed').length,
    sentToday: queue.filter((item) => item.status === 'Sent').length + 1235,
    processing: queue.filter((item) => item.status === 'Processing').length
  };

  // Show toast notification
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setToast({ isVisible: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, isVisible: false })), 4000);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let result = [...queue];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((item) =>
      item.recipient.toLowerCase().includes(term) ||
      item.subject.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term) ||
      item.message.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== 'All') {
      result = result.filter((item) => item.status === statusFilter);
    }

    // Apply channel filter
    if (channelFilter !== 'All') {
      result = result.filter((item) => item.channel === channelFilter);
    }

    // Apply priority filter
    if (priorityFilter !== 'All') {
      result = result.filter((item) => item.priority === priorityFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof QueueItem];
      const bValue = b[sortConfig.key as keyof QueueItem];

      if (sortConfig.key === 'timestamp') {
        const aTime = new Date(a.timestamp).getTime();
        const bTime = new Date(b.timestamp).getTime();
        return sortConfig.direction === 'asc' ? aTime - bTime : bTime - aTime;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' ?
        aValue.localeCompare(bValue) :
        bValue.localeCompare(aValue);
      }

      return 0;
    });

    setFilteredQueue(result);
  }, [queue, searchTerm, statusFilter, channelFilter, priorityFilter, sortConfig]);

  // Auto-refresh functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        handleRefresh();
      }, 30000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate new items being added
    const newItem: QueueItem = {
      id: Date.now(),
      recipient: `New Recipient ${Math.floor(Math.random() * 100)}`,
      recipientEmail: `user${Math.floor(Math.random() * 100)}@email.com`,
      channel: ['SMS', 'Email', 'App'][Math.floor(Math.random() * 3)] as 'SMS' | 'Email' | 'App',
      subject: 'New Notification',
      message: 'This is a newly added notification item.',
      status: 'Pending',
      retry: 0,
      maxRetries: 5,
      time: 'Just now',
      timestamp: new Date(),
      priority: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)] as 'High' | 'Medium' | 'Low',
      category: 'General'
    };

    setQueue((prev) => [newItem, ...prev]);
    setIsRefreshing(false);
    showToast('Queue refreshed successfully', 'success');
  };

  // Retry single notification
  const handleRetrySingle = async (id: number) => {
    setProcessingItems((prev) => [...prev, id]);

    // Update status to Processing
    setQueue((prev) => prev.map((item) =>
    item.id === id ? { ...item, status: 'Processing' as const } : item
    ));

    // Simulate retry process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Random success/failure (70% success rate)
    const success = Math.random() > 0.3;

    setQueue((prev) => prev.map((item) => {
      if (item.id === id) {
        if (success) {
          return {
            ...item,
            status: 'Sent' as const,
            time: 'Just now',
            timestamp: new Date(),
            errorMessage: undefined
          };
        } else {
          return {
            ...item,
            status: 'Failed' as const,
            retry: item.retry + 1,
            time: 'Just now',
            timestamp: new Date(),
            errorMessage: 'Retry failed - service temporarily unavailable'
          };
        }
      }
      return item;
    }));

    setProcessingItems((prev) => prev.filter((itemId) => itemId !== id));
    showToast(
      success ? 'Notification sent successfully' : 'Retry failed - will try again later',
      success ? 'success' : 'error'
    );
  };

  // Retry all failed notifications
  const handleRetryAllFailed = async () => {
    const failedItems = queue.filter((item) => item.status === 'Failed');

    if (failedItems.length === 0) {
      showToast('No failed notifications to retry', 'info');
      return;
    }

    setConfirmModal({ isOpen: false, type: null, message: '' });

    for (const item of failedItems) {
      await handleRetrySingle(item.id);
      // Small delay between retries
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    showToast(`Processed ${failedItems.length} failed notifications`, 'success');
  };

  // Clear failed notifications
  const handleClearFailed = () => {
    const failedCount = queue.filter((item) => item.status === 'Failed').length;

    if (failedCount === 0) {
      showToast('No failed notifications to clear', 'info');
      return;
    }

    setQueue((prev) => prev.filter((item) => item.status !== 'Failed'));
    setSelectedItems((prev) => prev.filter((id) =>
    !queue.find((item) => item.id === id && item.status === 'Failed')
    ));
    setConfirmModal({ isOpen: false, type: null, message: '' });
    showToast(`Cleared ${failedCount} failed notifications`, 'success');
  };

  // Delete single notification
  const handleDeleteSingle = (id: number) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
    setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
    showToast('Notification removed from queue', 'success');
  };

  // Handle selection
  const handleSelectItem = (id: number) => {
    setSelectedItems((prev) => {
      if (prev.includes(id)) {
        return prev.filter((itemId) => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredQueue.map((item) => item.id));
    }
    setSelectAll(!selectAll);
  };

  // Retry selected items
  const handleRetrySelected = async () => {
    if (selectedItems.length === 0) {
      showToast('No items selected', 'info');
      return;
    }

    setConfirmModal({ isOpen: false, type: null, message: '' });

    for (const id of selectedItems) {
      const item = queue.find((q) => q.id === id);
      if (item && (item.status === 'Failed' || item.status === 'Pending')) {
        await handleRetrySingle(id);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    setSelectedItems([]);
    setSelectAll(false);
    showToast(`Processed ${selectedItems.length} selected notifications`, 'success');
  };

  // Delete selected items
  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) {
      showToast('No items selected', 'info');
      return;
    }

    setQueue((prev) => prev.filter((item) => !selectedItems.includes(item.id)));
    setSelectedItems([]);
    setSelectAll(false);
    setConfirmModal({ isOpen: false, type: null, message: '' });
    showToast(`Deleted ${selectedItems.length} notifications`, 'success');
  };

  // Export queue data
  const handleExport = () => {
    const exportData = filteredQueue.map((item) => ({
      Recipient: item.recipient,
      Channel: item.channel,
      Subject: item.subject,
      Status: item.status,
      Retries: item.retry,
      Priority: item.priority,
      Category: item.category,
      Time: item.time,
      Error: item.errorMessage || 'N/A'
    }));

    const csvContent = [
    Object.keys(exportData[0]).join(','),
    ...exportData.map((row) => Object.values(row).join(','))].
    join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notification-queue-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    showToast('Queue data exported successfully', 'success');
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setChannelFilter('All');
    setPriorityFilter('All');
  };

  // View notification details
  const handleViewDetails = (item: QueueItem) => {
    setDetailModal(item);
  };

  // Table columns with interactive actions
  const columns = [
  {
    key: 'select',
    header:
    <input
      type="checkbox"
      checked={selectAll}
      onChange={handleSelectAll}
      className="w-4 h-4 rounded border-gray-300" />,


    render: (row: QueueItem) =>
    <input
      type="checkbox"
      checked={selectedItems.includes(row.id)}
      onChange={() => handleSelectItem(row.id)}
      className="w-4 h-4 rounded border-gray-300" />


  },
  {
    key: 'recipient',
    header: 'Recipient',
    render: (row: QueueItem) =>
    <div>
          <p className="font-medium text-gray-900">{row.recipient}</p>
          <p className="text-xs text-gray-500">{row.category}</p>
        </div>

  },
  {
    key: 'channel',
    header: 'Channel',
    render: (row: QueueItem) =>
    <div className="flex items-center gap-2">
          {row.channel === 'SMS' &&
      <MessageSquare className="w-4 h-4 text-blue-500" />
      }
          {row.channel === 'Email' &&
      <Mail className="w-4 h-4 text-orange-500" />
      }
          {row.channel === 'App' &&
      <Bell className="w-4 h-4 text-purple-500" />
      }
          <span>{row.channel}</span>
        </div>

  },
  {
    key: 'subject',
    header: 'Subject',
    render: (row: QueueItem) =>
    <div>
          <p className="font-medium">{row.subject}</p>
          <p className="text-xs text-gray-500 truncate max-w-[200px]">
            {row.message.substring(0, 50)}...
          </p>
        </div>

  },
  {
    key: 'priority',
    header: 'Priority',
    render: (row: QueueItem) =>
    <Badge
      variant={
      row.priority === 'High' ? 'danger' :
      row.priority === 'Medium' ? 'warning' : 'default'
      }>

          {row.priority}
        </Badge>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: QueueItem) =>
    <div className="flex items-center gap-2">
          {row.status === 'Processing' ?
      <RefreshCw className="w-4 h-4 animate-spin text-blue-500" /> :
      row.status === 'Sent' ?
      <CheckCircle className="w-4 h-4 text-green-500" /> :
      row.status === 'Failed' ?
      <AlertCircle className="w-4 h-4 text-red-500" /> :

      <Clock className="w-4 h-4 text-orange-500" />
      }
          <Badge
        variant={
        row.status === 'Failed' ? 'danger' :
        row.status === 'Sent' ? 'success' :
        row.status === 'Processing' ? 'info' : 'warning'
        }>

            {row.status}
          </Badge>
        </div>

  },
  {
    key: 'retry',
    header: 'Retries',
    render: (row: QueueItem) =>
    <span className={row.retry >= row.maxRetries - 1 ? 'text-red-600 font-medium' : ''}>
          {row.retry}/{row.maxRetries}
        </span>

  },
  {
    key: 'time',
    header: 'Queued'
  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: QueueItem) =>
    <div className="flex items-center gap-1">
          <Button
        variant="ghost"
        size="xs"
        title="View Details"
        onClick={() => handleViewDetails(row)}>

            <Eye className="w-4 h-4" />
          </Button>
          {(row.status === 'Failed' || row.status === 'Pending') &&
      <Button
        variant="ghost"
        size="xs"
        title="Retry Now"
        onClick={() => handleRetrySingle(row.id)}
        disabled={processingItems.includes(row.id)}>

              {processingItems.includes(row.id) ?
        <RefreshCw className="w-4 h-4 animate-spin" /> :

        <RotateCcw className="w-4 h-4" />
        }
            </Button>
      }
          <Button
        variant="ghost"
        size="xs"
        title="Delete"
        onClick={() => handleDeleteSingle(row.id)}
        className="text-red-500 hover:text-red-700">

            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

  }];


  return (
    <div className="space-y-6 p-6">
      {/* Toast Notification */}
      {toast.isVisible &&
      <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
      toast.type === 'success' ? 'bg-green-500 text-white' :
      toast.type === 'error' ? 'bg-red-500 text-white' :
      'bg-blue-500 text-white'}`
      }>
          {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
          {toast.type === 'info' && <Bell className="w-5 h-5" />}
          <span>{toast.message}</span>
          <button onClick={() => setToast((prev) => ({ ...prev, isVisible: false }))}>
            <X className="w-4 h-4" />
          </button>
        </div>
      }

      {/* Confirmation Modal */}
      {confirmModal.isOpen &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Confirm Action</h3>
            <p className="text-gray-600 mb-4">{confirmModal.message}</p>
            <div className="flex justify-end gap-2">
              <Button
              variant="outline"
              onClick={() => setConfirmModal({ isOpen: false, type: null, message: '' })}>

                Cancel
              </Button>
              <Button
              variant={confirmModal.type === 'clearFailed' || confirmModal.type === 'deleteSelected' ? 'danger' : 'primary'}
              onClick={() => {
                if (confirmModal.type === 'clearFailed') handleClearFailed();else
                if (confirmModal.type === 'retryAll') handleRetryAllFailed();else
                if (confirmModal.type === 'deleteSelected') handleDeleteSelected();else
                if (confirmModal.type === 'retrySelected') handleRetrySelected();
              }}>

                Confirm
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Detail Modal */}
      {detailModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">Notification Details</h3>
              <button onClick={() => setDetailModal(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Recipient</label>
                  <p className="font-medium">{detailModal.recipient}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Channel</label>
                  <p className="font-medium flex items-center gap-2">
                    {detailModal.channel === 'SMS' && <MessageSquare className="w-4 h-4 text-blue-500" />}
                    {detailModal.channel === 'Email' && <Mail className="w-4 h-4 text-orange-500" />}
                    {detailModal.channel === 'App' && <Bell className="w-4 h-4 text-purple-500" />}
                    {detailModal.channel}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Status</label>
                  <p>
                    <Badge
                    variant={
                    detailModal.status === 'Failed' ? 'danger' :
                    detailModal.status === 'Sent' ? 'success' : 'warning'
                    }>

                      {detailModal.status}
                    </Badge>
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Priority</label>
                  <p>
                    <Badge
                    variant={
                    detailModal.priority === 'High' ? 'danger' :
                    detailModal.priority === 'Medium' ? 'warning' : 'default'
                    }>

                      {detailModal.priority}
                    </Badge>
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Category</label>
                  <p className="font-medium">{detailModal.category}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Retries</label>
                  <p className="font-medium">{detailModal.retry}/{detailModal.maxRetries}</p>
                </div>
                {detailModal.recipientEmail &&
              <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="font-medium">{detailModal.recipientEmail}</p>
                  </div>
              }
                {detailModal.recipientPhone &&
              <div>
                    <label className="text-sm text-gray-500">Phone</label>
                    <p className="font-medium">{detailModal.recipientPhone}</p>
                  </div>
              }
              </div>
              
              <div>
                <label className="text-sm text-gray-500">Subject</label>
                <p className="font-medium">{detailModal.subject}</p>
              </div>
              
              <div>
                <label className="text-sm text-gray-500">Message</label>
                <p className="bg-gray-50 p-3 rounded-lg">{detailModal.message}</p>
              </div>
              
              {detailModal.errorMessage &&
            <div>
                  <label className="text-sm text-gray-500">Error Message</label>
                  <p className="bg-red-50 p-3 rounded-lg text-red-700">{detailModal.errorMessage}</p>
                </div>
            }
              
              <div>
                <label className="text-sm text-gray-500">Queued</label>
                <p className="font-medium">{detailModal.time} ({detailModal.timestamp.toLocaleString()})</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setDetailModal(null)}>
                Close
              </Button>
              {(detailModal.status === 'Failed' || detailModal.status === 'Pending') &&
            <Button onClick={() => {
              handleRetrySingle(detailModal.id);
              setDetailModal(null);
            }}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retry Now
                </Button>
            }
            </div>
          </div>
        </div>
      }

      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Notification Queue Manager
          </h1>
          <p className="text-sm text-gray-500">
            Monitor and manage pending or failed notifications
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={() => setConfirmModal({
              isOpen: true,
              type: 'clearFailed',
              message: `Are you sure you want to clear all ${stats.failed} failed notifications? This action cannot be undone.`
            })}
            disabled={stats.failed === 0}>

            <Trash2 className="w-4 h-4 mr-2" />
            Clear Failed ({stats.failed})
          </Button>
          <Button
            onClick={() => setConfirmModal({
              isOpen: true,
              type: 'retryAll',
              message: `Are you sure you want to retry all ${stats.failed} failed notifications?`
            })}
            disabled={stats.failed === 0}>

            <RefreshCw className="w-4 h-4 mr-2" />
            Retry All Failed
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-orange-50 border-orange-100">
          <div className="text-center">
            <p className="text-sm text-orange-600 font-medium uppercase">
              Pending
            </p>
            <p className="text-3xl font-bold text-orange-700">{stats.pending}</p>
          </div>
        </Card>
        <Card className="p-4 bg-red-50 border-red-100">
          <div className="text-center">
            <p className="text-sm text-red-600 font-medium uppercase">Failed</p>
            <p className="text-3xl font-bold text-red-700">{stats.failed}</p>
          </div>
        </Card>
        <Card className="p-4 bg-blue-50 border-blue-100">
          <div className="text-center">
            <p className="text-sm text-blue-600 font-medium uppercase">Processing</p>
            <p className="text-3xl font-bold text-blue-700">{stats.processing}</p>
          </div>
        </Card>
        <Card className="p-4 bg-green-50 border-green-100">
          <div className="text-center">
            <p className="text-sm text-green-600 font-medium uppercase">
              Sent Today
            </p>
            <p className="text-3xl font-bold text-green-700">{stats.sentToday.toLocaleString()}</p>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-1 gap-2 items-center min-w-[300px]">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by recipient, subject, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10" />

              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}>

                <Filter className="w-4 h-4 mr-2" />
                Filters
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={autoRefresh ? 'bg-green-50 border-green-300' : ''}>

                <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                {autoRefresh ? 'Auto-Refresh ON' : 'Auto-Refresh OFF'}
              </Button>
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}>

                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant="outline"
                onClick={handleExport}>

                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Filter Options */}
          {showFilters &&
          <div className="flex flex-wrap gap-4 pt-4 border-t">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Status</label>
                <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm">

                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                  <option value="Processing">Processing</option>
                  <option value="Sent">Sent</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Channel</label>
                <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm">

                  <option value="All">All Channels</option>
                  <option value="SMS">SMS</option>
                  <option value="Email">Email</option>
                  <option value="App">App</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Priority</label>
                <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm">

                  <option value="All">All Priorities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <Button variant="outline" onClick={resetFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Reset Filters
                </Button>
              </div>
            </div>
          }
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedItems.length > 0 &&
      <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-sm font-medium text-blue-700">
              {selectedItems.length} item(s) selected
            </span>
            <div className="flex gap-2">
              <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmModal({
                isOpen: true,
                type: 'retrySelected',
                message: `Are you sure you want to retry ${selectedItems.length} selected notification(s)?`
              })}>

                <RotateCcw className="w-4 h-4 mr-2" />
                Retry Selected
              </Button>
              <Button
              variant="danger"
              size="sm"
              onClick={() => setConfirmModal({
                isOpen: true,
                type: 'deleteSelected',
                message: `Are you sure you want to delete ${selectedItems.length} selected notification(s)? This action cannot be undone.`
              })}>

                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected
              </Button>
              <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedItems([]);
                setSelectAll(false);
              }}>

                <X className="w-4 h-4 mr-2" />
                Clear Selection
              </Button>
            </div>
          </div>
        </Card>
      }

      {/* Queue Table */}
      <Card title={`Queue Items (${filteredQueue.length})`}>
        {filteredQueue.length === 0 ?
        <div className="p-8 text-center text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No notifications found</p>
            <p className="text-sm">Try adjusting your filters or search term</p>
          </div> :

        <Table columns={columns} data={filteredQueue} />
        }
      </Card>

      {/* Queue Summary */}
      <Card className="p-4">
        <div className="flex flex-wrap justify-between items-center gap-4 text-sm text-gray-600">
          <div className="flex gap-6">
            <span>Total in queue: <strong>{queue.length}</strong></span>
            <span>Showing: <strong>{filteredQueue.length}</strong></span>
            <span>Selected: <strong>{selectedItems.length}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span>Last refreshed: {new Date().toLocaleTimeString()}</span>
            {autoRefresh &&
            <Badge variant="success">
                <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                Auto-refreshing every 30s
              </Badge>
            }
          </div>
        </div>
      </Card>
    </div>);

}