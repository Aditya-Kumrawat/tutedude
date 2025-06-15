import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthScreen from './components/AuthScreen';
import Dashboard from './components/Dashboard';
import CompleteProfilePage from './components/CompleteProfilePage';
import { supabase } from '@/integrations/supabase/client';
import { fetchProfile } from '@/utils/supabaseAuth';
import { UserDataProvider } from '@/context/UserDataContext';

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserAndProfile = async () => {
      setLoading(true);
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);

      if (currentSession) {
        const { data: profile } = await fetchProfile(currentSession.user.id);
        if (profile && profile.full_name && profile.phone && profile.address) {
          setProfileComplete(true);
        } else {
          setProfileComplete(false);
        }
      } else {
        setProfileComplete(false);
      }
      setLoading(false);
    };

    checkUserAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id).then(({ data: profile }) => {
          if (profile && profile.full_name && profile.phone && profile.address) {
            setProfileComplete(true);
          } else {
            setProfileComplete(false);
            // If signed up and profile incomplete, navigate to complete-profile
            if (window.location.pathname !== '/complete-profile') {
                navigate('/complete-profile', { replace: true });
            }
          }
        });
      } else {
        setProfileComplete(false);
        // If logged out, navigate to landing page
        navigate('/', { replace: true });
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleAuthSuccess = async () => {
    // This is called after successful login or signup from AuthScreen
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await fetchProfile(user.id);
      if (profile && profile.full_name && profile.phone && profile.address) {
        setProfileComplete(true);
        navigate('/', { replace: true }); // Already complete, go to dashboard
      } else {
        setProfileComplete(false);
        navigate('/complete-profile', { replace: true }); // Incomplete, go to complete profile
      }
    }
  };

  const handleProfileComplete = () => {
    setProfileComplete(true);
    navigate('/', { replace: true }); // After completing profile, go to dashboard
  };

  // Render logic for the main content based on state
  let mainContent;
  if (loading) {
    mainContent = <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  } else if (session) {
    if (profileComplete) {
      mainContent = <Dashboard onLogout={() => supabase.auth.signOut()} />;
    } else {
      mainContent = <CompleteProfilePage onProfileComplete={handleProfileComplete} />;
    }
  } else {
    // No session, show landing page, from landing page they can navigate to /auth
    mainContent = <Index />;
  }

  return (
    <Routes>
      <Route path="/" element={mainContent} />
      <Route path="/auth" element={<AuthScreen onBack={() => navigate('/')} onAuthSuccess={handleAuthSuccess} />} />
      <Route path="/complete-profile" element={<CompleteProfilePage onProfileComplete={handleProfileComplete} />} />
      {/* Catch-all for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
