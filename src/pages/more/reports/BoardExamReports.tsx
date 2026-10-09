import React from 'react';
import { ReportPageTemplate } from './ReportPageTemplate';
import {
  GraduationCapIcon,
  BarChart2Icon,
  TrendingUpIcon,
  AwardIcon } from
'lucide-react';
export function BoardExamReports() {
  return (
    <ReportPageTemplate
      pageTitle="Board Exam Reports"
      pageDescription="Class X and XII board results, subject performance, district ranks and improvement analysis"
      reportCategories={[
      {
        id: 'class10',
        label: 'Class X Results',
        color: 'bg-blue-600',
        bgColor: 'bg-blue-50',
        icon: <GraduationCapIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'class10-result',
          name: 'Class X Board Result Summary',
          description: 'Overall Class X board exam results with pass %',
          tags: ['Class X', 'Board'],
          isFeatured: true
        },
        {
          id: 'class10-subject',
          name: 'Class X Subject-wise Performance',
          description: 'Subject-wise marks and pass % for Class X',
          tags: ['Class X', 'Subject']
        },
        {
          id: 'class10-toppers',
          name: 'Class X Topper List',
          description: 'Top 10 students in Class X board exam',
          tags: ['Class X', 'Toppers']
        }]

      },
      {
        id: 'class12',
        label: 'Class XII Results',
        color: 'bg-green-600',
        bgColor: 'bg-green-50',
        icon: <GraduationCapIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'class12-result',
          name: 'Class XII Board Result Summary',
          description: 'Overall Class XII board exam results',
          tags: ['Class XII', 'Board'],
          isFeatured: true
        },
        {
          id: 'class12-stream',
          name: 'Stream-wise Performance',
          description: 'Science, Commerce, Arts stream comparison',
          tags: ['Class XII', 'Stream']
        },
        {
          id: 'class12-toppers',
          name: 'Class XII Topper List',
          description: 'Top 10 students in Class XII board exam',
          tags: ['Class XII', 'Toppers']
        }]

      },
      {
        id: 'subject',
        label: 'Subject-wise Performance',
        color: 'bg-purple-600',
        bgColor: 'bg-purple-50',
        icon: <BarChart2Icon className="w-4 h-4" />,
        reports: [
        {
          id: 'board-subject',
          name: 'Board Subject-wise Analysis',
          description: 'Detailed subject performance in board exams',
          tags: ['Subject', 'Board']
        },
        {
          id: 'subject-trend',
          name: 'Subject Performance Trend',
          description: 'Year-on-year subject performance comparison',
          tags: ['Subject', 'Trend']
        }]

      },
      {
        id: 'rank',
        label: 'District Rank Reports',
        color: 'bg-yellow-600',
        bgColor: 'bg-yellow-50',
        icon: <AwardIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'district-rank',
          name: 'District Rank Report',
          description: 'School ranking in district board exam results',
          tags: ['District', 'Rank'],
          isNew: true
        },
        {
          id: 'state-rank',
          name: 'State Rank Report',
          description: 'School position in state-level board results',
          tags: ['State', 'Rank']
        }]

      },
      {
        id: 'improvement',
        label: 'Improvement Analysis',
        color: 'bg-orange-600',
        bgColor: 'bg-orange-50',
        icon: <TrendingUpIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'improvement-analysis',
          name: 'Year-on-Year Improvement',
          description: 'Comparison of board results over 3 years',
          tags: ['Improvement', 'Trend']
        },
        {
          id: 'compartment-report',
          name: 'Compartment / Supplementary Report',
          description: 'Students appearing for compartment exams',
          tags: ['Compartment', 'Supplementary']
        }]

      }]
      }
      liveStats={[
      {
        label: 'Board Candidates',
        value: '272',
        subtitle: 'Class X + XII',
        color: 'text-blue-700',
        bgColor: 'bg-blue-50 border-blue-100',
        icon: <GraduationCapIcon className="w-4 h-4" />
      },
      {
        label: 'Pass %',
        value: '96.8%',
        subtitle: 'Last board exam',
        color: 'text-green-700',
        bgColor: 'bg-green-50 border-green-100',
        icon: <TrendingUpIcon className="w-4 h-4" />
      },
      {
        label: 'Distinction %',
        value: '34.2%',
        subtitle: '≥75% marks',
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-50 border-yellow-100',
        icon: <BarChart2Icon className="w-4 h-4" />
      },
      {
        label: 'School Rank',
        value: '#3',
        subtitle: 'In district',
        color: 'text-purple-700',
        bgColor: 'bg-purple-50 border-purple-100',
        icon: <AwardIcon className="w-4 h-4" />
      }]
      } />);


}