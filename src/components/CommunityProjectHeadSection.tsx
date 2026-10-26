import React, { useState } from 'react';
import { Language } from '../i18n/translations';
import { PersonalDoctorItem } from './TelemedicineSection';
import {
  Users,
  Calendar,
  MapPin,
  Megaphone,
  Plus,
  Trash2,
  Volume2,
  CheckCircle2,
  Activity,
  Syringe,
  HeartPulse,
  Phone,
  Award,
  BarChart3,
  Stethoscope,
  AlertTriangle,
  FileText,
  FolderOpen,
  Send,
  UserPlus,
  Check,
  Clock,
  ShieldAlert,
  Radio,
  Download,
  MessageSquareWarning,
  Building2,
} from 'lucide-react';

export interface CampParticipantItem {
  id: string;
  name: string;
  age: number;
  phone: string;
  screeningNeeded: string;
}

export interface CommunityHealthCampItem {
  id: string;
  title: string;
  wardVenue: string;
  campDate: string;
  campTime: string;
  targetGroup: string;
  coordinatorName: string;
  coordinatorPhone: string;
  status: 'Upcoming' | 'Active Today' | 'Completed';
  capacity?: number;
  registeredCount?: number;
  participants?: CampParticipantItem[];
}

export interface CommunityAdvisoryItem {
  id: string;
  title: string;
  message: string;
  urgency: 'Routine Awareness' | 'Seasonal Alert' | 'Urgent Drive';
  ward: string;
  postedBy: string;
  postedDate: string;
  channels?: ('SMS' | 'Push Notification' | 'In-App Banner')[];
  targetCohort?: string;
}

export interface GrievanceTicketItem {
  id: string;
  citizenName: string;
  citizenPhone: string;
  wardPocket: string;
  category: 'Medical Access' | 'Medicine Shortage' | 'App / Technical Issue' | 'Admin Bottleneck';
  priority: 'High' | 'Medium' | 'Low';
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  resolutionNote: string;
  createdAt: string;
}

export interface PolicyResourceItem {
  id: string;
  title: string;
  category:
    | 'Regional Health Policy'
    | 'Emergency Contact Directory'
    | 'Localized Awareness Material'
    | 'Field Worker Protocol';
  languageTag: 'Marathi / Hindi / English' | 'Marathi' | 'Hindi' | 'English';
  summary: string;
  emergencyContacts?: string;
  updatedAt: string;
  author: string;
}

export interface JurisdictionDoctorBandwidth {
  id: string;
  name: string;
  specialty: string;
  pocketLocation: string;
  contactPhone: string;
  dailyCapacity: number;
  bookedToday: number;
  pocketStatus: 'Well-Served' | 'High Load' | 'Under-Served Pocket';
}

export const INITIAL_COMMUNITY_CAMPS: CommunityHealthCampItem[] = [
  {
    id: 'camp_1',
    title: 'Free Senior Citizen BP, Diabetes (HbA1c) & Eye Screening Camp',
    wardVenue: 'Ward 12 Community Hall, Kothrud, Pune',
    campDate: '2026-10-02',
    campTime: '08:30 AM – 01:30 PM',
    targetGroup: 'Senior Citizens (60+ Years) & Adults',
    coordinatorName: 'Sunita Deshmukh',
    coordinatorPhone: '+91 9850044556',
    status: 'Upcoming',
    capacity: 120,
    registeredCount: 84,
    participants: [
      {
        id: 'p_1',
        name: 'Ramesh Kulkarni',
        age: 66,
        phone: '+91 9823014567',
        screeningNeeded: 'BP, HbA1c & Retinal Check',
      },
      {
        id: 'p_2',
        name: 'Shanta Joshi',
        age: 71,
        phone: '+91 9822198765',
        screeningNeeded: 'Hypertension & ECG Review',
      },
    ],
  },
  {
    id: 'camp_2',
    title: 'Community Immunization & Adult Influenza / Tetanus Booster Drive',
    wardVenue: 'Primary Urban Health Center, Karve Nagar',
    campDate: '2026-10-08',
    campTime: '09:00 AM – 04:00 PM',
    targetGroup: 'Children (0–18) & Senior Citizens',
    coordinatorName: 'Sunita Deshmukh',
    coordinatorPhone: '+91 9850044556',
    status: 'Upcoming',
    capacity: 150,
    registeredCount: 112,
    participants: [
      {
        id: 'p_3',
        name: 'Mahesh Gokhale',
        age: 58,
        phone: '+91 9890112233',
        screeningNeeded: 'Adult Influenza Booster',
      },
    ],
  },
];

export const INITIAL_COMMUNITY_ADVISORIES: CommunityAdvisoryItem[] = [
  {
    id: 'adv_1',
    title: 'Seasonal Fever & Dengue Prevention Advisory',
    message:
      'Prevent stagnant water around flower pots and coolers. Citizens experiencing fever for more than 2 days should check symptoms in Preventia AI Triage and visit the Ward 12 screening camp.',
    urgency: 'Seasonal Alert',
    ward: 'Ward 12 — Kothrud Health Zone',
    postedBy: 'Sunita Deshmukh (Community Project Head)',
    postedDate: '2026-09-27',
    channels: ['SMS', 'Push Notification', 'In-App Banner'],
    targetCohort: 'All Ward Citizens (1,480 Recipients)',
  },
  {
    id: 'adv_2',
    title: 'Daily Morning Chair Yoga & Post-Meal Shatpavali Initiative',
    message:
      'All senior citizens above 60 years are encouraged to practice 15 minutes of post-meal Shatpavali and check blood pressure twice weekly.',
    urgency: 'Routine Awareness',
    ward: 'Ward 12 — Kothrud Health Zone',
    postedBy: 'Sunita Deshmukh (Community Project Head)',
    postedDate: '2026-09-26',
    channels: ['Push Notification', 'In-App Banner'],
    targetCohort: 'Senior Citizens 60+ (520 Recipients)',
  },
];

const INITIAL_GRIEVANCES: GrievanceTicketItem[] = [
  {
    id: 'GRV-1042',
    citizenName: 'Vasantrao Pawar (Age 74)',
    citizenPhone: '+91 9823445511',
    wardPocket: 'Sector D — Warje Malwadi Slum Pocket',
    category: 'Medical Access',
    priority: 'High',
    description:
      'Evening visiting doctor slot unavailable in Sector D sub-center for bedridden senior citizens needing BP & insulin titration.',
    status: 'Open',
    resolutionNote: '',
    createdAt: '2026-09-27 · 08:15 AM',
  },
  {
    id: 'GRV-1039',
    citizenName: 'Meera Shinde (Age 62)',
    citizenPhone: '+91 9850119988',
    wardPocket: 'Sector B — Karve Nagar Lane 4',
    category: 'Medicine Shortage',
    priority: 'Medium',
    description:
      'Generic Amlodipine 5mg and Metformin 500mg strips out of stock at Ward 12 Jan Aushadhi counter.',
    status: 'In Progress',
    resolutionNote: 'Requisition sent to Municipal Central Pharmacy; stock arriving 4:00 PM today.',
    createdAt: '2026-09-26 · 05:40 PM',
  },
  {
    id: 'GRV-1035',
    citizenName: 'prabhakar Deshpande (Age 69)',
    citizenPhone: '+91 9890223344',
    wardPocket: 'Sector A — Kothrud Depot',
    category: 'App / Technical Issue',
    priority: 'Low',
    description:
      'Requested assistance setting up Marathi voice read-aloud and family caregiver WhatsApp link on new phone.',
    status: 'Resolved',
    resolutionNote: 'Assisted by Ward ASHA volunteer during home visit.',
    createdAt: '2026-09-25 · 11:20 AM',
  },
];

const INITIAL_POLICY_RESOURCES: PolicyResourceItem[] = [
  {
    id: 'res_1',
    title: 'Ward 24x7 Emergency & Ambulance Escalation Directory (2026)',
    category: 'Emergency Contact Directory',
    languageTag: 'Marathi / Hindi / English',
    summary:
      'Direct hotlines for Cardiac/Stroke Ambulance (108), Municipal Epidemic Control Cell, 24x7 Blood Banks, and Senior Citizen SOS Response Team.',
    emergencyContacts:
      'Ambulance: 108 | Municipal Health Control: 020-25501234 | Jan Aushadhi Helpline: 1800-180-8080',
    updatedAt: '2026-09-27',
    author: 'Municipal Public Health Department',
  },
  {
    id: 'res_2',
    title: 'Standard Operating Protocol: Monsoon Dengue, Malaria & Chikungunya Containment',
    category: 'Regional Health Policy',
    languageTag: 'Marathi / Hindi / English',
    summary:
      'Ward-level vector surveillance checklist, fever cluster reporting thresholds (>5 cases per lane), and rapid platelet screening referral guidelines.',
    updatedAt: '2026-09-24',
    author: 'District Epidemiologist & Project Head',
  },
  {
    id: 'res_3',
    title: 'Senior Citizen Non-Communicable Disease (NCD) Home Screening Handbook',
    category: 'Localized Awareness Material',
    languageTag: 'Marathi / Hindi / English',
    summary:
      'Pictorial & audio-ready guide for ASHA workers and families on measuring resting BP, recognizing early stroke (FAST) signs, and low-sodium Marathi diets.',
    updatedAt: '2026-09-20',
    author: 'Preventia Community Health Mission',
  },
];

export const CommunityProjectHeadSection: React.FC<{
  language: Language;
  seniorMode: boolean;
  isProjectHead: boolean;
  headName: string;
  headPhone: string;
  headWard: string;
  headDesignation: string;
  camps: CommunityHealthCampItem[];
  onAddCamp: (camp: Omit<CommunityHealthCampItem, 'id'>) => void;
  onUpdateCampStatus: (id: string, status: CommunityHealthCampItem['status']) => void;
  onDeleteCamp: (id: string) => void;
  advisories: CommunityAdvisoryItem[];
  onAddAdvisory: (adv: Omit<CommunityAdvisoryItem, 'id'>) => void;
  onDeleteAdvisory: (id: string) => void;
  personalDoctors?: PersonalDoctorItem[];
  appointmentsCount?: number;
  onSpeakText: (text: string) => void;
}> = ({
  language,
  seniorMode,
  headName,
  headPhone,
  headWard,
  headDesignation,
  camps,
  onAddCamp,
  onUpdateCampStatus,
  onDeleteCamp,
  advisories,
  onAddAdvisory,
  onDeleteAdvisory,
  personalDoctors = [],
  appointmentsCount = 12,
  onSpeakText,
}) => {
  type HeadPortalTab = 'analytics' | 'outreach' | 'coordination' | 'repository';
  const [activeSubTab, setActiveSubTab] = useState<HeadPortalTab>('analytics');

  // Module 2: Broadcast Announcement State
  const [advTitle, setAdvTitle] = useState('');
  const [advMessage, setAdvMessage] = useState('');
  const [advUrgency, setAdvUrgency] =
    useState<CommunityAdvisoryItem['urgency']>('Seasonal Alert');
  const [selectedChannels, setSelectedChannels] = useState<
    ('SMS' | 'Push Notification' | 'In-App Banner')[]
  >(['SMS', 'Push Notification', 'In-App Banner']);
  const [targetCohort, setTargetCohort] = useState('All Ward Citizens (1,480 Recipients)');
  const [broadcastSuccess, setBroadcastSuccess] = useState<string | null>(null);

  // Module 2: Camp Scheduler & Citizen Registration State
  const [campTitle, setCampTitle] = useState('');
  const [campVenue, setCampVenue] = useState(headWard || 'Ward 12 Community Center');
  const [campDate, setCampDate] = useState('2026-10-05');
  const [campTime, setCampTime] = useState('09:00 AM – 02:00 PM');
  const [campTarget, setCampTarget] = useState('All Citizens & Seniors (60+)');
  const [campCapacity, setCampCapacity] = useState<number>(100);

  // Citizen Registration into Camp
  const [selectedCampForReg, setSelectedCampForReg] = useState<string>(camps[0]?.id || '');
  const [regCitizenName, setRegCitizenName] = useState('');
  const [regCitizenAge, setRegCitizenAge] = useState(65);
  const [regCitizenPhone, setRegCitizenPhone] = useState('');
  const [regScreeningType, setRegScreeningType] = useState('BP, Blood Sugar & Eye Check');
  const [localRegistrations, setLocalRegistrations] = useState<
    Record<string, CampParticipantItem[]>
  >({});
  const [regBanner, setRegBanner] = useState<string | null>(null);

  // Module 3: Doctor Availability & Pocket Deployment State
  const [doctorBandwidthList, setDoctorBandwidthList] = useState<JurisdictionDoctorBandwidth[]>([
    ...personalDoctors.map((d, idx) => ({
      id: d.id,
      name: d.name,
      specialty: d.specialty,
      pocketLocation: d.hospital,
      contactPhone: d.contactPhone,
      dailyCapacity: 25,
      bookedToday: 14 + (idx % 6),
      pocketStatus: 'Well-Served' as const,
    })),
    {
      id: 'bw_doc_1',
      name: 'Dr. Vivek Patil, MBBS, MD',
      specialty: 'Internal Medicine & Diabetology',
      pocketLocation: 'Sector A — Kothrud Primary Clinic',
      contactPhone: '+91 9822011223',
      dailyCapacity: 30,
      bookedToday: 24,
      pocketStatus: 'Well-Served',
    },
    {
      id: 'bw_doc_2',
      name: 'Dr. Snehal Kulkarni, MBBS, DGO',
      specialty: 'Maternal, Child & Geriatric Care',
      pocketLocation: 'Sector B — Karve Nagar Urban Health Post',
      contactPhone: '+91 9850223311',
      dailyCapacity: 25,
      bookedToday: 23,
      pocketStatus: 'High Load',
    },
    {
      id: 'bw_doc_3',
      name: 'Mobile Medical Unit #4 (Needs Specialist)',
      specialty: 'General Physician & Geriatric Outreach',
      pocketLocation: 'Sector D — Warje Malwadi Pocket (Under-Served)',
      contactPhone: '+91 9823099112',
      dailyCapacity: 40,
      bookedToday: 39,
      pocketStatus: 'Under-Served Pocket',
    },
  ]);
  const [deploymentNotice, setDeploymentNotice] = useState<string | null>(null);

  // Module 3: Grievance & Support Ticketing State
  const [grievances, setGrievances] = useState<GrievanceTicketItem[]>(INITIAL_GRIEVANCES);
  const [ticketFilter, setTicketFilter] = useState<'All' | 'Open' | 'In Progress' | 'Resolved'>(
    'All'
  );
  const [newGrvName, setNewGrvName] = useState('');
  const [newGrvPhone, setNewGrvPhone] = useState('');
  const [newGrvPocket, setNewGrvPocket] = useState('Sector D — Warje Malwadi');
  const [newGrvCat, setNewGrvCat] =
    useState<GrievanceTicketItem['category']>('Medical Access');
  const [newGrvPriority, setNewGrvPriority] =
    useState<GrievanceTicketItem['priority']>('High');
  const [newGrvDesc, setNewGrvDesc] = useState('');

  // Module 4: Resource Repository State
  const [resources, setResources] = useState<PolicyResourceItem[]>(INITIAL_POLICY_RESOURCES);
  const [resTitle, setResTitle] = useState('');
  const [resCategory, setResCategory] =
    useState<PolicyResourceItem['category']>('Regional Health Policy');
  const [resLangTag, setResLangTag] =
    useState<PolicyResourceItem['languageTag']>('Marathi / Hindi / English');
  const [resSummary, setResSummary] = useState('');
  const [resContacts, setResContacts] = useState('');
  const [resSavedBanner, setResSavedBanner] = useState<string | null>(null);

  const toggleChannel = (ch: 'SMS' | 'Push Notification' | 'In-App Banner') => {
    setSelectedChannels((prev) =>
      prev.includes(ch) ? prev.filter((item) => item !== ch) : [...prev, ch]
    );
  };

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!advTitle.trim() || !advMessage.trim()) return;
    const channelsToUse =
      selectedChannels.length > 0 ? selectedChannels : (['In-App Banner'] as const);
    onAddAdvisory({
      title: advTitle.trim(),
      message: advMessage.trim(),
      urgency: advUrgency,
      ward: headWard || 'Community Health Zone',
      postedBy: `${headName || 'Project Head'} (${headDesignation || 'Coordinator'})`,
      postedDate: new Date().toISOString().slice(0, 10),
      channels: [...channelsToUse],
      targetCohort,
    });
    setBroadcastSuccess(
      `Broadcast dispatched via [${channelsToUse.join(' + ')}] to ${targetCohort}!`
    );
    setAdvTitle('');
    setAdvMessage('');
    setTimeout(() => setBroadcastSuccess(null), 5000);
  };

  const handleCampSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campTitle.trim() || !campVenue.trim()) return;
    onAddCamp({
      title: campTitle.trim(),
      wardVenue: campVenue.trim(),
      campDate,
      campTime,
      targetGroup: campTarget.trim() || 'All Community Members',
      coordinatorName: headName || 'Community Project Head',
      coordinatorPhone: headPhone || '+91 9850044556',
      status: 'Upcoming',
      capacity: campCapacity || 100,
      registeredCount: 1,
      participants: [],
    });
    setCampTitle('');
  };

  const handleRegisterCitizenToCamp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regCitizenName.trim() || !regCitizenPhone.trim()) return;
    const targetCampId = selectedCampForReg || camps[0]?.id;
    if (!targetCampId) return;

    const newParticipant: CampParticipantItem = {
      id: `part_${Date.now()}`,
      name: regCitizenName.trim(),
      age: Number(regCitizenAge) || 60,
      phone: regCitizenPhone.trim(),
      screeningNeeded: regScreeningType.trim() || 'General Checkup',
    };

    setLocalRegistrations((prev) => ({
      ...prev,
      [targetCampId]: [newParticipant, ...(prev[targetCampId] || [])],
    }));

    const campObj = camps.find((c) => c.id === targetCampId);
    setRegBanner(
      `Registered ${newParticipant.name} (${newParticipant.phone}) for "${
        campObj?.title || 'Health Camp'
      }"!`
    );
    setRegCitizenName('');
    setRegCitizenPhone('');
    setTimeout(() => setRegBanner(null), 4500);
  };

  const handleDeployMobileDoctor = (docId: string) => {
    setDoctorBandwidthList((prev) =>
      prev.map((d) =>
        d.id === docId
          ? {
              ...d,
              dailyCapacity: d.dailyCapacity + 15,
              pocketStatus: 'Well-Served',
            }
          : d
      )
    );
    setDeploymentNotice(
      'Visiting Doctor & Mobile Screening Van allocated to Under-Served Pocket (+15 daily consultation slots unlocked).'
    );
    setTimeout(() => setDeploymentNotice(null), 4500);
  };

  const handleAddGrievanceTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGrvName.trim() || !newGrvDesc.trim()) return;
    const ticket: GrievanceTicketItem = {
      id: `GRV-${Math.floor(1045 + Math.random() * 900)}`,
      citizenName: newGrvName.trim(),
      citizenPhone: newGrvPhone.trim() || '+91 9800000000',
      wardPocket: newGrvPocket.trim(),
      category: newGrvCat,
      priority: newGrvPriority,
      description: newGrvDesc.trim(),
      status: 'Open',
      resolutionNote: '',
      createdAt: 'Just now',
    };
    setGrievances((prev) => [ticket, ...prev]);
    setNewGrvName('');
    setNewGrvPhone('');
    setNewGrvDesc('');
  };

  const handleUpdateTicketStatus = (
    id: string,
    status: GrievanceTicketItem['status'],
    note?: string
  ) => {
    setGrievances((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status,
              resolutionNote:
                note !== undefined
                  ? note
                  : status === 'Resolved' && !t.resolutionNote
                  ? `Resolved by ${headName} (Community Project Head)`
                  : t.resolutionNote,
            }
          : t
      )
    );
  };

  const handleUploadPolicyResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle.trim() || !resSummary.trim()) return;
    const item: PolicyResourceItem = {
      id: `res_${Date.now()}`,
      title: resTitle.trim(),
      category: resCategory,
      languageTag: resLangTag,
      summary: resSummary.trim(),
      emergencyContacts: resContacts.trim() || undefined,
      updatedAt: new Date().toISOString().slice(0, 10),
      author: `${headName} (${headDesignation})`,
    };
    setResources((prev) => [item, ...prev]);
    setResTitle('');
    setResSummary('');
    setResContacts('');
    setResSavedBanner('Policy guide / directory published to the Regional Resource Repository!');
    setTimeout(() => setResSavedBanner(null), 4500);
  };

  const filteredGrievances = grievances.filter((g) =>
    ticketFilter === 'All' ? true : g.status === ticketFilter
  );

  const navCopy = {
    en: {
      badge: 'Exclusive Community Heads’ Portal · Population Health & Resource Command',
      title: 'The Community Heads’ Portal — Population Analytics, Outreach & Coordination',
      subtitle:
        'Track regional disease demographics, broadcast SMS/Push health alerts, schedule screening camps, coordinate doctor bandwidth across pockets, resolve citizen grievances, and share regional policy guides.',
      tabs: [
        { id: 'analytics', label: '1. Population Analytics & Engagement' },
        { id: 'outreach', label: '2. Broadcasts & Camp Scheduler' },
        { id: 'coordination', label: '3. Doctor Bandwidth & Grievances' },
        { id: 'repository', label: '4. Policy & Resource Repository' },
      ],
    },
    hi: {
      badge: 'कम्युनिटी प्रोजेक्ट हेड पोर्टल · जनसंख्या स्वास्थ्य और संसाधन प्रबंधन',
      title: 'कम्युनिटी प्रोजेक्ट हेड पोर्टल — जनसंख्या स्वास्थ्य विश्लेषण, शिविर और समन्वय',
      subtitle:
        'क्षेत्रीय स्वास्थ्य आंकड़ों की निगरानी करें, SMS/पुश अलर्ट भेजें, स्वास्थ्य शिविरों में नागरिकों का पंजीकरण करें, डॉक्टरों की उपलब्धता देखें और जन शिकायतों का समाधान करें।',
      tabs: [
        { id: 'analytics', label: '1. जनसंख्या स्वास्थ्य और सहभागिता' },
        { id: 'outreach', label: '2. ब्रॉडकास्ट अलर्ट और स्वास्थ्य शिविर' },
        { id: 'coordination', label: '3. डॉक्टर उपलब्धता और शिकायत निवारण' },
        { id: 'repository', label: '4. क्षेत्रीय नीति और संसाधन केंद्र' },
      ],
    },
    mr: {
      badge: 'कम्युनिटी प्रोजेक्ट हेड पोर्टल · लोकसंख्या आरोग्य आणि संसाधन समन्वय',
      title: 'कम्युनिटी प्रोजेक्ट हेड पोर्टल — आरोग्य विश्लेषण, शिबिरे आणि तक्रार निवारण',
      subtitle:
        'प्रभागातील आजारांचे प्रमाण आणि जोखीम झोन तपासा, SMS/पुश अलर्ट पाठवा, आरोग्य शिबिरांमध्ये नागरिकांची नोंदणी करा, डॉक्टरांची उपलब्धता पहा आणि नागरिकांच्या अडचणी सोडवा.',
      tabs: [
        { id: 'analytics', label: '१. लोकसंख्या आरोग्य आणि सहभाग विश्लेषण' },
        { id: 'outreach', label: '२. ब्रॉडकास्ट अलर्ट आणि आरोग्य शिबिरे' },
        { id: 'coordination', label: '३. डॉक्टर उपलब्धता आणि तक्रार निवारण' },
        { id: 'repository', label: '४. आरोग्य धोरणे आणि माहिती भांडार' },
      ],
    },
  }[language];

  return (
    <div className="space-y-6">
      {/* Top Community Project Head Command Header */}
      <div className="p-6 bg-white border-2 border-teal-700/80 rounded-xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-950 text-xs font-semibold border border-amber-300">
                <Award className="w-3.5 h-3.5 text-amber-800" />
                <span>{navCopy.badge}</span>
              </span>
              <span className="text-xs font-mono text-slate-500">
                Jurisdiction: {headWard} · Helpline: {headPhone}
              </span>
            </div>
            <h2
              className={`font-display font-semibold text-slate-900 ${
                seniorMode ? 'text-2xl' : 'text-xl'
              }`}
            >
              {navCopy.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">{navCopy.subtitle}</p>
          </div>

          {/* 4 Top-Level Jurisdiction Telemetry Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
            <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <p className="text-[11px] text-slate-500">Active Citizens</p>
              <p className="text-lg font-mono font-bold text-slate-900 tabular-nums">1,480</p>
            </div>
            <div className="px-3.5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <p className="text-[11px] text-emerald-800 font-medium">Appt. Fulfillment</p>
              <p className="text-lg font-mono font-bold text-emerald-900 tabular-nums">88.4%</p>
            </div>
            <div className="px-3.5 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-center">
              <p className="text-[11px] text-amber-800 font-medium">Open Grievances</p>
              <p className="text-lg font-mono font-bold text-amber-900 tabular-nums">
                {grievances.filter((g) => g.status !== 'Resolved').length}
              </p>
            </div>
            <div className="px-3.5 py-2.5 rounded-xl bg-teal-50 border border-teal-200 text-center">
              <p className="text-[11px] text-teal-800 font-medium">Active Camps</p>
              <p className="text-lg font-mono font-bold text-teal-900 tabular-nums">
                {camps.length}
              </p>
            </div>
          </div>
        </div>

        {/* 4-Module Sub-Navigation Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
          {navCopy.tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as HeadPortalTab)}
              className={`py-2.5 px-3.5 rounded-xl text-xs font-semibold transition-all text-left flex items-center justify-between cursor-pointer ${
                activeSubTab === tab.id
                  ? 'bg-teal-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <span className="truncate">{tab.label}</span>
              {tab.id === 'coordination' &&
                grievances.filter((g) => g.status === 'Open').length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-mono text-[10px] font-bold">
                    {grievances.filter((g) => g.status === 'Open').length}
                  </span>
                )}
            </button>
          ))}
        </div>
      </div>

      {/* =====================================================================
          MODULE 1: POPULATION HEALTH ANALYTICS, DEMOGRAPHICS & ENGAGEMENT TRACKING
      ===================================================================== */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          {/* Engagement Tracking KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: 'Active Platform Citizens',
                value: '1,480 / 1,650',
                pct: 89.7,
                note: '+14.2% monthly onboarding growth across 4 ward sectors',
              },
              {
                title: 'Appointment Fulfillment Rate',
                value: '88.4%',
                pct: 88.4,
                note: `${appointmentsCount + 42} tele-consults & clinic visits completed on schedule`,
              },
              {
                title: 'Campaign & Camp Participation',
                value: '92.1%',
                pct: 92.1,
                note: 'High senior citizen turnout in BP/HbA1c & immunization drives',
              },
              {
                title: 'Daily Vitals & Med Adherence',
                value: '81.5%',
                pct: 81.5,
                note: '520 seniors actively logging BP, fasting sugar & medications',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-5 bg-white border border-slate-200 rounded-xl space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">{item.title}</span>
                  <BarChart3 className="w-4 h-4 text-teal-700" />
                </div>
                <p className="text-2xl font-mono font-bold text-slate-900 tabular-nums">
                  {item.value}
                </p>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-teal-700 rounded-full"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">{item.note}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 7 Cols: Regional Risk Clusters & Prevalent Health Conditions */}
            <div className="lg:col-span-7 p-6 bg-white border border-slate-200 rounded-xl space-y-5">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-teal-700" />
                  <span>
                    Regional Risk Cluster Map & Ward Sector Surveillance ({headWard})
                  </span>
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Localized pocket-by-pocket breakdown of prevalent conditions, symptom spikes, and senior citizen density.
                </p>
              </div>

              {/* 4-Pocket Visual Risk Cluster Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  {
                    sector: 'Sector A — Kothrud Depot & Ideal Colony',
                    riskLevel: 'Controlled',
                    badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
                    population: '420 Citizens (185 Seniors)',
                    topCondition: 'Hypertension (31%) · Controlled via Weekly Shatpavali Club',
                    symptomTrend: 'Stable BP & Glucose logs',
                  },
                  {
                    sector: 'Sector B — Karve Nagar Riverbank Lanes',
                    riskLevel: 'Seasonal Watch',
                    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
                    population: '390 Citizens (110 Seniors)',
                    topCondition: 'Post-Monsoon Viral Fever & Dengue Vector Cluster (9 cases)',
                    symptomTrend: '+18% AI Triage fever queries this week',
                  },
                  {
                    sector: 'Sector C — Paud Road Senior Housing',
                    riskLevel: 'Moderate NCD Risk',
                    badgeClass: 'bg-teal-100 text-teal-900 border-teal-300',
                    population: '360 Citizens (145 Seniors)',
                    topCondition: 'Type-2 Diabetes (29%) & Osteoarthritis Joint Care (22%)',
                    symptomTrend: 'High Chair Yoga & HbA1c camp demand',
                  },
                  {
                    sector: 'Sector D — Warje Malwadi Pocket',
                    riskLevel: 'High Priority Cluster',
                    badgeClass: 'bg-red-100 text-red-900 border-red-300',
                    population: '310 Citizens (80 Seniors)',
                    topCondition: 'Uncontrolled BP Spikes & Maternal/Child Immunization Gap',
                    symptomTrend: 'Needs Mobile Doctor Van & Jan Aushadhi restock',
                  },
                ].map((cluster, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-900 text-xs sm:text-sm">
                        {cluster.sector}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ${cluster.badgeClass}`}
                      >
                        {cluster.riskLevel}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-slate-600">{cluster.population}</p>
                    <p className="text-xs text-slate-800 font-medium">{cluster.topCondition}</p>
                    <p className="text-[11px] text-teal-800">{cluster.symptomTrend}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 5 Cols: Prevalent Health Conditions & Symptom Trends Chart */}
            <div className="lg:col-span-5 p-6 bg-white border border-slate-200 rounded-xl space-y-5">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-700" />
                  <span>Aggregated Condition Prevalence & Symptom Trends</span>
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Anonymized community morbidity distribution & AI Symptom Triage frequency.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    condition: 'Hypertension (High Blood Pressure)',
                    share: 34,
                    cases: '503 Citizens',
                    barColor: 'bg-teal-700',
                  },
                  {
                    condition: 'Type-2 Diabetes & Pre-Diabetes',
                    share: 26,
                    cases: '385 Citizens',
                    barColor: 'bg-emerald-600',
                  },
                  {
                    condition: 'Seasonal Viral Fever / Vector Surveillance',
                    share: 18,
                    cases: '266 Citizens',
                    barColor: 'bg-amber-500',
                  },
                  {
                    condition: 'Osteoarthritis, Bone Density & Fall Risk (60+)',
                    share: 14,
                    cases: '207 Citizens',
                    barColor: 'bg-sky-600',
                  },
                  {
                    condition: 'Respiratory / Asthma / Air Quality Sensitivity',
                    share: 8,
                    cases: '119 Citizens',
                    barColor: 'bg-indigo-600',
                  },
                ].map((row, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{row.condition}</span>
                      <span className="font-mono text-slate-600 tabular-nums">
                        {row.share}% ({row.cases})
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${row.barColor}`}
                        style={{ width: `${row.share}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Age Demographic Split */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Enrolled Population by Age Bracket
                </h4>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="text-slate-500 text-[11px]">Children (0–18)</p>
                    <p className="font-mono font-bold text-slate-900 text-sm mt-0.5">21.6%</p>
                    <p className="text-[10px] text-teal-700">320 Youth</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="text-slate-500 text-[11px]">Adults (19–59)</p>
                    <p className="font-mono font-bold text-slate-900 text-sm mt-0.5">43.2%</p>
                    <p className="text-[10px] text-teal-700">640 Adults</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-teal-50 border border-teal-200">
                    <p className="text-teal-800 text-[11px] font-medium">Seniors (60+)</p>
                    <p className="font-mono font-bold text-teal-950 text-sm mt-0.5">35.2%</p>
                    <p className="text-[10px] text-teal-800">520 Seniors</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODULE 2: OUTREACH & CAMPAIGN MANAGEMENT (BROADCASTS + CAMP SCHEDULER & CITIZEN REGISTRATION)
      ===================================================================== */}
      {activeSubTab === 'outreach' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 5 Cols: Multi-Channel Broadcast Announcements (SMS, Push, In-App Banner) */}
          <div className="lg:col-span-5 p-6 bg-white border border-slate-200 rounded-xl space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-teal-700" />
                <h3 className="font-semibold text-slate-900 text-base">
                  Multi-Channel Broadcast Announcements
                </h3>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Push targeted health alerts, vaccination camp reminders, or emergency advisories via SMS, Push Notifications, and In-App Banners.
              </p>
            </div>

            {broadcastSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{broadcastSuccess}</span>
              </div>
            )}

            <form onSubmit={handleBroadcastSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Announcement Headline *
                </label>
                <input
                  type="text"
                  value={advTitle}
                  onChange={(e) => setAdvTitle(e.target.value)}
                  placeholder="e.g., Free Ward 12 Dengue & Senior BP Checkup Tomorrow"
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alert Priority
                  </label>
                  <select
                    value={advUrgency}
                    onChange={(e) =>
                      setAdvUrgency(e.target.value as CommunityAdvisoryItem['urgency'])
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold bg-white"
                  >
                    <option value="Seasonal Alert">Seasonal Alert</option>
                    <option value="Urgent Drive">Urgent Vaccination / Camp Drive</option>
                    <option value="Routine Awareness">Routine Wellness Reminder</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Demographic Cohort
                  </label>
                  <select
                    value={targetCohort}
                    onChange={(e) => setTargetCohort(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold bg-white"
                  >
                    <option value="All Ward Citizens (1,480 Recipients)">
                      All Ward Citizens (1,480)
                    </option>
                    <option value="Senior Citizens 60+ (520 Recipients)">
                      Senior Citizens 60+ (520)
                    </option>
                    <option value="High-Risk BP & Diabetes Cohort (410 Recipients)">
                      BP & Diabetes Cohort (410)
                    </option>
                    <option value="Parents & Children Immunization (320 Recipients)">
                      Child Immunization (320)
                    </option>
                  </select>
                </div>
              </div>

              {/* Delivery Channels Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Delivery Channels (Select One or All) *
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {(['SMS', 'Push Notification', 'In-App Banner'] as const).map((ch) => {
                    const active = selectedChannels.includes(ch);
                    return (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => toggleChannel(ch)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                          active
                            ? 'bg-teal-700 text-white border-teal-700'
                            : 'bg-slate-50 text-slate-700 border-slate-300'
                        }`}
                      >
                        <Radio className="w-3 h-3" />
                        <span>{ch}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Advisory Message (Marathi / Hindi / English) *
                </label>
                <textarea
                  rows={3}
                  value={advMessage}
                  onChange={(e) => setAdvMessage(e.target.value)}
                  placeholder="Write actionable instructions, camp timings, or emergency helpline details..."
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Push Broadcast via SMS, Notification & In-App Banner</span>
              </button>
            </form>

            {/* Dispatched Broadcasts Feed */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Recent Broadcast Announcements ({advisories.length})
              </h4>
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {advisories.map((adv) => (
                  <div
                    key={adv.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-900">
                          {adv.urgency}
                        </span>
                        <h4 className="font-semibold text-slate-900 mt-1">{adv.title}</h4>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onSpeakText(`${adv.title}. ${adv.message}`)}
                          className="px-2 py-1 rounded border border-slate-200 bg-white text-teal-800 hover:bg-teal-50 inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Listen</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteAdvisory(adv.id)}
                          className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{adv.message}</p>
                    <p className="text-[10px] font-mono text-teal-800">
                      Channels: {(adv.channels || ['SMS', 'Push Notification', 'In-App Banner']).join(' · ')}{' '}
                      | Cohort: {adv.targetCohort || 'All Ward Citizens'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 7 Cols: Health Camp Scheduler & Citizen Registration Desk */}
          <div className="lg:col-span-7 p-6 bg-white border border-slate-200 rounded-xl space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-700" />
                <h3 className="font-semibold text-slate-900 text-base">
                  Health Camp Scheduler & Citizen Registration Desk
                </h3>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Plan local check-up camps, set participant capacity, and register community members for screenings or vaccinations.
              </p>
            </div>

            {/* Schedule New Camp Form */}
            <form
              onSubmit={handleCampSubmit}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
            >
              <h4 className="text-xs font-semibold text-teal-900 uppercase tracking-wider">
                1. Plan & Schedule New Health Check-Up Camp
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={campTitle}
                  onChange={(e) => setCampTitle(e.target.value)}
                  placeholder="Camp Title (e.g., Free Senior BP, Sugar & Cataract Camp)"
                  className="sm:col-span-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm"
                  required
                />
                <input
                  type="text"
                  value={campVenue}
                  onChange={(e) => setCampVenue(e.target.value)}
                  placeholder="Venue / Ward Hall"
                  className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm"
                  required
                />
                <input
                  type="text"
                  value={campTarget}
                  onChange={(e) => setCampTarget(e.target.value)}
                  placeholder="Target Group (e.g. Seniors 60+)"
                  className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm"
                />
                <input
                  type="date"
                  value={campDate}
                  onChange={(e) => setCampDate(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-mono"
                  required
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={10}
                    max={1000}
                    value={campCapacity}
                    onChange={(e) => setCampCapacity(Number(e.target.value) || 100)}
                    placeholder="Capacity"
                    className="w-24 rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs font-mono"
                  />
                  <button
                    type="submit"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Schedule Camp</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Register Community Member into a Scheduled Camp */}
            <form
              onSubmit={handleRegisterCitizenToCamp}
              className="p-4 rounded-xl bg-teal-50/50 border border-teal-200 space-y-3"
            >
              <h4 className="text-xs font-semibold text-teal-950 uppercase tracking-wider flex items-center gap-1.5">
                <UserPlus className="w-3.5 h-3.5 text-teal-700" />
                <span>2. Register Community Member for Health Camp</span>
              </h4>

              {regBanner && (
                <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-950 text-xs font-semibold">
                  {regBanner}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <select
                  value={selectedCampForReg || camps[0]?.id || ''}
                  onChange={(e) => setSelectedCampForReg(e.target.value)}
                  className="sm:col-span-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900"
                >
                  {camps.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.campDate})
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={regCitizenName}
                  onChange={(e) => setRegCitizenName(e.target.value)}
                  placeholder="Citizen Full Name *"
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs"
                  required
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={regCitizenAge}
                    onChange={(e) => setRegCitizenAge(Number(e.target.value))}
                    placeholder="Age"
                    className="w-20 rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs font-mono"
                    required
                  />
                  <input
                    type="tel"
                    value={regCitizenPhone}
                    onChange={(e) => setRegCitizenPhone(e.target.value)}
                    placeholder="Mobile Number *"
                    className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-mono"
                    required
                  />
                </div>
                <input
                  type="text"
                  value={regScreeningType}
                  onChange={(e) => setRegScreeningType(e.target.value)}
                  placeholder="Screening / Vaccine Required"
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-teal-700 text-white text-xs font-semibold py-2 px-4 hover:bg-teal-800 cursor-pointer"
                >
                  Confirm Citizen Registration
                </button>
              </div>
            </form>

            {/* Scheduled Camps & Registered Citizens List */}
            <div className="space-y-3">
              {camps.map((camp) => {
                const extraParts = localRegistrations[camp.id] || [];
                const allParts = [...extraParts, ...(camp.participants || [])];
                const totalReg = (camp.registeredCount || 60) + extraParts.length;
                const cap = camp.capacity || 120;

                return (
                  <div
                    key={camp.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-900">
                            {camp.status}
                          </span>
                          <span className="text-xs font-mono font-semibold text-emerald-800">
                            {totalReg} / {cap} Citizens Registered
                          </span>
                        </div>
                        <h4 className="font-semibold text-slate-900 text-sm mt-1">
                          {camp.title}
                        </h4>
                        <p className="text-xs text-slate-600">
                          {camp.wardVenue} · {camp.campDate} ({camp.campTime})
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {camp.status !== 'Completed' && (
                          <button
                            type="button"
                            onClick={() => onUpdateCampStatus(camp.id, 'Completed')}
                            className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-900 text-xs font-semibold cursor-pointer"
                          >
                            Complete
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onDeleteCamp(camp.id)}
                          className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {allParts.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
                        <span className="font-semibold text-slate-800">Recent Registrants:</span>
                        {allParts.slice(0, 4).map((p) => (
                          <span
                            key={p.id}
                            className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200"
                          >
                            {p.name} ({p.age}y · {p.screeningNeeded})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODULE 3: RESOURCE & STAKEHOLDER COORDINATION (DOCTOR BANDWIDTH + GRIEVANCE TICKETING)
      ===================================================================== */}
      {activeSubTab === 'coordination' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 5 Cols: Doctor Availability & Bandwidth Overview Across Ward Pockets */}
          <div className="lg:col-span-5 p-6 bg-white border border-slate-200 rounded-xl space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-teal-700" />
                <h3 className="font-semibold text-slate-900 text-base">
                  Doctor Availability & Jurisdiction Bandwidth
                </h3>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Monitor doctor consultation load across ward pockets to identify under-served areas and deploy mobile medical support.
              </p>
            </div>

            {deploymentNotice && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{deploymentNotice}</span>
              </div>
            )}

            <div className="space-y-3">
              {doctorBandwidthList.map((doc) => {
                const loadPct = Math.min(
                  100,
                  Math.round((doc.bookedToday / doc.dailyCapacity) * 100)
                );
                return (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2.5 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm">{doc.name}</h4>
                        <p className="text-teal-800 font-medium">{doc.specialty}</p>
                        <p className="text-slate-600 mt-0.5">{doc.pocketLocation}</p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                          doc.pocketStatus === 'Under-Served Pocket'
                            ? 'bg-red-100 text-red-900 border border-red-300'
                            : doc.pocketStatus === 'High Load'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}
                      >
                        {doc.pocketStatus}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <span>
                          Daily Bandwidth: {doc.bookedToday}/{doc.dailyCapacity} Consults
                        </span>
                        <span>{loadPct}% Load</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            loadPct >= 90
                              ? 'bg-red-600'
                              : loadPct >= 80
                              ? 'bg-amber-500'
                              : 'bg-teal-700'
                          }`}
                          style={{ width: `${loadPct}%` }}
                        />
                      </div>
                    </div>

                    {doc.pocketStatus === 'Under-Served Pocket' && (
                      <button
                        type="button"
                        onClick={() => handleDeployMobileDoctor(doc.id)}
                        className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs cursor-pointer"
                      >
                        Allocate Visiting Doctor & Mobile Van (+15 Slots)
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 7 Cols: Grievance & Support Ticketing Queue */}
          <div className="lg:col-span-7 p-6 bg-white border border-slate-200 rounded-xl space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-teal-700" />
                  <span>Community Grievance & Support Ticketing Queue</span>
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Handle escalations regarding medical access, medicine shortages, app assistance, or administrative bottlenecks.
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                {(['All', 'Open', 'In Progress', 'Resolved'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setTicketFilter(st)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border cursor-pointer ${
                      ticketFilter === st
                        ? 'bg-teal-700 text-white border-teal-700'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Log New Community Escalation / Ticket */}
            <form
              onSubmit={handleAddGrievanceTicket}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
            >
              <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                Log New Citizen Escalation / Support Ticket
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input
                  type="text"
                  value={newGrvName}
                  onChange={(e) => setNewGrvName(e.target.value)}
                  placeholder="Citizen Name & Age *"
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs"
                  required
                />
                <input
                  type="text"
                  value={newGrvPhone}
                  onChange={(e) => setNewGrvPhone(e.target.value)}
                  placeholder="Contact Phone"
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-mono"
                />
                <input
                  type="text"
                  value={newGrvPocket}
                  onChange={(e) => setNewGrvPocket(e.target.value)}
                  placeholder="Ward Pocket / Area"
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs"
                />
                <select
                  value={newGrvCat}
                  onChange={(e) =>
                    setNewGrvCat(e.target.value as GrievanceTicketItem['category'])
                  }
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold"
                >
                  <option value="Medical Access">Medical Access</option>
                  <option value="Medicine Shortage">Medicine Shortage</option>
                  <option value="App / Technical Issue">App / Technical Issue</option>
                  <option value="Admin Bottleneck">Admin Bottleneck</option>
                </select>
                <select
                  value={newGrvPriority}
                  onChange={(e) =>
                    setNewGrvPriority(e.target.value as GrievanceTicketItem['priority'])
                  }
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold"
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-700 text-white text-xs font-semibold py-2 px-3 hover:bg-teal-800 cursor-pointer"
                >
                  + Create Ticket
                </button>
                <input
                  type="text"
                  value={newGrvDesc}
                  onChange={(e) => setNewGrvDesc(e.target.value)}
                  placeholder="Describe medical access issue, medicine shortage, or escalation details... *"
                  className="sm:col-span-3 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs"
                  required
                />
              </div>
            </form>

            {/* Tickets List */}
            <div className="space-y-3">
              {filteredGrievances.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-teal-900">{ticket.id}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          ticket.priority === 'High'
                            ? 'bg-red-100 text-red-900'
                            : ticket.priority === 'Medium'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {ticket.priority} Priority
                      </span>
                      <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-900 font-semibold">
                        {ticket.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-semibold ${
                          ticket.status === 'Resolved'
                            ? 'bg-emerald-100 text-emerald-900'
                            : ticket.status === 'In Progress'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-red-50 text-red-800'
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      {ticket.createdAt}
                    </span>
                  </div>

                  <p className="font-semibold text-slate-900">
                    {ticket.citizenName} ({ticket.citizenPhone}) · {ticket.wardPocket}
                  </p>
                  <p className="text-slate-600 leading-relaxed">{ticket.description}</p>

                  {ticket.resolutionNote && (
                    <p className="p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-950 font-medium">
                      Action Note: {ticket.resolutionNote}
                    </p>
                  )}

                  {ticket.status !== 'Resolved' && (
                    <div className="pt-1.5 flex items-center gap-2">
                      {ticket.status === 'Open' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateTicketStatus(ticket.id, 'In Progress')}
                          className="px-3 py-1 rounded-lg bg-amber-100 text-amber-900 font-semibold hover:bg-amber-200 cursor-pointer"
                        >
                          Mark In Progress
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleUpdateTicketStatus(ticket.id, 'Resolved')}
                        className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 cursor-pointer"
                      >
                        Resolve Escalation
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODULE 4: RESOURCE REPOSITORY (LOCAL POLICY, EMERGENCY DIRECTORIES & AWARENESS GUIDES)
      ===================================================================== */}
      {activeSubTab === 'repository' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 5 Cols: Upload Regional Health Policy / Guide / Directory */}
          <div className="lg:col-span-5 p-6 bg-white border border-slate-200 rounded-xl space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-teal-700" />
                <h3 className="font-semibold text-slate-900 text-base">
                  Upload Regional Policy, Directory or Awareness Guide
                </h3>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Share regional health guidelines, emergency contact directories, and localized awareness material for field workers and citizens.
              </p>
            </div>

            {resSavedBanner && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{resSavedBanner}</span>
              </div>
            )}

            <form onSubmit={handleUploadPolicyResource} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Document / Resource Title *
                </label>
                <input
                  type="text"
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  placeholder="e.g., Ward 12 Senior Citizen Heatwave & Hydration Protocol"
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Resource Category
                  </label>
                  <select
                    value={resCategory}
                    onChange={(e) =>
                      setResCategory(e.target.value as PolicyResourceItem['category'])
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold bg-white"
                  >
                    <option value="Regional Health Policy">Regional Health Policy</option>
                    <option value="Emergency Contact Directory">
                      Emergency Contact Directory
                    </option>
                    <option value="Localized Awareness Material">
                      Localized Awareness Material
                    </option>
                    <option value="Field Worker Protocol">Field Worker Protocol</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Languages Covered
                  </label>
                  <select
                    value={resLangTag}
                    onChange={(e) =>
                      setResLangTag(e.target.value as PolicyResourceItem['languageTag'])
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold bg-white"
                  >
                    <option value="Marathi / Hindi / English">
                      Marathi / Hindi / English
                    </option>
                    <option value="Marathi">Marathi (मराठी)</option>
                    <option value="Hindi">Hindi (हिंदी)</option>
                    <option value="English">English</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Policy Guidelines / Awareness Content *
                </label>
                <textarea
                  rows={4}
                  value={resSummary}
                  onChange={(e) => setResSummary(e.target.value)}
                  placeholder="Enter key protocol steps, eligibility rules, or preventive care guidelines..."
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Emergency Hotlines / Directory Numbers (Optional)
                </label>
                <input
                  type="text"
                  value={resContacts}
                  onChange={(e) => setResContacts(e.target.value)}
                  placeholder="e.g., Ward Control Room: 020-25501234 | Ambulance: 108"
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 cursor-pointer"
              >
                Publish to Regional Resource Repository
              </button>
            </form>
          </div>

          {/* Right 7 Cols: Published Regional Policy & Guide Repository */}
          <div className="lg:col-span-7 p-6 bg-white border border-slate-200 rounded-xl space-y-4">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-700" />
                <h3 className="font-semibold text-slate-900 text-base">
                  Regional Policy, Directory & Awareness Repository ({resources.length})
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              {resources.map((res) => (
                <div
                  key={res.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-semibold text-[10px]">
                        {res.category}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-medium text-[10px]">
                        {res.languageTag}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      Updated: {res.updatedAt}
                    </span>
                  </div>

                  <h4 className="font-semibold text-slate-900 text-sm">{res.title}</h4>
                  <p className="text-slate-600 leading-relaxed">{res.summary}</p>

                  {res.emergencyContacts && (
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200 font-mono text-[11px] text-teal-900">
                      {res.emergencyContacts}
                    </div>
                  )}

                  <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Published by: {res.author}</span>
                    <button
                      type="button"
                      onClick={() =>
                        onSpeakText(
                          `${res.title}. ${res.summary}. ${res.emergencyContacts || ''}`
                        )
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-slate-200 bg-white text-teal-800 font-semibold hover:bg-teal-50 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen Audio Guide</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
