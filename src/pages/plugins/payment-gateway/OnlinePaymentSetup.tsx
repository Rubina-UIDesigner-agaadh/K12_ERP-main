import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Textarea } from '../../../components/ui/Textarea';
import { Modal } from '../../../components/ui/Modal';
import {
  Settings,
  CreditCard,
  IndianRupee,
  Percent,
  Receipt,
  Clock,
  Mail,
  Shield,
  Globe,
  Bell,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  HelpCircle,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Building,
  Users,
  Smartphone,
  FileText,
  MessageSquare,
  Zap,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  AlertCircle,
  Loader2,
  Check,
  X,
  Calculator,
  Timer,
  Send,
  Link,
  Key,
  Server,
  Webhook,
  TestTube } from
'lucide-react';

type FeeBearer = 'school' | 'parent' | 'split';
type FeeType = 'percentage' | 'flat' | 'hybrid';
type TaxType = 'inclusive' | 'exclusive' | 'none';

interface GatewayConfig {
  id: string;
  name: string;
  isEnabled: boolean;
  isDefault: boolean;
  merchantId: string;
  apiKey: string;
  secretKey: string;
  webhookUrl: string;
  testMode: boolean;
  mdrRate: number;
  supportedMethods: string[];
}

interface ConvenienceFeeConfig {
  isEnabled: boolean;
  bearer: FeeBearer;
  feeType: FeeType;
  percentageRate: number;
  flatRate: number;
  minFee: number;
  maxFee: number;
  splitRatio: {
    school: number;
    parent: number;
  };
  applyOn: 'gross' | 'net';
  exemptFeeHeads: string[];
}

interface TaxConfig {
  isEnabled: boolean;
  taxType: TaxType;
  gstRate: number;
  hsnCode: string;
  taxOnConvenienceFee: boolean;
  showTaxBreakdown: boolean;
  gstinNumber: string;
}

interface ReceiptConfig {
  autoGenerate: boolean;
  autoEmail: boolean;
  autoSms: boolean;
  emailTemplate: string;
  smsTemplate: string;
  includeTaxInvoice: boolean;
  receiptPrefix: string;
  receiptNumberFormat: string;
  logoInReceipt: boolean;
  digitalSignature: boolean;
  ccEmails: string[];
}

interface SessionConfig {
  timeout: number;
  showCountdown: boolean;
  warningBeforeTimeout: number;
  autoExtend: boolean;
  maxExtensions: number;
  redirectOnTimeout: string;
}

interface SecurityConfig {
  requireOtp: boolean;
  maxAttempts: number;
  lockoutDuration: number;
  ipWhitelist: string[];
  enableCaptcha: boolean;
  enable3DS: boolean;
  fraudDetection: boolean;
}

interface NotificationConfig {
  notifyOnSuccess: boolean;
  notifyOnFailure: boolean;
  notifyOnRefund: boolean;
  adminEmails: string[];
  slackWebhook: string;
  dailyDigest: boolean;
  digestTime: string;
}

export function OnlinePaymentSetup() {
  // State for all configurations
  const [convenienceFee, setConvenienceFee] = useState<ConvenienceFeeConfig>({
    isEnabled: true,
    bearer: 'parent',
    feeType: 'percentage',
    percentageRate: 2.0,
    flatRate: 0,
    minFee: 10,
    maxFee: 500,
    splitRatio: { school: 50, parent: 50 },
    applyOn: 'gross',
    exemptFeeHeads: []
  });

  const [taxConfig, setTaxConfig] = useState<TaxConfig>({
    isEnabled: true,
    taxType: 'exclusive',
    gstRate: 18,
    hsnCode: '997159',
    taxOnConvenienceFee: true,
    showTaxBreakdown: true,
    gstinNumber: '27AABCU9603R1ZM'
  });

  const [receiptConfig, setReceiptConfig] = useState<ReceiptConfig>({
    autoGenerate: true,
    autoEmail: true,
    autoSms: true,
    emailTemplate: 'default',
    smsTemplate: 'default',
    includeTaxInvoice: true,
    receiptPrefix: 'RCP',
    receiptNumberFormat: 'PREFIX-YYYY-NNNNNN',
    logoInReceipt: true,
    digitalSignature: false,
    ccEmails: []
  });

  const [sessionConfig, setSessionConfig] = useState<SessionConfig>({
    timeout: 15,
    showCountdown: true,
    warningBeforeTimeout: 2,
    autoExtend: false,
    maxExtensions: 2,
    redirectOnTimeout: '/payment/timeout'
  });

  const [securityConfig, setSecurityConfig] = useState<SecurityConfig>({
    requireOtp: false,
    maxAttempts: 3,
    lockoutDuration: 30,
    ipWhitelist: [],
    enableCaptcha: true,
    enable3DS: true,
    fraudDetection: true
  });

  const [notificationConfig, setNotificationConfig] = useState<NotificationConfig>({
    notifyOnSuccess: true,
    notifyOnFailure: true,
    notifyOnRefund: true,
    adminEmails: ['finance@school.edu.in'],
    slackWebhook: '',
    dailyDigest: true,
    digestTime: '09:00'
  });

  const [gateways, setGateways] = useState<GatewayConfig[]>([
  {
    id: 'razorpay',
    name: 'Razorpay',
    isEnabled: true,
    isDefault: true,
    merchantId: 'rzp_live_xxxxxxxxxxxx',
    apiKey: 'rzp_live_xxxxxxxxxxxx',
    secretKey: '••••••••••••••••••••',
    webhookUrl: 'https://school.edu.in/api/webhooks/razorpay',
    testMode: false,
    mdrRate: 2.0,
    supportedMethods: ['upi', 'cards', 'netbanking', 'wallets']
  },
  {
    id: 'payu',
    name: 'PayU',
    isEnabled: true,
    isDefault: false,
    merchantId: 'payu_merchant_xxxx',
    apiKey: 'payu_api_xxxxxxxxxxxx',
    secretKey: '••••••••••••••••••••',
    webhookUrl: 'https://school.edu.in/api/webhooks/payu',
    testMode: false,
    mdrRate: 1.8,
    supportedMethods: ['upi', 'cards', 'netbanking']
  },
  {
    id: 'paytm',
    name: 'Paytm Payment Gateway',
    isEnabled: false,
    isDefault: false,
    merchantId: '',
    apiKey: '',
    secretKey: '',
    webhookUrl: 'https://school.edu.in/api/webhooks/paytm',
    testMode: true,
    mdrRate: 1.75,
    supportedMethods: ['upi', 'cards', 'paytm_wallet']
  }]
  );

  const [activeSection, setActiveSection] = useState<string | null>('convenience-fee');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  const [showTestModal, setShowTestModal] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [selectedGateway, setSelectedGateway] = useState<string | null>(null);
  const [newCcEmail, setNewCcEmail] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newExemptFeeHead, setNewExemptFeeHead] = useState('');
  const [calculatorAmount, setCalculatorAmount] = useState(10000);

  // Fee head options
  const feeHeadOptions = [
  { value: 'tuition', label: 'Tuition Fee' },
  { value: 'transport', label: 'Transport Fee' },
  { value: 'hostel', label: 'Hostel Fee' },
  { value: 'examination', label: 'Examination Fee' },
  { value: 'library', label: 'Library Fee' },
  { value: 'laboratory', label: 'Laboratory Fee' }];


  // Email template options
  const emailTemplateOptions = [
  { value: 'default', label: 'Default Template' },
  { value: 'detailed', label: 'Detailed with Breakdown' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'custom', label: 'Custom Template' }];


  // SMS template options
  const smsTemplateOptions = [
  { value: 'default', label: 'Default Template' },
  { value: 'short', label: 'Short Message' },
  { value: 'detailed', label: 'Detailed Message' }];


  // Receipt format options
  const receiptFormatOptions = [
  { value: 'PREFIX-YYYY-NNNNNN', label: 'PREFIX-YYYY-NNNNNN (e.g., RCP-2024-000001)' },
  { value: 'PREFIX/YYYY/NNNNNN', label: 'PREFIX/YYYY/NNNNNN (e.g., RCP/2024/000001)' },
  { value: 'YYYY-PREFIX-NNNNNN', label: 'YYYY-PREFIX-NNNNNN (e.g., 2024-RCP-000001)' },
  { value: 'NNNNNN', label: 'Sequential Only (e.g., 000001)' }];


  // Calculate convenience fee preview
  const calculateFee = (amount: number): {fee: number;tax: number;total: number;} => {
    if (!convenienceFee.isEnabled) {
      return { fee: 0, tax: 0, total: amount };
    }

    let fee = 0;
    if (convenienceFee.feeType === 'percentage') {
      fee = amount * convenienceFee.percentageRate / 100;
    } else if (convenienceFee.feeType === 'flat') {
      fee = convenienceFee.flatRate;
    } else {
      fee = Math.max(
        amount * convenienceFee.percentageRate / 100,
        convenienceFee.flatRate
      );
    }

    // Apply min/max
    fee = Math.max(convenienceFee.minFee, Math.min(convenienceFee.maxFee, fee));

    // Calculate tax
    let tax = 0;
    if (taxConfig.isEnabled && taxConfig.taxOnConvenienceFee) {
      tax = fee * taxConfig.gstRate / 100;
    }

    // Apply bearer logic
    if (convenienceFee.bearer === 'school') {
      return { fee: 0, tax: 0, total: amount };
    } else if (convenienceFee.bearer === 'split') {
      const parentShare = (fee + tax) * convenienceFee.splitRatio.parent / 100;
      return { fee: fee * convenienceFee.splitRatio.parent / 100, tax: tax * convenienceFee.splitRatio.parent / 100, total: amount + parentShare };
    }

    return { fee, tax, total: amount + fee + tax };
  };

  // Toggle section
  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  // Handle save
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setHasChanges(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  // Handle test gateway
  const handleTestGateway = (gatewayId: string) => {
    setSelectedGateway(gatewayId);
    setShowTestModal(true);
    setTestResult(null);

    setTimeout(() => {
      setTestResult(Math.random() > 0.2 ? 'success' : 'error');
    }, 2000);
  };

  // Toggle gateway
  const toggleGateway = (gatewayId: string) => {
    setGateways((prev) =>
    prev.map((g) =>
    g.id === gatewayId ? { ...g, isEnabled: !g.isEnabled } : g
    )
    );
    setHasChanges(true);
  };

  // Set default gateway
  const setDefaultGateway = (gatewayId: string) => {
    setGateways((prev) =>
    prev.map((g) => ({ ...g, isDefault: g.id === gatewayId }))
    );
    setHasChanges(true);
  };

  // Toggle show API key
  const toggleShowApiKey = (gatewayId: string) => {
    setShowApiKey((prev) => ({ ...prev, [gatewayId]: !prev[gatewayId] }));
  };

  // Add CC email
  const addCcEmail = () => {
    if (newCcEmail && !receiptConfig.ccEmails.includes(newCcEmail)) {
      setReceiptConfig((prev) => ({
        ...prev,
        ccEmails: [...prev.ccEmails, newCcEmail]
      }));
      setNewCcEmail('');
      setHasChanges(true);
    }
  };

  // Remove CC email
  const removeCcEmail = (email: string) => {
    setReceiptConfig((prev) => ({
      ...prev,
      ccEmails: prev.ccEmails.filter((e) => e !== email)
    }));
    setHasChanges(true);
  };

  // Add admin email
  const addAdminEmail = () => {
    if (newAdminEmail && !notificationConfig.adminEmails.includes(newAdminEmail)) {
      setNotificationConfig((prev) => ({
        ...prev,
        adminEmails: [...prev.adminEmails, newAdminEmail]
      }));
      setNewAdminEmail('');
      setHasChanges(true);
    }
  };

  // Remove admin email
  const removeAdminEmail = (email: string) => {
    setNotificationConfig((prev) => ({
      ...prev,
      adminEmails: prev.adminEmails.filter((e) => e !== email)
    }));
    setHasChanges(true);
  };

  // Toggle switch component
  const ToggleSwitch = ({
    enabled,
    onChange,
    label,
    description





  }: {enabled: boolean;onChange: (value: boolean) => void;label: string;description?: string;}) =>
  <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <button
      onClick={() => {
        onChange(!enabled);
        setHasChanges(true);
      }}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      enabled ? 'bg-blue-600' : 'bg-gray-300'}`
      }>

        <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        enabled ? 'translate-x-6' : 'translate-x-1'}`
        } />

      </button>
    </div>;


  // Section header component
  const SectionHeader = ({
    icon: Icon,
    title,
    description,
    section,
    badge






  }: {icon: React.ElementType;title: string;description: string;section: string;badge?: React.ReactNode;}) =>
  <div
    onClick={() => toggleSection(section)}
    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors">

      <div className="flex items-center gap-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            {badge}
          </div>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      {activeSection === section ?
    <ChevronUp className="w-5 h-5 text-gray-400" /> :

    <ChevronDown className="w-5 h-5 text-gray-400" />
    }
    </div>;


  const feePreview = calculateFee(calculatorAmount);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Online Payment Setup
          </h1>
          <p className="text-sm text-gray-500">
            Configure payment gateway settings, fees, and receipt generation options
          </p>
        </div>
        <div className="flex items-center gap-3">
          {hasChanges &&
          <Badge variant="warning" className="flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Unsaved Changes
            </Badge>
          }
          {saveSuccess &&
          <Badge variant="success" className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Saved Successfully
            </Badge>
          }
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isSaving || !hasChanges}>

            {isSaving ?
            <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </> :

            <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            }
          </Button>
        </div>
      </div>

      {/* Quick Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Active Gateways</p>
              <p className="text-xl font-bold text-gray-900">
                {gateways.filter((g) => g.isEnabled).length}/{gateways.length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="flex items-center gap-3">
            <Percent className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Convenience Fee</p>
              <p className="text-xl font-bold text-gray-900">
                {convenienceFee.isEnabled ?
                `${convenienceFee.percentageRate}%` :
                'Disabled'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-orange-500">
          <div className="flex items-center gap-3">
            <Building className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-sm text-gray-500">GST Rate</p>
              <p className="text-xl font-bold text-gray-900">
                {taxConfig.isEnabled ? `${taxConfig.gstRate}%` : 'Disabled'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-purple-500">
          <div className="flex items-center gap-3">
            <Timer className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-sm text-gray-500">Session Timeout</p>
              <p className="text-xl font-bold text-gray-900">
                {sessionConfig.timeout} min
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Gateway Configuration */}
      <Card className="overflow-hidden">
        <SectionHeader
          icon={CreditCard}
          title="Payment Gateway Configuration"
          description="Configure and manage payment gateway integrations"
          section="gateways"
          badge={
          <Badge variant="success">
              {gateways.filter((g) => g.isEnabled).length} Active
            </Badge>
          } />


        {activeSection === 'gateways' &&
        <div className="p-6 pt-0 space-y-6">
            {gateways.map((gateway) =>
          <div
            key={gateway.id}
            className={`border rounded-lg overflow-hidden ${
            gateway.isEnabled ? 'border-green-200' : 'border-gray-200'}`
            }>

                <div
              className={`p-4 flex items-center justify-between ${
              gateway.isEnabled ? 'bg-green-50' : 'bg-gray-50'}`
              }>

                  <div className="flex items-center gap-4">
                    <button
                  onClick={() => toggleGateway(gateway.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  gateway.isEnabled ? 'bg-green-600' : 'bg-gray-300'}`
                  }>

                      <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    gateway.isEnabled ? 'translate-x-6' : 'translate-x-1'}`
                    } />

                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">
                          {gateway.name}
                        </h4>
                        {gateway.isDefault &&
                    <Badge variant="primary">Default</Badge>
                    }
                        {gateway.testMode &&
                    <Badge variant="warning">Test Mode</Badge>
                    }
                      </div>
                      <p className="text-sm text-gray-500">
                        MDR: {gateway.mdrRate}% | Supports:{' '}
                        {gateway.supportedMethods.join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!gateway.isDefault && gateway.isEnabled &&
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDefaultGateway(gateway.id)}>

                        Set as Default
                      </Button>
                }
                    <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTestGateway(gateway.id)}
                  disabled={!gateway.isEnabled}>

                      <TestTube className="w-4 h-4 mr-1" />
                      Test
                    </Button>
                  </div>
                </div>

                {gateway.isEnabled &&
            <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Merchant ID
                        </label>
                        <Input
                    value={gateway.merchantId}
                    onChange={(e) => {
                      setGateways((prev) =>
                      prev.map((g) =>
                      g.id === gateway.id ?
                      { ...g, merchantId: e.target.value } :
                      g
                      )
                      );
                      setHasChanges(true);
                    }}
                    placeholder="Enter Merchant ID" />

                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          API Key
                        </label>
                        <div className="relative">
                          <Input
                      type={showApiKey[gateway.id] ? 'text' : 'password'}
                      value={gateway.apiKey}
                      onChange={(e) => {
                        setGateways((prev) =>
                        prev.map((g) =>
                        g.id === gateway.id ?
                        { ...g, apiKey: e.target.value } :
                        g
                        )
                        );
                        setHasChanges(true);
                      }}
                      placeholder="Enter API Key" />

                          <button
                      type="button"
                      onClick={() => toggleShowApiKey(gateway.id)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">

                            {showApiKey[gateway.id] ?
                      <EyeOff className="w-4 h-4" /> :

                      <Eye className="w-4 h-4" />
                      }
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Secret Key
                        </label>
                        <div className="relative">
                          <Input
                      type="password"
                      value={gateway.secretKey}
                      onChange={(e) => {
                        setGateways((prev) =>
                        prev.map((g) =>
                        g.id === gateway.id ?
                        { ...g, secretKey: e.target.value } :
                        g
                        )
                        );
                        setHasChanges(true);
                      }}
                      placeholder="Enter Secret Key" />

                          <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Webhook URL
                        </label>
                        <div className="flex gap-2">
                          <Input
                      value={gateway.webhookUrl}
                      readOnly
                      className="bg-gray-50" />

                          <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                      navigator.clipboard.writeText(gateway.webhookUrl)
                      }>

                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 pt-4 border-t">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                    type="checkbox"
                    checked={gateway.testMode}
                    onChange={(e) => {
                      setGateways((prev) =>
                      prev.map((g) =>
                      g.id === gateway.id ?
                      { ...g, testMode: e.target.checked } :
                      g
                      )
                      );
                      setHasChanges(true);
                    }}
                    className="w-4 h-4 rounded border-gray-300" />

                        <span className="text-sm text-gray-700">
                          Enable Test Mode
                        </span>
                      </label>
                    </div>
                  </div>
            }
              </div>
          )}
          </div>
        }
      </Card>

      {/* Convenience Fee Logic */}
      <Card className="overflow-hidden">
        <SectionHeader
          icon={Percent}
          title="Convenience Fee Logic"
          description="Define who bears the transaction fee and set rates"
          section="convenience-fee"
          badge={
          convenienceFee.isEnabled ?
          <Badge variant="success">Enabled</Badge> :

          <Badge variant="secondary">Disabled</Badge>

          } />


        {activeSection === 'convenience-fee' &&
        <div className="p-6 pt-0 space-y-6">
            <ToggleSwitch
            enabled={convenienceFee.isEnabled}
            onChange={(value) =>
            setConvenienceFee((prev) => ({ ...prev, isEnabled: value }))
            }
            label="Enable Convenience Fee"
            description="Charge additional fee for online payment processing" />


            {convenienceFee.isEnabled &&
          <>
                {/* Fee Bearer */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Who bears the fee?
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                {
                  value: 'parent',
                  label: 'Parent',
                  icon: Users,
                  description: 'Parents pay the full convenience fee'
                },
                {
                  value: 'school',
                  label: 'School',
                  icon: Building,
                  description: 'School absorbs the convenience fee'
                },
                {
                  value: 'split',
                  label: 'Split',
                  icon: Zap,
                  description: 'Fee is shared between parent and school'
                }].
                map((option) =>
                <div
                  key={option.value}
                  onClick={() => {
                    setConvenienceFee((prev) => ({
                      ...prev,
                      bearer: option.value as FeeBearer
                    }));
                    setHasChanges(true);
                  }}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  convenienceFee.bearer === option.value ?
                  'border-blue-500 bg-blue-50' :
                  'border-gray-200 hover:border-gray-300'}`
                  }>

                        <div className="flex items-center gap-3 mb-2">
                          <option.icon
                      className={`w-5 h-5 ${
                      convenienceFee.bearer === option.value ?
                      'text-blue-600' :
                      'text-gray-400'}`
                      } />

                          <span className="font-medium">{option.label}</span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {option.description}
                        </p>
                      </div>
                )}
                  </div>
                </div>

                {/* Split Ratio */}
                {convenienceFee.bearer === 'split' &&
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Split Ratio
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">School</p>
                        <div className="flex items-center gap-2">
                          <Input
                      type="number"
                      value={convenienceFee.splitRatio.school}
                      onChange={(e) => {
                        const school = parseInt(e.target.value) || 0;
                        setConvenienceFee((prev) => ({
                          ...prev,
                          splitRatio: { school, parent: 100 - school }
                        }));
                        setHasChanges(true);
                      }}
                      min={0}
                      max={100}
                      className="w-24" />

                          <span>%</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">Parent</p>
                        <div className="flex items-center gap-2">
                          <Input
                      type="number"
                      value={convenienceFee.splitRatio.parent}
                      onChange={(e) => {
                        const parent = parseInt(e.target.value) || 0;
                        setConvenienceFee((prev) => ({
                          ...prev,
                          splitRatio: { parent, school: 100 - parent }
                        }));
                        setHasChanges(true);
                      }}
                      min={0}
                      max={100}
                      className="w-24" />

                          <span>%</span>
                        </div>
                      </div>
                    </div>
                  </div>
            }

                {/* Fee Type and Rates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fee Type
                    </label>
                    <Select
                  value={convenienceFee.feeType}
                  onChange={(e) => {
                    setConvenienceFee((prev) => ({
                      ...prev,
                      feeType: e.target.value as FeeType
                    }));
                    setHasChanges(true);
                  }}
                  options={[
                  { value: 'percentage', label: 'Percentage of Amount' },
                  { value: 'flat', label: 'Flat Rate' },
                  { value: 'hybrid', label: 'Higher of Percentage or Flat' }]
                  } />

                  </div>

                  {(convenienceFee.feeType === 'percentage' ||
              convenienceFee.feeType === 'hybrid') &&
              <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Percentage Rate (%)
                      </label>
                      <Input
                  type="number"
                  step="0.01"
                  value={convenienceFee.percentageRate}
                  onChange={(e) => {
                    setConvenienceFee((prev) => ({
                      ...prev,
                      percentageRate: parseFloat(e.target.value) || 0
                    }));
                    setHasChanges(true);
                  }}
                  min={0}
                  max={10} />

                    </div>
              }

                  {(convenienceFee.feeType === 'flat' ||
              convenienceFee.feeType === 'hybrid') &&
              <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Flat Rate (₹)
                      </label>
                      <Input
                  type="number"
                  value={convenienceFee.flatRate}
                  onChange={(e) => {
                    setConvenienceFee((prev) => ({
                      ...prev,
                      flatRate: parseFloat(e.target.value) || 0
                    }));
                    setHasChanges(true);
                  }}
                  min={0} />

                    </div>
              }
                </div>

                {/* Min/Max Fee */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Fee (₹)
                    </label>
                    <Input
                  type="number"
                  value={convenienceFee.minFee}
                  onChange={(e) => {
                    setConvenienceFee((prev) => ({
                      ...prev,
                      minFee: parseFloat(e.target.value) || 0
                    }));
                    setHasChanges(true);
                  }}
                  min={0} />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Fee (₹)
                    </label>
                    <Input
                  type="number"
                  value={convenienceFee.maxFee}
                  onChange={(e) => {
                    setConvenienceFee((prev) => ({
                      ...prev,
                      maxFee: parseFloat(e.target.value) || 0
                    }));
                    setHasChanges(true);
                  }}
                  min={0} />

                  </div>
                </div>

                {/* Fee Calculator Preview */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Calculator className="w-5 h-5 text-blue-600" />
                    <h4 className="font-medium text-gray-900">Fee Calculator Preview</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Fee Amount (₹)
                      </label>
                      <Input
                    type="number"
                    value={calculatorAmount}
                    onChange={(e) =>
                    setCalculatorAmount(parseInt(e.target.value) || 0)
                    } />

                    </div>
                    <div className="bg-white rounded-lg p-3 border">
                      <p className="text-xs text-gray-500">Convenience Fee</p>
                      <p className="text-lg font-bold text-blue-600">
                        ₹{feePreview.fee.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border">
                      <p className="text-xs text-gray-500">GST on Fee</p>
                      <p className="text-lg font-bold text-orange-600">
                        ₹{feePreview.tax.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border">
                      <p className="text-xs text-gray-500">Total Payable</p>
                      <p className="text-lg font-bold text-green-600">
                        ₹{feePreview.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </>
          }
          </div>
        }
      </Card>

      {/* Tax Settings */}
      <Card className="overflow-hidden">
        <SectionHeader
          icon={Building}
          title="Tax Settings"
          description="Configure GST/VAT applicable on online fees"
          section="tax-settings"
          badge={
          taxConfig.isEnabled ?
          <Badge variant="success">{taxConfig.gstRate}% GST</Badge> :

          <Badge variant="secondary">Disabled</Badge>

          } />


        {activeSection === 'tax-settings' &&
        <div className="p-6 pt-0 space-y-6">
            <ToggleSwitch
            enabled={taxConfig.isEnabled}
            onChange={(value) =>
            setTaxConfig((prev) => ({ ...prev, isEnabled: value }))
            }
            label="Enable Tax on Online Payments"
            description="Apply GST/VAT on convenience fees" />


            {taxConfig.isEnabled &&
          <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax Type
                    </label>
                    <Select
                  value={taxConfig.taxType}
                  onChange={(e) => {
                    setTaxConfig((prev) => ({
                      ...prev,
                      taxType: e.target.value as TaxType
                    }));
                    setHasChanges(true);
                  }}
                  options={[
                  { value: 'exclusive', label: 'Exclusive (Added on top)' },
                  { value: 'inclusive', label: 'Inclusive (Included in fee)' }]
                  } />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GST Rate (%)
                    </label>
                    <Select
                  value={taxConfig.gstRate.toString()}
                  onChange={(e) => {
                    setTaxConfig((prev) => ({
                      ...prev,
                      gstRate: parseInt(e.target.value)
                    }));
                    setHasChanges(true);
                  }}
                  options={[
                  { value: '0', label: '0% (Exempt)' },
                  { value: '5', label: '5%' },
                  { value: '12', label: '12%' },
                  { value: '18', label: '18%' },
                  { value: '28', label: '28%' }]
                  } />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      HSN/SAC Code
                    </label>
                    <Input
                  value={taxConfig.hsnCode}
                  onChange={(e) => {
                    setTaxConfig((prev) => ({
                      ...prev,
                      hsnCode: e.target.value
                    }));
                    setHasChanges(true);
                  }}
                  placeholder="e.g., 997159" />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      School GSTIN
                    </label>
                    <Input
                  value={taxConfig.gstinNumber}
                  onChange={(e) => {
                    setTaxConfig((prev) => ({
                      ...prev,
                      gstinNumber: e.target.value
                    }));
                    setHasChanges(true);
                  }}
                  placeholder="e.g., 27AABCU9603R1ZM" />

                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <ToggleSwitch
                enabled={taxConfig.taxOnConvenienceFee}
                onChange={(value) =>
                setTaxConfig((prev) => ({
                  ...prev,
                  taxOnConvenienceFee: value
                }))
                }
                label="Apply Tax on Convenience Fee"
                description="Calculate GST on the convenience fee amount" />

                  <ToggleSwitch
                enabled={taxConfig.showTaxBreakdown}
                onChange={(value) =>
                setTaxConfig((prev) => ({
                  ...prev,
                  showTaxBreakdown: value
                }))
                }
                label="Show Tax Breakdown"
                description="Display CGST and SGST separately on receipts" />

                </div>
              </>
          }
          </div>
        }
      </Card>

      {/* Receipt Generation */}
      <Card className="overflow-hidden">
        <SectionHeader
          icon={Receipt}
          title="Receipt Generation"
          description="Configure automatic receipt generation and delivery"
          section="receipt-generation"
          badge={
          receiptConfig.autoEmail ?
          <Badge variant="success">Auto-Email Enabled</Badge> :

          <Badge variant="secondary">Manual</Badge>

          } />


        {activeSection === 'receipt-generation' &&
        <div className="p-6 pt-0 space-y-6">
            <div className="space-y-4">
              <ToggleSwitch
              enabled={receiptConfig.autoGenerate}
              onChange={(value) =>
              setReceiptConfig((prev) => ({ ...prev, autoGenerate: value }))
              }
              label="Auto-Generate Receipts"
              description="Automatically generate receipt upon successful payment" />

              <ToggleSwitch
              enabled={receiptConfig.autoEmail}
              onChange={(value) =>
              setReceiptConfig((prev) => ({ ...prev, autoEmail: value }))
              }
              label="Auto-Email Receipts"
              description="Send receipt to parent's registered email automatically" />

              <ToggleSwitch
              enabled={receiptConfig.autoSms}
              onChange={(value) =>
              setReceiptConfig((prev) => ({ ...prev, autoSms: value }))
              }
              label="Auto-SMS Notification"
              description="Send payment confirmation SMS to parent's mobile" />

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Receipt Prefix
                </label>
                <Input
                value={receiptConfig.receiptPrefix}
                onChange={(e) => {
                  setReceiptConfig((prev) => ({
                    ...prev,
                    receiptPrefix: e.target.value
                  }));
                  setHasChanges(true);
                }}
                placeholder="e.g., RCP" />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Receipt Number Format
                </label>
                <Select
                value={receiptConfig.receiptNumberFormat}
                onChange={(e) => {
                  setReceiptConfig((prev) => ({
                    ...prev,
                    receiptNumberFormat: e.target.value
                  }));
                  setHasChanges(true);
                }}
                options={receiptFormatOptions} />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Template
                </label>
                <Select
                value={receiptConfig.emailTemplate}
                onChange={(e) => {
                  setReceiptConfig((prev) => ({
                    ...prev,
                    emailTemplate: e.target.value
                  }));
                  setHasChanges(true);
                }}
                options={emailTemplateOptions} />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMS Template
                </label>
                <Select
                value={receiptConfig.smsTemplate}
                onChange={(e) => {
                  setReceiptConfig((prev) => ({
                    ...prev,
                    smsTemplate: e.target.value
                  }));
                  setHasChanges(true);
                }}
                options={smsTemplateOptions} />

              </div>
            </div>

            {/* CC Emails */}
            <div className="pt-4 border-t">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CC Emails (for all receipts)
              </label>
              <div className="flex gap-2 mb-3">
                <Input
                type="email"
                value={newCcEmail}
                onChange={(e) => setNewCcEmail(e.target.value)}
                placeholder="Enter email address"
                onKeyPress={(e) => e.key === 'Enter' && addCcEmail()} />

                <Button variant="outline" onClick={addCcEmail}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {receiptConfig.ccEmails.map((email) =>
              <span
                key={email}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">

                    {email}
                    <button
                  onClick={() => removeCcEmail(email)}
                  className="text-gray-400 hover:text-red-500">

                      <X className="w-3 h-3" />
                    </button>
                  </span>
              )}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <ToggleSwitch
              enabled={receiptConfig.includeTaxInvoice}
              onChange={(value) =>
              setReceiptConfig((prev) => ({
                ...prev,
                includeTaxInvoice: value
              }))
              }
              label="Include Tax Invoice"
              description="Generate GST-compliant tax invoice with receipts" />

              <ToggleSwitch
              enabled={receiptConfig.logoInReceipt}
              onChange={(value) =>
              setReceiptConfig((prev) => ({
                ...prev,
                logoInReceipt: value
              }))
              }
              label="Include School Logo"
              description="Display school logo on generated receipts" />

              <ToggleSwitch
              enabled={receiptConfig.digitalSignature}
              onChange={(value) =>
              setReceiptConfig((prev) => ({
                ...prev,
                digitalSignature: value
              }))
              }
              label="Digital Signature"
              description="Add digital signature to receipts (requires setup)" />

            </div>
          </div>
        }
      </Card>

      {/* Session Timeout */}
      <Card className="overflow-hidden">
        <SectionHeader
          icon={Clock}
          title="Session Timeout Settings"
          description="Configure payment page session and timeout behavior"
          section="session-timeout"
          badge={<Badge variant="info">{sessionConfig.timeout} min</Badge>} />


        {activeSection === 'session-timeout' &&
        <div className="p-6 pt-0 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Timeout (minutes)
                </label>
                <div className="flex items-center gap-4">
                  <input
                  type="range"
                  min={5}
                  max={60}
                  step={5}
                  value={sessionConfig.timeout}
                  onChange={(e) => {
                    setSessionConfig((prev) => ({
                      ...prev,
                      timeout: parseInt(e.target.value)
                    }));
                    setHasChanges(true);
                  }}
                  className="flex-1" />

                  <span className="text-lg font-bold text-blue-600 w-16 text-center">
                    {sessionConfig.timeout} min
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Payment page will expire after this duration of inactivity
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Warning Before Timeout (minutes)
                </label>
                <Select
                value={sessionConfig.warningBeforeTimeout.toString()}
                onChange={(e) => {
                  setSessionConfig((prev) => ({
                    ...prev,
                    warningBeforeTimeout: parseInt(e.target.value)
                  }));
                  setHasChanges(true);
                }}
                options={[
                { value: '1', label: '1 minute before' },
                { value: '2', label: '2 minutes before' },
                { value: '3', label: '3 minutes before' },
                { value: '5', label: '5 minutes before' }]
                } />

              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <ToggleSwitch
              enabled={sessionConfig.showCountdown}
              onChange={(value) =>
              setSessionConfig((prev) => ({
                ...prev,
                showCountdown: value
              }))
              }
              label="Show Countdown Timer"
              description="Display remaining time on payment page" />

              <ToggleSwitch
              enabled={sessionConfig.autoExtend}
              onChange={(value) =>
              setSessionConfig((prev) => ({
                ...prev,
                autoExtend: value
              }))
              }
              label="Allow Session Extension"
              description="Allow users to extend session when warned" />

            </div>

            {sessionConfig.autoExtend &&
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Extensions Allowed
                </label>
                <Select
              value={sessionConfig.maxExtensions.toString()}
              onChange={(e) => {
                setSessionConfig((prev) => ({
                  ...prev,
                  maxExtensions: parseInt(e.target.value)
                }));
                setHasChanges(true);
              }}
              options={[
              { value: '1', label: '1 extension' },
              { value: '2', label: '2 extensions' },
              { value: '3', label: '3 extensions' },
              { value: '5', label: '5 extensions' }]
              } />

              </div>
          }

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Redirect URL on Timeout
              </label>
              <Input
              value={sessionConfig.redirectOnTimeout}
              onChange={(e) => {
                setSessionConfig((prev) => ({
                  ...prev,
                  redirectOnTimeout: e.target.value
                }));
                setHasChanges(true);
              }}
              placeholder="/payment/timeout" />

            </div>
          </div>
        }
      </Card>

      {/* Security Settings */}
      <Card className="overflow-hidden">
        <SectionHeader
          icon={Shield}
          title="Security Settings"
          description="Configure payment security and fraud prevention"
          section="security"
          badge={
          securityConfig.enable3DS ?
          <Badge variant="success">3DS Enabled</Badge> :

          <Badge variant="warning">Basic</Badge>

          } />


        {activeSection === 'security' &&
        <div className="p-6 pt-0 space-y-6">
            <div className="space-y-4">
              <ToggleSwitch
              enabled={securityConfig.enable3DS}
              onChange={(value) =>
              setSecurityConfig((prev) => ({ ...prev, enable3DS: value }))
              }
              label="Enable 3D Secure"
              description="Require 3DS authentication for card payments" />

              <ToggleSwitch
              enabled={securityConfig.enableCaptcha}
              onChange={(value) =>
              setSecurityConfig((prev) => ({
                ...prev,
                enableCaptcha: value
              }))
              }
              label="Enable CAPTCHA"
              description="Show CAPTCHA verification before payment" />

              <ToggleSwitch
              enabled={securityConfig.requireOtp}
              onChange={(value) =>
              setSecurityConfig((prev) => ({ ...prev, requireOtp: value }))
              }
              label="Require OTP Verification"
              description="Send OTP to parent's mobile before payment" />

              <ToggleSwitch
              enabled={securityConfig.fraudDetection}
              onChange={(value) =>
              setSecurityConfig((prev) => ({
                ...prev,
                fraudDetection: value
              }))
              }
              label="Enable Fraud Detection"
              description="Use gateway's fraud detection service" />

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Payment Attempts
                </label>
                <Select
                value={securityConfig.maxAttempts.toString()}
                onChange={(e) => {
                  setSecurityConfig((prev) => ({
                    ...prev,
                    maxAttempts: parseInt(e.target.value)
                  }));
                  setHasChanges(true);
                }}
                options={[
                { value: '3', label: '3 attempts' },
                { value: '5', label: '5 attempts' },
                { value: '10', label: '10 attempts' }]
                } />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lockout Duration (minutes)
                </label>
                <Select
                value={securityConfig.lockoutDuration.toString()}
                onChange={(e) => {
                  setSecurityConfig((prev) => ({
                    ...prev,
                    lockoutDuration: parseInt(e.target.value)
                  }));
                  setHasChanges(true);
                }}
                options={[
                { value: '15', label: '15 minutes' },
                { value: '30', label: '30 minutes' },
                { value: '60', label: '1 hour' },
                { value: '1440', label: '24 hours' }]
                } />

              </div>
            </div>
          </div>
        }
      </Card>

      {/* Notification Settings */}
      <Card className="overflow-hidden">
        <SectionHeader
          icon={Bell}
          title="Notification Settings"
          description="Configure admin notifications for payment events"
          section="notifications" />


        {activeSection === 'notifications' &&
        <div className="p-6 pt-0 space-y-6">
            <div className="space-y-4">
              <ToggleSwitch
              enabled={notificationConfig.notifyOnSuccess}
              onChange={(value) =>
              setNotificationConfig((prev) => ({
                ...prev,
                notifyOnSuccess: value
              }))
              }
              label="Notify on Successful Payment"
              description="Send notification when payment succeeds" />

              <ToggleSwitch
              enabled={notificationConfig.notifyOnFailure}
              onChange={(value) =>
              setNotificationConfig((prev) => ({
                ...prev,
                notifyOnFailure: value
              }))
              }
              label="Notify on Failed Payment"
              description="Send notification when payment fails" />

              <ToggleSwitch
              enabled={notificationConfig.notifyOnRefund}
              onChange={(value) =>
              setNotificationConfig((prev) => ({
                ...prev,
                notifyOnRefund: value
              }))
              }
              label="Notify on Refund"
              description="Send notification when refund is processed" />

              <ToggleSwitch
              enabled={notificationConfig.dailyDigest}
              onChange={(value) =>
              setNotificationConfig((prev) => ({
                ...prev,
                dailyDigest: value
              }))
              }
              label="Daily Digest Email"
              description="Send daily summary of all transactions" />

            </div>

            {notificationConfig.dailyDigest &&
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Digest Time
                </label>
                <Input
              type="time"
              value={notificationConfig.digestTime}
              onChange={(e) => {
                setNotificationConfig((prev) => ({
                  ...prev,
                  digestTime: e.target.value
                }));
                setHasChanges(true);
              }}
              className="w-40" />

              </div>
          }

            {/* Admin Emails */}
            <div className="pt-4 border-t">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Notification Emails
              </label>
              <div className="flex gap-2 mb-3">
                <Input
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="Enter admin email"
                onKeyPress={(e) => e.key === 'Enter' && addAdminEmail()} />

                <Button variant="outline" onClick={addAdminEmail}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {notificationConfig.adminEmails.map((email) =>
              <span
                key={email}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">

                    {email}
                    <button
                  onClick={() => removeAdminEmail(email)}
                  className="text-gray-400 hover:text-red-500">

                      <X className="w-3 h-3" />
                    </button>
                  </span>
              )}
              </div>
            </div>

            {/* Slack Webhook */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slack Webhook URL (Optional)
              </label>
              <Input
              value={notificationConfig.slackWebhook}
              onChange={(e) => {
                setNotificationConfig((prev) => ({
                  ...prev,
                  slackWebhook: e.target.value
                }));
                setHasChanges(true);
              }}
              placeholder="https://hooks.slack.com/services/..." />

              <p className="text-xs text-gray-500 mt-1">
                Send payment notifications to a Slack channel
              </p>
            </div>
          </div>
        }
      </Card>

      {/* Test Gateway Modal */}
      {showTestModal &&
      <Modal
        isOpen={showTestModal}
        onClose={() => setShowTestModal(false)}
        title="Test Gateway Connection">

          <div className="space-y-6">
            {testResult === null ?
          <div className="text-center py-8">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">
                  Testing connection to {gateways.find((g) => g.id === selectedGateway)?.name}...
                </p>
              </div> :
          testResult === 'success' ?
          <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Connection Successful!
                </h3>
                <p className="text-gray-600">
                  Gateway is properly configured and ready to accept payments.
                </p>
              </div> :

          <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Connection Failed
                </h3>
                <p className="text-gray-600 mb-4">
                  Unable to connect to gateway. Please check your credentials.
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-left">
                  <p className="text-sm text-red-700">
                    Error: Invalid API key or merchant ID
                  </p>
                </div>
              </div>
          }

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setShowTestModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      }

      {/* Sticky Save Bar */}
      {hasChanges &&
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">You have unsaved changes</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => window.location.reload()}>
                Discard Changes
              </Button>
              <Button variant="primary" onClick={handleSave} disabled={isSaving}>
                {isSaving ?
              <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </> :

              <>
                    <Save className="w-4 h-4 mr-2" />
                    Save All Changes
                  </>
              }
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}