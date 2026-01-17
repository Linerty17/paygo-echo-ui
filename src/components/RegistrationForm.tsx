import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Gift } from 'lucide-react';
import { z } from 'zod';

interface RegistrationFormProps {
  onRegister: (name: string, email: string, password: string, country: string, phone: string, referralCode?: string) => Promise<void>;
  onSwitchToLogin: () => void;
  isLoading?: boolean;
}

const registrationSchema = z.object({
  name: z.string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z.string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  phone: z.string()
    .trim()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .max(20, { message: "Phone number must be less than 20 digits" })
    .regex(/^[+]?[\d\s-]+$/, { message: "Please enter a valid phone number" }),
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(72, { message: "Password must be less than 72 characters" }),
  country: z.string()
    .min(1, { message: "Please select a country" }),
  referralCode: z.string()
    .max(20, { message: "Referral code must be less than 20 characters" })
    .optional()
    .or(z.literal(''))
});

type FormErrors = {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  country?: string;
  referralCode?: string;
};

const countries = [
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿', dialCode: '+213' },
  { code: 'AO', name: 'Angola', flag: '🇦🇴', dialCode: '+244' },
  { code: 'BJ', name: 'Benin', flag: '🇧🇯', dialCode: '+229' },
  { code: 'BW', name: 'Botswana', flag: '🇧🇼', dialCode: '+267' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', dialCode: '+226' },
  { code: 'BI', name: 'Burundi', flag: '🇧🇮', dialCode: '+257' },
  { code: 'CV', name: 'Cabo Verde', flag: '🇨🇻', dialCode: '+238' },
  { code: 'CM', name: 'Cameroon', flag: '🇨🇲', dialCode: '+237' },
  { code: 'CF', name: 'Central African Republic', flag: '🇨🇫', dialCode: '+236' },
  { code: 'TD', name: 'Chad', flag: '🇹🇩', dialCode: '+235' },
  { code: 'KM', name: 'Comoros', flag: '🇰🇲', dialCode: '+269' },
  { code: 'CG', name: 'Congo', flag: '🇨🇬', dialCode: '+242' },
  { code: 'CD', name: 'Congo (DRC)', flag: '🇨🇩', dialCode: '+243' },
  { code: 'CI', name: "Côte d'Ivoire", flag: '🇨🇮', dialCode: '+225' },
  { code: 'DJ', name: 'Djibouti', flag: '🇩🇯', dialCode: '+253' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', dialCode: '+20' },
  { code: 'GQ', name: 'Equatorial Guinea', flag: '🇬🇶', dialCode: '+240' },
  { code: 'ER', name: 'Eritrea', flag: '🇪🇷', dialCode: '+291' },
  { code: 'SZ', name: 'Eswatini', flag: '🇸🇿', dialCode: '+268' },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', dialCode: '+251' },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦', dialCode: '+241' },
  { code: 'GM', name: 'Gambia', flag: '🇬🇲', dialCode: '+220' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', dialCode: '+233' },
  { code: 'GN', name: 'Guinea', flag: '🇬🇳', dialCode: '+224' },
  { code: 'GW', name: 'Guinea-Bissau', flag: '🇬🇼', dialCode: '+245' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', dialCode: '+254' },
  { code: 'LS', name: 'Lesotho', flag: '🇱🇸', dialCode: '+266' },
  { code: 'LR', name: 'Liberia', flag: '🇱🇷', dialCode: '+231' },
  { code: 'LY', name: 'Libya', flag: '🇱🇾', dialCode: '+218' },
  { code: 'MG', name: 'Madagascar', flag: '🇲🇬', dialCode: '+261' },
  { code: 'MW', name: 'Malawi', flag: '🇲🇼', dialCode: '+265' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱', dialCode: '+223' },
  { code: 'MR', name: 'Mauritania', flag: '🇲🇷', dialCode: '+222' },
  { code: 'MU', name: 'Mauritius', flag: '🇲🇺', dialCode: '+230' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', dialCode: '+212' },
  { code: 'MZ', name: 'Mozambique', flag: '🇲🇿', dialCode: '+258' },
  { code: 'NA', name: 'Namibia', flag: '🇳🇦', dialCode: '+264' },
  { code: 'NE', name: 'Niger', flag: '🇳🇪', dialCode: '+227' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', dialCode: '+234' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼', dialCode: '+250' },
  { code: 'ST', name: 'São Tomé and Príncipe', flag: '🇸🇹', dialCode: '+239' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳', dialCode: '+221' },
  { code: 'SC', name: 'Seychelles', flag: '🇸🇨', dialCode: '+248' },
  { code: 'SL', name: 'Sierra Leone', flag: '🇸🇱', dialCode: '+232' },
  { code: 'SO', name: 'Somalia', flag: '🇸🇴', dialCode: '+252' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', dialCode: '+27' },
  { code: 'SS', name: 'South Sudan', flag: '🇸🇸', dialCode: '+211' },
  { code: 'SD', name: 'Sudan', flag: '🇸🇩', dialCode: '+249' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', dialCode: '+255' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬', dialCode: '+228' },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳', dialCode: '+216' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', dialCode: '+256' },
  { code: 'ZM', name: 'Zambia', flag: '🇿🇲', dialCode: '+260' },
  { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼', dialCode: '+263' }
];

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onRegister, onSwitchToLogin, isLoading }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [hasReferral, setHasReferral] = useState(false);

  // Auto-fill referral code from URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      setReferralCode(refCode.toUpperCase());
      setHasReferral(true);
    }
  }, []);

  const validateForm = (): boolean => {
    const result = registrationSchema.safeParse({ name, email, phone, password, country, referralCode });
    
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.errors.forEach((error) => {
        const field = error.path[0] as keyof FormErrors;
        if (!fieldErrors[field]) {
          fieldErrors[field] = error.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }
    
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    await onRegister(name.trim(), email.trim(), password, country, phone.trim(), referralCode.trim().toUpperCase() || undefined);
    setIsSubmitting(false);
  };

  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="absolute top-6 right-6">
        <span className="text-primary font-medium">Need Help?</span>
      </div>
      
      <div className="w-full max-w-sm space-y-8">
        {/* Animated PayGo Logo moving from left to right continuously */}
        <div className="flex justify-center mb-4 w-full overflow-hidden relative h-24">
          <div className="absolute inset-0 w-full">
            <div className="animate-slide-logo-lr">
              <img 
                src="/lovable-uploads/paygo-wide-logo.png" 
                alt="PayGo Logo"
                className="w-64 h-16 object-fill drop-shadow-2xl"
              />
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Register to continue</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearError('name');
              }}
              className={`w-full h-14 text-lg glass-input rounded-xl placeholder:text-muted-foreground ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <Input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearError('email');
              }}
              className={`w-full h-14 text-lg glass-input rounded-xl placeholder:text-muted-foreground ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <div className="flex gap-2">
              <Select 
                value={country} 
                onValueChange={(value) => {
                  setCountry(value);
                  clearError('country');
                }}
              >
                <SelectTrigger className={`w-28 h-14 text-lg glass-input rounded-xl ${errors.country ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="🌍">
                    {country && (
                      <span className="flex items-center gap-1">
                        <span>{countries.find(c => c.code === country)?.flag}</span>
                        <span className="text-sm">{countries.find(c => c.code === country)?.dialCode}</span>
                      </span>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-60 glass-card border-white/20">
                  {countries.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{c.flag}</span>
                        <span>{c.name}</span>
                        <span className="text-muted-foreground text-sm">{c.dialCode}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  clearError('phone');
                }}
                className={`flex-1 h-14 text-lg glass-input rounded-xl placeholder:text-muted-foreground ${errors.phone ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.country && (
              <p className="text-red-400 text-sm mt-1">{errors.country}</p>
            )}
            {errors.phone && (
              <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
            )}
          </div>


          <div>
            <Input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearError('password');
              }}
              className={`w-full h-14 text-lg glass-input rounded-xl placeholder:text-muted-foreground ${errors.password ? 'border-red-500' : ''}`}
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <Input
                type="text"
                placeholder="Referral Code (Optional)"
                value={referralCode}
                onChange={(e) => {
                  setReferralCode(e.target.value.toUpperCase());
                  clearError('referralCode');
                }}
                className={`w-full h-14 text-lg glass-input rounded-xl placeholder:text-muted-foreground ${errors.referralCode ? 'border-red-500' : ''} ${hasReferral ? 'border-green-500/50 pr-12' : ''}`}
              />
              {hasReferral && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Gift className="w-5 h-5 text-green-400" />
                </div>
              )}
            </div>
            {hasReferral && (
              <p className="text-green-400 text-sm mt-1 flex items-center">
                <Gift className="w-4 h-4 mr-1" />
                Referral code applied! You'll both earn ₦2,500
              </p>
            )}
            {errors.referralCode && (
              <p className="text-red-400 text-sm mt-1">{errors.referralCode}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full h-14 bg-primary hover:bg-primary/80 text-primary-foreground text-lg font-medium rounded-xl transition-colors lavender-glow disabled:opacity-50"
          >
            {isSubmitting || isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Registering...
              </>
            ) : (
              'Register'
            )}
          </Button>
        </form>

        <div className="text-center mt-8">
          <button 
            onClick={onSwitchToLogin}
            className="text-primary font-medium"
          >
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
