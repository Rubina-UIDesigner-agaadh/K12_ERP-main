import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import {
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  MapPin,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Send,
  Plane,
  Car,
  Train,
  Bus,
  Users,
  FileText,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  Printer,
  Upload,
  ArrowRight,
  Building,
  User,
  Target,
  Info,
  DollarSign,
  Receipt,
  Shield,
  Navigation,
  Globe,
  Home,
  TrendingUp,
  CheckSquare,
  Square,
  Copy,
  Mail,
  Phone,
  MessageSquare,
  Paperclip,
  Hotel,
  Coffee,
  Wifi,
  CreditCard } from
'lucide-react';

export function TravelListingOnDuty() {
  const [sortColumn, setSortColumn] = useState('startDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedRows, setSelectedRows] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  const travelRequests = [
  {
    id: 'ODR001',
    employeeId: 'EMP001',
    employeeName: 'John Doe',
    department: 'Engineering',
    designation: 'Senior Developer',
    startDate: '2024-02-05',
    endDate: '2024-02-07',
    duration: 3,
    destination: 'Bangalore, Karnataka',
    fromLocation: 'Mumbai, Maharashtra',
    purpose: 'Client Meeting - Project Kickoff',
    client: 'Tech Solutions Inc.',
    travelMode: 'flight',
    status: 'approved',
    approvedBy: 'Michael Johnson',
    approvalDate: '2024-01-28',
    estimatedCost: 25000,
    advanceRequired: 15000,
    accommodation: 'Hotel Taj',
    remarks: 'Pre-approved for Q1 client visits',
    attachments: 2,
    createdOn: '2024-01-25'
  },
  {
    id: 'ODR002',
    employeeId: 'EMP003',
    employeeName: 'Robert Johnson',
    department: 'Sales',
    designation: 'Sales Manager',
    startDate: '2024-02-10',
    endDate: '2024-02-12',
    duration: 3,
    destination: 'Delhi NCR',
    fromLocation: 'Mumbai, Maharashtra',
    purpose: 'Annual Sales Conference',
    client: 'Internal',
    travelMode: 'flight',
    status: 'pending',
    approvedBy: null,
    approvalDate: null,
    estimatedCost: 18000,
    advanceRequired: 10000,
    accommodation: 'Company Guest House',
    remarks: 'Mandatory attendance for all sales managers',
    attachments: 1,
    createdOn: '2024-01-30'
  },
  {
    id: 'ODR003',
    employeeId: 'EMP004',
    employeeName: 'Emily Davis',
    department: 'Marketing',
    designation: 'Marketing Lead',
    startDate: '2024-02-03',
    endDate: '2024-02-04',
    duration: 2,
    destination: 'Pune, Maharashtra',
    fromLocation: 'Mumbai, Maharashtra',
    purpose: 'Product Launch Event',
    client: 'Multiple Clients',
    travelMode: 'car',
    status: 'approved',
    approvedBy: 'Sarah Wilson',
    approvalDate: '2024-01-20',
    estimatedCost: 8000,
    advanceRequired: 5000,
    accommodation: 'Day Trip - No Stay',
    remarks: '',
    attachments: 3,
    createdOn: '2024-01-18'
  },
  {
    id: 'ODR004',
    employeeId: 'EMP005',
    employeeName: 'Michael Brown',
    department: 'Engineering',
    designation: 'Developer',
    startDate: '2024-02-15',
    endDate: '2024-02-17',
    duration: 3,
    destination: 'Chennai, Tamil Nadu',
    fromLocation: 'Bangalore, Karnataka',
    purpose: 'Technical Training - AWS Certification',
    client: 'Internal',
    travelMode: 'train',
    status: 'pending',
    approvedBy: null,
    approvalDate: null,
    estimatedCost: 12000,
    advanceRequired: 8000,
    accommodation: 'Training Center Hostel',
    remarks: 'Part of annual skill development program',
    attachments: 2,
    createdOn: '2024-01-31'
  },
  {
    id: 'ODR005',
    employeeId: 'EMP002',
    employeeName: 'Jane Smith',
    department: 'HR',
    designation: 'HR Manager',
    startDate: '2024-01-28',
    endDate: '2024-01-29',
    duration: 2,
    destination: 'Hyderabad, Telangana',
    fromLocation: 'Mumbai, Maharashtra',
    purpose: 'Campus Recruitment Drive',
    client: 'Internal',
    travelMode: 'flight',
    status: 'completed',
    approvedBy: 'Admin User',
    approvalDate: '2024-01-20',
    estimatedCost: 15000,
    advanceRequired: 10000,
    accommodation: 'Hotel Novotel',
    remarks: 'Successfully recruited 5 candidates',
    attachments: 4,
    createdOn: '2024-01-15'
  },
  {
    id: 'ODR006',
    employeeId: 'EMP007',
    employeeName: 'David Lee',
    department: 'IT Support',
    designation: 'IT Administrator',
    startDate: '2024-02-20',
    endDate: '2024-02-21',
    duration: 2,
    destination: 'Nagpur, Maharashtra',
    fromLocation: 'Mumbai, Maharashtra',
    purpose: 'Branch Office IT Setup',
    client: 'Internal',
    travelMode: 'flight',
    status: 'rejected',
    approvedBy: 'Finance Head',
    approvalDate: '2024-01-30',
    estimatedCost: 20000,
    advanceRequired: 15000,
    accommodation: 'Local Hotel',
    remarks: 'Budget constraints - postponed to next quarter',
    attachments: 1,
    createdOn: '2024-01-28'
  },
  {
    id: 'ODR007',
    employeeId: 'EMP009',
    employeeName: 'James Taylor',
    department: 'Engineering',
    designation: 'Tech Lead',
    startDate: '2024-02-08',
    endDate: '2024-02-10',
    duration: 3,
    destination: 'Kolkata, West Bengal',
    fromLocation: 'Delhi NCR',
    purpose: 'Client Technical Review & Support',
    client: 'Bengal Industries',
    travelMode: 'flight',
    status: 'approved',
    approvedBy: 'CTO',
    approvalDate: '2024-01-29',
    estimatedCost: 22000,
    advanceRequired: 15000,
    accommodation: 'Client Guest House',
    remarks: 'Critical project milestone review',
    attachments: 2,
    createdOn: '2024-01-27'
  },
  {
    id: 'ODR008',
    employeeId: 'EMP010',
    employeeName: 'Jennifer Martinez',
    department: 'Finance',
    designation: 'Finance Manager',
    startDate: '2024-02-12',
    endDate: '2024-02-14',
    duration: 3,
    destination: 'Ahmedabad, Gujarat',
    fromLocation: 'Mumbai, Maharashtra',
    purpose: 'Audit - Regional Office',
    client: 'Internal',
    travelMode: 'train',
    status: 'pending',
    approvedBy: null,
    approvalDate: null,
    estimatedCost: 10000,
    advanceRequired: 7000,
    accommodation: 'Company Flat',
    remarks: 'Quarterly audit as per compliance',
    attachments: 1,
    createdOn: '2024-02-01'
  }];


  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ column }) => {
    if (sortColumn !== column) return <ChevronUp className="w-3 h-3 text-gray-300" />;
    return sortDirection === 'asc' ?
    <ChevronUp className="w-3 h-3 text-blue-600" /> :
    <ChevronDown className="w-3 h-3 text-blue-600" />;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" />
            Approved
          </span>);

      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
            <Clock className="w-3 h-3" />
            Pending
          </span>);

      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>);

      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
            <CheckSquare className="w-3 h-3" />
            Completed
          </span>);

      default:
        return null;
    }
  };

  const getTravelModeIcon = (mode) => {
    switch (mode) {
      case 'flight':
        return <Plane className="w-4 h-4 text-blue-500" />;
      case 'car':
        return <Car className="w-4 h-4 text-gray-500" />;
      case 'train':
        return <Train className="w-4 h-4 text-green-500" />;
      case 'bus':
        return <Bus className="w-4 h-4 text-orange-500" />;
      default:
        return <Navigation className="w-4 h-4 text-gray-500" />;
    }
  };

  const toggleRowSelection = (id) => {
    setSelectedRows((prev) =>
    prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === travelRequests.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(travelRequests.map((r) => r.id));
    }
  };

  const statusCounts = {
    all: travelRequests.length,
    pending: travelRequests.filter((r) => r.status === 'pending').length,
    approved: travelRequests.filter((r) => r.status === 'approved').length,
    rejected: travelRequests.filter((r) => r.status === 'rejected').length,
    completed: travelRequests.filter((r) => r.status === 'completed').length
  };

  const filteredRequests = activeTab === 'all' ?
  travelRequests :
  travelRequests.filter((r) => r.status === activeTab);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Travel Listing (On-Duty)
          </h1>
          <p className="text-sm text-gray-500">
            Manage and track employee on-duty travel requests and approvals
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="primary" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create New OD Request
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-blue-600 font-medium">Total</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">{travelRequests.length}</p>
          <p className="text-xs text-blue-600">OD Requests</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl border border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            <span className="text-xs text-yellow-600 font-medium">Action Needed</span>
          </div>
          <p className="text-2xl font-bold text-yellow-700">{statusCounts.pending}</p>
          <p className="text-xs text-yellow-600">Pending</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-700">{statusCounts.approved}</p>
          <p className="text-xs text-green-600">Approved</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="text-xs text-red-600 font-medium">Review</span>
          </div>
          <p className="text-2xl font-bold text-red-700">{statusCounts.rejected}</p>
          <p className="text-xs text-red-600">Rejected</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 rounded-xl border border-indigo-200">
          <div className="flex items-center justify-between mb-2">
            <CheckSquare className="w-5 h-5 text-indigo-600" />
            <span className="text-xs text-indigo-600 font-medium">Done</span>
          </div>
          <p className="text-2xl font-bold text-indigo-700">{statusCounts.completed}</p>
          <p className="text-xs text-indigo-600">Completed</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-purple-600" />
            <span className="text-xs text-purple-600 font-medium">Budget</span>
          </div>
          <p className="text-2xl font-bold text-purple-700">₹1.5L</p>
          <p className="text-xs text-purple-600">Total Estimated</p>
        </div>
      </div>

      <Card>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                {['all', 'pending', 'approved', 'rejected', 'completed'].map((tab) =>
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg capitalize text-sm font-medium transition-all ${
                  activeTab === tab ?
                  'bg-white text-blue-600 shadow-sm' :
                  'text-gray-600 hover:text-gray-900'}`
                  }>

                    {tab} ({statusCounts[tab]})
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by employee, destination..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />

              </div>
              <Select
                options={[
                { value: 'all', label: 'All Departments' },
                { value: 'engineering', label: 'Engineering' },
                { value: 'sales', label: 'Sales' },
                { value: 'marketing', label: 'Marketing' },
                { value: 'hr', label: 'Human Resources' },
                { value: 'finance', label: 'Finance' },
                { value: 'it', label: 'IT Support' }]
                }
                defaultValue="all" />

              <Input
                type="date"
                placeholder="From Date" />

              <Input
                type="date"
                placeholder="To Date" />

              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>

          {selectedRows.length > 0 &&
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
              <span className="text-sm text-blue-700">
                <span className="font-semibold">{selectedRows.length}</span> request(s) selected
              </span>
              <div className="flex gap-2">
                <Button variant="outline" className="text-sm py-1 px-3">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Bulk Approve
                </Button>
                <Button variant="outline" className="text-sm py-1 px-3">
                  <XCircle className="w-3 h-3 mr-1" />
                  Bulk Reject
                </Button>
                <Button variant="outline" className="text-sm py-1 px-3">
                  <Download className="w-3 h-3 mr-1" />
                  Export Selected
                </Button>
                <Button variant="outline" className="text-sm py-1 px-3" onClick={() => setSelectedRows([])}>
                  Clear Selection
                </Button>
              </div>
            </div>
          }

          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-3 text-left sticky left-0 bg-gray-50 z-20 border-r">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        checked={selectedRows.length === filteredRequests.length}
                        onChange={toggleSelectAll} />

                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-10 bg-gray-50 z-20 border-r min-w-[80px]">
                      OD ID
                    </th>
                    <th
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 sticky left-28 bg-gray-50 z-20 border-r min-w-[200px]"
                      onClick={() => handleSort('employeeName')}>

                      <div className="flex items-center gap-1">
                        Employee
                        <SortIcon column="employeeName" />
                      </div>
                    </th>
                    <th
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 min-w-[120px]"
                      onClick={() => handleSort('startDate')}>

                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Start Date
                        <SortIcon column="startDate" />
                      </div>
                    </th>
                    <th
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 min-w-[120px]"
                      onClick={() => handleSort('endDate')}>

                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        End Date
                        <SortIcon column="endDate" />
                      </div>
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px]">
                      Days
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[180px]">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        Destination
                      </div>
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[250px]">
                      <div className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        Purpose
                      </div>
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                      Client
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                      Mode
                    </th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                      Est. Cost
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                      Status
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                      Approved By
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px] border-l">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRequests.map((request, index) =>
                  <tr
                    key={request.id}
                    className={`hover:bg-blue-50/50 ${
                    selectedRows.includes(request.id) ? 'bg-blue-50' :
                    request.status === 'rejected' ? 'bg-red-50/30' :
                    request.status === 'pending' ? 'bg-yellow-50/30' :
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`
                    }>

                      <td className="px-3 py-3 sticky left-0 bg-inherit border-r">
                        <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        checked={selectedRows.includes(request.id)}
                        onChange={() => toggleRowSelection(request.id)} />

                      </td>
                      <td className="px-3 py-3 text-sm font-medium text-blue-600 sticky left-10 bg-inherit border-r">
                        {request.id}
                      </td>
                      <td className="px-3 py-3 sticky left-28 bg-inherit border-r">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-medium text-white">
                              {request.employeeName.split(' ').map((n) => n[0]).join('')}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900">{request.employeeName}</p>
                            <p className="text-xs text-gray-500">{request.employeeId} • {request.department}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="text-sm text-gray-900">{request.startDate}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(request.startDate).toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="text-sm text-gray-900">{request.endDate}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(request.endDate).toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-bold text-blue-700 bg-blue-100 rounded-full">
                          {request.duration}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{request.destination}</p>
                            <p className="text-xs text-gray-500">from {request.fromLocation}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-start gap-2">
                          <Briefcase className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">{request.purpose}</p>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1">
                          {request.client === 'Internal' ?
                        <Building className="w-4 h-4 text-gray-400" /> :

                        <Users className="w-4 h-4 text-blue-500" />
                        }
                          <span className={`text-sm ${request.client === 'Internal' ? 'text-gray-600' : 'text-blue-600 font-medium'}`}>
                            {request.client}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <div className="flex items-center justify-center" title={request.travelMode}>
                          {getTravelModeIcon(request.travelMode)}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <span className="text-sm font-semibold text-gray-900">₹{request.estimatedCost.toLocaleString()}</span>
                        {request.advanceRequired > 0 &&
                      <div className="text-xs text-orange-600">Adv: ₹{request.advanceRequired.toLocaleString()}</div>
                      }
                      </td>
                      <td className="px-3 py-3 text-center">
                        {getStatusBadge(request.status)}
                      </td>
                      <td className="px-3 py-3">
                        {request.approvedBy ?
                      <div>
                            <p className="text-sm text-gray-900">{request.approvedBy}</p>
                            <p className="text-xs text-gray-500">{request.approvalDate}</p>
                          </div> :

                      <span className="text-sm text-gray-400">—</span>
                      }
                      </td>
                      <td className="px-3 py-3 text-center border-l">
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors" title="View Details">
                            <Eye className="w-4 h-4 text-gray-500" />
                          </button>
                          {request.status === 'pending' &&
                        <>
                              <button className="p-1.5 hover:bg-green-100 rounded-lg transition-colors" title="Approve">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              </button>
                              <button className="p-1.5 hover:bg-red-100 rounded-lg transition-colors" title="Reject">
                                <XCircle className="w-4 h-4 text-red-500" />
                              </button>
                            </>
                        }
                          <button className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors" title="Edit">
                            <Edit className="w-4 h-4 text-gray-500" />
                          </button>
                          {request.attachments > 0 &&
                        <button className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors" title={`${request.attachments} Attachments`}>
                              <Paperclip className="w-4 h-4 text-gray-500" />
                              <span className="text-xs text-gray-600">{request.attachments}</span>
                            </button>
                        }
                          <button className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors" title="More Options">
                            <MoreHorizontal className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-600">
                Showing <span className="font-medium">1-{filteredRequests.length}</span> of <span className="font-medium">{filteredRequests.length}</span> requests
              </p>
              <Select
                options={[
                { value: '10', label: '10 per page' },
                { value: '25', label: '25 per page' },
                { value: '50', label: '50 per page' },
                { value: '100', label: '100 per page' }]
                }
                defaultValue="25" />

            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" disabled>
                Previous
              </Button>
              <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded">1</span>
              <span className="px-3 py-1 text-gray-600 text-sm hover:bg-gray-100 rounded cursor-pointer">2</span>
              <span className="px-3 py-1 text-gray-600 text-sm hover:bg-gray-100 rounded cursor-pointer">3</span>
              <Button variant="outline">
                Next
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card title="Quick Stats">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Approval Rate</span>
              <span className="text-sm font-semibold text-green-600">
                {Math.round(statusCounts.approved / statusCounts.all * 100)}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${statusCounts.approved / statusCounts.all * 100}%` }} />

            </div>
            
            <div className="border-t pt-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Plane className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">By Flight</span>
                </div>
                <span className="text-sm font-semibold">4</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Train className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">By Train</span>
                </div>
                <span className="text-sm font-semibold">2</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">By Car</span>
                </div>
                <span className="text-sm font-semibold">1</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bus className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-gray-600">By Bus</span>
                </div>
                <span className="text-sm font-semibold">0</span>
              </div>
            </div>

            <div className="border-t pt-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Avg. Trip Duration</span>
                <span className="font-semibold">2.6 days</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Avg. Trip Cost</span>
                <span className="font-semibold">₹16,250</span>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Top Destinations">
          <div className="space-y-3">
            {[
            { city: 'Bangalore', count: 3, percentage: 37.5 },
            { city: 'Delhi NCR', count: 2, percentage: 25 },
            { city: 'Pune', count: 1, percentage: 12.5 },
            { city: 'Chennai', count: 1, percentage: 12.5 },
            { city: 'Hyderabad', count: 1, percentage: 12.5 }].
            map((dest, index) =>
            <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{dest.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${dest.percentage}%` }} />

                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">{dest.count}</span>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card title="Department-wise Requests">
          <div className="space-y-3">
            {[
            { dept: 'Engineering', count: 3, color: 'blue' },
            { dept: 'Sales', count: 1, color: 'green' },
            { dept: 'Marketing', count: 1, color: 'purple' },
            { dept: 'HR', count: 1, color: 'orange' },
            { dept: 'IT Support', count: 1, color: 'gray' },
            { dept: 'Finance', count: 1, color: 'red' }].
            map((dept, index) =>
            <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-${dept.color}-500`}></div>
                  <span className="text-sm text-gray-700">{dept.dept}</span>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-${dept.color}-100 text-${dept.color}-700`}>
                  {dept.count}
                </span>
              </div>
            )}
          </div>
        </Card>

        <Card title="Quick Actions">
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Plus className="w-4 h-4 mr-2" />
              New OD Request
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Upload className="w-4 h-4 mr-2" />
              Bulk Import
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Receipt className="w-4 h-4 mr-2" />
              Expense Claims
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Shield className="w-4 h-4 mr-2" />
              Travel Policy
            </Button>
            <div className="border-t pt-3">
              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-blue-800">Reminder</p>
                  <p className="text-xs text-blue-700 mt-0.5">
                    {statusCounts.pending} requests pending approval
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Upcoming Travel Schedule">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">Next 7 Days</h3>
            <Button variant="outline" className="text-xs">
              <Calendar className="w-3 h-3 mr-1" />
              View Calendar
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {travelRequests.
            filter((r) => r.status === 'approved' && new Date(r.startDate) > new Date()).
            slice(0, 3).
            map((trip) =>
            <div key={trip.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                          {trip.employeeName.split(' ').map((n) => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{trip.employeeName}</p>
                        <p className="text-xs text-gray-500">{trip.department}</p>
                      </div>
                    </div>
                    {getTravelModeIcon(trip.travelMode)}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-700">{trip.destination}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-700">{trip.startDate} - {trip.endDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Briefcase className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-700 truncate">{trip.purpose}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <span className="text-xs text-gray-500">{trip.duration} days</span>
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-700">
                        <Phone className="w-4 h-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-700">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-700">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
            )}
          </div>
        </div>
      </Card>
    </div>);

}