import React, { useState, Fragment } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Table } from '../../../components/ui/Table';
import { Modal } from '../../../components/ui/Modal';
import {
  Search,
  User,
  CreditCard,
  Link,
  Copy,
  Mail,
  MessageSquare,
  Check,
  ChevronRight,
  Phone,
  Building,
  Calendar,
  IndianRupee,
  Plus,
  Minus,
  AlertCircle,
  CheckCircle,
  Send,
  ExternalLink,
  Clock,
  QrCode,
  Share2,
  Smartphone,
  RefreshCw,
  FileText,
  X,
  Loader2,
  Download } from
'lucide-react';
type Step = 1 | 2 | 3 | 4;
type FeeType = 'installment' | 'adhoc';
interface Student {
  id: string;
  name: string;
  admissionNo: string;
  class: string;
  section: string;
  rollNo: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  photo: string;
  totalDue: number;
  status: 'Active' | 'Inactive';
}
interface FeeInstallment {
  id: string;
  name: string;
  dueDate: string;
  amount: number;
  fine: number;
  discount: number;
  status: 'Pending' | 'Partial' | 'Overdue';
  paidAmount: number;
}
interface AdhocFee {
  id: string;
  name: string;
  description: string;
  amount: number;
  createdDate: string;
  dueDate: string;
  status: 'Pending' | 'Overdue';
}
interface PaymentGateway {
  id: string;
  name: string;
  logo: string;
  processingFee: string;
  processingFeeType: 'percentage' | 'fixed';
  processingFeeValue: number;
  minAmount: number;
  maxAmount: number;
  status: 'Active' | 'Inactive';
  features: string[];
}
export function InitiateOnlinePayment() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState('all');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedFeeType, setSelectedFeeType] = useState<FeeType>('installment');
  const [selectedInstallments, setSelectedInstallments] = useState<string[]>([]);
  const [selectedAdhocFees, setSelectedAdhocFees] = useState<string[]>([]);
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway | null>(
    null
  );
  const [generatedLink, setGeneratedLink] = useState('');
  const [linkExpiry, setLinkExpiry] = useState('24');
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [sendMethod, setSendMethod] = useState<'sms' | 'email' | 'both'>('both');
  const [customMessage, setCustomMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  // Mock student data
  const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    admissionNo: 'ADM2024001',
    class: '10',
    section: 'A',
    rollNo: '15',
    parentName: 'Mr. Vijay Sharma',
    parentPhone: '+91 98765 43210',
    parentEmail: 'vijay.sharma@email.com',
    photo: '/api/placeholder/80/80',
    totalDue: 45000,
    status: 'Active'
  },
  {
    id: '2',
    name: 'Priya Patel',
    admissionNo: 'ADM2024002',
    class: '9',
    section: 'B',
    rollNo: '08',
    parentName: 'Mrs. Anita Patel',
    parentPhone: '+91 98765 43211',
    parentEmail: 'anita.patel@email.com',
    photo: '/api/placeholder/80/80',
    totalDue: 32000,
    status: 'Active'
  },
  {
    id: '3',
    name: 'Rahul Verma',
    admissionNo: 'ADM2023045',
    class: '8',
    section: 'C',
    rollNo: '22',
    parentName: 'Mr. Suresh Verma',
    parentPhone: '+91 98765 43212',
    parentEmail: 'suresh.verma@email.com',
    photo: '/api/placeholder/80/80',
    totalDue: 28500,
    status: 'Active'
  }];

  // Mock fee installments
  const feeInstallments: FeeInstallment[] = [
  {
    id: 'inst1',
    name: 'Term 1 - Tuition Fee',
    dueDate: '2024-04-15',
    amount: 15000,
    fine: 500,
    discount: 0,
    status: 'Overdue',
    paidAmount: 0
  },
  {
    id: 'inst2',
    name: 'Term 1 - Development Fee',
    dueDate: '2024-04-15',
    amount: 5000,
    fine: 200,
    discount: 0,
    status: 'Overdue',
    paidAmount: 0
  },
  {
    id: 'inst3',
    name: 'Term 2 - Tuition Fee',
    dueDate: '2024-07-15',
    amount: 15000,
    fine: 0,
    discount: 750,
    status: 'Pending',
    paidAmount: 0
  },
  {
    id: 'inst4',
    name: 'Term 2 - Development Fee',
    dueDate: '2024-07-15',
    amount: 5000,
    fine: 0,
    discount: 250,
    status: 'Pending',
    paidAmount: 0
  },
  {
    id: 'inst5',
    name: 'Annual Sports Fee',
    dueDate: '2024-05-01',
    amount: 3000,
    fine: 0,
    discount: 0,
    status: 'Pending',
    paidAmount: 1500
  }];

  // Mock ad-hoc fees
  const adhocFees: AdhocFee[] = [
  {
    id: 'adhoc1',
    name: 'Science Lab Equipment',
    description: 'Contribution for new lab equipment',
    amount: 2500,
    createdDate: '2024-03-01',
    dueDate: '2024-03-31',
    status: 'Pending'
  },
  {
    id: 'adhoc2',
    name: 'Annual Day Costume',
    description: 'Costume and props for annual day performance',
    amount: 1500,
    createdDate: '2024-02-15',
    dueDate: '2024-03-15',
    status: 'Overdue'
  },
  {
    id: 'adhoc3',
    name: 'Educational Trip - Jaipur',
    description: '3-day educational trip including travel and stay',
    amount: 4500,
    createdDate: '2024-03-10',
    dueDate: '2024-04-01',
    status: 'Pending'
  }];

  // Mock payment gateways
  const paymentGateways: PaymentGateway[] = [
  {
    id: 'razorpay',
    name: 'Razorpay',
    logo: '/api/placeholder/120/40',
    processingFee: '2%',
    processingFeeType: 'percentage',
    processingFeeValue: 2,
    minAmount: 100,
    maxAmount: 500000,
    status: 'Active',
    features: ['UPI', 'Cards', 'Net Banking', 'Wallets', 'EMI']
  },
  {
    id: 'payu',
    name: 'PayU',
    logo: '/api/placeholder/120/40',
    processingFee: '1.8%',
    processingFeeType: 'percentage',
    processingFeeValue: 1.8,
    minAmount: 100,
    maxAmount: 1000000,
    status: 'Active',
    features: ['UPI', 'Cards', 'Net Banking', 'Wallets']
  },
  {
    id: 'paytm',
    name: 'Paytm Payment Gateway',
    logo: '/api/placeholder/120/40',
    processingFee: '1.75%',
    processingFeeType: 'percentage',
    processingFeeValue: 1.75,
    minAmount: 1,
    maxAmount: 200000,
    status: 'Active',
    features: ['UPI', 'Cards', 'Paytm Wallet', 'Net Banking']
  },
  {
    id: 'ccavenue',
    name: 'CCAvenue',
    logo: '/api/placeholder/120/40',
    processingFee: '2.5%',
    processingFeeType: 'percentage',
    processingFeeValue: 2.5,
    minAmount: 10,
    maxAmount: 500000,
    status: 'Inactive',
    features: ['Cards', 'Net Banking', 'EMI', 'International Cards']
  }];

  // Link expiry options
  const expiryOptions = [
  {
    value: '1',
    label: '1 Hour'
  },
  {
    value: '6',
    label: '6 Hours'
  },
  {
    value: '24',
    label: '24 Hours'
  },
  {
    value: '48',
    label: '48 Hours'
  },
  {
    value: '72',
    label: '72 Hours'
  },
  {
    value: '168',
    label: '7 Days'
  }];

  // Search filter options
  const searchFilterOptions = [
  {
    value: 'all',
    label: 'All Fields'
  },
  {
    value: 'name',
    label: 'Student Name'
  },
  {
    value: 'admission',
    label: 'Admission No.'
  },
  {
    value: 'phone',
    label: 'Parent Phone'
  }];

  // Handle student search
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      const results = mockStudents.filter(
        (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.parentPhone.includes(searchQuery)
      );
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };
  // Handle student selection
  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setCurrentStep(2);
    setSearchResults([]);
    setSearchQuery('');
  };
  // Calculate totals
  const calculateInstallmentTotal = () => {
    return feeInstallments.
    filter((f) => selectedInstallments.includes(f.id)).
    reduce(
      (sum, f) => sum + (f.amount - f.paidAmount + f.fine - f.discount),
      0
    );
  };
  const calculateAdhocTotal = () => {
    return adhocFees.
    filter((f) => selectedAdhocFees.includes(f.id)).
    reduce((sum, f) => sum + f.amount, 0);
  };
  const calculateTotalPayable = () => {
    return calculateInstallmentTotal() + calculateAdhocTotal();
  };
  const calculateProcessingFee = () => {
    if (!selectedGateway) return 0;
    const total = calculateTotalPayable();
    if (selectedGateway.processingFeeType === 'percentage') {
      return Math.round(total * selectedGateway.processingFeeValue / 100);
    }
    return selectedGateway.processingFeeValue;
  };
  const calculateGrandTotal = () => {
    return calculateTotalPayable() + calculateProcessingFee();
  };
  // Toggle installment selection
  const toggleInstallment = (id: string) => {
    setSelectedInstallments((prev) =>
    prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  // Toggle adhoc fee selection
  const toggleAdhocFee = (id: string) => {
    setSelectedAdhocFees((prev) =>
    prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  // Select all installments
  const selectAllInstallments = () => {
    if (selectedInstallments.length === feeInstallments.length) {
      setSelectedInstallments([]);
    } else {
      setSelectedInstallments(feeInstallments.map((f) => f.id));
    }
  };
  // Select all adhoc fees
  const selectAllAdhocFees = () => {
    if (selectedAdhocFees.length === adhocFees.length) {
      setSelectedAdhocFees([]);
    } else {
      setSelectedAdhocFees(adhocFees.map((f) => f.id));
    }
  };
  // Handle gateway selection
  const handleSelectGateway = (gateway: PaymentGateway) => {
    if (gateway.status === 'Active') {
      setSelectedGateway(gateway);
    }
  };
  // Generate payment link
  const handleGenerateLink = () => {
    setIsGeneratingLink(true);
    // Simulate API call
    setTimeout(() => {
      const linkId = Math.random().toString(36).substring(2, 10).toUpperCase();
      setGeneratedLink(`https://pay.schoolname.edu.in/p/${linkId}`);
      setIsGeneratingLink(false);
      setCurrentStep(4);
    }, 1500);
  };
  // Copy link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  // Handle send payment link
  const handleSendLink = () => {
    setIsSending(true);
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      setSendSuccess(true);
      setTimeout(() => {
        setIsSendModalOpen(false);
        setSendSuccess(false);
      }, 2000);
    }, 1500);
  };
  // Reset workflow
  const handleStartNew = () => {
    setCurrentStep(1);
    setSelectedStudent(null);
    setSelectedInstallments([]);
    setSelectedAdhocFees([]);
    setSelectedGateway(null);
    setGeneratedLink('');
    setSearchQuery('');
    setSearchResults([]);
  };
  // Navigate to specific step
  const navigateToStep = (step: Step) => {
    if (step < currentStep) {
      setCurrentStep(step);
    }
  };
  // Check if can proceed to next step
  const canProceedToStep3 = () => {
    return selectedInstallments.length > 0 || selectedAdhocFees.length > 0;
  };
  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Overdue':
        return 'danger';
      case 'Pending':
        return 'warning';
      case 'Partial':
        return 'info';
      default:
        return 'secondary';
    }
  };
  // Step indicator component
  const StepIndicator = () =>
  <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) =>
    <Fragment key={step}>
          <button
        onClick={() => navigateToStep(step as Step)}
        disabled={step > currentStep}
        className={`flex items-center justify-center w-10 h-10 rounded-full font-medium transition-all ${step === currentStep ? 'bg-blue-600 text-white' : step < currentStep ? 'bg-green-500 text-white cursor-pointer hover:bg-green-600' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>

            {step < currentStep ? <Check className="w-5 h-5" /> : step}
          </button>
          {step < 4 &&
      <div
        className={`w-20 h-1 mx-2 rounded ${step < currentStep ? 'bg-green-500' : 'bg-gray-200'}`} />

      }
        </Fragment>
    )}
    </div>;

  // Step labels
  const StepLabels = () =>
  <div className="flex items-center justify-center mb-6">
      <div className="flex items-center gap-16 text-sm">
        <span
        className={
        currentStep === 1 ? 'text-blue-600 font-medium' : 'text-gray-500'
        }>

          Select Student
        </span>
        <span
        className={
        currentStep === 2 ? 'text-blue-600 font-medium' : 'text-gray-500'
        }>

          Select Fees
        </span>
        <span
        className={
        currentStep === 3 ? 'text-blue-600 font-medium' : 'text-gray-500'
        }>

          Choose Gateway
        </span>
        <span
        className={
        currentStep === 4 ? 'text-blue-600 font-medium' : 'text-gray-500'
        }>

          Payment Link
        </span>
      </div>
    </div>;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Initiate Online Payment
          </h1>
          <p className="text-sm text-gray-500">
            Generate payment links for parents to complete fee payments online
          </p>
        </div>
        {currentStep > 1 &&
        <Button variant="outline" onClick={handleStartNew}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Start New
          </Button>
        }
      </div>

      {/* Step Indicator */}
      <Card className="p-6">
        <StepIndicator />
        <StepLabels />
      </Card>

      {/* Step 1: Search and Select Student */}
      {currentStep === 1 &&
      <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Search & Select Student
            </h2>

            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                  placeholder="Search by student name, admission number, or parent phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 h-12 text-lg" />

                </div>
              </div>
              <Select
              className="w-44"
              options={searchFilterOptions}
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)} />

              <Button
              variant="primary"
              onClick={handleSearch}
              disabled={!searchQuery.trim() || isSearching}
              className="px-6">

                {isSearching ?
              <Loader2 className="w-5 h-5 animate-spin" /> :

              <>
                    <Search className="w-5 h-5 mr-2" />
                    Search
                  </>
              }
              </Button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 &&
          <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Found {searchResults.length} student(s)
                </p>
                {searchResults.map((student) =>
            <div
              key={student.id}
              className="border rounded-lg p-4 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all"
              onClick={() => handleSelectStudent(student)}>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="w-7 h-7 text-gray-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {student.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              {student.admissionNo}
                            </span>
                            <span className="flex items-center gap-1">
                              <Building className="w-3 h-3" />
                              Class {student.class}-{student.section}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {student.parentPhone}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Parent: {student.parentName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total Due</p>
                        <p className="text-xl font-bold text-red-600">
                          ₹{student.totalDue.toLocaleString()}
                        </p>
                        <Button variant="primary" size="sm" className="mt-2">
                          Select
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
            )}
              </div>
          }

            {/* No Results */}
            {searchQuery && searchResults.length === 0 && !isSearching &&
          <div className="text-center py-12">
                <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  No students found matching your search
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Try searching with different keywords
                </p>
              </div>
          }

            {/* Initial State */}
            {!searchQuery && searchResults.length === 0 &&
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Search for a student to initiate payment
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Enter student name, admission number, or parent phone number
                </p>
              </div>
          }
          </Card>
        </div>
      }

      {/* Step 2: Select Fees */}
      {currentStep === 2 && selectedStudent &&
      <div className="space-y-6">
          {/* Selected Student Card */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedStudent.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedStudent.admissionNo} • Class{' '}
                    {selectedStudent.class}-{selectedStudent.section}
                  </p>
                </div>
              </div>
              <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep(1)}>

                Change Student
              </Button>
            </div>
          </Card>

          {/* Fee Type Tabs */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-blue-600" />
                Select Fees to Pay
              </h2>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                onClick={() => setSelectedFeeType('installment')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${selectedFeeType === 'installment' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>

                  Fee Installments
                </button>
                <button
                onClick={() => setSelectedFeeType('adhoc')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${selectedFeeType === 'adhoc' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>

                  Ad-hoc Fees
                </button>
              </div>
            </div>

            {/* Fee Installments */}
            {selectedFeeType === 'installment' &&
          <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    {selectedInstallments.length} of {feeInstallments.length}{' '}
                    selected
                  </p>
                  <Button
                variant="ghost"
                size="sm"
                onClick={selectAllInstallments}>

                    {selectedInstallments.length === feeInstallments.length ?
                'Deselect All' :
                'Select All'}
                  </Button>
                </div>

                <div className="space-y-3">
                  {feeInstallments.map((fee) =>
              <div
                key={fee.id}
                onClick={() => toggleInstallment(fee.id)}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedInstallments.includes(fee.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedInstallments.includes(fee.id) ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>

                            {selectedInstallments.includes(fee.id) &&
                      <Check className="w-4 h-4 text-white" />
                      }
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {fee.name}
                            </h4>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-sm text-gray-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Due: {fee.dueDate}
                              </span>
                              <Badge variant={getStatusVariant(fee.status)}>
                                {fee.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            ₹{fee.amount.toLocaleString()}
                          </p>
                          {fee.paidAmount > 0 &&
                    <p className="text-xs text-green-600">
                              Paid: ₹{fee.paidAmount.toLocaleString()}
                            </p>
                    }
                          {fee.fine > 0 &&
                    <p className="text-xs text-red-600">
                              + Fine: ₹{fee.fine.toLocaleString()}
                            </p>
                    }
                          {fee.discount > 0 &&
                    <p className="text-xs text-green-600">
                              - Discount: ₹{fee.discount.toLocaleString()}
                            </p>
                    }
                        </div>
                      </div>
                    </div>
              )}
                </div>
              </div>
          }

            {/* Ad-hoc Fees */}
            {selectedFeeType === 'adhoc' &&
          <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    {selectedAdhocFees.length} of {adhocFees.length} selected
                  </p>
                  <Button
                variant="ghost"
                size="sm"
                onClick={selectAllAdhocFees}>

                    {selectedAdhocFees.length === adhocFees.length ?
                'Deselect All' :
                'Select All'}
                  </Button>
                </div>

                <div className="space-y-3">
                  {adhocFees.map((fee) =>
              <div
                key={fee.id}
                onClick={() => toggleAdhocFee(fee.id)}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedAdhocFees.includes(fee.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedAdhocFees.includes(fee.id) ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>

                            {selectedAdhocFees.includes(fee.id) &&
                      <Check className="w-4 h-4 text-white" />
                      }
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {fee.name}
                            </h4>
                            <p className="text-sm text-gray-500 mt-0.5">
                              {fee.description}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-gray-400 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Due: {fee.dueDate}
                              </span>
                              <Badge variant={getStatusVariant(fee.status)}>
                                {fee.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            ₹{fee.amount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
              )}
                </div>
              </div>
          }
          </Card>

          {/* Selection Summary */}
          <Card className="p-6 bg-gray-50">
            <h3 className="font-semibold text-gray-900 mb-4">
              Payment Summary
            </h3>
            <div className="space-y-3">
              {selectedInstallments.length > 0 &&
            <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Fee Installments ({selectedInstallments.length} items)
                  </span>
                  <span className="font-medium">
                    ₹{calculateInstallmentTotal().toLocaleString()}
                  </span>
                </div>
            }
              {selectedAdhocFees.length > 0 &&
            <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Ad-hoc Fees ({selectedAdhocFees.length} items)
                  </span>
                  <span className="font-medium">
                    ₹{calculateAdhocTotal().toLocaleString()}
                  </span>
                </div>
            }
              <div className="border-t pt-3 flex justify-between">
                <span className="font-semibold text-gray-900">
                  Total Payable
                </span>
                <span className="font-bold text-xl text-blue-600">
                  ₹{calculateTotalPayable().toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Back
              </Button>
              <Button
              variant="primary"
              onClick={() => setCurrentStep(3)}
              disabled={!canProceedToStep3()}>

                Continue to Gateway Selection
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      }

      {/* Step 3: Choose Gateway */}
      {currentStep === 3 && selectedStudent &&
      <div className="space-y-6">
          {/* Summary Bar */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">
                    {selectedStudent.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">
                    {selectedInstallments.length + selectedAdhocFees.length}{' '}
                    fee(s) selected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-blue-600">
                    ₹{calculateTotalPayable().toLocaleString()}
                  </span>
                </div>
              </div>
              <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep(2)}>

                Modify Selection
              </Button>
            </div>
          </Card>

          {/* Gateway Selection */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Choose Payment Gateway
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentGateways.map((gateway) =>
            <div
              key={gateway.id}
              onClick={() => handleSelectGateway(gateway)}
              className={`border-2 rounded-lg p-5 cursor-pointer transition-all ${gateway.status === 'Inactive' ? 'opacity-50 cursor-not-allowed bg-gray-50' : selectedGateway?.id === gateway.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedGateway?.id === gateway.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>

                        {selectedGateway?.id === gateway.id &&
                    <Check className="w-4 h-4 text-white" />
                    }
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {gateway.name}
                        </h3>
                        <Badge
                      variant={
                      gateway.status === 'Active' ?
                      'success' :
                      'secondary'
                      }
                      className="mt-1">

                          {gateway.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Processing Fee</p>
                      <p className="font-semibold text-gray-900">
                        {gateway.processingFee}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {gateway.features.map((feature, idx) =>
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">

                        {feature}
                      </span>
                )}
                  </div>

                  <div className="text-xs text-gray-500">
                    Min: ₹{gateway.minAmount.toLocaleString()} • Max: ₹
                    {gateway.maxAmount.toLocaleString()}
                  </div>
                </div>
            )}
            </div>
          </Card>

          {/* Link Settings */}
          {selectedGateway &&
        <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Payment Link Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link Expiry Time
                  </label>
                  <Select
                className="w-full"
                options={expiryOptions}
                value={linkExpiry}
                onChange={(e) => setLinkExpiry(e.target.value)} />

                  <p className="text-xs text-gray-500 mt-1">
                    Link will expire after the selected duration
                  </p>
                </div>
              </div>
            </Card>
        }

          {/* Final Summary */}
          <Card className="p-6 bg-gray-50">
            <h3 className="font-semibold text-gray-900 mb-4">
              Final Payment Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Fee Amount</span>
                <span className="font-medium">
                  ₹{calculateTotalPayable().toLocaleString()}
                </span>
              </div>
              {selectedGateway &&
            <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Processing Fee ({selectedGateway.processingFee})
                  </span>
                  <span className="font-medium">
                    ₹{calculateProcessingFee().toLocaleString()}
                  </span>
                </div>
            }
              <div className="border-t pt-3 flex justify-between">
                <span className="font-semibold text-gray-900">Grand Total</span>
                <span className="font-bold text-xl text-blue-600">
                  ₹{calculateGrandTotal().toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                Back
              </Button>
              <Button
              variant="primary"
              onClick={handleGenerateLink}
              disabled={!selectedGateway || isGeneratingLink}>

                {isGeneratingLink ?
              <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Link...
                  </> :

              <>
                    <Link className="w-4 h-4 mr-2" />
                    Generate Payment Link
                  </>
              }
              </Button>
            </div>
          </Card>
        </div>
      }

      {/* Step 4: Payment Link Generated */}
      {currentStep === 4 && selectedStudent && generatedLink &&
      <div className="space-y-6">
          {/* Success Banner */}
          <Card className="p-6 bg-green-50 border-green-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-green-800">
                  Payment Link Generated Successfully!
                </h2>
                <p className="text-sm text-green-600">
                  Share this link with the parent to complete the payment
                </p>
              </div>
            </div>
          </Card>

          {/* Payment Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Link Card */}
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Link className="w-5 h-5 text-blue-600" />
                  Payment Link
                </h3>

                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <input
                    type="text"
                    value={generatedLink}
                    readOnly
                    className="flex-1 bg-transparent font-mono text-sm text-gray-700 outline-none" />

                    <Button
                    variant={isCopied ? 'primary' : 'outline'}
                    onClick={handleCopyLink}>

                      {isCopied ?
                    <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied!
                        </> :

                    <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </>
                    }
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                  <Clock className="w-4 h-4" />
                  <span>
                    Link expires in {linkExpiry} hour
                    {parseInt(linkExpiry) > 1 ? 's' : ''}
                  </span>
                </div>

                {/* Share Options */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button
                  variant="outline"
                  className="justify-center"
                  onClick={() => {
                    setSendMethod('sms');
                    setIsSendModalOpen(true);
                  }}>

                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send via SMS
                  </Button>
                  <Button
                  variant="outline"
                  className="justify-center"
                  onClick={() => {
                    setSendMethod('email');
                    setIsSendModalOpen(true);
                  }}>

                    <Mail className="w-4 h-4 mr-2" />
                    Send via Email
                  </Button>
                  <Button
                  variant="primary"
                  className="justify-center"
                  onClick={() => {
                    setSendMethod('both');
                    setIsSendModalOpen(true);
                  }}>

                    <Send className="w-4 h-4 mr-2" />
                    Send Both
                  </Button>
                </div>
              </Card>

              {/* QR Code Card */}
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-blue-600" />
                  QR Code
                </h3>
                <div className="flex items-center gap-6">
                  <div className="w-40 h-40 bg-gray-100 rounded-lg flex items-center justify-center border">
                    <QrCode className="w-24 h-24 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-3">
                      Parent can scan this QR code directly to access the
                      payment page
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download QR
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share QR
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Summary Sidebar */}
            <div className="space-y-6">
              {/* Student Info */}
              <Card className="p-5">
                <h4 className="font-medium text-gray-700 mb-3">
                  Student Details
                </h4>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {selectedStudent.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Class {selectedStudent.class}-{selectedStudent.section}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Admission No.</span>
                    <span className="font-medium">
                      {selectedStudent.admissionNo}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Parent</span>
                    <span className="font-medium">
                      {selectedStudent.parentName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phone</span>
                    <span className="font-medium">
                      {selectedStudent.parentPhone}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Payment Summary */}
              <Card className="p-5">
                <h4 className="font-medium text-gray-700 mb-3">
                  Payment Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fee Amount</span>
                    <span>₹{calculateTotalPayable().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Processing Fee</span>
                    <span>₹{calculateProcessingFee().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Gateway</span>
                    <span>{selectedGateway?.name}</span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-blue-600">
                      ₹{calculateGrandTotal().toLocaleString()}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-5">
                <h4 className="font-medium text-gray-700 mb-3">
                  Quick Actions
                </h4>
                <div className="space-y-2">
                  <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm">

                    <ExternalLink className="w-4 h-4 mr-2" />
                    Preview Payment Page
                  </Button>
                  <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm">

                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate Link
                  </Button>
                  <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                  onClick={handleStartNew}>

                    <Plus className="w-4 h-4 mr-2" />
                    Create New Payment
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      }

      {/* Send Link Modal */}
      {isSendModalOpen && selectedStudent &&
      <Modal
        isOpen={isSendModalOpen}
        onClose={() => {
          setIsSendModalOpen(false);
          setSendSuccess(false);
        }}
        title="Send Payment Link">

          {sendSuccess ?
        <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Link Sent Successfully!
              </h3>
              <p className="text-sm text-gray-600">
                Payment link has been sent to the parent via{' '}
                {sendMethod === 'both' ?
            'SMS and Email' :
            sendMethod.toUpperCase()}
              </p>
            </div> :

        <div className="space-y-6">
              {/* Recipient Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Recipient Details
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      {selectedStudent.parentPhone}
                    </span>
                    {(sendMethod === 'sms' || sendMethod === 'both') &&
                <Badge variant="success" className="ml-auto">
                        Will receive SMS
                      </Badge>
                }
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      {selectedStudent.parentEmail}
                    </span>
                    {(sendMethod === 'email' || sendMethod === 'both') &&
                <Badge variant="success" className="ml-auto">
                        Will receive Email
                      </Badge>
                }
                  </div>
                </div>
              </div>

              {/* Send Method Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Send Via
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                onClick={() => setSendMethod('sms')}
                className={`p-3 border-2 rounded-lg text-center transition-all ${sendMethod === 'sms' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>

                    <MessageSquare
                  className={`w-5 h-5 mx-auto mb-1 ${sendMethod === 'sms' ? 'text-blue-600' : 'text-gray-400'}`} />

                    <span className="text-sm font-medium">SMS</span>
                  </button>
                  <button
                onClick={() => setSendMethod('email')}
                className={`p-3 border-2 rounded-lg text-center transition-all ${sendMethod === 'email' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>

                    <Mail
                  className={`w-5 h-5 mx-auto mb-1 ${sendMethod === 'email' ? 'text-blue-600' : 'text-gray-400'}`} />

                    <span className="text-sm font-medium">Email</span>
                  </button>
                  <button
                onClick={() => setSendMethod('both')}
                className={`p-3 border-2 rounded-lg text-center transition-all ${sendMethod === 'both' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>

                    <Send
                  className={`w-5 h-5 mx-auto mb-1 ${sendMethod === 'both' ? 'text-blue-600' : 'text-gray-400'}`} />

                    <span className="text-sm font-medium">Both</span>
                  </button>
                </div>
              </div>

              {/* Message Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message Preview
                </label>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                  <p>Dear {selectedStudent.parentName},</p>
                  <p className="mt-2">
                    Please use the following link to pay the pending fees of ₹
                    {calculateGrandTotal().toLocaleString()} for{' '}
                    {selectedStudent.name} ({selectedStudent.admissionNo}):
                  </p>
                  <p className="mt-2 text-blue-600 break-all">
                    {generatedLink}
                  </p>
                  <p className="mt-2">
                    This link will expire in {linkExpiry} hour
                    {parseInt(linkExpiry) > 1 ? 's' : ''}.
                  </p>
                  <p className="mt-2">Thank you,</p>
                  <p>School Name Finance Team</p>
                </div>
              </div>

              {/* Custom Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Custom Note (Optional)
                </label>
                <Input
              placeholder="Add a custom note to the message..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)} />

              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
              variant="outline"
              onClick={() => setIsSendModalOpen(false)}>

                  Cancel
                </Button>
                <Button
              variant="primary"
              onClick={handleSendLink}
              disabled={isSending}>

                  {isSending ?
              <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </> :

              <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Payment Link
                    </>
              }
                </Button>
              </div>
            </div>
        }
        </Modal>
      }
    </div>);

}