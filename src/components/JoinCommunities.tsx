
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface JoinCommunitiesProps {
  onBack: () => void;
}

const JoinCommunities: React.FC<JoinCommunitiesProps> = ({ onBack }) => {
  const handleJoinWhatsApp = () => {
    window.open('https://chat.whatsapp.com/B8kfCmRCwgbKiUMCZ8fQhe?mode=wwt', '_blank');
  };

  const handleJoinTelegram = () => {
    window.open('https://t.me/officialbluepay2025', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="glass-header p-4">
        <div className="flex items-center space-x-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6 text-primary" />
          </button>
          <h1 className="text-xl font-semibold text-foreground">Join Our Communities</h1>
        </div>
      </div>

      <div className="p-6 space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">Connect With Us</h2>
          <p className="text-muted-foreground text-lg">Join our official channels for updates and support</p>
        </div>

        <div className="space-y-6">
          {/* WhatsApp Channel */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <span className="text-green-400 text-2xl">💬</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">WhatsApp Channel</h3>
              </div>
            </div>
            <Button 
              onClick={handleJoinWhatsApp}
              className="w-full h-14 bg-green-500 hover:bg-green-600 text-white text-lg font-medium rounded-full"
            >
              💬 Join WhatsApp
            </Button>
          </div>

          {/* Telegram Channel */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
                <span className="text-blue-400 text-2xl">✈️</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">Telegram Channel</h3>
              </div>
            </div>
            <Button 
              onClick={handleJoinTelegram}
              className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-white text-lg font-medium rounded-full"
            >
              ✈️ Join Telegram
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinCommunities;
