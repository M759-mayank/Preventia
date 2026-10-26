import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Language } from '../i18n/translations';
import {
  AppointmentItem,
  ChatMessageItem,
  PersonalDoctorItem,
} from './TelemedicineSection';
import { MedicalRecordItem } from './EncryptedVaultSection';
import { CommunityAdvisoryItem } from './CommunityProjectHeadSection';
import {
  Stethoscope,
  Calendar,
  Activity,
  FileText,
  Pill,
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneCall,
  PhoneOff,
  PhoneIncoming,
  MessageSquare,
  Send,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UserCheck,
  ShieldAlert,
  BookOpen,
  Plus,
  Sparkles,
  Volume2,
  ClipboardCheck,
  BellRing,
  HeartPulse,
  Syringe,
  Eye,
  Filter,
  Check,
  TrendingUp,
  FileDown,
} from 'lucide-react';
import { generateDoctorPortalPatientPdf } from '../utils/pdfGenerator';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';

export interface DoctorPatientProfile {
  id: string;
  name: string;
  age: number;
  bloodGroup: string;
  contactPhone: string;
  triageStatus: 'Urgent' | 'Priority Follow-Up' | 'Routine';
  chiefComplaint: string;
  lastVisitDate: string;
  latestVitals: {
    date: string;
    systolic: number;
    diastolic: number;
    heartRate: number;
    bloodSugar: number;
    sleepHours: number;
    sleepQuality: string;
    waterGlasses: number;
  };
  vitalsHistory: {
    id: string;
    date: string;
    systolic: number;
    diastolic: number;
    heartRate: number;
    bloodSugar: number;
    sleepHours: number;
    sleepQuality: string;
    notes: string;
  }[];
  medications: {
    id: string;
    medicineName: string;
    dosage: string;
    scheduleTime: string;
    frequency: string;
    takenToday: boolean;
  }[];
  vaccines: {
    id: string;
    vaccineName: string;
    doseNumber: number;
    status: string;
    scheduledDate: string;
    clinicName: string;
  }[];
  reports: {
    id: string;
    title: string;
    category: string;
    recordDate: string;
    summary: string;
  }[];
}

export interface EPrescriptionRecord {
  id: string;
  patientName: string;
  doctorName: string;
  doctorSpecialty: string;
  registrationId: string;
  medicineName: string;
  dosage: string;
  scheduleTime: string;
  frequency: string;
  durationDays: string;
  instructions: string;
  issuedAt: string;
}

export interface ClinicalNoteRecord {
  id: string;
  patientName: string;
  chiefComplaint: string;
  clinicalAssessment: string;
  followUpDate: string;
  followUpTriggerAction: string;
  loggedAt: string;
}

export interface RiskAnomalyAlert {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientPhone: string;
  severity: 'Critical' | 'Warning';
  metricTitle: string;
  metricValue: string;
  clinicalReason: string;
  detectedAt: string;
  acknowledged: boolean;
}

export const DoctorPortalSection: React.FC<{
  language: Language;
  seniorMode: boolean;
  doctorName: string;
  doctorPhone: string;
  doctorSpecialty: string;
  doctorClinic: string;
  // Linked Active Patient Data from the App
  linkedPatientName: string;
  linkedPatientPhone: string;
  linkedPatientAge: number;
  linkedPatientBloodGroup: string;
  linkedVitals: {
    id: string;
    date: string;
    systolic: number;
    diastolic: number;
    heartRate: number;
    bloodSugar: number;
    sleepHours: number;
    sleepQuality: string;
    waterGlasses: number;
    notes: string;
  }[];
  linkedMedications: {
    id: string;
    medicineName: string;
    dosage: string;
    scheduleTime: string;
    frequency: string;
    takenToday: boolean;
  }[];
  linkedVaccines: {
    id: string;
    vaccineName: string;
    doseNumber: number;
    status: string;
    scheduledDate: string;
    clinicName: string;
  }[];
  linkedMedicalRecords: MedicalRecordItem[];
  appointments: AppointmentItem[];
  onBookAppointment: (appt: Omit<AppointmentItem, 'id' | 'status'>) => Promise<void>;
  onUpdateAppointmentStatus: (id: string, status: 'Completed' | 'Cancelled') => Promise<void>;
  chatMessages: ChatMessageItem[];
  onSendChatMessage: (doctorId: string, sender: 'patient' | 'doctor', text: string) => Promise<void>;
  personalDoctors: PersonalDoctorItem[];
  onPushPrescriptionToPatient: (med: {
    medicineName: string;
    dosage: string;
    scheduleTime: string;
    frequency: string;
    instructions: string;
    durationDays: string;
  }) => Promise<void>;
  advisories: CommunityAdvisoryItem[];
  onPublishDoctorArticle: (adv: Omit<CommunityAdvisoryItem, 'id'>) => void;
  onSpeakText: (text: string) => void;
}> = ({
  language,
  seniorMode,
  doctorName,
  doctorPhone,
  doctorSpecialty,
  doctorClinic,
  linkedPatientName,
  linkedPatientPhone,
  linkedPatientAge,
  linkedPatientBloodGroup,
  linkedVitals,
  linkedMedications,
  linkedVaccines,
  linkedMedicalRecords,
  appointments,
  onBookAppointment,
  onUpdateAppointmentStatus,
  chatMessages,
  onSendChatMessage,
  personalDoctors,
  onPushPrescriptionToPatient,
  advisories,
  onPublishDoctorArticle,
  onSpeakText,
}) => {
  type PortalSubTab = 'queue_records' | 'prescriptions_notes' | 'telehealth_chat' | 'insights_publisher';
  const [activeSubTab, setActiveSubTab] = useState<PortalSubTab>('queue_records');

  // Calendar & Triage Filter State
  const [calendarViewMode, setCalendarViewMode] = useState<'daily' | 'weekly'>('daily');
  const [triageFilter, setTriageFilter] = useState<'All' | 'Urgent' | 'Routine'>('All');
  const [trendChartFocus, setTrendChartFocus] = useState<'both' | 'bp' | 'glucose'>('both');

  const latestLinkedVital = linkedVitals[0] || {
    id: 'v1',
    date: '2026-09-27',
    systolic: 124,
    diastolic: 78,
    heartRate: 72,
    bloodSugar: 98,
    sleepHours: 7.5,
    sleepQuality: 'Good',
    waterGlasses: 8,
    notes: 'Morning walk completed',
  };

  // Determine triage status dynamically for the linked patient based on vitals
  const linkedPatientTriage: 'Urgent' | 'Priority Follow-Up' | 'Routine' =
    latestLinkedVital.systolic >= 140 ||
    latestLinkedVital.diastolic >= 90 ||
    latestLinkedVital.bloodSugar >= 140
      ? 'Urgent'
      : latestLinkedVital.systolic >= 130 || latestLinkedVital.bloodSugar >= 115
      ? 'Priority Follow-Up'
      : 'Routine';

  // Roster of patients under the doctor's care (Primary is the live linked app patient + community panel patients)
  const patientRoster: DoctorPatientProfile[] = [
    {
      id: 'pat_linked_1',
      name: linkedPatientName || 'Ramesh Kulkarni',
      age: linkedPatientAge || 66,
      bloodGroup: linkedPatientBloodGroup || 'O+',
      contactPhone: linkedPatientPhone || '+91 9823014567',
      triageStatus: linkedPatientTriage,
      chiefComplaint:
        latestLinkedVital.systolic >= 135
          ? 'Elevated morning BP & post-meal glucose monitoring'
          : 'Monthly preventive BP, diabetes & medication review',
      lastVisitDate: '2026-09-27 (Live App Sync)',
      latestVitals: {
        date: latestLinkedVital.date,
        systolic: latestLinkedVital.systolic,
        diastolic: latestLinkedVital.diastolic,
        heartRate: latestLinkedVital.heartRate,
        bloodSugar: latestLinkedVital.bloodSugar,
        sleepHours: latestLinkedVital.sleepHours,
        sleepQuality: latestLinkedVital.sleepQuality,
        waterGlasses: latestLinkedVital.waterGlasses,
      },
      vitalsHistory: [
        ...linkedVitals,
        {
          id: 'rk_hist_3',
          date: '2026-09-22',
          systolic: 130,
          diastolic: 84,
          heartRate: 76,
          bloodSugar: 108,
          sleepHours: 7.0,
          sleepQuality: 'Good',
          notes: 'Evening walk 25 mins',
        },
        {
          id: 'rk_hist_4',
          date: '2026-09-19',
          systolic: 134,
          diastolic: 86,
          heartRate: 78,
          bloodSugar: 112,
          sleepHours: 6.5,
          sleepQuality: 'Fair',
          notes: 'Slightly high salt dinner',
        },
        {
          id: 'rk_hist_5',
          date: '2026-09-15',
          systolic: 126,
          diastolic: 80,
          heartRate: 74,
          bloodSugar: 101,
          sleepHours: 7.5,
          sleepQuality: 'Good',
          notes: 'Routine morning checkup',
        },
      ],
      medications: linkedMedications,
      vaccines: linkedVaccines,
      reports:
        linkedMedicalRecords.length > 0
          ? linkedMedicalRecords.map((r) => ({
              id: r.id,
              title: r.title,
              category: r.category,
              recordDate: r.recordDate,
              summary: 'AES-256 Encrypted Patient Vault Record (Linked to Profile)',
            }))
          : [
              {
                id: 'rep_1',
                title: 'Fasting Lipid Profile & HbA1c Lab Report',
                category: 'Pathology Lab',
                recordDate: '2026-09-20',
                summary: 'HbA1c: 6.1% (Controlled), Total Cholesterol: 178 mg/dL, LDL: 98 mg/dL.',
              },
              {
                id: 'rep_2',
                title: '12-Lead Resting ECG & Echocardiogram Summary',
                category: 'Cardiology',
                recordDate: '2026-09-10',
                summary: 'Normal sinus rhythm, LVEF 60%, no acute ischemic changes.',
              },
            ],
    },
    {
      id: 'pat_comm_2',
      name: 'Shanta Joshi',
      age: 71,
      bloodGroup: 'B+',
      contactPhone: '+91 9822198765',
      triageStatus: 'Urgent',
      chiefComplaint: 'Spiking morning blood pressure (156/94 mmHg) & mild dizziness',
      lastVisitDate: '2026-09-27',
      latestVitals: {
        date: '2026-09-27',
        systolic: 156,
        diastolic: 94,
        heartRate: 88,
        bloodSugar: 148,
        sleepHours: 5.5,
        sleepQuality: 'Fair',
        waterGlasses: 6,
      },
      vitalsHistory: [
        {
          id: 'sj_1',
          date: '2026-09-27',
          systolic: 156,
          diastolic: 94,
          heartRate: 88,
          bloodSugar: 148,
          sleepHours: 5.5,
          sleepQuality: 'Fair',
          notes: 'Skipped evening walk, mild occipital headache',
        },
        {
          id: 'sj_2',
          date: '2026-09-24',
          systolic: 142,
          diastolic: 88,
          heartRate: 80,
          bloodSugar: 134,
          sleepHours: 6.5,
          sleepQuality: 'Good',
          notes: 'Taking Amlodipine 5mg',
        },
        {
          id: 'sj_3',
          date: '2026-09-21',
          systolic: 148,
          diastolic: 92,
          heartRate: 84,
          bloodSugar: 141,
          sleepHours: 6.0,
          sleepQuality: 'Fair',
          notes: 'Mild fatigue reported',
        },
        {
          id: 'sj_4',
          date: '2026-09-18',
          systolic: 138,
          diastolic: 86,
          heartRate: 78,
          bloodSugar: 128,
          sleepHours: 7.0,
          sleepQuality: 'Good',
          notes: 'Stable morning reading',
        },
        {
          id: 'sj_5',
          date: '2026-09-14',
          systolic: 144,
          diastolic: 90,
          heartRate: 82,
          bloodSugar: 136,
          sleepHours: 6.0,
          sleepQuality: 'Fair',
          notes: 'Needs salt restriction',
        },
      ],
      medications: [
        {
          id: 'sj_m1',
          medicineName: 'Telmisartan 40mg',
          dosage: '1 Tablet',
          scheduleTime: '08:30 AM',
          frequency: 'Daily Before Breakfast',
          takenToday: false,
        },
      ],
      vaccines: [
        {
          id: 'sj_v1',
          vaccineName: 'Pneumococcal Conjugate (PCV13)',
          doseNumber: 1,
          status: 'Due',
          scheduledDate: '2026-10-05',
          clinicName: doctorClinic,
        },
      ],
      reports: [
        {
          id: 'sj_r1',
          title: 'Renal Function & Serum Electrolytes',
          category: 'Biochemistry',
          recordDate: '2026-09-18',
          summary: 'Serum Creatinine: 0.9 mg/dL, Sodium: 139 mEq/L, Potassium: 4.2 mEq/L.',
        },
      ],
    },
    {
      id: 'pat_comm_3',
      name: 'Mahesh Gokhale',
      age: 58,
      bloodGroup: 'A+',
      contactPhone: '+91 9890112233',
      triageStatus: 'Priority Follow-Up',
      chiefComplaint: 'Fasting blood glucose spike (164 mg/dL) — Post-festival dietary review',
      lastVisitDate: '2026-09-26',
      latestVitals: {
        date: '2026-09-27',
        systolic: 132,
        diastolic: 84,
        heartRate: 76,
        bloodSugar: 164,
        sleepHours: 6.5,
        sleepQuality: 'Good',
        waterGlasses: 7,
      },
      vitalsHistory: [
        {
          id: 'mg_1',
          date: '2026-09-27',
          systolic: 132,
          diastolic: 84,
          heartRate: 76,
          bloodSugar: 164,
          sleepHours: 6.5,
          sleepQuality: 'Good',
          notes: 'Fasting sugar elevated this morning',
        },
        {
          id: 'mg_2',
          date: '2026-09-24',
          systolic: 130,
          diastolic: 82,
          heartRate: 75,
          bloodSugar: 158,
          sleepHours: 7.0,
          sleepQuality: 'Good',
          notes: 'Post-festival sweets intake',
        },
        {
          id: 'mg_3',
          date: '2026-09-20',
          systolic: 128,
          diastolic: 80,
          heartRate: 73,
          bloodSugar: 142,
          sleepHours: 7.0,
          sleepQuality: 'Good',
          notes: 'Walking 20 mins post dinner',
        },
        {
          id: 'mg_4',
          date: '2026-09-16',
          systolic: 126,
          diastolic: 80,
          heartRate: 72,
          bloodSugar: 131,
          sleepHours: 7.5,
          sleepQuality: 'Good',
          notes: 'Regular Metformin SR 500mg',
        },
        {
          id: 'mg_5',
          date: '2026-09-12',
          systolic: 128,
          diastolic: 82,
          heartRate: 74,
          bloodSugar: 126,
          sleepHours: 7.0,
          sleepQuality: 'Good',
          notes: 'Baseline clinic review',
        },
      ],
      medications: [
        {
          id: 'mg_m1',
          medicineName: 'Metformin SR 500mg',
          dosage: '1 Tablet',
          scheduleTime: '09:00 PM',
          frequency: 'Daily After Dinner',
          takenToday: true,
        },
      ],
      vaccines: [
        {
          id: 'mg_v1',
          vaccineName: 'Annual Influenza Quadrivalent',
          doseNumber: 1,
          status: 'Completed',
          scheduledDate: '2026-08-12',
          clinicName: doctorClinic,
        },
      ],
      reports: [
        {
          id: 'mg_r1',
          title: 'HbA1c & Post-Prandial Glucose',
          category: 'Diabetology',
          recordDate: '2026-09-22',
          summary: 'Fasting: 164 mg/dL, PPBS: 218 mg/dL, HbA1c: 7.4%.',
        },
      ],
    },
  ];

  const [selectedPatientId, setSelectedPatientId] = useState<string>('pat_linked_1');
  const selectedPatient =
    patientRoster.find((p) => p.id === selectedPatientId) || patientRoster[0];

  // Build chronological series (oldest -> newest) for Recharts Blood Pressure & Glucose stability visualization
  const patientTrendData = [...selectedPatient.vitalsHistory]
    .reverse()
    .map((entry) => ({
      dateLabel: entry.date.slice(5), // MM-DD
      fullDate: entry.date,
      systolic: entry.systolic,
      diastolic: entry.diastolic,
      bloodSugar: entry.bloodSugar,
      heartRate: entry.heartRate,
      systolicTarget: 130,
      glucoseTarget: 110,
    }));

  const avgSystolic = Math.round(
    patientTrendData.reduce((acc, d) => acc + d.systolic, 0) /
      Math.max(1, patientTrendData.length)
  );
  const avgDiastolic = Math.round(
    patientTrendData.reduce((acc, d) => acc + d.diastolic, 0) /
      Math.max(1, patientTrendData.length)
  );
  const avgGlucose = Math.round(
    patientTrendData.reduce((acc, d) => acc + d.bloodSugar, 0) /
      Math.max(1, patientTrendData.length)
  );
  const systolicSpread =
    Math.max(...patientTrendData.map((d) => d.systolic)) -
    Math.min(...patientTrendData.map((d) => d.systolic));
  const glucoseSpread =
    Math.max(...patientTrendData.map((d) => d.bloodSugar)) -
    Math.min(...patientTrendData.map((d) => d.bloodSugar));

  const bpStabilityLabel =
    avgSystolic < 135 && systolicSpread <= 12
      ? 'Stable Normotensive Trend'
      : avgSystolic >= 145 || systolicSpread > 15
      ? 'Erratic / Hypertensive Fluctuation'
      : 'Borderline Elevated Variability';

  const glucoseStabilityLabel =
    avgGlucose <= 115 && glucoseSpread <= 18
      ? 'Stable Glycemic Control'
      : avgGlucose >= 140 || glucoseSpread > 25
      ? 'Spiking Fasting Hyperglycemia'
      : 'Moderate Post-Meal / Fasting Drift';

  // Digital E-Prescription State
  const [rxMedicine, setRxMedicine] = useState('');
  const [rxDosage, setRxDosage] = useState('1 Tablet (5mg)');
  const [rxScheduleTime, setRxScheduleTime] = useState('08:30 AM');
  const [rxFrequency, setRxFrequency] = useState('Daily After Breakfast (1-0-0)');
  const [rxDuration, setRxDuration] = useState('30 Days');
  const [rxInstructions, setRxInstructions] = useState(
    'Monitor BP twice weekly; restrict added table salt and processed snacks.'
  );
  const [rxSuccessBanner, setRxSuccessBanner] = useState<string | null>(null);
  const [issuedPrescriptions, setIssuedPrescriptions] = useState<EPrescriptionRecord[]>([
    {
      id: 'rx_init_1',
      patientName: linkedPatientName || 'Ramesh Kulkarni',
      doctorName,
      doctorSpecialty,
      registrationId: 'MMC-2026-88419',
      medicineName: 'Amlodipine 5mg',
      dosage: '1 Tablet',
      scheduleTime: '08:30 AM',
      frequency: 'Daily After Breakfast',
      durationDays: '30 Days',
      instructions: 'Take with water after morning meal. Do not skip dose.',
      issuedAt: '2026-09-27 · 09:15 AM',
    },
  ]);

  // Clinical Notes & Follow-Up Trigger State
  const [noteComplaint, setNoteComplaint] = useState('');
  const [noteAssessment, setNoteAssessment] = useState('');
  const [followUpDate, setFollowUpDate] = useState('2026-10-04');
  const [followUpAction, setFollowUpAction] = useState(
    'Auto-trigger patient reminder: Log Fasting Blood Sugar & Morning BP before Video Follow-Up'
  );
  const [noteSavedBanner, setNoteSavedBanner] = useState<string | null>(null);
  const [clinicalNotes, setClinicalNotes] = useState<ClinicalNoteRecord[]>([
    {
      id: 'cn_init_1',
      patientName: linkedPatientName || 'Ramesh Kulkarni',
      chiefComplaint: 'Routine hypertension & metabolic preventive checkup',
      clinicalAssessment:
        'BP 124/78 mmHg, Fasting Glucose 98 mg/dL. Good adherence to Shatpavali & low-sodium diet.',
      followUpDate: '2026-10-04',
      followUpTriggerAction: 'Weekly BP & Fasting Sugar log check-in',
      loggedAt: '2026-09-27 · 09:20 AM',
    },
  ]);

  // Integrated Telehealth Video/Audio Calling State
  const [callState, setCallState] = useState<'idle' | 'ringing' | 'connected'>('idle');
  const [callMode, setCallMode] = useState<'video' | 'voice'>('video');
  const [callSeconds, setCallSeconds] = useState(0);
  const [camActive, setCamActive] = useState(true);
  const [micActive, setMicActive] = useState(true);
  const [asyncReplyInput, setAsyncReplyInput] = useState('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Educational Content Publisher State
  const [articleTitle, setArticleTitle] = useState('');
  const [articleCategory, setArticleCategory] =
    useState<CommunityAdvisoryItem['urgency']>('Routine Awareness');
  const [articleBody, setArticleBody] = useState('');
  const [articlePublishedBanner, setArticlePublishedBanner] = useState<string | null>(null);

  // Risk Anomaly Alerts Acknowledgement State
  const [acknowledgedAlertIds, setAcknowledgedAlertIds] = useState<string[]>([]);

  // Offline Clinical PDF Export State
  const [pdfIncludeVitals, setPdfIncludeVitals] = useState(true);
  const [pdfIncludeMeds, setPdfIncludeMeds] = useState(true);
  const [pdfIncludeReports, setPdfIncludeReports] = useState(true);
  const [pdfIncludeVaccines, setPdfIncludeVaccines] = useState(true);
  const [showPdfOptionsPanel, setShowPdfOptionsPanel] = useState(false);
  const [exportedPdfFilename, setExportedPdfFilename] = useState<string | null>(null);

  const handleExportPatientClinicalPdf = (targetPatient: DoctorPatientProfile = selectedPatient) => {
    const fileName = generateDoctorPortalPatientPdf({
      doctorName,
      doctorSpecialty,
      doctorClinic,
      doctorPhone,
      registrationId: 'MMC-2026-88419',
      patient: {
        name: targetPatient.name,
        age: targetPatient.age,
        bloodGroup: targetPatient.bloodGroup,
        contactPhone: targetPatient.contactPhone,
        triageStatus: targetPatient.triageStatus,
        chiefComplaint: targetPatient.chiefComplaint,
        lastVisitDate: targetPatient.lastVisitDate,
        vitalsHistory: targetPatient.vitalsHistory,
        medications: targetPatient.medications,
        vaccines: targetPatient.vaccines,
        reports: targetPatient.reports,
      },
      bpStabilityLabel,
      glucoseStabilityLabel,
      issuedPrescriptions,
      clinicalNotes,
      includeSections: {
        vitalsAndTrends: pdfIncludeVitals,
        medicationsAndRx: pdfIncludeMeds,
        reportsAndNotes: pdfIncludeReports,
        immunizations: pdfIncludeVaccines,
      },
    });
    setExportedPdfFilename(fileName);
    setTimeout(() => setExportedPdfFilename(null), 6000);
  };

  // Build real-time anomaly alerts from patient metrics
  const computedAnomalies: RiskAnomalyAlert[] = [];
  if (
    latestLinkedVital.systolic >= 135 ||
    latestLinkedVital.diastolic >= 88 ||
    latestLinkedVital.bloodSugar >= 125
  ) {
    computedAnomalies.push({
      id: 'anom_linked_bp',
      patientId: 'pat_linked_1',
      patientName: linkedPatientName || 'Ramesh Kulkarni',
      patientAge: linkedPatientAge || 66,
      patientPhone: linkedPatientPhone || '+91 9823014567',
      severity:
        latestLinkedVital.systolic >= 145 || latestLinkedVital.bloodSugar >= 150
          ? 'Critical'
          : 'Warning',
      metricTitle: 'Elevated Live Patient Vitals Logged',
      metricValue: `BP ${latestLinkedVital.systolic}/${latestLinkedVital.diastolic} mmHg · Sugar ${latestLinkedVital.bloodSugar} mg/dL`,
      clinicalReason:
        'Patient logged above-target readings in their daily tracker. Recommend medication adherence check or tele-consultation.',
      detectedAt: 'Just now (Live App Telemetry)',
      acknowledged: acknowledgedAlertIds.includes('anom_linked_bp'),
    });
  }

  computedAnomalies.push(
    {
      id: 'anom_sj_bp',
      patientId: 'pat_comm_2',
      patientName: 'Shanta Joshi',
      patientAge: 71,
      patientPhone: '+91 9822198765',
      severity: 'Critical',
      metricTitle: 'Erratic Morning Blood Pressure Spike + Missed Dose',
      metricValue: 'BP 156/94 mmHg · Pulse 88 bpm · Telmisartan 40mg Pending',
      clinicalReason:
        'Systolic BP rose +14 mmHg over 48h and morning antihypertensive dose was not marked taken.',
      detectedAt: 'Today · 08:45 AM',
      acknowledged: acknowledgedAlertIds.includes('anom_sj_bp'),
    },
    {
      id: 'anom_mg_sugar',
      patientId: 'pat_comm_3',
      patientName: 'Mahesh Gokhale',
      patientAge: 58,
      patientPhone: '+91 9890112233',
      severity: 'Warning',
      metricTitle: 'Spiking Fasting Blood Glucose',
      metricValue: 'Fasting Glucose 164 mg/dL (Target < 110 mg/dL)',
      clinicalReason:
        'Fasting glucose exceeded 160 mg/dL for 2 consecutive mornings. Needs dietary glycemic adjustment & evening walk trigger.',
      detectedAt: 'Today · 07:50 AM',
      acknowledged: acknowledgedAlertIds.includes('anom_mg_sugar'),
    }
  );

  // Merge actual booked appointments with structured daily/weekly clinical schedule
  const combinedQueue = [
    ...appointments.map((a, idx) => ({
      id: a.id,
      patientId: 'pat_linked_1',
      patientName: linkedPatientName || 'Ramesh Kulkarni',
      patientAge: linkedPatientAge || 66,
      appointmentDate: a.appointmentDate,
      appointmentTime: a.appointmentTime,
      consultType: a.consultType,
      reason: a.reason,
      status: a.status,
      triage: idx === 0 && linkedPatientTriage === 'Urgent' ? ('Urgent' as const) : ('Routine' as const),
    })),
    {
      id: 'q_urgent_1',
      patientId: 'pat_comm_2',
      patientName: 'Shanta Joshi',
      patientAge: 71,
      appointmentDate: '2026-09-27',
      appointmentTime: '11:00 AM',
      consultType: 'Video' as const,
      reason: 'Urgent BP spike (156/94 mmHg) & dizziness evaluation',
      status: 'Scheduled' as const,
      triage: 'Urgent' as const,
    },
    {
      id: 'q_routine_2',
      patientId: 'pat_comm_3',
      patientName: 'Mahesh Gokhale',
      patientAge: 58,
      appointmentDate: '2026-09-28',
      appointmentTime: '04:30 PM',
      consultType: 'In-Person' as const,
      reason: 'Fasting glucose spike review & Metformin titration',
      status: 'Scheduled' as const,
      triage: 'Routine' as const,
    },
  ].filter((item) => {
    if (triageFilter === 'All') return true;
    return item.triage === triageFilter;
  });

  // Call timer
  useEffect(() => {
    if (callState !== 'connected') return;
    const t = window.setInterval(() => setCallSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(t);
  }, [callState]);

  const stopCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((tr) => tr.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopCameraStream();
  }, [stopCameraStream]);

  const startDoctorTeleCall = async (mode: 'video' | 'voice', patient?: DoctorPatientProfile) => {
    if (patient) setSelectedPatientId(patient.id);
    setCallMode(mode);
    setCallState('connected');
    setCallSeconds(0);
    setActiveSubTab('telehealth_chat');

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
      // Fallback if camera unavailable in iframe
    }
  };

  const endDoctorTeleCall = () => {
    stopCameraStream();
    setCallState('idle');
    setCallSeconds(0);
  };

  // Sign & Push Digital E-Prescription directly to Patient's App
  const handleSignAndPushPrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rxMedicine.trim()) return;

    const cleanMed = rxMedicine.trim();
    const newRx: EPrescriptionRecord = {
      id: `rx_${Date.now()}`,
      patientName: selectedPatient.name,
      doctorName,
      doctorSpecialty,
      registrationId: 'MMC-2026-88419',
      medicineName: cleanMed,
      dosage: rxDosage.trim() || '1 Tablet',
      scheduleTime: rxScheduleTime,
      frequency: rxFrequency.trim() || 'Daily',
      durationDays: rxDuration.trim() || '30 Days',
      instructions: rxInstructions.trim(),
      issuedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setIssuedPrescriptions((prev) => [newRx, ...prev]);

    // Push directly to the patient's active medication tracker & consultation chat!
    await onPushPrescriptionToPatient({
      medicineName: newRx.medicineName,
      dosage: newRx.dosage,
      scheduleTime: newRx.scheduleTime,
      frequency: `${newRx.frequency} (${newRx.durationDays})`,
      instructions: newRx.instructions,
      durationDays: newRx.durationDays,
    });

    const targetDocId = personalDoctors[0]?.id || 'doc_portal';
    const rxChatSummary = `📋 DIGITAL E-PRESCRIPTION (Signed by ${doctorName}, ${doctorSpecialty}): ${newRx.medicineName} — ${newRx.dosage} at ${newRx.scheduleTime} (${newRx.frequency}) for ${newRx.durationDays}. Instructions: ${newRx.instructions}`;
    await onSendChatMessage(targetDocId, 'doctor', rxChatSummary);

    setRxMedicine('');
    setRxSuccessBanner(
      `Signed E-Prescription for "${newRx.medicineName}" automatically pushed to ${selectedPatient.name}'s Medication Tracker & Chat!`
    );
    setTimeout(() => setRxSuccessBanner(null), 5000);
  };

  // Save Clinical Note & Trigger Automated Follow-Up Check-in
  const handleSaveClinicalNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteComplaint.trim() || !noteAssessment.trim()) return;

    const newNote: ClinicalNoteRecord = {
      id: `cn_${Date.now()}`,
      patientName: selectedPatient.name,
      chiefComplaint: noteComplaint.trim(),
      clinicalAssessment: noteAssessment.trim(),
      followUpDate,
      followUpTriggerAction: followUpAction.trim(),
      loggedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setClinicalNotes((prev) => [newNote, ...prev]);

    // Automatically schedule the follow-up check-in appointment & notify patient in chat
    await onBookAppointment({
      doctorName,
      specialty: doctorSpecialty,
      appointmentDate: followUpDate,
      appointmentTime: '10:30 AM',
      consultType: 'Video',
      reason: `Follow-Up Check-In: ${followUpAction.trim()}`,
    });

    const targetDocId = personalDoctors[0]?.id || 'doc_portal';
    await onSendChatMessage(
      targetDocId,
      'doctor',
      `🩺 CLINICAL SUMMARY & FOLLOW-UP TRIGGER (${doctorName}): Assessment: ${newNote.clinicalAssessment}. Scheduled Follow-Up on ${followUpDate}: ${newNote.followUpTriggerAction}`
    );

    setNoteComplaint('');
    setNoteAssessment('');
    setNoteSavedBanner(
      `Clinical summary logged & automated follow-up trigger set for ${selectedPatient.name} on ${followUpDate}!`
    );
    setTimeout(() => setNoteSavedBanner(null), 5000);
  };

  // Send Asynchronous Queue Reply
  const handleSendAsyncReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!asyncReplyInput.trim()) return;
    const text = asyncReplyInput.trim();
    setAsyncReplyInput('');
    const targetDocId = personalDoctors[0]?.id || 'doc_portal';
    await onSendChatMessage(targetDocId, 'doctor', text);
    onSpeakText(text);
  };

  // Publish Doctor-Authored Educational Content to Community
  const handlePublishArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleTitle.trim() || !articleBody.trim()) return;

    onPublishDoctorArticle({
      title: `🩺 Doctor Verified: ${articleTitle.trim()}`,
      message: articleBody.trim(),
      urgency: articleCategory,
      ward: doctorClinic,
      postedBy: `${doctorName} (${doctorSpecialty})`,
      postedDate: new Date().toISOString().slice(0, 10),
    });

    setArticleTitle('');
    setArticleBody('');
    setArticlePublishedBanner(
      'Educational health article published with Doctor Verified badge to the Community Health Library!'
    );
    setTimeout(() => setArticlePublishedBanner(null), 4500);
  };

  const navLabels = {
    en: {
      portalBadge: 'Verified Medical Practitioner Portal',
      tabs: [
        { id: 'queue_records', label: '1. Clinical Queue & Health Records' },
        { id: 'prescriptions_notes', label: '2. E-Prescriptions & Clinical Notes' },
        { id: 'telehealth_chat', label: '3. Telehealth Video & Async Chat' },
        { id: 'insights_publisher', label: '4. Risk Flagging & Article Publisher' },
      ],
    },
    hi: {
      portalBadge: 'डॉक्टर क्लिनिकल पोर्टल (Doctor’s Portal)',
      tabs: [
        { id: 'queue_records', label: '1. अपॉइंटमेंट क्यू और स्वास्थ्य रिकॉर्ड' },
        { id: 'prescriptions_notes', label: '2. डिजिटल ई-प्रिस्क्रिप्शन और नोट्स' },
        { id: 'telehealth_chat', label: '3. टेलीहेल्थ वीडियो और सुरक्षित चैट' },
        { id: 'insights_publisher', label: '4. रिस्क अलर्ट और स्वास्थ्य लेख' },
      ],
    },
    mr: {
      portalBadge: 'डॉक्टर क्लिनिकल पोर्टल (Doctor’s Portal)',
      tabs: [
        { id: 'queue_records', label: '१. अपॉइंटमेंट क्यू आणि रुग्ण रेकॉर्ड्स' },
        { id: 'prescriptions_notes', label: '२. डिजिटल ई-प्रिस्क्रिप्शन व नोट्स' },
        { id: 'telehealth_chat', label: '३. टेलीहेल्थ व्हिडिओ आणि सुरक्षित चॅट' },
        { id: 'insights_publisher', label: '४. रिस्क अलर्ट आणि आरोग्य लेख' },
      ],
    },
  }[language];

  return (
    <div className="space-y-6">
      {/* Top Doctor Clinical Identity & Quick Telemetry Banner */}
      <div className="p-6 bg-white border-2 border-teal-700/80 rounded-xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-950 text-xs font-semibold border border-emerald-300">
                <Stethoscope className="w-3.5 h-3.5 text-emerald-800" />
                <span>{navLabels.portalBadge}</span>
              </span>
              <span className="text-xs font-mono text-slate-500">
                Reg. ID: MMC-2026-88419 · Receiver: {doctorPhone}
              </span>
            </div>
            <h2 className={`font-display font-semibold text-slate-900 ${seniorMode ? 'text-2xl' : 'text-xl'}`}>
              {doctorName} — {doctorSpecialty}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {doctorClinic} · Streamlined Clinical Queue, Digital E-Prescriptions, Telehealth & Community Risk Insights
            </p>
          </div>

          {/* 4-Metric Clinical Workload Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
            <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <p className="text-[11px] text-slate-500">Today’s Queue</p>
              <p className="text-lg font-mono font-bold text-slate-900 tabular-nums">
                {combinedQueue.length}
              </p>
            </div>
            <div className="px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-200 text-center">
              <p className="text-[11px] text-red-700 font-medium">Urgent Triage</p>
              <p className="text-lg font-mono font-bold text-red-800 tabular-nums">
                {combinedQueue.filter((q) => q.triage === 'Urgent').length}
              </p>
            </div>
            <div className="px-3.5 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-center">
              <p className="text-[11px] text-amber-800 font-medium">Risk Alerts</p>
              <p className="text-lg font-mono font-bold text-amber-900 tabular-nums">
                {computedAnomalies.filter((a) => !a.acknowledged).length}
              </p>
            </div>
            <div className="px-3.5 py-2.5 rounded-xl bg-teal-50 border border-teal-200 text-center">
              <p className="text-[11px] text-teal-800 font-medium">E-Rx Pushed</p>
              <p className="text-lg font-mono font-bold text-teal-900 tabular-nums">
                {issuedPrescriptions.length}
              </p>
            </div>
          </div>
        </div>

        {/* 4-Module Doctor Portal Sub-Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
          {navLabels.tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as PortalSubTab)}
              className={`py-2.5 px-3.5 rounded-xl text-xs font-semibold transition-all text-left flex items-center justify-between cursor-pointer ${
                activeSubTab === tab.id
                  ? 'bg-teal-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <span className="truncate">{tab.label}</span>
              {tab.id === 'insights_publisher' &&
                computedAnomalies.filter((a) => !a.acknowledged).length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-mono text-[10px] font-bold">
                    {computedAnomalies.filter((a) => !a.acknowledged).length}
                  </span>
                )}
            </button>
          ))}
        </div>
      </div>

      {/* =====================================================================
          MODULE 1: CLINICAL DASHBOARD, LIVE APPOINTMENT QUEUE & QUICK HEALTH RECORDS VIEWER
      ===================================================================== */}
      {activeSubTab === 'queue_records' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 5 Cols: Live Appointment Schedule & Triage Queue */}
          <div className="lg:col-span-5 p-5 bg-white border border-slate-200 rounded-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-700" />
                <h3 className="font-semibold text-slate-900 text-base">
                  Live Appointment Schedule & Triage
                </h3>
              </div>

              {/* Daily vs Weekly Calendar Toggle */}
              <div className="flex items-center p-0.5 bg-slate-100 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setCalendarViewMode('daily')}
                  className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
                    calendarViewMode === 'daily'
                      ? 'bg-white text-teal-900 shadow-xs'
                      : 'text-slate-600'
                  }`}
                >
                  Daily View
                </button>
                <button
                  type="button"
                  onClick={() => setCalendarViewMode('weekly')}
                  className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
                    calendarViewMode === 'weekly'
                      ? 'bg-white text-teal-900 shadow-xs'
                      : 'text-slate-600'
                  }`}
                >
                  Weekly Calendar
                </button>
              </div>
            </div>

            {/* Triage Priority Filter (All vs Urgent vs Routine) */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter by Triage:</span>
              </span>
              <div className="flex items-center gap-1.5">
                {(['All', 'Urgent', 'Routine'] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setTriageFilter(status)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer border ${
                      triageFilter === status
                        ? status === 'Urgent'
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-teal-700 text-white border-teal-700'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Weekly Calendar Strip when Weekly mode is active */}
            {calendarViewMode === 'weekly' && (
              <div className="grid grid-cols-7 gap-1.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs">
                {[
                  { day: 'Sun', date: '27', count: 2, active: true },
                  { day: 'Mon', date: '28', count: 3, active: false },
                  { day: 'Tue', date: '29', count: 1, active: false },
                  { day: 'Wed', date: '30', count: 2, active: false },
                  { day: 'Thu', date: '01', count: 4, active: false },
                  { day: 'Fri', date: '02', count: 2, active: false },
                  { day: 'Sat', date: '03', count: 1, active: false },
                ].map((d) => (
                  <div
                    key={d.day}
                    className={`p-2 rounded-lg border ${
                      d.active
                        ? 'bg-teal-700 text-white border-teal-700 font-semibold'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    <p className="text-[10px] opacity-80">{d.day}</p>
                    <p className="font-mono text-sm">{d.date}</p>
                    <p className="text-[10px] font-mono mt-0.5">{d.count} visit</p>
                  </div>
                ))}
              </div>
            )}

            {/* Appointment Queue Cards */}
            <div className="space-y-3">
              {combinedQueue.map((item) => {
                const matchedPat =
                  patientRoster.find((p) => p.id === item.patientId) || patientRoster[0];
                const isSelected = selectedPatient.id === matchedPat.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedPatientId(matchedPat.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                      isSelected
                        ? 'border-2 border-teal-700 bg-teal-50/40'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                              item.triage === 'Urgent'
                                ? 'bg-red-100 text-red-900 border border-red-300'
                                : 'bg-teal-100 text-teal-900'
                            }`}
                          >
                            {item.triage} Triage
                          </span>
                          <span className="text-xs font-mono font-semibold text-slate-700">
                            {item.appointmentDate} · {item.appointmentTime}
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                            {item.consultType}
                          </span>
                        </div>
                        <h4 className="font-semibold text-slate-900 text-sm mt-1.5">
                          {item.patientName} ({item.patientAge} yrs)
                        </h4>
                        <p className="text-xs text-slate-600 mt-0.5">{item.reason}</p>
                      </div>
                    </div>

                    <div
                      className="pt-2 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedPatientId(matchedPat.id)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-teal-800 hover:underline cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Records</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => startDoctorTeleCall('video', matchedPat)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 cursor-pointer"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Start Consult</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPatientId(matchedPat.id);
                            setActiveSubTab('prescriptions_notes');
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-teal-700 bg-white text-teal-900 text-xs font-semibold hover:bg-teal-50 cursor-pointer"
                        >
                          <Pill className="w-3.5 h-3.5" />
                          <span>Write E-Rx</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleExportPatientClinicalPdf(matchedPat)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-300 bg-slate-50 text-slate-800 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                          title="Export offline PDF report for this patient"
                        >
                          <FileDown className="w-3.5 h-3.5 text-teal-700" />
                          <span>PDF</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 7 Cols: Quick Health Records Viewer (Selected Patient Chart) */}
          <div className="lg:col-span-7 p-6 bg-white border border-slate-200 rounded-xl space-y-5">
            {/* Patient Switcher Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">
                    Quick Health Records Viewer
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      selectedPatient.triageStatus === 'Urgent'
                        ? 'bg-red-100 text-red-900'
                        : selectedPatient.triageStatus === 'Priority Follow-Up'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-emerald-100 text-emerald-900'
                    }`}
                  >
                    {selectedPatient.triageStatus}
                  </span>
                </div>
                <h3 className="text-xl font-display font-semibold text-slate-900 mt-0.5">
                  {selectedPatient.name} · {selectedPatient.age} yrs · Blood Group{' '}
                  {selectedPatient.bloodGroup}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Contact: <span className="font-mono">{selectedPatient.contactPhone}</span> · Chief
                  Complaint: {selectedPatient.chiefComplaint}
                </p>
              </div>

              {/* Select Any Patient in Roster + Export Offline Clinical PDF */}
              <div className="flex flex-wrap items-center gap-2">
                {patientRoster.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPatientId(p.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                      selectedPatient.id === p.id
                        ? 'bg-teal-700 text-white border-teal-700'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => handleExportPatientClinicalPdf(selectedPatient)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5 text-teal-300" />
                  <span>Export Patient PDF Report</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPdfOptionsPanel((prev) => !prev)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-medium cursor-pointer"
                >
                  {showPdfOptionsPanel ? 'Hide PDF Options' : 'PDF Sections'}
                </button>
              </div>
            </div>

            {/* Offline Clinical PDF Export Feedback & Section Customization Bar */}
            {exportedPdfFilename && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-semibold flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    Offline Clinical PDF Report exported for <strong>{selectedPatient.name}</strong>:{' '}
                    <span className="font-mono">{exportedPdfFilename}</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleExportPatientClinicalPdf(selectedPatient)}
                  className="text-emerald-800 underline font-semibold whitespace-nowrap cursor-pointer"
                >
                  Download Again
                </button>
              </div>
            )}

            {showPdfOptionsPanel && (
              <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-semibold text-teal-950 flex items-center gap-1.5">
                      <FileDown className="w-3.5 h-3.5 text-teal-700" />
                      <span>
                        Customize Offline Clinical PDF Dossier for {selectedPatient.name}
                      </span>
                    </h4>
                    <p className="text-[11px] text-teal-900/80">
                      Select which clinical modules to bundle into the downloadable A4 PDF report for offline ward rounds or referrals.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleExportPatientClinicalPdf(selectedPatient)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold whitespace-nowrap cursor-pointer self-start sm:self-auto"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Generate & Download PDF</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                  <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-teal-200/80 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pdfIncludeVitals}
                      onChange={(e) => setPdfIncludeVitals(e.target.checked)}
                      className="rounded text-teal-700"
                    />
                    <span className="font-medium text-slate-800">
                      Vitals & BP/Glucose Stability ({selectedPatient.vitalsHistory.length})
                    </span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-teal-200/80 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pdfIncludeMeds}
                      onChange={(e) => setPdfIncludeMeds(e.target.checked)}
                      className="rounded text-teal-700"
                    />
                    <span className="font-medium text-slate-800">
                      Active Meds & Signed E-Rx ({selectedPatient.medications.length})
                    </span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-teal-200/80 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pdfIncludeReports}
                      onChange={(e) => setPdfIncludeReports(e.target.checked)}
                      className="rounded text-teal-700"
                    />
                    <span className="font-medium text-slate-800">
                      Lab Reports & Clinical Notes ({selectedPatient.reports.length})
                    </span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-teal-200/80 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pdfIncludeVaccines}
                      onChange={(e) => setPdfIncludeVaccines(e.target.checked)}
                      className="rounded text-teal-700"
                    />
                    <span className="font-medium text-slate-800">
                      Immunization Records ({selectedPatient.vaccines.length})
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Patient Latest Vitals Telemetry Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-[11px] text-slate-500">Blood Pressure</p>
                <p
                  className={`text-lg font-mono font-bold tabular-nums ${
                    selectedPatient.latestVitals.systolic >= 140
                      ? 'text-red-700'
                      : 'text-slate-900'
                  }`}
                >
                  {selectedPatient.latestVitals.systolic}/{selectedPatient.latestVitals.diastolic}{' '}
                  <span className="text-[10px] font-normal">mmHg</span>
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-[11px] text-slate-500">Fasting Glucose</p>
                <p
                  className={`text-lg font-mono font-bold tabular-nums ${
                    selectedPatient.latestVitals.bloodSugar >= 130
                      ? 'text-amber-700'
                      : 'text-slate-900'
                  }`}
                >
                  {selectedPatient.latestVitals.bloodSugar}{' '}
                  <span className="text-[10px] font-normal">mg/dL</span>
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-[11px] text-slate-500">Heart Rate</p>
                <p className="text-lg font-mono font-bold text-slate-900 tabular-nums">
                  {selectedPatient.latestVitals.heartRate}{' '}
                  <span className="text-[10px] font-normal">bpm</span>
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-[11px] text-slate-500">Sleep & Hydration</p>
                <p className="text-sm font-mono font-bold text-slate-900 tabular-nums mt-0.5">
                  {selectedPatient.latestVitals.sleepHours}h ({selectedPatient.latestVitals.sleepQuality}) ·{' '}
                  {selectedPatient.latestVitals.waterGlasses} gl
                </p>
              </div>
            </div>

            {/* Patient Health Trends Visualization (Recharts: Blood Pressure & Glucose Stability Over Time) */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50/80 border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
                <div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-teal-700" />
                    <h4 className="text-sm font-semibold text-slate-900">
                      Patient Health Trends — Blood Pressure & Glucose Stability Over Time
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Mean BP: <strong className="font-mono">{avgSystolic}/{avgDiastolic} mmHg</strong> ({bpStabilityLabel}) · Mean Fasting Glucose:{' '}
                    <strong className="font-mono">{avgGlucose} mg/dL</strong> ({glucoseStabilityLabel})
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center p-0.5 bg-white border border-slate-200 rounded-lg text-xs">
                    {(
                      [
                        { id: 'both', label: 'Both Charts' },
                        { id: 'bp', label: 'BP Stability' },
                        { id: 'glucose', label: 'Glucose Stability' },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setTrendChartFocus(opt.id)}
                        className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                          trendChartFocus === opt.id
                            ? 'bg-teal-700 text-white'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      onSpeakText(
                        `Health trend summary for ${selectedPatient.name}. Average blood pressure is ${avgSystolic} over ${avgDiastolic} millimeters of mercury, showing ${bpStabilityLabel}. Average fasting glucose is ${avgGlucose} milligrams per deciliter, showing ${glucoseStabilityLabel}.`
                      )
                    }
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-teal-800 text-xs font-semibold hover:bg-teal-50 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Audio Summary</span>
                  </button>
                </div>
              </div>

              <div
                className={`grid grid-cols-1 ${
                  trendChartFocus === 'both' ? 'xl:grid-cols-2' : ''
                } gap-4`}
              >
                {/* Chart 1: Blood Pressure (Systolic & Diastolic) Stability Over Time */}
                {(trendChartFocus === 'both' || trendChartFocus === 'bp') && (
                  <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h5 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                          <HeartPulse className="w-3.5 h-3.5 text-teal-700" />
                          <span>Blood Pressure Stability (Systolic / Diastolic mmHg)</span>
                        </h5>
                        <p className="text-[11px] text-slate-500">
                          Dashed threshold at 130/85 mmHg · Spread: ±{systolicSpread} mmHg
                        </p>
                      </div>
                      <span
                        className={`text-[11px] font-mono font-semibold ${
                          avgSystolic >= 140
                            ? 'text-red-700'
                            : avgSystolic >= 130
                            ? 'text-amber-700'
                            : 'text-emerald-700'
                        }`}
                      >
                        Avg {avgSystolic}/{avgDiastolic} mmHg
                      </span>
                    </div>

                    <div className="h-56 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={patientTrendData}
                          margin={{ top: 10, right: 14, left: -12, bottom: 4 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis
                            dataKey="dateLabel"
                            tick={{ fontSize: 11, fill: '#475569' }}
                            stroke="#cbd5e1"
                          />
                          <YAxis
                            domain={[60, 175]}
                            tick={{ fontSize: 11, fill: '#475569' }}
                            stroke="#cbd5e1"
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#ffffff',
                              borderColor: '#cbd5e1',
                              borderRadius: '8px',
                              fontSize: '12px',
                            }}
                            formatter={(value: any, name: any) => [
                              `${value} mmHg`,
                              name === 'systolic' ? 'Systolic BP' : 'Diastolic BP',
                            ]}
                            labelFormatter={(label) => `Date: 2026-${label}`}
                          />
                          <Legend
                            wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }}
                            formatter={(value) =>
                              value === 'systolic' ? 'Systolic BP (mmHg)' : 'Diastolic BP (mmHg)'
                            }
                          />
                          <ReferenceLine
                            y={130}
                            stroke="#dc2626"
                            strokeDasharray="4 4"
                            label={{
                              value: '130 Target',
                              position: 'insideTopRight',
                              fill: '#b91c1c',
                              fontSize: 10,
                            }}
                          />
                          <ReferenceLine
                            y={85}
                            stroke="#0f766e"
                            strokeDasharray="3 3"
                          />
                          <Line
                            type="monotone"
                            dataKey="systolic"
                            stroke="#0f766e"
                            strokeWidth={2.5}
                            dot={{ r: 4, fill: '#0f766e', strokeWidth: 1.5, stroke: '#ffffff' }}
                            activeDot={{ r: 6 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="diastolic"
                            stroke="#0284c7"
                            strokeWidth={2}
                            dot={{ r: 3.5, fill: '#0284c7', strokeWidth: 1.5, stroke: '#ffffff' }}
                            activeDot={{ r: 5 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Chart 2: Fasting Blood Glucose Stability Over Time */}
                {(trendChartFocus === 'both' || trendChartFocus === 'glucose') && (
                  <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h5 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-amber-600" />
                          <span>Fasting Blood Glucose Stability (mg/dL)</span>
                        </h5>
                        <p className="text-[11px] text-slate-500">
                          Target &lt; 110 mg/dL · Glycemic Swing: ±{glucoseSpread} mg/dL
                        </p>
                      </div>
                      <span
                        className={`text-[11px] font-mono font-semibold ${
                          avgGlucose >= 140
                            ? 'text-red-700'
                            : avgGlucose > 110
                            ? 'text-amber-700'
                            : 'text-emerald-700'
                        }`}
                      >
                        Avg {avgGlucose} mg/dL
                      </span>
                    </div>

                    <div className="h-56 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={patientTrendData}
                          margin={{ top: 10, right: 14, left: -12, bottom: 4 }}
                        >
                          <defs>
                            <linearGradient id="glucoseStabilityGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#d97706" stopOpacity={0.28} />
                              <stop offset="95%" stopColor="#d97706" stopOpacity={0.03} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis
                            dataKey="dateLabel"
                            tick={{ fontSize: 11, fill: '#475569' }}
                            stroke="#cbd5e1"
                          />
                          <YAxis
                            domain={[75, 185]}
                            tick={{ fontSize: 11, fill: '#475569' }}
                            stroke="#cbd5e1"
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#ffffff',
                              borderColor: '#cbd5e1',
                              borderRadius: '8px',
                              fontSize: '12px',
                            }}
                            formatter={(value: any) => [`${value} mg/dL`, 'Fasting Glucose']}
                            labelFormatter={(label) => `Date: 2026-${label}`}
                          />
                          <Legend
                            wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }}
                            formatter={() => 'Fasting Blood Glucose (mg/dL)'}
                          />
                          <ReferenceLine
                            y={110}
                            stroke="#059669"
                            strokeDasharray="4 4"
                            label={{
                              value: '110 Optimal',
                              position: 'insideTopRight',
                              fill: '#047857',
                              fontSize: 10,
                            }}
                          />
                          <ReferenceLine
                            y={140}
                            stroke="#dc2626"
                            strokeDasharray="3 3"
                          />
                          <Area
                            type="monotone"
                            dataKey="bloodSugar"
                            stroke="#d97706"
                            strokeWidth={2.5}
                            fillOpacity={1}
                            fill="url(#glucoseStabilityGrad)"
                            dot={{ r: 4, fill: '#d97706', strokeWidth: 1.5, stroke: '#ffffff' }}
                            activeDot={{ r: 6 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Historical Vitals Log Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-teal-700" />
                <span>Logged Vitals History</span>
              </h4>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">BP (mmHg)</th>
                      <th className="py-2 px-3">Glucose</th>
                      <th className="py-2 px-3">Pulse</th>
                      <th className="py-2 px-3">Sleep</th>
                      <th className="py-2 px-3">Patient Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono tabular-nums">
                    {selectedPatient.vitalsHistory.map((v) => (
                      <tr key={v.id}>
                        <td className="py-2 px-3">{v.date}</td>
                        <td className="py-2 px-3 font-semibold">
                          {v.systolic}/{v.diastolic}
                        </td>
                        <td className="py-2 px-3">{v.bloodSugar} mg/dL</td>
                        <td className="py-2 px-3">{v.heartRate} bpm</td>
                        <td className="py-2 px-3">{v.sleepHours} hrs</td>
                        <td className="py-2 px-3 font-sans text-slate-600">{v.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Active Medications + Uploaded Reports Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Active Medications */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-teal-700" />
                    <span>Active Medications ({selectedPatient.medications.length})</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setActiveSubTab('prescriptions_notes')}
                    className="text-[11px] font-semibold text-teal-700 hover:underline cursor-pointer"
                  >
                    + Prescribe New
                  </button>
                </div>
                <div className="space-y-2">
                  {selectedPatient.medications.map((m) => (
                    <div
                      key={m.id}
                      className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">{m.medicineName}</p>
                        <p className="text-[11px] text-slate-500">
                          {m.dosage} · {m.scheduleTime} · {m.frequency}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          m.takenToday
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {m.takenToday ? 'Taken Today' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Linked Reports & Lab Summaries */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <h4 className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-teal-700" />
                  <span>Uploaded Reports & Records ({selectedPatient.reports.length})</span>
                </h4>
                <div className="space-y-2">
                  {selectedPatient.reports.map((rep) => (
                    <div
                      key={rep.id}
                      className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">{rep.title}</span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {rep.recordDate}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">{rep.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODULE 2: DIGITAL E-PRESCRIPTIONS & CLINICAL NOTES / FOLLOW-UP TRIGGERS
      ===================================================================== */}
      {activeSubTab === 'prescriptions_notes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 6 Cols: Digital E-Prescription Writer & Auto-Push to Patient App */}
          <div className="lg:col-span-6 p-6 bg-white border border-slate-200 rounded-xl space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
                  <Pill className="w-4 h-4 text-teal-700" />
                  <span>Digital E-Prescription Writer (Auto-Push to Patient App)</span>
                </h3>
                <span className="text-xs font-mono text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
                  Patient: {selectedPatient.name}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Write, digitally sign, and push medications directly into the patient’s Daily Medication Reminders & Consultation Chat.
              </p>
            </div>

            {rxSuccessBanner && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{rxSuccessBanner}</span>
              </div>
            )}

            <form onSubmit={handleSignAndPushPrescription} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Medicine Name & Strength *
                </label>
                <input
                  type="text"
                  value={rxMedicine}
                  onChange={(e) => setRxMedicine(e.target.value)}
                  placeholder="e.g., Telmisartan 40mg / Metformin SR 500mg / Vitamin D3 60k IU"
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Dosage *
                  </label>
                  <input
                    type="text"
                    value={rxDosage}
                    onChange={(e) => setRxDosage(e.target.value)}
                    placeholder="1 Tablet"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Schedule Time *
                  </label>
                  <select
                    value={rxScheduleTime}
                    onChange={(e) => setRxScheduleTime(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono bg-white"
                  >
                    <option value="08:00 AM">08:00 AM</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="01:30 PM">01:30 PM</option>
                    <option value="08:30 PM">08:30 PM</option>
                    <option value="09:30 PM">09:30 PM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Duration *
                  </label>
                  <input
                    type="text"
                    value={rxDuration}
                    onChange={(e) => setRxDuration(e.target.value)}
                    placeholder="30 Days"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Frequency & Timing (Regimen) *
                </label>
                <input
                  type="text"
                  value={rxFrequency}
                  onChange={(e) => setRxFrequency(e.target.value)}
                  placeholder="Daily After Breakfast (1-0-0)"
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Clinical & Dietary Instructions
                </label>
                <textarea
                  rows={2}
                  value={rxInstructions}
                  onChange={(e) => setRxInstructions(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm"
                />
              </div>

              {/* Digital Signature Verification Box */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-900">
                    Digitally Signed by: {doctorName}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {doctorSpecialty} · {doctorClinic} · Reg: MMC-2026-88419
                  </p>
                </div>
                <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-900 font-semibold text-[11px]">
                  Verified E-Sign
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-teal-700 text-white font-semibold text-sm hover:bg-teal-800 transition-colors cursor-pointer"
              >
                Sign & Push E-Prescription to Patient’s App
              </button>
            </form>

            {/* Issued Prescriptions History */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Recently Signed E-Prescriptions ({issuedPrescriptions.length})
              </h4>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {issuedPrescriptions.map((rx) => (
                  <div
                    key={rx.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">
                        {rx.medicineName} — {rx.dosage}
                      </span>
                      <span className="font-mono text-[11px] text-teal-800">{rx.issuedAt}</span>
                    </div>
                    <p className="text-slate-600">
                      Patient: <strong>{rx.patientName}</strong> · {rx.scheduleTime} ·{' '}
                      {rx.frequency} ({rx.durationDays})
                    </p>
                    <p className="text-[11px] text-slate-500">{rx.instructions}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 6 Cols: Clinical Notes & Automated Follow-Up Triggers */}
          <div className="lg:col-span-6 p-6 bg-white border border-slate-200 rounded-xl space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4 text-teal-700" />
                <span>Clinical Notes & Automated Follow-Up Triggers</span>
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Log structured consultation summaries and set automated check-in reminders that sync to the patient’s schedule.
              </p>
            </div>

            {noteSavedBanner && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{noteSavedBanner}</span>
              </div>
            )}

            <form onSubmit={handleSaveClinicalNote} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Chief Complaint & Symptom Presentation *
                </label>
                <input
                  type="text"
                  value={noteComplaint}
                  onChange={(e) => setNoteComplaint(e.target.value)}
                  placeholder="e.g., Mild morning headache, BP 138/86 mmHg, reviewing salt intake"
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Clinical Assessment, Diagnosis & Care Plan *
                </label>
                <textarea
                  rows={3}
                  value={noteAssessment}
                  onChange={(e) => setNoteAssessment(e.target.value)}
                  placeholder="e.g., Stage 1 Hypertension controlled on current regimen. Advised 20-min post-dinner Shatpavali and repeat fasting glucose next week."
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Follow-Up Check-In Date *
                  </label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Automated Patient Check-In Trigger *
                  </label>
                  <input
                    type="text"
                    value={followUpAction}
                    onChange={(e) => setFollowUpAction(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-teal-700 text-white font-semibold text-sm hover:bg-teal-800 transition-colors cursor-pointer"
              >
                Save Clinical Summary & Trigger Patient Check-In Reminder
              </button>
            </form>

            {/* Logged Clinical Notes List */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Consultation Summaries & Active Triggers ({clinicalNotes.length})
              </h4>
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {clinicalNotes.map((cn) => (
                  <div
                    key={cn.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">
                        Patient: {cn.patientName}
                      </span>
                      <span className="font-mono text-[11px] text-slate-500">{cn.loggedAt}</span>
                    </div>
                    <p className="text-slate-800 font-medium">{cn.chiefComplaint}</p>
                    <p className="text-slate-600 leading-relaxed">{cn.clinicalAssessment}</p>
                    <div className="pt-1 flex items-center gap-1.5 text-teal-800 font-semibold">
                      <BellRing className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                      <span>
                        Trigger ({cn.followUpDate}): {cn.followUpTriggerAction}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODULE 3: TELEHEALTH VIDEO/AUDIO CALLING & ASYNCHRONOUS MESSAGING QUEUE
      ===================================================================== */}
      {activeSubTab === 'telehealth_chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 6 Cols: Integrated WebRTC Video / Audio Calling Station */}
          <div className="lg:col-span-6 p-6 bg-slate-900 text-white rounded-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-teal-400" />
                <h3 className="font-semibold text-base">
                  Integrated Telehealth Video & Audio Calling
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-300">
                Patient: {selectedPatient.name}
              </span>
            </div>

            {callState === 'idle' ? (
              <div className="p-8 rounded-xl bg-slate-800/90 border border-slate-700 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-teal-700/40 border border-teal-500/50 flex items-center justify-center mx-auto">
                  <Video className="w-7 h-7 text-teal-300" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-base text-white">
                    Ready to Start Virtual Visit with {selectedPatient.name}
                  </h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Launch an encrypted WebRTC video or voice consultation with live patient vitals telemetry (BP {selectedPatient.latestVitals.systolic}/{selectedPatient.latestVitals.diastolic} mmHg, Glucose {selectedPatient.latestVitals.bloodSugar} mg/dL).
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => startDoctorTeleCall('video')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold cursor-pointer"
                  >
                    <Video className="w-4 h-4" />
                    <span>Start Video Consultation</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => startDoctorTeleCall('voice')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Start Audio Call</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden bg-slate-950 h-64 border border-slate-700 flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${
                      !camActive || callMode === 'voice' ? 'hidden' : ''
                    }`}
                  />
                  {(!camActive || callMode === 'voice') && (
                    <div className="text-center space-y-2">
                      <p className="text-sm font-semibold text-teal-300">
                        Connected with {selectedPatient.name} ({selectedPatient.contactPhone})
                      </p>
                      <p className="text-xs font-mono text-slate-400">
                        Duration: {Math.floor(callSeconds / 60)}m {callSeconds % 60}s
                      </p>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-black/70 px-3 py-1 rounded-md text-xs font-mono text-emerald-300">
                    LIVE · BP {selectedPatient.latestVitals.systolic}/
                    {selectedPatient.latestVitals.diastolic} · Sugar{' '}
                    {selectedPatient.latestVitals.bloodSugar} mg/dL
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setMicActive((m) => !m)}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5"
                  >
                    {micActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    <span>{micActive ? 'Mute Mic' : 'Unmute Mic'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCamActive((c) => !c)}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5"
                  >
                    {camActive ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                    <span>{camActive ? 'Pause Camera' : 'Resume Camera'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={endDoctorTeleCall}
                    className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span>End Call</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right 6 Cols: Asynchronous Messaging Queue (HIPAA-Compliant Direct Patient Follow-Up Chat) */}
          <div className="lg:col-span-6 p-6 bg-white border border-slate-200 rounded-xl flex flex-col h-[480px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-700" />
                <h3 className="font-semibold text-slate-900 text-base">
                  Asynchronous Patient Messaging Queue
                </h3>
              </div>
              <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded">
                HIPAA / AES-256 Encrypted
              </span>
            </div>

            {/* Quick Clinical Response Templates */}
            <div className="flex flex-wrap items-center gap-1.5 py-2.5 border-b border-slate-100">
              {[
                'Your BP & sugar readings look stable. Continue current dosage.',
                'Please reduce salt intake and repeat BP reading tomorrow morning.',
                'I have pushed an updated E-Prescription to your app.',
              ].map((tpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAsyncReplyInput(tpl)}
                  className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-900 border border-slate-200 cursor-pointer"
                >
                  + "{tpl.slice(0, 38)}..."
                </button>
              ))}
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1">
              {chatMessages.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 text-xs text-slate-600 space-y-1">
                  <p className="font-semibold text-slate-800">
                    Active Patient Thread: {selectedPatient.name} ({selectedPatient.contactPhone})
                  </p>
                  <p>
                    Send a follow-up message or select a clinical quick-reply above. Any message sent here appears immediately in the patient’s app and is spoken aloud if voice mode is active.
                  </p>
                </div>
              ) : (
                chatMessages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[82%] rounded-xl px-4 py-2.5 text-xs sm:text-sm ${
                        m.sender === 'doctor'
                          ? 'bg-teal-700 text-white'
                          : 'bg-slate-100 text-slate-900 border border-slate-200'
                      }`}
                    >
                      <p className="font-semibold text-[11px] mb-0.5 opacity-85">
                        {m.sender === 'doctor' ? doctorName : selectedPatient.name}
                      </p>
                      <p>{m.text}</p>
                      <p className="text-[10px] font-mono opacity-75 mt-1">{m.timestamp}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form
              onSubmit={handleSendAsyncReply}
              className="pt-3 border-t border-slate-100 flex gap-2"
            >
              <input
                type="text"
                value={asyncReplyInput}
                onChange={(e) => setAsyncReplyInput(e.target.value)}
                placeholder={`Reply directly to ${selectedPatient.name}...`}
                className="flex-1 rounded-lg border border-slate-300 px-3.5 py-2 text-sm"
              />
              <button
                type="submit"
                disabled={!asyncReplyInput.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 disabled:opacity-40 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Reply</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODULE 4: COMMUNITY HEALTH INSIGHTS, ANOMALY RISK FLAGGING & EDUCATIONAL CONTENT PUBLISHER
      ===================================================================== */}
      {activeSubTab === 'insights_publisher' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 7 Cols: Automated Anomalies & Risk Alert Triggers */}
          <div className="lg:col-span-7 p-6 bg-white border border-slate-200 rounded-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                <div>
                  <h3 className="font-semibold text-slate-900 text-base">
                    Automated Patient Vitals Anomalies & Risk Alert Triggers
                  </h3>
                  <p className="text-xs text-slate-600">
                    Real-time risk flagging when patients under your care log erratic blood pressure, spiking fasting glucose, or missed medications.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {computedAnomalies.map((alert) => {
                const matchedPat =
                  patientRoster.find((p) => p.id === alert.patientId) || patientRoster[0];

                return (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-xl border space-y-2.5 ${
                      alert.acknowledged
                        ? 'bg-slate-50 border-slate-200 opacity-75'
                        : alert.severity === 'Critical'
                        ? 'bg-red-50/70 border-red-300'
                        : 'bg-amber-50/70 border-amber-300'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            alert.severity === 'Critical'
                              ? 'bg-red-600 text-white'
                              : 'bg-amber-500 text-slate-950'
                          }`}
                        >
                          {alert.severity} Risk Flag
                        </span>
                        <h4 className="font-semibold text-slate-900 text-sm">
                          {alert.patientName} ({alert.patientAge} yrs) · {alert.patientPhone}
                        </h4>
                      </div>
                      <span className="text-xs font-mono text-slate-500">{alert.detectedAt}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white border border-slate-200/80">
                      <p className="text-xs font-semibold text-slate-900">{alert.metricTitle}</p>
                      <p className="text-xs font-mono font-bold text-red-700 mt-0.5">
                        {alert.metricValue}
                      </p>
                      <p className="text-xs text-slate-600 mt-1">{alert.clinicalReason}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => startDoctorTeleCall('video', matchedPat)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Call Patient Now</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPatientId(matchedPat.id);
                            setActiveSubTab('prescriptions_notes');
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold cursor-pointer"
                        >
                          <Pill className="w-3.5 h-3.5" />
                          <span>Adjust E-Prescription</span>
                        </button>
                      </div>

                      {!alert.acknowledged && (
                        <button
                          type="button"
                          onClick={() =>
                            setAcknowledgedAlertIds((prev) => [...prev, alert.id])
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-medium hover:bg-slate-100 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Acknowledge Alert</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 5 Cols: Doctor Educational Content & Community Advisory Publisher */}
          <div className="lg:col-span-5 p-6 bg-white border border-slate-200 rounded-xl space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-700" />
                <h3 className="font-semibold text-slate-900 text-base">
                  Educational Content & Wellness Publisher
                </h3>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Author or medically approve preventive health articles, diet advisories, and seasonal wellness tips visible to the entire community.
              </p>
            </div>

            {articlePublishedBanner && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{articlePublishedBanner}</span>
              </div>
            )}

            <form onSubmit={handlePublishArticle} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Article / Advisory Title *
                </label>
                <input
                  type="text"
                  value={articleTitle}
                  onChange={(e) => setArticleTitle(e.target.value)}
                  placeholder="e.g., How Seniors Can Prevent Morning Blood Pressure Spikes in Winter"
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Clinical Category
                </label>
                <select
                  value={articleCategory}
                  onChange={(e) =>
                    setArticleCategory(e.target.value as CommunityAdvisoryItem['urgency'])
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold bg-white"
                >
                  <option value="Routine Awareness">Preventive Wellness & Diet Article</option>
                  <option value="Seasonal Alert">Seasonal Disease Alert</option>
                  <option value="Urgent Drive">Urgent Screening Recommendation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Doctor-Verified Guidance & Actionable Tips *
                </label>
                <textarea
                  rows={4}
                  value={articleBody}
                  onChange={(e) => setArticleBody(e.target.value)}
                  placeholder="Write clear, senior-friendly preventive health advice, dietary guidelines, or warning symptoms..."
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 cursor-pointer"
              >
                Publish Doctor-Verified Article to Community
              </button>
            </form>

            {/* Published Community Articles & Advisories */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Published Community Health Articles ({advisories.length})
              </h4>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {advisories.map((adv) => (
                  <div
                    key={adv.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-900">{adv.title}</span>
                      <button
                        type="button"
                        onClick={() => onSpeakText(`${adv.title}. ${adv.message}`)}
                        className="text-teal-700 hover:underline inline-flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Listen</span>
                      </button>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{adv.message}</p>
                    <p className="text-[10px] text-slate-500">
                      {adv.postedBy} · {adv.postedDate}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
