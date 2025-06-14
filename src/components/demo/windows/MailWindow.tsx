
import React, { useState, useEffect } from 'react';
import { Window } from '../Window';
import { Mail, Star, Trash2, Send, Paperclip, Plus, Reply, Forward } from 'lucide-react';

interface MailWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  zIndex: number;
}

interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  content: string;
  time: Date;
  starred: boolean;
  folder: 'inbox' | 'sent' | 'drafts' | 'trash';
}

export const MailWindow = ({ onClose, onMinimize, onMaximize, zIndex }: MailWindowProps) => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [composing, setComposing] = useState(false);
  const [currentFolder, setCurrentFolder] = useState<'inbox' | 'sent' | 'drafts' | 'trash'>('inbox');
  const [newEmail, setNewEmail] = useState({
    to: '',
    subject: '',
    content: ''
  });

  useEffect(() => {
    // Load emails from localStorage or set default
    const savedEmails = localStorage.getItem('mail-emails');
    if (savedEmails) {
      const parsed = JSON.parse(savedEmails);
      setEmails(parsed.map((email: any) => ({
        ...email,
        time: new Date(email.time)
      })));
    } else {
      const defaultEmails: Email[] = [
        {
          id: '1',
          from: 'security@ravan-os.com',
          to: 'user@ravan-os.com',
          subject: 'Security Update Available',
          content: 'A new security update is available for RAVAN OS. Please update your system to maintain optimal security.',
          time: new Date(),
          starred: true,
          folder: 'inbox'
        },
        {
          id: '2',
          from: 'admin@company.com',
          to: 'user@ravan-os.com',
          subject: 'Weekly Security Report',
          content: 'This week\'s security report shows 15 threats blocked and 3 vulnerabilities patched.',
          time: new Date(Date.now() - 3600000),
          starred: false,
          folder: 'inbox'
        }
      ];
      setEmails(defaultEmails);
      localStorage.setItem('mail-emails', JSON.stringify(defaultEmails));
    }
  }, []);

  const saveEmails = (updatedEmails: Email[]) => {
    setEmails(updatedEmails);
    localStorage.setItem('mail-emails', JSON.stringify(updatedEmails));
  };

  const sendEmail = () => {
    if (!newEmail.to || !newEmail.subject || !newEmail.content) {
      alert('Please fill in all fields');
      return;
    }

    const email: Email = {
      id: Date.now().toString(),
      from: 'user@ravan-os.com',
      to: newEmail.to,
      subject: newEmail.subject,
      content: newEmail.content,
      time: new Date(),
      starred: false,
      folder: 'sent'
    };

    const updatedEmails = [...emails, email];
    saveEmails(updatedEmails);
    
    setNewEmail({ to: '', subject: '', content: '' });
    setComposing(false);
    console.log('Email sent successfully!');
  };

  const deleteEmail = (emailId: string) => {
    const email = emails.find(e => e.id === emailId);
    if (email) {
      if (email.folder === 'trash') {
        // Permanently delete
        const updatedEmails = emails.filter(e => e.id !== emailId);
        saveEmails(updatedEmails);
      } else {
        // Move to trash
        const updatedEmails = emails.map(e => 
          e.id === emailId ? { ...e, folder: 'trash' as const } : e
        );
        saveEmails(updatedEmails);
      }
      if (selectedEmail?.id === emailId) {
        setSelectedEmail(null);
      }
    }
  };

  const toggleStar = (emailId: string) => {
    const updatedEmails = emails.map(e => 
      e.id === emailId ? { ...e, starred: !e.starred } : e
    );
    saveEmails(updatedEmails);
    if (selectedEmail?.id === emailId) {
      setSelectedEmail({ ...selectedEmail, starred: !selectedEmail.starred });
    }
  };

  const replyToEmail = (email: Email) => {
    setNewEmail({
      to: email.from,
      subject: `Re: ${email.subject}`,
      content: `\n\n--- Original Message ---\nFrom: ${email.from}\nSubject: ${email.subject}\n\n${email.content}`
    });
    setComposing(true);
  };

  const filteredEmails = emails.filter(email => email.folder === currentFolder);

  const folderCounts = {
    inbox: emails.filter(e => e.folder === 'inbox').length,
    sent: emails.filter(e => e.folder === 'sent').length,
    drafts: emails.filter(e => e.folder === 'drafts').length,
    trash: emails.filter(e => e.folder === 'trash').length
  };

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
            className="w-full bg-blue-600 text-white py-2 px-4 rounded mb-4 hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Compose
          </button>
          <div className="space-y-2">
            <div 
              onClick={() => setCurrentFolder('inbox')}
              className={`font-semibold flex items-center gap-2 p-2 rounded cursor-pointer ${
                currentFolder === 'inbox' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Mail className="w-4 h-4" />
              Inbox ({folderCounts.inbox})
            </div>
            <div 
              onClick={() => setCurrentFolder('sent')}
              className={`pl-6 p-2 rounded cursor-pointer ${
                currentFolder === 'sent' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Sent ({folderCounts.sent})
            </div>
            <div 
              onClick={() => setCurrentFolder('drafts')}
              className={`pl-6 p-2 rounded cursor-pointer ${
                currentFolder === 'drafts' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Drafts ({folderCounts.drafts})
            </div>
            <div 
              onClick={() => setCurrentFolder('trash')}
              className={`pl-6 p-2 rounded cursor-pointer ${
                currentFolder === 'trash' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Trash ({folderCounts.trash})
            </div>
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
                <button 
                  onClick={sendEmail}
                  className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
                >
                  <Send className="w-4 h-4 inline mr-1" />
                  Send
                </button>
              </div>
              <div className="space-y-4">
                <input 
                  type="email" 
                  placeholder="To:"
                  value={newEmail.to}
                  onChange={(e) => setNewEmail({ ...newEmail, to: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <input 
                  type="text" 
                  placeholder="Subject:"
                  value={newEmail.subject}
                  onChange={(e) => setNewEmail({ ...newEmail, subject: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <textarea 
                  placeholder="Write your message..."
                  value={newEmail.content}
                  onChange={(e) => setNewEmail({ ...newEmail, content: e.target.value })}
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
                {filteredEmails.map((email) => (
                  <div
                    key={email.id}
                    onClick={() => setSelectedEmail(email)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                      selectedEmail?.id === email.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-800">
                        {currentFolder === 'sent' ? `To: ${email.to}` : `From: ${email.from}`}
                      </span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStar(email.id);
                          }}
                        >
                          <Star className={`w-4 h-4 ${email.starred ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                        </button>
                        <span className="text-sm text-gray-500">
                          {email.time.toLocaleTimeString()}
                        </span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteEmail(email.id);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="font-medium text-sm mb-1">{email.subject}</div>
                    <div className="text-sm text-gray-600 truncate">{email.content}</div>
                  </div>
                ))}
                {filteredEmails.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    No emails in {currentFolder}
                  </div>
                )}
              </div>

              {/* Email Content */}
              <div className="flex-1 p-4 overflow-auto">
                {selectedEmail ? (
                  <>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-semibold">{selectedEmail.subject}</h2>
                        <div className="flex gap-2">
                          {currentFolder === 'inbox' && (
                            <>
                              <button 
                                onClick={() => replyToEmail(selectedEmail)}
                                className="p-2 hover:bg-gray-100 rounded flex items-center gap-1"
                              >
                                <Reply className="w-4 h-4" />
                                Reply
                              </button>
                              <button className="p-2 hover:bg-gray-100 rounded">
                                <Forward className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button 
                            onClick={() => toggleStar(selectedEmail.id)}
                            className="p-2 hover:bg-gray-100 rounded"
                          >
                            <Star className={`w-4 h-4 ${selectedEmail.starred ? 'text-yellow-500 fill-current' : ''}`} />
                          </button>
                          <button 
                            onClick={() => deleteEmail(selectedEmail.id)}
                            className="p-2 hover:bg-gray-100 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-4">
                        From: {selectedEmail.from} • To: {selectedEmail.to} • {selectedEmail.time.toLocaleString()}
                      </div>
                    </div>
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-wrap">{selectedEmail.content}</p>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    Select an email to read
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Window>
  );
};
