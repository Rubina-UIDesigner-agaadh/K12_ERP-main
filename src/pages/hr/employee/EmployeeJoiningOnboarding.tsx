import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Save, ArrowLeft } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
export function EmployeeJoiningOnboarding() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Employee Joining & Onboarding
            </h1>
            <p className="text-sm text-gray-500">
              Finalize joining details and onboarding checklist
            </p>
          </div>
        </div>
        <Button variant="primary">
          <Save className="w-4 h-4 mr-2" /> Complete Joining
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Joining Details">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Select Employee (Pre-created Profile)"
                  placeholder="Search by Name/Code" />

                <Input label="Appointment Letter No." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="Appointment Date" type="date" />
                <Input label="Confirmed Joining Date" type="date" />
                <Select
                  label="Employment Type"
                  options={[
                  {
                    value: 'p',
                    label: 'Permanent'
                  },
                  {
                    value: 'c',
                    label: 'Contract'
                  }]
                  }
                  value=""
                  onChange={() => {}} />

              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Probation Period (Months)"
                  type="number"
                  defaultValue="6" />

                <Input label="Probation End Date" type="date" disabled />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Initial Department"
                  options={[
                  {
                    value: 'math',
                    label: 'Mathematics'
                  },
                  {
                    value: 'sci',
                    label: 'Science'
                  }]
                  }
                  value=""
                  onChange={() => {}} />

                <Select
                  label="Initial Designation"
                  options={[
                  {
                    value: 't',
                    label: 'Teacher'
                  },
                  {
                    value: 'st',
                    label: 'Senior Teacher'
                  }]
                  }
                  value=""
                  onChange={() => {}} />

              </div>
            </div>
          </Card>

          <Card title="Onboarding Checklist">
            <div className="space-y-3">
              {[
              'Original certificates verified',
              'Service agreement / Contract signed',
              'ID card application submitted',
              'System login / Email created',
              'Bank account details verified',
              'Biometric registration completed',
              'Staff handbook issued',
              'Welcome kit provided'].
              map((item, i) =>
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">

                  <div className="flex items-center gap-3">
                    <CheckSquare className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      {item}
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                      type="radio"
                      name={`check_${i}`}
                      className="text-green-600" />
                    {' '}
                      Yes
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                      type="radio"
                      name={`check_${i}`}
                      className="text-red-600" />
                    {' '}
                      No
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                      type="radio"
                      name={`check_${i}`}
                      className="text-gray-600" />
                    {' '}
                      N/A
                    </label>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4">
              <Input
                label="Remarks / Notes"
                placeholder="Any pending items or special notes..." />

            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Employee Summary" className="bg-blue-50 border-blue-100">
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-blue-200 rounded-full mx-auto mb-3 flex items-center justify-center text-blue-700 font-bold text-xl">
                ?
              </div>
              <p className="text-sm text-gray-500">
                Select an employee to view details
              </p>
            </div>
          </Card>

          <Card title="Instructions">
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
              <li>
                Ensure the employee profile is created first via "Add Profile".
              </li>
              <li>Verify all original documents before marking checklist.</li>
              <li>
                Probation end date is auto-calculated based on joining date.
              </li>
              <li>
                Submitting this form will activate the employee status and
                create a "Joining" entry in the Service Register.
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>);

}