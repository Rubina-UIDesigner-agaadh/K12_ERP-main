import React from 'react';
import { ReportPageTemplate } from './ReportPageTemplate';
import {
  TrendingUpIcon,
  BarChart2Icon,
  UsersIcon,
  BookOpenIcon,
  AlertTriangleIcon } from
'lucide-react';
export function AcademicPerformanceReports() {
  return (
    <ReportPageTemplate
      pageTitle="Academic Performance Reports"
      pageDescription="Class-wise, subject-wise and student-level academic performance analysis"
      reportCategories={[
      {
        id: 'classwise',
        label: 'Class-wise Performance',
        color: 'bg-blue-600',
        bgColor: 'bg-blue-50',
        icon: <BarChart2Icon className="w-4 h-4" />,
        reports: [
        {
          id: 'class-result',
          name: 'Class-wise Result Summary',
          description: 'Pass/fail statistics and average scores per class',
          tags: ['Class', 'Result'],
          isFeatured: true
        },
        {
          id: 'section-comparison',
          name: 'Section-wise Comparison',
          description:
          'Performance comparison across sections of same class',
          tags: ['Section', 'Comparison']
        },
        {
          id: 'grade-distribution',
          name: 'Grade Distribution Report',
          description: 'Distribution of grades A, B, C, D across classes',
          tags: ['Grade', 'Distribution']
        }]

      },
      {
        id: 'subjectwise',
        label: 'Subject-wise Analysis',
        color: 'bg-green-600',
        bgColor: 'bg-green-50',
        icon: <BookOpenIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'subject-performance',
          name: 'Subject-wise Performance',
          description: 'Average marks and pass percentage per subject',
          tags: ['Subject', 'Performance'],
          isFeatured: true
        },
        {
          id: 'subject-trend',
          name: 'Subject Performance Trend',
          description: 'Subject-wise performance trends over terms',
          tags: ['Subject', 'Trend']
        },
        {
          id: 'weak-subjects',
          name: 'Weak Subject Analysis',
          description:
          'Subjects with highest failure rates requiring attention',
          tags: ['Weak', 'Analysis']
        }]

      },
      {
        id: 'toppers',
        label: 'Topper Lists',
        color: 'bg-yellow-600',
        bgColor: 'bg-yellow-50',
        icon: <TrendingUpIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'class-toppers',
          name: 'Class Topper List',
          description: 'Top 10 students per class with marks and rank',
          tags: ['Toppers', 'Rank'],
          isFeatured: true
        },
        {
          id: 'subject-toppers',
          name: 'Subject Topper List',
          description: 'Highest scorers per subject',
          tags: ['Toppers', 'Subject']
        },
        {
          id: 'merit-list',
          name: 'Merit List Report',
          description: 'School-wide merit list with overall ranking',
          tags: ['Merit', 'Rank']
        }]

      },
      {
        id: 'failure',
        label: 'Failure Analysis',
        color: 'bg-red-600',
        bgColor: 'bg-red-50',
        icon: <AlertTriangleIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'failure-report',
          name: 'Failure Analysis Report',
          description: 'Students who failed with subject-wise breakdown',
          tags: ['Failure', 'Analysis']
        },
        {
          id: 'repeat-failure',
          name: 'Repeat Failure Report',
          description: 'Students failing in multiple consecutive terms',
          tags: ['Repeat', 'Failure']
        },
        {
          id: 'at-risk',
          name: 'At-Risk Students Report',
          description:
          'Students at risk of failing based on current performance',
          tags: ['At-Risk', 'Alert'],
          isNew: true
        }]

      },
      {
        id: 'correlation',
        label: 'Attendance-Performance',
        color: 'bg-purple-600',
        bgColor: 'bg-purple-50',
        icon: <UsersIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'attendance-performance',
          name: 'Attendance-Performance Correlation',
          description:
          'Correlation between attendance % and academic scores',
          tags: ['Attendance', 'Correlation'],
          isNew: true
        },
        {
          id: 'low-attendance-performance',
          name: 'Low Attendance Impact',
          description: 'Performance of students with <75% attendance',
          tags: ['Low Attendance', 'Impact']
        }]

      }]
      }
      liveStats={[
      {
        label: 'Average Score',
        value: '72.4%',
        subtitle: 'School average',
        color: 'text-blue-700',
        bgColor: 'bg-blue-50 border-blue-100',
        icon: <BarChart2Icon className="w-4 h-4" />
      },
      {
        label: 'Pass %',
        value: '94.2%',
        subtitle: 'Overall pass rate',
        color: 'text-green-700',
        bgColor: 'bg-green-50 border-green-100',
        icon: <TrendingUpIcon className="w-4 h-4" />
      },
      {
        label: 'Distinction %',
        value: '18.6%',
        subtitle: '≥75% marks',
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-50 border-yellow-100',
        icon: <BookOpenIcon className="w-4 h-4" />
      },
      {
        label: 'Avg Attendance',
        value: '91.3%',
        subtitle: 'School average',
        color: 'text-purple-700',
        bgColor: 'bg-purple-50 border-purple-100',
        icon: <UsersIcon className="w-4 h-4" />
      }]
      } />);


}