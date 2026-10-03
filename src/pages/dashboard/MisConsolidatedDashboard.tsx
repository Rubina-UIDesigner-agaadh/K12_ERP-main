import React, { useState, useMemo } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Users, GraduationCap, Wallet, TrendingUp, TrendingDown, UserCheck, UserX, Calendar,
  BookOpen, Bus, Building2, AlertCircle, CheckCircle, Clock, Award, Target, PieChart,
  BarChart3, ArrowUpRight, ArrowDownRight, IndianRupee, CalendarDays, Bell, FileText,
  ClipboardCheck, Star, Trophy, AlertTriangle, RefreshCcw, Download, ChevronRight, Eye,
  UserPlus, Home, Library, FlaskConical, Microscope, Laptop, Route, LayoutGrid, HelpCircle,
  Ticket, Send, Smartphone, Flame, FileCheck, ScrollText, AlertOctagon, ShieldCheck,
  MessageSquare, Heart, Briefcase, ChevronDown, CheckIcon, Filter } from
'lucide-react';

// ==================== TYPES ====================
interface BranchData {
  students: {total: number;boys: number;girls: number;newAdmissions: number;transfersOut: number;transfersIn: number;ews: number;rte: number;pwd: number;hostel: number;dayScholars: number;};
  academic: {passPercentage: number;distinctionPercentage: number;term1Pass: number;term2Pass: number;topClass: string;weakSubject: string;board10Pass: number;board12Pass: number;};
  attendance: {studentAttendance: number;staffAttendance: number;todayPresent: number;todayAbsent: number;below75Count: number;};
  financial: {feesCollected: number;pendingFees: number;collectionEfficiency: number;ewsPending: number;ewsReceived: number;scholarships: number;totalIncome: number;totalExpense: number;defaulters: number;};
  staff: {total: number;teaching: number;nonTeaching: number;male: number;female: number;permanent: number;contractual: number;attendance: number;turnover: number;};
  infrastructure: {classrooms: number;smartClassrooms: number;utilization: number;buses: number;activeBuses: number;busOccupancy: number;routes: number;transportStudents: number;libraryBooks: number;issuedBooks: number;overdueBooks: number;};
  compliance: {rteCompliance: number;rteRequired: number;rteFilled: number;rteShortfall: number;};
  communication: {smsSent: number;appEngagement: number;pendingComplaints: number;openTickets: number;};
}

// ==================== CONSTANTS ====================
const branches = [
{ id: 'main', name: 'Main Campus', color: 'blue' },
{ id: 'north', name: 'North Branch', color: 'emerald' },
{ id: 'south', name: 'South Branch', color: 'violet' },
{ id: 'east', name: 'East Branch', color: 'amber' }];


const batches = ['2024-25', '2023-24', '2022-23', '2021-22'];

const branchColors: Record<string, string> = { main: 'bg-blue-500', north: 'bg-emerald-500', south: 'bg-violet-500', east: 'bg-amber-500' };
const branchTextColors: Record<string, string> = { main: 'text-blue-600', north: 'text-emerald-600', south: 'text-violet-600', east: 'text-amber-600' };
const branchBgColors: Record<string, string> = { main: 'bg-blue-50', north: 'bg-emerald-50', south: 'bg-violet-50', east: 'bg-amber-50' };

// ==================== BRANCH-WISE DATA ====================
const branchWiseData: Record<string, Record<string, BranchData>> = {
  '2024-25': {
    main: {
      students: { total: 1250, boys: 655, girls: 595, newAdmissions: 175, transfersOut: 12, transfersIn: 8, ews: 125, rte: 125, pwd: 9, hostel: 140, dayScholars: 1110 },
      academic: { passPercentage: 95.2, distinctionPercentage: 16.5, term1Pass: 93.1, term2Pass: 95.2, topClass: '10-A', weakSubject: 'Mathematics', board10Pass: 98.2, board12Pass: 97.1 },
      attendance: { studentAttendance: 94.2, staffAttendance: 96.5, todayPresent: 1177, todayAbsent: 73, below75Count: 18 },
      financial: { feesCollected: 950000, pendingFees: 1350000, collectionEfficiency: 81.5, ewsPending: 250000, ewsReceived: 650000, scholarships: 165000, totalIncome: 6500000, totalExpense: 5100000, defaulters: 195 },
      staff: { total: 95, teaching: 52, nonTeaching: 43, male: 42, female: 53, permanent: 72, contractual: 23, attendance: 96.5, turnover: 7.8 },
      infrastructure: { classrooms: 24, smartClassrooms: 18, utilization: 93.5, buses: 9, activeBuses: 8, busOccupancy: 84.2, routes: 12, transportStudents: 610, libraryBooks: 13200, issuedBooks: 945, overdueBooks: 65 },
      compliance: { rteCompliance: 82.5, rteRequired: 313, rteFilled: 250, rteShortfall: 63 },
      communication: { smsSent: 4380, appEngagement: 74.5, pendingComplaints: 5, openTickets: 3 }
    },
    north: {
      students: { total: 520, boys: 275, girls: 245, newAdmissions: 72, transfersOut: 7, transfersIn: 3, ews: 52, rte: 52, pwd: 4, hostel: 58, dayScholars: 462 },
      academic: { passPercentage: 93.8, distinctionPercentage: 14.2, term1Pass: 91.5, term2Pass: 93.8, topClass: '9-B', weakSubject: 'Science', board10Pass: 97.5, board12Pass: 96.2 },
      attendance: { studentAttendance: 93.5, staffAttendance: 95.8, todayPresent: 486, todayAbsent: 34, below75Count: 12 },
      financial: { feesCollected: 385000, pendingFees: 545000, collectionEfficiency: 78.2, ewsPending: 105000, ewsReceived: 265000, scholarships: 68000, totalIncome: 2650000, totalExpense: 2080000, defaulters: 82 },
      staff: { total: 42, teaching: 22, nonTeaching: 20, male: 18, female: 24, permanent: 32, contractual: 10, attendance: 95.8, turnover: 9.2 },
      infrastructure: { classrooms: 11, smartClassrooms: 8, utilization: 91.2, buses: 4, activeBuses: 3, busOccupancy: 81.5, routes: 5, transportStudents: 248, libraryBooks: 5420, issuedBooks: 385, overdueBooks: 28 },
      compliance: { rteCompliance: 78.5, rteRequired: 130, rteFilled: 104, rteShortfall: 26 },
      communication: { smsSent: 1780, appEngagement: 71.2, pendingComplaints: 3, openTickets: 2 }
    },
    south: {
      students: { total: 420, boys: 225, girls: 195, newAdmissions: 58, transfersOut: 5, transfersIn: 2, ews: 42, rte: 42, pwd: 3, hostel: 45, dayScholars: 375 },
      academic: { passPercentage: 94.5, distinctionPercentage: 15.8, term1Pass: 92.2, term2Pass: 94.5, topClass: '10-B', weakSubject: 'Hindi', board10Pass: 97.8, board12Pass: 96.5 },
      attendance: { studentAttendance: 93.8, staffAttendance: 96.2, todayPresent: 394, todayAbsent: 26, below75Count: 9 },
      financial: { feesCollected: 315000, pendingFees: 445000, collectionEfficiency: 79.5, ewsPending: 85000, ewsReceived: 215000, scholarships: 55000, totalIncome: 2150000, totalExpense: 1690000, defaulters: 68 },
      staff: { total: 32, teaching: 16, nonTeaching: 16, male: 14, female: 18, permanent: 25, contractual: 7, attendance: 96.2, turnover: 8.5 },
      infrastructure: { classrooms: 9, smartClassrooms: 7, utilization: 92.8, buses: 3, activeBuses: 3, busOccupancy: 83.2, routes: 4, transportStudents: 198, libraryBooks: 4380, issuedBooks: 312, overdueBooks: 22 },
      compliance: { rteCompliance: 80.2, rteRequired: 105, rteFilled: 84, rteShortfall: 21 },
      communication: { smsSent: 1450, appEngagement: 72.8, pendingComplaints: 2, openTickets: 2 }
    },
    east: {
      students: { total: 260, boys: 130, girls: 130, newAdmissions: 37, transfersOut: 4, transfersIn: 2, ews: 26, rte: 26, pwd: 2, hostel: 27, dayScholars: 233 },
      academic: { passPercentage: 93.2, distinctionPercentage: 13.5, term1Pass: 90.8, term2Pass: 93.2, topClass: '8-A', weakSubject: 'Mathematics', board10Pass: 96.8, board12Pass: 95.5 },
      attendance: { studentAttendance: 92.8, staffAttendance: 95.2, todayPresent: 241, todayAbsent: 19, below75Count: 6 },
      financial: { feesCollected: 200000, pendingFees: 285000, collectionEfficiency: 76.8, ewsPending: 45000, ewsReceived: 120000, scholarships: 37000, totalIncome: 1200000, totalExpense: 930000, defaulters: 40 },
      staff: { total: 17, teaching: 8, nonTeaching: 9, male: 8, female: 9, permanent: 13, contractual: 4, attendance: 95.2, turnover: 10.5 },
      infrastructure: { classrooms: 4, smartClassrooms: 3, utilization: 89.5, buses: 2, activeBuses: 2, busOccupancy: 78.5, routes: 3, transportStudents: 124, libraryBooks: 2680, issuedBooks: 203, overdueBooks: 13 },
      compliance: { rteCompliance: 75.8, rteRequired: 65, rteFilled: 52, rteShortfall: 13 },
      communication: { smsSent: 930, appEngagement: 68.5, pendingComplaints: 2, openTickets: 1 }
    }
  },
  '2023-24': {
    main: {
      students: { total: 1180, boys: 618, girls: 562, newAdmissions: 165, transfersOut: 15, transfersIn: 10, ews: 118, rte: 118, pwd: 8, hostel: 132, dayScholars: 1048 },
      academic: { passPercentage: 94.5, distinctionPercentage: 15.2, term1Pass: 92.1, term2Pass: 94.5, topClass: '10-B', weakSubject: 'Science', board10Pass: 97.5, board12Pass: 96.2 },
      attendance: { studentAttendance: 93.5, staffAttendance: 95.8, todayPresent: 1103, todayAbsent: 77, below75Count: 22 },
      financial: { feesCollected: 880000, pendingFees: 1250000, collectionEfficiency: 79.2, ewsPending: 235000, ewsReceived: 600000, scholarships: 150000, totalIncome: 6000000, totalExpense: 4800000, defaulters: 185 },
      staff: { total: 90, teaching: 48, nonTeaching: 42, male: 40, female: 50, permanent: 68, contractual: 22, attendance: 95.8, turnover: 8.5 },
      infrastructure: { classrooms: 22, smartClassrooms: 16, utilization: 92.5, buses: 8, activeBuses: 7, busOccupancy: 82.5, routes: 11, transportStudents: 580, libraryBooks: 12500, issuedBooks: 890, overdueBooks: 72 },
      compliance: { rteCompliance: 80.5, rteRequired: 295, rteFilled: 236, rteShortfall: 59 },
      communication: { smsSent: 4050, appEngagement: 72.5, pendingComplaints: 6, openTickets: 4 }
    },
    north: {
      students: { total: 490, boys: 258, girls: 232, newAdmissions: 68, transfersOut: 8, transfersIn: 4, ews: 49, rte: 49, pwd: 4, hostel: 55, dayScholars: 435 },
      academic: { passPercentage: 92.8, distinctionPercentage: 13.5, term1Pass: 90.2, term2Pass: 92.8, topClass: '9-A', weakSubject: 'Mathematics', board10Pass: 96.8, board12Pass: 95.5 },
      attendance: { studentAttendance: 92.8, staffAttendance: 95.2, todayPresent: 455, todayAbsent: 35, below75Count: 14 },
      financial: { feesCollected: 355000, pendingFees: 510000, collectionEfficiency: 76.5, ewsPending: 98000, ewsReceived: 245000, scholarships: 62000, totalIncome: 2450000, totalExpense: 1950000, defaulters: 78 },
      staff: { total: 40, teaching: 21, nonTeaching: 19, male: 17, female: 23, permanent: 30, contractual: 10, attendance: 95.2, turnover: 10.0 },
      infrastructure: { classrooms: 10, smartClassrooms: 7, utilization: 90.5, buses: 4, activeBuses: 3, busOccupancy: 79.8, routes: 5, transportStudents: 235, libraryBooks: 5100, issuedBooks: 365, overdueBooks: 32 },
      compliance: { rteCompliance: 76.5, rteRequired: 123, rteFilled: 98, rteShortfall: 25 },
      communication: { smsSent: 1650, appEngagement: 69.5, pendingComplaints: 4, openTickets: 3 }
    },
    south: {
      students: { total: 395, boys: 210, girls: 185, newAdmissions: 52, transfersOut: 6, transfersIn: 3, ews: 40, rte: 40, pwd: 3, hostel: 42, dayScholars: 353 },
      academic: { passPercentage: 93.5, distinctionPercentage: 14.5, term1Pass: 91.2, term2Pass: 93.5, topClass: '10-A', weakSubject: 'Hindi', board10Pass: 97.2, board12Pass: 95.8 },
      attendance: { studentAttendance: 93.2, staffAttendance: 95.5, todayPresent: 368, todayAbsent: 27, below75Count: 11 },
      financial: { feesCollected: 290000, pendingFees: 415000, collectionEfficiency: 77.8, ewsPending: 78000, ewsReceived: 198000, scholarships: 50000, totalIncome: 1980000, totalExpense: 1580000, defaulters: 62 },
      staff: { total: 30, teaching: 15, nonTeaching: 15, male: 13, female: 17, permanent: 23, contractual: 7, attendance: 95.5, turnover: 9.2 },
      infrastructure: { classrooms: 8, smartClassrooms: 6, utilization: 91.5, buses: 3, activeBuses: 3, busOccupancy: 81.5, routes: 4, transportStudents: 185, libraryBooks: 4100, issuedBooks: 295, overdueBooks: 25 },
      compliance: { rteCompliance: 78.5, rteRequired: 99, rteFilled: 80, rteShortfall: 19 },
      communication: { smsSent: 1350, appEngagement: 70.2, pendingComplaints: 3, openTickets: 2 }
    },
    east: {
      students: { total: 240, boys: 120, girls: 120, newAdmissions: 33, transfersOut: 5, transfersIn: 2, ews: 24, rte: 24, pwd: 2, hostel: 25, dayScholars: 215 },
      academic: { passPercentage: 92.2, distinctionPercentage: 12.8, term1Pass: 89.5, term2Pass: 92.2, topClass: '8-B', weakSubject: 'Science', board10Pass: 95.8, board12Pass: 94.5 },
      attendance: { studentAttendance: 91.8, staffAttendance: 94.5, todayPresent: 220, todayAbsent: 20, below75Count: 8 },
      financial: { feesCollected: 180000, pendingFees: 260000, collectionEfficiency: 74.5, ewsPending: 42000, ewsReceived: 108000, scholarships: 32000, totalIncome: 1100000, totalExpense: 870000, defaulters: 38 },
      staff: { total: 16, teaching: 8, nonTeaching: 8, male: 7, female: 9, permanent: 12, contractual: 4, attendance: 94.5, turnover: 11.5 },
      infrastructure: { classrooms: 4, smartClassrooms: 2, utilization: 87.5, buses: 2, activeBuses: 2, busOccupancy: 76.5, routes: 3, transportStudents: 115, libraryBooks: 2450, issuedBooks: 185, overdueBooks: 15 },
      compliance: { rteCompliance: 73.5, rteRequired: 60, rteFilled: 48, rteShortfall: 12 },
      communication: { smsSent: 850, appEngagement: 66.5, pendingComplaints: 3, openTickets: 2 }
    }
  },
  '2022-23': {
    main: {
      students: { total: 1120, boys: 585, girls: 535, newAdmissions: 155, transfersOut: 18, transfersIn: 12, ews: 112, rte: 112, pwd: 7, hostel: 125, dayScholars: 995 },
      academic: { passPercentage: 93.8, distinctionPercentage: 14.5, term1Pass: 91.2, term2Pass: 93.8, topClass: '10-A', weakSubject: 'Hindi', board10Pass: 97.0, board12Pass: 95.5 },
      attendance: { studentAttendance: 92.8, staffAttendance: 95.2, todayPresent: 1039, todayAbsent: 81, below75Count: 25 },
      financial: { feesCollected: 820000, pendingFees: 1180000, collectionEfficiency: 77.5, ewsPending: 220000, ewsReceived: 550000, scholarships: 140000, totalIncome: 5500000, totalExpense: 4500000, defaulters: 175 },
      staff: { total: 85, teaching: 45, nonTeaching: 40, male: 38, female: 47, permanent: 65, contractual: 20, attendance: 95.2, turnover: 9.2 },
      infrastructure: { classrooms: 20, smartClassrooms: 14, utilization: 91.5, buses: 8, activeBuses: 7, busOccupancy: 80.5, routes: 10, transportStudents: 550, libraryBooks: 11800, issuedBooks: 850, overdueBooks: 78 },
      compliance: { rteCompliance: 78.5, rteRequired: 280, rteFilled: 224, rteShortfall: 56 },
      communication: { smsSent: 3800, appEngagement: 70.5, pendingComplaints: 7, openTickets: 5 }
    },
    north: {
      students: { total: 460, boys: 242, girls: 218, newAdmissions: 62, transfersOut: 9, transfersIn: 5, ews: 46, rte: 46, pwd: 3, hostel: 52, dayScholars: 408 },
      academic: { passPercentage: 91.8, distinctionPercentage: 12.8, term1Pass: 89.2, term2Pass: 91.8, topClass: '9-B', weakSubject: 'Science', board10Pass: 96.2, board12Pass: 94.8 },
      attendance: { studentAttendance: 92.0, staffAttendance: 94.8, todayPresent: 423, todayAbsent: 37, below75Count: 16 },
      financial: { feesCollected: 330000, pendingFees: 480000, collectionEfficiency: 74.8, ewsPending: 92000, ewsReceived: 228000, scholarships: 58000, totalIncome: 2280000, totalExpense: 1850000, defaulters: 75 },
      staff: { total: 38, teaching: 20, nonTeaching: 18, male: 16, female: 22, permanent: 28, contractual: 10, attendance: 94.8, turnover: 10.5 },
      infrastructure: { classrooms: 10, smartClassrooms: 6, utilization: 89.5, buses: 4, activeBuses: 3, busOccupancy: 78.2, routes: 5, transportStudents: 220, libraryBooks: 4800, issuedBooks: 345, overdueBooks: 35 },
      compliance: { rteCompliance: 74.5, rteRequired: 115, rteFilled: 92, rteShortfall: 23 },
      communication: { smsSent: 1520, appEngagement: 67.5, pendingComplaints: 5, openTickets: 3 }
    },
    south: {
      students: { total: 370, boys: 195, girls: 175, newAdmissions: 48, transfersOut: 7, transfersIn: 4, ews: 37, rte: 37, pwd: 2, hostel: 40, dayScholars: 330 },
      academic: { passPercentage: 92.5, distinctionPercentage: 13.8, term1Pass: 90.2, term2Pass: 92.5, topClass: '10-B', weakSubject: 'Mathematics', board10Pass: 96.5, board12Pass: 95.0 },
      attendance: { studentAttendance: 92.5, staffAttendance: 95.0, todayPresent: 342, todayAbsent: 28, below75Count: 12 },
      financial: { feesCollected: 268000, pendingFees: 390000, collectionEfficiency: 76.2, ewsPending: 72000, ewsReceived: 182000, scholarships: 46000, totalIncome: 1820000, totalExpense: 1480000, defaulters: 58 },
      staff: { total: 28, teaching: 14, nonTeaching: 14, male: 12, female: 16, permanent: 21, contractual: 7, attendance: 95.0, turnover: 9.8 },
      infrastructure: { classrooms: 7, smartClassrooms: 5, utilization: 90.2, buses: 3, activeBuses: 2, busOccupancy: 79.5, routes: 4, transportStudents: 172, libraryBooks: 3850, issuedBooks: 275, overdueBooks: 28 },
      compliance: { rteCompliance: 76.5, rteRequired: 93, rteFilled: 74, rteShortfall: 19 },
      communication: { smsSent: 1250, appEngagement: 68.2, pendingComplaints: 4, openTickets: 2 }
    },
    east: {
      students: { total: 220, boys: 110, girls: 110, newAdmissions: 30, transfersOut: 6, transfersIn: 2, ews: 22, rte: 22, pwd: 2, hostel: 23, dayScholars: 197 },
      academic: { passPercentage: 91.2, distinctionPercentage: 11.5, term1Pass: 88.5, term2Pass: 91.2, topClass: '8-A', weakSubject: 'Hindi', board10Pass: 95.0, board12Pass: 93.8 },
      attendance: { studentAttendance: 91.2, staffAttendance: 94.0, todayPresent: 201, todayAbsent: 19, below75Count: 9 },
      financial: { feesCollected: 165000, pendingFees: 240000, collectionEfficiency: 73.2, ewsPending: 38000, ewsReceived: 98000, scholarships: 28000, totalIncome: 1000000, totalExpense: 820000, defaulters: 35 },
      staff: { total: 15, teaching: 7, nonTeaching: 8, male: 7, female: 8, permanent: 11, contractual: 4, attendance: 94.0, turnover: 12.0 },
      infrastructure: { classrooms: 4, smartClassrooms: 2, utilization: 86.5, buses: 2, activeBuses: 1, busOccupancy: 74.5, routes: 2, transportStudents: 105, libraryBooks: 2250, issuedBooks: 170, overdueBooks: 18 },
      compliance: { rteCompliance: 71.5, rteRequired: 55, rteFilled: 44, rteShortfall: 11 },
      communication: { smsSent: 780, appEngagement: 64.5, pendingComplaints: 3, openTickets: 2 }
    }
  },
  '2021-22': {
    main: {
      students: { total: 1050, boys: 550, girls: 500, newAdmissions: 142, transfersOut: 20, transfersIn: 14, ews: 105, rte: 105, pwd: 6, hostel: 118, dayScholars: 932 },
      academic: { passPercentage: 92.5, distinctionPercentage: 13.8, term1Pass: 90.2, term2Pass: 92.5, topClass: '10-B', weakSubject: 'Science', board10Pass: 96.5, board12Pass: 94.8 },
      attendance: { studentAttendance: 91.8, staffAttendance: 94.5, todayPresent: 964, todayAbsent: 86, below75Count: 28 },
      financial: { feesCollected: 760000, pendingFees: 1100000, collectionEfficiency: 75.5, ewsPending: 205000, ewsReceived: 510000, scholarships: 128000, totalIncome: 5100000, totalExpense: 4200000, defaulters: 165 },
      staff: { total: 80, teaching: 42, nonTeaching: 38, male: 35, female: 45, permanent: 62, contractual: 18, attendance: 94.5, turnover: 10.0 },
      infrastructure: { classrooms: 18, smartClassrooms: 12, utilization: 90.5, buses: 7, activeBuses: 6, busOccupancy: 78.5, routes: 9, transportStudents: 520, libraryBooks: 11200, issuedBooks: 810, overdueBooks: 85 },
      compliance: { rteCompliance: 76.5, rteRequired: 263, rteFilled: 210, rteShortfall: 53 },
      communication: { smsSent: 3500, appEngagement: 68.5, pendingComplaints: 8, openTickets: 6 }
    },
    north: {
      students: { total: 430, boys: 225, girls: 205, newAdmissions: 58, transfersOut: 10, transfersIn: 6, ews: 43, rte: 43, pwd: 3, hostel: 48, dayScholars: 382 },
      academic: { passPercentage: 90.8, distinctionPercentage: 11.8, term1Pass: 88.2, term2Pass: 90.8, topClass: '9-A', weakSubject: 'Hindi', board10Pass: 95.5, board12Pass: 93.8 },
      attendance: { studentAttendance: 91.2, staffAttendance: 94.2, todayPresent: 392, todayAbsent: 38, below75Count: 18 },
      financial: { feesCollected: 305000, pendingFees: 450000, collectionEfficiency: 72.8, ewsPending: 85000, ewsReceived: 212000, scholarships: 54000, totalIncome: 2120000, totalExpense: 1750000, defaulters: 72 },
      staff: { total: 35, teaching: 18, nonTeaching: 17, male: 15, female: 20, permanent: 26, contractual: 9, attendance: 94.2, turnover: 11.2 },
      infrastructure: { classrooms: 9, smartClassrooms: 5, utilization: 88.5, buses: 3, activeBuses: 3, busOccupancy: 76.2, routes: 4, transportStudents: 205, libraryBooks: 4500, issuedBooks: 325, overdueBooks: 38 },
      compliance: { rteCompliance: 72.5, rteRequired: 108, rteFilled: 86, rteShortfall: 22 },
      communication: { smsSent: 1420, appEngagement: 65.5, pendingComplaints: 5, openTickets: 4 }
    },
    south: {
      students: { total: 345, boys: 182, girls: 163, newAdmissions: 44, transfersOut: 8, transfersIn: 5, ews: 35, rte: 35, pwd: 2, hostel: 37, dayScholars: 308 },
      academic: { passPercentage: 91.5, distinctionPercentage: 12.5, term1Pass: 89.2, term2Pass: 91.5, topClass: '10-A', weakSubject: 'Mathematics', board10Pass: 95.8, board12Pass: 94.2 },
      attendance: { studentAttendance: 91.8, staffAttendance: 94.5, todayPresent: 317, todayAbsent: 28, below75Count: 14 },
      financial: { feesCollected: 248000, pendingFees: 365000, collectionEfficiency: 74.5, ewsPending: 68000, ewsReceived: 168000, scholarships: 42000, totalIncome: 1680000, totalExpense: 1380000, defaulters: 55 },
      staff: { total: 26, teaching: 13, nonTeaching: 13, male: 11, female: 15, permanent: 20, contractual: 6, attendance: 94.5, turnover: 10.2 },
      infrastructure: { classrooms: 7, smartClassrooms: 4, utilization: 89.2, buses: 2, activeBuses: 2, busOccupancy: 77.5, routes: 3, transportStudents: 160, libraryBooks: 3600, issuedBooks: 258, overdueBooks: 30 },
      compliance: { rteCompliance: 74.5, rteRequired: 86, rteFilled: 70, rteShortfall: 16 },
      communication: { smsSent: 1150, appEngagement: 66.2, pendingComplaints: 4, openTickets: 3 }
    },
    east: {
      students: { total: 200, boys: 100, girls: 100, newAdmissions: 27, transfersOut: 7, transfersIn: 3, ews: 20, rte: 20, pwd: 1, hostel: 21, dayScholars: 179 },
      academic: { passPercentage: 90.2, distinctionPercentage: 10.5, term1Pass: 87.5, term2Pass: 90.2, topClass: '8-B', weakSubject: 'Science', board10Pass: 94.2, board12Pass: 92.8 },
      attendance: { studentAttendance: 90.5, staffAttendance: 93.5, todayPresent: 181, todayAbsent: 19, below75Count: 10 },
      financial: { feesCollected: 150000, pendingFees: 220000, collectionEfficiency: 71.5, ewsPending: 35000, ewsReceived: 88000, scholarships: 25000, totalIncome: 920000, totalExpense: 770000, defaulters: 32 },
      staff: { total: 14, teaching: 7, nonTeaching: 7, male: 6, female: 8, permanent: 10, contractual: 4, attendance: 93.5, turnover: 12.8 },
      infrastructure: { classrooms: 3, smartClassrooms: 2, utilization: 85.5, buses: 2, activeBuses: 1, busOccupancy: 72.5, routes: 2, transportStudents: 95, libraryBooks: 2100, issuedBooks: 158, overdueBooks: 20 },
      compliance: { rteCompliance: 69.5, rteRequired: 50, rteFilled: 40, rteShortfall: 10 },
      communication: { smsSent: 720, appEngagement: 62.5, pendingComplaints: 4, openTickets: 3 }
    }
  }
};

// ==================== HELPER FUNCTIONS ====================
const formatCurrency = (amount: number) => amount >= 10000000 ? `₹${(amount / 10000000).toFixed(2)} Cr` : amount >= 100000 ? `₹${(amount / 100000).toFixed(2)} L` : amount >= 1000 ? `₹${(amount / 1000).toFixed(1)} K` : `₹${amount}`;

const sections = [
{ id: 'overview', label: 'Student Overview', icon: GraduationCap },
{ id: 'academic', label: 'Academic Performance', icon: Award },
{ id: 'attendance', label: 'Attendance Analytics', icon: UserCheck },
{ id: 'financial', label: 'Financial Summary', icon: Wallet },
{ id: 'staff', label: 'Staff Analytics', icon: Users },
{ id: 'compliance', label: 'Compliance & Alerts', icon: ShieldCheck },
{ id: 'communication', label: 'Communication', icon: MessageSquare },
{ id: 'infrastructure', label: 'Infrastructure', icon: Building2 }];


export function MisConsolidatedDashboard() {
  const [selectedBatch, setSelectedBatch] = useState(batches[0]);
  const [selectedBranches, setSelectedBranches] = useState<string[]>(branches.map((b) => b.id));
  const [activeSection, setActiveSection] = useState('overview');
  const [showBatchDropdown, setShowBatchDropdown] = useState(false);
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);

  const filteredData = useMemo(() => {
    const batchData = branchWiseData[selectedBatch] || {};
    return selectedBranches.map((branchId) => ({ branch: branches.find((b) => b.id === branchId)!, data: batchData[branchId] })).filter((item) => item.branch && item.data);
  }, [selectedBranches, selectedBatch]);

  const totals = useMemo(() => {
    const initial: BranchData = {
      students: { total: 0, boys: 0, girls: 0, newAdmissions: 0, transfersOut: 0, transfersIn: 0, ews: 0, rte: 0, pwd: 0, hostel: 0, dayScholars: 0 },
      academic: { passPercentage: 0, distinctionPercentage: 0, term1Pass: 0, term2Pass: 0, topClass: '', weakSubject: '', board10Pass: 0, board12Pass: 0 },
      attendance: { studentAttendance: 0, staffAttendance: 0, todayPresent: 0, todayAbsent: 0, below75Count: 0 },
      financial: { feesCollected: 0, pendingFees: 0, collectionEfficiency: 0, ewsPending: 0, ewsReceived: 0, scholarships: 0, totalIncome: 0, totalExpense: 0, defaulters: 0 },
      staff: { total: 0, teaching: 0, nonTeaching: 0, male: 0, female: 0, permanent: 0, contractual: 0, attendance: 0, turnover: 0 },
      infrastructure: { classrooms: 0, smartClassrooms: 0, utilization: 0, buses: 0, activeBuses: 0, busOccupancy: 0, routes: 0, transportStudents: 0, libraryBooks: 0, issuedBooks: 0, overdueBooks: 0 },
      compliance: { rteCompliance: 0, rteRequired: 0, rteFilled: 0, rteShortfall: 0 },
      communication: { smsSent: 0, appEngagement: 0, pendingComplaints: 0, openTickets: 0 }
    };
    if (filteredData.length === 0) return initial;

    filteredData.forEach(({ data }) => {
      Object.keys(data.students).forEach((k) => {initial.students[k as keyof typeof initial.students] += data.students[k as keyof typeof data.students] as number;});
      Object.keys(data.attendance).forEach((k) => {initial.attendance[k as keyof typeof initial.attendance] += data.attendance[k as keyof typeof data.attendance];});
      Object.keys(data.financial).forEach((k) => {initial.financial[k as keyof typeof initial.financial] += data.financial[k as keyof typeof data.financial];});
      Object.keys(data.staff).forEach((k) => {if (typeof initial.staff[k as keyof typeof initial.staff] === 'number') initial.staff[k as keyof typeof initial.staff] += data.staff[k as keyof typeof data.staff] as number;});
      Object.keys(data.infrastructure).forEach((k) => {initial.infrastructure[k as keyof typeof initial.infrastructure] += data.infrastructure[k as keyof typeof data.infrastructure];});
      Object.keys(data.compliance).forEach((k) => {initial.compliance[k as keyof typeof initial.compliance] += data.compliance[k as keyof typeof data.compliance];});
      Object.keys(data.communication).forEach((k) => {initial.communication[k as keyof typeof initial.communication] += data.communication[k as keyof typeof data.communication];});
      initial.academic.passPercentage += data.academic.passPercentage;
      initial.academic.distinctionPercentage += data.academic.distinctionPercentage;
      initial.academic.board10Pass += data.academic.board10Pass;
      initial.academic.board12Pass += data.academic.board12Pass;
    });

    const count = filteredData.length;
    initial.academic.passPercentage = +(initial.academic.passPercentage / count).toFixed(1);
    initial.academic.distinctionPercentage = +(initial.academic.distinctionPercentage / count).toFixed(1);
    initial.academic.board10Pass = +(initial.academic.board10Pass / count).toFixed(1);
    initial.academic.board12Pass = +(initial.academic.board12Pass / count).toFixed(1);
    initial.attendance.studentAttendance = +(initial.attendance.studentAttendance / count).toFixed(1);
    initial.attendance.staffAttendance = +(initial.attendance.staffAttendance / count).toFixed(1);
    initial.financial.collectionEfficiency = +(initial.financial.collectionEfficiency / count).toFixed(1);
    initial.staff.attendance = +(initial.staff.attendance / count).toFixed(1);
    initial.staff.turnover = +(initial.staff.turnover / count).toFixed(1);
    initial.infrastructure.utilization = +(initial.infrastructure.utilization / count).toFixed(1);
    initial.infrastructure.busOccupancy = +(initial.infrastructure.busOccupancy / count).toFixed(1);
    initial.compliance.rteCompliance = +(initial.compliance.rteCompliance / count).toFixed(1);
    initial.communication.appEngagement = +(initial.communication.appEngagement / count).toFixed(1);

    return initial;
  }, [filteredData]);

  const toggleBranch = (branchId: string) => setSelectedBranches((prev) => prev.includes(branchId) ? prev.filter((id) => id !== branchId) : [...prev, branchId]);

  // ==================== RENDER COMPONENTS ====================
  const BranchComparisonTable = ({ title, icon: Icon, data }: {title: string;icon: any;data: {label: string;key: string;format?: (v: any) => string;getValue: (d: BranchData) => any;}[];}) =>
  <Card className="p-5">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Icon className="w-5 h-5 text-blue-500" />{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Metric</th>
              {filteredData.map(({ branch }) =>
            <th key={branch.id} className="text-right py-3 px-2 font-semibold">
                  <div className="flex items-center justify-end gap-2">
                    <span className={`w-3 h-3 rounded-full ${branchColors[branch.id]}`} />
                    <span className="text-gray-700 text-xs">{branch.name}</span>
                  </div>
                </th>
            )}
              {selectedBranches.length > 1 && <th className="text-right py-3 px-2 font-semibold text-blue-600">Total/Avg</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) =>
          <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 px-2 font-medium text-gray-700">{row.label}</td>
                {filteredData.map(({ branch, data: d }) =>
            <td key={branch.id} className="text-right py-3 px-2 font-semibold text-gray-900">{row.format ? row.format(row.getValue(d)) : row.getValue(d)}</td>
            )}
                {selectedBranches.length > 1 && <td className="text-right py-3 px-2 font-bold text-blue-600">{row.format ? row.format(row.getValue(totals)) : row.getValue(totals)}</td>}
              </tr>
          )}
          </tbody>
        </table>
      </div>
    </Card>;


  const KPICard = ({ title, value, subtitle, icon: Icon, gradient }: {title: string;value: string | number;subtitle: string;icon: any;gradient: string;}) =>
  <Card className={`p-6 ${gradient} text-white border-none`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-white/80 text-sm">{title}</p>
          <h2 className="text-3xl font-bold mt-1">{value}</h2>
          <p className="text-sm mt-2 text-white/80">{subtitle}</p>
        </div>
        <div className="p-3 bg-white/20 rounded-xl"><Icon className="w-7 h-7" /></div>
      </div>
    </Card>;


  const BranchBarChart = ({ title, icon: Icon, getValue, formatValue, color = 'blue' }: {title: string;icon: any;getValue: (d: BranchData) => number;formatValue?: (v: number) => string;color?: string;}) =>
  <Card className="p-5">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Icon className="w-5 h-5 text-blue-500" />{title}</h3>
      <div className="space-y-3">
        {filteredData.map(({ branch, data }) => {
        const value = getValue(data);
        const maxValue = Math.max(...filteredData.map((d) => getValue(d.data)));
        const percent = maxValue > 0 ? value / maxValue * 100 : 0;
        return (
          <div key={branch.id}>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${branchColors[branch.id]}`} />{branch.name}</span>
                <span className="font-medium">{formatValue ? formatValue(value) : value}</span>
              </div>
              <div className="h-6 bg-gray-100 rounded-lg overflow-hidden">
                <div className={`h-full ${branchColors[branch.id]} rounded-lg transition-all flex items-center justify-end pr-2`} style={{ width: `${percent}%` }}>
                  {percent > 20 && <span className="text-xs text-white font-medium">{typeof value === 'number' && value % 1 !== 0 ? value.toFixed(1) : value}</span>}
                </div>
              </div>
            </div>);

      })}
      </div>
      {selectedBranches.length > 1 &&
    <div className="mt-4 pt-4 border-t text-center">
          <span className="text-sm text-gray-500">Total: <span className="font-bold text-gray-900">{formatValue ? formatValue(getValue(totals)) : getValue(totals)}</span></span>
        </div>
    }
    </Card>;


  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">MIS Consolidated Dashboard</h1>
          <p className="text-gray-500 mt-1">Academic Year {selectedBatch} • Last updated: {new Date().toLocaleString()}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {/* Batch Dropdown */}
          <div className="relative">
            <button onClick={() => {setShowBatchDropdown(!showBatchDropdown);setShowBranchDropdown(false);}} className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
              <CalendarDays className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">{selectedBatch}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {showBatchDropdown &&
            <div className="absolute top-full mt-1 right-0 bg-white border rounded-lg shadow-lg z-20 min-w-[140px]">
                {batches.map((batch) =>
              <button key={batch} onClick={() => {setSelectedBatch(batch);setShowBatchDropdown(false);}}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${selectedBatch === batch ? 'bg-blue-50 text-blue-600' : ''}`}>{batch}</button>
              )}
              </div>
            }
          </div>
          {/* Branch Dropdown */}
          <div className="relative">
            <button onClick={() => {setShowBranchDropdown(!showBranchDropdown);setShowBatchDropdown(false);}} className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
              <Building2 className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">{selectedBranches.length === branches.length ? 'All Branches' : `${selectedBranches.length} Branch${selectedBranches.length > 1 ? 'es' : ''}`}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {showBranchDropdown &&
            <div className="absolute top-full mt-1 right-0 bg-white border rounded-lg shadow-lg z-20 min-w-[180px]">
                <button onClick={() => setSelectedBranches(branches.map((b) => b.id))} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 border-b flex items-center gap-2">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedBranches.length === branches.length ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                    {selectedBranches.length === branches.length && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>All Branches
                </button>
                {branches.map((branch) =>
              <button key={branch.id} onClick={() => toggleBranch(branch.id)} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedBranches.includes(branch.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                      {selectedBranches.includes(branch.id) && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`w-2 h-2 rounded-full ${branchColors[branch.id]}`} />{branch.name}
                  </button>
              )}
              </div>
            }
          </div>
          <Button variant="outline" size="sm"><RefreshCcw className="w-4 h-4 mr-2" />Refresh</Button>
          <Button variant="primary" size="sm"><Download className="w-4 h-4 mr-2" />Export</Button>
        </div>
      </div>

      {/* Selected Filters Display */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-500">Showing:</span>
        <Badge variant="primary">{selectedBatch}</Badge>
        {selectedBranches.map((branchId) => {
          const branch = branches.find((b) => b.id === branchId);
          return branch && <Badge key={branchId} variant="secondary" className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${branchColors[branchId]}`} />{branch.name}</Badge>;
        })}
      </div>

      {/* Section Navigation */}
      <Card className="p-2">
        <div className="flex flex-wrap gap-2">
          {sections.map((section) =>
          <button key={section.id} onClick={() => setActiveSection(section.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeSection === section.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              <section.icon className="w-4 h-4" />{section.label}
            </button>
          )}
        </div>
      </Card>

      {selectedBranches.length === 0 ?
      <Card className="p-12 text-center"><AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" /><p className="text-gray-500">Please select at least one branch to view data.</p></Card> :

      <>
          {/* ==================== SECTION 1: STUDENT OVERVIEW ==================== */}
          {activeSection === 'overview' &&
        <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard title="Total Students" value={totals.students.total.toLocaleString()} subtitle={`Boys: ${totals.students.boys} | Girls: ${totals.students.girls}`} icon={GraduationCap} gradient="bg-gradient-to-br from-blue-500 to-blue-600" />
                <KPICard title="New Admissions" value={totals.students.newAdmissions} subtitle={`Transfers In: +${totals.students.transfersIn}`} icon={UserPlus} gradient="bg-gradient-to-br from-green-500 to-green-600" />
                <KPICard title="Transfers Out" value={totals.students.transfersOut} subtitle={`Net Change: ${totals.students.transfersIn - totals.students.transfersOut > 0 ? '+' : ''}${totals.students.transfersIn - totals.students.transfersOut}`} icon={TrendingDown} gradient="bg-gradient-to-br from-orange-500 to-orange-600" />
                <KPICard title="EWS/RTE Students" value={totals.students.ews + totals.students.rte} subtitle={`PwD: ${totals.students.pwd}`} icon={ShieldCheck} gradient="bg-gradient-to-br from-purple-500 to-purple-600" />
              </div>

              <BranchComparisonTable title="Student Distribution by Branch" icon={GraduationCap} data={[
          { label: 'Total Students', key: 'total', getValue: (d) => d.students.total },
          { label: 'Boys', key: 'boys', getValue: (d) => d.students.boys },
          { label: 'Girls', key: 'girls', getValue: (d) => d.students.girls },
          { label: 'New Admissions', key: 'newAdmissions', getValue: (d) => d.students.newAdmissions },
          { label: 'EWS Students', key: 'ews', getValue: (d) => d.students.ews },
          { label: 'RTE Students', key: 'rte', getValue: (d) => d.students.rte },
          { label: 'Hostelers', key: 'hostel', getValue: (d) => d.students.hostel },
          { label: 'Day Scholars', key: 'dayScholars', getValue: (d) => d.students.dayScholars }]
          } />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BranchBarChart title="Student Strength by Branch" icon={Users} getValue={(d) => d.students.total} />
                <BranchBarChart title="New Admissions by Branch" icon={UserPlus} getValue={(d) => d.students.newAdmissions} />
              </div>

              <Card className="p-5">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><PieChart className="w-5 h-5 text-blue-500" />Gender Distribution by Branch</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredData.map(({ branch, data }) =>
              <div key={branch.id} className={`p-4 rounded-lg ${branchBgColors[branch.id]}`}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`w-3 h-3 rounded-full ${branchColors[branch.id]}`} />
                        <span className="font-semibold text-gray-900">{branch.name}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <div className="text-center"><p className="text-xl font-bold text-blue-600">{data.students.boys}</p><p className="text-xs text-gray-500">Boys</p></div>
                        <div className="text-center"><p className="text-xl font-bold text-pink-600">{data.students.girls}</p><p className="text-xs text-gray-500">Girls</p></div>
                      </div>
                      <div className="flex gap-1 h-3">
                        <div className="bg-blue-500 rounded-l" style={{ width: `${data.students.boys / data.students.total * 100}%` }} />
                        <div className="bg-pink-500 rounded-r" style={{ width: `${data.students.girls / data.students.total * 100}%` }} />
                      </div>
                    </div>
              )}
                </div>
              </Card>
            </div>
        }

          {/* ==================== SECTION 2: ACADEMIC PERFORMANCE ==================== */}
          {activeSection === 'academic' &&
        <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard title="Overall Pass %" value={`${totals.academic.passPercentage}%`} subtitle="Across all branches" icon={Award} gradient="bg-gradient-to-br from-green-500 to-green-600" />
                <KPICard title="Distinction %" value={`${totals.academic.distinctionPercentage}%`} subtitle="Average across branches" icon={Trophy} gradient="bg-gradient-to-br from-purple-500 to-purple-600" />
                <KPICard title="Class 10 Pass %" value={`${totals.academic.board10Pass}%`} subtitle="Board Results" icon={Star} gradient="bg-gradient-to-br from-blue-500 to-blue-600" />
                <KPICard title="Class 12 Pass %" value={`${totals.academic.board12Pass}%`} subtitle="Board Results" icon={GraduationCap} gradient="bg-gradient-to-br from-indigo-500 to-indigo-600" />
              </div>

              <BranchComparisonTable title="Academic Performance by Branch" icon={Award} data={[
          { label: 'Pass Percentage', key: 'passPercentage', getValue: (d) => `${d.academic.passPercentage}%` },
          { label: 'Distinction %', key: 'distinctionPercentage', getValue: (d) => `${d.academic.distinctionPercentage}%` },
          { label: 'Term 1 Pass Rate', key: 'term1Pass', getValue: (d) => `${d.academic.term1Pass}%` },
          { label: 'Term 2 Pass Rate', key: 'term2Pass', getValue: (d) => `${d.academic.term2Pass}%` },
          { label: 'Class 10 Board Pass', key: 'board10Pass', getValue: (d) => `${d.academic.board10Pass}%` },
          { label: 'Class 12 Board Pass', key: 'board12Pass', getValue: (d) => `${d.academic.board12Pass}%` },
          { label: 'Top Performing Class', key: 'topClass', getValue: (d) => d.academic.topClass },
          { label: 'Weak Subject', key: 'weakSubject', getValue: (d) => d.academic.weakSubject }]
          } />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BranchBarChart title="Pass Percentage by Branch" icon={Award} getValue={(d) => d.academic.passPercentage} formatValue={(v) => `${v}%`} />
                <BranchBarChart title="Distinction Percentage by Branch" icon={Trophy} getValue={(d) => d.academic.distinctionPercentage} formatValue={(v) => `${v}%`} />
              </div>
            </div>
        }

          {/* ==================== SECTION 3: ATTENDANCE ANALYTICS ==================== */}
          {activeSection === 'attendance' &&
        <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard title="Student Attendance" value={`${totals.attendance.studentAttendance}%`} subtitle={`Present Today: ${totals.attendance.todayPresent}`} icon={UserCheck} gradient="bg-gradient-to-br from-green-500 to-green-600" />
                <KPICard title="Staff Attendance" value={`${totals.attendance.staffAttendance}%`} subtitle="Average across branches" icon={Users} gradient="bg-gradient-to-br from-blue-500 to-blue-600" />
                <KPICard title="Absent Today" value={totals.attendance.todayAbsent} subtitle="Students absent" icon={UserX} gradient="bg-gradient-to-br from-red-500 to-red-600" />
                <KPICard title="Below 75% Alert" value={totals.attendance.below75Count} subtitle="Students at risk" icon={AlertTriangle} gradient="bg-gradient-to-br from-orange-500 to-orange-600" />
              </div>

              <BranchComparisonTable title="Attendance Summary by Branch" icon={UserCheck} data={[
          { label: 'Student Attendance %', key: 'studentAttendance', getValue: (d) => `${d.attendance.studentAttendance}%` },
          { label: 'Staff Attendance %', key: 'staffAttendance', getValue: (d) => `${d.attendance.staffAttendance}%` },
          { label: 'Present Today', key: 'todayPresent', getValue: (d) => d.attendance.todayPresent },
          { label: 'Absent Today', key: 'todayAbsent', getValue: (d) => d.attendance.todayAbsent },
          { label: 'Below 75% Count', key: 'below75Count', getValue: (d) => d.attendance.below75Count }]
          } />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BranchBarChart title="Student Attendance by Branch" icon={UserCheck} getValue={(d) => d.attendance.studentAttendance} formatValue={(v) => `${v}%`} />
                <BranchBarChart title="Staff Attendance by Branch" icon={Users} getValue={(d) => d.attendance.staffAttendance} formatValue={(v) => `${v}%`} />
              </div>
            </div>
        }

          {/* ==================== SECTION 4: FINANCIAL SUMMARY ==================== */}
          {activeSection === 'financial' &&
        <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard title="Fees Collected" value={formatCurrency(totals.financial.feesCollected)} subtitle={`Total Income: ${formatCurrency(totals.financial.totalIncome)}`} icon={IndianRupee} gradient="bg-gradient-to-br from-green-500 to-green-600" />
                <KPICard title="Pending Fees" value={formatCurrency(totals.financial.pendingFees)} subtitle={`${totals.financial.defaulters} defaulters`} icon={AlertCircle} gradient="bg-gradient-to-br from-red-500 to-red-600" />
                <KPICard title="Collection Efficiency" value={`${totals.financial.collectionEfficiency}%`} subtitle="Average across branches" icon={Target} gradient="bg-gradient-to-br from-blue-500 to-blue-600" />
                <KPICard title="Scholarships" value={formatCurrency(totals.financial.scholarships)} subtitle="Disbursed this year" icon={Award} gradient="bg-gradient-to-br from-purple-500 to-purple-600" />
              </div>

              <BranchComparisonTable title="Financial Summary by Branch" icon={Wallet} data={[
          { label: 'Fees Collected', key: 'feesCollected', getValue: (d) => d.financial.feesCollected, format: formatCurrency },
          { label: 'Pending Fees', key: 'pendingFees', getValue: (d) => d.financial.pendingFees, format: formatCurrency },
          { label: 'Collection Efficiency', key: 'collectionEfficiency', getValue: (d) => `${d.financial.collectionEfficiency}%` },
          { label: 'EWS Pending', key: 'ewsPending', getValue: (d) => d.financial.ewsPending, format: formatCurrency },
          { label: 'EWS Received', key: 'ewsReceived', getValue: (d) => d.financial.ewsReceived, format: formatCurrency },
          { label: 'Scholarships', key: 'scholarships', getValue: (d) => d.financial.scholarships, format: formatCurrency },
          { label: 'Total Income', key: 'totalIncome', getValue: (d) => d.financial.totalIncome, format: formatCurrency },
          { label: 'Total Expense', key: 'totalExpense', getValue: (d) => d.financial.totalExpense, format: formatCurrency },
          { label: 'Fee Defaulters', key: 'defaulters', getValue: (d) => d.financial.defaulters }]
          } />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BranchBarChart title="Fees Collected by Branch" icon={IndianRupee} getValue={(d) => d.financial.feesCollected} formatValue={formatCurrency} />
                <BranchBarChart title="Pending Fees by Branch" icon={AlertCircle} getValue={(d) => d.financial.pendingFees} formatValue={formatCurrency} />
              </div>
            </div>
        }

          {/* ==================== SECTION 5: STAFF ANALYTICS ==================== */}
          {activeSection === 'staff' &&
        <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard title="Teaching Staff" value={totals.staff.teaching} subtitle={`Total: ${totals.staff.total}`} icon={GraduationCap} gradient="bg-gradient-to-br from-blue-500 to-blue-600" />
                <KPICard title="Non-Teaching" value={totals.staff.nonTeaching} subtitle={`Contractual: ${totals.staff.contractual}`} icon={Briefcase} gradient="bg-gradient-to-br from-purple-500 to-purple-600" />
                <KPICard title="Staff Attendance" value={`${totals.staff.attendance}%`} subtitle="Average today" icon={UserCheck} gradient="bg-gradient-to-br from-green-500 to-green-600" />
                <KPICard title="Turnover Rate" value={`${totals.staff.turnover}%`} subtitle="Average across branches" icon={TrendingDown} gradient="bg-gradient-to-br from-orange-500 to-orange-600" />
              </div>

              <BranchComparisonTable title="Staff Analytics by Branch" icon={Users} data={[
          { label: 'Total Staff', key: 'total', getValue: (d) => d.staff.total },
          { label: 'Teaching Staff', key: 'teaching', getValue: (d) => d.staff.teaching },
          { label: 'Non-Teaching', key: 'nonTeaching', getValue: (d) => d.staff.nonTeaching },
          { label: 'Male', key: 'male', getValue: (d) => d.staff.male },
          { label: 'Female', key: 'female', getValue: (d) => d.staff.female },
          { label: 'Permanent', key: 'permanent', getValue: (d) => d.staff.permanent },
          { label: 'Contractual', key: 'contractual', getValue: (d) => d.staff.contractual },
          { label: 'Attendance %', key: 'attendance', getValue: (d) => `${d.staff.attendance}%` },
          { label: 'Turnover %', key: 'turnover', getValue: (d) => `${d.staff.turnover}%` }]
          } />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BranchBarChart title="Staff Strength by Branch" icon={Users} getValue={(d) => d.staff.total} />
                <BranchBarChart title="Teaching Staff by Branch" icon={GraduationCap} getValue={(d) => d.staff.teaching} />
              </div>
            </div>
        }

          {/* ==================== SECTION 6: COMPLIANCE ==================== */}
          {activeSection === 'compliance' &&
        <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard title="RTE Compliance" value={`${totals.compliance.rteCompliance}%`} subtitle="Average across branches" icon={ShieldCheck} gradient="bg-gradient-to-br from-blue-500 to-blue-600" />
                <KPICard title="Required Seats" value={totals.compliance.rteRequired} subtitle="25% reservation" icon={Target} gradient="bg-gradient-to-br from-purple-500 to-purple-600" />
                <KPICard title="Filled Seats" value={totals.compliance.rteFilled} subtitle="Currently enrolled" icon={CheckCircle} gradient="bg-gradient-to-br from-green-500 to-green-600" />
                <KPICard title="Shortfall" value={totals.compliance.rteShortfall} subtitle="Seats to fill" icon={AlertTriangle} gradient="bg-gradient-to-br from-red-500 to-red-600" />
              </div>

              <BranchComparisonTable title="RTE Compliance by Branch" icon={ShieldCheck} data={[
          { label: 'Compliance %', key: 'rteCompliance', getValue: (d) => `${d.compliance.rteCompliance}%` },
          { label: 'Required (25%)', key: 'rteRequired', getValue: (d) => d.compliance.rteRequired },
          { label: 'Currently Filled', key: 'rteFilled', getValue: (d) => d.compliance.rteFilled },
          { label: 'Shortfall', key: 'rteShortfall', getValue: (d) => d.compliance.rteShortfall }]
          } />

              <Card className="p-5">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-blue-500" />RTE Compliance Progress by Branch</h3>
                <div className="space-y-4">
                  {filteredData.map(({ branch, data }) =>
              <div key={branch.id}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="flex items-center gap-2"><span className={`w-3 h-3 rounded-full ${branchColors[branch.id]}`} />{branch.name}</span>
                        <span className={`font-bold ${data.compliance.rteCompliance >= 100 ? 'text-green-600' : data.compliance.rteCompliance >= 75 ? 'text-orange-600' : 'text-red-600'}`}>{data.compliance.rteCompliance}%</span>
                      </div>
                      <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${data.compliance.rteCompliance >= 100 ? 'bg-green-500' : data.compliance.rteCompliance >= 75 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${Math.min(data.compliance.rteCompliance, 100)}%` }} />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Filled: {data.compliance.rteFilled}</span>
                        <span>Required: {data.compliance.rteRequired}</span>
                        <span>Shortfall: {data.compliance.rteShortfall}</span>
                      </div>
                    </div>
              )}
                </div>
              </Card>
            </div>
        }

          {/* ==================== SECTION 7: COMMUNICATION ==================== */}
          {activeSection === 'communication' &&
        <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard title="SMS Sent" value={totals.communication.smsSent.toLocaleString()} subtitle="This month" icon={Send} gradient="bg-gradient-to-br from-blue-500 to-blue-600" />
                <KPICard title="App Engagement" value={`${totals.communication.appEngagement}%`} subtitle="Parent app usage" icon={Smartphone} gradient="bg-gradient-to-br from-green-500 to-green-600" />
                <KPICard title="Pending Complaints" value={totals.communication.pendingComplaints} subtitle="Awaiting resolution" icon={HelpCircle} gradient="bg-gradient-to-br from-orange-500 to-orange-600" />
                <KPICard title="Open Tickets" value={totals.communication.openTickets} subtitle="Support tickets" icon={Ticket} gradient="bg-gradient-to-br from-purple-500 to-purple-600" />
              </div>

              <BranchComparisonTable title="Communication Stats by Branch" icon={MessageSquare} data={[
          { label: 'SMS Sent', key: 'smsSent', getValue: (d) => d.communication.smsSent.toLocaleString() },
          { label: 'App Engagement %', key: 'appEngagement', getValue: (d) => `${d.communication.appEngagement}%` },
          { label: 'Pending Complaints', key: 'pendingComplaints', getValue: (d) => d.communication.pendingComplaints },
          { label: 'Open Tickets', key: 'openTickets', getValue: (d) => d.communication.openTickets }]
          } />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BranchBarChart title="SMS Sent by Branch" icon={Send} getValue={(d) => d.communication.smsSent} />
                <BranchBarChart title="App Engagement by Branch" icon={Smartphone} getValue={(d) => d.communication.appEngagement} formatValue={(v) => `${v}%`} />
              </div>
            </div>
        }

          {/* ==================== SECTION 8: INFRASTRUCTURE ==================== */}
          {activeSection === 'infrastructure' &&
        <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard title="Classroom Utilization" value={`${totals.infrastructure.utilization}%`} subtitle={`${totals.infrastructure.smartClassrooms}/${totals.infrastructure.classrooms} Smart`} icon={LayoutGrid} gradient="bg-gradient-to-br from-blue-500 to-blue-600" />
                <KPICard title="Bus Occupancy" value={`${totals.infrastructure.busOccupancy}%`} subtitle={`${totals.infrastructure.activeBuses}/${totals.infrastructure.buses} active`} icon={Bus} gradient="bg-gradient-to-br from-green-500 to-green-600" />
                <KPICard title="Transport Routes" value={totals.infrastructure.routes} subtitle={`${totals.infrastructure.transportStudents} students`} icon={Route} gradient="bg-gradient-to-br from-purple-500 to-purple-600" />
                <KPICard title="Library Books" value={totals.infrastructure.libraryBooks.toLocaleString()} subtitle={`${totals.infrastructure.overdueBooks} overdue`} icon={Library} gradient="bg-gradient-to-br from-orange-500 to-orange-600" />
              </div>

              <BranchComparisonTable title="Infrastructure Summary by Branch" icon={Building2} data={[
          { label: 'Classrooms', key: 'classrooms', getValue: (d) => d.infrastructure.classrooms },
          { label: 'Smart Classrooms', key: 'smartClassrooms', getValue: (d) => d.infrastructure.smartClassrooms },
          { label: 'Utilization %', key: 'utilization', getValue: (d) => `${d.infrastructure.utilization}%` },
          { label: 'Buses', key: 'buses', getValue: (d) => d.infrastructure.buses },
          { label: 'Active Buses', key: 'activeBuses', getValue: (d) => d.infrastructure.activeBuses },
          { label: 'Bus Occupancy %', key: 'busOccupancy', getValue: (d) => `${d.infrastructure.busOccupancy}%` },
          { label: 'Routes', key: 'routes', getValue: (d) => d.infrastructure.routes },
          { label: 'Transport Students', key: 'transportStudents', getValue: (d) => d.infrastructure.transportStudents },
          { label: 'Library Books', key: 'libraryBooks', getValue: (d) => d.infrastructure.libraryBooks.toLocaleString() },
          { label: 'Issued Books', key: 'issuedBooks', getValue: (d) => d.infrastructure.issuedBooks },
          { label: 'Overdue Books', key: 'overdueBooks', getValue: (d) => d.infrastructure.overdueBooks }]
          } />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BranchBarChart title="Classroom Utilization by Branch" icon={LayoutGrid} getValue={(d) => d.infrastructure.utilization} formatValue={(v) => `${v}%`} />
                <BranchBarChart title="Bus Occupancy by Branch" icon={Bus} getValue={(d) => d.infrastructure.busOccupancy} formatValue={(v) => `${v}%`} />
              </div>
            </div>
        }
        </>
      }
    </div>);

}

export default MisConsolidatedDashboard;