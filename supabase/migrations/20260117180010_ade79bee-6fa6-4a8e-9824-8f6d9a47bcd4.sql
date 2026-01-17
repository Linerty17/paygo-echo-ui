
-- Add column to track last weekly reward claim
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_weekly_claim TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Update the handle_new_user function to start with 0 balance (no automatic 180k)
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
  
  -- Insert new profile with 0 balance (user must claim weekly reward)
  INSERT INTO public.profiles (user_id, name, email, country, referral_code, referred_by, balance, last_weekly_claim)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'country', ''),
    new_referral_code,
    referred_by_code,
    0,
    NULL
  )
  RETURNING id INTO new_profile_id;
  
  -- If referred by someone, create referral record and add bonus to referrer
  IF referred_by_code IS NOT NULL AND referred_by_code != '' THEN
    SELECT id INTO referrer_profile_id 
    FROM public.profiles 
    WHERE referral_code = referred_by_code;
    
    IF referrer_profile_id IS NOT NULL THEN
      INSERT INTO public.referrals (referrer_id, referred_id, bonus_amount, status)
      VALUES (referrer_profile_id, new_profile_id, 2500.00, 'credited');
      
      -- Credit the referrer's balance (adds to their existing balance)
      UPDATE public.profiles 
      SET balance = balance + 2500.00
      WHERE id = referrer_profile_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;
