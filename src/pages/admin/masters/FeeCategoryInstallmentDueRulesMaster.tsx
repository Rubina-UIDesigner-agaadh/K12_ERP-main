// filepath: src/pages/finance/masters/FeeCategoryInstallmentDueRulesMaster.tsx

import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Plus, Edit2, Trash2, X, Save, Search, Calendar, AlertCircle } from 'lucide-react';

interface FeeRuleData {
  id: number;
  category: string;
  plan: string;
  due: string;
  late: string;
  status: 'Active' | 'Inactive';
  gracePeriod: number;
  lateFeeType: 'Fixed' | 'Per Day' | 'Percentage' | 'None';
  lateFeeAmount: number;
  installments?: InstallmentDetails[];
  description?: string;
  applicableFrom?: string;
}

interface InstallmentDetails {
  installmentNo: number;
  dueDate: string;
  percentage: number;
}

interface FormData {
  category: string;
  plan: string;
  dueType: 'Fixed Date' | 'Day of Month' | 'Relative' | 'Salary Deduction';
  dueDay: number;
  dueMonth: string;
  dueDate: string;
  gracePeriod: number;
  lateFeeType: 'Fixed' | 'Per Day' | 'Percentage' | 'None';
  lateFeeAmount: number;
  status: 'Active' | 'Inactive';
  description: string;
  applicableFrom: string;
  installments: InstallmentDetails[];
}

export function FeeCategoryInstallmentDueRulesMaster() {
  const [data, setData] = useState<FeeRuleData[]>([
  {
    id: 1,
    category: 'General',
    plan: 'Quarterly',
    due: '10th of month',
    late: '₹50/day after 5 days',
    status: 'Active',
    gracePeriod: 5,
    lateFeeType: 'Per Day',
    lateFeeAmount: 50,
    applicableFrom: '2024-04-01',
    installments: [
    { installmentNo: 1, dueDate: '10th April', percentage: 25 },
    { installmentNo: 2, dueDate: '10th July', percentage: 25 },
    { installmentNo: 3, dueDate: '10th October', percentage: 25 },
    { installmentNo: 4, dueDate: '10th January', percentage: 25 }]

  },
  {
    id: 2,
    category: 'General',
    plan: 'Annual',
    due: '15th June',
    late: '₹100/day after 7 days',
    status: 'Active',
    gracePeriod: 7,
    lateFeeType: 'Per Day',
    lateFeeAmount: 100,
    applicableFrom: '2024-04-01',
    installments: [
    { installmentNo: 1, dueDate: '15th June', percentage: 100 }]

  },
  {
    id: 3,
    category: 'RTE',
    plan: 'Monthly',
    due: '5th of month',
    late: 'None',
    status: 'Active',
    gracePeriod: 0,
    lateFeeType: 'None',
    lateFeeAmount: 0,
    applicableFrom: '2024-04-01'
  },
  {
    id: 4,
    category: 'Staff Ward',
    plan: 'Monthly',
    due: 'Salary Deduction',
    late: 'None',
    status: 'Active',
    gracePeriod: 0,
    lateFeeType: 'None',
    lateFeeAmount: 0,
    applicableFrom: '2024-04-01'
  },
  {
    id: 5,
    category: 'General',
    plan: 'Half-Yearly',
    due: '20th of month',
    late: '₹75/day after 5 days',
    status: 'Active',
    gracePeriod: 5,
    lateFeeType: 'Per Day',
    lateFeeAmount: 75,
    applicableFrom: '2024-04-01',
    installments: [
    { installmentNo: 1, dueDate: '20th April', percentage: 50 },
    { installmentNo: 2, dueDate: '20th October', percentage: 50 }]

  },
  {
    id: 6,
    category: 'Transport',
    plan: 'Quarterly',
    due: '1st of month',
    late: '₹30/day after 3 days',
    status: 'Active',
    gracePeriod: 3,
    lateFeeType: 'Per Day',
    lateFeeAmount: 30,
    applicableFrom: '2024-04-01'
  },
  {
    id: 7,
    category: 'Sports',
    plan: 'Annual',
    due: '1st May',
    late: '2% per month',
    status: 'Active',
    gracePeriod: 15,
    lateFeeType: 'Percentage',
    lateFeeAmount: 2,
    applicableFrom: '2024-04-01'
  },
  {
    id: 8,
    category: 'Hostel',
    plan: 'Monthly',
    due: '1st of month',
    late: '₹100 fixed after 5 days',
    status: 'Active',
    gracePeriod: 5,
    lateFeeType: 'Fixed',
    lateFeeAmount: 100,
    applicableFrom: '2024-04-01'
  },
  {
    id: 9,
    category: 'Library',
    plan: 'Annual',
    due: '30th June',
    late: 'None',
    status: 'Inactive',
    gracePeriod: 0,
    lateFeeType: 'None',
    lateFeeAmount: 0,
    applicableFrom: '2024-04-01'
  }]
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    category: '',
    plan: '',
    dueType: 'Day of Month',
    dueDay: 10,
    dueMonth: 'April',
    dueDate: '',
    gracePeriod: 5,
    lateFeeType: 'Per Day',
    lateFeeAmount: 0,
    status: 'Active',
    description: '',
    applicableFrom: '',
    installments: []
  });

  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const [filterCategory, setFilterCategory] = useState('');
  const [filterPlan, setFilterPlan] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Predefined options
  const categoryOptions = [
  'General',
  'RTE',
  'Staff Ward',
  'Transport',
  'Sports',
  'Hostel',
  'Library',
  'Laboratory',
  'Computer',
  'Admission',
  'Examination'];


  const planOptions = [
  { value: 'Annual', installments: 1 },
  { value: 'Half-Yearly', installments: 2 },
  { value: 'Quarterly', installments: 4 },
  { value: 'Monthly', installments: 12 },
  { value: 'Custom', installments: 0 }];


  const monthOptions = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];


  // Filter data
  const filteredData = data.filter((item) => {
    const matchesSearch =
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.plan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.due.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.late.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === '' || item.category === filterCategory;
    const matchesPlan = filterPlan === '' || item.plan === filterPlan;
    const matchesStatus = filterStatus === '' || item.status === filterStatus;

    return matchesSearch && matchesCategory && matchesPlan && matchesStatus;
  });

  // Get unique categories and plans for filters
  const uniqueCategories = [...new Set(data.map((item) => item.category))];
  const uniquePlans = [...new Set(data.map((item) => item.plan))];

  // Validate form
  const validateForm = (): boolean => {
    const errors: any = {};

    if (!formData.category) {
      errors.category = 'Fee category is required';
    }
    if (!formData.plan) {
      errors.plan = 'Installment plan is required';
    }
    if (formData.dueType === 'Day of Month' && (formData.dueDay < 1 || formData.dueDay > 31)) {
      errors.dueDay = 'Valid day (1-31) is required';
    }
    if (formData.dueType === 'Fixed Date' && !formData.dueDate) {
      errors.dueDate = 'Due date is required';
    }
    if (formData.lateFeeType !== 'None' && formData.lateFeeAmount <= 0) {
      errors.lateFeeAmount = 'Late fee amount must be greater than 0';
    }

    // Check for duplicate rule
    const isDuplicate = data.some(
      (item) =>
      item.category === formData.category &&
      item.plan === formData.plan &&
      item.id !== editingId
    );
    if (isDuplicate) {
      errors.category = 'Rule already exists for this category and plan combination';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Generate installments based on plan
  const generateInstallments = (plan: string): InstallmentDetails[] => {
    const planConfig = planOptions.find((p) => p.value === plan);
    if (!planConfig || planConfig.installments === 0) return [];

    const installments: InstallmentDetails[] = [];
    const percentage = 100 / planConfig.installments;

    for (let i = 0; i < planConfig.installments; i++) {
      installments.push({
        installmentNo: i + 1,
        dueDate: '',
        percentage: Math.round(percentage * 100) / 100
      });
    }

    return installments;
  };

  // Handle add new rule
  const handleAddNew = () => {
    setIsFormOpen(true);
    setEditingId(null);
    setFormData({
      category: '',
      plan: '',
      dueType: 'Day of Month',
      dueDay: 10,
      dueMonth: 'April',
      dueDate: '',
      gracePeriod: 5,
      lateFeeType: 'Per Day',
      lateFeeAmount: 0,
      status: 'Active',
      description: '',
      applicableFrom: new Date().toISOString().split('T')[0],
      installments: []
    });
    setFormErrors({});
  };

  // Handle edit
  const handleEdit = (row: FeeRuleData) => {
    setIsFormOpen(true);
    setEditingId(row.id);

    // Parse due date info
    let dueType: FormData['dueType'] = 'Day of Month';
    let dueDay = 10;
    let dueMonth = 'April';
    let dueDate = '';

    if (row.due === 'Salary Deduction') {
      dueType = 'Salary Deduction';
    } else if (row.due.includes('of month')) {
      dueType = 'Day of Month';
      dueDay = parseInt(row.due) || 10;
    } else {
      dueType = 'Fixed Date';
      dueDate = row.applicableFrom || '';
    }

    setFormData({
      category: row.category,
      plan: row.plan,
      dueType,
      dueDay,
      dueMonth,
      dueDate,
      gracePeriod: row.gracePeriod,
      lateFeeType: row.lateFeeType,
      lateFeeAmount: row.lateFeeAmount,
      status: row.status,
      description: row.description || '',
      applicableFrom: row.applicableFrom || '',
      installments: row.installments || []
    });
    setFormErrors({});
  };

  // Handle delete
  const handleDelete = (id: number) => {
    const itemToDelete = data.find((item) => item.id === id);
    if (
    window.confirm(
      `Are you sure you want to delete the fee rule for "${itemToDelete?.category}" - "${itemToDelete?.plan}"?`
    ))
    {
      setData(data.filter((item) => item.id !== id));
    }
  };

  // Handle plan change
  const handlePlanChange = (plan: string) => {
    const installments = generateInstallments(plan);
    setFormData({
      ...formData,
      plan,
      installments
    });
  };

  // Format due date for display
  const formatDueDate = (): string => {
    switch (formData.dueType) {
      case 'Salary Deduction':
        return 'Salary Deduction';
      case 'Day of Month':
        return `${formData.dueDay}th of month`;
      case 'Fixed Date':
        return formData.dueDate ? new Date(formData.dueDate).toLocaleDateString() : '';
      default:
        return '';
    }
  };

  // Format late fee for display
  const formatLateFee = (): string => {
    if (formData.lateFeeType === 'None') return 'None';

    const graceText = formData.gracePeriod > 0 ? ` after ${formData.gracePeriod} days` : '';

    switch (formData.lateFeeType) {
      case 'Fixed':
        return `₹${formData.lateFeeAmount} fixed${graceText}`;
      case 'Per Day':
        return `₹${formData.lateFeeAmount}/day${graceText}`;
      case 'Percentage':
        return `${formData.lateFeeAmount}% per month${graceText}`;
      default:
        return 'None';
    }
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submissionData: FeeRuleData = {
      id: editingId || Math.max(...data.map((item) => item.id), 0) + 1,
      category: formData.category,
      plan: formData.plan,
      due: formatDueDate(),
      late: formatLateFee(),
      status: formData.status,
      gracePeriod: formData.gracePeriod,
      lateFeeType: formData.lateFeeType,
      lateFeeAmount: formData.lateFeeAmount,
      installments: formData.installments,
      description: formData.description,
      applicableFrom: formData.applicableFrom
    };

    if (editingId) {
      setData(data.map((item) => item.id === editingId ? submissionData : item));
    } else {
      setData([...data, submissionData]);
    }

    setIsFormOpen(false);
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      category: '',
      plan: '',
      dueType: 'Day of Month',
      dueDay: 10,
      dueMonth: 'April',
      dueDate: '',
      gracePeriod: 5,
      lateFeeType: 'Per Day',
      lateFeeAmount: 0,
      status: 'Active',
      description: '',
      applicableFrom: '',
      installments: []
    });
    setFormErrors({});
    setEditingId(null);
  };

  // Handle cancel
  const handleCancel = () => {
    setIsFormOpen(false);
    resetForm();
  };

  // Toggle status
  const handleToggleStatus = (id: number) => {
    setData(
      data.map((item) =>
      item.id === id ?
      { ...item, status: item.status === 'Active' ? 'Inactive' : 'Active' } :
      item
      )
    );
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterCategory('');
    setFilterPlan('');
    setFilterStatus('');
  };

  // Update installment
  const handleInstallmentChange = (index: number, field: keyof InstallmentDetails, value: any) => {
    const updatedInstallments = [...formData.installments];
    updatedInstallments[index] = {
      ...updatedInstallments[index],
      [field]: value
    };
    setFormData({ ...formData, installments: updatedInstallments });
  };

  const columns = [
  {
    key: 'category',
    header: 'Fee Category',
    render: (row: FeeRuleData) =>
    <div>
          <div className="font-medium">{row.category}</div>
          {row.description &&
      <div className="text-xs text-gray-500">{row.description}</div>
      }
        </div>

  },
  {
    key: 'plan',
    header: 'Installment Plan',
    render: (row: FeeRuleData) =>
    <div>
          <Badge variant="default">{row.plan}</Badge>
          {row.installments && row.installments.length > 0 &&
      <div className="text-xs text-gray-500 mt-1">
              {row.installments.length} installments
            </div>
      }
        </div>

  },
  {
    key: 'due',
    header: 'Due Date Rule',
    render: (row: FeeRuleData) =>
    <div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-gray-400" />
            <span>{row.due}</span>
          </div>
          {row.applicableFrom &&
      <div className="text-xs text-gray-500 mt-1">
              From: {new Date(row.applicableFrom).toLocaleDateString()}
            </div>
      }
        </div>

  },
  {
    key: 'late',
    header: 'Late Fee Rule',
    render: (row: FeeRuleData) =>
    <div>
          <div>{row.late}</div>
          {row.gracePeriod > 0 && row.lateFeeType !== 'None' &&
      <div className="text-xs text-gray-500 mt-1">
              Grace: {row.gracePeriod} days
            </div>
      }
        </div>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: FeeRuleData) =>
    <Badge
      variant={row.status === 'Active' ? 'success' : 'default'}
      onClick={() => handleToggleStatus(row.id)}
      className="cursor-pointer">

          {row.status}
        </Badge>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: FeeRuleData) =>
    <div className="flex gap-2">
          <Button variant="ghost" size="xs" onClick={() => handleEdit(row)}>
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
        variant="ghost"
        size="xs"
        className="text-red-500"
        onClick={() => handleDelete(row.id)}>

            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

  }];


  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Fee Rules & Installments
          </h1>
          <p className="text-sm text-gray-500">
            Configure payment schedules and due date rules
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="w-4 h-4 mr-2" />
          Add Rule
        </Button>
      </div>

      {/* Form Card */}
      {isFormOpen &&
      <Card>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {editingId ? 'Edit Fee Rule' : 'Add New Fee Rule'}
              </h2>
              <Button variant="ghost" size="xs" onClick={handleCancel}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Fee Category *
                  </label>
                  <select
                  value={formData.category}
                  onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md">

                    <option value="">Select Category</option>
                    {categoryOptions.map((cat) =>
                  <option key={cat} value={cat}>
                        {cat}
                      </option>
                  )}
                  </select>
                  {formErrors.category &&
                <p className="text-red-500 text-xs mt-1">{formErrors.category}</p>
                }
                </div>

                {/* Plan */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Installment Plan *
                  </label>
                  <select
                  value={formData.plan}
                  onChange={(e) => handlePlanChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md">

                    <option value="">Select Plan</option>
                    {planOptions.map((plan) =>
                  <option key={plan.value} value={plan.value}>
                        {plan.value}
                        {plan.installments > 0 && ` (${plan.installments} installments)`}
                      </option>
                  )}
                  </select>
                  {formErrors.plan &&
                <p className="text-red-500 text-xs mt-1">{formErrors.plan}</p>
                }
                </div>
              </div>

              {/* Due Date Configuration */}
              <div className="border border-gray-200 rounded-md p-4">
                <h3 className="font-medium mb-3">Due Date Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Due Type */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Due Date Type
                    </label>
                    <select
                    value={formData.dueType}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      dueType: e.target.value as FormData['dueType']
                    })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md">

                      <option value="Day of Month">Day of Month</option>
                      <option value="Fixed Date">Fixed Date</option>
                      <option value="Salary Deduction">Salary Deduction</option>
                    </select>
                  </div>

                  {/* Conditional Due Date Fields */}
                  {formData.dueType === 'Day of Month' &&
                <div>
                      <label className="block text-sm font-medium mb-2">
                        Day of Month *
                      </label>
                      <Input
                    type="number"
                    value={formData.dueDay}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      dueDay: parseInt(e.target.value) || 1
                    })
                    }
                    min={1}
                    max={31}
                    placeholder="e.g., 10" />

                      {formErrors.dueDay &&
                  <p className="text-red-500 text-xs mt-1">{formErrors.dueDay}</p>
                  }
                    </div>
                }

                  {formData.dueType === 'Fixed Date' &&
                <div>
                      <label className="block text-sm font-medium mb-2">
                        Due Date *
                      </label>
                      <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                    } />

                      {formErrors.dueDate &&
                  <p className="text-red-500 text-xs mt-1">{formErrors.dueDate}</p>
                  }
                    </div>
                }
                </div>

                {/* Applicable From */}
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">
                    Applicable From
                  </label>
                  <Input
                  type="date"
                  value={formData.applicableFrom}
                  onChange={(e) =>
                  setFormData({ ...formData, applicableFrom: e.target.value })
                  } />

                </div>
              </div>

              {/* Late Fee Configuration */}
              <div className="border border-gray-200 rounded-md p-4">
                <h3 className="font-medium mb-3">Late Fee Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Late Fee Type */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Late Fee Type
                    </label>
                    <select
                    value={formData.lateFeeType}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      lateFeeType: e.target.value as FormData['lateFeeType']
                    })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md">

                      <option value="None">None</option>
                      <option value="Fixed">Fixed Amount</option>
                      <option value="Per Day">Per Day</option>
                      <option value="Percentage">Percentage</option>
                    </select>
                  </div>

                  {/* Late Fee Amount */}
                  {formData.lateFeeType !== 'None' &&
                <>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {formData.lateFeeType === 'Percentage' ?
                      'Percentage (%)' :
                      'Amount (₹)'}
                        </label>
                        <Input
                      type="number"
                      value={formData.lateFeeAmount}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        lateFeeAmount: parseFloat(e.target.value) || 0
                      })
                      }
                      min={0}
                      step={formData.lateFeeType === 'Percentage' ? '0.1' : '1'} />

                        {formErrors.lateFeeAmount &&
                    <p className="text-red-500 text-xs mt-1">
                            {formErrors.lateFeeAmount}
                          </p>
                    }
                      </div>

                      {/* Grace Period */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Grace Period (days)
                        </label>
                        <Input
                      type="number"
                      value={formData.gracePeriod}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        gracePeriod: parseInt(e.target.value) || 0
                      })
                      }
                      min={0}
                      max={30} />

                      </div>
                    </>
                }
                </div>

                {/* Late Fee Preview */}
                {formData.lateFeeType !== 'None' &&
              <div className="mt-3 p-3 bg-gray-50 rounded-md">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-gray-500 mt-0.5" />
                      <div className="text-sm text-gray-600">
                        <strong>Late Fee Preview:</strong> {formatLateFee()}
                      </div>
                    </div>
                  </div>
              }
              </div>

              {/* Installment Details */}
              {formData.installments.length > 0 &&
            <div className="border border-gray-200 rounded-md p-4">
                  <h3 className="font-medium mb-3">Installment Details</h3>
                  <div className="space-y-3">
                    {formData.installments.map((installment, index) =>
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-gray-50 rounded">

                        <div>
                          <label className="block text-xs font-medium mb-1">
                            Installment #{installment.installmentNo}
                          </label>
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">
                            Due Date
                          </label>
                          <Input
                      type="text"
                      value={installment.dueDate}
                      onChange={(e) =>
                      handleInstallmentChange(index, 'dueDate', e.target.value)
                      }
                      placeholder="e.g., 10th April" />

                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">
                            Percentage (%)
                          </label>
                          <Input
                      type="number"
                      value={installment.percentage}
                      onChange={(e) =>
                      handleInstallmentChange(
                        index,
                        'percentage',
                        parseFloat(e.target.value) || 0
                      )
                      }
                      min={0}
                      max={100}
                      step={0.01} />

                        </div>
                      </div>
                )}
                    <div className="text-sm text-gray-600">
                      Total Percentage:{' '}
                      {formData.installments.
                  reduce((sum, inst) => sum + inst.percentage, 0).
                  toFixed(2)}
                      %
                    </div>
                  </div>
                </div>
            }

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description / Notes
                </label>
                <textarea
                value={formData.description}
                onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Additional notes or description..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={2} />

              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                    type="radio"
                    value="Active"
                    checked={formData.status === 'Active'}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as 'Active' | 'Inactive'
                    })
                    } />

                    <span>Active</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                    type="radio"
                    value="Inactive"
                    checked={formData.status === 'Inactive'}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as 'Active' | 'Inactive'
                    })
                    } />

                    <span>Inactive</span>
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="ghost" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  {editingId ? 'Update Rule' : 'Save Rule'}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      }

      {/* Filters and Table Card */}
      <Card>
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <Input
              leftIcon={<Search className="w-4 h-4" />}
              placeholder="Search rules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} />

          </div>

          {/* Category Filter */}
          <div className="min-w-[150px]">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md">

              <option value="">All Categories</option>
              {uniqueCategories.map((cat) =>
              <option key={cat} value={cat}>
                  {cat}
                </option>
              )}
            </select>
          </div>

          {/* Plan Filter */}
          <div className="min-w-[150px]">
            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md">

              <option value="">All Plans</option>
              {uniquePlans.map((plan) =>
              <option key={plan} value={plan}>
                  {plan}
                </option>
              )}
            </select>
          </div>

          {/* Status Filter */}
          <div className="min-w-[120px]">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md">

              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Clear Filters */}
          {(searchQuery || filterCategory || filterPlan || filterStatus) &&
          <Button variant="ghost" onClick={handleClearFilters}>
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          }
        </div>

        {/* Results Summary */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredData.length} of {data.length} rules
        </div>

        {filteredData.length === 0 ?
        <div className="text-center py-12">
            <p className="text-gray-500">
              {searchQuery || filterCategory || filterPlan || filterStatus ?
            'No fee rules found matching your filters.' :
            'No fee rules added yet. Click "Add Rule" to create one.'}
            </p>
            {(searchQuery || filterCategory || filterPlan || filterStatus) &&
          <Button
            variant="ghost"
            onClick={handleClearFilters}
            className="mt-2">

                Clear Filters
              </Button>
          }
          </div> :

        <Table columns={columns} data={filteredData} />
        }
      </Card>
    </div>);

}