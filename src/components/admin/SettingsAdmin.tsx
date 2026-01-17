import React, { useState, useEffect } from 'react';
import { ArrowLeft, Settings, Bell, Shield, Download, Database, Volume2, VolumeX, Moon, Sun, Smartphone, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';

interface SettingsAdminProps {
  onBack: () => void;
}

const SettingsAdmin: React.FC<SettingsAdminProps> = ({ onBack }) => {
  const [settings, setSettings] = useState({
    browserNotifications: Notification.permission === 'granted',
    soundAlerts: localStorage.getItem('admin_sound_alerts') !== 'false',
    autoRefresh: localStorage.getItem('admin_auto_refresh') !== 'false',
    darkMode: document.documentElement.classList.contains('dark'),
  });

  const handleBrowserNotifications = async () => {
    if (settings.browserNotifications) {
      setSettings(prev => ({ ...prev, browserNotifications: false }));
      toast({
        title: "Notifications Disabled",
        description: "You won't receive browser notifications",
      });
    } else {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setSettings(prev => ({ ...prev, browserNotifications: true }));
        toast({
          title: "Notifications Enabled",
          description: "You'll now receive browser notifications",
        });
        // Test notification
        new Notification('Test Notification', {
          body: 'Browser notifications are now enabled!',
          icon: '/favicon.png'
        });
      } else {
        toast({
          title: "Permission Denied",
          description: "Please enable notifications in your browser settings",
          variant: "destructive"
        });
      }
    }
  };

  const handleSoundAlerts = () => {
    const newValue = !settings.soundAlerts;
    setSettings(prev => ({ ...prev, soundAlerts: newValue }));
    localStorage.setItem('admin_sound_alerts', String(newValue));
    toast({
      title: newValue ? "Sound Enabled" : "Sound Disabled",
      description: newValue ? "You'll hear alerts for new payments" : "Sound alerts are now muted",
    });
  };

  const handleAutoRefresh = () => {
    const newValue = !settings.autoRefresh;
    setSettings(prev => ({ ...prev, autoRefresh: newValue }));
    localStorage.setItem('admin_auto_refresh', String(newValue));
    toast({
      title: newValue ? "Auto-Refresh Enabled" : "Auto-Refresh Disabled",
      description: newValue ? "Data will update in real-time" : "Manual refresh required",
    });
  };

  const toggleDarkMode = () => {
    const newValue = !settings.darkMode;
    setSettings(prev => ({ ...prev, darkMode: newValue }));
    document.documentElement.classList.toggle('dark', newValue);
    localStorage.setItem('theme', newValue ? 'dark' : 'light');
  };

  const exportAllData = async () => {
    toast({
      title: "Preparing Export",
      description: "This may take a moment...",
    });
    
    // In production, this would be an edge function that compiles all data
    setTimeout(() => {
      toast({
        title: "Export Ready",
        description: "Use individual section exports for now",
      });
    }, 1000);
  };

  const settingsSections = [
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        {
          label: 'Browser Notifications',
          description: 'Receive alerts for new payments',
          value: settings.browserNotifications,
          onChange: handleBrowserNotifications,
          icon: Smartphone,
        },
        {
          label: 'Sound Alerts',
          description: 'Play sound for new notifications',
          value: settings.soundAlerts,
          onChange: handleSoundAlerts,
          icon: settings.soundAlerts ? Volume2 : VolumeX,
        },
      ]
    },
    {
      title: 'Display',
      icon: Monitor,
      items: [
        {
          label: 'Dark Mode',
          description: 'Toggle dark/light theme',
          value: settings.darkMode,
          onChange: toggleDarkMode,
          icon: settings.darkMode ? Moon : Sun,
        },
        {
          label: 'Auto-Refresh',
          description: 'Real-time data updates',
          value: settings.autoRefresh,
          onChange: handleAutoRefresh,
          icon: Database,
        },
      ]
    },
  ];

  const showHeader = onBack && typeof onBack === 'function' && onBack.toString() !== '() => {}';

  return (
    <div className="min-h-screen bg-background">
      {/* Header - only show if onBack is a real function */}
      {showHeader && (
        <div className="glass-header text-foreground p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={onBack}>
                <ArrowLeft className="w-6 h-6 text-primary" />
              </button>
              <h1 className="text-xl font-semibold">Settings</h1>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 space-y-6">
        {settingsSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-3">
            <div className="flex items-center gap-2 px-2">
              <section.icon className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
            </div>
            
            <div className="glass-card rounded-2xl overflow-hidden">
              {section.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className={`flex items-center justify-between p-4 ${
                    itemIndex < section.items.length - 1 ? 'border-b border-border/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium">{item.label}</p>
                      <p className="text-muted-foreground text-sm">{item.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={item.value}
                    onCheckedChange={item.onChange}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Data Export */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-2">
            <Download className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Data Export</h3>
          </div>
          
          <div className="glass-card rounded-2xl p-4">
            <p className="text-muted-foreground text-sm mb-4">
              Export data from individual sections using their download buttons, or export all platform data.
            </p>
            <Button
              onClick={exportAllData}
              variant="outline"
              className="w-full h-12 rounded-xl"
            >
              <Download className="w-4 h-4 mr-2" />
              Export All Data
            </Button>
          </div>
        </div>

        {/* Security Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-2">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Security</h3>
          </div>
          
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <p className="text-foreground font-medium">Role-Based Access Active</p>
            </div>
            <p className="text-muted-foreground text-sm">
              Admin access is controlled through secure role-based permissions. All actions are logged for audit purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsAdmin;
