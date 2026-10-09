import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Toggle } from '../../../components/ui/Toggle';
import { Save, RefreshCw, ShieldAlert, Key, Lock, UserX, Wand2, Copy, Eye, EyeOff } from 'lucide-react';

const Section = ({ title, icon: Icon, children, iconColor = 'text-gray-400' }: {title: string;icon: React.ElementType;children: React.ReactNode;iconColor?: string;}) =>
<Card title={title} headerAction={<Icon className={`w-5 h-5 ${iconColor}`} />}><div className="space-y-3">{children}</div></Card>;

const Grid2 = ({ children }: {children: React.ReactNode;}) => <div className="grid grid-cols-2 gap-3">{children}</div>;

export function SecurityAdmin() {
  const [generatedUsername, setGeneratedUsername] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [usernameRules, setUsernameRules] = useState({ format: 'first_last', separator: '.', case: 'lower', maxLength: 20, autoNumber: true, prefix: '', suffix: '' });
  const [passwordRules, setPasswordRules] = useState({ minLength: 12, maxLength: 16, upper: true, lower: true, numbers: true, special: true, excludeSimilar: true, pronounceable: false });
  const [userRemoval, setUserRemoval] = useState({ softDelete: true, gracePeriod: 30, archiveData: true, notifyUser: true, autoDeactivateDays: 90 });

  const generateUsername = () => {
    const formats: Record<string, string> = { first_last: 'john.doe', first_initial_last: 'j.doe', email_prefix: 'johndoe', employee_id: 'EMP001', custom: `${usernameRules.prefix}user${usernameRules.suffix}` };
    let username = formats[usernameRules.format] || 'user';
    username = usernameRules.case === 'upper' ? username.toUpperCase() : usernameRules.case === 'lower' ? username.toLowerCase() : username;
    if (usernameRules.autoNumber) username += Math.floor(Math.random() * 999);
    setGeneratedUsername(username.slice(0, usernameRules.maxLength));
  };

  const generatePassword = () => {
    const chars = { upper: 'ABCDEFGHJKLMNPQRSTUVWXYZ', lower: 'abcdefghjkmnpqrstuvwxyz', numbers: '23456789', special: '!@#$%^&*' };
    const similarChars = 'O0Il1';
    let pool = '';
    if (passwordRules.upper) pool += passwordRules.excludeSimilar ? chars.upper.replace(/[O]/g, '') : chars.upper;
    if (passwordRules.lower) pool += passwordRules.excludeSimilar ? chars.lower.replace(/[l]/g, '') : chars.lower;
    if (passwordRules.numbers) pool += passwordRules.excludeSimilar ? chars.numbers : '0123456789';
    if (passwordRules.special) pool += chars.special;
    const length = Math.floor(Math.random() * (passwordRules.maxLength - passwordRules.minLength + 1)) + passwordRules.minLength;
    setGeneratedPassword(Array.from({ length }, () => pool[Math.floor(Math.random() * pool.length)]).join(''));
  };

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Global Security Policies</h1>
          <p className="text-sm text-gray-500">System-wide security, compliance & access controls</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><RefreshCw className="w-4 h-4 mr-2" />Restore Defaults</Button>
          <Button variant="primary"><Save className="w-4 h-4 mr-2" />Save Policies</Button>
        </div>
      </div>

      {/* Alert */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-600" />
        <span className="text-sm font-medium text-amber-800">Policy changes affect all users immediately</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Password Policy */}
        <Section title="Password Policy" icon={Key}>
          <Grid2>
            <Input label="Min Length" type="number" defaultValue="8" />
            <Input label="Expiry (Days)" type="number" defaultValue="90" helperText="0 = no expiry" />
          </Grid2>
          <Select label="Complexity" options={[{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High (Alpha+Num+Special)' }]} value="high" />
          <Grid2>
            <Toggle label="Uppercase" defaultChecked />
            <Toggle label="Lowercase" defaultChecked />
            <Toggle label="Numbers" defaultChecked />
            <Toggle label="Special Chars" defaultChecked />
          </Grid2>
          <Input label="Password History" type="number" defaultValue="3" helperText="Prevent reuse" />
        </Section>

        {/* Login Policy */}
        <Section title="Login Policy" icon={Lock}>
          <Grid2>
            <Input label="Max Failed Attempts" type="number" defaultValue="5" />
            <Input label="Lockout (Mins)" type="number" defaultValue="30" />
          </Grid2>
          <Input label="Session Timeout (Mins)" type="number" defaultValue="60" />
          <Select label="Concurrent Sessions" options={[{ value: 'allow', label: 'Allow Multiple' }, { value: 'deny', label: 'Single Only' }, { value: 'warn', label: 'Warn User' }]} value="deny" />
          <Toggle label="Force Logout on Browser Close" defaultChecked />
        </Section>
        {/* Username Generator */}
        <Section title="Username Generator" icon={Wand2}>
          <Select label="Format" options={[{ value: 'first_last', label: 'firstname.lastname' }, { value: 'first_initial_last', label: 'f.lastname' }, { value: 'email_prefix', label: 'Email Prefix' }, { value: 'employee_id', label: 'Employee ID' }, { value: 'custom', label: 'Custom Pattern' }]} value={usernameRules.format} onChange={(v) => setUsernameRules((p) => ({ ...p, format: v }))} />
          <Grid2>
            <Select label="Separator" options={[{ value: '.', label: 'Dot (.)' }, { value: '_', label: 'Underscore (_)' }, { value: '', label: 'None' }]} value={usernameRules.separator} onChange={(v) => setUsernameRules((p) => ({ ...p, separator: v }))} />
            <Select label="Case" options={[{ value: 'lower', label: 'lowercase' }, { value: 'upper', label: 'UPPERCASE' }, { value: 'mixed', label: 'Mixed' }]} value={usernameRules.case} onChange={(v) => setUsernameRules((p) => ({ ...p, case: v }))} />
          </Grid2>
          <Grid2>
            <Input label="Max Length" type="number" value={usernameRules.maxLength} onChange={(e) => setUsernameRules((p) => ({ ...p, maxLength: +e.target.value }))} />
            <Toggle label="Auto Number" checked={usernameRules.autoNumber} onChange={() => setUsernameRules((p) => ({ ...p, autoNumber: !p.autoNumber }))} />
          </Grid2>
          <Grid2>
            <Input label="Prefix" placeholder="e.g. usr_" value={usernameRules.prefix} onChange={(e) => setUsernameRules((p) => ({ ...p, prefix: e.target.value }))} />
            <Input label="Suffix" placeholder="e.g. _edu" value={usernameRules.suffix} onChange={(e) => setUsernameRules((p) => ({ ...p, suffix: e.target.value }))} />
          </Grid2>
          <div className="flex gap-2">
            <Input label="Preview" value={generatedUsername} readOnly className="flex-1" />
            <Button variant="outline" onClick={generateUsername} className="mt-6"><Wand2 className="w-4 h-4" /></Button>
            <Button variant="outline" onClick={() => copyToClipboard(generatedUsername)} className="mt-6"><Copy className="w-4 h-4" /></Button>
          </div>
        </Section>

        {/* Password Generator */}
        <Section title="Password Generator" icon={Key}>
          <Grid2>
            <Input label="Min Length" type="number" value={passwordRules.minLength} onChange={(e) => setPasswordRules((p) => ({ ...p, minLength: +e.target.value }))} />
            <Input label="Max Length" type="number" value={passwordRules.maxLength} onChange={(e) => setPasswordRules((p) => ({ ...p, maxLength: +e.target.value }))} />
          </Grid2>
          <Grid2>
            <Toggle label="Uppercase" checked={passwordRules.upper} onChange={() => setPasswordRules((p) => ({ ...p, upper: !p.upper }))} />
            <Toggle label="Lowercase" checked={passwordRules.lower} onChange={() => setPasswordRules((p) => ({ ...p, lower: !p.lower }))} />
            <Toggle label="Numbers" checked={passwordRules.numbers} onChange={() => setPasswordRules((p) => ({ ...p, numbers: !p.numbers }))} />
            <Toggle label="Special (!@#$)" checked={passwordRules.special} onChange={() => setPasswordRules((p) => ({ ...p, special: !p.special }))} />
          </Grid2>
          <Toggle label="Exclude Similar (0,O,l,1)" checked={passwordRules.excludeSimilar} onChange={() => setPasswordRules((p) => ({ ...p, excludeSimilar: !p.excludeSimilar }))} />
          <Toggle label="Pronounceable" checked={passwordRules.pronounceable} onChange={() => setPasswordRules((p) => ({ ...p, pronounceable: !p.pronounceable }))} />
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input label="Preview" type={showPassword ? 'text' : 'password'} value={generatedPassword} readOnly />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-8 text-gray-400">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
            </div>
            <Button variant="outline" onClick={generatePassword} className="mt-6"><Wand2 className="w-4 h-4" /></Button>
            <Button variant="outline" onClick={() => copyToClipboard(generatedPassword)} className="mt-6"><Copy className="w-4 h-4" /></Button>
          </div>
        </Section>

        {/* User Removal Settings */}
        <Section title="User Removal Settings" icon={UserX} iconColor="text-red-400">
          <Toggle label="Soft Delete (Recoverable)" checked={userRemoval.softDelete} onChange={() => setUserRemoval((p) => ({ ...p, softDelete: !p.softDelete }))} />
          <Input label="Grace Period (Days)" type="number" value={userRemoval.gracePeriod} onChange={(e) => setUserRemoval((p) => ({ ...p, gracePeriod: +e.target.value }))} helperText="Days before permanent deletion" />
          <Toggle label="Archive User Data" checked={userRemoval.archiveData} onChange={() => setUserRemoval((p) => ({ ...p, archiveData: !p.archiveData }))} />
          <Toggle label="Notify User Before Deletion" checked={userRemoval.notifyUser} onChange={() => setUserRemoval((p) => ({ ...p, notifyUser: !p.notifyUser }))} />
          <Input label="Auto-Deactivate After (Days)" type="number" value={userRemoval.autoDeactivateDays} onChange={(e) => setUserRemoval((p) => ({ ...p, autoDeactivateDays: +e.target.value }))} helperText="0 = disabled" />
          <Select label="On Deletion" options={[{ value: 'anonymize', label: 'Anonymize Data' }, { value: 'archive', label: 'Archive & Remove' }, { value: 'delete', label: 'Permanently Delete' }]} value="archive" />
          <Button variant="danger" className="w-full">Bulk Deactivate Inactive Users</Button>
        </Section>
      </div>
    </div>);

}

export default SecurityAdmin;