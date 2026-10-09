// ArchiveSettingsRules.tsx — Archive Management ▸ Archive Settings & Rules (Page 6)
// Retention policies, auto-archive settings, authorization thresholds, compression &
// security, notification settings and cold storage provider configuration.
import React, { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import {
  Settings,
  Sliders,
  ShieldCheck,
  Bell,
  Cloud,
  Save,
  RotateCcw,
  RefreshCw,
  Eye,
  KeyRound,
  Link2,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { ArchiveHeader, Panel, Pill, TH } from './archiveUi';

interface RetentionRow {
  module: string;
  primary: string;
  archive: string;
  cold: string;
}

const RETENTION: RetentionRow[] = [
  { module: '💰 Finance/GL', primary: '2 years', archive: '5 years', cold: '8 years' },
  { module: '💸 Fee Module', primary: '2 years', archive: '4 years', cold: '8 years' },
  { module: '👩‍🏫 Payroll', primary: '2 years', archive: '5 years', cold: '8 years' },
  { module: '🕐 Attendance (Emp.)', primary: '1 year', archive: '4 years', cold: '8 years' },
  { module: '🎓 Attendance (Std.)', primary: '2 years', archive: '3 years', cold: '7 years' },
  { module: '📝 Examination', primary: '2 years', archive: '5 years', cold: 'Permanent' },
  { module: '🎓 Scholarship', primary: '2 years', archive: '4 years', cold: '8 years' },
  { module: '💸 Expenses', primary: '2 years', archive: '4 years', cold: '8 years' },
  { module: '📋 Audit Logs', primary: '1 year', archive: '4 years', cold: 'Permanent' },
  { module: '📷 Documents', primary: '2 years', archive: '3 years', cold: '5 years' },
  { module: '📱 Notifications', primary: '90 days', archive: '6 months', cold: 'Delete' },
  { module: '🔔 System Logs', primary: '30 days', archive: '60 days', cold: 'Delete' },
  { module: '🔑 Session Data', primary: 'Active only', archive: 'N/A', cold: 'Delete immediately' },
  { module: '📁 Temp Files', primary: '7 days', archive: 'N/A', cold: 'Delete immediately' }
];

const PRIMARY_OPTS = ['30 days', '90 days', '6 months', '1 year', '2 years', '5 years', 'Active only', '7 days'];
const ARCHIVE_OPTS = ['60 days', '6 months', '1 year', '3 years', '4 years', '5 years', 'N/A'];
const COLD_OPTS = ['3 years', '5 years', '7 years', '8 years', 'Permanent', 'Delete', 'Delete immediately'];

const TABS = ['📋 Retention', '⚙️ Auto-Archive', '🔐 Authorization', '🔒 Security', '🔔 Notifications', '🔗 Cold Storage'];

export function ArchiveSettingsRules() {
  const [tab, setTab] = useState(TABS[0]);
  const [retention, setRetention] = useState<RetentionRow[]>(RETENTION);
  const [archiveTime, setArchiveTime] = useState('02:00 AM');
  const [weeklyDay, setWeeklyDay] = useState('Sunday');
  const [monthlyDate, setMonthlyDate] = useState('1st');
  const [maxRecords, setMaxRecords] = useState('50,000');
  const [maxDuration, setMaxDuration] = useState('3 hours');
  const [onlyLocked, setOnlyLocked] = useState(true);
  const [sizeAlert, setSizeAlert] = useState('40 GB');
  const [sizeForce, setSizeForce] = useState('50 GB');
  const [autoDeleteAfter, setAutoDeleteAfter] = useState('72 hours');
  const [warnBefore, setWarnBefore] = useState('6 hours before');
  const [verifyCopy, setVerifyCopy] = useState(true);
  const [verifyMethod, setVerifyMethod] = useState('Full checksum');
  const [onVerifyFail, setOnVerifyFail] = useState('Keep in primary + alert admin');
  const [compression, setCompression] = useState('GZIP');
  const [level, setLevel] = useState('6');
  const [encrypt, setEncrypt] = useState(true);
  const [keyMgmt, setKeyMgmt] = useState('Auto-managed by ERP');
  const [keyRotation, setKeyRotation] = useState('Every 1 year');
  const [checksum, setChecksum] = useState('SHA256');
  const [verifyOnRetrieval, setVerifyOnRetrieval] = useState(true);
  const [provider, setProvider] = useState('AWS S3 Glacier');
  const [region, setRegion] = useState('ap-south-1 (Mumbai)');
  const [vault, setVault] = useState('school-xyz-archive');
  const [snsTopic, setSnsTopic] = useState('arn:aws:sns:ap-south-1:XXXXX:erp-archive-notify');
  const [accessKey, setAccessKey] = useState('AKIAIOSFODNN7EXAMPLE');
  const [secretKey, setSecretKey] = useState('wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY');
  const [showAccessKey, setShowAccessKey] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [keyRotationCount, setKeyRotationCount] = useState(0);
  const [connectionResult, setConnectionResult] = useState('Not tested this session');
  const [notifyEvents, setNotifyEvents] = useState({
    jobFailed: true,
    primaryLimit: true,
    coldPush: true,
    retrievalDone: true,
    deletionDue: true,
    providerError: true
  });
  const [channels, setChannels] = useState({ inApp: true, email: true, sms: false });
  const [testRun, setTestRun] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(null), 3200);
  };

  const setRetentionField = (module: string, field: keyof RetentionRow, value: string) =>
    setRetention((prev) => prev.map((r) => (r.module === module ? { ...r, [field]: value } : r)));

  const settingsSnapshot = () => ({
    retention,
    autoArchive: { archiveTime, weeklyDay, monthlyDate, maxRecords, maxDuration, onlyLocked, sizeAlert, sizeForce, autoDeleteAfter, warnBefore, verifyCopy, verifyMethod, onVerifyFail },
    security: { compression, level, encrypt, keyMgmt, keyRotation, checksum, verifyOnRetrieval },
    notifications: { notifyEvents, channels },
    coldStorage: { provider, region, vault, snsTopic }
  });
  const persistSettings = (message: string) => {
    try { window.localStorage.setItem('k12-archive-settings-rules-v1', JSON.stringify(settingsSnapshot())); }
    catch { /* settings remain active in memory when browser storage is unavailable */ }
    showToast(message);
  };
  const applyStoredSettings = (saved: any) => {
    if (Array.isArray(saved.retention)) setRetention(saved.retention);
    const auto = saved.autoArchive || {};
    if (auto.archiveTime) setArchiveTime(auto.archiveTime);
    if (auto.weeklyDay) setWeeklyDay(auto.weeklyDay);
    if (auto.monthlyDate) setMonthlyDate(auto.monthlyDate);
    if (auto.maxRecords) setMaxRecords(auto.maxRecords);
    if (auto.maxDuration) setMaxDuration(auto.maxDuration);
    if (typeof auto.onlyLocked === 'boolean') setOnlyLocked(auto.onlyLocked);
    if (auto.sizeAlert) setSizeAlert(auto.sizeAlert);
    if (auto.sizeForce) setSizeForce(auto.sizeForce);
    if (auto.autoDeleteAfter) setAutoDeleteAfter(auto.autoDeleteAfter);
    if (auto.warnBefore) setWarnBefore(auto.warnBefore);
    if (typeof auto.verifyCopy === 'boolean') setVerifyCopy(auto.verifyCopy);
    if (auto.verifyMethod) setVerifyMethod(auto.verifyMethod);
    if (auto.onVerifyFail) setOnVerifyFail(auto.onVerifyFail);
    const security = saved.security || {};
    if (security.compression) setCompression(security.compression);
    if (security.level) setLevel(security.level);
    if (typeof security.encrypt === 'boolean') setEncrypt(security.encrypt);
    if (security.keyMgmt) setKeyMgmt(security.keyMgmt);
    if (security.keyRotation) setKeyRotation(security.keyRotation);
    if (security.checksum) setChecksum(security.checksum);
    if (typeof security.verifyOnRetrieval === 'boolean') setVerifyOnRetrieval(security.verifyOnRetrieval);
    if (saved.notifications?.notifyEvents) setNotifyEvents((previous) => ({ ...previous, ...saved.notifications.notifyEvents }));
    if (saved.notifications?.channels) setChannels((previous) => ({ ...previous, ...saved.notifications.channels }));
    const cold = saved.coldStorage || {};
    if (cold.provider) setProvider(cold.provider);
    if (cold.region) setRegion(cold.region);
    if (cold.vault) setVault(cold.vault);
    if (cold.snsTopic) setSnsTopic(cold.snsTopic);
  };
  const reloadSavedSettings = () => {
    try {
      const saved = JSON.parse(window.localStorage.getItem('k12-archive-settings-rules-v1') || 'null');
      if (!saved) { showToast('No saved archive settings exist in this browser yet.'); return; }
      applyStoredSettings(saved);
      showToast('Saved archive settings reloaded from this browser.');
    } catch { showToast('Saved settings could not be read; current form values were kept.'); }
  };
  const runConnectionTest = () => {
    const passed = Boolean(provider && region && vault.trim() && accessKey.trim() && secretKey.trim());
    const result = passed ? 'Demo check passed — provider, region, vault and credential fields are present.' : 'Demo check failed — complete provider, region, vault and credential fields.';
    setConnectionResult(result);
    showToast(result);
  };
  const rotateDemoCredential = (kind: 'access' | 'secret') => {
    const replacement = `DEMO-ROTATED-${Date.now().toString(36).toUpperCase()}`;
    if (kind === 'access') setAccessKey(replacement); else setSecretKey(replacement);
    setKeyRotationCount((count) => count + 1);
    showToast(`${kind === 'access' ? 'Access' : 'Secret'} demo credential rotated locally; no provider was contacted.`);
  };
  const revealCredential = (kind: 'access' | 'secret') => {
    if (kind === 'access') { setShowAccessKey(true); window.setTimeout(() => setShowAccessKey(false), 30000); }
    else { setShowSecretKey(true); window.setTimeout(() => setShowSecretKey(false), 30000); }
    showToast('Credential is visible in this form for 30 seconds.');
  };
  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem('k12-archive-settings-rules-v1') || 'null');
      if (saved) applyStoredSettings(saved);
    } catch { /* use the built-in example configuration */ }
  }, []);

  return (
    <div className="space-y-6 py-6">
      <ArchiveHeader
        icon={Settings}
        title="Archive Settings & Rules"
        screen="Archive Settings & Rules"
        restricted="Frontend-only settings preview — edits save in this browser; enforce admin permissions and immutable auditing in the production service."
        actions={
          <>
            <Button variant="outline" size="sm" className="text-xs" onClick={reloadSavedSettings}>
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Reload
            </Button>
            <Button size="sm" className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => persistSettings('All editable archive settings saved in this browser.')}>
              <Save className="w-3.5 h-3.5 mr-1.5" /> Save All
            </Button>
          </>
        }
      />

      <div className="flex flex-wrap gap-1 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-2 text-xs font-semibold border-b-2 -mb-px transition-colors ${
              tab === t ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* SECTION 1 — retention */}
      {tab === TABS[0] && (
        <Panel
          icon={Sliders}
          title="Data Retention Policies"
          subtitle="Configure how long data stays in each tier before it moves on"
          actions={
            <>
              <Button size="sm" className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => persistSettings('Retention policies saved in this browser.')}>
                <Save className="w-3.5 h-3.5 mr-1.5" /> Save Retention Policies
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => {
                  setRetention(RETENTION);
                  showToast('Retention reset to the built-in policy defaults. Save to keep this change in this browser.');
                }}
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Reset to Legal Minimums
              </Button>
            </>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse" data-testid="retention-table">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className={TH}>Module</th>
                  <th className={TH}>Primary DB Keep (before archiving)</th>
                  <th className={TH}>Archive DB Keep (before cold push)</th>
                  <th className={TH}>Cold Storage Keep (before deletion)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {retention.map((r) => (
                  <tr key={r.module} className="hover:bg-indigo-50/20">
                    <td className="p-3 font-semibold text-gray-900 whitespace-nowrap">{r.module}</td>
                    <td className="p-3">
                      <select
                        value={r.primary}
                        onChange={(e) => setRetentionField(r.module, 'primary', e.target.value)}
                        className="p-1.5 border border-gray-300 rounded-md text-xs bg-white"
                      >
                        {PRIMARY_OPTS.map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3">
                      <select
                        value={r.archive}
                        onChange={(e) => setRetentionField(r.module, 'archive', e.target.value)}
                        className="p-1.5 border border-gray-300 rounded-md text-xs bg-white"
                      >
                        {ARCHIVE_OPTS.map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3">
                      <select
                        value={r.cold}
                        onChange={(e) => setRetentionField(r.module, 'cold', e.target.value)}
                        className="p-1.5 border border-gray-300 rounded-md text-xs bg-white"
                      >
                        {COLD_OPTS.map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-gray-100 rounded-b-xl bg-amber-50/60 text-[11px] text-amber-900 space-y-1">
            <p className="font-semibold">📌 LEGAL MINIMUM REQUIREMENTS (cannot be set lower than these):</p>
            <p>Finance records: Min 8 years · Payroll: Min 8 years · Exam Records: Permanent</p>
            <p>Audit Logs: Permanent · Statutory filings: Permanent</p>
          </div>
        </Panel>
      )}

      {/* SECTION 2 — auto archive */}
      {tab === TABS[1] && (
        <Panel
          icon={Sliders}
          title="Auto-Archive Settings"
          subtitle="Schedules, size thresholds and verification behaviour"
          actions={
            <Button size="sm" className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => persistSettings('Auto-archive settings saved in this browser.')}>
              <Save className="w-3.5 h-3.5 mr-1.5" /> Save Auto-Archive Settings
            </Button>
          }
        >
          <div className="p-5 space-y-5 text-xs">
            <div>
              <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">Archiving Schedule</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-600 mb-1 font-medium">Archive Time (Daily)</label>
                  <select value={archiveTime} onChange={(e) => setArchiveTime(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-xs bg-white">
                    <option>12:30 AM</option>
                    <option>02:00 AM</option>
                    <option>03:00 AM</option>
                  </select>
                  <p className="text-[10px] text-gray-500 mt-1">Run after midnight — low traffic</p>
                </div>
                <div>
                  <label className="block text-[11px] text-gray-600 mb-1 font-medium">Archive Day (Weekly)</label>
                  <select value={weeklyDay} onChange={(e) => setWeeklyDay(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-xs bg-white">
                    <option>Sunday</option>
                    <option>Saturday</option>
                  </select>
                  <p className="text-[10px] text-gray-500 mt-1">For weekly jobs</p>
                </div>
                <div>
                  <label className="block text-[11px] text-gray-600 mb-1 font-medium">Archive Date (Monthly)</label>
                  <select value={monthlyDate} onChange={(e) => setMonthlyDate(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-xs bg-white">
                    <option>1st</option>
                    <option>5th</option>
                    <option>Last day</option>
                  </select>
                  <p className="text-[10px] text-gray-500 mt-1">For monthly jobs</p>
                </div>
                <div>
                  <label className="block text-[11px] text-gray-600 mb-1 font-medium">Max Records per Run</label>
                  <select value={maxRecords} onChange={(e) => setMaxRecords(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-xs bg-white">
                    <option>10,000</option>
                    <option>25,000</option>
                    <option>50,000</option>
                  </select>
                  <p className="text-[10px] text-gray-500 mt-1">Prevent overloading the server</p>
                </div>
                <div>
                  <label className="block text-[11px] text-gray-600 mb-1 font-medium">Max Duration per Run</label>
                  <select value={maxDuration} onChange={(e) => setMaxDuration(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-xs bg-white">
                    <option>1 hour</option>
                    <option>3 hours</option>
                    <option>6 hours</option>
                  </select>
                  <p className="text-[10px] text-gray-500 mt-1">Stop if too long — retry next night</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2">
              <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Auto-Lock Before Archiving</p>
              <div className="flex flex-col md:flex-row gap-3">
                <label className="flex items-center gap-2">
                  <input type="radio" name="lock" checked={onlyLocked} onChange={() => setOnlyLocked(true)} />
                  <span className="text-gray-700">Yes — only archive locked / approved records</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="lock" checked={!onlyLocked} onChange={() => setOnlyLocked(false)} />
                  <span className="text-gray-700">No — archive all records regardless of lock status</span>
                </label>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">Primary DB Size Alert</p>
                <label className="block text-[11px] text-gray-600 mb-1">Alert when Primary exceeds</label>
                <select value={sizeAlert} onChange={(e) => setSizeAlert(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-xs bg-white">
                  <option>30 GB</option>
                  <option>40 GB</option>
                  <option>45 GB</option>
                </select>
                <p className="text-[10px] text-gray-500 mt-1">Send email to admin</p>
                <label className="block text-[11px] text-gray-600 mb-1 mt-3">Force archive when Primary exceeds</label>
                <select value={sizeForce} onChange={(e) => setSizeForce(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-xs bg-white">
                  <option>45 GB</option>
                  <option>50 GB</option>
                  <option>60 GB</option>
                </select>
                <p className="text-[10px] text-gray-500 mt-1">Auto-trigger archive immediately</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">Auto re-lock after retrieval</p>
                <label className="block text-[11px] text-gray-600 mb-1">Auto-delete temp data after</label>
                <select value={autoDeleteAfter} onChange={(e) => setAutoDeleteAfter(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-xs bg-white">
                  <option>24 hours</option>
                  <option>72 hours</option>
                  <option>7 days</option>
                </select>
                <label className="block text-[11px] text-gray-600 mb-1 mt-3">Send warning before deletion</label>
                <select value={warnBefore} onChange={(e) => setWarnBefore(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-xs bg-white">
                  <option>2 hours before</option>
                  <option>6 hours before</option>
                  <option>24 hours before</option>
                </select>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2">
              <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Verification Settings</p>
              <div className="flex flex-col md:flex-row gap-4">
                <label className="flex items-center gap-2">
                  <input type="radio" name="verify" checked={verifyCopy} onChange={() => setVerifyCopy(true)} />
                  <span className="text-gray-700">Verify copy before deleting from primary — Always</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="verify" checked={!verifyCopy} onChange={() => setVerifyCopy(false)} />
                  <span className="text-gray-700">Skip verification</span>
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-600 mb-1">Verification method</label>
                  <select value={verifyMethod} onChange={(e) => setVerifyMethod(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-xs bg-white">
                    <option>Full checksum</option>
                    <option>Record count only — faster</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-gray-600 mb-1">If verification fails</label>
                  <select value={onVerifyFail} onChange={(e) => setOnVerifyFail(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-xs bg-white">
                    <option>Keep in primary + alert admin</option>
                    <option>Archive anyway</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </Panel>
      )}

      {/* SECTION 3 — authorization */}
      {tab === TABS[2] && (
        <div className="space-y-4">
          <Panel icon={Lock} title="Manual Archive Authorization" subtitle="Who can trigger manual jobs and who must approve them">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className={TH}>Action</th>
                    <th className={TH}>Who Can Do</th>
                    <th className={TH}>Who Must Approve</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    ['Nightly archive (automated)', 'System (auto)', 'No approval needed'],
                    ['Manual archive trigger', 'Finance Manager', 'Principal'],
                    ['Manual cold push trigger', 'Finance Manager', 'Principal'],
                    ['Change retention policies', 'Super Admin', 'Principal'],
                    ['Delete from cold storage', 'Super Admin', 'Principal + Management'],
                    ['Change archive settings', 'Super Admin', 'No approval needed']
                  ].map((r) => (
                    <tr key={r[0]}>
                      <td className="p-3 font-semibold text-gray-900">{r[0]}</td>
                      <td className="p-3 text-gray-700">{r[1]}</td>
                      <td className="p-3 text-gray-600">{r[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-gray-100 space-y-2">
              <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Archive module — role access matrix</p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className={TH}>Page / Feature</th>
                      <th className={TH}>Super Admin</th>
                      <th className={TH}>Principal</th>
                      <th className={TH}>Finance Mgr</th>
                      <th className={TH}>Accountant</th>
                      <th className={TH}>Auditor</th>
                      <th className={TH}>HR Manager</th>
                      <th className={TH}>Teacher/Staff</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      ['📊 Archive Dashboard', '✅ Full', '✅ View', '✅ Full', '❌ No Access', '✅ View Only', '❌ No Access', '❌ No Access'],
                      ['🔍 Data Tier Browser', '✅ Full', '✅ View', '✅ Finance', '❌ No Access', '✅ View Only', '✅ HR modules', '❌ No Access'],
                      ['🔄 Archive Jobs — Run/Pause', '✅', '✅ Authorize', '✅ Initiate', '❌', '❌', '❌', '❌'],
                      ['📦 Cold Storage — Push/Delete', '✅', '✅ Authorize', '✅ Initiate', '❌', '❌', '❌', '❌'],
                      ['📤 Cold-storage retrieval', '✅ Full', '✅ Approve', '✅ Request', '❌', '❌', '❌', '❌'],
                      ['⚙️ Archive Settings', '✅ Full', '❌', '❌', '❌', '❌', '❌', '❌'],
                      ['🔍 Archive Audit Trail', '✅', '✅', '✅ Own acts', '❌', '✅ Full', '❌', '❌'],
                      ['🗑️ Delete Audit Trail', '❌ NEVER', '❌ NEVER', '❌ NEVER', '❌ NEVER', '❌ NEVER', '❌ NEVER', '❌ NEVER']
                    ].map((row) => (
                      <tr key={row[0]}>
                        {row.map((cell, i) => (
                          <td key={i} className={`p-2 ${i === 0 ? 'font-semibold text-gray-900 whitespace-nowrap' : 'text-gray-600'}`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Panel>
        </div>
      )}

      {/* SECTION 4 — security */}
      {tab === TABS[3] && (
        <Panel
          icon={ShieldCheck}
          title="Compression & Security Settings"
          subtitle="How archives are compressed, encrypted and verified"
          actions={
            <Button size="sm" className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => persistSettings('Compression and security settings saved in this browser.')}>
              <Save className="w-3.5 h-3.5 mr-1.5" /> Save Settings
            </Button>
          }
        >
          <div className="p-5 space-y-5 text-xs">
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Compression</p>
              <div className="flex flex-wrap gap-4">
                {['GZIP', 'BZIP2', 'ZSTD', 'LZ4'].map((m) => (
                  <label key={m} className="flex items-center gap-2">
                    <input type="radio" name="comp" checked={compression === m} onChange={() => setCompression(m)} />
                    <span className="text-gray-700">{m}</span>
                  </label>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <label className="text-[11px] text-gray-600">Level</label>
                <select value={level} onChange={(e) => setLevel(e.target.value)} className="p-1.5 border border-gray-300 rounded-md text-xs bg-white">
                  {['1', '3', '6', '9'].map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
                <span className="text-[11px] text-gray-500">(1 = fastest / largest → 9 = slowest / smallest)</span>
              </div>
              <p className="text-[11px] text-emerald-700">Current compression ratio: ~70% size reduction (Good)</p>
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2">
              <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Encryption</p>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2">
                  <input type="radio" name="enc" checked={encrypt} onChange={() => setEncrypt(true)} />
                  <span className="text-gray-700">Yes — AES-256</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="enc" checked={!encrypt} onChange={() => setEncrypt(false)} />
                  <span className="text-gray-700">No — not recommended</span>
                </label>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="text-[11px] text-gray-600">Key management</label>
                <select value={keyMgmt} onChange={(e) => setKeyMgmt(e.target.value)} className="p-1.5 border border-gray-300 rounded-md text-xs bg-white">
                  <option>Auto-managed by ERP</option>
                  <option>Custom Key</option>
                </select>
                <label className="text-[11px] text-gray-600">Key rotation</label>
                <select value={keyRotation} onChange={(e) => setKeyRotation(e.target.value)} className="p-1.5 border border-gray-300 rounded-md text-xs bg-white">
                  <option>Every 1 year</option>
                  <option>Every 2 years</option>
                  <option>Never</option>
                </select>
                <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={() => { setKeyRotationCount((count) => count + 1); showToast('Local encryption-key rotation request recorded; no key service was contacted.'); }}>
                  <KeyRound className="w-3 h-3 mr-1" /> Rotate Now
                </Button>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2">
              <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Integrity</p>
              <div className="flex flex-wrap gap-4">
                {['SHA256', 'MD5', 'SHA512'].map((c) => (
                  <label key={c} className="flex items-center gap-2">
                    <input type="radio" name="chk" checked={checksum === c} onChange={() => setChecksum(c)} />
                    <span className="text-gray-700">{c}</span>
                  </label>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2">
                  <input type="radio" name="ver" checked={verifyOnRetrieval} onChange={() => setVerifyOnRetrieval(true)} />
                  <span className="text-gray-700">Verify on retrieval — always</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="ver" checked={!verifyOnRetrieval} onChange={() => setVerifyOnRetrieval(false)} />
                  <span className="text-gray-700">Trust storage</span>
                </label>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-[11px] text-gray-600">
              Active profile: <strong>{compression} level {level}</strong> · {encrypt ? 'AES-256 encryption' : 'no encryption'} ·{' '}
              {checksum} checksums · key rotation {keyRotation.toLowerCase()} · local rotation requests {keyRotationCount}
            </div>
          </div>
        </Panel>
      )}

      {/* SECTION 5 — notifications */}
      {tab === TABS[4] && (
        <Panel
          icon={Bell}
          title="Notification Settings"
          subtitle="Who gets told when the archive system needs attention"
          actions={
            <Button size="sm" className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => persistSettings('Notification settings saved in this browser.')}>
              <Save className="w-3.5 h-3.5 mr-1.5" /> Save Notification Settings
            </Button>
          }
        >
          <div className="p-5 space-y-5 text-xs">
            <div>
              <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">Notify on these events</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {(
                  [
                    ['jobFailed', 'Archive / cleanup job failed', 'Immediate — retry window 60 min'],
                    ['primaryLimit', 'Primary DB crossed the size threshold', 'At 40 GB warn, 50 GB force archive'],
                    ['coldPush', 'Cold push completed', 'Include compression ratio and archived file reference'],
                    ['retrievalDone', 'Retrieval completed or failed', 'Include retrieval ID and expiry window'],
                    ['deletionDue', 'Files eligible for deletion', 'Weekly digest to Super Admin + Principal'],
                    ['providerError', 'Cold storage provider check failed', 'Immediate — includes connection test output']
                  ] as const
                ).map(([key, label, hint]) => (
                  <label key={key} className="flex items-start gap-2 rounded-lg border border-gray-200 p-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyEvents[key]}
                      onChange={(e) => setNotifyEvents((p) => ({ ...p, [key]: e.target.checked }))}
                      className="mt-0.5"
                    />
                    <span>
                      <span className="block font-medium text-gray-800">{label}</span>
                      <span className="block text-[11px] text-gray-500">{hint}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">Delivery channels</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {(
                  [
                    ['inApp', 'In-App notification', 'Bell icon in the ERP header'],
                    ['email', 'Email', 'admin@school.com, finance@school.com'],
                    ['sms', 'SMS', 'Only for critical failures']
                  ] as const
                ).map(([key, label, hint]) => (
                  <label key={key} className="flex items-start gap-2 rounded-lg border border-gray-200 p-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channels[key]}
                      onChange={(e) => setChannels((p) => ({ ...p, [key]: e.target.checked }))}
                      className="mt-0.5"
                    />
                    <span>
                      <span className="block font-medium text-gray-800">{label}</span>
                      <span className="block text-[11px] text-gray-500">{hint}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => {
                  const enabled = Object.entries(channels).filter(([, active]) => active).map(([name]) => name);
                  if (!enabled.length) { showToast('Select at least one delivery channel before sending a test.'); return; }
                  setTestRun(true);
                  showToast(`Test notification prepared for: ${enabled.join(', ')} (frontend simulation).`);
                }}
              >
                <Bell className="w-3.5 h-3.5 mr-1.5" /> Send Test Notification
              </Button>
              {testRun && <Pill tone="blue">✓ Test prepared (simulation)</Pill>}
            </div>
          </div>
        </Panel>
      )}

      {/* SECTION 6 — provider */}
      {tab === TABS[5] && (
        <Panel
          icon={Cloud}
          title="Cold Storage Provider Configuration"
          subtitle="Super Admin only — changes here affect cold storage connectivity"
          actions={
            <>
              <Button variant="outline" size="sm" className="text-xs" onClick={runConnectionTest}>
                <Link2 className="w-3.5 h-3.5 mr-1.5" /> Test Connection
              </Button>
              <Button size="sm" className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => persistSettings('Cold-storage provider settings saved in this browser.')}>
                <Save className="w-3.5 h-3.5 mr-1.5" /> Save Provider Settings
              </Button>
            </>
          }
        >
          <div className="p-5 space-y-5 text-xs">
            <div className="flex flex-wrap gap-4">
              {['AWS S3 Glacier', 'Azure Archive', 'Google Coldline', 'Backblaze B2', 'Custom S3-Compatible'].map((p) => (
                <label key={p} className="flex items-center gap-2">
                  <input type="radio" name="provider" checked={provider === p} onChange={() => setProvider(p)} />
                  <span className={provider === p ? 'font-semibold text-gray-900' : 'text-gray-600'}>{p}</span>
                </label>
              ))}
            </div>

            <div className={`rounded-lg border p-3 text-[11px] space-y-1 ${connectionResult.includes('passed') ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : connectionResult.includes('failed') ? 'border-rose-200 bg-rose-50 text-rose-900' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
              <p className="font-semibold">{connectionResult}</p>
              <p>Selected provider: {provider} · region: {region} · vault: {vault || 'Not entered'}</p>
              <p>Connection Test is a local form validation only; this frontend does not contact a cloud provider.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-gray-600 mb-1 font-medium">Provider Access Key (demo)</label>
                <div className="flex gap-2">
                  <input type={showAccessKey ? 'text' : 'password'} value={accessKey} onChange={(event) => setAccessKey(event.target.value)} className="flex-1 p-2 border border-gray-300 rounded-md text-xs font-mono" />
                  <Button variant="outline" size="sm" className="h-8 text-[11px]" title="Rotate demo key" onClick={() => rotateDemoCredential('access')}>
                    <KeyRound className="w-3 h-3" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-[11px]" title={showAccessKey ? 'Hide key' : 'Reveal for 30 seconds'} onClick={() => showAccessKey ? setShowAccessKey(false) : revealCredential('access')}>
                    <Eye className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-gray-600 mb-1 font-medium">Provider Secret Key (demo)</label>
                <div className="flex gap-2">
                  <input type={showSecretKey ? 'text' : 'password'} value={secretKey} onChange={(event) => setSecretKey(event.target.value)} className="flex-1 p-2 border border-gray-300 rounded-md text-xs font-mono" />
                  <Button variant="outline" size="sm" className="h-8 text-[11px]" title="Rotate demo secret" onClick={() => rotateDemoCredential('secret')}>
                    <KeyRound className="w-3 h-3" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-[11px]" title={showSecretKey ? 'Hide secret' : 'Reveal for 30 seconds'} onClick={() => showSecretKey ? setShowSecretKey(false) : revealCredential('secret')}>
                    <Eye className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-gray-600 mb-1 font-medium">Region</label>
                <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-xs bg-white">
                  <option>ap-south-1 (Mumbai)</option>
                  <option>ap-south-2 (Hyderabad)</option>
                  <option>us-east-1 (N. Virginia)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-gray-600 mb-1 font-medium">Vault Name</label>
                <input value={vault} onChange={(e) => setVault(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-xs font-mono" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[11px] text-gray-600 mb-1 font-medium">SNS Topic ARN</label>
                <input
                  value={snsTopic}
                  onChange={(event) => setSnsTopic(event.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-xs font-mono"
                />
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 p-3 space-y-1 text-[11px] text-gray-700">
              <p className="font-bold text-gray-800">LOCAL CONNECTION-CHECK RESULT</p>
              <p>{connectionResult}</p>
              <p>Credential fields are demo-only and are never sent to a provider or persisted in local storage.</p>
              <p>Key rotation count this session: {keyRotationCount}</p>
            </div>
            <p className="text-[10px] text-gray-500">Frontend preview only: configure real provider connectivity in the production backend; do not enter production secrets here.</p>
          </div>
        </Panel>
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-sm">{toast}</span>
        </div>
      )}
    </div>
  );
}

export default ArchiveSettingsRules;
