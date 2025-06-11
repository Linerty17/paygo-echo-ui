
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LoginProps {
  onLogin: (email: string, password: string) => void;
  onSwitchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email, password);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="absolute top-6 right-6">
        <span className="text-purple-600 font-medium">Need Help?</span>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Login to continue</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 text-lg border-0 bg-white rounded-xl shadow-sm placeholder:text-gray-500"
              required
            />
          </div>

          <div>
            <Input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 text-lg border-0 bg-white rounded-xl shadow-sm placeholder:text-gray-500"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full h-14 bg-black hover:bg-gray-800 text-white text-lg font-medium rounded-xl transition-colors"
          >
            Login
          </Button>
        </form>

        <div className="text-center mt-8">
          <button 
            onClick={onSwitchToRegister}
            className="text-purple-600 font-medium"
          >
            Don't have an account? Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
