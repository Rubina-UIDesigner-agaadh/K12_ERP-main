import React from 'react';
import { ReportPageTemplate } from './ReportPageTemplate';
import {
  UsersIcon,
  BarChart2Icon,
  ShieldIcon,
  UserCheckIcon,
  PieChartIcon,
  TrendingUpIcon } from
'lucide-react';
export function AdmissionReports() {
  return (
    <ReportPageTemplate
      pageTitle="Admission Reports"
      pageDescription="Comprehensive admission strength, demographic, RTE/EWS, gender and category-wise reports"
      reportCategories={[
      {
        id: 'strength',
        label: 'Strength Reports',
        color: 'bg-blue-600',
        bgColor: 'bg-blue-50',
        icon: <UsersIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'class-strength',
          name: 'Class-wise Strength Report',
          description:
          'Total student strength broken down by class and section',
          tags: ['Strength', 'Class-wise'],
          isFeatured: true
        },
        {
          id: 'section-strength',
          name: 'Section-wise Strength Report',
          description:
          'Student count per section with capacity utilization',
          tags: ['Strength', 'Section']
        },
        {
          id: 'branch-strength',
          name: 'Branch-wise Strength Report',
          description: 'Comparative strength across all school branches',
          tags: ['Strength', 'Branch', 'Comparison']
        },
        {
          id: 'yoy-growth',
          name: 'Year-on-Year Growth Report',
          description:
          'Admission growth trends over multiple academic years',
          tags: ['Growth', 'Trend'],
          isNew: true
        }]

      },
      {
        id: 'demographic',
        label: 'Demographic Reports',
        color: 'bg-purple-600',
        bgColor: 'bg-purple-50',
        icon: <PieChartIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'age-distribution',
          name: 'Age Distribution Report',
          description: 'Student age group distribution across classes',
          tags: ['Age', 'Demographic']
        },
        {
          id: 'locality-report',
          name: 'Locality / Area Report',
          description: 'Students grouped by residential area or locality',
          tags: ['Locality', 'Geographic']
        },
        {
          id: 'religion-report',
          name: 'Religion-wise Report',
          description: 'Student distribution by religion',
          tags: ['Religion', 'Minority']
        },
        {
          id: 'caste-report',
          name: 'Caste Category Report',
          description: 'General, OBC, SC, ST, EWS breakdown',
          tags: ['Caste', 'Category']
        }]

      },
      {
        id: 'rte-ews',
        label: 'RTE / EWS Reports',
        color: 'bg-green-600',
        bgColor: 'bg-green-50',
        icon: <ShieldIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'rte-seats',
          name: 'RTE Seats Allocation vs Filled',
          description: 'RTE 25% quota seats allocated, filled and vacant',
          tags: ['RTE', 'Quota'],
          isFeatured: true,
          isNew: true
        },
        {
          id: 'ews-admissions',
          name: 'EWS Admissions Report',
          description:
          'EWS category admissions with income certificate status',
          tags: ['EWS', 'Admission']
        },
        {
          id: 'rte-attendance',
          name: 'RTE Student Attendance',
          description: 'Attendance tracking for RTE admitted students',
          tags: ['RTE', 'Attendance']
        },
        {
          id: 'rte-performance',
          name: 'RTE Student Performance',
          description: 'Academic performance of RTE students by class',
          tags: ['RTE', 'Performance']
        }]

      },
      {
        id: 'gender',
        label: 'Gender-wise Reports',
        color: 'bg-pink-600',
        bgColor: 'bg-pink-50',
        icon: <UserCheckIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'gender-distribution',
          name: 'Gender Distribution Report',
          description: 'Male/Female ratio across all classes and sections',
          tags: ['Gender', 'Distribution'],
          isFeatured: true
        },
        {
          id: 'girl-enrollment',
          name: 'Girl Child Enrollment Report',
          description: 'Girl student enrollment trends and statistics',
          tags: ['Girls', 'Enrollment']
        },
        {
          id: 'gender-attendance',
          name: 'Gender-wise Attendance',
          description:
          'Attendance comparison between male and female students',
          tags: ['Gender', 'Attendance']
        },
        {
          id: 'gender-performance',
          name: 'Gender-wise Performance',
          description: 'Academic performance comparison by gender',
          tags: ['Gender', 'Performance']
        }]

      },
      {
        id: 'category',
        label: 'Category-wise Reports',
        color: 'bg-orange-600',
        bgColor: 'bg-orange-50',
        icon: <BarChart2Icon className="w-4 h-4" />,
        reports: [
        {
          id: 'category-strength',
          name: 'Category-wise Strength',
          description: 'General, OBC, SC, ST, EWS student count per class',
          tags: ['Category', 'Strength']
        },
        {
          id: 'minority-report',
          name: 'Minority Community Report',
          description:
          'Religious and linguistic minority student admissions',
          tags: ['Minority', 'Community']
        },
        {
          id: 'category-performance',
          name: 'Category-wise Performance',
          description: 'Academic performance analysis by student category',
          tags: ['Category', 'Performance']
        }]

      },
      {
        id: 'source',
        label: 'Source Analysis',
        color: 'bg-teal-600',
        bgColor: 'bg-teal-50',
        icon: <TrendingUpIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'source-analysis',
          name: 'Admission Source Analysis',
          description:
          'How students found the school — referral, online, walk-in',
          tags: ['Source', 'Marketing']
        },
        {
          id: 'sibling-report',
          name: 'Sibling Admission Report',
          description: 'Students admitted through sibling referrals',
          tags: ['Sibling', 'Referral']
        }]

      }]
      }
      liveStats={[
      {
        label: 'Total Admissions',
        value: '1,248',
        subtitle: 'This academic year',
        color: 'text-blue-700',
        bgColor: 'bg-blue-50 border-blue-100',
        icon: <UsersIcon className="w-4 h-4" />
      },
      {
        label: 'Gender Ratio',
        value: '52:48',
        subtitle: 'Male : Female',
        color: 'text-pink-700',
        bgColor: 'bg-pink-50 border-pink-100',
        icon: <UserCheckIcon className="w-4 h-4" />
      },
      {
        label: 'RTE Seats Filled',
        value: '87%',
        subtitle: '104/120 seats',
        color: 'text-green-700',
        bgColor: 'bg-green-50 border-green-100',
        icon: <ShieldIcon className="w-4 h-4" />
      },
      {
        label: 'EWS Admissions',
        value: '62',
        subtitle: '5% of total',
        color: 'text-purple-700',
        bgColor: 'bg-purple-50 border-purple-100',
        icon: <BarChart2Icon className="w-4 h-4" />
      }]
      } />);


}