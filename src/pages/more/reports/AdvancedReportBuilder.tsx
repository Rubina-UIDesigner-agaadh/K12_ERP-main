import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Table } from '../../../components/ui/Table';
import {
  DownloadIcon,
  SaveIcon,
  PlusIcon,
  XIcon,
  FileTextIcon,
  DatabaseIcon,
  FilterIcon,
  EyeIcon,
  RefreshCwIcon,
  PrinterIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  SettingsIcon,
  PlayIcon } from
'lucide-react';
type DataSource = 'students' | 'employees' | 'finance' | 'attendance' | 'exams';
const dataSources: {
  id: DataSource;
  label: string;
  color: string;
  bg: string;
}[] = [
{
  id: 'students',
  label: 'Students',
  color: 'text-blue-700',
  bg: 'bg-blue-50 border-blue-200'
},
{
  id: 'employees',
  label: 'Employees',
  color: 'text-green-700',
  bg: 'bg-green-50 border-green-200'
},
{
  id: 'finance',
  label: 'Finance',
  color: 'text-purple-700',
  bg: 'bg-purple-50 border-purple-200'
},
{
  id: 'attendance',
  label: 'Attendance',
  color: 'text-orange-700',
  bg: 'bg-orange-50 border-orange-200'
},
{
  id: 'exams',
  label: 'Exams',
  color: 'text-red-700',
  bg: 'bg-red-50 border-red-200'
}];

const fieldsBySource: Record<
  DataSource,
  {
    group: string;
    fields: {
      id: string;
      label: string;
    }[];
  }[]> =
{
  students: [
  {
    group: 'Basic Info',
    fields: [
    {
      id: 'admission_no',
      label: 'Admission No'
    },
    {
      id: 'name',
      label: 'Student Name'
    },
    {
      id: 'dob',
      label: 'Date of Birth'
    },
    {
      id: 'gender',
      label: 'Gender'
    }]

  },
  {
    group: 'Academic',
    fields: [
    {
      id: 'class',
      label: 'Class'
    },
    {
      id: 'section',
      label: 'Section'
    },
    {
      id: 'roll_no',
      label: 'Roll No'
    },
    {
      id: 'academic_year',
      label: 'Academic Year'
    }]

  },
  {
    group: 'Category',
    fields: [
    {
      id: 'category',
      label: 'Category (Gen/OBC/SC/ST)'
    },
    {
      id: 'rte',
      label: 'RTE Admitted'
    },
    {
      id: 'ews',
      label: 'EWS'
    },
    {
      id: 'religion',
      label: 'Religion'
    },
    {
      id: 'minority',
      label: 'Minority'
    }]

  },
  {
    group: 'Contact',
    fields: [
    {
      id: 'phone',
      label: 'Phone'
    },
    {
      id: 'email',
      label: 'Email'
    },
    {
      id: 'address',
      label: 'Address'
    },
    {
      id: 'parent_name',
      label: 'Parent Name'
    }]

  }],

  employees: [
  {
    group: 'Basic Info',
    fields: [
    {
      id: 'emp_id',
      label: 'Employee ID'
    },
    {
      id: 'name',
      label: 'Name'
    },
    {
      id: 'designation',
      label: 'Designation'
    },
    {
      id: 'department',
      label: 'Department'
    }]

  },
  {
    group: 'Service',
    fields: [
    {
      id: 'joining_date',
      label: 'Joining Date'
    },
    {
      id: 'experience',
      label: 'Experience'
    },
    {
      id: 'qualification',
      label: 'Qualification'
    },
    {
      id: 'salary',
      label: 'Salary Grade'
    }]

  },
  {
    group: 'Contact',
    fields: [
    {
      id: 'emp_phone',
      label: 'Phone'
    },
    {
      id: 'emp_email',
      label: 'Email'
    }]

  }],

  finance: [
  {
    group: 'Fee',
    fields: [
    {
      id: 'fee_head',
      label: 'Fee Head'
    },
    {
      id: 'amount',
      label: 'Amount'
    },
    {
      id: 'paid_date',
      label: 'Paid Date'
    },
    {
      id: 'status',
      label: 'Payment Status'
    }]

  },
  {
    group: 'Scholarship',
    fields: [
    {
      id: 'scholarship_type',
      label: 'Scholarship Type'
    },
    {
      id: 'scholarship_amount',
      label: 'Scholarship Amount'
    }]

  },
  {
    group: 'Charges',
    fields: [
    {
      id: 'charge_head',
      label: 'Charge Head'
    },
    {
      id: 'charge_amount',
      label: 'Charge Amount'
    },
    {
      id: 'charge_status',
      label: 'Charge Status'
    }]

  }],

  attendance: [
  {
    group: 'Daily',
    fields: [
    {
      id: 'att_date',
      label: 'Date'
    },
    {
      id: 'att_status',
      label: 'Status'
    },
    {
      id: 'arrival_time',
      label: 'Arrival Time'
    }]

  },
  {
    group: 'Summary',
    fields: [
    {
      id: 'total_days',
      label: 'Total Days'
    },
    {
      id: 'present_days',
      label: 'Present Days'
    },
    {
      id: 'absent_days',
      label: 'Absent Days'
    },
    {
      id: 'att_percentage',
      label: 'Attendance %'
    }]

  }],

  exams: [
  {
    group: 'Exam Info',
    fields: [
    {
      id: 'exam_name',
      label: 'Exam Name'
    },
    {
      id: 'exam_date',
      label: 'Exam Date'
    },
    {
      id: 'subject',
      label: 'Subject'
    },
    {
      id: 'max_marks',
      label: 'Max Marks'
    }]

  },
  {
    group: 'Results',
    fields: [
    {
      id: 'marks_obtained',
      label: 'Marks Obtained'
    },
    {
      id: 'grade',
      label: 'Grade'
    },
    {
      id: 'rank',
      label: 'Rank'
    },
    {
      id: 'result_status',
      label: 'Pass/Fail'
    }]

  }]

};
const operators = [
'equals',
'not equals',
'contains',
'greater than',
'less than',
'between',
'is empty',
'is not empty'];

const branchOptions = [
{
  value: 'all',
  label: 'All Branches'
},
{
  value: 'main',
  label: 'Main Campus'
},
{
  value: 'north',
  label: 'North Branch'
},
{
  value: 'south',
  label: 'South Branch'
},
{
  value: 'east',
  label: 'East Branch'
}];

const batchYearOptions = [
{
  value: '2025-26',
  label: '2025-26'
},
{
  value: '2024-25',
  label: '2024-25'
},
{
  value: '2023-24',
  label: '2023-24'
}];

interface FilterRow {
  id: number;
  field: string;
  operator: string;
  value: string;
}
const previewData = [
{
  id: 1,
  admission_no: 'ADM-001',
  name: 'Aarav Sharma',
  class: 'Class 8-A',
  gender: 'Male',
  category: 'General',
  att_percentage: '94.2%',
  marks_obtained: '87/100'
},
{
  id: 2,
  admission_no: 'ADM-002',
  name: 'Priya Patel',
  class: 'Class 8-A',
  gender: 'Female',
  category: 'OBC',
  att_percentage: '88.6%',
  marks_obtained: '79/100'
},
{
  id: 3,
  admission_no: 'ADM-003',
  name: 'Rohan Mehta',
  class: 'Class 8-B',
  gender: 'Male',
  category: 'SC',
  att_percentage: '76.4%',
  marks_obtained: '65/100'
},
{
  id: 4,
  admission_no: 'ADM-004',
  name: 'Sneha Joshi',
  class: 'Class 8-A',
  gender: 'Female',
  category: 'General',
  att_percentage: '100%',
  marks_obtained: '96/100'
},
{
  id: 5,
  admission_no: 'ADM-005',
  name: 'Karan Verma',
  class: 'Class 8-B',
  gender: 'Male',
  category: 'EWS',
  att_percentage: '91.8%',
  marks_obtained: '72/100'
}];

export function AdvancedReportBuilder() {
  const [selectedSource, setSelectedSource] = useState<DataSource>('students');
  const [selectedFields, setSelectedFields] = useState<Set<string>>(
    new Set(['admission_no', 'name', 'class', 'gender', 'category'])
  );
  const [filters, setFilters] = useState<FilterRow[]>([
  {
    id: 1,
    field: '',
    operator: 'equals',
    value: ''
  }]
  );
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [batchYear, setBatchYear] = useState('2025-26');
  const [showPreview, setShowPreview] = useState(false);
  const [reportName, setReportName] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(['Basic Info', 'Academic'])
  );
  const toggleField = (fieldId: string) => {
    setSelectedFields((prev) => {
      const n = new Set(prev);
      n.has(fieldId) ? n.delete(fieldId) : n.add(fieldId);
      return n;
    });
  };
  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => {
      const n = new Set(prev);
      n.has(group) ? n.delete(group) : n.add(group);
      return n;
    });
  };
  const addFilter = () => {
    setFilters((prev) => [
    ...prev,
    {
      id: Date.now(),
      field: '',
      operator: 'equals',
      value: ''
    }]
    );
  };
  const removeFilter = (id: number) => {
    setFilters((prev) => prev.filter((f) => f.id !== id));
  };
  const updateFilter = (id: number, key: keyof FilterRow, value: string) => {
    setFilters((prev) =>
    prev.map((f) =>
    f.id === id ?
    {
      ...f,
      [key]: value
    } :
    f
    )
    );
  };
  const currentFields = fieldsBySource[selectedSource];
  const allFieldOptions = currentFields.flatMap((g) =>
  g.fields.map((f) => ({
    value: f.id,
    label: f.label
  }))
  );
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Advanced Report Builder
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Build custom reports by selecting data sources, fields and filters
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<SaveIcon className="w-4 h-4" />}>

            Save Template
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<PrinterIcon className="w-4 h-4" />}>

            Print
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<DownloadIcon className="w-4 h-4" />}>

            Export Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<DownloadIcon className="w-4 h-4" />}>

            Export CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<DownloadIcon className="w-4 h-4" />}>

            Export PDF
          </Button>
        </div>
      </div>

      {/* Branch + Year Filters */}
      <Card>
        <div className="flex flex-wrap gap-4 items-end">
          <Select
            label="Branch"
            options={branchOptions}
            value={selectedBranch}
            onChange={setSelectedBranch}
            className="w-44" />

          <Select
            label="Academic Year"
            options={batchYearOptions}
            value={batchYear}
            onChange={setBatchYear}
            className="w-36" />

          <Input
            label="Report Name"
            placeholder="e.g. Class 8 RTE Performance Report"
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            className="w-72" />

        </div>
      </Card>

      {/* Three-panel builder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Panel: Data Source */}
        <div className="lg:col-span-2">
          <Card title="Data Source">
            <div className="space-y-2">
              {dataSources.map((ds) =>
              <button
                key={ds.id}
                onClick={() => {
                  setSelectedSource(ds.id);
                  setSelectedFields(new Set());
                }}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors text-left ${selectedSource === ds.id ? `${ds.bg} ${ds.color} border-current` : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>

                  <DatabaseIcon className="w-3.5 h-3.5 flex-shrink-0" />
                  {ds.label}
                </button>
              )}
            </div>
          </Card>
        </div>

        {/* Middle Panel: Field Selector */}
        <div className="lg:col-span-4">
          <Card
            title={`Fields — ${dataSources.find((d) => d.id === selectedSource)?.label}`}
            headerAction={
            <div className="flex gap-1">
                <Button
                variant="ghost"
                size="xs"
                onClick={() =>
                setSelectedFields(
                  new Set(
                    currentFields.flatMap((g) => g.fields.map((f) => f.id))
                  )
                )
                }>

                  All
                </Button>
                <Button
                variant="ghost"
                size="xs"
                onClick={() => setSelectedFields(new Set())}>

                  None
                </Button>
              </div>
            }>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {currentFields.map((group) =>
              <div key={group.group}>
                  <button
                  onClick={() => toggleGroup(group.group)}
                  className="flex items-center gap-2 w-full text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 hover:text-gray-700">

                    {expandedGroups.has(group.group) ?
                  <ChevronDownIcon className="w-3 h-3" /> :

                  <ChevronRightIcon className="w-3 h-3" />
                  }
                    {group.group}
                  </button>
                  {expandedGroups.has(group.group) &&
                <div className="space-y-1 ml-4">
                      {group.fields.map((field) =>
                  <label
                    key={field.id}
                    className="flex items-center gap-2 cursor-pointer py-1 px-2 rounded hover:bg-gray-50">

                          <input
                      type="checkbox"
                      checked={selectedFields.has(field.id)}
                      onChange={() => toggleField(field.id)}
                      className="h-3.5 w-3.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />

                          <span className="text-sm text-gray-700">
                            {field.label}
                          </span>
                        </label>
                  )}
                    </div>
                }
                </div>
              )}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                {selectedFields.size} field
                {selectedFields.size !== 1 ? 's' : ''} selected
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {Array.from(selectedFields).map((fid) => {
                  const field = currentFields.
                  flatMap((g) => g.fields).
                  find((f) => f.id === fid);
                  return field ?
                  <span
                    key={fid}
                    className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">

                      {field.label}
                      <button onClick={() => toggleField(fid)}>
                        <XIcon className="w-2.5 h-2.5" />
                      </button>
                    </span> :
                  null;
                })}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Panel: Filter Builder */}
        <div className="lg:col-span-6">
          <Card
            title="Filter Conditions"
            headerAction={
            <Button
              variant="outline"
              size="xs"
              leftIcon={<PlusIcon className="w-3 h-3" />}
              onClick={addFilter}>

                Add Filter
              </Button>
            }>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {filters.map((filter, idx) =>
              <div key={filter.id} className="flex items-center gap-2">
                  {idx > 0 &&
                <span className="text-xs font-semibold text-blue-600 w-8 flex-shrink-0">
                      AND
                    </span>
                }
                  {idx === 0 &&
                <span className="text-xs text-gray-400 w-8 flex-shrink-0">
                      IF
                    </span>
                }
                  <Select
                  options={[
                  {
                    value: '',
                    label: 'Select field'
                  },
                  ...allFieldOptions]
                  }
                  value={filter.field}
                  onChange={(v) => updateFilter(filter.id, 'field', v)}
                  className="flex-1 min-w-0" />

                  <Select
                  options={operators.map((op) => ({
                    value: op,
                    label: op
                  }))}
                  value={filter.operator}
                  onChange={(v) => updateFilter(filter.id, 'operator', v)}
                  className="w-36 flex-shrink-0" />

                  <Input
                  placeholder="Value"
                  value={filter.value}
                  onChange={(e) =>
                  updateFilter(filter.id, 'value', e.target.value)
                  }
                  className="w-32 flex-shrink-0" />

                  <button
                  onClick={() => removeFilter(filter.id)}
                  className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">

                    <XIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              {filters.length === 0 &&
              <p className="text-sm text-gray-400 text-center py-4">
                  No filters added. Click "Add Filter" to start.
                </p>
              }
            </div>

            {/* Sort & Group */}
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
              <Select
                label="Sort By"
                options={[
                {
                  value: 'name',
                  label: 'Name'
                },
                {
                  value: 'class',
                  label: 'Class'
                },
                {
                  value: 'admission_no',
                  label: 'Admission No'
                },
                {
                  value: 'category',
                  label: 'Category'
                }]
                } />

              <Select
                label="Group By"
                options={[
                {
                  value: 'none',
                  label: 'None'
                },
                {
                  value: 'class',
                  label: 'Class'
                },
                {
                  value: 'category',
                  label: 'Category'
                },
                {
                  value: 'branch',
                  label: 'Branch'
                }]
                } />

            </div>

            <div className="mt-4 flex gap-2">
              <Button
                variant="primary"
                className="flex-1"
                leftIcon={<PlayIcon className="w-4 h-4" />}
                onClick={() => setShowPreview(true)}>

                Run Report
              </Button>
              <Button
                variant="outline"
                leftIcon={<RefreshCwIcon className="w-4 h-4" />}
                onClick={() => {
                  setFilters([
                  {
                    id: 1,
                    field: '',
                    operator: 'equals',
                    value: ''
                  }]
                  );
                  setSelectedFields(new Set());
                }}>

                Reset
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Preview Table */}
      {showPreview &&
      <Card
        title="Report Preview"
        headerAction={
        <div className="flex gap-2">
              <Badge variant="info">{previewData.length} rows (sample)</Badge>
              <Button
            variant="outline"
            size="sm"
            leftIcon={<DownloadIcon className="w-4 h-4" />}>

                Export Full Report
              </Button>
            </div>
        }>

          <div className="mb-3 flex flex-wrap gap-2 items-center">
            <p className="text-xs text-gray-500">
              Showing preview with selected fields:
            </p>
            {Array.from(selectedFields).map((fid) => {
            const field = fieldsBySource[selectedSource].
            flatMap((g) => g.fields).
            find((f) => f.id === fid);
            return field ?
            <Badge key={fid} variant="primary">
                  {field.label}
                </Badge> :
            null;
          })}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {Array.from(selectedFields).map((fid) => {
                  const field = fieldsBySource[selectedSource].
                  flatMap((g) => g.fields).
                  find((f) => f.id === fid);
                  return field ?
                  <th
                    key={fid}
                    className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">

                        {field.label}
                      </th> :
                  null;
                })}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {previewData.map((row) =>
              <tr key={row.id} className="hover:bg-gray-50">
                    {Array.from(selectedFields).map((fid) =>
                <td key={fid} className="px-4 py-2.5 text-gray-700">
                        {(row as any)[fid] || '—'}
                      </td>
                )}
                  </tr>
              )}
              </tbody>
            </table>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Showing 5 of 1,248 records (preview only)
            </p>
            <div className="flex gap-2">
              <Button
              variant="outline"
              size="sm"
              leftIcon={<DownloadIcon className="w-4 h-4" />}>

                Export PDF
              </Button>
              <Button
              variant="outline"
              size="sm"
              leftIcon={<DownloadIcon className="w-4 h-4" />}>

                Export Excel
              </Button>
              <Button
              variant="outline"
              size="sm"
              leftIcon={<DownloadIcon className="w-4 h-4" />}>

                Export CSV
              </Button>
            </div>
          </div>
        </Card>
      }
    </div>);

}