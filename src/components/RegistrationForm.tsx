
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface RegistrationFormProps {
  onRegister: (name: string, email: string, password: string) => void;
  onSwitchToLogin: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onRegister, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && password) {
      onRegister(name, email, password);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="absolute top-6 right-6">
        <span className="text-purple-600 font-medium">Need Help?</span>
      </div>
      
      <div className="w-full max-w-sm space-y-8">
        {/* PayGo Logo Card */}
        <div className="flex justify-center mb-12">
          <div className="bg-paygo-main rounded-3xl p-8 shadow-xl">
            <div className="text-white text-3xl font-bold text-center">
              <span className="text-xs block mb-1 opacity-90">DIGITAL</span>
              PAYGO
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Register to continue</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-14 text-lg border-0 bg-white rounded-xl shadow-sm placeholder:text-gray-500"
              required
            />
          </div>

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
            Register
          </Button>
        </form>

        <div className="text-center mt-8">
          <button 
            onClick={onSwitchToLogin}
            className="text-purple-600 font-medium"
          >
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
