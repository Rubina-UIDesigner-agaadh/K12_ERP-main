import React from 'react';
import { ReportPageTemplate } from './ReportPageTemplate';
import {
  CheckCircleIcon,
  ClockIcon,
  AlertTriangleIcon,
  CalendarIcon } from
'lucide-react';
export function EmployeeAttendanceReport() {
  return (
    <ReportPageTemplate
      pageTitle="Employee Attendance Report"
      pageDescription="Daily, monthly and leave-wise attendance reports for all staff"
      reportCategories={[
      {
        id: 'daily',
        label: 'Daily Attendance',
        color: 'bg-blue-600',
        bgColor: 'bg-blue-50',
        icon: <CalendarIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'daily-attendance',
          name: 'Daily Attendance Register',
          description: 'Day-wise attendance of all staff members',
          tags: ['Daily', 'Register'],
          isFeatured: true
        },
        {
          id: 'today-attendance',
          name: "Today's Attendance Summary",
          description: 'Present, absent and late arrivals for today',
          tags: ['Today', 'Summary']
        }]

      },
      {
        id: 'monthly',
        label: 'Monthly Summary',
        color: 'bg-green-600',
        bgColor: 'bg-green-50',
        icon: <CheckCircleIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'monthly-summary',
          name: 'Monthly Attendance Summary',
          description: 'Month-wise attendance count per employee',
          tags: ['Monthly', 'Summary'],
          isFeatured: true
        },
        {
          id: 'dept-monthly',
          name: 'Department-wise Monthly Report',
          description: 'Monthly attendance grouped by department',
          tags: ['Department', 'Monthly']
        }]

      },
      {
        id: 'leave',
        label: 'Leave Reports',
        color: 'bg-purple-600',
        bgColor: 'bg-purple-50',
        icon: <ClockIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'leave-summary',
          name: 'Leave Summary Report',
          description: 'Leave taken vs balance for each employee',
          tags: ['Leave', 'Balance']
        },
        {
          id: 'leave-type',
          name: 'Leave Type Analysis',
          description: 'CL, EL, ML, SL breakdown per employee',
          tags: ['Leave Type', 'Analysis']
        },
        {
          id: 'leave-calendar',
          name: 'Leave Calendar Report',
          description: 'Visual calendar of staff leaves by month',
          tags: ['Leave', 'Calendar'],
          isNew: true
        }]

      },
      {
        id: 'late',
        label: 'Late Arrival Reports',
        color: 'bg-yellow-600',
        bgColor: 'bg-yellow-50',
        icon: <AlertTriangleIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'late-arrivals',
          name: 'Late Arrival Report',
          description: 'Staff arriving after scheduled time',
          tags: ['Late', 'Punctuality']
        },
        {
          id: 'late-trend',
          name: 'Late Arrival Trend',
          description: 'Frequency of late arrivals per employee over time',
          tags: ['Late', 'Trend']
        }]

      },
      {
        id: 'absenteeism',
        label: 'Absenteeism Analysis',
        color: 'bg-red-600',
        bgColor: 'bg-red-50',
        icon: <AlertTriangleIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'absenteeism',
          name: 'Absenteeism Analysis Report',
          description: 'Staff with high absenteeism rates',
          tags: ['Absenteeism', 'Analysis']
        },
        {
          id: 'consecutive-absent',
          name: 'Consecutive Absence Report',
          description: 'Staff absent for 3 or more consecutive days',
          tags: ['Consecutive', 'Absence'],
          isNew: true
        }]

      }]
      }
      liveStats={[
      {
        label: 'Present Today',
        value: '78',
        subtitle: 'Out of 86 staff',
        color: 'text-green-700',
        bgColor: 'bg-green-50 border-green-100',
        icon: <CheckCircleIcon className="w-4 h-4" />
      },
      {
        label: 'On Leave',
        value: '5',
        subtitle: 'Approved leaves',
        color: 'text-blue-700',
        bgColor: 'bg-blue-50 border-blue-100',
        icon: <ClockIcon className="w-4 h-4" />
      },
      {
        label: 'Late Arrivals',
        value: '3',
        subtitle: 'Today',
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-50 border-yellow-100',
        icon: <AlertTriangleIcon className="w-4 h-4" />
      },
      {
        label: 'Avg Attendance',
        value: '94.8%',
        subtitle: 'This month',
        color: 'text-purple-700',
        bgColor: 'bg-purple-50 border-purple-100',
        icon: <CalendarIcon className="w-4 h-4" />
      }]
      } />);


}