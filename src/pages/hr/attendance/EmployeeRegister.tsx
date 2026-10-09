import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Save, X, User, Briefcase, Phone, Upload, UserPlus, Edit, Trash2 } from 'lucide-react';

export function EmployeeRegister() {
  const [activeTab, setActiveTab] = useState('personal');

  const tabs = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'official', label: 'Official Details', icon: Briefcase },
  { id: 'contact', label: 'Contact Info', icon: Phone }];


  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Employee Register
          </h1>
          <p className="text-sm text-gray-500">
            Add or edit employee details and information
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button variant="primary">
            <Save className="w-4 h-4 mr-2" />
            Save Employee
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card title="Employee Photo">
          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300 mb-4">
                <User className="w-16 h-16 text-gray-400" />
              </div>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Upload Photo
              </Button>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">
                JPG, PNG or GIF. Max size 2MB
              </p>
            </div>
            <div className="border-t pt-4">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <p className="text-sm text-gray-600 mb-1">Employee Code</p>
                <p className="text-xl font-bold text-blue-600">EMP-2024-0156</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Created On</span>
                <span className="text-sm font-medium text-gray-900">15 Jan 2024</span>
              </div>
            </div>
          </div>
        </Card>

        <div className="lg:col-span-3">
          <Card>
            <div className="space-y-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id ?
                        'border-blue-500 text-blue-600' :
                        'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                        }>

                        <Icon className="w-4 h-4 mr-2" />
                        {tab.label}
                      </button>);

                  })}
                </nav>
              </div>

              {activeTab === 'personal' &&
              <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                    label="First Name"
                    type="text"
                    placeholder="Enter first name"
                    defaultValue="" />

                    <Input
                    label="Middle Name"
                    type="text"
                    placeholder="Enter middle name"
                    defaultValue="" />

                    <Input
                    label="Last Name"
                    type="text"
                    placeholder="Enter last name"
                    defaultValue="" />

                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                    label="Date of Birth"
                    type="date"
                    defaultValue="" />

                    <Select
                    label="Gender"
                    options={[
                    { value: '', label: 'Select Gender' },
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'other', label: 'Other' }]
                    }
                    defaultValue="" />

                    <Select
                    label="Blood Group"
                    options={[
                    { value: '', label: 'Select Blood Group' },
                    { value: 'a+', label: 'A+' },
                    { value: 'a-', label: 'A-' },
                    { value: 'b+', label: 'B+' },
                    { value: 'b-', label: 'B-' },
                    { value: 'ab+', label: 'AB+' },
                    { value: 'ab-', label: 'AB-' },
                    { value: 'o+', label: 'O+' },
                    { value: 'o-', label: 'O-' }]
                    }
                    defaultValue="" />

                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select
                    label="Marital Status"
                    options={[
                    { value: '', label: 'Select Status' },
                    { value: 'single', label: 'Single' },
                    { value: 'married', label: 'Married' },
                    { value: 'divorced', label: 'Divorced' },
                    { value: 'widowed', label: 'Widowed' }]
                    }
                    defaultValue="" />

                    <Select
                    label="Nationality"
                    options={[
                    { value: '', label: 'Select Nationality' },
                    { value: 'indian', label: 'Indian' },
                    { value: 'american', label: 'American' },
                    { value: 'british', label: 'British' },
                    { value: 'other', label: 'Other' }]
                    }
                    defaultValue="indian" />

                    <Select
                    label="Religion"
                    options={[
                    { value: '', label: 'Select Religion' },
                    { value: 'hindu', label: 'Hindu' },
                    { value: 'muslim', label: 'Muslim' },
                    { value: 'christian', label: 'Christian' },
                    { value: 'sikh', label: 'Sikh' },
                    { value: 'other', label: 'Other' }]
                    }
                    defaultValue="" />

                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                    label="Aadhar Number"
                    type="text"
                    placeholder="XXXX-XXXX-XXXX"
                    defaultValue="" />

                    <Input
                    label="PAN Number"
                    type="text"
                    placeholder="ABCDE1234F"
                    defaultValue="" />

                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                    label="Father's Name"
                    type="text"
                    placeholder="Enter father's name"
                    defaultValue="" />

                    <Input
                    label="Mother's Name"
                    type="text"
                    placeholder="Enter mother's name"
                    defaultValue="" />

                  </div>
                </div>
              }

              {activeTab === 'official' &&
              <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                    label="Employee Code"
                    type="text"
                    placeholder="Auto-generated"
                    defaultValue="EMP-2024-0156" />

                    <Input
                    label="Date of Joining"
                    type="date"
                    defaultValue="2024-01-15" />

                    <Select
                    label="Employment Type"
                    options={[
                    { value: '', label: 'Select Type' },
                    { value: 'permanent', label: 'Permanent' },
                    { value: 'contract', label: 'Contract' },
                    { value: 'trainee', label: 'Trainee' },
                    { value: 'intern', label: 'Intern' },
                    { value: 'parttime', label: 'Part-Time' }]
                    }
                    defaultValue="permanent" />

                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                    label="Department"
                    options={[
                    { value: '', label: 'Select Department' },
                    { value: 'engineering', label: 'Engineering' },
                    { value: 'hr', label: 'Human Resources' },
                    { value: 'finance', label: 'Finance' },
                    { value: 'sales', label: 'Sales' },
                    { value: 'marketing', label: 'Marketing' },
                    { value: 'operations', label: 'Operations' },
                    { value: 'it', label: 'IT Support' }]
                    }
                    defaultValue="" />

                    <Select
                    label="Designation"
                    options={[
                    { value: '', label: 'Select Designation' },
                    { value: 'manager', label: 'Manager' },
                    { value: 'senior_developer', label: 'Senior Developer' },
                    { value: 'developer', label: 'Developer' },
                    { value: 'junior_developer', label: 'Junior Developer' },
                    { value: 'analyst', label: 'Analyst' },
                    { value: 'executive', label: 'Executive' },
                    { value: 'intern', label: 'Intern' }]
                    }
                    defaultValue="" />

                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                    label="Reporting Manager"
                    options={[
                    { value: '', label: 'Select Manager' },
                    { value: 'mgr001', label: 'John Smith - Engineering Head' },
                    { value: 'mgr002', label: 'Sarah Johnson - HR Manager' },
                    { value: 'mgr003', label: 'Michael Brown - Project Lead' },
                    { value: 'mgr004', label: 'Emily Davis - Team Lead' }]
                    }
                    defaultValue="" />

                    <Select
                    label="Shift Assignment"
                    options={[
                    { value: '', label: 'Select Shift' },
                    { value: 'general', label: 'General Shift (9:00 AM - 6:00 PM)' },
                    { value: 'morning', label: 'Morning Shift (6:00 AM - 2:00 PM)' },
                    { value: 'evening', label: 'Evening Shift (2:00 PM - 10:00 PM)' },
                    { value: 'night', label: 'Night Shift (10:00 PM - 6:00 AM)' },
                    { value: 'flexible', label: 'Flexible Hours' }]
                    }
                    defaultValue="general" />

                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select
                    label="Work Location"
                    options={[
                    { value: '', label: 'Select Location' },
                    { value: 'hq', label: 'Head Office - Mumbai' },
                    { value: 'branch1', label: 'Branch - Bangalore' },
                    { value: 'branch2', label: 'Branch - Delhi' },
                    { value: 'remote', label: 'Remote' }]
                    }
                    defaultValue="" />

                    <Input
                    label="Probation Period (Months)"
                    type="number"
                    defaultValue="6" />

                    <Input
                    label="Confirmation Date"
                    type="date"
                    defaultValue="" />

                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                    label="Official Email"
                    type="email"
                    placeholder="employee@company.com"
                    defaultValue="" />

                    <Input
                    label="Employee ID Card Number"
                    type="text"
                    placeholder="Enter ID card number"
                    defaultValue="" />

                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Enable Biometric Attendance
                    </span>
                    <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    defaultChecked />

                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Access to Company Portal
                    </span>
                    <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    defaultChecked />

                  </div>
                </div>
              }

              {activeTab === 'contact' &&
              <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                    label="Mobile Number"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    defaultValue="" />

                    <Input
                    label="Alternate Mobile"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    defaultValue="" />

                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                    label="Personal Email"
                    type="email"
                    placeholder="email@example.com"
                    defaultValue="" />

                    <Input
                    label="Landline Number"
                    type="tel"
                    placeholder="Area code + Number"
                    defaultValue="" />

                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Current Address</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address Line 1
                        </label>
                        <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="2"
                        placeholder="House/Flat No., Building Name, Street..." />

                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                        label="City"
                        type="text"
                        placeholder="Enter city"
                        defaultValue="" />

                        <Select
                        label="State"
                        options={[
                        { value: '', label: 'Select State' },
                        { value: 'maharashtra', label: 'Maharashtra' },
                        { value: 'karnataka', label: 'Karnataka' },
                        { value: 'tamilnadu', label: 'Tamil Nadu' },
                        { value: 'delhi', label: 'Delhi' },
                        { value: 'gujarat', label: 'Gujarat' }]
                        }
                        defaultValue="" />

                        <Input
                        label="PIN Code"
                        type="text"
                        placeholder="XXXXXX"
                        defaultValue="" />

                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-900">Permanent Address</h3>
                      <label className="flex items-center gap-2 text-sm text-gray-600">
                        <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />

                        Same as Current Address
                      </label>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address Line 1
                        </label>
                        <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="2"
                        placeholder="House/Flat No., Building Name, Street..." />

                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                        label="City"
                        type="text"
                        placeholder="Enter city"
                        defaultValue="" />

                        <Select
                        label="State"
                        options={[
                        { value: '', label: 'Select State' },
                        { value: 'maharashtra', label: 'Maharashtra' },
                        { value: 'karnataka', label: 'Karnataka' },
                        { value: 'tamilnadu', label: 'Tamil Nadu' },
                        { value: 'delhi', label: 'Delhi' },
                        { value: 'gujarat', label: 'Gujarat' }]
                        }
                        defaultValue="" />

                        <Input
                        label="PIN Code"
                        type="text"
                        placeholder="XXXXXX"
                        defaultValue="" />

                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Emergency Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                      label="Contact Name"
                      type="text"
                      placeholder="Enter name"
                      defaultValue="" />

                      <Select
                      label="Relationship"
                      options={[
                      { value: '', label: 'Select Relationship' },
                      { value: 'father', label: 'Father' },
                      { value: 'mother', label: 'Mother' },
                      { value: 'spouse', label: 'Spouse' },
                      { value: 'sibling', label: 'Sibling' },
                      { value: 'friend', label: 'Friend' },
                      { value: 'other', label: 'Other' }]
                      }
                      defaultValue="" />

                      <Input
                      label="Contact Number"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      defaultValue="" />

                    </div>
                  </div>
                </div>
              }

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Reset Form
                </Button>
                <Button variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button variant="primary">
                  <Save className="w-4 h-4 mr-2" />
                  Save Employee
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>);

}