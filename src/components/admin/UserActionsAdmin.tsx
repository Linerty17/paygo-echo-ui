import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Ban, UserCheck, KeyRound, CheckCircle, XCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UserActionsAdminProps {
  userId: string;
  userName: string;
  userEmail: string;
  currentStatus: string;
  onActionComplete: () => void;
  onLogAudit: (action: string, entityType: string, entityId: string, details: Record<string, any>) => void;
}

const UserActionsAdmin: React.FC<UserActionsAdminProps> = ({
  userId,
  userName,
  userEmail,
  currentStatus,
  onActionComplete,
  onLogAudit
}) => {
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showDeclineDialog, setShowDeclineDialog] = useState(false);
  const [showRevokeDialog, setShowRevokeDialog] = useState(false);
  const [reason, setReason] = useState('');
  const [payIdCode, setPayIdCode] = useState(() => {
    const randomNum = Math.floor(10000000 + Math.random() * 90000000);
    return `PAY-${randomNum}`;
  });
  const [processing, setProcessing] = useState(false);

  const sendNotification = async (type: string, title: string, message: string, metadata?: Record<string, any>) => {
    await supabase.from('user_notifications').insert({
      user_id: userId,
      type,
      title,
      message,
      metadata
    });
  };

  const handleBan = async () => {
    setProcessing(true);
    try {
      await supabase.from('profiles').update({ account_status: 'banned' }).eq('user_id', userId);
      await sendNotification('banned', 'Account Suspended', reason || 'Your account has been suspended.');
      onLogAudit('ban_user', 'profiles', userId, { user_name: userName, reason });
      toast({ title: 'User Banned', description: `${userName} has been banned` });
      setShowBanDialog(false);
      onActionComplete();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to ban user', variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  const handleUnban = async () => {
    setProcessing(true);
    try {
      await supabase.from('profiles').update({ account_status: 'active' }).eq('user_id', userId);
      await sendNotification('unbanned', 'Account Restored', 'Your account has been restored. Welcome back!');
      onLogAudit('unban_user', 'profiles', userId, { user_name: userName });
      toast({ title: 'User Unbanned', description: `${userName} has been unbanned` });
      onActionComplete();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to unban user', variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  const handleApprovePayment = async () => {
    setProcessing(true);
    try {
      await sendNotification('payment_approved', 'Payment Approved! 🎉', 'Your payment has been verified and approved.', { payid_code: payIdCode });
      onLogAudit('approve_payment_manual', 'profiles', userId, { user_name: userName, payid_code: payIdCode });
      toast({ title: 'Payment Approved', description: `Notification sent to ${userName}` });
      setShowApproveDialog(false);
      onActionComplete();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to approve', variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  const handleDeclinePayment = async () => {
    setProcessing(true);
    try {
      await sendNotification('payment_declined', 'Payment Not Confirmed', reason || 'Your payment could not be verified.');
      onLogAudit('decline_payment_manual', 'profiles', userId, { user_name: userName, reason });
      toast({ title: 'Payment Declined', description: `Notification sent to ${userName}` });
      setShowDeclineDialog(false);
      onActionComplete();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to decline', variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  const handleRevokePayId = async () => {
    setProcessing(true);
    try {
      await sendNotification('payid_revoked', 'PAY ID Revoked', reason || 'Your PAY ID has been revoked by the administrator.');
      onLogAudit('revoke_payid', 'profiles', userId, { user_name: userName, reason });
      toast({ title: 'PAY ID Revoked', description: `Notification sent to ${userName}` });
      setShowRevokeDialog(false);
      onActionComplete();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to revoke', variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {currentStatus === 'banned' ? (
        <Button size="sm" variant="outline" onClick={handleUnban} disabled={processing} className="text-green-600 border-green-600">
          <UserCheck className="w-4 h-4 mr-1" /> Unban
        </Button>
      ) : (
        <Button size="sm" variant="outline" onClick={() => setShowBanDialog(true)} className="text-red-600 border-red-600">
          <Ban className="w-4 h-4 mr-1" /> Ban
        </Button>
      )}
      <Button size="sm" variant="outline" onClick={() => setShowApproveDialog(true)} className="text-green-600 border-green-600">
        <CheckCircle className="w-4 h-4 mr-1" /> Approve
      </Button>
      <Button size="sm" variant="outline" onClick={() => setShowDeclineDialog(true)} className="text-orange-600 border-orange-600">
        <XCircle className="w-4 h-4 mr-1" /> Decline
      </Button>
      <Button size="sm" variant="outline" onClick={() => setShowRevokeDialog(true)} className="text-amber-600 border-amber-600">
        <KeyRound className="w-4 h-4 mr-1" /> Revoke
      </Button>

      {/* Ban Dialog */}
      <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ban {userName}?</DialogTitle>
            <DialogDescription>This will suspend the user's account.</DialogDescription>
          </DialogHeader>
          <Textarea placeholder="Reason for ban..." value={reason} onChange={(e) => setReason(e.target.value)} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBanDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleBan} disabled={processing}>Ban User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Payment for {userName}</DialogTitle>
            <DialogDescription>Send payment approval notification with PAY ID.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>PAY ID Code</Label>
            <Input value={payIdCode} onChange={(e) => setPayIdCode(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>Cancel</Button>
            <Button onClick={handleApprovePayment} disabled={processing} className="bg-green-600 hover:bg-green-700">Approve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Decline Dialog */}
      <Dialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decline Payment for {userName}</DialogTitle>
          </DialogHeader>
          <Textarea placeholder="Reason for decline..." value={reason} onChange={(e) => setReason(e.target.value)} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeclineDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeclinePayment} disabled={processing}>Decline</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke Dialog */}
      <Dialog open={showRevokeDialog} onOpenChange={setShowRevokeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke PAY ID for {userName}</DialogTitle>
          </DialogHeader>
          <Textarea placeholder="Reason for revocation..." value={reason} onChange={(e) => setReason(e.target.value)} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRevokeDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleRevokePayId} disabled={processing}>Revoke</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserActionsAdmin;
