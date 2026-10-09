import React, { useState, Component } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { MultiSelect } from '../../../components/ui/MultiSelect';
import {
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  Brain,
  MessageCircle,
  Hand,
  Heart,
  Palette,
  Droplet,
  Save,
  X,
  CheckCircle,
  Settings,
  Eye,
  Layers,
  Star } from
'lucide-react';
interface Skill {
  id: string;
  name: string;
  description: string;
  classMapping: string[];
  isActive: boolean;
}
interface Domain {
  id: string;
  name: string;
  icon: any;
  color: string;
  skills: Skill[];
}
interface GradeScale {
  code: string;
  description: string;
  displayOrder: number;
  colorTag: string;
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

const ICON_OPTIONS = [
{
  label: 'Brain (Cognitive)',
  value: 'Brain',
  icon: Brain
},
{
  label: 'MessageCircle (Language)',
  value: 'MessageCircle',
  icon: MessageCircle
},
{
  label: 'Hand (Motor)',
  value: 'Hand',
  icon: Hand
},
{
  label: 'Heart (Social)',
  value: 'Heart',
  icon: Heart
},
{
  label: 'Palette (Creative)',
  value: 'Palette',
  icon: Palette
},
{
  label: 'Droplet (Hygiene)',
  value: 'Droplet',
  icon: Droplet
},
{
  label: 'Star (Special)',
  value: 'Star',
  icon: Star
}];

const COLOR_OPTIONS = [
{
  value: 'blue',
  label: 'Blue',
  classes: 'bg-blue-100 text-blue-700 border-blue-300'
},
{
  value: 'green',
  label: 'Green',
  classes: 'bg-green-100 text-green-700 border-green-300'
},
{
  value: 'purple',
  label: 'Purple',
  classes: 'bg-purple-100 text-purple-700 border-purple-300'
},
{
  value: 'red',
  label: 'Red',
  classes: 'bg-red-100 text-red-700 border-red-300'
},
{
  value: 'yellow',
  label: 'Yellow',
  classes: 'bg-yellow-100 text-yellow-700 border-yellow-300'
},
{
  value: 'cyan',
  label: 'Cyan',
  classes: 'bg-cyan-100 text-cyan-700 border-cyan-300'
},
{
  value: 'orange',
  label: 'Orange',
  classes: 'bg-orange-100 text-orange-700 border-orange-300'
},
{
  value: 'pink',
  label: 'Pink',
  classes: 'bg-pink-100 text-pink-700 border-pink-300'
}];

const GRADE_COLOR_OPTIONS = [
{
  value: 'bg-green-500',
  label: 'Green'
},
{
  value: 'bg-blue-500',
  label: 'Blue'
},
{
  value: 'bg-yellow-500',
  label: 'Yellow'
},
{
  value: 'bg-red-500',
  label: 'Red'
},
{
  value: 'bg-purple-500',
  label: 'Purple'
},
{
  value: 'bg-orange-500',
  label: 'Orange'
},
{
  value: 'bg-gray-400',
  label: 'Gray'
}];

export function PreschoolSkillMilestoneMaster() {
  const [activeSection, setActiveSection] = useState<'domains' | 'grade-setup'>(
    'domains'
  );
  const [expandedDomains, setExpandedDomains] = useState<string[]>(['1']);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<{
    domainId: string;
    skill: Skill;
  } | null>(null);
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [classFilter, setClassFilter] = useState('');
  const [skillFormData, setSkillFormData] = useState({
    domainId: '',
    name: '',
    description: '',
    classMapping: [] as string[],
    isActive: true
  });
  const [domainFormData, setDomainFormData] = useState({
    name: '',
    iconValue: 'Brain',
    color: 'blue'
  });
  // Grade Setup State
  const [gradeScales, setGradeScales] = useState<GradeScale[]>([
  {
    code: 'A',
    description: 'Excellent',
    displayOrder: 1,
    colorTag: 'bg-green-500'
  },
  {
    code: 'B',
    description: 'Good',
    displayOrder: 2,
    colorTag: 'bg-blue-500'
  },
  {
    code: 'C',
    description: 'Developing',
    displayOrder: 3,
    colorTag: 'bg-yellow-500'
  },
  {
    code: 'D',
    description: 'Needs Support',
    displayOrder: 4,
    colorTag: 'bg-red-500'
  }]
  );
  const [showAddGrade, setShowAddGrade] = useState(false);
  const [newGrade, setNewGrade] = useState<GradeScale>({
    code: '',
    description: '',
    displayOrder: 5,
    colorTag: 'bg-blue-500'
  });
  const [editingGradeIdx, setEditingGradeIdx] = useState<number | null>(null);
  const [domains, setDomains] = useState<Domain[]>([
  {
    id: '1',
    name: 'Cognitive Skills',
    icon: Brain,
    color: 'blue',
    skills: [
    {
      id: '1-1',
      name: 'Recognizes colors',
      description: 'Identifies and names basic colors',
      classMapping: ['Nursery', 'Jr KG'],
      isActive: true
    },
    {
      id: '1-2',
      name: 'Identifies shapes',
      description: 'Recognizes basic geometric shapes',
      classMapping: ['Nursery', 'Jr KG', 'Sr KG'],
      isActive: true
    },
    {
      id: '1-3',
      name: 'Counts 1-10',
      description: 'Counts objects up to ten',
      classMapping: ['Jr KG', 'Sr KG'],
      isActive: true
    }]

  },
  {
    id: '2',
    name: 'Language & Communication',
    icon: MessageCircle,
    color: 'green',
    skills: [
    {
      id: '2-1',
      name: 'Speaks simple sentences',
      description: 'Forms and speaks 3-4 word sentences',
      classMapping: ['Nursery', 'Jr KG'],
      isActive: true
    },
    {
      id: '2-2',
      name: 'Identifies letters',
      description: 'Recognizes alphabets A-Z',
      classMapping: ['Jr KG', 'Sr KG'],
      isActive: true
    }]

  },
  {
    id: '3',
    name: 'Motor Skills (Fine / Gross)',
    icon: Hand,
    color: 'purple',
    skills: [
    {
      id: '3-1',
      name: 'Holds pencil correctly',
      description: 'Uses proper grip to hold pencil',
      classMapping: ['Jr KG', 'Sr KG'],
      isActive: true
    },
    {
      id: '3-2',
      name: 'Runs and jumps',
      description: 'Demonstrates basic gross motor skills',
      classMapping: ['Nursery', 'Jr KG'],
      isActive: true
    }]

  },
  {
    id: '4',
    name: 'Social & Emotional Development',
    icon: Heart,
    color: 'red',
    skills: [
    {
      id: '4-1',
      name: 'Shares toys with peers',
      description: 'Willingly shares toys and takes turns',
      classMapping: ['Nursery', 'Jr KG', 'Sr KG'],
      isActive: true
    }]

  },
  {
    id: '5',
    name: 'Creativity & Expression',
    icon: Palette,
    color: 'yellow',
    skills: []
  },
  {
    id: '6',
    name: 'Personal Hygiene & Habits',
    icon: Droplet,
    color: 'cyan',
    skills: []
  }]
  );
  const toggleDomain = (domainId: string) => {
    setExpandedDomains((prev) =>
    prev.includes(domainId) ?
    prev.filter((id) => id !== domainId) :
    [...prev, domainId]
    );
  };
  const getColorClasses = (color: string) => {
    return (
      COLOR_OPTIONS.find((c) => c.value === color)?.classes ||
      'bg-blue-100 text-blue-700 border-blue-300');

  };
  const getIconComponent = (iconValue: string) => {
    return ICON_OPTIONS.find((i) => i.value === iconValue)?.icon || Brain;
  };
  const handleAddSkill = (domainId: string) => {
    setEditingSkill(null);
    setSkillFormData({
      domainId,
      name: '',
      description: '',
      classMapping: [],
      isActive: true
    });
    setShowSkillModal(true);
  };
  const handleEditSkill = (domainId: string, skill: Skill) => {
    setEditingSkill({
      domainId,
      skill
    });
    setSkillFormData({
      domainId,
      name: skill.name,
      description: skill.description,
      classMapping: skill.classMapping,
      isActive: skill.isActive
    });
    setShowSkillModal(true);
  };
  const handleSaveSkill = () => {
    setDomains(
      domains.map((domain) => {
        if (domain.id !== skillFormData.domainId) return domain;
        if (editingSkill) {
          return {
            ...domain,
            skills: domain.skills.map((s) =>
            s.id === editingSkill.skill.id ?
            {
              ...s,
              ...skillFormData
            } :
            s
            )
          };
        }
        const newSkill: Skill = {
          id: `${domain.id}-${Date.now()}`,
          name: skillFormData.name,
          description: skillFormData.description,
          classMapping: skillFormData.classMapping,
          isActive: skillFormData.isActive
        };
        return {
          ...domain,
          skills: [...domain.skills, newSkill]
        };
      })
    );
    setShowSkillModal(false);
  };
  const handleDeleteSkill = (domainId: string, skillId: string) => {
    if (confirm('Delete this skill?')) {
      setDomains(
        domains.map((d) =>
        d.id === domainId ?
        {
          ...d,
          skills: d.skills.filter((s) => s.id !== skillId)
        } :
        d
        )
      );
    }
  };
  const handleAddDomain = () => {
    setEditingDomain(null);
    setDomainFormData({
      name: '',
      iconValue: 'Brain',
      color: 'blue'
    });
    setShowDomainModal(true);
  };
  const handleEditDomain = (domain: Domain) => {
    setEditingDomain(domain);
    setDomainFormData({
      name: domain.name,
      iconValue: 'Brain',
      color: domain.color
    });
    setShowDomainModal(true);
  };
  const handleSaveDomain = () => {
    const IconComp = getIconComponent(domainFormData.iconValue);
    if (editingDomain) {
      setDomains(
        domains.map((d) =>
        d.id === editingDomain.id ?
        {
          ...d,
          name: domainFormData.name,
          icon: IconComp,
          color: domainFormData.color
        } :
        d
        )
      );
    } else {
      const newDomain: Domain = {
        id: Date.now().toString(),
        name: domainFormData.name,
        icon: IconComp,
        color: domainFormData.color,
        skills: []
      };
      setDomains([...domains, newDomain]);
    }
    setShowDomainModal(false);
  };
  const handleDeleteDomain = (domainId: string) => {
    if (confirm('Delete this domain and all its skills?')) {
      setDomains(domains.filter((d) => d.id !== domainId));
    }
  };
  const toggleClassMapping = (cls: string) => {
    setSkillFormData((prev) => ({
      ...prev,
      classMapping: prev.classMapping.includes(cls) ?
      prev.classMapping.filter((c) => c !== cls) :
      [...prev.classMapping, cls]
    }));
  };
  const handleAddGrade = () => {
    if (newGrade.code && newGrade.description) {
      setGradeScales([...gradeScales, newGrade]);
      setNewGrade({
        code: '',
        description: '',
        displayOrder: gradeScales.length + 2,
        colorTag: 'bg-blue-500'
      });
      setShowAddGrade(false);
    }
  };
  const handleDeleteGrade = (index: number) => {
    setGradeScales(gradeScales.filter((_, i) => i !== index));
  };
  const filteredDomains = classFilter ?
  domains.map((d) => ({
    ...d,
    skills: d.skills.filter((s) => s.classMapping.includes(classFilter))
  })) :
  domains;
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Skill & Milestone Master
          </h1>
          <p className="text-sm text-gray-500">
            Define developmental domains, skills, and grade scales for preschool
            assessment
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleAddDomain}>
            <Plus className="w-4 h-4 mr-2" />
            Add Domain
          </Button>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveSection('domains')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeSection === 'domains' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}>

          <Layers className="w-4 h-4" />
          Domains & Skills
        </button>
        <button
          onClick={() => setActiveSection('grade-setup')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeSection === 'grade-setup' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}>

          <Star className="w-4 h-4" />
          Grade Setup
        </button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MultiSelect
            label="School Branch"
            options={BRANCH_OPTIONS}
            value={selectedBranches}
            onChange={setSelectedBranches}
            placeholder="All Branches" />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class Filter
            </label>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">

              <option value="">All Classes</option>
              <option>Nursery</option>
              <option>Jr KG</option>
              <option>Sr KG</option>
            </select>
          </div>
          <div className="flex items-end">
            <div className="text-sm text-gray-600 bg-blue-50 rounded-lg px-4 py-2">
              <span className="font-semibold text-blue-700">
                {domains.reduce((acc, d) => acc + d.skills.length, 0)}
              </span>{' '}
              total skills across{' '}
              <span className="font-semibold text-blue-700">
                {domains.length}
              </span>{' '}
              domains
            </div>
          </div>
        </div>
      </Card>

      {/* Domains & Skills Section */}
      {activeSection === 'domains' &&
      <div className="space-y-4">
          {filteredDomains.map((domain) => {
          const Icon = domain.icon;
          const isExpanded = expandedDomains.includes(domain.id);
          return (
            <Card key={domain.id} className="overflow-hidden">
                <div
                onClick={() => toggleDomain(domain.id)}
                className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors border-l-4 ${getColorClasses(domain.color)}`}>

                  <div className="flex items-center gap-3">
                    <div
                    className={`p-2 rounded-lg ${getColorClasses(domain.color)}`}>

                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {domain.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {domain.skills.length} skills defined
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddSkill(domain.id);
                    }}>

                      <Plus className="w-4 h-4 mr-1" />
                      Add Skill
                    </Button>
                    <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditDomain(domain);
                    }}>

                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteDomain(domain.id);
                    }}>

                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                    {isExpanded ?
                  <ChevronDown className="w-5 h-5 text-gray-400" /> :

                  <ChevronRight className="w-5 h-5 text-gray-400" />
                  }
                  </div>
                </div>

                {isExpanded &&
              <div className="border-t border-gray-200">
                    {domain.skills.length === 0 ?
                <div className="p-8 text-center text-gray-500">
                        <p className="text-sm">No skills defined yet</p>
                        <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => handleAddSkill(domain.id)}>

                          <Plus className="w-4 h-4 mr-1" />
                          Add First Skill
                        </Button>
                      </div> :

                <div className="divide-y divide-gray-100">
                        {domain.skills.map((skill) =>
                  <div key={skill.id} className="p-4 hover:bg-gray-50">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-gray-900">
                                    {skill.name}
                                  </h4>
                                  <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${skill.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>

                                    {skill.isActive ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-500 mb-2">
                                  {skill.description}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {skill.classMapping.map((cls) =>
                          <span
                            key={cls}
                            className="inline-block px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">

                                      {cls}
                                    </span>
                          )}
                                </div>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                          handleEditSkill(domain.id, skill)
                          }>

                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                          handleDeleteSkill(domain.id, skill.id)
                          }>

                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            </div>
                          </div>
                  )}
                      </div>
                }
                  </div>
              }
              </Card>);

        })}

          {/* All Domains Summary View */}
          <Card className="p-5">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              Developmental Domains & Skills Overview
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase">
                      Domain
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-bold text-gray-600 uppercase">
                      Nursery
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-bold text-gray-600 uppercase">
                      Jr KG
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-bold text-gray-600 uppercase">
                      Sr KG
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-bold text-gray-600 uppercase">
                      Total Skills
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {domains.map((domain) => {
                  const Icon = domain.icon;
                  return (
                    <tr key={domain.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div
                            className={`p-1.5 rounded-lg ${getColorClasses(domain.color)}`}>

                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-gray-900">
                              {domain.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-sm font-semibold text-gray-700">
                            {
                          domain.skills.filter((s) =>
                          s.classMapping.includes('Nursery')
                          ).length
                          }
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-sm font-semibold text-gray-700">
                            {
                          domain.skills.filter((s) =>
                          s.classMapping.includes('Jr KG')
                          ).length
                          }
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-sm font-semibold text-gray-700">
                            {
                          domain.skills.filter((s) =>
                          s.classMapping.includes('Sr KG')
                          ).length
                          }
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-block px-2.5 py-0.5 bg-blue-100 text-blue-700 text-sm font-bold rounded-full">
                            {domain.skills.length}
                          </span>
                        </td>
                      </tr>);

                })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      }

      {/* Grade Setup Section */}
      {activeSection === 'grade-setup' &&
      <div className="space-y-6">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">
                  Grade Scale Configuration
                </h3>
                <p className="text-sm text-gray-500">
                  Define grades used in skill assessment
                </p>
              </div>
              <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddGrade(true)}>

                <Plus className="w-4 h-4 mr-2" />
                Add Grade
              </Button>
            </div>

            {showAddGrade &&
          <div className="mb-5 p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <h4 className="font-medium text-gray-800 mb-3">
                  Add New Grade
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Grade Code
                    </label>
                    <input
                  value={newGrade.code}
                  onChange={(e) =>
                  setNewGrade({
                    ...newGrade,
                    code: e.target.value
                  })
                  }
                  placeholder="e.g., A"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />

                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Description
                    </label>
                    <input
                  value={newGrade.description}
                  onChange={(e) =>
                  setNewGrade({
                    ...newGrade,
                    description: e.target.value
                  })
                  }
                  placeholder="e.g., Excellent"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />

                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Display Order
                    </label>
                    <input
                  type="number"
                  value={newGrade.displayOrder}
                  onChange={(e) =>
                  setNewGrade({
                    ...newGrade,
                    displayOrder: parseInt(e.target.value)
                  })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />

                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Color
                    </label>
                    <select
                  value={newGrade.colorTag}
                  onChange={(e) =>
                  setNewGrade({
                    ...newGrade,
                    colorTag: e.target.value
                  })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">

                      {GRADE_COLOR_OPTIONS.map((c) =>
                  <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                  )}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button variant="primary" size="sm" onClick={handleAddGrade}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Grade
                  </Button>
                  <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddGrade(false)}>

                    Cancel
                  </Button>
                </div>
              </div>
          }

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                      Grade Code
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                      Description
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">
                      Order
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">
                      Color
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">
                      Preview
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {gradeScales.map((scale, index) =>
                <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {scale.code}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {scale.description}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600">
                        {scale.displayOrder}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center">
                          <div
                        className={`w-6 h-6 rounded-full ${scale.colorTag}`} />

                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center">
                          <span
                        className={`px-3 py-1 rounded-full text-white text-xs font-bold ${scale.colorTag}`}>

                            {scale.code}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteGrade(index)}>

                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Grade Preview */}
          <Card className="p-5">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-600" />
              Grade Preview
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              How grades will appear in assessment entries and reports:
            </p>
            <div className="flex flex-wrap gap-3">
              {gradeScales.map((scale) =>
            <div
              key={scale.code}
              className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">

                  <span
                className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold ${scale.colorTag}`}>

                    {scale.code}
                  </span>
                  <span className="text-sm text-gray-700">
                    {scale.description}
                  </span>
                </div>
            )}
            </div>
          </Card>
        </div>
      }

      {/* Add/Edit Skill Modal */}
      {showSkillModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
              </h2>
              <Button variant="ghost" onClick={() => setShowSkillModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skill Name
                </label>
                <input
                value={skillFormData.name}
                onChange={(e) =>
                setSkillFormData({
                  ...skillFormData,
                  name: e.target.value
                })
                }
                placeholder="e.g., Recognizes colors"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                value={skillFormData.description}
                onChange={(e) =>
                setSkillFormData({
                  ...skillFormData,
                  description: e.target.value
                })
                }
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class Mapping
                </label>
                <div className="flex gap-2">
                  {['Nursery', 'Jr KG', 'Sr KG'].map((cls) =>
                <button
                  key={cls}
                  onClick={() => toggleClassMapping(cls)}
                  className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${skillFormData.classMapping.includes(cls) ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'}`}>

                      {cls}
                    </button>
                )}
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  Is Active
                </span>
                <button
                onClick={() =>
                setSkillFormData({
                  ...skillFormData,
                  isActive: !skillFormData.isActive
                })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${skillFormData.isActive ? 'bg-green-600' : 'bg-gray-300'}`}>

                  <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${skillFormData.isActive ? 'translate-x-6' : 'translate-x-1'}`} />

                </button>
              </div>
            </div>
            <div className="p-5 border-t border-gray-200 flex justify-end gap-3">
              <Button
              variant="outline"
              onClick={() => setShowSkillModal(false)}>

                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveSkill}>
                <Save className="w-4 h-4 mr-2" />
                {editingSkill ? 'Save Changes' : 'Add Skill'}
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Add/Edit Domain Modal */}
      {showDomainModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                {editingDomain ? 'Edit Domain' : 'Add New Domain'}
              </h2>
              <Button variant="ghost" onClick={() => setShowDomainModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Domain Name
                </label>
                <input
                value={domainFormData.name}
                onChange={(e) =>
                setDomainFormData({
                  ...domainFormData,
                  name: e.target.value
                })
                }
                placeholder="e.g., Cognitive Skills"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon
                </label>
                <select
                value={domainFormData.iconValue}
                onChange={(e) =>
                setDomainFormData({
                  ...domainFormData,
                  iconValue: e.target.value
                })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

                  {ICON_OPTIONS.map((i) =>
                <option key={i.value} value={i.value}>
                      {i.label}
                    </option>
                )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Theme
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((c) =>
                <button
                  key={c.value}
                  onClick={() =>
                  setDomainFormData({
                    ...domainFormData,
                    color: c.value
                  })
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border-2 transition-all ${domainFormData.color === c.value ? 'border-gray-800 scale-105' : 'border-transparent'} ${c.classes}`}>

                      {c.label}
                    </button>
                )}
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-gray-200 flex justify-end gap-3">
              <Button
              variant="outline"
              onClick={() => setShowDomainModal(false)}>

                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveDomain}>
                <Save className="w-4 h-4 mr-2" />
                {editingDomain ? 'Save Changes' : 'Add Domain'}
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}
export default PreschoolSkillMilestoneMaster;