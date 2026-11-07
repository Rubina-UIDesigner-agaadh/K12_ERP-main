import React, { useEffect, useRef, useState } from 'react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  Check,
  Copy,
  Download,
  Eye,
  Grid3X3,
  Lock,
  MoreVertical,
  Plus,
  Printer,
  Redo2,
  Save,
  Search,
  Trash2,
  Undo2,
  Unlock,
  Upload,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

type CardSide = 'front' | 'back';
type ElType = 'text' | 'shape' | 'image' | 'qr' | 'barcode';
type ToolTab = 'templates' | 'elements' | 'text' | 'images' | 'uploads' | 'background' | 'layers';

interface CardElement {
  id: string;
  type: ElType;
  name: string;
  side: CardSide;
  x: number;
  y: number;
  w: number;
  h: number;
  rotation: number;
  opacity: number;
  locked: boolean;
  hidden: boolean;
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number;
  italic?: boolean;
  underline?: boolean;
  color?: string;
  align?: 'left' | 'center' | 'right';
  letterSpacing?: number;
  lineHeight?: number;
  shape?: 'rect' | 'circle' | 'line' | 'roundRect';
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  radius?: number;
  src?: string;
  fit?: 'cover' | 'contain' | 'fill';
}

interface CardBg {
  kind: 'solid' | 'gradient' | 'image';
  color: string;
  color2?: string;
  image?: string;
  opacity: number;
}

interface CardDesign {
  id: string;
  name: string;
  category: 'Student' | 'Staff' | 'Teacher' | 'Administrator' | 'Custom';
  orientation: 'Portrait' | 'Landscape';
  widthMm: number;
  heightMm: number;
  unit: 'mm' | 'cm' | 'in';
  isDefault: boolean;
  version: number;
  createdAt: string;
  modifiedAt: string;
  background: { front: CardBg; back: CardBg };
  elements: CardElement[];
}

const STORE = 'k12-id-card-designs';
const MM = 3.2;
const CR80 = { w: 85.6, h: 53.98 };

const uid = (p = 'el') => `${p}-${Math.random().toString(36).slice(2, 9)}`;
const nowIso = () => new Date().toISOString();
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

const FONTS = ['Arial', 'Georgia', 'Times New Roman', 'Verdana', 'Trebuchet MS', 'Courier New'];

const TEXT_FIELDS = [
  { name: 'School Name', text: '{{school_name}}' },
  { name: 'School Address', text: '{{school_address}}' },
  { name: 'Student Name', text: '{{student_name}}' },
  { name: 'Admission Number', text: '{{admission_number}}' },
  { name: 'Class', text: '{{class}}' },
  { name: 'Section', text: '{{section}}' },
  { name: 'Roll Number', text: '{{roll_number}}' },
  { name: 'Date of Birth', text: '{{date_of_birth}}' },
  { name: 'Blood Group', text: '{{blood_group}}' },
  { name: 'Academic Session', text: '{{academic_session}}' },
  { name: 'Parent Name', text: '{{parent_name}}' },
  { name: 'Contact Number', text: '{{parent_contact}}' },
  { name: 'Designation', text: '{{designation}}' },
  { name: 'Employee ID', text: '{{employee_id}}' },
  { name: 'Employee Name', text: '{{employee_name}}' },
  { name: 'Department', text: '{{department}}' },
  { name: 'Custom Text', text: 'Custom text' }
];

const SAMPLE: Record<string, string> = {
  school_name: 'Sunrise Public School',
  school_address: 'SG Highway, Ahmedabad 380054',
  student_name: 'Aarav Patel',
  admission_number: 'ADM-2026-1042',
  class: '10',
  section: 'A',
  roll_number: '24',
  date_of_birth: '12-04-2012',
  blood_group: 'O+',
  academic_session: '2026-27',
  parent_name: 'Nikhil Patel',
  parent_contact: '98765 43210',
  designation: 'PGT Physics',
  employee_id: 'EMP-1042',
  employee_name: 'Meera Iyer',
  department: 'Science'
};

function resolveText(text: string | undefined, live: boolean) {
  if (!text) return '';
  if (!live) return text;
  return text.replace(/\{\{(\w+)\}\}/g, (_, key: string) => SAMPLE[key] ?? `{{${key}}}`);
}

const defaultBg = (): CardBg => ({ kind: 'solid', color: '#ffffff', color2: '#dbeafe', opacity: 1 });

function baseEl(partial: Partial<CardElement> & Pick<CardElement, 'type' | 'name' | 'side'>): CardElement {
  return {
    id: uid(partial.type),
    x: 6,
    y: 8,
    w: 30,
    h: 8,
    rotation: 0,
    opacity: 1,
    locked: false,
    hidden: false,
    ...partial
  };
}

function studentTemplate(name: string, category: CardDesign['category'], colorful: boolean): CardDesign {
  const header = colorful ? '#0ea5e9' : '#0f4c81';
  const front: CardElement[] = [
    baseEl({ type: 'shape', name: 'Header', side: 'front', shape: 'rect', fill: header, x: 0, y: 0, w: CR80.h, h: 16, strokeWidth: 0 }),
    baseEl({ type: 'text', name: 'School Name', side: 'front', text: '{{school_name}}', x: 4, y: 4, w: 46, h: 8, color: '#ffffff', fontSize: 11, fontWeight: 700, align: 'center' }),
    baseEl({ type: 'image', name: 'Student Photograph', side: 'front', x: 16, y: 20, w: 22, h: 26, src: '', fit: 'cover', radius: 2, fill: '#e5e7eb' }),
    baseEl({ type: 'text', name: 'Student Name', side: 'front', text: '{{student_name}}', x: 4, y: 48, w: 46, h: 7, fontSize: 11, fontWeight: 700, align: 'center', color: '#111827' }),
    baseEl({ type: 'text', name: 'Admission Number', side: 'front', text: '{{admission_number}}', x: 4, y: 55, w: 46, h: 5, fontSize: 8, align: 'center', color: '#374151' }),
    baseEl({ type: 'text', name: 'Class and Section', side: 'front', text: 'Class {{class}}-{{section}}', x: 4, y: 61, w: 46, h: 5, fontSize: 8, align: 'center', color: '#374151' }),
    baseEl({ type: 'text', name: 'Academic Session', side: 'front', text: '{{academic_session}}', x: 4, y: 76, w: 46, h: 5, fontSize: 7, align: 'center', color: '#6b7280' })
  ];
  const back: CardElement[] = [
    baseEl({ type: 'shape', name: 'Back Header', side: 'back', shape: 'rect', fill: header, x: 0, y: 0, w: CR80.h, h: 10, strokeWidth: 0 }),
    baseEl({ type: 'text', name: 'Instructions', side: 'back', text: 'If found, please return to the school office.', x: 4, y: 12, w: 46, h: 10, fontSize: 8, color: '#111827' }),
    baseEl({ type: 'text', name: 'Parent Name', side: 'back', text: 'Parent: {{parent_name}}', x: 4, y: 24, w: 46, h: 6, fontSize: 8 }),
    baseEl({ type: 'text', name: 'Emergency Contact', side: 'back', text: '{{parent_contact}}', x: 4, y: 31, w: 46, h: 6, fontSize: 8 }),
    baseEl({ type: 'text', name: 'Blood Group', side: 'back', text: 'Blood Group: {{blood_group}}', x: 4, y: 38, w: 46, h: 6, fontSize: 8 }),
    baseEl({ type: 'text', name: 'Date of Birth', side: 'back', text: 'DOB: {{date_of_birth}}', x: 4, y: 45, w: 46, h: 6, fontSize: 8 }),
    baseEl({ type: 'qr', name: 'QR Code', side: 'back', x: 16, y: 54, w: 22, h: 22 }),
    baseEl({ type: 'text', name: 'School Address', side: 'back', text: '{{school_address}}', x: 4, y: 78, w: 46, h: 6, fontSize: 7, align: 'center', color: '#6b7280' })
  ];
  return {
    id: uid('dsn'),
    name,
    category,
    orientation: 'Portrait',
    widthMm: CR80.h,
    heightMm: CR80.w,
    unit: 'mm',
    isDefault: name.includes('Standard'),
    version: 1,
    createdAt: nowIso(),
    modifiedAt: nowIso(),
    background: { front: defaultBg(), back: defaultBg() },
    elements: [...front, ...back]
  };
}

function staffTemplate(name: string, category: CardDesign['category']): CardDesign {
  const d = studentTemplate(name, category, false);
  d.orientation = 'Landscape';
  d.widthMm = CR80.w;
  d.heightMm = CR80.h;
  d.elements = d.elements.map((el) => {
    if (el.name === 'Student Photograph') return { ...el, name: 'Employee Photograph' };
    if (el.text === '{{student_name}}') return { ...el, name: 'Employee Name', text: '{{employee_name}}' };
    if (el.text === '{{admission_number}}') return { ...el, name: 'Employee ID', text: '{{employee_id}}' };
    if ((el.text || '').includes('Class')) return { ...el, name: 'Designation', text: '{{designation}} · {{department}}' };
    return el;
  });
  return d;
}

const SEED: CardDesign[] = [
  studentTemplate('Standard Student ID', 'Student', false),
  studentTemplate('Colorful Student ID', 'Student', true),
  staffTemplate('Professional Staff ID', 'Staff'),
  staffTemplate('Teacher ID', 'Teacher')
];

function loadDesigns(): CardDesign[] {
  try {
    const raw = localStorage.getItem(STORE);
    if (!raw) return clone(SEED);
    const parsed = JSON.parse(raw) as CardDesign[];
    return parsed.length ? parsed : clone(SEED);
  } catch {
    return clone(SEED);
  }
}

function bgCss(bg: CardBg) {
  const op = Math.round(bg.opacity * 100) / 100;
  if (bg.kind === 'gradient') return { background: `linear-gradient(180deg, ${bg.color}, ${bg.color2 || '#93c5fd'})`, opacity: op };
  if (bg.kind === 'image' && bg.image) return { backgroundImage: `url(${bg.image})`, backgroundSize: 'cover', opacity: op };
  return { background: bg.color, opacity: op };
}

export function IdCardTemplate() {
  const [designs, setDesigns] = useState<CardDesign[]>(loadDesigns);
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createNote, setCreateNote] = useState('');
  const design = designs.find((d) => d.id === openId) || null;

  useEffect(() => {
    localStorage.setItem(STORE, JSON.stringify(designs));
  }, [designs]);

  const visible = designs.filter((d) => {
    if (filter !== 'All' && d.category !== filter) return false;
    if (query && !d.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const createBlank = (category: CardDesign['category'] = 'Custom') => {
    const d: CardDesign = {
      id: uid('dsn'),
      name: 'Untitled ID Card',
      category,
      orientation: 'Portrait',
      widthMm: CR80.h,
      heightMm: CR80.w,
      unit: 'mm',
      isDefault: false,
      version: 1,
      createdAt: nowIso(),
      modifiedAt: nowIso(),
      background: { front: defaultBg(), back: defaultBg() },
      elements: []
    };
    setDesigns((prev) => [d, ...prev]);
    setOpenId(d.id);
    setCreateOpen(false);
  };

  const createFromTemplate = (tpl: CardDesign) => {
    const d = clone(tpl);
    d.id = uid('dsn');
    d.name = `${tpl.name}`;
    d.isDefault = false;
    d.createdAt = nowIso();
    d.modifiedAt = nowIso();
    d.elements = d.elements.map((e) => ({ ...e, id: uid(e.type) }));
    setDesigns((prev) => [d, ...prev]);
    setOpenId(d.id);
    setCreateOpen(false);
  };

  const duplicateDesign = (src: CardDesign) => {
    const copy = clone(src);
    copy.id = uid('dsn');
    copy.name = `${src.name} Copy`;
    copy.isDefault = false;
    copy.createdAt = nowIso();
    copy.modifiedAt = nowIso();
    setDesigns((prev) => [copy, ...prev]);
    setOpenId(copy.id);
    setCreateOpen(false);
  };

  const importJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as CardDesign;
        if (!parsed || !parsed.name || !Array.isArray(parsed.elements)) {
          setCreateNote('That file is not a saved ID card design.');
          return;
        }
        parsed.id = uid('dsn');
        parsed.createdAt = nowIso();
        parsed.modifiedAt = nowIso();
        parsed.isDefault = false;
        setDesigns((prev) => [parsed, ...prev]);
        setOpenId(parsed.id);
        setCreateOpen(false);
        setCreateNote('');
      } catch {
        setCreateNote('Could not read the uploaded JSON design.');
      }
    };
    reader.readAsText(file);
  };

  const patchDesign = (id: string, updater: (d: CardDesign) => CardDesign) => {
    setDesigns((prev) => prev.map((d) => d.id === id ? updater({ ...d, modifiedAt: nowIso() }) : d));
  };

  if (design) {
    return (
      <Designer
        design={design}
        onChange={(next) => patchDesign(design.id, () => next)}
        onBack={() => setOpenId(null)}
        onSaveAs={() => {
          const copy = clone(design);
          copy.id = uid('dsn');
          copy.name = `${design.name} Copy`;
          copy.isDefault = false;
          copy.createdAt = nowIso();
          copy.modifiedAt = nowIso();
          setDesigns((prev) => [copy, ...prev]);
          setOpenId(copy.id);
        }}
        onDelete={() => {
          setDesigns((prev) => prev.filter((d) => d.id !== design.id));
          setOpenId(null);
        }} />
    );
  }

  return (
    <div className="flex h-full flex-col bg-gray-50">
      <div className="flex items-center justify-between border-b bg-white px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ID Card Templates</h1>
          <p className="text-sm text-gray-500">Create and manage Canva-style student, staff and teacher ID designs</p>
        </div>
        <Button onClick={() => { setCreateNote(''); setCreateOpen(true); }}><Plus className="w-4 h-4 mr-1" />New Design</Button>
      </div>
      {createOpen &&
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Create ID card design</h2>
                <p className="text-sm text-gray-500">Blank canvas, start from a template, upload a saved design, or duplicate an existing one</p>
              </div>
              <button type="button" className="text-sm text-gray-500" onClick={() => setCreateOpen(false)}>Close</button>
            </div>
            {createNote && <p className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">{createNote}</p>}
            <div className="grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => createBlank('Custom')} className="rounded-lg border border-gray-200 p-4 text-left hover:border-blue-400 hover:bg-blue-50">
                <p className="font-semibold text-gray-900">Blank canvas</p>
                <p className="mt-1 text-xs text-gray-500">CR80 portrait, empty front and back</p>
              </button>
              <label className="cursor-pointer rounded-lg border border-dashed border-gray-300 p-4 hover:border-blue-400 hover:bg-blue-50">
                <p className="font-semibold text-gray-900">Upload design</p>
                <p className="mt-1 text-xs text-gray-500">JSON exported from this studio</p>
                <input type="file" accept="application/json,.json" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) importJson(f); }} />
              </label>
            </div>
            <p className="mt-5 mb-2 text-xs font-semibold uppercase text-gray-500">Start from a template</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {SEED.map((tpl) => (
                <button key={tpl.name} type="button" onClick={() => createFromTemplate(tpl)} className="flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm hover:bg-gray-50">
                  <span>{tpl.name}</span>
                  <Badge variant="secondary">{tpl.category}</Badge>
                </button>
              ))}
            </div>
            <p className="mt-5 mb-2 text-xs font-semibold uppercase text-gray-500">Duplicate existing</p>
            {designs.length === 0 && <p className="text-sm text-gray-500">No designs yet.</p>}
            <div className="max-h-48 space-y-1 overflow-y-auto">
              {designs.map((d) => (
                <button key={d.id} type="button" onClick={() => duplicateDesign(d)} className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-gray-50">
                  <span className="truncate">{d.name}</span>
                  <span className="text-xs text-gray-400">{d.category}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      }
      <div className="flex flex-wrap items-center gap-3 px-6 py-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search designs" className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm" />
        </div>
        {['All', 'Student', 'Staff', 'Teacher', 'Administrator', 'Custom'].map((c) => (
          <button key={c} type="button" onClick={() => setFilter(c)} className={`rounded-full border px-3 py-1.5 text-sm ${filter === c ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white text-gray-700'}`}>{c}</button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((d) => (
            <div key={d.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-3">
                <div>
                  <p className="font-semibold text-gray-900 truncate max-w-[180px]">{d.name}</p>
                  <p className="text-xs text-gray-500">{d.category} · {d.orientation} · {d.widthMm.toFixed(1)}×{d.heightMm.toFixed(1)} mm</p>
                </div>
                {d.isDefault && <Badge variant="success">Default</Badge>}
              </div>
              <button type="button" onClick={() => setOpenId(d.id)} className="flex h-44 w-full items-center justify-center bg-gray-100">
                <MiniCard design={d} />
              </button>
              <div className="flex gap-2 p-3">
                <Button variant="ghost" size="sm" className="flex-1" onClick={() => setOpenId(d.id)}>Edit</Button>
                <Button variant="ghost" size="sm" onClick={() => duplicateDesign(d)}><Copy className="w-3.5 h-3.5" /></Button>
                <Button variant="ghost" size="sm" onClick={() => patchDesign(d.id, (x) => ({ ...x, isDefault: true }))} title="Set default"><Check className="w-3.5 h-3.5" /></Button>
                <Button variant="ghost" size="sm" onClick={() => setDesigns((prev) => prev.filter((x) => x.id !== d.id))}><Trash2 className="w-3.5 h-3.5 text-red-500" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniCard({ design }: { design: CardDesign }) {
  const scale = 1.1;
  return (
    <div className="relative overflow-hidden rounded border bg-white shadow-sm" style={{ width: design.widthMm * scale, height: design.heightMm * scale, ...bgCss(design.background.front) }}>
      {design.elements.filter((e) => e.side === 'front' && !e.hidden).slice(0, 8).map((el) => (
        <div key={el.id} className="absolute overflow-hidden" style={{ left: el.x * scale, top: el.y * scale, width: el.w * scale, height: el.h * scale, background: el.type === 'text' ? 'transparent' : el.fill || '#e5e7eb', borderRadius: el.shape === 'circle' ? 999 : el.radius || 0 }} />
      ))}
    </div>
  );
}

function Designer({
  design,
  onChange,
  onBack,
  onSaveAs,
  onDelete
}: {
  design: CardDesign;
  onChange: (d: CardDesign) => void;
  onBack: () => void;
  onSaveAs: () => void;
  onDelete: () => void;
}) {
  const [side, setSide] = useState<CardSide>('front');
  const [tool, setTool] = useState<ToolTab>('templates');
  const [selected, setSelected] = useState<string[]>([]);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [preview, setPreview] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [savedAt, setSavedAt] = useState(design.modifiedAt);
  const [leftOpen, setLeftOpen] = useState(true);
  const history = useRef<CardDesign[]>([clone(design)]);
  const histIndex = useRef(0);
  const clipboard = useRef<CardElement[]>([]);
  const drag = useRef<{ mode: 'move' | 'resize'; ids: string[]; sx: number; sy: number; orig: Record<string, CardElement>; handle?: string } | null>(null);
  const skipHist = useRef(false);

  const pushHist = (next: CardDesign) => {
    if (skipHist.current) return;
    const stack = history.current.slice(0, histIndex.current + 1);
    stack.push(clone(next));
    history.current = stack.slice(-40);
    histIndex.current = history.current.length - 1;
  };

  const commit = (next: CardDesign) => {
    pushHist(next);
    setDirty(true);
    onChange(next);
  };

  const update = (mutator: (d: CardDesign) => CardDesign) => commit(mutator(clone(design)));

  const undo = () => {
    if (histIndex.current <= 0) return;
    histIndex.current -= 1;
    skipHist.current = true;
    onChange(clone(history.current[histIndex.current]));
    skipHist.current = false;
  };
  const redo = () => {
    if (histIndex.current >= history.current.length - 1) return;
    histIndex.current += 1;
    skipHist.current = true;
    onChange(clone(history.current[histIndex.current]));
    skipHist.current = false;
  };

  const els = design.elements.filter((e) => e.side === side);
  const selectedEls = design.elements.filter((e) => selected.includes(e.id));
  const active = selectedEls.length === 1 ? selectedEls[0] : null;
  const scale = MM * zoom;

  const addEl = (el: CardElement) => {
    el.side = side;
    update((d) => ({ ...d, elements: [...d.elements, el] }));
    setSelected([el.id]);
  };

  const patchEl = (id: string, patch: Partial<CardElement>) => {
    update((d) => ({ ...d, elements: d.elements.map((e) => e.id === id ? { ...e, ...patch } : e) }));
  };

  const applyTemplate = (tpl: CardDesign) => {
    update((d) => ({
      ...d,
      orientation: tpl.orientation,
      widthMm: tpl.widthMm,
      heightMm: tpl.heightMm,
      background: clone(tpl.background),
      elements: clone(tpl.elements).map((e) => ({ ...e, id: uid(e.type) }))
    }));
    setSelected([]);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') { e.preventDefault(); redo(); }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        const copies = selectedEls.filter((x) => !x.locked).map((x) => ({ ...clone(x), id: uid(x.type), x: x.x + 3, y: x.y + 3 }));
        if (copies.length) update((d) => ({ ...d, elements: [...d.elements, ...copies] }));
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') clipboard.current = clone(selectedEls);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
        const copies = clipboard.current.map((x) => ({ ...clone(x), id: uid(x.type), side, x: x.x + 3, y: x.y + 3 }));
        if (copies.length) {
          update((d) => ({ ...d, elements: [...d.elements, ...copies] }));
          setSelected(copies.map((c) => c.id));
        }
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        update((d) => ({ ...d, elements: d.elements.filter((el) => !selected.includes(el.id) || el.locked) }));
        setSelected([]);
      }
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const dx = e.key === 'ArrowLeft' ? -0.5 : e.key === 'ArrowRight' ? 0.5 : 0;
        const dy = e.key === 'ArrowUp' ? -0.5 : e.key === 'ArrowDown' ? 0.5 : 0;
        update((d) => ({
          ...d,
          elements: d.elements.map((el) => selected.includes(el.id) && !el.locked ? { ...el, x: el.x + dx, y: el.y + dy } : el)
        }));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      const st = drag.current;
      if (!st) return;
      const dx = (e.clientX - st.sx) / scale;
      const dy = (e.clientY - st.sy) / scale;
      skipHist.current = true;
      onChange({
        ...design,
        elements: design.elements.map((el) => {
          const o = st.orig[el.id];
          if (!o || el.locked) return el;
          if (st.mode === 'move') return { ...el, x: o.x + dx, y: o.y + dy };
          const n = { ...el };
          if (st.handle?.includes('e')) n.w = Math.max(4, o.w + dx);
          if (st.handle?.includes('s')) n.h = Math.max(4, o.h + dy);
          if (st.handle?.includes('w')) { n.w = Math.max(4, o.w - dx); n.x = o.x + dx; }
          if (st.handle?.includes('n')) { n.h = Math.max(4, o.h - dy); n.y = o.y + dy; }
          return n;
        })
      });
    };
    const up = () => {
      if (drag.current) {
        skipHist.current = false;
        pushHist(design);
        setDirty(true);
      }
      drag.current = null;
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
  });

  const startDrag = (e: React.MouseEvent, id: string, mode: 'move' | 'resize', handle?: string) => {
    e.stopPropagation();
    const ids = selected.includes(id) ? selected : [id];
    setSelected(ids);
    const orig: Record<string, CardElement> = {};
    design.elements.forEach((el) => { if (ids.includes(el.id)) orig[el.id] = clone(el); });
    drag.current = { mode, ids, sx: e.clientX, sy: e.clientY, orig, handle };
  };

  const saveNow = () => {
    onChange({ ...design, modifiedAt: nowIso(), version: design.version + 1 });
    setSavedAt(new Date().toISOString());
    setDirty(false);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(design, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${design.name.replace(/\s+/g, '-')}.json`;
    a.click();
  };

  const exportPng = () => {
    const canvas = document.createElement('canvas');
    const px = 8;
    canvas.width = Math.round(design.widthMm * px);
    canvas.height = Math.round(design.heightMm * px);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = design.background[side].color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    els.filter((e) => !e.hidden).forEach((el) => {
      ctx.save();
      ctx.globalAlpha = el.opacity;
      ctx.fillStyle = el.type === 'text' ? el.color || '#111827' : el.fill || '#e5e7eb';
      if (el.type === 'text') {
        ctx.font = `${el.fontWeight || 400} ${el.fontSize || 10}px ${el.fontFamily || 'Arial'}`;
        ctx.fillText(resolveText(el.text, true), el.x * px, (el.y + (el.fontSize || 10)) * px, el.w * px);
      } else {
        ctx.fillRect(el.x * px, el.y * px, el.w * px, el.h * px);
      }
      ctx.restore();
    });
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `${design.name}-${side}.png`;
    a.click();
  };

  const printCard = () => {
    const html = `<html><body style="margin:0;display:flex;justify-content:center;align-items:center;height:100vh">${document.getElementById('id-card-canvas')?.outerHTML || ''}</body></html>`;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
  };

  const zOrder = (dir: 'up' | 'down' | 'top' | 'bottom') => {
    if (!active) return;
    update((d) => {
      const list = [...d.elements];
      const i = list.findIndex((e) => e.id === active.id);
      if (i < 0) return d;
      const [item] = list.splice(i, 1);
      if (dir === 'top') list.push(item);
      else if (dir === 'bottom') list.unshift(item);
      else if (dir === 'up') list.splice(Math.min(i + 1, list.length), 0, item);
      else list.splice(Math.max(i - 1, 0), 0, item);
      return { ...d, elements: list };
    });
  };

  const cardW = design.widthMm * scale;
  const cardH = design.heightMm * scale;

  return (
    <div className="flex h-full flex-col bg-[#eef2f6] text-gray-800">
      <div className="flex items-center gap-2 border-b bg-white px-3 py-2">
        <Button variant="ghost" size="sm" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-1" />Back to ID Card Management</Button>
        <input
          value={design.name}
          onChange={(e) => onChange({ ...design, name: e.target.value, modifiedAt: nowIso() })}
          className="min-w-[180px] rounded-md border border-gray-200 px-2 py-1 text-sm font-semibold" />
        <span className="text-xs text-gray-500">{dirty ? 'Unsaved changes' : `Saved ${new Date(savedAt).toLocaleTimeString()}`}</span>
        <div className="ml-auto flex flex-wrap items-center gap-1">
          <Button variant="outline" size="sm" onClick={undo}><Undo2 className="w-4 h-4" /></Button>
          <Button variant="outline" size="sm" onClick={redo}><Redo2 className="w-4 h-4" /></Button>
          <Button variant="outline" size="sm" onClick={() => setPreview((v) => !v)}><Eye className="w-4 h-4 mr-1" />{preview ? 'Edit' : 'Preview'}</Button>
          <Button variant="outline" size="sm" onClick={exportPng}><Download className="w-4 h-4 mr-1" />Download</Button>
          <Button variant="outline" size="sm" onClick={printCard}><Printer className="w-4 h-4 mr-1" />Print</Button>
          <Button size="sm" onClick={saveNow}><Save className="w-4 h-4 mr-1" />Save</Button>
          <Button variant="outline" size="sm" onClick={onSaveAs}>Save as New</Button>
          <div className="relative">
            <Button variant="outline" size="sm" onClick={() => setMoreOpen((v) => !v)}><MoreVertical className="w-4 h-4" /></Button>
            {moreOpen &&
            <div className="absolute right-0 z-30 mt-1 w-48 rounded-lg border bg-white py-1 shadow-lg">
                {[['Duplicate Design', onSaveAs], ['Reset Design', () => applyTemplate(studentTemplate('Reset', design.category, false))], ['Export Design', exportJson], ['Delete Design', onDelete]].map(([label, fn]) =>
                <button key={String(label)} type="button" className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50" onClick={() => { (fn as () => void)(); setMoreOpen(false); }}>{label as string}</button>
                )}
              </div>
            }
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {!preview && leftOpen &&
        <aside className="flex w-64 shrink-0 flex-col border-r bg-white">
            <div className="flex flex-wrap gap-1 border-b p-2">
              {([['templates', 'Templates'], ['elements', 'Elements'], ['text', 'Text'], ['images', 'Images'], ['uploads', 'Uploads'], ['background', 'Background'], ['layers', 'Layers']] as const).map(([id, label]) => (
                <button key={id} type="button" onClick={() => setTool(id)} className={`rounded-md px-2 py-1 text-xs ${tool === id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{label}</button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-3 text-sm">
              {tool === 'templates' &&
              <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase text-gray-500">Start from a template</p>
                  {SEED.map((tpl) => (
                    <button key={tpl.name} type="button" onClick={() => applyTemplate(tpl)} className="flex w-full items-center justify-between rounded-lg border px-3 py-2 hover:bg-gray-50">
                      <span>{tpl.name}</span>
                      <Badge variant="secondary">{tpl.category}</Badge>
                    </button>
                  ))}
                </div>
              }
              {tool === 'elements' &&
              <div className="grid grid-cols-2 gap-2">
                  {([
                    ['Rectangle', () => addEl(baseEl({ type: 'shape', name: 'Rectangle', side, shape: 'rect', fill: '#dbeafe', w: 24, h: 14 }))],
                    ['Circle', () => addEl(baseEl({ type: 'shape', name: 'Circle', side, shape: 'circle', fill: '#bfdbfe', w: 16, h: 16 }))],
                    ['Line', () => addEl(baseEl({ type: 'shape', name: 'Line', side, shape: 'line', fill: '#111827', w: 30, h: 1 }))],
                    ['Rounded', () => addEl(baseEl({ type: 'shape', name: 'Rounded rectangle', side, shape: 'roundRect', fill: '#e0f2fe', radius: 4, w: 24, h: 12 }))],
                    ['QR Code', () => addEl(baseEl({ type: 'qr', name: 'QR Code', side, w: 18, h: 18 }))],
                    ['Barcode', () => addEl(baseEl({ type: 'barcode', name: 'Barcode', side, w: 32, h: 10 }))]
                  ] as const).map(([label, fn]) => (
                    <button key={label} type="button" onClick={fn} className="rounded-lg border px-2 py-3 text-xs hover:bg-blue-50">{label}</button>
                  ))}
                </div>
              }
              {tool === 'text' &&
              <div className="space-y-1">
                  {TEXT_FIELDS.map((f) => (
                    <button key={f.name} type="button" onClick={() => addEl(baseEl({ type: 'text', name: f.name, side, text: f.text, fontSize: 10, color: '#111827', w: 36, h: 6 }))} className="block w-full rounded-md px-2 py-1.5 text-left hover:bg-gray-50">{f.name}</button>
                  ))}
                </div>
              }
              {tool === 'images' &&
              <div className="space-y-2">
                  <Button variant="outline" className="w-full" onClick={() => addEl(baseEl({ type: 'image', name: 'Student Photograph', side, w: 22, h: 26, fill: '#e5e7eb' }))}>Photo placeholder</Button>
                  <Button variant="outline" className="w-full" onClick={() => addEl(baseEl({ type: 'image', name: 'School Logo', side, w: 16, h: 16, fill: '#dbeafe' }))}>Logo placeholder</Button>
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed px-3 py-6 text-xs text-gray-500">
                    <Upload className="w-4 h-4" /> Upload image
                    <input type="file" accept="image/png,image/jpeg,image/svg+xml" className="hidden" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => addEl(baseEl({ type: 'image', name: file.name, side, src: String(reader.result), w: 24, h: 24 }));
                      reader.readAsDataURL(file);
                    }} />
                  </label>
                </div>
              }
              {tool === 'uploads' &&
              <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed px-3 py-10 text-xs text-gray-500">
                  <Upload className="w-6 h-6" />
                  PNG, JPG, SVG
                  <input type="file" accept="image/png,image/jpeg,image/svg+xml" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => addEl(baseEl({ type: 'image', name: file.name, side, src: String(reader.result), w: 28, h: 20 }));
                    reader.readAsDataURL(file);
                  }} />
                </label>
              }
              {tool === 'background' &&
              <div className="space-y-3">
                  <label className="block text-xs font-medium">Fill type</label>
                  <select value={design.background[side].kind} onChange={(e) => update((d) => ({ ...d, background: { ...d.background, [side]: { ...d.background[side], kind: e.target.value as CardBg['kind'] } } }))} className="w-full rounded border px-2 py-1.5 text-sm">
                    <option value="solid">Solid</option>
                    <option value="gradient">Gradient</option>
                    <option value="image">Image</option>
                  </select>
                  <label className="block text-xs">Color</label>
                  <input type="color" value={design.background[side].color} onChange={(e) => update((d) => ({ ...d, background: { ...d.background, [side]: { ...d.background[side], color: e.target.value } } }))} />
                  {design.background[side].kind === 'gradient' &&
                  <input type="color" value={design.background[side].color2 || '#93c5fd'} onChange={(e) => update((d) => ({ ...d, background: { ...d.background, [side]: { ...d.background[side], color2: e.target.value } } }))} />
                  }
                  {design.background[side].kind === 'image' &&
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed px-3 py-6 text-xs text-gray-500">
                      <Upload className="w-4 h-4" /> Background image
                      <input type="file" accept="image/png,image/jpeg,image/svg+xml" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => update((d) => ({ ...d, background: { ...d.background, [side]: { ...d.background[side], kind: 'image', image: String(reader.result) } } }));
                    reader.readAsDataURL(file);
                  }} />
                    </label>
                  }
                  <label className="block text-xs">Opacity {Math.round(design.background[side].opacity * 100)}%</label>
                  <input type="range" min={0.2} max={1} step={0.05} value={design.background[side].opacity} onChange={(e) => update((d) => ({ ...d, background: { ...d.background, [side]: { ...d.background[side], opacity: Number(e.target.value) } } }))} className="w-full" />
                </div>
              }
              {tool === 'layers' &&
              <div className="space-y-1">
                  {[...els].reverse().map((el) => (
                    <div key={el.id} className={`flex items-center gap-1 rounded-md px-2 py-1 ${selected.includes(el.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                      <button type="button" className="flex-1 truncate text-left" onClick={() => setSelected([el.id])}>{el.name}</button>
                      <button type="button" onClick={() => patchEl(el.id, { hidden: !el.hidden })} title="Hide">{el.hidden ? '○' : '●'}</button>
                      <button type="button" onClick={() => patchEl(el.id, { locked: !el.locked })}>{el.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}</button>
                    </div>
                  ))}
                </div>
              }
            </div>
          </aside>
        }

        <div className="relative flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2 border-b bg-white px-3 py-1.5 text-xs">
            <div className="flex rounded-full border p-0.5">
              {(['front', 'back'] as const).map((s) => (
                <button key={s} type="button" onClick={() => { setSide(s); setSelected([]); }} className={`rounded-full px-3 py-1 capitalize ${side === s ? 'bg-blue-600 text-white' : 'text-gray-600'}`}>{s} side</button>
              ))}
            </div>
            <button type="button" onClick={() => setZoom((z) => Math.max(0.4, z - 0.1))}><ZoomOut className="w-4 h-4" /></button>
            <span>{Math.round(zoom * 100)}%</span>
            <button type="button" onClick={() => setZoom((z) => Math.min(2.2, z + 0.1))}><ZoomIn className="w-4 h-4" /></button>
            <button type="button" onClick={() => setZoom(1)}>Fit</button>
            <button type="button" onClick={() => setShowGrid((v) => !v)} className={showGrid ? 'text-blue-600' : 'text-gray-400'}><Grid3X3 className="w-4 h-4" /></button>
            <select
              value={design.orientation}
              onChange={(e) => {
                const portrait = e.target.value === 'Portrait';
                update((d) => ({ ...d, orientation: e.target.value as CardDesign['orientation'], widthMm: portrait ? CR80.h : CR80.w, heightMm: portrait ? CR80.w : CR80.h }));
              }}
              className="rounded border px-2 py-1">
              <option>Portrait</option>
              <option>Landscape</option>
            </select>
            <span className="text-gray-500">CR80 {design.widthMm.toFixed(1)} × {design.heightMm.toFixed(1)} mm</span>
            <button type="button" className="ml-auto text-gray-500" onClick={() => setLeftOpen((v) => !v)}>{leftOpen ? 'Hide tools' : 'Show tools'}</button>
          </div>

          <div className="flex flex-1 items-center justify-center overflow-auto p-8" onMouseDown={() => { if (!preview) setSelected([]); }}>
            <div
              id="id-card-canvas"
              className="relative shadow-xl"
              style={{
                width: cardW,
                height: cardH,
                ...bgCss(design.background[side]),
                backgroundImage: showGrid && !preview ? `linear-gradient(to right, rgba(15,23,42,.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,.08) 1px, transparent 1px), ${design.background[side].kind === 'image' && design.background[side].image ? `url(${design.background[side].image})` : 'none'}` : undefined,
                backgroundSize: showGrid && !preview ? `${5 * scale}px ${5 * scale}px, ${5 * scale}px ${5 * scale}px, cover` : undefined,
                outline: preview ? 'none' : '1px dashed #94a3b8',
                boxShadow: '0 0 0 2mm rgba(14,165,233,.15), 0 10px 30px rgba(15,23,42,.15)'
              }}>
              <div className="pointer-events-none absolute inset-[2mm] border border-dashed border-cyan-400/70" />
              {els.map((el) => {
                if (el.hidden && preview) return null;
                const isSel = selected.includes(el.id) && !preview;
                return (
                  <div
                    key={el.id}
                    onMouseDown={(e) => { if (!preview && !el.locked) startDrag(e, el.id, 'move'); else if (!preview) { e.stopPropagation(); setSelected([el.id]); } }}
                    style={{
                      position: 'absolute',
                      left: el.x * scale,
                      top: el.y * scale,
                      width: el.w * scale,
                      height: el.h * scale,
                      transform: `rotate(${el.rotation}deg)`,
                      opacity: el.hidden ? 0.35 : el.opacity,
                      outline: isSel ? '1px solid #2563eb' : 'none',
                      cursor: el.locked ? 'not-allowed' : 'move',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: el.align === 'center' ? 'center' : el.align === 'right' ? 'flex-end' : 'flex-start',
                      background: el.type === 'text' ? 'transparent' : el.src ? undefined : el.fill || '#e5e7eb',
                      color: el.color || '#111827',
                      fontFamily: el.fontFamily || 'Arial',
                      fontSize: (el.fontSize || 10) * zoom,
                      fontWeight: el.fontWeight || 400,
                      fontStyle: el.italic ? 'italic' : 'normal',
                      textDecoration: el.underline ? 'underline' : 'none',
                      letterSpacing: el.letterSpacing,
                      borderRadius: el.shape === 'circle' ? 9999 : (el.radius || 0) * scale,
                      border: el.strokeWidth ? `${el.strokeWidth}px solid ${el.stroke || '#111827'}` : undefined,
                      backgroundImage: el.src ? `url(${el.src})` : undefined,
                      backgroundSize: el.fit || 'cover',
                      backgroundPosition: 'center'
                    }}>
                    {el.type === 'text' && <span className="w-full px-0.5 truncate">{resolveText(el.text, preview)}</span>}
                    {el.type === 'qr' && <div className="grid h-full w-full grid-cols-5 gap-px bg-white p-0.5">{Array.from({ length: 25 }).map((_, i) => <div key={i} className={i % 3 ? 'bg-gray-900' : 'bg-white'} />)}</div>}
                    {el.type === 'barcode' && <div className="flex h-full w-full items-stretch gap-px bg-white p-0.5">{Array.from({ length: 24 }).map((_, i) => <div key={i} className="flex-1 bg-gray-900" style={{ opacity: i % 2 ? 1 : 0.3 }} />)}</div>}
                    {isSel && ['nw', 'ne', 'sw', 'se'].map((h) => (
                      <span
                        key={h}
                        onMouseDown={(e) => startDrag(e, el.id, 'resize', h)}
                        className="absolute h-2 w-2 bg-white border border-blue-600"
                        style={{
                          left: h.includes('w') ? -4 : undefined,
                          right: h.includes('e') ? -4 : undefined,
                          top: h.includes('n') ? -4 : undefined,
                          bottom: h.includes('s') ? -4 : undefined,
                          cursor: `${h}-resize`
                        }} />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {!preview &&
        <aside className="w-72 shrink-0 overflow-y-auto border-l bg-white p-4 text-sm">
            <h3 className="mb-3 font-semibold text-gray-900">{active ? active.name : selected.length > 1 ? `${selected.length} selected` : 'Card properties'}</h3>
            {!active && selected.length === 0 &&
            <div className="space-y-3">
                <label className="block text-xs">Category</label>
                <select value={design.category} onChange={(e) => update((d) => ({ ...d, category: e.target.value as CardDesign['category'] }))} className="w-full rounded border px-2 py-1.5">
                  {['Student', 'Staff', 'Teacher', 'Administrator', 'Custom'].map((c) => <option key={c}>{c}</option>)}
                </select>
                <p className="text-xs text-gray-500">Select an element to edit typography, size, color, lock and stacking.</p>
              </div>
            }
            {active &&
            <div className="space-y-3">
                <label className="block text-xs">Layer name</label>
                <input className="w-full rounded border px-2 py-1.5" value={active.name} onChange={(e) => patchEl(active.id, { name: e.target.value })} />
                {active.type === 'text' &&
                <>
                    <label className="block text-xs">Content (placeholders allowed)</label>
                    <textarea className="w-full rounded border px-2 py-1.5" rows={3} value={active.text || ''} onChange={(e) => patchEl(active.id, { text: e.target.value })} />
                    <select className="w-full rounded border px-2 py-1.5" value={active.fontFamily || 'Arial'} onChange={(e) => patchEl(active.id, { fontFamily: e.target.value })}>
                      {FONTS.map((f) => <option key={f}>{f}</option>)}
                    </select>
                    <div className="flex gap-2">
                      <input type="number" className="w-full rounded border px-2 py-1.5" value={active.fontSize || 10} onChange={(e) => patchEl(active.id, { fontSize: Number(e.target.value) })} />
                      <input type="color" value={active.color || '#111827'} onChange={(e) => patchEl(active.id, { color: e.target.value })} />
                    </div>
                    <div className="flex gap-1">
                      <button type="button" className="rounded border px-2 py-1" onClick={() => patchEl(active.id, { fontWeight: active.fontWeight === 700 ? 400 : 700 })}>B</button>
                      <button type="button" className="rounded border px-2 py-1 italic" onClick={() => patchEl(active.id, { italic: !active.italic })}>I</button>
                      <button type="button" className="rounded border px-2 py-1 underline" onClick={() => patchEl(active.id, { underline: !active.underline })}>U</button>
                      <button type="button" className="rounded border px-2 py-1" onClick={() => patchEl(active.id, { align: 'left' })}><AlignLeft className="w-3 h-3" /></button>
                      <button type="button" className="rounded border px-2 py-1" onClick={() => patchEl(active.id, { align: 'center' })}><AlignCenter className="w-3 h-3" /></button>
                      <button type="button" className="rounded border px-2 py-1" onClick={() => patchEl(active.id, { align: 'right' })}><AlignRight className="w-3 h-3" /></button>
                    </div>
                  </>
                }
                {(active.type === 'shape' || active.type === 'image') &&
                <>
                    <label className="block text-xs">Fill</label>
                    <input type="color" value={active.fill || '#dbeafe'} onChange={(e) => patchEl(active.id, { fill: e.target.value })} />
                    <label className="block text-xs">Corner radius</label>
                    <input type="number" className="w-full rounded border px-2 py-1.5" value={active.radius || 0} onChange={(e) => patchEl(active.id, { radius: Number(e.target.value) })} />
                  </>
                }
                <div className="grid grid-cols-2 gap-2">
                  <label className="text-xs">X<input type="number" className="w-full rounded border px-2 py-1.5" value={Number(active.x.toFixed(1))} onChange={(e) => patchEl(active.id, { x: Number(e.target.value) })} /></label>
                  <label className="text-xs">Y<input type="number" className="w-full rounded border px-2 py-1.5" value={Number(active.y.toFixed(1))} onChange={(e) => patchEl(active.id, { y: Number(e.target.value) })} /></label>
                  <label className="text-xs">W<input type="number" className="w-full rounded border px-2 py-1.5" value={Number(active.w.toFixed(1))} onChange={(e) => patchEl(active.id, { w: Number(e.target.value) })} /></label>
                  <label className="text-xs">H<input type="number" className="w-full rounded border px-2 py-1.5" value={Number(active.h.toFixed(1))} onChange={(e) => patchEl(active.id, { h: Number(e.target.value) })} /></label>
                </div>
                <label className="text-xs">Rotation
                  <input type="number" className="w-full rounded border px-2 py-1.5" value={active.rotation} onChange={(e) => patchEl(active.id, { rotation: Number(e.target.value) })} />
                </label>
                <label className="text-xs">Opacity {Math.round(active.opacity * 100)}%
                  <input type="range" min={0.1} max={1} step={0.05} value={active.opacity} onChange={(e) => patchEl(active.id, { opacity: Number(e.target.value) })} className="w-full" />
                </label>
                <div className="flex flex-wrap gap-1">
                  <Button variant="outline" size="sm" onClick={() => patchEl(active.id, { locked: !active.locked })}>{active.locked ? 'Unlock' : 'Lock'}</Button>
                  <Button variant="outline" size="sm" onClick={() => patchEl(active.id, { hidden: !active.hidden })}>{active.hidden ? 'Show' : 'Hide'}</Button>
                  <Button variant="outline" size="sm" onClick={() => {
                    const copy = { ...clone(active), id: uid(active.type), x: active.x + 3, y: active.y + 3 };
                    update((d) => ({ ...d, elements: [...d.elements, copy] }));
                    setSelected([copy.id]);
                  }}>Duplicate</Button>
                  <Button variant="outline" size="sm" onClick={() => { update((d) => ({ ...d, elements: d.elements.filter((e) => e.id !== active.id) })); setSelected([]); }}>Delete</Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  <Button variant="outline" size="sm" onClick={() => zOrder('up')}>Forward</Button>
                  <Button variant="outline" size="sm" onClick={() => zOrder('down')}>Backward</Button>
                  <Button variant="outline" size="sm" onClick={() => zOrder('top')}>Front</Button>
                  <Button variant="outline" size="sm" onClick={() => zOrder('bottom')}>Back</Button>
                </div>
              </div>
            }
          </aside>
        }
      </div>
    </div>
  );
}
