// Source: Google Maps Platform Code Assist
import React, { useState, useEffect, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { Language } from '../i18n/translations';
import {
  MapPin,
  Navigation,
  PhoneCall,
  ShieldAlert,
  Compass,
  Building2,
  Pill,
  Stethoscope,
  Search,
  CheckCircle2,
} from 'lucide-react';

interface NearbyFacility {
  id: string;
  displayName: string;
  formattedAddress: string;
  location: { lat: number; lng: number };
  rating?: number;
  userRatingCount?: number;
  primaryType?: string;
  nationalPhoneNumber?: string;
  googleMapsURI?: string;
}

type FacilityCategory = 'hospital' | 'pharmacy' | 'doctor';

const CITY_PRESETS = [
  { name: { en: 'Pune, MH', hi: 'पुणे, महाराष्ट्र', mr: 'पुणे, महाराष्ट्र' }, lat: 18.5204, lng: 73.8567 },
  { name: { en: 'Mumbai, MH', hi: 'मुंबई, महाराष्ट्र', mr: 'मुंबई, महाराष्ट्र' }, lat: 19.076, lng: 72.8777 },
  { name: { en: 'Nagpur, MH', hi: 'नागपुर, महाराष्ट्र', mr: 'नागपूर, महाराष्ट्र' }, lat: 21.1458, lng: 79.0882 },
  { name: { en: 'Nashik, MH', hi: 'नासिक, महाराष्ट्र', mr: 'नाशिक, महाराष्ट्र' }, lat: 19.9975, lng: 73.7898 },
  { name: { en: 'Chh. Sambhajinagar', hi: 'छत्रपति संभाजीनगर', mr: 'छत्रपती संभाजीनगर' }, lat: 19.8762, lng: 75.3433 },
  { name: { en: 'New Delhi', hi: 'नई दिल्ली', mr: 'नवी दिल्ली' }, lat: 28.6139, lng: 77.209 },
];

interface PlacesScannerProps {
  center: { lat: number; lng: number };
  category: FacilityCategory;
  language: Language;
  searchAreaQuery: string;
  onAreaResolved: (coords: { lat: number; lng: number }, label: string) => void;
  onResults: (places: NearbyFacility[]) => void;
  onLoading: (loading: boolean) => void;
  onError: (err: string | null) => void;
}

const PlacesNearbyScanner: React.FC<PlacesScannerProps> = ({
  center,
  category,
  language,
  searchAreaQuery,
  onAreaResolved,
  onResults,
  onLoading,
  onError,
}) => {
  const map = useMap();
  const placesLib = useMapsLibrary('places');

  // Resolve custom typed area/city/pincode when searchAreaQuery changes
  useEffect(() => {
    if (!searchAreaQuery || !placesLib || !placesLib.Place) return;
    let active = true;

    const resolveLocationText = async () => {
      try {
        const { places } = await placesLib.Place.searchByText({
          textQuery: searchAreaQuery,
          fields: ['displayName', 'formattedAddress', 'location'],
          maxResultCount: 1,
          region: 'IN',
        });
        if (!active) return;
        const match = places?.[0];
        if (match && match.location) {
          const lat =
            typeof match.location.lat === 'function'
              ? match.location.lat()
              : Number(match.location.lat);
          const lng =
            typeof match.location.lng === 'function'
              ? match.location.lng()
              : Number(match.location.lng);
          if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
            onAreaResolved(
              { lat, lng },
              match.displayName || match.formattedAddress || searchAreaQuery
            );
          }
        }
      } catch (e) {
        console.warn('Area search fallback:', e);
      }
    };

    resolveLocationText();
    return () => {
      active = false;
    };
  }, [searchAreaQuery, placesLib, onAreaResolved]);

  const fetchNearbyFacilities = useCallback(async () => {
    if (!placesLib || !placesLib.Place) return;
    onLoading(true);
    onError(null);

    try {
      const request = {
        fields: [
          'id',
          'displayName',
          'formattedAddress',
          'location',
          'rating',
          'userRatingCount',
          'primaryType',
          'nationalPhoneNumber',
          'googleMapsURI',
        ],
        locationRestriction: {
          center,
          radius: 5000,
        },
        includedPrimaryTypes: [category],
        maxResultCount: 14,
        language: language === 'mr' ? 'mr' : language === 'hi' ? 'hi' : 'en',
        region: 'IN',
      };

      let mapped: NearbyFacility[] = [];

      if (placesLib.Place && typeof (placesLib.Place as any).searchNearby === 'function') {
        try {
          const { places } = await (placesLib.Place as any).searchNearby(request);
          if (places && places.length > 0) {
            mapped = (places || [])
              .filter((p: any) => p.location)
              .map((p: any) => ({
                id: p.id || `${Math.random()}`,
                displayName: p.displayName || 'Medical Facility',
                formattedAddress: p.formattedAddress || '',
                location: {
                  lat:
                    typeof p.location?.lat === 'function'
                      ? p.location.lat()
                      : Number(p.location?.lat || center.lat),
                  lng:
                    typeof p.location?.lng === 'function'
                      ? p.location.lng()
                      : Number(p.location?.lng || center.lng),
                },
                rating: p.rating ?? undefined,
                userRatingCount: p.userRatingCount ?? undefined,
                primaryType: p.primaryType ?? category,
                nationalPhoneNumber: p.nationalPhoneNumber ?? undefined,
                googleMapsURI: p.googleMapsURI ?? undefined,
              }));
          }
        } catch (placeErr) {
          console.warn('Place.searchNearby failed, attempting PlacesService fallback:', placeErr);
        }
      }

      // Seamless fallback to PlacesService
      if (mapped.length === 0 && map && placesLib.PlacesService) {
        try {
          const service = new placesLib.PlacesService(map);
          const legacyType = category === 'hospital' ? 'hospital' : category === 'pharmacy' ? 'pharmacy' : 'doctor';
          mapped = await new Promise<NearbyFacility[]>((resolve) => {
            service.nearbySearch(
              {
                location: center,
                radius: 5000,
                type: legacyType,
              },
              (results: any[] | null, status: any) => {
                if (status === placesLib.PlacesServiceStatus.OK && results) {
                  resolve(
                    results.map((r: any) => ({
                      id: r.place_id || `${Math.random()}`,
                      displayName: r.name || 'Medical Facility',
                      formattedAddress: r.vicinity || '',
                      location: {
                        lat: r.geometry?.location?.lat() || center.lat,
                        lng: r.geometry?.location?.lng() || center.lng,
                      },
                      rating: r.rating,
                      userRatingCount: r.user_ratings_total,
                      primaryType: category,
                      googleMapsURI: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.name || '')}&query_place_id=${r.place_id || ''}`,
                    }))
                  );
                } else {
                  resolve([]);
                }
              }
            );
          });
        } catch (legacyErr) {
          console.warn('PlacesService search error:', legacyErr);
        }
      }

      onResults(mapped);
    } catch (err: unknown) {
      console.error('Nearby medical search error:', err);
      onError(
        language === 'mr'
          ? 'जवळपासची रुग्णालये शोधताना त्रुटी आली. कृपया आपले नेटवर्क किंवा API तपासा.'
          : language === 'hi'
          ? 'आस-पास के अस्पताल खोजने में समस्या आई। कृपया नेटवर्क या API जांचें।'
          : 'Unable to load nearby medical facilities. Please check your network or API quota.'
      );
      onResults([]);
    } finally {
      onLoading(false);
    }
  }, [placesLib, center, category, language, onResults, onLoading, onError]);

  useEffect(() => {
    if (map) {
      map.panTo(center);
    }
    fetchNearbyFacilities();
  }, [center, category, map, fetchNearbyFacilities]);

  return null;
};

export const EmergencyMapSection: React.FC<{
  language: Language;
  seniorMode: boolean;
}> = ({ language, seniorMode }) => {
  const [apiKey, setApiKey] = useState<string>(() => {
    if (typeof window !== 'undefined' && (window as any).__GOOGLE_MAPS_API_KEY__) {
      return ((window as any).__GOOGLE_MAPS_API_KEY__ || '').trim();
    }
    return (
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
      'AIzaSyAXGEIQHjxA80u_45FzLWMbk1S3y589WYg'
    ).trim();
  });

  const [authError, setAuthError] = useState<string | null>(null);

  // Fallback runtime key retrieval & authentication error listener
  useEffect(() => {
    if (!apiKey) {
      fetch('/api/maps-config')
        .then((res) => res.json())
        .then((data) => {
          if (data && data.apiKey) {
            setApiKey(data.apiKey.trim());
          }
        })
        .catch((err) => console.warn('Could not fetch maps config:', err));
    }

    const prevAuthFailure = (window as any).gm_authFailure;
    (window as any).gm_authFailure = () => {
      console.error('Google Maps Platform authentication error');
      setAuthError(
        'Google Maps authentication failed. If you have restricted your API key by HTTP referrers, please ensure your deployed domain is authorized in the Google Cloud Console.'
      );
      if (typeof prevAuthFailure === 'function') prevAuthFailure();
    };

    return () => {
      (window as any).gm_authFailure = prevAuthFailure;
    };
  }, [apiKey]);

  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: 18.5204,
    lng: 73.8567,
  });
  const [activeLocationLabel, setActiveLocationLabel] = useState<string>('Pune, Maharashtra');
  const [locationSource, setLocationSource] = useState<'gps' | 'network' | 'preset'>('preset');
  const [category, setCategory] = useState<FacilityCategory>('hospital');
  const [facilities, setFacilities] = useState<NearbyFacility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<NearbyFacility | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [locatingGps, setLocatingGps] = useState(false);
  const [areaInput, setAreaInput] = useState('');
  const [submittedAreaQuery, setSubmittedAreaQuery] = useState('');

  // Multi-stage GPS + Network IP Location Detector (works even when iframe blocks hardware GPS)
  const detectUserLocation = useCallback(async () => {
    setLocatingGps(true);
    setErrorMsg(null);

    const getBrowserPosition = (highAccuracy: boolean): Promise<GeolocationPosition> =>
      new Promise((resolve, reject) => {
        if (!('geolocation' in navigator)) {
          reject(new Error('Geolocation not available'));
          return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: highAccuracy,
          timeout: highAccuracy ? 5000 : 4000,
          maximumAge: 120000,
        });
      });

    try {
      // Stage 1: Try High-Accuracy GPS first
      const pos = await getBrowserPosition(true);
      setCenter({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
      setActiveLocationLabel(
        `GPS (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`
      );
      setLocationSource('gps');
      setLocatingGps(false);
      return;
    } catch {
      // Stage 2: Try Fast Wi-Fi / Cellular Browser Location
      try {
        const posLow = await getBrowserPosition(false);
        setCenter({
          lat: posLow.coords.latitude,
          lng: posLow.coords.longitude,
        });
        setActiveLocationLabel(
          `GPS (${posLow.coords.latitude.toFixed(4)}, ${posLow.coords.longitude.toFixed(4)})`
        );
        setLocationSource('gps');
        setLocatingGps(false);
        return;
      } catch {
        // Stage 3: Fallback to Server IP Geolocation so iframe/desktop users always get located
        try {
          const res = await fetch('/api/ip-location');
          if (res.ok) {
            const data = await res.json();
            if (typeof data.lat === 'number' && typeof data.lng === 'number') {
              setCenter({ lat: data.lat, lng: data.lng });
              setActiveLocationLabel(
                `${data.city || 'Current Area'}${data.region ? `, ${data.region}` : ''} (${data.lat.toFixed(3)}, ${data.lng.toFixed(3)})`
              );
              setLocationSource('network');
              setLocatingGps(false);
              return;
            }
          }
        } catch (ipErr) {
          console.warn('IP geolocation fallback error:', ipErr);
        }
      }
    }

    setLocatingGps(false);
  }, []);

  // Automatically detect location on initial mount
  useEffect(() => {
    detectUserLocation();
  }, [detectUserLocation]);

  const handleAreaSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!areaInput.trim()) return;
    setSubmittedAreaQuery(areaInput.trim());
  };

  const handleAreaResolved = useCallback(
    (coords: { lat: number; lng: number }, label: string) => {
      setCenter(coords);
      setActiveLocationLabel(label);
      setLocationSource('preset');
    },
    []
  );

  const labels = {
    en: {
      title: 'Live Emergency Medical & Pharmacy Locator',
      subtitle: 'Find verified nearby hospitals, clinics, and 24x7 pharmacies powered by Google Maps Platform.',
      hospitals: 'Hospitals',
      clinics: 'Clinics & Doctors',
      pharmacies: 'Pharmacies',
      useGps: 'Locate Near Me (GPS)',
      locating: 'Detecting GPS...',
      searchPlaceholder: 'Enter area, pincode, or city (e.g., Kothrud Pune, Dadar, Nashik)...',
      searchBtn: 'Find Area',
      activeLocPrefix: 'Active Location:',
      emergencyBanner: 'Medical Emergency? Dial 108 (Ambulance) or 112 Immediately',
      openInMaps: 'Directions in Google Maps',
      callFacility: 'Call Facility',
      resultsHeading: 'Nearby Medical Facilities',
      noResults: 'No facilities found in this radius. Try searching your area or switching category.',
    },
    hi: {
      title: 'लाइव आपातकालीन अस्पताल और फार्मेसी मैप',
      subtitle: 'Google Maps के माध्यम से अपने आस-पास के अस्पताल, क्लिनिक और 24x7 मेडिकल स्टोर खोजें।',
      hospitals: 'अस्पताल (Hospitals)',
      clinics: 'क्लिनिक और डॉक्टर',
      pharmacies: 'दवा दुकान (Pharmacy)',
      useGps: 'मेरी वर्तमान लोकेशन (GPS)',
      locating: 'GPS लोकेशन खोजी जा रही है...',
      searchPlaceholder: 'अपना इलाका, पिनकोड या शहर लिखें (जैसे: कोथरूड पुणे, दादर, नासिक)...',
      searchBtn: 'क्षेत्र खोजें',
      activeLocPrefix: 'सक्रिय लोकेशन:',
      emergencyBanner: 'आपातकालीन स्थिति? तुरंत 108 (एम्बुलेंस) या 112 पर कॉल करें',
      openInMaps: 'Google Maps में रास्ता देखें',
      callFacility: 'कॉल करें',
      resultsHeading: 'नजदीकी चिकित्सा केंद्र',
      noResults: 'इस क्षेत्र में कोई केंद्र नहीं मिला। कृपया अपना इलाका खोजें या दूसरा शहर चुनें।',
    },
    mr: {
      title: 'लाईव्ह आपत्कालीन रुग्णालय आणि मेडिकल स्टोअर मॅप',
      subtitle: 'Google Maps द्वारे तुमच्या जवळचे रुग्णालय, क्लिनिक आणि २४ तास सुरू असणारे मेडिकल स्टोअर शोधा.',
      hospitals: 'रुग्णालये (Hospitals)',
      clinics: 'क्लिनिक आणि डॉक्टर',
      pharmacies: 'मेडिकल स्टोअर (Pharmacy)',
      useGps: 'माझे सध्याचे लोकेशन (GPS)',
      locating: 'GPS लोकेशन शोधत आहे...',
      searchPlaceholder: 'तुमचा परिसर, पिनकोड किंवा शहर टाका (उदा. कोथरूड पुणे, दादर, नाशिक)...',
      searchBtn: 'परिसर शोधा',
      activeLocPrefix: 'सध्याचे लोकेशन:',
      emergencyBanner: 'वैद्यकीय आणीबाणी? तात्काळ १०८ (रुग्णवाहिका) किंवा ११२ वर कॉल करा',
      openInMaps: 'Google Maps वर मार्ग पहा',
      callFacility: 'कॉल करा',
      resultsHeading: 'जवळपासची वैद्यकीय केंद्रे',
      noResults: 'या परिसरात कोणतेही केंद्र सापडले नाही. कृपया वर तुमचा परिसर शोधा किंवा दुसरे शहर निवडा.',
    },
  }[language];

  return (
    <div className="space-y-6">
      {/* Emergency Red Alert Strip */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-900">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-6 h-6 text-red-600 shrink-0" />
          <div>
            <p className={`font-semibold ${seniorMode ? 'text-lg' : 'text-base'}`}>
              {labels.emergencyBanner}
            </p>
            <p className="text-xs text-red-700 mt-0.5">
              24/7 Toll-Free National Emergency Response System · Cardiac & Trauma Support
            </p>
          </div>
        </div>
        <a
          href="tel:108"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors whitespace-nowrap shrink-0"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Dial 108</span>
        </a>
      </div>

      {/* Controls Bar */}
      <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className={`font-semibold text-slate-900 ${seniorMode ? 'text-2xl' : 'text-xl'}`}>
              {labels.title}
            </h2>
            <p className={`text-slate-600 mt-1 ${seniorMode ? 'text-base' : 'text-sm'}`}>
              {labels.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {labels.activeLocPrefix} <strong>{activeLocationLabel}</strong>
                {locationSource === 'gps' ? ' (Live GPS)' : locationSource === 'network' ? ' (Auto-Detected)' : ''}
              </span>
            </div>

            <button
              type="button"
              onClick={detectUserLocation}
              disabled={locatingGps}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-teal-700 text-white text-sm font-semibold hover:bg-teal-800 transition-colors whitespace-nowrap cursor-pointer"
            >
              <Compass className={`w-4 h-4 ${locatingGps ? 'animate-spin' : ''}`} />
              <span>{locatingGps ? labels.locating : labels.useGps}</span>
            </button>
          </div>
        </div>

        {/* Custom Area / Pincode / City Search Bar */}
        <form onSubmit={handleAreaSearchSubmit} className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={areaInput}
              onChange={(e) => setAreaInput(e.target.value)}
              placeholder={labels.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-teal-700"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
          >
            {labels.searchBtn}
          </button>
        </form>

        {/* Filter Tabs & City Presets */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg self-start">
            <button
              type="button"
              onClick={() => setCategory('hospital')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                category === 'hospital'
                  ? 'bg-white text-teal-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4 text-red-600" />
              <span>{labels.hospitals}</span>
            </button>
            <button
              type="button"
              onClick={() => setCategory('doctor')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                category === 'doctor'
                  ? 'bg-white text-teal-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Stethoscope className="w-4 h-4 text-teal-600" />
              <span>{labels.clinics}</span>
            </button>
            <button
              type="button"
              onClick={() => setCategory('pharmacy')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                category === 'pharmacy'
                  ? 'bg-white text-teal-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Pill className="w-4 h-4 text-emerald-600" />
              <span>{labels.pharmacies}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {CITY_PRESETS.map((city) => (
              <button
                key={city.name.en}
                type="button"
                onClick={() => {
                  setCenter({ lat: city.lat, lng: city.lng });
                  setActiveLocationLabel(city.name[language]);
                  setLocationSource('preset');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap cursor-pointer ${
                  Math.abs(center.lat - city.lat) < 0.05 && Math.abs(center.lng - city.lng) < 0.05
                    ? 'border-teal-600 bg-teal-50 text-teal-900 font-semibold'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {city.name[language]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {authError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-sm flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Google Maps Configuration Notice</p>
            <p>{authError}</p>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Map + Live Places List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden h-[480px] relative">
          {apiKey ? (
            <APIProvider
              apiKey={apiKey}
              libraries={['places', 'marker']}
              language={language}
              region="IN"
            >
              <Map
                defaultCenter={center}
                defaultZoom={14}
                mapId="DEMO_MAP_ID"
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                gestureHandling="greedy"
                className="w-full h-full"
              >
                <PlacesNearbyScanner
                  center={center}
                  category={category}
                  language={language}
                  searchAreaQuery={submittedAreaQuery}
                  onAreaResolved={handleAreaResolved}
                  onResults={setFacilities}
                  onLoading={setLoading}
                  onError={setErrorMsg}
                />

                {/* User Reference Marker */}
                <AdvancedMarker position={center} title="Your Active Location">
                  <div className="px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold shadow-md border-2 border-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>You / Search Center</span>
                  </div>
                </AdvancedMarker>

                {/* Facility Advanced Markers */}
                {facilities.map((fac) => (
                  <AdvancedMarker
                    key={fac.id}
                    position={fac.location}
                    title={fac.displayName}
                    onClick={() => setSelectedFacility(fac)}
                  >
                    <div
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold shadow-sm border transition-transform ${
                        selectedFacility?.id === fac.id
                          ? 'bg-teal-800 text-white border-teal-950 scale-110'
                          : category === 'hospital'
                          ? 'bg-red-600 text-white border-red-800'
                          : category === 'pharmacy'
                          ? 'bg-emerald-600 text-white border-emerald-800'
                          : 'bg-teal-600 text-white border-teal-800'
                      }`}
                    >
                      {fac.displayName.slice(0, 18)}
                    </div>
                  </AdvancedMarker>
                ))}
              </Map>
            </APIProvider>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-500 gap-2">
              <Compass className="w-8 h-8 text-teal-600 animate-spin" />
              <p className="text-sm font-medium">Initializing Google Maps...</p>
            </div>
          )}
        </div>

        {/* Facility Results Directory */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 flex flex-col h-[480px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900 text-base">
              {labels.resultsHeading} ({facilities.length})
            </h3>
            {loading && (
              <span className="text-xs text-teal-700 font-medium">Loading live places...</span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 pr-1 mt-2">
            {facilities.length === 0 && !loading ? (
              <div className="py-12 text-center text-slate-500 text-sm">{labels.noResults}</div>
            ) : (
              facilities.map((fac) => (
                <div
                  key={fac.id}
                  onClick={() => setSelectedFacility(fac)}
                  className={`py-3.5 px-3 rounded-lg cursor-pointer transition-colors ${
                    selectedFacility?.id === fac.id ? 'bg-teal-50/70' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className={`font-semibold text-slate-900 ${seniorMode ? 'text-lg' : 'text-sm'}`}>
                      {fac.displayName}
                    </h4>
                    {fac.rating && (
                      <span className="text-xs font-mono tabular-nums text-amber-700 shrink-0">
                        ★ {fac.rating.toFixed(1)} ({fac.userRatingCount || 0})
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{fac.formattedAddress}</span>
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-2.5">
                    {fac.googleMapsURI && (
                      <a
                        href={fac.googleMapsURI}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:underline"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>{labels.openInMaps}</span>
                      </a>
                    )}
                    {fac.nationalPhoneNumber && (
                      <a
                        href={`tel:${fac.nationalPhoneNumber}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-slate-900"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span className="font-mono tabular-nums">{fac.nationalPhoneNumber}</span>
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
