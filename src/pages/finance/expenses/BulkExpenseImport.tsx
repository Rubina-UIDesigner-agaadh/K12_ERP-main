// src/features/expenses/components/BulkExpenseImport.tsx

import React, { useState, useRef, ChangeEvent } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  UploadCloud,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  X,
  FileCheck,
  Play,
  Trash2,
  Info,
  AlertTriangle,
  Calendar,
  Building2,
  DollarSign,
  Hash,
  Edit3,
  RefreshCw,
  FileText,
  ChevronDown,
  ChevronUp,
  Filter,
  Search } from
'lucide-react';

// Type definitions for better type safety
interface ImportRow {
  id: number;
  date: string;
  vendor: string;
  head: string;
  amount: number;
  refNo: string;
  status: 'valid' | 'error' | 'warning';
  error: string;
  warnings?: string[];
  originalData?: any;
}

interface ValidationStats {
  total: number;
  valid: number;
  errors: number;
  warnings: number;
  totalAmount: number;
  validAmount: number;
}

interface ColumnMapping {
  systemColumn: string;
  csvColumn: string;
  required: boolean;
  description: string;
}

export function BulkExpenseImport() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [importData, setImportData] = useState<ImportRow[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [showErrorsOnly, setShowErrorsOnly] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Column mappings definition
  const columnMappings: ColumnMapping[] = [
  { systemColumn: 'Date', csvColumn: 'date', required: true, description: 'Transaction date (YYYY-MM-DD)' },
  { systemColumn: 'Vendor', csvColumn: 'vendor_name', required: true, description: 'Vendor/Supplier name' },
  { systemColumn: 'Expense Head', csvColumn: 'expense_category', required: true, description: 'Category of expense' },
  { systemColumn: 'Amount', csvColumn: 'amount', required: true, description: 'Transaction amount (numeric)' },
  { systemColumn: 'Reference No', csvColumn: 'reference_number', required: true, description: 'Unique transaction ID' },
  { systemColumn: 'Description', csvColumn: 'description', required: false, description: 'Optional notes' },
  { systemColumn: 'Payment Mode', csvColumn: 'payment_method', required: false, description: 'Cash/Card/Bank Transfer' }];


  // Simulate detailed file upload and validation
  const handleFileUpload = (event?: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
    }

    setIsProcessing(true);

    // Simulating more comprehensive file parsing and validation
    setTimeout(() => {
      const mockData: ImportRow[] = [
      {
        id: 1,
        date: '2024-03-20',
        vendor: 'Global Electricity Services Ltd.',
        head: 'Electricity',
        amount: 15000,
        refNo: 'TXN-991-2024',
        status: 'valid',
        error: '',
        warnings: ['Vendor name exceeds 50 characters']
      },
      {
        id: 2,
        date: '2024-03-22',
        vendor: '',
        head: 'Building Maintenance',
        amount: 4500,
        refNo: 'TXN-992-2024',
        status: 'error',
        error: 'Vendor Name is required - cannot be empty'
      },
      {
        id: 3,
        date: '2024-04-32',
        vendor: 'Amazon Business Office Supplies',
        head: 'Stationery & Office Supplies',
        amount: 2100,
        refNo: 'TXN-993-2024',
        status: 'error',
        error: 'Invalid Date format - day 32 does not exist'
      },
      {
        id: 4,
        date: '2024-03-25',
        vendor: 'City Professional Cleaners Inc.',
        head: 'Cleaning Services',
        amount: -500,
        refNo: 'TXN-994-2024',
        status: 'error',
        error: 'Amount must be positive - negative values not allowed'
      },
      {
        id: 5,
        date: '2024-03-26',
        vendor: 'Municipal Water Board',
        head: 'Utilities - Water',
        amount: 3200,
        refNo: 'TXN-995-2024',
        status: 'valid',
        error: ''
      },
      {
        id: 6,
        date: '2024-03-28',
        vendor: 'Telecom Services Provider',
        head: 'Telephone & Internet',
        amount: 8750,
        refNo: 'TXN-996-2024',
        status: 'valid',
        error: '',
        warnings: ['Amount is higher than usual for this category']
      },
      {
        id: 7,
        date: '2024-03-15',
        vendor: 'Office Furniture & Fixtures Co.',
        head: 'Furniture',
        amount: 45000,
        refNo: 'TXN-997-2024',
        status: 'warning',
        error: '',
        warnings: ['Large transaction - may require additional approval', 'Vendor not in approved list']
      },
      {
        id: 8,
        date: '2024-03-30',
        vendor: 'Quick Courier Services',
        head: 'Courier & Delivery',
        amount: 1250,
        refNo: 'TXN-998-2024',
        status: 'valid',
        error: ''
      },
      {
        id: 9,
        date: '2024-13-01',
        vendor: 'Security Systems Ltd.',
        head: 'Security',
        amount: 12000,
        refNo: 'TXN-999-2024',
        status: 'error',
        error: 'Invalid Date format - month 13 does not exist'
      },
      {
        id: 10,
        date: '2024-03-18',
        vendor: 'Travel Agency Services',
        head: 'Travel & Transportation',
        amount: 0,
        refNo: 'TXN-1000-2024',
        status: 'error',
        error: 'Amount cannot be zero'
      }];


      setImportData(mockData);
      setIsProcessing(false);
      setCurrentStep(3);
    }, 2000);
  };

  // Calculate validation statistics
  const calculateStats = (): ValidationStats => {
    const filteredData = getFilteredData();
    return {
      total: importData.length,
      valid: importData.filter((d) => d.status === 'valid').length,
      errors: importData.filter((d) => d.status === 'error').length,
      warnings: importData.filter((d) => d.status === 'warning').length,
      totalAmount: importData.reduce((sum, d) => sum + (d.amount > 0 ? d.amount : 0), 0),
      validAmount: importData.filter((d) => d.status === 'valid').reduce((sum, d) => sum + d.amount, 0)
    };
  };

  // Filter data based on search and error filter
  const getFilteredData = (): ImportRow[] => {
    let filtered = importData;

    if (showErrorsOnly) {
      filtered = filtered.filter((d) => d.status === 'error');
    }

    if (searchTerm) {
      filtered = filtered.filter((d) =>
      d.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.head.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.refNo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  // Delete row handler
  const handleDeleteRow = (id: number) => {
    setImportData((prev) => prev.filter((d) => d.id !== id));
  };

  // Toggle row expansion
  const toggleRowExpansion = (id: number) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Download template handler
  const handleDownloadTemplate = () => {
    // In real implementation, this would generate and download a CSV file
    const csvContent = columnMappings.map((col) => col.csvColumn).join(',') + '\n' +
    'sample_data_row_1,sample_data_row_2,...';

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expense_import_template.csv';
    a.click();

    setCurrentStep(2);
  };

  // Import valid records
  const handleImportRecords = () => {
    const validRecords = importData.filter((d) => d.status === 'valid');
    console.log('Importing records:', validRecords);
    // Here you would call your API to import the data
    alert(`Successfully imported ${validRecords.length} expense records!`);
  };

  // Export errors to CSV
  const handleExportErrors = () => {
    const errorRecords = importData.filter((d) => d.status === 'error');
    console.log('Exporting error records:', errorRecords);
    alert(`Exporting ${errorRecords.length} records with errors for correction`);
  };

  const stats = calculateStats();
  const filteredData = getFilteredData();

  // Enhanced table columns with more detail
  const columns = [
  {
    key: 'expand',
    header: '',
    render: (row: ImportRow) =>
    <button
      onClick={() => toggleRowExpansion(row.id)}
      className="p-1 hover:bg-gray-100 rounded transition-colors">

          {expandedRows.has(row.id) ?
      <ChevronUp className="w-4 h-4 text-gray-400" /> :

      <ChevronDown className="w-4 h-4 text-gray-400" />
      }
        </button>

  },
  {
    key: 'date',
    header: 'Date',
    render: (row: ImportRow) =>
    <div className="flex items-center gap-2">
          <Calendar className={`w-4 h-4 ${row.error.includes('Date') ? 'text-red-500' : 'text-gray-400'}`} />
          <span className={`text-sm font-medium ${row.error.includes('Date') ? 'text-red-600 line-through' : 'text-gray-700'}`}>
            {row.date}
          </span>
        </div>

  },
  {
    key: 'vendor',
    header: 'Vendor Name',
    render: (row: ImportRow) =>
    <div className="max-w-[200px]">
          {row.vendor ?
      <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
              <span className={`text-sm font-medium truncate ${row.error.includes('Vendor') ? 'text-red-600' : 'text-gray-900'}`} title={row.vendor}>
                {row.vendor}
              </span>
            </div> :

      <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                MISSING
              </span>
            </div>
      }
        </div>

  },
  {
    key: 'head',
    header: 'Expense Head',
    render: (row: ImportRow) =>
    <Badge variant="secondary" className="text-xs font-semibold">
          {row.head}
        </Badge>

  },
  {
    key: 'amount',
    header: 'Amount',
    render: (row: ImportRow) =>
    <div className="flex items-center gap-2">
          <DollarSign className={`w-4 h-4 ${row.amount < 0 ? 'text-red-500' : 'text-green-500'}`} />
          <span className={`text-sm font-bold ${row.amount < 0 ? 'text-red-600' : 'text-gray-900'}`}>
            ₹{Math.abs(row.amount).toLocaleString('en-IN')}
          </span>
        </div>

  },
  {
    key: 'ref',
    header: 'Reference No',
    render: (row: ImportRow) =>
    <div className="flex items-center gap-2">
          <Hash className="w-3 h-3 text-gray-400" />
          <span className="font-mono text-xs text-gray-600">{row.refNo}</span>
        </div>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: ImportRow) =>
    <div className="space-y-1">
          {row.status === 'valid' ?
      <div className="flex items-center gap-1.5 text-green-600">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Valid</span>
            </div> :
      row.status === 'warning' ?
      <div className="flex items-center gap-1.5 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Warning</span>
            </div> :

      <div className="flex items-center gap-1.5 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Error</span>
            </div>
      }
          {row.warnings && row.warnings.length > 0 &&
      <div className="text-[10px] text-amber-600">
              {row.warnings.length} warning(s)
            </div>
      }
        </div>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: ImportRow) =>
    <div className="flex items-center gap-1">
          <Button
        variant="ghost"
        size="sm"
        onClick={() => handleDeleteRow(row.id)}
        className="hover:bg-red-50">

            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
          </Button>
          <Button
        variant="ghost"
        size="sm"
        className="hover:bg-blue-50">

            <Edit3 className="w-4 h-4 text-gray-400 hover:text-blue-500" />
          </Button>
        </div>

  }];


  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-6">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <FileSpreadsheet className="w-8 h-8 text-green-600" />
            Bulk Expense Import
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Fast-track data entry via bank statements, Excel logs, or accounting software exports
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Enhanced Steps Indicator */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-2xl border-2 border-gray-200 shadow-sm">
            {[
            { step: 1, label: 'Template', icon: Download },
            { step: 2, label: 'Upload', icon: UploadCloud },
            { step: 3, label: 'Validate', icon: FileCheck }].
            map(({ step, label, icon: Icon }) =>
            <div key={step} className="flex items-center gap-2">
                <div
                className={`
                    relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300
                    ${currentStep === step ?
                'bg-indigo-600 text-white shadow-lg scale-105' :
                currentStep > step ?
                'bg-green-500 text-white' :
                'bg-white text-gray-400 border border-gray-200'}
                  `}>

                  <div className="flex items-center gap-2">
                    {currentStep > step ?
                  <CheckCircle2 className="w-4 h-4" /> :

                  <Icon className="w-4 h-4" />
                  }
                    <span className="text-xs font-bold">{label}</span>
                  </div>
                </div>
                {step < 3 && <ArrowRight className="w-4 h-4 text-gray-300" />}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Banner - Shown when data is loaded */}
      {currentStep === 3 && importData.length > 0 &&
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">Total Rows</p>
                <p className="text-2xl font-black text-blue-900 mt-1">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-300" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-green-600 uppercase tracking-wide">Valid</p>
                <p className="text-2xl font-black text-green-900 mt-1">{stats.valid}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-300" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wide">Warnings</p>
                <p className="text-2xl font-black text-amber-900 mt-1">{stats.warnings}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-amber-300" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-red-600 uppercase tracking-wide">Errors</p>
                <p className="text-2xl font-black text-red-900 mt-1">{stats.errors}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-300" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-purple-600 uppercase tracking-wide">Valid Amount</p>
                <p className="text-xl font-black text-purple-900 mt-1">₹{stats.validAmount.toLocaleString('en-IN')}</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-300" />
            </div>
          </Card>
        </div>
      }

      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar - Step-by-Step Wizard */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          
          {/* Step 1: Download Template */}
          <Card className={`
            p-6 transition-all duration-300 border-l-4 
            ${currentStep === 1 ?
          'border-l-indigo-600 ring-2 ring-indigo-100 shadow-xl bg-white' :
          'border-l-gray-200 opacity-70 hover:opacity-100'}
          `}>
            <div className="flex items-start gap-4 mb-4">
              <div className={`
                p-3 rounded-xl transition-colors
                ${currentStep === 1 ? 'bg-indigo-100' : 'bg-gray-100'}
              `}>
                <Download className={`w-6 h-6 ${currentStep === 1 ? 'text-indigo-600' : 'text-gray-400'}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900">Step 1: Download Template</h3>
                  {currentStep > 1 && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Get our standardized CSV template with all required columns pre-configured
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full bg-white hover:bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold"
                onClick={handleDownloadTemplate}>

                <Download className="w-4 h-4 mr-2" /> 
                Download CSV Template
              </Button>

              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Template Includes:
                </p>
                <div className="space-y-1">
                  {columnMappings.slice(0, 5).map((col) =>
                  <div key={col.csvColumn} className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${col.required ? 'bg-red-400' : 'bg-gray-300'}`} />
                      <span className="text-xs text-gray-600 font-mono">{col.csvColumn}</span>
                      {col.required &&
                    <span className="text-[9px] text-red-500 font-bold">*</span>
                    }
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Step 2: Upload File */}
          <Card className={`
            p-6 transition-all duration-300 border-l-4 
            ${currentStep === 2 ?
          'border-l-indigo-600 ring-2 ring-indigo-100 shadow-xl bg-white' :
          'border-l-gray-200 opacity-70 hover:opacity-100'}
          `}>
            <div className="flex items-start gap-4 mb-4">
              <div className={`
                p-3 rounded-xl transition-colors
                ${currentStep === 2 ? 'bg-indigo-100' : 'bg-gray-100'}
              `}>
                <UploadCloud className={`w-6 h-6 ${currentStep === 2 ? 'text-indigo-600' : 'text-gray-400'}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900">Step 2: Upload CSV File</h3>
                  {currentStep > 2 && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Upload your completed CSV file for automatic validation
                </p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden" />


            <div
              className={`
                border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer
                ${isProcessing ?
              'border-indigo-300 bg-indigo-50' :
              'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/30'}
              `}
              onClick={() => !isProcessing && fileInputRef.current?.click()}>

              {isProcessing ?
              <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                    <UploadCloud className="w-6 h-6 text-indigo-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-indigo-900">Processing File...</p>
                    <p className="text-xs text-indigo-600">Validating rows and checking data integrity</p>
                  </div>
                  <div className="w-full bg-indigo-100 rounded-full h-1.5 mt-2">
                    <div className="bg-indigo-600 h-1.5 rounded-full animate-pulse" style={{ width: '60%' }} />
                  </div>
                </div> :
              uploadedFileName ?
              <div className="space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">{uploadedFileName}</p>
                    <p className="text-xs text-gray-500 mt-1">Click to upload a different file</p>
                  </div>
                </div> :

              <div className="space-y-3">
                  <UploadCloud className="w-12 h-12 text-gray-300 mx-auto" />
                  <div>
                    <p className="text-sm font-bold text-gray-700">Drop CSV file here</p>
                    <p className="text-xs text-gray-500 mt-1">or click to browse from your computer</p>
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <Badge variant="secondary" className="text-[10px]">Max 10MB</Badge>
                    <Badge variant="secondary" className="text-[10px]">CSV only</Badge>
                  </div>
                </div>
              }
            </div>

            {uploadedFileName && !isProcessing &&
            <Button
              variant="primary"
              className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700"
              onClick={handleFileUpload}>

                <RefreshCw className="w-4 h-4 mr-2" />
                Re-process File
              </Button>
            }
          </Card>

          {/* Step 3: Review & Import */}
          <Card className={`
            p-6 transition-all duration-300 border-l-4 
            ${currentStep === 3 ?
          'border-l-indigo-600 ring-2 ring-indigo-100 shadow-xl bg-white' :
          'border-l-gray-200 opacity-70'}
          `}>
            <div className="flex items-start gap-4 mb-4">
              <div className={`
                p-3 rounded-xl transition-colors
                ${currentStep === 3 ? 'bg-indigo-100' : 'bg-gray-100'}
              `}>
                <FileCheck className={`w-6 h-6 ${currentStep === 3 ? 'text-indigo-600' : 'text-gray-400'}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">Step 3: Review & Import</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Verify validated data and import to your expense records
                </p>
              </div>
            </div>

            {currentStep === 3 &&
            <div className="space-y-3">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-bold text-green-900">
                      {stats.valid} Records Ready
                    </span>
                  </div>
                  <p className="text-xs text-green-700">
                    Total: ₹{stats.validAmount.toLocaleString('en-IN')}
                  </p>
                </div>

                {stats.errors > 0 &&
              <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <span className="text-sm font-bold text-red-900">
                        {stats.errors} Errors Found
                      </span>
                    </div>
                    <p className="text-xs text-red-700">
                      Fix errors or exclude these rows
                    </p>
                  </div>
              }
              </div>
            }
          </Card>

          {/* Help Card */}
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                  Quick Tips
                </p>
                <ul className="text-xs text-blue-800 space-y-1.5 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>Date format must be YYYY-MM-DD</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>Amount should be numeric (no currency symbols)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>Reference numbers must be unique</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>All required fields marked with * must have values</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Column Reference Card */}
          <Card className="p-4 bg-gray-50 border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <FileSpreadsheet className="w-4 h-4 text-gray-600" />
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                Column Reference
              </h4>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {columnMappings.map((col) =>
              <div key={col.csvColumn} className="flex items-start gap-2 text-xs p-2 bg-white rounded border border-gray-100">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${col.required ? 'bg-red-400' : 'bg-gray-300'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-gray-900">{col.csvColumn}</span>
                      {col.required &&
                    <Badge variant="destructive" className="text-[9px] px-1 py-0">Required</Badge>
                    }
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5">{col.description}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Side - Data Preview and Validation Results */}
        <div className="col-span-12 lg:col-span-8">
          {currentStep === 3 && importData.length > 0 ?
          <Card className="overflow-hidden shadow-2xl border-2 border-gray-200 animate-in fade-in slide-in-from-right-4 duration-500">
              {/* Table Header with Filters */}
              <div className="p-5 border-b bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex items-center gap-4 flex-wrap">
                    <h3 className="text-lg font-black text-gray-900">Validation Results</h3>
                    
                    <div className="flex gap-2">
                      <Badge
                      variant={!showErrorsOnly ? "default" : "secondary"}
                      className="cursor-pointer text-xs"
                      onClick={() => setShowErrorsOnly(false)}>

                        <FileText className="w-3 h-3 mr-1" />
                        All ({stats.total})
                      </Badge>
                      
                      <Badge
                      variant={showErrorsOnly ? "destructive" : "secondary"}
                      className="cursor-pointer text-xs"
                      onClick={() => setShowErrorsOnly(true)}>

                        <AlertCircle className="w-3 h-3 mr-1" />
                        Errors Only ({stats.errors})
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 lg:flex-initial">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                      type="text"
                      placeholder="Search vendor, category, ref..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full lg:w-64" />

                    </div>

                    <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowErrorsOnly(false);
                      setSearchTerm('');
                    }}>

                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {(showErrorsOnly || searchTerm) &&
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
                    <Filter className="w-3 h-3" />
                    <span>
                      Showing {filteredData.length} of {stats.total} records
                    </span>
                  </div>
              }
              </div>

              {/* Table Content */}
              <div className="max-h-[600px] overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0 z-10 border-b-2 border-gray-200">
                    <tr>
                      {columns.map((col) =>
                    <th
                      key={col.key}
                      className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">

                          {col.header}
                        </th>
                    )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredData.map((row, index) =>
                  <React.Fragment key={row.id}>
                        <tr
                      className={`
                            transition-all hover:bg-gray-50
                            ${row.status === 'error' ? 'bg-red-50/30' : ''}
                            ${row.status === 'warning' ? 'bg-amber-50/30' : ''}
                            ${index % 2 === 0 ? 'bg-gray-50/30' : ''}
                          `}>

                          {columns.map((col) =>
                      <td key={col.key} className="px-4 py-4 whitespace-nowrap">
                              {col.render(row)}
                            </td>
                      )}
                        </tr>
                        
                        {/* Expanded Row Details */}
                        {expandedRows.has(row.id) &&
                    <tr className="bg-blue-50 border-l-4 border-l-blue-500">
                            <td colSpan={columns.length} className="px-4 py-4">
                              <div className="space-y-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <Info className="w-4 h-4 text-blue-600" />
                                  <h4 className="text-sm font-bold text-blue-900">Row Details</h4>
                                </div>

                                {row.error &&
                          <div className="bg-red-100 border border-red-300 rounded-lg p-3">
                                    <div className="flex items-start gap-2">
                                      <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                                      <div>
                                        <p className="text-xs font-bold text-red-900 mb-1">Validation Error</p>
                                        <p className="text-xs text-red-700">{row.error}</p>
                                      </div>
                                    </div>
                                  </div>
                          }

                                {row.warnings && row.warnings.length > 0 &&
                          <div className="bg-amber-100 border border-amber-300 rounded-lg p-3">
                                    <div className="flex items-start gap-2">
                                      <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                                      <div>
                                        <p className="text-xs font-bold text-amber-900 mb-2">Warnings</p>
                                        <ul className="space-y-1">
                                          {row.warnings.map((warning, i) =>
                                  <li key={i} className="text-xs text-amber-700 flex items-start gap-2">
                                              <span className="text-amber-400">•</span>
                                              {warning}
                                            </li>
                                  )}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                          }

                                <div className="grid grid-cols-2 gap-3 pt-2">
                                  <div className="bg-white rounded-lg p-2 border border-gray-200">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase">Full Vendor Name</p>
                                    <p className="text-xs text-gray-900 mt-1">{row.vendor || 'N/A'}</p>
                                  </div>
                                  <div className="bg-white rounded-lg p-2 border border-gray-200">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase">Expense Category</p>
                                    <p className="text-xs text-gray-900 mt-1">{row.head}</p>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                    }
                      </React.Fragment>
                  )}
                  </tbody>
                </table>

                {filteredData.length === 0 &&
              <div className="text-center py-12">
                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm font-bold text-gray-500">No records found</p>
                    <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
                  </div>
              }
              </div>

              {/* Action Footer */}
              <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                  <div className="space-y-2 text-center lg:text-left">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      Ready to Import
                    </p>
                    <div className="flex items-baseline gap-3">
                      <p className="text-3xl font-black text-green-400">
                        ₹{stats.validAmount.toLocaleString('en-IN')}
                      </p>
                      <span className="text-xs text-gray-400">
                        from {stats.valid} valid records
                      </span>
                    </div>
                    {stats.errors > 0 &&
                  <p className="text-xs text-red-400">
                        {stats.errors} records will be excluded due to errors
                      </p>
                  }
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    {stats.errors > 0 &&
                  <Button
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur"
                    onClick={handleExportErrors}>

                        <Download className="w-4 h-4 mr-2" />
                        Export {stats.errors} Error(s)
                      </Button>
                  }
                    
                    <Button
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur"
                    onClick={() => {
                      setCurrentStep(2);
                      setImportData([]);
                      setUploadedFileName('');
                    }}>

                      <RefreshCw className="w-4 h-4 mr-2" />
                      Start Over
                    </Button>

                    <Button
                    variant="primary"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 px-8 py-6 text-base font-bold shadow-2xl shadow-green-950 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={stats.valid === 0}
                    onClick={handleImportRecords}>

                      <Play className="w-5 h-5 mr-2" />
                      Import {stats.valid} Record{stats.valid !== 1 ? 's' : ''}
                    </Button>
                  </div>
                </div>
              </div>
            </Card> :

          // Empty State
          <div className="h-full min-h-[600px] flex flex-col items-center justify-center text-center p-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border-4 border-dashed border-gray-200">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-indigo-100 rounded-full blur-2xl opacity-50" />
                <FileCheck className="w-24 h-24 text-gray-300 relative" />
              </div>
              
              <h3 className="text-2xl font-black text-gray-400 mb-2">
                Awaiting File Upload
              </h3>
              <p className="text-sm text-gray-500 max-w-md leading-relaxed">
                Complete Step 1 and Step 2 to see your imported data with detailed validation status. 
                All errors and warnings will be highlighted for easy correction.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 w-full max-w-2xl">
                <div className="bg-white rounded-xl p-4 border-2 border-gray-200 shadow-sm">
                  <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-xs font-bold text-gray-700">Auto Validation</p>
                  <p className="text-[10px] text-gray-500 mt-1">Instant error detection</p>
                </div>
                <div className="bg-white rounded-xl p-4 border-2 border-gray-200 shadow-sm">
                  <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <p className="text-xs font-bold text-gray-700">Smart Warnings</p>
                  <p className="text-[10px] text-gray-500 mt-1">Catch potential issues</p>
                </div>
                <div className="bg-white rounded-xl p-4 border-2 border-gray-200 shadow-sm">
                  <Play className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                  <p className="text-xs font-bold text-gray-700">One-Click Import</p>
                  <p className="text-[10px] text-gray-500 mt-1">Bulk save verified data</p>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>);

}