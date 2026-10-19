import React, { useMemo, useState } from 'react';
import { Search, Star, X } from 'lucide-react';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Card } from '../../../../components/ui/Card';
import {
  DEFAULT_EVENT_REVIEWS,
  DEFAULT_SCHOOL_EVENTS,
  EVENT_REVIEWS_STORAGE_KEY,
  SCHOOL_EVENTS_STORAGE_KEY,
  EventReviewRecord,
  SchoolEventRecord,
  createEmptyReview,
  loadEventCollection,
  saveEventCollection,
  setActiveSchoolEvent
} from './eventData';

const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100';
const money = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;
const varianceLabel = (variance: number) => variance < 0 ? `₹${Math.abs(variance).toLocaleString('en-IN')} Under budget` : variance > 0 ? `₹${variance.toLocaleString('en-IN')} Over budget` : '₹0 On budget';
const statusVariant = (status: string): 'success' | 'warning' | 'info' | 'danger' | 'default' => {
  if (status === 'Completed' || status === 'Fully Documented') return 'success';
  if (status === 'Saved' || status === 'In Progress') return 'info';
  if (status === 'Cancelled') return 'danger';
  return 'default';
};

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="overflow-hidden rounded-xl border border-slate-200 bg-white"><div className="border-b border-slate-100 bg-slate-50 px-4 py-3"><h2 className="text-sm font-bold text-slate-800">{title}</h2></div><div className="space-y-4 p-4">{children}</div></section>;
}

export function EventFeedbackReview({ embeddedEventId, onBack, editable = false }: { embeddedEventId?: string; onBack?: () => void; editable?: boolean } = {}) {
  const [events] = useState<SchoolEventRecord[]>(() => loadEventCollection(SCHOOL_EVENTS_STORAGE_KEY, DEFAULT_SCHOOL_EVENTS));
  const [reviews, setReviews] = useState<EventReviewRecord[]>(() => loadEventCollection(EVENT_REVIEWS_STORAGE_KEY, DEFAULT_EVENT_REVIEWS));
  const [eventSearch, setEventSearch] = useState('');
  const [viewingId, setViewingId] = useState<string | null>(embeddedEventId || null);
  const [message, setMessage] = useState('');

  const searchableEvents = events.filter((item) => {
    const q = eventSearch.toLowerCase();
    return !q || item.name.toLowerCase().includes(q) || (item.code || '').toLowerCase().includes(q) || (item.venueName || '').toLowerCase().includes(q);
  });

  const event = events.find((item) => item.id === viewingId) || null;
  const savedReview = useMemo(() => reviews.find((item) => item.eventId === event?.id), [reviews, event?.id]);
  const review = savedReview || (event ? createEmptyReview(event.id) : null);

  const persistReview = (updated: EventReviewRecord) => {
    const next = reviews.some((item) => item.eventId === updated.eventId) ? reviews.map((item) => item.eventId === updated.eventId ? updated : item) : [...reviews, updated];
    setReviews(next);
    saveEventCollection(EVENT_REVIEWS_STORAGE_KEY, next);
  };
  const patchReview = (patch: Partial<EventReviewRecord>) => {
    if (!review || !event) return;
    persistReview({ ...review, ...patch, eventId: event.id });
  };

  const openEvent = (id: string) => {
    setViewingId(id);
    setActiveSchoolEvent(id);
  };

  const estimatedTotal = event?.budgetItems.reduce((sum, item) => sum + Number(item.estimatedCost || 0), 0) || 0;
  const actualTotal = event?.budgetItems.reduce((sum, item) => sum + Number(item.actualCost || 0), 0) || 0;
  const hasActuals = Boolean(event?.budgetItems.some((item) => item.actualCost !== null));
  const averageRating = Math.max(0, Math.min(5, review?.rating || 0));

  return (
    <div className="space-y-5 p-4 md:p-6">
      {!embeddedEventId && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Event Section · Post-event Review</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Event Feedback &amp; Review</h1>
          <p className="mt-1 text-sm text-slate-500">View event feedback. Search, then open an event to see its review.</p>
        </div>
      )}
      {embeddedEventId && (
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Feedback</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">{event?.name || 'Event feedback'}</h1>
            <p className="mt-1 text-sm text-slate-500">{editable ? 'Record ratings, attendance and coordinator notes for this event.' : 'Event feedback for this schedule.'}</p>
          </div>
          {onBack && <Button variant="outline" size="sm" onClick={onBack}><X className="h-4 w-4" />Back to schedule</Button>}
        </div>
      )}
      {message && <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-800">{message}</div>}

      {!viewingId && (
        <>
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input className={`${inputClass} pl-9`} placeholder="Search event, code or venue..." value={eventSearch} onChange={(change) => setEventSearch(change.target.value)} />
          </div>
          <Card noPadding>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                  <tr><th className="px-4 py-3">Event</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Venue</th><th className="px-4 py-3">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {searchableEvents.map((item) => (
                    <tr key={item.id} className="cursor-pointer hover:bg-indigo-50/40" onClick={() => openEvent(item.id)}>
                      <td className="px-4 py-3"><p className="font-semibold text-slate-800">{item.name}</p><p className="font-mono text-[10px] text-slate-400">{item.code}</p></td>
                      <td className="px-4 py-3 text-slate-600">{item.date || '—'}</td>
                      <td className="px-4 py-3 text-slate-600">{item.venueName || '—'}</td>
                      <td className="px-4 py-3"><Badge variant={statusVariant(item.status)}>{item.status}</Badge></td>
                    </tr>
                  ))}
                  {searchableEvents.length === 0 && <tr><td colSpan={4} className="px-4 py-12 text-center text-sm text-slate-400">No events match the search.</td></tr>}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {viewingId && event && review && (
        <>
          {!embeddedEventId && (
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => { if (onBack) onBack(); else setViewingId(null); }}><X className="h-4 w-4" />Back</Button>
              <Badge variant={statusVariant(review.reviewStatus)}>{review.reviewStatus}</Badge>
            </div>
          )}
          <Card className="border-indigo-200 bg-indigo-50/60">
            <h2 className="text-base font-bold text-indigo-950">Event feedback — {event.name}</h2>
            <p className="mt-1 text-xs text-indigo-800">Event date: {event.date ? new Date(`${event.date}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Not set'} · Event status: {event.status}</p>
          </Card>
          <Panel title="Event Summary">
            {editable ? (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 text-sm">
                <label>Estimated parents<input type="number" min={0} className={`${inputClass} mt-1`} value={review.estimatedParents} onChange={(change) => patchReview({ estimatedParents: Number(change.target.value) || 0 })} /></label>
                <label>Actual students<input type="number" min={0} className={`${inputClass} mt-1`} value={review.actualStudents} onChange={(change) => patchReview({ actualStudents: Number(change.target.value) || 0 })} /></label>
                <label>Actual staff<input type="number" min={0} className={`${inputClass} mt-1`} value={review.actualStaff} onChange={(change) => patchReview({ actualStaff: Number(change.target.value) || 0 })} /></label>
                <label>Review by<input className={`${inputClass} mt-1`} value={review.reviewBy} onChange={(change) => patchReview({ reviewBy: change.target.value })} /></label>
                <label>Actual start<input className={`${inputClass} mt-1`} value={review.actualStartTime} onChange={(change) => patchReview({ actualStartTime: change.target.value })} /></label>
                <label>Actual end<input className={`${inputClass} mt-1`} value={review.actualEndTime} onChange={(change) => patchReview({ actualEndTime: change.target.value })} /></label>
                <label>Overall rating
                  <select className={`${inputClass} mt-1`} value={review.rating} onChange={(change) => patchReview({ rating: Number(change.target.value) })}>
                    {[0, 1, 2, 3, 4, 5].map((rating) => <option key={rating} value={rating}>{rating ? `${rating} / 5` : 'Not rated'}</option>)}
                  </select>
                  <span className="mt-2 flex gap-1 text-amber-500">{Array.from({ length: 5 }, (_, index) => <Star key={index} className={`h-4 w-4 ${index < Math.round(averageRating) ? 'fill-current' : ''}`} />)}</span>
                </label>
                <label className="flex items-center gap-2 self-end rounded-lg border border-slate-200 px-3 py-2"><input type="checkbox" checked={review.guestAttended} onChange={(change) => patchReview({ guestAttended: change.target.checked })} />Chief guest attended</label>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 text-sm">
                <p>Estimated parents: <b>{review.estimatedParents}</b></p>
                <p>Actual students: <b>{review.actualStudents}</b></p>
                <p>Actual staff: <b>{review.actualStaff}</b></p>
                <p>Review by: <b>{review.reviewBy || '—'}</b></p>
                <p>Actual start: <b>{review.actualStartTime || '—'}</b></p>
                <p>Actual end: <b>{review.actualEndTime || '—'}</b></p>
                <p className="flex items-center gap-1 text-amber-500">{Array.from({ length: 5 }, (_, index) => <Star key={index} className={`h-4 w-4 ${index < Math.round(averageRating) ? 'fill-current' : ''}`} />)}<span className="text-xs text-slate-500">{averageRating || 'Not rated'} / 5</span></p>
                <p>Chief guest: <b>{review.guestAttended ? 'Attended' : 'Did not attend'}</b></p>
              </div>
            )}
            {editable ? <label className="block text-sm">Guest notes<textarea className={`${inputClass} mt-1 min-h-16`} value={review.guestNotes} onChange={(change) => patchReview({ guestNotes: change.target.value })} /></label> : review.guestNotes ? <p className="text-sm text-slate-600">Guest notes: {review.guestNotes}</p> : null}
          </Panel>
          <Panel title="Budget Actuals vs Estimated">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500"><tr><th className="px-3 py-2">Item</th><th className="px-3 py-2">Estimated</th><th className="px-3 py-2">Actual</th><th className="px-3 py-2">Variance</th><th className="px-3 py-2">Vendor</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {event.budgetItems.map((item) => {
                    const variance = item.actualCost === null ? null : item.actualCost - item.estimatedCost;
                    return <tr key={item.id}><td className="px-3 py-2 font-medium">{item.item}</td><td className="px-3 py-2">{money(item.estimatedCost)}</td><td className="px-3 py-2">{item.actualCost === null ? '—' : money(item.actualCost)}</td><td className={`px-3 py-2 text-xs font-semibold ${variance === null ? 'text-slate-400' : variance > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>{variance === null ? 'Not entered' : varianceLabel(variance)}</td><td className="px-3 py-2">{item.vendor || '—'}</td></tr>;
                  })}
                  {event.budgetItems.length === 0 && <tr><td colSpan={5} className="px-3 py-8 text-center text-sm text-slate-400">No budget items.</td></tr>}
                </tbody>
                <tfoot className="border-t-2 border-slate-200 bg-slate-50 font-bold"><tr><td className="px-3 py-3">TOTAL</td><td className="px-3 py-3">{money(estimatedTotal)}</td><td className="px-3 py-3">{hasActuals ? money(actualTotal) : '—'}</td><td className={`px-3 py-3 text-xs ${actualTotal > estimatedTotal ? 'text-rose-600' : 'text-emerald-700'}`}>{hasActuals ? varianceLabel(actualTotal - estimatedTotal) : 'Awaiting actuals'}</td><td /></tr></tfoot>
              </table>
            </div>
          </Panel>
          <Panel title="Coordinator notes">
            {editable ? (
              <div className="grid gap-4 md:grid-cols-3 text-sm">
                <label>What went well<textarea className={`${inputClass} mt-1 min-h-24`} value={review.whatWentWell} onChange={(change) => patchReview({ whatWentWell: change.target.value })} /></label>
                <label>What to improve<textarea className={`${inputClass} mt-1 min-h-24`} value={review.improvements} onChange={(change) => patchReview({ improvements: change.target.value })} /></label>
                <label>Suggestions<textarea className={`${inputClass} mt-1 min-h-24`} value={review.suggestions} onChange={(change) => patchReview({ suggestions: change.target.value })} /></label>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-3 text-sm">
                <div><p className="text-xs font-semibold text-slate-500">What went well</p><p className="mt-1 whitespace-pre-wrap">{review.whatWentWell || '—'}</p></div>
                <div><p className="text-xs font-semibold text-slate-500">What to improve</p><p className="mt-1 whitespace-pre-wrap">{review.improvements || '—'}</p></div>
                <div><p className="text-xs font-semibold text-slate-500">Suggestions</p><p className="mt-1 whitespace-pre-wrap">{review.suggestions || '—'}</p></div>
              </div>
            )}
          </Panel>
          <Panel title="Media & documentation">
            {editable ? (
              <div className="grid gap-3 md:grid-cols-2 text-sm">
                <label>Photos<input className={`${inputClass} mt-1`} value={review.photos} onChange={(change) => patchReview({ photos: change.target.value })} /></label>
                <label>Videos<input className={`${inputClass} mt-1`} value={review.videos} onChange={(change) => patchReview({ videos: change.target.value })} /></label>
                <label>Press coverage<input className={`${inputClass} mt-1`} value={review.pressCoverage} onChange={(change) => patchReview({ pressCoverage: change.target.value })} /></label>
                <label>Feedback summary<input className={`${inputClass} mt-1`} value={review.feedbackSummary} onChange={(change) => patchReview({ feedbackSummary: change.target.value })} /></label>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 text-sm">
                <p>Photos: {review.photos || '—'}</p>
                <p>Videos: {review.videos || '—'}</p>
                <p>Press coverage: {review.pressCoverage || '—'}</p>
                <p>Feedback: {review.feedbackSummary || '—'} ({review.feedbackResponses} responses)</p>
              </div>
            )}
          </Panel>
          <Panel title="Achievements">
            {editable ? (
              <div className="grid gap-3 md:grid-cols-2 text-sm">
                <label>Performers<input type="number" min={0} className={`${inputClass} mt-1`} value={review.performers} onChange={(change) => patchReview({ performers: Number(change.target.value) || 0 })} /></label>
                <label>Award recipients<input type="number" min={0} className={`${inputClass} mt-1`} value={review.awardRecipients} onChange={(change) => patchReview({ awardRecipients: Number(change.target.value) || 0 })} /></label>
                <label className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2"><input type="checkbox" checked={review.participationCertificatesGenerated} onChange={(change) => patchReview({ participationCertificatesGenerated: change.target.checked })} />Participation certificates generated</label>
                <label className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2"><input type="checkbox" checked={review.meritCertificatesGenerated} onChange={(change) => patchReview({ meritCertificatesGenerated: change.target.checked })} />Merit certificates generated</label>
                <label className="md:col-span-2">Report notes<textarea className={`${inputClass} mt-1 min-h-20`} value={review.reportNotes} onChange={(change) => patchReview({ reportNotes: change.target.value })} /></label>
              </div>
            ) : (
              <>
                <div className="grid gap-3 md:grid-cols-2 text-sm">
                  <p>Performers: <b>{review.performers}</b></p>
                  <p>Award recipients: <b>{review.awardRecipients}</b></p>
                  <p>Participation certificates: <b>{review.participationCertificatesGenerated ? 'Generated' : 'Not generated'}</b></p>
                  <p>Merit certificates: <b>{review.meritCertificatesGenerated ? 'Generated' : 'Not generated'}</b></p>
                </div>
                {review.reportNotes && <p className="text-sm text-slate-600">{review.reportNotes}</p>}
              </>
            )}
          </Panel>
          {editable && <div className="flex justify-end"><Button onClick={() => { persistReview({ ...review, reviewStatus: 'Saved' }); setMessage('Feedback saved.'); window.setTimeout(() => setMessage(''), 3000); }}>Save feedback</Button></div>}
        </>
      )}
    </div>
  );
}

export default EventFeedbackReview;
