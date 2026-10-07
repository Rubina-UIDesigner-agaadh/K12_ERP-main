import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Settings2,
  Check,
  X,
  Info,
  ShieldCheck,
  Percent,
  Eye,
  Download,
  Upload,
  RefreshCw,
  Filter,
  MoreVertical,
  Copy,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronRight,
  ChevronDown,
  Database,
  Zap,
  Lightbulb,
  Target,
  Layers,
  BookOpen,
  Settings,
  FileText,
  Calculator,
  DollarSign,
  Users,
  Building,
  Calendar,
  Clock,
  Tag,
  Hash,
  ToggleLeft,
  ToggleRight,
  Link,
  Unlink,
  ArrowUpDown,
  GraduationCap,
  Briefcase,
  BookX,
  Beaker,
  Car,
  Shirt,
  Award,
  FileWarning,
  CreditCard,
  Wallet,
  Receipt,
  PieChart,
  BarChart3,
  Activity,
  AlertTriangle,
  HelpCircle,
  Save,
  Loader2 } from
'lucide-react';

// Types
export interface ChargeHead {
  id: string;
  name: string;
  code: string;
  description: string;
  category: 'Income' | 'Liability' | 'Expense';
  chargeType: string;
  defaultAmount: number;
  isVariable: boolean;
  minAmount?: number;
  maxAmount?: number;
  isRefundable: boolean;
  isTaxable: boolean;
  taxPercent: number;
  taxType?: string;
  applicableTo: 'Students' | 'Staff' | 'Both';
  applicableClasses: string[];
  frequency: 'One-time' | 'Monthly' | 'Quarterly' | 'Annual' | 'As Required';
  glAccountCode: string;
  glAccountName: string;
  isActive: boolean;
  requiresApproval: boolean;
  approvalLimit?: number;
  createdBy: string;
  createdOn: string;
  modifiedBy?: string;
  modifiedOn?: string;
  usageCount: number;
  totalCollected: number;
  icon: any;
}

interface InfoPanelData {
  id: string;
  title: string;
  description: string;
  dataSource: {
    title: string;
    description: string;
    tables?: string[];
  };
  whyItMatters: {
    title: string;
    description: string;
    benefits?: string[];
  };
  recommendedActions: {
    label: string;
    description: string;
  }[];
}

// Charge Types
const chargeTypes = [
{ value: 'library', label: 'Library Related', icon: BookX },
{ value: 'lab', label: 'Lab & Equipment', icon: Beaker },
{ value: 'transport', label: 'Transport', icon: Car },
{ value: 'uniform', label: 'Uniform & ID', icon: Shirt },
{ value: 'certificate', label: 'Certificates & Documents', icon: FileText },
{ value: 'discipline', label: 'Discipline & Fines', icon: AlertTriangle },
{ value: 'property', label: 'Property & Infrastructure', icon: Building },
{ value: 'activity', label: 'Activities & Events', icon: Award },
{ value: 'deposit', label: 'Deposits & Caution', icon: Wallet },
{ value: 'misc', label: 'Miscellaneous', icon: FileWarning }];


// Classes
const classes = [
'Nursery', 'LKG', 'UKG',
'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
'Class 11', 'Class 12'];


// Tax Types
const taxTypes = [
{ value: 'gst', label: 'GST' },
{ value: 'vat', label: 'VAT' },
{ value: 'service_tax', label: 'Service Tax' },
{ value: 'cess', label: 'Education Cess' }];


// Info Panel Data
const infoPanelData: Record<string, InfoPanelData> = {
  chargeMaster: {
    id: 'chargeMaster',
    title: 'Charge Master Overview',
    description: 'The Charge Master is the central repository for ad-hoc fees, penalties, and deposits. Each charge head records its name, free-text type, applicability, refundability, tax settings, and status.',
    dataSource: {
      title: 'Data Source',
      description: 'Charge definitions are maintained in the charge master and used when applying charges to student or staff accounts.',
      tables: ['charge_master', 'tax_configuration']
    },
    whyItMatters: {
      title: 'Why It Matters',
      description: 'Properly configured charge heads ensure consistent billing, accurate financial reporting, and compliance with accounting standards.',
      benefits: [
      'Standardized charge application',
      'Accurate tax calculation',
      'Consistent reporting',
      'Audit compliance']

    },
    recommendedActions: [
    { label: 'Review Active Charges', description: 'Audit charge heads periodically' },
    { label: 'Update Tax Rates', description: 'Keep tax percentages current' },
    { label: 'Review Applicability', description: 'Confirm student and staff charge rules' }]

  },

};

// Mock Charge Master Data
const mockChargeData: ChargeHead[] = [
{
  id: '1',
  name: 'Library Fine (Per Day)',
  code: 'LIB-FINE-01',
  description: 'Late return fine for library books, charged per day of delay',
  category: 'Income',
  chargeType: 'library',
  defaultAmount: 5,
  isVariable: false,
  isRefundable: false,
  isTaxable: false,
  taxPercent: 0,
  applicableTo: 'Both',
  applicableClasses: classes,
  frequency: 'As Required',
  glAccountCode: '4001',
  glAccountName: 'Library Income',
  isActive: true,
  requiresApproval: false,
  createdBy: 'Admin',
  createdOn: '2024-01-15',
  usageCount: 1250,
  totalCollected: 48500,
  icon: BookX
},
{
  id: '2',
  name: 'ID Card Replacement',
  code: 'IDR-001',
  description: 'Fee for issuing duplicate/replacement ID card',
  category: 'Income',
  chargeType: 'uniform',
  defaultAmount: 250,
  isVariable: false,
  isRefundable: false,
  isTaxable: true,
  taxPercent: 18,
  taxType: 'gst',
  applicableTo: 'Both',
  applicableClasses: classes,
  frequency: 'As Required',
  glAccountCode: '4002',
  glAccountName: 'Misc. Fee Income',
  isActive: true,
  requiresApproval: false,
  createdBy: 'Admin',
  createdOn: '2024-01-15',
  usageCount: 85,
  totalCollected: 21250,
  icon: Shirt
},
{
  id: '3',
  name: 'Lab Caution Deposit',
  code: 'LAB-DEP-01',
  description: 'Refundable security deposit for lab equipment usage',
  category: 'Liability',
  chargeType: 'deposit',
  defaultAmount: 5000,
  isVariable: false,
  isRefundable: true,
  isTaxable: false,
  taxPercent: 0,
  applicableTo: 'Students',
  applicableClasses: ['Class 9', 'Class 10', 'Class 11', 'Class 12'],
  frequency: 'Annual',
  glAccountCode: '2001',
  glAccountName: 'Student Deposits Payable',
  isActive: true,
  requiresApproval: true,
  approvalLimit: 10000,
  createdBy: 'Admin',
  createdOn: '2024-01-10',
  usageCount: 320,
  totalCollected: 1600000,
  icon: Wallet
},
{
  id: '4',
  name: 'Lab Equipment Breakage',
  code: 'LAB-BRK-01',
  description: 'Charge for damaged or broken lab equipment',
  category: 'Income',
  chargeType: 'lab',
  defaultAmount: 0,
  isVariable: true,
  minAmount: 100,
  maxAmount: 50000,
  isRefundable: false,
  isTaxable: true,
  taxPercent: 18,
  taxType: 'gst',
  applicableTo: 'Both',
  applicableClasses: classes,
  frequency: 'As Required',
  glAccountCode: '4003',
  glAccountName: 'Damage Recovery Income',
  isActive: true,
  requiresApproval: true,
  approvalLimit: 5000,
  createdBy: 'Lab Incharge',
  createdOn: '2024-02-01',
  modifiedBy: 'Admin',
  modifiedOn: '2024-03-10',
  usageCount: 45,
  totalCollected: 125000,
  icon: Beaker
},
{
  id: '5',
  name: 'Transfer Certificate Fee',
  code: 'TC-FEE-01',
  description: 'Processing fee for issuing Transfer Certificate',
  category: 'Income',
  chargeType: 'certificate',
  defaultAmount: 500,
  isVariable: false,
  isRefundable: false,
  isTaxable: false,
  taxPercent: 0,
  applicableTo: 'Students',
  applicableClasses: classes,
  frequency: 'One-time',
  glAccountCode: '4004',
  glAccountName: 'Certificate Fee Income',
  isActive: true,
  requiresApproval: false,
  createdBy: 'Admin',
  createdOn: '2024-01-05',
  usageCount: 150,
  totalCollected: 75000,
  icon: FileText
},
{
  id: '6',
  name: 'Discipline Fine',
  code: 'DISC-FINE-01',
  description: 'Penalty for violation of school discipline rules',
  category: 'Income',
  chargeType: 'discipline',
  defaultAmount: 0,
  isVariable: true,
  minAmount: 100,
  maxAmount: 10000,
  isRefundable: false,
  isTaxable: false,
  taxPercent: 0,
  applicableTo: 'Students',
  applicableClasses: classes,
  frequency: 'As Required',
  glAccountCode: '4005',
  glAccountName: 'Fine Income',
  isActive: true,
  requiresApproval: true,
  approvalLimit: 1000,
  createdBy: 'Principal',
  createdOn: '2024-01-20',
  usageCount: 28,
  totalCollected: 42000,
  icon: AlertTriangle
},
{
  id: '7',
  name: 'Transport Damage',
  code: 'TRN-DMG-01',
  description: 'Charge for damage caused to school transport vehicle',
  category: 'Income',
  chargeType: 'transport',
  defaultAmount: 0,
  isVariable: true,
  minAmount: 500,
  maxAmount: 25000,
  isRefundable: false,
  isTaxable: true,
  taxPercent: 18,
  taxType: 'gst',
  applicableTo: 'Students',
  applicableClasses: classes,
  frequency: 'As Required',
  glAccountCode: '4006',
  glAccountName: 'Transport Recovery Income',
  isActive: true,
  requiresApproval: true,
  approvalLimit: 5000,
  createdBy: 'Transport Manager',
  createdOn: '2024-02-15',
  usageCount: 12,
  totalCollected: 85000,
  icon: Car
},
{
  id: '8',
  name: 'Duplicate Marksheet',
  code: 'DUP-MS-01',
  description: 'Fee for issuing duplicate marksheet/report card',
  category: 'Income',
  chargeType: 'certificate',
  defaultAmount: 200,
  isVariable: false,
  isRefundable: false,
  isTaxable: false,
  taxPercent: 0,
  applicableTo: 'Students',
  applicableClasses: classes,
  frequency: 'As Required',
  glAccountCode: '4004',
  glAccountName: 'Certificate Fee Income',
  isActive: true,
  requiresApproval: false,
  createdBy: 'Admin',
  createdOn: '2024-01-05',
  usageCount: 65,
  totalCollected: 13000,
  icon: FileText
},
{
  id: '9',
  name: 'Library Deposit',
  code: 'LIB-DEP-01',
  description: 'Refundable security deposit for library membership',
  category: 'Liability',
  chargeType: 'deposit',
  defaultAmount: 1000,
  isVariable: false,
  isRefundable: true,
  isTaxable: false,
  taxPercent: 0,
  applicableTo: 'Both',
  applicableClasses: classes,
  frequency: 'One-time',
  glAccountCode: '2002',
  glAccountName: 'Library Deposits Payable',
  isActive: true,
  requiresApproval: false,
  createdBy: 'Librarian',
  createdOn: '2024-01-08',
  usageCount: 850,
  totalCollected: 850000,
  icon: BookX
},
{
  id: '10',
  name: 'Uniform Set (Additional)',
  code: 'UNI-ADD-01',
  description: 'Charge for additional uniform set purchase',
  category: 'Income',
  chargeType: 'uniform',
  defaultAmount: 2500,
  isVariable: false,
  isRefundable: false,
  isTaxable: true,
  taxPercent: 5,
  taxType: 'gst',
  applicableTo: 'Students',
  applicableClasses: classes,
  frequency: 'As Required',
  glAccountCode: '4007',
  glAccountName: 'Uniform Sales Income',
  isActive: false,
  requiresApproval: false,
  createdBy: 'Admin',
  createdOn: '2024-01-25',
  usageCount: 0,
  totalCollected: 0,
  icon: Shirt
}];

// Shared in-memory charge-head store (mock data, no backend). Charge Receipt → "Add New Charge"
// reads this list, so heads created / edited / imported here are offered there until the page reloads.
let chargeHeadStore: ChargeHead[] = mockChargeData;
export function getChargeHeads(): ChargeHead[] {
  return chargeHeadStore;
}

const CURRENT_USER = 'Admin';
const CATEGORY_LABEL: Record<string, ChargeHead['category']> = { income: 'Income', liability: 'Liability', expense: 'Expense' };
const APPLICABLE_LABEL: Record<string, ChargeHead['applicableTo']> = { students: 'Students', staff: 'Staff', both: 'Both' };
const FREQUENCY_LABEL: Record<string, ChargeHead['frequency']> = {
  'one-time': 'One-time',
  as_required: 'As Required',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  annual: 'Annual'
};
const CSV_HEADERS = [
'Code', 'Name', 'Description', 'Category', 'Type', 'Default Amount', 'Variable', 'Min Amount', 'Max Amount',
'Refundable', 'Taxable', 'Tax Type', 'Tax %', 'Applicable To', 'Classes', 'Frequency', 'GL Code', 'GL Name',
'Requires Approval', 'Approval Limit', 'Active', 'Usage Count', 'Total Collected'];

const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const csvCell = (v: unknown) => {
  const t = v === undefined || v === null ? '' : String(v);
  return /[",\n\r]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
};
const toCsv = (rows: unknown[][]) => rows.map((r) => r.map(csvCell).join(',')).join('\n');
function downloadFile(name: string, content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
// Minimal CSV parser (quoted values, commas and line breaks inside quotes)
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  const src = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"' && src[i + 1] === '"') {cell += '"';i++;} else
      if (ch === '"') quoted = false;else
      cell += ch;
    } else if (ch === '"') quoted = true;else
    if (ch === ',') {row.push(cell);cell = '';} else
    if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && src[i + 1] === '\n') i++;
      row.push(cell);rows.push(row);row = [];cell = '';
    } else cell += ch;
  }
  if (cell !== '' || row.length) {row.push(cell);rows.push(row);}
  return rows.filter((r) => r.some((c) => c.trim() !== ''));
}
const isYes = (v: string) => /^(y|yes|true|1)$/i.test(v.trim());


// Info Panel Modal
interface InfoPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: InfoPanelData | null;
}

const InfoPanelModal: React.FC<InfoPanelModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-start rounded-t-2xl">
          <div className="flex-1 pr-4">
            <h2 className="text-xl font-semibold text-gray-900">{data.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors">

            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-gray-600 leading-relaxed">{data.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Database className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-blue-900 text-sm uppercase">
                  {data.dataSource.title}
                </h3>
              </div>
              <p className="text-sm text-blue-800 leading-relaxed mb-3">
                {data.dataSource.description}
              </p>
              {data.dataSource.tables &&
              <div className="flex flex-wrap gap-2">
                  {data.dataSource.tables.map((table, idx) =>
                <span
                  key={idx}
                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">

                      {table}
                    </span>
                )}
                </div>
              }
            </div>

            <div className="bg-purple-50 border border-purple-100 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-purple-900 text-sm uppercase">
                  {data.whyItMatters.title}
                </h3>
              </div>
              <p className="text-sm text-purple-800 leading-relaxed mb-3">
                {data.whyItMatters.description}
              </p>
              {data.whyItMatters.benefits &&
              <ul className="space-y-1">
                  {data.whyItMatters.benefits.map((benefit, idx) =>
                <li key={idx} className="flex items-center gap-2 text-xs text-purple-700">
                      <CheckCircle className="w-3 h-3 text-purple-500" />
                      {benefit}
                    </li>
                )}
                </ul>
              }
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <h3 className="font-semibold text-gray-700 text-sm uppercase">Recommended Actions</h3>
            </div>
            <div className="space-y-2">
              {data.recommendedActions.map((action, idx) =>
              <div
                key={idx}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg">

                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-900">{action.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{action.description}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 p-4 flex justify-end gap-3 rounded-b-2xl">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>);

};

// Info Button
const InfoButton: React.FC<{onClick: () => void;}> = ({ onClick }) =>
<button
  onClick={(e) => {
    e.stopPropagation();
    onClick();
  }}
  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
  title="View Details">

    <Info className="w-4 h-4 text-gray-400 hover:text-blue-600" />
  </button>;


export function ChargeMaster() {
  // State
  const [showModal, setShowModal] = useState(false);
  const [editingCharge, setEditingCharge] = useState<ChargeHead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [infoPanelOpen, setInfoPanelOpen] = useState(false);
  const [selectedInfoPanel, setSelectedInfoPanel] = useState<InfoPanelData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [charges, setCharges] = useState<ChargeHead[]>(() => getChargeHeads());
  const [formError, setFormError] = useState('');
  const importInputRef = useRef<HTMLInputElement>(null);

  // Keep the shared store in sync so Charge Receipt ("Add New Charge") sees the latest heads
  useEffect(() => {
    chargeHeadStore = charges;
  }, [charges]);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    category: 'income',
    chargeType: 'General',
    defaultAmount: '',
    isVariable: false,
    minAmount: '',
    maxAmount: '',
    isRefundable: false,
    isTaxable: false,
    taxPercent: '',
    taxType: 'gst',
    applicableTo: 'both',
    applicableClasses: [] as string[],
    frequency: 'as_required',
    glAccountCode: '',
    glAccountName: '',
    requiresApproval: false,
    approvalLimit: '',
    isActive: true
  });

  // Filter charges
  const filteredCharges = useMemo(() => {
    return charges.filter((charge) => {
      if (searchTerm && !charge.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !charge.code.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      if (categoryFilter !== 'all' && charge.category.toLowerCase() !== categoryFilter) {
        return false;
      }
      if (typeFilter !== 'all' && charge.chargeType !== typeFilter) {
        return false;
      }
      if (statusFilter === 'active' && !charge.isActive) return false;
      if (statusFilter === 'inactive' && charge.isActive) return false;
      return true;
    });
  }, [charges, searchTerm, categoryFilter, typeFilter, statusFilter]);

  // Open info panel
  const openInfoPanel = (panelId: string) => {
    const data = infoPanelData[panelId];
    if (data) {
      setSelectedInfoPanel(data);
      setInfoPanelOpen(true);
    }
  };

  // Form values from an existing charge head (used by Edit and Copy)
  const formFromCharge = (charge: ChargeHead) => ({
      name: charge.name,
      code: charge.code,
      description: charge.description,
      category: charge.category.toLowerCase(),
      chargeType: chargeTypes.find((t) => t.value === charge.chargeType)?.label || charge.chargeType,
      defaultAmount: String(charge.defaultAmount),
      isVariable: charge.isVariable,
      minAmount: charge.minAmount ? String(charge.minAmount) : '',
      maxAmount: charge.maxAmount ? String(charge.maxAmount) : '',
      isRefundable: charge.isRefundable,
      isTaxable: charge.isTaxable,
      taxPercent: String(charge.taxPercent),
      taxType: charge.taxType || 'gst',
      applicableTo: charge.applicableTo.toLowerCase(),
      applicableClasses: charge.applicableClasses,
      frequency: charge.frequency.toLowerCase().replace(' ', '_'),
      glAccountCode: charge.glAccountCode,
      glAccountName: charge.glAccountName,
      requiresApproval: charge.requiresApproval,
      approvalLimit: charge.approvalLimit ? String(charge.approvalLimit) : '',
      isActive: charge.isActive
    });

  // Handle edit
  const handleEdit = (charge: ChargeHead) => {
    setEditingCharge(charge);
    setFormError('');
    setFormData(formFromCharge(charge));
    setShowModal(true);
  };

  // Copy → opens the form pre-filled as a NEW charge head
  const handleCopy = (charge: ChargeHead) => {
    let code = `${charge.code}-COPY`;
    let n = 2;
    while (charges.some((c) => c.code === code)) code = `${charge.code}-COPY${n++}`;
    setEditingCharge(null);
    setFormError('');
    setFormData({ ...formFromCharge(charge), name: `${charge.name} (Copy)`, code });
    setShowModal(true);
  };

  // Delete (mock data — removed from the list for this session)
  const handleDelete = (charge: ChargeHead) => {
    const note = charge.usageCount > 0 ?
    `\n\nIt has been applied ${charge.usageCount} time(s); existing receipts keep their history.` :
    '';
    if (!confirm(`Delete charge head "${charge.name}" (${charge.code})?${note}`)) return;
    setCharges((prev) => prev.filter((c) => c.id !== charge.id));
    if (expandedRow === charge.id) setExpandedRow(null);
  };



  // Export the filtered charge heads (same columns Import accepts)
  const handleExport = () => {
    const rows = filteredCharges.map((c) => [
    c.code, c.name, c.description, c.category,
    chargeTypes.find((t) => t.value === c.chargeType)?.label || c.chargeType,
    c.defaultAmount, c.isVariable ? 'Yes' : 'No', c.minAmount ?? '', c.maxAmount ?? '',
    c.isRefundable ? 'Yes' : 'No', c.isTaxable ? 'Yes' : 'No', c.taxType ? c.taxType.toUpperCase() : '', c.taxPercent,
    c.applicableTo, c.applicableClasses.length === classes.length ? 'All' : c.applicableClasses.join('; '),
    c.frequency, c.glAccountCode, c.glAccountName, c.requiresApproval ? 'Yes' : 'No', c.approvalLimit ?? '',
    c.isActive ? 'Yes' : 'No', c.usageCount, c.totalCollected]);
    downloadFile(`charge-master-${todayIso()}.csv`, toCsv([CSV_HEADERS, ...rows]));
  };

  // Import a CSV (Export format). Rows with an existing Code update that head, new Codes are added.
  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!/\.csv$/i.test(file.name)) {
      alert('Please choose a .csv file (use Export to get the expected format).');
      return;
    }
    const text = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    }).catch(() => '');
    const rows = parseCsv(text);
    const header = (rows[0] || []).map((h) => h.trim().toLowerCase());
    if (!header.includes('code') || !header.includes('name')) {
      alert('The file must have "Code" and "Name" columns (use Export to get the expected format).');
      return;
    }
    const get = (row: string[], name: string) => {
      const i = header.indexOf(name.toLowerCase());
      return i >= 0 ? (row[i] ?? '').trim() : '';
    };
    const num = (v: string, fallback: number) => v !== '' && !isNaN(Number(v)) ? Number(v) : fallback;
    const bool = (v: string, fallback: boolean) => v === '' ? fallback : isYes(v);
    let next = [...charges];
    const addedIds: string[] = [];
    const updatedIds: string[] = [];
    const skipped: number[] = [];
    rows.slice(1).forEach((row, i) => {
      const code = get(row, 'Code').toUpperCase();
      const name = get(row, 'Name');
      const existing = next.find((c) => c.code === code);
      if (!code || !name && !existing) {
        skipped.push(i + 2);
        return;
      }
      const base: ChargeHead = existing || {
        id: `CH-${Date.now()}-${i}`, name, code, description: '', category: 'Income', chargeType: 'misc',
        defaultAmount: 0, isVariable: false, isRefundable: false, isTaxable: false, taxPercent: 0,
        applicableTo: 'Both', applicableClasses: [...classes], frequency: 'As Required', glAccountCode: '',
        glAccountName: '', isActive: true, requiresApproval: false, createdBy: CURRENT_USER, createdOn: todayIso(),
        usageCount: 0, totalCollected: 0, icon: FileWarning
      };
      const typeText = get(row, 'Type').toLowerCase();
      const type = chargeTypes.find((t) => t.value === typeText || t.label.toLowerCase() === typeText)?.value || get(row, 'Type') || base.chargeType;
      const taxText = get(row, 'Tax Type').toLowerCase();
      const classText = get(row, 'Classes');
      const head: ChargeHead = {
        ...base,
        name: name || base.name,
        description: get(row, 'Description') || base.description,
        category: CATEGORY_LABEL[get(row, 'Category').toLowerCase()] || base.category,
        chargeType: type,
        defaultAmount: num(get(row, 'Default Amount'), base.defaultAmount),
        isVariable: bool(get(row, 'Variable'), base.isVariable),
        minAmount: get(row, 'Min Amount') ? num(get(row, 'Min Amount'), 0) : base.minAmount,
        maxAmount: get(row, 'Max Amount') ? num(get(row, 'Max Amount'), 0) : base.maxAmount,
        isRefundable: bool(get(row, 'Refundable'), base.isRefundable),
        isTaxable: bool(get(row, 'Taxable'), base.isTaxable),
        taxType: taxTypes.find((t) => t.value === taxText || t.label.toLowerCase() === taxText)?.value || base.taxType,
        taxPercent: num(get(row, 'Tax %'), base.taxPercent),
        applicableTo: APPLICABLE_LABEL[get(row, 'Applicable To').toLowerCase()] || base.applicableTo,
        applicableClasses: !classText ? base.applicableClasses : classText.toLowerCase() === 'all' ? [...classes] :
        classText.split(/[;|]/).map((c) => c.trim()).filter((c) => classes.includes(c)),
        frequency: FREQUENCY_LABEL[get(row, 'Frequency').toLowerCase().replace(/\s+/g, '_')] || base.frequency,
        glAccountCode: get(row, 'GL Code') || base.glAccountCode,
        glAccountName: get(row, 'GL Name') || base.glAccountName,
        requiresApproval: bool(get(row, 'Requires Approval'), base.requiresApproval),
        approvalLimit: get(row, 'Approval Limit') ? num(get(row, 'Approval Limit'), 0) : base.approvalLimit,
        isActive: bool(get(row, 'Active'), base.isActive),
        icon: chargeTypes.find((t) => t.value === type)?.icon || base.icon,
        modifiedBy: existing ? CURRENT_USER : base.modifiedBy,
        modifiedOn: existing ? todayIso() : base.modifiedOn
      };
      if (existing) {
        next = next.map((c) => c.id === existing.id ? head : c);
        updatedIds.push(head.id);
      } else {
        next = [head, ...next];
        addedIds.push(head.id);
      }
    });
    setCharges(next);
    alert(
      `Import complete: ${addedIds.length} added, ${updatedIds.length} updated` + (
      skipped.length ? `, ${skipped.length} skipped (row ${skipped.join(', ')}: Code and Name are required)` : '') +
      '.'
    );
  };



  // Handle save — validates, then creates or updates the charge head in the list
  const handleSave = () => {
    const f = formData;
    const code = f.code.trim().toUpperCase();
    const tax = Number(f.taxPercent);
    let error = '';
    if (!f.name.trim()) error = 'Charge name is required.';else
    if (!code) error = 'Short code is required.';else
    if (charges.some((c) => c.code === code && c.id !== editingCharge?.id)) error = `Short code ${code} is already used by another charge head.`;else
    if (!f.chargeType.trim()) error = 'Charge type is required.';else
    if (f.isTaxable && !(tax > 0 && tax <= 100)) error = 'Tax percentage must be between 0 and 100.';else
    
    setFormError(error);
    if (error) return;

    setIsSaving(true);
    const wasEditing = editingCharge;
    setTimeout(() => {
      const now = todayIso();
      const head: ChargeHead = {
        id: wasEditing ? wasEditing.id : `CH-${Date.now()}`,
        name: f.name.trim(),
        code,
        description: f.description.trim(),
        category: wasEditing ? wasEditing.category : 'Income',
        chargeType: f.chargeType.trim(),
        defaultAmount: wasEditing ? wasEditing.defaultAmount : 0,
        isVariable: wasEditing ? wasEditing.isVariable : false,
        minAmount: wasEditing ? wasEditing.minAmount : undefined,
        maxAmount: wasEditing ? wasEditing.maxAmount : undefined,
        isRefundable: f.isRefundable,
        isTaxable: f.isTaxable,
        taxPercent: f.isTaxable ? tax : 0,
        taxType: f.isTaxable ? f.taxType : undefined,
        applicableTo: APPLICABLE_LABEL[f.applicableTo] || 'Both',
        applicableClasses: f.applicableTo === 'staff' ? [] : f.applicableClasses.length ? f.applicableClasses : [...classes],
        frequency: FREQUENCY_LABEL[f.frequency] || 'As Required',
        glAccountCode: wasEditing ? wasEditing.glAccountCode : '',
        glAccountName: wasEditing ? wasEditing.glAccountName : '',
        isActive: f.isActive,
        requiresApproval: wasEditing ? wasEditing.requiresApproval : false,
        approvalLimit: wasEditing ? wasEditing.approvalLimit : undefined,
        createdBy: wasEditing ? wasEditing.createdBy : CURRENT_USER,
        createdOn: wasEditing ? wasEditing.createdOn : now,
        modifiedBy: wasEditing ? CURRENT_USER : undefined,
        modifiedOn: wasEditing ? now : undefined,
        usageCount: wasEditing ? wasEditing.usageCount : 0,
        totalCollected: wasEditing ? wasEditing.totalCollected : 0,
        icon: chargeTypes.find((t) => t.value === f.chargeType || t.label.toLowerCase() === f.chargeType.trim().toLowerCase())?.icon || FileWarning
      };
      setCharges((prev) => wasEditing ? prev.map((c) => c.id === head.id ? head : c) : [head, ...prev]);
      setIsSaving(false);
      setShowModal(false);
      setEditingCharge(null);
      resetForm();
      alert(wasEditing ? 'Charge updated successfully!' : 'New charge created successfully!');
    }, 600);
  };

  // Reset form
  const resetForm = () => {
    setFormError('');
    setFormData({
      name: '',
      code: '',
      description: '',
      category: 'income',
      chargeType: 'General',
      defaultAmount: '',
      isVariable: false,
      minAmount: '',
      maxAmount: '',
      isRefundable: false,
      isTaxable: false,
      taxPercent: '',
      taxType: 'gst',
      applicableTo: 'both',
      applicableClasses: [],
      frequency: 'as_required',
      glAccountCode: '',
      glAccountName: '',
      requiresApproval: false,
      approvalLimit: '',
      isActive: true
    });
  };

  // Toggle class selection
  const toggleClass = (cls: string) => {
    setFormData((prev) => ({
      ...prev,
      applicableClasses: prev.applicableClasses.includes(cls) ?
      prev.applicableClasses.filter((c) => c !== cls) :
      [...prev.applicableClasses, cls]
    }));
  };

  // Select all classes
  const selectAllClasses = () => {
    setFormData((prev) => ({
      ...prev,
      applicableClasses: prev.applicableClasses.length === classes.length ? [] : [...classes]
    }));
  };

  // Get category badge
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Income':
        return <Badge variant="success">{category}</Badge>;
      case 'Liability':
        return <Badge variant="warning">{category}</Badge>;
      case 'Expense':
        return <Badge variant="danger">{category}</Badge>;
      default:
        return <Badge>{category}</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Info Panel Modal */}
      <InfoPanelModal
        isOpen={infoPanelOpen}
        onClose={() => setInfoPanelOpen(false)}
        data={selectedInfoPanel} />


      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-2xl font-medium text-gray-900 flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Layers className="w-6 h-6 text-purple-600" />
              </div>
              Charge Master
            </h1>
            <p className="text-gray-500 mt-1">
              Define and manage ad-hoc fee heads, penalties, and deposit charges
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" onClick={() => importInputRef.current?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <input
              ref={importInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              data-testid="charge-master-import"
              onChange={handleImportFile} />

            <Button variant="primary" onClick={() => {resetForm();setEditingCharge(null);setShowModal(true);}}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Charge
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or code..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} />

            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={[
              { value: 'all', label: 'All Categories' },
              { value: 'income', label: 'Income' },
              { value: 'liability', label: 'Liability' },
              { value: 'expense', label: 'Expense' }]
              } />

            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={[
              { value: 'all', label: 'All Types' },
              ...Array.from(new Set(charges.map((c) => c.chargeType))).map((value) => ({ value, label: chargeTypes.find((t) => t.value === value)?.label || value }))]
              } />

            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
              { value: 'all', label: 'All Status' },
              { value: 'active', label: 'Active Only' },
              { value: 'inactive', label: 'Inactive Only' }]
              } />

            <InfoButton onClick={() => openInfoPanel('chargeMaster')} />
          </div>
        </div>
      </Card>

      {/* Charge List */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Charge Head</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Category</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Type</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Refundable</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Tax</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCharges.map((charge) =>
              <React.Fragment key={charge.id}>
                  <tr
                  className={`hover:bg-gray-50 cursor-pointer ${expandedRow === charge.id ? 'bg-purple-50' : ''}`}
                  onClick={() => setExpandedRow(expandedRow === charge.id ? null : charge.id)}>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${charge.isActive ? 'bg-purple-100' : 'bg-gray-100'}`}>
                          <charge.icon className={`w-4 h-4 ${charge.isActive ? 'text-purple-600' : 'text-gray-400'}`} />
                        </div>
                        <div>
                          <p className={`font-medium ${charge.isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                            {charge.name}
                          </p>
                          <p className="text-xs text-gray-500 font-mono">{charge.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getCategoryBadge(charge.category)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {chargeTypes.find((t) => t.value === charge.chargeType)?.label || charge.chargeType}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      {charge.isRefundable ?
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" /> :

                    <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
                    }
                    </td>
                    <td className="px-6 py-4 text-center">
                      {charge.isTaxable ?
                    <Badge variant="info">{charge.taxPercent}% {charge.taxType?.toUpperCase()}</Badge> :

                    <span className="text-xs text-gray-400">Exempt</span>
                    }
                    </td>
                    <td className="px-6 py-4 text-center">
                      {charge.isActive ?
                    <Badge variant="success">Active</Badge> :

                    <Badge variant="danger">Inactive</Badge>
                    }
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" title="Edit charge" onClick={() => handleEdit(charge)}>
                          <Edit2 className="w-4 h-4 text-gray-600" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Copy as new charge" onClick={() => handleCopy(charge)}>
                          <Copy className="w-4 h-4 text-gray-600" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Delete charge" onClick={() => handleDelete(charge)}>
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title={expandedRow === charge.id ? 'Hide details' : 'Show details'}
                          onClick={() => setExpandedRow(expandedRow === charge.id ? null : charge.id)}>
                          {expandedRow === charge.id ?
                        <ChevronDown className="w-4 h-4 text-gray-400" /> :

                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        }
                        </Button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Row */}
                  {expandedRow === charge.id &&
                <tr className="bg-gray-50">
                      <td colSpan={7} className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <p className="text-xs text-gray-500 uppercase mb-1">Description</p>
                            <p className="text-sm text-gray-700">{charge.description || '—'}</p>
                          </div>
                          <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <p className="text-xs text-gray-500 uppercase mb-1">Applicable To</p>
                            <p className="text-sm text-gray-700">{charge.applicableTo}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {charge.applicableClasses.length === classes.length ? 'All Classes' : `${charge.applicableClasses.length} Classes`}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                          Created by {charge.createdBy} on {charge.createdOn}
                          {charge.modifiedBy && ` • Last modified by ${charge.modifiedBy} on ${charge.modifiedOn}`}
                        </div>
                      </td>
                    </tr>
                }
                </React.Fragment>
              )}
            </tbody>
          </table>
        </div>

        {filteredCharges.length === 0 &&
        <div className="p-12 text-center">
            <Layers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Charges Found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
            <Button variant="outline" onClick={() => {setSearchTerm('');setCategoryFilter('all');setTypeFilter('all');setStatusFilter('all');}}>
              Clear Filters
            </Button>
          </div>
        }
      </Card>

      {/* Add/Edit Modal */}
      {showModal &&
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <Card className="w-full max-w-3xl shadow-2xl my-8">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
              <div>
                <h3 className="text-xl font-medium text-gray-900">
                  {editingCharge ? 'Edit Charge Head' : 'Create New Charge Head'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Define the charge type, tax, applicability, and status
                </p>
              </div>
              <button
              onClick={() => {setShowModal(false);setEditingCharge(null);resetForm();}}
              className="text-gray-400 hover:text-gray-600 transition-colors">

                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Basic Information */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Basic Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                  label="Charge Name *"
                  placeholder="e.g., Library Fine"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} />

                  <Input
                  label="Short Code *"
                  placeholder="e.g., LIB-FINE-01"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} />

                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={2}
                  placeholder="Brief description of when this charge is applicable..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} />

                </div>
              </div>

              {/* Charge Type */}
              <div>
                <Input
                  label="Charge Type *"
                  placeholder="e.g., Library Fee, Penalty, Deposit"
                  value={formData.chargeType}
                  onChange={(e) => setFormData({ ...formData, chargeType: e.target.value })}
                />
              </div>

              {/* Tax & Refund Settings */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Refundable Charge</p>
                      <p className="text-xs text-gray-500">Can be refunded to student/staff</p>
                    </div>
                  </div>
                  <button
                  onClick={() => setFormData({ ...formData, isRefundable: !formData.isRefundable })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                  formData.isRefundable ? 'bg-green-500' : 'bg-gray-300'}`
                  }>

                    <div
                    className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                    formData.isRefundable ? 'translate-x-6' : 'translate-x-0.5'}`
                    } />

                  </button>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Percent className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="font-medium text-gray-900">Tax Applicable</p>
                        <p className="text-xs text-gray-500">Apply GST/VAT on this charge</p>
                      </div>
                    </div>
                    <button
                    onClick={() => setFormData({ ...formData, isTaxable: !formData.isTaxable })}
                    className={`w-12 h-6 rounded-full transition-colors ${
                    formData.isTaxable ? 'bg-green-500' : 'bg-gray-300'}`
                    }>

                      <div
                      className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                      formData.isTaxable ? 'translate-x-6' : 'translate-x-0.5'}`
                      } />

                    </button>
                  </div>
                  {formData.isTaxable &&
                <div className="grid grid-cols-2 gap-4 mt-3 animate-in slide-in-from-top-2">
                      <Select
                    label="Tax Type"
                    value={formData.taxType}
                    onChange={(e) => setFormData({ ...formData, taxType: e.target.value })}
                    options={taxTypes} />

                      <Input
                    label="Tax Percentage (%)"
                    type="number"
                    placeholder="18"
                    value={formData.taxPercent}
                    onChange={(e) => setFormData({ ...formData, taxPercent: e.target.value })} />

                    </div>
                }
                </div>
              </div>

              {/* Applicability */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Applicability
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <Select
                  label="Applicable To"
                  value={formData.applicableTo}
                  onChange={(e) => setFormData({ ...formData, applicableTo: e.target.value })}
                  options={[
                  { value: 'students', label: 'Students Only' },
                  { value: 'staff', label: 'Staff Only' },
                  { value: 'both', label: 'Both Students & Staff' }]
                  } />

                  <Select
                  label="Frequency"
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  options={[
                  { value: 'one-time', label: 'One-time' },
                  { value: 'as_required', label: 'As Required' },
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'quarterly', label: 'Quarterly' },
                  { value: 'annual', label: 'Annual' }]
                  } />

                </div>

                {/* Class Selection */}
                {(formData.applicableTo === 'students' || formData.applicableTo === 'both') &&
              <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Applicable Classes</label>
                      <button
                    type="button"
                    onClick={selectAllClasses}
                    className="text-xs text-purple-600 hover:text-purple-700">

                        {formData.applicableClasses.length === classes.length ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {classes.map((cls) =>
                  <button
                    key={cls}
                    type="button"
                    onClick={() => toggleClass(cls)}
                    className={`px-3 py-2 text-xs rounded-lg border transition-colors ${
                    formData.applicableClasses.includes(cls) ?
                    'bg-purple-100 border-purple-300 text-purple-700' :
                    'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`
                    }>

                          {cls}
                        </button>
                  )}
                    </div>
                  </div>
              }
              </div>

              {/* Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Active Status</p>
                    <p className="text-xs text-gray-500">Inactive charges cannot be applied</p>
                  </div>
                </div>
                <button
                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                className={`w-12 h-6 rounded-full transition-colors ${
                formData.isActive ? 'bg-green-500' : 'bg-gray-300'}`
                }>

                  <div
                  className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                  formData.isActive ? 'translate-x-6' : 'translate-x-0.5'}`
                  } />

                </button>
              </div>

            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end items-center gap-3 rounded-b-xl">
              {formError &&
              <p className="mr-auto text-sm text-red-600 flex items-center gap-1.5" role="alert">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {formError}
                </p>
              }
              <Button variant="outline" onClick={() => {setShowModal(false);setEditingCharge(null);resetForm();}}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave} disabled={isSaving}>
                {isSaving ?
              <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </> :

              <>
                    <Save className="w-4 h-4 mr-2" />
                    {editingCharge ? 'Update Charge' : 'Create Charge'}
                  </>
              }
              </Button>
            </div>
          </Card>
        </div>
      }
    </div>);

}
