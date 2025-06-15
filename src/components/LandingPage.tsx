import React, { useState, useEffect } from 'react';
import { ArrowRight, Heart, Shield, Users, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface LandingPageProps {
  // Removed onGetStarted and onLogin props
}
const heroBgUrl = "/lovable-uploads/4f48b4e7-a7c9-421d-b367-b513e16dc068.png"; // You can change this to another uploaded image if you prefer.

const LandingPage: React.FC<LandingPageProps> = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);
  const features = [{
    icon: Heart,
    title: "AI Health Companion",
    description: "Personalized health insights powered by advanced AI technology",
    color: "text-soft-coral",
    bgColor: "bg-coral-gradient"
  }, {
    icon: Shield,
    title: "Enterprise Security",
    description: "Your health data protected with military-grade encryption",
    color: "text-lavender-blue",
    bgColor: "bg-lavender-gradient"
  }, {
    icon: Users,
    title: "Expert Network",
    description: "Connect with verified healthcare professionals instantly",
    color: "text-muted-gold",
    bgColor: "bg-gold-gradient"
  }, {
    icon: Zap,
    title: "24/7 Availability",
    description: "Access healthcare support anytime, anywhere you need it",
    color: "text-soft-teal",
    bgColor: "bg-teal-100"
  }];
  const testimonials = [{
    name: "Dr. Sarah Johnson",
    role: "Cardiologist",
    content: "HealthSaarthi has revolutionized patient care. The AI insights are remarkably accurate and intuitive.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=64&h=64&fit=crop&crop=face"
  }, {
    name: "Priya Sharma",
    role: "Patient",
    content: "Finally, a health app that truly understands my needs. The interface is beautiful and so easy to use!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face"
  }, {
    name: "Dr. Rajesh Kumar",
    role: "General Physician",
    content: "The emergency features and real-time insights have genuinely helped me save lives. Outstanding platform.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=64&h=64&fit=crop&crop=face"
  }];
  const stats = [{
    number: "100K+",
    label: "Active Users"
  }, {
    number: "2000+",
    label: "Healthcare Providers"
  }, {
    number: "99.9%",
    label: "Uptime"
  }, {
    number: "4.9★",
    label: "User Rating"
  }];
  return <div className="min-h-screen bg-premium-gradient flex flex-col">
    {/* Navigation */}
    <nav className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-lg border-b border-white/25 shadow-sm">
      <div className="container mx-auto px-4 sm:px-8 py-3">
        <div className="flex items-center justify-between flex-wrap">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-muted-gold to-yellow-400 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg font-heading text-foreground tracking-tight">HealthSaarthi</span>
          </div>
          <div className="hidden md:flex items-center space-x-7 font-medium text-base font-poppins">
            <a href="#features" className="text-foreground/80 hover:text-muted-gold transition-colors">Features</a>
            <a href="#about" className="text-foreground/80 hover:text-muted-gold transition-colors">About</a>
            <a href="#testimonials" className="text-foreground/80 hover:text-muted-gold transition-colors">Reviews</a>
            <Button variant="outline" onClick={() => navigate('/auth')} className="font-medium border-2 border-primary/40 rounded-lg px-5 py-1.5 bg-white/80 hover:bg-white text-primary shadow transition">
              Login
            </Button>
          </div>
        </div>
      </div>
    </nav>

    {/* Hero Section */}
    <section className="relative flex flex-col items-center justify-center overflow-hidden pt-36 md:pt-40 pb-12 min-h-[60vh]">
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <img src={heroBgUrl} alt="" className="w-full h-full object-cover object-center-top" style={{
          objectFit: "cover",
          objectPosition: "center top",
          filter: "brightness(0.98) saturate(1.02)"
        }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse farthest-corner at 60% 30%,rgba(202,160,255,0.28) 0%,rgba(110,230,255,0.14) 45%,rgba(255,160,240,0.12) 100%)"
        }}></div>
        <div className="absolute inset-0 bg-white/50"></div>
      </div>
      <div className="relative z-10 w-full max-w-3xl text-center px-4 sm:px-8">
        <Badge className="mb-8 border border-white/40 bg-white/60 text-primary px-5 py-2 font-poppins text-base font-medium shadow">
          <Sparkles className="w-4 h-4 mr-2 text-muted-gold" />
          Now with Advanced AI Health Insights
        </Badge>
        <h1 className="text-4xl sm:text-5xl md:text-7xl py-2 font-extrabold leading-tight font-heading text-foreground bg-gradient-to-br from-black via-primary to-soft-coral bg-clip-text text-transparent tracking-tight">
          Your Personal<br />Health Companion
        </h1>
        <p className="text-base sm:text-lg md:text-2xl text-foreground/70 my-8 max-w-xl mx-auto font-poppins font-medium leading-relaxed">
          Experience the future of healthcare with AI-powered assistance, instant consultations, and personalized wellness insights in a beautifully designed interface.
        </p>
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-6">
          <Button onClick={() => navigate('/auth')} className="btn-premium text-lg px-8 py-4 sm:px-10 sm:py-5 font-poppins">
            Get Started Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 md:gap-8 max-w-2xl mx-auto pt-6 w-full">
          {stats.map((stat, idx) => <div key={idx} className="text-center">
              
              
            </div>)}
        </div>
      </div>
    </section>

    {/* Features Section */}
    <section id="features" className="py-20 sm:py-24 px-3 sm:px-6">
      <div className="container mx-auto">
        <div className="text-center mb-14 sm:mb-20">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8">
            <span className="bg-gradient-to-r from-foreground to-muted-gold bg-clip-text text-purple-300">
              Why Choose HealthSaarthi?
            </span>
          </h2>
          <p className="text-base sm:text-xl text-foreground/70 max-w-3xl mx-auto font-medium leading-relaxed">
            Advanced technology meets compassionate care to deliver an unparalleled healthcare experience.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
          {features.map((feature, index) => <Card key={index} className="glass-card premium-card-hover border-white/10">
              <CardContent className="p-6 sm:p-8 text-center flex flex-col items-center">
                <div className="mb-3">
                  <feature.icon className="bg-slate-50 px-0.5 w-10 h-10 sm:w-14 sm:h-14" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-4">
                  {feature.title}
                </h3>
                <p className="text-foreground/70 leading-relaxed text-sm sm:text-base">
                  {feature.description}
                </p>
              </CardContent>
            </Card>)}
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="py-20 sm:py-24 px-3 sm:px-6 bg-gradient-to-br from-muted-gold/10 via-lavender-blue/10 to-soft-coral/10">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-7 sm:mb-8">
          <span className="bg-gradient-to-r from-foreground to-muted-gold bg-clip-text text-transparent">
            Ready to Transform Your Health Journey?
          </span>
        </h2>
        <p className="text-base sm:text-xl text-foreground/70 mb-8 sm:mb-16 max-w-3xl mx-auto font-medium leading-relaxed">
          Join thousands of users who trust HealthSaarthi for their premium healthcare experience.
        </p>
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 justify-center">
          <Button onClick={() => navigate('/auth')} className="btn-coral text-lg px-8 py-4 sm:px-10 sm:py-6">
            Sign In
          </Button>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="py-12 sm:py-16 px-3 sm:px-6 glass-nav border-t border-white/10">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-muted-gold to-yellow-400 flex items-center justify-center">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-muted-gold to-lavender-blue bg-clip-text text-transparent">
                HealthSaarthi
              </span>
              <p className="text-xs sm:text-sm text-foreground/60 font-medium">
                Apni Bhasha,Apna Doctor
              </p>
            </div>
          </div>
          <p className="text-foreground/60 text-sm sm:text-base">&copy; 2024 HealthSaarthi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>;
};

export default LandingPage;