import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent } from
'../../../components/ui/Tabs';
import { DownloadIcon, PlusIcon, PlayIcon, ClockIcon } from 'lucide-react';
export function CustomReportBuilderMis() {
  const [tab, setTab] = useState('builder');
  const [selectedFields, setSelectedFields] = useState<string[]>([
  'Student Name',
  'Class',
  'Attendance %']
  );
  const availableFields = [
  'Student Name',
  'Roll No.',
  'Class',
  'Section',
  'Attendance %',
  'Total Marks',
  'Pass/Fail',
  'Fee Status',
  'Parent Name',
  'Contact No.',
  'Address',
  'Blood Group',
  'Category'];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Custom Report Builder
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Build dynamic reports with custom filters, export and scheduling
          </p>
        </div>
        <Button variant="primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          New Report
        </Button>
      </div>

      <Card noPadding>
        <Tabs defaultValue="builder" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="builder">Report Builder</TabsTrigger>
            <TabsTrigger value="filters">Dynamic Filters</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <Card title="Report Settings">
                  <div className="space-y-3">
                    <Input
                      label="Report Name"
                      placeholder="Enter report name" />

                    <Select
                      label="Report Type"
                      options={[
                      {
                        value: 'student',
                        label: 'Student Report'
                      },
                      {
                        value: 'attendance',
                        label: 'Attendance Report'
                      },
                      {
                        value: 'fee',
                        label: 'Fee Report'
                      },
                      {
                        value: 'academic',
                        label: 'Academic Report'
                      },
                      {
                        value: 'staff',
                        label: 'Staff Report'
                      }]
                      } />

                    <Select
                      label="Group By"
                      options={[
                      {
                        value: 'class',
                        label: 'Class'
                      },
                      {
                        value: 'section',
                        label: 'Section'
                      },
                      {
                        value: 'category',
                        label: 'Category'
                      },
                      {
                        value: 'none',
                        label: 'No Grouping'
                      }]
                      } />

                    <Select
                      label="Sort By"
                      options={[
                      {
                        value: 'name',
                        label: 'Name (A-Z)'
                      },
                      {
                        value: 'rollno',
                        label: 'Roll No.'
                      },
                      {
                        value: 'marks',
                        label: 'Marks (High-Low)'
                      },
                      {
                        value: 'attendance',
                        label: 'Attendance'
                      }]
                      } />

                  </div>
                </Card>
                <Card title="Available Fields">
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {availableFields.map((field, i) =>
                    <div
                      key={i}
                      className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded cursor-pointer"
                      onClick={() =>
                      !selectedFields.includes(field) &&
                      setSelectedFields([...selectedFields, field])
                      }>

                        <input
                        type="checkbox"
                        checked={selectedFields.includes(field)}
                        readOnly
                        className="h-3.5 w-3.5 text-blue-600" />

                        <span className="text-xs text-gray-700">{field}</span>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
              <div className="md:col-span-2 space-y-4">
                <Card title="Selected Columns">
                  <div className="flex flex-wrap gap-2 min-h-12">
                    {selectedFields.map((field, i) =>
                    <span
                      key={i}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">

                        {field}
                        <button
                        onClick={() =>
                        setSelectedFields(
                          selectedFields.filter((f) => f !== field)
                        )
                        }
                        className="text-blue-400 hover:text-blue-700 ml-1">

                          ×
                        </button>
                      </span>
                    )}
                  </div>
                </Card>
                <Card title="Preview">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-50">
                        <tr>
                          {selectedFields.map((f) =>
                          <th
                            key={f}
                            className="px-3 py-2 text-left font-semibold text-gray-500">

                              {f}
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {[
                        ['Arjun Sharma', 'Class 8-A', '94%'],
                        ['Priya Patel', 'Class 9-B', '88%'],
                        ['Rohan Mehta', 'Class 7-A', '91%']].
                        map((row, i) =>
                        <tr key={i}>
                            {selectedFields.map((f, fi) =>
                          <td key={fi} className="px-3 py-2 text-gray-600">
                                {row[fi] || '—'}
                              </td>
                          )}
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <PlayIcon className="w-4 h-4 mr-2" />
                    Preview Report
                  </Button>
                  <Button variant="primary" className="flex-1">
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="filters" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Apply Filters">
                <div className="space-y-3">
                  <Select
                    label="Class"
                    options={[
                    {
                      value: 'all',
                      label: 'All Classes'
                    },
                    {
                      value: '6',
                      label: 'Class 6'
                    },
                    {
                      value: '7',
                      label: 'Class 7'
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
                    }]
                    } />

                  <Select
                    label="Section"
                    options={[
                    {
                      value: 'all',
                      label: 'All Sections'
                    },
                    {
                      value: 'a',
                      label: 'Section A'
                    },
                    {
                      value: 'b',
                      label: 'Section B'
                    },
                    {
                      value: 'c',
                      label: 'Section C'
                    }]
                    } />

                  <Select
                    label="Category"
                    options={[
                    {
                      value: 'all',
                      label: 'All Categories'
                    },
                    {
                      value: 'general',
                      label: 'General'
                    },
                    {
                      value: 'sc',
                      label: 'SC'
                    },
                    {
                      value: 'st',
                      label: 'ST'
                    },
                    {
                      value: 'obc',
                      label: 'OBC'
                    },
                    {
                      value: 'ews',
                      label: 'EWS'
                    }]
                    } />

                  <Select
                    label="Gender"
                    options={[
                    {
                      value: 'all',
                      label: 'All'
                    },
                    {
                      value: 'male',
                      label: 'Male'
                    },
                    {
                      value: 'female',
                      label: 'Female'
                    }]
                    } />

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Attendance From (%)"
                      type="number"
                      placeholder="0" />

                    <Input
                      label="Attendance To (%)"
                      type="number"
                      placeholder="100" />

                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Date From" type="date" />
                    <Input label="Date To" type="date" />
                  </div>
                  <Button variant="primary" className="w-full">
                    Apply Filters
                  </Button>
                </div>
              </Card>
              <Card title="Saved Filter Sets">
                <div className="space-y-2">
                  {[
                  {
                    name: 'Class 10 - All Students',
                    filters: 'Class 10, All sections'
                  },
                  {
                    name: 'Low Attendance Report',
                    filters: 'Attendance < 75%'
                  },
                  {
                    name: 'EWS Students',
                    filters: 'Category: EWS'
                  },
                  {
                    name: 'Fee Defaulters',
                    filters: 'Fee Status: Overdue'
                  }].
                  map((fs, i) =>
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">

                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {fs.name}
                        </p>
                        <p className="text-xs text-gray-400">{fs.filters}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" className="text-xs h-7 px-2">
                          Apply
                        </Button>
                        <Button
                        variant="ghost"
                        className="text-xs h-7 px-2 text-red-500">

                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                  <Button variant="outline" className="w-full text-xs h-8">
                    Save Current Filters
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="export" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Export Options">
                <div className="space-y-4">
                  <Select
                    label="Select Report"
                    options={[
                    {
                      value: 'student',
                      label: 'Student Master Report'
                    },
                    {
                      value: 'attendance',
                      label: 'Attendance Report'
                    },
                    {
                      value: 'fee',
                      label: 'Fee Collection Report'
                    },
                    {
                      value: 'academic',
                      label: 'Academic Performance Report'
                    }]
                    } />

                  <Select
                    label="Export Format"
                    options={[
                    {
                      value: 'excel',
                      label: 'Excel (.xlsx)'
                    },
                    {
                      value: 'pdf',
                      label: 'PDF'
                    },
                    {
                      value: 'csv',
                      label: 'CSV'
                    },
                    {
                      value: 'json',
                      label: 'JSON'
                    }]
                    } />

                  <Select
                    label="Date Range"
                    options={[
                    {
                      value: 'today',
                      label: 'Today'
                    },
                    {
                      value: 'week',
                      label: 'This Week'
                    },
                    {
                      value: 'month',
                      label: 'This Month'
                    },
                    {
                      value: 'term',
                      label: 'This Term'
                    },
                    {
                      value: 'year',
                      label: 'This Year'
                    },
                    {
                      value: 'custom',
                      label: 'Custom Range'
                    }]
                    } />

                  <div className="grid grid-cols-2 gap-3">
                    <Input label="From Date" type="date" />
                    <Input label="To Date" type="date" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      Include Charts/Graphs
                    </span>
                    <button className="relative w-9 h-5 rounded-full bg-blue-500">
                      <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow translate-x-4" />
                    </button>
                  </div>
                  <Button variant="primary" className="w-full">
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </Card>
              <Card title="Recent Exports">
                <div className="space-y-2">
                  {[
                  {
                    name: 'Student Master Report',
                    format: 'Excel',
                    date: '2025-06-10',
                    size: '2.4 MB'
                  },
                  {
                    name: 'Fee Collection - May',
                    format: 'PDF',
                    date: '2025-06-08',
                    size: '1.1 MB'
                  },
                  {
                    name: 'Attendance Report',
                    format: 'CSV',
                    date: '2025-06-05',
                    size: '0.8 MB'
                  }].
                  map((exp, i) =>
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">

                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {exp.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {exp.format} • {exp.date} • {exp.size}
                        </p>
                      </div>
                      <Button variant="ghost" className="text-xs h-7 px-2">
                        <DownloadIcon className="w-3 h-3 mr-1" />
                        Re-download
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="scheduled" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Schedule a Report">
                <div className="space-y-3">
                  <Select
                    label="Report"
                    options={[
                    {
                      value: 'student',
                      label: 'Student Report'
                    },
                    {
                      value: 'attendance',
                      label: 'Attendance Report'
                    },
                    {
                      value: 'fee',
                      label: 'Fee Report'
                    }]
                    } />

                  <Select
                    label="Frequency"
                    options={[
                    {
                      value: 'daily',
                      label: 'Daily'
                    },
                    {
                      value: 'weekly',
                      label: 'Weekly'
                    },
                    {
                      value: 'monthly',
                      label: 'Monthly'
                    },
                    {
                      value: 'term',
                      label: 'End of Term'
                    }]
                    } />

                  <Input
                    label="Send To (Email)"
                    placeholder="admin@school.edu"
                    type="email" />

                  <Select
                    label="Format"
                    options={[
                    {
                      value: 'excel',
                      label: 'Excel'
                    },
                    {
                      value: 'pdf',
                      label: 'PDF'
                    }]
                    } />

                  <Input label="Start Date" type="date" />
                  <Button variant="primary" className="w-full">
                    <ClockIcon className="w-4 h-4 mr-2" />
                    Schedule Report
                  </Button>
                </div>
              </Card>
              <Card title="Scheduled Reports">
                <div className="space-y-2">
                  {[
                  {
                    name: 'Daily Attendance',
                    freq: 'Daily',
                    nextRun: 'Tomorrow 08:00',
                    status: 'Active'
                  },
                  {
                    name: 'Weekly Fee Summary',
                    freq: 'Weekly',
                    nextRun: 'Mon 09:00',
                    status: 'Active'
                  },
                  {
                    name: 'Monthly Academic Report',
                    freq: 'Monthly',
                    nextRun: '01 Jul 2025',
                    status: 'Active'
                  }].
                  map((sr, i) =>
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">

                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {sr.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {sr.freq} • Next: {sr.nextRun}
                        </p>
                      </div>
                      <span className="text-xs text-green-600 font-medium">
                        {sr.status}
                      </span>
                      <Button
                      variant="ghost"
                      className="text-xs h-7 px-2 text-red-500">

                        Stop
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}