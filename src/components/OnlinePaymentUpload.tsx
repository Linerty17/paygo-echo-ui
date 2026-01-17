import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, AlertCircle, CheckCircle2, Shield, Sparkles, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import PaymentApprovedScreen from '@/components/screens/PaymentApprovedScreen';
import { useGlobalPayId } from '@/hooks/useGlobalPayId';

interface OnlinePaymentUploadProps {
  onBack: () => void;
  onUploadComplete: () => void;
  userId: string;
  userName: string;
  userEmail: string;
}

const OnlinePaymentUpload: React.FC<OnlinePaymentUploadProps> = ({ 
  onBack, 
  onUploadComplete,
  userId,
  userName,
  userEmail 
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isApproved, setIsApproved] = useState(false);
  const [hasPending, setHasPending] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const { globalPayId } = useGlobalPayId();

  // Check if user already has an approved or pending payment
  const checkPaymentStatus = async () => {
    if (!userId) {
      setCheckingStatus(false);
      return;
    }

    try {
      // Approved (active PAY ID)
      const { data: approvedData, error: approvedError } = await supabase
        .from('payment_uploads')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'approved')
        .in('payment_type', ['payid_online', 'payid_offline'])
        .neq('payid_status', 'revoked')
        .limit(1)
        .maybeSingle();

      if (approvedError) throw approvedError;

      if (approvedData) {
        setIsApproved(true);
        setHasPending(false);
        return;
      }

      // Pending
      const { data: pendingData, error: pendingError } = await supabase
        .from('payment_uploads')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .in('payment_type', ['payid_online', 'payid_offline'])
        .limit(1)
        .maybeSingle();

      if (pendingError) throw pendingError;

      setHasPending(!!pendingData);
    } catch (error) {
      console.error('Error checking payment status:', error);
      setHasPending(false);
    } finally {
      setCheckingStatus(false);
    }
  };

  useEffect(() => {
    checkPaymentStatus();
  }, [userId]);

  // Real-time subscription for instant blocking when status changes
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`upload_status_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payment_uploads',
          filter: `user_id=eq.${userId}`
        },
        () => {
          checkPaymentStatus();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // If already approved, show approval screen instantly
  if (isApproved) {
    return <PaymentApprovedScreen payIdCode={globalPayId} onContinue={onBack} />;
  }

  if (checkingStatus) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Block multiple uploads if there's already a pending payment
  if (hasPending) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -left-32 w-48 h-48 bg-primary/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
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
              <span className="text-sm text-muted-foreground">Pending Payment</span>
            </div>
            <div className="w-10" />
          </div>
        </div>

        <div className="relative px-4 pb-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-6 h-6 text-amber-500 animate-pulse" />
              <h1 className="text-2xl font-bold text-foreground">Payment Pending</h1>
            </div>
            <p className="text-muted-foreground">Please wait till your pending payment is approved</p>
          </div>

          <div className="glass-card rounded-2xl p-4 border border-amber-500/30 bg-amber-500/5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-foreground font-medium text-sm">Upload blocked</p>
                <p className="text-muted-foreground text-xs mt-1">
                  You can’t upload another screenshot right now because you already submitted one. This prevents multiple uploads.
                </p>
              </div>
            </div>
          </div>

          <Button 
            onClick={onBack}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground text-lg font-semibold shadow-lg border-0"
          >
            Back to Dashboard
          </Button>

          <div className="text-center pt-2">
            <p className="text-muted-foreground text-sm">You'll be notified when your payment is processed</p>
            <p className="text-foreground font-semibold text-sm mt-2">PayGo Financial Services</p>
          </div>
        </div>
      </div>
    );
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file",
          description: "Please upload an image (PNG/JPG).",
          variant: "destructive",
        });
        return;
      }

      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }

      setUploadedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!uploadedFile) {
      toast({
        title: "No screenshot",
        description: "Please upload your payment screenshot first",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      // Re-check pending to avoid multiple uploads
      const { data: pendingData } = await supabase
        .from('payment_uploads')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .in('payment_type', ['payid_online', 'payid_offline'])
        .limit(1)
        .maybeSingle();

      if (pendingData) {
        setHasPending(true);
        toast({
          title: 'Payment Pending',
          description: 'Please wait till your pending payment is approved before uploading again.',
          variant: 'destructive',
        });
        return;
      }

      // Upload image to storage
      const fileExt = uploadedFile.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('payment-screenshots')
        .upload(fileName, uploadedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('payment-screenshots')
        .getPublicUrl(fileName);

      // Create payment upload record
      const { error: insertError } = await supabase
        .from('payment_uploads')
        .insert({
          user_id: userId,
          user_name: userName,
          user_email: userEmail,
          payment_type: 'payid_online',
          amount: 7200,
          screenshot_url: publicUrl,
          status: 'pending'
        });

      if (insertError) throw insertError;

      toast({
        title: "Screenshot Uploaded!",
        description: "Your payment proof has been sent for verification",
      });

      onUploadComplete();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Could not upload screenshot. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-32 w-48 h-48 bg-accent/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
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
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-muted-foreground">Upload Payment</span>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <div className="relative px-4 pb-8 space-y-6">
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            <h1 className="text-2xl font-bold text-foreground">Upload Payment</h1>
          </div>
          <p className="text-muted-foreground">Submit your online payment proof</p>
        </div>

        {/* Warning Card */}
        <div className="glass-card rounded-2xl p-4 border border-amber-500/30 bg-amber-500/5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-foreground font-medium text-sm">Online Purchase Only</p>
              <p className="text-muted-foreground text-xs mt-1">
                Upload payment screenshot only if you used the online purchase option (₦7,200)
              </p>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="glass-card rounded-3xl p-6 border border-border/50">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileSelect}
            className="hidden" 
            id="screenshot-upload"
          />
          
          <label htmlFor="screenshot-upload" className="cursor-pointer block">
            {uploadedImage ? (
              <div className="relative">
                <img 
                  src={uploadedImage} 
                  alt="Payment screenshot" 
                  className="w-full rounded-2xl object-cover max-h-64"
                />
                <div className="absolute top-3 right-3 glass rounded-full p-2 bg-green-500/20">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-primary/30 rounded-2xl p-10 text-center hover:border-primary/60 transition-colors">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <p className="text-foreground font-medium mb-1">Tap to upload screenshot</p>
                <p className="text-muted-foreground text-sm">PNG, JPG up to 10MB</p>
              </div>
            )}
          </label>

          {uploadedImage && (
            <label htmlFor="screenshot-upload" className="cursor-pointer">
              <p className="text-primary text-center text-sm mt-3 underline">Change image</p>
            </label>
          )}
        </div>

        {/* Submit Button */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity" />
          <Button 
            onClick={handleSubmit}
            disabled={!uploadedImage || uploading}
            className="relative w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground text-lg font-bold shadow-xl border-0"
          >
            {uploading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Uploading...</span>
              </div>
            ) : (
              <>
                <Shield className="w-5 h-5 mr-2" />
                Submit for Verification
              </>
            )}
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center pt-2">
          <p className="text-muted-foreground text-sm">
            Your upload will be reviewed by our team
          </p>
          <p className="text-foreground font-semibold text-sm mt-2">PayGo Financial Services</p>
        </div>
      </div>
    </div>
  );
};

export default OnlinePaymentUpload;

