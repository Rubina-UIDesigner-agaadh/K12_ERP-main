// File: src/pages/admin/DataBackupRestoreUtility.tsx

import React, { useState, useCallback } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import {
  Database,
  Download,
  RefreshCw,
  Star,
  AlertTriangle,
  HardDrive,
  CheckCircle,
  XCircle,
  Clock,
  Loader2 } from
'lucide-react';

// Types
interface Backup {
  id: string;
  date: string;
  type: 'Full' | 'Differential' | 'File System';
  size: string;
  sizeInMB: number;
  location: string;
  tagged: boolean;
  description?: string;
  includesAttachments: boolean;
  status: 'completed' | 'in-progress' | 'failed';
  createdBy: string;
}

interface BackupFormData {
  type: 'full' | 'diff' | 'files';
  description: string;
  includeAttachments: boolean;
}

interface RestoreFormData {
  restorePoint: string;
  confirmText: string;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

interface BackupProgress {
  isRunning: boolean;
  progress: number;
  stage: string;
  backupId: string | null;
}

interface RestoreProgress {
  isRunning: boolean;
  progress: number;
  stage: string;
}

// Mock data generator
const generateBackupId = (): string => {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 99) + 1;
  return `BK-${dateStr}-${random.toString().padStart(2, '0')}`;
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const calculateSize = (type: 'full' | 'diff' | 'files', includesAttachments: boolean): {display: string;mb: number;} => {
  let baseMB: number;
  switch (type) {
    case 'full':
      baseMB = 2300 + Math.floor(Math.random() * 200);
      break;
    case 'diff':
      baseMB = 100 + Math.floor(Math.random() * 100);
      break;
    case 'files':
      baseMB = 500 + Math.floor(Math.random() * 200);
      break;
    default:
      baseMB = 150;
  }

  if (includesAttachments) {
    baseMB += 300 + Math.floor(Math.random() * 200);
  }

  const display = baseMB >= 1000 ? `${(baseMB / 1000).toFixed(1)} GB` : `${baseMB} MB`;
  return { display, mb: baseMB };
};

// Initial mock data
const initialBackups: Backup[] = [
{
  id: 'BK-20260207-01',
  date: 'Feb 7, 2026 02:00 AM',
  type: 'Full',
  size: '2.4 GB',
  sizeInMB: 2400,
  location: 'S3-Primary',
  tagged: false,
  description: 'Scheduled daily backup',
  includesAttachments: true,
  status: 'completed',
  createdBy: 'System'
},
{
  id: 'BK-20260206-01',
  date: 'Feb 6, 2026 02:00 AM',
  type: 'Differential',
  size: '150 MB',
  sizeInMB: 150,
  location: 'S3-Primary',
  tagged: false,
  description: 'Scheduled differential backup',
  includesAttachments: false,
  status: 'completed',
  createdBy: 'System'
},
{
  id: 'BK-20260205-01',
  date: 'Feb 5, 2026 02:00 AM',
  type: 'Differential',
  size: '145 MB',
  sizeInMB: 145,
  location: 'S3-Primary',
  tagged: false,
  description: 'Scheduled differential backup',
  includesAttachments: false,
  status: 'completed',
  createdBy: 'System'
},
{
  id: 'BK-20260204-01',
  date: 'Feb 4, 2026 02:00 AM',
  type: 'Differential',
  size: '138 MB',
  sizeInMB: 138,
  location: 'S3-Primary',
  tagged: false,
  description: '',
  includesAttachments: false,
  status: 'completed',
  createdBy: 'System'
},
{
  id: 'BK-20260203-01',
  date: 'Feb 3, 2026 11:30 AM',
  type: 'Full',
  size: '2.5 GB',
  sizeInMB: 2500,
  location: 'S3-Primary',
  tagged: false,
  description: 'Pre-deployment backup',
  includesAttachments: true,
  status: 'completed',
  createdBy: 'admin@example.com'
},
{
  id: 'BK-20260201-01',
  date: 'Feb 1, 2026 02:00 AM',
  type: 'Full',
  size: '2.3 GB',
  sizeInMB: 2300,
  location: 'S3-Archive',
  tagged: true,
  description: 'Monthly archive - January 2026',
  includesAttachments: true,
  status: 'completed',
  createdBy: 'System'
},
{
  id: 'BK-20260125-01',
  date: 'Jan 25, 2026 02:00 AM',
  type: 'Full',
  size: '2.3 GB',
  sizeInMB: 2300,
  location: 'S3-Archive',
  tagged: true,
  description: 'Pre-update snapshot',
  includesAttachments: true,
  status: 'completed',
  createdBy: 'admin@example.com'
},
{
  id: 'BK-20260115-01',
  date: 'Jan 15, 2026 02:00 AM',
  type: 'Full',
  size: '2.2 GB',
  sizeInMB: 2200,
  location: 'S3-Archive',
  tagged: true,
  description: 'Mid-month checkpoint',
  includesAttachments: true,
  status: 'completed',
  createdBy: 'System'
},
{
  id: 'BK-20260101-01',
  date: 'Jan 1, 2026 02:00 AM',
  type: 'Full',
  size: '2.1 GB',
  sizeInMB: 2100,
  location: 'S3-Archive',
  tagged: true,
  description: 'New Year archive - December 2025',
  includesAttachments: true,
  status: 'completed',
  createdBy: 'System'
}];


// Backup history log for tracking operations
interface BackupLog {
  id: string;
  timestamp: Date;
  action: 'create' | 'restore' | 'download' | 'archive' | 'unarchive' | 'delete';
  backupId: string;
  performedBy: string;
  details: string;
  status: 'success' | 'failed' | 'in-progress';
}

export function DataBackupRestoreUtility() {
  // State management
  const [backups, setBackups] = useState<Backup[]>(initialBackups);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [backupLogs, setBackupLogs] = useState<BackupLog[]>([]);

  // Form states
  const [backupForm, setBackupForm] = useState<BackupFormData>({
    type: 'full',
    description: '',
    includeAttachments: false
  });

  const [restoreForm, setRestoreForm] = useState<RestoreFormData>({
    restorePoint: 'latest',
    confirmText: ''
  });

  // Progress states
  const [backupProgress, setBackupProgress] = useState<BackupProgress>({
    isRunning: false,
    progress: 0,
    stage: '',
    backupId: null
  });

  const [restoreProgress, setRestoreProgress] = useState<RestoreProgress>({
    isRunning: false,
    progress: 0,
    stage: ''
  });

  // Modal states
  const [showRestoreConfirmModal, setShowRestoreConfirmModal] = useState(false);
  const [showBackupDetailsModal, setShowBackupDetailsModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  // Filter states
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [showArchivedOnly, setShowArchivedOnly] = useState(false);

  // Notification helper
  const addNotification = useCallback((type: Notification['type'], title: string, message: string) => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, type, title, message }]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, []);

  // Log helper
  const addLog = useCallback((log: Omit<BackupLog, 'id' | 'timestamp'>) => {
    setBackupLogs((prev) => [{
      ...log,
      id: Date.now().toString(),
      timestamp: new Date()
    }, ...prev]);
  }, []);

  // Calculate statistics
  const stats = {
    lastBackup: backups.length > 0 ? backups[0].date : 'No backups',
    totalSize: `${(backups.reduce((acc, b) => acc + b.sizeInMB, 0) / 1000).toFixed(1)} GB`,
    totalBackups: backups.length,
    storageUsed: Math.min(100, Math.round(backups.reduce((acc, b) => acc + b.sizeInMB, 0) / 15000 * 100)),
    archivedCount: backups.filter((b) => b.tagged).length,
    fullBackups: backups.filter((b) => b.type === 'Full').length,
    diffBackups: backups.filter((b) => b.type === 'Differential').length
  };

  // Toggle archive status
  const handleToggleArchive = useCallback((backupId: string) => {
    setBackups((prev) => prev.map((backup) => {
      if (backup.id === backupId) {
        const newTagged = !backup.tagged;
        const newLocation = newTagged ? 'S3-Archive' : 'S3-Primary';

        addLog({
          action: newTagged ? 'archive' : 'unarchive',
          backupId,
          performedBy: 'current-user@example.com',
          details: `Backup ${backupId} ${newTagged ? 'archived' : 'unarchived'}`,
          status: 'success'
        });

        addNotification(
          'success',
          newTagged ? 'Backup Archived' : 'Backup Unarchived',
          `${backupId} has been ${newTagged ? 'moved to archive' : 'removed from archive'}`
        );

        return {
          ...backup,
          tagged: newTagged,
          location: newLocation
        };
      }
      return backup;
    }));
  }, [addLog, addNotification]);

  // Download backup
  const handleDownload = useCallback((backup: Backup) => {
    setSelectedBackup(backup);
    setShowDownloadModal(true);
    setDownloadProgress(0);
    setIsDownloading(true);

    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);

          addLog({
            action: 'download',
            backupId: backup.id,
            performedBy: 'current-user@example.com',
            details: `Downloaded backup ${backup.id} (${backup.size})`,
            status: 'success'
          });

          addNotification('success', 'Download Complete', `${backup.id} has been downloaded successfully`);

          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 300);
  }, [addLog, addNotification]);

  // View backup details
  const handleViewDetails = useCallback((backup: Backup) => {
    setSelectedBackup(backup);
    setShowBackupDetailsModal(true);
  }, []);

  // Start manual backup
  const handleStartBackup = useCallback(async () => {
    if (backupProgress.isRunning) {
      addNotification('warning', 'Backup In Progress', 'Please wait for the current backup to complete');
      return;
    }

    const newBackupId = generateBackupId();

    setBackupProgress({
      isRunning: true,
      progress: 0,
      stage: 'Initializing backup...',
      backupId: newBackupId
    });

    const stages = [
    'Initializing backup...',
    'Connecting to database...',
    'Creating snapshot...',
    'Exporting data tables...',
    'Processing user data...',
    'Processing transaction records...',
    'Processing audit logs...',
    backupForm.includeAttachments ? 'Packaging attachments...' : 'Skipping attachments...',
    'Compressing data...',
    'Encrypting backup...',
    'Uploading to S3...',
    'Verifying integrity...',
    'Finalizing backup...'];


    let currentStage = 0;
    const totalStages = stages.length;

    const interval = setInterval(() => {
      setBackupProgress((prev) => {
        const newProgress = Math.min(100, prev.progress + 100 / totalStages * 0.5);

        if (newProgress >= (currentStage + 1) / totalStages * 100 && currentStage < totalStages - 1) {
          currentStage++;
        }

        if (newProgress >= 100) {
          clearInterval(interval);

          const typeMap: Record<string, 'Full' | 'Differential' | 'File System'> = {
            full: 'Full',
            diff: 'Differential',
            files: 'File System'
          };

          const sizeData = calculateSize(backupForm.type, backupForm.includeAttachments);

          const newBackup: Backup = {
            id: newBackupId,
            date: formatDate(new Date()),
            type: typeMap[backupForm.type],
            size: sizeData.display,
            sizeInMB: sizeData.mb,
            location: 'S3-Primary',
            tagged: false,
            description: backupForm.description || 'Manual backup',
            includesAttachments: backupForm.includeAttachments,
            status: 'completed',
            createdBy: 'current-user@example.com'
          };

          setBackups((prevBackups) => [newBackup, ...prevBackups]);

          addLog({
            action: 'create',
            backupId: newBackupId,
            performedBy: 'current-user@example.com',
            details: `Created ${typeMap[backupForm.type]} backup (${sizeData.display})`,
            status: 'success'
          });

          addNotification('success', 'Backup Complete', `${newBackupId} has been created successfully`);

          // Reset form
          setBackupForm({
            type: 'full',
            description: '',
            includeAttachments: false
          });

          setTimeout(() => {
            setBackupProgress({
              isRunning: false,
              progress: 0,
              stage: '',
              backupId: null
            });
          }, 2000);

          return { ...prev, progress: 100, stage: 'Backup complete!' };
        }

        return {
          ...prev,
          progress: newProgress,
          stage: stages[currentStage]
        };
      });
    }, 400);
  }, [backupForm, backupProgress.isRunning, addLog, addNotification]);

  // Trigger manual backup from header button
  const handleTriggerManualBackup = useCallback(() => {
    setBackupForm({
      type: 'full',
      description: 'Quick manual backup',
      includeAttachments: true
    });
    handleStartBackup();
  }, [handleStartBackup]);

  // Initiate restore
  const handleInitiateRestore = useCallback(() => {
    if (restoreProgress.isRunning) {
      addNotification('warning', 'Restore In Progress', 'Please wait for the current restore to complete');
      return;
    }
    setShowRestoreConfirmModal(true);
    setRestoreForm((prev) => ({ ...prev, confirmText: '' }));
  }, [restoreProgress.isRunning, addNotification]);

  // Confirm and execute restore
  const handleConfirmRestore = useCallback(() => {
    if (restoreForm.confirmText !== 'RESTORE') {
      addNotification('error', 'Confirmation Required', 'Please type RESTORE to confirm the operation');
      return;
    }

    setShowRestoreConfirmModal(false);

    const targetBackup = restoreForm.restorePoint === 'latest' ?
    backups[0] :
    backups.find((b) => b.id === restoreForm.restorePoint);

    if (!targetBackup) {
      addNotification('error', 'Restore Failed', 'Selected backup not found');
      return;
    }

    setRestoreProgress({
      isRunning: true,
      progress: 0,
      stage: 'Preparing restore operation...'
    });

    const stages = [
    'Preparing restore operation...',
    'Validating backup integrity...',
    'Creating current state snapshot...',
    'Stopping application services...',
    'Downloading backup from S3...',
    'Decrypting backup data...',
    'Decompressing files...',
    'Restoring database schema...',
    'Restoring data tables...',
    'Restoring user accounts...',
    'Restoring configurations...',
    'Restoring audit logs...',
    'Rebuilding indexes...',
    'Verifying data integrity...',
    'Restarting services...',
    'Running health checks...'];


    let currentStage = 0;
    const totalStages = stages.length;

    const interval = setInterval(() => {
      setRestoreProgress((prev) => {
        const newProgress = Math.min(100, prev.progress + 100 / totalStages * 0.3);

        if (newProgress >= (currentStage + 1) / totalStages * 100 && currentStage < totalStages - 1) {
          currentStage++;
        }

        if (newProgress >= 100) {
          clearInterval(interval);

          addLog({
            action: 'restore',
            backupId: targetBackup.id,
            performedBy: 'current-user@example.com',
            details: `System restored to ${targetBackup.id} (${targetBackup.date})`,
            status: 'success'
          });

          addNotification('success', 'Restore Complete', `System has been restored to ${targetBackup.id}`);

          setTimeout(() => {
            setRestoreProgress({
              isRunning: false,
              progress: 0,
              stage: ''
            });
          }, 3000);

          return { ...prev, progress: 100, stage: 'Restore complete! System is operational.' };
        }

        return {
          ...prev,
          progress: newProgress,
          stage: stages[currentStage]
        };
      });
    }, 500);
  }, [restoreForm, backups, addLog, addNotification]);

  // Restore from specific backup (action button)
  const handleRestoreFromBackup = useCallback((backup: Backup) => {
    setRestoreForm({
      restorePoint: backup.id,
      confirmText: ''
    });
    setSelectedBackup(backup);
    setShowRestoreConfirmModal(true);
  }, []);

  // Filter backups
  const filteredBackups = backups.filter((backup) => {
    if (typeFilter !== 'all' && backup.type !== typeFilter) return false;
    if (locationFilter !== 'all' && backup.location !== locationFilter) return false;
    if (showArchivedOnly && !backup.tagged) return false;
    return true;
  });

  // Table columns with interactive handlers
  const columns = [
  {
    key: 'id',
    header: 'Backup ID',
    render: (row: Backup) =>
    <button
      onClick={() => handleViewDetails(row)}
      className="font-mono text-xs text-blue-600 hover:underline cursor-pointer">

          {row.id}
        </button>

  },
  {
    key: 'date',
    header: 'Date/Time'
  },
  {
    key: 'type',
    header: 'Type',
    render: (row: Backup) =>
    <Badge variant={row.type === 'Full' ? 'success' : row.type === 'Differential' ? 'info' : 'warning'}>
          {row.type}
        </Badge>

  },
  {
    key: 'size',
    header: 'Size'
  },
  {
    key: 'location',
    header: 'Storage',
    render: (row: Backup) =>
    <span className={row.location === 'S3-Archive' ? 'text-purple-600 font-medium' : ''}>
          {row.location}
        </span>

  },
  {
    key: 'tagged',
    header: 'Archive',
    render: (row: Backup) =>
    <Button
      variant="ghost"
      size="xs"
      className={row.tagged ? 'text-yellow-500' : 'text-gray-300'}
      onClick={() => handleToggleArchive(row.id)}
      title={row.tagged ? 'Remove from archive' : 'Add to archive'}>

          <Star className={`w-4 h-4 ${row.tagged ? 'fill-current' : ''}`} />
        </Button>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: Backup) =>
    <div className="flex gap-2">
          <Button
        variant="ghost"
        size="xs"
        title="Download"
        onClick={() => handleDownload(row)}
        disabled={isDownloading || backupProgress.isRunning || restoreProgress.isRunning}>

            <Download className="w-4 h-4" />
          </Button>
          <Button
        variant="ghost"
        size="xs"
        className="text-red-600 hover:text-red-700"
        title="Restore from this backup"
        onClick={() => handleRestoreFromBackup(row)}
        disabled={restoreProgress.isRunning || backupProgress.isRunning}>

            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

  }];


  // Restore point options for select
  const restorePointOptions = [
  { value: 'latest', label: `Latest (${backups[0]?.date || 'No backups'})` },
  ...backups.slice(0, 10).map((b) => ({
    value: b.id,
    label: `${b.id} - ${b.date}`
  }))];


  return (
    <div className="space-y-6 p-6">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) =>
        <div
          key={notification.id}
          className={`p-4 rounded-lg shadow-lg flex items-start gap-3 max-w-sm animate-slide-in ${
          notification.type === 'success' ? 'bg-green-50 border border-green-200' :
          notification.type === 'error' ? 'bg-red-50 border border-red-200' :
          notification.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
          'bg-blue-50 border border-blue-200'}`
          }>

            {notification.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />}
            {notification.type === 'error' && <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
            {notification.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />}
            {notification.type === 'info' && <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />}
            <div>
              <p className={`font-semibold text-sm ${
            notification.type === 'success' ? 'text-green-800' :
            notification.type === 'error' ? 'text-red-800' :
            notification.type === 'warning' ? 'text-yellow-800' :
            'text-blue-800'}`
            }>
                {notification.title}
              </p>
              <p className={`text-sm ${
            notification.type === 'success' ? 'text-green-600' :
            notification.type === 'error' ? 'text-red-600' :
            notification.type === 'warning' ? 'text-yellow-600' :
            'text-blue-600'}`
            }>
                {notification.message}
              </p>
            </div>
            <button
            onClick={() => setNotifications((prev) => prev.filter((n) => n.id !== notification.id))}
            className="text-gray-400 hover:text-gray-600">

              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Backup Progress Overlay */}
      {backupProgress.isRunning &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <Card className="p-6 max-w-md w-full mx-4">
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
              <h3 className="text-lg font-semibold">Creating Backup</h3>
              <p className="text-sm text-gray-600">{backupProgress.stage}</p>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, backupProgress.progress)}%` }} />

              </div>
              <p className="text-sm text-gray-500">
                {Math.round(backupProgress.progress)}% complete
              </p>
              {backupProgress.backupId &&
            <p className="text-xs text-gray-400 font-mono">
                  Backup ID: {backupProgress.backupId}
                </p>
            }
            </div>
          </Card>
        </div>
      }

      {/* Restore Progress Overlay */}
      {restoreProgress.isRunning &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <Card className="p-6 max-w-md w-full mx-4">
            <div className="text-center space-y-4">
              <RefreshCw className="w-12 h-12 text-red-600 animate-spin mx-auto" />
              <h3 className="text-lg font-semibold text-red-700">Restoring System</h3>
              <p className="text-sm text-gray-600">{restoreProgress.stage}</p>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                className="bg-red-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, restoreProgress.progress)}%` }} />

              </div>
              <p className="text-sm text-gray-500">
                {Math.round(restoreProgress.progress)}% complete
              </p>
              <p className="text-xs text-red-500">
                Do not close this window or refresh the page
              </p>
            </div>
          </Card>
        </div>
      }

      {/* Restore Confirmation Modal */}
      {showRestoreConfirmModal &&
      <Modal
        isOpen={showRestoreConfirmModal}
        onClose={() => setShowRestoreConfirmModal(false)}
        title="Confirm System Restore">

          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-800">Critical Warning</h4>
                  <p className="text-sm text-red-700 mt-1">
                    This operation will overwrite ALL current data with the selected backup. 
                    All changes made after the backup date will be permanently lost.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-700">
                <strong>Restore Point:</strong>{' '}
                {restoreForm.restorePoint === 'latest' ?
              `Latest (${backups[0]?.date})` :
              backups.find((b) => b.id === restoreForm.restorePoint)?.date}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Backup ID:</strong>{' '}
                {restoreForm.restorePoint === 'latest' ?
              backups[0]?.id :
              restoreForm.restorePoint}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type <strong>RESTORE</strong> to confirm:
              </label>
              <Input
              value={restoreForm.confirmText}
              onChange={(e) => setRestoreForm((prev) => ({ ...prev, confirmText: e.target.value }))}
              placeholder="Type RESTORE"
              className="font-mono" />

            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setShowRestoreConfirmModal(false)}>

                Cancel
              </Button>
              <Button
              variant="danger"
              className="flex-1"
              onClick={handleConfirmRestore}
              disabled={restoreForm.confirmText !== 'RESTORE'}>

                Confirm Restore
              </Button>
            </div>
          </div>
        </Modal>
      }

      {/* Backup Details Modal */}
      {showBackupDetailsModal && selectedBackup &&
      <Modal
        isOpen={showBackupDetailsModal}
        onClose={() => setShowBackupDetailsModal(false)}
        title="Backup Details">

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Backup ID</p>
                <p className="font-mono font-semibold">{selectedBackup.id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Status</p>
                <Badge variant={selectedBackup.status === 'completed' ? 'success' : 'warning'}>
                  {selectedBackup.status}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Date/Time</p>
                <p>{selectedBackup.date}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Type</p>
                <p>{selectedBackup.type}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Size</p>
                <p>{selectedBackup.size}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Storage Location</p>
                <p>{selectedBackup.location}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Created By</p>
                <p>{selectedBackup.createdBy}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Includes Attachments</p>
                <p>{selectedBackup.includesAttachments ? 'Yes' : 'No'}</p>
              </div>
            </div>
            
            {selectedBackup.description &&
          <div>
                <p className="text-xs text-gray-500 uppercase">Description</p>
                <p>{selectedBackup.description}</p>
              </div>
          }
            
            <div className="flex gap-3 pt-4">
              <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setShowBackupDetailsModal(false)}>

                Close
              </Button>
              <Button
              className="flex-1"
              onClick={() => {
                setShowBackupDetailsModal(false);
                handleDownload(selectedBackup);
              }}>

                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
              variant="danger"
              className="flex-1"
              onClick={() => {
                setShowBackupDetailsModal(false);
                handleRestoreFromBackup(selectedBackup);
              }}>

                <RefreshCw className="w-4 h-4 mr-2" />
                Restore
              </Button>
            </div>
          </div>
        </Modal>
      }

      {/* Download Progress Modal */}
      {showDownloadModal &&
      <Modal
        isOpen={showDownloadModal}
        onClose={() => !isDownloading && setShowDownloadModal(false)}
        title="Downloading Backup">

          <div className="space-y-4">
            <div className="text-center">
              {isDownloading ?
            <Download className="w-12 h-12 text-blue-600 mx-auto animate-bounce" /> :

            <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
            }
            </div>
            
            <div className="text-center">
              <p className="font-semibold">{selectedBackup?.id}</p>
              <p className="text-sm text-gray-500">{selectedBackup?.size}</p>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
              className={`h-3 rounded-full transition-all duration-300 ${
              downloadProgress >= 100 ? 'bg-green-600' : 'bg-blue-600'}`
              }
              style={{ width: `${Math.min(100, downloadProgress)}%` }} />

            </div>
            
            <p className="text-center text-sm text-gray-600">
              {downloadProgress >= 100 ?
            'Download complete!' :
            `${Math.round(downloadProgress)}% complete`}
            </p>
            
            {!isDownloading &&
          <Button
            className="w-full"
            onClick={() => setShowDownloadModal(false)}>

                Close
              </Button>
          }
          </div>
        </Modal>
      }

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Backup & Restore Manager
          </h1>
          <p className="text-sm text-gray-500">
            Manage database backups, archives, and restoration points
          </p>
        </div>
        <Button
          onClick={handleTriggerManualBackup}
          disabled={backupProgress.isRunning || restoreProgress.isRunning}>

          {backupProgress.isRunning ?
          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

          <Database className="w-4 h-4 mr-2" />
          }
          {backupProgress.isRunning ? 'Backup In Progress...' : 'Trigger Manual Backup'}
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-full text-blue-600">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">
              Last Backup
            </p>
            <p className="text-lg font-bold">{stats.lastBackup}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-full text-green-600">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">
              Total Size
            </p>
            <p className="text-lg font-bold">{stats.totalSize}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-full text-purple-600">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">
              Total Backups
            </p>
            <p className="text-lg font-bold">{stats.totalBackups}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-orange-100 rounded-full text-orange-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">
              Storage Used
            </p>
            <p className="text-lg font-bold">{stats.storageUsed}%</p>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-[150px]">
                <Select
                  label="Filter by Type"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  options={[
                  { value: 'all', label: 'All Types' },
                  { value: 'Full', label: 'Full Backups' },
                  { value: 'Differential', label: 'Differential' },
                  { value: 'File System', label: 'File System' }]
                  } />

              </div>
              <div className="flex-1 min-w-[150px]">
                <Select
                  label="Filter by Location"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  options={[
                  { value: 'all', label: 'All Locations' },
                  { value: 'S3-Primary', label: 'S3-Primary' },
                  { value: 'S3-Archive', label: 'S3-Archive' }]
                  } />

              </div>
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="archivedOnly"
                  checked={showArchivedOnly}
                  onChange={(e) => setShowArchivedOnly(e.target.checked)}
                  className="rounded border-gray-300" />

                <label htmlFor="archivedOnly" className="text-sm text-gray-700">
                  Archived only
                </label>
              </div>
            </div>
          </Card>

          {/* Backups Table */}
          <Card title={`Existing Backups (${filteredBackups.length})`}>
            <Table columns={columns} data={filteredBackups} />
          </Card>

          {/* Recent Activity Log */}
          <Card title="Recent Activity">
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {backupLogs.length === 0 ?
              <p className="text-sm text-gray-500 text-center py-4">
                  No recent activity
                </p> :

              backupLogs.slice(0, 10).map((log) =>
              <div
                key={log.id}
                className="flex items-center gap-3 p-2 bg-gray-50 rounded text-sm">

                    {log.action === 'create' && <Database className="w-4 h-4 text-green-600" />}
                    {log.action === 'restore' && <RefreshCw className="w-4 h-4 text-red-600" />}
                    {log.action === 'download' && <Download className="w-4 h-4 text-blue-600" />}
                    {log.action === 'archive' && <Star className="w-4 h-4 text-yellow-600" />}
                    {log.action === 'unarchive' && <Star className="w-4 h-4 text-gray-400" />}
                    <div className="flex-1">
                      <p className="text-gray-800">{log.details}</p>
                      <p className="text-xs text-gray-500">
                        {log.timestamp.toLocaleString()} by {log.performedBy}
                      </p>
                    </div>
                    <Badge variant={log.status === 'success' ? 'success' : log.status === 'failed' ? 'error' : 'warning'}>
                      {log.status}
                    </Badge>
                  </div>
              )
              }
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Trigger Backup Form */}
          <Card title="Trigger Backup">
            <div className="space-y-4">
              <Select
                label="Backup Type"
                value={backupForm.type}
                onChange={(e) => setBackupForm((prev) => ({
                  ...prev,
                  type: e.target.value as 'full' | 'diff' | 'files'
                }))}
                options={[
                { value: 'full', label: 'Full Database Backup' },
                { value: 'diff', label: 'Differential Backup' },
                { value: 'files', label: 'File System Only' }]
                }
                disabled={backupProgress.isRunning} />

              <Input
                label="Description (Optional)"
                placeholder="e.g. Pre-upgrade backup"
                value={backupForm.description}
                onChange={(e) => setBackupForm((prev) => ({
                  ...prev,
                  description: e.target.value
                }))}
                disabled={backupProgress.isRunning} />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="attachments"
                  checked={backupForm.includeAttachments}
                  onChange={(e) => setBackupForm((prev) => ({
                    ...prev,
                    includeAttachments: e.target.checked
                  }))}
                  className="rounded border-gray-300"
                  disabled={backupProgress.isRunning} />

                <label htmlFor="attachments" className="text-sm text-gray-700">
                  Include uploaded attachments
                </label>
              </div>
              
              {/* Estimated size preview */}
              <div className="p-3 bg-gray-50 rounded-lg text-sm">
                <p className="text-gray-600">
                  <strong>Estimated Size:</strong>{' '}
                  {calculateSize(backupForm.type, backupForm.includeAttachments).display}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {backupForm.type === 'full' ?
                  'Full backups include all database tables and system configurations' :
                  backupForm.type === 'diff' ?
                  'Differential backups only include changes since last full backup' :
                  'File system backups include uploaded files and media only'}
                </p>
              </div>
              
              <Button
                className="w-full"
                onClick={handleStartBackup}
                disabled={backupProgress.isRunning || restoreProgress.isRunning}>

                {backupProgress.isRunning ?
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Backup In Progress...
                  </> :

                'Start Backup Process'
                }
              </Button>
            </div>
          </Card>

          {/* Restore Form */}
          <Card title="Restore Data" className="border-red-200">
            <div className="space-y-4">
              <div className="bg-red-50 p-3 rounded-md flex gap-3 text-red-800 text-sm">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <p>
                  Warning: Restore operations require highest privileges and
                  will overwrite current data. This action cannot be undone.
                </p>
              </div>
              <Select
                label="Select Restore Point"
                value={restoreForm.restorePoint}
                onChange={(e) => setRestoreForm((prev) => ({
                  ...prev,
                  restorePoint: e.target.value
                }))}
                options={restorePointOptions}
                disabled={restoreProgress.isRunning} />

              
              {/* Restore point details */}
              {restoreForm.restorePoint &&
              <div className="p-3 bg-gray-50 rounded-lg text-sm space-y-1">
                  {(() => {
                  const backup = restoreForm.restorePoint === 'latest' ?
                  backups[0] :
                  backups.find((b) => b.id === restoreForm.restorePoint);
                  if (!backup) return null;
                  return (
                    <>
                        <p><strong>Type:</strong> {backup.type}</p>
                        <p><strong>Size:</strong> {backup.size}</p>
                        <p><strong>Location:</strong> {backup.location}</p>
                        {backup.description &&
                      <p><strong>Description:</strong> {backup.description}</p>
                      }
                      </>);

                })()}
                </div>
              }
              
              <Button
                variant="danger"
                className="w-full"
                onClick={handleInitiateRestore}
                disabled={restoreProgress.isRunning || backupProgress.isRunning || backups.length === 0}>

                {restoreProgress.isRunning ?
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Restore In Progress...
                  </> :

                'Initiate Restore Sequence'
                }
              </Button>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card title="Backup Statistics">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Full Backups</span>
                <span className="font-semibold">{stats.fullBackups}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Differential Backups</span>
                <span className="font-semibold">{stats.diffBackups}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Archived Backups</span>
                <span className="font-semibold">{stats.archivedCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Storage Capacity</span>
                <span className="font-semibold">15 GB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className={`h-2 rounded-full ${
                  stats.storageUsed > 80 ? 'bg-red-600' :
                  stats.storageUsed > 60 ? 'bg-yellow-600' : 'bg-green-600'}`
                  }
                  style={{ width: `${stats.storageUsed}%` }} />

              </div>
              <p className="text-xs text-gray-500 text-center">
                {stats.storageUsed}% of storage used
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>);

}