-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (EXISTS ( 
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() AND profiles.is_admin = true
));

-- Allow admins to update all profiles (for balance/level adjustments)
CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (EXISTS ( 
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() AND profiles.is_admin = true
));

-- Allow admins to view all referrals
CREATE POLICY "Admins can view all referrals" 
ON public.referrals 
FOR SELECT 
USING (EXISTS ( 
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() AND profiles.is_admin = true
));