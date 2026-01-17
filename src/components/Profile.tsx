import React, { useState, useRef } from 'react';
import { ArrowLeft, ChevronRight, Camera, User, Info, HelpCircle, Bell, LogOut, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ImageCropper from './ImageCropper';
import { toast } from 'sonner';

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
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
        setImageToCrop(imageUrl);
      };
      reader.readAsDataURL(file);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    onProfileImageChange(croppedImage);
    toast.success('Profile image updated!');
    setImageToCrop(null);
  };

  const handleCropCancel = () => {
    setImageToCrop(null);
  };

  const handleProfileUpdateSubmit = () => {
    onProfileUpdate(profileData.fullName);
    setEditingProfile(false);
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
          <h1 className="text-lg font-semibold text-foreground">Profile</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-4 pb-8 space-y-5">
        {/* Profile Picture Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-lavender/10 to-primary/5 rounded-3xl" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
          
          <div className="relative glass rounded-3xl p-6 border border-white/10 text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-3xl object-cover border-4 border-primary/30 shadow-lg shadow-primary/20"
                />
              ) : (
                <div className="w-24 h-24 glass rounded-3xl flex items-center justify-center border-4 border-primary/30 shadow-lg shadow-primary/20">
                  <User className="w-12 h-12 text-primary" />
                </div>
              )}
              <label 
                htmlFor="profile-upload" 
                className="absolute -bottom-1 -right-1 w-9 h-9 bg-gradient-to-br from-primary to-lavender rounded-xl flex items-center justify-center cursor-pointer hover:opacity-90 shadow-lg transition-all"
              >
                <Camera className="w-4 h-4 text-white" />
              </label>
              <input 
                ref={fileInputRef}
                id="profile-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                className="hidden" 
              />
            </div>
            <h2 className="text-xl font-bold text-foreground">{profileData.fullName}</h2>
            <p className="text-muted-foreground text-sm">{profileData.email}</p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 glass rounded-full border border-primary/20">
              <Sparkles className="w-3 h-3 text-primary" />
              <span className="text-xs font-medium text-primary">Basic Member</span>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        {editingProfile ? (
          <div className="glass rounded-3xl p-5 space-y-4 border border-white/10">
            <h3 className="text-lg font-bold text-foreground">Edit Profile</h3>
            
            <div>
              <label className="block text-muted-foreground text-sm mb-2">Full Name</label>
              <Input
                value={profileData.fullName}
                onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                className="w-full h-12 glass border border-white/10 rounded-2xl"
              />
            </div>

            <div>
              <label className="block text-muted-foreground text-sm mb-2">Email</label>
              <Input
                value={profileData.email}
                className="w-full h-12 glass border border-white/10 rounded-2xl opacity-50"
                disabled
              />
            </div>

            <div>
              <label className="block text-muted-foreground text-sm mb-2">Phone Number</label>
              <Input
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                className="w-full h-12 glass border border-white/10 rounded-2xl"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button 
                onClick={handleProfileUpdateSubmit}
                className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-primary to-lavender hover:opacity-90 border-0"
              >
                Save Changes
              </Button>
              <Button 
                onClick={() => setEditingProfile(false)}
                variant="outline"
                className="flex-1 h-12 rounded-2xl glass border border-white/10"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="glass rounded-3xl overflow-hidden border border-white/10">
            <button 
              onClick={() => setEditingProfile(true)}
              className="w-full p-4 flex items-center justify-between border-b border-white/5 hover:bg-white/5 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-foreground">Profile Information</h3>
                  <p className="text-muted-foreground text-sm">View and edit your details</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            <div className="p-4 space-y-3 border-b border-white/5">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Full Name</span>
                <span className="font-medium text-foreground">{profileData.fullName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Email</span>
                <span className="font-medium text-foreground text-right max-w-[200px] truncate">{profileData.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Phone</span>
                <span className="font-medium text-foreground">{profileData.phone}</span>
              </div>
            </div>

            <button className="w-full p-4 flex items-center justify-between border-b border-white/5 hover:bg-white/5 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                  <HelpCircle className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-foreground">Help & Support</h3>
                  <p className="text-muted-foreground text-sm">Get help with PayGo</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            <button className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                  <Info className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-foreground">About PayGo</h3>
                  <p className="text-muted-foreground text-sm">Learn more about us</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        )}

        {/* Settings */}
        <div className="glass rounded-3xl overflow-hidden border border-white/10">
          <div className="p-4 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Push Notifications</h4>
                <p className="text-muted-foreground text-sm">Receive important updates</p>
              </div>
            </div>
            <div className="w-12 h-7 glass rounded-full relative border border-primary/30 bg-primary/20">
              <div className="w-5 h-5 bg-primary rounded-full absolute top-1 right-1 shadow-lg"></div>
            </div>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-500 to-gray-600 flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Security</h4>
                <p className="text-muted-foreground text-sm">Manage your security</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        {/* Logout Button */}
        <button className="w-full glass rounded-3xl p-4 border border-red-500/20 hover:bg-red-500/10 transition-all flex items-center justify-center gap-3">
          <LogOut className="w-5 h-5 text-red-400" />
          <span className="text-red-400 font-semibold">Logout</span>
        </button>
      </div>

      {imageToCrop && (
        <ImageCropper
          imageSrc={imageToCrop}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          aspectRatio={1}
        />
      )}
    </div>
  );
};

export default Profile;
