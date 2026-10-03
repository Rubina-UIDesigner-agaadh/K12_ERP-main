import React, { useState } from 'react';
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
  CreditCard,
  Building2,
  CheckCircle,
  Star } from
'lucide-react';
interface DisbursementMode {
  id: string;
  modeCode: string;
  modeName: string;
  isDefault: boolean;
  status: 'Active' | 'Inactive';
}
interface BankSetup {
  id: string;
  bankName: string;
  branch: string;
  ifscCode: string;
  swiftCode: string;
  accountNumber: string;
  disbursementMode: string;
  isDefaultForPayroll: boolean;
  fileFormat: string;
  status: 'Active' | 'Inactive';
}
const mockModes: DisbursementMode[] = [
{
  id: 'DM001',
  modeCode: 'CASH',
  modeName: 'Cash',
  isDefault: false,
  status: 'Active'
},
{
  id: 'DM002',
  modeCode: 'CHEQUE',
  modeName: 'Cheque',
  isDefault: false,
  status: 'Active'
},
{
  id: 'DM003',
  modeCode: 'NEFT',
  modeName: 'Bank Transfer (NEFT/RTGS)',
  isDefault: true,
  status: 'Active'
},
{
  id: 'DM004',
  modeCode: 'OTHER',
  modeName: 'Other',
  isDefault: false,
  status: 'Active'
}];

const mockBanks: BankSetup[] = [
{
  id: 'BS001',
  bankName: 'State Bank of India',
  branch: 'Main Branch',
  ifscCode: 'SBIN0001234',
  swiftCode: 'SBININBB',
  accountNumber: '1234567890123',
  disbursementMode: 'Bank Transfer (NEFT/RTGS)',
  isDefaultForPayroll: true,
  fileFormat: 'SBI Corporate Net Banking CSV',
  status: 'Active'
},
{
  id: 'BS002',
  bankName: 'HDFC Bank',
  branch: 'City Branch',
  ifscCode: 'HDFC0001234',
  swiftCode: 'HDFCINBB',
  accountNumber: '9876543210987',
  disbursementMode: 'Bank Transfer (NEFT/RTGS)',
  isDefaultForPayroll: false,
  fileFormat: 'HDFC Salary Upload CSV',
  status: 'Active'
},
{
  id: 'BS003',
  bankName: 'ICICI Bank',
  branch: 'Corporate Branch',
  ifscCode: 'ICIC0001234',
  swiftCode: 'ICICINBB',
  accountNumber: '5555666677778',
  disbursementMode: 'Bank Transfer (NEFT/RTGS)',
  isDefaultForPayroll: false,
  fileFormat: 'ICICI Bulk Transfer CSV',
  status: 'Active'
}];

const emptyModeForm = {
  modeCode: '',
  modeName: '',
  isDefault: false
};
const emptyBankForm = {
  bankName: '',
  branch: '',
  ifscCode: '',
  swiftCode: '',
  accountNumber: '',
  disbursementMode: 'Bank Transfer (NEFT/RTGS)',
  isDefaultForPayroll: false,
  fileFormat: ''
};
export function DisbursementModeBankSetup() {
  const [modes, setModes] = useState(mockModes);
  const [banks, setBanks] = useState(mockBanks);
  const [activeTab, setActiveTab] = useState('modes');
  const [showModeForm, setShowModeForm] = useState(false);
  const [showBankForm, setShowBankForm] = useState(false);
  const [editModeId, setEditModeId] = useState<string | null>(null);
  const [editBankId, setEditBankId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [modeForm, setModeForm] = useState(emptyModeForm);
  const [bankForm, setBankForm] = useState(emptyBankForm);
  const filteredModes = modes.filter(
    (m) =>
    m.modeName.toLowerCase().includes(search.toLowerCase()) ||
    m.modeCode.toLowerCase().includes(search.toLowerCase())
  );
  const filteredBanks = banks.filter(
    (b) =>
    b.bankName.toLowerCase().includes(search.toLowerCase()) ||
    b.ifscCode.toLowerCase().includes(search.toLowerCase())
  );
  const handleSaveMode = () => {
    if (editModeId) {
      setModes((prev) =>
      prev.map((m) =>
      m.id === editModeId ?
      {
        ...m,
        ...modeForm
      } :
      m
      )
      );
    } else {
      setModes((prev) => [
      ...prev,
      {
        ...modeForm,
        id: `DM${Date.now()}`,
        status: 'Active' as const
      }]
      );
    }
    setModeForm(emptyModeForm);
    setShowModeForm(false);
    setEditModeId(null);
  };
  const handleSaveBank = () => {
    if (editBankId) {
      setBanks((prev) =>
      prev.map((b) =>
      b.id === editBankId ?
      {
        ...b,
        ...bankForm
      } :
      b
      )
      );
    } else {
      setBanks((prev) => [
      ...prev,
      {
        ...bankForm,
        id: `BS${Date.now()}`,
        status: 'Active' as const
      }]
      );
    }
    setBankForm(emptyBankForm);
    setShowBankForm(false);
    setEditBankId(null);
  };
  const handleEditMode = (m: DisbursementMode) => {
    setModeForm({
      modeCode: m.modeCode,
      modeName: m.modeName,
      isDefault: m.isDefault
    });
    setEditModeId(m.id);
    setShowModeForm(true);
  };
  const handleEditBank = (b: BankSetup) => {
    setBankForm({
      bankName: b.bankName,
      branch: b.branch,
      ifscCode: b.ifscCode,
      swiftCode: b.swiftCode,
      accountNumber: b.accountNumber,
      disbursementMode: b.disbursementMode,
      isDefaultForPayroll: b.isDefaultForPayroll,
      fileFormat: b.fileFormat
    });
    setEditBankId(b.id);
    setShowBankForm(true);
  };
  const tabs = [
  {
    id: 'modes',
    label: 'Disbursement Modes'
  },
  {
    id: 'banks',
    label: 'Bank Setup'
  }];

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Disbursement Mode / Bank Setup
          </h1>
          <p className="text-sm text-gray-500">
            Configure salary payment modes and institution bank details
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            if (activeTab === 'modes') {
              setModeForm(emptyModeForm);
              setShowModeForm(true);
            } else {
              setBankForm(emptyBankForm);
              setShowBankForm(true);
            }
          }}>

          <Plus className="w-4 h-4 mr-2" />
          {activeTab === 'modes' ? 'Add Mode' : 'Add Bank'}
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{modes.length}</p>
            <p className="text-xs text-gray-500">Payment Modes</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{banks.length}</p>
            <p className="text-xs text-gray-500">Banks Configured</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <Star className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xl font-bold">
              {banks.filter((b) => b.isDefaultForPayroll).length}
            </p>
            <p className="text-xs text-gray-500">Default Bank</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xl font-bold">
              {modes.filter((m) => m.status === 'Active').length}
            </p>
            <p className="text-xs text-gray-500">Active Modes</p>
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
            setShowModeForm(false);
            setShowBankForm(false);
          }} />

        <div className="mt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab === 'modes' ? 'modes' : 'banks'}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

            </div>
          </div>

          {activeTab === 'modes' &&
          <>
              {showModeForm &&
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <Input
                  label="Mode Code *"
                  value={modeForm.modeCode}
                  onChange={(e) =>
                  setModeForm({
                    ...modeForm,
                    modeCode: e.target.value
                  })
                  }
                  placeholder="e.g., NEFT" />

                    <Input
                  label="Mode Name *"
                  value={modeForm.modeName}
                  onChange={(e) =>
                  setModeForm({
                    ...modeForm,
                    modeName: e.target.value
                  })
                  }
                  placeholder="e.g., Bank Transfer (NEFT/RTGS)" />

                    <label className="flex items-center gap-2 cursor-pointer col-span-2">
                      <input
                    type="checkbox"
                    checked={modeForm.isDefault}
                    onChange={(e) =>
                    setModeForm({
                      ...modeForm,
                      isDefault: e.target.checked
                    })
                    }
                    className="w-4 h-4 text-blue-600 rounded" />

                      <span className="text-sm text-gray-700">
                        Set as Default Mode
                      </span>
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="primary" onClick={handleSaveMode}>
                      <Save className="w-4 h-4 mr-2" />
                      {editModeId ? 'Update' : 'Add'} Mode
                    </Button>
                    <Button
                  variant="outline"
                  onClick={() => {
                    setShowModeForm(false);
                    setEditModeId(null);
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
                        Mode
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Default
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
                    {filteredModes.map((m, i) =>
                  <tr
                    key={m.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 ? 'bg-gray-50/30' : ''}`}>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-blue-500" />
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {m.modeName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {m.modeCode}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {m.isDefault && <Badge variant="info">Default</Badge>}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge
                        variant={
                        m.status === 'Active' ? 'success' : 'secondary'
                        }>

                            {m.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                          onClick={() => handleEditMode(m)}
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

          {activeTab === 'banks' &&
          <>
              {showBankForm &&
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <Input
                  label="Bank Name *"
                  value={bankForm.bankName}
                  onChange={(e) =>
                  setBankForm({
                    ...bankForm,
                    bankName: e.target.value
                  })
                  }
                  placeholder="e.g., State Bank of India" />

                    <Input
                  label="Branch"
                  value={bankForm.branch}
                  onChange={(e) =>
                  setBankForm({
                    ...bankForm,
                    branch: e.target.value
                  })
                  }
                  placeholder="e.g., Main Branch" />

                    <Input
                  label="IFSC Code *"
                  value={bankForm.ifscCode}
                  onChange={(e) =>
                  setBankForm({
                    ...bankForm,
                    ifscCode: e.target.value
                  })
                  }
                  placeholder="e.g., SBIN0001234" />

                    <Input
                  label="SWIFT Code"
                  value={bankForm.swiftCode}
                  onChange={(e) =>
                  setBankForm({
                    ...bankForm,
                    swiftCode: e.target.value
                  })
                  }
                  placeholder="e.g., SBININBB" />

                    <Input
                  label="Institution Account Number *"
                  value={bankForm.accountNumber}
                  onChange={(e) =>
                  setBankForm({
                    ...bankForm,
                    accountNumber: e.target.value
                  })
                  } />

                    <Select
                  label="Associated Disbursement Mode"
                  options={modes.map((m) => ({
                    value: m.modeName,
                    label: m.modeName
                  }))}
                  value={bankForm.disbursementMode}
                  onChange={(e) =>
                  setBankForm({
                    ...bankForm,
                    disbursementMode: e.target.value
                  })
                  } />

                    <Input
                  label="Bank Upload File Format"
                  value={bankForm.fileFormat}
                  onChange={(e) =>
                  setBankForm({
                    ...bankForm,
                    fileFormat: e.target.value
                  })
                  }
                  placeholder="e.g., SBI Corporate Net Banking CSV" />

                    <label className="flex items-center gap-2 cursor-pointer mt-4">
                      <input
                    type="checkbox"
                    checked={bankForm.isDefaultForPayroll}
                    onChange={(e) =>
                    setBankForm({
                      ...bankForm,
                      isDefaultForPayroll: e.target.checked
                    })
                    }
                    className="w-4 h-4 text-blue-600 rounded" />

                      <span className="text-sm text-gray-700">
                        Default Bank for Payroll
                      </span>
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="primary" onClick={handleSaveBank}>
                      <Save className="w-4 h-4 mr-2" />
                      {editBankId ? 'Update' : 'Add'} Bank
                    </Button>
                    <Button
                  variant="outline"
                  onClick={() => {
                    setShowBankForm(false);
                    setEditBankId(null);
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
                        Bank
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        IFSC / SWIFT
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Account No.
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Mode
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Default
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
                    {filteredBanks.map((b, i) =>
                  <tr
                    key={b.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 ? 'bg-gray-50/30' : ''}`}>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-blue-500" />
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {b.bankName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {b.branch}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-600">
                          {b.ifscCode}
                          <br />
                          {b.swiftCode}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {b.accountNumber}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {b.disbursementMode}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {b.isDefaultForPayroll &&
                      <Badge variant="info">Default</Badge>
                      }
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge
                        variant={
                        b.status === 'Active' ? 'success' : 'secondary'
                        }>

                            {b.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                          onClick={() => handleEditBank(b)}
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