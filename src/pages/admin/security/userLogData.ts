// userLogData.ts — data + types for RBAC ▸ User Log
//
// Scope: this module ONLY carries authentication activity and access-control
// (RBAC) changes for one user at a time. What the user did inside academics,
// finance, admissions and the other ERP modules belongs to the System Log.
//
// Four areas:
//   1. Login, Logout & Active Sessions
//   2. Security & Access Violations
//   3. Password & Authentication Changes
//   4. Account & RBAC Changes
//
// Read-only: nothing here can be edited or deleted. Sensitive values (passwords,
// OTP numbers, reset tokens, 2FA secrets) are NEVER stored — only the event.

export type DeviceType = 'Desktop' | 'Mobile' | 'Tablet';
export type Severity = 'High' | 'Medium' | 'Low';

/** Row level status used by the page-wide Status filter. */
export type FilterStatus = 'success' | 'failed' | 'blocked' | 'flagged';

export type SessionState = 'active' | 'logged_out' | 'expired' | 'force_logout' | 'failed';
export type LoginMethod = 'Password' | 'OTP' | 'SSO' | 'Google' | 'Microsoft';

export interface LogUser {
  id: string;
  name: string;
  empId: string;
  role: string;
  branch: string;
  status: 'Active' | 'Suspended';
  joined: string;
  lastLogin: string;
  icon: string;
  email: string;
  department?: string;
  subject?: string;
  classes: string[];
  dataScope: string;
  academicYear: string;
  permissionPage: string;
  permissions: string[];
}

/* ---------------------------------------------------------- 1. sessions */

export interface SessionRow {
  id: string;
  /** Login timestamp, school local time. */
  at: string;
  state: SessionState;
  filterStatus: FilterStatus;
  loginStatus: 'success' | 'failed' | 'blocked';
  duration: string;
  durationNote: string;
  sessionId: string;
  logoutAt?: string;
  endReason: 'manual_logout' | 'session_expired' | 'force_logout' | 'browser_closed' | '—';
  ip: string;
  ipType: 'Internal' | 'External';
  device: DeviceType;
  browser: string;
  os: string;
  loginMethod: LoginMethod;
  twoFA: boolean;
  attempt?: string;
  flags: string[];
  securityNote: string;
}

/* ------------------------------------------------- 2. security events */

export interface SecurityEventRow {
  id: string;
  at: string;
  icon: string;
  event: string;
  kind: 'failed_login' | 'account_locked' | 'suspicious' | 'force_logout';
  severity: Severity;
  filterStatus: FilterStatus;
  details: string;
  attempt?: string;
  reason?: string;
  ip?: string;
  device?: string;
  flags?: string[];
  lockedBy?: string;
  unlockedAt?: string;
  unlockedBy?: string;
  terminatedBy?: string;
  terminatedSession?: string;
}

/* ------------------------------------------- 3. password & auth events */

export interface AuthEventRow {
  id: string;
  at: string;
  icon: string;
  event: string;
  kind: 'password' | 'otp' | 'reset' | '2fa';
  filterStatus: FilterStatus;
  details: string;
  method?: string;
  attempt?: string;
  by?: string;
  maskedEmail?: string;
  purpose?: string;
  note?: string;
}

/* ------------------------------------------- 4. account & RBAC changes */

export type AccountGroup = 'status' | 'role' | 'permission' | 'scope' | 'profile';

export interface AccountChangeRow {
  id: string;
  at: string;
  icon: string;
  changeType: string;
  group: AccountGroup;
  filterStatus: FilterStatus;
  details: string;
  doneBy: string;
  reason?: string;
  /** permission level before → after (role & permission changes) */
  diff?: { label: string; before: string; after: string; isNew?: boolean }[];
  /** plain field before → after (profile / status changes) */
  fields?: { label: string; before: string; after: string }[];
  /** class · division · subject rows (scope changes) */
  scope?: { className: string; division: string; subject: string; isNew?: boolean }[];
  scopeName?: string;
  previousAssignments?: string;
  note?: string;
}

/* ------------------------------------------------------------- bundles */

export interface UserLogBundle {
  quickStats: { logins: number; activeNow: number; failedLogins: number; flags: number };
  sessionSummary: { totalSessions: number; avgDuration: string; uniqueIps: number; mostUsedDevice: string; lastActive: string };
  sessions: SessionRow[];
  securityStatus: { accountStatus: string; lastFailedLogin: string; accountLocked: string; totalFlags: string };
  securityEvents: SecurityEventRow[];
  authSummary: { lastPasswordChange: string; totalResets: string; twoFA: string; otpThisMonth: string };
  authEvents: AuthEventRow[];
  accountTimeline: {
    created: string;
    lastRoleChange: string;
    lastPermissionChange: string;
    lastScopeChange: string;
    lastStatusChange: string;
  };
  accountChanges: AccountChangeRow[];
}

/* --------------------------------------------------------------- users */

export const LOG_USERS: LogUser[] = [
  {
    id: 'u1',
    name: 'Mrs. Priya Sharma',
    empId: 'EMP-T001',
    role: 'Subject Teacher',
    branch: 'Main Branch',
    status: 'Active',
    joined: '12 Jun 2022',
    lastLogin: '30 Sep 2025, 09:15 AM',
    icon: '👩‍🏫',
    email: 'p.sharma@school.com',
    department: 'Mathematics',
    subject: 'Mathematics',
    classes: ['8-A', '8-B', '9-A'],
    dataScope: 'Own Class+Subject',
    academicYear: '2025-26',
    permissionPage: 'Student Marks',
    permissions: ['View', 'Create', 'Edit', 'Approve', 'Export']
  },
  {
    id: 'u2',
    name: 'Mr. Ravi Shah',
    empId: 'EMP-1188',
    role: 'Accountant',
    branch: 'Main Branch',
    status: 'Active',
    joined: '03 Apr 2021',
    lastLogin: '30 Sep 2025, 10:06 AM',
    icon: '🧑‍💼',
    email: 'ravi.shah@school.com',
    department: 'Accounts',
    classes: [],
    dataScope: 'Fee Collection Officer',
    academicYear: '2025-26',
    permissionPage: 'Fee Collection',
    permissions: ['View', 'Create', 'Edit', 'Export']
  },
  {
    id: 'u3',
    name: 'Mrs. Kavita Rao',
    empId: 'EMP-1042',
    role: 'HR Manager',
    branch: 'Main Branch',
    status: 'Active',
    joined: '18 Jul 2020',
    lastLogin: '30 Sep 2025, 09:40 AM',
    icon: '👩‍💼',
    email: 'kavita.rao@school.com',
    department: 'Human Resources',
    classes: [],
    dataScope: 'Own Branch Only',
    academicYear: '2025-26',
    permissionPage: 'Payroll Processing',
    permissions: ['View', 'Create', 'Edit', 'Approve']
  },
  {
    id: 'u4',
    name: 'Ms. Meenal Joshi',
    empId: 'EMP-2077',
    role: 'Teacher',
    branch: 'Satellite Branch — Ahmedabad',
    status: 'Active',
    joined: '05 Jun 2023',
    lastLogin: '30 Sep 2025, 08:22 AM',
    icon: '👩‍🏫',
    email: 'meenal.joshi@school.com',
    department: 'Science',
    subject: 'Science',
    classes: ['8-A'],
    dataScope: 'Own Class+Subject',
    academicYear: '2025-26',
    permissionPage: 'Student Marks',
    permissions: ['View', 'Create', 'Edit']
  },
  {
    id: 'u5',
    name: 'Mr. Anil Mehta',
    empId: 'EMP-1001',
    role: 'Super Admin',
    branch: 'Main Branch',
    status: 'Active',
    joined: '01 Apr 2019',
    lastLogin: '30 Sep 2025, 11:04 AM',
    icon: '🧑‍💻',
    email: 'anil.mehta@school.com',
    department: 'Administration',
    classes: [],
    dataScope: 'All Data',
    academicYear: '2025-26',
    permissionPage: 'Role Management',
    permissions: ['View', 'Create', 'Edit', 'Delete', 'Approve', 'Export']
  }
];

/* ------------------------------------------------- filter option lists */

export const DATE_PRESETS = ['Today', 'Last 7 Days', 'Last 30 Days', 'Last 3 Months', 'This Academic Year', 'Custom Range'] as const;
export type DatePreset = (typeof DATE_PRESETS)[number];

export const STATUS_FILTERS: { id: 'All' | FilterStatus; label: string }[] = [
  { id: 'All', label: 'All' },
  { id: 'success', label: 'Success' },
  { id: 'failed', label: 'Failed' },
  { id: 'blocked', label: 'Blocked' },
  { id: 'flagged', label: 'Flagged' }
];

export const SECURITY_KIND_FILTERS: { id: 'all' | SecurityEventRow['kind']; label: string }[] = [
  { id: 'all', label: 'All Events' },
  { id: 'failed_login', label: 'Failed Login' },
  { id: 'account_locked', label: 'Account Locked' },
  { id: 'suspicious', label: 'Suspicious Activity' },
  { id: 'force_logout', label: 'Force Logout' }
];

export const ACCOUNT_GROUP_FILTERS: { id: 'all' | AccountGroup; label: string }[] = [
  { id: 'all', label: 'All Changes' },
  { id: 'status', label: 'Account Status' },
  { id: 'role', label: 'Role' },
  { id: 'permission', label: 'Permission' },
  { id: 'scope', label: 'Scope' },
  { id: 'profile', label: 'Profile' }
];

export const SESSION_STATE_META: Record<SessionState, { icon: string; label: string; cls: string }> = {
  active: { icon: '🟢', label: 'Active', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  logged_out: { icon: '✅', label: 'Logged Out', cls: 'bg-slate-100 text-slate-700 border-slate-200' },
  expired: { icon: '⏱️', label: 'Expired', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  force_logout: { icon: '🔴', label: 'Force Logout', cls: 'bg-rose-50 text-rose-700 border-rose-200' },
  failed: { icon: '❌', label: 'Failed', cls: 'bg-rose-50 text-rose-700 border-rose-200' }
};

export const SEVERITY_META: Record<Severity, { icon: string; cls: string; meaning: string }> = {
  High: { icon: '🔴', cls: 'bg-rose-50 text-rose-700 border-rose-200', meaning: 'Account locked, or login at an unusual hour from a new network' },
  Medium: { icon: '⚠️', cls: 'bg-amber-50 text-amber-700 border-amber-200', meaning: 'Login outside school hours, or login from an external network' },
  Low: { icon: 'ℹ️', cls: 'bg-sky-50 text-sky-700 border-sky-200', meaning: 'Single failed login attempt, or a first login from a new device' }
};

const SUPER_ADMIN = 'Mr. Ramesh (Super Admin · EMP-A001)';

/* -------------------------------------------------------- seed helpers */

interface Seed {
  user: LogUser;
  ip: string;
  ipType: 'Internal' | 'External';
  device: DeviceType;
  browser: string;
  os: string;
  method: LoginMethod;
  twoFA: boolean;
  activeCount: number;
  activeAt: string;
  liveDuration: string;
  logins: number;
  avgDuration: string;
  uniqueIps: number;
  mostUsedDevice: string;
  flags: number;
  failedLogins: number;
  accountStatus: string;
  lastFailedLogin: string;
  accountLocked: string;
  totalFlags: string;
  lastPasswordChange: string;
  totalResets: string;
  twoFAStatus: string;
  otpThisMonth: string;
  created: string;
  lastRoleChange: string;
  lastPermissionChange: string;
  lastScopeChange: string;
  lastStatusChange: string;
  seedId: string;
}

const SEEDS: Seed[] = [
  {
    user: LOG_USERS[0],
    ip: '192.168.1.5', ipType: 'Internal', device: 'Desktop', browser: 'Chrome 120', os: 'Windows 11',
    method: 'Password', twoFA: false, activeCount: 1, activeAt: '30 Sep 2025, 09:15:22 AM', liveDuration: '2h 14m',
    logins: 42, avgDuration: '1h 24m', uniqueIps: 2, mostUsedDevice: 'Desktop (Chrome · Windows)', flags: 3, failedLogins: 2,
    accountStatus: 'Active and Secure',
    lastFailedLogin: '27 Sep 2025 at 08:48 AM (1 attempt)',
    accountLocked: 'Never',
    totalFlags: '3 this month',
    lastPasswordChange: '01 Sep 2025 (27 days ago) — changed by the user',
    totalResets: '1 total — 15 Jan 2025, reset by admin',
    twoFAStatus: '⚪ Not enabled',
    otpThisMonth: '3 requests, 3 verified',
    created: '12 Jun 2022 — by Mr. Ramesh (Super Admin)',
    lastRoleChange: '15 Aug 2025 — Teacher → Subject Teacher',
    lastPermissionChange: '28 Sep 2025 — Export added on Student Marks page',
    lastScopeChange: '01 Apr 2025 — Class 9-A · Mathematics added',
    lastStatusChange: '15 Jan 2025 — Reactivated after suspension',
    seedId: 'AB4521'
  },
  {
    user: LOG_USERS[1],
    ip: '192.168.1.14', ipType: 'Internal', device: 'Desktop', browser: 'Edge 131', os: 'Windows 11',
    method: 'OTP', twoFA: true, activeCount: 1, activeAt: '30 Sep 2025, 10:06:41 AM', liveDuration: '1h 02m',
    logins: 38, avgDuration: '1h 11m', uniqueIps: 3, mostUsedDevice: 'Desktop (Edge · Windows)', flags: 2, failedLogins: 3,
    accountStatus: 'Active — locked once, unlocked by admin',
    lastFailedLogin: '30 Sep 2025 at 09:52 AM (2 attempts)',
    accountLocked: 'Locked 12 Sep 2025, auto after 5 failed attempts — unlocked 12 Sep 2025 by admin',
    totalFlags: '2 this month',
    lastPasswordChange: '18 Aug 2025 (43 days ago) — reset by admin',
    totalResets: '2 total — last on 18 Aug 2025 by Mr. Ramesh',
    twoFAStatus: '🟢 Enabled — OTP on mobile',
    otpThisMonth: '9 requests, 8 verified, 1 failed',
    created: '03 Apr 2021 — by Mr. Ramesh (Super Admin)',
    lastRoleChange: '20 Jul 2024 — Junior Accountant → Accountant',
    lastPermissionChange: '22 Sep 2025 — Export added on Fee Collection page',
    lastScopeChange: '01 Apr 2025 — Branch scope raised to Full Branch',
    lastStatusChange: '12 Sep 2025 — Unlocked after auto-lock',
    seedId: 'CD7712'
  },
  {
    user: LOG_USERS[2],
    ip: '192.168.1.22', ipType: 'Internal', device: 'Desktop', browser: 'Chrome 120', os: 'Windows 11',
    method: 'SSO', twoFA: true, activeCount: 2, activeAt: '30 Sep 2025, 09:40:09 AM', liveDuration: '3h 06m',
    logins: 51, avgDuration: '2h 02m', uniqueIps: 2, mostUsedDevice: 'Desktop (Chrome · Windows)', flags: 1, failedLogins: 1,
    accountStatus: 'Active and Secure',
    lastFailedLogin: '08 Sep 2025 at 07:58 AM (1 attempt)',
    accountLocked: 'Never',
    totalFlags: '1 this month',
    lastPasswordChange: '05 Jul 2025 (87 days ago) — changed by the user',
    totalResets: '0 total',
    twoFAStatus: '🟢 Enabled — Authenticator app',
    otpThisMonth: '6 requests, 6 verified',
    created: '18 Jul 2020 — by Mr. Ramesh (Super Admin)',
    lastRoleChange: '01 Mar 2023 — HR Executive → HR Manager',
    lastPermissionChange: '12 Sep 2025 — Approve added on Leave Management page',
    lastScopeChange: '01 Apr 2025 — Branch scope raised to All Branches',
    lastStatusChange: '12 Sep 2025 — Two active sessions flagged and reviewed',
    seedId: 'EF9930'
  },
  {
    user: LOG_USERS[3],
    ip: '192.168.7.31', ipType: 'Internal', device: 'Tablet', browser: 'Safari 17', os: 'iPadOS 17',
    method: 'Password', twoFA: false, activeCount: 0, activeAt: '30 Sep 2025, 08:22:14 AM', liveDuration: '—',
    logins: 24, avgDuration: '48m', uniqueIps: 4, mostUsedDevice: 'Tablet (Safari · iPadOS)', flags: 4, failedLogins: 5,
    accountStatus: 'Active — recovered after a lock',
    lastFailedLogin: '29 Sep 2025 at 09:14 PM (3 attempts)',
    accountLocked: 'Locked 29 Sep 2025, auto after 5 failed attempts — unlocked 30 Sep 2025 by admin',
    totalFlags: '4 this month',
    lastPasswordChange: '30 Sep 2025 (today) — reset by admin',
    totalResets: '1 total — 30 Sep 2025, reset by admin after lock',
    twoFAStatus: '⚪ Not enabled',
    otpThisMonth: '2 requests, 1 verified, 1 expired',
    created: '05 Jun 2023 — by Mrs. Kavita Rao (HR Manager)',
    lastRoleChange: '05 Jun 2023 — role assigned: Teacher',
    lastPermissionChange: '26 Aug 2025 — Export revoked on Student Marks page',
    lastScopeChange: '01 Apr 2025 — Class 8-A · Science assigned',
    lastStatusChange: '30 Sep 2025 — Unlocked after admin password reset',
    seedId: 'GH2201'
  },
  {
    user: LOG_USERS[4],
    ip: '192.168.1.2', ipType: 'Internal', device: 'Desktop', browser: 'Chrome 120', os: 'Windows 11',
    method: 'Microsoft', twoFA: true, activeCount: 1, activeAt: '30 Sep 2025, 11:04:55 AM', liveDuration: '5h 41m',
    logins: 76, avgDuration: '3h 18m', uniqueIps: 2, mostUsedDevice: 'Desktop (Chrome · Windows)', flags: 1, failedLogins: 0,
    accountStatus: 'Active and Secure — highest privileged account',
    lastFailedLogin: 'None in the last 90 days',
    accountLocked: 'Never',
    totalFlags: '1 this month',
    lastPasswordChange: '02 Sep 2025 (28 days ago) — changed by the user',
    totalResets: '0 total',
    twoFAStatus: '🟢 Enabled — SMS + Authenticator',
    otpThisMonth: '14 requests, 14 verified',
    created: '01 Apr 2019 — by Mr. Ramesh (Super Admin)',
    lastRoleChange: '01 Apr 2019 — role assigned: Super Admin',
    lastPermissionChange: '10 Sep 2025 — Delete added on Role Management page',
    lastScopeChange: '01 Apr 2025 — Scope confirmed as All Data',
    lastStatusChange: '12 Sep 2025 — Backup 2FA code used, flagged for review',
    seedId: 'IJ5540'
  }
];

/* ------------------------------------------------------------- builders */

const mkSessions = (seed: Seed): SessionRow[] => {
  const { user } = seed;
  const rows: SessionRow[] = [];

  for (let i = 0; i < seed.activeCount; i += 1) {
    rows.push({
      id: `${user.id}-s${i + 1}`,
      at: i === 0 ? seed.activeAt : '30 Sep 2025, 09:38:31 AM',
      state: 'active',
      filterStatus: i === 0 ? 'success' : 'flagged',
      loginStatus: 'success',
      duration: i === 0 ? seed.liveDuration : '3h 06m',
      durationNote: 'Still active',
      sessionId: `SES-20250930-${seed.seedId}${i + 1}`,
      endReason: '—',
      ip: seed.ip,
      ipType: seed.ipType,
      device: seed.device,
      browser: seed.browser,
      os: seed.os,
      loginMethod: seed.method,
      twoFA: seed.twoFA,
      flags: i === 0 ? [] : ['concurrent_session_detected'],
      securityNote: i === 0 ? '✅ None — Normal session' : '⚠️ Login from a second device while the first session was open'
    });
  }

  rows.push(
    {
      id: `${user.id}-s${rows.length + 1}`,
      at: '27 Sep 2025, 08:50:10 AM',
      state: 'logged_out',
      filterStatus: 'success',
      loginStatus: 'success',
      duration: '3h 02m 11s',
      durationNote: 'Manual logout',
      sessionId: `SES-20250927-${seed.seedId}02`,
      logoutAt: '27 Sep 2025, 11:52:21 AM',
      endReason: 'manual_logout',
      ip: seed.ip,
      ipType: seed.ipType,
      device: seed.device,
      browser: seed.browser,
      os: seed.os,
      loginMethod: seed.method,
      twoFA: seed.twoFA,
      flags: [],
      securityNote: '✅ None — Normal session'
    },
    {
      id: `${user.id}-s${rows.length + 2}`,
      at: '26 Sep 2025, 03:00:44 PM',
      state: 'expired',
      filterStatus: 'success',
      loginStatus: 'success',
      duration: '45m 00s',
      durationNote: 'Session expired',
      sessionId: `SES-20250926-${seed.seedId}03`,
      logoutAt: '26 Sep 2025, 03:45:44 PM',
      endReason: 'session_expired',
      ip: seed.ip,
      ipType: seed.ipType,
      device: seed.device,
      browser: seed.browser,
      os: seed.os,
      loginMethod: seed.method,
      twoFA: seed.twoFA,
      flags: [],
      securityNote: '✅ None — Idle timeout, no suspicious activity'
    },
    {
      id: `${user.id}-s${rows.length + 3}`,
      at: '25 Sep 2025, 08:30:12 AM',
      state: 'force_logout',
      filterStatus: 'blocked',
      loginStatus: 'success',
      duration: '1h 10m 05s',
      durationNote: 'Admin terminated',
      sessionId: `SES-20250925-${seed.seedId}04`,
      logoutAt: '25 Sep 2025, 09:40:17 AM',
      endReason: 'force_logout',
      ip: seed.ip,
      ipType: seed.ipType,
      device: seed.device,
      browser: seed.browser,
      os: seed.os,
      loginMethod: seed.method,
      twoFA: seed.twoFA,
      flags: ['force_logout_by_admin'],
      securityNote: '🔴 Terminated by Admin — device left signed in at the reception desk'
    },
    {
      id: `${user.id}-s${rows.length + 4}`,
      at: '26 Sep 2025, 10:30:41 PM',
      state: 'logged_out',
      filterStatus: 'flagged',
      loginStatus: 'success',
      duration: '22m 08s',
      durationNote: 'Browser closed',
      sessionId: `SES-20250926-${seed.seedId}05`,
      logoutAt: '26 Sep 2025, 10:52:49 PM',
      endReason: 'browser_closed',
      ip: seed.ipType === 'External' ? seed.ip : '103.21.44.5',
      ipType: seed.ipType === 'External' ? 'Internal' : 'External',
      device: 'Mobile',
      browser: 'Safari 17',
      os: 'iOS 17',
      loginMethod: seed.method,
      twoFA: seed.twoFA,
      flags: ['login_outside_school_hours', 'login_from_external_network'],
      securityNote: '⚠️ Logged in at 10:30 PM from an external network — flagged for review'
    },
    {
      id: `${user.id}-s${rows.length + 5}`,
      at: '27 Sep 2025, 08:48:03 AM',
      state: 'failed',
      filterStatus: 'failed',
      loginStatus: 'failed',
      duration: '—',
      durationNote: 'Wrong password',
      sessionId: `SES-20250927-${seed.seedId}06`,
      endReason: '—',
      ip: seed.ip,
      ipType: seed.ipType,
      device: seed.device,
      browser: seed.browser,
      os: seed.os,
      loginMethod: 'Password',
      twoFA: false,
      attempt: '1 of 5',
      flags: [],
      securityNote: '❌ Login attempt failed — attempt 1 of 5, no lock triggered'
    },
    {
      id: `${user.id}-s${rows.length + 6}`,
      at: '12 Sep 2025, 09:05:12 AM',
      state: 'logged_out',
      filterStatus: 'success',
      loginStatus: 'success',
      duration: '1h 48m 40s',
      durationNote: 'Manual logout',
      sessionId: `SES-20250912-${seed.seedId}07`,
      logoutAt: '12 Sep 2025, 10:53:52 AM',
      endReason: 'manual_logout',
      ip: seed.ip,
      ipType: seed.ipType,
      device: 'Tablet',
      browser: 'Safari 17',
      os: 'iPadOS 17',
      loginMethod: seed.method,
      twoFA: seed.twoFA,
      flags: ['login_from_new_device'],
      securityNote: 'ℹ️ First login from this device — new device fingerprint recorded'
    },
    {
      id: `${user.id}-s${rows.length + 7}`,
      at: '15 Sep 2025, 02:14:56 AM',
      state: 'failed',
      filterStatus: 'blocked',
      loginStatus: 'blocked',
      duration: '—',
      durationNote: 'Blocked — suspicious',
      sessionId: `SES-20250915-${seed.seedId}08`,
      endReason: '—',
      ip: '45.116.208.19',
      ipType: 'External',
      device: 'Desktop',
      browser: 'Firefox 121',
      os: 'Windows 10',
      loginMethod: 'Password',
      twoFA: false,
      flags: ['login_outside_school_hours', 'login_from_new_ip', 'login_from_external_network'],
      securityNote: '🚨 Blocked before authentication — 2:14 AM from a new IP address'
    }
  );

  return rows;
};

const mkSecurityEvents = (seed: Seed): SecurityEventRow[] => {
  const { user } = seed;
  const events: SecurityEventRow[] = [
    {
      id: `${user.id}-v1`,
      at: '27 Sep 2025, 08:48:03 AM',
      icon: '❌',
      event: 'Failed Login',
      kind: 'failed_login',
      severity: 'Low',
      filterStatus: 'failed',
      details: 'Wrong password entered for the account — attempts left before a lock: 4.',
      reason: 'wrong_password',
      attempt: '1 of 5',
      ip: seed.ip,
      device: `${seed.device} · ${seed.browser} · ${seed.os}`
    },
    {
      id: `${user.id}-v2`,
      at: '26 Sep 2025, 10:30:41 PM',
      icon: '⚠️',
      event: 'Login Outside School Hours',
      kind: 'suspicious',
      severity: 'Medium',
      filterStatus: 'flagged',
      details: 'Login at 10:30 PM — outside the configured school hours (07:00–21:00) and from an external network.',
      ip: seed.ipType === 'External' ? seed.ip : '103.21.44.5',
      device: 'Mobile · Safari 17 · iOS 17',
      flags: ['login_outside_school_hours', 'login_from_external_network']
    },
    {
      id: `${user.id}-v3`,
      at: '15 Sep 2025, 02:14:56 AM',
      icon: '🚨',
      event: 'Suspicious Login Attempt',
      kind: 'suspicious',
      severity: 'High',
      filterStatus: 'blocked',
      details: 'Login at 2:14 AM from a new IP address and a new network range — blocked and raised for review.',
      ip: '45.116.208.19',
      device: 'Desktop · Firefox 121 · Windows 10',
      flags: ['login_outside_school_hours', 'login_from_new_ip', 'login_from_external_network']
    },
    {
      id: `${user.id}-v4`,
      at: '12 Sep 2025, 09:05:12 AM',
      icon: 'ℹ️',
      event: 'Login From New Device',
      kind: 'suspicious',
      severity: 'Low',
      filterStatus: 'flagged',
      details: 'First login from a tablet — new device fingerprint recorded against the account.',
      ip: seed.ip,
      device: 'Tablet · Safari 17 · iPadOS 17',
      flags: ['login_from_new_device']
    },
    {
      id: `${user.id}-v5`,
      at: '10 Sep 2025, 04:20:33 PM',
      icon: '⚠️',
      event: 'Concurrent Session Detected',
      kind: 'suspicious',
      severity: 'Medium',
      filterStatus: 'flagged',
      details: 'A second login was attempted while another session was still active. Both sessions were recorded.',
      ip: seed.ip,
      device: 'Mobile · Chrome 119 · Android 14',
      flags: ['concurrent_session_detected']
    },
    {
      id: `${user.id}-v6`,
      at: '25 Sep 2025, 08:30:12 AM',
      icon: '🔴',
      event: 'Force Logout By Admin',
      kind: 'force_logout',
      severity: 'Medium',
      filterStatus: 'blocked',
      details: 'Session terminated by an administrator from the Active Sessions panel.',
      terminatedBy: SUPER_ADMIN,
      terminatedSession: `SES-20250925-${seed.seedId}04`,
      reason: 'Device left signed in at the reception desk',
      ip: seed.ip,
      device: `${seed.device} · ${seed.browser} · ${seed.os}`
    }
  ];

  // Account-lock history only for the users whose seed says they were locked.
  if (seed.accountLocked !== 'Never') {
    events.unshift({
      id: `${user.id}-v0`,
      at: '12 Sep 2025, 09:58:12 AM',
      icon: '🔒',
      event: 'Account Locked',
      kind: 'account_locked',
      severity: 'High',
      filterStatus: 'blocked',
      details: 'Account locked automatically after the maximum 5 failed login attempts inside 10 minutes.',
      attempt: '5 of 5',
      lockedBy: 'system_auto',
      unlockedAt: '12 Sep 2025, 10:15:40 AM',
      unlockedBy: `${SUPER_ADMIN} — unlocked with an admin password reset`,
      ip: '45.116.208.19',
      device: 'Desktop · Firefox 121 · Windows 10'
    });
  }

  return events;
};

const mkAuthEvents = (seed: Seed): AuthEventRow[] => {
  const { user } = seed;
  const localPart = user.email.split('@')[0].replace(/\./g, '');
  const masked = `${localPart.slice(0, 2)}***@school.com`;
  const events: AuthEventRow[] = [
    {
      id: `${user.id}-a1`,
      at: '01 Sep 2025, 09:00:12 AM',
      icon: '🔑',
      event: 'Password Changed',
      kind: 'password',
      filterStatus: 'success',
      details: 'Changed by the user themselves — only the timestamp is stored, never the old or new password.',
      method: 'Self-initiated'
    },
    {
      id: `${user.id}-a2`,
      at: '28 Aug 2025, 08:54:02 AM',
      icon: '📱',
      event: 'OTP Requested',
      kind: 'otp',
      filterStatus: 'success',
      details: 'One-time code requested for login verification — the numeric value is never stored.',
      purpose: 'Login verification'
    },
    {
      id: `${user.id}-a3`,
      at: '28 Aug 2025, 08:55:40 AM',
      icon: '✅',
      event: 'OTP Verified',
      kind: 'otp',
      filterStatus: 'success',
      details: 'One-time code entered correctly and the login was completed.',
      purpose: 'Login verification',
      attempt: '1 of 3'
    },
    {
      id: `${user.id}-a4`,
      at: '15 Jan 2025, 11:30:55 AM',
      icon: '🔐',
      event: 'Password Reset by Admin',
      kind: 'password',
      filterStatus: 'success',
      details: 'Password reset by an administrator after the account was locked out. Reason recorded below.',
      by: SUPER_ADMIN,
      note: 'Reason: locked out — identity confirmed at the front desk'
    },
    {
      id: `${user.id}-a5`,
      at: '10 Jan 2025, 09:15:36 AM',
      icon: '📧',
      event: 'Password Reset Link Requested',
      kind: 'reset',
      filterStatus: 'success',
      details: 'Forgot-password link requested and emailed. The link itself is never stored in the log.',
      maskedEmail: masked
    },
    {
      id: `${user.id}-a6`,
      at: '10 Jan 2025, 09:40:22 AM',
      icon: '✅',
      event: 'Password Reset Completed',
      kind: 'reset',
      filterStatus: 'success',
      details: 'Password reset finished through the emailed reset link.',
      method: 'Reset link'
    },
    {
      id: `${user.id}-a7`,
      at: '05 Jan 2025, 09:20:00 AM',
      icon: '⏳',
      event: 'Password Reset Link Expired',
      kind: 'reset',
      filterStatus: 'flagged',
      details: 'A previously requested reset link expired without being used.',
      maskedEmail: masked,
      note: 'Link was never opened'
    }
  ];

  if (seed.twoFA) {
    events.push({
      id: `${user.id}-a8`,
      at: '20 Aug 2025, 10:12:44 AM',
      icon: '🛡️',
      event: '2FA Enabled',
      kind: '2fa',
      filterStatus: 'success',
      details: 'Two-factor authentication turned on for this account.',
      method: seed.method === 'SSO' ? 'Authenticator app' : 'SMS on registered mobile'
    });
  }

  if (user.id === 'u3') {
    events.push({
      id: `${user.id}-a9`,
      at: '12 Sep 2025, 09:44:19 AM',
      icon: '🆘',
      event: '2FA Backup Code Used',
      kind: '2fa',
      filterStatus: 'flagged',
      details: 'An emergency backup code was used to sign in — flagged for review.',
      method: 'Backup code',
      note: 'Reason recorded: registered phone unavailable'
    });
  }

  if (user.id === 'u4') {
    events.push(
      {
        id: `${user.id}-a9`,
        at: '29 Sep 2025, 09:20:05 PM',
        icon: '❌',
        event: 'OTP Failed',
        kind: 'otp',
        filterStatus: 'failed',
        details: 'One-time code entered incorrectly.',
        purpose: 'Login verification',
        attempt: '1 of 3'
      },
      {
        id: `${user.id}-a10`,
        at: '29 Sep 2025, 09:20:58 PM',
        icon: '⏳',
        event: 'OTP Expired',
        kind: 'otp',
        filterStatus: 'flagged',
        details: 'A one-time code expired before it was used.',
        purpose: 'Login verification'
      },
      {
        id: `${user.id}-a11`,
        at: '30 Sep 2025, 07:40:31 AM',
        icon: '🔐',
        event: 'Password Reset by Admin',
        kind: 'password',
        filterStatus: 'success',
        details: 'Password reset by an administrator to release the account after the automatic lock.',
        by: SUPER_ADMIN,
        note: 'Reason: locked after 5 failed attempts'
      }
    );
  }

  return events;
};

const mkAccountChanges = (seed: Seed): AccountChangeRow[] => {
  const { user } = seed;
  const rows: AccountChangeRow[] = [
    {
      id: `${user.id}-c1`,
      at: '28 Sep 2025, 11:02:14 AM',
      icon: '🔓',
      changeType: 'Permission Granted',
      group: 'permission',
      filterStatus: 'success',
      details: 'Export added on the Student Marks page — before: not allowed → after: allowed.',
      doneBy: SUPER_ADMIN,
      reason: 'Needed the marks sheet for the parent-teacher meeting',
      diff: [{ label: 'Export', before: '❌ Not allowed', after: '✅ Allowed', isNew: true }],
      note: 'Role affected: Subject Teacher · Page: Student Marks (Academics)'
    },
    {
      id: `${user.id}-c2`,
      at: '15 Aug 2025, 10:00:38 AM',
      icon: '🎭',
      changeType: 'Role Changed',
      group: 'role',
      filterStatus: 'success',
      details: 'Teacher → Subject Teacher',
      doneBy: SUPER_ADMIN,
      reason: 'Promoted as Subject In-Charge for the Mathematics department',
      diff: [
        { label: 'View', before: '✅', after: '✅' },
        { label: 'Create', before: '✅', after: '✅' },
        { label: 'Edit', before: '✅', after: '✅' },
        { label: 'Delete', before: '❌', after: '❌' },
        { label: 'Approve', before: '❌', after: '✅', isNew: true },
        { label: 'Export', before: '❌', after: '✅', isNew: true }
      ],
      note: 'Effective from 15 Aug 2025 · Student Marks page shown as the permission sample'
    },
    {
      id: `${user.id}-c3`,
      at: '01 Apr 2025, 09:15:22 AM',
      icon: '🗺️',
      changeType: 'Scope Assignment Added',
      group: 'scope',
      filterStatus: 'success',
      details: 'Added Class 9-A · Mathematics to the data scope',
      doneBy: SUPER_ADMIN,
      reason: 'Scope refreshed for the new academic year 2025-26',
      scopeName: 'Own Class + Subject',
      scope: [{ className: 'Class 9', division: 'A', subject: 'Mathematics', isNew: true }],
      previousAssignments: 'Class 8-A · Mathematics    ·    Class 8-B · Mathematics'
    },
    {
      id: `${user.id}-c4`,
      at: '20 Mar 2025, 04:40:09 PM',
      icon: '✏️',
      changeType: 'Profile Edited',
      group: 'profile',
      filterStatus: 'success',
      details: 'Mobile number and residential address updated',
      doneBy: SUPER_ADMIN,
      fields: [
        { label: 'Mobile', before: '98••• ••1042', after: '99••• ••7781' },
        { label: 'Address', before: '201, Shanti Heights', after: '14, Sunrise Residency' },
        { label: 'Designation', before: 'Teacher', after: 'Subject Teacher' }
      ],
      note: 'Password fields are never captured in profile changes'
    },
    {
      id: `${user.id}-c5`,
      at: '10 Jan 2025, 11:20:41 AM',
      icon: '⏸️',
      changeType: 'Account Suspended',
      group: 'status',
      filterStatus: 'flagged',
      details: 'Account suspended pending an internal investigation',
      doneBy: SUPER_ADMIN,
      reason: 'Pending investigation — marks discrepancy reported by a parent',
      fields: [
        { label: 'Status', before: 'Active', after: 'Suspended' },
        { label: 'Suspended until', before: '—', after: 'Until the investigation closes' }
      ]
    },
    {
      id: `${user.id}-c6`,
      at: '15 Jan 2025, 03:05:18 PM',
      icon: '▶️',
      changeType: 'Account Reactivated',
      group: 'status',
      filterStatus: 'success',
      details: 'Account reactivated after the investigation was closed',
      doneBy: SUPER_ADMIN,
      reason: 'Investigation resolved — no action required',
      fields: [{ label: 'Status', before: 'Suspended', after: 'Active' }]
    },
    {
      id: `${user.id}-c7`,
      at: '12 Jun 2022, 10:00:00 AM',
      icon: '✅',
      changeType: 'Account Created',
      group: 'status',
      filterStatus: 'success',
      details: 'Initial account setup — role Teacher, Main Branch, classes 8-A and 8-B',
      doneBy: SUPER_ADMIN,
      fields: [
        { label: 'Role', before: '—', after: 'Teacher' },
        { label: 'Branch', before: '—', after: 'Main Branch' },
        { label: 'Joined', before: '—', after: '12 Jun 2022' }
      ]
    }
  ];

  if (user.id === 'u3') {
    rows.unshift({
      id: `${user.id}-c0`,
      at: '12 Sep 2025, 09:50:10 AM',
      icon: '🗄️',
      changeType: 'Scope Assignments Removed',
      group: 'scope',
      filterStatus: 'success',
      details: 'Removed Class 8-C · Science from the data scope',
      doneBy: SUPER_ADMIN,
      reason: 'Teacher moved to another division',
      scopeName: 'Own Class + Subject',
      scope: [{ className: 'Class 8', division: 'C', subject: 'Science' }],
      previousAssignments: 'Class 8-A · Science    ·    Class 9-B · Science'
    });
  }

  if (user.id === 'u5') {
    rows.unshift({
      id: `${user.id}-c0`,
      at: '12 Sep 2025, 05:12:08 PM',
      icon: '🆘',
      changeType: '2FA Emergency Access Reviewed',
      group: 'status',
      filterStatus: 'flagged',
      details: 'Backup-code sign-in reviewed and cleared by the Super Admin group',
      doneBy: 'Super Admin group (2 reviewers)',
      reason: 'Registered phone was unavailable — identity re-verified at the front desk',
      fields: [{ label: 'Review result', before: 'Flagged', after: 'Cleared — no action' }]
    });
  }

  return rows;
};

/* ------------------------------------------------------------- bundles */

const mkBundle = (seed: Seed): UserLogBundle => ({
  quickStats: {
    logins: seed.logins,
    activeNow: seed.activeCount,
    failedLogins: seed.failedLogins,
    flags: seed.flags
  },
  sessionSummary: {
    totalSessions: seed.logins,
    avgDuration: seed.avgDuration,
    uniqueIps: seed.uniqueIps,
    mostUsedDevice: seed.mostUsedDevice,
    lastActive: seed.user.lastLogin
  },
  sessions: mkSessions(seed),
  securityStatus: {
    accountStatus: seed.accountStatus,
    lastFailedLogin: seed.lastFailedLogin,
    accountLocked: seed.accountLocked,
    totalFlags: seed.totalFlags
  },
  securityEvents: mkSecurityEvents(seed),
  authSummary: {
    lastPasswordChange: seed.lastPasswordChange,
    totalResets: seed.totalResets,
    twoFA: seed.twoFAStatus,
    otpThisMonth: seed.otpThisMonth
  },
  authEvents: mkAuthEvents(seed),
  accountTimeline: {
    created: seed.created,
    lastRoleChange: seed.lastRoleChange,
    lastPermissionChange: seed.lastPermissionChange,
    lastScopeChange: seed.lastScopeChange,
    lastStatusChange: seed.lastStatusChange
  },
  accountChanges: mkAccountChanges(seed)
});

const bundles: Record<string, UserLogBundle> = SEEDS.reduce<Record<string, UserLogBundle>>((acc, seed) => {
  acc[seed.user.id] = mkBundle(seed);
  return acc;
}, {});

export const bundleFor = (userId: string): UserLogBundle => bundles[userId] || bundles.u1;
export const userById = (userId: string): LogUser => LOG_USERS.find((u) => u.id === userId) || LOG_USERS[0];
