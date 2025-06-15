import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CompleteProfilePageProps {
  onProfileComplete: () => void;
}

const CompleteProfilePage: React.FC<CompleteProfilePageProps> = ({ onProfileComplete }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSaveProfile = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast({
        title: "Error",
        description: "User not logged in.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: fullName.trim(),
        email: user.email, // Use email from auth user
        phone: phone.trim(),
        address: address.trim(),
      }, { onConflict: 'id' });

    if (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: `Failed to update profile: ${error.message}`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success!",
        description: "Profile completed successfully!",
      });
      onProfileComplete();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="glass-card p-8 rounded-2xl shadow-lg-glass max-w-md w-full">
        <h2 className="font-heading text-3xl font-bold text-primary text-center mb-6">Complete Your Profile</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-sage-700 mb-1">Full Name</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="glass-input w-full px-4 py-2 rounded-lg border border-emerald-300 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-sage-700 mb-1">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="glass-input w-full px-4 py-2 rounded-lg border border-emerald-300 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-sage-700 mb-1">Address</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
              className="glass-input w-full px-4 py-2 rounded-lg border border-emerald-300 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <button
            onClick={handleSaveProfile}
            disabled={loading}
            className="w-full bg-emerald-600 text-white font-heading py-3 rounded-lg text-lg hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfilePage; 