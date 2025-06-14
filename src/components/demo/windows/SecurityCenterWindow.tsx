
import React, { useState, useEffect } from 'react';
import { Window } from '../Window';
import { Shield, Activity, Wifi, Lock, Key, Trash2, Monitor, Eye, Terminal, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useDemoContext } from '../DemoContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';

interface SecurityCenterWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  zIndex: number;
}

interface SecurityAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: Date;
}

interface SecurityStatus {
  antivirus: { active: boolean; lastScan: string; threatsBlocked: number };
  firewall: { enabled: boolean; portsBlocked: number };
  vpn: { connected: boolean; location: string };
  systemMonitor: { processCount: number; networkActivity: number };
}

export const SecurityCenterWindow = ({ onClose, onMinimize, onMaximize, zIndex }: SecurityCenterWindowProps) => {
  const { addNotification } = useDemoContext();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>({
    antivirus: { active: true, lastScan: '2 minutes ago', threatsBlocked: 13 },
    firewall: { enabled: true, portsBlocked: 247 },
    vpn: { connected: false, location: 'Unknown' },
    systemMonitor: { processCount: 47, networkActivity: 23 }
  });
  
  const [alerts, setAlerts] = useState<SecurityAlert[]>([
    { id: '1', type: 'warning', message: 'Suspicious activity blocked at port 443', timestamp: new Date(Date.now() - 300000) },
    { id: '2', type: 'info', message: 'RO360 scan completed successfully', timestamp: new Date(Date.now() - 600000) },
    { id: '3', type: 'error', message: 'Failed login attempt detected', timestamp: new Date(Date.now() - 900000) },
    { id: '4', type: 'info', message: 'Firewall rules updated', timestamp: new Date(Date.now() - 1200000) },
    { id: '5', type: 'warning', message: 'Unusual network traffic detected', timestamp: new Date(Date.now() - 1500000) }
  ]);

  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '> ZOREN Security Terminal v3.2.1',
    '> System initialized. Type "help" for commands.',
    '> '
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const toggleFirewall = () => {
    setSecurityStatus(prev => ({
      ...prev,
      firewall: { ...prev.firewall, enabled: !prev.firewall.enabled }
    }));
    addNotification({
      title: 'Firewall Status',
      message: `Firewall ${!securityStatus.firewall.enabled ? 'enabled' : 'disabled'}`,
      type: 'info'
    });
  };

  const toggleVPN = () => {
    setSecurityStatus(prev => ({
      ...prev,
      vpn: { 
        connected: !prev.vpn.connected, 
        location: !prev.vpn.connected ? 'New York, USA' : 'Unknown' 
      }
    }));
    addNotification({
      title: 'VPN Status',
      message: `VPN ${!securityStatus.vpn.connected ? 'connected' : 'disconnected'}`,
      type: 'info'
    });
  };

  const startQuickScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    const scanInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(scanInterval);
          setIsScanning(false);
          addNotification({
            title: 'Quick Scan Complete',
            message: 'No threats detected',
            type: 'info'
          });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleTerminalCommand = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const command = terminalInput.trim().toLowerCase();
      const newOutput = [...terminalOutput];
      newOutput[newOutput.length - 1] = `> ${terminalInput}`;
      
      switch (command) {
        case 'help':
          newOutput.push('Available commands:');
          newOutput.push('  scan - Run quick system scan');
          newOutput.push('  firewall - Toggle firewall status');
          newOutput.push('  vpn - Toggle VPN connection');
          newOutput.push('  status - Show system status');
          newOutput.push('  clear - Clear terminal');
          break;
        case 'scan':
          newOutput.push('Initiating quick scan...');
          startQuickScan();
          break;
        case 'firewall':
          toggleFirewall();
          newOutput.push(`Firewall ${securityStatus.firewall.enabled ? 'disabled' : 'enabled'}`);
          break;
        case 'vpn':
          toggleVPN();
          newOutput.push(`VPN ${securityStatus.vpn.connected ? 'disconnected' : 'connected'}`);
          break;
        case 'status':
          newOutput.push('=== SYSTEM STATUS ===');
          newOutput.push(`Antivirus: ${securityStatus.antivirus.active ? 'ACTIVE' : 'INACTIVE'}`);
          newOutput.push(`Firewall: ${securityStatus.firewall.enabled ? 'ENABLED' : 'DISABLED'}`);
          newOutput.push(`VPN: ${securityStatus.vpn.connected ? 'CONNECTED' : 'DISCONNECTED'}`);
          break;
        case 'clear':
          setTerminalOutput(['> ZOREN Security Terminal v3.2.1', '> System initialized. Type "help" for commands.']);
          setTerminalInput('');
          return;
        default:
          newOutput.push(`Command not found: ${command}`);
      }
      
      newOutput.push('> ');
      setTerminalOutput(newOutput);
      setTerminalInput('');
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <X className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default: return <CheckCircle className="w-4 h-4 text-blue-400" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error': return 'border-red-600 bg-red-900/20';
      case 'warning': return 'border-yellow-600 bg-yellow-900/20';
      default: return 'border-blue-600 bg-blue-900/20';
    }
  };

  return (
    <Window
      title="ZOREN Security Center"
      onClose={onClose}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      zIndex={zIndex}
      initialSize={{ width: 1000, height: 700 }}
    >
      <div className="h-full bg-gray-900 text-green-400 font-mono overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-blue-900/20"></div>
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-green-500/5 to-transparent"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-green-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="w-8 h-8 text-green-400 animate-pulse" />
                <div>
                  <h1 className="text-xl font-bold">ZOREN SECURITY CENTER</h1>
                  <div className="text-xs text-gray-400">Advanced Threat Protection Active</div>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>SYSTEM PROTECTED</span>
                </div>
                <div className="text-gray-400">
                  Last Update: {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-6 bg-gray-800 border-b border-green-800">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-green-900/50 data-[state=active]:text-green-400">
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="antivirus" className="data-[state=active]:bg-green-900/50 data-[state=active]:text-green-400">
                Antivirus
              </TabsTrigger>
              <TabsTrigger value="firewall" className="data-[state=active]:bg-green-900/50 data-[state=active]:text-green-400">
                Firewall
              </TabsTrigger>
              <TabsTrigger value="tools" className="data-[state=active]:bg-green-900/50 data-[state=active]:text-green-400">
                Tools
              </TabsTrigger>
              <TabsTrigger value="monitor" className="data-[state=active]:bg-green-900/50 data-[state=active]:text-green-400">
                Monitor
              </TabsTrigger>
              <TabsTrigger value="terminal" className="data-[state=active]:bg-green-900/50 data-[state=active]:text-green-400">
                Terminal
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="flex-1 p-4 overflow-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
                {/* Status Overview */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-green-400 border-b border-green-800 pb-2">
                    SECURITY STATUS
                  </h3>
                  
                  {/* Status Cards */}
                  <div className="space-y-3">
                    <div className="p-3 border border-green-600 bg-green-900/20 rounded">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Shield className="w-5 h-5 text-green-400" />
                          <span>RO360 Antivirus</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-xs">ACTIVE</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Last Scan: {securityStatus.antivirus.lastScan} • Threats Blocked: {securityStatus.antivirus.threatsBlocked}
                      </div>
                    </div>

                    <div className={`p-3 border rounded ${securityStatus.firewall.enabled ? 'border-green-600 bg-green-900/20' : 'border-red-600 bg-red-900/20'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Lock className="w-5 h-5" />
                          <span>Firewall</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full animate-pulse ${securityStatus.firewall.enabled ? 'bg-green-400' : 'bg-red-400'}`}></div>
                          <span className="text-xs">{securityStatus.firewall.enabled ? 'ENABLED' : 'DISABLED'}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Ports Blocked: {securityStatus.firewall.portsBlocked}
                      </div>
                    </div>

                    <div className={`p-3 border rounded ${securityStatus.vpn.connected ? 'border-green-600 bg-green-900/20' : 'border-yellow-600 bg-yellow-900/20'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Wifi className="w-5 h-5" />
                          <span>VPN Shield</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full animate-pulse ${securityStatus.vpn.connected ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                          <span className="text-xs">{securityStatus.vpn.connected ? 'CONNECTED' : 'DISCONNECTED'}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Location: {securityStatus.vpn.location}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-6">
                    <h4 className="text-sm font-bold text-green-400 mb-3">QUICK ACTIONS</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={startQuickScan}
                        disabled={isScanning}
                        className="px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded text-xs transition-all"
                      >
                        {isScanning ? 'Scanning...' : 'Quick Scan'}
                      </button>
                      <button 
                        onClick={toggleFirewall}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-all"
                      >
                        Toggle Firewall
                      </button>
                      <button 
                        onClick={toggleVPN}
                        className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs transition-all"
                      >
                        Toggle VPN
                      </button>
                      <button className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition-all">
                        Emergency Lock
                      </button>
                    </div>
                  </div>

                  {/* Scan Progress */}
                  {isScanning && (
                    <div className="mt-4">
                      <div className="text-xs text-green-400 mb-1">System Scan Progress</div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div 
                          className="h-full bg-gradient-to-r from-green-400 to-blue-400 rounded-full transition-all duration-300"
                          style={{ width: `${scanProgress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{scanProgress}% Complete</div>
                    </div>
                  )}
                </div>

                {/* Security Alerts */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-green-400 border-b border-green-800 pb-2">
                    SECURITY ALERTS
                  </h3>
                  
                  <div className="space-y-2 max-h-96 overflow-auto custom-scrollbar">
                    {alerts.map((alert) => (
                      <div key={alert.id} className={`p-3 border rounded ${getAlertColor(alert.type)}`}>
                        <div className="flex items-start space-x-2">
                          {getAlertIcon(alert.type)}
                          <div className="flex-1">
                            <div className="text-sm">{alert.message}</div>
                            <div className="text-xs text-gray-400 mt-1">
                              {alert.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Antivirus Tab */}
            <TabsContent value="antivirus" className="flex-1 p-4">
              <div className="text-center py-8">
                <Shield className="w-16 h-16 text-green-400 mx-auto mb-4 animate-pulse" />
                <h3 className="text-xl font-bold text-green-400 mb-2">RO360 ANTIVIRUS ENGINE</h3>
                <p className="text-gray-400 mb-6">Real-time protection active • Last scan: {securityStatus.antivirus.lastScan}</p>
                
                <div className="flex justify-center space-x-4">
                  <button 
                    onClick={startQuickScan}
                    disabled={isScanning}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded transition-all"
                  >
                    Quick Scan
                  </button>
                  <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded transition-all">
                    Full Scan
                  </button>
                  <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded transition-all">
                    View Quarantine
                  </button>
                </div>
              </div>
            </TabsContent>

            {/* Firewall Tab */}
            <TabsContent value="firewall" className="flex-1 p-4">
              <div className="text-center py-8">
                <Lock className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-400 mb-2">FIREWALL CONTROL</h3>
                <p className="text-gray-400 mb-6">Status: {securityStatus.firewall.enabled ? 'ENABLED' : 'DISABLED'}</p>
                
                <button 
                  onClick={toggleFirewall}
                  className={`px-8 py-4 rounded text-white font-bold text-lg transition-all ${
                    securityStatus.firewall.enabled 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {securityStatus.firewall.enabled ? 'DISABLE FIREWALL' : 'ENABLE FIREWALL'}
                </button>
              </div>
            </TabsContent>

            {/* Tools Tab */}
            <TabsContent value="tools" className="flex-1 p-4">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border border-green-600 bg-green-900/20 rounded text-center">
                  <Key className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <h4 className="font-bold mb-2">Password Manager</h4>
                  <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm">
                    Manage Passwords
                  </button>
                </div>
                
                <div className="p-4 border border-green-600 bg-green-900/20 rounded text-center">
                  <Trash2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <h4 className="font-bold mb-2">File Shredder</h4>
                  <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm">
                    Shred Files
                  </button>
                </div>
                
                <div className="p-4 border border-green-600 bg-green-900/20 rounded text-center">
                  <Eye className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <h4 className="font-bold mb-2">Port Scanner</h4>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">
                    Scan Ports
                  </button>
                </div>
              </div>
            </TabsContent>

            {/* Monitor Tab */}
            <TabsContent value="monitor" className="flex-1 p-4">
              <div className="text-center py-8">
                <Monitor className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-400 mb-2">SYSTEM MONITOR</h3>
                <div className="grid grid-cols-2 gap-4 text-sm max-w-md mx-auto">
                  <div className="p-3 border border-green-600 bg-green-900/20 rounded">
                    <div className="text-gray-400">Active Processes</div>
                    <div className="text-2xl font-bold text-green-400">{securityStatus.systemMonitor.processCount}</div>
                  </div>
                  <div className="p-3 border border-green-600 bg-green-900/20 rounded">
                    <div className="text-gray-400">Network Activity</div>
                    <div className="text-2xl font-bold text-green-400">{securityStatus.systemMonitor.networkActivity}%</div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Terminal Tab */}
            <TabsContent value="terminal" className="flex-1 p-4 flex flex-col">
              <div className="flex items-center space-x-2 mb-4">
                <Terminal className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-bold text-green-400">SECURITY TERMINAL</h3>
              </div>
              
              <div className="flex-1 bg-black/50 border border-green-600 rounded p-4 font-mono text-sm overflow-auto">
                <div className="space-y-1">
                  {terminalOutput.map((line, index) => (
                    <div key={index} className="text-green-400">
                      {line}
                      {index === terminalOutput.length - 1 && (
                        <input
                          type="text"
                          value={terminalInput}
                          onChange={(e) => setTerminalInput(e.target.value)}
                          onKeyDown={handleTerminalCommand}
                          className="bg-transparent border-none outline-none text-green-400 ml-1"
                          style={{ width: `${Math.max(terminalInput.length + 1, 10)}ch` }}
                          autoFocus
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Window>
  );
};
