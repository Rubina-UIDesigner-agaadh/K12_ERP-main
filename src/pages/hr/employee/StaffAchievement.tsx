import React, { useEffect, useMemo, useState } from 'react';
import {
  Award,
  Bell,
  BookOpen,
  Calendar,
  Clock,
  Download,
  Eye,
  FileText,
  GraduationCap,
  Medal,
  Printer,
  Search,
  Sparkles,
  Star,
  Trash2,
  Trophy,
  X,
} from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Modal } from '../../../components/ui/Modal';

const STAFF_ACHIEVEMENT_STORAGE_KEY = 'k12-staff-achievement-workspace-v1';
const STAFF_ACHIEVEMENT_STORAGE_PREFIX = `${STAFF_ACHIEVEMENT_STORAGE_KEY}:`;
const STAFF_ACHIEVEMENT_EXPORT_ENDPOINT = '/api/hr/staff-achievements/export';

type StaffDirectoryEmployee = {
  id: string;
  employeeId: string;
  name: string;
  initials: string;
  designation: string;
  department: string;
  branch: string;
  joiningDate: string;
  experience: string;
};

const staffDirectoryEmployees: StaffDirectoryEmployee[] = [
  { id: 'EMP-2020-001', employeeId: 'EMP-2020-001', name: 'Priya Sharma', initials: 'PS', designation: 'Senior Mathematics Teacher', department: 'Mathematics', branch: 'Main Campus', joiningDate: '2020-04-15', experience: '6 years' },
  { id: 'EMP-2019-015', employeeId: 'EMP-2019-015', name: 'James Wilson', initials: 'JW', designation: 'English Teacher', department: 'English', branch: 'Main Campus', joiningDate: '2019-07-01', experience: '7 years' },
  { id: 'EMP-2022-008', employeeId: 'EMP-2022-008', name: 'Anita Desai', initials: 'AD', designation: 'Primary Teacher', department: 'Primary', branch: 'North Wing', joiningDate: '2022-06-01', experience: '4 years' },
  { id: 'EMP-2021-014', employeeId: 'EMP-2021-014', name: 'Rahul Verma', initials: 'RV', designation: 'Mathematics Teacher', department: 'Mathematics', branch: 'East Campus', joiningDate: '2021-08-10', experience: '5 years' },
  { id: 'EMP-2023-006', employeeId: 'EMP-2023-006', name: 'Meera Patel', initials: 'MP', designation: 'Computer Science Teacher', department: 'Computer Science', branch: 'Main Campus', joiningDate: '2023-07-03', experience: '3 years' },
];

const achievementTypes = [
  '🏆 Award',
  '📚 Publication',
  '🎓 Academic Achievement',
  '⭐ Recognition',
  '🏅 Competition',
  '🔬 Research',
  '💡 Innovation',
  '👑 Leadership',
] as const;
const achievementLevels = ['School', 'District', 'State', 'National', 'International'] as const;
const trainingCategories = [
  '📘 Subject / Academic',
  '💻 Technology & Digital Skills',
  '🤝 Soft Skills & Leadership',
  '🩺 Health & Safety',
  '🗂️ Administration',
  '🎨 Creative & Arts',
  '🌐 Language',
  '🔬 Research',
] as const;
const trainingModes = ['Online', 'Offline', 'Hybrid'] as const;
const trainingCertificateOptions = ['Yes', 'No', 'Pending'] as const;
const trainingStatuses = ['Completed', 'In Progress', 'Upcoming', 'Cancelled'] as const;
const certificateTypes = ['Achievement', 'Training', 'Appreciation', 'Participation'] as const;

type AchievementType = typeof achievementTypes[number];
type AchievementLevel = typeof achievementLevels[number];
type TrainingCategory = typeof trainingCategories[number];
type TrainingMode = typeof trainingModes[number];
type TrainingCertificateStatus = typeof trainingCertificateOptions[number];
type TrainingStatus = typeof trainingStatuses[number];
type CertificateType = typeof certificateTypes[number];
type StaffAchievementTab = 'achievements' | 'training' | 'builder' | 'history';

type AchievementRecord = {
  id: string;
  type: AchievementType;
  title: string;
  dateReceived: string;
  issuedBy: string;
  level: AchievementLevel;
  description: string;
  supportingDocument: string;
  certificateAttached: 'Yes' | 'No';
};

type TrainingRecord = {
  id: string;
  title: string;
  category: TrainingCategory;
  startDate: string;
  endDate: string;
  durationDays: string;
  mode: TrainingMode;
  organizedBy: string;
  venue: string;
  certificateReceived: TrainingCertificateStatus;
  status: TrainingStatus;
  skillsGained: string;
  remarks: string;
};

type CertificateRecord = {
  id: string;
  type: CertificateType;
  recipientName: string;
  title: string;
  body: string;
  issueDate: string;
  validUntil: string;
  signedBy: string;
  coSignedBy: string;
  theme: string;
  institutionName: string;
};

type StaffAchievementRecords = {
  achievements: AchievementRecord[];
  trainings: TrainingRecord[];
  certificates: CertificateRecord[];
};

type DetailModalData = {
  title: string;
  subtitle: string;
  rows: { label: string; value: string }[];
};

type TimelineItem = {
  id: string;
  date: string;
  title: string;
  subtitle: string;
  badge: string;
  type: 'achievement' | 'training' | 'certificate';
  trainingStatus?: TrainingStatus;
};

const emptyRecords: StaffAchievementRecords = { achievements: [], trainings: [], certificates: [] };

const themeOptions = [
  { id: 'navy', label: 'Navy', accent: '#17365d', light: '#edf3fb' },
  { id: 'green', label: 'Green', accent: '#176b55', light: '#edf8f2' },
  { id: 'purple', label: 'Purple', accent: '#62428a', light: '#f5f0fb' },
  { id: 'red', label: 'Red', accent: '#a33a35', light: '#fff1ef' },
  { id: 'cyan', label: 'Cyan', accent: '#087b91', light: '#ecf9fb' },
  { id: 'brown', label: 'Brown', accent: '#78503a', light: '#f8f1eb' },
] as const;

const inputClass = 'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500';
const labelClass = 'mb-1 block text-sm font-medium text-gray-700';
const achievementCardBorders = ['border-l-blue-500', 'border-l-emerald-500', 'border-l-orange-500', 'border-l-purple-500'];

function readStoredRecords(employeeId: string): StaffAchievementRecords {
  if (typeof window === 'undefined') return emptyRecords;
  try {
    const scopedKey = `${STAFF_ACHIEVEMENT_STORAGE_PREFIX}${employeeId}`;
    const legacyValue = employeeId === 'EMP-2020-001'
      ? window.localStorage.getItem(STAFF_ACHIEVEMENT_STORAGE_KEY)
      : null;
    const stored = JSON.parse(window.localStorage.getItem(scopedKey) || legacyValue || '{}') as Partial<StaffAchievementRecords>;
    return {
      achievements: Array.isArray(stored.achievements) ? stored.achievements : [],
      trainings: Array.isArray(stored.trainings) ? stored.trainings : [],
      certificates: Array.isArray(stored.certificates) ? stored.certificates : [],
    };
  } catch {
    return emptyRecords;
  }
}

const createId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
const todayIso = () => new Date().toISOString().slice(0, 10);
const formatDate = (value: string) => {
  if (!value) return '—';
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};
const htmlEscapes: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => htmlEscapes[character] || character);
const csvCell = (value: string) => `"${value.replace(/"/g, '""')}"`;

function AnimatedCount({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setDisplayValue(value);
      return;
    }
    const start = displayValue;
    const startedAt = performance.now();
    const duration = 520;
    let frame = 0;
    const animate = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(start + (value - start) * eased));
      if (progress < 1) frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [value]);

  return <span>{displayValue.toLocaleString()}</span>;
}

function DetailRows({ rows }: { rows: DetailModalData['rows'] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {rows.map((row) => (
        <div key={row.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{row.label}</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-gray-900">{row.value || '—'}</p>
        </div>
      ))}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const color = status === 'Completed' || status === 'Yes'
    ? 'bg-emerald-100 text-emerald-800'
    : status === 'In Progress' || status === 'Pending'
      ? 'bg-amber-100 text-amber-800'
      : status === 'Upcoming'
        ? 'bg-blue-100 text-blue-800'
        : status === 'Cancelled' || status === 'No'
          ? 'bg-rose-100 text-rose-800'
          : 'bg-gray-100 text-gray-700';
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${color}`}>{status}</span>;
}

export function StaffAchievement() {
  const [selectedEmployee, setSelectedEmployee] = useState<StaffDirectoryEmployee | null>(null);
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [records, setRecords] = useState<StaffAchievementRecords>(emptyRecords);
  const [activeTab, setActiveTab] = useState<StaffAchievementTab>('achievements');
  const [notice, setNotice] = useState('');
  const [detailModal, setDetailModal] = useState<DetailModalData | null>(null);
  const [achievementSearch, setAchievementSearch] = useState('');
  const [trainingSearch, setTrainingSearch] = useState('');
  const [historyYear, setHistoryYear] = useState('All');
  const [isExporting, setIsExporting] = useState(false);

  const filteredStaff = useMemo(() => {
    const term = employeeSearch.trim().toLowerCase();
    if (!term) return staffDirectoryEmployees;
    return staffDirectoryEmployees.filter((employee) =>
      [employee.name, employee.employeeId, employee.designation, employee.department, employee.branch]
        .some((value) => value.toLowerCase().includes(term))
    );
  }, [employeeSearch]);

  const [achievementForm, setAchievementForm] = useState({
    type: '🏆 Award' as AchievementType,
    title: '',
    dateReceived: '',
    issuedBy: '',
    level: 'School' as AchievementLevel,
    description: '',
    certificateAttached: 'No' as 'Yes' | 'No',
  });
  const [achievementDocument, setAchievementDocument] = useState('');

  const [trainingForm, setTrainingForm] = useState({
    title: '',
    category: '📘 Subject / Academic' as TrainingCategory,
    startDate: '',
    endDate: '',
    durationDays: '',
    mode: 'Online' as TrainingMode,
    organizedBy: '',
    venue: '',
    certificateReceived: 'Pending' as TrainingCertificateStatus,
    status: 'Completed' as TrainingStatus,
    skillsGained: '',
    remarks: '',
  });

  const [certificateForm, setCertificateForm] = useState({
    type: 'Achievement' as CertificateType,
    recipientName: 'Priya Sharma',
    title: 'Certificate of Achievement',
    body: 'In recognition of outstanding contribution, dedication, and commitment to excellence.',
    issueDate: todayIso(),
    validUntil: '',
    signedBy: 'Principal',
    coSignedBy: 'Head of Department',
    theme: 'navy',
    institutionName: 'K12 School',
  });

  const openStaffWorkspace = (employee: StaffDirectoryEmployee) => {
    setRecords(readStoredRecords(employee.employeeId));
    setSelectedEmployee(employee);
    setCertificateForm((current) => ({ ...current, recipientName: employee.name }));
    setActiveTab('achievements');
    setDetailModal(null);
    setNotice('');
  };

  const returnToStaffPicker = () => {
    setSelectedEmployee(null);
    setRecords(emptyRecords);
    setDetailModal(null);
    setNotice('');
  };

  useEffect(() => {
    if (!selectedEmployee) return;
    try {
      const storageKey = `${STAFF_ACHIEVEMENT_STORAGE_PREFIX}${selectedEmployee.employeeId}`;
      window.localStorage.setItem(storageKey, JSON.stringify(records));
    } catch {
      setNotice('Changes are active for this session but could not be saved in this browser.');
    }
  }, [records, selectedEmployee]);

  const totalAchievements = records.achievements.length;
  const completedTrainings = records.trainings.filter((training) => training.status === 'Completed').length;
  const totalTrainingRecords = records.trainings.length;
  const certificatesIssued = records.certificates.length
    + records.trainings.filter((training) => training.certificateReceived === 'Yes').length
    + records.achievements.filter((achievement) => achievement.certificateAttached === 'Yes').length;
  const awardsReceived = records.achievements.filter((achievement) => achievement.type === '🏆 Award').length;
  const selectedTheme = themeOptions.find((theme) => theme.id === certificateForm.theme) || themeOptions[0];

  const filteredAchievements = useMemo(() => {
    const term = achievementSearch.trim().toLowerCase();
    if (!term) return records.achievements;
    return records.achievements.filter((achievement) =>
      [achievement.title, achievement.type, achievement.issuedBy, achievement.level, achievement.description]
        .some((value) => value.toLowerCase().includes(term))
    );
  }, [achievementSearch, records.achievements]);

  const filteredTrainings = useMemo(() => {
    const term = trainingSearch.trim().toLowerCase();
    if (!term) return records.trainings;
    return records.trainings.filter((training) =>
      [training.title, training.organizedBy, training.category, training.mode, training.status, training.skillsGained]
        .some((value) => value.toLowerCase().includes(term))
    );
  }, [trainingSearch, records.trainings]);

  const timelineItems = useMemo<TimelineItem[]>(() => {
    const items: TimelineItem[] = [
      ...records.achievements.map((achievement) => ({
        id: achievement.id,
        date: achievement.dateReceived,
        title: achievement.title,
        subtitle: `${achievement.type} · ${achievement.issuedBy || 'School record'}`,
        badge: 'Achievement',
        type: 'achievement' as const,
      })),
      ...records.trainings.map((training) => ({
        id: training.id,
        date: training.endDate || training.startDate,
        title: training.title,
        subtitle: `${training.organizedBy || 'Training record'} · ${training.category}`,
        badge: training.status,
        type: 'training' as const,
        trainingStatus: training.status,
      })),
      ...records.certificates.map((certificate) => ({
        id: certificate.id,
        date: certificate.issueDate,
        title: certificate.title,
        subtitle: `${certificate.recipientName} · ${certificate.institutionName}`,
        badge: certificate.type,
        type: 'certificate' as const,
      })),
    ];
    return items
      .filter((item) => historyYear === 'All' || item.date.slice(0, 4) === historyYear)
      .sort((a, b) => new Date(`${b.date}T00:00:00`).getTime() - new Date(`${a.date}T00:00:00`).getTime());
  }, [historyYear, records.achievements, records.certificates, records.trainings]);

  const updateAchievementForm = <K extends keyof typeof achievementForm,>(key: K, value: (typeof achievementForm)[K]) => {
    setAchievementForm((current) => ({ ...current, [key]: value }));
  };
  const updateTrainingForm = <K extends keyof typeof trainingForm,>(key: K, value: (typeof trainingForm)[K]) => {
    setTrainingForm((current) => ({ ...current, [key]: value }));
  };
  const updateCertificateForm = <K extends keyof typeof certificateForm,>(key: K, value: (typeof certificateForm)[K]) => {
    setCertificateForm((current) => ({ ...current, [key]: value }));
  };

  const handleAchievementSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newRecord: AchievementRecord = {
      id: createId('ACH'),
      ...achievementForm,
      supportingDocument: achievementDocument,
    };
    setRecords((current) => ({ ...current, achievements: [newRecord, ...current.achievements] }));
    setAchievementForm({ type: '🏆 Award', title: '', dateReceived: '', issuedBy: '', level: 'School', description: '', certificateAttached: 'No' });
    setAchievementDocument('');
    setNotice('Achievement saved. Summary counts and timeline have been updated.');
  };

  const handleTrainingSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newRecord: TrainingRecord = { id: createId('TRN'), ...trainingForm };
    setRecords((current) => ({ ...current, trainings: [newRecord, ...current.trainings] }));
    setTrainingForm({ title: '', category: '📘 Subject / Academic', startDate: '', endDate: '', durationDays: '', mode: 'Online', organizedBy: '', venue: '', certificateReceived: 'Pending', status: 'Completed', skillsGained: '', remarks: '' });
    setNotice('Training record saved. Summary counts and timeline have been updated.');
  };

  const handleCertificateSave = () => {
    if (!certificateForm.recipientName.trim() || !certificateForm.title.trim() || !certificateForm.issueDate) return;
    const newCertificate: CertificateRecord = { id: createId('CERT'), ...certificateForm };
    setRecords((current) => ({ ...current, certificates: [newCertificate, ...current.certificates] }));
    setNotice('Certificate saved. Certificate totals and the timeline have been updated.');
  };

  const deleteAchievement = (id: string) => {
    setRecords((current) => ({ ...current, achievements: current.achievements.filter((item) => item.id !== id) }));
    setNotice('Achievement deleted. Summary counts and progress have been updated.');
  };
  const deleteTraining = (id: string) => {
    setRecords((current) => ({ ...current, trainings: current.trainings.filter((item) => item.id !== id) }));
    setNotice('Training record deleted. Summary counts and progress have been updated.');
  };
  const deleteCertificate = (id: string) => {
    setRecords((current) => ({ ...current, certificates: current.certificates.filter((item) => item.id !== id) }));
    setNotice('Certificate deleted. Summary counts and progress have been updated.');
  };

  const openAchievementDetails = (record: AchievementRecord) => setDetailModal({
    title: record.title,
    subtitle: 'Achievement record',
    rows: [
      { label: 'Achievement type', value: record.type },
      { label: 'Date received', value: formatDate(record.dateReceived) },
      { label: 'Issued by', value: record.issuedBy },
      { label: 'Level', value: record.level },
      { label: 'Certificate attached', value: record.certificateAttached },
      { label: 'Supporting document', value: record.supportingDocument },
      { label: 'Description', value: record.description },
    ],
  });

  const openTrainingDetails = (record: TrainingRecord) => setDetailModal({
    title: record.title,
    subtitle: 'Training record',
    rows: [
      { label: 'Category', value: record.category },
      { label: 'Start date', value: formatDate(record.startDate) },
      { label: 'End date', value: formatDate(record.endDate) },
      { label: 'Duration', value: record.durationDays ? `${record.durationDays} days` : '—' },
      { label: 'Mode', value: record.mode },
      { label: 'Organized by', value: record.organizedBy },
      { label: 'Venue / platform', value: record.venue },
      { label: 'Certificate received', value: record.certificateReceived },
      { label: 'Status', value: record.status },
      { label: 'Skills gained', value: record.skillsGained },
      { label: 'Remarks', value: record.remarks },
    ],
  });

  const downloadBlob = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const exportAchievements = async () => {
    setIsExporting(true);
    setNotice('');
    try {
      const response = await fetch(STAFF_ACHIEVEMENT_EXPORT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'text/csv, application/octet-stream, application/json' },
        body: JSON.stringify({ employeeId: selectedEmployee?.employeeId, employeeName: selectedEmployee?.name, achievements: records.achievements }),
      });
      if (!response.ok) throw new Error(`Export API returned ${response.status}`);
      const blob = await response.blob();
      downloadBlob(blob, 'staff-achievements-export.csv');
      setNotice('Achievement export downloaded from the server.');
    } catch {
      const headers = ['Type', 'Title', 'Date Received', 'Issued By', 'Level', 'Description', 'Certificate Attached', 'Supporting Document'];
      const rows = records.achievements.map((record) => [record.type, record.title, record.dateReceived, record.issuedBy, record.level, record.description, record.certificateAttached, record.supportingDocument]);
      const csv = [headers, ...rows].map((row) => row.map((cell) => csvCell(String(cell || ''))).join(',')).join('\r\n');
      downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), 'staff-achievements.csv');
      setNotice('The export API is unavailable; a local CSV copy was downloaded instead.');
    } finally {
      setIsExporting(false);
    }
  };

  const printCertificate = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      setNotice('Allow pop-ups to print or save the certificate as PDF.');
      return;
    }
    const accent = selectedTheme.accent;
    const institution = escapeHtml(certificateForm.institutionName || 'School Name');
    const title = escapeHtml(certificateForm.title || 'Certificate Title');
    const recipient = escapeHtml(certificateForm.recipientName || 'Recipient Name');
    const body = escapeHtml(certificateForm.body || 'Certificate body text');
    const signedBy = escapeHtml(certificateForm.signedBy || '');
    const coSignedBy = escapeHtml(certificateForm.coSignedBy || '');
    const issueDate = escapeHtml(formatDate(certificateForm.issueDate));
    const validUntil = certificateForm.validUntil ? `<p class="valid">Valid until ${escapeHtml(formatDate(certificateForm.validUntil))}</p>` : '';
    printWindow.document.open();
    printWindow.document.write(`<!doctype html><html><head><title>${title}</title><style>
      *{box-sizing:border-box}body{margin:0;padding:24px;background:#f5f5f5;font-family:Georgia,'Times New Roman',serif;color:#1f2937}.page{width:100%;max-width:980px;min-height:680px;margin:0 auto;padding:22px;background:#fff;border:8px solid #c5a34b;box-shadow:inset 0 0 0 2px ${accent},inset 0 0 0 11px #fff,inset 0 0 0 13px #c5a34b;text-align:center}.inner{min-height:620px;padding:54px 58px;border:2px solid ${accent};display:flex;flex-direction:column;align-items:center;justify-content:center}.seal{width:74px;height:74px;border-radius:50%;display:grid;place-items:center;border:3px solid #c5a34b;color:#c5a34b;font-size:32px;margin-bottom:18px}.school{font:600 16px Arial,sans-serif;letter-spacing:3px;text-transform:uppercase;color:${accent}}h1{font-size:40px;margin:16px 0;color:${accent}}.subtitle{font:600 12px Arial,sans-serif;letter-spacing:4px;margin:12px 0 20px}.recipient{font-size:32px;color:${accent};border-bottom:2px solid #c5a34b;padding:0 18px 8px;margin:10px 0 18px}.body{max-width:660px;font-size:18px;line-height:1.65}.footer{width:100%;display:grid;grid-template-columns:1fr auto 1fr;gap:28px;align-items:end;margin-top:58px;font:14px Arial,sans-serif}.signature{border-top:1px solid #334155;padding-top:10px;min-width:160px}.valid{margin-top:12px;font:12px Arial,sans-serif;color:#6b7280}@media print{body{background:#fff;padding:0}.page{max-width:none;min-height:100vh;box-shadow:none;page-break-inside:avoid}}
      </style></head><body><main class="page"><div class="inner"><div class="seal">✦</div><div class="school">${institution}</div><h1>${title}</h1><div class="subtitle">THIS IS TO CERTIFY THAT</div><div class="recipient">${recipient}</div><p class="body">${body}</p>${validUntil}<div class="footer"><div class="signature"><strong>${signedBy || '&nbsp;'}</strong><br/>Signed by</div><div>${issueDate}</div><div class="signature"><strong>${coSignedBy || '&nbsp;'}</strong><br/>Co-signed by</div></div></div></main><script>window.onload=function(){window.focus();window.print();};</script></body></html>`);
    printWindow.document.close();
    setNotice('Print dialog opened. Choose Save as PDF to download a copy.');
  };

  const tabs: { id: StaffAchievementTab; label: string; icon: typeof Trophy }[] = [
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'training', label: 'Training & Certificates', icon: GraduationCap },
    { id: 'builder', label: 'Certificate Builder', icon: Award },
    { id: 'history', label: 'History', icon: Clock },
  ];

  const achievementProgress = Math.min(100, totalAchievements / 10 * 100);
  const trainingProgress = Math.min(100, completedTrainings / 8 * 100);
  const certificateProgress = Math.min(100, certificatesIssued / 5 * 100);

  if (!selectedEmployee) {
    return (
      <div className="min-h-screen space-y-6 bg-slate-50 p-4 text-gray-900 sm:p-6">
        <header className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-900 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-100 text-blue-700"><GraduationCap className="h-6 w-6" /></div>
            <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">School ERP</p><p className="text-lg font-bold">Staff Achievement</p></div>
          </div>
          <button type="button" aria-label="Notifications, 3 unread" className="relative w-fit rounded-full p-2 text-slate-700 hover:bg-slate-100"><Bell className="h-5 w-5" /><span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">3</span></button>
        </header>

        <Card className="p-5">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div><h1 className="text-xl font-bold text-gray-900">Find an Employee</h1><p className="mt-1 text-sm text-gray-500">Search the employee directory and open a staff achievement record.</p></div>
            <Badge variant="info">{filteredStaff.length} employee{filteredStaff.length === 1 ? '' : 's'}</Badge>
          </div>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input aria-label="Search employees for staff achievements" type="search" value={employeeSearch} onChange={(event) => setEmployeeSearch(event.target.value)} placeholder="Search by employee name, ID, designation, department, or branch" className={`${inputClass} py-2.5 pl-10`} />
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Employee</th><th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Employee ID</th><th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Designation / Department</th><th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Branch</th><th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Action</th></tr></thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredStaff.length ? filteredStaff.map((employee) => (
                  <tr key={employee.id} className="hover:bg-blue-50/50">
                    <td className="whitespace-nowrap px-4 py-3"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">{employee.initials}</span><span className="text-sm font-semibold text-gray-900">{employee.name}</span></div></td>
                    <td className="px-4 py-3 text-sm text-gray-700">{employee.employeeId}</td>
                    <td className="px-4 py-3"><p className="text-sm font-medium text-gray-900">{employee.designation}</p><p className="text-xs text-gray-500">{employee.department}</p></td>
                    <td className="px-4 py-3 text-sm text-gray-700">{employee.branch}</td>
                    <td className="px-4 py-3 text-right"><Button type="button" variant="primary" size="sm" onClick={() => openStaffWorkspace(employee)}>Open Staff Achievement</Button></td>
                  </tr>
                )) : <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">No employees match that search.</td></tr>}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 text-gray-900 sm:p-6">
      <style>{`
        .staff-achievement-grid { display:grid; grid-template-columns:minmax(0,1fr); gap:1.25rem; }
        .staff-certificate-layout { display:grid; grid-template-columns:minmax(0,1fr); gap:1.25rem; }
        .staff-achievement-main { display:grid; grid-template-columns:minmax(0,1fr); gap:1.25rem; }
        .staff-kpi-grid { display:grid; grid-template-columns:minmax(0,1fr); gap:1rem; }
        @media (min-width:900px) {
          .staff-achievement-grid { grid-template-columns:minmax(320px,0.9fr) minmax(0,1.4fr); }
          .staff-certificate-layout { grid-template-columns:minmax(330px,0.85fr) minmax(0,1.25fr); }
          .staff-achievement-main { grid-template-columns:minmax(0,1fr) minmax(0,1fr); }
          .staff-kpi-grid { grid-template-columns:repeat(4,minmax(0,1fr)); }
        }
        @keyframes staff-count-in { from { opacity:0; transform:translateY(5px) } to { opacity:1; transform:translateY(0) } }
        .staff-count-in { animation:staff-count-in .45s ease-out both; }
        @media (prefers-reduced-motion: reduce) { .staff-count-in { animation:none } }
      `}</style>

      <header className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-900 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-100 text-blue-700"><GraduationCap className="h-6 w-6" /></div>
          <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">School ERP</p><p className="text-lg font-bold text-gray-900">Staff Achievement</p></div>
        </div>
        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <Button type="button" variant="outline" size="sm" onClick={returnToStaffPicker}>Back to Employees</Button>
          <button type="button" aria-label="Notifications, 3 unread" className="relative rounded-full p-2 text-slate-700 hover:bg-slate-100"><Bell className="h-5 w-5" /><span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">3</span></button>
        </div>
      </header>

      <Card className="p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-2xl font-bold text-white">{selectedEmployee.initials}</div>
            <div>
              <div className="flex flex-wrap items-center gap-2"><h1 className="text-xl font-bold text-gray-900">{selectedEmployee.name}</h1><Badge variant="info">{selectedEmployee.employeeId}</Badge></div>
              <p className="mt-1 text-sm font-medium text-gray-700">{selectedEmployee.designation}</p>
              <p className="text-sm text-gray-500">{selectedEmployee.department} Department · {selectedEmployee.branch}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs"><span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600">Joined {formatDate(selectedEmployee.joiningDate)}</span><span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600">{selectedEmployee.experience} experience</span></div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:min-w-[360px] sm:gap-3">
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-center"><p className="text-xl font-bold text-blue-800"><AnimatedCount value={totalAchievements} /></p><p className="text-[11px] font-medium text-blue-700 sm:text-xs">Achievements</p></div>
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-center"><p className="text-xl font-bold text-emerald-800"><AnimatedCount value={totalTrainingRecords} /></p><p className="text-[11px] font-medium text-emerald-700 sm:text-xs">Trainings</p></div>
            <div className="rounded-xl border border-orange-100 bg-orange-50 p-3 text-center"><p className="text-xl font-bold text-orange-800"><AnimatedCount value={certificatesIssued} /></p><p className="text-[11px] font-medium text-orange-700 sm:text-xs">Certificates</p></div>
          </div>
        </div>
      </Card>

      <section className="staff-kpi-grid" aria-label="Staff achievement summary">
        {[
          { title: 'Total Achievements', value: totalAchievements, icon: Trophy, accent: 'border-blue-500', box: 'bg-blue-100 text-blue-700', text: 'text-blue-700', sub: 'Records on file' },
          { title: 'Trainings Completed', value: completedTrainings, icon: BookOpen, accent: 'border-emerald-500', box: 'bg-emerald-100 text-emerald-700', text: 'text-emerald-700', sub: 'Completed sessions' },
          { title: 'Certificates Issued', value: certificatesIssued, icon: Award, accent: 'border-orange-500', box: 'bg-orange-100 text-orange-700', text: 'text-orange-700', sub: 'Attached and built' },
          { title: 'Awards Received', value: awardsReceived, icon: Medal, accent: 'border-purple-500', box: 'bg-purple-100 text-purple-700', text: 'text-purple-700', sub: 'Award achievements' },
        ].map((metric) => {
          const Icon = metric.icon;
          return <Card key={metric.title} className={`staff-count-in border-l-4 ${metric.accent} p-4`}>
            <div className="flex items-center justify-between gap-3"><div><p className="text-sm text-gray-500">{metric.title}</p><p className={`mt-1 text-3xl font-bold ${metric.text}`}><AnimatedCount value={metric.value} /></p><p className="text-xs text-gray-400">{metric.sub}</p></div><div className={`grid h-12 w-12 place-items-center rounded-xl ${metric.box}`}><Icon className="h-6 w-6" /></div></div>
          </Card>;
        })}
      </section>

      {notice && <div role="status" className="flex items-start justify-between gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900"><span>{notice}</span><button type="button" aria-label="Dismiss message" onClick={() => setNotice('')} className="rounded p-0.5 hover:bg-blue-100"><X className="h-4 w-4" /></button></div>}

      <nav className="flex flex-wrap gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm" aria-label="Staff achievement sections">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const selected = activeTab === tab.id;
          return <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} aria-selected={selected} role="tab" className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${selected ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}><Icon className="h-4 w-4" />{tab.label}</button>;
        })}
      </nav>

      {activeTab === 'achievements' && <div className="staff-achievement-grid">
        <Card className="p-5">
          <div className="mb-5 flex items-center gap-3"><div className="rounded-xl bg-blue-100 p-2.5 text-blue-700"><Trophy className="h-5 w-5" /></div><div><h2 className="font-semibold text-gray-900">Add Achievement</h2><p className="text-xs text-gray-500">Record awards, publications, recognition, and milestones.</p></div></div>
          <form className="space-y-4" onSubmit={handleAchievementSubmit}>
            <div><label className={labelClass}>Achievement Type</label><select value={achievementForm.type} onChange={(event) => updateAchievementForm('type', event.target.value as AchievementType)} className={inputClass}>{achievementTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select></div>
            <div><label className={labelClass}>Achievement Title <span className="text-rose-600">*</span></label><input required value={achievementForm.title} onChange={(event) => updateAchievementForm('title', event.target.value)} placeholder="Enter achievement title" className={inputClass} /></div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div><label className={labelClass}>Date Received <span className="text-rose-600">*</span></label><input required type="date" value={achievementForm.dateReceived} onChange={(event) => updateAchievementForm('dateReceived', event.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>Level</label><select value={achievementForm.level} onChange={(event) => updateAchievementForm('level', event.target.value as AchievementLevel)} className={inputClass}>{achievementLevels.map((level) => <option key={level}>{level}</option>)}</select></div>
            </div>
            <div><label className={labelClass}>Issued By</label><input value={achievementForm.issuedBy} onChange={(event) => updateAchievementForm('issuedBy', event.target.value)} placeholder="Organization / authority" className={inputClass} /></div>
            <div><label className={labelClass}>Description</label><textarea rows={3} value={achievementForm.description} onChange={(event) => updateAchievementForm('description', event.target.value)} placeholder="Add context or outcome" className={inputClass} /></div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div><label className={labelClass}>Supporting Document (PDF / JPG / PNG)</label><input type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" onChange={(event) => setAchievementDocument(event.target.files?.[0]?.name || '')} className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-blue-700" />{achievementDocument && <p className="mt-1 truncate text-xs text-gray-500">Selected: {achievementDocument}</p>}</div>
              <div><label className={labelClass}>Certificate Attached?</label><select value={achievementForm.certificateAttached} onChange={(event) => updateAchievementForm('certificateAttached', event.target.value as 'Yes' | 'No')} className={inputClass}><option>Yes</option><option>No</option></select></div>
            </div>
            <Button type="submit" variant="primary" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">Save Achievement</Button>
          </form>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-semibold text-gray-900">Achievement Records</h2><p className="text-xs text-gray-500">{records.achievements.length} saved record{records.achievements.length === 1 ? '' : 's'}</p></div><Button variant="outline" size="sm" onClick={exportAchievements} disabled={isExporting} leftIcon={<Download className="h-4 w-4" />}>{isExporting ? 'Exporting…' : 'Export'}</Button></div>
          <div className="relative mb-4"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input type="search" value={achievementSearch} onChange={(event) => setAchievementSearch(event.target.value)} placeholder="Search achievements" className={`${inputClass} pl-10`} /></div>
          {filteredAchievements.length ? <div className="max-h-[780px] space-y-3 overflow-y-auto pr-1">
            {filteredAchievements.map((record, index) => <article key={record.id} className={`rounded-xl border border-gray-200 border-l-4 ${achievementCardBorders[index % achievementCardBorders.length]} bg-white p-4 shadow-sm`}>
              <div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><p className="text-xs font-semibold text-gray-500">{record.type}</p><h3 className="mt-1 break-words font-semibold text-gray-900">{record.title}</h3></div><span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">{record.level}</span></div>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500"><span>Issued by: <strong className="font-medium text-gray-700">{record.issuedBy || '—'}</strong></span><span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatDate(record.dateReceived)}</span><StatusPill status={record.certificateAttached === 'Yes' ? 'Yes' : 'No'} /></div>
              <div className="mt-4 flex justify-end gap-2"><Button type="button" variant="outline" size="sm" onClick={() => openAchievementDetails(record)} leftIcon={<Eye className="h-4 w-4" />}>View</Button><Button type="button" variant="ghost" size="sm" aria-label={`Delete ${record.title}`} onClick={() => deleteAchievement(record.id)} className="text-rose-600 hover:bg-rose-50"><Trash2 className="h-4 w-4" /></Button></div>
            </article>)}
          </div> : <div className="rounded-xl border border-dashed border-gray-300 px-6 py-12 text-center"><Trophy className="mx-auto h-10 w-10 text-gray-300" /><h3 className="mt-3 font-semibold text-gray-800">{records.achievements.length ? 'No matching achievements' : 'No achievements yet'}</h3><p className="mt-1 text-sm text-gray-500">{records.achievements.length ? 'Try another search term.' : 'Add an achievement to start building this employee record.'}</p></div>}
        </Card>
      </div>}

      {activeTab === 'training' && <div className="staff-achievement-grid">
        <Card className="p-5">
          <div className="mb-5 flex items-center gap-3"><div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700"><BookOpen className="h-5 w-5" /></div><div><h2 className="font-semibold text-gray-900">Add Training Record</h2><p className="text-xs text-gray-500">Keep professional development details together.</p></div></div>
          <form className="space-y-4" onSubmit={handleTrainingSubmit}>
            <div><label className={labelClass}>Training Title <span className="text-rose-600">*</span></label><input required value={trainingForm.title} onChange={(event) => updateTrainingForm('title', event.target.value)} placeholder="Training or workshop title" className={inputClass} /></div>
            <div><label className={labelClass}>Training Category</label><select value={trainingForm.category} onChange={(event) => updateTrainingForm('category', event.target.value as TrainingCategory)} className={inputClass}>{trainingCategories.map((category) => <option key={category}>{category}</option>)}</select></div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><div><label className={labelClass}>Start Date <span className="text-rose-600">*</span></label><input required type="date" value={trainingForm.startDate} onChange={(event) => updateTrainingForm('startDate', event.target.value)} className={inputClass} /></div><div><label className={labelClass}>End Date</label><input type="date" value={trainingForm.endDate} onChange={(event) => updateTrainingForm('endDate', event.target.value)} className={inputClass} /></div></div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><div><label className={labelClass}>Duration (days)</label><input type="number" min="0" value={trainingForm.durationDays} onChange={(event) => updateTrainingForm('durationDays', event.target.value)} className={inputClass} /></div><div><label className={labelClass}>Mode</label><select value={trainingForm.mode} onChange={(event) => updateTrainingForm('mode', event.target.value as TrainingMode)} className={inputClass}>{trainingModes.map((mode) => <option key={mode}>{mode}</option>)}</select></div></div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><div><label className={labelClass}>Organized By</label><input value={trainingForm.organizedBy} onChange={(event) => updateTrainingForm('organizedBy', event.target.value)} className={inputClass} /></div><div><label className={labelClass}>Venue / Platform</label><input value={trainingForm.venue} onChange={(event) => updateTrainingForm('venue', event.target.value)} className={inputClass} /></div></div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><div><label className={labelClass}>Certificate Received?</label><select value={trainingForm.certificateReceived} onChange={(event) => updateTrainingForm('certificateReceived', event.target.value as TrainingCertificateStatus)} className={inputClass}>{trainingCertificateOptions.map((option) => <option key={option}>{option}</option>)}</select></div><div><label className={labelClass}>Status</label><select value={trainingForm.status} onChange={(event) => updateTrainingForm('status', event.target.value as TrainingStatus)} className={inputClass}>{trainingStatuses.map((status) => <option key={status}>{status}</option>)}</select></div></div>
            <div><label className={labelClass}>Skills Gained</label><input value={trainingForm.skillsGained} onChange={(event) => updateTrainingForm('skillsGained', event.target.value)} placeholder="Comma-separated skills" className={inputClass} /></div>
            <div><label className={labelClass}>Remarks</label><textarea rows={3} value={trainingForm.remarks} onChange={(event) => updateTrainingForm('remarks', event.target.value)} className={inputClass} /></div>
            <Button type="submit" variant="primary" className="w-full">Save Training Record</Button>
          </form>
        </Card>

        <Card className="overflow-hidden p-0">
          <div className="flex flex-col gap-3 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-semibold text-gray-900">Training & Certificates</h2><p className="text-xs text-gray-500">{completedTrainings} completed · {totalTrainingRecords} total records</p></div><div className="relative w-full sm:max-w-xs"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input type="search" value={trainingSearch} onChange={(event) => setTrainingSearch(event.target.value)} placeholder="Search training records" className={`${inputClass} pl-10`} /></div></div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Training Name + Org</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Date Range</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Mode</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Certificate</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredTrainings.length > 0 ? filteredTrainings.map((record, index) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                    <td className="px-4 py-3"><p className="min-w-40 text-sm font-semibold text-gray-900">{record.title}</p><p className="text-xs text-gray-500">{record.organizedBy || '—'}</p></td>
                    <td className="px-4 py-3"><span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">{record.category}</span></td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-600">{formatDate(record.startDate)}{record.endDate ? ` – ${formatDate(record.endDate)}` : ''}</td>
                    <td className="px-4 py-3"><span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">{record.mode}</span></td>
                    <td className="px-4 py-3"><StatusPill status={record.status} /></td>
                    <td className="px-4 py-3"><StatusPill status={record.certificateReceived} /></td>
                    <td className="whitespace-nowrap px-4 py-3 text-right"><div className="flex justify-end gap-1"><Button type="button" variant="outline" size="xs" aria-label={`View ${record.title}`} onClick={() => openTrainingDetails(record)}><Eye className="h-4 w-4" /></Button><Button type="button" variant="ghost" size="xs" aria-label={`Delete ${record.title}`} className="text-rose-600" onClick={() => deleteTraining(record.id)}><Trash2 className="h-4 w-4" /></Button></div></td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <BookOpen className="mx-auto h-10 w-10 text-gray-300" />
                      <p className="mt-3 font-semibold text-gray-800">{records.trainings.length ? 'No matching training records' : 'No training records yet'}</p>
                      <p className="mt-1 text-sm text-gray-500">{records.trainings.length ? 'Try another search term.' : 'Saved trainings will appear in this table.'}</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>}

      {activeTab === 'builder' && <div className="staff-certificate-layout">
        <Card className="p-5">
          <div className="mb-5 flex items-center gap-3"><div className="rounded-xl bg-purple-100 p-2.5 text-purple-700"><Award className="h-5 w-5" /></div><div><h2 className="font-semibold text-gray-900">Certificate Builder</h2><p className="text-xs text-gray-500">Edit the fields and preview the certificate live.</p></div></div>
          <div className="mb-4 grid grid-cols-2 gap-2">{certificateTypes.map((type) => {
            const Icon = type === 'Training' ? BookOpen : type === 'Participation' ? Star : type === 'Appreciation' ? Sparkles : Trophy;
            const selected = certificateForm.type === type;
            return <button key={type} type="button" onClick={() => updateCertificateForm('type', type)} className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-sm font-semibold transition-colors ${selected ? 'border-blue-500 bg-blue-50 text-blue-800 ring-2 ring-blue-100' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}><Icon className="h-5 w-5" />{type}</button>;
          })}</div>
          <div className="space-y-4">
            <div><label className={labelClass}>Recipient Name <span className="text-rose-600">*</span></label><input required value={certificateForm.recipientName} onChange={(event) => updateCertificateForm('recipientName', event.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>Certificate Title <span className="text-rose-600">*</span></label><input required value={certificateForm.title} onChange={(event) => updateCertificateForm('title', event.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>Description / Body Text</label><textarea rows={3} value={certificateForm.body} onChange={(event) => updateCertificateForm('body', event.target.value)} className={inputClass} /></div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><div><label className={labelClass}>Issue Date <span className="text-rose-600">*</span></label><input required type="date" value={certificateForm.issueDate} onChange={(event) => updateCertificateForm('issueDate', event.target.value)} className={inputClass} /></div><div><label className={labelClass}>Valid Until</label><input type="date" value={certificateForm.validUntil} onChange={(event) => updateCertificateForm('validUntil', event.target.value)} className={inputClass} /></div></div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><div><label className={labelClass}>Signed By</label><input value={certificateForm.signedBy} onChange={(event) => updateCertificateForm('signedBy', event.target.value)} className={inputClass} /></div><div><label className={labelClass}>Co-Signed By</label><input value={certificateForm.coSignedBy} onChange={(event) => updateCertificateForm('coSignedBy', event.target.value)} className={inputClass} /></div></div>
            <div><label className={labelClass}>Institution Name</label><input value={certificateForm.institutionName} onChange={(event) => updateCertificateForm('institutionName', event.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>Color Theme</label><div className="flex flex-wrap gap-3">{themeOptions.map((theme) => <button key={theme.id} type="button" aria-label={`${theme.label} certificate theme`} aria-pressed={certificateForm.theme === theme.id} onClick={() => updateCertificateForm('theme', theme.id)} className={`h-9 w-9 rounded-full border-4 transition-transform ${certificateForm.theme === theme.id ? 'scale-110 border-gray-900 ring-2 ring-gray-200' : 'border-white shadow hover:scale-105'}`} style={{ backgroundColor: theme.accent }} />)}</div></div>
            <div className="flex flex-col gap-2 border-t pt-4 sm:flex-row"><Button type="button" variant="primary" className="flex-1" onClick={handleCertificateSave} disabled={!certificateForm.recipientName.trim() || !certificateForm.title.trim() || !certificateForm.issueDate}>Save Certificate</Button><Button type="button" variant="outline" className="flex-1" onClick={printCertificate} leftIcon={<Printer className="h-4 w-4" />}>Print / Download</Button></div>
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-2"><div><h2 className="font-semibold text-gray-900">Live Certificate Preview</h2><p className="text-xs text-gray-500">Updates as certificate details change.</p></div><Badge variant="secondary">{certificateForm.type}</Badge></div>
            <div className="rounded-xl bg-gray-100 p-3 sm:p-5">
              <div className="rounded-lg border-[7px] border-[#c5a34b] bg-white p-2 shadow-sm" style={{ boxShadow: `inset 0 0 0 2px ${selectedTheme.accent}, inset 0 0 0 9px white, inset 0 0 0 11px #c5a34b` }}>
                <div className="flex min-h-[420px] flex-col items-center justify-center border-2 px-5 py-8 text-center sm:min-h-[500px] sm:px-10" style={{ borderColor: selectedTheme.accent, backgroundColor: selectedTheme.light }}>
                  <div className="mb-4 grid h-16 w-16 place-items-center rounded-full border-[3px] border-[#c5a34b] bg-white text-[#c5a34b]"><Award className="h-8 w-8" /></div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: selectedTheme.accent }}>{certificateForm.institutionName || 'School Name'}</p>
                  <h3 className="mt-4 font-serif text-2xl font-bold sm:text-3xl" style={{ color: selectedTheme.accent }}>{certificateForm.title || 'Certificate Title'}</h3>
                  <p className="mt-4 text-[10px] font-bold tracking-[0.24em] text-gray-600 sm:text-xs">THIS IS TO CERTIFY THAT</p>
                  <p className="mt-3 border-b-2 border-[#c5a34b] px-4 pb-2 font-serif text-xl font-semibold sm:text-2xl" style={{ color: selectedTheme.accent }}>{certificateForm.recipientName || 'Recipient Name'}</p>
                  <p className="mt-4 max-w-xl whitespace-pre-wrap text-sm leading-6 text-gray-700 sm:text-base">{certificateForm.body || 'Certificate body text will appear here.'}</p>
                  {certificateForm.validUntil && <p className="mt-2 text-xs text-gray-500">Valid until {formatDate(certificateForm.validUntil)}</p>}
                  <div className="mt-10 grid w-full grid-cols-[1fr_auto_1fr] items-end gap-3 text-[10px] text-gray-600 sm:gap-8 sm:text-xs"><div className="border-t border-gray-500 pt-2"><strong className="block text-gray-800">{certificateForm.signedBy || 'Signed by'}</strong>Signed by</div><div className="pb-2 font-medium">{formatDate(certificateForm.issueDate)}</div><div className="border-t border-gray-500 pt-2"><strong className="block text-gray-800">{certificateForm.coSignedBy || 'Co-signed by'}</strong>Co-signed by</div></div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between"><div><h2 className="font-semibold text-gray-900">Saved Certificates</h2><p className="text-xs text-gray-500">{records.certificates.length} saved</p></div><Badge variant="info">{records.certificates.length}</Badge></div>
            {records.certificates.length ? <div className="space-y-2">{records.certificates.map((certificate) => {
              const theme = themeOptions.find((item) => item.id === certificate.theme) || themeOptions[0];
              return <div key={certificate.id} className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 border-l-4 bg-white p-3" style={{ borderLeftColor: theme.accent }}><div className="min-w-0"><p className="truncate text-sm font-semibold text-gray-900">{certificate.title}</p><p className="truncate text-xs text-gray-500">{certificate.recipientName} · {formatDate(certificate.issueDate)}</p><span className="mt-1 inline-block rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-purple-700">{certificate.type}</span></div><Button type="button" variant="ghost" size="sm" aria-label={`Delete ${certificate.title}`} className="shrink-0 text-rose-600" onClick={() => deleteCertificate(certificate.id)}><Trash2 className="h-4 w-4" /></Button></div>;
            })}</div> : <div className="rounded-lg border border-dashed border-gray-300 p-7 text-center"><FileText className="mx-auto h-8 w-8 text-gray-300" /><p className="mt-2 text-sm font-medium text-gray-700">No certificates saved</p><p className="mt-1 text-xs text-gray-500">Save a certificate to add it here.</p></div>}
          </Card>
        </div>
      </div>}

      {activeTab === 'history' && <div className="staff-achievement-main">
        <Card className="p-5">
          <div className="mb-5 flex items-center gap-3"><div className="rounded-xl bg-blue-100 p-2.5 text-blue-700"><Star className="h-5 w-5" /></div><div><h2 className="font-semibold text-gray-900">Progress Goals</h2><p className="text-xs text-gray-500">Progress is calculated from saved records.</p></div></div>
          {[
            { label: 'Achievements Goal', value: totalAchievements, goal: 10, color: 'bg-blue-500', text: 'text-blue-700' },
            { label: 'Training Completion', value: completedTrainings, goal: 8, color: 'bg-emerald-500', text: 'text-emerald-700' },
            { label: 'Certificates Issued', value: certificatesIssued, goal: 5, color: 'bg-orange-500', text: 'text-orange-700' },
          ].map((goal) => <div key={goal.label} className="mb-6 last:mb-0"><div className="mb-2 flex items-center justify-between gap-2"><p className="text-sm font-semibold text-gray-800">{goal.label}</p><p className={`text-sm font-bold ${goal.text}`}>{Math.min(goal.value, goal.goal)}/{goal.goal}</p></div><div className="h-3 overflow-hidden rounded-full bg-gray-100"><div className={`${goal.color} h-full rounded-full transition-all duration-700`} style={{ width: `${Math.min(100, goal.value / goal.goal * 100)}%` }} /></div><p className="mt-1 text-right text-xs text-gray-500">{Math.round(Math.min(100, goal.value / goal.goal * 100))}%</p></div>)}
          <div className="mt-6 border-t pt-4"><label className={labelClass} htmlFor="achievement-history-year">Filter timeline by year</label><select id="achievement-history-year" value={historyYear} onChange={(event) => setHistoryYear(event.target.value)} className={inputClass}><option value="All">All</option><option value="2024">2024</option><option value="2023">2023</option><option value="2022">2022</option></select></div>
        </Card>

        <Card className="p-5">
          <div className="mb-5 flex items-center justify-between gap-3"><div><h2 className="font-semibold text-gray-900">Achievement & Development Timeline</h2><p className="text-xs text-gray-500">Achievements, trainings, and certificates sorted newest first.</p></div><Badge variant="info">{timelineItems.length} items</Badge></div>
          {timelineItems.length ? <div className="relative ml-2 space-y-0 border-l-2 border-gray-200 pl-6">{timelineItems.map((item) => {
            const dotClass = item.type === 'achievement' ? 'bg-blue-500 ring-blue-100' : item.type === 'training' && item.trainingStatus === 'Completed' ? 'bg-emerald-500 ring-emerald-100' : 'bg-orange-500 ring-orange-100';
            const Icon = item.type === 'achievement' ? Trophy : item.type === 'training' ? BookOpen : Award;
            return <article key={`${item.type}-${item.id}`} className="relative pb-6 last:pb-0"><span className={`absolute -left-[34px] top-1 h-4 w-4 rounded-full ring-4 ${dotClass}`} /><div className="rounded-xl border border-gray-100 bg-gray-50 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div className="flex min-w-0 items-start gap-3"><div className="rounded-lg bg-white p-2 shadow-sm"><Icon className="h-4 w-4 text-gray-600" /></div><div className="min-w-0"><h3 className="break-words text-sm font-semibold text-gray-900">{item.title}</h3><p className="mt-0.5 text-xs text-gray-500">{item.subtitle}</p></div></div><span className="whitespace-nowrap text-xs font-medium text-gray-500">{formatDate(item.date)}</span></div><div className="mt-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.type === 'achievement' ? 'bg-blue-100 text-blue-800' : item.type === 'training' && item.trainingStatus === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'}`}>{item.badge}</span></div></div></article>;
          })}</div> : <div className="rounded-xl border border-dashed border-gray-300 px-6 py-12 text-center"><Clock className="mx-auto h-10 w-10 text-gray-300" /><h3 className="mt-3 font-semibold text-gray-800">{records.achievements.length + records.trainings.length + records.certificates.length ? 'No records for this year' : 'No history yet'}</h3><p className="mt-1 text-sm text-gray-500">{records.achievements.length + records.trainings.length + records.certificates.length ? 'Choose another year to see more records.' : 'Saved achievements, trainings, and certificates will appear here.'}</p></div>}
        </Card>
      </div>}

      <Modal isOpen={Boolean(detailModal)} onClose={() => setDetailModal(null)} title={detailModal?.title} size="lg">
        {detailModal && <div className="space-y-4"><p className="text-sm text-gray-500">{detailModal.subtitle}</p><DetailRows rows={detailModal.rows} /></div>}
      </Modal>
    </div>
  );
}

export default StaffAchievement;
