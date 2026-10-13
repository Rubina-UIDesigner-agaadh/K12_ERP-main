import React, { useState } from 'react';
import { Download, Printer } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export function AllotmentLetter() {
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-wrap items-start justify-between gap-3 max-w-3xl mx-auto">
        <div>
          <p className="text-xs text-gray-500">Home → Allotment Letter</p>
          <h1 className="text-2xl font-bold mt-1">Allotment Letter</h1>
          <p className="text-sm text-gray-500">Printable / PDF preview — mock frontend</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setNotice('Print dialog (mock).')}><Printer className="w-4 h-4 mr-1" /> Print</Button>
          <Button onClick={() => setNotice('Allotment-Letter-Priya-Sharma.pdf downloaded.')}><Download className="w-4 h-4 mr-1" /> Download PDF</Button>
        </div>
      </div>
      {notice && <div className="max-w-3xl mx-auto rounded-lg bg-indigo-50 border border-indigo-200 px-4 py-3 text-sm text-indigo-800">{notice}</div>}

      <div className="max-w-3xl mx-auto bg-white shadow-lg border p-10 text-sm leading-relaxed">
        <p className="text-center font-bold text-lg">DELHI PUBLIC SCHOOL</p>
        <p className="text-center text-gray-600">Provisional Stream Allotment Letter — 2025-26</p>
        <hr className="my-6" />
        <p>Letter No. <b>AL/2025/1001</b> &nbsp; Date: <b>24 June 2025</b></p>
        <p className="mt-4">To,<br />Priya Sharma<br />Roll No. CBSE1001 &nbsp; Application APP-1001<br />Category: General</p>
        <p className="mt-4">This is to certify that you have been provisionally allotted:</p>
        <div className="my-4 border rounded-lg p-4 bg-gray-50">
          <p><b>Stream:</b> Science</p>
          <p><b>Combination:</b> PCM</p>
          <p><b>Elective:</b> Computer Science</p>
          <p><b>Section:</b> A</p>
          <p><b>Round:</b> 1</p>
        </div>
        <p>This allotment is subject to document verification and payment of fees by 30 June 2025. Non-acceptance within 48 hours of result publication will forfeit the seat.</p>
        <p className="mt-8">Sd/-<br />Principal / Admission Cell</p>
        <p className="mt-6 text-xs text-gray-500">This is a system-generated mock letter for frontend preview. Not a legal document.</p>
      </div>
    </div>
  );
}

export default AllotmentLetter;
