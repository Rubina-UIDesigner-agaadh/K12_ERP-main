import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Download, Filter, X, RefreshCw, Save, FileText, Eye, ChevronDown, ChevronUp,
  Calendar, User, Phone, Building, GraduationCap, CheckCircle, AlertCircle, Bookmark,
  History, Sliders, MoreHorizontal, MapPin, Users, Check } from
'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';

const initialFilters = {
  searchScope: 'all', studentName: '', parentMobile: '', parentEmail: '', applicationId: '', status: '',
  fromDate: '', toDate: '', academicYear: '', classApplied: '', section: '', stream: '', board: '', medium: '',
  admissionType: '', category: '', quota: '', gender: '', religion: '', inquirySource: '', referralType: '',
  city: '', state: '', pincode: '', feeStatus: '', scholarshipApplied: '', transportRequired: '', hostelRequired: '',
  documentStatus: '', verificationStatus: '', assignedTo: '', createdBy: '', lastModifiedBy: '', sortBy: 'date', sortOrder: 'desc',
  batch: ''
};

const branchOptions = [
{ value: 'main-campus', label: 'Main Campus - Ahmedabad', color: 'bg-blue-500' },
{ value: 'satellite', label: 'Satellite Branch - Ahmedabad', color: 'bg-green-500' },
{ value: 'gandhinagar', label: 'Gandhinagar Branch', color: 'bg-purple-500' },
{ value: 'vadodara', label: 'Vadodara Branch', color: 'bg-orange-500' },
{ value: 'surat', label: 'Surat Branch', color: 'bg-pink-500' },
{ value: 'rajkot', label: 'Rajkot Branch', color: 'bg-cyan-500' }];


const batchOptions = [
{ value: '', label: 'All Batches' },
{ value: 'morning', label: 'Morning Batch (7:00 AM - 12:00 PM)' },
{ value: 'afternoon', label: 'Afternoon Batch (12:00 PM - 5:00 PM)' },
{ value: 'evening', label: 'Evening Batch (5:00 PM - 8:00 PM)' },
{ value: 'full-day', label: 'Full Day Batch' }];


const allResults = [
{ id: 'APP-2024-001', name: 'Aarav Gupta', parentName: 'Rajesh Gupta', parentMobile: '9876543210', parentEmail: 'rajesh@email.com', type: 'Application', class: 'Class 5', section: 'A', status: 'Submitted', date: '2024-03-10', academicYear: '2024-25', category: 'General', gender: 'Male', source: 'Website', city: 'Ahmedabad', feeStatus: 'Pending', documentStatus: 'Complete', verificationStatus: 'Pending', assignedTo: 'Mrs. Sharma', branch: 'main-campus', batch: 'morning' },
{ id: 'INQ-2024-045', name: 'Zara Khan', parentName: 'Ahmed Khan', parentMobile: '9876543211', parentEmail: 'ahmed@email.com', type: 'Inquiry', class: 'Class 3', section: '-', status: 'New', date: '2024-03-12', academicYear: '2024-25', category: 'OBC', gender: 'Female', source: 'Walk-in', city: 'Gandhinagar', feeStatus: '-', documentStatus: '-', verificationStatus: '-', assignedTo: 'Mr. Patel', branch: 'gandhinagar', batch: 'afternoon' },
{ id: 'APP-2024-002', name: 'Vihaan Sharma', parentName: 'Suresh Sharma', parentMobile: '9876543212', parentEmail: 'suresh@email.com', type: 'Application', class: 'Class 1', section: 'B', status: 'Under Review', date: '2024-03-08', academicYear: '2024-25', category: 'General', gender: 'Male', source: 'Referral', city: 'Ahmedabad', feeStatus: 'Paid', documentStatus: 'Partial', verificationStatus: 'In Progress', assignedTo: 'Mrs. Sharma', branch: 'satellite', batch: 'morning' },
{ id: 'APP-2024-003', name: 'Ananya Patel', parentName: 'Mehul Patel', parentMobile: '9876543213', parentEmail: 'mehul@email.com', type: 'Application', class: 'Class 8', section: 'A', status: 'Approved', date: '2024-03-05', academicYear: '2024-25', category: 'SC', gender: 'Female', source: 'School Event', city: 'Vadodara', feeStatus: 'Paid', documentStatus: 'Complete', verificationStatus: 'Verified', assignedTo: 'Mr. Patel', branch: 'vadodara', batch: 'full-day' },
{ id: 'INQ-2024-046', name: 'Rohan Singh', parentName: 'Harpreet Singh', parentMobile: '9876543214', parentEmail: 'harpreet@email.com', type: 'Inquiry', class: 'Class 6', section: '-', status: 'Follow-up', date: '2024-03-11', academicYear: '2024-25', category: 'General', gender: 'Male', source: 'Phone', city: 'Surat', feeStatus: '-', documentStatus: '-', verificationStatus: '-', assignedTo: 'Mrs. Sharma', branch: 'surat', batch: 'evening' },
{ id: 'APP-2024-004', name: 'Priya Verma', parentName: 'Anil Verma', parentMobile: '9876543215', parentEmail: 'anil@email.com', type: 'Application', class: 'Class 11', section: 'Science', status: 'Rejected', date: '2024-03-01', academicYear: '2024-25', category: 'EWS', gender: 'Female', source: 'Advertisement', city: 'Rajkot', feeStatus: 'Refunded', documentStatus: 'Complete', verificationStatus: 'Verified', assignedTo: 'Mr. Patel', branch: 'rajkot', batch: 'morning' },
{ id: 'APP-2024-005', name: 'Kavya Mehta', parentName: 'Rakesh Mehta', parentMobile: '9876543216', parentEmail: 'rakesh@email.com', type: 'Application', class: 'Class 4', section: 'A', status: 'Submitted', date: '2024-03-13', academicYear: '2024-25', category: 'General', gender: 'Female', source: 'Website', city: 'Ahmedabad', feeStatus: 'Pending', documentStatus: 'Partial', verificationStatus: 'Pending', assignedTo: 'Mrs. Sharma', branch: 'main-campus', batch: 'afternoon' },
{ id: 'APP-2024-006', name: 'Arjun Reddy', parentName: 'Krishna Reddy', parentMobile: '9876543217', parentEmail: 'krishna@email.com', type: 'Application', class: 'Class 7', section: 'B', status: 'Under Review', date: '2024-03-09', academicYear: '2024-25', category: 'General', gender: 'Male', source: 'Referral', city: 'Vadodara', feeStatus: 'Paid', documentStatus: 'Complete', verificationStatus: 'In Progress', assignedTo: 'Mr. Patel', branch: 'vadodara', batch: 'morning' }];


const savedSearches = [
{ id: 1, name: 'Pending Applications - Class 1', filters: {} },
{ id: 2, name: 'RTE Admissions 2024', filters: {} },
{ id: 3, name: 'Transport Required Students', filters: {} }];


const recentSearches = [
{ query: 'Class 5 pending applications', time: '2 hours ago' },
{ query: 'OBC category students', time: '1 day ago' },
{ query: 'Online inquiry source', time: '3 days ago' }];


const allColumns = [
{ key: 'id', label: 'ID', default: true },
{ key: 'name', label: 'Student Name', default: true },
{ key: 'parentName', label: 'Parent Name', default: false },
{ key: 'parentMobile', label: 'Mobile', default: false },
{ key: 'parentEmail', label: 'Email', default: false },
{ key: 'type', label: 'Type', default: true },
{ key: 'class', label: 'Class', default: true },
{ key: 'section', label: 'Section', default: false },
{ key: 'batch', label: 'Batch', default: true },
{ key: 'status', label: 'Status', default: true },
{ key: 'date', label: 'Date', default: true },
{ key: 'category', label: 'Category', default: false },
{ key: 'gender', label: 'Gender', default: false },
{ key: 'source', label: 'Source', default: false },
{ key: 'city', label: 'City', default: false },
{ key: 'feeStatus', label: 'Fee Status', default: false },
{ key: 'documentStatus', label: 'Documents', default: false },
{ key: 'assignedTo', label: 'Assigned To', default: false },
{ key: 'actions', label: 'Actions', default: true }];


const statusColors: Record<string, string> = { New: 'info', Submitted: 'warning', 'Under Review': 'warning', Approved: 'success', Rejected: 'danger', 'Follow-up': 'secondary' };
const feeColors: Record<string, string> = { Paid: 'success', Pending: 'warning', Refunded: 'danger', '-': 'secondary' };
const docColors: Record<string, string> = { Complete: 'success', Partial: 'warning', '-': 'secondary' };
const batchColors: Record<string, string> = { morning: 'info', afternoon: 'warning', evening: 'secondary', 'full-day': 'primary' };

export function AdmissionCustomSearch() {
  const navigate = useNavigate();
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showSaveSearchModal, setShowSaveSearchModal] = useState(false);
  const [savedSearchName, setSavedSearchName] = useState('');
  const [selectedColumns, setSelectedColumns] = useState<string[]>(allColumns.filter((c) => c.default).map((c) => c.key));
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [collapsedBranches, setCollapsedBranches] = useState<string[]>([]);

  const updateFilter = (key: string, value: string) => setFilters((prev) => ({ ...prev, [key]: value }));

  const toggleBranch = (branchValue: string) => {
    setSelectedBranches((prev) =>
    prev.includes(branchValue) ?
    prev.filter((b) => b !== branchValue) :
    [...prev, branchValue]
    );
  };

  const selectAllBranches = () => {
    setSelectedBranches(branchOptions.map((b) => b.value));
  };

  const clearAllBranches = () => {
    setSelectedBranches([]);
  };

  const toggleBranchCollapse = (branch: string) => {
    setCollapsedBranches((prev) =>
    prev.includes(branch) ?
    prev.filter((b) => b !== branch) :
    [...prev, branch]
    );
  };

  const filteredResults = useMemo(() => {
    if (!hasSearched) return [];
    return allResults.filter((item) => {
      // Branch filter
      if (selectedBranches.length > 0 && !selectedBranches.includes(item.branch)) return false;
      // Batch filter
      if (filters.batch && item.batch !== filters.batch) return false;
      if (filters.searchScope !== 'all' && (filters.searchScope === 'inquiry' && item.type !== 'Inquiry' || filters.searchScope === 'application' && item.type !== 'Application')) return false;
      if (filters.studentName && !item.name.toLowerCase().includes(filters.studentName.toLowerCase())) return false;
      if (filters.parentMobile && !item.parentMobile.includes(filters.parentMobile)) return false;
      if (filters.parentEmail && !item.parentEmail.toLowerCase().includes(filters.parentEmail.toLowerCase())) return false;
      if (filters.applicationId && !item.id.toLowerCase().includes(filters.applicationId.toLowerCase())) return false;
      if (filters.status && item.status.toLowerCase() !== filters.status.toLowerCase()) return false;
      if (filters.classApplied && !item.class.includes(filters.classApplied)) return false;
      if (filters.category && item.category.toLowerCase() !== filters.category.toLowerCase()) return false;
      if (filters.gender && item.gender.toLowerCase() !== filters.gender.toLowerCase()) return false;
      if (filters.city && !item.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
      if (filters.inquirySource && item.source.toLowerCase() !== filters.inquirySource.toLowerCase()) return false;
      if (filters.feeStatus && item.feeStatus.toLowerCase() !== filters.feeStatus.toLowerCase()) return false;
      if (filters.documentStatus && item.documentStatus.toLowerCase() !== filters.documentStatus.toLowerCase()) return false;
      if (filters.fromDate && new Date(item.date) < new Date(filters.fromDate)) return false;
      if (filters.toDate && new Date(item.date) > new Date(filters.toDate)) return false;
      if (filters.assignedTo && !item.assignedTo.toLowerCase().includes(filters.assignedTo.toLowerCase())) return false;
      return true;
    });
  }, [hasSearched, filters, selectedBranches]);

  // Group results by branch
  const groupedResults = useMemo(() => {
    const groups: Record<string, typeof allResults> = {};
    filteredResults.forEach((item) => {
      if (!groups[item.branch]) {
        groups[item.branch] = [];
      }
      groups[item.branch].push(item);
    });
    return groups;
  }, [filteredResults]);

  // Calculate branch statistics
  const branchStats = useMemo(() => {
    const stats: Record<string, {total: number;applications: number;inquiries: number;approved: number;pending: number;}> = {};
    filteredResults.forEach((item) => {
      if (!stats[item.branch]) {
        stats[item.branch] = { total: 0, applications: 0, inquiries: 0, approved: 0, pending: 0 };
      }
      stats[item.branch].total++;
      if (item.type === 'Application') stats[item.branch].applications++;
      if (item.type === 'Inquiry') stats[item.branch].inquiries++;
      if (item.status === 'Approved') stats[item.branch].approved++;
      if (item.status === 'Pending' || item.status === 'Submitted' || item.status === 'Under Review') stats[item.branch].pending++;
    });
    return stats;
  }, [filteredResults]);

  const handleSearch = () => {setIsLoading(true);setTimeout(() => {setHasSearched(true);setIsLoading(false);}, 500);};
  const resetFilters = () => {setFilters(initialFilters);setSelectedBranches([]);setHasSearched(false);};
  const activeFilterCount = Object.entries(filters).filter(([k, v]) => v && v !== 'all' && k !== 'sortBy' && k !== 'sortOrder').length + (selectedBranches.length > 0 ? 1 : 0);

  const getBranchLabel = (branchValue: string) => branchOptions.find((b) => b.value === branchValue)?.label || branchValue;
  const getBranchColor = (branchValue: string) => branchOptions.find((b) => b.value === branchValue)?.color || 'bg-gray-500';
  const getBatchLabel = (batchValue: string) => batchOptions.find((b) => b.value === batchValue)?.label || batchValue;

  const SelectField = ({ label, value, field, options }: {label: string;value: string;field: string;options: {value: string;label: string;}[];}) =>
  <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select value={value} onChange={(e) => updateFilter(field, e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>;


  const InputField = ({ label, value, field, placeholder, type = 'text' }: {label: string;value: string;field: string;placeholder?: string;type?: string;}) =>
  <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type={type} placeholder={placeholder} value={value} onChange={(e) => updateFilter(field, e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
    </div>;


  const columns = allColumns.filter((col) => selectedColumns.includes(col.key)).map((col) => ({
    key: col.key, header: col.label,
    render: (row: any) => {
      switch (col.key) {
        case 'id':return <span className="font-mono text-xs text-blue-600">{row.id}</span>;
        case 'name':return <div><span className="font-medium">{row.name}</span><p className="text-xs text-gray-500">{row.gender}</p></div>;
        case 'type':return <Badge variant={row.type === 'Application' ? 'primary' : 'secondary'}>{row.type}</Badge>;
        case 'status':return <Badge variant={statusColors[row.status] || 'secondary'}>{row.status}</Badge>;
        case 'feeStatus':return <Badge variant={feeColors[row.feeStatus] || 'secondary'}>{row.feeStatus}</Badge>;
        case 'documentStatus':return <Badge variant={docColors[row.documentStatus] || 'secondary'}>{row.documentStatus}</Badge>;
        case 'batch':return <Badge variant={batchColors[row.batch] || 'secondary'}>{row.batch.charAt(0).toUpperCase() + row.batch.slice(1).replace('-', ' ')}</Badge>;
        case 'parentMobile':return <span className="font-mono text-sm">{row.parentMobile}</span>;
        case 'actions':return <div className="flex items-center gap-1"><Button variant="ghost" size="sm" title="View"><Eye className="w-4 h-4" /></Button><Button variant="ghost" size="sm" title="More"><MoreHorizontal className="w-4 h-4" /></Button></div>;
        default:return <span className="text-sm">{row[col.key]}</span>;
      }
    }
  }));

  const classOptions = [{ value: '', label: 'All Classes' }, { value: 'Nursery', label: 'Nursery' }, { value: 'LKG', label: 'LKG' }, { value: 'UKG', label: 'UKG' }, ...[...Array(12)].map((_, i) => ({ value: `Class ${i + 1}`, label: `Class ${i + 1}` }))];

  return (
    <div className="h-[calc(100vh-64px)] w-full overflow-y-auto bg-gray-50/50 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
      <div className="space-y-6 p-6 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admission Custom Search</h1>
            <p className="text-gray-500">Advanced search across all admission records</p>
          </div>
          {hasSearched && <Button variant="outline" size="sm" onClick={resetFilters}><RefreshCw className="w-4 h-4 mr-2" />Reset</Button>}
        </div>

        {/* Quick Access */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Bookmark className="w-4 h-4 text-blue-600" />Saved Searches</h3>
            <div className="space-y-2">
              {savedSearches.map((s) =>
              <button key={s.id} className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-between group">
                  <span className="text-sm text-gray-700">{s.name}</span>
                  <Search className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                </button>
              )}
            </div>
          </Card>
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><History className="w-4 h-4 text-gray-600" />Recent Searches</h3>
            <div className="space-y-2">
              {recentSearches.map((s, i) =>
              <button key={i} className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between group">
                  <div><span className="text-sm text-gray-700">{s.query}</span><p className="text-xs text-gray-400">{s.time}</p></div>
                  <Search className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                </button>
              )}
            </div>
          </Card>
        </div>

        {/* Search Filters */}
        <Card className="p-4">
          <div className="space-y-6">
            {/* Branch & Batch Selection */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><MapPin className="w-4 h-4" />Branch & Batch Selection</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Multi-select Branch */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Branch(es)</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowBranchDropdown(!showBranchDropdown)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-left flex items-center justify-between">

                      <div className="flex flex-wrap gap-1 flex-1">
                        {selectedBranches.length === 0 ?
                        <span className="text-gray-500">All Branches</span> :
                        selectedBranches.length === branchOptions.length ?
                        <span className="text-gray-700">All Branches Selected</span> :

                        selectedBranches.slice(0, 2).map((branch) =>
                        <span key={branch} className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white ${getBranchColor(branch)}`}>
                              {getBranchLabel(branch).split(' - ')[0]}
                            </span>
                        )
                        }
                        {selectedBranches.length > 2 &&
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-700">
                            +{selectedBranches.length - 2} more
                          </span>
                        }
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showBranchDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showBranchDropdown &&
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                        <div className="p-2 border-b flex items-center justify-between">
                          <button
                          type="button"
                          onClick={selectAllBranches}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium">

                            Select All
                          </button>
                          <button
                          type="button"
                          onClick={clearAllBranches}
                          className="text-xs text-gray-500 hover:text-gray-700">

                            Clear All
                          </button>
                        </div>
                        <div className="max-h-60 overflow-y-auto py-1">
                          {branchOptions.map((branch) =>
                        <label
                          key={branch.value}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer">

                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          selectedBranches.includes(branch.value) ?
                          'bg-blue-600 border-blue-600' :
                          'border-gray-300'}`
                          }>
                                {selectedBranches.includes(branch.value) &&
                            <Check className="w-3 h-3 text-white" />
                            }
                              </div>
                              <div className="flex items-center gap-2 flex-1">
                                <span className={`w-3 h-3 rounded-full ${branch.color}`}></span>
                                <span className="text-sm text-gray-700">{branch.label}</span>
                              </div>
                              <input
                            type="checkbox"
                            className="sr-only"
                            checked={selectedBranches.includes(branch.value)}
                            onChange={() => toggleBranch(branch.value)} />

                            </label>
                        )}
                        </div>
                        <div className="p-2 border-t">
                          <button
                          type="button"
                          onClick={() => setShowBranchDropdown(false)}
                          className="w-full py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">

                            Done
                          </button>
                        </div>
                      </div>
                    }
                  </div>
                  {selectedBranches.length > 0 &&
                  <div className="mt-2 flex flex-wrap gap-1">
                      {selectedBranches.map((branch) =>
                    <span
                      key={branch}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white ${getBranchColor(branch)}`}>

                          {getBranchLabel(branch).split(' - ')[0]}
                          <button
                        type="button"
                        onClick={() => toggleBranch(branch)}
                        className="hover:bg-white/20 rounded-full p-0.5">

                            <X className="w-3 h-3" />
                          </button>
                        </span>
                    )}
                    </div>
                  }
                </div>

                {/* Single-select Batch */}
                <SelectField
                  label="Select Batch"
                  value={filters.batch}
                  field="batch"
                  options={batchOptions} />

              </div>
            </div>

            {/* Basic Search */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Search className="w-4 h-4" />Basic Search</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SelectField label="Search Scope" value={filters.searchScope} field="searchScope" options={[{ value: 'all', label: 'All Records' }, { value: 'inquiry', label: 'Inquiries Only' }, { value: 'application', label: 'Applications Only' }]} />
                <InputField label="Application/Inquiry ID" value={filters.applicationId} field="applicationId" placeholder="e.g., APP-2024-001" />
                <InputField label="Student Name" value={filters.studentName} field="studentName" placeholder="Contains..." />
                <SelectField label="Status" value={filters.status} field="status" options={[{ value: '', label: 'All Status' }, { value: 'new', label: 'New' }, { value: 'submitted', label: 'Submitted' }, { value: 'under review', label: 'Under Review' }, { value: 'approved', label: 'Approved' }, { value: 'rejected', label: 'Rejected' }, { value: 'follow-up', label: 'Follow-up' }]} />
              </div>
            </div>

            {/* Contact Details */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Phone className="w-4 h-4" />Contact Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField label="Parent Mobile" value={filters.parentMobile} field="parentMobile" placeholder="Exact or partial match..." />
                <InputField label="Parent Email" value={filters.parentEmail} field="parentEmail" placeholder="Contains..." />
                <InputField label="City" value={filters.city} field="city" placeholder="e.g., Ahmedabad" />
              </div>
            </div>

            {/* Date Range */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Calendar className="w-4 h-4" />Date Range</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <InputField label="From Date" value={filters.fromDate} field="fromDate" type="date" />
                <InputField label="To Date" value={filters.toDate} field="toDate" type="date" />
                <SelectField label="Academic Year" value={filters.academicYear} field="academicYear" options={[{ value: '', label: 'All Years' }, { value: '2024-25', label: '2024-25' }, { value: '2023-24', label: '2023-24' }, { value: '2022-23', label: '2022-23' }]} />
                <SelectField label="Class Applied" value={filters.classApplied} field="classApplied" options={classOptions} />
              </div>
            </div>

            {/* Advanced Filters Toggle */}
            <button onClick={() => setShowAdvancedFilters(!showAdvancedFilters)} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
              <Sliders className="w-4 h-4" />{showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
              {showAdvancedFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {/* Advanced Filters */}
            {showAdvancedFilters &&
            <div className="space-y-6 pt-4 border-t">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><User className="w-4 h-4" />Category & Demographics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <SelectField label="Category" value={filters.category} field="category" options={[{ value: '', label: 'All Categories' }, { value: 'general', label: 'General' }, { value: 'obc', label: 'OBC' }, { value: 'sc', label: 'SC' }, { value: 'st', label: 'ST' }, { value: 'ews', label: 'EWS' }]} />
                    <SelectField label="Gender" value={filters.gender} field="gender" options={[{ value: '', label: 'All' }, { value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' }]} />
                    <SelectField label="Religion" value={filters.religion} field="religion" options={[{ value: '', label: 'All' }, { value: 'hindu', label: 'Hindu' }, { value: 'muslim', label: 'Muslim' }, { value: 'christian', label: 'Christian' }, { value: 'sikh', label: 'Sikh' }, { value: 'others', label: 'Others' }]} />
                    <SelectField label="Quota" value={filters.quota} field="quota" options={[{ value: '', label: 'All Quotas' }, { value: 'regular', label: 'Regular' }, { value: 'rte', label: 'RTE' }, { value: 'management', label: 'Management' }, { value: 'staff', label: 'Staff Ward' }]} />
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Building className="w-4 h-4" />Source & Referral</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <SelectField label="Inquiry Source" value={filters.inquirySource} field="inquirySource" options={[{ value: '', label: 'All Sources' }, { value: 'website', label: 'Website' }, { value: 'walk-in', label: 'Walk-in' }, { value: 'phone', label: 'Phone' }, { value: 'referral', label: 'Referral' }, { value: 'advertisement', label: 'Advertisement' }, { value: 'school event', label: 'School Event' }, { value: 'social media', label: 'Social Media' }]} />
                    <SelectField label="Referral Type" value={filters.referralType} field="referralType" options={[{ value: '', label: 'All Types' }, { value: 'parent', label: 'Parent Referral' }, { value: 'staff', label: 'Staff Referral' }, { value: 'alumni', label: 'Alumni' }, { value: 'other', label: 'Other' }]} />
                    <SelectField label="State" value={filters.state} field="state" options={[{ value: '', label: 'All States' }, { value: 'gujarat', label: 'Gujarat' }, { value: 'maharashtra', label: 'Maharashtra' }, { value: 'rajasthan', label: 'Rajasthan' }, { value: 'delhi', label: 'Delhi' }]} />
                    <InputField label="Pincode" value={filters.pincode} field="pincode" placeholder="e.g., 380001" />
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><GraduationCap className="w-4 h-4" />Fee & Facilities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <SelectField label="Fee Status" value={filters.feeStatus} field="feeStatus" options={[{ value: '', label: 'All' }, { value: 'paid', label: 'Paid' }, { value: 'pending', label: 'Pending' }, { value: 'partial', label: 'Partial' }, { value: 'refunded', label: 'Refunded' }]} />
                    <SelectField label="Scholarship Applied" value={filters.scholarshipApplied} field="scholarshipApplied" options={[{ value: '', label: 'All' }, { value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} />
                    <SelectField label="Transport Required" value={filters.transportRequired} field="transportRequired" options={[{ value: '', label: 'All' }, { value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} />
                    <SelectField label="Hostel Required" value={filters.hostelRequired} field="hostelRequired" options={[{ value: '', label: 'All' }, { value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} />
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><FileText className="w-4 h-4" />Document & Verification</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <SelectField label="Document Status" value={filters.documentStatus} field="documentStatus" options={[{ value: '', label: 'All' }, { value: 'complete', label: 'Complete' }, { value: 'partial', label: 'Partial' }, { value: 'pending', label: 'Pending' }]} />
                    <SelectField label="Verification Status" value={filters.verificationStatus} field="verificationStatus" options={[{ value: '', label: 'All' }, { value: 'verified', label: 'Verified' }, { value: 'in progress', label: 'In Progress' }, { value: 'pending', label: 'Pending' }]} />
                    <SelectField label="Assigned To" value={filters.assignedTo} field="assignedTo" options={[{ value: '', label: 'All Staff' }, { value: 'mrs. sharma', label: 'Mrs. Sharma' }, { value: 'mr. patel', label: 'Mr. Patel' }, { value: 'ms. gupta', label: 'Ms. Gupta' }]} />
                    <SelectField label="Created By" value={filters.createdBy} field="createdBy" options={[{ value: '', label: 'All' }, { value: 'admin', label: 'Admin' }, { value: 'staff', label: 'Staff' }, { value: 'online', label: 'Online (Self)' }]} />
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Filter className="w-4 h-4" />Sort Results</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <SelectField label="Sort By" value={filters.sortBy} field="sortBy" options={[{ value: 'date', label: 'Date' }, { value: 'name', label: 'Student Name' }, { value: 'status', label: 'Status' }, { value: 'class', label: 'Class' }]} />
                    <SelectField label="Order" value={filters.sortOrder} field="sortOrder" options={[{ value: 'desc', label: 'Newest First' }, { value: 'asc', label: 'Oldest First' }]} />
                  </div>
                </div>
              </div>
            }

            {/* Search Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                {activeFilterCount > 0 && <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">{activeFilterCount} filter(s) applied</span>}
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={resetFilters}><X className="w-4 h-4 mr-2" />Clear All</Button>
                <Button variant="outline" onClick={() => setShowSaveSearchModal(true)}><Save className="w-4 h-4 mr-2" />Save Search</Button>
                <Button variant="primary" onClick={handleSearch} disabled={isLoading}>
                  {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}Search
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Search Results */}
        {hasSearched &&
        <div className="space-y-6">
            {/* Overall Summary Card */}
            <Card className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Search Results Summary</h2>
                  <p className="text-sm text-gray-500">Found {filteredResults.length} record(s) across {Object.keys(groupedResults).length} branch(es)</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Button variant="outline" size="sm" onClick={() => setShowColumnSelector(!showColumnSelector)}>
                      <Sliders className="w-4 h-4 mr-2" />Columns<ChevronDown className="w-4 h-4 ml-1" />
                    </Button>
                    {showColumnSelector &&
                  <div className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20 max-h-64 overflow-y-auto">
                        {allColumns.map((col) =>
                    <label key={col.key} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer">
                            <input type="checkbox" checked={selectedColumns.includes(col.key)} onChange={(e) => setSelectedColumns(e.target.checked ? [...selectedColumns, col.key] : selectedColumns.filter((c) => c !== col.key))} className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                            <span className="text-sm text-gray-700">{col.label}</span>
                          </label>
                    )}
                      </div>
                  }
                  </div>
                  <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Export CSV</Button>
                  <Button variant="outline" size="sm"><FileText className="w-4 h-4 mr-2" />Export PDF</Button>
                </div>
              </div>

              {/* Branch Overview Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {Object.entries(branchStats).map(([branch, stats]) =>
              <div key={branch} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-2 h-2 rounded-full ${getBranchColor(branch)}`}></span>
                      <span className="text-xs font-medium text-gray-600 truncate">{getBranchLabel(branch).split(' - ')[0]}</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        {stats.applications} Apps
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                        {stats.inquiries} Inq
                      </span>
                    </div>
                  </div>
              )}
              </div>
            </Card>

            {/* Branch-wise Results */}
            {Object.keys(groupedResults).length > 0 ?
          Object.entries(groupedResults).map(([branch, results]) =>
          <Card key={branch} className="overflow-hidden">
                  {/* Branch Header */}
                  <div
              className="p-4 bg-gradient-to-r from-gray-50 to-white border-b cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleBranchCollapse(branch)}>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${getBranchColor(branch)}`}></div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{getBranchLabel(branch)}</h3>
                          <p className="text-sm text-gray-500">{results.length} record(s) found</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {/* Quick stats for branch */}
                        <div className="hidden md:flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-gray-600">
                              {results.filter((r) => r.status === 'Approved').length} Approved
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <AlertCircle className="w-4 h-4 text-yellow-500" />
                            <span className="text-gray-600">
                              {results.filter((r) => r.status === 'Submitted' || r.status === 'Under Review').length} Pending
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-blue-500" />
                            <span className="text-gray-600">
                              {results.filter((r) => r.type === 'Inquiry').length} Inquiries
                            </span>
                          </div>
                        </div>
                        {collapsedBranches.includes(branch) ?
                  <ChevronDown className="w-5 h-5 text-gray-400" /> :

                  <ChevronUp className="w-5 h-5 text-gray-400" />
                  }
                      </div>
                    </div>
                  </div>

                  {/* Branch Table */}
                  {!collapsedBranches.includes(branch) &&
            <div className="overflow-x-auto">
                      <Table columns={columns} data={results} />
                    </div>
            }
                </Card>
          ) :

          <Card className="p-8">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your search filters or selecting different branches</p>
                  <Button variant="outline" onClick={resetFilters}>Clear all filters</Button>
                </div>
              </Card>
          }
          </div>
        }

        {/* Save Search Modal */}
        <Modal isOpen={showSaveSearchModal} onClose={() => setShowSaveSearchModal(false)} title="Save Search" size="sm">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Name</label>
              <input type="text" placeholder="e.g., Pending Class 5 Applications" value={savedSearchName} onChange={(e) => setSavedSearchName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Current Filters:</p>
              <div className="flex flex-wrap gap-1">
                {selectedBranches.length > 0 &&
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {selectedBranches.length} Branch(es)
                  </span>
                }
                {filters.batch &&
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                    {getBatchLabel(filters.batch)}
                  </span>
                }
                {activeFilterCount > 0 &&
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                    +{activeFilterCount} other filters
                  </span>
                }
              </div>
            </div>
            <p className="text-sm text-gray-500">This will save your current filter settings for quick access later.</p>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowSaveSearchModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => {setShowSaveSearchModal(false);setSavedSearchName('');}}><Save className="w-4 h-4 mr-2" />Save Search</Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>);

}