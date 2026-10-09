import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Tabs } from '../../../components/ui/Tabs';
import {
  Save,
  Settings,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle } from
'lucide-react';
interface StaffTypeGradeMapping {
  staffType: string;
  defaultGrade: string;
}
interface PayrollSetupConfig {
  defaultPayrollCalendar: string;
  defaultWorkingDaysBasis: 'Calendar Days' | 'Working Days' | 'Fixed 30';
  defaultAttendanceRuleSet: string;
  lopCalculationBasis: 'Basic' | 'Basic + DA' | 'Gross';
  netPayRounding: 'No Rounding' | 'Round Up' | 'Round Down' | 'Nearest';
  payHeadRounding: 'No Rounding' | 'Round Up' | 'Round Down' | 'Nearest';
  postToFinance: boolean;
  enableLoansAdvances: boolean;
  enableArrearsProcessing: boolean;
  enableBonus: boolean;
  staffTypeGradeMappings: StaffTypeGradeMapping[];
}
const initialConfig: PayrollSetupConfig = {
  defaultPayrollCalendar: 'Monthly Payroll 2025-26',
  defaultWorkingDaysBasis: 'Working Days',
  defaultAttendanceRuleSet: 'Standard Attendance Rule',
  lopCalculationBasis: 'Basic + DA',
  netPayRounding: 'Nearest',
  payHeadRounding: 'No Rounding',
  postToFinance: true,
  enableLoansAdvances: true,
  enableArrearsProcessing: true,
  enableBonus: true,
  staffTypeGradeMappings: [
  {
    staffType: 'Teaching – Senior',
    defaultGrade: 'Grade A – Senior'
  },
  {
    staffType: 'Teaching – Regular',
    defaultGrade: 'Grade B – Regular'
  },
  {
    staffType: 'Non-Teaching',
    defaultGrade: 'Grade C – Junior'
  },
  {
    staffType: 'Support Staff',
    defaultGrade: 'Grade D – Support'
  }]

};
export function PayrollSetup() {
  const [config, setConfig] = useState(initialConfig);
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  const tabs = [
  {
    id: 'general',
    label: 'General Settings'
  },
  {
    id: 'lop',
    label: 'LOP & Rounding'
  },
  {
    id: 'grade-mapping',
    label: 'Grade Mapping'
  },
  {
    id: 'features',
    label: 'Features & Modules'
  }];

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll Setup</h1>
          <p className="text-sm text-gray-500">
            Central configuration for the payroll engine
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saved &&
          <div className="flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Settings saved</span>
            </div>
          }
          <Button variant="primary" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Monthly</p>
            <p className="text-xs text-gray-500">Payroll Frequency</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <Settings className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {config.defaultWorkingDaysBasis}
            </p>
            <p className="text-xs text-gray-500">Working Days Basis</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {config.lopCalculationBasis}
            </p>
            <p className="text-xs text-gray-500">LOP Basis</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {config.staffTypeGradeMappings.length}
            </p>
            <p className="text-xs text-gray-500">Grade Mappings</p>
          </div>
        </div>
      </div>

      <Card>
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        <div className="mt-6">
          {activeTab === 'general' &&
          <div className="grid grid-cols-2 gap-4">
              <Select
              label="Default Payroll Calendar"
              options={[
              {
                value: 'Monthly Payroll 2025-26',
                label: 'Monthly Payroll 2025-26'
              },
              {
                value: 'Monthly Payroll 2024-25',
                label: 'Monthly Payroll 2024-25'
              }]
              }
              value={config.defaultPayrollCalendar}
              onChange={(e) =>
              setConfig({
                ...config,
                defaultPayrollCalendar: e.target.value
              })
              } />

              <Select
              label="Default Working Days Basis"
              options={[
              {
                value: 'Calendar Days',
                label: 'Calendar Days'
              },
              {
                value: 'Working Days',
                label: 'Working Days'
              },
              {
                value: 'Fixed 30',
                label: 'Fixed 30 Days'
              }]
              }
              value={config.defaultWorkingDaysBasis}
              onChange={(e) =>
              setConfig({
                ...config,
                defaultWorkingDaysBasis: e.target.value as any
              })
              } />

              <Select
              label="Default Attendance Rule Set (for LOP)"
              options={[
              {
                value: 'Standard Attendance Rule',
                label: 'Standard Attendance Rule'
              },
              {
                value: 'Strict Attendance Rule',
                label: 'Strict Attendance Rule'
              }]
              }
              value={config.defaultAttendanceRuleSet}
              onChange={(e) =>
              setConfig({
                ...config,
                defaultAttendanceRuleSet: e.target.value
              })
              } />

              <div className="flex items-center gap-3 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                  type="checkbox"
                  checked={config.postToFinance}
                  onChange={(e) =>
                  setConfig({
                    ...config,
                    postToFinance: e.target.checked
                  })
                  }
                  className="w-4 h-4 text-blue-600 rounded" />

                  <span className="text-sm text-gray-700">
                    Post Payroll Entries to Finance Module
                  </span>
                </label>
              </div>
            </div>
          }

          {activeTab === 'lop' &&
          <div className="grid grid-cols-2 gap-4">
              <Select
              label="LOP Calculation Basis"
              options={[
              {
                value: 'Basic',
                label: 'Basic Only'
              },
              {
                value: 'Basic + DA',
                label: 'Basic + DA'
              },
              {
                value: 'Gross',
                label: 'Gross Salary'
              }]
              }
              value={config.lopCalculationBasis}
              onChange={(e) =>
              setConfig({
                ...config,
                lopCalculationBasis: e.target.value as any
              })
              } />

              <Select
              label="Net Pay Rounding Rule"
              options={[
              {
                value: 'No Rounding',
                label: 'No Rounding'
              },
              {
                value: 'Round Up',
                label: 'Round Up'
              },
              {
                value: 'Round Down',
                label: 'Round Down'
              },
              {
                value: 'Nearest',
                label: 'Nearest Rupee'
              }]
              }
              value={config.netPayRounding}
              onChange={(e) =>
              setConfig({
                ...config,
                netPayRounding: e.target.value as any
              })
              } />

              <Select
              label="Individual Pay Head Rounding"
              options={[
              {
                value: 'No Rounding',
                label: 'No Rounding'
              },
              {
                value: 'Round Up',
                label: 'Round Up'
              },
              {
                value: 'Round Down',
                label: 'Round Down'
              },
              {
                value: 'Nearest',
                label: 'Nearest Rupee'
              }]
              }
              value={config.payHeadRounding}
              onChange={(e) =>
              setConfig({
                ...config,
                payHeadRounding: e.target.value as any
              })
              } />

            </div>
          }

          {activeTab === 'grade-mapping' &&
          <div>
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  Map each staff type to its default salary grade. This is used
                  when creating new employee pay structures.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200 bg-gray-50">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Staff Type
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Default Salary Grade
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {config.staffTypeGradeMappings.map((m, i) =>
                  <tr key={i} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-sm font-medium text-gray-800">
                          {m.staffType}
                        </td>
                        <td className="py-3 px-4">
                          <Select
                        options={[
                        {
                          value: 'Grade A – Senior',
                          label: 'Grade A – Senior'
                        },
                        {
                          value: 'Grade B – Regular',
                          label: 'Grade B – Regular'
                        },
                        {
                          value: 'Grade C – Junior',
                          label: 'Grade C – Junior'
                        },
                        {
                          value: 'Grade D – Support',
                          label: 'Grade D – Support'
                        }]
                        }
                        value={m.defaultGrade}
                        onChange={(e) => {
                          const updated = [...config.staffTypeGradeMappings];
                          updated[i] = {
                            ...updated[i],
                            defaultGrade: e.target.value
                          };
                          setConfig({
                            ...config,
                            staffTypeGradeMappings: updated
                          });
                        }} />

                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </div>
          }

          {activeTab === 'features' &&
          <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Enable or disable payroll sub-modules. Disabling a module hides
                it from the payroll workflow.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
              {
                key: 'enableLoansAdvances',
                label: 'Loans & Advances',
                desc: 'Track employee loans and salary advances'
              },
              {
                key: 'enableArrearsProcessing',
                label: 'Arrears Processing',
                desc: 'Process salary arrears for past periods'
              },
              {
                key: 'enableBonus',
                label: 'Bonus / Ex-gratia',
                desc: 'Process bonus and ex-gratia payments'
              },
              {
                key: 'postToFinance',
                label: 'Finance Integration',
                desc: 'Auto-post payroll entries to finance ledger'
              }].
              map(({ key, label, desc }) =>
              <div
                key={key}
                className={`p-4 rounded-lg border-2 transition-colors ${(config as any)[key] ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white'}`}>

                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {label}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer ml-4">
                        <input
                      type="checkbox"
                      checked={(config as any)[key]}
                      onChange={(e) =>
                      setConfig({
                        ...config,
                        [key]: e.target.checked
                      })
                      }
                      className="sr-only peer" />

                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
              )}
              </div>
            </div>
          }
        </div>
      </Card>
    </div>);

}