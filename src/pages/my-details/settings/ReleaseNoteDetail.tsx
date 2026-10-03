import React, { useState, useMemo, useCallback } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  FileTextIcon,
  CheckCircleIcon,
  SearchIcon,
  FilterIcon,
  DownloadIcon,
  XIcon,
  RefreshCwIcon,
  ExpandIcon,
  MinimizeIcon,
  BookmarkIcon,
  ShareIcon,
  PrinterIcon,
  BellIcon,
  ClipboardIcon,
  ExternalLinkIcon,
  VideoIcon,
  FileIcon,
  AlertTriangleIcon,
  InfoIcon,
  CheckIcon } from
'lucide-react';

// Types
interface Attachment {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'video' | 'link' | 'excel';
  size?: string;
  url: string;
}

interface ChangeItem {
  id: string;
  text: string;
  category: 'added' | 'changed' | 'fixed' | 'removed' | 'deprecated' | 'security';
}

interface Release {
  version: string;
  date: string;
  title: string;
  description: string;
  type: 'New Feature' | 'Bug Fix' | 'Enhancement' | 'Security' | 'Breaking Change';
  modules: string[];
  changes: ChangeItem[];
  acknowledged: boolean;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  attachments: Attachment[];
  isBookmarked: boolean;
  notificationsEnabled: boolean;
  relatedVersions: string[];
  author: string;
  tags: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
}

// Mock Data
const initialReleasesData: Release[] = [
{
  version: '3.1.0',
  date: '15-Feb-2025',
  title: 'Student Portal Enhancement',
  description: 'Major update to the student portal with new dashboard features, improved mobile experience, and dark mode support for better accessibility.',
  type: 'New Feature',
  modules: ['Student Management', 'Parent Portal'],
  changes: [
  { id: 'c1', text: 'Added new dashboard widgets for student performance tracking', category: 'added' },
  { id: 'c2', text: 'Enabled online fee payment history view with export option', category: 'added' },
  { id: 'c3', text: 'Improved mobile responsiveness for profile page', category: 'changed' },
  { id: 'c4', text: 'Added dark mode support across all modules', category: 'added' },
  { id: 'c5', text: 'Fixed login session timeout issue causing unexpected logouts', category: 'fixed' }],

  acknowledged: false,
  attachments: [
  { id: 'a1', name: 'Release Notes v3.1.0.pdf', type: 'pdf', size: '2.4 MB', url: '/downloads/release-3.1.0.pdf' },
  { id: 'a2', name: 'Migration Guide.pdf', type: 'pdf', size: '1.1 MB', url: '/downloads/migration-3.1.0.pdf' },
  { id: 'a3', name: 'Video Walkthrough', type: 'video', url: 'https://video.example.com/release-3.1.0' }],

  isBookmarked: false,
  notificationsEnabled: true,
  relatedVersions: ['3.0.5', '3.0.4'],
  author: 'Core Development Team',
  tags: ['dashboard', 'mobile', 'dark-mode', 'ui'],
  priority: 'high'
},
{
  version: '3.0.5',
  date: '20-Jan-2025',
  title: 'Fee Module Bug Fixes',
  description: 'Critical bug fixes for the fee management module addressing calculation errors and printing issues that were reported by multiple schools.',
  type: 'Bug Fix',
  modules: ['Finance', 'Fees'],
  changes: [
  { id: 'c6', text: 'Fixed calculation error in late fee logic causing incorrect amounts', category: 'fixed' },
  { id: 'c7', text: 'Resolved receipt printing alignment issue on thermal printers', category: 'fixed' },
  { id: 'c8', text: 'Corrected total amount display in daily collection report', category: 'fixed' },
  { id: 'c9', text: 'Fixed currency formatting inconsistency', category: 'fixed' }],

  acknowledged: true,
  acknowledgedAt: '2025-01-21T10:30:00Z',
  acknowledgedBy: 'Admin User',
  attachments: [
  { id: 'a4', name: 'Release Notes v3.0.5.pdf', type: 'pdf', size: '1.2 MB', url: '/downloads/release-3.0.5.pdf' },
  { id: 'a5', name: 'Known Issues.pdf', type: 'pdf', size: '0.5 MB', url: '/downloads/known-issues-3.0.5.pdf' }],

  isBookmarked: true,
  notificationsEnabled: false,
  relatedVersions: ['3.0.4'],
  author: 'Finance Module Team',
  tags: ['fees', 'finance', 'bugfix', 'critical'],
  priority: 'critical'
},
{
  version: '3.0.4',
  date: '10-Jan-2025',
  title: 'Performance Improvements',
  description: 'System-wide performance optimizations including database query optimization and reduced page load times for better user experience.',
  type: 'Enhancement',
  modules: ['System Core'],
  changes: [
  { id: 'c10', text: 'Optimized database queries for faster report generation (50% improvement)', category: 'changed' },
  { id: 'c11', text: 'Reduced page load time for dashboard from 3s to 1.2s', category: 'changed' },
  { id: 'c12', text: 'Improved search functionality speed with indexing', category: 'changed' },
  { id: 'c13', text: 'Updated security libraries to latest versions', category: 'security' },
  { id: 'c14', text: 'Added request caching for frequently accessed data', category: 'added' }],

  acknowledged: true,
  acknowledgedAt: '2025-01-11T14:20:00Z',
  acknowledgedBy: 'System Admin',
  attachments: [
  { id: 'a6', name: 'Performance Report.pdf', type: 'pdf', size: '3.5 MB', url: '/downloads/perf-report-3.0.4.pdf' },
  { id: 'a7', name: 'Release Notes v3.0.4.pdf', type: 'pdf', size: '1.0 MB', url: '/downloads/release-3.0.4.pdf' },
  { id: 'a8', name: 'Benchmark Data.xlsx', type: 'excel', size: '0.8 MB', url: '/downloads/benchmark-3.0.4.xlsx' }],

  isBookmarked: false,
  notificationsEnabled: false,
  relatedVersions: ['3.0.3'],
  author: 'Performance Team',
  tags: ['performance', 'optimization', 'security', 'database'],
  priority: 'medium'
},
{
  version: '3.0.3',
  date: '15-Dec-2024',
  title: 'Assessment Module Update',
  description: 'New features for assessment and exam modules including comprehensive CBSE report card templates and enhanced grading capabilities.',
  type: 'New Feature',
  modules: ['Assessment', 'Exam'],
  changes: [
  { id: 'c15', text: 'Added support for co-scholastic grading with configurable parameters', category: 'added' },
  { id: 'c16', text: 'New report card templates for CBSE (Classes 1-12)', category: 'added' },
  { id: 'c17', text: 'Bulk mark entry interface improvements with validation', category: 'changed' },
  { id: 'c18', text: 'Added result analysis charts with export functionality', category: 'added' },
  { id: 'c19', text: 'Fixed grade calculation edge case for boundary marks', category: 'fixed' },
  { id: 'c20', text: 'Added export to Excel for mark sheets with formatting', category: 'added' }],

  acknowledged: true,
  acknowledgedAt: '2024-12-16T09:00:00Z',
  acknowledgedBy: 'Academic Coordinator',
  attachments: [
  { id: 'a9', name: 'Release Notes v3.0.3.pdf', type: 'pdf', size: '2.0 MB', url: '/downloads/release-3.0.3.pdf' },
  { id: 'a10', name: 'CBSE Templates Guide.pdf', type: 'pdf', size: '4.2 MB', url: '/downloads/cbse-guide.pdf' },
  { id: 'a11', name: 'Assessment Training Video', type: 'video', url: 'https://training.example.com/assessment-v3' }],

  isBookmarked: true,
  notificationsEnabled: false,
  relatedVersions: ['3.0.2', '3.0.1'],
  author: 'Assessment Team',
  tags: ['assessment', 'exam', 'cbse', 'report-card', 'grades'],
  priority: 'high'
},
{
  version: '3.0.2',
  date: '01-Dec-2024',
  title: 'Security Patches',
  description: 'Important security updates and vulnerability patches addressing identified security concerns and improving authentication mechanisms.',
  type: 'Security',
  modules: ['System Core', 'Authentication'],
  changes: [
  { id: 'c21', text: 'Patched XSS vulnerability in search fields and forms', category: 'security' },
  { id: 'c22', text: 'Updated authentication token handling with improved encryption', category: 'security' },
  { id: 'c23', text: 'Improved password policy enforcement (min 12 chars, special chars)', category: 'security' },
  { id: 'c24', text: 'Deprecated legacy API endpoints scheduled for removal in v4.0', category: 'deprecated' },
  { id: 'c25', text: 'Added rate limiting to prevent brute force attacks', category: 'added' }],

  acknowledged: true,
  acknowledgedAt: '2024-12-02T08:00:00Z',
  acknowledgedBy: 'Security Admin',
  attachments: [
  { id: 'a12', name: 'Security Advisory.pdf', type: 'pdf', size: '0.8 MB', url: '/downloads/security-3.0.2.pdf' },
  { id: 'a13', name: 'Security Audit Report.pdf', type: 'pdf', size: '2.1 MB', url: '/downloads/audit-3.0.2.pdf' }],

  isBookmarked: false,
  notificationsEnabled: true,
  relatedVersions: ['3.0.1'],
  author: 'Security Team',
  tags: ['security', 'authentication', 'patch', 'xss', 'encryption'],
  priority: 'critical'
},
{
  version: '3.0.1',
  date: '15-Nov-2024',
  title: 'Initial v3 Hotfix',
  description: 'Hotfix release addressing initial v3.0.0 deployment issues reported by early adopters including form validation and email delivery.',
  type: 'Bug Fix',
  modules: ['Student Management', 'Finance', 'HR'],
  changes: [
  { id: 'c26', text: 'Fixed student registration form validation for special characters', category: 'fixed' },
  { id: 'c27', text: 'Corrected payroll calculation for part-time staff overtime', category: 'fixed' },
  { id: 'c28', text: 'Resolved data migration issues from v2.x for custom fields', category: 'fixed' },
  { id: 'c29', text: 'Fixed email notification delivery delays', category: 'fixed' },
  { id: 'c30', text: 'Corrected timezone handling in attendance module', category: 'fixed' }],

  acknowledged: true,
  acknowledgedAt: '2024-11-16T11:30:00Z',
  acknowledgedBy: 'IT Administrator',
  attachments: [
  { id: 'a14', name: 'Release Notes v3.0.1.pdf', type: 'pdf', size: '1.5 MB', url: '/downloads/release-3.0.1.pdf' },
  { id: 'a15', name: 'Troubleshooting Guide.pdf', type: 'pdf', size: '1.8 MB', url: '/downloads/troubleshoot-3.0.1.pdf' }],

  isBookmarked: false,
  notificationsEnabled: false,
  relatedVersions: ['3.0.0'],
  author: 'Support Team',
  tags: ['hotfix', 'migration', 'email', 'validation'],
  priority: 'high'
},
{
  version: '3.0.0',
  date: '01-Nov-2024',
  title: 'Major Version 3 Release',
  description: 'Complete system overhaul with modern architecture, new UI design, and enhanced features. This is a breaking change release requiring data migration.',
  type: 'Breaking Change',
  modules: ['All Modules'],
  changes: [
  { id: 'c31', text: 'Complete UI redesign with modern React-based interface', category: 'changed' },
  { id: 'c32', text: 'New API architecture migrated from REST to GraphQL', category: 'changed' },
  { id: 'c33', text: 'Added real-time notifications using WebSocket', category: 'added' },
  { id: 'c34', text: 'Removed legacy reporting module (use new Analytics instead)', category: 'removed' },
  { id: 'c35', text: 'New role-based access control system with fine-grained permissions', category: 'added' },
  { id: 'c36', text: 'Deprecated v2.x API endpoints (sunset date: Dec 2025)', category: 'deprecated' },
  { id: 'c37', text: 'Added multi-tenant support for school groups', category: 'added' }],

  acknowledged: true,
  acknowledgedAt: '2024-11-01T09:00:00Z',
  acknowledgedBy: 'Super Admin',
  attachments: [
  { id: 'a16', name: 'Release Notes v3.0.0.pdf', type: 'pdf', size: '5.0 MB', url: '/downloads/release-3.0.0.pdf' },
  { id: 'a17', name: 'Migration Guide v2 to v3.pdf', type: 'pdf', size: '3.0 MB', url: '/downloads/migration-v2-v3.pdf' },
  { id: 'a18', name: 'API Changes Documentation', type: 'doc', size: '2.5 MB', url: '/downloads/api-changes.pdf' },
  { id: 'a19', name: 'Training Video Series', type: 'video', url: 'https://training.example.com/v3-complete' },
  { id: 'a20', name: 'Data Migration Checklist.xlsx', type: 'excel', size: '0.3 MB', url: '/downloads/checklist.xlsx' }],

  isBookmarked: true,
  notificationsEnabled: false,
  relatedVersions: [],
  author: 'Core Development Team',
  tags: ['major-release', 'breaking-change', 'migration', 'graphql', 'ui-overhaul'],
  priority: 'critical'
},
{
  version: '2.9.5',
  date: '15-Oct-2024',
  title: 'Final v2.x Release',
  description: 'Final maintenance release for v2.x series before v3.0 migration. Includes preparation tools and stability improvements.',
  type: 'Enhancement',
  modules: ['Student Management', 'Finance'],
  changes: [
  { id: 'c38', text: 'Final stability improvements for v2.x platform', category: 'changed' },
  { id: 'c39', text: 'Added v3 migration preparation and validation tools', category: 'added' },
  { id: 'c40', text: 'Legacy data export functionality for backup purposes', category: 'added' },
  { id: 'c41', text: 'Added deprecation warnings for sunset features', category: 'deprecated' }],

  acknowledged: true,
  acknowledgedAt: '2024-10-16T10:00:00Z',
  acknowledgedBy: 'Admin User',
  attachments: [
  { id: 'a21', name: 'Release Notes v2.9.5.pdf', type: 'pdf', size: '1.0 MB', url: '/downloads/release-2.9.5.pdf' },
  { id: 'a22', name: 'V3 Preparation Guide.pdf', type: 'pdf', size: '2.2 MB', url: '/downloads/v3-prep.pdf' }],

  isBookmarked: false,
  notificationsEnabled: false,
  relatedVersions: ['2.9.4', '2.9.3'],
  author: 'Maintenance Team',
  tags: ['maintenance', 'legacy', 'end-of-life', 'migration-prep'],
  priority: 'medium'
}];


// All modules for filter options
const allModules = [
'Student Management',
'Parent Portal',
'Finance',
'Fees',
'System Core',
'Assessment',
'Exam',
'Authentication',
'HR',
'All Modules'];


export function ReleaseNoteDetail() {
  // State
  const [releases, setReleases] = useState<Release[]>(initialReleasesData);
  const [expandedRelease, setExpandedRelease] = useState<string | null>('3.1.0');
  const [searchQuery, setSearchQuery] = useState('');
  const [versionFilter, setVersionFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [moduleFilter, setModuleFilter] = useState<string>('');
  const [acknowledgedFilter, setAcknowledgedFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [dateFromFilter, setDateFromFilter] = useState<string>('');
  const [dateToFilter, setDateToFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [expandAll, setExpandAll] = useState(false);
  const [selectedReleases, setSelectedReleases] = useState<string[]>([]);
  const [copiedVersion, setCopiedVersion] = useState<string | null>(null);
  const [downloadingAttachments, setDownloadingAttachments] = useState<string[]>([]);
  const [acknowledgingVersions, setAcknowledgingVersions] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Filtered and sorted releases
  const filteredReleases = useMemo(() => {
    let result = releases.filter((release) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
        release.title.toLowerCase().includes(query) ||
        release.version.toLowerCase().includes(query) ||
        release.description.toLowerCase().includes(query) ||
        release.changes.some((c) => c.text.toLowerCase().includes(query)) ||
        release.tags.some((t) => t.toLowerCase().includes(query)) ||
        release.modules.some((m) => m.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Version filter
      if (versionFilter) {
        const majorVersion = release.version.split('.')[0];
        if (majorVersion !== versionFilter) return false;
      }

      // Type filter
      if (typeFilter && release.type !== typeFilter) return false;

      // Module filter
      if (moduleFilter && !release.modules.includes(moduleFilter) && !release.modules.includes('All Modules')) return false;

      // Acknowledged filter
      if (acknowledgedFilter === 'acknowledged' && !release.acknowledged) return false;
      if (acknowledgedFilter === 'pending' && release.acknowledged) return false;

      // Priority filter
      if (priorityFilter && release.priority !== priorityFilter) return false;

      // Date filters
      if (dateFromFilter || dateToFilter) {
        const [day, month, year] = release.date.split('-');
        const monthMap: Record<string, string> = {
          Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
          Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
        };
        const releaseDate = new Date(`${year}-${monthMap[month]}-${day}`);

        if (dateFromFilter && releaseDate < new Date(dateFromFilter)) return false;
        if (dateToFilter && releaseDate > new Date(dateToFilter)) return false;
      }

      return true;
    });

    // Sort
    result.sort((a, b) => {
      const parseDate = (dateStr: string) => {
        const [day, month, year] = dateStr.split('-');
        const monthMap: Record<string, string> = {
          Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
          Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
        };
        return new Date(`${year}-${monthMap[month]}-${day}`).getTime();
      };

      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);

      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [releases, searchQuery, versionFilter, typeFilter, moduleFilter, acknowledgedFilter, priorityFilter, dateFromFilter, dateToFilter, sortOrder]);

  // Toggle expand
  const toggleExpand = useCallback((version: string) => {
    if (expandAll) {
      setExpandAll(false);
      setExpandedRelease(version);
    } else {
      setExpandedRelease((prev) => prev === version ? null : version);
    }
  }, [expandAll]);

  // Check if expanded
  const isExpanded = useCallback((version: string) => {
    return expandAll || expandedRelease === version;
  }, [expandAll, expandedRelease]);

  // Handle expand all
  const handleExpandAll = useCallback(() => {
    setExpandAll(!expandAll);
    if (!expandAll) {
      setExpandedRelease(null);
    }
  }, [expandAll]);

  // Acknowledge release
  const handleAcknowledge = useCallback(async (version: string) => {
    setAcknowledgingVersions((prev) => [...prev, version]);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setReleases((prev) =>
    prev.map((release) =>
    release.version === version ?
    {
      ...release,
      acknowledged: true,
      acknowledgedAt: new Date().toISOString(),
      acknowledgedBy: 'Current User'
    } :
    release
    )
    );

    setAcknowledgingVersions((prev) => prev.filter((v) => v !== version));
  }, []);

  // Bulk acknowledge
  const handleBulkAcknowledge = useCallback(async () => {
    const pendingSelected = selectedReleases.filter(
      (version) => !releases.find((r) => r.version === version)?.acknowledged
    );

    if (pendingSelected.length === 0) {
      alert('No pending releases selected to acknowledge');
      return;
    }

    setAcknowledgingVersions(pendingSelected);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setReleases((prev) =>
    prev.map((release) =>
    pendingSelected.includes(release.version) ?
    {
      ...release,
      acknowledged: true,
      acknowledgedAt: new Date().toISOString(),
      acknowledgedBy: 'Current User'
    } :
    release
    )
    );

    setAcknowledgingVersions([]);
    setSelectedReleases([]);
    alert(`Successfully acknowledged ${pendingSelected.length} release(s)`);
  }, [selectedReleases, releases]);

  // Toggle bookmark
  const handleToggleBookmark = useCallback((version: string) => {
    setReleases((prev) =>
    prev.map((release) =>
    release.version === version ?
    { ...release, isBookmarked: !release.isBookmarked } :
    release
    )
    );
  }, []);

  // Toggle notifications
  const handleToggleNotifications = useCallback((version: string) => {
    const release = releases.find((r) => r.version === version);
    const newState = !release?.notificationsEnabled;

    setReleases((prev) =>
    prev.map((r) =>
    r.version === version ?
    { ...r, notificationsEnabled: newState } :
    r
    )
    );

    alert(newState ?
    `Notifications enabled for v${version}. You will receive updates about this release.` :
    `Notifications disabled for v${version}.`
    );
  }, [releases]);

  // Download attachment
  const handleDownloadAttachment = useCallback(async (attachment: Attachment) => {
    setDownloadingAttachments((prev) => [...prev, attachment.id]);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate download
    console.log(`Downloading: ${attachment.name} from ${attachment.url}`);

    setDownloadingAttachments((prev) => prev.filter((id) => id !== attachment.id));

    if (attachment.type === 'video' || attachment.type === 'link') {
      window.open(attachment.url, '_blank');
    } else {
      alert(`Downloaded: ${attachment.name}`);
    }
  }, []);

  // Download all attachments
  const handleDownloadAllAttachments = useCallback(async (version: string) => {
    const release = releases.find((r) => r.version === version);
    if (!release || release.attachments.length === 0) return;

    const attachmentIds = release.attachments.map((a) => a.id);
    setDownloadingAttachments((prev) => [...prev, ...attachmentIds]);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setDownloadingAttachments((prev) => prev.filter((id) => !attachmentIds.includes(id)));
    alert(`Downloaded ${release.attachments.length} file(s) for v${version}`);
  }, [releases]);

  // Copy release info
  const handleCopyReleaseInfo = useCallback(async (release: Release) => {
    const info = `
Release Notes - v${release.version}
=====================================
Title: ${release.title}
Date: ${release.date}
Type: ${release.type}
Priority: ${release.priority.toUpperCase()}
Modules: ${release.modules.join(', ')}

Description:
${release.description}

Changes:
${release.changes.map((c) => `• [${c.category.toUpperCase()}] ${c.text}`).join('\n')}

Tags: ${release.tags.join(', ')}
Author: ${release.author}
    `.trim();

    try {
      await navigator.clipboard.writeText(info);
      setCopiedVersion(release.version);
      setTimeout(() => setCopiedVersion(null), 2500);
    } catch (err) {
      alert('Failed to copy to clipboard. Please try again.');
    }
  }, []);

  // Share release
  const handleShareRelease = useCallback(async (release: Release) => {
    const shareUrl = `${window.location.origin}/releases/${release.version}`;
    const shareData = {
      title: `Release Notes v${release.version} - ${release.title}`,
      text: release.description,
      url: shareUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          await navigator.clipboard.writeText(shareUrl);
          alert('Share link copied to clipboard!');
        }
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert(`Release URL copied to clipboard: ${shareUrl}`);
    }
  }, []);

  // Print release
  const handlePrintRelease = useCallback((release: Release) => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Release Notes v${release.version}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            h1 { color: #1a365d; border-bottom: 2px solid #3182ce; padding-bottom: 10px; }
            h2 { color: #2d3748; }
            .meta { background: #f7fafc; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .meta p { margin: 5px 0; }
            .section { margin: 25px 0; }
            .section-title { font-weight: bold; color: #4a5568; font-size: 14px; text-transform: uppercase; margin-bottom: 10px; }
            ul { margin: 0; padding-left: 20px; }
            li { margin-bottom: 8px; line-height: 1.5; }
            .tag { background: #edf2f7; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-right: 5px; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #718096; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <h1>Release Notes</h1>
          <h2>v${release.version} - ${release.title}</h2>
          
          <div class="meta">
            <p><strong>Release Date:</strong> ${release.date}</p>
            <p><strong>Type:</strong> ${release.type}</p>
            <p><strong>Priority:</strong> ${release.priority.toUpperCase()}</p>
            <p><strong>Modules:</strong> ${release.modules.join(', ')}</p>
            <p><strong>Author:</strong> ${release.author}</p>
          </div>
          
          <div class="section">
            <div class="section-title">Description</div>
            <p>${release.description}</p>
          </div>
          
          <div class="section">
            <div class="section-title">Change Log (${release.changes.length} items)</div>
            <ul>
              ${release.changes.map((c) => `<li><strong>[${c.category.toUpperCase()}]</strong> ${c.text}</li>`).join('')}
            </ul>
          </div>
          
          <div class="section">
            <div class="section-title">Tags</div>
            <p>${release.tags.map((t) => `<span class="tag">#${t}</span>`).join(' ')}</p>
          </div>
          
          ${release.acknowledged ? `
          <div class="section">
            <div class="section-title">Acknowledgment</div>
            <p>Acknowledged by ${release.acknowledgedBy} on ${new Date(release.acknowledgedAt!).toLocaleString()}</p>
          </div>
          ` : ''}
          
          <div class="footer">
            <p>Printed on ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  }, []);

  // Select release
  const handleSelectRelease = useCallback((version: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedReleases((prev) =>
    prev.includes(version) ?
    prev.filter((v) => v !== version) :
    [...prev, version]
    );
  }, []);

  // Select all visible
  const handleSelectAllVisible = useCallback(() => {
    const visibleVersions = filteredReleases.map((r) => r.version);
    const allSelected = visibleVersions.every((v) => selectedReleases.includes(v));

    if (allSelected) {
      setSelectedReleases((prev) => prev.filter((v) => !visibleVersions.includes(v)));
    } else {
      setSelectedReleases((prev) => [...new Set([...prev, ...visibleVersions])]);
    }
  }, [filteredReleases, selectedReleases]);

  // Clear filters
  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setVersionFilter('');
    setTypeFilter('');
    setModuleFilter('');
    setAcknowledgedFilter('');
    setPriorityFilter('');
    setDateFromFilter('');
    setDateToFilter('');
  }, []);

  // Check if any filter is active
  const hasActiveFilters = searchQuery || versionFilter || typeFilter || moduleFilter || acknowledgedFilter || priorityFilter || dateFromFilter || dateToFilter;

  // Refresh data
  const handleRefreshData = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setReleases(initialReleasesData);
    setIsRefreshing(false);
  }, []);

  // Navigate to related version
  const handleNavigateToVersion = useCallback((version: string) => {
    setSearchQuery('');
    handleClearFilters();
    setExpandedRelease(version);
    setExpandAll(false);

    // Scroll to release
    setTimeout(() => {
      const element = document.getElementById(`release-${version}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }, [handleClearFilters]);

  // Filter by tag
  const handleFilterByTag = useCallback((tag: string) => {
    setSearchQuery(tag);
  }, []);

  // Filter by module
  const handleFilterByModule = useCallback((module: string) => {
    setModuleFilter(module);
  }, []);

  // Get type badge
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'New Feature':
        return <Badge variant="success">New Feature</Badge>;
      case 'Bug Fix':
        return <Badge variant="danger">Bug Fix</Badge>;
      case 'Enhancement':
        return <Badge variant="info">Enhancement</Badge>;
      case 'Security':
        return <Badge variant="warning">Security</Badge>;
      case 'Breaking Change':
        return <Badge variant="danger">Breaking Change</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Badge variant="danger">Critical</Badge>;
      case 'high':
        return <Badge variant="warning">High</Badge>;
      case 'medium':
        return <Badge variant="info">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
      default:
        return null;
    }
  };

  // Get change category color
  const getChangeCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      added: 'bg-green-400',
      changed: 'bg-blue-400',
      fixed: 'bg-yellow-400',
      removed: 'bg-red-400',
      deprecated: 'bg-orange-400',
      security: 'bg-purple-400'
    };
    return colors[category] || 'bg-gray-400';
  };

  // Get attachment icon
  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileTextIcon className="w-4 h-4 text-red-500" />;
      case 'video':
        return <VideoIcon className="w-4 h-4 text-purple-500" />;
      case 'excel':
        return <FileIcon className="w-4 h-4 text-green-500" />;
      case 'doc':
        return <FileTextIcon className="w-4 h-4 text-blue-500" />;
      default:
        return <FileIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      total: releases.length,
      acknowledged: releases.filter((r) => r.acknowledged).length,
      pending: releases.filter((r) => !r.acknowledged).length,
      bookmarked: releases.filter((r) => r.isBookmarked).length,
      critical: releases.filter((r) => r.priority === 'critical').length
    };
  }, [releases]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Release Notes</h1>
          <p className="text-sm text-gray-500">
            View software release details and change logs
          </p>
          <div className="flex gap-4 mt-2 text-xs text-gray-500">
            <span>Total: {stats.total}</span>
            <span>Acknowledged: {stats.acknowledged}</span>
            <span>Pending: {stats.pending}</span>
            <span>Bookmarked: {stats.bookmarked}</span>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshData}
            disabled={isRefreshing}
            leftIcon={<RefreshCwIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />}>

            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExpandAll}
            leftIcon={expandAll ? <MinimizeIcon className="w-4 h-4" /> : <ExpandIcon className="w-4 h-4" />}>

            {expandAll ? 'Collapse All' : 'Expand All'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            leftIcon={<FilterIcon className="w-4 h-4" />}>

            {showFilters ? 'Hide Filters' : 'Filters'}
          </Button>
        </div>
      </div>

      {/* Search and Quick Filters */}
      <div className="flex gap-3 items-center flex-wrap">
        <div className="relative flex-1 min-w-64">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search releases, changes, tags, modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />

          {searchQuery &&
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:bg-gray-100 rounded p-1">

              <XIcon className="w-4 h-4 text-gray-400" />
            </button>
          }
        </div>
        <Select
          value={versionFilter}
          onChange={(e) => setVersionFilter(e.target.value)}
          options={[
          { value: '', label: 'All Versions' },
          { value: '3', label: 'v3.x' },
          { value: '2', label: 'v2.x' }]
          }
          className="w-32" />

        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          options={[
          { value: '', label: 'All Types' },
          { value: 'New Feature', label: 'New Feature' },
          { value: 'Bug Fix', label: 'Bug Fix' },
          { value: 'Enhancement', label: 'Enhancement' },
          { value: 'Security', label: 'Security' },
          { value: 'Breaking Change', label: 'Breaking Change' }]
          }
          className="w-40" />

        <Select
          value={acknowledgedFilter}
          onChange={(e) => setAcknowledgedFilter(e.target.value)}
          options={[
          { value: '', label: 'All Status' },
          { value: 'acknowledged', label: 'Acknowledged' },
          { value: 'pending', label: 'Pending' }]
          }
          className="w-36" />

        <Select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
          options={[
          { value: 'newest', label: 'Newest First' },
          { value: 'oldest', label: 'Oldest First' }]
          }
          className="w-36" />

      </div>

      {/* Advanced Filters Panel */}
      {showFilters &&
      <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
              <Select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              options={[
              { value: '', label: 'All Modules' },
              ...allModules.map((mod) => ({ value: mod, label: mod }))]
              }
              className="w-full" />

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              options={[
              { value: '', label: 'All Priorities' },
              { value: 'critical', label: 'Critical' },
              { value: 'high', label: 'High' },
              { value: 'medium', label: 'Medium' },
              { value: 'low', label: 'Low' }]
              }
              className="w-full" />

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
              type="date"
              value={dateFromFilter}
              onChange={(e) => setDateFromFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
              type="date"
              value={dateToFilter}
              onChange={(e) => setDateToFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />

            </div>
            <div className="flex items-end">
              <Button
              variant="outline"
              onClick={handleClearFilters}
              className="w-full"
              disabled={!hasActiveFilters}>

                Clear All Filters
              </Button>
            </div>
          </div>
        </Card>
      }

      {/* Active Filters Display */}
      {hasActiveFilters &&
      <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-500">Active filters:</span>
          {searchQuery &&
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Search: {searchQuery}
              <button onClick={() => setSearchQuery('')}><XIcon className="w-3 h-3" /></button>
            </span>
        }
          {versionFilter &&
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Version: v{versionFilter}.x
              <button onClick={() => setVersionFilter('')}><XIcon className="w-3 h-3" /></button>
            </span>
        }
          {typeFilter &&
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Type: {typeFilter}
              <button onClick={() => setTypeFilter('')}><XIcon className="w-3 h-3" /></button>
            </span>
        }
          {moduleFilter &&
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Module: {moduleFilter}
              <button onClick={() => setModuleFilter('')}><XIcon className="w-3 h-3" /></button>
            </span>
        }
          {acknowledgedFilter &&
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Status: {acknowledgedFilter}
              <button onClick={() => setAcknowledgedFilter('')}><XIcon className="w-3 h-3" /></button>
            </span>
        }
          {priorityFilter &&
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Priority: {priorityFilter}
              <button onClick={() => setPriorityFilter('')}><XIcon className="w-3 h-3" /></button>
            </span>
        }
        </div>
      }

      {/* Bulk Actions Bar */}
      {selectedReleases.length > 0 &&
      <Card className="p-3 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <CheckIcon className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                {selectedReleases.length} release(s) selected
              </span>
            </div>
            <div className="flex gap-2">
              <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedReleases([])}>

                Clear Selection
              </Button>
              <Button
              size="sm"
              onClick={handleBulkAcknowledge}
              disabled={acknowledgingVersions.length > 0}>

                {acknowledgingVersions.length > 0 ? 'Processing...' : 'Acknowledge Selected'}
              </Button>
            </div>
          </div>
        </Card>
      }

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {filteredReleases.length} of {releases.length} releases
          {filteredReleases.length !== releases.length && ' (filtered)'}
        </p>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filteredReleases.length > 0 && filteredReleases.every((r) => selectedReleases.includes(r.version))}
              onChange={handleSelectAllVisible}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

            <span className="text-sm text-gray-600">Select All Visible</span>
          </label>
        </div>
      </div>

      {/* Release Cards */}
      <div className="space-y-4">
        {filteredReleases.length === 0 ?
        <Card className="p-12 text-center">
            <InfoIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No releases found</p>
            <p className="text-gray-400 text-sm mb-4">Try adjusting your search or filter criteria</p>
            <Button variant="outline" onClick={handleClearFilters}>
              Clear All Filters
            </Button>
          </Card> :

        filteredReleases.map((release) =>
        <Card
          key={release.version}
          id={`release-${release.version}`}
          noPadding
          className="overflow-hidden">

              {/* Release Header */}
              <div
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleExpand(release.version)}>

                <div className="flex items-center gap-4">
                  <input
                type="checkbox"
                checked={selectedReleases.includes(release.version)}
                onChange={() => {}}
                onClick={(e) => handleSelectRelease(release.version, e)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

                  <div className="flex flex-col items-center justify-center w-16 h-16 bg-blue-50 rounded-lg text-blue-700 font-bold border border-blue-100">
                    <span className="text-xs text-blue-500">v</span>
                    <span className="text-lg">{release.version}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {release.title}
                      </h3>
                      {release.isBookmarked &&
                  <BookmarkIcon className="w-4 h-4 text-yellow-500 fill-current" />
                  }
                      {release.priority === 'critical' &&
                  <AlertTriangleIcon className="w-4 h-4 text-red-500" />
                  }
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-sm text-gray-500">{release.date}</span>
                      <span className="text-gray-300">•</span>
                      {getTypeBadge(release.type)}
                      <span className="text-gray-300">•</span>
                      {getPriorityBadge(release.priority)}
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-400">
                        {release.changes.length} changes
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {release.acknowledged ?
              <div className="flex flex-col items-end">
                      <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        <CheckCircleIcon className="w-3 h-3" /> Acknowledged
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        {release.acknowledgedBy}
                      </span>
                    </div> :

              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAcknowledge(release.version);
                }}
                disabled={acknowledgingVersions.includes(release.version)}>

                      {acknowledgingVersions.includes(release.version) ?
                <>
                          <RefreshCwIcon className="w-3 h-3 animate-spin mr-1" />
                          Processing...
                        </> :

                'Acknowledge'
                }
                    </Button>
              }
                  {isExpanded(release.version) ?
              <ChevronUpIcon className="w-5 h-5 text-gray-400" /> :

              <ChevronDownIcon className="w-5 h-5 text-gray-400" />
              }
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded(release.version) &&
          <div className="px-4 pb-6 pt-2 border-t border-gray-100 bg-gray-50/30">
                  <div className="ml-20">
                    {/* Description */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">{release.description}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mb-4 flex-wrap">
                      <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleBookmark(release.version)}
                  leftIcon={
                  <BookmarkIcon
                    className={`w-4 h-4 ${release.isBookmarked ? 'fill-current text-yellow-500' : ''}`} />

                  }>

                        {release.isBookmarked ? 'Bookmarked' : 'Bookmark'}
                      </Button>
                      <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleNotifications(release.version)}
                  leftIcon={
                  <BellIcon
                    className={`w-4 h-4 ${release.notificationsEnabled ? 'fill-current text-blue-500' : ''}`} />

                  }>

                        {release.notificationsEnabled ? 'Notifications On' : 'Enable Notifications'}
                      </Button>
                      <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyReleaseInfo(release)}
                  leftIcon={<ClipboardIcon className="w-4 h-4" />}>

                        {copiedVersion === release.version ? 'Copied!' : 'Copy Details'}
                      </Button>
                      <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShareRelease(release)}
                  leftIcon={<ShareIcon className="w-4 h-4" />}>

                        Share
                      </Button>
                      <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePrintRelease(release)}
                  leftIcon={<PrinterIcon className="w-4 h-4" />}>

                        Print
                      </Button>
                    </div>

                    {/* Modules Affected */}
                    <div className="mb-4">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Modules Affected
                      </span>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {release.modules.map((mod) =>
                  <button
                    key={mod}
                    onClick={() => handleFilterByModule(mod)}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded border border-gray-200 hover:bg-gray-200 transition-colors">

                            {mod}
                          </button>
                  )}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="mb-4">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Tags
                      </span>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {release.tags.map((tag) =>
                  <button
                    key={tag}
                    onClick={() => handleFilterByTag(tag)}
                    className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition-colors">

                            #{tag}
                          </button>
                  )}
                      </div>
                    </div>

                    {/* Change Log */}
                    <div className="mb-4">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Change Log ({release.changes.length} items)
                      </span>
                      <div className="mt-2 mb-3 flex gap-4 text-xs flex-wrap">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-green-400"></span> Added
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-blue-400"></span> Changed
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-yellow-400"></span> Fixed
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-red-400"></span> Removed
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-orange-400"></span> Deprecated
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-purple-400"></span> Security
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {release.changes.map((change) =>
                  <li
                    key={change.id}
                    className="text-sm text-gray-700 flex items-start gap-2">

                            <span
                      className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${getChangeCategoryColor(change.category)}`} />

                            <span>{change.text}</span>
                          </li>
                  )}
                      </ul>
                    </div>

                    {/* Related Versions */}
                    {release.relatedVersions.length > 0 &&
              <div className="mb-4">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Related Versions
                        </span>
                        <div className="flex gap-2 mt-1 flex-wrap">
                          {release.relatedVersions.map((version) =>
                  <button
                    key={version}
                    onClick={() => handleNavigateToVersion(version)}
                    className="text-xs bg-gray-100 text-blue-600 px-2 py-1 rounded hover:bg-gray-200 transition-colors flex items-center gap-1">

                              <ExternalLinkIcon className="w-3 h-3" />
                              v{version}
                            </button>
                  )}
                        </div>
                      </div>
              }

                    {/* Attachments */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Attachments ({release.attachments.length})
                        </span>
                        {release.attachments.length > 1 &&
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownloadAllAttachments(release.version)}
                    leftIcon={<DownloadIcon className="w-3 h-3" />}
                    disabled={release.attachments.some((a) => downloadingAttachments.includes(a.id))}>

                            Download All
                          </Button>
                  }
                      </div>
                      <div className="space-y-2">
                        {release.attachments.map((attachment) =>
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">

                            <div className="flex items-center gap-3">
                              {getAttachmentIcon(attachment.type)}
                              <div>
                                <span className="text-sm font-medium text-gray-700">{attachment.name}</span>
                                <div className="flex items-center gap-2 mt-0.5">
                                  {attachment.size &&
                          <span className="text-xs text-gray-400">{attachment.size}</span>
                          }
                                  <Badge variant="secondary" className="text-xs">
                                    {attachment.type.toUpperCase()}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadAttachment(attachment)}
                      disabled={downloadingAttachments.includes(attachment.id)}
                      leftIcon={
                      downloadingAttachments.includes(attachment.id) ?
                      <RefreshCwIcon className="w-3 h-3 animate-spin" /> :
                      attachment.type === 'video' || attachment.type === 'link' ?
                      <ExternalLinkIcon className="w-3 h-3" /> :

                      <DownloadIcon className="w-3 h-3" />

                      }>

                              {downloadingAttachments.includes(attachment.id) ?
                      'Loading...' :
                      attachment.type === 'video' || attachment.type === 'link' ?
                      'Open' :
                      'Download'}
                            </Button>
                          </div>
                  )}
                      </div>
                    </div>

                    {/* Meta Information */}
                    <div className="pt-4 border-t border-gray-200 space-y-1">
                      <p className="text-xs text-gray-400">
                        Released by: {release.author}
                      </p>
                      {release.acknowledged && release.acknowledgedAt &&
                <p className="text-xs text-gray-400">
                          Acknowledged by {release.acknowledgedBy} on{' '}
                          {new Date(release.acknowledgedAt).toLocaleString()}
                        </p>
                }
                    </div>
                  </div>
                </div>
          }
            </Card>
        )
        }
      </div>
    </div>);

}