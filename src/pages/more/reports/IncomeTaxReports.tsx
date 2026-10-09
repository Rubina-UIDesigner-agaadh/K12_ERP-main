import React from 'react';
import { ReportPageTemplate } from './ReportPageTemplate';
import {
  FileTextIcon,
  CalculatorIcon,
  ClipboardListIcon,
  AlertTriangleIcon } from
'lucide-react';
export function IncomeTaxReports() {
  return (
    <ReportPageTemplate
      pageTitle="Income Tax Reports"
      pageDescription="Form 16, TDS deduction, investment declaration and tax liability reports"
      reportCategories={[
      {
        id: 'form16',
        label: 'Form 16 Reports',
        color: 'bg-blue-600',
        bgColor: 'bg-blue-50',
        icon: <FileTextIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'form16-list',
          name: 'Form 16 Generation Report',
          description: 'Form 16 status for all employees',
          tags: ['Form 16', 'TDS'],
          isFeatured: true
        },
        {
          id: 'form16-pending',
          name: 'Form 16 Pending Report',
          description: 'Employees for whom Form 16 is yet to be generated',
          tags: ['Form 16', 'Pending']
        }]

      },
      {
        id: 'tds',
        label: 'TDS Deduction',
        color: 'bg-green-600',
        bgColor: 'bg-green-50',
        icon: <CalculatorIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'tds-summary',
          name: 'TDS Deduction Summary',
          description: 'Monthly TDS deducted per employee',
          tags: ['TDS', 'Deduction'],
          isFeatured: true
        },
        {
          id: 'tds-quarterly',
          name: 'Quarterly TDS Report',
          description: 'TDS deduction summary for each quarter',
          tags: ['TDS', 'Quarterly']
        },
        {
          id: 'tds-challan',
          name: 'TDS Challan Report',
          description: 'TDS challan payment records',
          tags: ['TDS', 'Challan']
        }]

      },
      {
        id: 'declaration',
        label: 'Investment Declaration',
        color: 'bg-purple-600',
        bgColor: 'bg-purple-50',
        icon: <ClipboardListIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'declaration-status',
          name: 'Investment Declaration Status',
          description: 'Employees who have/have not submitted declarations',
          tags: ['Declaration', 'Status']
        },
        {
          id: 'declaration-summary',
          name: 'Declaration Summary Report',
          description: 'Summary of investment declarations by type',
          tags: ['Declaration', 'Summary']
        }]

      },
      {
        id: 'liability',
        label: 'Tax Liability',
        color: 'bg-orange-600',
        bgColor: 'bg-orange-50',
        icon: <AlertTriangleIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'tax-liability',
          name: 'Tax Liability Report',
          description: 'Estimated tax liability per employee for the year',
          tags: ['Tax', 'Liability']
        },
        {
          id: 'tax-regime',
          name: 'Tax Regime Comparison',
          description: 'Old vs New tax regime comparison for employees',
          tags: ['Tax Regime', 'Comparison'],
          isNew: true
        }]

      }]
      }
      liveStats={[
      {
        label: 'Form 16 Ready',
        value: '68',
        subtitle: 'Out of 86 employees',
        color: 'text-blue-700',
        bgColor: 'bg-blue-50 border-blue-100',
        icon: <FileTextIcon className="w-4 h-4" />
      },
      {
        label: 'Total TDS',
        value: '₹4.2L',
        subtitle: 'Deducted this year',
        color: 'text-green-700',
        bgColor: 'bg-green-50 border-green-100',
        icon: <CalculatorIcon className="w-4 h-4" />
      },
      {
        label: 'Declarations Pending',
        value: '18',
        subtitle: 'Not yet submitted',
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-50 border-yellow-100',
        icon: <ClipboardListIcon className="w-4 h-4" />
      },
      {
        label: 'Tax Exempt Staff',
        value: '12',
        subtitle: 'Below tax threshold',
        color: 'text-purple-700',
        bgColor: 'bg-purple-50 border-purple-100',
        icon: <AlertTriangleIcon className="w-4 h-4" />
      }]
      } />);


}