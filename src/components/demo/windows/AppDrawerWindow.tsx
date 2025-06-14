
import React from 'react';
import { Window } from '../Window';
import { 
  FileText, 
  Globe, 
  Mail, 
  Image, 
  Video, 
  Music, 
  Code, 
  Calculator,
  Settings,
  Shield,
  Gamepad2,
  Camera
} from 'lucide-react';
import { useDemoContext } from '../DemoContext';

interface AppDrawerWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  zIndex: number;
}

interface App {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  category: string;
  description: string;
}

export const AppDrawerWindow = ({ onClose, onMinimize, onMaximize, zIndex }: AppDrawerWindowProps) => {
  const { openWindows, setOpenWindows } = useDemoContext();
  
  const apps: App[] = [
    { id: 'writer', name: 'LibreOffice Writer', icon: FileText, category: 'Office', description: 'Document editor' },
    { id: 'browser', name: 'Firefox', icon: Globe, category: 'Internet', description: 'Web browser' },
    { id: 'mail', name: 'Thunderbird', icon: Mail, category: 'Internet', description: 'Email client' },
    { id: 'image-editor', name: 'GIMP', icon: Image, category: 'Graphics', description: 'Image editor' },
    { id: 'video-editor', name: 'Kdenlive', icon: Video, category: 'Multimedia', description: 'Video editor' },
    { id: 'music-player', name: 'Rhythmbox', icon: Music, category: 'Multimedia', description: 'Music player' },
    { id: 'code-editor', name: 'VS Code', icon: Code, category: 'Development', description: 'Code editor' },
    { id: 'calculator-app', name: 'Calculator', icon: Calculator, category: 'Utilities', description: 'Calculator' },
    { id: 'system-settings', name: 'Settings', icon: Settings, category: 'System', description: 'System settings' },
    { id: 'security-center', name: 'Security Center', icon: Shield, category: 'System', description: 'Security tools' },
    { id: 'gaming', name: 'Steam', icon: Gamepad2, category: 'Games', description: 'Gaming platform' },
    { id: 'camera', name: 'Camera', icon: Camera, category: 'Multimedia', description: 'Camera app' },
  ];

  const categories = ['All', 'Office', 'Internet', 'Graphics', 'Multimedia', 'Development', 'Utilities', 'System', 'Games'];
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredApps = selectedCategory === 'All' 
    ? apps 
    : apps.filter(app => app.category === selectedCategory);

  const handleAppClick = (app: App) => {
    console.log(`Launching ${app.name}...`);
    if (!openWindows.includes(app.id)) {
      setOpenWindows([...openWindows, app.id]);
    }
  };

  return (
    <Window
      title="Applications"
      onClose={onClose}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      zIndex={zIndex}
      initialSize={{ width: 800, height: 600 }}
    >
      <div className="flex h-full">
        {/* Categories Sidebar */}
        <div className="w-48 bg-gray-50 border-r border-gray-200 p-4">
          <h3 className="font-semibold text-gray-700 mb-3">Categories</h3>
          <div className="space-y-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-100 text-blue-700'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Apps Grid */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-4 gap-6">
            {filteredApps.map((app, index) => (
              <div
                key={index}
                onClick={() => handleAppClick(app)}
                className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:scale-105"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-3 shadow-lg">
                  <app.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-sm font-medium text-gray-800 text-center mb-1">
                  {app.name}
                </h4>
                <p className="text-xs text-gray-500 text-center">
                  {app.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Window>
  );
};
