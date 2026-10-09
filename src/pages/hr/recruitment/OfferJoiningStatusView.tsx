import React, { useMemo, useState, useCallback } from 'react';
import {
  Building,
  X,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  AlertCircle,
  Download,
  Eye,
  RefreshCw,
  Filter,
  FileText,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  UserX,
  Loader2,
  Edit,
  Send,
  Upload,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Save,
  Printer,
  UserPlus,
  FileCheck,
  FilePlus,
  Trash2 } from
'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';

const BRANCHES = [
{ id: 'all', name: 'All Branches' },
{ id: 'main', name: 'Main Campus' },
{ id: 'north', name: 'North Wing' },
{ id: 'south', name: 'South Wing' },
{ id: 'east', name: 'East Campus' }];


const ACADEMIC_YEARS = [
{ value: '2024-2025', label: '2024-2025' },
{ value: '2023-2024', label: '2023-2024' },
{ value: '2022-2023', label: '2022-2023' }];


type OfferStatus = 'Offer Pending' | 'Accepted' | 'Rejected' | 'Joined' | 'No Show';
type DocStatus = 'Pending' | 'Partial' | 'Complete';

interface Document {
  id: string;
  name: string;
  type: string;
  status: 'Uploaded' | 'Pending' | 'Verified' | 'Rejected';
  uploadedDate?: string;
  verifiedDate?: string;
  fileUrl?: string;
}

interface OfferRecord {
  id: string;
  candidate: string;
  avatar: string;
  email: string;
  phone: string;
  address: string;
  position: string;
  department: string;
  qualification: string;
  experience: string;
  offeredSalary: number;
  offerDate: string;
  offerLetterUrl?: string;
  acceptanceStatus: OfferStatus;
  expectedDOJ: string;
  actualDOJ?: string;
  docStatus: DocStatus;
  documents: Document[];
  convertedToEmployee: boolean;
  employeeId?: string;
  branch: string;
  remarks?: string;
  statusHistory: Array<{
    status: OfferStatus;
    date: string;
    updatedBy: string;
    remarks?: string;
  }>;
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

const initialOffers: OfferRecord[] = [
{
  id: 'OFF-2024-001',
  candidate: 'Amit Gupta',
  avatar: 'AG',
  email: 'amit.gupta@email.com',
  phone: '+91 98765 43210',
  address: '123, Sector 15, Noida, UP',
  position: 'Math Teacher',
  department: 'Mathematics',
  qualification: 'M.Sc Mathematics, B.Ed',
  experience: '5 years',
  offeredSalary: 45000,
  offerDate: '2024-12-01',
  offerLetterUrl: '/offers/OFF-2024-001.pdf',
  acceptanceStatus: 'Accepted',
  expectedDOJ: '2025-01-15',
  docStatus: 'Complete',
  documents: [
  { id: 'doc1', name: 'Resume', type: 'PDF', status: 'Verified', uploadedDate: '2024-12-02', verifiedDate: '2024-12-03' },
  { id: 'doc2', name: 'ID Proof', type: 'PDF', status: 'Verified', uploadedDate: '2024-12-02', verifiedDate: '2024-12-03' },
  { id: 'doc3', name: 'Education Certificates', type: 'PDF', status: 'Verified', uploadedDate: '2024-12-02', verifiedDate: '2024-12-03' },
  { id: 'doc4', name: 'Experience Letter', type: 'PDF', status: 'Verified', uploadedDate: '2024-12-02', verifiedDate: '2024-12-03' }],

  convertedToEmployee: false,
  branch: 'main',
  remarks: 'Excellent candidate with strong teaching background',
  statusHistory: [
  { status: 'Offer Pending', date: '2024-12-01', updatedBy: 'HR Admin' },
  { status: 'Accepted', date: '2024-12-05', updatedBy: 'System', remarks: 'Candidate accepted via email' }]

},
{
  id: 'OFF-2024-002',
  candidate: 'Anita Desai',
  avatar: 'AD',
  email: 'anita.desai@email.com',
  phone: '+91 98765 43211',
  address: '456, MG Road, Delhi',
  position: 'Admin Officer',
  department: 'Administration',
  qualification: 'MBA, Graduate',
  experience: '3 years',
  offeredSalary: 35000,
  offerDate: '2024-12-05',
  offerLetterUrl: '/offers/OFF-2024-002.pdf',
  acceptanceStatus: 'Joined',
  expectedDOJ: '2024-12-15',
  actualDOJ: '2024-12-15',
  docStatus: 'Complete',
  documents: [
  { id: 'doc1', name: 'Resume', type: 'PDF', status: 'Verified', uploadedDate: '2024-12-06', verifiedDate: '2024-12-07' },
  { id: 'doc2', name: 'ID Proof', type: 'PDF', status: 'Verified', uploadedDate: '2024-12-06', verifiedDate: '2024-12-07' },
  { id: 'doc3', name: 'Education Certificates', type: 'PDF', status: 'Verified', uploadedDate: '2024-12-06', verifiedDate: '2024-12-07' }],

  convertedToEmployee: true,
  employeeId: 'EMP-2024-045',
  branch: 'north',
  statusHistory: [
  { status: 'Offer Pending', date: '2024-12-05', updatedBy: 'HR Admin' },
  { status: 'Accepted', date: '2024-12-08', updatedBy: 'System' },
  { status: 'Joined', date: '2024-12-15', updatedBy: 'HR Admin', remarks: 'Successfully joined' }]

},
{
  id: 'OFF-2024-003',
  candidate: 'Rahul Verma',
  avatar: 'RV',
  email: 'rahul.verma@email.com',
  phone: '+91 98765 43212',
  address: '789, Lajpat Nagar, Delhi',
  position: 'Science HOD',
  department: 'Science',
  qualification: 'Ph.D Physics, M.Sc, B.Ed',
  experience: '10 years',
  offeredSalary: 65000,
  offerDate: '2024-12-08',
  offerLetterUrl: '/offers/OFF-2024-003.pdf',
  acceptanceStatus: 'Offer Pending',
  expectedDOJ: '2025-01-20',
  docStatus: 'Pending',
  documents: [],
  convertedToEmployee: false,
  branch: 'main',
  remarks: 'Awaiting response from candidate',
  statusHistory: [
  { status: 'Offer Pending', date: '2024-12-08', updatedBy: 'HR Admin' }]

},
{
  id: 'OFF-2024-004',
  candidate: 'Kavita Joshi',
  avatar: 'KJ',
  email: 'kavita.joshi@email.com',
  phone: '+91 98765 43213',
  address: '101, Dwarka, Delhi',
  position: 'Art Teacher',
  department: 'Arts',
  qualification: 'BFA, MFA',
  experience: '4 years',
  offeredSalary: 30000,
  offerDate: '2024-11-20',
  acceptanceStatus: 'Rejected',
  expectedDOJ: '2024-12-01',
  docStatus: 'Pending',
  documents: [],
  convertedToEmployee: false,
  branch: 'east',
  remarks: 'Candidate declined due to salary expectations',
  statusHistory: [
  { status: 'Offer Pending', date: '2024-11-20', updatedBy: 'HR Admin' },
  { status: 'Rejected', date: '2024-11-25', updatedBy: 'System', remarks: 'Candidate rejected offer' }]

},
{
  id: 'OFF-2024-005',
  candidate: 'Suresh Kumar',
  avatar: 'SK',
  email: 'suresh.kumar@email.com',
  phone: '+91 98765 43214',
  address: '202, Rohini, Delhi',
  position: 'PE Teacher',
  department: 'Physical Education',
  qualification: 'B.P.Ed, M.P.Ed',
  experience: '6 years',
  offeredSalary: 32000,
  offerDate: '2024-12-10',
  offerLetterUrl: '/offers/OFF-2024-005.pdf',
  acceptanceStatus: 'Accepted',
  expectedDOJ: '2025-01-10',
  docStatus: 'Partial',
  documents: [
  { id: 'doc1', name: 'Resume', type: 'PDF', status: 'Verified', uploadedDate: '2024-12-11', verifiedDate: '2024-12-12' },
  { id: 'doc2', name: 'ID Proof', type: 'PDF', status: 'Uploaded', uploadedDate: '2024-12-11' },
  { id: 'doc3', name: 'Education Certificates', type: 'PDF', status: 'Pending' }],

  convertedToEmployee: false,
  branch: 'south',
  statusHistory: [
  { status: 'Offer Pending', date: '2024-12-10', updatedBy: 'HR Admin' },
  { status: 'Accepted', date: '2024-12-12', updatedBy: 'System' }]

},
{
  id: 'OFF-2024-006',
  candidate: 'Meera Patel',
  avatar: 'MP',
  email: 'meera.patel@email.com',
  phone: '+91 98765 43215',
  address: '303, Vasant Kunj, Delhi',
  position: 'CS Teacher',
  department: 'Computer Science',
  qualification: 'MCA, B.Ed',
  experience: '4 years',
  offeredSalary: 42000,
  offerDate: '2024-11-15',
  offerLetterUrl: '/offers/OFF-2024-006.pdf',
  acceptanceStatus: 'No Show',
  expectedDOJ: '2024-12-01',
  docStatus: 'Pending',
  documents: [],
  convertedToEmployee: false,
  branch: 'east',
  remarks: 'Candidate did not report on joining date',
  statusHistory: [
  { status: 'Offer Pending', date: '2024-11-15', updatedBy: 'HR Admin' },
  { status: 'Accepted', date: '2024-11-20', updatedBy: 'System' },
  { status: 'No Show', date: '2024-12-02', updatedBy: 'HR Admin', remarks: 'Did not report on joining date' }]

},
{
  id: 'OFF-2024-007',
  candidate: 'Vikram Singh',
  avatar: 'VS',
  email: 'vikram.singh@email.com',
  phone: '+91 98765 43216',
  address: '404, Saket, Delhi',
  position: 'English Teacher',
  department: 'English',
  qualification: 'M.A English, B.Ed',
  experience: '3 years',
  offeredSalary: 38000,
  offerDate: '2024-12-12',
  offerLetterUrl: '/offers/OFF-2024-007.pdf',
  acceptanceStatus: 'Offer Pending',
  expectedDOJ: '2025-02-01',
  docStatus: 'Pending',
  documents: [],
  convertedToEmployee: false,
  branch: 'south',
  statusHistory: [
  { status: 'Offer Pending', date: '2024-12-12', updatedBy: 'HR Admin' }]

}];


const statusConfig: Record<OfferStatus, {color: string;bg: string;icon: React.ElementType;}> = {
  'Offer Pending': { color: 'text-yellow-700', bg: 'bg-yellow-100', icon: Clock },
  Accepted: { color: 'text-blue-700', bg: 'bg-blue-100', icon: CheckCircle },
  Rejected: { color: 'text-red-700', bg: 'bg-red-100', icon: XCircle },
  Joined: { color: 'text-green-700', bg: 'bg-green-100', icon: UserCheck },
  'No Show': { color: 'text-gray-700', bg: 'bg-gray-100', icon: UserX }
};

const docStatusConfig = {
  Pending: 'bg-red-100 text-red-700',
  Partial: 'bg-yellow-100 text-yellow-700',
  Complete: 'bg-green-100 text-green-700'
};

const REQUIRED_DOCUMENTS = [
'Resume',
'ID Proof',
'Education Certificates',
'Experience Letter',
'Address Proof',
'Passport Photos',
'PAN Card',
'Bank Details'];


export function OfferJoiningStatusView() {
  // Existing state
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['all']);
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [filterStatus, setFilterStatus] = useState('all');

  // New state for interactive features
  const [offers, setOffers] = useState<OfferRecord[]>(initialOffers);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditStatusModal, setShowEditStatusModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [showResendOfferModal, setShowResendOfferModal] = useState(false);

  // Selected offer for operations
  const [selectedOffer, setSelectedOffer] = useState<OfferRecord | null>(null);

  // Form states
  const [newStatus, setNewStatus] = useState<OfferStatus>('Offer Pending');
  const [statusRemarks, setStatusRemarks] = useState('');
  const [actualJoiningDate, setActualJoiningDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Document upload state
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Toast functions
  const addToast = useCallback((type: Toast['type'], message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Branch handling (existing)
  const handleBranchToggle = (branchId: string) => {
    if (branchId === 'all') {
      setSelectedBranches(['all']);
    } else {
      const without = selectedBranches.filter((b) => b !== 'all' && b !== branchId);
      const adding = !selectedBranches.includes(branchId);
      const next = adding ? [...without, branchId] : without;
      setSelectedBranches(next.length === 0 ? ['all'] : next);
    }
  };

  const activeBranches = selectedBranches.includes('all') ?
  ['main', 'north', 'south', 'east'] :
  selectedBranches;

  const filtered = useMemo(
    () =>
    offers.filter((o) => {
      const branchMatch = activeBranches.includes(o.branch);
      const statusMatch = filterStatus === 'all' || o.acceptanceStatus === filterStatus;
      return branchMatch && statusMatch;
    }),
    [activeBranches, filterStatus, offers]
  );

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  }, [filtered, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getBranchName = (id: string) => BRANCHES.find((b) => b.id === id)?.name || id;

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    filtered.forEach((o) => {
      counts[o.acceptanceStatus] = (counts[o.acceptanceStatus] || 0) + 1;
    });
    return counts;
  }, [filtered]);

  // Export functionality
  const handleExport = async () => {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const headers = [
      'Offer ID',
      'Candidate Name',
      'Email',
      'Phone',
      'Position',
      'Department',
      'Offered Salary',
      'Offer Date',
      'Status',
      'Expected DOJ',
      'Actual DOJ',
      'Document Status',
      'Converted to Employee',
      'Employee ID',
      'Branch'];


      const csvData = filtered.map((o) => [
      o.id,
      o.candidate,
      o.email,
      o.phone,
      o.position,
      o.department,
      o.offeredSalary,
      o.offerDate,
      o.acceptanceStatus,
      o.expectedDOJ,
      o.actualDOJ || 'N/A',
      o.docStatus,
      o.convertedToEmployee ? 'Yes' : 'No',
      o.employeeId || 'N/A',
      getBranchName(o.branch)]
      );

      const csvContent = [
      headers.join(','),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(','))].
      join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Offer_Joining_Status_${academicYear}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addToast('success', 'Export completed successfully!');
    } catch (error) {
      addToast('error', 'Failed to export data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setOffers([...initialOffers]);
      setCurrentPage(1);
      addToast('info', 'Data refreshed successfully!');
    } catch (error) {
      addToast('error', 'Failed to refresh data. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // View offer details
  const openViewModal = (offer: OfferRecord) => {
    setSelectedOffer(offer);
    setShowViewModal(true);
  };

  // Download offer letter
  const handleDownloadOfferLetter = async (offer: OfferRecord) => {
    try {
      addToast('info', 'Generating offer letter...');

      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate offer letter content
      const offerLetterContent = generateOfferLetterContent(offer);

      const blob = new Blob([offerLetterContent], { type: 'text/html;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Offer_Letter_${offer.id}_${offer.candidate.replace(/\s+/g, '_')}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addToast('success', `Offer letter downloaded for ${offer.candidate}`);
    } catch (error) {
      addToast('error', 'Failed to download offer letter');
    }
  };

  // Generate offer letter HTML content
  const generateOfferLetterContent = (offer: OfferRecord) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Offer Letter - ${offer.candidate}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { margin: 0; font-size: 28px; }
            .header p { margin: 5px 0; color: #666; }
            .content { line-height: 1.8; }
            .details { background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .details table { width: 100%; }
            .details td { padding: 8px 0; }
            .details td:first-child { font-weight: bold; width: 40%; }
            .signature { margin-top: 50px; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>OFFER LETTER</h1>
            <p>Ref: ${offer.id}</p>
            <p>Date: ${offer.offerDate}</p>
          </div>
          
          <div class="content">
            <p>Dear <strong>${offer.candidate}</strong>,</p>
            
            <p>We are pleased to extend an offer of employment to you for the position of <strong>${offer.position}</strong> in the <strong>${offer.department}</strong> department at <strong>${getBranchName(offer.branch)}</strong>.</p>
            
            <div class="details">
              <table>
                <tr>
                  <td>Position:</td>
                  <td>${offer.position}</td>
                </tr>
                <tr>
                  <td>Department:</td>
                  <td>${offer.department}</td>
                </tr>
                <tr>
                  <td>Branch:</td>
                  <td>${getBranchName(offer.branch)}</td>
                </tr>
                <tr>
                  <td>Monthly Salary:</td>
                  <td>₹${offer.offeredSalary.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Expected Joining Date:</td>
                  <td>${offer.expectedDOJ}</td>
                </tr>
              </table>
            </div>
            
            <p>This offer is contingent upon:</p>
            <ul>
              <li>Successful completion of background verification</li>
              <li>Submission of all required documents</li>
              <li>Medical fitness certificate</li>
            </ul>
            
            <p>Please confirm your acceptance of this offer by signing and returning a copy of this letter within 7 days of receipt.</p>
            
            <p>We look forward to welcoming you to our team!</p>
            
            <div class="signature">
              <p>Warm regards,</p>
              <br><br>
              <p><strong>HR Department</strong></p>
              <p>School Management</p>
            </div>
          </div>
          
          <div class="footer">
            <p>This is a computer-generated offer letter.</p>
            <p>For any queries, please contact HR at hr@school.edu</p>
          </div>
        </body>
      </html>
    `;
  };

  // Print offer letter
  const handlePrintOfferLetter = (offer: OfferRecord) => {
    const content = generateOfferLetterContent(offer);
    const printWindow = window.open('', '_blank');

    if (printWindow) {
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
      addToast('info', 'Print dialog opened');
    } else {
      addToast('error', 'Could not open print window. Please check your popup blocker.');
    }
  };

  // Open edit status modal
  const openEditStatusModal = (offer: OfferRecord) => {
    setSelectedOffer(offer);
    setNewStatus(offer.acceptanceStatus);
    setStatusRemarks('');
    setActualJoiningDate(offer.actualDOJ || '');
    setShowEditStatusModal(true);
  };

  // Update offer status
  const handleUpdateStatus = async () => {
    if (!selectedOffer) return;

    setIsSaving(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const currentDate = new Date().toISOString().split('T')[0];

      setOffers((prev) =>
      prev.map((o) =>
      o.id === selectedOffer.id ?
      {
        ...o,
        acceptanceStatus: newStatus,
        actualDOJ: newStatus === 'Joined' ? actualJoiningDate || currentDate : o.actualDOJ,
        remarks: statusRemarks || o.remarks,
        statusHistory: [
        ...o.statusHistory,
        {
          status: newStatus,
          date: currentDate,
          updatedBy: 'Current User',
          remarks: statusRemarks
        }]

      } :
      o
      )
      );

      setShowEditStatusModal(false);
      setSelectedOffer(null);
      setStatusRemarks('');
      addToast('success', `Status updated to "${newStatus}" for ${selectedOffer.candidate}`);
    } catch (error) {
      addToast('error', 'Failed to update status. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Open documents modal
  const openDocumentsModal = (offer: OfferRecord) => {
    setSelectedOffer(offer);
    setShowDocumentsModal(true);
  };

  // Upload document
  const handleUploadDocument = async (docName: string) => {
    if (!selectedOffer) return;

    setUploadingDocId(docName);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const currentDate = new Date().toISOString().split('T')[0];
      const newDoc: Document = {
        id: `doc-${Date.now()}`,
        name: docName,
        type: 'PDF',
        status: 'Uploaded',
        uploadedDate: currentDate
      };

      setOffers((prev) =>
      prev.map((o) => {
        if (o.id === selectedOffer.id) {
          const existingDocIndex = o.documents.findIndex((d) => d.name === docName);
          let updatedDocs: Document[];

          if (existingDocIndex >= 0) {
            updatedDocs = o.documents.map((d, i) =>
            i === existingDocIndex ? { ...d, status: 'Uploaded', uploadedDate: currentDate } : d
            );
          } else {
            updatedDocs = [...o.documents, newDoc];
          }

          // Update doc status
          const pendingCount = REQUIRED_DOCUMENTS.filter(
            (rd) => !updatedDocs.some((d) => d.name === rd && d.status !== 'Pending')
          ).length;

          let docStatus: DocStatus = 'Pending';
          if (pendingCount === 0) docStatus = 'Complete';else
          if (updatedDocs.length > 0) docStatus = 'Partial';

          return { ...o, documents: updatedDocs, docStatus };
        }
        return o;
      })
      );

      // Update selected offer for modal
      setSelectedOffer((prev) => {
        if (!prev) return prev;
        const existingDocIndex = prev.documents.findIndex((d) => d.name === docName);
        let updatedDocs: Document[];

        if (existingDocIndex >= 0) {
          updatedDocs = prev.documents.map((d, i) =>
          i === existingDocIndex ? { ...d, status: 'Uploaded', uploadedDate: currentDate } : d
          );
        } else {
          updatedDocs = [...prev.documents, newDoc];
        }

        return { ...prev, documents: updatedDocs };
      });

      addToast('success', `${docName} uploaded successfully!`);
    } catch (error) {
      addToast('error', `Failed to upload ${docName}`);
    } finally {
      setUploadingDocId(null);
    }
  };

  // Verify document
  const handleVerifyDocument = async (docId: string) => {
    if (!selectedOffer) return;

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const currentDate = new Date().toISOString().split('T')[0];

      setOffers((prev) =>
      prev.map((o) => {
        if (o.id === selectedOffer.id) {
          const updatedDocs = o.documents.map((d) =>
          d.id === docId ? { ...d, status: 'Verified' as const, verifiedDate: currentDate } : d
          );

          // Check if all docs are verified
          const allVerified = updatedDocs.every((d) => d.status === 'Verified');
          const docStatus: DocStatus = allVerified ? 'Complete' : 'Partial';

          return { ...o, documents: updatedDocs, docStatus };
        }
        return o;
      })
      );

      setSelectedOffer((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          documents: prev.documents.map((d) =>
          d.id === docId ? { ...d, status: 'Verified' as const, verifiedDate: currentDate } : d
          )
        };
      });

      addToast('success', 'Document verified successfully!');
    } catch (error) {
      addToast('error', 'Failed to verify document');
    }
  };

  // Open convert to employee modal
  const openConvertModal = (offer: OfferRecord) => {
    if (offer.acceptanceStatus !== 'Joined') {
      addToast('warning', 'Only joined candidates can be converted to employees');
      return;
    }
    if (offer.docStatus !== 'Complete') {
      addToast('warning', 'All documents must be complete before converting to employee');
      return;
    }
    setSelectedOffer(offer);
    setShowConvertModal(true);
  };

  // Convert to employee
  const handleConvertToEmployee = async () => {
    if (!selectedOffer) return;

    setIsSaving(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newEmployeeId = `EMP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

      setOffers((prev) =>
      prev.map((o) =>
      o.id === selectedOffer.id ?
      {
        ...o,
        convertedToEmployee: true,
        employeeId: newEmployeeId
      } :
      o
      )
      );

      setShowConvertModal(false);
      setSelectedOffer(null);
      addToast('success', `${selectedOffer.candidate} converted to employee (${newEmployeeId})`);
    } catch (error) {
      addToast('error', 'Failed to convert to employee. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Resend offer letter
  const openResendOfferModal = (offer: OfferRecord) => {
    setSelectedOffer(offer);
    setShowResendOfferModal(true);
  };

  const handleResendOffer = async () => {
    if (!selectedOffer) return;

    setIsSaving(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      addToast('success', `Offer letter resent to ${selectedOffer.email}`);
      setShowResendOfferModal(false);
      setSelectedOffer(null);
    } catch (error) {
      addToast('error', 'Failed to resend offer letter');
    } finally {
      setIsSaving(false);
    }
  };

  // Close all modals
  const closeAllModals = () => {
    setShowViewModal(false);
    setShowEditStatusModal(false);
    setShowDocumentsModal(false);
    setShowConvertModal(false);
    setShowResendOfferModal(false);
    setSelectedOffer(null);
    setStatusRemarks('');
    setActualJoiningDate('');
  };

  // Toast Notifications Component
  const ToastNotifications = () => {
    if (toasts.length === 0) return null;

    return (
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) =>
        <div
          key={toast.id}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
          toast.type === 'success' ?
          'bg-green-500 text-white' :
          toast.type === 'error' ?
          'bg-red-500 text-white' :
          toast.type === 'warning' ?
          'bg-yellow-500 text-white' :
          'bg-blue-500 text-white'}`
          }>

            {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {toast.type === 'error' && <XCircle className="w-5 h-5" />}
            {toast.type === 'warning' && <AlertCircle className="w-5 h-5" />}
            {toast.type === 'info' && <AlertCircle className="w-5 h-5" />}
            <span className="text-sm font-medium">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="ml-2 hover:opacity-80">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>);

  };

  // View Modal
  const ViewModal = () => {
    if (!showViewModal || !selectedOffer) return null;

    const offer = selectedOffer;
    const sc = statusConfig[offer.acceptanceStatus];
    const StatusIcon = sc.icon;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeAllModals} />
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-600 text-white flex items-center justify-center text-lg font-bold">
                {offer.avatar}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{offer.candidate}</h2>
                <p className="text-sm text-gray-500">{offer.id}</p>
              </div>
            </div>
            <button onClick={closeAllModals} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-4 space-y-6">
            {/* Status and Actions */}
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-medium ${sc.bg} ${sc.color}`}>
                <StatusIcon className="w-4 h-4" />
                {offer.acceptanceStatus}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleDownloadOfferLetter(offer)}>
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
                <Button variant="outline" size="sm" onClick={() => handlePrintOfferLetter(offer)}>
                  <Printer className="w-4 h-4 mr-1" />
                  Print
                </Button>
                {offer.acceptanceStatus === 'Offer Pending' &&
                <Button variant="outline" size="sm" onClick={() => openResendOfferModal(offer)}>
                    <Send className="w-4 h-4 mr-1" />
                    Resend
                  </Button>
                }
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{offer.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{offer.phone}</span>
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{offer.address}</span>
              </div>
            </div>

            {/* Position Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Position</p>
                <p className="font-medium">{offer.position}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium">{offer.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Branch</p>
                <p className="font-medium">{getBranchName(offer.branch)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Offered Salary</p>
                <p className="font-medium text-green-600">₹{offer.offeredSalary.toLocaleString()}/month</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Qualification</p>
                <p className="font-medium">{offer.qualification}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Experience</p>
                <p className="font-medium">{offer.experience}</p>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Offer Date</p>
                <p className="font-medium">{offer.offerDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Expected DOJ</p>
                <p className="font-medium">{offer.expectedDOJ}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Actual DOJ</p>
                <p className="font-medium">{offer.actualDOJ || '—'}</p>
              </div>
            </div>

            {/* Document Status */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">Document Status</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${docStatusConfig[offer.docStatus]}`}>
                  {offer.docStatus}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {offer.documents.map((doc) =>
                <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{doc.name}</span>
                    </div>
                    <span
                    className={`text-xs px-1.5 py-0.5 rounded ${
                    doc.status === 'Verified' ?
                    'bg-green-100 text-green-700' :
                    doc.status === 'Uploaded' ?
                    'bg-blue-100 text-blue-700' :
                    doc.status === 'Rejected' ?
                    'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-600'}`
                    }>

                      {doc.status}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Employee Conversion */}
            {offer.convertedToEmployee &&
            <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-700">Converted to Employee</span>
                </div>
                <p className="text-sm text-green-600 mt-1">Employee ID: {offer.employeeId}</p>
              </div>
            }

            {/* Status History */}
            <div>
              <p className="font-medium mb-2">Status History</p>
              <div className="space-y-2">
                {offer.statusHistory.map((history, index) => {
                  const hsc = statusConfig[history.status];
                  return (
                    <div key={index} className="flex items-start gap-3 text-sm">
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${hsc.bg}`}></div>
                      <div>
                        <p className="font-medium">{history.status}</p>
                        <p className="text-gray-500">
                          {history.date} by {history.updatedBy}
                        </p>
                        {history.remarks && <p className="text-gray-400 text-xs">{history.remarks}</p>}
                      </div>
                    </div>);

                })}
              </div>
            </div>

            {/* Remarks */}
            {offer.remarks &&
            <div>
                <p className="text-sm text-gray-500">Remarks</p>
                <p className="font-medium">{offer.remarks}</p>
              </div>
            }
          </div>

          <div className="flex justify-end gap-2 p-4 border-t sticky bottom-0 bg-white">
            <Button variant="outline" onClick={closeAllModals}>
              Close
            </Button>
            {!offer.convertedToEmployee && offer.acceptanceStatus === 'Joined' && offer.docStatus === 'Complete' &&
            <Button onClick={() => {
              closeAllModals();
              openConvertModal(offer);
            }}>
                <UserPlus className="w-4 h-4 mr-2" />
                Convert to Employee
              </Button>
            }
            <Button variant="outline" onClick={() => {
              closeAllModals();
              openEditStatusModal(offer);
            }}>
              <Edit className="w-4 h-4 mr-2" />
              Update Status
            </Button>
          </div>
        </div>
      </div>);

  };

  // Edit Status Modal
  const EditStatusModal = () => {
    if (!showEditStatusModal || !selectedOffer) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeAllModals} />
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Update Status</h2>
            <button onClick={closeAllModals} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">{selectedOffer.candidate}</p>
              <p className="text-sm text-gray-500">{selectedOffer.position}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as OfferStatus)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">

                <option value="Offer Pending">Offer Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
                <option value="Joined">Joined</option>
                <option value="No Show">No Show</option>
              </select>
            </div>

            {newStatus === 'Joined' &&
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Actual Joining Date</label>
                <input
                type="date"
                value={actualJoiningDate}
                onChange={(e) => setActualJoiningDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>
            }

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
              <textarea
                value={statusRemarks}
                onChange={(e) => setStatusRemarks(e.target.value)}
                rows={3}
                placeholder="Enter any remarks..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />

            </div>
          </div>

          <div className="flex justify-end gap-2 p-4 border-t">
            <Button variant="outline" onClick={closeAllModals} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus} disabled={isSaving}>
              {isSaving ?
              <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </> :

              <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Status
                </>
              }
            </Button>
          </div>
        </div>
      </div>);

  };

  // Documents Modal
  const DocumentsModal = () => {
    if (!showDocumentsModal || !selectedOffer) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeAllModals} />
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Document Management</h2>
              <p className="text-sm text-gray-500">{selectedOffer.candidate}</p>
            </div>
            <button onClick={closeAllModals} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className={`text-sm px-2 py-1 rounded-full font-medium ${docStatusConfig[selectedOffer.docStatus]}`}>
                Status: {selectedOffer.docStatus}
              </span>
              <span className="text-sm text-gray-500">
                {selectedOffer.documents.filter((d) => d.status === 'Verified').length} / {REQUIRED_DOCUMENTS.length} verified
              </span>
            </div>

            <div className="space-y-3">
              {REQUIRED_DOCUMENTS.map((docName) => {
                const doc = selectedOffer.documents.find((d) => d.name === docName);

                return (
                  <div key={docName} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-sm">{docName}</p>
                        {doc && doc.uploadedDate &&
                        <p className="text-xs text-gray-400">Uploaded: {doc.uploadedDate}</p>
                        }
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc ?
                      <>
                          <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          doc.status === 'Verified' ?
                          'bg-green-100 text-green-700' :
                          doc.status === 'Uploaded' ?
                          'bg-blue-100 text-blue-700' :
                          doc.status === 'Rejected' ?
                          'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-600'}`
                          }>

                            {doc.status}
                          </span>
                          {doc.status === 'Uploaded' &&
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => handleVerifyDocument(doc.id)}>

                              <FileCheck className="w-3 h-3 mr-1" />
                              Verify
                            </Button>
                        }
                        </> :

                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => handleUploadDocument(docName)}
                        disabled={uploadingDocId === docName}>

                          {uploadingDocId === docName ?
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" /> :

                        <Upload className="w-3 h-3 mr-1" />
                        }
                          Upload
                        </Button>
                      }
                    </div>
                  </div>);

              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 p-4 border-t sticky bottom-0 bg-white">
            <Button variant="outline" onClick={closeAllModals}>
              Close
            </Button>
          </div>
        </div>
      </div>);

  };

  // Convert to Employee Modal
  const ConvertModal = () => {
    if (!showConvertModal || !selectedOffer) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeAllModals} />
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Convert to Employee</h2>
            <button onClick={closeAllModals} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg mb-4">
              <UserPlus className="w-8 h-8 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">Create Employee Record</p>
                <p className="text-sm text-gray-600">
                  This will create an employee record for {selectedOffer.candidate}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-500">Name:</span>
                <span className="font-medium">{selectedOffer.candidate}</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-500">Position:</span>
                <span className="font-medium">{selectedOffer.position}</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-500">Department:</span>
                <span className="font-medium">{selectedOffer.department}</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-500">Joining Date:</span>
                <span className="font-medium">{selectedOffer.actualDOJ}</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-500">Salary:</span>
                <span className="font-medium">₹{selectedOffer.offeredSalary.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 p-4 border-t">
            <Button variant="outline" onClick={closeAllModals} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleConvertToEmployee} disabled={isSaving}>
              {isSaving ?
              <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Converting...
                </> :

              <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Convert to Employee
                </>
              }
            </Button>
          </div>
        </div>
      </div>);

  };

  // Resend Offer Modal
  const ResendOfferModal = () => {
    if (!showResendOfferModal || !selectedOffer) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeAllModals} />
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Resend Offer Letter</h2>
            <button onClick={closeAllModals} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg mb-4">
              <Send className="w-8 h-8 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Resend offer letter via email</p>
                <p className="text-sm text-gray-600">The offer letter will be sent to:</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">{selectedOffer.candidate}</p>
                <p className="text-sm text-gray-500">{selectedOffer.email}</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Position</p>
                <p className="font-medium">{selectedOffer.position}</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Offered Salary</p>
                <p className="font-medium">₹{selectedOffer.offeredSalary.toLocaleString()}/month</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 p-4 border-t">
            <Button variant="outline" onClick={closeAllModals} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleResendOffer} disabled={isSaving}>
              {isSaving ?
              <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </> :

              <>
                  <Send className="w-4 h-4 mr-2" />
                  Resend Offer
                </>
              }
            </Button>
          </div>
        </div>
      </div>);

  };

  return (
    <div className="space-y-6 pb-8">
      <ToastNotifications />
      <ViewModal />
      <EditStatusModal />
      <DocumentsModal />
      <ConvertModal />
      <ResendOfferModal />

      {/* Header */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Offer & Joining Status</h1>
              <p className="text-sm text-gray-500">Track offer letters and candidate joining progress</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select
              label=""
              options={ACADEMIC_YEARS}
              value={academicYear}
              onChange={setAcademicYear}
              className="w-36" />

            <Button variant="outline" size="sm" onClick={handleExport} disabled={isLoading}>
              {isLoading ?
              <Loader2 className="w-4 h-4 mr-1 animate-spin" /> :

              <Download className="w-4 h-4 mr-1" />
              }
              Export
            </Button>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t flex flex-wrap items-center gap-3">
          <Building className="w-5 h-5 text-gray-500 flex-shrink-0" />
          <span className="text-sm font-medium text-gray-700 flex-shrink-0">Branches:</span>
          {BRANCHES.map((branch) =>
          <button
            key={branch.id}
            onClick={() => handleBranchToggle(branch.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
            selectedBranches.includes(branch.id) ||
            branch.id !== 'all' && selectedBranches.includes('all') ?
            'bg-green-600 text-white' :
            'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
            }>

              {branch.name}
              {selectedBranches.includes(branch.id) && branch.id !== 'all' &&
            <X
              className="w-3 h-3"
              onClick={(e) => {
                e.stopPropagation();
                handleBranchToggle(branch.id);
              }} />

            }
            </button>
          )}
        </div>
      </Card>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {(['Offer Pending', 'Accepted', 'Rejected', 'Joined', 'No Show'] as OfferStatus[]).map((status) => {
          const sc = statusConfig[status];
          const StatusIcon = sc.icon;
          return (
            <button
              key={status}
              onClick={() => setFilterStatus(filterStatus === status ? 'all' : status)}
              className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${
              filterStatus === status ? `border-current ${sc.bg}` : 'border-gray-200 bg-white'}`
              }>

              <div className={`w-10 h-10 rounded-lg ${sc.bg} flex items-center justify-center mb-3`}>
                <StatusIcon className={`w-5 h-5 ${sc.color}`} />
              </div>
              <p className={`text-2xl font-bold ${sc.color}`}>{statusCounts[status] || 0}</p>
              <p className="text-xs text-gray-500 mt-0.5">{status}</p>
            </button>);

        })}
      </div>

      {/* Table */}
      <Card>
        <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <Select
            label=""
            options={[
            { value: 'all', label: 'All Status' },
            { value: 'Offer Pending', label: 'Offer Pending' },
            { value: 'Accepted', label: 'Accepted' },
            { value: 'Rejected', label: 'Rejected' },
            { value: 'Joined', label: 'Joined' },
            { value: 'No Show', label: 'No Show' }]
            }
            value={filterStatus}
            onChange={(val) => {
              setFilterStatus(val);
              setCurrentPage(1);
            }}
            className="w-44" />

          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <div className="ml-auto text-sm text-gray-500">{filtered.length} records</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Candidate</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Position</th>
                <th className="text-right py-3 px-4 text-gray-500 font-medium">Offered Salary</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Offer Date</th>
                <th className="text-center py-3 px-4 text-gray-500 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Expected DOJ</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Actual DOJ</th>
                <th className="text-center py-3 px-4 text-gray-500 font-medium">Documents</th>
                <th className="text-center py-3 px-4 text-gray-500 font-medium">Employee</th>
                <th className="text-center py-3 px-4 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((offer) => {
                const sc = statusConfig[offer.acceptanceStatus];
                const StatusIcon = sc.icon;
                return (
                  <tr
                    key={offer.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors">

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {offer.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{offer.candidate}</p>
                          <p className="text-xs text-gray-400">{getBranchName(offer.branch)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{offer.position}</td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-900">
                      ₹{offer.offeredSalary.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{offer.offerDate}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${sc.bg} ${sc.color}`}>

                        <StatusIcon className="w-3 h-3" />
                        {offer.acceptanceStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{offer.expectedDOJ}</td>
                    <td className="py-3 px-4 text-gray-600">{offer.actualDOJ || '—'}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => openDocumentsModal(offer)}
                        className={`text-xs px-2 py-0.5 rounded-full font-medium cursor-pointer hover:opacity-80 ${docStatusConfig[offer.docStatus]}`}>

                        {offer.docStatus}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {offer.convertedToEmployee ?
                      <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full font-medium">
                          <CheckCircle className="w-3 h-3" />
                          Yes
                        </span> :
                      offer.acceptanceStatus === 'Joined' && offer.docStatus === 'Complete' ?
                      <button
                        onClick={() => openConvertModal(offer)}
                        className="text-xs text-blue-600 hover:underline">

                          Convert
                        </button> :

                      <span className="text-xs text-gray-400">No</span>
                      }
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                          title="View"
                          onClick={() => openViewModal(offer)}>

                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 hover:bg-green-50 rounded-lg text-green-600 transition-colors"
                          title="Download Offer"
                          onClick={() => handleDownloadOfferLetter(offer)}>

                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                          title="Update Status"
                          onClick={() => openEditStatusModal(offer)}>

                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>

          {filtered.length === 0 &&
          <div className="py-12 text-center text-gray-400">
              <Award className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>No offers found matching your filters</p>
            </div>
          }
        </div>

        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>
            Showing {paginatedData.length} of {filtered.length} records
            {filtered.length !== offers.length && ` (filtered from ${offers.length} total)`}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="xs"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}>

              Previous
            </Button>
            <Button
              variant="outline"
              size="xs"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}>

              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>);

}