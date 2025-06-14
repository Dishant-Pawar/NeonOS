
import React, { useState } from 'react';
import { Window } from '../Window';
import { Mail, Star, Trash2, Send, Paperclip } from 'lucide-react';

interface MailWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  zIndex: number;
}

export const MailWindow = ({ onClose, onMinimize, onMaximize, zIndex }: MailWindowProps) => {
  const [selectedEmail, setSelectedEmail] = useState(0);
  const [composing, setComposing] = useState(false);

  const emails = [
    {
      from: 'security@ravan-os.com',
      subject: 'Security Update Available',
      time: '10:30 AM',
      content: 'A new security update is available for RAVAN OS. Please update your system to maintain optimal security.',
      starred: true
    },
    {
      from: 'admin@company.com',
      subject: 'Weekly Security Report',
      time: '09:15 AM',
      content: 'This week\'s security report shows 15 threats blocked and 3 vulnerabilities patched.',
      starred: false
    },
    {
      from: 'alerts@ravan-os.com',
      subject: 'Firewall Alert',
      time: '08:45 AM',
      content: 'Suspicious activity detected from IP 192.168.1.100. Connection blocked automatically.',
      starred: true
    }
  ];

  return (
    <Window
      title="Thunderbird - Mail Client"
      onClose={onClose}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      zIndex={zIndex}
      initialSize={{ width: 900, height: 600 }}
    >
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
          <button 
            onClick={() => setComposing(true)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded mb-4 hover:bg-blue-700"
          >
            Compose
          </button>
          <div className="space-y-2">
            <div className="font-semibold text-gray-700 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Inbox (3)
            </div>
            <div className="text-gray-600 pl-6 hover:bg-gray-100 p-1 rounded cursor-pointer">Sent</div>
            <div className="text-gray-600 pl-6 hover:bg-gray-100 p-1 rounded cursor-pointer">Drafts</div>
            <div className="text-gray-600 pl-6 hover:bg-gray-100 p-1 rounded cursor-pointer">Spam</div>
            <div className="text-gray-600 pl-6 hover:bg-gray-100 p-1 rounded cursor-pointer">Trash</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {composing ? (
            <div className="flex-1 p-4">
              <div className="mb-4">
                <button 
                  onClick={() => setComposing(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                >
                  Back
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded mr-2">
                  <Send className="w-4 h-4 inline mr-1" />
                  Send
                </button>
              </div>
              <div className="space-y-4">
                <input 
                  type="email" 
                  placeholder="To:"
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <input 
                  type="text" 
                  placeholder="Subject:"
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <textarea 
                  placeholder="Write your message..."
                  className="w-full h-64 p-4 border border-gray-300 rounded resize-none"
                />
                <button className="text-blue-600 hover:bg-blue-50 p-2 rounded">
                  <Paperclip className="w-4 h-4 inline mr-1" />
                  Attach File
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Email List */}
              <div className="h-1/2 border-b border-gray-200 overflow-auto">
                {emails.map((email, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedEmail(index)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                      selectedEmail === index ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-800">{email.from}</span>
                      <div className="flex items-center gap-2">
                        {email.starred && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                        <span className="text-sm text-gray-500">{email.time}</span>
                      </div>
                    </div>
                    <div className="font-medium text-sm mb-1">{email.subject}</div>
                    <div className="text-sm text-gray-600 truncate">{email.content}</div>
                  </div>
                ))}
              </div>

              {/* Email Content */}
              <div className="flex-1 p-4 overflow-auto">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-semibold">{emails[selectedEmail].subject}</h2>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded">
                        <Star className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    From: {emails[selectedEmail].from} • {emails[selectedEmail].time}
                  </div>
                </div>
                <div className="prose">
                  <p>{emails[selectedEmail].content}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Window>
  );
};
