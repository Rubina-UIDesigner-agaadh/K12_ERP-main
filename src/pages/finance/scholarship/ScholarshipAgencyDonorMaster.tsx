import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  Building2,
  User,
  MapPin,
  ShieldCheck,
  FileText,
  Mail,
  Phone,
  Plus,
  Search,
  Globe,
  ExternalLink,
  MoreVertical,
  Edit,
  Trash2,
  Briefcase } from
'lucide-react';
// Mock Donor Data
const INITIAL_DONORS = [
{
  id: 'DNR-001',
  name: 'Global Trust Foundation',
  category: 'NGO',
  contactPerson: 'Sarah Jenkins',
  email: 'sarah.j@globaltrust.org',
  phone: '+91 98765 43210',
  address: '12th Floor, Financial Tower, Mumbai',
  taxId: 'GSTIN27AAACG0001Z',
  reporting: 'Quarterly Financials',
  status: 'Active'
},
{
  id: 'DNR-002',
  name: 'TechCorp CSR Wing',
  category: 'Corporate',
  contactPerson: 'Vikram Mehta',
  email: 'csr@techcorp.in',
  phone: '+91 88776 55443',
  address: 'Tech Park, Whitefield, Bangalore',
  taxId: 'GSTIN29BBBCH1122K',
  reporting: 'Annual Impact Report',
  status: 'Active'
}];

export function ScholarshipAgencyDonorMaster() {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-cyan-600" />
            Agency & Donor Master
          </h1>
          <p className="text-gray-500 text-sm">
            Manage fund sources, tax compliance, and reporting requirements.
          </p>
        </div>
        <Button
          onClick={() => setView(view === 'list' ? 'form' : 'list')}
          className="bg-cyan-600 hover:bg-cyan-700 text-white">

          {view === 'list' ?
          <>
              <Plus className="w-4 h-4 mr-2" /> Register New Donor
            </> :

          'Back to Directory'
          }
        </Button>
      </div>

      {view === 'form' /* Registration Form */ ?
      <div className="max-w-4xl mx-auto space-y-6">
          <Card className="border-none shadow-xl overflow-hidden">
            <div className="bg-cyan-600 p-4 text-white">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Briefcase className="w-5 h-5" /> Donor Registration Form
              </h2>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Agency Identity */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-cyan-600 uppercase tracking-widest border-b pb-2">
                  Agency Identity
                </h3>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Agency/Donor Name
                  </label>
                  <Input placeholder="Legal name of foundation or company" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Category
                  </label>
                  <Select
                  options={[
                  {
                    label: 'Corporate (CSR)',
                    value: 'csr'
                  },
                  {
                    label: 'NGO / Trust',
                    value: 'ngo'
                  },
                  {
                    label: 'Individual Philanthropist',
                    value: 'individual'
                  },
                  {
                    label: 'Government Body',
                    value: 'govt'
                  }]
                  } />

                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    GST / Tax ID
                  </label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <Input
                    className="pl-9"
                    placeholder="Enter Registration No." />

                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-cyan-600 uppercase tracking-widest border-b pb-2">
                  Primary Contact
                </h3>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Contact Person
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <Input className="pl-9" placeholder="Name of POC" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Official Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <Input className="pl-9" placeholder="donor@agency.org" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Contact Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <Input className="pl-9" placeholder="+91 00000 00000" />
                  </div>
                </div>
              </div>

              {/* Logistics & Compliance */}
              <div className="md:col-span-2 space-y-4">
                <h3 className="text-sm font-bold text-cyan-600 uppercase tracking-widest border-b pb-2">
                  Address & Compliance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Mailing Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      <Input
                      className="pl-9"
                      placeholder="Complete office address" />

                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Reporting Requirements
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      <Input
                      className="pl-9"
                      placeholder="e.g. Monthly Expense Sheets" />

                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t flex justify-end gap-3">
              <Button variant="outline" onClick={() => setView('list')}>
                Discard
              </Button>
              <Button className="bg-cyan-600 px-8">Save Agency Profile</Button>
            </div>
          </Card>
        </div> /* List View */ :

      <div className="space-y-4">
          {/* Search/Filters */}
          <div className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <Input
              className="pl-9 border-none bg-gray-50 focus:ring-0"
              placeholder="Search by agency name, contact, or tax ID..."
              onChange={(e) => setSearchTerm(e.target.value)} />

            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Globe className="w-4 h-4" /> All Categories
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INITIAL_DONORS.filter((d) =>
          d.name.toLowerCase().includes(searchTerm.toLowerCase())
          ).map((donor) =>
          <Card
            key={donor.id}
            className="p-0 border-none shadow-sm overflow-hidden hover:shadow-md transition-shadow group">

                <div className="flex h-full">
                  <div className="w-2 bg-cyan-500 group-hover:w-3 transition-all"></div>
                  <div className="flex-1 p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg text-gray-900">
                            {donor.name}
                          </h3>
                          <Badge className="bg-cyan-50 text-cyan-700 text-[10px]">
                            {donor.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400 font-medium">
                          ID: {donor.id}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="outline" className="h-8 w-8 p-0">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                      variant="outline"
                      className="h-8 w-8 p-0 text-red-500 hover:bg-red-50">

                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="truncate">
                            {donor.contactPerson}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="truncate">{donor.email}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <ShieldCheck className="w-4 h-4 text-gray-400" />
                          <span className="truncate">{donor.taxId}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="truncate italic">
                            {donor.reporting}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="w-3 h-3" /> {donor.address}
                      </div>
                      <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px] font-bold uppercase tracking-wider">

                        View Funds <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
          )}
          </div>
        </div>
      }
    </div>);

}