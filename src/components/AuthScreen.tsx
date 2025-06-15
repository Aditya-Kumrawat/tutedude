import React, { useState } from 'react';
import { ArrowLeft, Mail, Phone, Eye, EyeOff, Shield, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { loginWithEmail, signUpWithEmail } from "@/utils/supabaseAuth";
import { supabase } from '@/integrations/supabase/client';

interface AuthScreenProps {
  onBack: () => void;
  onAuthSuccess: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({
  onBack,
  onAuthSuccess
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordAuth = async () => {
    setIsLoading(true);
    let result: any;
    let errorMsg = "";
    
    if (authMode === "login") {
      result = await loginWithEmail(formData.email, formData.password);
      if (result.error) errorMsg = result.error.message;
    } else {
      // Validate only email, password and confirm password for signup
      if (!formData.email?.trim()) {
        setIsLoading(false);
        toast({
          title: "Missing Information",
          description: "Please enter your email address.",
          variant: "destructive",
        });
        return;
      }
      if (!formData.password?.trim()) {
        setIsLoading(false);
        toast({
          title: "Missing Information",
          description: "Please enter a password.",
          variant: "destructive",
        });
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setIsLoading(false);
        toast({
          title: "Passwords do not match",
          description: "Please check your password and try again.",
          variant: "destructive",
        });
        return;
      }

      // All validations passed, proceed with signup
      result = await signUpWithEmail(
        formData.email.trim(),
        formData.password,
      );
      
      if (result.error) errorMsg = result.error.message;
    }

    setIsLoading(false);
    if (errorMsg) {
      toast({
        title: "Authentication Failed",
        description: errorMsg,
        variant: "destructive",
      });
    } else {
      if (authMode === "signup" && result.data.user && !result.data.session) {
        toast({
          title: "Verification Email Sent",
          description: "Check your email to verify and activate your account.",
        });
      } else {
        toast({
          title: "Success!",
          description:
            authMode === "login"
              ? "Login successful"
              : "Signup successful",
        });
        onAuthSuccess();
      }
    }
  };

  const features = ["Secure end-to-end encryption", "HIPAA compliant data protection", "24/7 customer support", "Multi-language support"];

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white p-0 lg:p-10">
      {/* Removed Test Image */}

      {/* Colorful BG image, rotated right, should be fully visible */}
      <img
        src="/lovable-uploads/c0a6c46d-2a68-4efa-922e-fb58bcda39a8.png"
        alt="Colorful background"
        className="
          fixed
          top-0
          left-0
          w-[170vw]
          h-[170vh]
          min-w-full
          min-h-full
          -rotate-12
          z-0
          opacity-100
          pointer-events-none
          select-none
          object-cover
        "
        draggable={false}
        style={{
          objectFit: 'cover',
        }}
      />

      {/* Remove or reduce overlay for debugging */}
      {/* <div className="absolute inset-0 z-10 pointer-events-none" style={{
        background: "linear-gradient(to top, rgba(255,255,255,0.66) 60%, rgba(255,255,255,0.24) 100%)",
        mixBlendMode: "lighten"
      }} /> */}

      {/* AuthCard + Branding/Features */}
      <div className="relative z-20 w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-center justify-center">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:block flex-1 space-y-8">
          <div className="space-y-6">
            <Badge className="font-heading bg-accent/80 border-accent text-primary px-4 py-2 shadow-lg-glass">
              🔒 Secure Healthcare Platform
            </Badge>
            <h1 className="font-heading text-4xl font-bold text-primary leading-tight">
              Welcome to the Future of
              <span className="bg-gradient-to-r from-primary to-lavender-light bg-clip-text text-transparent"> Healthcare</span>
            </h1>
            <p className="font-poppins text-xl text-foreground/80">
              Join thousands of users who trust HealthSaarthi for their healthcare needs. 
              Secure, reliable, and always available.
            </p>
          </div>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-sage-500" />
                <span className="text-sage-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Centered Auth Form, always centered on mobile+desktop */}
        <div className="flex-1 w-full max-w-md mx-auto flex flex-col items-center justify-center">
          <div className="glass-card shadow-lg-glass border-2 border-white/30 rounded-2xl p-0">
            <CardHeader className="pb-6 mt-6">
              <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={onBack} className="p-2 rounded-full hover:bg-accent/40">
                  <ArrowLeft className="w-5 h-5 text-primary font-bold" />
                </Button>
                <div className="flex flex-col items-center justify-center mx-auto">
                  <div className="w-10 h-10 flex items-center justify-center bg-primary rounded-xl shadow-lg-glass mb-1">
                    <Shield className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <span className="font-heading font-bold text-base text-primary text-center tracking-wide">
                    HealthSaarthi
                  </span>
                </div>
                <div className="w-9" /> {/* Spacer to balance the icon */}
              </div>
              <div className="text-center mt-2">
                <CardTitle className="font-heading text-2xl font-bold text-primary mb-2">
                  {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
                </CardTitle>
                <p className="font-mono text-muted-foreground text-lg">
                  {authMode === 'login' ? 'Sign in to access your health dashboard' : 'Join HealthSaarthi to get started'}
                </p>
              </div>
              <div className="flex bg-accent/50 rounded-xl p-1 mt-2">
                <Button 
                  variant={authMode === 'login' ? 'default' : 'ghost'} 
                  onClick={() => setAuthMode('login')} 
                  className={`w-1/2 font-heading ${authMode === 'login' ? 'bg-primary text-white' : 'bg-transparent text-primary'}`}
                >
                  Login
                </Button>
                <Button 
                  variant={authMode === 'signup' ? 'default' : 'ghost'} 
                  onClick={() => setAuthMode('signup')} 
                  className={`w-1/2 font-heading ${authMode === 'signup' ? 'bg-primary text-white' : 'bg-transparent text-primary'}`}
                >
                  Sign Up
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-2 pb-8">
              <div className="space-y-2">
                <Label className="text-sage-700 font-medium">Email Address</Label>
                <Input type="email" placeholder="Enter your email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className="focus:ring-sage-500 focus:border-sage-500 glass-input" />
              </div>
              <div className="space-y-2">
                <Label className="text-sage-700 font-medium">Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={e => handleInputChange('password', e.target.value)}
                    className="focus:ring-sage-500 focus:border-sage-500 glass-input pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-foreground/60 hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              {authMode === 'signup' && (
                <div className="space-y-2">
                  <Label className="text-sage-700 font-medium">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={e => handleInputChange('confirmPassword', e.target.value)}
                      className="focus:ring-sage-500 focus:border-sage-500 glass-input pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-foreground/60 hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              )}
              <Button onClick={handlePasswordAuth} disabled={isLoading} className="w-full bg-emerald-600 text-white font-heading py-3 rounded-lg text-lg hover:bg-emerald-700 transition">
                {isLoading ? (authMode === 'login' ? 'Logging in...' : 'Signing up...') : (authMode === 'login' ? 'Login' : 'Sign Up')}
              </Button>
            </CardContent>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
