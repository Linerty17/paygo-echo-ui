-- Add user status fields to profiles table for ban/unban functionality
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS account_status text NOT NULL DEFAULT 'active';

-- Add payid_status to payment_uploads for tracking PAY ID approval/revocation
ALTER TABLE public.payment_uploads 
ADD COLUMN IF NOT EXISTS payid_code text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS payid_status text DEFAULT 'pending';

-- Create a user_notifications table for real-time notifications to users
CREATE TABLE IF NOT EXISTS public.user_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL, -- 'payment_approved', 'payment_declined', 'payid_revoked', 'banned', 'unbanned'
  title text NOT NULL,
  message text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  metadata jsonb DEFAULT NULL
);

-- Enable RLS on user_notifications
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view their own notifications"
ON public.user_notifications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications"
ON public.user_notifications
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Admins can insert notifications for any user
CREATE POLICY "Admins can insert notifications"
ON public.user_notifications
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can view all notifications
CREATE POLICY "Admins can view all notifications"
ON public.user_notifications
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Enable realtime for user_notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_notifications;

-- Enable realtime for profiles (for ban/unban status changes)
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

-- Enable realtime for payment_uploads (already might be enabled, safe to re-add)
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.payment_uploads;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;