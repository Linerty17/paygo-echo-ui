import React from 'react';
import { ArrowLeft, MessageCircle, Send, Users } from 'lucide-react';
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
      {/* Modern Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className="glass w-10 h-10 rounded-2xl flex items-center justify-center border border-white/10 hover:border-primary/30 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Communities</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-4 pb-8 space-y-5">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-lavender/10 to-primary/5 rounded-3xl" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
          
          <div className="relative glass rounded-3xl p-6 border border-white/10 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-lavender flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Join Our Community</h2>
            <p className="text-muted-foreground">Connect with other PayGo users for updates & support</p>
          </div>
        </div>

        {/* Community Options */}
        <div className="space-y-4">
          {/* WhatsApp Channel */}
          <div className="glass rounded-3xl p-5 border border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">WhatsApp Group</h3>
                <p className="text-muted-foreground text-sm">Join our official WhatsApp community</p>
              </div>
            </div>
            <Button 
              onClick={handleJoinWhatsApp}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white font-semibold shadow-lg border-0"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Join WhatsApp
            </Button>
          </div>

          {/* Telegram Channel */}
          <div className="glass rounded-3xl p-5 border border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Send className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">Telegram Channel</h3>
                <p className="text-muted-foreground text-sm">Get instant updates on Telegram</p>
              </div>
            </div>
            <Button 
              onClick={handleJoinTelegram}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-600 hover:opacity-90 text-white font-semibold shadow-lg border-0"
            >
              <Send className="w-5 h-5 mr-2" />
              Join Telegram
            </Button>
          </div>
        </div>

        {/* Benefits */}
        <div className="glass rounded-3xl p-5 border border-white/10">
          <h3 className="text-lg font-semibold text-foreground mb-4">Why Join?</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
                <span className="text-primary text-sm">✓</span>
              </div>
              <p className="text-muted-foreground text-sm">Get exclusive promotions & offers</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
                <span className="text-primary text-sm">✓</span>
              </div>
              <p className="text-muted-foreground text-sm">Instant support from our team</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
                <span className="text-primary text-sm">✓</span>
              </div>
              <p className="text-muted-foreground text-sm">Connect with other PayGo users</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinCommunities;
