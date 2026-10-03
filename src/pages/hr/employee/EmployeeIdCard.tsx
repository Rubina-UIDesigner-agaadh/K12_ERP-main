import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  Printer,
  FileDown,
  CheckSquare,
  Square,
  User,
  CreditCard,
  Building2,
  Briefcase,
  Eye,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Droplets,
  Shield,
  Smartphone,
  RefreshCw,
  Download,
  Filter,
  MoreHorizontal,
  X,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Plus,
  Upload,
  Image,
  Type,
  QrCode,
  Palette,
  Layout,
  Save,
  RotateCcw,
  Move,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  ChevronDown,
  ChevronUp,
  Settings,
  Layers,
  Copy,
  FileText,
  AlertTriangle,
  Send,
  History } from
'lucide-react';

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

interface CardElement {
  id: string;
  type: 'text' | 'image' | 'qr' | 'shape' | 'field';
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
    textAlign?: string;
  };
  fieldMapping?: string;
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
  type: 'text',
  label: 'Validity',
  x: 100,
  y: 390,
  width: 140,
  height: 30,
  visible: true,
  style: { fontSize: 12, color: '#ffffff' }
}];


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
  const [employees] = useState<Employee[]>(mockEmployees);
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
  const [cardElements, setCardElements] = useState<CardElement[]>(defaultCardElements);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [cardOrientation, setCardOrientation] = useState<'vertical' | 'horizontal'>('vertical');
  const [cardBackground, setCardBackground] = useState('linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
  const [showElementPanel, setShowElementPanel] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
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

  const handleElementToggle = (elementId: string) => {
    setCardElements((prev) =>
    prev.map((el) =>
    el.id === elementId ? { ...el, visible: !el.visible } : el
    )
    );
  };

  const handleElementStyleChange = (elementId: string, styleKey: string, value: any) => {
    setCardElements((prev) =>
    prev.map((el) =>
    el.id === elementId ? { ...el, style: { ...el.style, [styleKey]: value } } : el
    )
    );
  };

  const handleAddElement = (type: CardElement['type']) => {
    const newElement: CardElement = {
      id: `element-${Date.now()}`,
      type,
      label: `New ${type}`,
      x: 50,
      y: 200,
      width: 100,
      height: 30,
      visible: true,
      style: { fontSize: 14, color: '#ffffff' }
    };
    setCardElements([...cardElements, newElement]);
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
  const QRCodeDisplay = ({ size = 60 }: {size?: number;}) =>
  <div className="bg-white p-1 rounded" style={{ width: size, height: size }}>
      <div className="grid grid-cols-8 gap-px" style={{ width: size - 8, height: size - 8 }}>
        {Array.from({ length: 64 }).map((_, i) =>
      <div
        key={i}
        className={Math.random() > 0.5 ? 'bg-gray-900' : 'bg-white'}
        style={{ width: (size - 8) / 8 - 1, height: (size - 8) / 8 - 1 }} />

      )}
      </div>
    </div>;


  // ID Card Preview Component
  const IDCardPreview = ({ employee, view }: {employee: Employee;view: 'front' | 'back';}) =>
  <div
    className={`${cardOrientation === 'vertical' ? 'w-[280px] h-[420px]' : 'w-[420px] h-[260px]'} rounded-xl overflow-hidden shadow-2xl border border-gray-200`}
    style={{ background: cardBackground }}>

      {view === 'front' ?
    <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-white/10 backdrop-blur px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">School Name</p>
                <p className="text-indigo-200 text-[10px]">Excellence in Education</p>
              </div>
            </div>
            <Shield className="w-6 h-6 text-indigo-200" />
          </div>

          {/* Photo Section */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-4">
            <div className="w-28 h-28 rounded-full bg-white p-1 shadow-lg mb-4">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                {employee.photo ?
            <img src={employee.photo} alt={employee.name} className="w-full h-full object-cover" /> :

            <User className="w-14 h-14 text-gray-400" />
            }
              </div>
            </div>

            <h2 className="text-white font-bold text-lg text-center">{employee.name}</h2>
            <p className="text-indigo-200 text-sm text-center">{employee.designation}</p>
            <div className="mt-2 px-3 py-1 bg-white/20 rounded-full">
              <p className="text-white text-xs font-medium">{employee.department}</p>
            </div>
          </div>

          {/* ID and Blood Group */}
          <div className="bg-white mx-4 mb-4 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] text-gray-500 uppercase">Employee ID</p>
                <p className="text-sm font-bold text-gray-900">{employee.employeeId}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-500 uppercase">Blood Group</p>
                <p className="text-lg font-bold text-red-600">{employee.bloodGroup}</p>
              </div>
            </div>
          </div>

          {/* Footer with QR */}
          <div className="bg-white/10 backdrop-blur px-4 py-2 flex items-center justify-between">
            <QRCodeDisplay size={50} />
            <div className="text-right">
              <p className="text-[10px] text-indigo-200">Valid Until</p>
              <p className="text-white text-xs font-medium">{employee.expiryDate ? formatDate(employee.expiryDate) : 'Dec 2025'}</p>
            </div>
          </div>
        </div> :

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
          <div className="flex items-center gap-3">
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
              onClick={() => window.print()}
              disabled={selectedEmployees.size === 0}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50">

              <Printer className="w-4 h-4" />
              <span className="text-sm">Print ({selectedEmployees.size})</span>
            </button>
            <button
              onClick={() => console.log('Export PDF')}
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
                              onClick={() => {
                                window.print();
                                setShowActionsMenu(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">

                                    <Printer className="w-4 h-4" />
                                    Print Card
                                  </button>
                                  <button
                              onClick={() => {
                                console.log('Download:', employee.id);
                                setShowActionsMenu(null);
                              }}
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
            <div className="space-y-6">
                <div className="flex gap-6">
                  {/* Left Panel - Element Controls */}
                  <div className="w-80 flex-shrink-0 space-y-4">
                    {/* Template Settings */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Card Settings
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Orientation</label>
                          <div className="flex gap-2">
                            <button
                            onClick={() => setCardOrientation('vertical')}
                            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                            cardOrientation === 'vertical' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 hover:bg-gray-50'}`
                            }>

                              Vertical
                            </button>
                            <button
                            onClick={() => setCardOrientation('horizontal')}
                            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                            cardOrientation === 'horizontal' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 hover:bg-gray-50'}`
                            }>

                              Horizontal
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Background</label>
                          <div className="grid grid-cols-4 gap-2">
                            {[
                          'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                          'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)',
                          'linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)',
                          'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)',
                          'linear-gradient(135deg, #FC466B 0%, #3F5EFB 100%)',
                          'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
                          '#1a1a2e'].
                          map((bg, i) =>
                          <button
                            key={i}
                            onClick={() => setCardBackground(bg)}
                            className={`w-10 h-10 rounded-lg border-2 ${
                            cardBackground === bg ? 'border-indigo-600' : 'border-transparent'}`
                            }
                            style={{ background: bg }} />

                          )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Add Elements */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Elements
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                        onClick={() => handleAddElement('text')}
                        className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">

                          <Type className="w-4 h-4 text-gray-500" />
                          Text
                        </button>
                        <button
                        onClick={() => handleAddElement('image')}
                        className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">

                          <Image className="w-4 h-4 text-gray-500" />
                          Image
                        </button>
                        <button
                        onClick={() => handleAddElement('field')}
                        className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">

                          <FileText className="w-4 h-4 text-gray-500" />
                          Field
                        </button>
                        <button
                        onClick={() => handleAddElement('qr')}
                        className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">

                          <QrCode className="w-4 h-4 text-gray-500" />
                          QR Code
                        </button>
                      </div>
                    </div>

                    {/* Element List */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                          <Layers className="w-4 h-4" />
                          Elements
                        </h3>
                        <span className="text-xs text-gray-500">{cardElements.length} items</span>
                      </div>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {cardElements.map((element) =>
                      <div
                        key={element.id}
                        onClick={() => setSelectedElement(element.id)}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                        selectedElement === element.id ? 'bg-indigo-100 border border-indigo-200' : 'bg-white border border-gray-200 hover:bg-gray-50'}`
                        }>

                            <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleElementToggle(element.id);
                          }}
                          className={`p-1 rounded ${element.visible ? 'text-indigo-600' : 'text-gray-400'}`}>

                              <Eye className="w-4 h-4" />
                            </button>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{element.label}</p>
                              <p className="text-xs text-gray-500 capitalize">{element.type}</p>
                            </div>
                            <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteElement(element.id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600">

                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                      )}
                      </div>
                    </div>

                    {/* Selected Element Properties */}
                    {selectedElement &&
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Edit className="w-4 h-4" />
                          Element Properties
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Font Size</label>
                            <input
                          type="number"
                          value={cardElements.find((e) => e.id === selectedElement)?.style.fontSize || 14}
                          onChange={(e) => handleElementStyleChange(selectedElement, 'fontSize', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />

                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Text Color</label>
                            <input
                          type="color"
                          value={cardElements.find((e) => e.id === selectedElement)?.style.color || '#ffffff'}
                          onChange={(e) => handleElementStyleChange(selectedElement, 'color', e.target.value)}
                          className="w-full h-10 rounded-lg cursor-pointer" />

                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Text Align</label>
                            <div className="flex gap-1">
                              {['left', 'center', 'right'].map((align) =>
                          <button
                            key={align}
                            onClick={() => handleElementStyleChange(selectedElement, 'textAlign', align)}
                            className={`flex-1 py-2 rounded-lg text-sm ${
                            cardElements.find((e) => e.id === selectedElement)?.style.textAlign === align ?
                            'bg-indigo-600 text-white' :
                            'bg-white border border-gray-200'}`
                            }>

                                  {align === 'left' && <AlignLeft className="w-4 h-4 mx-auto" />}
                                  {align === 'center' && <AlignCenter className="w-4 h-4 mx-auto" />}
                                  {align === 'right' && <AlignRight className="w-4 h-4 mx-auto" />}
                                </button>
                          )}
                            </div>
                          </div>
                        </div>
                      </div>
                  }

                    {/* Import/Export */}
                    <div className="flex gap-2">
                      <button
                      onClick={handleImportDesign}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">

                        <Upload className="w-4 h-4" />
                        Import
                      </button>
                      <button
                      onClick={handleExportDesign}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">

                        <Download className="w-4 h-4" />
                        Export
                      </button>
                    </div>
                  </div>

                  {/* Right Panel - Preview */}
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-gray-900">Card Preview</h3>
                        <div className="flex gap-2">
                          <button
                          onClick={() => setCardView('front')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          cardView === 'front' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 hover:bg-gray-50'}`
                          }>

                            Front
                          </button>
                          <button
                          onClick={() => setCardView('back')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          cardView === 'back' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 hover:bg-gray-50'}`
                          }>

                            Back
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-center min-h-[500px] bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 rounded-xl p-8">
                        <IDCardPreview
                        employee={employees[0]}
                        view={cardView} />

                      </div>

                      <div className="flex justify-end gap-3 mt-6">
                        <button
                        onClick={() => setCardElements(defaultCardElements)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">

                          <RotateCcw className="w-4 h-4" />
                          Reset to Default
                        </button>
                        <button
                        onClick={() => console.log('Save Design')}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">

                          <Save className="w-4 h-4" />
                          Save Design
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }

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
                                  <button className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Approve">
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Reject">
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </>
                          }
                              {request.status === 'Approved' &&
                          <button className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded" title="Process">
                                  <Send className="w-4 h-4" />
                                </button>
                          }
                              <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded" title="View">
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
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">

                      <Printer className="w-4 h-4" />
                      Print
                    </button>
                    <button
                    onClick={() => console.log('Download')}
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