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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer profile fetch with setTimeout to avoid deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }

    if (data) {
      setProfile(data as Profile);
    }
  };

  const signUp = async (email: string, password: string, name: string, country: string, referredBy?: string) => {
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

  const updateProfile = async (updates: Partial<Pick<Profile, 'name' | 'level' | 'balance' | 'last_weekly_claim' | 'phone' | 'avatar_url'>>) => {
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

  return {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    fetchProfile,
    fetchReferrals,
    isAuthenticated: !!session
  };
};
