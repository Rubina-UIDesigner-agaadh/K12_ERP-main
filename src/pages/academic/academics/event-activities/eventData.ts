export const EVENT_TYPES_STORAGE_KEY = 'k12-school-event-types-v1';
export const SCHOOL_EVENTS_STORAGE_KEY = 'k12-school-events-v1';
export const EVENT_EXECUTIONS_STORAGE_KEY = 'k12-school-event-execution-v1';
export const EVENT_REVIEWS_STORAGE_KEY = 'k12-school-event-reviews-v1';
export const ACTIVE_SCHOOL_EVENT_STORAGE_KEY = 'k12-active-school-event-v1';

export const EVENT_TYPE_CATEGORIES = [
  'Academic', 'Cultural', 'Sports', 'National Day', 'Celebration', 'Health & Safety',
  'Social', 'Science & Tech', 'Trip & Camp', 'Meeting', 'Creative', 'Other'
];
export const EVENT_AUDIENCES = ['All Students', 'All Staff', 'Parents', 'Alumni', 'Community'];
export const EVENT_RECURRENCES = ['Once', 'Yearly', 'Per Term', 'Monthly', 'As Needed'];
export const EVENT_STATUSES = ['Planning', 'Pending Approval', 'Approved', 'In Progress', 'Completed', 'Cancelled'] as const;
export type SchoolEventStatus = typeof EVENT_STATUSES[number];
export type EventTypeStatus = 'Active' | 'Inactive';

export interface EventTypeRecord {
  id: string;
  name: string;
  code: string;
  icon: string;
  category: string;
  description: string;
  audience: string[];
  appliesToAllClasses: boolean;
  classes: string[];
  recurrence: string;
  status: EventTypeStatus;
  typicalDurationHours: number;
  preferredTimeOfYear: string;
  venueType: string;
  preparationWeeks: number;
  schoolHoliday: boolean;
  principalApproval: boolean;
  notifyParents: boolean;
  parentPortal: boolean;
  instituteCalendar: boolean;
  participationCertificates: boolean;
  achievementCertificates: boolean;
  mementos: boolean;
}

export interface EventPreparationDay {
  id: string;
  kind: string;
  date: string;
  activity: string;
  venue: string;
}

export interface EventProgramItem {
  id: string;
  time: string;
  item: string;
  participants: string;
  actualTime: string;
  status: string;
}

export interface EventGuest {
  id: string;
  name: string;
  designation: string;
  contact: string;
  invitationSent: boolean;
  response: 'Confirmed' | 'Awaiting' | 'Declined';
}

export interface EventResponsibility {
  id: string;
  role: string;
  assignedTo: string;
}

export interface EventBudgetItem {
  id: string;
  item: string;
  estimatedCost: number;
  actualCost: number | null;
  vendor: string;
}

export interface SchoolEventRecord {
  id: string;
  name: string;
  typeId: string;
  typeName: string;
  theme: string;
  code: string;
  academicYear: string;
  status: SchoolEventStatus;
  date: string;
  isMultiDay: boolean;
  endDate: string;
  startTime: string;
  endTime: string;
  preparationDays: EventPreparationDay[];
  venueName: string;
  venueCode: string;
  venueAddress: string;
  seatingCapacity: number;
  expectedAttendance: number;
  overflowArrangements: string;
  schoolHoliday: boolean;
  programItems: EventProgramItem[];
  guests: EventGuest[];
  responsibilities: EventResponsibility[];
  resources: string[];
  budgetItems: EventBudgetItem[];
  parentsInvited: boolean;
  passesRequired: boolean;
  passesPerFamily: number;
  publicInvited: boolean;
  circularFile: string;
  notifyVia: string[];
  notifyDate: string;
  postOn: string[];
  requiresPrincipalApproval: boolean;
  principalApprovalStatus: string;
  requiresManagementApproval: boolean;
  managementApprovalStatus: string;
  policePermission: boolean;
  fireNoc: boolean;
  notes: string;
}

export interface EventIncident {
  id: string;
  time: string;
  description: string;
  actionTaken: string;
}

export interface EventExecutionSnapshot {
  eventId: string;
  checklist: Record<string, boolean>;
  programItems: EventProgramItem[];
  staffCount: number;
  studentCount: number;
  parentCount: number;
  actualCounted: number;
  incidents: EventIncident[];
  notes: string;
  photoFiles: string[];
  complete: boolean;
}

export interface EventReviewRecord {
  eventId: string;
  reviewStatus: 'Draft' | 'Saved' | 'Fully Documented';
  reviewBy: string;
  estimatedParents: number;
  actualStudents: number;
  actualStaff: number;
  actualStartTime: string;
  actualEndTime: string;
  guestAttended: boolean;
  guestNotes: string;
  rating: number;
  whatWentWell: string;
  improvements: string;
  suggestions: string;
  photos: string;
  videos: string;
  pressCoverage: string;
  feedbackSummary: string;
  feedbackResponses: number;
  performers: number;
  awardRecipients: number;
  participationCertificatesGenerated: boolean;
  meritCertificatesGenerated: boolean;
  studentProfilesUpdated: boolean;
  reportNotes: string;
}

const baseEventType = (
  id: string,
  name: string,
  icon: string,
  category: string,
  audience: string[],
  recurrence: string,
  overrides: Partial<EventTypeRecord> = {}
): EventTypeRecord => ({
  id, name, icon, category, audience, recurrence,
  code: `EVT-${name.toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-|-$/g, '')}`,
  description: '', appliesToAllClasses: true, classes: [], status: 'Active',
  typicalDurationHours: 8, preferredTimeOfYear: 'December to February', venueType: 'Auditorium', preparationWeeks: 4,
  schoolHoliday: false, principalApproval: true, notifyParents: true, parentPortal: true, instituteCalendar: true,
  participationCertificates: true, achievementCertificates: true, mementos: false,
  ...overrides
});

export const DEFAULT_EVENT_TYPES: EventTypeRecord[] = [
  baseEventType('et-001', 'Annual Day', '🎭', 'Cultural', ['All Students', 'All Staff', 'Parents', 'Alumni', 'Community'], 'Yearly', { description: 'Annual cultural showcase — drama, dance, music and awards.', venueType: 'Auditorium' }),
  baseEventType('et-002', 'Annual Sports Day', '⚽', 'Sports', ['All Students', 'All Staff', 'Parents'], 'Yearly', { description: 'School-wide athletics, field events and team competitions.', venueType: 'Sports Ground', schoolHoliday: true }),
  baseEventType('et-003', 'Parent-Teacher Meeting', '👨‍👩‍👧', 'Academic', ['Parents', 'All Staff'], 'Per Term', { description: 'Scheduled parent-teacher conferences and progress discussions.', typicalDurationHours: 4, venueType: 'Classrooms', preparationWeeks: 2 }),
  baseEventType('et-004', 'Independence Day', '🇮🇳', 'National Day', ['All Students', 'All Staff', 'Parents', 'Community'], 'Yearly', { description: 'National flag ceremony, cultural program and community gathering.', preferredTimeOfYear: 'August', venueType: 'School Ground', schoolHoliday: true }),
  baseEventType('et-005', 'Republic Day', '🫡', 'National Day', ['All Students', 'All Staff', 'Parents', 'Community'], 'Yearly', { description: 'National celebration and school ceremony.', preferredTimeOfYear: 'January', venueType: 'School Ground', schoolHoliday: true }),
  baseEventType('et-006', "Teachers' Day", '👩‍🏫', 'Celebration', ['All Students', 'All Staff'], 'Yearly', { description: 'Student-led appreciation program for teachers.', preferredTimeOfYear: 'September', venueType: 'Auditorium' }),
  baseEventType('et-007', "Children's Day", '👧', 'Celebration', ['All Students', 'All Staff'], 'Yearly', { description: 'Student celebration, games and performances.', preferredTimeOfYear: 'November', venueType: 'School Ground' }),
  baseEventType('et-008', 'Science Exhibition', '🔬', 'Academic', ['All Students', 'All Staff', 'Parents'], 'Yearly', { description: 'Student science projects, demonstrations and exhibitions.', venueType: 'School Hall', preparationWeeks: 6 }),
  baseEventType('et-009', 'Book Fair / Library Week', '📖', 'Academic', ['All Students', 'All Staff'], 'Yearly', { description: 'Reading promotion, author sessions and book fair.', venueType: 'Library', typicalDurationHours: 6 }),
  baseEventType('et-010', 'Environment Day', '🌿', 'Social', ['All Students', 'All Staff', 'Community'], 'Yearly', { description: 'Campus sustainability and environmental awareness activities.', preferredTimeOfYear: 'June', venueType: 'School Ground' }),
  baseEventType('et-011', 'Educational Trip', '🚌', 'Academic', ['All Students'], 'As Needed', { description: 'Curriculum-linked educational visit with student supervision.', typicalDurationHours: 10, venueType: 'Off-campus', preparationWeeks: 3, schoolHoliday: true }),
  baseEventType('et-012', 'Nature Camp', '🏕️', 'Trip & Camp', ['All Students'], 'As Needed', { description: 'Outdoor learning, nature study and team-building camp.', typicalDurationHours: 24, venueType: 'Off-campus', preparationWeeks: 6, schoolHoliday: true }),
  baseEventType('et-013', 'Open House', '📋', 'Academic', ['Parents', 'All Staff'], 'Per Term', { description: 'Parent access to student work, learning spaces and teacher discussions.', typicalDurationHours: 4, venueType: 'All Classrooms' }),
  baseEventType('et-014', 'Investiture Ceremony', '🎓', 'Academic', ['All Students', 'All Staff', 'Parents'], 'Yearly', { description: 'Student leadership oath and badge ceremony.', venueType: 'Auditorium' }),
  baseEventType('et-015', 'Farewell / Graduation', '👋', 'Celebration', ['All Students', 'All Staff', 'Parents'], 'Yearly', { description: 'Graduation and farewell for Classes 10 and 12.', venueType: 'Auditorium', appliesToAllClasses: false, classes: ['Class 10', 'Class 12'] }),
  baseEventType('et-016', 'Health Check-up Camp', '🏥', 'Health & Safety', ['All Students', 'All Staff', 'Parents'], 'Yearly', { description: 'Preventive student health screening and referral support.', typicalDurationHours: 6, venueType: 'Medical Room', preparationWeeks: 3 }),
  baseEventType('et-017', 'Fire Safety Drill', '🚨', 'Health & Safety', ['All Students', 'All Staff', 'Parents'], 'Yearly', { description: 'Fire evacuation drill and safety response practice.', typicalDurationHours: 2, venueType: 'Whole Campus', preparationWeeks: 2 }),
  baseEventType('et-018', 'Community Service Day', '🤝', 'Social', ['All Students', 'All Staff', 'Community'], 'As Needed', { description: 'Student-led community volunteering and outreach.', typicalDurationHours: 6, venueType: 'Off-campus', schoolHoliday: true }),
  baseEventType('et-019', 'Photography Day', '📸', 'Creative', ['All Students'], 'As Needed', { description: 'Student portrait, class photo and yearbook photography.', typicalDurationHours: 4, venueType: 'School Campus' }),
  baseEventType('et-020', 'Talent Show', '🎤', 'Cultural', ['All Students', 'All Staff', 'Parents'], 'As Needed', { description: 'Student performance showcase across music, dance, drama and arts.', venueType: 'Auditorium', preparationWeeks: 4 })
];

const annualPreparationDays: EventPreparationDay[] = [
  { id: 'prep-1', kind: 'Rehearsal', date: '2026-03-10', activity: 'Full dress rehearsal', venue: 'Auditorium' },
  { id: 'prep-2', kind: 'Rehearsal', date: '2026-03-12', activity: 'Final run-through', venue: 'Auditorium' },
  { id: 'prep-3', kind: 'Setup', date: '2026-03-14', activity: 'Stage decoration and setup', venue: 'Auditorium' }
];
const annualProgram: EventProgramItem[] = [
  { id: 'agenda-1', time: '05:00 PM', item: 'Welcome & Lighting of Lamp', participants: 'Principal + Chief Guest', actualTime: '05:05 PM', status: 'Done' },
  { id: 'agenda-2', time: '05:15 PM', item: 'Welcome Address', participants: 'Principal Mr. A. Sharma', actualTime: '05:20 PM', status: 'Done' },
  { id: 'agenda-3', time: '05:25 PM', item: 'School Annual Report', participants: 'Vice Principal', actualTime: '05:32 PM', status: 'Done' },
  { id: 'agenda-4', time: '05:35 PM', item: 'Cultural Dance — Bharatanatyam', participants: 'Class 8-A, 8-B (15 students)', actualTime: '', status: 'On Stage Now' },
  { id: 'agenda-5', time: '05:55 PM', item: 'Drama — Unity in Diversity', participants: 'Class 10-A (25 students)', actualTime: '', status: 'Next' },
  { id: 'agenda-6', time: '06:25 PM', item: 'Musical Performance', participants: 'Music Club (12 students)', actualTime: '', status: 'Upcoming' },
  { id: 'agenda-7', time: '06:50 PM', item: 'Awards & Prize Distribution', participants: 'Principal + Chief Guest', actualTime: '', status: 'Upcoming' },
  { id: 'agenda-8', time: '07:30 PM', item: 'Vote of Thanks', participants: 'Student Council President', actualTime: '', status: 'Upcoming' },
  { id: 'agenda-9', time: '07:40 PM', item: 'National Anthem', participants: 'All', actualTime: '', status: 'Upcoming' },
  { id: 'agenda-10', time: '07:45 PM', item: 'Refreshments', participants: 'All guests', actualTime: '', status: 'Upcoming' }
];
const annualBudget: EventBudgetItem[] = [
  { id: 'budget-1', item: 'Stage Decoration', estimatedCost: 15000, actualCost: 13500, vendor: 'To be arranged' },
  { id: 'budget-2', item: 'Sound System Rent', estimatedCost: 8000, actualCost: 8000, vendor: 'XYZ Sound Services' },
  { id: 'budget-3', item: 'Refreshments', estimatedCost: 20000, actualCost: 22500, vendor: 'School canteen' },
  { id: 'budget-4', item: 'Invitations / Printing', estimatedCost: 3000, actualCost: 2500, vendor: '' },
  { id: 'budget-5', item: 'Costumes / Props', estimatedCost: 10000, actualCost: 9000, vendor: 'Drama club' },
  { id: 'budget-6', item: 'Trophies / Certificates', estimatedCost: 5000, actualCost: 4500, vendor: '' },
  { id: 'budget-7', item: 'Miscellaneous', estimatedCost: 4000, actualCost: 3000, vendor: '' }
];

const eventDefaults: SchoolEventRecord = {
  id: '', name: '', typeId: 'et-001', typeName: 'Annual Day', theme: '', code: '', academicYear: '2025-26', status: 'Planning',
  date: '', isMultiDay: false, endDate: '', startTime: '09:00 AM', endTime: '04:00 PM', preparationDays: [],
  venueName: '', venueCode: '', venueAddress: '', seatingCapacity: 0, expectedAttendance: 0, overflowArrangements: '', schoolHoliday: false,
  programItems: [], guests: [], responsibilities: [], resources: [], budgetItems: [],
  parentsInvited: true, passesRequired: false, passesPerFamily: 2, publicInvited: false, circularFile: '',
  notifyVia: ['SMS', 'Email', 'Parent Portal'], notifyDate: '', postOn: ['School Website', 'Parent Portal'],
  requiresPrincipalApproval: true, principalApprovalStatus: 'Pending', requiresManagementApproval: false,
  managementApprovalStatus: 'Not Required', policePermission: false, fireNoc: false, notes: ''
};

const makeEvent = (overrides: Partial<SchoolEventRecord>): SchoolEventRecord => ({
  ...eventDefaults,
  ...overrides,
  preparationDays: (overrides.preparationDays || eventDefaults.preparationDays).map((item) => ({ ...item })),
  programItems: (overrides.programItems || eventDefaults.programItems).map((item) => ({ ...item })),
  guests: (overrides.guests || eventDefaults.guests).map((item) => ({ ...item })),
  responsibilities: (overrides.responsibilities || eventDefaults.responsibilities).map((item) => ({ ...item })),
  resources: [...(overrides.resources || eventDefaults.resources)],
  budgetItems: (overrides.budgetItems || eventDefaults.budgetItems).map((item) => ({ ...item })),
  notifyVia: [...(overrides.notifyVia || eventDefaults.notifyVia)],
  postOn: [...(overrides.postOn || eventDefaults.postOn)]
});

export const DEFAULT_SCHOOL_EVENTS: SchoolEventRecord[] = [
  makeEvent({ id: 'evt-independence-2025', name: 'Independence Day 2025', typeId: 'et-004', typeName: 'Independence Day', code: 'EVT-2025-26-001', academicYear: '2025-26', status: 'Completed', date: '2025-08-15', startTime: '08:00 AM', endTime: '11:30 AM', venueName: 'School Ground', seatingCapacity: 1200, expectedAttendance: 1100, schoolHoliday: true, responsibilities: [{ id: 'resp-id-1', role: 'Event Coordinator', assignedTo: 'Administration Team' }] }),
  makeEvent({ id: 'evt-teachers-day-2025', name: "Teachers' Day 2025", typeId: 'et-006', typeName: "Teachers' Day", code: 'EVT-2025-26-002', academicYear: '2025-26', status: 'Completed', date: '2025-09-05', startTime: '10:00 AM', endTime: '01:00 PM', venueName: 'Auditorium', seatingCapacity: 800, expectedAttendance: 650 }),
  makeEvent({ id: 'evt-ptm-term1-2025', name: 'PTM — Term 1', typeId: 'et-003', typeName: 'Parent-Teacher Meeting', code: 'EVT-2025-26-003', academicYear: '2025-26', status: 'Completed', date: '2025-10-25', startTime: '09:00 AM', endTime: '01:00 PM', venueName: 'All Rooms', seatingCapacity: 1000, expectedAttendance: 700 }),
  makeEvent({ id: 'evt-children-day-2025', name: "Children's Day 2025", typeId: 'et-007', typeName: "Children's Day", code: 'EVT-2025-26-004', academicYear: '2025-26', status: 'Completed', date: '2025-11-14', startTime: '09:00 AM', endTime: '01:00 PM', venueName: 'Auditorium', seatingCapacity: 800, expectedAttendance: 750 }),
  makeEvent({ id: 'evt-science-2026', name: 'Science Exhibition', typeId: 'et-008', typeName: 'Science Exhibition', code: 'EVT-2025-26-005', academicYear: '2025-26', status: 'Planning', date: '2026-02-14', venueName: 'School Hall', seatingCapacity: 500, expectedAttendance: 450 }),
  makeEvent({ id: 'evt-sports-2026', name: 'Annual Sports Day', typeId: 'et-002', typeName: 'Annual Sports Day', code: 'EVT-2025-26-006', academicYear: '2025-26', status: 'Planning', date: '2026-01-15', venueName: 'Ground', seatingCapacity: 1500, expectedAttendance: 1200 }),
  makeEvent({ id: 'evt-annual-2026', name: 'Annual Day 2026 — Colours of India', typeId: 'et-001', typeName: 'Annual Day', theme: 'Colours of India', code: 'EVT-2025-26-007', academicYear: '2025-26', status: 'Planning', date: '2026-03-15', startTime: '05:00 PM', endTime: '09:00 PM', preparationDays: annualPreparationDays, venueName: 'Main Auditorium', venueCode: 'AUD-01, Admin Block', venueAddress: 'Admin Block', seatingCapacity: 800, expectedAttendance: 1200, overflowArrangements: 'Live stream to Computer Lab 1 and 2', schoolHoliday: true, programItems: annualProgram, guests: [{ id: 'guest-1', name: 'Dr. R. Sharma', designation: 'Director, District Education Office', contact: '98XXXXXXXX', invitationSent: true, response: 'Confirmed' }], responsibilities: [{ id: 'resp-1', role: 'Event Coordinator', assignedTo: 'Mrs. P. Gupta — Cultural Dept.' }, { id: 'resp-2', role: 'Stage Manager', assignedTo: 'Mr. V. Patel' }, { id: 'resp-3', role: 'Decoration In-charge', assignedTo: 'Ms. M. Verma' }, { id: 'resp-4', role: 'Sound & AV', assignedTo: 'Mr. H. Nair' }, { id: 'resp-5', role: 'Photography', assignedTo: 'Ms. K. Singh' }, { id: 'resp-6', role: 'Refreshment', assignedTo: 'Mrs. A. Roy' }, { id: 'resp-7', role: 'Registration Desk', assignedTo: 'Mr. R. Kumar + Ms. P. Roy' }, { id: 'resp-8', role: 'Discipline / Crowd', assignedTo: 'All available staff' }], resources: ['Projector / Screen', 'Sound System', 'Microphones (5)', 'Stage Lighting', 'Backdrop / Banner', 'Podium', 'Chairs for Audience', 'Reserved VIP Seating', 'Decorations', 'Red Carpet'], budgetItems: annualBudget, parentsInvited: true, passesRequired: false, publicInvited: false, circularFile: 'annual-day-invitation.pdf', notifyVia: ['SMS', 'Email', 'Parent Portal'], notifyDate: '2026-03-01', postOn: ['School Website', 'Parent Portal'], requiresPrincipalApproval: true, principalApprovalStatus: 'Pending Approval', requiresManagementApproval: true, managementApprovalStatus: 'Pending', policePermission: false, fireNoc: true, notes: 'Start planning six weeks in advance next year.' }),
  makeEvent({ id: 'evt-farewell-2026', name: 'Farewell — Class 10 & 12', typeId: 'et-015', typeName: 'Farewell / Graduation', code: 'EVT-2025-26-008', academicYear: '2025-26', status: 'Planning', date: '2026-03-20', venueName: 'Auditorium', seatingCapacity: 800, expectedAttendance: 600 })
];

const annualChecklist = [
  'Venue decoration completed', 'Sound system tested', 'Guest of Honour confirmed',
  'Costumes distributed to performers', 'Seating arrangement done', 'Registration desk set up',
  'Refreshments arranged', 'Photography/videography team in place'
];

export const DEFAULT_EVENT_EXECUTIONS: EventExecutionSnapshot[] = [{
  eventId: 'evt-annual-2026',
  checklist: {
    'Venue decoration completed': true, 'Sound system tested': true, 'Guest of Honour confirmed': true,
    'Costumes distributed to performers': true, 'Seating arrangement done': true, 'Registration desk set up': false,
    'Refreshments arranged': true, 'Photography/videography team in place': false
  },
  programItems: annualProgram.map((item) => ({ ...item })),
  staffCount: 48, studentCount: 420, parentCount: 477, actualCounted: 945,
  incidents: [], notes: '', photoFiles: [], complete: false
}];

export const DEFAULT_EVENT_REVIEWS: EventReviewRecord[] = [{
  eventId: 'evt-annual-2026', reviewStatus: 'Draft', reviewBy: '2026-03-22', estimatedParents: 950,
  actualStudents: 420, actualStaff: 48, actualStartTime: '05:05 PM', actualEndTime: '09:15 PM',
  guestAttended: true, guestNotes: 'Dr. R. Sharma delivered an inspiring speech.', rating: 4.5,
  whatWentWell: 'Sound system was excellent; students performed brilliantly.',
  improvements: 'Registration desk needed more staff; refreshments ran out.',
  suggestions: 'Start planning six weeks in advance instead of four.',
  photos: '48 photos uploaded', videos: '2 videos uploaded', pressCoverage: '1 newspaper clipping uploaded',
  feedbackSummary: 'Parent feedback collected — 145 responses', feedbackResponses: 145, performers: 45, awardRecipients: 12,
  participationCertificatesGenerated: true, meritCertificatesGenerated: true, studentProfilesUpdated: true,
  reportNotes: 'Annual Day review demo record.'
}];

export const EVENT_EXECUTION_CHECKLIST = annualChecklist;

export function loadEventCollection<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) as T : fallback;
  } catch {
    return fallback;
  }
}

export function saveEventCollection<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /* Keep the form usable if storage is unavailable. */ }
}

export function getActiveSchoolEvent(): string {
  if (typeof window === 'undefined') return '';
  try { return window.localStorage.getItem(ACTIVE_SCHOOL_EVENT_STORAGE_KEY) || ''; } catch { return ''; }
}

export function setActiveSchoolEvent(id: string): void {
  if (typeof window === 'undefined') return;
  try { window.localStorage.setItem(ACTIVE_SCHOOL_EVENT_STORAGE_KEY, id); } catch { /* Storage may be unavailable. */ }
}

export function createEventId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function downloadEventCsv(filename: string, rows: Array<Record<string, string | number | boolean>>): void {
  if (typeof window === 'undefined' || rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const escape = (value: string | number | boolean) => `"${String(value).replace(/"/g, '""')}"`;
  const csv = [headers.map(escape).join(','), ...rows.map((row) => headers.map((header) => escape(row[header] ?? '')).join(','))].join('\r\n');
  const url = window.URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export function eventTypeAudienceLabel(audience: string[]): string {
  const has = (name: string) => audience.includes(name);
  if (has('All Students') && has('All Staff') && (has('Parents') || has('Community'))) return 'All';
  if (has('Parents') && has('All Staff')) return 'Parents+Staff';
  if (has('All Students') && has('All Staff')) return 'School';
  if (has('All Students')) return 'Students';
  if (has('All Staff')) return 'Staff';
  return audience.join('+') || '—';
}

export function createSchoolEvent(type: EventTypeRecord, academicYear = '2026-27'): SchoolEventRecord {
  return {
    ...eventDefaults,
    id: createEventId('evt'),
    name: type.name,
    typeId: type.id,
    typeName: type.name,
    code: `EVT-${academicYear.replace('-', '-')}-${Date.now().toString().slice(-3)}`,
    academicYear,
    status: type.principalApproval ? 'Pending Approval' : 'Planning',
    date: '',
    schoolHoliday: type.schoolHoliday,
    venueName: type.venueType,
    preparationDays: [], programItems: [], guests: [], responsibilities: [], resources: [], budgetItems: [],
    requiresPrincipalApproval: type.principalApproval,
    principalApprovalStatus: type.principalApproval ? 'Pending Approval' : 'Not Required',
    parentsInvited: type.audience.includes('Parents'),
    notifyVia: type.notifyParents ? ['SMS', 'Email', 'Parent Portal'] : [],
    postOn: [...(type.parentPortal ? ['Parent Portal'] : []), ...(type.instituteCalendar ? ['Institute Calendar'] : [])]
  };
}

export function createEmptyExecution(event: SchoolEventRecord): EventExecutionSnapshot {
  return {
    eventId: event.id,
    checklist: Object.fromEntries(EVENT_EXECUTION_CHECKLIST.map((item) => [item, false])),
    programItems: event.programItems.map((item) => ({ ...item, actualTime: '', status: 'Upcoming' })),
    staffCount: 0, studentCount: 0, parentCount: 0, actualCounted: 0, incidents: [], notes: '', photoFiles: [], complete: false
  };
}

export function createEmptyReview(eventId: string): EventReviewRecord {
  return {
    eventId, reviewStatus: 'Draft', reviewBy: '', estimatedParents: 0, actualStudents: 0, actualStaff: 0,
    actualStartTime: '', actualEndTime: '', guestAttended: false, guestNotes: '', rating: 0,
    whatWentWell: '', improvements: '', suggestions: '', photos: '', videos: '', pressCoverage: '',
    feedbackSummary: '', feedbackResponses: 0, performers: 0, awardRecipients: 0,
    participationCertificatesGenerated: false, meritCertificatesGenerated: false, studentProfilesUpdated: false, reportNotes: ''
  };
}
