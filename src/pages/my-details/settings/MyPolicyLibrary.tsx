import React, { useState } from 'react';
import { Search, FileText, Download, Eye, Filter, Calendar } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
export function MyPolicyLibrary() {
  const policies = [
  {
    id: 1,
    title: 'Student Code of Conduct',
    category: 'Academic',
    audience: 'Students',
    effectiveDate: '01-Apr-2024',
    description: 'Guidelines for student behavior and discipline.',
    version: 'v2.1'
  },
  {
    id: 2,
    title: 'IT Acceptable Use Policy',
    category: 'IT & Security',
    audience: 'All',
    effectiveDate: '01-Jan-2024',
    description: 'Rules for using school computers and internet.',
    version: 'v1.5'
  },
  {
    id: 3,
    title: 'Leave Policy 2024',
    category: 'HR',
    audience: 'Employees',
    effectiveDate: '01-Apr-2024',
    description: 'Updated leave entitlements and application process.',
    version: 'v3.0'
  }];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Policy Library</h1>
          <p className="text-sm text-gray-500">
            Access all official institute policies and guidelines.
          </p>
        </div>
      </div>

      <Card>
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6 pb-4 border-b border-gray-100">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search policies..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

          </div>
          <Select
            options={[
            {
              value: 'all',
              label: 'All Categories'
            },
            {
              value: 'academic',
              label: 'Academic'
            },
            {
              value: 'hr',
              label: 'HR'
            },
            {
              value: 'it',
              label: 'IT & Security'
            }]
            }
            className="w-40" />

          <Select
            options={[
            {
              value: 'all',
              label: 'All Audiences'
            },
            {
              value: 'student',
              label: 'Students'
            },
            {
              value: 'employee',
              label: 'Employees'
            }]
            }
            className="w-40" />

        </div>

        {/* Policy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {policies.map((policy) =>
          <div
            key={policy.id}
            className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-white flex flex-col">

              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <FileText className="w-6 h-6" />
                </div>
                <Badge variant="outline">{policy.version}</Badge>
              </div>

              <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                {policy.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                {policy.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">{policy.category}</Badge>
                <Badge variant="info">{policy.audience}</Badge>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                <Calendar className="w-3 h-3" />
                Effective: {policy.effectiveDate}
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <Button variant="primary" size="sm" className="flex-1">
                  <Eye className="w-3 h-3 mr-2" /> View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="w-3 h-3 mr-2" /> PDF
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>);

}