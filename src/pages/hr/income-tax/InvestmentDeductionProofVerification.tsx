// src/pages/hr/payroll/InvestmentDeductionProofVerification.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Textarea } from '../../../components/ui/Textarea';
import {
  Search,
  Download,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  AlertCircle,
  RefreshCw,
  Clock,
  Mail,
  History,
  X } from
'lucide-react';

interface Proof {
  id: string;
  name: string;
  code: string;
  email: string;
  department: string;
  section: string;
  sectionCode: string;
  declared: number;
  verified: number | null;
  uploaded: boolean;
  status: 'Pending' | 'Verified' | 'Rejected';
  date: string;
  documentName: string;
  documentSize: string;
  documentType: string;
  uploadedDate: string;
  hrRemarks: string;
  verifiedBy: string | null;
  verifiedDate: string | null;
  financialYear: string;
  rejectionReason: string | null;
}

interface VerificationHistory {
  id: string;
  proofId: string;
  action: string;
  performedBy: string;
  date: string;
  remarks: string;
}

const initialProofs: Proof[] = [
{
  id: '1',
  name: 'Rajesh Kumar',
  code: 'EMP001',
  email: 'rajesh.kumar@company.com',
  department: 'IT',
  section: '80C - LIC Premium',
  sectionCode: '80C',
  declared: 150000,
  verified: null,
  uploaded: true,
  status: 'Pending',
  date: '18 Jan 2025',
  documentName: 'LIC_Premium_Receipt_2024.pdf',
  documentSize: '245 KB',
  documentType: 'application/pdf',
  uploadedDate: '18 Jan 2025 10:30 AM',
  hrRemarks: '',
  verifiedBy: null,
  verifiedDate: null,
  financialYear: '2024-25',
  rejectionReason: null
},
{
  id: '2',
  name: 'Priya Sharma',
  code: 'EMP002',
  email: 'priya.sharma@company.com',
  department: 'HR',
  section: '80D - Health Insurance',
  sectionCode: '80D',
  declared: 25000,
  verified: 25000,
  uploaded: true,
  status: 'Verified',
  date: '20 Jan 2025',
  documentName: 'Health_Insurance_Policy_2024.pdf',
  documentSize: '512 KB',
  documentType: 'application/pdf',
  uploadedDate: '19 Jan 2025 02:15 PM',
  hrRemarks: 'Document verified successfully. Policy is valid for FY 2024-25.',
  verifiedBy: 'HR Admin',
  verifiedDate: '20 Jan 2025 11:00 AM',
  financialYear: '2024-25',
  rejectionReason: null
},
{
  id: '3',
  name: 'Amit Patel',
  code: 'EMP003',
  email: 'amit.patel@company.com',
  department: 'Finance',
  section: 'HRA - Rent Receipts',
  sectionCode: 'HRA',
  declared: 120000,
  verified: null,
  uploaded: true,
  status: 'Rejected',
  date: '19 Jan 2025',
  documentName: 'Rent_Receipts_Q1_Q2_2024.pdf',
  documentSize: '1.2 MB',
  documentType: 'application/pdf',
  uploadedDate: '17 Jan 2025 04:45 PM',
  hrRemarks: 'Rent receipts do not have landlord PAN. Please upload corrected documents.',
  verifiedBy: 'HR Admin',
  verifiedDate: '19 Jan 2025 03:30 PM',
  financialYear: '2024-25',
  rejectionReason: 'Missing landlord PAN number on rent receipts'
},
{
  id: '4',
  name: 'Sneha Reddy',
  code: 'EMP004',
  email: 'sneha.reddy@company.com',
  department: 'IT',
  section: '80C - PPF',
  sectionCode: '80C',
  declared: 100000,
  verified: null,
  uploaded: true,
  status: 'Pending',
  date: '21 Jan 2025',
  documentName: 'PPF_Statement_2024.pdf',
  documentSize: '156 KB',
  documentType: 'application/pdf',
  uploadedDate: '21 Jan 2025 09:00 AM',
  hrRemarks: '',
  verifiedBy: null,
  verifiedDate: null,
  financialYear: '2024-25',
  rejectionReason: null
},
{
  id: '5',
  name: 'Vikram Singh',
  code: 'EMP005',
  email: 'vikram.singh@company.com',
  department: 'Finance',
  section: '80E - Education Loan',
  sectionCode: '80E',
  declared: 45000,
  verified: null,
  uploaded: true,
  status: 'Pending',
  date: '22 Jan 2025',
  documentName: 'Education_Loan_Interest_Certificate.pdf',
  documentSize: '320 KB',
  documentType: 'application/pdf',
  uploadedDate: '22 Jan 2025 11:30 AM',
  hrRemarks: '',
  verifiedBy: null,
  verifiedDate: null,
  financialYear: '2024-25',
  rejectionReason: null
},
{
  id: '6',
  name: 'Kavita Joshi',
  code: 'EMP006',
  email: 'kavita.joshi@company.com',
  department: 'HR',
  section: '80G - Donations',
  sectionCode: '80G',
  declared: 15000,
  verified: 15000,
  uploaded: true,
  status: 'Verified',
  date: '20 Jan 2025',
  documentName: 'Donation_Receipt_PM_CARES.pdf',
  documentSize: '89 KB',
  documentType: 'application/pdf',
  uploadedDate: '18 Jan 2025 03:20 PM',
  hrRemarks: 'Donation to PM CARES Fund verified. 100% deduction applicable.',
  verifiedBy: 'HR Admin',
  verifiedDate: '20 Jan 2025 02:00 PM',
  financialYear: '2024-25',
  rejectionReason: null
}];


const initialHistory: VerificationHistory[] = [
{
  id: '1',
  proofId: '2',
  action: 'Verified',
  performedBy: 'HR Admin',
  date: '20 Jan 2025 11:00 AM',
  remarks: 'Document verified successfully. Policy is valid for FY 2024-25.'
},
{
  id: '2',
  proofId: '3',
  action: 'Rejected',
  performedBy: 'HR Admin',
  date: '19 Jan 2025 03:30 PM',
  remarks: 'Missing landlord PAN number on rent receipts'
},
{
  id: '3',
  proofId: '6',
  action: 'Verified',
  performedBy: 'HR Admin',
  date: '20 Jan 2025 02:00 PM',
  remarks: 'Donation to PM CARES Fund verified. 100% deduction applicable.'
}];


export function InvestmentDeductionProofVerification() {
  const [proofs, setProofs] = useState<Proof[]>(initialProofs);
  const [filteredProofs, setFilteredProofs] = useState<Proof[]>(initialProofs);
  const [selectedProof, setSelectedProof] = useState<Proof | null>(null);
  const [verificationHistory, setVerificationHistory] = useState<VerificationHistory[]>(initialHistory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFY, setSelectedFY] = useState('2024-25');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [verifiedAmount, setVerifiedAmount] = useState('');
  const [hrRemarks, setHrRemarks] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const fyOptions = [
  { value: '2024-25', label: 'FY 2024-25' },
  { value: '2023-24', label: 'FY 2023-24' },
  { value: '2022-23', label: 'FY 2022-23' }];


  const departmentOptions = [
  { value: 'all', label: 'All Departments' },
  { value: 'it', label: 'IT' },
  { value: 'hr', label: 'HR' },
  { value: 'finance', label: 'Finance' }];


  const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending Verification' },
  { value: 'verified', label: 'Verified' },
  { value: 'rejected', label: 'Rejected' }];


  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`;

  const applyFilters = useCallback(() => {
    let filtered = [...proofs];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (proof) =>
        proof.name.toLowerCase().includes(query) ||
        proof.code.toLowerCase().includes(query) ||
        proof.section.toLowerCase().includes(query) ||
        proof.email.toLowerCase().includes(query)
      );
    }

    if (selectedFY !== 'all') {
      filtered = filtered.filter((proof) => proof.financialYear === selectedFY);
    }

    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(
        (proof) => proof.department.toLowerCase() === selectedDepartment
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(
        (proof) => proof.status.toLowerCase() === selectedStatus
      );
    }

    setFilteredProofs(filtered);
  }, [proofs, searchQuery, selectedFY, selectedDepartment, selectedStatus]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFYChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFY(e.target.value);
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartment(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
  };

  const handleViewProof = (proof: Proof) => {
    setSelectedProof(proof);
    setVerifiedAmount(proof.verified?.toString() || proof.declared.toString());
    setHrRemarks(proof.hrRemarks || '');
    setShowHistory(false);
    setShowPreview(false);
  };

  const handleCloseDrawer = () => {
    setSelectedProof(null);
    setVerifiedAmount('');
    setHrRemarks('');
    setShowHistory(false);
    setShowPreview(false);
  };

  const handlePreviewDocument = () => {
    if (!selectedProof) return;

    setShowPreview(true);

    const previewWindow = window.open('', '_blank', 'width=800,height=600');
    if (!previewWindow) {
      alert('Please allow pop-ups to preview the document');
      setShowPreview(false);
      return;
    }

    const previewContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Document Preview - ${selectedProof.documentName}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              background: #f5f5f5;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #1e40af;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .document-icon {
              font-size: 64px;
              color: #1e40af;
            }
            .document-info {
              margin: 20px 0;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #eee;
            }
            .label {
              color: #666;
              font-weight: 500;
            }
            .value {
              color: #333;
              font-weight: 600;
            }
            .preview-area {
              background: #f8f9fa;
              border: 2px dashed #ddd;
              padding: 60px;
              text-align: center;
              margin: 30px 0;
              border-radius: 8px;
            }
            .preview-area p {
              color: #666;
              margin: 10px 0;
            }
            .btn {
              padding: 12px 24px;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-size: 14px;
              font-weight: 600;
              margin: 5px;
            }
            .btn-primary {
              background: #1e40af;
              color: white;
            }
            .btn-secondary {
              background: #e5e7eb;
              color: #333;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="document-icon">📄</div>
              <h2>${selectedProof.documentName}</h2>
              <p style="color: #666;">Document Preview</p>
            </div>
            
            <div class="document-info">
              <div class="info-row">
                <span class="label">Employee Name:</span>
                <span class="value">${selectedProof.name} (${selectedProof.code})</span>
              </div>
              <div class="info-row">
                <span class="label">Investment Section:</span>
                <span class="value">${selectedProof.section}</span>
              </div>
              <div class="info-row">
                <span class="label">Declared Amount:</span>
                <span class="value">${formatCurrency(selectedProof.declared)}</span>
              </div>
              <div class="info-row">
                <span class="label">Document Type:</span>
                <span class="value">${selectedProof.documentType}</span>
              </div>
              <div class="info-row">
                <span class="label">File Size:</span>
                <span class="value">${selectedProof.documentSize}</span>
              </div>
              <div class="info-row">
                <span class="label">Uploaded On:</span>
                <span class="value">${selectedProof.uploadedDate}</span>
              </div>
              <div class="info-row">
                <span class="label">Status:</span>
                <span class="value">${selectedProof.status}</span>
              </div>
            </div>
            
            <div class="preview-area">
              <div style="font-size: 48px;">📋</div>
              <p><strong>Document Content Preview</strong></p>
              <p>This is a simulated preview of the uploaded document.</p>
              <p>In production, the actual PDF/Image would be rendered here.</p>
            </div>
            
            <div style="text-align: center;">
              <button class="btn btn-primary" onclick="window.print()">🖨️ Print Document</button>
              <button class="btn btn-secondary" onclick="window.close()">Close Preview</button>
            </div>
          </div>
        </body>
      </html>
    `;

    previewWindow.document.write(previewContent);
    previewWindow.document.close();
    setShowPreview(false);
  };

  const handleDownloadDocument = () => {
    if (!selectedProof) return;

    setIsLoading(true);

    setTimeout(() => {
      const documentContent = `
INVESTMENT PROOF DOCUMENT
========================

Employee Details:
- Name: ${selectedProof.name}
- Code: ${selectedProof.code}
- Department: ${selectedProof.department}
- Email: ${selectedProof.email}

Investment Details:
- Section: ${selectedProof.section}
- Declared Amount: ${formatCurrency(selectedProof.declared)}
- Financial Year: ${selectedProof.financialYear}

Document Details:
- File Name: ${selectedProof.documentName}
- File Size: ${selectedProof.documentSize}
- Uploaded On: ${selectedProof.uploadedDate}

Verification Status: ${selectedProof.status}
${selectedProof.verifiedBy ? `Verified By: ${selectedProof.verifiedBy}` : ''}
${selectedProof.verifiedDate ? `Verified On: ${selectedProof.verifiedDate}` : ''}
${selectedProof.hrRemarks ? `HR Remarks: ${selectedProof.hrRemarks}` : ''}

---
This is a simulated document download.
Generated on: ${new Date().toLocaleString('en-IN')}
      `;

      const blob = new Blob([documentContent], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = selectedProof.documentName.replace('.pdf', '.txt');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      setIsLoading(false);
      alert(`Document "${selectedProof.documentName}" downloaded successfully!`);
    }, 1000);
  };

  const handleApproveProof = () => {
    if (!selectedProof) return;

    if (!verifiedAmount || parseFloat(verifiedAmount) <= 0) {
      alert('Please enter a valid verified amount');
      return;
    }

    if (!hrRemarks.trim()) {
      alert('Please enter HR remarks for approval');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const updatedProofs = proofs.map((proof) => {
        if (proof.id === selectedProof.id) {
          return {
            ...proof,
            status: 'Verified' as const,
            verified: parseFloat(verifiedAmount),
            hrRemarks: hrRemarks,
            verifiedBy: 'HR Admin',
            verifiedDate: new Date().toLocaleString('en-IN')
          };
        }
        return proof;
      });

      const newHistoryEntry: VerificationHistory = {
        id: (verificationHistory.length + 1).toString(),
        proofId: selectedProof.id,
        action: 'Verified',
        performedBy: 'HR Admin',
        date: new Date().toLocaleString('en-IN'),
        remarks: hrRemarks
      };

      setProofs(updatedProofs);
      setVerificationHistory([...verificationHistory, newHistoryEntry]);
      setIsProcessing(false);

      alert(
        `✅ Proof Approved Successfully!\n\nEmployee: ${selectedProof.name}\nSection: ${selectedProof.section}\nVerified Amount: ${formatCurrency(parseFloat(verifiedAmount))}`
      );

      handleCloseDrawer();
    }, 1500);
  };

  const handleRejectProof = () => {
    if (!selectedProof) return;

    if (!hrRemarks.trim()) {
      alert('Please enter the reason for rejection in HR remarks');
      return;
    }

    const confirmReject = window.confirm(
      `Are you sure you want to reject this proof?\n\nEmployee: ${selectedProof.name}\nSection: ${selectedProof.section}\nReason: ${hrRemarks}`
    );

    if (!confirmReject) return;

    setIsProcessing(true);

    setTimeout(() => {
      const updatedProofs = proofs.map((proof) => {
        if (proof.id === selectedProof.id) {
          return {
            ...proof,
            status: 'Rejected' as const,
            verified: null,
            hrRemarks: hrRemarks,
            verifiedBy: 'HR Admin',
            verifiedDate: new Date().toLocaleString('en-IN'),
            rejectionReason: hrRemarks
          };
        }
        return proof;
      });

      const newHistoryEntry: VerificationHistory = {
        id: (verificationHistory.length + 1).toString(),
        proofId: selectedProof.id,
        action: 'Rejected',
        performedBy: 'HR Admin',
        date: new Date().toLocaleString('en-IN'),
        remarks: hrRemarks
      };

      setProofs(updatedProofs);
      setVerificationHistory([...verificationHistory, newHistoryEntry]);
      setIsProcessing(false);

      alert(
        `❌ Proof Rejected\n\nEmployee: ${selectedProof.name}\nSection: ${selectedProof.section}\nReason: ${hrRemarks}`
      );

      handleCloseDrawer();
    }, 1500);
  };

  const handleRequestMoreInfo = () => {
    if (!selectedProof) return;

    if (!hrRemarks.trim()) {
      alert('Please specify what additional information is required');
      return;
    }

    setIsSendingEmail(true);

    setTimeout(() => {
      const updatedProofs = proofs.map((proof) => {
        if (proof.id === selectedProof.id) {
          return {
            ...proof,
            hrRemarks: hrRemarks
          };
        }
        return proof;
      });

      setProofs(updatedProofs);
      setIsSendingEmail(false);

      alert(
        `📧 Request for More Information Sent!\n\nEmployee: ${selectedProof.name}\nEmail: ${selectedProof.email}\nMessage: ${hrRemarks}`
      );

      console.log(`Email sent to ${selectedProof.email}:`);
      console.log(`Subject: Additional Information Required for ${selectedProof.section}`);
      console.log(`Message: ${hrRemarks}`);
    }, 1500);
  };

  const handleExportReport = () => {
    setIsExporting(true);

    const exportChoice = window.confirm(
      'Export Proof Verification Report\n\n• Click OK for PDF format\n• Click Cancel for CSV format'
    );

    setTimeout(() => {
      if (exportChoice) {
        handleExportPDF();
      } else {
        handleExportCSV();
      }
      setIsExporting(false);
    }, 1000);
  };

  const handleExportCSV = () => {
    const headers = [
    'S.No',
    'Employee Name',
    'Employee Code',
    'Department',
    'Email',
    'Section',
    'Declared Amount',
    'Verified Amount',
    'Status',
    'Submission Date',
    'Verified By',
    'Verification Date',
    'HR Remarks'];


    const csvData = filteredProofs.map((proof, index) => [
    index + 1,
    proof.name,
    proof.code,
    proof.department,
    proof.email,
    proof.section,
    proof.declared,
    proof.verified || 'N/A',
    proof.status,
    proof.date,
    proof.verifiedBy || 'N/A',
    proof.verifiedDate || 'N/A',
    proof.hrRemarks || 'N/A']
    );

    const summary = {
      total: filteredProofs.length,
      pending: filteredProofs.filter((p) => p.status === 'Pending').length,
      verified: filteredProofs.filter((p) => p.status === 'Verified').length,
      rejected: filteredProofs.filter((p) => p.status === 'Rejected').length,
      totalDeclared: filteredProofs.reduce((sum, p) => sum + p.declared, 0),
      totalVerified: filteredProofs.reduce((sum, p) => sum + (p.verified || 0), 0)
    };

    let csvContent = `Investment / Deduction Proof Verification Report\n`;
    csvContent += `Company: ACME Corporation Pvt. Ltd.\n`;
    csvContent += `Financial Year: ${fyOptions.find((f) => f.value === selectedFY)?.label}\n`;
    csvContent += `Department: ${departmentOptions.find((d) => d.value === selectedDepartment)?.label}\n`;
    csvContent += `Status Filter: ${statusOptions.find((s) => s.value === selectedStatus)?.label}\n`;
    csvContent += `Generated on: ${new Date().toLocaleString('en-IN')}\n\n`;
    csvContent += `Summary:\n`;
    csvContent += `Total Submissions: ${summary.total}\n`;
    csvContent += `Pending: ${summary.pending}\n`;
    csvContent += `Verified: ${summary.verified}\n`;
    csvContent += `Rejected: ${summary.rejected}\n`;
    csvContent += `Total Declared: ${formatCurrency(summary.totalDeclared)}\n`;
    csvContent += `Total Verified: ${formatCurrency(summary.totalVerified)}\n\n`;
    csvContent += headers.join(',') + '\n';
    csvContent += csvData.map((row) => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Proof_Verification_Report_${selectedFY}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    alert('CSV report downloaded successfully!');
  };

  const handleExportPDF = async () => {
    try {
      const jsPDFModule = await import('jspdf');
      await import('jspdf-autotable');

      const jsPDF = jsPDFModule.default;
      const doc = new jsPDF('l', 'mm', 'a4') as any;

      doc.setFontSize(18);
      doc.text('Investment / Deduction Proof Verification Report', 148, 12, { align: 'center' });

      doc.setFontSize(10);
      doc.text(`Financial Year: ${fyOptions.find((f) => f.value === selectedFY)?.label}`, 148, 20, {
        align: 'center'
      });
      doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 148, 26, { align: 'center' });

      const summary = {
        total: filteredProofs.length,
        pending: filteredProofs.filter((p) => p.status === 'Pending').length,
        verified: filteredProofs.filter((p) => p.status === 'Verified').length,
        rejected: filteredProofs.filter((p) => p.status === 'Rejected').length
      };

      doc.setFontSize(9);
      doc.text(
        `Total: ${summary.total} | Pending: ${summary.pending} | Verified: ${summary.verified} | Rejected: ${summary.rejected}`,
        148,
        32,
        { align: 'center' }
      );

      const tableData = filteredProofs.map((proof, index) => [
      index + 1,
      `${proof.name}\n${proof.code}`,
      proof.section,
      formatCurrency(proof.declared),
      proof.verified ? formatCurrency(proof.verified) : '-',
      proof.status,
      proof.date]
      );

      doc.autoTable({
        startY: 38,
        head: [['S.No', 'Employee', 'Section', 'Declared', 'Verified', 'Status', 'Date']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [30, 64, 175], fontSize: 9 },
        bodyStyles: { fontSize: 8 },
        columnStyles: {
          0: { halign: 'center', cellWidth: 15 },
          3: { halign: 'right' },
          4: { halign: 'right' },
          5: { halign: 'center' },
          6: { halign: 'center' }
        }
      });

      doc.save(`Proof_Verification_Report_${selectedFY}.pdf`);
      alert('PDF report downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('PDF generation failed. Downloading CSV instead.');
      handleExportCSV();
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      applyFilters();
      setIsLoading(false);
      alert('Data refreshed successfully!');
    }, 1000);
  };

  const handleBulkApprove = () => {
    const pendingProofs = filteredProofs.filter((p) => p.status === 'Pending');

    if (pendingProofs.length === 0) {
      alert('No pending proofs to approve');
      return;
    }

    const confirmBulk = window.confirm(
      `Bulk Approve ${pendingProofs.length} Pending Proofs?\n\nThis will approve all pending proofs with their declared amounts.\n\nEmployees:\n${pendingProofs.map((p) => `• ${p.name} - ${p.section}`).join('\n')}`
    );

    if (!confirmBulk) return;

    setIsProcessing(true);

    setTimeout(() => {
      const updatedProofs = proofs.map((proof) => {
        if (proof.status === 'Pending') {
          return {
            ...proof,
            status: 'Verified' as const,
            verified: proof.declared,
            hrRemarks: 'Bulk approved',
            verifiedBy: 'HR Admin',
            verifiedDate: new Date().toLocaleString('en-IN')
          };
        }
        return proof;
      });

      setProofs(updatedProofs);
      setIsProcessing(false);

      alert(`✅ ${pendingProofs.length} proofs approved successfully!`);
    }, 2000);
  };

  const handleSendReminders = () => {
    const pendingProofs = filteredProofs.filter((p) => p.status === 'Pending');

    if (pendingProofs.length === 0) {
      alert('No pending proofs to send reminders for');
      return;
    }

    const confirmSend = window.confirm(
      `Send Verification Pending Reminders?\n\nThis will send email reminders to ${pendingProofs.length} employees with pending verifications.`
    );

    if (!confirmSend) return;

    setIsSendingEmail(true);

    setTimeout(() => {
      pendingProofs.forEach((proof) => {
        console.log(`Reminder sent to ${proof.email}:`);
        console.log(`Subject: Investment Proof Verification Pending - ${proof.section}`);
        console.log(`Message: Your investment proof for ${proof.section} is pending verification.`);
      });

      setIsSendingEmail(false);
      alert(`📧 Reminders sent to ${pendingProofs.length} employees!`);
    }, 2000);
  };

  const handleViewHistory = () => {
    setShowHistory(!showHistory);
  };

  const getProofHistory = (proofId: string) => {
    return verificationHistory.filter((h) => h.proofId === proofId);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Investment / Deduction Proof Verification
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            HR &gt; Payroll &gt; Income Tax &gt; Proof Verification
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleSendReminders} disabled={isSendingEmail}>
            <Mail className={`w-4 h-4 mr-2 ${isSendingEmail ? 'animate-pulse' : ''}`} />
            Send Reminders
          </Button>
          <Button variant="outline" onClick={handleBulkApprove} disabled={isProcessing}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Bulk Approve
          </Button>
          <Button variant="primary" onClick={handleExportReport} disabled={isExporting}>
            <Download className={`w-4 h-4 mr-2 ${isExporting ? 'animate-bounce' : ''}`} />
            {isExporting ? 'Exporting...' : 'Export Report'}
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search employee, code, section..."
              className="pl-10"
              value={searchQuery}
              onChange={handleSearch} />

          </div>
          <Select options={fyOptions} value={selectedFY} onChange={handleFYChange} />
          <Select options={departmentOptions} value={selectedDepartment} onChange={handleDepartmentChange} />
          <Select options={statusOptions} value={selectedStatus} onChange={handleStatusChange} />
        </div>
      </Card>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-500">Total Submissions</p>
            <p className="text-2xl font-bold text-gray-900">{filteredProofs.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {filteredProofs.filter((p) => p.status === 'Pending').length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Verified</p>
            <p className="text-2xl font-bold text-green-600">
              {filteredProofs.filter((p) => p.status === 'Verified').length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Rejected</p>
            <p className="text-2xl font-bold text-red-600">
              {filteredProofs.filter((p) => p.status === 'Rejected').length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Declared</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(filteredProofs.reduce((sum, p) => sum + p.declared, 0))}
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Employee</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Section</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">Declared</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">Verified</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">Proof</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Date</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProofs.length === 0 ?
              <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No proofs found matching your filters. Try adjusting your search criteria.
                  </td>
                </tr> :

              filteredProofs.map((proof) =>
              <tr key={proof.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{proof.name}</p>
                        <p className="text-xs text-gray-500">{proof.code}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{proof.section}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      {formatCurrency(proof.declared)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-green-600">
                      {proof.verified ? formatCurrency(proof.verified) : '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {proof.uploaded ?
                  <Badge className="bg-blue-100 text-blue-700">
                          <FileText className="w-3 h-3 mr-1" />
                          Uploaded
                        </Badge> :

                  <Badge className="bg-gray-100 text-gray-700">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                  }
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                    className={
                    proof.status === 'Verified' ?
                    'bg-green-100 text-green-700' :
                    proof.status === 'Pending' ?
                    'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                    }>

                        {proof.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{proof.date}</td>
                    <td className="px-4 py-3 text-center">
                      <Button variant="ghost" size="sm" onClick={() => handleViewProof(proof)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
              )
              }
            </tbody>
          </table>
        </div>
      </Card>

      {selectedProof &&
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-2xl h-full overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center z-10">
              <h2 className="text-lg font-bold text-gray-900">Verify Investment Proof</h2>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleViewHistory}>
                  <History className="w-4 h-4 mr-1" />
                  History
                </Button>
                <Button variant="ghost" size="sm" onClick={handleCloseDrawer}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <Card className="p-4 bg-gray-50">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Employee Name</p>
                    <p className="font-medium text-gray-900">{selectedProof.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Employee Code</p>
                    <p className="font-medium text-gray-900">{selectedProof.code}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Department</p>
                    <p className="font-medium text-gray-900">{selectedProof.department}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{selectedProof.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Investment Section</p>
                    <p className="font-medium text-gray-900">{selectedProof.section}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Declared Amount</p>
                    <p className="font-medium text-gray-900">{formatCurrency(selectedProof.declared)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Financial Year</p>
                    <p className="font-medium text-gray-900">{selectedProof.financialYear}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Current Status</p>
                    <Badge
                    className={
                    selectedProof.status === 'Verified' ?
                    'bg-green-100 text-green-700' :
                    selectedProof.status === 'Pending' ?
                    'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                    }>

                      {selectedProof.status}
                    </Badge>
                  </div>
                </div>
              </Card>

              {showHistory &&
            <Card className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Verification History</h3>
                  {getProofHistory(selectedProof.id).length > 0 ?
              <div className="space-y-3">
                      {getProofHistory(selectedProof.id).map((history) =>
                <div key={history.id} className="border-l-2 border-blue-500 pl-3 py-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <Badge
                        className={
                        history.action === 'Verified' ?
                        'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                        }>

                                {history.action}
                              </Badge>
                              <p className="text-sm text-gray-600 mt-1">{history.remarks}</p>
                            </div>
                            <div className="text-right text-xs text-gray-500">
                              <p>{history.performedBy}</p>
                              <p>{history.date}</p>
                            </div>
                          </div>
                        </div>
                )}
                    </div> :

              <p className="text-sm text-gray-500">No verification history available.</p>
              }
                </Card>
            }

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Uploaded Document</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-900 mb-1">{selectedProof.documentName}</p>
                  <p className="text-xs text-gray-500 mb-1">Size: {selectedProof.documentSize}</p>
                  <p className="text-xs text-gray-500 mb-3">Uploaded on {selectedProof.uploadedDate}</p>
                  <div className="flex justify-center gap-2">
                    <Button variant="outline" size="sm" onClick={handlePreviewDocument} disabled={showPreview}>
                      <Eye className="w-4 h-4 mr-2" />
                      {showPreview ? 'Opening...' : 'Preview'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownloadDocument} disabled={isLoading}>
                      <Download className="w-4 h-4 mr-2" />
                      {isLoading ? 'Downloading...' : 'Download'}
                    </Button>
                  </div>
                </div>
              </div>

              {selectedProof.status === 'Pending' &&
            <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Verified Amount *</label>
                    <Input
                  type="number"
                  placeholder="Enter verified amount"
                  value={verifiedAmount}
                  onChange={(e) => setVerifiedAmount(e.target.value)} />

                    <p className="text-xs text-gray-500 mt-1">
                      Enter the amount verified from the proof document
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">HR Remarks *</label>
                    <Textarea
                  rows={4}
                  placeholder="Enter verification remarks, observations, or reasons for rejection..."
                  value={hrRemarks}
                  onChange={(e) => setHrRemarks(e.target.value)} />

                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-1">Verification Guidelines</p>
                        <ul className="space-y-1 text-blue-700">
                          <li>• Check document authenticity and validity period</li>
                          <li>• Verify amount matches the declared amount</li>
                          <li>• Ensure document is in employee's name</li>
                          <li>• Check for proper stamps/signatures if required</li>
                          <li>• For HRA: Verify landlord PAN if rent exceeds ₹1,00,000/year</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                  variant="primary"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={handleApproveProof}
                  disabled={isProcessing}>

                      <CheckCircle className="w-4 h-4 mr-2" />
                      {isProcessing ? 'Processing...' : 'Approve & Verify'}
                    </Button>
                    <Button
                  variant="outline"
                  className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                  onClick={handleRejectProof}
                  disabled={isProcessing}>

                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Proof
                    </Button>
                  </div>

                  <Button
                variant="outline"
                className="w-full"
                onClick={handleRequestMoreInfo}
                disabled={isSendingEmail}>

                    <Mail className="w-4 h-4 mr-2" />
                    {isSendingEmail ? 'Sending...' : 'Request More Information'}
                  </Button>
                </>
            }

              {selectedProof.status !== 'Pending' &&
            <Card className="p-4 bg-gray-50">
                  <h3 className="font-semibold text-gray-900 mb-3">Verification Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Verified Amount</p>
                      <p className="font-medium text-green-600">
                        {selectedProof.verified ? formatCurrency(selectedProof.verified) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Verified By</p>
                      <p className="font-medium text-gray-900">{selectedProof.verifiedBy || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Verification Date</p>
                      <p className="font-medium text-gray-900">{selectedProof.verifiedDate || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Status</p>
                      <Badge
                    className={
                    selectedProof.status === 'Verified' ?
                    'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                    }>

                        {selectedProof.status}
                      </Badge>
                    </div>
                    {selectedProof.hrRemarks &&
                <div className="col-span-2">
                        <p className="text-gray-600">HR Remarks</p>
                        <p className="font-medium text-gray-900">{selectedProof.hrRemarks}</p>
                      </div>
                }
                    {selectedProof.rejectionReason &&
                <div className="col-span-2">
                        <p className="text-gray-600">Rejection Reason</p>
                        <p className="font-medium text-red-600">{selectedProof.rejectionReason}</p>
                      </div>
                }
                  </div>
                </Card>
            }
            </div>
          </div>
        </div>
      }
    </div>);

}