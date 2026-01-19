import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ACCOUNT_DETAILS } from '@/config/accountDetails';

export interface AccountDetails {
  accountNumber: string;
  bankName: string;
  accountName: string;
}

export const useAccountDetails = () => {
  const [accountDetails, setAccountDetails] = useState<AccountDetails>(ACCOUNT_DETAILS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .select('key, value')
          .in('key', ['account_number', 'bank_name', 'account_name']);

        if (error) throw error;

        if (data && data.length > 0) {
          const details: AccountDetails = { ...ACCOUNT_DETAILS };
          data.forEach((item) => {
            if (item.key === 'account_number') details.accountNumber = item.value;
            if (item.key === 'bank_name') details.bankName = item.value;
            if (item.key === 'account_name') details.accountName = item.value;
          });
          setAccountDetails(details);
        }
      } catch (error) {
        console.error('Error fetching account details:', error);
        // Falls back to hardcoded values
      } finally {
        setLoading(false);
      }
    };

    fetchAccountDetails();
  }, []);

  return { accountDetails, loading };
};
