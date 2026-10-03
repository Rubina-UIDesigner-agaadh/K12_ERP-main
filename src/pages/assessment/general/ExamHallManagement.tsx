import React, { useState, useMemo, useRef, useCallback } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import {
  MapPin, Users, Grid3X3, Printer, RotateCcw, Layout, Building2, Search,
  CheckCircle2, AlertCircle, Settings2, ChevronRight, ChevronDown, Layers,
  Save, UserCheck, Hash, Plus, X, Edit3, Trash2, Eye, ArrowRight, User,
  Calendar, Filter, Download, Check, Info, ClipboardList, AlertTriangle,
  CheckSquare, Square, Zap, UserX, Lock, Unlock, ChevronUp, FileText,
  Table, Clock, BookOpen, Home, FolderOpen, FileSpreadsheet, Copy,
  MoreVertical, Maximize2, Minimize2, GripVertical, RefreshCw } from
'lucide-react';

// ==================== TYPES ====================
interface Hall {
  id: string;
  name: string;
  building: string;
  floor: string;
  rows: number;
  columns: number;
  blockedSeats: string[];
  isActive: boolean;
  createdAt: string;
}

interface Exam {
  id: string;
  name: string;
  date: string;
  subject: string;
  standard: string;
  section: string;
  time: string;
}

interface Student {
  id: string;
  grNo: string;
  rollNo: string;
  fullName: string;
  standard: string;
  section: string;
  photo?: string;
}

interface SeatAllocation {
  studentId: string;
  studentName: string;
  grNo: string;
  rollNo: string;
  standard: string;
  section: string;
}

interface SeatingChart {
  id: string;
  name: string;
  examId: string;
  hallId: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'finalized';
  allocations: Record<string, SeatAllocation | null>;
}

type ViewMode = 'dashboard' | 'halls' | 'create-chart' | 'view-chart' | 'edit-chart';

// ==================== MOCK DATA ====================
const mockStudents: Student[] = [
{ id: '1', grNo: 'GR001', rollNo: '101', fullName: 'Aarav Sharma', standard: '10', section: 'A' },
{ id: '2', grNo: 'GR002', rollNo: '102', fullName: 'Priya Patel', standard: '10', section: 'A' },
{ id: '3', grNo: 'GR003', rollNo: '103', fullName: 'Rahul Kumar', standard: '10', section: 'A' },
{ id: '4', grNo: 'GR004', rollNo: '104', fullName: 'Sneha Gupta', standard: '10', section: 'B' },
{ id: '5', grNo: 'GR005', rollNo: '105', fullName: 'Vikram Singh', standard: '10', section: 'B' },
{ id: '6', grNo: 'GR006', rollNo: '106', fullName: 'Ananya Reddy', standard: '9', section: 'A' },
{ id: '7', grNo: 'GR007', rollNo: '107', fullName: 'Karthik Nair', standard: '9', section: 'A' },
{ id: '8', grNo: 'GR008', rollNo: '108', fullName: 'Meera Iyer', standard: '9', section: 'B' },
{ id: '9', grNo: 'GR009', rollNo: '109', fullName: 'Arjun Menon', standard: '11', section: 'A' },
{ id: '10', grNo: 'GR010', rollNo: '110', fullName: 'Divya Sharma', standard: '11', section: 'A' },
{ id: '11', grNo: 'GR011', rollNo: '111', fullName: 'Rohan Verma', standard: '10', section: 'A' },
{ id: '12', grNo: 'GR012', rollNo: '112', fullName: 'Kavya Nair', standard: '10', section: 'B' },
{ id: '13', grNo: 'GR013', rollNo: '113', fullName: 'Aditya Joshi', standard: '9', section: 'A' },
{ id: '14', grNo: 'GR014', rollNo: '114', fullName: 'Ishita Rao', standard: '9', section: 'B' },
{ id: '15', grNo: 'GR015', rollNo: '115', fullName: 'Varun Kapoor', standard: '11', section: 'A' },
{ id: '16', grNo: 'GR016', rollNo: '116', fullName: 'Neha Singh', standard: '10', section: 'A' },
{ id: '17', grNo: 'GR017', rollNo: '117', fullName: 'Amit Patel', standard: '10', section: 'B' },
{ id: '18', grNo: 'GR018', rollNo: '118', fullName: 'Pooja Sharma', standard: '9', section: 'A' },
{ id: '19', grNo: 'GR019', rollNo: '119', fullName: 'Raj Kumar', standard: '11', section: 'A' },
{ id: '20', grNo: 'GR020', rollNo: '120', fullName: 'Simran Kaur', standard: '10', section: 'A' }];


const mockExams: Exam[] = [
{ id: '1', name: 'Mid-Term Mathematics', date: '2024-02-15', subject: 'Mathematics', standard: '10', section: 'A', time: '09:00 AM - 12:00 PM' },
{ id: '2', name: 'Mid-Term Science', date: '2024-02-16', subject: 'Science', standard: '10', section: 'A', time: '09:00 AM - 12:00 PM' },
{ id: '3', name: 'Final English', date: '2024-03-20', subject: 'English', standard: '9', section: 'A', time: '02:00 PM - 05:00 PM' }];


// ==================== UTILITY FUNCTIONS ====================
const generateSeatId = (row: number, col: number): string => {
  const rowLetter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[row];
  return `${rowLetter}-${col + 1}`;
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const getInitials = (name: string): string => {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase();
};

// ==================== MAIN COMPONENT ====================
export function ExamHallManagement() {
  // View State
  const [activeView, setActiveView] = useState<ViewMode>('dashboard');
  const [selectedChartId, setSelectedChartId] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  // Data State
  const [halls, setHalls] = useState<Hall[]>([
  {
    id: '1',
    name: 'Main Hall A',
    building: 'Academic Block',
    floor: '1st Floor',
    rows: 5,
    columns: 8,
    blockedSeats: ['C-4', 'C-5'],
    isActive: true,
    createdAt: '2024-01-10'
  },
  {
    id: '2',
    name: 'Library Hall',
    building: 'West Wing',
    floor: 'Ground Floor',
    rows: 4,
    columns: 6,
    blockedSeats: [],
    isActive: true,
    createdAt: '2024-01-12'
  }]
  );

  const [seatingCharts, setSeatingCharts] = useState<SeatingChart[]>([
  {
    id: '1',
    name: 'Mid-Term Math - Hall A',
    examId: '1',
    hallId: '1',
    createdAt: '2024-02-10T10:30:00',
    updatedAt: '2024-02-10T14:20:00',
    status: 'finalized',
    allocations: {
      'A-1': { studentId: '1', studentName: 'Aarav Sharma', grNo: 'GR001', rollNo: '101', standard: '10', section: 'A' },
      'A-2': { studentId: '2', studentName: 'Priya Patel', grNo: 'GR002', rollNo: '102', standard: '10', section: 'A' },
      'A-3': { studentId: '3', studentName: 'Rahul Kumar', grNo: 'GR003', rollNo: '103', standard: '10', section: 'A' },
      'B-1': { studentId: '4', studentName: 'Sneha Gupta', grNo: 'GR004', rollNo: '104', standard: '10', section: 'B' },
      'B-2': { studentId: '5', studentName: 'Vikram Singh', grNo: 'GR005', rollNo: '105', standard: '10', section: 'B' }
    }
  }]
  );

  // Modal State
  const [showHallModal, setShowHallModal] = useState(false);
  const [editingHall, setEditingHall] = useState<Hall | null>(null);
  const [hallForm, setHallForm] = useState({
    name: '',
    building: '',
    floor: '',
    rows: 5,
    columns: 6
  });

  // Chart Creation State
  const [chartCreation, setChartCreation] = useState({
    step: 1,
    name: '',
    examId: '',
    hallId: '',
    allocations: {} as Record<string, SeatAllocation | null>,
    selectedSeats: new Set<string>(),
    selectedStudents: new Set<string>()
  });

  // Filters
  const [studentFilter, setStudentFilter] = useState({ standard: '', section: '', search: '' });

  // ==================== COMPUTED VALUES ====================
  const selectedChart = useMemo(() => {
    return seatingCharts.find((c) => c.id === selectedChartId) || null;
  }, [selectedChartId, seatingCharts]);

  const selectedHall = useMemo(() => {
    if (chartCreation.hallId) {
      return halls.find((h) => h.id === chartCreation.hallId) || null;
    }
    if (selectedChart) {
      return halls.find((h) => h.id === selectedChart.hallId) || null;
    }
    return null;
  }, [chartCreation.hallId, selectedChart, halls]);

  const selectedExam = useMemo(() => {
    if (chartCreation.examId) {
      return mockExams.find((e) => e.id === chartCreation.examId) || null;
    }
    if (selectedChart) {
      return mockExams.find((e) => e.id === selectedChart.examId) || null;
    }
    return null;
  }, [chartCreation.examId, selectedChart]);

  const filteredStudents = useMemo(() => {
    return mockStudents.filter((s) => {
      if (studentFilter.standard && s.standard !== studentFilter.standard) return false;
      if (studentFilter.section && s.section !== studentFilter.section) return false;
      if (studentFilter.search) {
        const search = studentFilter.search.toLowerCase();
        if (!s.fullName.toLowerCase().includes(search) && !s.grNo.toLowerCase().includes(search)) {
          return false;
        }
      }
      return true;
    });
  }, [studentFilter]);

  const allocatedStudentIds = useMemo(() => {
    const ids = new Set<string>();
    Object.values(chartCreation.allocations).forEach((alloc) => {
      if (alloc) ids.add(alloc.studentId);
    });
    return ids;
  }, [chartCreation.allocations]);

  const chartStats = useMemo(() => {
    if (!selectedHall) return { total: 0, allocated: 0, available: 0, blocked: 0 };

    const total = selectedHall.rows * selectedHall.columns;
    const blocked = selectedHall.blockedSeats.length;
    const allocated = Object.values(chartCreation.allocations).filter((a) => a !== null).length;
    const available = total - blocked - allocated;

    return { total, allocated, available, blocked };
  }, [selectedHall, chartCreation.allocations]);

  // ==================== HANDLERS ====================

  // Hall Management
  const handleAddHall = () => {
    if (!hallForm.name || !hallForm.building || !hallForm.floor) {
      alert('Please fill all required fields');
      return;
    }

    const newHall: Hall = {
      id: editingHall?.id || Date.now().toString(),
      name: hallForm.name,
      building: hallForm.building,
      floor: hallForm.floor,
      rows: hallForm.rows,
      columns: hallForm.columns,
      blockedSeats: editingHall?.blockedSeats || [],
      isActive: true,
      createdAt: editingHall?.createdAt || new Date().toISOString()
    };

    if (editingHall) {
      setHalls((prev) => prev.map((h) => h.id === editingHall.id ? newHall : h));
    } else {
      setHalls((prev) => [...prev, newHall]);
    }

    setShowHallModal(false);
    setEditingHall(null);
    setHallForm({ name: '', building: '', floor: '', rows: 5, columns: 6 });
  };

  const handleDeleteHall = (hallId: string) => {
    if (confirm('Are you sure you want to delete this hall?')) {
      setHalls((prev) => prev.filter((h) => h.id !== hallId));
    }
  };

  const handleEditHall = (hall: Hall) => {
    setEditingHall(hall);
    setHallForm({
      name: hall.name,
      building: hall.building,
      floor: hall.floor,
      rows: hall.rows,
      columns: hall.columns
    });
    setShowHallModal(true);
  };

  // Chart Creation
  const handleStartCreateChart = () => {
    setChartCreation({
      step: 1,
      name: '',
      examId: '',
      hallId: '',
      allocations: {},
      selectedSeats: new Set(),
      selectedStudents: new Set()
    });
    setActiveView('create-chart');
  };

  const handleNextStep = () => {
    if (chartCreation.step === 1 && (!chartCreation.name || !chartCreation.examId || !chartCreation.hallId)) {
      alert('Please fill all required fields');
      return;
    }

    if (chartCreation.step === 1) {
      // Initialize allocations for the selected hall
      const hall = halls.find((h) => h.id === chartCreation.hallId);
      if (hall) {
        const allocations: Record<string, SeatAllocation | null> = {};
        for (let r = 0; r < hall.rows; r++) {
          for (let c = 0; c < hall.columns; c++) {
            const seatId = generateSeatId(r, c);
            allocations[seatId] = null;
          }
        }
        setChartCreation((prev) => ({ ...prev, allocations, step: 2 }));
      }
    } else {
      setChartCreation((prev) => ({ ...prev, step: prev.step + 1 }));
    }
  };

  const handlePrevStep = () => {
    setChartCreation((prev) => ({ ...prev, step: prev.step - 1 }));
  };

  const handleSeatClick = (seatId: string) => {
    if (selectedHall?.blockedSeats.includes(seatId)) return;
    if (chartCreation.allocations[seatId]) {
      // Seat is allocated - toggle removal or show info
      return;
    }

    setChartCreation((prev) => {
      const next = new Set(prev.selectedSeats);
      if (next.has(seatId)) {
        next.delete(seatId);
      } else {
        next.add(seatId);
      }
      return { ...prev, selectedSeats: next };
    });
  };

  const handleStudentSelect = (studentId: string) => {
    if (allocatedStudentIds.has(studentId)) return;

    setChartCreation((prev) => {
      const next = new Set(prev.selectedStudents);
      if (next.has(studentId)) {
        next.delete(studentId);
      } else {
        next.add(studentId);
      }
      return { ...prev, selectedStudents: next };
    });
  };

  const handleAssignStudents = () => {
    const seats = Array.from(chartCreation.selectedSeats);
    const students = Array.from(chartCreation.selectedStudents);

    if (seats.length === 0 || students.length === 0) {
      alert('Please select both seats and students');
      return;
    }

    if (seats.length < students.length) {
      alert(`Not enough seats! Selected ${students.length} students but only ${seats.length} seats`);
      return;
    }

    const newAllocations = { ...chartCreation.allocations };
    students.forEach((studentId, idx) => {
      const student = mockStudents.find((s) => s.id === studentId);
      if (student && seats[idx]) {
        newAllocations[seats[idx]] = {
          studentId: student.id,
          studentName: student.fullName,
          grNo: student.grNo,
          rollNo: student.rollNo,
          standard: student.standard,
          section: student.section
        };
      }
    });

    setChartCreation((prev) => ({
      ...prev,
      allocations: newAllocations,
      selectedSeats: new Set(),
      selectedStudents: new Set()
    }));
  };

  const handleAutoAssign = () => {
    if (!selectedHall) return;

    const unallocatedStudents = filteredStudents.filter((s) => !allocatedStudentIds.has(s.id));
    const availableSeats: string[] = [];

    for (let r = 0; r < selectedHall.rows; r++) {
      for (let c = 0; c < selectedHall.columns; c++) {
        const seatId = generateSeatId(r, c);
        if (!selectedHall.blockedSeats.includes(seatId) && !chartCreation.allocations[seatId]) {
          availableSeats.push(seatId);
        }
      }
    }

    const toAssign = Math.min(availableSeats.length, unallocatedStudents.length);
    if (toAssign === 0) {
      alert('No students or seats available for auto-assignment');
      return;
    }

    if (!confirm(`Auto-assign ${toAssign} students to available seats?`)) return;

    const newAllocations = { ...chartCreation.allocations };
    unallocatedStudents.slice(0, toAssign).forEach((student, idx) => {
      newAllocations[availableSeats[idx]] = {
        studentId: student.id,
        studentName: student.fullName,
        grNo: student.grNo,
        rollNo: student.rollNo,
        standard: student.standard,
        section: student.section
      };
    });

    setChartCreation((prev) => ({
      ...prev,
      allocations: newAllocations,
      selectedSeats: new Set(),
      selectedStudents: new Set()
    }));
  };

  const handleRemoveAllocation = (seatId: string) => {
    setChartCreation((prev) => ({
      ...prev,
      allocations: { ...prev.allocations, [seatId]: null }
    }));
  };

  const handleClearAllAllocations = () => {
    if (!confirm('Clear all seat allocations?')) return;

    const clearedAllocations: Record<string, SeatAllocation | null> = {};
    Object.keys(chartCreation.allocations).forEach((seatId) => {
      clearedAllocations[seatId] = null;
    });

    setChartCreation((prev) => ({
      ...prev,
      allocations: clearedAllocations,
      selectedSeats: new Set(),
      selectedStudents: new Set()
    }));
  };

  const handleSaveChart = (status: 'draft' | 'finalized') => {
    const allocatedCount = Object.values(chartCreation.allocations).filter((a) => a !== null).length;

    if (status === 'finalized' && allocatedCount === 0) {
      alert('Cannot finalize an empty seating chart');
      return;
    }

    const newChart: SeatingChart = {
      id: Date.now().toString(),
      name: chartCreation.name,
      examId: chartCreation.examId,
      hallId: chartCreation.hallId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status,
      allocations: chartCreation.allocations
    };

    setSeatingCharts((prev) => [...prev, newChart]);
    setActiveView('dashboard');
    setChartCreation({
      step: 1,
      name: '',
      examId: '',
      hallId: '',
      allocations: {},
      selectedSeats: new Set(),
      selectedStudents: new Set()
    });
  };

  const handleViewChart = (chartId: string) => {
    setSelectedChartId(chartId);
    setActiveView('view-chart');
  };

  const handleEditChart = (chart: SeatingChart) => {
    setChartCreation({
      step: 2,
      name: chart.name,
      examId: chart.examId,
      hallId: chart.hallId,
      allocations: { ...chart.allocations },
      selectedSeats: new Set(),
      selectedStudents: new Set()
    });
    setSelectedChartId(chart.id);
    setActiveView('edit-chart');
  };

  const handleUpdateChart = (status: 'draft' | 'finalized') => {
    if (!selectedChartId) return;

    setSeatingCharts((prev) => prev.map((chart) => {
      if (chart.id === selectedChartId) {
        return {
          ...chart,
          name: chartCreation.name,
          allocations: chartCreation.allocations,
          status,
          updatedAt: new Date().toISOString()
        };
      }
      return chart;
    }));

    setActiveView('dashboard');
  };

  const handleDeleteChart = (chartId: string) => {
    if (confirm('Are you sure you want to delete this seating chart?')) {
      setSeatingCharts((prev) => prev.filter((c) => c.id !== chartId));
    }
  };

  const handleDuplicateChart = (chart: SeatingChart) => {
    const newChart: SeatingChart = {
      ...chart,
      id: Date.now().toString(),
      name: `${chart.name} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSeatingCharts((prev) => [...prev, newChart]);
  };

  // Export Functions
  const handleExportCSV = (chart: SeatingChart) => {
    const hall = halls.find((h) => h.id === chart.hallId);
    const exam = mockExams.find((e) => e.id === chart.examId);
    const allocations = Object.entries(chart.allocations).filter(([_, a]) => a !== null);

    const headers = ['Seat', 'Student Name', 'GR No', 'Roll No', 'Class', 'Section'];
    const rows = allocations.map(([seatId, alloc]) => [
    seatId,
    `"${alloc!.studentName}"`,
    alloc!.grNo,
    alloc!.rollNo,
    alloc!.standard,
    alloc!.section]
    );

    const csvContent = [
    `Seating Chart: ${chart.name}`,
    `Hall: ${hall?.name || 'Unknown'}`,
    `Exam: ${exam?.name || 'Unknown'}`,
    `Date: ${exam?.date ? formatDate(exam.date) : 'N/A'}`,
    '',
    headers.join(','),
    ...rows.map((r) => r.join(','))].
    join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${chart.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handlePrintChart = (chart: SeatingChart) => {
    const hall = halls.find((h) => h.id === chart.hallId);
    const exam = mockExams.find((e) => e.id === chart.examId);
    const allocations = Object.entries(chart.allocations).filter(([_, a]) => a !== null);

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const generateSeatGridHTML = () => {
      if (!hall) return '';

      let html = '<div style="margin: 20px 0;">';
      html += '<div style="background: #f3f4f6; padding: 10px; border-radius: 8px 8px 0 0; text-align: center; font-weight: bold; color: #6b7280; text-transform: uppercase; letter-spacing: 2px;">Invigilator Desk</div>';
      html += '<div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">';

      // Column headers
      html += '<div style="display: flex; gap: 8px; margin-bottom: 8px; padding-left: 30px;">';
      for (let c = 0; c < hall.columns; c++) {
        html += `<div style="width: 70px; text-align: center; font-weight: bold; color: #9ca3af;">${c + 1}</div>`;
      }
      html += '</div>';

      // Rows
      for (let r = 0; r < hall.rows; r++) {
        html += '<div style="display: flex; gap: 8px; margin-bottom: 8px;">';
        html += `<div style="width: 22px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #9ca3af;">${'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[r]}</div>`;

        for (let c = 0; c < hall.columns; c++) {
          const seatId = generateSeatId(r, c);
          const alloc = chart.allocations[seatId];
          const isBlocked = hall.blockedSeats.includes(seatId);

          let bgColor = '#ffffff';
          let borderColor = '#e5e7eb';
          let content = `<span style="color: #9ca3af; font-size: 10px;">${seatId}</span>`;

          if (isBlocked) {
            bgColor = '#fee2e2';
            borderColor = '#fecaca';
            content = '<span style="color: #ef4444; font-size: 10px;">BLOCKED</span>';
          } else if (alloc) {
            bgColor = '#e0e7ff';
            borderColor = '#a5b4fc';
            content = `
              <div style="font-size: 9px; font-weight: bold; color: #4f46e5;">${seatId}</div>
              <div style="font-size: 8px; color: #4338ca; margin-top: 2px;">${alloc.rollNo}</div>
              <div style="font-size: 7px; color: #6366f1; margin-top: 1px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 60px;">${alloc.studentName}</div>
            `;
          }

          html += `<div style="width: 70px; height: 55px; border: 1px solid ${borderColor}; border-radius: 4px; background: ${bgColor}; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 2px;">${content}</div>`;
        }
        html += '</div>';
      }

      html += '</div></div>';
      return html;
    };

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${chart.name} - Seating Chart</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; color: #1f2937; }
            h1 { color: #4f46e5; margin-bottom: 5px; }
            .header-info { color: #6b7280; margin-bottom: 20px; }
            .stats { display: flex; gap: 30px; margin: 20px 0; padding: 15px; background: #f3f4f6; border-radius: 8px; }
            .stat { text-align: center; }
            .stat-value { font-size: 24px; font-weight: bold; color: #4f46e5; }
            .stat-label { font-size: 12px; color: #6b7280; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #f3f4f6; padding: 10px; text-align: left; font-size: 12px; text-transform: uppercase; color: #6b7280; border-bottom: 2px solid #e5e7eb; }
            td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
            tr:hover { background: #f9fafb; }
            .seat-badge { background: #e0e7ff; color: #4f46e5; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 12px; }
            .class-badge { background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
            @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
          </style>
        </head>
        <body>
          <h1>${chart.name}</h1>
          <div class="header-info">
            <p><strong>Hall:</strong> ${hall?.name} (${hall?.building}, ${hall?.floor})</p>
            <p><strong>Exam:</strong> ${exam?.name}</p>
            <p><strong>Date:</strong> ${exam?.date ? formatDate(exam.date) : 'N/A'} | <strong>Time:</strong> ${exam?.time || 'N/A'}</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <div class="stats">
            <div class="stat">
              <div class="stat-value">${hall?.rows || 0}×${hall?.columns || 0}</div>
              <div class="stat-label">Layout</div>
            </div>
            <div class="stat">
              <div class="stat-value">${allocations.length}</div>
              <div class="stat-label">Allocated</div>
            </div>
            <div class="stat">
              <div class="stat-value">${(hall?.rows || 0) * (hall?.columns || 0) - allocations.length - (hall?.blockedSeats.length || 0)}</div>
              <div class="stat-label">Available</div>
            </div>
            <div class="stat">
              <div class="stat-value">${hall?.blockedSeats.length || 0}</div>
              <div class="stat-label">Blocked</div>
            </div>
          </div>

          <h2>Seating Layout</h2>
          ${generateSeatGridHTML()}

          <h2>Allocation List</h2>
          <table>
            <thead>
              <tr>
                <th>Seat</th>
                <th>Student Name</th>
                <th>GR No</th>
                <th>Roll No</th>
                <th>Class</th>
              </tr>
            </thead>
            <tbody>
              ${allocations.map(([seatId, alloc]) => `
                <tr>
                  <td><span class="seat-badge">${seatId}</span></td>
                  <td>${alloc!.studentName}</td>
                  <td>${alloc!.grNo}</td>
                  <td>${alloc!.rollNo}</td>
                  <td><span class="class-badge">${alloc!.standard}-${alloc!.section}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // ==================== RENDER HELPERS ====================
  const renderSeatGrid = (allocations: Record<string, SeatAllocation | null>, interactive = false) => {
    if (!selectedHall) return null;

    const rows = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    return (
      <div className="space-y-2">
        {/* Board/Invigilator Desk */}
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-3 rounded-t-xl text-center mb-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Invigilator Desk</p>
        </div>

        {/* Column Headers */}
        <div className="flex gap-2 pl-8">
          {Array.from({ length: selectedHall.columns }, (_, c) =>
          <div key={c} className="w-16 h-6 flex items-center justify-center text-xs font-bold text-gray-400">
              {c + 1}
            </div>
          )}
        </div>

        {/* Seat Rows */}
        {Array.from({ length: selectedHall.rows }, (_, r) =>
        <div key={r} className="flex gap-2">
            <div className="w-6 h-16 flex items-center justify-center text-xs font-bold text-gray-400">
              {rows[r]}
            </div>
            {Array.from({ length: selectedHall.columns }, (_, c) => {
            const seatId = generateSeatId(r, c);
            const alloc = allocations[seatId];
            const isBlocked = selectedHall.blockedSeats.includes(seatId);
            const isSelected = interactive && chartCreation.selectedSeats.has(seatId);

            return (
              <div
                key={seatId}
                onClick={() => interactive && handleSeatClick(seatId)}
                className={`
                    w-16 h-16 rounded-lg border-2 flex flex-col items-center justify-center 
                    transition-all relative group
                    ${interactive ? 'cursor-pointer' : ''}
                    ${isBlocked ?
                'bg-red-50 border-red-300 cursor-not-allowed' :
                alloc ?
                'bg-indigo-100 border-indigo-300' :
                isSelected ?
                'bg-yellow-100 border-yellow-400 ring-2 ring-yellow-300' :
                'bg-white border-gray-200 hover:border-indigo-300'}
                  `
                }>

                  {isBlocked ?
                <>
                      <Lock className="w-4 h-4 text-red-400" />
                      <span className="text-[8px] text-red-400 mt-1">BLOCKED</span>
                    </> :
                alloc ?
                <>
                      <span className="text-[9px] font-bold text-indigo-600">{seatId}</span>
                      <span className="text-[8px] text-indigo-700 mt-0.5">{alloc.rollNo}</span>
                      <UserCheck className="w-3 h-3 text-indigo-500 mt-0.5" />
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-[10px] p-2 rounded hidden group-hover:block z-20 whitespace-nowrap shadow-xl">
                        <p className="font-bold">{alloc.studentName}</p>
                        <p>{alloc.grNo} • Class {alloc.standard}-{alloc.section}</p>
                        {interactive &&
                    <button
                      onClick={(e) => {e.stopPropagation();handleRemoveAllocation(seatId);}}
                      className="mt-1 text-red-300 hover:text-red-100 flex items-center gap-1">

                            <Trash2 className="w-3 h-3" />Remove
                          </button>
                    }
                      </div>
                    </> :
                isSelected ?
                <>
                      <CheckSquare className="w-4 h-4 text-yellow-600" />
                      <span className="text-[8px] text-yellow-700 font-medium">{seatId}</span>
                    </> :

                <span className="text-xs text-gray-400">{seatId}</span>
                }
                </div>);

          })}
          </div>
        )}
      </div>);

  };

  // ==================== VIEWS ====================

  // Dashboard View
  const renderDashboard = () =>
  <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
      { label: 'Total Charts', value: seatingCharts.length, icon: FileSpreadsheet, color: 'indigo' },
      { label: 'Finalized', value: seatingCharts.filter((c) => c.status === 'finalized').length, icon: CheckCircle2, color: 'green' },
      { label: 'Drafts', value: seatingCharts.filter((c) => c.status === 'draft').length, icon: Edit3, color: 'yellow' },
      { label: 'Active Halls', value: halls.filter((h) => h.isActive).length, icon: Building2, color: 'blue' }].
      map((stat, i) =>
      <Card key={i} className={`p-4 border-l-4 border-l-${stat.color}-500`}>
            <div className="flex items-center gap-3">
              <div className={`p-3 bg-${stat.color}-50 rounded-xl`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </Card>
      )}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Button
        variant="primary"
        className="bg-indigo-600"
        onClick={handleStartCreateChart}>

          <Plus className="w-4 h-4 mr-2" />
          Create Seating Chart
        </Button>
        <Button
        variant="outline"
        onClick={() => setActiveView('halls')}>

          <Building2 className="w-4 h-4 mr-2" />
          Manage Halls
        </Button>
      </div>

      {/* Seating Charts List */}
      <Card>
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold">Seating Charts</h2>
            <Badge className="bg-indigo-100 text-indigo-700">{seatingCharts.length}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
              type="text"
              placeholder="Search charts..."
              className="pl-9 pr-4 py-2 text-sm border rounded-lg w-64" />

            </div>
          </div>
        </div>

        {seatingCharts.length === 0 ?
      <div className="p-12 text-center">
            <FileSpreadsheet className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Seating Charts Yet</h3>
            <p className="text-gray-500 mb-4">Create your first seating chart to get started</p>
            <Button
          variant="primary"
          className="bg-indigo-600"
          onClick={handleStartCreateChart}>

              <Plus className="w-4 h-4 mr-2" />
              Create Seating Chart
            </Button>
          </div> :

      <div className="divide-y">
            {seatingCharts.map((chart) => {
          const hall = halls.find((h) => h.id === chart.hallId);
          const exam = mockExams.find((e) => e.id === chart.examId);
          const allocatedCount = Object.values(chart.allocations).filter((a) => a !== null).length;
          const totalSeats = hall ? hall.rows * hall.columns : 0;

          return (
            <div key={chart.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${chart.status === 'finalized' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                        <FileSpreadsheet className={`w-6 h-6 ${chart.status === 'finalized' ? 'text-green-600' : 'text-yellow-600'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{chart.name}</h3>
                          <Badge className={chart.status === 'finalized' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                            {chart.status === 'finalized' ? 'Finalized' : 'Draft'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5" />
                            {hall?.name || 'Unknown Hall'}
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5" />
                            {exam?.name || 'Unknown Exam'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {exam?.date ? formatDate(exam.date) : 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1.5 text-sm">
                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                            <span className="text-gray-600">{allocatedCount} allocated</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm">
                            <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                            <span className="text-gray-600">{totalSeats - allocatedCount - (hall?.blockedSeats.length || 0)} available</span>
                          </div>
                          <div className="text-xs text-gray-400">
                            Updated {new Date(chart.updatedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewChart(chart.id)}>

                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePrintChart(chart)}>

                        <Printer className="w-4 h-4" />
                      </Button>
                      <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportCSV(chart)}>

                        <Download className="w-4 h-4" />
                      </Button>
                      <div className="relative group">
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                        <div className="absolute right-0 top-full mt-1 bg-white border rounded-lg shadow-lg py-1 hidden group-hover:block z-10 min-w-[140px]">
                          <button
                        onClick={() => handleEditChart(chart)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">

                            <Edit3 className="w-4 h-4" />Edit
                          </button>
                          <button
                        onClick={() => handleDuplicateChart(chart)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">

                            <Copy className="w-4 h-4" />Duplicate
                          </button>
                          <hr className="my-1" />
                          <button
                        onClick={() => handleDeleteChart(chart.id)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2">

                            <Trash2 className="w-4 h-4" />Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>);

        })}
          </div>
      }
      </Card>
    </div>;


  // Halls Management View
  const renderHallsManagement = () =>
  <div className="space-y-6">
      <Card>
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold">Examination Halls</h2>
            <Badge className="bg-indigo-100 text-indigo-700">{halls.length}</Badge>
          </div>
          <Button
          variant="primary"
          size="sm"
          className="bg-indigo-600"
          onClick={() => setShowHallModal(true)}>

            <Plus className="w-4 h-4 mr-1" />
            Add Hall
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4 p-4">
          {halls.map((hall) => {
          const totalSeats = hall.rows * hall.columns;
          const chartsUsingHall = seatingCharts.filter((c) => c.hallId === hall.id).length;

          return (
            <Card key={hall.id} className={`overflow-hidden ${!hall.isActive ? 'opacity-60' : ''}`}>
                <div className={`p-4 ${hall.isActive ? 'bg-gradient-to-r from-indigo-500 to-indigo-600' : 'bg-gray-400'} text-white`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{hall.name}</h3>
                      <p className="text-sm text-white/80">{hall.building}</p>
                    </div>
                    <Badge className="bg-white/20 text-white">
                      {hall.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {hall.floor}
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Rows</p>
                      <p className="font-bold text-lg">{hall.rows}</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Columns</p>
                      <p className="font-bold text-lg">{hall.columns}</p>
                    </div>
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <p className="text-xs text-indigo-600">Total</p>
                      <p className="font-bold text-lg text-indigo-600">{totalSeats}</p>
                    </div>
                  </div>

                  {hall.blockedSeats.length > 0 &&
                <div className="p-2 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-xs text-red-700">
                      <Lock className="w-3 h-3" />
                      {hall.blockedSeats.length} blocked seats
                    </div>
                }

                  {chartsUsingHall > 0 &&
                <div className="p-2 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-2 text-xs text-blue-700">
                      <ClipboardList className="w-3 h-3" />
                      Used in {chartsUsingHall} seating chart(s)
                    </div>
                }

                  <div className="flex gap-2">
                    <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEditHall(hall)}>

                      <Edit3 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600"
                    onClick={() => handleDeleteHall(hall.id)}>

                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>);

        })}

          {/* Add Hall Card */}
          <Card
          className="border-2 border-dashed flex items-center justify-center min-h-[280px] cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-colors"
          onClick={() => setShowHallModal(true)}>

            <div className="text-center">
              <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Plus className="w-7 h-7 text-indigo-600" />
              </div>
              <p className="font-semibold text-gray-700">Add New Hall</p>
              <p className="text-sm text-gray-500">Configure room layout</p>
            </div>
          </Card>
        </div>
      </Card>
    </div>;


  // Create/Edit Chart View
  const renderChartEditor = () =>
  <div className="space-y-6">
      {/* Progress Steps */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          {[
        { step: 1, label: 'Basic Info', icon: Info },
        { step: 2, label: 'Assign Seats', icon: Grid3X3 },
        { step: 3, label: 'Review & Save', icon: CheckCircle2 }].
        map((item, idx) =>
        <React.Fragment key={item.step}>
              <div className={`flex items-center gap-3 ${chartCreation.step >= item.step ? 'text-indigo-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            chartCreation.step > item.step ?
            'bg-indigo-600 text-white' :
            chartCreation.step === item.step ?
            'bg-indigo-100 text-indigo-600 border-2 border-indigo-600' :
            'bg-gray-100 text-gray-400'}`
            }>
                  {chartCreation.step > item.step ?
              <Check className="w-5 h-5" /> :

              <item.icon className="w-5 h-5" />
              }
                </div>
                <span className="font-medium">{item.label}</span>
              </div>
              {idx < 2 &&
          <div className={`flex-1 h-1 mx-4 rounded ${chartCreation.step > item.step ? 'bg-indigo-600' : 'bg-gray-200'}`} />
          }
            </React.Fragment>
        )}
        </div>
      </Card>

      {/* Step 1: Basic Info */}
      {chartCreation.step === 1 &&
    <Card className="p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Info className="w-5 h-5 text-indigo-600" />
            Chart Information
          </h2>
          
          <div className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Chart Name <span className="text-red-500">*</span>
              </label>
              <input
            type="text"
            value={chartCreation.name}
            onChange={(e) => setChartCreation((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., Mid-Term Math Exam - Hall A" />

            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Exam <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 gap-3">
                {mockExams.map((exam) =>
            <div
              key={exam.id}
              onClick={() => setChartCreation((prev) => ({ ...prev, examId: exam.id }))}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              chartCreation.examId === exam.id ?
              'border-indigo-500 bg-indigo-50' :
              'border-gray-200 hover:border-indigo-300'}`
              }>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{exam.name}</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(exam.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {exam.time}
                          </span>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                chartCreation.examId === exam.id ?
                'border-indigo-500 bg-indigo-500' :
                'border-gray-300'}`
                }>
                        {chartCreation.examId === exam.id && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                  </div>
            )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Hall <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {halls.filter((h) => h.isActive).map((hall) =>
            <div
              key={hall.id}
              onClick={() => setChartCreation((prev) => ({ ...prev, hallId: hall.id }))}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              chartCreation.hallId === hall.id ?
              'border-indigo-500 bg-indigo-50' :
              'border-gray-200 hover:border-indigo-300'}`
              }>

                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{hall.name}</h4>
                        <p className="text-sm text-gray-500">{hall.building}, {hall.floor}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className="bg-gray-100 text-gray-700 text-xs">
                            {hall.rows}×{hall.columns} = {hall.rows * hall.columns} seats
                          </Badge>
                          {hall.blockedSeats.length > 0 &&
                    <Badge className="bg-red-100 text-red-700 text-xs">
                              {hall.blockedSeats.length} blocked
                            </Badge>
                    }
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                chartCreation.hallId === hall.id ?
                'border-indigo-500 bg-indigo-500' :
                'border-gray-300'}`
                }>
                        {chartCreation.hallId === hall.id && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                  </div>
            )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
            <Button variant="outline" onClick={() => setActiveView('dashboard')}>
              Cancel
            </Button>
            <Button
          variant="primary"
          className="bg-indigo-600"
          onClick={handleNextStep}
          disabled={!chartCreation.name || !chartCreation.examId || !chartCreation.hallId}>

              Next Step
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </Card>
    }

      {/* Step 2: Assign Seats */}
      {chartCreation.step === 2 && selectedHall &&
    <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Students */}
          <div className="col-span-4 space-y-4">
            {/* Stats */}
            <Card className="p-4 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Grid3X3 className="w-4 h-4" />
                {selectedHall.name}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
            { label: 'Allocated', value: chartStats.allocated, bg: 'bg-white/20' },
            { label: 'Available', value: chartStats.available, bg: 'bg-white/20' },
            { label: 'Blocked', value: chartStats.blocked, bg: 'bg-red-500/30' },
            { label: 'Selected', value: chartCreation.selectedSeats.size, bg: 'bg-yellow-500/30' }].
            map((stat, i) =>
            <div key={i} className={`p-2 rounded ${stat.bg}`}>
                    <p className="text-xs opacity-80">{stat.label}</p>
                    <p className="text-xl font-bold">{stat.value}</p>
                  </div>
            )}
              </div>
            </Card>

            {/* Student Filters */}
            <Card className="overflow-hidden">
              <div className="p-3 bg-gray-50 border-b flex items-center justify-between">
                <span className="font-semibold text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  Select Students
                </span>
                <Badge className="bg-indigo-100 text-indigo-700">
                  {chartCreation.selectedStudents.size} selected
                </Badge>
              </div>

              <div className="p-3 space-y-2 border-b">
                <div className="grid grid-cols-2 gap-2">
                  <select
                value={studentFilter.standard}
                onChange={(e) => setStudentFilter((prev) => ({ ...prev, standard: e.target.value }))}
                className="text-sm border rounded-lg p-2">

                    <option value="">All Classes</option>
                    {['9', '10', '11', '12'].map((s) =>
                <option key={s} value={s}>Class {s}</option>
                )}
                  </select>
                  <select
                value={studentFilter.section}
                onChange={(e) => setStudentFilter((prev) => ({ ...prev, section: e.target.value }))}
                className="text-sm border rounded-lg p-2">

                    <option value="">All Sections</option>
                    {['A', 'B', 'C', 'D'].map((s) =>
                <option key={s} value={s}>Section {s}</option>
                )}
                  </select>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                type="text"
                placeholder="Search by name or GR..."
                value={studentFilter.search}
                onChange={(e) => setStudentFilter((prev) => ({ ...prev, search: e.target.value }))}
                className="w-full text-sm border rounded-lg p-2 pl-9" />

                </div>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {filteredStudents.map((student) => {
              const isAllocated = allocatedStudentIds.has(student.id);
              const isSelected = chartCreation.selectedStudents.has(student.id);

              return (
                <div
                  key={student.id}
                  onClick={() => handleStudentSelect(student.id)}
                  className={`flex items-center gap-3 p-3 border-b cursor-pointer transition-all ${
                  isAllocated ?
                  'bg-green-50 opacity-60 cursor-not-allowed' :
                  isSelected ?
                  'bg-indigo-50' :
                  'hover:bg-gray-50'}`
                  }>

                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  isSelected ?
                  'bg-indigo-600 border-indigo-600' :
                  isAllocated ?
                  'bg-green-500 border-green-500' :
                  'border-gray-300'}`
                  }>
                        {(isSelected || isAllocated) && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                        {getInitials(student.fullName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{student.fullName}</p>
                        <p className="text-xs text-gray-500">{student.grNo} • {student.standard}-{student.section}</p>
                      </div>
                      {isAllocated &&
                  <Badge className="bg-green-100 text-green-700 text-xs">
                          <Check className="w-3 h-3 mr-1" />Assigned
                        </Badge>
                  }
                    </div>);

            })}
              </div>
            </Card>

            {/* Actions */}
            <Card className="p-4 space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-600" />
                Quick Actions
              </h4>
              <Button
            variant="primary"
            className="w-full bg-indigo-600"
            onClick={handleAssignStudents}
            disabled={chartCreation.selectedSeats.size === 0 || chartCreation.selectedStudents.size === 0}>

                <ArrowRight className="w-4 h-4 mr-2" />
                Assign {chartCreation.selectedStudents.size} → {chartCreation.selectedSeats.size} Seats
              </Button>
              <Button
            variant="outline"
            className="w-full"
            onClick={handleAutoAssign}>

                <Zap className="w-4 h-4 mr-2" />
                Auto-Assign All
              </Button>
              <Button
            variant="outline"
            className="w-full text-red-600"
            onClick={handleClearAllAllocations}>

                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </Card>

            {/* Legend */}
            <Card className="p-4">
              <h4 className="font-semibold text-sm mb-3">Legend</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
            { bg: 'bg-white border-gray-200', label: 'Available' },
            { bg: 'bg-indigo-100 border-indigo-300', label: 'Allocated' },
            { bg: 'bg-yellow-100 border-yellow-400', label: 'Selected' },
            { bg: 'bg-red-50 border-red-300', label: 'Blocked' }].
            map((item, i) =>
            <div key={i} className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded border-2 ${item.bg}`} />
                    <span>{item.label}</span>
                  </div>
            )}
              </div>
            </Card>
          </div>

          {/* Right Panel - Seat Grid */}
          <div className="col-span-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4 pb-4 border-b">
                <div>
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Grid3X3 className="w-5 h-5 text-indigo-600" />
                    Seating Layout
                  </h2>
                  <p className="text-sm text-gray-500">Click seats to select, then assign students</p>
                </div>
                <div className="flex gap-2">
                  <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const availableSeats: string[] = [];
                  for (let r = 0; r < selectedHall.rows; r++) {
                    for (let c = 0; c < selectedHall.columns; c++) {
                      const seatId = generateSeatId(r, c);
                      if (!selectedHall.blockedSeats.includes(seatId) && !chartCreation.allocations[seatId]) {
                        availableSeats.push(seatId);
                      }
                    }
                  }
                  if (chartCreation.selectedSeats.size === availableSeats.length) {
                    setChartCreation((prev) => ({ ...prev, selectedSeats: new Set() }));
                  } else {
                    setChartCreation((prev) => ({ ...prev, selectedSeats: new Set(availableSeats) }));
                  }
                }}>

                    {chartCreation.selectedSeats.size === chartStats.available ?
                <>
                        <CheckSquare className="w-4 h-4 mr-1" />
                        Deselect All
                      </> :

                <>
                        <Square className="w-4 h-4 mr-1" />
                        Select All
                      </>
                }
                  </Button>
                  <Button
                variant="ghost"
                size="sm"
                onClick={() => setChartCreation((prev) => ({ ...prev, selectedSeats: new Set() }))}>

                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                {renderSeatGrid(chartCreation.allocations, true)}
              </div>

              {/* Summary */}
              <div className="mt-6 pt-4 border-t flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-indigo-500 rounded" />
                    {chartStats.allocated} Allocated
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gray-300 rounded" />
                    {chartStats.available} Available
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-400 rounded" />
                    {chartStats.blocked} Blocked
                  </span>
                </div>
              </div>
            </Card>

            {/* Allocated List */}
            {chartStats.allocated > 0 &&
        <Card className="mt-4 overflow-hidden">
                <div className="p-3 bg-gray-50 border-b flex items-center justify-between">
                  <span className="font-semibold text-sm flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-indigo-600" />
                    Current Allocations
                  </span>
                  <Badge className="bg-indigo-100 text-indigo-700">{chartStats.allocated}</Badge>
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {Object.entries(chartCreation.allocations).
            filter(([_, a]) => a !== null).
            map(([seatId, alloc]) =>
            <div key={seatId} className="flex items-center justify-between p-3 border-b hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <Badge className="bg-indigo-100 text-indigo-700 font-bold">{seatId}</Badge>
                          <div>
                            <p className="text-sm font-medium">{alloc!.studentName}</p>
                            <p className="text-xs text-gray-500">{alloc!.grNo} • {alloc!.standard}-{alloc!.section}</p>
                          </div>
                        </div>
                        <Button
                variant="ghost"
                size="sm"
                className="text-red-600"
                onClick={() => handleRemoveAllocation(seatId)}>

                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
            )
            }
                </div>
              </Card>
        }

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handlePrevStep}>
                <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
                Previous
              </Button>
              <Button
            variant="primary"
            className="bg-indigo-600"
            onClick={handleNextStep}>

                Review & Save
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
    }

      {/* Step 3: Review & Save */}
      {chartCreation.step === 3 && selectedHall && selectedExam &&
    <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              Review Seating Chart
            </h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-indigo-50 rounded-xl">
                <p className="text-sm text-indigo-600 mb-1">Chart Name</p>
                <p className="font-bold text-indigo-900">{chartCreation.name}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-blue-600 mb-1">Exam</p>
                <p className="font-bold text-blue-900">{selectedExam.name}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl">
                <p className="text-sm text-purple-600 mb-1">Hall</p>
                <p className="font-bold text-purple-900">{selectedHall.name}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <p className="text-sm text-green-600 mb-1">Allocated</p>
                <p className="font-bold text-green-900">{chartStats.allocated} / {chartStats.total} seats</p>
              </div>
            </div>

            {/* Seating Grid Preview */}
            <div className="border rounded-xl p-6 mb-6">
              <h3 className="font-semibold mb-4">Seating Layout Preview</h3>
              <div className="overflow-x-auto">
                {renderSeatGrid(chartCreation.allocations, false)}
              </div>
            </div>

            {/* Allocation Table */}
            {chartStats.allocated > 0 &&
        <div className="border rounded-xl overflow-hidden mb-6">
                <div className="p-4 bg-gray-50 border-b">
                  <h3 className="font-semibold">Allocation List ({chartStats.allocated} students)</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Seat</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Student</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">GR No</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Roll No</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Class</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {Object.entries(chartCreation.allocations).
                filter(([_, a]) => a !== null).
                sort(([a], [b]) => a.localeCompare(b)).
                map(([seatId, alloc]) =>
                <tr key={seatId} className="hover:bg-gray-50">
                            <td className="px-4 py-2">
                              <Badge className="bg-indigo-100 text-indigo-700 font-bold">{seatId}</Badge>
                            </td>
                            <td className="px-4 py-2 font-medium">{alloc!.studentName}</td>
                            <td className="px-4 py-2 text-sm text-gray-600">{alloc!.grNo}</td>
                            <td className="px-4 py-2 text-sm">{alloc!.rollNo}</td>
                            <td className="px-4 py-2">
                              <Badge className="bg-gray-100">{alloc!.standard}-{alloc!.section}</Badge>
                            </td>
                          </tr>
                )
                }
                    </tbody>
                  </table>
                </div>
              </div>
        }

            {/* Warning if no allocations */}
            {chartStats.allocated === 0 &&
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3 mb-6">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-800">No Students Allocated</p>
                  <p className="text-sm text-yellow-700">You can save as draft and complete allocations later.</p>
                </div>
              </div>
        }

            {/* Actions */}
            <div className="flex justify-between pt-6 border-t">
              <Button variant="outline" onClick={handlePrevStep}>
                <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
                Back to Edit
              </Button>
              <div className="flex gap-3">
                <Button
              variant="outline"
              onClick={() => handleSaveChart('draft')}>

                  <Save className="w-4 h-4 mr-2" />
                  Save as Draft
                </Button>
                <Button
              variant="primary"
              className="bg-green-600"
              onClick={() => handleSaveChart('finalized')}
              disabled={chartStats.allocated === 0}>

                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Finalize & Save
                </Button>
              </div>
            </div>
          </Card>
        </div>
    }
    </div>;


  // View Chart View
  const renderViewChart = () => {
    if (!selectedChart) {
      return (
        <Card className="p-12 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">Chart not found</p>
        </Card>);

    }

    const hall = halls.find((h) => h.id === selectedChart.hallId);
    const exam = mockExams.find((e) => e.id === selectedChart.examId);
    const allocations = Object.entries(selectedChart.allocations).filter(([_, a]) => a !== null);

    return (
      <div className="space-y-6" ref={printRef}>
        {/* Header */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{selectedChart.name}</h1>
                <Badge className={selectedChart.status === 'finalized' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                  {selectedChart.status === 'finalized' ? 'Finalized' : 'Draft'}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {hall?.name || 'Unknown Hall'}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {exam?.name || 'Unknown Exam'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {exam?.date ? formatDate(exam.date) : 'N/A'}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {exam?.time || 'N/A'}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleEditChart(selectedChart)}>
                <Edit3 className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExportCSV(selectedChart)}>
                <Download className="w-4 h-4 mr-1" />
                CSV
              </Button>
              <Button variant="primary" size="sm" className="bg-indigo-600" onClick={() => handlePrintChart(selectedChart)}>
                <Printer className="w-4 h-4 mr-1" />
                Print
              </Button>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
          { label: 'Total Seats', value: hall ? hall.rows * hall.columns : 0, icon: Grid3X3, color: 'indigo' },
          { label: 'Allocated', value: allocations.length, icon: UserCheck, color: 'green' },
          { label: 'Available', value: hall ? hall.rows * hall.columns - allocations.length - hall.blockedSeats.length : 0, icon: Square, color: 'blue' },
          { label: 'Blocked', value: hall?.blockedSeats.length || 0, icon: Lock, color: 'red' }].
          map((stat, i) =>
          <Card key={i} className={`p-4 border-l-4 border-l-${stat.color}-500`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 bg-${stat.color}-50 rounded-lg`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Seating Grid */}
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-indigo-600" />
            Seating Layout
          </h2>
          <div className="overflow-x-auto">
            {hall && renderSeatGrid(selectedChart.allocations, false)}
          </div>
        </Card>

        {/* Allocation Table */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-indigo-600" />
              Allocation List
            </h2>
            <Badge className="bg-indigo-100 text-indigo-700">{allocations.length} students</Badge>
          </div>
          {allocations.length === 0 ?
          <div className="p-12 text-center">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">No allocations in this chart</p>
            </div> :

          <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">#</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Seat</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Student Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">GR No</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Roll No</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Class</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {allocations.
                sort(([a], [b]) => a.localeCompare(b)).
                map(([seatId, alloc], idx) =>
                <tr key={seatId} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-500">{idx + 1}</td>
                        <td className="px-4 py-3">
                          <Badge className="bg-indigo-100 text-indigo-700 font-bold">{seatId}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                              {getInitials(alloc!.studentName)}
                            </div>
                            <span className="font-medium">{alloc!.studentName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-mono text-gray-600">{alloc!.grNo}</td>
                        <td className="px-4 py-3 text-sm">{alloc!.rollNo}</td>
                        <td className="px-4 py-3">
                          <Badge className="bg-gray-100">{alloc!.standard}-{alloc!.section}</Badge>
                        </td>
                      </tr>
                )
                }
                </tbody>
              </table>
            </div>
          }
        </Card>
      </div>);

  };

  // ==================== MAIN RENDER ====================
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-xl shadow-lg">
              <Layout className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Exam Hall Management</h1>
              <p className="text-sm text-gray-500">Configure halls, create seating charts, and manage exam arrangements</p>
            </div>
          </div>
          {activeView !== 'dashboard' &&
          <Button variant="outline" onClick={() => setActiveView('dashboard')}>
              <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
              Back to Dashboard
            </Button>
          }
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeView === 'dashboard' ? 'primary' : 'outline'}
          onClick={() => setActiveView('dashboard')}
          className={activeView === 'dashboard' ? 'bg-indigo-600' : ''}>

          <Home className="w-4 h-4 mr-2" />
          Dashboard
        </Button>
        <Button
          variant={activeView === 'halls' ? 'primary' : 'outline'}
          onClick={() => setActiveView('halls')}
          className={activeView === 'halls' ? 'bg-indigo-600' : ''}>

          <Building2 className="w-4 h-4 mr-2" />
          Halls
        </Button>
        {(activeView === 'create-chart' || activeView === 'edit-chart') &&
        <Button
          variant="primary"
          className="bg-indigo-600">

            <FileSpreadsheet className="w-4 h-4 mr-2" />
            {activeView === 'edit-chart' ? 'Edit Chart' : 'Create Chart'}
          </Button>
        }
        {activeView === 'view-chart' && selectedChart &&
        <Button
          variant="primary"
          className="bg-indigo-600">

            <Eye className="w-4 h-4 mr-2" />
            {selectedChart.name}
          </Button>
        }
      </div>

      {/* Content */}
      {activeView === 'dashboard' && renderDashboard()}
      {activeView === 'halls' && renderHallsManagement()}
      {(activeView === 'create-chart' || activeView === 'edit-chart') && renderChartEditor()}
      {activeView === 'view-chart' && renderViewChart()}

      {/* Hall Modal */}
      {showHallModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                {editingHall ? 'Edit Hall' : 'Add New Hall'}
              </h2>
              <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowHallModal(false);
                setEditingHall(null);
                setHallForm({ name: '', building: '', floor: '', rows: 5, columns: 6 });
              }}>

                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Hall Name <span className="text-red-500">*</span>
                </label>
                <input
                type="text"
                value={hallForm.name}
                onChange={(e) => setHallForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Main Hall A" />

              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Building <span className="text-red-500">*</span>
                  </label>
                  <input
                  type="text"
                  value={hallForm.building}
                  onChange={(e) => setHallForm((prev) => ({ ...prev, building: e.target.value }))}
                  className="w-full border rounded-lg p-3"
                  placeholder="e.g., Academic Block" />

                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Floor <span className="text-red-500">*</span>
                  </label>
                  <input
                  type="text"
                  value={hallForm.floor}
                  onChange={(e) => setHallForm((prev) => ({ ...prev, floor: e.target.value }))}
                  className="w-full border rounded-lg p-3"
                  placeholder="e.g., 1st Floor" />

                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Number of Rows (A-Z)
                  </label>
                  <input
                  type="number"
                  value={hallForm.rows}
                  onChange={(e) => setHallForm((prev) => ({ ...prev, rows: Math.min(26, Math.max(1, parseInt(e.target.value) || 1)) }))}
                  min={1}
                  max={26}
                  className="w-full border rounded-lg p-3" />

                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Number of Columns
                  </label>
                  <input
                  type="number"
                  value={hallForm.columns}
                  onChange={(e) => setHallForm((prev) => ({ ...prev, columns: Math.min(20, Math.max(1, parseInt(e.target.value) || 1)) }))}
                  min={1}
                  max={20}
                  className="w-full border rounded-lg p-3" />

                </div>
              </div>

              {/* Preview */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm font-medium text-gray-700 mb-3">Seating Layout Preview</p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-600">
                    {hallForm.rows} Rows × {hallForm.columns} Columns
                  </span>
                  <Badge className="bg-indigo-100 text-indigo-700 text-lg font-bold">
                    {hallForm.rows * hallForm.columns} Seats
                  </Badge>
                </div>
                <div className="overflow-x-auto max-h-32">
                  <div className="inline-block">
                    {Array.from({ length: Math.min(hallForm.rows, 5) }, (_, r) =>
                  <div key={r} className="flex gap-1 mb-1">
                        {Array.from({ length: Math.min(hallForm.columns, 10) }, (_, c) =>
                    <div
                      key={c}
                      className="w-6 h-6 rounded border border-gray-300 bg-white text-[8px] flex items-center justify-center text-gray-400">

                            {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[r]}{c + 1}
                          </div>
                    )}
                        {hallForm.columns > 10 &&
                    <span className="text-xs text-gray-400 ml-1">+{hallForm.columns - 10}</span>
                    }
                      </div>
                  )}
                    {hallForm.rows > 5 &&
                  <p className="text-xs text-gray-400 mt-1">+{hallForm.rows - 5} more rows</p>
                  }
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
              <Button
              variant="outline"
              onClick={() => {
                setShowHallModal(false);
                setEditingHall(null);
                setHallForm({ name: '', building: '', floor: '', rows: 5, columns: 6 });
              }}>

                Cancel
              </Button>
              <Button
              variant="primary"
              className="bg-indigo-600"
              onClick={handleAddHall}>

                <Save className="w-4 h-4 mr-2" />
                {editingHall ? 'Save Changes' : 'Create Hall'}
              </Button>
            </div>
          </Card>
        </div>
      }
    </div>);

}

export default ExamHallManagement;