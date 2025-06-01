
import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const LiveChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm PayGo Assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const getAutoReply = (userMessage: string) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('balance') || message.includes('money')) {
      return "You can check your balance on the dashboard. Your current balance is displayed at the top of your screen.";
    }
    if (message.includes('transfer') || message.includes('withdraw')) {
      return "To transfer money, tap 'Transfer' on your dashboard, enter the recipient details and amount. You'll need a PAY ID for transfers.";
    }
    if (message.includes('airtime') || message.includes('recharge')) {
      return "You can buy airtime by tapping 'Airtime' on your dashboard. Select your network, enter phone number and amount.";
    }
    if (message.includes('data')) {
      return "To buy data, tap 'Data' on your dashboard, choose your network and data plan.";
    }
    if (message.includes('pay id') || message.includes('payid')) {
      return "PAY ID costs ₦6,500. It's required for transfers and gives you a unique payment identifier.";
    }
    if (message.includes('upgrade') || message.includes('level')) {
      return "You can upgrade your account to Silver, Gold, Platinum, Emerald, Ruby, Diamond, or Black levels for better benefits.";
    }
    if (message.includes('support') || message.includes('help')) {
      return "For support, you can use this chat or contact our support team through the Support section in your app.";
    }
    if (message.includes('registration') || message.includes('account')) {
      return "To create an account, tap 'Register' and fill in your details. You'll need to verify your email.";
    }
    
    return "I can help you with: checking balance, transfers, airtime/data purchases, PAY ID, account upgrades, and general app support. What would you like to know?";
  };

  const sendMessage = () => {
    if (inputMessage.trim()) {
      const newUserMessage: Message = {
        id: messages.length + 1,
        text: inputMessage,
        isUser: true,
        timestamp: new Date()
      };

      const autoReply: Message = {
        id: messages.length + 2,
        text: getAutoReply(inputMessage),
        isUser: false,
        timestamp: new Date()
      };

      setMessages([...messages, newUserMessage, autoReply]);
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center shadow-lg hover:bg-purple-700 transition-colors z-50"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col z-50">
          {/* Header */}
          <div className="bg-purple-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div>
              <h3 className="font-semibold">PayGo Assistant</h3>
              <p className="text-sm opacity-90">Online</p>
            </div>
            <button onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.isUser
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button onClick={sendMessage} size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveChat;
