import React, { useState } from 'react';
import {
  School,
  Lock,
  User,
  Mail,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  HelpCircle
} from
  'lucide-react';
interface LoginPageProps {
  onLogin: () => void;
}
export function LoginPage({ onLogin }: LoginPageProps) {
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (formData.identifier && formData.password) {
        onLogin();
      }
    }, 1000);
  };
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 font-sans">
      {/* Main Card */}
      <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="p-8 pb-6">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="h-16 w-16 bg-[#0F4C5C] rounded-full flex items-center justify-center mb-4 shadow-lg shadow-cyan-900/20">
              <School className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              School ERP
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              Management System
            </p>
          </div>

          {/* Welcome Text */}
          <div className="mb-8 text-center">
            <h2 className="text-xl font-semibold text-slate-800 mb-1">
              Welcome Back
            </h2>
            <p className="text-slate-500 text-sm">
              Sign in to access your account
            </p>
          </div>

          {/* Login Method Toggle */}
          <div className="flex p-1 bg-slate-100 rounded-lg mb-6">
            <button
              type="button"
              onClick={() => setLoginMethod('phone')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${loginMethod === 'phone' ? 'bg-[#0F4C5C] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>

              Phone Login
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('email')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${loginMethod === 'email' ? 'bg-[#0F4C5C] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>

              Email Login
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {loginMethod === 'phone' ?
                  'Username / Employee ID' :
                  'Email Address'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {loginMethod === 'phone' ?
                    <User className="h-5 w-5 text-slate-400" /> :

                    <Mail className="h-5 w-5 text-slate-400" />
                  }
                </div>
                <input
                  type={loginMethod === 'phone' ? 'text' : 'email'}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F4C5C] focus:border-[#0F4C5C] bg-white text-slate-900 placeholder-slate-400 transition-colors"
                  placeholder={
                    loginMethod === 'phone' ?
                      'Enter your username or ID' :
                      'Enter your email address'
                  }
                  value={formData.identifier}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      identifier: e.target.value
                    })
                  }
                  required />

              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="block w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F4C5C] focus:border-[#0F4C5C] bg-white text-slate-900 placeholder-slate-400 transition-colors"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value
                    })
                  }
                  required />

                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}>

                  {showPassword ?
                    <EyeOff className="h-5 w-5" /> :

                    <Eye className="h-5 w-5" />
                  }
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#0F4C5C] focus:ring-[#0F4C5C] border-slate-300 rounded"
                  checked={formData.rememberMe}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rememberMe: e.target.checked
                    })
                  } />

                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-slate-600">

                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-[#0F4C5C] hover:text-[#168AAD] transition-colors">

                  Forgot Password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#0F4C5C] hover:bg-[#145369] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F4C5C] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed">

              {isLoading ?
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> :

                'Sign In'
              }
            </button>
          </form>
        </div>

        {/* Security Notice */}
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 leading-relaxed">
              Secure authentication with session management and audit logging
              enabled. Your IP address will be recorded for security purposes.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500 flex items-center justify-center gap-2">
          Having trouble signing in?
          <a
            href="#"
            className="font-medium text-[#0F4C5C] hover:text-[#168AAD] transition-colors flex items-center gap-1">

            Contact IT Support
            <ArrowRight className="h-3 w-3" />
          </a>
        </p>
      </div>
    </div>);

}