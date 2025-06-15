
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Bookmark, 
  MessageSquare, 
  Search,
  Settings,
  Eye,
  EyeOff,
  Trash2
} from 'lucide-react';
import { usePDF } from './PDFContext';

export const Sidebar: React.FC = () => {
  const { state, setCurrentPage } = usePDF();
  const [activeTab, setActiveTab] = useState<'pages' | 'bookmarks' | 'comments'>('pages');
  const [searchTerm, setSearchTerm] = useState('');

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const renderPageThumbnails = () => {
    if (!state.pdfFile) {
      return (
        <div className="text-sm text-gray-500 text-center py-8">
          Load a PDF to view page thumbnails
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {Array.from({ length: state.totalPages }, (_, i) => i + 1).map((pageNum) => (
          <div
            key={pageNum}
            className={`border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
              pageNum === state.currentPage ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
            onClick={() => handlePageClick(pageNum)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-12 h-16 bg-gray-100 border border-gray-200 rounded flex items-center justify-center">
                  <FileText className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <div className="font-medium text-sm">Page {pageNum}</div>
                  <div className="text-xs text-gray-500">
                    {pageNum === state.currentPage ? 'Current' : 'Click to view'}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" className="p-1">
                  <Eye className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="sm" className="p-1">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderBookmarks = () => {
    return (
      <div className="space-y-2">
        <div className="text-sm text-gray-500">
          No bookmarks found
        </div>
        <Button variant="outline" size="sm" className="w-full">
          Add Bookmark
        </Button>
      </div>
    );
  };

  const renderComments = () => {
    const annotations = state.annotations;
    
    if (annotations.length === 0) {
      return (
        <div className="space-y-2">
          <div className="text-sm text-gray-500">
            No annotations yet
          </div>
          <div className="text-xs text-gray-400">
            Use the toolbar to add text, shapes, or highlights
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {annotations.map((annotation, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium capitalize">
                {annotation.type} Annotation
              </div>
              <div className="text-xs text-gray-500">
                Page {annotation.page}
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Created with {annotation.type} tool
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Button variant="ghost" size="sm" className="p-1">
                <Eye className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" className="p-1">
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Document Panel</h2>
        <p className="text-sm text-gray-500">
          {state.pdfFile ? state.pdfFile.name : 'No document loaded'}
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200">
        <Button 
          variant={activeTab === 'pages' ? 'default' : 'ghost'} 
          size="sm" 
          className="flex-1 rounded-none"
          onClick={() => setActiveTab('pages')}
        >
          <FileText className="w-4 h-4 mr-1" />
          Pages
        </Button>
        <Button 
          variant={activeTab === 'bookmarks' ? 'default' : 'ghost'} 
          size="sm" 
          className="flex-1 rounded-none"
          onClick={() => setActiveTab('bookmarks')}
        >
          <Bookmark className="w-4 h-4 mr-1" />
          Bookmarks
        </Button>
        <Button 
          variant={activeTab === 'comments' ? 'default' : 'ghost'} 
          size="sm" 
          className="flex-1 rounded-none"
          onClick={() => setActiveTab('comments')}
        >
          <MessageSquare className="w-4 h-4 mr-1" />
          Annotations
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Content Area */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {activeTab === 'pages' && renderPageThumbnails()}
          {activeTab === 'bookmarks' && renderBookmarks()}
          {activeTab === 'comments' && renderComments()}
        </div>
      </ScrollArea>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Total Pages:</span>
          <span className="font-medium">{state.totalPages}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <span>Annotations:</span>
          <span className="font-medium">{state.annotations.length}</span>
        </div>
        <Button variant="outline" size="sm" className="w-full">
          <Settings className="w-4 h-4 mr-2" />
          Sidebar Settings
        </Button>
      </div>
    </div>
  );
};
