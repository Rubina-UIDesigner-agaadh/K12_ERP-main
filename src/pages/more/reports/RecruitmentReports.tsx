import React from 'react';
import { ReportPageTemplate } from './ReportPageTemplate';
import {
  UsersIcon,
  ClipboardListIcon,
  CalendarIcon,
  TrendingUpIcon } from
'lucide-react';
export function RecruitmentReports() {
  return (
    <ReportPageTemplate
      pageTitle="Recruitment Reports"
      pageDescription="Vacancy, application tracking, interview and attrition analysis reports"
      reportCategories={[
      {
        id: 'vacancy',
        label: 'Vacancy Reports',
        color: 'bg-blue-600',
        bgColor: 'bg-blue-50',
        icon: <ClipboardListIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'open-vacancies',
          name: 'Open Vacancies Report',
          description:
          'All open positions with department and requirements',
          tags: ['Vacancy', 'Open'],
          isFeatured: true
        },
        {
          id: 'vacancy-history',
          name: 'Vacancy History Report',
          description: 'Historical record of all vacancies and fill rates',
          tags: ['Vacancy', 'History']
        }]

      },
      {
        id: 'applications',
        label: 'Application Tracking',
        color: 'bg-green-600',
        bgColor: 'bg-green-50',
        icon: <UsersIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'applications-received',
          name: 'Applications Received Report',
          description: 'All applications with status and source',
          tags: ['Applications', 'Tracking'],
          isFeatured: true
        },
        {
          id: 'shortlisted',
          name: 'Shortlisted Candidates Report',
          description: 'Candidates shortlisted for interviews',
          tags: ['Shortlist', 'Candidates']
        }]

      },
      {
        id: 'interview',
        label: 'Interview Reports',
        color: 'bg-purple-600',
        bgColor: 'bg-purple-50',
        icon: <CalendarIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'interview-schedule',
          name: 'Interview Schedule Report',
          description: 'Upcoming and past interviews with outcomes',
          tags: ['Interview', 'Schedule']
        },
        {
          id: 'interview-outcome',
          name: 'Interview Outcome Report',
          description: 'Selected, rejected and on-hold candidates',
          tags: ['Interview', 'Outcome']
        }]

      },
      {
        id: 'joining',
        label: 'Joining Reports',
        color: 'bg-orange-600',
        bgColor: 'bg-orange-50',
        icon: <UsersIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'joining-report',
          name: 'New Joinings Report',
          description: 'Staff who joined in the selected period',
          tags: ['Joining', 'New Staff']
        },
        {
          id: 'offer-acceptance',
          name: 'Offer Acceptance Rate',
          description: 'Percentage of offers accepted vs rejected',
          tags: ['Offer', 'Acceptance'],
          isNew: true
        }]

      },
      {
        id: 'attrition',
        label: 'Attrition Analysis',
        color: 'bg-red-600',
        bgColor: 'bg-red-50',
        icon: <TrendingUpIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'attrition-report',
          name: 'Attrition Analysis Report',
          description: 'Staff turnover rate and exit analysis',
          tags: ['Attrition', 'Turnover']
        },
        {
          id: 'exit-interview',
          name: 'Exit Interview Summary',
          description: 'Reasons for resignation from exit interviews',
          tags: ['Exit', 'Reasons']
        }]

      }]
      }
      liveStats={[
      {
        label: 'Open Vacancies',
        value: '12',
        subtitle: 'Across departments',
        color: 'text-blue-700',
        bgColor: 'bg-blue-50 border-blue-100',
        icon: <ClipboardListIcon className="w-4 h-4" />
      },
      {
        label: 'Applications',
        value: '87',
        subtitle: 'Received this month',
        color: 'text-green-700',
        bgColor: 'bg-green-50 border-green-100',
        icon: <UsersIcon className="w-4 h-4" />
      },
      {
        label: 'Interviews',
        value: '24',
        subtitle: 'Scheduled this week',
        color: 'text-purple-700',
        bgColor: 'bg-purple-50 border-purple-100',
        icon: <CalendarIcon className="w-4 h-4" />
      },
      {
        label: 'Joinings',
        value: '8',
        subtitle: 'This month',
        color: 'text-orange-700',
        bgColor: 'bg-orange-50 border-orange-100',
        icon: <TrendingUpIcon className="w-4 h-4" />
      }]
      } />);


}