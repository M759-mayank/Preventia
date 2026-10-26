import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Language } from '../i18n/translations';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  MessageSquare,
  Calendar,
  Send,
  Activity,
  CheckCircle2,
  Clock,
  UserPlus,
  Stethoscope,
  PhoneCall,
  Trash2,
  Building2,
  Share2,
  HeartHandshake,
  AlertCircle,
  Volume2,
  Smartphone,
  Copy,
  Check,
  PhoneIncoming,
  Radio,
} from 'lucide-react';

export interface PersonalDoctorItem {
  id: string;
  name: string;
  specialty: string;
  relationType:
    | 'Regular Family Doctor'
    | 'Related / Family Doctor'
    | 'Personal Specialist'
    | 'Visiting Doctor';
  hospital: string;
  contactPhone: string;
}

export interface AppointmentItem {
  id: string;
  doctorName: string;
  specialty: string;
  appointmentDate: string;
  appointmentTime: string;
  consultType: 'Video' | 'In-Person';
  reason: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export interface ChatMessageItem {
  id: string;
  doctorId: string;
  sender: 'patient' | 'doctor';
  text: string;
  timestamp: string;
}

const RELATION_TYPES: PersonalDoctorItem['relationType'][] = [
  'Regular Family Doctor',
  'Related / Family Doctor',
  'Personal Specialist',
  'Visiting Doctor',
];

function getNormalizedRoomKey(phoneOrId: string): string {
  const digits = (phoneOrId || '').replace(/\D/g, '');
  if (digits.length >= 10) {
    return digits.slice(-10);
  }
  return (phoneOrId || 'default-room').replace(/[^a-zA-Z0-9_-]/g, '') || 'default-room';
}

export const TelemedicineSection: React.FC<{
  language: Language;
  seniorMode: boolean;
  userAge: number;
  isDoctorRole?: boolean;
  patientName?: string;
  patientPhone?: string;
  latestVitals: { systolic: number; diastolic: number; heartRate: number; bloodSugar: number };
  personalDoctors: PersonalDoctorItem[];
  onAddPersonalDoctor: (doc: Omit<PersonalDoctorItem, 'id'>) => Promise<void>;
  onDeletePersonalDoctor: (id: string) => Promise<void>;
  appointments: AppointmentItem[];
  onBookAppointment: (appt: Omit<AppointmentItem, 'id' | 'status'>) => Promise<void>;
  onUpdateAppointmentStatus: (id: string, status: 'Completed' | 'Cancelled') => Promise<void>;
  chatMessages: ChatMessageItem[];
  onSendChatMessage: (doctorId: string, sender: 'patient' | 'doctor', text: string) => Promise<void>;
  onSpeakText?: (text: string) => void;
}> = ({
  language,
  seniorMode,
  userAge,
  isDoctorRole = false,
  patientName = 'Community Patient',
  patientPhone = '+91 9800000000',
  latestVitals,
  personalDoctors,
  onAddPersonalDoctor,
  onDeletePersonalDoctor,
  appointments,
  onBookAppointment,
  onUpdateAppointmentStatus,
  chatMessages,
  onSendChatMessage,
  onSpeakText,
}) => {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    personalDoctors[0]?.id || ''
  );
  const [showAddForm, setShowAddForm] = useState<boolean>(personalDoctors.length === 0);

  // Add Personal/Related Doctor Form State
  const [docName, setDocName] = useState('');
  const [docSpecialty, setDocSpecialty] = useState('');
  const [docRelation, setDocRelation] =
    useState<PersonalDoctorItem['relationType']>('Regular Family Doctor');
  const [docHospital, setDocHospital] = useState('');
  const [docCountryCode, setDocCountryCode] = useState('+91');
  const [docPhone, setDocPhone] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [savingDoc, setSavingDoc] = useState(false);

  // Live Call & Receiver State
  const [callStatus, setCallStatus] = useState<'idle' | 'ringing' | 'connected'>('idle');
  const [callMode, setCallMode] = useState<'voice' | 'video'>('video');
  const [callSeconds, setCallSeconds] = useState<number>(0);
  const [autoAnswerCountdown, setAutoAnswerCountdown] = useState<number | null>(null);
  const [camActive, setCamActive] = useState(true);
  const [micActive, setMicActive] = useState(true);
  const [speakerVoiceEnabled, setSpeakerVoiceEnabled] = useState(true);
  const [camError, setCamError] = useState<string | null>(null);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [inCallSpeechInput, setInCallSpeechInput] = useState('');
  const [doctorSpeakingNow, setDoctorSpeakingNow] = useState(false);
  const [lastDoctorSpokenText, setLastDoctorSpokenText] = useState<string>('');

  // Doctor Receiver Console (Only visible for Doctor role or when opened via ?doctorRoom= link)
  const [showDoctorReceiverConsole, setShowDoctorReceiverConsole] = useState<boolean>(isDoctorRole);
  const [manualDoctorMode, setManualDoctorMode] = useState<boolean>(false);
  const [doctorConsoleReplyInput, setDoctorConsoleReplyInput] = useState<string>('');
  const [copiedRoomLink, setCopiedRoomLink] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const ringAudioCtxRef = useRef<AudioContext | null>(null);
  const ringIntervalRef = useRef<number | null>(null);
  const callTimerRef = useRef<number | null>(null);
  const seenServerMsgIdsRef = useRef<Set<string>>(new Set());

  // Chat state
  const [chatInput, setChatInput] = useState('');
  const [sendingChat, setSendingChat] = useState(false);

  // Appointment form state
  const [apptDate, setApptDate] = useState('2026-09-28');
  const [apptTime, setApptTime] = useState('10:30 AM');
  const [consultType, setConsultType] = useState<'Video' | 'In-Person'>('Video');
  const [reason, setReason] = useState('');

  // Check URL params for ?doctorRoom=
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('doctorRoom')) {
      setShowDoctorReceiverConsole(true);
      setManualDoctorMode(true);
    }
  }, []);

  // Keep selectedDoctorId synced when personalDoctors changes
  useEffect(() => {
    if (personalDoctors.length === 0) {
      setSelectedDoctorId('');
      setShowAddForm(true);
    } else if (!personalDoctors.some((d) => d.id === selectedDoctorId)) {
      setSelectedDoctorId(personalDoctors[0].id);
    }
  }, [personalDoctors, selectedDoctorId]);

  const selectedDoctor =
    personalDoctors.find((d) => d.id === selectedDoctorId) || personalDoctors[0] || null;

  // Web Audio Ringing Tone Generator (plays realistic phone ringback when calling doctor)
  const stopRingingTone = useCallback(() => {
    if (ringIntervalRef.current) {
      window.clearInterval(ringIntervalRef.current);
      ringIntervalRef.current = null;
    }
    if (ringAudioCtxRef.current) {
      ringAudioCtxRef.current.close().catch(() => {});
      ringAudioCtxRef.current = null;
    }
  }, []);

  const startRingingTone = useCallback(() => {
    stopRingingTone();
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      ringAudioCtxRef.current = ctx;

      const playRingPulse = () => {
        if (!ringAudioCtxRef.current || ringAudioCtxRef.current.state === 'closed') return;
        try {
          const now = ctx.currentTime;
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();

          osc1.type = 'sine';
          osc2.type = 'sine';
          osc1.frequency.setValueAtTime(400, now);
          osc2.frequency.setValueAtTime(450, now);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.exponentialRampToValueAtTime(0.12, now + 0.04);
          gain.gain.setValueAtTime(0.12, now + 0.38);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

          gain.gain.setValueAtTime(0.001, now + 0.6);
          gain.gain.exponentialRampToValueAtTime(0.12, now + 0.64);
          gain.gain.setValueAtTime(0.12, now + 0.98);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 1.02);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 1.05);
          osc2.stop(now + 1.05);
        } catch {
          // Ignore audio context restrictions
        }
      };

      playRingPulse();
      ringIntervalRef.current = window.setInterval(playRingPulse, 2600);
    } catch {
      // Ignore if Web Audio API unavailable
    }
  }, [stopRingingTone]);

  const stopMediaStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  // Call duration timer when connected
  useEffect(() => {
    if (callStatus === 'connected') {
      callTimerRef.current = window.setInterval(() => {
        setCallSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) {
        window.clearInterval(callTimerRef.current);
        callTimerRef.current = null;
      }
      if (callStatus === 'idle') {
        setCallSeconds(0);
      }
    }
    return () => {
      if (callTimerRef.current) {
        window.clearInterval(callTimerRef.current);
      }
    };
  }, [callStatus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRingingTone();
      stopMediaStream();
    };
  }, [stopRingingTone, stopMediaStream]);

  // Speak helper for doctor voice during call or chat
  const speakDoctorResponse = useCallback(
    (text: string) => {
      if (!text) return;
      setLastDoctorSpokenText(text);
      setDoctorSpeakingNow(true);
      setTimeout(() => setDoctorSpeakingNow(false), 6500);
      if (speakerVoiceEnabled && onSpeakText) {
        onSpeakText(text);
      }
    },
    [speakerVoiceEnabled, onSpeakText]
  );

  // Answer the ringing call (can be triggered by Doctor Receiver Console OR automatic pickup)
  const handleAnswerIncomingCall = useCallback(
    async (answeredBy: 'human_doctor' | 'auto_connect' = 'auto_connect') => {
      if (!selectedDoctor) return;
      stopRingingTone();
      setAutoAnswerCountdown(null);
      setCallStatus('connected');
      setCallSeconds(0);

      const roomKey = getNormalizedRoomKey(selectedDoctor.contactPhone || selectedDoctor.id);
      try {
        const res = await fetch('/api/teleconsult/call-action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roomKey,
            action: 'answer',
            answeredBy,
            doctorName: selectedDoctor.name,
            doctorSpecialty: `${selectedDoctor.relationType} (${selectedDoctor.specialty})`,
            doctorPhone: selectedDoctor.contactPhone,
            patientName,
            patientPhone,
            patientAge: userAge,
            vitals: latestVitals,
            language,
          }),
        });
        const data = await res.json();
        if (data.greeting) {
          await onSendChatMessage(selectedDoctor.id, 'doctor', data.greeting);
          speakDoctorResponse(data.greeting);
        }
      } catch {
        const fallbackGreeting =
          language === 'mr'
            ? `नमस्कार ${patientName}, मी ${selectedDoctor.name} बोलत आहे. तुमचा कॉल जोडला गेला आहे. तुमचे बीपी (${latestVitals.systolic}/${latestVitals.diastolic}) आणि शुगर (${latestVitals.bloodSugar}) रीडिंग माझ्यासमोर आहे. तुम्हाला काय त्रास होत आहे ते सांगा.`
            : language === 'hi'
            ? `नमस्ते ${patientName}, मैं ${selectedDoctor.name} बोल रहा हूँ। आपकी कॉल कनेक्ट हो गई है। बताइए आज आपको कैसा महसूस हो रहा है?`
            : `Hello ${patientName}, this is ${selectedDoctor.name} on the line. Your call is connected and I have your vitals (${latestVitals.systolic}/${latestVitals.diastolic} mmHg). How are you feeling today?`;
        await onSendChatMessage(selectedDoctor.id, 'doctor', fallbackGreeting);
        speakDoctorResponse(fallbackGreeting);
      }
    },
    [
      selectedDoctor,
      stopRingingTone,
      patientName,
      patientPhone,
      userAge,
      latestVitals,
      language,
      onSendChatMessage,
      speakDoctorResponse,
    ]
  );

  // Auto-answer countdown while ringing (if manualDoctorMode is off, doctor picks up in 4 seconds; even in manual mode, user can click "Answer Call" on Doctor Receiver panel immediately)
  useEffect(() => {
    if (callStatus !== 'ringing') {
      setAutoAnswerCountdown(null);
      return;
    }
    if (manualDoctorMode) {
      // Wait for user to click "Answer Call" in Doctor Receiver Console, or they can click Connect Anytime
      setAutoAnswerCountdown(null);
      return;
    }

    setAutoAnswerCountdown(4);
    const interval = window.setInterval(() => {
      setAutoAnswerCountdown((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          window.clearInterval(interval);
          handleAnswerIncomingCall('auto_connect');
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [callStatus, manualDoctorMode, handleAnswerIncomingCall]);

  // Start Live Voice or Video Call to Selected Doctor
  const startLiveCall = async (mode: 'voice' | 'video', docOverride?: PersonalDoctorItem) => {
    const targetDoc = docOverride || selectedDoctor;
    if (!targetDoc) return;
    if (docOverride && docOverride.id !== selectedDoctorId) {
      setSelectedDoctorId(docOverride.id);
    }

    setCamError(null);
    setCallMode(mode);
    setCallStatus('ringing');
    setShowDoctorReceiverConsole(true);
    startRingingTone();

    const roomKey = getNormalizedRoomKey(targetDoc.contactPhone || targetDoc.id);
    fetch('/api/teleconsult/call-action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomKey,
        action: 'start',
        callType: mode,
        initiatedBy: 'patient',
        doctorName: targetDoc.name,
        doctorSpecialty: `${targetDoc.relationType} (${targetDoc.specialty})`,
        doctorPhone: targetDoc.contactPhone,
        patientName,
        patientPhone,
        patientAge: userAge,
        vitals: latestVitals,
        language,
      }),
    }).catch(() => {});

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: mode === 'video',
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current && mode === 'video') {
        videoRef.current.srcObject = stream;
      }
      setCamActive(mode === 'video');
      setMicActive(true);
    } catch {
      setCamError(
        language === 'mr'
          ? 'सुरक्षित व्हॉइस आणि लाईव्ह हेल्थ मॉनिटरिंग कॉल सुरू आहे.'
          : language === 'hi'
          ? 'सुरक्षित वॉइस और लाइव हेल्थ मॉनिटरिंग कॉल सक्रिय है।'
          : 'Secure Voice & Live Patient Vitals Telemetry Call Active.'
      );
    }
  };

  const endLiveCall = async () => {
    stopRingingTone();
    stopMediaStream();
    setCallStatus('idle');
    setAutoAnswerCountdown(null);
    if (selectedDoctor) {
      const roomKey = getNormalizedRoomKey(selectedDoctor.contactPhone || selectedDoctor.id);
      fetch('/api/teleconsult/call-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomKey,
          action: 'end',
        }),
      }).catch(() => {});
    }
  };

  // Poll shared room every 2 seconds so cross-tab / cross-device Doctor Receiver Console and Patient stay synced
  useEffect(() => {
    if (!selectedDoctor) return;
    const roomKey = getNormalizedRoomKey(selectedDoctor.contactPhone || selectedDoctor.id);

    const pollInterval = window.setInterval(async () => {
      try {
        const res = await fetch(
          `/api/teleconsult/room/${encodeURIComponent(roomKey)}${
            manualDoctorMode ? '?role=doctor' : ''
          }`
        );
        if (!res.ok) return;
        const room = await res.json();

        // Sync remote call answer/end across tabs
        if (room.callStatus === 'connected' && callStatus === 'ringing') {
          stopRingingTone();
          setCallStatus('connected');
        } else if (
          (room.callStatus === 'ended' || room.callStatus === 'declined') &&
          callStatus !== 'idle'
        ) {
          stopRingingTone();
          stopMediaStream();
          setCallStatus('idle');
        }

        // Sync any new messages sent from another tab's Doctor Console
        if (Array.isArray(room.messages)) {
          for (const m of room.messages) {
            if (!seenServerMsgIdsRef.current.has(m.id)) {
              seenServerMsgIdsRef.current.add(m.id);
            }
          }
        }
      } catch {
        // Ignore transient network poll error
      }
    }, 2200);

    return () => window.clearInterval(pollInterval);
  }, [selectedDoctor, callStatus, manualDoctorMode, stopRingingTone, stopMediaStream]);

  const toggleCamera = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach((t) => {
        t.enabled = !camActive;
      });
    }
    setCamActive(!camActive);
  };

  const toggleMic = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((t) => {
        t.enabled = !micActive;
      });
    }
    setMicActive(!micActive);
  };

  // Live Microphone Speech-to-Text during call so patient can speak directly to the doctor
  const handleListenPatientSpeech = () => {
    const SpeechRec =
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any })
        .SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRec) {
      // Focus the in-call speech text input if browser doesn't support SpeechRecognition
      const el = document.getElementById('in-call-speech-input');
      if (el) el.focus();
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang =
        language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListeningMic(true);
      recognition.onresult = async (event: any) => {
        const spokenText = event.results?.[0]?.[0]?.transcript || '';
        setIsListeningMic(false);
        if (spokenText.trim()) {
          await sendMessageToDoctor(spokenText.trim(), true);
        }
      };
      recognition.onerror = () => {
        setIsListeningMic(false);
      };
      recognition.onend = () => {
        setIsListeningMic(false);
      };
      recognition.start();
    } catch {
      setIsListeningMic(false);
    }
  };

  const formatCallTime = (secs: number) => {
    const mins = Math.floor(secs / 60)
      .toString()
      .padStart(2, '0');
    const rem = (secs % 60).toString().padStart(2, '0');
    return `${mins}:${rem}`;
  };

  const labels = {
    en: {
      heading: 'My Regular & Related Doctors — Live Call, Chat & Appointments',
      subheading:
        'Add your regular family doctor or relative doctor. Call them directly with live voice/video, send instant messages, share BP/Sugar vitals, or book appointments.',
      addDoctorBtn: '+ Add Regular / Related Doctor',
      hideFormBtn: 'Hide Form',
      formTitle: 'Add Your Regular or Family/Related Doctor',
      formSubtitle:
        'Save your trusted doctor details once to enable direct voice/video calls, consultation chat, WhatsApp vitals sharing, and appointment scheduling.',
      docNameLabel: 'Doctor Full Name *',
      docNamePlaceholder: 'e.g., Dr. Vivek Patil, MBBS, MD',
      relationLabel: 'Doctor Relationship / Type *',
      specialtyLabel: 'Specialty / Qualification *',
      specialtyPlaceholder: 'e.g., Family Physician, Cardiologist, Diabetologist',
      hospitalLabel: 'Clinic / Hospital Name & Area *',
      hospitalPlaceholder: 'e.g., Patil Clinic, Kothrud, Pune',
      phoneLabel: 'Doctor Contact / WhatsApp Number *',
      phonePlaceholder: '10-digit mobile number (e.g. 9822011223)',
      saveDoctorBtn: 'Save Doctor to My Care Team',
      savingDoctorText: 'Saving Doctor...',
      errMissingFields:
        'Please fill in Doctor Name, Specialty, Clinic Name, and a valid 10-digit Contact Number.',
      noDoctorsTitle: 'No Regular or Related Doctors Added Yet',
      noDoctorsDesc:
        'Use the form above to add your regular family physician, relative doctor, or personal specialist. Once added, you can call them, message them, share your BP/Sugar vitals, or book appointments.',
      myDoctorsHeading: 'Your Saved Regular & Related Doctors',
      voiceCallBtn: 'Voice Call Doctor',
      videoCallBtn: 'Video Call',
      whatsappShareBtn: 'WhatsApp Call / Vitals',
      simDialBtn: 'Phone Dialer',
      endVideo: 'End Call',
      liveMonitoring: 'Live Remote Patient Vitals Shared with Doctor',
      chatTitle: 'Direct Doctor Communication & Vitals Chat',
      shareVitalsInChatBtn: 'Send Today’s BP & Sugar to Chat',
      chatPlaceholder: 'Write a message to your doctor about symptoms, reports, or medicines...',
      sendBtn: 'Send Message',
      bookTitle: 'Book Appointment with Selected Doctor',
      reasonPlaceholder: 'Reason for visit (e.g., Monthly BP & Sugar review, prescription refill)',
      bookBtn: 'Confirm Appointment',
      upcomingTitle: 'Your Scheduled Appointments',
      noAppointments: 'No appointments booked yet.',
      markDone: 'Complete',
      cancelBtn: 'Cancel',
      doctorReceiverTitle: 'Doctor’s Live Receiver Console (Incoming Call & Message View)',
      doctorReceiverSub:
        'See what your doctor receives in real time, answer incoming calls as the doctor, or share the room link to another phone/tab.',
      relationTranslations: {
        'Regular Family Doctor': 'Regular Family Doctor',
        'Related / Family Doctor': 'Related / Family Doctor',
        'Personal Specialist': 'Personal Specialist',
        'Visiting Doctor': 'Visiting Doctor',
      },
    },
    hi: {
      heading: 'मेरे नियमित और पारिवारिक डॉक्टर — लाइव कॉल, चैट और अपॉइंटमेंट',
      subheading:
        'अपने नियमित फैमिली डॉक्टर या रिश्तेदार डॉक्टर को जोड़ें। उनसे सीधे वॉइस/वीडियो कॉल पर बात करें, संदेश भेजें, बीपी/शुगर साझा करें और अपॉइंटमेंट बुक करें।',
      addDoctorBtn: '+ नियमित / संबंधित डॉक्टर जोड़ें',
      hideFormBtn: 'फॉर्म छुपाएं',
      formTitle: 'अपने नियमित या पारिवारिक/संबंधित डॉक्टर को जोड़ें',
      formSubtitle:
        'अपने विश्वसनीय डॉक्टर का नाम और मोबाइल नंबर सेव करें ताकि आप उनसे सीधे कॉल, चैट और अपॉइंटमेंट बुक कर सकें।',
      docNameLabel: 'डॉक्टर का पूरा नाम *',
      docNamePlaceholder: 'उदा. डॉ. विवेक पाटिल, MBBS, MD',
      relationLabel: 'डॉक्टर से संबंध / श्रेणी *',
      specialtyLabel: 'विशेषज्ञता / योग्यता (Specialty) *',
      specialtyPlaceholder: 'उदा. फैमिली फिजिशियन, हृदय रोग विशेषज्ञ, मधुमेह विशेषज्ञ',
      hospitalLabel: 'क्लिनिक / अस्पताल का नाम और क्षेत्र *',
      hospitalPlaceholder: 'उदा. पाटिल क्लिनिक, कोथरूड, पुणे',
      phoneLabel: 'डॉक्टर का संपर्क / WhatsApp नंबर *',
      phonePlaceholder: '10 अंकों का मोबाइल नंबर (उदा. 9822011223)',
      saveDoctorBtn: 'डॉक्टर को मेरी सूची में जोड़ें',
      savingDoctorText: 'डॉक्टर सेव हो रहे हैं...',
      errMissingFields:
        'कृपया डॉक्टर का नाम, विशेषज्ञता, क्लिनिक का नाम और सही 10 अंकों का मोबाइल नंबर दर्ज करें।',
      noDoctorsTitle: 'अभी तक कोई नियमित या संबंधित डॉक्टर नहीं जोड़ा गया है',
      noDoctorsDesc:
        'ऊपर दिए गए फॉर्म में अपने फैमिली डॉक्टर या रिश्तेदार डॉक्टर का विवरण भरें। जोड़ने के बाद आप उनसे सीधे कॉल, चैट, वीडियो परामर्श और अपॉइंटमेंट बुक कर सकते हैं।',
      myDoctorsHeading: 'आपके जोड़े गए नियमित और संबंधित डॉक्टर',
      voiceCallBtn: 'वॉइस कॉल करें',
      videoCallBtn: 'वीडियो कॉल',
      whatsappShareBtn: 'WhatsApp कॉल/अपडेट',
      simDialBtn: 'मोबाइल डायलर',
      endVideo: 'कॉल समाप्त करें',
      liveMonitoring: 'डॉक्टर के साथ साझा लाइव स्वास्थ्य डेटा (Remote Monitoring)',
      chatTitle: 'डॉक्टर से सीधा संवाद और स्वास्थ्य चैट',
      shareVitalsInChatBtn: 'आज का बीपी और शुगर चैट में भेजें',
      chatPlaceholder: 'अपने डॉक्टर को लक्षण, रिपोर्ट या दवाइयों के बारे में संदेश लिखें...',
      sendBtn: 'संदेश भेजें',
      bookTitle: 'चयनित डॉक्टर के साथ अपॉइंटमेंट बुक करें',
      reasonPlaceholder: 'परामर्श का कारण (जैसे: मासिक बीपी और शुगर जांच)',
      bookBtn: 'अपॉइंटमेंट बुक करें',
      upcomingTitle: 'आपकी निर्धारित अपॉइंटमेंट्स',
      noAppointments: 'अभी कोई अपॉइंटमेंट बुक नहीं है।',
      markDone: 'पूर्ण',
      cancelBtn: 'रद्द करें',
      doctorReceiverTitle: 'डॉक्टर का लाइव रिसीवर स्क्रीन (इनकमिंग कॉल और चैट व्यू)',
      doctorReceiverSub:
        'यहाँ देखें कि डॉक्टर को आपकी कॉल और संदेश कैसे मिलते हैं, कॉल रिसीव करें या डॉक्टर को लाइव लिंक भेजें।',
      relationTranslations: {
        'Regular Family Doctor': 'नियमित फैमिली डॉक्टर',
        'Related / Family Doctor': 'पारिवारिक / रिश्तेदार डॉक्टर',
        'Personal Specialist': 'निजी विशेषज्ञ डॉक्टर',
        'Visiting Doctor': 'विजिटिंग / होम डॉक्टर',
      },
    },
    mr: {
      heading: 'माझे नियमित आणि कौटुंबिक डॉक्टर — लाईव्ह कॉल, चॅट आणि अपॉइंटमेंट्स',
      subheading:
        'तुमचे नियमित फॅमिली डॉक्टर किंवा नातेवाईक डॉक्टर जोडा. त्यांना थेट व्हॉइस/व्हिडिओ कॉल करा, मेसेज पाठवा, बीपी/शुगर शेअर करा आणि अपॉइंटमेंट घ्या.',
      addDoctorBtn: '+ नियमित / संबंधित डॉक्टर जोडा',
      hideFormBtn: 'फॉर्म बंद करा',
      formTitle: 'तुमचे नियमित किंवा कौटुंबिक/नातेवाईक डॉक्टर जोडा',
      formSubtitle:
        'तुमच्या नेहमीच्या किंवा परिचित डॉक्टरांचे नाव आणि मोबाईल नंबर सेव्ह करा, जेणेकरून तुम्ही त्यांना थेट कॉल, मेसेज आणि अपॉइंटमेंट बुक करू शकता.',
      docNameLabel: 'डॉक्टरांचे पूर्ण नाव *',
      docNamePlaceholder: 'उदा. डॉ. विवेक पाटील, MBBS, MD',
      relationLabel: 'डॉक्टरांचे नाते / प्रकार *',
      specialtyLabel: 'तज्ज्ञता / पदवी (Specialty) *',
      specialtyPlaceholder: 'उदा. फॅमिली फिजिशियन, हृदयरोग तज्ज्ञ, मधुमेह तज्ज्ञ',
      hospitalLabel: 'क्लिनिक / हॉस्पिटलचे नाव आणि परिसर *',
      hospitalPlaceholder: 'उदा. पाटील क्लिनिक, कोथरूड, पुणे',
      phoneLabel: 'डॉक्टरांचा संपर्क / WhatsApp क्रमांक *',
      phonePlaceholder: '१० अंकी मोबाईल नंबर (उदा. 9822011223)',
      saveDoctorBtn: 'डॉक्टर माझ्या यादीत सेव्ह करा',
      savingDoctorText: 'डॉक्टर सेव्ह होत आहेत...',
      errMissingFields:
        'कृपया डॉक्टरांचे नाव, तज्ज्ञता, क्लिनिकचे नाव आणि वैध १० अंकी मोबाईल नंबर भरा.',
      noDoctorsTitle: 'अद्याप कोणतेही नियमित किंवा संबंधित डॉक्टर जोडलेले नाहीत',
      noDoctorsDesc:
        'वरील फॉर्ममध्ये तुमच्या नेहमीच्या फॅमिली डॉक्टरांची किंवा नातेवाईक डॉक्टरांची माहिती भरा. डॉक्टर जोडल्यानंतर तुम्ही त्यांच्याशी थेट कॉल, चॅट, व्हिडिओ कॉल आणि अपॉइंटमेंट बुक करू शकता.',
      myDoctorsHeading: 'तुमचे जोडलेले नियमित आणि संबंधित डॉक्टर',
      voiceCallBtn: 'व्हॉइस कॉल करा',
      videoCallBtn: 'व्हिडिओ कॉल',
      whatsappShareBtn: 'WhatsApp कॉल/मेसेज',
      simDialBtn: 'फोन डायलर',
      endVideo: 'कॉल समाप्त करा',
      liveMonitoring: 'डॉक्टरांसोबत शेअर केलेला लाईव्ह आरोग्य डेटा (Remote Monitoring)',
      chatTitle: 'डॉक्टरांशी थेट संवाद आणि आरोग्य चॅट',
      shareVitalsInChatBtn: 'आजचा बीपी व शुगर चॅटमध्ये पाठवा',
      chatPlaceholder: 'तुमच्या डॉक्टरांना लक्षणे, रिपोर्ट किंवा गोळ्यांबद्दल मेसेज लिहा...',
      sendBtn: 'मेसेज पाठवा',
      bookTitle: 'निवडलेल्या डॉक्टरांकडे अपॉइंटमेंट बुक करा',
      reasonPlaceholder: 'भेटीचे कारण (उदा. मासिक रक्तदाब आणि शुगर तपासणी)',
      bookBtn: 'अपॉइंटमेंट निश्चित करा',
      upcomingTitle: 'तुमच्या नियोजित अपॉइंटमेंट्स',
      noAppointments: 'अद्याप कोणतीही अपॉइंटमेंट बुक केलेली नाही.',
      markDone: 'पूर्ण झाली',
      cancelBtn: 'रद्द करा',
      doctorReceiverTitle: 'डॉक्टरांची लाईव्ह रिसीव्हर स्क्रीन (इनकमिंग कॉल आणि मेसेज व्ह्यू)',
      doctorReceiverSub:
        'डॉक्टरांना तुमचा कॉल आणि मेसेज कसा मिळतो ते इथे लाईव्ह पहा, कॉल उचला किंवा डॉक्टरांना थेट लिंक पाठवा.',
      relationTranslations: {
        'Regular Family Doctor': 'नियमित फॅमिली डॉक्टर',
        'Related / Family Doctor': 'कौटुंबिक / नातेवाईक डॉक्टर',
        'Personal Specialist': 'वैयक्तिक तज्ज्ञ डॉक्टर',
        'Visiting Doctor': 'व्हिजिटिंग / होम डॉक्टर',
      },
    },
  }[language];

  const handleAddDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedName = docName.trim();
    const trimmedSpec = docSpecialty.trim();
    const trimmedHosp = docHospital.trim();
    const digitsOnly = docPhone.replace(/\D/g, '');

    if (
      !trimmedName ||
      !trimmedSpec ||
      !trimmedHosp ||
      digitsOnly.length < 10 ||
      digitsOnly.length > 12
    ) {
      setFormError(labels.errMissingFields);
      return;
    }

    const formattedPhone = `${docCountryCode} ${digitsOnly}`;
    setSavingDoc(true);
    try {
      await onAddPersonalDoctor({
        name: trimmedName.slice(0, 120),
        specialty: trimmedSpec.slice(0, 100),
        relationType: docRelation,
        hospital: trimmedHosp.slice(0, 140),
        contactPhone: formattedPhone.slice(0, 20),
      });
      setDocName('');
      setDocSpecialty('');
      setDocHospital('');
      setDocPhone('');
      setShowAddForm(false);
    } finally {
      setSavingDoc(false);
    }
  };

  const sendMessageToDoctor = async (messageText: string, isFromLiveCall = false) => {
    if (!selectedDoctor || !messageText.trim() || sendingChat) return;
    setSendingChat(true);

    const cleanText = messageText.trim();
    const roomKey = getNormalizedRoomKey(selectedDoctor.contactPhone || selectedDoctor.id);

    try {
      await onSendChatMessage(selectedDoctor.id, 'patient', cleanText);

      const res = await fetch('/api/teleconsult/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomKey,
          sender: 'patient',
          text: cleanText,
          doctorName: selectedDoctor.name,
          doctorSpecialty: `${selectedDoctor.relationType} (${selectedDoctor.specialty})`,
          doctorPhone: selectedDoctor.contactPhone,
          patientName,
          patientPhone,
          patientAge: userAge,
          vitals: latestVitals,
          language,
          isLiveCall: isFromLiveCall || callStatus === 'connected',
          skipAutoReply: manualDoctorMode,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.doctorReply?.text) {
          seenServerMsgIdsRef.current.add(data.doctorReply.id);
          await onSendChatMessage(selectedDoctor.id, 'doctor', data.doctorReply.text);
          if (isFromLiveCall || callStatus === 'connected') {
            speakDoctorResponse(data.doctorReply.text);
          }
        }
      } else {
        // Fallback direct reply
        const fallbackRes = await fetch('/api/doctor-consult-reply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            doctorName: selectedDoctor.name,
            specialty: `${selectedDoctor.relationType} (${selectedDoctor.specialty})`,
            patientMessage: cleanText,
            patientAge: userAge,
            vitals: latestVitals,
            language,
            isLiveCall: isFromLiveCall || callStatus === 'connected',
          }),
        });
        const fallbackData = await fallbackRes.json();
        if (fallbackData.reply) {
          await onSendChatMessage(selectedDoctor.id, 'doctor', fallbackData.reply);
          if (isFromLiveCall || callStatus === 'connected') {
            speakDoctorResponse(fallbackData.reply);
          }
        }
      }
    } catch (err) {
      console.error('Consult chat error:', err);
    } finally {
      setSendingChat(false);
    }
  };

  // Manual Doctor Console Reply Handler (allows real doctor or tester to reply directly as the doctor)
  const handleDoctorConsoleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !doctorConsoleReplyInput.trim()) return;
    const replyText = doctorConsoleReplyInput.trim();
    setDoctorConsoleReplyInput('');

    const roomKey = getNormalizedRoomKey(selectedDoctor.contactPhone || selectedDoctor.id);
    await onSendChatMessage(selectedDoctor.id, 'doctor', replyText);
    speakDoctorResponse(replyText);

    fetch('/api/teleconsult/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomKey,
        sender: 'doctor',
        text: replyText,
        doctorName: selectedDoctor.name,
        doctorSpecialty: selectedDoctor.specialty,
        doctorPhone: selectedDoctor.contactPhone,
        patientName,
        patientPhone,
        patientAge: userAge,
        vitals: latestVitals,
        language,
      }),
    }).catch(() => {});
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedDoctor) return;
    const text = chatInput.trim();
    setChatInput('');
    await sendMessageToDoctor(text, false);
  };

  const handleInCallSpeechSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inCallSpeechInput.trim() || !selectedDoctor) return;
    const text = inCallSpeechInput.trim();
    setInCallSpeechInput('');
    await sendMessageToDoctor(text, true);
  };

  const handleShareVitalsToChat = async () => {
    if (!selectedDoctor) return;
    const vitalsMsg =
      language === 'mr'
        ? `नमस्कार ${selectedDoctor.name}, माझे आजचे आरोग्य रीडिंग: रक्तदाब (BP): ${latestVitals.systolic}/${latestVitals.diastolic} mmHg, शुगर: ${latestVitals.bloodSugar} mg/dL, हृदयाचे ठोके: ${latestVitals.heartRate} bpm. कृपया मार्गदर्शन करावे.`
        : language === 'hi'
        ? `नमस्ते ${selectedDoctor.name}, मेरे आज के स्वास्थ्य रीडिंग: बीपी (BP): ${latestVitals.systolic}/${latestVitals.diastolic} mmHg, शुगर: ${latestVitals.bloodSugar} mg/dL, पल्स: ${latestVitals.heartRate} bpm। कृपया सलाह दें।`
        : `Hello ${selectedDoctor.name}, sharing my latest vitals: BP ${latestVitals.systolic}/${latestVitals.diastolic} mmHg, Fasting Blood Sugar ${latestVitals.bloodSugar} mg/dL, Heart Rate ${latestVitals.heartRate} bpm. Please advise.`;
    await sendMessageToDoctor(vitalsMsg, callStatus === 'connected');
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !reason.trim()) return;
    await onBookAppointment({
      doctorName: selectedDoctor.name,
      specialty: `${selectedDoctor.specialty} (${selectedDoctor.relationType})`,
      appointmentDate: apptDate,
      appointmentTime: apptTime,
      consultType,
      reason: reason.trim(),
    });
    setReason('');
  };

  const getDoctorRoomShareUrl = (doc: PersonalDoctorItem) => {
    const roomKey = getNormalizedRoomKey(doc.contactPhone || doc.id);
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?doctorRoom=${encodeURIComponent(roomKey)}`;
  };

  const getWhatsAppUrl = (doc: PersonalDoctorItem, customText?: string) => {
    const cleanDigits = doc.contactPhone.replace(/\D/g, '');
    const roomLink = getDoctorRoomShareUrl(doc);
    const msg =
      customText ||
      (language === 'mr'
        ? `नमस्कार ${doc.name}, मी ${patientName} (${patientPhone}) Preventia ॲपवरून संपर्क करत आहे. माझे आजचे रीडिंग: BP ${latestVitals.systolic}/${latestVitals.diastolic} mmHg, शुगर ${latestVitals.bloodSugar} mg/dL. लाईव्ह कॉल/चॅट जॉईन करण्यासाठी लिंक: ${roomLink}`
        : language === 'hi'
        ? `नमस्ते ${doc.name}, मैं ${patientName} (${patientPhone}) Preventia ऐप से संपर्क कर रहा हूँ। आज का रीडिंग: BP ${latestVitals.systolic}/${latestVitals.diastolic} mmHg, शुगर ${latestVitals.bloodSugar} mg/dL। लाइव कॉल/चैट लिंक: ${roomLink}`
        : `Hello ${doc.name}, I am ${patientName} (${patientPhone}) reaching out via Preventia. Today's vitals: BP ${latestVitals.systolic}/${latestVitals.diastolic} mmHg, Sugar ${latestVitals.bloodSugar} mg/dL. Join Live Call/Chat Room: ${roomLink}`);
    return `https://wa.me/${cleanDigits}?text=${encodeURIComponent(msg)}`;
  };

  const handleCopyDoctorLink = (doc: PersonalDoctorItem) => {
    const url = getDoctorRoomShareUrl(doc);
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopiedRoomLink(true);
    setTimeout(() => setCopiedRoomLink(false), 2500);
  };

  const getDoctorInitials = (name: string) => {
    const cleaned = name.replace(/^dr\.?\s*/i, '').trim();
    const parts = cleaned.split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0] || 'D'}${parts[1][0] || 'R'}`.toUpperCase();
    }
    return (cleaned.slice(0, 2) || 'DR').toUpperCase();
  };

  const filteredMessages = selectedDoctor
    ? chatMessages.filter((m) => m.doctorId === selectedDoctor.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Header & Add Regular/Related Doctor Toggle */}
      <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className={`font-semibold text-slate-900 ${seniorMode ? 'text-2xl' : 'text-xl'}`}>
              {labels.heading}
            </h2>
            <p className={`text-slate-600 mt-1 ${seniorMode ? 'text-base' : 'text-sm'}`}>
              {labels.subheading}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start">
            <button
              type="button"
              onClick={() => setShowAddForm((prev) => !prev)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-teal-700 text-white font-semibold text-sm hover:bg-teal-800 transition-colors cursor-pointer whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4" />
              <span>
                {showAddForm && personalDoctors.length > 0
                  ? labels.hideFormBtn
                  : labels.addDoctorBtn}
              </span>
            </button>

            {selectedDoctor && (
              <>
                {callStatus === 'idle' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => startLiveCall('voice', selectedDoctor)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-700 text-white font-semibold text-sm hover:bg-emerald-800 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>{labels.voiceCallBtn}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => startLiveCall('video', selectedDoctor)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-teal-700 bg-teal-50 text-teal-900 font-semibold text-sm hover:bg-teal-100 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Video className="w-4 h-4 text-teal-700" />
                      <span>{labels.videoCallBtn}</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={endLiveCall}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span>{labels.endVideo}</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Form to Add Patient's Regular or Related Doctor */}
        {showAddForm && (
          <form
            onSubmit={handleAddDoctorSubmit}
            className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4"
          >
            <div className="border-b border-slate-200 pb-3">
              <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-teal-700" />
                <span>{labels.formTitle}</span>
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">{labels.formSubtitle}</p>
            </div>

            {formError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-900 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {labels.docNameLabel}
                </label>
                <input
                  type="text"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder={labels.docNamePlaceholder}
                  maxLength={120}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-teal-700"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {labels.relationLabel}
                </label>
                <select
                  value={docRelation}
                  onChange={(e) =>
                    setDocRelation(e.target.value as PersonalDoctorItem['relationType'])
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-teal-700"
                >
                  {RELATION_TYPES.map((rel) => (
                    <option key={rel} value={rel}>
                      {labels.relationTranslations[rel]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {labels.specialtyLabel}
                </label>
                <input
                  type="text"
                  value={docSpecialty}
                  onChange={(e) => setDocSpecialty(e.target.value)}
                  placeholder={labels.specialtyPlaceholder}
                  maxLength={100}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-teal-700"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {labels.hospitalLabel}
                </label>
                <input
                  type="text"
                  value={docHospital}
                  onChange={(e) => setDocHospital(e.target.value)}
                  placeholder={labels.hospitalPlaceholder}
                  maxLength={140}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-teal-700"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {labels.phoneLabel}
                </label>
                <div className="flex gap-2">
                  <select
                    value={docCountryCode}
                    onChange={(e) => setDocCountryCode(e.target.value)}
                    className="w-24 rounded-lg border border-slate-300 bg-white px-2.5 py-2.5 text-sm font-mono tabular-nums text-slate-900"
                  >
                    <option value="+91">+91 IN</option>
                    <option value="+1">+1 US</option>
                    <option value="+44">+44 UK</option>
                    <option value="+971">+971 AE</option>
                  </select>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={docPhone}
                    onChange={(e) =>
                      setDocPhone(e.target.value.replace(/[^\d\s-]/g, '').slice(0, 14))
                    }
                    placeholder={labels.phonePlaceholder}
                    className="flex-1 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-mono tabular-nums text-slate-900 focus:outline-none focus:border-teal-700"
                    required
                  />
                  <button
                    type="submit"
                    disabled={savingDoc}
                    className="px-5 py-2.5 rounded-lg bg-teal-700 text-white text-sm font-semibold hover:bg-teal-800 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {savingDoc ? labels.savingDoctorText : labels.saveDoctorBtn}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Saved Personal / Related Doctors Roster */}
        {personalDoctors.length === 0 ? (
          <div className="p-6 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 text-center space-y-2">
            <Stethoscope className="w-8 h-8 text-teal-700 mx-auto" />
            <h3 className="font-semibold text-slate-900 text-base">
              {labels.noDoctorsTitle}
            </h3>
            <p className="text-xs text-slate-600 max-w-[60ch] mx-auto leading-relaxed">
              {labels.noDoctorsDesc}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {labels.myDoctorsHeading} ({personalDoctors.length})
              </h3>
              {isDoctorRole && (
                <button
                  type="button"
                  onClick={() => setShowDoctorReceiverConsole((prev) => !prev)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                    showDoctorReceiverConsole
                      ? 'bg-teal-50 border-teal-600 text-teal-900'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-teal-700" />
                  <span>
                    {showDoctorReceiverConsole
                      ? 'Doctor Receiver Screen: Visible'
                      : 'Show Doctor Receiver Screen'}
                  </span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {personalDoctors.map((doc) => {
                const isSelected = selectedDoctor?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoctorId(doc.id)}
                    className={`p-4 rounded-xl border transition-colors cursor-pointer flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'border-2 border-teal-700 bg-teal-50/40'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3.5 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-teal-700 text-white font-display font-semibold text-base flex items-center justify-center shrink-0">
                          {getDoctorInitials(doc.name)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4
                              className={`font-semibold text-slate-900 truncate ${
                                seniorMode ? 'text-lg' : 'text-base'
                              }`}
                            >
                              {doc.name}
                            </h4>
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-teal-100 text-teal-900">
                              {labels.relationTranslations[doc.relationType] || doc.relationType}
                            </span>
                          </div>
                          <p className="text-xs text-teal-800 font-medium mt-0.5">
                            {doc.specialty}
                          </p>
                          <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{doc.hospital}</span>
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeletePersonalDoctor(doc.id);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Remove doctor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Direct Communication Action Strip — Triggers Working In-App Live Call + WhatsApp + SIM Dialer */}
                    <div className="pt-2.5 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-mono tabular-nums text-slate-700 font-medium">
                        {doc.contactPhone}
                      </span>

                      <div
                        className="flex flex-wrap items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => startLiveCall('voice', doc)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 transition-colors cursor-pointer"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>{labels.voiceCallBtn}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => startLiveCall('video', doc)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal-700 bg-white text-teal-900 text-xs font-semibold hover:bg-teal-50 transition-colors cursor-pointer"
                        >
                          <Video className="w-3.5 h-3.5 text-teal-700" />
                          <span>{labels.videoCallBtn}</span>
                        </button>

                        <a
                          href={getWhatsAppUrl(doc)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>{labels.whatsappShareBtn}</span>
                        </a>

                        <a
                          href={`tel:${doc.contactPhone.replace(/\s+/g, '')}`}
                          target="_top"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors"
                          title="Dial via mobile SIM card"
                        >
                          <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                          <span>{labels.simDialBtn}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* DOCTOR'S LIVE RECEIVER CONSOLE (Strictly for Doctor Role or explicit ?doctorRoom= receiver link) */}
      {selectedDoctor && (isDoctorRole || manualDoctorMode) && showDoctorReceiverConsole && (
        <div
          className={`p-5 rounded-xl border-2 transition-all space-y-4 ${
            callStatus === 'ringing'
              ? 'border-emerald-600 bg-emerald-950 text-white shadow-lg'
              : 'border-teal-700/30 bg-slate-900 text-white'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  callStatus === 'ringing'
                    ? 'bg-emerald-500 text-slate-950 animate-bounce'
                    : 'bg-teal-700 text-white'
                }`}
              >
                {callStatus === 'ringing' ? (
                  <PhoneIncoming className="w-5 h-5" />
                ) : (
                  <Smartphone className="w-5 h-5" />
                )}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-sm sm:text-base">
                    {labels.doctorReceiverTitle} — {selectedDoctor.name} ({selectedDoctor.contactPhone})
                  </h3>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-teal-900 text-teal-200 border border-teal-700">
                    Room ID: {getNormalizedRoomKey(selectedDoctor.contactPhone || selectedDoctor.id)}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">{labels.doctorReceiverSub}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopyDoctorLink(selectedDoctor)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 cursor-pointer"
              >
                {copiedRoomLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Doctor Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Doctor Room Link</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setManualDoctorMode((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                  manualDoctorMode
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>
                  {manualDoctorMode
                    ? 'Mode: Manual Doctor Answer & Reply'
                    : 'Mode: Auto-Answer + Smart Doctor Voice'}
                </span>
              </button>
            </div>
          </div>

          {/* INCOMING CALL ALERT ON DOCTOR'S SCREEN WHEN RINGING */}
          {callStatus === 'ringing' && (
            <div className="p-4 rounded-xl bg-emerald-900/90 border border-emerald-400/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                    Incoming {callMode === 'video' ? 'Video' : 'Voice'} Call for {selectedDoctor.name}
                  </span>
                </div>
                <p className="text-base font-semibold text-white">
                  Caller: {patientName} ({patientPhone}) · Age {userAge}
                </p>
                <p className="text-xs text-emerald-200 font-mono">
                  Live Patient Vitals: BP {latestVitals.systolic}/{latestVitals.diastolic} mmHg · Sugar{' '}
                  {latestVitals.bloodSugar} mg/dL · Pulse {latestVitals.heartRate} bpm
                </p>
                {autoAnswerCountdown !== null && (
                  <p className="text-xs text-amber-200 font-medium pt-0.5">
                    Doctor picking up automatically in {autoAnswerCountdown}s (or click Answer Call now)...
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleAnswerIncomingCall('human_doctor')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm cursor-pointer shadow-md"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Answer Call Now (Doctor)</span>
                </button>
                <button
                  type="button"
                  onClick={endLiveCall}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs cursor-pointer"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>Decline</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick Doctor Reply Bar (Lets Doctor or User Reply Directly to Patient Chat & Speak Out Loud) */}
          <form
            onSubmit={handleDoctorConsoleReplySubmit}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
          >
            <span className="text-xs font-semibold text-teal-300 whitespace-nowrap">
              Reply as {selectedDoctor.name}:
            </span>
            <input
              type="text"
              value={doctorConsoleReplyInput}
              onChange={(e) => setDoctorConsoleReplyInput(e.target.value)}
              placeholder={`Type a direct reply or prescription note from ${selectedDoctor.name} to ${patientName}...`}
              className="flex-1 rounded-lg bg-slate-800 border border-slate-700 px-3.5 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-400"
            />
            <button
              type="submit"
              disabled={!doctorConsoleReplyInput.trim()}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white text-xs font-semibold cursor-pointer whitespace-nowrap"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Doctor Reply & Speak</span>
            </button>
          </form>
        </div>
      )}

      {/* ACTIVE VOICE / VIDEO CALL VIEWPORT WITH SPOKEN DOCTOR VOICE & MIC CONVERSATION */}
      {callStatus !== 'idle' && selectedDoctor && (
        <div className="p-6 bg-slate-900 text-white rounded-xl space-y-4 border-2 border-teal-500/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  callStatus === 'connected'
                    ? 'bg-emerald-400 animate-pulse'
                    : 'bg-amber-400 animate-ping'
                }`}
              />
              <span className="font-semibold">{selectedDoctor.name}</span>
              <span className="text-slate-400">·</span>
              <span className="text-xs text-emerald-300 font-mono">
                {selectedDoctor.contactPhone}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-semibold bg-slate-800 text-teal-300 border border-slate-700">
                {callStatus === 'ringing'
                  ? `Ringing Doctor... ${
                      autoAnswerCountdown !== null ? `(${autoAnswerCountdown}s)` : ''
                    }`
                  : `Connected · ${formatCallTime(callSeconds)}`}
              </span>
            </div>
            <span className="text-xs text-slate-400 font-mono tabular-nums">
              {labels.liveMonitoring}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Doctor Live Audio/Video Stream & Spoken Response Box */}
            <div className="lg:col-span-7 relative rounded-xl overflow-hidden bg-slate-800 min-h-[270px] p-5 flex flex-col items-center justify-between border border-slate-700 gap-3">
              <div className="flex flex-col items-center text-center my-auto space-y-2.5">
                <div
                  className={`w-20 h-20 rounded-full bg-teal-700 text-white font-display font-semibold text-2xl flex items-center justify-center border-2 ${
                    doctorSpeakingNow
                      ? 'border-emerald-400 ring-4 ring-emerald-500/30 scale-105 transition-transform'
                      : 'border-teal-400'
                  }`}
                >
                  {getDoctorInitials(selectedDoctor.name)}
                </div>
                <div>
                  <p className="font-semibold text-base text-white">{selectedDoctor.name}</p>
                  <p className="text-xs text-teal-300 mt-0.5">
                    {selectedDoctor.specialty} · {selectedDoctor.hospital}
                  </p>
                </div>

                {callStatus === 'ringing' ? (
                  <div className="flex flex-col items-center gap-2 pt-1">
                    <p className="text-xs text-amber-300 font-medium">
                      Dialing {selectedDoctor.contactPhone}... Ringing on Doctor’s Receiver
                    </p>
                    <button
                      type="button"
                      onClick={() => handleAnswerIncomingCall('auto_connect')}
                      className="px-4 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-semibold text-xs hover:bg-emerald-400 cursor-pointer"
                    >
                      Connect Call Immediately
                    </button>
                  </div>
                ) : (
                  lastDoctorSpokenText && (
                    <div className="max-w-lg p-3 rounded-xl bg-slate-900/90 border border-teal-500/40 text-left space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-semibold text-emerald-300 flex items-center gap-1">
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>{selectedDoctor.name} (Live Call Audio):</span>
                        </span>
                        {onSpeakText && (
                          <button
                            type="button"
                            onClick={() => onSpeakText(lastDoctorSpokenText)}
                            className="text-[11px] text-teal-300 hover:underline cursor-pointer"
                          >
                            Replay Voice
                          </button>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-100 leading-relaxed">
                        "{lastDoctorSpokenText}"
                      </p>
                    </div>
                  )
                )}
              </div>

              {/* In-Call Live Speech / Talk to Doctor Bar */}
              {callStatus === 'connected' && (
                <form
                  onSubmit={handleInCallSpeechSubmit}
                  className="w-full flex flex-wrap sm:flex-nowrap items-center gap-2 pt-2 border-t border-slate-700/80"
                >
                  <button
                    type="button"
                    onClick={handleListenPatientSpeech}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer shrink-0 ${
                      isListeningMic
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>{isListeningMic ? 'Listening...' : 'Speak to Doctor'}</span>
                  </button>
                  <input
                    id="in-call-speech-input"
                    type="text"
                    value={inCallSpeechInput}
                    onChange={(e) => setInCallSpeechInput(e.target.value)}
                    placeholder="Or type what you want to say on the call..."
                    className="flex-1 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-400"
                  />
                  <button
                    type="submit"
                    disabled={!inCallSpeechInput.trim() || sendingChat}
                    className="px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white text-xs font-semibold cursor-pointer shrink-0"
                  >
                    Say on Call
                  </button>
                </form>
              )}
            </div>

            {/* Patient Self Camera + Live Telemetry Stream */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="relative rounded-xl overflow-hidden bg-slate-950 h-44 border border-slate-700 flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${
                    !camActive || callMode === 'voice' ? 'hidden' : ''
                  }`}
                />
                {(!camActive || callMode === 'voice' || camError) && (
                  <div className="text-center px-4 space-y-1">
                    <p className="text-xs font-semibold text-slate-300">
                      {callMode === 'voice'
                        ? `Voice Consultation Active (${patientName})`
                        : camError || 'Camera Paused'}
                    </p>
                    <p className="text-[11px] text-slate-400">{patientPhone}</p>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-black/70 px-2.5 py-1 rounded text-xs">
                  {patientName}
                </div>
              </div>

              {/* Remote Patient Monitoring Vitals Card */}
              <div className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-[11px] text-slate-400">BP (mmHg)</p>
                  <p className="text-sm font-mono font-semibold text-emerald-300 tabular-nums">
                    {latestVitals.systolic}/{latestVitals.diastolic}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">Heart Rate</p>
                  <p className="text-sm font-mono font-semibold text-teal-300 tabular-nums">
                    {latestVitals.heartRate} bpm
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">Glucose</p>
                  <p className="text-sm font-mono font-semibold text-amber-300 tabular-nums">
                    {latestVitals.bloodSugar} mg/dL
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={toggleMic}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                micActive ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-amber-600 text-white'
              }`}
            >
              {micActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              <span>{micActive ? 'Mute Mic' : 'Unmute Mic'}</span>
            </button>

            {callMode === 'video' && (
              <button
                type="button"
                onClick={toggleCamera}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  camActive
                    ? 'bg-slate-800 text-white hover:bg-slate-700'
                    : 'bg-amber-600 text-white'
                }`}
              >
                {camActive ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                <span>{camActive ? 'Pause Video' : 'Resume Video'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setSpeakerVoiceEnabled((prev) => !prev)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                speakerVoiceEnabled
                  ? 'bg-teal-800 text-teal-100 hover:bg-teal-700'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{speakerVoiceEnabled ? 'Doctor Voice: ON' : 'Doctor Voice: Muted'}</span>
            </button>

            <a
              href={getWhatsAppUrl(selectedDoctor)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Send Call Link on WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={endLiveCall}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors cursor-pointer"
            >
              <PhoneOff className="w-4 h-4" />
              <span>{labels.endVideo}</span>
            </button>
          </div>
        </div>
      )}

      {/* Split Grid: Direct Doctor Chat + Appointment Scheduler */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Direct Consultation Chat */}
        <div className="lg:col-span-7 p-5 bg-white border border-slate-200 rounded-xl flex flex-col h-[500px]">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-700" />
              <h3 className="font-semibold text-slate-900 text-base">{labels.chatTitle}</h3>
            </div>
            {selectedDoctor && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-teal-800">{selectedDoctor.name}</span>
                <button
                  type="button"
                  onClick={handleShareVitalsToChat}
                  disabled={sendingChat}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-teal-50 border border-teal-200 text-teal-900 text-xs font-semibold hover:bg-teal-100 transition-colors cursor-pointer"
                >
                  <Activity className="w-3.5 h-3.5 text-teal-700" />
                  <span>{labels.shareVitalsInChatBtn}</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 py-4 pr-1">
            {!selectedDoctor ? (
              <div className="p-4 rounded-xl bg-slate-50 text-slate-600 text-sm">
                {labels.noDoctorsDesc}
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 text-slate-600 text-sm space-y-2">
                <p className="font-semibold text-slate-800">
                  {selectedDoctor.name} ({selectedDoctor.specialty})
                </p>
                <p className="text-xs text-slate-500">
                  {selectedDoctor.hospital} · {selectedDoctor.contactPhone}
                </p>
                <p className="pt-1 text-xs leading-relaxed">
                  Click <strong>"{labels.voiceCallBtn}"</strong> to start a live voice call where{' '}
                  {selectedDoctor.name} answers and talks with you, or send a message below to receive
                  an immediate consultation response.
                </p>
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[84%] rounded-xl px-4 py-2.5 ${
                      msg.sender === 'patient'
                        ? 'bg-teal-700 text-white'
                        : 'bg-slate-100 text-slate-900 border border-slate-200'
                    } ${seniorMode ? 'text-base' : 'text-sm'}`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <span
                        className={`text-[11px] font-semibold ${
                          msg.sender === 'patient' ? 'text-teal-100' : 'text-teal-800'
                        }`}
                      >
                        {msg.sender === 'patient' ? patientName : selectedDoctor.name}
                      </span>
                      {msg.sender === 'doctor' && onSpeakText && (
                        <button
                          type="button"
                          onClick={() => onSpeakText(msg.text)}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-700 hover:text-teal-900 cursor-pointer"
                          title="Listen to doctor's message"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Listen</span>
                        </button>
                      )}
                    </div>
                    <p className="leading-relaxed">{msg.text}</p>
                    <div className="flex items-center justify-between gap-2 mt-1.5">
                      <p
                        className={`text-[10px] font-mono tabular-nums ${
                          msg.sender === 'patient' ? 'text-teal-100' : 'text-slate-500'
                        }`}
                      >
                        {msg.timestamp}
                      </p>
                      {msg.sender === 'patient' && (
                        <a
                          href={getWhatsAppUrl(selectedDoctor, msg.text)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-medium text-teal-100 underline hover:text-white"
                        >
                          Forward to WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleChatSubmit} className="pt-3 border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={selectedDoctor ? labels.chatPlaceholder : labels.noDoctorsTitle}
              disabled={!selectedDoctor}
              maxLength={800}
              className="flex-1 rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 disabled:bg-slate-100"
            />
            <button
              type="submit"
              disabled={!selectedDoctor || sendingChat || !chatInput.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-teal-700 text-white text-sm font-semibold hover:bg-teal-800 disabled:opacity-50 transition-colors whitespace-nowrap cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{sendingChat ? '...' : labels.sendBtn}</span>
            </button>
          </form>
        </div>

        {/* Appointment Scheduling System with Added Doctors */}
        <div className="lg:col-span-5 p-5 bg-white border border-slate-200 rounded-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-700" />
              <h3 className="font-semibold text-slate-900 text-base">{labels.bookTitle}</h3>
            </div>
          </div>

          <form onSubmit={handleBookSubmit} className="space-y-3.5">
            {personalDoctors.length > 0 && (
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Select Your Doctor
                </label>
                <select
                  value={selectedDoctor?.id || ''}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white text-slate-900"
                >
                  {personalDoctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} — {doc.specialty}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Date</label>
                <input
                  type="date"
                  value={apptDate}
                  onChange={(e) => setApptDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono tabular-nums"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Time Slot</label>
                <select
                  value={apptTime}
                  onChange={(e) => setApptTime(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono tabular-nums bg-white"
                >
                  <option value="09:30 AM">09:30 AM</option>
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                  <option value="06:00 PM">06:00 PM</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setConsultType('Video')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  consultType === 'Video' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Telemedicine Video
              </button>
              <button
                type="button"
                onClick={() => setConsultType('In-Person')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  consultType === 'In-Person' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                In-Clinic Visit
              </button>
            </div>

            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={labels.reasonPlaceholder}
              disabled={!selectedDoctor}
              maxLength={250}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm disabled:bg-slate-100"
              required
            />

            <button
              type="submit"
              disabled={!selectedDoctor}
              className="w-full py-2.5 rounded-lg bg-teal-700 text-white text-sm font-semibold hover:bg-teal-800 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {labels.bookBtn}
            </button>
          </form>

          {/* Scheduled Appointments List */}
          <div className="pt-3 border-t border-slate-100 space-y-2.5">
            <h4 className="text-xs font-semibold text-slate-500">
              {labels.upcomingTitle} ({appointments.length})
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {appointments.length === 0 ? (
                <p className="text-xs text-slate-500 py-2">{labels.noAppointments}</p>
              ) : (
                appointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 flex items-start justify-between gap-2"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{appt.doctorName}</p>
                      <p className="text-[11px] text-teal-800">{appt.specialty}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{appt.reason}</p>
                      <p className="text-[11px] text-slate-500 font-mono tabular-nums mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {appt.appointmentDate} · {appt.appointmentTime} · {appt.consultType} ·{' '}
                          {appt.status}
                        </span>
                      </p>
                    </div>
                    {appt.status === 'Scheduled' && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => onUpdateAppointmentStatus(appt.id, 'Completed')}
                          className="px-2 py-1 rounded text-[11px] font-medium bg-emerald-100 text-emerald-900 hover:bg-emerald-200 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 inline mr-0.5" />
                          {labels.markDone}
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateAppointmentStatus(appt.id, 'Cancelled')}
                          className="px-2 py-1 rounded text-[11px] font-medium bg-slate-200 text-slate-700 hover:bg-slate-300 cursor-pointer"
                        >
                          {labels.cancelBtn}
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
