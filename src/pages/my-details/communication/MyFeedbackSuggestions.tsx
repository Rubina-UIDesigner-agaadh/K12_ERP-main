import React, { useState } from 'react';
import { MessageCircle, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Badge } from '../../../components/ui/Badge';
export function MyFeedbackSuggestions() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const feedbackList = [
  {
    id: 1,
    type: 'Suggestion',
    subject: 'More vegan options in canteen',
    date: '10-Nov-2024',
    status: 'Under Review',
    description: 'It would be great to have more healthy vegan options...',
    response: 'Thank you for the suggestion. We are reviewing the menu.'
  },
  {
    id: 2,
    type: 'System Issue',
    subject: 'Login error on mobile app',
    date: '01-Nov-2024',
    status: 'Closed',
    description: 'I face intermittent login failures on Android...',
    response: 'This issue was resolved in the latest app update v2.1.'
  }];

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Feedback & Suggestions
        </h1>
        <p className="text-sm text-gray-500">
          Share your ideas, report issues, or send compliments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submit Form */}
        <Card className="lg:col-span-1 h-fit" title="Submit New Feedback">
          <div className="space-y-4">
            <Select
              label="Type"
              options={[
              {
                value: 'suggestion',
                label: 'Suggestion'
              },
              {
                value: 'issue',
                label: 'System Issue'
              },
              {
                value: 'complaint',
                label: 'Complaint'
              },
              {
                value: 'compliment',
                label: 'Compliment'
              }]
              } />

            <Input label="Subject" placeholder="Brief summary" />
            <Textarea
              label="Description"
              placeholder="Detailed explanation..."
              rows={5} />

            <div className="pt-2">
              <Button variant="primary" className="w-full">
                <Send className="w-4 h-4 mr-2" /> Submit Feedback
              </Button>
            </div>
          </div>
        </Card>

        {/* History List */}
        <Card className="lg:col-span-2" title="My Feedback History">
          <div className="space-y-4">
            {feedbackList.map((item) =>
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg overflow-hidden">

                <div
                className="p-4 bg-white flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleExpand(item.id)}>

                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-full">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {item.subject}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{item.type}</Badge>
                        <span className="text-xs text-gray-500">
                          {item.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                    variant={
                    item.status === 'Closed' ?
                    'success' :
                    item.status === 'Under Review' ?
                    'warning' :
                    'default'
                    }>

                      {item.status}
                    </Badge>
                    {expandedId === item.id ?
                  <ChevronUp className="w-5 h-5 text-gray-400" /> :

                  <ChevronDown className="w-5 h-5 text-gray-400" />
                  }
                  </div>
                </div>

                {expandedId === item.id &&
              <div className="p-4 bg-gray-50 border-t border-gray-100 text-sm">
                    <div className="mb-4">
                      <p className="font-semibold text-gray-700 mb-1">
                        Description:
                      </p>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                    {item.response &&
                <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                        <p className="font-semibold text-blue-800 mb-1">
                          Admin Response:
                        </p>
                        <p className="text-blue-700">{item.response}</p>
                      </div>
                }
                  </div>
              }
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>);

}