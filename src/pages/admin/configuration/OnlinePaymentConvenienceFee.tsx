// OnlinePaymentConvenienceFee.tsx
import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  Save, RotateCcw, CreditCard, Smartphone, Building2,
  Wallet, Settings, AlertCircle, CheckCircle, Clock,
  DollarSign, Shield, ChevronDown, ChevronUp, Info } from
'lucide-react';

// Types
interface PaymentMode {
  id: string;
  name: string;
  icon: any;
  enabled: boolean;
  charges?: number;
}

export function OnlinePaymentConvenienceFee() {
  const [config, setConfig] = useState({
    // Section 1: Online Payment Enablement
    onlinePaymentEnabled: true,
    academicYear: '2024-2025',
    applicableClasses: ['all'],
    applicableInstallments: ['all'],

    // Section 2: Payment Gateway
    activeGateway: 'razorpay',
    testMode: true,
    autoReconcile: true,

    // Section 3: Convenience Fee
    convenienceFeeEnabled: true,
    feeType: 'percentage',
    feeValue: 2,
    maxCap: 500,
    minFee: 5,

    // Section 4: Fee Responsibility
    paidBy: 'parent',
    showBreakdown: true,
    includeInLateFee: false,

    // Section 5: Payment Limits
    minPayment: 100,
    maxPayment: 500000,
    allowPartialPayment: true,
    allowFullInstallmentOnly: false,
    allowCustomAmount: true,

    // Section 6: Failed Transaction
    autoRetry: true,
    maxRetryAttempts: 3,
    pendingDuration: 30,
    autoCancelMinutes: 60
  });

  const [paymentModes, setPaymentModes] = useState<PaymentMode[]>([
  { id: '1', name: 'Credit Card', icon: CreditCard, enabled: true, charges: 2 },
  { id: '2', name: 'Debit Card', icon: CreditCard, enabled: true, charges: 1.5 },
  { id: '3', name: 'Net Banking', icon: Building2, enabled: true, charges: 0 },
  { id: '4', name: 'UPI', icon: Smartphone, enabled: true, charges: 0 },
  { id: '5', name: 'Wallet', icon: Wallet, enabled: true, charges: 1 }]
  );

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['enablement', 'modes', 'fee'])
  );

  const updateConfig = (key: string, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      newSet.has(section) ? newSet.delete(section) : newSet.add(section);
      return newSet;
    });
  };

  const togglePaymentMode = (id: string) => {
    setPaymentModes((prev) => prev.map((mode) =>
    mode.id === id ? { ...mode, enabled: !mode.enabled } : mode
    ));
  };

  const calculateConvenienceFee = (amount: number) => {
    let fee = 0;
    if (config.convenienceFeeEnabled) {
      if (config.feeType === 'percentage') {
        fee = amount * config.feeValue / 100;
        if (config.maxCap && fee > config.maxCap) fee = config.maxCap;
      } else {
        fee = config.feeValue;
      }
      if (fee < config.minFee) fee = config.minFee;
    }
    return fee;
  };

  // Collapsible Section Component
  const Section = ({ id, title, icon: Icon, badge, children }: any) => {
    const isExpanded = expandedSections.has(id);
    return (
      <Card className="overflow-hidden">
        <div
          className="p-4 bg-gradient-to-r from-gray-50 to-white cursor-pointer flex items-center justify-between hover:from-blue-50 transition-colors"
          onClick={() => toggleSection(id)}>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Icon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{title}</h3>
              {badge && <Badge variant="info" className="mt-1">{badge}</Badge>}
            </div>
          </div>
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
        {isExpanded && <div className="p-6 border-t">{children}</div>}
      </Card>);

  };

  // Toggle Component
  const Toggle = ({ label, description, checked, onChange }: any) =>
  <div className="flex items-start justify-between p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
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


  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl shadow-lg">
            <CreditCard className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Online Payment & Convenience Fee Setup</h1>
            <p className="text-sm text-gray-500 mt-1">Configure payment gateways, modes, fees and transaction rules</p>
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

      {/* Status Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
        {
          label: 'Online Payment',
          value: config.onlinePaymentEnabled ? 'Enabled' : 'Disabled',
          color: config.onlinePaymentEnabled ? 'green' : 'red',
          icon: CheckCircle
        },
        {
          label: 'Active Modes',
          value: paymentModes.filter((m) => m.enabled).length,
          color: 'blue',
          icon: CreditCard
        },
        {
          label: 'Convenience Fee',
          value: config.convenienceFeeEnabled ? `${config.feeValue}${config.feeType === 'percentage' ? '%' : '₹'}` : 'Off',
          color: 'purple',
          icon: DollarSign
        },
        {
          label: 'Gateway Mode',
          value: config.testMode ? 'Test' : 'Live',
          color: config.testMode ? 'yellow' : 'green',
          icon: Shield
        }].
        map((stat) =>
        <Card key={stat.label} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">{stat.label}</div>
                <div className={`text-2xl font-bold text-${stat.color}-600 mt-1`}>{stat.value}</div>
              </div>
              <stat.icon className={`w-8 h-8 text-${stat.color}-500 opacity-50`} />
            </div>
          </Card>
        )}
      </div>

      {/* Section 1: Online Payment Enablement */}
      <Section
        id="enablement"
        title="Online Payment Enablement"
        icon={CheckCircle}
        badge={config.onlinePaymentEnabled ? 'Active' : 'Inactive'}>

        <div className="space-y-6">
          <Toggle
            label="Enable Online Payment"
            description="Allow parents to pay fees online through payment gateway"
            checked={config.onlinePaymentEnabled}
            onChange={(val: boolean) => updateConfig('onlinePaymentEnabled', val)} />


          {config.onlinePaymentEnabled &&
          <>
              <div className="grid grid-cols-2 gap-6">
                <Select
                label="Academic Year Applicability"
                options={[
                { value: '2024-2025', label: '2024-2025' },
                { value: '2023-2024', label: '2023-2024' },
                { value: '2022-2023', label: '2022-2023' }]
                }
                value={config.academicYear}
                onChange={(e) => updateConfig('academicYear', e.target.value)} />

                <div>
                  <label className="block text-sm font-medium mb-2">Applicable Classes</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                    {['All Classes', 'Nursery to 5', '6 to 8', '9 to 10', '11 to 12'].map((cls) =>
                  <label key={cls} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" defaultChecked={cls === 'All Classes'} className="rounded" />
                        {cls}
                      </label>
                  )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Applicable Installments</label>
                <div className="grid grid-cols-4 gap-2">
                  {['All', 'Q1', 'Q2', 'Q3', 'Q4', 'Annual', 'Registration', 'Admission'].map((inst) =>
                <label key={inst} className="flex items-center gap-2 text-sm p-2 border rounded hover:bg-gray-50">
                      <input type="checkbox" defaultChecked={inst === 'All'} className="rounded" />
                      {inst}
                    </label>
                )}
                </div>
              </div>
            </>
          }
        </div>
      </Section>

      {/* Section 2: Payment Mode Controls */}
      <Section id="modes" title="Payment Mode Controls" icon={CreditCard}>
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900">Enable Payment Methods</h4>
              <p className="text-sm text-blue-700">Select which payment methods parents can use. Different methods may have different processing charges.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {paymentModes.map((mode) =>
            <div
              key={mode.id}
              className={`p-4 border-2 rounded-lg transition-all ${
              mode.enabled ?
              'border-green-500 bg-green-50' :
              'border-gray-200 bg-gray-50 opacity-60'}`
              }>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${mode.enabled ? 'bg-green-100' : 'bg-gray-200'}`}>
                      <mode.icon className={`w-5 h-5 ${mode.enabled ? 'text-green-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <span className="font-semibold block">{mode.name}</span>
                      <span className="text-xs text-gray-500">
                        Processing: {mode.charges}%
                      </span>
                    </div>
                  </div>
                  <button
                  onClick={() => togglePaymentMode(mode.id)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                  mode.enabled ? 'bg-green-500' : 'bg-gray-300'}`
                  }>

                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  mode.enabled ? 'right-1' : 'left-1'}`
                  } />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Section 3: Convenience Fee Settings */}
      <Section id="fee" title="Convenience Fee Settings" icon={DollarSign}>
        <div className="space-y-6">
          <Toggle
            label="Charge Convenience Fee"
            description="Add processing fee on online transactions"
            checked={config.convenienceFeeEnabled}
            onChange={(val: boolean) => updateConfig('convenienceFeeEnabled', val)} />


          {config.convenienceFeeEnabled &&
          <>
              <div className="grid grid-cols-2 gap-6">
                <Select
                label="Calculation Type"
                options={[
                { value: 'percentage', label: 'Percentage of Amount' },
                { value: 'flat', label: 'Flat Amount' }]
                }
                value={config.feeType}
                onChange={(e) => updateConfig('feeType', e.target.value)} />

                <Input
                label={config.feeType === 'percentage' ? 'Percentage Value (%)' : 'Flat Amount (₹)'}
                type="number"
                value={config.feeValue}
                onChange={(e) => updateConfig('feeValue', Number(e.target.value))}
                step={config.feeType === 'percentage' ? '0.1' : '1'} />

              </div>

              <div className="grid grid-cols-2 gap-6">
                <Input
                label="Maximum Cap (₹)"
                type="number"
                value={config.maxCap}
                onChange={(e) => updateConfig('maxCap', Number(e.target.value))}
                helpText="Maximum fee that can be charged" />

                <Input
                label="Minimum Fee (₹)"
                type="number"
                value={config.minFee}
                onChange={(e) => updateConfig('minFee', Number(e.target.value))}
                helpText="Minimum fee for small transactions" />

              </div>

              {/* Live Calculation Demo */}
              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-3">Fee Calculator</h4>
                <div className="grid grid-cols-3 gap-4">
                  {[1000, 5000, 10000].map((amt) => {
                  const fee = calculateConvenienceFee(amt);
                  return (
                    <div key={amt} className="bg-white p-3 rounded border">
                        <div className="text-sm text-gray-600">For ₹{amt.toLocaleString()}</div>
                        <div className="text-xl font-bold text-purple-600">₹{fee.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">Total: ₹{(amt + fee).toLocaleString()}</div>
                      </div>);

                })}
                </div>
              </div>
            </>
          }
        </div>
      </Section>

      {/* Section 4: Fee Responsibility */}
      <Section id="responsibility" title="Convenience Fee Responsibility" icon={Settings}>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-3">Fee Paid By</label>
            <div className="grid grid-cols-2 gap-4">
              {[
              { value: 'parent', label: 'Parent/Student', desc: 'Fee added to total amount' },
              { value: 'institution', label: 'Institution', desc: 'Institution bears the cost' }].
              map((option) =>
              <label
                key={option.value}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                config.paidBy === option.value ?
                'border-blue-500 bg-blue-50' :
                'border-gray-200 hover:border-blue-300'}`
                }>

                  <input
                  type="radio"
                  name="paidBy"
                  value={option.value}
                  checked={config.paidBy === option.value}
                  onChange={(e) => updateConfig('paidBy', e.target.value)}
                  className="mr-3" />

                  <span className="font-semibold">{option.label}</span>
                  <p className="text-xs text-gray-500 mt-1 ml-6">{option.desc}</p>
                </label>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Toggle
              label="Show Breakdown in Receipt"
              description="Display convenience fee separately on payment receipt"
              checked={config.showBreakdown}
              onChange={(val: boolean) => updateConfig('showBreakdown', val)} />

            <Toggle
              label="Include in Late Fee Calculation"
              description="Consider convenience fee when calculating late fees"
              checked={config.includeInLateFee}
              onChange={(val: boolean) => updateConfig('includeInLateFee', val)} />

          </div>
        </div>
      </Section>

      {/* Section 5: Installment Restrictions */}
      <Section id="restrictions" title="Installment & Payment Restrictions" icon={AlertCircle}>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Minimum Payment Amount (₹)"
              type="number"
              value={config.minPayment}
              onChange={(e) => updateConfig('minPayment', Number(e.target.value))} />

            <Input
              label="Maximum Payment Amount (₹)"
              type="number"
              value={config.maxPayment}
              onChange={(e) => updateConfig('maxPayment', Number(e.target.value))} />

          </div>

          <div className="grid grid-cols-2 gap-4">
            <Toggle
              label="Allow Partial Payment"
              description="Parents can pay part of the due amount"
              checked={config.allowPartialPayment}
              onChange={(val: boolean) => updateConfig('allowPartialPayment', val)} />

            <Toggle
              label="Allow Full Installment Only"
              description="Force payment of complete installment amount"
              checked={config.allowFullInstallmentOnly}
              onChange={(val: boolean) => updateConfig('allowFullInstallmentOnly', val)} />

          </div>

          <Toggle
            label="Allow Custom Amount Entry"
            description="Let parents enter any amount within limits"
            checked={config.allowCustomAmount}
            onChange={(val: boolean) => updateConfig('allowCustomAmount', val)} />

        </div>
      </Section>

      {/* Section 6: Failed Transaction Handling */}
      <Section id="failed" title="Failed Transaction Handling" icon={Clock}>
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900">Transaction Failure Management</h4>
              <p className="text-sm text-red-700">Configure how system handles failed/pending transactions</p>
            </div>
          </div>

          <Toggle
            label="Auto Retry Allowed"
            description="Automatically retry failed transactions"
            checked={config.autoRetry}
            onChange={(val: boolean) => updateConfig('autoRetry', val)} />


          {config.autoRetry &&
          <div className="grid grid-cols-2 gap-6">
              <Input
              label="Max Retry Attempts"
              type="number"
              value={config.maxRetryAttempts}
              onChange={(e) => updateConfig('maxRetryAttempts', Number(e.target.value))}
              min="1"
              max="5" />

              <Input
              label="Mark as Pending Duration (minutes)"
              type="number"
              value={config.pendingDuration}
              onChange={(e) => updateConfig('pendingDuration', Number(e.target.value))}
              helpText="How long to wait before marking as pending" />

            </div>
          }

          <Input
            label="Auto Cancel After (minutes)"
            type="number"
            value={config.autoCancelMinutes}
            onChange={(e) => updateConfig('autoCancelMinutes', Number(e.target.value))}
            helpText="Automatically cancel stuck transactions after this duration" />


          {/* Gateway Settings */}
          <div className="border-t pt-6">
            <h4 className="font-semibold mb-4">Payment Gateway Configuration</h4>
            <div className="grid grid-cols-2 gap-6">
              <Select
                label="Active Gateway"
                options={[
                { value: 'razorpay', label: 'Razorpay' },
                { value: 'payu', label: 'PayU Money' },
                { value: 'ccavenue', label: 'CCAvenue' },
                { value: 'paytm', label: 'Paytm' },
                { value: 'phonepe', label: 'PhonePe' }]
                }
                value={config.activeGateway}
                onChange={(e) => updateConfig('activeGateway', e.target.value)} />

              <div className="space-y-2">
                <Toggle
                  label="Test Mode (Sandbox)"
                  description="Process dummy transactions for testing"
                  checked={config.testMode}
                  onChange={(val: boolean) => updateConfig('testMode', val)} />

              </div>
            </div>

            <div className="mt-4">
              <Toggle
                label="Auto-reconcile Transactions"
                description="Automatically match gateway transactions with fee records"
                checked={config.autoReconcile}
                onChange={(val: boolean) => updateConfig('autoReconcile', val)} />

            </div>
          </div>
        </div>
      </Section>

      {/* Summary Panel */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <div className="p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" /> Configuration Summary
          </h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600 block">Online Payment</span>
              <span className="font-bold">{config.onlinePaymentEnabled ? '✓ Enabled' : '✗ Disabled'}</span>
            </div>
            <div>
              <span className="text-gray-600 block">Active Payment Modes</span>
              <span className="font-bold">{paymentModes.filter((m) => m.enabled).length} / {paymentModes.length}</span>
            </div>
            <div>
              <span className="text-gray-600 block">Convenience Fee</span>
              <span className="font-bold">
                {config.convenienceFeeEnabled ?
                `${config.feeValue}${config.feeType === 'percentage' ? '%' : '₹'} (Paid by ${config.paidBy})` :
                'Not Charged'
                }
              </span>
            </div>
            <div>
              <span className="text-gray-600 block">Payment Range</span>
              <span className="font-bold">₹{config.minPayment} - ₹{config.maxPayment.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-600 block">Gateway Mode</span>
              <span className="font-bold">{config.testMode ? '🧪 Test' : '🟢 Live'}</span>
            </div>
            <div>
              <span className="text-gray-600 block">Failed Transaction</span>
              <span className="font-bold">
                {config.autoRetry ? `Retry ${config.maxRetryAttempts}x` : 'No Retry'}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>);

}