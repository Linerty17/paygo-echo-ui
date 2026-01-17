import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AccountStatusResult {
  status: 'active' | 'banned' | 'loading';
  checkStatus: () => Promise<void>;
}

export const useAccountStatus = (userId: string | undefined): AccountStatusResult => {
  const [status, setStatus] = useState<'active' | 'banned' | 'loading'>('loading');

  const checkStatus = useCallback(async () => {
    if (!userId) {
      // No user = not authenticated, set to active to allow login/registration screens
      setStatus('active');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('account_status')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      
      // If no profile found yet, default to active
      setStatus(data?.account_status === 'banned' ? 'banned' : 'active');
    } catch (error) {
      console.error('Error checking account status:', error);
      setStatus('active'); // Default to active on error
    }
  }, [userId]);

  useEffect(() => {
    // If no user yet (logged out / on auth screens), don't block the UI with a loading state
    if (!userId) {
      setStatus('active');
      return;
    }

    // When a user appears, go into loading briefly while we check
    setStatus('loading');
    checkStatus();

    // Subscribe to profile changes for real-time ban/unban detection
    const channel = supabase
      .channel(`profile_status_${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newStatus = (payload.new as any)?.account_status;
          setStatus(newStatus === 'banned' ? 'banned' : 'active');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, checkStatus]);

  return { status, checkStatus };
};
