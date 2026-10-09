// File: pages/admin/settings/PromotionDetentionCriteria.tsx

import React, { useState, useCallback, useRef } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Toggle } from '../../../components/ui/Toggle';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/Tabs';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader } from '../../../components/ui/Table';
import { Save, RotateCcw, TrendingUp, XCircle, FileText, Users, Play, Eye, Award, AlertCircle, Settings, Plus, Trash2, Copy, Download, Upload, History, CheckCircle, Edit2, ChevronDown, ChevronRight, Info, Bell, Mail, UserCheck, Shield, AlertTriangle, FileCheck, Printer, BarChart3, Lock, Unlock, RefreshCw, ArrowRight, Layers, Zap, Scale, Heart, Activity, GraduationCap, X } from 'lucide-react';

// Types
interface PromotionCriteria {id: string;classRange: string;minOverallPercentage: number;maxFailedSubjects: number;minPassingSubjects: number;mandatorySubjects: string[];minMandatoryPercentage: number;minAttendance: number;graceMarksAllowed: boolean;maxGraceMarks: number;compartmentAllowed: boolean;maxCompartmentSubjects: number;isActive: boolean;}
interface DetentionRule {id: string;ruleName: string;condition: string;action: string;priority: number;isActive: boolean;}
interface GraceMarksRule {id: string;category: string;criteria: string;maxMarks: number;perSubject: number;applicableTo: string[];isActive: boolean;}
interface SpecialCase {id: string;caseType: string;description: string;exemptions: string[];approvalRequired: boolean;documentRequired: boolean;}
interface SimulationStudent {id: string;rollNo: string;name: string;class: string;section: string;overallPercentage: number;attendance: number;failedSubjects: number;status: 'promoted' | 'detained' | 'compartment' | 'pending';reason: string;mandatoryFailed: string[];}
interface CriteriaHistory {id: string;changedBy: string;changedAt: string;field: string;oldValue: string;newValue: string;reason: string;}
interface NotificationTemplate {id: string;name: string;type: string;status: 'active' | 'draft';subject: string;body: string;}

interface Settings {
  minOverallPercentage: number;maxFailedSubjects: number;minSubjectsToPass: number;promotionMode: string;autoPromoteAllPass: boolean;considerBestNSubjects: boolean;numberOfBestSubjects: number;includeInternalAssessment: boolean;theoryWeightage: number;internalWeightage: number;detainIfFailedMoreThan: number;detainIfOverallBelow: number;attendanceBasedDetention: boolean;minAttendanceForPromotion: number;allowMedicalExemption: boolean;detainOnDisciplinaryGrounds: boolean;detainForExamMalpractice: boolean;noDetentionPolicyOverride: boolean;enforceMandatorySubjectPass: boolean;mandatorySubjects: string[];minMandatoryPercentage: number;onMandatorySubjectFailure: string;enableAttendanceCriteria: boolean;attendanceCalculationPeriod: string;excludeMedicalLeave: boolean;maxMedicalLeaveDays: number;attendanceShortageAction: string;allowCompartmentExam: boolean;maxCompartmentSubjects: number;reExamWindowDays: number;minReExamPercentage: number;reExamType: string;autoPromoteOnReExamPass: boolean;allowMultipleAttempts: boolean;maxAttempts: number;reExamFeePerSubject: number;feeCollection: string;enableCombinedScoring: boolean;academicMarksWeightage: number;attendanceWeightage: number;coCurricularWeightage: number;disciplineWeightage: number;minCombinedScore: number;
}

// Utility
const generateId = () => Math.random().toString(36).substring(2, 11);
const formatDate = (date: Date) => date.toLocaleString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true });

// Default Settings
const defaultSettings: Settings = {
  minOverallPercentage: 35, maxFailedSubjects: 2, minSubjectsToPass: 4, promotionMode: 'hybrid', autoPromoteAllPass: true, considerBestNSubjects: false, numberOfBestSubjects: 5, includeInternalAssessment: true, theoryWeightage: 80, internalWeightage: 20, detainIfFailedMoreThan: 2, detainIfOverallBelow: 20, attendanceBasedDetention: true, minAttendanceForPromotion: 75, allowMedicalExemption: true, detainOnDisciplinaryGrounds: false, detainForExamMalpractice: true, noDetentionPolicyOverride: false, enforceMandatorySubjectPass: true, mandatorySubjects: ['English', 'Mathematics', 'Science', 'Social Studies'], minMandatoryPercentage: 33, onMandatorySubjectFailure: 'compartment', enableAttendanceCriteria: true, attendanceCalculationPeriod: 'annual', excludeMedicalLeave: true, maxMedicalLeaveDays: 30, attendanceShortageAction: 'review', allowCompartmentExam: true, maxCompartmentSubjects: 2, reExamWindowDays: 30, minReExamPercentage: 33, reExamType: 'full', autoPromoteOnReExamPass: true, allowMultipleAttempts: false, maxAttempts: 2, reExamFeePerSubject: 200, feeCollection: 'before', enableCombinedScoring: true, academicMarksWeightage: 70, attendanceWeightage: 15, coCurricularWeightage: 10, disciplineWeightage: 5, minCombinedScore: 50
};

// Initial Data
const initialCriteria: PromotionCriteria[] = [
{ id: '1', classRange: 'Class 1-5 (Primary)', minOverallPercentage: 33, maxFailedSubjects: 3, minPassingSubjects: 3, mandatorySubjects: ['English', 'Mathematics'], minMandatoryPercentage: 33, minAttendance: 70, graceMarksAllowed: true, maxGraceMarks: 10, compartmentAllowed: false, maxCompartmentSubjects: 0, isActive: true },
{ id: '2', classRange: 'Class 6-8 (Middle)', minOverallPercentage: 33, maxFailedSubjects: 2, minPassingSubjects: 4, mandatorySubjects: ['English', 'Mathematics', 'Science'], minMandatoryPercentage: 33, minAttendance: 75, graceMarksAllowed: true, maxGraceMarks: 8, compartmentAllowed: true, maxCompartmentSubjects: 1, isActive: true },
{ id: '3', classRange: 'Class 9-10 (Secondary)', minOverallPercentage: 35, maxFailedSubjects: 2, minPassingSubjects: 5, mandatorySubjects: ['English', 'Mathematics', 'Science', 'Social Studies'], minMandatoryPercentage: 35, minAttendance: 75, graceMarksAllowed: true, maxGraceMarks: 5, compartmentAllowed: true, maxCompartmentSubjects: 2, isActive: true },
{ id: '4', classRange: 'Class 11-12 (Senior Secondary)', minOverallPercentage: 40, maxFailedSubjects: 1, minPassingSubjects: 5, mandatorySubjects: ['English'], minMandatoryPercentage: 40, minAttendance: 80, graceMarksAllowed: false, maxGraceMarks: 0, compartmentAllowed: true, maxCompartmentSubjects: 2, isActive: true }];


const initialDetentionRules: DetentionRule[] = [
{ id: '1', ruleName: 'Academic Failure', condition: 'Failed subjects > Maximum allowed', action: 'Direct detention', priority: 1, isActive: true },
{ id: '2', ruleName: 'Mandatory Subject Failure', condition: 'Failed in any mandatory subject', action: 'Detention or Compartment', priority: 2, isActive: true },
{ id: '3', ruleName: 'Attendance Shortage', condition: 'Attendance < Minimum required', action: 'Manual review', priority: 3, isActive: true },
{ id: '4', ruleName: 'Disciplinary Grounds', condition: 'Flagged for disciplinary issues', action: 'Manual review', priority: 4, isActive: false },
{ id: '5', ruleName: 'Unfair Means', condition: 'Caught in exam malpractice', action: 'Direct detention', priority: 5, isActive: true }];


const initialGraceRules: GraceMarksRule[] = [
{ id: '1', category: 'Sports Achievement', criteria: 'Represented school/state/national level', maxMarks: 10, perSubject: 3, applicableTo: ['All Classes'], isActive: true },
{ id: '2', category: 'Cultural Achievement', criteria: 'Won inter-school/state competition', maxMarks: 5, perSubject: 2, applicableTo: ['Class 6-12'], isActive: true },
{ id: '3', category: 'NCC/NSS/Scouts', criteria: 'Active participation with certificates', maxMarks: 5, perSubject: 2, applicableTo: ['Class 9-12'], isActive: true },
{ id: '4', category: 'Medical Grounds', criteria: 'Chronic illness affecting exams', maxMarks: 8, perSubject: 3, applicableTo: ['All Classes'], isActive: true },
{ id: '5', category: 'PWD Students', criteria: 'Differently abled students', maxMarks: 10, perSubject: 5, applicableTo: ['All Classes'], isActive: true }];


const initialSpecialCases: SpecialCase[] = [
{ id: '1', caseType: 'Medical Emergency', description: 'Student missed exams due to hospitalization', exemptions: ['Attendance requirement', 'Internal assessment marks'], approvalRequired: true, documentRequired: true },
{ id: '2', caseType: 'Family Bereavement', description: 'Death in immediate family during exam period', exemptions: ['Grace marks consideration', 'Re-exam eligibility'], approvalRequired: true, documentRequired: true },
{ id: '3', caseType: 'Natural Disaster', description: 'Student affected by natural calamity', exemptions: ['All criteria relaxed', 'Special consideration'], approvalRequired: true, documentRequired: false },
{ id: '4', caseType: 'Transfer Case', description: 'Mid-session transfer from another board', exemptions: ['Previous school marks consideration', 'Syllabus gap allowance'], approvalRequired: true, documentRequired: true }];


const initialStudents: SimulationStudent[] = [
{ id: '1', rollNo: '2024001', name: 'Rahul Sharma', class: '10', section: 'A', overallPercentage: 78.5, attendance: 92, failedSubjects: 0, status: 'promoted', reason: 'All criteria satisfied', mandatoryFailed: [] },
{ id: '2', rollNo: '2024002', name: 'Priya Singh', class: '10', section: 'A', overallPercentage: 45.2, attendance: 88, failedSubjects: 1, status: 'compartment', reason: 'Failed in Mathematics', mandatoryFailed: ['Mathematics'] },
{ id: '3', rollNo: '2024003', name: 'Amit Kumar', class: '10', section: 'B', overallPercentage: 28.5, attendance: 65, failedSubjects: 4, status: 'detained', reason: 'Failed in 4 subjects, attendance shortage', mandatoryFailed: ['Mathematics', 'Science'] },
{ id: '4', rollNo: '2024004', name: 'Sneha Patel', class: '10', section: 'B', overallPercentage: 52.3, attendance: 72, failedSubjects: 1, status: 'pending', reason: 'Attendance below threshold - manual review', mandatoryFailed: [] },
{ id: '5', rollNo: '2024005', name: 'Vikram Reddy', class: '10', section: 'A', overallPercentage: 85.2, attendance: 95, failedSubjects: 0, status: 'promoted', reason: 'All criteria satisfied with distinction', mandatoryFailed: [] }];


const initialHistory: CriteriaHistory[] = [
{ id: '1', changedBy: 'Admin User', changedAt: '2024-03-15 10:30 AM', field: 'Minimum Overall Percentage (Class 9-10)', oldValue: '33%', newValue: '35%', reason: 'Board guidelines update' },
{ id: '2', changedBy: 'Principal', changedAt: '2024-03-10 02:15 PM', field: 'Grace Marks - Sports', oldValue: '5 marks', newValue: '10 marks', reason: 'Encouraging sports participation' },
{ id: '3', changedBy: 'Admin User', changedAt: '2024-02-28 11:45 AM', field: 'Minimum Attendance (Class 11-12)', oldValue: '75%', newValue: '80%', reason: 'CBSE regulation compliance' }];


const initialTemplates: NotificationTemplate[] = [
{ id: '1', name: 'Promotion Notification', type: 'SMS + Email', status: 'active', subject: 'Promotion Result', body: 'Dear Parent, Your ward has been promoted to next class.' },
{ id: '2', name: 'Detention Notification', type: 'SMS + Email', status: 'active', subject: 'Result Notification', body: 'Dear Parent, Please visit school to discuss your ward\'s result.' },
{ id: '3', name: 'Compartment Schedule', type: 'SMS + Email', status: 'active', subject: 'Compartment Exam Schedule', body: 'Dear Parent, Compartment exam is scheduled for...' },
{ id: '4', name: 'Re-exam Reminder', type: 'SMS', status: 'active', subject: 'Re-exam Reminder', body: 'Reminder: Re-examination is scheduled for...' },
{ id: '5', name: 'Result Collection', type: 'SMS', status: 'draft', subject: 'Collect Result', body: 'Please collect result card from school office.' }];


export function PromotionDetentionCriteria() {
  // Core States
  const [activeTab, setActiveTab] = useState('general');
  const [academicYear, setAcademicYear] = useState('2024-25');
  const [classFilter, setClassFilter] = useState('all');
  const [examType, setExamType] = useState('final');
  const [expandedSections, setExpandedSections] = useState<string[]>(['promotion', 'detention']);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Modal States
  const [modals, setModals] = useState({ history: false, preview: false, ruleBuilder: false, graceMarks: false, specialCase: false, detentionRule: false, template: false, confirm: false, studentDetail: false, applyPromotion: false, detailedReport: false });
  const [confirmData, setConfirmData] = useState<{type: string;id: string;message: string;} | null>(null);

  // Edit States
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Filter States
  const [historyFilter, setHistoryFilter] = useState('all');
  const [historySearch, setHistorySearch] = useState('');
  const [previewFilter, setPreviewFilter] = useState('all');
  const [previewSearch, setPreviewSearch] = useState('');
  const [simFilter, setSimFilter] = useState('all');

  // Simulation States
  const [simClass, setSimClass] = useState('10');
  const [simSection, setSimSection] = useState('all');
  const [simYear, setSimYear] = useState('2024-25');
  const [simExam, setSimExam] = useState('final');
  const [simRunning, setSimRunning] = useState(false);
  const [whatIfParams, setWhatIfParams] = useState({ minPercentage: 40, maxFailedSubjects: 1, minAttendance: 80 });
  const [whatIfResults, setWhatIfResults] = useState<{current: {promoted: number;detained: number;compartment: number;};projected: {promoted: number;detained: number;compartment: number;};} | null>(null);

  // Data States
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [originalSettings] = useState<Settings>(defaultSettings);
  const [criteria, setCriteria] = useState<PromotionCriteria[]>(initialCriteria);
  const [detentionRules, setDetentionRules] = useState<DetentionRule[]>(initialDetentionRules);
  const [graceRules, setGraceRules] = useState<GraceMarksRule[]>(initialGraceRules);
  const [specialCases, setSpecialCases] = useState<SpecialCase[]>(initialSpecialCases);
  const [students, setStudents] = useState<SimulationStudent[]>(initialStudents);
  const [history, setHistory] = useState<CriteriaHistory[]>(initialHistory);
  const [templates, setTemplates] = useState<NotificationTemplate[]>(initialTemplates);

  // Form States
  const [criteriaForm, setCriteriaForm] = useState<Partial<PromotionCriteria>>({});
  const [ruleForm, setRuleForm] = useState<Partial<DetentionRule>>({});
  const [graceForm, setGraceForm] = useState<Partial<GraceMarksRule>>({});
  const [caseForm, setCaseForm] = useState<Partial<SpecialCase>>({});
  const [templateForm, setTemplateForm] = useState<Partial<NotificationTemplate>>({});
  const [newExemption, setNewExemption] = useState('');
  const [newApplicable, setNewApplicable] = useState('');

  // Additional Settings
  const [notifSettings, setNotifSettings] = useState({ notifyParentsOnDetention: true, notifyParentsOnCompartment: true, notifyClassTeachers: true, notifyPrincipal: true, warningBeforeDetention: true, daysBeforeResultWarning: 7, reminderBeforeCompartment: 3, followUpAfterDetention: 15, autoGeneratePromotionCertificate: true, autoGenerateTCForDetained: false, includeResultAnalysis: true, includeAttendanceReport: true, reportCardFormat: 'cbse' });
  const [pwdSettings, setPwdSettings] = useState({ extendedTimeExemption: true, scribeAllowance: true, flexibleExaminationMode: true, graceMarksForPWD: 5, attendanceExemption: 'partial' });
  const [overrideSettings, setOverrideSettings] = useState({ allowPrincipalOverride: true, allowTeacherRecommendation: true, requireOverrideJustification: true, auditOverrideDecisions: true });
  const [graceAppSettings, setGraceAppSettings] = useState({ applyOnlyToBorderlineCases: true, applyToMandatorySubjects: true, cumulativeGraceAllowed: false, maxTotalGraceMarks: 15, graceApplicationPriority: 'failed' });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helpers
  const openModal = (name: keyof typeof modals) => setModals((prev) => ({ ...prev, [name]: true }));
  const closeModal = (name: keyof typeof modals) => setModals((prev) => ({ ...prev, [name]: false }));
  const toggleSection = (section: string) => setExpandedSections((prev) => prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]);

  const addHistory = useCallback((field: string, oldValue: string, newValue: string, reason = 'Manual update') => {
    setHistory((prev) => [{ id: generateId(), changedBy: 'Current User', changedAt: formatDate(new Date()), field, oldValue, newValue, reason }, ...prev]);
  }, []);

  const updateSetting = <K extends keyof Settings,>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const simResults = { promoted: students.filter((s) => s.status === 'promoted').length, detained: students.filter((s) => s.status === 'detained').length, compartment: students.filter((s) => s.status === 'compartment').length, pending: students.filter((s) => s.status === 'pending').length, total: students.length };
  const filteredStudents = students.filter((s) => simFilter === 'all' || s.status === simFilter);
  const filteredHistory = history.filter((h) => (historyFilter === 'all' || h.field.toLowerCase().includes(historyFilter)) && (!historySearch || h.field.toLowerCase().includes(historySearch.toLowerCase())));
  const filteredPreview = students.filter((s) => s.status !== 'promoted' && (previewFilter === 'all' || s.status === previewFilter) && (!previewSearch || s.name.toLowerCase().includes(previewSearch.toLowerCase()) || s.rollNo.includes(previewSearch)));
  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = { promoted: 'success', detained: 'danger', compartment: 'warning', pending: 'info' };
    return <Badge variant={variants[status] || 'default'}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  // Save/Restore
  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1500));
    addHistory('Settings', 'Previous', 'Updated', 'Settings saved');
    setHasChanges(false);
    setSaving(false);
    alert('Criteria saved successfully!');
  };

  const handleRestore = () => {
    setConfirmData({ type: 'restore', id: '', message: 'Restore all settings to defaults?' });
    openModal('confirm');
  };

  const confirmAction = () => {
    if (confirmData?.type === 'restore') {
      setSettings(defaultSettings);
      addHistory('All Settings', 'Custom', 'Default', 'Restored to defaults');
      setHasChanges(true);
    } else if (confirmData?.type === 'deleteCriteria') {
      const c = criteria.find((x) => x.id === confirmData.id);
      setCriteria((prev) => prev.filter((x) => x.id !== confirmData.id));
      if (c) addHistory('Class Criteria', c.classRange, 'Deleted', 'Removed');
    } else if (confirmData?.type === 'applyPromotion') {
      addHistory('Promotion Applied', 'N/A', `Class ${simClass}: ${simResults.promoted} promoted`, 'Promotion executed');
      alert('Promotion applied successfully!');
    }
    closeModal('confirm');
    setConfirmData(null);
  };

  // Export/Import
  const handleExport = () => {
    const data = { version: '1.0', exportedAt: new Date().toISOString(), academicYear, settings, criteria, detentionRules, graceRules, specialCases, notifSettings, pwdSettings, overrideSettings, graceAppSettings };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `promotion-criteria-${academicYear}.json`;
    a.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (data.settings) setSettings(data.settings);
        if (data.criteria) setCriteria(data.criteria);
        if (data.detentionRules) setDetentionRules(data.detentionRules);
        if (data.graceRules) setGraceRules(data.graceRules);
        if (data.specialCases) setSpecialCases(data.specialCases);
        addHistory('All Settings', 'Previous', 'Imported', `From ${file.name}`);
        setHasChanges(true);
        alert('Imported successfully!');
      } catch {alert('Invalid file format');}
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCopyPrevYear = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    addHistory('All Settings', 'Current', 'Previous Year', 'Copied from 2023-24');
    setHasChanges(true);
    setLoading(false);
    alert('Copied from previous year!');
  };

  // CRUD Operations
  const saveCriteria = () => {
    if (!criteriaForm.classRange) return alert('Enter class range');
    if (editingId) {
      setCriteria((prev) => prev.map((c) => c.id === editingId ? { ...c, ...criteriaForm } as PromotionCriteria : c));
      addHistory('Class Criteria', 'Previous', criteriaForm.classRange!, 'Updated');
    } else {
      setCriteria((prev) => [...prev, { ...criteriaForm, id: generateId() } as PromotionCriteria]);
      addHistory('Class Criteria', 'N/A', criteriaForm.classRange!, 'Added');
    }
    closeModal('ruleBuilder');
    setCriteriaForm({});
    setEditingId(null);
    setHasChanges(true);
  };

  const saveDetentionRule = () => {
    if (!ruleForm.ruleName || !ruleForm.condition || !ruleForm.action) return alert('Fill all fields');
    if (editingId) {
      setDetentionRules((prev) => prev.map((r) => r.id === editingId ? { ...r, ...ruleForm } as DetentionRule : r));
    } else {
      setDetentionRules((prev) => [...prev, { ...ruleForm, id: generateId() } as DetentionRule]);
    }
    closeModal('detentionRule');
    setRuleForm({});
    setEditingId(null);
    setHasChanges(true);
  };

  const saveGraceRule = () => {
    if (!graceForm.category || !graceForm.criteria) return alert('Fill all fields');
    if (editingId) {
      setGraceRules((prev) => prev.map((r) => r.id === editingId ? { ...r, ...graceForm } as GraceMarksRule : r));
    } else {
      setGraceRules((prev) => [...prev, { ...graceForm, id: generateId() } as GraceMarksRule]);
    }
    closeModal('graceMarks');
    setGraceForm({});
    setEditingId(null);
    setHasChanges(true);
  };

  const saveSpecialCase = () => {
    if (!caseForm.caseType || !caseForm.description) return alert('Fill all fields');
    if (editingId) {
      setSpecialCases((prev) => prev.map((c) => c.id === editingId ? { ...c, ...caseForm } as SpecialCase : c));
    } else {
      setSpecialCases((prev) => [...prev, { ...caseForm, id: generateId() } as SpecialCase]);
    }
    closeModal('specialCase');
    setCaseForm({});
    setEditingId(null);
    setHasChanges(true);
  };

  const saveTemplate = () => {
    if (!templateForm.name || !templateForm.body) return alert('Fill all fields');
    if (editingId) {
      setTemplates((prev) => prev.map((t) => t.id === editingId ? { ...t, ...templateForm } as NotificationTemplate : t));
    } else {
      setTemplates((prev) => [...prev, { ...templateForm, id: generateId() } as NotificationTemplate]);
    }
    closeModal('template');
    setTemplateForm({});
    setEditingId(null);
  };

  // Simulation
  const runSimulation = async () => {
    setSimRunning(true);
    await new Promise((r) => setTimeout(r, 2000));
    setStudents((prev) => prev.map((s) => {
      const c = criteria.find((x) => x.classRange.includes('9-10'));
      if (!c) return s;
      let status: SimulationStudent['status'] = 'promoted',reason = 'All criteria satisfied';
      if (settings.enableAttendanceCriteria && s.attendance < c.minAttendance) {
        if (settings.attendanceShortageAction === 'detain') {status = 'detained';reason = 'Attendance shortage';} else
        if (settings.attendanceShortageAction === 'review') {status = 'pending';reason = 'Attendance review needed';}
      }
      if (s.failedSubjects > c.maxFailedSubjects) {status = 'detained';reason = `Failed ${s.failedSubjects} subjects`;} else
      if (s.failedSubjects > 0 && s.failedSubjects <= c.maxCompartmentSubjects && c.compartmentAllowed && status !== 'detained') {status = 'compartment';reason = 'Compartment eligible';}
      if (s.overallPercentage < c.minOverallPercentage) {status = 'detained';reason = `Overall ${s.overallPercentage}% below ${c.minOverallPercentage}%`;}
      if (s.mandatoryFailed.length > 0 && settings.enforceMandatorySubjectPass) {
        if (settings.onMandatorySubjectFailure === 'detain') {status = 'detained';reason = `Failed: ${s.mandatoryFailed.join(', ')}`;} else
        if (settings.onMandatorySubjectFailure === 'compartment' && c.compartmentAllowed && status !== 'detained') {status = 'compartment';reason = `Compartment: ${s.mandatoryFailed.join(', ')}`;}
      }
      return { ...s, status, reason };
    }));
    setSimRunning(false);
  };

  const runWhatIf = () => {
    const current = { promoted: simResults.promoted, detained: simResults.detained, compartment: simResults.compartment };
    let promoted = 0,detained = 0,compartment = 0;
    students.forEach((s) => {
      if (s.overallPercentage < whatIfParams.minPercentage || s.failedSubjects > whatIfParams.maxFailedSubjects || s.attendance < whatIfParams.minAttendance) {
        if (s.failedSubjects > whatIfParams.maxFailedSubjects || s.overallPercentage < whatIfParams.minPercentage) {
          if (s.failedSubjects <= 2 && s.overallPercentage >= whatIfParams.minPercentage - 10) compartment++;else
          detained++;
        } else detained++;
      } else promoted++;
    });
    setWhatIfResults({ current, projected: { promoted, detained, compartment } });
  };

  const exportToCSV = () => {
    const csv = [['Roll No', 'Name', 'Class', 'Section', 'Overall %', 'Attendance', 'Failed', 'Status', 'Reason'].join(','), ...filteredStudents.map((s) => [s.rollNo, s.name, s.class, s.section, s.overallPercentage, s.attendance, s.failedSubjects, s.status, `"${s.reason}"`].join(','))].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `simulation-class-${simClass}.csv`;
    a.click();
  };

  const printReport = () => {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<html><head><title>Report</title><style>body{font-family:Arial;padding:20px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f5f5f5}</style></head><body><h1>Promotion Report - Class ${simClass}</h1><p>Generated: ${formatDate(new Date())}</p><table><thead><tr><th>Roll</th><th>Name</th><th>%</th><th>Attendance</th><th>Status</th><th>Reason</th></tr></thead><tbody>${filteredStudents.map((s) => `<tr><td>${s.rollNo}</td><td>${s.name}</td><td>${s.overallPercentage}%</td><td>${s.attendance}%</td><td>${s.status}</td><td>${s.reason}</td></tr>`).join('')}</tbody></table></body></html>`);
    w.document.close();
    w.print();
  };

  const exportHistory = () => {
    const csv = [['Date', 'Changed By', 'Field', 'Old Value', 'New Value', 'Reason'].join(','), ...filteredHistory.map((h) => [h.changedAt, h.changedBy, `"${h.field}"`, `"${h.oldValue}"`, `"${h.newValue}"`, `"${h.reason}"`].join(','))].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'criteria-history.csv';
    a.click();
  };

  // Section Component
  const Section = ({ id, icon: Icon, title, subtitle, color, children }: {id: string;icon: any;title: string;subtitle: string;color: string;children: React.ReactNode;}) =>
  <Card>
      <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection(id)}>
        <div className="flex items-center gap-3">
          <div className={`p-2 bg-${color}-100 rounded-lg`}><Icon className={`w-5 h-5 text-${color}-600`} /></div>
          <div><h3 className="font-semibold text-gray-900">{title}</h3><p className="text-xs text-gray-500">{subtitle}</p></div>
        </div>
        {expandedSections.includes(id) ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
      </div>
      {expandedSections.includes(id) && <div className="mt-4 pt-4 border-t space-y-4">{children}</div>}
    </Card>;


  return (
    <div className="space-y-6 p-6">
      <input type="file" ref={fileInputRef} onChange={handleImport} accept=".json" className="hidden" />

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Promotion & Detention Criteria</h1>
          <p className="text-sm text-gray-500 mt-1">Configure academic progression rules, grace marks, special cases, and run simulations</p>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && <Badge variant="warning"><AlertCircle className="w-3 h-3 mr-1" />Unsaved Changes</Badge>}
          <Button variant="outline" onClick={() => openModal('history')}><History className="w-4 h-4 mr-2" />History</Button>
          <Button variant="outline" onClick={() => openModal('preview')}><Eye className="w-4 h-4 mr-2" />Preview</Button>
          <Button variant="outline" onClick={handleRestore}><RotateCcw className="w-4 h-4 mr-2" />Restore</Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}><Save className="w-4 h-4 mr-2" />{saving ? 'Saving...' : 'Save'}</Button>
        </div>
      </div>

      {/* Filters */}
      <Card noPadding className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Select label="" className="w-48" options={[{ value: '2024-25', label: 'AY 2024-2025' }, { value: '2023-24', label: 'AY 2023-2024' }]} value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} />
            <Select label="" className="w-48" options={[{ value: 'all', label: 'All Classes' }, { value: '1-5', label: 'Class 1-5' }, { value: '6-8', label: 'Class 6-8' }, { value: '9-10', label: 'Class 9-10' }, { value: '11-12', label: 'Class 11-12' }]} value={classFilter} onChange={(e) => setClassFilter(e.target.value)} />
            <Select label="" className="w-48" options={[{ value: 'final', label: 'Final Exam' }, { value: 'mid', label: 'Mid-Term' }, { value: 'unit', label: 'Unit Tests' }]} value={examType} onChange={(e) => setExamType(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}><Download className="w-4 h-4 mr-2" />Export</Button>
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}><Upload className="w-4 h-4 mr-2" />Import</Button>
            <Button variant="outline" size="sm" onClick={handleCopyPrevYear} disabled={loading}><Copy className="w-4 h-4 mr-2" />Copy Previous</Button>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="general"><Settings className="w-4 h-4 mr-2" />General</TabsTrigger>
          <TabsTrigger value="classwise"><Layers className="w-4 h-4 mr-2" />Class-wise</TabsTrigger>
          <TabsTrigger value="grace"><Award className="w-4 h-4 mr-2" />Grace Marks</TabsTrigger>
          <TabsTrigger value="special"><Shield className="w-4 h-4 mr-2" />Special Cases</TabsTrigger>
          <TabsTrigger value="simulation"><Play className="w-4 h-4 mr-2" />Simulation</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="w-4 h-4 mr-2" />Notifications</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Section id="promotion" icon={TrendingUp} title="Promotion Criteria" subtitle="Rules for promoting students" color="green">
              <Input label="Minimum Overall %" type="number" value={settings.minOverallPercentage} onChange={(e) => updateSetting('minOverallPercentage', Number(e.target.value))} />
              <Input label="Maximum Failed Subjects" type="number" value={settings.maxFailedSubjects} onChange={(e) => updateSetting('maxFailedSubjects', Number(e.target.value))} />
              <Input label="Minimum Subjects to Pass" type="number" value={settings.minSubjectsToPass} onChange={(e) => updateSetting('minSubjectsToPass', Number(e.target.value))} />
              <Select label="Promotion Mode" options={[{ value: 'auto', label: 'Automatic' }, { value: 'manual', label: 'Manual' }, { value: 'hybrid', label: 'Hybrid' }]} value={settings.promotionMode} onChange={(e) => updateSetting('promotionMode', e.target.value)} />
              <Toggle label="Auto-promote All Pass" checked={settings.autoPromoteAllPass} onChange={(v) => updateSetting('autoPromoteAllPass', v)} />
              <Toggle label="Include Internal Assessment" checked={settings.includeInternalAssessment} onChange={(v) => updateSetting('includeInternalAssessment', v)} />
              {settings.includeInternalAssessment &&
              <div className="p-3 bg-gray-50 rounded-lg grid grid-cols-2 gap-3">
                  <Input label="Theory %" type="number" value={settings.theoryWeightage} onChange={(e) => updateSetting('theoryWeightage', Number(e.target.value))} size="sm" />
                  <Input label="Internal %" type="number" value={settings.internalWeightage} onChange={(e) => updateSetting('internalWeightage', Number(e.target.value))} size="sm" />
                </div>
              }
            </Section>

            <Section id="detention" icon={XCircle} title="Detention Criteria" subtitle="Rules for detaining students" color="red">
              <Input label="Detain if Failed More Than" type="number" value={settings.detainIfFailedMoreThan} onChange={(e) => updateSetting('detainIfFailedMoreThan', Number(e.target.value))} />
              <Input label="Detain if Overall Below %" type="number" value={settings.detainIfOverallBelow} onChange={(e) => updateSetting('detainIfOverallBelow', Number(e.target.value))} />
              <Toggle label="Attendance-based Detention" checked={settings.attendanceBasedDetention} onChange={(v) => updateSetting('attendanceBasedDetention', v)} />
              {settings.attendanceBasedDetention &&
              <div className="pl-6 space-y-4">
                  <Input label="Min Attendance %" type="number" value={settings.minAttendanceForPromotion} onChange={(e) => updateSetting('minAttendanceForPromotion', Number(e.target.value))} />
                  <Toggle label="Allow Medical Exemption" checked={settings.allowMedicalExemption} onChange={(v) => updateSetting('allowMedicalExemption', v)} />
                </div>
              }
              <Toggle label="Detain for Malpractice" checked={settings.detainForExamMalpractice} onChange={(v) => updateSetting('detainForExamMalpractice', v)} />
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <Toggle label="No-Detention Policy Override" checked={settings.noDetentionPolicyOverride} onChange={(v) => updateSetting('noDetentionPolicyOverride', v)} helperText="For Classes 1-8 as per RTE Act" />
              </div>
            </Section>

            <Section id="mandatory" icon={Award} title="Mandatory Subjects" subtitle="Compulsory subjects" color="purple">
              <Toggle label="Enforce Mandatory Subject Pass" checked={settings.enforceMandatorySubjectPass} onChange={(v) => updateSetting('enforceMandatorySubjectPass', v)} />
              <div className="grid grid-cols-2 gap-2">
                {['English', 'Mathematics', 'Science', 'Social Studies', 'Hindi', 'Regional Language'].map((sub) =>
                <label key={sub} className="flex items-center gap-2 p-2 bg-gray-50 rounded cursor-pointer">
                    <input type="checkbox" checked={settings.mandatorySubjects.includes(sub)} onChange={(e) => updateSetting('mandatorySubjects', e.target.checked ? [...settings.mandatorySubjects, sub] : settings.mandatorySubjects.filter((s) => s !== sub))} className="rounded" />
                    <span className="text-sm">{sub}</span>
                  </label>
                )}
              </div>
              <Input label="Min % in Mandatory" type="number" value={settings.minMandatoryPercentage} onChange={(e) => updateSetting('minMandatoryPercentage', Number(e.target.value))} />
              <Select label="On Failure" options={[{ value: 'detain', label: 'Direct Detention' }, { value: 'compartment', label: 'Compartment' }, { value: 'review', label: 'Manual Review' }]} value={settings.onMandatorySubjectFailure} onChange={(e) => updateSetting('onMandatorySubjectFailure', e.target.value)} />
            </Section>

            <Section id="attendance" icon={UserCheck} title="Attendance Rules" subtitle="Attendance requirements" color="blue">
              <Toggle label="Enable Attendance Criteria" checked={settings.enableAttendanceCriteria} onChange={(v) => updateSetting('enableAttendanceCriteria', v)} />
              <Select label="Calculation Period" options={[{ value: 'annual', label: 'Full Year' }, { value: 'term', label: 'Current Term' }, { value: 'semester', label: 'Semester' }]} value={settings.attendanceCalculationPeriod} onChange={(e) => updateSetting('attendanceCalculationPeriod', e.target.value)} />
              <Toggle label="Exclude Medical Leave" checked={settings.excludeMedicalLeave} onChange={(v) => updateSetting('excludeMedicalLeave', v)} />
              {settings.excludeMedicalLeave && <Input label="Max Medical Days" type="number" value={settings.maxMedicalLeaveDays} onChange={(e) => updateSetting('maxMedicalLeaveDays', Number(e.target.value))} />}
              <Select label="Shortage Action" options={[{ value: 'detain', label: 'Detention' }, { value: 'warning', label: 'Warning' }, { value: 'review', label: 'Manual Review' }, { value: 'ignore', label: 'Ignore' }]} value={settings.attendanceShortageAction} onChange={(e) => updateSetting('attendanceShortageAction', e.target.value)} />
            </Section>

            <Section id="compartment" icon={FileText} title="Compartment Rules" subtitle="Re-exam configurations" color="orange">
              <Toggle label="Allow Compartment Exam" checked={settings.allowCompartmentExam} onChange={(v) => updateSetting('allowCompartmentExam', v)} />
              <Input label="Max Subjects for Compartment" type="number" value={settings.maxCompartmentSubjects} onChange={(e) => updateSetting('maxCompartmentSubjects', Number(e.target.value))} />
              <Input label="Re-exam Window (Days)" type="number" value={settings.reExamWindowDays} onChange={(e) => updateSetting('reExamWindowDays', Number(e.target.value))} />
              <Input label="Min % in Re-exam" type="number" value={settings.minReExamPercentage} onChange={(e) => updateSetting('minReExamPercentage', Number(e.target.value))} />
              <Select label="Re-exam Type" options={[{ value: 'full', label: 'Full Syllabus' }, { value: 'partial', label: 'Failed Units' }, { value: 'assignment', label: 'Assignment' }]} value={settings.reExamType} onChange={(e) => updateSetting('reExamType', e.target.value)} />
              <Toggle label="Auto-promote on Pass" checked={settings.autoPromoteOnReExamPass} onChange={(v) => updateSetting('autoPromoteOnReExamPass', v)} />
              <div className="p-3 bg-orange-50 rounded-lg grid grid-cols-2 gap-3">
                <Input label="Fee per Subject (₹)" type="number" value={settings.reExamFeePerSubject} onChange={(e) => updateSetting('reExamFeePerSubject', Number(e.target.value))} size="sm" />
                <Select label="Collection" options={[{ value: 'before', label: 'Before Exam' }, { value: 'with-result', label: 'With Result' }]} value={settings.feeCollection} onChange={(e) => updateSetting('feeCollection', e.target.value)} />
              </div>
            </Section>

            <Section id="combined" icon={Scale} title="Combined Scoring" subtitle="Weighted criteria" color="teal">
              <Toggle label="Enable Combined Scoring" checked={settings.enableCombinedScoring} onChange={(v) => updateSetting('enableCombinedScoring', v)} />
              {settings.enableCombinedScoring &&
              <>
                  <div className="p-3 bg-teal-50 rounded-lg space-y-3">
                    <Input label="Academic %" type="number" value={settings.academicMarksWeightage} onChange={(e) => updateSetting('academicMarksWeightage', Number(e.target.value))} size="sm" />
                    <Input label="Attendance %" type="number" value={settings.attendanceWeightage} onChange={(e) => updateSetting('attendanceWeightage', Number(e.target.value))} size="sm" />
                    <Input label="Co-curricular %" type="number" value={settings.coCurricularWeightage} onChange={(e) => updateSetting('coCurricularWeightage', Number(e.target.value))} size="sm" />
                    <Input label="Discipline %" type="number" value={settings.disciplineWeightage} onChange={(e) => updateSetting('disciplineWeightage', Number(e.target.value))} size="sm" />
                    <p className="text-xs text-teal-700">Total: {settings.academicMarksWeightage + settings.attendanceWeightage + settings.coCurricularWeightage + settings.disciplineWeightage}%</p>
                  </div>
                  <Input label="Min Combined Score" type="number" value={settings.minCombinedScore} onChange={(e) => updateSetting('minCombinedScore', Number(e.target.value))} />
                </>
              }
            </Section>
          </div>
        </TabsContent>

        {/* Class-wise Tab */}
        <TabsContent value="classwise">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Class-wise Criteria</h3>
              <Button variant="outline" size="sm" onClick={() => {setCriteriaForm({ classRange: '', minOverallPercentage: 33, maxFailedSubjects: 2, minPassingSubjects: 4, mandatorySubjects: [], minMandatoryPercentage: 33, minAttendance: 75, graceMarksAllowed: true, maxGraceMarks: 5, compartmentAllowed: true, maxCompartmentSubjects: 2, isActive: true });setEditingId(null);openModal('ruleBuilder');}}><Plus className="w-4 h-4 mr-2" />Add</Button>
            </div>
            <Table>
              <TableHead><TableRow><TableHeader>Class</TableHeader><TableHeader>Min %</TableHeader><TableHeader>Max Failed</TableHeader><TableHeader>Mandatory</TableHeader><TableHeader>Attendance</TableHeader><TableHeader>Grace</TableHeader><TableHeader>Compartment</TableHeader><TableHeader>Status</TableHeader><TableHeader>Actions</TableHeader></TableRow></TableHead>
              <TableBody>
                {criteria.map((c) =>
                <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.classRange}</TableCell>
                    <TableCell>{c.minOverallPercentage}%</TableCell>
                    <TableCell>{c.maxFailedSubjects}</TableCell>
                    <TableCell><div className="flex gap-1">{c.mandatorySubjects.slice(0, 2).map((s) => <Badge key={s} variant="default" size="sm">{s}</Badge>)}{c.mandatorySubjects.length > 2 && <Badge size="sm">+{c.mandatorySubjects.length - 2}</Badge>}</div></TableCell>
                    <TableCell>{c.minAttendance}%</TableCell>
                    <TableCell>{c.graceMarksAllowed ? <span className="text-green-600">Up to {c.maxGraceMarks}</span> : '-'}</TableCell>
                    <TableCell>{c.compartmentAllowed ? <span className="text-blue-600">{c.maxCompartmentSubjects} subj</span> : '-'}</TableCell>
                    <TableCell><Badge variant={c.isActive ? 'success' : 'default'}>{c.isActive ? 'Active' : 'Inactive'}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => {setCriteriaForm({ ...c });setEditingId(c.id);openModal('ruleBuilder');}}><Edit2 className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => {setCriteria((prev) => [...prev, { ...c, id: generateId(), classRange: `${c.classRange} (Copy)` }]);}}><Copy className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => {setConfirmData({ type: 'deleteCriteria', id: c.id, message: `Delete ${c.classRange}?` });openModal('confirm');}}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>

          <Card className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Detention Rules</h3>
              <Button variant="outline" size="sm" onClick={() => {setRuleForm({ ruleName: '', condition: '', action: '', priority: detentionRules.length + 1, isActive: true });setEditingId(null);openModal('detentionRule');}}><Plus className="w-4 h-4 mr-2" />Add</Button>
            </div>
            <div className="space-y-3">
              {detentionRules.map((r) =>
              <div key={r.id} className={`p-4 border rounded-lg ${r.isActive ? 'bg-white' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold">{r.priority}</div>
                      <div><p className="font-medium">{r.ruleName}</p><p className="text-sm text-gray-500">{r.condition}</p></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={r.isActive ? 'success' : 'default'}>{r.isActive ? 'Active' : 'Inactive'}</Badge>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{r.action}</span>
                      <Button variant="ghost" size="sm" onClick={() => {setRuleForm({ ...r });setEditingId(r.id);openModal('detentionRule');}}><Edit2 className="w-4 h-4" /></Button>
                      <Toggle checked={r.isActive} onChange={() => {setDetentionRules((prev) => prev.map((x) => x.id === r.id ? { ...x, isActive: !x.isActive } : x));setHasChanges(true);}} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Grace Marks Tab */}
        <TabsContent value="grace">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div><h3 className="font-semibold">Grace Marks Configuration</h3><p className="text-sm text-gray-500">Configure grace marks for achievements</p></div>
              <Button variant="outline" size="sm" onClick={() => {setGraceForm({ category: '', criteria: '', maxMarks: 5, perSubject: 2, applicableTo: [], isActive: true });setEditingId(null);openModal('graceMarks');}}><Plus className="w-4 h-4 mr-2" />Add</Button>
            </div>
            <div className="space-y-4">
              {graceRules.map((r) =>
              <div key={r.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${r.category.includes('Sports') ? 'bg-green-100' : r.category.includes('Cultural') ? 'bg-purple-100' : r.category.includes('NCC') ? 'bg-blue-100' : r.category.includes('Medical') ? 'bg-red-100' : 'bg-orange-100'}`}>
                        {r.category.includes('Sports') ? <Activity className="w-5 h-5 text-green-600" /> : r.category.includes('Cultural') ? <Award className="w-5 h-5 text-purple-600" /> : r.category.includes('NCC') ? <Shield className="w-5 h-5 text-blue-600" /> : r.category.includes('Medical') ? <Heart className="w-5 h-5 text-red-600" /> : <Users className="w-5 h-5 text-orange-600" />}
                      </div>
                      <div>
                        <p className="font-medium">{r.category}</p>
                        <p className="text-sm text-gray-500">{r.criteria}</p>
                        <div className="flex gap-4 mt-2 text-xs text-gray-600">
                          <span>Max: <strong>{r.maxMarks}</strong></span>
                          <span>Per Subject: <strong>{r.perSubject}</strong></span>
                          {r.applicableTo.map((c) => <Badge key={c} size="sm">{c}</Badge>)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={r.isActive ? 'success' : 'default'}>{r.isActive ? 'Active' : 'Inactive'}</Badge>
                      <Button variant="ghost" size="sm" onClick={() => {setGraceForm({ ...r });setEditingId(r.id);openModal('graceMarks');}}><Edit2 className="w-4 h-4" /></Button>
                      <Toggle checked={r.isActive} onChange={() => {setGraceRules((prev) => prev.map((x) => x.id === r.id ? { ...x, isActive: !x.isActive } : x));setHasChanges(true);}} />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-3">Application Rules</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Toggle label="Apply Only to Borderline Cases" checked={graceAppSettings.applyOnlyToBorderlineCases} onChange={(v) => setGraceAppSettings((p) => ({ ...p, applyOnlyToBorderlineCases: v }))} />
                  <Toggle label="Apply to Mandatory Subjects" checked={graceAppSettings.applyToMandatorySubjects} onChange={(v) => setGraceAppSettings((p) => ({ ...p, applyToMandatorySubjects: v }))} />
                  <Toggle label="Cumulative Grace Allowed" checked={graceAppSettings.cumulativeGraceAllowed} onChange={(v) => setGraceAppSettings((p) => ({ ...p, cumulativeGraceAllowed: v }))} />
                </div>
                <div className="space-y-2">
                  <Input label="Max Total Grace" type="number" value={graceAppSettings.maxTotalGraceMarks} onChange={(e) => setGraceAppSettings((p) => ({ ...p, maxTotalGraceMarks: Number(e.target.value) }))} />
                  <Select label="Priority" options={[{ value: 'lowest', label: 'Lowest Scoring First' }, { value: 'failed', label: 'Failed First' }, { value: 'mandatory', label: 'Mandatory First' }]} value={graceAppSettings.graceApplicationPriority} onChange={(e) => setGraceAppSettings((p) => ({ ...p, graceApplicationPriority: e.target.value }))} />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Special Cases Tab */}
        <TabsContent value="special">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div><h3 className="font-semibold">Special Cases & Exemptions</h3><p className="text-sm text-gray-500">Handle exceptional circumstances</p></div>
              <Button variant="outline" size="sm" onClick={() => {setCaseForm({ caseType: '', description: '', exemptions: [], approvalRequired: true, documentRequired: true });setEditingId(null);openModal('specialCase');}}><Plus className="w-4 h-4 mr-2" />Add</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {specialCases.map((c) =>
              <div key={c.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-blue-500" /><h4 className="font-medium">{c.caseType}</h4></div>
                    <Button variant="ghost" size="sm" onClick={() => {setCaseForm({ ...c });setEditingId(c.id);openModal('specialCase');}}><Edit2 className="w-4 h-4" /></Button>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{c.description}</p>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-500">Exemptions:</p>
                    <div className="flex flex-wrap gap-1">{c.exemptions.map((e, i) => <Badge key={i} variant="info" size="sm">{e}</Badge>)}</div>
                  </div>
                  <div className="flex gap-4 mt-3 pt-3 border-t text-xs text-gray-600">
                    <span className="flex items-center gap-1">{c.approvalRequired ? <Lock className="w-4 h-4 text-orange-500" /> : <Unlock className="w-4 h-4 text-green-500" />}{c.approvalRequired ? 'Approval Required' : 'Auto-approved'}</span>
                    <span className="flex items-center gap-1">{c.documentRequired ? <FileCheck className="w-4 h-4 text-blue-500" /> : <FileText className="w-4 h-4 text-gray-400" />}{c.documentRequired ? 'Docs Required' : 'No Docs'}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-3"><Heart className="w-5 h-5 text-purple-600" /><h4 className="font-medium text-purple-900">PWD Settings</h4></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Toggle label="Extended Time" checked={pwdSettings.extendedTimeExemption} onChange={(v) => setPwdSettings((p) => ({ ...p, extendedTimeExemption: v }))} />
                  <Toggle label="Scribe Allowance" checked={pwdSettings.scribeAllowance} onChange={(v) => setPwdSettings((p) => ({ ...p, scribeAllowance: v }))} />
                  <Toggle label="Flexible Exam Mode" checked={pwdSettings.flexibleExaminationMode} onChange={(v) => setPwdSettings((p) => ({ ...p, flexibleExaminationMode: v }))} />
                </div>
                <div className="space-y-3">
                  <Input label="Grace Marks %" type="number" value={pwdSettings.graceMarksForPWD} onChange={(e) => setPwdSettings((p) => ({ ...p, graceMarksForPWD: Number(e.target.value) }))} />
                  <Select label="Attendance Exemption" options={[{ value: 'none', label: 'None' }, { value: 'partial', label: 'Partial (10%)' }, { value: 'full', label: 'Full' }]} value={pwdSettings.attendanceExemption} onChange={(e) => setPwdSettings((p) => ({ ...p, attendanceExemption: e.target.value }))} />
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-3"><Zap className="w-5 h-5 text-orange-600" /><h4 className="font-medium text-orange-900">Override Settings</h4></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Toggle label="Allow Principal Override" checked={overrideSettings.allowPrincipalOverride} onChange={(v) => setOverrideSettings((p) => ({ ...p, allowPrincipalOverride: v }))} />
                  <Toggle label="Allow Teacher Recommendation" checked={overrideSettings.allowTeacherRecommendation} onChange={(v) => setOverrideSettings((p) => ({ ...p, allowTeacherRecommendation: v }))} />
                </div>
                <div className="space-y-3">
                  <Toggle label="Require Justification" checked={overrideSettings.requireOverrideJustification} onChange={(v) => setOverrideSettings((p) => ({ ...p, requireOverrideJustification: v }))} />
                  <Toggle label="Audit Overrides" checked={overrideSettings.auditOverrideDecisions} onChange={(v) => setOverrideSettings((p) => ({ ...p, auditOverrideDecisions: v }))} />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Simulation Tab */}
        <TabsContent value="simulation">
          <Card className="bg-gradient-to-br from-indigo-50 to-blue-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-100 rounded-lg"><Play className="w-5 h-5 text-indigo-600" /></div>
              <div><h3 className="font-semibold">Promotion Simulator</h3><p className="text-sm text-gray-500">Test criteria against student data</p></div>
            </div>
            <div className="grid grid-cols-5 gap-4 mb-4">
              <Select label="Class" options={[{ value: 'all', label: 'All' }, ...Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: `Class ${i + 1}` }))]} value={simClass} onChange={(e) => setSimClass(e.target.value)} />
              <Select label="Section" options={[{ value: 'all', label: 'All' }, { value: 'A', label: 'A' }, { value: 'B', label: 'B' }, { value: 'C', label: 'C' }]} value={simSection} onChange={(e) => setSimSection(e.target.value)} />
              <Select label="Year" options={[{ value: '2024-25', label: '2024-25' }, { value: '2023-24', label: '2023-24' }]} value={simYear} onChange={(e) => setSimYear(e.target.value)} />
              <Select label="Exam" options={[{ value: 'final', label: 'Final' }, { value: 'mid', label: 'Mid-Term' }]} value={simExam} onChange={(e) => setSimExam(e.target.value)} />
              <div className="flex items-end"><Button variant="primary" className="w-full" onClick={runSimulation} disabled={simRunning}><Play className="w-4 h-4 mr-2" />{simRunning ? 'Running...' : 'Run'}</Button></div>
            </div>

            <div className="p-4 bg-white rounded-lg border mt-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold">Results - Class {simClass}</h4>
                <div className="flex items-center gap-2">
                  <Badge variant="info">{simResults.total} Students</Badge>
                  <Button variant="outline" size="sm" onClick={runSimulation} disabled={simRunning}><RefreshCw className={`w-4 h-4 mr-2 ${simRunning ? 'animate-spin' : ''}`} />Refresh</Button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-4">
                {[{ key: 'promoted', label: 'Promoted', color: 'green', icon: TrendingUp }, { key: 'detained', label: 'Detained', color: 'red', icon: XCircle }, { key: 'compartment', label: 'Compartment', color: 'orange', icon: FileText }, { key: 'pending', label: 'Pending', color: 'blue', icon: AlertCircle }].map(({ key, label, color, icon: Icon }) =>
                <div key={key} className={`p-4 bg-${color}-50 rounded-lg border border-${color}-200 cursor-pointer hover:bg-${color}-100`} onClick={() => setSimFilter(key)}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 bg-${color}-100 rounded-lg`}><Icon className={`w-5 h-5 text-${color}-600`} /></div>
                      <div><p className={`text-2xl font-bold text-${color}-700`}>{simResults[key as keyof typeof simResults]}</p><p className={`text-xs text-${color}-600`}>{label}</p></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 mb-4">
                <Select label="" className="w-48" options={[{ value: 'all', label: 'All Students' }, { value: 'promoted', label: 'Promoted' }, { value: 'detained', label: 'Detained' }, { value: 'compartment', label: 'Compartment' }, { value: 'pending', label: 'Pending' }]} value={simFilter} onChange={(e) => setSimFilter(e.target.value)} />
                <Button variant="ghost" size="sm" onClick={() => setSimFilter('all')}>Clear</Button>
              </div>

              <Table>
                <TableHead><TableRow><TableHeader>Roll</TableHeader><TableHeader>Name</TableHeader><TableHeader>Class</TableHeader><TableHeader>%</TableHeader><TableHeader>Attendance</TableHeader><TableHeader>Failed</TableHeader><TableHeader>Status</TableHeader><TableHeader>Reason</TableHeader><TableHeader>Action</TableHeader></TableRow></TableHead>
                <TableBody>
                  {filteredStudents.map((s) =>
                  <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.rollNo}</TableCell>
                      <TableCell>{s.name}</TableCell>
                      <TableCell>{s.class}-{s.section}</TableCell>
                      <TableCell><span className={`font-medium ${s.overallPercentage >= 60 ? 'text-green-600' : s.overallPercentage >= 35 ? 'text-orange-600' : 'text-red-600'}`}>{s.overallPercentage}%</span></TableCell>
                      <TableCell><span className={`font-medium ${s.attendance >= 75 ? 'text-green-600' : s.attendance >= 60 ? 'text-orange-600' : 'text-red-600'}`}>{s.attendance}%</span></TableCell>
                      <TableCell><span className={`font-medium ${s.failedSubjects === 0 ? 'text-green-600' : s.failedSubjects <= 2 ? 'text-orange-600' : 'text-red-600'}`}>{s.failedSubjects}</span></TableCell>
                      <TableCell>{getStatusBadge(s.status)}</TableCell>
                      <TableCell><span className="text-sm text-gray-600">{s.reason}</span></TableCell>
                      <TableCell><Button variant="ghost" size="sm" onClick={() => {setSelectedStudentId(s.id);openModal('studentDetail');}}><Eye className="w-4 h-4" /></Button></TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <div className="flex justify-between mt-4">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={exportToCSV}><Download className="w-4 h-4 mr-2" />Export</Button>
                  <Button variant="outline" size="sm" onClick={printReport}><Printer className="w-4 h-4 mr-2" />Print</Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openModal('detailedReport')}><FileText className="w-4 h-4 mr-2" />Detailed Report</Button>
                  <Button variant="primary" size="sm" onClick={() => {setConfirmData({ type: 'applyPromotion', id: '', message: `Apply promotion for Class ${simClass}?` });openModal('confirm');}}><CheckCircle className="w-4 h-4 mr-2" />Apply</Button>
                </div>
              </div>
            </div>
          </Card>

          {/* What-If */}
          <Card className="mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg"><BarChart3 className="w-5 h-5 text-purple-600" /></div>
              <div><h3 className="font-semibold">What-If Analysis</h3><p className="text-sm text-gray-500">Test criteria changes</p></div>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-4">
                <Input label={`Min % (Current: ${settings.minOverallPercentage}%)`} type="number" value={whatIfParams.minPercentage} onChange={(e) => setWhatIfParams((p) => ({ ...p, minPercentage: Number(e.target.value) }))} />
                <Input label={`Max Failed (Current: ${settings.maxFailedSubjects})`} type="number" value={whatIfParams.maxFailedSubjects} onChange={(e) => setWhatIfParams((p) => ({ ...p, maxFailedSubjects: Number(e.target.value) }))} />
                <Input label={`Min Attendance (Current: ${settings.minAttendanceForPromotion}%)`} type="number" value={whatIfParams.minAttendance} onChange={(e) => setWhatIfParams((p) => ({ ...p, minAttendance: Number(e.target.value) }))} />
                <Button variant="outline" className="w-full" onClick={runWhatIf}><Play className="w-4 h-4 mr-2" />Simulate</Button>
              </div>
              <div className="col-span-2 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-4">Impact Preview</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg bg-white">
                    <p className="text-sm text-gray-600 mb-2">Current</p>
                    <div className="space-y-2">
                      <div className="flex justify-between"><span>Promoted:</span><span className="font-medium text-green-600">{whatIfResults?.current.promoted ?? simResults.promoted}</span></div>
                      <div className="flex justify-between"><span>Detained:</span><span className="font-medium text-red-600">{whatIfResults?.current.detained ?? simResults.detained}</span></div>
                      <div className="flex justify-between"><span>Compartment:</span><span className="font-medium text-orange-600">{whatIfResults?.current.compartment ?? simResults.compartment}</span></div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg bg-white">
                    <p className="text-sm text-gray-600 mb-2">Projected</p>
                    {whatIfResults ?
                    <div className="space-y-2">
                        <div className="flex justify-between"><span>Promoted:</span><span className="font-medium text-green-600">{whatIfResults.projected.promoted} {whatIfResults.projected.promoted !== whatIfResults.current.promoted && <span className={`text-xs ${whatIfResults.projected.promoted < whatIfResults.current.promoted ? 'text-red-500' : 'text-green-500'}`}>({whatIfResults.projected.promoted > whatIfResults.current.promoted ? '+' : ''}{whatIfResults.projected.promoted - whatIfResults.current.promoted})</span>}</span></div>
                        <div className="flex justify-between"><span>Detained:</span><span className="font-medium text-red-600">{whatIfResults.projected.detained} {whatIfResults.projected.detained !== whatIfResults.current.detained && <span className={`text-xs ${whatIfResults.projected.detained > whatIfResults.current.detained ? 'text-red-500' : 'text-green-500'}`}>({whatIfResults.projected.detained > whatIfResults.current.detained ? '+' : ''}{whatIfResults.projected.detained - whatIfResults.current.detained})</span>}</span></div>
                        <div className="flex justify-between"><span>Compartment:</span><span className="font-medium text-orange-600">{whatIfResults.projected.compartment}</span></div>
                      </div> :
                    <p className="text-sm text-gray-400">Run simulation</p>}
                  </div>
                </div>
                {whatIfResults && whatIfResults.projected.promoted !== whatIfResults.current.promoted &&
                <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <p className="text-sm text-yellow-800">{whatIfResults.projected.promoted < whatIfResults.current.promoted ? `${whatIfResults.current.promoted - whatIfResults.projected.promoted} fewer students would be promoted` : `${whatIfResults.projected.promoted - whatIfResults.current.promoted} more students would be promoted`}</p>
                  </div>
                }
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-blue-100 rounded-lg"><Bell className="w-5 h-5 text-blue-600" /></div><h3 className="font-semibold">Auto Notifications</h3></div>
              <div className="space-y-4">
                <Toggle label="Notify Parents on Detention" checked={notifSettings.notifyParentsOnDetention} onChange={(v) => setNotifSettings((p) => ({ ...p, notifyParentsOnDetention: v }))} />
                <Toggle label="Notify Parents on Compartment" checked={notifSettings.notifyParentsOnCompartment} onChange={(v) => setNotifSettings((p) => ({ ...p, notifyParentsOnCompartment: v }))} />
                <Toggle label="Notify Class Teachers" checked={notifSettings.notifyClassTeachers} onChange={(v) => setNotifSettings((p) => ({ ...p, notifyClassTeachers: v }))} />
                <Toggle label="Notify Principal" checked={notifSettings.notifyPrincipal} onChange={(v) => setNotifSettings((p) => ({ ...p, notifyPrincipal: v }))} />
                <Toggle label="Warning Before Detention" checked={notifSettings.warningBeforeDetention} onChange={(v) => setNotifSettings((p) => ({ ...p, warningBeforeDetention: v }))} />
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3"><div className="p-2 bg-green-100 rounded-lg"><Mail className="w-5 h-5 text-green-600" /></div><h3 className="font-semibold">Templates</h3></div>
                <Button variant="outline" size="sm" onClick={() => {setTemplateForm({ name: '', type: 'SMS', status: 'draft', subject: '', body: '' });setEditingId(null);openModal('template');}}><Plus className="w-4 h-4 mr-2" />Add</Button>
              </div>
              <div className="space-y-3">
                {templates.map((t) =>
                <div key={t.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div><p className="font-medium">{t.name}</p><p className="text-xs text-gray-500">{t.type}</p></div>
                    <div className="flex items-center gap-2">
                      <Badge variant={t.status === 'active' ? 'success' : 'default'}>{t.status}</Badge>
                      <Button variant="ghost" size="sm" onClick={() => {setTemplateForm({ ...t });setEditingId(t.id);openModal('template');}}><Edit2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-purple-100 rounded-lg"><GraduationCap className="w-5 h-5 text-purple-600" /></div><h3 className="font-semibold">Timing Settings</h3></div>
              <div className="space-y-4">
                <Input label="Days before result warning" type="number" value={notifSettings.daysBeforeResultWarning} onChange={(e) => setNotifSettings((p) => ({ ...p, daysBeforeResultWarning: Number(e.target.value) }))} />
                <Input label="Reminder before compartment (days)" type="number" value={notifSettings.reminderBeforeCompartment} onChange={(e) => setNotifSettings((p) => ({ ...p, reminderBeforeCompartment: Number(e.target.value) }))} />
                <Input label="Follow-up after detention (days)" type="number" value={notifSettings.followUpAfterDetention} onChange={(e) => setNotifSettings((p) => ({ ...p, followUpAfterDetention: Number(e.target.value) }))} />
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-orange-100 rounded-lg"><FileText className="w-5 h-5 text-orange-600" /></div><h3 className="font-semibold">Certificate Settings</h3></div>
              <div className="space-y-4">
                <Toggle label="Auto-generate Promotion Certificate" checked={notifSettings.autoGeneratePromotionCertificate} onChange={(v) => setNotifSettings((p) => ({ ...p, autoGeneratePromotionCertificate: v }))} />
                <Toggle label="Auto-generate TC for Detained (Class 12)" checked={notifSettings.autoGenerateTCForDetained} onChange={(v) => setNotifSettings((p) => ({ ...p, autoGenerateTCForDetained: v }))} />
                <Toggle label="Include Result Analysis" checked={notifSettings.includeResultAnalysis} onChange={(v) => setNotifSettings((p) => ({ ...p, includeResultAnalysis: v }))} />
                <Toggle label="Include Attendance Report" checked={notifSettings.includeAttendanceReport} onChange={(v) => setNotifSettings((p) => ({ ...p, includeAttendanceReport: v }))} />
                <Select label="Report Card Format" options={[{ value: 'cbse', label: 'CBSE' }, { value: 'state', label: 'State Board' }, { value: 'custom', label: 'Custom' }]} value={notifSettings.reportCardFormat} onChange={(e) => setNotifSettings((p) => ({ ...p, reportCardFormat: e.target.value }))} />
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <Modal isOpen={modals.history} onClose={() => closeModal('history')} title="Criteria History" size="lg">
        <div className="space-y-4">
          <div className="flex gap-4">
            <Select label="" className="w-48" options={[{ value: 'all', label: 'All Changes' }, { value: 'promotion', label: 'Promotion' }, { value: 'detention', label: 'Detention' }, { value: 'grace', label: 'Grace' }]} value={historyFilter} onChange={(e) => setHistoryFilter(e.target.value)} />
            <Input label="" placeholder="Search..." className="flex-1" value={historySearch} onChange={(e) => setHistorySearch(e.target.value)} />
          </div>
          <div className="border rounded-lg divide-y max-h-96 overflow-y-auto">
            {filteredHistory.map((h) =>
            <div key={h.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{h.field}</p>
                    <div className="flex items-center gap-2 mt-1"><span className="text-sm text-red-600 line-through">{h.oldValue}</span><ArrowRight className="w-4 h-4 text-gray-400" /><span className="text-sm text-green-600 font-medium">{h.newValue}</span></div>
                    <p className="text-xs text-gray-500 mt-1">Reason: {h.reason}</p>
                  </div>
                  <div className="text-right"><p className="text-sm text-gray-600">{h.changedBy}</p><p className="text-xs text-gray-400">{h.changedAt}</p></div>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => closeModal('history')}>Close</Button>
            <Button variant="outline" onClick={exportHistory}><Download className="w-4 h-4 mr-2" />Export</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={modals.preview} onClose={() => closeModal('preview')} title="Affected Students" size="xl">
        <div className="space-y-4">
          <div className="flex gap-4">
            <Select label="" className="w-48" options={[{ value: 'all', label: 'All' }, { value: 'detained', label: 'Detained' }, { value: 'compartment', label: 'Compartment' }, { value: 'pending', label: 'Pending' }]} value={previewFilter} onChange={(e) => setPreviewFilter(e.target.value)} />
            <Input label="" placeholder="Search..." className="flex-1" value={previewSearch} onChange={(e) => setPreviewSearch(e.target.value)} />
          </div>
          <Table>
            <TableHead><TableRow><TableHeader>Roll</TableHeader><TableHeader>Name</TableHeader><TableHeader>Class</TableHeader><TableHeader>%</TableHeader><TableHeader>Attendance</TableHeader><TableHeader>Status</TableHeader></TableRow></TableHead>
            <TableBody>
              {filteredPreview.map((s) =>
              <TableRow key={s.id}>
                  <TableCell>{s.rollNo}</TableCell>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.class}-{s.section}</TableCell>
                  <TableCell>{s.overallPercentage}%</TableCell>
                  <TableCell>{s.attendance}%</TableCell>
                  <TableCell>{getStatusBadge(s.status)}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => closeModal('preview')}>Close</Button>
            <Button variant="outline" onClick={() => {const csv = [['Roll', 'Name', 'Class', '%', 'Attendance', 'Status'].join(','), ...filteredPreview.map((s) => [s.rollNo, s.name, `${s.class}-${s.section}`, s.overallPercentage, s.attendance, s.status].join(','))].join('\n');const a = document.createElement('a');a.href = URL.createObjectURL(new Blob([csv]));a.download = 'affected-students.csv';a.click();}}><Download className="w-4 h-4 mr-2" />Export</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={modals.ruleBuilder} onClose={() => {closeModal('ruleBuilder');setCriteriaForm({});setEditingId(null);}} title={editingId ? 'Edit Class Rule' : 'Add Class Rule'} size="lg">
        <div className="space-y-4">
          <Input label="Class Range" value={criteriaForm.classRange || ''} onChange={(e) => setCriteriaForm((p) => ({ ...p, classRange: e.target.value }))} placeholder="e.g., Class 1-5 (Primary)" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Min Overall %" type="number" value={criteriaForm.minOverallPercentage || 33} onChange={(e) => setCriteriaForm((p) => ({ ...p, minOverallPercentage: Number(e.target.value) }))} />
            <Input label="Max Failed Subjects" type="number" value={criteriaForm.maxFailedSubjects || 2} onChange={(e) => setCriteriaForm((p) => ({ ...p, maxFailedSubjects: Number(e.target.value) }))} />
            <Input label="Min Subjects to Pass" type="number" value={criteriaForm.minPassingSubjects || 4} onChange={(e) => setCriteriaForm((p) => ({ ...p, minPassingSubjects: Number(e.target.value) }))} />
            <Input label="Min Attendance %" type="number" value={criteriaForm.minAttendance || 75} onChange={(e) => setCriteriaForm((p) => ({ ...p, minAttendance: Number(e.target.value) }))} />
            <Input label="Min Mandatory %" type="number" value={criteriaForm.minMandatoryPercentage || 33} onChange={(e) => setCriteriaForm((p) => ({ ...p, minMandatoryPercentage: Number(e.target.value) }))} />
            <Input label="Max Grace Marks" type="number" value={criteriaForm.maxGraceMarks || 5} onChange={(e) => setCriteriaForm((p) => ({ ...p, maxGraceMarks: Number(e.target.value) }))} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {['English', 'Mathematics', 'Science', 'Social Studies', 'Hindi'].map((sub) =>
            <label key={sub} className="flex items-center gap-2 p-2 bg-gray-50 rounded cursor-pointer">
                <input type="checkbox" checked={(criteriaForm.mandatorySubjects || []).includes(sub)} onChange={(e) => setCriteriaForm((p) => ({ ...p, mandatorySubjects: e.target.checked ? [...(p.mandatorySubjects || []), sub] : (p.mandatorySubjects || []).filter((s) => s !== sub) }))} className="rounded" />
                <span className="text-sm">{sub}</span>
              </label>
            )}
          </div>
          <div className="flex gap-4">
            <Toggle label="Grace Marks Allowed" checked={criteriaForm.graceMarksAllowed ?? true} onChange={(v) => setCriteriaForm((p) => ({ ...p, graceMarksAllowed: v }))} />
            <Toggle label="Compartment Allowed" checked={criteriaForm.compartmentAllowed ?? true} onChange={(v) => setCriteriaForm((p) => ({ ...p, compartmentAllowed: v }))} />
            <Toggle label="Active" checked={criteriaForm.isActive ?? true} onChange={(v) => setCriteriaForm((p) => ({ ...p, isActive: v }))} />
          </div>
          {criteriaForm.compartmentAllowed && <Input label="Max Compartment Subjects" type="number" value={criteriaForm.maxCompartmentSubjects || 2} onChange={(e) => setCriteriaForm((p) => ({ ...p, maxCompartmentSubjects: Number(e.target.value) }))} />}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {closeModal('ruleBuilder');setCriteriaForm({});setEditingId(null);}}>Cancel</Button>
            <Button variant="primary" onClick={saveCriteria}>Save</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={modals.detentionRule} onClose={() => {closeModal('detentionRule');setRuleForm({});setEditingId(null);}} title={editingId ? 'Edit Rule' : 'Add Rule'}>
        <div className="space-y-4">
          <Input label="Rule Name" value={ruleForm.ruleName || ''} onChange={(e) => setRuleForm((p) => ({ ...p, ruleName: e.target.value }))} />
          <Input label="Condition" value={ruleForm.condition || ''} onChange={(e) => setRuleForm((p) => ({ ...p, condition: e.target.value }))} />
          <Input label="Action" value={ruleForm.action || ''} onChange={(e) => setRuleForm((p) => ({ ...p, action: e.target.value }))} />
          <Input label="Priority" type="number" value={ruleForm.priority || 1} onChange={(e) => setRuleForm((p) => ({ ...p, priority: Number(e.target.value) }))} />
          <Toggle label="Active" checked={ruleForm.isActive ?? true} onChange={(v) => setRuleForm((p) => ({ ...p, isActive: v }))} />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {closeModal('detentionRule');setRuleForm({});setEditingId(null);}}>Cancel</Button>
            <Button variant="primary" onClick={saveDetentionRule}>Save</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={modals.graceMarks} onClose={() => {closeModal('graceMarks');setGraceForm({});setEditingId(null);}} title={editingId ? 'Edit Grace Category' : 'Add Grace Category'}>
        <div className="space-y-4">
          <Input label="Category" value={graceForm.category || ''} onChange={(e) => setGraceForm((p) => ({ ...p, category: e.target.value }))} />
          <Input label="Criteria" value={graceForm.criteria || ''} onChange={(e) => setGraceForm((p) => ({ ...p, criteria: e.target.value }))} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Max Marks" type="number" value={graceForm.maxMarks || 5} onChange={(e) => setGraceForm((p) => ({ ...p, maxMarks: Number(e.target.value) }))} />
            <Input label="Per Subject" type="number" value={graceForm.perSubject || 2} onChange={(e) => setGraceForm((p) => ({ ...p, perSubject: Number(e.target.value) }))} />
          </div>
          <div>
            <label className="text-sm font-medium">Applicable To</label>
            <div className="flex gap-2 mt-1">
              <Input value={newApplicable} onChange={(e) => setNewApplicable(e.target.value)} placeholder="e.g., Class 6-12" />
              <Button variant="outline" onClick={() => {if (newApplicable.trim()) {setGraceForm((p) => ({ ...p, applicableTo: [...(p.applicableTo || []), newApplicable.trim()] }));setNewApplicable('');}}}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">{(graceForm.applicableTo || []).map((a, i) => <Badge key={i} variant="info" className="cursor-pointer" onClick={() => setGraceForm((p) => ({ ...p, applicableTo: (p.applicableTo || []).filter((_, idx) => idx !== i) }))}>{a} ×</Badge>)}</div>
          </div>
          <Toggle label="Active" checked={graceForm.isActive ?? true} onChange={(v) => setGraceForm((p) => ({ ...p, isActive: v }))} />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {closeModal('graceMarks');setGraceForm({});setEditingId(null);}}>Cancel</Button>
            <Button variant="primary" onClick={saveGraceRule}>Save</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={modals.specialCase} onClose={() => {closeModal('specialCase');setCaseForm({});setEditingId(null);}} title={editingId ? 'Edit Case' : 'Add Case'}>
        <div className="space-y-4">
          <Input label="Case Type" value={caseForm.caseType || ''} onChange={(e) => setCaseForm((p) => ({ ...p, caseType: e.target.value }))} />
          <Input label="Description" value={caseForm.description || ''} onChange={(e) => setCaseForm((p) => ({ ...p, description: e.target.value }))} />
          <div>
            <label className="text-sm font-medium">Exemptions</label>
            <div className="flex gap-2 mt-1">
              <Input value={newExemption} onChange={(e) => setNewExemption(e.target.value)} placeholder="Add exemption" />
              <Button variant="outline" onClick={() => {if (newExemption.trim()) {setCaseForm((p) => ({ ...p, exemptions: [...(p.exemptions || []), newExemption.trim()] }));setNewExemption('');}}}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">{(caseForm.exemptions || []).map((e, i) => <Badge key={i} variant="info" className="cursor-pointer" onClick={() => setCaseForm((p) => ({ ...p, exemptions: (p.exemptions || []).filter((_, idx) => idx !== i) }))}>{e} ×</Badge>)}</div>
          </div>
          <div className="flex gap-4">
            <Toggle label="Approval Required" checked={caseForm.approvalRequired ?? true} onChange={(v) => setCaseForm((p) => ({ ...p, approvalRequired: v }))} />
            <Toggle label="Document Required" checked={caseForm.documentRequired ?? true} onChange={(v) => setCaseForm((p) => ({ ...p, documentRequired: v }))} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {closeModal('specialCase');setCaseForm({});setEditingId(null);}}>Cancel</Button>
            <Button variant="primary" onClick={saveSpecialCase}>Save</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={modals.template} onClose={() => {closeModal('template');setTemplateForm({});setEditingId(null);}} title={editingId ? 'Edit Template' : 'Add Template'}>
        <div className="space-y-4">
          <Input label="Name" value={templateForm.name || ''} onChange={(e) => setTemplateForm((p) => ({ ...p, name: e.target.value }))} />
          <Select label="Type" options={[{ value: 'SMS', label: 'SMS' }, { value: 'Email', label: 'Email' }, { value: 'SMS + Email', label: 'SMS + Email' }]} value={templateForm.type || 'SMS'} onChange={(e) => setTemplateForm((p) => ({ ...p, type: e.target.value }))} />
          <Select label="Status" options={[{ value: 'draft', label: 'Draft' }, { value: 'active', label: 'Active' }]} value={templateForm.status || 'draft'} onChange={(e) => setTemplateForm((p) => ({ ...p, status: e.target.value as 'active' | 'draft' }))} />
          <Input label="Subject" value={templateForm.subject || ''} onChange={(e) => setTemplateForm((p) => ({ ...p, subject: e.target.value }))} />
          <div><label className="text-sm font-medium">Body</label><textarea className="w-full mt-1 p-2 border rounded-lg" rows={4} value={templateForm.body || ''} onChange={(e) => setTemplateForm((p) => ({ ...p, body: e.target.value }))} /></div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {closeModal('template');setTemplateForm({});setEditingId(null);}}>Cancel</Button>
            <Button variant="primary" onClick={saveTemplate}>Save</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={modals.confirm} onClose={() => {closeModal('confirm');setConfirmData(null);}} title="Confirm Action">
        <div className="space-y-4">
          <p>{confirmData?.message}</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {closeModal('confirm');setConfirmData(null);}}>Cancel</Button>
            <Button variant="primary" onClick={confirmAction}>Confirm</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={modals.studentDetail} onClose={() => {closeModal('studentDetail');setSelectedStudentId(null);}} title="Student Details" size="lg">
        {selectedStudent &&
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-sm text-gray-500">Roll No</p><p className="font-medium">{selectedStudent.rollNo}</p></div>
              <div><p className="text-sm text-gray-500">Name</p><p className="font-medium">{selectedStudent.name}</p></div>
              <div><p className="text-sm text-gray-500">Class/Section</p><p className="font-medium">{selectedStudent.class}-{selectedStudent.section}</p></div>
              <div><p className="text-sm text-gray-500">Overall %</p><p className="font-medium">{selectedStudent.overallPercentage}%</p></div>
              <div><p className="text-sm text-gray-500">Attendance</p><p className="font-medium">{selectedStudent.attendance}%</p></div>
              <div><p className="text-sm text-gray-500">Failed Subjects</p><p className="font-medium">{selectedStudent.failedSubjects}</p></div>
              <div><p className="text-sm text-gray-500">Status</p>{getStatusBadge(selectedStudent.status)}</div>
              <div><p className="text-sm text-gray-500">Mandatory Failed</p><p className="font-medium">{selectedStudent.mandatoryFailed.length > 0 ? selectedStudent.mandatoryFailed.join(', ') : 'None'}</p></div>
            </div>
            <div><p className="text-sm text-gray-500">Reason</p><p className="font-medium">{selectedStudent.reason}</p></div>
            <div className="flex justify-end"><Button variant="outline" onClick={() => {closeModal('studentDetail');setSelectedStudentId(null);}}>Close</Button></div>
          </div>
        }
      </Modal>

      <Modal isOpen={modals.detailedReport} onClose={() => closeModal('detailedReport')} title="Detailed Report" size="lg">
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3">Summary - Class {simClass}</h4>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div><p className="text-2xl font-bold text-green-600">{simResults.promoted}</p><p className="text-sm text-gray-500">Promoted</p></div>
              <div><p className="text-2xl font-bold text-red-600">{simResults.detained}</p><p className="text-sm text-gray-500">Detained</p></div>
              <div><p className="text-2xl font-bold text-orange-600">{simResults.compartment}</p><p className="text-sm text-gray-500">Compartment</p></div>
              <div><p className="text-2xl font-bold text-blue-600">{simResults.pending}</p><p className="text-sm text-gray-500">Pending</p></div>
            </div>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-3">Criteria Applied</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p>Min Overall: <strong>{settings.minOverallPercentage}%</strong></p>
              <p>Max Failed: <strong>{settings.maxFailedSubjects}</strong></p>
              <p>Min Attendance: <strong>{settings.minAttendanceForPromotion}%</strong></p>
              <p>Mandatory Subjects: <strong>{settings.mandatorySubjects.length}</strong></p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => closeModal('detailedReport')}>Close</Button>
            <Button variant="outline" onClick={printReport}><Printer className="w-4 h-4 mr-2" />Print</Button>
            <Button variant="outline" onClick={exportToCSV}><Download className="w-4 h-4 mr-2" />Export</Button>
          </div>
        </div>
      </Modal>
    </div>);

}