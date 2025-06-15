
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Bookmark, 
  MessageSquare, 
  Image,
  Search,
  Layers,
  Settings
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Document Panel</h2>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200">
        <Button variant="ghost" size="sm" className="flex-1 rounded-none">
          <FileText className="w-4 h-4 mr-1" />
          Pages
        </Button>
        <Button variant="ghost" size="sm" className="flex-1 rounded-none">
          <Bookmark className="w-4 h-4 mr-1" />
          Bookmarks
        </Button>
        <Button variant="ghost" size="sm" className="flex-1 rounded-none">
          <MessageSquare className="w-4 h-4 mr-1" />
          Comments
        </Button>
      </div>

      {/* Content Area */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search document..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <Separator />

            {/* Page Thumbnails Placeholder */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">Page Thumbnails</h3>
              <div className="text-sm text-gray-500">
                Load a PDF to view page thumbnails
              </div>
            </div>

            <Separator />

            {/* Bookmarks Placeholder */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">Bookmarks</h3>
              <div className="text-sm text-gray-500">
                No bookmarks found
              </div>
            </div>

            <Separator />

            {/* Annotations Placeholder */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">Annotations</h3>
              <div className="text-sm text-gray-500">
                No annotations yet
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-200">
        <Button variant="outline" size="sm" className="w-full">
          <Settings className="w-4 h-4 mr-2" />
          Sidebar Settings
        </Button>
      </div>
    </div>
  );
};
