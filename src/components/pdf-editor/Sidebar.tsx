
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePDF } from './PDFContext';
import {
  FileText, Bookmark, MessageSquare, Search, Image, 
  Layers, Grid3X3, FormInput, Signature, Archive,
  ChevronRight, Eye, EyeOff, Plus, Trash2, Edit3
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { state, setCurrentPage } = usePDF();
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarks, setBookmarks] = useState([
    { id: 1, title: 'Introduction', page: 1 },
    { id: 2, title: 'Chapter 1', page: 3 },
    { id: 3, title: 'Chapter 2', page: 8 }
  ]);

  const pages = Array.from({ length: state.totalPages }, (_, i) => i + 1);

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const addBookmark = (page: number, title: string) => {
    const newBookmark = {
      id: bookmarks.length + 1,
      title,
      page
    };
    setBookmarks([...bookmarks, newBookmark]);
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Document Panel</h2>
      </div>

      <Tabs defaultValue="pages" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4 grid w-full grid-cols-5">
          <TabsTrigger value="pages" className="px-2">
            <Grid3X3 className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="bookmarks" className="px-2">
            <Bookmark className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="comments" className="px-2">
            <MessageSquare className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="forms" className="px-2">
            <FormInput className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="signatures" className="px-2">
            <Signature className="w-4 h-4" />
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="pages" className="h-full m-0">
            <div className="p-4 space-y-4 h-full flex flex-col">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search pages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <ScrollArea className="flex-1">
                <div className="grid grid-cols-2 gap-3">
                  {pages.map((pageNumber) => (
                    <div
                      key={pageNumber}
                      className={`relative group cursor-pointer rounded-lg border-2 transition-all duration-200 ${
                        state.currentPage === pageNumber
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handlePageClick(pageNumber)}
                    >
                      <div className="aspect-[3/4] bg-white rounded-md p-2 m-1">
                        <div className="w-full h-full bg-gray-100 rounded border flex items-center justify-center">
                          <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                      </div>
                      <div className="text-xs text-center py-2 font-medium">
                        Page {pageNumber}
                      </div>
                      
                      {/* Page actions overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex space-x-1">
                          <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="bookmarks" className="h-full m-0">
            <div className="p-4 space-y-4 h-full flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Bookmarks</h3>
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <ScrollArea className="flex-1">
                <div className="space-y-2">
                  {bookmarks.map((bookmark) => (
                    <div
                      key={bookmark.id}
                      className="group flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => handlePageClick(bookmark.page)}
                    >
                      <div className="flex items-center space-x-3">
                        <Bookmark className="w-4 h-4 text-blue-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {bookmark.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            Page {bookmark.page}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="comments" className="h-full m-0">
            <div className="p-4 space-y-4 h-full flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Comments</h3>
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <ScrollArea className="flex-1">
                <div className="space-y-3">
                  {state.annotations.map((annotation, index) => (
                    <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {annotation.type || 'Note'}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {annotation.content || 'No content'}
                          </div>
                          <div className="text-xs text-gray-500 mt-2">
                            Page {annotation.page || 1}
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {state.annotations.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">No comments yet</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="forms" className="h-full m-0">
            <div className="p-4 space-y-4 h-full flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Form Fields</h3>
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <ScrollArea className="flex-1">
                <div className="space-y-2">
                  {state.forms.map((form, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FormInput className="w-4 h-4 text-green-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {form.name || `Field ${index + 1}`}
                          </div>
                          <div className="text-xs text-gray-500">
                            {form.type || 'Text Field'} • Page {form.page || 1}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {state.forms.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <FormInput className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">No form fields</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="signatures" className="h-full m-0">
            <div className="p-4 space-y-4 h-full flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Signatures</h3>
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <ScrollArea className="flex-1">
                <div className="text-center py-8 text-gray-500">
                  <Signature className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No signatures</p>
                  <Button size="sm" variant="outline" className="mt-3">
                    Add Signature
                  </Button>
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
