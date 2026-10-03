// File: RatingDistributionNormalisation.tsx

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  BarChart3,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  Users,
  Target,
  Sliders,
  X,
  Save,
  RotateCcw,
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus,
  Settings,
  Eye,
  History,
  Wand2,
  Lock,
  Unlock,
  ArrowRight,
  FileSpreadsheet,
  Printer,
  Copy,
  Check,
  AlertCircle } from
'lucide-react';

interface GradeBucket {
  grade: string;
  label: string;
  color: string;
  bgColor: string;
  barColor: string;
  targetPct: number;
  actualCount: number;
  actualPct: number;
  isLocked: boolean;
}

interface DepartmentData {
  name: string;
  totalEmployees: number;
  buckets: GradeBucket[];
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface HistoryEntry {
  id: string;
  timestamp: Date;
  action: string;
  details: string;
  buckets: GradeBucket[];
}

interface NormalisationSuggestion {
  grade: string;
  currentCount: number;
  suggestedCount: number;
  difference: number;
  employeesToMove: number;
}

const createInitialBuckets = (): GradeBucket[] => [
{
  grade: 'A+',
  label: 'Outstanding',
  color: 'text-emerald-700',
  bgColor: 'bg-emerald-100',
  barColor: 'bg-emerald-500',
  targetPct: 5,
  actualCount: 15,
  actualPct: 6.1,
  isLocked: false
},
{
  grade: 'A',
  label: 'Excellent',
  color: 'text-green-700',
  bgColor: 'bg-green-100',
  barColor: 'bg-green-500',
  targetPct: 20,
  actualCount: 55,
  actualPct: 22.4,
  isLocked: false
},
{
  grade: 'B+',
  label: 'Very Good',
  color: 'text-blue-700',
  bgColor: 'bg-blue-100',
  barColor: 'bg-blue-500',
  targetPct: 30,
  actualCount: 70,
  actualPct: 28.6,
  isLocked: false
},
{
  grade: 'B',
  label: 'Good',
  color: 'text-indigo-700',
  bgColor: 'bg-indigo-100',
  barColor: 'bg-indigo-500',
  targetPct: 25,
  actualCount: 62,
  actualPct: 25.3,
  isLocked: false
},
{
  grade: 'C',
  label: 'Average',
  color: 'text-amber-700',
  bgColor: 'bg-amber-100',
  barColor: 'bg-amber-500',
  targetPct: 15,
  actualCount: 33,
  actualPct: 13.5,
  isLocked: false
},
{
  grade: 'D',
  label: 'Below Average',
  color: 'text-red-700',
  bgColor: 'bg-red-100',
  barColor: 'bg-red-500',
  targetPct: 5,
  actualCount: 10,
  actualPct: 4.1,
  isLocked: false
}];


const departmentDatasets: Record<string, DepartmentData> = {
  '': {
    name: 'All Departments',
    totalEmployees: 245,
    buckets: createInitialBuckets()
  },
  'Mathematics': {
    name: 'Mathematics',
    totalEmployees: 45,
    buckets: [
    { grade: 'A+', label: 'Outstanding', color: 'text-emerald-700', bgColor: 'bg-emerald-100', barColor: 'bg-emerald-500', targetPct: 5, actualCount: 3, actualPct: 6.7, isLocked: false },
    { grade: 'A', label: 'Excellent', color: 'text-green-700', bgColor: 'bg-green-100', barColor: 'bg-green-500', targetPct: 20, actualCount: 10, actualPct: 22.2, isLocked: false },
    { grade: 'B+', label: 'Very Good', color: 'text-blue-700', bgColor: 'bg-blue-100', barColor: 'bg-blue-500', targetPct: 30, actualCount: 12, actualPct: 26.7, isLocked: false },
    { grade: 'B', label: 'Good', color: 'text-indigo-700', bgColor: 'bg-indigo-100', barColor: 'bg-indigo-500', targetPct: 25, actualCount: 12, actualPct: 26.7, isLocked: false },
    { grade: 'C', label: 'Average', color: 'text-amber-700', bgColor: 'bg-amber-100', barColor: 'bg-amber-500', targetPct: 15, actualCount: 6, actualPct: 13.3, isLocked: false },
    { grade: 'D', label: 'Below Average', color: 'text-red-700', bgColor: 'bg-red-100', barColor: 'bg-red-500', targetPct: 5, actualCount: 2, actualPct: 4.4, isLocked: false }]

  },
  'Science': {
    name: 'Science',
    totalEmployees: 60,
    buckets: [
    { grade: 'A+', label: 'Outstanding', color: 'text-emerald-700', bgColor: 'bg-emerald-100', barColor: 'bg-emerald-500', targetPct: 5, actualCount: 5, actualPct: 8.3, isLocked: false },
    { grade: 'A', label: 'Excellent', color: 'text-green-700', bgColor: 'bg-green-100', barColor: 'bg-green-500', targetPct: 20, actualCount: 15, actualPct: 25.0, isLocked: false },
    { grade: 'B+', label: 'Very Good', color: 'text-blue-700', bgColor: 'bg-blue-100', barColor: 'bg-blue-500', targetPct: 30, actualCount: 16, actualPct: 26.7, isLocked: false },
    { grade: 'B', label: 'Good', color: 'text-indigo-700', bgColor: 'bg-indigo-100', barColor: 'bg-indigo-500', targetPct: 25, actualCount: 14, actualPct: 23.3, isLocked: false },
    { grade: 'C', label: 'Average', color: 'text-amber-700', bgColor: 'bg-amber-100', barColor: 'bg-amber-500', targetPct: 15, actualCount: 8, actualPct: 13.3, isLocked: false },
    { grade: 'D', label: 'Below Average', color: 'text-red-700', bgColor: 'bg-red-100', barColor: 'bg-red-500', targetPct: 5, actualCount: 2, actualPct: 3.3, isLocked: false }]

  },
  'English': {
    name: 'English',
    totalEmployees: 50,
    buckets: [
    { grade: 'A+', label: 'Outstanding', color: 'text-emerald-700', bgColor: 'bg-emerald-100', barColor: 'bg-emerald-500', targetPct: 5, actualCount: 2, actualPct: 4.0, isLocked: false },
    { grade: 'A', label: 'Excellent', color: 'text-green-700', bgColor: 'bg-green-100', barColor: 'bg-green-500', targetPct: 20, actualCount: 8, actualPct: 16.0, isLocked: false },
    { grade: 'B+', label: 'Very Good', color: 'text-blue-700', bgColor: 'bg-blue-100', barColor: 'bg-blue-500', targetPct: 30, actualCount: 18, actualPct: 36.0, isLocked: false },
    { grade: 'B', label: 'Good', color: 'text-indigo-700', bgColor: 'bg-indigo-100', barColor: 'bg-indigo-500', targetPct: 25, actualCount: 12, actualPct: 24.0, isLocked: false },
    { grade: 'C', label: 'Average', color: 'text-amber-700', bgColor: 'bg-amber-100', barColor: 'bg-amber-500', targetPct: 15, actualCount: 7, actualPct: 14.0, isLocked: false },
    { grade: 'D', label: 'Below Average', color: 'text-red-700', bgColor: 'bg-red-100', barColor: 'bg-red-500', targetPct: 5, actualCount: 3, actualPct: 6.0, isLocked: false }]

  },
  'Administration': {
    name: 'Administration',
    totalEmployees: 40,
    buckets: [
    { grade: 'A+', label: 'Outstanding', color: 'text-emerald-700', bgColor: 'bg-emerald-100', barColor: 'bg-emerald-500', targetPct: 5, actualCount: 2, actualPct: 5.0, isLocked: false },
    { grade: 'A', label: 'Excellent', color: 'text-green-700', bgColor: 'bg-green-100', barColor: 'bg-green-500', targetPct: 20, actualCount: 10, actualPct: 25.0, isLocked: false },
    { grade: 'B+', label: 'Very Good', color: 'text-blue-700', bgColor: 'bg-blue-100', barColor: 'bg-blue-500', targetPct: 30, actualCount: 10, actualPct: 25.0, isLocked: false },
    { grade: 'B', label: 'Good', color: 'text-indigo-700', bgColor: 'bg-indigo-100', barColor: 'bg-indigo-500', targetPct: 25, actualCount: 10, actualPct: 25.0, isLocked: false },
    { grade: 'C', label: 'Average', color: 'text-amber-700', bgColor: 'bg-amber-100', barColor: 'bg-amber-500', targetPct: 15, actualCount: 6, actualPct: 15.0, isLocked: false },
    { grade: 'D', label: 'Below Average', color: 'text-red-700', bgColor: 'bg-red-100', barColor: 'bg-red-500', targetPct: 5, actualCount: 2, actualPct: 5.0, isLocked: false }]

  },
  'Support Staff': {
    name: 'Support Staff',
    totalEmployees: 50,
    buckets: [
    { grade: 'A+', label: 'Outstanding', color: 'text-emerald-700', bgColor: 'bg-emerald-100', barColor: 'bg-emerald-500', targetPct: 5, actualCount: 3, actualPct: 6.0, isLocked: false },
    { grade: 'A', label: 'Excellent', color: 'text-green-700', bgColor: 'bg-green-100', barColor: 'bg-green-500', targetPct: 20, actualCount: 12, actualPct: 24.0, isLocked: false },
    { grade: 'B+', label: 'Very Good', color: 'text-blue-700', bgColor: 'bg-blue-100', barColor: 'bg-blue-500', targetPct: 30, actualCount: 14, actualPct: 28.0, isLocked: false },
    { grade: 'B', label: 'Good', color: 'text-indigo-700', bgColor: 'bg-indigo-100', barColor: 'bg-indigo-500', targetPct: 25, actualCount: 14, actualPct: 28.0, isLocked: false },
    { grade: 'C', label: 'Average', color: 'text-amber-700', bgColor: 'bg-amber-100', barColor: 'bg-amber-500', targetPct: 15, actualCount: 6, actualPct: 12.0, isLocked: false },
    { grade: 'D', label: 'Below Average', color: 'text-red-700', bgColor: 'bg-red-100', barColor: 'bg-red-500', targetPct: 5, actualCount: 1, actualPct: 2.0, isLocked: false }]

  }
};

const reviewPeriods = [
{ value: 'annual-2024', label: 'Annual Review 2024-25' },
{ value: 'annual-2023', label: 'Annual Review 2023-24' },
{ value: 'mid-2024', label: 'Mid-Year Review 2024' },
{ value: 'quarterly-q3-2024', label: 'Q3 2024 Review' }];


export function RatingDistributionNormalisation() {
  // Core state
  const [buckets, setBuckets] = useState<GradeBucket[]>(createInitialBuckets());
  const [deptFilter, setDeptFilter] = useState('');
  const [reviewPeriod, setReviewPeriod] = useState('annual-2024');
  const [totalEmployees, setTotalEmployees] = useState(245);

  // Interactive states
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isApplyingNormalisation, setIsApplyingNormalisation] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showNormalisationModal, setShowNormalisationModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [originalBuckets, setOriginalBuckets] = useState<GradeBucket[]>(createInitialBuckets());
  const [normalisationSuggestions, setNormalisationSuggestions] = useState<NormalisationSuggestion[]>([]);
  const [previewBuckets, setPreviewBuckets] = useState<GradeBucket[]>([]);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  // Computed values
  const maxPct = useMemo(() => {
    return Math.max(...buckets.map((b) => Math.max(b.targetPct, b.actualPct)));
  }, [buckets]);

  const totalTarget = useMemo(() => {
    return buckets.reduce((s, b) => s + b.targetPct, 0);
  }, [buckets]);

  const totalActual = useMemo(() => {
    return buckets.reduce((s, b) => s + b.actualCount, 0);
  }, [buckets]);

  const deviations = useMemo(() => {
    return buckets.filter((b) => Math.abs(b.actualPct - b.targetPct) > 3);
  }, [buckets]);

  const isValidDistribution = useMemo(() => {
    return totalTarget === 100;
  }, [totalTarget]);

  const hasChanges = useMemo(() => {
    return buckets.some((b, i) => b.targetPct !== originalBuckets[i]?.targetPct);
  }, [buckets, originalBuckets]);

  const normalisationScore = useMemo(() => {
    // Calculate how well the actual distribution matches the target
    const totalDeviation = buckets.reduce((sum, b) => {
      return sum + Math.abs(b.actualPct - b.targetPct);
    }, 0);
    // Score from 0-100, where 100 is perfect match
    return Math.max(0, Math.round(100 - totalDeviation));
  }, [buckets]);

  // Toast management
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((prev) => prev.slice(1));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Mark as dirty when buckets change
  useEffect(() => {
    if (hasChanges) {
      setIsDirty(true);
    }
  }, [hasChanges]);

  // Add to history
  const addToHistory = useCallback((action: string, details: string) => {
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      action,
      details,
      buckets: JSON.parse(JSON.stringify(buckets))
    };
    setHistory((prev) => [entry, ...prev].slice(0, 50)); // Keep last 50 entries
  }, [buckets]);

  // Target adjustment
  const setTarget = useCallback((grade: string, val: number) => {
    const bucket = buckets.find((b) => b.grade === grade);
    if (bucket?.isLocked) {
      showToast(`Grade ${grade} is locked. Unlock it to make changes.`, 'warning');
      return;
    }

    const clampedVal = Math.max(0, Math.min(100, val));
    setBuckets((prev) =>
    prev.map((b) =>
    b.grade === grade ?
    { ...b, targetPct: clampedVal } :
    b
    )
    );
  }, [buckets, showToast]);

  // Lock/unlock bucket
  const toggleLock = useCallback((grade: string) => {
    setBuckets((prev) =>
    prev.map((b) =>
    b.grade === grade ?
    { ...b, isLocked: !b.isLocked } :
    b
    )
    );
    const bucket = buckets.find((b) => b.grade === grade);
    showToast(
      `Grade ${grade} ${bucket?.isLocked ? 'unlocked' : 'locked'}`,
      'info'
    );
  }, [buckets, showToast]);

  // Department filter change
  const handleDeptFilterChange = useCallback((dept: string) => {
    setDeptFilter(dept);
    const deptData = departmentDatasets[dept];
    if (deptData) {
      setBuckets(JSON.parse(JSON.stringify(deptData.buckets)));
      setOriginalBuckets(JSON.parse(JSON.stringify(deptData.buckets)));
      setTotalEmployees(deptData.totalEmployees);
      setIsDirty(false);
      showToast(`Loaded data for ${deptData.name}`, 'info');
    }
  }, [showToast]);

  // Review period change
  const handleReviewPeriodChange = useCallback((period: string) => {
    setReviewPeriod(period);
    // Simulate loading different data for different periods
    const periodLabel = reviewPeriods.find((p) => p.value === period)?.label;
    showToast(`Switched to ${periodLabel}`, 'info');

    // Reset to default data (in real app, would fetch from API)
    handleDeptFilterChange(deptFilter);
  }, [deptFilter, handleDeptFilterChange, showToast]);

  // Export function
  const exportData = useCallback(async (format: 'csv' | 'json' | 'print') => {
    setIsExporting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      if (format === 'csv') {
        const headers = ['Grade', 'Label', 'Target %', 'Actual Count', 'Actual %', 'Deviation'];
        const rows = buckets.map((b) => [
        b.grade,
        b.label,
        b.targetPct,
        b.actualCount,
        b.actualPct,
        (b.actualPct - b.targetPct).toFixed(1)]
        );

        const csvContent = [
        `Rating Distribution Report - ${reviewPeriods.find((p) => p.value === reviewPeriod)?.label}`,
        `Department: ${deptFilter || 'All Departments'}`,
        `Total Employees: ${totalEmployees}`,
        `Generated: ${new Date().toLocaleString()}`,
        '',
        headers.join(','),
        ...rows.map((row) => row.join(',')),
        '',
        `Normalisation Score: ${normalisationScore}%`,
        `Deviations > 3%: ${deviations.length}`].
        join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `rating_distribution_${deptFilter || 'all'}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        showToast('Data exported to CSV', 'success');
      } else if (format === 'json') {
        const jsonData = {
          reportTitle: 'Rating Distribution Report',
          reviewPeriod: reviewPeriods.find((p) => p.value === reviewPeriod)?.label,
          department: deptFilter || 'All Departments',
          totalEmployees,
          generatedAt: new Date().toISOString(),
          normalisationScore,
          buckets: buckets.map((b) => ({
            grade: b.grade,
            label: b.label,
            targetPct: b.targetPct,
            actualCount: b.actualCount,
            actualPct: b.actualPct,
            deviation: b.actualPct - b.targetPct
          }))
        };

        const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `rating_distribution_${deptFilter || 'all'}_${new Date().toISOString().split('T')[0]}.json`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        showToast('Data exported to JSON', 'success');
      } else if (format === 'print') {
        const printContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Rating Distribution Report</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { text-align: center; }
              .subtitle { text-align: center; color: #666; margin-bottom: 30px; }
              .summary { display: flex; justify-content: space-around; margin-bottom: 30px; padding: 15px; background: #f5f5f5; }
              .summary-item { text-align: center; }
              .summary-value { font-size: 24px; font-weight: bold; }
              .summary-label { font-size: 12px; color: #666; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 10px; text-align: center; }
              th { background-color: #f2f2f2; font-weight: bold; }
              .deviation-positive { color: #dc2626; }
              .deviation-negative { color: #16a34a; }
              .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <h1>Rating Distribution Report</h1>
            <p class="subtitle">${reviewPeriods.find((p) => p.value === reviewPeriod)?.label} | ${deptFilter || 'All Departments'}</p>
            
            <div class="summary">
              <div class="summary-item">
                <div class="summary-value">${totalEmployees}</div>
                <div class="summary-label">Total Employees</div>
              </div>
              <div class="summary-item">
                <div class="summary-value">${normalisationScore}%</div>
                <div class="summary-label">Normalisation Score</div>
              </div>
              <div class="summary-item">
                <div class="summary-value">${deviations.length}</div>
                <div class="summary-label">Deviations > 3%</div>
              </div>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Grade</th>
                  <th>Label</th>
                  <th>Target %</th>
                  <th>Actual Count</th>
                  <th>Actual %</th>
                  <th>Deviation</th>
                </tr>
              </thead>
              <tbody>
                ${buckets.map((b) => {
          const deviation = b.actualPct - b.targetPct;
          const deviationClass = deviation > 0 ? 'deviation-positive' : deviation < 0 ? 'deviation-negative' : '';
          return `
                    <tr>
                      <td><strong>${b.grade}</strong></td>
                      <td>${b.label}</td>
                      <td>${b.targetPct}%</td>
                      <td>${b.actualCount}</td>
                      <td>${b.actualPct}%</td>
                      <td class="${deviationClass}">${deviation > 0 ? '+' : ''}${deviation.toFixed(1)}%</td>
                    </tr>
                  `;
        }).join('')}
              </tbody>
            </table>
            
            <div class="footer">
              <p>Generated on ${new Date().toLocaleString()}</p>
            </div>
          </body>
          </html>
        `;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(printContent);
          printWindow.document.close();
          printWindow.focus();
          setTimeout(() => {
            printWindow.print();
            printWindow.close();
          }, 500);
          showToast('Print dialog opened', 'success');
        } else {
          showToast('Pop-up blocked. Please allow pop-ups.', 'error');
        }
      }
    } catch (error) {
      showToast('Export failed', 'error');
    }

    setIsExporting(false);
  }, [buckets, totalEmployees, normalisationScore, deviations, deptFilter, reviewPeriod, showToast]);

  // Recalculate function
  const recalculate = useCallback(async () => {
    setIsRecalculating(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      // Simulate recalculation - in real app would fetch fresh data
      const deptData = departmentDatasets[deptFilter];
      if (deptData) {
        // Add some random variation to simulate recalculation
        const newBuckets = deptData.buckets.map((b) => ({
          ...b,
          actualCount: Math.max(0, b.actualCount + Math.floor(Math.random() * 5) - 2)
        })).map((b) => ({
          ...b,
          actualPct: parseFloat((b.actualCount / deptData.totalEmployees * 100).toFixed(1))
        }));

        setBuckets(newBuckets);
        addToHistory('Recalculate', `Recalculated distribution for ${deptData.name}`);
        showToast('Distribution recalculated with latest data', 'success');
      }
    } catch (error) {
      showToast('Recalculation failed', 'error');
    }

    setIsRecalculating(false);
  }, [deptFilter, addToHistory, showToast]);

  // Save targets function
  const saveTargets = useCallback(async () => {
    if (!isValidDistribution) {
      showToast('Cannot save: Total target must equal 100%', 'error');
      return;
    }

    setIsSaving(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      // Simulate saving to backend
      localStorage.setItem(
        `ratingTargets_${deptFilter || 'all'}_${reviewPeriod}`,
        JSON.stringify(buckets)
      );

      setOriginalBuckets(JSON.parse(JSON.stringify(buckets)));
      setLastSavedAt(new Date());
      setIsDirty(false);
      addToHistory('Save Targets', `Saved target distribution for ${deptFilter || 'All Departments'}`);
      showToast('Target distribution saved successfully', 'success');
    } catch (error) {
      showToast('Failed to save targets', 'error');
    }

    setIsSaving(false);
  }, [buckets, isValidDistribution, deptFilter, reviewPeriod, addToHistory, showToast]);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    const defaultBuckets = createInitialBuckets();
    setBuckets(defaultBuckets);
    addToHistory('Reset', 'Reset to default target distribution');
    showToast('Reset to default distribution', 'info');
  }, [addToHistory, showToast]);

  // Reset to original (before changes)
  const resetToOriginal = useCallback(() => {
    setBuckets(JSON.parse(JSON.stringify(originalBuckets)));
    setIsDirty(false);
    showToast('Reverted to last saved state', 'info');
  }, [originalBuckets, showToast]);

  // Auto-balance targets to 100%
  const autoBalance = useCallback(() => {
    const lockedTotal = buckets.
    filter((b) => b.isLocked).
    reduce((sum, b) => sum + b.targetPct, 0);

    const unlockedBuckets = buckets.filter((b) => !b.isLocked);

    if (unlockedBuckets.length === 0) {
      showToast('All grades are locked. Unlock at least one to auto-balance.', 'warning');
      return;
    }

    const remainingPct = 100 - lockedTotal;
    const perBucket = Math.floor(remainingPct / unlockedBuckets.length);
    let remainder = remainingPct - perBucket * unlockedBuckets.length;

    const newBuckets = buckets.map((b) => {
      if (b.isLocked) return b;
      let newTarget = perBucket;
      if (remainder > 0) {
        newTarget += 1;
        remainder -= 1;
      }
      return { ...b, targetPct: newTarget };
    });

    setBuckets(newBuckets);
    addToHistory('Auto-Balance', 'Automatically balanced target distribution to 100%');
    showToast('Targets auto-balanced to 100%', 'success');
  }, [buckets, addToHistory, showToast]);

  // Generate normalisation suggestions
  const generateNormalisationSuggestions = useCallback(() => {
    const suggestions: NormalisationSuggestion[] = buckets.map((b) => {
      const targetCount = Math.round(b.targetPct / 100 * totalEmployees);
      const difference = b.actualCount - targetCount;
      return {
        grade: b.grade,
        currentCount: b.actualCount,
        suggestedCount: targetCount,
        difference,
        employeesToMove: Math.abs(difference)
      };
    }).filter((s) => s.difference !== 0);

    setNormalisationSuggestions(suggestions);
    setShowNormalisationModal(true);
  }, [buckets, totalEmployees]);

  // Apply normalisation
  const applyNormalisation = useCallback(async () => {
    setIsApplyingNormalisation(true);
    setShowNormalisationModal(false);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      // Simulate applying normalisation
      const newBuckets = buckets.map((b) => {
        const targetCount = Math.round(b.targetPct / 100 * totalEmployees);
        return {
          ...b,
          actualCount: targetCount,
          actualPct: parseFloat((targetCount / totalEmployees * 100).toFixed(1))
        };
      });

      setBuckets(newBuckets);
      addToHistory('Apply Normalisation', `Applied normalisation to match target distribution`);
      showToast('Normalisation applied successfully', 'success');
    } catch (error) {
      showToast('Failed to apply normalisation', 'error');
    }

    setIsApplyingNormalisation(false);
  }, [buckets, totalEmployees, addToHistory, showToast]);

  // Preview changes
  const previewChanges = useCallback(() => {
    const preview = buckets.map((b) => {
      const targetCount = Math.round(b.targetPct / 100 * totalEmployees);
      return {
        ...b,
        actualCount: targetCount,
        actualPct: parseFloat((targetCount / totalEmployees * 100).toFixed(1))
      };
    });
    setPreviewBuckets(preview);
    setShowPreviewModal(true);
  }, [buckets, totalEmployees]);

  // Copy summary to clipboard
  const copySummary = useCallback(async () => {
    const summary = buckets.map((b) =>
    `${b.grade} (${b.label}): Target ${b.targetPct}% | Actual ${b.actualPct}% (${b.actualCount})`
    ).join('\n');

    const fullSummary = `Rating Distribution Summary
${reviewPeriods.find((p) => p.value === reviewPeriod)?.label}
Department: ${deptFilter || 'All Departments'}
Total Employees: ${totalEmployees}
Normalisation Score: ${normalisationScore}%

${summary}

Generated: ${new Date().toLocaleString()}`;

    try {
      await navigator.clipboard.writeText(fullSummary);
      setCopiedToClipboard(true);
      showToast('Summary copied to clipboard', 'success');
      setTimeout(() => setCopiedToClipboard(false), 2000);
    } catch (error) {
      showToast('Failed to copy to clipboard', 'error');
    }
  }, [buckets, totalEmployees, normalisationScore, deptFilter, reviewPeriod, showToast]);

  // Restore from history
  const restoreFromHistory = useCallback((entry: HistoryEntry) => {
    setBuckets(JSON.parse(JSON.stringify(entry.buckets)));
    setShowHistoryModal(false);
    showToast(`Restored to state from ${entry.timestamp.toLocaleString()}`, 'success');
  }, [showToast]);

  // Toast Container
  const ToastContainer = () =>
  <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) =>
    <div
      key={toast.id}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg max-w-sm ${
      toast.type === 'success' ? 'bg-green-500 text-white' :
      toast.type === 'error' ? 'bg-red-500 text-white' :
      toast.type === 'warning' ? 'bg-amber-500 text-white' :
      'bg-blue-500 text-white'}`
      }>

          {toast.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 flex-shrink-0" />}
          <span className="text-sm font-medium">{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} className="ml-auto hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
    )}
    </div>;


  // Modal Component
  const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md'






  }: {isOpen: boolean;onClose: () => void;title: string;children: React.ReactNode;size?: 'sm' | 'md' | 'lg' | 'xl';}) => {
    if (!isOpen) return null;

    const sizeClasses = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl'
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className={`relative bg-white rounded-lg shadow-xl ${sizeClasses[size]} w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col`}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>
        </div>
      </div>);

  };

  // Deviation indicator
  const DeviationIndicator = ({ value }: {value: number;}) => {
    if (Math.abs(value) <= 1) {
      return <Minus className="w-4 h-4 text-gray-400" />;
    }
    if (value > 0) {
      return <TrendingUp className="w-4 h-4 text-red-500" />;
    }
    return <TrendingDown className="w-4 h-4 text-green-500" />;
  };

  return (
    <div className="space-y-6 p-6">
      <ToastContainer />

      {/* History Modal */}
      <Modal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        title="Change History"
        size="lg">

        {history.length === 0 ?
        <div className="text-center py-8 text-gray-500">
            <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No history available</p>
          </div> :

        <div className="space-y-3">
            {history.map((entry) =>
          <div
            key={entry.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">

                <div>
                  <p className="text-sm font-medium text-gray-900">{entry.action}</p>
                  <p className="text-xs text-gray-500">{entry.details}</p>
                  <p className="text-xs text-gray-400">{entry.timestamp.toLocaleString()}</p>
                </div>
                <Button
              variant="outline"
              size="sm"
              onClick={() => restoreFromHistory(entry)}>

                  Restore
                </Button>
              </div>
          )}
          </div>
        }
      </Modal>

      {/* Normalisation Suggestions Modal */}
      <Modal
        isOpen={showNormalisationModal}
        onClose={() => setShowNormalisationModal(false)}
        title="Normalisation Suggestions"
        size="lg">

        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Info className="w-4 h-4 text-blue-600" />
            <p className="text-sm text-blue-800">
              The following adjustments are suggested to align the actual distribution with the target bell curve.
            </p>
          </div>

          {normalisationSuggestions.length === 0 ?
          <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
              <p className="text-gray-600">Distribution is already normalised!</p>
            </div> :

          <>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-sm font-semibold text-gray-600">Grade</th>
                    <th className="text-center py-2 text-sm font-semibold text-gray-600">Current</th>
                    <th className="text-center py-2 text-sm font-semibold text-gray-600">Suggested</th>
                    <th className="text-center py-2 text-sm font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {normalisationSuggestions.map((s) =>
                <tr key={s.grade} className="border-b border-gray-100">
                      <td className="py-3 text-sm font-medium">{s.grade}</td>
                      <td className="py-3 text-center text-sm">{s.currentCount}</td>
                      <td className="py-3 text-center text-sm">{s.suggestedCount}</td>
                      <td className="py-3 text-center">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    s.difference > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`
                    }>
                          {s.difference > 0 ? 'Remove' : 'Add'} {s.employeesToMove}
                        </span>
                      </td>
                    </tr>
                )}
                </tbody>
              </table>

              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <p className="text-sm text-amber-800">
                  Applying normalisation will require manual review of affected employee ratings.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowNormalisationModal(false)}>
                  Cancel
                </Button>
                <Button
                variant="primary"
                onClick={applyNormalisation}
                disabled={isApplyingNormalisation}>

                  {isApplyingNormalisation && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Apply Normalisation
                </Button>
              </div>
            </>
          }
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title="Preview Changes"
        size="lg">

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Preview of distribution after applying current target percentages:
          </p>

          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">Grade</th>
                <th className="text-center py-2 px-3 text-sm font-semibold text-gray-600">Current</th>
                <th className="text-center py-2 px-3 text-sm font-semibold text-gray-600">
                  <ArrowRight className="w-4 h-4 inline" />
                </th>
                <th className="text-center py-2 px-3 text-sm font-semibold text-gray-600">After</th>
                <th className="text-center py-2 px-3 text-sm font-semibold text-gray-600">Change</th>
              </tr>
            </thead>
            <tbody>
              {previewBuckets.map((b, i) => {
                const current = buckets[i];
                const change = b.actualCount - current.actualCount;
                return (
                  <tr key={b.grade} className="border-b border-gray-100">
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded text-xs font-bold ${b.bgColor} ${b.color}`}>
                        {b.grade}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-sm">{current.actualCount} ({current.actualPct}%)</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <ArrowRight className="w-4 h-4 text-gray-400 inline" />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-sm font-medium">{b.actualCount} ({b.actualPct}%)</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {change !== 0 &&
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      change > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`
                      }>
                          {change > 0 ? '+' : ''}{change}
                        </span>
                      }
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setShowPreviewModal(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Rating Distribution & Normalisation
          </h1>
          <p className="text-sm text-gray-500">
            Compare actual rating distribution against target bell curve
            {lastSavedAt &&
            <span className="ml-2 text-green-600">
                · Last saved: {lastSavedAt.toLocaleTimeString()}
              </span>
            }
            {isDirty &&
            <span className="ml-2 text-amber-600">· Unsaved changes</span>
            }
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => exportData('csv')}
              disabled={isExporting}>

              {isExporting ?
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

              <Download className="w-4 h-4 mr-2" />
              }
              Export
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={() => exportData('print')}
            disabled={isExporting}>

            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button
            variant="outline"
            onClick={recalculate}
            disabled={isRecalculating}>

            {isRecalculating ?
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

            <RefreshCw className="w-4 h-4 mr-2" />
            }
            Recalculate
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowHistoryModal(true)}>

            <History className="w-4 h-4 mr-2" />
            History
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{totalEmployees}</p>
            <p className="text-sm text-gray-500">Total Employees</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">6</p>
            <p className="text-sm text-gray-500">Grade Buckets</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{deviations.length}</p>
            <p className="text-sm text-gray-500">Deviations &gt;3%</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
            <Target className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className={`text-2xl font-bold ${totalTarget === 100 ? 'text-green-600' : 'text-red-600'}`}>
              {totalTarget}%
            </p>
            <p className="text-sm text-gray-500">Target Total</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className={`text-2xl font-bold ${normalisationScore >= 80 ? 'text-green-600' : normalisationScore >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
              {normalisationScore}%
            </p>
            <p className="text-sm text-gray-500">Normalisation Score</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center">
        <Select
          options={[
          { value: '', label: 'All Departments' },
          { value: 'Mathematics', label: 'Mathematics' },
          { value: 'Science', label: 'Science' },
          { value: 'English', label: 'English' },
          { value: 'Administration', label: 'Administration' },
          { value: 'Support Staff', label: 'Support Staff' }]
          }
          value={deptFilter}
          onChange={(e) => handleDeptFilterChange(e.target.value)} />

        <Select
          options={reviewPeriods}
          value={reviewPeriod}
          onChange={(e) => handleReviewPeriodChange(e.target.value)} />

        <div className="ml-auto flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copySummary}>

            {copiedToClipboard ?
            <Check className="w-4 h-4 mr-2" /> :

            <Copy className="w-4 h-4 mr-2" />
            }
            {copiedToClipboard ? 'Copied!' : 'Copy Summary'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={previewChanges}>

            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={generateNormalisationSuggestions}>

            <Wand2 className="w-4 h-4 mr-2" />
            Normalise
          </Button>
        </div>
      </div>

      {/* Histogram */}
      <Card title="Distribution Comparison">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500" />
              <span className="text-gray-600">Actual Distribution</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-dashed border-gray-400" />
              <span className="text-gray-600">Target (Bell Curve)</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Total Actual: {totalActual}</span>
            <span>|</span>
            <span>Showing {buckets.length} grades</span>
          </div>
        </div>

        <div className="space-y-6">
          {buckets.map((b) => {
            const deviation = b.actualPct - b.targetPct;
            const hasDeviation = Math.abs(deviation) > 3;
            return (
              <div
                key={b.grade}
                className={`p-4 rounded-lg transition-all ${
                hasDeviation ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50'}`
                }>

                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-sm font-bold ${b.bgColor} ${b.color}`}>

                      {b.grade}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {b.label}
                        {b.isLocked &&
                        <Lock className="w-3 h-3 inline ml-2 text-gray-400" />
                        }
                      </p>
                      <p className="text-xs text-gray-500">
                        {b.actualCount} employees
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <DeviationIndicator value={deviation} />
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{b.actualPct}%</p>
                      <p className="text-xs text-gray-500">Actual</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-500">{b.targetPct}%</p>
                      <p className="text-xs text-gray-500">Target</p>
                    </div>
                    {hasDeviation &&
                    <span
                      className={`px-2 py-1 text-xs font-bold rounded-full ${
                      deviation > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`
                      }>

                        {deviation > 0 ? '+' : ''}
                        {deviation.toFixed(1)}%
                      </span>
                    }
                  </div>
                </div>
                {/* Bars */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-12">Actual</span>
                    <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${b.barColor} rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                        style={{
                          width: `${b.actualPct / maxPct * 100}%`
                        }}>

                        <span className="text-xs font-bold text-white">
                          {b.actualPct}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-12">Target</span>
                    <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gray-400 rounded-full transition-all duration-500 flex items-center justify-end pr-2 border-2 border-dashed border-gray-500"
                        style={{
                          width: `${b.targetPct / maxPct * 100}%`
                        }}>

                        <span className="text-xs font-bold text-white">
                          {b.targetPct}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>);

          })}
        </div>
      </Card>

      {/* Target Adjustment */}
      <Card title="Target Adjustment">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg flex-1 mr-4">
            <Sliders className="w-4 h-4 text-blue-600" />
            <p className="text-sm text-blue-800">
              Adjust target percentages to define the ideal bell curve
              distribution. Total must equal 100%.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={autoBalance}
              disabled={buckets.every((b) => b.isLocked)}>

              <Wand2 className="w-4 h-4 mr-2" />
              Auto-Balance
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetToDefaults}>

              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Defaults
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-4">
          {buckets.map((b) =>
          <div key={b.grade} className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <span
                className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-sm font-bold ${b.bgColor} ${b.color}`}>

                  {b.grade}
                </span>
                <button
                onClick={() => toggleLock(b.grade)}
                className={`p-1 rounded hover:bg-gray-100 ${b.isLocked ? 'text-amber-500' : 'text-gray-400'}`}
                title={b.isLocked ? 'Unlock' : 'Lock'}>

                  {b.isLocked ?
                <Lock className="w-3 h-3" /> :

                <Unlock className="w-3 h-3" />
                }
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-1">{b.label}</p>
              <input
              type="number"
              min={0}
              max={100}
              value={b.targetPct}
              onChange={(e) => setTarget(b.grade, Number(e.target.value))}
              disabled={b.isLocked}
              className={`w-full px-2 py-1.5 border rounded text-center text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              b.isLocked ? 'bg-gray-100 cursor-not-allowed border-gray-200' : 'border-gray-300'}`
              } />

              <p className="text-xs text-gray-400 mt-1">%</p>
              <p className="text-xs text-gray-400 mt-1">
                ≈ {Math.round(b.targetPct / 100 * totalEmployees)} emp
              </p>
            </div>
          )}
        </div>

        {totalTarget !== 100 &&
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mt-4">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <p className="text-sm text-red-800">
              Target total is {totalTarget}%. It must equal 100%.
              <button
              onClick={autoBalance}
              className="ml-2 text-red-600 underline hover:no-underline">

                Click to auto-balance
              </button>
            </p>
          </div>
        }

        {hasChanges &&
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              You have unsaved changes to the target distribution.
            </p>
            <div className="flex gap-2">
              <Button
              variant="outline"
              onClick={resetToOriginal}>

                <RotateCcw className="w-4 h-4 mr-2" />
                Revert Changes
              </Button>
              <Button
              variant="primary"
              onClick={saveTargets}
              disabled={!isValidDistribution || isSaving}>

                {isSaving ?
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

              <Save className="w-4 h-4 mr-2" />
              }
                Save Targets
              </Button>
            </div>
          </div>
        }
      </Card>

      {/* Deviations Summary */}
      {deviations.length > 0 &&
      <Card title="Deviation Analysis">
          <div className="space-y-3">
            {deviations.map((b) => {
            const deviation = b.actualPct - b.targetPct;
            const targetCount = Math.round(b.targetPct / 100 * totalEmployees);
            const employeeDiff = b.actualCount - targetCount;

            return (
              <div
                key={b.grade}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                deviation > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`
                }>

                  <div className="flex items-center gap-4">
                    <span
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-sm font-bold ${b.bgColor} ${b.color}`}>

                      {b.grade}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{b.label}</p>
                      <p className="text-xs text-gray-500">
                        Target: {targetCount} | Actual: {b.actualCount} | Diff: {employeeDiff > 0 ? '+' : ''}{employeeDiff}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`text-sm font-bold ${deviation > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {deviation > 0 ? '+' : ''}{deviation.toFixed(1)}% deviation
                      </p>
                      <p className="text-xs text-gray-500">
                        {deviation > 0 ? 'Over target' : 'Under target'}
                      </p>
                    </div>
                    <div className={`p-2 rounded-full ${deviation > 0 ? 'bg-red-100' : 'bg-green-100'}`}>
                      {deviation > 0 ?
                    <TrendingUp className="w-5 h-5 text-red-600" /> :

                    <TrendingDown className="w-5 h-5 text-green-600" />
                    }
                    </div>
                  </div>
                </div>);

          })}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <strong>Recommendation:</strong> Consider reviewing {deviations.length} grade bucket(s) 
              where actual distribution deviates more than 3% from target. 
              Use the normalisation feature to get suggestions for adjustment.
            </p>
          </div>
        </Card>
      }
    </div>);

}