import React from 'react';
import { ReportPageTemplate } from './ReportPageTemplate';
import {
  ClipboardListIcon,
  BarChart2Icon,
  TrendingUpIcon,
  UsersIcon } from
'lucide-react';
export function InternalExamReports() {
  return (
    <ReportPageTemplate
      pageTitle="Internal Exam Reports"
      pageDescription="Class-wise results, subject analysis, topper lists, absentee and grade distribution reports"
      reportCategories={[
      {
        id: 'classwise',
        label: 'Class-wise Results',
        color: 'bg-blue-600',
        bgColor: 'bg-blue-50',
        icon: <ClipboardListIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'class-result',
          name: 'Class-wise Result Report',
          description: 'Pass/fail statistics and averages per class',
          tags: ['Class', 'Result'],
          isFeatured: true
        },
        {
          id: 'term-comparison',
          name: 'Term-wise Comparison',
          description: 'Performance comparison across terms',
          tags: ['Term', 'Comparison']
        },
        {
          id: 'section-result',
          name: 'Section-wise Result',
          description: 'Results broken down by section',
          tags: ['Section', 'Result']
        }]

      },
      {
        id: 'subjectwise',
        label: 'Subject-wise Analysis',
        color: 'bg-green-600',
        bgColor: 'bg-green-50',
        icon: <BarChart2Icon className="w-4 h-4" />,
        reports: [
        {
          id: 'subject-analysis',
          name: 'Subject-wise Analysis Report',
          description: 'Average marks and pass % per subject',
          tags: ['Subject', 'Analysis'],
          isFeatured: true
        },
        {
          id: 'subject-grade',
          name: 'Subject Grade Distribution',
          description: 'Grade distribution (A/B/C/D/F) per subject',
          tags: ['Subject', 'Grade']
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
          description: 'Top 10 students per class with marks',
          tags: ['Toppers', 'Rank']
        },
        {
          id: 'school-toppers',
          name: 'School Topper List',
          description: 'Overall school toppers across all classes',
          tags: ['Toppers', 'School']
        }]

      },
      {
        id: 'absentee',
        label: 'Absentee Reports',
        color: 'bg-red-600',
        bgColor: 'bg-red-50',
        icon: <UsersIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'exam-absentees',
          name: 'Exam Absentee Report',
          description: 'Students absent for exams with reasons',
          tags: ['Absentee', 'Exam']
        },
        {
          id: 'makeup-exam',
          name: 'Make-up Exam Report',
          description: 'Students who appeared for make-up exams',
          tags: ['Make-up', 'Exam']
        }]

      },
      {
        id: 'grade',
        label: 'Grade Distribution',
        color: 'bg-purple-600',
        bgColor: 'bg-purple-50',
        icon: <BarChart2Icon className="w-4 h-4" />,
        reports: [
        {
          id: 'grade-distribution',
          name: 'Grade Distribution Report',
          description: 'Overall grade distribution across all classes',
          tags: ['Grade', 'Distribution']
        },
        {
          id: 'distinction-report',
          name: 'Distinction Report',
          description: 'Students achieving distinction (≥75%)',
          tags: ['Distinction', 'High Achievers'],
          isNew: true
        }]

      }]
      }
      liveStats={[
      {
        label: 'Exams Conducted',
        value: '48',
        subtitle: 'This term',
        color: 'text-blue-700',
        bgColor: 'bg-blue-50 border-blue-100',
        icon: <ClipboardListIcon className="w-4 h-4" />
      },
      {
        label: 'Avg Score',
        value: '68.4%',
        subtitle: 'School average',
        color: 'text-green-700',
        bgColor: 'bg-green-50 border-green-100',
        icon: <BarChart2Icon className="w-4 h-4" />
      },
      {
        label: 'Pass %',
        value: '91.8%',
        subtitle: 'Overall pass rate',
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-50 border-yellow-100',
        icon: <TrendingUpIcon className="w-4 h-4" />
      },
      {
        label: 'Distinction %',
        value: '22.4%',
        subtitle: '≥75% marks',
        color: 'text-purple-700',
        bgColor: 'bg-purple-50 border-purple-100',
        icon: <UsersIcon className="w-4 h-4" />
      }]
      } />);


}