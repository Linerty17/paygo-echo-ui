
-- Update the handle_new_user function to give 180,000 welcome bonus
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
  welcome_bonus NUMERIC := 180000.00;
BEGIN
  -- Generate unique referral code
  LOOP
    new_referral_code := generate_referral_code();
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE referral_code = new_referral_code);
  END LOOP;
  
  -- Get referred_by code from metadata
  referred_by_code := NEW.raw_user_meta_data->>'referred_by';
  
  -- Insert new profile with 180k welcome bonus
  INSERT INTO public.profiles (user_id, name, email, country, referral_code, referred_by, balance)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'country', ''),
    new_referral_code,
    referred_by_code,
    welcome_bonus
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
