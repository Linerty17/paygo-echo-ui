-- Create a secure function to claim weekly rewards with server-side validation
CREATE OR REPLACE FUNCTION public.claim_weekly_reward(user_uuid UUID)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  profile_record RECORD;
  reward_amount NUMERIC := 180000.00;
  new_balance NUMERIC;
  result json;
BEGIN
  -- Get the user's profile with a row lock to prevent race conditions
  SELECT id, balance, last_weekly_claim 
  INTO profile_record
  FROM public.profiles 
  WHERE user_id = user_uuid
  FOR UPDATE;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Profile not found');
  END IF;
  
  -- Check if user can claim (never claimed before OR last claim was more than 7 days ago)
  IF profile_record.last_weekly_claim IS NOT NULL AND 
     profile_record.last_weekly_claim > (NOW() - INTERVAL '7 days') THEN
    RETURN json_build_object(
      'success', false, 
      'error', 'Cannot claim yet',
      'next_claim', profile_record.last_weekly_claim + INTERVAL '7 days'
    );
  END IF;
  
  -- Calculate new balance and update
  new_balance := profile_record.balance + reward_amount;
  
  UPDATE public.profiles 
  SET 
    balance = new_balance,
    last_weekly_claim = NOW()
  WHERE id = profile_record.id;
  
  RETURN json_build_object(
    'success', true, 
    'new_balance', new_balance,
    'claimed_amount', reward_amount
  );
END;
$$;