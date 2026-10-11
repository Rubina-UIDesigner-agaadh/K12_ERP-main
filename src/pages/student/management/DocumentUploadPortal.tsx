import React, { useState } from 'react';
import { Upload, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

const INITIAL = [
  { type: 'Class 10 Marksheet', required: true, status: 'Verified', file: 'marksheet.pdf' },
  { type: 'Transfer Certificate', required: true, status: 'Verified', file: 'tc.pdf' },
  { type: 'Caste Certificate', required: false, status: 'Not uploaded', file: '' },
  { type: 'Income Certificate', required: true, status: 'Pending', file: 'income.pdf' },
  { type: 'Photo', required: true, status: 'Not uploaded', file: '' }
];

export function DocumentUploadPortal() {
  const [docs, setDocs] = useState(INITIAL);
  const [notice, setNotice] = useState<string | null>(null);

  const icon = (s: string) => s === 'Verified' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : s === 'Pending' ? <Clock className="w-4 h-4 text-amber-600" /> : <XCircle className="w-4 h-4 text-gray-400" />;

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen max-w-3xl">
      <div>
        <p className="text-xs text-gray-500">Home → Documents</p>
        <h1 className="text-2xl font-bold mt-1">Document Upload Portal</h1>
        <p className="text-sm text-gray-500">PDF / JPG up to 2 MB. Verified files cannot be replaced.</p>
      </div>
      {notice && <div className="rounded-lg bg-indigo-50 border border-indigo-200 px-4 py-3 text-sm text-indigo-800">{notice}</div>}

      <div className="bg-white rounded-xl border divide-y">
        {docs.map((d) => (
          <div key={d.type} className="px-5 py-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              {icon(d.status)}
              <div>
                <p className="font-medium">{d.type} {d.required && <span className="text-red-500">*</span>}</p>
                <p className="text-xs text-gray-500">{d.file || 'No file'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={d.status === 'Verified' ? 'success' : d.status === 'Pending' ? 'warning' : 'secondary'}>{d.status}</Badge>
              {d.status !== 'Verified' && (
                <Button size="sm" variant="outline" onClick={() => {
                  setDocs((rows) => rows.map((r) => r.type === d.type ? { ...r, status: 'Pending', file: `${d.type.replace(/\s+/g, '-').toLowerCase()}.pdf` } : r));
                  setNotice(`${d.type} uploaded for verification.`);
                }}><Upload className="w-4 h-4 mr-1" /> Upload</Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DocumentUploadPortal;
