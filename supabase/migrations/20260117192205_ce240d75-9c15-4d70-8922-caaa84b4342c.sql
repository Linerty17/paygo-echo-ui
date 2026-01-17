-- Add admin policy to allow admins to view and update all payment uploads
-- First, let's add an is_admin column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Admin can view all payment uploads
CREATE POLICY "Admins can view all payment uploads" 
ON public.payment_uploads 
FOR SELECT 
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true)
);

-- Admin can update all payment uploads
CREATE POLICY "Admins can update all payment uploads" 
ON public.payment_uploads 
FOR UPDATE 
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true)
);