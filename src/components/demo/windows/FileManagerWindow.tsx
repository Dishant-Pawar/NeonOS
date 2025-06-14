import React, { useState } from 'react';
import { Window } from '../Window';
import { Folder, File, ArrowLeft, Home, Search } from 'lucide-react';

interface FileManagerWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  zIndex: number;
  isMaximized?: boolean;
}

interface FileItem {
  name: string;
  type: 'folder' | 'file';
  size?: string;
  modified: string;
}

export const FileManagerWindow = ({ onClose, onMinimize, onMaximize, zIndex, isMaximized }: FileManagerWindowProps) => {
  const [currentPath, setCurrentPath] = useState('/home/user');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const mockFiles: FileItem[] = [
    { name: 'Documents', type: 'folder', modified: '2024-01-15' },
    { name: 'Downloads', type: 'folder', modified: '2024-01-14' },
    { name: 'Pictures', type: 'folder', modified: '2024-01-13' },
    { name: 'Music', type: 'folder', modified: '2024-01-12' },
    { name: 'Videos', type: 'folder', modified: '2024-01-11' },
    { name: 'ravan-readme.txt', type: 'file', size: '2.5 KB', modified: '2024-01-10' },
    { name: 'system-info.log', type: 'file', size: '15.2 KB', modified: '2024-01-09' },
  ];

  const handleItemDoubleClick = (item: FileItem) => {
    if (item.type === 'folder') {
      setCurrentPath(`${currentPath}/${item.name}`);
    }
  };

  const handleGoHome = () => {
    setCurrentPath('/home/user');
  };

  const handleGoBack = () => {
    const pathParts = currentPath.split('/');
    if (pathParts.length > 1) {
      pathParts.pop();
      setCurrentPath(pathParts.join('/') || '/');
    }
  };

  return (
    <Window
      title="File Manager"
      onClose={onClose}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      zIndex={zIndex}
      initialSize={{ width: 700, height: 500 }}
      isMaximized={isMaximized}
    >
      <div className="flex flex-col h-full">
        {/* Toolbar */}
        <div className="flex items-center space-x-2 p-3 border-b border-gray-200 bg-gray-50">
          <button
            onClick={handleGoBack}
            className="p-2 hover:bg-gray-200 rounded"
            disabled={currentPath === '/'}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleGoHome}
            className="p-2 hover:bg-gray-200 rounded"
          >
            <Home className="w-4 h-4" />
          </button>
          <div className="flex-1 mx-4">
            <div className="flex items-center bg-white border border-gray-300 rounded px-3 py-1">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search files..."
                className="flex-1 outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Address Bar */}
        <div className="px-3 py-2 bg-gray-100 border-b border-gray-200">
          <span className="text-sm text-gray-600">{currentPath}</span>
        </div>

        {/* File List */}
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-3 text-sm font-medium text-gray-600">Name</th>
                <th className="text-left p-3 text-sm font-medium text-gray-600">Size</th>
                <th className="text-left p-3 text-sm font-medium text-gray-600">Modified</th>
              </tr>
            </thead>
            <tbody>
              {mockFiles.map((file, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-50 cursor-pointer ${
                    selectedItem === file.name ? 'bg-blue-100' : ''
                  }`}
                  onClick={() => setSelectedItem(file.name)}
                  onDoubleClick={() => handleItemDoubleClick(file)}
                >
                  <td className="p-3 flex items-center space-x-2">
                    {file.type === 'folder' ? (
                      <Folder className="w-5 h-5 text-blue-500" />
                    ) : (
                      <File className="w-5 h-5 text-gray-500" />
                    )}
                    <span className="text-sm">{file.name}</span>
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    {file.size || (file.type === 'folder' ? '--' : '')}
                  </td>
                  <td className="p-3 text-sm text-gray-600">{file.modified}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Window>
  );
};
