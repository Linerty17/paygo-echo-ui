import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AccountDetails {
  accountNumber: string;
  bankName: string;
  accountName: string;
}

const DEFAULT_ACCOUNT_DETAILS: AccountDetails = {
  accountNumber: '',
  bankName: '',
  accountName: ''
};

export const useAccountDetails = () => {
  const [accountDetails, setAccountDetails] = useState<AccountDetails>(DEFAULT_ACCOUNT_DETAILS);
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
          const details: AccountDetails = { ...DEFAULT_ACCOUNT_DETAILS };
          data.forEach((item) => {
            if (item.key === 'account_number') details.accountNumber = item.value;
            if (item.key === 'bank_name') details.bankName = item.value;
            if (item.key === 'account_name') details.accountName = item.value;
          });
          setAccountDetails(details);
        }
      } catch (error) {
        console.error('Error fetching account details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountDetails();
  }, []);

  return { accountDetails, loading };
};
