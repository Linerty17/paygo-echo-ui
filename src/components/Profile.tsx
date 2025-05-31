
import React from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileProps {
  onBack: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Profile Picture Section */}
        <div className="text-center bg-gray-100 py-12 rounded-2xl">
          <div className="w-24 h-24 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-purple-300">
            <span className="text-purple-600 text-3xl">👤</span>
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">📷</span>
            </div>
          </div>
          <p className="text-gray-600">Tap to change profile picture</p>
        </div>

        {/* Profile Options */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600">👤</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Profile Information</h3>
                <p className="text-gray-600 text-sm">View and edit your profile details</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>

          <div className="p-4 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">❓</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Help & Support</h3>
                <p className="text-gray-600 text-sm">Get help with using PayGo</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600">ℹ️</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">About</h3>
                <p className="text-gray-600 text-sm">Learn more about PayGo</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Notification Settings</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-gray-600">🔔</span>
              <div>
                <h4 className="font-semibold text-gray-900">Push Notifications</h4>
                <p className="text-gray-600 text-sm">Enable to receive important updates</p>
              </div>
            </div>
            <div className="w-12 h-6 bg-gray-200 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow"></div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="border-2 border-red-300 rounded-2xl p-4">
          <Button className="w-full h-12 bg-transparent hover:bg-red-50 text-red-600 border-0 text-lg font-medium">
            🚪 Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
