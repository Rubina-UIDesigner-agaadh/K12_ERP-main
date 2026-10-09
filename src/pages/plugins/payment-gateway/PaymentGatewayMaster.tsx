import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  CheckCircle,
  XCircle,
  X,
  Loader2,
  Settings,
  CreditCard,
  Building2,
  Globe,
  Key,
  Shield,
  Link2,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Wifi,
  WifiOff,
  TestTube,
  Lock,
  Unlock,
  MoreVertical,
  Activity,
  Zap,
  Server,
  CheckCircle2,
  Info,
  AlertCircle,
  Smartphone,
  Landmark } from
'lucide-react';

interface PaymentGateway {
  id: string;
  gatewayName: string;
  providerType: string;
  merchantId: string;
  apiKey: string;
  secretKey: string;
  webhookUrl: string;
  isActive: boolean;
  allowCreditCard: boolean;
  allowDebitCard: boolean;
  allowNetbanking: boolean;
  allowUPI: boolean;
  allowWallet: boolean;
  testMode: boolean;
  createdAt: string;
  updatedAt: string;
  lastTestedAt: string | null;
  lastTestStatus: 'success' | 'failed' | null;
  transactionCount: number;
  successRate: number;
}

export function PaymentGatewayMaster() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMode, setFilterMode] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{id: string;status: 'success' | 'failed';message: string;} | null>(null);
  const [visibleSecrets, setVisibleSecrets] = useState<{[key: string]: boolean;}>({});
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    gatewayName: '',
    providerType: '',
    merchantId: '',
    apiKey: '',
    secretKey: '',
    webhookUrl: '',
    isActive: true,
    allowCreditCard: true,
    allowDebitCard: true,
    allowNetbanking: true,
    allowUPI: true,
    allowWallet: false,
    testMode: true
  });

  const [formErrors, setFormErrors] = useState<{[key: string]: string;}>({});

  const [gateways, setGateways] = useState<PaymentGateway[]>([
  {
    id: '1',
    gatewayName: 'Razorpay Production',
    providerType: 'Razorpay',
    merchantId: 'rzp_live_abc123xyz',
    apiKey: 'rzp_live_key_abc123xyz789',
    secretKey: 'sk_live_abcdefghijklmnopqrstuvwxyz123456',
    webhookUrl: 'https://api.school.com/webhooks/razorpay',
    isActive: true,
    allowCreditCard: true,
    allowDebitCard: true,
    allowNetbanking: true,
    allowUPI: true,
    allowWallet: true,
    testMode: false,
    createdAt: '2024-01-15T10:00:00',
    updatedAt: '2024-03-10T14:30:00',
    lastTestedAt: '2024-03-15T09:00:00',
    lastTestStatus: 'success',
    transactionCount: 15420,
    successRate: 96.5
  },
  {
    id: '2',
    gatewayName: 'PayU India',
    providerType: 'PayU',
    merchantId: 'payu_merchant_456def',
    apiKey: 'payu_key_456defghijklmnop',
    secretKey: 'payu_secret_abcdefghijklmnopqrstuvwxyz',
    webhookUrl: 'https://api.school.com/webhooks/payu',
    isActive: true,
    allowCreditCard: true,
    allowDebitCard: true,
    allowNetbanking: true,
    allowUPI: false,
    allowWallet: false,
    testMode: false,
    createdAt: '2024-02-01T10:00:00',
    updatedAt: '2024-03-08T11:15:00',
    lastTestedAt: '2024-03-14T16:00:00',
    lastTestStatus: 'success',
    transactionCount: 8750,
    successRate: 94.2
  },
  {
    id: '3',
    gatewayName: 'CCAvenue',
    providerType: 'CCAvenue',
    merchantId: 'cca_merchant_789ghi',
    apiKey: 'cca_access_code_789ghijklmnop',
    secretKey: 'cca_working_key_abcdefghijklmnopqrst',
    webhookUrl: 'https://api.school.com/webhooks/ccavenue',
    isActive: false,
    allowCreditCard: true,
    allowDebitCard: true,
    allowNetbanking: true,
    allowUPI: false,
    allowWallet: false,
    testMode: false,
    createdAt: '2024-02-15T10:00:00',
    updatedAt: '2024-03-01T09:00:00',
    lastTestedAt: '2024-03-01T09:00:00',
    lastTestStatus: 'failed',
    transactionCount: 3200,
    successRate: 91.8
  },
  {
    id: '4',
    gatewayName: 'Razorpay Sandbox',
    providerType: 'Razorpay',
    merchantId: 'rzp_test_sandbox123',
    apiKey: 'rzp_test_key_sandbox123xyz',
    secretKey: 'sk_test_sandboxsecretkey123456789',
    webhookUrl: 'https://api-staging.school.com/webhooks/razorpay',
    isActive: true,
    allowCreditCard: true,
    allowDebitCard: true,
    allowNetbanking: true,
    allowUPI: true,
    allowWallet: true,
    testMode: true,
    createdAt: '2024-03-01T10:00:00',
    updatedAt: '2024-03-15T10:00:00',
    lastTestedAt: '2024-03-15T10:00:00',
    lastTestStatus: 'success',
    transactionCount: 245,
    successRate: 100
  },
  {
    id: '5',
    gatewayName: 'Cashfree Payments',
    providerType: 'Cashfree',
    merchantId: 'cf_merchant_101jkl',
    apiKey: 'cf_api_key_101jklmnopqrst',
    secretKey: 'cf_secret_key_abcdefghijklmnopqrstuvwxyz',
    webhookUrl: 'https://api.school.com/webhooks/cashfree',
    isActive: true,
    allowCreditCard: true,
    allowDebitCard: true,
    allowNetbanking: false,
    allowUPI: true,
    allowWallet: false,
    testMode: false,
    createdAt: '2024-03-05T10:00:00',
    updatedAt: '2024-03-14T16:00:00',
    lastTestedAt: '2024-03-14T16:00:00',
    lastTestStatus: 'success',
    transactionCount: 1850,
    successRate: 97.3
  }]
  );

  const providerTypes = [
  { value: '', label: 'Select Provider' },
  { value: 'Razorpay', label: 'Razorpay' },
  { value: 'PayU', label: 'PayU' },
  { value: 'CCAvenue', label: 'CCAvenue' },
  { value: 'Cashfree', label: 'Cashfree' },
  { value: 'Paytm', label: 'Paytm Payment Gateway' },
  { value: 'PhonePe', label: 'PhonePe PG' },
  { value: 'Stripe', label: 'Stripe' },
  { value: 'PayPal', label: 'PayPal' },
  { value: 'Other', label: 'Other' }];


  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const filteredGateways = gateways.filter((gateway) => {
    const matchesSearch =
    searchQuery === '' ||
    gateway.gatewayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gateway.providerType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gateway.merchantId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
    filterStatus === 'all' ||
    filterStatus === 'active' && gateway.isActive ||
    filterStatus === 'inactive' && !gateway.isActive;

    const matchesMode =
    filterMode === 'all' ||
    filterMode === 'live' && !gateway.testMode ||
    filterMode === 'test' && gateway.testMode;

    return matchesSearch && matchesStatus && matchesMode;
  });

  const resetForm = () => {
    setFormData({
      gatewayName: '',
      providerType: '',
      merchantId: '',
      apiKey: '',
      secretKey: '',
      webhookUrl: '',
      isActive: true,
      allowCreditCard: true,
      allowDebitCard: true,
      allowNetbanking: true,
      allowUPI: true,
      allowWallet: false,
      testMode: true
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors: {[key: string]: string;} = {};

    if (!formData.gatewayName.trim()) {
      errors.gatewayName = 'Gateway name is required';
    }
    if (!formData.providerType) {
      errors.providerType = 'Provider type is required';
    }
    if (!formData.merchantId.trim()) {
      errors.merchantId = 'Merchant ID is required';
    }
    if (!formData.apiKey.trim()) {
      errors.apiKey = 'API Key is required';
    }
    if (!formData.secretKey.trim()) {
      errors.secretKey = 'Secret Key is required';
    }
    if (!formData.webhookUrl.trim()) {
      errors.webhookUrl = 'Webhook URL is required';
    } else if (!/^https?:\/\/.+/.test(formData.webhookUrl)) {
      errors.webhookUrl = 'Please enter a valid URL';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddGateway = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newGateway: PaymentGateway = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastTestedAt: null,
      lastTestStatus: null,
      transactionCount: 0,
      successRate: 0
    };

    setGateways([...gateways, newGateway]);
    setIsSubmitting(false);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditGateway = async () => {
    if (!validateForm() || !selectedGateway) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setGateways(
      gateways.map((g) =>
      g.id === selectedGateway.id ?
      {
        ...g,
        ...formData,
        updatedAt: new Date().toISOString()
      } :
      g
      )
    );

    setIsSubmitting(false);
    setShowEditModal(false);
    setSelectedGateway(null);
    resetForm();
  };

  const handleDeleteGateway = async () => {
    if (!selectedGateway) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setGateways(gateways.filter((g) => g.id !== selectedGateway.id));
    setIsSubmitting(false);
    setShowDeleteModal(false);
    setSelectedGateway(null);
  };

  const handleTestConnection = async (gateway: PaymentGateway) => {
    setIsTesting(gateway.id);
    setTestResult(null);

    await new Promise((resolve) => setTimeout(resolve, 2500));

    const success = Math.random() > 0.2;
    const result = {
      id: gateway.id,
      status: success ? 'success' as const : 'failed' as const,
      message: success ?
      'Connection successful! Gateway is responding correctly.' :
      'Connection failed. Please check your credentials.'
    };

    setTestResult(result);
    setIsTesting(null);

    setGateways(
      gateways.map((g) =>
      g.id === gateway.id ?
      {
        ...g,
        lastTestedAt: new Date().toISOString(),
        lastTestStatus: result.status
      } :
      g
      )
    );

    setTimeout(() => setTestResult(null), 5000);
  };

  const handleToggleActive = (gateway: PaymentGateway) => {
    setGateways(
      gateways.map((g) =>
      g.id === gateway.id ?
      { ...g, isActive: !g.isActive, updatedAt: new Date().toISOString() } :
      g
      )
    );
  };

  const handleToggleTestMode = (gateway: PaymentGateway) => {
    setGateways(
      gateways.map((g) =>
      g.id === gateway.id ?
      { ...g, testMode: !g.testMode, updatedAt: new Date().toISOString() } :
      g
      )
    );
  };

  const toggleSecretVisibility = (id: string) => {
    setVisibleSecrets((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const openEditModal = (gateway: PaymentGateway) => {
    setSelectedGateway(gateway);
    setFormData({
      gatewayName: gateway.gatewayName,
      providerType: gateway.providerType,
      merchantId: gateway.merchantId,
      apiKey: gateway.apiKey,
      secretKey: gateway.secretKey,
      webhookUrl: gateway.webhookUrl,
      isActive: gateway.isActive,
      allowCreditCard: gateway.allowCreditCard,
      allowDebitCard: gateway.allowDebitCard,
      allowNetbanking: gateway.allowNetbanking,
      allowUPI: gateway.allowUPI,
      allowWallet: gateway.allowWallet,
      testMode: gateway.testMode
    });
    setShowEditModal(true);
  };

  const maskString = (str: string, visibleChars: number = 8) => {
    if (str.length <= visibleChars) return str;
    return str.substring(0, visibleChars) + '•'.repeat(Math.min(str.length - visibleChars, 20));
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'Razorpay':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'PayU':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'CCAvenue':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Cashfree':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Paytm':
        return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const columns = [
  {
    key: 'gateway',
    header: 'Gateway Details',
    render: (row: PaymentGateway) =>
    <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{row.gatewayName}</span>
            {row.testMode &&
        <Badge variant="warning" className="text-xs">
                <TestTube className="w-3 h-3 mr-1" />
                Sandbox
              </Badge>
        }
          </div>
          <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getProviderColor(row.providerType)}`}>
            {row.providerType}
          </div>
        </div>

  },
  {
    key: 'merchantId',
    header: 'Merchant ID',
    render: (row: PaymentGateway) =>
    <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-gray-700">{maskString(row.merchantId, 12)}</span>
          <button
        onClick={() => handleCopy(row.merchantId, `merchant-${row.id}`)}
        className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
        title="Copy Merchant ID">

            {copiedField === `merchant-${row.id}` ?
        <CheckCircle className="w-3 h-3 text-green-500" /> :

        <Copy className="w-3 h-3" />
        }
          </button>
        </div>

  },
  {
    key: 'credentials',
    header: 'API Credentials',
    render: (row: PaymentGateway) =>
    <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 w-12">API:</span>
            <span className="font-mono text-xs text-gray-700">
              {visibleSecrets[`api-${row.id}`] ? row.apiKey : maskString(row.apiKey, 10)}
            </span>
            <button
          onClick={() => toggleSecretVisibility(`api-${row.id}`)}
          className="p-1 hover:bg-gray-100 rounded text-gray-400">

              {visibleSecrets[`api-${row.id}`] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 w-12">Secret:</span>
            <span className="font-mono text-xs text-gray-700">
              {visibleSecrets[`secret-${row.id}`] ? row.secretKey : '••••••••••••••••••••'}
            </span>
            <button
          onClick={() => toggleSecretVisibility(`secret-${row.id}`)}
          className="p-1 hover:bg-gray-100 rounded text-gray-400">

              {visibleSecrets[`secret-${row.id}`] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </button>
          </div>
        </div>

  },
  {
    key: 'paymentMethods',
    header: 'Payment Methods',
    render: (row: PaymentGateway) =>
    <div className="flex flex-wrap gap-1">
          {row.allowCreditCard &&
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
              <CreditCard className="w-3 h-3" />
              Credit
            </span>
      }
          {row.allowDebitCard &&
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs">
              <CreditCard className="w-3 h-3" />
              Debit
            </span>
      }
          {row.allowNetbanking &&
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs">
              <Landmark className="w-3 h-3" />
              Net Banking
            </span>
      }
          {row.allowUPI &&
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-50 text-orange-700 rounded text-xs">
              <Smartphone className="w-3 h-3" />
              UPI
            </span>
      }
          {row.allowWallet &&
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-cyan-50 text-cyan-700 rounded text-xs">
              <Building2 className="w-3 h-3" />
              Wallet
            </span>
      }
        </div>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: PaymentGateway) =>
    <div className="space-y-2">
          <button
        onClick={() => handleToggleActive(row)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
        row.isActive ?
        'bg-green-100 text-green-700 hover:bg-green-200' :
        'bg-gray-100 text-gray-500 hover:bg-gray-200'}`
        }>

            {row.isActive ?
        <>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Active
              </> :

        <>
                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                Inactive
              </>
        }
          </button>
          {row.lastTestStatus &&
      <div className="flex items-center gap-1 text-xs">
              {row.lastTestStatus === 'success' ?
        <CheckCircle className="w-3 h-3 text-green-500" /> :

        <XCircle className="w-3 h-3 text-red-500" />
        }
              <span className={row.lastTestStatus === 'success' ? 'text-green-600' : 'text-red-600'}>
                Last test: {row.lastTestStatus}
              </span>
            </div>
      }
        </div>

  },
  {
    key: 'stats',
    header: 'Performance',
    render: (row: PaymentGateway) =>
    <div className="space-y-1">
          <div className="text-sm font-medium text-gray-900">
            {row.transactionCount.toLocaleString()} txns
          </div>
          <div className="flex items-center gap-1">
            <div className="w-16 bg-gray-200 rounded-full h-1.5">
              <div
            className={`h-1.5 rounded-full ${
            row.successRate >= 95 ? 'bg-green-500' : row.successRate >= 90 ? 'bg-yellow-500' : 'bg-red-500'}`
            }
            style={{ width: `${row.successRate}%` }}>
          </div>
            </div>
            <span className="text-xs text-gray-500">{row.successRate}%</span>
          </div>
        </div>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: PaymentGateway) =>
    <div className="flex items-center gap-1">
          <button
        onClick={() => handleTestConnection(row)}
        disabled={isTesting === row.id}
        className={`p-2 rounded-lg transition-colors ${
        isTesting === row.id ?
        'bg-blue-100 text-blue-600' :
        'hover:bg-blue-50 text-blue-600'}`
        }
        title="Test Connection">

            {isTesting === row.id ?
        <Loader2 className="w-4 h-4 animate-spin" /> :

        <Wifi className="w-4 h-4" />
        }
          </button>
          <button
        onClick={() => {
          setSelectedGateway(row);
          setShowViewModal(true);
        }}
        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
        title="View Details">

            <Eye className="w-4 h-4" />
          </button>
          <button
        onClick={() => openEditModal(row)}
        className="p-2 hover:bg-yellow-50 rounded-lg text-yellow-600"
        title="Edit">

            <Edit3 className="w-4 h-4" />
          </button>
          <button
        onClick={() => {
          setSelectedGateway(row);
          setShowDeleteModal(true);
        }}
        className="p-2 hover:bg-red-50 rounded-lg text-red-600"
        title="Delete">

            <Trash2 className="w-4 h-4" />
          </button>
        </div>

  }];


  const ToggleSwitch = ({
    checked,
    onChange,
    label,
    description





  }: {checked: boolean;onChange: (checked: boolean) => void;label: string;description?: string;}) =>
  <div className="flex items-center justify-between">
      <div>
        <div className="text-sm font-medium text-gray-700">{label}</div>
        {description && <div className="text-xs text-gray-500">{description}</div>}
      </div>
      <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      checked ? 'bg-blue-600' : 'bg-gray-300'}`
      }>

        <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        checked ? 'translate-x-6' : 'translate-x-1'}`
        } />

      </button>
    </div>;


  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Gateway Master</h1>
          <p className="text-sm text-gray-500">
            Configure and manage payment gateway integrations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}>

            <Plus className="w-4 h-4 mr-2" />
            Add Gateway
          </Button>
        </div>
      </div>

      {/* Test Result Toast */}
      {testResult &&
      <div
        className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border flex items-start gap-3 min-w-[320px] animate-slide-in ${
        testResult.status === 'success' ?
        'bg-green-50 border-green-200' :
        'bg-red-50 border-red-200'}`
        }>

          {testResult.status === 'success' ?
        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" /> :

        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
        }
          <div className="flex-1">
            <p
            className={`font-medium ${
            testResult.status === 'success' ? 'text-green-800' : 'text-red-800'}`
            }>

              Connection Test {testResult.status === 'success' ? 'Passed' : 'Failed'}
            </p>
            <p
            className={`text-sm ${
            testResult.status === 'success' ? 'text-green-700' : 'text-red-700'}`
            }>

              {testResult.message}
            </p>
          </div>
          <button onClick={() => setTestResult(null)} className="p-1 hover:bg-white/50 rounded">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      }

      {/* Security Notice */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800">Security Notice</h4>
            <ul className="mt-1 text-sm text-blue-700 space-y-1">
              <li>• API Keys and Secret Keys are encrypted and stored securely</li>
              <li>• Always use HTTPS webhook URLs for production environments</li>
              <li>• Test credentials in Sandbox mode before going live</li>
              <li>• Regularly rotate API keys for enhanced security</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by gateway name, provider, or merchant ID..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} />

          </div>
          <Select
            className="w-40"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
            { value: 'all', label: 'All Status' },
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' }]
            } />

          <Select
            className="w-40"
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value)}
            options={[
            { value: 'all', label: 'All Modes' },
            { value: 'live', label: 'Live/Production' },
            { value: 'test', label: 'Test/Sandbox' }]
            } />

        </div>
      </Card>

      {/* Gateways Table */}
      <Card
        title={`Payment Gateways (${filteredGateways.length})`}
        headerAction={
        <div className="flex items-center gap-2 text-sm text-gray-500">
            <Activity className="w-4 h-4" />
            <span>{gateways.filter((g) => g.isActive).length} active</span>
          </div>
        }>

        <div className="overflow-x-auto">
          <Table columns={columns} data={filteredGateways} />
        </div>

        {filteredGateways.length === 0 &&
        <div className="py-12 text-center">
            <div className="flex flex-col items-center">
              <div className="p-4 bg-gray-100 rounded-full mb-4">
                <Server className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Gateways Found</h3>
              <p className="text-sm text-gray-500 mb-4">
                {searchQuery || filterStatus !== 'all' || filterMode !== 'all' ?
              'Try adjusting your search or filters' :
              'Add your first payment gateway to get started'}
              </p>
              <Button
              variant="primary"
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}>

                <Plus className="w-4 h-4 mr-2" />
                Add Gateway
              </Button>
            </div>
          </div>
        }
      </Card>

      {/* Add/Edit Gateway Modal */}
      {(showAddModal || showEditModal) &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  {showAddModal ? 'Add New Payment Gateway' : 'Edit Payment Gateway'}
                </h3>
                <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setSelectedGateway(null);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg">

                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Basic Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gateway Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                    type="text"
                    placeholder="e.g., Razorpay Production"
                    value={formData.gatewayName}
                    onChange={(e) => setFormData({ ...formData, gatewayName: e.target.value })}
                    className={formErrors.gatewayName ? 'border-red-500' : ''} />

                    {formErrors.gatewayName &&
                  <p className="text-xs text-red-500 mt-1">{formErrors.gatewayName}</p>
                  }
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Provider Type <span className="text-red-500">*</span>
                    </label>
                    <Select
                    className={`w-full ${formErrors.providerType ? 'border-red-500' : ''}`}
                    value={formData.providerType}
                    onChange={(e) => setFormData({ ...formData, providerType: e.target.value })}
                    options={providerTypes} />

                    {formErrors.providerType &&
                  <p className="text-xs text-red-500 mt-1">{formErrors.providerType}</p>
                  }
                  </div>
                </div>
              </div>

              {/* API Credentials */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  API Credentials
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Merchant ID <span className="text-red-500">*</span>
                    </label>
                    <Input
                    type="text"
                    placeholder="Enter merchant ID"
                    value={formData.merchantId}
                    onChange={(e) => setFormData({ ...formData, merchantId: e.target.value })}
                    className={formErrors.merchantId ? 'border-red-500' : ''} />

                    {formErrors.merchantId &&
                  <p className="text-xs text-red-500 mt-1">{formErrors.merchantId}</p>
                  }
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      API Key <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                      type={visibleSecrets['form-api'] ? 'text' : 'password'}
                      placeholder="Enter API key"
                      value={formData.apiKey}
                      onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                      className={`pr-10 ${formErrors.apiKey ? 'border-red-500' : ''}`} />

                      <button
                      type="button"
                      onClick={() => toggleSecretVisibility('form-api')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">

                        {visibleSecrets['form-api'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {formErrors.apiKey &&
                  <p className="text-xs text-red-500 mt-1">{formErrors.apiKey}</p>
                  }
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Secret Key <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                      type={visibleSecrets['form-secret'] ? 'text' : 'password'}
                      placeholder="Enter secret key"
                      value={formData.secretKey}
                      onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
                      className={`pr-10 ${formErrors.secretKey ? 'border-red-500' : ''}`} />

                      <button
                      type="button"
                      onClick={() => toggleSecretVisibility('form-secret')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">

                        {visibleSecrets['form-secret'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {formErrors.secretKey &&
                  <p className="text-xs text-red-500 mt-1">{formErrors.secretKey}</p>
                  }
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Webhook URL <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input
                      type="url"
                      placeholder="https://api.yourschool.com/webhooks/gateway"
                      value={formData.webhookUrl}
                      onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
                      className={`pl-10 ${formErrors.webhookUrl ? 'border-red-500' : ''}`} />

                    </div>
                    {formErrors.webhookUrl &&
                  <p className="text-xs text-red-500 mt-1">{formErrors.webhookUrl}</p>
                  }
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Allowed Payment Methods
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <ToggleSwitch
                  checked={formData.allowCreditCard}
                  onChange={(checked) => setFormData({ ...formData, allowCreditCard: checked })}
                  label="Credit Card" />

                  <ToggleSwitch
                  checked={formData.allowDebitCard}
                  onChange={(checked) => setFormData({ ...formData, allowDebitCard: checked })}
                  label="Debit Card" />

                  <ToggleSwitch
                  checked={formData.allowNetbanking}
                  onChange={(checked) => setFormData({ ...formData, allowNetbanking: checked })}
                  label="Net Banking" />

                  <ToggleSwitch
                  checked={formData.allowUPI}
                  onChange={(checked) => setFormData({ ...formData, allowUPI: checked })}
                  label="UPI" />

                  <ToggleSwitch
                  checked={formData.allowWallet}
                  onChange={(checked) => setFormData({ ...formData, allowWallet: checked })}
                  label="Wallet" />

                </div>
              </div>

              {/* Configuration Toggles */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Configuration
                </h4>
                <div className="space-y-4">
                  <ToggleSwitch
                  checked={formData.isActive}
                  onChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  label="Is Active"
                  description="Enable this gateway for processing payments" />

                  <div className="pt-2 border-t">
                    <ToggleSwitch
                    checked={formData.testMode}
                    onChange={(checked) => setFormData({ ...formData, testMode: checked })}
                    label="Test Mode / Sandbox"
                    description="Use sandbox credentials for testing" />

                  </div>
                </div>
              </div>

              {/* Test Mode Warning */}
              {formData.testMode &&
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start gap-3">
                    <TestTube className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-700">
                      <p className="font-medium">Sandbox Mode Enabled</p>
                      <p className="mt-1">
                        This gateway is configured for testing. Real payments will not be processed.
                        Disable test mode before going live.
                      </p>
                    </div>
                  </div>
                </div>
            }
            </div>

            <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end gap-3 sticky bottom-0">
              <Button
              variant="outline"
              onClick={() => {
                setShowAddModal(false);
                setShowEditModal(false);
                setSelectedGateway(null);
                resetForm();
              }}>

                Cancel
              </Button>
              <Button
              variant="primary"
              onClick={showAddModal ? handleAddGateway : handleEditGateway}
              disabled={isSubmitting}>

                {isSubmitting ?
              <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {showAddModal ? 'Adding...' : 'Saving...'}
                  </> :

              <>
                    {showAddModal ?
                <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Gateway
                      </> :

                <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                }
                  </>
              }
              </Button>
            </div>
          </div>
        </div>
      }

      {/* View Gateway Modal */}
      {showViewModal && selectedGateway &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-gray-900">{selectedGateway.gatewayName}</h3>
                  {selectedGateway.testMode &&
                <Badge variant="warning">
                      <TestTube className="w-3 h-3 mr-1" />
                      Sandbox
                    </Badge>
                }
                  {selectedGateway.isActive ?
                <Badge variant="success">Active</Badge> :

                <Badge variant="danger">Inactive</Badge>
                }
                </div>
                <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedGateway(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg">

                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Provider Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className={`p-3 rounded-lg border ${getProviderColor(selectedGateway.providerType)}`}>
                  <Server className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Provider</div>
                  <div className="font-semibold text-gray-900">{selectedGateway.providerType}</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-sm text-gray-500">Success Rate</div>
                  <div className="font-semibold text-gray-900">{selectedGateway.successRate}%</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Transactions</div>
                  <div className="font-semibold text-gray-900">
                    {selectedGateway.transactionCount.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Credentials */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">API Credentials</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-xs text-gray-500">Merchant ID</div>
                      <div className="font-mono text-sm">{selectedGateway.merchantId}</div>
                    </div>
                    <button
                    onClick={() => handleCopy(selectedGateway.merchantId, 'view-merchant')}
                    className="p-2 hover:bg-gray-200 rounded">

                      {copiedField === 'view-merchant' ?
                    <CheckCircle className="w-4 h-4 text-green-500" /> :

                    <Copy className="w-4 h-4 text-gray-400" />
                    }
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-xs text-gray-500">API Key</div>
                      <div className="font-mono text-sm">
                        {visibleSecrets['view-api'] ? selectedGateway.apiKey : maskString(selectedGateway.apiKey, 15)}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                      onClick={() => toggleSecretVisibility('view-api')}
                      className="p-2 hover:bg-gray-200 rounded">

                        {visibleSecrets['view-api'] ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                      </button>
                      <button
                      onClick={() => handleCopy(selectedGateway.apiKey, 'view-api')}
                      className="p-2 hover:bg-gray-200 rounded">

                        {copiedField === 'view-api' ?
                      <CheckCircle className="w-4 h-4 text-green-500" /> :

                      <Copy className="w-4 h-4 text-gray-400" />
                      }
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-xs text-gray-500">Secret Key</div>
                      <div className="font-mono text-sm">
                        {visibleSecrets['view-secret'] ? selectedGateway.secretKey : '••••••••••••••••••••••••'}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                      onClick={() => toggleSecretVisibility('view-secret')}
                      className="p-2 hover:bg-gray-200 rounded">

                        {visibleSecrets['view-secret'] ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                      </button>
                      <button
                      onClick={() => handleCopy(selectedGateway.secretKey, 'view-secret')}
                      className="p-2 hover:bg-gray-200 rounded">

                        {copiedField === 'view-secret' ?
                      <CheckCircle className="w-4 h-4 text-green-500" /> :

                      <Copy className="w-4 h-4 text-gray-400" />
                      }
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">Webhook URL</div>
                      <div className="font-mono text-sm text-blue-600 truncate">{selectedGateway.webhookUrl}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                      onClick={() => window.open(selectedGateway.webhookUrl, '_blank')}
                      className="p-2 hover:bg-gray-200 rounded">

                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </button>
                      <button
                      onClick={() => handleCopy(selectedGateway.webhookUrl, 'view-webhook')}
                      className="p-2 hover:bg-gray-200 rounded">

                        {copiedField === 'view-webhook' ?
                      <CheckCircle className="w-4 h-4 text-green-500" /> :

                      <Copy className="w-4 h-4 text-gray-400" />
                      }
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Enabled Payment Methods</h4>
                <div className="flex flex-wrap gap-2">
                  <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                  selectedGateway.allowCreditCard ?
                  'bg-green-50 border-green-200 text-green-700' :
                  'bg-gray-50 border-gray-200 text-gray-400'}`
                  }>

                    <CreditCard className="w-4 h-4" />
                    <span className="text-sm">Credit Card</span>
                    {selectedGateway.allowCreditCard ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  </div>
                  <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                  selectedGateway.allowDebitCard ?
                  'bg-green-50 border-green-200 text-green-700' :
                  'bg-gray-50 border-gray-200 text-gray-400'}`
                  }>

                    <CreditCard className="w-4 h-4" />
                    <span className="text-sm">Debit Card</span>
                    {selectedGateway.allowDebitCard ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  </div>
                  <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                  selectedGateway.allowNetbanking ?
                  'bg-green-50 border-green-200 text-green-700' :
                  'bg-gray-50 border-gray-200 text-gray-400'}`
                  }>

                    <Landmark className="w-4 h-4" />
                    <span className="text-sm">Net Banking</span>
                    {selectedGateway.allowNetbanking ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  </div>
                  <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                  selectedGateway.allowUPI ?
                  'bg-green-50 border-green-200 text-green-700' :
                  'bg-gray-50 border-gray-200 text-gray-400'}`
                  }>

                    <Smartphone className="w-4 h-4" />
                    <span className="text-sm">UPI</span>
                    {selectedGateway.allowUPI ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  </div>
                  <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                  selectedGateway.allowWallet ?
                  'bg-green-50 border-green-200 text-green-700' :
                  'bg-gray-50 border-gray-200 text-gray-400'}`
                  }>

                    <Building2 className="w-4 h-4" />
                    <span className="text-sm">Wallet</span>
                    {selectedGateway.allowWallet ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500">Created</div>
                  <div className="text-sm font-medium">{formatDateTime(selectedGateway.createdAt).date}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500">Last Updated</div>
                  <div className="text-sm font-medium">{formatDateTime(selectedGateway.updatedAt).date}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500">Last Tested</div>
                  <div className="text-sm font-medium">
                    {selectedGateway.lastTestedAt ?
                  formatDateTime(selectedGateway.lastTestedAt).date :
                  'Never'}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-between sticky bottom-0">
              <Button
              variant="outline"
              onClick={() => handleTestConnection(selectedGateway)}
              disabled={isTesting === selectedGateway.id}>

                {isTesting === selectedGateway.id ?
              <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </> :

              <>
                    <Wifi className="w-4 h-4 mr-2" />
                    Test Connection
                  </>
              }
              </Button>
              <div className="flex gap-2">
                <Button
                variant="outline"
                onClick={() => {
                  setShowViewModal(false);
                  openEditModal(selectedGateway);
                }}>

                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                variant="outline"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedGateway(null);
                }}>

                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedGateway &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Delete Gateway</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg mb-4">
                <div className="font-medium text-gray-900">{selectedGateway.gatewayName}</div>
                <div className="text-sm text-gray-500">{selectedGateway.providerType}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {selectedGateway.transactionCount.toLocaleString()} transactions processed
                </div>
              </div>

              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-700">
                  <strong>Warning:</strong> Deleting this gateway will:
                </p>
                <ul className="text-sm text-red-600 mt-2 list-disc list-inside space-y-1">
                  <li>Disable all payment processing through this gateway</li>
                  <li>Remove all configuration and credentials</li>
                  <li>Historical transaction data will be preserved</li>
                </ul>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end gap-3">
              <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedGateway(null);
              }}>

                Cancel
              </Button>
              <Button
              variant="primary"
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteGateway}
              disabled={isSubmitting}>

                {isSubmitting ?
              <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </> :

              <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Gateway
                  </>
              }
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}