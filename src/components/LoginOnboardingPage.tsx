import React, { useState } from 'react';
import { Language } from '../i18n/translations';
import {
  Phone,
  UserCheck,
  ShieldCheck,
  HeartPulse,
  Stethoscope,
  Dumbbell,
  MapPin,
  Lock,
  Volume2,
  VolumeX,
  Eye,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  LogIn,
  Building2,
  Users,
  Award,
  Mail,
  KeyRound,
} from 'lucide-react';

export type LoginCategory = 'user' | 'doctor' | 'community_head';

export interface PatientLoginPayload {
  loginCategory: LoginCategory;
  email: string;
  password?: string;
  displayName: string;
  contactNumber: string;
  age: number;
  bloodGroup: string;
  authMethod: 'password' | 'google' | 'direct';
  // Doctor-specific optional metadata
  doctorSpecialty?: string;
  doctorClinic?: string;
  // Community Project Head optional metadata
  communityWard?: string;
  communityDesignation?: string;
}

interface LoginOnboardingPageProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  seniorMode: boolean;
  onToggleSeniorMode: () => void;
  initialCategory?: LoginCategory;
  initialEmail?: string;
  initialName?: string;
  initialContact?: string;
  initialAge?: number;
  initialBloodGroup?: string;
  isSpeaking: boolean;
  onSpeakText: (text: string) => void;
  onStopSpeaking: () => void;
  onCompleteLogin: (payload: PatientLoginPayload) => Promise<void>;
}

const BLOOD_GROUPS = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

export const LoginOnboardingPage: React.FC<LoginOnboardingPageProps> = ({
  language,
  onLanguageChange,
  seniorMode,
  onToggleSeniorMode,
  initialCategory = 'user',
  initialEmail = '',
  initialName = '',
  initialContact = '',
  initialAge = 64,
  initialBloodGroup = 'O+',
  isSpeaking,
  onSpeakText,
  onStopSpeaking,
  onCompleteLogin,
}) => {
  const [loginCategory, setLoginCategory] = useState<LoginCategory>(initialCategory);
  const [email, setEmail] = useState<string>(initialEmail);
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState(initialName);
  const [countryCode, setCountryCode] = useState('+91');
  const [rawPhone, setRawPhone] = useState(
    initialContact.replace(/^\+\d+\s*/, '').trim()
  );
  const [age, setAge] = useState<number>(initialAge);
  const [bloodGroup, setBloodGroup] = useState<string>(initialBloodGroup);

  // Doctor category fields
  const [doctorSpecialty, setDoctorSpecialty] = useState<string>(
    'Family Physician & Internal Medicine (MBBS, MD)'
  );
  const [doctorClinic, setDoctorClinic] = useState<string>(
    'Patil Community Clinic, Kothrud, Pune'
  );

  // Community Project Head category fields
  const [communityWard, setCommunityWard] = useState<string>(
    'Ward 12 — Kothrud & Karve Nagar Health Zone'
  );
  const [communityDesignation, setCommunityDesignation] = useState<string>(
    'Community Health Project Head'
  );

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const copy = {
    en: {
      navOverview: 'App Overview',
      navModules: '7 Health Modules',
      navAgeCare: 'Age-Wise Care',
      navSecurity: 'Privacy & Vault',
      seniorBtn: 'Senior Large Text',
      listenIntroBtn: 'Listen App Info (Female Voice)',
      stopAudioBtn: 'Stop Audio',
      kicker: 'Preventive Healthcare · AI Triage · Multilingual Senior Care',
      heroTitle:
        'Proactive Daily Health Tracking, AI Triage & Age-Wise Preventive Care for Your Community',
      heroDescription:
        'Preventia connects Citizens/Patients, Doctors, and Community Project Heads on a unified multilingual platform to monitor daily vitals, follow age-specific diet and yoga routines, check symptoms with clinical AI, conduct live tele-consultations, and coordinate community preventive health drives.',
      emergencyStrip: '24/7 Medical Emergency Helpline: Dial 108 (Ambulance) or 112',
      selectCategoryLabel: 'Select Login Category *',
      categories: {
        user: {
          tabLabel: 'User / Patient',
          badge: 'Category 1 · Citizen & Patient Health Portal',
          title: 'User / Patient Login Board',
          subtitle:
            'Enter your verified email, password, and mobile number to track daily BP/Sugar, check symptoms, consult your doctor, and access age-wise care.',
          nameLabel: 'Patient / User Full Name *',
          namePlaceholder: 'e.g., Ramesh Kulkarni',
          contactLabel: 'User Contact Number (Mobile / WhatsApp / SOS) *',
          contactHelper:
            'Used for doctor call identification, medication alerts & emergency SOS.',
          primaryBtn: 'Login / Register as User & Open Dashboard',
        },
        doctor: {
          tabLabel: 'Doctor',
          badge: 'Category 2 · Medical Practitioner & Telemedicine Console',
          title: 'Doctor Login Board',
          subtitle:
            'Login with your doctor email and registered number to receive live patient calls, review vitals, reply to consultations, and manage appointments.',
          nameLabel: 'Doctor Full Name *',
          namePlaceholder: 'e.g., Dr. Vivek Patil, MBBS, MD',
          contactLabel: 'Doctor Contact / Telemedicine Receiver Number *',
          contactHelper:
            'Patients who add your number can call and message your live console directly.',
          specialtyLabel: 'Medical Specialty & Qualification *',
          specialtyPlaceholder: 'e.g., Family Physician, Cardiologist, Diabetologist',
          clinicLabel: 'Clinic / Hospital Name & Location *',
          clinicPlaceholder: 'e.g., Patil Clinic, Kothrud, Pune',
          primaryBtn: 'Login / Register as Doctor & Open Console',
        },
        community_head: {
          tabLabel: 'Community Project Head',
          badge: 'Category 3 · Community Health Project Head & Ward Coordinator',
          title: 'Community Project Head Login',
          subtitle:
            'Coordinate ward-level preventive health camps, monitor senior citizen outreach, schedule immunization drives, and broadcast health advisories.',
          nameLabel: 'Project Head Full Name *',
          namePlaceholder: 'e.g., Sunita Deshmukh',
          contactLabel: 'Official Coordinator Contact Number *',
          contactHelper:
            'Displayed on community health camp notices and emergency coordination channels.',
          wardLabel: 'Community Ward / Health Zone / Area *',
          wardPlaceholder: 'e.g., Ward 12 — Kothrud Health Zone, Pune',
          designationLabel: 'Role / Organization / Health Mission *',
          designationPlaceholder: 'e.g., Community Project Head · Preventive Health Mission',
          primaryBtn: 'Login / Register as Project Head & Open Hub',
        },
      },
      emailLabel: 'Email ID (Permanent User ID & Database Security) *',
      emailPlaceholder: 'e.g. name@example.com',
      emailHelper: 'Every login and health update is securely stored in our Firestore database tied to your email ID.',
      passwordLabel: 'Password *',
      passwordPlaceholder: 'Enter account password (min 6 characters)',
      showPassword: 'Show',
      hidePassword: 'Hide',
      dbSecurityBadge: 'Firestore DB & Email ID Secured',
      dbSecurityDesc: 'Zero-trust Firestore security rules strictly isolate all records to your authenticated Email ID. Every login event is logged to your database history.',
      contactPlaceholder: '10-digit mobile number (e.g. 9876543210)',
      ageLabel: 'Age (Years) *',
      bloodGroupLabel: 'Blood Group',
      primaryEmailBtn: 'Secure Login / Register with Email & Password',
      loginGoogleBtn: 'Sign In with Google (Verified Email ID)',
      submittingText: 'Authenticating & Syncing Database...',
      errNameRequired: 'Please enter your full name to continue.',
      errEmailRequired: 'Please enter your email address.',
      errEmailInvalid: 'Please enter a valid email address (e.g., user@example.com).',
      errPasswordShort: 'Password must be at least 6 characters.',
      errPhoneInvalid:
        'Please enter a valid 10-digit mobile contact number (digits only, e.g., 9876543210).',
      aboutHeading: '01. What Is Inside Preventia? Complete 7-Module Health Platform',
      aboutSubheading:
        'Designed for Users, Doctors, and Community Project Heads in English, Hindi, and Marathi with female voice read-aloud support.',
      modules: [
        {
          num: '01',
          title: 'Daily Vitals, Sleep & Medication Tracker',
          desc: 'Log systolic/diastolic blood pressure, fasting blood sugar, heart rate, sleep quality, daily hydration, and mark daily medicines or vaccinations as completed.',
          meta: 'Real-Time Cloud Sync · Tabular History',
        },
        {
          num: '02',
          title: 'AI Symptom Triage & Early Warning Guidance',
          desc: 'Describe symptoms in English, Hindi, or Marathi to receive structured urgency triage (Routine, Consult Soon, or Emergency), home-care advice, and doctor specialist recommendations.',
          meta: 'Clinical Triage AI · Voice Read-Aloud',
        },
        {
          num: '03',
          title: 'Disease Prevention & Age-Wise Diet Library',
          desc: 'Evidence-based early symptoms, daily preventive care protocols, and customized nutrition plans for Children (0–18), Adults (19–59), and Seniors (60+).',
          meta: 'Hypertension · Diabetes · Cardiac · Bone Health',
        },
        {
          num: '04',
          title: 'Exercise, Chair Yoga & Pranayama Guide',
          desc: 'Step-by-step instructions for post-meal Shatpavali, senior Chair Yoga, Anulom-Vilom Pranayama, and age-wise weekly movement schedules.',
          meta: 'Step-by-Step Safety · Female Voice Audio',
        },
        {
          num: '05',
          title: 'Doctor Telemedicine Call & Community Health Camps',
          desc: 'Call or message added regular/related doctors with live voice & video, while Community Project Heads organize local screening camps and vaccination drives.',
          meta: 'Live Voice/Video Call · Ward Health Drives',
        },
        {
          num: '06',
          title: 'Live GPS Hospital & 24x7 Pharmacy Map + AES-256 Vault',
          desc: 'Auto-detect your location via GPS or search any pincode/area to find nearby hospitals and pharmacies on Google Maps, plus lock lab reports in an encrypted vault.',
          meta: 'Google Maps Places · AES-GCM 256-Bit Vault',
        },
      ],
      ageSectionTitle: '02. How Preventia Adapts to Your Age Group & Community Role',
      ageCards: [
        {
          bracket: 'Users & Families (Children, Adults & Seniors 60+)',
          focus: 'Daily BP/Sugar logs, immunization schedules, Senior Chair Yoga, female voice read-aloud, and direct calls to family doctors.',
        },
        {
          bracket: 'Doctors & Medical Specialists',
          focus: 'Live incoming patient call receiver, real-time patient BP/Sugar telemetry during calls, instant prescription replies, and appointment management.',
        },
        {
          bracket: 'Community Project Heads & Coordinators',
          focus: 'Organize ward-level BP/Diabetes checkup camps, track senior citizen health outreach, and broadcast multilingual preventive advisories.',
        },
      ],
      privacyTitle: '03. Why We Collect Your Contact Number & How Your Privacy Is Protected',
      privacyPoints: [
        'Role-Based Coordination: Your contact number links patients with their trusted doctors and enables community health camp notifications.',
        'Strict Tenant Isolation: Your contact number and health logs are isolated inside your private account and protected by zero-trust database rules.',
        'Client-Side AES-256 Medical Vault: Sensitive prescriptions and downloadable PDF doctor summaries are encrypted in your browser.',
      ],
    },
    hi: {
      navOverview: 'ऐप परिचय',
      navModules: '7 स्वास्थ्य सुविधाएं',
      navAgeCare: 'श्रेणी और देखभाल',
      navSecurity: 'सुरक्षा और गोपनीयता',
      seniorBtn: 'बड़े अक्षर (Senior Mode)',
      listenIntroBtn: 'ऐप की जानकारी महिला आवाज में सुनें',
      stopAudioBtn: 'आवाज रोकें',
      kicker: 'निवारक स्वास्थ्य सेवा · AI लक्षण जांच · वरिष्ठ नागरिक सुविधा',
      heroTitle:
        'नागरिकों, डॉक्टरों और कम्युनिटी प्रोजेक्ट हेड के लिए एकीकृत स्वास्थ्य और निवारक देखभाल मंच',
      heroDescription:
        'प्रिवेंटिया (Preventia) रोगियों/उपयोगकर्ताओं, डॉक्टरों और कम्युनिटी प्रोजेक्ट हेड को एक साथ जोड़ता है — दैनिक बीपी/शुगर ट्रैकिंग, AI लक्षण जांच, उम्र अनुसार आहार-योग, लाइव डॉक्टर कॉल और सामुदायिक स्वास्थ्य शिविर प्रबंधन के लिए।',
      emergencyStrip: '24/7 आपातकालीन स्वास्थ्य हेल्पलाइन: 108 (एम्बुलेंस) या 112 डायल करें',
      selectCategoryLabel: 'अपनी लॉगिन श्रेणी चुनें (Select Category) *',
      categories: {
        user: {
          tabLabel: 'उपयोगकर्ता / रोगी (User)',
          badge: 'श्रेणी 1 · नागरिक और रोगी स्वास्थ्य पोर्टल',
          title: 'उपयोगकर्ता / रोगी लॉगिन बोर्ड',
          subtitle:
            'दैनिक बीपी/शुगर, AI लक्षण जांच और डॉक्टर परामर्श के लिए अपनी सत्यापित ईमेल आईडी व पासवर्ड से लॉगिन करें।',
          nameLabel: 'उपयोगकर्ता / रोगी का पूरा नाम *',
          namePlaceholder: 'उदा. रमेश कुलकर्णी',
          contactLabel: 'मोबाइल नंबर (Contact No. / WhatsApp) *',
          contactHelper:
            'डॉक्टर कॉल, अपॉइंटमेंट और आपातकालीन SOS सहायता के लिए आवश्यक।',
          primaryBtn: 'उपयोगकर्ता के रूप में लॉगिन / रजिस्टर करें',
        },
        doctor: {
          tabLabel: 'डॉक्टर (Doctor)',
          badge: 'श्रेणी 2 · डॉक्टर और टेलीमेडिसिन कंसोल',
          title: 'डॉक्टर लॉगिन बोर्ड',
          subtitle:
            'रोगियों के लाइव कॉल रिसीव करने, बीपी/शुगर देखने और परामर्श देने के लिए डॉक्टर ईमेल आईडी से लॉगिन करें।',
          nameLabel: 'डॉक्टर का पूरा नाम *',
          namePlaceholder: 'उदा. डॉ. विवेक पाटिल, MBBS, MD',
          contactLabel: 'डॉक्टर का संपर्क / टेलीमेडिसिन नंबर *',
          contactHelper:
            'रोगी इस नंबर से आपको सीधे ऐप में कॉल और संदेश भेज सकेंगे।',
          specialtyLabel: 'विशेषज्ञता और डिग्री (Specialty) *',
          specialtyPlaceholder: 'उदा. फैमिली फिजिशियन, कार्डियोलॉजिस्ट',
          clinicLabel: 'क्लिनिक / अस्पताल का नाम और पता *',
          clinicPlaceholder: 'उदा. पाटिल क्लिनिक, कोथरूड, पुणे',
          primaryBtn: 'डॉक्टर कंसोल में लॉगिन / रजिस्टर करें',
        },
        community_head: {
          tabLabel: 'कम्युनिटी प्रोजेक्ट हेड',
          badge: 'श्रेणी 3 · सामुदायिक स्वास्थ्य प्रोजेक्ट प्रमुख',
          title: 'कम्युनिटी प्रोजेक्ट हेड लॉगिन',
          subtitle:
            'सामुदायिक स्वास्थ्य शिविर, टीकाकरण अभियान और स्वास्थ्य जागरूकता सूचनाएं प्रबंधित करने के लिए लॉगिन करें।',
          nameLabel: 'प्रोजेक्ट हेड का पूरा नाम *',
          namePlaceholder: 'उदा. सुनीता देशमुख',
          contactLabel: 'आधिकारिक संपर्क नंबर *',
          contactHelper:
            'स्वास्थ्य शिविर और सामुदायिक अभियान समन्वय के लिए प्रदर्शित किया जाएगा।',
          wardLabel: 'वार्ड / सामुदायिक क्षेत्र (Ward / Zone) *',
          wardPlaceholder: 'उदा. वार्ड 12 — कोथरूड स्वास्थ्य क्षेत्र, पुणे',
          designationLabel: 'पद / संस्था / स्वास्थ्य मिशन *',
          designationPlaceholder: 'उदा. कम्युनिटी प्रोजेक्ट हेड · स्वास्थ्य अभियान',
          primaryBtn: 'प्रोजेक्ट हेड कमांड सेंटर खोलें',
        },
      },
      emailLabel: 'ईमेल आईडी (डेटाबेस सुरक्षा व पहचान) *',
      emailPlaceholder: 'उदा. name@example.com',
      emailHelper: 'आपका हर लॉगिन और स्वास्थ्य रिकॉर्ड इस ईमेल आईडी के साथ डेटाबेस में सुरक्षित रहेगा।',
      passwordLabel: 'पासवर्ड (Password) *',
      passwordPlaceholder: 'सुरक्षित पासवर्ड दर्ज करें (कम से कम 6 अक्षर)',
      showPassword: 'दिखाएं',
      hidePassword: 'छिपाएं',
      dbSecurityBadge: 'डेटाबेस व ईमेल द्वारा सुरक्षित',
      dbSecurityDesc: 'फ़ायरबेस ज़ीरो-ट्रस्ट सुरक्षा यह सुनिश्चित करती है कि केवल आप ही अपने रिकॉर्ड देख सकें।',
      contactPlaceholder: '10 अंकों का मोबाइल नंबर (उदा. 9876543210)',
      ageLabel: 'उम्र (वर्ष) *',
      bloodGroupLabel: 'ब्लड ग्रुप',
      primaryEmailBtn: 'ईमेल व पासवर्ड से लॉगिन / रजिस्टर करें',
      loginGoogleBtn: 'Google से साइन इन करें (सत्यापित ईमेल आईडी)',
      submittingText: 'डेटाबेस में सत्यापित व सुरक्षित हो रहा है...',
      errNameRequired: 'कृपया आगे बढ़ने के लिए अपना पूरा नाम लिखें।',
      errEmailRequired: 'कृपया अपनी ईमेल आईडी दर्ज करें।',
      errEmailInvalid: 'कृपया वैध ईमेल पता दर्ज करें (उदा. user@example.com)।',
      errPasswordShort: 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।',
      errPhoneInvalid:
        'कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें (जैसे: 9876543210)।',
      aboutHeading: '01. प्रिवेंटिया ऐप की 7 प्रमुख स्वास्थ्य सुविधाएं',
      aboutSubheading:
        'उपयोगकर्ता, डॉक्टर और कम्युनिटी प्रोजेक्ट हेड के लिए अंग्रेजी, हिंदी और मराठी में उपलब्ध।',
      modules: [
        {
          num: '01',
          title: 'दैनिक बीपी, शुगर, नींद और दवाई ट्रैकर',
          desc: 'प्रतिदिन ब्लड प्रेशर, फास्टिंग शुगर, पल्स, नींद के घंटे और पानी का हिसाब रखें तथा समय पर दवाइयों व टीकों के रिमाइंडर पाएं।',
          meta: 'क्लाउड सिंक · दैनिक स्वास्थ्य इतिहास',
        },
        {
          num: '02',
          title: 'AI लक्षण जांच और प्राथमिक मार्गदर्शन',
          desc: 'अंग्रेजी, हिंदी या मराठी में अपने लक्षण बताएं और तुरंत जानें कि घर पर क्या देखभाल करें और कब डॉक्टर से मिलें।',
          meta: 'मेडिकल AI ट्रायज · महिला आवाज सुविधा',
        },
        {
          num: '03',
          title: 'रोग निवारण और उम्र के अनुसार आहार पुस्तकालय',
          desc: 'बीपी, डायबिटीज, हृदय रोग और जोड़ों के दर्द के शुरुआती लक्षण, बचाव और बच्चों, वयस्कों व बुजुर्गों के लिए विशेष आहार।',
          meta: 'बच्चे (0–18) · वयस्क (19–59) · बुजुर्ग (60+)',
        },
        {
          num: '04',
          title: 'व्यायाम, चेयर योग और प्राणायाम मार्गदर्शिका',
          desc: 'बुजुर्गों के लिए सुरक्षित कुर्सी योग (Chair Yoga), भोजन के बाद शतपावली, अनुलोम-विलोम और उम्र अनुसार दैनिक कसरत तालिका।',
          meta: 'सुरक्षित विधि · महिला आवाज में निर्देश',
        },
        {
          num: '05',
          title: 'लाइव डॉक्टर कॉल और सामुदायिक स्वास्थ्य शिविर',
          desc: 'अपने नियमित डॉक्टर से लाइव वॉइस/वीडियो कॉल पर बात करें और कम्युनिटी प्रोजेक्ट हेड द्वारा आयोजित स्वास्थ्य शिविरों की जानकारी पाएं।',
          meta: 'लाइव डॉक्टर कॉल · स्वास्थ्य शिविर',
        },
        {
          num: '06',
          title: 'लाइव GPS अस्पताल मैप और एन्क्रिप्टेड मेडिकल वॉल्ट',
          desc: 'GPS या पिनकोड से अपने आस-पास के अस्पताल व 24x7 मेडिकल स्टोर खोजें और अपनी मेडिकल रिपोर्ट्स को AES-256 लॉक में सुरक्षित रखें।',
          meta: 'Google Maps · AES-256 सुरक्षित वॉल्ट',
        },
      ],
      ageSectionTitle: '02. तीनों श्रेणियों (User, Doctor, Project Head) के लिए विशेष सुविधाएं',
      ageCards: [
        {
          bracket: 'उपयोगकर्ता / रोगी (User / Patient)',
          focus: 'दैनिक बीपी/शुगर लॉग, टीकाकरण तालिका, चेयर योग, महिला आवाज में जानकारी और अपने फैमिली डॉक्टर से सीधा कॉल/चैट।',
        },
        {
          bracket: 'डॉक्टर (Doctor Console)',
          focus: 'मरीजों के इनकमिंग कॉल रिसीव करें, कॉल के दौरान लाइव बीपी/शुगर देखें, तुरंत सलाह भेजें और अपॉइंटमेंट प्रबंधित करें।',
        },
        {
          bracket: 'कम्युनिटी प्रोजेक्ट हेड (Project Head)',
          focus: 'वार्ड स्तर पर मुफ्त बीपी/शुगर जांच शिविर और टीकाकरण अभियान आयोजित करें तथा नागरिकों को स्वास्थ्य अलर्ट भेजें।',
        },
      ],
      privacyTitle: '03. हम आपका संपर्क नंबर क्यों लेते हैं और डेटा कैसे सुरक्षित रहता है?',
      privacyPoints: [
        'त्वरित समन्वय: आपका मोबाइल नंबर डॉक्टर कॉल, अपॉइंटमेंट और सामुदायिक स्वास्थ्य शिविर सूचनाओं को जोड़ता है।',
        'पूर्ण गोपनीयता: आपका संपर्क नंबर और स्वास्थ्य डेटा केवल आपके निजी खाते में सुरक्षित रहता है।',
        'AES-256 मेडिकल लॉक: आपके मेडिकल रिकॉर्ड्स और पीडीएफ रिपोर्ट आपके ब्राउज़र में सुरक्षित रहते हैं।',
      ],
    },
    mr: {
      navOverview: 'ॲपची माहिती',
      navModules: '७ आरोग्य सुविधा',
      navAgeCare: 'लॉगिन प्रकार व काळजी',
      navSecurity: 'सुरक्षितता आणि गोपनीयता',
      seniorBtn: 'मोठी अक्षरे (Senior Mode)',
      listenIntroBtn: 'ॲपची माहिती महिला आवाजात ऐका',
      stopAudioBtn: 'आवाज थांबवा',
      kicker: 'प्रतिबंधात्मक आरोग्य सेवा · AI लक्षणे तपासणी · ज्येष्ठ नागरिक सुलभ',
      heroTitle:
        'नागरिक (User), डॉक्टर आणि कम्युनिटी प्रोजेक्ट हेड यांच्यासाठी एकत्रित आरोग्य व प्रतिबंधात्मक काळजी व्यासपीठ',
      heroDescription:
        'प्रिव्हेंटिया (Preventia) द्वारे रुग्ण/नागरिक, डॉक्टर आणि कम्युनिटी प्रोजेक्ट हेड एकाच व्यासपीठावर जोडले जातात — दैनंदिन बीपी/शुगर नोंद, AI लक्षणे तपासणी, वयानुसार आहार व योगासने, डॉक्टरांशी थेट लाईव्ह कॉल आणि सामुदायिक आरोग्य शिबिरांचे नियोजन.',
      emergencyStrip: '२४ तास वैद्यकीय आणीबाणी हेल्पलाईन: १०८ (रुग्णवाहिका) किंवा ११२ वर कॉल करा',
      selectCategoryLabel: 'तुमचा लॉगिन प्रकार निवडा (Select Category) *',
      categories: {
        user: {
          tabLabel: 'वापरकर्ता / रुग्ण (User)',
          badge: 'प्रकार १ · नागरिक आणि रुग्ण आरोग्य पोर्टल',
          title: 'वापरकर्ता / रुग्ण लॉगिन बोर्ड',
          subtitle:
            'दैनिक बीपी/शुगर, AI लक्षणे तपासणी आणि फॅमिली डॉक्टर सल्ल्यासाठी तुमचा ईमेल व पासवर्डने लॉगिन करा.',
          nameLabel: 'वापरकर्त्याचे / रुग्णाचे पूर्ण नाव *',
          namePlaceholder: 'उदा. रमेश कुलकर्णी',
          contactLabel: 'संपर्क मोबाईल क्रमांक (Contact No. / WhatsApp) *',
          contactHelper:
            'डॉक्टरांना कॉल करण्यासाठी, अपॉइंटमेंटसाठी आणि आपत्कालीन SOS मदतीसाठी आवश्यक.',
          primaryBtn: 'वापरकर्ता म्हणून लॉगिन / नोंदणी करा',
        },
        doctor: {
          tabLabel: 'डॉक्टर (Doctor)',
          badge: 'प्रकार २ · डॉक्टर आणि टेलीमेडिसिन कन्सोल',
          title: 'डॉक्टर लॉगिन बोर्ड',
          subtitle:
            'रुग्णांचे लाईव्ह कॉल उचलण्यासाठी, बीपी/शुगर रिपोर्ट पाहण्यासाठी डॉक्टर ईमेल आयडीने लॉगिन करा.',
          nameLabel: 'डॉक्टरांचे पूर्ण नाव *',
          namePlaceholder: 'उदा. डॉ. विवेक पाटील, MBBS, MD',
          contactLabel: 'डॉक्टरांचा संपर्क / टेलीमेडिसिन क्रमांक *',
          contactHelper:
            'रुग्ण या नंबरवर तुम्हाला थेट ॲपमधून कॉल आणि मेसेज करू शकतील.',
          specialtyLabel: 'तज्ज्ञता आणि पदवी (Specialty) *',
          specialtyPlaceholder: 'उदा. फॅमिली फिजिशियन, हृदयरोग तज्ज्ञ',
          clinicLabel: 'क्लिनिक / हॉस्पिटलचे नाव आणि पत्ता *',
          clinicPlaceholder: 'उदा. पाटील क्लिनिक, कोथरूड, पुणे',
          primaryBtn: 'डॉक्टर म्हणून लॉगिन / नोंदणी करा',
        },
        community_head: {
          tabLabel: 'कम्युनिटी प्रोजेक्ट हेड',
          badge: 'प्रकार ३ · सामुदायिक आरोग्य प्रकल्प प्रमुख (Project Head)',
          title: 'कम्युनिटी प्रोजेक्ट हेड लॉगिन',
          subtitle:
            'आरोग्य तपासणी शिबिरे, लसीकरण मोहीम आणि आरोग्य उपक्रमांचे नियोजन करण्यासाठी लॉगिन करा.',
          nameLabel: 'प्रोजेक्ट हेडचे पूर्ण नाव *',
          namePlaceholder: 'उदा. सुनीता देशमुख',
          contactLabel: 'अधिकृत संपर्क मोबाईल क्रमांक *',
          contactHelper:
            'आरोग्य शिबिरांच्या सूचना आणि सामुदायिक समन्वयासाठी वापरला जाईल.',
          wardLabel: 'प्रभाग / कम्युनिटी झोन (Ward / Area) *',
          wardPlaceholder: 'उदा. प्रभाग १२ — कोथरूड आरोग्य विभाग, पुणे',
          designationLabel: 'पद / संस्था / आरोग्य अभियान *',
          designationPlaceholder: 'उदा. कम्युनिटी प्रोजेक्ट हेड · आरोग्य अभियान',
          primaryBtn: 'प्रोजेक्ट हेड म्हणून लॉगिन करा',
        },
      },
      emailLabel: 'ईमेल आयडी (डेटाबेस ओळख व सुरक्षितता) *',
      emailPlaceholder: 'उदा. name@example.com',
      emailHelper: 'तुमचा प्रत्येक लॉगिन आणि आरोग्य माहिती डेटाबेसमध्ये या ईमेल आयडीशी जोडली जाते.',
      passwordLabel: 'पासवर्ड (Password) *',
      passwordPlaceholder: 'सुरक्षित पासवर्ड टाका (किमान ६ अक्षरे)',
      showPassword: 'दाखवा',
      hidePassword: 'लपवा',
      dbSecurityBadge: 'डेटाबेस व ईमेलने सुरक्षित',
      dbSecurityDesc: 'झिरो-ट्रस्ट सिक्युरिटी नियमांनुसार फक्त तुम्हालाच तुमच्या नोंदी पाहण्याचा अधिकार आहे.',
      contactPlaceholder: '१० अंकी मोबाईल नंबर टाका (उदा. 9876543210)',
      ageLabel: 'वय (वर्षे) *',
      bloodGroupLabel: 'रक्तगट (Blood Group)',
      primaryEmailBtn: 'ईमेल व पासवर्डने लॉगिन / नोंदणी करा',
      loginGoogleBtn: 'Google ने साइन इन करा (व्हेरिफाईड ईमेल आयडी)',
      submittingText: 'डेटाबेसमध्ये सुरक्षित प्रमाणीकरण सुरू आहे...',
      errNameRequired: 'कृपया पुढे जाण्यासाठी पूर्ण नाव टाका.',
      errEmailRequired: 'कृपया तुमचा ईमेल आयडी टाका.',
      errEmailInvalid: 'कृपया वैध ईमेल पत्ता टाका (उदा. user@example.com).',
      errPasswordShort: 'पासवर्ड किमान ६ अक्षरांचा असावा.',
      errPhoneInvalid:
        'कृपया वैध १० अंकी मोबाईल संपर्क क्रमांक टाका (उदा. 9876543210).',
      aboutHeading: '01. प्रिव्हेंटिया (Preventia) ॲपमधील ७ मुख्य आरोग्य सुविधा',
      aboutSubheading:
        'रुग्ण, डॉक्टर आणि कम्युनिटी प्रोजेक्ट हेड यांच्यासाठी मराठी, हिंदी आणि इंग्रजी भाषेत सोपी रचना.',
      modules: [
        {
          num: '01',
          title: 'दैनंदिन रक्तदाब (BP), शुगर, झोप आणि औषध ट्रॅकर',
          desc: 'दररोजचा बीपी, फास्टिंग शुगर, हृदयाचे ठोके, झोपेचे तास आणि पाण्याचे प्रमाण नोंदवा; तसेच गोळ्या-औषधे आणि लसीकरणाच्या आठवणी ठेवा.',
          meta: 'क्लाउड सिंक · दैनंदिन आरोग्य तक्ता',
        },
        {
          num: '02',
          title: 'AI लक्षणे तपासणी आणि तात्काळ मार्गदर्शन',
          desc: 'मराठी, हिंदी किंवा इंग्रजीत तुमची लक्षणे सांगा आणि घरगुती काळजी व डॉक्टरांना कधी भेटावे याचे अचूक मार्गदर्शन मिळवा.',
          meta: 'मेडिकल AI ट्रायज · महिला आवाजात माहिती',
        },
        {
          num: '03',
          title: 'आजार प्रतिबंध आणि वयानुसार आहार माहितीकोश',
          desc: 'उच्च रक्तदाब, मधुमेह, हृदयविकार आणि सांधेदुखीची प्राथमिक लक्षणे, प्रतिबंधात्मक उपाय आणि लहान मुले, तरुण व ज्येष्ठांसाठी आहार.',
          meta: 'लहान मुले (०–१८) · प्रौढ (१९–५९) · ज्येष्ठ (६०+)',
        },
        {
          num: '04',
          title: 'व्यायाम, खुर्चीवरील योग (Chair Yoga) आणि प्राणायाम',
          desc: 'ज्येष्ठ नागरिकांसाठी सुरक्षित खुर्चीवरील योगासने, जेवणानंतरची शतपावली, अनुलोम-विलोम प्राणायाम आणि वयोगटानुसार व्यायामाचे वेळापत्रक.',
          meta: 'सुरक्षित कृती · महिला आवाजात मार्गदर्शन',
        },
        {
          num: '05',
          title: 'डॉक्टर लाईव्ह कॉल आणि सामुदायिक आरोग्य शिबिरे',
          desc: 'जोडलेल्या डॉक्टरांशी थेट व्हॉइस/व्हिडिओ कॉलवर संवाद साधा आणि कम्युनिटी प्रोजेक्ट हेडने आयोजित केलेल्या आरोग्य शिबिरांची माहिती मिळवा.',
          meta: 'लाईव्ह डॉक्टर कॉल · आरोग्य शिबिरे',
        },
        {
          num: '06',
          title: 'लाईव्ह GPS रुग्णालय मॅप आणि एन्क्रिप्टेड मेडिकल व्हॉल्ट',
          desc: 'GPS किंवा पिनकोडने तुमच्या जवळचे हॉस्पिटल आणि २४ तास सुरू असणारे मेडिकल स्टोअर शोधा व रिपोर्ट्स AES-256 लॉकमध्ये सुरक्षित ठेवा.',
          meta: 'Google Maps · AES-256 सुरक्षित व्हॉल्ट',
        },
      ],
      ageSectionTitle: '02. तिन्ही लॉगिन प्रकारांसाठी (User, Doctor, Project Head) विशेष सुविधा',
      ageCards: [
        {
          bracket: 'वापरकर्ता / रुग्ण (User / Patient)',
          focus: 'दैनंदिन बीपी/शुगर नोंद, लसीकरण, खुर्चीवरील योग, महिला आवाजात माहिती आणि फॅमिली डॉक्टरांना थेट कॉल.',
        },
        {
          bracket: 'डॉक्टर (Doctor Console)',
          focus: 'रुग्णांचे इनकमिंग कॉल उचला, कॉल दरम्यान रुग्णाचा लाईव्ह बीपी/शुगर पहा आणि तात्काळ वैद्यकीय सल्ला द्या.',
        },
        {
          bracket: 'कम्युनिटी प्रोजेक्ट हेड (Project Head)',
          focus: 'प्रभागामध्ये मोफत बीपी/शुगर तपासणी शिबिरे, लसीकरण मोहीम आणि आरोग्य जागृती संदेश प्रसारित करा.',
        },
      ],
      privacyTitle: '03. तुमचा संपर्क क्रमांक आणि आरोग्य माहिती किती सुरक्षित आहे?',
      privacyPoints: [
        'भूमिकेनुसार समन्वय: तुमचा मोबाईल नंबर रुग्ण, डॉक्टर आणि कम्युनिटी प्रोजेक्ट हेड यांच्यात सुरक्षित संवाद साधतो.',
        'संपूर्ण गोपनीयता: तुमचा संपर्क क्रमांक आणि आरोग्य नोंदी फक्त तुमच्या वैयक्तिक खात्यात सुरक्षित राहतात.',
        'AES-256 मेडिकल व्हॉल्ट: तुमचे वैद्यकीय रिपोर्ट्स आणि डॉक्टरांसाठीचे PDF समरी रिपोर्ट सुरक्षित राहतात.',
      ],
    },
  }[language];

  const activeCategoryCopy = copy.categories[loginCategory];

  const handleCategorySwitch = (cat: LoginCategory) => {
    setLoginCategory(cat);
    setErrorMsg(null);
  };

  const validateAndSubmit = async (authMethod: 'password' | 'google' | 'direct') => {
    setErrorMsg(null);
    const trimmedName = displayName.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const digitsOnly = rawPhone.replace(/\D/g, '');

    if (!trimmedName) {
      setErrorMsg(copy.errNameRequired);
      return;
    }

    if (authMethod !== 'google') {
      if (!trimmedEmail) {
        setErrorMsg(copy.errEmailRequired);
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        setErrorMsg(copy.errEmailInvalid);
        return;
      }
      if (authMethod === 'password' && password.length < 6) {
        setErrorMsg(copy.errPasswordShort);
        return;
      }
    }

    if (digitsOnly.length < 10 || digitsOnly.length > 12) {
      setErrorMsg(copy.errPhoneInvalid);
      return;
    }

    const formattedContact = `${countryCode} ${digitsOnly}`;
    const validAge = Math.min(120, Math.max(1, Number(age) || 64));

    setSubmitting(true);
    try {
      await onCompleteLogin({
        loginCategory,
        email: trimmedEmail || 'user@preventia.health',
        password: password || undefined,
        displayName: trimmedName.slice(0, 100),
        contactNumber: formattedContact.slice(0, 20),
        age: validAge,
        bloodGroup,
        authMethod,
        doctorSpecialty:
          loginCategory === 'doctor' ? doctorSpecialty.trim().slice(0, 100) : undefined,
        doctorClinic:
          loginCategory === 'doctor' ? doctorClinic.trim().slice(0, 140) : undefined,
        communityWard:
          loginCategory === 'community_head' ? communityWard.trim().slice(0, 120) : undefined,
        communityDesignation:
          loginCategory === 'community_head'
            ? communityDesignation.trim().slice(0, 120)
            : undefined,
      });
    } catch (err: unknown) {
      const errText = err instanceof Error ? err.message : String(err);
      setErrorMsg(errText);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateAndSubmit('password');
  };

  return (
    <div
      className={`min-h-screen bg-slate-50 text-slate-900 ${
        seniorMode ? 'text-lg' : 'text-base'
      }`}
    >
      {/* Top Bar Contract: 3 Clean Zones */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Zone 1: Single text wordmark */}
        <a
          href="#top"
          className="font-display text-xl font-semibold tracking-tight text-teal-900 whitespace-nowrap"
        >
          Preventia
        </a>

        {/* Zone 2: Section Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a
            href="#login-board"
            className="hover:text-slate-900 transition-colors whitespace-nowrap"
          >
            {copy.navOverview}
          </a>
          <a
            href="#core-modules"
            className="hover:text-slate-900 transition-colors whitespace-nowrap"
          >
            {copy.navModules}
          </a>
          <a
            href="#age-wise-care"
            className="hover:text-slate-900 transition-colors whitespace-nowrap"
          >
            {copy.navAgeCare}
          </a>
          <a
            href="#privacy-security"
            className="hover:text-slate-900 transition-colors whitespace-nowrap"
          >
            {copy.navSecurity}
          </a>
        </nav>

        {/* Zone 3: Language Switcher & Accessibility Actions */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center p-1 bg-slate-100 rounded-lg">
            {(['en', 'hi', 'mr'] as Language[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => onLanguageChange(lang)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  language === lang
                    ? 'bg-white text-teal-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'मराठी'}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onToggleSeniorMode}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap cursor-pointer ${
              seniorMode
                ? 'border-teal-700 bg-teal-700 text-white'
                : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{copy.seniorBtn}</span>
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main id="top" className="max-w-[1380px] mx-auto px-4 sm:px-6 py-8 space-y-12">
        {/* Emergency Helpline & Voice Read-Aloud Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white border border-slate-200">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-red-700">
            <PhoneCall className="w-4 h-4 shrink-0" />
            <span>{copy.emergencyStrip}</span>
          </div>

          <button
            type="button"
            onClick={() =>
              isSpeaking
                ? onStopSpeaking()
                : onSpeakText(
                    `${copy.heroTitle}. ${copy.heroDescription}. ${activeCategoryCopy.title}. ${activeCategoryCopy.subtitle}`
                  )
            }
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-900 text-xs font-semibold hover:bg-teal-100 transition-colors self-start sm:self-auto whitespace-nowrap cursor-pointer"
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4 text-red-600" />
                <span>{copy.stopAudioBtn}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-teal-700" />
                <span>{copy.listenIntroBtn}</span>
              </>
            )}
          </button>
        </div>

        {/* HERO + CATEGORY-BASED LOGIN BOARD SPLIT SECTION */}
        <section
          id="login-board"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Left Column: Information About the App */}
          <div className="lg:col-span-7 space-y-6 pt-2">
            <p className="text-xs font-semibold text-teal-800 tracking-wide">
              {copy.kicker}
            </p>

            <h1
              className={`font-display font-semibold text-slate-900 tracking-tight leading-[1.15] text-balance ${
                seniorMode ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl lg:text-[42px]'
              }`}
            >
              {copy.heroTitle}
            </h1>

            <p
              className={`text-slate-600 leading-relaxed max-w-[68ch] ${
                seniorMode ? 'text-xl' : 'text-base'
              }`}
            >
              {copy.heroDescription}
            </p>

            {/* Key App Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-2 text-teal-800 font-semibold text-sm">
                  <HeartPulse className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>
                    {language === 'mr'
                      ? '१. वापरकर्ता / रुग्ण पोर्टल (User)'
                      : language === 'hi'
                      ? '1. उपयोगकर्ता / रोगी पोर्टल (User)'
                      : '1. User / Patient Health Portal'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'mr'
                    ? 'दररोजचा बीपी, शुगर, झोप, औषधे, AI लक्षणे तपासणी, वयानुसार आहार-योग आणि फॅमिली डॉक्टरांना थेट कॉल.'
                    : language === 'hi'
                    ? 'दैनिक बीपी, शुगर, नींद, दवाइयाँ, AI लक्षण जांच, उम्र अनुसार आहार-योग और डॉक्टर से सीधा संवाद।'
                    : 'Track daily BP, sugar, sleep, medications, AI symptom triage, age-wise diet/yoga, and call your family doctor.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-2 text-teal-800 font-semibold text-sm">
                  <Stethoscope className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>
                    {language === 'mr'
                      ? '२. डॉक्टर टेलीमेडिसिन कन्सोल (Doctor)'
                      : language === 'hi'
                      ? '2. डॉक्टर टेलीमेडिसिन कंसोल (Doctor)'
                      : '2. Doctor Telemedicine Console'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'mr'
                    ? 'रुग्णांचे लाईव्ह व्हॉइस/व्हिडिओ कॉल उचला, रुग्णाचा बीपी/शुगर रिपोर्ट लाईव्ह पहा आणि तात्काळ वैद्यकीय सल्ला द्या.'
                    : language === 'hi'
                    ? 'मरीजों के लाइव वॉइस/वीडियो कॉल रिसीव करें, लाइव बीपी/शुगर देखें और तुरंत परामर्श व अपॉइंटमेंट प्रबंधित करें।'
                    : 'Receive live patient voice/video calls, inspect real-time BP & sugar vitals, send prescriptions, and manage appointments.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-2 text-teal-800 font-semibold text-sm">
                  <Users className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>
                    {language === 'mr'
                      ? '३. कम्युनिटी प्रोजेक्ट हेड (Project Head)'
                      : language === 'hi'
                      ? '3. कम्युनिटी प्रोजेक्ट हेड (Project Head)'
                      : '3. Community Project Head Hub'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'mr'
                    ? 'प्रभागामध्ये मोफत आरोग्य तपासणी शिबिरे, लसीकरण मोहीम आणि ज्येष्ठ नागरिक आरोग्य जनजागृती मोहीम राबवा.'
                    : language === 'hi'
                    ? 'वार्ड में मुफ्त स्वास्थ्य जांच शिविर, टीकाकरण अभियान और वरिष्ठ नागरिक स्वास्थ्य जागरूकता अभियान चलाएं।'
                    : 'Organize ward-level health screening camps, vaccination drives, senior outreach, and broadcast preventive advisories.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-2 text-teal-800 font-semibold text-sm">
                  <MapPin className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>
                    {language === 'mr'
                      ? 'लाईव्ह GPS हॉस्पिटल मॅप व सुरक्षित व्हॉल्ट'
                      : language === 'hi'
                      ? 'लाइव GPS अस्पताल मैप और सुरक्षित वॉल्ट'
                      : 'Live GPS Medical Map & AES-256 Vault'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'mr'
                    ? 'Google Maps वर जवळचे हॉस्पिटल व मेडिकल स्टोअर शोधा आणि रिपोर्ट्स पासवर्डने सुरक्षित ठेवा.'
                    : language === 'hi'
                    ? 'Google Maps पर नजदीकी अस्पताल और मेडिकल स्टोर खोजें व रिपोर्ट्स सुरक्षित रखें।'
                    : 'Locate nearby hospitals & 24x7 pharmacies via live GPS and encrypt medical records.'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Category-Based Login Board (User, Doctor, Community Project Head) */}
          <div className="lg:col-span-5 bg-white border-2 border-teal-700/80 rounded-2xl p-6 sm:p-7 space-y-5 shadow-xs">
            {/* 3-Category Login Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                {copy.selectCategoryLabel}
              </label>
              <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => handleCategorySwitch('user')}
                  className={`flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    loginCategory === 'user'
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-white/70'
                  }`}
                >
                  <UserCheck className="w-4 h-4 shrink-0" />
                  <span className="text-center leading-tight">
                    {copy.categories.user.tabLabel}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCategorySwitch('doctor')}
                  className={`flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    loginCategory === 'doctor'
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-white/70'
                  }`}
                >
                  <Stethoscope className="w-4 h-4 shrink-0" />
                  <span className="text-center leading-tight">
                    {copy.categories.doctor.tabLabel}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCategorySwitch('community_head')}
                  className={`flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    loginCategory === 'community_head'
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-white/70'
                  }`}
                >
                  <Users className="w-4 h-4 shrink-0" />
                  <span className="text-center leading-tight">
                    {copy.categories.community_head.tabLabel}
                  </span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5 pb-4 border-b border-slate-100">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-teal-800">
                  {activeCategoryCopy.badge}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>{copy.dbSecurityBadge}</span>
                </span>
              </div>
              <h2
                className={`font-display font-semibold text-slate-900 ${
                  seniorMode ? 'text-2xl' : 'text-xl'
                }`}
              >
                {activeCategoryCopy.title}
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                {activeCategoryCopy.subtitle}
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs font-medium flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Full Name (Adapted per Category) */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  {activeCategoryCopy.nameLabel}
                </label>
                <div className="relative">
                  {loginCategory === 'doctor' ? (
                    <Stethoscope className="w-4 h-4 text-teal-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  ) : loginCategory === 'community_head' ? (
                    <Award className="w-4 h-4 text-teal-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  ) : (
                    <UserCheck className="w-4 h-4 text-teal-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  )}
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder={activeCategoryCopy.namePlaceholder}
                    maxLength={100}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-teal-700"
                    required
                  />
                </div>
              </div>

              {/* Email Address (Database Identity & Verification) */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  {copy.emailLabel}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-teal-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={copy.emailPlaceholder}
                    maxLength={160}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-teal-700"
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  {copy.emailHelper}
                </p>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-800">
                    {copy.passwordLabel}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] font-medium text-teal-700 hover:text-teal-900 cursor-pointer"
                  >
                    {showPassword ? copy.hidePassword : copy.showPassword}
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-teal-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={copy.passwordPlaceholder}
                    minLength={6}
                    maxLength={64}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-teal-700"
                    required
                  />
                </div>
              </div>

              {/* Contact Number (Required for all 3 categories) */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  {activeCategoryCopy.contactLabel}
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    aria-label="Country Code"
                    className="w-24 rounded-lg border border-slate-300 px-2.5 py-2.5 text-sm font-mono tabular-nums bg-slate-50 text-slate-900 focus:outline-none focus:border-teal-700"
                  >
                    <option value="+91">+91 IN</option>
                    <option value="+1">+1 US</option>
                    <option value="+44">+44 UK</option>
                    <option value="+971">+971 AE</option>
                  </select>

                  <div className="relative flex-1">
                    <Phone className="w-4 h-4 text-teal-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={rawPhone}
                      onChange={(e) =>
                        setRawPhone(e.target.value.replace(/[^\d\s-]/g, '').slice(0, 14))
                      }
                      placeholder={copy.contactPlaceholder}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-mono tabular-nums text-slate-900 focus:outline-none focus:border-teal-700"
                      required
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">
                  {activeCategoryCopy.contactHelper}
                </p>
              </div>

              {/* DOCTOR CATEGORY SPECIFIC FIELDS */}
              {loginCategory === 'doctor' && (
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      {copy.categories.doctor.specialtyLabel}
                    </label>
                    <input
                      type="text"
                      value={doctorSpecialty}
                      onChange={(e) => setDoctorSpecialty(e.target.value)}
                      placeholder={copy.categories.doctor.specialtyPlaceholder}
                      maxLength={100}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-teal-700"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      {copy.categories.doctor.clinicLabel}
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={doctorClinic}
                        onChange={(e) => setDoctorClinic(e.target.value)}
                        placeholder={copy.categories.doctor.clinicPlaceholder}
                        maxLength={140}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-teal-700"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* COMMUNITY PROJECT HEAD SPECIFIC FIELDS */}
              {loginCategory === 'community_head' && (
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      {copy.categories.community_head.wardLabel}
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={communityWard}
                        onChange={(e) => setCommunityWard(e.target.value)}
                        placeholder={copy.categories.community_head.wardPlaceholder}
                        maxLength={120}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-teal-700"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      {copy.categories.community_head.designationLabel}
                    </label>
                    <input
                      type="text"
                      value={communityDesignation}
                      onChange={(e) => setCommunityDesignation(e.target.value)}
                      placeholder={copy.categories.community_head.designationPlaceholder}
                      maxLength={120}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-teal-700"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Age & Blood Group Row (Shown for User, or compact for Doctor/Project Head) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    {copy.ageLabel}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-mono tabular-nums text-slate-900 focus:outline-none focus:border-teal-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    {copy.bloodGroupLabel}
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-mono bg-white text-slate-900 focus:outline-none focus:border-teal-700"
                  >
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Primary Submit Button: Direct Category Login */}
              <div className="pt-2 space-y-2.5">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 rounded-xl bg-teal-700 text-white font-semibold text-sm hover:bg-teal-800 transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <span>
                    {submitting ? copy.submittingText : activeCategoryCopy.primaryBtn}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Secondary Option: Google Cloud Sync + Save Contact Number */}
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => validateAndSubmit('google')}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold text-xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <LogIn className="w-3.5 h-3.5 text-teal-700" />
                  <span>{copy.loginGoogleBtn}</span>
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* SECTION 01: 6-CARD BENTO OVERVIEW OF ALL APP MODULES */}
        <section id="core-modules" className="space-y-5 pt-4 border-t border-slate-200">
          <div className="space-y-1">
            <h2
              className={`font-display font-semibold text-slate-900 ${
                seniorMode ? 'text-2xl' : 'text-xl'
              }`}
            >
              {copy.aboutHeading}
            </h2>
            <p className="text-sm text-slate-600">{copy.aboutSubheading}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {copy.modules.map((mod) => (
              <div
                key={mod.num}
                className="p-5 bg-white border border-slate-200 rounded-xl flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-mono font-semibold text-teal-800">
                      {mod.num}.
                    </span>
                    <span>{mod.meta}</span>
                  </div>
                  <h3
                    className={`font-semibold text-slate-900 ${
                      seniorMode ? 'text-xl' : 'text-base'
                    }`}
                  >
                    {mod.title}
                  </h3>
                  <p
                    className={`text-slate-600 leading-relaxed ${
                      seniorMode ? 'text-base' : 'text-sm'
                    }`}
                  >
                    {mod.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <a
                    href="#login-board"
                    className="font-semibold text-teal-700 hover:underline inline-flex items-center gap-1"
                  >
                    <span>
                      {language === 'mr'
                        ? 'लॉगिन करून वापरा →'
                        : language === 'hi'
                        ? 'लॉगिन करके उपयोग करें →'
                        : 'Login above to open module →'}
                    </span>
                  </a>
                  <button
                    type="button"
                    onClick={() => onSpeakText(`${mod.title}. ${mod.desc}`)}
                    className="text-slate-500 hover:text-teal-800 inline-flex items-center gap-1 cursor-pointer"
                    title="Listen in Female Voice"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>
                      {language === 'mr' ? 'ऐका' : language === 'hi' ? 'सुनें' : 'Listen'}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 02: ROLE & AGE-WISE CARE MATRIX */}
        <section id="age-wise-care" className="space-y-4 pt-4 border-t border-slate-200">
          <h2
            className={`font-display font-semibold text-slate-900 ${
              seniorMode ? 'text-2xl' : 'text-xl'
            }`}
          >
            {copy.ageSectionTitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {copy.ageCards.map((card, i) => (
              <div
                key={i}
                className="p-5 rounded-xl bg-white border border-slate-200 space-y-2"
              >
                <p className="text-xs font-semibold text-teal-800">{card.bracket}</p>
                <p
                  className={`text-slate-700 leading-relaxed ${
                    seniorMode ? 'text-base' : 'text-sm'
                  }`}
                >
                  {card.focus}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 03: PRIVACY, CONTACT NUMBER SECURITY & AES-256 VAULT */}
        <section
          id="privacy-security"
          className="p-6 rounded-xl bg-white border border-slate-200 space-y-4"
        >
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0" />
            <h2
              className={`font-display font-semibold text-slate-900 ${
                seniorMode ? 'text-xl' : 'text-lg'
              }`}
            >
              {copy.privacyTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {copy.privacyPoints.map((pt, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <span className="leading-relaxed text-xs sm:text-sm">{pt}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Quiet Clinical Footer */}
      <footer className="max-w-[1380px] mx-auto px-6 py-8 mt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-teal-700" />
          <span>Preventia Community Health · End-to-End AES-256 Encrypted Medical Privacy</span>
        </div>
        <div>English · हिंदी · मराठी · User, Doctor & Community Project Head Portal</div>
      </footer>
    </div>
  );
};
