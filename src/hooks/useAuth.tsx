import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Profile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  country: string;
  level: number;
  balance: number;
  referral_code: string | null;
  referred_by: string | null;
  created_at: string;
  updated_at: string;
  last_weekly_claim: string | null;
  phone: string | null;
  avatar_url: string | null;
  is_admin: boolean;
}

interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  bonus_amount: number;
  status: string;
  created_at: string;
  credited_at: string | null;
  referred_profile?: {
    name: string;
    email: string;
  };
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Safety: never allow a permanent spinner if the auth SDK/network hangs.
    const loadingTimeout = window.setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 8000);

    // Set up auth state listener FIRST
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;

      setSession(session);
      setUser(session?.user ?? null);

      // Never block the UI here; profile loads in the background.
      setLoading(false);

      if (session?.user) {
        // Defer profile fetch with setTimeout to avoid deadlock
        setTimeout(() => {
          if (isMounted) fetchProfile(session.user.id, session.user);
        }, 0);
      } else {
        setProfile(null);
        setProfileError(null);
        setProfileLoading(false);
      }
    });

    // THEN check for existing session
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (!isMounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (session?.user) {
          // Fetch profile in background; do not block rendering.
          fetchProfile(session.user.id, session.user);
        } else {
          setProfile(null);
          setProfileError(null);
          setProfileLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
      window.clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string, userForCreate?: User) => {
    setProfileLoading(true);
    setProfileError(null);

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      setProfile(null);
      setProfileLoading(false);
      setProfileError('Unable to load your profile. Tap Retry, or log out and sign in again.');
      return;
    }

    if (data) {
      setProfile(data as Profile);
      setProfileLoading(false);
      return;
    }

    // No profile row yet (legacy accounts / first login on a new device).
    // Try to create a minimal profile using auth data.
    const meta = (userForCreate?.user_metadata ?? {}) as Record<string, unknown>;
    const email = userForCreate?.email ?? null;
    const nameFromMeta = typeof meta.name === 'string' ? meta.name : undefined;
    const countryFromMeta = typeof meta.country === 'string' ? meta.country : undefined;
    const phoneFromMeta = typeof meta.phone === 'string' ? meta.phone : undefined;

    const fallbackName = nameFromMeta || (email ? email.split('@')[0] : 'User');
    const fallbackCountry = countryFromMeta || 'NG';

    if (!email) {
      setProfile(null);
      setProfileLoading(false);
      setProfileError('Profile missing email. Please log out and sign in again.');
      return;
    }

    const { data: inserted, error: insertError } = await supabase
      .from('profiles')
      .insert({
        user_id: userId,
        email,
        name: fallbackName,
        country: fallbackCountry,
        phone: phoneFromMeta || null,
      })
      .select('*')
      .single();

    if (insertError) {
      setProfile(null);
      setProfileLoading(false);
      setProfileError('Unable to create your profile. Tap Retry or contact support.');
      return;
    }

    setProfile(inserted as Profile);
    setProfileLoading(false);
  };

  const signUp = async (email: string, password: string, name: string, country: string, phone: string, referredBy?: string) => {
    setLoading(true);
    
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name,
          country,
          phone,
          referred_by: referredBy || null
        }
      }
    });

    setLoading(false);

    if (error) {
      if (error.message.includes('already registered')) {
        toast.error('User already exists with this email. Please login instead.');
      } else {
        toast.error(error.message);
      }
      return { error };
    }

    toast.success('Registration successful!');
    return { data, error: null };
  };

  const fetchReferrals = async (): Promise<Referral[]> => {
    if (!profile) return [];

    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', profile.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching referrals:', error);
      return [];
    }

    // Fetch referred profiles separately
    const referrals: Referral[] = [];
    for (const r of data || []) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('name, email')
        .eq('id', r.referred_id)
        .maybeSingle();
      
      referrals.push({
        ...r,
        referred_profile: profileData ? {
          name: profileData.name || profileData.email?.split('@')[0] || 'User',
          email: profileData.email
        } : { name: 'User', email: '' }
      });
    }

    return referrals;
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    setLoading(false);

    if (error) {
      toast.error('Invalid email or password. Please register first if you don\'t have an account.');
      return { error };
    }

    toast.success('Login successful!');
    return { data, error: null };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
      return { error };
    }
    
    setUser(null);
    setSession(null);
    setProfile(null);
    return { error: null };
  };

  const updateProfile = async (updates: Partial<Pick<Profile, 'name' | 'level' | 'balance' | 'last_weekly_claim' | 'phone' | 'avatar_url' | 'country'>>) => {
    if (!user) return { error: new Error('No user logged in') };

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      toast.error('Failed to update profile');
      return { error };
    }

    setProfile(data as Profile);
    return { data, error: null };
  };

  // Secure server-side claim function to prevent double claims
  const claimWeeklyReward = async () => {
    if (!user) return { success: false, error: 'No user logged in' };

    const { data, error } = await supabase.rpc('claim_weekly_reward', {
      user_uuid: user.id
    });

    if (error) {
      console.error('Claim error:', error);
      return { success: false, error: error.message };
    }

    const result = data as { success: boolean; new_balance?: number; claimed_amount?: number; error?: string; next_claim?: string };

    if (result.success) {
      // Refresh profile to get updated balance
      await fetchProfile(user.id, user);
      return { success: true, new_balance: result.new_balance, claimed_amount: result.claimed_amount };
    } else {
      return { success: false, error: result.error, next_claim: result.next_claim };
    }
  };

  const refreshProfile = async () => {
    if (!user) return;
    await fetchProfile(user.id, user);
  };

  return {
    user,
    session,
    profile,
    profileLoading,
    profileError,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    fetchProfile,
    refreshProfile,
    fetchReferrals,
    claimWeeklyReward,
    isAuthenticated: !!session
  };
};
