import React, { useState, useEffect } from 'react';
import { Shield, LogOut, Users, Image, Gift, BarChart3, FileText, Bell, Settings, CheckCircle, Ban } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

type AdminView = 'stats' | 'payments' | 'users' | 'approved' | 'banned' | 'referrals' | 'audit' | 'notifications' | 'settings';

interface AdminSidebarProps {
  currentView: AdminView;
  onViewChange: (view: AdminView) => void;
  onLogout: () => void;
  userEmail?: string;
}

const menuItems = [
  { id: 'stats' as AdminView, icon: BarChart3, title: 'Dashboard', num: 1 },
  { id: 'payments' as AdminView, icon: Image, title: 'Payments', num: 2, hasBadge: true },
  { id: 'users' as AdminView, icon: Users, title: 'Users', num: 3 },
  { id: 'approved' as AdminView, icon: CheckCircle, title: 'Approved', num: 4 },
  { id: 'banned' as AdminView, icon: Ban, title: 'Banned', num: 5 },
  { id: 'referrals' as AdminView, icon: Gift, title: 'Referrals', num: 6 },
  { id: 'audit' as AdminView, icon: FileText, title: 'Audit Logs', num: 7 },
  { id: 'notifications' as AdminView, icon: Bell, title: 'Notifications', num: 8 },
  { id: 'settings' as AdminView, icon: Settings, title: 'Settings', num: 9 },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  currentView, 
  onViewChange, 
  onLogout,
  userEmail 
}) => {
  const { state, setOpenMobile, isMobile } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const { count, error } = await supabase
          .from('payment_uploads')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        if (!error && count !== null) {
          setPendingCount(count);
        }
      } catch (error) {
        console.error('Error fetching pending count:', error);
      }
    };

    fetchPendingCount();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('pending-count-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payment_uploads'
        },
        () => {
          fetchPendingCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleMenuClick = (view: AdminView) => {
    onViewChange(view);
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <SidebarHeader className="border-b border-border/50">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && <span className="font-bold text-foreground">Admin</span>}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => handleMenuClick(item.id)}
                    isActive={currentView === item.id}
                    tooltip={item.title}
                    className={currentView === item.id 
                      ? 'bg-primary text-white hover:bg-primary/90 hover:text-white' 
                      : ''
                    }
                  >
                    <div className={`relative w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      currentView === item.id ? 'bg-white/20' : 'bg-muted'
                    }`}>
                      <span className={`text-xs font-bold ${currentView === item.id ? 'text-white' : 'text-primary'}`}>
                        {item.num}
                      </span>
                      {item.hasBadge && pendingCount > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
                          {pendingCount > 99 ? '99+' : pendingCount}
                        </span>
                      )}
                    </div>
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium flex-1">{item.title}</span>
                    {!isCollapsed && item.hasBadge && pendingCount > 0 && (
                      <span className="min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                        {pendingCount > 99 ? '99+' : pendingCount}
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50">
        {!isCollapsed && userEmail && (
          <div className="px-3 py-2">
            <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={onLogout}
              tooltip="Logout"
              className="text-red-500 hover:bg-red-500/10 hover:text-red-500"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;