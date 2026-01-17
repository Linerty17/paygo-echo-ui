import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle, XCircle, KeyRound, Ban, UserCheck, X, Check, CheckCheck } from 'lucide-react';
import { UserNotification } from '@/hooks/useUserNotifications';
import { formatDistanceToNow } from 'date-fns';

interface NotificationDropdownProps {
  notifications: UserNotification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type: UserNotification['type']) => {
    switch (type) {
      case 'payment_approved':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'payment_declined':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'payid_revoked':
        return <KeyRound className="w-5 h-5 text-amber-400" />;
      case 'banned':
        return <Ban className="w-5 h-5 text-red-500" />;
      case 'unbanned':
        return <UserCheck className="w-5 h-5 text-emerald-400" />;
      default:
        return <Bell className="w-5 h-5 text-primary" />;
    }
  };

  const getNotificationBg = (type: UserNotification['type']) => {
    switch (type) {
      case 'payment_approved':
        return 'bg-emerald-500/10 border-emerald-500/20';
      case 'payment_declined':
        return 'bg-red-500/10 border-red-500/20';
      case 'payid_revoked':
        return 'bg-amber-500/10 border-amber-500/20';
      case 'banned':
        return 'bg-red-500/10 border-red-500/20';
      case 'unbanned':
        return 'bg-emerald-500/10 border-emerald-500/20';
      default:
        return 'bg-primary/10 border-primary/20';
    }
  };

  return (
    <div className="relative z-[100]" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative glass w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 hover:border-primary/40 transition-all"
      >
        <span className="text-base">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-80 max-h-96 overflow-hidden bg-card border border-white/10 rounded-2xl shadow-2xl z-[200] animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <h3 className="font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={onMarkAllAsRead}
                className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
              >
                <CheckCheck className="w-3 h-3" />
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto max-h-72">
            {notifications.length === 0 ? (
              <div className="py-8 text-center">
                <Bell className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No notifications yet</p>
              </div>
            ) : (
              notifications.slice(0, 10).map((notification) => (
                <div 
                  key={notification.id}
                  className={`px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => onMarkAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border ${getNotificationBg(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-medium truncate ${!notification.read ? 'text-foreground' : 'text-foreground/70'}`}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 10 && (
            <div className="px-4 py-2 border-t border-white/10 text-center">
              <p className="text-xs text-muted-foreground">
                Showing 10 of {notifications.length} notifications
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
