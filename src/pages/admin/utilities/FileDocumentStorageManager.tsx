import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Folder,
  FileText,
  Image,
  Trash2,
  Upload,
  Search,
  Download,
  Eye,
  Edit2,
  Copy,
  Move,
  FolderPlus,
  ChevronRight,
  X,
  CheckCircle,
  AlertTriangle,
  Loader2,
  FileSpreadsheet,
  FileArchive,
  Film,
  Music,
  File,
  RefreshCw,
  HardDrive,
  Clock,
  Star,
  StarOff,
  MoreVertical,
  ArrowUpDown,
  Grid,
  List } from
'lucide-react';

// Types
interface FileItem {
  id: number;
  name: string;
  type: 'folder' | 'pdf' | 'image' | 'document' | 'spreadsheet' | 'archive' | 'video' | 'audio' | 'other';
  size: number; // in bytes
  items?: number; // for folders
  dateModified: Date;
  dateCreated: Date;
  parentId: number | null;
  path: string;
  isStarred: boolean;
  isTemp: boolean;
  extension?: string;
  mimeType?: string;
  uploadedBy: string;
  description?: string;
  tags: string[];
}

interface BreadcrumbItem {
  id: number | null;
  name: string;
}

interface UploadingFile {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: 'uploading' | 'completed' | 'failed';
  error?: string;
}

interface DuplicateGroup {
  hash: string;
  files: FileItem[];
  totalSize: number;
}

// Mock Data
const generateMockFiles = (): FileItem[] => {
  const files: FileItem[] = [
  // Root level folders
  { id: 1, name: 'Student_Photos_2025', type: 'folder', size: 1288490188, items: 1200, dateModified: new Date('2025-01-10'), dateCreated: new Date('2025-01-01'), parentId: null, path: '/Student_Photos_2025', isStarred: true, isTemp: false, uploadedBy: 'Admin', tags: ['students', 'photos'] },
  { id: 2, name: 'Fee_Receipts_Q1', type: 'folder', size: 471859200, items: 850, dateModified: new Date('2025-01-15'), dateCreated: new Date('2025-01-01'), parentId: null, path: '/Fee_Receipts_Q1', isStarred: false, isTemp: false, uploadedBy: 'Accounts', tags: ['fees', 'receipts'] },
  { id: 3, name: 'Academic_Documents', type: 'folder', size: 256000000, items: 45, dateModified: new Date('2025-01-20'), dateCreated: new Date('2024-08-01'), parentId: null, path: '/Academic_Documents', isStarred: true, isTemp: false, uploadedBy: 'Admin', tags: ['academic'] },
  { id: 4, name: 'Staff_Records', type: 'folder', size: 128000000, items: 120, dateModified: new Date('2025-01-18'), dateCreated: new Date('2024-06-15'), parentId: null, path: '/Staff_Records', isStarred: false, isTemp: false, uploadedBy: 'HR', tags: ['staff', 'hr'] },
  { id: 5, name: 'Temp_Files', type: 'folder', size: 52428800, items: 35, dateModified: new Date('2025-01-22'), dateCreated: new Date('2025-01-22'), parentId: null, path: '/Temp_Files', isStarred: false, isTemp: true, uploadedBy: 'System', tags: ['temp'] },

  // Root level files
  { id: 6, name: 'Admission_Policy_v2.pdf', type: 'pdf', size: 2516582, dateModified: new Date('2025-02-01'), dateCreated: new Date('2025-01-15'), parentId: null, path: '/Admission_Policy_v2.pdf', isStarred: true, isTemp: false, extension: 'pdf', mimeType: 'application/pdf', uploadedBy: 'Admin', tags: ['policy', 'admission'] },
  { id: 7, name: 'School_Logo_HighRes.png', type: 'image', size: 5347737, dateModified: new Date('2024-12-20'), dateCreated: new Date('2024-12-20'), parentId: null, path: '/School_Logo_HighRes.png', isStarred: true, isTemp: false, extension: 'png', mimeType: 'image/png', uploadedBy: 'Admin', tags: ['logo', 'branding'] },
  { id: 8, name: 'Fee_Structure_2025.xlsx', type: 'spreadsheet', size: 1258291, dateModified: new Date('2025-01-05'), dateCreated: new Date('2025-01-05'), parentId: null, path: '/Fee_Structure_2025.xlsx', isStarred: false, isTemp: false, extension: 'xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', uploadedBy: 'Accounts', tags: ['fees'] },
  { id: 9, name: 'Annual_Report_2024.pdf', type: 'pdf', size: 8945664, dateModified: new Date('2025-01-12'), dateCreated: new Date('2025-01-12'), parentId: null, path: '/Annual_Report_2024.pdf', isStarred: false, isTemp: false, extension: 'pdf', mimeType: 'application/pdf', uploadedBy: 'Principal', tags: ['report', 'annual'] },
  { id: 10, name: 'School_Anthem.mp3', type: 'audio', size: 4521984, dateModified: new Date('2024-08-15'), dateCreated: new Date('2024-08-15'), parentId: null, path: '/School_Anthem.mp3', isStarred: false, isTemp: false, extension: 'mp3', mimeType: 'audio/mpeg', uploadedBy: 'Admin', tags: ['audio', 'anthem'] },

  // Files inside Student_Photos_2025 folder (parentId: 1)
  { id: 11, name: 'Class_10A', type: 'folder', size: 157286400, items: 45, dateModified: new Date('2025-01-10'), dateCreated: new Date('2025-01-08'), parentId: 1, path: '/Student_Photos_2025/Class_10A', isStarred: false, isTemp: false, uploadedBy: 'Admin', tags: ['class10', 'photos'] },
  { id: 12, name: 'Class_10B', type: 'folder', size: 146800640, items: 42, dateModified: new Date('2025-01-10'), dateCreated: new Date('2025-01-08'), parentId: 1, path: '/Student_Photos_2025/Class_10B', isStarred: false, isTemp: false, uploadedBy: 'Admin', tags: ['class10', 'photos'] },
  { id: 13, name: 'Class_9A', type: 'folder', size: 136314880, items: 40, dateModified: new Date('2025-01-09'), dateCreated: new Date('2025-01-07'), parentId: 1, path: '/Student_Photos_2025/Class_9A', isStarred: false, isTemp: false, uploadedBy: 'Admin', tags: ['class9', 'photos'] },
  { id: 14, name: 'photo_index.xlsx', type: 'spreadsheet', size: 524288, dateModified: new Date('2025-01-10'), dateCreated: new Date('2025-01-10'), parentId: 1, path: '/Student_Photos_2025/photo_index.xlsx', isStarred: false, isTemp: false, extension: 'xlsx', uploadedBy: 'Admin', tags: ['index'] },

  // Files inside Fee_Receipts_Q1 folder (parentId: 2)
  { id: 15, name: 'January_2025', type: 'folder', size: 167772160, items: 300, dateModified: new Date('2025-01-31'), dateCreated: new Date('2025-01-01'), parentId: 2, path: '/Fee_Receipts_Q1/January_2025', isStarred: false, isTemp: false, uploadedBy: 'Accounts', tags: ['january', 'receipts'] },
  { id: 16, name: 'February_2025', type: 'folder', size: 157286400, items: 280, dateModified: new Date('2025-02-15'), dateCreated: new Date('2025-02-01'), parentId: 2, path: '/Fee_Receipts_Q1/February_2025', isStarred: false, isTemp: false, uploadedBy: 'Accounts', tags: ['february', 'receipts'] },
  { id: 17, name: 'receipt_summary_q1.pdf', type: 'pdf', size: 1048576, dateModified: new Date('2025-01-15'), dateCreated: new Date('2025-01-15'), parentId: 2, path: '/Fee_Receipts_Q1/receipt_summary_q1.pdf', isStarred: true, isTemp: false, extension: 'pdf', uploadedBy: 'Accounts', tags: ['summary'] },

  // Files inside Academic_Documents folder (parentId: 3)
  { id: 18, name: 'Syllabus_2025', type: 'folder', size: 52428800, items: 12, dateModified: new Date('2025-01-20'), dateCreated: new Date('2024-12-01'), parentId: 3, path: '/Academic_Documents/Syllabus_2025', isStarred: true, isTemp: false, uploadedBy: 'Academic Head', tags: ['syllabus'] },
  { id: 19, name: 'Exam_Schedule_2025.pdf', type: 'pdf', size: 2097152, dateModified: new Date('2025-01-18'), dateCreated: new Date('2025-01-18'), parentId: 3, path: '/Academic_Documents/Exam_Schedule_2025.pdf', isStarred: false, isTemp: false, extension: 'pdf', uploadedBy: 'Exam Controller', tags: ['exam', 'schedule'] },
  { id: 20, name: 'Academic_Calendar.pdf', type: 'pdf', size: 1572864, dateModified: new Date('2025-01-05'), dateCreated: new Date('2024-12-20'), parentId: 3, path: '/Academic_Documents/Academic_Calendar.pdf', isStarred: true, isTemp: false, extension: 'pdf', uploadedBy: 'Admin', tags: ['calendar'] },

  // Files inside Staff_Records folder (parentId: 4)
  { id: 21, name: 'Teaching_Staff', type: 'folder', size: 73400320, items: 65, dateModified: new Date('2025-01-18'), dateCreated: new Date('2024-06-15'), parentId: 4, path: '/Staff_Records/Teaching_Staff', isStarred: false, isTemp: false, uploadedBy: 'HR', tags: ['teachers'] },
  { id: 22, name: 'Non_Teaching_Staff', type: 'folder', size: 41943040, items: 45, dateModified: new Date('2025-01-17'), dateCreated: new Date('2024-06-15'), parentId: 4, path: '/Staff_Records/Non_Teaching_Staff', isStarred: false, isTemp: false, uploadedBy: 'HR', tags: ['staff'] },
  { id: 23, name: 'staff_master_list.xlsx', type: 'spreadsheet', size: 1048576, dateModified: new Date('2025-01-18'), dateCreated: new Date('2024-06-20'), parentId: 4, path: '/Staff_Records/staff_master_list.xlsx', isStarred: true, isTemp: false, extension: 'xlsx', uploadedBy: 'HR', tags: ['master', 'list'] },

  // Temp files (parentId: 5)
  { id: 24, name: 'upload_cache_001.tmp', type: 'other', size: 10485760, dateModified: new Date('2025-01-22'), dateCreated: new Date('2025-01-22'), parentId: 5, path: '/Temp_Files/upload_cache_001.tmp', isStarred: false, isTemp: true, extension: 'tmp', uploadedBy: 'System', tags: ['cache'] },
  { id: 25, name: 'export_temp_data.tmp', type: 'other', size: 15728640, dateModified: new Date('2025-01-21'), dateCreated: new Date('2025-01-21'), parentId: 5, path: '/Temp_Files/export_temp_data.tmp', isStarred: false, isTemp: true, extension: 'tmp', uploadedBy: 'System', tags: ['export'] },
  { id: 26, name: 'thumbnail_cache', type: 'folder', size: 26214400, items: 500, dateModified: new Date('2025-01-22'), dateCreated: new Date('2025-01-15'), parentId: 5, path: '/Temp_Files/thumbnail_cache', isStarred: false, isTemp: true, uploadedBy: 'System', tags: ['cache', 'thumbnails'] },

  // Duplicate files for testing
  { id: 27, name: 'School_Logo_Copy.png', type: 'image', size: 5347737, dateModified: new Date('2024-12-21'), dateCreated: new Date('2024-12-21'), parentId: null, path: '/School_Logo_Copy.png', isStarred: false, isTemp: false, extension: 'png', mimeType: 'image/png', uploadedBy: 'Admin', description: 'Duplicate of School Logo', tags: ['logo', 'duplicate'] },
  { id: 28, name: 'Admission_Policy_v2_backup.pdf', type: 'pdf', size: 2516582, dateModified: new Date('2025-02-02'), dateCreated: new Date('2025-02-02'), parentId: null, path: '/Admission_Policy_v2_backup.pdf', isStarred: false, isTemp: false, extension: 'pdf', mimeType: 'application/pdf', uploadedBy: 'Admin', description: 'Backup copy', tags: ['policy', 'backup', 'duplicate'] }];


  return files;
};

// Utility functions
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const getFileIcon = (type: string, className: string = "w-5 h-5") => {
  switch (type) {
    case 'folder':
      return <Folder className={`${className} text-blue-500 fill-blue-100`} />;
    case 'image':
      return <Image className={`${className} text-purple-500`} />;
    case 'pdf':
      return <FileText className={`${className} text-red-500`} />;
    case 'spreadsheet':
      return <FileSpreadsheet className={`${className} text-green-500`} />;
    case 'archive':
      return <FileArchive className={`${className} text-yellow-500`} />;
    case 'video':
      return <Film className={`${className} text-pink-500`} />;
    case 'audio':
      return <Music className={`${className} text-indigo-500`} />;
    case 'document':
      return <FileText className={`${className} text-blue-500`} />;
    default:
      return <File className={`${className} text-gray-500`} />;
  }
};

export function FileDocumentStorageManager() {
  // State management
  const [files, setFiles] = useState<FileItem[]>(generateMockFiles());
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([{ id: null, name: 'Root' }]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [sortField, setSortField] = useState<'name' | 'size' | 'dateModified'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Upload state
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [fileToDelete, setFileToDelete] = useState<FileItem | null>(null);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [showRenameModal, setShowRenameModal] = useState<boolean>(false);
  const [fileToRename, setFileToRename] = useState<FileItem | null>(null);
  const [newFileName, setNewFileName] = useState<string>('');
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [fileToPreview, setFileToPreview] = useState<FileItem | null>(null);
  const [showMoveModal, setShowMoveModal] = useState<boolean>(false);
  const [filesToMove, setFilesToMove] = useState<FileItem[]>([]);
  const [moveTargetFolder, setMoveTargetFolder] = useState<number | null>(null);

  // Quick action states
  const [isCleaningTemp, setIsCleaningTemp] = useState<boolean>(false);
  const [isScanningDuplicates, setIsScanningDuplicates] = useState<boolean>(false);
  const [duplicateGroups, setDuplicateGroups] = useState<DuplicateGroup[]>([]);
  const [showDuplicatesModal, setShowDuplicatesModal] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{x: number;y: number;file: FileItem;} | null>(null);

  // Calculate storage usage
  const totalStorage = 100 * 1024 * 1024 * 1024; // 100 GB in bytes
  const usedStorage = files.reduce((acc, file) => acc + file.size, 0);
  const usedPercentage = Math.round(usedStorage / totalStorage * 100);
  const availableStorage = totalStorage - usedStorage;

  // Get current folder files
  const getCurrentFiles = useCallback((): FileItem[] => {
    let currentFiles = files.filter((f) => f.parentId === currentFolderId);

    // Apply search filter
    if (searchQuery) {
      currentFiles = currentFiles.filter((f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply sorting
    currentFiles.sort((a, b) => {
      // Folders first
      if (a.type === 'folder' && b.type !== 'folder') return -1;
      if (a.type !== 'folder' && b.type === 'folder') return 1;

      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
        case 'dateModified':
          comparison = a.dateModified.getTime() - b.dateModified.getTime();
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return currentFiles;
  }, [files, currentFolderId, searchQuery, sortField, sortDirection]);

  // Navigation functions
  const navigateToFolder = (folderId: number | null, folderName: string = 'Root') => {
    setCurrentFolderId(folderId);
    setSelectedFiles([]);
    setSearchQuery('');

    if (folderId === null) {
      setBreadcrumbs([{ id: null, name: 'Root' }]);
    } else {
      // Build breadcrumb path
      const newBreadcrumbs: BreadcrumbItem[] = [{ id: null, name: 'Root' }];
      let currentId: number | null = folderId;
      const pathItems: BreadcrumbItem[] = [];

      while (currentId !== null) {
        const folder = files.find((f) => f.id === currentId);
        if (folder) {
          pathItems.unshift({ id: folder.id, name: folder.name });
          currentId = folder.parentId;
        } else {
          break;
        }
      }

      setBreadcrumbs([...newBreadcrumbs, ...pathItems]);
    }
  };

  const handleFolderDoubleClick = (file: FileItem) => {
    if (file.type === 'folder') {
      navigateToFolder(file.id, file.name);
    } else {
      handlePreviewFile(file);
    }
  };

  // File operations
  const handleDeleteClick = (file: FileItem) => {
    setFileToDelete(file);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (fileToDelete) {
      // If it's a folder, delete all children recursively
      const idsToDelete = new Set<number>([fileToDelete.id]);

      const findChildren = (parentId: number) => {
        files.forEach((f) => {
          if (f.parentId === parentId) {
            idsToDelete.add(f.id);
            if (f.type === 'folder') {
              findChildren(f.id);
            }
          }
        });
      };

      if (fileToDelete.type === 'folder') {
        findChildren(fileToDelete.id);
      }

      setFiles((prev) => prev.filter((f) => !idsToDelete.has(f.id)));
      setShowDeleteModal(false);
      setFileToDelete(null);
    }
  };

  const handleBulkDelete = () => {
    if (selectedFiles.length === 0) return;

    const idsToDelete = new Set<number>(selectedFiles);

    // Find children of selected folders
    const findChildren = (parentId: number) => {
      files.forEach((f) => {
        if (f.parentId === parentId) {
          idsToDelete.add(f.id);
          if (f.type === 'folder') {
            findChildren(f.id);
          }
        }
      });
    };

    selectedFiles.forEach((id) => {
      const file = files.find((f) => f.id === id);
      if (file?.type === 'folder') {
        findChildren(id);
      }
    });

    setFiles((prev) => prev.filter((f) => !idsToDelete.has(f.id)));
    setSelectedFiles([]);
  };

  const handleRenameClick = (file: FileItem) => {
    setFileToRename(file);
    setNewFileName(file.name);
    setShowRenameModal(true);
  };

  const confirmRename = () => {
    if (fileToRename && newFileName.trim()) {
      setFiles((prev) => prev.map((f) =>
      f.id === fileToRename.id ?
      { ...f, name: newFileName.trim(), dateModified: new Date() } :
      f
      ));
      setShowRenameModal(false);
      setFileToRename(null);
      setNewFileName('');
    }
  };

  const handlePreviewFile = (file: FileItem) => {
    setFileToPreview(file);
    setShowPreviewModal(true);
  };

  const handleToggleStar = (file: FileItem) => {
    setFiles((prev) => prev.map((f) =>
    f.id === file.id ? { ...f, isStarred: !f.isStarred } : f
    ));
  };

  const handleDownloadFile = (file: FileItem) => {
    // Simulate download
    const link = document.createElement('a');
    link.href = '#';
    link.download = file.name;
    alert(`Downloading: ${file.name} (${formatFileSize(file.size)})`);
  };

  const handleCopyFile = (file: FileItem) => {
    const newFile: FileItem = {
      ...file,
      id: Math.max(...files.map((f) => f.id)) + 1,
      name: `${file.name.replace(/(\.[^.]+)$/, '')}_copy${file.extension ? '.' + file.extension : ''}`,
      dateCreated: new Date(),
      dateModified: new Date(),
      isStarred: false
    };
    setFiles((prev) => [...prev, newFile]);
  };

  // Create folder
  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: FileItem = {
        id: Math.max(...files.map((f) => f.id)) + 1,
        name: newFolderName.trim(),
        type: 'folder',
        size: 0,
        items: 0,
        dateCreated: new Date(),
        dateModified: new Date(),
        parentId: currentFolderId,
        path: currentFolderId ?
        `${files.find((f) => f.id === currentFolderId)?.path}/${newFolderName.trim()}` :
        `/${newFolderName.trim()}`,
        isStarred: false,
        isTemp: false,
        uploadedBy: 'Admin',
        tags: []
      };
      setFiles((prev) => [...prev, newFolder]);
      setShowCreateFolderModal(false);
      setNewFolderName('');
    }
  };

  // Move files
  const handleMoveClick = (filesToMoveList: FileItem[]) => {
    setFilesToMove(filesToMoveList);
    setMoveTargetFolder(null);
    setShowMoveModal(true);
  };

  const confirmMove = () => {
    if (filesToMove.length > 0) {
      setFiles((prev) => prev.map((f) =>
      filesToMove.some((fm) => fm.id === f.id) ?
      { ...f, parentId: moveTargetFolder, dateModified: new Date() } :
      f
      ));
      setShowMoveModal(false);
      setFilesToMove([]);
      setSelectedFiles([]);
    }
  };

  // Upload functions
  const handleFileUpload = (uploadedFiles: FileList | null) => {
    if (!uploadedFiles) return;

    const newUploadingFiles: UploadingFile[] = Array.from(uploadedFiles).map((file, index) => ({
      id: `upload-${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'uploading' as const
    }));

    setUploadingFiles((prev) => [...prev, ...newUploadingFiles]);
    setShowUploadModal(true);

    // Simulate upload progress
    newUploadingFiles.forEach((uploadFile, index) => {
      const interval = setInterval(() => {
        setUploadingFiles((prev) => {
          const updated = prev.map((f) => {
            if (f.id === uploadFile.id) {
              const newProgress = Math.min(f.progress + Math.random() * 20, 100);
              if (newProgress >= 100) {
                clearInterval(interval);

                // Add file to files list
                const fileType = getFileTypeFromName(uploadFile.name);
                const newFile: FileItem = {
                  id: Math.max(...files.map((f) => f.id)) + index + 1,
                  name: uploadFile.name,
                  type: fileType,
                  size: uploadFile.size,
                  dateCreated: new Date(),
                  dateModified: new Date(),
                  parentId: currentFolderId,
                  path: currentFolderId ?
                  `${files.find((f) => f.id === currentFolderId)?.path}/${uploadFile.name}` :
                  `/${uploadFile.name}`,
                  isStarred: false,
                  isTemp: false,
                  extension: uploadFile.name.split('.').pop(),
                  uploadedBy: 'Admin',
                  tags: []
                };
                setFiles((prevFiles) => [...prevFiles, newFile]);

                return { ...f, progress: 100, status: 'completed' as const };
              }
              return { ...f, progress: newProgress };
            }
            return f;
          });
          return updated;
        });
      }, 200);
    });
  };

  const getFileTypeFromName = (name: string): FileItem['type'] => {
    const ext = name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':return 'pdf';
      case 'jpg':case 'jpeg':case 'png':case 'gif':case 'bmp':case 'webp':return 'image';
      case 'doc':case 'docx':case 'txt':case 'rtf':return 'document';
      case 'xls':case 'xlsx':case 'csv':return 'spreadsheet';
      case 'zip':case 'rar':case '7z':case 'tar':case 'gz':return 'archive';
      case 'mp4':case 'avi':case 'mov':case 'wmv':case 'mkv':return 'video';
      case 'mp3':case 'wav':case 'flac':case 'aac':case 'ogg':return 'audio';
      default:return 'other';
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  // Quick actions
  const handleCleanTempFiles = async () => {
    setIsCleaningTemp(true);

    // Simulate cleaning process
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Find and remove temp files
    const tempFileIds = files.
    filter((f) => f.isTemp || f.parentId === 5) // Temp folder ID is 5
    .map((f) => f.id);

    const cleanedSize = files.
    filter((f) => tempFileIds.includes(f.id)).
    reduce((acc, f) => acc + f.size, 0);

    setFiles((prev) => prev.filter((f) => !tempFileIds.includes(f.id) && f.id !== 5));

    setIsCleaningTemp(false);
    alert(`Cleaned up ${tempFileIds.length} temporary files, freed ${formatFileSize(cleanedSize)}`);
  };

  const handleScanDuplicates = async () => {
    setIsScanningDuplicates(true);

    // Simulate scanning process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Find duplicates by size (simplified duplicate detection)
    const sizeGroups: Map<number, FileItem[]> = new Map();
    files.filter((f) => f.type !== 'folder').forEach((file) => {
      const existing = sizeGroups.get(file.size) || [];
      sizeGroups.set(file.size, [...existing, file]);
    });

    const duplicates: DuplicateGroup[] = [];
    sizeGroups.forEach((groupFiles, size) => {
      if (groupFiles.length > 1) {
        duplicates.push({
          hash: `size-${size}`,
          files: groupFiles,
          totalSize: size * groupFiles.length
        });
      }
    });

    setDuplicateGroups(duplicates);
    setIsScanningDuplicates(false);
    setShowDuplicatesModal(true);
  };

  const handleDeleteDuplicate = (fileId: number) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    setDuplicateGroups((prev) => prev.map((group) => ({
      ...group,
      files: group.files.filter((f) => f.id !== fileId)
    })).filter((group) => group.files.length > 1));
  };

  const handleExportFileList = async () => {
    setIsExporting(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const headers = ['Name', 'Type', 'Size', 'Path', 'Modified', 'Created', 'Uploaded By', 'Tags'];
    const rows = files.map((f) => [
    f.name,
    f.type,
    formatFileSize(f.size),
    f.path,
    formatDate(f.dateModified),
    formatDate(f.dateCreated),
    f.uploadedBy,
    f.tags.join('; ')]
    );

    const csvContent = [headers.join(','), ...rows.map((r) => r.map((cell) => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `file_list_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    setIsExporting(false);
  };

  // Selection handlers
  const handleSelectFile = (fileId: number, isCtrlKey: boolean = false) => {
    if (isCtrlKey) {
      setSelectedFiles((prev) =>
      prev.includes(fileId) ?
      prev.filter((id) => id !== fileId) :
      [...prev, fileId]
      );
    } else {
      setSelectedFiles([fileId]);
    }
  };

  const handleSelectAll = () => {
    const currentFileIds = getCurrentFiles().map((f) => f.id);
    if (selectedFiles.length === currentFileIds.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(currentFileIds);
    }
  };

  // Sort handler
  const handleSort = (field: 'name' | 'size' | 'dateModified') => {
    if (sortField === field) {
      setSortDirection((prev) => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Context menu handler
  const handleContextMenu = (e: React.MouseEvent, file: FileItem) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, file });
  };

  // Close context menu on click outside
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Table columns
  const columns = [
  {
    key: 'select',
    header:
    <input
      type="checkbox"
      checked={selectedFiles.length === getCurrentFiles().length && getCurrentFiles().length > 0}
      onChange={handleSelectAll}
      className="rounded" />,


    render: (row: FileItem) =>
    <input
      type="checkbox"
      checked={selectedFiles.includes(row.id)}
      onChange={(e) => handleSelectFile(row.id, e.ctrlKey)}
      onClick={(e) => e.stopPropagation()}
      className="rounded" />


  },
  {
    key: 'name',
    header:
    <button
      className="flex items-center gap-1 hover:text-blue-600"
      onClick={() => handleSort('name')}>

          Name
          <ArrowUpDown className="w-3 h-3" />
        </button>,

    render: (row: FileItem) =>
    <div
      className="flex items-center gap-3 cursor-pointer"
      onDoubleClick={() => handleFolderDoubleClick(row)}>

          {getFileIcon(row.type)}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{row.name}</span>
              {row.isStarred && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
            </div>
            {row.tags.length > 0 &&
        <div className="flex gap-1 mt-1">
                {row.tags.slice(0, 2).map((tag) =>
          <span key={tag} className="text-xs bg-gray-100 px-1 rounded">{tag}</span>
          )}
              </div>
        }
          </div>
        </div>

  },
  {
    key: 'size',
    header:
    <button
      className="flex items-center gap-1 hover:text-blue-600"
      onClick={() => handleSort('size')}>

          Size
          <ArrowUpDown className="w-3 h-3" />
        </button>,

    render: (row: FileItem) => formatFileSize(row.size)
  },
  {
    key: 'items',
    header: 'Items',
    render: (row: FileItem) =>
    <span className="text-gray-500">
          {row.type === 'folder' ? `${row.items?.toLocaleString()} items` : '-'}
        </span>

  },
  {
    key: 'dateModified',
    header:
    <button
      className="flex items-center gap-1 hover:text-blue-600"
      onClick={() => handleSort('dateModified')}>

          Modified
          <ArrowUpDown className="w-3 h-3" />
        </button>,

    render: (row: FileItem) => formatDate(row.dateModified)
  },
  {
    key: 'uploadedBy',
    header: 'Uploaded By',
    render: (row: FileItem) => <span className="text-gray-500">{row.uploadedBy}</span>
  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: FileItem) =>
    <div className="flex items-center gap-1">
          <Button
        variant="ghost"
        size="xs"
        onClick={(e) => {e.stopPropagation();handleToggleStar(row);}}
        title={row.isStarred ? 'Remove from starred' : 'Add to starred'}>

            {row.isStarred ?
        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> :
        <StarOff className="w-4 h-4 text-gray-400" />
        }
          </Button>
          {row.type !== 'folder' &&
      <Button
        variant="ghost"
        size="xs"
        onClick={(e) => {e.stopPropagation();handleDownloadFile(row);}}
        title="Download">

              <Download className="w-4 h-4 text-gray-500" />
            </Button>
      }
          <Button
        variant="ghost"
        size="xs"
        onClick={(e) => {e.stopPropagation();handleRenameClick(row);}}
        title="Rename">

            <Edit2 className="w-4 h-4 text-gray-500" />
          </Button>
          <Button
        variant="ghost"
        size="xs"
        className="text-red-500 hover:text-red-600 hover:bg-red-50"
        onClick={(e) => {e.stopPropagation();handleDeleteClick(row);}}
        title="Delete">

            <Trash2 className="w-4 h-4" />
          </Button>
          <Button
        variant="ghost"
        size="xs"
        onClick={(e) => {e.stopPropagation();handleContextMenu(e, row);}}
        title="More options">

            <MoreVertical className="w-4 h-4 text-gray-500" />
          </Button>
        </div>

  }];


  const currentFiles = getCurrentFiles();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            File Storage Manager
          </h1>
          <p className="text-sm text-gray-500">
            Manage uploaded documents and storage usage
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowCreateFolderModal(true)}>
            <FolderPlus className="w-4 h-4 mr-2" />
            New Folder
          </Button>
          <Button onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files)} />

        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedFiles.length > 0 &&
      <div className="bg-blue-50 p-3 rounded-lg flex items-center justify-between">
          <span className="text-sm text-blue-800">
            {selectedFiles.length} item(s) selected
          </span>
          <div className="flex gap-2">
            <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const selectedFileObjects = files.filter((f) => selectedFiles.includes(f.id));
              handleMoveClick(selectedFileObjects);
            }}>

              <Move className="w-4 h-4 mr-1" />
              Move
            </Button>
            <Button
            variant="outline"
            size="sm"
            onClick={() => {
              selectedFiles.forEach((id) => {
                const file = files.find((f) => f.id === id);
                if (file && file.type !== 'folder') {
                  handleDownloadFile(file);
                }
              });
            }}>

              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
            <Button
            variant="danger"
            size="sm"
            onClick={handleBulkDelete}>

              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
            <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedFiles([])}>

              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      }

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main File Browser */}
        <Card
          className={`md:col-span-2 ${isDragging ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}>

          {/* Breadcrumbs and Search */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {breadcrumbs.map((crumb, index) =>
              <React.Fragment key={crumb.id ?? 'root'}>
                  {index > 0 && <ChevronRight className="w-4 h-4" />}
                  <span
                  className={`hover:text-blue-600 cursor-pointer ${
                  index === breadcrumbs.length - 1 ? 'font-medium text-gray-900' : ''}`
                  }
                  onClick={() => navigateToFolder(crumb.id, crumb.name)}>

                    {crumb.name}
                  </span>
                </React.Fragment>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex border rounded-md">
                <button
                  className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                  onClick={() => setViewMode('list')}>

                  <List className="w-4 h-4" />
                </button>
                <button
                  className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                  onClick={() => setViewMode('grid')}>

                  <Grid className="w-4 h-4" />
                </button>
              </div>
              <div className="w-64">
                <Input
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" />} />

              </div>
            </div>
          </div>

          {/* Drag and Drop Overlay */}
          {isDragging &&
          <div className="absolute inset-0 bg-blue-50 bg-opacity-90 flex items-center justify-center z-10 rounded-lg">
              <div className="text-center">
                <Upload className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                <p className="text-lg font-medium text-blue-700">Drop files here to upload</p>
              </div>
            </div>
          }

          {/* File List/Grid */}
          {viewMode === 'list' ?
          <Table
            columns={columns}
            data={currentFiles}
            onRowClick={(row) => handleSelectFile(row.id)}
            onRowContextMenu={(e, row) => handleContextMenu(e, row)} /> :


          <div className="grid grid-cols-4 gap-4">
              {currentFiles.map((file) =>
            <div
              key={file.id}
              className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
              selectedFiles.includes(file.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`
              }
              onClick={() => handleSelectFile(file.id)}
              onDoubleClick={() => handleFolderDoubleClick(file)}
              onContextMenu={(e) => handleContextMenu(e, file)}>

                  <div className="flex flex-col items-center text-center">
                    {getFileIcon(file.type, "w-12 h-12")}
                    <p className="mt-2 text-sm font-medium truncate w-full">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
            )}
            </div>
          }

          {currentFiles.length === 0 &&
          <div className="text-center py-12">
              <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchQuery ? 'No files match your search' : 'This folder is empty'}
              </p>
              <Button
              variant="outline"
              className="mt-4"
              onClick={() => fileInputRef.current?.click()}>

                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </Button>
            </div>
          }
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Storage Usage */}
          <Card title="Storage Usage">
            <div className="flex flex-col items-center py-6">
              <div className="relative w-32 h-32 mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-200" />

                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${usedPercentage * 2.51} 251`}
                    className="text-blue-600" />

                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="block text-2xl font-bold text-gray-900">
                      {usedPercentage}%
                    </span>
                    <span className="text-xs text-gray-500">Used</span>
                  </div>
                </div>
              </div>
              <div className="w-full space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Space</span>
                  <span className="font-medium">{formatFileSize(totalStorage)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Used Space</span>
                  <span className="font-medium">{formatFileSize(usedStorage)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Available</span>
                  <span className="font-medium">{formatFileSize(availableStorage)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Files</span>
                  <span className="font-medium">{files.filter((f) => f.type !== 'folder').length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Folders</span>
                  <span className="font-medium">{files.filter((f) => f.type === 'folder').length}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card title="Quick Actions">
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleCleanTempFiles}
                disabled={isCleaningTemp}>

                {isCleaningTemp ?
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

                <RefreshCw className="w-4 h-4 mr-2" />
                }
                {isCleaningTemp ? 'Cleaning...' : 'Clean up Temp Files'}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleScanDuplicates}
                disabled={isScanningDuplicates}>

                {isScanningDuplicates ?
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

                <Copy className="w-4 h-4 mr-2" />
                }
                {isScanningDuplicates ? 'Scanning...' : 'Scan for Duplicates'}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleExportFileList}
                disabled={isExporting}>

                {isExporting ?
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

                <Download className="w-4 h-4 mr-2" />
                }
                {isExporting ? 'Exporting...' : 'Export File List'}
              </Button>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card title="Recent Uploads">
            <div className="space-y-3">
              {files.
              filter((f) => f.type !== 'folder').
              sort((a, b) => b.dateCreated.getTime() - a.dateCreated.getTime()).
              slice(0, 5).
              map((file) =>
              <div
                key={file.id}
                className="flex items-center gap-3 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded"
                onClick={() => handlePreviewFile(file)}>

                    {getFileIcon(file.type, "w-4 h-4")}
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatDate(file.dateCreated)}</p>
                    </div>
                  </div>
              )
              }
            </div>
          </Card>

          {/* Starred Files */}
          <Card title="Starred Files">
            <div className="space-y-3">
              {files.
              filter((f) => f.isStarred).
              slice(0, 5).
              map((file) =>
              <div
                key={file.id}
                className="flex items-center gap-3 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded"
                onClick={() => file.type === 'folder' ? navigateToFolder(file.id, file.name) : handlePreviewFile(file)}>

                    {getFileIcon(file.type, "w-4 h-4")}
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  </div>
              )
              }
              {files.filter((f) => f.isStarred).length === 0 &&
              <p className="text-sm text-gray-500 text-center py-4">No starred files</p>
              }
            </div>
          </Card>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu &&
      <div
        className="fixed bg-white border rounded-lg shadow-lg py-1 z-50"
        style={{ left: contextMenu.x, top: contextMenu.y }}>

          {contextMenu.file.type !== 'folder' &&
        <button
          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
          onClick={() => {handlePreviewFile(contextMenu.file);setContextMenu(null);}}>

              <Eye className="w-4 h-4" /> Preview
            </button>
        }
          {contextMenu.file.type === 'folder' &&
        <button
          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
          onClick={() => {navigateToFolder(contextMenu.file.id, contextMenu.file.name);setContextMenu(null);}}>

              <Folder className="w-4 h-4" /> Open
            </button>
        }
          <button
          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
          onClick={() => {handleRenameClick(contextMenu.file);setContextMenu(null);}}>

            <Edit2 className="w-4 h-4" /> Rename
          </button>
          <button
          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
          onClick={() => {handleCopyFile(contextMenu.file);setContextMenu(null);}}>

            <Copy className="w-4 h-4" /> Copy
          </button>
          <button
          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
          onClick={() => {handleMoveClick([contextMenu.file]);setContextMenu(null);}}>

            <Move className="w-4 h-4" /> Move
          </button>
          {contextMenu.file.type !== 'folder' &&
        <button
          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
          onClick={() => {handleDownloadFile(contextMenu.file);setContextMenu(null);}}>

              <Download className="w-4 h-4" /> Download
            </button>
        }
          <button
          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
          onClick={() => {handleToggleStar(contextMenu.file);setContextMenu(null);}}>

            {contextMenu.file.isStarred ?
          <><StarOff className="w-4 h-4" /> Remove from Starred</> :
          <><Star className="w-4 h-4" /> Add to Starred</>
          }
          </button>
          <hr className="my-1" />
          <button
          className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
          onClick={() => {handleDeleteClick(contextMenu.file);setContextMenu(null);}}>

            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      }

      {/* Delete Confirmation Modal */}
      {showDeleteModal && fileToDelete &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete {fileToDelete.type === 'folder' ? 'Folder' : 'File'}</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{fileToDelete.name}</strong>?
              {fileToDelete.type === 'folder' && fileToDelete.items && fileToDelete.items > 0 &&
            <span className="block mt-2 text-red-600">
                  This folder contains {fileToDelete.items} item(s) that will also be deleted.
                </span>
            }
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Create Folder Modal */}
      {showCreateFolderModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Folder</h3>
            <Input
            label="Folder Name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Enter folder name"
            autoFocus />

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => {setShowCreateFolderModal(false);setNewFolderName('');}}>
                Cancel
              </Button>
              <Button onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
                Create
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Rename Modal */}
      {showRenameModal && fileToRename &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rename {fileToRename.type === 'folder' ? 'Folder' : 'File'}</h3>
            <Input
            label="New Name"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder="Enter new name"
            autoFocus />

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => {setShowRenameModal(false);setFileToRename(null);setNewFileName('');}}>
                Cancel
              </Button>
              <Button onClick={confirmRename} disabled={!newFileName.trim()}>
                Rename
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Preview Modal */}
      {showPreviewModal && fileToPreview &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                {getFileIcon(fileToPreview.type, "w-8 h-8")}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{fileToPreview.name}</h3>
                  <p className="text-sm text-gray-500">{formatFileSize(fileToPreview.size)}</p>
                </div>
              </div>
              <Button variant="ghost" onClick={() => setShowPreviewModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                {fileToPreview.type === 'image' &&
              <div className="flex items-center justify-center bg-gray-200 h-64 rounded">
                    <Image className="w-16 h-16 text-gray-400" />
                    <span className="ml-2 text-gray-500">Image Preview</span>
                  </div>
              }
                {fileToPreview.type === 'pdf' &&
              <div className="flex items-center justify-center bg-gray-200 h-64 rounded">
                    <FileText className="w-16 h-16 text-gray-400" />
                    <span className="ml-2 text-gray-500">PDF Preview</span>
                  </div>
              }
                {!['image', 'pdf'].includes(fileToPreview.type) &&
              <div className="flex items-center justify-center bg-gray-200 h-32 rounded">
                    {getFileIcon(fileToPreview.type, "w-16 h-16 text-gray-400")}
                    <span className="ml-2 text-gray-500">Preview not available</span>
                  </div>
              }
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Type</p>
                  <p className="font-medium capitalize">{fileToPreview.type}</p>
                </div>
                <div>
                  <p className="text-gray-500">Size</p>
                  <p className="font-medium">{formatFileSize(fileToPreview.size)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Created</p>
                  <p className="font-medium">{formatDate(fileToPreview.dateCreated)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Modified</p>
                  <p className="font-medium">{formatDate(fileToPreview.dateModified)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Path</p>
                  <p className="font-medium truncate">{fileToPreview.path}</p>
                </div>
                <div>
                  <p className="text-gray-500">Uploaded By</p>
                  <p className="font-medium">{fileToPreview.uploadedBy}</p>
                </div>
                {fileToPreview.tags.length > 0 &&
              <div className="col-span-2">
                    <p className="text-gray-500">Tags</p>
                    <div className="flex gap-1 mt-1">
                      {fileToPreview.tags.map((tag) =>
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                  )}
                    </div>
                  </div>
              }
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => handleDownloadFile(fileToPreview)}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" onClick={() => setShowPreviewModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Move Modal */}
      {showMoveModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Move {filesToMove.length} item(s)
            </h3>
            <p className="text-sm text-gray-500 mb-4">Select destination folder:</p>
            
            <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-2">
              <div
              className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-50 ${
              moveTargetFolder === null ? 'bg-blue-50 border border-blue-200' : ''}`
              }
              onClick={() => setMoveTargetFolder(null)}>

                <Folder className="w-5 h-5 text-blue-500" />
                <span>Root</span>
              </div>
              {files.
            filter((f) => f.type === 'folder' && !filesToMove.some((fm) => fm.id === f.id)).
            map((folder) =>
            <div
              key={folder.id}
              className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-50 ${
              moveTargetFolder === folder.id ? 'bg-blue-50 border border-blue-200' : ''}`
              }
              onClick={() => setMoveTargetFolder(folder.id)}>

                    <Folder className="w-5 h-5 text-blue-500" />
                    <span>{folder.name}</span>
                  </div>
            )
            }
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => {setShowMoveModal(false);setFilesToMove([]);}}>
                Cancel
              </Button>
              <Button onClick={confirmMove}>
                Move Here
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Upload Progress Modal */}
      {showUploadModal && uploadingFiles.length > 0 &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Uploading Files</h3>
              <Button
              variant="ghost"
              onClick={() => {
                if (uploadingFiles.every((f) => f.status !== 'uploading')) {
                  setShowUploadModal(false);
                  setUploadingFiles([]);
                }
              }}
              disabled={uploadingFiles.some((f) => f.status === 'uploading')}>

                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {uploadingFiles.map((file) =>
            <div key={file.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {file.status === 'uploading' && `${Math.round(file.progress)}%`}
                      {file.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {file.status === 'failed' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                  className={`h-1.5 rounded-full transition-all ${
                  file.status === 'completed' ? 'bg-green-500' :
                  file.status === 'failed' ? 'bg-red-500' : 'bg-blue-500'}`
                  }
                  style={{ width: `${file.progress}%` }} />

                  </div>
                </div>
            )}
            </div>
            
            {uploadingFiles.every((f) => f.status !== 'uploading') &&
          <div className="mt-4 flex justify-end">
                <Button onClick={() => {setShowUploadModal(false);setUploadingFiles([]);}}>
                  Done
                </Button>
              </div>
          }
          </div>
        </div>
      }

      {/* Duplicates Modal */}
      {showDuplicatesModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Duplicate Files Found</h3>
              <Button variant="ghost" onClick={() => setShowDuplicatesModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {duplicateGroups.length === 0 ?
          <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-lg font-medium">No Duplicates Found</p>
                <p className="text-gray-500">Your files are unique!</p>
              </div> :

          <div className="space-y-6">
                <p className="text-sm text-gray-500">
                  Found {duplicateGroups.length} group(s) of potential duplicates. 
                  You can safely delete duplicate copies to free up space.
                </p>
                
                {duplicateGroups.map((group, groupIndex) =>
            <div key={group.hash} className="border rounded-lg p-4">
                    <p className="text-sm font-medium mb-3">
                      Group {groupIndex + 1} - {formatFileSize(group.files[0].size)} each
                    </p>
                    <div className="space-y-2">
                      {group.files.map((file, fileIndex) =>
                <div key={file.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <div className="flex items-center gap-2">
                            {getFileIcon(file.type, "w-4 h-4")}
                            <div>
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-gray-500">{file.path}</p>
                            </div>
                            {fileIndex === 0 &&
                    <Badge variant="success">Original</Badge>
                    }
                          </div>
                          {fileIndex !== 0 &&
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteDuplicate(file.id)}>

                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                  }
                        </div>
                )}
                    </div>
                  </div>
            )}
              </div>
          }
            
            <div className="flex justify-end mt-6">
              <Button variant="outline" onClick={() => setShowDuplicatesModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}