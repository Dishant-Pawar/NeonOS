
import React, { useState, useRef, useEffect } from 'react';
import { Window } from '../Window';

interface TerminalWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  zIndex: number;
}

interface CommandOutput {
  command: string;
  output: string;
  timestamp: number;
}

export const TerminalWindow = ({ onClose, onMinimize, onMaximize, zIndex }: TerminalWindowProps) => {
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<CommandOutput[]>([
    {
      command: 'welcome',
      output: 'Welcome to RAVAN OS Terminal\nType "help" for available commands.',
      timestamp: Date.now()
    }
  ]);
  const [currentDirectory, setCurrentDirectory] = useState('~');
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commandHistory]);

  const executeCommand = (command: string) => {
    const cmd = command.trim().toLowerCase();
    let output = '';

    switch (cmd) {
      case 'help':
        output = `Available commands:
  help          - Show this help message
  ls            - List directory contents
  pwd           - Print working directory
  cd [dir]      - Change directory
  cat [file]    - Display file contents
  clear         - Clear terminal
  whoami        - Display current user
  uname -a      - System information
  date          - Show current date/time
  ravan-info    - Display RAVAN OS information`;
        break;
      case 'ls':
        output = 'Documents/  Downloads/  Pictures/  Music/  Videos/  ravan-readme.txt  system-info.log';
        break;
      case 'pwd':
        output = `/home/user${currentDirectory === '~' ? '' : currentDirectory}`;
        break;
      case 'whoami':
        output = 'user';
        break;
      case 'uname -a':
        output = 'RAVAN 6.1.0-ravan1 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux';
        break;
      case 'date':
        output = new Date().toString();
        break;
      case 'clear':
        setCommandHistory([]);
        return;
      case 'ravan-info':
        output = `RAVAN OS Demo v1.0
Built on Ubuntu LTS with custom desktop environment
Features: AI Assistant, Multi-layout support, Gaming ready
Visit: https://ravan-os.com for more information`;
        break;
      case 'cat ravan-readme.txt':
        output = `# Welcome to RAVAN OS

RAVAN OS is a next-generation operating system that combines the best of Windows, macOS, and Linux.

Key Features:
- Multiple desktop layouts
- Built-in AI assistant
- Gaming optimized
- Enhanced privacy
- Beautiful animations

This is a demo environment. Download the full version at https://ravan-os.com`;
        break;
      default:
        if (cmd.startsWith('cd ')) {
          const dir = cmd.split(' ')[1];
          if (dir === '..') {
            output = 'Changed to parent directory';
          } else {
            output = `Changed to directory: ${dir}`;
            setCurrentDirectory(`/${dir}`);
          }
        } else if (cmd === '') {
          output = '';
        } else {
          output = `ravan-terminal: command not found: ${cmd}`;
        }
    }

    const newCommand: CommandOutput = {
      command,
      output,
      timestamp: Date.now()
    };

    setCommandHistory(prev => [...prev, newCommand]);
    setCurrentInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput);
    }
  };

  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <Window
      title="RAVAN Terminal"
      onClose={onClose}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      zIndex={zIndex}
      initialSize={{ width: 700, height: 500 }}
    >
      <div
        ref={terminalRef}
        className="h-full bg-black text-green-400 font-mono text-sm p-4 overflow-y-auto cursor-text"
        onClick={handleTerminalClick}
      >
        {commandHistory.map((entry, index) => (
          <div key={index} className="mb-2">
            {entry.command !== 'welcome' && (
              <div className="text-blue-400">
                user@ravan:{currentDirectory}$ {entry.command}
              </div>
            )}
            {entry.output && (
              <pre className="whitespace-pre-wrap text-green-400 mb-2">
                {entry.output}
              </pre>
            )}
          </div>
        ))}
        
        <div className="flex items-center">
          <span className="text-blue-400">user@ravan:{currentDirectory}$ </span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-transparent outline-none text-green-400 ml-1"
            autoFocus
          />
        </div>
      </div>
    </Window>
  );
};
