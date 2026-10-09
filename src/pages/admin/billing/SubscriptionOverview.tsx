import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import {
  CheckCircle,
  AlertCircle,
  Clock,
  XCircle,
  ArrowUpCircle,
  Users,
  Package,
  Calendar,
  DollarSign,
  Zap } from
'lucide-react';

// ============ TYPE DEFINITIONS ============
type SubscriptionStatus = 'Active' | 'Trial' | 'Suspended' | 'Expired';
type PlanType = 'Starter' | 'Growth' | 'Enterprise';

interface PricingSlab {
  min: number;
  max: number;
  price: number;
  label: string;
}

interface ModuleCategory {
  title: string;
  description: string;
  accessLevel: PlanType[];
  modules: string[];
}

// ============ CONFIGURATION CONSTANTS ============

const STATUS_CONFIG = {
  Active: {
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: CheckCircle,
    dot: 'bg-green-500',
    message: 'Your subscription is active and all services are operational.'
  },
  Trial: {
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: Clock,
    dot: 'bg-blue-500',
    message: 'You are currently on a trial period. Upgrade to continue access.'
  },
  Suspended: {
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: AlertCircle,
    dot: 'bg-amber-500',
    message: 'Your subscription is suspended. Please contact support.'
  },
  Expired: {
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: XCircle,
    dot: 'bg-red-500',
    message: 'Your subscription has expired. Renew to restore access.'
  }
};

const PRICING_SLABS: PricingSlab[] = [
{ min: 1, max: 100, price: 20, label: '1 – 100 Students' },
{ min: 101, max: 500, price: 16, label: '101 – 500 Students' },
{ min: 501, max: 1000, price: 14, label: '501 – 1,000 Students' },
{ min: 1001, max: 2500, price: 12, label: '1,001 – 2,500 Students' },
{ min: 2501, max: Infinity, price: 10, label: '2,500+ Students' }];


const MODULE_CATEGORIES: Record<string, ModuleCategory> = {
  core: {
    title: 'Core Modules',
    description: 'Included in Starter Plan',
    accessLevel: ['Starter', 'Growth', 'Enterprise'],
    modules: [
    'MIS',
    'EIS',
    'Student Management',
    'Student Attendance',
    'Admission Management',
    'Certificate Management',
    'Employee Management',
    'Employee Attendance',
    'Payroll Management',
    'Recruitment Management',
    'Appraisal Management',
    'Leave Management',
    'Income Tax Management',
    'Fee Management',
    'Charge Management',
    'Scholarship Management',
    'Accounts & Finance Management',
    'Online Payment Management',
    'Expense Management',
    'Academic Management',
    'Assessment Management',
    'Timetable Management',
    'Front Office Management',
    'Health Management',
    'Event / Activity Management',
    'Communication',
    'News Management',
    'Reports Management',
    'Chat Box']

  },
  academic: {
    title: 'Academic Support Modules',
    description: 'Available in Growth & Enterprise',
    accessLevel: ['Growth', 'Enterprise'],
    modules: [
    'Library Management',
    'Activities Management',
    'Inventory Management']

  },
  facility: {
    title: 'Facility Modules',
    description: 'Available only in Enterprise',
    accessLevel: ['Enterprise'],
    modules: [
    'Transport Management',
    'Hostel Management',
    'Canteen Management',
    'Gatepass Management']

  }
};

const PLAN_FEATURES: Record<PlanType, string[]> = {
  Starter: [
  'All Core Modules (29 modules)',
  'Basic Support',
  'Email Notifications',
  'Standard Reports'],

  Growth: [
  'All Core Modules (29 modules)',
  'Academic Support Modules (3 modules)',
  'Priority Support',
  'Advanced Reports',
  'API Access'],

  Enterprise: [
  'All Core Modules (29 modules)',
  'Academic Support Modules (3 modules)',
  'Facility Modules (4 modules)',
  'Dedicated Support',
  'Custom Reports',
  'API Access',
  'White-label Options']

};

// ============ HELPER FUNCTIONS ============

const getPricingSlab = (studentCount: number): PricingSlab => {
  return (
    PRICING_SLABS.find(
      (slab) => studentCount >= slab.min && studentCount <= slab.max
    ) || PRICING_SLABS[PRICING_SLABS.length - 1]);

};

const calculateMonthlyCost = (studentCount: number): number => {
  const slab = getPricingSlab(studentCount);
  return studentCount * slab.price;
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

// ============ REUSABLE UI COMPONENT ============
const Link = ({
  children,
  onClick



}: {children: React.ReactNode;onClick?: () => void;}) =>
<button
  onClick={onClick}
  className="text-blue-600 hover:text-blue-800 hover:underline text-xs font-medium bg-transparent border-none p-0 text-left cursor-pointer transition-colors">
  
    {children}
  </button>;


// ============ ACTIVE MODULE TABLE COMPONENT ============
interface ActiveModuleTableProps {
  title: string;
  description: string;
  modules: string[];
  accent: 'blue' | 'purple' | 'orange';
}

const ActiveModuleTable: React.FC<ActiveModuleTableProps> = ({
  title,
  description,
  modules,
  accent
}) => {
  const accentStyles = {
    blue: {
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: 'text-blue-600',
      bar: 'bg-blue-500'
    },
    purple: {
      badge: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: 'text-purple-600',
      bar: 'bg-purple-500'
    },
    orange: {
      badge: 'bg-orange-50 text-orange-700 border-orange-200',
      icon: 'text-orange-600',
      bar: 'bg-orange-500'
    }
  }[accent];

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white flex flex-col h-full">
      {/* Section Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50/70">
        <div className="flex items-center gap-3">
          <div className={`w-1 h-8 rounded-full ${accentStyles.bar}`} />
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${accentStyles.badge}`}>
            
            {modules.length} modules
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" /> Included
          </span>
        </div>
      </div>

      {/* Module Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm">
          <thead className="bg-white">
            <tr>
              <th className="font-semibold px-4 py-2.5 text-gray-700 border-b w-12 text-xs uppercase tracking-wide">
                #
              </th>
              <th className="font-semibold px-4 py-2.5 text-gray-700 border-b text-xs uppercase tracking-wide">
                Module Name
              </th>
              <th className="font-semibold px-4 py-2.5 text-gray-700 border-b text-center w-28 text-xs uppercase tracking-wide">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {modules.map((mod, idx) =>
            <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-4 py-2.5 text-gray-400 text-xs">
                  {idx + 1}
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <Zap
                    className={`w-3.5 h-3.5 ${accentStyles.icon} flex-shrink-0`} />
                  
                    <span className="text-gray-800 font-medium">{mod}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-center">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    <CheckCircle className="w-3 h-3" />
                    Active
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>);

};

// ============ MAIN COMPONENT ============

export function SubscriptionOverview() {
  // ============ STATE ============
  const [status] = useState<SubscriptionStatus>('Active');
  const [currentPlan] = useState<PlanType>('Growth');
  const [studentCount] = useState(1248);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // ============ COMPUTED VALUES ============
  const pricingSlab = useMemo(
    () => getPricingSlab(studentCount),
    [studentCount]
  );
  const monthlyCost = useMemo(
    () => calculateMonthlyCost(studentCount),
    [studentCount]
  );

  const planStartDate = new Date('2024-08-01');
  const nextBillingDate = new Date('2025-08-01');
  const currentBillingPeriodStart = new Date('2025-07-01');
  const currentBillingPeriodEnd = new Date('2025-07-31');
  const lastVerified = new Date();

  const StatusIcon = STATUS_CONFIG[status].icon;

  // ============ ACTION HANDLERS ============
  const handleUpgrade = () => setShowUpgradeModal(true);

  // ============ HELPER METHODS ============
  const hasModuleAccess = (accessLevel: PlanType[]): boolean => {
    return accessLevel.includes(currentPlan);
  };

  // Assign colors to each category key
  const CATEGORY_ACCENT: Record<string, 'blue' | 'purple' | 'orange'> = {
    core: 'blue',
    academic: 'purple',
    facility: 'orange'
  };

  // Only include modules the current plan has access to
  const activeCategories = Object.entries(MODULE_CATEGORIES).filter(
    ([, category]) => hasModuleAccess(category.accessLevel)
  );

  const totalActiveModules = activeCategories.reduce(
    (sum, [, category]) => sum + category.modules.length,
    0
  );

  // ============ RENDER ============
  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen font-sans">
      {/* ============ PAGE HEADER ============ */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Subscription Overview
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your ERP plan, modules, and billing cycle
          </p>
          {/* Quick Info Bar */}
          <div className="flex flex-wrap items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <Package className="w-4 h-4 text-blue-500" />
              <span className="font-medium">Plan:</span> {currentPlan}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <Users className="w-4 h-4 text-green-500" />
              <span className="font-medium">Active Students:</span>{' '}
              <span className="font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded">
                {studentCount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <DollarSign className="w-4 h-4 text-orange-500" />
              <span className="font-medium">Monthly Est:</span>{' '}
              {formatCurrency(monthlyCost)}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-purple-500" />
              <span className="font-medium">Next Billing:</span>{' '}
              {formatDate(nextBillingDate)}
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button className="flex items-center gap-2" onClick={handleUpgrade}>
            <ArrowUpCircle className="w-4 h-4" />
            Upgrade Plan
          </Button>
        </div>
      </div>

      {/* ============ SUBSCRIPTION STATUS BANNER ============ */}
      <div
        className={`flex flex-col lg:flex-row lg:items-center gap-3 px-5 py-4 rounded-xl border ${STATUS_CONFIG[status].color}`}>
        
        <div className="flex items-center gap-3">
          <span
            className={`w-2.5 h-2.5 rounded-full ${STATUS_CONFIG[status].dot} animate-pulse`} />
          
          <StatusIcon className="w-5 h-5" />
          <span className="font-semibold text-base">
            Subscription Status: {status}
          </span>
        </div>
        <div className="lg:ml-auto flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-6 text-sm">
          <span className="opacity-80">
            Last verified: {formatDate(lastVerified)},{' '}
            {lastVerified.toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
          <span className="opacity-80">
            Current billing period: {formatDate(currentBillingPeriodStart)} –{' '}
            {formatDate(currentBillingPeriodEnd)}
          </span>
        </div>
      </div>

      {/* ============ SUBSCRIPTION & BILLING MANAGEMENT ============ */}
      <Card title="Subscription & Billing Management">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 pt-2">
          {/* COL 1: Plan & Active Students */}
          <div>
            <div className="h-px w-full bg-gray-200 mb-3"></div>
            <h3 className="text-sm font-bold text-gray-900 mb-4">
              Plan & Students
            </h3>
            <div className="text-sm space-y-5">
              <div>
                <p className="font-semibold text-gray-900 mb-0.5">
                  Current Plan
                </p>
                <p className="text-gray-600">
                  {currentPlan} (Per Student / Month)
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">
                  Active Students
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                  <Users className="w-4 h-4 text-green-600" />
                  <span className="text-lg font-bold text-green-700">
                    {studentCount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* COL 2: Subscription Settings */}
          <div>
            <div className="h-px w-full bg-gray-200 mb-3"></div>
            <h3 className="text-sm font-bold text-gray-900 mb-4">
              Subscription Settings
            </h3>
            <div className="space-y-5 text-sm">
              <div>
                <p className="font-semibold text-gray-900 mb-0.5">
                  Estimated Monthly Cost
                </p>
                <p className="text-gray-600">
                  {formatCurrency(monthlyCost)}{' '}
                  <span className="text-xs text-gray-500">(Before GST)</span>
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-0.5">
                  Recurring billing
                </p>
                <p className="text-gray-600 mb-0.5">
                  On, renews on {formatDate(nextBillingDate)}
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-0.5">
                  Payment method
                </p>
                <p className="text-gray-600 mb-0.5">•••• 4242</p>
                <Link>Edit payment method</Link>
              </div>
            </div>
          </div>

          {/* COL 3: Purchase Information */}
          <div>
            <div className="h-px w-full bg-gray-200 mb-3"></div>
            <h3 className="text-sm font-bold text-gray-900 mb-4">
              Purchase Information
            </h3>
            <div className="space-y-5 text-sm">
              <div>
                <p className="font-semibold text-gray-900 mb-0.5">
                  Initial purchase date
                </p>
                <p className="text-gray-600">{formatDate(planStartDate)}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-0.5">
                  Unit price
                </p>
                <p className="text-gray-600">
                  {formatCurrency(pricingSlab.price)} per student / month
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-0.5">
                  Purchase channel
                </p>
                <p className="text-gray-600">B to B</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-0.5">Currency</p>
                <p className="text-gray-600">INR (₹)</p>
              </div>
            </div>
          </div>

          {/* COL 4: Service Usage Address */}
          <div>
            <div className="h-px w-full bg-gray-200 mb-3"></div>
            <h3 className="text-sm font-bold text-gray-900 mb-4">
              Service Usage Address
            </h3>
            <div className="text-sm space-y-3">
              <div className="text-gray-600 leading-relaxed">
                <p className="font-semibold text-gray-900">
                  St. Xavier's High School
                </p>
                <p>124 Education Avenue</p>
                <p>Knowledge Park, Block C</p>
                <p>New Delhi, DL 110001</p>
                <p>India</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ============ INCLUDED MODULES - SIDE BY SIDE ACTIVE ONLY ============ */}
      <Card
        title="Included Modules"
        headerAction={
        <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">
              {totalActiveModules} active modules
            </span>
            <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
              {currentPlan} Plan
            </span>
          </div>
        }>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {activeCategories.map(([key, category]) =>
          <ActiveModuleTable
            key={key}
            title={category.title}
            description={category.description}
            modules={category.modules}
            accent={CATEGORY_ACCENT[key] || 'blue'} />

          )}
        </div>
      </Card>

      {/* ============ PLAN HISTORY SECTION ============ */}
      <Card title="Plan History">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="font-semibold px-4 py-3 text-gray-700 border-b">
                  Date
                </th>
                <th className="font-semibold px-4 py-3 text-gray-700 border-b">
                  Action
                </th>
                <th className="font-semibold px-4 py-3 text-gray-700 border-b">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 align-top text-gray-600">
                  01 Aug 2024
                </td>
                <td className="px-4 py-3 align-top font-medium text-gray-900">
                  Plan Upgrade
                </td>
                <td className="px-4 py-3 align-top text-gray-600">
                  Upgraded from Starter to Growth Plan. Capacity adjusted to
                  1,248.
                </td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 align-top text-gray-600">
                  01 Aug 2023
                </td>
                <td className="px-4 py-3 align-top font-medium text-gray-900">
                  Initial Purchase
                </td>
                <td className="px-4 py-3 align-top text-gray-600">
                  Purchased Starter Plan for 500 students.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* ============ UPGRADE PLAN MODAL ============ */}
      <Modal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title="Upgrade Plan Options"
        size="xl"
        footer={
        <div className="flex justify-end gap-2">
            <Button
            variant="outline"
            onClick={() => setShowUpgradeModal(false)}>
            
              Close
            </Button>
          </div>
        }>
        
        <div className="space-y-6">
          <p className="text-sm text-gray-500">
            Compare all available plans and their included modules. Select the
            best fit for your institution's needs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(['Starter', 'Growth', 'Enterprise'] as PlanType[]).map((plan) => {
              const isCurrent = plan === currentPlan;

              return (
                <div
                  key={plan}
                  className={`flex flex-col rounded-xl border p-5 transition-colors ${
                  isCurrent ?
                  'border-blue-500 ring-1 ring-blue-500 bg-blue-50/30' :
                  'border-gray-200 hover:border-blue-300'}`
                  }>
                  
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {plan}
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">
                      {plan === 'Starter' &&
                      'Essential tools for core operations'}
                      {plan === 'Growth' && 'Advanced support and reporting'}
                      {plan === 'Enterprise' &&
                      'Complete facility management suite'}
                    </p>
                    {isCurrent ?
                    <div className="w-full text-center py-2 bg-gray-100 text-gray-500 rounded font-medium text-sm">
                        Current Plan
                      </div> :

                    <Button
                      className="w-full"
                      onClick={() => setShowUpgradeModal(false)}>
                      
                        Upgrade to {plan}
                      </Button>
                    }
                  </div>

                  <div className="flex-1 space-y-4">
                    <p className="text-sm font-semibold text-gray-900">
                      Included Features:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600 mb-6">
                      {PLAN_FEATURES[plan].map((feature, i) =>
                      <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      )}
                    </ul>

                    <p className="text-sm font-semibold text-gray-900">
                      Module Access:
                    </p>
                    <div className="space-y-3">
                      {Object.entries(MODULE_CATEGORIES).map(
                        ([key, category]) => {
                          const hasAccess = category.accessLevel.includes(plan);
                          return (
                            <div
                              key={key}
                              className="flex items-center gap-2 text-xs">
                              
                              {hasAccess ?
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> :

                              <XCircle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                              }
                              <span
                                className={
                                hasAccess ?
                                'text-gray-800' :
                                'text-gray-400'
                                }>
                                
                                {category.title} ({category.modules.length})
                              </span>
                            </div>);

                        }
                      )}
                    </div>
                  </div>
                </div>);

            })}
          </div>
        </div>
      </Modal>
    </div>);

}