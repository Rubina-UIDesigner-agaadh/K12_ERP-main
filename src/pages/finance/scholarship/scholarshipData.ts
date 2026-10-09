// ============================================================
// Scholarship module — shared mock data + helpers (no backend).
// Used by: Scholarship Application Entry (applications, evaluation & approval),
// Scholarship Approval & Award (internal selection + government tracking) and
// Scholarship Disbursement (fee waiver / cash). Data is kept in memory, so a change
// made on one page is visible on the others until the browser page is reloaded.
// ============================================================

export type SchemeKind = 'Internal' | 'Government';
export type AwardMode = 'Fee Waiver' | 'Cash';
export type SportsLevel = 'None' | 'School' | 'District' | 'State' | 'National';
export type Conduct = 'Excellent' | 'Good' | 'Average' | 'Poor';
export type Category = 'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'Minority';
export type AppStatus = 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'On Hold' | 'Awarded';
export type GovtStatus = 'To Submit' | 'Pending' | 'Approved' | 'Rejected' | 'Disbursed';
export type DocStatus = 'Pending' | 'Received' | 'Verified';
export type Decision = 'Approve' | 'Reject' | 'Hold';

export const ACADEMIC_YEAR = '2025-26';
export const CURRENT_USER = 'Scholarship Committee (Admin)';

export interface ScholarshipScheme {
  id: string;
  name: string;
  shortName: string;
  kind: SchemeKind;
  provider: string;
  portal?: string;
  mode: AwardMode;
  basis: 'Percent' | 'Fixed';
  pct?: number;
  amount?: number;
  seats?: number;
  budget?: number;
  status: 'Open' | 'Closed';
  criteria: {
    minMarks?: number;
    minAttendance?: number;
    maxIncome?: number;
    categories?: Category[];
    minSportsLevel?: SportsLevel;
    rteOnly?: boolean;
    minClass?: number;
    maxClass?: number;
  };
  documents: string[];
  description: string;
}

export interface ScholarshipStudent {
  id: string;
  name: string;
  nameHindi?: string;
  grNo: string;
  admissionNo: string;
  cls: number;
  section: string;
  gender: 'Male' | 'Female' | 'Other';
  category: Category;
  subCategory?: string;
  caste?: string;
  religion?: string;
  nationality?: string;
  domicileState?: string;
  dateOfBirth?: string;
  aadharNo?: string;
  fatherName: string;
  fatherNameHindi?: string;
  fatherOccupation?: string;
  motherName: string;
  motherNameHindi?: string;
  motherOccupation?: string;
  guardianName?: string;
  guardianRelation?: string;
  phone: string;
  parentMobile?: string;
  email: string;
  permanentAddress?: string;
  correspondenceAddress?: string;
  district?: string;
  state?: string;
  pincode?: string;
  annualFee: number;
  marks: number;
  previousYearMarks?: number;
  attendance: number;
  attendancePercentage?: number;
  familyIncome: number;
  totalFamilyIncome?: number;
  fatherAnnualIncome?: number;
  motherAnnualIncome?: number;
  familyMembers?: number;
  isSingleParent?: boolean;
  isOrphan?: boolean;
  isDisabled?: boolean;
  disabilityType?: string | null;
  disabilityPercentage?: number | null;
  isMinority?: boolean;
  isBPL?: boolean;
  bplCardNo?: string | null;
  isAAY?: boolean;
  aayCardNo?: string | null;
  isEWS?: boolean;
  ewsCertificateNo?: string | null;
  sportsLevel: SportsLevel;
  conduct: Conduct;
  isRTE: boolean;
  photo?: string;
  bank: {holder: string;accountNo: string;ifsc: string;bankName: string;branch?: string;accountType?: string;isAadharLinked?: boolean;};
}

export interface AppDocument {
  name: string;
  required: boolean;
  status: DocStatus;
  fileName?: string;
}

export interface Evaluation {
  score: number;
  passCritical: boolean;
  decision?: Decision;
  reason?: string;
  followUp?: string;
  remarks: string;
  sanctionPct?: number;
  sanctionAmount?: number;
  override?: string;
  evaluatedBy: string;
  evaluatedOn: string;
}

export interface GovtTracking {
  status: GovtStatus;
  portalRef?: string;
  submittedOn?: string;
  decisionOn?: string;
  amountApproved?: number;
  rejectReason?: string;
}

export interface ScholarshipApplication {
  id: string;
  appNo: string;
  studentId: string;
  schemeId: string;
  ay: string;
  appliedOn: string;
  submittedBy: string;
  marks: number;
  attendance: number;
  familyIncome: number;
  category: Category;
  sportsLevel: SportsLevel;
  conduct: Conduct;
  isRTE: boolean;
  requestedAmount: number;
  requestedPct?: number;
  bank?: {holder: string;accountNo: string;ifsc: string;bankName: string;};
  documents: AppDocument[];
  status: AppStatus;
  evaluation?: Evaluation;
  tracking?: GovtTracking;
  award?: {pct?: number;amount: number;awardedOn: string;by: string;remarks?: string;};
  history: {on: string;by: string;action: string;}[];
}

export type DisbursementSchedule = 'Full Year' | 'Per Term' | 'Per Month';
export type PaymentMethod = 'Bank NEFT' | 'Cheque' | 'DBT (Portal)';

export interface Disbursement {
  id: string;
  voucherNo?: string;
  appId: string | null;
  studentId: string;
  schemeId: string;
  mode: AwardMode;
  amount: number;
  pct?: number;
  status: 'Pending' | 'Done';
  isDraft?: boolean;
  draftDate?: string;
  appliedOn: string | null;
  schedule?: DisbursementSchedule;
  paymentMethod?: PaymentMethod;
  reference?: string;
  fundsReceived: boolean;
  fundsReceivedOn?: string;
  remarks?: string;
  processedBy?: string;
}

export interface SelectionState {
  status: 'Draft' | 'Awarded';
  initialized: boolean;
  standardPct: number;
  standardAmount: number;
  selectedIds: string[];
  manualIds: string[];
  customPct: Record<string, number>;
  customAmount: Record<string, number>;
  remarks: Record<string, string>;
  reviewer: string;
  reviewed: boolean;
  approver: string;
  approval: 'Not Sent' | 'Awaiting' | 'Approved';
  sentOn?: string;
  awardedOn?: string;
  notifiedOn?: string;
}

// ---------------------------------------------------------------- formatting helpers
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const pad = (n: number, w = 2) => String(n).padStart(w, '0');
export const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
/** 15-Sep-25 */
export const formatDate = (iso?: string | null) => {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-').map(Number);
  return `${pad(d)}-${MONTHS[m - 1]}-${String(y).slice(2)}`;
};
/** 15 Sep 2025 */
export const formatDateLong = (iso?: string | null) => {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-').map(Number);
  return `${pad(d)} ${MONTHS[m - 1]} ${y}`;
};
export const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
export const formatLac = (n: number) => `₹${(n / 100000).toFixed(1)} Lac`;
const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
export const romanClass = (n: number) => ROMAN[n] || String(n);
export const classLabel = (s: {cls: number;section: string;}) => `${romanClass(s.cls)}-${s.section}`;
const SPORTS_RANK: Record<SportsLevel, number> = { None: 0, School: 1, District: 2, State: 3, National: 4 };
export const SPORTS_LEVELS: SportsLevel[] = ['None', 'School', 'District', 'State', 'National'];
export const CATEGORIES: Category[] = ['General', 'OBC', 'SC', 'ST', 'EWS', 'Minority'];

// ---------------------------------------------------------------- schemes (AY 2025-26)
const COMMON_DOCS = ['Aadhar Card (Student)', 'Previous Year Marksheet'];
export const SCHOLARSHIP_SCHEMES: ScholarshipScheme[] = [
{
  id: 'MERIT25', name: 'School Merit Scholarship 2025', shortName: 'School Merit 2025', kind: 'Internal', provider: 'School Trust',
  mode: 'Fee Waiver', basis: 'Percent', pct: 50, seats: 10, budget: 200000, status: 'Open',
  criteria: { minMarks: 75, minAttendance: 85, maxIncome: 500000 },
  documents: [...COMMON_DOCS, 'Income Certificate'],
  description: 'Fee waiver for the top students by previous-year marks (committee selection).'
},
{
  id: 'NMS', name: 'National Merit Scholarship', shortName: 'National Merit', kind: 'Government', provider: 'Govt. of India', portal: 'NSP',
  mode: 'Fee Waiver', basis: 'Percent', pct: 75, status: 'Open',
  criteria: { minMarks: 60, maxIncome: 350000 },
  documents: [...COMMON_DOCS, 'Income Certificate', 'Bank Passbook'],
  description: 'Central scholarship applied through the National Scholarship Portal; approved amount is credited to the student fee.'
},
{
  id: 'NSPCASH', name: 'NSP Cash Scholarship', shortName: 'NSP-2025', kind: 'Government', provider: 'Govt. of India', portal: 'NSP',
  mode: 'Cash', basis: 'Fixed', amount: 12500, status: 'Open',
  criteria: { minMarks: 50, maxIncome: 250000 },
  documents: [...COMMON_DOCS, 'Income Certificate', 'Bank Passbook'],
  description: 'Fixed yearly cash scholarship; money received from the government is paid to the student bank account by NEFT.'
},
{
  id: 'POSTMAT', name: 'Post-Matric Scholarship (SC/ST)', shortName: 'Post-Matric SC/ST', kind: 'Government', provider: 'Govt. of Gujarat', portal: 'Digital Gujarat',
  mode: 'Fee Waiver', basis: 'Percent', pct: 75, status: 'Open',
  criteria: { categories: ['SC', 'ST'], maxIncome: 250000, minClass: 11, maxClass: 12 },
  documents: [...COMMON_DOCS, 'Caste Certificate', 'Income Certificate'],
  description: 'State scholarship for SC/ST students of classes XI–XII, credited to the student fee.'
},
{
  id: 'RTE', name: 'RTE Fee Reimbursement', shortName: 'RTE Reimbursement', kind: 'Government', provider: 'Govt. of Gujarat', portal: 'RTE Portal',
  mode: 'Fee Waiver', basis: 'Percent', pct: 100, status: 'Open',
  criteria: { rteOnly: true, maxClass: 8 },
  documents: ['Aadhar Card (Student)', 'RTE Allotment Letter', 'Income Certificate'],
  description: 'Government reimbursement of the full fee for students admitted under the RTE quota.'
},
{
  id: 'STATECASH', name: 'State Merit Scholarship (Cash)', shortName: 'State Merit Cash', kind: 'Government', provider: 'Govt. of Gujarat', portal: 'State DBT',
  mode: 'Cash', basis: 'Fixed', amount: 25000, status: 'Open',
  criteria: { minMarks: 80, minClass: 11, maxClass: 12 },
  documents: [...COMMON_DOCS, 'Bank Passbook'],
  description: 'Cash scholarship for classes XI–XII students with 80%+ marks, paid by NEFT after the government releases funds.'
},
{
  id: 'SPORTS', name: 'Sports Excellence Scholarship', shortName: 'Sports Excellence', kind: 'Internal', provider: 'School Trust',
  mode: 'Fee Waiver', basis: 'Percent', pct: 30, seats: 5, budget: 60000, status: 'Open',
  criteria: { minAttendance: 80, minSportsLevel: 'District' },
  documents: ['Aadhar Card (Student)', 'Sports Certificate'],
  description: 'Fee waiver for students representing the school at District level or above.'
},
{
  id: 'NEED', name: 'Need-Based Scholarship', shortName: 'Need-Based', kind: 'Internal', provider: 'School Trust',
  mode: 'Fee Waiver', basis: 'Fixed', amount: 12000, seats: 10, budget: 120000, status: 'Open',
  criteria: { minMarks: 50, minAttendance: 75, maxIncome: 300000 },
  documents: [...COMMON_DOCS, 'Income Certificate'],
  description: 'Fixed fee waiver for students from low-income families.'
},
{
  id: 'STAFF', name: 'Staff Ward Concession', shortName: 'Staff Ward', kind: 'Internal', provider: 'School Management',
  mode: 'Fee Waiver', basis: 'Percent', pct: 25, seats: 6, budget: 50000, status: 'Open',
  criteria: { minAttendance: 75 },
  documents: ['Aadhar Card (Student)', 'Staff Relationship Proof'],
  description: 'Concession for children of school staff.'
},
{
  id: 'MERIT24', name: 'School Merit Scholarship 2024', shortName: 'School Merit 2024', kind: 'Internal', provider: 'School Trust',
  mode: 'Fee Waiver', basis: 'Percent', pct: 50, seats: 5, budget: 100000, status: 'Closed',
  criteria: { minMarks: 75, minAttendance: 85, maxIncome: 500000 },
  documents: [...COMMON_DOCS, 'Income Certificate'],
  description: 'Previous merit cycle (awarded on 01-Jun-25).'
}];


export const schemeById = (id: string) => SCHOLARSHIP_SCHEMES.find((s) => s.id === id) as ScholarshipScheme;

// ---------------------------------------------------------------- students
type R = [string, string, number, string, 'M' | 'F', Category, number, number, number, number, SportsLevel?, boolean?];
const ROSTER: R[] = [
['S01', 'Priya Sharma', 9, 'B', 'F', 'General', 36000, 92.3, 98, 120000],
['S02', 'Rohan Gupta', 10, 'A', 'M', 'General', 38000, 91.8, 95, 200000],
['S03', 'Anita Singh', 11, 'B', 'F', 'OBC', 42000, 90.5, 96, 180000],
['S04', 'Vikram Patel', 8, 'A', 'M', 'General', 34000, 89.2, 94, 220000],
['S05', 'Sunita Roy', 9, 'A', 'F', 'SC', 36000, 88.7, 97, 150000],
['S06', 'Rahul Kumar', 10, 'A', 'M', 'OBC', 30000, 87.5, 92, 180000],
['S07', 'Meera Joshi', 12, 'A', 'F', 'General', 44000, 87.0, 93, 240000],
['S08', 'Amit Verma', 11, 'A', 'M', 'General', 42000, 86.5, 91, 300000],
['S09', 'Kavya Sharma', 8, 'B', 'F', 'General', 32000, 85.8, 95, 210000],
['S10', 'Suresh Mehta', 10, 'B', 'M', 'General', 36000, 85.5, 90, 190000],
['S11', 'Nikhil Bose', 9, 'C', 'M', 'General', 36000, 84.9, 93, 260000],
['S12', 'Pallavi Deshpande', 11, 'C', 'F', 'OBC', 42000, 84.4, 89, 280000],
['S13', 'Farah Siddiqui', 8, 'A', 'F', 'Minority', 34000, 83.8, 96, 160000],
['S14', 'Gaurav Chawla', 12, 'B', 'M', 'General', 44000, 83.2, 88, 320000],
['S15', 'Tara Menon', 10, 'C', 'F', 'General', 38000, 82.7, 94, 230000],
['S16', 'Ishaan Malhotra', 9, 'A', 'M', 'General', 36000, 88.1, 95, 250000],
['S17', 'Neel Parikh', 10, 'B', 'M', 'General', 38000, 81.5, 90, 200000],
['S18', 'Aisha Khan', 8, 'B', 'F', 'Minority', 32000, 79.8, 92, 180000],
['S19', 'Dhruv Trivedi', 11, 'A', 'M', 'General', 42000, 78.2, 87, 350000],
['S20', 'Simran Kaur', 12, 'A', 'F', 'General', 44000, 80.6, 91, 270000],
['S21', 'Yash Agarwal', 9, 'B', 'M', 'General', 36000, 76.9, 86, 400000],
['S22', 'Ritika Jain', 10, 'C', 'F', 'General', 38000, 75.4, 89, 210000],
['S23', 'Manav Solanki', 8, 'A', 'M', 'OBC', 34000, 77.3, 84, 190000],
['S24', 'Bhavna Chaudhary', 11, 'B', 'F', 'OBC', 42000, 82.1, 90, 240000],
['S25', 'Kunal Shah', 9, 'C', 'M', 'General', 36000, 80.2, 88, 300000],
['S26', 'Zara Sheikh', 10, 'A', 'F', 'Minority', 38000, 79.5, 93, 170000],
['S27', 'Harsh Rawal', 8, 'B', 'M', 'General', 32000, 71.4, 90, 210000],
['S28', 'Diya Pandya', 9, 'A', 'F', 'General', 36000, 73.8, 91, 190000],
['S29', 'Aman Bhatia', 10, 'B', 'M', 'General', 38000, 80.4, 78, 220000],
['S30', 'Sneha Dave', 11, 'C', 'F', 'General', 42000, 68.9, 88, 260000],
['S31', 'Parth Modi', 12, 'B', 'M', 'General', 44000, 76.1, 81, 310000],
['S32', 'Ira Kulkarni', 8, 'A', 'F', 'General', 34000, 74.2, 95, 150000],
['S33', 'Om Bhatt', 10, 'C', 'M', 'General', 38000, 83.9, 92, 280000],
['S34', 'Pooja Rana', 9, 'B', 'F', 'OBC', 36000, 81.2, 90, 230000],
['S35', 'Vivek Nair', 11, 'A', 'M', 'General', 42000, 79.9, 89, 260000],
['S36', 'Sita Patel', 9, 'C', 'F', 'OBC', 30000, 81.0, 92, 140000],
['S37', 'Ravi Singh', 10, 'B', 'M', 'General', 30000, 79.0, 90, 160000, 'State'],
['S38', 'Karthik Iyer', 11, 'B', 'M', 'General', 36000, 78.5, 91, 190000],
['S39', 'Anjali Gupta', 10, 'C', 'F', 'OBC', 34000, 82.0, 94, 170000],
['S40', 'Mohan Das', 9, 'A', 'M', 'SC', 32000, 74.0, 88, 120000],
['S41', 'Aditi Rao', 12, 'A', 'F', 'General', 44000, 91.0, 96, 260000],
['S42', 'Siddharth Jain', 11, 'A', 'M', 'General', 42000, 89.5, 94, 300000],
['S43', 'Mehul Patel', 12, 'B', 'M', 'OBC', 44000, 88.0, 92, 220000],
['S44', 'Kritika Singh', 11, 'B', 'F', 'General', 42000, 87.2, 95, 240000],
['S45', 'Varun Nair', 12, 'A', 'M', 'General', 44000, 86.0, 90, 280000],
['S46', 'Shruti Desai', 11, 'C', 'F', 'General', 42000, 85.4, 93, 210000],
['S47', 'Abhishek Yadav', 12, 'B', 'M', 'OBC', 44000, 84.8, 91, 190000],
['S48', 'Nandini Shah', 11, 'A', 'F', 'General', 42000, 83.6, 97, 230000],
['S49', 'Rajat Bansal', 12, 'A', 'M', 'General', 44000, 82.5, 89, 250000],
['S50', 'Kiran Desai', 11, 'C', 'M', 'SC', 36000, 72.0, 88, 150000],
['S51', 'Neha Kapoor', 12, 'C', 'F', 'ST', 32000, 70.5, 90, 130000],
['S52', 'Arjun Reddy', 11, 'B', 'M', 'SC', 40000, 76.0, 86, 180000],
['S53', 'Pooja Nair', 12, 'B', 'F', 'SC', 30000, 74.5, 92, 140000],
['S54', 'Aarav Yadav', 3, 'A', 'M', 'EWS', 24000, 78.0, 91, 90000, 'None', true],
['S55', 'Ishita Rao', 4, 'B', 'F', 'EWS', 25000, 81.0, 94, 85000, 'None', true],
['S56', 'Farhan Shaikh', 2, 'A', 'M', 'EWS', 25000, 76.0, 89, 95000, 'None', true],
['S57', 'Imran Ali', 5, 'A', 'M', 'EWS', 25000, 72.0, 90, 80000, 'None', true],
['S58', 'Kavita Rathod', 1, 'B', 'F', 'EWS', 25000, 80.0, 93, 70000, 'None', true],
['S59', 'Tanvi Shah', 10, 'A', 'F', 'General', 36000, 90.2, 96, 260000],
['S60', 'Karan Malhotra', 11, 'C', 'M', 'General', 41200, 89.1, 93, 290000],
['S61', 'Harsh Vora', 9, 'B', 'M', 'General', 30000, 88.4, 95, 210000],
['S62', 'Anjali Menon', 8, 'C', 'F', 'General', 30000, 87.9, 94, 200000],
['S63', 'Dev Chauhan', 10, 'C', 'M', 'General', 36000, 72.5, 88, 240000, 'National'],
['S64', 'Riya Thakur', 11, 'A', 'F', 'General', 42000, 70.1, 86, 260000, 'State'],
['S65', 'Aryan Das', 9, 'C', 'M', 'OBC', 35000, 68.4, 85, 230000, 'District'],
['S66', 'Sanjay Mishra', 7, 'A', 'M', 'OBC', 28000, 66.0, 90, 140000],
['S67', 'Lakshmi Iyer', 6, 'B', 'F', 'General', 26000, 71.5, 93, 110000],
['S68', 'Mohit Jain', 8, 'C', 'M', 'General', 32000, 62.8, 88, 180000],
['S69', 'Zoya Khan', 7, 'B', 'F', 'Minority', 28000, 69.2, 91, 120000],
['S70', 'Varun Bhatt', 6, 'A', 'M', 'SC', 26000, 64.5, 87, 100000],
['S71', 'Sneha Kulkarni', 9, 'C', 'F', 'OBC', 34000, 67.3, 89, 160000],
['S72', 'Aditya Kulkarni', 8, 'B', 'M', 'General', 32000, 78.0, 92, 450000],
['S73', 'Nisha Pandey', 9, 'A', 'F', 'General', 36000, 81.0, 94, 480000],
['S74', 'Om Prakash', 7, 'C', 'M', 'OBC', 28000, 74.0, 90, 420000],
['S75', 'Rohit Sinha', 11, 'B', 'M', 'General', 40000, 76.5, 88, 500000],
['S76', 'Chirag Soni', 7, 'A', 'M', 'OBC', 28000, 64.0, 88, 140000],
['S77', 'Rekha Patil', 6, 'B', 'F', 'General', 26000, 70.0, 92, 360000],
['S78', 'Tanmay Joshi', 9, 'B', 'M', 'General', 36000, 74.0, 86, 280000, 'National'],
['S79', 'Gauri Shinde', 10, 'A', 'F', 'OBC', 38000, 72.0, 90, 220000],
['S80', 'Aarohi Mehta', 5, 'A', 'F', 'General', 24000, 85.0, 95, 520000]];


const FATHERS = ['Rajesh', 'Suresh', 'Mahesh', 'Anil', 'Vijay', 'Sanjay', 'Ramesh', 'Prakash', 'Dinesh', 'Manoj', 'Ashok', 'Kishore'];
const MOTHERS = ['Sunita', 'Anita', 'Kavita', 'Rekha', 'Meena', 'Seema', 'Geeta', 'Neeta', 'Asha', 'Usha', 'Lata', 'Rupal'];
const BANKS = [
{ ifsc: 'HDFC0001234', bankName: 'HDFC Bank' },
{ ifsc: 'SBIN0005678', bankName: 'State Bank of India' },
{ ifsc: 'ICIC0002345', bankName: 'ICICI Bank' },
{ ifsc: 'BKID0007890', bankName: 'Bank of India' }];


export const SCHOLARSHIP_STUDENTS: ScholarshipStudent[] = ROSTER.map((r, i) => {
  const [id, name, cls, section, g, category, annualFee, marks, attendance, familyIncome, sports, rte] = r;
  const surname = name.split(' ').slice(-1)[0];
  const father = `${FATHERS[i % FATHERS.length]} ${surname}`;
  const bank = BANKS[i % BANKS.length];
  const dobYears = 2025 - (cls + 5);
  return {
    id, name, cls, section, category, annualFee, marks, attendance, familyIncome,
    nameHindi: name,
    gender: (g === 'M' ? 'Male' : 'Female') as 'Male' | 'Female',
    grNo: `GR-${2101 + i}`,
    admissionNo: `ADM-2025-${pad(101 + i, 3)}`,
    dateOfBirth: `${dobYears}-0${(i % 9) + 1}-15`,
    aadharNo: `XXXX-XXXX-${pad(5000 + i * 23, 4)}`,
    fatherName: father,
    fatherNameHindi: father,
    fatherOccupation: i % 3 === 0 ? 'Government Employee' : i % 3 === 1 ? 'Private Job' : 'Business',
    motherName: `${MOTHERS[(i * 5) % MOTHERS.length]} ${surname}`,
    motherNameHindi: `${MOTHERS[(i * 5) % MOTHERS.length]} ${surname}`,
    motherOccupation: i % 4 === 0 ? 'Teacher' : 'Homemaker',
    phone: `98${pad(25011000 + i * 137, 8)}`,
    parentMobile: `98${pad(25011000 + i * 137, 8)}`,
    email: `${father.toLowerCase().replace(/\s+/g, '.')}@email.com`,
    religion: category === 'Minority' ? 'Muslim' : 'Hindu',
    caste: surname,
    nationality: 'Indian',
    domicileState: 'Maharashtra',
    permanentAddress: `${100 + i}, Main Street, Sector ${i + 1}, Mumbai, Maharashtra`,
    correspondenceAddress: `${100 + i}, Main Street, Sector ${i + 1}, Mumbai, Maharashtra`,
    district: 'Mumbai Suburban',
    state: 'Maharashtra',
    pincode: '400001',
    familyMembers: 4,
    totalFamilyIncome: familyIncome,
    fatherAnnualIncome: Math.round(familyIncome * 0.85),
    motherAnnualIncome: Math.round(familyIncome * 0.15),
    isBPL: familyIncome < 150000,
    bplCardNo: familyIncome < 150000 ? `BPL-MH-2024-${pad(1000 + i, 5)}` : null,
    isEWS: familyIncome < 300000 && category !== 'SC' && category !== 'ST',
    ewsCertificateNo: familyIncome < 300000 ? `EWS/MH/2024/${pad(2000 + i, 5)}` : null,
    isSingleParent: i === 4 || i === 18,
    isOrphan: false,
    isDisabled: false,
    isMinority: category === 'Minority',
    previousYearMarks: marks,
    attendancePercentage: attendance,
    sportsLevel: sports || 'None',
    conduct: (i % 9 === 4 ? 'Good' : 'Excellent') as Conduct,
    isRTE: !!rte,
    photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff&size=200`,
    bank: {
      holder: name,
      accountNo: `5010${pad(40021000 + i * 311, 8)}`,
      branch: 'Main Branch, City',
      accountType: 'Savings Account',
      isAadharLinked: true,
      ...bank
    }
  };
});
export const studentById = (id: string) => SCHOLARSHIP_STUDENTS.find((s) => s.id === id) as ScholarshipStudent;

// ---------------------------------------------------------------- fee components & awards
const r100 = (x: number) => Math.round(x / 100) * 100;
/** Annual fee split: Tuition / Exam / Activity / Transport (₹30,000 → 20,000 / 5,000 / 3,000 / 2,000). */
export function feeComponents(annualFee: number) {
  const tuition = r100(annualFee * 2 / 3);
  const exam = r100(annualFee / 6);
  const activity = r100(annualFee / 10);
  return [
  { name: 'Tuition Fee', amount: tuition },
  { name: 'Exam Fee', amount: exam },
  { name: 'Activity Fee', amount: activity },
  { name: 'Transport Fee', amount: annualFee - tuition - exam - activity }];

}
/** Splits a waiver across the fee components in proportion (last line absorbs rounding). */
export function waiverBreakdown(annualFee: number, waiver: number) {
  const comps = feeComponents(annualFee);
  const w = Math.min(waiver, annualFee);
  let used = 0;
  return comps.map((c, i) => {
    const part = i === comps.length - 1 ? w - used : Math.round(c.amount * w / annualFee);
    used += part;
    return { ...c, waiver: part, pays: c.amount - part };
  });
}
export function defaultAward(scheme: ScholarshipScheme, annualFee: number): {pct?: number;amount: number;} {
  if (scheme.basis === 'Percent') {
    const pct = scheme.pct || 0;
    return { pct, amount: Math.round(annualFee * pct / 100) };
  }
  return { amount: scheme.amount || 0 };
}

// ---------------------------------------------------------------- evaluation (eligibility checks + score)
export interface EvalCheck {
  label: string;
  actual: string;
  required: string;
  pass: boolean;
  critical: boolean;
}
export function evaluateApplication(app: ScholarshipApplication, scheme: ScholarshipScheme, student: ScholarshipStudent) {
  const c = scheme.criteria;
  const checks: EvalCheck[] = [];
  if (c.minMarks != null) checks.push({ label: 'Academic Performance', actual: `${app.marks}%`, required: `≥ ${c.minMarks}%`, pass: app.marks >= c.minMarks, critical: true });
  if (c.minAttendance != null) checks.push({ label: 'Attendance', actual: `${app.attendance}%`, required: `≥ ${c.minAttendance}%`, pass: app.attendance >= c.minAttendance, critical: true });
  if (c.maxIncome != null) checks.push({ label: 'Annual Family Income', actual: inr(app.familyIncome), required: `≤ ${inr(c.maxIncome)}`, pass: app.familyIncome <= c.maxIncome, critical: true });
  if (c.categories) checks.push({ label: 'Category', actual: app.category, required: c.categories.join(' / '), pass: c.categories.includes(app.category), critical: true });
  if (c.minSportsLevel) checks.push({ label: 'Sports Level', actual: app.sportsLevel, required: `≥ ${c.minSportsLevel}`, pass: SPORTS_RANK[app.sportsLevel] >= SPORTS_RANK[c.minSportsLevel], critical: true });
  if (c.rteOnly) checks.push({ label: 'RTE Admission', actual: app.isRTE ? 'Yes' : 'No', required: 'Admitted under RTE', pass: app.isRTE, critical: true });
  if (c.minClass != null || c.maxClass != null) {
    const lo = c.minClass ?? 1;
    const hi = c.maxClass ?? 12;
    checks.push({ label: 'Class', actual: romanClass(student.cls), required: `${romanClass(lo)} – ${romanClass(hi)}`, pass: student.cls >= lo && student.cls <= hi, critical: true });
  }
  const missingDocs = app.documents.filter((d) => d.required && d.status !== 'Verified').map((d) => d.name);
  checks.push({ label: 'Required Documents', actual: missingDocs.length ? `${missingDocs.length} not verified` : 'All verified', required: 'All verified', pass: missingDocs.length === 0, critical: true });
  checks.push({ label: 'Conduct', actual: app.conduct, required: 'Not Poor', pass: app.conduct !== 'Poor', critical: false });
  const passCritical = checks.filter((x) => x.critical).every((x) => x.pass);
  const passAll = checks.every((x) => x.pass);
  const score = Math.round(
    25 + app.marks * 0.35 + app.attendance * 0.2 + (c.maxIncome ? Math.max(0, 20 - app.familyIncome / c.maxIncome * 20) : 10)
  );
  const tags: string[] = [];
  if (app.isRTE) tags.push('RTE');
  if (['SC', 'ST', 'EWS'].includes(app.category)) tags.push(app.category);
  if (app.familyIncome <= 150000) tags.push('Low income');
  if (SPORTS_RANK[app.sportsLevel] >= SPORTS_RANK.District) tags.push(`Sports (${app.sportsLevel})`);
  if (app.marks >= 90) tags.push('90%+ marks');
  return { checks, passCritical, passAll, missingDocs, score: Math.min(100, score), tags };
}

// ---------------------------------------------------------------- seed applications
type A = [string, string, AppStatus, string];
// [studentId, schemeId, status, appliedOn] — order defines APP numbers (the 5 NMS rows get 01/04/05/07/10)
const MERIT25_APPROVED = ['S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S07', 'S08', 'S09', 'S10', 'S11', 'S12', 'S13', 'S14', 'S15'];
const APP_SEEDS: A[] = [
['S06', 'NMS', 'Approved', '2025-07-10'],
...MERIT25_APPROVED.slice(0, 2).map((s, i): A => [s, 'MERIT25', 'Approved', `2025-05-${pad(5 + i)}`]),
['S36', 'NMS', 'Approved', '2025-07-11'],
['S37', 'NMS', 'Approved', '2025-07-12'],
[MERIT25_APPROVED[2], 'MERIT25', 'Approved', '2025-05-07'],
['S07', 'NMS', 'Approved', '2025-07-14'],
...MERIT25_APPROVED.slice(3, 5).map((s, i): A => [s, 'MERIT25', 'Approved', `2025-05-${pad(8 + i)}`]),
['S10', 'NMS', 'Approved', '2025-07-15'],
...MERIT25_APPROVED.slice(5).map((s, i): A => [s, 'MERIT25', 'Approved', `2025-05-${pad(10 + i)}`]),
...['S16', 'S17', 'S18', 'S19', 'S20', 'S21', 'S22', 'S23'].map((s, i): A => [s, 'MERIT25', 'Submitted', `2025-05-${pad(20 + i)}`]),
...['S24', 'S25', 'S26'].map((s, i): A => [s, 'MERIT25', 'Under Review', `2025-05-${pad(16 + i)}`]),
...['S27', 'S28', 'S29', 'S30', 'S31', 'S32'].map((s, i): A => [s, 'MERIT25', 'Rejected', `2025-05-${pad(12 + i)}`]),
...['S33', 'S34', 'S35'].map((s, i): A => [s, 'MERIT25', 'On Hold', `2025-05-${pad(19 + i)}`]),
...['S06', 'S07', 'S36', 'S38', 'S39', 'S40'].map((s, i): A => [s, 'NSPCASH', 'Approved', `2025-07-${pad(20 + i)}`]),
...['S41', 'S42', 'S43', 'S44', 'S45', 'S46', 'S47', 'S48', 'S49'].map((s, i): A => [s, 'STATECASH', 'Approved', `2025-08-${pad(1 + i)}`]),
...['S50', 'S51', 'S52', 'S53'].map((s, i): A => [s, 'POSTMAT', 'Approved', `2025-07-${pad(1 + i)}`]),
...['S54', 'S55', 'S56', 'S57', 'S58'].map((s, i): A => [s, 'RTE', 'Approved', `2025-06-${pad(10 + i)}`]),
...['S01', 'S59', 'S60', 'S61', 'S62'].map((s, i): A => [s, 'MERIT24', 'Awarded', `2025-04-${pad(20 + i)}`]),
...['S37', 'S63', 'S64', 'S65'].map((s, i): A => [s, 'SPORTS', 'Awarded', `2025-04-${pad(10 + i)}`]),
...['S08', 'S66', 'S67', 'S68', 'S69', 'S70', 'S71'].map((s, i): A => [s, 'NEED', 'Awarded', `2025-04-${pad(2 + i)}`]),
...['S72', 'S73', 'S74', 'S75'].map((s, i): A => [s, 'STAFF', 'Awarded', `2025-04-${pad(24 + i)}`]),
['S76', 'NEED', 'Submitted', '2025-09-18'],
['S77', 'NEED', 'Submitted', '2025-09-19'],
['S78', 'SPORTS', 'Submitted', '2025-09-20'],
['S79', 'NMS', 'Submitted', '2025-09-22'],
['S80', 'STAFF', 'Submitted', '2025-09-23']];


const addDays = (iso: string, days: number) => {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().slice(0, 10);
};

// Government portal tracking + internal award seeds
const TRACKING: Record<string, GovtTracking> = {
  'S06|NMS': { status: 'Disbursed', portalRef: 'NSP-2025-001234', submittedOn: '2025-07-20', decisionOn: '2025-08-25', amountApproved: 22500 },
  'S36|NMS': { status: 'Pending', portalRef: 'NSP-2025-001235', submittedOn: '2025-07-22' },
  'S37|NMS': { status: 'Rejected', portalRef: 'NSP-2025-001236', submittedOn: '2025-07-22', decisionOn: '2025-08-28', rejectReason: 'Income certificate not verified by the district officer' },
  'S07|NMS': { status: 'Approved', portalRef: 'NSP-2025-001237', submittedOn: '2025-07-24', decisionOn: '2025-09-02', amountApproved: 33000 },
  'S10|NMS': { status: 'To Submit' }
};
const DONE_GOVT = new Set(['S06|NSPCASH', 'S07|NSPCASH', 'S38|NSPCASH', 'S39|NSPCASH', 'S41|STATECASH', 'S42|STATECASH', 'S43|STATECASH',
'S44|STATECASH', 'S45|STATECASH', 'S46|STATECASH', 'S47|STATECASH', 'S48|STATECASH', 'S50|POSTMAT', 'S51|POSTMAT', 'S52|POSTMAT', 'S53|POSTMAT',
'S54|RTE', 'S55|RTE', 'S56|RTE']);
const PORTAL_PREFIX: Record<string, string> = { NSPCASH: 'NSP-2025-0021', STATECASH: 'SDBT-2025-00', POSTMAT: 'DG-2025-100', RTE: 'RTE-2025-50' };
const AWARD_OVERRIDE: Record<string, number> = { 'S01|MERIT24': 15000, 'S54|RTE': 24000 };

function buildSeedApplications(): ScholarshipApplication[] {
  const nmsNumbers = [1, 4, 5, 7, 10];
  let nmsIdx = 0;
  let next = 1;
  const used = new Set(nmsNumbers);
  const govtCounter: Record<string, number> = {};
  return APP_SEEDS.map(([studentId, schemeId, status, appliedOn], idx) => {
    const st = studentById(studentId);
    const scheme = schemeById(schemeId);
    const key = `${studentId}|${schemeId}`;
    let num: number;
    if (schemeId === 'NMS' && idx < 10) num = nmsNumbers[nmsIdx++];else
    {
      while (used.has(next)) next++;
      num = next++;
    }
    const award = defaultAward(scheme, st.annualFee);
    const amount = AWARD_OVERRIDE[key] ?? award.amount;
    const decided = ['Approved', 'Rejected', 'Awarded', 'On Hold'].includes(status);
    const docs: AppDocument[] = scheme.documents.map((name, di) => ({
      name,
      required: true,
      status:
      status === 'Submitted' ? 'Received' :
      status === 'On Hold' && di === scheme.documents.length - 1 ? 'Pending' :
      status === 'Under Review' && di === 0 ? 'Received' :
      'Verified'
    }));
    const app: ScholarshipApplication = {
      id: `APP${pad(num, 3)}`,
      appNo: `APP-2025-${pad(num)}`,
      studentId,
      schemeId,
      ay: ACADEMIC_YEAR,
      appliedOn,
      submittedBy: idx % 3 === 0 ? 'Parent Portal' : 'School Office',
      marks: st.marks,
      attendance: st.attendance,
      familyIncome: st.familyIncome,
      category: st.category,
      sportsLevel: st.sportsLevel,
      conduct: st.conduct,
      isRTE: st.isRTE,
      requestedAmount: amount,
      requestedPct: award.pct,
      bank: scheme.mode === 'Cash' ? { ...st.bank } : undefined,
      documents: docs,
      status,
      history: [{ on: appliedOn, by: idx % 3 === 0 ? 'Parent Portal' : 'School Office', action: 'Application submitted' }]
    };
    if (decided) {
      const ev = evaluateApplication(app, scheme, st);
      const decision: Decision = status === 'Rejected' ? 'Reject' : status === 'On Hold' ? 'Hold' : 'Approve';
      const failed = ev.checks.filter((c) => !c.pass).map((c) => `${c.label} ${c.actual} (required ${c.required})`);
      app.evaluation = {
        score: ev.score,
        passCritical: ev.passCritical,
        decision,
        reason: decision === 'Reject' ? `Not eligible: ${failed.join('; ') || 'criteria not met'}` : decision === 'Hold' ? 'Income certificate pending verification' : undefined,
        followUp: decision === 'Hold' ? '2025-06-15' : undefined,
        remarks: decision === 'Approve' ? 'Meets all eligibility criteria.' : '',
        sanctionPct: decision === 'Approve' ? award.pct : undefined,
        sanctionAmount: decision === 'Approve' ? amount : undefined,
        evaluatedBy: 'Scholarship Committee',
        evaluatedOn: addDays(appliedOn, 8)
      };
      app.history.push({ on: addDays(appliedOn, 8), by: 'Scholarship Committee', action: decision === 'Approve' ? 'Evaluated — approved' : decision === 'Reject' ? 'Evaluated — rejected' : 'Evaluated — put on hold' });
    }
    if (status === 'Under Review') app.history.push({ on: addDays(appliedOn, 3), by: 'Scholarship Committee', action: 'Evaluation started' });
    if (scheme.kind === 'Government' && status === 'Approved') {
      const seeded = TRACKING[key];
      if (seeded) app.tracking = { ...seeded };else
      {
        govtCounter[schemeId] = (govtCounter[schemeId] || 0) + 1;
        const done = DONE_GOVT.has(key);
        app.tracking = {
          status: done ? 'Disbursed' : 'Approved',
          portalRef: `${PORTAL_PREFIX[schemeId]}${pad(govtCounter[schemeId], 2)}`,
          submittedOn: addDays(appliedOn, 5),
          decisionOn: addDays(appliedOn, 30),
          amountApproved: amount
        };
      }
    }
    if (status === 'Awarded') {
      app.award = { pct: award.pct, amount, awardedOn: '2025-06-01', by: 'Principal — Mr. Sharma' };
      app.history.push({ on: '2025-06-01', by: 'Principal — Mr. Sharma', action: `Scholarship awarded (${inr(amount)})` });
    }
    return app;
  });
}

// ---------------------------------------------------------------- seed disbursements (AY 2025-26)
type D = [string, string, 'Done' | 'Pending', string | null, number?];
// [studentId, schemeId, status, appliedOn, amount override]; first 6 rows = the sample in the page spec
const DISB_SEEDS: D[] = [
['S06', 'NMS', 'Done', '2025-09-15'],
['S01', 'MERIT24', 'Done', '2025-06-01', 15000],
['S37', 'SPORTS', 'Done', '2025-06-01'],
['S07', 'NSPCASH', 'Done', '2025-09-20'],
['S36', 'NMS', 'Pending', null],
['S08', 'NEED', 'Done', '2025-06-01'],
['S06', 'NSPCASH', 'Done', '2025-09-20'],
['S38', 'NSPCASH', 'Done', '2025-09-20'],
['S39', 'NSPCASH', 'Done', '2025-09-20'],
['S36', 'NSPCASH', 'Pending', null],
['S40', 'NSPCASH', 'Pending', null],
['S07', 'NMS', 'Pending', null],
...['S41', 'S42', 'S43', 'S44', 'S45', 'S46', 'S47', 'S48'].map((s): D => [s, 'STATECASH', 'Done', '2025-09-25']),
['S49', 'STATECASH', 'Pending', null],
...['S50', 'S51', 'S52', 'S53'].map((s): D => [s, 'POSTMAT', 'Done', '2025-09-10']),
['S54', 'RTE', 'Done', '2025-08-30', 24000],
['S55', 'RTE', 'Done', '2025-08-30'],
['S56', 'RTE', 'Done', '2025-08-30'],
['S57', 'RTE', 'Pending', null],
['S58', 'RTE', 'Pending', null],
['S59', 'MERIT24', 'Done', '2025-06-01'],
['S60', 'MERIT24', 'Done', '2025-06-01'],
['S61', 'MERIT24', 'Pending', null],
['S62', 'MERIT24', 'Pending', null],
['S63', 'SPORTS', 'Done', '2025-06-01'],
['S64', 'SPORTS', 'Done', '2025-06-01'],
['S65', 'SPORTS', 'Pending', null],
...['S66', 'S67', 'S68', 'S69'].map((s): D => [s, 'NEED', 'Done', '2025-06-01']),
['S70', 'NEED', 'Pending', null],
['S71', 'NEED', 'Pending', null],
['S72', 'STAFF', 'Done', '2025-06-01'],
['S73', 'STAFF', 'Done', '2025-06-01'],
['S74', 'STAFF', 'Done', '2025-06-01'],
['S75', 'STAFF', 'Pending', null]];


function buildSeedDisbursements(apps: ScholarshipApplication[]): Disbursement[] {
  let voucher = 1;
  return DISB_SEEDS.map(([studentId, schemeId, status, appliedOn, override], i) => {
    const scheme = schemeById(schemeId);
    const st = studentById(studentId);
    const app = apps.find((a) => a.studentId === studentId && a.schemeId === schemeId) || null;
    const award = defaultAward(scheme, st.annualFee);
    const amount = override ?? (app?.tracking?.amountApproved || app?.award?.amount || award.amount);
    const done = status === 'Done';
    const govt = scheme.kind === 'Government';
    return {
      id: `DSB${pad(i + 1, 3)}`,
      voucherNo: done ? `SD-2025-${pad(voucher++, 4)}` : undefined,
      appId: app ? app.id : null,
      studentId,
      schemeId,
      mode: scheme.mode,
      amount,
      pct: scheme.mode === 'Fee Waiver' ? Math.round(amount / st.annualFee * 1000) / 10 : undefined,
      status,
      appliedOn,
      schedule: done && scheme.mode === 'Fee Waiver' ? 'Full Year' : undefined,
      paymentMethod: scheme.mode === 'Cash' ? 'Bank NEFT' : undefined,
      reference: done && scheme.mode === 'Cash' ? `UTR${pad(2509200001 + i, 10)}` : undefined,
      fundsReceived: govt && done,
      fundsReceivedOn: govt && done ? appliedOn || undefined : undefined,
      processedBy: done ? 'Accounts — Priya Gupta' : undefined
    } as Disbursement;
  });
}

// ---------------------------------------------------------------- store
interface ScholarshipStoreShape {
  applications: ScholarshipApplication[];
  disbursements: Disbursement[];
  selections: Record<string, SelectionState>;
  nextAppNo: number;
  nextVoucher: number;
}

const seedApps = buildSeedApplications();
const seedDisb = buildSeedDisbursements(seedApps);

const blankSelection = (scheme: ScholarshipScheme): SelectionState => ({
  status: 'Draft',
  initialized: false,
  standardPct: scheme.pct || 0,
  standardAmount: scheme.amount || 0,
  selectedIds: [],
  manualIds: [],
  customPct: {},
  customAmount: {},
  remarks: {},
  reviewer: 'Finance Manager — Priya Gupta',
  reviewed: true,
  approver: 'Principal — Mr. Sharma',
  approval: 'Not Sent'
});

function seedSelections(apps: ScholarshipApplication[]): Record<string, SelectionState> {
  const out: Record<string, SelectionState> = {};
  SCHOLARSHIP_SCHEMES.filter((s) => s.kind === 'Internal').forEach((scheme) => {
    const sel = blankSelection(scheme);
    const awarded = apps.filter((a) => a.schemeId === scheme.id && a.status === 'Awarded');
    if (awarded.length) {
      sel.status = 'Awarded';
      sel.initialized = true;
      sel.selectedIds = awarded.map((a) => a.id);
      sel.approval = 'Approved';
      sel.awardedOn = '2025-06-01';
      sel.notifiedOn = '2025-06-02';
      awarded.forEach((a) => {
        if (scheme.basis === 'Percent') sel.customPct[a.id] = a.award?.pct ?? scheme.pct ?? 0;else
        sel.customAmount[a.id] = a.award?.amount ?? scheme.amount ?? 0;
      });
    }
    out[scheme.id] = sel;
  });
  return out;
}

export const scholarshipStore: ScholarshipStoreShape = {
  applications: seedApps,
  disbursements: seedDisb,
  selections: seedSelections(seedApps),
  nextAppNo: seedApps.length + 1,
  nextVoucher: seedDisb.filter((d) => d.voucherNo).length + 1
};

export const getApplications = () => scholarshipStore.applications;
export const setApplications = (list: ScholarshipApplication[]) => {scholarshipStore.applications = list;};
export const getDisbursements = () => scholarshipStore.disbursements;
export const setDisbursements = (list: Disbursement[]) => {scholarshipStore.disbursements = list;};
export const getSelection = (schemeId: string) => scholarshipStore.selections[schemeId];
export const setSelection = (schemeId: string, sel: SelectionState) => {scholarshipStore.selections = { ...scholarshipStore.selections, [schemeId]: sel };};
export const nextApplicationNo = () => {
  const n = scholarshipStore.nextAppNo++;
  return { id: `APP${pad(n, 3)}`, appNo: `APP-2025-${pad(n)}` };
};
export const nextVoucherNo = () => `SD-2025-${pad(scholarshipStore.nextVoucher++, 4)}`;

/** Creates (or updates the amount of) the pending disbursement for an awarded / govt-approved application. */
export function upsertPendingDisbursement(app: ScholarshipApplication, amount: number, pct?: number): Disbursement {
  const scheme = schemeById(app.schemeId);
  const list = scholarshipStore.disbursements;
  const existing = list.find((d) => d.appId === app.id && d.status === 'Pending') ||
  list.find((d) => d.appId === null && d.status === 'Pending' && d.studentId === app.studentId && d.schemeId === app.schemeId);
  if (existing) {
    const updated = { ...existing, appId: app.id, amount, pct };
    scholarshipStore.disbursements = list.map((d) => d.id === existing.id ? updated : d);
    return updated;
  }
  const rec: Disbursement = {
    id: `DSB${Date.now()}${Math.floor(Math.random() * 1000)}`,
    appId: app.id,
    studentId: app.studentId,
    schemeId: app.schemeId,
    mode: scheme.mode,
    amount,
    pct,
    status: 'Pending',
    appliedOn: null,
    paymentMethod: scheme.mode === 'Cash' ? 'Bank NEFT' : undefined,
    fundsReceived: false
  };
  scholarshipStore.disbursements = [...list, rec];
  return rec;
}

/** Marks the government tracking of an application as Disbursed (called when the disbursement is processed). */
export function markTrackingDisbursed(appId: string | null, on: string) {
  if (!appId) return;
  scholarshipStore.applications = scholarshipStore.applications.map((a) =>
  a.id === appId && a.tracking ?
  { ...a, tracking: { ...a.tracking, status: 'Disbursed' }, history: [...a.history, { on, by: 'Accounts', action: 'Government scholarship disbursed' }] } :
  a
  );
}

// ---------------------------------------------------------------- journal entries
export interface JournalLine {
  account: string;
  debit: number;
  credit: number;
}
export interface JournalEntry {
  title: string;
  note: string;
  lines: JournalLine[];
  alreadyPosted?: boolean;
}
export function waiverJournal(scheme: ScholarshipScheme, amount: number, fundsReceived: boolean): JournalEntry[] {
  if (scheme.kind === 'Government') {
    return [
    {
      title: 'Step 1 — Money received from Govt.',
      note: 'money from govt.',
      alreadyPosted: fundsReceived,
      lines: [
      { account: 'Bank Account', debit: amount, credit: 0 },
      { account: 'Govt. Scholarship Income', debit: 0, credit: amount }]

    },
    {
      title: 'Step 2 — Applied to student fee',
      note: 'applied to student fee',
      lines: [
      { account: 'Govt. Scholarship Income', debit: amount, credit: 0 },
      { account: 'Student Fee Receivable A/c', debit: 0, credit: amount }]

    }];

  }
  return [
  {
    title: 'Internal scholarship',
    note: 'school funds used',
    lines: [
    { account: 'Scholarship Expense A/c', debit: amount, credit: 0 },
    { account: 'Student Fee Receivable A/c', debit: 0, credit: amount }]

  }];

}
export function cashJournal(amount: number, fundsReceived: boolean): JournalEntry[] {
  return [
  {
    title: 'Step 1 — Money received FROM Govt.',
    note: 'total received from govt.',
    alreadyPosted: fundsReceived,
    lines: [
    { account: 'Bank Account', debit: amount, credit: 0 },
    { account: 'Govt. Scholarship Payable', debit: 0, credit: amount }]

  },
  {
    title: 'Step 2 — Money disbursed TO students (NEFT to their bank)',
    note: 'paid to students',
    lines: [
    { account: 'Govt. Scholarship Payable', debit: amount, credit: 0 },
    { account: 'Bank Account', debit: 0, credit: amount }]

  }];

}

// ---------------------------------------------------------------- print / download / csv
const ESC: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (v: unknown) => String(v ?? '').replace(/[&<>"']/g, (ch) => ESC[ch]);
export const SCHOOL_NAME = 'ABC International School';
const DOC_STYLE = `body{font-family:Arial,Helvetica,sans-serif;color:#111827;margin:24px}
.doc{max-width:1000px;margin:0 auto}
.hd{text-align:center;border-bottom:2px solid #1d4ed8;padding-bottom:10px;margin-bottom:14px}
.hd h1{margin:0;font-size:20px;color:#1e3a8a}.hd p{margin:4px 0 0;font-size:12px;color:#6b7280}
table{width:100%;border-collapse:collapse;font-size:12px;margin:8px 0}
th,td{border:1px solid #e5e7eb;padding:6px 8px;text-align:left}th{background:#f3f4f6}.num{text-align:right}
.tot td{font-weight:bold;background:#eff6ff}.meta{font-size:12px;margin:6px 0;color:#374151}
.sig{display:flex;justify-content:space-between;margin-top:48px;font-size:12px}
@media print{body{margin:0}}`;
export const htmlDoc = (title: string, subtitle: string, body: string) =>
`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${esc(title)}</title><style>${DOC_STYLE}</style></head><body><div class="doc"><div class="hd"><h1>${SCHOOL_NAME}</h1><p>${esc(subtitle)}</p></div>${body}</div></body></html>`;
export const htmlTable = (headers: string[], rows: (string | number)[][], totalRow?: (string | number)[]) =>
`<table><thead><tr>${headers.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.
map((r) => `<tr>${r.map((c) => `<td${typeof c === 'number' ? ' class="num"' : ''}>${esc(typeof c === 'number' ? inr(c) : c)}</td>`).join('')}</tr>`).
join('')}${totalRow ? `<tr class="tot">${totalRow.map((c) => `<td${typeof c === 'number' ? ' class="num"' : ''}>${esc(typeof c === 'number' ? inr(c) : c)}</td>`).join('')}</tr>` : ''}</tbody></table>`;

/** Prints only the given document (hidden iframe). */
export function printHtml(html: string) {
  document.querySelectorAll('iframe[data-print-frame]').forEach((f) => f.remove());
  const frame = document.createElement('iframe');
  frame.setAttribute('data-print-frame', 'true');
  frame.setAttribute('aria-hidden', 'true');
  frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
  document.body.appendChild(frame);
  const win = frame.contentWindow;
  if (!win) return;
  win.document.open();
  win.document.write(html);
  win.document.close();
  setTimeout(() => {
    win.focus();
    win.print();
  }, 300);
}
export function downloadText(fileName: string, content: string, type = 'text/csv;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
const csvCell = (v: unknown) => {
  const t = String(v ?? '');
  return /[",\n\r]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
};
export const toCsv = (rows: unknown[][]) => rows.map((r) => r.map(csvCell).join(',')).join('\n');


// ============================================================================
// SCHOLARSHIP DOCUMENTS & RECEIPTS DATA MODEL & STORE
// ============================================================================

export type ScholarshipDocType =
  | 'Sanction Letter'
  | 'Verification Letter'
  | 'Fee Waiver Receipt'
  | 'Scholarship Certificate'
  | 'Govt. Sanction Order'
  | 'Govt. Certificate'
  | 'Bank DBT Receipt';

export type ScholarshipDocStatus =
  | 'Sent to Parent'
  | 'Uploaded'
  | 'Downloaded by Parent'
  | 'Not Sent'
  | 'Not Generated'
  | 'Pending';

export type DeliveryMode = 'Email' | 'SMS' | 'Portal Download' | 'Physical Copy' | 'Not Sent';

export interface ScholarshipDocument {
  id: string;
  docNo: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  appNo: string;
  schemeId: string;
  schemeName: string;
  type: 'Internal' | 'Government';
  docType: ScholarshipDocType;
  generatedOn: string; // ISO datetime or formatted date
  status: ScholarshipDocStatus;
  deliveryMode: DeliveryMode;
  sentDate?: string;
  downloadedDate?: string;
  amount?: number;
  waiverPct?: number;
  validFrom?: string;
  validUntil?: string;
  letterNo?: string;
  receiptNo?: string;
  certificateNo?: string;
  journalRef?: string;
  signedBy?: string;
  coSignedBy?: string;
  template?: string;
  includeLetterhead?: boolean;
  includeSeal?: boolean;
  includeSignature?: boolean;
  termsConditions?: boolean;
  notes?: string;
  // Govt specific details
  nspRefNo?: string;
  govtSanctionNo?: string;
  govtApprovalDate?: string;
  issuingAuthority?: string;
  dbtTransferInfo?: string;
  uploadedFileName?: string;
  fileSize?: string;
}

export const INITIAL_SCHOLARSHIP_DOCUMENTS: ScholarshipDocument[] = [
  {
    id: 'DOC-001',
    docNo: 'DOC-2025-001',
    studentId: 'STU001',
    studentName: 'Priya Sharma',
    studentClass: 'IX - B',
    appNo: 'APP-2025-002',
    schemeId: 'SMS',
    schemeName: 'School Merit Scholarship 2025',
    type: 'Internal',
    docType: 'Sanction Letter',
    generatedOn: '2025-06-10 09:30 AM',
    status: 'Sent to Parent',
    deliveryMode: 'Email',
    sentDate: '10-Jun-2025 09:35 AM',
    downloadedDate: '11-Jun-2025 02:30 PM',
    amount: 15000,
    waiverPct: 50,
    validFrom: 'April 2025',
    validUntil: 'March 2026',
    letterNo: 'XYZ/SCH/INT/2025-26/001',
    signedBy: 'Principal — Mr. A. Sharma',
    coSignedBy: 'Finance Manager — Mrs. P. Gupta'
  },
  {
    id: 'DOC-002',
    docNo: 'DOC-2025-002',
    studentId: 'STU001',
    studentName: 'Priya Sharma',
    studentClass: 'IX - B',
    appNo: 'APP-2025-002',
    schemeId: 'SMS',
    schemeName: 'School Merit Scholarship 2025',
    type: 'Internal',
    docType: 'Fee Waiver Receipt',
    generatedOn: '2025-07-01 10:00 AM',
    status: 'Sent to Parent',
    deliveryMode: 'Email',
    sentDate: '01-Jul-2025 10:05 AM',
    downloadedDate: '02-Jul-2025 11:20 AM',
    amount: 15000,
    waiverPct: 50,
    receiptNo: 'SCH-REC-2025-001',
    letterNo: 'XYZ/SCH/INT/2025-26/001',
    journalRef: 'JV-2025-045'
  },
  {
    id: 'DOC-003',
    docNo: 'DOC-2025-003',
    studentId: 'STU001',
    studentName: 'Priya Sharma',
    studentClass: 'IX - B',
    appNo: 'APP-2025-002',
    schemeId: 'SMS',
    schemeName: 'School Merit Scholarship 2025',
    type: 'Internal',
    docType: 'Scholarship Certificate',
    generatedOn: '2025-07-01 11:00 AM',
    status: 'Sent to Parent',
    deliveryMode: 'Portal Download',
    sentDate: '01-Jul-2025 11:10 AM',
    downloadedDate: '03-Jul-2025 04:15 PM',
    amount: 15000,
    certificateNo: 'XYZ/SCH/CERT/2025-26/001',
    template: 'Standard',
    signedBy: 'Principal — Mr. A. Sharma'
  },
  {
    id: 'DOC-004',
    docNo: 'DOC-2025-004',
    studentId: 'STU002',
    studentName: 'Rahul Kumar',
    studentClass: 'X - A',
    appNo: 'APP-2025-004',
    schemeId: 'NMS',
    schemeName: 'National Merit Scholarship (NSP)',
    type: 'Government',
    docType: 'Verification Letter',
    generatedOn: '2025-06-15 09:00 AM',
    status: 'Sent to Parent',
    deliveryMode: 'Email',
    sentDate: '15-Jun-2025 09:15 AM',
    downloadedDate: '16-Jun-2025 10:00 AM',
    nspRefNo: 'NSP-2025-OBC-78901234',
    signedBy: 'Principal — Mr. A. Sharma'
  },
  {
    id: 'DOC-005',
    docNo: 'DOC-2025-005',
    studentId: 'STU002',
    studentName: 'Rahul Kumar',
    studentClass: 'X - A',
    appNo: 'APP-2025-004',
    schemeId: 'NMS',
    schemeName: 'National Merit Scholarship (NSP)',
    type: 'Government',
    docType: 'Fee Waiver Receipt',
    generatedOn: '2025-09-20 02:00 PM',
    status: 'Sent to Parent',
    deliveryMode: 'Email',
    sentDate: '20-Sep-2025 02:10 PM',
    amount: 22500,
    nspRefNo: 'NSP-2025-OBC-78901234',
    govtSanctionNo: 'MSJE/NSP/OBC/2025-26/44812',
    receiptNo: 'SCH-REC-2025-004',
    journalRef: 'JV-2025-112',
    dbtTransferInfo: 'Cash component paid directly by Govt. via DBT'
  },
  {
    id: 'DOC-006',
    docNo: 'DOC-2025-006',
    studentId: 'STU002',
    studentName: 'Rahul Kumar',
    studentClass: 'X - A',
    appNo: 'APP-2025-004',
    schemeId: 'NMS',
    schemeName: 'National Merit Scholarship (NSP)',
    type: 'Government',
    docType: 'Govt. Sanction Order',
    generatedOn: '2025-09-06 11:30 AM',
    status: 'Uploaded',
    deliveryMode: 'Portal Download',
    uploadedFileName: 'Rahul_Kumar_NSP_Sanction_Order.pdf',
    fileSize: '1.4 MB',
    amount: 28500,
    nspRefNo: 'NSP-2025-OBC-78901234',
    govtSanctionNo: 'MSJE/NSP/OBC/2025-26/44812',
    govtApprovalDate: '05-Sep-2025',
    issuingAuthority: 'Ministry of Social Justice & Empowerment'
  },
  {
    id: 'DOC-007',
    docNo: 'DOC-2025-007',
    studentId: 'STU002',
    studentName: 'Rahul Kumar',
    studentClass: 'X - A',
    appNo: 'APP-2025-004',
    schemeId: 'NMS',
    schemeName: 'National Merit Scholarship (NSP)',
    type: 'Government',
    docType: 'Govt. Certificate',
    generatedOn: '2025-09-06',
    status: 'Pending',
    deliveryMode: 'Not Sent',
    nspRefNo: 'NSP-2025-OBC-78901234',
    notes: 'Awaiting generation from central NSP portal'
  },
  {
    id: 'DOC-008',
    docNo: 'DOC-2025-008',
    studentId: 'STU003',
    studentName: 'Meera Joshi',
    studentClass: 'VIII - C',
    appNo: 'APP-2025-008',
    schemeId: 'NBS',
    schemeName: 'Need-Based Fee Assistance',
    type: 'Internal',
    docType: 'Sanction Letter',
    generatedOn: '2025-06-12 10:00 AM',
    status: 'Not Sent',
    deliveryMode: 'Not Sent',
    amount: 12000,
    waiverPct: 40,
    validFrom: 'April 2025',
    validUntil: 'March 2026',
    letterNo: 'XYZ/SCH/INT/2025-26/008',
    signedBy: 'Principal — Mr. A. Sharma'
  },
  {
    id: 'DOC-009',
    docNo: 'DOC-2025-009',
    studentId: 'STU004',
    studentName: 'Sita Patel',
    studentClass: 'XI - A',
    appNo: 'APP-2025-015',
    schemeId: 'PMS',
    schemeName: 'PM Yasasvi Scholarship Scheme',
    type: 'Government',
    docType: 'Verification Letter',
    generatedOn: '—',
    status: 'Not Generated',
    deliveryMode: 'Not Sent',
    nspRefNo: 'NSP-2025-EBC-55219081'
  },
  {
    id: 'DOC-010',
    docNo: 'DOC-2025-010',
    studentId: 'STU005',
    studentName: 'Ravi Singh',
    studentClass: 'XII - B',
    appNo: 'APP-2025-021',
    schemeId: 'SPS',
    schemeName: 'Sports Excellence Grant',
    type: 'Internal',
    docType: 'Scholarship Certificate',
    generatedOn: '2025-07-15 03:00 PM',
    status: 'Downloaded by Parent',
    deliveryMode: 'Portal Download',
    sentDate: '15-Jul-2025 03:15 PM',
    downloadedDate: '16-Jul-2025 09:40 AM',
    amount: 25000,
    certificateNo: 'XYZ/SCH/CERT/2025-26/005',
    template: 'Sports',
    signedBy: 'Principal — Mr. A. Sharma'
  }
];

export const getScholarshipDocuments = (): ScholarshipDocument[] => {
  try {
    const raw = localStorage.getItem('scholarship_documents_v1');
    if (!raw) {
      localStorage.setItem('scholarship_documents_v1', JSON.stringify(INITIAL_SCHOLARSHIP_DOCUMENTS));
      return INITIAL_SCHOLARSHIP_DOCUMENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SCHOLARSHIP_DOCUMENTS;
  }
};

export const setScholarshipDocuments = (docs: ScholarshipDocument[]) => {
  try {
    localStorage.setItem('scholarship_documents_v1', JSON.stringify(docs));
  } catch (err) {
    console.error('Failed to save scholarship documents', err);
  }
};
