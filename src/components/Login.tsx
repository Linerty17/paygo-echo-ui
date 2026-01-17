import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Mail, Lock, HelpCircle } from 'lucide-react';
import { z } from 'zod';

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSwitchToRegister: () => void;
  isLoading?: boolean;
}

const loginSchema = z.object({
  email: z.string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  password: z.string()
    .min(1, { message: "Password is required" })
    .max(72, { message: "Password must be less than 72 characters" })
});

type FormErrors = {
  email?: string;
  password?: string;
};

const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToRegister, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const result = loginSchema.safeParse({ email, password });
    
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
    await onLogin(email.trim(), password);
    setIsSubmitting(false);
  };

  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Help Button */}
      <button className="absolute top-6 right-6 glass w-10 h-10 rounded-2xl flex items-center justify-center border border-white/10 hover:border-primary/30 transition-all">
        <HelpCircle className="w-5 h-5 text-primary" />
      </button>
      
      <div className="w-full max-w-sm space-y-8">
        {/* Animated Logo */}
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

        {/* Welcome Text */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to continue to PayGo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError('email');
                }}
                className={`w-full h-14 text-base pl-12 glass border rounded-2xl placeholder:text-muted-foreground focus:border-primary/50 ${
                  errors.email ? 'border-red-500' : 'border-white/10'
                }`}
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Mail className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
            {errors.email && (
              <p className="text-red-400 text-sm mt-1.5 ml-1">{errors.email}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError('password');
                }}
                className={`w-full h-14 text-base pl-12 glass border rounded-2xl placeholder:text-muted-foreground focus:border-primary/50 ${
                  errors.password ? 'border-red-500' : 'border-white/10'
                }`}
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Lock className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1.5 ml-1">{errors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-lavender hover:opacity-90 text-white text-lg font-semibold shadow-lg shadow-primary/30 border-0 mt-6"
          >
            {isSubmitting || isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-muted-foreground">
            Don't have an account?{' '}
            <button 
              onClick={onSwitchToRegister}
              className="text-primary font-semibold hover:underline"
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
