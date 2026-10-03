import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, History, AlertTriangle, Save } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Tabs } from '../../../components/ui/Tabs';
export function PromotionPolicy() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('criteria');
  // State for Policy Values
  const [academicYear, setAcademicYear] = useState('2024-25');
  const [selectedClass, setSelectedClass] = useState('Class 9');
  const [stream, setStream] = useState('General');
  const [minPercentage, setMinPercentage] = useState(33);
  const [minGrade, setMinGrade] = useState('D');
  const [maxFailedSubjects, setMaxFailedSubjects] = useState(1);
  const [minAttendance, setMinAttendance] = useState(75);
  const [allowCondonation, setAllowCondonation] = useState(false);
  const handleSavePolicy = () => {
    // Basic Validation
    if (minPercentage < 0 || minPercentage > 100) {
      alert('Min. Overall Percentage must be between 0 and 100.');
      return;
    }
    if (minAttendance < 0 || minAttendance > 100) {
      alert('Min. Attendance Percentage must be between 0 and 100.');
      return;
    }
    if (maxFailedSubjects < 0) {
      alert('Max Failed Subjects Allowed must be 0 or greater.');
      return;
    }
    // Success Logic
    alert('Promotion policy saved.');
  };
  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      {/* Header (Fixed) */}
      <div className="flex-shrink-0 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Student Promotion Policy Setup
            </h1>
            <p className="text-sm text-gray-500">
              Configure criteria for student promotion to next class
            </p>
          </div>
        </div>
        <Button onClick={handleSavePolicy}>
          <Save className="w-4 h-4 mr-2" /> Save Policy
        </Button>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto pr-2 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Policy Editor */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              {/* Context Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pb-6 border-b">
                <Select
                  label="Academic Year"
                  options={[
                  {
                    value: '2024-25',
                    label: '2024-25'
                  },
                  {
                    value: '2023-24',
                    label: '2023-24'
                  }]
                  }
                  value={academicYear}
                  onChange={setAcademicYear} />

                <Select
                  label="Class"
                  options={[
                  {
                    value: 'Class 8',
                    label: 'Class 8'
                  },
                  {
                    value: 'Class 9',
                    label: 'Class 9'
                  },
                  {
                    value: 'Class 10',
                    label: 'Class 10'
                  }]
                  }
                  value={selectedClass}
                  onChange={setSelectedClass} />

                <Select
                  label="Stream"
                  options={[
                  {
                    value: 'General',
                    label: 'General'
                  },
                  {
                    value: 'Science',
                    label: 'Science'
                  },
                  {
                    value: 'Commerce',
                    label: 'Commerce'
                  }]
                  }
                  value={stream}
                  onChange={setStream} />

              </div>

              <Tabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                tabs={[
                {
                  id: 'criteria',
                  label: 'Promotion Criteria',
                  content:
                  <div className="space-y-8 pt-6">
                        {/* Academic Requirements */}
                        <div className="space-y-4">
                          <h3 className="font-medium text-gray-900 border-b pb-2">
                            Academic Requirements
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Min. Overall Percentage
                              </label>
                              <div className="flex items-center gap-4">
                                <input
                              type="range"
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                              min="0"
                              max="100"
                              value={minPercentage}
                              onChange={(e) =>
                              setMinPercentage(parseInt(e.target.value))
                              } />

                                <span className="text-sm font-bold w-12 text-center bg-gray-100 rounded py-1">
                                  {minPercentage}%
                                </span>
                              </div>
                            </div>
                            <div>
                              <Select
                            label="Min. Subject Grade"
                            options={[
                            {
                              value: 'A',
                              label: 'Grade A'
                            },
                            {
                              value: 'B',
                              label: 'Grade B'
                            },
                            {
                              value: 'C',
                              label: 'Grade C'
                            },
                            {
                              value: 'D',
                              label: 'Grade D'
                            },
                            {
                              value: 'E',
                              label: 'Grade E'
                            }]
                            }
                            value={minGrade}
                            onChange={setMinGrade} />

                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                          type="number"
                          label="Max Failed Subjects Allowed"
                          value={maxFailedSubjects}
                          onChange={(e) =>
                          setMaxFailedSubjects(parseInt(e.target.value))
                          }
                          min={0} />

                            {/* Compulsory Pass Subjects removed as per spec */}
                          </div>
                        </div>

                        {/* Attendance Requirements */}
                        <div className="space-y-4">
                          <h3 className="font-medium text-gray-900 border-b pb-2">
                            Attendance Requirements
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Min. Attendance Percentage
                              </label>
                              <div className="flex items-center gap-4">
                                <input
                              type="range"
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                              min="0"
                              max="100"
                              value={minAttendance}
                              onChange={(e) =>
                              setMinAttendance(parseInt(e.target.value))
                              } />

                                <span className="text-sm font-bold w-12 text-center bg-gray-100 rounded py-1">
                                  {minAttendance}%
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center pb-2">
                              <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                              type="checkbox"
                              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              checked={allowCondonation}
                              onChange={(e) =>
                              setAllowCondonation(e.target.checked)
                              } />

                                <span className="text-sm text-gray-700">
                                  Allow Condonation (Medical)
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                },
                {
                  id: 'outcomes',
                  label: 'Outcomes & Actions',
                  content:
                  <div className="space-y-6 pt-6">
                        <div className="p-4 bg-gray-50 border rounded-md text-sm text-gray-600">
                          Configure actions taken based on promotion criteria
                          results.
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-sm font-medium text-gray-900">
                            Default Actions
                          </h4>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            <li>
                              <strong>Criteria Met:</strong> Promote to next
                              class.
                            </li>
                            <li>
                              <strong>Criteria Not Met:</strong> Detain in same
                              class OR Eligible for Supplementary Exam.
                            </li>
                          </ul>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                          <h4 className="font-medium text-yellow-900 mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" /> Conditional
                            Options
                          </h4>
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                            defaultChecked />

                              <span className="text-sm text-yellow-800">
                                Send for Academic Review Committee before
                                detaining
                              </span>
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Internal Guidelines / Notes
                          </label>
                          <textarea
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        rows={3}
                        placeholder="Add notes for staff reference...">
                      </textarea>
                        </div>
                      </div>

                }]
                } />

            </Card>
          </div>

          {/* Right Column: Summary & History */}
          <div className="space-y-6">
            <Card title="Policy Summary">
              <div className="space-y-4 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Pass Mark</span>
                  <span className="font-medium">{minPercentage}%</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Attendance</span>
                  <span className="font-medium">{minAttendance}%</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Max Fails</span>
                  <span className="font-medium">
                    {maxFailedSubjects} Subject(s)
                  </span>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded text-blue-700 text-xs leading-relaxed">
                  This policy applies to all sections of{' '}
                  <strong>{selectedClass}</strong> for the academic year{' '}
                  <strong>{academicYear}</strong>.
                </div>
              </div>
            </Card>

            <Card title="Recent Executions">
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-sm pb-3 border-b last:border-0 last:pb-0">
                  <History className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">
                      Class 8 Promotion
                    </div>
                    <div className="text-xs text-gray-500">
                      Yesterday • 145 Students
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm pb-3 border-b last:border-0 last:pb-0">
                  <History className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">
                      Class 9 Promotion
                    </div>
                    <div className="text-xs text-gray-500">
                      2 days ago • 132 Students
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>);

}