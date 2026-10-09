import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent } from
'../../../components/ui/Tabs';
import { Modal } from '../../../components/ui/Modal';
import {
  DownloadIcon,
  PrinterIcon,
  MailIcon,
  EyeIcon,
  StarIcon,
  PlusIcon,
  SearchIcon,
  FilterIcon,
  RefreshCwIcon,
  FileTextIcon,
  BarChart2Icon,
  BuildingIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ChevronDownIcon,
  SparklesIcon,
  BookmarkIcon,
  TrendingUpIcon } from
'lucide-react';
export interface ReportItem {
  id: string;
  name: string;
  description: string;
  tags: string[];
  isNew?: boolean;
  isFeatured?: boolean;
}
export interface ReportCategory {
  id: string;
  label: string;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
  reports: ReportItem[];
}
export interface LiveStatCard {
  label: string;
  value: string;
  subtitle?: string;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
}
interface ReportPageTemplateProps {
  pageTitle: string;
  pageDescription: string;
  reportCategories: ReportCategory[];
  liveStats: LiveStatCard[];
  defaultTab?: string;
}
const branchOptions = [
{
  value: 'all',
  label: 'All Branches',
  color: 'bg-gray-600'
},
{
  value: 'main',
  label: 'Main Campus',
  color: 'bg-blue-600'
},
{
  value: 'north',
  label: 'North Branch',
  color: 'bg-green-600'
},
{
  value: 'south',
  label: 'South Branch',
  color: 'bg-orange-600'
},
{
  value: 'east',
  label: 'East Branch',
  color: 'bg-purple-600'
}];

const batchYearOptions = [
{
  value: '2025-26',
  label: '2025-26'
},
{
  value: '2024-25',
  label: '2024-25'
},
{
  value: '2023-24',
  label: '2023-24'
},
{
  value: '2022-23',
  label: '2022-23'
}];

const generatedReports = [
{
  id: 1,
  name: 'Admission Strength Report',
  type: 'Strength',
  generatedAt: '25 Feb 2026, 10:30',
  generatedBy: 'Admin',
  branches: 'All Branches',
  format: 'PDF',
  size: '2.4 MB',
  status: 'Completed'
},
{
  id: 2,
  name: 'Gender-wise Distribution',
  type: 'Demographic',
  generatedAt: '24 Feb 2026, 15:00',
  generatedBy: 'Principal',
  branches: 'Main Campus',
  format: 'Excel',
  size: '1.1 MB',
  status: 'Completed'
},
{
  id: 3,
  name: 'RTE Seats Utilization',
  type: 'RTE/EWS',
  generatedAt: '24 Feb 2026, 09:15',
  generatedBy: 'Admin',
  branches: 'All Branches',
  format: 'PDF',
  size: '0.8 MB',
  status: 'Completed'
},
{
  id: 4,
  name: 'Category-wise Analysis',
  type: 'Category',
  generatedAt: '23 Feb 2026, 14:30',
  generatedBy: 'Admin',
  branches: 'North, South',
  format: 'CSV',
  size: '0.3 MB',
  status: 'Completed'
},
{
  id: 5,
  name: 'Monthly Trend Report',
  type: 'Analysis',
  generatedAt: '23 Feb 2026, 11:00',
  generatedBy: 'System',
  branches: 'All Branches',
  format: 'PDF',
  size: '3.2 MB',
  status: 'Processing'
},
{
  id: 6,
  name: 'Source Analysis Report',
  type: 'Analysis',
  generatedAt: '22 Feb 2026, 16:45',
  generatedBy: 'Admin',
  branches: 'East Branch',
  format: 'Excel',
  size: '1.5 MB',
  status: 'Failed'
}];

export function ReportPageTemplate({
  pageTitle,
  pageDescription,
  reportCategories,
  liveStats,
  defaultTab = 'templates'
}: ReportPageTemplateProps) {
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['all']);
  const [batchYear, setBatchYear] = useState('2025-26');
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [generatingReport, setGeneratingReport] = useState(false);
  const [generateForm, setGenerateForm] = useState({
    reportType: '',
    academicYear: '2025-26',
    grade: '',
    gender: '',
    category: '',
    rteFilter: '',
    feeStatus: '',
    dateFrom: '',
    dateTo: '',
    format: 'pdf',
    sortBy: 'name',
    groupBy: 'none',
    includeContact: true,
    includeParent: true,
    includeCharts: true
  });
  const toggleBranch = (val: string) => {
    if (val === 'all') {
      setSelectedBranches(['all']);
      return;
    }
    setSelectedBranches((prev) => {
      const without = prev.filter((b) => b !== 'all');
      return without.includes(val) ?
      without.filter((b) => b !== val) :
      [...without, val];
    });
  };
  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };
  const allReports = reportCategories.flatMap((c) =>
  c.reports.map((r) => ({
    ...r,
    categoryId: c.id,
    categoryLabel: c.label,
    categoryColor: c.color,
    categoryBg: c.bgColor
  }))
  );
  const filteredReports = allReports.filter((r) => {
    const matchCat =
    selectedCategory === 'all' || r.categoryId === selectedCategory;
    const matchSearch =
    !searchQuery ||
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });
  const featuredReports = allReports.filter((r) => r.isFeatured).slice(0, 4);
  const handleGenerate = (report: ReportItem) => {
    setSelectedReport(report);
    setGenerateForm((f) => ({
      ...f,
      reportType: report.id
    }));
    setShowGenerateModal(true);
  };
  const handleSubmitGenerate = () => {
    setGeneratingReport(true);
    setTimeout(() => {
      setGeneratingReport(false);
      setShowGenerateModal(false);
    }, 1500);
  };
  const selectedBranchLabels = selectedBranches.includes('all') ?
  'All Branches' :
  branchOptions.
  filter((b) => selectedBranches.includes(b.value)).
  map((b) => b.label).
  join(', ');
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
          <p className="text-sm text-gray-500 mt-1">{pageDescription}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<PrinterIcon className="w-4 h-4" />}>

            Print
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<DownloadIcon className="w-4 h-4" />}>

            Export Excel
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<FileTextIcon className="w-4 h-4" />}>

            Export PDF
          </Button>
        </div>
      </div>

      {/* Multi-Branch Filter Bar */}
      <Card>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              School Branch
            </label>
            <div className="flex flex-wrap gap-2">
              {branchOptions.map((b) =>
              <button
                key={b.value}
                onClick={() => toggleBranch(b.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${selectedBranches.includes(b.value) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>

                  <span className={`w-2 h-2 rounded-full ${b.color}`} />
                  {b.label}
                </button>
              )}
            </div>
          </div>
          <Select
            label="Academic Year"
            options={batchYearOptions}
            value={batchYear}
            onChange={setBatchYear}
            className="w-36" />

        </div>
        {!selectedBranches.includes('all') && selectedBranches.length > 0 &&
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
            <BuildingIcon className="w-3.5 h-3.5" />
            <span>
              Showing data for:{' '}
              <strong className="text-gray-700">{selectedBranchLabels}</strong>
            </span>
          </div>
        }
      </Card>

      {/* Three-Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="templates">
            <FileTextIcon className="w-3.5 h-3.5" /> Report Templates
          </TabsTrigger>
          <TabsTrigger value="generated">
            <ClockIcon className="w-3.5 h-3.5" /> Generated Reports
          </TabsTrigger>
          <TabsTrigger value="live">
            <BarChart2Icon className="w-3.5 h-3.5" /> Live Data & Analytics
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: Report Templates */}
        <TabsContent value="templates" className="mt-4 space-y-5">
          {/* Featured Reports */}
          {featuredReports.length > 0 &&
          <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <SparklesIcon className="w-4 h-4 text-yellow-500" /> Featured
                Reports
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {featuredReports.map((r) => {
                const cat = reportCategories.find((c) =>
                c.reports.some((rr) => rr.id === r.id)
                )!;
                return (
                  <div
                    key={r.id}
                    className={`p-4 rounded-xl border-2 ${cat.bgColor} border-opacity-50 cursor-pointer hover:shadow-md transition-shadow`}>

                      <div className="flex items-start justify-between mb-2">
                        <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cat.color} bg-white`}>

                          {cat.label}
                        </span>
                        {r.isNew && <Badge variant="success">New</Badge>}
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">
                        {r.name}
                      </h4>
                      <p className="text-xs text-gray-600 mb-3">
                        {r.description}
                      </p>
                      <div className="flex gap-1">
                        <Button
                        variant="outline"
                        size="xs"
                        leftIcon={<EyeIcon className="w-3 h-3" />}>

                          Preview
                        </Button>
                        <Button
                        variant="primary"
                        size="xs"
                        onClick={() => handleGenerate(r)}>

                          Generate
                        </Button>
                      </div>
                    </div>);

              })}
              </div>
            </div>
          }

          {/* Category Filter + Search */}
          <div className="flex flex-wrap gap-3 items-center">
            <Input
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
              className="w-56" />

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${selectedCategory === 'all' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>

                All{' '}
                <span className="ml-1 opacity-70">({allReports.length})</span>
              </button>
              {reportCategories.map((cat) =>
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${selectedCategory === cat.id ? `${cat.color} text-white border-current` : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>

                  {cat.label}{' '}
                  <span className="ml-1 opacity-70">
                    ({cat.reports.length})
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Report Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReports.map((r) =>
            <div
              key={r.id}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">

                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                    className={`w-2.5 h-2.5 rounded-full ${r.categoryColor}`} />

                    <span className="text-xs text-gray-500">
                      {r.categoryLabel}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {r.isNew && <Badge variant="success">New</Badge>}
                    <button
                    onClick={() => toggleFavorite(r.id)}
                    className="p-1 rounded hover:bg-gray-100 transition-colors">

                      <StarIcon
                      className={`w-3.5 h-3.5 ${favorites.has(r.id) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />

                    </button>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">
                  {r.name}
                </h4>
                <p className="text-xs text-gray-500 mb-3">{r.description}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {r.tags.map((tag) =>
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">

                      {tag}
                    </span>
                )}
                </div>
                <div className="flex gap-1.5">
                  <Button
                  variant="ghost"
                  size="xs"
                  leftIcon={<EyeIcon className="w-3 h-3" />}>

                    Preview
                  </Button>
                  <Button
                  variant="outline"
                  size="xs"
                  leftIcon={<DownloadIcon className="w-3 h-3" />}>

                    Download
                  </Button>
                  <Button
                  variant="primary"
                  size="xs"
                  onClick={() => handleGenerate(r)}>

                    Generate
                  </Button>
                </div>
              </div>
            )}
          </div>
          {filteredReports.length === 0 &&
          <div className="text-center py-12 text-gray-400">
              <FileTextIcon className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No reports found matching your search.</p>
            </div>
          }
        </TabsContent>

        {/* TAB 2: Generated Reports */}
        <TabsContent value="generated" className="mt-4">
          <Card noPadding>
            <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3 items-center justify-between">
              <div className="flex gap-3">
                <Input
                  placeholder="Search reports..."
                  leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                  className="w-52" />

                <Select
                  options={[
                  {
                    value: '',
                    label: 'All Types'
                  },
                  ...reportCategories.map((c) => ({
                    value: c.id,
                    label: c.label
                  }))]
                  }
                  className="w-40" />

                <Select
                  options={[
                  {
                    value: '',
                    label: 'All Formats'
                  },
                  {
                    value: 'pdf',
                    label: 'PDF'
                  },
                  {
                    value: 'excel',
                    label: 'Excel'
                  },
                  {
                    value: 'csv',
                    label: 'CSV'
                  }]
                  }
                  className="w-32" />

              </div>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<RefreshCwIcon className="w-4 h-4" />}>

                Refresh
              </Button>
            </div>
            <Table
              columns={[
              {
                key: 'name',
                header: 'Report Name',
                render: (row) =>
                <span className="font-medium text-gray-900 text-sm">
                      {row.name}
                    </span>

              },
              {
                key: 'type',
                header: 'Type',
                render: (row) => <Badge variant="primary">{row.type}</Badge>
              },
              {
                key: 'generatedAt',
                header: 'Generated',
                render: (row) =>
                <span className="text-xs text-gray-500">
                      {row.generatedAt}
                    </span>

              },
              {
                key: 'generatedBy',
                header: 'By',
                render: (row) =>
                <span className="text-sm text-gray-600">
                      {row.generatedBy}
                    </span>

              },
              {
                key: 'branches',
                header: 'Branches',
                render: (row) =>
                <span className="text-xs text-gray-500">
                      {row.branches}
                    </span>

              },
              {
                key: 'format',
                header: 'Format',
                render: (row) =>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-semibold ${row.format === 'PDF' ? 'bg-red-100 text-red-700' : row.format === 'Excel' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>

                      {row.format}
                    </span>

              },
              {
                key: 'size',
                header: 'Size',
                render: (row) =>
                <span className="text-xs text-gray-500">{row.size}</span>

              },
              {
                key: 'status',
                header: 'Status',
                render: (row) =>
                <Badge
                  variant={
                  row.status === 'Completed' ?
                  'success' :
                  row.status === 'Processing' ?
                  'warning' :
                  'danger'
                  }>

                      {row.status}
                    </Badge>

              },
              {
                key: 'actions',
                header: 'Actions',
                render: (row) =>
                <div className="flex gap-1">
                      {row.status === 'Completed' &&
                  <>
                          <Button
                      variant="ghost"
                      size="xs"
                      leftIcon={<EyeIcon className="w-3 h-3" />}>

                            View
                          </Button>
                          <Button
                      variant="ghost"
                      size="xs"
                      leftIcon={<DownloadIcon className="w-3 h-3" />}>

                            DL
                          </Button>
                          <Button
                      variant="ghost"
                      size="xs"
                      leftIcon={<PrinterIcon className="w-3 h-3" />}>

                            Print
                          </Button>
                          <Button
                      variant="ghost"
                      size="xs"
                      leftIcon={<MailIcon className="w-3 h-3" />}>

                            Email
                          </Button>
                        </>
                  }
                    </div>

              }]
              }
              data={generatedReports} />

          </Card>
        </TabsContent>

        {/* TAB 3: Live Data & Analytics */}
        <TabsContent value="live" className="mt-4 space-y-5">
          {/* Live Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {liveStats.map((stat, i) =>
            <div key={i} className={`${stat.bgColor} border rounded-xl p-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={stat.color}>{stat.icon}</span>
                  <span
                  className={`text-xs font-semibold uppercase tracking-wide ${stat.color}`}>

                    {stat.label}
                  </span>
                </div>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
                {stat.subtitle &&
              <p className={`text-xs mt-1 ${stat.color} opacity-80`}>
                    {stat.subtitle}
                  </p>
              }
              </div>
            )}
          </div>

          {/* Branch-wise Comparison */}
          {!selectedBranches.includes('all') && selectedBranches.length > 1 &&
          <Card title="Branch-wise Comparison">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                        Branch
                      </th>
                      {liveStats.map((s, i) =>
                    <th
                      key={i}
                      className="px-4 py-2 text-left text-xs font-semibold text-gray-600">

                          {s.label}
                        </th>
                    )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {branchOptions.
                  filter(
                    (b) =>
                    b.value !== 'all' &&
                    selectedBranches.includes(b.value)
                  ).
                  map((branch) =>
                  <tr key={branch.value} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-800 flex items-center gap-2">
                            <span
                        className={`w-2.5 h-2.5 rounded-full ${branch.color}`} />

                            {branch.label}
                          </td>
                          {liveStats.map((_, i) =>
                    <td key={i} className="px-4 py-3 text-gray-600">
                              —
                            </td>
                    )}
                        </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </Card>
          }

          {/* Gender Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card title="Gender Distribution">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Male</span>
                    <span className="font-medium text-blue-700">52% (648)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-blue-500"
                      style={{
                        width: '52%'
                      }} />

                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Female</span>
                    <span className="font-medium text-pink-700">48% (600)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-pink-500"
                      style={{
                        width: '48%'
                      }} />

                  </div>
                </div>
              </div>
            </Card>
            <Card title="Category Distribution">
              <div className="space-y-2">
                {[
                {
                  label: 'General',
                  count: 620,
                  pct: 50,
                  color: 'bg-blue-500'
                },
                {
                  label: 'OBC',
                  count: 310,
                  pct: 25,
                  color: 'bg-green-500'
                },
                {
                  label: 'SC',
                  count: 186,
                  pct: 15,
                  color: 'bg-orange-500'
                },
                {
                  label: 'ST',
                  count: 62,
                  pct: 5,
                  color: 'bg-red-500'
                },
                {
                  label: 'EWS',
                  count: 62,
                  pct: 5,
                  color: 'bg-purple-500'
                }].
                map((cat) =>
                <div key={cat.label} className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 w-16">
                      {cat.label}
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                      className={`h-2 rounded-full ${cat.color}`}
                      style={{
                        width: `${cat.pct}%`
                      }} />

                    </div>
                    <span className="text-xs font-medium text-gray-700 w-16 text-right">
                      {cat.count} ({cat.pct}%)
                    </span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Report Generation Modal */}
      <Modal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        title={`Generate Report: ${selectedReport?.name || ''}`}
        size="lg">

        <div className="space-y-5">
          {/* Scope Display */}
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex flex-wrap gap-2 items-center text-xs">
            <span className="text-blue-700 font-medium">Scope:</span>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
              {selectedBranchLabels}
            </span>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
              AY {generateForm.academicYear}
            </span>
          </div>

          {/* Filter Configuration */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-3">
              Filter Configuration
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Academic Year"
                options={batchYearOptions}
                value={generateForm.academicYear}
                onChange={(v) =>
                setGenerateForm((f) => ({
                  ...f,
                  academicYear: v
                }))
                } />

              <Select
                label="Grade / Class"
                options={[
                {
                  value: '',
                  label: 'All Grades'
                },
                {
                  value: 'preschool',
                  label: 'Preschool/KG'
                },
                ...Array.from(
                  {
                    length: 12
                  },
                  (_, i) => ({
                    value: `${i + 1}`,
                    label: `Class ${i + 1}`
                  })
                )]
                }
                value={generateForm.grade}
                onChange={(v) =>
                setGenerateForm((f) => ({
                  ...f,
                  grade: v
                }))
                } />

              <Select
                label="Gender"
                options={[
                {
                  value: '',
                  label: 'All'
                },
                {
                  value: 'male',
                  label: 'Male'
                },
                {
                  value: 'female',
                  label: 'Female'
                }]
                }
                value={generateForm.gender}
                onChange={(v) =>
                setGenerateForm((f) => ({
                  ...f,
                  gender: v
                }))
                } />

              <Select
                label="Category"
                options={[
                {
                  value: '',
                  label: 'All Categories'
                },
                {
                  value: 'general',
                  label: 'General'
                },
                {
                  value: 'obc',
                  label: 'OBC'
                },
                {
                  value: 'sc',
                  label: 'SC'
                },
                {
                  value: 'st',
                  label: 'ST'
                },
                {
                  value: 'ews',
                  label: 'EWS'
                }]
                }
                value={generateForm.category}
                onChange={(v) =>
                setGenerateForm((f) => ({
                  ...f,
                  category: v
                }))
                } />

              <Select
                label="Reservation Filter"
                options={[
                {
                  value: '',
                  label: 'All'
                },
                {
                  value: 'rte',
                  label: 'RTE'
                },
                {
                  value: 'ews',
                  label: 'EWS'
                },
                {
                  value: 'minority',
                  label: 'Minority'
                }]
                }
                value={generateForm.rteFilter}
                onChange={(v) =>
                setGenerateForm((f) => ({
                  ...f,
                  rteFilter: v
                }))
                } />

              <Select
                label="Fee Status"
                options={[
                {
                  value: '',
                  label: 'All'
                },
                {
                  value: 'paid',
                  label: 'Paid'
                },
                {
                  value: 'partial',
                  label: 'Partial'
                },
                {
                  value: 'pending',
                  label: 'Pending'
                },
                {
                  value: 'waived',
                  label: 'Waived'
                }]
                }
                value={generateForm.feeStatus}
                onChange={(v) =>
                setGenerateForm((f) => ({
                  ...f,
                  feeStatus: v
                }))
                } />

              <Input
                label="Date From"
                type="date"
                value={generateForm.dateFrom}
                onChange={(e) =>
                setGenerateForm((f) => ({
                  ...f,
                  dateFrom: e.target.value
                }))
                } />

              <Input
                label="Date To"
                type="date"
                value={generateForm.dateTo}
                onChange={(e) =>
                setGenerateForm((f) => ({
                  ...f,
                  dateTo: e.target.value
                }))
                } />

            </div>
          </div>

          {/* Advanced Options */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-3">
              Advanced Options
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select
                label="Output Format"
                options={[
                {
                  value: 'pdf',
                  label: 'PDF (Styled)'
                },
                {
                  value: 'excel',
                  label: 'Excel (Formatted)'
                },
                {
                  value: 'csv',
                  label: 'CSV (Raw Data)'
                }]
                }
                value={generateForm.format}
                onChange={(v) =>
                setGenerateForm((f) => ({
                  ...f,
                  format: v
                }))
                } />

              <Select
                label="Sort By"
                options={[
                {
                  value: 'name',
                  label: 'Name'
                },
                {
                  value: 'admission_no',
                  label: 'Admission No'
                },
                {
                  value: 'grade',
                  label: 'Grade'
                },
                {
                  value: 'category',
                  label: 'Category'
                }]
                }
                value={generateForm.sortBy}
                onChange={(v) =>
                setGenerateForm((f) => ({
                  ...f,
                  sortBy: v
                }))
                } />

              <Select
                label="Group By"
                options={[
                {
                  value: 'none',
                  label: 'None'
                },
                {
                  value: 'branch',
                  label: 'Branch'
                },
                {
                  value: 'grade',
                  label: 'Grade'
                },
                {
                  value: 'category',
                  label: 'Category'
                }]
                }
                value={generateForm.groupBy}
                onChange={(v) =>
                setGenerateForm((f) => ({
                  ...f,
                  groupBy: v
                }))
                } />

            </div>
            <div className="flex flex-wrap gap-4 mt-3">
              {[
              {
                key: 'includeContact',
                label: 'Include Contact Info'
              },
              {
                key: 'includeParent',
                label: 'Include Parent Info'
              },
              {
                key: 'includeCharts',
                label: 'Include Charts'
              }].
              map((opt) =>
              <label
                key={opt.key}
                className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">

                  <input
                  type="checkbox"
                  checked={
                  generateForm[
                  opt.key as keyof typeof generateForm] as
                  boolean
                  }
                  onChange={(e) =>
                  setGenerateForm((f) => ({
                    ...f,
                    [opt.key]: e.target.checked
                  }))
                  }
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />

                  {opt.label}
                </label>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={() => setShowGenerateModal(false)}>

              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmitGenerate}
              leftIcon={
              generatingReport ?
              <RefreshCwIcon className="w-4 h-4 animate-spin" /> :

              <FileTextIcon className="w-4 h-4" />

              }>

              {generatingReport ? 'Generating...' : 'Generate Report'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>);

}