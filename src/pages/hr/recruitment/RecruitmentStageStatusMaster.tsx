import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  Search,
  GitBranch,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  Star } from
'lucide-react';
interface RecruitmentStage {
  id: string;
  stageCode: string;
  stageName: string;
  sequenceOrder: number;
  isDefault: boolean;
  isFinalSelection: boolean;
  isFinalRejection: boolean;
  allowBackwardMovement: boolean;
  status: 'Active' | 'Inactive';
}
const mockStages: RecruitmentStage[] = [
{
  id: 'RS001',
  stageCode: 'APP_RCV',
  stageName: 'Application Received',
  sequenceOrder: 1,
  isDefault: true,
  isFinalSelection: false,
  isFinalRejection: false,
  allowBackwardMovement: false,
  status: 'Active'
},
{
  id: 'RS002',
  stageCode: 'SHORTLST',
  stageName: 'Shortlisted',
  sequenceOrder: 2,
  isDefault: false,
  isFinalSelection: false,
  isFinalRejection: false,
  allowBackwardMovement: true,
  status: 'Active'
},
{
  id: 'RS003',
  stageCode: 'WRIT_TST',
  stageName: 'Written Test',
  sequenceOrder: 3,
  isDefault: false,
  isFinalSelection: false,
  isFinalRejection: false,
  allowBackwardMovement: true,
  status: 'Active'
},
{
  id: 'RS004',
  stageCode: 'DEMO_CLS',
  stageName: 'Demo Class',
  sequenceOrder: 4,
  isDefault: false,
  isFinalSelection: false,
  isFinalRejection: false,
  allowBackwardMovement: true,
  status: 'Active'
},
{
  id: 'RS005',
  stageCode: 'HR_INTV',
  stageName: 'HR Interview',
  sequenceOrder: 5,
  isDefault: false,
  isFinalSelection: false,
  isFinalRejection: false,
  allowBackwardMovement: true,
  status: 'Active'
},
{
  id: 'RS006',
  stageCode: 'MGMT_APR',
  stageName: 'Management Approval',
  sequenceOrder: 6,
  isDefault: false,
  isFinalSelection: false,
  isFinalRejection: false,
  allowBackwardMovement: false,
  status: 'Active'
},
{
  id: 'RS007',
  stageCode: 'OFR_REL',
  stageName: 'Offer Released',
  sequenceOrder: 7,
  isDefault: false,
  isFinalSelection: true,
  isFinalRejection: false,
  allowBackwardMovement: false,
  status: 'Active'
},
{
  id: 'RS008',
  stageCode: 'OFR_ACC',
  stageName: 'Offer Accepted',
  sequenceOrder: 8,
  isDefault: false,
  isFinalSelection: false,
  isFinalRejection: false,
  allowBackwardMovement: false,
  status: 'Active'
},
{
  id: 'RS009',
  stageCode: 'JOINED',
  stageName: 'Joined',
  sequenceOrder: 9,
  isDefault: false,
  isFinalSelection: true,
  isFinalRejection: false,
  allowBackwardMovement: false,
  status: 'Active'
},
{
  id: 'RS010',
  stageCode: 'REJECTED',
  stageName: 'Rejected',
  sequenceOrder: 99,
  isDefault: false,
  isFinalSelection: false,
  isFinalRejection: true,
  allowBackwardMovement: false,
  status: 'Active'
},
{
  id: 'RS011',
  stageCode: 'ON_HOLD',
  stageName: 'On Hold',
  sequenceOrder: 98,
  isDefault: false,
  isFinalSelection: false,
  isFinalRejection: false,
  allowBackwardMovement: true,
  status: 'Active'
}];

const emptyForm = {
  stageCode: '',
  stageName: '',
  sequenceOrder: 1,
  isDefault: false,
  isFinalSelection: false,
  isFinalRejection: false,
  allowBackwardMovement: false
};
export function RecruitmentStageStatusMaster() {
  const [stages, setStages] = useState(mockStages);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [form, setForm] = useState(emptyForm);
  const filtered = stages.
  filter((s) => {
    const matchSearch =
    s.stageName.toLowerCase().includes(search.toLowerCase()) ||
    s.stageCode.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || s.status === statusFilter;
    return matchSearch && matchStatus;
  }).
  sort((a, b) => a.sequenceOrder - b.sequenceOrder);
  const resetForm = () => {
    setForm(emptyForm);
    setShowForm(false);
    setEditId(null);
  };
  const handleSave = () => {
    if (editId) {
      setStages((prev) =>
      prev.map((s) =>
      s.id === editId ?
      {
        ...s,
        ...form
      } :
      s
      )
      );
    } else {
      setStages((prev) => [
      ...prev,
      {
        ...form,
        id: `RS${Date.now()}`,
        status: 'Active' as const
      }]
      );
    }
    resetForm();
  };
  const handleEdit = (stage: RecruitmentStage) => {
    setForm({
      stageCode: stage.stageCode,
      stageName: stage.stageName,
      sequenceOrder: stage.sequenceOrder,
      isDefault: stage.isDefault,
      isFinalSelection: stage.isFinalSelection,
      isFinalRejection: stage.isFinalRejection,
      allowBackwardMovement: stage.allowBackwardMovement
    });
    setEditId(stage.id);
    setShowForm(true);
  };
  const handleDelete = (id: string) =>
  setStages((prev) => prev.filter((s) => s.id !== id));
  const totalActive = stages.filter((s) => s.status === 'Active').length;
  const finalSelectionCount = stages.filter((s) => s.isFinalSelection).length;
  const finalRejectionCount = stages.filter((s) => s.isFinalRejection).length;
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Recruitment Stage & Status Master
          </h1>
          <p className="text-sm text-gray-500">
            Configure recruitment pipeline stages and candidate statuses
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}>

          <Plus className="w-4 h-4 mr-2" />
          Add Stage
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <GitBranch className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{stages.length}</p>
            <p className="text-xs text-gray-500">Total Stages</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{totalActive}</p>
            <p className="text-xs text-gray-500">Active Stages</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
            <Star className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{finalSelectionCount}</p>
            <p className="text-xs text-gray-500">Final Selection</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{finalRejectionCount}</p>
            <p className="text-xs text-gray-500">Final Rejection</p>
          </div>
        </div>
      </div>

      {showForm &&
      <Card title={editId ? 'Edit Stage' : 'Add New Stage'}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input
            label="Stage Code *"
            value={form.stageCode}
            onChange={(e) =>
            setForm({
              ...form,
              stageCode: e.target.value
            })
            }
            placeholder="e.g., HR_INTV" />

            <Input
            label="Stage Name *"
            value={form.stageName}
            onChange={(e) =>
            setForm({
              ...form,
              stageName: e.target.value
            })
            }
            placeholder="e.g., HR Interview" />

            <Input
            label="Sequence Order *"
            type="number"
            value={form.sequenceOrder}
            onChange={(e) =>
            setForm({
              ...form,
              sequenceOrder: parseInt(e.target.value) || 1
            })
            } />

            <div />
            <div className="col-span-2 grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) =>
                setForm({
                  ...form,
                  isDefault: e.target.checked
                })
                }
                className="w-4 h-4 text-blue-600 rounded" />

                <span className="text-sm text-gray-700">
                  Default Stage (for new applications)
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                type="checkbox"
                checked={form.isFinalSelection}
                onChange={(e) =>
                setForm({
                  ...form,
                  isFinalSelection: e.target.checked
                })
                }
                className="w-4 h-4 text-blue-600 rounded" />

                <span className="text-sm text-gray-700">
                  Final Selection Stage
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                type="checkbox"
                checked={form.isFinalRejection}
                onChange={(e) =>
                setForm({
                  ...form,
                  isFinalRejection: e.target.checked
                })
                }
                className="w-4 h-4 text-blue-600 rounded" />

                <span className="text-sm text-gray-700">
                  Final Rejection Stage
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                type="checkbox"
                checked={form.allowBackwardMovement}
                onChange={(e) =>
                setForm({
                  ...form,
                  allowBackwardMovement: e.target.checked
                })
                }
                className="w-4 h-4 text-blue-600 rounded" />

                <span className="text-sm text-gray-700">
                  Allow Backward Movement
                </span>
              </label>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="primary" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              {editId ? 'Update' : 'Create'} Stage
            </Button>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </Card>
      }

      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search stages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

          </div>
          <Select
            options={[
            {
              value: '',
              label: 'All Statuses'
            },
            {
              value: 'Active',
              label: 'Active'
            },
            {
              value: 'Inactive',
              label: 'Inactive'
            }]
            }
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)} />

        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Stage
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Seq
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Flags
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Backward
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
              {filtered.map((s, i) =>
              <tr
                key={s.id}
                className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 ? 'bg-gray-50/30' : ''}`}>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {s.stageName}
                        </p>
                        <p className="text-xs text-gray-500">{s.stageCode}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
                      {s.sequenceOrder}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1 flex-wrap">
                      {s.isDefault && <Badge variant="info">Default</Badge>}
                      {s.isFinalSelection &&
                    <Badge variant="success">Final ✓</Badge>
                    }
                      {s.isFinalRejection &&
                    <Badge variant="error">Final ✗</Badge>
                    }
                      {!s.isDefault &&
                    !s.isFinalSelection &&
                    !s.isFinalRejection &&
                    <span className="text-xs text-gray-400">—</span>
                    }
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge
                    variant={
                    s.allowBackwardMovement ? 'warning' : 'secondary'
                    }>

                      {s.allowBackwardMovement ? 'Allowed' : 'Not Allowed'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge
                    variant={s.status === 'Active' ? 'success' : 'secondary'}>

                      {s.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                      onClick={() => handleEdit(s)}
                      className="p-1.5 hover:bg-blue-100 rounded-lg"
                      title="Edit">

                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                      onClick={() => handleDelete(s.id)}
                      className="p-1.5 hover:bg-red-100 rounded-lg"
                      title="Delete">

                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>);

}