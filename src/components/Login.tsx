import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
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
      <div className="absolute top-6 right-6">
        <span className="text-primary font-medium">Need Help?</span>
      </div>
      
      <div className="w-full max-w-sm space-y-8">
        {/* Animated PayGo Logo moving from left to right continuously */}
        <div className="flex justify-center mb-4 w-full overflow-hidden relative h-24">
          <div className="absolute inset-0 w-full">
            <div className="animate-slide-logo-lr">
              <img 
                src="/lovable-uploads/a3ef4c06-bb4a-4f2b-86aa-ca0eb1b2d464.png" 
                alt="PayGo Logo"
                className="h-16 object-contain"
              />
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Login to continue</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full h-14 bg-primary hover:bg-primary/80 text-primary-foreground text-lg font-medium rounded-xl transition-colors lavender-glow disabled:opacity-50"
          >
            {isSubmitting || isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </form>

        <div className="text-center mt-8">
          <button 
            onClick={onSwitchToRegister}
            className="text-primary font-medium"
          >
            Don't have an account? Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
