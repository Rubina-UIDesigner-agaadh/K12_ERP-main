import React, { useState, Fragment } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  Search,
  Download,
  Filter,
  ChevronDown,
  ChevronRight,
  Eye,
  FileText,
  TrendingUp,
  Calendar,
  Users,
  IndianRupee } from
'lucide-react';
interface EmployeeTaxData {
  id: string;
  code: string;
  name: string;
  department: string;
  regime: 'Old' | 'New';
  annualGross: number;
  exemptions: number;
  deductions: number;
  taxableIncome: number;
  taxLiability: number;
  tdsDeducted: number;
  remainingTds: number;
  status: 'Complete' | 'Pending' | 'Action Required';
}
const mockEmployees: EmployeeTaxData[] = [
{
  id: '1',
  code: 'EMP001',
  name: 'Rajesh Kumar',
  department: 'IT',
  regime: 'New',
  annualGross: 1200000,
  exemptions: 50000,
  deductions: 150000,
  taxableIncome: 1000000,
  taxLiability: 112500,
  tdsDeducted: 95000,
  remainingTds: 17500,
  status: 'Pending'
},
{
  id: '2',
  code: 'EMP002',
  name: 'Priya Sharma',
  department: 'HR',
  regime: 'Old',
  annualGross: 950000,
  exemptions: 75000,
  deductions: 125000,
  taxableIncome: 750000,
  taxLiability: 62500,
  tdsDeducted: 62500,
  remainingTds: 0,
  status: 'Complete'
},
{
  id: '3',
  code: 'EMP003',
  name: 'Amit Patel',
  department: 'Finance',
  regime: 'New',
  annualGross: 1500000,
  exemptions: 60000,
  deductions: 100000,
  taxableIncome: 1340000,
  taxLiability: 195000,
  tdsDeducted: 150000,
  remainingTds: 45000,
  status: 'Action Required'
}];

export function EmployeeTaxSummaryList() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const formatCurrency = (amount: number) => {
    return `₹${(amount / 100000).toFixed(2)}L`;
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Complete':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Action Required':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };
  const getRegimeColor = (regime: string) => {
    return regime === 'New' ?
    'bg-blue-100 text-blue-700' :
    'bg-purple-100 text-purple-700';
  };
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Employee Tax Summary List
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            HR &gt; Payroll &gt; Income Tax &gt; Employee Tax Summary
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">248</p>
          <p className="text-sm text-gray-600">Total Employees</p>
        </Card>

        <Card className="p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <IndianRupee className="w-5 h-5 text-green-600" />
            <span className="text-xs text-green-600 font-medium">84%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">₹3.2Cr</p>
          <p className="text-sm text-gray-600">Total Tax Liability</p>
        </Card>

        <Card className="p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <span className="text-xs text-purple-600 font-medium">YTD</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">₹2.7Cr</p>
          <p className="text-sm text-gray-600">TDS Deducted</p>
        </Card>

        <Card className="p-4 border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            <span className="text-xs text-orange-600 font-medium">Pending</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">₹52L</p>
          <p className="text-sm text-gray-600">Remaining TDS</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search employee name, code, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10" />

            </div>
          </div>
          <Select
            options={[
            {
              value: '2024-25',
              label: 'FY 2024-25'
            },
            {
              value: '2023-24',
              label: 'FY 2023-24'
            }]
            }
            defaultValue="2024-25" />

          <Select
            options={[
            {
              value: 'all',
              label: 'All Regimes'
            },
            {
              value: 'old',
              label: 'Old Regime'
            },
            {
              value: 'new',
              label: 'New Regime'
            }]
            }
            defaultValue="all" />

          <Select
            options={[
            {
              value: 'all',
              label: 'All Departments'
            },
            {
              value: 'it',
              label: 'IT'
            },
            {
              value: 'hr',
              label: 'HR'
            },
            {
              value: 'finance',
              label: 'Finance'
            }]
            }
            defaultValue="all" />

        </div>
      </Card>

      {/* Employee Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                  Employee
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                  Department
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">
                  Regime
                </th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">
                  Annual Gross
                </th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">
                  Deductions
                </th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">
                  Taxable Income
                </th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">
                  Tax Liability
                </th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">
                  TDS Deducted
                </th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">
                  Remaining
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockEmployees.map((employee) =>
              <Fragment key={employee.id}>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                        onClick={() =>
                        setExpandedRow(
                          expandedRow === employee.id ? null : employee.id
                        )
                        }
                        className="p-1 hover:bg-gray-100 rounded">

                          {expandedRow === employee.id ?
                        <ChevronDown className="w-4 h-4 text-gray-600" /> :

                        <ChevronRight className="w-4 h-4 text-gray-600" />
                        }
                        </button>
                        <div>
                          <p className="font-medium text-gray-900">
                            {employee.name}
                          </p>
                          <p className="text-xs text-gray-500 font-mono">
                            {employee.code}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {employee.department}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge className={getRegimeColor(employee.regime)}>
                        {employee.regime}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      {formatCurrency(employee.annualGross)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {formatCurrency(employee.deductions)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-blue-600">
                      {formatCurrency(employee.taxableIncome)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      {formatCurrency(employee.taxLiability)}
                    </td>
                    <td className="px-4 py-3 text-right text-green-600 font-medium">
                      {formatCurrency(employee.tdsDeducted)}
                    </td>
                    <td className="px-4 py-3 text-right text-orange-600 font-medium">
                      {formatCurrency(employee.remainingTds)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge className={getStatusColor(employee.status)}>
                        {employee.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                  {expandedRow === employee.id &&
                <tr>
                      <td colSpan={11} className="px-4 py-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card className="p-4">
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-blue-600" />
                              Monthly TDS Breakdown
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Apr 2024:</span>
                                <span className="font-medium">₹9,375</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">May 2024:</span>
                                <span className="font-medium">₹9,375</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Jun 2024:</span>
                                <span className="font-medium">₹9,375</span>
                              </div>
                            </div>
                          </Card>
                          <Card className="p-4">
                            <h4 className="font-semibold text-gray-900 mb-3">
                              Declared Investments
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">80C:</span>
                                <span className="font-medium">₹1,50,000</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">80D:</span>
                                <span className="font-medium">₹25,000</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">HRA:</span>
                                <span className="font-medium">₹1,20,000</span>
                              </div>
                            </div>
                          </Card>
                          <Card className="p-4">
                            <h4 className="font-semibold text-gray-900 mb-3">
                              Proof Status
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">
                                  80C Proofs:
                                </span>
                                <Badge className="bg-green-100 text-green-700 text-xs">
                                  Verified
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">
                                  80D Proofs:
                                </span>
                                <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                                  Pending
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">
                                  HRA Proofs:
                                </span>
                                <Badge className="bg-green-100 text-green-700 text-xs">
                                  Verified
                                </Badge>
                              </div>
                            </div>
                          </Card>
                        </div>
                      </td>
                    </tr>
                }
                </Fragment>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing 1-3 of 248 employees
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <Button variant="primary" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>);

}