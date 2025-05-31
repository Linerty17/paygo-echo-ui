
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface JoinCommunitiesProps {
  onBack: () => void;
}

const JoinCommunities: React.FC<JoinCommunitiesProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Join Our Communities</h1>
        </div>
      </div>

      <div className="p-6 space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-purple-600 mb-4">Connect With Us</h2>
          <p className="text-gray-600 text-lg">Join our official channels for updates and support</p>
        </div>

        <div className="space-y-6">
          {/* WhatsApp Channel */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl">💬</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">WhatsApp Channel</h3>
              </div>
            </div>
            <Button className="w-full h-14 bg-green-500 hover:bg-green-600 text-white text-lg font-medium rounded-full">
              💬 Join WhatsApp
            </Button>
          </div>

          {/* Telegram Channel */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl">✈️</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Telegram Channel</h3>
              </div>
            </div>
            <Button className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-white text-lg font-medium rounded-full">
              ✈️ Join Telegram
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinCommunities;
