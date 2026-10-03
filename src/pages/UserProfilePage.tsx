import React, { useState } from 'react';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building,
  Calendar,
  BadgeCheck,
  Edit2,
  Camera,
  Save,
  X } from
'lucide-react';
interface UserProfilePageProps {
  onBack: () => void;
}
export function UserProfilePage({ onBack }: UserProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  // Mock User Data
  const [user, setUser] = useState({
    name: 'Rajesh Kumar',
    role: 'Administrator',
    empId: 'EMP-2024-001',
    email: 'rajesh.kumar@school.edu',
    phone: '+91 98765 43210',
    department: 'Administration',
    joinDate: '15 Jan 2020',
    bio: 'Senior Administrator with 10+ years of experience in educational management systems.'
  });
  return (
    <div className="min-h-full bg-gray-50 flex flex-col">
      {/* Header with Cover Image */}
      <div className="relative h-48 bg-gradient-to-r from-[#0F4C5C] to-[#168AAD]">
        <button
          onClick={onBack}
          className="absolute top-6 left-6 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-colors">

          <ArrowLeft className="h-6 w-6" />
        </button>
      </div>

      <div className="flex-1 max-w-5xl w-full mx-auto px-8 pb-12 -mt-20">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Profile Header */}
          <div className="px-8 pt-0 pb-8 border-b border-gray-100">
            <div className="flex justify-between items-end">
              <div className="flex items-end gap-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center text-3xl font-bold text-slate-500 shadow-md">
                    RK
                  </div>
                  <button className="absolute bottom-2 right-0 p-2 bg-[#0F4C5C] text-white rounded-full shadow-lg hover:bg-[#145369] transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <div className="mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {user.name}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-500 mt-1">
                    <span className="font-medium">{user.role}</span>
                    <span>•</span>
                    <span className="text-sm bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                      {user.empId}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 ${isEditing ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-[#0F4C5C] text-white hover:bg-[#145369]'}`}>

                {isEditing ?
                <>
                    <X className="h-4 w-4" /> Cancel
                  </> :

                <>
                    <Edit2 className="h-4 w-4" /> Edit Profile
                  </>
                }
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="grid grid-cols-3 gap-8 p-8">
            {/* Left Column - Info */}
            <div className="col-span-2 space-y-8">
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Contact Information
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">
                      Email Address
                    </label>
                    {isEditing ?
                    <input
                      type="email"
                      value={user.email}
                      onChange={(e) =>
                      setUser({
                        ...user,
                        email: e.target.value
                      })
                      }
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#0F4C5C] focus:border-[#0F4C5C] text-sm" /> :


                    <div className="flex items-center gap-2 text-gray-900">
                        <Mail className="h-4 w-4 text-gray-400" />
                        {user.email}
                      </div>
                    }
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">
                      Phone Number
                    </label>
                    {isEditing ?
                    <input
                      type="text"
                      value={user.phone}
                      onChange={(e) =>
                      setUser({
                        ...user,
                        phone: e.target.value
                      })
                      }
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#0F4C5C] focus:border-[#0F4C5C] text-sm" /> :


                    <div className="flex items-center gap-2 text-gray-900">
                        <Phone className="h-4 w-4 text-gray-400" />
                        {user.phone}
                      </div>
                    }
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Work Information
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">
                      Department
                    </label>
                    <div className="flex items-center gap-2 text-gray-900">
                      <Building className="h-4 w-4 text-gray-400" />
                      {user.department}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">
                      Date Joined
                    </label>
                    <div className="flex items-center gap-2 text-gray-900">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {user.joinDate}
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Bio
                </h3>
                {isEditing ?
                <textarea
                  value={user.bio}
                  onChange={(e) =>
                  setUser({
                    ...user,
                    bio: e.target.value
                  })
                  }
                  rows={4}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#0F4C5C] focus:border-[#0F4C5C] text-sm" /> :


                <p className="text-gray-600 leading-relaxed">{user.bio}</p>
                }
              </section>

              {isEditing &&
              <div className="flex justify-end pt-4">
                  <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2.5 bg-[#0F4C5C] text-white rounded-lg font-medium hover:bg-[#145369] transition-colors shadow-sm flex items-center gap-2">

                    <Save className="h-4 w-4" /> Save Changes
                  </button>
                </div>
              }
            </div>

            {/* Right Column - Stats/Badges */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                  Account Status
                </h4>
                <div className="flex items-center gap-3 text-emerald-700 bg-emerald-50 px-4 py-3 rounded-lg border border-emerald-100">
                  <BadgeCheck className="h-5 w-5" />
                  <span className="font-medium">Active & Verified</span>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Last Login</span>
                    <span className="text-gray-900 font-medium">
                      Today, 10:30 AM
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Password Changed</span>
                    <span className="text-gray-900 font-medium">
                      3 months ago
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}