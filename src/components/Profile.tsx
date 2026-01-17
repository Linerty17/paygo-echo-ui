
import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, Camera, User, Info, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ProfileProps {
  onBack: () => void;
  userEmail: string;
  userName: string;
  profileImage: string | null;
  onProfileImageChange: (image: string) => void;
  onProfileUpdate: (newName: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ 
  onBack, 
  userEmail, 
  userName, 
  profileImage, 
  onProfileImageChange,
  onProfileUpdate 
}) => {
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: userName,
    email: userEmail,
    phone: '+234 801 234 5678',
    about: 'PayGo user since 2023'
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        onProfileImageChange(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdateSubmit = () => {
    onProfileUpdate(profileData.fullName);
    setEditingProfile(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="glass-header p-4">
        <div className="flex items-center space-x-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6 text-primary" />
          </button>
          <h1 className="text-xl font-semibold text-foreground">Profile</h1>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Profile Picture Section */}
        <div className="text-center glass-card py-12 rounded-2xl">
          <div className="relative w-24 h-24 mx-auto mb-4">
            {profileImage ? (
              <img 
                src={profileImage} 
                alt="Profile" 
                className="w-24 h-24 rounded-full object-cover border-4 border-primary/30"
              />
            ) : (
              <div className="w-24 h-24 glass rounded-full flex items-center justify-center border-4 border-primary/30">
                <User className="w-12 h-12 text-primary" />
              </div>
            )}
            <label 
              htmlFor="profile-upload" 
              className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/80"
            >
              <Camera className="w-4 h-4 text-primary-foreground" />
            </label>
            <input 
              id="profile-upload" 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload}
              className="hidden" 
            />
          </div>
          <p className="text-muted-foreground">Tap camera icon to change profile picture</p>
        </div>

        {/* Profile Information */}
        {editingProfile ? (
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h3 className="text-xl font-bold text-foreground mb-4">Edit Profile Information</h3>
            
            <div>
              <label className="block text-muted-foreground mb-2">Full Name</label>
              <Input
                value={profileData.fullName}
                onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                className="w-full glass-input"
              />
            </div>

            <div>
              <label className="block text-muted-foreground mb-2">Email</label>
              <Input
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                className="w-full glass-input"
                disabled
              />
            </div>

            <div>
              <label className="block text-muted-foreground mb-2">Phone Number</label>
              <Input
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                className="w-full glass-input"
              />
            </div>

            <div>
              <label className="block text-muted-foreground mb-2">About</label>
              <Input
                value={profileData.about}
                onChange={(e) => setProfileData({...profileData, about: e.target.value})}
                className="w-full glass-input"
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <Button 
                onClick={handleProfileUpdateSubmit}
                className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground"
              >
                Save Changes
              </Button>
              <Button 
                onClick={() => setEditingProfile(false)}
                variant="outline"
                className="flex-1 glass-button text-foreground"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-2xl overflow-hidden">
            <button 
              onClick={() => setEditingProfile(true)}
              className="w-full p-4 flex items-center justify-between border-b border-white/10 hover:bg-white/5"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 glass rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-foreground">Profile Information</h3>
                  <p className="text-muted-foreground text-sm">View and edit your profile details</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            <div className="p-4 border-b border-white/10">
              <div className="space-y-3">
                <div>
                  <p className="text-muted-foreground text-sm">Full Name</p>
                  <p className="font-medium text-foreground">{profileData.fullName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Email</p>
                  <p className="font-medium text-foreground">{profileData.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Phone</p>
                  <p className="font-medium text-foreground">{profileData.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">About</p>
                  <p className="font-medium text-foreground">{profileData.about}</p>
                </div>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 glass rounded-full flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Help & Support</h3>
                  <p className="text-muted-foreground text-sm">Get help with using PayGo</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 glass rounded-full flex items-center justify-center">
                  <Info className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">About PayGo</h3>
                  <p className="text-muted-foreground text-sm">Learn more about PayGo services</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        )}

        {/* Notification Settings */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-xl font-bold text-foreground mb-6">Notification Settings</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-primary text-lg">🔔</span>
              <div>
                <h4 className="font-semibold text-foreground">Push Notifications</h4>
                <p className="text-muted-foreground text-sm">Enable to receive important updates</p>
              </div>
            </div>
            <div className="w-12 h-6 glass rounded-full relative">
              <div className="w-5 h-5 bg-primary rounded-full absolute top-0.5 right-0.5 shadow"></div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="border-2 border-red-500/30 rounded-2xl p-4 glass-card">
          <Button className="w-full h-12 bg-transparent hover:bg-red-500/10 text-red-400 border-0 text-lg font-medium">
            🚪 Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
