import React from 'react';
import { ReportPageTemplate } from './ReportPageTemplate';
import {
  UsersIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  FileTextIcon } from
'lucide-react';
export function EmployeeMasterReport() {
  return (
    <ReportPageTemplate
      pageTitle="Employee Master Report"
      pageDescription="Staff directory, qualification, department and service record reports"
      reportCategories={[
      {
        id: 'directory',
        label: 'Staff Directory',
        color: 'bg-blue-600',
        bgColor: 'bg-blue-50',
        icon: <UsersIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'full-directory',
          name: 'Complete Staff Directory',
          description:
          'All employees with contact, designation and department',
          tags: ['Directory', 'All Staff'],
          isFeatured: true
        },
        {
          id: 'teaching-staff',
          name: 'Teaching Staff List',
          description:
          'All teaching staff with subjects and classes assigned',
          tags: ['Teaching', 'Staff']
        },
        {
          id: 'non-teaching',
          name: 'Non-Teaching Staff List',
          description: 'Administrative and support staff directory',
          tags: ['Non-Teaching', 'Admin']
        }]

      },
      {
        id: 'qualification',
        label: 'Qualification Reports',
        color: 'bg-green-600',
        bgColor: 'bg-green-50',
        icon: <GraduationCapIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'qualification-report',
          name: 'Staff Qualification Report',
          description: 'Educational qualifications of all staff members',
          tags: ['Qualification', 'Education'],
          isFeatured: true
        },
        {
          id: 'b-ed-report',
          name: 'B.Ed / Teaching Certification',
          description: 'Staff with B.Ed and teaching certifications',
          tags: ['B.Ed', 'Certification']
        }]

      },
      {
        id: 'department',
        label: 'Department-wise',
        color: 'bg-purple-600',
        bgColor: 'bg-purple-50',
        icon: <BriefcaseIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'dept-strength',
          name: 'Department-wise Strength',
          description: 'Staff count per department with vacancies',
          tags: ['Department', 'Strength']
        },
        {
          id: 'dept-workload',
          name: 'Department Workload Report',
          description: 'Teaching periods and workload per department',
          tags: ['Department', 'Workload']
        }]

      },
      {
        id: 'designation',
        label: 'Designation-wise',
        color: 'bg-orange-600',
        bgColor: 'bg-orange-50',
        icon: <FileTextIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'designation-report',
          name: 'Designation-wise Report',
          description:
          'Staff grouped by designation (Principal, HOD, PGT, TGT, PRT)',
          tags: ['Designation', 'Hierarchy']
        },
        {
          id: 'new-joiners',
          name: 'New Joiners Report',
          description: 'Staff who joined in the current academic year',
          tags: ['New', 'Joiners'],
          isNew: true
        }]

      },
      {
        id: 'service',
        label: 'Service Records',
        color: 'bg-teal-600',
        bgColor: 'bg-teal-50',
        icon: <FileTextIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'service-record',
          name: 'Service Record Summary',
          description:
          'Years of service, joining date and experience summary',
          tags: ['Service', 'Experience']
        },
        {
          id: 'long-service',
          name: 'Long Service Report',
          description: 'Staff with 10+ years of service',
          tags: ['Long Service', 'Loyalty']
        }]

      }]
      }
      liveStats={[
      {
        label: 'Total Staff',
        value: '86',
        subtitle: 'All employees',
        color: 'text-blue-700',
        bgColor: 'bg-blue-50 border-blue-100',
        icon: <UsersIcon className="w-4 h-4" />
      },
      {
        label: 'Teaching Staff',
        value: '62',
        subtitle: '72% of total',
        color: 'text-green-700',
        bgColor: 'bg-green-50 border-green-100',
        icon: <GraduationCapIcon className="w-4 h-4" />
      },
      {
        label: 'Non-Teaching',
        value: '24',
        subtitle: '28% of total',
        color: 'text-purple-700',
        bgColor: 'bg-purple-50 border-purple-100',
        icon: <BriefcaseIcon className="w-4 h-4" />
      },
      {
        label: 'New Joiners',
        value: '8',
        subtitle: 'This academic year',
        color: 'text-orange-700',
        bgColor: 'bg-orange-50 border-orange-100',
        icon: <FileTextIcon className="w-4 h-4" />
      }]
      } />);


}