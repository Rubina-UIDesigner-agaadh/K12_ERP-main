// ScholarshipDocumentsReceipts.tsx - Complete Scholarship Documents & Receipts Management Page
import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import {
  FileText,
  Award,
  Receipt,
  Send,
  Upload,
  Download,
  Eye,
  Printer,
  Search,
  RotateCcw,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Building2,
  ExternalLink,
  Layers,
  Sparkles,
  X,
  Check,
  Globe
} from 'lucide-react';
import {
  SCHOLARSHIP_SCHEMES,
  SCHOLARSHIP_STUDENTS,
  ScholarshipDocument,
  ScholarshipDocType,
  ScholarshipDocStatus,
  DeliveryMode,
  getScholarshipDocuments,
  setScholarshipDocuments,
  studentById,
  schemeById,
  todayIso,
  htmlDoc,
  printHtml,
  downloadText,
  toCsv,
  ACADEMIC_YEAR
} from './scholarshipData';

export function ScholarshipDocumentsReceipts() {
  // Document state
  const [documents, setDocuments] = useState<ScholarshipDocument[]>(() => getScholarshipDocuments());
  const [activeTab, setActiveTab] = useState<'all' | 'sanctions' | 'receipts' | 'certificates' | 'delivery'>('all');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('2025-04-01');
  const [toDate, setToDate] = useState('2025-09-30');
  const [filterDocType, setFilterDocType] = useState('All');
  const [filterScheme, setFilterScheme] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterClass, setFilterClass] = useState('All');
  const [filterDeliveryMode, setFilterDeliveryMode] = useState('All');

  // Selection state
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);

  // Modals
  const [previewDoc, setPreviewDoc] = useState<ScholarshipDocument | null>(null);
  const [parentPortalDoc, setParentPortalDoc] = useState<ScholarshipDocument | null>(null);
  const [parentPortalStudentId, setParentPortalStudentId] = useState<string>('STU001');
  const [showSanctionModal, setShowSanctionModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showBulkGenerateModal, setShowBulkGenerateModal] = useState(false);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => setNotificationToast(null), 3500);
  };

  const saveDocs = (newDocs: ScholarshipDocument[]) => {
    setDocuments(newDocs);
    setScholarshipDocuments(newDocs);
  };

  // KPI Calculations
  const kpiTotal = documents.length;
  const kpiSanctions = documents.filter(
    (d) => d.docType === 'Sanction Letter' || d.docType === 'Verification Letter'
  ).length;
  const kpiReceipts = documents.filter(
    (d) => d.docType === 'Fee Waiver Receipt' || d.docType === 'Bank DBT Receipt'
  ).length;
  const kpiCertificates = documents.filter(
    (d) => d.docType === 'Scholarship Certificate' || d.docType === 'Govt. Certificate'
  ).length;
  const kpiPendingSend = documents.filter(
    (d) => d.status === 'Not Sent' || d.deliveryMode === 'Not Sent'
  ).length;
  const kpiPendingGovt = documents.filter(
    (d) => d.type === 'Government' && (d.status === 'Pending' || d.status === 'Not Generated')
  ).length;

  // Filtered documents
  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      // Tab filter
      if (activeTab === 'sanctions' && doc.docType !== 'Sanction Letter' && doc.docType !== 'Verification Letter') {
        return false;
      }
      if (activeTab === 'receipts' && doc.docType !== 'Fee Waiver Receipt' && doc.docType !== 'Bank DBT Receipt') {
        return false;
      }
      if (activeTab === 'certificates' && doc.docType !== 'Scholarship Certificate' && doc.docType !== 'Govt. Certificate') {
        return false;
      }
      if (activeTab === 'delivery') {
        // Delivery status tab shows all with delivery mode & status visibility
      }

      // Dropdown filters
      if (filterDocType !== 'All' && doc.docType !== filterDocType) return false;
      if (filterScheme !== 'All' && doc.schemeId !== filterScheme) return false;
      if (filterType !== 'All' && doc.type !== filterType) return false;
      if (filterStatus !== 'All' && doc.status !== filterStatus) return false;
      if (filterDeliveryMode !== 'All' && doc.deliveryMode !== filterDeliveryMode) return false;
      if (filterClass !== 'All' && !doc.studentClass.startsWith(filterClass)) return false;

      // Free text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          doc.docNo.toLowerCase().includes(q) ||
          doc.studentName.toLowerCase().includes(q) ||
          doc.appNo.toLowerCase().includes(q) ||
          doc.schemeName.toLowerCase().includes(q) ||
          (doc.letterNo && doc.letterNo.toLowerCase().includes(q)) ||
          (doc.receiptNo && doc.receiptNo.toLowerCase().includes(q)) ||
          (doc.certificateNo && doc.certificateNo.toLowerCase().includes(q)) ||
          (doc.nspRefNo && doc.nspRefNo.toLowerCase().includes(q));
        if (!match) return false;
      }

      return true;
    });
  }, [
    documents,
    activeTab,
    filterDocType,
    filterScheme,
    filterType,
    filterStatus,
    filterClass,
    filterDeliveryMode,
    searchQuery
  ]);

  // Bulk selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDocIds(filteredDocs.map((d) => d.id));
    } else {
      setSelectedDocIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedDocIds((prev) => [...prev, id]);
    } else {
      setSelectedDocIds((prev) => prev.filter((x) => x !== id));
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFromDate('2025-04-01');
    setToDate('2025-09-30');
    setFilterDocType('All');
    setFilterScheme('All');
    setFilterType('All');
    setFilterStatus('All');
    setFilterClass('All');
    setFilterDeliveryMode('All');
  };

  // Actions
  const handleSendDocument = (doc: ScholarshipDocument) => {
    const updated = documents.map((d) => {
      if (d.id === doc.id) {
        return {
          ...d,
          status: 'Sent to Parent' as ScholarshipDocStatus,
          deliveryMode: 'Email' as DeliveryMode,
          sentDate: new Date().toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        };
      }
      return d;
    });
    saveDocs(updated);
    showToast(`Document ${doc.docNo} sent to parent (${doc.studentName}) via Email & SMS.`);
  };

  const handleSendAllPending = () => {
    let count = 0;
    const updated = documents.map((d) => {
      if (d.status === 'Not Sent' || d.deliveryMode === 'Not Sent') {
        count++;
        return {
          ...d,
          status: 'Sent to Parent' as ScholarshipDocStatus,
          deliveryMode: 'Email' as DeliveryMode,
          sentDate: new Date().toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        };
      }
      return d;
    });
    saveDocs(updated);
    showToast(`Dispatched ${count} pending scholarship documents to parents via Email and Portal.`);
  };

  const handleSendNspLink = (doc: ScholarshipDocument) => {
    showToast(`NSP Portal link & reference instructions sent to parent of ${doc.studentName} via SMS.`);
  };

  const handleDownloadDoc = (doc: ScholarshipDocument) => {
    const content = `
============================================================
              XYZ PUBLIC SCHOOL - ERP SYSTEM
             SCHOLARSHIP DOCUMENT RECORD
============================================================
Document No     : ${doc.docNo}
Document Type   : ${doc.docType}
Scholarship Kind: ${doc.type} (${doc.schemeName})
Application No  : ${doc.appNo}
Student Name    : ${doc.studentName} (${doc.studentClass})
Generated On    : ${doc.generatedOn}
Status          : ${doc.status}
Delivery Mode   : ${doc.deliveryMode}
${doc.amount ? `Amount / Benefit : ₹${doc.amount.toLocaleString('en-IN')}` : ''}
${doc.waiverPct ? `Waiver Pct      : ${doc.waiverPct}%` : ''}
${doc.letterNo ? `Sanction Ref No : ${doc.letterNo}` : ''}
${doc.receiptNo ? `Receipt Number  : ${doc.receiptNo}` : ''}
${doc.certificateNo ? `Certificate No  : ${doc.certificateNo}` : ''}
${doc.nspRefNo ? `NSP Reference   : ${doc.nspRefNo}` : ''}
${doc.govtSanctionNo ? `Govt Order No   : ${doc.govtSanctionNo}` : ''}
============================================================
Generated from Finance Module - Documents & Receipts Section
    `;
    downloadText(`${doc.docNo}_${doc.studentName.replace(/\s+/g, '_')}.txt`, content.trim());
    showToast(`Downloaded ${doc.docNo} (${doc.docType})`);
  };

  const handleBulkPrint = () => {
    const docsToPrint = selectedDocIds.length
      ? documents.filter((d) => selectedDocIds.includes(d.id))
      : filteredDocs;
    if (docsToPrint.length === 0) {
      alert('No documents selected for printing.');
      return;
    }
    const html = htmlDoc(
      'Scholarship Documents Dossier',
      `
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="margin: 0; color: #1e3a8a;">XYZ PUBLIC SCHOOL</h2>
        <h3 style="margin: 4px 0; color: #475569;">Scholarship Documents & Receipts Dossier (FY 2025-26)</h3>
        <p style="font-size: 12px; color: #64748b;">Printed on ${new Date().toLocaleString()} | Total Documents: ${docsToPrint.length}</p>
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
        <thead>
          <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
            <th style="padding: 6px; border: 1px solid #cbd5e1;">Doc. No</th>
            <th style="padding: 6px; border: 1px solid #cbd5e1;">Student</th>
            <th style="padding: 6px; border: 1px solid #cbd5e1;">Type</th>
            <th style="padding: 6px; border: 1px solid #cbd5e1;">Scheme</th>
            <th style="padding: 6px; border: 1px solid #cbd5e1;">Generated On</th>
            <th style="padding: 6px; border: 1px solid #cbd5e1;">Status</th>
            <th style="padding: 6px; border: 1px solid #cbd5e1;">Amount / Ref</th>
          </tr>
        </thead>
        <tbody>
          ${docsToPrint
            .map(
              (d) => `
            <tr>
              <td style="padding: 6px; border: 1px solid #e2e8f0; font-family: monospace;">${d.docNo}</td>
              <td style="padding: 6px; border: 1px solid #e2e8f0;"><b>${d.studentName}</b> (${d.studentClass})</td>
              <td style="padding: 6px; border: 1px solid #e2e8f0;">${d.docType}</td>
              <td style="padding: 6px; border: 1px solid #e2e8f0;">${d.schemeName}</td>
              <td style="padding: 6px; border: 1px solid #e2e8f0;">${d.generatedOn}</td>
              <td style="padding: 6px; border: 1px solid #e2e8f0;">${d.status}</td>
              <td style="padding: 6px; border: 1px solid #e2e8f0;">${d.amount ? '₹' + d.amount.toLocaleString() : d.letterNo || '—'}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
      `
    );
    printHtml(html);
  };

  const handleExportExcel = () => {
    const rows = [
      [
        'Doc No',
        'Student Name',
        'Class',
        'Document Type',
        'Scheme Name',
        'Scholarship Kind',
        'Generated On',
        'Status',
        'Delivery Mode',
        'Amount',
        'Sanction / Ref No'
      ],
      ...filteredDocs.map((d) => [
        d.docNo,
        d.studentName,
        d.studentClass,
        d.docType,
        d.schemeName,
        d.type,
        d.generatedOn,
        d.status,
        d.deliveryMode,
        d.amount ? String(d.amount) : '',
        d.letterNo || d.receiptNo || d.certificateNo || d.nspRefNo || ''
      ])
    ];
    downloadText('Scholarship_Documents_Register.csv', toCsv(rows));
    showToast('Exported document register to CSV/Excel.');
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {notificationToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700 animate-slide-up">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-sm font-medium">{notificationToast}</span>
          <button onClick={() => setNotificationToast(null)} className="ml-2 text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* SECTION 1: TOP HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <span>Home</span>
            <span>&gt;</span>
            <span className="text-blue-600 font-medium">Scholarship</span>
            <span>&gt;</span>
            <span className="text-gray-800 font-semibold">Documents & Receipts</span>
          </div>
          <div className="flex items-center gap-3">

            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    Scholarship Documents & Receipts <Badge variant="secondary" className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200"> FY: {ACADEMIC_YEAR} </Badge>
                  </h1>
                  <p className="text-xs text-gray-500">
                    Official sanction orders, fee waiver vouchers, merit certificates, and DBT delivery tracking
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Top Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setParentPortalStudentId('STU001');
              setParentPortalDoc(documents[0]);
            }}
            className="flex items-center gap-1.5 text-indigo-700 border-indigo-200 bg-indigo-50 hover:bg-indigo-100"
          >
            <Globe className="w-4 h-4 text-indigo-600" />
            Parent Portal View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 text-gray-700"
          >
            <Download className="w-4 h-4" />
            Export Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkPrint}
            className="flex items-center gap-1.5 text-gray-700"
          >
            <Printer className="w-4 h-4" />
            Print Dossier
          </Button>
        </div>
      </div>

      {/* SECTION 2: SUMMARY KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1 */}
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-white border-blue-100 shadow-sm">
          <div className="flex items-center justify-between text-blue-600 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Documents</span>
            <FileText className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{kpiTotal}</div>
          <div className="text-[11px] text-gray-500 mt-1">Generated this academic year</div>
        </Card>

        {/* Card 2 */}
        <Card className="p-4 bg-gradient-to-br from-indigo-50 to-white border-indigo-100 shadow-sm">
          <div className="flex items-center justify-between text-indigo-600 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Sanction Letters</span>
            <FileCheck className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{kpiSanctions}</div>
          <div className="text-[11px] text-gray-500 mt-1">Internal + Govt. verification</div>
        </Card>

        {/* Card 3 */}
        <Card className="p-4 bg-gradient-to-br from-emerald-50 to-white border-emerald-100 shadow-sm">
          <div className="flex items-center justify-between text-emerald-600 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Receipts</span>
            <Receipt className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{kpiReceipts}</div>
          <div className="text-[11px] text-gray-500 mt-1">Fee waiver & DBT vouchers</div>
        </Card>

        {/* Card 4 */}
        <Card className="p-4 bg-gradient-to-br from-amber-50 to-white border-amber-100 shadow-sm">
          <div className="flex items-center justify-between text-amber-600 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Certificates</span>
            <Award className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{kpiCertificates}</div>
          <div className="text-[11px] text-gray-500 mt-1">Merit & sports citations</div>
        </Card>

        {/* Card 5 */}
        <Card className="p-4 bg-gradient-to-br from-amber-50 to-white border-amber-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-amber-600 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Send</span>
            <Send className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-amber-700">{kpiPendingSend}</div>
          <div className="flex items-center gap-1 text-[11px] text-amber-600 font-medium mt-1">
            <AlertCircle className="w-3 h-3" /> Action Required
          </div>
        </Card>

        {/* Card 6 */}
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-white border-purple-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-purple-600 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Govt.</span>
            <Upload className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-purple-700">{kpiPendingGovt}</div>
          <div className="flex items-center gap-1 text-[11px] text-purple-600 font-medium mt-1">
            <AlertCircle className="w-3 h-3" /> Upload to ERP
          </div>
        </Card>
      </div>

      {/* SECTION 3: TAB NAVIGATION */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-1 sm:space-x-3 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'all'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            All Documents ({documents.length})
          </button>
          <button
            onClick={() => setActiveTab('sanctions')}
            className={`px-4 py-2 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'sanctions'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            Sanction Letters ({kpiSanctions})
          </button>
          <button
            onClick={() => setActiveTab('receipts')}
            className={`px-4 py-2 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'receipts'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Receipt className="w-4 h-4" />
            Receipts ({kpiReceipts})
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-4 py-2 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'certificates'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Award className="w-4 h-4" />
            Certificates ({kpiCertificates})
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`px-4 py-2 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'delivery'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Send className="w-4 h-4" />
            Delivery Status
            {kpiPendingSend > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                {kpiPendingSend} pending
              </span>
            )}
          </button>
        </div>
      </div>

      {/* SECTION 4: FILTERS & SEARCH + ACTION BUTTONS */}
      <Card className="p-4 bg-white border-gray-200 shadow-sm space-y-4">
        {/* Search & Dates Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, app no, doc no, scheme..."
              className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="md:col-span-3 flex items-center gap-2">
            <span className="text-xs text-gray-500 whitespace-nowrap">From:</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full py-1 px-2 border border-gray-300 rounded-md text-xs"
            />
          </div>
          <div className="md:col-span-3 flex items-center gap-2">
            <span className="text-xs text-gray-500 whitespace-nowrap">To:</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full py-1 px-2 border border-gray-300 rounded-md text-xs"
            />
          </div>
          <div className="md:col-span-1 flex justify-end">
            <Button variant="ghost" size="sm" onClick={resetFilters} title="Reset All Filters">
              <RotateCcw className="w-4 h-4 text-gray-500 hover:text-gray-800" />
            </Button>
          </div>
        </div>

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1">Doc Type</label>
            <select
              value={filterDocType}
              onChange={(e) => setFilterDocType(e.target.value)}
              className="w-full py-1 px-2 border border-gray-300 rounded-md text-xs bg-white focus:outline-none"
            >
              <option value="All">All Types</option>
              <option value="Sanction Letter">Sanction Letter</option>
              <option value="Verification Letter">Verification Letter</option>
              <option value="Fee Waiver Receipt">Fee Waiver Receipt</option>
              <option value="Scholarship Certificate">Scholarship Certificate</option>
              <option value="Govt. Sanction Order">Govt. Sanction Order</option>
              <option value="Govt. Certificate">Govt. Certificate</option>
              <option value="Bank DBT Receipt">Bank DBT Receipt</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1">Scheme</label>
            <select
              value={filterScheme}
              onChange={(e) => setFilterScheme(e.target.value)}
              className="w-full py-1 px-2 border border-gray-300 rounded-md text-xs bg-white focus:outline-none"
            >
              <option value="All">All Schemes</option>
              {SCHOLARSHIP_SCHEMES.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1">Scholarship Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full py-1 px-2 border border-gray-300 rounded-md text-xs bg-white focus:outline-none"
            >
              <option value="All">All Kinds</option>
              <option value="Internal">🏫 Internal</option>
              <option value="Government">🏛️ Government</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full py-1 px-2 border border-gray-300 rounded-md text-xs bg-white focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Sent to Parent">Sent to Parent</option>
              <option value="Uploaded">Uploaded</option>
              <option value="Downloaded by Parent">Downloaded by Parent</option>
              <option value="Not Sent">Not Sent</option>
              <option value="Not Generated">Not Generated</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1">Class</label>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full py-1 px-2 border border-gray-300 rounded-md text-xs bg-white focus:outline-none"
            >
              <option value="All">All Classes</option>
              <option value="VI">Class 6</option>
              <option value="VII">Class 7</option>
              <option value="VIII">Class 8</option>
              <option value="IX">Class 9</option>
              <option value="X">Class 10</option>
              <option value="XI">Class 11</option>
              <option value="XII">Class 12</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1">Delivery Mode</label>
            <select
              value={filterDeliveryMode}
              onChange={(e) => setFilterDeliveryMode(e.target.value)}
              className="w-full py-1 px-2 border border-gray-300 rounded-md text-xs bg-white focus:outline-none"
            >
              <option value="All">All Modes</option>
              <option value="Email">Email</option>
              <option value="SMS">SMS</option>
              <option value="Portal Download">Portal Download</option>
              <option value="Physical Copy">Physical Copy</option>
              <option value="Not Sent">Not Sent</option>
            </select>
          </div>
        </div>

        {/* Generate Action Buttons Sub-Panel */}
        <div className="p-3 bg-gradient-to-r from-blue-50/70 via-gray-50 to-indigo-50/70 border border-blue-200/60 rounded-lg flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-900 uppercase tracking-wide">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Generate Documents:
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              onClick={() => setShowSanctionModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 text-xs h-8"
            >
              <FileCheck className="w-3.5 h-3.5" />
              Generate Sanction Letter
            </Button>
            <Button
              size="sm"
              onClick={() => setShowReceiptModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 text-xs h-8"
            >
              <Receipt className="w-3.5 h-3.5" />
              Generate Receipt
            </Button>
            <Button
              size="sm"
              onClick={() => setShowCertificateModal(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5 text-xs h-8"
            >
              <Award className="w-3.5 h-3.5" />
              Generate Certificate
            </Button>
            <Button
              size="sm"
              onClick={() => setShowUploadModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1.5 text-xs h-8"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Govt. Document
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowBulkGenerateModal(true)}
              className="border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center gap-1.5 text-xs h-8"
            >
              <Layers className="w-3.5 h-3.5 text-gray-600" />
              Bulk Generate
            </Button>
          </div>
        </div>

        {/* Bulk Dispatch Bar */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100 flex-wrap gap-2">
          <div className="text-gray-500">
            Showing <span className="font-semibold text-gray-800">{filteredDocs.length}</span> of {documents.length}{' '}
            documents
            {selectedDocIds.length > 0 && (
              <span className="ml-2 font-medium text-blue-600">
                ({selectedDocIds.length} documents selected for batch operation)
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSendAllPending}
              className="text-amber-700 border-amber-300 bg-amber-50 hover:bg-amber-100 flex items-center gap-1 text-xs h-7"
            >
              <Send className="w-3 h-3 text-amber-600" />
              Send to All Parents ({kpiPendingSend} pending)
            </Button>
          </div>
        </div>
      </Card>

      {/* SECTION 5: MAIN DOCUMENTS TABLE */}
      <Card className="overflow-hidden border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider">
                <th className="p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredDocs.length > 0 &&
                      filteredDocs.every((d) => selectedDocIds.includes(d.id))
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="p-3">Doc. No.</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Document Type</th>
                <th className="p-3">Scheme</th>
                <th className="p-3">Type</th>
                <th className="p-3">Generated On</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-gray-400">
                    No documents found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => {
                  const isSelected = selectedDocIds.includes(doc.id);

                  // Status badge helper
                  const renderStatusBadge = (status: ScholarshipDocStatus) => {
                    switch (status) {
                      case 'Sent to Parent':
                        return (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Sent
                          </span>
                        );
                      case 'Uploaded':
                        return (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-medium">
                            <FileCheck className="w-3 h-3 text-purple-600" /> Uploaded
                          </span>
                        );
                      case 'Downloaded by Parent':
                        return (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                            <Check className="w-3 h-3 text-blue-600" /> Downloaded
                          </span>
                        );
                      case 'Not Sent':
                        return (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                            <Clock className="w-3 h-3 text-amber-600" /> Not Sent
                          </span>
                        );
                      case 'Not Generated':
                        return (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-medium">
                            <AlertCircle className="w-3 h-3 text-rose-600" /> Not Gen.
                          </span>
                        );
                      case 'Pending':
                      default:
                        return (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-300 font-medium">
                            <Clock className="w-3 h-3 text-gray-500" /> Pending
                          </span>
                        );
                    }
                  };

                  // Document icon helper
                  const renderDocIcon = (type: ScholarshipDocType) => {
                    if (type.includes('Sanction') || type.includes('Verification')) {
                      return <FileCheck className="w-3.5 h-3.5 text-blue-600" />;
                    }
                    if (type.includes('Receipt')) {
                      return <Receipt className="w-3.5 h-3.5 text-emerald-600" />;
                    }
                    if (type.includes('Certificate')) {
                      return <Award className="w-3.5 h-3.5 text-amber-600" />;
                    }
                    return <Building2 className="w-3.5 h-3.5 text-purple-600" />;
                  };

                  return (
                    <tr
                      key={doc.id}
                      className={`hover:bg-blue-50/40 transition-colors ${
                        isSelected ? 'bg-blue-50/60' : ''
                      }`}
                    >
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(doc.id, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>

                      <td className="p-3 font-mono font-medium text-gray-900 whitespace-nowrap">
                        {doc.docNo}
                      </td>

                      <td className="p-3">
                        <div className="font-semibold text-gray-900">{doc.studentName}</div>
                        <div className="text-[11px] text-gray-500 flex items-center gap-2">
                          <span>{doc.studentClass}</span>
                          <span>•</span>
                          <span className="font-mono text-[10px]">{doc.appNo}</span>
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-1.5 font-medium text-gray-800">
                          {renderDocIcon(doc.docType)}
                          <span>{doc.docType}</span>
                        </div>
                        {doc.amount && (
                          <div className="text-[11px] text-emerald-700 font-medium">
                            ₹{doc.amount.toLocaleString('en-IN')}
                            {doc.waiverPct ? ` (${doc.waiverPct}% waiver)` : ''}
                          </div>
                        )}
                      </td>

                      <td className="p-3">
                        <span className="text-gray-700 font-medium">{doc.schemeName}</span>
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        {doc.type === 'Internal' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-medium">
                            🏫 Internal
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-medium">
                            🏛️ Govt.
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-gray-600 whitespace-nowrap">
                        {doc.generatedOn}
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        {renderStatusBadge(doc.status)}
                      </td>

                      <td className="p-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {doc.status === 'Not Generated' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setShowSanctionModal(true);
                              }}
                              className="h-7 text-xs text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <Plus className="w-3 h-3 mr-1" /> Generate
                            </Button>
                          ) : doc.status === 'Pending' && doc.type === 'Government' ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setShowUploadModal(true)}
                                className="h-7 text-xs text-purple-600 border-purple-200 hover:bg-purple-50"
                              >
                                <Upload className="w-3 h-3 mr-1" /> Upload
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleSendNspLink(doc)}
                                className="h-7 text-xs text-blue-600 hover:bg-blue-50"
                                title="Send NSP portal link to parent via SMS"
                              >
                                <ExternalLink className="w-3 h-3 mr-1" /> Send Link
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setPreviewDoc(doc)}
                                className="h-7 px-2 text-xs text-gray-700 hover:bg-gray-100"
                                title="Preview Document"
                              >
                                <Eye className="w-3.5 h-3.5 text-blue-600" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDownloadDoc(doc)}
                                className="h-7 px-2 text-xs text-gray-700 hover:bg-gray-100"
                                title="Download as PDF/Text"
                              >
                                <Download className="w-3.5 h-3.5 text-gray-600" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleSendDocument(doc)}
                                className="h-7 px-2 text-xs text-blue-600 hover:bg-blue-50"
                                title={doc.status === 'Sent to Parent' ? 'Resend via Email/SMS' : 'Send to Parent'}
                              >
                                <Send className="w-3.5 h-3.5" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* SECTION 6: DOCUMENT GENERATION PANEL (EXPLANATORY / SHORTCUT GUIDE) */}
      <Card className="p-5 bg-gradient-to-r from-gray-50 via-white to-blue-50/50 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900 text-sm">
            Scholarship Document Generation Guide & Integrity Rules
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-gray-600">
          <div className="p-3 bg-white rounded-lg border border-gray-200">
            <div className="font-semibold text-gray-900 flex items-center gap-1.5 mb-1">
              <FileCheck className="w-4 h-4 text-blue-600" /> 6A: Sanction Letters
            </div>
            <p>
              Auto-filled strictly from Scholarship Master & Approval record. Amounts & percentages are locked from editing to enforce financial audit compliance.
            </p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-gray-200">
            <div className="font-semibold text-gray-900 flex items-center gap-1.5 mb-1">
              <Receipt className="w-4 h-4 text-emerald-600" /> 6B: Fee Waiver Receipts
            </div>
            <p>
              Directly cross-references general ledger journal entries (JV-2025-XXX) with itemized tuition & fee breakdown for parent accounts.
            </p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-gray-200">
            <div className="font-semibold text-gray-900 flex items-center gap-1.5 mb-1">
              <Award className="w-4 h-4 text-amber-600" /> 6C: Merit Certificates
            </div>
            <p>
              Formats decorative citations with school seal, principal signature, and academic/sports achievement details for students.
            </p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-gray-200">
            <div className="font-semibold text-gray-900 flex items-center gap-1.5 mb-1">
              <Upload className="w-4 h-4 text-purple-600" /> 6D: Govt. NSP Orders
            </div>
            <p>
              Archive official state/central ministry sanction letters into ERP for parent portal access without altering government parameters.
            </p>
          </div>
        </div>
      </Card>

      {/* SECTION 7: FOOTER */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-200 gap-2">
        <div className="flex items-center gap-4">
          <span>School ERP • Finance & Scholarship Governance</span>
          <span>•</span>
          <span>Version 3.4.0</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-600">
            <CheckCircle2 className="w-3.5 h-3.5" /> All document logs synchronized
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODALS & PANELS                                                           */}
      {/* ========================================================================= */}

      {/* 👁️ DOCUMENT PREVIEW POPUP */}
      {previewDoc && (
        <Modal
          isOpen={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
          title={`Document Preview — ${previewDoc.docNo}`}
          size="lg"
        >
          <div className="space-y-4">
            <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl font-serif text-gray-800 shadow-inner">
              {/* Letterhead Mock */}
              <div className="text-center pb-4 border-b-2 border-gray-300 mb-6">
                <h2 className="text-xl font-bold tracking-wide text-blue-900">XYZ PUBLIC SCHOOL</h2>
                <p className="text-xs text-gray-500 uppercase tracking-widest">
                  Affiliated to Central Board of Secondary Education (CBSE)
                </p>
                <p className="text-xs text-gray-500">123 Education Enclave, Knowledge Park, City — 400001</p>
              </div>

              {/* Title */}
              <div className="text-center mb-6">
                <span className="inline-block px-4 py-1 bg-gray-200/80 rounded-md text-xs font-semibold uppercase tracking-wider text-gray-800">
                  {previewDoc.docType}
                </span>
                <p className="text-xs text-gray-500 mt-1 font-mono">
                  Reference No: {previewDoc.letterNo || previewDoc.receiptNo || previewDoc.certificateNo || previewDoc.docNo}
                </p>
              </div>

              {/* Document Body */}
              <div className="text-sm space-y-4 leading-relaxed font-sans">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Date: {previewDoc.generatedOn}</span>
                  <span>Scholarship Year: {ACADEMIC_YEAR}</span>
                </div>

                <div className="p-3 bg-white rounded border border-gray-200 space-y-1">
                  <div>
                    <b>Student Name:</b> {previewDoc.studentName}
                  </div>
                  <div>
                    <b>Class & Section:</b> {previewDoc.studentClass}
                  </div>
                  <div>
                    <b>Application No.:</b> {previewDoc.appNo}
                  </div>
                  <div>
                    <b>Scholarship Scheme:</b> {previewDoc.schemeName} ({previewDoc.type})
                  </div>
                  {previewDoc.amount && (
                    <div>
                      <b>Sanctioned Amount / Benefit:</b> ₹{previewDoc.amount.toLocaleString('en-IN')}{' '}
                      {previewDoc.waiverPct ? `(${previewDoc.waiverPct}% Fee Waiver)` : ''}
                    </div>
                  )}
                  {previewDoc.journalRef && (
                    <div>
                      <b>Ledger Journal Entry:</b> {previewDoc.journalRef}
                    </div>
                  )}
                  {previewDoc.nspRefNo && (
                    <div>
                      <b>NSP Portal Reference:</b> {previewDoc.nspRefNo}
                    </div>
                  )}
                  {previewDoc.govtSanctionNo && (
                    <div>
                      <b>Govt. Order No:</b> {previewDoc.govtSanctionNo}
                    </div>
                  )}
                </div>

                <p className="text-xs text-gray-600">
                  This official document confirms the grant and processing of the scholarship award as per institutional
                  guidelines and management approvals. All records have been committed to the institutional accounting register.
                </p>

                {/* Signature Row */}
                <div className="pt-8 flex justify-between items-end text-xs text-gray-600">
                  <div className="text-center">
                    <div className="w-28 border-b border-gray-400 mb-1"></div>
                    <div>{previewDoc.coSignedBy || 'Finance Officer'}</div>
                    <div className="text-[10px] text-gray-400">Accounts Department</div>
                  </div>
                  <div className="text-center">
                    <div className="w-28 border-b border-gray-400 mb-1"></div>
                    <div>{previewDoc.signedBy || 'Principal'}</div>
                    <div className="text-[10px] text-gray-400">XYZ Public School</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Tracking Metadata */}
            <div className="p-3 bg-gray-50 rounded-lg text-xs grid grid-cols-2 sm:grid-cols-4 gap-2 text-gray-600">
              <div>
                <span className="text-gray-400 block">Doc Number</span>
                <span className="font-medium text-gray-800">{previewDoc.docNo}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Current Status</span>
                <span className="font-medium text-gray-800">{previewDoc.status}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Sent Date</span>
                <span className="font-medium text-gray-800">{previewDoc.sentDate || 'Not yet sent'}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Parent Download</span>
                <span className="font-medium text-gray-800">{previewDoc.downloadedDate || 'Pending'}</span>
              </div>
            </div>

            {/* Preview Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const html = htmlDoc('Scholarship Document', `
                    <div style="padding: 24px; font-family: serif;">
                      <h2 style="text-align: center; color: #1e3a8a;">XYZ PUBLIC SCHOOL</h2>
                      <h3 style="text-align: center; color: #334155;">${previewDoc.docType}</h3>
                      <p><b>Document No:</b> ${previewDoc.docNo}</p>
                      <p><b>Student:</b> ${previewDoc.studentName} (${previewDoc.studentClass})</p>
                      <p><b>Scheme:</b> ${previewDoc.schemeName}</p>
                      ${previewDoc.amount ? `<p><b>Amount:</b> ₹${previewDoc.amount.toLocaleString()}</p>` : ''}
                      <p><b>Date:</b> ${previewDoc.generatedOn}</p>
                    </div>
                  `);
                  printHtml(html);
                }}
                className="flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print Document
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadDoc(previewDoc)}
                  className="flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    handleSendDocument(previewDoc);
                    setPreviewDoc(null);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" /> Send / Resend to Parent
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* 📋 6A: GENERATE SANCTION LETTER MODAL */}
      {showSanctionModal && (
        <SanctionLetterModal
          onClose={() => setShowSanctionModal(false)}
          onGenerate={(newDoc) => {
            saveDocs([newDoc, ...documents]);
            showToast(`Sanction letter ${newDoc.docNo} generated successfully.`);
            setShowSanctionModal(false);
          }}
        />
      )}

      {/* 🧾 6B: GENERATE RECEIPT MODAL */}
      {showReceiptModal && (
        <ReceiptModal
          onClose={() => setShowReceiptModal(false)}
          onGenerate={(newDoc) => {
            saveDocs([newDoc, ...documents]);
            showToast(`Fee waiver receipt ${newDoc.docNo} issued.`);
            setShowReceiptModal(false);
          }}
        />
      )}

      {/* 🏆 6C: GENERATE CERTIFICATE MODAL */}
      {showCertificateModal && (
        <CertificateModal
          onClose={() => setShowCertificateModal(false)}
          onGenerate={(newDoc) => {
            saveDocs([newDoc, ...documents]);
            showToast(`Scholarship certificate ${newDoc.docNo} generated.`);
            setShowCertificateModal(false);
          }}
        />
      )}

      {/* 📤 6D: UPLOAD GOVERNMENT DOCUMENTS MODAL */}
      {showUploadModal && (
        <UploadGovtDocModal
          onClose={() => setShowUploadModal(false)}
          onUpload={(newDoc) => {
            saveDocs([newDoc, ...documents]);
            showToast(`Government document ${newDoc.docNo} uploaded to ERP.`);
            setShowUploadModal(false);
          }}
        />
      )}

      {/* 📦 BULK GENERATE MODAL */}
      {showBulkGenerateModal && (
        <BulkGenerateModal
          onClose={() => setShowBulkGenerateModal(false)}
          onBulkGenerate={(newBatch) => {
            saveDocs([...newBatch, ...documents]);
            showToast(`Batch generation complete: ${newBatch.length} documents created.`);
            setShowBulkGenerateModal(false);
          }}
        />
      )}

      {/* 📱 PARENT PORTAL DOCUMENT DOWNLOAD SIMULATION MODAL */}
      {parentPortalDoc && (
        <ParentPortalModal
          studentId={parentPortalStudentId}
          documents={documents}
          onClose={() => setParentPortalDoc(null)}
          onDownloadDoc={handleDownloadDoc}
        />
      )}
    </div>
  );
}

// ----------------------------------------------------------------------------
// MODAL SUB-COMPONENTS
// ----------------------------------------------------------------------------

function SanctionLetterModal({
  onClose,
  onGenerate
}: {
  onClose: () => void;
  onGenerate: (doc: ScholarshipDocument) => void;
}) {
  const [targetType, setTargetType] = useState<'single' | 'multiple' | 'scheme'>('single');
  const [selectedStudentId, setSelectedStudentId] = useState('STU001');
  const [selectedSchemeId, setSelectedSchemeId] = useState('SMS');
  const [letterDate, setLetterDate] = useState('2025-06-10');
  const [signedBy, setSignedBy] = useState('Principal — Mr. A. Sharma');
  const [coSignedBy, setCoSignedBy] = useState('Finance Manager — Mrs. P. Gupta');
  const [includeTerms, setIncludeTerms] = useState(true);
  const [includeLetterhead, setIncludeLetterhead] = useState(true);
  const [digitalSignature, setDigitalSignature] = useState(true);
  const [schoolSeal, setSchoolSeal] = useState(true);
  const [notes, setNotes] = useState('');

  const [sendEmail, setSendEmail] = useState(true);
  const [sendSms, setSendSms] = useState(true);
  const [portalAvailable, setPortalAvailable] = useState(true);

  const student = studentById(selectedStudentId) || SCHOLARSHIP_STUDENTS[0];
  const scheme = schemeById(selectedSchemeId) || SCHOLARSHIP_SCHEMES[0];

  const handleGenerate = (send: boolean) => {
    const docNum = `DOC-2025-${String(Math.floor(100 + Math.random() * 899))}`;
    const newDoc: ScholarshipDocument = {
      id: `DOC-GEN-${Date.now()}`,
      docNo: docNum,
      studentId: student.id,
      studentName: student.name,
      studentClass: `${student.cls} - ${student.section}`,
      appNo: `APP-2025-0${student.id.replace('STU', '')}`,
      schemeId: scheme.id,
      schemeName: scheme.name,
      type: scheme.kind as 'Internal' | 'Government',
      docType: 'Sanction Letter',
      generatedOn: `${letterDate} 10:00 AM`,
      status: send ? 'Sent to Parent' : 'Not Sent',
      deliveryMode: send ? 'Email' : 'Not Sent',
      sentDate: send ? `${letterDate} 10:05 AM` : undefined,
      amount: scheme.criteria.maxIncome ? 15000 : 25000,
      waiverPct: 50,
      validFrom: 'April 2025',
      validUntil: 'March 2026',
      letterNo: `XYZ/SCH/INT/2025-26/${String(Math.floor(100 + Math.random() * 899))}`,
      signedBy,
      coSignedBy,
      includeLetterhead,
      includeSeal: schoolSeal,
      includeSignature: digitalSignature,
      termsConditions: includeTerms,
      notes
    };
    onGenerate(newDoc);
  };

  return (
    <Modal isOpen onClose={onClose} title="📋 Generate Scholarship Sanction Letter — Internal" size="lg">
      <div className="space-y-4 text-xs">
        {/* Selection mode */}
        <div className="flex items-center gap-4 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
          <span className="font-semibold text-gray-700">Generate For:</span>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              checked={targetType === 'single'}
              onChange={() => setTargetType('single')}
              name="targetType"
            />
            <span>Single Student</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              checked={targetType === 'multiple'}
              onChange={() => setTargetType('multiple')}
              name="targetType"
            />
            <span>Multiple Students</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              checked={targetType === 'scheme'}
              onChange={() => setTargetType('scheme')}
              name="targetType"
            />
            <span>Entire Scheme</span>
          </label>
        </div>

        {/* Student & Scheme selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-gray-600 mb-1">Select Student</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-xs"
            >
              {SCHOLARSHIP_STUDENTS.slice(0, 15).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.cls}-{s.section}) — {s.grNo}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium text-gray-600 mb-1">Scholarship Scheme</label>
            <select
              value={selectedSchemeId}
              onChange={(e) => setSelectedSchemeId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-xs"
            >
              {SCHOLARSHIP_SCHEMES.filter((s) => s.kind === 'Internal').map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Auto-filled details card */}
        <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200">
          <div className="text-[11px] font-bold text-blue-900 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Letter Details (Auto-filled from Scholarship Master & Application)</span>
            <span className="text-gray-500 font-normal">🔒 Locked for Integrity</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-gray-700">
            <div>
              <span className="text-gray-400 block text-[10px]">Student Name:</span>
              <span className="font-semibold">{student.name}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Class & Section:</span>
              <span className="font-semibold">
                Class {student.cls} - {student.section}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Waiver %:</span>
              <span className="font-semibold text-emerald-700">50%</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Waiver Amount:</span>
              <span className="font-semibold text-emerald-700">₹ 15,000</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Valid From:</span>
              <span>April 2025</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Valid Until:</span>
              <span>March 2026</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Letter Number:</span>
              <span className="font-mono text-[10px] text-blue-700">XYZ/SCH/INT/2025-26/088</span>
            </div>
          </div>
        </div>

        {/* Letter settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block font-medium text-gray-600 mb-1">Letter Date</label>
            <input
              type="date"
              value={letterDate}
              onChange={(e) => setLetterDate(e.target.value)}
              className="w-full p-1.5 border border-gray-300 rounded-md text-xs"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-600 mb-1">Signed By</label>
            <select
              value={signedBy}
              onChange={(e) => setSignedBy(e.target.value)}
              className="w-full p-1.5 border border-gray-300 rounded-md bg-white text-xs"
            >
              <option value="Principal — Mr. A. Sharma">Principal — Mr. A. Sharma</option>
              <option value="Vice Principal — Mrs. Iyer">Vice Principal — Mrs. Iyer</option>
              <option value="Director — Mrs. Kapoor">Director — Mrs. Kapoor</option>
            </select>
          </div>
          <div>
            <label className="block font-medium text-gray-600 mb-1">Co-Signed By</label>
            <select
              value={coSignedBy}
              onChange={(e) => setCoSignedBy(e.target.value)}
              className="w-full p-1.5 border border-gray-300 rounded-md bg-white text-xs"
            >
              <option value="Finance Manager — Mrs. P. Gupta">Finance Manager — Mrs. P. Gupta</option>
              <option value="Accounts Officer — Rakesh Shah">Accounts Officer — Rakesh Shah</option>
            </select>
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
          <label className="flex items-center gap-1.5 text-gray-700">
            <input
              type="checkbox"
              checked={includeTerms}
              onChange={(e) => setIncludeTerms(e.target.checked)}
              className="rounded"
            />
            <span>Include Terms & Conditions</span>
          </label>
          <label className="flex items-center gap-1.5 text-gray-700">
            <input
              type="checkbox"
              checked={includeLetterhead}
              onChange={(e) => setIncludeLetterhead(e.target.checked)}
              className="rounded"
            />
            <span>School Letterhead</span>
          </label>
          <label className="flex items-center gap-1.5 text-gray-700">
            <input
              type="checkbox"
              checked={digitalSignature}
              onChange={(e) => setDigitalSignature(e.target.checked)}
              className="rounded"
            />
            <span>Digital Signature</span>
          </label>
          <label className="flex items-center gap-1.5 text-gray-700">
            <input
              type="checkbox"
              checked={schoolSeal}
              onChange={(e) => setSchoolSeal(e.target.checked)}
              className="rounded"
            />
            <span>School Seal / Stamp</span>
          </label>
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block font-medium text-gray-600 mb-1">Additional Notes (Optional)</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Subject to maintaining minimum 80% attendance in term assessments"
            className="w-full p-2 border border-gray-300 rounded-md text-xs"
          />
        </div>

        {/* Delivery Options */}
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="font-semibold text-gray-700 mb-1.5">Delivery Options:</div>
          <div className="flex flex-wrap gap-4 text-gray-600">
            <label className="flex items-center gap-1.5">
              <input type="checkbox" checked readOnly className="rounded text-blue-600" />
              <span>Save to ERP system</span>
            </label>
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span>Send via Email to Parent</span>
            </label>
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={sendSms}
                onChange={(e) => setSendSms(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span>Send SMS notification</span>
            </label>
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={portalAvailable}
                onChange={(e) => setPortalAvailable(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span>Parent Portal download</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleGenerate(false)}>
            Save Draft / Generate Only
          </Button>
          <Button size="sm" onClick={() => handleGenerate(true)} className="bg-blue-600 text-white hover:bg-blue-700">
            ✅ Generate & Send
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function ReceiptModal({
  onClose,
  onGenerate
}: {
  onClose: () => void;
  onGenerate: (doc: ScholarshipDocument) => void;
}) {
  const [receiptType, setReceiptType] = useState<'Internal' | 'Govt'>('Internal');
  const [studentId, setStudentId] = useState('STU001');
  const [receiptDate, setReceiptDate] = useState('2025-07-01');
  const [nspRefNo, setNspRefNo] = useState('NSP-2025-OBC-78901234');
  const [govtSanctionNo, setGovtSanctionNo] = useState('MSJE/NSP/OBC/2025-26/44812');
  const [govtFunds, setGovtFunds] = useState('22500');

  const student = studentById(studentId) || SCHOLARSHIP_STUDENTS[0];

  const handleGenerate = (send: boolean) => {
    const docNum = `DOC-2025-${String(Math.floor(100 + Math.random() * 899))}`;
    const newDoc: ScholarshipDocument = {
      id: `DOC-GEN-${Date.now()}`,
      docNo: docNum,
      studentId: student.id,
      studentName: student.name,
      studentClass: `${student.cls} - ${student.section}`,
      appNo: `APP-2025-0${student.id.replace('STU', '')}`,
      schemeId: receiptType === 'Internal' ? 'SMS' : 'NMS',
      schemeName:
        receiptType === 'Internal' ? 'School Merit Scholarship 2025' : 'National Merit Scholarship (NSP)',
      type: receiptType === 'Internal' ? 'Internal' : 'Government',
      docType: 'Fee Waiver Receipt',
      generatedOn: `${receiptDate} 11:00 AM`,
      status: send ? 'Sent to Parent' : 'Not Sent',
      deliveryMode: send ? 'Email' : 'Not Sent',
      amount: receiptType === 'Internal' ? 15000 : parseInt(govtFunds, 10) || 22500,
      waiverPct: receiptType === 'Internal' ? 50 : 75,
      receiptNo: `SCH-REC-2025-${String(Math.floor(100 + Math.random() * 899))}`,
      journalRef: `JV-2025-${String(Math.floor(100 + Math.random() * 899))}`,
      nspRefNo: receiptType === 'Govt' ? nspRefNo : undefined,
      govtSanctionNo: receiptType === 'Govt' ? govtSanctionNo : undefined,
      dbtTransferInfo:
        receiptType === 'Govt' ? 'Cash component paid directly by Govt. via DBT' : undefined
    };
    onGenerate(newDoc);
  };

  return (
    <Modal isOpen onClose={onClose} title="🧾 Generate Scholarship Receipt" size="lg">
      <div className="space-y-4 text-xs">
        {/* Type toggle */}
        <div className="flex items-center gap-4 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
          <span className="font-semibold text-gray-700">Receipt Type:</span>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              checked={receiptType === 'Internal'}
              onChange={() => setReceiptType('Internal')}
              name="recType"
            />
            <span>Internal Scholarship Receipt</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              checked={receiptType === 'Govt'}
              onChange={() => setReceiptType('Govt')}
              name="recType"
            />
            <span>Govt. Fee Waiver Receipt</span>
          </label>
        </div>

        {/* Student picker */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-gray-600 mb-1">Search Student</label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-xs"
            >
              {SCHOLARSHIP_STUDENTS.slice(0, 15).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.cls}-{s.section})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium text-gray-600 mb-1">Receipt Date</label>
            <input
              type="date"
              value={receiptDate}
              onChange={(e) => setReceiptDate(e.target.value)}
              className="w-full p-1.5 border border-gray-300 rounded-md text-xs"
            />
          </div>
        </div>

        {/* Breakdown table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-100 p-2 font-bold text-gray-700 flex justify-between">
            <span>FEE BREAKDOWN (Auto-filled from Fee Module)</span>
            <span className="text-gray-500 font-normal">🔒 Read only</span>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-2">Fee Component</th>
                <th className="p-2">Original Fee</th>
                <th className="p-2">Waiver</th>
                <th className="p-2">Payable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="p-2">Tuition Fee</td>
                <td className="p-2">₹ 30,000</td>
                <td className="p-2 text-emerald-600 font-medium">₹ 15,000</td>
                <td className="p-2 font-bold">₹ 15,000</td>
              </tr>
              <tr>
                <td className="p-2">Exam Fee</td>
                <td className="p-2">₹ 5,000</td>
                <td className="p-2 text-emerald-600 font-medium">₹ 2,500</td>
                <td className="p-2 font-bold">₹ 2,500</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Govt specific inputs */}
        {receiptType === 'Govt' && (
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 space-y-2">
            <div className="font-semibold text-purple-900">For Govt. Scholarship — Additional Fields</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="block text-gray-600 mb-0.5">NSP Ref. No.</label>
                <input
                  type="text"
                  value={nspRefNo}
                  onChange={(e) => setNspRefNo(e.target.value)}
                  className="w-full p-1.5 border border-gray-300 rounded text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-0.5">Govt. Sanction No.</label>
                <input
                  type="text"
                  value={govtSanctionNo}
                  onChange={(e) => setGovtSanctionNo(e.target.value)}
                  className="w-full p-1.5 border border-gray-300 rounded text-xs bg-white"
                />
              </div>
            </div>
            <div className="text-[11px] text-amber-700 font-medium flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Cash component paid directly by Govt. via Aadhaar-linked DBT
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleGenerate(false)}>
            Save Draft
          </Button>
          <Button
            size="sm"
            onClick={() => handleGenerate(true)}
            className="bg-emerald-600 text-white hover:bg-emerald-700"
          >
            ✅ Generate & Send
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function CertificateModal({
  onClose,
  onGenerate
}: {
  onClose: () => void;
  onGenerate: (doc: ScholarshipDocument) => void;
}) {
  const [studentId, setStudentId] = useState('STU001');
  const [template, setTemplate] = useState('Standard');
  const [signedBy, setSignedBy] = useState('Principal — Mr. A. Sharma');
  const [borderDesign, setBorderDesign] = useState(true);
  const [includeLogo, setIncludeLogo] = useState(true);
  const [includeSeal, setIncludeSeal] = useState(true);

  const student = studentById(studentId) || SCHOLARSHIP_STUDENTS[0];

  const handleGenerate = (send: boolean) => {
    const docNum = `DOC-2025-${String(Math.floor(100 + Math.random() * 899))}`;
    const newDoc: ScholarshipDocument = {
      id: `DOC-GEN-${Date.now()}`,
      docNo: docNum,
      studentId: student.id,
      studentName: student.name,
      studentClass: `${student.cls} - ${student.section}`,
      appNo: `APP-2025-0${student.id.replace('STU', '')}`,
      schemeId: 'SMS',
      schemeName: 'School Merit Scholarship 2025',
      type: 'Internal',
      docType: 'Scholarship Certificate',
      generatedOn: `${todayIso()} 02:00 PM`,
      status: send ? 'Sent to Parent' : 'Not Sent',
      deliveryMode: send ? 'Email' : 'Not Sent',
      amount: 15000,
      certificateNo: `XYZ/SCH/CERT/2025-26/${String(Math.floor(100 + Math.random() * 899))}`,
      template,
      signedBy,
      includeLetterhead: includeLogo,
      includeSeal
    };
    onGenerate(newDoc);
  };

  return (
    <Modal isOpen onClose={onClose} title="🏆 Generate Scholarship Certificate — Internal" size="lg">
      <div className="space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-gray-600 mb-1">Student</label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-xs"
            >
              {SCHOLARSHIP_STUDENTS.slice(0, 15).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.cls}-{s.section})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium text-gray-600 mb-1">Certificate Template</label>
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-xs"
            >
              <option value="Standard">Standard Merit</option>
              <option value="Merit">Academic Excellence</option>
              <option value="Sports">Sports Citation</option>
              <option value="Cultural">Cultural Honors</option>
            </select>
          </div>
        </div>

        <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-200">
          <div className="font-semibold text-amber-900 mb-1">Citation Preview</div>
          <p className="text-gray-700 italic">
            "In recognition of outstanding academic brilliance, scoring {student.marks}% in Class {student.cls}, awarded 50% Tuition Fee Waiver for academic session {ACADEMIC_YEAR}."
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <label className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={borderDesign}
              onChange={(e) => setBorderDesign(e.target.checked)}
              className="rounded"
            />
            <span>With Border Design</span>
          </label>
          <label className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={includeLogo}
              onChange={(e) => setIncludeLogo(e.target.checked)}
              className="rounded"
            />
            <span>School Logo</span>
          </label>
          <label className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={includeSeal}
              onChange={(e) => setIncludeSeal(e.target.checked)}
              className="rounded"
            />
            <span>School Seal</span>
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={() => handleGenerate(true)}
            className="bg-amber-600 text-white hover:bg-amber-700"
          >
            ✅ Generate Certificate
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function UploadGovtDocModal({
  onClose,
  onUpload
}: {
  onClose: () => void;
  onUpload: (doc: ScholarshipDocument) => void;
}) {
  const [docType, setDocType] = useState<ScholarshipDocType>('Govt. Sanction Order');
  const [studentId, setStudentId] = useState('STU002');
  const [nspRefNo, setNspRefNo] = useState('NSP-2025-OBC-78901234');
  const [govtSanctionNo, setGovtSanctionNo] = useState('MSJE/NSP/OBC/2025-26/44812');
  const [approvalDate, setApprovalDate] = useState('2025-09-05');
  const [amount, setAmount] = useState('28500');
  const [fileName, setFileName] = useState('Rahul_Kumar_NSP_Sanction_Order.pdf');

  const student = studentById(studentId) || SCHOLARSHIP_STUDENTS[1];

  const handleUpload = () => {
    const docNum = `DOC-2025-${String(Math.floor(100 + Math.random() * 899))}`;
    const newDoc: ScholarshipDocument = {
      id: `DOC-GEN-${Date.now()}`,
      docNo: docNum,
      studentId: student.id,
      studentName: student.name,
      studentClass: `${student.cls} - ${student.section}`,
      appNo: `APP-2025-004`,
      schemeId: 'NMS',
      schemeName: 'National Merit Scholarship (NSP)',
      type: 'Government',
      docType,
      generatedOn: approvalDate,
      status: 'Uploaded',
      deliveryMode: 'Portal Download',
      amount: parseInt(amount, 10) || 28500,
      nspRefNo,
      govtSanctionNo,
      govtApprovalDate: approvalDate,
      issuingAuthority: 'Ministry of Social Justice & Empowerment',
      uploadedFileName: fileName,
      fileSize: '1.4 MB'
    };
    onUpload(newDoc);
  };

  return (
    <Modal isOpen onClose={onClose} title="📤 Upload Government Scholarship Document" size="lg">
      <div className="space-y-4 text-xs">
        <div>
          <label className="block font-medium text-gray-700 mb-1">Document Type</label>
          <div className="flex flex-wrap gap-4">
            {(['Govt. Sanction Order', 'Govt. Certificate', 'Bank DBT Receipt'] as ScholarshipDocType[]).map((t) => (
              <label key={t} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="govtDocType"
                  checked={docType === t}
                  onChange={() => setDocType(t)}
                />
                <span>{t}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-gray-600 mb-1">Student</label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-xs"
            >
              {SCHOLARSHIP_STUDENTS.slice(0, 15).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.cls}-{s.section})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium text-gray-600 mb-1">Issuing Authority</label>
            <input
              type="text"
              readOnly
              value="Ministry of Social Justice & Empowerment"
              className="w-full p-1.5 border border-gray-300 rounded-md bg-gray-50 text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block font-medium text-gray-600 mb-1">NSP Reference No.</label>
            <input
              type="text"
              value={nspRefNo}
              onChange={(e) => setNspRefNo(e.target.value)}
              className="w-full p-1.5 border border-gray-300 rounded-md text-xs"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-600 mb-1">Govt. Sanction Order No.</label>
            <input
              type="text"
              value={govtSanctionNo}
              onChange={(e) => setGovtSanctionNo(e.target.value)}
              className="w-full p-1.5 border border-gray-300 rounded-md text-xs"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-600 mb-1">Scholarship Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-1.5 border border-gray-300 rounded-md text-xs"
            />
          </div>
        </div>

        {/* Upload box */}
        <div className="border border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 bg-purple-50/20">
          <Upload className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="font-semibold text-gray-800">Click to Upload Govt. Document</div>
          <div className="text-[11px] text-gray-500">PDF only, Maximum size 5MB</div>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-purple-200 text-purple-700 text-xs font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
            {fileName}
          </div>
        </div>

        <div className="p-3 bg-amber-50 rounded-lg text-amber-800 text-[11px]">
          <b>NOTE:</b> This uploads the GOVT. document to ERP for parent access & audit record-keeping. The school does NOT create or modify government documents.
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleUpload} className="bg-purple-600 text-white hover:bg-purple-700">
            ✅ Upload & Notify Parent
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function BulkGenerateModal({
  onClose,
  onBulkGenerate
}: {
  onClose: () => void;
  onBulkGenerate: (docs: ScholarshipDocument[]) => void;
}) {
  const [docType, setDocType] = useState<ScholarshipDocType>('Sanction Letter');
  const [schemeId, setSchemeId] = useState('SMS');

  const handleRun = () => {
    const batch: ScholarshipDocument[] = SCHOLARSHIP_STUDENTS.slice(5, 9).map((s, idx) => ({
      id: `DOC-BULK-${Date.now()}-${idx}`,
      docNo: `DOC-2025-${String(300 + idx)}`,
      studentId: s.id,
      studentName: s.name,
      studentClass: `${s.cls} - ${s.section}`,
      appNo: `APP-2025-${String(50 + idx)}`,
      schemeId,
      schemeName: schemeById(schemeId)?.name || 'Merit Scheme',
      type: 'Internal',
      docType,
      generatedOn: `${todayIso()} 09:00 AM`,
      status: 'Not Sent',
      deliveryMode: 'Not Sent',
      amount: 15000,
      letterNo: `XYZ/SCH/INT/2025-26/${String(200 + idx)}`
    }));
    onBulkGenerate(batch);
  };

  return (
    <Modal isOpen onClose={onClose} title="📦 Bulk Document Generation" size="md">
      <div className="space-y-4 text-xs">
        <p className="text-gray-600">
          Generate documents in batches for all sanctioned students under an eligible scheme.
        </p>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Document Type</label>
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value as ScholarshipDocType)}
            className="w-full p-2 border border-gray-300 rounded-md bg-white text-xs"
          >
            <option value="Sanction Letter">Sanction Letter</option>
            <option value="Fee Waiver Receipt">Fee Waiver Receipt</option>
            <option value="Scholarship Certificate">Scholarship Certificate</option>
          </select>
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Select Scheme</label>
          <select
            value={schemeId}
            onChange={(e) => setSchemeId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md bg-white text-xs"
          >
            {SCHOLARSHIP_SCHEMES.map((sc) => (
              <option key={sc.id} value={sc.id}>
                {sc.name}
              </option>
            ))}
          </select>
        </div>

        <div className="p-3 bg-blue-50 text-blue-800 rounded-md text-[11px]">
          Target batch: <b>4 Approved Students</b> eligible for generation in this cycle.
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleRun} className="bg-blue-600 text-white hover:bg-blue-700">
            Run Bulk Generation
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function ParentPortalModal({
  studentId,
  documents,
  onClose,
  onDownloadDoc
}: {
  studentId: string;
  documents: ScholarshipDocument[];
  onClose: () => void;
  onDownloadDoc: (doc: ScholarshipDocument) => void;
}) {
  const student = studentById(studentId) || SCHOLARSHIP_STUDENTS[0];
  const internalDocs = documents.filter((d) => d.type === 'Internal');
  const govtDocs = documents.filter((d) => d.type === 'Government');

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="📱 My Scholarship Documents — Parent Portal View"
      size="lg"
    >
      <div className="space-y-5 text-xs">
        {/* Student card banner */}
        <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg flex items-center justify-between">
          <div>
            <div className="font-bold text-sm">{student.name}</div>
            <div className="text-[11px] text-blue-100">
              Class {student.cls} - {student.section} | GR No: {student.grNo}
            </div>
          </div>
          <Badge className="bg-white/20 text-white border-none">Active Student</Badge>
        </div>

        {/* Internal Documents */}
        <div>
          <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-1.5">
            🏫 INTERNAL SCHOLARSHIP DOCUMENTS
          </h4>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                <tr>
                  <th className="p-2.5">Document</th>
                  <th className="p-2.5">Date Issued</th>
                  <th className="p-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {internalDocs.slice(0, 3).map((d) => (
                  <tr key={d.id}>
                    <td className="p-2.5 font-medium text-gray-900">{d.docType}</td>
                    <td className="p-2.5 text-gray-600">{d.generatedOn}</td>
                    <td className="p-2.5 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDownloadDoc(d)}
                        className="h-7 text-xs text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <Download className="w-3 h-3 mr-1" /> Download PDF
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Govt Documents */}
        <div>
          <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-1.5">
            🏛️ GOVERNMENT SCHOLARSHIP DOCUMENTS
          </h4>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                <tr>
                  <th className="p-2.5">Document</th>
                  <th className="p-2.5">Date</th>
                  <th className="p-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {govtDocs.slice(0, 4).map((d) => (
                  <tr key={d.id}>
                    <td className="p-2.5 font-medium text-gray-900">{d.docType}</td>
                    <td className="p-2.5 text-gray-600">{d.generatedOn || '—'}</td>
                    <td className="p-2.5 text-right">
                      {d.status === 'Pending' ? (
                        <a
                          href="https://scholarships.gov.in"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                        >
                          Download from NSP <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDownloadDoc(d)}
                          className="h-7 text-xs text-purple-600 border-purple-200 hover:bg-purple-50"
                        >
                          <Download className="w-3 h-3 mr-1" /> Download PDF
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* NSP Note banner */}
        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-purple-900 text-xs">
          <div className="font-semibold mb-1">📌 To download your Government Scholarship Certificate:</div>
          <p className="text-purple-800">
            Visit <b>https://scholarships.gov.in</b> → Login → My Scholarships → Download Certificate.
            <br />
            Your NSP Ref. No.: <b className="font-mono">NSP-2025-OBC-78901234</b>
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close Portal View
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ScholarshipDocumentsReceipts;
