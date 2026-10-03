import React, { useState, useRef, useCallback } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import {
  Upload,
  FileSpreadsheet,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeftRight,
  Download,
  Trash2,
  RefreshCw,
  Eye,
  Check,
  X,
  Loader2,
  HelpCircle,
  Info,
  Calendar,
  IndianRupee,
  Hash,
  Building,
  CreditCard,
  FileCheck,
  Settings,
  Columns,
  Database,
  Zap,
  Clock,
  Search,
  Filter } from
'lucide-react';

type ImportStep = 1 | 2 | 3 | 4;
type FileType = 'csv' | 'xlsx' | 'xls';
type MappingStatus = 'mapped' | 'unmapped' | 'ignored';
type RowValidationStatus = 'valid' | 'warning' | 'error';

interface PaymentGateway {
  id: string;
  name: string;
  logo: string;
  supportedFormats: FileType[];
  expectedColumns: string[];
  lastImport: string | null;
  status: 'Active' | 'Inactive';
}

interface CSVColumn {
  index: number;
  originalName: string;
  sampleValues: string[];
}

interface ERPField {
  id: string;
  name: string;
  description: string;
  required: boolean;
  dataType: 'string' | 'number' | 'date' | 'currency';
  icon: React.ReactNode;
}

interface ColumnMapping {
  csvColumn: CSVColumn | null;
  erpField: ERPField;
  status: MappingStatus;
  transformation?: string;
}

interface ParsedRow {
  id: string;
  data: Record<string, string>;
  validationStatus: RowValidationStatus;
  validationMessages: string[];
  matchedTxnId: string | null;
  amount: number;
}

interface ImportSummary {
  totalRows: number;
  validRows: number;
  warningRows: number;
  errorRows: number;
  totalAmount: number;
  matchedTransactions: number;
  unmatchedTransactions: number;
  duplicates: number;
}

export function GatewaySettlementImport() {
  const [currentStep, setCurrentStep] = useState<ImportStep>(1);
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importComplete, setImportComplete] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [csvColumns, setCsvColumns] = useState<CSVColumn[]>([]);
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [importSummary, setImportSummary] = useState<ImportSummary | null>(null);
  const [expectedTotal, setExpectedTotal] = useState('');
  const [settlementDate, setSettlementDate] = useState('');
  const [settlementReference, setSettlementReference] = useState('');
  const [showAllRows, setShowAllRows] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | RowValidationStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showMappingHelp, setShowMappingHelp] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock payment gateways
  const paymentGateways: PaymentGateway[] = [
  {
    id: 'razorpay',
    name: 'Razorpay',
    logo: '/api/placeholder/120/40',
    supportedFormats: ['csv', 'xlsx'],
    expectedColumns: ['Payment ID', 'Order ID', 'Amount', 'Fee', 'Tax', 'Settlement Date', 'Status'],
    lastImport: '2024-03-14 10:30 AM',
    status: 'Active'
  },
  {
    id: 'payu',
    name: 'PayU',
    logo: '/api/placeholder/120/40',
    supportedFormats: ['csv', 'xlsx', 'xls'],
    expectedColumns: ['Transaction ID', 'Merchant Ref', 'Amount', 'Settled Amount', 'Date', 'UTR'],
    lastImport: '2024-03-10 02:15 PM',
    status: 'Active'
  },
  {
    id: 'paytm',
    name: 'Paytm Payment Gateway',
    logo: '/api/placeholder/120/40',
    supportedFormats: ['csv'],
    expectedColumns: ['Txn ID', 'Order ID', 'Amount', 'Settlement Amount', 'Settlement Date'],
    lastImport: '2024-03-08 11:45 AM',
    status: 'Active'
  },
  {
    id: 'ccavenue',
    name: 'CCAvenue',
    logo: '/api/placeholder/120/40',
    supportedFormats: ['csv', 'xlsx'],
    expectedColumns: ['Tracking ID', 'Order ID', 'Amount', 'Bank Ref', 'Date'],
    lastImport: null,
    status: 'Inactive'
  }];


  // ERP system fields for mapping
  const erpFields: ERPField[] = [
  {
    id: 'bank_ref_id',
    name: 'Bank Reference ID',
    description: 'Unique reference number from the bank/gateway',
    required: true,
    dataType: 'string',
    icon: <Hash className="w-4 h-4" />
  },
  {
    id: 'txn_id',
    name: 'Transaction ID',
    description: 'Original transaction ID in ERP system',
    required: true,
    dataType: 'string',
    icon: <FileText className="w-4 h-4" />
  },
  {
    id: 'gross_amount',
    name: 'Gross Amount',
    description: 'Total transaction amount before deductions',
    required: true,
    dataType: 'currency',
    icon: <IndianRupee className="w-4 h-4" />
  },
  {
    id: 'gateway_fee',
    name: 'Gateway Fee',
    description: 'Processing fee charged by gateway',
    required: false,
    dataType: 'currency',
    icon: <CreditCard className="w-4 h-4" />
  },
  {
    id: 'tax',
    name: 'Tax (GST)',
    description: 'Tax on gateway fee',
    required: false,
    dataType: 'currency',
    icon: <Building className="w-4 h-4" />
  },
  {
    id: 'net_amount',
    name: 'Net Settlement Amount',
    description: 'Final amount settled after deductions',
    required: true,
    dataType: 'currency',
    icon: <IndianRupee className="w-4 h-4" />
  },
  {
    id: 'settlement_date',
    name: 'Settlement Date',
    description: 'Date when amount was settled',
    required: true,
    dataType: 'date',
    icon: <Calendar className="w-4 h-4" />
  },
  {
    id: 'utr',
    name: 'UTR Number',
    description: 'Unique Transaction Reference from bank',
    required: false,
    dataType: 'string',
    icon: <Hash className="w-4 h-4" />
  }];


  // Mock CSV columns (simulating parsed file)
  const mockCSVColumns: CSVColumn[] = [
  { index: 0, originalName: 'Payment_ID', sampleValues: ['pay_abc123', 'pay_def456', 'pay_ghi789'] },
  { index: 1, originalName: 'Order_ID', sampleValues: ['TXN_001234', 'TXN_001235', 'TXN_001236'] },
  { index: 2, originalName: 'Gross_Amount', sampleValues: ['25000', '15000', '30000'] },
  { index: 3, originalName: 'Fee', sampleValues: ['500', '300', '600'] },
  { index: 4, originalName: 'GST', sampleValues: ['90', '54', '108'] },
  { index: 5, originalName: 'Net_Amount', sampleValues: ['24410', '14646', '29292'] },
  { index: 6, originalName: 'Settled_On', sampleValues: ['2024-03-15', '2024-03-15', '2024-03-15'] },
  { index: 7, originalName: 'UTR_No', sampleValues: ['UTR123456', 'UTR123457', 'UTR123458'] },
  { index: 8, originalName: 'Status', sampleValues: ['settled', 'settled', 'settled'] }];


  // Mock parsed rows
  const mockParsedRows: ParsedRow[] = [
  {
    id: '1',
    data: {
      Payment_ID: 'pay_abc123',
      Order_ID: 'TXN_001234',
      Gross_Amount: '25000',
      Fee: '500',
      GST: '90',
      Net_Amount: '24410',
      Settled_On: '2024-03-15',
      UTR_No: 'UTR123456',
      Status: 'settled'
    },
    validationStatus: 'valid',
    validationMessages: [],
    matchedTxnId: 'TXN_001234',
    amount: 24410
  },
  {
    id: '2',
    data: {
      Payment_ID: 'pay_def456',
      Order_ID: 'TXN_001235',
      Gross_Amount: '15000',
      Fee: '300',
      GST: '54',
      Net_Amount: '14646',
      Settled_On: '2024-03-15',
      UTR_No: 'UTR123457',
      Status: 'settled'
    },
    validationStatus: 'valid',
    validationMessages: [],
    matchedTxnId: 'TXN_001235',
    amount: 14646
  },
  {
    id: '3',
    data: {
      Payment_ID: 'pay_ghi789',
      Order_ID: 'TXN_001236',
      Gross_Amount: '30000',
      Fee: '600',
      GST: '108',
      Net_Amount: '29292',
      Settled_On: '2024-03-15',
      UTR_No: 'UTR123458',
      Status: 'settled'
    },
    validationStatus: 'warning',
    validationMessages: ['Transaction not found in ERP - will create new record'],
    matchedTxnId: null,
    amount: 29292
  },
  {
    id: '4',
    data: {
      Payment_ID: 'pay_jkl012',
      Order_ID: 'TXN_001237',
      Gross_Amount: '18000',
      Fee: '360',
      GST: '65',
      Net_Amount: '17575',
      Settled_On: '2024-03-15',
      UTR_No: 'UTR123459',
      Status: 'settled'
    },
    validationStatus: 'valid',
    validationMessages: [],
    matchedTxnId: 'TXN_001237',
    amount: 17575
  },
  {
    id: '5',
    data: {
      Payment_ID: 'pay_mno345',
      Order_ID: 'TXN_001238',
      Gross_Amount: '12000',
      Fee: '240',
      GST: '43',
      Net_Amount: '11717',
      Settled_On: '2024-03-15',
      UTR_No: 'UTR123460',
      Status: 'settled'
    },
    validationStatus: 'error',
    validationMessages: ['Duplicate entry - already imported on 2024-03-14'],
    matchedTxnId: 'TXN_001238',
    amount: 11717
  },
  {
    id: '6',
    data: {
      Payment_ID: 'pay_pqr678',
      Order_ID: 'TXN_001239',
      Gross_Amount: '22000',
      Fee: '440',
      GST: '79',
      Net_Amount: '21481',
      Settled_On: '2024-03-15',
      UTR_No: 'UTR123461',
      Status: 'settled'
    },
    validationStatus: 'valid',
    validationMessages: [],
    matchedTxnId: 'TXN_001239',
    amount: 21481
  },
  {
    id: '7',
    data: {
      Payment_ID: 'pay_stu901',
      Order_ID: 'TXN_001240',
      Gross_Amount: '8500',
      Fee: '170',
      GST: '31',
      Net_Amount: '8299',
      Settled_On: '2024-03-15',
      UTR_No: '',
      Status: 'settled'
    },
    validationStatus: 'warning',
    validationMessages: ['UTR Number is missing'],
    matchedTxnId: 'TXN_001240',
    amount: 8299
  }];


  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, []);

  // Handle file selection
  const handleFileSelect = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase() as FileType;

    if (!selectedGateway?.supportedFormats.includes(extension)) {
      alert(`Invalid file format. Please upload ${selectedGateway?.supportedFormats.join(' or ')} file.`);
      return;
    }

    setUploadedFile(file);
    parseFile(file);
  };

  // Parse file (mock)
  const parseFile = (file: File) => {
    setIsParsing(true);

    // Simulate parsing delay
    setTimeout(() => {
      setCsvColumns(mockCSVColumns);
      initializeMappings();
      setIsParsing(false);
      setCurrentStep(2);
    }, 1500);
  };

  // Initialize column mappings with auto-detection
  const initializeMappings = () => {
    const mappings: ColumnMapping[] = erpFields.map((field) => {
      // Auto-detect mapping based on column names
      let matchedColumn: CSVColumn | null = null;

      mockCSVColumns.forEach((col) => {
        const colLower = col.originalName.toLowerCase().replace(/[_-]/g, '');
        const fieldLower = field.name.toLowerCase().replace(/\s/g, '');

        if (colLower.includes(fieldLower) || fieldLower.includes(colLower)) {
          matchedColumn = col;
        }

        // Special cases
        if (field.id === 'bank_ref_id' && colLower.includes('payment')) matchedColumn = col;
        if (field.id === 'txn_id' && colLower.includes('order')) matchedColumn = col;
        if (field.id === 'gross_amount' && colLower === 'grossamount') matchedColumn = col;
        if (field.id === 'gateway_fee' && colLower === 'fee') matchedColumn = col;
        if (field.id === 'tax' && colLower === 'gst') matchedColumn = col;
        if (field.id === 'net_amount' && colLower.includes('net')) matchedColumn = col;
        if (field.id === 'settlement_date' && colLower.includes('settled')) matchedColumn = col;
        if (field.id === 'utr' && colLower.includes('utr')) matchedColumn = col;
      });

      return {
        csvColumn: matchedColumn,
        erpField: field,
        status: matchedColumn ? 'mapped' : field.required ? 'unmapped' : 'ignored'
      };
    });

    setColumnMappings(mappings);
  };

  // Update column mapping
  const updateMapping = (erpFieldId: string, csvColumnIndex: number | null) => {
    setColumnMappings((prev) =>
    prev.map((mapping) => {
      if (mapping.erpField.id === erpFieldId) {
        const newColumn = csvColumnIndex !== null ?
        csvColumns.find((c) => c.index === csvColumnIndex) || null :
        null;
        return {
          ...mapping,
          csvColumn: newColumn,
          status: newColumn ? 'mapped' : mapping.erpField.required ? 'unmapped' : 'ignored'
        };
      }
      return mapping;
    })
    );
  };

  // Toggle ignore status
  const toggleIgnore = (erpFieldId: string) => {
    setColumnMappings((prev) =>
    prev.map((mapping) => {
      if (mapping.erpField.id === erpFieldId && !mapping.erpField.required) {
        return {
          ...mapping,
          status: mapping.status === 'ignored' ? 'unmapped' : 'ignored',
          csvColumn: mapping.status === 'ignored' ? mapping.csvColumn : null
        };
      }
      return mapping;
    })
    );
  };

  // Validate mappings and proceed
  const validateAndProceed = () => {
    const errors: string[] = [];

    // Check required fields
    columnMappings.forEach((mapping) => {
      if (mapping.erpField.required && mapping.status !== 'mapped') {
        errors.push(`"${mapping.erpField.name}" is required but not mapped`);
      }
    });

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);
    setIsValidating(true);

    // Simulate validation
    setTimeout(() => {
      setParsedRows(mockParsedRows);
      calculateSummary();
      setIsValidating(false);
      setCurrentStep(3);
    }, 2000);
  };

  // Calculate import summary
  const calculateSummary = () => {
    const summary: ImportSummary = {
      totalRows: mockParsedRows.length,
      validRows: mockParsedRows.filter((r) => r.validationStatus === 'valid').length,
      warningRows: mockParsedRows.filter((r) => r.validationStatus === 'warning').length,
      errorRows: mockParsedRows.filter((r) => r.validationStatus === 'error').length,
      totalAmount: mockParsedRows.reduce((sum, r) => sum + r.amount, 0),
      matchedTransactions: mockParsedRows.filter((r) => r.matchedTxnId).length,
      unmatchedTransactions: mockParsedRows.filter((r) => !r.matchedTxnId).length,
      duplicates: mockParsedRows.filter((r) =>
      r.validationMessages.some((m) => m.includes('Duplicate'))
      ).length
    };
    setImportSummary(summary);
  };

  // Perform import
  const performImport = () => {
    // Validate expected total if provided
    if (expectedTotal) {
      const expected = parseFloat(expectedTotal);
      const actual = importSummary?.totalAmount || 0;

      if (Math.abs(expected - actual) > 0.01) {
        alert(`Amount mismatch! Expected: ₹${expected.toLocaleString()}, Found: ₹${actual.toLocaleString()}`);
        return;
      }
    }

    setIsImporting(true);

    // Simulate import
    setTimeout(() => {
      setIsImporting(false);
      setImportComplete(true);
      setCurrentStep(4);
    }, 3000);
  };

  // Reset and start over
  const handleStartNew = () => {
    setCurrentStep(1);
    setSelectedGateway(null);
    setUploadedFile(null);
    setCsvColumns([]);
    setColumnMappings([]);
    setParsedRows([]);
    setImportSummary(null);
    setExpectedTotal('');
    setSettlementDate('');
    setSettlementReference('');
    setValidationErrors([]);
    setImportComplete(false);
  };

  // Get file size string
  const getFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Get validation status icon
  const getStatusIcon = (status: RowValidationStatus) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  // Get mapping status badge
  const getMappingBadge = (status: MappingStatus) => {
    switch (status) {
      case 'mapped':
        return <Badge variant="success">Mapped</Badge>;
      case 'unmapped':
        return <Badge variant="danger">Unmapped</Badge>;
      case 'ignored':
        return <Badge variant="secondary">Ignored</Badge>;
    }
  };

  // Filter rows
  const filteredRows = parsedRows.filter((row) => {
    if (filterStatus !== 'all' && row.validationStatus !== filterStatus) return false;
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return Object.values(row.data).some((v) => v.toLowerCase().includes(searchLower));
    }
    return true;
  });

  // Step indicator
  const StepIndicator = () =>
  <div className="flex items-center justify-center mb-8">
      {[
    { step: 1, label: 'Upload File' },
    { step: 2, label: 'Map Columns' },
    { step: 3, label: 'Review & Validate' },
    { step: 4, label: 'Complete' }].
    map((item, index) =>
    <React.Fragment key={item.step}>
          <div className="flex flex-col items-center">
            <div
          className={`flex items-center justify-center w-10 h-10 rounded-full font-medium transition-all ${
          item.step === currentStep ?
          'bg-blue-600 text-white' :
          item.step < currentStep ?
          'bg-green-500 text-white' :
          'bg-gray-200 text-gray-500'}`
          }>

              {item.step < currentStep ?
          <Check className="w-5 h-5" /> :

          item.step
          }
            </div>
            <span
          className={`text-xs mt-2 ${
          item.step === currentStep ?
          'text-blue-600 font-medium' :
          'text-gray-500'}`
          }>

              {item.label}
            </span>
          </div>
          {index < 3 &&
      <div
        className={`w-24 h-1 mx-2 mt-[-20px] rounded ${
        item.step < currentStep ? 'bg-green-500' : 'bg-gray-200'}`
        } />

      }
        </React.Fragment>
    )}
    </div>;


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gateway Settlement Import
          </h1>
          <p className="text-sm text-gray-500">
            Import and reconcile settlement files from payment gateways
          </p>
        </div>
        {currentStep > 1 && !importComplete &&
        <Button variant="outline" onClick={handleStartNew}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Start Over
          </Button>
        }
      </div>

      {/* Step Indicator */}
      <Card className="p-6">
        <StepIndicator />
      </Card>

      {/* Step 1: Select Gateway & Upload File */}
      {currentStep === 1 &&
      <div className="space-y-6">
          {/* Gateway Selection */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Select Payment Gateway
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {paymentGateways.map((gateway) =>
            <div
              key={gateway.id}
              onClick={() => gateway.status === 'Active' && setSelectedGateway(gateway)}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              gateway.status === 'Inactive' ?
              'opacity-50 cursor-not-allowed bg-gray-50' :
              selectedGateway?.id === gateway.id ?
              'border-blue-500 bg-blue-50' :
              'border-gray-200 hover:border-blue-300'}`
              }>

                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{gateway.name}</h3>
                    {selectedGateway?.id === gateway.id &&
                <CheckCircle className="w-5 h-5 text-blue-600" />
                }
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FileSpreadsheet className="w-3 h-3" />
                      <span>
                        Formats: {gateway.supportedFormats.map((f) => f.toUpperCase()).join(', ')}
                      </span>
                    </div>
                    {gateway.lastImport &&
                <div className="flex items-center gap-2 text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>Last: {gateway.lastImport}</span>
                      </div>
                }
                    <Badge
                  variant={gateway.status === 'Active' ? 'success' : 'secondary'}
                  className="mt-2">

                      {gateway.status}
                    </Badge>
                  </div>
                </div>
            )}
            </div>
          </Card>

          {/* File Upload */}
          {selectedGateway &&
        <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                Upload Settlement File
              </h2>

              {/* Expected Columns Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      Expected columns from {selectedGateway.name}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedGateway.expectedColumns.map((col, idx) =>
                  <span
                    key={idx}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">

                          {col}
                        </span>
                  )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Drop Zone */}
              <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
            dragActive ?
            'border-blue-500 bg-blue-50' :
            uploadedFile ?
            'border-green-400 bg-green-50' :
            'border-gray-300 hover:border-gray-400'}`
            }>

                <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept={selectedGateway.supportedFormats.map((f) => `.${f}`).join(',')}
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} />


                {isParsing ?
            <div className="flex flex-col items-center">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                    <p className="text-lg font-medium text-gray-900">Parsing file...</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Analyzing columns and data structure
                    </p>
                  </div> :
            uploadedFile ?
            <div className="flex flex-col items-center">
                    <FileCheck className="w-12 h-12 text-green-600 mb-4" />
                    <p className="text-lg font-medium text-gray-900">{uploadedFile.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {getFileSize(uploadedFile.size)} • Ready to parse
                    </p>
                    <div className="flex gap-3 mt-4">
                      <Button
                  variant="outline"
                  onClick={() => {
                    setUploadedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}>

                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                      <Button variant="primary" onClick={() => parseFile(uploadedFile)}>
                        <Zap className="w-4 h-4 mr-2" />
                        Parse & Continue
                      </Button>
                    </div>
                  </div> :

            <div className="flex flex-col items-center">
                    <Upload className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-900">
                      Drop your settlement file here
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      or click to browse •{' '}
                      {selectedGateway.supportedFormats.map((f) => f.toUpperCase()).join(', ')} supported
                    </p>
                    <Button
                variant="outline"
                className="mt-4"
                onClick={() => fileInputRef.current?.click()}>

                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                      Browse Files
                    </Button>
                  </div>
            }
              </div>
            </Card>
        }
        </div>
      }

      {/* Step 2: Column Mapping */}
      {currentStep === 2 &&
      <div className="space-y-6">
          {/* File Info Bar */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <FileSpreadsheet className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">{uploadedFile?.name}</p>
                  <p className="text-sm text-gray-600">
                    {csvColumns.length} columns detected • {selectedGateway?.name}
                  </p>
                </div>
              </div>
              <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMappingHelp(!showMappingHelp)}>

                <HelpCircle className="w-4 h-4 mr-2" />
                Mapping Help
              </Button>
            </div>
          </Card>

          {/* Mapping Help */}
          {showMappingHelp &&
        <Card className="p-4 bg-yellow-50 border-yellow-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800 mb-2">
                    How to map columns
                  </p>
                  <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                    <li>Required fields (marked with *) must be mapped to proceed</li>
                    <li>System auto-detects mappings based on column names</li>
                    <li>Review sample values to ensure correct mapping</li>
                    <li>Optional fields can be ignored if not present in file</li>
                  </ul>
                </div>
              </div>
            </Card>
        }

          {/* Validation Errors */}
          {validationErrors.length > 0 &&
        <Card className="p-4 bg-red-50 border-red-200">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800 mb-2">
                    Please fix the following errors
                  </p>
                  <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                    {validationErrors.map((error, idx) =>
                <li key={idx}>{error}</li>
                )}
                  </ul>
                </div>
              </div>
            </Card>
        }

          {/* Column Mapping Interface */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Columns className="w-5 h-5 text-blue-600" />
                Map Columns to ERP Fields
              </h2>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  Mapped: {columnMappings.filter((m) => m.status === 'mapped').length}
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  Unmapped: {columnMappings.filter((m) => m.status === 'unmapped').length}
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                  Ignored: {columnMappings.filter((m) => m.status === 'ignored').length}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {columnMappings.map((mapping) =>
            <div
              key={mapping.erpField.id}
              className={`border rounded-lg p-4 transition-all ${
              mapping.status === 'unmapped' && mapping.erpField.required ?
              'border-red-300 bg-red-50' :
              mapping.status === 'mapped' ?
              'border-green-300 bg-green-50' :
              'border-gray-200'}`
              }>

                  <div className="flex items-center gap-6">
                    {/* ERP Field */}
                    <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="p-1.5 bg-gray-100 rounded">
                          {mapping.erpField.icon}
                        </div>
                        <span className="font-medium text-gray-900">
                          {mapping.erpField.name}
                          {mapping.erpField.required &&
                      <span className="text-red-500 ml-1">*</span>
                      }
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 ml-8">
                        {mapping.erpField.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="flex-shrink-0">
                      <ArrowLeftRight className="w-5 h-5 text-gray-400" />
                    </div>

                    {/* CSV Column Dropdown */}
                    <div className="flex-1 min-w-[250px]">
                      <Select
                    className="w-full"
                    value={mapping.csvColumn?.index.toString() || ''}
                    onChange={(e) =>
                    updateMapping(
                      mapping.erpField.id,
                      e.target.value ? parseInt(e.target.value) : null
                    )
                    }
                    disabled={mapping.status === 'ignored'}
                    options={[
                    { value: '', label: '-- Select Column --' },
                    ...csvColumns.map((col) => ({
                      value: col.index.toString(),
                      label: col.originalName
                    }))]
                    } />

                      {mapping.csvColumn &&
                  <div className="mt-2 px-2 py-1 bg-gray-100 rounded text-xs">
                          <span className="text-gray-500">Sample: </span>
                          <span className="text-gray-700">
                            {mapping.csvColumn.sampleValues.slice(0, 2).join(', ')}
                          </span>
                        </div>
                  }
                    </div>

                    {/* Status & Actions */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {getMappingBadge(mapping.status)}
                      {!mapping.erpField.required &&
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleIgnore(mapping.erpField.id)}
                    title={mapping.status === 'ignored' ? 'Include field' : 'Ignore field'}>

                          {mapping.status === 'ignored' ?
                    <Eye className="w-4 h-4" /> :

                    <X className="w-4 h-4" />
                    }
                        </Button>
                  }
                    </div>
                  </div>
                </div>
            )}
            </div>

            {/* Unmapped CSV Columns */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Unmapped CSV Columns (will be ignored)
              </h3>
              <div className="flex flex-wrap gap-2">
                {csvColumns.
              filter(
                (col) =>
                !columnMappings.some(
                  (m) => m.csvColumn?.index === col.index
                )
              ).
              map((col) =>
              <span
                key={col.index}
                className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-full">

                      {col.originalName}
                    </span>
              )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-between items-center pt-6 border-t">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Back to Upload
              </Button>
              <Button
              variant="primary"
              onClick={validateAndProceed}
              disabled={isValidating}>

                {isValidating ?
              <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Validating...
                  </> :

              <>
                    Validate & Preview
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
              }
              </Button>
            </div>
          </Card>
        </div>
      }

      {/* Step 3: Review & Validate */}
      {currentStep === 3 && importSummary &&
      <div className="space-y-6">
          {/* Validation Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 border-l-4 border-l-blue-500">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Rows</p>
                  <p className="text-xl font-bold text-gray-900">
                    {importSummary.totalRows}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-l-green-500">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Valid</p>
                  <p className="text-xl font-bold text-gray-900">
                    {importSummary.validRows}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-l-yellow-500">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Warnings</p>
                  <p className="text-xl font-bold text-gray-900">
                    {importSummary.warningRows}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-l-red-500">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Errors</p>
                  <p className="text-xl font-bold text-gray-900">
                    {importSummary.errorRows}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Amount Validation */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-blue-600" />
              Amount Validation
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Settlement Amount (Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    ₹
                  </span>
                  <Input
                  type="number"
                  placeholder="Enter expected total from bank statement"
                  value={expectedTotal}
                  onChange={(e) => setExpectedTotal(e.target.value)}
                  className="pl-8" />

                </div>
                <p className="text-xs text-gray-500 mt-1">
                  System will validate against sum of all rows
                </p>
              </div>

              <div className="flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-gray-400" />
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Calculated Total from File</p>
                <p className="text-2xl font-bold text-blue-600">
                  ₹{importSummary.totalAmount.toLocaleString()}
                </p>
                {expectedTotal &&
              <div className="mt-2">
                    {Math.abs(parseFloat(expectedTotal) - importSummary.totalAmount) < 0.01 ?
                <Badge variant="success" className="flex items-center gap-1 w-fit">
                        <CheckCircle className="w-3 h-3" />
                        Amount Matches
                      </Badge> :

                <Badge variant="danger" className="flex items-center gap-1 w-fit">
                        <XCircle className="w-3 h-3" />
                        Difference: ₹
                        {Math.abs(
                    parseFloat(expectedTotal) - importSummary.totalAmount
                  ).toLocaleString()}
                      </Badge>
                }
                  </div>
              }
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Settlement Date
                </label>
                <Input
                type="date"
                value={settlementDate}
                onChange={(e) => setSettlementDate(e.target.value)} />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Settlement Reference / UTR
                </label>
                <Input
                placeholder="Enter bank settlement reference"
                value={settlementReference}
                onChange={(e) => setSettlementReference(e.target.value)} />

              </div>
            </div>
          </Card>

          {/* Data Preview */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                Data Preview
              </h3>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                  placeholder="Search rows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-48" />

                </div>
                <Select
                className="w-40"
                value={filterStatus}
                onChange={(e) =>
                setFilterStatus(e.target.value as 'all' | RowValidationStatus)
                }
                options={[
                { value: 'all', label: 'All Rows' },
                { value: 'valid', label: 'Valid Only' },
                { value: 'warning', label: 'Warnings Only' },
                { value: 'error', label: 'Errors Only' }]
                } />

              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 font-medium text-gray-700">Status</th>
                    <th className="text-left p-3 font-medium text-gray-700">Payment ID</th>
                    <th className="text-left p-3 font-medium text-gray-700">Order/Txn ID</th>
                    <th className="text-right p-3 font-medium text-gray-700">Gross Amount</th>
                    <th className="text-right p-3 font-medium text-gray-700">Fee</th>
                    <th className="text-right p-3 font-medium text-gray-700">Net Amount</th>
                    <th className="text-left p-3 font-medium text-gray-700">Settlement Date</th>
                    <th className="text-left p-3 font-medium text-gray-700">ERP Match</th>
                    <th className="text-left p-3 font-medium text-gray-700">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {(showAllRows ? filteredRows : filteredRows.slice(0, 5)).map(
                  (row) =>
                  <tr
                    key={row.id}
                    className={`border-b ${
                    row.validationStatus === 'error' ?
                    'bg-red-50' :
                    row.validationStatus === 'warning' ?
                    'bg-yellow-50' :
                    ''}`
                    }>

                        <td className="p-3">
                          {getStatusIcon(row.validationStatus)}
                        </td>
                        <td className="p-3 font-mono text-xs">
                          {row.data.Payment_ID}
                        </td>
                        <td className="p-3 font-mono text-xs">
                          {row.data.Order_ID}
                        </td>
                        <td className="p-3 text-right">
                          ₹{parseInt(row.data.Gross_Amount).toLocaleString()}
                        </td>
                        <td className="p-3 text-right text-gray-600">
                          ₹{parseInt(row.data.Fee).toLocaleString()}
                        </td>
                        <td className="p-3 text-right font-medium">
                          ₹{parseInt(row.data.Net_Amount).toLocaleString()}
                        </td>
                        <td className="p-3">{row.data.Settled_On}</td>
                        <td className="p-3">
                          {row.matchedTxnId ?
                      <Badge variant="success" className="text-xs">
                              Matched
                            </Badge> :

                      <Badge variant="warning" className="text-xs">
                              New
                            </Badge>
                      }
                        </td>
                        <td className="p-3">
                          {row.validationMessages.length > 0 &&
                      <span
                        className={`text-xs ${
                        row.validationStatus === 'error' ?
                        'text-red-600' :
                        'text-yellow-600'}`
                        }>

                              {row.validationMessages[0]}
                            </span>
                      }
                        </td>
                      </tr>

                )}
                </tbody>
              </table>
            </div>

            {filteredRows.length > 5 &&
          <div className="mt-4 text-center">
                <Button
              variant="ghost"
              onClick={() => setShowAllRows(!showAllRows)}>

                  {showAllRows ?
              <>
                      <ChevronUp className="w-4 h-4 mr-2" />
                      Show Less
                    </> :

              <>
                      <ChevronDown className="w-4 h-4 mr-2" />
                      Show All {filteredRows.length} Rows
                    </>
              }
                </Button>
              </div>
          }
          </Card>

          {/* Import Summary & Actions */}
          <Card className="p-6 bg-gray-50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">Import Summary</h3>
              <div className="flex items-center gap-4 text-sm">
                <span>
                  Matched: <strong>{importSummary.matchedTransactions}</strong>
                </span>
                <span>
                  Unmatched: <strong>{importSummary.unmatchedTransactions}</strong>
                </span>
                <span>
                  Duplicates: <strong className="text-red-600">{importSummary.duplicates}</strong>
                </span>
              </div>
            </div>

            {importSummary.errorRows > 0 &&
          <div className="bg-red-100 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">
                      {importSummary.errorRows} row(s) have errors
                    </p>
                    <p className="text-sm text-red-700 mt-1">
                      Error rows will be skipped during import. You can download
                      the error report for review.
                    </p>
                    <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 border-red-300 text-red-700 hover:bg-red-50">

                      <Download className="w-4 h-4 mr-2" />
                      Download Error Report
                    </Button>
                  </div>
                </div>
              </div>
          }

            <div className="flex justify-between items-center pt-4 border-t">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                Back to Mapping
              </Button>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Preview
                </Button>
                <Button
                variant="primary"
                onClick={performImport}
                disabled={isImporting}>

                  {isImporting ?
                <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Importing...
                    </> :

                <>
                      <Database className="w-4 h-4 mr-2" />
                      Import {importSummary.validRows + importSummary.warningRows} Records
                    </>
                }
                </Button>
              </div>
            </div>
          </Card>
        </div>
      }

      {/* Step 4: Import Complete */}
      {currentStep === 4 && importComplete && importSummary &&
      <div className="space-y-6">
          {/* Success Banner */}
          <Card className="p-8 bg-green-50 border-green-200 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              Import Completed Successfully!
            </h2>
            <p className="text-green-600">
              Settlement data has been imported and reconciled with ERP transactions
            </p>
          </Card>

          {/* Import Results */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {importSummary.validRows + importSummary.warningRows}
              </p>
              <p className="text-sm text-gray-500">Records Imported</p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <IndianRupee className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                ₹{importSummary.totalAmount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Total Settlement Amount</p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {importSummary.matchedTransactions}
              </p>
              <p className="text-sm text-gray-500">Transactions Reconciled</p>
            </Card>
          </div>

          {/* Detailed Results */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Import Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Gateway</span>
                  <span className="font-medium">{selectedGateway?.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">File Name</span>
                  <span className="font-medium">{uploadedFile?.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Import Date</span>
                  <span className="font-medium">
                    {new Date().toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Settlement Reference</span>
                  <span className="font-medium">
                    {settlementReference || '-'}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Total Rows Processed</span>
                  <span className="font-medium">{importSummary.totalRows}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Successfully Imported</span>
                  <span className="font-medium text-green-600">
                    {importSummary.validRows + importSummary.warningRows}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Skipped (Errors)</span>
                  <span className="font-medium text-red-600">
                    {importSummary.errorRows}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">New Records Created</span>
                  <span className="font-medium">
                    {importSummary.unmatchedTransactions}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Next Actions */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Next Steps</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="justify-start h-auto py-4">
                <div className="flex items-start gap-3 text-left">
                  <Eye className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium">View Imported Records</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Review all imported settlement entries
                    </p>
                  </div>
                </div>
              </Button>

              <Button variant="outline" className="justify-start h-auto py-4">
                <div className="flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Review Unmatched</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {importSummary.unmatchedTransactions} transactions need attention
                    </p>
                  </div>
                </div>
              </Button>

              <Button variant="outline" className="justify-start h-auto py-4">
                <div className="flex items-start gap-3 text-left">
                  <Download className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Download Report</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Export detailed import report
                    </p>
                  </div>
                </div>
              </Button>
            </div>

            <div className="flex justify-center mt-8">
              <Button variant="primary" onClick={handleStartNew}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Import Another Settlement File
              </Button>
            </div>
          </Card>
        </div>
      }
    </div>);

}