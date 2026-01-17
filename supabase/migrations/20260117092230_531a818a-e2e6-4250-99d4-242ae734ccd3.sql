-- Add referral_code column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN referral_code TEXT UNIQUE,
ADD COLUMN referred_by TEXT;

-- Create index for faster referral code lookups
CREATE INDEX idx_profiles_referral_code ON public.profiles(referral_code);
CREATE INDEX idx_profiles_referred_by ON public.profiles(referred_by);

-- Create referrals tracking table
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  bonus_amount NUMERIC NOT NULL DEFAULT 2500.00,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'credited', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  credited_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(referred_id)
);

-- Enable RLS on referrals table
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- RLS policies for referrals
CREATE POLICY "Users can view their own referrals"
ON public.referrals
FOR SELECT
USING (
  referrer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  OR referred_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$;

-- Update handle_new_user function to generate referral code and handle referrals
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_referral_code TEXT;
  referrer_profile_id UUID;
  new_profile_id UUID;
  referred_by_code TEXT;
BEGIN
  -- Generate unique referral code
  LOOP
    new_referral_code := generate_referral_code();
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE referral_code = new_referral_code);
  END LOOP;
  
  -- Get referred_by code from metadata
  referred_by_code := NEW.raw_user_meta_data->>'referred_by';
  
  -- Insert new profile
  INSERT INTO public.profiles (user_id, name, email, country, referral_code, referred_by)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'country', ''),
    new_referral_code,
    referred_by_code
  )
  RETURNING id INTO new_profile_id;
  
  -- If referred by someone, create referral record
  IF referred_by_code IS NOT NULL AND referred_by_code != '' THEN
    SELECT id INTO referrer_profile_id 
    FROM public.profiles 
    WHERE referral_code = referred_by_code;
    
    IF referrer_profile_id IS NOT NULL THEN
      INSERT INTO public.referrals (referrer_id, referred_id, bonus_amount, status)
      VALUES (referrer_profile_id, new_profile_id, 2500.00, 'credited');
      
      -- Credit the referrer's balance
      UPDATE public.profiles 
      SET balance = balance + 2500.00
      WHERE id = referrer_profile_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;