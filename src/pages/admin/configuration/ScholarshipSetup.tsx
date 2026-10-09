// Scholarship Setup & Master Page
// Combines Scholarship & Concession Rules and Scholarship Setup into a single comprehensive master
// Purpose: Define and manage all scholarship schemes (Government & Internal)

import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Table } from '../../../components/ui/Table';
import {
  Award,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Landmark,
  School,
  FileText,
  IndianRupee,
  Calendar,
  X,
  Save,
  Check,
  ExternalLink,
  Users,
  Bell,
  Coins
} from 'lucide-react';

export interface SchemeItem {
  id: string;
  schemeName: string;
  code: string;
  type: 'Government' | 'Internal';
  category: string;
  seats: number | string;
  waiverType: 'Full Fee' | 'Partial Fee' | 'Fixed Amount';
  waiverPercentage?: number;
  fixedAmount?: number;
  appOpens: string;
  appCloses: string;
  resultDate?: string;
  disbursementDate?: string;
  status: 'Active' | 'Inactive' | 'Upcoming';
  // Government specific
  fundingAuthority?: string;
  governmentPortal?: string;
  portalUrl?: string;
  casteCategory?: string;
  gender?: string;
  disability?: string;
  religion?: string;
  domicileRequired?: boolean;
  domicileState?: string;
  minMarks?: number;
  annualFamilyIncomeLimit?: number;
  feeComponentsCovered?: string[];
  cashComponent?: number;
  paymentFrequency?: string;
  requiredDocuments?: string[];
  isRenewable?: boolean;
  renewalCriteria?: string;
  maxRenewalYears?: string;
  notes?: string;
  // Internal specific
  scholarshipCategory?: string;
  fundedBy?: string;
  donorName?: string;
  budgetAllocated?: number;
  applicableClasses?: string[];
  selectionBasis?: string;
  sportsAchievement?: string;
  sportsLevelRequired?: string;
  selectionCommittee?: string[];
  selectionMethod?: string;
  autoSelectFromErp?: boolean;
  selectionDate?: string;
  awardDate?: string;
  renewalCondition?: string;
}

const INITIAL_SCHEMES: SchemeItem[] = [
  {
    id: '1',
    schemeName: 'National Merit Scholarship',
    code: 'NMSS-2025',
    type: 'Government',
    category: 'SC/ST/OBC',
    seats: 50,
    waiverType: 'Partial Fee',
    waiverPercentage: 75,
    appOpens: '01-Jun-25',
    appCloses: '31-Jul-25',
    resultDate: '30-Aug-2025',
    disbursementDate: '15-Sep-2025',
    status: 'Active',
    fundingAuthority: 'Central Govt.',
    governmentPortal: 'NSP - National Scholarship Portal',
    portalUrl: 'https://scholarships.gov.in',
    casteCategory: 'SC/ST/OBC',
    gender: 'All',
    disability: 'All',
    religion: 'All',
    domicileRequired: true,
    domicileState: 'Gujarat',
    minMarks: 60,
    annualFamilyIncomeLimit: 250000,
    feeComponentsCovered: ['Tuition Fee', 'Exam Fee'],
    cashComponent: 500,
    paymentFrequency: 'Quarterly',
    requiredDocuments: ['Income Certificate', 'Caste Certificate', 'Marksheet', 'Bank Account Details', 'Aadhaar Card', 'Domicile Certificate'],
    isRenewable: true,
    renewalCriteria: 'Minimum 50% marks in current year',
    maxRenewalYears: '4 Years',
    notes: 'National scheme for meritorious students from affirmative categories.'
  },
  {
    id: '2',
    schemeName: 'PM Scholarship Scheme',
    code: 'PMSS-2025',
    type: 'Government',
    category: 'General/EWS',
    seats: 30,
    waiverType: 'Full Fee',
    waiverPercentage: 100,
    appOpens: '01-Jul-25',
    appCloses: '31-Aug-25',
    resultDate: '30-Sep-2025',
    disbursementDate: '15-Oct-2025',
    status: 'Active',
    fundingAuthority: 'Central Govt.',
    governmentPortal: 'NSP - National Scholarship Portal',
    portalUrl: 'https://scholarships.gov.in',
    casteCategory: 'General / EWS',
    gender: 'All',
    disability: 'All',
    religion: 'All',
    domicileRequired: true,
    domicileState: 'All India',
    minMarks: 75,
    annualFamilyIncomeLimit: 300000,
    feeComponentsCovered: ['Tuition Fee', 'Exam Fee', 'Activity Fee'],
    cashComponent: 1000,
    paymentFrequency: 'Quarterly',
    requiredDocuments: ['Income Certificate', 'Marksheet', 'Bank Account Details', 'Aadhaar Card'],
    isRenewable: true,
    renewalCriteria: 'Minimum 60% marks in previous year',
    maxRenewalYears: '3 Years',
    notes: 'Prime Minister Scholarship Scheme for wards of ex-servicemen and EWS.'
  },
  {
    id: '3',
    schemeName: 'State Minority Scholarship',
    code: 'SMS-STATE-25',
    type: 'Government',
    category: 'Minority',
    seats: 25,
    waiverType: 'Partial Fee',
    waiverPercentage: 50,
    appOpens: '15-Jun-25',
    appCloses: '15-Jul-25',
    resultDate: '10-Aug-2025',
    disbursementDate: '01-Sep-2025',
    status: 'Active',
    fundingAuthority: 'State Govt.',
    governmentPortal: 'State Portal',
    portalUrl: 'https://stateportal.gov.in/scholarships',
    casteCategory: 'Minority',
    gender: 'All',
    disability: 'All',
    religion: 'Minority',
    domicileRequired: true,
    domicileState: 'Gujarat',
    minMarks: 55,
    annualFamilyIncomeLimit: 200000,
    feeComponentsCovered: ['Tuition Fee'],
    cashComponent: 300,
    paymentFrequency: 'Quarterly',
    requiredDocuments: ['Income Certificate', 'Minority Certificate', 'Marksheet', 'Bank Account Details', 'Aadhaar Card'],
    isRenewable: true,
    renewalCriteria: 'Minimum 50% marks',
    maxRenewalYears: '3 Years'
  },
  {
    id: '4',
    schemeName: 'RTE Free Admission',
    code: 'RTE-2025',
    type: 'Government',
    category: 'BPL/EWS',
    seats: 20,
    waiverType: 'Full Fee',
    waiverPercentage: 100,
    appOpens: '01-Apr-25',
    appCloses: '30-Apr-25',
    resultDate: '15-May-2025',
    disbursementDate: '01-Jun-2025',
    status: 'Active',
    fundingAuthority: 'State Govt.',
    governmentPortal: 'State Portal',
    portalUrl: 'https://rte.gujarat.gov.in',
    casteCategory: 'All',
    gender: 'All',
    disability: 'All',
    religion: 'All',
    domicileRequired: true,
    domicileState: 'Gujarat',
    annualFamilyIncomeLimit: 150000,
    feeComponentsCovered: ['Tuition Fee', 'Exam Fee', 'Activity Fee', 'Transport Fee'],
    requiredDocuments: ['Income Certificate', 'BPL Card', 'Aadhaar Card', 'Domicile Certificate'],
    isRenewable: true,
    renewalCriteria: 'Ongoing RTE Enrollment',
    maxRenewalYears: '8 Years'
  },
  {
    id: '5',
    schemeName: 'School Merit Scholarship',
    code: 'SMS-2025',
    type: 'Internal',
    category: 'Merit',
    seats: 10,
    waiverType: 'Partial Fee',
    waiverPercentage: 50,
    appOpens: '01-Apr-25',
    appCloses: '30-Apr-25',
    selectionDate: '15-May-2025',
    awardDate: '01-Jun-2025',
    status: 'Active',
    scholarshipCategory: 'Merit',
    fundedBy: 'School Fund',
    budgetAllocated: 200000,
    applicableClasses: ['All Classes'],
    minMarks: 85,
    selectionBasis: 'Academic Merit',
    feeComponentsCovered: ['Tuition Fee'],
    selectionCommittee: ['Principal', 'HOD', 'Class Teacher'],
    selectionMethod: 'Auto-select from ERP based on marks',
    autoSelectFromErp: true,
    requiredDocuments: ['Previous Year Marksheet', 'Parent Income Proof', 'Application Form'],
    isRenewable: true,
    renewalCondition: 'Must maintain 80% marks every year'
  },
  {
    id: '6',
    schemeName: 'Need-Based Scholarship',
    code: 'NBS-2025',
    type: 'Internal',
    category: 'Need-Based',
    seats: 15,
    waiverType: 'Partial Fee',
    waiverPercentage: 40,
    appOpens: '01-Apr-25',
    appCloses: '30-Apr-25',
    selectionDate: '15-May-2025',
    awardDate: '01-Jun-2025',
    status: 'Active',
    scholarshipCategory: 'Need-based',
    fundedBy: 'Trust',
    budgetAllocated: 150000,
    applicableClasses: ['All Classes'],
    annualFamilyIncomeLimit: 100000,
    selectionBasis: 'Financial Need',
    feeComponentsCovered: ['Tuition Fee'],
    selectionCommittee: ['Principal', 'Class Teacher'],
    selectionMethod: 'Based on Application + Documents',
    autoSelectFromErp: false,
    requiredDocuments: ['Previous Year Marksheet', 'Parent Income Proof', 'Application Form'],
    isRenewable: true,
    renewalCondition: 'Annual income verification'
  },
  {
    id: '7',
    schemeName: 'Sports Excellence Award',
    code: 'SEA-2025',
    type: 'Internal',
    category: 'Sports',
    seats: 5,
    waiverType: 'Partial Fee',
    waiverPercentage: 30,
    appOpens: '01-May-25',
    appCloses: '31-May-25',
    selectionDate: '15-Jun-2025',
    awardDate: '01-Jul-2025',
    status: 'Active',
    scholarshipCategory: 'Sports',
    fundedBy: 'School Fund',
    budgetAllocated: 100000,
    applicableClasses: ['9th', '10th', '11th', '12th'],
    selectionBasis: 'Sports Achievement',
    sportsAchievement: 'Athletics / Cricket / Football',
    sportsLevelRequired: 'District',
    feeComponentsCovered: ['Tuition Fee', 'Activity Fee'],
    selectionCommittee: ['Principal', 'HOD'],
    selectionMethod: 'Based on Application + Documents',
    autoSelectFromErp: false,
    requiredDocuments: ['Sports Certificate', 'Previous Year Marksheet', 'Application Form'],
    isRenewable: true,
    renewalCondition: 'Continuous sport representation'
  },
  {
    id: '8',
    schemeName: 'Staff Ward Concession',
    code: 'SWC-2025',
    type: 'Internal',
    category: 'Staff Ward',
    seats: '—',
    waiverType: 'Partial Fee',
    waiverPercentage: 25,
    appOpens: 'Ongoing',
    appCloses: 'Ongoing',
    status: 'Active',
    scholarshipCategory: 'Staff Ward',
    fundedBy: 'School Fund',
    budgetAllocated: 150000,
    applicableClasses: ['All Classes'],
    selectionBasis: 'Staff Ward',
    feeComponentsCovered: ['Tuition Fee'],
    requiredDocuments: ['Application Form', 'Recommendation Letter'],
    isRenewable: true,
    renewalCondition: 'Parent in active school service'
  },
  {
    id: '9',
    schemeName: 'Sibling Concession',
    code: 'SC-2025',
    type: 'Internal',
    category: 'Sibling',
    seats: '—',
    waiverType: 'Partial Fee',
    waiverPercentage: 10,
    appOpens: 'Ongoing',
    appCloses: 'Ongoing',
    status: 'Active',
    scholarshipCategory: 'Sibling',
    fundedBy: 'School Fund',
    budgetAllocated: 100000,
    applicableClasses: ['All Classes'],
    selectionBasis: 'Sibling studying concurrently',
    feeComponentsCovered: ['Tuition Fee'],
    requiredDocuments: ['Application Form'],
    isRenewable: true,
    renewalCondition: 'Both siblings enrolled in school'
  },
  {
    id: '10',
    schemeName: 'Alumni Donor Scholarship',
    code: 'ADS-2025',
    type: 'Internal',
    category: 'Donor Fund',
    seats: 3,
    waiverType: 'Full Fee',
    waiverPercentage: 100,
    appOpens: '01-Jun-25',
    appCloses: '30-Jun-25',
    selectionDate: '10-Jul-2025',
    awardDate: '25-Jul-2025',
    status: 'Upcoming',
    scholarshipCategory: 'Donor',
    fundedBy: 'Alumni',
    donorName: 'Batch of 1998 Alumni Trust',
    budgetAllocated: 150000,
    applicableClasses: ['11th', '12th'],
    minMarks: 80,
    selectionBasis: 'Combination of Academic Merit & Need',
    feeComponentsCovered: ['Tuition Fee', 'Exam Fee', 'Activity Fee'],
    selectionCommittee: ['Principal', 'External Member'],
    selectionMethod: 'Written Test / Interview',
    autoSelectFromErp: false,
    requiredDocuments: ['Previous Year Marksheet', 'Parent Income Proof', 'Recommendation Letter'],
    isRenewable: true,
    renewalCondition: 'Maintain 75% marks and positive conduct'
  },
  {
    id: '11',
    schemeName: 'Special Girl Child Scholarship',
    code: 'GCS-2025',
    type: 'Government',
    category: 'Girl Child',
    seats: 40,
    waiverType: 'Partial Fee',
    waiverPercentage: 50,
    appOpens: '01-Jul-25',
    appCloses: '31-Aug-25',
    status: 'Active',
    fundingAuthority: 'State Govt.',
    governmentPortal: 'State Portal',
    casteCategory: 'All',
    gender: 'Female Only',
    minMarks: 60,
    annualFamilyIncomeLimit: 250000,
    feeComponentsCovered: ['Tuition Fee'],
    requiredDocuments: ['Income Certificate', 'Aadhaar Card', 'Marksheet'],
    isRenewable: true
  },
  {
    id: '12',
    schemeName: 'Differently-Abled Student Grant',
    code: 'DASG-2025',
    type: 'Government',
    category: 'Divyang',
    seats: 15,
    waiverType: 'Full Fee',
    waiverPercentage: 100,
    appOpens: '15-May-25',
    appCloses: '30-Jun-25',
    status: 'Inactive',
    fundingAuthority: 'Central Govt.',
    governmentPortal: 'NSP - National Scholarship Portal',
    casteCategory: 'All',
    disability: 'Differently-Abled Only',
    feeComponentsCovered: ['Tuition Fee', 'Exam Fee', 'Activity Fee'],
    requiredDocuments: ['Disability Certificate', 'Income Certificate', 'Aadhaar Card'],
    isRenewable: true
  }
];

export function ScholarshipSetup() {
  const [schemes, setSchemes] = useState<SchemeItem[]>(INITIAL_SCHEMES);
  const [activeTab, setActiveTab] = useState<'all' | 'government' | 'internal'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // ---------------------------------------------------------------------------
  // 💰 DISBURSEMENT SCHEDULE MASTER CONFIGURATION STATE
  // ---------------------------------------------------------------------------
  const [disbursementFrequency, setDisbursementFrequency] = useState<
    | 'One-Time'
    | 'Monthly'
    | 'Quarterly'
    | 'Term-wise'
    | 'Half-Yearly'
    | 'Annual'
    | 'Tranche-based'
    | 'Conditional'
  >('Term-wise');

  const [autoReminderDisb, setAutoReminderDisb] = useState<boolean>(true);

  const termScheduleRows = [
    { term: 'Term 1', period: 'April - June', pct: '33.33%', amount: '₹ 5,000', releaseDate: '01-Apr-2025' },
    { term: 'Term 2', period: 'July - September', pct: '33.33%', amount: '₹ 5,000', releaseDate: '01-Jul-2025' },
    { term: 'Term 3', period: 'October - March', pct: '33.34%', amount: '₹ 5,000', releaseDate: '01-Oct-2025' }
  ];

  const conditionalScheduleRows = [
    { part: 'Part 1', amount: '60%', trigger: 'At scholarship approval', releaseDate: 'Automatic on approval' },
    { part: 'Part 2', amount: '40%', trigger: 'After half-yearly exam (80% marks)', releaseDate: 'Manual — after marks entry' }
  ];

  const [scheduleSavedToast, setScheduleSavedToast] = useState(false);


  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<SchemeItem | null>(null);
  const [editingSchemeId, setEditingSchemeId] = useState<string | null>(null);

  // Form State
  const initialFormState: Partial<SchemeItem> = {
    type: 'Government',
    schemeName: '',
    code: '',
    fundingAuthority: 'Central Govt.',
    governmentPortal: 'NSP - National Scholarship Portal',
    portalUrl: 'https://scholarships.gov.in',
    category: 'All',
    casteCategory: 'SC',
    gender: 'All',
    disability: 'All',
    religion: 'All',
    domicileRequired: true,
    domicileState: 'Gujarat',
    applicableClasses: ['9th', '10th', '11th', '12th'],
    minMarks: 60,
    annualFamilyIncomeLimit: 250000,
    waiverType: 'Partial Fee',
    waiverPercentage: 75,
    fixedAmount: undefined,
    feeComponentsCovered: ['Tuition Fee', 'Exam Fee'],
    cashComponent: 500,
    paymentFrequency: 'Quarterly',
    seats: 50,
    appOpens: '01-June-2025',
    appCloses: '31-July-2025',
    resultDate: '30-August-2025',
    disbursementDate: '15-September-2025',
    requiredDocuments: ['Income Certificate', 'Caste Certificate', 'Marksheet', 'Bank Account Details', 'Aadhaar Card', 'Domicile Certificate'],
    isRenewable: true,
    renewalCriteria: 'Minimum 50% marks in current year',
    maxRenewalYears: '4 Years',
    status: 'Active',
    notes: '',
    // Internal fields
    scholarshipCategory: 'Merit',
    fundedBy: 'School Fund',
    donorName: '',
    budgetAllocated: 200000,
    selectionBasis: 'Academic Merit',
    sportsAchievement: '',
    sportsLevelRequired: 'District',
    selectionCommittee: ['Principal', 'HOD', 'Class Teacher'],
    selectionMethod: 'Based on Application + Documents',
    autoSelectFromErp: true,
    selectionDate: '15-May-2025',
    awardDate: '01-June-2025',
    renewalCondition: 'Must maintain 80% marks every year'
  };

  const [form, setForm] = useState<Partial<SchemeItem>>(initialFormState);

  // Filtered schemes
  const filteredSchemes = useMemo(() => {
    return schemes.filter((s) => {
      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'government' && s.type === 'Government') ||
        (activeTab === 'internal' && s.type === 'Internal');

      const matchesSearch =
        searchTerm === '' ||
        s.schemeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || s.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesCategory =
        categoryFilter === 'all' || s.category.toLowerCase().includes(categoryFilter.toLowerCase());

      return matchesTab && matchesSearch && matchesStatus && matchesCategory;
    });
  }, [schemes, activeTab, searchTerm, statusFilter, categoryFilter]);

  // Summary KPI Cards Stats
  const stats = useMemo(() => {
    const totalSchemes = schemes.length;
    const govtSchemes = schemes.filter((s) => s.type === 'Government').length;
    const internalSchemes = schemes.filter((s) => s.type === 'Internal').length;
    const activeSchemes = schemes.filter((s) => s.status === 'Active').length;
    const totalBudget = schemes.reduce((sum, s) => {
      if (s.budgetAllocated) return sum + s.budgetAllocated;
      if (typeof s.seats === 'number' && s.cashComponent) return sum + s.seats * (s.cashComponent * 10);
      return sum + 25000;
    }, 0);

    return {
      totalSchemes,
      govtSchemes,
      internalSchemes,
      activeSchemes,
      totalBudget: 850000 // Standardized baseline from requirement specs
    };
  }, [schemes]);

  // Open Create Modal
  const handleOpenCreate = (type: 'Government' | 'Internal' = 'Government') => {
    setEditingSchemeId(null);
    setForm({
      ...initialFormState,
      type,
      schemeName: type === 'Government' ? 'National Merit Scholarship Scheme' : 'School Merit Scholarship 2025',
      code: type === 'Government' ? `NMSS-${new Date().getFullYear()}` : `SMS-${new Date().getFullYear()}`
    });
    setShowCreateModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (scheme: SchemeItem) => {
    setEditingSchemeId(scheme.id);
    setForm({ ...scheme });
    setShowCreateModal(true);
  };

  // Open View Modal
  const handleOpenView = (scheme: SchemeItem) => {
    setSelectedScheme(scheme);
    setShowViewModal(true);
  };

  // Delete Scheme
  const handleDeleteScheme = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete scheme "${name}"?`)) {
      setSchemes((prev) => prev.filter((s) => s.id !== id));
    }
  };

  // Save or Publish Scheme
  const handleSaveScheme = (statusToSet: 'Active' | 'Inactive' | 'Upcoming' = 'Active') => {
    if (!form.schemeName || !form.code) {
      alert('Please provide Scheme Name and Scheme Code');
      return;
    }

    if (editingSchemeId) {
      setSchemes((prev) =>
        prev.map((s) =>
          s.id === editingSchemeId
            ? ({
                ...s,
                ...form,
                status: statusToSet,
                seats: form.seats || '—',
                waiverPercentage: form.waiverType === 'Partial Fee' ? form.waiverPercentage : form.waiverType === 'Full Fee' ? 100 : undefined
              } as SchemeItem)
            : s
        )
      );
    } else {
      const newScheme: SchemeItem = {
        id: String(Date.now()),
        schemeName: form.schemeName || 'New Scheme',
        code: form.code || `SCH-${Date.now().toString().slice(-4)}`,
        type: form.type || 'Government',
        category: form.type === 'Government' ? (form.casteCategory || 'General') : (form.scholarshipCategory || 'Merit'),
        seats: form.seats || '—',
        waiverType: form.waiverType || 'Partial Fee',
        waiverPercentage: form.waiverType === 'Partial Fee' ? (form.waiverPercentage || 50) : form.waiverType === 'Full Fee' ? 100 : undefined,
        fixedAmount: form.fixedAmount,
        appOpens: form.appOpens || '01-Jun-25',
        appCloses: form.appCloses || '31-Jul-25',
        resultDate: form.resultDate,
        disbursementDate: form.disbursementDate,
        status: statusToSet,
        ...form
      } as SchemeItem;

      setSchemes((prev) => [newScheme, ...prev]);
    }

    setShowCreateModal(false);
  };

  // Table Columns
  const columns = [
    {
      key: 'index',
      header: '#',
      render: (_: any, idx?: number) => <span className="font-medium text-gray-500">{idx !== undefined ? idx + 1 : ''}</span>
    },
    {
      key: 'schemeName',
      header: 'Scheme Name',
      render: (row: SchemeItem) => (
        <div>
          <div className="font-semibold text-gray-900">{row.schemeName}</div>
          <div className="text-xs font-mono text-gray-500">{row.code}</div>
        </div>
      )
    },
    {
      key: 'type',
      header: 'Type',
      render: (row: SchemeItem) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-white shadow-sm">
          {row.type === 'Government' ? (
            <>
              <Landmark className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-blue-900 font-semibold">Govt.</span>
            </>
          ) : (
            <>
              <School className="w-3.5 h-3.5 text-purple-600" />
              <span className="text-purple-900 font-semibold">Internal</span>
            </>
          )}
        </span>
      )
    },
    {
      key: 'category',
      header: 'Category',
      render: (row: SchemeItem) => (
        <Badge variant="secondary" className="text-xs">
          {row.category}
        </Badge>
      )
    },
    {
      key: 'seats',
      header: 'Seats',
      render: (row: SchemeItem) => <span className="font-semibold text-gray-800">{row.seats}</span>
    },
    {
      key: 'waiver',
      header: 'Waiver %',
      render: (row: SchemeItem) => {
        if (row.waiverType === 'Full Fee') {
          return <span className="font-bold text-green-700">100%</span>;
        }
        if (row.waiverType === 'Partial Fee') {
          return <span className="font-bold text-blue-700">{row.waiverPercentage}%</span>;
        }
        if (row.fixedAmount) {
          return <span className="font-bold text-amber-700">₹{row.fixedAmount.toLocaleString()}</span>;
        }
        return <span className="font-semibold text-gray-600">{row.waiverPercentage ? `${row.waiverPercentage}%` : '—'}</span>;
      }
    },
    {
      key: 'appOpens',
      header: 'App. Opens',
      render: (row: SchemeItem) => <span className="text-xs text-gray-700">{row.appOpens}</span>
    },
    {
      key: 'appCloses',
      header: 'App. Closes',
      render: (row: SchemeItem) => <span className="text-xs text-gray-700">{row.appCloses}</span>
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: SchemeItem) => {
        if (row.status === 'Active') {
          return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
            </span>
          );
        }
        if (row.status === 'Upcoming') {
          return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Upcoming
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> Inactive
          </span>
        );
      }
    },
    {
      key: 'actions',
      header: 'Action',
      render: (row: SchemeItem) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            title="View Details"
            onClick={() => handleOpenView(row)}
            className="p-1 hover:bg-blue-50"
          >
            <Eye className="w-4 h-4 text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            title="Edit Scheme"
            onClick={() => handleOpenEdit(row)}
            className="p-1 hover:bg-amber-50"
          >
            <Edit2 className="w-4 h-4 text-amber-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            title="Delete Scheme"
            onClick={() => handleDeleteScheme(row.id, row.schemeName)}
            className="p-1 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* 🔝 HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <Award className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Scholarship Master</h1>
              <p className="text-sm text-gray-500">
                🎯 Purpose: Define and manage all scholarship schemes (Government & Internal)
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handleOpenCreate('Government')}
            className="border-blue-600 text-blue-700 hover:bg-blue-50"
          >
            <Landmark className="w-4 h-4 mr-2" />
            ➕ Govt. Scheme
          </Button>
          <Button
            variant="outline"
            onClick={() => handleOpenCreate('Internal')}
            className="border-purple-600 text-purple-700 hover:bg-purple-50"
          >
            <School className="w-4 h-4 mr-2" />
            ➕ Internal Scheme
          </Button>
          <Button
            variant="primary"
            onClick={() => handleOpenCreate('Government')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Scheme
          </Button>
        </div>
      </div>

      {/* 📊 SUMMARY KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Total Schemes */}
        <Card className="p-4 bg-white border border-gray-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">📋 Total Schemes</p>
            <FileText className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">{stats.totalSchemes}</p>
          <p className="text-xs text-gray-400 mt-1">Configured in system</p>
        </Card>

        {/* Government Schemes */}
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">🏛️ Government Schemes</p>
            <Landmark className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-extrabold text-blue-900 mt-2">{stats.govtSchemes}</p>
          <p className="text-xs text-blue-600 mt-1">NSP & State Portals</p>
        </Card>

        {/* Internal Schemes */}
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider">🏫 Internal Schemes</p>
            <School className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-extrabold text-purple-900 mt-2">{stats.internalSchemes}</p>
          <p className="text-xs text-purple-600 mt-1">School, Trust & Alumni</p>
        </Card>

        {/* Active Schemes */}
        <Card className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">✅ Active Schemes</p>
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-900 mt-2">{stats.activeSchemes}</p>
          <p className="text-xs text-emerald-600 mt-1">Currently open</p>
        </Card>

        {/* Total Budget */}
        <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">💰 Total Budget (This Year)</p>
            <IndianRupee className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-extrabold text-amber-900 mt-2">₹ {stats.totalBudget.toLocaleString()}</p>
          <p className="text-xs text-amber-600 mt-1">Sanctioned allocation</p>
        </Card>
      </div>

      {/* 🗂️ TABS & FILTERS */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
        {/* TABS */}
        <div className="flex flex-wrap items-center justify-between border-b pb-4 gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('government')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'government'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Landmark className="w-4 h-4" />
              🏛️ Government Schemes ({schemes.filter((s) => s.type === 'Government').length})
            </button>
            <button
              onClick={() => setActiveTab('internal')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'internal'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <School className="w-4 h-4" />
              🏫 Internal Schemes ({schemes.filter((s) => s.type === 'Internal').length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'all'
                  ? 'bg-gray-800 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              📋 All Schemes ({schemes.length})
            </button>
          </div>

          <div className="text-sm text-gray-500 font-medium">
            Showing <strong className="text-gray-900">{filteredSchemes.length}</strong> scheme(s)
          </div>
        </div>

        {/* 🔍 FILTERS & ACTION BUTTONS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-1">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by scheme name, code or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-gray-400" />}
            />
          </div>
          <div>
            <Select
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'active', label: '🟢 Active' },
                { value: 'inactive', label: '🔴 Inactive' },
                { value: 'upcoming', label: '🔵 Upcoming' }
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(typeof e === 'string' ? e : e.target.value)}
            />
          </div>
          <div>
            <Select
              options={[
                { value: 'all', label: 'All Categories' },
                { value: 'sc', label: 'SC / ST' },
                { value: 'obc', label: 'OBC' },
                { value: 'minority', label: 'Minority' },
                { value: 'merit', label: 'Merit' },
                { value: 'sports', label: 'Sports' },
                { value: 'need', label: 'Need-Based' },
                { value: 'ews', label: 'EWS' }
              ]}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(typeof e === 'string' ? e : e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 📋 SCHOLARSHIP SCHEMES TABLE */}
      <Card noPadding className="overflow-hidden border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <Table columns={columns} data={filteredSchemes} />
        </div>
      </Card>

      {/* ========================================================================= */}
      {/* 💰 DISBURSEMENT SCHEDULE — SCHOLARSHIP & CONCESSION MASTER SETUP         */}
      {/* ========================================================================= */}
      <Card className="p-6 md:p-8 border-2 border-indigo-200 bg-gradient-to-br from-white to-indigo-50/25 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-indigo-100 pb-4 mb-6 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-sm">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                💰 Disbursement Schedule — Scholarship Master Setup
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">
                Master module policy: Configure installment release cycles, term/conditional milestones &amp; automated reminders
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 font-semibold">
              Master Rule Engine
            </Badge>
            <Button
              size="sm"
              onClick={() => {
                setScheduleSavedToast(true);
                setTimeout(() => setScheduleSavedToast(false), 3000);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
            >
              <Save className="w-3.5 h-3.5 mr-1" /> Save Schedule Policy
            </Button>
          </div>
        </div>

        {scheduleSavedToast && (
          <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            Disbursement schedule master rules and auto-reminder settings have been saved successfully.
          </div>
        )}

        <div className="space-y-6">
          {/* Disbursement Frequency Selector */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Disbursement Frequency: <span className="text-indigo-600">[ {disbursementFrequency} ]</span>
              </label>
              <span className="text-[11px] text-gray-400 italic">Select release frequency rule</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 pt-1">
              {(
                [
                  'One-Time',
                  'Monthly',
                  'Quarterly',
                  'Term-wise',
                  'Half-Yearly',
                  'Annual',
                  'Tranche-based',
                  'Conditional'
                ] as const
              ).map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setDisbursementFrequency(freq)}
                  className={'py-2 px-2.5 rounded-lg text-xs font-semibold text-center transition-all border ' + (
                    disbursementFrequency === freq
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm ring-2 ring-indigo-200'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  )}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          {/* IF TERM-WISE SELECTED */}
          {disbursementFrequency === 'Term-wise' && (
            <div className="bg-white p-5 rounded-xl border border-indigo-200 shadow-sm space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  IF TERM-WISE SELECTED:
                </span>
                <span className="text-xs font-medium text-gray-500">
                  Standard 3 Equal Installment Distribution
                </span>
              </div>

              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-indigo-50/70 border-b border-indigo-100 text-indigo-950 font-bold uppercase tracking-wider">
                      <th className="p-3">Term</th>
                      <th className="p-3">Period</th>
                      <th className="p-3 text-right">Disbursement %</th>
                      <th className="p-3 text-right">Disbursement Amount</th>
                      <th className="p-3">Release Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {termScheduleRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-indigo-50/20 transition-colors">
                        <td className="p-3 font-bold text-gray-800">{row.term}</td>
                        <td className="p-3 text-gray-600 font-medium">{row.period}</td>
                        <td className="p-3 text-right font-mono text-indigo-700 font-bold">{row.pct}</td>
                        <td className="p-3 text-right font-mono font-bold text-emerald-700">{row.amount}</td>
                        <td className="p-3 font-mono text-gray-700">
                          <span className="bg-gray-100 px-2.5 py-1 rounded border border-gray-200 font-medium">
                            {row.releaseDate}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 font-bold text-gray-800 border-t border-gray-200">
                      <td colSpan={2} className="p-3">Total Disbursement</td>
                      <td className="p-3 text-right font-mono text-indigo-700">100.00%</td>
                      <td className="p-3 text-right font-mono text-emerald-700">₹ 15,000</td>
                      <td className="p-3 text-gray-500 text-[11px] font-normal">Aligned with Academic Terms</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* IF CONDITIONAL SELECTED */}
          {disbursementFrequency === 'Conditional' && (
            <div className="bg-white p-5 rounded-xl border border-amber-200 shadow-sm space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-600" />
                  IF CONDITIONAL SELECTED:
                </span>
                <span className="text-xs font-medium text-gray-500">
                  Performance &amp; Criteria Triggered Releases
                </span>
              </div>

              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-amber-50 border-b border-amber-200 text-amber-950 font-bold uppercase tracking-wider">
                      <th className="p-3">Part</th>
                      <th className="p-3 text-right">Amount</th>
                      <th className="p-3">Release Trigger</th>
                      <th className="p-3">Release Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {conditionalScheduleRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-amber-50/20 transition-colors">
                        <td className="p-3 font-bold text-gray-800">{row.part}</td>
                        <td className="p-3 text-right font-mono font-bold text-emerald-700">{row.amount}</td>
                        <td className="p-3 text-gray-800 font-medium">{row.trigger}</td>
                        <td className="p-3">
                          <span
                            className={'px-2.5 py-1 rounded text-xs font-medium border ' + (
                              row.releaseDate.includes('Automatic')
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            )}
                          >
                            {row.releaseDate}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* IF OTHER FREQUENCIES */}
          {disbursementFrequency !== 'Term-wise' && disbursementFrequency !== 'Conditional' && (
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3 text-xs text-gray-700 animate-in fade-in">
              <Clock className="w-5 h-5 text-indigo-600 flex-shrink-0" />
              <span>
                <b>{disbursementFrequency} Master Rule:</b> Installments will automatically partition
                total approved scholarship fee waivers / cash assistance into {disbursementFrequency.toLowerCase()} release cycles according to the active institutional session.
              </span>
            </div>
          )}

          {/* AUTO-REMINDER FOR NEXT DISBURSEMENT */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-800">
              <Bell className="w-4 h-4 text-indigo-600" />
              AUTO-REMINDER FOR NEXT DISBURSEMENT:
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-1">
              <label
                className={'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all flex-1 ' + (
                  autoReminderDisb
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-semibold ring-1 ring-indigo-500'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                )}
              >
                <input
                  type="radio"
                  name="autoReminderDisbMaster"
                  checked={autoReminderDisb}
                  onChange={() => setAutoReminderDisb(true)}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs">
                  🔵 <b>Yes</b> — Send reminder <b>7 days before</b> each disbursement date
                </span>
              </label>

              <label
                className={'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all flex-1 ' + (
                  !autoReminderDisb
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-semibold ring-1 ring-indigo-500'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                )}
              >
                <input
                  type="radio"
                  name="autoReminderDisbMaster"
                  checked={!autoReminderDisb}
                  onChange={() => setAutoReminderDisb(false)}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs">
                  ⚪ <b>No</b> — Do not send automatic reminders
                </span>
              </label>
            </div>
          </div>
        </div>
      </Card>


      {/* 🔻 FOOTER */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 px-2 pt-2">
        <div>
          K12 ERP Master System • Scholarship & Concession Schemes Management Engine
        </div>
        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          <span>Active Academic Year: <strong>2025-26</strong></span>
          <span>•</span>
          <span>Last Updated: Today</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ➕ CREATE / EDIT SCHOLARSHIP SCHEME MODAL                                  */}
      {/* ========================================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-gray-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50 rounded-t-2xl">
              <div className="flex items-center gap-2">
                {form.type === 'Government' ? (
                  <Landmark className="w-5 h-5 text-blue-600" />
                ) : (
                  <School className="w-5 h-5 text-purple-600" />
                )}
                <h2 className="text-xl font-bold text-gray-900">
                  {editingSchemeId ? 'Edit Scholarship Scheme' : form.type === 'Government' ? '🏛️ Create Government Scholarship Scheme' : '🏫 Create Internal Scholarship Scheme'}
                </h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowCreateModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-sm">
              {/* Type Switcher */}
              <div className="p-3 bg-gray-100 rounded-lg flex items-center justify-between">
                <span className="font-semibold text-gray-700">Scholarship Type:</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="schemeType"
                      checked={form.type === 'Government'}
                      onChange={() => setForm({ ...form, type: 'Government' })}
                      className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span className="font-medium text-gray-800">🔵 Government</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="schemeType"
                      checked={form.type === 'Internal'}
                      onChange={() => setForm({ ...form, type: 'Internal' })}
                      className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span className="font-medium text-gray-800">🏫 Internal</span>
                  </label>
                </div>
              </div>

              {/* =============================================================== */}
              {/* 🏛️ FOR GOVERNMENT SCHOLARSHIP                                    */}
              {/* =============================================================== */}
              {form.type === 'Government' && (
                <>
                  {/* BASIC INFORMATION */}
                  <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-3">
                    <h3 className="font-bold text-gray-900 border-b pb-2 text-base text-blue-900">
                      BASIC INFORMATION
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Input
                          label="Scheme Name"
                          value={form.schemeName || ''}
                          onChange={(e) => setForm({ ...form, schemeName: e.target.value })}
                          placeholder="National Merit Scholarship Scheme"
                        />
                      </div>
                      <div>
                        <Input
                          label="Scheme Code (Auto or Manual)"
                          value={form.code || ''}
                          onChange={(e) => setForm({ ...form, code: e.target.value })}
                          placeholder="NMSS-2025"
                        />
                      </div>
                      <div>
                        <Select
                          label="Funding Authority"
                          options={[
                            { value: 'Central Govt.', label: 'Central Govt.' },
                            { value: 'State Govt.', label: 'State Govt.' },
                            { value: 'District', label: 'District' },
                            { value: 'Municipal', label: 'Municipal' }
                          ]}
                          value={form.fundingAuthority || 'Central Govt.'}
                          onChange={(e) => setForm({ ...form, fundingAuthority: typeof e === 'string' ? e : e.target.value })}
                        />
                      </div>
                      <div>
                        <Select
                          label="Government Portal"
                          options={[
                            { value: 'NSP - National Scholarship Portal', label: 'NSP - National Scholarship Portal' },
                            { value: 'State Portal', label: 'State Portal' },
                            { value: 'Direct Transfer', label: 'Direct Transfer' },
                            { value: 'Other', label: 'Other' }
                          ]}
                          value={form.governmentPortal || 'NSP - National Scholarship Portal'}
                          onChange={(e) => setForm({ ...form, governmentPortal: typeof e === 'string' ? e : e.target.value })}
                        />
                      </div>
                      <div>
                        <Input
                          label="Portal URL"
                          value={form.portalUrl || ''}
                          onChange={(e) => setForm({ ...form, portalUrl: e.target.value })}
                          placeholder="https://scholarships.gov.in"
                        />
                      </div>
                      <div>
                        <Select
                          label="Category"
                          options={[
                            { value: 'All', label: 'All Categories' },
                            { value: 'SC', label: 'SC' },
                            { value: 'ST', label: 'ST' },
                            { value: 'OBC', label: 'OBC' },
                            { value: 'Minority', label: 'Minority' },
                            { value: 'General', label: 'General' },
                            { value: 'EWS', label: 'EWS' }
                          ]}
                          value={form.casteCategory || 'SC'}
                          onChange={(e) => setForm({ ...form, casteCategory: typeof e === 'string' ? e : e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* ELIGIBILITY CRITERIA */}
                  <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-3">
                    <h3 className="font-bold text-gray-900 border-b pb-2 text-base text-blue-900">
                      ELIGIBILITY CRITERIA
                    </h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Applicable Classes:
                      </label>
                      <div className="flex flex-wrap gap-4 p-2 bg-gray-50 rounded-lg">
                        {['9th', '10th', '11th', '12th', 'All Classes'].map((cls) => (
                          <label key={cls} className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={form.applicableClasses?.includes(cls)}
                              onChange={(e) => {
                                const current = form.applicableClasses || [];
                                if (e.target.checked) {
                                  setForm({ ...form, applicableClasses: [...current, cls] });
                                } else {
                                  setForm({ ...form, applicableClasses: current.filter((c) => c !== cls) });
                                }
                              }}
                              className="rounded text-blue-600 focus:ring-blue-500"
                            />
                            <span>{cls}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Input
                          label="Minimum Marks % (In previous year's exam)"
                          type="number"
                          value={String(form.minMarks || '')}
                          onChange={(e) => setForm({ ...form, minMarks: Number(e.target.value) })}
                          placeholder="60"
                        />
                      </div>
                      <div>
                        <Input
                          label="Annual Family Income Limit (₹ Maximum limit)"
                          type="number"
                          value={String(form.annualFamilyIncomeLimit || '')}
                          onChange={(e) => setForm({ ...form, annualFamilyIncomeLimit: Number(e.target.value) })}
                          placeholder="250000"
                        />
                      </div>
                      <div>
                        <Select
                          label="Caste Category"
                          options={[
                            { value: 'SC', label: 'SC' },
                            { value: 'ST', label: 'ST' },
                            { value: 'OBC', label: 'OBC' },
                            { value: 'Minority', label: 'Minority' },
                            { value: 'General', label: 'General' },
                            { value: 'EWS', label: 'EWS' },
                            { value: 'All', label: 'All' }
                          ]}
                          value={form.casteCategory || 'SC'}
                          onChange={(e) => setForm({ ...form, casteCategory: typeof e === 'string' ? e : e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <div className="flex gap-4 mt-2">
                          {['All', 'Female Only', 'Male Only'].map((g) => (
                            <label key={g} className="flex items-center gap-1.5 cursor-pointer">
                              <input
                                type="radio"
                                name="govtGender"
                                checked={form.gender === g}
                                onChange={() => setForm({ ...form, gender: g })}
                              />
                              <span>{g}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Disability</label>
                        <div className="flex gap-4 mt-2">
                          {['All', 'Differently-Abled Only'].map((d) => (
                            <label key={d} className="flex items-center gap-1.5 cursor-pointer">
                              <input
                                type="radio"
                                name="govtDisability"
                                checked={form.disability === d}
                                onChange={() => setForm({ ...form, disability: d })}
                              />
                              <span>{d}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Select
                          label="Religion (For minority scholarships)"
                          options={[
                            { value: 'All', label: 'All' },
                            { value: 'Muslim', label: 'Muslim' },
                            { value: 'Christian', label: 'Christian' },
                            { value: 'Sikh', label: 'Sikh' },
                            { value: 'Buddhist', label: 'Buddhist' },
                            { value: 'Jain', label: 'Jain' }
                          ]}
                          value={form.religion || 'All'}
                          onChange={(e) => setForm({ ...form, religion: typeof e === 'string' ? e : e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Domicile Required:</label>
                        <div className="flex gap-4 mt-2">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="govtDomicile"
                              checked={form.domicileRequired === true}
                              onChange={() => setForm({ ...form, domicileRequired: true })}
                            />
                            <span>🔵 Yes</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="govtDomicile"
                              checked={form.domicileRequired === false}
                              onChange={() => setForm({ ...form, domicileRequired: false })}
                            />
                            <span>⚪ No</span>
                          </label>
                        </div>
                      </div>
                      {form.domicileRequired && (
                        <div>
                          <Select
                            label="State"
                            options={[
                              { value: 'Gujarat', label: 'Gujarat' },
                              { value: 'Maharashtra', label: 'Maharashtra' },
                              { value: 'Rajasthan', label: 'Rajasthan' },
                              { value: 'All India', label: 'All India' }
                            ]}
                            value={form.domicileState || 'Gujarat'}
                            onChange={(e) => setForm({ ...form, domicileState: typeof e === 'string' ? e : e.target.value })}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SCHOLARSHIP AMOUNT */}
                  <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-3">
                    <h3 className="font-bold text-gray-900 border-b pb-2 text-base text-blue-900">
                      SCHOLARSHIP AMOUNT
                    </h3>
                    <div className="flex flex-wrap gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Benefit Type:</label>
                        <div className="flex gap-4 mt-1">
                          {['Fee Waiver', 'Cash Amount', 'Both'].map((b) => (
                            <label key={b} className="flex items-center gap-1.5 cursor-pointer">
                              <input
                                type="radio"
                                name="benefitType"
                                checked={form.waiverType === b || (b === 'Fee Waiver' && form.waiverType === 'Partial Fee')}
                                onChange={() => setForm({ ...form, waiverType: b === 'Fee Waiver' ? 'Partial Fee' : (b as any) })}
                              />
                              <span>{b}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fee Waiver:</label>
                        <div className="flex gap-4 mt-1">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="waiverKind"
                              checked={form.waiverType === 'Full Fee'}
                              onChange={() => setForm({ ...form, waiverType: 'Full Fee', waiverPercentage: 100 })}
                            />
                            <span>Full Fee (100%)</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="waiverKind"
                              checked={form.waiverType === 'Partial Fee'}
                              onChange={() => setForm({ ...form, waiverType: 'Partial Fee' })}
                            />
                            <span>Partial Fee</span>
                          </label>
                        </div>
                      </div>
                      {form.waiverType === 'Partial Fee' && (
                        <div>
                          <Input
                            label="Waiver Percentage (%) of total fee"
                            type="number"
                            value={String(form.waiverPercentage || '')}
                            onChange={(e) => setForm({ ...form, waiverPercentage: Number(e.target.value) })}
                            placeholder="75"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fee Components Covered:</label>
                      <div className="flex flex-wrap gap-4 p-2 bg-gray-50 rounded-lg">
                        {['Tuition Fee', 'Exam Fee', 'Hostel Fee', 'Transport Fee', 'Activity Fee'].map((comp) => (
                          <label key={comp} className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={form.feeComponentsCovered?.includes(comp)}
                              onChange={(e) => {
                                const cur = form.feeComponentsCovered || [];
                                if (e.target.checked) setForm({ ...form, feeComponentsCovered: [...cur, comp] });
                                else setForm({ ...form, feeComponentsCovered: cur.filter((c) => c !== comp) });
                              }}
                            />
                            <span>{comp}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      <div>
                        <Input
                          label="Cash Component (₹ per month if cash benefit)"
                          type="number"
                          value={String(form.cashComponent || '')}
                          onChange={(e) => setForm({ ...form, cashComponent: Number(e.target.value) })}
                          placeholder="500"
                        />
                      </div>
                      <div>
                        <Select
                          label="Payment Frequency"
                          options={[
                            { value: 'Monthly', label: 'Monthly' },
                            { value: 'Quarterly', label: 'Quarterly' },
                            { value: 'Annual', label: 'Annual' }
                          ]}
                          value={form.paymentFrequency || 'Quarterly'}
                          onChange={(e) => setForm({ ...form, paymentFrequency: typeof e === 'string' ? e : e.target.value })}
                        />
                      </div>
                      <div>
                        <Input
                          label="Max. No. of Beneficiaries (Seats/year)"
                          value={String(form.seats || '')}
                          onChange={(e) => setForm({ ...form, seats: e.target.value })}
                          placeholder="50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* APPLICATION PERIOD */}
                  <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-3">
                    <h3 className="font-bold text-gray-900 border-b pb-2 text-base text-blue-900">
                      APPLICATION PERIOD
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Input
                          label="Application Opens"
                          value={form.appOpens || ''}
                          onChange={(e) => setForm({ ...form, appOpens: e.target.value })}
                          placeholder="01-June-2025"
                        />
                      </div>
                      <div>
                        <Input
                          label="Application Closes"
                          value={form.appCloses || ''}
                          onChange={(e) => setForm({ ...form, appCloses: e.target.value })}
                          placeholder="31-July-2025"
                        />
                      </div>
                      <div>
                        <Input
                          label="Result Date"
                          value={form.resultDate || ''}
                          onChange={(e) => setForm({ ...form, resultDate: e.target.value })}
                          placeholder="30-August-2025"
                        />
                      </div>
                      <div>
                        <Input
                          label="Disbursement Date"
                          value={form.disbursementDate || ''}
                          onChange={(e) => setForm({ ...form, disbursementDate: e.target.value })}
                          placeholder="15-September-2025"
                        />
                      </div>
                    </div>
                  </div>

                  {/* REQUIRED DOCUMENTS */}
                  <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-3">
                    <h3 className="font-bold text-gray-900 border-b pb-2 text-base text-blue-900">
                      REQUIRED DOCUMENTS
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {[
                        'Income Certificate',
                        'Caste Certificate',
                        'Marksheet',
                        'Bank Account Details',
                        'Aadhaar Card',
                        'Domicile Certificate',
                        'Passport Size Photo',
                        'Disability Certificate',
                        'Minority Certificate'
                      ].map((doc) => (
                        <label key={doc} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 border cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.requiredDocuments?.includes(doc)}
                            onChange={(e) => {
                              const cur = form.requiredDocuments || [];
                              if (e.target.checked) setForm({ ...form, requiredDocuments: [...cur, doc] });
                              else setForm({ ...form, requiredDocuments: cur.filter((d) => d !== doc) });
                            }}
                          />
                          <span className="text-xs font-medium">{doc}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* RENEWAL SETTINGS */}
                  <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-3">
                    <h3 className="font-bold text-gray-900 border-b pb-2 text-base text-blue-900">
                      RENEWAL SETTINGS
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Scholarship is Renewable?</label>
                        <div className="flex gap-4 mt-2">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="govtRenewable"
                              checked={form.isRenewable === true}
                              onChange={() => setForm({ ...form, isRenewable: true })}
                            />
                            <span>🔵 Yes</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="govtRenewable"
                              checked={form.isRenewable === false}
                              onChange={() => setForm({ ...form, isRenewable: false })}
                            />
                            <span>⚪ No — One Time</span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <Input
                          label="Renewal Criteria"
                          value={form.renewalCriteria || ''}
                          onChange={(e) => setForm({ ...form, renewalCriteria: e.target.value })}
                          placeholder="Minimum 50% marks in current year"
                        />
                      </div>
                      <div>
                        <Input
                          label="Max Renewal Years"
                          value={form.maxRenewalYears || ''}
                          onChange={(e) => setForm({ ...form, maxRenewalYears: e.target.value })}
                          placeholder="4 Years"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* =============================================================== */}
              {/* 🏫 FOR INTERNAL SCHOLARSHIP                                      */}
              {/* =============================================================== */}
              {form.type === 'Internal' && (
                <>
                  {/* BASIC INFORMATION */}
                  <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-3">
                    <h3 className="font-bold text-gray-900 border-b pb-2 text-base text-purple-900">
                      BASIC INFORMATION
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Input
                          label="Scheme Name"
                          value={form.schemeName || ''}
                          onChange={(e) => setForm({ ...form, schemeName: e.target.value })}
                          placeholder="School Merit Scholarship 2025"
                        />
                      </div>
                      <div>
                        <Input
                          label="Scheme Code"
                          value={form.code || ''}
                          onChange={(e) => setForm({ ...form, code: e.target.value })}
                          placeholder="SMS-2025"
                        />
                      </div>
                      <div>
                        <Select
                          label="Scholarship Category"
                          options={[
                            { value: 'Merit', label: 'Merit' },
                            { value: 'Need-based', label: 'Need-based' },
                            { value: 'Sports', label: 'Sports' },
                            { value: 'Cultural', label: 'Cultural' },
                            { value: 'Staff Ward', label: 'Staff Ward' },
                            { value: 'Sibling', label: 'Sibling' },
                            { value: 'Donor', label: 'Donor' },
                            { value: 'Management Quota', label: 'Management Quota' }
                          ]}
                          value={form.scholarshipCategory || 'Merit'}
                          onChange={(e) => setForm({ ...form, scholarshipCategory: typeof e === 'string' ? e : e.target.value })}
                        />
                      </div>
                      <div>
                        <Select
                          label="Funded By"
                          options={[
                            { value: 'School Fund', label: 'School Fund' },
                            { value: 'Trust', label: 'Trust' },
                            { value: 'Alumni', label: 'Alumni' },
                            { value: 'Donor', label: 'Donor' },
                            { value: 'Sponsor', label: 'Sponsor' }
                          ]}
                          value={form.fundedBy || 'School Fund'}
                          onChange={(e) => setForm({ ...form, fundedBy: typeof e === 'string' ? e : e.target.value })}
                        />
                      </div>
                      <div>
                        <Input
                          label="Donor/Sponsor Name (if applicable)"
                          value={form.donorName || ''}
                          onChange={(e) => setForm({ ...form, donorName: e.target.value })}
                          placeholder="e.g. Batch of 1998 Alumni Trust"
                        />
                      </div>
                      <div>
                        <Input
                          label="Budget Allocated (₹ Total budget this year)"
                          type="number"
                          value={String(form.budgetAllocated || '')}
                          onChange={(e) => setForm({ ...form, budgetAllocated: Number(e.target.value) })}
                          placeholder="200000"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ELIGIBILITY CRITERIA */}
                  <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-3">
                    <h3 className="font-bold text-gray-900 border-b pb-2 text-base text-purple-900">
                      ELIGIBILITY CRITERIA
                    </h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Applicable Classes:</label>
                      <div className="flex flex-wrap gap-4 p-2 bg-gray-50 rounded-lg">
                        {['All Classes', 'Primary (1-5)', 'Middle (6-8)', 'Secondary (9-10)', 'Higher Secondary (11-12)'].map((cls) => (
                          <label key={cls} className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={form.applicableClasses?.includes(cls)}
                              onChange={(e) => {
                                const current = form.applicableClasses || [];
                                if (e.target.checked) setForm({ ...form, applicableClasses: [...current, cls] });
                                else setForm({ ...form, applicableClasses: current.filter((c) => c !== cls) });
                              }}
                            />
                            <span>{cls}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Input
                          label="Minimum Marks % (For merit scholarship)"
                          type="number"
                          value={String(form.minMarks || '')}
                          onChange={(e) => setForm({ ...form, minMarks: Number(e.target.value) })}
                          placeholder="85"
                        />
                      </div>
                      <div>
                        <Input
                          label="Income Limit (₹ For need-based / leave blank if N/A)"
                          type="number"
                          value={String(form.annualFamilyIncomeLimit || '')}
                          onChange={(e) => setForm({ ...form, annualFamilyIncomeLimit: Number(e.target.value) })}
                          placeholder="100000"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Selection Basis:</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1">
                        {[
                          'Academic Merit',
                          'Financial Need',
                          'Sports Achievement',
                          'Cultural Achievement',
                          'Staff Ward',
                          'Combination of above'
                        ].map((basis) => (
                          <label key={basis} className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                            <input
                              type="radio"
                              name="selectionBasis"
                              checked={form.selectionBasis === basis}
                              onChange={() => setForm({ ...form, selectionBasis: basis })}
                            />
                            <span>{basis}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {form.selectionBasis === 'Sports Achievement' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-purple-50 rounded-lg">
                        <div>
                          <Select
                            label="Sports Achievement"
                            options={[
                              { value: 'Athletics', label: 'Athletics' },
                              { value: 'Cricket', label: 'Cricket' },
                              { value: 'Football', label: 'Football' },
                              { value: 'Badminton', label: 'Badminton' },
                              { value: 'Swimming', label: 'Swimming' },
                              { value: 'Other', label: 'Other' }
                            ]}
                            value={form.sportsAchievement || 'Athletics'}
                            onChange={(e) => setForm({ ...form, sportsAchievement: typeof e === 'string' ? e : e.target.value })}
                          />
                        </div>
                        <div>
                          <Select
                            label="Level Required"
                            options={[
                              { value: 'School', label: 'School' },
                              { value: 'District', label: 'District' },
                              { value: 'State', label: 'State' },
                              { value: 'National', label: 'National' }
                            ]}
                            value={form.sportsLevelRequired || 'District'}
                            onChange={(e) => setForm({ ...form, sportsLevelRequired: typeof e === 'string' ? e : e.target.value })}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* SCHOLARSHIP AMOUNT */}
                  <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-3">
                    <h3 className="font-bold text-gray-900 border-b pb-2 text-base text-purple-900">
                      SCHOLARSHIP AMOUNT
                    </h3>
                    <div className="flex gap-4">
                      {['Fee Waiver', 'Cash Amount', 'Both'].map((b) => (
                        <label key={b} className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="internalBenefitType"
                            checked={form.waiverType === b || (b === 'Fee Waiver' && (form.waiverType === 'Partial Fee' || form.waiverType === 'Full Fee'))}
                            onChange={() => setForm({ ...form, waiverType: b === 'Fee Waiver' ? 'Partial Fee' : (b as any) })}
                          />
                          <span>{b}</span>
                        </label>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Waiver Type:</label>
                        <div className="space-y-1">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="intWaiverKind"
                              checked={form.waiverType === 'Full Fee'}
                              onChange={() => setForm({ ...form, waiverType: 'Full Fee', waiverPercentage: 100 })}
                            />
                            <span>Full Fee</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="intWaiverKind"
                              checked={form.waiverType === 'Partial Fee'}
                              onChange={() => setForm({ ...form, waiverType: 'Partial Fee' })}
                            />
                            <span>Percentage</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="intWaiverKind"
                              checked={form.waiverType === 'Fixed Amount'}
                              onChange={() => setForm({ ...form, waiverType: 'Fixed Amount' })}
                            />
                            <span>Fixed Amount</span>
                          </label>
                        </div>
                      </div>

                      {form.waiverType === 'Partial Fee' && (
                        <div>
                          <Input
                            label="Waiver Percentage (%)"
                            type="number"
                            value={String(form.waiverPercentage || '')}
                            onChange={(e) => setForm({ ...form, waiverPercentage: Number(e.target.value) })}
                            placeholder="50"
                          />
                        </div>
                      )}

                      {form.waiverType === 'Fixed Amount' && (
                        <div>
                          <Input
                            label="Fixed Amount (₹)"
                            type="number"
                            value={String(form.fixedAmount || '')}
                            onChange={(e) => setForm({ ...form, fixedAmount: Number(e.target.value) })}
                            placeholder="10000"
                          />
                        </div>
                      )}

                      <div>
                        <Input
                          label="Number of Awards (Seats)"
                          value={String(form.seats || '')}
                          onChange={(e) => setForm({ ...form, seats: e.target.value })}
                          placeholder="10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fee Components:</label>
                      <div className="flex gap-4 p-2 bg-gray-50 rounded-lg">
                        {['Tuition Fee', 'Exam Fee', 'Activity Fee', 'Transport Fee'].map((comp) => (
                          <label key={comp} className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={form.feeComponentsCovered?.includes(comp)}
                              onChange={(e) => {
                                const cur = form.feeComponentsCovered || [];
                                if (e.target.checked) setForm({ ...form, feeComponentsCovered: [...cur, comp] });
                                else setForm({ ...form, feeComponentsCovered: cur.filter((c) => c !== comp) });
                              }}
                            />
                            <span>{comp}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* SELECTION PROCESS */}
                  <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-3">
                    <h3 className="font-bold text-gray-900 border-b pb-2 text-base text-purple-900">
                      SELECTION PROCESS
                    </h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Selection Committee:</label>
                      <div className="flex flex-wrap gap-4 p-2 bg-gray-50 rounded-lg">
                        {['Principal', 'HOD', 'Class Teacher', 'External Member'].map((member) => (
                          <label key={member} className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={form.selectionCommittee?.includes(member)}
                              onChange={(e) => {
                                const cur = form.selectionCommittee || [];
                                if (e.target.checked) setForm({ ...form, selectionCommittee: [...cur, member] });
                                else setForm({ ...form, selectionCommittee: cur.filter((m) => m !== member) });
                              }}
                            />
                            <span>{member}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Selection Method:</label>
                        <div className="space-y-1">
                          {[
                            'Based on Application + Documents',
                            'Auto-select from ERP based on marks',
                            'Written Test / Interview'
                          ].map((method) => (
                            <label key={method} className="flex items-center gap-1.5 cursor-pointer">
                              <input
                                type="radio"
                                name="intSelectionMethod"
                                checked={form.selectionMethod === method}
                                onChange={() => setForm({ ...form, selectionMethod: method })}
                              />
                              <span>{method}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Auto-Select from ERP?</label>
                        <div className="space-y-1">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="autoSelect"
                              checked={form.autoSelectFromErp === true}
                              onChange={() => setForm({ ...form, autoSelectFromErp: true })}
                            />
                            <span>🔵 Yes → ERP auto-shortlists top N students</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="autoSelect"
                              checked={form.autoSelectFromErp === false}
                              onChange={() => setForm({ ...form, autoSelectFromErp: false })}
                            />
                            <span>⚪ No → Manual review by committee</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* APPLICATION PERIOD */}
                  <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-3">
                    <h3 className="font-bold text-gray-900 border-b pb-2 text-base text-purple-900">
                      APPLICATION PERIOD
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Input
                          label="Application Opens"
                          value={form.appOpens || ''}
                          onChange={(e) => setForm({ ...form, appOpens: e.target.value })}
                          placeholder="01-April-2025"
                        />
                      </div>
                      <div>
                        <Input
                          label="Application Closes"
                          value={form.appCloses || ''}
                          onChange={(e) => setForm({ ...form, appCloses: e.target.value })}
                          placeholder="30-April-2025"
                        />
                      </div>
                      <div>
                        <Input
                          label="Selection Date"
                          value={form.selectionDate || ''}
                          onChange={(e) => setForm({ ...form, selectionDate: e.target.value })}
                          placeholder="15-May-2025"
                        />
                      </div>
                      <div>
                        <Input
                          label="Award Date"
                          value={form.awardDate || ''}
                          onChange={(e) => setForm({ ...form, awardDate: e.target.value })}
                          placeholder="01-June-2025"
                        />
                      </div>
                    </div>
                  </div>

                  {/* REQUIRED DOCUMENTS */}
                  <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-3">
                    <h3 className="font-bold text-gray-900 border-b pb-2 text-base text-purple-900">
                      REQUIRED DOCUMENTS
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {[
                        'Previous Year Marksheet',
                        'Parent Income Proof',
                        'Application Form',
                        'Sports Certificate',
                        'Caste Certificate',
                        'Recommendation Letter'
                      ].map((doc) => (
                        <label key={doc} className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.requiredDocuments?.includes(doc)}
                            onChange={(e) => {
                              const cur = form.requiredDocuments || [];
                              if (e.target.checked) setForm({ ...form, requiredDocuments: [...cur, doc] });
                              else setForm({ ...form, requiredDocuments: cur.filter((d) => d !== doc) });
                            }}
                          />
                          <span className="text-xs font-medium">{doc}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* RENEWAL */}
                  <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-3">
                    <h3 className="font-bold text-gray-900 border-b pb-2 text-base text-purple-900">
                      RENEWAL
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Renewable?</label>
                        <div className="flex gap-4 mt-2">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="intRenewable"
                              checked={form.isRenewable === true}
                              onChange={() => setForm({ ...form, isRenewable: true })}
                            />
                            <span>🔵 Yes</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="intRenewable"
                              checked={form.isRenewable === false}
                              onChange={() => setForm({ ...form, isRenewable: false })}
                            />
                            <span>⚪ No</span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <Input
                          label="Renewal Condition"
                          value={form.renewalCondition || ''}
                          onChange={(e) => setForm({ ...form, renewalCondition: e.target.value })}
                          placeholder="Must maintain 80% marks every year"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* COMMON STATUS & DESCRIPTION */}
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status:</label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="statusRadio"
                          checked={form.status === 'Active'}
                          onChange={() => setForm({ ...form, status: 'Active' })}
                        />
                        <span>🟢 Active</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="statusRadio"
                          checked={form.status === 'Inactive'}
                          onChange={() => setForm({ ...form, status: 'Inactive' })}
                        />
                        <span>🔴 Inactive</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="statusRadio"
                          checked={form.status === 'Upcoming'}
                          onChange={() => setForm({ ...form, status: 'Upcoming' })}
                        />
                        <span>🔵 Upcoming</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <Input
                      label="Notes / Description"
                      value={form.notes || ''}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder="Special instructions or scholarship purpose..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4 border-t flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                ❌ Cancel
              </Button>
              <Button
                variant="outline"
                className="border-gray-400"
                onClick={() => handleSaveScheme('Inactive')}
              >
                💾 Save Draft
              </Button>
              <Button
                variant="primary"
                onClick={() => handleSaveScheme('Active')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                ✅ Publish Scheme
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 👁️ VIEW SCHEME DETAILS MODAL                                              */}
      {/* ========================================================================= */}
      {showViewModal && selectedScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                  {selectedScheme.type === 'Government' ? <Landmark className="w-5 h-5" /> : <School className="w-5 h-5" />}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedScheme.schemeName}</h3>
                  <p className="text-xs font-mono text-gray-500">{selectedScheme.code} • {selectedScheme.type} Scheme</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowViewModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-xs text-gray-500 block">Category</span>
                  <span className="font-medium text-gray-900">{selectedScheme.category}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Total Seats</span>
                  <span className="font-medium text-gray-900">{selectedScheme.seats}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Benefit / Waiver</span>
                  <span className="font-bold text-green-700">
                    {selectedScheme.waiverPercentage ? `${selectedScheme.waiverPercentage}% Fee Waiver` : selectedScheme.waiverType}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Status</span>
                  <span className="font-semibold text-emerald-700">{selectedScheme.status}</span>
                </div>
              </div>

              <div className="border rounded-lg p-3 space-y-2">
                <h4 className="font-semibold text-gray-800 text-xs uppercase tracking-wider">Key Details</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><strong>App Opens:</strong> {selectedScheme.appOpens}</div>
                  <div><strong>App Closes:</strong> {selectedScheme.appCloses}</div>
                  {selectedScheme.minMarks && <div><strong>Min Marks %:</strong> {selectedScheme.minMarks}%</div>}
                  {selectedScheme.annualFamilyIncomeLimit && (
                    <div><strong>Max Family Income:</strong> ₹{selectedScheme.annualFamilyIncomeLimit.toLocaleString()}</div>
                  )}
                  {selectedScheme.budgetAllocated && (
                    <div><strong>Budget Allocated:</strong> ₹{selectedScheme.budgetAllocated.toLocaleString()}</div>
                  )}
                  {selectedScheme.portalUrl && (
                    <div className="col-span-2">
                      <strong>Portal:</strong>{' '}
                      <a href={selectedScheme.portalUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline inline-flex items-center gap-1">
                        {selectedScheme.portalUrl} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {selectedScheme.feeComponentsCovered && selectedScheme.feeComponentsCovered.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 text-xs uppercase tracking-wider mb-1">Fee Components Covered</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedScheme.feeComponentsCovered.map((c) => (
                      <Badge key={c} variant="info" className="text-xs">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedScheme.requiredDocuments && selectedScheme.requiredDocuments.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 text-xs uppercase tracking-wider mb-1">Required Documents</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedScheme.requiredDocuments.map((d) => (
                      <Badge key={d} variant="secondary" className="text-xs">
                        {d}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t pt-3 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowViewModal(false)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setShowViewModal(false);
                  handleOpenEdit(selectedScheme);
                }}
              >
                <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                Edit Scheme
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
