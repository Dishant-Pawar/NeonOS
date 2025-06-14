
import React, { useState, useEffect } from 'react';
import { Window } from '../Window';
import { Save, Play, Folder, Search, Settings, Plus, FolderOpen, Trash2 } from 'lucide-react';

interface CodeEditorWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  zIndex: number;
}

interface CodeFile {
  id: string;
  name: string;
  content: string;
  language: string;
  lastModified: Date;
}

export const CodeEditorWindow = ({ onClose, onMinimize, onMaximize, zIndex }: CodeEditorWindowProps) => {
  const [files, setFiles] = useState<CodeFile[]>([]);
  const [activeFile, setActiveFile] = useState<CodeFile | null>(null);
  const [showFileManager, setShowFileManager] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [output, setOutput] = useState('');

  useEffect(() => {
    // Load files from localStorage
    const savedFiles = localStorage.getItem('code-editor-files');
    if (savedFiles) {
      const parsed = JSON.parse(savedFiles);
      const filesWithDates = parsed.map((file: any) => ({
        ...file,
        lastModified: new Date(file.lastModified)
      }));
      setFiles(filesWithDates);
      if (filesWithDates.length > 0) {
        setActiveFile(filesWithDates[0]);
      }
    } else {
      // Create default file
      const defaultFile: CodeFile = {
        id: '1',
        name: 'app.js',
        content: `// Welcome to VS Code
function helloWorld() {
    console.log("Hello, RAVAN OS!");
    return "Security-first development environment";
}

// Example security function
function validateInput(input) {
    // Sanitize input to prevent XSS
    return input.replace(/[<>]/g, '');
}

helloWorld();`,
        language: 'javascript',
        lastModified: new Date()
      };
      setFiles([defaultFile]);
      setActiveFile(defaultFile);
      localStorage.setItem('code-editor-files', JSON.stringify([defaultFile]));
    }
  }, []);

  const saveFile = () => {
    if (activeFile) {
      const updatedFile = {
        ...activeFile,
        lastModified: new Date()
      };
      const updatedFiles = files.map(f => f.id === activeFile.id ? updatedFile : f);
      setFiles(updatedFiles);
      setActiveFile(updatedFile);
      localStorage.setItem('code-editor-files', JSON.stringify(updatedFiles));
      console.log('File saved successfully!');
    }
  };

  const createNewFile = () => {
    if (!newFileName.trim()) {
      alert('Please enter a file name');
      return;
    }

    const file: CodeFile = {
      id: Date.now().toString(),
      name: newFileName,
      content: getDefaultContent(newFileName),
      language: getLanguageFromExtension(newFileName),
      lastModified: new Date()
    };

    const updatedFiles = [...files, file];
    setFiles(updatedFiles);
    setActiveFile(file);
    localStorage.setItem('code-editor-files', JSON.stringify(updatedFiles));
    setNewFileName('');
    setShowFileManager(false);
  };

  const deleteFile = (fileId: string) => {
    if (files.length === 1) {
      alert('Cannot delete the last file');
      return;
    }

    const updatedFiles = files.filter(f => f.id !== fileId);
    setFiles(updatedFiles);
    localStorage.setItem('code-editor-files', JSON.stringify(updatedFiles));

    if (activeFile?.id === fileId) {
      setActiveFile(updatedFiles[0] || null);
    }
  };

  const getDefaultContent = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
        return '// JavaScript file\nconsole.log("Hello World!");';
      case 'py':
        return '# Python file\nprint("Hello World!")';
      case 'html':
        return '<!DOCTYPE html>\n<html>\n<head>\n    <title>Document</title>\n</head>\n<body>\n    <h1>Hello World!</h1>\n</body>\n</html>';
      case 'css':
        return '/* CSS file */\nbody {\n    font-family: Arial, sans-serif;\n}';
      default:
        return '// New file';
    }
  };

  const getLanguageFromExtension = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js': return 'javascript';
      case 'py': return 'python';
      case 'html': return 'html';
      case 'css': return 'css';
      case 'json': return 'json';
      default: return 'text';
    }
  };

  const runCode = () => {
    if (activeFile?.language === 'javascript') {
      try {
        // Simple console.log capture for demo
        const logs: string[] = [];
        const originalLog = console.log;
        console.log = (...args) => {
          logs.push(args.join(' '));
          originalLog(...args);
        };

        // Execute the code (in a real editor, this would be more sophisticated)
        eval(activeFile.content);
        
        console.log = originalLog;
        setOutput(logs.join('\n') || 'Code executed successfully (no output)');
      } catch (error) {
        setOutput(`Error: ${(error as Error).message}`);
      }
    } else {
      setOutput(`Running ${activeFile?.language} files is not supported in this demo`);
    }
  };

  return (
    <Window
      title="Visual Studio Code"
      onClose={onClose}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      zIndex={zIndex}
      initialSize={{ width: 1000, height: 700 }}
    >
      <div className="flex h-full bg-gray-900 text-white">
        {showFileManager ? (
          <div className="flex-1 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">File Manager</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowFileManager(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Back to Editor
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Create New File</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="filename.js"
                  className="flex-1 p-2 bg-gray-800 border border-gray-600 rounded text-white"
                  onKeyPress={(e) => e.key === 'Enter' && createNewFile()}
                />
                <button 
                  onClick={createNewFile}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Create
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Files</h3>
              <div className="space-y-2">
                {files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between bg-gray-800 p-3 rounded">
                    <div className="flex-1">
                      <div className="font-medium">{file.name}</div>
                      <div className="text-sm text-gray-400">
                        {file.language} • Modified: {file.lastModified.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setActiveFile(file);
                          setShowFileManager(false);
                        }}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Open
                      </button>
                      <button 
                        onClick={() => deleteFile(file.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                        disabled={files.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Sidebar */}
            <div className="w-16 bg-gray-800 flex flex-col items-center py-2">
              <button 
                onClick={() => setShowFileManager(true)}
                className="p-3 hover:bg-gray-700 rounded mb-2" 
                title="File Manager"
              >
                <Folder className="w-5 h-5" />
              </button>
              <button className="p-3 hover:bg-gray-700 rounded mb-2" title="Search">
                <Search className="w-5 h-5" />
              </button>
              <button 
                onClick={runCode}
                className="p-3 hover:bg-gray-700 rounded mb-2" 
                title="Run Code"
              >
                <Play className="w-5 h-5" />
              </button>
              <button className="p-3 hover:bg-gray-700 rounded" title="Settings">
                <Settings className="w-5 h-5" />
              </button>
            </div>

            {/* File Explorer */}
            <div className="w-64 bg-gray-800 border-r border-gray-700">
              <div className="p-3 border-b border-gray-700">
                <h3 className="text-sm font-semibold">EXPLORER</h3>
              </div>
              <div className="p-2">
                <div className="text-sm text-gray-300 mb-2">RAVAN-PROJECT</div>
                <div className="space-y-1 text-sm">
                  {files.map((file) => (
                    <div 
                      key={file.id}
                      onClick={() => setActiveFile(file)}
                      className={`pl-4 py-1 cursor-pointer rounded ${
                        activeFile?.id === file.id ? 'bg-gray-700' : 'hover:bg-gray-700'
                      }`}
                    >
                      📄 {file.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Editor */}
            <div className="flex-1 flex flex-col">
              {/* Tab Bar */}
              <div className="bg-gray-800 border-b border-gray-700 flex">
                {activeFile && (
                  <div className="px-4 py-2 text-sm bg-gray-900 text-white border-r border-gray-700">
                    {activeFile.name}
                  </div>
                )}
              </div>

              {/* Toolbar */}
              <div className="bg-gray-800 border-b border-gray-700 p-2 flex items-center gap-2">
                <button 
                  onClick={saveFile}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center gap-1"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button 
                  onClick={runCode}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center gap-1"
                >
                  <Play className="w-4 h-4" />
                  Run
                </button>
                <span className="text-sm text-gray-400">
                  {activeFile?.language || 'No file selected'}
                </span>
              </div>

              {/* Editor Content */}
              <div className="flex-1 flex">
                <div className="flex-1 relative">
                  {/* Line Numbers */}
                  {activeFile && (
                    <div className="absolute left-0 top-0 w-12 bg-gray-800 text-gray-500 text-sm font-mono pt-4">
                      {activeFile.content.split('\n').map((_, i) => (
                        <div key={i} className="text-right pr-2 leading-6">
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Code Area */}
                  {activeFile ? (
                    <textarea
                      value={activeFile.content}
                      onChange={(e) => setActiveFile({ ...activeFile, content: e.target.value })}
                      className="w-full h-full bg-gray-900 text-white font-mono text-sm pl-14 p-4 resize-none border-none outline-none leading-6"
                      spellCheck={false}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      Select a file to edit
                    </div>
                  )}
                </div>
              </div>

              {/* Output Panel */}
              {output && (
                <div className="h-32 bg-gray-800 border-t border-gray-700 p-4">
                  <h4 className="text-sm font-semibold mb-2">Output:</h4>
                  <pre className="text-sm text-green-400 whitespace-pre-wrap">{output}</pre>
                </div>
              )}

              {/* Status Bar */}
              <div className="bg-blue-600 text-white text-xs p-1 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span>{activeFile?.language || 'No file'}</span>
                  <span>UTF-8</span>
                  <span>LF</span>
                </div>
                <div className="flex items-center gap-4">
                  <span>Files: {files.length}</span>
                  <span>🔒 RAVAN OS</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Window>
  );
};
