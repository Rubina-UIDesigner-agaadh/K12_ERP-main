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
import { ExternalLinkIcon, BookmarkIcon, BellIcon } from 'lucide-react';
const news = [
{
  id: 1,
  title: 'AI Integration in K-12 Education: A Global Perspective',
  category: 'AI & EdTech',
  source: 'EdTech Magazine',
  date: '2025-06-10',
  readTime: '5 min',
  trending: true
},
{
  id: 2,
  title: 'PISA 2025 Results: India Improves in Math Rankings',
  category: 'Global Trends',
  source: 'OECD',
  date: '2025-06-09',
  readTime: '8 min',
  trending: true
},
{
  id: 3,
  title: 'NEP 2020 Impact: 3 Years of Implementation Review',
  category: 'Curriculum',
  source: 'Education Times',
  date: '2025-06-08',
  readTime: '6 min',
  trending: false
},
{
  id: 4,
  title: 'IIT JEE 2026: Major Changes in Exam Pattern',
  category: 'University Admissions',
  source: 'NTA',
  date: '2025-06-07',
  readTime: '4 min',
  trending: true
},
{
  id: 5,
  title: 'Global EdTech Market to Reach $500B by 2030',
  category: 'AI & EdTech',
  source: 'Forbes Education',
  date: '2025-06-05',
  readTime: '7 min',
  trending: false
}];

const categoryBadge = (c: string) => {
  const colors: Record<string, string> = {
    'AI & EdTech': 'bg-blue-100 text-blue-700',
    'Global Trends': 'bg-purple-100 text-purple-700',
    Curriculum: 'bg-green-100 text-green-700',
    'University Admissions': 'bg-orange-100 text-orange-700'
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors[c] || 'bg-gray-100 text-gray-600'}`}>

      {c}
    </span>);

};
export function EducationIndustryGlobalNews() {
  const [tab, setTab] = useState('all');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Education Industry & Global News
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Curriculum reforms, AI & EdTech updates, global trends and
            university admission changes
          </p>
        </div>
        <Button variant="outline">
          <BellIcon className="w-4 h-4 mr-2" />
          Subscribe
        </Button>
      </div>

      <Card noPadding>
        <Tabs defaultValue="all" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="all">All News</TabsTrigger>
            <TabsTrigger value="edtech">AI & EdTech</TabsTrigger>
            <TabsTrigger value="global">Global Trends</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="admissions">Admissions</TabsTrigger>
          </TabsList>

          {['all', 'edtech', 'global', 'curriculum', 'admissions'].map(
            (tabVal) =>
            <TabsContent key={tabVal} value={tabVal} className="p-5">
                <div className="flex gap-3 mb-4">
                  <Input placeholder="Search news..." className="flex-1" />
                </div>
                <div className="space-y-3">
                  {news.
                filter(
                  (n) =>
                  tabVal === 'all' ||
                  tabVal === 'edtech' && n.category === 'AI & EdTech' ||
                  tabVal === 'global' &&
                  n.category === 'Global Trends' ||
                  tabVal === 'curriculum' &&
                  n.category === 'Curriculum' ||
                  tabVal === 'admissions' &&
                  n.category === 'University Admissions'
                ).
                map((item, i) =>
                <div
                  key={i}
                  className="p-4 border border-gray-200 rounded-xl hover:shadow-sm transition-shadow">

                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-start gap-2">
                            {item.trending &&
                      <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-semibold shrink-0">
                                🔥 Trending
                              </span>
                      }
                            <p className="font-semibold text-gray-800 text-sm">
                              {item.title}
                            </p>
                          </div>
                          {categoryBadge(item.category)}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-400 mb-2">
                          <span>{item.source}</span>
                          <span>{item.date}</span>
                          <span>{item.readTime} read</span>
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
                            <ExternalLinkIcon className="w-3 h-3 mr-1" />
                            Source
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