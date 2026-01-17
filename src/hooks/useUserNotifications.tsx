import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserNotification {
  id: string;
  user_id: string;
  type: 'payment_approved' | 'payment_declined' | 'payid_revoked' | 'banned' | 'unbanned';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  metadata: Record<string, any> | null;
}

interface UseUserNotificationsResult {
  notifications: UserNotification[];
  latestNotification: UserNotification | null;
  unreadCount: number;
  loading: boolean;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearLatest: () => void;
}

export const useUserNotifications = (userId: string | undefined): UseUserNotificationsResult => {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [latestNotification, setLatestNotification] = useState<UserNotification | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      
      // Type cast the data safely
      const typedData = (data || []).map(item => ({
        ...item,
        type: item.type as UserNotification['type'],
        metadata: item.metadata as Record<string, any> | null
      }));
      
      setNotifications(typedData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Set up real-time subscription
  useEffect(() => {
    if (!userId) return;

    fetchNotifications();

    // Subscribe to new notifications
    const channel = supabase
      .channel(`user_notifications_${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const newNotification = {
            ...payload.new,
            type: payload.new.type as UserNotification['type'],
            metadata: payload.new.metadata as Record<string, any> | null
          } as UserNotification;
          
          setNotifications(prev => [newNotification, ...prev]);
          setLatestNotification(newNotification);
          
          // Show browser notification if permitted
          if (Notification.permission === 'granted') {
            new Notification(newNotification.title, {
              body: newNotification.message,
              icon: '/favicon.png'
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, fetchNotifications]);

  const markAsRead = async (notificationId: string) => {
    try {
      await supabase
        .from('user_notifications')
        .update({ read: true })
        .eq('id', notificationId);

      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!userId) return;
    
    try {
      await supabase
        .from('user_notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const clearLatest = () => {
    setLatestNotification(null);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    latestNotification,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    clearLatest
  };
};
