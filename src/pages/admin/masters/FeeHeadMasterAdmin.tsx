// src/pages/admin/masters/FeeHeadMasterAdmin.tsx

import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Plus, Edit2, Trash2, Search, X, DollarSign } from 'lucide-react';

interface FeeHead {
  id: number;
  name: string;
  type: string;
  account: string;
  taxable: boolean;
  description: string;
  amount: number;
  gstPercentage: number;
  isActive: boolean;
  applicableTo: string;
  priority: number;
}

export function FeeHeadMasterAdmin() {
  const [feeHeads, setFeeHeads] = useState<FeeHead[]>([
  {
    id: 1,
    name: 'Tuition Fee',
    type: 'Recurring',
    account: 'INC-001',
    taxable: false,
    description: 'Monthly tuition fee for academic sessions',
    amount: 5000,
    gstPercentage: 0,
    isActive: true,
    applicableTo: 'All Students',
    priority: 1
  },
  {
    id: 2,
    name: 'Admission Fee',
    type: 'One-time',
    account: 'INC-002',
    taxable: true,
    description: 'One-time admission fee at the time of enrollment',
    amount: 15000,
    gstPercentage: 18,
    isActive: true,
    applicableTo: 'New Admissions',
    priority: 2
  },
  {
    id: 3,
    name: 'Transport Fee',
    type: 'Recurring',
    account: 'INC-003',
    taxable: false,
    description: 'Monthly transport fee based on distance',
    amount: 2000,
    gstPercentage: 0,
    isActive: true,
    applicableTo: 'Transport Users',
    priority: 3
  },
  {
    id: 4,
    name: 'Library Fine',
    type: 'Ad-hoc',
    account: 'INC-004',
    taxable: false,
    description: 'Fine for late return of library books',
    amount: 10,
    gstPercentage: 0,
    isActive: true,
    applicableTo: 'All Students',
    priority: 10
  },
  {
    id: 5,
    name: 'Exam Fee',
    type: 'Term-wise',
    account: 'INC-005',
    taxable: false,
    description: 'Examination fee charged per term',
    amount: 1500,
    gstPercentage: 0,
    isActive: true,
    applicableTo: 'All Students',
    priority: 4
  },
  {
    id: 6,
    name: 'Lab Fee',
    type: 'Recurring',
    account: 'INC-006',
    taxable: true,
    description: 'Laboratory usage fee for science students',
    amount: 1000,
    gstPercentage: 18,
    isActive: true,
    applicableTo: 'Science Students',
    priority: 5
  },
  {
    id: 7,
    name: 'Computer Fee',
    type: 'Recurring',
    account: 'INC-007',
    taxable: true,
    description: 'Computer lab access and maintenance fee',
    amount: 800,
    gstPercentage: 18,
    isActive: true,
    applicableTo: 'All Students',
    priority: 6
  },
  {
    id: 8,
    name: 'Sports Fee',
    type: 'Annual',
    account: 'INC-008',
    taxable: false,
    description: 'Annual sports and games fee',
    amount: 2500,
    gstPercentage: 0,
    isActive: true,
    applicableTo: 'All Students',
    priority: 7
  },
  {
    id: 9,
    name: 'Development Fee',
    type: 'Annual',
    account: 'INC-009',
    taxable: false,
    description: 'Infrastructure development and maintenance',
    amount: 5000,
    gstPercentage: 0,
    isActive: true,
    applicableTo: 'All Students',
    priority: 8
  },
  {
    id: 10,
    name: 'Late Fee Penalty',
    type: 'Ad-hoc',
    account: 'INC-010',
    taxable: false,
    description: 'Penalty for late fee payment',
    amount: 500,
    gstPercentage: 0,
    isActive: true,
    applicableTo: 'Defaulters',
    priority: 11
  },
  {
    id: 11,
    name: 'Registration Fee',
    type: 'One-time',
    account: 'INC-011',
    taxable: true,
    description: 'Initial registration fee for new students',
    amount: 2000,
    gstPercentage: 18,
    isActive: true,
    applicableTo: 'New Admissions',
    priority: 1
  },
  {
    id: 12,
    name: 'Hostel Fee',
    type: 'Recurring',
    account: 'INC-012',
    taxable: false,
    description: 'Monthly hostel accommodation fee',
    amount: 8000,
    gstPercentage: 0,
    isActive: true,
    applicableTo: 'Hostel Students',
    priority: 3
  }]
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedTaxable, setSelectedTaxable] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingFeeHead, setEditingFeeHead] = useState<FeeHead | null>(null);
  const [viewingFeeHead, setViewingFeeHead] = useState<FeeHead | null>(null);
  const [formData, setFormData] = useState<Omit<FeeHead, 'id'>>({
    name: '',
    type: 'Recurring',
    account: '',
    taxable: false,
    description: '',
    amount: 0,
    gstPercentage: 0,
    isActive: true,
    applicableTo: 'All Students',
    priority: 1
  });

  // Fee type options
  const feeTypeOptions = [
  'Recurring',
  'One-time',
  'Ad-hoc',
  'Term-wise',
  'Annual',
  'Quarterly'];


  // Applicable to options
  const applicableToOptions = [
  'All Students',
  'New Admissions',
  'Transport Users',
  'Science Students',
  'Hostel Students',
  'Defaulters',
  'Day Scholars'];


  // Filter fee heads based on search and filters
  const filteredFeeHeads = feeHeads.filter((feeHead) => {
    const matchesSearch =
    feeHead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feeHead.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feeHead.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || feeHead.type === selectedType;
    const matchesTaxable =
    selectedTaxable === 'all' ||
    selectedTaxable === 'yes' && feeHead.taxable ||
    selectedTaxable === 'no' && !feeHead.taxable;
    return matchesSearch && matchesType && matchesTaxable;
  });

  // Generate next account code
  const generateAccountCode = () => {
    const maxCode = Math.max(
      ...feeHeads.map((f) => parseInt(f.account.split('-')[1]))
    );
    return `INC-${String(maxCode + 1).padStart(3, '0')}`;
  };

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle type filter
  const handleTypeFilter = (value: string) => {
    setSelectedType(value);
  };

  // Handle taxable filter
  const handleTaxableFilter = (value: string) => {
    setSelectedTaxable(value);
  };

  // Handle add new fee head
  const handleAddNew = () => {
    setEditingFeeHead(null);
    setFormData({
      name: '',
      type: 'Recurring',
      account: generateAccountCode(),
      taxable: false,
      description: '',
      amount: 0,
      gstPercentage: 0,
      isActive: true,
      applicableTo: 'All Students',
      priority: feeHeads.length + 1
    });
    setIsModalOpen(true);
  };

  // Handle edit fee head
  const handleEdit = (feeHead: FeeHead) => {
    setEditingFeeHead(feeHead);
    setFormData({
      name: feeHead.name,
      type: feeHead.type,
      account: feeHead.account,
      taxable: feeHead.taxable,
      description: feeHead.description,
      amount: feeHead.amount,
      gstPercentage: feeHead.gstPercentage,
      isActive: feeHead.isActive,
      applicableTo: feeHead.applicableTo,
      priority: feeHead.priority
    });
    setIsModalOpen(true);
  };

  // Handle view fee head details
  const handleView = (feeHead: FeeHead) => {
    setViewingFeeHead(feeHead);
    setIsViewModalOpen(true);
  };

  // Handle delete fee head
  const handleDelete = (id: number) => {
    const feeHead = feeHeads.find((f) => f.id === id);
    if (
    window.confirm(
      `Are you sure you want to delete "${feeHead?.name}"? This action cannot be undone.`
    ))
    {
      setFeeHeads(feeHeads.filter((f) => f.id !== id));
    }
  };

  // Handle toggle active status
  const handleToggleActive = (id: number) => {
    setFeeHeads(
      feeHeads.map((feeHead) =>
      feeHead.id === id ?
      { ...feeHead, isActive: !feeHead.isActive } :
      feeHead
      )
    );
  };

  // Handle form input change
  const handleInputChange = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>

  {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked
      });

      // If taxable is unchecked, reset GST percentage
      if (name === 'taxable' && !checked) {
        setFormData((prev) => ({
          ...prev,
          taxable: false,
          gstPercentage: 0
        }));
      }
    } else {
      setFormData({
        ...formData,
        [name]:
        name === 'amount' || name === 'gstPercentage' || name === 'priority' ?
        parseFloat(value) || 0 :
        value
      });
    }
  };

  // Validate form data
  const validateForm = (): string | null => {
    if (!formData.name.trim()) {
      return 'Fee head name is required';
    }
    if (!formData.account.trim()) {
      return 'Account code is required';
    }
    if (formData.amount < 0) {
      return 'Amount cannot be negative';
    }
    if (formData.taxable && formData.gstPercentage <= 0) {
      return 'GST percentage is required for taxable fee heads';
    }
    if (formData.gstPercentage < 0 || formData.gstPercentage > 100) {
      return 'GST percentage must be between 0 and 100';
    }

    // Check for duplicate name (excluding current editing item)
    const duplicateName = feeHeads.find(
      (f) =>
      f.name.toLowerCase() === formData.name.toLowerCase() &&
      f.id !== editingFeeHead?.id
    );
    if (duplicateName) {
      return 'A fee head with this name already exists';
    }

    // Check for duplicate account code (excluding current editing item)
    const duplicateAccount = feeHeads.find(
      (f) =>
      f.account.toLowerCase() === formData.account.toLowerCase() &&
      f.id !== editingFeeHead?.id
    );
    if (duplicateAccount) {
      return 'This account code is already in use';
    }

    return null;
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    if (editingFeeHead) {
      // Update existing fee head
      setFeeHeads(
        feeHeads.map((feeHead) =>
        feeHead.id === editingFeeHead.id ?
        { ...feeHead, ...formData } :
        feeHead
        )
      );
    } else {
      // Add new fee head
      const newFeeHead: FeeHead = {
        id: Math.max(...feeHeads.map((f) => f.id), 0) + 1,
        ...formData
      };
      setFeeHeads([...feeHeads, newFeeHead]);
    }

    handleCloseModal();
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFeeHead(null);
    setFormData({
      name: '',
      type: 'Recurring',
      account: '',
      taxable: false,
      description: '',
      amount: 0,
      gstPercentage: 0,
      isActive: true,
      applicableTo: 'All Students',
      priority: 1
    });
  };

  // Handle view modal close
  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingFeeHead(null);
  };

  // Handle duplicate fee head
  const handleDuplicate = (feeHead: FeeHead) => {
    setEditingFeeHead(null);
    setFormData({
      name: `${feeHead.name} (Copy)`,
      type: feeHead.type,
      account: generateAccountCode(),
      taxable: feeHead.taxable,
      description: feeHead.description,
      amount: feeHead.amount,
      gstPercentage: feeHead.gstPercentage,
      isActive: true,
      applicableTo: feeHead.applicableTo,
      priority: feeHeads.length + 1
    });
    setIsModalOpen(true);
  };

  const columns = [
  {
    key: 'name',
    header: 'Fee Head Name',
    render: (row: FeeHead) =>
    <div>
          <span
        className="font-medium cursor-pointer hover:underline"
        onClick={() => handleView(row)}>

            {row.name}
          </span>
          {!row.isActive &&
      <Badge variant="secondary" className="ml-2">
              Inactive
            </Badge>
      }
        </div>

  },
  {
    key: 'type',
    header: 'Frequency Type'
  },
  {
    key: 'account',
    header: 'Account Code'
  },
  {
    key: 'amount',
    header: 'Base Amount',
    render: (row: FeeHead) =>
    <span>₹{row.amount.toLocaleString('en-IN')}</span>

  },
  {
    key: 'taxable',
    header: 'Taxable',
    render: (row: FeeHead) =>
    <div>
          {row.taxable ?
      <span>Yes ({row.gstPercentage}% GST)</span> :

      <span>No</span>
      }
        </div>

  },
  {
    key: 'applicableTo',
    header: 'Applicable To'
  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: FeeHead) =>
    <div className="flex gap-2">
          <Button variant="ghost" size="xs" onClick={() => handleEdit(row)}>
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
        variant="ghost"
        size="xs"
        onClick={() => handleDuplicate(row)}
        title="Duplicate">

            <Plus className="w-4 h-4" />
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
          <h1 className="text-2xl font-bold text-gray-900">Fee Head Master</h1>
          <p className="text-sm text-gray-500">
            Define fee heads and accounting links
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="w-4 h-4 mr-2" />
          Add Fee Head
        </Button>
      </div>

      <Card>
        <div className="flex gap-4 mb-6 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <Input
              leftIcon={<Search className="w-4 h-4" />}
              placeholder="Search fee heads..."
              value={searchTerm}
              onChange={handleSearch} />

          </div>
          <Select
            placeholder="Fee Type"
            value={selectedType}
            onChange={(e) => handleTypeFilter(e.target.value)}
            options={[
            { value: 'all', label: 'All Types' },
            ...feeTypeOptions.map((type) => ({
              value: type,
              label: type
            }))]
            } />

          <Select
            placeholder="Taxable"
            value={selectedTaxable}
            onChange={(e) => handleTaxableFilter(e.target.value)}
            options={[
            { value: 'all', label: 'All' },
            { value: 'yes', label: 'Taxable' },
            { value: 'no', label: 'Non-Taxable' }]
            } />

        </div>

        <div className="mb-4 text-sm text-gray-500">
          Showing {filteredFeeHeads.length} of {feeHeads.length} fee heads
        </div>

        <Table columns={columns} data={filteredFeeHeads} />
      </Card>

      {/* Add/Edit Modal */}
      {isModalOpen &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingFeeHead ? 'Edit Fee Head' : 'Add New Fee Head'}
              </h2>
              <button
              onClick={handleCloseModal}
              className="text-gray-500 hover:text-gray-700">

                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Fee Head Name *
                  </label>
                  <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter fee head name"
                  required />

                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Account Code *
                  </label>
                  <Input
                  name="account"
                  value={formData.account}
                  onChange={handleInputChange}
                  placeholder="Enter account code"
                  required />

                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Frequency Type *
                  </label>
                  <Select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  options={feeTypeOptions.map((type) => ({
                    value: type,
                    label: type
                  }))}
                  required />

                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Applicable To *
                  </label>
                  <Select
                  name="applicableTo"
                  value={formData.applicableTo}
                  onChange={handleInputChange}
                  options={applicableToOptions.map((option) => ({
                    value: option,
                    label: option
                  }))}
                  required />

                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Base Amount (₹) *
                  </label>
                  <Input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="Enter base amount"
                  min="0"
                  step="0.01"
                  required />

                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Priority Order
                  </label>
                  <Input
                  type="number"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  placeholder="Enter priority"
                  min="1" />

                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter description"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3} />

              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <input
                  type="checkbox"
                  id="taxable"
                  name="taxable"
                  checked={formData.taxable}
                  onChange={handleInputChange}
                  className="w-4 h-4" />

                  <label htmlFor="taxable" className="text-sm font-medium">
                    Taxable (GST Applicable)
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-4 h-4" />

                  <label htmlFor="isActive" className="text-sm font-medium">
                    Active
                  </label>
                </div>
              </div>

              {formData.taxable &&
            <div>
                  <label className="block text-sm font-medium mb-1">
                    GST Percentage (%) *
                  </label>
                  <Input
                type="number"
                name="gstPercentage"
                value={formData.gstPercentage}
                onChange={handleInputChange}
                placeholder="Enter GST percentage"
                min="0"
                max="100"
                step="0.01"
                required={formData.taxable} />

                </div>
            }

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  {editingFeeHead ? 'Update Fee Head' : 'Add Fee Head'}
                </Button>
                <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
                className="flex-1">

                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      }

      {/* View Details Modal */}
      {isViewModalOpen && viewingFeeHead &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Fee Head Details
              </h2>
              <button
              onClick={handleCloseViewModal}
              className="text-gray-500 hover:text-gray-700">

                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Fee Head Name</label>
                  <p className="font-medium">{viewingFeeHead.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Account Code</label>
                  <p className="font-medium">{viewingFeeHead.account}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Frequency Type</label>
                  <p className="font-medium">{viewingFeeHead.type}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Applicable To</label>
                  <p className="font-medium">{viewingFeeHead.applicableTo}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Base Amount</label>
                  <p className="font-medium">
                    ₹{viewingFeeHead.amount.toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Taxable</label>
                  <p className="font-medium">
                    {viewingFeeHead.taxable ?
                  `Yes (${viewingFeeHead.gstPercentage}% GST)` :
                  'No'}
                  </p>
                </div>
              </div>

              {viewingFeeHead.taxable &&
            <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">GST Amount</label>
                    <p className="font-medium">
                      ₹
                      {(
                  viewingFeeHead.amount * viewingFeeHead.gstPercentage /
                  100).
                  toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Total Amount</label>
                    <p className="font-medium">
                      ₹
                      {(
                  viewingFeeHead.amount +
                  viewingFeeHead.amount * viewingFeeHead.gstPercentage /
                  100).
                  toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
            }

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Priority</label>
                  <p className="font-medium">{viewingFeeHead.priority}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Status</label>
                  <p className="font-medium">
                    {viewingFeeHead.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500">Description</label>
                <p className="font-medium">
                  {viewingFeeHead.description || 'No description available'}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                onClick={() => {
                  handleCloseViewModal();
                  handleEdit(viewingFeeHead);
                }}
                className="flex-1">

                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                variant="outline"
                onClick={handleCloseViewModal}
                className="flex-1">

                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}