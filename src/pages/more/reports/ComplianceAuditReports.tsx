import React from 'react';
import { ReportPageTemplate } from './ReportPageTemplate';
import {
  ShieldIcon,
  FileTextIcon,
  AlertTriangleIcon,
  CheckCircleIcon } from
'lucide-react';
export function ComplianceAuditReports() {
  return (
    <ReportPageTemplate
      pageTitle="Compliance & Audit Reports"
      pageDescription="Audit trail, data change logs, access reports, policy and fee compliance"
      reportCategories={[
      {
        id: 'audit',
        label: 'Audit Trail',
        color: 'bg-blue-600',
        bgColor: 'bg-blue-50',
        icon: <FileTextIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'audit-trail',
          name: 'System Audit Trail Report',
          description: 'Complete log of all system actions and changes',
          tags: ['Audit', 'Trail'],
          isFeatured: true
        },
        {
          id: 'user-activity',
          name: 'User Activity Report',
          description: 'Login, logout and activity per user',
          tags: ['User', 'Activity']
        },
        {
          id: 'module-usage',
          name: 'Module Usage Report',
          description: 'Which modules are used most frequently',
          tags: ['Module', 'Usage']
        }]

      },
      {
        id: 'data-changes',
        label: 'Data Change Logs',
        color: 'bg-purple-600',
        bgColor: 'bg-purple-50',
        icon: <AlertTriangleIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'data-changes',
          name: 'Data Change Log Report',
          description: 'All data modifications with before/after values',
          tags: ['Data', 'Changes']
        },
        {
          id: 'critical-changes',
          name: 'Critical Data Changes',
          description:
          'Changes to sensitive data (marks, fees, attendance)',
          tags: ['Critical', 'Sensitive'],
          isNew: true
        }]

      },
      {
        id: 'access',
        label: 'Access Reports',
        color: 'bg-green-600',
        bgColor: 'bg-green-50',
        icon: <ShieldIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'access-report',
          name: 'User Access Report',
          description: 'Role-wise access permissions and usage',
          tags: ['Access', 'Permissions']
        },
        {
          id: 'unauthorized-access',
          name: 'Unauthorized Access Attempts',
          description: 'Failed login attempts and suspicious activity',
          tags: ['Security', 'Unauthorized']
        }]

      },
      {
        id: 'policy',
        label: 'Policy Compliance',
        color: 'bg-orange-600',
        bgColor: 'bg-orange-50',
        icon: <CheckCircleIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'policy-compliance',
          name: 'Policy Compliance Report',
          description: 'Compliance status for all school policies',
          tags: ['Policy', 'Compliance']
        },
        {
          id: 'cbse-compliance',
          name: 'Board Compliance Checklist',
          description: 'CBSE/GSEB/ICSE compliance status',
          tags: ['Board', 'Compliance']
        }]

      },
      {
        id: 'fee-compliance',
        label: 'Fee Compliance',
        color: 'bg-teal-600',
        bgColor: 'bg-teal-50',
        icon: <FileTextIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'fee-compliance',
          name: 'Fee Compliance Report',
          description: 'Fee collection compliance and defaulter analysis',
          tags: ['Fee', 'Compliance']
        },
        {
          id: 'rte-compliance',
          name: 'RTE Compliance Report',
          description: 'RTE 25% quota compliance status',
          tags: ['RTE', 'Compliance']
        }]

      }]
      }
      liveStats={[
      {
        label: 'Audit Events',
        value: '1,248',
        subtitle: 'This month',
        color: 'text-blue-700',
        bgColor: 'bg-blue-50 border-blue-100',
        icon: <FileTextIcon className="w-4 h-4" />
      },
      {
        label: 'Policy Violations',
        value: '3',
        subtitle: 'Needs attention',
        color: 'text-red-700',
        bgColor: 'bg-red-50 border-red-100',
        icon: <AlertTriangleIcon className="w-4 h-4" />
      },
      {
        label: 'Resolved Issues',
        value: '18',
        subtitle: 'This month',
        color: 'text-green-700',
        bgColor: 'bg-green-50 border-green-100',
        icon: <CheckCircleIcon className="w-4 h-4" />
      },
      {
        label: 'Compliance Score',
        value: '94%',
        subtitle: 'Overall',
        color: 'text-purple-700',
        bgColor: 'bg-purple-50 border-purple-100',
        icon: <ShieldIcon className="w-4 h-4" />
      }]
      } />);


}