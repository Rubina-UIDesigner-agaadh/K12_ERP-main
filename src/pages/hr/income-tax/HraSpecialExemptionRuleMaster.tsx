import React, { useState, Children } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Tabs } from '../../../components/ui/Tabs';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  Search,
  Home,
  Plane,
  BookOpen,
  CheckCircle } from
'lucide-react';
interface HraRule {
  id: string;
  ruleName: string;
  financialYear: string;
  applicableRegimes: string;
  metroPercent: number;
  nonMetroPercent: number;
  salaryDefinition: string;
  status: 'Active' | 'Inactive';
}
interface SpecialExemption {
  id: string;
  exemptionName: string;
  linkedPayHeadCode: string;
  linkedSectionCode: string;
  maximumAnnualAmount: number;
  frequency: 'Yearly' | 'Once in 2 Years' | 'Once in 4 Years' | 'Monthly';
  eligibleStaffTypes: string;
  requiresProof: boolean;
  status: 'Active' | 'Inactive';
}
const mockHraRules: HraRule[] = [
{
  id: 'HR001',
  ruleName: 'Standard HRA Rule 2025-26',
  financialYear: 'FY 2025-26',
  applicableRegimes: 'Old Regime',
  metroPercent: 50,
  nonMetroPercent: 40,
  salaryDefinition: 'Basic + DA',
  status: 'Active'
},
{
  id: 'HR002',
  ruleName: 'Standard HRA Rule 2024-25',
  financialYear: 'FY 2024-25',
  applicableRegimes: 'Old Regime',
  metroPercent: 50,
  nonMetroPercent: 40,
  salaryDefinition: 'Basic + DA',
  status: 'Inactive'
}];

const mockSpecialExemptions: SpecialExemption[] = [
{
  id: 'SE001',
  exemptionName: 'Leave Travel Allowance (LTA)',
  linkedPayHeadCode: 'LTA',
  linkedSectionCode: '10(5)',
  maximumAnnualAmount: 0,
  frequency: 'Once in 2 Years',
  eligibleStaffTypes: 'All',
  requiresProof: true,
  status: 'Active'
},
{
  id: 'SE002',
  exemptionName: 'Children Education Allowance',
  linkedPayHeadCode: 'CEA',
  linkedSectionCode: '10(14)',
  maximumAnnualAmount: 2400,
  frequency: 'Yearly',
  eligibleStaffTypes: 'All',
  requiresProof: false,
  status: 'Active'
},
{
  id: 'SE003',
  exemptionName: 'Hostel Expenditure Allowance',
  linkedPayHeadCode: 'HOSTEL',
  linkedSectionCode: '10(14)',
  maximumAnnualAmount: 7200,
  frequency: 'Yearly',
  eligibleStaffTypes: 'All',
  requiresProof: false,
  status: 'Active'
},
{
  id: 'SE004',
  exemptionName: 'Uniform Allowance',
  linkedPayHeadCode: 'UNIF',
  linkedSectionCode: '10(14)',
  maximumAnnualAmount: 0,
  frequency: 'Yearly',
  eligibleStaffTypes: 'Teaching, Administrative',
  requiresProof: true,
  status: 'Active'
}];

const emptyHraForm = {
  ruleName: '',
  financialYear: 'FY 2025-26',
  applicableRegimes: 'Old Regime',
  metroPercent: 50,
  nonMetroPercent: 40,
  salaryDefinition: 'Basic + DA'
};
const emptyExemptionForm = {
  exemptionName: '',
  linkedPayHeadCode: '',
  linkedSectionCode: '',
  maximumAnnualAmount: 0,
  frequency: 'Yearly' as SpecialExemption['frequency'],
  eligibleStaffTypes: 'All',
  requiresProof: false
};
export function HraSpecialExemptionRuleMaster() {
  const [hraRules, setHraRules] = useState(mockHraRules);
  const [exemptions, setExemptions] = useState(mockSpecialExemptions);
  const [activeTab, setActiveTab] = useState('hra');
  const [showHraForm, setShowHraForm] = useState(false);
  const [showExemptionForm, setShowExemptionForm] = useState(false);
  const [editHraId, setEditHraId] = useState<string | null>(null);
  const [editExemptionId, setEditExemptionId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [hraForm, setHraForm] = useState(emptyHraForm);
  const [exemptionForm, setExemptionForm] = useState(emptyExemptionForm);
  const filteredHra = hraRules.filter((r) =>
  r.ruleName.toLowerCase().includes(search.toLowerCase())
  );
  const filteredExemptions = exemptions.filter(
    (e) =>
    e.exemptionName.toLowerCase().includes(search.toLowerCase()) ||
    e.linkedSectionCode.toLowerCase().includes(search.toLowerCase())
  );
  const handleSaveHra = () => {
    if (editHraId) {
      setHraRules((prev) =>
      prev.map((r) =>
      r.id === editHraId ?
      {
        ...r,
        ...hraForm
      } :
      r
      )
      );
    } else {
      setHraRules((prev) => [
      ...prev,
      {
        ...hraForm,
        id: `HR${Date.now()}`,
        status: 'Active' as const
      }]
      );
    }
    setHraForm(emptyHraForm);
    setShowHraForm(false);
    setEditHraId(null);
  };
  const handleSaveExemption = () => {
    if (editExemptionId) {
      setExemptions((prev) =>
      prev.map((e) =>
      e.id === editExemptionId ?
      {
        ...e,
        ...exemptionForm
      } :
      e
      )
      );
    } else {
      setExemptions((prev) => [
      ...prev,
      {
        ...exemptionForm,
        id: `SE${Date.now()}`,
        status: 'Active' as const
      }]
      );
    }
    setExemptionForm(emptyExemptionForm);
    setShowExemptionForm(false);
    setEditExemptionId(null);
  };
  const handleEditHra = (r: HraRule) => {
    setHraForm({
      ruleName: r.ruleName,
      financialYear: r.financialYear,
      applicableRegimes: r.applicableRegimes,
      metroPercent: r.metroPercent,
      nonMetroPercent: r.nonMetroPercent,
      salaryDefinition: r.salaryDefinition
    });
    setEditHraId(r.id);
    setShowHraForm(true);
  };
  const handleEditExemption = (e: SpecialExemption) => {
    setExemptionForm({
      exemptionName: e.exemptionName,
      linkedPayHeadCode: e.linkedPayHeadCode,
      linkedSectionCode: e.linkedSectionCode,
      maximumAnnualAmount: e.maximumAnnualAmount,
      frequency: e.frequency,
      eligibleStaffTypes: e.eligibleStaffTypes,
      requiresProof: e.requiresProof
    });
    setEditExemptionId(e.id);
    setShowExemptionForm(true);
  };
  const tabs = [
  {
    id: 'hra',
    label: 'HRA Rules'
  },
  {
    id: 'special',
    label: 'Special Exemptions (LTA, CEA, etc.)'
  }];

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            HRA & Special Exemption Rule Master
          </h1>
          <p className="text-sm text-gray-500">
            Configure HRA calculation rules and special exemptions like LTA, CEA
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            if (activeTab === 'hra') {
              setHraForm(emptyHraForm);
              setShowHraForm(true);
            } else {
              setExemptionForm(emptyExemptionForm);
              setShowExemptionForm(true);
            }
          }}>

          <Plus className="w-4 h-4 mr-2" />
          {activeTab === 'hra' ? 'Add HRA Rule' : 'Add Exemption'}
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Home className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{hraRules.length}</p>
            <p className="text-xs text-gray-500">HRA Rules</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <Plane className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{exemptions.length}</p>
            <p className="text-xs text-gray-500">Special Exemptions</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <Home className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xl font-bold">50% / 40%</p>
            <p className="text-xs text-gray-500">Metro / Non-Metro HRA</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xl font-bold">
              {exemptions.filter((e) => e.requiresProof).length}
            </p>
            <p className="text-xs text-gray-500">Proof Required</p>
          </div>
        </div>
      </div>

      <Card>
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(t) => {
            setActiveTab(t);
            setSearch('');
            setShowHraForm(false);
            setShowExemptionForm(false);
          }} />

        <div className="mt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

            </div>
          </div>

          {activeTab === 'hra' &&
          <>
              {showHraForm &&
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    {editHraId ? 'Edit HRA Rule' : 'New HRA Rule'}
                  </h3>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <Input
                  label="Rule Name *"
                  value={hraForm.ruleName}
                  onChange={(e) =>
                  setHraForm({
                    ...hraForm,
                    ruleName: e.target.value
                  })
                  }
                  placeholder="e.g., Standard HRA Rule 2025-26" />

                    <Select
                  label="Financial Year *"
                  options={[
                  {
                    value: 'FY 2025-26',
                    label: 'FY 2025-26'
                  },
                  {
                    value: 'FY 2024-25',
                    label: 'FY 2024-25'
                  }]
                  }
                  value={hraForm.financialYear}
                  onChange={(e) =>
                  setHraForm({
                    ...hraForm,
                    financialYear: e.target.value
                  })
                  } />

                    <Select
                  label="Applicable Regimes"
                  options={[
                  {
                    value: 'Old Regime',
                    label: 'Old Regime Only'
                  },
                  {
                    value: 'Both',
                    label: 'Both Regimes'
                  }]
                  }
                  value={hraForm.applicableRegimes}
                  onChange={(e) =>
                  setHraForm({
                    ...hraForm,
                    applicableRegimes: e.target.value
                  })
                  } />

                    <Select
                  label="Salary Definition for HRA"
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
                  value={hraForm.salaryDefinition}
                  onChange={(e) =>
                  setHraForm({
                    ...hraForm,
                    salaryDefinition: e.target.value
                  })
                  } />

                    <Input
                  label="Metro City HRA % (of salary)"
                  type="number"
                  value={hraForm.metroPercent}
                  onChange={(e) =>
                  setHraForm({
                    ...hraForm,
                    metroPercent: parseFloat(e.target.value) || 0
                  })
                  } />

                    <Input
                  label="Non-Metro City HRA % (of salary)"
                  type="number"
                  value={hraForm.nonMetroPercent}
                  onChange={(e) =>
                  setHraForm({
                    ...hraForm,
                    nonMetroPercent: parseFloat(e.target.value) || 0
                  })
                  } />

                  </div>
                  <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-700 font-medium">
                      HRA Exemption = Least of:
                    </p>
                    <ul className="text-xs text-blue-600 mt-1 space-y-0.5 list-disc list-inside">
                      <li>Actual HRA received</li>
                      <li>
                        {hraForm.metroPercent}% (Metro) /{' '}
                        {hraForm.nonMetroPercent}% (Non-Metro) of{' '}
                        {hraForm.salaryDefinition}
                      </li>
                      <li>Rent paid minus 10% of {hraForm.salaryDefinition}</li>
                    </ul>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="primary" onClick={handleSaveHra}>
                      <Save className="w-4 h-4 mr-2" />
                      {editHraId ? 'Update' : 'Add'} Rule
                    </Button>
                    <Button
                  variant="outline"
                  onClick={() => {
                    setShowHraForm(false);
                    setEditHraId(null);
                  }}>

                      Cancel
                    </Button>
                  </div>
                </div>
            }
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200 bg-gray-50">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Rule Name
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        FY
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Regime
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Metro %
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Non-Metro %
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Salary Basis
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Status
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHra.map((r, i) =>
                  <tr
                    key={r.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 ? 'bg-gray-50/30' : ''}`}>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Home className="w-4 h-4 text-blue-500" />
                            <p className="text-sm font-semibold text-gray-900">
                              {r.ruleName}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-gray-600">
                          {r.financialYear}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="secondary">
                            {r.applicableRegimes}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center text-sm font-semibold text-blue-700">
                          {r.metroPercent}%
                        </td>
                        <td className="py-3 px-4 text-center text-sm font-semibold text-purple-700">
                          {r.nonMetroPercent}%
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-gray-600">
                          {r.salaryDefinition}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge
                        variant={
                        r.status === 'Active' ? 'success' : 'secondary'
                        }>

                            {r.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                          onClick={() => handleEditHra(r)}
                          className="p-1.5 hover:bg-blue-100 rounded-lg">

                              <Edit className="w-4 h-4 text-blue-600" />
                            </button>
                            <button className="p-1.5 hover:bg-red-100 rounded-lg">
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </>
          }

          {activeTab === 'special' &&
          <>
              {showExemptionForm &&
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    {editExemptionId ?
                'Edit Exemption' :
                'New Special Exemption'}
                  </h3>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <Input
                  label="Exemption Name *"
                  value={exemptionForm.exemptionName}
                  onChange={(e) =>
                  setExemptionForm({
                    ...exemptionForm,
                    exemptionName: e.target.value
                  })
                  }
                  placeholder="e.g., Leave Travel Allowance" />

                    <Input
                  label="Linked Pay Head Code"
                  value={exemptionForm.linkedPayHeadCode}
                  onChange={(e) =>
                  setExemptionForm({
                    ...exemptionForm,
                    linkedPayHeadCode: e.target.value
                  })
                  }
                  placeholder="e.g., LTA" />

                    <Input
                  label="Linked Section Code"
                  value={exemptionForm.linkedSectionCode}
                  onChange={(e) =>
                  setExemptionForm({
                    ...exemptionForm,
                    linkedSectionCode: e.target.value
                  })
                  }
                  placeholder="e.g., 10(5)" />

                    <Input
                  label="Maximum Annual Amount (₹, 0 = No Limit)"
                  type="number"
                  value={exemptionForm.maximumAnnualAmount}
                  onChange={(e) =>
                  setExemptionForm({
                    ...exemptionForm,
                    maximumAnnualAmount: parseInt(e.target.value) || 0
                  })
                  } />

                    <Select
                  label="Frequency"
                  options={[
                  {
                    value: 'Yearly',
                    label: 'Yearly'
                  },
                  {
                    value: 'Once in 2 Years',
                    label: 'Once in 2 Years'
                  },
                  {
                    value: 'Once in 4 Years',
                    label: 'Once in 4 Years'
                  },
                  {
                    value: 'Monthly',
                    label: 'Monthly'
                  }]
                  }
                  value={exemptionForm.frequency}
                  onChange={(e) =>
                  setExemptionForm({
                    ...exemptionForm,
                    frequency: e.target.value as any
                  })
                  } />

                    <Input
                  label="Eligible Staff Types"
                  value={exemptionForm.eligibleStaffTypes}
                  onChange={(e) =>
                  setExemptionForm({
                    ...exemptionForm,
                    eligibleStaffTypes: e.target.value
                  })
                  }
                  placeholder="e.g., All or Teaching, Administrative" />

                    <label className="flex items-center gap-2 cursor-pointer col-span-2">
                      <input
                    type="checkbox"
                    checked={exemptionForm.requiresProof}
                    onChange={(e) =>
                    setExemptionForm({
                      ...exemptionForm,
                      requiresProof: e.target.checked
                    })
                    }
                    className="w-4 h-4 text-blue-600 rounded" />

                      <span className="text-sm text-gray-700">
                        Requires Proof Submission
                      </span>
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="primary" onClick={handleSaveExemption}>
                      <Save className="w-4 h-4 mr-2" />
                      {editExemptionId ? 'Update' : 'Add'} Exemption
                    </Button>
                    <Button
                  variant="outline"
                  onClick={() => {
                    setShowExemptionForm(false);
                    setEditExemptionId(null);
                  }}>

                      Cancel
                    </Button>
                  </div>
                </div>
            }
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200 bg-gray-50">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Exemption
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Pay Head
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Section
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Max Amount
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Frequency
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Proof
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Status
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExemptions.map((e, i) =>
                  <tr
                    key={e.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 ? 'bg-gray-50/30' : ''}`}>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Plane className="w-4 h-4 text-green-500" />
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {e.exemptionName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {e.eligibleStaffTypes}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-gray-600">
                          {e.linkedPayHeadCode || '—'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="info">{e.linkedSectionCode}</Badge>
                        </td>
                        <td className="py-3 px-4 text-right text-sm text-gray-700">
                          {e.maximumAnnualAmount > 0 ?
                      `₹${e.maximumAnnualAmount.toLocaleString()}` :
                      'No Limit'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="secondary">{e.frequency}</Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge
                        variant={e.requiresProof ? 'warning' : 'secondary'}>

                            {e.requiresProof ? 'Yes' : 'No'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge
                        variant={
                        e.status === 'Active' ? 'success' : 'secondary'
                        }>

                            {e.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                          onClick={() => handleEditExemption(e)}
                          className="p-1.5 hover:bg-blue-100 rounded-lg">

                              <Edit className="w-4 h-4 text-blue-600" />
                            </button>
                            <button className="p-1.5 hover:bg-red-100 rounded-lg">
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </>
          }
        </div>
      </Card>
    </div>);

}