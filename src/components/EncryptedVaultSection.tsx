import React, { useState } from 'react';
import { Language } from '../i18n/translations';
import { encryptMedicalData, decryptMedicalData } from '../utils/crypto';
import { AppointmentItem } from './TelemedicineSection';
import {
  generateDoctorHealthSummaryPdf,
  PdfVitalItem,
  PdfMedicationItem,
  PdfVaccineItem,
  PdfPatientProfile,
} from '../utils/pdfGenerator';
import {
  Lock,
  Unlock,
  ShieldCheck,
  Plus,
  FileText,
  Trash2,
  KeyRound,
  FileDown,
  CheckCircle2,
  Stethoscope,
  Activity,
  Pill,
  Calendar,
  Syringe,
  Sparkles,
} from 'lucide-react';

export interface MedicalRecordItem {
  id: string;
  title: string;
  category: string;
  recordDate: string;
  encryptedPayload: string;
  isEncrypted: boolean;
}

export const EncryptedVaultSection: React.FC<{
  language: Language;
  seniorMode: boolean;
  encryptionSalt: string;
  records: MedicalRecordItem[];
  onAddRecord: (rec: Omit<MedicalRecordItem, 'id'>) => Promise<void>;
  onDeleteRecord: (id: string) => Promise<void>;
  patientProfile?: PdfPatientProfile;
  vitals?: PdfVitalItem[];
  medications?: PdfMedicationItem[];
  appointments?: AppointmentItem[];
  vaccines?: PdfVaccineItem[];
}> = ({
  language,
  seniorMode,
  encryptionSalt,
  records,
  onAddRecord,
  onDeleteRecord,
  patientProfile = {
    displayName: 'Community Member',
    contactNumber: '+91 9823014567',
    age: 64,
    bloodGroup: 'O+',
  },
  vitals = [],
  medications = [],
  appointments = [],
  vaccines = [],
}) => {
  const [vaultPin, setVaultPin] = useState('1234');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Prescription');
  const [recordDate, setRecordDate] = useState('2026-09-27');
  const [plainNotes, setPlainNotes] = useState('');
  const [decryptedMap, setDecryptedMap] = useState<Record<string, string>>({});
  const [decryptError, setDecryptError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Doctor PDF Summary Generator States
  const [includeVitals, setIncludeVitals] = useState(true);
  const [includeMedications, setIncludeMedications] = useState(true);
  const [includeAppointments, setIncludeAppointments] = useState(true);
  const [includeVaccinations, setIncludeVaccinations] = useState(true);
  const [includeVaultRecords, setIncludeVaultRecords] = useState(true);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [lastDownloadedFile, setLastDownloadedFile] = useState<string | null>(null);

  const labels = {
    en: {
      heading: 'Zero-Knowledge Encrypted Medical Records Vault',
      subheading:
        'Your medical prescriptions, lab reports, and allergies are encrypted in your browser using AES-256-GCM before saving to the cloud.',
      pinLabel: 'Personal Encryption Passcode / PIN:',
      addTitle: 'Encrypt & Store New Medical Record',
      recordTitlePlaceholder: 'Record Title (e.g., Apollo Cardiology Discharge Summary)',
      notesPlaceholder:
        'Sensitive details: Doctor notes, dosage, HbA1c 6.2%, Blood Group, Drug Allergies...',
      encryptBtn: 'Encrypt with AES-256 & Save',
      decryptBtn: 'Unlock & Read',
      hideBtn: 'Lock Record',
      cipherLabel: 'Stored AES-GCM Ciphertext:',
      pdfCardBadge: 'DOCTOR-READY CLINICAL DOSSIER · CLIENT-SIDE PDF EXPORT',
      pdfCardTitle: 'Downloadable Doctor Health Summary (PDF)',
      pdfCardSubtitle:
        'Compile your daily vitals, blood sugar & sleep logs, active medication schedule, doctor appointments, immunizations, and unlocked vault records into a clean PDF report to share with your physician.',
      pdfSelectSections: 'Select Health Sections to Include in PDF:',
      optVitals: 'Daily Vitals, BP, Sugar & Sleep History',
      optMeds: 'Active Medication Regimen & Adherence',
      optAppts: 'Doctor Appointments & Consultations',
      optVaccines: 'Vaccination & Immunization Schedule',
      optVault: 'Decrypt & Attach AES-256 Vault Records (Uses PIN)',
      doctorNotesLabel: 'Questions or Current Symptoms for Attending Doctor (Optional):',
      doctorNotesPlaceholder:
        'e.g., Fasting sugar slightly elevated this week; please advise if Metformin evening dose needs adjustment...',
      generatePdfBtn: 'Generate & Download Doctor PDF Summary',
      generatingPdfText: 'Building Clinical PDF...',
      unlockAllBtn: 'Unlock All Records with PIN',
      pdfSuccessPrefix: 'Downloaded Doctor Summary PDF:',
    },
    hi: {
      heading: 'सुरक्षित और एन्क्रिप्टेड मेडिकल रिकॉर्ड वॉल्ट (AES-256)',
      subheading:
        'आपकी पर्चियां, लैब रिपोर्ट और एलर्जी की जानकारी क्लाउड में सेव होने से पहले आपके पासकोड से एन्क्रिप्ट की जाती है।',
      pinLabel: 'आपका गोपनीय सुरक्षा पिन (PIN):',
      addTitle: 'नया मेडिकल रिकॉर्ड सुरक्षित करें',
      recordTitlePlaceholder: 'रिकॉर्ड का नाम (जैसे: अपोलो अस्पताल ब्लड टेस्ट रिपोर्ट)',
      notesPlaceholder:
        'मेडिकल विवरण लिखें: दवाइयां, शुगर रिपोर्ट, एलर्जी या डॉक्टर की सलाह...',
      encryptBtn: 'एन्क्रिप्ट करें और सेव करें',
      decryptBtn: 'पिन से अनलॉक करें',
      hideBtn: 'वापस लॉक करें',
      cipherLabel: 'सुरक्षित एन्क्रिप्टेड डेटा:',
      pdfCardBadge: 'डॉक्टर परामर्श रिपोर्ट · पीडीएफ डाउनलोड (PDF)',
      pdfCardTitle: 'डॉक्टर के लिए संपूर्ण स्वास्थ्य सारांश रिपोर्ट (Download PDF)',
      pdfCardSubtitle:
        'अपने डॉक्टर को दिखाने के लिए बीपी, शुगर, नींद के लॉग, दवाइयों का समय, अपॉइंटमेंट, टीकाकरण और मेडिकल वॉल्ट रिकॉर्ड्स की एक व्यवस्थित PDF फाइल डाउनलोड करें।',
      pdfSelectSections: 'PDF रिपोर्ट में शामिल करने के लिए विवरण चुनें:',
      optVitals: 'दैनिक बीपी, शुगर, पल्स और नींद का इतिहास',
      optMeds: 'दैनिक दवाइयां और खुराक अनुपालन (Medications)',
      optAppts: 'डॉक्टर अपॉइंटमेंट और परामर्श इतिहास',
      optVaccines: 'टीकाकरण (Vaccination) विवरण',
      optVault: 'मेडिकल वॉल्ट के अनलॉक किए गए रिकॉर्ड्स (PIN द्वारा)',
      doctorNotesLabel: 'डॉक्टर के लिए विशेष नोट या वर्तमान समस्या (वैकल्पिक):',
      doctorNotesPlaceholder:
        'उदा. सुबह उठने पर हल्का चक्कर महसूस होना; कृपया बीपी की दवाई की जांच करें...',
      generatePdfBtn: 'डॉक्टर स्वास्थ्य सारांश PDF डाउनलोड करें',
      generatingPdfText: 'PDF रिपोर्ट तैयार हो रही है...',
      unlockAllBtn: 'पिन से सभी रिकॉर्ड अनलॉक करें',
      pdfSuccessPrefix: 'स्वास्थ्य सारांश PDF सफलतापूर्वक डाउनलोड हुई:',
    },
    mr: {
      heading: 'सुरक्षित एन्क्रिप्टेड मेडिकल रेकॉर्ड व्हॉल्ट (AES-256)',
      subheading:
        'तुमचे डॉक्टरांचे प्रिस्क्रिप्शन, रक्त तपासणी रिपोर्ट आणि ॲलर्जीची माहिती तुमच्या पासकोडने एन्क्रिप्ट करून सुरक्षित ठेवली जाते.',
      pinLabel: 'तुमचा गोपनीय सुरक्षा पिन (PIN):',
      addTitle: 'नवीन मेडिकल रेकॉर्ड सुरक्षित करा',
      recordTitlePlaceholder: 'रेकॉर्डचे नाव (उदा. सह्याद्री हॉस्पिटल कार्डिओलॉजी रिपोर्ट)',
      notesPlaceholder:
        'वैद्यकीय तपशील लिहा: गोळ्यांचे नाव, HbA1c रिपोर्ट, रक्तगट किंवा औषधांची ॲलर्जी...',
      encryptBtn: 'AES-256 एन्क्रिप्ट आणि सेव्ह करा',
      decryptBtn: 'अनलॉक करून वाचा',
      hideBtn: 'पुन्हा लॉक करा',
      cipherLabel: 'साठवलेला एन्क्रिप्टेड मजकूर:',
      pdfCardBadge: 'डॉक्टरांसाठी आरोग्य अहवाल · PDF डाउनलोड सुविधा',
      pdfCardTitle: 'डॉक्टरांना दाखवण्यासाठी संपूर्ण आरोग्य सारांश (Download PDF)',
      pdfCardSubtitle:
        'तुमच्या डॉक्टरांशी शेअर करण्यासाठी दैनंदिन रक्तदाब (BP), शुगर, झोप, सुरू असलेली औषधे, डॉक्टरांच्या अपॉइंटमेंट्स, लसीकरण आणि मेडिकल व्हॉल्टमधील रिपोर्ट्सची एकत्रित PDF फाईल डाउनलोड करा.',
      pdfSelectSections: 'PDF अहवालात समाविष्ट करण्यासाठी विभाग निवडा:',
      optVitals: 'दैनंदिन बीपी, शुगर, पल्स आणि झोपेच्या नोंदी',
      optMeds: 'सुरू असलेली औषधे आणि वेळापत्रक (Medication History)',
      optAppts: 'डॉक्टरांच्या अपॉइंटमेंट्स आणि सल्ला इतिहास',
      optVaccines: 'लसीकरण (Vaccination) तपशील',
      optVault: 'मेडिकल व्हॉल्टमधील अनलॉक केलेले रिपोर्ट्स (PIN द्वारे)',
      doctorNotesLabel: 'डॉक्टरांसाठी तुमचे प्रश्न किंवा सध्याची लक्षणे (पर्यायी):',
      doctorNotesPlaceholder:
        'उदा. गेल्या काही दिवसांपासून सकाळी फास्टिंग शुगर थोडी जास्त येत आहे; कृपया गोळीचा डोस तपासावा...',
      generatePdfBtn: 'डॉक्टर आरोग्य सारांश PDF डाउनलोड करा',
      generatingPdfText: 'PDF अहवाल तयार होत आहे...',
      unlockAllBtn: 'पिनने सर्व रेकॉर्ड अनलॉक करा',
      pdfSuccessPrefix: 'आरोग्य सारांश PDF फाईल डाउनलोड झाली:',
    },
  }[language];

  const handleSaveEncrypted = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !plainNotes.trim() || !vaultPin.trim()) return;
    setSaving(true);
    setDecryptError(null);

    try {
      const cipher = await encryptMedicalData(plainNotes.trim(), vaultPin.trim(), encryptionSalt);
      await onAddRecord({
        title: title.trim(),
        category,
        recordDate,
        encryptedPayload: cipher,
        isEncrypted: true,
      });
      setTitle('');
      setPlainNotes('');
    } catch (err) {
      setDecryptError(err instanceof Error ? err.message : 'Encryption failed');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleDecrypt = async (rec: MedicalRecordItem) => {
    setDecryptError(null);
    if (decryptedMap[rec.id]) {
      const next = { ...decryptedMap };
      delete next[rec.id];
      setDecryptedMap(next);
      return;
    }

    try {
      const plain = await decryptMedicalData(rec.encryptedPayload, vaultPin.trim(), encryptionSalt);
      setDecryptedMap((prev) => ({ ...prev, [rec.id]: plain }));
    } catch {
      setDecryptError(
        language === 'mr'
          ? 'चुकीचा सुरक्षा पिन! कृपया योग्य पिन टाका.'
          : language === 'hi'
          ? 'गलत सुरक्षा पिन! कृपया सही पिन दर्ज करें।'
          : 'Incorrect Encryption PIN! Could not decrypt this medical record.'
      );
    }
  };

  const handleUnlockAllRecords = async () => {
    setDecryptError(null);
    const unlocked: Record<string, string> = { ...decryptedMap };
    for (const rec of records) {
      if (!unlocked[rec.id]) {
        try {
          unlocked[rec.id] = await decryptMedicalData(
            rec.encryptedPayload,
            vaultPin.trim(),
            encryptionSalt
          );
        } catch {
          // Skip records that cannot be decrypted with current PIN
        }
      }
    }
    setDecryptedMap(unlocked);
  };

  const handleDownloadDoctorPdf = async () => {
    setGeneratingPdf(true);
    setDecryptError(null);

    try {
      const decryptedVaultRecords: Array<{
        record: MedicalRecordItem;
        plainText: string;
      }> = [];

      if (includeVaultRecords) {
        for (const rec of records) {
          if (decryptedMap[rec.id]) {
            decryptedVaultRecords.push({
              record: rec,
              plainText: decryptedMap[rec.id],
            });
          } else if (vaultPin.trim()) {
            try {
              const plain = await decryptMedicalData(
                rec.encryptedPayload,
                vaultPin.trim(),
                encryptionSalt
              );
              decryptedVaultRecords.push({
                record: rec,
                plainText: plain,
              });
              setDecryptedMap((prev) => ({ ...prev, [rec.id]: plain }));
            } catch {
              // If user added a record with a different PIN, skip gracefully
            }
          }
        }
      }

      const fileName = generateDoctorHealthSummaryPdf({
        profile: patientProfile,
        vitals,
        medications,
        appointments,
        vaccines,
        decryptedVaultRecords,
        options: {
          includeVitals,
          includeMedications,
          includeAppointments,
          includeVaccinations,
          includeVaultRecords,
          doctorNotes,
        },
      });

      setLastDownloadedFile(fileName);
    } catch (err) {
      setDecryptError(
        err instanceof Error ? err.message : 'Unable to generate PDF summary.'
      );
    } finally {
      setGeneratingPdf(false);
    }
  };

  const latestVital = vitals[0];
  const medsTakenCount = medications.filter((m) => m.takenToday).length;

  return (
    <div className="space-y-6">
      {/* Top Security Bar */}
      <div className="p-6 bg-white border border-slate-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-teal-800 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>PBKDF2 SHA-256 + AES-GCM 256-BIT PRIVACY</span>
          </div>
          <h2 className={`font-semibold text-slate-900 ${seniorMode ? 'text-2xl' : 'text-xl'}`}>
            {labels.heading}
          </h2>
          <p className={`text-slate-600 ${seniorMode ? 'text-base' : 'text-sm'}`}>
            {labels.subheading}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-3 rounded-xl shrink-0">
          <KeyRound className="w-4 h-4 text-teal-700" />
          <label className="text-xs font-medium text-slate-700">{labels.pinLabel}</label>
          <input
            type="password"
            value={vaultPin}
            onChange={(e) => setVaultPin(e.target.value)}
            maxLength={32}
            className="w-24 rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm font-mono tabular-nums bg-white text-slate-900"
          />
        </div>
      </div>

      {/* DOCTOR-READY DOWNLOADABLE PDF HEALTH SUMMARY PANEL */}
      <div className="p-6 bg-white border-2 border-teal-700/80 rounded-xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-teal-800 text-xs font-semibold">
              <Stethoscope className="w-4 h-4 text-teal-700" />
              <span>{labels.pdfCardBadge}</span>
            </div>
            <h3 className={`font-semibold text-slate-900 ${seniorMode ? 'text-2xl' : 'text-lg'}`}>
              {labels.pdfCardTitle}
            </h3>
            <p className={`text-slate-600 max-w-[75ch] ${seniorMode ? 'text-base' : 'text-sm'}`}>
              {labels.pdfCardSubtitle}
            </p>
          </div>

          {/* Live Clinical Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
            <div className="px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200">
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <Activity className="w-3 h-3 text-teal-700" />
                <span>Vitals Logs</span>
              </p>
              <p className="font-mono font-semibold text-sm text-slate-900 tabular-nums mt-0.5">
                {vitals.length} ({latestVital ? `${latestVital.systolic}/${latestVital.diastolic}` : '-'})
              </p>
            </div>

            <div className="px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200">
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <Pill className="w-3 h-3 text-teal-700" />
                <span>Medications</span>
              </p>
              <p className="font-mono font-semibold text-sm text-slate-900 tabular-nums mt-0.5">
                {medsTakenCount}/{medications.length} Taken
              </p>
            </div>

            <div className="px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200">
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-teal-700" />
                <span>Appointments</span>
              </p>
              <p className="font-mono font-semibold text-sm text-slate-900 tabular-nums mt-0.5">
                {appointments.length} Visits
              </p>
            </div>

            <div className="px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200">
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <Syringe className="w-3 h-3 text-teal-700" />
                <span>Vaccines</span>
              </p>
              <p className="font-mono font-semibold text-sm text-slate-900 tabular-nums mt-0.5">
                {vaccines.length} Doses
              </p>
            </div>
          </div>
        </div>

        {/* Section Checkboxes + Doctor Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-7 space-y-2.5">
            <p className="text-xs font-semibold text-slate-700">
              {labels.pdfSelectSections}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 text-xs font-medium text-slate-800 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={includeVitals}
                  onChange={(e) => setIncludeVitals(e.target.checked)}
                  className="rounded border-slate-300 text-teal-700 focus:ring-teal-600"
                />
                <span>{labels.optVitals} ({vitals.length})</span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 text-xs font-medium text-slate-800 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={includeMedications}
                  onChange={(e) => setIncludeMedications(e.target.checked)}
                  className="rounded border-slate-300 text-teal-700 focus:ring-teal-600"
                />
                <span>{labels.optMeds} ({medications.length})</span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 text-xs font-medium text-slate-800 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={includeAppointments}
                  onChange={(e) => setIncludeAppointments(e.target.checked)}
                  className="rounded border-slate-300 text-teal-700 focus:ring-teal-600"
                />
                <span>{labels.optAppts} ({appointments.length})</span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 text-xs font-medium text-slate-800 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={includeVaccinations}
                  onChange={(e) => setIncludeVaccinations(e.target.checked)}
                  className="rounded border-slate-300 text-teal-700 focus:ring-teal-600"
                />
                <span>{labels.optVaccines} ({vaccines.length})</span>
              </label>

              <label className="sm:col-span-2 flex items-center gap-2.5 p-2.5 rounded-lg border border-teal-200 bg-teal-50/50 text-xs font-medium text-teal-950 cursor-pointer hover:bg-teal-50">
                <input
                  type="checkbox"
                  checked={includeVaultRecords}
                  onChange={(e) => setIncludeVaultRecords(e.target.checked)}
                  className="rounded border-teal-400 text-teal-700 focus:ring-teal-600"
                />
                <span>{labels.optVault} ({records.length})</span>
              </label>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {labels.doctorNotesLabel}
              </label>
              <textarea
                rows={3}
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                placeholder={labels.doctorNotesPlaceholder}
                maxLength={350}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-700"
              />
            </div>

            <button
              type="button"
              onClick={handleDownloadDoctorPdf}
              disabled={generatingPdf}
              className="w-full py-3 px-4 rounded-xl bg-teal-700 text-white font-semibold text-sm hover:bg-teal-800 transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <FileDown className="w-4 h-4" />
              <span>
                {generatingPdf ? labels.generatingPdfText : labels.generatePdfBtn}
              </span>
            </button>
          </div>
        </div>

        {lastDownloadedFile && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-medium flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                {labels.pdfSuccessPrefix}{' '}
                <strong className="font-mono">{lastDownloadedFile}</strong>
              </span>
            </div>
            <span className="text-[11px] text-emerald-800 hidden sm:inline">
              Ready to print or share on WhatsApp / Email with your doctor
            </span>
          </div>
        )}
      </div>

      {decryptError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-sm">
          {decryptError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form to Encrypt & Add Record */}
        <div className="lg:col-span-5 p-5 bg-white border border-slate-200 rounded-xl space-y-4">
          <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
            <Plus className="w-4 h-4 text-teal-700" />
            <span>{labels.addTitle}</span>
          </h3>

          <form onSubmit={handleSaveEncrypted} className="space-y-3.5">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={labels.recordTitlePlaceholder}
              maxLength={110}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
              >
                <option value="Prescription">Prescription</option>
                <option value="Lab Report">Lab Report (Blood/ECG)</option>
                <option value="Discharge Summary">Discharge Summary</option>
                <option value="Allergy & History">Allergy & Chronic History</option>
              </select>

              <input
                type="date"
                value={recordDate}
                onChange={(e) => setRecordDate(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono tabular-nums"
                required
              />
            </div>

            <textarea
              rows={4}
              value={plainNotes}
              onChange={(e) => setPlainNotes(e.target.value)}
              placeholder={labels.notesPlaceholder}
              maxLength={1500}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
              required
            />

            <button
              type="submit"
              disabled={saving}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-teal-700 text-white text-sm font-semibold hover:bg-teal-800 transition-colors cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>{labels.encryptBtn}</span>
            </button>
          </form>
        </div>

        {/* Stored Encrypted Records List */}
        <div className="lg:col-span-7 p-5 bg-white border border-slate-200 rounded-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-700" />
              <span>Encrypted Medical Records ({records.length})</span>
            </h3>

            {records.length > 0 && (
              <button
                type="button"
                onClick={handleUnlockAllRecords}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal-200 bg-teal-50 text-teal-900 text-xs font-semibold hover:bg-teal-100 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                <span>{labels.unlockAllBtn}</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {records.map((rec) => {
              const isUnlocked = Boolean(decryptedMap[rec.id]);
              return (
                <div
                  key={rec.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className={`font-semibold text-slate-900 ${seniorMode ? 'text-lg' : 'text-sm'}`}>
                        {rec.title}
                      </h4>
                      <p className="text-xs text-slate-500 font-mono tabular-nums mt-0.5">
                        {rec.category} · {rec.recordDate} · AES-256-GCM
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleDecrypt(rec)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          isUnlocked
                            ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                            : 'bg-teal-700 text-white hover:bg-teal-800'
                        }`}
                      >
                        {isUnlocked ? (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>{labels.hideBtn}</span>
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3.5 h-3.5" />
                            <span>{labels.decryptBtn}</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteRecord(rec.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {isUnlocked ? (
                    <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 text-sm whitespace-pre-wrap">
                      {decryptedMap[rec.id]}
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-lg bg-slate-900 text-slate-300 font-mono text-[11px] break-all">
                      <span className="text-teal-400 mr-1.5">{labels.cipherLabel}</span>
                      {rec.encryptedPayload.slice(0, 96)}...
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
