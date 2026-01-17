import React, { useState, useRef } from 'react';
import { ArrowLeft, ChevronRight, Camera, User, Info, HelpCircle, Bell, LogOut, Shield, Sparkles, Sun, Moon, Monitor, Edit3, Check, X, Phone, MapPin, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ImageCropper from './ImageCropper';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';

interface ProfileProps {
  onBack: () => void;
  userEmail: string;
  userName: string;
  userPhone: string | null;
  userCountry: string;
  profileImage: string | null;
  onProfileImageChange: (image: string) => void;
  onProfileUpdate: (updates: { name?: string; phone?: string; country?: string }) => Promise<void>;
  onLogout: () => void;
}

const countries = [
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿' },
  { code: 'AO', name: 'Angola', flag: '🇦🇴' },
  { code: 'BJ', name: 'Benin', flag: '🇧🇯' },
  { code: 'BW', name: 'Botswana', flag: '🇧🇼' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫' },
  { code: 'BI', name: 'Burundi', flag: '🇧🇮' },
  { code: 'CV', name: 'Cabo Verde', flag: '🇨🇻' },
  { code: 'CM', name: 'Cameroon', flag: '🇨🇲' },
  { code: 'CF', name: 'Central African Republic', flag: '🇨🇫' },
  { code: 'TD', name: 'Chad', flag: '🇹🇩' },
  { code: 'KM', name: 'Comoros', flag: '🇰🇲' },
  { code: 'CG', name: 'Congo', flag: '🇨🇬' },
  { code: 'CD', name: 'Congo (DRC)', flag: '🇨🇩' },
  { code: 'CI', name: "Côte d'Ivoire", flag: '🇨🇮' },
  { code: 'DJ', name: 'Djibouti', flag: '🇩🇯' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
  { code: 'GQ', name: 'Equatorial Guinea', flag: '🇬🇶' },
  { code: 'ER', name: 'Eritrea', flag: '🇪🇷' },
  { code: 'SZ', name: 'Eswatini', flag: '🇸🇿' },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹' },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦' },
  { code: 'GM', name: 'Gambia', flag: '🇬🇲' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
  { code: 'GN', name: 'Guinea', flag: '🇬🇳' },
  { code: 'GW', name: 'Guinea-Bissau', flag: '🇬🇼' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: 'LS', name: 'Lesotho', flag: '🇱🇸' },
  { code: 'LR', name: 'Liberia', flag: '🇱🇷' },
  { code: 'LY', name: 'Libya', flag: '🇱🇾' },
  { code: 'MG', name: 'Madagascar', flag: '🇲🇬' },
  { code: 'MW', name: 'Malawi', flag: '🇲🇼' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱' },
  { code: 'MR', name: 'Mauritania', flag: '🇲🇷' },
  { code: 'MU', name: 'Mauritius', flag: '🇲🇺' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦' },
  { code: 'MZ', name: 'Mozambique', flag: '🇲🇿' },
  { code: 'NA', name: 'Namibia', flag: '🇳🇦' },
  { code: 'NE', name: 'Niger', flag: '🇳🇪' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼' },
  { code: 'ST', name: 'São Tomé and Príncipe', flag: '🇸🇹' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳' },
  { code: 'SC', name: 'Seychelles', flag: '🇸🇨' },
  { code: 'SL', name: 'Sierra Leone', flag: '🇸🇱' },
  { code: 'SO', name: 'Somalia', flag: '🇸🇴' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'SS', name: 'South Sudan', flag: '🇸🇸' },
  { code: 'SD', name: 'Sudan', flag: '🇸🇩' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬' },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
  { code: 'ZM', name: 'Zambia', flag: '🇿🇲' },
  { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼' }
];

const Profile: React.FC<ProfileProps> = ({ 
  onBack, 
  userEmail, 
  userName, 
  userPhone,
  userCountry,
  profileImage, 
  onProfileImageChange,
  onProfileUpdate,
  onLogout
}) => {
  const { theme, setTheme } = useTheme();
  const [editingField, setEditingField] = useState<'name' | 'phone' | 'country' | null>(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [showEmail, setShowEmail] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [editValues, setEditValues] = useState({
    name: userName,
    phone: userPhone || '',
    country: userCountry
  });

  const maskEmail = (email: string) => {
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 2) return `${localPart[0]}***@${domain}`;
    return `${localPart.slice(0, 2)}${'*'.repeat(Math.min(localPart.length - 2, 6))}@${domain}`;
  };

  const getCountryInfo = (code: string) => {
    return countries.find(c => c.code === code) || { name: code, flag: '🌍' };
  };

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

  const handleSaveField = async (field: 'name' | 'phone' | 'country') => {
    setIsSaving(true);
    try {
      await onProfileUpdate({ [field]: editValues[field] });
      toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`);
      setEditingField(null);
    } catch (error) {
      toast.error('Failed to update profile');
    }
    setIsSaving(false);
  };

  const handleCancelEdit = (field: 'name' | 'phone' | 'country') => {
    setEditValues({
      ...editValues,
      [field]: field === 'name' ? userName : field === 'phone' ? (userPhone || '') : userCountry
    });
    setEditingField(null);
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
            <h2 className="text-xl font-bold text-foreground">{userName}</h2>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-muted-foreground text-sm">
                {showEmail ? userEmail : maskEmail(userEmail)}
              </span>
              <button 
                onClick={() => setShowEmail(!showEmail)}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {showEmail ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 glass rounded-full border border-primary/20">
              <Sparkles className="w-3 h-3 text-primary" />
              <span className="text-xs font-medium text-primary">Basic Member</span>
            </div>
          </div>
        </div>

        {/* Editable Profile Fields */}
        <div className="glass rounded-3xl overflow-hidden border border-white/10">
          <div className="p-4 border-b border-white/5">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Personal Information
            </h3>
            <p className="text-muted-foreground text-xs mt-1">Tap any field to edit</p>
          </div>

          {/* Name Field */}
          <div className="p-4 border-b border-white/5">
            {editingField === 'name' ? (
              <div className="space-y-3">
                <label className="text-muted-foreground text-xs flex items-center gap-2">
                  <User className="w-3 h-3" /> Full Name
                </label>
                <Input
                  value={editValues.name}
                  onChange={(e) => setEditValues({...editValues, name: e.target.value})}
                  className="h-12 glass border border-primary/30 rounded-2xl focus:border-primary"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleSaveField('name')}
                    disabled={isSaving || !editValues.name.trim()}
                    size="sm"
                    className="flex-1 h-10 rounded-xl bg-gradient-to-r from-primary to-lavender hover:opacity-90"
                  >
                    <Check className="w-4 h-4 mr-1" /> Save
                  </Button>
                  <Button 
                    onClick={() => handleCancelEdit('name')}
                    variant="outline"
                    size="sm"
                    className="flex-1 h-10 rounded-xl glass border border-white/10"
                  >
                    <X className="w-4 h-4 mr-1" /> Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setEditingField('name')}
                className="w-full flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-violet-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-muted-foreground text-xs">Full Name</p>
                    <p className="font-medium text-foreground">{userName}</p>
                  </div>
                </div>
                <Edit3 className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            )}
          </div>

          {/* Phone Field */}
          <div className="p-4 border-b border-white/5">
            {editingField === 'phone' ? (
              <div className="space-y-3">
                <label className="text-muted-foreground text-xs flex items-center gap-2">
                  <Phone className="w-3 h-3" /> Phone Number
                </label>
                <Input
                  value={editValues.phone}
                  onChange={(e) => setEditValues({...editValues, phone: e.target.value})}
                  className="h-12 glass border border-primary/30 rounded-2xl focus:border-primary"
                  type="tel"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleSaveField('phone')}
                    disabled={isSaving}
                    size="sm"
                    className="flex-1 h-10 rounded-xl bg-gradient-to-r from-primary to-lavender hover:opacity-90"
                  >
                    <Check className="w-4 h-4 mr-1" /> Save
                  </Button>
                  <Button 
                    onClick={() => handleCancelEdit('phone')}
                    variant="outline"
                    size="sm"
                    className="flex-1 h-10 rounded-xl glass border border-white/10"
                  >
                    <X className="w-4 h-4 mr-1" /> Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setEditingField('phone')}
                className="w-full flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-muted-foreground text-xs">Phone Number</p>
                    <p className="font-medium text-foreground">{userPhone || 'Not set'}</p>
                  </div>
                </div>
                <Edit3 className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            )}
          </div>

          {/* Country Field */}
          <div className="p-4 border-b border-white/5">
            {editingField === 'country' ? (
              <div className="space-y-3">
                <label className="text-muted-foreground text-xs flex items-center gap-2">
                  <MapPin className="w-3 h-3" /> Country
                </label>
                <Select value={editValues.country} onValueChange={(value) => setEditValues({...editValues, country: value})}>
                  <SelectTrigger className="h-12 glass border border-primary/30 rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 glass-card border-white/20">
                    {countries.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{c.flag}</span>
                          <span>{c.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleSaveField('country')}
                    disabled={isSaving}
                    size="sm"
                    className="flex-1 h-10 rounded-xl bg-gradient-to-r from-primary to-lavender hover:opacity-90"
                  >
                    <Check className="w-4 h-4 mr-1" /> Save
                  </Button>
                  <Button 
                    onClick={() => handleCancelEdit('country')}
                    variant="outline"
                    size="sm"
                    className="flex-1 h-10 rounded-xl glass border border-white/10"
                  >
                    <X className="w-4 h-4 mr-1" /> Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setEditingField('country')}
                className="w-full flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-600/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-muted-foreground text-xs">Country</p>
                    <p className="font-medium text-foreground flex items-center gap-2">
                      <span>{getCountryInfo(userCountry).flag}</span>
                      <span>{getCountryInfo(userCountry).name}</span>
                    </p>
                  </div>
                </div>
                <Edit3 className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            )}
          </div>

          {/* Email Field - Read Only */}
          <div className="p-4">
            <div className="flex items-center justify-between opacity-60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-amber-400" />
                </div>
                <div className="text-left">
                  <p className="text-muted-foreground text-xs">Email Address</p>
                  <p className="font-medium text-foreground flex items-center gap-2">
                    {showEmail ? userEmail : maskEmail(userEmail)}
                    <button 
                      onClick={() => setShowEmail(!showEmail)}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {showEmail ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>
                  </p>
                </div>
              </div>
              <Lock className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-xs mt-2 ml-13 pl-[52px]">Email cannot be changed</p>
          </div>
        </div>

        {/* Help & Info Section */}
        <div className="glass rounded-3xl overflow-hidden border border-white/10">
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

          <div className="p-4 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-white" />
                ) : theme === 'light' ? (
                  <Sun className="w-5 h-5 text-white" />
                ) : (
                  <Monitor className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Appearance</h4>
                <p className="text-muted-foreground text-sm">Choose your theme</p>
              </div>
            </div>
            <div className="flex gap-1 glass rounded-2xl p-1 border border-white/10">
              <button
                onClick={() => setTheme('light')}
                className={`p-2 rounded-xl transition-all ${theme === 'light' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}
                title="Light mode"
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-2 rounded-xl transition-all ${theme === 'dark' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}
                title="Dark mode"
              >
                <Moon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`p-2 rounded-xl transition-all ${theme === 'system' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}
                title="System"
              >
                <Monitor className="w-4 h-4" />
              </button>
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
        <button 
          onClick={onLogout}
          className="w-full glass rounded-3xl p-4 border border-red-500/20 hover:bg-red-500/10 transition-all flex items-center justify-center gap-3"
        >
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