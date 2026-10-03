import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { printHtml, tableHtml, inr } from '../charge/ChargeReceipt';
import {
  ShoppingCart,
  Package,
  CheckSquare,
  Plus,
  Trash2,
  Save,
  Send,
  Paperclip,
  FileText,
  UserPlus,
  Calendar,
  Calculator,
  Building2,
  Hash,
  CreditCard,
  Clock,
  AlertCircle,
  CheckCircle,
  Info,
  X,
  Upload,
  File,
  Image,
  Eye,
  Copy,
  ChevronDown,
  ChevronUp,
  Percent,
  IndianRupee,
  FileCheck,
  ArrowRight,
  HelpCircle,
  Banknote,
  Receipt,
  Tag,
  MessageSquare,
  History,
  Link,
  ExternalLink,
  Zap,
  AlertTriangle,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  MoreVertical,
  RefreshCw,
  Printer } from
'lucide-react';

// --- Types ---
interface ExpenseItem {
  id: string;
  head: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  discountType: 'percent' | 'fixed';
  taxRate: number;
  hsnCode: string;
}

interface Attachment {
  id: string;
  file: File;
  type: 'invoice' | 'receipt' | 'other';
  preview?: string;
}

// --- Mock Data ---
const VENDORS = [
{ value: 'v_001', label: 'ABC Stationers', gstin: '27AABCU9603R1ZM', address: 'Mumbai, Maharashtra' },
{ value: 'v_002', label: 'City Power Corp', gstin: '27AADCC9604R1ZN', address: 'Pune, Maharashtra' },
{ value: 'v_003', label: 'Global Tech Solutions', gstin: '29AABCG9605R1ZO', address: 'Bangalore, Karnataka' },
{ value: 'v_004', label: 'Fresh Foods Catering', gstin: '27AABCF9606R1ZP', address: 'Mumbai, Maharashtra' },
{ value: 'v_005', label: 'Office Mart India', gstin: '27AABCO9607R1ZQ', address: 'Thane, Maharashtra' }];




const EXPENSE_HEADS = [
{ value: 'h_001', label: 'Lab Chemicals', code: 'EXP-LAB-001' },
{ value: 'h_002', label: 'Office Stationery', code: 'EXP-OFF-002' },
{ value: 'h_003', label: 'Electricity Charges', code: 'EXP-UTL-003' },
{ value: 'h_004', label: 'Event Refreshments', code: 'EXP-EVT-004' },
{ value: 'h_005', label: 'IT Maintenance', code: 'EXP-IT-005' },
{ value: 'h_006', label: 'Printing & Publishing', code: 'EXP-PRT-006' },
{ value: 'h_007', label: 'Transport & Logistics', code: 'EXP-TRN-007' },
{ value: 'h_008', label: 'Building Maintenance', code: 'EXP-BLD-008' }];


const TAX_RATES = [
{ value: '0', label: '0% (Exempt)' },
{ value: '5', label: 'GST 5%' },
{ value: '12', label: 'GST 12%' },
{ value: '18', label: 'GST 18%' },
{ value: '28', label: 'GST 28%' }];


const DEPARTMENTS = [
{ value: 'admin', label: 'Administration' },
{ value: 'academics', label: 'Academics' },
{ value: 'sports', label: 'Sports & Activities' },
{ value: 'transport', label: 'Transport' },
{ value: 'hostel', label: 'Hostel' },
{ value: 'library', label: 'Library' }];


const COST_CENTERS = [
{ value: 'cc_main', label: 'Main Campus' },
{ value: 'cc_branch1', label: 'Branch Campus - North' },
{ value: 'cc_branch2', label: 'Branch Campus - South' }];


const PAYMENT_TERMS = [
{ value: 'immediate', label: 'Immediate' },
{ value: 'net_7', label: 'Net 7 Days' },
{ value: 'net_15', label: 'Net 15 Days' },
{ value: 'net_30', label: 'Net 30 Days' },
{ value: 'net_45', label: 'Net 45 Days' },
{ value: 'net_60', label: 'Net 60 Days' }];


const RECENT_VENDOR_BILLS = [
{ id: 'VCH-2024-089', date: '2024-08-15', amount: 45000, status: 'Paid' },
{ id: 'VCH-2024-076', date: '2024-07-22', amount: 32500, status: 'Paid' },
{ id: 'VCH-2024-058', date: '2024-06-10', amount: 28000, status: 'Paid' }];


/** Full voucher history for the vendor — recent bills first, then the archived ledger. */
const VENDOR_BILL_HISTORY = [
...RECENT_VENDOR_BILLS,
{ id: 'VCH-2024-041', date: '2024-05-18', amount: 19500, status: 'Paid' },
{ id: 'VCH-2024-027', date: '2024-04-12', amount: 54000, status: 'Paid' },
{ id: 'VCH-2024-015', date: '2024-04-05', amount: 12500, status: 'Paid' },
{ id: 'VCH-2023-188', date: '2023-12-20', amount: 36000, status: 'Paid' },
{ id: 'VCH-2023-142', date: '2023-10-02', amount: 27500, status: 'Paid' },
{ id: 'VCH-2023-101', date: '2023-08-14', amount: 8800, status: 'Cancelled' }
];



// --- Purchase Order & GRN Types & Initial Data ---
export interface POItem {
  id: string;
  name: string;
  quantity: number;
  unitRate: number;
  gstRate: number;
  total: number;
}

export interface PurchaseOrderRecord {
  id: string;
  poNo: string;
  poDate: string;
  linkedRequest: string;
  vendorId: string;
  vendorName: string;
  vendorCode: string;
  gstin: string;
  contactPerson: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  deliveryByDate: string;
  deliveryTerms: string;
  items: POItem[];
  subTotal: number;
  totalGst: number;
  grandTotal: number;
  paymentMode: string;
  advancePct: number;
  advanceAmount: number;
  terms: string;
  category: string;
  status: 'Sent' | 'Draft' | 'Pending';
}

export interface GRNItem {
  id: string;
  name: string;
  poQty: number;
  rcvdQty: number;
  rejectedQty: number;
  condition: 'Good' | 'Partially Damaged' | 'Damaged';
  remarks: string;
}

export interface GRNRecord {
  id: string;
  grnNo: string;
  grnDate: string;
  linkedPoNo: string;
  /** Bill / invoice this receipt was created against (filled when the GRN is raised from a bill) */
  linkedBillNo?: string;
  vendorName: string;
  receivedBy: string;
  department: string;
  storeLocation: string;
  items: GRNItem[];
  itemCondition: 'Good' | 'Partially Damaged' | 'Damaged';
  shortDamagedNotes: string;
  deliveryChallanNo: string;
  verifiedBy: string;
  status: 'Full Receipt' | 'Partial Receipt' | 'Rejected';
}

const INITIAL_PURCHASE_ORDERS: PurchaseOrderRecord[] = [
  {
    id: 'po_001',
    poNo: 'PO-2025-001',
    poDate: '27-Sep-2025',
    linkedRequest: 'EXP-REQ-002 — Lab Equipment',
    vendorId: 'v_001',
    vendorName: 'ABC Supplies Ltd',
    vendorCode: 'VND-0045',
    gstin: '27AABCU9603R1ZM',
    contactPerson: 'Mr. Ramesh',
    email: 'vendor@abcsupplies.com',
    phone: '9820011223',
    deliveryAddress: 'XYZ Public School, 123 School Road, City — 400001',
    deliveryByDate: '15-Oct-2025',
    deliveryTerms: 'Doorstep delivery with onsite lab calibration',
    category: 'Lab Equipment',
    items: [
      { id: '1', name: 'Microscope (Lab Grade)', quantity: 10, unitRate: 7500, gstRate: 18, total: 88500 },
      { id: '2', name: 'Lab Stand & Clamp Set', quantity: 20, unitRate: 500, gstRate: 12, total: 11200 }
    ],
    subTotal: 85000,
    totalGst: 14700,
    grandTotal: 99700,
    paymentMode: 'Advance',
    advancePct: 30,
    advanceAmount: 29910,
    terms: 'Standard school purchase terms: Payment within 30 days of GRN verification.',
    status: 'Sent'
  },
  {
    id: 'po_002',
    poNo: 'PO-2025-002',
    poDate: '28-Sep-2025',
    linkedRequest: 'EXP-REQ-001 — Stationery',
    vendorId: 'v_002',
    vendorName: 'XYZ Stationers',
    vendorCode: 'VND-0012',
    gstin: '27AADCC9604R1ZN',
    contactPerson: 'Mr. Suresh',
    email: 'sales@xyzstationers.in',
    phone: '9819922334',
    deliveryAddress: 'XYZ Public School, Central Store Room, City — 400001',
    deliveryByDate: '05-Oct-2025',
    deliveryTerms: 'Direct delivery at central store',
    category: 'Stationery',
    items: [
      { id: '1', name: 'A4 Paper Reams', quantity: 50, unitRate: 250, gstRate: 12, total: 14000 },
      { id: '2', name: 'Whiteboard Marker', quantity: 100, unitRate: 30, gstRate: 18, total: 3540 }
    ],
    subTotal: 15500,
    totalGst: 1550,
    grandTotal: 17050,
    paymentMode: 'On Delivery',
    advancePct: 0,
    advanceAmount: 0,
    terms: 'Payment against verified physical invoice and delivery challan.',
    status: 'Sent'
  },
  {
    id: 'po_003',
    poNo: 'PO-2025-003',
    poDate: '29-Sep-2025',
    linkedRequest: 'EXP-REQ-003 — Sports Equip.',
    vendorId: 'v_003',
    vendorName: 'SportsPro Pvt Ltd',
    vendorCode: 'VND-0089',
    gstin: '27AABCF9606R1ZP',
    contactPerson: 'Mr. Vikas',
    email: 'contact@sportspro.com',
    phone: '9833344556',
    deliveryAddress: 'XYZ Public School, Sports Complex, City — 400001',
    deliveryByDate: '10-Oct-2025',
    deliveryTerms: 'Freight prepaid',
    category: 'Sports Equip.',
    items: [
      { id: '1', name: 'Football (Match Grade)', quantity: 15, unitRate: 1000, gstRate: 12, total: 16800 },
      { id: '2', name: 'Basketballs (Size 7)', quantity: 10, unitRate: 1000, gstRate: 12, total: 11200 }
    ],
    subTotal: 25000,
    totalGst: 3750,
    grandTotal: 28750,
    paymentMode: 'Net-30',
    advancePct: 0,
    advanceAmount: 0,
    terms: 'Payment within 30 days of receipt.',
    status: 'Draft'
  },
  {
    id: 'po_004',
    poNo: 'PO-2025-004',
    poDate: '29-Sep-2025',
    linkedRequest: 'EXP-REQ-004 — IT Equipment',
    vendorId: 'v_004',
    vendorName: 'TechWorld Pvt Ltd',
    vendorCode: 'VND-0104',
    gstin: '29AABCG9605R1ZO',
    contactPerson: 'Ms. Anita',
    email: 'support@techworld.com',
    phone: '9844455667',
    deliveryAddress: 'XYZ Public School, Server Room, City — 400001',
    deliveryByDate: '01-Nov-2025',
    deliveryTerms: 'Installation & OEM 3-year warranty included',
    category: 'IT Equipment',
    items: [
      { id: '1', name: '24-inch IPS LED Monitors', quantity: 20, unitRate: 10000, gstRate: 18, total: 236000 }
    ],
    subTotal: 200000,
    totalGst: 36000,
    grandTotal: 236000,
    paymentMode: 'Net-45',
    advancePct: 20,
    advanceAmount: 47200,
    terms: 'Payment release upon successful installation and sign-off.',
    status: 'Pending'
  }
];

const INITIAL_GRNS: GRNRecord[] = [
  {
    id: 'grn_001',
    grnNo: 'GRN-2025-001',
    grnDate: '15-Oct-2025',
    linkedPoNo: 'PO-2025-001 — ABC Supplies Ltd',
    vendorName: 'ABC Supplies Ltd',
    receivedBy: 'Mr. Sharma — Store Keeper',
    department: 'Science Department',
    storeLocation: 'Main Storeroom / Science Lab',
    items: [
      { id: '1', name: 'Microscope', poQty: 10, rcvdQty: 9, rejectedQty: 1, condition: 'Good', remarks: '1 broken eyepiece lens' },
      { id: '2', name: 'Lab Stand & Clamp', poQty: 20, rcvdQty: 20, rejectedQty: 0, condition: 'Good', remarks: 'All OK' }
    ],
    itemCondition: 'Partially Damaged',
    shortDamagedNotes: '1 Microscope rejected — Vendor to replace or issue credit note',
    deliveryChallanNo: 'DC-2025-99214',
    verifiedBy: 'HOD — Ms. Joshi',
    status: 'Partial Receipt'
  }
];

/** A bill / invoice that has been booked but whose delivery still needs to be receipted. */
interface GrnPendingBill {
  id: string;
  billNo: string;
  vendorInvoiceNo: string;
  vendorName: string;
  poNo: string;
  billAmount: number;
  receivedOn: string;
  receivedBy: string;
  /** GRN already raised against this bill, if any */
  grnNo?: string;
}

/**
 * Mirrors the bills booked on Bill / Invoice Management, Approval & Payment.
 * The goods-receipt check happens here: the person who physically receives the
 * order verifies the delivery and adds the GRN against the bill.
 */
const INITIAL_GRN_PENDING_BILLS: GrnPendingBill[] = [
  {
    id: 'grnb_001',
    billNo: 'BILL-2025-0184',
    vendorInvoiceNo: 'INV-ABC-2025-1234',
    vendorName: 'ABC Supplies Ltd',
    poNo: 'PO-2025-001',
    billAmount: 124600,
    receivedOn: '15-Oct-2025',
    receivedBy: 'Mr. Sharma — Store Keeper',
    grnNo: 'GRN-2025-001'
  },
  {
    id: 'grnb_002',
    billNo: 'BILL-2025-0207',
    vendorInvoiceNo: 'INV-MED-2025-8891',
    vendorName: 'MedEquip Traders',
    poNo: 'PO-2025-002',
    billAmount: 58300,
    receivedOn: '08-Oct-2025',
    receivedBy: 'Ms. Joshi — HOD Science',
    grnNo: 'GRN-2025-002'
  },
  {
    id: 'grnb_003',
    billNo: 'BILL-2025-0231',
    vendorInvoiceNo: 'INV-SEC-2025-4471',
    vendorName: 'SecureGuard Services',
    poNo: 'PO-2025-0180',
    billAmount: 72000,
    receivedOn: '—',
    receivedBy: 'Pending receipt'
  },
  {
    id: 'grnb_004',
    billNo: 'BILL-2025-0244',
    vendorInvoiceNo: 'INV-STN-2025-7712',
    vendorName: 'Shree Stationers',
    poNo: 'PO-2025-0224',
    billAmount: 19850,
    receivedOn: '—',
    receivedBy: 'Pending receipt'
  }
];

export function ExpenseVoucherEntry() {
  // --- State ---
  // Header
  const [vendorId, setVendorId] = useState('');
  const [isNewVendor, setIsNewVendor] = useState(false);
  const [newVendorName, setNewVendorName] = useState('');
  const [newVendorGstin, setNewVendorGstin] = useState('');
  const [billNo, setBillNo] = useState('');
  const [billDate, setBillDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [department, setDepartment] = useState('');
  const [costCenter, setCostCenter] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('net_30');
  const [referenceNo, setReferenceNo] = useState('');
  const [narration, setNarration] = useState('');

  // Grid
  const [items, setItems] = useState<ExpenseItem[]>([
  { id: '1', head: '', description: '', quantity: 1, unitPrice: 0, discount: 0, discountType: 'percent', taxRate: 18, hsnCode: '' }]
  );

  // Attachments
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  // UI State
  const [showVendorDetails, setShowVendorDetails] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [mainSection, setMainSection] = useState<'voucher' | 'po' | 'grn'>('voucher');
  const [activeTab, setActiveTab] = useState<'items' | 'attachments' | 'notes'>('items');

  // Purchase Order State
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderRecord[]>(INITIAL_PURCHASE_ORDERS);
  const [showPoModal, setShowPoModal] = useState(false);
  const [viewPo, setViewPo] = useState<PurchaseOrderRecord | null>(null);

  // GRN State
  const [grnList, setGrnList] = useState<GRNRecord[]>(INITIAL_GRNS);
  const [showGrnModal, setShowGrnModal] = useState(false);
  const [selectedPoForGrn, setSelectedPoForGrn] = useState<string>('PO-2025-001 — ABC Supplies Ltd');
  const [viewGrn, setViewGrn] = useState<GRNRecord | null>(null);
  /** Bills / invoices shown in the GRN tab so a receipt can be raised from the bill itself */
  const [grnBills, setGrnBills] = useState<GrnPendingBill[]>(INITIAL_GRN_PENDING_BILLS);
  const [grnSourceBill, setGrnSourceBill] = useState<GrnPendingBill | null>(null);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => setNotificationToast(null), 3500);
  };
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null);
  const [showAllBills, setShowAllBills] = useState(false);

  // Get selected vendor details
  const selectedVendor = useMemo(() => {
    return VENDORS.find((v) => v.value === vendorId);
  }, [vendorId]);

  // --- Logic & Calculations ---

  const handleAddItem = () => {
    const newItem: ExpenseItem = {
      id: Math.random().toString(36).substr(2, 9),
      head: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      discountType: 'percent',
      taxRate: 18,
      hsnCode: ''
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((i) => i.id !== id));
    } else {
      setItems([
      {
        id: '1',
        head: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        discountType: 'percent',
        taxRate: 18,
        hsnCode: ''
      }]
      );
    }
  };

  const handleDuplicateItem = (item: ExpenseItem) => {
    const newItem: ExpenseItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9)
    };
    const index = items.findIndex((i) => i.id === item.id);
    const newItems = [...items];
    newItems.splice(index + 1, 0, newItem);
    setItems(newItems);
  };

  const updateItem = (id: string, field: keyof ExpenseItem, value: any) => {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: Attachment['type']) => {
    const files = e.target.files;
    if (files) {
      const newAttachments: Attachment[] = Array.from(files).map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        type,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
      }));
      setAttachments([...attachments, ...newAttachments]);
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter((a) => a.id !== id));
  };

  // Calculate row totals
  const calculateRowTotals = (item: ExpenseItem) => {
    const baseAmount = item.quantity * item.unitPrice;
    const discountAmount =
    item.discountType === 'percent' ? baseAmount * (item.discount / 100) : item.discount;
    const taxableAmount = baseAmount - discountAmount;
    const taxAmount = taxableAmount * (item.taxRate / 100);
    const totalAmount = taxableAmount + taxAmount;

    return {
      baseAmount,
      discountAmount,
      taxableAmount,
      taxAmount,
      totalAmount
    };
  };

  // Calculate Totals
  const totals = useMemo(() => {
    let baseTotal = 0;
    let discountTotal = 0;
    let taxableTotal = 0;
    let taxTotal = 0;
    let grandTotal = 0;

    items.forEach((item) => {
      const rowTotals = calculateRowTotals(item);
      baseTotal += rowTotals.baseAmount;
      discountTotal += rowTotals.discountAmount;
      taxableTotal += rowTotals.taxableAmount;
      taxTotal += rowTotals.taxAmount;
      grandTotal += rowTotals.totalAmount;
    });

    return {
      baseTotal,
      discountTotal,
      taxableTotal,
      taxTotal,
      grandTotal,
      itemCount: items.filter((i) => i.head).length
    };
  }, [items]);

  // Auto-calculate due date based on payment terms
  const handlePaymentTermsChange = (terms: string) => {
    setPaymentTerms(terms);
    if (billDate) {
      const baseDate = new Date(billDate);
      let daysToAdd = 0;

      switch (terms) {
        case 'immediate':
          daysToAdd = 0;
          break;
        case 'net_7':
          daysToAdd = 7;
          break;
        case 'net_15':
          daysToAdd = 15;
          break;
        case 'net_30':
          daysToAdd = 30;
          break;
        case 'net_45':
          daysToAdd = 45;
          break;
        case 'net_60':
          daysToAdd = 60;
          break;
      }

      baseDate.setDate(baseDate.getDate() + daysToAdd);
      setDueDate(baseDate.toISOString().split('T')[0]);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!vendorId && !newVendorName) {
      newErrors.vendor = 'Please select a vendor or enter a new payee name';
    }
    if (!billNo) {
      newErrors.billNo = 'Bill/Invoice number is required';
    }
    if (!billDate) {
      newErrors.billDate = 'Bill date is required';
    }
    if (!department) {
      newErrors.department = 'Please select a department';
    }
    if (items.every((i) => !i.head)) {
      newErrors.items = 'At least one expense item is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (action: 'draft' | 'submit') => {
    if (action === 'submit' && !validateForm()) {
      return;
    }

    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const actionText = action === 'draft' ? 'Saved as Draft' : 'Submitted for Approval';
    if (action === 'submit') {
      const vchNo = `VCH-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(
        Math.floor(100 + Math.random() * 899)
      )}`;
      showToast(
        `${actionText} · Voucher ${vchNo} · Total ${inr(totals.grandTotal)} — routed to HOD Approval`
      );
    } else {
      showToast(`${actionText} · Voucher total ${inr(totals.grandTotal)}`);
    }

    setIsSaving(false);
  };

  const handleClear = () => {
    setShowClearConfirm(true);
  };

  const performClear = () => {
    {
      setVendorId('');
      setIsNewVendor(false);
      setNewVendorName('');
      setNewVendorGstin('');
      setBillNo('');
      setBillDate(new Date().toISOString().split('T')[0]);
      setDueDate('');
      setDepartment('');
      setCostCenter('');
      setPaymentTerms('net_30');
      setReferenceNo('');
      setNarration('');
      setItems([
      {
        id: '1',
        head: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        discountType: 'percent',
        taxRate: 18,
        hsnCode: ''
      }]
      );
      setAttachments([]);
      setErrors({});
    }
  };

  const handlePrintVoucher = () => {
    const headers = ['#', 'Expense Head', 'Description', 'Qty', 'Unit Rate', 'Tax %', 'Line Total'];
    const rows: (string | number)[][] = items.map((it, i) => {
      const t = calculateRowTotals(it);
      const headLabel = EXPENSE_HEADS.find((h) => h.value === it.head)?.label || it.head || '—';
      return [
        i + 1,
        headLabel,
        it.description || '—',
        it.quantity,
        inr(it.unitPrice),
        `${it.taxRate}%`,
        inr(t.totalAmount)
      ];
    });
    rows.push(['', 'Taxable Value', '', '', '', '', inr(totals.taxableTotal)]);
    rows.push(['', 'GST', '', '', '', '', inr(totals.taxTotal)]);
    rows.push(['', 'Grand Total', '', '', '', '', inr(totals.grandTotal)]);
    const vendorName = selectedVendor?.label || newVendorName || 'Vendor not selected';
    printHtml(
      tableHtml(
        `Expense Voucher ${voucherPreview} · ${vendorName} · Bill ${billNo || '—'} (${billDate || '—'})`,
        headers,
        rows
      )
    );
    showToast('Opening print preview for the expense voucher…');
  };

  // Generate voucher number preview
  const voucherPreview = useMemo(() => {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `VCH-${year}${month}-XXXX`;
  }, []);

  return (
    <div className="bg-gray-50">
      <div className="space-y-6">
        {/* Header */}
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                <Receipt className="w-5 h-5" />
              </div>
            <div>
                              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                Expense Voucher Entry
                <Badge variant="secondary" className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200">
                  FY: 2025-26
                </Badge>
              </h1>
              <p className="text-xs text-gray-500">
                Record vendor invoices and initiate the payment approval workflow
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {mainSection === 'voucher' && (
              <div className="text-right hidden lg:block">
                <p className="text-xs text-gray-500">Voucher Number (Auto)</p>
                <p className="font-mono text-sm font-medium text-gray-700">{voucherPreview}</p>
              </div>
            )}
            {mainSection === 'voucher' && <div className="h-10 w-px bg-gray-200 hidden lg:block" />}
            {mainSection === 'voucher' && (
              <Button variant="outline" onClick={handleClear}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Clear
              </Button>
            )}
            <Button variant="outline" onClick={handlePrintVoucher}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </div>

        {/* Module Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-gray-100 overflow-x-auto">
          <button
            onClick={() => setMainSection('voucher')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              mainSection === 'voucher'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Expense Voucher Entry</span>
          </button>
          <button
            onClick={() => setMainSection('po')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              mainSection === 'po'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Purchase Orders (PO)</span>
            <span className="px-1.5 py-0.2 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
              {purchaseOrders.length}
            </span>
          </button>
          <button
            onClick={() => setMainSection('grn')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              mainSection === 'grn'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Goods Received Note (GRN)</span>
            <span className="px-1.5 py-0.2 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
              {grnList.length}
            </span>
          </button>
        </div>
      

        {/* Conditional Sections */}
        {mainSection === 'po' && (
          <PurchaseOrderSection
            orders={purchaseOrders}
            onViewPo={(po) => setViewPo(po)}
            onCreateGrnForPo={(po) => {
              setSelectedPoForGrn(`${po.poNo} — ${po.vendorName}`);
              setShowGrnModal(true);
            }}
            onAddBillForPo={(po) => {
              setMainSection('voucher');
              setVendorId(po.vendorId);
              setBillNo(`INV-${po.poNo.replace('PO-', '')}`);
              setNarration(`Expense invoice against PO ${po.poNo}`);
            }}
          />
        )}

        {mainSection === 'grn' && (
          <GoodsReceivedNoteSection
            grns={grnList}
            bills={grnBills}
            onCreateGrn={() => {
              setGrnSourceBill(null);
              setShowGrnModal(true);
            }}
            onCreateGrnForBill={(b) => {
              setGrnSourceBill(b);
              setSelectedPoForGrn(`${b.poNo} — ${b.vendorName}`);
              setShowGrnModal(true);
            }}
            onViewGrn={(g) => setViewGrn(g)}
            onViewGrnNo={(grnNo) => {
              const found = grnList.find((g) => g.grnNo === grnNo);
              if (found) {
                setViewGrn(found);
              } else {
                showToast(`GRN ${grnNo} is not in the GRN register yet.`);
              }
            }}
          />
        )}

        {/* Main Content Grid (Original Voucher Section) */}
        {mainSection === 'voucher' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vendor & Bill Details */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <h2 className="font-semibold text-gray-900">Vendor & Bill Information</h2>
                  </div>
                  <Badge variant="info" className="text-xs">
                    Step 1 of 3
                  </Badge>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Vendor Selection Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-gray-700">
                        Vendor / Payee <span className="text-rose-500">*</span>
                      </label>
                      <button
                        onClick={() => {
                          setIsNewVendor(!isNewVendor);
                          setVendorId('');
                          setNewVendorName('');
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium">

                        <UserPlus className="w-3 h-3" />
                        {isNewVendor ? 'Select Existing Vendor' : 'Add One-time Payee'}
                      </button>
                    </div>

                    {isNewVendor ?
                    <div className="space-y-3">
                        <Input
                        placeholder="Enter Payee/Vendor Name"
                        value={newVendorName}
                        onChange={(e) => setNewVendorName(e.target.value)}
                        className="bg-amber-50 border-amber-300 focus:border-amber-500" />

                        <Input
                        placeholder="GSTIN (Optional)"
                        value={newVendorGstin}
                        onChange={(e) => setNewVendorGstin(e.target.value)}
                        className="bg-amber-50 border-amber-300 focus:border-amber-500" />

                      </div> :

                    <Select
                      options={VENDORS.map((v) => ({ value: v.value, label: v.label }))}
                      placeholder="Search or select vendor..."
                      value={vendorId}
                      onChange={(e) => {
                        setVendorId(e.target.value);
                        setShowVendorDetails(true);
                      }}
                      className={errors.vendor ? 'border-rose-300' : ''} />

                    }
                    {errors.vendor && <p className="text-xs text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.vendor}
                    </p>}

                    {/* Vendor Details Card */}
                    {selectedVendor && showVendorDetails &&
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mt-2">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-gray-400" />
                              <span className="font-medium text-gray-900">{selectedVendor.label}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Hash className="w-3 h-3 text-gray-400" />
                              <span>GSTIN: {selectedVendor.gstin}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              <span>{selectedVendor.address}</span>
                            </div>
                          </div>
                          <button
                          onClick={() => setShowVendorDetails(false)}
                          className="p-1 hover:bg-gray-200 rounded">

                            <X className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    }
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Bill / Invoice Number <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        placeholder="e.g., INV-2024-001"
                        value={billNo}
                        onChange={(e) => setBillNo(e.target.value)}
                        className={errors.billNo ? 'border-rose-300' : ''} />

                      {errors.billNo && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.billNo}
                      </p>}
                    </div>
                  </div>
                </div>

                {/* Date and Terms Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Bill Date <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      type="date"
                      value={billDate}
                      onChange={(e) => setBillDate(e.target.value)}
                      className={errors.billDate ? 'border-rose-300' : ''} />

                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Payment Terms
                    </label>
                    <Select
                      options={PAYMENT_TERMS}
                      value={paymentTerms}
                      onChange={(e) => handlePaymentTermsChange(e.target.value)} />

                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Due Date
                    </label>
                    <Input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)} />

                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Reference No.
                    </label>
                    <Input
                      placeholder="PO/Quotation No."
                      value={referenceNo}
                      onChange={(e) => setReferenceNo(e.target.value)} />

                  </div>
                </div>

                {/* Department and Cost Center */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Department <span className="text-rose-500">*</span>
                    </label>
                    <Select
                      options={DEPARTMENTS}
                      placeholder="Select department..."
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className={errors.department ? 'border-rose-300' : ''} />

                    {errors.department && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.department}
                    </p>}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Cost Center
                    </label>
                    <Select
                      options={COST_CENTERS}
                      placeholder="Select cost center..."
                      value={costCenter}
                      onChange={(e) => setCostCenter(e.target.value)} />

                  </div>
                </div>

                {/* Advanced Options Toggle */}
                <button
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">

                  {showAdvancedOptions ?
                  <ChevronUp className="w-4 h-4" /> :

                  <ChevronDown className="w-4 h-4" />
                  }
                  <span>{showAdvancedOptions ? 'Hide' : 'Show'} Additional Options</span>
                </button>

                {showAdvancedOptions &&
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Narration / Purpose
                      </label>
                      <textarea
                      placeholder="Enter purpose or description of this expense..."
                      value={narration}
                      onChange={(e) => setNarration(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3} />

                    </div>
                  </div>
                }
              </div>
            </div>

            {/* Expense Items Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    <div>
                      <h2 className="font-semibold text-gray-900">Expense Line Items</h2>
                      <p className="text-xs text-gray-500">Add expense heads and amounts</p>
                    </div>
                  </div>
                  <Badge variant="info" className="text-xs">
                    Step 2 of 3
                  </Badge>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="px-6 pt-4 border-b border-gray-100">
                <div className="flex gap-6">
                  <button
                    onClick={() => setActiveTab('items')}
                    className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'items' ?
                    'border-blue-600 text-blue-600' :
                    'border-transparent text-gray-500 hover:text-gray-700'}`
                    }>

                    <span className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Items ({items.length})
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('attachments')}
                    className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'attachments' ?
                    'border-blue-600 text-blue-600' :
                    'border-transparent text-gray-500 hover:text-gray-700'}`
                    }>

                    <span className="flex items-center gap-2">
                      <Paperclip className="w-4 h-4" />
                      Attachments ({attachments.length})
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('notes')}
                    className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'notes' ?
                    'border-blue-600 text-blue-600' :
                    'border-transparent text-gray-500 hover:text-gray-700'}`
                    }>

                    <span className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Notes
                    </span>
                  </button>
                </div>
              </div>

              {/* Items Tab */}
              {activeTab === 'items' &&
              <div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-8">
                            #
                          </th>
                          <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Expense Head <span className="text-rose-500">*</span>
                          </th>
                          <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="p-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">
                            Qty
                          </th>
                          <th className="p-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">
                            Unit Price
                          </th>
                          <th className="p-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">
                            Discount
                          </th>
                          <th className="p-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">
                            Tax
                          </th>
                          <th className="p-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">
                            Amount
                          </th>
                          <th className="p-3 w-16"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {items.map((item, index) => {
                        const rowTotals = calculateRowTotals(item);

                        return (
                          <tr key={item.id} className="group hover:bg-blue-50/50 transition-colors">
                              <td className="p-3 text-gray-400 text-center">{index + 1}</td>
                              <td className="p-3">
                                <select
                                className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                value={item.head}
                                onChange={(e) => updateItem(item.id, 'head', e.target.value)}>

                                  <option value="">Select...</option>
                                  {EXPENSE_HEADS.map((h) =>
                                <option key={h.value} value={h.value}>
                                      {h.label}
                                    </option>
                                )}
                                </select>
                              </td>
                              <td className="p-3">
                                <input
                                type="text"
                                placeholder="Item description..."
                                className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={item.description}
                                onChange={(e) => updateItem(item.id, 'description', e.target.value)} />

                              </td>
                              <td className="p-3">
                                <input
                                type="number"
                                min="1"
                                className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={item.quantity}
                                onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)} />

                              </td>
                              <td className="p-3">
                                <div className="relative">
                                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                                  <input
                                  type="number"
                                  placeholder="0.00"
                                  className="w-full pl-6 pr-2 py-1.5 border border-gray-200 rounded-md text-sm text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  value={item.unitPrice || ''}
                                  onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)} />

                                </div>
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-1">
                                  <input
                                  type="number"
                                  placeholder="0"
                                  className="w-14 px-2 py-1.5 border border-gray-200 rounded-md text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  value={item.discount || ''}
                                  onChange={(e) => updateItem(item.id, 'discount', parseFloat(e.target.value) || 0)} />

                                  <select
                                  className="w-12 px-1 py-1.5 border border-gray-200 rounded-md text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  value={item.discountType}
                                  onChange={(e) => updateItem(item.id, 'discountType', e.target.value)}>

                                    <option value="percent">%</option>
                                    <option value="fixed">₹</option>
                                  </select>
                                </div>
                              </td>
                              <td className="p-3">
                                <select
                                className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={item.taxRate}
                                onChange={(e) => updateItem(item.id, 'taxRate', parseFloat(e.target.value))}>

                                  {TAX_RATES.map((r) =>
                                <option key={r.value} value={r.value}>
                                      {r.label}
                                    </option>
                                )}
                                </select>
                              </td>
                              <td className="p-3 text-right">
                                <span className="font-semibold text-gray-900">
                                  ₹{rowTotals.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </span>
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                  onClick={() => handleDuplicateItem(item)}
                                  className="p-1.5 hover:bg-blue-100 rounded text-blue-600"
                                  title="Duplicate row">

                                    <Copy className="w-4 h-4" />
                                  </button>
                                  <button
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="p-1.5 hover:bg-rose-100 rounded text-rose-600"
                                  title="Remove row">

                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>);

                      })}
                      </tbody>
                    </table>
                  </div>

                  {errors.items &&
                <div className="px-6 py-2 bg-rose-50 border-t border-rose-100">
                      <p className="text-sm text-rose-600 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {errors.items}
                      </p>
                    </div>
                }

                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <Button variant="ghost" onClick={handleAddItem} className="text-blue-600">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Another Item
                    </Button>
                  </div>
                </div>
              }

              {/* Attachments Tab */}
              {activeTab === 'attachments' &&
              <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Invoice Upload */}
                    <div className="relative">
                      <input
                      type="file"
                      id="invoice-upload"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(e, 'invoice')} />

                      <label
                      htmlFor="invoice-upload"
                      className="flex flex-col items-center justify-center p-6 border border-dashed border-blue-200 rounded-xl bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors">

                        <FileText className="w-8 h-8 text-blue-500 mb-2" />
                        <span className="text-sm font-medium text-blue-700">Invoice/Bill</span>
                        <span className="text-xs text-blue-500 mt-1">PDF, JPG, PNG</span>
                      </label>
                    </div>

                    {/* Receipt Upload */}
                    <div className="relative">
                      <input
                      type="file"
                      id="receipt-upload"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(e, 'receipt')} />

                      <label
                      htmlFor="receipt-upload"
                      className="flex flex-col items-center justify-center p-6 border border-dashed border-emerald-200 rounded-xl bg-emerald-50 cursor-pointer hover:bg-emerald-100 transition-colors">

                        <Receipt className="w-8 h-8 text-emerald-500 mb-2" />
                        <span className="text-sm font-medium text-emerald-700">Receipt</span>
                        <span className="text-xs text-emerald-500 mt-1">PDF, JPG, PNG</span>
                      </label>
                    </div>

                    {/* Other Documents */}
                    <div className="relative">
                      <input
                      type="file"
                      id="other-upload"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      multiple
                      onChange={(e) => handleFileUpload(e, 'other')} />

                      <label
                      htmlFor="other-upload"
                      className="flex flex-col items-center justify-center p-6 border border-dashed border-gray-200 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">

                        <Paperclip className="w-8 h-8 text-gray-500 mb-2" />
                        <span className="text-sm font-medium text-gray-700">Other Documents</span>
                        <span className="text-xs text-gray-500 mt-1">Any format</span>
                      </label>
                    </div>
                  </div>

                  {/* Uploaded Files List */}
                  {attachments.length > 0 &&
                <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-700">Uploaded Files</h4>
                      <div className="space-y-2">
                        {attachments.map((attachment) =>
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">

                            <div className="flex items-center gap-3">
                              {attachment.preview ?
                        <img
                          src={attachment.preview}
                          alt="Preview"
                          className="w-10 h-10 object-cover rounded" /> :


                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                                  <File className="w-5 h-5 text-gray-500" />
                                </div>
                        }
                              <div>
                                <p className="text-sm font-medium text-gray-900">{attachment.file.name}</p>
                                <p className="text-xs text-gray-500">
                                  {(attachment.file.size / 1024).toFixed(1)} KB •{' '}
                                  <span className="capitalize">{attachment.type}</span>
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setPreviewAttachment(attachment)}
                                className="p-1.5 hover:bg-gray-200 rounded text-gray-500"
                                title="Preview attachment">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                          onClick={() => handleRemoveAttachment(attachment.id)}
                          className="p-1.5 hover:bg-rose-100 rounded text-rose-500">

                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                    )}
                      </div>
                    </div>
                }

                  {attachments.length === 0 &&
                <div className="text-center py-8 text-gray-500">
                      <Paperclip className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">No attachments uploaded yet</p>
                      <p className="text-xs text-gray-400 mt-1">Upload invoice, receipt, or supporting documents</p>
                    </div>
                }
                </div>
              }

              {/* Notes Tab */}
              {activeTab === 'notes' &&
              <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Internal Notes</label>
                      <textarea
                      placeholder="Add internal notes for this voucher (visible only to finance team)..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={4} />

                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Approval Comments (Optional)
                      </label>
                      <textarea
                      placeholder="Add any comments for the approver..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3} />

                    </div>
                  </div>
                </div>
              }
            </div>
          </div>

          {/* Right Column - Summary & Actions */}
          <div className="space-y-6">
            {/* Vendor History (shows when vendor is selected) */}
            {selectedVendor &&
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <History className="w-5 h-5 text-gray-500" />
                      <h3 className="font-medium text-gray-900">Recent Bills</h3>
                    </div>
                    <button
                      onClick={() => setShowAllBills(true)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                      View All ({VENDOR_BILL_HISTORY.length})
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {RECENT_VENDOR_BILLS.map((bill) =>
                <div key={bill.id} className="px-6 py-3 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{bill.id}</p>
                          <p className="text-xs text-gray-500">{bill.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            ₹{bill.amount.toLocaleString()}
                          </p>
                          <Badge variant="success" className="text-xs">
                            {bill.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                )}
                </div>
              </div>
            }

            {/* Help Card */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">Need Help?</h4>
                  <ul className="space-y-1.5 text-sm text-blue-700">
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                      <span>All fields marked with * are mandatory</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                      <span>Attach scanned invoice for quick approval</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                      <span>Draft vouchers can be edited later</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Bill Summary — moved to the bottom of the page, no longer sticky */}
        {mainSection === 'voucher' && (
          <div className="space-y-6">
              {/* Bill Summary Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white">
                  <div className="flex items-center gap-3">
                    <Calculator className="w-5 h-5 text-purple-600" />
                    <h2 className="font-semibold text-gray-900">Bill Summary</h2>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {/* Item Count */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Items</span>
                    <Badge variant="outline">{totals.itemCount} items</Badge>
                  </div>

                  <div className="border-t border-gray-100 pt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="text-gray-900">
                        ₹{totals.baseTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    {totals.discountTotal > 0 &&
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Discount</span>
                        <span className="text-emerald-600">
                          -₹{totals.discountTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    }

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Taxable Amount</span>
                      <span className="text-gray-900">
                        ₹{totals.taxableTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tax (GST)</span>
                      <span className="text-gray-900">
                        ₹{totals.taxTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  <div className="border-t-2 border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-semibold text-gray-900">Total Amount</span>
                      <span className="text-2xl font-bold text-blue-600">
                        ₹{totals.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 space-y-3">
                    <Button
                      variant="primary"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleSave('submit')}
                      disabled={isSaving}>

                      {isSaving ?
                      <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </> :

                      <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit for Approval
                        </>
                      }
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleSave('draft')}
                      disabled={isSaving}>

                      <Save className="w-4 h-4 mr-2" />
                      Save as Draft
                    </Button>
                  </div>

                </div>
              </div>
          </div>
        )}

        {/* CREATE PURCHASE ORDER MODAL */}
      {showPoModal && (
        <CreatePurchaseOrderModal
          onClose={() => setShowPoModal(false)}
          onCreate={(newPo) => {
            setPurchaseOrders((prev) => [newPo, ...prev]);
            showToast(`Purchase Order ${newPo.poNo} created and issued to ${newPo.vendorName}.`);
            setShowPoModal(false);
          }}
        />
      )}

      {/* VIEW PURCHASE ORDER MODAL */}
      {viewPo && (
        <ViewPurchaseOrderModal
          po={viewPo}
          onClose={() => setViewPo(null)}
          onSendVendor={() => {
            setPurchaseOrders((prev) =>
              prev.map((p) => (p.id === viewPo.id ? { ...p, status: 'Sent' as const } : p))
            );
            showToast(`Purchase Order ${viewPo.poNo} sent to vendor via email.`);
            setViewPo(null);
          }}
        />
      )}

      {/* CREATE GRN MODAL */}
      {showGrnModal && (
        <CreateGRNModal
          linkedPoText={selectedPoForGrn}
          linkedBillNo={grnSourceBill?.billNo}
          onClose={() => {
            setShowGrnModal(false);
            setGrnSourceBill(null);
          }}
          onCreate={(newGrn) => {
            const grn: GRNRecord = {
              ...newGrn,
              linkedBillNo: grnSourceBill?.billNo || newGrn.linkedBillNo
            };
            setGrnList((prev) => [grn, ...prev]);
            if (grnSourceBill) {
              setGrnBills((prev) =>
                prev.map((b) =>
                  b.id === grnSourceBill.id
                    ? {
                        ...b,
                        grnNo: grn.grnNo,
                        receivedOn: b.receivedOn === '—' ? 'Today' : b.receivedOn,
                        receivedBy: b.receivedBy === 'Pending receipt' ? grn.receivedBy : b.receivedBy
                      }
                    : b
                )
              );
              showToast(`GRN ${grn.grnNo} recorded against ${grnSourceBill.billNo}.`);
            } else {
              showToast(`Goods Received Note ${grn.grnNo} recorded successfully.`);
            }
            setShowGrnModal(false);
            setGrnSourceBill(null);
          }}
        />
      )}

      {/* VIEW GRN MODAL */}
      {viewGrn && (
        <ViewGRNModal
          grn={viewGrn}
          onClose={() => setViewGrn(null)}
        />
      )}

      {/* CLEAR CONFIRMATION MODAL */}
      {showClearConfirm && (
        <Modal isOpen onClose={() => setShowClearConfirm(false)} title="Clear Voucher Entry?" size="sm">
          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-amber-900">
                All vendor, bill and line-item data entered on this voucher will be cleared. This cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowClearConfirm(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-rose-600 hover:bg-rose-700 text-white"
                onClick={() => {
                  performClear();
                  setShowClearConfirm(false);
                  showToast('Voucher entry cleared');
                }}>
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Clear Entry
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ATTACHMENT PREVIEW MODAL */}
      {previewAttachment && (
        <Modal
          isOpen
          onClose={() => setPreviewAttachment(null)}
          title={`Attachment — ${previewAttachment.file.name}`}
          size="md">
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
              <div>
                <span className="block text-[10px] text-gray-400">File name</span>
                <span className="font-medium text-gray-800">{previewAttachment.file.name}</span>
              </div>
              <div>
                <span className="block text-[10px] text-gray-400">Size / Type</span>
                <span className="font-medium text-gray-800">
                  {(previewAttachment.file.size / 1024).toFixed(1)} KB · {previewAttachment.type}
                </span>
              </div>
            </div>
            {previewAttachment.preview ? (
              <img
                src={previewAttachment.preview}
                alt={previewAttachment.file.name}
                className="max-h-[60vh] w-full rounded-lg border border-gray-200 object-contain"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-gray-300 p-8 text-gray-500">
                <File className="w-8 h-8 text-gray-400" />
                <p>Inline preview is available for image attachments only.</p>
              </div>
            )}
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setPreviewAttachment(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ALL VENDOR BILLS MODAL */}
      {showAllBills && (
        <Modal
          isOpen
          onClose={() => setShowAllBills(false)}
          title={`Bill History — ${selectedVendor?.label || 'Selected Vendor'}`}
          size="lg">
          <div className="space-y-3 text-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Voucher No.</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Amount</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {VENDOR_BILL_HISTORY.map((bill) => (
                  <tr key={bill.id} className="hover:bg-gray-50">
                    <td className="p-3 font-mono text-gray-800">{bill.id}</td>
                    <td className="p-3 text-gray-600">{bill.date}</td>
                    <td className="p-3 text-right font-semibold text-gray-900">{inr(bill.amount)}</td>
                    <td className="p-3">
                      <Badge variant={bill.status === 'Paid' ? 'success' : 'danger'} className="text-xs">
                        {bill.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[10px] text-gray-500">
              Showing all {VENDOR_BILL_HISTORY.length} bills booked against this vendor in the current and previous
              financial years.
            </p>
          </div>
        </Modal>
      )}

      {/* Toast */}
      {notificationToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700 animate-slide-up">
          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-sm font-medium">{notificationToast}</span>
          <button onClick={() => setNotificationToast(null)} className="ml-2 text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      </div>
    </div>
  );
}

// ============================================================================
// PURCHASE ORDER & GRN COMPONENT SECTIONS & MODALS
// ============================================================================

function PurchaseOrderSection({
  orders,
  onViewPo,
  onCreateGrnForPo,
  onAddBillForPo
}: {
  orders: PurchaseOrderRecord[];
  onViewPo: (po: PurchaseOrderRecord) => void;
  onCreateGrnForPo: (po: PurchaseOrderRecord) => void;
  onAddBillForPo: (po: PurchaseOrderRecord) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            Purchase Orders (PO) Management
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Create and track formal Purchase Orders dispatched to approved vendors
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider">
                <th className="p-3 w-12 text-center">#</th>
                <th className="p-3">PO No.</th>
                <th className="p-3">Vendor Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">PO Value</th>
                <th className="p-3">Delivery By</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((po, index) => {
                const renderStatus = (s: string) => {
                  switch (s) {
                    case 'Sent':
                      return (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-3 h-3 text-emerald-600" /> Sent
                        </span>
                      );
                    case 'Draft':
                      return (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-700 border border-gray-300">
                          📝 Draft
                        </span>
                      );
                    case 'Pending':
                    default:
                      return (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" /> Pending
                        </span>
                      );
                  }
                };

                return (
                  <tr key={po.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="p-3 text-center text-gray-400 font-mono">{index + 1}</td>
                    <td className="p-3 font-mono font-medium text-blue-700">{po.poNo}</td>
                    <td className="p-3">
                      <div className="font-semibold text-gray-900">{po.vendorName}</div>
                      <div className="text-[11px] text-gray-500 font-mono">{po.vendorCode}</div>
                    </td>
                    <td className="p-3 text-gray-800 font-medium">{po.category}</td>
                    <td className="p-3 font-semibold text-gray-900">₹{po.grandTotal.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-gray-600">{po.deliveryByDate}</td>
                    <td className="p-3">{renderStatus(po.status)}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onViewPo(po)}
                          className="h-7 px-2 text-xs text-blue-600 hover:bg-blue-50"
                          title="View PO"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onCreateGrnForPo(po)}
                          className="h-7 px-2 text-xs text-purple-700 border-purple-200 hover:bg-purple-50"
                          title="Create GRN upon receipt"
                        >
                          <Package className="w-3.5 h-3.5 mr-1" /> Create GRN
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onAddBillForPo(po)}
                          className="h-7 px-2 text-xs text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                          title="Record Invoice / Voucher"
                        >
                          <Receipt className="w-3.5 h-3.5 mr-1" /> Add Bill
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function GoodsReceivedNoteSection({
  grns,
  bills,
  onCreateGrn,
  onCreateGrnForBill,
  onViewGrn,
  onViewGrnNo
}: {
  grns: GRNRecord[];
  bills: GrnPendingBill[];
  onCreateGrn: () => void;
  onCreateGrnForBill: (b: GrnPendingBill) => void;
  onViewGrn: (g: GRNRecord) => void;
  onViewGrnNo: (grnNo: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-600" />
            Goods Received Note (GRN) Management
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Physical receipt verification and damage logging for delivered items before invoice release
          </p>
        </div>
        <Button onClick={onCreateGrn} className="bg-purple-600 hover:bg-purple-700 text-white text-xs">
          <Plus className="w-4 h-4 mr-1.5" /> ➕ Create GRN
        </Button>
      </div>

      {/* Bills & invoices → goods receipt check: the receiver checks the delivery here
          and adds the GRN straight from the bill */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Package className="w-4 h-4 text-purple-600" />
            Bills &amp; Invoices — Goods Receipt Check
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            When the order arrives the receiver checks the delivery against the bill and adds the GRN here — every
            GRN stays attached to its bill / invoice
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider">
                <th className="p-3 w-12 text-center">#</th>
                <th className="p-3">Bill / Invoice</th>
                <th className="p-3">Linked PO</th>
                <th className="p-3">Vendor</th>
                <th className="p-3">Bill Amount</th>
                <th className="p-3">Goods Received On</th>
                <th className="p-3">Received By</th>
                <th className="p-3">GRN</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bills.map((b, index) => (
                <tr key={b.id} className="hover:bg-purple-50/30 transition-colors">
                  <td className="p-3 text-center text-gray-400 font-mono">{index + 1}</td>
                  <td className="p-3">
                    <div className="font-mono font-medium text-purple-700">{b.billNo}</div>
                    <div className="text-[10px] text-gray-500 font-mono">{b.vendorInvoiceNo}</div>
                  </td>
                  <td className="p-3 font-mono text-gray-700">{b.poNo}</td>
                  <td className="p-3 font-semibold text-gray-900">{b.vendorName}</td>
                  <td className="p-3 font-semibold text-gray-900">₹{b.billAmount.toLocaleString('en-IN')}</td>
                  <td className="p-3 text-gray-600">{b.receivedOn}</td>
                  <td className="p-3 text-gray-600">{b.receivedBy}</td>
                  <td className="p-3">
                    {b.grnNo ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium bg-purple-50 text-purple-700 border border-purple-200">
                        {b.grnNo}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3 h-3 text-amber-600" /> Awaiting GRN
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    {b.grnNo ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onViewGrnNo(b.grnNo as string)}
                        className="h-7 px-2 text-xs text-purple-700 hover:bg-purple-50"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" /> View GRN
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => onCreateGrnForBill(b)}
                        className="h-7 px-2 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <Plus className="w-3 h-3 mr-1" /> Create GRN
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider">
                <th className="p-3 w-12 text-center">#</th>
                <th className="p-3">GRN No.</th>
                <th className="p-3">Linked Bill</th>
                <th className="p-3">Linked PO</th>
                <th className="p-3">Vendor</th>
                <th className="p-3">Received By</th>
                <th className="p-3">Date</th>
                <th className="p-3">Condition</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {grns.map((g, index) => (
                <tr key={g.id} className="hover:bg-purple-50/30 transition-colors">
                  <td className="p-3 text-center text-gray-400 font-mono">{index + 1}</td>
                  <td className="p-3 font-mono font-medium text-purple-700">{g.grnNo}</td>
                  <td className="p-3 font-mono text-gray-700">{g.linkedBillNo || '—'}</td>
                  <td className="p-3 font-medium text-gray-800">{g.linkedPoNo}</td>
                  <td className="p-3 font-semibold text-gray-900">{g.vendorName}</td>
                  <td className="p-3 text-gray-600">{g.receivedBy}</td>
                  <td className="p-3 text-gray-600">{g.grnDate}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                      g.itemCondition === 'Good'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {g.itemCondition}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {g.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onViewGrn(g)}
                      className="h-7 px-2 text-xs text-purple-700 hover:bg-purple-50"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// MODALS FOR PO & GRN
// ----------------------------------------------------------------------------

function CreatePurchaseOrderModal({
  onClose,
  onCreate
}: {
  onClose: () => void;
  onCreate: (po: PurchaseOrderRecord) => void;
}) {
  const [vendorName, setVendorName] = useState('ABC Supplies Ltd');
  const [vendorCode, setVendorCode] = useState('VND-0045');
  const [gstin, setGstin] = useState('27AABCU9603R1ZM');
  const [contactPerson, setContactPerson] = useState('Mr. Ramesh');
  const [emailPhone, setEmailPhone] = useState('vendor@email.com / 9820011223');
  const [deliveryAddress, setDeliveryAddress] = useState(
    'XYZ Public School, 123 School Road, City — 400001'
  );
  const [deliveryByDate, setDeliveryByDate] = useState('2025-10-15');
  const [deliveryTerms, setDeliveryTerms] = useState('Doorstep delivery to science lab');
  const [paymentMode, setPaymentMode] = useState('Advance');
  const [advancePct, setAdvancePct] = useState(30);

  const [items, setItems] = useState<POItem[]>([
    { id: '1', name: 'Microscope (Lab Grade)', quantity: 10, unitRate: 7500, gstRate: 18, total: 88500 },
    { id: '2', name: 'Lab Stand & Clamp Set', quantity: 20, unitRate: 500, gstRate: 12, total: 11200 }
  ]);

  const subTotal = items.reduce((acc, it) => acc + it.quantity * it.unitRate, 0);
  const totalGst = items.reduce((acc, it) => acc + (it.quantity * it.unitRate * it.gstRate) / 100, 0);
  const grandTotal = subTotal + totalGst;
  const advanceAmount = Math.round((grandTotal * advancePct) / 100);

  const handleCreate = (status: 'Sent' | 'Draft') => {
    const poNum = `PO-2025-${String(Math.floor(100 + Math.random() * 899))}`;
    const newPo: PurchaseOrderRecord = {
      id: `po_${Date.now()}`,
      poNo: poNum,
      poDate: '27-Sep-2025',
      linkedRequest: 'EXP-REQ-002 — Lab Equipment',
      vendorId: 'v_001',
      vendorName,
      vendorCode,
      gstin,
      contactPerson,
      email: emailPhone.split('/')[0]?.trim() || 'vendor@email.com',
      phone: emailPhone.split('/')[1]?.trim() || '9820011223',
      deliveryAddress,
      deliveryByDate,
      deliveryTerms,
      category: 'Lab Equipment',
      items,
      subTotal,
      totalGst,
      grandTotal,
      paymentMode,
      advancePct,
      advanceAmount,
      terms: 'Standard school purchase terms and conditions apply.',
      status
    };
    onCreate(newPo);
  };

  return (
    <Modal isOpen onClose={onClose} title="📄 Create Purchase Order" size="lg">
      <div className="space-y-4 text-xs">
        {/* Top metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div>
            <span className="text-gray-400 block text-[10px]">PO Number:</span>
            <span className="font-mono font-semibold text-gray-800">Auto: PO-2025-001 🔒</span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px]">PO Date:</span>
            <span className="font-semibold text-gray-800">27-Sep-2025 🔒 Today</span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px]">Linked Request:</span>
            <span className="font-semibold text-blue-700">EXP-REQ-002 — Lab Equipment 🔒</span>
          </div>
        </div>

        {/* Vendor Details */}
        <div className="p-3 bg-white border border-gray-200 rounded-lg space-y-2">
          <div className="font-semibold text-gray-800 uppercase tracking-wider text-[11px]">
            VENDOR DETAILS:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-gray-600 mb-1">Vendor Name</label>
              <select
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                className="w-full p-1.5 border border-gray-300 rounded text-xs bg-white"
              >
                <option value="ABC Supplies Ltd">ABC Supplies Ltd</option>
                <option value="XYZ Stationers">XYZ Stationers</option>
                <option value="SportsPro Pvt Ltd">SportsPro Pvt Ltd</option>
                <option value="TechWorld Pvt Ltd">TechWorld Pvt Ltd</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Vendor Code</label>
              <input
                type="text"
                readOnly
                value={vendorCode}
                className="w-full p-1.5 border border-gray-300 rounded text-xs bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">GSTIN</label>
              <input
                type="text"
                readOnly
                value={gstin}
                className="w-full p-1.5 border border-gray-300 rounded text-xs bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="p-3 bg-white border border-gray-200 rounded-lg space-y-2">
          <div className="font-semibold text-gray-800 uppercase tracking-wider text-[11px]">
            DELIVERY DETAILS:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-600 mb-1">Delivery Address</label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full p-1.5 border border-gray-300 rounded text-xs"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Delivery By Date</label>
              <input
                type="date"
                value={deliveryByDate}
                onChange={(e) => setDeliveryByDate(e.target.value)}
                className="w-full p-1.5 border border-gray-300 rounded text-xs"
              />
            </div>
          </div>
        </div>

        {/* Item Details */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-100 p-2 font-bold text-gray-700">
            ITEM DETAILS (Auto-filled from Expense Request):
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-2">#</th>
                <th className="p-2">Item Name</th>
                <th className="p-2">Quantity</th>
                <th className="p-2">Unit Rate</th>
                <th className="p-2">GST %</th>
                <th className="p-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((it, idx) => (
                <tr key={it.id}>
                  <td className="p-2 text-gray-400">{idx + 1}</td>
                  <td className="p-2 font-medium text-gray-900">{it.name}</td>
                  <td className="p-2">{it.quantity}</td>
                  <td className="p-2">₹{it.unitRate.toLocaleString('en-IN')}</td>
                  <td className="p-2">{it.gstRate}%</td>
                  <td className="p-2 text-right font-semibold">₹{it.total.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-3 bg-gray-50 border-t border-gray-200 space-y-1 text-right text-xs">
            <div>Sub Total: <b className="text-gray-800">₹{subTotal.toLocaleString('en-IN')}</b></div>
            <div>Total GST: <b className="text-gray-800">₹{totalGst.toLocaleString('en-IN')}</b></div>
            <div className="text-sm font-bold text-blue-700">
              Grand Total: ₹{grandTotal.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Payment Terms */}
        <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-gray-600 mb-1">Payment Mode</label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full p-1.5 border border-gray-300 rounded text-xs bg-white"
            >
              <option value="Advance">Advance</option>
              <option value="On Delivery">On Delivery</option>
              <option value="Net-30">Net-30</option>
              <option value="Net-45">Net-45</option>
              <option value="Net-60">Net-60</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Advance %</label>
            <input
              type="number"
              value={advancePct}
              onChange={(e) => setAdvancePct(Number(e.target.value))}
              className="w-full p-1.5 border border-gray-300 rounded text-xs bg-white"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Advance Amount 🔒</label>
            <input
              type="text"
              readOnly
              value={`₹ ${advanceAmount.toLocaleString('en-IN')}`}
              className="w-full p-1.5 border border-gray-300 rounded text-xs bg-gray-100 font-semibold text-blue-800"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleCreate('Draft')}>
            💾 Save Draft
          </Button>
          <Button size="sm" onClick={() => handleCreate('Sent')} className="bg-blue-600 hover:bg-blue-700 text-white">
            ✅ Generate & Send to Vendor
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function ViewPurchaseOrderModal({
  po,
  onClose,
  onSendVendor
}: {
  po: PurchaseOrderRecord;
  onClose: () => void;
  onSendVendor: () => void;
}) {
  return (
    <Modal isOpen onClose={onClose} title={`Purchase Order — ${po.poNo}`} size="lg">
      <div className="space-y-4 text-xs">
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
          <div className="flex justify-between items-start border-b border-gray-200 pb-3">
            <div>
              <div className="text-base font-bold text-blue-900">XYZ PUBLIC SCHOOL</div>
              <div className="text-gray-500">Official Purchase Order</div>
            </div>
            <div className="text-right">
              <span className="font-mono font-bold text-sm text-gray-800">{po.poNo}</span>
              <div className="text-gray-500 text-[11px]">Date: {po.poDate}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-semibold">Vendor</span>
              <div className="font-bold text-gray-800">{po.vendorName}</div>
              <div className="text-gray-600 font-mono text-[11px]">GSTIN: {po.gstin}</div>
              <div className="text-gray-600">Contact: {po.contactPerson} ({po.phone})</div>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-semibold">Delivery To</span>
              <div className="text-gray-800">{po.deliveryAddress}</div>
              <div className="text-gray-600">Target Date: <b>{po.deliveryByDate}</b></div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-2">Item Name</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Unit Rate</th>
                <th className="p-2">GST %</th>
                <th className="p-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {po.items.map((it) => (
                <tr key={it.id}>
                  <td className="p-2 font-medium">{it.name}</td>
                  <td className="p-2">{it.quantity}</td>
                  <td className="p-2">₹{it.unitRate.toLocaleString('en-IN')}</td>
                  <td className="p-2">{it.gstRate}%</td>
                  <td className="p-2 text-right font-semibold">₹{it.total.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-2.5 bg-gray-50 border-t border-gray-200 text-right space-y-0.5">
            <div>Sub Total: ₹{po.subTotal.toLocaleString('en-IN')}</div>
            <div>Total GST: ₹{po.totalGst.toLocaleString('en-IN')}</div>
            <div className="font-bold text-sm text-blue-700">Grand Total: ₹{po.grandTotal.toLocaleString('en-IN')}</div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
          <div className="flex gap-2">
            <Button size="sm" onClick={onSendVendor} className="bg-blue-600 text-white">
              <Send className="w-3.5 h-3.5 mr-1" /> Send to Vendor
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function CreateGRNModal({
  linkedPoText,
  linkedBillNo,
  onClose,
  onCreate
}: {
  linkedPoText: string;
  linkedBillNo?: string;
  onClose: () => void;
  onCreate: (grn: GRNRecord) => void;
}) {
  const [grnDate, setGrnDate] = useState('2025-10-15');
  const [linkedPo, setLinkedPo] = useState(linkedPoText);
  const [receivedBy, setReceivedBy] = useState('Mr. Sharma — Store Keeper');
  const [department, setDepartment] = useState('Science Department');
  const [storeLocation, setStoreLocation] = useState('Main Storeroom / Science Lab');
  const [itemCondition, setItemCondition] = useState<'Good' | 'Partially Damaged' | 'Damaged'>('Partially Damaged');
  const [shortDamagedNotes, setShortDamagedNotes] = useState(
    '1 Microscope rejected — Vendor to replace or issue credit note'
  );
  const [challanNo, setChallanNo] = useState('DC-2025-99214');
  const [verifiedBy, setVerifiedBy] = useState('HOD — Ms. Joshi');
  const [status, setStatus] = useState<'Full Receipt' | 'Partial Receipt' | 'Rejected'>('Partial Receipt');

  const [items, setItems] = useState<GRNItem[]>([
    { id: '1', name: 'Microscope', poQty: 10, rcvdQty: 9, rejectedQty: 1, condition: 'Good', remarks: '1 broken eyepiece' },
    { id: '2', name: 'Lab Stand & Clamp', poQty: 20, rcvdQty: 20, rejectedQty: 0, condition: 'Good', remarks: 'All OK' }
  ]);

  const handleItemChange = (index: number, field: keyof GRNItem, val: any) => {
    const updated = [...items];
    const it = { ...updated[index], [field]: val };
    if (field === 'rcvdQty') {
      it.rejectedQty = Math.max(0, it.poQty - Number(val));
    }
    updated[index] = it;
    setItems(updated);
  };

  const handleConfirm = () => {
    const grnNum = `GRN-2025-${String(Math.floor(100 + Math.random() * 899))}`;
    const newGrn: GRNRecord = {
      id: `grn_${Date.now()}`,
      grnNo: grnNum,
      grnDate,
      linkedPoNo: linkedPo,
      linkedBillNo,
      vendorName: 'ABC Supplies Ltd',
      receivedBy,
      department,
      storeLocation,
      items,
      itemCondition,
      shortDamagedNotes,
      deliveryChallanNo: challanNo,
      verifiedBy,
      status
    };
    onCreate(newGrn);
  };

  return (
    <Modal isOpen onClose={onClose} title="📦 Create Goods Received Note (GRN)" size="lg">
      <div className="space-y-4 text-xs">
        {/* Top metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-purple-50/50 rounded-lg border border-purple-200">
          <div>
            <span className="text-gray-400 block text-[10px]">GRN Number:</span>
            <span className="font-mono font-semibold text-gray-800">Auto: GRN-2025-001 🔒</span>
          </div>
          <div>
            <label className="block text-gray-600 mb-0.5">GRN Date</label>
            <input
              type="date"
              value={grnDate}
              onChange={(e) => setGrnDate(e.target.value)}
              className="p-1 border border-gray-300 rounded text-xs"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-0.5">Linked PO</label>
            <select
              value={linkedPo}
              onChange={(e) => setLinkedPo(e.target.value)}
              className="w-full p-1 border border-gray-300 rounded text-xs bg-white"
            >
              <option value="PO-2025-001 — ABC Supplies Ltd">PO-2025-001 — ABC Supplies Ltd</option>
              <option value="PO-2025-002 — XYZ Stationers">PO-2025-002 — XYZ Stationers</option>
              <option value="PO-2025-003 — SportsPro Pvt Ltd">PO-2025-003 — SportsPro Pvt Ltd</option>
            </select>
          </div>
        </div>

        {/* Received By */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-white border border-gray-200 rounded-lg">
          <div>
            <label className="block text-gray-600 mb-1 font-medium">Received By</label>
            <select
              value={receivedBy}
              onChange={(e) => setReceivedBy(e.target.value)}
              className="w-full p-1.5 border border-gray-300 rounded text-xs bg-white"
            >
              <option value="Mr. Sharma — Store Keeper">Mr. Sharma — Store Keeper</option>
              <option value="Mr. Patel — Assistant Keeper">Mr. Patel — Assistant Keeper</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-600 mb-1 font-medium">Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full p-1.5 border border-gray-300 rounded text-xs"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1 font-medium">Store Location</label>
            <input
              type="text"
              value={storeLocation}
              onChange={(e) => setStoreLocation(e.target.value)}
              className="w-full p-1.5 border border-gray-300 rounded text-xs"
            />
          </div>
        </div>

        {/* Item verification grid */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-100 p-2 font-bold text-gray-700">ITEM RECEIPT VERIFICATION:</div>
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-2">#</th>
                <th className="p-2">Item Name</th>
                <th className="p-2">PO Qty</th>
                <th className="p-2 w-20">Rcvd Qty</th>
                <th className="p-2 w-20">Rejected</th>
                <th className="p-2">Condition</th>
                <th className="p-2">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((it, idx) => (
                <tr key={it.id}>
                  <td className="p-2 text-gray-400">{idx + 1}</td>
                  <td className="p-2 font-medium">{it.name}</td>
                  <td className="p-2">{it.poQty}</td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={it.rcvdQty}
                      onChange={(e) => handleItemChange(idx, 'rcvdQty', e.target.value)}
                      className="w-full p-1 border border-gray-300 rounded text-xs"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={it.rejectedQty}
                      onChange={(e) => handleItemChange(idx, 'rejectedQty', e.target.value)}
                      className="w-full p-1 border border-gray-300 rounded text-xs"
                    />
                  </td>
                  <td className="p-2">
                    <select
                      value={it.condition}
                      onChange={(e) => handleItemChange(idx, 'condition', e.target.value)}
                      className="p-1 border border-gray-300 rounded text-xs bg-white"
                    >
                      <option value="Good">🟢 Good</option>
                      <option value="Partially Damaged">🟡 Partially Damaged</option>
                      <option value="Damaged">🔴 Damaged</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={it.remarks}
                      onChange={(e) => handleItemChange(idx, 'remarks', e.target.value)}
                      className="w-full p-1 border border-gray-300 rounded text-xs"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Condition & Damage info */}
        <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg space-y-2">
          <div className="font-semibold text-amber-900">SHORT / DAMAGED ITEMS LOG:</div>
          <input
            type="text"
            value={shortDamagedNotes}
            onChange={(e) => setShortDamagedNotes(e.target.value)}
            className="w-full p-1.5 border border-amber-300 rounded text-xs bg-white"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-gray-600 mb-0.5">Delivery Challan No.</label>
              <input
                type="text"
                value={challanNo}
                onChange={(e) => setChallanNo(e.target.value)}
                className="w-full p-1.5 border border-gray-300 rounded text-xs"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-0.5">Verified By</label>
              <input
                type="text"
                value={verifiedBy}
                onChange={(e) => setVerifiedBy(e.target.value)}
                className="w-full p-1.5 border border-gray-300 rounded text-xs"
              />
            </div>
          </div>
        </div>

        {/* Status choices */}
        <div className="flex items-center gap-4 p-2.5 bg-gray-50 border border-gray-200 rounded-lg">
          <span className="font-semibold text-gray-700">GRN Status:</span>
          {(['Full Receipt', 'Partial Receipt', 'Rejected'] as const).map((st) => (
            <label key={st} className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="grnStatus"
                checked={status === st}
                onChange={() => setStatus(st)}
              />
              <span>{st}</span>
            </label>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>
            💾 Save Draft
          </Button>
          <Button size="sm" onClick={handleConfirm} className="bg-purple-600 hover:bg-purple-700 text-white">
            ✅ Confirm GRN
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function ViewGRNModal({
  grn,
  onClose
}: {
  grn: GRNRecord;
  onClose: () => void;
}) {
  return (
    <Modal isOpen onClose={onClose} title={`Goods Received Note — ${grn.grnNo}`} size="md">
      <div className="space-y-4 text-xs">
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg space-y-1">
          <div className="flex justify-between font-bold text-gray-800">
            <span>{grn.grnNo}</span>
            <span>{grn.grnDate}</span>
          </div>
          <div>Linked PO: <b>{grn.linkedPoNo}</b></div>
          <div>Vendor: <b>{grn.vendorName}</b></div>
          <div>Challan No: <b className="font-mono">{grn.deliveryChallanNo}</b></div>
          <div>Received By: {grn.receivedBy}</div>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-2">Item</th>
                <th className="p-2">PO Qty</th>
                <th className="p-2">Received</th>
                <th className="p-2">Rejected</th>
                <th className="p-2">Condition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {grn.items.map((it) => (
                <tr key={it.id}>
                  <td className="p-2 font-medium">{it.name}</td>
                  <td className="p-2">{it.poQty}</td>
                  <td className="p-2 font-semibold text-emerald-700">{it.rcvdQty}</td>
                  <td className="p-2 text-rose-700 font-semibold">{it.rejectedQty}</td>
                  <td className="p-2">{it.condition}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {grn.shortDamagedNotes && (
          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-amber-800">
            <b>Discrepancy Notes:</b> {grn.shortDamagedNotes}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
