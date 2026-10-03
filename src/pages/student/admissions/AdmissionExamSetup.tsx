import React, { useState, createElement } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Users,
  MapPin,
  Plus,
  Settings,
  Eye,
  Printer,
  Download,
  FileSpreadsheet } from
'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Table } from '../../../components/ui/Table';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
// --- Mock Data Sources ---
// 1. Pool of students applying for admission
const mockApplicants = [
{
  id: 'STU-101',
  name: 'Aarav Patel',
  classApplyFor: '6',
  phone: '+919876543210',
  email: 'aarav@test.com'
},
{
  id: 'STU-102',
  name: 'Vivaan Singh',
  classApplyFor: '6',
  phone: '+919876543211',
  email: 'vivaan@test.com'
},
{
  id: 'STU-103',
  name: 'Aditya Kumar',
  classApplyFor: '9',
  phone: '+919876543212',
  email: 'aditya@test.com'
},
{
  id: 'STU-104',
  name: 'Diya Sharma',
  classApplyFor: '6',
  phone: '+919876543213',
  email: 'diya@test.com'
},
{
  id: 'STU-105',
  name: 'Ananya Gupta',
  classApplyFor: '1',
  phone: '+919876543214',
  email: 'ananya@test.com'
}];

// 2. Initial Scheduled Exams
const initialExams = [
{
  id: 'EX-001',
  name: 'Class 6 Entrance Test 2024',
  classTarget: '6',
  date: '2024-04-10',
  time: '10:00 AM',
  mode: 'Offline',
  centers: 2,
  status: 'Scheduled',
  // Pre-filled list for demo
  studentList: [
  {
    id: 'STU-101',
    name: 'Aarav Patel',
    phone: '+919876543210'
  },
  {
    id: 'STU-102',
    name: 'Vivaan Singh',
    phone: '+919876543211'
  }]

}];

export function AdmissionExamSetup() {
  const navigate = useNavigate();
  // -- State --
  const [exams, setExams] = useState(initialExams);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  // State for the "View Candidates" modal
  const [selectedExam, setSelectedExam] = useState<any>(null);
  // Form State for creating new exam
  const [formData, setFormData] = useState({
    name: '',
    classTarget: '',
    date: '',
    time: '',
    mode: 'offline',
    type: 'written'
  });
  // -- Helpers --
  // 1. Handle Form Input Change
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  // 2. Schedule Exam Logic (The Core Requirement)
  const handleScheduleExam = () => {
    // A. Filter Students based on the Class selected in the form
    const eligibleStudents = mockApplicants.filter(
      (student) => student.classApplyFor === formData.classTarget
    );
    if (eligibleStudents.length === 0) {
      alert(
        `No applicants found for Class ${formData.classTarget}. Cannot schedule exam.`
      );
      return;
    }
    // B. Create the Exam Object
    const newExam = {
      id: `EX-${Math.floor(Math.random() * 1000)}`,
      name: formData.name,
      classTarget: formData.classTarget,
      date: formData.date,
      time: formData.time,
      mode: formData.mode === 'offline' ? 'Offline' : 'Online',
      centers: 1,
      status: 'Scheduled',
      studentList: eligibleStudents // Attach the filtered list here
    };
    // C. Update State
    setExams([...exams, newExam]);
    // D. Simulate SMS Sending
    // In a real app, this would be an API call
    console.log('--- SENDING SMS ---');
    eligibleStudents.forEach((stu) => {
      console.log(
        `Sending SMS to ${stu.phone}: Dear ${stu.name}, your entrance exam for Class ${formData.classTarget} is scheduled on ${formData.date}.`
      );
    });
    alert(
      `Exam Scheduled Successfully!\n\nSMS notifications sent to ${eligibleStudents.length} candidates applying for Class ${formData.classTarget}.`
    );
    // E. Cleanup
    setIsCreateModalOpen(false);
    setFormData({
      name: '',
      classTarget: '',
      date: '',
      time: '',
      mode: 'offline',
      type: 'written'
    });
  };
  // 3. Open Candidate List
  const openCandidateList = (exam: any) => {
    setSelectedExam(exam);
    setIsListModalOpen(true);
  };
  // 4. Export to CSV
  const handleExportCSV = () => {
    if (!selectedExam) return;
    const headers = ['Student ID', 'Name', 'Phone', 'Exam Name', 'Date', 'Time'];
    const rows = selectedExam.studentList.map((stu: any) => [
    stu.id,
    stu.name,
    stu.phone,
    selectedExam.name,
    selectedExam.date,
    selectedExam.time]
    );
    const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map((e: any) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${selectedExam.name}_candidates.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  // 5. Print Functionality
  const handlePrint = () => {
    const printContent = document.getElementById('printable-area');
    if (!printContent) return;
    const w = window.open();
    if (w) {
      const styleText =
      'body { font-family: sans-serif; padding: 20px; } table { width: 100%; border-collapse: collapse; margin-top: 20px; } th, td { border: 1px solid #ddd; padding: 8px; text-align: left; } th { background-color: #f2f2f2; } h2 { margin-bottom: 5px; }';
      const examName = selectedExam.name;
      const examDate = selectedExam.date;
      const examTime = selectedExam.time;
      const content = printContent.innerHTML;
      w.document.write(
        '<html><head><title>Candidate List</title><style>{`' +
        styleText +
        '`}</style></head><body><h2>' +
        examName +
        '</h2><p>Date: ' +
        examDate +
        ' | Time: ' +
        examTime +
        '</p>' +
        content +
        '</body></html>'
      );
      w.document.close();
      w.print();
    }
  };
  // -- Table Configs --
  const mainTableColumns = [
  {
    key: 'name',
    header: 'Exam Name',
    render: (row: any) =>
    <div>
          <span className="font-medium block">{row.name}</span>
          <span className="text-xs text-gray-500">Class {row.classTarget}</span>
        </div>

  },
  {
    key: 'date',
    header: 'Date & Time',
    render: (row: any) =>
    <span className="text-sm">
          {row.date} at {row.time}
        </span>

  },
  {
    key: 'mode',
    header: 'Mode',
    render: (row: any) => <Badge variant="outline">{row.mode}</Badge>
  },
  {
    key: 'candidates',
    header: 'Candidates',
    render: (row: any) =>
    <span className="font-semibold text-blue-600">
          {row.studentList?.length || 0} Students
        </span>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: any) =>
    <Badge variant={row.status === 'Scheduled' ? 'success' : 'warning'}>
          {row.status}
        </Badge>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: any) =>
    <div className="flex gap-2">
          <Button
        variant="ghost"
        size="xs"
        onClick={() => openCandidateList(row)}>

            <Eye className="w-3 h-3 mr-1" /> View List
          </Button>
        </div>

  }];

  const candidateTableColumns = [
  {
    key: 'id',
    header: 'ID',
    render: (row: any) => <span className="text-xs">{row.id}</span>
  },
  {
    key: 'name',
    header: 'Student Name',
    render: (row: any) => <span className="font-medium">{row.name}</span>
  },
  {
    key: 'phone',
    header: 'Contact',
    render: (row: any) => <span>{row.phone}</span>
  },
  {
    key: 'status',
    header: 'Notification',
    render: () => <Badge variant="success">SMS Sent</Badge>
  }];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
        
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Admission Exam Setup
            </h1>
            <p className="text-gray-500">
              Configure exams and auto-notify applicants
            </p>
          </div>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Schedule Exam
        </Button>
      </div>

      {/* Main Exams List */}
      <Card>
        <Table columns={mainTableColumns} data={exams} />
      </Card>

      {/* --- MODAL 1: Create Schedule --- */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Schedule New Exam"
        size="lg"
        footer={
        <>
            <Button
            variant="outline"
            onClick={() => setIsCreateModalOpen(false)}>

              Cancel
            </Button>
            <Button onClick={handleScheduleExam}>Schedule & Notify</Button>
          </>
        }>

        <div className="space-y-4">
          <Input
            label="Exam Name"
            placeholder="e.g. Class 9 Science Aptitude"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)} />


          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Target Class (Auto-selects Applicants)"
              value={formData.classTarget}
              onChange={(val) => handleInputChange('classTarget', val)}
              options={[
              {
                value: '',
                label: 'Select Class'
              },
              {
                value: '1',
                label: 'Class 1'
              },
              {
                value: '6',
                label: 'Class 6'
              },
              {
                value: '9',
                label: 'Class 9'
              }]
              } />

            <Select
              label="Exam Type"
              value={formData.type}
              onChange={(val) => handleInputChange('type', val)}
              options={[
              {
                value: 'written',
                label: 'Written Test'
              },
              {
                value: 'online',
                label: 'Online Test'
              },
              {
                value: 'interview',
                label: 'Interview'
              }]
              } />

          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)} />

            <Input
              label="Start Time"
              type="time"
              value={formData.time}
              onChange={(e) => handleInputChange('time', e.target.value)} />

          </div>

          <div className="bg-blue-50 p-3 rounded-md border border-blue-100 text-sm text-blue-800">
            <strong>Note:</strong> Clicking "Schedule" will automatically assign
            all students currently applying for the selected class and send them
            an SMS notification.
          </div>
        </div>
      </Modal>

      {/* --- MODAL 2: View Candidate List (Export/Print) --- */}
      <Modal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        title={selectedExam ? `Candidates: ${selectedExam.name}` : 'Candidates'}
        size="xl"
        footer={
        <Button variant="outline" onClick={() => setIsListModalOpen(false)}>
            Close
          </Button>
        }>

        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">
              Total Candidates:{' '}
              <span className="font-bold">
                {selectedExam?.studentList?.length || 0}
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" /> Print List
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download className="w-4 h-4 mr-2" /> Export CSV
              </Button>
            </div>
          </div>

          {/* List */}
          <div id="printable-area">
            {selectedExam &&
            <Table
              columns={candidateTableColumns}
              data={selectedExam.studentList} />

            }
          </div>
        </div>
      </Modal>
    </div>);

}