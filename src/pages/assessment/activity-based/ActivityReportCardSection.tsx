import React, { useState } from 'react';
import {
  FileText,
  Eye,
  Download,
  Printer,
  Settings,
  ToggleLeft,
  ToggleRight,
  CheckCircle,
  Layout,
  Star,
  Award,
  ChevronRight,
  Info,
  Layers,
  Heart,
  Palette,
  Shield,
  Activity,
  Users,
  Globe,
  BookOpen } from
'lucide-react';
type TemplateId = 'cbse' | 'icse' | 'state' | 'custom';
interface TemplateConfig {
  id: TemplateId;
  name: string;
  description: string;
  board: string;
}
interface ReportSettings {
  autoPullGrades: boolean;
  descriptiveRemarks: boolean;
  attendanceLinkage: boolean;
  promotionCriteria: boolean;
}
const templates: TemplateConfig[] = [
{
  id: 'cbse',
  name: 'CBSE Format',
  description: 'Standard CBSE co-scholastic section with A1-E grade scale',
  board: 'CBSE'
},
{
  id: 'icse',
  name: 'ICSE Format',
  description: 'CISCE compliant format with A-E grades and remarks',
  board: 'ICSE/ISC'
},
{
  id: 'state',
  name: 'State Board Format',
  description: 'State board format with A+-E grade scale',
  board: 'State Board'
},
{
  id: 'custom',
  name: 'Custom Template',
  description: 'Fully customizable layout and area ordering',
  board: 'Custom'
}];

const AREAS_ORDER = [
{
  id: 'ls',
  name: 'Life Skills',
  icon: Heart,
  t1: 'A',
  t2: 'A',
  overall: 'A'
},
{
  id: 'we',
  name: 'Work Education',
  icon: BookOpen,
  t1: 'B',
  t2: 'A',
  overall: 'A'
},
{
  id: 'vpa',
  name: 'Visual & Performing Arts',
  icon: Palette,
  t1: 'A',
  t2: 'A',
  overall: 'A'
},
{
  id: 'av',
  name: 'Attitudes & Values',
  icon: Shield,
  t1: 'A',
  t2: 'A',
  overall: 'A'
},
{
  id: 'hpe',
  name: 'Health & Physical Education',
  icon: Activity,
  t1: 'B',
  t2: 'A',
  overall: 'A'
},
{
  id: 'dis',
  name: 'Discipline',
  icon: CheckCircle,
  t1: 'A',
  t2: 'A',
  overall: 'A'
},
{
  id: 'cap',
  name: 'Club & Activity Participation',
  icon: Users,
  t1: 'B',
  t2: 'A',
  overall: 'A'
},
{
  id: 'sr',
  name: 'Social Responsibility',
  icon: Globe,
  t1: 'A',
  t2: 'A',
  overall: 'A'
}];

const gradeColors: Record<string, string> = {
  A: 'bg-green-100 text-green-700',
  B: 'bg-blue-100 text-blue-700',
  C: 'bg-yellow-100 text-yellow-700',
  D: 'bg-orange-100 text-orange-700',
  E: 'bg-red-100 text-red-700',
  A1: 'bg-green-100 text-green-700',
  A2: 'bg-emerald-100 text-emerald-700',
  'A+': 'bg-green-100 text-green-700'
};
function CBSEPreview({ settings }: {settings: ReportSettings;}) {
  return (
    <div className="border-2 border-gray-300 rounded-xl overflow-hidden bg-white text-sm">
      {/* School Header */}
      <div className="bg-blue-700 text-white text-center py-4 px-6">
        <h2 className="text-lg font-bold">DELHI PUBLIC SCHOOL</h2>
        <p className="text-blue-200 text-xs">
          Affiliated to CBSE | School Code: 12345
        </p>
      </div>
      <div className="bg-blue-50 text-center py-2 border-b border-blue-200">
        <p className="text-sm font-semibold text-blue-800">
          PROGRESS REPORT — Academic Year 2024-25
        </p>
      </div>
      {/* Student Info */}
      <div className="grid grid-cols-2 gap-4 p-4 border-b border-gray-200 bg-gray-50">
        <div className="space-y-1 text-xs">
          <div className="flex gap-2">
            <span className="text-gray-500 w-24">Student Name:</span>
            <span className="font-semibold">Advait Krishnan</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-500 w-24">Class:</span>
            <span className="font-semibold">VIII-A</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-500 w-24">Roll No.:</span>
            <span className="font-semibold">01</span>
          </div>
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex gap-2">
            <span className="text-gray-500 w-24">Admission No.:</span>
            <span className="font-semibold">DPS/2020/001</span>
          </div>
          {settings.attendanceLinkage &&
          <div className="flex gap-2">
              <span className="text-gray-500 w-24">Attendance:</span>
              <span className="font-semibold text-green-700">96.5%</span>
            </div>
          }
        </div>
      </div>
      {/* Co-Scholastic Section */}
      <div className="p-4">
        <div className="bg-blue-700 text-white text-center py-1.5 rounded-t-lg text-xs font-bold uppercase tracking-wide">
          Part B: Co-Scholastic Activities
        </div>
        <table className="w-full border border-gray-300 text-xs">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-3 text-left border-r border-gray-300 font-semibold">
                Co-Scholastic Area
              </th>
              <th className="py-2 px-3 text-center border-r border-gray-300 font-semibold">
                Term 1
              </th>
              <th className="py-2 px-3 text-center border-r border-gray-300 font-semibold">
                Term 2
              </th>
              <th className="py-2 px-3 text-center font-semibold">Overall</th>
            </tr>
          </thead>
          <tbody>
            {AREAS_ORDER.map((area, idx) =>
            <tr
              key={area.id}
              className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>

                <td className="py-1.5 px-3 border-r border-gray-200 font-medium">
                  {area.name}
                </td>
                <td className="py-1.5 px-3 text-center border-r border-gray-200">
                  <span
                  className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold ${gradeColors[area.t1]}`}>

                    {area.t1}
                  </span>
                </td>
                <td className="py-1.5 px-3 text-center border-r border-gray-200">
                  <span
                  className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold ${gradeColors[area.t2]}`}>

                    {area.t2}
                  </span>
                </td>
                <td className="py-1.5 px-3 text-center">
                  <span
                  className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold ${gradeColors[area.overall]}`}>

                    {area.overall}
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {settings.descriptiveRemarks &&
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs font-semibold text-gray-700 mb-1">
              Teacher's Remarks:
            </p>
            <p className="text-xs text-gray-600 italic">
              "Advait demonstrates exceptional co-scholastic abilities. His
              performance across all areas reflects a well-rounded personality
              with strong leadership qualities and creative expression."
            </p>
          </div>
        }
        {settings.promotionCriteria &&
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-center">
            <span className="font-semibold text-green-700">
              ✓ Eligible for Promotion to Class IX
            </span>
          </div>
        }
      </div>
      {/* Signature */}
      <div className="grid grid-cols-3 gap-4 p-4 border-t border-gray-200 text-xs text-center">
        <div>
          <div className="border-t border-gray-400 pt-1 mt-6">
            Class Teacher
          </div>
        </div>
        <div>
          <div className="border-t border-gray-400 pt-1 mt-6">
            Parent / Guardian
          </div>
        </div>
        <div>
          <div className="border-t border-gray-400 pt-1 mt-6">Principal</div>
        </div>
      </div>
    </div>);

}
function ICSEPreview({ settings }: {settings: ReportSettings;}) {
  return (
    <div className="border-2 border-gray-300 rounded-xl overflow-hidden bg-white text-sm">
      <div className="bg-emerald-700 text-white text-center py-4 px-6">
        <h2 className="text-lg font-bold">ST. MARY'S HIGH SCHOOL</h2>
        <p className="text-emerald-200 text-xs">
          Affiliated to CISCE | ICSE School
        </p>
      </div>
      <div className="bg-emerald-50 text-center py-2 border-b border-emerald-200">
        <p className="text-sm font-semibold text-emerald-800">
          CO-SCHOLASTIC ASSESSMENT REPORT — 2024-25
        </p>
      </div>
      <div className="p-4">
        <div className="bg-emerald-700 text-white text-center py-1.5 rounded-t-lg text-xs font-bold uppercase">
          Co-Scholastic Activities & Personal Qualities
        </div>
        <table className="w-full border border-gray-300 text-xs">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-3 text-left border-r border-gray-300">
                Area
              </th>
              <th className="py-2 px-3 text-center border-r border-gray-300">
                Grade
              </th>
              {settings.descriptiveRemarks &&
              <th className="py-2 px-3 text-left">Remarks</th>
              }
            </tr>
          </thead>
          <tbody>
            {AREAS_ORDER.map((area, idx) =>
            <tr
              key={area.id}
              className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>

                <td className="py-2 px-3 border-r border-gray-200 font-medium">
                  {area.name}
                </td>
                <td className="py-2 px-3 text-center border-r border-gray-200">
                  <span
                  className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${gradeColors[area.overall]}`}>

                    {area.overall}
                  </span>
                </td>
                {settings.descriptiveRemarks &&
              <td className="py-2 px-3 text-gray-500 italic text-xs">
                    Excellent performance
                  </td>
              }
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>);

}
export function ActivityReportCardSection() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('cbse');
  const [settings, setSettings] = useState<ReportSettings>({
    autoPullGrades: true,
    descriptiveRemarks: true,
    attendanceLinkage: true,
    promotionCriteria: true
  });
  const [areaOrder, setAreaOrder] = useState(AREAS_ORDER.map((a) => a.id));
  const toggleSetting = (key: keyof ReportSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  const moveArea = (id: string, dir: 'up' | 'down') => {
    const idx = areaOrder.indexOf(id);
    if (dir === 'up' && idx > 0) {
      const newOrder = [...areaOrder];
      [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
      setAreaOrder(newOrder);
    } else if (dir === 'down' && idx < areaOrder.length - 1) {
      const newOrder = [...areaOrder];
      [newOrder[idx], newOrder[idx + 1]] = [newOrder[idx + 1], newOrder[idx]];
      setAreaOrder(newOrder);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl text-white shadow-lg">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Co-Scholastic Report Card Integration
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Configure and preview the co-scholastic section of the student
              report card
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Printer className="w-4 h-4" /> Print Preview
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="space-y-5">
          {/* Template Selector */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Layout className="w-4 h-4 text-emerald-600" /> Template
            </h3>
            <div className="space-y-2">
              {templates.map((template) =>
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`w-full flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all ${selectedTemplate === template.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'}`}>

                  <div
                  className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 ${selectedTemplate === template.id ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'}`} />

                  <div>
                    <p
                    className={`text-sm font-semibold ${selectedTemplate === template.id ? 'text-emerald-700' : 'text-gray-800'}`}>

                      {template.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {template.description}
                    </p>
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Toggle Options */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4 text-emerald-600" /> Display Options
            </h3>
            <div className="space-y-4">
              {[
              {
                key: 'autoPullGrades' as const,
                label: 'Auto Pull Grades',
                desc: 'Automatically fetch grades from entry module'
              },
              {
                key: 'descriptiveRemarks' as const,
                label: 'Descriptive Remarks',
                desc: 'Include teacher remarks in report card'
              },
              {
                key: 'attendanceLinkage' as const,
                label: 'Attendance Linkage',
                desc: 'Show attendance percentage'
              },
              {
                key: 'promotionCriteria' as const,
                label: 'Promotion Criteria',
                desc: 'Display promotion eligibility status'
              }].
              map((option) =>
              <div
                key={option.key}
                className="flex items-start justify-between gap-3">

                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {option.label}
                    </p>
                    <p className="text-xs text-gray-500">{option.desc}</p>
                  </div>
                  <button onClick={() => toggleSetting(option.key)}>
                    {settings[option.key] ?
                  <ToggleRight className="w-7 h-7 text-emerald-500" /> :

                  <ToggleLeft className="w-7 h-7 text-gray-400" />
                  }
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Area Order (Custom Template) */}
          {selectedTemplate === 'custom' &&
          <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" /> Area Order
              </h3>
              <div className="space-y-2">
                {areaOrder.map((areaId, idx) => {
                const area = AREAS_ORDER.find((a) => a.id === areaId)!;
                return (
                  <div
                    key={areaId}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200">

                      <span className="text-xs text-gray-400 w-5 text-center">
                        {idx + 1}
                      </span>
                      <span className="flex-1 text-sm text-gray-700">
                        {area.name}
                      </span>
                      <div className="flex gap-1">
                        <button
                        onClick={() => moveArea(areaId, 'up')}
                        disabled={idx === 0}
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 text-xs">

                          ↑
                        </button>
                        <button
                        onClick={() => moveArea(areaId, 'down')}
                        disabled={idx === areaOrder.length - 1}
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 text-xs">

                          ↓
                        </button>
                      </div>
                    </div>);

              })}
              </div>
            </div>
          }
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-600" /> Report Card Preview
              </h3>
              <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full font-medium">
                {templates.find((t) => t.id === selectedTemplate)?.name}
              </span>
            </div>
            <div className="max-w-2xl mx-auto">
              {selectedTemplate === 'cbse' &&
              <CBSEPreview settings={settings} />
              }
              {selectedTemplate === 'icse' &&
              <ICSEPreview settings={settings} />
              }
              {selectedTemplate === 'state' &&
              <CBSEPreview settings={settings} />
              }
              {selectedTemplate === 'custom' &&
              <CBSEPreview settings={settings} />
              }
            </div>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-3">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                This preview shows sample data for student Advait Krishnan,
                Class 8-A. The actual report card will pull live data from the
                grade entry module when Auto Pull Grades is enabled.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>);

}