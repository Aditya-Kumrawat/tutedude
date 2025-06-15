
import React, { useState } from 'react';
import { Phone, MessageSquare, MapPin, AlertTriangle, Heart, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface EmergencyPanelProps {
  language: string;
}

const EmergencyPanel: React.FC<EmergencyPanelProps> = ({ language }) => {
  const [emergencyContact, setEmergencyContact] = useState('');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const { toast } = useToast();

  const translations = {
    hindi: {
      title: "आपातकालीन सहायता",
      subtitle: "तुरंत मदद पाएं",
      ambulance: "एम्बुलेंस कॉल करें",
      helpline: "हेल्पलाइन 108",
      emergencyContact: "आपातकालीन संपर्क",
      sendSMS: "SMS भेजें",
      currentLocation: "वर्तमान स्थान",
      getLocation: "स्थान पता करें",
      emergencyNumbers: "आपातकालीन नंबर",
      police: "पुलिस - 100",
      fire: "दमकल - 101",
      medical: "मेडिकल - 108",
      addContact: "आपातकालीन संपर्क जोड़ें",
      contactPlaceholder: "मोबाइल नंबर डालें",
      locationSent: "स्थान भेजा गया",
      callMade: "कॉल किया गया",
      smsTemplate: "आपातकाल! मुझे तुरंत मदद चाहिए। मेरा स्थान:"
    },
    english: {
      title: "Emergency Assistance",
      subtitle: "Get immediate help",
      ambulance: "Call Ambulance",
      helpline: "Helpline 108",
      emergencyContact: "Emergency Contact",
      sendSMS: "Send SMS",
      currentLocation: "Current Location",
      getLocation: "Get Location",
      emergencyNumbers: "Emergency Numbers",
      police: "Police - 100",
      fire: "Fire - 101",
      medical: "Medical - 108",
      addContact: "Add Emergency Contact",
      contactPlaceholder: "Enter mobile number",
      locationSent: "Location sent",
      callMade: "Call made",
      smsTemplate: "Emergency! I need immediate help. My location:"
    }
  };

  const t = translations[language];

  const emergencyNumbers = [
    { name: t.police, number: "100", icon: Users, color: "bg-blue-500" },
    { name: t.fire, number: "101", icon: AlertTriangle, color: "bg-orange-500" },
    { name: t.medical, number: "108", icon: Heart, color: "bg-red-500" }
  ];

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          toast({
            title: "Location Found",
            description: "Your current location has been detected",
          });
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Could not get your location. Please enable GPS.",
            variant: "destructive"
          });
        }
      );
    }
  };

  const makeEmergencyCall = (number: string) => {
    window.open(`tel:${number}`, '_self');
    toast({
      title: t.callMade,
      description: `Calling ${number}`,
    });
  };

  const sendEmergencySMS = () => {
    if (!emergencyContact) {
      toast({
        title: "Error",
        description: "Please add an emergency contact first",
        variant: "destructive"
      });
      return;
    }

    if (!userLocation) {
      getCurrentLocation();
      return;
    }

    const locationUrl = `https://maps.google.com/maps?q=${userLocation.lat},${userLocation.lng}`;
    const message = `${t.smsTemplate} ${locationUrl}`;
    
    // Open SMS app with pre-filled message
    const smsUrl = `sms:${emergencyContact}?body=${encodeURIComponent(message)}`;
    window.open(smsUrl, '_self');

    toast({
      title: t.locationSent,
      description: "Emergency SMS prepared",
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2">{t.title}</h2>
        <p className="text-gray-600">{t.subtitle}</p>
      </div>

      {/* Quick Emergency Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-red-200 bg-red-50 hover:bg-red-100 transition-colors">
          <CardContent className="p-6">
            <Button
              onClick={() => makeEmergencyCall("108")}
              className="w-full h-16 bg-red-500 hover:bg-red-600 text-lg font-bold"
              size="lg"
            >
              <Phone className="w-6 h-6 mr-3" />
              {t.ambulance}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors">
          <CardContent className="p-6">
            <Button
              onClick={sendEmergencySMS}
              className="w-full h-16 bg-blue-500 hover:bg-blue-600 text-lg font-bold"
              size="lg"
            >
              <MessageSquare className="w-6 h-6 mr-3" />
              {t.sendSMS}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Numbers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            {t.emergencyNumbers}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {emergencyNumbers.map((emergency, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${emergency.color} text-white`}>
                    <emergency.icon className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{emergency.name}</span>
                </div>
                <Button
                  onClick={() => makeEmergencyCall(emergency.number)}
                  variant="outline"
                  size="sm"
                >
                  <Phone className="w-4 h-4 mr-1" />
                  Call
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            {t.emergencyContact}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="tel"
              placeholder={t.contactPlaceholder}
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={() => {
                if (emergencyContact) {
                  toast({
                    title: "Contact Saved",
                    description: "Emergency contact has been saved",
                  });
                }
              }}
              disabled={!emergencyContact}
            >
              Save
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Location Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-500" />
            {t.currentLocation}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button
              onClick={getCurrentLocation}
              variant="outline"
              className="w-full"
            >
              <MapPin className="w-4 h-4 mr-2" />
              {t.getLocation}
            </Button>
            
            {userLocation && (
              <div className="p-3 bg-green-50 rounded-lg text-sm">
                <p className="text-green-800">
                  Lat: {userLocation.lat.toFixed(6)}, Lng: {userLocation.lng.toFixed(6)}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Instructions */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="text-sm text-amber-800">
            <p className="font-medium mb-2">
              {language === 'hindi' 
                ? "आपातकाल में क्या करें:" 
                : "In case of emergency:"}
            </p>
            <ul className="space-y-1 text-xs">
              <li>• {language === 'hindi' ? "शांत रहें और सुरक्षित स्थान पर जाएं" : "Stay calm and move to a safe location"}</li>
              <li>• {language === 'hindi' ? "तुरंत मदद के लिए कॉल करें" : "Call for immediate help"}</li>
              <li>• {language === 'hindi' ? "अपना स्थान साझा करें" : "Share your location"}</li>
              <li>• {language === 'hindi' ? "जब तक मदद न आए, किसी के साथ रहें" : "Stay with someone until help arrives"}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyPanel;
