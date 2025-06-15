import React from "react";
import { Heart, Settings, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface SidebarItem {
  id: string;
  icon: React.ElementType;
  label: string;
  color?: string;
  onClick?: () => void;
  active?: boolean;
}

interface DashboardSidebarProps {
  sidebarItems: SidebarItem[];
  t: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  userFullName?: string; // NEW prop
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  sidebarItems,
  t,
  activeTab,
  setActiveTab,
  onLogout,
  userFullName = "User",
}) => {
  const [collapsed, setCollapsed] = React.useState(false);

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    } else if (parts.length > 1) {
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    return '';
  };

  return (
    <div className={`h-screen flex flex-col overflow-hidden bg-transparent relative glass-sidebar transition-all duration-200 ${collapsed ? 'w-20' : 'w-72'}`}>
      {/* Header */}
      <div className={`p-5 sm:p-8 border-b border-white/10 flex-shrink-0 ${collapsed ? 'justify-center' : ''} flex items-center`}>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-muted-gold to-yellow-400 rounded-2xl flex items-center justify-center shadow-lg">
            <Heart className="w-7 h-7 text-emerald-700" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-heading text-xl font-bold bg-gradient-to-r from-muted-gold to-lavender-blue bg-clip-text text-teal-600">
                HealthSaarthi
              </h1>
              <p className="text-xs text-foreground/60 font-medium">
                Apni Bhasha,Apna Doctor
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Main Navigation Area (Scrollable) */}
      <nav className="flex-1 min-h-0 overflow-y-auto scrollbar-none p-4 sm:p-6 space-y-2 sm:space-y-3">
        {sidebarItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "default" : "ghost"}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start'} space-x-4 h-14 text-base font-medium rounded-lg transition-colors duration-150 w-full
              ${activeTab === item.id
                ? "bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-none"
                : "hover:bg-emerald-50 text-foreground/70 hover:text-foreground border border-transparent"}
            `}
          >
            <item.icon className={`w-6 h-6 text-emerald-700`} />
            {!collapsed && <span>{item.label}</span>}
          </Button>
        ))}
      </nav>
      {/* Footer: pinned strictly at the bottom, non-shrinking */}
      {!collapsed && (
        <footer className="flex-shrink-0 border-t border-white/10 bg-white/10 backdrop-blur-md">
          <div className="glass-card p-4 mb-4 rounded-2xl shadow-lg-glass mx-4 mt-4">
            <div className="flex items-center space-x-3 mb-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=48&h=48&fit=crop&crop=face" />
                <AvatarFallback>{getInitials(userFullName)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className="w-full text-left font-bold text-foreground hover:text-emerald-700 transition"
                >
                  {userFullName}
                </button>
                <Badge className="text-xs bg-gradient-to-r from-muted-gold to-yellow-400 text-white border-0">
                  Premium Member
                </Badge>
              </div>
            </div>
          </div>
          <div className="space-y-2 px-4 pb-4">
            <Button
              variant="ghost"
              onClick={() => setActiveTab('settings')}
              className={`
                w-full justify-start text-foreground/70
                hover:bg-white/5 hover:text-foreground
                active:bg-sage-200 active:text-primary
                active:ring-2 active:ring-muted-gold
                active:scale-95
                focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                transition
                duration-100
              `}
            >
              <Settings className="w-5 h-5 mr-3 text-emerald-700" />
              {t.settings}
            </Button>
            <Button
              variant="ghost"
              onClick={onLogout}
              className={`
                w-full justify-start text-red-500
                hover:bg-red-50 hover:text-red-600
                active:bg-red-200 active:text-red-700
                active:ring-2 active:ring-red-400
                active:scale-95
                focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2
                transition
                duration-100
              `}
            >
              <LogOut className="w-5 h-5 mr-3 text-emerald-700" />
              {t.logout}
            </Button>
          </div>
        </footer>
      )}
    </div>
  );
};

export default DashboardSidebar;