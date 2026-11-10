import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Textarea } from '../../../components/ui/Textarea';
import { Modal } from '../../../components/ui/Modal';

const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

type Visibility = 'Locked' | 'Released' | 'Revoked';
type SlipKind = 'Regular' | 'Supplementary';
type HoldReason =
  | ''
  | 'Pending Asset Return'
  | 'Library Books Not Returned'
  | 'Clearance Form Incomplete'
  | 'Disciplinary Inquiry Active'
  | 'Bank Detail Error/Change in Progress'
  | 'Full & Final Settlement Pending'
  | 'Salary Advance Recovery Pending'
  | 'Investigation in Progress'
  | 'Resigned — Exit Process Incomplete'
  | 'Other';

type Slip = {
  id: string;
  employeeId: string;
  name: string;
  designation: string;
  department: string;
  staffCategory: string;
  empType: 'Teaching' | 'Non-Teaching' | 'Contractual';
  branch: string;
  net: number;
  supplementary: number;
  visibility: Visibility;
  holdReason: HoldReason;
  holdOther: string;
  holdBy: string;
  holdDate: string;
  firstViewed: string;
  downloaded: boolean;
  kind: SlipKind;
  month: string;
  neverReleased: boolean;
};

type Audit = { at: string; action: string; by: string; role: string; target: string; reason: string; from: string; to: string };
type Delivery = { id: string; employee: string; channel: string; at: string; status: 'Sent' | 'Failed' | 'Pending' };
type GroupPlan = { group: string; when: string };

const HOLD_OPTIONS: HoldReason[] = [
  'Pending Asset Return',
  'Library Books Not Returned',
  'Clearance Form Incomplete',
  'Disciplinary Inquiry Active',
  'Bank Detail Error/Change in Progress',
  'Full & Final Settlement Pending',
  'Salary Advance Recovery Pending',
  'Investigation in Progress',
  'Resigned — Exit Process Incomplete',
  'Other'
];

const PERIODS = [
  { value: 'FY 2026-27', label: 'FY 2026-27 (01-04-2026 to 31-03-2027)' }
];
const MONTHS = [
  { value: '2026-10', label: 'October 2026' },
  { value: '2026-11', label: 'November 2026' },
  { value: '2027-03', label: 'March 2027' }
];

const SEED: Slip[] = [
  { id: 'HR-SLIP-10-2026-0023', employeeId: 'EMP-1042', name: 'Meera Iyer', designation: 'PGT Physics', department: 'Science', staffCategory: 'Permanent Teaching', empType: 'Teaching', branch: 'Main Campus', net: 85377, supplementary: 28500, visibility: 'Locked', holdReason: '', holdOther: '', holdBy: '', holdDate: '', firstViewed: '', downloaded: false, kind: 'Regular', month: '2026-10', neverReleased: true },
  { id: 'HR-SLIP-10-2026-0024', employeeId: 'EMP-1088', name: 'Rajesh Kumar', designation: 'TGT Maths', department: 'Mathematics', staffCategory: 'Permanent Teaching', empType: 'Teaching', branch: 'Main Campus', net: 62700, supplementary: 12000, visibility: 'Released', holdReason: '', holdOther: '', holdBy: '', holdDate: '', firstViewed: '2026-11-02 09:14', downloaded: true, kind: 'Regular', month: '2026-10', neverReleased: false },
  { id: 'HR-SLIP-10-2026-0025', employeeId: 'EMP-1101', name: 'Kavita Shah', designation: 'Clerk', department: 'Administration', staffCategory: 'Administrative', empType: 'Non-Teaching', branch: 'Main Campus', net: 42000, supplementary: 0, visibility: 'Locked', holdReason: 'Library Books Not Returned', holdOther: '', holdBy: 'Payroll Manager', holdDate: '2026-11-01', firstViewed: '', downloaded: false, kind: 'Regular', month: '2026-10', neverReleased: true },
  { id: 'HR-SLIP-10-2026-0026', employeeId: 'EMP-1301', name: 'Visiting Coach', designation: 'Coach', department: 'Sports', staffCategory: 'Contractual', empType: 'Contractual', branch: 'North Campus', net: 25000, supplementary: 0, visibility: 'Revoked', holdReason: 'Bank Detail Error/Change in Progress', holdOther: '', holdBy: 'Finance Officer', holdDate: '2026-11-03', firstViewed: '2026-11-02 18:02', downloaded: false, kind: 'Regular', month: '2026-10', neverReleased: false },
  { id: 'HR-SLIP-10-2026-0027', employeeId: 'EMP-1118', name: 'Hostel Warden', designation: 'Warden', department: 'Administration', staffCategory: 'Non-Teaching', empType: 'Non-Teaching', branch: 'Main Campus', net: 38000, supplementary: 0, visibility: 'Locked', holdReason: '', holdOther: '', holdBy: '', holdDate: '', firstViewed: '', downloaded: false, kind: 'Regular', month: '2026-10', neverReleased: true },
  { id: 'ADS-2026-088', employeeId: 'EMP-1088', name: 'Rajesh Kumar', designation: 'TGT Maths', department: 'Mathematics', staffCategory: 'Permanent Teaching', empType: 'Teaching', branch: 'Main Campus', net: 12000, supplementary: 12000, visibility: 'Locked', holdReason: '', holdOther: '', holdBy: '', holdDate: '', firstViewed: '', downloaded: false, kind: 'Supplementary', month: '2026-10', neverReleased: true },
  { id: 'ARR-2026-014', employeeId: 'EMP-1042', name: 'Meera Iyer', designation: 'PGT Physics', department: 'Science', staffCategory: 'Permanent Teaching', empType: 'Teaching', branch: 'Main Campus', net: 28500, supplementary: 28500, visibility: 'Locked', holdReason: '', holdOther: '', holdBy: '', holdDate: '', firstViewed: '', downloaded: false, kind: 'Supplementary', month: '2026-10', neverReleased: true },
  { id: 'COR-2026-007', employeeId: 'EMP-1042', name: 'Meera Iyer', designation: 'PGT Physics', department: 'Science', staffCategory: 'Permanent Teaching', empType: 'Teaching', branch: 'Main Campus', net: 1923, supplementary: 1923, visibility: 'Locked', holdReason: '', holdOther: '', holdBy: '', holdDate: '', firstViewed: '', downloaded: false, kind: 'Supplementary', month: '2026-10', neverReleased: true }
];

const nowStamp = () => '2026-11-06 11:40';

export function PayslipLockRelease() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'regular' | 'supplementary' | 'notify' | 'audit'>('regular');
  const [period] = useState('FY 2026-27');
  const [month, setMonth] = useState('2026-10');
  const [branch, setBranch] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [empType, setEmpType] = useState('');
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [rows, setRows] = useState<Slip[]>(SEED);
  const [selected, setSelected] = useState<string[]>([]);
  const [notice, setNotice] = useState('');
  const [reason, setReason] = useState('');
  const [confirm, setConfirm] = useState<'lock' | 'release' | 'revoke' | 'override' | 'emergency' | null>(null);
  const [overrideId, setOverrideId] = useState('');
  const [role, setRole] = useState<'Payroll Manager' | 'Finance Officer' | 'Principal' | 'School Administrator'>('Payroll Manager');
  const [hrDone, setHrDone] = useState(false);
  const [financeDone, setFinanceDone] = useState(false);
  const [principalDone, setPrincipalDone] = useState(false);
  const [supFinance, setSupFinance] = useState(false);
  const [supPrincipal, setSupPrincipal] = useState(false);
  const [emergency, setEmergency] = useState(false);
  const [rejectNote, setRejectNote] = useState('');
  const [scheduleAt, setScheduleAt] = useState('2026-11-07T09:00');
  const [scheduled, setScheduled] = useState('');
  const [groupBy, setGroupBy] = useState<'Department' | 'Employee Type'>('Employee Type');
  const [groupPlan, setGroupPlan] = useState<GroupPlan[]>([
    { group: 'Non-Teaching', when: '2026-11-01T09:00' },
    { group: 'Teaching', when: '2026-11-03T09:00' },
    { group: 'Contractual', when: '2026-11-05T09:00' }
  ]);
  const [channels, setChannels] = useState<string[]>(['System Notification', 'Email']);
  const [template, setTemplate] = useState('Standard Monthly Release');
  const [deliveries, setDeliveries] = useState<Delivery[]>([
    { id: 'N-1', employee: 'Rajesh Kumar', channel: 'Email', at: '2026-11-02 09:00', status: 'Sent' },
    { id: 'N-2', employee: 'Visiting Coach', channel: 'SMS', at: '2026-11-03 10:12', status: 'Failed' }
  ]);
  const [audit, setAudit] = useState<Audit[]>([
    { at: '2026-11-02 08:55', action: 'Release', by: 'HR Admin', role: 'Payroll Manager', target: 'EMP-1088', reason: 'Teaching staff first wave', from: 'Locked', to: 'Released' },
    { at: '2026-11-03 10:05', action: 'Revoke', by: 'Finance Officer', role: 'Finance Officer', target: 'EMP-1301', reason: 'Incorrect bank IFSC after NEFT reject', from: 'Released', to: 'Revoked' }
  ]);
  const [marchTicks, setMarchTicks] = useState({ supp: false, proof: false, recon: false, challan: false, bank: false });
  const [sortKey, setSortKey] = useState<'name' | 'net' | 'visibility'>('name');

  const flash = (t: string) => { setNotice(t); window.setTimeout(() => setNotice(''), 5000); };
  const isMarch = month === '2027-03';
  const payrollSubmitted = month !== '2026-11';
  const bankFile = month === '2026-10' || month === '2027-03';
  const reconSigned = false;
  const form16Ready = false;
  const challanMissing = isMarch;

  const hardBlocks: { label: string; href: string }[] = [];
  if (!payrollSubmitted) hardBlocks.push({ label: 'Payroll Entry is not Submitted', href: '/hr/payroll/payroll-entry' });
  if (isMarch && !reconSigned) hardBlocks.push({ label: 'Annual Tax Reconciliation is not Signed Off', href: '/hr/income-tax/annual-tax-reconciliation-finalisation' });

  const softWarnings: { label: string; href: string }[] = [];
  if (!bankFile) softWarnings.push({ label: 'Bank file not generated — schools usually wait until NEFT is confirmed', href: '/hr/payroll/salary-disbursement-bank-advice' });
  if (isMarch && challanMissing) softWarnings.push({ label: 'TDS challan missing / unreconciled for one or more months', href: '/hr/income-tax/challan-tax-payment-register' });
  if (isMarch && !form16Ready) softWarnings.push({ label: 'Form 16 prerequisites not met — Form 16 may be delayed even if payslips are released', href: '/hr/income-tax/form-16-annual-statement-export' });

  const kind: SlipKind = tab === 'supplementary' ? 'Supplementary' : 'Regular';
  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (r.kind !== kind) return false;
      if (r.month !== month && month !== '2026-11') return r.month === month;
      if (month === '2026-11') return false;
      if (branch && r.branch !== branch) return false;
      if (department && r.department !== department) return false;
      if (designation && r.designation !== designation) return false;
      if (empType && r.empType !== empType) return false;
      if (category && r.staffCategory !== category) return false;
      if (search && !`${r.name} ${r.employeeId} ${r.id}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }).sort((a, b) => {
      if (sortKey === 'net') return b.net - a.net;
      if (sortKey === 'visibility') return a.visibility.localeCompare(b.visibility);
      return a.name.localeCompare(b.name);
    });
  }, [rows, kind, month, branch, department, designation, empType, category, search, sortKey]);

  const counts = {
    total: filtered.length,
    locked: filtered.filter((r) => r.visibility === 'Locked' && !r.holdReason).length,
    held: filtered.filter((r) => r.holdReason).length,
    released: filtered.filter((r) => r.visibility === 'Released').length,
    revoked: filtered.filter((r) => r.visibility === 'Revoked').length
  };

  const log = (action: string, target: string, reasonText: string, from: string, to: string) => {
    setAudit((p) => [{ at: nowStamp(), action, by: 'Current User', role, target, reason: reasonText, from, to }, ...p]);
  };

  const patchMany = (ids: string[], next: Partial<Slip>, action: string, reasonText: string) => {
    setRows((p) => p.map((r) => {
      if (!ids.includes(r.id)) return r;
      log(action, r.employeeId, reasonText, r.visibility, (next.visibility as string) || r.visibility);
      return { ...r, ...next };
    }));
  };

  const approvalReady = tab === 'supplementary'
    ? (supFinance && supPrincipal) || emergency
    : (hrDone && financeDone && principalDone) || emergency;

  const marchChecklistOk = !isMarch || (marchTicks.supp && marchTicks.proof && marchTicks.recon && marchTicks.challan && marchTicks.bank);
  const canReleaseAll = payrollSubmitted && hardBlocks.length === 0 && approvalReady && marchChecklistOk;

  const heldIds = filtered.filter((r) => r.holdReason).map((r) => r.id);

  const doLockAll = () => {
    const ids = filtered.map((r) => r.id);
    const revoking = filtered.filter((r) => r.visibility === 'Released');
    if (revoking.length && !reason.trim()) { flash('Reason is mandatory when Lock All revokes previously released slips.'); return; }
    patchMany(ids, { visibility: 'Locked', neverReleased: false }, revoking.length ? 'Revoke' : 'Lock', reason || 'Lock All');
    if (revoking.length) {
      setDeliveries((p) => [
        ...revoking.map((r) => ({ id: `N-${Date.now()}-${r.id}`, employee: r.name, channel: 'System Notification', at: nowStamp(), status: 'Sent' as const })),
        ...p
      ]);
    }
    setConfirm(null);
    flash(`Locked ${ids.length} slip(s). Previously released slips are now Revoked/Locked and hidden on the employee portal.`);
  };

  const doReleaseAll = () => {
    if (!canReleaseAll) { flash('Release All is blocked until hard prerequisites and approvals are met.'); return; }
    const ids = filtered.filter((r) => !r.holdReason).map((r) => r.id);
    patchMany(ids, { visibility: 'Released', neverReleased: false }, 'Release', reason || 'Release All');
    setDeliveries((p) => [
      ...ids.map((id) => {
        const r = rows.find((x) => x.id === id)!;
        return { id: `N-${Date.now()}-${id}`, employee: r.name, channel: channels[0] || 'Email', at: nowStamp(), status: 'Sent' as const };
      }),
      ...p
    ]);
    setConfirm(null);
    flash(`Released ${ids.length} slip(s). ${heldIds.length} held employee(s) skipped. Portal shows only visibility_status = Released.`);
  };

  const doRevoke = () => {
    if (!reason.trim()) { flash('Revoke requires a mandatory reason.'); return; }
    const ids = (selected.length ? selected : filtered.filter((r) => r.visibility === 'Released').map((r) => r.id));
    patchMany(ids, { visibility: 'Revoked' }, 'Revoke', reason);
    setDeliveries((p) => [
      ...ids.map((id) => {
        const r = rows.find((x) => x.id === id);
        return { id: `RV-${Date.now()}-${id}`, employee: r?.name || id, channel: 'Email', at: nowStamp(), status: 'Sent' as const };
      }),
      ...p
    ]);
    setConfirm(null);
    flash('Revoked slips disappear from My Salary Slips immediately. Employees are notified without salary figures.');
  };

  const doOverride = () => {
    if (role !== 'Principal' && role !== 'School Administrator') { flash('Release Override requires Principal (or School Administrator).'); return; }
    if (!reason.trim()) { flash('Override reason is mandatory.'); return; }
    patchMany([overrideId], { visibility: 'Released', holdReason: '', holdOther: '', neverReleased: false }, 'Override Release', reason);
    const r = rows.find((x) => x.id === overrideId);
    if (r) setDeliveries((p) => [{ id: `OV-${Date.now()}`, employee: r.name, channel: 'Email', at: nowStamp(), status: 'Sent' }, ...p]);
    setConfirm(null);
    flash('Held employee released individually. Delayed notification queued.');
  };

  const applyHold = (id: string, hold: HoldReason) => {
    const row = rows.find((r) => r.id === id);
    if (!row) return;
    if (hold === 'Other' && !row.holdOther.trim()) { flash('Other hold reason requires free text.'); return; }
    setRows((p) => p.map((r) => r.id === id ? { ...r, holdReason: hold, holdBy: hold ? role : '', holdDate: hold ? nowStamp() : '', visibility: hold ? 'Locked' : r.visibility } : r));
    log(hold ? 'Hold Applied' : 'Hold Removed', row.employeeId, hold, row.visibility, 'Locked');
  };

  const releaseSelected = () => {
    if (!selected.length) { flash('Select rows to release.'); return; }
    const ids = selected.filter((id) => {
      const r = rows.find((x) => x.id === id);
      return r && !r.holdReason;
    });
    if (!ids.length) { flash('Selected rows are on hold. Use Release Override (Principal).'); return; }
    if (!canReleaseAll && !emergency) { flash('Partial release still requires the approval chain, or Emergency Release.'); return; }
    patchMany(ids, { visibility: 'Released', neverReleased: false }, 'Release', 'Partial / selected release');
    setSelected([]);
    flash(`Released ${ids.length} selected slip(s). Held rows skipped.`);
  };

  const runSchedule = () => {
    if (!canReleaseAll) { flash('Scheduled job will re-check prerequisites at run time. They are not met now — schedule saved but will abort if still blocked.'); }
    setScheduled(scheduleAt);
    log('Schedule Created', 'All', `Auto-release ${scheduleAt}`, 'Locked', 'Released');
    flash(`Release queued for ${scheduleAt}. If Payroll Entry is cancelled or March reconciliation is unsigned at that time, the job aborts and writes an audit entry.`);
  };

  const runGroups = () => {
    flash(`Staged release queued by ${groupBy}. Admin/Non-Teaching first, Teaching next, Contractual last — typical school pattern. A group that fails prerequisites is skipped; others still run.`);
    log('Schedule Created', groupBy, groupPlan.map((g) => `${g.group}@${g.when}`).join('; '), 'Locked', 'Released');
  };

  const rejectStep = (step: 'hr' | 'finance' | 'principal') => {
    if (!rejectNote.trim()) { flash('Rejection reason is mandatory.'); return; }
    if (step === 'principal') { setPrincipalDone(false); setFinanceDone(false); }
    if (step === 'finance') { setFinanceDone(false); setHrDone(false); }
    if (step === 'hr') setHrDone(false);
    log('Approval Rejected', 'All', rejectNote, 'Pending', 'Returned');
    flash('Approval returned to the previous step with the rejection reason.');
    setRejectNote('');
  };

  const visBadge = (v: Visibility, neverReleased: boolean) => {
    if (v === 'Released') return <Badge variant="success">Released</Badge>;
    if (v === 'Revoked') return <Badge variant="danger">Revoked</Badge>;
    return <Badge variant={neverReleased ? 'secondary' : 'warning'}>{neverReleased ? 'Never Released' : 'Locked'}</Badge>;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payslip Lock & Release</h1>
          <p className="text-sm text-gray-500">Post-processing control. Does not create, compute or cancel slips — only who can see them and when. Portal query: docstatus = 1 AND visibility_status = Released.</p>
        </div>
        <div className="flex flex-wrap gap-1 rounded-full border border-gray-200 bg-gray-100 p-1">
          {(['Payroll Manager', 'Finance Officer', 'Principal', 'School Administrator'] as const).map((r) => (
            <button key={r} type="button" onClick={() => setRole(r)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${role === r ? 'bg-indigo-600 text-white' : 'text-gray-600'}`}>{r}</button>
          ))}
        </div>
      </div>
      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}

      <div className="flex flex-wrap gap-1 border-b border-gray-200 bg-white">
        {([
          { id: 'regular' as const, label: 'Regular Monthly Slips' },
          { id: 'supplementary' as const, label: 'Supplementary / Arrear' },
          { id: 'notify' as const, label: 'Notifications' },
          { id: 'audit' as const, label: 'Access Audit Log' }
        ]).map((item) => (
          <button key={item.id} type="button" onClick={() => { setTab(item.id); setSelected([]); }} className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium ${tab === item.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>{item.label}</button>
        ))}
      </div>

      {(tab === 'regular' || tab === 'supplementary') && (
        <>
          <Card title="Release scope">
            <div className="grid gap-3 md:grid-cols-4">
              <Select label="Payroll Period *" value={period} onChange={() => undefined} options={PERIODS} />
              <Select label="Month *" value={month} onChange={(e) => setMonth(typeof e === 'string' ? e : e.target.value)} options={MONTHS} />
              <Select label="School Branch" value={branch} onChange={(e) => setBranch(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All branches' }, { value: 'Main Campus', label: 'Main Campus' }, { value: 'North Campus', label: 'North Campus' }]} />
              <Select label="Department" value={department} onChange={(e) => setDepartment(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All' }, { value: 'Science', label: 'Science' }, { value: 'Mathematics', label: 'Mathematics' }, { value: 'Administration', label: 'Administration' }, { value: 'Sports', label: 'Sports' }]} />
              <Select label="Designation" value={designation} onChange={(e) => setDesignation(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All' }, { value: 'PGT Physics', label: 'PGT Physics' }, { value: 'TGT Maths', label: 'TGT Maths' }, { value: 'Clerk', label: 'Clerk' }, { value: 'Coach', label: 'Coach' }, { value: 'Warden', label: 'Warden' }]} />
              <Select label="Employee Type" value={empType} onChange={(e) => setEmpType(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All' }, { value: 'Teaching', label: 'Teaching' }, { value: 'Non-Teaching', label: 'Non-Teaching' }, { value: 'Contractual', label: 'Contractual' }]} />
              <Select label="Staff Category" value={category} onChange={(e) => setCategory(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All' }, { value: 'Permanent Teaching', label: 'Permanent Teaching' }, { value: 'Administrative', label: 'Administrative' }, { value: 'Non-Teaching', label: 'Non-Teaching' }, { value: 'Contractual', label: 'Contractual' }]} />
              <Input label="Employee search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, ID or slip" />
            </div>
            <p className="mt-2 text-xs text-gray-500">Changing any filter reloads the access grid. Supplementary slips stay on their own tab so they can release on a different day (e.g. regular on the 1st, arrears on the 5th).</p>
          </Card>

          <Card title="Release prerequisites">
            <div className="grid gap-3 md:grid-cols-4 text-sm">
              <div className={`rounded-lg border p-3 ${payrollSubmitted ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
                <p className="text-xs uppercase text-gray-500">Payroll Entry</p>
                <p className="font-semibold">{payrollSubmitted ? 'Submitted' : 'Not Created / Draft'}</p>
                {!payrollSubmitted && <button type="button" className="mt-1 text-xs text-indigo-700 underline" onClick={() => navigate('/hr/payroll/payroll-entry')}>Open Payroll Entry</button>}
              </div>
              <div className={`rounded-lg border p-3 ${bankFile ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
                <p className="text-xs uppercase text-gray-500">Bank file generated</p>
                <p className="font-semibold">{bankFile ? 'Yes' : 'No — soft warning'}</p>
                {!bankFile && <button type="button" className="mt-1 text-xs text-indigo-700 underline" onClick={() => navigate('/hr/payroll/salary-disbursement-bank-advice')}>Salary Disbursement</button>}
              </div>
              <div className={`rounded-lg border p-3 ${(tab === 'supplementary' ? supFinance : financeDone) ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
                <p className="text-xs uppercase text-gray-500">Finance Officer verified</p>
                <p className="font-semibold">{(tab === 'supplementary' ? supFinance : financeDone) ? 'Yes' : 'No'}</p>
              </div>
              <div className={`rounded-lg border p-3 ${(tab === 'supplementary' ? supPrincipal : principalDone) ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
                <p className="text-xs uppercase text-gray-500">Principal approved</p>
                <p className="font-semibold">{(tab === 'supplementary' ? supPrincipal : principalDone) ? 'Yes' : 'No'}</p>
              </div>
            </div>
            {hardBlocks.map((b) => (
              <div key={b.label} className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                Hard block: {b.label}. <button type="button" className="underline" onClick={() => navigate(b.href)}>Go there</button>
              </div>
            ))}
            {softWarnings.map((b) => (
              <div key={b.label} className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                Warning (overridable with reason): {b.label}. <button type="button" className="underline" onClick={() => navigate(b.href)}>Open page</button>
              </div>
            ))}
            {!payrollSubmitted && <p className="mt-2 text-sm text-red-700">This page is reachable from Payroll Entry only after Submit. No lock/release action is allowed until then.</p>}
          </Card>

          {isMarch && tab === 'regular' && (
            <Card title="Year-end release checklist (March)">
              <p className="mb-3 text-sm text-gray-600">Release All stays blocked until every item is confirmed. Annual Tax Reconciliation Signed Off is a hard block even if these ticks are on.</p>
              {([
                ['supp', 'All supplementary payroll processed'],
                ['proof', 'All proof verifications complete'],
                ['recon', 'Annual reconciliation signed off'],
                ['challan', "All 12 months' challans recorded"],
                ['bank', 'Bank file for March generated and verified']
              ] as const).map(([k, label]) => (
                <label key={k} className="mb-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={marchTicks[k]} onChange={(e) => setMarchTicks({ ...marchTicks, [k]: e.target.checked })} /> {label}</label>
              ))}
            </Card>
          )}

          <Card title={tab === 'supplementary' ? 'Supplementary approval (Finance + Principal)' : 'School governance — approval chain'}>
            {tab === 'regular' ? (
              <div className="space-y-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">1. Payroll Manager — HR Finalized</span>
                  <Badge variant={hrDone ? 'success' : 'warning'}>{hrDone ? 'Done' : 'Pending'}</Badge>
                  {role === 'Payroll Manager' && !hrDone && <Button size="xs" onClick={() => { setHrDone(true); log('Approval Given', 'All', 'HR Finalized', 'Pending', 'HR Finalized'); }}>Mark HR Finalized</Button>}
                  {hrDone && role === 'Payroll Manager' && <Button size="xs" variant="ghost" onClick={() => rejectStep('hr')}>Reject</Button>}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">2. Finance Officer / Bursar — Finance Verified</span>
                  <Badge variant={financeDone ? 'success' : 'warning'}>{financeDone ? 'Done' : 'Pending'}</Badge>
                  {role === 'Finance Officer' && hrDone && !financeDone && <Button size="xs" onClick={() => { setFinanceDone(true); log('Approval Given', 'All', 'Bank file matches net pay; TDS challan scheduled', 'HR Finalized', 'Finance Verified'); }}>Mark Finance Verified</Button>}
                  {financeDone && role === 'Finance Officer' && <Button size="xs" variant="ghost" onClick={() => rejectStep('finance')}>Reject</Button>}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">3. Principal — Approved for Release</span>
                  <Badge variant={principalDone ? 'success' : 'warning'}>{principalDone ? 'Done' : 'Pending'}</Badge>
                  {role === 'Principal' && financeDone && !principalDone && <Button size="xs" onClick={() => { setPrincipalDone(true); log('Approval Given', 'All', 'Approved for staff visibility', 'Finance Verified', 'Principal Approved'); }}>Approve for Release</Button>}
                  {principalDone && role === 'Principal' && <Button size="xs" variant="ghost" onClick={() => rejectStep('principal')}>Reject</Button>}
                </div>
                <Textarea label="Rejection reason (mandatory if rejecting)" rows={2} value={rejectNote} onChange={(e) => setRejectNote(e.target.value)} />
                <p className="text-xs text-gray-500">Pending beyond 3 working days escalates: HR → Bursar, Finance → Principal, Principal → School Administrator.</p>
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <p>Supplementary slips skip HR Finalized because Supplementary / Arrear Payroll already has its own approval. Only Finance Officer + Principal are required.</p>
                {role === 'Finance Officer' && <Button size="sm" onClick={() => setSupFinance(true)}>Finance Verified</Button>}
                {role === 'Principal' && <Button size="sm" onClick={() => setSupPrincipal(true)}>Principal Approved</Button>}
                <p>Finance {supFinance ? 'Yes' : 'No'} · Principal {supPrincipal ? 'Yes' : 'No'}</p>
              </div>
            )}
            {role === 'School Administrator' && (
              <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm">
                <p className="font-medium">Emergency Release</p>
                <p className="text-xs text-amber-800">Bypasses the chain. Justification is permanent in the audit trail.</p>
                <Button size="sm" className="mt-2" variant="warning" onClick={() => setConfirm('emergency')}>Emergency Release override</Button>
              </div>
            )}
          </Card>

          <Card title="Master lock / release controls">
            <div className="mb-3"><Textarea label="Action reason" rows={2} value={reason} onChange={(e) => setReason(e.target.value)} helperText="Mandatory for Revoke, Lock All when pulling back released slips, Emergency Release, and Release Override." /></div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" disabled={!payrollSubmitted} onClick={() => setConfirm('lock')}>Lock All</Button>
              <Button disabled={!canReleaseAll} onClick={() => setConfirm('release')}>Release All</Button>
              <Button variant="outline" disabled={!payrollSubmitted} onClick={() => setConfirm('revoke')}>Revoke Release</Button>
              <Button variant="outline" disabled={!payrollSubmitted} onClick={releaseSelected}>Release selected</Button>
            </div>
            {!canReleaseAll && <p className="mt-2 text-xs text-amber-700">Release All stays inactive until Payroll Entry is Submitted, March (if applicable) reconciliation is signed off, the year-end checklist is complete, and the approval chain (or Emergency Release) is done. Held rows are always skipped.</p>}
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-3">
                <p className="mb-2 text-sm font-semibold">Schedule Release</p>
                <Input type="datetime-local" value={scheduleAt} onChange={(e) => setScheduleAt(e.target.value)} />
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="outline" onClick={runSchedule}>Queue job</Button>
                  {scheduled && <Button size="sm" variant="ghost" onClick={() => { log('Schedule Cancelled', 'All', scheduled, 'Queued', 'Cancelled'); setScheduled(''); flash('Scheduled release cancelled.'); }}>Cancel schedule</Button>}
                </div>
                {scheduled && <p className="mt-1 text-xs text-gray-500">Queued for {scheduled}. Re-validates hard blocks at execution.</p>}
              </div>
              <div className="rounded-lg border p-3">
                <p className="mb-2 text-sm font-semibold">Release by Group</p>
                <Select label="Group by" value={groupBy} onChange={(e) => {
                  const v = (typeof e === 'string' ? e : e.target.value) as 'Department' | 'Employee Type';
                  setGroupBy(v);
                  setGroupPlan(v === 'Department'
                    ? [{ group: 'Administration', when: '2026-11-01T09:00' }, { group: 'Science', when: '2026-11-03T09:00' }, { group: 'Mathematics', when: '2026-11-03T10:00' }]
                    : [{ group: 'Non-Teaching', when: '2026-11-01T09:00' }, { group: 'Teaching', when: '2026-11-03T09:00' }, { group: 'Contractual', when: '2026-11-05T09:00' }]);
                }} options={[{ value: 'Employee Type', label: 'Employee Type (Teaching / Non-Teaching / Contractual)' }, { value: 'Department', label: 'Department' }]} />
                {groupPlan.map((g, i) => (
                  <div key={g.group} className="mt-2 flex items-center gap-2 text-sm">
                    <span className="w-32">{g.group}</span>
                    <input type="datetime-local" className="rounded border px-2 py-1 text-xs" value={g.when} onChange={(e) => setGroupPlan(groupPlan.map((x, idx) => idx === i ? { ...x, when: e.target.value } : x))} />
                  </div>
                ))}
                <Button size="sm" className="mt-2" variant="outline" onClick={runGroups}>Queue staged release</Button>
              </div>
            </div>
          </Card>

          <Card title={tab === 'supplementary' ? 'Supplementary access grid' : 'Employee-specific access grid'}>
            <div className="mb-3 flex flex-wrap gap-2 text-sm">
              <span className="rounded-lg bg-gray-100 px-3 py-1">Total {counts.total}</span>
              <span className="rounded-lg bg-gray-100 px-3 py-1">Locked {counts.locked}</span>
              <span className="rounded-lg bg-amber-100 px-3 py-1">Held {counts.held}</span>
              <span className="rounded-lg bg-emerald-100 px-3 py-1">Released {counts.released}</span>
              <span className="rounded-lg bg-red-100 px-3 py-1">Revoked {counts.revoked}</span>
              <button type="button" className="ml-auto text-xs text-indigo-700 underline" onClick={() => setSortKey(sortKey === 'name' ? 'net' : sortKey === 'net' ? 'visibility' : 'name')}>Sort: {sortKey}</button>
            </div>
            {tab === 'supplementary' && <p className="mb-3 text-xs text-gray-500">Portal lists these as separate “Supplementary — October 2026” entries (not merged into the monthly slip) so a held arrear does not hide a released monthly slip, and vice versa.</p>}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
                    <th className="px-2 py-2"><input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={(e) => setSelected(e.target.checked ? filtered.map((r) => r.id) : [])} /></th>
                    {['Employee', 'Slip', 'Net', 'Supp.', 'Status', 'Hold reason', 'Hold by', 'First viewed', 'Downloaded', ''].map((h) => <th key={h || 'c'} className="px-2 py-2">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id} className={`border-b hover:bg-gray-50 ${r.holdReason ? 'bg-amber-50/40' : r.visibility === 'Revoked' ? 'bg-red-50/40' : ''}`}>
                      <td className="px-2 py-2"><input type="checkbox" checked={selected.includes(r.id)} onChange={(e) => setSelected((p) => e.target.checked ? [...p, r.id] : p.filter((id) => id !== r.id))} /></td>
                      <td className="px-2 py-2">{r.name}<p className="text-xs text-gray-400">{r.employeeId} · {r.designation} · {r.department} · {r.staffCategory}</p></td>
                      <td className="px-2 py-2"><button type="button" className="font-mono text-xs text-indigo-700 underline" onClick={() => navigate('/hr/payroll/employee-payslip-list')}>{r.id}</button></td>
                      <td className="px-2 py-2">{inr(r.net)}</td>
                      <td className="px-2 py-2">{inr(r.supplementary)}</td>
                      <td className="px-2 py-2">{visBadge(r.visibility, r.neverReleased)}</td>
                      <td className="px-2 py-2">
                        <select className="max-w-[160px] rounded border px-1 py-1 text-xs" value={r.holdReason} onChange={(e) => applyHold(r.id, e.target.value as HoldReason)}>
                          <option value="">—</option>
                          {HOLD_OPTIONS.map((h) => <option key={h}>{h}</option>)}
                        </select>
                        {r.holdReason === 'Other' && <input className="mt-1 w-full rounded border px-1 py-1 text-xs" placeholder="Specify" value={r.holdOther} onChange={(e) => setRows((p) => p.map((x) => x.id === r.id ? { ...x, holdOther: e.target.value } : x))} />}
                      </td>
                      <td className="px-2 py-2 text-xs">{r.holdBy || '—'}<p>{r.holdDate}</p></td>
                      <td className="px-2 py-2 text-xs">{r.firstViewed || '—'}</td>
                      <td className="px-2 py-2">{r.downloaded ? 'Yes' : 'No'}</td>
                      <td className="px-2 py-2">
                        {r.holdReason && <Button size="xs" variant="outline" onClick={() => { setOverrideId(r.id); setConfirm('override'); }}>Override</Button>}
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && <tr><td colSpan={10} className="px-3 py-6 text-center text-sm text-gray-500">{month === '2026-11' ? 'No Payroll Entry submitted for November 2026. Create and submit it first.' : 'No slips in this filter.'}</td></tr>}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-gray-500">If Payroll Entry is cancelled after release, revoke remaining visible slips and keep the audit. If an employee is terminated mid-month after release, apply hold “Resigned — Exit Process Incomplete” and Revoke so F&amp;F can complete. Regular vs supplementary visibility is independent — one can be Released while the other is Held.</p>
          </Card>
        </>
      )}

      {tab === 'notify' && (
        <Card title="Notification & communication">
          <div className="grid gap-3 md:grid-cols-2">
            <Select label="Template" value={template} onChange={(e) => setTemplate(typeof e === 'string' ? e : e.target.value)} options={['Standard Monthly Release', 'Arrear/Supplementary Release', 'Revised Payslip Release', 'Bonus/Ex-Gratia Special Release'].map((v) => ({ value: v, label: v }))} />
            <div>
              <p className="mb-1 text-sm font-medium text-gray-700">Channels</p>
              <div className="flex flex-wrap gap-3 text-sm">
                {['System Notification', 'Email', 'SMS'].map((c) => (
                  <label key={c} className="flex items-center gap-2"><input type="checkbox" checked={channels.includes(c)} onChange={(e) => setChannels((p) => e.target.checked ? [...p, c] : p.filter((x) => x !== c))} />{c}</label>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">Variables: employee_name, month, year, net_pay, payslip_link. Held employees are excluded. Revoke template never includes salary figures: “Your payslip for [Month/Year] has been temporarily withheld. Please contact HR.”</p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" onClick={() => flash('Release All already auto-notifies newly released employees.')}>Auto-trigger is on with Release All</Button>
            <Button size="sm" variant="outline" onClick={() => flash(`Re-sent ${template} via ${channels.join(', ')} to released employees only.`)}>Send Notifications</Button>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">{['Employee', 'Channel', 'Sent', 'Status', ''].map((h) => <th key={h || 'n'} className="px-3 py-2">{h}</th>)}</tr></thead>
              <tbody>
                {deliveries.map((d) => (
                  <tr key={d.id} className="border-b">
                    <td className="px-3 py-2">{d.employee}</td>
                    <td className="px-3 py-2">{d.channel}</td>
                    <td className="px-3 py-2 text-xs">{d.at}</td>
                    <td className="px-3 py-2"><Badge variant={d.status === 'Sent' ? 'success' : d.status === 'Failed' ? 'danger' : 'warning'}>{d.status}</Badge></td>
                    <td className="px-3 py-2">{d.status === 'Failed' && <Button size="xs" onClick={() => { setDeliveries((p) => p.map((x) => x.id === d.id ? { ...x, status: 'Sent', at: nowStamp() } : x)); flash('Retry sent.'); }}>Retry</Button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 'audit' && (
        <Card title="Access audit log">
          <p className="mb-3 text-xs text-gray-500">Logs are never deleted, even after the payroll period is closed. First-view and download events are written when the employee opens or downloads a Released slip on the portal.</p>
          <div className="mb-3 flex gap-2">
            <Button size="sm" variant="outline" onClick={() => flash('Audit report exported for the current filters (date / action / employee).')}>Export audit report</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">{['Timestamp', 'Action', 'By', 'Role', 'Target', 'Reason', 'From', 'To'].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}</tr></thead>
              <tbody>
                {audit.map((a, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-3 py-2 text-xs">{a.at}</td>
                    <td className="px-3 py-2">{a.action}</td>
                    <td className="px-3 py-2">{a.by}</td>
                    <td className="px-3 py-2 text-xs">{a.role}</td>
                    <td className="px-3 py-2 font-mono text-xs">{a.target}</td>
                    <td className="px-3 py-2 text-xs">{a.reason}</td>
                    <td className="px-3 py-2">{a.from}</td>
                    <td className="px-3 py-2">{a.to}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal isOpen={confirm !== null} onClose={() => setConfirm(null)} title={confirm === 'lock' ? 'Lock All' : confirm === 'release' ? 'Release All' : confirm === 'revoke' ? 'Revoke Release' : confirm === 'override' ? 'Release Override' : 'Emergency Release'} footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setConfirm(null)}>Cancel</Button><Button onClick={() => { if (confirm === 'lock') doLockAll(); else if (confirm === 'release') doReleaseAll(); else if (confirm === 'revoke') doRevoke(); else if (confirm === 'override') doOverride(); else { setEmergency(true); setConfirm(null); flash('Emergency override armed. Release All can now run. Justification is permanently flagged.'); log('Override Release', 'All', reason || 'Emergency', 'Blocked', 'Emergency'); } }}>{confirm === 'emergency' ? 'Confirm emergency' : 'Confirm'}</Button></div>}>
        <p className="text-sm text-gray-600">
          {confirm === 'lock' && 'All slips in the current filter become Locked. Already Released slips are revoked (hidden on the portal) and require a reason.'}
          {confirm === 'release' && 'Sets visibility_status = Released except rows with a Hold Reason. Notifications fire automatically to newly released staff.'}
          {confirm === 'revoke' && 'Pulls back released slips immediately. Employees receive: “Your payslip for this month is temporarily unavailable.” No net-pay figures in that message.'}
          {confirm === 'override' && 'Principal-only release of a held employee. Override reason is stored on the row and in the audit log.'}
          {confirm === 'emergency' && 'School Administrator bypass of the approval chain. This is flagged forever in the audit trail.'}
        </p>
      </Modal>
    </div>
  );
}
