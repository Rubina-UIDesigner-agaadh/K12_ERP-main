import React, { useEffect, useState, useRef } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import {
  SearchIcon,
  SendIcon,
  PlusIcon,
  CheckCheckIcon,
  CheckIcon,
  PhoneIcon,
  VideoIcon,
  MoreVerticalIcon,
  ArrowLeftIcon,
  UserIcon,
  UsersIcon,
  CircleIcon,
  PaperclipIcon,
  SmileIcon,
  XIcon } from
'lucide-react';
interface Contact {
  id: string;
  name: string;
  role: 'parent' | 'staff';
  avatar: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  online: boolean;
  subtitle: string;
}
interface Message {
  id: string;
  senderId: string;
  text: string;
  time: string;
  status: 'sent' | 'delivered' | 'read';
}
const contacts: Contact[] = [
{
  id: 'c1',
  name: 'Mrs. Priya Sharma',
  role: 'parent',
  avatar: 'PS',
  lastMessage: "Thank you for the update on Rahul's progress.",
  lastTime: '10:32 AM',
  unread: 2,
  online: true,
  subtitle: 'Parent of Rahul Sharma (Class 8-A)'
},
{
  id: 'c2',
  name: 'Mr. Anil Patel',
  role: 'parent',
  avatar: 'AP',
  lastMessage: 'Can we schedule a meeting this week?',
  lastTime: '9:15 AM',
  unread: 1,
  online: false,
  subtitle: 'Parent of Sneha Patel (Class 10-B)'
},
{
  id: 'c3',
  name: 'Mrs. Kavita Verma',
  role: 'parent',
  avatar: 'KV',
  lastMessage: 'Noted, I will ensure she submits the form.',
  lastTime: 'Yesterday',
  unread: 0,
  online: false,
  subtitle: 'Parent of Anjali Verma (Class 7-C)'
},
{
  id: 'c4',
  name: 'Mr. Suresh Kumar',
  role: 'staff',
  avatar: 'SK',
  lastMessage: 'The lab is booked for Thursday.',
  lastTime: 'Yesterday',
  unread: 0,
  online: true,
  subtitle: 'Physical Education Teacher'
},
{
  id: 'c5',
  name: 'Ms. Deepa Nair',
  role: 'staff',
  avatar: 'DN',
  lastMessage: "I've updated the attendance sheet.",
  lastTime: 'Mon',
  unread: 0,
  online: true,
  subtitle: 'Hindi Teacher'
},
{
  id: 'c6',
  name: 'Mr. Rajesh Mehta',
  role: 'parent',
  avatar: 'RM',
  lastMessage: 'Please share the exam schedule.',
  lastTime: 'Mon',
  unread: 0,
  online: false,
  subtitle: 'Parent of Arjun Mehta (Class 9-A)'
},
{
  id: 'c7',
  name: 'Mrs. Anita Joshi',
  role: 'staff',
  avatar: 'AJ',
  lastMessage: 'The art supplies have arrived.',
  lastTime: 'Sun',
  unread: 0,
  online: false,
  subtitle: 'Art & Craft Teacher'
},
{
  id: 'c8',
  name: 'Mr. Vikram Singh',
  role: 'parent',
  avatar: 'VS',
  lastMessage: 'Thank you for the clarification.',
  lastTime: 'Fri',
  unread: 0,
  online: false,
  subtitle: 'Parent of Pooja Singh (Class 11-A)'
}];

const initialMessages: Record<string, Message[]> = {
  c1: [
  {
    id: 'm1',
    senderId: 'c1',
    text: "Hello, I wanted to check on Rahul's recent test performance.",
    time: '10:15 AM',
    status: 'read'
  },
  {
    id: 'm2',
    senderId: 'me',
    text: 'Hi Mrs. Sharma! Rahul scored 78% in the recent Math test. He has shown great improvement in algebra.',
    time: '10:18 AM',
    status: 'read'
  },
  {
    id: 'm3',
    senderId: 'c1',
    text: "That's wonderful to hear! We have been practicing at home.",
    time: '10:20 AM',
    status: 'read'
  },
  {
    id: 'm4',
    senderId: 'me',
    text: 'It definitely shows. Please encourage him to also focus on geometry for the upcoming term exam.',
    time: '10:25 AM',
    status: 'read'
  },
  {
    id: 'm5',
    senderId: 'c1',
    text: "Thank you for the update on Rahul's progress.",
    time: '10:32 AM',
    status: 'read'
  },
  {
    id: 'm6',
    senderId: 'c1',
    text: 'Also, can you share the study material for the next chapter?',
    time: '10:32 AM',
    status: 'delivered'
  }],

  c2: [
  {
    id: 'm1',
    senderId: 'c2',
    text: "Good morning! I wanted to discuss Sneha's attendance.",
    time: '9:00 AM',
    status: 'read'
  },
  {
    id: 'm2',
    senderId: 'me',
    text: 'Good morning Mr. Patel. Sneha has been absent for 3 days this month. Is everything okay?',
    time: '9:05 AM',
    status: 'read'
  },
  {
    id: 'm3',
    senderId: 'c2',
    text: 'She was unwell. I have the medical certificate.',
    time: '9:10 AM',
    status: 'read'
  },
  {
    id: 'm4',
    senderId: 'c2',
    text: 'Can we schedule a meeting this week?',
    time: '9:15 AM',
    status: 'delivered'
  }],

  c4: [
  {
    id: 'm1',
    senderId: 'me',
    text: 'Hi Suresh, is the sports ground available on Wednesday for the inter-class tournament?',
    time: 'Yesterday 2:00 PM',
    status: 'read'
  },
  {
    id: 'm2',
    senderId: 'c4',
    text: "Wednesday is occupied till 3 PM. After that it's free.",
    time: 'Yesterday 2:15 PM',
    status: 'read'
  },
  {
    id: 'm3',
    senderId: 'me',
    text: "Perfect. We'll schedule it from 3:30 PM then. Also need the lab for science demo.",
    time: 'Yesterday 2:20 PM',
    status: 'read'
  },
  {
    id: 'm4',
    senderId: 'c4',
    text: 'The lab is booked for Thursday.',
    time: 'Yesterday 3:00 PM',
    status: 'read'
  }]

};
const avatarColors: Record<string, string> = {
  PS: 'bg-pink-500',
  AP: 'bg-blue-500',
  KV: 'bg-purple-500',
  SK: 'bg-teal-500',
  DN: 'bg-orange-500',
  RM: 'bg-indigo-500',
  AJ: 'bg-rose-500',
  VS: 'bg-green-500'
};
type FilterTab = 'all' | 'parents' | 'staff';
export function PrivateChats() {
  const [filter, setFilter] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(
    contacts[0]
  );
  const [messages, setMessages] =
  useState<Record<string, Message[]>>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const filteredContacts = contacts.filter((c) => {
    const matchFilter =
    filter === 'all' || c.role === filter.slice(0, -1) as 'parent' | 'staff';
    const matchSearch =
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.subtitle.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });
  const currentMessages = selectedContact ?
  messages[selectedContact.id] || [] :
  [];
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [currentMessages]);
  const handleSend = () => {
    if (!newMessage.trim() || !selectedContact) return;
    const msg: Message = {
      id: `m${Date.now()}`,
      senderId: 'me',
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'sent'
    };
    setMessages((prev) => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), msg]
    }));
    setNewMessage('');
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    setMobileShowChat(true);
  };
  const totalUnread = contacts.reduce((sum, c) => sum + c.unread, 0);
  return (
    <div className="flex flex-col h-full p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Private Chats</h1>
          <p className="text-sm text-gray-500 mt-1">
            Direct private conversations with parents and staff members
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<PlusIcon className="w-4 h-4" />}
          onClick={() => setShowNewChat(true)}>

          New Chat
        </Button>
      </div>

      {/* Stats row */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100">
          <UsersIcon className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">
            {contacts.filter((c) => c.role === 'parent').length} Parents
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg border border-purple-100">
          <UserIcon className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-purple-700">
            {contacts.filter((c) => c.role === 'staff').length} Staff
          </span>
        </div>
        {totalUnread > 0 &&
        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-lg border border-red-100">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-medium text-red-700">
              {totalUnread} Unread
            </span>
          </div>
        }
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-100">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-sm font-medium text-green-700">
            {contacts.filter((c) => c.online).length} Online
          </span>
        </div>
      </div>

      {/* Main chat layout */}
      <div
        className="flex flex-1 gap-0 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        style={{
          minHeight: '560px'
        }}>

        {/* Contact List */}
        <div
          className={`w-full md:w-80 flex-shrink-0 border-r border-gray-200 flex flex-col ${mobileShowChat ? 'hidden md:flex' : 'flex'}`}>

          {/* Search + Filter */}
          <div className="p-3 border-b border-gray-100 space-y-2">
            <div className="relative">
              <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />

            </div>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {(['all', 'parents', 'staff'] as FilterTab[]).map((f) =>
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${filter === f ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>

                  {f}
                </button>
              )}
            </div>
          </div>

          {/* Contact list */}
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.length === 0 ?
            <div className="text-center py-10 text-gray-400">
                <UserIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No contacts found</p>
              </div> :

            filteredContacts.map((contact) =>
            <button
              key={contact.id}
              onClick={() => handleSelectContact(contact)}
              className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 text-left ${selectedContact?.id === contact.id ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''}`}>

                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold ${avatarColors[contact.avatar] || 'bg-gray-400'}`}>

                      {contact.avatar}
                    </div>
                    {contact.online &&
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                }
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-sm font-semibold text-gray-900 truncate">
                        {contact.name}
                      </span>
                      <span className="text-[10px] text-gray-400 flex-shrink-0">
                        {contact.lastTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-1 mt-0.5">
                      <p className="text-xs text-gray-500 truncate">
                        {contact.lastMessage}
                      </p>
                      {contact.unread > 0 &&
                  <span className="flex-shrink-0 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                          {contact.unread}
                        </span>
                  }
                    </div>
                    <span
                  className={`inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded-full font-medium ${contact.role === 'parent' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>

                      {contact.role === 'parent' ? 'Parent' : 'Staff'}
                    </span>
                  </div>
                </button>
            )
            }
          </div>
        </div>

        {/* Chat Window */}
        <div
          className={`flex-1 flex flex-col min-w-0 ${!mobileShowChat ? 'hidden md:flex' : 'flex'}`}>

          {selectedContact ?
          <>
              {/* Chat Header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white">
                <button
                className="md:hidden p-1 rounded-lg hover:bg-gray-100"
                onClick={() => setMobileShowChat(false)}>

                  <ArrowLeftIcon className="w-4 h-4 text-gray-600" />
                </button>
                <div className="relative flex-shrink-0">
                  <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold ${avatarColors[selectedContact.avatar] || 'bg-gray-400'}`}>

                    {selectedContact.avatar}
                  </div>
                  {selectedContact.online &&
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedContact.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {selectedContact.online ?
                  <span className="text-green-600 font-medium">
                        ● Online
                      </span> :

                  selectedContact.subtitle
                  }
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                  title="Voice call">

                    <PhoneIcon className="w-4 h-4" />
                  </button>
                  <button
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                  title="Video call">

                    <VideoIcon className="w-4 h-4" />
                  </button>
                  <button
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                  title="More options">

                    <MoreVerticalIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Contact info strip */}
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${selectedContact.role === 'parent' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>

                  {selectedContact.role === 'parent' ? 'Parent' : 'Staff'}
                </span>
                <span className="text-xs text-gray-500">
                  {selectedContact.subtitle}
                </span>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50/50">
                {currentMessages.length === 0 ?
              <div className="text-center py-10 text-gray-400">
                    <p className="text-sm">
                      No messages yet. Start the conversation!
                    </p>
                  </div> :

              currentMessages.map((msg) => {
                const isMe = msg.senderId === 'me';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>

                        {!isMe &&
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold mr-2 flex-shrink-0 self-end ${avatarColors[selectedContact.avatar] || 'bg-gray-400'}`}>

                            {selectedContact.avatar}
                          </div>
                    }
                        <div className={`max-w-xs lg:max-w-md xl:max-w-lg`}>
                          <div
                        className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${isMe ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm'}`}>

                            {msg.text}
                          </div>
                          <div
                        className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>

                            <span className="text-[10px] text-gray-400">
                              {msg.time}
                            </span>
                            {isMe && (
                        msg.status === 'read' ?
                        <CheckCheckIcon className="w-3 h-3 text-blue-500" /> :
                        msg.status === 'delivered' ?
                        <CheckCheckIcon className="w-3 h-3 text-gray-400" /> :

                        <CheckIcon className="w-3 h-3 text-gray-400" />)
                        }
                          </div>
                        </div>
                      </div>);

              })
              }
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="px-4 py-3 bg-white border-t border-gray-200">
                <div className="flex items-end gap-2">
                  <button
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                  title="Attach file">

                    <PaperclipIcon className="w-5 h-5" />
                  </button>
                  <div className="flex-1 relative">
                    <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`Message ${selectedContact.name}...`}
                    rows={1}
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none leading-relaxed"
                    style={{
                      maxHeight: '120px',
                      overflowY: 'auto'
                    }} />

                  </div>
                  <button
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                  title="Emoji">

                    <SmileIcon className="w-5 h-5" />
                  </button>
                  <button
                  onClick={handleSend}
                  disabled={!newMessage.trim()}
                  className={`p-2.5 rounded-full transition-colors flex-shrink-0 ${newMessage.trim() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                  title="Send message">

                    <SendIcon className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-1.5 ml-2">
                  Press Enter to send · Shift+Enter for new line
                </p>
              </div>
            </> :

          <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SendIcon className="w-7 h-7 text-gray-300" />
                </div>
                <p className="text-base font-medium text-gray-500">
                  Select a conversation
                </p>
                <p className="text-sm mt-1">
                  Choose a contact from the list to start chatting
                </p>
              </div>
            </div>
          }
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChat &&
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">
                Start New Chat
              </h3>
              <button
              onClick={() => setShowNewChat(false)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">

                <XIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div className="relative">
                <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                type="text"
                placeholder="Search parents or staff..."
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus />

              </div>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {contacts.map((contact) =>
              <button
                key={contact.id}
                onClick={() => {
                  handleSelectContact(contact);
                  setShowNewChat(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left">

                    <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 ${avatarColors[contact.avatar] || 'bg-gray-400'}`}>

                      {contact.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {contact.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {contact.subtitle}
                      </p>
                    </div>
                    <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${contact.role === 'parent' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>

                      {contact.role === 'parent' ? 'Parent' : 'Staff'}
                    </span>
                  </button>
              )}
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}