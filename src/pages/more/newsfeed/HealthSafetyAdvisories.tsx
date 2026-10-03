import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent } from
'../../../components/ui/Tabs';
import { AlertTriangleIcon, BookmarkIcon, BellIcon } from 'lucide-react';
const advisories = [
{
  id: 1,
  title: 'Dengue Fever Alert - Preventive Measures',
  type: 'Epidemic',
  severity: 'High',
  source: 'State Health Dept.',
  date: '2025-06-10',
  active: true
},
{
  id: 2,
  title: 'COVID-19 Vaccination Drive for School Staff',
  type: 'Vaccination',
  severity: 'Medium',
  source: 'District Health Officer',
  date: '2025-06-08',
  active: true
},
{
  id: 3,
  title: 'Heavy Rain Warning - School Safety Protocol',
  type: 'Weather',
  severity: 'High',
  source: 'IMD',
  date: '2025-06-07',
  active: true
},
{
  id: 4,
  title: 'School Bus Safety Guidelines Updated',
  type: 'Transport',
  severity: 'Medium',
  source: 'RTO',
  date: '2025-06-05',
  active: false
},
{
  id: 5,
  title: 'School Closure Notice - Cyclone Warning',
  type: 'Closure',
  severity: 'Critical',
  source: 'District Collector',
  date: '2025-06-03',
  active: false
}];

const severityBadge = (s: string) => {
  const c: Record<string, string> = {
    Critical: 'bg-red-200 text-red-800',
    High: 'bg-red-100 text-red-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Low: 'bg-green-100 text-green-700'
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c[s] || 'bg-gray-100 text-gray-600'}`}>

      {s}
    </span>);

};
const typeBadge = (t: string) => {
  const c: Record<string, string> = {
    Epidemic: 'bg-red-100 text-red-700',
    Vaccination: 'bg-blue-100 text-blue-700',
    Weather: 'bg-orange-100 text-orange-700',
    Transport: 'bg-purple-100 text-purple-700',
    Closure: 'bg-gray-100 text-gray-700'
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c[t] || 'bg-gray-100 text-gray-600'}`}>

      {t}
    </span>);

};
export function HealthSafetyAdvisories() {
  const [tab, setTab] = useState('active');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Health & Safety Advisories
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Epidemic alerts, vaccination guidelines, weather warnings and safety
            notices
          </p>
        </div>
        <Button variant="outline">
          <BellIcon className="w-4 h-4 mr-2" />
          Subscribe
        </Button>
      </div>

      {advisories.filter((a) => a.severity === 'Critical' && a.active).length >
      0 &&
      <div className="bg-red-50 border-2 border-red-400 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangleIcon className="w-6 h-6 text-red-600 shrink-0" />
          <div>
            <p className="font-bold text-red-800">Critical Advisory Active</p>
            <p className="text-sm text-red-600">
              There are critical health/safety advisories that require immediate
              attention.
            </p>
          </div>
        </div>
      }

      <Card noPadding>
        <Tabs defaultValue="active" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="active">Active Advisories</TabsTrigger>
            <TabsTrigger value="all">All Advisories</TabsTrigger>
            <TabsTrigger value="epidemic">Epidemic Alerts</TabsTrigger>
            <TabsTrigger value="weather">Weather Warnings</TabsTrigger>
          </TabsList>

          {['active', 'all', 'epidemic', 'weather'].map((tabVal) =>
          <TabsContent key={tabVal} value={tabVal} className="p-5">
              <div className="flex gap-3 mb-4">
                <Input placeholder="Search advisories..." className="flex-1" />
              </div>
              <div className="space-y-3">
                {advisories.
              filter((a) =>
              tabVal === 'active' ?
              a.active :
              tabVal === 'all' ?
              true :
              tabVal === 'epidemic' ?
              a.type === 'Epidemic' || a.type === 'Vaccination' :
              a.type === 'Weather'
              ).
              map((adv, i) =>
              <div
                key={i}
                className={`p-4 border rounded-xl ${adv.severity === 'Critical' ? 'border-red-300 bg-red-50/30' : adv.severity === 'High' ? 'border-orange-200 bg-orange-50/20' : 'border-gray-200'}`}>

                      <div className="flex items-start justify-between mb-2">
                        <p className="font-semibold text-gray-800 text-sm flex-1 pr-2">
                          {adv.title}
                        </p>
                        <div className="flex gap-1 shrink-0">
                          {typeBadge(adv.type)}
                          {severityBadge(adv.severity)}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-400 mb-2">
                        <span>Source: {adv.source}</span>
                        <span>{adv.date}</span>
                        {adv.active &&
                  <span className="text-green-600 font-medium">
                            ● Active
                          </span>
                  }
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" className="text-xs h-6 px-2">
                          Read More
                        </Button>
                        <Button variant="ghost" className="text-xs h-6 px-2">
                          <BookmarkIcon className="w-3 h-3 mr-1" />
                          Save
                        </Button>
                        <Button variant="ghost" className="text-xs h-6 px-2">
                          Share
                        </Button>
                      </div>
                    </div>
              )}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </Card>
    </div>);

}