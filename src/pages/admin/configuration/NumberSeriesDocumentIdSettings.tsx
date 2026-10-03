// filepath: src/pages/settings/NumberSeriesDocumentIdSettings/NumberSeriesDocumentIdSettings.tsx

import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Save, Eye, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react';

interface NumberSeries {
  id: number;
  entity: string;
  prefix: string;
  len: number;
  reset: string;
  sample: string;
  currentNumber: number;
  lastReset: string;
}

export function NumberSeriesDocumentIdSettings() {
  const [series, setSeries] = useState<NumberSeries[]>([
  {
    id: 1,
    entity: 'Student Admission No',
    prefix: 'ADM/',
    len: 4,
    reset: 'Never',
    sample: 'ADM/0042',
    currentNumber: 42,
    lastReset: 'N/A'
  },
  {
    id: 2,
    entity: 'Employee Code',
    prefix: 'EMP-',
    len: 3,
    reset: 'Never',
    sample: 'EMP-021',
    currentNumber: 21,
    lastReset: 'N/A'
  },
  {
    id: 3,
    entity: 'Fee Receipt No',
    prefix: 'RCP/{YY}/',
    len: 5,
    reset: 'Yearly',
    sample: 'RCP/24/00105',
    currentNumber: 105,
    lastReset: '2024-01-01'
  },
  {
    id: 4,
    entity: 'Invoice No',
    prefix: 'INV/',
    len: 5,
    reset: 'Yearly',
    sample: 'INV/00056',
    currentNumber: 56,
    lastReset: '2024-01-01'
  },
  {
    id: 5,
    entity: 'Ticket No',
    prefix: 'TKT-',
    len: 6,
    reset: 'Never',
    sample: 'TKT-001204',
    currentNumber: 1204,
    lastReset: 'N/A'
  }]
  );

  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: 'success' | 'error' | null;
    text: string;
  }>({ type: null, text: '' });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const generateSample = (
  prefix: string,
  len: number,
  currentNumber: number)
  : string => {
    const now = new Date();
    const year2 = now.getFullYear().toString().slice(-2);
    const year4 = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');

    let processedPrefix = prefix.
    replace(/{YY}/g, year2).
    replace(/{YYYY}/g, year4).
    replace(/{MM}/g, month);

    const paddedNumber = currentNumber.toString().padStart(len, '0');
    return `${processedPrefix}${paddedNumber}`;
  };

  const handlePrefixChange = (id: number, newPrefix: string) => {
    setSeries((prev) =>
    prev.map((item) => {
      if (item.id === id) {
        const newSample = generateSample(newPrefix, item.len, item.currentNumber);
        return { ...item, prefix: newPrefix, sample: newSample };
      }
      return item;
    })
    );
    setHasUnsavedChanges(true);
  };

  const handleLengthChange = (id: number, newLen: string) => {
    const length = parseInt(newLen);
    setSeries((prev) =>
    prev.map((item) => {
      if (item.id === id) {
        const newSample = generateSample(item.prefix, length, item.currentNumber);
        return { ...item, len: length, sample: newSample };
      }
      return item;
    })
    );
    setHasUnsavedChanges(true);
  };

  const handleResetChange = (id: number, newReset: string) => {
    setSeries((prev) =>
    prev.map((item) => {
      if (item.id === id) {
        const lastReset =
        newReset === 'Never' ?
        'N/A' :
        newReset === 'Yearly' ?
        new Date().getFullYear() + '-01-01' :
        new Date().toISOString().slice(0, 7) + '-01';
        return { ...item, reset: newReset, lastReset };
      }
      return item;
    })
    );
    setHasUnsavedChanges(true);
  };

  const handleResetCounter = (id: number) => {
    const confirmed = window.confirm(
      'Are you sure you want to reset this counter to 1? This action cannot be undone.'
    );
    if (confirmed) {
      setSeries((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newSample = generateSample(item.prefix, item.len, 1);
          return {
            ...item,
            currentNumber: 1,
            sample: newSample,
            lastReset: new Date().toISOString().split('T')[0]
          };
        }
        return item;
      })
      );
      setHasUnsavedChanges(true);
      setSaveMessage({
        type: 'success',
        text: 'Counter reset successfully'
      });
      setTimeout(() => setSaveMessage({ type: null, text: '' }), 3000);
    }
  };

  const handlePreviewAll = () => {
    setPreviewModalOpen(true);
  };

  const handleSavePatterns = () => {
    // Simulate API call
    setTimeout(() => {
      setSaveMessage({
        type: 'success',
        text: 'Number series patterns saved successfully!'
      });
      setHasUnsavedChanges(false);
      setTimeout(() => setSaveMessage({ type: null, text: '' }), 3000);
    }, 500);
  };

  const columns = [
  {
    key: 'entity',
    header: 'Entity Name',
    render: (row: NumberSeries) =>
    <div>
          <div className="font-medium">{row.entity}</div>
          <div className="text-xs text-gray-500">
            Current: #{row.currentNumber}
          </div>
        </div>

  },
  {
    key: 'prefix',
    header: 'Prefix Pattern',
    render: (row: NumberSeries) =>
    <Input
      defaultValue={row.prefix}
      className="w-32"
      onChange={(e) => handlePrefixChange(row.id, e.target.value)} />


  },
  {
    key: 'len',
    header: 'Seq Length',
    render: (row: NumberSeries) =>
    <Select
      options={[
      { value: '3', label: '3 Digits' },
      { value: '4', label: '4 Digits' },
      { value: '5', label: '5 Digits' },
      { value: '6', label: '6 Digits' }]
      }
      defaultValue={String(row.len)}
      className="w-28"
      onChange={(e) => handleLengthChange(row.id, e.target.value)} />


  },
  {
    key: 'reset',
    header: 'Reset Rule',
    render: (row: NumberSeries) =>
    <div>
          <Select
        options={[
        { value: 'Never', label: 'Never' },
        { value: 'Yearly', label: 'Yearly' },
        { value: 'Monthly', label: 'Monthly' }]
        }
        defaultValue={row.reset}
        className="w-32"
        onChange={(e) => handleResetChange(row.id, e.target.value)} />

          {row.lastReset !== 'N/A' &&
      <div className="text-xs text-gray-500 mt-1">
              Last: {row.lastReset}
            </div>
      }
        </div>

  },
  {
    key: 'sample',
    header: 'Preview',
    render: (row: NumberSeries) =>
    <span className="font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded">
          {row.sample}
        </span>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: NumberSeries) =>
    <Button
      variant="outline"
      size="sm"
      onClick={() => handleResetCounter(row.id)}>

          <RotateCcw className="w-3 h-3 mr-1" />
          Reset
        </Button>

  }];


  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Number Series Settings
          </h1>
          <p className="text-sm text-gray-500">
            Configure automatic numbering patterns for system entities
          </p>
          {hasUnsavedChanges &&
          <p className="text-sm text-orange-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              You have unsaved changes
            </p>
          }
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreviewAll}>
            <Eye className="w-4 h-4 mr-2" />
            Preview All
          </Button>
          <Button
            variant="primary"
            onClick={handleSavePatterns}
            disabled={!hasUnsavedChanges}>

            <Save className="w-4 h-4 mr-2" />
            Save Patterns
          </Button>
        </div>
      </div>

      {saveMessage.type &&
      <div
        className={`flex items-center gap-2 p-4 rounded-lg ${
        saveMessage.type === 'success' ?
        'bg-green-50 border border-green-200 text-green-800' :
        'bg-red-50 border border-red-200 text-red-800'}`
        }>

          {saveMessage.type === 'success' ?
        <CheckCircle className="w-5 h-5" /> :

        <AlertCircle className="w-5 h-5" />
        }
          <span className="font-medium">{saveMessage.text}</span>
        </div>
      }

      <Card noPadding>
        <Table columns={columns} data={series} />
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <p className="font-semibold mb-1">Pattern Variables:</p>
        <p>{`{YY} = 2-digit year (24), {YYYY} = 4-digit year (2024), {MM} = Month (04)`}</p>
      </div>

      {/* Preview Modal */}
      {previewModalOpen &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Preview All Number Series</h2>
              <button
              onClick={() => setPreviewModalOpen(false)}
              className="text-gray-500 hover:text-gray-700">

                ✕
              </button>
            </div>

            <div className="space-y-4">
              {series.map((item) =>
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg p-4">

                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {item.entity}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Pattern: {item.prefix} + {item.len} digits
                      </p>
                    </div>
                    <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {item.reset} Reset
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded p-3 mt-2">
                    <p className="text-xs text-gray-600 mb-1">Sample Sequence:</p>
                    <div className="flex gap-2 flex-wrap font-mono text-sm">
                      {[0, 1, 2, 3, 4].map((offset) => {
                    const sampleNum = item.currentNumber + offset;
                    return (
                      <span
                        key={offset}
                        className="bg-white border border-gray-200 px-2 py-1 rounded">

                            {generateSample(item.prefix, item.len, sampleNum)}
                          </span>);

                  })}
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-gray-500">
                    Current Counter: #{item.currentNumber}
                    {item.lastReset !== 'N/A' &&
                ` | Last Reset: ${item.lastReset}`}
                  </div>
                </div>
            )}
            </div>

            <div className="mt-6 flex justify-end">
              <Button
              variant="primary"
              onClick={() => setPreviewModalOpen(false)}>

                Close Preview
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}