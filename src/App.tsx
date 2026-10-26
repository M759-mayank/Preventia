/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  onSnapshot,
  serverTimestamp,
  query,
  where,
} from 'firebase/firestore';
import {
  auth,
  db,
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  logOutUser,
  handleFirestoreError,
  OperationType,
} from './firebase';
import { Language, UI_STRINGS } from './i18n/translations';
import { SymptomTriageSection } from './components/SymptomTriageSection';
import { PreventionLibrarySection } from './components/PreventionLibrarySection';
import {
  TelemedicineSection,
  AppointmentItem,
  ChatMessageItem,
  PersonalDoctorItem,
} from './components/TelemedicineSection';
import { EmergencyMapSection } from './components/EmergencyMapSection';
import {
  EncryptedVaultSection,
  MedicalRecordItem,
} from './components/EncryptedVaultSection';
import {
  LoginOnboardingPage,
  PatientLoginPayload,
  LoginCategory,
} from './components/LoginOnboardingPage';
import {
  CommunityProjectHeadSection,
  CommunityHealthCampItem,
  CommunityAdvisoryItem,
  INITIAL_COMMUNITY_CAMPS,
  INITIAL_COMMUNITY_ADVISORIES,
} from './components/CommunityProjectHeadSection';
import { DoctorPortalSection } from './components/DoctorPortalSection';
import { MeditationCalmSection } from './components/MeditationCalmSection';
import { HealthNormalRangesChartSection } from './components/HealthNormalRangesChartSection';
import {
  Activity,
  Syringe,
  Pill,
  Volume2,
  VolumeX,
  Plus,
  CheckCircle2,
  Trash2,
  Eye,
  LogIn,
  LogOut,
  HeartPulse,
  Moon,
  Droplets,
  Lock,
  Phone,
  UserCheck,
  Stethoscope,
  Users,
  Award,
  Sparkles,
  ShieldCheck,
  Mail,
  History as HistoryIcon,
  X,
} from 'lucide-react';

interface VitalLogItem {
  id: string;
  date: string;
  systolic: number;
  diastolic: number;
  heartRate: number;
  bloodSugar: number;
  sleepHours: number;
  sleepQuality: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  waterGlasses: number;
  notes: string;
}

interface VaccineItem {
  id: string;
  vaccineName: string;
  doseNumber: number;
  status: 'Completed' | 'Upcoming' | 'Due';
  scheduledDate: string;
  clinicName: string;
}

interface MedicationItem {
  id: string;
  medicineName: string;
  dosage: string;
  scheduleTime: string;
  frequency: string;
  takenToday: boolean;
}

export interface UserLoginHistoryItem {
  id: string;
  userId: string;
  email: string;
  loginCategory: string;
  authMethod: string;
  loginTime: string;
}

type ActiveTab =
  | 'dashboard'
  | 'doctor_portal'
  | 'triage'
  | 'library'
  | 'exercises'
  | 'meditation'
  | 'health_chart'
  | 'sleep_screenings'
  | 'telemedicine'
  | 'community_hub'
  | 'map'
  | 'vault';

const INITIAL_VITALS: VitalLogItem[] = [
  {
    id: 'vital_init_1',
    date: '2026-09-27',
    systolic: 124,
    diastolic: 78,
    heartRate: 72,
    bloodSugar: 98,
    sleepHours: 7.5,
    sleepQuality: 'Good',
    waterGlasses: 8,
    notes: 'Morning brisk walk 30 mins completed',
  },
  {
    id: 'vital_init_2',
    date: '2026-09-25',
    systolic: 128,
    diastolic: 82,
    heartRate: 75,
    bloodSugar: 104,
    sleepHours: 7.0,
    sleepQuality: 'Good',
    waterGlasses: 7,
    notes: 'Low-salt home cooked meal',
  },
];

const INITIAL_VACCINES: VaccineItem[] = [
  {
    id: 'vac_init_1',
    vaccineName: 'Quadrivalent Influenza (Annual Flu Shot)',
    doseNumber: 1,
    status: 'Due',
    scheduledDate: '2026-10-05',
    clinicName: 'Primary Community Health Center',
  },
  {
    id: 'vac_init_2',
    vaccineName: 'Pneumococcal Conjugate (PCV15 Senior Care)',
    doseNumber: 1,
    status: 'Upcoming',
    scheduledDate: '2026-11-12',
    clinicName: 'Sahyadri Preventive Clinic',
  },
  {
    id: 'vac_init_3',
    vaccineName: 'Tetanus & Diphtheria (Td Booster)',
    doseNumber: 2,
    status: 'Completed',
    scheduledDate: '2026-03-18',
    clinicName: 'District Civil Hospital',
  },
];

const INITIAL_MEDICATIONS: MedicationItem[] = [
  {
    id: 'med_init_1',
    medicineName: 'Telmisartan (BP Control)',
    dosage: '40 mg · After Breakfast',
    scheduleTime: '08:30 AM',
    frequency: 'Daily Morning',
    takenToday: true,
  },
  {
    id: 'med_init_2',
    medicineName: 'Vitamin D3 + Calcium Citrate',
    dosage: '500 mg · With Warm Milk',
    scheduleTime: '01:30 PM',
    frequency: 'Daily Afternoon',
    takenToday: false,
  },
  {
    id: 'med_init_3',
    medicineName: 'Metformin Sustained Release',
    dosage: '500 mg · Before Dinner',
    scheduleTime: '08:00 PM',
    frequency: 'Daily Night',
    takenToday: false,
  },
];

const INITIAL_APPOINTMENTS: AppointmentItem[] = [];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [loginHistory, setLoginHistory] = useState<UserLoginHistoryItem[]>([]);
  const [showSecurityModal, setShowSecurityModal] = useState<boolean>(false);
  const [authReady, setAuthReady] = useState(false);
  const [hasCompletedLoginBoard, setHasCompletedLoginBoard] = useState(false);
  const [loginCategory, setLoginCategory] = useState<LoginCategory>('user');
  const [patientName, setPatientName] = useState<string>('');
  const [contactNumber, setContactNumber] = useState<string>('');
  const [bloodGroup, setBloodGroup] = useState<string>('O+');
  const [doctorSpecialty, setDoctorSpecialty] = useState<string>(
    'Family Physician & Internal Medicine'
  );
  const [doctorClinic, setDoctorClinic] = useState<string>('Patil Clinic, Pune');
  const [communityWard, setCommunityWard] = useState<string>(
    'Ward 12 — Kothrud Community Health Zone'
  );
  const [communityDesignation, setCommunityDesignation] = useState<string>(
    'Community Health Project Head'
  );
  const [language, setLanguage] = useState<Language>('en');
  const [seniorMode, setSeniorMode] = useState(false);
  const [userAge, setUserAge] = useState<number>(64);
  const [encryptionSalt, setEncryptionSalt] = useState('preventia_default_salt_2026');
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Domain Collections State
  const [vitals, setVitals] = useState<VitalLogItem[]>(INITIAL_VITALS);
  const [vaccines, setVaccines] = useState<VaccineItem[]>(INITIAL_VACCINES);
  const [medications, setMedications] = useState<MedicationItem[]>(INITIAL_MEDICATIONS);
  const [personalDoctors, setPersonalDoctors] = useState<PersonalDoctorItem[]>([]);
  const [appointments, setAppointments] = useState<AppointmentItem[]>(INITIAL_APPOINTMENTS);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecordItem[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessageItem[]>([]);
  const [communityCamps, setCommunityCamps] =
    useState<CommunityHealthCampItem[]>(INITIAL_COMMUNITY_CAMPS);
  const [communityAdvisories, setCommunityAdvisories] = useState<CommunityAdvisoryItem[]>(
    INITIAL_COMMUNITY_ADVISORIES
  );

  // Vitals Form State
  const [sysInput, setSysInput] = useState(122);
  const [diaInput, setDiaInput] = useState(78);
  const [hrInput, setHrInput] = useState(72);
  const [sugarInput, setSugarInput] = useState(96);
  const [sleepInput, setSleepInput] = useState(7.5);
  const [sleepQualityInput, setSleepQualityInput] = useState<'Excellent' | 'Good' | 'Fair' | 'Poor'>('Good');
  const [waterInput, setWaterInput] = useState(8);
  const [notesInput, setNotesInput] = useState('');

  // Medication Form State
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medTime, setMedTime] = useState('09:00 AM');

  // Vaccine Form State
  const [vacName, setVacName] = useState('');
  const [vacDate, setVacDate] = useState('2026-10-15');
  const [vacClinic, setVacClinic] = useState('');

  // Load any saved local profile defaults for convenience on the Login Board
  useEffect(() => {
    try {
      const saved = localStorage.getItem('preventia_patient_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.loginCategory) setLoginCategory(parsed.loginCategory);
        if (parsed.displayName) setPatientName(parsed.displayName);
        if (parsed.contactNumber) setContactNumber(parsed.contactNumber);
        if (typeof parsed.age === 'number') setUserAge(parsed.age);
        if (parsed.bloodGroup) setBloodGroup(parsed.bloodGroup);
        if (parsed.preferredLanguage) setLanguage(parsed.preferredLanguage);
        if (parsed.doctorSpecialty) setDoctorSpecialty(parsed.doctorSpecialty);
        if (parsed.doctorClinic) setDoctorClinic(parsed.doctorClinic);
        if (parsed.communityWard) setCommunityWard(parsed.communityWard);
        if (parsed.communityDesignation) setCommunityDesignation(parsed.communityDesignation);
      }
      const savedCamps = localStorage.getItem('preventia_community_camps');
      if (savedCamps) {
        const parsedCamps = JSON.parse(savedCamps);
        if (Array.isArray(parsedCamps) && parsedCamps.length > 0) {
          setCommunityCamps(parsedCamps);
        }
      }
      const savedAdvisories = localStorage.getItem('preventia_community_advisories');
      if (savedAdvisories) {
        const parsedAdv = JSON.parse(savedAdvisories);
        if (Array.isArray(parsedAdv) && parsedAdv.length > 0) {
          setCommunityAdvisories(parsedAdv);
        }
      }
      const savedDocs = localStorage.getItem('preventia_personal_doctors');
      if (savedDocs) {
        const parsedDocs = JSON.parse(savedDocs);
        if (Array.isArray(parsedDocs)) {
          setPersonalDoctors(parsedDocs);
        }
      }
      const params = new URLSearchParams(window.location.search);
      const docRoom = params.get('doctorRoom');
      if (docRoom) {
        setHasCompletedLoginBoard(true);
        setActiveTab('telemedicine');
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Strictly isolate each role to its own portal/modules:
  // - Doctor ONLY sees Doctor's Portal ('doctor_portal')
  // - Community Head ONLY sees Community Heads' Portal ('community_hub')
  // - User ONLY sees Patient modules (never 'doctor_portal' or 'community_hub')
  useEffect(() => {
    if (loginCategory === 'doctor' && activeTab !== 'doctor_portal') {
      setActiveTab('doctor_portal');
    } else if (loginCategory === 'community_head' && activeTab !== 'community_hub') {
      setActiveTab('community_hub');
    } else if (
      loginCategory === 'user' &&
      (activeTab === 'doctor_portal' || activeTab === 'community_hub')
    ) {
      setActiveTab('dashboard');
    }
  }, [loginCategory, activeTab]);

  // Auth Listener & User Profile Bootstrap
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);

      if (currentUser) {
        if (currentUser.email) setUserEmail(currentUser.email);
        const userDocRef = doc(db, 'users', currentUser.uid);
        try {
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data();
            if (data.email) setUserEmail(data.email);
            if (data.loginCategory) setLoginCategory(data.loginCategory);
            if (data.displayName) setPatientName(data.displayName);
            if (data.contactNumber) setContactNumber(data.contactNumber);
            if (data.bloodGroup) setBloodGroup(data.bloodGroup);
            if (data.preferredLanguage) setLanguage(data.preferredLanguage as Language);
            if (typeof data.seniorMode === 'boolean') setSeniorMode(data.seniorMode);
            if (typeof data.age === 'number') setUserAge(data.age);
            if (data.doctorSpecialty) setDoctorSpecialty(data.doctorSpecialty);
            if (data.doctorClinic) setDoctorClinic(data.doctorClinic);
            if (data.communityWard) setCommunityWard(data.communityWard);
            if (data.communityDesignation) setCommunityDesignation(data.communityDesignation);
            if (data.encryptionKeySalt) setEncryptionSalt(data.encryptionKeySalt);
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `users/${currentUser.uid}`);
        }
      }
    });
    return () => unsub();
  }, []);

  // Complete Login from LoginOnboardingPage (saves category, email & profile before entering dashboard)
  const handleCompleteLoginBoard = async (payload: PatientLoginPayload) => {
    setLoginCategory(payload.loginCategory);
    setPatientName(payload.displayName);
    setContactNumber(payload.contactNumber);
    setUserAge(payload.age);
    setBloodGroup(payload.bloodGroup);
    setUserEmail(payload.email);
    if (payload.doctorSpecialty) setDoctorSpecialty(payload.doctorSpecialty);
    if (payload.doctorClinic) setDoctorClinic(payload.doctorClinic);
    if (payload.communityWard) setCommunityWard(payload.communityWard);
    if (payload.communityDesignation) setCommunityDesignation(payload.communityDesignation);

    let activeUser = auth.currentUser;

    if (payload.authMethod === 'google') {
      try {
        const cred = await signInWithGoogle();
        activeUser = cred.user;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        throw new Error(msg || 'Google sign in failed. Please try again.');
      }
    } else if (payload.authMethod === 'password') {
      try {
        try {
          const cred = await signInWithEmail(payload.email, payload.password || 'preventia123');
          activeUser = cred.user;
        } catch (signInErr: any) {
          if (
            signInErr.code === 'auth/user-not-found' ||
            signInErr.code === 'auth/invalid-credential' ||
            signInErr.code === 'auth/wrong-password'
          ) {
            const newCred = await signUpWithEmail(
              payload.email,
              payload.password || 'preventia123',
              payload.displayName
            );
            activeUser = newCred.user;
          } else {
            throw signInErr;
          }
        }
      } catch (authErr: any) {
        if (authErr.code === 'auth/operation-not-allowed') {
          const cred = await signInWithGoogle();
          activeUser = cred.user;
        } else {
          throw new Error(authErr.message || 'Authentication error. Please check your credentials.');
        }
      }
    }

    try {
      localStorage.setItem(
        'preventia_patient_session',
        JSON.stringify({
          loginCategory: payload.loginCategory,
          email: payload.email || activeUser?.email || '',
          displayName: payload.displayName,
          contactNumber: payload.contactNumber,
          age: payload.age,
          bloodGroup: payload.bloodGroup,
          preferredLanguage: language,
          doctorSpecialty: payload.doctorSpecialty,
          doctorClinic: payload.doctorClinic,
          communityWard: payload.communityWard,
          communityDesignation: payload.communityDesignation,
        })
      );
    } catch {
      // Ignore storage error
    }

    // If logging in as a Doctor, ensure the doctor's profile is registered in the active Telemedicine roster
    if (payload.loginCategory === 'doctor') {
      const cleanDigits = payload.contactNumber.replace(/\D/g, '');
      const alreadyExists = personalDoctors.some(
        (d) => d.contactPhone.replace(/\D/g, '') === cleanDigits
      );
      if (!alreadyExists) {
        const newDoc: PersonalDoctorItem = {
          id: `doc_${Date.now()}`,
          name: payload.displayName,
          specialty: payload.doctorSpecialty || 'Family Physician',
          relationType: 'Regular Family Doctor',
          hospital: payload.doctorClinic || 'Community Health Clinic',
          contactPhone: payload.contactNumber,
        };
        const updatedDocs = [newDoc, ...personalDoctors];
        setPersonalDoctors(updatedDocs);
        try {
          localStorage.setItem('preventia_personal_doctors', JSON.stringify(updatedDocs));
        } catch {
          // Ignore storage error
        }
      }
      setActiveTab('doctor_portal');
    } else if (payload.loginCategory === 'community_head') {
      setActiveTab('community_hub');
    } else {
      setActiveTab('dashboard');
    }

    if (activeUser) {
      const finalEmail = (activeUser.email || payload.email).toLowerCase().trim();
      setUserEmail(finalEmail);
      const userDocRef = doc(db, 'users', activeUser.uid);
      try {
        const snap = await getDoc(userDocRef);
        const generatedSalt = `salt_${activeUser.uid.slice(0, 16)}`;
        setEncryptionSalt(generatedSalt);

        const profileData = {
          uid: activeUser.uid,
          email: finalEmail,
          loginCategory: payload.loginCategory,
          displayName: payload.displayName.slice(0, 100),
          contactNumber: payload.contactNumber.slice(0, 20),
          age: payload.age,
          bloodGroup: payload.bloodGroup.slice(0, 10),
          preferredLanguage: language,
          seniorMode,
          encryptionKeySalt: generatedSalt,
          ...(payload.loginCategory === 'doctor' && {
            doctorSpecialty: (payload.doctorSpecialty || '').slice(0, 100),
            doctorClinic: (payload.doctorClinic || '').slice(0, 140),
          }),
          ...(payload.loginCategory === 'community_head' && {
            communityWard: (payload.communityWard || '').slice(0, 120),
            communityDesignation: (payload.communityDesignation || '').slice(0, 120),
          }),
          lastLoginAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        if (snap.exists()) {
          await updateDoc(userDocRef, profileData);
        } else {
          await setDoc(userDocRef, {
            ...profileData,
            createdAt: serverTimestamp(),
          });
        }

        // Store login record in Firestore database: /users/{userId}/logins/{loginId}
        const loginRecordId = `login_${Date.now()}`;
        const loginDocRef = doc(db, `users/${activeUser.uid}/logins/${loginRecordId}`);
        await setDoc(loginDocRef, {
          userId: activeUser.uid,
          email: finalEmail,
          loginCategory: payload.loginCategory,
          authMethod: payload.authMethod,
          loginTime: new Date().toISOString(),
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${activeUser.uid}`);
      }
    }

    stopSpeaking();
    setHasCompletedLoginBoard(true);
  };

  const handleReturnToLoginPage = async () => {
    stopSpeaking();
    if (user) {
      await logOutUser();
    }
    setHasCompletedLoginBoard(false);
  };

  // Real-time Firestore Listeners when Authenticated
  useEffect(() => {
    if (!authReady || !user) return;
    const uid = user.uid;

    const vitalsQ = query(collection(db, `users/${uid}/vitals`), where('userId', '==', uid));
    const unsubVitals = onSnapshot(
      vitalsQ,
      (snap) => {
        if (!snap.empty) {
          const list: VitalLogItem[] = snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              date: data.date,
              systolic: data.systolic,
              diastolic: data.diastolic,
              heartRate: data.heartRate,
              bloodSugar: data.bloodSugar,
              sleepHours: data.sleepHours,
              sleepQuality: data.sleepQuality,
              waterGlasses: data.waterGlasses,
              notes: data.notes,
            };
          });
          setVitals(list);
        }
      },
      (err) => handleFirestoreError(err, OperationType.LIST, `users/${uid}/vitals`)
    );

    const vacQ = query(collection(db, `users/${uid}/vaccinations`), where('userId', '==', uid));
    const unsubVac = onSnapshot(
      vacQ,
      (snap) => {
        if (!snap.empty) {
          setVaccines(
            snap.docs.map((d) => {
              const data = d.data();
              return {
                id: d.id,
                vaccineName: data.vaccineName,
                doseNumber: data.doseNumber,
                status: data.status,
                scheduledDate: data.scheduledDate,
                clinicName: data.clinicName,
              };
            })
          );
        }
      },
      (err) => handleFirestoreError(err, OperationType.LIST, `users/${uid}/vaccinations`)
    );

    const medQ = query(collection(db, `users/${uid}/medications`), where('userId', '==', uid));
    const unsubMed = onSnapshot(
      medQ,
      (snap) => {
        if (!snap.empty) {
          setMedications(
            snap.docs.map((d) => {
              const data = d.data();
              return {
                id: d.id,
                medicineName: data.medicineName,
                dosage: data.dosage,
                scheduleTime: data.scheduleTime,
                frequency: data.frequency,
                takenToday: data.takenToday,
              };
            })
          );
        }
      },
      (err) => handleFirestoreError(err, OperationType.LIST, `users/${uid}/medications`)
    );

    const apptQ = query(collection(db, `users/${uid}/appointments`), where('userId', '==', uid));
    const unsubAppt = onSnapshot(
      apptQ,
      (snap) => {
        if (!snap.empty) {
          setAppointments(
            snap.docs.map((d) => {
              const data = d.data();
              return {
                id: d.id,
                doctorName: data.doctorName,
                specialty: data.specialty,
                appointmentDate: data.appointmentDate,
                appointmentTime: data.appointmentTime,
                consultType: data.consultType,
                reason: data.reason,
                status: data.status,
              };
            })
          );
        }
      },
      (err) => handleFirestoreError(err, OperationType.LIST, `users/${uid}/appointments`)
    );

    const recQ = query(collection(db, `users/${uid}/medicalRecords`), where('userId', '==', uid));
    const unsubRec = onSnapshot(
      recQ,
      (snap) => {
        setMedicalRecords(
          snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              title: data.title,
              category: data.category,
              recordDate: data.recordDate,
              encryptedPayload: data.encryptedPayload,
              isEncrypted: data.isEncrypted,
            };
          })
        );
      },
      (err) => handleFirestoreError(err, OperationType.LIST, `users/${uid}/medicalRecords`)
    );

    const msgQ = query(collection(db, `users/${uid}/consultMessages`), where('userId', '==', uid));
    const unsubMsg = onSnapshot(
      msgQ,
      (snap) => {
        setChatMessages(
          snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              doctorId: data.doctorId,
              sender: data.sender,
              text: data.text,
              timestamp: 'Synced',
            };
          })
        );
      },
      (err) => handleFirestoreError(err, OperationType.LIST, `users/${uid}/consultMessages`)
    );

    const docsQ = query(collection(db, `users/${uid}/personalDoctors`), where('userId', '==', uid));
    const unsubDocs = onSnapshot(
      docsQ,
      (snap) => {
        const loadedDocs: PersonalDoctorItem[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: data.name,
            specialty: data.specialty,
            relationType: data.relationType,
            hospital: data.hospital,
            contactPhone: data.contactPhone,
          };
        });
        setPersonalDoctors(loadedDocs);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, `users/${uid}/personalDoctors`)
    );

    const loginsQ = query(collection(db, `users/${uid}/logins`), where('userId', '==', uid));
    const unsubLogins = onSnapshot(
      loginsQ,
      (snap) => {
        const loadedLogins: UserLoginHistoryItem[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            userId: data.userId,
            email: data.email,
            loginCategory: data.loginCategory,
            authMethod: data.authMethod,
            loginTime: data.loginTime,
          };
        });
        setLoginHistory(loadedLogins.sort((a, b) => b.loginTime.localeCompare(a.loginTime)));
      },
      (err) => handleFirestoreError(err, OperationType.LIST, `users/${uid}/logins`)
    );

    return () => {
      unsubVitals();
      unsubVac();
      unsubMed();
      unsubAppt();
      unsubRec();
      unsubMsg();
      unsubDocs();
      unsubLogins();
    };
  }, [authReady, user]);

  // Language & Senior Mode Sync
  const handleLanguageChange = async (newLang: Language) => {
    setLanguage(newLang);
    if (user && hasCompletedLoginBoard) {
      const userDocRef = doc(db, 'users', user.uid);
      try {
        const snap = await getDoc(userDocRef);
        if (snap.exists()) {
          await updateDoc(userDocRef, {
            preferredLanguage: newLang,
            updatedAt: serverTimestamp(),
          });
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
      }
    }
  };

  const handleToggleSeniorMode = async () => {
    const next = !seniorMode;
    setSeniorMode(next);
    if (user && hasCompletedLoginBoard) {
      const userDocRef = doc(db, 'users', user.uid);
      try {
        const snap = await getDoc(userDocRef);
        if (snap.exists()) {
          await updateDoc(userDocRef, {
            seniorMode: next,
            updatedAt: serverTimestamp(),
          });
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
      }
    }
  };

  // Voice Read-Aloud Helper (Gemini Female Voice TTS 'Kore' + Smart Marathi/Devanagari Female Voice Fallback)
  const audioCtxRef = React.useRef<AudioContext | null>(null);
  const activeSourceRef = React.useRef<AudioBufferSourceNode | null>(null);

  const stopSpeaking = () => {
    if (activeSourceRef.current) {
      try {
        activeSourceRef.current.stop();
        activeSourceRef.current.disconnect();
      } catch {
        // Ignore if already stopped
      }
      activeSourceRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const playBrowserFemaleFallback = (text: string) => {
    if (!('speechSynthesis' in window)) {
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    const isFemaleVoice = (v: SpeechSynthesisVoice) =>
      /female|woman|swara|aarohi|neerja|heera|lekha|kalpana|kalyani|google हिन्दी|google मराठी|samantha|victoria|zira/i.test(
        v.name
      );

    let selectedVoice: SpeechSynthesisVoice | undefined;

    if (language === 'mr') {
      // 1. Look for Marathi female voice, 2. Any Marathi voice, 3. Hindi female voice (reads Devanagari Marathi script clearly!)
      selectedVoice =
        voices.find((v) => v.lang.toLowerCase().startsWith('mr') && isFemaleVoice(v)) ||
        voices.find((v) => v.lang.toLowerCase().startsWith('mr')) ||
        voices.find((v) => v.lang.toLowerCase().startsWith('hi') && isFemaleVoice(v)) ||
        voices.find((v) => v.lang.toLowerCase().startsWith('hi'));
      utterance.lang = selectedVoice?.lang || 'hi-IN';
    } else if (language === 'hi') {
      selectedVoice =
        voices.find((v) => v.lang.toLowerCase().startsWith('hi') && isFemaleVoice(v)) ||
        voices.find((v) => v.lang.toLowerCase().startsWith('hi'));
      utterance.lang = selectedVoice?.lang || 'hi-IN';
    } else {
      selectedVoice =
        voices.find((v) => v.lang.toLowerCase().startsWith('en-in') && isFemaleVoice(v)) ||
        voices.find((v) => v.lang.toLowerCase().startsWith('en') && isFemaleVoice(v)) ||
        voices.find((v) => v.lang.toLowerCase().startsWith('en-in'));
      utterance.lang = selectedVoice?.lang || 'en-IN';
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    // Warm female pitch & clear senior-friendly cadence
    utterance.pitch = 1.15;
    utterance.rate = seniorMode ? 0.88 : 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const speakText = async (text: string) => {
    stopSpeaking();
    setIsSpeaking(true);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language }),
      });

      if (!response.ok) {
        playBrowserFemaleFallback(text);
        return;
      }

      const data = await response.json();
      if (data.useBrowserFallback || !data.audioBase64) {
        playBrowserFemaleFallback(text);
        return;
      }

      // Decode base64 16-bit PCM (24000 Hz mono) from Gemini TTS ('Kore' female voice)
      const binaryString = atob(data.audioBase64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)({
          sampleRate: 24000,
        });
      }
      const audioCtx = audioCtxRef.current;
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }

      const int16Data = new Int16Array(bytes.buffer, 0, Math.floor(bytes.byteLength / 2));
      const float32Data = new Float32Array(int16Data.length);
      for (let i = 0; i < int16Data.length; i++) {
        float32Data[i] = int16Data[i] / 32768.0;
      }

      const audioBuffer = audioCtx.createBuffer(1, float32Data.length, 24000);
      audioBuffer.getChannelData(0).set(float32Data);

      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      source.onended = () => {
        activeSourceRef.current = null;
        setIsSpeaking(false);
      };
      activeSourceRef.current = source;
      source.start(0);
    } catch {
      // Fallback to browser female voice (with Devanagari support for Marathi)
      playBrowserFemaleFallback(text);
    }
  };

  // Handlers for Vitals, Medications, Vaccines, Appointments, Medical Vault
  const handleAddVitalLog = async (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `vital_${Date.now()}`;
    const today = new Date().toISOString().slice(0, 10);
    const entry: VitalLogItem = {
      id: newId,
      date: today,
      systolic: Number(sysInput),
      diastolic: Number(diaInput),
      heartRate: Number(hrInput),
      bloodSugar: Number(sugarInput),
      sleepHours: Number(sleepInput),
      sleepQuality: sleepQualityInput,
      waterGlasses: Number(waterInput),
      notes: (notesInput.trim() || 'Routine daily check').slice(0, 500),
    };

    setVitals((prev) => [entry, ...prev]);
    setNotesInput('');

    if (user) {
      const path = `users/${user.uid}/vitals/${newId}`;
      try {
        await setDoc(doc(db, path), {
          userId: user.uid,
          date: entry.date,
          systolic: entry.systolic,
          diastolic: entry.diastolic,
          heartRate: entry.heartRate,
          bloodSugar: entry.bloodSugar,
          sleepHours: entry.sleepHours,
          sleepQuality: entry.sleepQuality,
          waterGlasses: entry.waterGlasses,
          notes: entry.notes,
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, path);
      }
    }
  };

  const handlePushPrescriptionToPatient = async (med: {
    medicineName: string;
    dosage: string;
    scheduleTime: string;
    frequency: string;
    instructions: string;
    durationDays: string;
  }) => {
    const newId = `med_rx_${Date.now()}`;
    const item: MedicationItem = {
      id: newId,
      medicineName: med.medicineName.slice(0, 120),
      dosage: med.dosage.slice(0, 80),
      scheduleTime: med.scheduleTime.slice(0, 40),
      frequency: med.frequency.slice(0, 50),
      takenToday: false,
    };
    setMedications((prev) => [item, ...prev]);

    if (user) {
      const path = `users/${user.uid}/medications/${newId}`;
      try {
        await setDoc(doc(db, path), {
          userId: user.uid,
          medicineName: item.medicineName,
          dosage: item.dosage,
          scheduleTime: item.scheduleTime,
          frequency: item.frequency,
          takenToday: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, path);
      }
    }
  };

  const handleAddMedication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim() || !medDosage.trim()) return;
    const newId = `med_${Date.now()}`;
    const item: MedicationItem = {
      id: newId,
      medicineName: medName.trim().slice(0, 120),
      dosage: medDosage.trim().slice(0, 80),
      scheduleTime: medTime,
      frequency: 'Daily',
      takenToday: false,
    };
    setMedications((prev) => [...prev, item]);
    setMedName('');
    setMedDosage('');

    if (user) {
      const path = `users/${user.uid}/medications/${newId}`;
      try {
        await setDoc(doc(db, path), {
          userId: user.uid,
          medicineName: item.medicineName,
          dosage: item.dosage,
          scheduleTime: item.scheduleTime,
          frequency: item.frequency,
          takenToday: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, path);
      }
    }
  };

  const handleToggleMedication = async (med: MedicationItem) => {
    const nextTaken = !med.takenToday;
    setMedications((prev) =>
      prev.map((m) => (m.id === med.id ? { ...m, takenToday: nextTaken } : m))
    );
    if (user) {
      const path = `users/${user.uid}/medications/${med.id}`;
      const docRef = doc(db, path);
      try {
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          await updateDoc(docRef, {
            takenToday: nextTaken,
            updatedAt: serverTimestamp(),
          });
        } else {
          await setDoc(docRef, {
            userId: user.uid,
            medicineName: med.medicineName.slice(0, 120),
            dosage: med.dosage.slice(0, 80),
            scheduleTime: med.scheduleTime.slice(0, 40),
            frequency: med.frequency.slice(0, 50),
            takenToday: nextTaken,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, path);
      }
    }
  };

  const handleAddVaccine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vacName.trim() || !vacClinic.trim()) return;
    const newId = `vac_${Date.now()}`;
    const item: VaccineItem = {
      id: newId,
      vaccineName: vacName.trim().slice(0, 120),
      doseNumber: 1,
      status: 'Upcoming',
      scheduledDate: vacDate,
      clinicName: vacClinic.trim().slice(0, 120),
    };
    setVaccines((prev) => [...prev, item]);
    setVacName('');
    setVacClinic('');

    if (user) {
      const path = `users/${user.uid}/vaccinations/${newId}`;
      try {
        await setDoc(doc(db, path), {
          userId: user.uid,
          vaccineName: item.vaccineName,
          doseNumber: item.doseNumber,
          status: item.status,
          scheduledDate: item.scheduledDate,
          clinicName: item.clinicName,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, path);
      }
    }
  };

  const handleCompleteVaccine = async (vac: VaccineItem) => {
    if (vac.status === 'Completed') return;
    setVaccines((prev) =>
      prev.map((v) => (v.id === vac.id ? { ...v, status: 'Completed' } : v))
    );
    if (user) {
      const path = `users/${user.uid}/vaccinations/${vac.id}`;
      const docRef = doc(db, path);
      try {
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          await updateDoc(docRef, {
            status: 'Completed',
            scheduledDate: vac.scheduledDate,
            updatedAt: serverTimestamp(),
          });
        } else {
          await setDoc(docRef, {
            userId: user.uid,
            vaccineName: vac.vaccineName.slice(0, 120),
            doseNumber: vac.doseNumber,
            status: 'Completed',
            scheduledDate: vac.scheduledDate.slice(0, 30),
            clinicName: vac.clinicName.slice(0, 120),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, path);
      }
    }
  };

  const handleAddPersonalDoctor = async (docInput: Omit<PersonalDoctorItem, 'id'>) => {
    const newId = `doc_${Date.now()}`;
    const item: PersonalDoctorItem = {
      ...docInput,
      id: newId,
    };
    setPersonalDoctors((prev) => {
      const next = [item, ...prev];
      try {
        localStorage.setItem('preventia_personal_doctors', JSON.stringify(next));
      } catch {
        // Ignore storage error
      }
      return next;
    });

    if (user) {
      const path = `users/${user.uid}/personalDoctors/${newId}`;
      try {
        await setDoc(doc(db, path), {
          userId: user.uid,
          name: item.name.slice(0, 120),
          specialty: item.specialty.slice(0, 100),
          relationType: item.relationType,
          hospital: item.hospital.slice(0, 140),
          contactPhone: item.contactPhone.slice(0, 20),
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, path);
      }
    }
  };

  const handleDeletePersonalDoctor = async (id: string) => {
    setPersonalDoctors((prev) => {
      const next = prev.filter((d) => d.id !== id);
      try {
        localStorage.setItem('preventia_personal_doctors', JSON.stringify(next));
      } catch {
        // Ignore storage error
      }
      return next;
    });

    if (user) {
      const path = `users/${user.uid}/personalDoctors/${id}`;
      try {
        await deleteDoc(doc(db, path));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, path);
      }
    }
  };

  const handleBookAppointment = async (appt: Omit<AppointmentItem, 'id' | 'status'>) => {
    const newId = `appt_${Date.now()}`;
    const item: AppointmentItem = {
      ...appt,
      id: newId,
      status: 'Scheduled',
    };
    setAppointments((prev) => [item, ...prev]);

    if (user) {
      const path = `users/${user.uid}/appointments/${newId}`;
      try {
        await setDoc(doc(db, path), {
          userId: user.uid,
          doctorName: item.doctorName.slice(0, 120),
          specialty: item.specialty.slice(0, 100),
          appointmentDate: item.appointmentDate.slice(0, 30),
          appointmentTime: item.appointmentTime.slice(0, 20),
          consultType: item.consultType,
          reason: item.reason.slice(0, 300),
          status: 'Scheduled',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, path);
      }
    }
  };

  const handleUpdateAppointmentStatus = async (
    id: string,
    status: 'Completed' | 'Cancelled'
  ) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    if (user) {
      const path = `users/${user.uid}/appointments/${id}`;
      const docRef = doc(db, path);
      try {
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          await updateDoc(docRef, {
            status,
            updatedAt: serverTimestamp(),
          });
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, path);
      }
    }
  };

  const handleSendChatMessage = async (
    doctorId: string,
    sender: 'patient' | 'doctor',
    text: string
  ) => {
    const newId = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [
      ...prev,
      { id: newId, doctorId, sender, text, timestamp: nowStr },
    ]);

    if (user) {
      const path = `users/${user.uid}/consultMessages/${newId}`;
      try {
        await setDoc(doc(db, path), {
          userId: user.uid,
          doctorId: doctorId.slice(0, 60),
          sender,
          text: text.slice(0, 1000),
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, path);
      }
    }
  };

  const handleAddMedicalRecord = async (rec: Omit<MedicalRecordItem, 'id'>) => {
    const newId = `rec_${Date.now()}`;
    setMedicalRecords((prev) => [{ ...rec, id: newId }, ...prev]);
    if (user) {
      const path = `users/${user.uid}/medicalRecords/${newId}`;
      try {
        await setDoc(doc(db, path), {
          userId: user.uid,
          title: rec.title.slice(0, 120),
          category: rec.category.slice(0, 60),
          recordDate: rec.recordDate.slice(0, 30),
          encryptedPayload: rec.encryptedPayload.slice(0, 4000),
          isEncrypted: true,
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, path);
      }
    }
  };

  const handleDeleteMedicalRecord = async (id: string) => {
    setMedicalRecords((prev) => prev.filter((r) => r.id !== id));
    if (user) {
      const path = `users/${user.uid}/medicalRecords/${id}`;
      try {
        await deleteDoc(doc(db, path));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, path);
      }
    }
  };

  const handleAddCommunityCamp = (camp: Omit<CommunityHealthCampItem, 'id'>) => {
    const newCamp: CommunityHealthCampItem = {
      ...camp,
      id: `camp_${Date.now()}`,
    };
    const next = [newCamp, ...communityCamps];
    setCommunityCamps(next);
    try {
      localStorage.setItem('preventia_community_camps', JSON.stringify(next));
    } catch {
      // Ignore storage error
    }
  };

  const handleUpdateCommunityCampStatus = (
    id: string,
    status: CommunityHealthCampItem['status']
  ) => {
    const next = communityCamps.map((c) => (c.id === id ? { ...c, status } : c));
    setCommunityCamps(next);
    try {
      localStorage.setItem('preventia_community_camps', JSON.stringify(next));
    } catch {
      // Ignore storage error
    }
  };

  const handleDeleteCommunityCamp = (id: string) => {
    const next = communityCamps.filter((c) => c.id !== id);
    setCommunityCamps(next);
    try {
      localStorage.setItem('preventia_community_camps', JSON.stringify(next));
    } catch {
      // Ignore storage error
    }
  };

  const handleAddCommunityAdvisory = (adv: Omit<CommunityAdvisoryItem, 'id'>) => {
    const newAdv: CommunityAdvisoryItem = {
      ...adv,
      id: `adv_${Date.now()}`,
    };
    const next = [newAdv, ...communityAdvisories];
    setCommunityAdvisories(next);
    try {
      localStorage.setItem('preventia_community_advisories', JSON.stringify(next));
    } catch {
      // Ignore storage error
    }
  };

  const handleDeleteCommunityAdvisory = (id: string) => {
    const next = communityAdvisories.filter((a) => a.id !== id);
    setCommunityAdvisories(next);
    try {
      localStorage.setItem('preventia_community_advisories', JSON.stringify(next));
    } catch {
      // Ignore storage error
    }
  };

  const t = UI_STRINGS[language];
  const latestVital = vitals[0] || INITIAL_VITALS[0];

  // FIRST SCREEN: Login & App Information Page with Category (User, Doctor, Community Project Head)
  if (!hasCompletedLoginBoard) {
    return (
      <LoginOnboardingPage
        language={language}
        onLanguageChange={handleLanguageChange}
        seniorMode={seniorMode}
        onToggleSeniorMode={handleToggleSeniorMode}
        initialCategory={loginCategory}
        initialEmail={userEmail || user?.email || ''}
        initialName={patientName || user?.displayName || ''}
        initialContact={contactNumber}
        initialAge={userAge}
        initialBloodGroup={bloodGroup}
        isSpeaking={isSpeaking}
        onSpeakText={speakText}
        onStopSpeaking={stopSpeaking}
        onCompleteLogin={handleCompleteLoginBoard}
      />
    );
  }

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 ${seniorMode ? 'text-lg' : 'text-base'}`}>
      {/* Top Bar Contract: 3 Clean Zones */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Zone 1: Single text wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab(
              loginCategory === 'doctor'
                ? 'doctor_portal'
                : loginCategory === 'community_head'
                ? 'community_hub'
                : 'dashboard'
            );
          }}
          className="font-display text-xl font-semibold tracking-tight text-teal-900 whitespace-nowrap"
        >
          Preventia
        </a>

        {/* Zone 2: Primary Navigation Links (Strictly Role-Isolated) */}
        <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-slate-600">
          {loginCategory === 'doctor' && (
            <button
              type="button"
              onClick={() => setActiveTab('doctor_portal')}
              className="text-teal-800 border-b-2 border-teal-700 font-semibold whitespace-nowrap pb-0.5 cursor-pointer"
            >
              {language === 'mr'
                ? 'डॉक्टर क्लिनिकल पोर्टल'
                : language === 'hi'
                ? 'डॉक्टर क्लिनिकल पोर्टल'
                : 'Doctor’s Clinical Portal'}
            </button>
          )}
          {loginCategory === 'community_head' && (
            <button
              type="button"
              onClick={() => setActiveTab('community_hub')}
              className="text-teal-800 border-b-2 border-teal-700 font-semibold whitespace-nowrap pb-0.5 cursor-pointer"
            >
              {language === 'mr'
                ? 'कम्युनिटी हेड पोर्टल'
                : language === 'hi'
                ? 'कम्युनिटी हेड पोर्टल'
                : 'Community Heads’ Portal'}
            </button>
          )}
          {loginCategory === 'user' && (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap pb-0.5 ${
                  activeTab === 'dashboard'
                    ? 'text-teal-800 border-b-2 border-teal-700 font-semibold'
                    : ''
                }`}
              >
                {t.navDashboard}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('triage')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap pb-0.5 ${
                  activeTab === 'triage'
                    ? 'text-teal-800 border-b-2 border-teal-700 font-semibold'
                    : ''
                }`}
              >
                {t.navSymptomAI}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('library')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap pb-0.5 ${
                  activeTab === 'library'
                    ? 'text-teal-800 border-b-2 border-teal-700 font-semibold'
                    : ''
                }`}
              >
                {t.navPreventionLib}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('exercises')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap pb-0.5 ${
                  activeTab === 'exercises'
                    ? 'text-teal-800 border-b-2 border-teal-700 font-semibold'
                    : ''
                }`}
              >
                {t.navExercises}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('meditation')}
                className={`inline-flex items-center gap-1 hover:text-slate-900 transition-colors whitespace-nowrap pb-0.5 ${
                  activeTab === 'meditation'
                    ? 'text-teal-800 border-b-2 border-teal-700 font-semibold'
                    : ''
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                <span>{t.navMeditation}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('health_chart')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap pb-0.5 ${
                  activeTab === 'health_chart'
                    ? 'text-teal-800 border-b-2 border-teal-700 font-semibold'
                    : ''
                }`}
              >
                {t.navHealthChart}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('sleep_screenings')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap pb-0.5 ${
                  activeTab === 'sleep_screenings'
                    ? 'text-teal-800 border-b-2 border-teal-700 font-semibold'
                    : ''
                }`}
              >
                {t.navSleepCheckups}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('telemedicine')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap pb-0.5 ${
                  activeTab === 'telemedicine'
                    ? 'text-teal-800 border-b-2 border-teal-700 font-semibold'
                    : ''
                }`}
              >
                {t.navTelemedicine}
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: Language Switcher & Auth Action */}
        <div className="flex items-center gap-2.5">
          {/* Language Segmented Control */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg">
            {(['en', 'hi', 'mr'] as Language[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => handleLanguageChange(lang)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                  language === lang
                    ? 'bg-white text-teal-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'मराठी'}
              </button>
            ))}
          </div>

          {/* Email ID & Database Security Pill */}
          <button
            type="button"
            onClick={() => setShowSecurityModal(true)}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-900 text-xs font-semibold hover:bg-teal-100 transition-colors whitespace-nowrap cursor-pointer shadow-xs"
            title="Database Security & Login History"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
            <span className="font-mono max-w-[160px] truncate">{userEmail || user?.email || 'Secured Account'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          </button>

          <button
            type="button"
            onClick={handleReturnToLoginPage}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors whitespace-nowrap cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.signOut}</span>
          </button>
        </div>
      </header>

      {/* Security & Database Login History Modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-50 text-teal-800 border border-teal-200">
                  <ShieldCheck className="w-5 h-5 text-teal-700" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-slate-900 text-lg">
                    Database Security & Login History
                  </h3>
                  <p className="text-xs text-slate-500">
                    Zero-Trust Tenant Isolation · Firestore Database Audit
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSecurityModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Email Security Invariants Card */}
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-emerald-950 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-emerald-700" />
                  Authenticated Email ID:
                </span>
                <span className="font-mono font-semibold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-md">
                  {userEmail || user?.email || 'Active User'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Database UID Partition:</span>
                <span className="font-mono text-[11px] text-slate-700">
                  {user?.uid ? `${user.uid.slice(0, 14)}...` : 'Local Session'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Account Role:</span>
                <span className="font-semibold text-slate-800 capitalize">
                  {loginCategory === 'doctor'
                    ? 'Registered Doctor'
                    : loginCategory === 'community_head'
                    ? 'Community Project Head'
                    : 'Citizen / Patient'}
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 pt-1 border-t border-emerald-200 leading-relaxed">
                ✓ Firestore Security Rules verify that every read and write strictly matches your authenticated Firebase UID and Email ID. All cross-tenant access is blocked.
              </p>
            </div>

            {/* Historical Logins recorded in Firestore */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <HistoryIcon className="w-3.5 h-3.5 text-teal-700" />
                  Database Login Sessions (/users/{'{uid}'}/logins)
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {loginHistory.length} Recorded
                </span>
              </div>

              <div className="max-h-56 overflow-y-auto space-y-2 pr-1 border border-slate-200 rounded-xl p-2.5 bg-slate-50">
                {loginHistory.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-500 space-y-1">
                    <p>Current session verified and stored in database.</p>
                    <p className="text-[11px] font-mono text-teal-700">
                      {userEmail || user?.email || 'Logged In'}
                    </p>
                  </div>
                ) : (
                  loginHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800">
                            {item.email}
                          </span>
                          <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-teal-50 text-teal-800 border border-teal-200">
                            {item.loginCategory}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {new Date(item.loginTime).toLocaleString()} · Method: {item.authMethod}
                        </p>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Verified
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowSecurityModal(false)}
                className="px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 transition-colors cursor-pointer"
              >
                Close Security Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace Container */}
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Elderly Accessibility & Module Switcher Bar */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>{t.tagline}</span>
              <span>·</span>
              <span>{t.encryptedVaultBadge}</span>
              <span>·</span>
              <span className="text-red-700 font-medium">{t.emergencyHelpline}</span>
            </div>
            <h1 className={`font-display font-semibold text-slate-900 ${seniorMode ? 'text-3xl' : 'text-2xl'}`}>
              {t.welcomeTitle}
            </h1>
            <p className={`text-slate-600 ${seniorMode ? 'text-lg' : 'text-sm'}`}>
              {t.welcomeSubtitle}
            </p>
            {(patientName || contactNumber) && (
              <div className="flex flex-wrap items-center gap-3 pt-1.5 text-xs text-teal-900 font-medium">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-semibold ${
                    loginCategory === 'doctor'
                      ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                      : loginCategory === 'community_head'
                      ? 'bg-amber-100 text-amber-950 border border-amber-300'
                      : 'bg-teal-100 text-teal-950 border border-teal-300'
                  }`}
                >
                  {loginCategory === 'doctor' ? (
                    <>
                      <Stethoscope className="w-3.5 h-3.5" />
                      <span>Doctor Console</span>
                    </>
                  ) : loginCategory === 'community_head' ? (
                    <>
                      <Award className="w-3.5 h-3.5" />
                      <span>Community Project Head</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>User / Patient</span>
                    </>
                  )}
                </span>
                {patientName && (
                  <span className="inline-flex items-center gap-1.5">
                    <span>
                      <strong>{patientName}</strong>{' '}
                      {loginCategory === 'doctor'
                        ? `(${doctorSpecialty} · ${doctorClinic})`
                        : loginCategory === 'community_head'
                        ? `(${communityWard})`
                        : `(${bloodGroup})`}
                    </span>
                  </span>
                )}
                {contactNumber && (
                  <>
                    <span className="text-slate-300">·</span>
                    <span className="inline-flex items-center gap-1.5 font-mono tabular-nums">
                      <Phone className="w-3.5 h-3.5 text-teal-700" />
                      <span>
                        Contact: <strong>{contactNumber}</strong>
                      </span>
                    </span>
                  </>
                )}
                {userEmail && (
                  <>
                    <span className="text-slate-300">·</span>
                    <button
                      type="button"
                      onClick={() => setShowSecurityModal(true)}
                      className="inline-flex items-center gap-1.5 font-mono text-emerald-800 hover:text-emerald-950 hover:underline cursor-pointer"
                      title="View Database Security & Login Records"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{userEmail}</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Elderly Accessibility Controls */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
              <span className="text-slate-600 font-medium">Age:</span>
              <input
                type="number"
                min={1}
                max={120}
                value={userAge}
                onChange={(e) => setUserAge(Number(e.target.value) || 60)}
                className="w-14 font-mono tabular-nums font-semibold text-slate-900 bg-white border border-slate-300 rounded px-1.5 py-0.5 text-center"
              />
              <span className="text-slate-500">yrs</span>
            </div>

            <button
              type="button"
              onClick={handleToggleSeniorMode}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap cursor-pointer ${
                seniorMode
                  ? 'border-teal-700 bg-teal-700 text-white'
                  : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>{t.seniorModeLabel}</span>
            </button>

            <button
              type="button"
              onClick={() =>
                isSpeaking
                  ? stopSpeaking()
                  : speakText(`${t.welcomeTitle}. ${t.welcomeSubtitle}`)
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs font-semibold hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer"
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4 text-red-600" />
                  <span>{t.stopReadingLabel}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-teal-700" />
                  <span>{t.readAloudLabel}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* User / Patient Module Filter Bar (Strictly visible ONLY to User / Patient login category) */}
        {loginCategory === 'user' && (
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-200/70 rounded-xl">
            {(
              [
                { id: 'dashboard', label: t.navDashboard },
                { id: 'triage', label: t.navSymptomAI },
                { id: 'library', label: t.navPreventionLib },
                { id: 'exercises', label: t.navExercises },
                { id: 'meditation', label: t.navMeditation },
                { id: 'health_chart', label: t.navHealthChart },
                { id: 'sleep_screenings', label: t.navSleepCheckups },
                { id: 'telemedicine', label: t.navTelemedicine },
                { id: 'map', label: t.navEmergencyMap },
                { id: 'vault', label: t.navMedicalVault },
              ] as { id: ActiveTab; label: string }[]
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  seniorMode ? 'text-base' : 'text-xs'
                } ${
                  activeTab === tab.id
                    ? 'bg-teal-800 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-white/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* TAB 0: THE DOCTORS' PORTAL (STRICTLY VISIBLE ONLY TO DOCTOR LOGIN CATEGORY) */}
        {loginCategory === 'doctor' && activeTab === 'doctor_portal' && (
          <DoctorPortalSection
            language={language}
            seniorMode={seniorMode}
            doctorName={patientName || 'Dr. Vivek Patil'}
            doctorPhone={contactNumber || '+91 9822011223'}
            doctorSpecialty={doctorSpecialty}
            doctorClinic={doctorClinic}
            linkedPatientName="Ramesh Kulkarni"
            linkedPatientPhone="+91 9823014567"
            linkedPatientAge={userAge}
            linkedPatientBloodGroup={bloodGroup}
            linkedVitals={vitals}
            linkedMedications={medications}
            linkedVaccines={vaccines}
            linkedMedicalRecords={medicalRecords}
            appointments={appointments}
            onBookAppointment={handleBookAppointment}
            onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
            chatMessages={chatMessages}
            onSendChatMessage={handleSendChatMessage}
            personalDoctors={personalDoctors}
            onPushPrescriptionToPatient={handlePushPrescriptionToPatient}
            advisories={communityAdvisories}
            onPublishDoctorArticle={handleAddCommunityAdvisory}
            onSpeakText={speakText}
          />
        )}

        {/* TAB 1: PERSONALIZED HEALTH TRACKER, MEDICATIONS & VACCINATIONS (USER ONLY) */}
        {loginCategory === 'user' && activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Key Vitals Telemetry Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Blood Pressure</span>
                  <HeartPulse className="w-4 h-4 text-teal-700" />
                </div>
                <p className="text-2xl font-mono font-semibold text-slate-900 tabular-nums">
                  {latestVital.systolic}/{latestVital.diastolic}{' '}
                  <span className="text-xs font-normal text-slate-500">mmHg</span>
                </p>
                <p className="text-xs text-emerald-700">
                  {latestVital.systolic < 130 ? 'Normal Range' : 'Elevated — Monitor Salt'}
                </p>
              </div>

              <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Fasting Blood Glucose</span>
                  <Activity className="w-4 h-4 text-teal-700" />
                </div>
                <p className="text-2xl font-mono font-semibold text-slate-900 tabular-nums">
                  {latestVital.bloodSugar}{' '}
                  <span className="text-xs font-normal text-slate-500">mg/dL</span>
                </p>
                <p className="text-xs text-emerald-700">
                  {latestVital.bloodSugar <= 110 ? 'Optimal Metabolic Range' : 'Review Diet Plan'}
                </p>
              </div>

              <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Last Night Sleep</span>
                  <Moon className="w-4 h-4 text-teal-700" />
                </div>
                <p className="text-2xl font-mono font-semibold text-slate-900 tabular-nums">
                  {latestVital.sleepHours}{' '}
                  <span className="text-xs font-normal text-slate-500">hrs</span>
                </p>
                <p className="text-xs text-teal-700">Quality: {latestVital.sleepQuality}</p>
              </div>

              <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Daily Hydration</span>
                  <Droplets className="w-4 h-4 text-teal-700" />
                </div>
                <p className="text-2xl font-mono font-semibold text-slate-900 tabular-nums">
                  {latestVital.waterGlasses}{' '}
                  <span className="text-xs font-normal text-slate-500">glasses</span>
                </p>
                <p className="text-xs text-slate-500">Target: 8–10 glasses/day</p>
              </div>
            </div>

            {/* Vitals Log Form + Recent Logs Table */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 p-5 bg-white border border-slate-200 rounded-xl space-y-4">
                <h2 className="font-semibold text-slate-900 text-base flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-700" />
                  <span>{t.logVitalsTitle}</span>
                </h2>

                <form onSubmit={handleAddVitalLog} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Systolic BP (mmHg)</label>
                      <input
                        type="number"
                        value={sysInput}
                        onChange={(e) => setSysInput(Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono tabular-nums"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Diastolic BP (mmHg)</label>
                      <input
                        type="number"
                        value={diaInput}
                        onChange={(e) => setDiaInput(Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono tabular-nums"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Heart Rate (bpm)</label>
                      <input
                        type="number"
                        value={hrInput}
                        onChange={(e) => setHrInput(Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono tabular-nums"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Blood Sugar (mg/dL)</label>
                      <input
                        type="number"
                        value={sugarInput}
                        onChange={(e) => setSugarInput(Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono tabular-nums"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Sleep (Hrs)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={sleepInput}
                        onChange={(e) => setSleepInput(Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono tabular-nums"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Sleep Quality</label>
                      <select
                        value={sleepQualityInput}
                        onChange={(e) =>
                          setSleepQualityInput(
                            e.target.value as 'Excellent' | 'Good' | 'Fair' | 'Poor'
                          )
                        }
                        className="w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm bg-white"
                      >
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                        <option value="Poor">Poor</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Water (Glasses)</label>
                      <input
                        type="number"
                        value={waterInput}
                        onChange={(e) => setWaterInput(Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono tabular-nums"
                        required
                      />
                    </div>
                  </div>

                  <input
                    type="text"
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    placeholder="Wellness note (e.g., Morning walk 30 mins, low salt diet)"
                    maxLength={250}
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm"
                  />

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-lg bg-teal-700 text-white text-sm font-semibold hover:bg-teal-800 transition-colors cursor-pointer"
                  >
                    Save Daily Health Entry
                  </button>
                </form>
              </div>

              {/* Vitals History Table */}
              <div className="lg:col-span-7 p-5 bg-white border border-slate-200 rounded-xl space-y-4">
                <h2 className="font-semibold text-slate-900 text-base">
                  Recent Health & Sleep Tracking History
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
                        <th className="py-2.5 pr-3">Date</th>
                        <th className="py-2.5 px-3">BP (mmHg)</th>
                        <th className="py-2.5 px-3">Pulse</th>
                        <th className="py-2.5 px-3">Sugar</th>
                        <th className="py-2.5 px-3">Sleep</th>
                        <th className="py-2.5 pl-3">Wellness Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {vitals.map((v) => (
                        <tr key={v.id} className="hover:bg-slate-50">
                          <td className="py-3 pr-3 font-mono text-xs text-slate-600 tabular-nums whitespace-nowrap">
                            {v.date}
                          </td>
                          <td className="py-3 px-3 font-mono font-semibold text-slate-900 tabular-nums">
                            {v.systolic}/{v.diastolic}
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-700 tabular-nums">
                            {v.heartRate} bpm
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-700 tabular-nums">
                            {v.bloodSugar} mg/dL
                          </td>
                          <td className="py-3 px-3 font-mono text-teal-800 tabular-nums">
                            {v.sleepHours}h ({v.sleepQuality})
                          </td>
                          <td className="py-3 pl-3 text-xs text-slate-600">{v.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Medication Reminders + Vaccination Tracker Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Medication Management & Daily Wellness Reminders */}
              <div className="lg:col-span-6 p-5 bg-white border border-slate-200 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-slate-900 text-base flex items-center gap-2">
                    <Pill className="w-4 h-4 text-teal-700" />
                    <span>{t.medRemindersTitle}</span>
                  </h2>
                  <span className="text-xs text-slate-500 font-mono tabular-nums">
                    {medications.filter((m) => m.takenToday).length}/{medications.length} Taken
                  </span>
                </div>

                <div className="space-y-2.5">
                  {medications.map((med) => (
                    <div
                      key={med.id}
                      onClick={() => handleToggleMedication(med)}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                        med.takenToday
                          ? 'border-emerald-200 bg-emerald-50/50'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <p
                          className={`font-semibold ${
                            med.takenToday ? 'line-through text-slate-500' : 'text-slate-900'
                          } ${seniorMode ? 'text-lg' : 'text-sm'}`}
                        >
                          {med.medicineName}
                        </p>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {med.dosage} · <span className="font-mono tabular-nums">{med.scheduleTime}</span>
                        </p>
                      </div>
                      <button
                        type="button"
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                          med.takenToday
                            ? 'bg-emerald-700 text-white'
                            : 'bg-slate-100 text-slate-800 hover:bg-teal-700 hover:text-white'
                        }`}
                      >
                        {med.takenToday ? 'Taken ✓' : 'Mark Taken'}
                      </button>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddMedication} className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    value={medName}
                    onChange={(e) => setMedName(e.target.value)}
                    placeholder="Medicine name..."
                    className="rounded-lg border border-slate-300 px-3 py-2 text-xs"
                    required
                  />
                  <input
                    type="text"
                    value={medDosage}
                    onChange={(e) => setMedDosage(e.target.value)}
                    placeholder="Dosage (e.g. 1 tab after meal)"
                    className="rounded-lg border border-slate-300 px-3 py-2 text-xs"
                    required
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={medTime}
                      onChange={(e) => setMedTime(e.target.value)}
                      className="w-24 rounded-lg border border-slate-300 px-2.5 py-2 text-xs font-mono tabular-nums"
                    />
                    <button
                      type="submit"
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 whitespace-nowrap"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Vaccination & Immunization Section */}
              <div className="lg:col-span-6 p-5 bg-white border border-slate-200 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-slate-900 text-base flex items-center gap-2">
                    <Syringe className="w-4 h-4 text-teal-700" />
                    <span>{t.vaccinationsTitle}</span>
                  </h2>
                </div>

                <div className="space-y-2.5">
                  {vaccines.map((vac) => (
                    <div
                      key={vac.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className={`font-semibold text-slate-900 ${seniorMode ? 'text-lg' : 'text-sm'}`}>
                          {vac.vaccineName}
                        </p>
                        <p className="text-xs text-slate-600 mt-0.5 font-mono tabular-nums">
                          Dose {vac.doseNumber} · {vac.scheduledDate} · {vac.clinicName}
                        </p>
                      </div>
                      {vac.status === 'Completed' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 whitespace-nowrap">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Completed</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleCompleteVaccine(vac)}
                          className="px-3 py-1.5 rounded-lg bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 whitespace-nowrap"
                        >
                          Mark Administered
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddVaccine} className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    value={vacName}
                    onChange={(e) => setVacName(e.target.value)}
                    placeholder="Vaccine name..."
                    className="rounded-lg border border-slate-300 px-3 py-2 text-xs"
                    required
                  />
                  <input
                    type="text"
                    value={vacClinic}
                    onChange={(e) => setVacClinic(e.target.value)}
                    placeholder="Hospital / Center..."
                    className="rounded-lg border border-slate-300 px-3 py-2 text-xs"
                    required
                  />
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={vacDate}
                      onChange={(e) => setVacDate(e.target.value)}
                      className="w-32 rounded-lg border border-slate-300 px-2 py-2 text-xs font-mono tabular-nums"
                    />
                    <button
                      type="submit"
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 whitespace-nowrap"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AI SYMPTOM CHECKER & TRIAGE CHATBOT (USER ONLY) */}
        {loginCategory === 'user' && activeTab === 'triage' && (
          <SymptomTriageSection
            language={language}
            seniorMode={seniorMode}
            userAge={userAge}
            onSpeakText={speakText}
          />
        )}

        {/* TAB 3: PREVENTIVE CARE, SYMPTOMS & AGE-WISE DIET LIBRARY (USER ONLY) */}
        {loginCategory === 'user' && activeTab === 'library' && (
          <PreventionLibrarySection
            language={language}
            seniorMode={seniorMode}
            mode="library"
            userAge={userAge}
            onSpeakText={speakText}
            onSwitchMode={(m) => setActiveTab(m)}
          />
        )}

        {/* TAB 3B: DEDICATED EXERCISES, YOGA & AGE-WISE RECOMMENDATIONS (USER ONLY) */}
        {loginCategory === 'user' && activeTab === 'exercises' && (
          <PreventionLibrarySection
            language={language}
            seniorMode={seniorMode}
            mode="exercises"
            userAge={userAge}
            onSpeakText={speakText}
            onSwitchMode={(m) => setActiveTab(m)}
          />
        )}

        {/* TAB 3C: MEDITATION & CALM SANCTUARY SESSION (USER ONLY) */}
        {loginCategory === 'user' && activeTab === 'meditation' && (
          <MeditationCalmSection
            language={language}
            seniorMode={seniorMode}
            userAge={userAge}
            onSpeakText={speakText}
          />
        )}

        {/* TAB 3D: BLOOD TEST & COMPLETE DIAGNOSTIC NORMAL RANGES HEALTH CHART (USER ONLY) */}
        {loginCategory === 'user' && activeTab === 'health_chart' && (
          <HealthNormalRangesChartSection
            language={language}
            seniorMode={seniorMode}
            userAge={userAge}
            onSpeakText={speakText}
          />
        )}

        {/* TAB 4: SLEEP CARE & AGE-WISE REGULAR HEALTH SCREENINGS (USER ONLY) */}
        {loginCategory === 'user' && activeTab === 'sleep_screenings' && (
          <PreventionLibrarySection
            language={language}
            seniorMode={seniorMode}
            mode="sleep_screenings"
            userAge={userAge}
            onSpeakText={speakText}
            onSwitchMode={(m) => setActiveTab(m)}
          />
        )}

        {/* TAB 5: MY REGULAR & RELATED DOCTORS (USER ONLY) */}
        {loginCategory === 'user' && activeTab === 'telemedicine' && (
          <TelemedicineSection
            language={language}
            seniorMode={seniorMode}
            userAge={userAge}
            isDoctorRole={false}
            patientName={patientName || user?.displayName || 'Community Member'}
            patientPhone={contactNumber || '+91 9800000000'}
            latestVitals={{
              systolic: latestVital.systolic,
              diastolic: latestVital.diastolic,
              heartRate: latestVital.heartRate,
              bloodSugar: latestVital.bloodSugar,
            }}
            personalDoctors={personalDoctors}
            onAddPersonalDoctor={handleAddPersonalDoctor}
            onDeletePersonalDoctor={handleDeletePersonalDoctor}
            appointments={appointments}
            onBookAppointment={handleBookAppointment}
            onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
            chatMessages={chatMessages}
            onSendChatMessage={handleSendChatMessage}
            onSpeakText={speakText}
          />
        )}

        {/* TAB 5B: THE COMMUNITY HEADS' PORTAL (STRICTLY VISIBLE ONLY TO COMMUNITY PROJECT HEAD LOGIN CATEGORY) */}
        {loginCategory === 'community_head' && activeTab === 'community_hub' && (
          <CommunityProjectHeadSection
            language={language}
            seniorMode={seniorMode}
            isProjectHead={true}
            headName={patientName || 'Sunita Deshmukh'}
            headPhone={contactNumber || '+91 9850044556'}
            headWard={communityWard}
            headDesignation={communityDesignation}
            camps={communityCamps}
            onAddCamp={handleAddCommunityCamp}
            onUpdateCampStatus={handleUpdateCommunityCampStatus}
            onDeleteCamp={handleDeleteCommunityCamp}
            advisories={communityAdvisories}
            onAddAdvisory={handleAddCommunityAdvisory}
            onDeleteAdvisory={handleDeleteCommunityAdvisory}
            personalDoctors={personalDoctors}
            appointmentsCount={appointments.length}
            onSpeakText={speakText}
          />
        )}

        {/* TAB 6: LIVE EMERGENCY MEDICAL MAP (USER ONLY) */}
        {loginCategory === 'user' && activeTab === 'map' && (
          <EmergencyMapSection language={language} seniorMode={seniorMode} />
        )}

        {/* TAB 7: ENCRYPTED MEDICAL RECORDS VAULT (USER ONLY) */}
        {loginCategory === 'user' && activeTab === 'vault' && (
          <EncryptedVaultSection
            language={language}
            seniorMode={seniorMode}
            encryptionSalt={encryptionSalt}
            records={medicalRecords}
            onAddRecord={handleAddMedicalRecord}
            onDeleteRecord={handleDeleteMedicalRecord}
            patientProfile={{
              displayName: patientName || user?.displayName || 'Community Member',
              contactNumber: contactNumber || 'Not Provided',
              age: userAge,
              bloodGroup: bloodGroup || 'O+',
            }}
            vitals={vitals}
            medications={medications}
            appointments={appointments}
            vaccines={vaccines}
          />
        )}
      </div>

      {/* Quiet Clinical Footer */}
      <footer className="max-w-[1380px] mx-auto px-6 py-8 mt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-teal-700" />
          <span>Preventia Community Health · End-to-End AES-256 Encrypted Medical Privacy</span>
        </div>
        <div>English · हिंदी · मराठी · Designed for Senior Citizen Accessibility</div>
      </footer>
    </div>
  );
}
