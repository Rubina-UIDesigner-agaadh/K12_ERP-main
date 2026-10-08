import React, { useMemo, useState } from 'react';
import { BarChart3, CheckCircle2, Download, Save, Star } from 'lucide-react';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Card } from '../../../../components/ui/Card';
import {
  DEFAULT_EVENT_REVIEWS,
  DEFAULT_SCHOOL_EVENTS,
  EVENT_REVIEWS_STORAGE_KEY,
  SCHOOL_EVENTS_STORAGE_KEY,
  EventBudgetItem,
  EventReviewRecord,
  SchoolEventRecord,
  createEmptyReview,
  downloadEventCsv,
  getActiveSchoolEvent,
  loadEventCollection,
  saveEventCollection,
  setActiveSchoolEvent
} from './eventData';

const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100';
const labelClass = 'mb-1 block text-xs font-semibold text-slate-600';
const money = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;
const varianceLabel = (variance: number) => variance < 0 ? `₹${Math.abs(variance).toLocaleString('en-IN')} Under budget` : variance > 0 ? `₹${variance.toLocaleString('en-IN')} Over budget` : '₹0 On budget';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className={labelClass}>{label}</span>{children}</label>;
}
function Panel({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return <section className="overflow-hidden rounded-xl border border-slate-200 bg-white"><div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3"><h2 className="text-sm font-bold text-slate-800">{title}</h2>{action}</div><div className="space-y-4 p-4">{children}</div></section>;
}

export function EventFeedbackReview() {
  const [events, setEvents] = useState<SchoolEventRecord[]>(() => loadEventCollection(SCHOOL_EVENTS_STORAGE_KEY, DEFAULT_SCHOOL_EVENTS));
  const [reviews, setReviews] = useState<EventReviewRecord[]>(() => loadEventCollection(EVENT_REVIEWS_STORAGE_KEY, DEFAULT_EVENT_REVIEWS));
  const [selectedEventId, setSelectedEventId] = useState(() => getActiveSchoolEvent() || 'evt-annual-2026');
  const [message, setMessage] = useState('');

  const event = events.find((item) => item.id === selectedEventId) || events[0];
  const savedReview = useMemo(() => reviews.find((item) => item.eventId === event?.id), [reviews, event?.id]);
  const review = savedReview || (event ? createEmptyReview(event.id) : null);

  const persistReview = (updated: EventReviewRecord) => {
    const next = reviews.some((item) => item.eventId === updated.eventId)
      ? reviews.map((item) => item.eventId === updated.eventId ? updated : item)
      : [...reviews, updated];
    setReviews(next);
    saveEventCollection(EVENT_REVIEWS_STORAGE_KEY, next);
  };
  const updateReview = (patch: Partial<EventReviewRecord>) => {
    if (review) persistReview({ ...review, ...patch });
  };
  const changeEvent = (id: string) => {
    setSelectedEventId(id);
    setActiveSchoolEvent(id);
  };
  const updateBudgetItem = (id: string, patch: Partial<EventBudgetItem>) => {
    if (!event) return;
    const nextEvents = events.map((item) => item.id === event.id ? { ...item, budgetItems: item.budgetItems.map((budget) => budget.id === id ? { ...budget, ...patch } : budget) } : item);
    setEvents(nextEvents);
    saveEventCollection(SCHOOL_EVENTS_STORAGE_KEY, nextEvents);
  };
  const uploadEvidence = (field: 'photos' | 'videos' | 'pressCoverage' | 'feedbackSummary', files: FileList | null) => {
    if (!review || !files?.length) return;
    const names = Array.from(files).map((file) => file.name).join(', ');
    const prior = review[field];
    updateReview({ [field]: [prior, names].filter(Boolean).join('; ') } as Partial<EventReviewRecord>);
  };
  const showMessage = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(''), 4000);
  };
  const saveReview = () => {
    if (!review) return;
    updateReview({ reviewStatus: 'Saved' });
    showMessage(`Event review for “${event.name}” saved.`);
  };
  const markDocumented = () => {
    if (!review) return;
    updateReview({ reviewStatus: 'Fully Documented' });
    showMessage(`“${event.name}” marked fully documented.`);
  };
  const generateReport = () => {
    if (!event || !review) return;
    const rows: Array<Record<string, string | number | boolean>> = [
      { Event: event.name, Type: event.typeName, Date: event.date, Status: event.status, ReviewStatus: review.reviewStatus, Rating: review.rating, EstimatedParents: review.estimatedParents, ActualStudents: review.actualStudents, ActualStaff: review.actualStaff, ActualStart: review.actualStartTime, ActualEnd: review.actualEndTime, GuestAttended: review.guestAttended, FeedbackResponses: review.feedbackResponses, Performers: review.performers, AwardRecipients: review.awardRecipients, WhatWentWell: review.whatWentWell, Improvements: review.improvements, Suggestions: review.suggestions },
      ...event.budgetItems.map((item) => ({ Event: event.name, BudgetItem: item.item, Estimated: item.estimatedCost, Actual: item.actualCost ?? '', Variance: item.actualCost === null ? '' : item.actualCost - item.estimatedCost, Vendor: item.vendor }))
    ];
    downloadEventCsv(`${event.code || 'event'}-review.csv`, rows);
    showMessage('Event review report exported as CSV.');
  };

  if (!event || !review) return <div className="p-6"><Card title="Event Feedback & Review"><p className="text-sm text-slate-500">Create an event in Event Planning &amp; Schedule before preparing its review.</p></Card></div>;

  const estimatedTotal = event.budgetItems.reduce((sum, item) => sum + Number(item.estimatedCost || 0), 0);
  const actualTotal = event.budgetItems.reduce((sum, item) => sum + Number(item.actualCost || 0), 0);
  const hasActuals = event.budgetItems.some((item) => item.actualCost !== null);
  const averageRating = Math.max(0, Math.min(5, review.rating));

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Event Section · Post-event Review</p><h1 className="mt-1 text-2xl font-bold text-slate-900">📋 Event Feedback &amp; Review</h1><p className="mt-1 text-sm text-slate-500">Capture outcomes, budget variance, media, feedback and lessons learned for future planning.</p></div><div className="flex flex-wrap items-center gap-2"><label className="text-xs font-semibold text-slate-500">Event</label><select className={`${inputClass} min-w-64`} value={event.id} onChange={(change) => changeEvent(change.target.value)}>{events.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div></div>
      {message && <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-800">{message}</div>}
      <Card className="border-indigo-200 bg-indigo-50/60"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-base font-bold text-indigo-950">Event Review — {event.name}</h2><p className="mt-1 text-xs text-indigo-800">Event date: {event.date ? new Date(`${event.date}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Not set'} · Event status: {event.status} · Review state: {review.reviewStatus}</p></div><Badge variant={review.reviewStatus === 'Fully Documented' ? 'success' : review.reviewStatus === 'Saved' ? 'info' : 'warning'}>{review.reviewStatus}</Badge></div></Card>

      <Panel title="Panel 1 · Event Summary">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"><Field label="Estimated Parents"><input type="number" min="0" className={inputClass} value={review.estimatedParents} onChange={(change) => updateReview({ estimatedParents: Number(change.target.value) })} /></Field><Field label="Actual Students"><input type="number" min="0" className={inputClass} value={review.actualStudents} onChange={(change) => updateReview({ actualStudents: Number(change.target.value) })} /></Field><Field label="Actual Staff"><input type="number" min="0" className={inputClass} value={review.actualStaff} onChange={(change) => updateReview({ actualStaff: Number(change.target.value) })} /></Field><Field label="Review By"><input type="date" className={inputClass} value={review.reviewBy} onChange={(change) => updateReview({ reviewBy: change.target.value })} /></Field><Field label="Actual Start Time"><input className={inputClass} value={review.actualStartTime} placeholder="05:05 PM" onChange={(change) => updateReview({ actualStartTime: change.target.value })} /></Field><Field label="Actual End Time"><input className={inputClass} value={review.actualEndTime} placeholder="09:15 PM" onChange={(change) => updateReview({ actualEndTime: change.target.value })} /></Field><Field label="Overall Rating"><select className={inputClass} value={review.rating} onChange={(change) => updateReview({ rating: Number(change.target.value) })}>{[0, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((rating) => <option key={rating} value={rating}>{rating ? `${rating} / 5` : 'Not rated'}</option>)}</select></Field><div className="flex items-end gap-2 pb-2 text-amber-500" aria-label={`${averageRating} out of 5 stars`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} className={`h-5 w-5 ${index < Math.round(averageRating) ? 'fill-current' : ''}`} />)}<span className="text-xs text-slate-500">Coordinator rating</span></div></div>
        <div className="grid gap-3 md:grid-cols-[220px_1fr]"><label className="flex items-center gap-2 rounded-lg border border-slate-100 p-3 text-xs font-semibold"><input type="checkbox" checked={review.guestAttended} onChange={(change) => updateReview({ guestAttended: change.target.checked })} />Chief Guest attended</label><Field label="Guest Notes"><input className={inputClass} value={review.guestNotes} onChange={(change) => updateReview({ guestNotes: change.target.value })} placeholder="Guest feedback or remarks" /></Field></div>
      </Panel>

      <Panel title="Panel 2 · Budget Actuals vs Estimated">
        <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500"><tr><th className="px-3 py-2">Item</th><th className="px-3 py-2">Estimated</th><th className="px-3 py-2">Actual</th><th className="px-3 py-2">Variance</th><th className="px-3 py-2">Vendor / Remarks</th></tr></thead><tbody className="divide-y divide-slate-100">{event.budgetItems.map((item) => { const variance = item.actualCost === null ? null : item.actualCost - item.estimatedCost; return <tr key={item.id}><td className="px-3 py-2 font-medium text-slate-800">{item.item}</td><td className="px-3 py-2">{money(item.estimatedCost)}</td><td className="px-3 py-2"><input type="number" min="0" className={`${inputClass} max-w-36`} value={item.actualCost ?? ''} placeholder="Enter actual" onChange={(change) => updateBudgetItem(item.id, { actualCost: change.target.value === '' ? null : Number(change.target.value) })} /></td><td className={`px-3 py-2 text-xs font-semibold ${variance === null ? 'text-slate-400' : variance > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>{variance === null ? 'Not entered' : varianceLabel(variance)}</td><td className="px-3 py-2"><input className={inputClass} value={item.vendor} onChange={(change) => updateBudgetItem(item.id, { vendor: change.target.value })} /></td></tr>; })}{event.budgetItems.length === 0 && <tr><td colSpan={5} className="px-3 py-8 text-center text-sm text-slate-400">No budget items yet. Add them in Event Planning &amp; Schedule.</td></tr>}</tbody><tfoot className="border-t-2 border-slate-200 bg-slate-50 font-bold"><tr><td className="px-3 py-3">TOTAL</td><td className="px-3 py-3">{money(estimatedTotal)}</td><td className="px-3 py-3">{hasActuals ? money(actualTotal) : '—'}</td><td className={`px-3 py-3 text-xs ${actualTotal > estimatedTotal ? 'text-rose-600' : 'text-emerald-700'}`}>{hasActuals ? varianceLabel(actualTotal - estimatedTotal) : 'Awaiting actuals'}</td><td /></tr></tfoot></table></div>
      </Panel>

      <Panel title="Panel 3 · Coordinator’s Notes">
        <div className="grid gap-4 md:grid-cols-3"><Field label="What went well"><textarea className={`${inputClass} min-h-24`} value={review.whatWentWell} onChange={(change) => updateReview({ whatWentWell: change.target.value })} placeholder="What worked well during the event?" /></Field><Field label="What to improve"><textarea className={`${inputClass} min-h-24`} value={review.improvements} onChange={(change) => updateReview({ improvements: change.target.value })} placeholder="Issues, delays or areas to improve" /></Field><Field label="Suggestions for next time"><textarea className={`${inputClass} min-h-24`} value={review.suggestions} onChange={(change) => updateReview({ suggestions: change.target.value })} placeholder="Recommendations for the next event" /></Field></div>
      </Panel>

      <Panel title="Panel 4 · Media & Documentation" action={<Button size="xs" variant="outline" onClick={() => showMessage(review.feedbackResponses ? `Feedback summary: ${review.feedbackSummary || `${review.feedbackResponses} responses recorded.`}` : 'No feedback responses have been recorded yet.')}><BarChart3 className="h-3.5 w-3.5" />View Feedback Analysis</Button>}>
        <div className="grid gap-4 md:grid-cols-2"><div><Field label="Photos"><input className={inputClass} value={review.photos} onChange={(change) => updateReview({ photos: change.target.value })} placeholder="Photo gallery notes or uploaded file names" /></Field><input className="mt-2 block w-full text-xs" type="file" accept="image/*" multiple onChange={(change) => uploadEvidence('photos', change.target.files)} /></div><div><Field label="Videos"><input className={inputClass} value={review.videos} onChange={(change) => updateReview({ videos: change.target.value })} placeholder="Video notes or uploaded file names" /></Field><input className="mt-2 block w-full text-xs" type="file" accept="video/*" multiple onChange={(change) => uploadEvidence('videos', change.target.files)} /></div><div><Field label="Press Coverage"><input className={inputClass} value={review.pressCoverage} onChange={(change) => updateReview({ pressCoverage: change.target.value })} placeholder="Newspaper clipping / media coverage" /></Field><input className="mt-2 block w-full text-xs" type="file" accept="image/*,.pdf" multiple onChange={(change) => uploadEvidence('pressCoverage', change.target.files)} /></div><div><Field label="Feedback Forms"><input className={inputClass} value={review.feedbackSummary} onChange={(change) => updateReview({ feedbackSummary: change.target.value })} placeholder="Parent feedback collected — 145 responses" /></Field><div className="mt-2 flex gap-2"><input type="number" min="0" className={`${inputClass} max-w-36`} value={review.feedbackResponses} onChange={(change) => updateReview({ feedbackResponses: Number(change.target.value) })} aria-label="Feedback response count" /><input type="file" accept=".csv,.pdf,.xlsx" multiple className="block w-full text-xs" onChange={(change) => uploadEvidence('feedbackSummary', change.target.files)} /></div></div></div>
      </Panel>

      <Panel title="Panel 5 · Achievements to Student Profiles">
        <div className="grid gap-3 md:grid-cols-2"><Field label="Performers"><input type="number" min="0" className={inputClass} value={review.performers} onChange={(change) => updateReview({ performers: Number(change.target.value) })} /></Field><Field label="Award Recipients"><input type="number" min="0" className={inputClass} value={review.awardRecipients} onChange={(change) => updateReview({ awardRecipients: Number(change.target.value) })} /></Field></div>
        <div className="grid gap-2 md:grid-cols-3"><label className="flex items-center gap-2 rounded-lg border border-slate-100 px-3 py-3 text-xs"><input type="checkbox" checked={review.participationCertificatesGenerated} onChange={(change) => updateReview({ participationCertificatesGenerated: change.target.checked })} />Participation certificates generated</label><label className="flex items-center gap-2 rounded-lg border border-slate-100 px-3 py-3 text-xs"><input type="checkbox" checked={review.meritCertificatesGenerated} onChange={(change) => updateReview({ meritCertificatesGenerated: change.target.checked })} />Merit certificates generated</label><label className="flex items-center gap-2 rounded-lg border border-slate-100 px-3 py-3 text-xs"><input type="checkbox" checked={review.studentProfilesUpdated} onChange={(change) => updateReview({ studentProfilesUpdated: change.target.checked })} />Student profiles updated</label></div>
        <Field label="Report Notes"><textarea className={`${inputClass} min-h-20`} value={review.reportNotes} onChange={(change) => updateReview({ reportNotes: change.target.value })} placeholder="Notes for the event report or future records" /></Field>
      </Panel>

      <div className="flex flex-wrap justify-end gap-2"><Button variant="outline" onClick={generateReport}><Download className="h-4 w-4" />Generate Event Report</Button><Button variant="outline" onClick={saveReview}><Save className="h-4 w-4" />Save Review</Button><Button onClick={markDocumented}><CheckCircle2 className="h-4 w-4" />Mark as Fully Documented</Button></div>
    </div>
  );
}
