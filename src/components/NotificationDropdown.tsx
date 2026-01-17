import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Bell, CheckCircle, XCircle, KeyRound, Ban, UserCheck, CheckCheck } from 'lucide-react';
import { UserNotification } from '@/hooks/useUserNotifications';
import { formatDistanceToNow } from 'date-fns';

interface NotificationDropdownProps {
  notifications: UserNotification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

const PANEL_MAX_HEIGHT = 384; // Tailwind max-h-96
const PANEL_MAX_WIDTH = 320; // Tailwind w-80

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});

  const updatePanelPosition = useCallback(() => {
    const btn = buttonRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const padding = 12;
    const gap = 8;

    const width = Math.min(PANEL_MAX_WIDTH, Math.max(240, window.innerWidth - padding * 2));
    const left = Math.min(
      Math.max(padding, rect.right - width),
      Math.max(padding, window.innerWidth - width - padding)
    );

    // Prefer opening below; if it would overflow, nudge upward.
    const preferredTop = rect.bottom + gap;
    const maxTop = Math.max(gap, window.innerHeight - PANEL_MAX_HEIGHT - gap);
    const top = Math.min(preferredTop, maxTop);

    setPanelStyle({
      position: 'fixed',
      top,
      left,
      width,
    });
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) return;
    updatePanelPosition();
  }, [isOpen, updatePanelPosition]);

  useEffect(() => {
    if (!isOpen) return;

    const onScrollOrResize = () => updatePanelPosition();
    window.addEventListener('resize', onScrollOrResize);
    window.addEventListener('scroll', onScrollOrResize, true);

    return () => {
      window.removeEventListener('resize', onScrollOrResize);
      window.removeEventListener('scroll', onScrollOrResize, true);
    };
  }, [isOpen, updatePanelPosition]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      setIsOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

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

  const panel = (
    <div
      ref={panelRef}
      className="z-[2147483647] max-h-96 overflow-hidden rounded-2xl shadow-2xl border border-border bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95"
      style={panelStyle}
      role="dialog"
      aria-label="Notifications"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="font-semibold">Notifications</h3>
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
              className={`px-4 py-3 border-b border-border/60 hover:bg-muted/40 transition-colors cursor-pointer ${
                !notification.read ? 'bg-primary/5' : ''
              }`}
              onClick={() => onMarkAsRead(notification.id)}
            >
              <div className="flex gap-3">
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border ${getNotificationBg(
                    notification.type
                  )}`}
                >
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={`text-sm font-medium truncate ${
                        !notification.read ? 'text-foreground' : 'text-foreground/70'
                      }`}
                    >
                      {notification.title}
                    </p>
                    {!notification.read && <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-1.5" />}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{notification.message}</p>
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
        <div className="px-4 py-2 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">Showing 10 of {notifications.length} notifications</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="relative" style={{ zIndex: 9999 }}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((v) => !v)}
        className="relative glass w-9 h-9 rounded-xl flex items-center justify-center border border-border hover:border-primary/40 transition-all"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label="Open notifications"
      >
        <span className="text-base">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>
          </span>
        )}
      </button>

      {isOpen && createPortal(panel, document.body)}
    </div>
  );
};

export default NotificationDropdown;

