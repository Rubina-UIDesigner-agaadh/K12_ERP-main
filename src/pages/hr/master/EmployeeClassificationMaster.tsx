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
  Users,
  Briefcase,
  TrendingUp } from
'lucide-react';
interface StaffType {
  id: string;
  code: string;
  name: string;
  description: string;
  isTeaching: boolean;
  isEligibleForPayroll: boolean;
  status: 'Active' | 'Inactive';
}
interface EmploymentCategory {
  id: string;
  code: string;
  name: string;
  minServiceForConfirmation: number;
  eligibleForPF: boolean;
  eligibleForGratuity: boolean;
  eligibleForLeaveEncashment: boolean;
  status: 'Active' | 'Inactive';
}
interface GradeLevel {
  id: string;
  code: string;
  name: string;
  linkedPayScale: string;
  minBasic: number;
  maxBasic: number;
  incrementStep: number;
  status: 'Active' | 'Inactive';
}
interface ExternalClassification {
  id: string;
  code: string;
  name: string;
  referenceBody: string;
  referenceNo: string;
  description: string;
  status: 'Active' | 'Inactive';
}
const mockStaffTypes: StaffType[] = [
{
  id: 'ST001',
  code: 'TEACH',
  name: 'Teaching Staff',
  description: 'Faculty members involved in teaching activities',
  isTeaching: true,
  isEligibleForPayroll: true,
  status: 'Active'
},
{
  id: 'ST002',
  code: 'NTEACH',
  name: 'Non-Teaching Staff',
  description: 'Staff not involved in direct teaching',
  isTeaching: false,
  isEligibleForPayroll: true,
  status: 'Active'
},
{
  id: 'ST003',
  code: 'ADMIN',
  name: 'Administrative Staff',
  description: 'Staff handling administrative functions',
  isTeaching: false,
  isEligibleForPayroll: true,
  status: 'Active'
},
{
  id: 'ST004',
  code: 'SUPP',
  name: 'Support Staff',
  description: 'Support and maintenance staff',
  isTeaching: false,
  isEligibleForPayroll: true,
  status: 'Active'
},
{
  id: 'ST005',
  code: 'VISIT',
  name: 'Visiting Faculty',
  description: 'Guest faculty engaged on a per-session or per-term basis',
  isTeaching: true,
  isEligibleForPayroll: true,
  status: 'Active'
},
{
  id: 'ST006',
  code: 'MGMT',
  name: 'Management Staff',
  description: 'Principal, vice-principal and management-level officers',
  isTeaching: false,
  isEligibleForPayroll: true,
  status: 'Active'
},
{
  id: 'ST007',
  code: 'HONY',
  name: 'Honorary Staff',
  description: 'Honorary office bearers with no salary component',
  isTeaching: false,
  isEligibleForPayroll: false,
  status: 'Inactive'
}];

const mockCategories: EmploymentCategory[] = [
{
  id: 'EC001',
  code: 'REG',
  name: 'Regular',
  minServiceForConfirmation: 12,
  eligibleForPF: true,
  eligibleForGratuity: true,
  eligibleForLeaveEncashment: true,
  status: 'Active'
},
{
  id: 'EC002',
  code: 'CONT',
  name: 'Contract',
  minServiceForConfirmation: 0,
  eligibleForPF: false,
  eligibleForGratuity: false,
  eligibleForLeaveEncashment: false,
  status: 'Active'
},
{
  id: 'EC003',
  code: 'PART',
  name: 'Part-Time',
  minServiceForConfirmation: 0,
  eligibleForPF: false,
  eligibleForGratuity: false,
  eligibleForLeaveEncashment: false,
  status: 'Active'
},
{
  id: 'EC004',
  code: 'PROB',
  name: 'Probation',
  minServiceForConfirmation: 6,
  eligibleForPF: true,
  eligibleForGratuity: false,
  eligibleForLeaveEncashment: false,
  status: 'Active'
},
{
  id: 'EC005',
  code: 'TEMP',
  name: 'Temporary',
  minServiceForConfirmation: 0,
  eligibleForPF: false,
  eligibleForGratuity: false,
  eligibleForLeaveEncashment: false,
  status: 'Active'
},
{
  id: 'EC006',
  code: 'APPR',
  name: 'Apprentice / Intern',
  minServiceForConfirmation: 0,
  eligibleForPF: false,
  eligibleForGratuity: false,
  eligibleForLeaveEncashment: false,
  status: 'Active'
},
{
  id: 'EC007',
  code: 'DEPU',
  name: 'Deputation',
  minServiceForConfirmation: 0,
  eligibleForPF: true,
  eligibleForGratuity: false,
  eligibleForLeaveEncashment: false,
  status: 'Active'
}];

const mockGrades: GradeLevel[] = [
{
  id: 'GL001',
  code: 'G1',
  name: 'Grade I',
  linkedPayScale: 'PS-A',
  minBasic: 80000,
  maxBasic: 120000,
  incrementStep: 5000,
  status: 'Active'
},
{
  id: 'GL002',
  code: 'G2',
  name: 'Grade II',
  linkedPayScale: 'PS-B',
  minBasic: 60000,
  maxBasic: 90000,
  incrementStep: 3000,
  status: 'Active'
},
{
  id: 'GL003',
  code: 'G3',
  name: 'Grade III',
  linkedPayScale: 'PS-C',
  minBasic: 40000,
  maxBasic: 70000,
  incrementStep: 2500,
  status: 'Active'
},
{
  id: 'GL004',
  code: 'G4',
  name: 'Grade IV',
  linkedPayScale: 'PS-D',
  minBasic: 25000,
  maxBasic: 45000,
  incrementStep: 2000,
  status: 'Active'
},
{
  id: 'GL005',
  code: 'G5',
  name: 'Grade V',
  linkedPayScale: 'PS-E',
  minBasic: 15000,
  maxBasic: 30000,
  incrementStep: 1500,
  status: 'Active'
},
{
  id: 'GL006',
  code: 'G6',
  name: 'Grade VI',
  linkedPayScale: 'PS-E',
  minBasic: 12000,
  maxBasic: 25000,
  incrementStep: 1000,
  status: 'Active'
},
{
  id: 'GL007',
  code: 'LVL-L',
  name: 'Leadership Level',
  linkedPayScale: 'PS-A',
  minBasic: 150000,
  maxBasic: 220000,
  incrementStep: 7500,
  status: 'Active'
},
{
  id: 'GL008',
  code: 'PROB',
  name: 'Probationary Grade',
  linkedPayScale: 'PS-E',
  minBasic: 15000,
  maxBasic: 20000,
  incrementStep: 0,
  status: 'Active'
}];

const mockExternalTypes: ExternalClassification[] = [
{
  id: 'XC001',
  code: 'UDISE-STF',
  name: 'Government Reporting Category',
  referenceBody: 'UDISE+',
  referenceNo: 'UDISE-STAFF-01',
  description: 'Category used for state and UDISE+ staff returns',
  status: 'Active'
},
{
  id: 'XC002',
  code: 'NAAC-FAC',
  name: 'NAAC Faculty Category',
  referenceBody: 'NAAC',
  referenceNo: 'NAAC-CRIT-3',
  description: 'Faculty classification for accreditation (SSR) reports',
  status: 'Active'
},
{
  id: 'XC003',
  code: 'AICTE-QB',
  name: 'AICTE Qualification Band',
  referenceBody: 'AICTE',
  referenceNo: 'AICTE-QB-2',
  description: 'Qualification band as per AICTE approval norms',
  status: 'Active'
},
{
  id: 'XC004',
  code: 'ASSN-MEM',
  name: 'Association Member Category',
  referenceBody: 'Trade Union / Association',
  referenceNo: '',
  description: 'Membership class recorded for association dues tracking',
  status: 'Inactive'
}];

export function EmployeeClassificationMaster() {
  const [activeTab, setActiveTab] = useState('staff-types');
  const [staffTypes, setStaffTypes] = useState(mockStaffTypes);
  const [categories, setCategories] = useState(mockCategories);
  const [grades, setGrades] = useState(mockGrades);
  const [externalTypes, setExternalTypes] = useState(mockExternalTypes);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [staffTypeForm, setStaffTypeForm] = useState({
    code: '',
    name: '',
    description: '',
    isTeaching: false,
    isEligibleForPayroll: true
  });
  const [categoryForm, setCategoryForm] = useState({
    code: '',
    name: '',
    minServiceForConfirmation: 0,
    eligibleForPF: false,
    eligibleForGratuity: false,
    eligibleForLeaveEncashment: false
  });
  const [gradeForm, setGradeForm] = useState({
    code: '',
    name: '',
    linkedPayScale: '',
    minBasic: 0,
    maxBasic: 0,
    incrementStep: 0
  });
  const [externalForm, setExternalForm] = useState({
    code: '',
    name: '',
    referenceBody: '',
    referenceNo: '',
    description: ''
  });
  const resetForms = () => {
    setExternalForm({
      code: '',
      name: '',
      referenceBody: '',
      referenceNo: '',
      description: ''
    });
    setStaffTypeForm({
      code: '',
      name: '',
      description: '',
      isTeaching: false,
      isEligibleForPayroll: true
    });
    setCategoryForm({
      code: '',
      name: '',
      minServiceForConfirmation: 0,
      eligibleForPF: false,
      eligibleForGratuity: false,
      eligibleForLeaveEncashment: false
    });
    setGradeForm({
      code: '',
      name: '',
      linkedPayScale: '',
      minBasic: 0,
      maxBasic: 0,
      incrementStep: 0
    });
    setShowForm(false);
    setEditId(null);
  };
  const handleSaveExternal = () => {
    if (editId) {
      setExternalTypes((prev) =>
      prev.map((x) =>
      x.id === editId ?
      {
        ...x,
        ...externalForm
      } :
      x
      )
      );
    } else {
      setExternalTypes((prev) => [
      ...prev,
      {
        ...externalForm,
        id: `XC${Date.now()}`,
        status: 'Active' as const
      }]
      );
    }
    resetForms();
  };
  const handleEditExternal = (x: ExternalClassification) => {
    setExternalForm({
      code: x.code,
      name: x.name,
      referenceBody: x.referenceBody,
      referenceNo: x.referenceNo,
      description: x.description
    });
    setEditId(x.id);
    setShowForm(true);
  };
  const handleSaveStaffType = () => {
    if (editId) {
      setStaffTypes((prev) =>
      prev.map((st) =>
      st.id === editId ?
      {
        ...st,
        ...staffTypeForm
      } :
      st
      )
      );
    } else {
      setStaffTypes((prev) => [
      ...prev,
      {
        ...staffTypeForm,
        id: `ST${Date.now()}`,
        status: 'Active' as const
      }]
      );
    }
    resetForms();
  };
  const handleSaveCategory = () => {
    if (editId) {
      setCategories((prev) =>
      prev.map((c) =>
      c.id === editId ?
      {
        ...c,
        ...categoryForm
      } :
      c
      )
      );
    } else {
      setCategories((prev) => [
      ...prev,
      {
        ...categoryForm,
        id: `EC${Date.now()}`,
        status: 'Active' as const
      }]
      );
    }
    resetForms();
  };
  const handleSaveGrade = () => {
    if (editId) {
      setGrades((prev) =>
      prev.map((g) =>
      g.id === editId ?
      {
        ...g,
        ...gradeForm
      } :
      g
      )
      );
    } else {
      setGrades((prev) => [
      ...prev,
      {
        ...gradeForm,
        id: `GL${Date.now()}`,
        status: 'Active' as const
      }]
      );
    }
    resetForms();
  };
  const handleEditStaffType = (st: StaffType) => {
    setStaffTypeForm({
      code: st.code,
      name: st.name,
      description: st.description,
      isTeaching: st.isTeaching,
      isEligibleForPayroll: st.isEligibleForPayroll
    });
    setEditId(st.id);
    setShowForm(true);
  };
  const handleEditCategory = (c: EmploymentCategory) => {
    setCategoryForm({
      code: c.code,
      name: c.name,
      minServiceForConfirmation: c.minServiceForConfirmation,
      eligibleForPF: c.eligibleForPF,
      eligibleForGratuity: c.eligibleForGratuity,
      eligibleForLeaveEncashment: c.eligibleForLeaveEncashment
    });
    setEditId(c.id);
    setShowForm(true);
  };
  const handleEditGrade = (g: GradeLevel) => {
    setGradeForm({
      code: g.code,
      name: g.name,
      linkedPayScale: g.linkedPayScale,
      minBasic: g.minBasic,
      maxBasic: g.maxBasic,
      incrementStep: g.incrementStep
    });
    setEditId(g.id);
    setShowForm(true);
  };
  const filteredStaffTypes = staffTypes.filter((st) =>
  st.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredCategories = categories.filter((c) =>
  c.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredExternal = externalTypes.filter((x) =>
  x.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredGrades = grades.filter((g) =>
  g.name.toLowerCase().includes(search.toLowerCase())
  );
  const tabs = [
  {
    id: 'staff-types',
    label: 'Staff Types'
  },
  {
    id: 'employment-categories',
    label: 'Employment Categories'
  },
  {
    id: 'grades-levels',
    label: 'Grades / Levels'
  },
  {
    id: 'external-classification',
    label: 'Non-ERP Classification'
  }];
  const entityLabel = activeTab === 'staff-types' ? 'Staff Type' : activeTab === 'employment-categories' ? 'Employment Category' : activeTab === 'external-classification' ? 'Non-ERP Classification' : 'Grade/Level';

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Employee Classification Master
          </h1>
          <p className="text-sm text-gray-500">
            Unified management of staff types, employment categories, and grades
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            resetForms();
            setShowForm(true);
          }}>

          <Plus className="w-4 h-4 mr-2" />
          Add New
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{staffTypes.length}</p>
            <p className="text-xs text-gray-500">Staff Types</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{categories.length}</p>
            <p className="text-xs text-gray-500">Employment Categories</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{grades.length}</p>
            <p className="text-xs text-gray-500">Grades / Levels</p>
          </div>
        </div>
      </div>

      {showForm &&
      <Card
        title={
        editId ?
        `Edit ${entityLabel}` :
        `Add New ${entityLabel}`
        }>

          {activeTab === 'staff-types' &&
        <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Input
              label="Code *"
              value={staffTypeForm.code}
              onChange={(e) =>
              setStaffTypeForm({
                ...staffTypeForm,
                code: e.target.value
              })
              }
              placeholder="e.g., TEACH" />

                <Input
              label="Name *"
              value={staffTypeForm.name}
              onChange={(e) =>
              setStaffTypeForm({
                ...staffTypeForm,
                name: e.target.value
              })
              }
              placeholder="e.g., Teaching Staff" />

                <div className="col-span-2">
                  <Input
                label="Description"
                value={staffTypeForm.description}
                onChange={(e) =>
                setStaffTypeForm({
                  ...staffTypeForm,
                  description: e.target.value
                })
                }
                placeholder="Brief description" />

                </div>
                <div className="col-span-2 flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                  type="checkbox"
                  checked={staffTypeForm.isTeaching}
                  onChange={(e) =>
                  setStaffTypeForm({
                    ...staffTypeForm,
                    isTeaching: e.target.checked
                  })
                  }
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />

                    <span className="text-sm text-gray-700">Is Teaching</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                  type="checkbox"
                  checked={staffTypeForm.isEligibleForPayroll}
                  onChange={(e) =>
                  setStaffTypeForm({
                    ...staffTypeForm,
                    isEligibleForPayroll: e.target.checked
                  })
                  }
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />

                    <span className="text-sm text-gray-700">
                      Eligible for Payroll
                    </span>
                  </label>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="primary" onClick={handleSaveStaffType}>
                  <Save className="w-4 h-4 mr-2" />
                  {editId ? 'Update' : 'Create'}
                </Button>
                <Button variant="outline" onClick={resetForms}>
                  Cancel
                </Button>
              </div>
            </>
        }

          {activeTab === 'employment-categories' &&
        <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Input
              label="Code *"
              value={categoryForm.code}
              onChange={(e) =>
              setCategoryForm({
                ...categoryForm,
                code: e.target.value
              })
              }
              placeholder="e.g., REG" />

                <Input
              label="Name *"
              value={categoryForm.name}
              onChange={(e) =>
              setCategoryForm({
                ...categoryForm,
                name: e.target.value
              })
              }
              placeholder="e.g., Regular" />

                <Input
              label="Min Service for Confirmation (months)"
              type="number"
              value={categoryForm.minServiceForConfirmation}
              onChange={(e) =>
              setCategoryForm({
                ...categoryForm,
                minServiceForConfirmation: parseInt(e.target.value) || 0
              })
              } />

                <div />
                <div className="col-span-2 flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                  type="checkbox"
                  checked={categoryForm.eligibleForPF}
                  onChange={(e) =>
                  setCategoryForm({
                    ...categoryForm,
                    eligibleForPF: e.target.checked
                  })
                  }
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />

                    <span className="text-sm text-gray-700">
                      Eligible for PF
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                  type="checkbox"
                  checked={categoryForm.eligibleForGratuity}
                  onChange={(e) =>
                  setCategoryForm({
                    ...categoryForm,
                    eligibleForGratuity: e.target.checked
                  })
                  }
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />

                    <span className="text-sm text-gray-700">
                      Eligible for Gratuity
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                  type="checkbox"
                  checked={categoryForm.eligibleForLeaveEncashment}
                  onChange={(e) =>
                  setCategoryForm({
                    ...categoryForm,
                    eligibleForLeaveEncashment: e.target.checked
                  })
                  }
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />

                    <span className="text-sm text-gray-700">
                      Eligible for Leave Encashment
                    </span>
                  </label>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="primary" onClick={handleSaveCategory}>
                  <Save className="w-4 h-4 mr-2" />
                  {editId ? 'Update' : 'Create'}
                </Button>
                <Button variant="outline" onClick={resetForms}>
                  Cancel
                </Button>
              </div>
            </>
        }

          {activeTab === 'grades-levels' &&
        <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Input
              label="Code *"
              value={gradeForm.code}
              onChange={(e) =>
              setGradeForm({
                ...gradeForm,
                code: e.target.value
              })
              }
              placeholder="e.g., G1" />

                <Input
              label="Name *"
              value={gradeForm.name}
              onChange={(e) =>
              setGradeForm({
                ...gradeForm,
                name: e.target.value
              })
              }
              placeholder="e.g., Grade I" />

                <Select
              label="Linked Pay Scale"
              options={[
              {
                value: '',
                label: 'None'
              },
              {
                value: 'PS-A',
                label: 'PS-A'
              },
              {
                value: 'PS-B',
                label: 'PS-B'
              },
              {
                value: 'PS-C',
                label: 'PS-C'
              },
              {
                value: 'PS-D',
                label: 'PS-D'
              },
              {
                value: 'PS-E',
                label: 'PS-E'
              }]
              }
              value={gradeForm.linkedPayScale}
              onChange={(e) =>
              setGradeForm({
                ...gradeForm,
                linkedPayScale: e.target.value
              })
              } />

                <div />
                <Input
              label="Minimum Basic"
              type="number"
              value={gradeForm.minBasic}
              onChange={(e) =>
              setGradeForm({
                ...gradeForm,
                minBasic: parseInt(e.target.value) || 0
              })
              } />

                <Input
              label="Maximum Basic"
              type="number"
              value={gradeForm.maxBasic}
              onChange={(e) =>
              setGradeForm({
                ...gradeForm,
                maxBasic: parseInt(e.target.value) || 0
              })
              } />

                <Input
              label="Increment Step"
              type="number"
              value={gradeForm.incrementStep}
              onChange={(e) =>
              setGradeForm({
                ...gradeForm,
                incrementStep: parseInt(e.target.value) || 0
              })
              } />

              </div>
              <div className="flex gap-2">
                <Button variant="primary" onClick={handleSaveGrade}>
                  <Save className="w-4 h-4 mr-2" />
                  {editId ? 'Update' : 'Create'}
                </Button>
                <Button variant="outline" onClick={resetForms}>
                  Cancel
                </Button>
              </div>
            </>
        }
          {activeTab === 'external-classification' &&
          <>
              <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Not connected to the ERP. This classification is maintained by an external body. Its information is saved in the ERP for reference only and does not drive payroll, leave or service rules.
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Input
              label="Code *"
              value={externalForm.code}
              onChange={(e) =>
              setExternalForm({
                ...externalForm,
                code: e.target.value
              })
              }
              placeholder="e.g., UDISE-STF" />

                <Input
              label="Name *"
              value={externalForm.name}
              onChange={(e) =>
              setExternalForm({
                ...externalForm,
                name: e.target.value
              })
              }
              placeholder="e.g., Government Reporting Category" />

                <Select
              label="Reference Body"
              options={[
              { value: '', label: 'Select body' },
              { value: 'UDISE+', label: 'UDISE+' },
              { value: 'NAAC', label: 'NAAC' },
              { value: 'AICTE', label: 'AICTE' },
              { value: 'UGC', label: 'UGC' },
              { value: 'State Education Dept.', label: 'State Education Dept.' },
              { value: 'Trade Union / Association', label: 'Trade Union / Association' },
              { value: 'Other', label: 'Other' }]}
              value={externalForm.referenceBody}
              onChange={(e) =>
              setExternalForm({
                ...externalForm,
                referenceBody: e.target.value
              })
              } />

                <Input
              label="Reference No."
              value={externalForm.referenceNo}
              onChange={(e) =>
              setExternalForm({
                ...externalForm,
                referenceNo: e.target.value
              })
              }
              placeholder="e.g., UDISE-STAFF-01" />

                <Input
              label="Description"
              value={externalForm.description}
              onChange={(e) =>
              setExternalForm({
                ...externalForm,
                description: e.target.value
              })
              }
              placeholder="Purpose of this classification" />

              </div>
              <div className="flex gap-2">
                <Button variant="primary" onClick={handleSaveExternal} disabled={!externalForm.code.trim() || !externalForm.name.trim()}>
                  <Save className="w-4 h-4 mr-2" />
                  {editId ? 'Update' : 'Create'}
                </Button>
                <Button variant="outline" onClick={resetForms}>
                  Cancel
                </Button>
              </div>
            </>
          }
        </Card>
      }

      <Card>
        <div className="border-b border-gray-200">
          <nav className="flex flex-wrap -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-4">
          <div className="relative mb-4">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab === 'staff-types' ? 'staff types' : activeTab === 'employment-categories' ? 'categories' : activeTab === 'external-classification' ? 'non-ERP classifications' : 'grades'}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

          </div>

          {activeTab === 'staff-types' &&
          <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Code
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Description
                    </th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Teaching
                    </th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Payroll
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
                  {filteredStaffTypes.map((st, i) =>
                <tr
                  key={st.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 ? 'bg-gray-50/30' : ''}`}>

                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {st.code}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                        {st.name}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {st.description}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge
                      variant={st.isTeaching ? 'success' : 'secondary'}>

                          {st.isTeaching ? 'Yes' : 'No'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge
                      variant={
                      st.isEligibleForPayroll ? 'success' : 'secondary'
                      }>

                          {st.isEligibleForPayroll ? 'Yes' : 'No'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge
                      variant={
                      st.status === 'Active' ? 'success' : 'secondary'
                      }>

                          {st.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                        onClick={() => handleEditStaffType(st)}
                        className="p-1.5 hover:bg-blue-100 rounded-lg"
                        title="Edit">

                            <Edit className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                        onClick={() => setStaffTypes((prev) => prev.filter((item) => item.id !== st.id))}
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
          }

          {activeTab === 'employment-categories' &&
          <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Code
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Name
                    </th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Min Service (months)
                    </th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      PF
                    </th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Gratuity
                    </th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Leave Encash
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
                  {filteredCategories.map((c, i) =>
                <tr
                  key={c.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 ? 'bg-gray-50/30' : ''}`}>

                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {c.code}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                        {c.name}
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-gray-600">
                        {c.minServiceForConfirmation}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge
                      variant={c.eligibleForPF ? 'success' : 'secondary'}>

                          {c.eligibleForPF ? 'Yes' : 'No'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge
                      variant={
                      c.eligibleForGratuity ? 'success' : 'secondary'
                      }>

                          {c.eligibleForGratuity ? 'Yes' : 'No'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge
                      variant={
                      c.eligibleForLeaveEncashment ?
                      'success' :
                      'secondary'
                      }>

                          {c.eligibleForLeaveEncashment ? 'Yes' : 'No'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge
                      variant={
                      c.status === 'Active' ? 'success' : 'secondary'
                      }>

                          {c.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                        onClick={() => handleEditCategory(c)}
                        className="p-1.5 hover:bg-blue-100 rounded-lg"
                        title="Edit">

                            <Edit className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                        onClick={() => setCategories((prev) => prev.filter((item) => item.id !== c.id))}
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
          }

          {activeTab === 'grades-levels' &&
          <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Code
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Name
                    </th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Pay Scale
                    </th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Min Basic
                    </th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Max Basic
                    </th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Increment
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
                  {filteredGrades.map((g, i) =>
                <tr
                  key={g.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 ? 'bg-gray-50/30' : ''}`}>

                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {g.code}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                        {g.name}
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-gray-600">
                        {g.linkedPayScale || '-'}
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-gray-600">
                        ₹{g.minBasic.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-gray-600">
                        ₹{g.maxBasic.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-gray-600">
                        ₹{g.incrementStep.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge
                      variant={
                      g.status === 'Active' ? 'success' : 'secondary'
                      }>

                          {g.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                        onClick={() => handleEditGrade(g)}
                        className="p-1.5 hover:bg-blue-100 rounded-lg"
                        title="Edit">

                            <Edit className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                        onClick={() => setGrades((prev) => prev.filter((item) => item.id !== g.id))}
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
          }
          {activeTab === 'external-classification' &&
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Not connected to the ERP. These classifications are maintained outside the ERP. Their information is saved in the ERP for reference only.
            </div>
          }
          {activeTab === 'external-classification' &&
          <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Code
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Name
                    </th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Reference Body
                    </th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Reference No.
                    </th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Storage
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
                  {filteredExternal.map((x, i) =>
                <tr
                  key={x.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 ? 'bg-gray-50/30' : ''}`}>

                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {x.code}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                        {x.name}
                        <div className="text-xs font-normal text-gray-500">{x.description}</div>
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-gray-600">
                        {x.referenceBody || '-'}
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-gray-600">
                        {x.referenceNo || '-'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant="info">Saved in ERP</Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={x.status === 'Active' ? 'success' : 'secondary'}>
                          {x.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                        onClick={() => handleEditExternal(x)}
                        className="p-1.5 hover:bg-blue-100 rounded-lg"
                        title="Edit">

                            <Edit className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                        onClick={() => setExternalTypes((prev) => prev.filter((item) => item.id !== x.id))}
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
          }
        </div>
      </Card>
    </div>);

}