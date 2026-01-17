import React, { useState } from 'react';
import { Send, X } from 'lucide-react';

const FloatingTelegramButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    window.open('https://t.me/officialbluepay', '_blank');
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-20 right-4 z-50 flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-full shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40"
      style={{
        padding: isHovered ? '12px 20px' : '14px',
      }}
      aria-label="Contact support on Telegram"
    >
      <Send className="w-5 h-5" />
      {isHovered && (
        <span className="text-sm font-medium whitespace-nowrap animate-fade-in">
          Support
        </span>
      )}
    </button>
  );
};

export default FloatingTelegramButton;