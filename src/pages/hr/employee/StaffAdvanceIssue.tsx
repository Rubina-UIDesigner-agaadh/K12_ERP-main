// File: src/pages/finance/advances/StaffAdvanceIssue.tsx

import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  User,
  Search,
  Banknote,
  Briefcase,
  Calendar,
  RefreshCcw,
  Wallet,
  ShieldCheck,
  Info,
  Save,
  AlertCircle,
  Landmark,
  CheckCircle2,
  XCircle,
  FileText,
  TrendingUp,
  Clock,
  DollarSign,
  CreditCard,
  Building2,
  Phone,
  Mail,
  MapPin,
  Award,
  BarChart3 } from
'lucide-react';

export function StaffAdvanceIssue() {
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [paymentMode, setPaymentMode] = useState('bank');
  const [recoveryMode, setRecoveryMode] = useState('salary');
  const [advanceAmount, setAdvanceAmount] = useState('');
  const [advanceCategory, setAdvanceCategory] = useState('');
  const [installments, setInstallments] = useState('1');

  // Mock Staff Search Handler
  const handleSearch = () => {
    setSelectedStaff({
      id: 'EMP-9920',
      name: 'Dr. Ramesh Kumar',
      designation: 'Senior Faculty (Mathematics)',
      department: 'Secondary Education',
      joiningDate: '2018-06-15',
      currentAdvanceBalance: 5000.00,
      monthlySalary: 75000.00,
      basicSalary: 45000.00,
      allowances: 30000.00,
      email: 'ramesh.kumar@school.edu.in',
      phone: '+91 98765 43210',
      bankAccount: 'HDFC Bank - ****7890',
      pfNumber: 'PF/2018/9920',
      panNumber: 'ABCDE1234F',
      employmentStatus: 'Permanent',
      totalAdvancesTaken: 3,
      totalAdvancesRepaid: 2,
      creditScore: 'Excellent',
      lastAdvanceDate: '2023-11-15',
      photo: 'https://ui-avatars.com/api/?name=Ramesh+Kumar&background=4f46e5&color=fff'
    });
  };

  // Calculate max eligible amount
  const maxEligibleAmount = selectedStaff ? selectedStaff.monthlySalary * 0.5 - selectedStaff.currentAdvanceBalance : 0;
  const installmentAmount = advanceAmount ? (parseFloat(advanceAmount) / parseInt(installments || '1')).toFixed(2) : '0.00';

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Enhanced Header with Stats */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            Staff Advance Disbursement 
            <Wallet className="w-8 h-8 text-indigo-600" />
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Issue salary advances, tour allowances, and emergency funds to employees
          </p>
        </div>
        <div className="flex gap-3">
          <Badge variant="info" className="px-4 py-2 text-xs">
            <Clock className="w-3 h-3 mr-1" />
            Treasury Operations
          </Badge>
          <Badge variant="success" className="px-4 py-2 text-xs">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            System Online
          </Badge>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-indigo-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-indigo-600 font-bold uppercase tracking-wide">Total Advances (Month)</p>
              <p className="text-2xl font-black text-indigo-900 mt-1">₹2,45,000</p>
            </div>
            <TrendingUp className="w-10 h-10 text-indigo-300" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-600 font-bold uppercase tracking-wide">Recovered This Month</p>
              <p className="text-2xl font-black text-green-900 mt-1">₹1,85,000</p>
            </div>
            <RefreshCcw className="w-10 h-10 text-green-300" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-amber-600 font-bold uppercase tracking-wide">Pending Recovery</p>
              <p className="text-2xl font-black text-amber-900 mt-1">₹3,12,000</p>
            </div>
            <BarChart3 className="w-10 h-10 text-amber-300" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-purple-600 font-bold uppercase tracking-wide">Active Advances</p>
              <p className="text-2xl font-black text-purple-900 mt-1">42 Staff</p>
            </div>
            <User className="w-10 h-10 text-purple-300" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-6">
        
        {/* Left Side: Staff Search & Detailed Context */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Search Card */}
          <Card className="p-6 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block flex items-center gap-2">
              <span className="bg-indigo-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">1</span>
              Identify Employee
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="Employee ID, Name, or Phone..."
                leftIcon={<Search className="w-4 h-4 text-gray-400" />}
                className="flex-1" />

              <Button
                variant="primary"
                onClick={handleSearch}
                className="px-6">

                <Search className="w-4 h-4 mr-1" />
                Find
              </Button>
            </div>

            {selectedStaff ?
            <div className="mt-8 pt-8 border-t border-gray-200 animate-in fade-in slide-in-from-top-4">
                {/* Staff Profile Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="relative">
                    <img
                    src={selectedStaff.photo}
                    alt="Staff"
                    className="w-20 h-20 rounded-2xl shadow-lg border-4 border-white ring-2 ring-indigo-100" />

                    <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-black text-gray-900">{selectedStaff.name}</h3>
                    <p className="text-xs text-gray-500 font-medium">{selectedStaff.designation}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary" className="text-[9px] px-2 py-0.5">
                        {selectedStaff.department}
                      </Badge>
                      <Badge variant="success" className="text-[9px] px-2 py-0.5">
                        {selectedStaff.employmentStatus}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Employee Details Grid */}
                <div className="space-y-3 mb-6">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-[9px] text-gray-400 uppercase font-bold mb-1">Employee ID</p>
                      <p className="text-xs font-black text-gray-900">{selectedStaff.id}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-[9px] text-gray-400 uppercase font-bold mb-1">Joining Date</p>
                      <p className="text-xs font-black text-gray-900">{selectedStaff.joiningDate}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] text-indigo-600 uppercase font-black flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        Monthly Salary
                      </span>
                      <span className="text-sm font-black text-indigo-900">₹{selectedStaff.monthlySalary.toLocaleString()}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="flex justify-between">
                        <span className="text-indigo-600">Basic:</span>
                        <span className="font-bold text-indigo-800">₹{selectedStaff.basicSalary.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-indigo-600">Allowances:</span>
                        <span className="font-bold text-indigo-800">₹{selectedStaff.allowances.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 border-2 border-amber-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-amber-700 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Current Advance Balance
                      </span>
                      <span className="text-lg font-black text-amber-900">₹{selectedStaff.currentAdvanceBalance.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-green-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Max Eligible Amount
                      </span>
                      <span className="text-lg font-black text-green-900">₹{maxEligibleAmount.toLocaleString()}</span>
                    </div>
                    <p className="text-[9px] text-green-600 mt-1 italic">50% of salary minus existing advance</p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-indigo-100 space-y-2">
                  <p className="text-[9px] font-black text-indigo-600 uppercase tracking-wider mb-3">Contact & Banking</p>
                  
                  <div className="flex items-center gap-2 text-xs">
                    <Mail className="w-3 h-3 text-indigo-500" />
                    <span className="text-gray-700">{selectedStaff.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs">
                    <Phone className="w-3 h-3 text-indigo-500" />
                    <span className="text-gray-700">{selectedStaff.phone}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs">
                    <Building2 className="w-3 h-3 text-indigo-500" />
                    <span className="text-gray-700">{selectedStaff.bankAccount}</span>
                  </div>

                  <div className="pt-2 mt-2 border-t border-indigo-200 grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <span className="text-indigo-500">PF Number:</span>
                      <p className="font-bold text-indigo-900">{selectedStaff.pfNumber}</p>
                    </div>
                    <div>
                      <span className="text-indigo-500">PAN:</span>
                      <p className="font-bold text-indigo-900">{selectedStaff.panNumber}</p>
                    </div>
                  </div>
                </div>

                {/* Credit History */}
                <div className="mt-4 p-4 bg-purple-50 border border-purple-100 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[9px] font-black text-purple-600 uppercase tracking-wider flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      Credit Score
                    </p>
                    <Badge variant="success" className="text-[9px]">{selectedStaff.creditScore}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-white rounded-lg">
                      <p className="text-lg font-black text-purple-900">{selectedStaff.totalAdvancesTaken}</p>
                      <p className="text-[8px] text-purple-600 uppercase">Total Taken</p>
                    </div>
                    <div className="p-2 bg-white rounded-lg">
                      <p className="text-lg font-black text-green-900">{selectedStaff.totalAdvancesRepaid}</p>
                      <p className="text-[8px] text-green-600 uppercase">Repaid</p>
                    </div>
                    <div className="p-2 bg-white rounded-lg">
                      <p className="text-lg font-black text-amber-900">{selectedStaff.totalAdvancesTaken - selectedStaff.totalAdvancesRepaid}</p>
                      <p className="text-[8px] text-amber-600 uppercase">Active</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-purple-200">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-purple-600">Last Advance:</span>
                      <span className="font-bold text-purple-900">{selectedStaff.lastAdvanceDate}</span>
                    </div>
                  </div>
                </div>

              </div> :

            <div className="mt-8 py-16 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                <User className="w-16 h-16 text-gray-200 mx-auto mb-3" />
                <p className="text-sm font-bold text-gray-400 mb-1">No Employee Selected</p>
                <p className="text-xs text-gray-400 italic">Search by ID, name, or phone number</p>
              </div>
            }
          </Card>

          {/* Eligibility Policy Card */}
          <Card className="p-5 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 border-2 border-indigo-100">
            <div className="flex items-start gap-3">
              <div className="bg-indigo-600 p-2 rounded-xl">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-xs font-black text-indigo-900">Advance Eligibility Policy</p>
                <ul className="space-y-1.5 text-[10px] text-indigo-700 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0 text-indigo-500" />
                    <span>Maximum advance: <strong>50% of gross monthly salary</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0 text-indigo-500" />
                    <span>Existing advances are deducted from eligibility</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0 text-indigo-500" />
                    <span>Tour advances may exceed limit with approval</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0 text-indigo-500" />
                    <span>Minimum 6 months service required for salary advance</span>
                  </li>
                </ul>
                {selectedStaff &&
                <div className="mt-3 pt-3 border-t border-indigo-200">
                    <p className="text-[10px] text-indigo-600 mb-1">For {selectedStaff.name}:</p>
                    <p className="text-sm font-black text-indigo-900">
                      Max Eligible: ₹{maxEligibleAmount.toLocaleString()}
                    </p>
                  </div>
                }
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side: Enhanced Advance Issue Form */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <Card className={`p-8 border-t-4 transition-all duration-300 ${selectedStaff ? 'border-t-indigo-600 opacity-100 shadow-lg' : 'border-t-gray-200 opacity-40 grayscale pointer-events-none'}`}>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <span className="bg-indigo-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">2</span>
                Disbursement Configuration
              </h3>
              {selectedStaff &&
              <Badge variant="info" className="text-[9px]">
                  <FileText className="w-3 h-3 mr-1" />
                  Form Active
                </Badge>
              }
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Advance Details */}
              <div className="space-y-6">
                <div className="p-5 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-100">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Briefcase className="w-3 h-3" />
                    Advance Parameters
                  </p>

                  <Select
                    label="Advance Category"
                    options={[
                    { label: '💰 Salary Advance (Personal Loan)', value: 'salary' },
                    { label: '✈️ Tour Advance (Official Travel)', value: 'tour' },
                    { label: '🎉 Festival Advance', value: 'festival' },
                    { label: '🏥 Medical Emergency Advance', value: 'medical' },
                    { label: '🏠 Housing Advance', value: 'housing' },
                    { label: '📚 Education Advance', value: 'education' }]
                    }
                    placeholder="Select Advance Type"
                    value={advanceCategory}
                    onChange={(e) => setAdvanceCategory(e.target.value)} />


                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="relative">
                      <Input
                        label="Advance Amount (₹)"
                        type="number"
                        placeholder="0.00"
                        className="font-bold text-lg pr-12"
                        value={advanceAmount}
                        onChange={(e) => setAdvanceAmount(e.target.value)} />

                      {advanceAmount && parseFloat(advanceAmount) > maxEligibleAmount &&
                      <div className="absolute -bottom-5 left-0 flex items-center gap-1 text-[9px] text-red-600">
                          <XCircle className="w-3 h-3" />
                          <span>Exceeds eligible limit</span>
                        </div>
                      }
                    </div>
                    <Input
                      label="Disbursement Date"
                      type="date"
                      defaultValue={new Date().toISOString().split('T')[0]} />

                  </div>

                  {/* Amount Validator */}
                  {advanceAmount &&
                  <div className={`mt-6 p-3 rounded-xl border-2 animate-in fade-in slide-in-from-top-2 ${
                  parseFloat(advanceAmount) <= maxEligibleAmount ?
                  'bg-green-50 border-green-200' :
                  'bg-red-50 border-red-200'}`
                  }>
                      <div className="flex items-center gap-2">
                        {parseFloat(advanceAmount) <= maxEligibleAmount ?
                      <>
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <p className="text-xs font-bold text-green-900">Amount within eligible limit</p>
                          </> :

                      <>
                            <XCircle className="w-4 h-4 text-red-600" />
                            <p className="text-xs font-bold text-red-900">Requires special approval</p>
                          </>
                      }
                      </div>
                    </div>
                  }
                </div>

                {/* Payment Mode Selection */}
                <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-indigo-100">
                  <label className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-4 block flex items-center gap-2">
                    <CreditCard className="w-3 h-3" />
                    Payment Disbursement Mode
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setPaymentMode('cash')}
                      className={`flex flex-col items-center p-5 rounded-2xl border-3 transition-all duration-300 ${
                      paymentMode === 'cash' ?
                      'border-indigo-600 bg-white shadow-lg scale-105 ring-4 ring-indigo-100' :
                      'border-gray-200 bg-white/50 opacity-60 hover:opacity-100'}`
                      }>

                      <div className={`p-3 rounded-xl mb-2 ${paymentMode === 'cash' ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                        <Banknote className={`w-6 h-6 ${paymentMode === 'cash' ? 'text-indigo-600' : 'text-gray-400'}`} />
                      </div>
                      <span className="text-xs font-bold uppercase">Cash Payment</span>
                      <span className="text-[9px] text-gray-500 mt-1">Immediate disbursal</span>
                    </button>
                    <button
                      onClick={() => setPaymentMode('bank')}
                      className={`flex flex-col items-center p-5 rounded-2xl border-3 transition-all duration-300 ${
                      paymentMode === 'bank' ?
                      'border-indigo-600 bg-white shadow-lg scale-105 ring-4 ring-indigo-100' :
                      'border-gray-200 bg-white/50 opacity-60 hover:opacity-100'}`
                      }>

                      <div className={`p-3 rounded-xl mb-2 ${paymentMode === 'bank' ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                        <Landmark className={`w-6 h-6 ${paymentMode === 'bank' ? 'text-indigo-600' : 'text-gray-400'}`} />
                      </div>
                      <span className="text-xs font-bold uppercase">Bank Transfer</span>
                      <span className="text-[9px] text-gray-500 mt-1">1-2 business days</span>
                    </button>
                  </div>

                  {paymentMode === 'bank' && selectedStaff &&
                  <div className="mt-4 p-3 bg-white rounded-xl border border-indigo-200 animate-in slide-in-from-top-2">
                      <p className="text-[9px] text-indigo-600 font-bold mb-1">Transfer to:</p>
                      <p className="text-xs font-black text-indigo-900">{selectedStaff.bankAccount}</p>
                    </div>
                  }
                </div>

                {/* Purpose/Remarks */}
                <div>
                  <Input
                    label="Purpose / Remarks"
                    placeholder="e.g., Travel for National Mathematics Seminar, New Delhi"
                    leftIcon={<FileText className="w-4 h-4 text-gray-400" />} />

                  <p className="text-[9px] text-gray-400 italic mt-1.5 ml-1">
                    Provide detailed justification for advance request
                  </p>
                </div>
              </div>

              {/* Right Column: Recovery Configuration */}
              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-2xl border-2 border-purple-100">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="bg-purple-600 p-2 rounded-xl">
                      <RefreshCcw className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-purple-900 uppercase tracking-wider">Recovery Settlement Plan</h4>
                      <p className="text-[9px] text-purple-600">Configure repayment method</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Salary Deduction Option */}
                    <div
                      onClick={() => setRecoveryMode('salary')}
                      className={`p-5 rounded-2xl border-3 cursor-pointer transition-all duration-300 ${
                      recoveryMode === 'salary' ?
                      'border-purple-600 bg-white shadow-lg scale-[1.02]' :
                      'border-transparent bg-white/70 opacity-70 hover:opacity-100'}`
                      }>

                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-4 transition-all ${
                          recoveryMode === 'salary' ? 'border-purple-600 bg-white shadow-md' : 'border-gray-300'}`
                          }>
                            {recoveryMode === 'salary' &&
                            <div className="w-full h-full bg-purple-600 rounded-full scale-50" />
                            }
                          </div>
                          <div>
                            <span className="text-sm font-black text-gray-900 block">Automatic Salary Deduction</span>
                            <span className="text-[9px] text-purple-600 uppercase tracking-wide">Recommended</span>
                          </div>
                        </div>
                        <Badge variant="success" className="text-[8px]">Auto</Badge>
                      </div>
                      <p className="text-[10px] text-gray-600 leading-relaxed ml-8">
                        Amount will be automatically deducted from monthly salary in equal installments via payroll system.
                      </p>
                    </div>

                    {/* Manual Settlement Option */}
                    <div
                      onClick={() => setRecoveryMode('manual')}
                      className={`p-5 rounded-2xl border-3 cursor-pointer transition-all duration-300 ${
                      recoveryMode === 'manual' ?
                      'border-purple-600 bg-white shadow-lg scale-[1.02]' :
                      'border-transparent bg-white/70 opacity-70 hover:opacity-100'}`
                      }>

                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-4 transition-all ${
                          recoveryMode === 'manual' ? 'border-purple-600 bg-white shadow-md' : 'border-gray-300'}`
                          }>
                            {recoveryMode === 'manual' &&
                            <div className="w-full h-full bg-purple-600 rounded-full scale-50" />
                            }
                          </div>
                          <div>
                            <span className="text-sm font-black text-gray-900 block">Manual Settlement</span>
                            <span className="text-[9px] text-amber-600 uppercase tracking-wide">Manual Tracking</span>
                          </div>
                        </div>
                        <Badge variant="warning" className="text-[8px]">Manual</Badge>
                      </div>
                      <p className="text-[10px] text-gray-600 leading-relaxed ml-8">
                        Employee will repay via cash or bank transfer independently. Requires manual tracking and receipt generation.
                      </p>
                    </div>
                  </div>

                  {/* Installment Configuration (for Salary mode) */}
                  {recoveryMode === 'salary' &&
                  <div className="mt-6 p-4 bg-white rounded-xl border-2 border-purple-200 animate-in slide-in-from-top-3">
                      <Select
                      label="Recovery Installments"
                      options={[
                      { label: '📅 Full Deduction (1 Month)', value: '1' },
                      { label: '📅 Split in 2 Months', value: '2' },
                      { label: '📅 Split in 3 Months', value: '3' },
                      { label: '📅 Split in 4 Months', value: '4' },
                      { label: '📅 Split in 6 Months', value: '6' }]
                      }
                      value={installments}
                      onChange={(e) => setInstallments(e.target.value)} />


                      {advanceAmount && installments &&
                    <div className="mt-4 p-4 bg-purple-50 rounded-xl">
                          <p className="text-[9px] text-purple-600 font-bold uppercase mb-2">Recovery Schedule Preview</p>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-[9px] text-purple-500">Per Month Deduction</p>
                              <p className="text-lg font-black text-purple-900">₹{installmentAmount}</p>
                            </div>
                            <div>
                              <p className="text-[9px] text-purple-500">Recovery Period</p>
                              <p className="text-lg font-black text-purple-900">{installments} {parseInt(installments) === 1 ? 'Month' : 'Months'}</p>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-purple-200">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-purple-600">First Deduction Date:</span>
                              <span className="font-bold text-purple-900">Next Salary Cycle</span>
                            </div>
                          </div>
                        </div>
                    }
                    </div>
                  }

                  {/* Manual Recovery Details */}
                  {recoveryMode === 'manual' &&
                  <div className="mt-6 p-4 bg-amber-50 rounded-xl border-2 border-amber-200 animate-in slide-in-from-top-3">
                      <div className="flex items-start gap-2 mb-3">
                        <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-amber-900">Manual Tracking Required</p>
                          <p className="text-[10px] text-amber-700 leading-relaxed mt-1">
                            You will need to manually record each payment received and update the advance balance. 
                            Set a recovery deadline and follow up with the employee.
                          </p>
                        </div>
                      </div>
                      <Input
                      label="Expected Recovery Date"
                      type="date"
                      className="mt-3" />

                    </div>
                  }
                </div>

                {/* Approval Section (if amount exceeds limit) */}
                {advanceAmount && parseFloat(advanceAmount) > maxEligibleAmount &&
                <div className="p-5 bg-red-50 border-2 border-red-200 rounded-2xl animate-in slide-in-from-top-3">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-black text-red-900 mb-2">Special Approval Required</p>
                        <p className="text-[10px] text-red-700 leading-relaxed mb-3">
                          This advance exceeds the standard eligibility limit. Approval from Principal/Finance Head is mandatory.
                        </p>
                        <Select
                        label="Approver"
                        options={[
                        { label: 'Dr. Sunita Sharma - Principal', value: 'principal' },
                        { label: 'Mr. Rajesh Gupta - Finance Head', value: 'finance_head' },
                        { label: 'Ms. Priya Mehta - HR Manager', value: 'hr_manager' }]
                        }
                        placeholder="Select Approving Authority" />

                      </div>
                    </div>
                  </div>
                }

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    variant="primary"
                    className="w-full py-8 text-base font-black bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-2xl shadow-indigo-200 hover:shadow-indigo-300 transition-all duration-300 hover:scale-[1.02]"
                    disabled={!selectedStaff || !advanceAmount || !advanceCategory}>

                    <Save className="w-5 h-5 mr-2" /> 
                    Issue Advance & Generate Voucher
                  </Button>
                  <p className="text-center text-[9px] text-gray-400 mt-2 italic">
                    A payment voucher will be generated for accounting records
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Enhanced Ledger Impact Note */}
          <Card className="p-6 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-2 border-amber-200">
            <div className="flex items-start gap-4">
              <div className="bg-amber-600 p-3 rounded-xl">
                <Info className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-sm font-black text-amber-900 mb-1">Accounting Impact Preview</p>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    This transaction will affect the following ledgers in your accounting system:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-xl border border-amber-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      <p className="text-[10px] font-black text-gray-500 uppercase">Debit Entry</p>
                    </div>
                    <p className="text-xs font-bold text-gray-900">Staff Advance Ledger</p>
                    <p className="text-[10px] text-gray-600 mt-1">
                      Increases the outstanding advance balance for employee
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-amber-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <p className="text-[10px] font-black text-gray-500 uppercase">Credit Entry</p>
                    </div>
                    <p className="text-xs font-bold text-gray-900">
                      {paymentMode === 'cash' ? 'Cash in Hand' : 'Bank Account'}
                    </p>
                    <p className="text-[10px] text-gray-600 mt-1">
                      Reduces available {paymentMode === 'cash' ? 'cash' : 'bank'} balance
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <p className="text-[10px] font-black text-indigo-900 uppercase">Payroll Integration</p>
                  </div>
                  <p className="text-xs text-indigo-700 leading-relaxed">
                    {recoveryMode === 'salary' ?
                    <>
                        The Payroll module will automatically flag this advance for deduction. 
                        Starting from the next salary cycle, <strong>₹{installmentAmount}</strong> will be deducted 
                        for <strong>{installments} {parseInt(installments) === 1 ? 'month' : 'months'}</strong> until full recovery.
                      </> :

                    <>
                        This advance will be tracked manually. You must record each repayment transaction 
                        separately and update the advance balance ledger accordingly.
                      </>
                    }
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Transaction History Preview (if staff selected) */}
          {selectedStaff &&
          <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  Recent Advance History
                </h3>
                <Button variant="outline" size="sm">View All</Button>
              </div>

              <div className="space-y-3">
                {[
              { date: '2023-11-15', type: 'Salary Advance', amount: 15000, status: 'Repaid', recovery: '3/3 Months' },
              { date: '2023-08-22', type: 'Festival Advance', amount: 10000, status: 'Active', recovery: '1/2 Months' },
              { date: '2023-05-10', type: 'Tour Advance', amount: 8000, status: 'Repaid', recovery: 'Full' }].
              map((item, index) =>
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${item.status === 'Repaid' ? 'bg-green-100' : 'bg-amber-100'}`}>
                        <Wallet className={`w-4 h-4 ${item.status === 'Repaid' ? 'text-green-600' : 'text-amber-600'}`} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">{item.type}</p>
                        <p className="text-[10px] text-gray-500">{item.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-gray-900">₹{item.amount.toLocaleString()}</p>
                      <Badge
                    variant={item.status === 'Repaid' ? 'success' : 'warning'}
                    className="text-[8px] mt-1">

                        {item.recovery}
                      </Badge>
                    </div>
                  </div>
              )}
              </div>
            </Card>
          }
        </div>
      </div>
    </div>);

}