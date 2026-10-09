// pages/admin/settings/RankingMeritListRules.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  Save, RotateCcw, Award, TrendingUp, Settings, Eye, ChevronDown, ChevronUp, Plus,
  Trash2, GripVertical, AlertCircle, CheckCircle, Copy, Download, Printer, FileText,
  Calculator, Target, Medal, Trophy, Layers, BarChart2, Shield, Bell, ArrowUpDown,
  Lock, RefreshCw, X, AlertTriangle, Clock } from
'lucide-react';

// Types
interface TieBreaker {id: string;type: string;subject?: string;order: number;direction: 'asc' | 'desc';enabled: boolean;description: string;}
interface RankingScope {id: string;name: string;level: string;enabled: boolean;showOnReportCard: boolean;showOnMeritList: boolean;description: string;}
interface SubjectWeight {id: string;subjectName: string;subjectCode: string;weight: number;isCore: boolean;includeInRanking: boolean;}
interface GradePointMapping {id: string;gradeFrom: number;gradeTo: number;gradeLetter: string;gradePoint: number;remarks: string;}
interface MeritCategory {id: string;name: string;topN: number;criteria: string;enabled: boolean;certificate: boolean;announcement: boolean;}

interface RankingConfig {
  rankBy: string;includeAllSubjects: boolean;excludeOptional: boolean;excludeCoScholastic: boolean;
  minimumSubjectsRequired: number;minimumAttendanceRequired: number;gpaScale: number;gpaDecimalPlaces: number;
  gpaMethod: string;creditHoursEnabled: boolean;topNStudents: number;separateByStream: boolean;
  separateBySection: boolean;separateByGender: boolean;separateByCategory: boolean;minimumScoreForMerit: number;
  showRankOnReportCard: boolean;showPercentile: boolean;showGradePoint: boolean;showTotalStudents: boolean;
  publicMeritList: boolean;showRankHistory: boolean;rankFormat: string;showRankChange: boolean;
  showRankBadge: boolean;publishDate: string;autoPublish: boolean;notifyParents: boolean;
  notifyStudents: boolean;exportFormat: string;includePhotos: boolean;includeSignatures: boolean;
  generateCertificates: boolean;certificateTemplate: string;principalSignature: boolean;
  considerGraceMark: boolean;roundingMethod: string;tieRankingMethod: string;
  excludeDetainedStudents: boolean;excludeAbsentStudents: boolean;recalculateOnChange: boolean;
}

const STORAGE_KEY = 'ranking_merit_list_rules';
const genId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const SUBJECTS = [
{ code: 'MAT', name: 'Mathematics' }, { code: 'SCI', name: 'Science' }, { code: 'ENG', name: 'English' },
{ code: 'SST', name: 'Social Studies' }, { code: 'HIN', name: 'Hindi' }, { code: 'PHY', name: 'Physics' },
{ code: 'CHE', name: 'Chemistry' }, { code: 'BIO', name: 'Biology' }, { code: 'COM', name: 'Computer Science' },
{ code: 'PHE', name: 'Physical Education' }];


const defaultConfig: RankingConfig = {
  rankBy: 'total', includeAllSubjects: true, excludeOptional: false, excludeCoScholastic: true,
  minimumSubjectsRequired: 5, minimumAttendanceRequired: 75, gpaScale: 10, gpaDecimalPlaces: 2,
  gpaMethod: 'weighted', creditHoursEnabled: false, topNStudents: 10, separateByStream: true,
  separateBySection: false, separateByGender: false, separateByCategory: false, minimumScoreForMerit: 60,
  showRankOnReportCard: true, showPercentile: true, showGradePoint: true, showTotalStudents: true,
  publicMeritList: true, showRankHistory: true, rankFormat: 'numeric', showRankChange: true,
  showRankBadge: true, publishDate: '', autoPublish: false, notifyParents: true, notifyStudents: true,
  exportFormat: 'both', includePhotos: true, includeSignatures: true, generateCertificates: true,
  certificateTemplate: 'default', principalSignature: true, considerGraceMark: true, roundingMethod: 'round',
  tieRankingMethod: 'shared', excludeDetainedStudents: true, excludeAbsentStudents: true, recalculateOnChange: true
};

const defaultTieBreakers: TieBreaker[] = [
{ id: genId(), type: 'subject', subject: 'Mathematics', order: 1, direction: 'desc', enabled: true, description: 'Higher marks in Mathematics' },
{ id: genId(), type: 'subject', subject: 'Science', order: 2, direction: 'desc', enabled: true, description: 'Higher marks in Science' },
{ id: genId(), type: 'attendance', order: 3, direction: 'desc', enabled: true, description: 'Higher attendance percentage' },
{ id: genId(), type: 'dob', order: 4, direction: 'asc', enabled: true, description: 'Younger student gets priority' }];


const defaultScopes: RankingScope[] = [
{ id: genId(), name: 'Class Rank', level: 'class', enabled: true, showOnReportCard: true, showOnMeritList: true, description: 'Rank within same class' },
{ id: genId(), name: 'Section Rank', level: 'section', enabled: true, showOnReportCard: true, showOnMeritList: false, description: 'Rank within same section' },
{ id: genId(), name: 'Stream Rank', level: 'stream', enabled: true, showOnReportCard: true, showOnMeritList: true, description: 'Rank within same stream' },
{ id: genId(), name: 'School Rank', level: 'school', enabled: true, showOnReportCard: true, showOnMeritList: true, description: 'Overall school ranking' },
{ id: genId(), name: 'House Rank', level: 'house', enabled: false, showOnReportCard: false, showOnMeritList: false, description: 'Rank within same house' },
{ id: genId(), name: 'Gender Rank', level: 'gender', enabled: false, showOnReportCard: false, showOnMeritList: true, description: 'Separate ranking by gender' }];


const defaultWeights: SubjectWeight[] = [
{ id: genId(), subjectName: 'Mathematics', subjectCode: 'MAT', weight: 1.5, isCore: true, includeInRanking: true },
{ id: genId(), subjectName: 'Science', subjectCode: 'SCI', weight: 1.5, isCore: true, includeInRanking: true },
{ id: genId(), subjectName: 'English', subjectCode: 'ENG', weight: 1.2, isCore: true, includeInRanking: true },
{ id: genId(), subjectName: 'Social Studies', subjectCode: 'SST', weight: 1.0, isCore: true, includeInRanking: true },
{ id: genId(), subjectName: 'Hindi', subjectCode: 'HIN', weight: 1.0, isCore: true, includeInRanking: true }];


const defaultGrades: GradePointMapping[] = [
{ id: genId(), gradeFrom: 91, gradeTo: 100, gradeLetter: 'A1', gradePoint: 10, remarks: 'Outstanding' },
{ id: genId(), gradeFrom: 81, gradeTo: 90, gradeLetter: 'A2', gradePoint: 9, remarks: 'Excellent' },
{ id: genId(), gradeFrom: 71, gradeTo: 80, gradeLetter: 'B1', gradePoint: 8, remarks: 'Very Good' },
{ id: genId(), gradeFrom: 61, gradeTo: 70, gradeLetter: 'B2', gradePoint: 7, remarks: 'Good' },
{ id: genId(), gradeFrom: 51, gradeTo: 60, gradeLetter: 'C1', gradePoint: 6, remarks: 'Above Average' },
{ id: genId(), gradeFrom: 41, gradeTo: 50, gradeLetter: 'C2', gradePoint: 5, remarks: 'Average' },
{ id: genId(), gradeFrom: 33, gradeTo: 40, gradeLetter: 'D', gradePoint: 4, remarks: 'Below Average' },
{ id: genId(), gradeFrom: 0, gradeTo: 32, gradeLetter: 'E', gradePoint: 0, remarks: 'Need Improvement' }];


const defaultMeritCats: MeritCategory[] = [
{ id: genId(), name: 'School Toppers', topN: 3, criteria: 'Overall highest scorers', enabled: true, certificate: true, announcement: true },
{ id: genId(), name: 'Class Toppers', topN: 3, criteria: 'Top 3 in each class', enabled: true, certificate: true, announcement: true },
{ id: genId(), name: 'Stream Toppers', topN: 5, criteria: 'Top 5 in each stream', enabled: true, certificate: true, announcement: true },
{ id: genId(), name: 'Subject Toppers', topN: 1, criteria: 'Highest scorer in each subject', enabled: true, certificate: true, announcement: true },
{ id: genId(), name: 'Most Improved', topN: 3, criteria: 'Maximum improvement', enabled: false, certificate: true, announcement: false }];


const sampleStudents = [
{ rank: 1, prevRank: 2, name: 'Aarav Sharma', roll: '001', class: '10-A', score: 485, percentage: 97, gpa: 9.8, sectionRank: 1, classRank: 1, schoolRank: 3, percentile: 99.5 },
{ rank: 2, prevRank: 1, name: 'Diya Patel', roll: '015', class: '10-A', score: 482, percentage: 96.4, gpa: 9.7, sectionRank: 2, classRank: 2, schoolRank: 5, percentile: 99.2 },
{ rank: 3, prevRank: 5, name: 'Arjun Kumar', roll: '023', class: '10-B', score: 478, percentage: 95.6, gpa: 9.6, sectionRank: 1, classRank: 3, schoolRank: 8, percentile: 98.8 },
{ rank: 4, prevRank: 3, name: 'Ananya Singh', roll: '007', class: '10-A', score: 475, percentage: 95, gpa: 9.5, sectionRank: 3, classRank: 4, schoolRank: 10, percentile: 98.5 },
{ rank: 5, prevRank: 4, name: 'Rohan Verma', roll: '032', class: '10-B', score: 472, percentage: 94.4, gpa: 9.4, sectionRank: 2, classRank: 5, schoolRank: 12, percentile: 98.2 }];


export function RankingMeritListRules() {
  const [config, setConfig] = useState<RankingConfig>(defaultConfig);
  const [tieBreakers, setTieBreakers] = useState<TieBreaker[]>(defaultTieBreakers);
  const [scopes, setScopes] = useState<RankingScope[]>(defaultScopes);
  const [weights, setWeights] = useState<SubjectWeight[]>(defaultWeights);
  const [grades, setGrades] = useState<GradePointMapping[]>(defaultGrades);
  const [meritCats, setMeritCats] = useState<MeritCategory[]>(defaultMeritCats);

  const [expanded, setExpanded] = useState<Set<string>>(new Set(['method', 'scope', 'tiebreaker', 'weights', 'grades', 'merit', 'display', 'export', 'advanced']));
  const [showPreview, setShowPreview] = useState(false);
  const [previewTab, setPreviewTab] = useState<'preview' | 'data' | 'formula'>('preview');
  const [previewClass, setPreviewClass] = useState('10');
  const [previewStream, setPreviewStream] = useState('Science');
  const [unsaved, setUnsaved] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [calculating, setCalculating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{show: boolean;type: string;msg: string;}>({ show: false, type: '', msg: '' });
  const [confirm, setConfirm] = useState<{show: boolean;title: string;msg: string;onOk: () => void;}>({ show: false, title: '', msg: '', onOk: () => {} });

  const showToast = (type: string, msg: string) => {setToast({ show: true, type, msg });setTimeout(() => setToast((t) => ({ ...t, show: false })), 4000);};
  const showConfirm = (title: string, msg: string, onOk: () => void) => setConfirm({ show: true, title, msg, onOk });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p.config) setConfig(p.config);
        if (p.tieBreakers) setTieBreakers(p.tieBreakers);
        if (p.scopes) setScopes(p.scopes);
        if (p.weights) setWeights(p.weights);
        if (p.grades) setGrades(p.grades);
        if (p.meritCats) setMeritCats(p.meritCats);
        showToast('info', 'Settings loaded');
      } catch (e) {console.error(e);}
    }
  }, []);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {if (unsaved) {e.preventDefault();e.returnValue = '';}};
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [unsaved]);

  const updateConfig = useCallback(<K extends keyof RankingConfig,>(k: K, v: RankingConfig[K]) => {
    setConfig((c) => ({ ...c, [k]: v }));setUnsaved(true);setErrors([]);
  }, []);

  const validate = useCallback(() => {
    const errs: string[] = [];
    if (!tieBreakers.some((t) => t.enabled)) errs.push('At least one tie-breaker required');
    if (!scopes.some((s) => s.enabled)) errs.push('At least one ranking scope required');
    if (config.rankBy === 'weighted' && !weights.some((w) => w.includeInRanking)) errs.push('At least one subject weight required');
    if (config.minimumSubjectsRequired < 1) errs.push('Minimum subjects must be >= 1');
    if (config.autoPublish && !config.publishDate) errs.push('Publish date required for auto-publish');
    setErrors(errs);
    return errs.length === 0;
  }, [config, tieBreakers, scopes, weights]);

  const handleSave = async () => {
    if (!validate()) {showToast('error', 'Fix errors first');return;}
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ config, tieBreakers, scopes, weights, grades, meritCats, savedAt: new Date().toISOString() }));
    setUnsaved(false);setSaving(false);showToast('success', 'Saved successfully');
  };

  const handleReset = () => showConfirm('Reset All', 'Reset to defaults?', () => {
    setConfig(defaultConfig);setTieBreakers(defaultTieBreakers);setScopes(defaultScopes);
    setWeights(defaultWeights);setGrades(defaultGrades);setMeritCats(defaultMeritCats);
    setErrors([]);setUnsaved(true);setConfirm((c) => ({ ...c, show: false }));showToast('success', 'Reset complete');
  });

  const handleRecalculate = () => showConfirm('Recalculate', 'Recalculate all rankings?', async () => {
    setConfirm((c) => ({ ...c, show: false }));setCalculating(true);
    await new Promise((r) => setTimeout(r, 2000));
    setCalculating(false);showToast('success', 'Rankings recalculated');
  });

  const handleExport = () => {
    const blob = new Blob([JSON.stringify({ config, tieBreakers, scopes, weights, grades, meritCats }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');a.href = URL.createObjectURL(blob);a.download = `ranking-config-${Date.now()}.json`;a.click();
    showToast('success', 'Exported');
  };

  const handleImport = () => {
    const input = document.createElement('input');input.type = 'file';input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];if (!file) return;
      try {
        const data = JSON.parse(await file.text());
        showConfirm('Import', 'Replace current config?', () => {
          if (data.config) setConfig(data.config);if (data.tieBreakers) setTieBreakers(data.tieBreakers);
          if (data.scopes) setScopes(data.scopes);if (data.weights) setWeights(data.weights);
          if (data.grades) setGrades(data.grades);if (data.meritCats) setMeritCats(data.meritCats);
          setUnsaved(true);setConfirm((c) => ({ ...c, show: false }));showToast('success', 'Imported');
        });
      } catch {showToast('error', 'Invalid file');}
    };
    input.click();
  };

  const handleClearCache = () => showConfirm('Clear Cache', 'Clear merit list cache?', async () => {
    setConfirm((c) => ({ ...c, show: false }));await new Promise((r) => setTimeout(r, 500));showToast('success', 'Cache cleared');
  });

  const handleResetRankings = () => showConfirm('Reset Rankings', 'Delete ALL ranking data?', async () => {
    setConfirm((c) => ({ ...c, show: false }));setCalculating(true);
    await new Promise((r) => setTimeout(r, 1500));setCalculating(false);showToast('success', 'Rankings reset');
  });

  const formatRank = (r: number) => config.rankFormat === 'ordinal' ? `${r}${['th', 'st', 'nd', 'rd'][r % 10 > 3 ? 0 : r % 10]}` : config.rankFormat === 'roman' ? ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][r - 1] || r : r;
  const getRankIcon = (r: number) => r === 1 ? <Trophy className="w-5 h-5 text-yellow-500" /> : r <= 3 ? <Medal className="w-5 h-5 text-gray-400" /> : null;
  const getRankChange = (cur: number, prev: number) => {const d = prev - cur;return d > 0 ? <span className="text-green-600 text-xs">↑{d}</span> : d < 0 ? <span className="text-red-600 text-xs">↓{Math.abs(d)}</span> : <span className="text-gray-400 text-xs">-</span>;};

  // Tie Breaker Handlers
  const addTB = () => {setTieBreakers((t) => [...t, { id: genId(), type: 'subject', subject: 'English', order: t.length + 1, direction: 'desc', enabled: true, description: 'New rule' }]);setUnsaved(true);};
  const updateTB = (id: string, k: string, v: any) => {setTieBreakers((t) => t.map((x) => x.id === id ? { ...x, [k]: v } : x));setUnsaved(true);};
  const deleteTB = (id: string) => {if (tieBreakers.length <= 1) {showToast('error', 'Need at least one');return;}setTieBreakers((t) => t.filter((x) => x.id !== id).map((x, i) => ({ ...x, order: i + 1 })));setUnsaved(true);};
  const moveTB = (id: string, dir: 'up' | 'down') => {setTieBreakers((t) => {const i = t.findIndex((x) => x.id === id);if (dir === 'up' && i === 0 || dir === 'down' && i === t.length - 1) return t;const n = [...t];[n[i], n[dir === 'up' ? i - 1 : i + 1]] = [n[dir === 'up' ? i - 1 : i + 1], n[i]];return n.map((x, j) => ({ ...x, order: j + 1 }));});setUnsaved(true);};

  // Scope Handlers
  const toggleScope = (id: string, k: 'enabled' | 'showOnReportCard' | 'showOnMeritList') => {setScopes((s) => s.map((x) => x.id === id ? { ...x, [k]: !x[k] } : x));setUnsaved(true);};

  // Weight Handlers
  const addWeight = () => {const avail = SUBJECTS.find((s) => !weights.some((w) => w.subjectCode === s.code));if (!avail) {showToast('warning', 'All subjects added');return;}setWeights((w) => [...w, { id: genId(), subjectName: avail.name, subjectCode: avail.code, weight: 1, isCore: false, includeInRanking: true }]);setUnsaved(true);};
  const updateWeight = (id: string, k: string, v: any) => {setWeights((w) => w.map((x) => x.id === id ? { ...x, [k]: v } : x));setUnsaved(true);};
  const deleteWeight = (id: string) => {if (weights.length <= 1) {showToast('error', 'Need at least one');return;}setWeights((w) => w.filter((x) => x.id !== id));setUnsaved(true);};

  // Grade Handlers
  const addGrade = () => {setGrades((g) => [...g, { id: genId(), gradeFrom: 0, gradeTo: 0, gradeLetter: 'X', gradePoint: 0, remarks: 'New' }]);setUnsaved(true);};
  const updateGrade = (id: string, k: string, v: any) => {setGrades((g) => g.map((x) => x.id === id ? { ...x, [k]: v } : x));setUnsaved(true);};
  const deleteGrade = (id: string) => {if (grades.length <= 1) {showToast('error', 'Need at least one');return;}setGrades((g) => g.filter((x) => x.id !== id));setUnsaved(true);};

  // Merit Category Handlers
  const addMerit = () => {setMeritCats((m) => [...m, { id: genId(), name: 'New Category', topN: 5, criteria: 'Custom', enabled: false, certificate: false, announcement: false }]);setUnsaved(true);};
  const updateMerit = (id: string, k: string, v: any) => {setMeritCats((m) => m.map((x) => x.id === id ? { ...x, [k]: v } : x));setUnsaved(true);};
  const toggleMerit = (id: string, k: 'enabled' | 'certificate' | 'announcement') => {setMeritCats((m) => m.map((x) => x.id === id ? { ...x, [k]: !x[k] } : x));setUnsaved(true);};
  const deleteMerit = (id: string) => {setMeritCats((m) => m.filter((x) => x.id !== id));setUnsaved(true);};
  const dupMerit = (id: string) => {const orig = meritCats.find((x) => x.id === id);if (orig) setMeritCats((m) => [...m, { ...orig, id: genId(), name: `${orig.name} (Copy)`, enabled: false }]);setUnsaved(true);};

  const Toggle = ({ label, desc, checked, onChange, disabled }: {label: string;desc?: string;checked: boolean;onChange: (v: boolean) => void;disabled?: boolean;}) =>
  <div className={`flex items-center justify-between p-3 border rounded-lg ${disabled ? 'bg-gray-100 opacity-60' : checked ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}>
      <div><span className="text-sm font-medium text-gray-700">{label}</span>{desc && <p className="text-xs text-gray-500">{desc}</p>}</div>
      <button onClick={() => !disabled && onChange(!checked)} className={`relative w-12 h-6 rounded-full ${checked ? 'bg-blue-600' : 'bg-gray-300'}`} disabled={disabled}>
        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'right-1' : 'left-1'}`} />
      </button>
    </div>;


  const Section = ({ id, title, icon: Icon, badge, children }: {id: string;title: string;icon: any;badge?: string | number;children: React.ReactNode;}) =>
  <Card className="overflow-hidden">
      <div className="p-4 bg-gray-50 cursor-pointer flex justify-between items-center" onClick={() => setExpanded((e) => {const n = new Set(e);n.has(id) ? n.delete(id) : n.add(id);return n;})}>
        <div className="flex items-center gap-3"><div className="p-2 bg-blue-100 rounded-lg"><Icon className="w-5 h-5 text-blue-600" /></div><h3 className="font-semibold text-lg">{title}</h3>{badge !== undefined && <Badge variant="info">{badge}</Badge>}</div>
        {expanded.has(id) ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </div>
      {expanded.has(id) && <div className="p-6 border-t">{children}</div>}
    </Card>;


  const Alert = ({ title, children, type = 'info' }: {title: string;children: React.ReactNode;type?: string;}) => {
    const styles: any = { info: 'bg-blue-50 border-blue-200 text-blue-900', warning: 'bg-yellow-50 border-yellow-200 text-yellow-900', error: 'bg-red-50 border-red-200 text-red-900', success: 'bg-green-50 border-green-200 text-green-900' };
    return <div className={`${styles[type]} border rounded-lg p-4 flex gap-3`}><AlertCircle className="w-5 h-5 flex-shrink-0" /><div><h4 className="font-semibold">{title}</h4><div className="text-sm">{children}</div></div></div>;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Toast */}
      {toast.show &&
      <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 ${toast.type === 'success' ? 'bg-green-50 border-green-200' : toast.type === 'error' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'} border`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5" />}
          <span>{toast.msg}</span>
          <button onClick={() => setToast((t) => ({ ...t, show: false }))}><X className="w-4 h-4" /></button>
        </div>
      }

      {/* Confirm Dialog */}
      {confirm.show &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4"><AlertTriangle className="w-6 h-6 text-yellow-600" /><h3 className="text-lg font-semibold">{confirm.title}</h3></div>
            <p className="text-gray-600 mb-6">{confirm.msg}</p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setConfirm((c) => ({ ...c, show: false }))}>Cancel</Button>
              <Button onClick={confirm.onOk}>Confirm</Button>
            </div>
          </div>
        </div>
      }

      {/* Preview Modal */}
      {showPreview &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-5xl max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold">Merit List Preview</h2>
                <div className="flex gap-2">
                  {['preview', 'data', 'formula'].map((t) =>
                <button key={t} onClick={() => setPreviewTab(t as any)} className={`px-3 py-1 rounded-lg text-sm ${previewTab === t ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
                )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select value={previewClass} onChange={(e) => setPreviewClass(e.target.value)} className="px-3 py-2 border rounded-lg">
                  {['9', '10', '11', '12'].map((c) => <option key={c} value={c}>Class {c}</option>)}
                </select>
                <select value={previewStream} onChange={(e) => setPreviewStream(e.target.value)} className="px-3 py-2 border rounded-lg">
                  {['All', 'Science', 'Commerce', 'Arts'].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}><X className="w-4 h-4" /></Button>
              </div>
            </div>
            <div className="p-6">
              {previewTab === 'preview' &&
            <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
                    <h3 className="text-2xl font-bold">Merit List - Class {previewClass}</h3>
                    <p className="text-blue-100">Stream: {previewStream} | Top {config.topNStudents}</p>
                    <div className="flex gap-2 mt-4">
                      <Button variant="secondary" size="sm" onClick={() => showToast('info', 'PDF generated')}><Download className="w-4 h-4 mr-1" />PDF</Button>
                      <Button variant="secondary" size="sm" onClick={() => showToast('info', 'Excel generated')}><FileText className="w-4 h-4 mr-1" />Excel</Button>
                      <Button variant="secondary" size="sm" onClick={() => window.print()}><Printer className="w-4 h-4 mr-1" />Print</Button>
                    </div>
                  </div>
                  <table className="w-full border rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left">Rank</th>
                        {config.showRankChange && <th className="px-2 py-3">Change</th>}
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3">Roll</th>
                        <th className="px-4 py-3">Class</th>
                        <th className="px-4 py-3 text-right">{config.rankBy === 'gpa' ? 'GPA' : config.rankBy === 'percentage' ? '%' : 'Score'}</th>
                        {config.showPercentile && <th className="px-4 py-3">Percentile</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {sampleStudents.slice(0, config.topNStudents).map((s) =>
                  <tr key={s.roll} className={s.rank <= 3 ? 'bg-yellow-50' : ''}>
                          <td className="px-4 py-3"><div className="flex items-center gap-2">{config.showRankBadge && getRankIcon(s.rank)}<span className="font-bold">{formatRank(s.rank)}</span></div></td>
                          {config.showRankChange && <td className="px-2 py-3 text-center">{getRankChange(s.rank, s.prevRank)}</td>}
                          <td className="px-4 py-3 font-medium">{s.name}</td>
                          <td className="px-4 py-3 text-center">{s.roll}</td>
                          <td className="px-4 py-3 text-center"><Badge variant="secondary">{s.class}</Badge></td>
                          <td className="px-4 py-3 text-right font-semibold">{config.rankBy === 'gpa' ? `${s.gpa}/${config.gpaScale}` : config.rankBy === 'percentage' ? `${s.percentage}%` : `${s.score}/500`}</td>
                          {config.showPercentile && <td className="px-4 py-3 text-center text-blue-600">{s.percentile}%</td>}
                        </tr>
                  )}
                    </tbody>
                  </table>
                </div>
            }
              {previewTab === 'data' &&
            <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Sample Data</h4>
                  <pre className="text-xs bg-white p-4 rounded border overflow-auto">{JSON.stringify(sampleStudents, null, 2)}</pre>
                </div>
            }
              {previewTab === 'formula' &&
            <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 flex items-center gap-2"><Calculator className="w-5 h-5" />Ranking Formula</h4>
                    <code className="block mt-2 bg-white p-3 rounded border text-sm">
                      {config.rankBy === 'total' && 'Rank = ORDER BY (Total_Marks) DESC'}
                      {config.rankBy === 'percentage' && 'Percentage = (Total / Max) × 100; Rank = ORDER BY (%) DESC'}
                      {config.rankBy === 'gpa' && `GPA = Σ(Grade_Point × Credit) / Σ(Credit); Scale: ${config.gpaScale}`}
                      {config.rankBy === 'weighted' && 'Weighted = Σ(Marks × Weight); Rank = ORDER BY (Weighted) DESC'}
                    </code>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-900">Tie-Breaking Sequence</h4>
                    <div className="mt-2 space-y-1">
                      {tieBreakers.filter((t) => t.enabled).map((t, i) =>
                  <div key={t.id} className="flex items-center gap-2 text-sm"><span className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center font-bold">{i + 1}</span>{t.description}</div>
                  )}
                    </div>
                  </div>
                </div>
            }
            </div>
          </Card>
        </div>
      }

      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg"><Award className="w-7 h-7 text-white" /></div>
          <div><h1 className="text-3xl font-bold">Ranking & Merit List Rules</h1><p className="text-sm text-gray-500">Configure ranking calculations and merit lists</p></div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {unsaved && <Badge variant="warning" className="animate-pulse">Unsaved</Badge>}
          <Button variant="outline" onClick={() => navigator.clipboard.writeText(JSON.stringify(config)).then(() => showToast('success', 'Copied'))}><Copy className="w-4 h-4 mr-1" />Copy</Button>
          <Button variant="outline" onClick={handleExport}><Download className="w-4 h-4 mr-1" />Export</Button>
          <Button variant="outline" onClick={handleImport}><FileText className="w-4 h-4 mr-1" />Import</Button>
          <Button variant="outline" onClick={() => setShowPreview(true)}><Eye className="w-4 h-4 mr-1" />Preview</Button>
          <Button variant="outline" onClick={handleRecalculate} disabled={calculating}><RefreshCw className={`w-4 h-4 mr-1 ${calculating ? 'animate-spin' : ''}`} />{calculating ? 'Calculating...' : 'Recalculate'}</Button>
          <Button variant="outline" onClick={handleReset}><RotateCcw className="w-4 h-4 mr-1" />Reset</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? <><Clock className="w-4 h-4 mr-1 animate-spin" />Saving...</> : <><Save className="w-4 h-4 mr-1" />Save</>}</Button>
        </div>
      </div>

      {errors.length > 0 && <Alert title="Validation Errors" type="error"><ul className="list-disc list-inside">{errors.map((e, i) => <li key={i}>{e}</li>)}</ul></Alert>}

      {/* Quick Stats */}
      <div className="grid grid-cols-5 gap-4">
        {[
        { icon: TrendingUp, label: 'Method', value: config.rankBy, color: 'blue' },
        { icon: Layers, label: 'Scopes', value: `${scopes.filter((s) => s.enabled).length}/${scopes.length}`, color: 'green' },
        { icon: ArrowUpDown, label: 'Tie Breakers', value: `${tieBreakers.filter((t) => t.enabled).length}`, color: 'purple' },
        { icon: Award, label: 'Merit Size', value: `Top ${config.topNStudents}`, color: 'orange' },
        { icon: Trophy, label: 'Categories', value: `${meritCats.filter((m) => m.enabled).length}`, color: 'pink' }].
        map(({ icon: Icon, label, value, color }) =>
        <Card key={label} className={`p-4 bg-gradient-to-br from-${color}-50 to-white`}>
            <div className="flex items-center gap-3"><div className={`p-2 bg-${color}-100 rounded-lg`}><Icon className={`w-5 h-5 text-${color}-600`} /></div><div><div className="text-xs text-gray-500">{label}</div><div className={`font-bold text-${color}-700 capitalize`}>{value}</div></div></div>
          </Card>
        )}
      </div>

      {/* Ranking Method */}
      <Section id="method" title="Ranking Method" icon={TrendingUp}>
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium mb-2">Ranking Basis</label>
              <select value={config.rankBy} onChange={(e) => updateConfig('rankBy', e.target.value)} className="w-full px-4 py-3 border rounded-lg">
                {['total', 'percentage', 'gpa', 'weighted', 'grade_points'].map((v) => <option key={v} value={v}>{v.replace('_', ' ').toUpperCase()}</option>)}
              </select>
            </div>
            <div><label className="block text-sm font-medium mb-2">Rounding</label>
              <select value={config.roundingMethod} onChange={(e) => updateConfig('roundingMethod', e.target.value)} className="w-full px-4 py-3 border rounded-lg">
                {['round', 'floor', 'ceil'].map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div><label className="block text-sm font-medium mb-2">Tie Handling</label>
              <select value={config.tieRankingMethod} onChange={(e) => updateConfig('tieRankingMethod', e.target.value)} className="w-full px-4 py-3 border rounded-lg">
                {['shared', 'sequential', 'average'].map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>
          {(config.rankBy === 'gpa' || config.rankBy === 'grade_points') &&
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 grid grid-cols-4 gap-4">
              <Input type="number" value={config.gpaScale} onChange={(e) => updateConfig('gpaScale', +e.target.value)} label="GPA Scale" min={4} max={10} />
              <Input type="number" value={config.gpaDecimalPlaces} onChange={(e) => updateConfig('gpaDecimalPlaces', +e.target.value)} label="Decimals" min={0} max={3} />
              <div><label className="block text-sm font-medium mb-2">Method</label>
                <select value={config.gpaMethod} onChange={(e) => updateConfig('gpaMethod', e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                  {['simple', 'weighted', 'credit_based'].map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <Toggle label="Credit Hours" checked={config.creditHoursEnabled} onChange={(v) => updateConfig('creditHoursEnabled', v)} />
            </div>
          }
          <div className="grid grid-cols-3 gap-4">
            <Toggle label="Include All Subjects" checked={config.includeAllSubjects} onChange={(v) => updateConfig('includeAllSubjects', v)} />
            <Toggle label="Exclude Optional" checked={config.excludeOptional} onChange={(v) => updateConfig('excludeOptional', v)} />
            <Toggle label="Exclude Co-Scholastic" checked={config.excludeCoScholastic} onChange={(v) => updateConfig('excludeCoScholastic', v)} />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border grid grid-cols-4 gap-4">
            <Input type="number" value={config.minimumSubjectsRequired} onChange={(e) => updateConfig('minimumSubjectsRequired', +e.target.value)} label="Min Subjects" min={1} />
            <Input type="number" value={config.minimumAttendanceRequired} onChange={(e) => updateConfig('minimumAttendanceRequired', +e.target.value)} label="Min Attendance %" min={0} max={100} />
            <Input type="number" value={config.minimumScoreForMerit} onChange={(e) => updateConfig('minimumScoreForMerit', +e.target.value)} label="Min Score for Merit %" min={0} max={100} />
            <div className="space-y-2">
              <Toggle label="Exclude Detained" checked={config.excludeDetainedStudents} onChange={(v) => updateConfig('excludeDetainedStudents', v)} />
              <Toggle label="Exclude Absent" checked={config.excludeAbsentStudents} onChange={(v) => updateConfig('excludeAbsentStudents', v)} />
            </div>
          </div>
        </div>
      </Section>

      {/* Subject Weights */}
      {config.rankBy === 'weighted' &&
      <Section id="weights" title="Subject Weights" icon={BarChart2} badge={weights.length}>
          <div className="space-y-4">
            <div className="flex justify-between"><span className="text-sm text-gray-600">Total Weight: {weights.filter((w) => w.includeInRanking).reduce((s, w) => s + w.weight, 0).toFixed(2)}</span><Button size="sm" onClick={addWeight}><Plus className="w-4 h-4 mr-1" />Add</Button></div>
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 grid grid-cols-12 gap-4 text-sm font-medium"><div className="col-span-3">Subject</div><div className="col-span-2">Code</div><div className="col-span-2 text-center">Weight</div><div className="col-span-1 text-center">Core</div><div className="col-span-2 text-center">Include</div><div className="col-span-2" /></div>
              {weights.map((w) =>
            <div key={w.id} className="px-4 py-2 border-t grid grid-cols-12 gap-4 items-center">
                  <select value={w.subjectName} onChange={(e) => {const s = SUBJECTS.find((x) => x.name === e.target.value);updateWeight(w.id, 'subjectName', e.target.value);if (s) updateWeight(w.id, 'subjectCode', s.code);}} className="col-span-3 px-2 py-1 border rounded">{SUBJECTS.map((s) => <option key={s.code} value={s.name}>{s.name}</option>)}</select>
                  <Input value={w.subjectCode} onChange={(e) => updateWeight(w.id, 'subjectCode', e.target.value)} className="col-span-2" />
                  <Input type="number" value={w.weight} onChange={(e) => updateWeight(w.id, 'weight', +e.target.value)} className="col-span-2 text-center" step={0.1} min={0.1} max={3} />
                  <div className="col-span-1 text-center"><input type="checkbox" checked={w.isCore} onChange={(e) => updateWeight(w.id, 'isCore', e.target.checked)} className="w-4 h-4" /></div>
                  <div className="col-span-2 text-center"><input type="checkbox" checked={w.includeInRanking} onChange={(e) => updateWeight(w.id, 'includeInRanking', e.target.checked)} className="w-4 h-4" /></div>
                  <div className="col-span-2 text-right"><Button variant="ghost" size="sm" onClick={() => deleteWeight(w.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button></div>
                </div>
            )}
            </div>
          </div>
        </Section>
      }

      {/* Grade Points */}
      {(config.rankBy === 'gpa' || config.rankBy === 'grade_points') &&
      <Section id="grades" title="Grade Point Mapping" icon={Target} badge={grades.length}>
          <div className="space-y-4">
            <div className="flex justify-end"><Button size="sm" onClick={addGrade}><Plus className="w-4 h-4 mr-1" />Add</Button></div>
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 grid grid-cols-12 gap-4 text-sm font-medium"><div className="col-span-2">From %</div><div className="col-span-2">To %</div><div className="col-span-2">Grade</div><div className="col-span-2">Points</div><div className="col-span-3">Remarks</div><div className="col-span-1" /></div>
              {[...grades].sort((a, b) => b.gradeTo - a.gradeTo).map((g) =>
            <div key={g.id} className="px-4 py-2 border-t grid grid-cols-12 gap-4 items-center">
                  <Input type="number" value={g.gradeFrom} onChange={(e) => updateGrade(g.id, 'gradeFrom', +e.target.value)} className="col-span-2" min={0} max={100} />
                  <Input type="number" value={g.gradeTo} onChange={(e) => updateGrade(g.id, 'gradeTo', +e.target.value)} className="col-span-2" min={0} max={100} />
                  <Input value={g.gradeLetter} onChange={(e) => updateGrade(g.id, 'gradeLetter', e.target.value)} className="col-span-2 text-center font-bold" />
                  <Input type="number" value={g.gradePoint} onChange={(e) => updateGrade(g.id, 'gradePoint', +e.target.value)} className="col-span-2" min={0} max={config.gpaScale} />
                  <Input value={g.remarks} onChange={(e) => updateGrade(g.id, 'remarks', e.target.value)} className="col-span-3" />
                  <div className="col-span-1 text-right"><Button variant="ghost" size="sm" onClick={() => deleteGrade(g.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button></div>
                </div>
            )}
            </div>
          </div>
        </Section>
      }

      {/* Ranking Scopes */}
      <Section id="scope" title="Ranking Scopes" icon={Layers} badge={`${scopes.filter((s) => s.enabled).length} Active`}>
        <div className="grid grid-cols-2 gap-4">
          {scopes.map((s) =>
          <div key={s.id} className={`p-4 border-2 rounded-lg ${s.enabled ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
              <div className="flex justify-between items-start mb-2">
                <div><Badge variant={s.enabled ? 'success' : 'secondary'}>{s.level.toUpperCase()}</Badge><span className="ml-2 font-semibold">{s.name}</span></div>
                <button onClick={() => toggleScope(s.id, 'enabled')} className={`w-12 h-6 rounded-full ${s.enabled ? 'bg-green-500' : 'bg-gray-300'}`}><span className={`block w-4 h-4 bg-white rounded-full transition-transform ${s.enabled ? 'ml-7' : 'ml-1'}`} /></button>
              </div>
              <p className="text-xs text-gray-600 mb-2">{s.description}</p>
              {s.enabled &&
            <div className="flex gap-4 pt-2 border-t">
                  <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={s.showOnReportCard} onChange={() => toggleScope(s.id, 'showOnReportCard')} className="w-4 h-4" />Report Card</label>
                  <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={s.showOnMeritList} onChange={() => toggleScope(s.id, 'showOnMeritList')} className="w-4 h-4" />Merit List</label>
                </div>
            }
            </div>
          )}
        </div>
      </Section>

      {/* Tie Breakers */}
      <Section id="tiebreaker" title="Tie-Breaking Rules" icon={ArrowUpDown} badge={`${tieBreakers.filter((t) => t.enabled).length} Rules`}>
        <div className="space-y-4">
          <div className="flex justify-end"><Button size="sm" onClick={addTB}><Plus className="w-4 h-4 mr-1" />Add</Button></div>
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 grid grid-cols-12 gap-4 text-sm font-medium"><div className="col-span-1">#</div><div className="col-span-2">Type</div><div className="col-span-3">Criteria</div><div className="col-span-2">Direction</div><div className="col-span-1 text-center">On</div><div className="col-span-3" /></div>
            {tieBreakers.map((t, i) =>
            <div key={t.id} className={`px-4 py-2 border-t grid grid-cols-12 gap-4 items-center ${!t.enabled ? 'opacity-50' : ''}`}>
                <div className="col-span-1 flex items-center gap-1"><GripVertical className="w-4 h-4 text-gray-400" /><span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold">{t.order}</span></div>
                <select value={t.type} onChange={(e) => updateTB(t.id, 'type', e.target.value)} className="col-span-2 px-2 py-1 border rounded" disabled={!t.enabled}>
                  {['subject', 'attendance', 'behavior', 'dob', 'alphabetical', 'admission'].map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
                <div className="col-span-3">{t.type === 'subject' ? <select value={t.subject} onChange={(e) => updateTB(t.id, 'subject', e.target.value)} className="w-full px-2 py-1 border rounded" disabled={!t.enabled}>{SUBJECTS.map((s) => <option key={s.code} value={s.name}>{s.name}</option>)}</select> : <span className="text-sm text-gray-500">{t.description}</span>}</div>
                <select value={t.direction} onChange={(e) => updateTB(t.id, 'direction', e.target.value)} className="col-span-2 px-2 py-1 border rounded" disabled={!t.enabled}>
                  <option value="desc">Higher First</option><option value="asc">Lower First</option>
                </select>
                <div className="col-span-1 text-center"><input type="checkbox" checked={t.enabled} onChange={(e) => updateTB(t.id, 'enabled', e.target.checked)} className="w-5 h-5" /></div>
                <div className="col-span-3 flex justify-end gap-1">
                  <Button variant="ghost" size="sm" onClick={() => moveTB(t.id, 'up')} disabled={i === 0}><ChevronUp className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => moveTB(t.id, 'down')} disabled={i === tieBreakers.length - 1}><ChevronDown className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteTB(t.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Merit Categories */}
      <Section id="merit" title="Merit Categories" icon={Trophy} badge={`${meritCats.filter((m) => m.enabled).length} Active`}>
        <div className="space-y-4">
          <div className="flex justify-end"><Button size="sm" onClick={addMerit}><Plus className="w-4 h-4 mr-1" />Add</Button></div>
          {meritCats.map((m) =>
          <div key={m.id} className={`p-4 border rounded-lg ${m.enabled ? 'border-green-300 bg-green-50' : ''} grid grid-cols-12 gap-4 items-center`}>
              <Input value={m.name} onChange={(e) => updateMerit(m.id, 'name', e.target.value)} className="col-span-3 font-semibold" />
              <Input type="number" value={m.topN} onChange={(e) => updateMerit(m.id, 'topN', +e.target.value)} className="col-span-1 text-center" min={1} />
              <Input value={m.criteria} onChange={(e) => updateMerit(m.id, 'criteria', e.target.value)} className="col-span-3" />
              <div className="col-span-2 flex gap-2">
                <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={m.certificate} onChange={() => toggleMerit(m.id, 'certificate')} className="w-4 h-4" />Cert</label>
                <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={m.announcement} onChange={() => toggleMerit(m.id, 'announcement')} className="w-4 h-4" />Announce</label>
              </div>
              <div className="col-span-2 text-center"><button onClick={() => toggleMerit(m.id, 'enabled')} className={`w-12 h-6 rounded-full ${m.enabled ? 'bg-green-500' : 'bg-gray-300'}`}><span className={`block w-4 h-4 bg-white rounded-full transition-transform ${m.enabled ? 'ml-7' : 'ml-1'}`} /></button></div>
              <div className="col-span-1 flex justify-end gap-1">
                <Button variant="ghost" size="sm" onClick={() => dupMerit(m.id)}><Copy className="w-4 h-4 text-blue-500" /></Button>
                <Button variant="ghost" size="sm" onClick={() => deleteMerit(m.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* Display Options */}
      <Section id="display" title="Display Options" icon={FileText}>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Input type="number" value={config.topNStudents} onChange={(e) => updateConfig('topNStudents', +e.target.value)} label="Top N Students" min={1} />
            <div><label className="block text-sm font-medium mb-2">Rank Format</label>
              <select value={config.rankFormat} onChange={(e) => updateConfig('rankFormat', e.target.value)} className="w-full px-4 py-3 border rounded-lg">
                <option value="numeric">Numeric (1, 2, 3)</option><option value="ordinal">Ordinal (1st, 2nd)</option><option value="roman">Roman (I, II, III)</option>
              </select>
            </div>
            <Toggle label="Public Merit List" checked={config.publicMeritList} onChange={(v) => updateConfig('publicMeritList', v)} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <Toggle label="Separate by Stream" checked={config.separateByStream} onChange={(v) => updateConfig('separateByStream', v)} />
            <Toggle label="Separate by Section" checked={config.separateBySection} onChange={(v) => updateConfig('separateBySection', v)} />
            <Toggle label="Separate by Gender" checked={config.separateByGender} onChange={(v) => updateConfig('separateByGender', v)} />
            <Toggle label="Separate by Category" checked={config.separateByCategory} onChange={(v) => updateConfig('separateByCategory', v)} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <Toggle label="Show Rank Change" checked={config.showRankChange} onChange={(v) => updateConfig('showRankChange', v)} />
            <Toggle label="Show Rank Badge" checked={config.showRankBadge} onChange={(v) => updateConfig('showRankBadge', v)} />
            <Toggle label="Show Rank History" checked={config.showRankHistory} onChange={(v) => updateConfig('showRankHistory', v)} />
            <Toggle label="Show on Report Card" checked={config.showRankOnReportCard} onChange={(v) => updateConfig('showRankOnReportCard', v)} />
          </div>
        </div>
      </Section>

      {/* Export Settings */}
      <Section id="export" title="Export & Publication" icon={Download}>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium mb-2">Export Format</label>
              <select value={config.exportFormat} onChange={(e) => updateConfig('exportFormat', e.target.value)} className="w-full px-4 py-3 border rounded-lg">
                <option value="pdf">PDF Only</option><option value="excel">Excel Only</option><option value="both">Both</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium mb-2">Certificate Template</label>
              <select value={config.certificateTemplate} onChange={(e) => updateConfig('certificateTemplate', e.target.value)} className="w-full px-4 py-3 border rounded-lg">
                {['default', 'modern', 'classic', 'minimal'].map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <Input type="date" value={config.publishDate} onChange={(e) => updateConfig('publishDate', e.target.value)} label="Publish Date" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Toggle label="Include Photos" checked={config.includePhotos} onChange={(v) => updateConfig('includePhotos', v)} />
            <Toggle label="Include Signatures" checked={config.includeSignatures} onChange={(v) => updateConfig('includeSignatures', v)} />
            <Toggle label="Principal Signature" checked={config.principalSignature} onChange={(v) => updateConfig('principalSignature', v)} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <Toggle label="Auto-Publish" checked={config.autoPublish} onChange={(v) => updateConfig('autoPublish', v)} />
            <Toggle label="Generate Certificates" checked={config.generateCertificates} onChange={(v) => updateConfig('generateCertificates', v)} />
            <Toggle label="Notify Parents" checked={config.notifyParents} onChange={(v) => updateConfig('notifyParents', v)} />
            <Toggle label="Notify Students" checked={config.notifyStudents} onChange={(v) => updateConfig('notifyStudents', v)} />
          </div>
        </div>
      </Section>

      {/* Advanced */}
      <Section id="advanced" title="Advanced Settings" icon={Settings}>
        <div className="space-y-4">
          <Alert title="Caution" type="warning">These settings affect core calculations. Modify carefully.</Alert>
          <div className="grid grid-cols-2 gap-4">
            <Toggle label="Consider Grace Marks" checked={config.considerGraceMark} onChange={(v) => updateConfig('considerGraceMark', v)} />
            <Toggle label="Auto-Recalculate on Changes" checked={config.recalculateOnChange} onChange={(v) => updateConfig('recalculateOnChange', v)} />
            <Toggle label="Exclude Detained Students" checked={config.excludeDetainedStudents} onChange={(v) => updateConfig('excludeDetainedStudents', v)} />
            <Toggle label="Exclude Absent Students" checked={config.excludeAbsentStudents} onChange={(v) => updateConfig('excludeAbsentStudents', v)} />
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3"><Lock className="w-5 h-5 text-red-600" /><span className="font-semibold text-red-900">Danger Zone</span></div>
            <div className="flex gap-4">
              <Button variant="outline" className="border-red-300 text-red-700" onClick={handleResetRankings} disabled={calculating}><RotateCcw className="w-4 h-4 mr-1" />Reset All Rankings</Button>
              <Button variant="outline" className="border-red-300 text-red-700" onClick={handleClearCache}><Trash2 className="w-4 h-4 mr-1" />Clear Cache</Button>
              <Button variant="outline" className="border-red-300 text-red-700" onClick={() => showConfirm('Force Recalculate', 'Force recalculate all?', async () => {setConfirm((c) => ({ ...c, show: false }));setCalculating(true);await new Promise((r) => setTimeout(r, 3000));setCalculating(false);showToast('success', 'Done');})} disabled={calculating}><RefreshCw className={`w-4 h-4 mr-1 ${calculating ? 'animate-spin' : ''}`} />Force Recalculate</Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Floating Save */}
      {unsaved &&
      <div className="fixed bottom-6 right-6 z-40">
          <Button onClick={handleSave} disabled={saving} className="shadow-lg">
            {saving ? <><Clock className="w-4 h-4 mr-1 animate-spin" />Saving...</> : <><Save className="w-4 h-4 mr-1" />Save Changes</>}
          </Button>
        </div>
      }
    </div>);

}