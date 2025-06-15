import { useState } from 'react';
import { MapPin, TrendingUp, TrendingDown, AlertCircle, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

interface DiseaseHeatmapProps {
  language: string;
}

const DiseaseHeatmap: React.FC<DiseaseHeatmapProps> = ({ language }): JSX.Element => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [alertLevel, setAlertLevel] = useState<'green' | 'yellow' | 'red'>('green');

  useEffect(() => {
    const map = L.map('map').setView([22.9734, 78.6569], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    const loadData = async () => {
      let heatData: [number, number, number][] = [];

      // ✅ Fetch COVID-19 data
      try {
        const res = await fetch('https://data.incovid19.org/v4/min/data.min.json');
        const covidData = await res.json();

        Object.entries(covidData).forEach(([stateCode, { total, meta }]: any) => {
          if (meta?.latitude && meta?.longitude && total?.confirmed > 0) {
            const intensity = Math.min(total.confirmed / 10000, 1);
            heatData.push([meta.latitude, meta.longitude, intensity]);
          }
        });
      } catch (err) {
        console.error('COVID data fetch failed', err);
      }

      // ✅ Mock data for Dengue & Malaria
      const diseaseData = [
        { lat: 28.7041, lng: 77.1025, disease: 'Dengue', cases: 500 },
        { lat: 19.076, lng: 72.8777, disease: 'Malaria', cases: 800 },
        { lat: 13.0827, lng: 80.2707, disease: 'Dengue', cases: 300 },
        { lat: 23.0225, lng: 72.5714, disease: 'Malaria', cases: 600 },
      ];

      diseaseData.forEach((d) => {
        const intensity = Math.min(d.cases / 1000, 1); 
        heatData.push([d.lat, d.lng, intensity]);
      });

      // @ts-ignore
      L.heatLayer(heatData, {
        radius: 30,
        blur: 15,
        gradient: {
          0.2: 'blue',
          0.4: 'lime',
          0.6: 'yellow',
          0.8: 'red'
        }
      }).addTo(map);
    };

    loadData();

    return () => {
      map.remove();
    };
  }, []);

  const translations = {
    hindi: {
      title: "बीमारी का नक्शा",
      subtitle: "आपके क्षेत्र में स्वास्थ्य स्थिति",
      currentArea: "वर्तमान क्षेत्र",
      riskLevel: "जोखिम स्तर",
      low: "कम",
      medium: "मध्यम",
      high: "उच्च",
      commonSymptoms: "सामान्य लक्षण",
      recentReports: "हाल की रिपोर्ट्स",
      trendingUp: "बढ़ रहा है",
      trendingDown: "घट रहा है",
      stable: "स्थिर",
      recommendations: "सुझाव",
      viewMap: "मानचित्र देखें",
      reportSymptoms: "लक्षण रिपोर्ट करें"
    },
    english: {
      title: "Disease Heatmap",
      subtitle: "Health situation in your area",
      currentArea: "Current Area",
      riskLevel: "Risk Level",
      low: "Low",
      medium: "Medium", 
      high: "High",
      commonSymptoms: "Common Symptoms",
      recentReports: "Recent Reports",
      trendingUp: "Trending Up",
      trendingDown: "Trending Down",
      stable: "Stable",
      recommendations: "Recommendations",
      viewMap: "View Map",
      reportSymptoms: "Report Symptoms"
    }
  };

  const t = translations[language];

  const heatmapData = {
    areas: [
      {
        name: "Central District",
        nameHindi: "केंद्रीय जिला",
        riskLevel: "medium" as const,
        recentCases: 23,
        trend: "up" as const,
        commonDiseases: ["Viral Fever", "Common Cold", "Headache"],
        commonDiseasesHindi: ["वायरल बुखार", "सामान्य सर्दी", "सिरदर्द"]
      },
      {
        name: "North Zone",
        nameHindi: "उत्तरी क्षेत्र",
        riskLevel: "low" as const,
        recentCases: 8,
        trend: "down" as const,
        commonDiseases: ["Cough", "Fatigue"],
        commonDiseasesHindi: ["खांसी", "थकान"]
      },
      {
        name: "South Zone",
        nameHindi: "दक्षिणी क्षेत्र",
        riskLevel: "high" as const,
        recentCases: 45,
        trend: "up" as const,
        commonDiseases: ["Dengue Fever", "Stomach Pain", "Diarrhea"],
        commonDiseasesHindi: ["डेंगू बुखार", "पेट दर्द", "दस्त"]
      }
    ],
    recommendations: {
      hindi: [
        "पानी उबालकर पिएं",
        "मच्छरों से बचाव करें",
        "साफ-सफाई रखें",
        "भीड़भाड़ से बचें"
      ],
      english: [
        "Drink boiled water",
        "Protect from mosquitoes",
        "Maintain cleanliness",
        "Avoid crowded places"
      ]
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskLabel = (level: string) => {
    switch (level) {
      case 'low': return t.low;
      case 'medium': return t.medium;
      case 'high': return t.high;
      default: return level;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-green-500" />;
      default: return <div className="w-4 h-4" />;
    }
  };

  const getTrendLabel = (trend: string) => {
    switch (trend) {
      case 'up': return t.trendingUp;
      case 'down': return t.trendingDown;
      default: return t.stable;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.title}</h2>
        <p className="text-gray-600">{t.subtitle}</p>
      </div>

      {/* Interactive Map Placeholder */}
      <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-2 border-dashed border-gray-200">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-blue-600" />
          </div>
          <div
            id="map"
            style={{
              height: '400px',
              width: '90%',
              borderRadius: '12px',
              margin: '1rem auto',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              border: '1px solid #e5e7eb'
            }}
          ></div>

          <Button variant="outline">
            <MapPin className="w-4 h-4 mr-2" />
            {t.viewMap}
          </Button>
        </CardContent>
      </Card>

      {/* Area Statistics */}
      <div className="grid gap-4">
        {heatmapData.areas.map((area, index) => (
          <Card 
            key={index}
            className={`cursor-pointer transition-all duration-200 ${
              selectedArea === area.name ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedArea(selectedArea === area.name ? null : area.name)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {language === 'hindi' ? area.nameHindi : area.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getRiskColor(area.riskLevel)}>
                      {getRiskLabel(area.riskLevel)} {t.riskLevel}
                    </Badge>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    {getTrendIcon(area.trend)}
                    <span className="text-sm font-medium">{getTrendLabel(area.trend)}</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{area.recentCases}</div>
                  <div className="text-xs text-gray-500">{t.recentReports}</div>
                </div>
              </div>
            </CardHeader>
            
            {selectedArea === area.name && (
              <CardContent className="pt-0 space-y-4">
                <div>
                  <h4 className="font-medium mb-2">{t.commonSymptoms}:</h4>
                  <div className="flex flex-wrap gap-2">
                    {(language === 'hindi' ? area.commonDiseasesHindi : area.commonDiseases).map((disease, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {disease}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Recommendations */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <AlertCircle className="w-5 h-5" />
            {t.recommendations}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {heatmapData.recommendations[language].map((rec, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-blue-800">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Report Symptoms Button */}
      <div className="text-center">
        <Button className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3">
          <Users className="w-5 h-5 mr-2" />
          {t.reportSymptoms}
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          {language === 'hindi' 
            ? "समुदाय की मदद के लिए अपने लक्षण साझा करें" 
            : "Share your symptoms to help the community"}
        </p>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">156</div>
            <div className="text-xs text-gray-600">
              {language === 'hindi' ? "सुरक्षित क्षेत्र" : "Safe Areas"}
            </div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">23</div>
            <div className="text-xs text-gray-600">
              {language === 'hindi' ? "सतर्कता क्षेत्र" : "Alert Areas"}
            </div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">7</div>
            <div className="text-xs text-gray-600">
              {language === 'hindi' ? "उच्च जोखिम" : "High Risk"}
            </div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">89%</div>
            <div className="text-xs text-gray-600">
              {language === 'hindi' ? "रिपोर्ट सटीकता" : "Report Accuracy"}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DiseaseHeatmap;
