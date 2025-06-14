import React, { useState, useEffect } from 'react';
import { Window } from '../Window';
import { Bold, Italic, Underline, Save, FileText, Printer, FolderOpen, Plus } from 'lucide-react';

interface WriterWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  zIndex: number;
  isMaximized?: boolean;
}

interface Document {
  id: string;
  name: string;
  content: string;
  lastModified: Date;
}

export const WriterWindow = ({ onClose, onMinimize, onMaximize, zIndex, isMaximized }: WriterWindowProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeDocument, setActiveDocument] = useState<Document | null>(null);
  const [content, setContent] = useState('Welcome to LibreOffice Writer!\n\nStart typing your document here...');
  const [fontSize, setFontSize] = useState(12);
  const [showDocuments, setShowDocuments] = useState(false);
  const [documentName, setDocumentName] = useState('Untitled Document');

  useEffect(() => {
    // Load documents from localStorage
    const savedDocs = localStorage.getItem('writer-documents');
    if (savedDocs) {
      const parsed = JSON.parse(savedDocs);
      setDocuments(parsed.map((doc: any) => ({
        ...doc,
        lastModified: new Date(doc.lastModified)
      })));
    }
  }, []);

  const saveDocument = () => {
    const doc: Document = {
      id: activeDocument?.id || Date.now().toString(),
      name: documentName,
      content,
      lastModified: new Date()
    };

    const updatedDocs = activeDocument 
      ? documents.map(d => d.id === activeDocument.id ? doc : d)
      : [...documents, doc];

    setDocuments(updatedDocs);
    setActiveDocument(doc);
    localStorage.setItem('writer-documents', JSON.stringify(updatedDocs));
    console.log('Document saved successfully!');
  };

  const loadDocument = (doc: Document) => {
    setActiveDocument(doc);
    setContent(doc.content);
    setDocumentName(doc.name);
    setShowDocuments(false);
  };

  const deleteDocument = (docId: string) => {
    const updatedDocs = documents.filter(d => d.id !== docId);
    setDocuments(updatedDocs);
    localStorage.setItem('writer-documents', JSON.stringify(updatedDocs));
    if (activeDocument?.id === docId) {
      setActiveDocument(null);
      setContent('Welcome to LibreOffice Writer!\n\nStart typing your document here...');
      setDocumentName('Untitled Document');
    }
  };

  const createNewDocument = () => {
    setActiveDocument(null);
    setContent('');
    setDocumentName('Untitled Document');
    setShowDocuments(false);
  };

  return (
    <Window
      title="LibreOffice Writer"
      onClose={onClose}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      zIndex={zIndex}
      initialSize={{ width: 900, height: 700 }}
      isMaximized={isMaximized}
    >
      <div className="flex flex-col h-full bg-white">
        {showDocuments ? (
          <div className="flex-1 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Documents</h2>
              <div className="flex gap-2">
                <button 
                  onClick={createNewDocument}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New
                </button>
                <button 
                  onClick={() => setShowDocuments(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Back to Editor
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {documents.map((doc) => (
                <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{doc.name}</h3>
                      <p className="text-gray-600 text-sm">
                        Last modified: {doc.lastModified.toLocaleDateString()} {doc.lastModified.toLocaleTimeString()}
                      </p>
                      <p className="text-gray-500 text-sm mt-2 truncate">
                        {doc.content.substring(0, 100)}...
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button 
                        onClick={() => loadDocument(doc)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Open
                      </button>
                      <button 
                        onClick={() => deleteDocument(doc.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {documents.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No documents found. Create your first document!
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div className="border-b border-gray-200 p-2 flex items-center gap-2 bg-gray-50">
              <button 
                onClick={saveDocument}
                className="p-2 hover:bg-gray-200 rounded flex items-center gap-1"
                title="Save Document"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button 
                onClick={() => setShowDocuments(true)}
                className="p-2 hover:bg-gray-200 rounded flex items-center gap-1"
                title="Open Document"
              >
                <FolderOpen className="w-4 h-4" />
                Open
              </button>
              <button 
                onClick={createNewDocument}
                className="p-2 hover:bg-gray-200 rounded flex items-center gap-1"
                title="New Document"
              >
                <Plus className="w-4 h-4" />
                New
              </button>
              <button className="p-2 hover:bg-gray-200 rounded">
                <Printer className="w-4 h-4" />
              </button>
              <div className="border-l border-gray-300 h-6 mx-2" />
              <input 
                type="text"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
                placeholder="Document name"
              />
              <div className="border-l border-gray-300 h-6 mx-2" />
              <button className="p-2 hover:bg-gray-200 rounded">
                <Bold className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded">
                <Italic className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded">
                <Underline className="w-4 h-4" />
              </button>
              <select 
                value={fontSize} 
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1"
              >
                <option value={10}>10</option>
                <option value={12}>12</option>
                <option value={14}>14</option>
                <option value={16}>16</option>
                <option value={18}>18</option>
                <option value={24}>24</option>
              </select>
            </div>

            {/* Document Area */}
            <div className="flex-1 p-4 bg-gray-100">
              <div className="bg-white shadow-lg max-w-4xl mx-auto min-h-full p-8">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-full resize-none border-none outline-none"
                  style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}
                  placeholder="Start typing your document..."
                />
              </div>
            </div>

            {/* Status Bar */}
            <div className="border-t border-gray-200 p-2 bg-gray-50 text-sm text-gray-600">
              Words: {content.split(/\s+/).filter(word => word.length > 0).length} | 
              Characters: {content.length} | 
              Document: {documentName} |
              Status: {activeDocument ? 'Saved' : 'Unsaved'}
            </div>
          </>
        )}
      </div>
    </Window>
  );
};
