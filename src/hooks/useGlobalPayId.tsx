import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useGlobalPayId = () => {
  const [globalPayId, setGlobalPayId] = useState<string>('PAY-4277151111');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial value
    const fetchGlobalPayId = async () => {
      const { data } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'global_payid')
        .maybeSingle();
      
      if (data?.value) {
        setGlobalPayId(data.value);
      }
      setLoading(false);
    };
    
    fetchGlobalPayId();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('global-payid-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'app_settings',
          filter: 'key=eq.global_payid'
        },
        (payload) => {
          console.log('Global PAY ID updated:', payload.new);
          if (payload.new && typeof payload.new === 'object' && 'value' in payload.new) {
            setGlobalPayId(payload.new.value as string);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { globalPayId, loading };
};
