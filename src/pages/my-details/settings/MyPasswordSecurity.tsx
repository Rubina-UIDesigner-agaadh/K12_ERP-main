import React, { useState } from 'react'
import {
  Lock,
  Shield,
  Key,
  Smartphone,
  Mail,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Download,
  Settings,
  Info,
  Copy,
  QrCode,
} from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Badge } from '../../../components/ui/Badge'
import { Modal } from '../../../components/ui/Modal'

// ══════════════════════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════════════════════

interface TwoFactorBackupCode {
  id: string
  code: string
  used: boolean
  usedAt: string
}

// ══════════════════════════════════════════════════════════════════════════════
// STATIC DATA
// ══════════════════════════════════════════════════════════════════════════════

const SECURITY_QUESTIONS = [
  { value: 'pet', label: "What was your first pet's name?" },
  { value: 'city', label: 'In which city were you born?' },
  { value: 'school', label: 'What was the name of your first school?' },
  { value: 'teacher', label: "What was your favorite teacher's name?" },
  { value: 'food', label: 'What is your favorite food?' },
  { value: 'book', label: 'What is your favorite book?' },
  { value: 'mother_maiden', label: "What is your mother's maiden name?" },
  {
    value: 'childhood_friend',
    label: "What was your childhood best friend's name?",
  },
]

const INITIAL_BACKUP_CODES: TwoFactorBackupCode[] = [
  { id: 'bc1', code: 'ABCD-1234-EFGH', used: false, usedAt: '' },
  { id: 'bc2', code: 'IJKL-5678-MNOP', used: false, usedAt: '' },
  { id: 'bc3', code: 'QRST-9012-UVWX', used: true, usedAt: '2024-10-15' },
  { id: 'bc4', code: 'YZAB-3456-CDEF', used: false, usedAt: '' },
  { id: 'bc5', code: 'GHIJ-7890-KLMN', used: false, usedAt: '' },
]

const PASSWORD_REQUIREMENTS = [
  {
    id: 'length',
    label: 'At least 8 characters',
    check: (pwd: string) => pwd.length >= 8,
  },
  {
    id: 'uppercase',
    label: 'Contains uppercase letter',
    check: (pwd: string) => /[A-Z]/.test(pwd),
  },
  {
    id: 'lowercase',
    label: 'Contains lowercase letter',
    check: (pwd: string) => /[a-z]/.test(pwd),
  },
  {
    id: 'number',
    label: 'Contains number',
    check: (pwd: string) => /[0-9]/.test(pwd),
  },
  {
    id: 'special',
    label: 'Contains special character',
    check: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
  },
]

const PASSWORD_EXPIRY_OPTIONS = [
  { value: '30', label: 'Every 30 days' },
  { value: '60', label: 'Every 60 days' },
  { value: '90', label: 'Every 90 days' },
  { value: '0', label: 'Never expire' },
]

const SESSION_TIMEOUT_OPTIONS = [
  { value: '15', label: '15 minutes' },
  { value: '30', label: '30 minutes' },
  { value: '60', label: '1 hour' },
  { value: '0', label: 'Never timeout' },
]

// ══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════════════════════

const calculatePasswordStrength = (password: string) => {
  const passed = PASSWORD_REQUIREMENTS.filter((req) =>
    req.check(password),
  ).length
  if (passed === 0) return { strength: 0, label: 'Very Weak', color: 'red' }
  if (passed <= 2) return { strength: 25, label: 'Weak', color: 'red' }
  if (passed === 3) return { strength: 50, label: 'Medium', color: 'yellow' }
  if (passed === 4) return { strength: 75, label: 'Good', color: 'blue' }
  return { strength: 100, label: 'Strong', color: 'green' }
}

const strengthBarClass = (color: string) => {
  const map: Record<string, string> = {
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
  }
  return map[color] ?? 'bg-gray-300'
}

const strengthLabelClass = (color: string) => {
  const map: Record<string, string> = {
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    blue: 'text-blue-600',
    green: 'text-green-600',
  }
  return map[color] ?? 'text-gray-500'
}

// ══════════════════════════════════════════════════════════════════════════════
// TOGGLE (inline — no external dependency)
// ══════════════════════════════════════════════════════════════════════════════

const Toggle: React.FC<{
  checked: boolean
  onChange: (v: boolean) => void
  colorClass?: string
}> = ({ checked, onChange, colorClass = 'peer-checked:bg-blue-600' }) => (
  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
    <input
      type="checkbox"
      className="sr-only peer"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
    <div
      className={`w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer
        peer-checked:after:translate-x-full peer-checked:after:border-white
        after:content-[''] after:absolute after:top-[2px] after:left-[2px]
        after:bg-white after:border-gray-300 after:border after:rounded-full
        after:h-4 after:w-4 after:transition-all ${colorClass}`}
    />
  </label>
)

// ══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════

export function MyPasswordSecurity() {
  // ── Password Change ────────────────────────────────────────────────────────
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // ── 2FA ────────────────────────────────────────────────────────────────────
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  const [twoFactorMethod, setTwoFactorMethod] = useState<
    'sms' | 'email' | 'app'
  >('sms')
  const [backupCodes, setBackupCodes] =
    useState<TwoFactorBackupCode[]>(INITIAL_BACKUP_CODES)

  // ── Security Questions ─────────────────────────────────────────────────────
  const [securityQuestion1, setSecurityQuestion1] = useState({
    question: 'pet',
    answer: '',
  })
  const [securityQuestion2, setSecurityQuestion2] = useState({
    question: 'city',
    answer: '',
  })

  // ── Security Preferences ───────────────────────────────────────────────────
  const [loginAlerts, setLoginAlerts] = useState(true)
  const [suspiciousActivityAlerts, setSuspiciousActivityAlerts] = useState(true)
  const [passwordExpiryDays, setPasswordExpiryDays] = useState('90')
  const [sessionTimeout, setSessionTimeout] = useState('30')

  // ── Modals ─────────────────────────────────────────────────────────────────
  const [isBackupCodesModalOpen, setIsBackupCodesModalOpen] = useState(false)
  const [is2FASetupModalOpen, setIs2FASetupModalOpen] = useState(false)

  // ── Derived ────────────────────────────────────────────────────────────────
  const passwordStrength = calculatePasswordStrength(newPassword)
  const passwordsMatch =
    newPassword === confirmPassword && confirmPassword.length > 0
  const allRequirementsMet = PASSWORD_REQUIREMENTS.every((req) =>
    req.check(newPassword),
  )

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleChangePassword = () => {
    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword ||
      !passwordsMatch ||
      !allRequirementsMet
    )
      return
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const handleToggle2FA = () => {
    if (twoFactorEnabled) {
      const ok = window.confirm(
        'Are you sure you want to disable Two-Factor Authentication? This will make your account less secure.',
      )
      if (!ok) return
    }
    setTwoFactorEnabled((prev) => !prev)
  }

  const handleGenerateBackupCodes = () => {
    const codes: TwoFactorBackupCode[] = Array.from({ length: 8 }, (_, i) => ({
      id: `bc${Date.now()}_${i}`,
      code: `${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      used: false,
      usedAt: '',
    }))
    setBackupCodes(codes)
  }

  const handleDownloadBackupCodes = () => {
    const content = backupCodes.map((bc) => bc.code).join('\n')
    const blob = new Blob(
      [`Backup Codes — Generated ${new Date().toISOString()}\n\n${content}`],
      { type: 'text/plain' },
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'backup_codes.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopyBackupCode = (code: string) => {
    navigator.clipboard.writeText(code)
  }

  // ── Stats ──────────────────────────────────────────────────────────────────
  const unusedCodes = backupCodes.filter((c) => !c.used).length
  const passwordExpiry =
    parseInt(passwordExpiryDays) > 0
      ? `${parseInt(passwordExpiryDays) - 45} days`
      : 'Never'

  return (
    <div className="space-y-6 p-6">

      {/* ── Page Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Password & Security
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your login credentials, two-factor authentication, and security
          preferences
        </p>
      </div>

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: '2FA Status',
            value: twoFactorEnabled ? 'Enabled' : 'Disabled',
            icon: Shield,
            valueColor: twoFactorEnabled ? 'text-green-600' : 'text-red-600',
          },
          {
            label: 'Backup Codes',
            value: `${unusedCodes} unused`,
            icon: Key,
            valueColor: unusedCodes > 0 ? 'text-gray-900' : 'text-red-600',
          },
          {
            label: 'Last Password Change',
            value: '45 days ago',
            icon: Clock,
            valueColor: 'text-gray-900',
          },
          {
            label: 'Password Expires',
            value: passwordExpiry,
            icon: RefreshCw,
            valueColor: 'text-gray-900',
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <div className="p-3 flex items-center gap-3">
              <stat.icon className="w-6 h-6 text-gray-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className={`text-lg font-bold ${stat.valueColor}`}>
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ── Top Row: Change Password + 2FA + Security Questions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Change Password */}
        <Card title="Change Password">
          <div className="space-y-4">
            {/* Current Password */}
            <div className="relative">
              <Input
                label="Current Password"
                type={showCurrentPassword ? 'text' : 'password'}
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <button
                onClick={() => setShowCurrentPassword((p) => !p)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                type="button"
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* New Password */}
            <div className="relative">
              <Input
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                onClick={() => setShowNewPassword((p) => !p)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                type="button"
              >
                {showNewPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Input
                label="Confirm New Password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                onClick={() => setShowConfirmPassword((p) => !p)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                type="button"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Strength Meter */}
            {newPassword && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Password Strength</span>
                  <span
                    className={`font-semibold ${strengthLabelClass(passwordStrength.color)}`}
                  >
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${strengthBarClass(passwordStrength.color)}`}
                    style={{ width: `${passwordStrength.strength}%` }}
                  />
                </div>
              </div>
            )}

            {/* Requirements Checklist */}
            {newPassword && (
              <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                <p className="text-xs font-semibold text-gray-700 mb-1">
                  Password Requirements
                </p>
                {PASSWORD_REQUIREMENTS.map((req) => {
                  const met = req.check(newPassword)
                  return (
                    <div key={req.id} className="flex items-center gap-2">
                      {met ? (
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                      )}
                      <span
                        className={`text-xs ${met ? 'text-green-700' : 'text-gray-500'}`}
                      >
                        {req.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Mismatch Warning */}
            {confirmPassword && !passwordsMatch && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <XCircle className="w-4 h-4 flex-shrink-0" />
                <span>Passwords do not match</span>
              </div>
            )}

            <Button
              variant="primary"
              className="w-full mt-2"
              onClick={handleChangePassword}
              disabled={
                !currentPassword ||
                !newPassword ||
                !confirmPassword ||
                !passwordsMatch ||
                !allRequirementsMet
              }
            >
              <Lock className="w-4 h-4 mr-2" />
              Update Password
            </Button>
          </div>
        </Card>

        {/* Right column: 2FA + Security Questions */}
        <div className="space-y-6">

          {/* Two-Factor Authentication */}
          <Card title="Two-Factor Authentication (2FA)">
            <div className="space-y-4">
              {/* 2FA Status Banner */}
              <div
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  twoFactorEnabled
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Shield
                    className={`w-5 h-5 flex-shrink-0 ${twoFactorEnabled ? 'text-green-600' : 'text-red-600'}`}
                  />
                  <div>
                    <p
                      className={`font-bold text-sm ${twoFactorEnabled ? 'text-green-900' : 'text-red-900'}`}
                    >
                      2FA is {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </p>
                    <p
                      className={`text-xs ${twoFactorEnabled ? 'text-green-700' : 'text-red-700'}`}
                    >
                      {twoFactorEnabled
                        ? 'Extra layer of security is active'
                        : 'Your account is less secure'}
                    </p>
                  </div>
                </div>
                <Toggle
                  checked={twoFactorEnabled}
                  onChange={handleToggle2FA}
                  colorClass="peer-checked:bg-green-600"
                />
              </div>

              {/* Method Picker */}
              {twoFactorEnabled && (
                <>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Verification Method
                    </p>
                    <div className="flex gap-2">
                      {[
                        { id: 'sms', label: 'SMS OTP', icon: Smartphone },
                        { id: 'email', label: 'Email OTP', icon: Mail },
                        { id: 'app', label: 'Auth App', icon: QrCode },
                      ].map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() =>
                            setTwoFactorMethod(method.id as typeof twoFactorMethod)
                          }
                          className={`flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg text-xs font-semibold transition-all border-2 ${
                            twoFactorMethod === method.id
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                          }`}
                        >
                          <method.icon className="w-4 h-4" />
                          {method.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIsBackupCodesModalOpen(true)}
                    >
                      <Key className="w-4 h-4 mr-2" />
                      Backup Codes
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIs2FASetupModalOpen(true)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                </>
              )}

              {!twoFactorEnabled && (
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => setIs2FASetupModalOpen(true)}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Enable Two-Factor Authentication
                </Button>
              )}
            </div>
          </Card>

          {/* Security Questions */}
          <Card title="Security Questions">
            <div className="space-y-4">
              {/* Question 1 */}
              <div>
                <Select
                  label="Security Question 1"
                  options={SECURITY_QUESTIONS}
                  value={securityQuestion1.question}
                  onChange={(v) =>
                    setSecurityQuestion1((prev) => ({
                      ...prev,
                      question: typeof v === 'string' ? v : (v as React.ChangeEvent<HTMLSelectElement>).target.value,
                    }))
                  }
                />
                <Input
                  type="password"
                  placeholder="Your answer"
                  className="mt-2"
                  value={securityQuestion1.answer}
                  onChange={(e) =>
                    setSecurityQuestion1((prev) => ({
                      ...prev,
                      answer: e.target.value,
                    }))
                  }
                />
              </div>

              {/* Question 2 */}
              <div>
                <Select
                  label="Security Question 2"
                  options={SECURITY_QUESTIONS.filter(
                    (q) => q.value !== securityQuestion1.question,
                  )}
                  value={securityQuestion2.question}
                  onChange={(v) =>
                    setSecurityQuestion2((prev) => ({
                      ...prev,
                      question: typeof v === 'string' ? v : (v as React.ChangeEvent<HTMLSelectElement>).target.value,
                    }))
                  }
                />
                <Input
                  type="password"
                  placeholder="Your answer"
                  className="mt-2"
                  value={securityQuestion2.answer}
                  onChange={(e) =>
                    setSecurityQuestion2((prev) => ({
                      ...prev,
                      answer: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSecurityQuestion1({ question: 'pet', answer: '' })
                    setSecurityQuestion2({ question: 'city', answer: '' })
                  }}
                >
                  Reset
                </Button>
                <Button variant="primary" size="sm">
                  Update Answers
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ── Security Preferences ── */}
      <Card title="Security Preferences">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Left: Dropdowns */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password Expiry
              </label>
              <Select
                options={PASSWORD_EXPIRY_OPTIONS}
                value={passwordExpiryDays}
                onChange={setPasswordExpiryDays}
              />
              <p className="text-xs text-gray-500 mt-1">
                You will be prompted to change your password after this period
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Session Timeout
              </label>
              <Select
                options={SESSION_TIMEOUT_OPTIONS}
                value={sessionTimeout}
                onChange={setSessionTimeout}
              />
              <p className="text-xs text-gray-500 mt-1">
                Auto logout after inactivity
              </p>
            </div>
          </div>

          {/* Right: Toggles */}
          <div className="space-y-4">
            {[
              {
                label: 'Login Alerts',
                desc: 'Get notified on each new login to your account',
                value: loginAlerts,
                setter: setLoginAlerts,
              },
              {
                label: 'Suspicious Activity Alerts',
                desc: 'Alert on repeated failed login attempts or unusual access',
                value: suspiciousActivityAlerts,
                setter: setSuspiciousActivityAlerts,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800">
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
                <Toggle checked={item.value} onChange={item.setter} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
          <Button variant="primary">Save Preferences</Button>
        </div>
      </Card>

      {/* Backup Codes Modal */}
      <Modal
        isOpen={isBackupCodesModalOpen}
        onClose={() => setIsBackupCodesModalOpen(false)}
        title="Backup Recovery Codes"
      >
        <div className="space-y-4">
          <div className="bg-amber-50 p-4 rounded-lg flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-semibold mb-1">Keep these codes safe</p>
              <p className="leading-relaxed">
                Use these codes to access your account if you lose your 2FA
                device. Each code can only be used once. Store them somewhere
                secure.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {backupCodes.map((bc) => (
              <div
                key={bc.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  bc.used
                    ? 'bg-gray-100 text-gray-400'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <span className="font-mono text-sm">{bc.code}</span>
                {bc.used ? (
                  <Badge variant="default">Used</Badge>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleCopyBackupCode(bc.code)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Copy code"
                  >
                    <Copy className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500 text-center">
            {backupCodes.filter((c) => !c.used).length} of {backupCodes.length}{' '}
            codes remaining
          </p>

          <div className="flex gap-2 pt-1">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleDownloadBackupCodes}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleGenerateBackupCodes}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
          </div>
        </div>
      </Modal>

      {/* 2FA Setup Modal */}
      <Modal
        isOpen={is2FASetupModalOpen}
        onClose={() => setIs2FASetupModalOpen(false)}
        title="Setup Two-Factor Authentication"
      >
        <div className="space-y-5">
          <div className="text-center">
            <div className="w-48 h-48 mx-auto bg-gray-100 rounded-xl flex items-center justify-center mb-4 border-2 border-dashed border-gray-300">
              <QrCode className="w-24 h-24 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 font-medium">
              Scan this QR code with your authenticator app
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Or enter this code manually:{' '}
              <span className="font-mono font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                ABCD EFGH IJKL MNOP
              </span>
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-800">
            <p className="font-semibold mb-1">Supported Apps</p>
            <p className="text-xs leading-relaxed">
              Google Authenticator, Microsoft Authenticator, Authy, 1Password,
              or any TOTP-compatible app.
            </p>
          </div>

          <Input
            label="Verification Code"
            placeholder="Enter 6-digit code from your app"
          />

          <Button variant="primary" className="w-full">
            <Shield className="w-4 h-4 mr-2" />
            Verify & Enable 2FA
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default MyPasswordSecurity
