// File: src/pages/admin/settings/StudentRules.tsx

import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Toggle } from '../../../components/ui/Toggle';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Save, RotateCcw, Edit2, Users, Calendar, RefreshCw, Plus, Trash2, Clock, CheckCircle, XCircle, Copy, FileText, AlertTriangle, DollarSign, UserCheck, ClipboardCheck } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================
interface AgeRequirement {
  id: string;
  className: string;
  minAgeYears: number;
  minAgeMonths: number;
  maxAgeYears: number;
  maxAgeMonths: number;
  ageAsOnDate: string;
  educationBoard: string;
  branch: string;
  academicYear: string;
  isActive: boolean;
}

interface CapacityLimit {
  id: string;
  className: string;
  section: string;
  maxCapacity: number;
  currentEnrollment: number;
  waitlistLimit: number;
  branch: string;
  academicYear: string;
  isActive: boolean;
}

interface AttendancePolicy {
  id: string;
  className: string;
  minAttendancePercentage: number;
  warningThreshold: number;
  criticalThreshold: number;
  autoNotifyParents: boolean;
  blockExamBelow: number;
  graceAbsenceDays: number;
  branch: string;
  isActive: boolean;
}

interface AttendanceSettings {
  trackingMode: string;
  allowHalfDay: boolean;
  halfDayThresholdHours: number;
  lateArrivalGraceMinutes: number;
  markLateAsAbsent: boolean;
  lateCountForAbsent: number;
  requireParentNotification: boolean;
  allowLeaveApplication: boolean;
  maxConsecutiveLeaveDays: number;
  requireMedicalCertificate: boolean;
  medicalCertificateAfterDays: number;
  countHolidaysInLeave: boolean;
  autoDeductFromAllowedLeaves: boolean;
}

interface ReadmissionFeeCategory {
  id: string;
  category: string;
  feeAmount: number;
  description: string;
  isActive: boolean;
}

interface ReadmissionDocument {
  id: string;
  documentName: string;
  isMandatory: boolean;
  description: string;
  isActive: boolean;
}

interface ReadmissionRules {
  // Basic Settings
  allowReadmission: boolean;
  maxGapYears: number;
  minGapMonths: number;
  blacklistPeriodMonths: number;

  // Eligibility Criteria
  requirePreviousRecords: boolean;
  requireTCVerification: boolean;
  requireClearanceFromPreviousSchool: boolean;
  requireNoDuesFromPreviousSession: boolean;
  checkPreviousConductRecord: boolean;
  conductGradeMinimum: string;
  checkPreviousAcademicRecord: boolean;
  academicGradeMinimum: string;

  // Approval & Interview
  approvalRequired: boolean;
  approvalLevels: string[];
  conductInterviewBeforeReadmission: boolean;
  interviewPanelMembers: number;
  conductEntranceTest: boolean;
  entranceTestSubjects: string[];

  // Student Data Handling
  restorePreviousId: boolean;
  restoreAcademicHistory: boolean;
  restoreAttendanceHistory: boolean;
  restoreFeeHistory: boolean;
  createNewAdmissionNumber: boolean;

  // Class Placement
  allowSameClass: boolean;
  allowLowerClass: boolean;
  allowHigherClass: boolean;
  requirePlacementTest: boolean;

  // Priority & Special Cases
  giveAdmissionPriority: boolean;
  priorityOverNewAdmissions: boolean;
  siblingPriorityForReadmission: boolean;
  allowMedicalCaseException: boolean;
  allowTransferCaseException: boolean;

  // Fee Settings
  applyReadmissionFee: boolean;
  allowPartialFeeWaiver: boolean;
  maxWaiverPercentage: number;
  waiverApprovalRequired: boolean;
  clearPreviousDues: boolean;
  allowDuesInstallment: boolean;
  maxDuesInstallments: number;

  // Timeline Settings
  applicationWindowStartMonths: number;
  applicationWindowEndMonths: number;
  processingDays: number;
  maxPendingDays: number;

  // Notifications
  notifyOnApplication: boolean;
  notifyOnApproval: boolean;
  notifyOnRejection: boolean;
  notificationModes: string[];
}

// ============================================================================
// INITIAL DATA
// ============================================================================
const CLASSES = ['Nursery', 'LKG', 'UKG', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
const SECTIONS = ['A', 'B', 'C', 'D', 'E'];
const BRANCHES = ['All', 'Main Campus', 'North Branch', 'South Branch', 'City Center'];
const BOARDS = ['CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge'];
const ACADEMIC_YEARS = ['2024-2025', '2025-2026', '2023-2024'];
const CONDUCT_GRADES = ['A+', 'A', 'B+', 'B', 'C', 'D'];
const APPROVAL_LEVELS = ['Class Teacher', 'Section Head', 'Vice Principal', 'Principal', 'Director', 'Management'];

const initialAgeRequirements: AgeRequirement[] = [
{ id: '1', className: 'Nursery', minAgeYears: 2, minAgeMonths: 6, maxAgeYears: 4, maxAgeMonths: 0, ageAsOnDate: '1 June', educationBoard: 'CBSE', branch: 'All', academicYear: '2024-2025', isActive: true },
{ id: '2', className: 'LKG', minAgeYears: 3, minAgeMonths: 6, maxAgeYears: 5, maxAgeMonths: 0, ageAsOnDate: '1 June', educationBoard: 'CBSE', branch: 'All', academicYear: '2024-2025', isActive: true },
{ id: '3', className: 'UKG', minAgeYears: 4, minAgeMonths: 6, maxAgeYears: 6, maxAgeMonths: 0, ageAsOnDate: '1 June', educationBoard: 'CBSE', branch: 'All', academicYear: '2024-2025', isActive: true },
{ id: '4', className: 'Grade 1', minAgeYears: 5, minAgeMonths: 6, maxAgeYears: 7, maxAgeMonths: 0, ageAsOnDate: '1 June', educationBoard: 'CBSE', branch: 'All', academicYear: '2024-2025', isActive: true },
{ id: '5', className: 'Grade 5', minAgeYears: 9, minAgeMonths: 6, maxAgeYears: 11, maxAgeMonths: 0, ageAsOnDate: '1 June', educationBoard: 'CBSE', branch: 'All', academicYear: '2024-2025', isActive: true },
{ id: '6', className: 'Grade 10', minAgeYears: 14, minAgeMonths: 6, maxAgeYears: 16, maxAgeMonths: 0, ageAsOnDate: '1 June', educationBoard: 'CBSE', branch: 'All', academicYear: '2024-2025', isActive: true }];


const initialCapacityLimits: CapacityLimit[] = [
{ id: '1', className: 'Nursery', section: 'A', maxCapacity: 30, currentEnrollment: 28, waitlistLimit: 5, branch: 'Main Campus', academicYear: '2024-2025', isActive: true },
{ id: '2', className: 'Nursery', section: 'B', maxCapacity: 30, currentEnrollment: 30, waitlistLimit: 5, branch: 'Main Campus', academicYear: '2024-2025', isActive: true },
{ id: '3', className: 'Grade 1', section: 'A', maxCapacity: 40, currentEnrollment: 38, waitlistLimit: 10, branch: 'Main Campus', academicYear: '2024-2025', isActive: true },
{ id: '4', className: 'Grade 1', section: 'B', maxCapacity: 40, currentEnrollment: 40, waitlistLimit: 10, branch: 'Main Campus', academicYear: '2024-2025', isActive: true },
{ id: '5', className: 'Grade 10', section: 'A', maxCapacity: 50, currentEnrollment: 48, waitlistLimit: 15, branch: 'Main Campus', academicYear: '2024-2025', isActive: true }];


const initialAttendancePolicies: AttendancePolicy[] = [
{ id: '1', className: 'All Classes', minAttendancePercentage: 75, warningThreshold: 80, criticalThreshold: 70, autoNotifyParents: true, blockExamBelow: 65, graceAbsenceDays: 5, branch: 'All', isActive: true },
{ id: '2', className: 'Grade 10', minAttendancePercentage: 80, warningThreshold: 85, criticalThreshold: 75, autoNotifyParents: true, blockExamBelow: 70, graceAbsenceDays: 3, branch: 'All', isActive: true }];


const initialAttendanceSettings: AttendanceSettings = {
  trackingMode: 'daily', allowHalfDay: true, halfDayThresholdHours: 4, lateArrivalGraceMinutes: 15, markLateAsAbsent: true,
  lateCountForAbsent: 3, requireParentNotification: true, allowLeaveApplication: true, maxConsecutiveLeaveDays: 15,
  requireMedicalCertificate: true, medicalCertificateAfterDays: 3, countHolidaysInLeave: false, autoDeductFromAllowedLeaves: true
};

const initialReadmissionFeeCategories: ReadmissionFeeCategory[] = [
{ id: '1', category: 'Standard Re-admission', feeAmount: 5000, description: 'Regular re-admission fee for students returning within 1 year', isActive: true },
{ id: '2', category: 'Late Re-admission', feeAmount: 7500, description: 'For students returning after 1-2 years gap', isActive: true },
{ id: '3', category: 'Extended Gap', feeAmount: 10000, description: 'For students returning after 2+ years gap', isActive: true },
{ id: '4', category: 'Medical Case', feeAmount: 2500, description: 'Reduced fee for medical leave cases', isActive: true },
{ id: '5', category: 'Transfer Return', feeAmount: 3000, description: 'For students returning after parent transfer', isActive: true },
{ id: '6', category: 'Sibling Discount', feeAmount: 2000, description: 'Discounted fee when sibling is currently enrolled', isActive: true }];


const initialReadmissionDocuments: ReadmissionDocument[] = [
{ id: '1', documentName: 'Transfer Certificate (TC)', isMandatory: true, description: 'Original TC from previous school', isActive: true },
{ id: '2', documentName: 'Character Certificate', isMandatory: true, description: 'Conduct certificate from previous school', isActive: true },
{ id: '3', documentName: 'Previous Report Cards', isMandatory: true, description: 'Last 2 years academic records', isActive: true },
{ id: '4', documentName: 'No Dues Certificate', isMandatory: true, description: 'Fee clearance from previous session', isActive: true },
{ id: '5', documentName: 'Medical Fitness Certificate', isMandatory: false, description: 'Required for gaps due to medical reasons', isActive: true },
{ id: '6', documentName: 'Parent ID Proof', isMandatory: true, description: 'Aadhaar/Passport of parent', isActive: true },
{ id: '7', documentName: 'Address Proof', isMandatory: true, description: 'Current residential address proof', isActive: true },
{ id: '8', documentName: 'Passport Photos', isMandatory: true, description: '4 recent passport size photos', isActive: true },
{ id: '9', documentName: 'Migration Certificate', isMandatory: false, description: 'For students from other boards', isActive: true },
{ id: '10', documentName: 'Gap Affidavit', isMandatory: false, description: 'Required for gaps more than 1 year', isActive: true }];


const initialReadmissionRules: ReadmissionRules = {
  allowReadmission: true, maxGapYears: 3, minGapMonths: 0, blacklistPeriodMonths: 24,
  requirePreviousRecords: true, requireTCVerification: true, requireClearanceFromPreviousSchool: true,
  requireNoDuesFromPreviousSession: true, checkPreviousConductRecord: true, conductGradeMinimum: 'B',
  checkPreviousAcademicRecord: true, academicGradeMinimum: 'C',
  approvalRequired: true, approvalLevels: ['Class Teacher', 'Vice Principal', 'Principal'],
  conductInterviewBeforeReadmission: true, interviewPanelMembers: 2, conductEntranceTest: false, entranceTestSubjects: [],
  restorePreviousId: true, restoreAcademicHistory: true, restoreAttendanceHistory: false, restoreFeeHistory: true, createNewAdmissionNumber: false,
  allowSameClass: true, allowLowerClass: true, allowHigherClass: false, requirePlacementTest: false,
  giveAdmissionPriority: true, priorityOverNewAdmissions: false, siblingPriorityForReadmission: true,
  allowMedicalCaseException: true, allowTransferCaseException: true,
  applyReadmissionFee: true, allowPartialFeeWaiver: true, maxWaiverPercentage: 50, waiverApprovalRequired: true,
  clearPreviousDues: true, allowDuesInstallment: true, maxDuesInstallments: 6,
  applicationWindowStartMonths: 3, applicationWindowEndMonths: 1, processingDays: 7, maxPendingDays: 30,
  notifyOnApplication: true, notifyOnApproval: true, notifyOnRejection: true, notificationModes: ['email', 'sms', 'app']
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export function StudentRules() {
  const [ageRequirements, setAgeRequirements] = useState<AgeRequirement[]>(initialAgeRequirements);
  const [capacityLimits, setCapacityLimits] = useState<CapacityLimit[]>(initialCapacityLimits);
  const [attendancePolicies, setAttendancePolicies] = useState<AttendancePolicy[]>(initialAttendancePolicies);
  const [attendanceSettings, setAttendanceSettings] = useState<AttendanceSettings>(initialAttendanceSettings);
  const [readmissionRules, setReadmissionRules] = useState<ReadmissionRules>(initialReadmissionRules);
  const [readmissionFees, setReadmissionFees] = useState<ReadmissionFeeCategory[]>(initialReadmissionFeeCategories);
  const [readmissionDocs, setReadmissionDocs] = useState<ReadmissionDocument[]>(initialReadmissionDocuments);

  const [ageRestrictionType, setAgeRestrictionType] = useState('hard');
  const [capacityRestrictionType, setCapacityRestrictionType] = useState('hard');
  const [ageFilterBranch, setAgeFilterBranch] = useState('All');
  const [capacityFilterBranch, setCapacityFilterBranch] = useState('All');

  // Modal States
  const [editAgeModal, setEditAgeModal] = useState(false);
  const [editCapacityModal, setEditCapacityModal] = useState(false);
  const [editAttendancePolicyModal, setEditAttendancePolicyModal] = useState(false);
  const [addAgeModal, setAddAgeModal] = useState(false);
  const [addCapacityModal, setAddCapacityModal] = useState(false);
  const [addAttendancePolicyModal, setAddAttendancePolicyModal] = useState(false);
  const [addFeeModal, setAddFeeModal] = useState(false);
  const [editFeeModal, setEditFeeModal] = useState(false);
  const [addDocModal, setAddDocModal] = useState(false);
  const [editDocModal, setEditDocModal] = useState(false);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{type: string;id: string;} | null>(null);

  // Editing States
  const [editingAge, setEditingAge] = useState<AgeRequirement | null>(null);
  const [editingCapacity, setEditingCapacity] = useState<CapacityLimit | null>(null);
  const [editingAttendancePolicy, setEditingAttendancePolicy] = useState<AttendancePolicy | null>(null);
  const [editingFee, setEditingFee] = useState<ReadmissionFeeCategory | null>(null);
  const [editingDoc, setEditingDoc] = useState<ReadmissionDocument | null>(null);

  // New Item States
  const [newAge, setNewAge] = useState<Partial<AgeRequirement>>({ minAgeYears: 3, minAgeMonths: 0, maxAgeYears: 5, maxAgeMonths: 0, ageAsOnDate: '1 June', educationBoard: 'CBSE', branch: 'All', academicYear: '2024-2025', isActive: true });
  const [newCapacity, setNewCapacity] = useState<Partial<CapacityLimit>>({ maxCapacity: 40, currentEnrollment: 0, waitlistLimit: 10, branch: 'Main Campus', academicYear: '2024-2025', isActive: true });
  const [newAttendancePolicy, setNewAttendancePolicy] = useState<Partial<AttendancePolicy>>({ minAttendancePercentage: 75, warningThreshold: 80, criticalThreshold: 70, autoNotifyParents: true, blockExamBelow: 65, graceAbsenceDays: 5, branch: 'All', isActive: true });
  const [newFee, setNewFee] = useState<Partial<ReadmissionFeeCategory>>({ category: '', feeAmount: 0, description: '', isActive: true });
  const [newDoc, setNewDoc] = useState<Partial<ReadmissionDocument>>({ documentName: '', isMandatory: false, description: '', isActive: true });

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'eligibility' | 'approval' | 'data' | 'fees' | 'docs' | 'timeline'>('basic');

  // Handlers
  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    setLastSaved(new Date());
    alert('All Student Rules saved successfully!');
  };

  const handleRestore = () => {
    if (confirm('Restore all settings to defaults?')) {
      setAgeRequirements(initialAgeRequirements);
      setCapacityLimits(initialCapacityLimits);
      setAttendancePolicies(initialAttendancePolicies);
      setAttendanceSettings(initialAttendanceSettings);
      setReadmissionRules(initialReadmissionRules);
      setReadmissionFees(initialReadmissionFeeCategories);
      setReadmissionDocs(initialReadmissionDocuments);
      alert('All settings restored to defaults.');
    }
  };

  // Age Handlers
  const handleAddAge = () => {
    if (!newAge.className) {alert('Please select a class');return;}
    setAgeRequirements((prev) => [...prev, { id: Date.now().toString(), ...newAge } as AgeRequirement]);
    setAddAgeModal(false);
    setNewAge({ minAgeYears: 3, minAgeMonths: 0, maxAgeYears: 5, maxAgeMonths: 0, ageAsOnDate: '1 June', educationBoard: 'CBSE', branch: 'All', academicYear: '2024-2025', isActive: true });
  };

  const handleSaveAge = () => {
    if (!editingAge) return;
    setAgeRequirements((prev) => prev.map((a) => a.id === editingAge.id ? editingAge : a));
    setEditAgeModal(false);
  };

  // Capacity Handlers
  const handleAddCapacity = () => {
    if (!newCapacity.className || !newCapacity.section) {alert('Please select class and section');return;}
    setCapacityLimits((prev) => [...prev, { id: Date.now().toString(), ...newCapacity } as CapacityLimit]);
    setAddCapacityModal(false);
  };

  const handleSaveCapacity = () => {
    if (!editingCapacity) return;
    setCapacityLimits((prev) => prev.map((c) => c.id === editingCapacity.id ? editingCapacity : c));
    setEditCapacityModal(false);
  };

  // Attendance Handlers
  const handleAddAttendancePolicy = () => {
    if (!newAttendancePolicy.className) {alert('Please select a class');return;}
    setAttendancePolicies((prev) => [...prev, { id: Date.now().toString(), ...newAttendancePolicy } as AttendancePolicy]);
    setAddAttendancePolicyModal(false);
  };

  const handleSaveAttendancePolicy = () => {
    if (!editingAttendancePolicy) return;
    setAttendancePolicies((prev) => prev.map((a) => a.id === editingAttendancePolicy.id ? editingAttendancePolicy : a));
    setEditAttendancePolicyModal(false);
  };

  // Fee Handlers
  const handleAddFee = () => {
    if (!newFee.category) {alert('Please enter category name');return;}
    setReadmissionFees((prev) => [...prev, { id: Date.now().toString(), ...newFee } as ReadmissionFeeCategory]);
    setAddFeeModal(false);
    setNewFee({ category: '', feeAmount: 0, description: '', isActive: true });
  };

  const handleSaveFee = () => {
    if (!editingFee) return;
    setReadmissionFees((prev) => prev.map((f) => f.id === editingFee.id ? editingFee : f));
    setEditFeeModal(false);
  };

  // Document Handlers
  const handleAddDoc = () => {
    if (!newDoc.documentName) {alert('Please enter document name');return;}
    setReadmissionDocs((prev) => [...prev, { id: Date.now().toString(), ...newDoc } as ReadmissionDocument]);
    setAddDocModal(false);
    setNewDoc({ documentName: '', isMandatory: false, description: '', isActive: true });
  };

  const handleSaveDoc = () => {
    if (!editingDoc) return;
    setReadmissionDocs((prev) => prev.map((d) => d.id === editingDoc.id ? editingDoc : d));
    setEditDocModal(false);
  };

  // Delete Handler
  const handleDelete = () => {
    if (!deleteConfirmModal) return;
    const { type, id } = deleteConfirmModal;
    if (type === 'age') setAgeRequirements((prev) => prev.filter((a) => a.id !== id));else
    if (type === 'capacity') setCapacityLimits((prev) => prev.filter((c) => c.id !== id));else
    if (type === 'attendance') setAttendancePolicies((prev) => prev.filter((a) => a.id !== id));else
    if (type === 'fee') setReadmissionFees((prev) => prev.filter((f) => f.id !== id));else
    if (type === 'doc') setReadmissionDocs((prev) => prev.filter((d) => d.id !== id));
    setDeleteConfirmModal(null);
  };

  const filteredAgeRequirements = ageRequirements.filter((a) => ageFilterBranch === 'All' || a.branch === ageFilterBranch || a.branch === 'All');
  const filteredCapacityLimits = capacityLimits.filter((c) => capacityFilterBranch === 'All' || c.branch === capacityFilterBranch);

  const TabButton = ({ id, label, icon: Icon }: {id: string;label: string;icon: any;}) =>
  <button onClick={() => setActiveTab(id as any)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
      <Icon className="w-4 h-4" />{label}
    </button>;


  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Rules</h1>
          <p className="text-sm text-gray-500">Configure admission, capacity, attendance, and re-admission policies</p>
          {lastSaved && <p className="text-xs text-green-600 mt-1">Last saved: {lastSaved.toLocaleString()}</p>}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRestore}><RotateCcw className="w-4 h-4 mr-2" />Restore Defaults</Button>
          <Button variant="primary" onClick={handleSave} disabled={isSaving}><Save className="w-4 h-4 mr-2" />{isSaving ? 'Saving...' : 'Save All Rules'}</Button>
        </div>
      </div>

      {/* Age Requirements */}
      <Card title="Minimum Age Requirement" icon={<Calendar className="w-5 h-5 text-blue-500" />}>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Select options={BRANCHES.map((b) => ({ value: b, label: b }))} value={ageFilterBranch} onChange={(e) => setAgeFilterBranch(e.target.value)} className="w-40" />
            <div className="flex gap-2">
              <Select options={[{ value: 'hard', label: 'Block Admission' }, { value: 'warning', label: 'Warning Only' }]} value={ageRestrictionType} onChange={(e) => setAgeRestrictionType(e.target.value)} className="w-48" />
              <Button variant="primary" onClick={() => setAddAgeModal(true)}><Plus className="w-4 h-4 mr-2" />Add</Button>
            </div>
          </div>
          <Table>
            <TableHead><TableRow>
              <TableHeader>Class</TableHeader><TableHeader>Min Age</TableHeader><TableHeader>Max Age</TableHeader>
              <TableHeader>As On</TableHeader><TableHeader>Board</TableHeader><TableHeader>Status</TableHeader><TableHeader>Actions</TableHeader>
            </TableRow></TableHead>
            <TableBody>
              {filteredAgeRequirements.map((req) =>
              <TableRow key={req.id} className={!req.isActive ? 'opacity-50' : ''}>
                  <TableCell className="font-medium">{req.className}</TableCell>
                  <TableCell>{req.minAgeYears}Y {req.minAgeMonths}M</TableCell>
                  <TableCell>{req.maxAgeYears}Y {req.maxAgeMonths}M</TableCell>
                  <TableCell>{req.ageAsOnDate}</TableCell>
                  <TableCell>{req.educationBoard}</TableCell>
                  <TableCell><Badge variant={req.isActive ? 'success' : 'secondary'}>{req.isActive ? 'Active' : 'Inactive'}</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => {setEditingAge(req);setEditAgeModal(true);}}><Edit2 className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => setAgeRequirements((p) => p.map((a) => a.id === req.id ? { ...a, isActive: !a.isActive } : a))}>{req.isActive ? <XCircle className="w-4 h-4 text-red-500" /> : <CheckCircle className="w-4 h-4 text-green-500" />}</Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteConfirmModal({ type: 'age', id: req.id })}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Capacity Limits */}
      <Card title="Capacity Limits" icon={<Users className="w-5 h-5 text-green-500" />}>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Select options={BRANCHES.map((b) => ({ value: b, label: b }))} value={capacityFilterBranch} onChange={(e) => setCapacityFilterBranch(e.target.value)} className="w-40" />
            <div className="flex gap-2">
              <Select options={[{ value: 'hard', label: 'Block' }, { value: 'warning', label: 'Warning' }, { value: 'waitlist', label: 'Waitlist' }]} value={capacityRestrictionType} onChange={(e) => setCapacityRestrictionType(e.target.value)} className="w-40" />
              <Button variant="primary" onClick={() => setAddCapacityModal(true)}><Plus className="w-4 h-4 mr-2" />Add</Button>
            </div>
          </div>
          <Table>
            <TableHead><TableRow>
              <TableHeader>Class</TableHeader><TableHeader>Section</TableHeader><TableHeader>Capacity</TableHeader>
              <TableHeader>Current</TableHeader><TableHeader>Available</TableHeader><TableHeader>Status</TableHeader><TableHeader>Actions</TableHeader>
            </TableRow></TableHead>
            <TableBody>
              {filteredCapacityLimits.map((cap) => {
                const available = cap.maxCapacity - cap.currentEnrollment;
                return (
                  <TableRow key={cap.id}>
                    <TableCell className="font-medium">{cap.className}</TableCell>
                    <TableCell>{cap.section}</TableCell>
                    <TableCell>{cap.maxCapacity}</TableCell>
                    <TableCell>{cap.currentEnrollment}</TableCell>
                    <TableCell><Badge variant={available <= 0 ? 'danger' : available <= 5 ? 'warning' : 'success'}>{available}</Badge></TableCell>
                    <TableCell><Badge variant={cap.isActive ? 'success' : 'secondary'}>{cap.isActive ? 'Active' : 'Inactive'}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => {setEditingCapacity(cap);setEditCapacityModal(true);}}><Edit2 className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteConfirmModal({ type: 'capacity', id: cap.id })}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>);

              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Attendance Policy */}
      <Card title="Attendance Policy" icon={<Clock className="w-5 h-5 text-indigo-500" />}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg">
            <Select label="Mode" options={[{ value: 'daily', label: 'Daily' }, { value: 'period', label: 'Period' }]} value={attendanceSettings.trackingMode} onChange={(e) => setAttendanceSettings((p) => ({ ...p, trackingMode: e.target.value }))} />
            <Input label="Late Grace (min)" type="number" value={attendanceSettings.lateArrivalGraceMinutes} onChange={(e) => setAttendanceSettings((p) => ({ ...p, lateArrivalGraceMinutes: +e.target.value }))} />
            <Input label="Half Day (hrs)" type="number" value={attendanceSettings.halfDayThresholdHours} onChange={(e) => setAttendanceSettings((p) => ({ ...p, halfDayThresholdHours: +e.target.value }))} />
            <Input label="Max Leave Days" type="number" value={attendanceSettings.maxConsecutiveLeaveDays} onChange={(e) => setAttendanceSettings((p) => ({ ...p, maxConsecutiveLeaveDays: +e.target.value }))} />
            <Input label="Medical Cert After" type="number" value={attendanceSettings.medicalCertificateAfterDays} onChange={(e) => setAttendanceSettings((p) => ({ ...p, medicalCertificateAfterDays: +e.target.value }))} />
            <Input label="Late = Absent After" type="number" value={attendanceSettings.lateCountForAbsent} onChange={(e) => setAttendanceSettings((p) => ({ ...p, lateCountForAbsent: +e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Toggle label="Half Day" checked={attendanceSettings.allowHalfDay} onChange={(v) => setAttendanceSettings((p) => ({ ...p, allowHalfDay: v }))} />
            <Toggle label="Late as Absent" checked={attendanceSettings.markLateAsAbsent} onChange={(v) => setAttendanceSettings((p) => ({ ...p, markLateAsAbsent: v }))} />
            <Toggle label="Parent Notify" checked={attendanceSettings.requireParentNotification} onChange={(v) => setAttendanceSettings((p) => ({ ...p, requireParentNotification: v }))} />
            <Toggle label="Medical Cert" checked={attendanceSettings.requireMedicalCertificate} onChange={(v) => setAttendanceSettings((p) => ({ ...p, requireMedicalCertificate: v }))} />
          </div>
          <div className="flex justify-between items-center border-t pt-4">
            <h4 className="font-semibold">Class-wise Policies</h4>
            <Button variant="primary" size="sm" onClick={() => setAddAttendancePolicyModal(true)}><Plus className="w-4 h-4 mr-2" />Add</Button>
          </div>
          <Table>
            <TableHead><TableRow>
              <TableHeader>Class</TableHeader><TableHeader>Min %</TableHeader><TableHeader>Warning</TableHeader>
              <TableHeader>Block Exam</TableHeader><TableHeader>Grace Days</TableHeader><TableHeader>Actions</TableHeader>
            </TableRow></TableHead>
            <TableBody>
              {attendancePolicies.map((p) =>
              <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.className}</TableCell>
                  <TableCell>{p.minAttendancePercentage}%</TableCell>
                  <TableCell>{p.warningThreshold}%</TableCell>
                  <TableCell>{p.blockExamBelow}%</TableCell>
                  <TableCell>{p.graceAbsenceDays}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => {setEditingAttendancePolicy(p);setEditAttendancePolicyModal(true);}}><Edit2 className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteConfirmModal({ type: 'attendance', id: p.id })}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Re-admission Rules - Full Width */}
      <Card title="Re-admission Policy" icon={<RefreshCw className="w-5 h-5 text-purple-500" />}>
        <div className="space-y-6">
          <Toggle label="Allow Re-admission" checked={readmissionRules.allowReadmission} onChange={(v) => setReadmissionRules((p) => ({ ...p, allowReadmission: v }))} />
          
          {readmissionRules.allowReadmission &&
          <>
              {/* Tabs */}
              <div className="flex flex-wrap gap-2 border-b pb-4">
                <TabButton id="basic" label="Basic Settings" icon={RefreshCw} />
                <TabButton id="eligibility" label="Eligibility" icon={UserCheck} />
                <TabButton id="approval" label="Approval & Interview" icon={ClipboardCheck} />
                <TabButton id="data" label="Data Handling" icon={FileText} />
                <TabButton id="fees" label="Fee Structure" icon={DollarSign} />
                <TabButton id="docs" label="Documents" icon={FileText} />
                <TabButton id="timeline" label="Timeline" icon={Clock} />
              </div>

              {/* Basic Settings */}
              {activeTab === 'basic' &&
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Input label="Maximum Gap (Years)" type="number" value={readmissionRules.maxGapYears} onChange={(e) => setReadmissionRules((p) => ({ ...p, maxGapYears: +e.target.value }))} />
                  <Input label="Minimum Gap (Months)" type="number" value={readmissionRules.minGapMonths} onChange={(e) => setReadmissionRules((p) => ({ ...p, minGapMonths: +e.target.value }))} />
                  <Input label="Blacklist Period (Months)" type="number" value={readmissionRules.blacklistPeriodMonths} onChange={(e) => setReadmissionRules((p) => ({ ...p, blacklistPeriodMonths: +e.target.value }))} helperText="Bad conduct cases" />
                  <div className="md:col-span-2 lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <Toggle label="Priority Over New" checked={readmissionRules.priorityOverNewAdmissions} onChange={(v) => setReadmissionRules((p) => ({ ...p, priorityOverNewAdmissions: v }))} />
                    <Toggle label="Sibling Priority" checked={readmissionRules.siblingPriorityForReadmission} onChange={(v) => setReadmissionRules((p) => ({ ...p, siblingPriorityForReadmission: v }))} />
                    <Toggle label="Medical Exception" checked={readmissionRules.allowMedicalCaseException} onChange={(v) => setReadmissionRules((p) => ({ ...p, allowMedicalCaseException: v }))} />
                    <Toggle label="Transfer Exception" checked={readmissionRules.allowTransferCaseException} onChange={(v) => setReadmissionRules((p) => ({ ...p, allowTransferCaseException: v }))} />
                  </div>
                </div>
            }

              {/* Eligibility */}
              {activeTab === 'eligibility' &&
            <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Toggle label="Require Previous Records" checked={readmissionRules.requirePreviousRecords} onChange={(v) => setReadmissionRules((p) => ({ ...p, requirePreviousRecords: v }))} />
                    <Toggle label="Require TC Verification" checked={readmissionRules.requireTCVerification} onChange={(v) => setReadmissionRules((p) => ({ ...p, requireTCVerification: v }))} />
                    <Toggle label="Require School Clearance" checked={readmissionRules.requireClearanceFromPreviousSchool} onChange={(v) => setReadmissionRules((p) => ({ ...p, requireClearanceFromPreviousSchool: v }))} />
                    <Toggle label="Require No Dues" checked={readmissionRules.requireNoDuesFromPreviousSession} onChange={(v) => setReadmissionRules((p) => ({ ...p, requireNoDuesFromPreviousSession: v }))} />
                    <Toggle label="Check Conduct Record" checked={readmissionRules.checkPreviousConductRecord} onChange={(v) => setReadmissionRules((p) => ({ ...p, checkPreviousConductRecord: v }))} />
                    <Toggle label="Check Academic Record" checked={readmissionRules.checkPreviousAcademicRecord} onChange={(v) => setReadmissionRules((p) => ({ ...p, checkPreviousAcademicRecord: v }))} />
                  </div>
                  {(readmissionRules.checkPreviousConductRecord || readmissionRules.checkPreviousAcademicRecord) &&
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                      {readmissionRules.checkPreviousConductRecord && <Select label="Min Conduct Grade" options={CONDUCT_GRADES.map((g) => ({ value: g, label: g }))} value={readmissionRules.conductGradeMinimum} onChange={(e) => setReadmissionRules((p) => ({ ...p, conductGradeMinimum: e.target.value }))} />}
                      {readmissionRules.checkPreviousAcademicRecord && <Select label="Min Academic Grade" options={CONDUCT_GRADES.map((g) => ({ value: g, label: g }))} value={readmissionRules.academicGradeMinimum} onChange={(e) => setReadmissionRules((p) => ({ ...p, academicGradeMinimum: e.target.value }))} />}
                    </div>
              }
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold mb-2">Class Placement Rules</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Toggle label="Same Class" checked={readmissionRules.allowSameClass} onChange={(v) => setReadmissionRules((p) => ({ ...p, allowSameClass: v }))} />
                      <Toggle label="Lower Class" checked={readmissionRules.allowLowerClass} onChange={(v) => setReadmissionRules((p) => ({ ...p, allowLowerClass: v }))} />
                      <Toggle label="Higher Class" checked={readmissionRules.allowHigherClass} onChange={(v) => setReadmissionRules((p) => ({ ...p, allowHigherClass: v }))} />
                      <Toggle label="Placement Test" checked={readmissionRules.requirePlacementTest} onChange={(v) => setReadmissionRules((p) => ({ ...p, requirePlacementTest: v }))} />
                    </div>
                  </div>
                </div>
            }

              {/* Approval */}
              {activeTab === 'approval' &&
            <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Toggle label="Approval Required" checked={readmissionRules.approvalRequired} onChange={(v) => setReadmissionRules((p) => ({ ...p, approvalRequired: v }))} />
                    <Toggle label="Conduct Interview" checked={readmissionRules.conductInterviewBeforeReadmission} onChange={(v) => setReadmissionRules((p) => ({ ...p, conductInterviewBeforeReadmission: v }))} />
                    <Toggle label="Entrance Test" checked={readmissionRules.conductEntranceTest} onChange={(v) => setReadmissionRules((p) => ({ ...p, conductEntranceTest: v }))} />
                  </div>
                  {readmissionRules.approvalRequired &&
              <div className="p-4 bg-gray-50 rounded-lg">
                      <label className="block text-sm font-medium mb-2">Approval Levels (in order)</label>
                      <div className="flex flex-wrap gap-2">
                        {APPROVAL_LEVELS.map((level) =>
                  <button key={level} onClick={() => setReadmissionRules((p) => ({ ...p, approvalLevels: p.approvalLevels.includes(level) ? p.approvalLevels.filter((l) => l !== level) : [...p.approvalLevels, level] }))}
                  className={`px-3 py-1 rounded-full text-sm ${readmissionRules.approvalLevels.includes(level) ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                            {level}
                          </button>
                  )}
                      </div>
                    </div>
              }
                  {readmissionRules.conductInterviewBeforeReadmission &&
              <Input label="Interview Panel Members" type="number" value={readmissionRules.interviewPanelMembers} onChange={(e) => setReadmissionRules((p) => ({ ...p, interviewPanelMembers: +e.target.value }))} className="max-w-xs" />
              }
                </div>
            }

              {/* Data Handling */}
              {activeTab === 'data' &&
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Toggle label="Restore Previous ID" checked={readmissionRules.restorePreviousId} onChange={(v) => setReadmissionRules((p) => ({ ...p, restorePreviousId: v }))} />
                  <Toggle label="Restore Academic History" checked={readmissionRules.restoreAcademicHistory} onChange={(v) => setReadmissionRules((p) => ({ ...p, restoreAcademicHistory: v }))} />
                  <Toggle label="Restore Attendance History" checked={readmissionRules.restoreAttendanceHistory} onChange={(v) => setReadmissionRules((p) => ({ ...p, restoreAttendanceHistory: v }))} />
                  <Toggle label="Restore Fee History" checked={readmissionRules.restoreFeeHistory} onChange={(v) => setReadmissionRules((p) => ({ ...p, restoreFeeHistory: v }))} />
                  <Toggle label="Create New Admission Number" checked={readmissionRules.createNewAdmissionNumber} onChange={(v) => setReadmissionRules((p) => ({ ...p, createNewAdmissionNumber: v }))} />
                </div>
            }

              {/* Fees */}
              {activeTab === 'fees' &&
            <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <Toggle label="Apply Re-admission Fee" checked={readmissionRules.applyReadmissionFee} onChange={(v) => setReadmissionRules((p) => ({ ...p, applyReadmissionFee: v }))} />
                    <Toggle label="Allow Fee Waiver" checked={readmissionRules.allowPartialFeeWaiver} onChange={(v) => setReadmissionRules((p) => ({ ...p, allowPartialFeeWaiver: v }))} />
                    <Toggle label="Clear Previous Dues" checked={readmissionRules.clearPreviousDues} onChange={(v) => setReadmissionRules((p) => ({ ...p, clearPreviousDues: v }))} />
                    <Toggle label="Allow Dues Installment" checked={readmissionRules.allowDuesInstallment} onChange={(v) => setReadmissionRules((p) => ({ ...p, allowDuesInstallment: v }))} />
                  </div>
                  {readmissionRules.allowPartialFeeWaiver &&
              <div className="grid grid-cols-2 gap-4">
                      <Input label="Max Waiver %" type="number" value={readmissionRules.maxWaiverPercentage} onChange={(e) => setReadmissionRules((p) => ({ ...p, maxWaiverPercentage: +e.target.value }))} />
                      <Toggle label="Waiver Approval Required" checked={readmissionRules.waiverApprovalRequired} onChange={(v) => setReadmissionRules((p) => ({ ...p, waiverApprovalRequired: v }))} />
                    </div>
              }
                  {readmissionRules.allowDuesInstallment &&
              <Input label="Max Installments" type="number" value={readmissionRules.maxDuesInstallments} onChange={(e) => setReadmissionRules((p) => ({ ...p, maxDuesInstallments: +e.target.value }))} className="max-w-xs" />
              }
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold">Fee Categories</h4>
                      <Button variant="primary" size="sm" onClick={() => setAddFeeModal(true)}><Plus className="w-4 h-4 mr-2" />Add</Button>
                    </div>
                    <Table>
                      <TableHead><TableRow>
                        <TableHeader>Category</TableHeader><TableHeader>Amount</TableHeader><TableHeader>Description</TableHeader><TableHeader>Status</TableHeader><TableHeader>Actions</TableHeader>
                      </TableRow></TableHead>
                      <TableBody>
                        {readmissionFees.map((fee) =>
                    <TableRow key={fee.id}>
                            <TableCell className="font-medium">{fee.category}</TableCell>
                            <TableCell>₹{fee.feeAmount.toLocaleString()}</TableCell>
                            <TableCell className="text-sm text-gray-500">{fee.description}</TableCell>
                            <TableCell><Badge variant={fee.isActive ? 'success' : 'secondary'}>{fee.isActive ? 'Active' : 'Inactive'}</Badge></TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" onClick={() => {setEditingFee(fee);setEditFeeModal(true);}}><Edit2 className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="sm" onClick={() => setDeleteConfirmModal({ type: 'fee', id: fee.id })}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                              </div>
                            </TableCell>
                          </TableRow>
                    )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
            }

              {/* Documents */}
              {activeTab === 'docs' &&
            <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">Configure required documents for re-admission</p>
                    <Button variant="primary" size="sm" onClick={() => setAddDocModal(true)}><Plus className="w-4 h-4 mr-2" />Add Document</Button>
                  </div>
                  <Table>
                    <TableHead><TableRow>
                      <TableHeader>Document</TableHeader><TableHeader>Mandatory</TableHeader><TableHeader>Description</TableHeader><TableHeader>Status</TableHeader><TableHeader>Actions</TableHeader>
                    </TableRow></TableHead>
                    <TableBody>
                      {readmissionDocs.map((doc) =>
                  <TableRow key={doc.id}>
                          <TableCell className="font-medium">{doc.documentName}</TableCell>
                          <TableCell><Badge variant={doc.isMandatory ? 'danger' : 'secondary'}>{doc.isMandatory ? 'Yes' : 'No'}</Badge></TableCell>
                          <TableCell className="text-sm text-gray-500">{doc.description}</TableCell>
                          <TableCell><Badge variant={doc.isActive ? 'success' : 'secondary'}>{doc.isActive ? 'Active' : 'Inactive'}</Badge></TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" onClick={() => {setEditingDoc(doc);setEditDocModal(true);}}><Edit2 className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="sm" onClick={() => setReadmissionDocs((p) => p.map((d) => d.id === doc.id ? { ...d, isActive: !d.isActive } : d))}>{doc.isActive ? <XCircle className="w-4 h-4 text-red-500" /> : <CheckCircle className="w-4 h-4 text-green-500" />}</Button>
                              <Button variant="ghost" size="sm" onClick={() => setDeleteConfirmModal({ type: 'doc', id: doc.id })}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                  )}
                    </TableBody>
                  </Table>
                </div>
            }

              {/* Timeline */}
              {activeTab === 'timeline' &&
            <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Input label="Window Start (Months Before)" type="number" value={readmissionRules.applicationWindowStartMonths} onChange={(e) => setReadmissionRules((p) => ({ ...p, applicationWindowStartMonths: +e.target.value }))} />
                    <Input label="Window End (Months Before)" type="number" value={readmissionRules.applicationWindowEndMonths} onChange={(e) => setReadmissionRules((p) => ({ ...p, applicationWindowEndMonths: +e.target.value }))} />
                    <Input label="Processing Days" type="number" value={readmissionRules.processingDays} onChange={(e) => setReadmissionRules((p) => ({ ...p, processingDays: +e.target.value }))} />
                    <Input label="Max Pending Days" type="number" value={readmissionRules.maxPendingDays} onChange={(e) => setReadmissionRules((p) => ({ ...p, maxPendingDays: +e.target.value }))} />
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-3">Notifications</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Toggle label="On Application" checked={readmissionRules.notifyOnApplication} onChange={(v) => setReadmissionRules((p) => ({ ...p, notifyOnApplication: v }))} />
                      <Toggle label="On Approval" checked={readmissionRules.notifyOnApproval} onChange={(v) => setReadmissionRules((p) => ({ ...p, notifyOnApproval: v }))} />
                      <Toggle label="On Rejection" checked={readmissionRules.notifyOnRejection} onChange={(v) => setReadmissionRules((p) => ({ ...p, notifyOnRejection: v }))} />
                    </div>
                  </div>
                </div>
            }
            </>
          }
        </div>
      </Card>

      {/* Modals */}
      <Modal isOpen={addAgeModal} onClose={() => setAddAgeModal(false)} title="Add Age Requirement">
        <div className="space-y-4">
          <Select label="Class *" options={CLASSES.map((c) => ({ value: c, label: c }))} value={newAge.className || ''} onChange={(e) => setNewAge((p) => ({ ...p, className: e.target.value }))} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Min Years" type="number" value={newAge.minAgeYears} onChange={(e) => setNewAge((p) => ({ ...p, minAgeYears: +e.target.value }))} />
            <Input label="Min Months" type="number" value={newAge.minAgeMonths} onChange={(e) => setNewAge((p) => ({ ...p, minAgeMonths: +e.target.value }))} />
            <Input label="Max Years" type="number" value={newAge.maxAgeYears} onChange={(e) => setNewAge((p) => ({ ...p, maxAgeYears: +e.target.value }))} />
            <Input label="Max Months" type="number" value={newAge.maxAgeMonths} onChange={(e) => setNewAge((p) => ({ ...p, maxAgeMonths: +e.target.value }))} />
          </div>
          <Input label="As On Date" value={newAge.ageAsOnDate} onChange={(e) => setNewAge((p) => ({ ...p, ageAsOnDate: e.target.value }))} />
          <Select label="Board" options={BOARDS.map((b) => ({ value: b, label: b }))} value={newAge.educationBoard} onChange={(e) => setNewAge((p) => ({ ...p, educationBoard: e.target.value }))} />
          <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setAddAgeModal(false)}>Cancel</Button><Button variant="primary" onClick={handleAddAge}>Add</Button></div>
        </div>
      </Modal>

      <Modal isOpen={editAgeModal} onClose={() => setEditAgeModal(false)} title="Edit Age Requirement">
        {editingAge &&
        <div className="space-y-4">
            <Input label="Class" value={editingAge.className} disabled />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Min Years" type="number" value={editingAge.minAgeYears} onChange={(e) => setEditingAge({ ...editingAge, minAgeYears: +e.target.value })} />
              <Input label="Min Months" type="number" value={editingAge.minAgeMonths} onChange={(e) => setEditingAge({ ...editingAge, minAgeMonths: +e.target.value })} />
              <Input label="Max Years" type="number" value={editingAge.maxAgeYears} onChange={(e) => setEditingAge({ ...editingAge, maxAgeYears: +e.target.value })} />
              <Input label="Max Months" type="number" value={editingAge.maxAgeMonths} onChange={(e) => setEditingAge({ ...editingAge, maxAgeMonths: +e.target.value })} />
            </div>
            <Input label="As On Date" value={editingAge.ageAsOnDate} onChange={(e) => setEditingAge({ ...editingAge, ageAsOnDate: e.target.value })} />
            <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setEditAgeModal(false)}>Cancel</Button><Button variant="primary" onClick={handleSaveAge}>Save</Button></div>
          </div>
        }
      </Modal>

      <Modal isOpen={addCapacityModal} onClose={() => setAddCapacityModal(false)} title="Add Capacity">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select label="Class *" options={CLASSES.map((c) => ({ value: c, label: c }))} value={newCapacity.className || ''} onChange={(e) => setNewCapacity((p) => ({ ...p, className: e.target.value }))} />
            <Select label="Section *" options={SECTIONS.map((s) => ({ value: s, label: s }))} value={newCapacity.section || ''} onChange={(e) => setNewCapacity((p) => ({ ...p, section: e.target.value }))} />
          </div>
          <Input label="Max Capacity" type="number" value={newCapacity.maxCapacity} onChange={(e) => setNewCapacity((p) => ({ ...p, maxCapacity: +e.target.value }))} />
          <Input label="Waitlist Limit" type="number" value={newCapacity.waitlistLimit} onChange={(e) => setNewCapacity((p) => ({ ...p, waitlistLimit: +e.target.value }))} />
          <Select label="Branch" options={BRANCHES.filter((b) => b !== 'All').map((b) => ({ value: b, label: b }))} value={newCapacity.branch} onChange={(e) => setNewCapacity((p) => ({ ...p, branch: e.target.value }))} />
          <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setAddCapacityModal(false)}>Cancel</Button><Button variant="primary" onClick={handleAddCapacity}>Add</Button></div>
        </div>
      </Modal>

      <Modal isOpen={editCapacityModal} onClose={() => setEditCapacityModal(false)} title="Edit Capacity">
        {editingCapacity &&
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Class" value={editingCapacity.className} disabled />
              <Input label="Section" value={editingCapacity.section} disabled />
            </div>
            <Input label="Max Capacity" type="number" value={editingCapacity.maxCapacity} onChange={(e) => setEditingCapacity({ ...editingCapacity, maxCapacity: +e.target.value })} />
            <Input label="Waitlist Limit" type="number" value={editingCapacity.waitlistLimit} onChange={(e) => setEditingCapacity({ ...editingCapacity, waitlistLimit: +e.target.value })} />
            <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setEditCapacityModal(false)}>Cancel</Button><Button variant="primary" onClick={handleSaveCapacity}>Save</Button></div>
          </div>
        }
      </Modal>

      <Modal isOpen={addAttendancePolicyModal} onClose={() => setAddAttendancePolicyModal(false)} title="Add Attendance Policy">
        <div className="space-y-4">
          <Select label="Class *" options={['All Classes', ...CLASSES].map((c) => ({ value: c, label: c }))} value={newAttendancePolicy.className || ''} onChange={(e) => setNewAttendancePolicy((p) => ({ ...p, className: e.target.value }))} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Min %" type="number" value={newAttendancePolicy.minAttendancePercentage} onChange={(e) => setNewAttendancePolicy((p) => ({ ...p, minAttendancePercentage: +e.target.value }))} />
            <Input label="Warning %" type="number" value={newAttendancePolicy.warningThreshold} onChange={(e) => setNewAttendancePolicy((p) => ({ ...p, warningThreshold: +e.target.value }))} />
            <Input label="Block Exam %" type="number" value={newAttendancePolicy.blockExamBelow} onChange={(e) => setNewAttendancePolicy((p) => ({ ...p, blockExamBelow: +e.target.value }))} />
            <Input label="Grace Days" type="number" value={newAttendancePolicy.graceAbsenceDays} onChange={(e) => setNewAttendancePolicy((p) => ({ ...p, graceAbsenceDays: +e.target.value }))} />
          </div>
          <Toggle label="Auto Notify Parents" checked={newAttendancePolicy.autoNotifyParents || false} onChange={(v) => setNewAttendancePolicy((p) => ({ ...p, autoNotifyParents: v }))} />
          <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setAddAttendancePolicyModal(false)}>Cancel</Button><Button variant="primary" onClick={handleAddAttendancePolicy}>Add</Button></div>
        </div>
      </Modal>

      <Modal isOpen={editAttendancePolicyModal} onClose={() => setEditAttendancePolicyModal(false)} title="Edit Attendance Policy">
        {editingAttendancePolicy &&
        <div className="space-y-4">
            <Input label="Class" value={editingAttendancePolicy.className} disabled />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Min %" type="number" value={editingAttendancePolicy.minAttendancePercentage} onChange={(e) => setEditingAttendancePolicy({ ...editingAttendancePolicy, minAttendancePercentage: +e.target.value })} />
              <Input label="Warning %" type="number" value={editingAttendancePolicy.warningThreshold} onChange={(e) => setEditingAttendancePolicy({ ...editingAttendancePolicy, warningThreshold: +e.target.value })} />
              <Input label="Block Exam %" type="number" value={editingAttendancePolicy.blockExamBelow} onChange={(e) => setEditingAttendancePolicy({ ...editingAttendancePolicy, blockExamBelow: +e.target.value })} />
              <Input label="Grace Days" type="number" value={editingAttendancePolicy.graceAbsenceDays} onChange={(e) => setEditingAttendancePolicy({ ...editingAttendancePolicy, graceAbsenceDays: +e.target.value })} />
            </div>
            <Toggle label="Auto Notify Parents" checked={editingAttendancePolicy.autoNotifyParents} onChange={(v) => setEditingAttendancePolicy({ ...editingAttendancePolicy, autoNotifyParents: v })} />
            <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setEditAttendancePolicyModal(false)}>Cancel</Button><Button variant="primary" onClick={handleSaveAttendancePolicy}>Save</Button></div>
          </div>
        }
      </Modal>

      <Modal isOpen={addFeeModal} onClose={() => setAddFeeModal(false)} title="Add Fee Category">
        <div className="space-y-4">
          <Input label="Category Name *" value={newFee.category} onChange={(e) => setNewFee((p) => ({ ...p, category: e.target.value }))} />
          <Input label="Fee Amount *" type="number" value={newFee.feeAmount} onChange={(e) => setNewFee((p) => ({ ...p, feeAmount: +e.target.value }))} />
          <Input label="Description" value={newFee.description} onChange={(e) => setNewFee((p) => ({ ...p, description: e.target.value }))} />
          <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setAddFeeModal(false)}>Cancel</Button><Button variant="primary" onClick={handleAddFee}>Add</Button></div>
        </div>
      </Modal>

      <Modal isOpen={editFeeModal} onClose={() => setEditFeeModal(false)} title="Edit Fee Category">
        {editingFee &&
        <div className="space-y-4">
            <Input label="Category Name" value={editingFee.category} onChange={(e) => setEditingFee({ ...editingFee, category: e.target.value })} />
            <Input label="Fee Amount" type="number" value={editingFee.feeAmount} onChange={(e) => setEditingFee({ ...editingFee, feeAmount: +e.target.value })} />
            <Input label="Description" value={editingFee.description} onChange={(e) => setEditingFee({ ...editingFee, description: e.target.value })} />
            <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setEditFeeModal(false)}>Cancel</Button><Button variant="primary" onClick={handleSaveFee}>Save</Button></div>
          </div>
        }
      </Modal>

      <Modal isOpen={addDocModal} onClose={() => setAddDocModal(false)} title="Add Document">
        <div className="space-y-4">
          <Input label="Document Name *" value={newDoc.documentName} onChange={(e) => setNewDoc((p) => ({ ...p, documentName: e.target.value }))} />
          <Input label="Description" value={newDoc.description} onChange={(e) => setNewDoc((p) => ({ ...p, description: e.target.value }))} />
          <Toggle label="Mandatory" checked={newDoc.isMandatory || false} onChange={(v) => setNewDoc((p) => ({ ...p, isMandatory: v }))} />
          <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setAddDocModal(false)}>Cancel</Button><Button variant="primary" onClick={handleAddDoc}>Add</Button></div>
        </div>
      </Modal>

      <Modal isOpen={editDocModal} onClose={() => setEditDocModal(false)} title="Edit Document">
        {editingDoc &&
        <div className="space-y-4">
            <Input label="Document Name" value={editingDoc.documentName} onChange={(e) => setEditingDoc({ ...editingDoc, documentName: e.target.value })} />
            <Input label="Description" value={editingDoc.description} onChange={(e) => setEditingDoc({ ...editingDoc, description: e.target.value })} />
            <Toggle label="Mandatory" checked={editingDoc.isMandatory} onChange={(v) => setEditingDoc({ ...editingDoc, isMandatory: v })} />
            <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setEditDocModal(false)}>Cancel</Button><Button variant="primary" onClick={handleSaveDoc}>Save</Button></div>
          </div>
        }
      </Modal>

      <Modal isOpen={!!deleteConfirmModal} onClose={() => setDeleteConfirmModal(null)} title="Confirm Delete">
        <div className="space-y-4">
          <p>Are you sure you want to delete this item?</p>
          <p className="text-sm text-red-600">This action cannot be undone.</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirmModal(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>);

}

export default StudentRules;