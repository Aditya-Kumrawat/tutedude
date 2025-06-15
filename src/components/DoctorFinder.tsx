import React, { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Mail, Clock, Star, Map, Loader2, Filter, SlidersHorizontal, ChevronDown, ChevronUp, Award, Languages, DollarSign, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface DoctorFinderProps {
  language: 'english' | 'hindi';
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  distance: string;
  location: string;
  phone: string;
  email: string;
  availability: string;
  lat: number;
  lng: number;
  experience: string;
  languages: string[];
  consultationFee: string;
  education: string[];
  awards: string[];
  insurance: string[];
  reviews: number;
  image?: string;
  clinicName?: string;
  nextAvailable?: string;
}

// Local database of doctors
const doctorsDatabase = [
  {
    id: '1',
    name: 'Dr. Rajesh Kumar',
    specialty: 'General Practitioner',
    rating: 4.5,
    location: '123 Main Street, New Delhi',
    phone: '+91 98765 43210',
    email: 'dr.rajesh@example.com',
    availability: 'Mon-Fri, 9AM-5PM',
    experience: '15',
    languages: ['English', 'Hindi', 'Punjabi'],
    consultationFee: '500',
    education: ['MBBS', 'MD'],
    awards: ['Best Doctor Award 2023'],
    insurance: ['MediGuard', 'Aetna'],
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop'
  },
  {
    id: '2',
    name: 'Dr. Priya Sharma',
    specialty: 'Cardiologist',
    rating: 4.8,
    location: '456 Health Avenue, New Delhi',
    phone: '+91 98765 43211',
    email: 'dr.priya@example.com',
    availability: 'Mon-Sat, 10AM-7PM',
    experience: '12',
    languages: ['English', 'Hindi', 'Marathi'],
    consultationFee: '800',
    education: ['MBBS', 'MD', 'DM'],
    awards: ['Excellence in Cardiology 2023'],
    insurance: ['MediGuard', 'Max Bupa'],
    reviews: 95,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop'
  },
  {
    id: '3',
    name: 'Dr. Neha Gupta',
    specialty: 'Dermatologist',
    rating: 4.7,
    location: '321 Skin Care Lane, New Delhi',
    phone: '+91 98765 43213',
    email: 'dr.neha@example.com',
    availability: 'Mon-Sat, 9AM-6PM',
    experience: '8',
    languages: ['English', 'Hindi', 'Bengali'],
    consultationFee: '700',
    education: ['MBBS', 'MD Dermatology'],
    awards: ['Dermatology Excellence Award 2023'],
    insurance: ['MediGuard', 'HDFC Ergo'],
    reviews: 112,
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop'
  }
];

const DoctorFinder: React.FC<DoctorFinderProps> = ({ language }) => {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapError, setMapError] = useState(false);
  const [nearbyDoctors, setNearbyDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    specialties: [] as string[],
    maxDistance: 10,
    minRating: 0,
    languages: [] as string[],
    insurance: [] as string[],
    availability: [] as string[],
    maxFee: 2000
  });
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'fee'>('distance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const translations = {
    english: {
      title: "Find Doctors Near You",
      searchPlaceholder: "Search by specialty, name, or location...",
      currentLocation: "Current Location",
      nearbyDoctors: "Nearby Doctors",
      rating: "Rating",
      experience: "Experience",
      contact: "Contact",
      viewProfile: "View Profile",
      bookAppointment: "Book Appointment",
      locationError: "Unable to get your location. Please enable location services.",
      loading: "Loading map...",
      mapError: "Unable to load map. Please ensure the Maps API is properly configured.",
      coordinates: "Coordinates",
      apiError: "Google Maps API Error: Please ensure the API key is properly configured and the Maps Embed API is enabled.",
      searching: "Searching for doctors...",
      noDoctorsFound: "No doctors found nearby. Try adjusting your search.",
      filter: "Filter",
      sort: "Sort by",
      distance: "Distance",
      fee: "Consultation Fee",
      languages: "Languages",
      insurance: "Insurance Accepted",
      availability: "Availability",
      maxDistance: "Maximum Distance",
      minRating: "Minimum Rating",
      maxFee: "Maximum Fee",
      reviews: "Reviews",
      education: "Education",
      awards: "Awards & Recognition",
      experience: "Years of Experience",
      consultationFee: "Consultation Fee",
      languages: "Languages Spoken",
      insurance: "Insurance Accepted",
      availability: "Available Hours",
      generalPractitioner: "General Practitioner",
      cardiologist: "Cardiologist",
      dermatologist: "Dermatologist",
      pediatrician: "Pediatrician",
      neurologist: "Neurologist",
      ophthalmologist: "Ophthalmologist",
      orthopedist: "Orthopedist",
      psychiatrist: "Psychiatrist",
      gynecologist: "Gynecologist",
      dentist: "Dentist",
      sortByDistance: "Distance",
      sortByRating: "Rating",
      sortByFee: "Consultation Fee",
      ascending: "Ascending",
      descending: "Descending",
      km: "km",
      years: "years",
      rupees: "₹",
      showMore: "Show More",
      showLess: "Show Less",
      allSpecialties: "All Specialties",
      selectSpecialty: "Select Specialty"
    },
    hindi: {
      title: "अपने आस-पास के डॉक्टर खोजें",
      searchPlaceholder: "विशेषज्ञता, नाम या स्थान से खोजें...",
      currentLocation: "वर्तमान स्थान",
      nearbyDoctors: "पास के डॉक्टर",
      rating: "रेटिंग",
      experience: "अनुभव",
      contact: "संपर्क",
      viewProfile: "प्रोफाइल देखें",
      bookAppointment: "अपॉइंटमेंट बुक करें",
      locationError: "आपका स्थान प्राप्त करने में असमर्थ। कृपया लोकेशन सर्विसेज सक्षम करें।",
      loading: "मैप लोड हो रहा है...",
      mapError: "मैप लोड करने में असमर्थ। कृपया सुनिश्चित करें कि मैप्स API सही ढंग से कॉन्फ़िगर किया गया है।",
      coordinates: "निर्देशांक",
      apiError: "Google Maps API त्रुटि: कृपया सुनिश्चित करें कि API कुंजी सही ढंग से कॉन्फ़िगर की गई है और Maps Embed API सक्षम है।",
      searching: "डॉक्टरों की खोज जारी है...",
      noDoctorsFound: "पास में कोई डॉक्टर नहीं मिला। अपनी खोज को समायोजित करें।",
      filter: "फ़िल्टर",
      sort: "क्रमबद्ध करें",
      distance: "दूरी",
      fee: "परामर्श शुल्क",
      languages: "भाषाएं",
      insurance: "बीमा स्वीकृत",
      availability: "उपलब्धता",
      maxDistance: "अधिकतम दूरी",
      minRating: "न्यूनतम रेटिंग",
      maxFee: "अधिकतम शुल्क",
      reviews: "समीक्षाएं",
      education: "शिक्षा",
      awards: "पुरस्कार और मान्यता",
      experience: "अनुभव के वर्ष",
      consultationFee: "परामर्श शुल्क",
      languages: "बोली जाने वाली भाषाएं",
      insurance: "स्वीकृत बीमा",
      availability: "उपलब्ध समय",
      generalPractitioner: "सामान्य चिकित्सक",
      cardiologist: "हृदय रोग विशेषज्ञ",
      dermatologist: "त्वचा रोग विशेषज्ञ",
      pediatrician: "बाल रोग विशेषज्ञ",
      neurologist: "न्यूरोलॉजिस्ट",
      ophthalmologist: "नेत्र रोग विशेषज्ञ",
      orthopedist: "हड्डी रोग विशेषज्ञ",
      psychiatrist: "मनोचिकित्सक",
      gynecologist: "स्त्री रोग विशेषज्ञ",
      dentist: "दंत चिकित्सक",
      sortByDistance: "दूरी",
      sortByRating: "रेटिंग",
      sortByFee: "परामर्श शुल्क",
      ascending: "आरोही",
      descending: "अवरोही",
      km: "किमी",
      years: "वर्ष",
      rupees: "₹",
      showMore: "और दिखाएं",
      showLess: "कम दिखाएं",
      allSpecialties: "सभी विशेषज्ञताएं",
      selectSpecialty: "विशेषज्ञता चुनें"
    }
  };

  const t = translations[language];

  const getRandomSpecialty = () => {
    const specialties = [
      t.generalPractitioner,
      t.cardiologist,
      t.dermatologist,
      t.pediatrician,
      t.neurologist,
      t.ophthalmologist,
      t.orthopedist,
      t.psychiatrist,
      t.gynecologist,
      t.dentist
    ];
    return specialties[Math.floor(Math.random() * specialties.length)];
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoading(false);
          // Immediately fetch doctors when location is available
          fetchNearbyDoctors(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError(t.locationError);
          setLoading(false);
          // Even if location fails, show doctors with default location
          fetchNearbyDoctors(28.6139, 77.2090); // Default to New Delhi coordinates
        }
      );
    } else {
      setError(t.locationError);
      setLoading(false);
      // If geolocation is not available, show doctors with default location
      fetchNearbyDoctors(28.6139, 77.2090); // Default to New Delhi coordinates
    }
  }, [t.locationError]);

  const fetchNearbyDoctors = async (lat: number, lng: number) => {
    setIsSearching(true);
    try {
      // Use local database with more realistic locations
      const doctorsWithLocation = doctorsDatabase.map(doctor => {
        // Add small random offsets to create realistic distribution
        const latOffset = (Math.random() * 0.02 - 0.01);
        const lngOffset = (Math.random() * 0.02 - 0.01);
        const doctorLat = lat + latOffset;
        const doctorLng = lng + lngOffset;
        
        return {
          ...doctor,
          lat: doctorLat,
          lng: doctorLng,
          distance: calculateDistance(lat, lng, doctorLat, doctorLng)
        };
      });
      
      console.log('Fetched doctors:', doctorsWithLocation); // Debug log
      setNearbyDoctors(doctorsWithLocation);
      setIsSearching(false);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setError(t.noDoctorsFound);
      setIsSearching(false);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSort = (doctors: Doctor[]) => {
    return [...doctors].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'distance':
          comparison = parseFloat(a.distance) - parseFloat(b.distance);
          break;
        case 'rating':
          comparison = b.rating - a.rating;
          break;
        case 'fee':
          comparison = parseFloat(a.consultationFee) - parseFloat(b.consultationFee);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  const filteredDoctors = nearbyDoctors.filter(doctor => {
    // If no specialty is selected (all specialties), show all doctors
    const matchesSpecialty = filters.specialties.length === 0 || 
      filters.specialties.some(specialty => {
        const specialtyMap: { [key: string]: string } = {
          'general_practitioner': 'General Practitioner',
          'cardiologist': 'Cardiologist',
          'dermatologist': 'Dermatologist',
          'pediatrician': 'Pediatrician',
          'neurologist': 'Neurologist',
          'ophthalmologist': 'Ophthalmologist',
          'orthopedist': 'Orthopedist',
          'psychiatrist': 'Psychiatrist',
          'gynecologist': 'Gynecologist',
          'dentist': 'Dentist'
        };
        return doctor.specialty === specialtyMap[specialty];
      });
    
    // Convert distance string to number for comparison
    const distanceValue = parseFloat(doctor.distance.replace(/[^0-9.]/g, ''));
    const matchesDistance = distanceValue <= filters.maxDistance;
    
    const matchesRating = doctor.rating >= filters.minRating;
    
    const matchesLanguages = filters.languages.length === 0 || 
      doctor.languages.some(lang => filters.languages.includes(lang));
    
    const matchesInsurance = filters.insurance.length === 0 || 
      doctor.insurance.some(ins => filters.insurance.includes(ins));
    
    const matchesFee = parseFloat(doctor.consultationFee) <= filters.maxFee;

    return matchesSpecialty && matchesDistance && matchesRating && 
           matchesLanguages && matchesInsurance && matchesFee;
  });

  const sortedDoctors = handleSort(filteredDoctors);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentLocation) {
      fetchNearbyDoctors(currentLocation.lat, currentLocation.lng);
    }
  };

  const handleMapError = () => {
    setMapError(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Map Section */}
        <Card className="flex-1 glass-card border-white/10 rounded-2xl shadow-lg-glass">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">{t.currentLocation}</h2>
            {loading ? (
              <div className="h-[400px] flex items-center justify-center">
                <p className="text-neutral-600">{t.loading}</p>
              </div>
            ) : error ? (
              <div className="h-[400px] flex items-center justify-center">
                <p className="text-error-600">{error}</p>
              </div>
            ) : currentLocation ? (
              mapError ? (
                <div className="h-[400px] flex flex-col items-center justify-center space-y-4">
                  <Map className="w-12 h-12 text-foreground/40" />
                  <p className="text-foreground/60 text-center max-w-md">{t.apiError}</p>
                  <div className="text-sm text-foreground/40">
                    <p>{t.coordinates}:</p>
                    <p>Latitude: {currentLocation.lat.toFixed(6)}</p>
                    <p>Longitude: {currentLocation.lng.toFixed(6)}</p>
        </div>
      </div>
              ) : (
                <div className="h-[400px] rounded-xl overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps/embed/v1/search?key=AIzaSyB4E6GkCkmiScNMQSs5oukdpZ40FWx_0u8&q=doctor+${searchQuery}&center=${currentLocation.lat},${currentLocation.lng}&zoom=14`}
                    allowFullScreen
                    onError={handleMapError}
                  />
            </div>
              )
            ) : null}
          </CardContent>
        </Card>

        {/* Search and Results Section */}
        <div className="flex-1 space-y-6">
          <div className="flex gap-4">
            <form onSubmit={handleSearch} className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <Input
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full glass-card border-white/20 bg-white/5 focus:ring-muted-gold focus:border-muted-gold text-foreground placeholder:text-foreground/40 rounded-2xl shadow-lg-glass"
              />
            </form>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="glass-card border-white/20"
            >
              <Filter className="w-4 h-4 mr-2" />
              {t.filter}
            </Button>
          </div>

          {/* Filters */}
          <Collapsible open={showFilters} onOpenChange={setShowFilters}>
            <Card className="glass-card border-white/10">
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Specialty Filter */}
                  <div className="space-y-2">
                    <Label>{t.specialties}</Label>
                    <Select
                      value={filters.specialties[0] || "all_specialties"}
                      onValueChange={(value) => handleFilterChange('specialties', value === "all_specialties" ? [] : [value])}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t.selectSpecialty} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all_specialties">{t.allSpecialties}</SelectItem>
                        <SelectItem value="general_practitioner">{t.generalPractitioner}</SelectItem>
                        <SelectItem value="cardiologist">{t.cardiologist}</SelectItem>
                        <SelectItem value="dermatologist">{t.dermatologist}</SelectItem>
                        <SelectItem value="pediatrician">{t.pediatrician}</SelectItem>
                        <SelectItem value="neurologist">{t.neurologist}</SelectItem>
                        <SelectItem value="ophthalmologist">{t.ophthalmologist}</SelectItem>
                        <SelectItem value="orthopedist">{t.orthopedist}</SelectItem>
                        <SelectItem value="psychiatrist">{t.psychiatrist}</SelectItem>
                        <SelectItem value="gynecologist">{t.gynecologist}</SelectItem>
                        <SelectItem value="dentist">{t.dentist}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Distance Filter */}
                  <div className="space-y-2">
                    <Label>{t.maxDistance}</Label>
                    <Slider
                      value={[filters.maxDistance]}
                      onValueChange={(value) => handleFilterChange('maxDistance', value[0])}
                      max={50}
                      step={1}
                    />
                    <div className="text-sm text-foreground/60">
                      {filters.maxDistance} {t.km}
                    </div>
                </div>

                  {/* Rating Filter */}
                  <div className="space-y-2">
                    <Label>{t.minRating}</Label>
                    <Slider
                      value={[filters.minRating]}
                      onValueChange={(value) => handleFilterChange('minRating', value[0])}
                      max={5}
                      step={0.5}
                    />
                    <div className="text-sm text-foreground/60">
                      {filters.minRating} {t.stars}
                    </div>
                  </div>
                  
                  {/* Fee Filter */}
                  <div className="space-y-2">
                    <Label>{t.maxFee}</Label>
                    <Slider
                      value={[filters.maxFee]}
                      onValueChange={(value) => handleFilterChange('maxFee', value[0])}
                      max={5000}
                      step={100}
                    />
                    <div className="text-sm text-foreground/60">
                      {t.rupees}{filters.maxFee}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Collapsible>

          {/* Sort Options */}
          <div className="flex items-center gap-4">
            <Label className="whitespace-nowrap">{t.sort}</Label>
            <Select value={sortBy} onValueChange={(value: 'distance' | 'rating' | 'fee') => setSortBy(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">{t.sortByDistance}</SelectItem>
                <SelectItem value="rating">{t.sortByRating}</SelectItem>
                <SelectItem value="fee">{t.sortByFee}</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t.nearbyDoctors}</h3>
            {isSearching ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="ml-2">{t.searching}</span>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-error-600">
                {error}
              </div>
            ) : sortedDoctors.length === 0 ? (
              <div className="text-center py-8 text-foreground/60">
                {t.noDoctorsFound}
              </div>
            ) : (
              sortedDoctors.map((doctor) => (
                <Card key={doctor.id} className="glass-card border-white/10 rounded-2xl shadow-lg-glass">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {doctor.image && (
                        <div className="w-24 h-24 rounded-full overflow-hidden">
                          <img
                            src={doctor.image}
                            alt={doctor.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-semibold">{doctor.name}</h4>
                            <p className="text-foreground/60">{doctor.specialty}</p>
                            {doctor.clinicName && (
                              <p className="text-sm text-foreground/60">{doctor.clinicName}</p>
                            )}
                          </div>
                          <div className="flex items-center">
                            <Star className="w-5 h-5 text-yellow-400 fill-current" />
                            <span className="ml-1 font-medium">{doctor.rating}</span>
                            <span className="ml-1 text-sm text-foreground/60">({doctor.reviews})</span>
                  </div>
                </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center text-sm">
                            <MapPin className="w-4 h-4 mr-2 text-foreground/60" />
                            <span>{doctor.distance}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="w-4 h-4 mr-2 text-foreground/60" />
                            <span>{doctor.availability}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <DollarSign className="w-4 h-4 mr-2 text-foreground/60" />
                            <span>{t.rupees}{doctor.consultationFee}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Award className="w-4 h-4 mr-2 text-foreground/60" />
                            <span>{doctor.experience} {t.years}</span>
                          </div>
                        </div>

                        {doctor.nextAvailable && (
                          <div className="mb-4 text-sm text-foreground/60">
                            <Calendar className="w-4 h-4 inline mr-2" />
                            {t.nextAvailable}: {doctor.nextAvailable}
                          </div>
                        )}

                        <div className="space-y-2 mb-4">
                          <div className="flex flex-wrap gap-2">
                            {doctor.languages.map((lang, index) => (
                              <Badge key={index} variant="secondary" className="glass-card">
                                {lang}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {doctor.insurance.map((ins, index) => (
                              <Badge key={index} variant="outline" className="glass-card">
                                {ins}
                              </Badge>
                            ))}
                          </div>
                </div>

                        <div className="flex justify-between items-center">
                          <Button variant="outline" className="glass-card border-white/20">
                            {t.viewProfile}
                  </Button>
                          <Button className="bg-primary-600 hover:bg-primary-700">
                            {t.bookAppointment}
                  </Button>
                        </div>
                      </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorFinder;
