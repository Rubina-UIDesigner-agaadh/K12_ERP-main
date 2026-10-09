import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { MultiSelect } from '../../../components/ui/MultiSelect';
import {
  FileText,
  Download,
  Eye,
  Share2,
  Printer,
  CheckCircle,
  Clock } from
'lucide-react';
interface GeneratedReport {
  studentName: string;
  status: 'Generated' | 'Pending' | 'Error';
  downloadUrl: string;
}
const BRANCH_OPTIONS = [
{
  value: 'main',
  label: 'Main Campus'
},
{
  value: 'west',
  label: 'West Branch'
},
{
  value: 'east',
  label: 'East Branch'
},
{
  value: 'north',
  label: 'North Branch'
}];

export function PreschoolReportCardGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState('Colorful');
  const [generateAll, setGenerateAll] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>(
    []
  );
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const handleGenerate = () => {
    setGenerating(true);
    setProgress(0);
    // Simulate generation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setGenerating(false);
          setGeneratedReports([
          {
            studentName: 'Aarav Kumar',
            status: 'Generated',
            downloadUrl: '#'
          },
          {
            studentName: 'Diya Sharma',
            status: 'Generated',
            downloadUrl: '#'
          },
          {
            studentName: 'Rohan Patel',
            status: 'Generated',
            downloadUrl: '#'
          }]
          );
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Preschool Report Card Generator
          </h1>
          <p className="text-sm text-gray-500">
            Generate parent-friendly development report cards
          </p>
        </div>
      </div>

      {/* Configuration Section */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Report Configuration
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <MultiSelect
            label="School Branch"
            options={BRANCH_OPTIONS}
            value={selectedBranches}
            onChange={setSelectedBranches}
            placeholder="All Branches" />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option>Nursery</option>
              <option>Jr KG</option>
              <option>Sr KG</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option>Section A</option>
              <option>Section B</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assessment Cycle
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option>Term 1 Observation</option>
              <option>Term 2 Observation</option>
              <option>Quarterly Development Check</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Template Style
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">

              <option>Colorful</option>
              <option>Professional</option>
              <option>Minimal</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Student Selection */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Student Selection
        </h2>
        <div className="space-y-4">
          <label className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={generateAll}
              onChange={(e) => setGenerateAll(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded" />

            <div>
              <p className="font-medium text-gray-900">
                Generate for All Students
              </p>
              <p className="text-sm text-gray-600">
                Create report cards for all students in the selected class and
                section
              </p>
            </div>
          </label>

          {!generateAll &&
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Students
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {[
              'Aarav Kumar',
              'Diya Sharma',
              'Rohan Patel',
              'Ananya Reddy',
              'Arjun Singh'].
              map((student) =>
              <label
                key={student}
                className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">

                    <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 rounded" />

                    <span className="text-sm text-gray-700">{student}</span>
                  </label>
              )}
              </div>
            </div>
          }
        </div>
      </Card>

      {/* Report Layout Preview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            Report Layout Preview
          </h2>
          <Badge className="bg-blue-100 text-blue-700">
            {selectedTemplate} Template
          </Badge>
        </div>

        <div className="border-2 border-gray-300 rounded-lg p-8 bg-white">
          {/* School Logo Placeholder */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Little Stars Preschool
            </h3>
            <p className="text-sm text-gray-600">Development Progress Report</p>
          </div>

          {/* Student Details */}
          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-xs text-gray-500">Student Name</p>
              <p className="font-semibold text-gray-900">Aarav Kumar</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Class</p>
              <p className="font-semibold text-gray-900">Nursery A</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Roll Number</p>
              <p className="font-semibold text-gray-900">15</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Assessment Period</p>
              <p className="font-semibold text-gray-900">
                Term 1 (Apr-Sep 2024)
              </p>
            </div>
          </div>

          {/* Skill Evaluation Table */}
          <div className="mb-6">
            <h4 className="font-bold text-gray-900 mb-3">Skill Evaluation</h4>
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-bold text-gray-600">
                    Domain
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-gray-600">
                    Skill
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-bold text-gray-600">
                    Grade
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-3 py-2 text-gray-700">Cognitive Skills</td>
                  <td className="px-3 py-2 text-gray-700">Recognizes colors</td>
                  <td className="px-3 py-2 text-center">
                    <Badge className="bg-green-500 text-white">A</Badge>
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-gray-700">Language</td>
                  <td className="px-3 py-2 text-gray-700">
                    Speaks simple sentences
                  </td>
                  <td className="px-3 py-2 text-center">
                    <Badge className="bg-blue-500 text-white">B</Badge>
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-gray-700">Motor Skills</td>
                  <td className="px-3 py-2 text-gray-700">
                    Holds pencil correctly
                  </td>
                  <td className="px-3 py-2 text-center">
                    <Badge className="bg-green-500 text-white">A</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Progress Chart Placeholder */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-3">Domain Performance</h4>
            <div className="space-y-2">
              {[
              'Cognitive Skills',
              'Language',
              'Motor Skills',
              'Social & Emotional'].
              map((domain, index) =>
              <div key={domain}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{domain}</span>
                    <span className="text-gray-600">{85 - index * 5}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{
                      width: `${85 - index * 5}%`
                    }} />

                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Teacher Remarks */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-2">Teacher's Remarks</h4>
            <p className="text-sm text-gray-700">
              Aarav has shown excellent progress in cognitive and motor skills.
              He actively participates in classroom activities and demonstrates
              good social interaction with peers.
            </p>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-6 border-t border-gray-300">
            <div>
              <div className="border-t border-gray-400 pt-2">
                <p className="text-xs text-gray-600">Teacher's Signature</p>
                <p className="text-sm font-medium text-gray-900">
                  Ms. Priya Desai
                </p>
              </div>
            </div>
            <div>
              <div className="border-t border-gray-400 pt-2">
                <p className="text-xs text-gray-600">Principal's Signature</p>
                <p className="text-sm font-medium text-gray-900">
                  Dr. Rajesh Kumar
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Export Options */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Export Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button
            variant="primary"
            className="bg-blue-600"
            onClick={handleGenerate}
            disabled={generating}>

            <FileText className="w-4 h-4 mr-2" />
            Generate PDF
          </Button>
          <Button variant="primary" className="bg-green-600">
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button variant="primary" className="bg-purple-600">
            <Eye className="w-4 h-4 mr-2" />
            Parent Portal View
          </Button>
          <Button variant="primary" className="bg-green-600">
            <Share2 className="w-4 h-4 mr-2" />
            Share via WhatsApp
          </Button>
        </div>
      </Card>

      {/* Generation Progress */}
      {generating &&
      <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-5 h-5 text-blue-600 animate-spin" />
            <p className="font-semibold text-gray-900">Generating Reports...</p>
          </div>
          <div className="w-full h-3 bg-blue-200 rounded-full overflow-hidden">
            <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{
              width: `${progress}%`
            }} />

          </div>
          <p className="text-sm text-gray-600 mt-2">
            Processing {Math.floor(progress / 33)} of 3 reports...
          </p>
        </Card>
      }

      {/* Generated Reports List */}
      {generatedReports.length > 0 &&
      <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Generated Reports
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                    Student Name
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {generatedReports.map((report) =>
              <tr key={report.studentName} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {report.studentName}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                    className={
                    report.status === 'Generated' ?
                    'bg-green-100 text-green-700' :
                    report.status === 'Pending' ?
                    'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                    }>

                        {report.status === 'Generated' &&
                    <CheckCircle className="w-3 h-3 mr-1" />
                    }
                        {report.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        </Card>
      }
    </div>);

}