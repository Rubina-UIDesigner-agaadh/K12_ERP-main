export interface ExpenseMasterHead {
  id: string;
  code: string;
  name: string;
  category: string;
  glAccount: string;
  isTaxApplicable: boolean;
  requiresBill: boolean;
  isActive: boolean;
  budgetAllocated?: number;
}

export interface ExpenseMasterData {
  categories: string[];
  heads: ExpenseMasterHead[];
}

export const EXPENSE_MASTER_UPDATED_EVENT = 'k12-expense-master-updated';

const STORAGE_KEY = 'k12-erp-expense-master-data';

export const DEFAULT_EXPENSE_MASTER_DATA: ExpenseMasterData = {
  categories: [
    'Personnel',
    'Infrastructure',
    'Academic',
    'Administrative',
    'Technology',
    'Events',
    'Miscellaneous',
    'Stationery',
    'Lab Equipment',
    'Furniture',
    'Maintenance',
    'IT Equipment',
    'Books',
    'Sports Equipment',
    'Staff Welfare',
    'Utility',
    'Transport',
    'Other'
  ],
  heads: [
    { id: 'EH001', code: 'SALARY', name: 'Staff Salary', category: 'Personnel', glAccount: '5001', isTaxApplicable: false, requiresBill: false, isActive: true, budgetAllocated: 5000000 },
    { id: 'EH002', code: 'UTIL', name: 'Utilities (Electricity, Water)', category: 'Infrastructure', glAccount: '5010', isTaxApplicable: false, requiresBill: true, isActive: true, budgetAllocated: 200000 },
    { id: 'EH003', code: 'MAINT', name: 'Building Maintenance', category: 'Infrastructure', glAccount: '5020', isTaxApplicable: true, requiresBill: true, isActive: true, budgetAllocated: 300000 },
    { id: 'EH004', code: 'STATY', name: 'Stationery & Supplies', category: 'Academic', glAccount: '5030', isTaxApplicable: true, requiresBill: true, isActive: true, budgetAllocated: 100000 },
    { id: 'EH005', code: 'TRVL', name: 'Staff Travel & Conveyance', category: 'Personnel', glAccount: '5040', isTaxApplicable: false, requiresBill: false, isActive: true, budgetAllocated: 80000 },
    { id: 'EH006', code: 'MKTG', name: 'Marketing & Advertising', category: 'Administrative', glAccount: '5050', isTaxApplicable: true, requiresBill: true, isActive: false, budgetAllocated: 150000 },
    { id: 'EH007', code: 'EXP-LAB-001', name: 'Lab Chemicals & Instruments', category: 'Lab Equipment', glAccount: '5060', isTaxApplicable: true, requiresBill: true, isActive: true },
    { id: 'EH008', code: 'EXP-OFF-002', name: 'Office Stationery', category: 'Stationery', glAccount: '5070', isTaxApplicable: true, requiresBill: true, isActive: true },
    { id: 'EH009', code: 'EXP-UTL-003', name: 'Electricity Charges', category: 'Utility', glAccount: '5080', isTaxApplicable: false, requiresBill: true, isActive: true },
    { id: 'EH010', code: 'EXP-EVT-004', name: 'Event Refreshments', category: 'Events', glAccount: '5090', isTaxApplicable: true, requiresBill: true, isActive: true },
    { id: 'EH011', code: 'EXP-IT-005', name: 'IT Equipment & Hardware', category: 'IT Equipment', glAccount: '5100', isTaxApplicable: true, requiresBill: true, isActive: true },
    { id: 'EH012', code: 'EXP-PRT-006', name: 'Printing & Publishing', category: 'Academic', glAccount: '5110', isTaxApplicable: true, requiresBill: true, isActive: true },
    { id: 'EH013', code: 'EXP-TRN-007', name: 'Transport & Logistics', category: 'Transport', glAccount: '5120', isTaxApplicable: true, requiresBill: true, isActive: true },
    { id: 'EH014', code: 'EXP-BLD-008', name: 'Building Maintenance', category: 'Maintenance', glAccount: '5130', isTaxApplicable: true, requiresBill: true, isActive: true },
    { id: 'EH015', code: 'EXP-SPT-001', name: 'Sports Equipment', category: 'Sports Equipment', glAccount: '5140', isTaxApplicable: true, requiresBill: true, isActive: true },
    { id: 'EH016', code: 'LIBRARY', name: 'Library Books & Journals', category: 'Books', glAccount: '5150', isTaxApplicable: false, requiresBill: true, isActive: true }
  ]
};

const normalizeData = (value: unknown): ExpenseMasterData | null => {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as Partial<ExpenseMasterData>;
  if (!Array.isArray(candidate.categories) || !Array.isArray(candidate.heads)) return null;
  const categories = candidate.categories.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
  const heads = candidate.heads.filter((item): item is ExpenseMasterHead =>
    !!item && typeof item === 'object' && typeof (item as ExpenseMasterHead).id === 'string' &&
    typeof (item as ExpenseMasterHead).name === 'string' && typeof (item as ExpenseMasterHead).code === 'string'
  );
  return { categories: [...new Set(categories)], heads };
};

export function getExpenseMasterData(): ExpenseMasterData {
  if (typeof window === 'undefined') return DEFAULT_EXPENSE_MASTER_DATA;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_EXPENSE_MASTER_DATA;
    return normalizeData(JSON.parse(raw)) || DEFAULT_EXPENSE_MASTER_DATA;
  } catch {
    return DEFAULT_EXPENSE_MASTER_DATA;
  }
}

export function saveExpenseMasterData(data: ExpenseMasterData): void {
  if (typeof window === 'undefined') return;
  const normalized: ExpenseMasterData = {
    categories: [...new Set(data.categories.map((item) => item.trim()).filter(Boolean))],
    heads: data.heads
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  window.dispatchEvent(new CustomEvent(EXPENSE_MASTER_UPDATED_EVENT));
}
