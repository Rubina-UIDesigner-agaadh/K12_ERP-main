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
  X,
  Copy,
  Search,
  Eye,
  ChevronDown,
  ChevronRight,
  Layers,
  Star,
  Settings,
  GripVertical } from
'lucide-react';
interface TemplateSection {
  id: string;
  name: string;
  weightage: number;
  competencies: {
    id: string;
    name: string;
    description: string;
  }[];
}
interface Template {
  id: string;
  name: string;
  staffType: string;
  sections: TemplateSection[];
  status: 'Active' | 'Draft';
  usedIn: number;
  createdOn: string;
}
const mockTemplates: Template[] = [
{
  id: 'TPL001',
  name: 'Teaching Staff Template',
  staffType: 'Teaching',
  status: 'Active',
  usedIn: 3,
  createdOn: '2024-01-15',
  sections: [
  {
    id: 's1',
    name: 'Core Teaching Competencies',
    weightage: 50,
    competencies: [
    {
      id: 'c1',
      name: 'Classroom Management',
      description: 'Ability to maintain discipline and engagement'
    },
    {
      id: 'c2',
      name: 'Subject Knowledge',
      description: 'Depth and currency of subject expertise'
    },
    {
      id: 'c3',
      name: 'Student Engagement',
      description: 'Techniques to involve students actively'
    },
    {
      id: 'c4',
      name: 'Assessment & Evaluation',
      description: 'Fair and effective assessment practices'
    }]

  },
  {
    id: 's2',
    name: 'Professional Growth',
    weightage: 30,
    competencies: [
    {
      id: 'c5',
      name: 'Professional Development',
      description: 'Continuous learning and skill enhancement'
    },
    {
      id: 'c6',
      name: 'Technology Integration',
      description: 'Use of digital tools in teaching'
    }]

  },
  {
    id: 's3',
    name: 'Interpersonal Skills',
    weightage: 20,
    competencies: [
    {
      id: 'c7',
      name: 'Communication Skills',
      description: 'Clarity in verbal and written communication'
    },
    {
      id: 'c8',
      name: 'Teamwork & Collaboration',
      description: 'Working effectively with colleagues'
    }]

  }]

},
{
  id: 'TPL002',
  name: 'Administrative Staff Template',
  staffType: 'Administrative',
  status: 'Active',
  usedIn: 2,
  createdOn: '2024-01-20',
  sections: [
  {
    id: 's1',
    name: 'Job Performance',
    weightage: 60,
    competencies: [
    {
      id: 'c1',
      name: 'Task Completion',
      description: 'Timely and accurate completion of duties'
    },
    {
      id: 'c2',
      name: 'Process Adherence',
      description: 'Following established procedures'
    },
    {
      id: 'c3',
      name: 'Problem Solving',
      description: 'Ability to handle issues independently'
    }]

  },
  {
    id: 's2',
    name: 'Soft Skills',
    weightage: 40,
    competencies: [
    {
      id: 'c4',
      name: 'Communication',
      description: 'Effective communication with stakeholders'
    },
    {
      id: 'c5',
      name: 'Punctuality & Discipline',
      description: 'Adherence to work timings and rules'
    }]

  }]

},
{
  id: 'TPL003',
  name: 'Support Staff Template',
  staffType: 'Support',
  status: 'Draft',
  usedIn: 0,
  createdOn: '2024-02-01',
  sections: [
  {
    id: 's1',
    name: 'Work Quality',
    weightage: 70,
    competencies: [
    {
      id: 'c1',
      name: 'Task Execution',
      description: 'Quality of work performed'
    },
    {
      id: 'c2',
      name: 'Reliability',
      description: 'Dependability and consistency'
    }]

  },
  {
    id: 's2',
    name: 'Behaviour',
    weightage: 30,
    competencies: [
    {
      id: 'c3',
      name: 'Conduct',
      description: 'Professional behaviour and attitude'
    }]

  }]

}];

export function AppraisalTemplateMaster() {
  const [templates] = useState(mockTemplates);
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(
    'TPL001'
  );
  const [search, setSearch] = useState('');
  const filtered = templates.filter((t) =>
  t.name.toLowerCase().includes(search.toLowerCase())
  );
  const toggleExpand = (id: string) =>
  setExpandedTemplate((prev) => prev === id ? null : id);
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Appraisal Template Master
          </h1>
          <p className="text-sm text-gray-500">
            Design and manage appraisal evaluation templates
          </p>
        </div>
        <Button variant="primary">
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((template) =>
        <Card key={template.id}>
            <button
            onClick={() => toggleExpand(template.id)}
            className="w-full flex items-center justify-between">

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Layers className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {template.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">{template.staffType}</Badge>
                    {template.status === 'Active' ?
                  <Badge variant="success">Active</Badge> :

                  <Badge variant="secondary">Draft</Badge>
                  }
                    <span className="text-xs text-gray-500">
                      {template.sections.length} sections ·{' '}
                      {template.sections.reduce(
                      (s, sec) => s + sec.competencies.length,
                      0
                    )}{' '}
                      competencies
                    </span>
                    <span className="text-xs text-gray-500">
                      · Used in {template.usedIn} cycles
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                className="p-1.5 hover:bg-blue-100 rounded-lg"
                title="Edit">

                  <Edit className="w-4 h-4 text-blue-600" />
                </button>
                <button
                className="p-1.5 hover:bg-gray-100 rounded-lg"
                title="Duplicate">

                  <Copy className="w-4 h-4 text-gray-500" />
                </button>
                <button
                className="p-1.5 hover:bg-red-100 rounded-lg"
                title="Delete">

                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
                {expandedTemplate === template.id ?
              <ChevronDown className="w-5 h-5 text-gray-400" /> :

              <ChevronRight className="w-5 h-5 text-gray-400" />
              }
              </div>
            </button>

            {expandedTemplate === template.id &&
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                {template.sections.map((section) =>
            <div key={section.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                        <h4 className="text-sm font-semibold text-gray-900">
                          {section.name}
                        </h4>
                      </div>
                      <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-700">
                        {section.weightage}%
                      </span>
                    </div>
                    <div className="space-y-2 ml-6">
                      {section.competencies.map((comp) =>
                <div
                  key={comp.id}
                  className="flex items-center gap-3 p-2 bg-white rounded border border-gray-200">

                          <Star className="w-4 h-4 text-amber-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {comp.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {comp.description}
                            </p>
                          </div>
                        </div>
                )}
                    </div>
                  </div>
            )}
                <div className="flex items-center justify-between pt-2 text-sm text-gray-500">
                  <span>
                    Total Weightage:{' '}
                    <span className="font-bold text-gray-900">
                      {template.sections.reduce(
                    (s, sec) => s + sec.weightage,
                    0
                  )}
                      %
                    </span>
                  </span>
                  <span>Created: {template.createdOn}</span>
                </div>
              </div>
          }
          </Card>
        )}
      </div>
    </div>);

}