import React from 'react';
import { ReportPageTemplate } from './ReportPageTemplate';
import {
  FileTextIcon,
  ClipboardListIcon,
  CheckCircleIcon,
  ClockIcon } from
'lucide-react';
export function TransferLeavingCertificateReport() {
  return (
    <ReportPageTemplate
      pageTitle="Transfer & Certificate Reports"
      pageDescription="TC issued, migration certificates, bonafide and character certificate records"
      reportCategories={[
      {
        id: 'tc',
        label: 'TC Issued',
        color: 'bg-blue-600',
        bgColor: 'bg-blue-50',
        icon: <FileTextIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'tc-issued',
          name: 'Transfer Certificates Issued',
          description:
          'All TCs issued in the selected period with student details',
          tags: ['TC', 'Issued'],
          isFeatured: true
        },
        {
          id: 'tc-pending',
          name: 'Pending TC Requests',
          description: 'TC requests awaiting approval or processing',
          tags: ['TC', 'Pending']
        },
        {
          id: 'tc-classwise',
          name: 'Class-wise TC Summary',
          description: 'TC issuance summary grouped by class',
          tags: ['TC', 'Class-wise']
        }]

      },
      {
        id: 'migration',
        label: 'Migration Certificates',
        color: 'bg-green-600',
        bgColor: 'bg-green-50',
        icon: <ClipboardListIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'migration-issued',
          name: 'Migration Certificates Issued',
          description:
          'Migration certificates issued for board examination',
          tags: ['Migration', 'Board']
        },
        {
          id: 'migration-pending',
          name: 'Pending Migration Requests',
          description: 'Migration certificate requests under process',
          tags: ['Migration', 'Pending']
        }]

      },
      {
        id: 'bonafide',
        label: 'Bonafide Certificates',
        color: 'bg-purple-600',
        bgColor: 'bg-purple-50',
        icon: <CheckCircleIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'bonafide-issued',
          name: 'Bonafide Certificates Issued',
          description: 'All bonafide certificates issued with purpose',
          tags: ['Bonafide', 'Issued'],
          isFeatured: true
        },
        {
          id: 'bonafide-purpose',
          name: 'Purpose-wise Bonafide Report',
          description:
          'Bonafide certificates grouped by purpose (scholarship, bank, etc.)',
          tags: ['Bonafide', 'Purpose']
        }]

      },
      {
        id: 'character',
        label: 'Character Certificates',
        color: 'bg-orange-600',
        bgColor: 'bg-orange-50',
        icon: <ClockIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'character-issued',
          name: 'Character Certificates Issued',
          description: 'Character certificates issued with conduct remarks',
          tags: ['Character', 'Conduct']
        },
        {
          id: 'certificate-summary',
          name: 'All Certificates Summary',
          description: 'Combined summary of all certificate types issued',
          tags: ['Summary', 'All Types']
        }]

      }]
      }
      liveStats={[
      {
        label: 'TCs Issued',
        value: '48',
        subtitle: 'This academic year',
        color: 'text-blue-700',
        bgColor: 'bg-blue-50 border-blue-100',
        icon: <FileTextIcon className="w-4 h-4" />
      },
      {
        label: 'Pending Requests',
        value: '7',
        subtitle: 'Awaiting processing',
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-50 border-yellow-100',
        icon: <ClockIcon className="w-4 h-4" />
      },
      {
        label: 'Migration Certs',
        value: '124',
        subtitle: 'Board students',
        color: 'text-green-700',
        bgColor: 'bg-green-50 border-green-100',
        icon: <ClipboardListIcon className="w-4 h-4" />
      },
      {
        label: 'Bonafide Issued',
        value: '312',
        subtitle: 'This year',
        color: 'text-purple-700',
        bgColor: 'bg-purple-50 border-purple-100',
        icon: <CheckCircleIcon className="w-4 h-4" />
      }]
      } />);


}