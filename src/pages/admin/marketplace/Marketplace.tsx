import React, { useState } from 'react'
import {
  LayoutDashboard,
  Users,
  Wallet,
  Briefcase,
  ClipboardList,
  Shield,
  Grid,
  User,
  Puzzle,
  Package,
  CheckCircle2,
  XCircle,
  Store,
  Search,
  Star,
  Zap,
  Lock,
  ArrowLeft,
  ChevronRight,
  IndianRupee,
  BookOpen,
  GraduationCap,
  BarChart3,
  FileText,
  Calendar,
  Bell,
  Heart,
  Megaphone,
  Stethoscope,
  TrendingUp,
  AlertTriangle,
  Wrench,
  Globe,
  Check,
  Info,
  ShieldCheck,
  Clock,
  Headphones,
} from 'lucide-react'

// ============================================
// MODULE DATA
// ============================================

export interface ModuleFeature {
  title: string
  description: string
}

export interface ModuleScreenshot {
  title: string
  description: string
}

export interface MarketplaceModule {
  id: string
  label: string
  tagline: string
  description: string
  longDescription: string
  icon: React.ElementType
  category: string
  isPremium: boolean
  isFeatured: boolean
  isRecommended: boolean
  color: string
  pricePerStudent: number
  billingCycle: string
  features: ModuleFeature[]
  screenshots: ModuleScreenshot[]
  version: string
  lastUpdated: string
  supportLevel: string
  totalUsers: string
  rating: number
}

const marketplaceModules: MarketplaceModule[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    tagline: 'Your institution at a glance',
    description:
      'Central hub for all key metrics, quick stats, and personalized widgets for your institution.',
    longDescription:
      'The Dashboard module provides a powerful, customizable overview of your entire institution. Get real-time insights into student attendance, fee collection status, academic performance trends, upcoming events, and staff activities — all in one place. Configure widgets, set alerts, and make data-driven decisions faster than ever.',
    icon: LayoutDashboard,
    category: 'Core',
    isPremium: false,
    isFeatured: true,
    isRecommended: true,
    color: 'blue',
    pricePerStudent: 0,
    billingCycle: 'Free with base plan',
    features: [
      {
        title: 'Real-time Metrics',
        description: 'Live student count, attendance rate, and fee collection status.',
      },
      {
        title: 'Customizable Widgets',
        description: 'Drag and drop widgets to personalize your dashboard view.',
      },
      {
        title: 'Quick Actions',
        description: 'One-click access to common tasks like marking attendance.',
      },
      {
        title: 'Notification Center',
        description: 'Centralized alerts for important updates and deadlines.',
      },
      {
        title: 'Multi-Branch View',
        description: 'Switch between branches to see consolidated or branch-wise data.',
      },
      {
        title: 'Calendar Integration',
        description: 'View upcoming events, exams, and holidays at a glance.',
      },
    ],
    screenshots: [
      { title: 'Main Dashboard', description: 'Overview of all key institutional metrics' },
      { title: 'Widget Configuration', description: 'Customize your dashboard layout' },
      { title: 'Analytics View', description: 'Deep dive into performance data' },
    ],
    version: '3.1.0',
    lastUpdated: '2024-12-15',
    supportLevel: 'Included',
    totalUsers: '12,500+',
    rating: 4.8,
  },
  {
    id: 'student',
    label: 'Student Management',
    tagline: 'Complete student lifecycle management',
    description:
      'Manage student profiles, admissions, attendance, behaviour records, and academic progress.',
    longDescription:
      'The Student Management module is the backbone of your ERP. From the moment a student applies for admission to the day they graduate, track every detail — personal information, family details, academic records, attendance history, behaviour logs, health records, and document management. Automate promotions, generate transfer certificates, and maintain comprehensive student portfolios.',
    icon: Users,
    category: 'Academic',
    isPremium: false,
    isFeatured: true,
    isRecommended: true,
    color: 'violet',
    pricePerStudent: 5,
    billingCycle: 'per student / month',
    features: [
      {
        title: 'Student Profiles',
        description: 'Complete student information with photo, documents, and family details.',
      },
      {
        title: 'Admission Management',
        description: 'Online applications, entrance tests, merit lists, and enrollment.',
      },
      {
        title: 'Attendance Tracking',
        description: 'Daily, subject-wise, and biometric attendance with parent notifications.',
      },
      {
        title: 'Behaviour & Discipline',
        description: 'Track incidents, counselling sessions, and disciplinary actions.',
      },
      {
        title: 'Promotion & Transfer',
        description: 'Automated promotion rules, TC generation, and migration certificates.',
      },
      {
        title: 'Document Vault',
        description: 'Secure storage for student documents, certificates, and ID cards.',
      },
    ],
    screenshots: [
      { title: 'Student Profile', description: 'Comprehensive student information page' },
      { title: 'Admission Flow', description: 'Step-by-step admission process' },
      { title: 'Attendance Dashboard', description: 'Visual attendance analytics' },
    ],
    version: '3.1.0',
    lastUpdated: '2024-12-10',
    supportLevel: 'Included',
    totalUsers: '15,200+',
    rating: 4.9,
  },
  {
    id: 'finance',
    label: 'Finance & Accounting',
    tagline: 'Streamline fee collection & accounting',
    description:
      'Handle fee collection, invoices, expenses, scholarships, and online payment integrations.',
    longDescription:
      'The Finance module transforms how your institution manages money. Automate fee structure creation, generate invoices, track payments in real-time, manage expenses, process scholarships, and integrate with popular payment gateways. Get detailed financial reports, manage multiple fee heads, handle concessions, and ensure complete financial transparency with audit trails.',
    icon: Wallet,
    category: 'Finance',
    isPremium: true,
    isFeatured: false,
    isRecommended: true,
    color: 'emerald',
    pricePerStudent: 8,
    billingCycle: 'per student / month',
    features: [
      {
        title: 'Fee Structure Builder',
        description: 'Create complex fee structures with multiple heads, installments, and due dates.',
      },
      {
        title: 'Online Payment Gateway',
        description: 'Razorpay, PayU, Paytm integration for parent payments.',
      },
      {
        title: 'Expense Management',
        description: 'Track expenses, vendor payments, petty cash, and budgets.',
      },
      {
        title: 'Scholarship Management',
        description: 'Apply scholarships, track disbursements, and manage donor records.',
      },
      {
        title: 'Invoice & Receipt',
        description: 'Auto-generated invoices, receipts, and demand letters.',
      },
      {
        title: 'Financial Reports',
        description: 'P&L statements, balance sheets, fee defaulter lists, and collection reports.',
      },
    ],
    screenshots: [
      { title: 'Fee Dashboard', description: 'Real-time fee collection overview' },
      { title: 'Payment Gateway', description: 'Online payment integration' },
      { title: 'Financial Reports', description: 'Comprehensive financial analytics' },
    ],
    version: '3.0.5',
    lastUpdated: '2024-11-28',
    supportLevel: 'Priority',
    totalUsers: '9,800+',
    rating: 4.7,
  },
  {
    id: 'hr',
    label: 'HR & Payroll',
    tagline: 'Complete workforce management',
    description:
      'Employee management, payroll, attendance, leave tracking, appraisals, and recruitment.',
    longDescription:
      'The HR & Payroll module handles every aspect of your workforce. From recruitment and onboarding to payroll processing and exit management — automate it all. Track employee attendance with biometric integration, manage leave balances, process salaries with tax calculations, conduct performance appraisals, and maintain complete employee records with document management.',
    icon: Briefcase,
    category: 'Operations',
    isPremium: true,
    isFeatured: false,
    isRecommended: false,
    color: 'orange',
    pricePerStudent: 6,
    billingCycle: 'per student / month',
    features: [
      {
        title: 'Employee Management',
        description: 'Complete employee profiles, documents, and employment history.',
      },
      {
        title: 'Payroll Processing',
        description: 'Salary calculation, tax deductions, PF, ESI, and bank integration.',
      },
      {
        title: 'Leave Management',
        description: 'Leave policies, balances, approval workflows, and calendar view.',
      },
      {
        title: 'Attendance & Biometric',
        description: 'Biometric integration, shift management, and overtime tracking.',
      },
      {
        title: 'Recruitment',
        description: 'Job postings, applications, interview scheduling, and offer letters.',
      },
      {
        title: 'Performance Appraisal',
        description: 'KRA/KPI setup, self-assessment, reviewer ratings, and reports.',
      },
    ],
    screenshots: [
      { title: 'HR Dashboard', description: 'Employee overview and statistics' },
      { title: 'Payroll Processing', description: 'Monthly salary processing workflow' },
      { title: 'Leave Calendar', description: 'Visual leave management' },
    ],
    version: '2.9.0',
    lastUpdated: '2024-11-15',
    supportLevel: 'Priority',
    totalUsers: '7,300+',
    rating: 4.6,
  },
  {
    id: 'assessment',
    label: 'Assessment & Exams',
    tagline: 'Examination management made easy',
    description:
      'Create exams, manage results, generate report cards, and track academic performance.',
    longDescription:
      'The Assessment module digitizes your entire examination process. Create exam schedules, define grading systems, enter marks with smart validation, generate beautiful report cards, track academic performance trends, and produce merit lists. Support for CBSE, ICSE, and state board patterns with customizable templates for every type of assessment.',
    icon: ClipboardList,
    category: 'Academic',
    isPremium: false,
    isFeatured: true,
    isRecommended: true,
    color: 'pink',
    pricePerStudent: 4,
    billingCycle: 'per student / month',
    features: [
      {
        title: 'Exam Scheduling',
        description: 'Create exam timetables, assign invigilators, and allocate rooms.',
      },
      {
        title: 'Marks Entry',
        description: 'Bulk marks entry with validation, import from Excel, and grade mapping.',
      },
      {
        title: 'Report Card Generator',
        description: 'Customizable report cards for CBSE, ICSE, and state boards.',
      },
      {
        title: 'Performance Analytics',
        description: 'Subject-wise, class-wise, and student-wise performance trends.',
      },
      {
        title: 'Merit Lists',
        description: 'Auto-generated merit lists with rank calculation and topper awards.',
      },
      {
        title: 'Online Assessments',
        description: 'Create online tests, quizzes, and assignments with auto-grading.',
      },
    ],
    screenshots: [
      { title: 'Exam Dashboard', description: 'Exam schedule and management overview' },
      { title: 'Report Cards', description: 'Beautiful, customizable report cards' },
      { title: 'Analytics', description: 'Performance trend analysis' },
    ],
    version: '3.1.0',
    lastUpdated: '2024-12-12',
    supportLevel: 'Included',
    totalUsers: '11,400+',
    rating: 4.8,
  },
  {
    id: 'admin-tools',
    label: 'Admin Tools',
    tagline: 'Powerful administration toolkit',
    description:
      'Security, configuration, user management, institute setup, and system administration.',
    longDescription:
      'Admin Tools is the control center of your ERP. Manage user roles and permissions, configure system settings, set up your institute structure, manage academic sessions, and control data access. Includes backup utilities, audit logs, customer support tools, and billing management — everything you need to run your ERP smoothly.',
    icon: Shield,
    category: 'Core',
    isPremium: false,
    isFeatured: false,
    isRecommended: false,
    color: 'blue',
    pricePerStudent: 0,
    billingCycle: 'Free with base plan',
    features: [
      {
        title: 'User & Role Management',
        description: 'Create users, assign roles, and control module-level access.',
      },
      {
        title: 'Institute Setup',
        description: 'Configure branches, classes, sections, subjects, and academic sessions.',
      },
      {
        title: 'System Configuration',
        description: 'Academic rules, fee rules, workflows, and notification templates.',
      },
      {
        title: 'Backup & Utilities',
        description: 'Data backup, import/export, log viewer, and document storage.',
      },
      {
        title: 'Billing & Subscription',
        description: 'Manage your ERP subscription, invoices, and payment methods.',
      },
      {
        title: 'Customer Support',
        description: 'Raise tickets, access training videos, and release notes.',
      },
    ],
    screenshots: [
      { title: 'Security Dashboard', description: 'User and access management' },
      { title: 'Institute Setup', description: 'Configure your institution structure' },
      { title: 'System Config', description: 'System-wide configuration panel' },
    ],
    version: '3.1.0',
    lastUpdated: '2024-12-18',
    supportLevel: 'Included',
    totalUsers: '15,500+',
    rating: 4.7,
  },
  {
    id: 'more',
    label: 'Extended Modules',
    tagline: 'Expand your ERP capabilities',
    description:
      'Newsfeed, Reports, Front Office, Communications, Events, Health, MIS, EIS, and more.',
    longDescription:
      'The Extended Modules pack unlocks a suite of powerful tools — Newsfeed for school updates, comprehensive Reports engine, Front Office management for visitors and appointments, Communications hub for messaging and announcements, Event & Activity management, Health records tracking, MIS dashboards for data-driven insights, EIS for executive decision-making, Project Management for institutional initiatives, and Issue Reporting for maintenance and escalation.',
    icon: Grid,
    category: 'Extended',
    isPremium: true,
    isFeatured: false,
    isRecommended: false,
    color: 'cyan',
    pricePerStudent: 12,
    billingCycle: 'per student / month',
    features: [
      {
        title: 'Newsfeed & Updates',
        description: 'School news, government circulars, and policy updates.',
      },
      {
        title: 'Advanced Reports',
        description: 'Government compliance, student, employee, and financial reports.',
      },
      {
        title: 'Front Office',
        description: 'Visitor logs, appointment scheduling, parcel tracking, and helpdesk.',
      },
      {
        title: 'Communications',
        description: 'Messaging, announcements, parent interaction, and feedback.',
      },
      {
        title: 'Events & Activities',
        description: 'Event management, competitions, media gallery, and certificates.',
      },
      {
        title: 'Health & MIS & EIS',
        description: 'Health records, analytics dashboards, and executive insights.',
      },
    ],
    screenshots: [
      { title: 'Newsfeed', description: 'School news and updates portal' },
      { title: 'Reports Engine', description: 'Comprehensive reporting system' },
      { title: 'MIS Dashboard', description: 'Management information system' },
    ],
    version: '2.8.0',
    lastUpdated: '2024-11-20',
    supportLevel: 'Priority',
    totalUsers: '6,200+',
    rating: 4.5,
  },
  {
    id: 'inventory-management',
    label: 'Shop / Inventory',
    tagline: 'School store & inventory management',
    description:
      'Manage school store inventory, uniform orders, kit distribution, and warehouse operations.',
    longDescription:
      'The Shop / Inventory module digitizes your school store operations. Set up warehouses, configure uniform and book kits, manage orders from parents, track dispatches and deliveries, generate QR codes for items, and produce detailed inventory reports. Parents can browse the catalog, add items to cart, place orders, and track delivery — all through the parent portal.',
    icon: Package,
    category: 'Operations',
    isPremium: true,
    isFeatured: false,
    isRecommended: true,
    color: 'amber',
    pricePerStudent: 3,
    billingCycle: 'per student / month',
    features: [
      {
        title: 'Warehouse Management',
        description: 'Multiple warehouses, stock tracking, and reorder alerts.',
      },
      {
        title: 'Kit Configuration',
        description: 'Create uniform, book, and stationery kits by class and gender.',
      },
      {
        title: 'Order Management',
        description: 'Parent ordering portal, cart system, and order tracking.',
      },
      {
        title: 'Dispatch & Delivery',
        description: 'Dispatch management, delivery tracking, and confirmation.',
      },
      {
        title: 'QR Code System',
        description: 'Generate and scan QR codes for uniform and item verification.',
      },
      {
        title: 'Inventory Reports',
        description: 'Stock reports, sales analysis, and revenue tracking.',
      },
    ],
    screenshots: [
      { title: 'Store Catalog', description: 'Browse and order school items' },
      { title: 'Warehouse', description: 'Stock and inventory management' },
      { title: 'Order Tracking', description: 'Track order status and delivery' },
    ],
    version: '2.5.0',
    lastUpdated: '2024-10-30',
    supportLevel: 'Standard',
    totalUsers: '4,100+',
    rating: 4.4,
  },
  {
    id: 'my-details',
    label: 'My Details',
    tagline: 'Personal profile & preferences',
    description:
      'Personal profile management, preferences, notification settings, and account details.',
    longDescription:
      'The My Details module lets every user manage their personal profile, update contact information, configure notification preferences, change passwords, set up two-factor authentication, and view their activity log. Teachers can see their class assignments, students can view their records, and parents can manage linked student profiles.',
    icon: User,
    category: 'Core',
    isPremium: false,
    isFeatured: false,
    isRecommended: false,
    color: 'slate',
    pricePerStudent: 0,
    billingCycle: 'Free with base plan',
    features: [
      {
        title: 'Profile Management',
        description: 'Update personal information, photo, and contact details.',
      },
      {
        title: 'Notification Preferences',
        description: 'Choose which notifications to receive via email, SMS, or push.',
      },
      {
        title: 'Security Settings',
        description: 'Change password, enable 2FA, and manage login sessions.',
      },
      {
        title: 'Activity Log',
        description: 'View login history and recent actions performed.',
      },
    ],
    screenshots: [
      { title: 'Profile Page', description: 'Personal information management' },
      { title: 'Settings', description: 'Notification and security preferences' },
    ],
    version: '3.1.0',
    lastUpdated: '2024-12-01',
    supportLevel: 'Included',
    totalUsers: '15,500+',
    rating: 4.6,
  },
  {
    id: 'plugins',
    label: 'Plugins & Integrations',
    tagline: 'Extend with third-party tools',
    description:
      'Extend EduManager with third-party integrations, API connectors, and custom plugins.',
    longDescription:
      'The Plugins module opens up EduManager to the world. Connect with Google Workspace, Microsoft 365, WhatsApp Business, SMS gateways, biometric devices, CCTV systems, transport GPS trackers, and more. Build custom integrations using our API, install community plugins, and automate workflows across platforms.',
    icon: Puzzle,
    category: 'Extended',
    isPremium: true,
    isFeatured: false,
    isRecommended: false,
    color: 'rose',
    pricePerStudent: 5,
    billingCycle: 'per student / month',
    features: [
      {
        title: 'Google Workspace',
        description: 'Sync with Google Classroom, Drive, Calendar, and Meet.',
      },
      {
        title: 'WhatsApp Integration',
        description: 'Send notifications, fee reminders, and reports via WhatsApp.',
      },
      {
        title: 'Biometric Devices',
        description: 'Connect attendance machines for students and staff.',
      },
      {
        title: 'SMS & Email Gateways',
        description: 'Integrate with Twilio, MSG91, SendGrid, and more.',
      },
      {
        title: 'API Access',
        description: 'REST APIs for custom integrations and data sync.',
      },
      {
        title: 'Community Plugins',
        description: 'Browse and install plugins built by the community.',
      },
    ],
    screenshots: [
      { title: 'Plugin Store', description: 'Browse available integrations' },
      { title: 'API Console', description: 'Developer tools and API documentation' },
      { title: 'Connected Apps', description: 'Manage active integrations' },
    ],
    version: '2.6.0',
    lastUpdated: '2024-11-05',
    supportLevel: 'Priority',
    totalUsers: '3,800+',
    rating: 4.3,
  },
]

// ============================================
// COLOR MAP
// ============================================

const colorMap: Record<
  string,
  { bg: string; icon: string; badge: string; ring: string; activeBg: string; lightBg: string }
> = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    badge: 'bg-blue-100 text-blue-700',
    ring: 'ring-blue-500',
    activeBg: 'bg-blue-600',
    lightBg: 'bg-blue-50/50',
  },
  violet: {
    bg: 'bg-violet-50',
    icon: 'text-violet-600',
    badge: 'bg-violet-100 text-violet-700',
    ring: 'ring-violet-500',
    activeBg: 'bg-violet-600',
    lightBg: 'bg-violet-50/50',
  },
  emerald: {
    bg: 'bg-emerald-50',
    icon: 'text-emerald-600',
    badge: 'bg-emerald-100 text-emerald-700',
    ring: 'ring-emerald-500',
    activeBg: 'bg-emerald-600',
    lightBg: 'bg-emerald-50/50',
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'text-orange-600',
    badge: 'bg-orange-100 text-orange-700',
    ring: 'ring-orange-500',
    activeBg: 'bg-orange-600',
    lightBg: 'bg-orange-50/50',
  },
  pink: {
    bg: 'bg-pink-50',
    icon: 'text-pink-600',
    badge: 'bg-pink-100 text-pink-700',
    ring: 'ring-pink-500',
    activeBg: 'bg-pink-600',
    lightBg: 'bg-pink-50/50',
  },
  cyan: {
    bg: 'bg-cyan-50',
    icon: 'text-cyan-600',
    badge: 'bg-cyan-100 text-cyan-700',
    ring: 'ring-cyan-500',
    activeBg: 'bg-cyan-600',
    lightBg: 'bg-cyan-50/50',
  },
  amber: {
    bg: 'bg-amber-50',
    icon: 'text-amber-600',
    badge: 'bg-amber-100 text-amber-700',
    ring: 'ring-amber-500',
    activeBg: 'bg-amber-600',
    lightBg: 'bg-amber-50/50',
  },
  slate: {
    bg: 'bg-slate-50',
    icon: 'text-slate-600',
    badge: 'bg-slate-100 text-slate-700',
    ring: 'ring-slate-500',
    activeBg: 'bg-slate-600',
    lightBg: 'bg-slate-50/50',
  },
  rose: {
    bg: 'bg-rose-50',
    icon: 'text-rose-600',
    badge: 'bg-rose-100 text-rose-700',
    ring: 'ring-rose-500',
    activeBg: 'bg-rose-600',
    lightBg: 'bg-rose-50/50',
  },
}

// ============================================
// CATEGORIES
// ============================================

const categories = ['All', 'Core', 'Academic', 'Finance', 'Operations', 'Extended']

// ============================================
// MODULE DETAIL PAGE COMPONENT
// ============================================

function ModuleDetailPage({
  module: mod,
  isActive,
  onToggle,
  onBack,
}: {
  module: MarketplaceModule
  isActive: boolean
  onToggle: () => void
  onBack: () => void
}) {
  const Icon = mod.icon
  const colors = colorMap[mod.color] || colorMap['blue']

  return (
    <div className="min-h-full bg-gray-50">
      {/* Back Navigation */}
      <div className="bg-white border-b border-gray-100 px-8 py-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace
        </button>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#0F4C5C] via-[#1E6091] to-[#168AAD] px-8 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div
              className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10`}
            >
              <Icon className="h-10 w-10 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h1 className="text-3xl font-bold text-white">{mod.label}</h1>
                {mod.isFeatured && (
                  <span className="flex items-center gap-1 rounded-full bg-yellow-400/20 px-3 py-1 text-xs font-semibold text-yellow-300 border border-yellow-400/30">
                    <Star className="h-3 w-3 fill-yellow-300" />
                    Featured
                  </span>
                )}
                {mod.isPremium && (
                  <span className="flex items-center gap-1 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-semibold text-amber-300 border border-amber-400/30">
                    <Lock className="h-3 w-3" />
                    Premium
                  </span>
                )}
              </div>
              <p className="text-white/80 text-lg mb-4">{mod.tagline}</p>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                <span className="flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  {mod.rating} rating
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  {mod.totalUsers} institutions
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  v{mod.version}
                </span>
                <span className="flex items-center gap-1.5">
                  <Headphones className="h-3.5 w-3.5" />
                  {mod.supportLevel} support
                </span>
              </div>
            </div>

            {/* Price & Action */}
            <div className="shrink-0 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-6 min-w-[240px]">
              <div className="text-center mb-4">
                {mod.pricePerStudent === 0 ? (
                  <div>
                    <span className="text-3xl font-bold text-white">Free</span>
                    <p className="text-sm text-white/60 mt-1">{mod.billingCycle}</p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-center gap-1">
                      <IndianRupee className="h-6 w-6 text-white" />
                      <span className="text-3xl font-bold text-white">
                        {mod.pricePerStudent}
                      </span>
                    </div>
                    <p className="text-sm text-white/60 mt-1">{mod.billingCycle}</p>
                  </div>
                )}
              </div>

              <button
                onClick={onToggle}
                className={`w-full flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-400/30'
                    : 'bg-white text-[#1E6091] hover:bg-white/90 shadow-lg'
                }`}
              >
                {isActive ? (
                  <>
                    <XCircle className="h-4 w-4" />
                    Deactivate Module
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Activate Module
                  </>
                )}
              </button>

              {isActive && (
                <div className="mt-3 flex items-center justify-center gap-1.5 text-green-300 text-xs font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                  </span>
                  Currently Active
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-8 py-10">
        {/* About */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            About this module
          </h2>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <p className="text-gray-600 leading-relaxed text-[15px]">
              {mod.longDescription}
            </p>
          </div>
        </section>

        {/* Pricing Info */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <IndianRupee className="h-5 w-5 text-emerald-500" />
            Pricing Details
          </h2>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-xl bg-gray-50">
                <p className="text-sm text-gray-500 mb-1">Cost per Student</p>
                <div className="flex items-center justify-center gap-1">
                  {mod.pricePerStudent === 0 ? (
                    <span className="text-2xl font-bold text-green-600">Free</span>
                  ) : (
                    <>
                      <IndianRupee className="h-5 w-5 text-gray-900" />
                      <span className="text-2xl font-bold text-gray-900">
                        {mod.pricePerStudent}
                      </span>
                      <span className="text-sm text-gray-500">/mo</span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-center p-4 rounded-xl bg-gray-50">
                <p className="text-sm text-gray-500 mb-1">For 500 Students</p>
                <div className="flex items-center justify-center gap-1">
                  {mod.pricePerStudent === 0 ? (
                    <span className="text-2xl font-bold text-green-600">Free</span>
                  ) : (
                    <>
                      <IndianRupee className="h-5 w-5 text-gray-900" />
                      <span className="text-2xl font-bold text-gray-900">
                        {(mod.pricePerStudent * 500).toLocaleString('en-IN')}
                      </span>
                      <span className="text-sm text-gray-500">/mo</span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-center p-4 rounded-xl bg-gray-50">
                <p className="text-sm text-gray-500 mb-1">For 1000 Students</p>
                <div className="flex items-center justify-center gap-1">
                  {mod.pricePerStudent === 0 ? (
                    <span className="text-2xl font-bold text-green-600">Free</span>
                  ) : (
                    <>
                      <IndianRupee className="h-5 w-5 text-gray-900" />
                      <span className="text-2xl font-bold text-gray-900">
                        {(mod.pricePerStudent * 1000).toLocaleString('en-IN')}
                      </span>
                      <span className="text-sm text-gray-500">/mo</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            What's Included
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mod.features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${colors.bg} mt-0.5`}
                  >
                    <Check className={`h-4 w-4 ${colors.icon}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Screenshots / Previews */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-500" />
            Screenshots & Previews
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mod.screenshots.map((screenshot, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className={`h-40 ${colors.bg} flex items-center justify-center`}
                >
                  <Icon className={`h-16 w-16 ${colors.icon} opacity-20`} />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {screenshot.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {screenshot.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Module Info */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-green-500" />
            Module Information
          </h2>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  Version
                </p>
                <p className="text-sm font-semibold text-gray-900">v{mod.version}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  Last Updated
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {mod.lastUpdated}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  Support Level
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {mod.supportLevel}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  Category
                </p>
                <p className="text-sm font-semibold text-gray-900">{mod.category}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {isActive ? 'This module is currently active' : `Ready to activate ${mod.label}?`}
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            {isActive
              ? 'You can deactivate this module anytime. Your data will be preserved.'
              : mod.pricePerStudent === 0
                ? 'This module is free with your base plan. Activate it now!'
                : `This will add ₹${mod.pricePerStudent} per student per month to your billing.`}
          </p>
          <button
            onClick={onToggle}
            className={`inline-flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-bold transition-all duration-200 ${
              isActive
                ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                : `${colors.activeBg} text-white hover:opacity-90 shadow-lg`
            }`}
          >
            {isActive ? (
              <>
                <XCircle className="h-4 w-4" />
                Deactivate Module
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Activate Module
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// MODULE CARD COMPONENT
// ============================================

function ModuleCard({
  mod,
  isActive,
  onToggle,
  onOpen,
}: {
  mod: MarketplaceModule
  isActive: boolean
  onToggle: () => void
  onOpen: () => void
}) {
  const Icon = mod.icon
  const colors = colorMap[mod.color] || colorMap['blue']

  return (
    <div
      className={`relative flex flex-col bg-white rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer group
        ${isActive ? `ring-2 ${colors.ring} border-transparent shadow-lg` : 'border-gray-100 shadow-sm hover:shadow-md'}`}
      onClick={onOpen}
    >
      {/* Featured Badge */}
      {mod.isFeatured && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-0.5 text-xs font-semibold text-yellow-600 border border-yellow-200">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          Featured
        </div>
      )}

      {/* Active Indicator Bar */}
      {isActive && <div className={`h-1 w-full ${colors.activeBg}`} />}

      <div className="p-6 flex flex-col flex-1">
        {/* Icon + Title */}
        <div className="flex items-start gap-4 mb-3">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colors.bg}`}
          >
            <Icon className={`h-6 w-6 ${colors.icon}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 truncate">
              {mod.label}
            </h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors.badge}`}
              >
                {mod.category}
              </span>
              {mod.isPremium && (
                <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
                  <Lock className="h-2.5 w-2.5" />
                  Premium
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-4 line-clamp-2">
          {mod.description}
        </p>

        {/* Price Tag */}
        <div className="mb-4 flex items-center gap-2">
          {mod.pricePerStudent === 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700 border border-green-200">
              <CheckCircle2 className="h-3 w-3" />
              Free
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1 text-xs font-bold text-gray-700 border border-gray-200">
              <IndianRupee className="h-3 w-3" />
              {mod.pricePerStudent} / student / month
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-3 w-3 ${
                  star <= Math.floor(mod.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-200'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">
            {mod.rating} • {mod.totalUsers}
          </span>
        </div>

        {/* Status + Buttons */}
        <div className="flex items-center justify-between gap-3">
          {/* Status */}
          <div className="flex items-center gap-1.5">
            {isActive ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs font-medium text-green-600">Active</span>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-gray-300"></span>
                <span className="text-xs font-medium text-gray-400">Inactive</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggle()
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200
                ${
                  isActive
                    ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                    : `${colors.activeBg} text-white hover:opacity-90 shadow-sm`
                }`}
            >
              {isActive ? (
                <>
                  <XCircle className="h-3.5 w-3.5" />
                  Deactivate
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Activate
                </>
              )}
            </button>

            {/* View Details Arrow */}
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-400 group-hover:bg-gray-100 group-hover:text-gray-600 transition-all">
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================

export function ModuleActivationPage() {
  const [activeModules, setActiveModules] = useState<Record<string, boolean>>({})
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null)

  const toggleModule = (moduleId: string) => {
    setActiveModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }))
  }

  const filteredModules = marketplaceModules.filter((mod) => {
    const matchesSearch =
      mod.label.toLowerCase().includes(search.toLowerCase()) ||
      mod.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory =
      selectedCategory === 'All' || mod.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const recommendedModules = filteredModules.filter((mod) => mod.isRecommended)
  const allModules = filteredModules

  const activatedCount = Object.values(activeModules).filter(Boolean).length
  const totalCount = marketplaceModules.length

  // ── Detail Page View ──
  const selectedModule = marketplaceModules.find((m) => m.id === selectedModuleId)
  if (selectedModule) {
    return (
      <ModuleDetailPage
        module={selectedModule}
        isActive={activeModules[selectedModule.id] || false}
        onToggle={() => toggleModule(selectedModule.id)}
        onBack={() => setSelectedModuleId(null)}
      />
    )
  }

  // ── Main Marketplace View ──
  return (
    <div className="min-h-full bg-gray-50">
      {/* ── Page Header ── */}
      <div className="bg-gradient-to-br from-[#0F4C5C] via-[#1E6091] to-[#168AAD] px-8 py-10">
        <div className="flex items-center gap-4 mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
            <Store className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Marketplace</h1>
            <p className="text-white/70 text-sm mt-0.5">
              Activate and manage modules for your institution
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-6 flex flex-wrap gap-4">
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white border border-white/10">
            <CheckCircle2 className="h-4 w-4 text-green-400" />
            <span>
              <span className="font-bold">{activatedCount}</span> Activated
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white border border-white/10">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span>
              <span className="font-bold">{totalCount}</span> Total Modules
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white border border-white/10">
            <Lock className="h-4 w-4 text-cyan-300" />
            <span>
              <span className="font-bold">
                {marketplaceModules.filter((m) => m.isPremium).length}
              </span>{' '}
              Premium
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white border border-white/10">
            <IndianRupee className="h-4 w-4 text-emerald-300" />
            <span>
              <span className="font-bold">
                ₹
                {Object.entries(activeModules)
                  .filter(([, v]) => v)
                  .reduce((sum, [id]) => {
                    const m = marketplaceModules.find((mod) => mod.id === id)
                    return sum + (m?.pricePerStudent || 0)
                  }, 0)}
              </span>{' '}
              / student / month
            </span>
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-8 py-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search modules..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#1E6091] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-8 py-8">
        {filteredModules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700">No modules found</h3>
            <p className="text-sm text-gray-400 mt-1">
              Try adjusting your search or category filter
            </p>
          </div>
        ) : (
          <>
            {/* ── RECOMMENDED SECTION ── */}
            {recommendedModules.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-50">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Recommended for You
                    </h2>
                    <p className="text-sm text-gray-500">
                      Essential modules to get started with your institution
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendedModules.map((mod) => (
                    <ModuleCard
                      key={mod.id}
                      mod={mod}
                      isActive={activeModules[mod.id] || false}
                      onToggle={() => toggleModule(mod.id)}
                      onOpen={() => setSelectedModuleId(mod.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ── ALL MODULES SECTION ── */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                  <Grid className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">All Modules</h2>
                  <p className="text-sm text-gray-500">
                    Browse all available modules for your ERP
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allModules.map((mod) => (
                  <ModuleCard
                    key={mod.id}
                    mod={mod}
                    isActive={activeModules[mod.id] || false}
                    onToggle={() => toggleModule(mod.id)}
                    onOpen={() => setSelectedModuleId(mod.id)}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
