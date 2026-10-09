export interface VendorPayeeRecord {
  id: string;
  code: string;
  name: string;
  type: string;
  category: string;
  contact: string;
  phone: string;
  email: string;
  gstin: string;
  pan: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  bankName: string;
  bankAccount: string;
  ifsc: string;
  status: 'Active' | 'Inactive';
}

export const VENDOR_PAYEE_UPDATED_EVENT = 'k12-vendor-payee-master-updated';
const STORAGE_KEY = 'k12-erp-vendor-payee-master-data';

export const DEFAULT_VENDOR_PAYEES: VendorPayeeRecord[] = [
  {
    id: 'V001', code: 'VND001', name: 'ABC Stationery Suppliers', type: 'Vendor', category: 'Stationery',
    contact: 'Ramesh Patel', phone: '+91 98765 43210', email: 'abc@stationery.com', gstin: '24ABCDE1234F1Z5',
    pan: 'ABCDE1234F', address: '12 Relief Road', city: 'Ahmedabad', state: 'Gujarat', pincode: '380001',
    bankName: 'HDFC Bank', bankAccount: 'XXXXXX3210', ifsc: 'HDFC0001234', status: 'Active'
  },
  {
    id: 'V002', code: 'VND002', name: 'XYZ Maintenance Services', type: 'Contractor', category: 'Maintenance',
    contact: 'Suresh Kumar', phone: '+91 98765 43211', email: 'xyz@maintenance.com', gstin: '24XYZAB5678G2Z6',
    pan: 'XYZAB5678G', address: 'Satellite Road', city: 'Ahmedabad', state: 'Gujarat', pincode: '380015',
    bankName: 'ICICI Bank', bankAccount: 'XXXXXX8911', ifsc: 'ICIC0009876', status: 'Active'
  },
  {
    id: 'V003', code: 'VND003', name: 'City Electric Co.', type: 'Utility', category: 'Utilities',
    contact: 'Billing Department', phone: '+91 79 12345678', email: 'billing@cityelectric.com', gstin: '',
    pan: '', address: 'Ashram Road', city: 'Ahmedabad', state: 'Gujarat', pincode: '380009',
    bankName: 'SBI', bankAccount: 'XXXXXX4502', ifsc: 'SBIN0004567', status: 'Active'
  },
  {
    id: 'V004', code: 'PAY001', name: 'John Doe (Freelancer)', type: 'Payee', category: 'Services',
    contact: 'John Doe', phone: '+91 98765 00001', email: 'john@freelance.com', gstin: '',
    pan: 'ABCDE0001F', address: 'Prahlad Nagar', city: 'Ahmedabad', state: 'Gujarat', pincode: '380015',
    bankName: 'Axis Bank', bankAccount: 'XXXXXX1001', ifsc: 'UTIB0001234', status: 'Active'
  },
  {
    id: 'V005', code: 'VND004', name: 'Tech Solutions Pvt Ltd', type: 'Vendor', category: 'Technology',
    contact: 'Sales Team', phone: '+91 22 12345678', email: 'sales@techsol.com', gstin: '27TECHAB1234H3Z7',
    pan: 'TECHAB1234H', address: 'Andheri East', city: 'Mumbai', state: 'Maharashtra', pincode: '400069',
    bankName: 'Kotak Mahindra Bank', bankAccount: 'XXXXXX7731', ifsc: 'KKBK0007654', status: 'Inactive'
  }
];

const normalize = (value: unknown): VendorPayeeRecord[] | null => {
  if (!Array.isArray(value)) return null;
  const records = value.filter((item): item is VendorPayeeRecord =>
    !!item && typeof item === 'object' && typeof (item as VendorPayeeRecord).id === 'string' &&
    typeof (item as VendorPayeeRecord).code === 'string' && typeof (item as VendorPayeeRecord).name === 'string'
  );
  return records.map((record) => ({
    ...record,
    type: typeof record.type === 'string' ? record.type : 'Vendor',
    category: typeof record.category === 'string' ? record.category : '',
    contact: typeof record.contact === 'string' ? record.contact : '',
    phone: typeof record.phone === 'string' ? record.phone : '',
    email: typeof record.email === 'string' ? record.email : '',
    gstin: typeof record.gstin === 'string' ? record.gstin : '',
    pan: typeof record.pan === 'string' ? record.pan : '',
    address: typeof record.address === 'string' ? record.address : '',
    city: typeof record.city === 'string' ? record.city : '',
    state: typeof record.state === 'string' ? record.state : '',
    pincode: typeof record.pincode === 'string' ? record.pincode : '',
    bankName: typeof record.bankName === 'string' ? record.bankName : '',
    bankAccount: typeof record.bankAccount === 'string' ? record.bankAccount : '',
    ifsc: typeof record.ifsc === 'string' ? record.ifsc : '',
    status: record.status === 'Inactive' ? 'Inactive' : 'Active'
  }));
};

export function getVendorPayeeData(): VendorPayeeRecord[] {
  if (typeof window === 'undefined') return DEFAULT_VENDOR_PAYEES;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_VENDOR_PAYEES;
    return normalize(JSON.parse(raw)) || DEFAULT_VENDOR_PAYEES;
  } catch {
    return DEFAULT_VENDOR_PAYEES;
  }
}

export function saveVendorPayeeData(records: VendorPayeeRecord[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  window.dispatchEvent(new CustomEvent(VENDOR_PAYEE_UPDATED_EVENT));
}
