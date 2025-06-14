
import React, { useState, useEffect } from 'react';
import { Window } from '../Window';
import { Activity, Cpu, HardDrive, Zap, X, AlertTriangle } from 'lucide-react';
import { useDemoContext } from '../DemoContext';

interface TaskManagerWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  zIndex: number;
}

interface Process {
  id: string;
  name: string;
  type: 'application' | 'system';
  cpu: number;
  memory: number;
  status: 'running' | 'suspended' | 'critical';
  pid: number;
}

export const TaskManagerWindow = ({ onClose, onMinimize, onMaximize, zIndex }: TaskManagerWindowProps) => {
  const { openWindows, setOpenWindows } = useDemoContext();
  const [activeTab, setActiveTab] = useState<'processes' | 'performance' | 'details'>('processes');
  const [processes, setProcesses] = useState<Process[]>([]);
  const [cpuUsage, setCpuUsage] = useState(23);
  const [memoryUsage, setMemoryUsage] = useState(67);
  const [diskUsage, setDiskUsage] = useState(45);

  // Simulate system processes and running applications
  useEffect(() => {
    const systemProcesses: Process[] = [
      { id: 'kernel', name: 'ZOREN Kernel', type: 'system', cpu: 5, memory: 128, status: 'critical', pid: 1 },
      { id: 'desktop', name: 'Desktop Manager', type: 'system', cpu: 2, memory: 64, status: 'running', pid: 2 },
      { id: 'network', name: 'Network Service', type: 'system', cpu: 1, memory: 32, status: 'running', pid: 3 },
      { id: 'security', name: 'Security Monitor', type: 'system', cpu: 3, memory: 48, status: 'running', pid: 4 },
    ];

    const applicationProcesses: Process[] = openWindows.map((windowId, index) => {
      const apps = {
        'file-manager': { name: 'File Manager', cpu: 4, memory: 85 },
        'terminal': { name: 'Terminal', cpu: 1, memory: 24 },
        'app-drawer': { name: 'Applications', cpu: 2, memory: 16 },
        'wifi-finder': { name: 'WiFi Scanner', cpu: 6, memory: 72 },
        'antivirus': { name: 'RO360 Antivirus', cpu: 12, memory: 156 },
        'camera': { name: 'ZOREN Camera', cpu: 15, memory: 203 },
        'task-manager': { name: 'Task Manager', cpu: 3, memory: 45 },
      };

      const appInfo = apps[windowId as keyof typeof apps] || { name: windowId, cpu: 2, memory: 32 };
      
      return {
        id: windowId,
        name: appInfo.name,
        type: 'application' as const,
        cpu: appInfo.cpu + Math.random() * 3,
        memory: appInfo.memory + Math.random() * 20,
        status: 'running' as const,
        pid: 100 + index,
      };
    });

    setProcesses([...systemProcesses, ...applicationProcesses]);
  }, [openWindows]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prev => Math.max(10, Math.min(90, prev + (Math.random() - 0.5) * 10)));
      setMemoryUsage(prev => Math.max(20, Math.min(85, prev + (Math.random() - 0.5) * 5)));
      setDiskUsage(prev => Math.max(10, Math.min(70, prev + (Math.random() - 0.5) * 2)));
      
      setProcesses(prev => prev.map(proc => ({
        ...proc,
        cpu: Math.max(0, proc.cpu + (Math.random() - 0.5) * 2),
        memory: Math.max(8, proc.memory + (Math.random() - 0.5) * 5),
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleKillProcess = (processId: string) => {
    if (processId === 'task-manager') return; // Can't kill itself
    
    if (processes.find(p => p.id === processId)?.type === 'system') {
      alert('Cannot terminate system process');
      return;
    }

    // Remove from open windows if it's an application
    if (openWindows.includes(processId)) {
      setOpenWindows(openWindows.filter(id => id !== processId));
    }
  };

  const getStatusColor = (status: string, type: string) => {
    if (type === 'system') return 'text-cyan-400';
    if (status === 'critical') return 'text-red-400';
    return 'text-green-400';
  };

  const getUsageColor = (usage: number) => {
    if (usage > 80) return 'text-red-400';
    if (usage > 60) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <Window
      title="ZOREN Task Manager"
      onClose={onClose}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      zIndex={zIndex}
      initialSize={{ width: 900, height: 700 }}
      initialPosition={{ x: 150, y: 80 }}
    >
      <div className="h-full bg-gray-900 text-green-400 font-mono overflow-hidden">
        {/* Header */}
        <div className="bg-black/50 border-b border-green-500/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-bold">ZOREN SYSTEM MONITOR v2.1.0</span>
            <div className="ml-auto flex items-center gap-4 text-xs">
              <span className="text-cyan-400">UPTIME: 04:32:15</span>
              <span className="text-yellow-400">PROCESSES: {processes.length}</span>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="bg-gray-800/50 p-2 rounded border border-green-500/20">
              <div className="flex items-center gap-1 mb-1">
                <Cpu className="w-3 h-3" />
                <span>CPU</span>
              </div>
              <div className={`text-lg font-bold ${getUsageColor(cpuUsage)}`}>
                {cpuUsage.toFixed(1)}%
              </div>
            </div>
            <div className="bg-gray-800/50 p-2 rounded border border-green-500/20">
              <div className="flex items-center gap-1 mb-1">
                <Zap className="w-3 h-3" />
                <span>RAM</span>
              </div>
              <div className={`text-lg font-bold ${getUsageColor(memoryUsage)}`}>
                {memoryUsage.toFixed(1)}%
              </div>
            </div>
            <div className="bg-gray-800/50 p-2 rounded border border-green-500/20">
              <div className="flex items-center gap-1 mb-1">
                <HardDrive className="w-3 h-3" />
                <span>DISK</span>
              </div>
              <div className={`text-lg font-bold ${getUsageColor(diskUsage)}`}>
                {diskUsage.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-green-500/30 bg-black/30">
          {[
            { id: 'processes', label: 'PROCESSES' },
            { id: 'performance', label: 'PERFORMANCE' },
            { id: 'details', label: 'DETAILS' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-2 text-xs font-bold border-r border-green-500/30 transition-colors ${
                activeTab === tab.id
                  ? 'bg-green-500/20 text-green-300'
                  : 'hover:bg-green-500/10 text-green-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'processes' && (
            <div className="h-full overflow-auto custom-scrollbar">
              {/* Process Headers */}
              <div className="sticky top-0 bg-black/80 grid grid-cols-12 gap-2 p-3 text-xs font-bold border-b border-green-500/30">
                <div className="col-span-1">PID</div>
                <div className="col-span-4">PROCESS NAME</div>
                <div className="col-span-2">TYPE</div>
                <div className="col-span-2">CPU %</div>
                <div className="col-span-2">MEMORY MB</div>
                <div className="col-span-1">ACTION</div>
              </div>

              {/* Process List */}
              {processes.map(process => (
                <div
                  key={process.id}
                  className={`grid grid-cols-12 gap-2 p-3 text-xs border-b border-green-500/10 hover:bg-green-500/5 transition-colors ${
                    process.type === 'system' ? 'bg-blue-500/5' : ''
                  }`}
                >
                  <div className="col-span-1 text-cyan-400">{process.pid}</div>
                  <div className="col-span-4 flex items-center gap-2">
                    {process.status === 'critical' && (
                      <AlertTriangle className="w-3 h-3 text-red-400" />
                    )}
                    <span className={getStatusColor(process.status, process.type)}>
                      {process.name}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      process.type === 'system' 
                        ? 'bg-blue-500/20 text-blue-300' 
                        : 'bg-green-500/20 text-green-300'
                    }`}>
                      {process.type.toUpperCase()}
                    </span>
                  </div>
                  <div className={`col-span-2 ${getUsageColor(process.cpu)}`}>
                    {process.cpu.toFixed(1)}%
                  </div>
                  <div className={`col-span-2 ${getUsageColor(process.memory / 10)}`}>
                    {process.memory.toFixed(0)} MB
                  </div>
                  <div className="col-span-1">
                    {process.type === 'application' && process.id !== 'task-manager' && (
                      <button
                        onClick={() => handleKillProcess(process.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="p-6 space-y-6">
              <div className="text-center text-green-400 mb-6">
                <h3 className="text-lg font-bold">REAL-TIME SYSTEM PERFORMANCE</h3>
                <p className="text-xs text-green-500">Monitoring ZOREN OS resource utilization</p>
              </div>

              {/* Performance Bars */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>CPU Usage</span>
                    <span className={getUsageColor(cpuUsage)}>{cpuUsage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-4 border border-green-500/30">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        cpuUsage > 80 ? 'bg-red-500' : cpuUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${cpuUsage}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Memory Usage</span>
                    <span className={getUsageColor(memoryUsage)}>{memoryUsage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-4 border border-green-500/30">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        memoryUsage > 80 ? 'bg-red-500' : memoryUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${memoryUsage}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Disk Usage</span>
                    <span className={getUsageColor(diskUsage)}>{diskUsage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-4 border border-green-500/30">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        diskUsage > 80 ? 'bg-red-500' : diskUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${diskUsage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* System Info */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-gray-800/50 p-4 rounded border border-green-500/20">
                  <h4 className="text-green-400 font-bold mb-2">SYSTEM</h4>
                  <div className="text-xs space-y-1">
                    <div>OS: ZOREN v3.0.1</div>
                    <div>Kernel: 6.2.0-zoren</div>
                    <div>Architecture: x64</div>
                  </div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded border border-green-500/20">
                  <h4 className="text-green-400 font-bold mb-2">HARDWARE</h4>
                  <div className="text-xs space-y-1">
                    <div>CPU: Intel i7-12700K</div>
                    <div>RAM: 16 GB DDR4</div>
                    <div>Storage: 1TB NVMe SSD</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="p-6">
              <div className="text-center text-green-400 mb-6">
                <h3 className="text-lg font-bold">SYSTEM DETAILS</h3>
                <p className="text-xs text-green-500">Advanced system information and diagnostics</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gray-800/50 p-4 rounded border border-green-500/20">
                  <h4 className="text-green-400 font-bold mb-3">NETWORK STATUS</h4>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Connection:</span>
                      <span className="text-green-400">ACTIVE</span>
                    </div>
                    <div className="flex justify-between">
                      <span>IP Address:</span>
                      <span className="text-cyan-400">192.168.1.100</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Download:</span>
                      <span className="text-green-400">125.3 Mbps</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Upload:</span>
                      <span className="text-green-400">45.7 Mbps</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 p-4 rounded border border-green-500/20">
                  <h4 className="text-green-400 font-bold mb-3">SECURITY STATUS</h4>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Firewall:</span>
                      <span className="text-green-400">ENABLED</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Antivirus:</span>
                      <span className="text-green-400">RO360 ACTIVE</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Scan:</span>
                      <span className="text-cyan-400">2 hours ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Threats:</span>
                      <span className="text-green-400">0 DETECTED</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Window>
  );
};
