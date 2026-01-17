import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, AlertCircle, RefreshCw, Home, Timer, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaymentPendingProps {
  onBack: () => void;
  onRefresh: () => void;
  onGoToDashboard: () => void;
}

const PaymentPending: React.FC<PaymentPendingProps> = ({ onBack, onRefresh, onGoToDashboard }) => {
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return { hours, minutes, secs };
  };

  const { hours, minutes, secs } = formatTime(timeLeft);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      onRefresh();
    }, 2000);
  };

  const progressPercentage = ((24 * 60 * 60 - timeLeft) / (24 * 60 * 60)) * 100;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-20 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 -left-20 w-56 h-56 bg-primary/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <div className="relative px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className="glass w-10 h-10 rounded-2xl flex items-center justify-center border border-border/50 hover:border-primary/30 hover:scale-105 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-sm text-muted-foreground">Payment Pending</span>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <div className="relative px-4 pb-8 space-y-6">
        {/* Main Pending Card */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/40 via-orange-500/40 to-amber-500/40 rounded-[28px] blur-xl opacity-50 animate-pulse" />
          
          <div className="relative glass-card rounded-3xl overflow-hidden">
            {/* Card Header */}
            <div className="relative bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)]" />
              
              <div className="relative text-center">
                <div className="w-20 h-20 mx-auto mb-4 relative">
                  <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" style={{ animationDuration: '2s' }} />
                  <div className="relative w-full h-full rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                    <Clock className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">Payment Pending</h2>
                <p className="text-white/80 text-sm">Awaiting confirmation</p>
              </div>
            </div>

            {/* Timer Section */}
            <div className="p-6 space-y-5">
              <div className="text-center">
                <p className="text-muted-foreground text-sm mb-3">Time remaining to complete payment</p>
                
                {/* Timer Display */}
                <div className="flex items-center justify-center gap-3">
                  <div className="glass rounded-2xl p-4 min-w-[80px] border border-border/50">
                    <span className="text-3xl font-bold text-foreground">{String(hours).padStart(2, '0')}</span>
                    <p className="text-xs text-muted-foreground mt-1">Hours</p>
                  </div>
                  <span className="text-2xl font-bold text-primary animate-pulse">:</span>
                  <div className="glass rounded-2xl p-4 min-w-[80px] border border-border/50">
                    <span className="text-3xl font-bold text-foreground">{String(minutes).padStart(2, '0')}</span>
                    <p className="text-xs text-muted-foreground mt-1">Minutes</p>
                  </div>
                  <span className="text-2xl font-bold text-primary animate-pulse">:</span>
                  <div className="glass rounded-2xl p-4 min-w-[80px] border border-border/50">
                    <span className="text-3xl font-bold text-foreground">{String(secs).padStart(2, '0')}</span>
                    <p className="text-xs text-muted-foreground mt-1">Seconds</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Processing</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-1000 relative"
                    style={{ width: `${progressPercentage}%` }}
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:20px_20px] animate-[shimmer_1s_linear_infinite]" />
                  </div>
                </div>
              </div>

              {/* Info Alert */}
              <div className="glass rounded-2xl p-4 border border-amber-500/30 bg-amber-500/5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium text-sm">Waiting for Payment</p>
                    <p className="text-muted-foreground text-xs mt-1">
                      Your payment is being processed. This may take a few minutes. Please do not close this page.
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Steps */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">Payment initiated</p>
                  </div>
                  <span className="text-xs text-green-500">Complete</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center animate-pulse">
                    <Timer className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">Awaiting confirmation</p>
                  </div>
                  <span className="text-xs text-amber-500">In Progress</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Payment verified</p>
                  </div>
                  <span className="text-xs text-muted-foreground">Pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-lg font-semibold shadow-lg border-0"
          >
            <RefreshCw className={`w-5 h-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Checking Status...' : 'Refresh Status'}
          </Button>

          <Button 
            onClick={onGoToDashboard}
            variant="outline"
            className="w-full h-14 rounded-2xl glass border border-border/50 text-foreground text-lg font-semibold hover:border-primary/30"
          >
            <Home className="w-5 h-5 mr-2" />
            Go to Dashboard
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center space-y-2 pt-2">
          <p className="text-muted-foreground text-sm">
            You will be notified once payment is confirmed
          </p>
          <p className="text-foreground font-semibold text-sm">PayGo Financial Services</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPending;
