import React from 'react'
import {
  Mail,
  Phone,
  Calendar,
  Building,
  Briefcase,
  MapPin,
} from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserProfile {
  firstName: string
  lastName: string
  preferredName: string
  email: string
  phone: string
  alternateEmail: string
  alternateMobile: string
  employeeId: string
  designation: string
  department: string
  branch: string
  joiningDate: string
  address: string
  city: string
  state: string
  pincode: string
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const PROFILE: UserProfile = {
  firstName: 'Rajesh',
  lastName: 'Kumar',
  preferredName: 'Rajesh',
  email: 'rajesh.kumar@school.edu',
  phone: '+91 98765 43210',
  alternateEmail: 'rajesh.personal@gmail.com',
  alternateMobile: '+91 99887 76655',
  employeeId: 'EMP-2024-001',
  designation: 'Senior Teacher',
  department: 'Science Department',
  branch: 'Main Campus',
  joiningDate: '2020-06-15',
  address: '123, Green Valley Society',
  city: 'Ahmedabad',
  state: 'Gujarat',
  pincode: '380015',
}

// ─── Helper Component ─────────────────────────────────────────────────────────

function Field({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon?: React.ElementType
}) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400 mb-1">{label}</p>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />}
        <p className="text-sm font-medium text-gray-900">
          {value || (
            <span className="text-gray-400 italic font-normal">Not provided</span>
          )}
        </p>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function MyAccountSettings() {
  const getInitials = (firstName: string, lastName: string) =>
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()

  return (
    <div className="space-y-6 p-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          View your profile information and account settings
        </p>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Avatar Card */}
        <Card>
          <div className="flex flex-col items-center space-y-4 py-2">
            <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold">
              {getInitials(PROFILE.firstName, PROFILE.lastName)}
            </div>
            <div className="text-center">
              <p className="font-bold text-lg text-gray-900">
                {PROFILE.firstName} {PROFILE.lastName}
              </p>
              <p className="text-sm text-gray-500 mt-0.5">{PROFILE.designation}</p>
              <div className="flex flex-col items-center gap-1.5 mt-3">
                <Badge variant="info">{PROFILE.employeeId}</Badge>
                <Badge variant="default">{PROFILE.branch}</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">

          {/* Personal Details */}
          <Card title="Personal Details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="First Name" value={PROFILE.firstName} />
              <Field label="Last Name" value={PROFILE.lastName} />
              <Field label="Preferred Name" value={PROFILE.preferredName} />
              <Field label="Employee ID" value={PROFILE.employeeId} />
            </div>

            <div className="mt-5 pt-5 border-t border-gray-100">
              <p className="text-sm font-semibold text-gray-700 mb-4">Employment Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Designation" value={PROFILE.designation} icon={Briefcase} />
                <Field label="Department" value={PROFILE.department} icon={Building} />
                <Field label="Branch" value={PROFILE.branch} icon={MapPin} />
                <Field label="Joining Date" value={PROFILE.joiningDate} icon={Calendar} />
              </div>
              <p className="text-xs text-gray-400 mt-4">
                Employment details are managed by HR. Contact the HR department for any changes.
              </p>
            </div>
          </Card>

          {/* Contact Details */}
          <Card title="Contact Details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Primary Email" value={PROFILE.email} icon={Mail} />
              <Field label="Primary Phone" value={PROFILE.phone} icon={Phone} />
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Primary contact is managed by administration. Contact admin for changes.
            </p>

            <div className="mt-5 pt-5 border-t border-gray-100">
              <p className="text-sm font-semibold text-gray-700 mb-4">Recovery Contact</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Alternate Email" value={PROFILE.alternateEmail} icon={Mail} />
                <Field label="Alternate Mobile" value={PROFILE.alternateMobile} icon={Phone} />
              </div>
            </div>
          </Card>

          {/* Address */}
          <Card title="Address">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <Field label="Street Address" value={PROFILE.address} icon={MapPin} />
              </div>
              <Field label="City" value={PROFILE.city} />
              <Field label="State" value={PROFILE.state} />
              <Field label="PIN Code" value={PROFILE.pincode} />
            </div>
          </Card>

        </div>
      </div>
    </div>
  )
}

export default MyAccountSettings
