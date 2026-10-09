import React from 'react';
import { ReportPageTemplate } from './ReportPageTemplate';
import {
  CreditCardIcon,
  CheckCircleIcon,
  XCircleIcon,
  RefreshCwIcon } from
'lucide-react';
export function OnlinePaymentReport() {
  return (
    <ReportPageTemplate
      pageTitle="Online Payment Report"
      pageDescription="Transaction summary, gateway-wise reports, failed transactions and reconciliation"
      reportCategories={[
      {
        id: 'transaction',
        label: 'Transaction Summary',
        color: 'bg-blue-600',
        bgColor: 'bg-blue-50',
        icon: <CreditCardIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'transaction-summary',
          name: 'Transaction Summary Report',
          description:
          'All online transactions with amount, status and date',
          tags: ['Transactions', 'Summary'],
          isFeatured: true
        },
        {
          id: 'daily-transactions',
          name: 'Daily Transaction Report',
          description: 'Day-wise online payment collection',
          tags: ['Daily', 'Transactions']
        },
        {
          id: 'monthly-transactions',
          name: 'Monthly Transaction Report',
          description: 'Month-wise online payment summary',
          tags: ['Monthly', 'Transactions']
        }]

      },
      {
        id: 'gateway',
        label: 'Gateway-wise Reports',
        color: 'bg-green-600',
        bgColor: 'bg-green-50',
        icon: <CheckCircleIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'gateway-report',
          name: 'Gateway-wise Collection Report',
          description:
          'Collections split by payment gateway (Razorpay, PayU, etc.)',
          tags: ['Gateway', 'Collection'],
          isFeatured: true
        },
        {
          id: 'gateway-fees',
          name: 'Gateway Fee Report',
          description: 'Convenience fees charged per gateway',
          tags: ['Gateway', 'Fees']
        }]

      },
      {
        id: 'failed',
        label: 'Failed Transactions',
        color: 'bg-red-600',
        bgColor: 'bg-red-50',
        icon: <XCircleIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'failed-transactions',
          name: 'Failed Transactions Report',
          description: 'All failed payment attempts with error codes',
          tags: ['Failed', 'Errors']
        },
        {
          id: 'failure-analysis',
          name: 'Failure Analysis Report',
          description: 'Common failure reasons and patterns',
          tags: ['Failure', 'Analysis'],
          isNew: true
        }]

      },
      {
        id: 'reconciliation',
        label: 'Reconciliation',
        color: 'bg-purple-600',
        bgColor: 'bg-purple-50',
        icon: <RefreshCwIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'reconciliation-report',
          name: 'Payment Reconciliation Report',
          description: 'Match gateway settlements with school records',
          tags: ['Reconciliation', 'Settlement']
        },
        {
          id: 'pending-reconciliation',
          name: 'Pending Reconciliation Report',
          description: 'Transactions pending reconciliation',
          tags: ['Pending', 'Reconciliation']
        },
        {
          id: 'refund-report',
          name: 'Refund Report',
          description: 'All refunds processed with status',
          tags: ['Refund', 'Status']
        }]

      }]
      }
      liveStats={[
      {
        label: 'Total Online',
        value: '₹24.8L',
        subtitle: 'This month',
        color: 'text-blue-700',
        bgColor: 'bg-blue-50 border-blue-100',
        icon: <CreditCardIcon className="w-4 h-4" />
      },
      {
        label: 'Success Rate',
        value: '97.2%',
        subtitle: 'Transaction success',
        color: 'text-green-700',
        bgColor: 'bg-green-50 border-green-100',
        icon: <CheckCircleIcon className="w-4 h-4" />
      },
      {
        label: 'Failed',
        value: '23',
        subtitle: 'This month',
        color: 'text-red-700',
        bgColor: 'bg-red-50 border-red-100',
        icon: <XCircleIcon className="w-4 h-4" />
      },
      {
        label: 'Pending Recon.',
        value: '8',
        subtitle: 'Unreconciled',
        color: 'text-purple-700',
        bgColor: 'bg-purple-50 border-purple-100',
        icon: <RefreshCwIcon className="w-4 h-4" />
      }]
      } />);


}