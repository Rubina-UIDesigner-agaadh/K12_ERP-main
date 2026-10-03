import React from 'react';
import { ReportPageTemplate } from './ReportPageTemplate';
import {
  StarIcon,
  TrendingUpIcon,
  UsersIcon,
  BarChart2Icon } from
'lucide-react';
export function AppraisalReports() {
  return (
    <ReportPageTemplate
      pageTitle="Appraisal Reports"
      pageDescription="Annual appraisal summaries, department ratings, performance trends and increment reports"
      reportCategories={[
      {
        id: 'annual',
        label: 'Annual Appraisal',
        color: 'bg-blue-600',
        bgColor: 'bg-blue-50',
        icon: <StarIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'appraisal-summary',
          name: 'Annual Appraisal Summary',
          description: 'Overall appraisal results for all staff',
          tags: ['Appraisal', 'Annual'],
          isFeatured: true
        },
        {
          id: 'appraisal-pending',
          name: 'Pending Appraisals',
          description: 'Staff whose appraisals are yet to be completed',
          tags: ['Pending', 'Appraisal']
        },
        {
          id: 'appraisal-history',
          name: 'Appraisal History Report',
          description: 'Year-wise appraisal history per employee',
          tags: ['History', 'Trend']
        }]

      },
      {
        id: 'department',
        label: 'Department-wise Ratings',
        color: 'bg-green-600',
        bgColor: 'bg-green-50',
        icon: <BarChart2Icon className="w-4 h-4" />,
        reports: [
        {
          id: 'dept-ratings',
          name: 'Department-wise Rating Summary',
          description: 'Average appraisal ratings per department',
          tags: ['Department', 'Rating'],
          isFeatured: true
        },
        {
          id: 'dept-comparison',
          name: 'Department Comparison Report',
          description: 'Comparative performance across departments',
          tags: ['Department', 'Comparison']
        }]

      },
      {
        id: 'trends',
        label: 'Performance Trends',
        color: 'bg-purple-600',
        bgColor: 'bg-purple-50',
        icon: <TrendingUpIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'performance-trend',
          name: 'Performance Trend Analysis',
          description: 'Year-on-year performance improvement or decline',
          tags: ['Trend', 'Analysis']
        },
        {
          id: 'top-performers',
          name: 'Top Performers Report',
          description: 'Highest rated staff members this year',
          tags: ['Top', 'Performers']
        },
        {
          id: 'improvement-needed',
          name: 'Improvement Required Report',
          description: 'Staff with below-average appraisal scores',
          tags: ['Improvement', 'Alert'],
          isNew: true
        }]

      },
      {
        id: 'increment',
        label: 'Increment Reports',
        color: 'bg-orange-600',
        bgColor: 'bg-orange-50',
        icon: <UsersIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'increment-report',
          name: 'Increment Recommendation Report',
          description:
          'Salary increment recommendations based on appraisal',
          tags: ['Increment', 'Salary']
        },
        {
          id: 'promotion-report',
          name: 'Promotion Recommendation Report',
          description: 'Staff recommended for promotion',
          tags: ['Promotion', 'Recommendation']
        }]

      }]
      }
      liveStats={[
      {
        label: 'Appraisals Done',
        value: '74',
        subtitle: 'Out of 86 staff',
        color: 'text-blue-700',
        bgColor: 'bg-blue-50 border-blue-100',
        icon: <StarIcon className="w-4 h-4" />
      },
      {
        label: 'Avg Rating',
        value: '3.8/5',
        subtitle: 'School average',
        color: 'text-green-700',
        bgColor: 'bg-green-50 border-green-100',
        icon: <BarChart2Icon className="w-4 h-4" />
      },
      {
        label: 'Promotions',
        value: '6',
        subtitle: 'This year',
        color: 'text-purple-700',
        bgColor: 'bg-purple-50 border-purple-100',
        icon: <TrendingUpIcon className="w-4 h-4" />
      },
      {
        label: 'Increments Given',
        value: '58',
        subtitle: 'Salary increments',
        color: 'text-orange-700',
        bgColor: 'bg-orange-50 border-orange-100',
        icon: <UsersIcon className="w-4 h-4" />
      }]
      } />);


}