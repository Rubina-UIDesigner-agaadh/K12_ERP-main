import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Printer, FileDown, CheckSquare, Square, User, CreditCard, Building2, Briefcase, Eye, Phone, Mail, MapPin, Calendar, Droplets, Shield, Smartphone, RefreshCw, Download, Filter, MoreHorizontal, X, AlertCircle, Clock, CheckCircle, XCircle, Edit, Trash2, Plus, Upload, Image, Type, QrCode, Palette, Layout, Save, RotateCcw, Move, AlignLeft, AlignCenter, AlignRight, Bold, Italic, ChevronDown, ChevronUp, Settings, Layers, Copy, FileText, AlertTriangle, Send, History, Barcode, UserPlus } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

// Types
interface Employee {
  id: string;
  employeeId: string;
  name: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  bloodGroup: string;
  joiningDate: string;
  address: string;
  emergencyContact: string;
  photo: string;
  isNewJoinee: boolean;
  idCardStatus: 'Active' | 'Expired' | 'Lost' | 'Under Process' | 'Not Issued';
  lastIssuedDate: string;
  expiryDate: string;
  cardNumber: string;
}

interface ReissueRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  reason: 'Lost' | 'Damaged' | 'Expired' | 'Name Change' | 'Designation Change' | 'Other';
  description: string;
  requestDate: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  priority: 'Normal' | 'Urgent';
}

type CardElementType = 'text' | 'field' | 'image' | 'qr' | 'barcode' | 'shape';

interface CardElement {
  id: string;
  type: CardElementType;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
  style: {
    fontSize?: number;
    fontWeight?: string;
    color?: string;
    backgroundColor?: string;
    borderRadius?: number;
    borderWidth?: number;
    borderColor?: string;
    textAlign?: string;
  };
  fieldMapping?: string;
  content?: string;
  imageSrc?: string;
  imageFit?: 'cover' | 'contain' | 'fill';
}

interface CardTemplate {
  id: string;
  name: string;
  orientation: 'vertical' | 'horizontal';
  width: number;
  height: number;
  backgroundColor: string;
  backgroundGradient?: string;
  elements: CardElement[];
}

// Mock Data
const mockEmployees: Employee[] = [
{
  id: '1',
  employeeId: 'EMP-2024-001',
  name: 'Dr. Rajesh Kumar',
  designation: 'HOD Mathematics',
  department: 'Mathematics',
  email: 'rajesh.k@school.edu',
  phone: '+91 9876543201',
  bloodGroup: 'O+',
  joiningDate: '2018-06-15',
  address: '123 Academic Street, Education City',
  emergencyContact: '+91 9876543301',
  photo: '',
  isNewJoinee: false,
  idCardStatus: 'Active',
  lastIssuedDate: '2024-01-15',
  expiryDate: '2025-12-31',
  cardNumber: 'IDC-2024-0001'
},
{
  id: '2',
  employeeId: 'EMP-2024-002',
  name: 'Sarah Jenkins',
  designation: 'Senior Teacher',
  department: 'English',
  email: 'sarah.j@school.edu',
  phone: '+91 9876543202',
  bloodGroup: 'A+',
  joiningDate: '2019-04-01',
  address: '456 Knowledge Ave, Learning Town',
  emergencyContact: '+91 9876543302',
  photo: '',
  isNewJoinee: false,
  idCardStatus: 'Expired',
  lastIssuedDate: '2023-01-10',
  expiryDate: '2023-12-31',
  cardNumber: 'IDC-2023-0045'
},
{
  id: '3',
  employeeId: 'EMP-2024-003',
  name: 'Michael Chen',
  designation: 'Admin Officer',
  department: 'Administration',
  email: 'michael.c@school.edu',
  phone: '+91 9876543203',
  bloodGroup: 'B+',
  joiningDate: '2020-01-10',
  address: '789 Office Complex, Admin Block',
  emergencyContact: '+91 9876543303',
  photo: '',
  isNewJoinee: false,
  idCardStatus: 'Lost',
  lastIssuedDate: '2024-02-01',
  expiryDate: '2025-12-31',
  cardNumber: 'IDC-2024-0023'
},
{
  id: '4',
  employeeId: 'EMP-2024-004',
  name: 'Priya Sharma',
  designation: 'Lab Assistant',
  department: 'Science',
  email: 'priya.s@school.edu',
  phone: '+91 9876543204',
  bloodGroup: 'AB+',
  joiningDate: '2023-08-01',
  address: '321 Science Park, Research Area',
  emergencyContact: '+91 9876543304',
  photo: '',
  isNewJoinee: true,
  idCardStatus: 'Under Process',
  lastIssuedDate: '',
  expiryDate: '',
  cardNumber: ''
},
{
  id: '5',
  employeeId: 'EMP-2024-005',
  name: 'David Wilson',
  designation: 'Sports Coach',
  department: 'Physical Education',
  email: 'david.w@school.edu',
  phone: '+91 9876543205',
  bloodGroup: 'O-',
  joiningDate: '2021-03-15',
  address: '654 Sports Complex, Stadium Road',
  emergencyContact: '+91 9876543305',
  photo: '',
  isNewJoinee: false,
  idCardStatus: 'Active',
  lastIssuedDate: '2024-03-01',
  expiryDate: '2025-12-31',
  cardNumber: 'IDC-2024-0067'
},
{
  id: '6',
  employeeId: 'EMP-2024-006',
  name: 'Anita Desai',
  designation: 'Librarian',
  department: 'Library',
  email: 'anita.d@school.edu',
  phone: '+91 9876543206',
  bloodGroup: 'A-',
  joiningDate: '2017-07-01',
  address: '987 Library Lane, Book Street',
  emergencyContact: '+91 9876543306',
  photo: '',
  isNewJoinee: false,
  idCardStatus: 'Active',
  lastIssuedDate: '2024-01-20',
  expiryDate: '2025-12-31',
  cardNumber: 'IDC-2024-0012'
},
{
  id: '7',
  employeeId: 'EMP-2024-007',
  name: 'James Anderson',
  designation: 'Music Teacher',
  department: 'Arts',
  email: 'james.a@school.edu',
  phone: '+91 9876543207',
  bloodGroup: 'B-',
  joiningDate: '2022-07-01',
  address: '147 Arts Center, Creative Block',
  emergencyContact: '+91 9876543307',
  photo: '',
  isNewJoinee: false,
  idCardStatus: 'Not Issued',
  lastIssuedDate: '',
  expiryDate: '',
  cardNumber: ''
},
{
  id: '8',
  employeeId: 'EMP-2024-008',
  name: 'Meera Patel',
  designation: 'Accountant',
  department: 'Accounts',
  email: 'meera.p@school.edu',
  phone: '+91 9876543208',
  bloodGroup: 'AB-',
  joiningDate: '2019-11-15',
  address: '258 Finance Tower, Accounts Block',
  emergencyContact: '+91 9876543308',
  photo: '',
  isNewJoinee: false,
  idCardStatus: 'Active',
  lastIssuedDate: '2024-02-15',
  expiryDate: '2025-12-31',
  cardNumber: 'IDC-2024-0034'
}];


const mockReissueRequests: ReissueRequest[] = [
{
  id: 'REQ-001',
  employeeId: 'EMP-2024-003',
  employeeName: 'Michael Chen',
  reason: 'Lost',
  description: 'ID card lost during commute',
  requestDate: '2024-03-10',
  status: 'Pending',
  priority: 'Urgent'
},
{
  id: 'REQ-002',
  employeeId: 'EMP-2024-002',
  employeeName: 'Sarah Jenkins',
  reason: 'Expired',
  description: 'Card expired, need renewal',
  requestDate: '2024-03-08',
  status: 'Approved',
  priority: 'Normal'
}];


const defaultCardElements: CardElement[] = [
{
  id: 'logo',
  type: 'image',
  label: 'School Logo',
  x: 20,
  y: 20,
  width: 60,
  height: 60,
  visible: true,
  style: {}
},
{
  id: 'school-name',
  type: 'text',
  label: 'School Name',
  x: 90,
  y: 30,
  width: 170,
  height: 30,
  visible: true,
  style: { fontSize: 16, fontWeight: 'bold', color: '#ffffff' }
},
{
  id: 'photo',
  type: 'image',
  label: 'Employee Photo',
  x: 90,
  y: 100,
  width: 100,
  height: 100,
  visible: true,
  style: { borderRadius: 50 }
},
{
  id: 'name',
  type: 'field',
  label: 'Employee Name',
  x: 40,
  y: 220,
  width: 200,
  height: 25,
  visible: true,
  style: { fontSize: 18, fontWeight: 'bold', color: '#ffffff', textAlign: 'center' },
  fieldMapping: 'name'
},
{
  id: 'designation',
  type: 'field',
  label: 'Designation',
  x: 40,
  y: 250,
  width: 200,
  height: 20,
  visible: true,
  style: { fontSize: 14, color: '#e0e0e0', textAlign: 'center' },
  fieldMapping: 'designation'
},
{
  id: 'department',
  type: 'field',
  label: 'Department',
  x: 40,
  y: 275,
  width: 200,
  height: 20,
  visible: true,
  style: { fontSize: 12, color: '#a0a0ff', textAlign: 'center' },
  fieldMapping: 'department'
},
{
  id: 'emp-id',
  type: 'field',
  label: 'Employee ID',
  x: 20,
  y: 320,
  width: 120,
  height: 40,
  visible: true,
  style: { fontSize: 12, color: '#333333', backgroundColor: '#ffffff' },
  fieldMapping: 'employeeId'
},
{
  id: 'blood-group',
  type: 'field',
  label: 'Blood Group',
  x: 160,
  y: 320,
  width: 80,
  height: 40,
  visible: true,
  style: { fontSize: 16, fontWeight: 'bold', color: '#ff0000', backgroundColor: '#ffffff' },
  fieldMapping: 'bloodGroup'
},
{
  id: 'qr-code',
  type: 'qr',
  label: 'QR Code',
  x: 20,
  y: 370,
  width: 60,
  height: 60,
  visible: true,
  style: {}
},
{
  id: 'validity',
  type: 'field',
  label: 'Valid Until',
  x: 100,
  y: 390,
  width: 140,
  height: 30,
  visible: true,
  style: { fontSize: 12, color: '#ffffff' },
  fieldMapping: 'expiryDate'
}];


// ==================== CARD DESIGN HELPERS ====================

const DEFAULT_CARD_BACKGROUND = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
const DESIGN_STORAGE_KEY = 'employeeIdCardDesign';
const VERTICAL_DIMS = { width: 280, height: 420 };
const HORIZONTAL_DIMS = { width: 420, height: 260 };
const DESIGN_INPUT_CLASS = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500';
const DESIGN_LABEL_CLASS = 'block text-xs font-medium text-gray-600 mb-1';
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const PHONE_PATTERN = /^(\+91)?[6-9]\d{9}$/;

const ELEMENT_PALETTE: { type: CardElementType; label: string; description: string; icon: React.ElementType }[] = [
  { type: 'text', label: 'Text', description: 'Fixed text, e.g. a title', icon: Type },
  { type: 'field', label: 'Employee Field', description: 'Name, ID, dates, etc.', icon: FileText },
  { type: 'image', label: 'Image / Photo', description: 'Upload any picture or logo', icon: Image },
  { type: 'qr', label: 'QR Code', description: 'Encodes a chosen field', icon: QrCode },
  { type: 'barcode', label: 'Barcode', description: 'Linear code for scanners', icon: Barcode },
  { type: 'shape', label: 'Shape', description: 'Box, band or divider', icon: Square }
];

const ELEMENT_SIZE: Record<CardElementType, { width: number; height: number }> = {
  text: { width: 140, height: 28 },
  field: { width: 160, height: 24 },
  image: { width: 80, height: 80 },
  qr: { width: 60, height: 60 },
  barcode: { width: 140, height: 40 },
  shape: { width: 120, height: 40 }
};

const FIELD_OPTIONS: { value: string; label: string }[] = [
  { value: 'name', label: 'Full Name' },
  { value: 'designation', label: 'Designation' },
  { value: 'department', label: 'Department' },
  { value: 'employeeId', label: 'Employee ID' },
  { value: 'bloodGroup', label: 'Blood Group' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'joiningDate', label: 'Date of Joining' },
  { value: 'expiryDate', label: 'Valid Until' },
  { value: 'emergencyContact', label: 'Emergency Contact' },
  { value: 'cardNumber', label: 'Card Number' }
];

const getCardDims = (orientation: 'vertical' | 'horizontal') =>
  orientation === 'vertical' ? VERTICAL_DIMS : HORIZONTAL_DIMS;

// Keeps element placement proportional when the card orientation changes
const scaleElements = (
  elements: CardElement[],
  from: { width: number; height: number },
  to: { width: number; height: number }
): CardElement[] => {
  const sx = to.width / from.width;
  const sy = to.height / from.height;
  return elements.map((el) => ({
    ...el,
    x: Math.round(el.x * sx),
    y: Math.round(el.y * sy),
    width: Math.max(10, Math.round(el.width * sx)),
    height: Math.max(10, Math.round(el.height * sy))
  }));
};

const toIsoDate = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const addYearsIso = (years: number): string => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + years);
  return toIsoDate(date);
};

const formatCardDate = (value: string): string =>
  value ? new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

const getFieldValue = (employee: Employee, key?: string): string => {
  switch (key) {
    case 'name': return employee.name;
    case 'designation': return employee.designation;
    case 'department': return employee.department;
    case 'employeeId': return employee.employeeId;
    case 'bloodGroup': return employee.bloodGroup;
    case 'email': return employee.email;
    case 'phone': return employee.phone;
    case 'joiningDate': return formatCardDate(employee.joiningDate);
    case 'expiryDate': return formatCardDate(employee.expiryDate);
    case 'emergencyContact': return employee.emergencyContact;
    case 'cardNumber': return employee.cardNumber;
    default: return '';
  }
};

const hashString = (value: string): number => {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

// Seeded generator so QR / barcode patterns stay stable across re-renders
const createRandom = (seed: string) => {
  let state = hashString(seed) || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
};

const buildQrPath = (seed: string): string => {
  const size = 21;
  const random = createRandom(seed);
  const finderCell = (row: number, col: number): boolean | null => {
    const corners = [[0, 0], [0, size - 7], [size - 7, 0]];
    for (const [r0, c0] of corners) {
      if (row >= r0 && row < r0 + 7 && col >= c0 && col < c0 + 7) {
        const r = row - r0;
        const c = col - c0;
        return r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4);
      }
    }
    return null;
  };
  let path = '';
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const dark = finderCell(row, col) ?? random() > 0.5;
      if (dark) path += `M${col} ${row}h1v1h-1z`;
    }
  }
  return path;
};

const buildBarcodeBars = (seed: string): { x: number; w: number }[] => {
  const random = createRandom(seed);
  const bars: { x: number; w: number }[] = [];
  let x = 2;
  while (x < 96) {
    const w = 1 + Math.floor(random() * 3);
    bars.push({ x, w });
    x += w + 1 + Math.floor(random() * 2);
  }
  return bars;
};

interface IssueCardForm {
  name: string;
  employeeId: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  bloodGroup: string;
  joiningDate: string;
  emergencyContact: string;
  address: string;
  validUntil: string;
  photo: string;
}

const createEmptyIssueForm = (): IssueCardForm => ({
  name: '',
  employeeId: '',
  designation: '',
  department: '',
  email: '',
  phone: '',
  bloodGroup: '',
  joiningDate: toIsoDate(new Date()),
  emergencyContact: '',
  address: '',
  validUntil: addYearsIso(1),
  photo: ''
});

interface CardFaceProps {
  employee: Employee;
  elements: CardElement[];
  background: string;
  orientation: 'vertical' | 'horizontal';
  editable?: boolean;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  onMove?: (id: string, x: number, y: number) => void;
  onResize?: (id: string, width: number, height: number) => void;
}

// Renders the card from its elements. Inline styles only, so the same markup works in the print window.
const CardFace: React.FC<CardFaceProps> = ({
  employee,
  elements,
  background,
  orientation,
  editable = false,
  selectedId = null,
  onSelect,
  onMove,
  onResize
}) => {
  const dims = getCardDims(orientation);
  const dragRef = useRef<{
    mode: 'move' | 'resize';
    id: string;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    originW: number;
    originH: number;
  } | null>(null);

  const beginDrag = (event: React.PointerEvent<HTMLDivElement>, el: CardElement, mode: 'move' | 'resize') => {
    if (!editable) return;
    event.stopPropagation();
    event.preventDefault();
    onSelect?.(el.id);
    dragRef.current = {
      mode,
      id: el.id,
      startX: event.clientX,
      startY: event.clientY,
      originX: el.x,
      originY: el.y,
      originW: el.width,
      originH: el.height
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const continueDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (drag.mode === 'move') {
      const el = elements.find((item) => item.id === drag.id);
      if (!el) return;
      const x = Math.min(Math.max(0, drag.originX + dx), Math.max(0, dims.width - el.width));
      const y = Math.min(Math.max(0, drag.originY + dy), Math.max(0, dims.height - el.height));
      onMove?.(drag.id, Math.round(x), Math.round(y));
    } else {
      const width = Math.min(Math.max(16, drag.originW + dx), dims.width - drag.originX);
      const height = Math.min(Math.max(16, drag.originH + dy), dims.height - drag.originY);
      onResize?.(drag.id, Math.round(width), Math.round(height));
    }
  };

  const endDrag = () => {
    dragRef.current = null;
  };

  const renderContent = (el: CardElement) => {
    const textAlign = (el.style.textAlign as React.CSSProperties['textAlign']) || 'left';
    switch (el.type) {
      case 'text':
        return <span style={{ width: '100%', textAlign }}>{el.content ?? el.label}</span>;
      case 'field':
        return <span style={{ width: '100%', textAlign }}>{getFieldValue(employee, el.fieldMapping)}</span>;
      case 'image': {
        const src = el.imageSrc || (el.id === 'photo' ? employee.photo : '');
        if (src) {
          return (
            <img
              src={src}
              alt={el.label}
              draggable={false}
              style={{ width: '100%', height: '100%', objectFit: el.imageFit ?? 'cover', display: 'block' }} />);

        }
        const Icon = el.id === 'photo' ? User : Building2;
        return (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', background: 'rgba(255,255,255,0.7)' }}>
            <Icon width="45%" height="45%" />
          </div>);

      }
      case 'qr': {
        const seed = `${employee.employeeId}|${el.id}|${getFieldValue(employee, el.fieldMapping ?? 'employeeId')}`;
        return (
          <svg viewBox="0 0 21 21" width="100%" height="100%" shapeRendering="crispEdges">
            <rect width="21" height="21" fill="#ffffff" />
            <path d={buildQrPath(seed)} fill="#111827" />
          </svg>);

      }
      case 'barcode': {
        const seed = getFieldValue(employee, el.fieldMapping ?? 'employeeId');
        return (
          <svg viewBox="0 0 100 40" width="100%" height="100%" preserveAspectRatio="none">
            <rect width="100" height="40" fill="#ffffff" />
            {buildBarcodeBars(seed).map((bar) => (
              <rect key={bar.x} x={bar.x} y={3} width={bar.w} height={34} fill="#111827" />
            ))}
          </svg>);

      }
      default:
        return null;
    }
  };

  return (
    <div
      onPointerDown={() => {
        if (editable) onSelect?.('');
      }}
      style={{
        position: 'relative',
        width: dims.width,
        height: dims.height,
        overflow: 'hidden',
        borderRadius: 12,
        background,
        boxShadow: editable ? '0 25px 50px -12px rgba(0,0,0,0.25)' : undefined,
        flexShrink: 0
      }}>
      {elements.map((el) => {
        if (!el.visible && !editable) return null;
        const isSelected = editable && selectedId === el.id;
        const justify = el.style.textAlign === 'center' ? 'center' : el.style.textAlign === 'right' ? 'flex-end' : 'flex-start';
        const style: React.CSSProperties = {
          position: 'absolute',
          left: el.x,
          top: el.y,
          width: el.width,
          height: el.height,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: justify,
          fontSize: el.style.fontSize,
          fontWeight: el.style.fontWeight as React.CSSProperties['fontWeight'],
          color: el.style.color,
          backgroundColor: el.style.backgroundColor,
          borderRadius: el.style.borderRadius,
          borderWidth: el.style.borderWidth ?? 0,
          borderStyle: el.style.borderWidth ? 'solid' : undefined,
          borderColor: el.style.borderColor,
          opacity: el.visible ? 1 : 0.35,
          lineHeight: 1.2,
          overflow: 'hidden',
          cursor: editable ? 'move' : undefined,
          outline: isSelected ? '2px solid #6366f1' : undefined,
          outlineOffset: 2,
          touchAction: editable ? 'none' : undefined
        };
        return (
          <div
            key={el.id}
            title={editable ? el.label : undefined}
            style={style}
            onPointerDown={(event) => beginDrag(event, el, 'move')}
            onPointerMove={continueDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}>
            {renderContent(el)}
            {isSelected &&
            <div
              onPointerDown={(event) => beginDrag(event, el, 'resize')}
              onPointerMove={continueDrag}
              onPointerUp={endDrag}
              style={{ position: 'absolute', right: -6, bottom: -6, width: 12, height: 12, background: '#6366f1', border: '2px solid #ffffff', borderRadius: 3, cursor: 'nwse-resize' }} />}
          </div>);

      })}
    </div>);

};

const readSavedDesign = (): { elements: CardElement[]; background: string; orientation: 'vertical' | 'horizontal' } | null => {
  try {
    const raw = window.localStorage.getItem(DESIGN_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.elements)) return null;
    return {
      elements: parsed.elements as CardElement[],
      background: typeof parsed.background === 'string' ? parsed.background : DEFAULT_CARD_BACKGROUND,
      orientation: parsed.orientation === 'horizontal' ? 'horizontal' : 'vertical'
    };
  } catch {
    return null;
  }
};

// Opens a print-ready window with one card per page. The browser's "Save as PDF" destination produces the PDF.
const openCardPrintWindow = (
  cards: Employee[],
  elements: CardElement[],
  background: string,
  orientation: 'vertical' | 'horizontal',
  title: string
): boolean => {
  const win = window.open('', '_blank');
  if (!win) return false;
  const dims = getCardDims(orientation);
  const pages = cards
    .map((employee) =>
      `<div class="page">${renderToStaticMarkup(
        <CardFace employee={employee} elements={elements} background={background} orientation={orientation} />
      )}</div>`)
    .join('');
  win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8" /><title>${title}</title><style>@page{size:${dims.width}px ${dims.height}px;margin:0}html,body{margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background:#fff}.page{width:${dims.width}px;height:${dims.height}px;overflow:hidden;page-break-after:always;break-after:page}.page:last-child{page-break-after:auto;break-after:auto}</style></head><body>${pages}</body></html>`);
  win.document.close();
  win.focus();
  window.setTimeout(() => win.print(), 300);
  return true;
};

const departments = ['Mathematics', 'English', 'Science', 'Hindi', 'Physical Education', 'Arts', 'Library', 'Accounts', 'Administration', 'IT'];
const designations = ['HOD', 'Senior Teacher', 'Teacher', 'Admin Officer', 'Lab Assistant', 'Sports Coach', 'Librarian', 'Accountant'];
const reissueReasons = ['Lost', 'Damaged', 'Expired', 'Name Change', 'Designation Change', 'Other'];

export function EmployeeIDCardGenerator() {
  // Tab State
  const [activeTab, setActiveTab] = useState<'cards' | 'design' | 'requests'>('cards');

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const searchRef = useRef<HTMLDivElement>(null);

  // Employee States
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<Set<string>>(new Set());
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);

  // Modal States
  const [showReissueModal, setShowReissueModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showReportLostModal, setShowReportLostModal] = useState(false);

  // Reissue Form States
  const [reissueReason, setReissueReason] = useState('');
  const [reissueDescription, setReissueDescription] = useState('');
  const [reissuePriority, setReissuePriority] = useState('Normal');
  const [reissueRequests, setReissueRequests] = useState<ReissueRequest[]>(mockReissueRequests);

  // Card Design States
  const [cardView, setCardView] = useState<'front' | 'back'>('front');
  const savedDesign = useMemo(() => readSavedDesign(), []);
  const [cardElements, setCardElements] = useState<CardElement[]>(savedDesign?.elements ?? defaultCardElements);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [cardOrientation, setCardOrientation] = useState<'vertical' | 'horizontal'>(savedDesign?.orientation ?? 'vertical');
  const [cardBackground, setCardBackground] = useState(savedDesign?.background ?? DEFAULT_CARD_BACKGROUND);
  const [showElementPanel, setShowElementPanel] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Card design preview, print feedback and issue-card form state
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueForm, setIssueForm] = useState<IssueCardForm>(createEmptyIssueForm);
  const [issueErrors, setIssueErrors] = useState<Record<string, string>>({});
  const [previewEmployeeId, setPreviewEmployeeId] = useState<string>(mockEmployees[0].id);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const selectedEl = cardElements.find((el) => el.id === selectedElement) ?? null;
  const selectedCards = employees.filter((emp) => selectedEmployees.has(emp.id));
  const previewEmployee = employees.find((emp) => emp.id === previewEmployeeId) ?? employees[0];
  const clampNumber = (raw: string, min: number, max: number) => Math.min(Math.max(Number(raw) || 0, min), Math.max(min, max));

  const itemsPerPage = 10;

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered Employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch = searchQuery === '' ||
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDepartment = selectedDepartment === 'all' || emp.department === selectedDepartment;
      const matchesStatus = selectedStatus === 'all' || emp.idCardStatus === selectedStatus;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [employees, searchQuery, selectedDepartment, selectedStatus]);

  // Search Results
  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    return employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);
  }, [employees, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleSelectEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const handleToggleSelection = (id: string) => {
    const newSelection = new Set(selectedEmployees);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedEmployees(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedEmployees.size === filteredEmployees.length) {
      setSelectedEmployees(new Set());
    } else {
      setSelectedEmployees(new Set(filteredEmployees.map((e) => e.id)));
    }
  };

  const handleViewCard = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowViewModal(true);
    setShowActionsMenu(null);
  };

  const handleReissue = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowReissueModal(true);
    setShowActionsMenu(null);
    setReissueReason('');
    setReissueDescription('');
    setReissuePriority('Normal');
  };

  const handleReportLost = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowReportLostModal(true);
    setShowActionsMenu(null);
  };

  const handleSubmitReissue = () => {
    if (!selectedEmployee || !reissueReason) return;

    const newRequest: ReissueRequest = {
      id: `REQ-${Date.now()}`,
      employeeId: selectedEmployee.employeeId,
      employeeName: selectedEmployee.name,
      reason: reissueReason as any,
      description: reissueDescription,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      priority: reissuePriority as any
    };

    setReissueRequests([newRequest, ...reissueRequests]);
    setShowReissueModal(false);
    setSelectedEmployee(null);
  };

  const handleSubmitLostReport = () => {
    if (!selectedEmployee) return;

    const newRequest: ReissueRequest = {
      id: `REQ-${Date.now()}`,
      employeeId: selectedEmployee.employeeId,
      employeeName: selectedEmployee.name,
      reason: 'Lost',
      description: 'ID card reported as lost',
      requestDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      priority: 'Urgent'
    };

    setReissueRequests([newRequest, ...reissueRequests]);
    setShowReportLostModal(false);
    setSelectedEmployee(null);
  };

  const handleAddElement = (type: CardElementType) => {
    const dims = getCardDims(cardOrientation);
    const size = ELEMENT_SIZE[type];
    const id = `${type}-${Date.now()}`;
    const typeLabel = ELEMENT_PALETTE.find((item) => item.type === type)?.label ?? type;
    const newElement: CardElement = {
      id,
      type,
      label: `${typeLabel} ${cardElements.filter((el) => el.type === type).length + 1}`,
      x: Math.round((dims.width - size.width) / 2),
      y: Math.round((dims.height - size.height) / 2),
      width: size.width,
      height: size.height,
      visible: true,
      style: type === 'text' || type === 'field'
        ? { fontSize: 14, fontWeight: 'normal', color: '#ffffff', textAlign: 'center' }
        : type === 'shape'
          ? { backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 8 }
          : {},
      fieldMapping: type === 'field' ? 'name' : type === 'qr' || type === 'barcode' ? 'employeeId' : undefined,
      content: type === 'text' ? 'Your text' : undefined
    };
    setCardElements((prev) => [...prev, newElement]);
    setSelectedElement(id);
  };

  const updateElement = (elementId: string, patch: Partial<CardElement>) => {
    setCardElements((prev) => prev.map((el) => (el.id === elementId ? { ...el, ...patch } : el)));
  };

  const updateElementStyle = (elementId: string, patch: Partial<CardElement['style']>) => {
    setCardElements((prev) => prev.map((el) => (el.id === elementId ? { ...el, style: { ...el.style, ...patch } } : el)));
  };

  const moveElement = (elementId: string, x: number, y: number) => updateElement(elementId, { x, y });

  const resizeElement = (elementId: string, width: number, height: number) => updateElement(elementId, { width, height });

  const changeOrientation = (next: 'vertical' | 'horizontal') => {
    if (next === cardOrientation) return;
    setCardElements((prev) => scaleElements(prev, getCardDims(cardOrientation), getCardDims(next)));
    setCardOrientation(next);
  };

  const resetDesign = () => {
    setCardElements(cardOrientation === 'vertical' ? defaultCardElements : scaleElements(defaultCardElements, VERTICAL_DIMS, HORIZONTAL_DIMS));
    setSelectedElement(null);
    setNotice({ type: 'success', text: 'Design reset to the default layout. Click Save Design to keep it.' });
  };

  const handleImageUpload = (elementId: string, file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setNotice({ type: 'error', text: 'Please choose an image file (PNG, JPG, SVG or WebP).' });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setNotice({ type: 'error', text: 'Image is larger than 2 MB. Please choose a smaller image.' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => updateElement(elementId, { imageSrc: String(reader.result) });
    reader.readAsDataURL(file);
  };

  const saveDesign = () => {
    try {
      window.localStorage.setItem(DESIGN_STORAGE_KEY, JSON.stringify({
        elements: cardElements,
        background: cardBackground,
        orientation: cardOrientation,
        savedAt: new Date().toISOString()
      }));
      setNotice({ type: 'success', text: 'Card design saved. The layout is kept in this browser and is used for previews and printing.' });
    } catch {
      setNotice({ type: 'error', text: 'The design could not be saved because browser storage is full. Remove large images and try again.' });
    }
  };

  const printCards = (cards: Employee[], title: string) => {
    if (cards.length === 0) return;
    const opened = openCardPrintWindow(cards, cardElements, cardBackground, cardOrientation, title);
    if (!opened) {
      setNotice({ type: 'error', text: 'Pop-up blocked. Allow pop-ups for this site to print or save the card as PDF.' });
    }
  };

  const updateRequestStatus = (requestId: string, status: ReissueRequest['status']) => {
    setReissueRequests((prev) => prev.map((req) => (req.id === requestId ? { ...req, status } : req)));
  };

  const processRequest = (request: ReissueRequest) => {
    const today = toIsoDate(new Date());
    const newCardNumber = `CARD-${today.replace(/-/g, '')}-R${request.id.slice(-4)}`;
    setReissueRequests((prev) => prev.map((req) => (req.id === request.id ? { ...req, status: 'Completed' } : req)));
    setEmployees((prev) => prev.map((emp) => (
      emp.employeeId === request.employeeId
        ? { ...emp, idCardStatus: 'Active', lastIssuedDate: today, cardNumber: newCardNumber }
        : emp
    )));
    setNotice({ type: 'success', text: `New card issued for ${request.employeeName}. The request is marked as completed.` });
  };

  const viewRequestEmployee = (request: ReissueRequest) => {
    const emp = employees.find((item) => item.employeeId === request.employeeId);
    if (!emp) {
      setNotice({ type: 'error', text: `No employee record found for ${request.employeeName}.` });
      return;
    }
    handleViewCard(emp);
  };

  const openIssueModal = () => {
    const form = createEmptyIssueForm();
    let number = employees.length + 1;
    let suggestedId = `EMP-${new Date().getFullYear()}-${String(number).padStart(3, '0')}`;
    while (employees.some((emp) => emp.employeeId.toLowerCase() === suggestedId.toLowerCase())) {
      number += 1;
      suggestedId = `EMP-${new Date().getFullYear()}-${String(number).padStart(3, '0')}`;
    }
    setIssueForm({ ...form, employeeId: suggestedId });
    setIssueErrors({});
    setShowIssueModal(true);
  };

  const validateIssueForm = (form: IssueCardForm): Record<string, string> => {
    const errors: Record<string, string> = {};
    const today = toIsoDate(new Date());
    const email = form.email.trim();
    const phoneDigits = form.phone.replace(/[\s-]/g, '');
    const emergencyDigits = form.emergencyContact.replace(/[\s-]/g, '');
    if (form.name.trim().length < 3) errors.name = 'Enter the full name (at least 3 characters).';
    if (!form.employeeId.trim()) {
      errors.employeeId = 'Employee ID is required.';
    } else if (employees.some((emp) => emp.employeeId.toLowerCase() === form.employeeId.trim().toLowerCase())) {
      errors.employeeId = 'This Employee ID already has a card.';
    }
    if (!form.designation) errors.designation = 'Select a designation.';
    if (!form.department) errors.department = 'Select a department.';
    if (!email) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Enter a valid email address.';
    } else if (employees.some((emp) => emp.email.toLowerCase() === email.toLowerCase())) {
      errors.email = 'This email is already used by another card.';
    }
    if (!phoneDigits) {
      errors.phone = 'Phone number is required.';
    } else if (!PHONE_PATTERN.test(phoneDigits)) {
      errors.phone = 'Enter a valid 10-digit mobile number (optionally with +91).';
    }
    if (emergencyDigits && !PHONE_PATTERN.test(emergencyDigits)) {
      errors.emergencyContact = 'Enter a valid 10-digit mobile number.';
    }
    if (!form.joiningDate) errors.joiningDate = 'Joining date is required.';
    if (!form.bloodGroup) errors.bloodGroup = 'Select a blood group.';
    if (!form.validUntil) {
      errors.validUntil = 'Card validity date is required.';
    } else if (form.validUntil <= today) {
      errors.validUntil = 'Validity must be a future date.';
    }
    return errors;
  };

  const handleIssueCard = () => {
    const errors = validateIssueForm(issueForm);
    setIssueErrors(errors);
    if (Object.keys(errors).length > 0) return;
    const today = toIsoDate(new Date());
    const newEmployee: Employee = {
      id: `NEW-${Date.now()}`,
      employeeId: issueForm.employeeId.trim(),
      name: issueForm.name.trim(),
      designation: issueForm.designation,
      department: issueForm.department,
      email: issueForm.email.trim(),
      phone: issueForm.phone.trim(),
      bloodGroup: issueForm.bloodGroup,
      joiningDate: issueForm.joiningDate,
      address: issueForm.address.trim(),
      emergencyContact: issueForm.emergencyContact.trim(),
      photo: issueForm.photo,
      isNewJoinee: true,
      idCardStatus: 'Active',
      lastIssuedDate: today,
      expiryDate: issueForm.validUntil,
      cardNumber: `CARD-${today.replace(/-/g, '')}-${String(employees.length + 1).padStart(3, '0')}`
    };
    setEmployees((prev) => [newEmployee, ...prev]);
    setCurrentPage(1);
    setActiveTab('cards');
    setShowIssueModal(false);
    setNotice({ type: 'success', text: `ID card issued for ${newEmployee.name} (${newEmployee.employeeId}). The card is now listed in ID Cards.` });
  };

  const handleIssuePhotoUpload = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 2 * 1024 * 1024) {
      setIssueErrors((prev) => ({ ...prev, photo: 'Choose an image file under 2 MB.' }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setIssueForm((prev) => ({ ...prev, photo: String(reader.result) }));
    reader.readAsDataURL(file);
  };


  const handleDeleteElement = (elementId: string) => {
    setCardElements((prev) => prev.filter((el) => el.id !== elementId));
    setSelectedElement(null);
  };

  const handleImportDesign = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const design = JSON.parse(event.target?.result as string);
            if (design.elements) {
              setCardElements(design.elements);
            }
            if (design.background) {
              setCardBackground(design.background);
            }
            if (design.orientation) {
              setCardOrientation(design.orientation);
            }
          } catch (error) {
            console.error('Invalid design file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExportDesign = () => {
    const design = {
      elements: cardElements,
      background: cardBackground,
      orientation: cardOrientation
    };
    const blob = new Blob([JSON.stringify(design, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'id-card-design.json';
    a.click();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Expired':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Lost':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Under Process':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Not Issued':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="w-4 h-4" />;
      case 'Expired':
        return <XCircle className="w-4 h-4" />;
      case 'Lost':
        return <AlertTriangle className="w-4 h-4" />;
      case 'Under Process':
        return <Clock className="w-4 h-4" />;
      case 'Not Issued':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // QR Code Component
  // ID Card Preview Component
  const IDCardPreview = ({ employee, view }: {employee: Employee;view: 'front' | 'back';}) =>
  <div
    className={`${cardOrientation === 'vertical' ? 'w-[280px] h-[420px]' : 'w-[420px] h-[260px]'} rounded-xl overflow-hidden shadow-2xl border border-gray-200`}
    style={{ background: cardBackground }}>

      {view === 'front' ?
    <CardFace employee={employee} elements={cardElements} background={cardBackground} orientation={cardOrientation} /> :

    <div className="h-full bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col">
          {/* Magnetic Strip */}
          <div className="h-12 bg-gray-800 mt-6" />

          {/* Info Section */}
          <div className="flex-1 px-4 py-4 space-y-3">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Phone className="w-3 h-3 text-gray-400" />
                <p className="text-[10px] text-gray-500 uppercase">Phone</p>
              </div>
              <p className="text-xs text-gray-800">{employee.phone}</p>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Mail className="w-3 h-3 text-gray-400" />
                <p className="text-[10px] text-gray-500 uppercase">Email</p>
              </div>
              <p className="text-xs text-gray-800 break-all">{employee.email}</p>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-3 h-3 text-gray-400" />
                <p className="text-[10px] text-gray-500 uppercase">Address</p>
              </div>
              <p className="text-xs text-gray-800 line-clamp-2">{employee.address}</p>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Smartphone className="w-3 h-3 text-gray-400" />
                <p className="text-[10px] text-gray-500 uppercase">Emergency Contact</p>
              </div>
              <p className="text-xs text-gray-800">{employee.emergencyContact}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-indigo-600 text-center">
            <p className="text-[10px] text-white">If found, please return to HR Department</p>
            <p className="text-[10px] text-indigo-200">Tel: +91 9876543000</p>
          </div>
        </div>
    }
    </div>;


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employee ID Card Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              Generate, manage, and design employee ID cards
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={openIssueModal}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              <UserPlus className="w-4 h-4" />
              Issue New Card
            </button>
            <button
              onClick={handleSelectAll}
              disabled={filteredEmployees.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50">

              {selectedEmployees.size === filteredEmployees.length && filteredEmployees.length > 0 ?
              <CheckSquare className="w-4 h-4 text-indigo-600" /> :

              <Square className="w-4 h-4" />
              }
              <span className="text-sm">Select All</span>
            </button>
            <button
              onClick={() => printCards(selectedCards, 'Print ID cards')}
              disabled={selectedEmployees.size === 0}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50">

              <Printer className="w-4 h-4" />
              <span className="text-sm">Print ({selectedEmployees.size})</span>
            </button>
            <button
              onClick={() => printCards(selectedCards, 'Export PDF')}
              disabled={selectedEmployees.size === 0}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">

              <FileDown className="w-4 h-4" />
              <span className="text-sm">Export PDF</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('cards')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'cards' ?
              'border-indigo-600 text-indigo-600' :
              'border-transparent text-gray-500 hover:text-gray-700'}`
              }>

              <CreditCard className="w-4 h-4" />
              ID Cards
            </button>
            <button
              onClick={() => setActiveTab('design')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'design' ?
              'border-indigo-600 text-indigo-600' :
              'border-transparent text-gray-500 hover:text-gray-700'}`
              }>

              <Palette className="w-4 h-4" />
              Card Design Editor
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'requests' ?
              'border-indigo-600 text-indigo-600' :
              'border-transparent text-gray-500 hover:text-gray-700'}`
              }>

              <History className="w-4 h-4" />
              Reissue Requests
              {reissueRequests.filter((r) => r.status === 'Pending').length > 0 &&
              <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                  {reissueRequests.filter((r) => r.status === 'Pending').length}
                </span>
              }
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {notice &&
            <div className={`mb-4 flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${notice.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                <span>{notice.text}</span>
                <button type="button" onClick={() => setNotice(null)} className="opacity-70 hover:opacity-100">
                  <X className="w-4 h-4" />
                </button>
              </div>}
            {/* ID CARDS TAB */}
            {activeTab === 'cards' &&
            <div className="space-y-6">
                {/* Search and Filters */}
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search */}
                  <div ref={searchRef} className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                    type="text"
                    placeholder="Search employee by name or ID..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSearchResults(true);
                    }}
                    onFocus={() => setShowSearchResults(true)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />

                    {searchQuery &&
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">

                        <X className="w-4 h-4" />
                      </button>
                  }

                    {/* Search Dropdown */}
                    {showSearchResults && searchResults.length > 0 &&
                  <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                        {searchResults.map((employee) =>
                    <button
                      key={employee.id}
                      onClick={() => handleSelectEmployee(employee)}
                      className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">

                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-semibold">
                              {employee.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                            </div>
                            <div className="flex-1 text-left">
                              <p className="font-medium text-gray-900">{employee.name}</p>
                              <p className="text-sm text-gray-500">{employee.employeeId} • {employee.designation}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(employee.idCardStatus)}`}>
                              {employee.idCardStatus}
                            </span>
                          </button>
                    )}
                      </div>
                  }
                  </div>

                  {/* Filters */}
                  <div className="flex gap-3">
                    <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="px-3 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm">

                      <option value="all">All Departments</option>
                      {departments.map((dept) =>
                    <option key={dept} value={dept}>{dept}</option>
                    )}
                    </select>
                    <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm">

                      <option value="all">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Expired">Expired</option>
                      <option value="Lost">Lost</option>
                      <option value="Under Process">Under Process</option>
                      <option value="Not Issued">Not Issued</option>
                    </select>
                  </div>
                </div>

                {/* Employee Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left">
                          <button onClick={handleSelectAll} className="p-1 hover:bg-gray-200 rounded">
                            {selectedEmployees.size === filteredEmployees.length && filteredEmployees.length > 0 ?
                          <CheckSquare className="w-4 h-4 text-indigo-600" /> :

                          <Square className="w-4 h-4 text-gray-400" />
                          }
                          </button>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Employee</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Department</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Card Number</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Issued / Expiry</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paginatedEmployees.map((employee) =>
                    <tr key={employee.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <button
                          onClick={() => handleToggleSelection(employee.id)}
                          className="p-1 hover:bg-gray-200 rounded">

                              {selectedEmployees.has(employee.id) ?
                          <CheckSquare className="w-4 h-4 text-indigo-600" /> :

                          <Square className="w-4 h-4 text-gray-400" />
                          }
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-semibold text-sm">
                                {employee.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{employee.name}</p>
                                <p className="text-xs text-gray-500">{employee.employeeId}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <p className="text-sm text-gray-900">{employee.department}</p>
                              <p className="text-xs text-gray-500">{employee.designation}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-mono text-sm text-gray-600">
                              {employee.cardNumber || 'N/A'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(employee.idCardStatus)}`}>
                              {getStatusIcon(employee.idCardStatus)}
                              {employee.idCardStatus}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-xs">
                              <p className="text-gray-600">
                                <span className="text-gray-400">Issued:</span> {formatDate(employee.lastIssuedDate)}
                              </p>
                              <p className="text-gray-600">
                                <span className="text-gray-400">Expiry:</span> {formatDate(employee.expiryDate)}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="relative flex items-center gap-1">
                              <button
                            onClick={() => handleViewCard(employee)}
                            className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                            title="View Card">

                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                            onClick={() => setShowActionsMenu(showActionsMenu === employee.id ? null : employee.id)}
                            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors">

                                <MoreHorizontal className="w-4 h-4" />
                              </button>

                              {showActionsMenu === employee.id &&
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                  <button
                              onClick={() => handleViewCard(employee)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">

                                    <Eye className="w-4 h-4" />
                                    View ID Card
                                  </button>
                                  <button
                              onClick={() => handleReissue(employee)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">

                                    <RefreshCw className="w-4 h-4" />
                                    Re-issue Card
                                  </button>
                                  <button
                              onClick={() => handleReportLost(employee)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600">

                                    <AlertTriangle className="w-4 h-4" />
                                    Report Lost
                                  </button>
                                  <hr className="my-1" />
                                  <button
                              onClick={() => { printCards([employee], 'Print ID card'); setShowActionsMenu(null); }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">

                                    <Printer className="w-4 h-4" />
                                    Print Card
                                  </button>
                                  <button
                              onClick={() => { printCards([employee], 'Save ID card as PDF'); setShowActionsMenu(null); }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">

                                    <Download className="w-4 h-4" />
                                    Download PDF
                                  </button>
                                </div>
                          }
                            </div>
                          </td>
                        </tr>
                    )}
                    </tbody>
                  </table>

                  {paginatedEmployees.length === 0 &&
                <div className="text-center py-12">
                      <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No employees found</h3>
                      <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
                    </div>
                }
                </div>

                {/* Pagination */}
                {totalPages > 1 &&
              <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredEmployees.length)} of {filteredEmployees.length}
                    </p>
                    <div className="flex gap-1">
                      <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50">

                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) =>
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium ${
                    currentPage === i + 1 ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'}`
                    }>

                          {i + 1}
                        </button>
                  )}
                      <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50">

                        Next
                      </button>
                    </div>
                  </div>
              }
              </div>
            }

            {/* CARD DESIGN EDITOR TAB */}
            {activeTab === 'design' &&
            <div className="flex flex-col xl:flex-row gap-6">
                {/* Left panel: card settings, element palette, layers and element properties */}
                <div className="w-full xl:w-96 flex-shrink-0 space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Card Settings
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className={DESIGN_LABEL_CLASS}>Orientation</label>
                        <div className="flex gap-2">
                          {(['vertical', 'horizontal'] as const).map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => changeOrientation(option)}
                              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${cardOrientation === option ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 hover:bg-gray-50'}`}>
                              {option === 'vertical' ? 'Vertical' : 'Horizontal'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className={DESIGN_LABEL_CLASS}>Background</label>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                          'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                          'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
                          'linear-gradient(135deg, #373b44 0%, #4286f4 100%)',
                          'linear-gradient(135deg, #f12711 0%, #f5af19 100%)',
                          'linear-gradient(135deg, #654ea3 0%, #eaafc8 100%)',
                          '#ffffff',
                          '#1f2937'].map((bg) => (
                            <button
                              key={bg}
                              type="button"
                              aria-label="Set card background"
                              onClick={() => setCardBackground(bg)}
                              className={`h-10 rounded-lg border-2 ${cardBackground === bg ? 'border-indigo-600' : 'border-transparent'}`}
                              style={{ background: bg }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Element
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {ELEMENT_PALETTE.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.type}
                            type="button"
                            onClick={() => handleAddElement(item.type)}
                            className="flex items-start gap-2 p-2.5 bg-white border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 text-left transition-colors">
                            <Icon className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                            <span className="min-w-0">
                              <span className="block text-sm font-medium text-gray-900">{item.label}</span>
                              <span className="block text-[11px] leading-tight text-gray-500">{item.description}</span>
                            </span>
                          </button>);

                      })}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Layers className="w-4 h-4" />
                      Elements ({cardElements.length})
                    </h3>
                    <div className="space-y-1.5 max-h-56 overflow-y-auto">
                      {cardElements.map((element) => (
                        <div
                          key={element.id}
                          className={`flex items-center justify-between gap-2 p-2 rounded-lg border cursor-pointer ${selectedElement === element.id ? 'bg-indigo-50 border-indigo-300' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                          onClick={() => setSelectedElement(element.id)}>
                          <span className="text-sm text-gray-800 truncate">{element.label}</span>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              type="button"
                              title={element.visible ? 'Hide element' : 'Show element'}
                              onClick={(e) => {
                                e.stopPropagation();
                                updateElement(element.id, { visible: !element.visible });
                              }}
                              className="p-1 text-gray-500 hover:text-gray-800">
                              {element.visible ? <Eye className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                            </button>
                            <button
                              type="button"
                              title="Delete element"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteElement(element.id);
                              }}
                              className="p-1 text-gray-500 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {cardElements.length === 0 && <p className="text-xs text-gray-500">No elements yet. Add one above.</p>}
                    </div>
                  </div>

                  {selectedEl &&
                  <div className="bg-white rounded-lg p-4 border border-indigo-200 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                          <Edit className="w-4 h-4" />
                          Element Properties
                        </h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 capitalize">{selectedEl.type}</span>
                      </div>

                      <div>
                        <label className={DESIGN_LABEL_CLASS}>Name</label>
                        <input
                          type="text"
                          value={selectedEl.label}
                          onChange={(e) => updateElement(selectedEl.id, { label: e.target.value })}
                          className={DESIGN_INPUT_CLASS} />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className={DESIGN_LABEL_CLASS}>X (px)</label>
                          <input type="number" value={selectedEl.x} min={0}
                            onChange={(e) => updateElement(selectedEl.id, { x: clampNumber(e.target.value, 0, getCardDims(cardOrientation).width - selectedEl.width) })}
                            className={DESIGN_INPUT_CLASS} />
                        </div>
                        <div>
                          <label className={DESIGN_LABEL_CLASS}>Y (px)</label>
                          <input type="number" value={selectedEl.y} min={0}
                            onChange={(e) => updateElement(selectedEl.id, { y: clampNumber(e.target.value, 0, getCardDims(cardOrientation).height - selectedEl.height) })}
                            className={DESIGN_INPUT_CLASS} />
                        </div>
                        <div>
                          <label className={DESIGN_LABEL_CLASS}>Width (px)</label>
                          <input type="number" value={selectedEl.width} min={16}
                            onChange={(e) => updateElement(selectedEl.id, { width: clampNumber(e.target.value, 16, getCardDims(cardOrientation).width - selectedEl.x) })}
                            className={DESIGN_INPUT_CLASS} />
                        </div>
                        <div>
                          <label className={DESIGN_LABEL_CLASS}>Height (px)</label>
                          <input type="number" value={selectedEl.height} min={16}
                            onChange={(e) => updateElement(selectedEl.id, { height: clampNumber(e.target.value, 16, getCardDims(cardOrientation).height - selectedEl.y) })}
                            className={DESIGN_INPUT_CLASS} />
                        </div>
                      </div>

                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={selectedEl.visible}
                          onChange={(e) => updateElement(selectedEl.id, { visible: e.target.checked })} />
                        Show on card
                      </label>

                      {selectedEl.type === 'text' &&
                      <div>
                          <label className={DESIGN_LABEL_CLASS}>Text</label>
                          <input
                            type="text"
                            value={selectedEl.content ?? ''}
                            onChange={(e) => updateElement(selectedEl.id, { content: e.target.value })}
                            className={DESIGN_INPUT_CLASS} />
                        </div>}

                      {selectedEl.type === 'field' &&
                      <div>
                          <label className={DESIGN_LABEL_CLASS}>Data field</label>
                          <select
                            value={selectedEl.fieldMapping ?? 'name'}
                            onChange={(e) => updateElement(selectedEl.id, { fieldMapping: e.target.value })}
                            className={DESIGN_INPUT_CLASS}>
                            {FIELD_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </div>}

                      {(selectedEl.type === 'qr' || selectedEl.type === 'barcode') &&
                      <div>
                          <label className={DESIGN_LABEL_CLASS}>Encodes</label>
                          <select
                            value={selectedEl.fieldMapping ?? 'employeeId'}
                            onChange={(e) => updateElement(selectedEl.id, { fieldMapping: e.target.value })}
                            className={DESIGN_INPUT_CLASS}>
                            <option value="employeeId">Employee ID</option>
                            <option value="cardNumber">Card Number</option>
                            <option value="name">Full Name</option>
                            <option value="phone">Phone</option>
                          </select>
                        </div>}

                      {(selectedEl.type === 'text' || selectedEl.type === 'field') &&
                      <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className={DESIGN_LABEL_CLASS}>Font size</label>
                            <input type="number" min={6} max={48} value={selectedEl.style.fontSize ?? 12}
                              onChange={(e) => updateElementStyle(selectedEl.id, { fontSize: clampNumber(e.target.value, 6, 48) })}
                              className={DESIGN_INPUT_CLASS} />
                          </div>
                          <div>
                            <label className={DESIGN_LABEL_CLASS}>Weight</label>
                            <select
                              value={selectedEl.style.fontWeight ?? 'normal'}
                              onChange={(e) => updateElementStyle(selectedEl.id, { fontWeight: e.target.value })}
                              className={DESIGN_INPUT_CLASS}>
                              <option value="normal">Normal</option>
                              <option value="bold">Bold</option>
                            </select>
                          </div>
                          <div>
                            <label className={DESIGN_LABEL_CLASS}>Text colour</label>
                            <input type="color" value={selectedEl.style.color ?? '#ffffff'}
                              onChange={(e) => updateElementStyle(selectedEl.id, { color: e.target.value })}
                              className="w-full h-9 border border-gray-200 rounded-lg bg-white p-1" />
                          </div>
                          <div>
                            <label className={DESIGN_LABEL_CLASS}>Alignment</label>
                            <div className="flex gap-1">
                              {[
                              { value: 'left', icon: AlignLeft },
                              { value: 'center', icon: AlignCenter },
                              { value: 'right', icon: AlignRight }].map((option) => {
                                const AlignIcon = option.icon;
                                return (
                                  <button
                                    key={option.value}
                                    type="button"
                                    title={`Align ${option.value}`}
                                    onClick={() => updateElementStyle(selectedEl.id, { textAlign: option.value })}
                                    className={`flex-1 p-1.5 rounded-lg border ${selectedEl.style.textAlign === option.value ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                                    <AlignIcon className="w-4 h-4 mx-auto" />
                                  </button>);

                              })}
                            </div>
                          </div>
                        </div>}

                      {(selectedEl.type === 'shape' || selectedEl.type === 'image') &&
                      <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className={DESIGN_LABEL_CLASS}>Corner radius</label>
                            <input type="number" min={0} max={100} value={selectedEl.style.borderRadius ?? 0}
                              onChange={(e) => updateElementStyle(selectedEl.id, { borderRadius: clampNumber(e.target.value, 0, 100) })}
                              className={DESIGN_INPUT_CLASS} />
                          </div>
                          <div>
                            <label className={DESIGN_LABEL_CLASS}>Border width</label>
                            <input type="number" min={0} max={10} value={selectedEl.style.borderWidth ?? 0}
                              onChange={(e) => updateElementStyle(selectedEl.id, { borderWidth: clampNumber(e.target.value, 0, 10) })}
                              className={DESIGN_INPUT_CLASS} />
                          </div>
                          <div>
                            <label className={DESIGN_LABEL_CLASS}>Border colour</label>
                            <input type="color" value={selectedEl.style.borderColor ?? '#ffffff'}
                              onChange={(e) => updateElementStyle(selectedEl.id, { borderColor: e.target.value })}
                              className="w-full h-9 border border-gray-200 rounded-lg bg-white p-1" />
                          </div>
                        </div>}

                      {selectedEl.type !== 'qr' && selectedEl.type !== 'barcode' &&
                      <div className="flex items-end gap-2">
                          <div className="flex-1">
                            <label className={DESIGN_LABEL_CLASS}>Background colour</label>
                            <input type="color" value={selectedEl.style.backgroundColor?.startsWith('#') ? selectedEl.style.backgroundColor : '#ffffff'}
                              onChange={(e) => updateElementStyle(selectedEl.id, { backgroundColor: e.target.value })}
                              className="w-full h-9 border border-gray-200 rounded-lg bg-white p-1" />
                          </div>
                          <button
                            type="button"
                            onClick={() => updateElementStyle(selectedEl.id, { backgroundColor: undefined })}
                            className="px-3 py-2 text-xs border border-gray-200 rounded-lg hover:bg-gray-50">
                            No background
                          </button>
                        </div>}

                      {selectedEl.type === 'image' &&
                      <div className="space-y-2">
                          <label className={DESIGN_LABEL_CLASS}>Picture</label>
                          <input
                            ref={imageInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              handleImageUpload(selectedEl.id, e.target.files?.[0]);
                              e.target.value = '';
                            }} />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => imageInputRef.current?.click()}
                              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
                              <Upload className="w-4 h-4" />
                              {selectedEl.imageSrc ? 'Replace image' : 'Upload image'}
                            </button>
                            {selectedEl.imageSrc &&
                            <button
                              type="button"
                              onClick={() => updateElement(selectedEl.id, { imageSrc: undefined })}
                              className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
                              Remove
                            </button>}
                          </div>
                          <div>
                            <label className={DESIGN_LABEL_CLASS}>Fit</label>
                            <select
                              value={selectedEl.imageFit ?? 'cover'}
                              onChange={(e) => updateElement(selectedEl.id, { imageFit: e.target.value as CardElement['imageFit'] })}
                              className={DESIGN_INPUT_CLASS}>
                              <option value="cover">Fill frame (crop)</option>
                              <option value="contain">Fit inside frame</option>
                              <option value="fill">Stretch to frame</option>
                            </select>
                          </div>
                          <p className="text-[11px] text-gray-500">PNG, JPG, SVG or WebP up to 2 MB. Use width and height above to size it.</p>
                        </div>}

                      <button
                        type="button"
                        onClick={() => handleDeleteElement(selectedEl.id)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                        Delete element
                      </button>
                    </div>}

                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex gap-2">
                    <button
                      onClick={handleImportDesign}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                      <Upload className="w-4 h-4" />
                      Import
                    </button>
                    <button
                      onClick={handleExportDesign}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>

                {/* Right panel: live card preview (editable on the front) */}
                <div className="flex-1 min-w-0">
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">Card Preview</h3>
                        <p className="text-xs text-gray-500 mt-1">Click an element to select it. Drag it to move. Drag the corner handle to resize.</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <select
                          value={previewEmployee.id}
                          onChange={(e) => setPreviewEmployeeId(e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white max-w-[220px]">
                          {employees.map((emp) => (
                            <option key={emp.id} value={emp.id}>{emp.name}</option>
                          ))}
                        </select>
                        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                          {(['front', 'back'] as const).map((side) => (
                            <button
                              key={side}
                              type="button"
                              onClick={() => setCardView(side)}
                              className={`px-4 py-2 text-sm capitalize ${cardView === side ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
                              {side}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center min-h-[520px] bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 rounded-xl p-8 overflow-auto">
                      {cardView === 'front' ?
                      <CardFace
                        employee={previewEmployee}
                        elements={cardElements}
                        background={cardBackground}
                        orientation={cardOrientation}
                        editable
                        selectedId={selectedElement}
                        onSelect={(id) => setSelectedElement(id || null)}
                        onMove={moveElement}
                        onResize={resizeElement} /> :
                      <IDCardPreview employee={previewEmployee} view="back" />}
                    </div>
                    <div className="flex flex-wrap justify-end gap-3 mt-6">
                      <button
                        onClick={resetDesign}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                        <RotateCcw className="w-4 h-4" />
                        Reset to Default
                      </button>
                      <button
                        onClick={saveDesign}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        <Save className="w-4 h-4" />
                        Save Design
                      </button>
                    </div>
                  </div>
                </div>
              </div>}

            {/* REISSUE REQUESTS TAB */}
            {activeTab === 'requests' &&
            <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Request ID</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Employee</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Reason</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Request Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Priority</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {reissueRequests.map((request) =>
                    <tr key={request.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <span className="font-mono text-sm text-gray-600">{request.id}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-gray-900">{request.employeeName}</p>
                              <p className="text-xs text-gray-500">{request.employeeId}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-700">{request.reason}</span>
                            {request.description &&
                        <p className="text-xs text-gray-500 mt-1">{request.description}</p>
                        }
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-700">{formatDate(request.requestDate)}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        request.priority === 'Urgent' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`
                        }>
                              {request.priority}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                        request.status === 'Approved' ? 'bg-green-100 text-green-800 border-green-200' :
                        request.status === 'Completed' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        'bg-red-100 text-red-800 border-red-200'}`
                        }>
                              {request.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              {request.status === 'Pending' &&
                          <>
                                  <button onClick={() => updateRequestStatus(request.id, 'Approved')} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Approve">
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => updateRequestStatus(request.id, 'Rejected')} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Reject">
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </>
                          }
                              {request.status === 'Approved' &&
                          <button onClick={() => processRequest(request)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded" title="Process">
                                  <Send className="w-4 h-4" />
                                </button>
                          }
                              <button onClick={() => viewRequestEmployee(request)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded" title="View">
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                    )}
                    </tbody>
                  </table>

                  {reissueRequests.length === 0 &&
                <div className="text-center py-12">
                      <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No reissue requests</h3>
                      <p className="text-sm text-gray-500">All requests have been processed</p>
                    </div>
                }
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      {/* View Card Modal */}
      {showViewModal && selectedEmployee &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">ID Card Details</h2>
                <p className="text-sm text-gray-500">{selectedEmployee.name}</p>
              </div>
              <button
              onClick={() => setShowViewModal(false)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">

                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex gap-8">
                {/* Card Preview */}
                <div className="flex-shrink-0">
                  <div className="flex gap-2 mb-4">
                    <button
                    onClick={() => setCardView('front')}
                    className={`px-3 py-1.5 rounded-lg text-sm ${cardView === 'front' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}>

                      Front
                    </button>
                    <button
                    onClick={() => setCardView('back')}
                    className={`px-3 py-1.5 rounded-lg text-sm ${cardView === 'back' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}>

                      Back
                    </button>
                  </div>
                  <IDCardPreview employee={selectedEmployee} view={cardView} />
                </div>

                {/* Card Info */}
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase">Card Status</p>
                      <span className={`inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-sm font-medium border ${getStatusColor(selectedEmployee.idCardStatus)}`}>
                        {getStatusIcon(selectedEmployee.idCardStatus)}
                        {selectedEmployee.idCardStatus}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase">Card Number</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">{selectedEmployee.cardNumber || 'Not Assigned'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase">Last Issued</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">{formatDate(selectedEmployee.lastIssuedDate)}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase">Expiry Date</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">{formatDate(selectedEmployee.expiryDate)}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                    onClick={() => selectedEmployee && printCards([selectedEmployee], 'Print ID card')}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">

                      <Printer className="w-4 h-4" />
                      Print
                    </button>
                    <button
                    onClick={() => selectedEmployee && printCards([selectedEmployee], 'Save ID card as PDF')}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">

                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                    <button
                    onClick={() => {
                      setShowViewModal(false);
                      handleReissue(selectedEmployee);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">

                      <RefreshCw className="w-4 h-4" />
                      Re-issue Card
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Issue New Card Modal */}
      {showIssueModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Issue New ID Card</h2>
                <p className="text-sm text-gray-500">Enter the staff details. Fields marked * are required.</p>
              </div>
              <button
                onClick={() => setShowIssueModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
              {([
              { key: 'name', label: 'Full Name *', type: 'text' },
              { key: 'employeeId', label: 'Employee ID *', type: 'text' },
              { key: 'email', label: 'Email *', type: 'email' },
              { key: 'phone', label: 'Phone *', type: 'tel' },
              { key: 'joiningDate', label: 'Date of Joining *', type: 'date' },
              { key: 'validUntil', label: 'Card Valid Until *', type: 'date' },
              { key: 'emergencyContact', label: 'Emergency Contact', type: 'tel' }] as const).map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    value={issueForm[field.key]}
                    onChange={(e) => setIssueForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${issueErrors[field.key] ? 'border-red-400' : 'border-gray-200'}`} />
                  {issueErrors[field.key] && <p className="text-xs text-red-600 mt-1">{issueErrors[field.key]}</p>}
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation *</label>
                <select
                  value={issueForm.designation}
                  onChange={(e) => setIssueForm((prev) => ({ ...prev, designation: e.target.value }))}
                  className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${issueErrors.designation ? 'border-red-400' : 'border-gray-200'}`}>
                  <option value="">Select designation...</option>
                  {designations.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                {issueErrors.designation && <p className="text-xs text-red-600 mt-1">{issueErrors.designation}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                <select
                  value={issueForm.department}
                  onChange={(e) => setIssueForm((prev) => ({ ...prev, department: e.target.value }))}
                  className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${issueErrors.department ? 'border-red-400' : 'border-gray-200'}`}>
                  <option value="">Select department...</option>
                  {departments.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                {issueErrors.department && <p className="text-xs text-red-600 mt-1">{issueErrors.department}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group *</label>
                <select
                  value={issueForm.bloodGroup}
                  onChange={(e) => setIssueForm((prev) => ({ ...prev, bloodGroup: e.target.value }))}
                  className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${issueErrors.bloodGroup ? 'border-red-400' : 'border-gray-200'}`}>
                  <option value="">Select blood group...</option>
                  {BLOOD_GROUPS.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                {issueErrors.bloodGroup && <p className="text-xs text-red-600 mt-1">{issueErrors.bloodGroup}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  rows={2}
                  value={issueForm.address}
                  onChange={(e) => setIssueForm((prev) => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="md:col-span-2 flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                  {issueForm.photo ?
                  <img src={issueForm.photo} alt="Staff photo preview" className="w-full h-full object-cover" /> :
                  <User className="w-6 h-6 text-gray-400" />}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Photo (optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleIssuePhotoUpload(e.target.files?.[0])}
                    className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                  {issueErrors.photo && <p className="text-xs text-red-600 mt-1">{issueErrors.photo}</p>}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowIssueModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={handleIssueCard}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                <CreditCard className="w-4 h-4" />
                Issue Card
              </button>
            </div>
          </div>
        </div>}

      {/* Reissue Modal */}
      {showReissueModal && selectedEmployee &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-lg w-full mx-4">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Re-issue ID Card</h2>
                <p className="text-sm text-gray-500">{selectedEmployee.name} - {selectedEmployee.employeeId}</p>
              </div>
              <button
              onClick={() => setShowReissueModal(false)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">

                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Re-issue *</label>
                <select
                value={reissueReason}
                onChange={(e) => setReissueReason(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500">

                  <option value="">Select reason...</option>
                  {reissueReasons.map((reason) =>
                <option key={reason} value={reason}>{reason}</option>
                )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2">
                    <input
                    type="radio"
                    name="priority"
                    value="Normal"
                    checked={reissuePriority === 'Normal'}
                    onChange={(e) => setReissuePriority(e.target.value)}
                    className="text-indigo-600" />

                    <span className="text-sm">Normal</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                    type="radio"
                    name="priority"
                    value="Urgent"
                    checked={reissuePriority === 'Urgent'}
                    onChange={(e) => setReissuePriority(e.target.value)}
                    className="text-indigo-600" />

                    <span className="text-sm">Urgent</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                value={reissueDescription}
                onChange={(e) => setReissueDescription(e.target.value)}
                placeholder="Additional details..."
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none" />

              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
              onClick={() => setShowReissueModal(false)}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">

                Cancel
              </button>
              <button
              onClick={handleSubmitReissue}
              disabled={!reissueReason}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">

                Submit Request
              </button>
            </div>
          </div>
        </div>
      }

      {/* Report Lost Modal */}
      {showReportLostModal && selectedEmployee &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Report Lost ID Card</h2>
                  <p className="text-sm text-gray-500">{selectedEmployee.name}</p>
                </div>
              </div>
              <button
              onClick={() => setShowReportLostModal(false)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">

                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  Reporting an ID card as lost will deactivate the current card and create a new reissue request.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Current Card Number:</span>
                  <span className="text-sm font-medium text-gray-900">{selectedEmployee.cardNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Employee ID:</span>
                  <span className="text-sm font-medium text-gray-900">{selectedEmployee.employeeId}</span>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
              onClick={() => setShowReportLostModal(false)}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">

                Cancel
              </button>
              <button
              onClick={handleSubmitLostReport}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">

                Report as Lost
              </button>
            </div>
          </div>
        </div>
      }

      {/* Click outside handlers */}
      {showActionsMenu &&
      <div className="fixed inset-0 z-40" onClick={() => setShowActionsMenu(null)} />
      }
    </div>);

}

export { EmployeeIDCardGenerator as EmployeeIdCard };