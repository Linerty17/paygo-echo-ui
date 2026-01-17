import React from 'react';
import { ArrowLeft, MessageCircle, Phone, Mail, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SupportProps {
  onBack: () => void;
}

const Support: React.FC<SupportProps> = ({ onBack }) => {
  const handleLiveChat = () => {
    const chatButton = document.querySelector('[aria-label="Open live chat"]') as HTMLButtonElement;
    if (chatButton) {
      chatButton.click();
    }
  };

  const handleWhatsAppSupport = () => {
    window.open('https://wa.me/2349023981389', '_blank');
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
          <h1 className="text-lg font-semibold text-foreground">Support</h1>
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
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">How can we help?</h2>
            <p className="text-muted-foreground">We're here to assist you 24/7</p>
          </div>
        </div>

        {/* Support Options */}
        <div className="space-y-3">
          {/* Live Chat */}
          <div className="glass rounded-3xl p-5 border border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Live Chat</h3>
                <p className="text-muted-foreground text-sm">Chat with our team in-app</p>
              </div>
            </div>
            <Button 
              onClick={handleLiveChat}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 hover:opacity-90 text-white font-semibold shadow-lg border-0"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Live Chat
            </Button>
          </div>

          {/* WhatsApp Support */}
          <div className="glass rounded-3xl p-5 border border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">WhatsApp</h3>
                <p className="text-muted-foreground text-sm">Quick assistance on WhatsApp</p>
              </div>
            </div>
            <Button 
              onClick={handleWhatsAppSupport}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white font-semibold shadow-lg border-0"
            >
              <Phone className="w-5 h-5 mr-2" />
              Chat on WhatsApp
            </Button>
            <p className="text-muted-foreground text-xs mt-3 text-center">+234 818 966 8037</p>
          </div>

          {/* Email Support */}
          <div className="glass rounded-3xl p-5 border border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Email Support</h3>
                <p className="text-muted-foreground text-sm">Send us a detailed message</p>
              </div>
            </div>
            <Button 
              onClick={() => window.open('mailto:support@paygo.com', '_blank')}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-600 hover:opacity-90 text-white font-semibold shadow-lg border-0"
            >
              <Mail className="w-5 h-5 mr-2" />
              Send Email
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-4">
          <p className="text-muted-foreground text-sm">PayGo Financial Services</p>
          <p className="text-muted-foreground text-xs mt-1">© 2024 All rights reserved</p>
        </div>
      </div>
    </div>
  );
};

export default Support;
