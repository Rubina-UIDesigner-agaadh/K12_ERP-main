import React, { useState, useMemo, useCallback } from 'react';
import {
  Plus,
  Search,
  User,
  Trash2,
  Pencil,
  X,
  Save,
  Copy,
  ChevronRight,
  AlertCircle,
  Check,
  History,
  FileText,
  Archive,
  RefreshCw,
  CheckCircle2,
  XCircle,
  IndianRupee,
  Calendar,
  Building2,
  Briefcase,
  Download,
  Printer,
  MoreVertical } from
'lucide-react';

// ==================== TYPES ====================

interface Employee {
  id: string;
  name: string;
  code: string;
  designation: string;
  department: string;
  employmentType: 'permanent' | 'contract' | 'temporary';
  status: 'Active' | 'Inactive';
  photo: string;
  joiningDate: string;
  email: string;
  phone: string;
}

interface SalaryComponent {
  id: string;
  name: string;
  type: 'Fixed' | 'Variable';
  calculationType: 'Flat' | 'Percentage';
  percentageOf?: string;
  amount: number;
  percentage?: number;
  isActive: boolean;
}

interface SalaryStructure {
  id: string;
  employeeId: string;
  effectiveFrom: string;
  effectiveTo?: string;
  status: 'Active' | 'Inactive' | 'Draft';
  earnings: SalaryComponent[];
  deductions: SalaryComponent[];
  createdAt: string;
  updatedAt: string;
  remarks?: string;
}

interface StructureHistory {
  id: string;
  structureId: string;
  action: 'created' | 'updated' | 'activated' | 'deactivated';
  timestamp: string;
  changes?: string;
}

// ==================== CONSTANTS ====================

const EARNING_COMPONENTS = [
'Basic Salary',
'House Rent Allowance',
'Dearness Allowance',
'Special Allowance',
'Medical Allowance',
'Conveyance Allowance',
'Technical Allowance',
'Internet Allowance',
'Leave Travel Allowance',
'Performance Bonus',
'Overtime',
'Other Allowance'];


const DEDUCTION_COMPONENTS = [
'Provident Fund',
'ESI',
'Professional Tax',
'TDS',
'Income Tax',
'Loan Recovery',
'Advance Recovery',
'Insurance Premium',
'Other Deduction'];


const PERCENTAGE_BASE_OPTIONS = ['Basic Salary', 'Gross Salary', 'CTC'];

const DEPARTMENTS = [
'Teaching',
'Administration',
'IT Department',
'Finance',
'Support Staff'];


// ==================== INITIAL DATA ====================

const INITIAL_EMPLOYEES: Employee[] = [
{
  id: '1',
  name: 'Rajesh Kumar',
  code: 'EMP001',
  designation: 'Senior Teacher',
  department: 'Teaching',
  employmentType: 'permanent',
  status: 'Active',
  photo: 'https://i.pravatar.cc/150?img=12',
  joiningDate: '2020-04-01',
  email: 'rajesh.kumar@school.edu',
  phone: '9876543210'
},
{
  id: '2',
  name: 'Priya Sharma',
  code: 'EMP002',
  designation: 'Admin Officer',
  department: 'Administration',
  employmentType: 'permanent',
  status: 'Active',
  photo: 'https://i.pravatar.cc/150?img=5',
  joiningDate: '2019-07-15',
  email: 'priya.sharma@school.edu',
  phone: '9876543211'
},
{
  id: '3',
  name: 'Amit Patel',
  code: 'EMP003',
  designation: 'IT Manager',
  department: 'IT Department',
  employmentType: 'permanent',
  status: 'Active',
  photo: 'https://i.pravatar.cc/150?img=33',
  joiningDate: '2021-01-10',
  email: 'amit.patel@school.edu',
  phone: '9876543212'
},
{
  id: '4',
  name: 'Sneha Reddy',
  code: 'EMP004',
  designation: 'Accountant',
  department: 'Finance',
  employmentType: 'contract',
  status: 'Active',
  photo: 'https://i.pravatar.cc/150?img=9',
  joiningDate: '2022-03-01',
  email: 'sneha.reddy@school.edu',
  phone: '9876543213'
},
{
  id: '5',
  name: 'Vikram Singh',
  code: 'EMP005',
  designation: 'Lab Assistant',
  department: 'Support Staff',
  employmentType: 'temporary',
  status: 'Inactive',
  photo: 'https://i.pravatar.cc/150?img=15',
  joiningDate: '2023-06-15',
  email: 'vikram.singh@school.edu',
  phone: '9876543214'
},
{
  id: '6',
  name: 'Meera Nair',
  code: 'EMP006',
  designation: 'Librarian',
  department: 'Support Staff',
  employmentType: 'permanent',
  status: 'Active',
  photo: 'https://i.pravatar.cc/150?img=23',
  joiningDate: '2018-08-20',
  email: 'meera.nair@school.edu',
  phone: '9876543215'
}];


const INITIAL_STRUCTURES: SalaryStructure[] = [
{
  id: '1',
  employeeId: '1',
  effectiveFrom: '2024-04-01',
  status: 'Active',
  createdAt: '2024-03-15',
  updatedAt: '2024-03-15',
  earnings: [
  { id: '1-e-1', name: 'Basic Salary', type: 'Fixed', calculationType: 'Flat', amount: 35000, isActive: true },
  { id: '1-e-2', name: 'House Rent Allowance', type: 'Fixed', calculationType: 'Percentage', percentageOf: 'Basic Salary', percentage: 40, amount: 14000, isActive: true },
  { id: '1-e-3', name: 'Dearness Allowance', type: 'Fixed', calculationType: 'Percentage', percentageOf: 'Basic Salary', percentage: 10, amount: 3500, isActive: true },
  { id: '1-e-4', name: 'Special Allowance', type: 'Fixed', calculationType: 'Flat', amount: 5000, isActive: true },
  { id: '1-e-5', name: 'Medical Allowance', type: 'Fixed', calculationType: 'Flat', amount: 2500, isActive: true }],

  deductions: [
  { id: '1-d-1', name: 'Provident Fund', type: 'Fixed', calculationType: 'Percentage', percentageOf: 'Basic Salary', percentage: 12, amount: 4200, isActive: true },
  { id: '1-d-2', name: 'ESI', type: 'Fixed', calculationType: 'Percentage', percentageOf: 'Gross Salary', percentage: 0.75, amount: 450, isActive: true },
  { id: '1-d-3', name: 'Professional Tax', type: 'Fixed', calculationType: 'Flat', amount: 200, isActive: true },
  { id: '1-d-4', name: 'TDS', type: 'Variable', calculationType: 'Flat', amount: 2500, isActive: true }]

},
{
  id: '2',
  employeeId: '2',
  effectiveFrom: '2024-04-01',
  status: 'Active',
  createdAt: '2024-03-15',
  updatedAt: '2024-03-15',
  earnings: [
  { id: '2-e-1', name: 'Basic Salary', type: 'Fixed', calculationType: 'Flat', amount: 28000, isActive: true },
  { id: '2-e-2', name: 'House Rent Allowance', type: 'Fixed', calculationType: 'Percentage', percentageOf: 'Basic Salary', percentage: 40, amount: 11200, isActive: true },
  { id: '2-e-3', name: 'Dearness Allowance', type: 'Fixed', calculationType: 'Percentage', percentageOf: 'Basic Salary', percentage: 10, amount: 2800, isActive: true },
  { id: '2-e-4', name: 'Conveyance Allowance', type: 'Fixed', calculationType: 'Flat', amount: 1600, isActive: true }],

  deductions: [
  { id: '2-d-1', name: 'Provident Fund', type: 'Fixed', calculationType: 'Percentage', percentageOf: 'Basic Salary', percentage: 12, amount: 3360, isActive: true },
  { id: '2-d-2', name: 'Professional Tax', type: 'Fixed', calculationType: 'Flat', amount: 200, isActive: true }]

},
{
  id: '3',
  employeeId: '3',
  effectiveFrom: '2024-04-01',
  status: 'Active',
  createdAt: '2024-03-15',
  updatedAt: '2024-03-15',
  earnings: [
  { id: '3-e-1', name: 'Basic Salary', type: 'Fixed', calculationType: 'Flat', amount: 45000, isActive: true },
  { id: '3-e-2', name: 'House Rent Allowance', type: 'Fixed', calculationType: 'Percentage', percentageOf: 'Basic Salary', percentage: 50, amount: 22500, isActive: true },
  { id: '3-e-3', name: 'Technical Allowance', type: 'Fixed', calculationType: 'Flat', amount: 8000, isActive: true },
  { id: '3-e-4', name: 'Internet Allowance', type: 'Fixed', calculationType: 'Flat', amount: 2000, isActive: true }],

  deductions: [
  { id: '3-d-1', name: 'Provident Fund', type: 'Fixed', calculationType: 'Percentage', percentageOf: 'Basic Salary', percentage: 12, amount: 5400, isActive: true },
  { id: '3-d-2', name: 'Professional Tax', type: 'Fixed', calculationType: 'Flat', amount: 200, isActive: true },
  { id: '3-d-3', name: 'TDS', type: 'Variable', calculationType: 'Flat', amount: 5000, isActive: true }]

}];


// ==================== HELPER FUNCTIONS ====================

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// ==================== MAIN COMPONENT ====================

export function EmployeePayStructure() {
  // ==================== STATE ====================

  // Data State
  const [employees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [salaryStructures, setSalaryStructures] = useState<SalaryStructure[]>(INITIAL_STRUCTURES);
  const [structureHistory, setStructureHistory] = useState<StructureHistory[]>([]);

  // Selection State
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(employees[0].id);

  // Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal State
  const [showComponentModal, setShowComponentModal] = useState(false);
  const [showStructureModal, setShowStructureModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);

  // Edit State
  const [editingComponent, setEditingComponent] = useState<SalaryComponent | null>(null);
  const [componentType, setComponentType] = useState<'earning' | 'deduction'>('earning');
  const [deletingComponentId, setDeletingComponentId] = useState<string | null>(null);
  const [deletingComponentType, setDeletingComponentType] = useState<'earning' | 'deduction'>('earning');

  // Form State
  const [componentForm, setComponentForm] = useState({
    name: '',
    customName: '',
    type: 'Fixed' as 'Fixed' | 'Variable',
    calculationType: 'Flat' as 'Flat' | 'Percentage',
    percentageOf: 'Basic Salary',
    amount: 0,
    percentage: 0
  });

  const [structureForm, setStructureForm] = useState({
    effectiveFrom: '',
    remarks: '',
    copyFromEmployeeId: ''
  });

  // ==================== COMPUTED VALUES ====================

  const selectedEmployee = useMemo(() => {
    return employees.find((e) => e.id === selectedEmployeeId) || employees[0];
  }, [selectedEmployeeId, employees]);

  const currentStructure = useMemo(() => {
    return (
      salaryStructures.find(
        (s) => s.employeeId === selectedEmployeeId && s.status === 'Active'
      ) || null);

  }, [selectedEmployeeId, salaryStructures]);

  const employeeStructures = useMemo(() => {
    return salaryStructures.filter((s) => s.employeeId === selectedEmployeeId);
  }, [selectedEmployeeId, salaryStructures]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = !departmentFilter || emp.department === departmentFilter;
      const matchesType = !employmentTypeFilter || emp.employmentType === employmentTypeFilter;
      const matchesStatus = !statusFilter || emp.status === statusFilter;
      return matchesSearch && matchesDept && matchesType && matchesStatus;
    });
  }, [employees, searchTerm, departmentFilter, employmentTypeFilter, statusFilter]);

  const totalEarnings = useMemo(() => {
    if (!currentStructure) return 0;
    return currentStructure.earnings.
    filter((e) => e.isActive).
    reduce((sum, item) => sum + item.amount, 0);
  }, [currentStructure]);

  const totalDeductions = useMemo(() => {
    if (!currentStructure) return 0;
    return currentStructure.deductions.
    filter((d) => d.isActive).
    reduce((sum, item) => sum + item.amount, 0);
  }, [currentStructure]);

  const netSalary = totalEarnings - totalDeductions;

  const currentStructureHistory = useMemo(() => {
    if (!currentStructure) return [];
    return structureHistory.filter((h) => h.structureId === currentStructure.id);
  }, [currentStructure, structureHistory]);

  // ==================== HISTORY HANDLER ====================

  const addHistoryEntry = useCallback(
    (structureId: string, action: StructureHistory['action'], changes?: string) => {
      const newHistory: StructureHistory = {
        id: generateId(),
        structureId,
        action,
        timestamp: new Date().toISOString(),
        changes
      };
      setStructureHistory((prev) => [newHistory, ...prev]);
    },
    []
  );

  // ==================== EMPLOYEE HANDLERS ====================

  const handleSelectEmployee = useCallback((employeeId: string) => {
    setSelectedEmployeeId(employeeId);
  }, []);

  // ==================== COMPONENT MODAL HANDLERS ====================

  const handleOpenAddComponent = useCallback((type: 'earning' | 'deduction') => {
    setComponentType(type);
    setEditingComponent(null);
    setComponentForm({
      name: '',
      customName: '',
      type: 'Fixed',
      calculationType: 'Flat',
      percentageOf: 'Basic Salary',
      amount: 0,
      percentage: 0
    });
    setShowComponentModal(true);
  }, []);

  const handleOpenEditComponent = useCallback(
    (component: SalaryComponent, type: 'earning' | 'deduction') => {
      setComponentType(type);
      setEditingComponent(component);

      const componentsList = type === 'earning' ? EARNING_COMPONENTS : DEDUCTION_COMPONENTS;
      const isCustomName = !componentsList.includes(component.name);

      setComponentForm({
        name: isCustomName ? type === 'earning' ? 'Other Allowance' : 'Other Deduction' : component.name,
        customName: isCustomName ? component.name : '',
        type: component.type,
        calculationType: component.calculationType,
        percentageOf: component.percentageOf || 'Basic Salary',
        amount: component.amount,
        percentage: component.percentage || 0
      });
      setShowComponentModal(true);
    },
    []
  );

  const handleCloseComponentModal = useCallback(() => {
    setShowComponentModal(false);
    setEditingComponent(null);
  }, []);

  const handleSaveComponent = useCallback(() => {
    if (!currentStructure) {
      alert('No active structure found. Please create a structure first.');
      return;
    }

    const componentName =
    componentForm.name === 'Other Allowance' || componentForm.name === 'Other Deduction' ?
    componentForm.customName :
    componentForm.name;

    if (!componentName) {
      alert('Please enter a component name');
      return;
    }

    if (componentForm.amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const now = getCurrentDate();

    const newComponent: SalaryComponent = {
      id: editingComponent?.id || generateId(),
      name: componentName,
      type: componentForm.type,
      calculationType: componentForm.calculationType,
      percentageOf: componentForm.calculationType === 'Percentage' ? componentForm.percentageOf : undefined,
      percentage: componentForm.calculationType === 'Percentage' ? componentForm.percentage : undefined,
      amount: componentForm.amount,
      isActive: editingComponent?.isActive ?? true
    };

    setSalaryStructures((prev) =>
    prev.map((structure) => {
      if (structure.id !== currentStructure.id) return structure;

      if (componentType === 'earning') {
        const updatedEarnings = editingComponent ?
        structure.earnings.map((e) => e.id === editingComponent.id ? newComponent : e) :
        [...structure.earnings, newComponent];
        return { ...structure, earnings: updatedEarnings, updatedAt: now };
      } else {
        const updatedDeductions = editingComponent ?
        structure.deductions.map((d) => d.id === editingComponent.id ? newComponent : d) :
        [...structure.deductions, newComponent];
        return { ...structure, deductions: updatedDeductions, updatedAt: now };
      }
    })
    );

    addHistoryEntry(
      currentStructure.id,
      editingComponent ? 'updated' : 'created',
      `${editingComponent ? 'Updated' : 'Added'} ${componentType}: ${componentName}`
    );

    setShowComponentModal(false);
    setEditingComponent(null);
  }, [currentStructure, componentForm, componentType, editingComponent, addHistoryEntry]);

  // ==================== DELETE COMPONENT HANDLERS ====================

  const handleOpenDeleteConfirm = useCallback((componentId: string, type: 'earning' | 'deduction') => {
    setDeletingComponentId(componentId);
    setDeletingComponentType(type);
    setShowDeleteConfirm(true);
  }, []);

  const handleCloseDeleteConfirm = useCallback(() => {
    setShowDeleteConfirm(false);
    setDeletingComponentId(null);
  }, []);

  const handleDeleteComponent = useCallback(() => {
    if (!currentStructure || !deletingComponentId) return;

    const now = getCurrentDate();

    let componentName = '';

    setSalaryStructures((prev) =>
    prev.map((structure) => {
      if (structure.id !== currentStructure.id) return structure;

      if (deletingComponentType === 'earning') {
        const component = structure.earnings.find((e) => e.id === deletingComponentId);
        componentName = component?.name || '';
        return {
          ...structure,
          earnings: structure.earnings.filter((e) => e.id !== deletingComponentId),
          updatedAt: now
        };
      } else {
        const component = structure.deductions.find((d) => d.id === deletingComponentId);
        componentName = component?.name || '';
        return {
          ...structure,
          deductions: structure.deductions.filter((d) => d.id !== deletingComponentId),
          updatedAt: now
        };
      }
    })
    );

    addHistoryEntry(currentStructure.id, 'updated', `Deleted ${deletingComponentType}: ${componentName}`);

    setShowDeleteConfirm(false);
    setDeletingComponentId(null);
  }, [currentStructure, deletingComponentId, deletingComponentType, addHistoryEntry]);

  // ==================== TOGGLE COMPONENT ACTIVE ====================

  const handleToggleComponentActive = useCallback(
    (componentId: string, type: 'earning' | 'deduction') => {
      if (!currentStructure) return;

      const now = getCurrentDate();

      setSalaryStructures((prev) =>
      prev.map((structure) => {
        if (structure.id !== currentStructure.id) return structure;

        if (type === 'earning') {
          return {
            ...structure,
            earnings: structure.earnings.map((e) =>
            e.id === componentId ? { ...e, isActive: !e.isActive } : e
            ),
            updatedAt: now
          };
        } else {
          return {
            ...structure,
            deductions: structure.deductions.map((d) =>
            d.id === componentId ? { ...d, isActive: !d.isActive } : d
            ),
            updatedAt: now
          };
        }
      })
      );
    },
    [currentStructure]
  );

  // ==================== STRUCTURE HANDLERS ====================

  const handleOpenCreateStructure = useCallback(() => {
    setStructureForm({
      effectiveFrom: getCurrentDate(),
      remarks: '',
      copyFromEmployeeId: ''
    });
    setShowStructureModal(true);
  }, []);

  const handleCloseStructureModal = useCallback(() => {
    setShowStructureModal(false);
  }, []);

  const handleCreateStructure = useCallback(() => {
    if (!structureForm.effectiveFrom) {
      alert('Please select effective date');
      return;
    }

    const now = getCurrentDate();

    // Deactivate existing active structure
    setSalaryStructures((prev) =>
    prev.map((s) => {
      if (s.employeeId === selectedEmployeeId && s.status === 'Active') {
        return {
          ...s,
          status: 'Inactive' as const,
          effectiveTo: structureForm.effectiveFrom,
          updatedAt: now
        };
      }
      return s;
    })
    );

    let newEarnings: SalaryComponent[] = [];
    let newDeductions: SalaryComponent[] = [];

    // Copy from another employee if selected
    if (structureForm.copyFromEmployeeId) {
      const sourceStructure = salaryStructures.find(
        (s) => s.employeeId === structureForm.copyFromEmployeeId && s.status === 'Active'
      );
      if (sourceStructure) {
        newEarnings = sourceStructure.earnings.map((e) => ({
          ...e,
          id: generateId()
        }));
        newDeductions = sourceStructure.deductions.map((d) => ({
          ...d,
          id: generateId()
        }));
      }
    }

    const newStructureId = generateId();

    const newStructure: SalaryStructure = {
      id: newStructureId,
      employeeId: selectedEmployeeId,
      effectiveFrom: structureForm.effectiveFrom,
      status: 'Active',
      earnings: newEarnings,
      deductions: newDeductions,
      remarks: structureForm.remarks,
      createdAt: now,
      updatedAt: now
    };

    setSalaryStructures((prev) => [...prev, newStructure]);
    addHistoryEntry(newStructureId, 'created', 'New salary structure created');

    setShowStructureModal(false);
  }, [structureForm, selectedEmployeeId, salaryStructures, addHistoryEntry]);

  const handleDeactivateStructure = useCallback(() => {
    if (!currentStructure) return;

    const confirmDeactivate = window.confirm(
      'Are you sure you want to deactivate this salary structure?'
    );
    if (!confirmDeactivate) return;

    const now = getCurrentDate();

    setSalaryStructures((prev) =>
    prev.map((s) => {
      if (s.id === currentStructure.id) {
        return {
          ...s,
          status: 'Inactive' as const,
          effectiveTo: now,
          updatedAt: now
        };
      }
      return s;
    })
    );

    addHistoryEntry(currentStructure.id, 'deactivated', 'Salary structure deactivated');
  }, [currentStructure, addHistoryEntry]);

  // ==================== COPY STRUCTURE HANDLERS ====================

  const handleOpenCopyModal = useCallback(() => {
    setShowCopyModal(true);
  }, []);

  const handleCloseCopyModal = useCallback(() => {
    setShowCopyModal(false);
  }, []);

  const handleCopyToEmployee = useCallback(
    (targetEmployeeId: string) => {
      if (!currentStructure) return;

      const now = getCurrentDate();

      // Deactivate existing active structure for target employee
      setSalaryStructures((prev) =>
      prev.map((s) => {
        if (s.employeeId === targetEmployeeId && s.status === 'Active') {
          return {
            ...s,
            status: 'Inactive' as const,
            effectiveTo: now,
            updatedAt: now
          };
        }
        return s;
      })
      );

      const newStructureId = generateId();

      const newStructure: SalaryStructure = {
        id: newStructureId,
        employeeId: targetEmployeeId,
        effectiveFrom: now,
        status: 'Active',
        earnings: currentStructure.earnings.map((e) => ({
          ...e,
          id: generateId()
        })),
        deductions: currentStructure.deductions.map((d) => ({
          ...d,
          id: generateId()
        })),
        createdAt: now,
        updatedAt: now,
        remarks: `Copied from ${selectedEmployee.name}`
      };

      setSalaryStructures((prev) => [...prev, newStructure]);
      addHistoryEntry(newStructureId, 'created', `Copied from ${selectedEmployee.name}`);

      setShowCopyModal(false);
      alert('Structure copied successfully!');
    },
    [currentStructure, selectedEmployee, addHistoryEntry]
  );

  // ==================== RECALCULATE AMOUNTS ====================

  const handleRecalculateAmounts = useCallback(() => {
    if (!currentStructure) return;

    const basicSalary = currentStructure.earnings.find((e) => e.name === 'Basic Salary')?.amount || 0;
    const grossSalary = currentStructure.earnings.reduce((sum, e) => sum + e.amount, 0);

    const now = getCurrentDate();

    setSalaryStructures((prev) =>
    prev.map((structure) => {
      if (structure.id !== currentStructure.id) return structure;

      const updatedEarnings = structure.earnings.map((e) => {
        if (e.calculationType === 'Percentage' && e.percentage) {
          const base = e.percentageOf === 'Basic Salary' ? basicSalary : grossSalary;
          return { ...e, amount: Math.round(base * e.percentage / 100) };
        }
        return e;
      });

      const updatedDeductions = structure.deductions.map((d) => {
        if (d.calculationType === 'Percentage' && d.percentage) {
          const base = d.percentageOf === 'Basic Salary' ? basicSalary : grossSalary;
          return { ...d, amount: Math.round(base * d.percentage / 100) };
        }
        return d;
      });

      return {
        ...structure,
        earnings: updatedEarnings,
        deductions: updatedDeductions,
        updatedAt: now
      };
    })
    );

    addHistoryEntry(currentStructure.id, 'updated', 'Recalculated percentage-based amounts');
    alert('Amounts recalculated based on percentages!');
  }, [currentStructure, addHistoryEntry]);

  // ==================== HISTORY MODAL ====================

  const handleOpenHistoryModal = useCallback(() => {
    setShowHistoryModal(true);
  }, []);

  const handleCloseHistoryModal = useCallback(() => {
    setShowHistoryModal(false);
  }, []);

  // ==================== RENDER ====================

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Employee Pay Structure</h1>
              <p className="text-sm text-slate-500 mt-1">Manage salary structures and components</p>
            </div>
            <button
              onClick={handleOpenCreateStructure}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">

              <Plus className="w-4 h-4" />
              New Structure
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search employee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />

            </div>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 min-w-[150px]">

              <option value="">All Departments</option>
              {DEPARTMENTS.map((dept) =>
              <option key={dept} value={dept}>
                  {dept}
                </option>
              )}
            </select>
            <select
              value={employmentTypeFilter}
              onChange={(e) => setEmploymentTypeFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 min-w-[140px]">

              <option value="">All Types</option>
              <option value="permanent">Permanent</option>
              <option value="contract">Contract</option>
              <option value="temporary">Temporary</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 min-w-[120px]">

              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Panel: Employee List */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-700">Employee List</h3>
                <span className="text-xs text-slate-500">{filteredEmployees.length} employees</span>
              </div>
              <div className="max-h-[calc(100vh-320px)] overflow-y-auto">
                {filteredEmployees.map((emp) => {
                  const hasStructure = salaryStructures.some(
                    (s) => s.employeeId === emp.id && s.status === 'Active'
                  );
                  const isSelected = selectedEmployeeId === emp.id;

                  return (
                    <button
                      key={emp.id}
                      onClick={() => handleSelectEmployee(emp.id)}
                      className={`w-full p-4 flex items-center gap-3 border-b border-slate-100 transition-colors text-left ${
                      isSelected ?
                      'bg-indigo-50 border-l-4 border-l-indigo-500' :
                      'hover:bg-slate-50'}`
                      }>

                      <img
                        src={emp.photo}
                        alt={emp.name}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0" />

                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-900 text-sm truncate">{emp.name}</div>
                        <div className="text-xs text-slate-500 truncate">
                          {emp.code} • {emp.designation}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          emp.status === 'Active' ?
                          'bg-green-100 text-green-700' :
                          'bg-slate-100 text-slate-600'}`
                          }>

                          {emp.status}
                        </span>
                        {!hasStructure &&
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                            No Structure
                          </span>
                        }
                      </div>
                    </button>);

                })}

                {filteredEmployees.length === 0 &&
                <div className="p-8 text-center">
                    <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No employees found</p>
                  </div>
                }
              </div>
            </div>
          </div>

          {/* Right Panel: Salary Structure */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              {/* Employee Header */}
              <div className="p-6 border-b border-slate-200 bg-slate-50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedEmployee.photo}
                      alt={selectedEmployee.name}
                      className="w-16 h-16 rounded-full object-cover" />

                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">{selectedEmployee.name}</h2>
                      <div className="text-sm text-slate-600">
                        {selectedEmployee.code} • {selectedEmployee.designation}
                      </div>
                      <div className="text-sm text-slate-500">
                        {selectedEmployee.department} • {selectedEmployee.employmentType}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentStructure ?
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                        <Check className="w-4 h-4" />
                        Active Structure
                      </span> :

                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-700">
                        <AlertCircle className="w-4 h-4" />
                        No Active Structure
                      </span>
                    }
                  </div>
                </div>

                {currentStructure &&
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                        Effective From
                      </div>
                      <div className="font-medium text-slate-900">
                        {formatDate(currentStructure.effectiveFrom)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                        Last Updated
                      </div>
                      <div className="font-medium text-slate-900">
                        {formatDate(currentStructure.updatedAt)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                        Components
                      </div>
                      <div className="font-medium text-slate-900">
                        {currentStructure.earnings.length} + {currentStructure.deductions.length}
                      </div>
                    </div>
                    <div className="flex items-end gap-2">
                      <button
                      onClick={handleOpenHistoryModal}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="View History">

                        <History className="w-4 h-4" />
                      </button>
                      <button
                      onClick={handleOpenCopyModal}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Copy to Another Employee">

                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                      onClick={handleRecalculateAmounts}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Recalculate Amounts">

                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                      onClick={handleDeactivateStructure}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Deactivate Structure">

                        <Archive className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                }
              </div>

              {currentStructure ?
              <>
                  {/* Earnings */}
                  <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-slate-700">Earnings</h3>
                      <button
                      onClick={() => handleOpenAddComponent('earning')}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">

                        <Plus className="w-3 h-3" />
                        Add Component
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="border-b border-slate-200">
                          <tr>
                            <th className="pb-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                              Component
                            </th>
                            <th className="pb-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                              Type
                            </th>
                            <th className="pb-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                              Calculation
                            </th>
                            <th className="pb-2 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">
                              Amount
                            </th>
                            <th className="pb-2 text-xs font-medium text-slate-500 uppercase tracking-wider text-center">
                              Status
                            </th>
                            <th className="pb-2 text-xs font-medium text-slate-500 uppercase tracking-wider text-center">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {currentStructure.earnings.map((item) =>
                        <tr
                          key={item.id}
                          className={`hover:bg-slate-50 ${!item.isActive ? 'opacity-50' : ''}`}>

                              <td className="py-3 font-medium text-slate-900">{item.name}</td>
                              <td className="py-3 text-slate-600">{item.type}</td>
                              <td className="py-3 text-slate-600">
                                {item.calculationType === 'Percentage' ?
                            `${item.percentage}% of ${item.percentageOf}` :
                            'Flat'}
                              </td>
                              <td className="py-3 text-right font-semibold text-emerald-600">
                                {formatCurrency(item.amount)}
                              </td>
                              <td className="py-3 text-center">
                                <button
                              onClick={() => handleToggleComponentActive(item.id, 'earning')}
                              className="focus:outline-none">

                                  {item.isActive ?
                              <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /> :

                              <XCircle className="w-5 h-5 text-slate-300 mx-auto" />
                              }
                                </button>
                              </td>
                              <td className="py-3 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                onClick={() => handleOpenEditComponent(item, 'earning')}
                                className="p-1 text-slate-400 hover:text-indigo-600 rounded transition-colors">

                                    <Pencil className="w-4 h-4" />
                                  </button>
                                  <button
                                onClick={() => handleOpenDeleteConfirm(item.id, 'earning')}
                                className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors">

                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                        )}
                          {currentStructure.earnings.length === 0 &&
                        <tr>
                              <td colSpan={6} className="py-8 text-center text-slate-400">
                                No earning components added
                              </td>
                            </tr>
                        }
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Deductions */}
                  <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-slate-700">Deductions</h3>
                      <button
                      onClick={() => handleOpenAddComponent('deduction')}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">

                        <Plus className="w-3 h-3" />
                        Add Component
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="border-b border-slate-200">
                          <tr>
                            <th className="pb-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                              Component
                            </th>
                            <th className="pb-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                              Type
                            </th>
                            <th className="pb-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                              Calculation
                            </th>
                            <th className="pb-2 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">
                              Amount
                            </th>
                            <th className="pb-2 text-xs font-medium text-slate-500 uppercase tracking-wider text-center">
                              Status
                            </th>
                            <th className="pb-2 text-xs font-medium text-slate-500 uppercase tracking-wider text-center">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {currentStructure.deductions.map((item) =>
                        <tr
                          key={item.id}
                          className={`hover:bg-slate-50 ${!item.isActive ? 'opacity-50' : ''}`}>

                              <td className="py-3 font-medium text-slate-900">{item.name}</td>
                              <td className="py-3 text-slate-600">{item.type}</td>
                              <td className="py-3 text-slate-600">
                                {item.calculationType === 'Percentage' ?
                            `${item.percentage}% of ${item.percentageOf}` :
                            'Flat'}
                              </td>
                              <td className="py-3 text-right font-semibold text-red-600">
                                {formatCurrency(item.amount)}
                              </td>
                              <td className="py-3 text-center">
                                <button
                              onClick={() => handleToggleComponentActive(item.id, 'deduction')}
                              className="focus:outline-none">

                                  {item.isActive ?
                              <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /> :

                              <XCircle className="w-5 h-5 text-slate-300 mx-auto" />
                              }
                                </button>
                              </td>
                              <td className="py-3 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                onClick={() => handleOpenEditComponent(item, 'deduction')}
                                className="p-1 text-slate-400 hover:text-indigo-600 rounded transition-colors">

                                    <Pencil className="w-4 h-4" />
                                  </button>
                                  <button
                                onClick={() => handleOpenDeleteConfirm(item.id, 'deduction')}
                                className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors">

                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                        )}
                          {currentStructure.deductions.length === 0 &&
                        <tr>
                              <td colSpan={6} className="py-8 text-center text-slate-400">
                                No deduction components added
                              </td>
                            </tr>
                        }
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="p-6 bg-slate-50">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4">Salary Summary</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white border border-slate-200 rounded-lg p-4">
                        <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                          Gross Earnings
                        </div>
                        <div className="text-2xl font-bold text-emerald-600">
                          {formatCurrency(totalEarnings)}
                        </div>
                      </div>
                      <div className="bg-white border border-slate-200 rounded-lg p-4">
                        <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                          Total Deductions
                        </div>
                        <div className="text-2xl font-bold text-red-600">
                          {formatCurrency(totalDeductions)}
                        </div>
                      </div>
                      <div className="bg-indigo-600 rounded-lg p-4">
                        <div className="text-xs text-indigo-200 uppercase tracking-wide mb-1">
                          Net Salary
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {formatCurrency(netSalary)}
                        </div>
                      </div>
                    </div>
                  </div>
                </> :

              <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">
                    No Active Salary Structure
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">
                    Create a new salary structure for this employee
                  </p>
                  <button
                  onClick={handleOpenCreateStructure}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">

                    <Plus className="w-4 h-4" />
                    Create Structure
                  </button>
                </div>
              }
            </div>

            {/* Previous Structures */}
            {employeeStructures.filter((s) => s.status !== 'Active').length > 0 &&
            <div className="mt-4 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                  <h3 className="text-sm font-semibold text-slate-700">Previous Structures</h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {employeeStructures.
                filter((s) => s.status !== 'Active').
                map((structure) =>
                <div key={structure.id} className="p-4 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-slate-900">
                            {formatDate(structure.effectiveFrom)} -{' '}
                            {structure.effectiveTo ? formatDate(structure.effectiveTo) : 'Present'}
                          </div>
                          <div className="text-xs text-slate-500">
                            {structure.earnings.length} earnings, {structure.deductions.length}{' '}
                            deductions
                          </div>
                        </div>
                        <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    structure.status === 'Inactive' ?
                    'bg-slate-100 text-slate-600' :
                    'bg-amber-100 text-amber-700'}`
                    }>

                          {structure.status}
                        </span>
                      </div>
                )}
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      {/* ==================== MODALS ==================== */}

      {/* Component Modal */}
      {showComponentModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">
                {editingComponent ? 'Edit' : 'Add'}{' '}
                {componentType === 'earning' ? 'Earning' : 'Deduction'} Component
              </h2>
              <button
              onClick={handleCloseComponentModal}
              className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center">

                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Component Name
                </label>
                <select
                value={componentForm.name}
                onChange={(e) => setComponentForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500">

                  <option value="">Select Component</option>
                  {(componentType === 'earning' ? EARNING_COMPONENTS : DEDUCTION_COMPONENTS).map(
                  (comp) =>
                  <option key={comp} value={comp}>
                        {comp}
                      </option>

                )}
                </select>
              </div>

              {(componentForm.name === 'Other Allowance' ||
            componentForm.name === 'Other Deduction') &&
            <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Custom Name
                  </label>
                  <input
                type="text"
                value={componentForm.customName}
                onChange={(e) =>
                setComponentForm((prev) => ({ ...prev, customName: e.target.value }))
                }
                placeholder="Enter custom component name"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" />

                </div>
            }

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Type</label>
                  <select
                  value={componentForm.type}
                  onChange={(e) =>
                  setComponentForm((prev) => ({
                    ...prev,
                    type: e.target.value as 'Fixed' | 'Variable'
                  }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500">

                    <option value="Fixed">Fixed</option>
                    <option value="Variable">Variable</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Calculation
                  </label>
                  <select
                  value={componentForm.calculationType}
                  onChange={(e) =>
                  setComponentForm((prev) => ({
                    ...prev,
                    calculationType: e.target.value as 'Flat' | 'Percentage'
                  }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500">

                    <option value="Flat">Flat Amount</option>
                    <option value="Percentage">Percentage</option>
                  </select>
                </div>
              </div>

              {componentForm.calculationType === 'Percentage' &&
            <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Percentage Of
                    </label>
                    <select
                  value={componentForm.percentageOf}
                  onChange={(e) =>
                  setComponentForm((prev) => ({ ...prev, percentageOf: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500">

                      {PERCENTAGE_BASE_OPTIONS.map((opt) =>
                  <option key={opt} value={opt}>
                          {opt}
                        </option>
                  )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Percentage (%)
                    </label>
                    <input
                  type="number"
                  value={componentForm.percentage}
                  onChange={(e) =>
                  setComponentForm((prev) => ({
                    ...prev,
                    percentage: parseFloat(e.target.value) || 0
                  }))
                  }
                  step="0.01"
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" />

                  </div>
                </div>
            }

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount (₹)</label>
                <input
                type="number"
                value={componentForm.amount}
                onChange={(e) =>
                setComponentForm((prev) => ({
                  ...prev,
                  amount: parseFloat(e.target.value) || 0
                }))
                }
                min="0"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" />

                {componentForm.calculationType === 'Percentage' &&
              <p className="text-xs text-slate-500 mt-1">
                    This will be recalculated based on percentage
                  </p>
              }
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-200 bg-slate-50">
              <button
              onClick={handleCloseComponentModal}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors font-medium">

                Cancel
              </button>
              <button
              onClick={handleSaveComponent}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">

                <Save className="w-4 h-4" />
                {editingComponent ? 'Update' : 'Add'} Component
              </button>
            </div>
          </div>
        </div>
      }

      {/* Create Structure Modal */}
      {showStructureModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Create New Salary Structure</h2>
              <button
              onClick={handleCloseStructureModal}
              className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center">

                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <img
                src={selectedEmployee.photo}
                alt={selectedEmployee.name}
                className="w-10 h-10 rounded-full" />

                <div>
                  <div className="font-medium text-slate-900">{selectedEmployee.name}</div>
                  <div className="text-sm text-slate-500">{selectedEmployee.code}</div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Effective From
                </label>
                <input
                type="date"
                value={structureForm.effectiveFrom}
                onChange={(e) =>
                setStructureForm((prev) => ({ ...prev, effectiveFrom: e.target.value }))
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" />

              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Copy From (Optional)
                </label>
                <select
                value={structureForm.copyFromEmployeeId}
                onChange={(e) =>
                setStructureForm((prev) => ({ ...prev, copyFromEmployeeId: e.target.value }))
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500">

                  <option value="">Start from scratch</option>
                  {employees.
                filter(
                  (e) =>
                  e.id !== selectedEmployeeId &&
                  salaryStructures.some((s) => s.employeeId === e.id && s.status === 'Active')
                ).
                map((emp) =>
                <option key={emp.id} value={emp.id}>
                        {emp.name} ({emp.code})
                      </option>
                )}
                </select>
                <p className="text-xs text-slate-500 mt-1">
                  Copy salary components from another employee's structure
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Remarks (Optional)
                </label>
                <textarea
                value={structureForm.remarks}
                onChange={(e) =>
                setStructureForm((prev) => ({ ...prev, remarks: e.target.value }))
                }
                placeholder="Any notes or remarks..."
                rows={2}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 resize-none" />

              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-200 bg-slate-50">
              <button
              onClick={handleCloseStructureModal}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors font-medium">

                Cancel
              </button>
              <button
              onClick={handleCreateStructure}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">

                <Plus className="w-4 h-4" />
                Create Structure
              </button>
            </div>
          </div>
        </div>
      }

      {/* History Modal */}
      {showHistoryModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Structure History</h2>
              <button
              onClick={handleCloseHistoryModal}
              className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center">

                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {currentStructureHistory.length > 0 ?
            <div className="divide-y divide-slate-100">
                  {currentStructureHistory.map((h) =>
              <div key={h.id} className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    h.action === 'created' ?
                    'bg-green-100 text-green-700' :
                    h.action === 'updated' ?
                    'bg-blue-100 text-blue-700' :
                    h.action === 'activated' ?
                    'bg-emerald-100 text-emerald-700' :
                    'bg-slate-100 text-slate-700'}`
                    }>

                          {h.action}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(h.timestamp).toLocaleString()}
                        </span>
                      </div>
                      {h.changes && <p className="text-sm text-slate-600">{h.changes}</p>}
                    </div>
              )}
                </div> :

            <div className="p-8 text-center text-slate-400">No history available</div>
            }
            </div>
            <div className="p-4 border-t border-slate-200 bg-slate-50">
              <button
              onClick={handleCloseHistoryModal}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors font-medium">

                Close
              </button>
            </div>
          </div>
        </div>
      }

      {/* Copy Modal */}
      {showCopyModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Copy Structure to Employee</h2>
              <button
              onClick={handleCloseCopyModal}
              className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center">

                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-sm text-slate-600 mb-4">
                Select an employee to copy this salary structure to:
              </p>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {employees.
              filter((e) => e.id !== selectedEmployeeId).
              map((emp) =>
              <button
                key={emp.id}
                onClick={() => handleCopyToEmployee(emp.id)}
                className="w-full p-3 flex items-center gap-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left">

                      <img src={emp.photo} alt={emp.name} className="w-10 h-10 rounded-full" />
                      <div className="flex-1">
                        <div className="font-medium text-slate-900">{emp.name}</div>
                        <div className="text-xs text-slate-500">
                          {emp.code} • {emp.department}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
              )}
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 bg-slate-50">
              <button
              onClick={handleCloseCopyModal}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors font-medium">

                Cancel
              </button>
            </div>
          </div>
        </div>
      }

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm shadow-2xl">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Delete Component?</h3>
              <p className="text-sm text-slate-500">
                This action cannot be undone. The component will be permanently removed from this
                salary structure.
              </p>
            </div>
            <div className="flex items-center gap-3 p-4 border-t border-slate-200 bg-slate-50">
              <button
              onClick={handleCloseDeleteConfirm}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors font-medium">

                Cancel
              </button>
              <button
              onClick={handleDeleteComponent}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">

                Delete
              </button>
            </div>
          </div>
        </div>
      }
    </div>);

}

export default EmployeePayStructure;