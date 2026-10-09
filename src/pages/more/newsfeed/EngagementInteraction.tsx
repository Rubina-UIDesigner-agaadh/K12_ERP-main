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
import {
  ThumbsUpIcon,
  MessageSquareIcon,
  BarChart2Icon,
  ShareIcon,
  BookmarkIcon } from
'lucide-react';
const posts = [
{
  id: 1,
  title: 'Annual Day 2025 Registration Open',
  likes: 124,
  comments: 18,
  views: 456,
  shares: 34,
  bookmarks: 67
},
{
  id: 2,
  title: 'Arjun Sharma wins State Science Olympiad',
  likes: 234,
  comments: 45,
  views: 789,
  shares: 89,
  bookmarks: 123
},
{
  id: 3,
  title: 'Fee Payment Reminder - June 2025',
  likes: 12,
  comments: 8,
  views: 412,
  shares: 5,
  bookmarks: 23
}];

const comments = [
{
  post: 'Annual Day 2025',
  user: 'Parent - Mr. Patel',
  comment: 'Looking forward to it! Can we register online?',
  time: '2 hours ago',
  status: 'Approved'
},
{
  post: 'Annual Day 2025',
  user: 'Teacher - Mrs. Sharma',
  comment: 'Excited for the event!',
  time: '3 hours ago',
  status: 'Approved'
},
{
  post: 'Science Olympiad',
  user: 'Parent - Mrs. Verma',
  comment: 'Congratulations Arjun!',
  time: '5 hours ago',
  status: 'Approved'
}];

const polls = [
{
  question: 'What time is best for Annual Day?',
  options: [
  {
    text: 'Morning (9-12)',
    votes: 145
  },
  {
    text: 'Evening (4-7)',
    votes: 234
  },
  {
    text: 'Afternoon (1-4)',
    votes: 67
  }],

  total: 446,
  ends: '2025-06-15'
}];

export function EngagementInteraction() {
  const [tab, setTab] = useState('overview');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Engagement & Interaction
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage likes, comments, polls, view counts and sharing
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
        {
          label: 'Total Likes',
          value: '1,248',
          icon: ThumbsUpIcon,
          color: 'text-blue-600'
        },
        {
          label: 'Comments',
          value: '234',
          icon: MessageSquareIcon,
          color: 'text-green-600'
        },
        {
          label: 'Total Views',
          value: '8,456',
          icon: BarChart2Icon,
          color: 'text-purple-600'
        },
        {
          label: 'Shares',
          value: '312',
          icon: ShareIcon,
          color: 'text-orange-600'
        },
        {
          label: 'Bookmarks',
          value: '567',
          icon: BookmarkIcon,
          color: 'text-teal-600'
        }].
        map((s, i) =>
        <Card key={i}>
            <div className="flex items-center gap-2 p-1">
              <s.icon className={`w-4 h-4 ${s.color}`} />
              <div>
                <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      <Card noPadding>
        <Tabs defaultValue="overview" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="overview">Engagement Overview</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="polls">Polls</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="p-5">
            <div className="space-y-3">
              {posts.map((post, i) =>
              <Card key={i} title={post.title}>
                  <div className="grid grid-cols-5 gap-3">
                    {[
                  {
                    icon: ThumbsUpIcon,
                    value: post.likes,
                    label: 'Likes',
                    color: 'text-blue-600'
                  },
                  {
                    icon: MessageSquareIcon,
                    value: post.comments,
                    label: 'Comments',
                    color: 'text-green-600'
                  },
                  {
                    icon: BarChart2Icon,
                    value: post.views,
                    label: 'Views',
                    color: 'text-purple-600'
                  },
                  {
                    icon: ShareIcon,
                    value: post.shares,
                    label: 'Shares',
                    color: 'text-orange-600'
                  },
                  {
                    icon: BookmarkIcon,
                    value: post.bookmarks,
                    label: 'Bookmarks',
                    color: 'text-teal-600'
                  }].
                  map((s, si) =>
                  <div
                    key={si}
                    className="text-center p-2 bg-gray-50 rounded-lg">

                        <s.icon className={`w-4 h-4 ${s.color} mx-auto mb-1`} />
                        <p className={`text-base font-bold ${s.color}`}>
                          {s.value}
                        </p>
                        <p className="text-xs text-gray-400">{s.label}</p>
                      </div>
                  )}
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="comments" className="p-5">
            <div className="space-y-3">
              {comments.map((c, i) =>
              <div key={i} className="p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-xs font-semibold text-gray-700">
                        {c.user}
                      </p>
                      <p className="text-xs text-gray-400">
                        {c.post} • {c.time}
                      </p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      {c.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">"{c.comment}"</p>
                  <div className="flex gap-2 mt-2">
                    <Button variant="ghost" className="text-xs h-6 px-2">
                      Reply
                    </Button>
                    <Button
                    variant="ghost"
                    className="text-xs h-6 px-2 text-red-500">

                      Remove
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="polls" className="p-5">
            <div className="space-y-4">
              {polls.map((poll, i) =>
              <Card key={i} title={poll.question}>
                  <div className="space-y-3">
                    {poll.options.map((opt, oi) =>
                  <div key={oi} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">{opt.text}</span>
                          <span className="font-semibold text-gray-800">
                            {opt.votes} (
                            {Math.round(opt.votes / poll.total * 100)}%)
                          </span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: `${opt.votes / poll.total * 100}%`
                        }} />

                        </div>
                      </div>
                  )}
                    <p className="text-xs text-gray-400">
                      {poll.total} total votes • Ends: {poll.ends}
                    </p>
                  </div>
                </Card>
              )}
              <Button variant="primary">
                <BarChart2Icon className="w-4 h-4 mr-2" />
                Create New Poll
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}