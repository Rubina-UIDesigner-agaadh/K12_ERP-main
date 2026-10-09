import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Settings,
  RefreshCw,
  ListOrdered,
  Users,
  Info } from
'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
// --- Mock Data ---
const PREVIEW_DATA = [
{
  name: 'Aarav Patel',
  gender: 'Male',
  oldRoll: '-',
  newRoll: '10A01'
},
{
  name: 'Aditi Sharma',
  gender: 'Female',
  oldRoll: '-',
  newRoll: '10A02'
},
{
  name: 'Arjun Singh',
  gender: 'Male',
  oldRoll: '-',
  newRoll: '10A03'
},
{
  name: 'Diya Gupta',
  gender: 'Female',
  oldRoll: '-',
  newRoll: '10A04'
},
{
  name: 'Rohan Kumar',
  gender: 'Male',
  oldRoll: '-',
  newRoll: '10A05'
}];

export function RollNoLogic() {
  const navigate = useNavigate();
  // State for configuration
  const [config, setConfig] = useState({
    sortOrder: 'name_asc',
    numberFormat: 'prefixed',
    startNumber: 1,
    minDigits: 2,
    prefix: '{Class}{Section}',
    appendNew: true,
    fillVacant: false,
    separateGender: false
  });
  const [previewData, setPreviewData] = useState(PREVIEW_DATA);
  const [selectedTestClass, setSelectedTestClass] = useState('10-A');
  // Handler for config changes
  const handleConfigChange = (key: string, value: any) => {
    setConfig((prev) => ({
      ...prev,
      [key]: value
    }));
  };
  // Mock generation logic
  const handleGeneratePreview = () => {
    // In a real app, this would call backend logic based on 'config' and 'selectedTestClass'
    // Here we just shuffle or refresh the mock data to simulate change
    const newPreview = [...previewData].sort(() => Math.random() - 0.5);
    setPreviewData(newPreview);
  };
  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      {/* Header (Fixed) */}
      <div className="p-6 bg-white border-b sticky top-0 z-20 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ListOrdered className="w-6 h-6 text-blue-600" />
              Roll Number Generation Logic
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Configure sorting, formatting, and assignment rules for student
              roll numbers.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Reset to Default</Button>
          <Button>Save Logic</Button>
        </div>
      </div>

      {/* Main Content (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Configuration Card */}
            <Card
              title="Configuration"
              icon={<Settings className="w-5 h-5 text-gray-500" />}>

              <div className="space-y-6">
                {/* Basic Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select
                    label="Sort Order"
                    options={[
                    {
                      value: 'name_asc',
                      label: 'Alphabetical (First Name)'
                    },
                    {
                      value: 'lastname_asc',
                      label: 'Alphabetical (Last Name)'
                    },
                    {
                      value: 'admission_date',
                      label: 'Admission Date'
                    },
                    {
                      value: 'gender_name',
                      label: 'Gender then Name'
                    }]
                    }
                    value={config.sortOrder}
                    onChange={(val) => handleConfigChange('sortOrder', val)}
                    helperText="Determines the sequence of students before numbering." />

                  <Select
                    label="Number Format"
                    options={[
                    {
                      value: 'numeric',
                      label: 'Numeric (1, 2, 3...)'
                    },
                    {
                      value: 'prefixed',
                      label: 'Prefixed (e.g. 10A01)'
                    }]
                    }
                    value={config.numberFormat}
                    onChange={(val) => handleConfigChange('numberFormat', val)} />

                </div>

                {/* Formatting Settings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input
                    label="Start Number"
                    type="number"
                    value={config.startNumber}
                    onChange={(e) =>
                    handleConfigChange(
                      'startNumber',
                      parseInt(e.target.value)
                    )
                    } />

                  <Input
                    label="Minimum Digits"
                    type="number"
                    value={config.minDigits}
                    onChange={(e) =>
                    handleConfigChange('minDigits', parseInt(e.target.value))
                    }
                    placeholder="e.g. 2 for '01'"
                    helperText="Numbers are zero-padded to this width (e.g., 2 → 01, 02)." />

                  <Input
                    label="Prefix Pattern"
                    placeholder="e.g. {Class}{Section}"
                    value={config.prefix}
                    onChange={(e) =>
                    handleConfigChange('prefix', e.target.value)
                    }
                    disabled={config.numberFormat === 'numeric'}
                    helperText="Available vars: {Class}, {Section}, {Year}" />

                </div>

                {/* Dynamic Handling Rules */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                  <h4 className="text-sm font-semibold text-gray-800 border-b pb-2 mb-2">
                    Dynamic Handling Rules
                  </h4>

                  <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-white rounded transition-colors">
                    <input
                      type="checkbox"
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={config.appendNew}
                      onChange={(e) =>
                      handleConfigChange('appendNew', e.target.checked)
                      } />

                    <div>
                      <span className="text-sm font-medium text-gray-700 block">
                        Append new students at the end
                      </span>
                      <span className="text-xs text-gray-500">
                        Don't reshuffle existing numbers when a new student
                        joins mid-term.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-white rounded transition-colors">
                    <input
                      type="checkbox"
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={config.fillVacant}
                      onChange={(e) =>
                      handleConfigChange('fillVacant', e.target.checked)
                      } />

                    <div>
                      <span className="text-sm font-medium text-gray-700 block">
                        Fill vacant numbers
                      </span>
                      <span className="text-xs text-gray-500">
                        Re-use roll numbers if a student leaves (may cause gaps
                        otherwise).
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-white rounded transition-colors">
                    <input
                      type="checkbox"
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={config.separateGender}
                      onChange={(e) =>
                      handleConfigChange('separateGender', e.target.checked)
                      } />

                    <div>
                      <span className="text-sm font-medium text-gray-700 block">
                        Separate sequence for Boys/Girls
                      </span>
                      <span className="text-xs text-gray-500">
                        Assign numbers to one gender first, then the other.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </Card>

            {/* Preview Generation Card */}
            <Card
              title="Preview Generation"
              icon={<RefreshCw className="w-5 h-5 text-gray-500" />}>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-end bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex-1 w-full">
                    <Select
                      label="Test Class Context"
                      options={[
                      {
                        value: '10-A',
                        label: 'Class 10 - Section A'
                      },
                      {
                        value: '9-B',
                        label: 'Class 9 - Section B'
                      }]
                      }
                      value={selectedTestClass}
                      onChange={(val) => setSelectedTestClass(val)} />

                  </div>
                  <Button
                    variant="primary"
                    onClick={handleGeneratePreview}
                    leftIcon={<RefreshCw className="w-4 h-4" />}>

                    Generate Preview
                  </Button>
                </div>

                <div className="border rounded-lg overflow-hidden shadow-sm">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                      <tr>
                        <th className="px-4 py-3">Student Name</th>
                        <th className="px-4 py-3">Gender</th>
                        <th className="px-4 py-3">Current Roll No</th>
                        <th className="px-4 py-3 text-blue-600 bg-blue-50 border-l border-blue-100">
                          New Roll No
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {previewData.map((row, i) =>
                      <tr
                        key={i}
                        className="hover:bg-gray-50 transition-colors">

                          <td className="px-4 py-3 font-medium text-gray-900">
                            {row.name}
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            {row.gender}
                          </td>
                          <td className="px-4 py-3 text-gray-400 font-mono">
                            {row.oldRoll}
                          </td>
                          <td className="px-4 py-3 font-mono font-bold text-blue-600 bg-blue-50/30 border-l border-blue-100">
                            {row.newRoll}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <div className="p-3 bg-gray-50 text-xs text-center text-gray-500 border-t">
                    Previewing top 5 records only.
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Summary & Actions */}
          <div className="space-y-6">
            {/* Logic Summary Card */}
            <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Info className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-blue-900">Logic Summary</h3>
                  <p className="text-xs text-blue-700 mt-1">
                    Current configuration effect
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex justify-between border-b border-blue-100 pb-2">
                  <span className="text-gray-500">Sorting:</span>
                  <span className="font-medium">
                    {config.sortOrder === 'name_asc' ?
                    'Alphabetical (First Name)' :
                    config.sortOrder}
                  </span>
                </div>
                <div className="flex justify-between border-b border-blue-100 pb-2">
                  <span className="text-gray-500">Format:</span>
                  <span className="font-medium">
                    {config.numberFormat === 'numeric' ?
                    'Numeric' :
                    `Prefixed (${config.prefix})`}
                  </span>
                </div>
                <div className="flex justify-between border-b border-blue-100 pb-2">
                  <span className="text-gray-500">Padding:</span>
                  <span className="font-medium">
                    {config.minDigits} digits (e.g. 01)
                  </span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-gray-500">New Students:</span>
                  <Badge
                    variant={config.appendNew ? 'info' : 'warning'}
                    className="text-[10px]">

                    {config.appendNew ? 'Appended' : 'Reshuffled'}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Bulk Actions Card */}
            <Card
              title="Bulk Actions"
              icon={<Users className="w-5 h-5 text-gray-500" />}>

              <div className="space-y-4">
                <p className="text-sm text-gray-500 leading-relaxed">
                  Apply this logic to regenerate roll numbers for multiple
                  classes at once. This action cannot be undone easily.
                </p>
                <div className="p-3 bg-yellow-50 border border-yellow-100 rounded text-xs text-yellow-800 mb-2">
                  <strong>Note:</strong> This will overwrite existing roll
                  numbers for all selected classes.
                </div>
                <Button
                  className="w-full"
                  variant="outline"
                  leftIcon={<Users className="w-4 h-4" />}>

                  Apply to All Classes
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>);

}