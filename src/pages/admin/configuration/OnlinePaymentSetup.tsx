// OnlinePaymentSetup.tsx
import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  Save, RotateCcw, CreditCard, Settings, Shield,
  RefreshCw, CheckCircle, AlertTriangle, Eye,
  EyeOff, Globe, Lock, DollarSign, Calendar,
  Users, FileText, Activity, ChevronDown, ChevronUp } from
'lucide-react';

// Types
interface Gateway {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
  mode: 'Live' | 'Test';
  merchantId?: string;
  apiKey?: string;
  lastTxn?: string;
  totalToday?: number;
}

export function OnlinePaymentSetup() {
  const [gateways, setGateways] = useState<Gateway[]>([
  { id: '1', name: 'Razorpay', status: 'Active', mode: 'Live', merchantId: 'rzp_live_xxxx', lastTxn: '2024-03-15', totalToday: 124500 },
  { id: '2', name: 'PayU', status: 'Inactive', mode: 'Test', merchantId: 'payu_test_xxxx' },
  { id: '3', name: 'CCAvenue', status: 'Inactive', mode: 'Test', merchantId: 'cc_test_xxxx' },
  { id: '4', name: 'Paytm', status: 'Inactive', mode: 'Test' }]
  );

  const [config, setConfig] = useState({
    // Gateway Config
    activeGateway: 'razorpay',
    gatewayMode: 'live',

    // Enable Payment For
    academicYears: ['2024-2025'],
    classes: ['all'],
    installments: ['all'],

    // General Settings
    enableOnlinePayment: true,
    allowPartialPayment: true,
    allowAdvancePayment: false,
    autoGenerateReceipt: true,
    sendEmailConfirmation: true,
    sendSmsConfirmation: true,
    sendWhatsappNotification: false,

    // Transaction Controls
    minAmount: 100,
    maxAmount: 100000,
    dailyLimitPerStudent: 50000,
    referenceFormat: 'ONL-{YEAR}-{0000}',

    // Security Controls
    validateBeforePosting: true,
    logAllTransactions: true,
    autoReconcile: true,
    enableOtpVerification: true,
    otpThreshold: 10000,
    blockDuplicates: true,
    fraudDetection: true,
    retryLimit: 3,

    // Reconciliation
    reconFrequency: 'realtime',
    settlementAccount: '',
    settlementBank: '',
    autoPostToAccounts: true,
    sendDailyReport: true,
    reportRecipients: 'finance@school.edu',
    flagUnmatched: true,
    mismatchThreshold: 100
  });

  const [activeSection, setActiveSection] = useState('gateway');
  const [expandedGateway, setExpandedGateway] = useState<string | null>('1');
  const [showSecrets, setShowSecrets] = useState<{[key: string]: boolean;}>({});

  const sections = [
  { id: 'gateway', label: 'Gateway Configuration', icon: CreditCard },
  { id: 'enable', label: 'Enable Payment For', icon: Calendar },
  { id: 'general', label: 'General Settings', icon: Settings },
  { id: 'controls', label: 'Transaction Controls', icon: DollarSign },
  { id: 'security', label: 'Security Controls', icon: Shield },
  { id: 'reconciliation', label: 'Reconciliation', icon: RefreshCw }];


  const feeHeads = ['Tuition Fee', 'Transport Fee', 'Hostel Fee', 'Exam Fee', 'Activity Fee', 'Library Fee'];
  const [enabledFeeHeads, setEnabledFeeHeads] = useState(['Tuition Fee', 'Exam Fee']);

  const updateConfig = (key: string, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const toggleFeeHead = (fee: string) => {
    setEnabledFeeHeads((prev) =>
    prev.includes(fee) ? prev.filter((f) => f !== fee) : [...prev, fee]
    );
  };

  const updateGateway = (id: string, field: string, value: any) => {
    setGateways((prev) => prev.map((g) => g.id === id ? { ...g, [field]: value } : g));
  };

  const setActiveGateway = (gatewayId: string) => {
    setGateways((prev) => prev.map((g) => ({
      ...g,
      status: g.id === gatewayId ? 'Active' : 'Inactive'
    })));
    const gateway = gateways.find((g) => g.id === gatewayId);
    if (gateway) updateConfig('activeGateway', gateway.name.toLowerCase());
  };

  // Toggle Component
  const Toggle = ({ label, description, checked, onChange }: any) =>
  <div className="flex items-start justify-between p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="flex-1">
        <span className="text-sm font-medium text-gray-900 block">{label}</span>
        {description && <span className="text-xs text-gray-500 block mt-1">{description}</span>}
      </div>
      <button
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ml-4 ${
      checked ? 'bg-green-500' : 'bg-gray-300'}`
      }>

        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
      checked ? 'right-1' : 'left-1'}`
      } />
      </button>
    </div>;


  // Gateway Card Component
  const GatewayCard = ({ gateway }: {gateway: Gateway;}) => {
    const isExpanded = expandedGateway === gateway.id;
    const isActive = gateway.status === 'Active';

    return (
      <div className={`border-2 rounded-lg transition-all ${isActive ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
        <div
          className="p-4 cursor-pointer flex items-center justify-between"
          onClick={() => setExpandedGateway(isExpanded ? null : gateway.id)}>

          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
              <CreditCard className={`w-5 h-5 ${isActive ? 'text-green-600' : 'text-gray-500'}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{gateway.name}</span>
                <Badge variant={isActive ? 'success' : 'secondary'}>{gateway.status}</Badge>
                <Badge variant={gateway.mode === 'Live' ? 'warning' : 'info'}>{gateway.mode}</Badge>
              </div>
              {gateway.lastTxn &&
              <p className="text-xs text-gray-500 mt-1">
                  Last Txn: {gateway.lastTxn} {gateway.totalToday && `• Today: ₹${gateway.totalToday.toLocaleString()}`}
                </p>
              }
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isActive &&
            <Button size="sm" onClick={(e) => {e.stopPropagation();setActiveGateway(gateway.id);}}>
                Activate
              </Button>
            }
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>

        {isExpanded &&
        <div className="p-4 border-t space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Select
              label="Mode"
              options={[
              { value: 'Live', label: 'Live (Production)' },
              { value: 'Test', label: 'Test (Sandbox)' }]
              }
              value={gateway.mode}
              onChange={(e) => updateGateway(gateway.id, 'mode', e.target.value)} />

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <div className="flex gap-2">
                  <Badge variant={isActive ? 'success' : 'secondary'} className="text-sm px-4 py-2">
                    {gateway.status}
                  </Badge>
                </div>
              </div>
            </div>

            <Input
            label="Merchant ID"
            value={gateway.merchantId || ''}
            onChange={(e) => updateGateway(gateway.id, 'merchantId', e.target.value)}
            placeholder="Enter Merchant ID" />


            <div className="relative">
              <Input
              label="API Key"
              type={showSecrets[`${gateway.id}-api`] ? 'text' : 'password'}
              value={gateway.apiKey || ''}
              onChange={(e) => updateGateway(gateway.id, 'apiKey', e.target.value)}
              placeholder="Enter API Key" />

              <button
              onClick={() => setShowSecrets((prev) => ({ ...prev, [`${gateway.id}-api`]: !prev[`${gateway.id}-api`] }))}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600">

                {showSecrets[`${gateway.id}-api`] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="relative">
              <Input
              label="Secret Key"
              type={showSecrets[`${gateway.id}-secret`] ? 'text' : 'password'}
              placeholder="Enter Secret Key" />

              <button
              onClick={() => setShowSecrets((prev) => ({ ...prev, [`${gateway.id}-secret`]: !prev[`${gateway.id}-secret`] }))}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600">

                {showSecrets[`${gateway.id}-secret`] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Input
            label="Webhook URL"
            value={`https://school.edu/payment/webhook/${gateway.name.toLowerCase()}`}
            disabled
            helpText="Copy this URL to your gateway dashboard" />


            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Activity className="w-4 h-4 mr-2" /> Test Connection
              </Button>
              <Button variant="outline" className="flex-1">
                <Globe className="w-4 h-4 mr-2" /> Open Dashboard
              </Button>
            </div>
          </div>
        }
      </div>);

  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
            <CreditCard className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Online Payment Setup</h1>
            <p className="text-sm text-gray-500 mt-1">Configure payment gateway, security, and reconciliation settings</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RotateCcw className="w-4 h-4 mr-2" /> Restore Defaults
          </Button>
          <Button>
            <Save className="w-4 h-4 mr-2" /> Save Settings
          </Button>
        </div>
      </div>

      {/* Status Banner */}
      {gateways.find((g) => g.status === 'Active') &&
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <div>
            <p className="text-sm font-semibold text-green-900">
              {gateways.find((g) => g.status === 'Active')?.name} Gateway Active ({gateways.find((g) => g.status === 'Active')?.mode} Mode)
            </p>
            <p className="text-xs text-green-700">
              Last transaction: {gateways.find((g) => g.status === 'Active')?.lastTxn || 'N/A'} • 
              Total today: ₹{(gateways.find((g) => g.status === 'Active')?.totalToday || 0).toLocaleString()}
            </p>
          </div>
        </div>
      }

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="space-y-1">
          {sections.map((s) =>
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
            activeSection === s.id ?
            'bg-blue-50 text-blue-700 border border-blue-200' :
            'text-gray-700 hover:bg-gray-100'}`
            }>

              <s.icon className="w-4 h-4" />
              {s.label}
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Section 1: Gateway Configuration */}
          {activeSection === 'gateway' &&
          <div className="space-y-4">
              <Card>
                <div className="p-6 border-b">
                  <h2 className="text-xl font-bold">Gateway Configuration</h2>
                  <p className="text-sm text-gray-500 mt-1">Configure payment gateway credentials and settings</p>
                </div>
                <div className="p-6 space-y-4">
                  {gateways.map((gateway) =>
                <GatewayCard key={gateway.id} gateway={gateway} />
                )}
                </div>
              </Card>
            </div>
          }

          {/* Section 2: Enable Payment For */}
          {activeSection === 'enable' &&
          <Card>
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold">Enable Payment For</h2>
                <p className="text-sm text-gray-500 mt-1">Configure which years, classes, and installments accept online payment</p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3">Academic Years</label>
                  <div className="space-y-2">
                    {['2024-2025', '2023-2024', '2022-2023'].map((year) =>
                  <label key={year} className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50">
                        <input
                      type="checkbox"
                      checked={config.academicYears.includes(year)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateConfig('academicYears', [...config.academicYears, year]);
                        } else {
                          updateConfig('academicYears', config.academicYears.filter((y) => y !== year));
                        }
                      }}
                      className="w-4 h-4 rounded" />

                        <span className="text-sm">{year}</span>
                      </label>
                  )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Classes</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['All Classes', 'Nursery-5', '6-8', '9-10', '11-12'].map((cls) =>
                  <label key={cls} className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50">
                        <input type="checkbox" defaultChecked={cls === 'All Classes'} className="w-4 h-4 rounded" />
                        <span className="text-sm">{cls}</span>
                      </label>
                  )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Installments</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['All', 'Q1', 'Q2', 'Q3', 'Q4', 'Annual', 'Registration', 'Admission'].map((inst) =>
                  <label key={inst} className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50">
                        <input type="checkbox" defaultChecked={inst === 'All'} className="w-4 h-4 rounded" />
                        <span className="text-sm">{inst}</span>
                      </label>
                  )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Fee Heads Eligible for Online Payment</label>
                  <div className="space-y-2">
                    {feeHeads.map((fee) =>
                  <div key={fee} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <span className="text-sm text-gray-700">{fee}</span>
                        <button
                      onClick={() => toggleFeeHead(fee)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                      enabledFeeHeads.includes(fee) ? 'bg-green-500' : 'bg-gray-300'}`
                      }>

                          <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      enabledFeeHeads.includes(fee) ? 'right-1' : 'left-1'}`
                      } />
                        </button>
                      </div>
                  )}
                  </div>
                </div>
              </div>
            </Card>
          }

          {/* Section 3: General Settings */}
          {activeSection === 'general' &&
          <Card>
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold">General Settings</h2>
              </div>
              <div className="p-6 space-y-4">
                <Toggle
                label="Enable Online Payment Collection"
                checked={config.enableOnlinePayment}
                onChange={(val: boolean) => updateConfig('enableOnlinePayment', val)} />

                <Toggle
                label="Allow Partial Fee Payment"
                checked={config.allowPartialPayment}
                onChange={(val: boolean) => updateConfig('allowPartialPayment', val)} />

                <Toggle
                label="Allow Advance Fee Payment"
                checked={config.allowAdvancePayment}
                onChange={(val: boolean) => updateConfig('allowAdvancePayment', val)} />

                <Select
                label="Payment Receipt Generation"
                options={[
                { value: 'auto', label: 'Auto-generate on Success' },
                { value: 'manual', label: 'Manual Approval Required' }]
                }
                value={config.autoGenerateReceipt ? 'auto' : 'manual'}
                onChange={(e) => updateConfig('autoGenerateReceipt', e.target.value === 'auto')} />

                <Input
                label="Payment Reference Number Format"
                value={config.referenceFormat}
                onChange={(e) => updateConfig('referenceFormat', e.target.value)}
                helpText="Use {YEAR}, {MONTH}, {0000} as placeholders" />

                <Toggle
                label="Send Payment Confirmation Email"
                checked={config.sendEmailConfirmation}
                onChange={(val: boolean) => updateConfig('sendEmailConfirmation', val)} />

                <Toggle
                label="Send Payment Confirmation SMS"
                checked={config.sendSmsConfirmation}
                onChange={(val: boolean) => updateConfig('sendSmsConfirmation', val)} />

                <Toggle
                label="Send WhatsApp Notification"
                checked={config.sendWhatsappNotification}
                onChange={(val: boolean) => updateConfig('sendWhatsappNotification', val)} />

              </div>
            </Card>
          }

          {/* Section 4: Transaction Controls */}
          {activeSection === 'controls' &&
          <Card>
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold">Transaction Controls</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                  label="Minimum Transaction Amount (₹)"
                  type="number"
                  value={config.minAmount}
                  onChange={(e) => updateConfig('minAmount', Number(e.target.value))} />

                  <Input
                  label="Maximum Transaction Amount (₹)"
                  type="number"
                  value={config.maxAmount}
                  onChange={(e) => updateConfig('maxAmount', Number(e.target.value))} />

                </div>
                <Input
                label="Daily Transaction Limit per Student (₹)"
                type="number"
                value={config.dailyLimitPerStudent}
                onChange={(e) => updateConfig('dailyLimitPerStudent', Number(e.target.value))} />

                <Toggle
                label="Auto Generate Receipt on Success"
                description="Automatically create receipt when payment succeeds"
                checked={config.autoGenerateReceipt}
                onChange={(val: boolean) => updateConfig('autoGenerateReceipt', val)} />

              </div>
            </Card>
          }

          {/* Section 5: Security Controls */}
          {activeSection === 'security' &&
          <Card>
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold">Security Controls</h2>
              </div>
              <div className="p-6 space-y-4">
                <Toggle
                label="Validate Transaction Before Posting"
                description="Verify transaction with gateway before posting to accounts"
                checked={config.validateBeforePosting}
                onChange={(val: boolean) => updateConfig('validateBeforePosting', val)} />

                <Toggle
                label="Log All Transactions"
                description="Maintain detailed logs of all payment attempts"
                checked={config.logAllTransactions}
                onChange={(val: boolean) => updateConfig('logAllTransactions', val)} />

                <Toggle
                label="Enable OTP Verification for Large Payments"
                checked={config.enableOtpVerification}
                onChange={(val: boolean) => updateConfig('enableOtpVerification', val)} />

                {config.enableOtpVerification &&
              <Input
                label="OTP Threshold Amount (₹)"
                type="number"
                value={config.otpThreshold}
                onChange={(e) => updateConfig('otpThreshold', Number(e.target.value))} />

              }
                <Toggle
                label="Block Duplicate Transactions (5 min window)"
                checked={config.blockDuplicates}
                onChange={(val: boolean) => updateConfig('blockDuplicates', val)} />

                <Toggle
                label="Enable Fraud Detection Alerts"
                checked={config.fraudDetection}
                onChange={(val: boolean) => updateConfig('fraudDetection', val)} />

                <Select
                label="Failed Payment Retry Limit"
                options={[
                { value: '3', label: '3 Attempts' },
                { value: '5', label: '5 Attempts' },
                { value: 'unlimited', label: 'Unlimited' }]
                }
                value={config.retryLimit.toString()}
                onChange={(e) => updateConfig('retryLimit', e.target.value === 'unlimited' ? 999 : Number(e.target.value))} />

              </div>
            </Card>
          }

          {/* Section 6: Reconciliation */}
          {activeSection === 'reconciliation' &&
          <Card>
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold">Reconciliation Settings</h2>
              </div>
              <div className="p-6 space-y-4">
                <Toggle
                label="Auto Reconcile"
                description="Automatically match gateway transactions with fee records"
                checked={config.autoReconcile}
                onChange={(val: boolean) => updateConfig('autoReconcile', val)} />

                <Select
                label="Reconciliation Frequency"
                options={[
                { value: 'realtime', label: 'Real-time (Webhook)' },
                { value: 'hourly', label: 'Every Hour' },
                { value: 'daily', label: 'Daily (End of Day)' }]
                }
                value={config.reconFrequency}
                onChange={(e) => updateConfig('reconFrequency', e.target.value)} />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                  label="Settlement Account"
                  value={config.settlementAccount}
                  onChange={(e) => updateConfig('settlementAccount', e.target.value)}
                  placeholder="Bank Account Number" />

                  <Input
                  label="Settlement Bank"
                  value={config.settlementBank}
                  onChange={(e) => updateConfig('settlementBank', e.target.value)}
                  placeholder="Bank Name" />

                </div>
                <Toggle
                label="Auto-post to Accounts on Settlement"
                checked={config.autoPostToAccounts}
                onChange={(val: boolean) => updateConfig('autoPostToAccounts', val)} />

                <Toggle
                label="Send Daily Reconciliation Report"
                checked={config.sendDailyReport}
                onChange={(val: boolean) => updateConfig('sendDailyReport', val)} />

                {config.sendDailyReport &&
              <Input
                label="Report Recipients (Email)"
                value={config.reportRecipients}
                onChange={(e) => updateConfig('reportRecipients', e.target.value)}
                placeholder="finance@school.edu, admin@school.edu" />

              }
                <Toggle
                label="Flag Unmatched Transactions"
                checked={config.flagUnmatched}
                onChange={(val: boolean) => updateConfig('flagUnmatched', val)} />

                <Input
                label="Reconciliation Mismatch Alert Threshold (₹)"
                type="number"
                value={config.mismatchThreshold}
                onChange={(e) => updateConfig('mismatchThreshold', Number(e.target.value))} />

              </div>
            </Card>
          }
        </div>
      </div>
    </div>);

}