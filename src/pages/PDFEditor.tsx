
import React, { useState, useRef, useCallback } from 'react';
import { PDFViewer } from '../components/pdf-editor/PDFViewer';
import { Toolbar } from '../components/pdf-editor/Toolbar';
import { Sidebar } from '../components/pdf-editor/Sidebar';
import { PropertiesPanel } from '../components/pdf-editor/PropertiesPanel';
import { PDFProvider } from '../components/pdf-editor/PDFContext';
import { toast } from 'sonner';

const PDFEditor = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [propertiesPanelOpen, setPropertiesPanelOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      toast.success('PDF loaded successfully!');
    } else {
      toast.error('Please select a valid PDF file');
    }
  }, []);

  return (
    <PDFProvider>
      <div className="h-screen flex flex-col bg-gray-100">
        {/* Top Toolbar */}
        <Toolbar 
          onOpenFile={() => fileInputRef.current?.click()}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onToggleProperties={() => setPropertiesPanelOpen(!propertiesPanelOpen)}
        />
        
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          {sidebarOpen && (
            <Sidebar />
          )}
          
          {/* Main PDF Viewer */}
          <div className="flex-1 flex flex-col">
            <PDFViewer />
          </div>
          
          {/* Right Properties Panel */}
          {propertiesPanelOpen && (
            <PropertiesPanel />
          )}
        </div>
        
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </PDFProvider>
  );
};

export default PDFEditor;
