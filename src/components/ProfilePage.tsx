import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';

interface ProfilePageProps {
  userFullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  onProfileUpdate?: (profile: { full_name: string; email: string; phone: string; address: string }) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  userFullName = 'User',
  email = 'user@email.com',
  phone = '+91 9876543210',
  address = '123, Main Street, City, State, 123456',
  onProfileUpdate
}) => {
  const [editing, setEditing] = useState(false);
  const [nameValue, setNameValue] = useState(userFullName);
  const [emailValue, setEmailValue] = useState(email);
  const [phoneValue, setPhoneValue] = useState(phone);
  const [addressValue, setAddressValue] = useState(address);
  const [saved, setSaved] = useState({
    name: userFullName,
    email: email,
    phone: phone,
    address: address,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);
    // Get current user id
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (!user) {
      setMessage('User not authenticated.');
      setLoading(false);
      return;
    }
    // Update profile in Supabase
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: nameValue,
        email: emailValue,
        phone: phoneValue,
        address: addressValue,
      })
      .eq('id', user.id);
    if (error) {
      setMessage('Failed to update profile.');
    } else {
      const updatedProfile = {
        name: nameValue,
        email: emailValue,
        phone: phoneValue,
        address: addressValue,
      };
      setSaved(updatedProfile);
      if (onProfileUpdate) {
        onProfileUpdate({
          full_name: nameValue,
          email: emailValue,
          phone: phoneValue,
          address: addressValue,
        });
      }
      setMessage('Profile updated successfully!');
      setEditing(false);
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setNameValue(saved.name);
    setEmailValue(saved.email);
    setPhoneValue(saved.phone);
    setAddressValue(saved.address);
    setEditing(false);
    setMessage(null);
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl shadow-lg mt-8">
      <div className="flex flex-col items-center">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=96&h=96&fit=crop&crop=face" />
          <AvatarFallback>{saved.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold mb-1">{saved.name}</h2>
        <p className="text-gray-500 mb-6">{saved.email}</p>
        {!editing ? (
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition mb-4" onClick={() => setEditing(true)}>
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2 mb-4">
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition" onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition" onClick={handleCancel} disabled={loading}>
              Cancel
            </button>
          </div>
        )}
        {message && <div className={`mb-4 text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</div>}
        
        <div className="w-full">
          <h3 className="text-lg font-semibold mb-2">Profile Details</h3>
          <div className="bg-emerald-50 rounded-lg p-4 text-gray-700 space-y-2">
            <div>
              <span className="font-semibold">Name:</span>{' '}
              {editing ? (
                <input
                  className="border rounded px-2 py-1 w-full max-w-xs"
                  value={nameValue}
                  onChange={e => setNameValue(e.target.value)}
                  disabled={loading}
                />
              ) : (
                saved.name
              )}
            </div>
            <div>
              <span className="font-semibold">Email:</span>{' '}
              {editing ? (
                <input
                  className="border rounded px-2 py-1 w-full max-w-xs"
                  value={emailValue}
                  onChange={e => setEmailValue(e.target.value)}
                  disabled={loading}
                />
              ) : (
                saved.email
              )}
            </div>
            <div>
              <span className="font-semibold">Phone Number:</span>{' '}
              {editing ? (
                <input
                  className="border rounded px-2 py-1 w-full max-w-xs"
                  value={phoneValue}
                  onChange={e => setPhoneValue(e.target.value)}
                  disabled={loading}
                />
              ) : (
                saved.phone
              )}
            </div>
            <div>
              <span className="font-semibold">Address:</span>{' '}
              {editing ? (
                <input
                  className="border rounded px-2 py-1 w-full max-w-xs"
                  value={addressValue}
                  onChange={e => setAddressValue(e.target.value)}
                  disabled={loading}
                />
              ) : (
                saved.address
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 