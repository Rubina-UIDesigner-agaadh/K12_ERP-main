import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import {
  Download,
  FileText,
  Search,
  CheckCircle,
  Clock,
  AlertTriangle,
  Building,
  Users,
  Eye,
  CreditCard,
  TrendingUp,
  MessageSquare,
  Plus,
  Star,
  Trash2,
  Edit3,
  Shield,
  X,
  MapPin } from
'lucide-react';

const STATUS_STYLES = {
  Paid: 'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Overdue: 'bg-red-100 text-red-700'
};

const STATUS_ICONS = {
  Paid: CheckCircle,
  Pending: Clock,
  Overdue: AlertTriangle
};

const PLAN_STYLES = {
  Starter: 'bg-gray-100 text-gray-700',
  Growth: 'bg-blue-100 text-blue-700',
  Scale: 'bg-purple-100 text-purple-700',
  Enterprise: 'bg-orange-100 text-orange-700'
};

const PRICING_SLABS = {
  Starter: { min: 1, max: 500, pricePerStudent: 25, description: '1 - 500 students' },
  Growth: { min: 501, max: 1500, pricePerStudent: 19, description: '501 - 1,500 students' },
  Scale: { min: 1501, max: 3000, pricePerStudent: 14, description: '1,501 - 3,000 students' },
  Enterprise: { min: 3001, max: Infinity, pricePerStudent: 10, description: '3,001+ students' }
};

const CARD_BRAND_LABELS: Record<string, string> = {
  Visa: 'VISA',
  Mastercard: 'MC',
  'American Express': 'AMEX',
  Rupay: 'RUPAY'
};

const CARD_BRAND_COLORS: Record<string, string> = {
  Visa: 'bg-blue-600',
  Mastercard: 'bg-red-600',
  'American Express': 'bg-gray-700',
  Rupay: 'bg-orange-600'
};

type CardType = 'credit' | 'debit';
type CardBrand = 'Visa' | 'Mastercard' | 'American Express' | 'Rupay';

interface PaymentCard {
  id: string;
  cardholderName: string;
  lastFour: string;
  brand: CardBrand;
  type: CardType;
  expiryMonth: string;
  expiryYear: string;
  isPrimary: boolean;
  billingAddress: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
}

interface Invoice {
  id: string;
  billingPeriod: string;
  studentCount: number;
  plan: 'Starter' | 'Growth' | 'Scale' | 'Enterprise';
  pricePerStudent: number;
  subscriptionAmount: number;
  moduleCategories: {name: string;price: number;}[];
  communicationCharges: {
    sms: {count: number;rate: number;total: number;};
    whatsapp: {count: number;rate: number;total: number;};
    email: {count: number;rate: number;total: number;};
    totalComm: number;
  };
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalPayable: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  dueDate: string;
  paymentDate: string | null;
  sacCode: string;
}

const initialInvoices: Invoice[] = [
{
  id: 'INV-2026-007',
  billingPeriod: 'June 2026',
  studentCount: 1248,
  plan: 'Growth',
  pricePerStudent: 19,
  subscriptionAmount: 23712,
  moduleCategories: [
  { name: 'Attendance Management', price: 2500 },
  { name: 'Fee Management', price: 3000 },
  { name: 'Transport Module', price: 1500 },
  { name: 'Library Management', price: 1000 }],

  communicationCharges: {
    sms: { count: 4520, rate: 0.25, total: 1130 },
    whatsapp: { count: 2840, rate: 0.35, total: 994 },
    email: { count: 8150, rate: 0.1, total: 815 },
    totalComm: 2939
  },
  subtotal: 34651,
  cgst: 3118,
  sgst: 3118,
  igst: 0,
  totalPayable: 40887,
  status: 'Pending',
  dueDate: '01 July 2026',
  paymentDate: null,
  sacCode: '998314'
},
{
  id: 'INV-2026-006',
  billingPeriod: 'May 2026',
  studentCount: 1235,
  plan: 'Growth',
  pricePerStudent: 19,
  subscriptionAmount: 23465,
  moduleCategories: [
  { name: 'Attendance Management', price: 2500 },
  { name: 'Fee Management', price: 3000 },
  { name: 'Transport Module', price: 1500 },
  { name: 'Library Management', price: 1000 }],

  communicationCharges: {
    sms: { count: 4300, rate: 0.25, total: 1075 },
    whatsapp: { count: 2600, rate: 0.35, total: 910 },
    email: { count: 8000, rate: 0.1, total: 800 },
    totalComm: 2785
  },
  subtotal: 34250,
  cgst: 3082,
  sgst: 3082,
  igst: 0,
  totalPayable: 40414,
  status: 'Paid',
  dueDate: '01 June 2026',
  paymentDate: '28 May 2026',
  sacCode: '998314'
},
{
  id: 'INV-2026-005',
  billingPeriod: 'April 2026',
  studentCount: 1220,
  plan: 'Growth',
  pricePerStudent: 19,
  subscriptionAmount: 23180,
  moduleCategories: [
  { name: 'Attendance Management', price: 2500 },
  { name: 'Fee Management', price: 3000 },
  { name: 'Transport Module', price: 1500 }],

  communicationCharges: {
    sms: { count: 4100, rate: 0.25, total: 1025 },
    whatsapp: { count: 2400, rate: 0.35, total: 840 },
    email: { count: 7800, rate: 0.1, total: 780 },
    totalComm: 2645
  },
  subtotal: 32825,
  cgst: 2954,
  sgst: 2954,
  igst: 0,
  totalPayable: 38733,
  status: 'Paid',
  dueDate: '01 May 2026',
  paymentDate: '30 April 2026',
  sacCode: '998314'
},
{
  id: 'INV-2026-004',
  billingPeriod: 'March 2026',
  studentCount: 1210,
  plan: 'Growth',
  pricePerStudent: 19,
  subscriptionAmount: 22990,
  moduleCategories: [
  { name: 'Attendance Management', price: 2500 },
  { name: 'Fee Management', price: 3000 },
  { name: 'Transport Module', price: 1500 }],

  communicationCharges: {
    sms: { count: 3800, rate: 0.25, total: 950 },
    whatsapp: { count: 2200, rate: 0.35, total: 770 },
    email: { count: 7500, rate: 0.1, total: 750 },
    totalComm: 2470
  },
  subtotal: 32460,
  cgst: 2921,
  sgst: 2921,
  igst: 0,
  totalPayable: 38302,
  status: 'Paid',
  dueDate: '01 April 2026',
  paymentDate: '29 March 2026',
  sacCode: '998314'
},
{
  id: 'INV-2026-003',
  billingPeriod: 'February 2026',
  studentCount: 1195,
  plan: 'Growth',
  pricePerStudent: 19,
  subscriptionAmount: 22705,
  moduleCategories: [
  { name: 'Attendance Management', price: 2500 },
  { name: 'Fee Management', price: 3000 },
  { name: 'Transport Module', price: 1500 }],

  communicationCharges: {
    sms: { count: 3500, rate: 0.25, total: 875 },
    whatsapp: { count: 2000, rate: 0.35, total: 700 },
    email: { count: 7000, rate: 0.1, total: 700 },
    totalComm: 2275
  },
  subtotal: 31980,
  cgst: 2878,
  sgst: 2878,
  igst: 0,
  totalPayable: 37736,
  status: 'Overdue',
  dueDate: '01 March 2026',
  paymentDate: null,
  sacCode: '998314'
},
{
  id: 'INV-2026-002',
  billingPeriod: 'January 2026',
  studentCount: 485,
  plan: 'Starter',
  pricePerStudent: 25,
  subscriptionAmount: 12125,
  moduleCategories: [
  { name: 'Attendance Management', price: 2500 },
  { name: 'Fee Management', price: 3000 }],

  communicationCharges: {
    sms: { count: 3000, rate: 0.25, total: 750 },
    whatsapp: { count: 1800, rate: 0.35, total: 630 },
    email: { count: 6500, rate: 0.1, total: 650 },
    totalComm: 2030
  },
  subtotal: 19655,
  cgst: 1769,
  sgst: 1769,
  igst: 0,
  totalPayable: 23193,
  status: 'Paid',
  dueDate: '01 February 2026',
  paymentDate: '28 January 2026',
  sacCode: '998314'
}];


const initialCards: PaymentCard[] = [
{
  id: 'card-001',
  cardholderName: 'Rajesh Kumar',
  lastFour: '4242',
  brand: 'Visa',
  type: 'credit',
  expiryMonth: '09',
  expiryYear: '2028',
  isPrimary: true,
  billingAddress: {
    line1: '42, MG Road',
    line2: 'Near City Mall',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
    country: 'India'
  }
},
{
  id: 'card-002',
  cardholderName: 'Rajesh Kumar',
  lastFour: '8371',
  brand: 'Mastercard',
  type: 'debit',
  expiryMonth: '03',
  expiryYear: '2027',
  isPrimary: false,
  billingAddress: {
    line1: '42, MG Road',
    line2: 'Near City Mall',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
    country: 'India'
  }
},
{
  id: 'card-003',
  cardholderName: 'Priya Sharma',
  lastFour: '1029',
  brand: 'Rupay',
  type: 'debit',
  expiryMonth: '12',
  expiryYear: '2029',
  isPrimary: false,
  billingAddress: {
    line1: '15, Park Street',
    line2: '',
    city: 'Kolkata',
    state: 'West Bengal',
    pincode: '700016',
    country: 'India'
  }
}];


const billingPeriods = [
{ value: 'all', label: 'All Periods' },
{ value: 'June 2026', label: 'June 2026' },
{ value: 'May 2026', label: 'May 2026' },
{ value: 'April 2026', label: 'April 2026' },
{ value: 'March 2026', label: 'March 2026' },
{ value: 'February 2026', label: 'February 2026' },
{ value: 'January 2026', label: 'January 2026' }];


const indianStates = [
{ value: '', label: 'Select State' },
{ value: 'Andhra Pradesh', label: 'Andhra Pradesh' },
{ value: 'Bihar', label: 'Bihar' },
{ value: 'Delhi', label: 'Delhi' },
{ value: 'Goa', label: 'Goa' },
{ value: 'Gujarat', label: 'Gujarat' },
{ value: 'Haryana', label: 'Haryana' },
{ value: 'Karnataka', label: 'Karnataka' },
{ value: 'Kerala', label: 'Kerala' },
{ value: 'Madhya Pradesh', label: 'Madhya Pradesh' },
{ value: 'Maharashtra', label: 'Maharashtra' },
{ value: 'Punjab', label: 'Punjab' },
{ value: 'Rajasthan', label: 'Rajasthan' },
{ value: 'Tamil Nadu', label: 'Tamil Nadu' },
{ value: 'Telangana', label: 'Telangana' },
{ value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
{ value: 'West Bengal', label: 'West Bengal' }];


type ActiveSection = 'invoices' | 'payment-methods';

function detectCardBrand(number: string): CardBrand {
  const cleaned = number.replace(/\D/g, '');
  if (/^4/.test(cleaned)) return 'Visa';
  if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return 'Mastercard';
  if (/^3[47]/.test(cleaned)) return 'American Express';
  if (/^6[0-9]/.test(cleaned) || /^81/.test(cleaned) || /^82/.test(cleaned)) return 'Rupay';
  return 'Visa';
}

function detectCardType(number: string): CardType {
  const cleaned = number.replace(/\D/g, '');
  if (/^4/.test(cleaned)) return 'credit';
  if (/^5[1-5]/.test(cleaned)) return 'credit';
  if (/^3[47]/.test(cleaned)) return 'credit';
  if (/^6[0-9]/.test(cleaned) || /^81/.test(cleaned) || /^82/.test(cleaned)) return 'debit';
  if (/^2[2-7]/.test(cleaned)) return 'debit';
  return 'debit';
}

function InvoiceReceiptModal({
  invoice,
  onClose,
  onDownload




}: {invoice: Invoice;onClose: () => void;onDownload: (id: string) => void;}) {
  const planSlab = PRICING_SLABS[invoice.plan];
  const StatusIcon = STATUS_ICONS[invoice.status];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl my-8 mx-4 overflow-hidden">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Invoice Receipt</h2>
              <p className="text-sm text-gray-500">
                {invoice.id} &bull; {invoice.billingPeriod}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="primary" size="sm" onClick={() => onDownload(invoice.id)}>
              <Download className="w-4 h-4 mr-1.5" />
              Download
            </Button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Status Banner */}
          <div
            className={`flex items-center gap-3 p-4 rounded-xl border ${
            invoice.status === 'Paid' ?
            'bg-green-50 border-green-200' :
            invoice.status === 'Overdue' ?
            'bg-red-50 border-red-200' :
            'bg-yellow-50 border-yellow-200'}`
            }>
            
            <StatusIcon
              className={`w-5 h-5 ${
              invoice.status === 'Paid' ?
              'text-green-600' :
              invoice.status === 'Overdue' ?
              'text-red-600' :
              'text-yellow-600'}`
              } />
            
            <div className="flex-1">
              <p
                className={`text-sm font-semibold ${
                invoice.status === 'Paid' ?
                'text-green-800' :
                invoice.status === 'Overdue' ?
                'text-red-800' :
                'text-yellow-800'}`
                }>
                
                {invoice.status === 'Paid' ?
                `Paid on ${invoice.paymentDate}` :
                invoice.status === 'Overdue' ?
                `Overdue since ${invoice.dueDate}` :
                `Payment due by ${invoice.dueDate}`}
              </p>
            </div>
            <p className="text-lg font-bold text-gray-900">
              ₹{invoice.totalPayable.toLocaleString()}
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Invoice Information */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-purple-50 border-b border-purple-100 flex items-center gap-2">
                <Building className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-900">Invoice Information</span>
              </div>
              <div className="p-4 space-y-1">
                {[
                { label: 'Invoice Number', value: invoice.id },
                { label: 'SAC Code', value: invoice.sacCode },
                { label: 'Billing Period', value: invoice.billingPeriod },
                { label: 'Due Date', value: invoice.dueDate },
                { label: 'Payment Date', value: invoice.paymentDate || 'Not yet paid' }].
                map((row, idx) =>
                <div
                  key={idx}
                  className="flex justify-between items-center text-sm py-2 border-b border-gray-50 last:border-0">
                  
                    <span className="text-gray-500">{row.label}</span>
                    <span className="font-medium text-gray-900">{row.value}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Plan & Pricing */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-blue-50 border-b border-blue-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-900">Plan & Pricing Slab</span>
              </div>
              <div className="p-4 space-y-1">
                {[
                { label: 'Plan Name', value: invoice.plan },
                { label: 'Student Count', value: invoice.studentCount.toLocaleString() },
                { label: 'Pricing Slab', value: planSlab?.description },
                {
                  label: 'Per Student Price',
                  value: `₹${invoice.pricePerStudent}`,
                  highlight: true
                },
                {
                  label: 'Subscription Amount',
                  value: `₹${invoice.subscriptionAmount.toLocaleString()}`
                }].
                map((row, idx) =>
                <div
                  key={idx}
                  className="flex justify-between items-center text-sm py-2 border-b border-gray-50 last:border-0">
                  
                    <span className="text-gray-500">{row.label}</span>
                    <span
                    className={`font-medium ${row.highlight ? 'text-blue-600 font-bold' : 'text-gray-900'}`}>
                    
                      {row.value}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Module Add-ons */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-green-50 border-b border-green-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-900">Module Add-ons</span>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                {invoice.moduleCategories.map((mod, idx) =>
                <div
                  key={idx}
                  className="flex justify-between items-center text-sm py-2 border-b border-gray-50">
                  
                    <span className="text-gray-600">{mod.name}</span>
                    <span className="font-medium text-gray-900">
                      ₹{mod.price.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center text-sm py-3 mt-2 border-t-2 border-gray-100">
                <span className="font-semibold text-gray-700">Total Modules</span>
                <span className="font-bold text-green-600">
                  ₹{invoice.moduleCategories.reduce((s, m) => s + m.price, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Communication Charges */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-orange-50 border-b border-orange-100 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-semibold text-orange-900">Communication Charges</span>
            </div>
            <div className="p-4 space-y-1">
              {[
              {
                label: `SMS (${invoice.communicationCharges.sms.count.toLocaleString()} @ ₹${invoice.communicationCharges.sms.rate})`,
                value: `₹${invoice.communicationCharges.sms.total.toLocaleString()}`
              },
              {
                label: `WhatsApp (${invoice.communicationCharges.whatsapp.count.toLocaleString()} @ ₹${invoice.communicationCharges.whatsapp.rate})`,
                value: `₹${invoice.communicationCharges.whatsapp.total.toLocaleString()}`
              },
              {
                label: `Email (${invoice.communicationCharges.email.count.toLocaleString()} @ ₹${invoice.communicationCharges.email.rate})`,
                value: `₹${invoice.communicationCharges.email.total.toLocaleString()}`
              }].
              map((row, idx) =>
              <div
                key={idx}
                className="flex justify-between items-center text-sm py-2 border-b border-gray-50">
                
                  <span className="text-gray-600">{row.label}</span>
                  <span className="font-medium text-gray-900">{row.value}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm py-3 mt-1 border-t-2 border-gray-100">
                <span className="font-semibold text-gray-700">Total Communication</span>
                <span className="font-bold text-orange-600">
                  ₹{invoice.communicationCharges.totalComm.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Amount Summary */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">Amount Summary</span>
            </div>
            <div className="p-4 space-y-2">
              {[
              {
                label: `Base Subscription (${invoice.studentCount.toLocaleString()} × ₹${invoice.pricePerStudent})`,
                value: `₹${invoice.subscriptionAmount.toLocaleString()}`
              },
              {
                label: 'Module Add-ons',
                value: `₹${invoice.moduleCategories.reduce((s, m) => s + m.price, 0).toLocaleString()}`
              },
              {
                label: 'Communication Charges',
                value: `₹${invoice.communicationCharges.totalComm.toLocaleString()}`
              }].
              map((row, idx) =>
              <div key={idx} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{row.label}</span>
                  <span className="font-medium text-gray-900">{row.value}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm pt-3 border-t border-gray-200">
                <span className="font-semibold text-gray-800">Subtotal</span>
                <span className="font-bold text-gray-900">
                  ₹{invoice.subtotal.toLocaleString()}
                </span>
              </div>
              <div className="space-y-1.5 pt-2">
                {[
                { label: 'CGST @ 9%', value: `₹${invoice.cgst.toLocaleString()}` },
                { label: 'SGST @ 9%', value: `₹${invoice.sgst.toLocaleString()}` },
                { label: 'IGST @ 0%', value: `₹${invoice.igst}` }].
                map((row, idx) =>
                <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">{row.label}</span>
                    <span className="font-medium text-gray-700">{row.value}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center pt-4 mt-2 border-t-2 border-gray-900">
                <span className="font-bold text-gray-900 text-base">Total Payable</span>
                <span className="font-bold text-xl text-blue-600">
                  ₹{invoice.totalPayable.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}

export function InvoiceArchive() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('invoices');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [invoiceData] = useState(initialInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [cards, setCards] = useState<PaymentCard[]>(initialCards);
  const [showAddCard, setShowAddCard] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [cardForm, setCardForm] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    brand: 'Visa' as CardBrand,
    type: 'credit' as CardType,
    cvv: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });
  const [cardFormErrors, setCardFormErrors] = useState<Record<string, string>>({});

  const filtered = invoiceData.filter((inv) => {
    const matchSearch =
    inv.id.toLowerCase().includes(search.toLowerCase()) ||
    inv.billingPeriod.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || inv.status === statusFilter;
    const matchPeriod = periodFilter === 'all' || inv.billingPeriod === periodFilter;
    return matchSearch && matchStatus && matchPeriod;
  });

  const handleDownloadInvoice = (invoiceId: string) => {
    console.log(`Downloading invoice: ${invoiceId}`);
  };

  const openInvoiceReceipt = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
  };

  const closeInvoiceReceipt = () => {
    setSelectedInvoice(null);
  };

  const formatCardInput = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 16);
    return cleaned.replace(/(.{4})/g, '$1 ').trim();
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardInput(value);
    const cleaned = value.replace(/\D/g, '');
    const brand = detectCardBrand(cleaned);
    const type = detectCardType(cleaned);
    setCardForm((f) => ({ ...f, cardNumber: formatted, brand, type }));
  };

  const validateCardForm = (): boolean => {
    const errors: Record<string, string> = {};
    const cardNum = cardForm.cardNumber.replace(/\s/g, '');
    if (!cardForm.cardholderName.trim()) errors.cardholderName = 'Cardholder name is required';
    if (!editingCardId && (cardNum.length < 13 || cardNum.length > 16))
    errors.cardNumber = 'Enter a valid card number (13-16 digits)';
    if (!cardForm.expiryMonth || !cardForm.expiryYear) {
      errors.expiry = 'Expiry date is required';
    } else {
      const expiry = new Date(parseInt(cardForm.expiryYear), parseInt(cardForm.expiryMonth) - 1);
      if (expiry <= new Date()) errors.expiry = 'Card has expired';
    }
    if (!cardForm.cvv || cardForm.cvv.length < 3) errors.cvv = 'Enter a valid CVV';
    if (!cardForm.addressLine1.trim()) errors.addressLine1 = 'Address line 1 is required';
    if (!cardForm.city.trim()) errors.city = 'City is required';
    if (!cardForm.state) errors.state = 'State is required';
    if (!cardForm.pincode.trim() || cardForm.pincode.length !== 6)
    errors.pincode = 'Enter a valid 6-digit pincode';
    setCardFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetCardForm = () => {
    setCardForm({
      cardholderName: '',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      brand: 'Visa',
      type: 'credit',
      cvv: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    });
    setCardFormErrors({});
    setShowAddCard(false);
    setEditingCardId(null);
  };

  const handleAddCard = () => {
    if (!validateCardForm()) return;
    const cardNum = cardForm.cardNumber.replace(/\s/g, '');
    const newCard: PaymentCard = {
      id: `card-${Date.now()}`,
      cardholderName: cardForm.cardholderName,
      lastFour: cardNum.slice(-4),
      brand: cardForm.brand,
      type: cardForm.type,
      expiryMonth: cardForm.expiryMonth.padStart(2, '0'),
      expiryYear: cardForm.expiryYear,
      isPrimary: cards.length === 0,
      billingAddress: {
        line1: cardForm.addressLine1,
        line2: cardForm.addressLine2,
        city: cardForm.city,
        state: cardForm.state,
        pincode: cardForm.pincode,
        country: cardForm.country
      }
    };
    setCards((prev) => [...prev, newCard]);
    resetCardForm();
  };

  const handleEditCard = () => {
    if (!validateCardForm() || !editingCardId) return;
    setCards((prev) =>
    prev.map((c) =>
    c.id === editingCardId ?
    {
      ...c,
      cardholderName: cardForm.cardholderName,
      brand: cardForm.brand,
      type: cardForm.type,
      expiryMonth: cardForm.expiryMonth.padStart(2, '0'),
      expiryYear: cardForm.expiryYear,
      billingAddress: {
        line1: cardForm.addressLine1,
        line2: cardForm.addressLine2,
        city: cardForm.city,
        state: cardForm.state,
        pincode: cardForm.pincode,
        country: cardForm.country
      }
    } :
    c
    )
    );
    resetCardForm();
  };

  const handleSetPrimary = (cardId: string) => {
    setCards((prev) => prev.map((c) => ({ ...c, isPrimary: c.id === cardId })));
  };

  const handleDeleteCard = (cardId: string) => {
    const card = cards.find((c) => c.id === cardId);
    if (card?.isPrimary) return;
    setCards((prev) => prev.filter((c) => c.id !== cardId));
    setDeleteConfirmId(null);
  };

  const startEditCard = (card: PaymentCard) => {
    setEditingCardId(card.id);
    setCardForm({
      cardholderName: card.cardholderName,
      cardNumber: `•••• •••• •••• ${card.lastFour}`,
      expiryMonth: card.expiryMonth,
      expiryYear: card.expiryYear,
      brand: card.brand,
      type: card.type,
      cvv: '',
      addressLine1: card.billingAddress.line1,
      addressLine2: card.billingAddress.line2,
      city: card.billingAddress.city,
      state: card.billingAddress.state,
      pincode: card.billingAddress.pincode,
      country: card.billingAddress.country
    });
    setShowAddCard(true);
    setCardFormErrors({});
  };

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: String(i + 1).padStart(2, '0')
  }));

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 12 }, (_, i) => ({
    value: String(currentYear + i),
    label: String(currentYear + i)
  }));

  return (
    <div className="space-y-6 p-6">
      {/* Invoice Receipt Modal */}
      {selectedInvoice &&
      <InvoiceReceiptModal
        invoice={selectedInvoice}
        onClose={closeInvoiceReceipt}
        onDownload={handleDownloadInvoice} />

      }

      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing & Payments</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your invoices and payment methods in one place
          </p>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveSection('invoices')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
          activeSection === 'invoices' ?
          'bg-white text-gray-900 shadow-sm' :
          'text-gray-500 hover:text-gray-700'}`
          }>
          
          <FileText className="w-4 h-4" />
          Invoices
        </button>
        <button
          onClick={() => setActiveSection('payment-methods')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
          activeSection === 'payment-methods' ?
          'bg-white text-gray-900 shadow-sm' :
          'text-gray-500 hover:text-gray-700'}`
          }>
          
          <CreditCard className="w-4 h-4" />
          Payment Methods
        </button>
      </div>

      {/* ===== INVOICES SECTION ===== */}
      {activeSection === 'invoices' &&
      <div className="space-y-6">
          <Card>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Search & Filter Invoices
              </h3>
              <div className="flex flex-col md:flex-row gap-3">
                <Input
                placeholder="Search by invoice number or billing month..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-gray-400" />}
                className="flex-1" />
              
                <Select
                options={[
                { value: 'all', label: 'All Status' },
                { value: 'Paid', label: 'Paid' },
                { value: 'Pending', label: 'Pending' },
                { value: 'Overdue', label: 'Overdue' }]
                }
                value={statusFilter}
                onChange={setStatusFilter}
                className="w-full md:w-40" />
              
                <Select
                options={billingPeriods}
                value={periodFilter}
                onChange={setPeriodFilter}
                className="w-full md:w-48" />
              
                <Button variant="outline" className="text-sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export All
                </Button>
              </div>
            </div>
          </Card>

          <Card noPadding>
            <div className="overflow-x-auto">
              <div className="hidden lg:grid grid-cols-7 gap-4 px-5 py-3 bg-gray-50 border-b border-gray-200">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Invoice Number
                </div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Billing Period
                </div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                  Student Count
                </div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Pricing Slab
                </div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Total Amount
                </div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                  Status
                </div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                  Actions
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {filtered.length === 0 ?
              <div className="px-5 py-16 text-center">
                    <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-500">No invoices found</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Try adjusting your search or filter criteria
                    </p>
                  </div> :

              filtered.map((inv) => {
                const StatusIcon = STATUS_ICONS[inv.status];
                const planSlab = PRICING_SLABS[inv.plan];

                return (
                  <div
                    key={inv.id}
                    className="grid grid-cols-1 lg:grid-cols-7 gap-4 px-5 py-4 hover:bg-gray-50 transition-colors items-center">
                    
                        {/* Invoice Number */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <button
                          onClick={() => openInvoiceReceipt(inv)}
                          className="font-semibold text-blue-600 hover:text-blue-800 text-sm block text-left hover:underline transition-colors">
                          
                              {inv.id}
                            </button>
                            <span className="text-xs text-gray-400 lg:hidden">
                              {inv.billingPeriod}
                            </span>
                          </div>
                        </div>

                        {/* Billing Period */}
                        <div className="hidden lg:block text-sm text-gray-700 font-medium">
                          {inv.billingPeriod}
                        </div>

                        {/* Student Count */}
                        <div className="hidden lg:flex items-center justify-center gap-1.5">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-semibold text-gray-900">
                            {inv.studentCount.toLocaleString()}
                          </span>
                        </div>

                        {/* Pricing Slab */}
                        <div>
                          <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${PLAN_STYLES[inv.plan]}`}>
                        
                            {inv.plan}
                          </span>
                          <p className="text-xs text-gray-400 mt-0.5 hidden lg:block">
                            {planSlab?.description}
                          </p>
                        </div>

                        {/* Total Amount */}
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">
                            ₹{inv.totalPayable.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-400">incl. GST</p>
                        </div>

                        {/* Status */}
                        <div className="flex lg:justify-center">
                          <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${STATUS_STYLES[inv.status]}`}>
                        
                            <StatusIcon className="w-3.5 h-3.5" />
                            {inv.status}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-center gap-1">
                          <button
                        onClick={() => openInvoiceReceipt(inv)}
                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="View Invoice">
                        
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                        onClick={() => handleDownloadInvoice(inv.id)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Download Invoice">
                        
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>);

              })
              }
              </div>
            </div>
          </Card>
        </div>
      }

      {/* ===== PAYMENT METHODS SECTION ===== */}
      {activeSection === 'payment-methods' &&
      <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Saved Cards</h2>
              <p className="text-sm text-gray-500">
                {cards.length} card{cards.length !== 1 ? 's' : ''} on file
              </p>
            </div>
            {!showAddCard &&
          <Button
            variant="primary"
            onClick={() => {
              resetCardForm();
              setShowAddCard(true);
            }}>
            
                <Plus className="w-4 h-4 mr-2" />
                Add New Card
              </Button>
          }
          </div>

          {/* Add / Edit Card Form */}
          {showAddCard &&
        <Card>
              <div className="p-5">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">
                      {editingCardId ? 'Edit Card' : 'Add New Card'}
                    </h3>
                  </div>
                  <button
                onClick={resetCardForm}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Card Details Section */}
                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Card Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Cardholder Name
                      </label>
                      <Input
                    placeholder="Name on card"
                    value={cardForm.cardholderName}
                    onChange={(e) =>
                    setCardForm((f) => ({ ...f, cardholderName: e.target.value }))
                    } />
                  
                      {cardFormErrors.cardholderName &&
                  <p className="text-xs text-red-500 mt-1">{cardFormErrors.cardholderName}</p>
                  }
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Card Number
                      </label>
                      <Input
                    placeholder="1234 5678 9012 3456"
                    value={cardForm.cardNumber}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                    leftIcon={<CreditCard className="w-4 h-4 text-gray-400" />}
                    disabled={!!editingCardId} />
                  
                      {cardFormErrors.cardNumber &&
                  <p className="text-xs text-red-500 mt-1">{cardFormErrors.cardNumber}</p>
                  }
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Expiry Month
                      </label>
                      <Select
                    options={[{ value: '', label: 'MM' }, ...months]}
                    value={cardForm.expiryMonth}
                    onChange={(val) => setCardForm((f) => ({ ...f, expiryMonth: val }))} />
                  
                      {cardFormErrors.expiry &&
                  <p className="text-xs text-red-500 mt-1">{cardFormErrors.expiry}</p>
                  }
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Expiry Year
                      </label>
                      <Select
                    options={[{ value: '', label: 'YYYY' }, ...years]}
                    value={cardForm.expiryYear}
                    onChange={(val) => setCardForm((f) => ({ ...f, expiryYear: val }))} />
                  
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">CVV</label>
                      <Input
                    placeholder="•••"
                    value={cardForm.cvv}
                    onChange={(e) =>
                    setCardForm((f) => ({
                      ...f,
                      cvv: e.target.value.replace(/\D/g, '').slice(0, 4)
                    }))
                    }
                    type="password"
                    leftIcon={<Shield className="w-4 h-4 text-gray-400" />} />
                  
                      {cardFormErrors.cvv &&
                  <p className="text-xs text-red-500 mt-1">{cardFormErrors.cvv}</p>
                  }
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Card Network
                      </label>
                      <div className="flex items-center h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <div
                      className={`w-9 h-5 rounded flex items-center justify-center text-[9px] font-bold text-white mr-2 ${CARD_BRAND_COLORS[cardForm.brand]}`}>
                      
                          {CARD_BRAND_LABELS[cardForm.brand]}
                        </div>
                        <span className="text-sm text-gray-700">{cardForm.brand}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Auto-detected from card number</p>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Card Type
                      </label>
                      <div className="flex items-center h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <span className="text-sm text-gray-700 capitalize">
                          {cardForm.type} Card
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Auto-detected from card number</p>
                    </div>
                  </div>
                </div>

                {/* Billing Address Section */}
                <div className="pt-5 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Billing Address
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Address Line 1
                      </label>
                      <Input
                    placeholder="Street address, building name"
                    value={cardForm.addressLine1}
                    onChange={(e) =>
                    setCardForm((f) => ({ ...f, addressLine1: e.target.value }))
                    } />
                  
                      {cardFormErrors.addressLine1 &&
                  <p className="text-xs text-red-500 mt-1">{cardFormErrors.addressLine1}</p>
                  }
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Address Line 2{' '}
                        <span className="text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <Input
                    placeholder="Apartment, suite, floor, landmark"
                    value={cardForm.addressLine2}
                    onChange={(e) =>
                    setCardForm((f) => ({ ...f, addressLine2: e.target.value }))
                    } />
                  
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">City</label>
                      <Input
                    placeholder="City"
                    value={cardForm.city}
                    onChange={(e) => setCardForm((f) => ({ ...f, city: e.target.value }))} />
                  
                      {cardFormErrors.city &&
                  <p className="text-xs text-red-500 mt-1">{cardFormErrors.city}</p>
                  }
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">State</label>
                      <Select
                    options={indianStates}
                    value={cardForm.state}
                    onChange={(val) => setCardForm((f) => ({ ...f, state: val }))} />
                  
                      {cardFormErrors.state &&
                  <p className="text-xs text-red-500 mt-1">{cardFormErrors.state}</p>
                  }
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Pincode
                      </label>
                      <Input
                    placeholder="6-digit pincode"
                    value={cardForm.pincode}
                    onChange={(e) =>
                    setCardForm((f) => ({
                      ...f,
                      pincode: e.target.value.replace(/\D/g, '').slice(0, 6)
                    }))
                    } />
                  
                      {cardFormErrors.pincode &&
                  <p className="text-xs text-red-500 mt-1">{cardFormErrors.pincode}</p>
                  }
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Country
                      </label>
                      <Input value={cardForm.country} disabled />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Encrypted & secure</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={resetCardForm}>
                      Cancel
                    </Button>
                    <Button
                  variant="primary"
                  size="sm"
                  onClick={editingCardId ? handleEditCard : handleAddCard}>
                  
                      {editingCardId ? 'Update Card' : 'Add Card'}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
        }

          {/* Cards List */}
          {cards.length === 0 ?
        <Card>
              <div className="p-12 text-center">
                <CreditCard className="w-14 h-14 text-gray-200 mx-auto mb-3" />
                <p className="text-base font-medium text-gray-500">No cards added yet</p>
                <p className="text-sm text-gray-400 mt-1 mb-5">
                  Add a card to enable automatic payments
                </p>
                <Button
              variant="primary"
              size="sm"
              onClick={() => {
                resetCardForm();
                setShowAddCard(true);
              }}>
              
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Card
                </Button>
              </div>
            </Card> :

        <Card noPadding>
              <div className="hidden md:grid grid-cols-8 gap-4 px-5 py-3 bg-gray-50 border-b border-gray-200">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Card
                </div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Cardholder
                </div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Number
                </div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Type
                </div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Expires
                </div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Address
                </div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                  Status
                </div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                  Actions
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {cards.map((card) =>
            <div key={card.id}>
                    <div className="grid grid-cols-1 md:grid-cols-8 gap-4 px-5 py-4 items-center hover:bg-gray-50 transition-colors">
                      {/* Card Brand */}
                      <div className="flex items-center gap-3">
                        <div
                    className={`w-11 h-7 rounded flex items-center justify-center text-[10px] font-bold text-white ${CARD_BRAND_COLORS[card.brand]}`}>
                    
                          {CARD_BRAND_LABELS[card.brand]}
                        </div>
                        <span className="text-sm font-medium text-gray-900 md:hidden">
                          •••• {card.lastFour}
                        </span>
                      </div>

                      {/* Cardholder */}
                      <div className="text-sm text-gray-800 font-medium">
                        {card.cardholderName}
                      </div>

                      {/* Number */}
                      <div className="text-sm text-gray-600 font-mono hidden md:block">
                        •••• {card.lastFour}
                      </div>

                      {/* Type */}
                      <div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                          {card.type}
                        </span>
                      </div>

                      {/* Expires */}
                      <div className="text-sm text-gray-600">
                        {card.expiryMonth}/{card.expiryYear.slice(-2)}
                      </div>

                      {/* Address */}
                      <div className="text-xs text-gray-500 hidden md:block leading-relaxed">
                        <span className="block truncate">{card.billingAddress.city}</span>
                        <span className="block truncate text-gray-400">
                          {card.billingAddress.state} - {card.billingAddress.pincode}
                        </span>
                      </div>

                      {/* Status */}
                      <div className="flex md:justify-center">
                        {card.isPrimary ?
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                            <Star className="w-3 h-3 fill-yellow-500" />
                            Primary
                          </span> :

                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                            Secondary
                          </span>
                  }
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-center gap-1">
                        {!card.isPrimary &&
                  <button
                    onClick={() => handleSetPrimary(card.id)}
                    className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                    title="Set as Primary">
                    
                            <Star className="w-4 h-4" />
                          </button>
                  }
                        <button
                    onClick={() => startEditCard(card)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Card">
                    
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {!card.isPrimary &&
                  <button
                    onClick={() => setDeleteConfirmId(card.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove Card">
                    
                            <Trash2 className="w-4 h-4" />
                          </button>
                  }
                      </div>
                    </div>

                    {/* Delete Confirmation */}
                    {deleteConfirmId === card.id && !card.isPrimary &&
              <div className="px-5 pb-4">
                        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                          <p className="text-xs text-red-700 mb-3">
                            Remove card ending in <strong>{card.lastFour}</strong>? This action
                            cannot be undone.
                          </p>
                          <div className="flex gap-2">
                            <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteConfirmId(null)}>
                      
                              Cancel
                            </Button>
                            <button
                      onClick={() => handleDeleteCard(card.id)}
                      className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
                      
                              Yes, Remove
                            </button>
                          </div>
                        </div>
                      </div>
              }
                  </div>
            )}
              </div>
            </Card>
        }

          {/* Security Note */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Secure Payment Information</p>
              <p className="text-xs text-blue-700 mt-1">
                Your card information is encrypted using 256-bit SSL. We never store your full card
                number or CVV. All processing is PCI DSS compliant.
              </p>
            </div>
          </div>
        </div>
      }
    </div>);

}