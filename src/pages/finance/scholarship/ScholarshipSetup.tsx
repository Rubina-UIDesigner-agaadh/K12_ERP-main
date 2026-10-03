import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import {
  Settings2,
  Save,
  Globe,
  Cpu,
  ShieldCheck,
  Info,
  RefreshCcw,
  Layers,
  UserCircle,
  AlertTriangle,
  Zap,
  CheckCircle2 } from
'lucide-react';

export function ScholarshipSetup() {
  // Global Setup State
  const [setup, setSetup] = useState({
    allowPortalApplication: true,
    autoApproveOnMatch: false,
    approvalWorkflow: 'single', // 'single' or 'multi'
    requireDocumentVerification: true
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Scholarship configurations updated successfully.");
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            Scholarship Global Setup <Settings2 className="w-6 h-6 text-indigo-600" />
          </h1>
          <p className="text-sm text-gray-500">Configure portal access, automation rules, and sanctioning workflows</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCcw className="w-4 h-4 mr-2" /> Reset to Default
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" /> {isSaving ? 'Applying...' : 'Save Settings'}
          </Button>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 gap-6">
        
        {/* Portal & Accessibility */}
        <Card className="p-8 border-l-4 border-l-blue-600 shadow-sm">
          <div className="flex items-start justify-between gap-6">
            <div className="flex gap-4">
              <div className="p-3 bg-blue-50 rounded-2xl h-fit">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 leading-tight">Portal Accessibility</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-md">
                  Allow students to view available schemes and submit scholarship applications directly from their mobile app/web portal.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={setup.allowPortalApplication}
                  onChange={(e) => setSetup({ ...setup, allowPortalApplication: e.target.checked })} />

                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
              <Badge variant={setup.allowPortalApplication ? 'success' : 'secondary'}>
                {setup.allowPortalApplication ? 'Public Access' : 'Internal Only'}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Automation & Evaluation Logic */}
        <Card className="p-8 border-l-4 border-l-yellow-500 shadow-sm">
          <div className="flex items-start justify-between gap-6">
            <div className="flex gap-4">
              <div className="p-3 bg-yellow-50 rounded-2xl h-fit">
                <Cpu className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 leading-tight">Auto-approve on Logic Match</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-md">
                  Enable the system to automatically move applications to the "Sanctioned" state if all criteria defined in the Master are met perfectly.
                </p>
                {setup.autoApproveOnMatch &&
                <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-red-900">High Risk Setting Detected</p>
                      <p className="text-[11px] text-red-700 italic mt-0.5">
                        This bypasses manual evaluation. It is recommended for standard sibling or staff concessions only.
                      </p>
                    </div>
                  </div>
                }
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={setup.autoApproveOnMatch}
                onChange={(e) => setSetup({ ...setup, autoApproveOnMatch: e.target.checked })} />

              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:bg-yellow-600"></div>
            </label>
          </div>
        </Card>

        {/* Governance & Approval Levels */}
        <Card className="p-8 border-l-4 border-l-indigo-600 shadow-sm">
          <div className="flex items-start justify-between gap-6 mb-8">
            <div className="flex gap-4">
              <div className="p-3 bg-indigo-50 rounded-2xl h-fit">
                <ShieldCheck className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 leading-tight">Approval Hierarchy</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-md">
                  Define the complexity of the sanctioning workflow. Multi-level requires both an evaluator and a final authority.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSetup({ ...setup, approvalWorkflow: 'single' })}
              className={`p-6 rounded-2xl border-2 text-left transition-all ${setup.approvalWorkflow === 'single' ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-gray-100 opacity-60'}`}>

              <UserCircle className={`w-8 h-8 mb-4 ${setup.approvalWorkflow === 'single' ? 'text-indigo-600' : 'text-gray-400'}`} />
              <h4 className="font-bold text-gray-900">Single-Level</h4>
              <p className="text-xs text-gray-500 mt-1">One administrator approves and sanctions immediately.</p>
            </button>

            <button
              onClick={() => setSetup({ ...setup, approvalWorkflow: 'multi' })}
              className={`p-6 rounded-2xl border-2 text-left transition-all ${setup.approvalWorkflow === 'multi' ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-gray-100 opacity-60'}`}>

              <Layers className={`w-8 h-8 mb-4 ${setup.approvalWorkflow === 'multi' ? 'text-indigo-600' : 'text-gray-400'}`} />
              <h4 className="font-bold text-gray-900">Multi-Level</h4>
              <p className="text-xs text-gray-500 mt-1">Evaluator recommends → Principal/Accountant sanctions.</p>
            </button>
          </div>
        </Card>
      </div>

      {/* Summary Note */}
      <div className="p-6 bg-slate-900 rounded-3xl text-white shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-yellow-400" />
           </div>
           <div>
              <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Active Governance Policy</p>
              <h4 className="text-lg font-black italic">
                {setup.approvalWorkflow === 'multi' ? 'Secured Multi-Level Workflow' : 'Streamlined Approval Process'}
              </h4>
           </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs font-bold bg-white/10 px-4 py-2 rounded-full">
           <CheckCircle2 className="w-4 h-4 text-green-400" /> System Reconciled
        </div>
      </div>

      {/* Info Footnote */}
      <div className="flex justify-center items-center gap-2 text-[11px] text-gray-400 italic">
        <Info className="w-3 h-3" />
        Settings updated here will affect the Scholarship Evaluation and Application modules institution-wide.
      </div>
    </div>);

}