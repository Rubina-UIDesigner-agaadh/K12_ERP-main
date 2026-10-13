import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Plus, Trash2, Save, Search, ClipboardList } from 'lucide-react';

const STORAGE_KEY = 'k12-evaluation-scorecards-v1';

type Criterion = {
  key: string;
  label: string;
  description: string;
};

type PositionScorecard = {
  id: string;
  position: string;
  screening: Criterion[];
  interview: Criterion[];
};

const slug = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `item-${Date.now()}`;

const DEFAULT_SCORECARDS: PositionScorecard[] = [
  {
    id: 'sc-math',
    position: 'Math Teacher',
    screening: [
      { key: 'qualification', label: 'Qualification Match', description: 'Degree and B.Ed alignment' },
      { key: 'experience', label: 'Experience Match', description: 'Years of relevant teaching' },
      { key: 'subjectKnowledge', label: 'Subject Knowledge', description: 'Mathematics depth' },
      { key: 'communication', label: 'Communication Skills', description: 'Clarity of expression' },
      { key: 'culturalFit', label: 'Cultural Fit', description: 'Alignment with school values' }
    ],
    interview: [
      { key: 'subjectExpertise', label: 'Subject Expertise', description: 'Depth of knowledge in the subject area' },
      { key: 'classroomManagement', label: 'Classroom Management', description: 'Ability to manage and engage students' },
      { key: 'teachingDemo', label: 'Teaching Demo Performance', description: 'Quality of demo class delivery' },
      { key: 'communication', label: 'Communication Skills', description: 'Clarity and effectiveness of communication' },
      { key: 'confidence', label: 'Confidence', description: 'Poise and self-assurance during interview' },
      { key: 'behaviour', label: 'Behaviour & Attitude', description: 'Professional conduct and positive attitude' }
    ]
  },
  {
    id: 'sc-science',
    position: 'Science HOD',
    screening: [
      { key: 'qualification', label: 'Qualification Match', description: 'Post-graduate science + leadership' },
      { key: 'experience', label: 'Leadership Experience', description: 'HOD / coordinator experience' },
      { key: 'subjectKnowledge', label: 'Subject Knowledge', description: 'Science pedagogy' },
      { key: 'communication', label: 'Communication Skills', description: 'Stakeholder communication' },
      { key: 'culturalFit', label: 'Cultural Fit', description: 'Team and school culture' }
    ],
    interview: [
      { key: 'subjectExpertise', label: 'Subject Expertise', description: 'Science domain mastery' },
      { key: 'leadership', label: 'Department Leadership', description: 'Ability to lead faculty' },
      { key: 'teachingDemo', label: 'Teaching Demo Performance', description: 'Demo class quality' },
      { key: 'communication', label: 'Communication Skills', description: 'Clarity with staff and parents' },
      { key: 'vision', label: 'Academic Vision', description: 'Department improvement ideas' },
      { key: 'behaviour', label: 'Behaviour & Attitude', description: 'Professional conduct' }
    ]
  }
];

function loadScorecards(): PositionScorecard[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    /* defaults */
  }
  return DEFAULT_SCORECARDS;
}

export function EvaluationCriteriaCompetencyMaster() {
  const [scorecards, setScorecards] = useState<PositionScorecard[]>(() => loadScorecards());
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(scorecards[0]?.id || '');
  const [draft, setDraft] = useState<PositionScorecard | null>(scorecards[0] ? JSON.parse(JSON.stringify(scorecards[0])) : null);
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(scorecards));
  }, [scorecards]);

  const filtered = useMemo(
    () => scorecards.filter((card) => card.position.toLowerCase().includes(search.toLowerCase())),
    [scorecards, search]
  );

  const selectCard = (card: PositionScorecard) => {
    setSelectedId(card.id);
    setDraft(JSON.parse(JSON.stringify(card)));
    setSavedMessage('');
  };

  const addScorecard = () => {
    const card: PositionScorecard = {
      id: `sc-${Date.now()}`,
      position: 'New Position',
      screening: [{ key: 'qualification', label: 'Qualification Match', description: '' }],
      interview: [{ key: 'subjectExpertise', label: 'Subject Expertise', description: '' }]
    };
    setScorecards((prev) => [card, ...prev]);
    selectCard(card);
  };

  const updateCriterion = (
    type: 'screening' | 'interview',
    index: number,
    field: keyof Criterion,
    value: string
  ) => {
    if (!draft) return;
    const next = draft[type].map((item, i) =>
      i === index
        ? { ...item, [field]: value, key: field === 'label' ? slug(value) : item.key }
        : item
    );
    setDraft({ ...draft, [type]: next });
  };

  const addCriterion = (type: 'screening' | 'interview') => {
    if (!draft) return;
    setDraft({
      ...draft,
      [type]: [...draft[type], { key: `item-${Date.now()}`, label: 'New criterion', description: '' }]
    });
  };

  const removeCriterion = (type: 'screening' | 'interview', index: number) => {
    if (!draft) return;
    setDraft({ ...draft, [type]: draft[type].filter((_, i) => i !== index) });
  };

  const saveDraft = () => {
    if (!draft || !draft.position.trim()) return;
    setScorecards((prev) => prev.map((card) => (card.id === draft.id ? draft : card)));
    setSavedMessage(`Scorecard saved for ${draft.position}. Screening and interview pages will use these criteria.`);
  };

  const deleteScorecard = (id: string) => {
    if (!window.confirm('Delete this position scorecard?')) return;
    const next = scorecards.filter((card) => card.id !== id);
    setScorecards(next);
    if (selectedId === id) {
      setSelectedId(next[0]?.id || '');
      setDraft(next[0] ? JSON.parse(JSON.stringify(next[0])) : null);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <ClipboardList className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Evaluation Scorecard Master</h1>
              <p className="text-sm text-gray-500">
                Create what applicants are evaluated on in screening and interview, by position.
              </p>
            </div>
          </div>
          <Button variant="primary" onClick={addScorecard}>
            <Plus className="w-4 h-4 mr-1" />
            New Position Scorecard
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title={`Positions (${filtered.length})`}>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search position..."
              className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm" />
          </div>
          <div className="space-y-2 max-h-[520px] overflow-y-auto">
            {filtered.map((card) =>
            <div
              key={card.id}
              onClick={() => selectCard(card)}
              className={`p-3 rounded-xl border cursor-pointer ${
              selectedId === card.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100 bg-gray-50 hover:bg-gray-100'}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-gray-900">{card.position}</p>
                  <p className="text-xs text-gray-500">
                    {card.screening.length} screening · {card.interview.length} interview
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteScorecard(card.id);
                  }}
                  className="text-gray-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            )}
          </div>
        </Card>

        <div className="lg:col-span-2">
          {draft ?
          <Card title="Scorecard Builder">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <input
                  value={draft.position}
                  onChange={(e) => setDraft({ ...draft, position: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">Screening evaluation</h3>
                    <Button variant="outline" size="sm" onClick={() => addCriterion('screening')}>
                      <Plus className="w-3 h-3 mr-1" />
                      Add criterion
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {draft.screening.map((item, index) =>
                  <div key={`${item.key}-${index}`} className="grid grid-cols-1 md:grid-cols-12 gap-2 p-3 bg-gray-50 rounded-lg">
                        <div className="md:col-span-4">
                          <input
                        value={item.label}
                        onChange={(e) => updateCriterion('screening', index, 'label', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        placeholder="Criterion label" />
                        </div>
                        <div className="md:col-span-7">
                          <input
                        value={item.description}
                        onChange={(e) => updateCriterion('screening', index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        placeholder="What to evaluate" />
                        </div>
                        <div className="md:col-span-1 flex items-center justify-end">
                          <button onClick={() => removeCriterion('screening', index)} className="text-gray-400 hover:text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                  )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">Interview evaluation</h3>
                    <Button variant="outline" size="sm" onClick={() => addCriterion('interview')}>
                      <Plus className="w-3 h-3 mr-1" />
                      Add criterion
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {draft.interview.map((item, index) =>
                  <div key={`${item.key}-${index}`} className="grid grid-cols-1 md:grid-cols-12 gap-2 p-3 bg-gray-50 rounded-lg">
                        <div className="md:col-span-4">
                          <input
                        value={item.label}
                        onChange={(e) => updateCriterion('interview', index, 'label', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        placeholder="Criterion label" />
                        </div>
                        <div className="md:col-span-7">
                          <input
                        value={item.description}
                        onChange={(e) => updateCriterion('interview', index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        placeholder="What to evaluate" />
                        </div>
                        <div className="md:col-span-1 flex items-center justify-end">
                          <button onClick={() => removeCriterion('interview', index)} className="text-gray-400 hover:text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                  )}
                  </div>
                </div>

                {savedMessage &&
              <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">{savedMessage}</p>
              }

                <div className="flex items-center gap-2">
                  <Button variant="primary" onClick={saveDraft}>
                    <Save className="w-4 h-4 mr-1" />
                    Save Scorecard
                  </Button>
                  <Badge variant="info">{draft.screening.length + draft.interview.length} criteria</Badge>
                </div>
              </div>
            </Card> :

          <Card className="p-10 text-center text-gray-400">Select or create a position scorecard.</Card>
          }
        </div>
      </div>
    </div>);

}

export default EvaluationCriteriaCompetencyMaster;
