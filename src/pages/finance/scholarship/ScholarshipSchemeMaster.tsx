import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import {
  Plus,
  Settings2,
  Building2,
  Calendar,
  Coins,
  Percent,
  Layers,
  Clock,
  Trash2,
  Edit3,
  CheckCircle2,
  CalendarRange } from
'lucide-react';

// Mock existing schemes
const INITIAL_SCHEMES = [
{
  id: 'SCH-001',
  name: 'Girl Child Education 2024',
  donor: 'Global Trust Foundation',
  budget: 500000,
  allocationType: 'Fixed',
  amount: 25000,
  frequency: 'Yearly',
  validFrom: '2024-04-01',
  validTo: '2025-03-31',
  status: 'Active'
},
{
  id: 'SCH-002',
  name: 'Academic Excellence Merit',
  donor: 'Alumni Association',
  budget: 1200000,
  allocationType: 'Percentage',
  amount: 50, // 50%
  frequency: 'Monthly',
  validFrom: '2024-06-01',
  validTo: '2025-05-31',
  status: 'Active'
}];


export function ScholarshipSchemeMaster() {
  const [showForm, setShowForm] = useState(false);
  const [allocationType, setAllocationType] = useState('Fixed');

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings2 className="w-6 h-6 text-blue-600" />
            Scholarship Scheme Master
          </h1>
          <p className="text-gray-500 text-sm">Define and configure scholarship products and eligibility rules.</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200">

          {showForm ? 'View All Schemes' :
          <><Plus className="w-4 h-4 mr-2" /> Create New Scheme</>
          }
        </Button>
      </div>

      {showForm ? (
      /* Configuration Form */
      <Card className="max-w-4xl mx-auto border-none shadow-xl">
          <div className="p-6 border-b border-gray-100 flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Layers className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">New Scheme Configuration</h2>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Scheme Name</label>
                <Input placeholder="e.g. Girl Child Education 2024" />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Donor / Agency</label>
                <Select
                options={[
                { label: 'Select Donor', value: '' },
                { label: 'Alumni Association', value: '1' },
                { label: 'Corporate CSR Fund', value: '2' },
                { label: 'Government NGO', value: '3' }]
                } />

              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Total Budget</label>
                <div className="relative">
                  <Coins className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <Input type="number" className="pl-9" placeholder="0.00" />
                </div>
              </div>
            </div>

            {/* Allocation Logic */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Amount per Student</label>
                <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                  <button
                  onClick={() => setAllocationType('Fixed')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${allocationType === 'Fixed' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}>

                    Fixed Amount
                  </button>
                  <button
                  onClick={() => setAllocationType('Percentage')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${allocationType === 'Percentage' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}>

                    Percentage of Fee
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  {allocationType === 'Fixed' ? 'Amount (₹)' : 'Value (%)'}
                </label>
                <div className="relative">
                  {allocationType === 'Fixed' ?
                <Coins className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" /> :

                <Percent className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                }
                  <Input type="number" className="pl-9" placeholder={allocationType === 'Fixed' ? '25000' : '50'} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Frequency</label>
                <Select
                options={[
                { label: 'One-Time', value: 'once' },
                { label: 'Monthly', value: 'monthly' },
                { label: 'Quarterly', value: 'quarterly' },
                { label: 'Yearly', value: 'yearly' }]
                }
                defaultValue="yearly" />

              </div>
            </div>

            {/* Validity */}
            <div className="md:col-span-2 grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Valid From</label>
                <Input type="date" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Valid To</label>
                <Input type="date" />
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button className="bg-blue-600">Save Scheme Configuration</Button>
          </div>
        </Card>) : (

      /* Scheme Grid */
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INITIAL_SCHEMES.map((scheme) =>
        <Card key={scheme.id} className="group hover:border-blue-200 transition-all border-none shadow-sm overflow-hidden">
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <Badge variant="success" className="bg-green-50 text-green-700 border-green-100">
                    {scheme.status}
                  </Badge>
                </div>
                
                <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {scheme.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Building2 className="w-3 h-3" /> {scheme.donor}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-3 border-y border-gray-50">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400">Total Budget</p>
                    <p className="text-sm font-bold text-gray-800">₹{scheme.budget.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400">Benefit</p>
                    <p className="text-sm font-bold text-gray-800">
                      {scheme.allocationType === 'Fixed' ? `₹${scheme.amount}` : `${scheme.amount}% Fee`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {scheme.frequency}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarRange className="w-3.5 h-3.5" /> 
                    {new Date(scheme.validFrom).getFullYear()} - {new Date(scheme.validTo).getFullYear()}
                  </span>
                </div>
              </div>
              
              <div className="px-5 py-3 bg-gray-50 flex justify-end gap-2 border-t border-gray-100 group-hover:bg-blue-50/50 transition-colors">
                <Button variant="outline" className="h-8 px-2 text-gray-500 hover:text-blue-600">
                  <Edit3 className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="h-8 px-2 text-gray-500 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
        )}
          
          {/* Add New Quick Card */}
          <button
          onClick={() => setShowForm(true)}
          className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/30 transition-all group">

            <div className="p-3 rounded-full bg-gray-50 group-hover:bg-blue-100 mb-3 transition-colors">
              <Plus className="w-6 h-6" />
            </div>
            <span className="font-bold text-sm">Create New Scheme</span>
          </button>
        </div>)
      }
    </div>);

}