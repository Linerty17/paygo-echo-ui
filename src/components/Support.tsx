
import React from 'react';
import { ArrowLeft } from 'lucide-react';
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
      {/* Header */}
      <div className="glass-header p-4">
        <div className="flex items-center space-x-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6 text-primary" />
          </button>
          <h1 className="text-xl font-semibold text-foreground">Support</h1>
        </div>
      </div>

      <div className="p-6 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-8">How can we help you?</h2>
        </div>

        <div className="space-y-6">
          {/* Live Chat */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="text-primary text-2xl">💬</div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">Live Chat</h3>
                <p className="text-muted-foreground">Chat with our support team directly in the app</p>
              </div>
            </div>
            <Button 
              onClick={handleLiveChat}
              className="w-full h-14 bg-primary hover:bg-primary/80 text-primary-foreground text-lg font-medium rounded-xl mb-4 lavender-glow"
            >
              💬 Start Live Chat
            </Button>
            <p className="text-muted-foreground text-sm">
              Our support agents are available to assist you with any questions or issues.
            </p>
          </div>

          {/* WhatsApp Support */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="text-green-400 text-2xl">💬</div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">Chat on WhatsApp</h3>
                <p className="text-muted-foreground">Chat with our support team on WhatsApp for quick assistance</p>
              </div>
            </div>
            <Button 
              onClick={handleWhatsAppSupport}
              className="w-full h-14 bg-green-500 hover:bg-green-600 text-white text-lg font-medium rounded-xl mb-4"
            >
              💬 Chat on WhatsApp
            </Button>
            <p className="text-muted-foreground text-sm">
              Contact: +234 818 966 8037
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-2">Financial Services</p>
          <p className="text-muted-foreground">PayGo © 2023. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Support;
