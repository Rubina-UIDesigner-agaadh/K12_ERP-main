import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import {
  Settings,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Save,
  UserPlus,
  Eye,
  Award,
  AlertTriangle,
  Search,
  Check,
  X,
  RefreshCw,
  Printer,
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  Send,
  Bell,
  MessageSquare,
  PartyPopper } from
'lucide-react';

// Types
interface Applicant {
  id: number;
  applicationNo: string;
  name: string;
  fatherName: string;
  motherName: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  appliedClass: string;
  examDate: string;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  category: 'Merit' | 'Waitlist' | 'Failed';
  status: 'Pending' | 'Approved' | 'Converted' | 'Rejected';
  photo: string;
}

interface CutoffSettings {
  meritCutoff: number;
  waitlistCutoff: number;
  totalMarks: number;
}

export function AdmissionMeritSetup() {
  // Cutoff Settings State
  const [cutoffSettings, setCutoffSettings] = useState<CutoffSettings>({
    meritCutoff: 75,
    waitlistCutoff: 50,
    totalMarks: 100
  });
  const [tempCutoffSettings, setTempCutoffSettings] = useState<CutoffSettings>(cutoffSettings);
  const [showCutoffModal, setShowCutoffModal] = useState(false);

  // Filter States
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'Merit' | 'Waitlist' | 'Failed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Conversion Modal States
  const [showConversionModal, setShowConversionModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [notificationMethod, setNotificationMethod] = useState<'both' | 'sms' | 'email'>('both');
  const [customMessage, setCustomMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // View Applicant Modal
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewApplicant, setViewApplicant] = useState<Applicant | null>(null);

  // Reject Confirmation Modal
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectApplicant, setRejectApplicant] = useState<Applicant | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Sample Applicants Data
  const [applicants, setApplicants] = useState<Applicant[]>([
  {
    id: 1,
    applicationNo: 'APP-2024-0001',
    name: 'Aarav Sharma',
    fatherName: 'Rajesh Sharma',
    motherName: 'Priya Sharma',
    dob: '2015-03-15',
    gender: 'Male',
    phone: '9876543210',
    email: 'rajesh.sharma@email.com',
    address: '123, Green Park, New Delhi - 110016',
    appliedClass: 'Class 1',
    examDate: '2024-03-10',
    totalMarks: 100,
    obtainedMarks: 92,
    percentage: 92,
    category: 'Merit',
    status: 'Pending',
    photo: ''
  },
  {
    id: 2,
    applicationNo: 'APP-2024-0002',
    name: 'Ananya Patel',
    fatherName: 'Vikram Patel',
    motherName: 'Meera Patel',
    dob: '2015-07-22',
    gender: 'Female',
    phone: '9876543211',
    email: 'vikram.patel@email.com',
    address: '456, Sector 15, Gurgaon - 122001',
    appliedClass: 'Class 1',
    examDate: '2024-03-10',
    totalMarks: 100,
    obtainedMarks: 88,
    percentage: 88,
    category: 'Merit',
    status: 'Pending',
    photo: ''
  },
  {
    id: 3,
    applicationNo: 'APP-2024-0003',
    name: 'Vihaan Gupta',
    fatherName: 'Amit Gupta',
    motherName: 'Sunita Gupta',
    dob: '2015-11-08',
    gender: 'Male',
    phone: '9876543212',
    email: 'amit.gupta@email.com',
    address: '789, Vasant Kunj, New Delhi - 110070',
    appliedClass: 'Class 1',
    examDate: '2024-03-10',
    totalMarks: 100,
    obtainedMarks: 78,
    percentage: 78,
    category: 'Merit',
    status: 'Converted',
    photo: ''
  },
  {
    id: 4,
    applicationNo: 'APP-2024-0004',
    name: 'Zara Khan',
    fatherName: 'Imran Khan',
    motherName: 'Fatima Khan',
    dob: '2015-05-30',
    gender: 'Female',
    phone: '9876543213',
    email: 'imran.khan@email.com',
    address: '321, Nizamuddin East, New Delhi - 110013',
    appliedClass: 'Class 1',
    examDate: '2024-03-10',
    totalMarks: 100,
    obtainedMarks: 65,
    percentage: 65,
    category: 'Waitlist',
    status: 'Pending',
    photo: ''
  },
  {
    id: 5,
    applicationNo: 'APP-2024-0005',
    name: 'Arjun Singh',
    fatherName: 'Harpreet Singh',
    motherName: 'Gurpreet Kaur',
    dob: '2015-09-12',
    gender: 'Male',
    phone: '9876543214',
    email: 'harpreet.singh@email.com',
    address: '567, Punjabi Bagh, New Delhi - 110026',
    appliedClass: 'Class 1',
    examDate: '2024-03-10',
    totalMarks: 100,
    obtainedMarks: 58,
    percentage: 58,
    category: 'Waitlist',
    status: 'Approved',
    photo: ''
  },
  {
    id: 6,
    applicationNo: 'APP-2024-0006',
    name: 'Kavya Reddy',
    fatherName: 'Venkat Reddy',
    motherName: 'Lakshmi Reddy',
    dob: '2015-01-25',
    gender: 'Female',
    phone: '9876543215',
    email: 'venkat.reddy@email.com',
    address: '890, Greater Kailash, New Delhi - 110048',
    appliedClass: 'Class 1',
    examDate: '2024-03-10',
    totalMarks: 100,
    obtainedMarks: 42,
    percentage: 42,
    category: 'Failed',
    status: 'Pending',
    photo: ''
  },
  {
    id: 7,
    applicationNo: 'APP-2024-0007',
    name: 'Ishaan Malhotra',
    fatherName: 'Rohit Malhotra',
    motherName: 'Neha Malhotra',
    dob: '2015-04-18',
    gender: 'Male',
    phone: '9876543216',
    email: 'rohit.malhotra@email.com',
    address: '234, Saket, New Delhi - 110017',
    appliedClass: 'Class 1',
    examDate: '2024-03-10',
    totalMarks: 100,
    obtainedMarks: 35,
    percentage: 35,
    category: 'Failed',
    status: 'Pending',
    photo: ''
  },
  {
    id: 8,
    applicationNo: 'APP-2024-0008',
    name: 'Myra Joshi',
    fatherName: 'Deepak Joshi',
    motherName: 'Anita Joshi',
    dob: '2014-12-05',
    gender: 'Female',
    phone: '9876543217',
    email: 'deepak.joshi@email.com',
    address: '678, Dwarka, New Delhi - 110075',
    appliedClass: 'Class 2',
    examDate: '2024-03-11',
    totalMarks: 100,
    obtainedMarks: 85,
    percentage: 85,
    category: 'Merit',
    status: 'Pending',
    photo: ''
  }]
  );

  // Calculate category based on cutoff
  const getCategory = (percentage: number): 'Merit' | 'Waitlist' | 'Failed' => {
    if (percentage >= cutoffSettings.meritCutoff) return 'Merit';
    if (percentage >= cutoffSettings.waitlistCutoff) return 'Waitlist';
    return 'Failed';
  };

  // Filter applicants (exclude rejected)
  const filteredApplicants = applicants.
  filter((applicant) => applicant.status !== 'Rejected').
  filter((applicant) => {
    const matchesClass = selectedClass === 'all' || applicant.appliedClass === selectedClass;
    const matchesCategory = selectedCategory === 'all' || applicant.category === selectedCategory;
    const matchesSearch =
    searchQuery === '' ||
    applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    applicant.applicationNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesCategory && matchesSearch;
  });

  // Statistics
  const activeApplicants = applicants.filter((a) => a.status !== 'Rejected');
  const stats = {
    total: activeApplicants.length,
    merit: activeApplicants.filter((a) => a.category === 'Merit').length,
    waitlist: activeApplicants.filter((a) => a.category === 'Waitlist').length,
    failed: activeApplicants.filter((a) => a.category === 'Failed').length,
    converted: activeApplicants.filter((a) => a.status === 'Converted').length,
    approved: activeApplicants.filter((a) => a.status === 'Approved').length,
    pending: activeApplicants.filter((a) => a.status === 'Pending').length
  };

  // Save cutoff settings
  const handleSaveCutoff = () => {
    setCutoffSettings(tempCutoffSettings);
    setApplicants((prev) =>
    prev.map((applicant) => ({
      ...applicant,
      category: getCategory(applicant.percentage)
    }))
    );
    setShowCutoffModal(false);
  };

  // Open conversion modal
  const handleStartConversion = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setNotificationMethod('both');
    setCustomMessage('');
    setShowConversionModal(true);
  };

  // Complete conversion and send notification
  const handleCompleteConversion = () => {
    if (selectedApplicant) {
      setIsSending(true);
      // Simulate sending notification
      setTimeout(() => {
        setApplicants((prev) =>
        prev.map((a) =>
        a.id === selectedApplicant.id ? { ...a, status: 'Converted' as const } : a
        )
        );
        setIsSending(false);
        setShowConversionModal(false);
        setShowSuccessModal(true);
      }, 1500);
    }
  };

  // View applicant details
  const handleViewApplicant = (applicant: Applicant) => {
    setViewApplicant(applicant);
    setShowViewModal(true);
  };

  // Approve applicant (for Waitlist/Failed)
  const handleApproveApplicant = (applicant: Applicant) => {
    setApplicants((prev) =>
    prev.map((a) => a.id === applicant.id ? { ...a, status: 'Approved' as const } : a)
    );
    setShowViewModal(false);
    setViewApplicant(null);
  };

  // Open reject confirmation
  const handleOpenRejectModal = (applicant: Applicant) => {
    setRejectApplicant(applicant);
    setRejectReason('');
    setShowRejectModal(true);
  };

  // Confirm rejection
  const handleConfirmReject = () => {
    if (rejectApplicant) {
      setApplicants((prev) => prev.filter((a) => a.id !== rejectApplicant.id));
      setShowRejectModal(false);
      setRejectApplicant(null);
      setRejectReason('');
      setShowViewModal(false);
      setViewApplicant(null);
    }
  };

  // Check if applicant can be converted
  const canConvert = (applicant: Applicant): boolean => {
    if (applicant.status === 'Converted' || applicant.status === 'Rejected') return false;
    if (applicant.category === 'Merit') return true;
    if ((applicant.category === 'Waitlist' || applicant.category === 'Failed') && applicant.status === 'Approved') return true;
    return false;
  };

  // Check if applicant needs approval
  const needsApproval = (applicant: Applicant): boolean => {
    return (
      (applicant.category === 'Waitlist' || applicant.category === 'Failed') &&
      applicant.status === 'Pending');

  };

  // Category badge
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Merit':
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <Award className="w-3 h-3" />
            Merit List
          </Badge>);

      case 'Waitlist':
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Waitlist
          </Badge>);

      case 'Failed':
        return (
          <Badge variant="danger" className="flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Failed
          </Badge>);

      default:
        return null;
    }
  };

  // Status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Converted':
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Notified
          </Badge>);

      case 'Approved':
        return (
          <Badge variant="info" className="flex items-center gap-1">
            <ThumbsUp className="w-3 h-3" />
            Approved
          </Badge>);

      case 'Pending':
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending
          </Badge>);

      case 'Rejected':
        return (
          <Badge variant="danger" className="flex items-center gap-1">
            <X className="w-3 h-3" />
            Rejected
          </Badge>);

      default:
        return null;
    }
  };

  // Default notification message
  const getDefaultMessage = (applicant: Applicant | null) => {
    if (!applicant) return '';
    return `Dear Parent,

Congratulations! We are pleased to inform you that your child, ${applicant.name}, has been selected for admission to ${applicant.appliedClass} at our school.

Exam Score: ${applicant.obtainedMarks}/${applicant.totalMarks} (${applicant.percentage}%)

Please visit the school office with the following documents to complete the admission process:
- Original Birth Certificate
- Aadhar Card (Student & Parents)
- Address Proof
- Passport Size Photos (4)

Office Hours: Monday to Friday, 9:00 AM - 4:00 PM

For any queries, please contact us at school@example.com or call 1234567890.

Best Regards,
Admission Office`;
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-gray-50/50">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admission Merit List</h1>
            <p className="text-sm text-gray-500">
              Manage applicants based on entrance exam results and notify selected students
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setShowCutoffModal(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Cutoff Settings
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export List
            </Button>
            <Button variant="outline">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </div>

        

        {/* Cutoff Info Banner */}
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Current Cutoff Settings</h3>
                <p className="text-sm text-gray-600">Total Marks: {cutoffSettings.totalMarks}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Merit List</p>
                <Badge variant="success" className="text-sm px-3 py-1">
                  ≥ {cutoffSettings.meritCutoff}%
                </Badge>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Waitlist</p>
                <Badge variant="warning" className="text-sm px-3 py-1">
                  {cutoffSettings.waitlistCutoff}% - {cutoffSettings.meritCutoff - 1}%
                </Badge>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Failed</p>
                <Badge variant="danger" className="text-sm px-3 py-1">
                  {'<'} {cutoffSettings.waitlistCutoff}%
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Info Banner for Approval Process */}
        <Card className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900">Selection & Notification Process</h3>
              <p className="text-sm text-gray-600">
                <strong>Merit List</strong> students can be directly notified about their selection. 
                <strong> Waitlist</strong> and <strong>Failed</strong> students need to be approved first before sending selection notification. 
                Click on "View" to approve or reject these applicants.
              </p>
            </div>
          </div>
        </Card>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or application number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">

                <option value="all">All Classes</option>
                <option value="Class 1">Class 1</option>
                <option value="Class 2">Class 2</option>
                <option value="Class 3">Class 3</option>
              </select>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">

                <option value="all">All Categories</option>
                <option value="Merit">Merit List Only</option>
                <option value="Waitlist">Waitlist Only</option>
                <option value="Failed">Failed Only</option>
              </select>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedClass('all');
                  setSelectedCategory('all');
                }}>

                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </Card>

        {/* Applicants Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Application No.
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Details
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied Class
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marks
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplicants.
                sort((a, b) => b.percentage - a.percentage).
                map((applicant, index) =>
                <tr
                  key={applicant.id}
                  className={`hover:bg-gray-50 ${
                  applicant.status === 'Converted' ? 'bg-green-50/50' : ''} ${
                  applicant.status === 'Approved' ? 'bg-indigo-50/50' : ''}`}>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                      index < 3 ?
                      'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-600'}`
                      }>

                          {index + 1}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="font-mono text-sm text-blue-600">
                          {applicant.applicationNo}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{applicant.name}</p>
                            <p className="text-xs text-gray-500">S/O {applicant.fatherName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{applicant.appliedClass}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-lg font-bold text-gray-900">
                            {applicant.obtainedMarks}/{applicant.totalMarks}
                          </p>
                          <p
                        className={`text-sm font-medium ${
                        applicant.percentage >= cutoffSettings.meritCutoff ?
                        'text-green-600' :
                        applicant.percentage >= cutoffSettings.waitlistCutoff ?
                        'text-yellow-600' :
                        'text-red-600'}`
                        }>

                            {applicant.percentage}%
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {getCategoryBadge(applicant.category)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {getStatusBadge(applicant.status)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                        onClick={() => handleViewApplicant(applicant)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details">

                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Show Notify button for Merit students (pending) or Approved Waitlist/Failed students */}
                          {canConvert(applicant) && applicant.status !== 'Converted' &&
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleStartConversion(applicant)}>

                              <Send className="w-4 h-4 mr-1" />
                              Notify
                            </Button>
                      }

                          {/* Show "Needs Approval" badge for Waitlist/Failed pending students */}
                          {needsApproval(applicant) &&
                      <Badge variant="secondary" className="text-xs">
                              Needs Approval
                            </Badge>
                      }

                          {applicant.status === 'Converted' &&
                      <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Notified
                            </span>
                      }
                        </div>
                      </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
          {filteredApplicants.length === 0 &&
          <div className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No applicants found matching your criteria</p>
            </div>
          }
        </Card>

        {/* Cutoff Settings Modal */}
        <Modal
          isOpen={showCutoffModal}
          onClose={() => setShowCutoffModal(false)}
          title="Configure Cutoff Settings"
          size="md">

          <div className="space-y-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Changing cutoff settings will automatically recategorize all
                applicants based on their marks.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Marks</label>
              <input
                type="number"
                value={tempCutoffSettings.totalMarks}
                onChange={(e) =>
                setTempCutoffSettings({
                  ...tempCutoffSettings,
                  totalMarks: parseInt(e.target.value) || 100
                })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Merit List Cutoff (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={tempCutoffSettings.meritCutoff}
                    onChange={(e) =>
                    setTempCutoffSettings({
                      ...tempCutoffSettings,
                      meritCutoff: parseInt(e.target.value) || 0
                    })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Waitlist Cutoff (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={tempCutoffSettings.waitlistCutoff}
                    onChange={(e) =>
                    setTempCutoffSettings({
                      ...tempCutoffSettings,
                      waitlistCutoff: parseInt(e.target.value) || 0
                    })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Category Preview</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    Merit List
                  </span>
                  <span>≥ {tempCutoffSettings.meritCutoff}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    Waitlist
                  </span>
                  <span>
                    {tempCutoffSettings.waitlistCutoff}% - {tempCutoffSettings.meritCutoff - 1}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    Failed
                  </span>
                  <span>{'<'} {tempCutoffSettings.waitlistCutoff}%</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowCutoffModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveCutoff}>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </div>
        </Modal>

        {/* View Applicant Modal */}
        <Modal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          title="Applicant Details"
          size="lg">

          {viewApplicant &&
          <div className="space-y-6">
              {/* Header with Photo and Basic Info */}
              <div className="flex items-start gap-6 p-4 bg-gray-50 rounded-lg">
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{viewApplicant.name}</h3>
                    {getCategoryBadge(viewApplicant.category)}
                    {getStatusBadge(viewApplicant.status)}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    Application No:{' '}
                    <span className="font-mono">{viewApplicant.applicationNo}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Applied for: <span className="font-medium">{viewApplicant.appliedClass}</span>
                  </p>
                </div>
              </div>

              {/* Exam Results */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Exam Results</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                    <p className="text-3xl font-bold text-gray-900">{viewApplicant.obtainedMarks}</p>
                    <p className="text-xs text-gray-500">Obtained Marks</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                    <p className="text-3xl font-bold text-gray-900">{viewApplicant.totalMarks}</p>
                    <p className="text-xs text-gray-500">Total Marks</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                    <p
                    className={`text-3xl font-bold ${
                    viewApplicant.percentage >= cutoffSettings.meritCutoff ?
                    'text-green-600' :
                    viewApplicant.percentage >= cutoffSettings.waitlistCutoff ?
                    'text-yellow-600' :
                    'text-red-600'}`
                    }>

                      {viewApplicant.percentage}%
                    </p>
                    <p className="text-xs text-gray-500">Percentage</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">Exam Date</p>
                    <p className="font-medium">{viewApplicant.examDate}</p>
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Personal Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Father's Name:</span>
                    <span className="text-sm font-medium">{viewApplicant.fatherName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Mother's Name:</span>
                    <span className="text-sm font-medium">{viewApplicant.motherName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Date of Birth:</span>
                    <span className="text-sm font-medium">{viewApplicant.dob}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Gender:</span>
                    <span className="text-sm font-medium">{viewApplicant.gender}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Phone:</span>
                    <span className="text-sm font-medium">{viewApplicant.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Email:</span>
                    <span className="text-sm font-medium">{viewApplicant.email}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 mt-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <span className="text-sm text-gray-600">Address:</span>
                  <span className="text-sm font-medium">{viewApplicant.address}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t">
                <Button variant="outline" onClick={() => setShowViewModal(false)}>
                  Close
                </Button>

                <div className="flex items-center gap-3">
                  {/* For Waitlist/Failed students who need approval */}
                  {needsApproval(viewApplicant) &&
                <>
                      <Button
                    variant="outline"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                    onClick={() => handleOpenRejectModal(viewApplicant)}>

                        <ThumbsDown className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Button
                    variant="primary"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleApproveApplicant(viewApplicant)}>

                        <ThumbsUp className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                    </>
                }

                  {/* For Merit students or Approved Waitlist/Failed students */}
                  {canConvert(viewApplicant) && viewApplicant.status !== 'Converted' &&
                <Button
                  variant="primary"
                  onClick={() => {
                    setShowViewModal(false);
                    handleStartConversion(viewApplicant);
                  }}>

                      <Send className="w-4 h-4 mr-2" />
                      Send Selection Notification
                    </Button>
                }

                  {viewApplicant.status === 'Converted' &&
                <Badge variant="success" className="px-4 py-2">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Already Notified
                    </Badge>
                }
                </div>
              </div>
            </div>
          }
        </Modal>

        {/* Reject Confirmation Modal */}
        <Modal
          isOpen={showRejectModal}
          onClose={() => {
            setShowRejectModal(false);
            setRejectApplicant(null);
            setRejectReason('');
          }}
          title="Confirm Rejection"
          size="md">

          {rejectApplicant &&
          <div className="space-y-6">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-800">Are you sure you want to reject this applicant?</p>
                    <p className="text-sm text-red-600 mt-1">
                      This action cannot be undone. The applicant will be permanently removed from the list.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Applicant Details</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <span className="ml-2 font-medium">{rejectApplicant.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Application No:</span>
                    <span className="ml-2 font-medium font-mono">{rejectApplicant.applicationNo}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Category:</span>
                    <span className="ml-2">{getCategoryBadge(rejectApplicant.category)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Marks:</span>
                    <span className="ml-2 font-medium">
                      {rejectApplicant.obtainedMarks}/{rejectApplicant.totalMarks} ({rejectApplicant.percentage}%)
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Rejection (Optional)
                </label>
                <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                placeholder="Enter reason for rejection..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />

              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                variant="outline"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectApplicant(null);
                  setRejectReason('');
                }}>

                  Cancel
                </Button>
                <Button
                variant="primary"
                className="bg-red-600 hover:bg-red-700"
                onClick={handleConfirmReject}>

                  <XCircle className="w-4 h-4 mr-2" />
                  Confirm Rejection
                </Button>
              </div>
            </div>
          }
        </Modal>

        {/* Send Notification Modal */}
        <Modal
          isOpen={showConversionModal}
          onClose={() => setShowConversionModal(false)}
          title="Send Selection Notification"
          size="lg">

          {selectedApplicant &&
          <div className="space-y-6">
              {/* Success Banner */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <PartyPopper className="w-6 h-6 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800">
                      Congratulations! {selectedApplicant.name} has been selected!
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      Send a notification to inform the parents about their child's selection.
                    </p>
                  </div>
                </div>
              </div>

              {/* Student Info Summary */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-3">Student Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Student Name</p>
                    <p className="font-medium">{selectedApplicant.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Application No</p>
                    <p className="font-medium font-mono">{selectedApplicant.applicationNo}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Applied Class</p>
                    <p className="font-medium">{selectedApplicant.appliedClass}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Exam Score</p>
                    <p className="font-medium">
                      {selectedApplicant.obtainedMarks}/{selectedApplicant.totalMarks} ({selectedApplicant.percentage}%)
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Parent Phone</p>
                    <p className="font-medium">{selectedApplicant.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Parent Email</p>
                    <p className="font-medium">{selectedApplicant.email}</p>
                  </div>
                </div>
              </div>

              {/* Notification Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Notification Method
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                    type="radio"
                    name="notificationMethod"
                    value="both"
                    checked={notificationMethod === 'both'}
                    onChange={() => setNotificationMethod('both')}
                    className="w-4 h-4 text-blue-600" />

                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <MessageSquare className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">Both (Email & SMS)</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                    type="radio"
                    name="notificationMethod"
                    value="email"
                    checked={notificationMethod === 'email'}
                    onChange={() => setNotificationMethod('email')}
                    className="w-4 h-4 text-blue-600" />

                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">Email Only</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                    type="radio"
                    name="notificationMethod"
                    value="sms"
                    checked={notificationMethod === 'sms'}
                    onChange={() => setNotificationMethod('sms')}
                    className="w-4 h-4 text-blue-600" />

                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">SMS Only</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Message Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message Preview
                </label>
                <textarea
                value={customMessage || getDefaultMessage(selectedApplicant)}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm" />

                <p className="text-xs text-gray-500 mt-1">
                  You can edit the message above before sending.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-4 border-t">
                <Button variant="outline" onClick={() => setShowConversionModal(false)}>
                  Cancel
                </Button>
                <Button
                variant="primary"
                onClick={handleCompleteConversion}
                disabled={isSending}>

                  {isSending ?
                <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </> :

                <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Notification
                    </>
                }
                </Button>
              </div>
            </div>
          }
        </Modal>

        {/* Success Modal */}
        <Modal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title=""
          size="sm">

          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Notification Sent!</h3>
            <p className="text-gray-600 mb-6">
              The selection notification has been successfully sent to the parent's registered contact.
            </p>
            <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
              Done
            </Button>
          </div>
        </Modal>
      </div>
    </div>);

}