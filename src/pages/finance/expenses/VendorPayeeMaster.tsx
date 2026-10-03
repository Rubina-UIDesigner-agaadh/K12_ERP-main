import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Users,
  Plus,
  Search,
  Building2,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  FileText,
  Banknote,
  X,
  Edit2,
  Trash2,
  Info,
  ChevronRight,
  Globe } from
'lucide-react';
export function VendorPayeeMaster() {
  const [showModal, setShowModal] = useState(false);
  // Mock Data for Vendor Registry
  const vendorData = [
  {
    id: 'VEND-001',
    name: 'Global Electricity Corp',
    contactPerson: 'Sanjay Gupta',
    mobile: '9876543210',
    email: 'billing@globalelec.com',
    gst: '07AAAAA0000A1Z5',
    bankName: 'HDFC Bank',
    accNo: 'XXXXXX9901',
    balance: 15000,
    status: 'Active'
  },
  {
    id: 'VEND-002',
    name: 'Modern Stationery Hub',
    contactPerson: 'Anita Sharma',
    mobile: '9876543211',
    email: 'sales@modernstationery.in',
    gst: '07BBBBB1111B1Z2',
    bankName: 'ICICI Bank',
    accNo: 'XXXXXX4452',
    balance: 0,
    status: 'Active'
  },
  {
    id: 'VEND-003',
    name: 'Apex Maintenance Services',
    contactPerson: 'Vikram Singh',
    mobile: '9876543212',
    email: 'service@apex.com',
    gst: '07CCCCC2222C1Z9',
    bankName: 'SBI',
    accNo: 'XXXXXX1120',
    balance: 500,
    status: 'On Hold'
  }];

  const columns = [
  {
    key: 'vendor',
    header: 'Vendor Details',
    render: (row: any) =>
    <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100 font-bold">
            {row.name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-gray-900 leading-tight">
              {row.name}
            </div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              {row.id}
            </div>
          </div>
        </div>

  },
  {
    key: 'contact',
    header: 'Contact Person',
    render: (row: any) =>
    <div className="space-y-1">
          <div className="text-xs font-semibold text-gray-700 flex items-center gap-1">
            <Users className="w-3 h-3 text-gray-400" /> {row.contactPerson}
          </div>
          <div className="text-[10px] text-gray-500 flex items-center gap-1">
            <Phone className="w-3 h-3" /> {row.mobile}
          </div>
        </div>

  },
  {
    key: 'tax',
    header: 'Tax Details (GST)',
    render: (row: any) =>
    <div className="flex items-center gap-2">
          <FileText className="w-3 h-3 text-gray-400" />
          <span className="text-xs font-mono text-gray-600 uppercase">
            {row.gst}
          </span>
        </div>

  },
  {
    key: 'bank',
    header: 'Bank Details',
    render: (row: any) =>
    <div className="space-y-1">
          <div className="text-xs font-bold text-gray-700">{row.bankName}</div>
          <div className="text-[10px] text-gray-400 font-mono italic">
            {row.accNo}
          </div>
        </div>

  },
  {
    key: 'balance',
    header: 'Opening Balance',
    render: (row: any) =>
    <span
      className={`text-sm font-black ${row.balance > 0 ? 'text-red-600' : 'text-gray-400'}`}>

          ₹{row.balance.toLocaleString()}
        </span>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: any) =>
    <Badge variant={row.status === 'Active' ? 'success' : 'warning'}>
          {row.status}
        </Badge>

  },
  {
    key: 'actions',
    header: '',
    render: (row: any) =>
    <div className="flex gap-1">
          <Button variant="ghost" size="sm">
            <Edit2 className="w-4 h-4 text-gray-400" />
          </Button>
          <Button variant="ghost" size="sm">
            <Trash2 className="w-4 h-4 text-red-300" />
          </Button>
        </div>

  }];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            Vendor Master Registry{' '}
            <Building2 className="w-6 h-6 text-indigo-600" />
          </h1>
          <p className="text-sm text-gray-500">
            Manage suppliers, payees, and contractors CRM
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowModal(true)}
          className="shadow-lg shadow-indigo-100 py-6 px-8">

          <Plus className="w-5 h-5 mr-2" /> Add New Vendor
        </Button>
      </div>

      {/* Filter Section */}
      <Card className="p-4 bg-gray-50/50">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
              placeholder="Search by Vendor Name, GST No, or Mobile..." />

          </div>
          <Button variant="outline" className="bg-white">
            <Search className="w-4 h-4 mr-2" /> Advanced Search
          </Button>
        </div>
      </Card>

      {/* Main Grid */}
      <Card className="overflow-hidden border-none shadow-xl ring-1 ring-gray-200">
        <Table columns={columns} data={vendorData} />
        <div className="p-4 bg-gray-50 border-t flex justify-between items-center text-[11px] text-gray-400 font-bold uppercase tracking-widest">
          <span>Total Registered Vendors: {vendorData.length}</span>
          <div className="flex items-center gap-1">
            <Badge variant="info" className="text-[9px]">
              Verified Suppliers
            </Badge>
          </div>
        </div>
      </Card>

      {/* Add Vendor Modal */}
      {showModal &&
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-6 border-b bg-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-gray-900">
                  New Payee Registration
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Onboard a new supplier or service provider
                </p>
              </div>
              <button
              onClick={() => setShowModal(false)}
              className="text-gray-400 hover:text-gray-900">

                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 space-y-8 max-h-[75vh] overflow-y-auto">
              {/* General Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-black text-indigo-600 uppercase tracking-widest">
                  <Building2 className="w-4 h-4" /> General Information
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                  label="Vendor Name"
                  placeholder="e.g. Global Electricity Corp" />

                  <Input label="Contact Person" placeholder="Full Name" />
                  <Input label="Mobile Number" placeholder="+91" />
                  <Input
                  label="Email Address"
                  type="email"
                  placeholder="example@vendor.com" />

                  <div className="col-span-2">
                    <Input
                    label="Office Address"
                    placeholder="Street, Building, Area" />

                  </div>
                </div>
              </div>

              {/* Financial & Bank Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-black text-green-600 uppercase tracking-widest">
                  <CreditCard className="w-4 h-4" /> Bank & Payment Details
                </div>
                <div className="grid grid-cols-2 gap-4 p-4 bg-green-50/50 rounded-2xl border border-green-100">
                  <Input label="Account Number" placeholder="12-16 Digit No" />
                  <Input label="IFSC Code" placeholder="SBIN000XXXX" />
                  <Input label="Bank Name" placeholder="e.g. HDFC Bank" />
                  <Input
                  label="Opening Balance (₹)"
                  type="number"
                  placeholder="0.00" />

                </div>
              </div>

              {/* Tax Compliance */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-black text-orange-600 uppercase tracking-widest">
                  <FileText className="w-4 h-4" /> Tax Compliance
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="GST Number" placeholder="22AAAAA0000A1Z5" />
                  <Input label="PAN Number" placeholder="ABCDE1234F" />
                </div>
              </div>

              {/* Note */}
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                <p className="text-[11px] text-blue-700 italic leading-relaxed">
                  Verification check: Ensure the Bank Account Name matches the
                  Vendor Name to avoid NEFT/RTGS reversals during payout
                  processing.
                </p>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" className="px-10">
                <Save className="w-4 h-4 mr-2" /> Save Payee
              </Button>
            </div>
          </Card>
        </div>
      }
    </div>);

}
// Reuse internal components if needed
function Save(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">

      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>);

}