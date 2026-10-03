import React, { useState } from 'react';
import {
  Heart,
  Activity,
  FileText,
  Search,
  AlertTriangle,
  Shield,
  Pill,
  Syringe,
  Stethoscope,
  ClipboardList,
  Calendar,
  User,
  Phone,
  Upload,
  Plus,
  Eye,
  Edit,
  Clock,
  CheckCircle,
  XCircle,
  Download } from
'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Tabs } from '../../../components/ui/Tabs';
import { Modal } from '../../../components/ui/Modal';
// Simple inline file upload placeholder since FileUpload component doesn't exist
const FileUpload = () =>
<div className="flex items-center justify-center w-full">
    <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="flex flex-col items-center justify-center pt-2 pb-2">
        <Upload className="w-5 h-5 mb-1 text-gray-400" />
        <p className="text-xs text-gray-500">Click to upload</p>
      </div>
      <input type="file" className="hidden" />
    </label>
  </div>;

// Mock Data
const MOCK_STUDENTS = [
{
  id: 1,
  name: 'Aarav Patel',
  grNo: 'GR-001',
  class: '10-A',
  rollNo: 12,
  status: 'Active',
  photo: '',
  hasAllergy: true,
  onMedication: true,
  hasHealthPlan: true
},
{
  id: 2,
  name: 'Zara Khan',
  grNo: 'GR-002',
  class: '9-B',
  rollNo: 45,
  status: 'Active',
  photo: '',
  hasAllergy: false,
  onMedication: false,
  hasHealthPlan: false
},
{
  id: 3,
  name: 'Rohan Verma',
  grNo: 'GR-003',
  class: '12-A',
  rollNo: 32,
  status: 'Active',
  photo: '',
  hasAllergy: true,
  onMedication: false,
  hasHealthPlan: true
}];

const SELECTED_STUDENT = {
  name: 'Aarav Patel',
  grNo: 'GR-001',
  suId: 'SU-2024-001',
  class: '10-A',
  section: 'A',
  rollNo: 12,
  bloodGroup: 'O+',
  photo: '',
  criticalAlerts: ['Severe peanut allergy', 'Asthma - inhaler required'],
  emergencyContact: {
    name: 'Vikram Patel',
    phone: '9876543210',
    relation: 'Father'
  },
  lastUpdated: '2024-03-15 10:30 AM',
  responsibleStaff: 'Nurse Sharma',
  basicHealth: {
    height: 165,
    weight: 55,
    bmi: 20.2,
    measuredDate: '2024-02-15',
    visionLeft: '6/6',
    visionRight: '6/9',
    hearing: 'Normal',
    dental: 'Good',
    fitnessLevel: 'Fit for all sports',
    disabilities: 'None',
    remarks: 'Healthy student with controlled asthma'
  }
};
const CONDITIONS_ALLERGIES = [
{
  id: 1,
  type: 'Allergy',
  name: 'Peanut Allergy',
  severity: 'Life-threatening',
  triggers: 'Peanuts, peanut oil, peanut butter',
  symptoms: 'Anaphylaxis, swelling, difficulty breathing',
  precautions: 'Avoid all peanut products, carry EpiPen',
  emergency: 'Administer EpiPen, call emergency services',
  diagnosedDate: '2018-05-10',
  doctor: 'Dr. Sharma',
  active: true
},
{
  id: 2,
  type: 'Chronic',
  name: 'Asthma',
  severity: 'Moderate',
  triggers: 'Dust, cold air, exercise',
  symptoms: 'Wheezing, shortness of breath, coughing',
  precautions: 'Carry inhaler, avoid dusty areas',
  emergency: 'Use inhaler, sit upright, call nurse',
  diagnosedDate: '2019-03-15',
  doctor: 'Dr. Gupta',
  active: true
}];

const MEDICATIONS = [
{
  id: 1,
  name: 'Salbutamol Inhaler',
  purpose: 'Asthma relief',
  dosage: '2 puffs',
  form: 'Inhaler',
  schedule: 'As needed',
  startDate: '2019-03-15',
  storage: 'Room temperature',
  sideEffects: 'Tremors, rapid heartbeat',
  administeredBy: 'Self / Nurse',
  consent: 'Yes',
  stockInSchool: true,
  quantity: 2,
  expiry: '2025-06-30',
  active: true
},
{
  id: 2,
  name: 'Cetirizine',
  purpose: 'Allergy prevention',
  dosage: '10mg',
  form: 'Tablet',
  schedule: 'Daily morning',
  startDate: '2024-01-01',
  storage: 'Room temperature',
  sideEffects: 'Drowsiness',
  administeredBy: 'Nurse',
  consent: 'Yes',
  stockInSchool: true,
  quantity: 30,
  expiry: '2025-12-31',
  active: true
}];

const MEDICATION_LOG = [
{
  date: '2024-03-15 11:30 AM',
  medication: 'Salbutamol Inhaler',
  dose: '2 puffs',
  administeredBy: 'Nurse Sharma',
  reason: 'Breathing difficulty after PE',
  reaction: 'Improved within 10 mins',
  parentInformed: 'Yes'
},
{
  date: '2024-03-14 08:00 AM',
  medication: 'Cetirizine',
  dose: '10mg',
  administeredBy: 'Nurse Sharma',
  reason: 'Scheduled',
  reaction: 'Normal',
  parentInformed: 'No'
}];

const VACCINATIONS = [
{
  vaccine: 'Tetanus (TT)',
  dose: 'Booster',
  date: '2024-01-10',
  place: 'School',
  batchNo: 'TT-2024-001',
  nextDue: '2029-01-10',
  proof: 'Uploaded'
},
{
  vaccine: 'Hepatitis B',
  dose: '3/3',
  date: '2020-06-15',
  place: 'Private Hospital',
  batchNo: 'HB-2020-123',
  nextDue: 'Complete',
  proof: 'Uploaded'
}];

const HEALTH_VISITS = [
{
  date: '2024-03-15 11:15 AM',
  location: 'Playground',
  reason: 'Breathing difficulty',
  vitals: 'Temp: 98.4°F, Pulse: 92',
  assessment: 'Mild asthma attack',
  treatment: 'Inhaler administered, rest for 30 mins',
  duration: '45 mins',
  outcome: 'Returned to class',
  parentNotified: 'Yes',
  followUp: 'Monitor during PE'
},
{
  date: '2024-02-20 02:30 PM',
  location: 'Classroom',
  reason: 'Headache',
  vitals: 'Temp: 99.1°F',
  assessment: 'Mild fever',
  treatment: 'Rest, water',
  duration: '1 hour',
  outcome: 'Sent home',
  parentNotified: 'Yes',
  followUp: 'Return with fitness certificate'
}];

const SCREENINGS = [
{
  type: 'Annual Physical',
  date: '2024-02-15',
  conductedBy: 'Dr. Mehta (School Doctor)',
  result: 'Normal',
  findings: 'Height: 165cm, Weight: 55kg, BMI: 20.2',
  recommendations: 'Continue regular exercise',
  status: 'Completed'
},
{
  type: 'Vision Screening',
  date: '2024-02-15',
  conductedBy: 'Eye Camp Team',
  result: 'Needs Follow-up',
  findings: 'Right eye 6/9, Left eye 6/6',
  recommendations: 'Eye checkup recommended',
  status: 'Pending Follow-up'
}];

const EMERGENCY_PLANS = [
{
  condition: 'Severe Peanut Allergy',
  effectiveFrom: '2024-01-01',
  effectiveTo: '2025-06-30',
  triggers: 'Ingestion of peanuts or peanut products',
  actions:
  '1. Administer EpiPen immediately\n2. Call emergency services (108)\n3. Keep student lying down with legs elevated\n4. Monitor breathing\n5. Call parents',
  medicationLocation: 'EpiPen in nurse cabinet (labeled)',
  responsiblePersons: 'Nurse Sharma, Class Teacher, PE Teacher',
  contacts: 'Parent: 9876543210, Doctor: 9876543211',
  trainingNotes: 'All staff trained on 2024-01-15'
},
{
  condition: 'Asthma',
  effectiveFrom: '2024-01-01',
  effectiveTo: '2025-06-30',
  triggers: 'Dust, cold air, strenuous exercise',
  actions:
  '1. Help student sit upright\n2. Administer inhaler (2 puffs)\n3. Keep calm, encourage slow breathing\n4. If no improvement in 10 mins, call nurse\n5. If severe, call emergency',
  medicationLocation: 'Inhaler with student + spare in nurse cabinet',
  responsiblePersons: 'Nurse Sharma, Class Teacher, PE Teacher',
  contacts: 'Parent: 9876543210',
  trainingNotes: 'PE teacher briefed on 2024-01-20'
}];

const HEALTH_DOCUMENTS = [
{
  type: 'Medical Certificate',
  description: 'Asthma management plan',
  issueDate: '2024-01-05',
  expiryDate: '2025-01-05',
  issuedBy: 'Dr. Gupta',
  file: 'asthma_plan.pdf',
  verified: 'Verified'
},
{
  type: 'Allergy Certificate',
  description: 'Peanut allergy documentation',
  issueDate: '2023-06-15',
  expiryDate: '-',
  issuedBy: 'Dr. Sharma',
  file: 'allergy_cert.pdf',
  verified: 'Verified'
}];

export function StudentHealthProfilePage() {
  const [selectedStudent, setSelectedStudent] = useState<any>(null); // Initially null to show search
  // Modal States
  const [isAddConditionOpen, setIsAddConditionOpen] = useState(false);
  const [isAddMedicationOpen, setIsAddMedicationOpen] = useState(false);
  const [isAddVisitOpen, setIsAddVisitOpen] = useState(false);
  const [isAddVaccineOpen, setIsAddVaccineOpen] = useState(false);
  const [isAddScreeningOpen, setIsAddScreeningOpen] = useState(false);
  const [isAddEmergencyPlanOpen, setIsAddEmergencyPlanOpen] = useState(false);
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);
  // Handlers
  const handleSelectStudent = () => setSelectedStudent(SELECTED_STUDENT);
  const handleClearSelection = () => setSelectedStudent(null);
  const studentListColumns = [
  {
    key: 'name',
    header: 'Student Name',
    render: (row: any) =>
    <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">
            {row.name.charAt(0)}
          </div>
          <span className="font-medium">{row.name}</span>
        </div>

  },
  {
    key: 'grNo',
    header: 'GR No'
  },
  {
    key: 'class',
    header: 'Class'
  },
  {
    key: 'rollNo',
    header: 'Roll No'
  },
  {
    key: 'status',
    header: 'Status',
    render: (row: any) => <Badge variant="success">{row.status}</Badge>
  },
  {
    key: 'flags',
    header: 'Health Flags',
    render: (row: any) =>
    <div className="flex gap-1">
          {row.hasAllergy && <Badge variant="danger">Allergy</Badge>}
          {row.onMedication && <Badge variant="warning">On Medication</Badge>}
          {row.hasHealthPlan && <Badge variant="info">Health Plan</Badge>}
        </div>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: any) =>
    <Button variant="outline" size="xs" onClick={handleSelectStudent}>
          View Profile
        </Button>

  }];

  const tabs = [
  {
    id: 'profile',
    label: 'Basic Health',
    content:
    <Card title="Basic Health Profile">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <label className="text-xs text-gray-500 uppercase">Height</label>
              <p className="font-medium text-lg">
                {selectedStudent?.basicHealth.height} cm
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">Weight</label>
              <p className="font-medium text-lg">
                {selectedStudent?.basicHealth.weight} kg
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">BMI</label>
              <p className="font-medium text-lg">
                {selectedStudent?.basicHealth.bmi}
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">
                Measured Date
              </label>
              <p className="font-medium">
                {selectedStudent?.basicHealth.measuredDate}
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">
                Vision (Left)
              </label>
              <p className="font-medium">
                {selectedStudent?.basicHealth.visionLeft}
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">
                Vision (Right)
              </label>
              <p className="font-medium">
                {selectedStudent?.basicHealth.visionRight}
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">Hearing</label>
              <p className="font-medium">
                {selectedStudent?.basicHealth.hearing}
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">Dental</label>
              <p className="font-medium">
                {selectedStudent?.basicHealth.dental}
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">
                Fitness Level
              </label>
              <p className="font-medium">
                {selectedStudent?.basicHealth.fitnessLevel}
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">
                Disabilities
              </label>
              <p className="font-medium">
                {selectedStudent?.basicHealth.disabilities}
              </p>
            </div>
            <div className="col-span-2">
              <label className="text-xs text-gray-500 uppercase">
                General Remarks
              </label>
              <p className="font-medium">
                {selectedStudent?.basicHealth.remarks}
              </p>
            </div>
          </div>
        </Card>

  },
  {
    id: 'conditions',
    label: 'Conditions & Allergies',
    content:
    <div className="space-y-6">
          <div className="flex justify-end">
            <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddConditionOpen(true)}>

              Add Condition/Allergy
            </Button>
          </div>
          {CONDITIONS_ALLERGIES.map((item) =>
      <Card
        key={item.id}
        className={`border-l-4 ${item.severity === 'Life-threatening' ? 'border-l-red-500' : item.severity === 'Severe' ? 'border-l-orange-500' : 'border-l-yellow-500'}`}>

              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge
                variant={item.type === 'Allergy' ? 'danger' : 'warning'}>

                      {item.type}
                    </Badge>
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    {item.active && <Badge variant="success">Active</Badge>}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Severity:{' '}
                    <span
                className={`font-medium ${item.severity === 'Life-threatening' ? 'text-red-600' : 'text-orange-600'}`}>

                      {item.severity}
                    </span>
                  </p>
                </div>
                <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAddConditionOpen(true)}>

                  <Edit className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div>
                  <label className="text-gray-500 block">Triggers:</label>
                  <p className="font-medium">{item.triggers}</p>
                </div>
                <div>
                  <label className="text-gray-500 block">Symptoms:</label>
                  <p className="font-medium">{item.symptoms}</p>
                </div>
                <div>
                  <label className="text-gray-500 block">Precautions:</label>
                  <p className="font-medium">{item.precautions}</p>
                </div>
                <div>
                  <label className="text-gray-500 block">
                    Emergency Response:
                  </label>
                  <p className="font-medium text-red-600">{item.emergency}</p>
                </div>
                <div>
                  <label className="text-gray-500 block">Diagnosed:</label>
                  <p className="font-medium">{item.diagnosedDate}</p>
                </div>
                <div>
                  <label className="text-gray-500 block">Doctor:</label>
                  <p className="font-medium">{item.doctor}</p>
                </div>
              </div>
            </Card>
      )}
        </div>

  },
  {
    id: 'medications',
    label: 'Medications',
    content:
    <div className="space-y-6">
          <div className="flex justify-end">
            <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddMedicationOpen(true)}>

              Add Medication
            </Button>
          </div>
          {MEDICATIONS.map((med) =>
      <Card key={med.id}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Pill className="w-5 h-5 text-blue-500" />
                    <h3 className="font-bold text-lg">{med.name}</h3>
                    {med.active && <Badge variant="success">Active</Badge>}
                    {med.stockInSchool &&
              <Badge variant="info">Stock in School</Badge>
              }
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{med.purpose}</p>
                </div>
                <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAddMedicationOpen(true)}>

                  <Edit className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <label className="text-gray-500">Dosage:</label>
                  <p className="font-medium">{med.dosage}</p>
                </div>
                <div>
                  <label className="text-gray-500">Form:</label>
                  <p className="font-medium">{med.form}</p>
                </div>
                <div>
                  <label className="text-gray-500">Schedule:</label>
                  <p className="font-medium">{med.schedule}</p>
                </div>
                <div>
                  <label className="text-gray-500">Start Date:</label>
                  <p className="font-medium">{med.startDate}</p>
                </div>
                <div>
                  <label className="text-gray-500">Storage:</label>
                  <p className="font-medium">{med.storage}</p>
                </div>
                <div>
                  <label className="text-gray-500">Side Effects:</label>
                  <p className="font-medium">{med.sideEffects}</p>
                </div>
                <div>
                  <label className="text-gray-500">Administered By:</label>
                  <p className="font-medium">{med.administeredBy}</p>
                </div>
                <div>
                  <label className="text-gray-500">Consent:</label>
                  <p className="font-medium">{med.consent}</p>
                </div>
                {med.stockInSchool &&
          <>
                    <div>
                      <label className="text-gray-500">Quantity:</label>
                      <p className="font-medium">{med.quantity}</p>
                    </div>
                    <div>
                      <label className="text-gray-500">Expiry:</label>
                      <p className="font-medium">{med.expiry}</p>
                    </div>
                  </>
          }
              </div>
            </Card>
      )}
          <Card title="Medication Administration Log" noPadding>
            <Table
          columns={[
          {
            key: 'date',
            header: 'Date & Time'
          },
          {
            key: 'medication',
            header: 'Medication'
          },
          {
            key: 'dose',
            header: 'Dose'
          },
          {
            key: 'administeredBy',
            header: 'Administered By'
          },
          {
            key: 'reason',
            header: 'Reason'
          },
          {
            key: 'reaction',
            header: 'Reaction'
          },
          {
            key: 'parentInformed',
            header: 'Parent Informed',
            render: (row: any) =>
            <Badge
              variant={
              row.parentInformed === 'Yes' ? 'success' : 'secondary'
              }>

                      {row.parentInformed}
                    </Badge>

          }]
          }
          data={MEDICATION_LOG} />

          </Card>
        </div>

  },
  {
    id: 'vaccinations',
    label: 'Vaccinations',
    content:
    <div className="space-y-4">
          <div className="flex justify-end">
            <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddVaccineOpen(true)}>

              Add Vaccination
            </Button>
          </div>
          <Card title="Immunization & Vaccination Records" noPadding>
            <Table
          columns={[
          {
            key: 'vaccine',
            header: 'Vaccine'
          },
          {
            key: 'dose',
            header: 'Dose'
          },
          {
            key: 'date',
            header: 'Date'
          },
          {
            key: 'place',
            header: 'Place'
          },
          {
            key: 'batchNo',
            header: 'Batch No'
          },
          {
            key: 'nextDue',
            header: 'Next Due',
            render: (row: any) =>
            <span
              className={
              row.nextDue === 'Complete' ?
              'text-green-600' :
              'text-orange-600'
              }>

                      {row.nextDue}
                    </span>

          },
          {
            key: 'proof',
            header: 'Proof',
            render: (row: any) =>
            <Badge variant="success">{row.proof}</Badge>

          },
          {
            key: 'actions',
            header: '',
            render: () =>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setIsAddVaccineOpen(true)}>

                      <Edit className="w-4 h-4" />
                    </Button>

          }]
          }
          data={VACCINATIONS} />

          </Card>
        </div>

  },
  {
    id: 'visits',
    label: 'Health Room Visits',
    content:
    <div className="space-y-6">
          <div className="flex justify-end">
            <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddVisitOpen(true)}>

              Record Visit
            </Button>
          </div>
          {HEALTH_VISITS.map((visit, idx) =>
      <Card key={idx}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">{visit.date}</span>
                    <Badge variant="outline">{visit.location}</Badge>
                  </div>
                  <p className="text-lg font-bold mt-1">{visit.reason}</p>
                </div>
                <Badge
            variant={
            visit.outcome === 'Returned to class' ?
            'success' :
            'warning'
            }>

                  {visit.outcome}
                </Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <label className="text-gray-500">Vitals:</label>
                  <p className="font-medium">{visit.vitals}</p>
                </div>
                <div>
                  <label className="text-gray-500">Assessment:</label>
                  <p className="font-medium">{visit.assessment}</p>
                </div>
                <div>
                  <label className="text-gray-500">Treatment:</label>
                  <p className="font-medium">{visit.treatment}</p>
                </div>
                <div>
                  <label className="text-gray-500">Duration:</label>
                  <p className="font-medium">{visit.duration}</p>
                </div>
                <div>
                  <label className="text-gray-500">Parent Notified:</label>
                  <p className="font-medium">{visit.parentNotified}</p>
                </div>
                <div>
                  <label className="text-gray-500">Follow-up:</label>
                  <p className="font-medium">{visit.followUp}</p>
                </div>
              </div>
            </Card>
      )}
        </div>

  },
  {
    id: 'screenings',
    label: 'Screenings',
    content:
    <div className="space-y-4">
          <div className="flex justify-end">
            <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddScreeningOpen(true)}>

              Add Screening
            </Button>
          </div>
          <Card title="Health Screenings & Annual Check-ups" noPadding>
            <Table
          columns={[
          {
            key: 'type',
            header: 'Screening Type'
          },
          {
            key: 'date',
            header: 'Date'
          },
          {
            key: 'conductedBy',
            header: 'Conducted By'
          },
          {
            key: 'result',
            header: 'Result',
            render: (row: any) =>
            <Badge
              variant={row.result === 'Normal' ? 'success' : 'warning'}>

                      {row.result}
                    </Badge>

          },
          {
            key: 'findings',
            header: 'Findings'
          },
          {
            key: 'recommendations',
            header: 'Recommendations'
          },
          {
            key: 'status',
            header: 'Status',
            render: (row: any) =>
            <Badge
              variant={
              row.status === 'Completed' ? 'success' : 'warning'
              }>

                      {row.status}
                    </Badge>

          },
          {
            key: 'actions',
            header: '',
            render: () =>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setIsAddScreeningOpen(true)}>

                      <Edit className="w-4 h-4" />
                    </Button>

          }]
          }
          data={SCREENINGS} />

          </Card>
        </div>

  },
  {
    id: 'emergency',
    label: 'Emergency Plans',
    content:
    <div className="space-y-6">
          <div className="flex justify-end">
            <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddEmergencyPlanOpen(true)}>

              Add Emergency Plan
            </Button>
          </div>
          {EMERGENCY_PLANS.map((plan, idx) =>
      <Card key={idx} className="border-l-4 border-l-red-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <h3 className="font-bold text-lg text-red-700">
                      {plan.condition}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500">
                    Effective: {plan.effectiveFrom} to {plan.effectiveTo}
                  </p>
                </div>
                <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAddEmergencyPlanOpen(true)}>

                  <Edit className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-4 text-sm">
                <div>
                  <label className="text-gray-500 font-medium">
                    Triggers/Warning Signs:
                  </label>
                  <p>{plan.triggers}</p>
                </div>
                <div>
                  <label className="text-gray-500 font-medium">
                    Step-by-Step Actions:
                  </label>
                  <pre className="whitespace-pre-wrap bg-red-50 p-3 rounded text-red-800 border border-red-100 font-sans mt-1">
                    {plan.actions}
                  </pre>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-500 font-medium">
                      Medication Location:
                    </label>
                    <p>{plan.medicationLocation}</p>
                  </div>
                  <div>
                    <label className="text-gray-500 font-medium">
                      Responsible Persons:
                    </label>
                    <p>{plan.responsiblePersons}</p>
                  </div>
                  <div>
                    <label className="text-gray-500 font-medium">
                      Emergency Contacts:
                    </label>
                    <p>{plan.contacts}</p>
                  </div>
                  <div>
                    <label className="text-gray-500 font-medium">
                      Training Notes:
                    </label>
                    <p>{plan.trainingNotes}</p>
                  </div>
                </div>
              </div>
            </Card>
      )}
        </div>

  },
  {
    id: 'documents',
    label: 'Documents',
    content:
    <div className="space-y-6">
          <div className="flex justify-end">
            <Button
          variant="primary"
          leftIcon={<Upload className="w-4 h-4" />}
          onClick={() => setIsAddDocumentOpen(true)}>

              Upload Document
            </Button>
          </div>
          <Card title="Health Documents & Attachments" noPadding>
            <Table
          columns={[
          {
            key: 'type',
            header: 'Document Type'
          },
          {
            key: 'description',
            header: 'Description'
          },
          {
            key: 'issueDate',
            header: 'Issue Date'
          },
          {
            key: 'expiryDate',
            header: 'Expiry Date'
          },
          {
            key: 'issuedBy',
            header: 'Issued By'
          },
          {
            key: 'verified',
            header: 'Status',
            render: (row: any) =>
            <Badge
              variant={
              row.verified === 'Verified' ? 'success' : 'warning'
              }>

                      {row.verified}
                    </Badge>

          },
          {
            key: 'actions',
            header: 'Actions',
            render: () =>
            <div className="flex gap-2">
                      <Button variant="ghost" size="xs">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                variant="ghost"
                size="xs"
                onClick={() => setIsAddDocumentOpen(true)}>

                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>

          }]
          }
          data={HEALTH_DOCUMENTS} />

          </Card>
        </div>

  }];

  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      {/* Fixed Header Area */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Student Health & Medicine
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Comprehensive health records, medications, and medical history
              management.
            </p>
          </div>
        </div>
      </div>

      {/* Main Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto pr-2 pb-6 space-y-6">
        {/* Search Panel */}
        <Card className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Input label="GR No." placeholder="Search GR No" />
            <Input label="PEN No." placeholder="Search PEN No" />
            <Input label="UID No." placeholder="Search UID No" />
            <Input label="SU ID" placeholder="Search SU ID" />
            <Input label="First Name" placeholder="First Name" />
            <Input label="Last Name" placeholder="Last Name" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
            <Input label="Middle Name" placeholder="Middle Name" />
            <Input label="Contact No." placeholder="Mobile Number" />
            <Select
              label="Department"
              options={[
              {
                value: 'all',
                label: 'All Departments'
              }]
              } />

            <Select
              label="Class"
              options={[
              {
                value: 'all',
                label: 'All Classes'
              }]
              } />

            <Select
              label="Division"
              options={[
              {
                value: 'all',
                label: 'All Divisions'
              }]
              } />

            <Input label="Roll No." placeholder="Roll No" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <Select
              label="Student Status"
              options={[
              {
                value: 'all',
                label: 'All Status'
              },
              {
                value: 'active',
                label: 'Active'
              }]
              } />

            <Select
              label="Class Status"
              options={[
              {
                value: 'all',
                label: 'All'
              }]
              } />

          </div>
          <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
            <Button variant="outline" onClick={handleClearSelection}>
              Clear
            </Button>
            <Button
              variant="primary"
              leftIcon={<Search className="w-4 h-4" />}
              onClick={handleSelectStudent}>

              Search
            </Button>
          </div>
        </Card>

        {/* Dynamic Content */}
        {!selectedStudent ?
        <Card title="Student List" noPadding>
            <Table columns={studentListColumns} data={MOCK_STUDENTS} />
          </Card> :

        <>
            {/* Student Header Card */}
            <Card className="p-6">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold flex-shrink-0">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div className="flex-1 w-full">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedStudent.name}
                    </h2>
                    <Badge variant="info">{selectedStudent.bloodGroup}</Badge>
                  </div>
                  <p className="text-gray-600">
                    GR: {selectedStudent.grNo} | SU ID: {selectedStudent.suId} |
                    Class: {selectedStudent.class} | Roll:{' '}
                    {selectedStudent.rollNo}
                  </p>

                  {selectedStudent.criticalAlerts.length > 0 &&
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 text-red-700 font-semibold mb-1">
                        <AlertTriangle className="w-5 h-5" />
                        Critical Medical Alerts
                      </div>
                      <ul className="text-sm text-red-600 list-disc list-inside">
                        {selectedStudent.criticalAlerts.map(
                      (alert: string, idx: number) =>
                      <li key={idx}>{alert}</li>

                    )}
                      </ul>
                    </div>
                }

                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm pt-3 border-t">
                    <div>
                      <span className="text-gray-500 block">
                        Emergency Contact:
                      </span>
                      <p className="font-medium">
                        {selectedStudent.emergencyContact.name} (
                        {selectedStudent.emergencyContact.relation})
                      </p>
                      <p className="text-blue-600 flex items-center gap-1">
                        <Phone className="w-3 h-3" />{' '}
                        {selectedStudent.emergencyContact.phone}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 block">
                        Responsible Staff:
                      </span>
                      <p className="font-medium">
                        {selectedStudent.responsibleStaff}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Last Updated:</span>
                      <p className="font-medium">
                        {selectedStudent.lastUpdated}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Tabs tabs={tabs} />
          </>
        }
      </div>

      {/* --- MODALS --- */}

      {/* Add Condition Modal */}
      <Modal
        isOpen={isAddConditionOpen}
        onClose={() => setIsAddConditionOpen(false)}
        title="Add Medical Condition / Allergy"
        size="lg">

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Type"
              options={[
              {
                value: 'chronic',
                label: 'Chronic Condition'
              },
              {
                value: 'temporary',
                label: 'Temporary Condition'
              },
              {
                value: 'allergy',
                label: 'Allergy'
              }]
              } />

            <Input
              label="Name/Diagnosis"
              placeholder="e.g., Asthma, Peanut Allergy" />

            <Select
              label="Severity"
              options={[
              {
                value: 'mild',
                label: 'Mild'
              },
              {
                value: 'moderate',
                label: 'Moderate'
              },
              {
                value: 'severe',
                label: 'Severe'
              },
              {
                value: 'life',
                label: 'Life-threatening'
              }]
              } />

            <Input label="Diagnosed Date" type="date" />
          </div>
          <Input label="Triggers" placeholder="e.g., Dust, cold air, peanuts" />
          <Input
            label="Symptoms to Watch"
            placeholder="e.g., Wheezing, swelling" />

          <Input
            label="Precautions"
            placeholder="Everyday precautions at school" />

          <Input
            label="Emergency Response"
            placeholder="Steps to take in emergency" />

          <Input
            label="Treating Doctor"
            placeholder="Doctor name and contact" />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsAddConditionOpen(false)}>

              Cancel
            </Button>
            <Button variant="primary">Save Condition</Button>
          </div>
        </div>
      </Modal>

      {/* Add Medication Modal */}
      <Modal
        isOpen={isAddMedicationOpen}
        onClose={() => setIsAddMedicationOpen(false)}
        title="Add Medication"
        size="lg">

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Medication Name"
              placeholder="e.g., Salbutamol Inhaler" />

            <Input
              label="Purpose/Condition"
              placeholder="e.g., Asthma relief" />

            <Input label="Dosage" placeholder="e.g., 2 puffs, 10mg" />
            <Select
              label="Form"
              options={[
              {
                value: 'tablet',
                label: 'Tablet'
              },
              {
                value: 'syrup',
                label: 'Syrup'
              },
              {
                value: 'inhaler',
                label: 'Inhaler'
              },
              {
                value: 'injection',
                label: 'Injection'
              }]
              } />

            <Input
              label="Schedule"
              placeholder="e.g., Daily morning, As needed" />

            <Input label="Start Date" type="date" />
          </div>
          <Input
            label="Storage Instructions"
            placeholder="e.g., Room temperature, Refrigerate" />

          <Input
            label="Side Effects to Monitor"
            placeholder="e.g., Drowsiness, tremors" />

          <Select
            label="Administered By"
            options={[
            {
              value: 'self',
              label: 'Self'
            },
            {
              value: 'nurse',
              label: 'Nurse'
            },
            {
              value: 'teacher',
              label: 'Class Teacher'
            }]
            } />

          <div className="flex items-center gap-2">
            <input type="checkbox" className="rounded text-blue-600" />
            <label className="text-sm">Stock kept in school</label>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsAddMedicationOpen(false)}>

              Cancel
            </Button>
            <Button variant="primary">Save Medication</Button>
          </div>
        </div>
      </Modal>

      {/* Add Visit Modal */}
      <Modal
        isOpen={isAddVisitOpen}
        onClose={() => setIsAddVisitOpen(false)}
        title="Record Health Room Visit"
        size="lg">

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date & Time" type="datetime-local" />
            <Select
              label="Location"
              options={[
              {
                value: 'classroom',
                label: 'Classroom'
              },
              {
                value: 'playground',
                label: 'Playground'
              },
              {
                value: 'lab',
                label: 'Laboratory'
              },
              {
                value: 'health_room',
                label: 'Health Room'
              }]
              } />

          </div>
          <Select
            label="Reason for Visit"
            options={[
            {
              value: 'fever',
              label: 'Fever'
            },
            {
              value: 'headache',
              label: 'Headache'
            },
            {
              value: 'injury',
              label: 'Injury'
            },
            {
              value: 'other',
              label: 'Other'
            }]
            } />

          <div className="grid grid-cols-4 gap-4">
            <Input label="Temperature" placeholder="°F" />
            <Input label="Pulse" placeholder="bpm" />
            <Input label="BP" placeholder="mmHg" />
            <Input label="SpO2" placeholder="%" />
          </div>
          <Input label="Assessment" placeholder="Provisional diagnosis" />
          <Input
            label="Treatment Provided"
            placeholder="First aid, medication given, etc." />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Duration of Stay" placeholder="e.g., 30 mins" />
            <Select
              label="Outcome"
              options={[
              {
                value: 'returned',
                label: 'Returned to Class'
              },
              {
                value: 'home',
                label: 'Sent Home'
              },
              {
                value: 'hospital',
                label: 'Sent to Hospital'
              }]
              } />

          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" className="rounded text-blue-600" />
            <label className="text-sm">Parent/Guardian Notified</label>
          </div>
          <Input
            label="Follow-up Instructions"
            placeholder="e.g., Rest, doctor visit" />

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsAddVisitOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary">Save Visit Record</Button>
          </div>
        </div>
      </Modal>

      {/* Add Vaccination Modal */}
      <Modal
        isOpen={isAddVaccineOpen}
        onClose={() => setIsAddVaccineOpen(false)}
        title="Add Vaccination Record"
        size="lg">

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Vaccine" placeholder="e.g., Tetanus" />
            <Input label="Dose" placeholder="e.g., 1/3, Booster" />
            <Input label="Date" type="date" />
            <Input label="Place" placeholder="e.g., School Clinic" />
            <Input label="Batch No" placeholder="Lot Number" />
            <Input label="Next Due Date" type="date" />
          </div>
          <Select
            label="Proof Status"
            options={[
            {
              value: 'uploaded',
              label: 'Uploaded'
            },
            {
              value: 'not_uploaded',
              label: 'Not Uploaded'
            }]
            } />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Proof
            </label>
            <FileUpload />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsAddVaccineOpen(false)}>

              Cancel
            </Button>
            <Button variant="primary">Save Vaccination</Button>
          </div>
        </div>
      </Modal>

      {/* Add Screening Modal */}
      <Modal
        isOpen={isAddScreeningOpen}
        onClose={() => setIsAddScreeningOpen(false)}
        title="Add Health Screening"
        size="lg">

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Screening Type"
              options={[
              {
                value: 'annual',
                label: 'Annual Physical'
              },
              {
                value: 'vision',
                label: 'Vision'
              },
              {
                value: 'dental',
                label: 'Dental'
              }]
              } />

            <Input label="Date" type="date" />
            <Input label="Conducted By" placeholder="Dr. Name" />
            <Select
              label="Result"
              options={[
              {
                value: 'normal',
                label: 'Normal'
              },
              {
                value: 'followup',
                label: 'Needs Follow-up'
              }]
              } />

          </div>
          <Input label="Findings" placeholder="Key findings summary" />
          <Input label="Recommendations" placeholder="Doctor's advice" />
          <Select
            label="Status"
            options={[
            {
              value: 'complete',
              label: 'Completed'
            },
            {
              value: 'pending',
              label: 'Pending'
            }]
            } />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsAddScreeningOpen(false)}>

              Cancel
            </Button>
            <Button variant="primary">Save Screening</Button>
          </div>
        </div>
      </Modal>

      {/* Add Emergency Plan Modal */}
      <Modal
        isOpen={isAddEmergencyPlanOpen}
        onClose={() => setIsAddEmergencyPlanOpen(false)}
        title="Add Emergency Plan"
        size="lg">

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Associated Condition"
              options={[
              {
                value: 'asthma',
                label: 'Asthma'
              },
              {
                value: 'peanut',
                label: 'Peanut Allergy'
              }]
              } />

            <Input label="Plan Name" placeholder="e.g., Asthma Action Plan" />
            <Input label="Effective From" type="date" />
            <Input label="Effective To" type="date" />
          </div>
          <Input
            label="Triggers / Warning Signs"
            placeholder="Describe triggers" />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Step-by-Step Actions
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={4}
              placeholder="1. ..." />

          </div>
          <Input
            label="Medication Location"
            placeholder="Where is it stored?" />

          <Input label="Emergency Contacts" placeholder="Names & Numbers" />
          <Input label="Responsible Persons" placeholder="Nurse, Teachers" />
          <Input label="Training Notes" placeholder="Staff training details" />
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsAddEmergencyPlanOpen(false)}>

              Cancel
            </Button>
            <Button variant="primary">Save Emergency Plan</Button>
          </div>
        </div>
      </Modal>

      {/* Add Document Modal */}
      <Modal
        isOpen={isAddDocumentOpen}
        onClose={() => setIsAddDocumentOpen(false)}
        title="Upload Health Document"
        size="md">

        <div className="space-y-4">
          <Select
            label="Document Type"
            options={[
            {
              value: 'med_cert',
              label: 'Medical Certificate'
            },
            {
              value: 'vac_card',
              label: 'Vaccination Card'
            }]
            } />

          <Input label="Description" placeholder="Short description" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Issue Date" type="date" />
            <Input label="Expiry Date" type="date" />
          </div>
          <Input label="Issued By" placeholder="Authority Name" />
          <Select
            label="Status"
            options={[
            {
              value: 'verified',
              label: 'Verified'
            },
            {
              value: 'pending',
              label: 'Pending'
            }]
            } />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              File Upload
            </label>
            <FileUpload />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsAddDocumentOpen(false)}>

              Cancel
            </Button>
            <Button variant="primary">Save Document</Button>
          </div>
        </div>
      </Modal>
    </div>);

}
export { StudentHealthProfilePage as StudentHealthMedical };