import React from 'react';
import { ReportPageTemplate } from './ReportPageTemplate';
import { WalletIcon, BarChart2Icon, ClockIcon, TagIcon } from 'lucide-react';
export function ChargesMiscellaneousIncome() {
  return (
    <ReportPageTemplate
      pageTitle="Charges & Miscellaneous Income"
      pageDescription="Charge collection summary, head-wise breakdown, pending charges and waiver reports"
      reportCategories={[
      {
        id: 'collection',
        label: 'Collection Summary',
        color: 'bg-blue-600',
        bgColor: 'bg-blue-50',
        icon: <WalletIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'charge-collection',
          name: 'Charge Collection Summary',
          description: 'Total charges collected in the selected period',
          tags: ['Collection', 'Summary'],
          isFeatured: true
        },
        {
          id: 'daily-collection',
          name: 'Daily Collection Report',
          description: 'Day-wise charge collection with receipt details',
          tags: ['Daily', 'Collection']
        },
        {
          id: 'monthly-collection',
          name: 'Monthly Collection Report',
          description: 'Month-wise charge collection summary',
          tags: ['Monthly', 'Collection']
        }]

      },
      {
        id: 'headwise',
        label: 'Head-wise Breakdown',
        color: 'bg-green-600',
        bgColor: 'bg-green-50',
        icon: <BarChart2Icon className="w-4 h-4" />,
        reports: [
        {
          id: 'head-breakdown',
          name: 'Head-wise Breakdown Report',
          description:
          'Income broken down by charge head (transport, lab, etc.)',
          tags: ['Head-wise', 'Breakdown'],
          isFeatured: true
        },
        {
          id: 'head-comparison',
          name: 'Head-wise Year Comparison',
          description: 'Charge head comparison across academic years',
          tags: ['Head', 'Comparison']
        }]

      },
      {
        id: 'pending',
        label: 'Pending Charges',
        color: 'bg-red-600',
        bgColor: 'bg-red-50',
        icon: <ClockIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'pending-charges',
          name: 'Pending Charges Report',
          description: 'Students with outstanding charge payments',
          tags: ['Pending', 'Outstanding']
        },
        {
          id: 'overdue-charges',
          name: 'Overdue Charges Report',
          description: 'Charges overdue by 30+ days',
          tags: ['Overdue', 'Alert'],
          isNew: true
        }]

      },
      {
        id: 'waiver',
        label: 'Waiver Reports',
        color: 'bg-purple-600',
        bgColor: 'bg-purple-50',
        icon: <TagIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'waiver-report',
          name: 'Charge Waiver Report',
          description: 'Charges waived with reason and approver details',
          tags: ['Waiver', 'Concession']
        },
        {
          id: 'waiver-summary',
          name: 'Waiver Summary by Category',
          description: 'Total waivers grouped by student category',
          tags: ['Waiver', 'Category']
        }]

      }]
      }
      liveStats={[
      {
        label: 'Total Collected',
        value: '₹8.4L',
        subtitle: 'This month',
        color: 'text-blue-700',
        bgColor: 'bg-blue-50 border-blue-100',
        icon: <WalletIcon className="w-4 h-4" />
      },
      {
        label: 'Pending',
        value: '₹1.2L',
        subtitle: 'Outstanding',
        color: 'text-red-700',
        bgColor: 'bg-red-50 border-red-100',
        icon: <ClockIcon className="w-4 h-4" />
      },
      {
        label: 'Waivers Given',
        value: '₹45K',
        subtitle: 'This month',
        color: 'text-purple-700',
        bgColor: 'bg-purple-50 border-purple-100',
        icon: <TagIcon className="w-4 h-4" />
      },
      {
        label: 'Charge Heads',
        value: '14',
        subtitle: 'Active heads',
        color: 'text-green-700',
        bgColor: 'bg-green-50 border-green-100',
        icon: <BarChart2Icon className="w-4 h-4" />
      }]
      } />);


}