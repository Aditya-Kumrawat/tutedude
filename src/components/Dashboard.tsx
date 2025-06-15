import React, { useState, useEffect } from 'react';
import { Activity, Calendar, MessageSquare, Bell, Settings, LogOut, Search, Clock, MapPin, Shield, Users, AlertTriangle, ChevronRight, Heart, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import VoiceChatbot from '@/components/VoiceChatbot';
import DoctorFinder from '@/components/DoctorFinder';
import EmergencyPanel from '@/components/EmergencyPanel';
import DiseaseHeatmap from '@/components/DiseaseHeatmap';
import LanguageToggle from '@/components/LanguageToggle';
import Assessment from '@/components/Assessment';
import { motion } from 'framer-motion';
import DashboardSidebar from './DashboardSidebar';
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { fetchProfile } from "@/utils/supabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import ProfilePage from './ProfilePage';
import SettingsPage from './SettingsPage';

interface DashboardProps {
  onLogout: () => void;
}
const Dashboard: React.FC<DashboardProps> = ({
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentLanguage, setCurrentLanguage] = useState<'english' | 'hindi'>('english');
  const [notifications] = useState(3);
  const [userFullName, setUserFullName] = useState<string>("");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
  });
  const translations = {
    hindi: {
      dashboard: "डैशबोर्ड",
      overview: "अवलोकन",
      chat: "स्वास्थ्य चैट",
      doctors: "डॉक्टर खोजें",
      emergency: "आपातकाल",
      heatmap: "बीमारी मैप",
      profile: "प्रोफाइल",
      settings: "सेटिंग्स",
      logout: "लॉगआउट",
      welcome: "स्वागत है",
      healthScore: "स्वास्थ्य स्कोर",
      recentActivity: "हाल की गतिविधि",
      quickActions: "त्वरित कार्य",
      healthInsights: "स्वास्थ्य अंतर्दृष्टि"
    },
    english: {
      dashboard: "Dashboard",
      overview: "Overview",
      chat: "Health Chat",
      doctors: "Find Doctors",
      emergency: "Emergency",
      heatmap: "Disease Map",
      profile: "Profile",
      settings: "Settings",
      logout: "Logout",
      welcome: "Welcome back",
      healthScore: "Health Score",
      recentActivity: "Recent Activity",
      quickActions: "Quick Actions",
      healthInsights: "Health Insights"
    }
  };
  const t = translations[currentLanguage];
  const sidebarItems = [{
    id: 'overview',
    icon: Activity,
    label: t.overview,
    color: 'text-muted-gold'
  }, {
    id: 'assessment',
    icon: Shield,
    label: 'Assessment',
    color: 'text-emerald-500'
  }, {
    id: 'chat',
    icon: MessageSquare,
    label: t.chat,
    color: 'text-soft-coral'
  }, {
    id: 'doctors',
    icon: Users,
    label: t.doctors,
    color: 'text-soft-teal'
  }, {
    id: 'emergency',
    icon: AlertTriangle,
    label: t.emergency,
    color: 'text-red-500'
  }, {
    id: 'heatmap',
    icon: MapPin,
    label: t.heatmap,
    color: 'text-blue-500'
  }];
  const quickActions = [{
    icon: MessageSquare,
    label: 'Start Health Chat',
    color: 'bg-gradient-to-br from-soft-coral to-pink-400',
    action: () => setActiveTab('chat')
  }, {
    icon: Shield,
    label: 'Assessment',
    color: 'bg-gradient-to-br from-lavender-blue to-purple-400',
    action: () => setActiveTab('assessment')
  }, {
    icon: Users,
    label: 'Find Doctor',
    color: 'bg-gradient-to-br from-muted-gold to-yellow-400',
    action: () => setActiveTab('doctors')
  }, {
    icon: AlertTriangle,
    label: 'Emergency Help',
    color: 'bg-gradient-to-br from-red-500 to-red-600',
    action: () => setActiveTab('emergency')
  }];
  const healthMetrics = [{
    label: 'Heart Rate',
    value: '72 bpm',
    trend: '+2%',
    color: 'text-soft-coral',
    icon: Heart,
    bgColor: 'bg-coral-gradient'
  }, {
    label: 'Blood Pressure',
    value: '120/80',
    trend: 'Normal',
    color: 'text-emerald-500',
    icon: Activity,
    bgColor: 'bg-emerald-100'
  }, {
    label: 'Sleep Quality',
    value: '8.2/10',
    trend: '+5%',
    color: 'text-lavender-blue',
    icon: Clock,
    bgColor: 'bg-lavender-gradient'
  }, {
    label: 'Stress Level',
    value: 'Low',
    trend: '-10%',
    color: 'text-muted-gold',
    icon: Shield,
    bgColor: 'bg-gold-gradient'
  }];
  const recentActivities = [{
    type: 'consultation',
    title: 'Video call with Dr. Sarah',
    time: '2 hours ago',
    status: 'completed'
  }, {
    type: 'medication',
    title: 'Medication reminder taken',
    time: '4 hours ago',
    status: 'completed'
  }, {
    type: 'appointment',
    title: 'Appointment scheduled',
    time: '1 day ago',
    status: 'upcoming'
  }, {
    type: 'health-check',
    title: 'Health metrics updated',
    time: '2 days ago',
    status: 'completed'
  }];
  const upcomingAppointments = [{
    doctor: 'Dr. Rajesh Kumar',
    specialty: 'Cardiologist',
    date: 'Today',
    time: '2:30 PM',
    type: 'Video Call'
  }, {
    doctor: 'Dr. Priya Sharma',
    specialty: 'Dermatologist',
    date: 'Tomorrow',
    time: '10:00 AM',
    type: 'In-Person'
  }, {
    doctor: 'Dr. Amit Patel',
    specialty: 'General Medicine',
    date: 'Dec 28',
    time: '3:00 PM',
    type: 'Video Call'
  }];
  const greetingVariants = {
    hidden: {
      opacity: 0,
      x: 30
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 90,
        damping: 18,
        duration: 0.64
      }
    }
  };

  // Fetch current user and profile's full_name
  useEffect(() => {
    let isMounted = true;
    async function loadUserProfile() {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (userId) {
        const { data } = await fetchProfile(userId);
        if (isMounted && data) {
          setProfile({
            full_name: data.full_name || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
          });
          setUserFullName(data.full_name || '');
        } else if (isMounted) {
          setProfile({ full_name: '', email: '', phone: '', address: '' });
          setUserFullName('');
        }
      } else if (isMounted) {
        setProfile({ full_name: '', email: '', phone: '', address: '' });
        setUserFullName('');
      }
    }
    loadUserProfile();
    // Subscribe to changes in auth state
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setTimeout(() => {
          fetchProfile(session.user.id).then(({ data }) => {
            if (data) {
              setProfile({
                full_name: data.full_name || '',
                email: data.email || '',
                phone: data.phone || '',
                address: data.address || '',
              });
              setUserFullName(data.full_name || '');
            } else {
              setProfile({ full_name: '', email: '', phone: '', address: '' });
              setUserFullName('');
            }
          });
        }, 0);
      } else {
        setProfile({ full_name: '', email: '', phone: '', address: '' });
        setUserFullName('');
      }
    });
    return () => {
      isMounted = false;
      if (listener?.subscription) {
        listener.subscription.unsubscribe();
      }
    };
  }, []);
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    } else if (parts.length > 1) {
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    return '';
  };
  const renderOverview = () => <div className="space-y-8">
      {/* Welcome Section with Custom Image */}
      <div className="glass-welcome glass-card shadow-lg-glass p-6 sm:p-8 flex flex-col lg:flex-row items-center gap-8 relative overflow-hidden rounded-2xl">
        {/* Move the colorful image to the left side, vertical layout */}
        <div className="flex-shrink-0 w-full max-w-xs mx-auto mb-8 sm:mb-12 lg:mb-0 lg:mr-8">
          <img src="/lovable-uploads/be3039d6-d07b-4f86-806b-2b2bfff5e10c.png" alt="Health Visualization" className="w-full max-w-[200px] sm:max-w-xs h-40 sm:h-48 drop-shadow-md rounded-2xl object-cover mx-auto" />
        </div>
        {/* Welcome headline on the right */}
        <motion.div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left" initial="hidden" animate="visible" variants={greetingVariants}>
          <div className="flex items-center mb-4">
            <h1 className="text-4xl lg:text-5xl font-heading font-bold text-emerald-700 mr-2 tracking-tighter drop-shadow">
              Welcome back, {userFullName && userFullName.trim().length > 0 ? userFullName : "User"}
            </h1>
          </div>
          <p className="text-xl font-mono text-foreground/70 leading-relaxed mt-1">
            Your premium health journey continues. Here's your personalized overview.
          </p>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-6 sm:mb-8">{t.quickActions}</h2>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {quickActions.map((action, index) => (
            <Card key={index} className="glass-card premium-card-hover cursor-pointer border-white/10 rounded-2xl shadow-lg-glass min-w-0" onClick={action.action}>
              <CardContent className="p-6 sm:p-8 text-center">
                <div className={`w-14 h-14 sm:w-16 sm:h-16 ${action.color} rounded-3xl flex items-center justify-center mx-auto mb-5 sm:mb-6 shadow-lg`}>
                  <action.icon className={`w-7 h-7 sm:w-8 sm:h-8 ${action.label === 'Emergency Help' ? 'text-white' : 'text-emerald-700'}`} />
                </div>
                <p className="font-semibold text-foreground text-base sm:text-lg">{action.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Health Metrics */}
      <div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {healthMetrics.map((metric, index) => <Card key={index} className={`glass-card glass-metric-card border-white/10 rounded-2xl shadow-md ${metric.bgColor}`}>
              
            </Card>)}
        </div>
      </div>

      {/* Recent Activity & Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Recent Activity */}
        

        {/* Upcoming Appointments */}
        
      </div>
    </div>;
  const renderActiveContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'assessment':
        return <Assessment language={currentLanguage} />;
      case 'chat':
        return <VoiceChatbot language={currentLanguage} />;
      case 'doctors':
        return <DoctorFinder language={currentLanguage} />;
      case 'emergency':
        return <EmergencyPanel language={currentLanguage} />;
      case 'heatmap':
        return <DiseaseHeatmap language={currentLanguage} />;
      case 'profile':
        return <ProfilePage
          userFullName={profile.full_name}
          email={profile.email}
          phone={profile.phone}
          address={profile.address}
          onProfileUpdate={(updatedProfile) => {
            setProfile(updatedProfile);
            setUserFullName(updatedProfile.full_name);
          }}
        />;
      case 'settings':
        return <SettingsPage />;
      default:
        return renderOverview();
    }
  };
  return <SidebarProvider>
      <div className="min-h-screen bg-premium-gradient floating-bg flex flex-col md:flex-row w-full">
        {/* Sidebar for desktop & sidebar in drawer for mobile */}
        <Sidebar>
          <SidebarContent className="hidden md:block h-full p-0 w-72 bg-transparent border-0 shadow-none">
            <DashboardSidebar sidebarItems={sidebarItems} t={t} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} userFullName={userFullName} />
          </SidebarContent>
          <SidebarContent className="block md:hidden h-full p-0 w-72 bg-background">
            <DashboardSidebar sidebarItems={sidebarItems} t={t} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} userFullName={userFullName} />
          </SidebarContent>
        </Sidebar>
        {/* Main Content */}
        <div className="flex-1 flex flex-col w-full">
          {/* Header */}
          <header className="glass-nav border-b border-white/10 p-4 sm:p-6 md:p-8">
            <div className="flex items-center justify-between w-full">
              {/* Left side: Hamburger and Title */}
              <div className="flex items-center space-x-3">
                <div className="md:hidden mr-3 flex items-center">
                  <SidebarTrigger />
                </div>
                <div className="flex items-center space-x-4 sm:space-x-6">
                  <h1 className="font-heading text-xl sm:text-3xl font-bold text-foreground">{t.dashboard}</h1>
                  <Badge className="glass-card border-white/20 text-foreground px-2 sm:px-4 py-1 sm:py-2 font-medium rounded-2xl shadow-lg-glass">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Badge>
                </div>
              </div>

              {/* Right side: Search, Language, Notifications, Profile */}
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative w-full max-w-xs">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/40" />
                  <Input placeholder="Search..." className="pl-10 w-full glass-card border-white/20 bg-white/5 focus:ring-muted-gold focus:border-muted-gold text-foreground placeholder:text-foreground/40 rounded-2xl shadow-lg-glass" />
                </div>
                <LanguageToggle 
                  currentLanguage={currentLanguage} 
                  onLanguageChange={(lang: 'english' | 'hindi') => setCurrentLanguage(lang)} 
                />
                <Button variant="ghost" className="relative p-3 glass-card border-white/20 rounded-2xl shadow-lg-glass">
                  <Bell className="w-6 h-6 text-foreground/70" />
                  {notifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-6 h-6 p-0 flex items-center justify-center bg-soft-coral text-white text-xs border-0">
                      {notifications}
                    </Badge>
                  )}
                </Button>
                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    className="flex items-center gap-2 px-2 py-1 rounded-2xl ring-2 ring-muted-gold/20 bg-white/80 hover:bg-emerald-50 transition"
                    onClick={() => setProfileDropdownOpen((v) => !v)}
                    aria-label="Profile Menu"
                  >
                    <Avatar className="w-9 h-9 sm:w-10 sm:h-10">
                      <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face" />
                      <AvatarFallback>{getInitials(userFullName)}</AvatarFallback>
                    </Avatar>
                    <ChevronDown className="w-4 h-4 text-emerald-700" />
                  </button>
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-emerald-100 z-50">
                      <button
                        className="w-full text-left px-4 py-3 hover:bg-emerald-50 text-emerald-900 font-medium rounded-t-xl"
                        onClick={() => { setActiveTab('profile'); setProfileDropdownOpen(false); }}
                      >
                        Profile
                      </button>
                      <button
                        className="w-full text-left px-4 py-3 hover:bg-emerald-50 text-emerald-900 font-medium"
                        onClick={() => { setActiveTab('settings'); setProfileDropdownOpen(false); }}
                      >
                        Settings
                      </button>
                      <button
                        className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 font-medium rounded-b-xl"
                        onClick={onLogout}
                      >
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>
          {/* Content Area */}
          <main className="flex-1 p-3 xs:p-4 sm:p-6 md:p-8 overflow-auto w-full max-w-full">
            <div className="max-w-7xl mx-auto w-full">
              {renderActiveContent()}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>;
};
export default Dashboard;
