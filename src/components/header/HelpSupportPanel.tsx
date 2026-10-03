import React, { useEffect, useState, useRef } from 'react';
import {
  X,
  HelpCircle,
  Search,
  MessageSquare,
  Phone,
  ThumbsUp,
  ThumbsDown,
  Send,
  Bot,
  User,
  History,
  ChevronRight,
  FileText } from
'lucide-react';
interface HelpSupportPanelProps {
  isOpen: boolean;
  onClose: () => void;
}
type Step =
'input' |
'searching' |
'no-results' |
'ai-chat' |
'feedback' |
'human-support';
export function HelpSupportPanel({ isOpen, onClose }: HelpSupportPanelProps) {
  const [currentStep, setCurrentStep] = useState<Step>('input');
  const [query, setQuery] = useState('');
  const [chatMessages, setChatMessages] = useState<
    Array<{
      role: 'user' | 'ai';
      text: string;
    }>>(
    []);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isOpen) {
      setCurrentStep('input');
      setQuery('');
      setChatMessages([]);
    }
  }, [isOpen]);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [chatMessages, isTyping]);
  const handleSearch = () => {
    if (!query.trim()) return;
    setCurrentStep('searching');
    // Simulate search delay
    setTimeout(() => {
      setCurrentStep('no-results');
    }, 1500);
  };
  const startAIChat = () => {
    setCurrentStep('ai-chat');
    setChatMessages([
    {
      role: 'ai',
      text: `Hi there! I see you're having trouble with "${query}". How can I help you specifically?`
    }]
    );
  };
  const handleSendMessage = (text: string) => {
    setChatMessages((prev) => [
    ...prev,
    {
      role: 'user',
      text
    }]
    );
    setIsTyping(true);
    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      setChatMessages((prev) => [
      ...prev,
      {
        role: 'ai',
        text: 'I understand. Based on our documentation, you might need to check your permission settings in the Administration module. Would you like me to guide you there?'
      }]
      );
    }, 1500);
  };
  return (
    <>
      {/* Backdrop */}
      {isOpen &&
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose} />

      }

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[480px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#0F4C5C] text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <HelpCircle className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Help & Support</h2>
              <p className="text-xs text-white/70">We're here to help you</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white">

            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentStep === 'input' &&
          <div className="space-y-6">
              <div className="text-center py-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  How can we help?
                </h3>
                <p className="text-gray-500">
                  Describe your issue and we'll find the best solution for you.
                </p>
              </div>

              <div className="space-y-4">
                <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., How do I generate a fee receipt?"
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F4C5C] focus:border-transparent min-h-[120px] resize-none text-gray-700" />

                <button
                onClick={handleSearch}
                disabled={!query.trim()}
                className="w-full py-3 bg-[#0F4C5C] text-white rounded-xl font-medium hover:bg-[#145369] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">

                  <Search className="h-5 w-5" />
                  Search Documentation
                </button>
              </div>

              <div className="pt-8 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <History className="h-4 w-4 text-gray-500" />
                  Recent Help History
                </h4>
                <div className="space-y-3">
                  {[
                {
                  title: 'Fee Structure Setup',
                  date: '2 days ago',
                  status: 'Resolved'
                },
                {
                  title: 'Student Admission Error',
                  date: '1 week ago',
                  status: 'Closed'
                }].
                map((item, i) =>
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">

                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-500">{item.date}</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        {item.status}
                      </span>
                    </div>
                )}
                </div>
              </div>
            </div>
          }

          {currentStep === 'searching' &&
          <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 border-4 border-[#0F4C5C]/20 border-t-[#0F4C5C] rounded-full animate-spin mb-6" />
              <h3 className="text-lg font-medium text-gray-900">
                Searching Documentation...
              </h3>
              <p className="text-gray-500 mt-2">
                Looking for answers to "{query}"
              </p>
            </div>
          }

          {currentStep === 'no-results' &&
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="h-10 w-10 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  No exact matches found
                </h3>
                <p className="text-gray-500 mt-2 max-w-xs mx-auto">
                  We couldn't find specific documentation for your query. Our AI
                  Assistant might be able to help!
                </p>
              </div>
              <button
              onClick={startAIChat}
              className="px-6 py-3 bg-[#0F4C5C] text-white rounded-xl font-medium hover:bg-[#145369] transition-colors flex items-center gap-2 shadow-lg shadow-[#0F4C5C]/20">

                <Bot className="h-5 w-5" />
                Chat with AI Assistant
              </button>
              <button
              onClick={() => setCurrentStep('input')}
              className="text-sm text-gray-500 hover:text-gray-700">

                Try a different search
              </button>
            </div>
          }

          {currentStep === 'ai-chat' &&
          <div className="flex flex-col h-full">
              <div className="flex-1 space-y-4 mb-4">
                {chatMessages.map((msg, i) =>
              <div
                key={i}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>

                    <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-[#0F4C5C] text-white' : 'bg-gray-200 text-gray-600'}`}>

                      {msg.role === 'ai' ?
                  <Bot className="h-4 w-4" /> :

                  <User className="h-4 w-4" />
                  }
                    </div>
                    <div
                  className={`p-3 rounded-2xl max-w-[80%] text-sm ${msg.role === 'ai' ? 'bg-gray-100 text-gray-800 rounded-tl-none' : 'bg-[#0F4C5C] text-white rounded-tr-none'}`}>

                      {msg.text}
                    </div>
                  </div>
              )}
                {isTyping &&
              <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0F4C5C] text-white flex items-center justify-center shrink-0">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-gray-100 p-4 rounded-2xl rounded-tl-none flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                    </div>
                  </div>
              }
                <div ref={chatEndRef} />
              </div>

              <div className="mt-auto pt-4 border-t border-gray-100">
                <div className="flex gap-2 mb-4">
                  <button
                  onClick={() => setCurrentStep('feedback')}
                  className="text-xs text-gray-500 hover:text-[#0F4C5C] flex items-center gap-1 ml-auto">

                    End Chat <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
                <div className="relative">
                  <input
                  type="text"
                  placeholder="Type your message..."
                  className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F4C5C] focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }} />

                  <button className="absolute right-2 top-2 p-2 text-[#0F4C5C] hover:bg-gray-50 rounded-lg transition-colors">
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          }

          {currentStep === 'feedback' &&
          <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Was this helpful?
                </h3>
                <p className="text-gray-500 mt-2">
                  Your feedback helps us improve our support.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                onClick={() => onClose()}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-transparent hover:border-green-100 hover:bg-green-50 transition-all group">

                  <div className="p-3 bg-green-100 text-green-600 rounded-full group-hover:scale-110 transition-transform">
                    <ThumbsUp className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    Yes, thanks!
                  </span>
                </button>

                <button
                onClick={() => setCurrentStep('human-support')}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-transparent hover:border-red-100 hover:bg-red-50 transition-all group">

                  <div className="p-3 bg-red-100 text-red-600 rounded-full group-hover:scale-110 transition-transform">
                    <ThumbsDown className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    No, I need help
                  </span>
                </button>
              </div>
            </div>
          }

          {currentStep === 'human-support' &&
          <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-900">
                  Contact Support
                </h3>
                <p className="text-gray-500 mt-2">
                  Choose how you'd like to connect with our team.
                </p>
              </div>

              <div className="grid gap-4">
                <button className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-[#0F4C5C] hover:bg-cyan-50/30 transition-all group text-left">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Chat with Support
                    </h4>
                    <p className="text-sm text-gray-500">Wait time: ~5 mins</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-300 ml-auto group-hover:text-[#0F4C5C]" />
                </button>

                <button className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-[#0F4C5C] hover:bg-cyan-50/30 transition-all group text-left">
                  <div className="p-3 bg-green-100 text-green-600 rounded-full group-hover:bg-green-600 group-hover:text-white transition-colors">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Call Support
                    </h4>
                    <p className="text-sm text-gray-500">+91 1800-123-4567</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-300 ml-auto group-hover:text-[#0F4C5C]" />
                </button>
              </div>

              <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  Support Hours
                </h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p className="flex justify-between">
                    <span>Mon - Fri:</span> <span>9:00 AM - 6:00 PM</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Saturday:</span> <span>9:00 AM - 1:00 PM</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Sunday:</span> <span>Closed</span>
                  </p>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </>);

}