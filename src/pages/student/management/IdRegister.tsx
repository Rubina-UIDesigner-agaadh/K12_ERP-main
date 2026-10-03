import React, { useState } from 'react';
import {
  Download,
  CreditCard,
  Printer,
  RefreshCw,
  AlertTriangle,
  Search,
  Eye,
  User,
  Filter,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X,
  Upload,
  RotateCcw } from
'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Modal } from '../../../components/ui/Modal';
// --- Types ---
interface IDRecord {
  id: string;
  student: string;
  grNo: string;
  class: string;
  section: string;
  issueDate: string;
  expiryDate: string;
  status: 'Active' | 'Lost' | 'Expired' | 'Damaged';
  type: 'Regular' | 'Replacement' | 'Temporary';
}
// --- Mock Data ---
const MOCK_ID_RECORDS: IDRecord[] = [
{
  id: 'ID-2024-001',
  student: 'Aarav Patel',
  grNo: 'GR-001',
  class: '10',
  section: 'A',
  issueDate: '2024-04-01',
  expiryDate: '2025-03-31',
  status: 'Active',
  type: 'Regular'
},
{
  id: 'ID-2024-003',
  student: 'Ishaan Gupta',
  grNo: 'GR-003',
  class: '10',
  section: 'B',
  issueDate: '2024-04-05',
  expiryDate: '2025-03-31',
  status: 'Lost',
  type: 'Replacement'
},
{
  id: 'ID-2024-004',
  student: 'Meera Singh',
  grNo: 'GR-005',
  class: '9',
  section: 'A',
  issueDate: '2024-04-02',
  expiryDate: '2025-03-31',
  status: 'Active',
  type: 'Regular'
},
{
  id: 'ID-2024-005',
  student: 'Rohan Verma',
  grNo: 'GR-012',
  class: '11',
  section: 'C',
  issueDate: '2024-04-10',
  expiryDate: '2025-03-31',
  status: 'Expired',
  type: 'Regular'
},
{
  id: 'ID-2024-006',
  student: 'Sanya Mirza',
  grNo: 'GR-015',
  class: '12',
  section: 'A',
  issueDate: '2024-04-12',
  expiryDate: '2025-03-31',
  status: 'Active',
  type: 'Regular'
},
// Adding more data to demonstrate scrollbar
{
  id: 'ID-2024-007',
  student: 'Kabir Khan',
  grNo: 'GR-020',
  class: '10',
  section: 'B',
  issueDate: '2024-04-15',
  expiryDate: '2025-03-31',
  status: 'Active',
  type: 'Regular'
},
{
  id: 'ID-2024-008',
  student: 'Zara Sheikh',
  grNo: 'GR-022',
  class: '9',
  section: 'C',
  issueDate: '2024-04-16',
  expiryDate: '2025-03-31',
  status: 'Damaged',
  type: 'Replacement'
}];

export function IDRegisterPage() {
  // --- State ---
  const [hasSearched, setHasSearched] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  // Filter State
  const [filters, setFilters] = useState({
    searchQuery: '',
    grNo: '',
    suId: '',
    firstName: '',
    lastName: '',
    rollNo: '',
    class: '',
    section: '',
    status: 'all',
    type: 'All Types'
  });
  // Modal State
  const [selectedStudentForIssue, setSelectedStudentForIssue] =
  useState<string>('');
  const [issueReason, setIssueReason] = useState('new_admission');
  // --- Handlers ---
  const handleSearch = () => {
    // In a real app, you would fetch data here
    setHasSearched(true);
  };
  const handleReset = () => {
    setFilters({
      searchQuery: '',
      grNo: '',
      suId: '',
      firstName: '',
      lastName: '',
      rollNo: '',
      class: '',
      section: '',
      status: 'all',
      type: 'All Types'
    });
    setHasSearched(false);
  };
  const handleIssueNewID = () => {
    setIsIssueModalOpen(true);
  };
  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Lost':
        return 'destructive';
      // Red
      case 'Expired':
        return 'warning';
      // Yellow
      case 'Damaged':
        return 'destructive';
      default:
        return 'default';
    }
  };
  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ID Card Register</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track issued ID cards, replacements, and validity status.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Log
          </Button>
          <Button variant="primary" onClick={handleIssueNewID}>
            <CreditCard className="w-4 h-4 mr-2" />
            Issue New ID
          </Button>
        </div>
      </div>

      {/* Search Filter Panel */}
      <Card className="p-4 flex-shrink-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            label="GR Number"
            placeholder="e.g. GR-1001"
            value={filters.grNo}
            onChange={(e) => handleFilterChange('grNo', e.target.value)} />

          <Input
            label="SU ID"
            placeholder="e.g. SU-2023-001"
            value={filters.suId}
            onChange={(e) => handleFilterChange('suId', e.target.value)} />

          <Input
            label="First Name"
            placeholder="Search first name"
            value={filters.firstName}
            onChange={(e) => handleFilterChange('firstName', e.target.value)} />

          <Input
            label="Last Name"
            placeholder="Search last name"
            value={filters.lastName}
            onChange={(e) => handleFilterChange('lastName', e.target.value)} />

          <Input
            label="Roll No"
            placeholder="e.g. 15"
            value={filters.rollNo}
            onChange={(e) => handleFilterChange('rollNo', e.target.value)} />

          <Select
            label="Class"
            options={[
            {
              value: '',
              label: 'All Classes'
            },
            {
              value: '8',
              label: 'Class 8'
            },
            {
              value: '9',
              label: 'Class 9'
            },
            {
              value: '10',
              label: 'Class 10'
            },
            {
              value: '11',
              label: 'Class 11'
            },
            {
              value: '12',
              label: 'Class 12'
            }]
            }
            value={filters.class}
            onChange={(val) => handleFilterChange('class', val)} />

          <Select
            label="Division/Section"
            options={[
            {
              value: '',
              label: 'All Sections'
            },
            {
              value: 'A',
              label: 'Section A'
            },
            {
              value: 'B',
              label: 'Section B'
            },
            {
              value: 'C',
              label: 'Section C'
            }]
            }
            value={filters.section}
            onChange={(val) => handleFilterChange('section', val)} />

          <Select
            label="ID Status"
            options={[

            {
              value: 'Active',
              label: 'Active'
            },
            {
              value: 'Expired',
              label: 'Expired'
            },
            {
              value: 'Damaged',
              label: 'Incomplete'
            },

            {
              value: 'Lost',
              label: 'Lost'
            }]
            }
            value={filters.status}
            onChange={(val) => handleFilterChange('status', val)} />

        </div>

        <div className="flex gap-2 mt-4 justify-end border-t border-gray-100 pt-3">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" /> Reset
          </Button>
          <Button onClick={handleSearch} variant="primary">
            <Search className="w-4 h-4 mr-2" /> Search Records
          </Button>
        </div>
      </Card>

      {/* Results Area */}
      {hasSearched ?
      <Card className="p-0 flex flex-col flex-1 overflow-hidden h-[600px]">
          {' '}
          {/* Fixed height container */}
          {/* Scrollable Table Container */}
          <div className="overflow-x-auto overflow-y-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 font-medium">Card ID</th>
                  <th className="px-6 py-3 font-medium">Student Details</th>
                  <th className="px-6 py-3 font-medium">Class</th>
                  <th className="px-6 py-3 font-medium">Issue Date</th>
                  <th className="px-6 py-3 font-medium">Valid Till</th>
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MOCK_ID_RECORDS.map((row) =>
              <tr
                key={row.id}
                className="bg-white hover:bg-gray-50 transition-colors">

                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {row.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {row.student}
                        </div>
                        <div className="text-xs text-gray-500">{row.grNo}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {row.class}-{row.section}
                    </td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                      {row.issueDate}
                    </td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                      {row.expiryDate}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="text-xs">
                        {row.type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusBadgeVariant(row.status)}>
                        {row.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="xs" title="View Details">
                          <Eye className="w-4 h-4 text-gray-500" />
                        </Button>
                        <Button variant="ghost" size="xs" title="Print ID Card">
                          <Printer className="w-4 h-4 text-blue-600" />
                        </Button>
                        {row.status === 'Active' ?
                    <Button variant="ghost" size="xs" title="Mark Lost">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          </Button> :

                    <Button variant="ghost" size="xs" title="Re-issue">
                            <RefreshCw className="w-4 h-4 text-green-600" />
                          </Button>
                    }
                      </div>
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
          {/* Pagination Footer (Fixed at bottom of card) */}
          <div className="border-t p-4 bg-white flex items-center justify-between shrink-0">
            <span className="text-sm text-gray-500">
              Showing <span className="font-medium">1</span> to{' '}
              <span className="font-medium">{MOCK_ID_RECORDS.length}</span> of{' '}
              <span className="font-medium">{MOCK_ID_RECORDS.length}</span>{' '}
              results
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" disabled>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card> :

      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 min-h-[300px]">
          <Search className="w-12 h-12 text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">
            No Students Selected
          </h3>
          <p className="text-gray-500 mt-1 max-w-sm text-center">
            Use the search filters above to find students and view their ID card
            records.
          </p>
        </div>
      }

      {/* Issue Modal */}
      <Modal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        title="Issue New ID Card"
        size="lg">

        <div className="space-y-6">
          {/* Step 1: Search Student inside Modal */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <label className="block text-sm font-medium text-blue-900 mb-2">
              Search Student
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter Name or GR No."
                className="bg-white"
                value={selectedStudentForIssue}
                onChange={(e) => setSelectedStudentForIssue(e.target.value)} />

              <Button variant="primary">Search</Button>
            </div>
            {selectedStudentForIssue &&
            <div className="mt-3 p-3 bg-white rounded border border-blue-200 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Aarav Patel</p>
                  <p className="text-xs text-gray-500">Class 10-A • GR-001</p>
                </div>
                <Badge variant="success" className="ml-auto">
                  Active
                </Badge>
              </div>
            }
          </div>

          {/* Step 2: Issue Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Student Name"
              value="Aarav Patel"
              disabled
              className="bg-gray-50" />

            <Input
              label="Class & Section"
              value="10-A"
              disabled
              className="bg-gray-50" />

            <Input
              label="GR Number"
              value="GR-001"
              disabled
              className="bg-gray-50" />

            <Input
              label="Date of Birth"
              value="2008-05-15"
              disabled
              className="bg-gray-50" />


            <Select
              label="Reason for Issue"
              options={[
              {
                value: 'new_admission',
                label: 'New Admission'
              },
              {
                value: 'lost',
                label: 'Lost Card'
              },
              {
                value: 'damaged',
                label: 'Damaged Card'
              },
              {
                value: 'correction',
                label: 'Correction/Name Change'
              },
              {
                value: 'renewal',
                label: 'Annual Renewal'
              }]
              }
              value={issueReason}
              onChange={setIssueReason} />


            <Input label="Valid Till" type="date" defaultValue="2025-03-31" />
          </div>

          {/* Step 3: Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Card Photo
            </label>
            <div className="flex items-start gap-4">
              <div className="w-24 h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center shrink-0">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <div className="flex-1">
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <Upload className="w-5 h-5 text-gray-400 mb-1" />
                  <span className="text-sm text-gray-500">
                    Click to upload photo
                  </span>
                  <input type="file" className="hidden" accept="image/*" />
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Upload a recent passport size photograph. <br />
                  Supported formats: JPG, PNG. Max size 2MB.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={() => setIsIssueModalOpen(false)}>

              Cancel
            </Button>
            <Button variant="primary">Generate & Issue ID</Button>
          </div>
        </div>
      </Modal>
    </div>);

}
// Alias for PageRegistry compatibility
export { IDRegisterPage as IdRegister };